import test from 'node:test';
import assert from 'node:assert/strict';

import { PageSpatialIndex } from '../product/source/src/spatial/page-spatial-index.js';

function pageWithObjects(count) {
  return {
    id: 'page-1',
    layers: [{
      id: 'layer-1',
      name: 'Layer 1',
      visible: true,
      locked: false,
      opacity: 1,
      objects: Array.from({ length: count }, (_, index) => ({
        id: `object-${index}`,
        type: 'rect',
        visible: true,
        locked: false,
        opacity: 1,
        matrix: [1, 0, 0, 1, (index % 100) * 20, Math.floor(index / 100) * 20],
        w: 10,
        h: 10
      }))
    }]
  };
}

const boundsForObject = object => ({
  x: object.matrix[4],
  y: object.matrix[5],
  w: object.w,
  h: object.h
});

test('small spatial batches retain the existing incremental path', () => {
  const page = pageWithObjects(100);
  const index = new PageSpatialIndex({ capacity: 12 });
  index.rebuild(page, boundsForObject);

  const ids = ['object-0', 'object-1', 'object-2', 'object-3'];
  for (const id of ids) {
    const object = page.layers[0].objects[Number(id.split('-')[1])];
    object.matrix[4] += 3;
  }

  assert.equal(index.syncObjects(page, ids, boundsForObject), true);
  assert.equal(index.stats().fullRebuilds, 1);
  assert.equal(index.stats().incrementalUpdates, 4);
  assert.equal(index.items.length, 100);
  for (const id of ids) {
    const object = page.layers[0].objects[Number(id.split('-')[1])];
    assert.equal(index.itemById.get(id).bounds.x, object.matrix[4]);
  }
});

test('large spatial batches use one existing rebuild instead of K per-object sync passes', () => {
  const page = pageWithObjects(2000);
  const index = new PageSpatialIndex({ capacity: 12 });
  index.rebuild(page, boundsForObject);

  const ids = Array.from({ length: 64 }, (_, index) => `object-${index}`);
  for (const id of ids) {
    const object = page.layers[0].objects[Number(id.split('-')[1])];
    object.matrix[4] += 1;
  }

  let perObjectSyncCalls = 0;
  const originalSyncObject = index.syncObject.bind(index);
  index.syncObject = (...args) => {
    perObjectSyncCalls += 1;
    return originalSyncObject(...args);
  };

  assert.equal(index.syncObjects(page, ids, boundsForObject), true);
  assert.equal(perObjectSyncCalls, 0);
  assert.equal(index.stats().fullRebuilds, 2);
  assert.equal(index.stats().incrementalUpdates, 0);
  assert.equal(index.items.length, 2000);
  assert.equal(index.itemById.size, 2000);
  for (const id of ids) {
    const object = page.layers[0].objects[Number(id.split('-')[1])];
    assert.equal(index.itemById.get(id).bounds.x, object.matrix[4]);
  }
});

test('batch threshold uses unique ids and preserves configured quadtree capacity', () => {
  const page = pageWithObjects(50);
  const index = new PageSpatialIndex({ capacity: 4 });
  index.rebuild(page, boundsForObject);

  assert.equal(index.syncObjects(page, ['object-0', 'object-0', 'object-1', 'object-1'], boundsForObject), true);
  assert.equal(index.stats().fullRebuilds, 1);
  assert.equal(index.stats().incrementalUpdates, 2);

  assert.equal(index.syncObjects(page, ['object-0', 'object-1', 'object-2', 'object-3', 'object-4'], boundsForObject), true);
  assert.equal(index.stats().fullRebuilds, 2);
});

test('large-batch rebuild retains visibility semantics and refreshed query state', () => {
  const page = pageWithObjects(100);
  const index = new PageSpatialIndex({ capacity: 12 });
  index.rebuild(page, boundsForObject);

  page.layers[0].objects[0].visible = false;
  const ids = Array.from({ length: 16 }, (_, value) => `object-${value}`);
  for (let value = 1; value < 16; value += 1) page.layers[0].objects[value].matrix[4] += 2;

  assert.equal(index.syncObjects(page, ids, boundsForObject), true);
  assert.equal(index.itemById.has('object-0'), false);
  assert.equal(index.items.length, 99);

  const moved = page.layers[0].objects[1];
  const hits = index.query({ x: moved.matrix[4], y: moved.matrix[5], w: moved.w, h: moved.h });
  assert.ok(hits.some(item => item.object.id === moved.id));
});
