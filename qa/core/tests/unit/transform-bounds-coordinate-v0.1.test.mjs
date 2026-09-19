import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix } from '../../../../product/source/src/core/index.js';
import {
  applyObjectMatrices, applyWorldTransform, nonSingularScaleComponent
} from '../../../../product/source/src/editor/transform.js';
import {
  collapseTransformRoots, frameWorldGeometryBounds, groupWorldGeometryBounds,
  resizeFrameGeometry, selectionWorldGeometryBounds
} from '../../../../product/source/src/editor/bounds.js';

test('safe inversion rejects singular matrices and preserves reflection', () => {
  assert.equal(Matrix.tryInvert(Matrix.scale(0, 1)), null);
  const reflected = Matrix.scale(-2, 3);
  const inverse = Matrix.tryInvert(reflected);
  assert.ok(inverse);
  assert.deepEqual(
    Matrix.point(inverse, Matrix.point(reflected, { x: 4, y: -5 })),
    { x: 4, y: -5 }
  );
  assert.equal(nonSingularScaleComponent(0), 1e-6);
  assert.equal(nonSingularScaleComponent(-1e-12), -1e-6);
});

test('world transform under singular parent fails before object mutation', () => {
  const object = { id: 'child', matrix: Matrix.translate(3, 4) };
  const before = [...object.matrix];
  const found = {
    object,
    parentWorldMatrix: Matrix.scale(0, 1),
    worldMatrix: Matrix.translate(3, 4)
  };
  assert.throws(
    () => applyWorldTransform(found, Matrix.translate(10, 0)),
    error => error?.code === 'NON_INVERTIBLE_PARENT'
  );
  assert.deepEqual(object.matrix, before);
});

test('multi-object transform is atomic when any parent is non-invertible', () => {
  const a = { id: 'a', matrix: Matrix.translate(1, 2) };
  const b = { id: 'b', matrix: Matrix.translate(3, 4) };
  const found = {
    a: { object: a, parentWorldMatrix: Matrix.identity() },
    b: { object: b, parentWorldMatrix: Matrix.scale(0, 1) }
  };
  const initial = [
    { ref: 'a', matrix: [...a.matrix], parentWorldMatrix: Matrix.identity(), worldMatrix: [...a.matrix] },
    { ref: 'b', matrix: [...b.matrix], parentWorldMatrix: Matrix.scale(0, 1), worldMatrix: [...b.matrix] }
  ];
  assert.throws(
    () => applyObjectMatrices(initial, ref => found[ref], world => Matrix.multiply(Matrix.translate(5, 0), world)),
    error => error?.code === 'NON_INVERTIBLE_PARENT'
  );
  assert.deepEqual(a.matrix, Matrix.translate(1, 2));
  assert.deepEqual(b.matrix, Matrix.translate(3, 4));
});

test('Frame bounds use explicit geometry while Group bounds derive from children', () => {
  const frame = { type: 'frame', matrix: Matrix.translate(10, 20), width: 100, height: 50 };
  assert.deepEqual(frameWorldGeometryBounds(frame), { x: 10, y: 20, w: 100, h: 50 });

  const group = {
    type: 'group',
    matrix: Matrix.translate(5, 7),
    children: [{ id: 'c1' }, { id: 'c2' }]
  };
  const childBounds = new Map([
    ['c1', { x: 5, y: 7, w: 20, h: 10 }],
    ['c2', { x: 30, y: 2, w: 5, h: 30 }]
  ]);
  assert.deepEqual(
    groupWorldGeometryBounds(group, Matrix.identity(), child => childBounds.get(child.id)),
    { x: 5, y: 2, w: 30, h: 30 }
  );
  assert.deepEqual(
    groupWorldGeometryBounds({ ...group, children: [] }),
    { x: 5, y: 7, w: 1, h: 1 }
  );
});

test('selection bounds collapse selected descendants beneath selected ancestors', () => {
  const ancestor = { object: { id: 'frame' }, ancestorIds: [] };
  const child = { object: { id: 'child' }, ancestorIds: ['frame'] };
  assert.deepEqual(collapseTransformRoots([ancestor, child]), [ancestor]);
  const bounds = selectionWorldGeometryBounds(
    [ancestor, child],
    found => found === ancestor
      ? { x: 0, y: 0, w: 10, h: 10 }
      : { x: 100, y: 100, w: 10, h: 10 }
  );
  assert.deepEqual(bounds, { x: 0, y: 0, w: 10, h: 10 });
});

test('Frame geometry resize preserves matrix and child local geometry', () => {
  const child = { id: 'child', matrix: Matrix.translate(8, 9) };
  const frame = {
    type: 'frame',
    matrix: Matrix.multiply(Matrix.translate(20, 30), Matrix.rotate(.4)),
    width: 100,
    height: 50,
    children: [child]
  };
  const matrix = [...frame.matrix];
  const childMatrix = [...child.matrix];

  assert.equal(resizeFrameGeometry(frame, { width: 200, preserveAspect: true }), true);
  assert.equal(frame.width, 200);
  assert.equal(frame.height, 100);
  assert.deepEqual(frame.matrix, matrix);
  assert.deepEqual(child.matrix, childMatrix);
});
