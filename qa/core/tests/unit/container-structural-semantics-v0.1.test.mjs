import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix, transformBounds } from '../../../../product/source/src/core/index.js';
import {
  comparePageObjectHitOrder, createFrame, defaultDocument, defaultLayer, findPageObject,
  inspectDocument, migrateDocument, normalizeObject, reparentPageObject, walkPageObjects
} from '../../../../product/source/src/document/index.js';
import { applyWorldTransform } from '../../../../product/source/src/editor/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { PageSpatialIndex } from '../../../../product/source/src/spatial/index.js';
import { vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';

const round = value => Number(value.toFixed(8));
const roundMatrix = matrix => matrix.map(round);
const shape = (id, x = 0, y = 0, opacity = 1) => ({
  id, type: 'shape', name: id, matrix: Matrix.translate(x, y), opacity,
  shape: 'rect', w: 20, h: 10, color: '#000', fill: false
});

test('Group inside Frame participates in structural transforms and inherited state while Group children stay interaction-atomic', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  layer.opacity = .5;
  const group = {
    id: 'group-in-frame', type: 'group', name: 'Group', matrix: Matrix.translate(3, 4),
    opacity: .5, visible: true, locked: true, children: [shape('group-child', 2, 3, .5)]
  };
  const frame = createFrame({
    id: 'outer-frame', matrix: Matrix.translate(10, 20), opacity: .8, width: 200, height: 120, children: [group]
  });
  layer.objects.push(frame);
  const migrated = migrateDocument(structuredClone(doc));
  const entries = new Map(walkPageObjects(migrated.pages[0]).map(entry => [entry.object.id, entry]));
  const frameEntry = entries.get('outer-frame');
  const groupEntry = entries.get('group-in-frame');
  const childEntry = entries.get('group-child');

  assert.equal(round(frameEntry.effectiveOpacity), .4);
  assert.equal(round(groupEntry.effectiveOpacity), .2);
  assert.equal(round(childEntry.effectiveOpacity), .1);
  assert.equal(childEntry.effectiveVisible, true);
  assert.equal(childEntry.effectiveLocked, true);
  assert.deepEqual(roundMatrix(childEntry.worldMatrix), roundMatrix(Matrix.translate(15, 27)));
  assert.equal(frameEntry.interactionExposed, true);
  assert.equal(groupEntry.interactionExposed, true);
  assert.equal(childEntry.interactionExposed, false);
  assert.deepEqual(childEntry.ancestorTypes, ['frame', 'group']);
  assert.deepEqual(childEntry.groupAncestorIds, ['group-in-frame']);
});

test('Frame inside Group and nested Group remain structurally traversable without exposing deep Group canvas selection', () => {
  const doc = defaultDocument();
  const innerFrame = createFrame({
    id: 'frame-in-group', matrix: Matrix.translate(7, 9), width: 80, height: 60,
    children: [shape('frame-leaf', 4, 5)]
  });
  const innerGroup = {
    id: 'inner-group', type: 'group', name: 'Inner', matrix: Matrix.translate(2, 3),
    opacity: 1, children: [innerFrame]
  };
  const outerGroup = {
    id: 'outer-group', type: 'group', name: 'Outer', matrix: Matrix.translate(10, 20),
    opacity: 1, children: [innerGroup]
  };
  doc.pages[0].layers[0].objects.push(outerGroup);
  const migrated = migrateDocument(structuredClone(doc));
  const page = migrated.pages[0];
  const frame = findPageObject(page, 'frame-in-group');
  const leaf = findPageObject(page, 'frame-leaf');

  assert.equal(frame.parentObject.id, 'inner-group');
  assert.equal(leaf.parentObject.id, 'frame-in-group');
  assert.deepEqual(roundMatrix(leaf.worldMatrix), roundMatrix(Matrix.translate(23, 37)));
  assert.equal(frame.interactionExposed, false);
  assert.equal(leaf.interactionExposed, false);
  assert.deepEqual(leaf.ancestorIds, ['outer-group', 'inner-group', 'frame-in-group']);
});

