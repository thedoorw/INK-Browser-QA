import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_PEN_PROFILE, PenInputCalibrator, applyPressureCurve,
  normalizePenProfile, tiltToOrientation
} from '../../src/input/pen-calibration.js';
import {
  DirtyRegionTracker, GPUResourceBudget, compareRGBA, createTilePlan,
  estimateTextureBytes, renderTiledCanvas
} from '../../src/render/index.js';

test('pen pressure profile normalizes bounds and applies gamma curve', () => {
  const profile = normalizePenProfile({ pressureMin: .1, pressureMax: .9, pressureGamma: 2 });
  assert.equal(applyPressureCurve(.1, profile), 0);
  assert.equal(applyPressureCurve(.9, profile), 1);
  assert.ok(applyPressureCurve(.5, profile) < .5);
  assert.equal(DEFAULT_PEN_PROFILE.usePredictedEvents, false);
});

test('pen tilt orientation exposes altitude and azimuth', () => {
  const flat = tiltToOrientation(0, 0);
  const tilted = tiltToOrientation(45, 0, { tiltDeadzone: 0, azimuthOffset: 90 });
  assert.equal(flat.altitude, 90);
  assert.equal(tilted.altitude, 45);
  assert.equal(Math.round(tilted.azimuth), 90);
});

test('pen calibrator batches coalesced events and rejects guarded touch', () => {
  let now = 1000;
  const calibrator = new PenInputCalibrator({ penTouchGuardMs: 500 }, { clock: () => now });
  const pen = { pointerId: 1, pointerType: 'pen', pressure: .5, tiltX: 10, tiltY: 5, timeStamp: 900 };
  const normalized = calibrator.normalizeEvent(pen);
  assert.ok(normalized.pressure > 0);
  now = 1200;
  assert.equal(calibrator.shouldReject({ pointerType: 'touch', width: 8, height: 8 }), true);
  const batch = calibrator.eventBatch({ getCoalescedEvents: () => [pen, { ...pen, pressure: .7 }] });
  assert.equal(batch.length, 2);
  assert.equal(calibrator.diagnostics().coalescedEvents, 1);
});

test('GPU resource budget evicts least recently used unpinned resources', () => {
  const budget = new GPUResourceBudget({ budgetBytes: 4 * 1024 * 1024 });
  const unit = 1500 * 1024;
  assert.equal(budget.reserve('a', unit), true);
  assert.equal(budget.reserve('b', unit), true);
  budget.touch('a');
  assert.equal(budget.reserve('c', unit), true);
  assert.equal(budget.resources.has('b'), false);
  assert.equal(budget.resources.has('a'), true);
  assert.ok(budget.diagnostics().evictions >= 1);
  assert.equal(estimateTextureBytes(100, 50), 20000);
});

test('tile planner covers output with overlap-bounded tiles', () => {
  const plan = createTilePlan({ x: 0, y: 0, w: 5000, h: 2600 }, 2, { tileSize: 2048, overlap: 48 });
  assert.equal(plan.width, 10000);
  assert.equal(plan.height, 5200);
  assert.ok(plan.tiles.length > 4);
  assert.ok(plan.tiles.every(tile => tile.width <= 2048 && tile.height <= 2048));
  const coreArea = plan.tiles.reduce((sum, tile) => sum + tile.coreWidth * tile.coreHeight, 0);
  assert.equal(coreArea, plan.width * plan.height);
});

test('dirty region tracker merges nearby edits and consumes state', () => {
  const tracker = new DirtyRegionTracker({ mergeGap: 5 });
  tracker.add({ x: 0, y: 0, w: 10, h: 10 });
  tracker.add({ x: 12, y: 0, w: 10, h: 10 });
  assert.equal(tracker.diagnostics().regions, 1);
  const regions = tracker.consume();
  assert.equal(regions.length, 1);
  assert.equal(tracker.diagnostics().regions, 0);
});

test('pixel comparison reports tolerance pass and mismatch ratio', () => {
  const reference = new Uint8ClampedArray([10, 20, 30, 255, 100, 100, 100, 255]);
  const close = new Uint8ClampedArray([12, 18, 32, 255, 102, 98, 101, 255]);
  const far = new Uint8ClampedArray([255, 255, 255, 0, 0, 0, 0, 0]);
  assert.equal(compareRGBA(reference, close, { tolerance: 5 }).passed, true);
  assert.equal(compareRGBA(reference, far, { tolerance: 5 }).passed, false);
});

test('tiled renderer composes all planned cores through one reusable tile canvas', async () => {
  const canvases = [];
  const factory = () => {
    const operations = [];
    const context = {
      operations,
      setTransform() {}, clearRect() {}, fillRect() {},
      drawImage(...args) { operations.push(args); }
    };
    const canvas = { width: 0, height: 0, getContext: () => context, context };
    canvases.push(canvas);
    return canvas;
  };
  let rendered = 0;
  const result = await renderTiledCanvas({
    bounds: { x: 0, y: 0, w: 1600, h: 900 }, scale: 2,
    tileSize: 1024, overlap: 32, canvasFactory: factory,
    renderTile: async () => { rendered++; }
  });
  assert.equal(rendered, result.plan.tiles.length);
  assert.equal(result.stats.tiles, result.plan.tiles.length);
  assert.equal(canvases[0].context.operations.length, result.plan.tiles.length);
});
