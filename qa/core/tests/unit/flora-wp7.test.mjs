import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { Matrix } from '../../src/core/math.js';
import { maskAlphaAt, worldPointToNormalized } from '../../src/flora/mask/vector-mask.js';
import { REFINEMENT_FIELDS } from '../../src/flora/recipe/refined-painting-parameters.js';
import { createWP6App, createWP6Plan, addManualStroke, stableObjectHash } from '../helpers/flora-wp6-fixture.mjs';

afterEach(() => globalThis.gc?.());

const heroId = 'wp6-a4-hero';
const clone = value => structuredClone(value);
const absolutePoints = stroke => stroke.points.map(point => Matrix.point(stroke.matrix, point));
const stable = value => JSON.stringify(value, (key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((out, name) => (out[name] = item[name], out), {}) : item);

function mappingObjects(app) {
  const mapping = app.flora.completeHero.mapping(heroId);
  return { mapping, objects: mapping.strokeIds.map(id => app.flora.adapter.findObject(id)?.object).filter(Boolean) };
}

function assertSampledClipping(app, objects, maxStrokes = 120) {
  for (const stroke of objects.slice(0, maxStrokes)) {
    const mask = app.flora.adapter.mask(stroke.floraPaint.regionId);
    for (const point of absolutePoints(stroke).filter((_, index) => index % Math.max(1, Math.floor(stroke.points.length / 8)) === 0)) {
      const normalized = worldPointToNormalized(app.page(), point);
      assert.ok(maskAlphaAt(mask, normalized.x, normalized.y) > 0, `${stroke.id} escaped ${mask.regionId}`);
    }
  }
}

test('WP7 Recipe 0.2 refinement validates while legacy Recipe 0.1 remains compatible', { concurrency: false }, () => {
  const app = createWP6App();
  const compiledHero = app.flora.completeHero.compile(createWP6Plan());
  assert.equal(compiledHero.ok, true);
  app.page().floraHero = clone(compiledHero.structure);
  const recipe = compiledHero.recipes.find(item => item.metadata.component === 'crown' && item.operation === 'Base Wash');
  const validation = app.flora.recipe.validate(recipe);
  assert.equal(validation.ok, true, JSON.stringify(validation.errors));
  assert.equal(validation.recipe.schemaVersion, '0.2');
  assert.deepEqual(new Set(Object.keys(validation.recipe.refinement)), new Set(REFINEMENT_FIELDS));

  const legacy = clone(recipe);
  legacy.schemaVersion = '0.1';
  delete legacy.refinement;
  const legacyValidation = app.flora.recipe.validate(legacy);
  assert.equal(legacyValidation.ok, true, JSON.stringify(legacyValidation.errors));
  assert.equal(legacyValidation.recipe.schemaVersion, '0.1');
  assert.equal(legacyValidation.recipe.refinement, undefined);

  const invalid = clone(recipe);
  invalid.refinement.regionInteriorSmoothing = 2;
  const invalidValidation = app.flora.recipe.validate(invalid);
  assert.equal(invalidValidation.ok, false);
  assert.ok(invalidValidation.errors.some(error => error.path === '$.refinement.regionInteriorSmoothing'));
});

test('WP7 compiler produces deterministic refined Recipes, controlled petal asymmetry, and all visual checks', { concurrency: false }, () => {
  const app = createWP6App();
  const first = app.flora.completeHero.compile(createWP6Plan(606));
  const second = app.flora.completeHero.compile(createWP6Plan(606));
  const changed = app.flora.completeHero.compile(createWP6Plan(607));
  assert.equal(first.ok, true); assert.equal(second.ok, true); assert.equal(changed.ok, true);
  assert.equal(first.compileHash, second.compileHash);
  assert.notEqual(first.compileHash, changed.compileHash);
  assert.equal(first.checks.passed, true, JSON.stringify(first.checks.failed));
  const requiredChecks = [
    'petal surface continuity', 'petal silhouette coherence', 'radial regularity warning',
    'brush repetition warning', 'center integration refined', 'stem continuity',
    'leaf mass coherence', 'leaf tip integrity refined', 'background quietness',
    'focal dominance refined', 'small-view readability', 'procedural artifact warning'
  ];
  for (const name of requiredChecks) assert.equal(first.checks.checks.find(item => item.name === name)?.passed, true, name);

  assert.ok(first.recipes.every(recipe => recipe.schemaVersion === '0.2' && recipe.refinement));
  for (const recipe of first.recipes) assert.deepEqual(new Set(Object.keys(recipe.refinement)), new Set(REFINEMENT_FIELDS));
  const petalRegions = first.structure.regions.filter(region => region.kind === 'petal-region');
  assert.equal(petalRegions.length, 8);
  assert.ok(new Set(petalRegions.map(region => Math.round(region.growthAxis.tip.y * 10000))).size > 3);
  assert.ok(new Set(petalRegions.map(region => Math.round((region.width || region.petal?.width || 0) * 10000))).size > 1 ||
    new Set(petalRegions.map(region => stable(region.path))).size === petalRegions.length);

  const petalRecipes = first.recipes.filter(recipe => recipe.metadata.component === 'crown');
  const variationSignatures = new Set(petalRecipes.filter(recipe => recipe.operation === 'Directional Brushwork').map(recipe => stable({
    target: recipe.targetRegionId, opacity: recipe.opacity, density: recipe.density, width: recipe.widthRange,
    jitter: recipe.jitter, refinement: recipe.refinement
  })));
  assert.equal(variationSignatures.size, petalRegions.length);
});

test('WP7 whole-page execution creates editable mask-clipped, non-flat, smoothly integrated strokes with Undo Redo and roundtrip', { concurrency: false }, () => {
  const app = createWP6App();
  const manualId = addManualStroke(app, 'manual-wp7-coexist');
  const result = app.flora.completeHero.execute(createWP6Plan());
  assert.equal(result.ok, true, JSON.stringify(result.details));
  assert.equal(result.atomic, true); assert.equal(result.historyEntriesAdded, 1);
  assert.ok(result.strokeCount > 200);
  assert.equal(result.checks.passed, true, JSON.stringify(result.checks.failed));
  assert.ok(app.flora.adapter.objectExists(manualId));

  const { mapping, objects } = mappingObjects(app);
  assert.equal(mapping.strokeIds.length, result.strokeCount);
  assertSampledClipping(app, objects);
  assert.ok(objects.every(object => ['0.2','0.3'].includes(object.floraPaint?.refinement?.schemaVersion)));
  assert.ok(objects.every(object => ['0.4-visual-recovery','0.5-painterly-mass','0.6-painted-retention','0.7-nonperiodic-fill'].includes(object.floraPaint?.compilerVersion)));
  assert.ok(objects.some(object => typeof object.floraPaint.index === 'string' && object.floraPaint.index === 'petal-underpaint'));
  assert.ok(objects.some(object => typeof object.floraPaint.index === 'string' && object.floraPaint.index.startsWith('background-low-field-')));
  assert.ok(objects.some(object => typeof object.floraPaint.index === 'string' && ['petal-ridge-light', 'stem-long-light', 'leaf-ridge'].includes(object.floraPaint.index)));
  assert.ok(objects.some(object => object.points.length > 30));
  assert.ok(objects.some(object => object.smoothing > .85));
  assert.ok(objects.filter(object => object.floraPaint.component === 'crown').every(object => (object.grain || 0) <= .2 && (object.bristle || 0) <= .2));
  const petalBase = objects.filter(object => object.floraPaint.regionId.endsWith(':petal:01') && object.floraPaint.recipeOperation === 'Base Wash');
  assert.ok(new Set(petalBase.map(object => object.color)).size >= 4);
  assert.ok(petalBase.some(object => object.kind === 'brush'));
  assert.ok(petalBase.some(object => object.kind === 'airbrush'));

  const docHash = app.flora.documentHash(), replayHash = app.flora.replayHash(), heroReplay = app.flora.completeHero.replayHash(heroId);
  assert.equal(app.history.undo(), true); assert.ok(app.flora.adapter.objectExists(manualId));
  assert.equal(app.history.redo(), true);
  assert.equal(app.flora.documentHash(), docHash); assert.equal(app.flora.replayHash(), replayHash);
  assert.equal(app.flora.completeHero.replayHash(heroId), heroReplay);

  const serialized = app.flora.serializeDocument();
  const reloaded = createWP6App();
  assert.equal(typeof reloaded.flora.reloadDocument(serialized), 'string');
  assert.equal(reloaded.flora.replayHash(), replayHash);
  assert.equal(reloaded.flora.completeHero.replayHash(heroId), heroReplay);
  assert.equal(reloaded.flora.completeHero.mapping(heroId).strokeIds.length, mapping.strokeIds.length);
  assert.ok(reloaded.flora.adapter.objectExists(manualId));
});

test('WP7 local recompilation works for petal, center, stem, both leaves, background, and operation while preserving manual and non-target content', { concurrency: false }, () => {
  const app = createWP6App();
  const manualId = addManualStroke(app, 'manual-wp7-local');
  const result = app.flora.completeHero.execute(createWP6Plan());
  assert.equal(result.ok, true);
  const entry = app.flora.completeHero.lookup(heroId);
  const firstPetal = app.flora.adapter.hero().regions.find(region => region.kind === 'petal-region').regionId;
  const targets = [
    () => app.flora.completeHero.recompilePetal(heroId, firstPetal, { operation: 'Central Light', patch: { opacity: [.03, .09], palette: ['#f1bdcb'], edgeSoftness: .012 } }),
    () => app.flora.completeHero.recompileCenter(heroId, { operation: 'Transparent Glaze', patch: { opacity: [.025, .075], palette: ['#cf6f7d', '#e6a574'] } }),
    () => app.flora.completeHero.recompileStem(heroId, { operation: 'Central Light', patch: { opacity: [.025, .08], palette: ['#82a283'] } }),
    () => app.flora.completeHero.recompileLeaf(heroId, 'left', { operation: 'Central Light', patch: { opacity: [.025, .08], palette: ['#8eae8b'] } }),
    () => app.flora.completeHero.recompileLeaf(heroId, 'right', { operation: 'Transparent Glaze', patch: { opacity: [.02, .065], palette: ['#557a5d', '#89a986'] } }),
    () => app.flora.completeHero.recompileBackground(heroId, { operation: 'Directional Brushwork', patch: { opacity: [.006, .018], palette: ['#eadfda'] } }),
    () => app.flora.completeHero.recompileOperation(heroId, 'Boundary Dissolve', { regionId: entry.backgroundRegionId, patch: { opacity: [.008, .025] } })
  ];
  for (const run of targets) {
    const local = run();
    assert.equal(local.ok, true, JSON.stringify(local.details));
    assert.equal(local.atomic, true); assert.equal(local.nonTargetUnchanged, true);
    assert.equal(local.historyEntriesAdded, 1);
    assert.ok(app.flora.adapter.objectExists(manualId));
  }
  assert.ok(app.flora.completeHero.lookup(heroId).localRevision >= targets.length);
});

test('WP7 invalid refined Recipe is rejected with zero Scene History Mask Stroke or Cache mutation', { concurrency: false }, () => {
  const app = createWP6App();
  const compiledHero = app.flora.completeHero.compile(createWP6Plan());
  app.page().floraHero = clone(compiledHero.structure);
  const recipe = clone(compiledHero.recipes.find(item => item.metadata.component === 'crown'));
  recipe.recipeId = 'wp7-invalid-refinement';
  recipe.refinement.textureSuppression = Infinity;
  const before = {
    document: app.flora.documentHash(), replay: app.flora.replayHash(), undo: app.history.undoStack.length,
    redo: app.history.redoStack.length, cache: stable(app.flora.maskCacheDiagnostics())
  };
  const result = app.flora.recipe.execute(recipe);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'RECIPE_VALIDATION_FAILED');
  assert.equal(app.flora.documentHash(), before.document); assert.equal(app.flora.replayHash(), before.replay);
  assert.equal(app.history.undoStack.length, before.undo); assert.equal(app.history.redoStack.length, before.redo);
  assert.equal(stable(app.flora.maskCacheDiagnostics()), before.cache);
});

