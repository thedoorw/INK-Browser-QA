import test from 'node:test';
import assert from 'node:assert/strict';
import { lassoCandidates, marqueeCandidates, polygonBounds } from '../../src/editor/index.js';

const entries = [
  { object: { id: 'inside' }, bounds: { x: 10, y: 10, w: 10, h: 10 } },
  { object: { id: 'cross' }, bounds: { x: 18, y: 18, w: 20, h: 20 } }
];
const index = { query: () => entries };
const screenBounds = object => entries.find(entry => entry.object === object).bounds;

test('marquee preserves contain versus intersect semantics', () => {
  const box = { x: 0, y: 0, w: 25, h: 25 };
  assert.deepEqual(marqueeCandidates(index, box, box, 'contain', screenBounds).map(x => x.object.id), ['inside']);
  assert.deepEqual(marqueeCandidates(index, box, box, 'intersect', screenBounds).map(x => x.object.id), ['inside', 'cross']);
});

test('lasso candidate filtering uses object bounds features', () => {
  const polygon = [{ x: 0, y: 0 }, { x: 30, y: 0 }, { x: 30, y: 30 }, { x: 0, y: 30 }];
  const selected = lassoCandidates(index, polygon, polygonBounds(polygon), object => screenBounds(object));
  assert.deepEqual(selected.map(x => x.object.id), ['inside', 'cross']);
});
