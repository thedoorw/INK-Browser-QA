import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { createPath } from '../product/source/src/vector/vector-core.js';
import {
  CHAT_EDIT_OPERATIONS,
  ChatBoundedEditController,
  createChatBoundedEditAdapter,
  normalizeChatEditTask
} from '../product/source/src/editor/chat-bounded-edit.js';
import { resolveInkCapabilityDescriptor } from '../product/source/src/agent/index.js';

const clone = value => JSON.parse(JSON.stringify(value));

function makeApp(pathId = 'path-1') {
  const doc = defaultDocument(), page = doc.pages[0], layer = page.layers[0];
  doc.id = 'b4-doc';
  page.id = 'page-1';
  doc.activePageId = page.id;
  layer.id = 'layer-1';
  page.activeLayerId = layer.id;
  layer.objects = [createPath({
    id: pathId,
    name: pathId,
    fill: '#cc6677',
    stroke: '#202020',
    subpaths: [{
      role: 'outer',
      closed: true,
      anchors: [
        { x: 20, y: 20 },
        { x: 140, y: 20 },
        { x: 140, y: 120 },
        { x: 20, y: 120 }
      ]
    }]
  })];
  const app = {
    doc,
    selection: [],
    spatialDirty: false,
    page() { return this.doc.pages[0]; },
    layer() { return this.page().layers[0]; },
    pagePath(p = this.page()) {
      const index = this.doc.pages.indexOf(p);
      return index < 0 ? null : ['pages', index];
    },
    objectPath(found) {
      const base = this.pagePath();
      return !found || !base ? null : [...base, ...found.path];
    },
    findObject(ref) { return findPageObject(this.page(), ref); },
    queueSpatialObject() {},
    refreshAll() {},
    refreshSelectionUI() {},
    renderer: { render() {} },
    markDirty() {},
    updateHistoryUI() {},
    replaceDocument(next) { this.doc = clone(next); }
  };
  app.history = new HistoryManager(app);
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  return app;
}

function ref(app, id = 'path-1') {
  const found = findPageObject(app.page(), id);
  assert.ok(found, id);
  return { pageId: app.page().id, layerId: found.layer.id, objectId: id };
}

function task(id, operation, target, args) {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId: id,
    operation,
    targets: [target],
    arguments: args
  };
}

function run(app, raw) {
  const adapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  const proposed = adapter.propose(raw);
  assert.equal(proposed.ok, true, JSON.stringify(proposed));
  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true, JSON.stringify(approved));
  const executed = adapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true, JSON.stringify(executed));
  return executed.result;
}

test('B4 Path deformation operations are bounded discoverable capabilities without format change', () => {
  assert.equal(FORMAT_VERSION, 4);
  for (const operation of ['path.warp.v1', 'path.distort.v1', 'path.perspective.v1']) {
    assert.ok(CHAT_EDIT_OPERATIONS.includes(operation), operation);
    const descriptor = resolveInkCapabilityDescriptor(operation);
    assert.equal(descriptor?.availability, true, operation);
    assert.equal(descriptor?.namedTool, 'propose_ink_edit');
    assert.equal(descriptor?.publicMethod, 'edit.propose');
    assert.deepEqual(descriptor?.targetTypes, ['Path']);
    assert.doesNotThrow(() => JSON.stringify(descriptor));
  }
  assert.throws(
    () => normalizeChatEditTask(task('warp-noop', 'path.warp.v1', { pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }, { strength: 0 })),
    error => error?.code === 'CHAT_EDIT_NO_OP'
  );
});

test('path.warp.v1 reuses reversible native deformation and scoped History', () => {
  const app = makeApp();
  const before = clone(findPageObject(app.page(), 'path-1').object.subpaths);
  const out = run(app, task('warp', 'path.warp.v1', ref(app), { strength: .45, maxDisplacement: .35 }));
  const warped = findPageObject(app.page(), 'path-1').object;

  assert.equal(out.targets[0].ref.objectId, 'path-1');
  assert.equal(warped.deformation?.type, 'INK-NON-DESTRUCTIVE-DEFORMATION');
  assert.equal(warped.deformation?.reversible, true);
  assert.notDeepEqual(warped.subpaths, before);
  assert.equal(app.history.undoStack.at(-1)?.label, 'CHAT warp Path');

  assert.equal(app.history.undo(), true);
  const undone = findPageObject(app.page(), 'path-1').object;
  assert.deepEqual(undone.subpaths, before);
  assert.equal(Boolean(undone.deformation), false);

  assert.equal(app.history.redo(), true);
  const redone = findPageObject(app.page(), 'path-1').object;
  assert.equal(redone.deformation?.type, 'INK-NON-DESTRUCTIVE-DEFORMATION');
  assert.notDeepEqual(redone.subpaths, before);
});

for (const operation of ['path.distort.v1', 'path.perspective.v1']) {
  test(operation + ' reuses native projective mapping, preserves stable Path identity, and is undoable', () => {
    const app = makeApp();
    const before = clone(findPageObject(app.page(), 'path-1').object.subpaths);
    const out = run(app, task(operation, operation, ref(app), { xOffset: 12, yOffset: 6 }));
    const changed = findPageObject(app.page(), 'path-1').object;

    assert.equal(out.targets[0].ref.objectId, 'path-1');
    assert.equal(changed.id, 'path-1');
    assert.notDeepEqual(changed.subpaths, before);
    assert.equal(Boolean(changed.deformation), false);
    assert.equal(app.history.undoStack.at(-1)?.label, operation === 'path.distort.v1' ? 'CHAT distort Path' : 'CHAT perspective Path');

    assert.equal(app.history.undo(), true);
    assert.deepEqual(findPageObject(app.page(), 'path-1').object.subpaths, before);
    assert.equal(app.history.redo(), true);
    assert.notDeepEqual(findPageObject(app.page(), 'path-1').object.subpaths, before);
  });
}
