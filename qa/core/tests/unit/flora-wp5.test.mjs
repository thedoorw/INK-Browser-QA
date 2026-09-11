import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { HistoryManager } from '../../src/history/history.js';
import { Matrix } from '../../src/core/math.js';
import { installFloraActionLayer } from '../../src/flora/index.js';
import { PAINTING_RECIPE_OPERATIONS } from '../../src/flora/recipe/painting-recipe-schema.js';
import { crownPlanRoundtrip } from '../../src/flora/crown/crown-painting-plan-validator.js';
import { crownPlanCompilerRoundtrip } from '../../src/flora/crown/crown-painting-compiler.js';
import { vectorPathContains, worldPointToNormalized } from '../../src/flora/mask/vector-mask.js';

const PRESETS = {
  'brush-round': { id: 'brush-round', kind: 'brush', size: 12, opacity: .88, smoothing: .46, pressure: .95, taper: .42, flow: .82, wetness: .36, bristle: .18 },
  'brush-letter': { id: 'brush-letter', kind: 'brush', size: 8, opacity: .95, smoothing: .54, pressure: 1, taper: .58, flow: .94, wetness: .22, bristle: .28 },
  'air-soft': { id: 'air-soft', kind: 'airbrush', size: 42, opacity: .09, smoothing: .7, pressure: .55, softness: .9 }
};

function createApp(document = defaultDocument()) {
  const app = {
    doc: structuredClone(document), brushPresetCatalog: structuredClone(PRESETS), toolSettings: {}, spatialDirty: false,
    page() { return this.doc.pages[0]; }, pagePath() { return ['pages', 0]; },
    layerPath(layer) { return ['pages', 0, 'layers', this.page().layers.indexOf(layer)]; },
    layerObjectsPath(layer) { return [...this.layerPath(layer), 'objects']; },
    refreshAll() {}, markDirty() {}, updateHistoryUI() {},
    renderer: { render() {}, invalidateTiles() {}, naturalMedia: { clearCaches() {} } },
    replaceDocument(document) { this.doc = document; this.flora?.adapter?.maskCache?.clear(); }
  };
  app.history = new HistoryManager(app);
  app.flora = installFloraActionLayer(app);
  return app;
}

function plan(seed = 505, patch = {}) {
  return {
    planId: 'wp5-crown-plan', schemaVersion: '0.1', crownId: 'wp5-complete-crown', petalCount: 10,
    crownBasePalette: ['#b74f68', '#d9879a', '#9f3f5b'],
    petalPaletteVariation: { lightnessRange: [-.06, .08], saturationRange: [-.04, .06] },
    centerPalette: ['#6f263d', '#d49b55', '#f2d899'], globalLightDirection: { x: -.45, y: -.89 },
    depthOrder: 'topology-z', focalRegion: { petalIndex: 0 },
    edgeHierarchy: { focal: 'crisp', front: 'mixed', rear: 'soft' },
    shadowStrategy: { root: .82, fold: .68, overlap: .88 }, glazeStrategy: { strength: .62, passes: 1 },
    backgroundExclusionMask: { enabled: true, mode: 'crown-envelope' },
    brushPresets: { wash: 'brush-round', shadow: 'brush-round', light: 'air-soft', glaze: 'brush-round', detail: 'brush-letter', soft: 'air-soft' },
    seed, metadata: { source: 'ai', label: 'WP5 Complete Crown Benchmark C1' }, ...patch
  };
}

function objectHash(app, ids) {
  const json = JSON.stringify(ids.map(id => app.flora.adapter.findObject(id)?.object).filter(Boolean));
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i += 1) { hash ^= json.charCodeAt(i); hash = Math.imul(hash, 0x01000193); }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

function absolutePoints(stroke) { return stroke.points.map(point => Matrix.point(stroke.matrix, point)); }

function assertSampleInside(app, strokeIds, sampleLimit = 80) {
  for (const id of strokeIds.slice(0, sampleLimit)) {
    const stroke = app.flora.adapter.findObject(id)?.object;
    assert.ok(stroke?.floraPaint?.regionId);
    const region = app.flora.adapter.region(stroke.floraPaint.regionId);
    for (const point of absolutePoints(stroke)) assert.equal(vectorPathContains(region.path, worldPointToNormalized(app.page(), point)), true, `${id} leaked outside ${region.regionId}`);
  }
}

