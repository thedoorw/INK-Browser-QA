import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  buildCreativeWorkspaceState,
  CreativeWorkspaceController
} from '../../../../product/source/src/editor/creative-workspace.js';

function stateFixture() {
  const path = {
    id: 'path-1',
    type: 'path',
    fill: 'none',
    stroke: '#202020',
    strokeWidth: 1.5,
    subpaths: [{ closed: true, anchors: [{}, {}, {}] }],
    metadata: {
      extraction: {
        batchId: 'batch-1',
        referenceObjectId: 'reference-1',
        source: { name: 'rose-window.png' }
      }
    }
  };
  const app = {
    doc: { id: 'doc-014', title: 'Workspace Fixture', formatVersion: 4 },
    tool: 'select',
    selection: [{ layerId: 'layer-1', objectId: path.id }],
    page() { return { id: 'page-1', name: 'Page 1', activeLayerId: 'layer-1' }; },
    selectedObjects() { return [{ layer: { id: 'layer-1' }, object: path }]; },
    history: { pending: false, undoStack: [1, 2], redoStack: [] },
    extraction: {},
    pathEditing: { active: false },
    pathStrokeAppearance: {},
    pathRepaintMaterial: {},
    chatBoundedEdit: { getProposal() { return null; } },
    revisions: {
      revisionIdFor() { return 'revision-1'; },
      diagnostics() { return { persistence: 'browser-local-store' }; }
    }
  };
  return { app, path };
}

function fakeRoot() {
  const nodes = new Map();
  const node = (selector, value = '') => {
    if (!nodes.has(selector)) {
      nodes.set(selector, {
        value,
        textContent: '',
        disabled: false,
        files: [],
        dataset: {},
        append(child) {
          this.options ||= [];
          this.options.push(child);
          if (!this.value) this.value = child.value;
        }
      });
    }
    return nodes.get(selector);
  };
  return {
    dataset: {},
    node,
    querySelector(selector) { return node(selector); },
    querySelectorAll() { return []; }
  };
}

test('Creative Workspace state is a view over existing runtime state', () => {
  const { app } = stateFixture();
  const state = buildCreativeWorkspaceState(app, { stage: 'compose' });

  assert.equal(state.schema, 'INK-CREATIVE-WORKSPACE-STATE');
  assert.equal(state.version, 1);
  assert.equal(state.document.id, 'doc-014');
  assert.equal(state.document.formatVersion, 4);
  assert.equal(state.page.id, 'page-1');
  assert.equal(state.stage, 'compose');
  assert.equal(state.tool, 'select');
  assert.equal(state.selection.count, 1);
  assert.equal(state.selection.items[0].objectId, 'path-1');
  assert.equal(state.selection.items[0].type, 'path');
  assert.equal(state.provenance[0].provenance.kind, 'extraction');
  assert.equal(state.provenance[0].provenance.referenceObjectId, 'reference-1');
  assert.equal(state.revision.revisionId, 'revision-1');
  assert.equal(state.history.undoCount, 2);
  assert.equal(state.staticBrowserLocal, true);
  assert.equal(state.remoteServiceRequired, false);
});

