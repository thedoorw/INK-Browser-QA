import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { Matrix } from '../product/source/src/core/index.js';
import { createFrame, defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import {
  CHAT_EDIT_OPERATIONS,
  ChatBoundedEditController,
  createChatBoundedEditAdapter
} from '../product/source/src/editor/chat-bounded-edit.js';
import {
  createAnchor,
  createPath
} from '../product/source/src/vector/vector-core.js';
import { resolveInkCapabilityDescriptor } from '../product/source/src/agent/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const C2A_TOTAL = [
  'path.repaint.v1',
  'path.material.apply.v1',
  'path.material.remove.v1',
  'object.translate.v1',
  'path.simplify.v1',
  'path.refine.v1',
  'path.create.v1',
  'path.edit.v1',
  'object.rotate.v1',
  'object.clone.v1',
  'repeat.radial.v1',
  'boolean.apply.v1',
  'group.create.v1',
  'object.reparent.v1',
  'frame.create.v1',
  'text.create.v1',
  'text.edit.v1',
  'svg.import.v1',
  'object.resize.v1',
  'object.scale.v1',
  'object.order.v1'
];

const C2B = [
  'repeat.mirror.v1',
  'repeat.grid.v1',
  'layout.frame.set.v1',
  'layout.frame.remove.v1',
  'layout.item.set.v1',
  'layout.item.remove.v1'
];

function makeApp() {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  doc.id = 'c2b-doc';
  page.id = 'page-1';
  doc.activePageId = page.id;
  layer.id = 'layer-1';
  page.activeLayerId = layer.id;
  layer.objects = [];

  const source = createPath({
    id: 'source-path',
    name: 'Source',
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

  const child = createPath({
    id: 'frame-child',
    name: 'Frame Child',
    subpaths: [{
      role: 'outer',
      closed: true,
      anchors: [
        createAnchor(0, 0),
        createAnchor(20, 0),
        createAnchor(20, 12),
        createAnchor(0, 12)
      ]
    }],
    fill: '#aaa',
    stroke: 'none',
    strokeWidth: 0
  });

  const frame = createFrame({
    id: 'frame-1',
    name: 'Frame',
    matrix: Matrix.translate(100, 40),
    width: 240,
    height: 160,
    children: [child]
  });
  child.parentId = frame.id;
  layer.objects.push(source, frame);

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
    renderer: {
      render() {},
      objectWorldBounds(object, parentWorldMatrix = Matrix.identity()) {
        const matrix = Matrix.toWorld(parentWorldMatrix, object?.matrix || Matrix.identity());
        if (object?.type === 'frame') return { x: matrix[4], y: matrix[5], w: object.width, h: object.height };
        if (object?.type === 'path') return { x: matrix[4], y: matrix[5], w: 40, h: 30 };
        return { x: matrix[4], y: matrix[5], w: 20, h: 20 };
      }
    },
    revisions: {
      revisionIdFor() { return null; }
    }
  };
  app.history = new HistoryManager(app);
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  app.chatBoundedEditAdapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  return app;
}

function task(id, operation, targets, args) {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId: id,
    operation,
    targets,
    arguments: args
  };
}

function ref(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  assert.ok(found, objectId);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function run(app, raw) {
  const proposed = app.chatBoundedEditAdapter.propose(raw);
  assert.equal(proposed.ok, true, JSON.stringify(proposed));
  const before = app.history.undoStack.length;
  const approved = app.chatBoundedEditAdapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true, JSON.stringify(approved));
  const executed = app.chatBoundedEditAdapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true, JSON.stringify(executed));
  assert.equal(app.history.undoStack.length, before + 1);
  return executed.result;
}

test('C2-B preserves exact C2-A prefix and owns the exact six-operation C2-B segment', () => {
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(0, C2A_TOTAL.length), C2A_TOTAL);
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(C2A_TOTAL.length, C2A_TOTAL.length + C2B.length), C2B);
  assert.ok(CHAT_EDIT_OPERATIONS.length >= 27);
  assert.equal(CHAT_EDIT_OPERATIONS.includes('repeat.expand.v1'), false);
  assert.equal(FORMAT_VERSION, 4);
  for (const operation of C2B) {
    const descriptor = resolveInkCapabilityDescriptor(operation);
    assert.equal(descriptor?.availability, true, operation);
    assert.ok(descriptor?.inputSchema, operation);
  }
  assert.equal(resolveInkCapabilityDescriptor('repeat.expand.v1'), null);
});

