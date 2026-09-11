import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix, boundsContains, boundsIntersect, transformBounds } from '../../src/core/index.js';

test('matrix inversion restores a point', () => {
  const matrix = Matrix.multiply(Matrix.translate(40, -12), Matrix.rotate(Math.PI / 5));
  const point = { x: 14, y: -8 };
  const mapped = Matrix.point(matrix, point);
  const restored = Matrix.point(Matrix.invert(matrix), mapped);
  assert.ok(Math.abs(restored.x - point.x) < 1e-9);
  assert.ok(Math.abs(restored.y - point.y) < 1e-9);
});

test('bounds helpers preserve CAD selection semantics', () => {
  const outer = { x: 0, y: 0, w: 100, h: 100 };
  assert.equal(boundsContains(outer, { x: 10, y: 10, w: 30, h: 30 }), true);
  assert.equal(boundsContains(outer, { x: 90, y: 90, w: 20, h: 20 }), false);
  assert.equal(boundsIntersect(outer, { x: 90, y: 90, w: 20, h: 20 }), true);
});

test('transformBounds applies affine translation', () => {
  assert.deepEqual(transformBounds({ x: 0, y: 0, w: 20, h: 10 }, Matrix.translate(5, 7)),
    { x: 5, y: 7, w: 20, h: 10 });
});
