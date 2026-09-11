import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildBristleClusters, buildNaturalMediaStamps, deterministicNaturalMediaUnit,
  MultiChannelInkSurface, naturalMediaGrainAt, premultiplyMediaRGBA,
  removeDuplicateNaturalMediaPoints, resampleNaturalMediaPath, sourceOverCoverage
} from '../../src/render/index.js';

const lineStroke = (overrides = {}) => ({
  id: 'wp8a-stroke', type: 'stroke', kind: 'airbrush', color: '#a45a77', size: 28,
  opacity: .8, pressure: .85, taper: .1, flow: .68, wetness: .38, grain: .14,
  bristle: .16, softness: .76, seed: 8127,
  points: [
    { x: 0, y: 0, p: .18, tiltX: 0, tiltY: 0, t: 0 },
    { x: 42, y: 3, p: .82, tiltX: 18, tiltY: -4, t: 20 },
    { x: 86, y: -2, p: .45, tiltX: 6, tiltY: 8, t: 46 }
  ], ...overrides
});

const distances = points => points.slice(1).map((point, index) => Math.hypot(point.x - points[index].x, point.y - points[index].y));
const mean = values => values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);

 test('WP8A duplicate-point removal preserves one finite editable point', () => {
  const points = removeDuplicateNaturalMediaPoints([
    { x: 0, y: 0, p: .2 }, { x: 0, y: 0, p: .6 }, { x: Number.NaN, y: 2 }, { x: 4, y: 0, p: .8 }
  ]);
  assert.equal(points.length, 2);
  assert.equal(points[0].p, .6);
  assert.deepEqual([points[1].x, points[1].y], [4, 0]);
});

 test('WP8A arc-length resampling is continuous and pressure-interpolated', () => {
  const points = resampleNaturalMediaPath(lineStroke());
  assert.ok(points.length > 14);
  const gaps = distances(points);
  assert.ok(gaps.every(gap => gap > .35));
  assert.ok(Math.max(...gaps) / Math.min(...gaps) < 4.5);
  assert.ok(points.some(point => point.p > .75));
  assert.ok(points.some(point => point.p > .3 && point.p < .7));
  assert.ok(points.every(point => Number.isFinite(point.tangentX) && Number.isFinite(point.tangentY)));
});

 test('WP8A adaptive spacing responds to pressure and is not a fixed point interval', () => {
  const low = resampleNaturalMediaPath(lineStroke({ id: 'low', points: [{ x: 0, y: 0, p: .12 }, { x: 100, y: 0, p: .12 }] }));
  const high = resampleNaturalMediaPath(lineStroke({ id: 'high', points: [{ x: 0, y: 0, p: .95 }, { x: 100, y: 0, p: .95 }] }));
  assert.ok(Math.abs(mean(distances(high)) - mean(distances(low))) > .5);
  const rounded = new Set(distances(high).map(value => value.toFixed(2)));
  assert.ok(rounded.size > 3, 'seed-controlled spacing variation should avoid a fixed interval');
});

 test('WP8A sharp turns do not create duplicate or near-zero stamp accumulation', () => {
  const points = resampleNaturalMediaPath(lineStroke({
    id: 'corner', kind: 'brush', size: 22,
    points: [{ x: 0, y: 40, p: .7 }, { x: 40, y: 40, p: .7 }, { x: 40, y: 0, p: .7 }]
  }));
  const gaps = distances(points);
  assert.ok(Math.min(...gaps) >= .4);
  const aroundCorner = points.filter(point => Math.hypot(point.x - 40, point.y - 40) < 7);
  assert.ok(aroundCorner.length <= 8);
  assert.ok(points.some(point => point.curvature > .1));
});

 test('WP8A stamp variation is deterministic and changes with stroke seed', () => {
  const a = buildNaturalMediaStamps(lineStroke()).stamps;
  const b = buildNaturalMediaStamps(lineStroke()).stamps;
  const c = buildNaturalMediaStamps(lineStroke({ seed: 8128 })).stamps;
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.map(item => [item.radiusX, item.opacity]), c.map(item => [item.radiusX, item.opacity]));
  assert.ok(new Set(a.map(item => item.radiusX.toFixed(3))).size > 4);
  assert.ok(new Set(a.map(item => item.opacity.toFixed(3))).size > 4);
});

 test('WP8A continuous grain field is canvas-coordinate stable and has no visible tile period', () => {
  const sample = Array.from({ length: 48 }, (_, index) => naturalMediaGrainAt(index * 3.7, index * 1.9, 91));
  const repeat = Array.from({ length: 48 }, (_, index) => naturalMediaGrainAt(index * 3.7, index * 1.9, 91));
  const shifted = Array.from({ length: 48 }, (_, index) => naturalMediaGrainAt(index * 3.7 + 256, index * 1.9, 91));
  assert.deepEqual(sample, repeat);
  assert.ok(sample.some((value, index) => Math.abs(value - shifted[index]) > .03));
  assert.ok(new Set(sample.map(value => value.toFixed(4))).size > 30);
});

 test('WP8A bristles form uneven deterministic clusters with controlled dropout', () => {
  const stroke = lineStroke({ kind: 'drybrush', bristle: .82, size: 36 });
  const a = buildBristleClusters(stroke), b = buildBristleClusters(stroke);
  assert.deepEqual(a, b);
  assert.ok(a.length >= 7);
  const gaps = a.slice(1).map((item, index) => item.offset - a[index].offset);
  assert.ok(Math.max(...gaps) > Math.min(...gaps) * 1.5);
  assert.ok(a.every(item => item.dropout > 0 && item.dropout < .5));
});

 test('WP8A alpha helpers use source-over coverage and premultiplied color', () => {
  assert.equal(sourceOverCoverage(.5, .5), .75);
  assert.deepEqual(premultiplyMediaRGBA([.8, .4, .2, .5]), [.4, .2, .1, .5]);
  let coverage = 0;
  for (let index = 0; index < 10; index++) coverage = sourceOverCoverage(coverage, .12);
  assert.ok(coverage < 1 && coverage > .7);
});

 test('WP8A multi-channel repeated deposition avoids a singular black alpha node', () => {
  const surface = new MultiChannelInkSurface(64, 64, { paper: { seed: 44, roughness: .4, granulation: .3 } });
  const stamp = { x: 32, y: 32, radiusX: 13, radiusY: 7, angle: .2, pressure: .72, opacity: .86, coverage: .9, grain: .2, bristle: .25 };
  for (let index = 0; index < 8; index++) surface.depositStamp({ ...stamp, x: 31 + index * .28 }, [.8, .25, .35, 1], { flow: .45, wetness: .25, granulation: .18, opacity: .8 });
  const rgba = surface.compositeRGBA();
  const centerAlpha = rgba[(32 * 64 + 32) * 4 + 3];
  const nearAlpha = rgba[(32 * 64 + 28) * 4 + 3];
  assert.ok(centerAlpha > 0 && nearAlpha > 0);
  assert.ok(centerAlpha / nearAlpha < 1.65, 'overlap must not produce a dark isolated knot');
});

 test('WP8A deterministic unit varies by seed, index, and salt', () => {
  const value = deterministicNaturalMediaUnit(7, 3, 11);
  assert.equal(value, deterministicNaturalMediaUnit(7, 3, 11));
  assert.notEqual(value, deterministicNaturalMediaUnit(8, 3, 11));
  assert.notEqual(value, deterministicNaturalMediaUnit(7, 4, 11));
  assert.notEqual(value, deterministicNaturalMediaUnit(7, 3, 12));
});

test('WP8A alpha accumulation test remains bounded and monotonic', () => {
  let coverage = 0;
  const values = [];
  for (let index = 0; index < 24; index++) {
    coverage = sourceOverCoverage(coverage, .11);
    values.push(coverage);
  }
  assert.ok(values.every((value, index) => index === 0 || value > values[index - 1]));
  assert.ok(values.at(-1) < 1);
  assert.ok(values.at(-1) > .9);
});

test('WP8A premultiplied alpha test keeps color channels within coverage', () => {
  const rgba = premultiplyMediaRGBA([.92, .51, .24, .37]);
  assert.equal(rgba[3], .37);
  assert.ok(rgba.slice(0, 3).every(channel => channel >= 0 && channel <= rgba[3]));
});

test('WP8A edge halo test emits transparent black at zero alpha', () => {
  assert.deepEqual(premultiplyMediaRGBA([1, .4, .2, 0]), [0, 0, 0, 0]);
  const edge = premultiplyMediaRGBA([.85, .35, .3, .015]);
  assert.ok(edge[0] <= edge[3] && edge[1] <= edge[3] && edge[2] <= edge[3]);
});
