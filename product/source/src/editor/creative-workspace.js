const WORKSPACE_STAGES = Object.freeze([
  ['reference', 'Reference'],
  ['edit', 'Edit'],
  ['compose', 'Compose'],
  ['chat', 'CHAT'],
  ['revision', 'Revision']
]);

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const text = value => typeof value === 'string' && value.trim() ? value.trim() : null;

function selectionItems(app) {
  const found = typeof app?.selectedObjects === 'function' ? app.selectedObjects() : [];
  return found.map(item => ({
    pageId: app.page?.()?.id || null,
    layerId: item.layer?.id || null,
    objectId: item.object?.id || null,
    type: item.object?.type || 'unknown',
    name: item.object?.name || null
  }));
}

function objectProvenance(object) {
  const metadata = object?.metadata;
  if (!metadata || typeof metadata !== 'object') return null;
  if (metadata.extraction && typeof metadata.extraction === 'object') {
    return {
      kind: 'extraction',
      batchId: metadata.extraction.batchId || null,
      referenceObjectId: metadata.extraction.referenceObjectId || null,
      sourceName: metadata.extraction.source?.name || metadata.extraction.sourceName || null
    };
  }
  if (metadata.extractionReference && typeof metadata.extractionReference === 'object') {
    return {
      kind: 'extraction-reference',
      sourceName: metadata.extractionReference.source?.name || null,
      sourceSha256: metadata.extractionReference.source?.sha256 || null
    };
  }
  if (metadata.source && typeof metadata.source === 'object') {
    return {
      kind: 'source',
      id: metadata.source.id || null,
      name: metadata.source.name || null,
      type: metadata.source.type || null
    };
  }
  if (metadata.composition && typeof metadata.composition === 'object') {
    return {
      kind: 'composition',
      sourceObjectId: metadata.composition.sourceObjectId || null,
      duplicatedFromObjectId: metadata.composition.duplicatedFromObjectId || null
    };
  }
  return null;
}

function selectedProvenance(app) {
  const found = typeof app?.selectedObjects === 'function' ? app.selectedObjects() : [];
  return found.map(item => ({
    objectId: item.object?.id || null,
    provenance: objectProvenance(item.object)
  })).filter(item => item.provenance);
}

function proposalSummary(app, proposalId) {
  if (!proposalId || !app?.chatBoundedEdit?.getProposal) return null;
  try {
    const proposal = app.chatBoundedEdit.getProposal(proposalId);
    if (!proposal) return null;
    return {
      proposalId: proposal.proposalId,
      state: proposal.state,
      operation: proposal.task?.operation || null,
      targets: clone(proposal.task?.targets || []),
      revisionId: proposal.revisionId ?? null
    };
  } catch {
    return null;
  }
}

function planSummary(app, planId) {
  if (!planId || !app?.chatCreativePlan?.getPlan) return null;
  try {
    const plan = app.chatCreativePlan.getPlan(planId);
    if (!plan) return null;
    return {
      planId: plan.planId,
      status: plan.status,
      intentSummary: plan.intentSummary,
      source: clone(plan.source),
      steps: clone(plan.steps || []),
      validation: clone(plan.validation || null),
      stepResults: clone(plan.stepResults || []),
      result: clone(plan.result || null)
    };
  } catch {
    return null;
  }
}

export function buildCreativeWorkspaceState(app, {
  stage = 'reference',
  activeProposalId = null,
  activePlanId = null,
  status = null
} = {}) {
  const document = app?.doc || null;
  const page = typeof app?.page === 'function' ? app.page() : null;
  const selected = selectionItems(app);
  const revisionId = document
    ? (app?.revisions?.revisionIdFor?.(document.id) ?? null)
    : null;
  return {
    schema: 'INK-CREATIVE-WORKSPACE-STATE',
    version: 1,
    document: document ? {
      id: document.id || null,
      title: document.title || null,
      formatVersion: document.formatVersion ?? null
    } : null,
    page: page ? {
      id: page.id || null,
      name: page.name || null,
      activeLayerId: page.activeLayerId || null
    } : null,
    stage,
    tool: app?.tool || null,
    context: app?.pathEditing?.active ? 'path-edit' : (app?.strokeEdit ? 'stroke-edit' : (app?.tool || null)),
    selection: {
      count: selected.length,
      items: selected
    },
    provenance: selectedProvenance(app),
    revision: {
      revisionId,
      diagnostics: clone(app?.revisions?.diagnostics?.() || null)
    },
    chat: {
      proposal: proposalSummary(app, activeProposalId),
      plan: planSummary(app, activePlanId)
    },
    history: {
      pending: Boolean(app?.history?.pending),
      undoCount: app?.history?.undoStack?.length || 0,
      redoCount: app?.history?.redoStack?.length || 0
    },
    controllers: {
      extraction: Boolean(app?.extraction),
      pathEditing: Boolean(app?.pathEditing),
      expressiveStroke: Boolean(app?.pathStrokeAppearance),
      repaintMaterial: Boolean(app?.pathRepaintMaterial),
      chatBoundedEdit: Boolean(app?.chatBoundedEdit),
      chatCreativePlan: Boolean(app?.chatCreativePlan),
      revisions: Boolean(app?.revisions)
    },
    status: status ? clone(status) : null,
    staticBrowserLocal: true,
    remoteServiceRequired: false
  };
}

function setText(root, selector, value, fallback = '—') {
  const node = root.querySelector(selector);
  if (node) node.textContent = value == null || value === '' ? fallback : String(value);
}

function provenanceLabel(items) {
  if (!items.length) return '—';
  return items.map(item => {
    const p = item.provenance;
    if (p.kind === 'extraction') return `${p.sourceName || 'reference'} · ${p.batchId || 'batch'}`;
    if (p.kind === 'extraction-reference') return p.sourceName || 'reference';
    if (p.kind === 'composition') return `composition · ${p.sourceObjectId || item.objectId}`;
    return p.name || p.id || p.kind;
  }).join(' / ');
}

function selectionLabel(selection) {
  if (!selection.count) return '未選取';
  return selection.items.map(item => `${item.type} · ${item.objectId}`).join(' / ');
}

export class CreativeWorkspaceController {
  constructor(app) {
    this.app = app;
    this.stage = 'reference';
    this.activeProposalId = null;
    this.activePlanId = null;
    this.status = { level: 'ready', code: 'WORKSPACE_READY', message: 'Creative workspace ready' };
    this.open = false;
    this.root = null;
    this.toggle = null;
    this.extractionAbort = null;
    this.lastReference = null;
    this.lastExtraction = null;
    this.lastStructure = null;
    this.approvalToken = null;
    this.lastChatInspection = null;
    this.lastChatResult = null;
    this.taskSequence = 0;
    this.planSequence = 0;
    this.draftPlanSteps = [];
    this.planApprovalToken = null;
    this.lastPlanResult = null;
    this.groundedToolSequence = 0;
    this.lastGroundedContext = null;
    this.lastCreativeMemoryContext = null;
    this.lastResearchCreationContext = null;
    this.lastRevisionComparison = null;
    this.conversationMessages = [];
    this.conversationSessionId = null;
    this.conversationClient = null;
    this.conversationPending = null;
    this.lastConversationContext = null;
    this.lastTransmissionPreview = null;
    this.conversationBusy = false;
    this.revisionItems = [];
    this.lastRevisionResult = null;
  }

