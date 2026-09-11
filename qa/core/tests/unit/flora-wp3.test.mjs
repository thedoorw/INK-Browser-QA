import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { HistoryManager } from '../../src/history/history.js';
import { Matrix } from '../../src/core/math.js';
import { installFloraActionLayer } from '../../src/flora/index.js';
import { buildAbstractPetalBenchmarkStructure } from '../../src/flora/painting/abstract-petal-benchmark.js';
import { compileRegionStrokes } from '../../src/flora/painting/region-stroke-compiler.js';
import { RasterMaskCache, maskAlphaAt, vectorPathContains, worldPointToNormalized } from '../../src/flora/mask/vector-mask.js';

const PRESETS = {
  'brush-round': { id: 'brush-round', kind: 'brush', size: 12, opacity: .88, smoothing: .46, pressure: .95, taper: .42, flow: .82, wetness: .36, bristle: .18 },
  'brush-letter': { id: 'brush-letter', kind: 'brush', size: 8, opacity: .95, smoothing: .54, pressure: 1, taper: .58, flow: .94, wetness: .22, bristle: .28 },
  'air-soft': { id: 'air-soft', kind: 'airbrush', size: 42, opacity: .09, smoothing: .7, pressure: .55, softness: .9 }
};

function createApp() {
  const app = {
    doc: defaultDocument(), brushPresetCatalog: structuredClone(PRESETS), toolSettings: {}, spatialDirty: false,
    page() { return this.doc.pages[0]; },
    pagePath() { return ['pages', 0]; },
    layerPath(layer) { return ['pages', 0, 'layers', this.page().layers.indexOf(layer)]; },
    layerObjectsPath(layer) { return [...this.layerPath(layer), 'objects']; },
    refreshAll() {}, markDirty() {}, updateHistoryUI() {},
    renderer: { render() {}, invalidateTiles() {}, naturalMedia: { clearCaches() {} } },
    replaceDocument(document) { this.doc = document; this.flora?.adapter?.maskCache?.clear(); }
  };
  app.history = new HistoryManager(app);
  app.flora = installFloraActionLayer(app);
  app.flora.hero.createBenchmarkPetal({ profileId: 'wp3-benchmark', feather: 0, seed: 73 }, { history: false });
  return app;
}

const metadata = label => ({ source: 'ai', label });
const action = (type, id, payload, seed = 73) => ({ schemaVersion: '0.1', actionId: id, type, payload, seed, metadata: metadata(id) });
const petalId = 'wp3-benchmark:petal-region:0';
const controlId = 'wp3-benchmark:control-region:0';
const layerId = app => app.page().layers[0].id;
const paint = (app, id, operation, extra = {}, seed = 73) => action('paintRegion', id, {
  regionId: petalId, layerId: layerId(app), operation,
  brushPreset: operation === 'Base Wash' ? 'brush-round' : operation === 'Directional Glaze' ? 'brush-letter' : 'air-soft',
  color: operation === 'Base Wash' ? '#b85c72' : operation === 'Directional Glaze' ? '#7c2948' : '#f2c7d3',
  ...extra
}, seed);

function absolutePoints(stroke) {
  return stroke.points.map(point => Matrix.point(stroke.matrix, point));
}

function assertStrokePointsInside(app, regionId, strokes) {
  const region = app.flora.adapter.region(regionId);
  for (const stroke of strokes) for (const world of absolutePoints(stroke)) {
    const normalized = worldPointToNormalized(app.page(), world);
    assert.equal(vectorPathContains(region.path, normalized), true, `point leaked from ${regionId}`);
  }
}

test('vector and raster masks expose hard and feathered numeric boundaries', () => {
  const structure = buildAbstractPetalBenchmarkStructure({ feather: 0 });
  const hard = structure.masks.find(mask => mask.regionId === petalId);
  assert.equal(maskAlphaAt(hard, .5, .43), 1);
  hard.feather = .03;
  let featherAlpha = 0;
  for (let x = .5; x >= .30; x -= .001) {
    const value = maskAlphaAt(hard, x, .43);
    if (value > 0 && value < 1) { featherAlpha = value; break; }
  }
  assert.ok(featherAlpha > 0 && featherAlpha < 1, featherAlpha);
  const cache = new RasterMaskCache(), raster = cache.getOrCreate(hard, 96, 136);
  assert.equal(raster.alpha.length, 96 * 136);
  assert.ok(raster.alpha.some(value => value > 0 && value < 255));
});

