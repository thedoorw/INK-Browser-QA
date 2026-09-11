import test, { afterEach } from 'node:test';
afterEach(() => globalThis.gc?.());
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { Matrix } from '../../src/core/math.js';
import { PAINTING_RECIPE_OPERATIONS } from '../../src/flora/recipe/painting-recipe-schema.js';
import { a4HeroPlanRoundtrip } from '../../src/flora/hero/a4-hero-plan-validator.js';
import { a4HeroCompilerRoundtrip } from '../../src/flora/hero/complete-hero-painting-compiler.js';
import { maskAlphaAt, worldPointToNormalized } from '../../src/flora/mask/vector-mask.js';
import { addManualStroke, createWP6App, createWP6Plan, stableObjectHash } from '../helpers/flora-wp6-fixture.mjs';

function absolutePoints(stroke) { return stroke.points.map(point => Matrix.point(stroke.matrix, point)); }
function assertStrokeSamplesClipped(app, ids, limit = 100) {
  for (const id of ids.slice(0, limit)) {
    const stroke = app.flora.adapter.findObject(id)?.object;
    const mask = app.flora.adapter.mask(stroke.floraPaint.regionId);
    for (const point of absolutePoints(stroke)) {
      const normalized = worldPointToNormalized(app.page(), point);
      assert.ok(maskAlphaAt(mask, normalized.x, normalized.y) > 0, `${id} visibly escaped ${mask.regionId}`);
    }
  }
}

test('WP6 A4 Hero Composition Plan validates, serializes, roundtrips, and rejects invalid plans without mutation', { concurrency: false }, () => {
  const app = createWP6App(), plan = createWP6Plan(), before = app.flora.documentHash(), undo = app.history.undoStack.length;
  assert.equal(app.flora.completeHero.validate(plan).ok, true);
  assert.deepEqual(a4HeroPlanRoundtrip(plan), plan);
  assert.deepEqual(a4HeroCompilerRoundtrip(plan), plan);
  const invalid = [
    { ...plan, composition: { ...plan.composition, page: 'square' } },
    { ...plan, composition: { ...plan.composition, crownHeight: .4 } },
    { ...plan, composition: { ...plan.composition, leafCount: 'Four' } },
    { ...plan, stemPlan: { ...plan.stemPlan, regionId: 'wrong' } },
    { ...plan, backgroundPlan: { ...plan.backgroundPlan, brushPresets: { ...plan.backgroundPlan.brushPresets, wash: 'missing' } } },
    { ...plan, seed: Infinity }, { ...plan, metadata: { source: 'ai', label: 'window.eval(1)' } }
  ];
  for (const item of invalid) assert.equal(app.flora.completeHero.execute(item).ok, false);
  assert.equal(app.flora.documentHash(), before); assert.equal(app.history.undoStack.length, undo);
});

test('Whole-page compiler builds A4 Single Crown, centered stem, exactly two independent leaves, compound background exclusion, Recipes, and visual checks', { concurrency: false }, () => {
  const app = createWP6App(), compiled = app.flora.completeHero.compile(createWP6Plan());
  assert.equal(compiled.ok, true, JSON.stringify(compiled.errors));
  assert.equal(compiled.preview.page, 'A4 portrait'); assert.equal(compiled.preview.crownMode, 'Single'); assert.equal(compiled.preview.leafCount, 'Two');
  const { structure, recipes } = compiled;
  assert.equal(structure.profile.crownMode, 'Single'); assert.equal(structure.profile.leafCount, 'Two');
  assert.ok(structure.crownEnvelope.height >= .48 && structure.crownEnvelope.height <= .52); assert.ok(structure.crownEnvelope.top >= .01 && structure.crownEnvelope.top <= .04);
  const stem = structure.regions.find(region => region.kind === 'stem-region'), leaves = structure.regions.filter(region => region.kind === 'leaf-region');
  assert.equal(stem.growthAxis.base.x, .5); assert.ok(stem.stem.widthRatio >= 1 / 14 && stem.stem.widthRatio <= 1 / 10);
  assert.equal(leaves.length, 2); assert.deepEqual(new Set(leaves.map(region => region.leaf.side)), new Set(['left', 'right']));
  assert.ok(leaves.every(region => region.leaf.width === 'Medium' && region.leaf.tip === 'Pointed' && region.leaf.curve === 'Gentle Wave'));
  const backgroundMask = structure.masks.find(mask => mask.regionId === structure.backgroundRegionId);
  assert.equal(backgroundMask.mode, 'subject-exclusion'); assert.equal(backgroundMask.excludeCount, undefined); assert.equal(backgroundMask.excludePaths.length, structure.subjectRegionIds.length);
  assert.deepEqual(new Set(recipes.map(recipe => recipe.operation)), new Set(PAINTING_RECIPE_OPERATIONS));
  assert.deepEqual(compiled.preview.components, { background: 5, 'leaf-left': 7, 'leaf-right': 7, stem: 6, crown: 72, 'flower-center': 6 });
  assert.equal(compiled.checks.passed, true, JSON.stringify(compiled.checks.failed));
  const wp5 = app.flora.crown.compile(createWP6Plan().crownPlan);
  const average = (items, key) => items.reduce((sum, item) => sum + item[key], 0) / items.length;
  const oldDirection = wp5.recipes.filter(recipe => recipe.operation === 'Directional Brushwork' && recipe.targetRegionId.includes(':petal:'));
  const nextDirection = compiled.recipes.filter(recipe => recipe.operation === 'Directional Brushwork' && recipe.metadata.component === 'crown');
  const oldWash = wp5.recipes.filter(recipe => recipe.operation === 'Base Wash' && recipe.targetRegionId.includes(':petal:'));
  const nextWash = compiled.recipes.filter(recipe => recipe.operation === 'Base Wash' && recipe.metadata.component === 'crown');
  assert.ok(average(nextDirection, 'jitter') < average(oldDirection, 'jitter'));
  assert.ok(average(nextWash, 'density') > average(oldWash, 'density'));
  assert.equal(compiled.checks.checks.find(item => item.name === 'center integration').passed, true);
  assert.equal(compiled.checks.checks.find(item => item.name === 'surface continuity').passed, true);
});