test('mirror and grid Repeat use native Repeat objects and preserve source', () => {
  const app = makeApp();
  const sourceRef = ref(app, 'source-path');

  let result = run(app, task('mirror', 'repeat.mirror.v1', [sourceRef], {
    axis: 'y',
    center: { x: 20, y: 15 },
    linked: true
  }));
  const mirrorId = result.targets[0].ref.objectId;
  const mirror = findPageObject(app.page(), mirrorId).object;
  assert.equal(mirror.type, 'repeat');
  assert.equal(mirror.mode, 'mirror');
  assert.equal(mirror.axis, 'y');
  assert.equal(mirror.sourceObjectId, 'source-path');
  assert.ok(findPageObject(app.page(), 'source-path'));

  result = run(app, task('grid', 'repeat.grid.v1', [sourceRef], {
    columns: 3,
    rows: 2,
    dx: 50,
    dy: 40,
    linked: true
  }));
  const gridId = result.targets[0].ref.objectId;
  const grid = findPageObject(app.page(), gridId).object;
  assert.equal(grid.type, 'repeat');
  assert.equal(grid.mode, 'grid');
  assert.equal(grid.columns, 3);
  assert.equal(grid.rows, 2);
  assert.equal(grid.count, 6);
  assert.ok(findPageObject(app.page(), 'source-path'));
});

test('FrameLayout and LayoutItem set/remove route through native History-backed authorities', () => {
  const app = makeApp();
  const frameRef = ref(app, 'frame-1');
  const childRef = ref(app, 'frame-child');

  run(app, task('frame-layout-set', 'layout.frame.set.v1', [frameRef], {
    mode: 'horizontal',
    gap: 12,
    padding: { top: 8, right: 10, bottom: 8, left: 10 },
    align: { main: 'center', cross: 'stretch' },
    sizing: { horizontal: 'fixed', vertical: 'hug' }
  }));
  let frame = findPageObject(app.page(), 'frame-1').object;
  assert.equal(frame.layout.schema, 'INK-LAYOUT-1');
  assert.equal(frame.layout.mode, 'horizontal');
  assert.equal(frame.layout.gap, 12);

  run(app, task('item-layout-set', 'layout.item.set.v1', [childRef], {
    participation: 'flow',
    sizing: { horizontal: 'fill', vertical: 'hug' },
    fixedSize: { width: 120, height: 36 },
    constraints: { horizontal: 'stretch', vertical: 'center' }
  }));
  let child = findPageObject(app.page(), 'frame-child').object;
  assert.equal(child.layoutItem.schema, 'INK-LAYOUT-ITEM-1');
  assert.equal(child.layoutItem.sizing.horizontal, 'fill');
  assert.equal(child.layoutItem.constraints.horizontal, 'stretch');

  run(app, task('item-layout-remove', 'layout.item.remove.v1', [childRef], {}));
  child = findPageObject(app.page(), 'frame-child').object;
  assert.equal(child.layoutItem, undefined);

  run(app, task('frame-layout-remove', 'layout.frame.remove.v1', [frameRef], {}));
  frame = findPageObject(app.page(), 'frame-1').object;
  assert.equal(frame.layout, undefined);
  assert.equal(app.history.undoStack.length, 4);
});

test('C2-B rejects invalid target/type and bounded grid overflow', () => {
  const app = makeApp();
  const sourceRef = ref(app, 'source-path');

  let proposed = app.chatBoundedEditAdapter.propose(task('too-many', 'repeat.grid.v1', [sourceRef], {
    columns: 64,
    rows: 64,
    dx: 10,
    dy: 10
  }));
  assert.equal(proposed.ok, false);
  assert.equal(proposed.code, 'CHAT_EDIT_ARGUMENTS_BOUNDS');

  proposed = app.chatBoundedEditAdapter.propose(task('bad-frame', 'layout.frame.set.v1', [sourceRef], {
    mode: 'horizontal'
  }));
  assert.equal(proposed.ok, true);
  const approved = app.chatBoundedEditAdapter.approve(proposed.result.proposalId);
  const executed = app.chatBoundedEditAdapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, false);
  assert.equal(executed.code, 'CHAT_EDIT_FRAME_REQUIRED');
});

test('C2-B source boundary reuses layout setters and does not expose Repeat expand commit semantics', async () => {
  const [boundedSource, registrySource, layoutSource, vectorSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/editor/chat-bounded-edit.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/capability-registry.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/document/layout.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/vector/vector-core.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);

  assert.match(boundedSource, /setFrameLayout\(app,/);
  assert.match(boundedSource, /setChildLayoutItem\(app,/);
  assert.match(boundedSource, /createRepeat\(source\.object,/);
  assert.doesNotMatch(boundedSource, /repeat\.expand\.v1/);
  assert.match(vectorSource, /export function expandRepeat/);
  assert.match(layoutSource, /function transact\(app,/);
  assert.match(layoutSource, /app\.history\.pushScoped/);

  const c2bSource = [boundedSource, registrySource].join('\n');
  assert.doesNotMatch(c2bSource, /\beval\s*\(|new\s+Function\s*\(|\bFunction\s*\(|WebSocket|XMLHttpRequest|sendBeacon/i);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
  assert.equal(FORMAT_VERSION, 4);
});

console.log('INK-TECH-CLOSURE-001 C2-B focused QA: PASS');
