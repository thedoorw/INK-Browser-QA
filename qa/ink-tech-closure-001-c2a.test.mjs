import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { Matrix } from '../product/source/src/core/index.js';
import { defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import {
  CHAT_EDIT_OPERATIONS,
  ChatBoundedEditController,
  createChatBoundedEditAdapter
} from '../product/source/src/editor/chat-bounded-edit.js';
import {
  createInkPublicCreativeApi,
  getInkNamedToolDefinitions,
  resolveInkCapabilityDescriptor
} from '../product/source/src/agent/index.js';
import { resolveInkOutputPayload } from '../product/source/src/agent/output-handle-registry.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clone = value => JSON.parse(JSON.stringify(value));

const C1 = [
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
  'object.reparent.v1'
];

const C2A = [
  'frame.create.v1',
  'text.create.v1',
  'text.edit.v1',
  'svg.import.v1',
  'object.resize.v1',
  'object.scale.v1',
  'object.order.v1'
];

function makeApp() {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  doc.id = 'c2a-doc';
  page.id = 'page-1';
  doc.activePageId = page.id;
  layer.id = 'layer-1';
  page.activeLayerId = layer.id;
  layer.objects = [];

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
    replaceDocument(next) { this.doc = clone(next); },
    renderer: {
      render() {},
      objectWorldBounds(object, parentWorldMatrix = Matrix.identity()) {
        const matrix = Matrix.toWorld(parentWorldMatrix, object?.matrix || Matrix.identity());
        const width = object?.type === 'frame' ? Number(object.width) : Number(object?.w || 20);
        const height = object?.type === 'frame' ? Number(object.height) : Number(object?.h || 20);
        return { x: matrix[4], y: matrix[5], w: Math.max(1, width || 20), h: Math.max(1, height || 20) };
      }
    },
    revisions: {
      revisionIdFor() { return null; }
    },
    async exportPNG() {
      this.lastPNGExportReport = { width: 32, height: 24 };
      return new Blob([new Uint8Array([137, 80, 78, 71, 1, 2, 3])], { type: 'image/png' });
    },
    exportSVG() {
      return '<svg xmlns="http://www.w3.org/2000/svg"><rect width="10" height="10"/></svg>';
    },
    async exportPDF() {
      return new Blob([new Uint8Array([37, 80, 68, 70, 45, 49])], { type: 'application/pdf' });
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

function run(adapter, raw) {
  const proposed = adapter.propose(raw);
  assert.equal(proposed.ok, true, JSON.stringify(proposed));
  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true, JSON.stringify(approved));
  const executed = adapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true, JSON.stringify(executed));
  return executed.result;
}

test('C2-A preserves C1 prefix and owns the exact seven-operation C2-A segment', () => {
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(0, C1.length), C1);
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(C1.length, C1.length + C2A.length), C2A);
  assert.ok(CHAT_EDIT_OPERATIONS.length >= 21);
  assert.equal(FORMAT_VERSION, 4);
  for (const operation of C2A) {
    const descriptor = resolveInkCapabilityDescriptor(operation);
    assert.equal(descriptor?.availability, true, operation);
    assert.ok(descriptor?.inputSchema, operation);
  }
});

test('zero-target Frame/Text/SVG proposals are mutation-neutral until explicit approval', () => {
  const app = makeApp();
  const adapter = app.chatBoundedEditAdapter;
  for (const candidate of [
    task('frame-propose', 'frame.create.v1', [], { x: 10, y: 20, width: 100, height: 80 }),
    task('text-propose', 'text.create.v1', [], { text: 'INK', x: 4, y: 8 }),
    task('svg-propose', 'svg.import.v1', [], { svg: '<svg><rect id="r1" width="10" height="10"/></svg>' })
  ]) {
    const before = JSON.stringify({ doc: app.doc, undo: app.history.undoStack.length, redo: app.history.redoStack.length });
    const proposed = adapter.propose(candidate);
    assert.equal(proposed.ok, true, JSON.stringify(proposed));
    assert.equal(JSON.stringify({ doc: app.doc, undo: app.history.undoStack.length, redo: app.history.redoStack.length }), before);
    const blocked = adapter.execute(proposed.result.proposalId, 'not-approved');
    assert.equal(blocked.ok, false);
    assert.equal(JSON.stringify({ doc: app.doc, undo: app.history.undoStack.length, redo: app.history.redoStack.length }), before);
  }
});

