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
    this.approvalToken = null;
    this.lastChatInspection = null;
    this.lastChatResult = null;
    this.taskSequence = 0;
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
        </section>
        <section data-workspace-pane="chat" hidden>
          <strong>CHAT bounded edit</strong>
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
        </section>
        <section data-workspace-pane="revision" hidden>
          <strong>Revision capture / restore</strong>
          <label class="creative-workspace-field"><span>Label</span><input type="text" data-workspace-input="revision-label" value="Workspace checkpoint"></label>
          <div class="creative-workspace-actions"><button type="button" data-workspace-action="revision-capture">Capture</button><button type="button" data-workspace-action="revision-list">Refresh list</button></div>
          <label class="creative-workspace-field"><span>Revision</span><select data-workspace-input="revision-id"><option value="">No revisions</option></select></label>
          <button type="button" class="creative-workspace-primary" data-workspace-action="revision-restore">Restore selected Revision</button>
          <output data-workspace-output="revision">Current revision: none</output>
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
    this.setStage(this.stage);
    this.refresh();
    return this;
  }

  async handleAction(action) {
    if (action === 'extract') return this.runExtraction();
    if (action === 'cancel-extract') return this.cancelExtraction();
    if (['enter-path-edit','exit-path-edit','simplify-path','refine-path','apply-expressive-stroke','clear-expressive-stroke'].includes(action)) return this.runEditAction(action);
    if (['duplicate','group','frame','front','back','repaint','apply-material','clear-material'].includes(action)) return this.runComposeAction(action);
    if (['chat-inspect','chat-propose','chat-approve','chat-reject','chat-execute'].includes(action)) return this.runChatAction(action);
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

  refreshChat() {
    if (!this.root) return;
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
        this.lastExtraction = null;
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
    const selectedRevision = this.root.querySelector('[data-workspace-input="revision-id"]')?.value;
    if (restore) restore.disabled = !selectedRevision;
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
    this.refreshEditCompose(state);
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