test('structural order follows Layer/object/child draw order and preserves normal Frame-before-child selection', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const frame = createFrame({ id: 'frame', children: [shape('a'), shape('b')] });
  layer.objects.push(frame, shape('top-root'));
  const secondLayer = defaultLayer('Layer 2');
  secondLayer.objects.push(shape('second-layer'));
  doc.pages[0].layers.push(secondLayer);
  const migrated = migrateDocument(structuredClone(doc));
  const entries = new Map(walkPageObjects(migrated.pages[0]).map(entry => [entry.object.id, entry]));

  const deepSiblings = [entries.get('a'), entries.get('b')].sort((a, b) => comparePageObjectHitOrder(a, b, { deep: true }));
  assert.deepEqual(deepSiblings.map(entry => entry.object.id), ['b', 'a']);

  const normalFrame = [entries.get('frame'), entries.get('b')].sort((a, b) => comparePageObjectHitOrder(a, b));
  assert.deepEqual(normalFrame.map(entry => entry.object.id), ['frame', 'b']);

  const deepFrame = [entries.get('frame'), entries.get('b')].sort((a, b) => comparePageObjectHitOrder(a, b, { deep: true }));
  assert.deepEqual(deepFrame.map(entry => entry.object.id), ['b', 'frame']);

  const layerOrder = [entries.get('top-root'), entries.get('second-layer')].sort((a, b) => comparePageObjectHitOrder(a, b, { deep: true }));
  assert.deepEqual(layerOrder.map(entry => entry.object.id), ['second-layer', 'top-root']);
});

test('same-Layer reparent preserves Group world transform and core rejects cross-Layer Frame reparent before mutation', () => {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  const group = {
    id: 'movable-group', type: 'group', name: 'Movable', matrix: Matrix.translate(70, 45),
    opacity: 1, children: [shape('inside', 5, 5)]
  };
  const frame = createFrame({ id: 'target-frame', matrix: Matrix.translate(20, 10), width: 100, height: 80 });
  layer.objects.push(group, frame);
  const before = roundMatrix(findPageObject(page, 'movable-group').worldMatrix);
  const moved = reparentPageObject(page, 'movable-group', 'target-frame');
  assert.deepEqual(roundMatrix(moved.worldMatrix), before);
  assert.equal(moved.object.parentId, 'target-frame');

  const other = defaultLayer('Other');
  const foreignFrame = createFrame({ id: 'foreign-frame' });
  other.objects.push(foreignFrame);
  page.layers.push(other);
  const sourceBefore = findPageObject(page, 'movable-group');
  assert.throws(
    () => reparentPageObject(page, 'movable-group', 'foreign-frame'),
    error => error?.code === 'HIERARCHY_CROSS_LAYER_REPARENT'
  );
  assert.equal(findPageObject(page, 'movable-group').parentObject.id, sourceBefore.parentObject.id);
  assert.equal(foreignFrame.children.length, 0);
});

test('migration repairs stale parentId deterministically and rejects duplicate structural IDs or cycles', () => {
  const doc = defaultDocument();
  const top = shape('top');
  top.parentId = 'stale-parent';
  const child = shape('child');
  child.parentId = 'wrong-parent';
  const group = { id: 'group', type: 'group', matrix: Matrix.identity(), opacity: 1, children: [child] };
  doc.pages[0].layers[0].objects.push(top, group);
  const migrated = migrateDocument(structuredClone(doc));
  assert.equal('parentId' in findPageObject(migrated.pages[0], 'top').object, false);
  assert.equal(findPageObject(migrated.pages[0], 'child').object.parentId, 'group');
  assert.equal(findPageObject(migrated.pages[0], 'group').object.visible, true);
  assert.equal(findPageObject(migrated.pages[0], 'group').object.locked, false);

  const duplicate = defaultDocument();
  duplicate.pages[0].layers[0].objects.push(shape('same-id'), shape('same-id'));
  assert.throws(
    () => migrateDocument(structuredClone(duplicate)),
    error => error?.code === 'HIERARCHY_DUPLICATE_ID'
  );

  const cyclic = { id: 'cycle', type: 'group', matrix: Matrix.identity(), opacity: 1, children: [] };
  cyclic.children.push(cyclic);
  assert.throws(() => normalizeObject(cyclic), error => error?.code === 'HIERARCHY_CYCLE');
});