test('Creative Workspace delegates one bounded creative loop without bypassing approval or Revision boundary', async t => {
  const root = fakeRoot();
  const previousDocument = globalThis.document;
  globalThis.document = {
    createElement() { return { value: '', textContent: '' }; }
  };
  t.after(() => {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  });

  root.node('[data-workspace-input="reference-file"]').files = [{ name: 'rose-window.png', type: 'image/png' }];
  root.node('[data-workspace-input="threshold"]').value = '128';
  root.node('[data-workspace-input="overlay"]').value = '0.5';
  root.node('[data-workspace-input="stroke-color"]').value = '#223344';
  root.node('[data-workspace-input="stroke-width"]').value = '3';
  root.node('[data-workspace-input="fill"]').value = '#ccbbaa';
  root.node('[data-workspace-input="material-id"]').value = 'workspace-material';
  root.node('[data-workspace-input="chat-operation"]').value = 'path.repaint.v1';
  root.node('[data-workspace-input="chat-color"]').value = '#aa8866';
  root.node('[data-workspace-input="chat-dx"]').value = '12';
  root.node('[data-workspace-input="chat-dy"]').value = '0';
  root.node('[data-workspace-input="chat-material-id"]').value = 'workspace-material';
  root.node('[data-workspace-input="revision-label"]').value = 'Checkpoint A';

  const calls = [];
  const path = {
    id: 'path-1',
    type: 'path',
    fill: 'none',
    stroke: '#202020',
    strokeWidth: 1.5,
    subpaths: [{ closed: true, anchors: [{}, {}, {}] }],
    metadata: {
      extraction: {
        batchId: 'batch-1',
        referenceObjectId: 'reference-1',
        source: { name: 'rose-window.png' }
      }
    }
  };

  let proposal = null;
  let currentRevision = null;
  let revisions = [];

  const app = {
    doc: { id: 'doc-014', title: 'Workspace Fixture', formatVersion: 4 },
    tool: 'select',
    selection: [{ layerId: 'layer-1', objectId: path.id }],
    page() { return { id: 'page-1', name: 'Page 1', activeLayerId: 'layer-1' }; },
    selectedObjects() { return [{ layer: { id: 'layer-1' }, object: path }]; },
    findObject(ref) {
      if (ref.objectId === path.id) return { layer: { id: 'layer-1' }, object: path };
      return null;
    },
    selectOnly(layerId, objectId) {
      this.selection = [{ layerId, objectId }];
      calls.push(['selectOnly', objectId]);
    },
    fitContent() { calls.push(['fitContent']); },
    history: { pending: false, undoStack: [], redoStack: [] },
    extraction: {
      async decode(file) {
        calls.push(['decode', file.name]);
        return {
          raster: { width: 10, height: 10, data: [] },
          source: { name: file.name, sha256: 'a'.repeat(64) },
          referenceSrc: 'data:image/png;base64,x'
        };
      },
      async extract(request, options) {
        calls.push(['extract', request.parameters.threshold, Boolean(options.signal)]);
        return {
          referenceObjectId: 'reference-1',
          batchId: 'batch-1',
          paths: [path],
          diagnostics: { paths: 1, nodes: 3 }
        };
      },
      overlay(id, opacity) {
        calls.push(['overlay', id, opacity]);
        return { changed: true };
      }
    },
    pathEditing: { active: false },
    enterPathEdit() {
      this.pathEditing.active = true;
      calls.push(['enterPathEdit']);
      return true;
    },
    exitPathEdit() {
      this.pathEditing.active = false;
      calls.push(['exitPathEdit']);
      return true;
    },
    simplifyEditedPath() { calls.push(['simplify']); return { beforeNodeCount: 3, afterNodeCount: 3 }; },
    refineEditedPath() { calls.push(['refine']); return { addedNodeCount: 1 }; },
    setPathStrokeFromBrush(id, overrides) {
      path.expressiveStroke = { color: overrides.color };
      calls.push(['stroke', id, overrides.color, overrides.baseWidth]);
      return { changed: true };
    },
    clearPathExpressiveStroke() {
      path.expressiveStroke = null;
      calls.push(['clearStroke']);
      return { changed: true };
    },
    duplicateSelection() { calls.push(['duplicate']); },
    groupSelection() { calls.push(['group']); },
    frameSelection() { calls.push(['frame']); },
    reorderSelection(where) { calls.push(['reorder', where]); },
    repaintSelectedPaths(patch) {
      path.fill = patch.fill;
      calls.push(['repaint', patch.fill]);
      return { changed: true };
    },
    applySelectedPathMaterial(material) {
      path.materialAppearance = material;
      calls.push(['material', material.templateId]);
      return { changed: true };
    },
    clearSelectedPathMaterial() {
      path.materialAppearance = null;
      calls.push(['clearMaterial']);
      return { changed: true };
    },
    pathStrokeAppearance: {},
    pathRepaintMaterial: {},
    chatBoundedEdit: {
      getProposal(id) {
        return proposal?.proposalId === id ? JSON.parse(JSON.stringify(proposal)) : null;
      }
    },
    chatBoundedEditAdapter: {
      inspect() {
        return { ok: true, result: { objects: [{ id: path.id }], revision: { revisionId: currentRevision } } };
      },
      propose(task) {
        proposal = {
          proposalId: 'proposal-1',
          state: 'PROPOSED',
          approved: false,
          task,
          revisionId: currentRevision
        };
        calls.push(['propose', task.operation, task.targets.length]);
        return { ok: true, result: JSON.parse(JSON.stringify(proposal)) };
      },
      approve(id) {
        proposal.state = 'APPROVED';
        proposal.approved = true;
        proposal.approvalToken = 'token-1';
        calls.push(['approve', id]);
        return { ok: true, result: JSON.parse(JSON.stringify(proposal)) };
      },
      reject(id) {
        proposal.state = 'REJECTED';
        proposal.approved = false;
        proposal.approvalToken = null;
        calls.push(['reject', id]);
        return { ok: true, result: JSON.parse(JSON.stringify(proposal)) };
      },
      execute(id, token) {
        if (token !== 'token-1') return { ok: false, code: 'CHAT_EDIT_APPROVAL_TOKEN_INVALID', phase: 'execute' };
        proposal.state = 'EXECUTED';
        proposal.approved = false;
        proposal.approvalToken = null;
        calls.push(['execute', id]);
        return { ok: true, result: { proposalId: id, operation: proposal.task.operation, changed: true } };
      }
    },
    revisions: {
      revisionIdFor() { return currentRevision; },
      diagnostics() { return { persistence: 'browser-local-store' }; },
      async capture({ label }) {
        currentRevision = 'revision-1';
        revisions = [{ revisionId: 'revision-1', sequence: 1, label, reason: 'workspace' }];
        calls.push(['capture', label]);
        return {
          created: true,
          equivalent: false,
          record: { revisionId: 'revision-1' },
          comparison: {
            equivalent: false,
            objectCounts: { before: 0, after: 1, added: 1, removed: 0, changed: 0, touched: 1 }
          }
        };
      },
      async list() { return revisions; },
      async restore(id) {
        currentRevision = id;
        calls.push(['restore', id]);
        return {
          restored: true,
          revisionId: id,
          documentId: 'doc-014',
          historyBoundary: 'RESET_TO_REVISION',
          structuredDocument: true
        };
      }
    }
  };

  const controller = new CreativeWorkspaceController(app);
  controller.root = root;

  const extraction = await controller.runExtraction();
  assert.equal(extraction.batchId, 'batch-1');
  assert.deepEqual(app.selection, [{ layerId: 'layer-1', objectId: 'path-1' }]);

  assert.equal(controller.runEditAction('enter-path-edit'), true);
  assert.equal(app.pathEditing.active, true);
  assert.ok(controller.runEditAction('apply-expressive-stroke'));
  assert.equal(path.expressiveStroke.color, '#223344');

  assert.ok(controller.runComposeAction('repaint'));
  assert.equal(path.fill, '#ccbbaa');

  const proposed = controller.runChatAction('chat-propose');
  assert.equal(proposed.ok, true);
  assert.equal(proposal.state, 'PROPOSED');

  assert.equal(controller.runChatAction('chat-execute'), null);
  assert.equal(controller.status.code, 'APPROVAL_REQUIRED');
  assert.equal(proposal.state, 'PROPOSED');

  assert.equal(controller.runChatAction('chat-approve').ok, true);
  assert.equal(proposal.state, 'APPROVED');
  const executed = controller.runChatAction('chat-execute');
  assert.equal(executed.ok, true);
  assert.equal(executed.result.changed, true);
  assert.equal(proposal.state, 'EXECUTED');

  const captured = await controller.runRevisionAction('revision-capture');
  assert.equal(captured.record.revisionId, 'revision-1');
  assert.match(root.node('[data-workspace-output="revision"]').textContent, /objects 0→1/);
  assert.match(root.node('[data-workspace-output="revision"]').textContent, /\+1 −0 Δ0/);

  root.node('[data-workspace-input="revision-id"]').value = 'revision-1';
  const restored = await controller.runRevisionAction('revision-restore');
  assert.equal(restored.historyBoundary, 'RESET_TO_REVISION');
  assert.equal(restored.structuredDocument, true);

  assert.deepEqual(calls.filter(call => ['decode', 'extract', 'enterPathEdit', 'stroke', 'repaint', 'propose', 'approve', 'execute', 'capture', 'restore'].includes(call[0])).map(call => call[0]), [
    'decode', 'extract', 'enterPathEdit', 'stroke', 'repaint', 'propose', 'approve', 'execute', 'capture', 'restore'
  ]);
});