  mount() {
    if (this.root || typeof document === 'undefined') return this;
    const appRoot = document.querySelector('#app');
    if (!appRoot) return this;

    this.toggle = document.createElement('button');
    this.toggle.id = 'creativeWorkspaceToggle';
    this.toggle.type = 'button';
    this.toggle.className = 'icon-button creative-workspace-toggle';
    this.toggle.title = 'Creative Workspace';
    this.toggle.setAttribute('aria-label', 'Creative Workspace');
    this.toggle.setAttribute('aria-expanded', 'false');
    this.toggle.textContent = 'CW';
    const anchor = document.querySelector('#inspectorToggle');
    anchor?.parentElement?.insertBefore(this.toggle, anchor);

    const root = document.createElement('aside');
    root.id = 'creativeWorkspace';
    root.className = 'creative-workspace-panel elevated-panel';
    root.setAttribute('aria-label', 'INK Creative Workspace');
    root.setAttribute('aria-hidden', 'true');
    root.innerHTML = `
      <div class="creative-workspace-head">
        <div><span class="eyebrow">INK WEB · CREATIVE LOOP</span><strong>Creative Workspace</strong></div>
        <button type="button" class="mini-button" data-workspace-action="close" aria-label="關閉 Creative Workspace">×</button>
      </div>
      <div class="creative-workspace-state" aria-label="Workspace state">
        <div><span>Document</span><strong data-workspace-value="document">—</strong></div>
        <div><span>Page</span><strong data-workspace-value="page">—</strong></div>
        <div><span>Context</span><strong data-workspace-value="context">—</strong></div>
        <div><span>Revision</span><strong data-workspace-value="revision">—</strong></div>
        <div class="wide"><span>Selection</span><strong data-workspace-value="selection">未選取</strong></div>
        <div class="wide"><span>Source</span><strong data-workspace-value="provenance">—</strong></div>
        <div class="wide"><span>CHAT</span><strong data-workspace-value="chat">—</strong></div>
      </div>
      <div class="creative-workspace-tabs" role="tablist">
        ${WORKSPACE_STAGES.map(([id, label]) => `<button type="button" data-workspace-stage="${id}" role="tab">${label}</button>`).join('')}
      </div>
      <div class="creative-workspace-body">
        <section data-workspace-pane="reference">
          <strong>Reference → Direct Extraction → editable Path</strong>
          <label class="creative-workspace-field"><span>Reference image</span><input type="file" data-workspace-input="reference-file" accept="image/png,image/jpeg,image/webp"></label>
          <label class="creative-workspace-field"><span>Threshold</span><input type="number" data-workspace-input="threshold" value="128" min="0" max="255"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="extract">Direct Extraction</button><button type="button" data-workspace-action="cancel-extract" disabled>Cancel</button></div>
          <label class="creative-workspace-field"><span>Reference overlay</span><input type="range" data-workspace-input="overlay" min="0" max="1" step="0.1" value="0.5"></label>
          <output data-workspace-output="extraction">No extraction in this session.</output>
          <details class="creative-structure-option">
            <summary>Structure-Aware <span>OPTIONAL</span></summary>
            <p>Direct Extraction remains the default. Radial reconstruction reuses the accepted multi-Path prototype + Repeat authority.</p>
            <label class="creative-workspace-field"><span>Radial count</span><input type="number" data-workspace-input="structure-count" min="2" max="48" step="1" value="6"></label>
            <button type="button" class="creative-workspace-primary" data-workspace-action="structure-reconstruct">Analyze + reconstruct</button>
            <output data-workspace-output="structure">Not executed.</output>
          </details>
          <details class="creative-structure-option workstation-capability-card">
            <summary>Research → Creation <span>READ ONLY</span></summary>
            <p>Local evidence, derived visual principles, and creative constraints. No remote fetch and no automatic Creative Memory write.</p>
            <button type="button" data-workspace-action="research-context-refresh">Refresh research context</button>
            <output data-workspace-output="research-context">Research advisory not inspected.</output>
          </details>
        </section>
        <section data-workspace-pane="edit" hidden>
          <strong>Path Edit + Expressive Stroke</strong>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="enter-path-edit">Enter Path Edit</button><button type="button" data-workspace-action="exit-path-edit">Exit</button></div>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="simplify-path">Simplify</button><button type="button" data-workspace-action="refine-path">Refine</button></div>
          <label class="creative-workspace-field"><span>Stroke color</span><input type="color" data-workspace-input="stroke-color" value="#202020"></label>
          <label class="creative-workspace-field"><span>Base width</span><input type="number" data-workspace-input="stroke-width" min="0.5" max="128" step="0.5" value="2"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="apply-expressive-stroke">Apply expressive</button><button type="button" data-workspace-action="clear-expressive-stroke">Clear expressive</button></div>
          <output data-workspace-output="edit">Select one editable Path.</output>
        </section>
        <section data-workspace-pane="compose" hidden>
          <strong>Compose → Repaint / Material</strong>
          <div class="creative-workspace-action-grid">
            <button type="button" data-workspace-action="duplicate">Duplicate</button>
            <button type="button" data-workspace-action="group">Group</button>
            <button type="button" data-workspace-action="frame">Frame</button>
            <button type="button" data-workspace-action="front">Front</button>
            <button type="button" data-workspace-action="back">Back</button>
          </div>
          <label class="creative-workspace-field"><span>Fill</span><input type="color" data-workspace-input="fill" value="#f0d9c8"></label>
          <button type="button" class="creative-workspace-primary" data-workspace-action="repaint">Repaint selected Path</button>
          <label class="creative-workspace-field"><span>Material ID</span><input type="text" data-workspace-input="material-id" value="workspace-material"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="apply-material">Apply material</button><button type="button" data-workspace-action="clear-material">Clear material</button></div>
          <output data-workspace-output="compose">Composition commands preserve structured objects.</output>
          <details class="creative-structure-option workstation-capability-card">
            <summary>Parametric Structure <span>EXISTING AUTHORITY</span></summary>
            <p>Selected Repeat status is shown here. Repeat/Transform mutation remains on the existing Core controls; CHAT accepts explicit deterministic structure descriptors.</p>
            <output data-workspace-output="parametric-context">Select a Repeat to inspect deterministic structure state.</output>
          </details>
        </section>
        <section data-workspace-pane="chat" hidden>
          <strong>Natural-language CHAT</strong>
          <div class="creative-chat-runtime">
            <span data-workspace-value="chat-runtime">LOCAL · manual-json</span>
            <button type="button" data-workspace-action="chat-conversation-inspect">Inspect context</button>
          </div>
          <div class="creative-chat-transcript" data-workspace-output="chat-conversation" aria-live="polite"></div>
          <label class="creative-workspace-field creative-workspace-prompt"><span>Prompt</span><textarea data-workspace-input="chat-prompt" rows="3" placeholder="Discuss the current artwork…"></textarea></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="chat-conversation-send">Send</button><button type="button" data-workspace-action="chat-conversation-clear">Clear</button></div>
          <button type="button" class="creative-workspace-primary" data-workspace-action="chat-conversation-transmit" hidden>Approve external transmission</button>
          <output data-workspace-output="chat-context">Context not inspected.</output>
          <details class="creative-structure-option workstation-capability-card" open>
            <summary>Grounded Core context <span>READ ONLY</span></summary>
            <div class="creative-workspace-actions"><button type="button" data-workspace-action="grounded-context-refresh">Grounded context</button><button type="button" data-workspace-action="creative-memory-refresh">Creative Memory</button><button type="button" data-workspace-action="research-context-refresh">Research</button></div>
            <output data-workspace-output="grounded-context">Grounded context not inspected.</output>
            <output data-workspace-output="creative-memory-context">Creative Memory advisory not inspected.</output>
          </details>
          <hr>
          <strong>Bounded mutation</strong>
          <label class="creative-workspace-field"><span>Operation</span>
            <select data-workspace-input="chat-operation">
              <option value="path.repaint.v1">Repaint Path</option>
              <option value="object.translate.v1">Translate object</option>
              <option value="path.simplify.v1">Simplify Path</option>
              <option value="path.refine.v1">Refine Path</option>
              <option value="path.material.apply.v1">Apply material</option>
              <option value="path.material.remove.v1">Remove material</option>
            </select>
          </label>
          <label class="creative-workspace-field"><span>Color</span><input type="color" data-workspace-input="chat-color" value="#d7a78f"></label>
          <label class="creative-workspace-field"><span>ΔX / ΔY</span><span class="creative-workspace-inline"><input type="number" data-workspace-input="chat-dx" value="12"><input type="number" data-workspace-input="chat-dy" value="0"></span></label>
          <label class="creative-workspace-field"><span>Material ID</span><input type="text" data-workspace-input="chat-material-id" value="workspace-material"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="chat-inspect">Inspect</button><button type="button" data-workspace-action="chat-propose">Propose</button></div>
          <div class="creative-workspace-action-grid">
            <button type="button" data-workspace-action="chat-approve">Approve</button>
            <button type="button" data-workspace-action="chat-reject">Reject</button>
            <button type="button" data-workspace-action="chat-execute">Execute</button>
          </div>
          <output data-workspace-output="chat">No proposal.</output>
          <hr>
          <strong>Multi-step creative plan</strong>
          <label class="creative-workspace-field"><span>Intent</span><input type="text" data-workspace-input="chat-plan-intent" value="Refine selected artwork"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="chat-plan-add-step">Add current step</button><button type="button" data-workspace-action="chat-plan-clear">Clear steps</button></div>
          <button type="button" class="creative-workspace-primary" data-workspace-action="chat-plan-propose">Propose plan</button>
          <div class="creative-workspace-action-grid">
            <button type="button" data-workspace-action="chat-plan-approve">Approve plan</button>
            <button type="button" data-workspace-action="chat-plan-reject">Reject plan</button>
            <button type="button" data-workspace-action="chat-plan-execute">Execute plan</button>
          </div>
          <pre data-workspace-output="chat-plan">No plan. Add at least two ordered steps.</pre>
        </section>
        <section data-workspace-pane="revision" hidden>
          <strong>Revision capture / restore</strong>
          <label class="creative-workspace-field"><span>Label</span><input type="text" data-workspace-input="revision-label" value="Workspace checkpoint"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="revision-capture">Capture</button><button type="button" data-workspace-action="revision-list">Refresh list</button></div>
          <label class="creative-workspace-field"><span>Revision</span><select data-workspace-input="revision-id"><option value="">No revisions</option></select></label>
          <button type="button" class="creative-workspace-primary" data-workspace-action="revision-restore">Restore selected Revision</button>
          <div class="creative-workspace-actions"><select data-workspace-input="revision-compare-mode" aria-label="Revision comparison mode"><option value="structural">Structural</option><option value="side-by-side">Side by side</option><option value="overlay">Overlay</option><option value="wipe">Wipe</option><option value="difference">Difference</option></select><button type="button" data-workspace-action="revision-compare">Compare with current</button></div>
          <output data-workspace-output="revision">Current revision: none</output>
          <output data-workspace-output="revision-compare">Comparison not executed.</output>
          <output data-workspace-output="revision-provenance">Provenance not inspected.</output>
        </section>
      </div>
      <div class="creative-workspace-status" data-workspace-value="status" role="status">Creative workspace ready</div>
    `;
    appRoot.append(root);
    this.root = root;

    this.toggle.addEventListener('click', () => this.setOpen(!this.open));
    root.addEventListener('click', event => {
      const close = event.target.closest('[data-workspace-action="close"]');
      if (close) {
        this.setOpen(false);
        return;
      }
      const action = event.target.closest('[data-workspace-action]');
      if (action && action.dataset.workspaceAction !== 'close') {
        void this.handleAction(action.dataset.workspaceAction);
        return;
      }
      const tab = event.target.closest('[data-workspace-stage]');
      if (tab) this.setStage(tab.dataset.workspaceStage);
    });
    root.addEventListener('change', event => {
      if (event.target.matches('[data-workspace-input="overlay"]')) {
        this.changeOverlay(Number(event.target.value));
      }
    });
    this.mountSelectionCapabilityCard();
    this.setStage(this.stage);
    this.refresh();
    return this;
  }