test('Crown Plan Schema validates, roundtrips, and rejects illegal plans without mutation', () => {
  const app = createApp(), input = plan(), before = app.flora.documentHash(), history = app.history.undoStack.length;
  assert.equal(app.flora.schemaVersion, '0.5');
  assert.equal(app.flora.crown.validate(input).ok, true);
  assert.deepEqual(crownPlanRoundtrip(input), input);
  assert.deepEqual(crownPlanCompilerRoundtrip(input), input);
  const variants = [
    { ...input, petalCount: 7 }, { ...input, crownBasePalette: [] }, { ...input, centerPalette: [] },
    { ...input, globalLightDirection: { x: 0, y: 0 } }, { ...input, brushPresets: { ...input.brushPresets, detail: 'missing-brush' } },
    { ...input, seed: Infinity }, { ...input, edgeHierarchy: { focal: 'hard', front: 'mixed', rear: 'soft' } },
    { ...input, extraCode: 'window.alert(1)' }
  ];
  for (const invalid of variants) assert.equal(app.flora.crown.execute(invalid).ok, false);
  assert.equal(app.flora.documentHash(), before);
  assert.equal(app.history.undoStack.length, history);
});

test('Complete Crown compiler creates 8–12 independent petals, center, near-circle envelope, topology, masks, and controlled Recipe differences', () => {
  const app = createApp(), compiled = app.flora.crown.compile(plan());
  assert.equal(compiled.ok, true, JSON.stringify(compiled.errors));
  assert.equal(compiled.preview.petalCount, 10);
  assert.equal(compiled.preview.centerCount, 1);
  assert.ok(compiled.recipes.length >= 10 * 9 + 6 && compiled.recipes.length <= 10 * 9 + 6 + 10);
  assert.deepEqual(new Set(compiled.recipes.map(recipe => recipe.operation)), new Set(PAINTING_RECIPE_OPERATIONS));
  const hero = compiled.structure, petals = hero.regions.filter(region => region.kind === 'petal-region'), center = hero.regions.find(region => region.kind === 'flower-center-region');
  assert.equal(new Set(petals.map(region => region.regionId)).size, 10);
  assert.equal(new Set(hero.masks.map(mask => mask.regionId)).size, 11);
  assert.ok(petals.every(region => region.growthAxis?.base && region.growthAxis?.tip));
  assert.ok(petals.some(region => region.overlaps?.length));
  assert.equal(hero.crownEnvelope.top, .02);
  assert.ok(hero.crownEnvelope.height >= .48 && hero.crownEnvelope.height <= .52);
  assert.equal(hero.focalRegionId, `${plan().crownId}:petal:01`);
  const centerTopology = hero.topology.find(item => item.regionId === center.regionId);
  assert.ok(petals.every(region => region.overlaps.some(item => item.frontRegionId === center.regionId) || center.overlaps.some(item => item.frontRegionId === region.regionId)));
  assert.ok(centerTopology.frontOf.length > 0 && centerTopology.frontOf.length < petals.length);
  const baseWash = compiled.recipes.filter(recipe => recipe.operation === 'Base Wash' && recipe.targetRegionId.includes(':petal:'));
  assert.ok(new Set(baseWash.map(recipe => JSON.stringify([recipe.palette, recipe.opacity, recipe.density, recipe.feather]))).size >= 7);
  assert.equal(compiled.preview.uniqueRecipeHashes, compiled.recipes.length);
  assert.equal(compiled.checks.passed, true, JSON.stringify(compiled.checks.failed));
});

test('Crown execution is one atomic editable Scene transaction with nine operations, center integration, clipping, mapping, and visual checks', () => {
  const app = createApp(), layer = app.page().layers[0];
  layer.objects.push({ id: 'manual-wp5-stroke', type: 'stroke', name: 'Manual', matrix: Matrix.identity(), opacity: 1, color: '#222222', size: 2, kind: 'pen', points: [{ x: 0, y: 0, p: 1 }, { x: 12, y: 8, p: 1 }] });
  const result = app.flora.crown.execute(plan());
  assert.equal(result.ok, true, JSON.stringify(result.details));
  assert.equal(result.atomic, true);
  assert.equal(result.historyEntriesAdded, 1);
  assert.ok(result.recipeCount >= 96 && result.recipeCount <= 106);
  assert.ok(result.strokeCount > 400);
  assert.equal(result.checks.passed, true, JSON.stringify(result.checks.failed));
  assert.ok(layer.objects.some(object => object.id === 'manual-wp5-stroke'));
  const mapping = app.flora.crown.mapping('wp5-complete-crown');
  assert.equal(mapping.recipeIds.length, result.recipeCount);
  assert.equal(mapping.strokeIds.length, result.strokeCount);
  assert.ok(Object.keys(mapping.regionRecipeIds).length === 11);
  assertSampleInside(app, mapping.strokeIds);
  const operations = new Set(mapping.strokeIds.map(id => app.flora.adapter.findObject(id)?.object?.floraPaint?.recipeOperation));
  assert.deepEqual(operations, new Set(PAINTING_RECIPE_OPERATIONS));
  const centerStrokes = mapping.strokeIds.filter(id => app.flora.adapter.findObject(id)?.object?.floraPaint?.regionId === 'wp5-complete-crown:center');
  assert.ok(centerStrokes.length > 20);
});

