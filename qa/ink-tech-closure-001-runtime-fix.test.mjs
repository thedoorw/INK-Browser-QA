import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { Matrix } from '../product/source/src/core/index.js';
import { createFrame, defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { ChatBoundedEditController, createChatBoundedEditAdapter, CHAT_EDIT_OPERATIONS } from '../product/source/src/editor/chat-bounded-edit.js';
import { createAnchor, createPath } from '../product/source/src/vector/vector-core.js';
import { createInkPublicCreativeApi } from '../product/source/src/agent/public-creative-api.js';
import { createCreativeIntelligenceContextAdapter } from '../product/source/src/ai/creative-intelligence-context.js';
import { ToolCallRouter } from '../product/source/src/ai/chat-runtime.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const C2C = [
  'component.register.v1',
  'component.instance.create.v1',
  'component.override.set.v1',
  'component.override.reset.v1',
  'component.instance.detach.v1',
  'component.definition.duplicate.v1',
  'component.reference.repair.v1'
];

function makeApp() {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  doc.id = 'runtime-fix-doc';
  page.id = 'page-1';
  doc.activePageId = page.id;
  layer.id = 'layer-1';
  page.activeLayerId = layer.id;
  layer.objects = [];

  const sourceChild = createPath({
    id: 'component-source-child',
    name: 'Source Child',
    subpaths: [{
      role: 'outer',
      closed: true,
      anchors: [
        createAnchor(0, 0),
        createAnchor(40, 0),
        createAnchor(40, 30),
        createAnchor(0, 30)
      ]
    }],
    fill: '#ddd',
    stroke: '#222',
    strokeWidth: 1
  });
  const sourceFrame = createFrame({
    id: 'component-source-root',
    name: 'Source Root',
    matrix: Matrix.translate(20, 20),
    width: 120,
    height: 90,
    children: [sourceChild]
  });
  sourceChild.parentId = sourceFrame.id;
  layer.objects.push(sourceFrame);

  const app = {
    doc,
    selection: [],
    spatialDirty: false,
    page() { return this.doc.pages[0]; },
    layer() { return this.page().layers.find(item => item.id === this.page().activeLayerId) || this.page().layers[0]; },
    pagePath(p = this.page()) {
      const index = this.doc.pages.indexOf(p);
      return index < 0 ? null : ['pages', index];
    },
    layerPath(l = this.layer(), p = this.page()) {
      const base = this.pagePath(p);
      const index = p.layers.indexOf(l);
      return !base || index < 0 ? null : [...base, 'layers', index];
    },
    layerObjectsPath(l = this.layer(), p = this.page()) {
      const base = this.layerPath(l, p);
      return base ? [...base, 'objects'] : null;
    },
    objectPath(found) {
      const base = this.pagePath();
      return !found || !base ? null : [...base, ...found.path];
    },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    queueSpatialObject() {},
    refreshAll() {},
    refreshSelectionUI() {},
    markDirty() {},
    updateHistoryUI() {},
    renderer: { render() {} },
    revisions: {
      records: new Map(),
      revisionIdFor() { return 'revision-fixed'; }
    }
  };
  app.history = new HistoryManager(app);
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  app.chatBoundedEditAdapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  return app;
}

