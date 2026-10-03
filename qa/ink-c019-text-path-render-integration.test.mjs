import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { Matrix } from '../product/source/src/core/index.js';
import { defaultDocument, defaultLayer, findPageObject, sanitizeDocument } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { createTextObject } from '../product/source/src/editor/text-object.js';
import { layoutTextOnPath } from '../product/source/src/editor/text-layout.js';
import {
  CHAT_EDIT_OPERATIONS,
  ChatBoundedEditController,
  createChatBoundedEditAdapter,
  normalizeChatEditTask
} from '../product/source/src/editor/chat-bounded-edit.js';
import { resolveInkCapabilityDescriptor } from '../product/source/src/agent/index.js';

const clone = value => JSON.parse(JSON.stringify(value));
const anchor = (x, y, incoming = { x: 0, y: 0 }, outgoing = { x: 0, y: 0 }) => ({ x, y, in: incoming, out: outgoing, mode: 'corner' });

function curvedPath(id = 'curve-1') {
  return {
    id,
    type: 'path',
    name: id,
    matrix: Matrix.identity(),
    opacity: 1,
    fill: 'none',
    stroke: '#888888',
    strokeWidth: 1,
    subpaths: [{
      closed: false,
      role: 'outer',
      anchors: [
        anchor(20, 120, { x: 0, y: 0 }, { x: 45, y: -70 }),
        anchor(120, 45, { x: -45, y: 0 }, { x: 45, y: 0 }),
        anchor(220, 120, { x: -45, y: -70 }, { x: 0, y: 0 })
      ]
    }]
  };
}

function makeApp() {
  const doc = defaultDocument(), page = doc.pages[0], layer = page.layers[0];
  doc.id = 'c019-doc';
  page.id = 'page-1';
  doc.activePageId = page.id;
  layer.id = 'layer-1';
  page.activeLayerId = layer.id;
  layer.objects = [
    curvedPath(),
    createTextObject({ id: 'text-1', text: 'CURVED TEXT', x: 12, y: 18, fontSize: 18, color: '#202020' })
  ];
  const app = {
    doc,
    selection: [],
    spatialDirty: false,
    page() { return this.doc.pages.find(item => item.id === this.doc.activePageId) || this.doc.pages[0]; },
    layer() { return this.page().layers.find(item => item.id === this.page().activeLayerId) || this.page().layers[0]; },
    pagePath(p = this.page()) {
      const index = this.doc.pages.indexOf(p);
      return index < 0 ? null : ['pages', index];
    },
    layerObjectsPath(layer) {
      const page = this.page();
      const pageIndex = this.doc.pages.indexOf(page);
      const layerIndex = page.layers.indexOf(layer);
      return pageIndex < 0 || layerIndex < 0 ? null : ['pages', pageIndex, 'layers', layerIndex, 'objects'];
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

function ref(app, id, layerId = null) {
  const found = findPageObject(app.page(), { objectId: id, ...(layerId ? { layerId } : {}) });
  assert.ok(found, id);
  return { pageId: app.page().id, layerId: found.layer.id, objectId: id };
}

function task(id, operation, targets, args) {
  return { schema: 'INK-CHAT-EDIT-TASK', version: 1, taskId: id, operation, targets, arguments: args };
}

function run(adapter, raw) {
  const proposed = adapter.propose(raw);
  assert.equal(proposed.ok, true, JSON.stringify(proposed));
  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true, JSON.stringify(approved));
  const executed = adapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true, JSON.stringify(executed));
  return executed.result;
}

test('C019 exposes one bounded native Text path relation without format change', () => {
  assert.equal(FORMAT_VERSION, 4);
  assert.ok(CHAT_EDIT_OPERATIONS.includes('text.path.set.v1'));
  const descriptor = resolveInkCapabilityDescriptor('text.path.set.v1');
  assert.equal(descriptor?.availability, true);
  assert.equal(descriptor?.namedTool, 'propose_ink_edit');
  assert.deepEqual(descriptor?.targetTypes, ['Object']);
  assert.ok(descriptor?.constraints.some(item => /type:text/.test(item)));
  assert.throws(
    () => normalizeChatEditTask(task('bad-visible', 'text.path.set.v1', [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'text-1' }], {
      pathRef: { pageId: 'page-1', layerId: 'layer-1', objectId: 'curve-1' },
      overflow: 'visible'
    })),
    error => error?.code === 'CHAT_EDIT_ARGUMENT_INVALID'
  );
});