test('Overlap Shadow Recipes follow explicit front/back seams and center-to-inner-petal topology', () => {
  const app = createApp(), compiled = app.flora.crown.compile(plan()), hero = compiled.structure;
  for (const recipe of compiled.recipes.filter(item => item.operation === 'Overlap Shadow')) {
    const region = hero.regions.find(item => item.regionId === recipe.targetRegionId);
    const front = recipe.constraints.frontRegionId, overlap = region.overlaps.find(item => item.frontRegionId === front);
    const topology = hero.topology.find(item => item.regionId === front);
    assert.ok(overlap?.seam?.length >= 2);
    assert.ok(topology.frontOf.includes(region.regionId));
  }
  const center = hero.regions.find(region => region.kind === 'flower-center-region');
  assert.ok(hero.regions.filter(region => region.kind === 'petal-region').every(region => region.overlaps.some(item => item.frontRegionId === center.regionId) || center.overlaps.some(item => item.frontRegionId === region.regionId)));
  assert.ok(center.overlaps.length > 0 && center.overlaps.length < hero.regions.filter(region => region.kind === 'petal-region').length);
});

test('single-petal and Flower Center local recompilation preserve other petals, manual strokes, IDs, and existing History', () => {
  const app = createApp(), layer = app.page().layers[0];
  layer.objects.push({ id: 'manual-local-wp5', type: 'stroke', name: 'Manual local', matrix: Matrix.identity(), opacity: 1, color: '#111111', size: 2, kind: 'pen', points: [{ x: 0, y: 0, p: 1 }, { x: 8, y: 8, p: 1 }] });
  assert.equal(app.flora.crown.execute(plan()).ok, true);
  const crown = app.flora.crown.mapping('wp5-complete-crown'), target = 'wp5-complete-crown:petal:01';
  const targetIds = new Set(crown.regionRecipeIds[target].flatMap(id => crown.recipeToStrokeIds[id] || []));
  const nonTargetIds = crown.strokeIds.filter(id => !targetIds.has(id));
  const nonTargetBefore = objectHash(app, nonTargetIds), undoBefore = app.history.undoStack.length;
  const local = app.flora.crown.adjustPetal('wp5-complete-crown', target, { operation: 'Central Light', opacity: [.055, .15], palette: ['#fff0f4'], edgeSoftness: .007 });
  assert.equal(local.ok, true, JSON.stringify(local.details));
  assert.equal(local.nonTargetUnchanged, true);
  assert.equal(objectHash(app, nonTargetIds), nonTargetBefore);
  assert.ok(layer.objects.some(object => object.id === 'manual-local-wp5'));
  assert.equal(app.history.undoStack.length, undoBefore + 1);
  const centerBefore = new Set(app.flora.crown.mapping('wp5-complete-crown').regionRecipeIds['wp5-complete-crown:center'].flatMap(id => app.flora.crown.mapping('wp5-complete-crown').recipeToStrokeIds[id] || []));
  const center = app.flora.crown.recompileCenter('wp5-complete-crown', { operation: 'Directional Brushwork', patch: { seed: 909, palette: ['#e2b764'] } });
  assert.equal(center.ok, true, JSON.stringify(center.details));
  const centerAfter = new Set(app.flora.crown.mapping('wp5-complete-crown').regionRecipeIds['wp5-complete-crown:center'].flatMap(id => app.flora.crown.mapping('wp5-complete-crown').recipeToStrokeIds[id] || []));
  assert.notDeepEqual(centerAfter, centerBefore);
  assert.ok(layer.objects.some(object => object.id === 'manual-local-wp5'));
});

