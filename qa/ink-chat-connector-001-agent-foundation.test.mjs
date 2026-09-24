import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject, installRevision } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { PathRepaintMaterialController } from '../product/source/src/editor/repaint-material.js';
import { ChatBoundedEditController, createChatBoundedEditAdapter } from '../product/source/src/editor/chat-bounded-edit.js';
import { createPath } from '../product/source/src/vector/vector-core.js';
import {
  INK_AGENT_RESULT_SCHEMA,
  INK_AGENT_RESULT_VERSION,
  INK_PUBLIC_CREATIVE_API_SCHEMA,
  createInkPublicCreativeApi,
  installInkPublicCreativeApi
} from '../product/source/src/agent/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clone = value => JSON.parse(JSON.stringify(value));

function pathFixture(id = 'path-a') {
  return createPath({
    id,
    fill: '#e6dfcf',
    stroke: '#403b37',
    strokeWidth: 2,
    subpaths: [{
      id: `${id}:outer`,
      closed: true,
      role: 'outer',
      anchors: [
        { id: `${id}:a0`, x: 0, y: 0 },
        { id: `${id}:a1`, x: 20, y: 0 },
        { id: `${id}:a2`, x: 20, y: 20 },
        { id: `${id}:a3`, x: 0, y: 20 }
      ]
    }]
  });
}