test('Frame and Text operations use native editable objects under History with stable ids', () => {
  const app = makeApp();
  const adapter = app.chatBoundedEditAdapter;
  let result = run(adapter, task('frame', 'frame.create.v1', [], { name: 'Frame A', x: 10, y: 20, width: 120, height: 90 }));
  const frameId = result.targets[0].ref.objectId;
  const frame = findPageObject(app.page(), frameId).object;
  assert.equal(frame.type, 'frame');
  assert.equal(frame.width, 120);
  assert.equal(frame.height, 90);

  result = run(adapter, task('text', 'text.create.v1', [], {
    text: 'Hello',
    x: 30,
    y: 40,
    color: '#123456',
    fontFamily: 'system-ui',
    fontSize: 24,
    lineHeight: 1.5,
    fontWeight: 600
  }));
  const textId = result.targets[0].ref.objectId;
  let textObject = findPageObject(app.page(), textId).object;
  assert.equal(textObject.type, 'text');
  assert.equal(textObject.text, 'Hello');
  assert.equal(textObject.fontWeight, 600);

  run(adapter, task('text-edit', 'text.edit.v1', [ref(app, textId)], {
    text: 'Edited',
    color: '#654321',
    fontSize: 30,
    x: 50
  }));
  textObject = findPageObject(app.page(), textId).object;
  assert.equal(textObject.id, textId);
  assert.equal(textObject.text, 'Edited');
  assert.equal(textObject.color, '#654321');
  assert.equal(textObject.fontSize, 30);
  assert.equal(textObject.matrix[4], 50);
  assert.equal(app.history.undoStack.length, 3);
});

test('SVG import stays structured/local and rejects executable or network-bearing SVG requests', () => {
  const app = makeApp();
  const adapter = app.chatBoundedEditAdapter;
  const svg = '<svg xmlns="http://www.w3.org/2000/svg"><g id="g1"><rect id="r1" x="0" y="0" width="20" height="10"/><text id="t1" x="2" y="8">INK</text></g></svg>';
  const result = run(adapter, task('svg', 'svg.import.v1', [], { svg }));
  assert.ok(result.targets.length >= 1);
  assert.ok(findPageObject(app.page(), 'g1'));
  assert.ok(findPageObject(app.page(), 'r1'));
  assert.ok(findPageObject(app.page(), 't1'));

  for (const unsafe of [
    '<svg><script>alert(1)</script></svg>',
    '<svg><image href="https://example.com/a.png"/></svg>',
    '<svg><rect onload="alert(1)"/></svg>'
  ]) {
    const before = JSON.stringify(app.doc);
    const proposed = adapter.propose(task('unsafe-' + unsafe.length, 'svg.import.v1', [], { svg: unsafe }));
    assert.equal(proposed.ok, false);
    assert.equal(JSON.stringify(app.doc), before);
  }
});