  mountSelectionCapabilityCard() {
    const selectionControls = document.querySelector('#selectionControls');
    if (!selectionControls || document.querySelector('#workstationSelectionCapabilities')) return;
    const card = document.createElement('div');
    card.id = 'workstationSelectionCapabilities';
    card.className = 'property-card workstation-capability-card';
    card.innerHTML = '<div class="subpanel-title"><strong>Grounded selection</strong><span>AI / CORE · READ ONLY</span></div><p data-workstation-output="selection-capability">Select an object to inspect Document Bridge and Semantic Region grounding.</p><button type="button" class="wide-button compact-button" data-workstation-action="grounded-selection-refresh">Inspect grounded selection</button>';
    selectionControls.append(card);
    card.querySelector('[data-workstation-action="grounded-selection-refresh"]')?.addEventListener('click', () => {
      void this.runCapabilityAction('grounded-context-refresh');
    });
  }

  async callGroundedTool(name, args = {}) {
    const runtime = this.conversationRuntime();
    const router = runtime?.toolRouter;
    if (!router?.route) throw Object.assign(new Error('Grounded CHAT tool router unavailable'), { code: 'GROUNDED_TOOL_ROUTER_UNAVAILABLE' });
    const response = await router.route({
      id: `workspace-${name}-${++this.groundedToolSequence}`,
      name,
      arguments: clone(args)
    }, { permission: 'OBSERVE', scope: 'CURRENT_DOCUMENT', sessionId: 'creative-workspace' });
    return clone(response?.result ?? response ?? null);
  }

  async runCapabilityAction(action) {
    try {
      if (action === 'grounded-context-refresh') {
        this.lastGroundedContext = await this.callGroundedTool('get_grounded_creative_context');
        this.setStatus('GROUNDED_CONTEXT_REFRESHED', 'Document / Semantic / Provenance context refreshed', 'pass');
      } else if (action === 'creative-memory-refresh') {
        this.lastCreativeMemoryContext = await this.callGroundedTool('get_creative_memory_context');
        this.setStatus('CREATIVE_MEMORY_REFRESHED', 'Creative Memory advisory refreshed; no write performed', 'pass');
      } else if (action === 'research-context-refresh') {
        this.lastResearchCreationContext = await this.callGroundedTool('get_research_creation_context');
        this.setStatus('RESEARCH_CONTEXT_REFRESHED', 'Local Research → Creation advisory refreshed; no network request performed', 'pass');
      } else if (action === 'revision-compare') {
        const revisionId = text(this.root?.querySelector('[data-workspace-input="revision-id"]')?.value);
        if (!revisionId) throw Object.assign(new Error('Select a Revision'), { code: 'REVISION_REQUIRED' });
        const revisionRecord = await this.app?.revisions?.loadRecord?.(revisionId);
        if (!revisionRecord) throw Object.assign(new Error('Revision record unavailable'), { code: 'REVISION_RECORD_UNAVAILABLE' });
        const mode = this.root?.querySelector('[data-workspace-input="revision-compare-mode"]')?.value || 'structural';
        this.lastRevisionComparison = await this.callGroundedTool('compare_visual_subjects', {
          subjectA: { kind: 'revision', revisionRecord, label: revisionRecord.label || revisionId },
          subjectB: { kind: 'current', document: this.app?.doc, label: 'Current' },
          options: { mode }
        });
        if (!this.lastGroundedContext) this.lastGroundedContext = await this.callGroundedTool('get_grounded_creative_context');
        this.setStatus('REVISION_COMPARISON_REFRESHED', `${mode} · metadata/structural evidence only`, 'pass');
      }
      this.refresh();
      return true;
    } catch (error) {
      this.setStatus(error?.code || 'WORKSTATION_CAPABILITY_FAILED', error?.message || 'Capability read failed', 'error');
      this.refresh();
      return null;
    }
  }

  async handleAction(action) {
    if (['grounded-context-refresh','creative-memory-refresh','research-context-refresh','revision-compare'].includes(action)) return this.runCapabilityAction(action);
    if (action === 'extract') return this.runExtraction();
    if (action === 'cancel-extract') return this.cancelExtraction();
    if (action === 'structure-reconstruct') return this.runStructure();
    if (['enter-path-edit','exit-path-edit','simplify-path','refine-path','apply-expressive-stroke','clear-expressive-stroke'].includes(action)) return this.runEditAction(action);
    if (['duplicate','group','frame','front','back','repaint','apply-material','clear-material'].includes(action)) return this.runComposeAction(action);
    if (['chat-conversation-inspect','chat-conversation-send','chat-conversation-clear','chat-conversation-transmit'].includes(action)) return this.runConversationAction(action);
    if (['chat-inspect','chat-propose','chat-approve','chat-reject','chat-execute'].includes(action)) return this.runChatAction(action);
    if (['chat-plan-add-step','chat-plan-clear','chat-plan-propose','chat-plan-approve','chat-plan-reject','chat-plan-execute'].includes(action)) return this.runChatPlanAction(action);
    if (['revision-capture','revision-list','revision-restore'].includes(action)) return this.runRevisionAction(action);
    return null;
  }

  referenceObjectId() {
    if (this.lastExtraction?.referenceObjectId) return this.lastExtraction.referenceObjectId;
    const selected = typeof this.app?.selectedObjects === 'function' ? this.app.selectedObjects() : [];
    for (const item of selected) {
      const id = item.object?.metadata?.extraction?.referenceObjectId;
      if (id) return id;
      if (item.object?.metadata?.extractionReference) return item.object.id;
    }
    return null;
  }

  async runExtraction() {
    if (this.extractionAbort) return null;
    const api = this.app?.extraction;
    if (!api?.decode || !api?.extract) {
      this.setStatus('EXTRACTION_UNAVAILABLE', 'Extraction controller unavailable', 'error');
      return null;
    }
    const file = this.root?.querySelector('[data-workspace-input="reference-file"]')?.files?.[0];
    const threshold = Number(this.root?.querySelector('[data-workspace-input="threshold"]')?.value ?? 128);
    if (!file) {
      this.setStatus('EXTRACTION_REFERENCE_REQUIRED', 'Choose a reference image', 'error');
      return null;
    }
    const controller = new AbortController();
    this.extractionAbort = controller;
    this.refresh();
    this.setStatus('EXTRACTION_RUNNING', 'Extracting reference to editable Path', 'busy');
    try {
      const reference = await api.decode(file);
      this.lastReference = reference;
      const result = await api.extract(
        { ...reference, parameters: { threshold } },
        { referenceSrc: reference.referenceSrc, signal: controller.signal }
      );
      this.lastExtraction = {
        referenceObjectId: result.referenceObjectId,
        batchId: result.batchId,
        pathIds: (result.paths || []).map(path => path.id),
        diagnostics: clone(result.diagnostics || null),
        provenance: clone(result.provenance || null),
        source: clone(reference.source || null)
      };
      this.lastStructure = null;
      const firstPath = result.paths?.[0];
      if (firstPath && typeof this.app.findObject === 'function' && typeof this.app.selectOnly === 'function') {
        const found = this.app.findObject({ objectId: firstPath.id });
        if (found) this.app.selectOnly(found.layer.id, firstPath.id);
      }
      this.app.fitContent?.();
      const paths = result.diagnostics?.paths ?? result.paths?.length ?? 0;
      const nodes = result.diagnostics?.nodes ?? 0;
      this.setStatus('EXTRACTION_COMPLETE', `${paths} paths · ${nodes} nodes · editable Path selected`, 'pass');
      return result;
    } catch (error) {
      const code = error?.code || 'EXTRACTION_FAILED';
      this.setStatus(code, code === 'EXTRACTION_CANCELLED' ? 'Extraction cancelled' : (error?.message || 'Extraction failed'), code === 'EXTRACTION_CANCELLED' ? 'info' : 'error');
      return null;
    } finally {
      this.extractionAbort = null;
      this.refresh();
    }
  }