function makeApp() {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  const pathObject = pathFixture();
  layer.objects.push(pathObject);

  const calls = {
    decompose: 0,
    bounded: { inspect: 0, propose: 0, approve: 0, execute: 0 }
  };

  const app = {
    doc,
    selection: [{ layerId: layer.id, objectId: pathObject.id }],
    dirty: false,
    draft: null,
    strokeEdit: null,
    page() { return this.doc.pages.find(item => item.id === this.doc.activePageId) || this.doc.pages[0]; },
    layer() { return this.page().layers.find(item => item.id === this.page().activeLayerId) || this.page().layers[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    objectPath(found) { return found ? ['pages', 0, ...found.path] : null; },
    queueSpatialObject() {},
    refreshAll() {},
    refreshSelectionUI() {},
    updateHistoryUI() {},
    markDirty() { this.dirty = true; },
    toast() {},
    renderer: { render() {} },
    replaceDocument(next) { this.doc = next; },
    translateSelection() { throw new Error('not used in Connector-001 focused QA'); }
  };

  app.history = new HistoryManager(app);
  app.pathRepaintMaterial = new PathRepaintMaterialController(app);
  installRevision(app, { store: null });

  const boundedController = new ChatBoundedEditController(app);
  const boundedAdapter = createChatBoundedEditAdapter(boundedController);
  app.chatBoundedEdit = boundedController;
  app.chatBoundedEditAdapter = {
    inspect(...args) { calls.bounded.inspect++; return boundedAdapter.inspect(...args); },
    propose(...args) { calls.bounded.propose++; return boundedAdapter.propose(...args); },
    approve(...args) { calls.bounded.approve++; return boundedAdapter.approve(...args); },
    execute(...args) { calls.bounded.execute++; return boundedAdapter.execute(...args); }
  };

  app.chatReferenceHandoff = {
    async decomposeReference(referenceObjectId, options = {}) {
      calls.decompose++;
      return {
        schema: 'INK-CHAT-REFERENCE-DECOMPOSITION/1',
        version: 1,
        operation: 'reference.decompose.line-color',
        status: 'COMPLETED',
        documentId: app.doc.id,
        sourceReferenceObjectId: referenceObjectId,
        colorLayerId: 'layer-color',
        lineLayerId: 'layer-line',
        colorObjectIds: ['color-1'],
        lineObjectIds: ['line-1'],
        palette: ['#112233'],
        diagnostics: { adapter: 'existing-imagetracerjs', options: clone(options) },
        history: { commit: { valid: true } },
        revision: { before: app.revisions.revisionIdFor(app.doc.id), after: app.revisions.revisionIdFor(app.doc.id) },
        provenance: { status: 'AVAILABLE', eventIds: ['event-1'] }
      };
    }
  };

  return { app, calls, pageId: page.id, layerId: layer.id, objectId: pathObject.id };
}

function editTask(app, taskId = 'connector-repaint') {
  const found = findPageObject(app.page(), 'path-a');
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId,
    operation: 'path.repaint.v1',
    targets: [{ pageId: app.page().id, layerId: found.layer.id, objectId: found.object.id }],
    arguments: { fill: '#b63c36' }
  };
}

test('Public Creative API installs once and exposes deterministic JSON-safe named/capability registries', () => {
  const { app } = makeApp();
  const api = installInkPublicCreativeApi(app);
  assert.equal(api, app.inkPublicApi);
  assert.equal(installInkPublicCreativeApi(app), api);
  assert.equal(api.schema, INK_PUBLIC_CREATIVE_API_SCHEMA);

  const first = api.capabilities();
  const second = api.capabilities();
  assert.equal(first.schema, INK_AGENT_RESULT_SCHEMA);
  assert.equal(first.version, INK_AGENT_RESULT_VERSION);
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.doesNotThrow(() => JSON.stringify(first));

  const requiredTools = [
    'get_ink_capabilities',
    'get_ink_context',
    'get_ink_selection',
    'inspect_ink_objects',
    'decompose_ink_reference',
    'propose_ink_edit',
    'approve_ink_edit',
    'execute_ink_edit',
    'get_ink_history',
    'undo_ink',
    'redo_ink',
    'get_ink_revisions',
    'capture_ink_revision',
    'restore_ink_revision'
  ];
  assert.deepEqual(api.tools.registry().map(item => item.name), requiredTools);
  assert.deepEqual(first.result.namedTools.map(item => item.name), requiredTools);
  const publicMethods = [];
  for (const tool of api.tools.registry()) {
    assert.equal(tool.resultEnvelope, INK_AGENT_RESULT_SCHEMA);
    assert.equal(typeof tool.publicMethod, 'string');
    assert.equal(typeof tool.authoritativeRoute, 'string');
    assert.equal(typeof tool.approvalRequired, 'boolean');
    assert.equal(typeof tool.availability, 'boolean');
    assert.ok(['READ', 'PROPOSAL', 'WRITE'].includes(tool.role));
    const method = tool.publicMethod.split('.').reduce((value, key) => value?.[key], api);
    assert.equal(typeof method, 'function', `missing Public API method for ${tool.name}: ${tool.publicMethod}`);
    publicMethods.push(tool.publicMethod);
  }
  assert.equal(new Set(publicMethods).size, publicMethods.length, 'named tools must map one-to-one to Public API methods');

  const routes = new Set(first.result.capabilities.map(item => item.routingClass));
  for (const expected of ['READ_ONLY', 'NAMED_TOOL', 'PROPOSAL_REQUIRED', 'PROGRAMMABLE_FUTURE', 'UNAVAILABLE']) {
    assert.ok(routes.has(expected), `missing routing class ${expected}`);
  }
  assert.equal(first.result.capabilities.find(item => item.id === 'composition.programmable').availability, false);
  assert.equal(first.result.capabilities.find(item => item.id === 'external.transport').availability, false);
  assert.equal('previewHandle' in first, false);
  assert.equal('renderFingerprint' in first, false);

  const envelopeKeys = [
    'schema', 'version', 'action', 'status',
    'documentId', 'pageId', 'revisionId',
    'targetRefs', 'createdRefs', 'changedRefs',
    'historyReceipt', 'revisionReceipt', 'provenanceReceipt',
    'outputHandles', 'diagnostics', 'result'
  ];
  assert.deepEqual(Object.keys(first), envelopeKeys);
});

test('Document / Selection / Inspect are grounded through Document Bridge and return detached JSON-safe summaries', () => {
  const { app, objectId } = makeApp();
  const api = createInkPublicCreativeApi(app);

  const context = api.context();
  assert.equal(context.status, 'COMPLETED');
  assert.equal(context.result.schema, 'INK-AI-DOCUMENT-BRIDGE');
  assert.equal(context.result.document.id, app.doc.id);
  assert.ok(context.result.objects.some(item => item.ref.objectId === objectId));

  const selection = api.selection();
  assert.equal(selection.status, 'COMPLETED');
  assert.deepEqual(selection.targetRefs.map(ref => ref.objectId), [objectId]);
  assert.deepEqual(selection.result.selection.objectIds, [objectId]);

  const inspect = api.inspect([{ objectId }]);
  assert.equal(inspect.status, 'COMPLETED');
  assert.deepEqual(inspect.result.objects.map(item => item.ref.objectId), [objectId]);

  const before = clone(app.doc);
  context.result.document.title = 'MUTATED COPY';
  context.result.objects[0].name = 'MUTATED COPY';
  inspect.result.objects[0].geometry.kind = 'mutated-copy';
  assert.deepEqual(app.doc, before);
  assert.doesNotThrow(() => JSON.stringify(context));
  assert.doesNotThrow(() => JSON.stringify(selection));
  assert.doesNotThrow(() => JSON.stringify(inspect));

  const viaTool = api.tools.invoke('inspect_ink_objects', { objectIds: [objectId] });
  assert.equal(viaTool.action, 'inspect');
  assert.deepEqual(viaTool.result.objects.map(item => item.ref.objectId), [objectId]);
});

test('Reference decomposition named/public routes delegate only to existing CHAT Reference Handoff', async () => {
  const { app, calls } = makeApp();
  const api = createInkPublicCreativeApi(app);
  const before = clone(app.doc);

  const result = await api.reference.decompose('reference-1', { numberOfColors: 8 });
  assert.equal(calls.decompose, 1);
  assert.equal(result.action, 'reference.decompose');
  assert.equal(result.status, 'COMPLETED');
  assert.deepEqual(result.targetRefs.map(ref => ref.objectId), ['reference-1']);
  assert.deepEqual(result.createdRefs.map(ref => ref.objectId), ['color-1', 'line-1']);
  assert.equal(result.historyReceipt.commit.valid, true);
  assert.equal(result.provenanceReceipt.status, 'AVAILABLE');
  assert.equal(result.result.diagnostics.adapter, 'existing-imagetracerjs');
  assert.deepEqual(app.doc, before, 'connector wrapper must not create a second decomposition mutation path');

  const named = await api.tools.invoke('decompose_ink_reference', { referenceObjectId: 'reference-2', options: { numberOfColors: 6 } });
  assert.equal(calls.decompose, 2);
  assert.equal(named.action, 'reference.decompose');
  assert.equal(named.result.sourceReferenceObjectId, 'reference-2');
});

test('Bounded edit preserves proposal -> explicit approval -> execute authority and invalid execution stays rejected', () => {
  const { app, calls } = makeApp();
  const api = createInkPublicCreativeApi(app);
  const task = editTask(app);
  const before = clone(app.doc);

  const proposed = api.edit.propose(task);
  assert.equal(calls.bounded.propose, 1);
  assert.equal(proposed.status, 'PROPOSED');
  assert.deepEqual(app.doc, before);

  const blocked = api.edit.execute(proposed.result.result.proposalId, 'not-approved');
  assert.equal(calls.bounded.execute, 1);
  assert.equal(blocked.status, 'FAILED');
  assert.ok(blocked.diagnostics.some(item => item.code === 'CHAT_EDIT_APPROVAL_REQUIRED' || item.code === 'CHAT_EDIT_APPROVAL_TOKEN_INVALID'));
  assert.deepEqual(app.doc, before);

  const approved = api.tools.invoke('approve_ink_edit', { proposalId: proposed.result.result.proposalId });
  assert.equal(calls.bounded.approve, 1);
  assert.equal(approved.status, 'APPROVED');
  assert.deepEqual(app.doc, before);
  const approvalToken = approved.result.result.approvalToken;
  assert.equal(typeof approvalToken, 'string');

  const executed = api.tools.invoke('execute_ink_edit', {
    proposalId: proposed.result.result.proposalId,
    approvalToken
  });
  assert.equal(calls.bounded.execute, 2);
  assert.equal(executed.status, 'EXECUTED');
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.equal(app.history.undoStack.at(-1)?.label, 'CHAT repaint Path');
  assert.deepEqual(executed.changedRefs.map(ref => ref.objectId), ['path-a']);
});

test('History facade delegates to the existing HistoryManager and never exposes patch arrays', () => {
  const { app } = makeApp();
  const api = createInkPublicCreativeApi(app);
  const proposed = api.edit.propose(editTask(app, 'history-repaint'));
  const approved = api.edit.approve(proposed.result.result.proposalId);
  api.edit.execute(proposed.result.result.proposalId, approved.result.result.approvalToken);

  const inspect = api.history.inspect();
  assert.equal(inspect.status, 'COMPLETED');
  assert.equal(inspect.result.canUndo, true);
  assert.equal(inspect.result.entries.at(-1).label, 'CHAT repaint Path');
  assert.doesNotMatch(JSON.stringify(inspect), /"forward"|"inverse"/);

  const undo = api.tools.invoke('undo_ink');
  assert.equal(undo.status, 'COMPLETED');
  assert.equal(undo.historyReceipt.applied, true);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#e6dfcf');
  assert.equal(app.history.redoStack.length, 1);

  const redo = api.tools.invoke('redo_ink');
  assert.equal(redo.status, 'COMPLETED');
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.equal(app.history.undoStack.length, 1);
});

test('Revision facade delegates current/list/capture/restore to the existing RevisionController with explicit capture only', async () => {
  const { app } = makeApp();
  const api = createInkPublicCreativeApi(app);
  assert.equal(api.revision.current().result.revisionId, null);

  const first = await api.tools.invoke('capture_ink_revision', { options: { reason: 'connector-qa', label: 'Connector baseline' } });
  assert.equal(first.status, 'COMPLETED');
  const firstId = first.revisionReceipt.revisionId;
  assert.equal(typeof firstId, 'string');
  assert.equal(api.revision.current().result.revisionId, firstId);

  const originalTitle = app.doc.title;
  app.history.push('Connector QA title mutation', () => { app.doc.title = 'Connector QA changed title'; });
  const second = await api.revision.capture({ reason: 'connector-qa', label: 'Connector changed' });
  assert.equal(second.status, 'COMPLETED');
  assert.notEqual(second.revisionReceipt.revisionId, firstId);

  const listed = await api.tools.invoke('get_ink_revisions', {});
  assert.equal(listed.status, 'COMPLETED');
  assert.equal(listed.result.items.length, 2);

  const restored = await api.tools.invoke('restore_ink_revision', { revisionId: firstId });
  assert.equal(restored.status, 'COMPLETED');
  assert.equal(restored.revisionReceipt.revisionId, firstId);
  assert.equal(app.doc.title, originalTitle);
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.revisions.revisionIdFor(app.doc.id), firstId);
});