test('WP7 injected pass failure completely rolls back whole-page Plan Recipe Action Stroke Mask Cache History and mappings', { concurrency: false }, () => {
  const app = createWP6App();
  const before = {
    document: app.flora.documentHash(), replay: app.flora.replayHash(), undo: app.history.undoStack.length,
    redo: app.history.redoStack.length, cache: stable(app.flora.maskCacheDiagnostics()), map: stable([...app.flora.adapter.actionObjectMap])
  };
  const original = app.flora.adapter.execute.bind(app.flora.adapter);
  let paints = 0;
  app.flora.adapter.execute = (action, options) => {
    if (action.type === 'paintRegion' && ++paints === 17) throw new Error('WP7 injected refined pass failure');
    return original(action, options);
  };
  const result = app.flora.completeHero.execute(createWP6Plan());
  app.flora.adapter.execute = original;
  assert.equal(result.ok, false); assert.equal(result.code, 'A4_HERO_ROLLBACK');
  assert.equal(result.details.rolledBack, true); assert.equal(result.details.replayRestored, true); assert.equal(result.details.historyUnchanged, true);
  assert.equal(app.flora.documentHash(), before.document); assert.equal(app.flora.replayHash(), before.replay);
  assert.equal(app.history.undoStack.length, before.undo); assert.equal(app.history.redoStack.length, before.redo);
  assert.equal(stable(app.flora.maskCacheDiagnostics()), before.cache);
  assert.equal(stable([...app.flora.adapter.actionObjectMap]), before.map);
  assert.equal(app.flora.completeHero.lookup(heroId), null);
});