test('CHAT path attach mutates only Text, keeps type:text, and remains editable', () => {
  const app = makeApp(), adapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  const pathBefore = clone(findPageObject(app.page(), 'curve-1').object);
  const out = run(adapter, task('attach', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-1'),
    startOffset: 8,
    overflow: 'clip'
  }));
  const textObject = findPageObject(app.page(), 'text-1').object;
  assert.equal(textObject.type, 'text');
  assert.equal(textObject.id, 'text-1');
  assert.deepEqual(textObject.pathText, { pathId: 'curve-1', startOffset: 8, overflow: 'clip' });
  assert.deepEqual(findPageObject(app.page(), 'curve-1').object, pathBefore);
  assert.equal(out.history.latestLabel, 'CHAT set Text Path');

  run(adapter, task('edit-after-attach', 'text.edit.v1', [ref(app, 'text-1')], { text: 'EDITABLE' }));
  assert.equal(textObject.text, 'EDITABLE');
  assert.deepEqual(textObject.pathText, { pathId: 'curve-1', startOffset: 8, overflow: 'clip' });

  const pathAtLayout = clone(findPageObject(app.page(), 'curve-1').object);
  const plan = layoutTextOnPath(textObject, pathAtLayout, { measureText: value => value.length * 9 });
  assert.ok(plan.placements.length > 1);
  assert.ok(plan.placements.some(placement => Math.abs(placement.angle) > 0.01));
  assert.deepEqual(findPageObject(app.page(), 'curve-1').object, pathBefore);
});

test('Text path relation is one scoped History entry with exact Undo/Redo restoration', () => {
  const app = makeApp(), adapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  const before = clone(findPageObject(app.page(), 'text-1').object);
  run(adapter, task('attach-history', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-1'),
    startOffset: 16
  }));
  const attached = clone(findPageObject(app.page(), 'text-1').object);
  assert.equal(app.history.undoStack.at(-1)?.label, 'CHAT set Text Path');
  assert.equal(app.history.undo(), true);
  assert.deepEqual(findPageObject(app.page(), 'text-1').object, before);
  assert.equal(app.history.redo(), true);
  assert.deepEqual(findPageObject(app.page(), 'text-1').object, attached);
});

test('referenced native Path remains independently deformable and Text follows retained Path identity', () => {
  const app = makeApp(), adapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  run(adapter, task('attach-before-warp', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-1'),
    startOffset: 5
  }));
  const textObject = findPageObject(app.page(), 'text-1').object;
  const pathObject = findPageObject(app.page(), 'curve-1').object;
  const beforeLayout = layoutTextOnPath(textObject, pathObject, { measureText: () => 10 });
  const beforeSubpaths = clone(pathObject.subpaths);

  run(adapter, task('warp-after-attach', 'path.warp.v1', [ref(app, 'curve-1')], {
    strength: .45,
    maxDisplacement: .35
  }));
  const warpedPath = findPageObject(app.page(), 'curve-1').object;
  const afterLayout = layoutTextOnPath(textObject, warpedPath, { measureText: () => 10 });
  assert.equal(textObject.type, 'text');
  assert.equal(textObject.pathText.pathId, 'curve-1');
  assert.equal(warpedPath.id, 'curve-1');
  assert.notDeepEqual(warpedPath.subpaths, beforeSubpaths);
  assert.notDeepEqual(afterLayout.placements.map(item => [item.x, item.y, item.angle]), beforeLayout.placements.map(item => [item.x, item.y, item.angle]));
});

test('pathText survives JSON serialize/sanitize restore at FORMAT_VERSION 4', () => {
  const app = makeApp(), adapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  run(adapter, task('attach-persist', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-1'),
    startOffset: 11
  }));
  const restored = sanitizeDocument(JSON.parse(JSON.stringify(app.doc)));
  const restoredPage = restored.pages.find(page => page.id === 'page-1');
  const restoredText = findPageObject(restoredPage, 'text-1').object;
  const restoredPath = findPageObject(restoredPage, 'curve-1').object;
  assert.equal(restored.formatVersion, 4);
  assert.equal(restoredText.type, 'text');
  assert.deepEqual(restoredText.pathText, { pathId: 'curve-1', startOffset: 11, overflow: 'clip' });
  assert.ok(layoutTextOnPath(restoredText, restoredPath, { measureText: () => 8 }).placements.length > 0);
});