test('Connector-001 source boundary: one InkApp facade, no arbitrary execution/direct document writes/new globals, FORMAT_VERSION preserved', async () => {
  const [agentSource, inkSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/agent/public-creative-api.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/ink.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);

  assert.equal(FORMAT_VERSION, 4);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
  assert.match(inkSource, /import \{ installInkPublicCreativeApi \} from '\.\/agent\/index\.js'/);
  assert.match(inkSource, /installChatBoundedEdit\(this\);installInkPublicCreativeApi\(this\);/);
  assert.doesNotMatch(agentSource, /\beval\s*\(|\bFunction\s*\(/);
  assert.doesNotMatch(agentSource, /app\.doc\s*=/);
  assert.doesNotMatch(agentSource, /\bwindow\b|globalThis/);
  assert.doesNotMatch(agentSource, /get_ink_preview|screenshot|postMessage|WebSocket|MCP/i);
  assert.doesNotMatch(agentSource, /image_vectorize|ImageTracerJS\s*\(/);
  assert.doesNotMatch(agentSource, /new\s+HistoryManager|new\s+RevisionController|executeExtraction|imageTracerAdapter|createPath\s*\(/);
  assert.equal((inkSource.match(/installInkPublicCreativeApi\(this\)/g) || []).length, 1);
});
