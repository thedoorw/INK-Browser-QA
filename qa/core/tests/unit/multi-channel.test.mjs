import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildPaperField, paperSampleAt, normalizePaperProfile,
  MultiChannelInkSurface, Canvas2DMultiChannelInkRenderer,
  WebGLMultiChannelInkRenderer
} from '../../src/render/index.js';

const stamp = (overrides = {}) => ({
  x: 16, y: 16, radiusX: 7, radiusY: 5, angle: 0,
  pressure: .8, seed: .2, grain: .2, bristle: .1, ...overrides
});

const stroke = (id, color, y = 0) => ({
  id, type: 'stroke', kind: 'brush', color, size: 12, opacity: 1,
  pressure: .9, taper: .2, flow: .82, wetness: .72, grain: .18, bristle: .2,
  matrix: [1, 0, 0, 1, 0, y], points: [
    { x: 0, y: 0, p: .35 }, { x: 20, y: -4, p: .8 }, { x: 42, y: 2, p: .55 }
  ]
});

test('paper profile is deterministic and exposes material variation', () => {
  const paper = normalizePaperProfile({ seed: 91, absorbency: .7, roughness: .6 });
  const a = paperSampleAt(17.5, -4.25, paper);
  const b = paperSampleAt(17.5, -4.25, paper);
  const c = paperSampleAt(91, 33, paper);
  assert.deepEqual(a, b);
  assert.notEqual(a.height, c.height);
  assert.ok(a.absorbency >= 0 && a.absorbency <= 1);
  const field = buildPaperField(8, 6, { paper, originX: -2, originY: 4, scale: 1.5 });
  assert.equal(field.absorbency.length, 48);
  assert.ok(field.stats.maxAbsorbency > field.stats.minAbsorbency);
});

test('multi-channel surface deposits pigment and diffuses water', () => {
  const surface = new MultiChannelInkSurface(32, 32, { paper: { absorbency: .65, roughness: .4 } });
  surface.depositStamp(stamp(), [0.1, 0.1, 0.1, 1], { flow: .9, wetness: .9, opacity: 1 });
  const beforeWetPixels = surface.water.reduce((count, value) => count + (value > .001 ? 1 : 0), 0);
  surface.simulate({ steps: 4, diffusion: .28, evaporation: .01, deposition: .12 });
  const afterWetPixels = surface.water.reduce((count, value) => count + (value > .001 ? 1 : 0), 0);
  assert.ok(surface.stats.depositedPigment > 0);
  assert.ok(surface.stats.depositedWater > 0);
  assert.ok(afterWetPixels > 0);
  assert.notEqual(afterWetPixels, beforeWetPixels);
  assert.equal(surface.stats.simulationSteps, 4);
  assert.ok(surface.deposit.some(value => value > 0));
});

test('overlapping wet strokes retain mixed pigment channels', () => {
  const surface = new MultiChannelInkSurface(32, 32, { paper: { absorbency: .55, granulation: .4 } });
  surface.depositStamp(stamp(), [1, 0, 0, 1], { flow: .8, wetness: .8 });
  surface.depositStamp(stamp({ x: 18 }), [0, 0, 1, 1], { flow: .8, wetness: .8 });
  surface.simulate({ steps: 3 });
  const rgba = surface.compositeRGBA();
  const offset = (16 * 32 + 17) * 4;
  assert.ok(rgba[offset] > 0);
  assert.ok(rgba[offset + 2] > 0);
  assert.ok(rgba[offset + 3] > 0);
});

test('Canvas multi-channel renderer creates a cached wet-stroke run', () => {
  const fakeCanvasFactory = () => ({
    width: 0, height: 0,
    getContext() {
      return {
        createImageData(width, height) { return { width, height, data: new Uint8ClampedArray(width * height * 4) }; },
        putImageData() {}
      };
    }
  });
  const renderer = new Canvas2DMultiChannelInkRenderer({ canvasFactory: fakeCanvasFactory, maxDimension: 256, maxPixels: 65536 });
  const entries = [stroke('a', '#b63c36'), stroke('b', '#2f718f', 3)];
  const first = renderer.render(entries, { absorbency: .6, roughness: .4 });
  const second = renderer.render(entries, { absorbency: .6, roughness: .4 });
  assert.equal(first.backend, 'canvas2d-multichannel');
  assert.equal(first.strokes, 2);
  assert.equal(second, first);
  assert.equal(renderer.diagnostics().cacheHits, 1);
});

test('WebGL multi-channel renderer fails closed when MRT context is unavailable', () => {
  const renderer = new WebGLMultiChannelInkRenderer({
    canvasFactory: () => ({ addEventListener() {}, getContext() { return null; } })
  });
  assert.equal(renderer.initialize(), false);
  assert.equal(renderer.diagnostics().state, 'unavailable');
  assert.match(renderer.diagnostics().lastError, /WebGL2 context unavailable/);
});