  async runStructure() {
    if (this.extractionAbort) return null;
    const api = this.app?.extraction;
    if (!api?.decode || !api?.structure) {
      this.setStatus('STRUCTURE_AWARE_UNAVAILABLE', 'Structure-Aware controller unavailable', 'error');
      return null;
    }
    const referenceObjectId = this.referenceObjectId();
    if (!referenceObjectId) {
      this.setStatus('STRUCTURE_AWARE_DIRECT_REFERENCE_REQUIRED', 'Run Direct Extraction first so Structure-Aware reuses the same visible reference', 'error');
      return null;
    }
    const file = this.root?.querySelector('[data-workspace-input="reference-file"]')?.files?.[0];
    const threshold = Number(this.root?.querySelector('[data-workspace-input="threshold"]')?.value ?? 128);
    const count = Number(this.root?.querySelector('[data-workspace-input="structure-count"]')?.value ?? 6);
    const controller = new AbortController();
    this.extractionAbort = controller;
    this.refresh();
    this.setStatus('STRUCTURE_AWARE_RUNNING', 'Analyzing radial evidence and retaining complete sector Path set', 'busy');
    try {
      if (!this.lastReference) {
        if (!file) throw Object.assign(new Error('Choose the same reference image used for Direct Extraction'), { code: 'STRUCTURE_AWARE_REFERENCE_FILE_REQUIRED' });
        this.lastReference = await api.decode(file);
      }
      const result = await api.structure(
        { ...this.lastReference, parameters: { threshold } },
        { referenceObjectId, threshold, count, signal: controller.signal }
      );
      this.lastStructure = {
        batchId: result.batchId,
        repeatId: result.repeatId,
        referenceObjectId: result.referenceObjectId,
        radialCount: result.radialCount,
        maskIoU: result.maskIoU,
        prototypePathCount: result.prototypePaths?.length || 0,
        prototypeDiagnostics: clone(result.prototypeDiagnostics || null),
        source: clone(this.lastReference.source || null)
      };
      this.app.fitContent?.();
      this.setStatus('STRUCTURE_AWARE_COMPLETE', `count ${result.radialCount} · ${this.lastStructure.prototypePathCount} prototype Paths · linked Repeat`, 'pass');
      this.refresh();
      return result;
    } catch (error) {
      const code = error?.code || 'STRUCTURE_AWARE_FAILED';
      this.setStatus(code, error?.message || 'Structure-Aware reconstruction failed', code === 'EXTRACTION_CANCELLED' ? 'info' : 'error');
      return null;
    } finally {
      this.extractionAbort = null;
      this.refresh();
    }
  }

  cancelExtraction() {
    if (!this.extractionAbort) return false;
    this.extractionAbort.abort();
    return true;
  }

  changeOverlay(opacity) {
    const referenceObjectId = this.referenceObjectId();
    if (!referenceObjectId || !Number.isFinite(opacity)) {
      this.setStatus('EXTRACTION_OVERLAY_UNAVAILABLE', 'Select an extracted Path or run extraction first', 'error');
      return false;
    }
    try {
      this.app.extraction.overlay(referenceObjectId, opacity);
      this.setStatus('EXTRACTION_OVERLAY_UPDATED', `Reference opacity ${Math.round(opacity * 100)}%`, 'pass');
      return true;
    } catch (error) {
      this.setStatus(error?.code || 'EXTRACTION_OVERLAY_FAILED', error?.message || 'Overlay update failed', 'error');
      return false;
    }
  }

  refreshReference() {
    if (!this.root) return;
    const run = this.root.querySelector('[data-workspace-action="extract"]');
    const cancel = this.root.querySelector('[data-workspace-action="cancel-extract"]');
    if (run) run.disabled = Boolean(this.extractionAbort);
    if (cancel) cancel.disabled = !this.extractionAbort;
    const output = this.root.querySelector('[data-workspace-output="extraction"]');
    if (output) {
      const diagnostics = this.lastExtraction?.diagnostics;
      const source = this.lastExtraction?.source;
      output.textContent = this.lastExtraction
        ? `DIRECT · ${diagnostics?.paths ?? this.lastExtraction.pathIds.length} paths · ${diagnostics?.nodes ?? 0} nodes · ${source?.name || 'reference'} · ${this.lastExtraction.batchId}`
        : (this.referenceObjectId() ? `Reference: ${this.referenceObjectId()}` : 'No extraction in this session.');
    }
    const structure = this.root.querySelector('[data-workspace-output="structure"]');
    if (structure) {
      structure.textContent = this.lastStructure
        ? `OPTIONAL · count ${this.lastStructure.radialCount} · prototype ${this.lastStructure.prototypePathCount} paths / ${this.lastStructure.prototypeDiagnostics?.nodes ?? 0} nodes · mask IoU ${Number(this.lastStructure.maskIoU ?? 0).toFixed(3)} · ${this.lastStructure.repeatId}`
        : 'Not executed. Direct Extraction remains active.';
    }
    const structureButton = this.root.querySelector('[data-workspace-action="structure-reconstruct"]');
    if (structureButton) structureButton.disabled = Boolean(this.extractionAbort) || !this.referenceObjectId();
  }

  selectedPath() {
    const selected = typeof this.app?.selectedObjects === 'function' ? this.app.selectedObjects() : [];
    return selected.length === 1 && selected[0]?.object?.type === 'path' ? selected[0] : null;
  }

  runEditAction(action) {
    const path = this.selectedPath();
    try {
      let result = null;
      if (action === 'enter-path-edit') result = this.app.enterPathEdit?.(path ? { layerId: path.layer.id, objectId: path.object.id } : null);
      else if (action === 'exit-path-edit') result = this.app.exitPathEdit?.();
      else if (action === 'simplify-path') result = this.app.simplifyEditedPath?.();
      else if (action === 'refine-path') result = this.app.refineEditedPath?.();
      else if (action === 'apply-expressive-stroke') {
        if (!path) throw Object.assign(new Error('Select one Path'), { code: 'PATH_REQUIRED' });
        const color = this.root?.querySelector('[data-workspace-input="stroke-color"]')?.value || '#202020';
        const baseWidth = Number(this.root?.querySelector('[data-workspace-input="stroke-width"]')?.value || 2);
        result = this.app.setPathStrokeFromBrush?.('ink', { color, baseWidth }, { layerId: path.layer.id, objectId: path.object.id });
      } else if (action === 'clear-expressive-stroke') {
        if (!path) throw Object.assign(new Error('Select one Path'), { code: 'PATH_REQUIRED' });
        result = this.app.clearPathExpressiveStroke?.({ layerId: path.layer.id, objectId: path.object.id });
      }
      if (result === false || result == null && action !== 'exit-path-edit') {
        this.setStatus('PATH_EDIT_NO_RESULT', 'Path edit command did not execute', 'error');
        return result;
      }
      this.setStatus('PATH_EDIT_UPDATED', action, 'pass');
      this.refresh();
      return result;
    } catch (error) {
      this.setStatus(error?.code || 'PATH_EDIT_FAILED', error?.message || 'Path edit failed', 'error');
      return null;
    }
  }

