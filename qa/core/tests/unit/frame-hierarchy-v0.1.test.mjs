import test from 'node:test';
import assert from 'node:assert/strict';
import {
  Matrix, transformBounds
} from '../../../../product/source/src/core/index.js';
import {
  createFrame, defaultDocument, findPageObject, migrateDocument, reparentPageObject, inspectDocument
} from '../../../../product/source/src/document/index.js';
import { applyWorldTransform } from '../../../../product/source/src/editor/index.js';
import { PageSpatialIndex } from '../../../../product/source/src/spatial/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { buildDependencyGraph } from '../../../../product/source/src/recompute/dependency-graph.js';
import { createAnchor, createPath, vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';

const roundMatrix = matrix => matrix.map(value => Number(value.toFixed(8)));

function makeShape(id, x = 0, y = 0) {
  return { id, type: 'shape', name: id, matrix: Matrix.translate(x, y), opacity: 1, shape: 'rect', w: 20, h: 10, color: '#000', fill: false };
}

function boundsFor(object, entry) {
  const local = object.type === 'frame'
    ? { x: 0, y: 0, w: object.width, h: object.height }
    : { x: 0, y: 0, w: object.w || 20, h: object.h || 10 };
  return transformBounds(local, entry.worldMatrix);
}

test('frame migration preserves IDs and establishes ordered parent ownership', () => {
  const doc = defaultDocument();
  const group = { id: 'group-1', type: 'group', name: 'Group', matrix: Matrix.identity(), opacity: 1, children: [makeShape('group-child', 2, 3)] };
  const frame = createFrame({ id: 'frame-1', width: 300, height: 200, children: [
    { id: 'stroke-1', type: 'stroke', name: 'Stroke', matrix: Matrix.translate(10,20), opacity: 1, color: '#202020', size: 4, kind: 'pen', points: [{x:0,y:0,p:.5,t:0},{x:20,y:10,p:.7,t:10}] },
    { id: 'text-1', type: 'text', text: 'T', matrix: Matrix.translate(30, 20), opacity: 1 },
    { id: 'image-1', type: 'image', src: 'data:image/png;base64,AA==', w: 10, h: 10, matrix: Matrix.identity(), opacity: 1 },
    group,
    { id: 'path-1', type: 'path', name: 'Path', matrix: Matrix.identity(), opacity: 1, subpaths: [] }
  ] });
  doc.pages[0].layers[0].objects.push(frame);
  const migrated = migrateDocument(JSON.parse(JSON.stringify(doc)));
  const saved = migrated.pages[0].layers[0].objects[0];
  assert.equal(saved.id, 'frame-1');
  assert.deepEqual(saved.children.map(child => child.id), ['stroke-1','text-1','image-1','group-1','path-1']);
  assert.ok(saved.children.every(child => child.parentId === 'frame-1'));
  assert.equal(saved.children[3].children[0].parentId, 'group-1');
  assert.equal(inspectDocument(migrated).passed, true);
});

test('reparent preserves world appearance and frame transform carries child geometry', () => {
  const doc = defaultDocument();
  const page = doc.pages[0], layer = page.layers[0];
  const child = makeShape('child', 100, 50);
  const frame = createFrame({ id: 'frame', matrix: Matrix.multiply(Matrix.translate(40, 20), Matrix.rotate(Math.PI / 6)), width: 200, height: 120 });
  layer.objects.push(child, frame);
  const before = roundMatrix(findPageObject(page, 'child').worldMatrix);
  const nested = reparentPageObject(page, 'child', 'frame');
  assert.deepEqual(roundMatrix(nested.worldMatrix), before);
  assert.equal(nested.object.parentId, 'frame');
  const localBefore = [...nested.object.matrix];
  applyWorldTransform(findPageObject(page, 'frame'), Matrix.translate(25, -15));
  const afterMove = findPageObject(page, 'child');
  assert.deepEqual(roundMatrix(afterMove.object.matrix), roundMatrix(localBefore));
  assert.notDeepEqual(roundMatrix(afterMove.worldMatrix), before);
});

test('hierarchy rejects cyclic frame parenting', () => {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const inner = createFrame({ id: 'inner', width: 80, height: 60 });
  const outer = createFrame({ id: 'outer', width: 200, height: 160, children: [inner] });
  page.layers[0].objects.push(outer);
  assert.throws(() => reparentPageObject(page, 'outer', 'inner'), error => error?.code === 'HIERARCHY_CYCLE');
});

test('spatial index includes frame children with world-space bounds', () => {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const child = makeShape('child', 15, 10);
  const frame = createFrame({ id: 'frame', matrix: Matrix.translate(100, 50), width: 80, height: 60, children: [child] });
  page.layers[0].objects.push(frame);
  const index = new PageSpatialIndex().rebuild(page, boundsFor);
  const hits = index.query({ x: 112, y: 57, w: 30, h: 30 });
  assert.ok(hits.some(item => item.object.id === 'frame'));
  assert.ok(hits.some(item => item.object.id === 'child'));
  const childItem = hits.find(item => item.object.id === 'child');
  assert.equal(childItem.depth, 1);
  assert.deepEqual(childItem.ancestorIds, ['frame']);
  assert.equal(index.stats().nestedObjects, 1);
});

test('history undo/redo restores hierarchy and local transform from reparent', () => {
  const doc = defaultDocument();
  const page = doc.pages[0], layer = page.layers[0];
  layer.objects.push(makeShape('child', 90, 40), createFrame({ id: 'frame', matrix: Matrix.translate(25, 10), width: 140, height: 100 }));
  const app = { doc, updateHistoryUI(){}, markDirty(){}, toast(){}, replaceDocument(next){ this.doc = next; } };
  const history = new HistoryManager(app);
  const before = roundMatrix(findPageObject(page, 'child').worldMatrix);
  history.push('reparent', () => reparentPageObject(app.doc.pages[0], 'child', 'frame'));
  assert.equal(findPageObject(app.doc.pages[0], 'child').parentObject.id, 'frame');
  assert.deepEqual(roundMatrix(findPageObject(app.doc.pages[0], 'child').worldMatrix), before);
  assert.equal(history.undo(), true);
  assert.equal(findPageObject(app.doc.pages[0], 'child').parentObject, null);
  assert.equal(history.redo(), true);
  assert.equal(findPageObject(app.doc.pages[0], 'child').parentObject.id, 'frame');
  assert.deepEqual(roundMatrix(findPageObject(app.doc.pages[0], 'child').worldMatrix), before);
});

test('serialized frame reload preserves hierarchy IDs', () => {
  const doc = defaultDocument();
  doc.pages[0].layers[0].objects.push(createFrame({ id: 'frame', children: [makeShape('child', 4, 5)] }));
  const serialized = JSON.stringify(doc);
  const loaded = migrateDocument(JSON.parse(serialized));
  const frame = findPageObject(loaded.pages[0], 'frame');
  const child = findPageObject(loaded.pages[0], 'child');
  assert.equal(frame.object.id, 'frame');
  assert.equal(child.object.id, 'child');
  assert.equal(child.parentObject.id, 'frame');
});

test('dependency graph sees frame-child hierarchy without changing repeat/material contracts', () => {
  const doc = defaultDocument();
  const repeat = { id: 'repeat-1', type: 'repeat', name: 'Repeat', matrix: Matrix.identity(), opacity: 1, source: makeShape('repeat-source'), mode: 'radial', count: 3, instances: [] };
  const frame = createFrame({ id: 'frame', children: [repeat] });
  doc.pages[0].layers[0].objects.push(frame);
  const migrated = migrateDocument(doc);
  const graph = buildDependencyGraph(migrated);
  assert.ok(graph.nodes.has('object:frame:hierarchy'));
  assert.ok(graph.nodes.has('object:repeat-1:hierarchy'));
  assert.ok(graph.edges.some(edge => edge.from === 'object:frame:hierarchy' && edge.to === 'object:repeat-1:hierarchy'));
  assert.ok(graph.nodes.has('generator:repeat-1'));
});

test('vector SVG export keeps frame and editable path structure', () => {
  const path = createPath({ id: 'vector-path', subpaths: [{ closed: true, anchors: [createAnchor(0,0),createAnchor(20,0),createAnchor(20,20)] }] });
  const frame = createFrame({ id: 'frame-vector', width: 200, height: 100, children: [path] });
  const svg = vectorObjectToSVG(frame, []);
  assert.match(svg, /data-ink-type="frame"/);
  assert.match(svg, /data-frame-width="200"/);
  assert.match(svg, /<path/);
  assert.doesNotMatch(svg, /<image/);
});