test('feather changes deterministic stroke opacity while retaining clipping', () => {
  const app = createApp(), region = app.flora.adapter.region(petalId), mask = app.flora.adapter.mask(petalId), cache = new RasterMaskCache();
  const a = paint(app, 'wp3-feather-compare', 'Base Wash', { density: 12 }, 99);
  const hardRaster = cache.getOrCreate(mask, 128, 181);
  const hard = compileRegionStrokes({ action: a, region, mask, page: app.page(), brushPreset: PRESETS['brush-round'], rasterMask: hardRaster });
  mask.feather = .035; mask.cacheRevision += 1; cache.invalidate(mask.maskId);
  const softRaster = cache.getOrCreate(mask, 128, 181);
  const soft = compileRegionStrokes({ action: a, region, mask, page: app.page(), brushPreset: PRESETS['brush-round'], rasterMask: softRaster });
  assert.notEqual(hard.compilerHash, soft.compilerHash);
  assert.notEqual(hardRaster.alphaHash, softRaster.alphaHash);
  assertStrokePointsInside(app, petalId, soft.strokes);
});

test('raster mask cache rebuilds after feather or explicit invalidation', () => {
  const app = createApp(), mask = app.flora.adapter.mask(petalId), cache = app.flora.adapter.maskCache;
  const first = cache.getOrCreate(mask, 64, 91), key1 = mask.cacheKey;
  const feather = app.flora.dispatch(action('setMaskFeather', 'wp3-feather', { regionId: petalId, feather: .025 }));
  assert.equal(feather.ok, true);
  const second = cache.getOrCreate(mask, 64, 91), key2 = mask.cacheKey;
  assert.notEqual(key2, key1);
  assert.notEqual(second.alphaHash, first.alphaHash);
  const invalidate = app.flora.dispatch(action('invalidateMaskCache', 'wp3-invalidate', { regionId: petalId }));
  assert.equal(invalidate.ok, true);
  assert.equal(cache.diagnostics().entries, 0);
});

test('Base Wash, Directional Glaze, and Soft Edge Veil create formal clipped strokes', () => {
  const app = createApp();
  for (const [index, operation] of ['Base Wash', 'Directional Glaze', 'Soft Edge Veil'].entries()) {
    const result = app.flora.dispatch(paint(app, `wp3-operation-${index}`, operation, { density: 8 }, 100 + index));
    assert.equal(result.ok, true);
    assert.ok(result.createdCount > 0);
    const created = app.page().layers[0].objects.filter(object => result.createdIds.includes(object.id));
    assertStrokePointsInside(app, petalId, created);
    assert.ok(created.every(object => object.floraPaint?.operation === operation));
    assert.ok(created.every(object => object.floraPaint?.rasterMask?.alphaHash));
  }
  assert.equal(app.history.undoStack.length, 3);
});

test('directional compiler supports all directions and deterministic seed behavior', () => {
  const app = createApp(), region = app.flora.adapter.region(petalId), mask = app.flora.adapter.mask(petalId), cache = new RasterMaskCache();
  const raster = cache.getOrCreate(mask, 128, 181), hashes = new Set();
  for (const direction of ['base-to-tip', 'tip-to-base', 'radial-out', 'contour-follow']) {
    const a = paint(app, `wp3-dir-${direction}`, 'Directional Glaze', { direction, density: 10 }, 9182);
    const first = compileRegionStrokes({ action: a, region, mask, page: app.page(), brushPreset: PRESETS['brush-letter'], rasterMask: raster });
    const second = compileRegionStrokes({ action: a, region, mask, page: app.page(), brushPreset: PRESETS['brush-letter'], rasterMask: raster });
    assert.equal(first.compilerHash, second.compilerHash);
    hashes.add(first.compilerHash);
    assertStrokePointsInside(app, petalId, first.strokes);
    if (direction === 'base-to-tip' || direction === 'tip-to-base') {
      const deltas = first.strokes.map(stroke => { const pts = absolutePoints(stroke); return pts.at(-1).y - pts[0].y; });
      const average = deltas.reduce((sum, value) => sum + value, 0) / deltas.length;
      assert.ok(direction === 'base-to-tip' ? average < 0 : average > 0, `${direction}: ${average}`);
    }
  }
  assert.equal(hashes.size, 4);
  const a = paint(app, 'wp3-seed-a', 'Directional Glaze', { density: 10 }, 10);
  const b = paint(app, 'wp3-seed-a', 'Directional Glaze', { density: 10 }, 11);
  assert.notEqual(
    compileRegionStrokes({ action: a, region, mask, page: app.page(), brushPreset: PRESETS['brush-letter'], rasterMask: raster }).compilerHash,
    compileRegionStrokes({ action: b, region, mask, page: app.page(), brushPreset: PRESETS['brush-letter'], rasterMask: raster }).compilerHash
  );
});

