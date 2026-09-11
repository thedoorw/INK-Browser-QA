import test from 'node:test';
import assert from 'node:assert/strict';
import {
  eraseStrokeWithCircle,
  nearestStrokeNode,
  nearestStrokeSegment,
  simplifyStrokePoints,
  splitStrokeAtSegment
} from '../../src/stroke/index.js';

const stroke = {
  id: 's1', type: 'stroke', matrix: [1,0,0,1,0,0], opacity: 1,
  color: '#000', size: 8, kind: 'pen', smoothing: .5, pressure: .8,
  points: [
    { x: 0, y: 0, p: .3, t: 0 },
    { x: 50, y: 0, p: .6, t: 20 },
    { x: 100, y: 0, p: .9, t: 40 }
  ]
};

test('nearest node and segment return precise edit targets', () => {
  assert.equal(nearestStrokeNode(stroke.points, { x: 49, y: 1 }, 4).index, 1);
  const segment = nearestStrokeSegment(stroke.points, { x: 75, y: 2 }, 5);
  assert.equal(segment.index, 1);
  assert.ok(segment.t > .45 && segment.t < .55);
});

test('split stroke preserves two editable fragments', () => {
  let id = 0;
  const parts = splitStrokeAtSegment(stroke, 0, .5, () => `new-${++id}`);
  assert.equal(parts.length, 2);
  assert.equal(parts[0].points.at(-1).x, 25);
  assert.equal(parts[1].points[0].x, 25);
  assert.notEqual(parts[0].id, parts[1].id);
});

test('circle eraser cuts through long segments even without a source node inside', () => {
  let id = 0;
  const result = eraseStrokeWithCircle(stroke, { x: 50, y: 0 }, 10, () => `e-${++id}`);
  assert.equal(result.changed, true);
  assert.equal(result.fragments.length, 2);
  assert.ok(result.fragments[0].points.at(-1).x < 50);
  assert.ok(result.fragments[1].points[0].x > 50);
});

test('simplification keeps endpoints while reducing redundant nodes', () => {
  const points = Array.from({ length: 21 }, (_, index) => ({ x: index * 5, y: Math.sin(index) * .05 }));
  const simplified = simplifyStrokePoints(points, .2);
  assert.equal(simplified[0].x, 0);
  assert.equal(simplified.at(-1).x, 100);
  assert.ok(simplified.length < points.length);
});

import {
  clearStrokeSegmentStyle,
  insertStrokeNode,
  moveStrokeHandle,
  sampleStrokePath,
  setStrokeNodeMode,
  setStrokeSegmentStyle
} from '../../src/stroke/index.js';

test('Bezier node insertion preserves the original curve while adding editable handles', () => {
  const curved = structuredClone(stroke);
  curved.points[0].out = { x: 20, y: 35 };
  curved.points[1].in = { x: -20, y: 35 };
  curved.points[0].mode = 'smooth';
  curved.points[1].mode = 'smooth';
  const before = sampleStrokePath(curved, 2);
  const index = insertStrokeNode(curved, 0, .5);
  const after = sampleStrokePath(curved, 2);
  assert.equal(index, 1);
  assert.equal(curved.points.length, 4);
  assert.ok(curved.points[index].in && curved.points[index].out);
  const midpointBefore = before.reduce((best, point) => Math.abs(point.segmentT - .5) < Math.abs(best.segmentT - .5) ? point : best);
  const inserted = curved.points[index];
  assert.ok(Math.hypot(midpointBefore.x - inserted.x, midpointBefore.y - inserted.y) < 2);
  const maxDeviation = before.reduce((max, point) => Math.max(max, Math.min(...after.map(candidate => Math.hypot(candidate.x - point.x, candidate.y - point.y)))), 0);
  assert.ok(maxDeviation < 2.5);
});

test('node modes and handle movement preserve tangent rules', () => {
  const curved = structuredClone(stroke);
  setStrokeNodeMode(curved, 1, 'symmetric');
  const point = curved.points[1];
  assert.equal(point.mode, 'symmetric');
  moveStrokeHandle(curved, 1, 'out', { x: point.x + 30, y: point.y + 10 });
  assert.deepEqual(point.in, { x: -30, y: -10 });
  setStrokeNodeMode(curved, 1, 'corner');
  assert.deepEqual(point.in, { x: 0, y: 0 });
  assert.deepEqual(point.out, { x: 0, y: 0 });
});

test('segment style overrides remain local and can be cleared', () => {
  const styled = structuredClone(stroke);
  setStrokeSegmentStyle(styled, 1, { color: '#ff0000', size: 16 });
  assert.equal(styled.segmentStyles[1].color, '#ff0000');
  assert.equal(styled.segmentStyles[0].color, undefined);
  clearStrokeSegmentStyle(styled, 1);
  assert.equal(styled.segmentStyles, undefined);
});