  runComposeAction(action) {
    try {
      let result = true;
      if (action === 'duplicate') result = this.app.duplicateSelection?.();
      else if (action === 'group') result = this.app.groupSelection?.();
      else if (action === 'frame') result = this.app.frameSelection?.();
      else if (action === 'front') result = this.app.reorderSelection?.('front');
      else if (action === 'back') result = this.app.reorderSelection?.('back');
      else if (action === 'repaint') {
        const fill = this.root?.querySelector('[data-workspace-input="fill"]')?.value || '#f0d9c8';
        result = this.app.repaintSelectedPaths?.({ fill });
      } else if (action === 'apply-material') {
        const templateId = text(this.root?.querySelector('[data-workspace-input="material-id"]')?.value);
        if (!templateId) throw Object.assign(new Error('Material template ID required'), { code: 'MATERIAL_TEMPLATE_REQUIRED' });
        const fill = this.root?.querySelector('[data-workspace-input="fill"]')?.value || '#f0d9c8';
        result = this.app.applySelectedPathMaterial?.({ templateId, parameterOverrides: {}, fallback: { fill } });
      } else if (action === 'clear-material') {
        result = this.app.clearSelectedPathMaterial?.();
      }
      if ((action === 'repaint' || action === 'apply-material' || action === 'clear-material') && !result) {
        this.setStatus('COMPOSE_COMMAND_NO_RESULT', 'Selected object is not an editable Path or command was blocked', 'error');
        return result;
      }
      this.setStatus('COMPOSE_UPDATED', action, 'pass');
      this.refresh();
      return result;
    } catch (error) {
      this.setStatus(error?.code || 'COMPOSE_FAILED', error?.message || 'Composition command failed', 'error');
      return null;
    }
  }

  refreshEditCompose(state) {
    if (!this.root) return;
    const path = this.selectedPath();
    const editOutput = this.root.querySelector('[data-workspace-output="edit"]');
    if (editOutput) {
      if (!path) editOutput.textContent = 'Select one editable Path.';
      else {
        const nodes = path.object.subpaths?.reduce((sum, subpath) => sum + (subpath.anchors?.length || 0), 0) || 0;
        editOutput.textContent = `${path.object.id} · ${nodes} nodes · ${this.app.pathEditing?.active ? 'EDIT MODE' : 'OBJECT MODE'} · ${path.object.expressiveStroke ? 'EXPRESSIVE' : 'VECTOR'}`;
      }
    }
    const composeOutput = this.root.querySelector('[data-workspace-output="compose"]');
    if (composeOutput) {
      const selectedTypes = state.selection.items.map(item => item.type).join(', ') || 'none';
      composeOutput.textContent = `${state.selection.count} selected · ${selectedTypes} · History ${state.history.undoCount}/${state.history.redoCount}`;
    }
    const parametricOutput = this.root.querySelector('[data-workspace-output="parametric-context"]');
    if (parametricOutput) {
      const repeat = (typeof this.app?.selectedObjects === 'function' ? this.app.selectedObjects() : []).find(item => item.object?.type === 'repeat')?.object;
      if (!repeat) {
        parametricOutput.textContent = 'Select a Repeat to inspect deterministic structure state. Explicit descriptors are available to CHAT through resolve_parametric_structure.';
      } else {
        const instanceCount = Array.isArray(repeat.instances) ? repeat.instances.length : Number(repeat.count || 0);
        parametricOutput.textContent = `Repeat · ${repeat.mode || 'radial'} · ${instanceCount} instance(s) · ${repeat.linked === false ? 'expanded/unlinked' : 'linked'} · source ${repeat.sourceObjectId || repeat.source?.id || 'unknown'}`;
      }
    }
    const enter = this.root.querySelector('[data-workspace-action="enter-path-edit"]');
    const exit = this.root.querySelector('[data-workspace-action="exit-path-edit"]');
    if (enter) enter.disabled = !path || Boolean(this.app.pathEditing?.active);
    if (exit) exit.disabled = !this.app.pathEditing?.active;
  }

  chatTargets() {
    const page = this.app?.page?.();
    const selected = typeof this.app?.selectedObjects === 'function' ? this.app.selectedObjects() : [];
    return selected.map(item => ({
      pageId: page?.id || null,
      layerId: item.layer?.id || null,
      objectId: item.object?.id || null
    }));
  }

  createChatTask() {
    const operation = this.root?.querySelector('[data-workspace-input="chat-operation"]')?.value || 'path.repaint.v1';
    const targets = this.chatTargets();
    if (!targets.length) throw Object.assign(new Error('Select one or more targets'), { code: 'CHAT_TARGET_REQUIRED' });
    let args = {};
    if (operation === 'path.repaint.v1') {
      args = { fill: this.root?.querySelector('[data-workspace-input="chat-color"]')?.value || '#d7a78f' };
    } else if (operation === 'object.translate.v1') {
      args = {
        dx: Number(this.root?.querySelector('[data-workspace-input="chat-dx"]')?.value || 0),
        dy: Number(this.root?.querySelector('[data-workspace-input="chat-dy"]')?.value || 0)
      };
    } else if (operation === 'path.simplify.v1') {
      args = { tolerance: 0.75, handleTolerance: 0.2, maxPasses: 256 };
    } else if (operation === 'path.refine.v1') {
      args = { maxControlLength: 48, maxAddedAnchors: 128 };
    } else if (operation === 'path.material.apply.v1') {
      const templateId = text(this.root?.querySelector('[data-workspace-input="chat-material-id"]')?.value);
      if (!templateId) throw Object.assign(new Error('Material template ID required'), { code: 'MATERIAL_TEMPLATE_REQUIRED' });
      args = {
        templateId,
        parameterOverrides: {},
        fallback: { fill: this.root?.querySelector('[data-workspace-input="chat-color"]')?.value || '#d7a78f' }
      };
    }
    return {
      schema: 'INK-CHAT-EDIT-TASK',
      version: 1,
      taskId: `workspace-task-${++this.taskSequence}`,
      operation,
      targets,
      arguments: args
    };
  }

  createChatPlanStep() {
    const task = this.createChatTask();
    const stepId = `step-${++this.planSequence}`;
    const prior = this.draftPlanSteps.at(-1)?.stepId;
    return {
      stepId,
      operation: task.operation,
      targets: clone(task.targets),
      arguments: clone(task.arguments),
      dependsOn: prior ? [prior] : []
    };
  }

  createChatPlan() {
    if (this.draftPlanSteps.length < 2) {
      throw Object.assign(new Error('Add at least two ordered steps'), { code: 'CHAT_PLAN_STEPS_REQUIRED' });
    }
    const intentSummary = text(this.root?.querySelector('[data-workspace-input="chat-plan-intent"]')?.value);
    if (!intentSummary) {
      throw Object.assign(new Error('Plan intent is required'), { code: 'CHAT_PLAN_INTENT_REQUIRED' });
    }
    return {
      schema: 'INK-CHAT-CREATIVE-PLAN',
      version: 1,
      intentSummary,
      steps: clone(this.draftPlanSteps)
    };
  }

  async runChatPlanAction(action) {
    const adapter = this.app?.chatCreativePlanAdapter;
    if (!adapter) {
      this.setStatus('CHAT_PLAN_UNAVAILABLE', 'CHAT creative-plan controller unavailable', 'error');
      return null;
    }
    try {
      let response = null;
      if (action === 'chat-plan-add-step') {
        this.draftPlanSteps.push(this.createChatPlanStep());
        this.setStatus('CHAT_PLAN_STEP_ADDED', `${this.draftPlanSteps.length} ordered step(s)`, 'pass');
        this.refresh();
        return clone(this.draftPlanSteps);
      }
      if (action === 'chat-plan-clear') {
        this.draftPlanSteps = [];
        this.planSequence = 0;
        this.activePlanId = null;
        this.planApprovalToken = null;
        this.lastPlanResult = null;
        this.setStatus('CHAT_PLAN_CLEARED', 'Plan draft cleared', 'info');
        this.refresh();
        return [];
      }
      if (action === 'chat-plan-propose') {
        response = adapter.propose(this.createChatPlan());
        if (response.ok) {
          this.activePlanId = response.result.planId;
          this.planApprovalToken = null;
          this.lastPlanResult = null;
        }
      } else if (action === 'chat-plan-approve') {
        if (!this.activePlanId) throw Object.assign(new Error('No active plan'), { code: 'CHAT_PLAN_REQUIRED' });
        response = adapter.approve(this.activePlanId);
        if (response.ok) this.planApprovalToken = response.result.approvalToken;
      } else if (action === 'chat-plan-reject') {
        if (!this.activePlanId) throw Object.assign(new Error('No active plan'), { code: 'CHAT_PLAN_REQUIRED' });
        response = adapter.reject(this.activePlanId);
        if (response.ok) this.planApprovalToken = null;
      } else if (action === 'chat-plan-execute') {
        if (!this.activePlanId) throw Object.assign(new Error('No active plan'), { code: 'CHAT_PLAN_REQUIRED' });
        if (!this.planApprovalToken) throw Object.assign(new Error('Explicit plan approval required before execution'), { code: 'CHAT_PLAN_APPROVAL_REQUIRED' });
        response = await adapter.execute(this.activePlanId, this.planApprovalToken);
        if (response.ok) {
          this.lastPlanResult = clone(response.result);
          this.planApprovalToken = null;
          if (response.result?.revision?.endingRevisionId) await this.refreshRevisionList();
        }
      }
      if (!response?.ok) {
        this.setStatus(response?.code || 'CHAT_PLAN_FAILED', response?.phase || 'CHAT plan failed', 'error');
        this.refresh();
        return response;
      }
      const level = response.result?.status === 'STOPPED' ? 'error' : 'pass';
      this.setStatus(
        response.result?.status === 'STOPPED' ? 'CHAT_PLAN_STOPPED' : 'CHAT_PLAN_UPDATED',
        response.result?.status || action,
        level
      );
      this.refresh();
      return response;
    } catch (error) {
      this.setStatus(error?.code || 'CHAT_PLAN_FAILED', error?.message || 'CHAT plan failed', 'error');
      return null;
    }
  }