test('same Plan and seed replay identically; different seed changes structure and compile hashes', () => {
  const baseline = defaultDocument();
  const a = createApp(baseline), b = createApp(baseline), input = plan(707, { petalCount: 8, planId: 'wp5-deterministic-plan', crownId: 'wp5-deterministic-crown' });
  const ra = a.flora.crown.execute(input), rb = b.flora.crown.execute(structuredClone(input));
  assert.equal(ra.ok, true); assert.equal(rb.ok, true);
  assert.equal(ra.compileHash, rb.compileHash);
  assert.equal(a.flora.replayHash(), b.flora.replayHash());
  const changed = a.flora.crown.compile({ ...structuredClone(input), seed: 708 });
  assert.equal(changed.ok, true);
  assert.notEqual(changed.compileHash, ra.compileHash);
  assert.notEqual(changed.structureHash, a.flora.crown.lookup(input.crownId).structureHash);
});

test('Plan → Recipe → Action → Scene and .ink roundtrip preserve Crown mappings and deterministic replay', () => {
  const app = createApp(), input = plan(808, { petalCount: 8, planId: 'wp5-roundtrip-plan', crownId: 'wp5-roundtrip-crown' });
  const compiled = app.flora.crown.compile(input);
  assert.equal(compiled.ok, true);
  assert.ok(compiled.compiledRecipes.every(item => item.actions.some(action => action.type === 'paintRegion')));
  const result = app.flora.crown.execute(input);
  assert.equal(result.ok, true);
  const mapping = app.flora.crown.mapping(input.crownId), replay = app.flora.replayHash(), crownReplay = app.flora.crown.replayHash(input.crownId);
  const json = app.flora.serializeDocument();
  app.flora.reloadDocument(json);
  assert.equal(app.flora.replayHash(), replay);
  assert.equal(app.flora.crown.replayHash(input.crownId), crownReplay);
  assert.deepEqual(app.flora.crown.mapping(input.crownId), mapping);
  assert.deepEqual(app.flora.crown.plan(input.crownId), input);
});

test('mid-petal or pass failure rolls back Crown Plan, Recipes, Actions, Strokes, Regions, Masks, Cache, Scene, History, and ID mappings', () => {
  const app = createApp(), input = plan(909, { petalCount: 8, planId: 'wp5-rollback-plan', crownId: 'wp5-rollback-crown' });
  const before = app.flora.documentHash(), replay = app.flora.replayHash(), undo = app.history.undoStack.length, map = new Map(app.flora.adapter.actionObjectMap);
  const original = app.flora.adapter.execute.bind(app.flora.adapter); let count = 0;
  app.flora.adapter.execute = (action, options) => {
    if (action.type === 'paintRegion' && ++count === 13) throw new Error('injected WP5 petal pass failure');
    return original(action, options);
  };
  const result = app.flora.crown.execute(input);
  app.flora.adapter.execute = original;
  assert.equal(result.ok, false);
  assert.equal(result.code, 'CROWN_ROLLBACK');
  assert.equal(result.details.rolledBack, true);
  assert.equal(result.details.replayRestored, true);
  assert.equal(app.flora.documentHash(), before);
  assert.equal(app.flora.replayHash(), replay);
  assert.equal(app.history.undoStack.length, undo);
  assert.deepEqual(app.flora.adapter.actionObjectMap, map);
  assert.equal(app.page().floraHero, undefined);
  assert.equal(app.page().floraCrownState, undefined);
  assert.equal(app.flora.maskCacheDiagnostics().entries, 0);
});

test('one complete Crown transaction supports Undo and Redo without losing manual content', () => {
  const app = createApp(), layer = app.page().layers[0];
  layer.objects.push({ id: 'manual-undo-wp5', type: 'stroke', name: 'Manual', matrix: Matrix.identity(), opacity: 1, color: '#222222', size: 2, kind: 'pen', points: [{ x: 0, y: 0, p: 1 }, { x: 6, y: 6, p: 1 }] });
  const input = plan(1001, { petalCount: 8, planId: 'wp5-undo-plan', crownId: 'wp5-undo-crown' }), before = app.flora.documentHash();
  const result = app.flora.crown.execute(input);
  assert.equal(result.ok, true);
  const complete = app.flora.documentHash(), replay = app.flora.replayHash();
  assert.equal(app.history.undo(), true);
  assert.equal(app.flora.documentHash(), before);
  assert.ok(app.page().layers[0].objects.some(object => object.id === 'manual-undo-wp5'));
  assert.equal(app.history.redo(), true);
  assert.equal(app.flora.documentHash(), complete);
  assert.equal(app.flora.replayHash(), replay);
  assert.ok(app.page().layers[0].objects.some(object => object.id === 'manual-undo-wp5'));
});