function ref(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  assert.ok(found, objectId);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function readOnlySnapshot(app) {
  return JSON.stringify({
    document: app.doc,
    history: {
      undo: app.history?.undoStack?.length || 0,
      redo: app.history?.redoStack?.length || 0,
      pending: Boolean(app.history?.pending)
    },
    revision: app.revisions?.revisionIdFor?.(app.doc?.id) ?? null
  });
}

test('A: component.register single-step browser route uses bounded edit named tools without weakening plan contract', async () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const frameRef = ref(app, 'component-source-root');
  const beforeProposal = readOnlySnapshot(app);

  const proposed = await api.tools.invoke('propose_ink_edit', {
    task: {
      schema: 'INK-CHAT-EDIT-TASK',
      version: 1,
      taskId: 'runtime-fix-component-register',
      operation: 'component.register.v1',
      targets: [frameRef],
      arguments: { name: 'Runtime Fix Component' }
    }
  });
  assert.equal(proposed.status, 'PROPOSED', JSON.stringify(proposed));
  assert.equal(readOnlySnapshot(app), beforeProposal);
  const proposalId = proposed.result?.result?.proposalId;
  assert.ok(proposalId);

  const beforeBlocked = readOnlySnapshot(app);
  const blocked = await api.tools.invoke('execute_ink_edit', {
    proposalId,
    approvalToken: 'not-approved'
  });
  assert.equal(blocked.status, 'FAILED');
  assert.equal(blocked.diagnostics?.[0]?.code, 'CHAT_EDIT_APPROVAL_REQUIRED');
  assert.equal(readOnlySnapshot(app), beforeBlocked);

  const approved = await api.tools.invoke('approve_ink_edit', { proposalId });
  assert.equal(approved.status, 'APPROVED');
  const approvalToken = approved.result?.result?.approvalToken;
  assert.match(approvalToken, /^INK-LOCAL-APPROVAL:/);

  const beforeUndoCount = app.history.undoStack.length;
  const executed = await api.tools.invoke('execute_ink_edit', { proposalId, approvalToken });
  assert.equal(executed.status, 'EXECUTED', JSON.stringify(executed));
  assert.equal(executed.result?.result?.state, 'EXECUTED');
  assert.equal(app.history.undoStack.length, beforeUndoCount + 1);
  assert.equal(executed.result?.result?.history?.afterUndoCount, executed.result?.result?.history?.beforeUndoCount + 1);

  const definition = app.doc.components?.definitions?.at(-1);
  assert.ok(definition?.id);
  assert.equal(definition.sourceRootId, frameRef.objectId);
  assert.equal(CHAT_EDIT_OPERATIONS.length, 34);
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(-7), C2C);

  const creativePlanSource = await readFile(path.join(root, 'product/source/src/editor/chat-creative-plan.js'), 'utf8');
  assert.match(creativePlanSource, /raw\.steps\.length\s*<\s*2/);
});

test('B: get_grounded_creative_context OBSERVE is mutation-neutral for Document History Revision and grounds selection', async () => {
  const app = makeApp();
  const selected = ref(app, 'component-source-child');
  app.selection = [selected];

  const provider = createCreativeIntelligenceContextAdapter({
    getDocument: () => app.doc,
    getSelectedObjectIds: () => app.selection.map(item => item.objectId),
    getRevisionId: () => app.revisions.revisionIdFor(app.doc.id),
    getRevisionRecords: () => [],
    getHistoryEntries: () => []
  });
  const router = new ToolCallRouter({
    layer: {},
    auditBridge: { record() {} },
    groundedContextProvider: provider
  });

  const before = readOnlySnapshot(app);
  const result = await router.route({
    id: 'runtime-fix-grounded-read',
    name: 'get_grounded_creative_context',
    arguments: {}
  }, { permission: 'OBSERVE', scope: 'CURRENT_DOCUMENT', sessionId: 'runtime-fix' });

  assert.equal(result.status, 'COMPLETED', JSON.stringify(result));
  assert.equal(result.result?.authority?.documentWrite, false);
  assert.equal(result.result?.authority?.historyWrite, false);
  assert.equal(result.result?.authority?.revisionWrite, false);
  assert.deepEqual(result.result?.modules?.documentBridge?.context?.selection?.objectIds, ['component-source-child']);
  assert.equal(readOnlySnapshot(app), before);

  const source = await readFile(path.join(root, 'product/source/src/ai/creative-intelligence-context.js'), 'utf8');
  assert.match(source, /document:\s*clone\(getDocument\(\)\)/);
});

console.log('INK-TECH-CLOSURE-001 runtime focused fix regression: PASS');