test('integrity detects duplicate ownership safely and Repeat source is not ordinary structural ownership', () => {
  const doc = defaultDocument();
  const shared = shape('shared');
  shared.parentId = 'g1';
  const g1 = { id: 'g1', type: 'group', matrix: Matrix.identity(), opacity: 1, children: [shared] };
  const g2 = { id: 'g2', type: 'group', matrix: Matrix.identity(), opacity: 1, children: [shared] };
  doc.pages[0].layers[0].objects.push(g1, g2);
  const integrity = inspectDocument(doc);
  assert.equal(integrity.passed, false);
  assert.ok(integrity.errors.some(error => error.code === 'duplicate-ownership'));

  const repeatDoc = defaultDocument();
  repeatDoc.pages[0].layers[0].objects.push({
    id: 'repeat', type: 'repeat', matrix: Matrix.identity(), opacity: 1,
    source: shape('repeat-source'), mode: 'radial', count: 3, instances: []
  });
  const migratedRepeat = migrateDocument(structuredClone(repeatDoc));
  assert.ok(findPageObject(migratedRepeat.pages[0], 'repeat'));
  assert.equal(findPageObject(migratedRepeat.pages[0], 'repeat-source'), null);
  assert.equal(migratedRepeat.pages[0].layers[0].objects[0].source.parentId, undefined);
});

test('spatial metadata includes Group descendants structurally but marks them non-interactive', () => {
  const doc = defaultDocument();
  const group = {
    id: 'group', type: 'group', matrix: Matrix.translate(100, 50), opacity: 1,
    children: [shape('child', 10, 10)]
  };
  doc.pages[0].layers[0].objects.push(group);
  const migrated = migrateDocument(structuredClone(doc));
  const index = new PageSpatialIndex().rebuild(migrated.pages[0], (object, entry) => {
    const local = object.type === 'group' ? { x: 0, y: 0, w: 40, h: 30 } : { x: 0, y: 0, w: object.w || 20, h: object.h || 10 };
    return transformBounds(local, entry.worldMatrix);
  });
  const childItem = index.items.find(item => item.object.id === 'child');
  assert.ok(childItem);
  assert.equal(childItem.depth, 1);
  assert.equal(childItem.interactionExposed, false);
  assert.equal(index.stats().nestedObjects, 1);
  assert.equal(index.syncObject(migrated.pages[0], 'child', (object, entry) => {
    const local = object.type === 'group' ? { x: 0, y: 0, w: 40, h: 30 } : { x: 0, y: 0, w: object.w || 20, h: object.h || 10 };
    return transformBounds(local, entry.worldMatrix);
  }), false);
});

test('History undo/redo preserves nested Group transform semantics', () => {
  const doc = defaultDocument();
  const group = {
    id: 'group', type: 'group', matrix: Matrix.translate(10, 10), opacity: 1,
    children: [shape('child', 3, 4)]
  };
  doc.pages[0].layers[0].objects.push(createFrame({ id: 'frame', children: [group] }));
  const migrated = migrateDocument(structuredClone(doc));
  const app = {
    doc: migrated, updateHistoryUI(){}, markDirty(){}, toast(){},
    replaceDocument(next){ this.doc = next; }
  };
  const history = new HistoryManager(app);
  const before = roundMatrix(findPageObject(app.doc.pages[0], 'child').worldMatrix);
  history.push('move-group', () => applyWorldTransform(findPageObject(app.doc.pages[0], 'group'), Matrix.translate(25, -5)));
  const moved = roundMatrix(findPageObject(app.doc.pages[0], 'child').worldMatrix);
  assert.notDeepEqual(moved, before);
  assert.equal(history.undo(), true);
  assert.deepEqual(roundMatrix(findPageObject(app.doc.pages[0], 'child').worldMatrix), before);
  assert.equal(history.redo(), true);
  assert.deepEqual(roundMatrix(findPageObject(app.doc.pages[0], 'child').worldMatrix), moved);
});

test('structured SVG honors hidden Group state without raster flattening', () => {
  const group = {
    id: 'hidden-group', type: 'group', matrix: Matrix.identity(), opacity: .5,
    visible: false, children: []
  };
  assert.equal(vectorObjectToSVG(group, []), '');
});