test('resize, scale and order reuse existing transform and parent-array semantics', () => {
  const app = makeApp();
  const adapter = app.chatBoundedEditAdapter;
  const first = run(adapter, task('f1', 'frame.create.v1', [], { name: 'F1', x: 0, y: 0, width: 100, height: 80 })).targets[0].ref.objectId;
  const second = run(adapter, task('f2', 'frame.create.v1', [], { name: 'F2', x: 200, y: 0, width: 50, height: 50 })).targets[0].ref.objectId;

  run(adapter, task('resize', 'object.resize.v1', [ref(app, first)], { width: 160, preserveAspect: true }));
  let frame = findPageObject(app.page(), first).object;
  assert.equal(frame.width, 160);
  assert.equal(frame.height, 128);

  const beforeMatrix = [...frame.matrix];
  run(adapter, task('scale', 'object.scale.v1', [ref(app, first)], { sx: 2, sy: 0.5, center: { x: 0, y: 0 } }));
  frame = findPageObject(app.page(), first).object;
  assert.notDeepEqual(frame.matrix, beforeMatrix);
  assert.equal(Matrix.isInvertible(frame.matrix), true);

  run(adapter, task('back', 'object.order.v1', [ref(app, second)], { action: 'back' }));
  assert.equal(app.layer().objects[0].id, second);
  run(adapter, task('front', 'object.order.v1', [ref(app, second)], { action: 'front' }));
  assert.equal(app.layer().objects.at(-1).id, second);
});

test('export_ink_asset returns existing lifecycle handle without Document/History/Revision mutation', async () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const before = JSON.stringify({
    doc: app.doc,
    undo: app.history.undoStack.length,
    redo: app.history.redoStack.length,
    revision: app.revisions.revisionIdFor(app.doc.id)
  });

  const tools = getInkNamedToolDefinitions();
  assert.equal(tools.length, 21);
  assert.equal(tools.at(-1).name, 'export_ink_asset');
  assert.equal(tools.filter(item => item.name === 'export_ink_asset').length, 1);

  for (const [format, editable] of [['png', false], ['svg', true], ['pdf', false]]) {
    const exported = await api.tools.invoke('export_ink_asset', { format, scope: 'artboard' });
    assert.equal(exported.status, 'COMPLETED', JSON.stringify(exported));
    assert.equal(exported.outputHandles.length, 1);
    const handle = exported.outputHandles[0];
    assert.equal(handle.schema, 'INK_OUTPUT_HANDLE');
    assert.equal(handle.version, 1);
    assert.equal(handle.format, format);
    assert.equal(handle.editable, editable);
    assert.ok(handle.byteLength > 0);
    assert.ok(resolveInkOutputPayload(app, handle.handleId) instanceof Blob);

    const inspected = api.asset.inspect({ handleId: handle.handleId });
    assert.equal(inspected.result.available, true);
    const released = api.asset.release({ handleId: handle.handleId });
    assert.equal(released.result.found, true);
    assert.equal(released.result.released, true);
    assert.equal(resolveInkOutputPayload(app, handle.handleId), null);
  }

  assert.equal(JSON.stringify({
    doc: app.doc,
    undo: app.history.undoStack.length,
    redo: app.history.redoStack.length,
    revision: app.revisions.revisionIdFor(app.doc.id)
  }), before);
});

test('C2-A source boundary preserves shared UI Text path and forbidden-execution constraints', async () => {
  const [inkSource, textSource, boundedSource, registrySource, publicSource, exportSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/ink.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/editor/text-object.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/editor/chat-bounded-edit.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/capability-registry.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/public-creative-api.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/export-asset.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);

  assert.match(inkSource, /createTextObject/);
  assert.match(inkSource, /updateTextObject/);
  assert.doesNotMatch(inkSource, /object=\{id:uid\(\),type:'text'/);
  assert.match(textSource, /createTextObject/);
  assert.match(textSource, /updateTextObject/);

  const c2aSource = [boundedSource, registrySource, publicSource, exportSource, textSource].join('\n');
  assert.doesNotMatch(c2aSource, /\beval\s*\(|new\s+Function\s*\(|\bFunction\s*\(|WebSocket|XMLHttpRequest|sendBeacon|postMessage/i);
  assert.doesNotMatch(publicSource, /app\.doc\s*=|\.doc\s*=\s*JSON/i);
  assert.match(exportSource, /app\.exportPNG/);
  assert.match(exportSource, /app\.exportSVG/);
  assert.match(exportSource, /app\.exportPDF/);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
  assert.equal(FORMAT_VERSION, 4);
});

console.log('INK-TECH-CLOSURE-001 C2-A focused QA: PASS');