  conversationRuntime() {
    return globalThis.INK_AI?.runtime || null;
  }

  conversationClientName() {
    return globalThis.INK_AI?.uiState?.runtimeClient || 'manual-json';
  }

  ensureConversationSession() {
    const runtime = this.conversationRuntime();
    if (!runtime?.manager) throw Object.assign(new Error('CHAT runtime unavailable'), { code: 'CHAT_RUNTIME_UNAVAILABLE' });
    const client = this.conversationClientName();
    if (this.conversationSessionId && this.conversationClient === client) return this.conversationSessionId;
    if (this.conversationSessionId) runtime.manager.end(this.conversationSessionId, { clearCredentials: false });
    const session = runtime.manager.start({ client });
    this.conversationSessionId = session.sessionId;
    this.conversationClient = client;
    return this.conversationSessionId;
  }

  inspectConversationContext() {
    const runtime = this.conversationRuntime();
    if (!runtime?.contextBuilder) throw Object.assign(new Error('CHAT context runtime unavailable'), { code: 'CHAT_CONTEXT_UNAVAILABLE' });
    const context = runtime.contextBuilder.build({ level: 'DOCUMENT_SUMMARY', includeHistory: false });
    this.lastConversationContext = clone(context);
    return context;
  }

  appendConversationMessage(role, content, metadata = {}) {
    this.conversationMessages.push({
      id: `conversation-${this.conversationMessages.length + 1}`,
      role,
      content: String(content || ''),
      provider: metadata.provider || null,
      source: metadata.source || null
    });
    if (this.conversationMessages.length > 40) this.conversationMessages.splice(0, this.conversationMessages.length - 40);
  }

  async runConversationAction(action) {
    try {
      if (action === 'chat-conversation-clear') {
        const runtime = this.conversationRuntime();
        if (this.conversationSessionId) runtime?.manager?.end?.(this.conversationSessionId, { clearCredentials: false });
        this.conversationMessages = [];
        this.conversationSessionId = null;
        this.conversationClient = null;
        this.conversationPending = null;
        this.lastTransmissionPreview = null;
        this.setStatus('CHAT_CONVERSATION_CLEARED', 'Conversation cleared; document unchanged', 'info');
        this.refresh();
        return true;
      }
      if (action === 'chat-conversation-inspect') {
        const context = this.inspectConversationContext();
        this.setStatus('CHAT_DOCUMENT_CONTEXT_INSPECTED', `${context.level} · ${context.sourceVersion}`, 'pass');
        this.refresh();
        return context;
      }

      const promptInput = this.root?.querySelector('[data-workspace-input="chat-prompt"]');
      const isApprovedTransmission = action === 'chat-conversation-transmit';
      const prompt = isApprovedTransmission
        ? this.conversationPending?.prompt
        : text(promptInput?.value);
      if (!prompt) throw Object.assign(new Error('Enter a natural-language prompt'), { code: 'CHAT_PROMPT_REQUIRED' });

      const runtime = this.conversationRuntime();
      const sessionId = this.ensureConversationSession();
      const context = this.inspectConversationContext();
      if (!isApprovedTransmission) this.appendConversationMessage('user', prompt);
      const before = JSON.stringify(this.app?.doc || null);
      this.conversationBusy = true;
      this.refresh();
      const response = await runtime.manager.requestConversation(sessionId, {
        prompt,
        contextOptions: { level: 'DOCUMENT_SUMMARY', includeHistory: false },
        transmissionDecision: 'TEXT_SUMMARY',
        userConsent: isApprovedTransmission
      });
      if (JSON.stringify(this.app?.doc || null) !== before) {
        throw Object.assign(new Error('Conversation runtime changed the document outside the bounded edit authority'), { code: 'CHAT_CONVERSATION_MUTATED_DOCUMENT' });
      }
      if (response?.status === 'TRANSMISSION_APPROVAL_REQUIRED') {
        this.conversationPending = { prompt };
        this.lastTransmissionPreview = clone(response.transmissionPreview || null);
        this.setStatus('CHAT_TRANSMISSION_APPROVAL_REQUIRED', 'Review and approve external text/context transmission', 'info');
        this.refresh();
        return response;
      }
      this.conversationPending = null;
      this.lastTransmissionPreview = null;
      this.appendConversationMessage('assistant', response?.content || '', { provider: response?.provider, source: response?.source });
      if (promptInput) promptInput.value = '';
      this.setStatus('CHAT_CONVERSATION_RESPONSE', `${response?.source || 'MODEL'} · document unchanged`, 'pass');
      this.refresh();
      return response;
    } catch (error) {
      this.setStatus(error?.code || 'CHAT_CONVERSATION_FAILED', error?.message || 'Conversation failed', 'error');
      return null;
    } finally {
      this.conversationBusy = false;
      this.refresh();
    }
  }

  runChatAction(action) {
    const adapter = this.app?.chatBoundedEditAdapter;
    if (!adapter) {
      this.setStatus('CHAT_EDIT_UNAVAILABLE', 'CHAT bounded-edit controller unavailable', 'error');
      return null;
    }
    try {
      let response;
      if (action === 'chat-inspect') {
        response = adapter.inspect();
        if (response.ok) this.lastChatInspection = response.result;
      } else if (action === 'chat-propose') {
        response = adapter.propose(this.createChatTask());
        if (response.ok) {
          this.activeProposalId = response.result.proposalId;
          this.approvalToken = null;
          this.lastChatResult = null;
        }
      } else if (action === 'chat-approve') {
        if (!this.activeProposalId) throw Object.assign(new Error('No active proposal'), { code: 'PROPOSAL_REQUIRED' });
        response = adapter.approve(this.activeProposalId);
        if (response.ok) this.approvalToken = response.result.approvalToken;
      } else if (action === 'chat-reject') {
        if (!this.activeProposalId) throw Object.assign(new Error('No active proposal'), { code: 'PROPOSAL_REQUIRED' });
        response = adapter.reject(this.activeProposalId);
        if (response.ok) this.approvalToken = null;
      } else if (action === 'chat-execute') {
        if (!this.activeProposalId) throw Object.assign(new Error('No active proposal'), { code: 'PROPOSAL_REQUIRED' });
        if (!this.approvalToken) throw Object.assign(new Error('Explicit approval required before execution'), { code: 'APPROVAL_REQUIRED' });
        response = adapter.execute(this.activeProposalId, this.approvalToken);
        if (response.ok) {
          this.lastChatResult = response.result;
          this.approvalToken = null;
        }
      }
      if (!response?.ok) {
        this.setStatus(response?.code || 'CHAT_EDIT_FAILED', response?.phase || 'CHAT edit failed', 'error');
        this.refresh();
        return response;
      }
      this.setStatus('CHAT_EDIT_UPDATED', action, 'pass');
      this.refresh();
      return response;
    } catch (error) {
      this.setStatus(error?.code || 'CHAT_EDIT_FAILED', error?.message || 'CHAT edit failed', 'error');
      return null;
    }
  }

