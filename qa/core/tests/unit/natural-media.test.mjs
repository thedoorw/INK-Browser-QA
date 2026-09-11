import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildNaturalMediaStamps, isNaturalMediaStroke, naturalMediaFingerprint,
  naturalMediaRasterScale, NaturalMediaController
} from '../../src/render/index.js';

const stroke = (overrides = {}) => ({
  id: 'ink-stroke', type: 'stroke', kind: 'brush', color: '#202020', size: 18,
  opacity: 1, pressure: .9, taper: .3, flow: .8, wetness: .6, bristle: .3,
  smoothing: .4, points: [
    { x: 0, y: 0, p: .2 }, { x: 30, y: -10, p: .8 },
    { x: 70, y: 18, p: 1 }, { x: 120, y: 0, p: .3 }
  ], ...overrides
});

test('natural media detection only accepts GPU media kinds', () => {
  assert.equal(isNaturalMediaStroke(stroke()), true);
  assert.equal(isNaturalMediaStroke(stroke({ kind: 'drybrush' })), true);
  assert.equal(isNaturalMediaStroke(stroke({ kind: 'airbrush' })), true);
  assert.equal(isNaturalMediaStroke(stroke({ kind: 'pen' })), false);
});

test('natural media stamps include pressure-aware raster bounds', () => {
  const result = buildNaturalMediaStamps(stroke());
  assert.ok(result.stamps.length >= 4);
  assert.ok(result.bounds.w > 120);
  assert.ok(result.bounds.h > 20);
  assert.ok(result.stamps.some(item => item.pressure > .9));
});

test('natural media fingerprint changes with media settings and points', () => {
  const base = naturalMediaFingerprint(stroke(), 2);
  assert.notEqual(base, naturalMediaFingerprint(stroke({ wetness: .9 }), 2));
  assert.notEqual(base, naturalMediaFingerprint(stroke({ points: [{ x: 0, y: 0, p: .5 }, { x: 20, y: 0, p: .5 }] }), 2));
});

test('raster scale protects the GPU maximum dimension', () => {
  assert.equal(naturalMediaRasterScale({ x: 0, y: 0, w: 100, h: 50 }, 2, 3072), 2);
  assert.ok(naturalMediaRasterScale({ x: 0, y: 0, w: 5000, h: 10 }, 2, 3072) < 1);
});

test('controller exposes deterministic Canvas fallback preference', () => {
  const controller = new NaturalMediaController({ preference: 'canvas2d' });
  const diagnostics = controller.diagnostics();
  assert.equal(diagnostics.preference, 'canvas2d');
  assert.equal(diagnostics.activeBackend, 'canvas2d');
  assert.equal(controller.setPreference('invalid'), false);
  assert.equal(controller.setPreference('auto'), true);
  controller.dispose();
});

test('WebGL renderer reports an unavailable context without throwing', async () => {
  const { WebGLNaturalMediaRenderer } = await import('../../src/render/webgl/natural-media-webgl.js');
  const renderer = new WebGLNaturalMediaRenderer({
    canvasFactory: () => ({ addEventListener() {}, getContext() { return null; } })
  });
  assert.equal(renderer.initialize(), false);
  assert.equal(renderer.diagnostics().state, 'unavailable');
  assert.match(renderer.diagnostics().lastError, /WebGL2 context unavailable/);
});
