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

export function buildCreativeWorkspaceState(app, {
  stage = 'reference',
  activeProposalId = null,
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
      proposal: proposalSummary(app, activeProposalId)
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
    this.status = { level: 'ready', code: 'WORKSPACE_READY', message: 'Creative workspace ready' };
    this.open = true;
    this.root = null;
    this.toggle = null;
    this.extractionAbort = null;
    this.lastExtraction = null;
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
    this.toggle.setAttribute('aria-expanded', 'true');
    this.toggle.textContent = 'CW';
    const anchor = document.querySelector('#inspectorToggle');
    anchor?.parentElement?.insertBefore(this.toggle, anchor);

    const root = document.createElement('aside');
    root.id = 'creativeWorkspace';
    root.className = 'creative-workspace-panel elevated-panel open';
    root.setAttribute('aria-label', 'INK Creative Workspace');
    root.innerHTML = `
      <div class="creative-workspace-head">
        <div><span class="eyebrow">CREATIVE LOOP</span><strong>Workspace v0.1</strong></div>
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
          <strong>Reference → Extract → Path</strong>
          <label class="creative-workspace-field"><span>Reference image</span><input type="file" data-workspace-input="reference-file" accept="image/png,image/jpeg,image/webp"></label>
          <label class="creative-workspace-field"><span>Threshold</span><input type="number" data-workspace-input="threshold" value="128" min="0" max="255"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="extract">Extract</button><button type="button" data-workspace-action="cancel-extract" disabled>Cancel</button></div>
          <label class="creative-workspace-field"><span>Reference overlay</span><input type="range" data-workspace-input="overlay" min="0" max="1" step="0.1" value="0.5"></label>
          <output data-workspace-output="extraction">No extraction in this session.</output>
        </section>
        <section data-workspace-pane="edit" hidden><strong>Path Edit</strong><p>Path and appearance controls are connected in Phase C.</p></section>
        <section data-workspace-pane="compose" hidden><strong>Compose → Repaint</strong><p>Composition and repaint controls are connected in Phase C.</p></section>
        <section data-workspace-pane="chat" hidden><strong>CHAT bounded edit</strong><p>Proposal / approval controls are connected in Phase D.</p></section>
        <section data-workspace-pane="revision" hidden><strong>Revision</strong><p>Capture / restore controls are connected in Phase E.</p></section>
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
    this.setStage(this.stage);
    this.refresh();
    return this;
  }

  async handleAction(action) {
    if (action === 'extract') return this.runExtraction();
    if (action === 'cancel-extract') return this.cancelExtraction();
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
      const result = await api.extract(
        { ...reference, parameters: { threshold } },
        { referenceSrc: reference.referenceSrc, signal: controller.signal }
      );
      this.lastExtraction = {
        referenceObjectId: result.referenceObjectId,
        batchId: result.batchId,
        pathIds: (result.paths || []).map(path => path.id),
        diagnostics: clone(result.diagnostics || null)
      };
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
      output.textContent = this.lastExtraction
        ? `${diagnostics?.paths ?? this.lastExtraction.pathIds.length} paths · ${diagnostics?.nodes ?? 0} nodes · ${this.lastExtraction.batchId}`
        : (this.referenceObjectId() ? `Reference: ${this.referenceObjectId()}` : 'No extraction in this session.');
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
    setText(this.root, '[data-workspace-value="chat"]', proposal ? `${proposal.state} · ${proposal.operation}` : 'No proposal');
    setText(this.root, '[data-workspace-value="status"]', this.status?.code ? `${this.status.code} · ${this.status.message}` : 'Ready');
    this.root.dataset.stage = state.stage;
    this.root.dataset.historyPending = String(state.history.pending);
    this.root.dataset.formatVersion = String(state.document?.formatVersion ?? '');
    this.refreshReference(state);
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