test('invalid, cross-container, no-op, and stale Path refs are rejected before mutation', () => {
  const app = makeApp(), adapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  let response = adapter.propose(task('missing-path', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: { pageId: 'page-1', layerId: 'layer-1', objectId: 'missing-path' }
  }));
  assert.equal(response.ok, false);
  assert.equal(response.code, 'CHAT_EDIT_PATH_REF_MISSING');

  const layer2 = defaultLayer('Layer 2');
  layer2.id = 'layer-2';
  layer2.objects = [curvedPath('curve-layer-2')];
  app.page().layers.push(layer2);
  response = adapter.propose(task('cross-layer', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-layer-2', 'layer-2')
  }));
  assert.equal(response.ok, false);
  assert.equal(response.code, 'CHAT_EDIT_PATH_TEXT_CONTAINER_MISMATCH');

  run(adapter, task('attach-once', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-1'),
    startOffset: 3
  }));
  response = adapter.propose(task('attach-noop', 'text.path.set.v1', [ref(app, 'text-1')], {
    pathRef: ref(app, 'curve-1'),
    startOffset: 3
  }));
  assert.equal(response.ok, false);
  assert.equal(response.code, 'CHAT_EDIT_NO_OP');

  const singularApp = makeApp(), singularAdapter = createChatBoundedEditAdapter(singularApp.chatBoundedEdit);
  findPageObject(singularApp.page(), 'text-1').object.matrix = [0, 0, 0, 0, 0, 0];
  response = singularAdapter.propose(task('singular-text', 'text.path.set.v1', [ref(singularApp, 'text-1')], {
    pathRef: ref(singularApp, 'curve-1')
  }));
  assert.equal(response.ok, false);
  assert.equal(response.code, 'CHAT_EDIT_TARGET_SINGULAR');

    const staleApp = makeApp(), staleAdapter = createChatBoundedEditAdapter(staleApp.chatBoundedEdit);
  const proposal = staleAdapter.propose(task('stale-path', 'text.path.set.v1', [ref(staleApp, 'text-1')], {
    pathRef: ref(staleApp, 'curve-1'),
    startOffset: 4
  }));
  assert.equal(proposal.ok, true, JSON.stringify(proposal));
  const approval = staleAdapter.approve(proposal.result.proposalId);
  assert.equal(approval.ok, true, JSON.stringify(approval));
  findPageObject(staleApp.page(), 'curve-1').object.subpaths[0].anchors[1].y += 12;
  const executed = staleAdapter.execute(proposal.result.proposalId, approval.result.approvalToken);
  assert.equal(executed.ok, false);
  assert.equal(executed.code, 'CHAT_EDIT_TARGET_STALE');
  assert.equal(findPageObject(staleApp.page(), 'text-1').object.pathText, undefined);
  assert.equal(staleApp.history.undoStack.length, 0);
});

test('formal Renderer source consumes pathText through existing layoutTextOnPath and preserves fallback', async () => {
  const source = await readFile(new URL('../product/source/src/ink.js', import.meta.url), 'utf8');
  assert.match(source, /import \{ layoutTextOnPath \} from '\.\/editor\/text-layout\.js'/);
  assert.match(source, /if\(o\.pathText\?\.pathId\)/);
  assert.match(source, /layoutTextOnPath\(o,pathFound\.object/);
  assert.match(source, /ctx\.translate\(placement\.x,placement\.y\)/);
  assert.match(source, /ctx\.rotate\(placement\.angle\)/);
  assert.match(source, /ctx\.fillText\(placement\.character,-placement\.advance\/2,0\)/);
  assert.match(source, /INK path text render fallback/);
  assert.doesNotMatch(source, /o\.type\s*=\s*['"]path['"]/);
  assert.equal(FORMAT_VERSION, 4);
});
