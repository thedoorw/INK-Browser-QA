import test from 'node:test';
import assert from 'node:assert/strict';
import { Quadtree, PageSpatialIndex } from '../../src/spatial/index.js';

test('quadtree returns only intersecting items', () => {
  const tree = new Quadtree({ x: 0, y: 0, w: 100, h: 100 }, { capacity: 1, maxDepth: 5 });
  tree.insert({ id: 'a', bounds: { x: 5, y: 5, w: 10, h: 10 } });
  tree.insert({ id: 'b', bounds: { x: 70, y: 70, w: 10, h: 10 } });
  assert.deepEqual(tree.query({ x: 0, y: 0, w: 30, h: 30 }).map(item => item.id), ['a']);
  assert.ok(tree.countNodes() > 1);
});

test('page spatial index retains layer and z-order metadata', () => {
  const page = {
    id: 'p',
    layers: [
      { id: 'l1', visible: true, objects: [{ id: 'a', bounds: { x: 0, y: 0, w: 10, h: 10 } }] },
      { id: 'l2', visible: true, objects: [{ id: 'b', bounds: { x: 30, y: 30, w: 10, h: 10 } }] }
    ]
  };
  const index = new PageSpatialIndex().rebuild(page, object => object.bounds);
  const result = index.query({ x: 25, y: 25, w: 30, h: 30 });
  assert.equal(result.length, 1);
  assert.equal(result[0].object.id, 'b');
  assert.equal(result[0].layerIndex, 1);
  assert.equal(index.stats().objects, 2);
});

test('page spatial index updates one object incrementally', () => {
  const page = {
    id: 'p2',
    layers: [{ id: 'l', visible: true, objects: [
      { id: 'a', bounds: { x: 0, y: 0, w: 10, h: 10 } },
      { id: 'b', bounds: { x: 40, y: 40, w: 10, h: 10 } }
    ] }]
  };
  const index = new PageSpatialIndex().rebuild(page, object => object.bounds);
  page.layers[0].objects[0].bounds = { x: 70, y: 70, w: 10, h: 10 };
  assert.equal(index.syncObject(page, 'a', object => object.bounds), true);
  assert.equal(index.query({ x: 0, y: 0, w: 20, h: 20 }).length, 0);
  assert.deepEqual(index.query({ x: 65, y: 65, w: 20, h: 20 }).map(item => item.object.id), ['a']);
  assert.equal(index.stats().fullRebuilds, 1);
  assert.equal(index.stats().incrementalUpdates, 1);
});