test('Complete A4 Hero execution is one atomic transaction with editable clipped strokes, component mappings, manual coexistence, and non-flat operations', { concurrency: false }, () => {
  const app = createWP6App(), manual = addManualStroke(app), result = app.flora.completeHero.execute(createWP6Plan());
  assert.equal(result.ok, true, JSON.stringify(result.details)); assert.equal(result.atomic, true); assert.equal(result.historyEntriesAdded, 1);
  assert.ok(result.strokeCount > 900); assert.equal(result.checks.passed, true, JSON.stringify(result.checks.failed));
  const map = app.flora.completeHero.mapping('wp6-a4-hero'); assert.equal(map.recipeIds.length, 103); assert.equal(map.strokeIds.length, result.strokeCount);
  assert.ok(app.flora.adapter.objectExists(manual)); assertStrokeSamplesClipped(app, map.strokeIds);
  const components = new Set(map.strokeIds.map(id => app.flora.adapter.findObject(id)?.object?.floraPaint?.component));
  assert.deepEqual(components, new Set(['background', 'leaf-left', 'leaf-right', 'stem', 'crown', 'flower-center']));
  const operations = new Set(map.strokeIds.map(id => app.flora.adapter.findObject(id)?.object?.floraPaint?.recipeOperation));
  assert.deepEqual(operations, new Set(PAINTING_RECIPE_OPERATIONS));
  const completeHash = app.flora.documentHash(), completeReplay = app.flora.replayHash();
  assert.equal(app.history.undo(), true); assert.ok(app.flora.adapter.objectExists(manual));
  assert.equal(app.history.redo(), true); assert.equal(app.flora.documentHash(), completeHash); assert.equal(app.flora.replayHash(), completeReplay); assert.ok(app.flora.adapter.objectExists(manual));
});

test('background compound Mask excludes every subject Region and cache invalidation remains deterministic', { concurrency: false }, () => {
  const app = createWP6App(), compiled = app.flora.completeHero.compile(createWP6Plan()), structure = compiled.structure;
  app.page().floraHero = structuredClone(structure);
  const background = app.flora.adapter.mask(structure.backgroundRegionId);
  for (const regionId of structure.subjectRegionIds) {
    const region = app.flora.adapter.region(regionId), center = region.growthAxis?.base || region.path[0];
    assert.equal(maskAlphaAt(background, center.x, center.y), 0, `${regionId} not excluded from background`);
  }
  assert.ok(maskAlphaAt(background, .02, .98) > 0);
  const first = app.flora.adapter.maskCache.getOrCreate(background, 128, 181), key = background.cacheKey;
  const invalidated = app.flora.dispatch({ schemaVersion: '0.1', actionId: 'wp6-mask-invalidate', type: 'invalidateMaskCache', targetId: structure.backgroundRegionId, payload: { regionId: structure.backgroundRegionId }, seed: 0, metadata: { source: 'ai', label: 'WP6 background cache invalidation' } });
  assert.equal(invalidated.ok, true); const second = app.flora.adapter.maskCache.getOrCreate(background, 128, 181);
  assert.notEqual(background.cacheKey, key); assert.equal(second.excludeCount, structure.subjectRegionIds.length);
});