test('region-local clear preserves non-target region and manual strokes', () => {
  const app = createApp(), layer = app.page().layers[0];
  layer.objects.push({ id: 'manual-stroke', type: 'stroke', name: 'Manual', matrix: Matrix.identity(), opacity: 1, color: '#000000', size: 2, kind: 'pen', points: [{ x: 0, y: 0, p: 1 }, { x: 10, y: 10, p: 1 }] });
  const control = action('paintRegion', 'wp3-control-paint', { regionId: controlId, layerId: layer.id, operation: 'Base Wash', brushPreset: 'brush-round', color: '#5e7a54', density: 4 }, 41);
  assert.equal(app.flora.dispatch(control).ok, true);
  assert.equal(app.flora.dispatch(paint(app, 'wp3-petal-paint', 'Base Wash', { density: 5 }, 42)).ok, true);
  const controlIds = new Set(layer.objects.filter(object => object.floraPaint?.regionId === controlId).map(object => object.id));
  const clear = app.flora.dispatch(action('clearRegion', 'wp3-clear-petal', { regionId: petalId, layerId: layer.id }));
  assert.equal(clear.ok, true);
  assert.ok(layer.objects.some(object => object.id === 'manual-stroke'));
  assert.deepEqual(new Set(layer.objects.filter(object => object.floraPaint?.regionId === controlId).map(object => object.id)), controlIds);
  assert.equal(layer.objects.some(object => object.floraPaint?.regionId === petalId), false);
});

test('invalid region and brush preset reject without scene or history pollution', () => {
  const app = createApp(), before = app.flora.documentHash(), history = app.history.undoStack.length;
  const badRegion = app.flora.dispatch(action('paintRegion', 'wp3-bad-region', { regionId: 'missing:region:0', layerId: layerId(app), operation: 'Base Wash', brushPreset: 'brush-round', color: '#000000' }));
  assert.equal(badRegion.ok, false);
  const badBrush = app.flora.dispatch(paint(app, 'wp3-bad-brush', 'Base Wash', { brushPreset: 'missing-brush' }));
  assert.equal(badBrush.ok, false);
  assert.equal(app.flora.documentHash(), before);
  assert.equal(app.history.undoStack.length, history);
});

test('atomic paint batch commits once and supports undo/redo', () => {
  const app = createApp(), before = app.flora.documentHash();
  const result = app.flora.dispatchMany([
    action('setMaskFeather', 'wp3-batch-feather', { regionId: petalId, feather: .02 }, 1),
    paint(app, 'wp3-batch-wash', 'Base Wash', { density: 6 }, 2),
    paint(app, 'wp3-batch-glaze', 'Directional Glaze', { density: 5 }, 3)
  ]);
  assert.equal(result.ok, true);
  assert.equal(result.historyEntriesAdded, 1);
  const after = app.flora.documentHash();
  assert.notEqual(after, before);
  app.history.undo();
  assert.equal(app.flora.documentHash(), before);
  app.history.redo();
  assert.equal(app.flora.documentHash(), after);
});

test('atomic batch failure rolls back Scene, strokes, masks, history, and cache', () => {
  const app = createApp(), before = app.flora.documentHash(), undo = app.history.undoStack.length;
  const result = app.flora.dispatchMany([
    action('setMaskFeather', 'wp3-rollback-feather', { regionId: petalId, feather: .03 }, 1),
    paint(app, 'wp3-rollback-paint', 'Base Wash', { density: 5 }, 2),
    paint(app, 'wp3-rollback-fail', 'Base Wash', { brushPreset: 'not-a-brush' }, 3)
  ]);
  assert.equal(result.ok, false);
  assert.equal(result.error.code, 'BATCH_ROLLBACK');
  assert.equal(result.error.details.rolledBack, true);
  assert.equal(result.error.details.historyUnchanged, true);
  assert.equal(app.flora.documentHash(), before);
  assert.equal(app.history.undoStack.length, undo);
  assert.equal(app.flora.maskCacheDiagnostics().entries, 0);
});

test('.ink JSON roundtrip retains editable Region strokes and deterministic replay hash', () => {
  const app = createApp();
  assert.equal(app.flora.dispatch(paint(app, 'wp3-roundtrip', 'Soft Edge Veil', { density: 7 }, 219)).ok, true);
  const replay = app.flora.replayHash(), serialized = app.flora.serializeDocument();
  app.flora.reloadDocument(serialized);
  assert.equal(app.flora.replayHash(), replay);
  const objects = app.page().layers.flatMap(layer => layer.objects).filter(object => object.floraPaint?.regionId === petalId);
  assert.ok(objects.length > 0);
  assert.ok(objects.every(object => object.type === 'stroke' && Array.isArray(object.points)));
});

test('mask visibility is formal history state and does not delete paint objects', () => {
  const app = createApp();
  assert.equal(app.flora.dispatch(paint(app, 'wp3-mask-visible-paint', 'Base Wash', { density: 4 })).ok, true);
  const count = app.page().layers[0].objects.length;
  const hidden = app.flora.dispatch(action('setMaskVisibility', 'wp3-mask-hide', { regionId: petalId, visible: false }));
  assert.equal(hidden.ok, true);
  assert.equal(app.flora.adapter.mask(petalId).visible, false);
  assert.equal(app.page().layers[0].objects.length, count);
  app.history.undo();
  assert.equal(app.flora.adapter.mask(petalId).visible, true);
});