test('Creative Workspace source wiring preserves accepted authorities and static/browser-local core', () => {
  const config = readFileSync('product/source/src/config.js', 'utf8');
  const workspace = readFileSync('product/source/src/editor/creative-workspace.js', 'utf8');
  const editorIndex = readFileSync('product/source/src/editor/index.js', 'utf8');
  const extraction = readFileSync('product/source/src/extraction/install.js', 'utf8');
  const ink = readFileSync('product/source/src/ink.js', 'utf8');
  const serviceWorker = readFileSync('product/source/service-worker.js', 'utf8');

  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.match(editorIndex, /creative-workspace\.js/);
  assert.match(extraction, /extractIntoDocument/);
  assert.match(extraction, /setReferenceOverlay/);
  assert.doesNotMatch(extraction, /document\.querySelector|createElement\(|innerHTML\s*=/);

  assert.match(ink, /installExtraction\(this\);installPathEditing\(this\);installExpressiveStroke\(this\);installRepaintMaterial\(this\);installRevision\(this,\{store:this\.store\}\);installChatBoundedEdit\(this\);installCreativeWorkspace\(this\)/);
  assert.match(ink, /creativeWorkspace\?\.refresh\?\.\(\)/);
  assert.match(serviceWorker, /src\/editor\/creative-workspace\.js/);

  assert.match(workspace, /INK-CREATIVE-WORKSPACE-STATE/);
  assert.match(workspace, /this\.app\.enterPathEdit/);
  assert.match(workspace, /this\.app\.repaintSelectedPaths/);
  assert.match(workspace, /chatBoundedEditAdapter/);
  assert.match(workspace, /APPROVAL_REQUIRED/);
  assert.match(workspace, /revisions\.capture/);
  assert.match(workspace, /revisions\.restore/);
  assert.match(workspace, /comparison\?\.objectCounts/);
  assert.match(workspace, /staticBrowserLocal: true/);
  assert.match(workspace, /remoteServiceRequired: false/);

  assert.doesNotMatch(workspace, /this\.app\.doc\s*=/);
  assert.doesNotMatch(workspace, /this\.app\.selection\s*=/);
  assert.doesNotMatch(workspace, /\bfetch\s*\(|\bWebSocket\b|XMLHttpRequest|sendBeacon\s*\(/);
});