test('Crown, petal, center, stem, left/right leaf, background, and operation local recompiles preserve non-target strokes, manual content, and History', { concurrency: false }, () => {
  const app = createWP6App(), manual = addManualStroke(app, 'manual-local-wp6'); assert.equal(app.flora.completeHero.execute(createWP6Plan()).ok, true);
  const runtime = app.flora.completeHero, beforeUndo = app.history.undoStack.length;
  const calls = [
    () => runtime.recompilePetal('wp6-a4-hero', 'wp6-a4-hero:crown:petal:01', { operation: 'Central Light', patch: { opacity: [.04, .12] } }),
    () => runtime.recompileCenter('wp6-a4-hero', { operation: 'Directional Brushwork', patch: { palette: ['#e2b764'] } }),
    () => runtime.recompileStem('wp6-a4-hero', { operation: 'Transparent Glaze', patch: { opacity: [.02, .08] } }),
    () => runtime.recompileLeaf('wp6-a4-hero', 'left', { operation: 'Central Light', patch: { palette: ['#a7bd8c'] } }),
    () => runtime.recompileLeaf('wp6-a4-hero', 'right', { operation: 'Boundary Dissolve', patch: { edgeSoftness: .022 } }),
    () => runtime.recompileBackground('wp6-a4-hero', { operation: 'Base Wash', patch: { opacity: [.035, .09] } }),
    () => runtime.recompileOperation('wp6-a4-hero', 'Root Shadow', { component: 'crown', patch: { opacity: [.08, .19] } })
  ];
  for (const call of calls) { const result = call(); assert.equal(result.ok, true, JSON.stringify(result.details)); assert.equal(result.nonTargetUnchanged, true); assert.ok(app.flora.adapter.objectExists(manual)); }
  assert.equal(app.history.undoStack.length, beforeUndo + calls.length);
});

test('same A4 Hero Plan and seed replay identically; changed seed changes structure and compile output', { concurrency: false }, () => {
  const baseline = defaultDocument(), plan = createWP6Plan(777, { heroId: 'wp6-det-hero', planId: 'wp6-det-plan' });
  let first = createWP6App(baseline);
  const ra = first.flora.completeHero.execute(plan), firstReplay = first.flora.replayHash();
  assert.equal(ra.ok, true);
  first = null; globalThis.gc?.();
  const second = createWP6App(baseline), rb = second.flora.completeHero.execute(structuredClone(plan));
  assert.equal(rb.ok, true); assert.equal(ra.compileHash, rb.compileHash); assert.equal(firstReplay, second.flora.replayHash());
  const changed = structuredClone(plan); changed.seed = 778; changed.crownPlan.seed = 778; changed.stemPlan.seed = 789; changed.leafPlans[0].seed = 799; changed.leafPlans[1].seed = 800; changed.backgroundPlan.seed = 809;
  const next = second.flora.completeHero.compile(changed); assert.equal(next.ok, true); assert.notEqual(next.compileHash, ra.compileHash); assert.notEqual(next.structureHash, ra.structureHash);
});

test('Plan → Recipe → Action → Scene and .ink roundtrip preserve all A4 Hero mappings and replay hashes', { concurrency: false }, () => {
  const app = createWP6App(), plan = createWP6Plan(888, { heroId: 'wp6-roundtrip-hero', planId: 'wp6-roundtrip-plan' });
  const compiled = app.flora.completeHero.compile(plan); assert.equal(compiled.ok, true); assert.ok(compiled.compiledRecipes.every(item => item.actions.length));
  const result = app.flora.completeHero.execute(plan); assert.equal(result.ok, true);
  const mapping = app.flora.completeHero.mapping(plan.heroId), replay = app.flora.replayHash(), heroReplay = app.flora.completeHero.replayHash(plan.heroId);
  const json = app.flora.serializeDocument(); app.flora.reloadDocument(json);
  assert.equal(app.flora.replayHash(), replay); assert.equal(app.flora.completeHero.replayHash(plan.heroId), heroReplay);
  assert.deepEqual(app.flora.completeHero.mapping(plan.heroId), mapping); assert.deepEqual(app.flora.completeHero.plan(plan.heroId), plan);
});

test('mid-stage Whole-page failure fully rolls back Composition, Regions, Masks, Recipes, Actions, Strokes, Layer, Cache, Scene, History, and mappings', { concurrency: false }, () => {
  const app = createWP6App(), plan = createWP6Plan(999, { heroId: 'wp6-rollback-hero', planId: 'wp6-rollback-plan' });
  const before = app.flora.documentHash(), replay = app.flora.replayHash(), undo = app.history.undoStack.length, mapping = new Map(app.flora.adapter.actionObjectMap);
  const original = app.flora.adapter.execute.bind(app.flora.adapter); let count = 0;
  app.flora.adapter.execute = (action, options) => { if (action.type === 'paintRegion' && ++count === 31) throw new Error('injected WP6 whole-page pass failure'); return original(action, options); };
  const result = app.flora.completeHero.execute(plan); app.flora.adapter.execute = original;
  assert.equal(result.ok, false); assert.equal(result.code, 'A4_HERO_ROLLBACK'); assert.equal(result.details.rolledBack, true); assert.equal(result.details.replayRestored, true);
  assert.equal(app.flora.documentHash(), before); assert.equal(app.flora.replayHash(), replay); assert.equal(app.history.undoStack.length, undo); assert.deepEqual(app.flora.adapter.actionObjectMap, mapping);
  assert.equal(app.page().floraHero, undefined); assert.equal(app.page().floraHeroPaintingState, undefined); assert.equal(app.flora.maskCacheDiagnostics().entries, 0);
});