  refreshConversation() {
    if (!this.root) return;
    const runtime = this.conversationRuntime();
    const client = this.conversationClientName();
    const mode = runtime?.manager?.mode || 'LOCAL_ONLY';
    const runtimeValue = this.root.querySelector('[data-workspace-value="chat-runtime"]');
    if (runtimeValue) runtimeValue.textContent = `${mode} · ${client}${this.conversationBusy ? ' · BUSY' : ''}`;

    const transcript = this.root.querySelector('[data-workspace-output="chat-conversation"]');
    if (transcript) {
      transcript.innerHTML = '';
      if (!this.conversationMessages.length) {
        const empty = document.createElement('p');
        empty.className = 'creative-chat-empty';
        empty.textContent = 'No conversation. Inspect the current document or enter a prompt.';
        transcript.append(empty);
      } else {
        for (const message of this.conversationMessages) {
          const row = document.createElement('div');
          row.className = 'creative-chat-message';
          row.dataset.role = message.role;
          const label = document.createElement('strong');
          label.textContent = message.role === 'user' ? 'YOU' : (message.source === 'LOCAL_CONTEXT' ? 'LOCAL' : 'CHAT');
          const body = document.createElement('p');
          body.textContent = message.content;
          row.append(label, body);
          transcript.append(row);
        }
      }
    }

    const contextOutput = this.root.querySelector('[data-workspace-output="chat-context"]');
    if (contextOutput) {
      if (this.lastTransmissionPreview) {
        contextOutput.textContent = `EXTERNAL REVIEW · ${this.lastTransmissionPreview.provider} · ${this.lastTransmissionPreview.endpoint} · ${this.lastTransmissionPreview.estimatedBytes} bytes · text/context only`;
      } else if (this.lastConversationContext) {
        contextOutput.textContent = `${this.lastConversationContext.format} · ${this.lastConversationContext.level} · source ${this.lastConversationContext.sourceVersion} · ~${this.lastConversationContext.estimatedTokens} tokens`;
      } else {
        contextOutput.textContent = 'Context not inspected.';
      }
    }
    const send = this.root.querySelector('[data-workspace-action="chat-conversation-send"]');
    const inspect = this.root.querySelector('[data-workspace-action="chat-conversation-inspect"]');
    const transmit = this.root.querySelector('[data-workspace-action="chat-conversation-transmit"]');
    if (send) send.disabled = this.conversationBusy || Boolean(this.conversationPending);
    if (inspect) inspect.disabled = this.conversationBusy;
    if (transmit) {
      transmit.hidden = !this.conversationPending;
      transmit.disabled = this.conversationBusy || !this.conversationPending;
    }
  }

  refreshCapabilityReadouts(state = this.state()) {
    const grounded = this.lastGroundedContext;
    const groundedOutput = this.root?.querySelector('[data-workspace-output="grounded-context"]');
    if (groundedOutput) {
      if (!grounded) groundedOutput.textContent = 'Grounded tools ready · inspect to read Document Bridge / Semantic Regions / Provenance.';
      else {
        const modules = grounded.modules || {};
        const semanticCount = modules.semanticRegions?.context?.regions?.length
          ?? modules.semanticRegions?.context?.semanticRegions?.length
          ?? 0;
        const provenanceEvents = modules.provenance?.context?.events?.length ?? 0;
        groundedOutput.textContent = `Document ${modules.documentBridge?.status || 'UNAVAILABLE'} · Semantic ${modules.semanticRegions?.status || 'UNAVAILABLE'} (${semanticCount}) · Provenance ${modules.provenance?.status || 'UNAVAILABLE'} (${provenanceEvents} events)`;
      }
    }

    const selectionOutput = document.querySelector('[data-workstation-output="selection-capability"]');
    if (selectionOutput) {
      if (!state.selection.count) selectionOutput.textContent = 'Select an object to inspect Document Bridge and Semantic Region grounding.';
      else if (!grounded) selectionOutput.textContent = `${selectionLabel(state.selection)} · grounded context not inspected`;
      else {
        const selectedIds = grounded.modules?.documentBridge?.context?.selection?.objectIds
          || grounded.modules?.documentBridge?.context?.selection?.selectedObjectIds
          || state.selection.items.map(item => item.objectId);
        selectionOutput.textContent = `Document Bridge AVAILABLE · ${selectedIds.length || state.selection.count} selected · Semantic ${grounded.modules?.semanticRegions?.status || 'UNAVAILABLE'} · read-only`;
      }
    }

    const memoryOutput = this.root?.querySelector('[data-workspace-output="creative-memory-context"]');
    if (memoryOutput) {
      const memory = this.lastCreativeMemoryContext;
      if (!memory) memoryOutput.textContent = 'Creative Memory provider ready · advisory not inspected.';
      else if (memory.status === 'UNAVAILABLE') memoryOutput.textContent = 'Creative Memory · UNAVAILABLE';
      else {
        const selected = memory.selectedRecords?.length || 0;
        const approaches = memory.approaches || {};
        memoryOutput.textContent = `Creative Memory · ${selected} selected · accepted ${approaches.accepted?.count ?? 0} · rejected ${approaches.rejected?.count ?? 0} · unresolved ${approaches.unresolved?.count ?? 0} · READ ONLY`;
      }
    }

    const researchOutput = this.root?.querySelector('[data-workspace-output="research-context"]');
    if (researchOutput) {
      const research = this.lastResearchCreationContext;
      if (!research) researchOutput.textContent = 'Research advisory provider ready · no remote fetch.';
      else if (research.status === 'UNAVAILABLE') researchOutput.textContent = 'Research → Creation · UNAVAILABLE';
      else researchOutput.textContent = `Evidence ${research.selectedResearchEvidence?.length || 0} · Principles ${research.derivedPrinciples?.length || 0} · Constraints ${research.derivedCreativeConstraints?.length || 0} · unresolved ${research.unresolvedEvidence?.length || 0} · READ ONLY`;
    }
  }

  refreshChat() {
    if (!this.root) return;
    this.refreshConversation();
    const proposal = this.activeProposalId ? this.app?.chatBoundedEdit?.getProposal?.(this.activeProposalId) : null;
    const output = this.root.querySelector('[data-workspace-output="chat"]');
    if (output) {
      if (this.lastChatResult) {
        output.textContent = `EXECUTED · ${this.lastChatResult.operation} · changed=${this.lastChatResult.changed} · ${this.lastChatResult.proposalId}`;
      } else if (proposal) {
        output.textContent = `${proposal.state} · ${proposal.task?.operation} · ${proposal.task?.targets?.length || 0} target(s) · rev ${proposal.revisionId || 'none'}`;
      } else if (this.lastChatInspection) {
        output.textContent = `INSPECTED · ${this.lastChatInspection.objects?.length || 0} objects · rev ${this.lastChatInspection.revision?.revisionId || 'none'}`;
      } else {
        output.textContent = 'No proposal.';
      }
    }
    const state = proposal?.state || null;
    const approve = this.root.querySelector('[data-workspace-action="chat-approve"]');
    const reject = this.root.querySelector('[data-workspace-action="chat-reject"]');
    const execute = this.root.querySelector('[data-workspace-action="chat-execute"]');
    if (approve) approve.disabled = state !== 'PROPOSED';
    if (reject) reject.disabled = !proposal || state === 'EXECUTED' || state === 'REJECTED';
    if (execute) execute.disabled = state !== 'APPROVED' || !this.approvalToken;

    const plan = this.activePlanId ? this.app?.chatCreativePlan?.getPlan?.(this.activePlanId) : null;
    const planOutput = this.root.querySelector('[data-workspace-output="chat-plan"]');
    if (planOutput) {
      const displaySteps = plan?.steps || this.draftPlanSteps;
      const resultByStep = new Map((plan?.stepResults || []).map(item => [item.stepId, item]));
      const lines = [];
      if (plan) {
        lines.push(`${plan.status} · ${plan.intentSummary} · source rev ${plan.source?.revisionId || 'none'}`);
      } else {
        lines.push(`DRAFT · ${displaySteps.length} step(s)`);
      }
      displaySteps.forEach((step, index) => {
        const result = resultByStep.get(step.stepId);
        const stepState = result?.state || (plan?.validation?.steps?.[index]?.valid ? 'VALID' : 'PENDING');
        const targetIds = (step.targets || []).map(target => target.objectId).filter(Boolean).join(', ') || 'no target';
        lines.push(`${index + 1}. ${stepState} · ${step.operation} · ${targetIds}`);
      });
      if (plan?.result?.status === 'STOPPED') {
        lines.push(`STOPPED at ${plan.result.stoppedStepId || 'revision'} · ${plan.result.diagnostic?.code || plan.diagnostics?.[0]?.code || 'diagnostic'}`);
      }
      if (plan?.result?.revision) {
        lines.push(`Revision ${plan.result.revision.startingRevisionId || 'none'} → ${plan.result.revision.endingRevisionId || 'none'}`);
      }
      planOutput.textContent = lines.join('\n');
    }
    const planState = plan?.status || null;
    const approvePlan = this.root.querySelector('[data-workspace-action="chat-plan-approve"]');
    const rejectPlan = this.root.querySelector('[data-workspace-action="chat-plan-reject"]');
    const executePlan = this.root.querySelector('[data-workspace-action="chat-plan-execute"]');
    if (approvePlan) approvePlan.disabled = planState !== 'PROPOSED';
    if (rejectPlan) rejectPlan.disabled = !plan || !['PROPOSED','APPROVED'].includes(planState);
    if (executePlan) executePlan.disabled = planState !== 'APPROVED' || !this.planApprovalToken;
  }

  async runRevisionAction(action) {
    const revisions = this.app?.revisions;
    if (!revisions) {
      this.setStatus('REVISION_UNAVAILABLE', 'Revision controller unavailable', 'error');
      return null;
    }
    try {
      if (action === 'revision-list') return await this.refreshRevisionList();
      if (action === 'revision-capture') {
        const label = text(this.root?.querySelector('[data-workspace-input="revision-label"]')?.value) || 'Workspace checkpoint';
        const result = await revisions.capture({ reason: 'workspace', label });
        this.lastRevisionResult = {
          action: 'capture',
          created: result.created,
          equivalent: result.equivalent,
          revisionId: result.record?.revisionId || null,
          comparison: clone(result.comparison || null)
        };
        await this.refreshRevisionList();
        this.setStatus(result.created ? 'REVISION_CAPTURED' : 'REVISION_EQUIVALENT', result.record?.revisionId || 'Equivalent to current Revision', 'pass');
        this.refresh();
        return result;
      }
      if (action === 'revision-restore') {
        const revisionId = text(this.root?.querySelector('[data-workspace-input="revision-id"]')?.value);
        if (!revisionId) throw Object.assign(new Error('Select a Revision'), { code: 'REVISION_REQUIRED' });
        const result = await revisions.restore(revisionId);
        this.lastReference = null;
        this.lastExtraction = null;
        this.lastStructure = null;
        this.lastRevisionResult = { action: 'restore', ...clone(result) };
        this.setStatus('REVISION_RESTORED', `${revisionId} · ${result.historyBoundary}`, 'pass');
        await this.refreshRevisionList();
        this.refresh();
        return result;
      }
      return null;
    } catch (error) {
      this.setStatus(error?.code || 'REVISION_FAILED', error?.message || 'Revision operation failed', 'error');
      this.refresh();
      return null;
    }
  }

  async refreshRevisionList() {
    if (!this.app?.revisions?.list) return [];
    try {
      this.revisionItems = await this.app.revisions.list(this.app.doc?.id);
      const select = this.root?.querySelector('[data-workspace-input="revision-id"]');
      if (select) {
        const prior = select.value;
        select.innerHTML = '';
        if (!this.revisionItems.length) {
          const option = document.createElement('option');
          option.value = '';
          option.textContent = 'No revisions';
          select.append(option);
        } else {
          for (const item of [...this.revisionItems].sort((a, b) => b.sequence - a.sequence)) {
            const option = document.createElement('option');
            option.value = item.revisionId;
            option.textContent = `#${item.sequence} · ${item.label || item.reason || 'Revision'} · ${item.revisionId}`;
            select.append(option);
          }
          const current = this.app.revisions.revisionIdFor?.(this.app.doc?.id);
          select.value = this.revisionItems.some(item => item.revisionId === prior)
            ? prior
            : (this.revisionItems.some(item => item.revisionId === current) ? current : this.revisionItems.at(-1)?.revisionId || '');
        }
      }
      this.refreshRevision();
      return clone(this.revisionItems);
    } catch (error) {
      this.setStatus(error?.code || 'REVISION_LIST_FAILED', error?.message || 'Revision list failed', 'error');
      return [];
    }
  }

  refreshRevision() {
    if (!this.root) return;
    const current = this.app?.revisions?.revisionIdFor?.(this.app?.doc?.id) ?? null;
    const output = this.root.querySelector('[data-workspace-output="revision"]');
    if (output) {
      if (this.lastRevisionResult?.action === 'restore') {
        output.textContent = `RESTORED · ${this.lastRevisionResult.revisionId} · ${this.lastRevisionResult.historyBoundary}`;
      } else if (this.lastRevisionResult?.action === 'capture') {
        const comparison = this.lastRevisionResult.comparison;
        const counts = comparison?.objectCounts;
        const delta = counts
          ? `objects ${counts.before}→${counts.after} · +${counts.added} −${counts.removed} Δ${counts.changed} · touched ${counts.touched}`
          : 'comparison unavailable';
        output.textContent = `${this.lastRevisionResult.created ? 'CAPTURED' : 'EQUIVALENT'} · ${this.lastRevisionResult.revisionId || current || 'none'} · ${delta}`;
      } else {
        output.textContent = `Current revision: ${current || 'none'} · ${this.revisionItems.length} stored`;
      }
    }
    const restore = this.root.querySelector('[data-workspace-action="revision-restore"]');
    const compare = this.root.querySelector('[data-workspace-action="revision-compare"]');
    const selectedRevision = this.root.querySelector('[data-workspace-input="revision-id"]')?.value;
    if (restore) restore.disabled = !selectedRevision;
    if (compare) compare.disabled = !selectedRevision;

    const compareOutput = this.root.querySelector('[data-workspace-output="revision-compare"]');
    if (compareOutput) {
      const evidence = this.lastRevisionComparison;
      if (!evidence) compareOutput.textContent = 'Comparison not executed.';
      else if (evidence.status === 'UNAVAILABLE') compareOutput.textContent = 'Visual Compare · UNAVAILABLE';
      else {
        const structural = evidence.structural || {};
        const counts = structural.objectCounts;
        compareOutput.textContent = `${evidence.mode?.requested || 'structural'} · ${structural.status || 'UNRESOLVED'} · ${structural.equivalent === true ? 'equivalent' : structural.equivalent === false ? 'changed' : 'unknown'}${counts ? ` · +${counts.added} −${counts.removed} Δ${counts.changed}` : ''} · renderer ${evidence.mode?.renderingExecuted ? 'used' : 'not used'}`;
      }
    }
    const provenanceOutput = this.root.querySelector('[data-workspace-output="revision-provenance"]');
    if (provenanceOutput) {
      const provenance = this.lastGroundedContext?.modules?.provenance;
      if (!provenance) provenanceOutput.textContent = 'Provenance not inspected.';
      else provenanceOutput.textContent = `Provenance ${provenance.status} · ${provenance.context?.events?.length || 0} event(s) · ${provenance.context?.edges?.length || 0} edge(s) · read-only`;
    }
  }

  setOpen(open) {
    this.open = Boolean(open);
    this.root?.classList.toggle('open', this.open);
    this.root?.setAttribute('aria-hidden', String(!this.open));
    this.toggle?.setAttribute('aria-expanded', String(this.open));
    return this.open;
  }

  setStage(stage) {
    if (!WORKSPACE_STAGES.some(([id]) => id === stage)) return false;
    this.stage = stage;
    if (this.root) {
      this.root.querySelectorAll('[data-workspace-stage]').forEach(button => {
        const active = button.dataset.workspaceStage === stage;
        button.classList.toggle('active', active);
        button.setAttribute('aria-selected', String(active));
      });
      this.root.querySelectorAll('[data-workspace-pane]').forEach(pane => {
        pane.hidden = pane.dataset.workspacePane !== stage;
      });
    }
    this.refresh();
    if (stage === 'revision') void this.refreshRevisionList();
    return true;
  }

  setStatus(code, message, level = 'info') {
    this.status = { code: text(code) || 'WORKSPACE_STATUS', message: text(message) || String(code || ''), level };
    this.refresh();
    return clone(this.status);
  }

  state() {
    return buildCreativeWorkspaceState(this.app, {
      stage: this.stage,
      activeProposalId: this.activeProposalId,
      activePlanId: this.activePlanId,
      status: this.status
    });
  }

  refresh() {
    if (!this.root) return this.state();
    const state = this.state();
    setText(this.root, '[data-workspace-value="document"]', state.document ? `${state.document.title || 'Untitled'} · ${state.document.id}` : null);
    setText(this.root, '[data-workspace-value="page"]', state.page ? `${state.page.name || 'Page'} · ${state.page.id}` : null);
    setText(this.root, '[data-workspace-value="context"]', `${state.stage} · ${state.context || 'idle'}`);
    setText(this.root, '[data-workspace-value="revision"]', state.revision.revisionId);
    setText(this.root, '[data-workspace-value="selection"]', selectionLabel(state.selection));
    setText(this.root, '[data-workspace-value="provenance"]', provenanceLabel(state.provenance));
    const proposal = state.chat.proposal;
    const plan = state.chat.plan;
    setText(
      this.root,
      '[data-workspace-value="chat"]',
      plan ? `${plan.status} · ${plan.steps.length} step(s)` : (proposal ? `${proposal.state} · ${proposal.operation}` : 'No proposal')
    );
    setText(this.root, '[data-workspace-value="status"]', this.status?.code ? `${this.status.code} · ${this.status.message}` : 'Ready');
    this.root.dataset.stage = state.stage;
    this.root.dataset.historyPending = String(state.history.pending);
    this.root.dataset.formatVersion = String(state.document?.formatVersion ?? '');
    this.refreshReference(state);
    this.refreshEditCompose(state);
    this.refreshCapabilityReadouts(state);
    this.refreshChat(state);
    this.refreshRevision(state);
    return state;
  }
}

export function installCreativeWorkspace(app) {
  if (!app || typeof app !== 'object') throw new Error('INK_CREATIVE_WORKSPACE_APP_REQUIRED');
  if (app.creativeWorkspace instanceof CreativeWorkspaceController) return app.creativeWorkspace;
  const controller = new CreativeWorkspaceController(app);
  app.creativeWorkspace = controller;
  controller.mount();
  return controller;
}
