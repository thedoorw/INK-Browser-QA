import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { defaultRefinedPaintingParameters, validateRefinedPaintingParameters, REFINEMENT_FIELDS } from '../../src/flora/recipe/refined-painting-parameters.js';
import { createWP6App, createWP6Plan, addManualStroke, stableObjectHash } from '../helpers/flora-wp6-fixture.mjs';

afterEach(() => globalThis.gc?.());
const HERO_ID = 'wp6-a4-hero';
const stable = value => JSON.stringify(value, (key, item) => item && typeof item === 'object' && !Array.isArray(item)
  ? Object.keys(item).sort().reduce((out, name) => (out[name] = item[name], out), {}) : item);

function compiled(seed = 606) {
  const app = createWP6App();
  const result = app.flora.completeHero.compile(createWP6Plan(seed));
  assert.equal(result.ok, true, JSON.stringify(result.errors || result.details));
  return { app, result };
}
function petals(result) { return result.structure.regions.filter(region => region.kind === 'petal-region'); }
function angleGaps(regions) {
  const values = regions.map(region => {
    const axis = region.growthAxis;
    return Math.atan2((axis.tip.y - axis.base.y) * Math.SQRT2, axis.tip.x - axis.base.x);
  }).sort((a,b)=>a-b);
  return values.map((angle,index) => {
    const next = index === values.length - 1 ? values[0] + Math.PI * 2 : values[index + 1];
    return next - angle;
  });
}

// Governance-specific recovery schema, with old 0.1 refinement still accepted.
test('WP7R refinement schema adds recoverable visual fields and keeps legacy refinement compatible', () => {
  for (const component of ['crown','center','stem','leaf','background']) {
    const refinement = defaultRefinedPaintingParameters(component);
    const validation = validateRefinedPaintingParameters(refinement);
    assert.equal(validation.ok, true, `${component}: ${JSON.stringify(validation.errors)}`);
    assert.deepEqual(new Set(Object.keys(validation.refinement)), REFINEMENT_FIELDS);
  }
  const legacy = defaultRefinedPaintingParameters('crown');
  legacy.schemaVersion = '0.1';
  for (const key of ['multiBandColorField','localWarmCoolShift','glazeAccumulationMap','edgeTranslucency','strokeClustering','strokeDropout','nonuniformTextureSuppression','centerOcclusionMap','leafCrossSectionField','backgroundLowFrequencyField']) delete legacy[key];
  assert.equal(validateRefinedPaintingParameters(legacy).ok, true);
});

test('WP7R crown uses deterministic nonuniform angular spacing, length, width, curvature, and overlap depth', () => {
  const app = createWP6App();
  const a = app.flora.completeHero.compile(createWP6Plan(606));
  const b = app.flora.completeHero.compile(createWP6Plan(606));
  const c = app.flora.completeHero.compile(createWP6Plan(607));
  assert.equal(a.ok, true); assert.equal(b.ok, true); assert.equal(c.ok, true);
  assert.equal(a.compileHash, b.compileHash);
  assert.notEqual(a.compileHash, c.compileHash);
  const p = petals(a), gaps = angleGaps(p);
  assert.ok(Math.max(...gaps) - Math.min(...gaps) > .10, 'angular spacing remains mechanically equal');
  assert.ok(new Set(p.map(item => Math.round(item.petal.length * 10000))).size >= 5);
  assert.ok(new Set(p.map(item => Math.round(item.petal.width * 10000))).size >= 5);
  assert.ok(new Set(p.map(item => Math.round(item.petal.bend * 10000))).size >= 5);
  assert.ok(new Set(p.map(item => item.z)).size >= 5);
  assert.equal(a.structure.crownOverlapGraph.mode, 'asymmetric-seeded');
  assert.ok(a.structure.crownOverlapGraph.edges.some(edge => edge.kind === 'petal-seam'));
});

test('WP7R center is partially occluded and topologically integrated rather than placed above all petals', () => {
  const { result } = compiled();
  const p = petals(result), center = result.structure.regions.find(region => region.kind === 'flower-center-region');
  assert.ok(center.overlaps.length > 0 && center.overlaps.length < p.length);
  assert.ok(p.some(region => region.overlaps.some(edge => edge.frontRegionId === center.regionId)));
  assert.ok(p.every(region => region.overlaps.some(edge => edge.frontRegionId === center.regionId) || center.overlaps.some(edge => edge.frontRegionId === region.regionId)));
  assert.ok(result.recipes.some(recipe => recipe.targetRegionId === center.regionId && recipe.operation === 'Overlap Shadow'));
  assert.ok(result.recipes.filter(recipe => recipe.targetRegionId === center.regionId).every(recipe => recipe.refinement.centerOcclusionMap.irregularity > 0));
});

test('WP7R recipes expose multilayer petal fields, leaf cross-section fields, and low-frequency background fields', () => {
  const { result } = compiled();
  const petalRecipes = result.recipes.filter(recipe => recipe.metadata.component === 'crown');
  assert.ok(petalRecipes.every(recipe => recipe.refinement.multiBandColorField.bands >= 2));
  assert.ok(petalRecipes.some(recipe => Math.abs(recipe.refinement.localWarmCoolShift.left - recipe.refinement.localWarmCoolShift.right) > .08));
  assert.ok(petalRecipes.some(recipe => recipe.refinement.glazeAccumulationMap.root !== recipe.refinement.glazeAccumulationMap.tip));
  const leafRecipes = result.recipes.filter(recipe => String(recipe.metadata.component).startsWith('leaf-'));
  assert.ok(leafRecipes.every(recipe => recipe.refinement.leafCrossSectionField.ridge > 0));
  const backgroundRecipes = result.recipes.filter(recipe => recipe.metadata.component === 'background');
  assert.ok(backgroundRecipes.every(recipe => recipe.refinement.backgroundLowFrequencyField.amplitude > 0));
  assert.ok(backgroundRecipes.every(recipe => recipe.refinement.nonuniformTextureSuppression.interior >= .98));
});

test('WP7R execution creates clipped editable recovery strokes without regular background grid tracks', { concurrency: false }, () => {
  const app = createWP6App();
  const execution = app.flora.completeHero.execute(createWP6Plan());
  assert.equal(execution.ok, true, JSON.stringify(execution.details));
  assert.ok(execution.strokeCount > 200 && execution.strokeCount < 700, 'stroke recovery should integrate paint rather than increase repeated tracks');
  const mapping = app.flora.completeHero.mapping(HERO_ID);
  const objects = mapping.strokeIds.map(id => app.flora.adapter.findObject(id)?.object).filter(Boolean);
  assert.ok(objects.every(object => object.type === 'stroke' && ['0.4-visual-recovery','0.5-painterly-mass','0.6-painted-retention','0.7-nonperiodic-fill'].includes(object.floraPaint?.compilerVersion)));
  assert.ok(objects.some(object => object.floraPaint.index === 'petal-underpaint'));
  assert.ok(objects.some(object => object.floraPaint.index === 'leaf-ridge'));
  assert.ok(objects.some(object => object.floraPaint.index === 'stem-body'));
  const backgroundIndexes = objects.filter(object => object.floraPaint.component === 'background').map(object => String(object.floraPaint.index));
  assert.ok(backgroundIndexes.some(index => index.startsWith('background-low-field-')));
  assert.equal(backgroundIndexes.some(index => index.includes('grid') || index.includes('vertical-track') || index.includes('horizontal-track')), false);
});

test('WP7R local recompilation preserves non-target regions and manual strokes', { concurrency: false }, () => {
  const app = createWP6App();
  const manualId = addManualStroke(app, 'manual-wp7r');
  assert.equal(app.flora.completeHero.execute(createWP6Plan()).ok, true);
  const mapping = app.flora.completeHero.mapping(HERO_ID);
  const target = app.flora.adapter.hero().regions.find(region => region.kind === 'petal-region').regionId;
  const targetIds = new Set((mapping.regionRecipeIds[target] || []).flatMap(id => mapping.recipeToStrokeIds[id] || []));
  const nonTarget = mapping.strokeIds.filter(id => !targetIds.has(id));
  const before = stableObjectHash(app, nonTarget);
  const local = app.flora.completeHero.recompilePetal(HERO_ID, target, { operation: 'Transparent Glaze', patch: { seed: 717, opacity: [.035,.085], palette: ['#c87593','#dfa1b1'] } });
  assert.equal(local.ok, true, JSON.stringify(local.details));
  assert.equal(local.nonTargetUnchanged, true);
  assert.equal(stableObjectHash(app, nonTarget), before);
  assert.ok(app.flora.adapter.objectExists(manualId));
});

test('WP7R retains atomic rollback, Undo/Redo, document roundtrip, and deterministic replay', { concurrency: false }, () => {
  const app = createWP6App();
  const manualId = addManualStroke(app, 'manual-wp7r-reliability');
  const result = app.flora.completeHero.execute(createWP6Plan());
  assert.equal(result.ok, true);
  const documentHash = app.flora.documentHash(), replay = app.flora.replayHash(), heroReplay = app.flora.completeHero.replayHash(HERO_ID);
  assert.equal(app.history.undo(), true); assert.ok(app.flora.adapter.objectExists(manualId));
  assert.equal(app.history.redo(), true);
  assert.equal(app.flora.documentHash(), documentHash); assert.equal(app.flora.replayHash(), replay); assert.equal(app.flora.completeHero.replayHash(HERO_ID), heroReplay);
  const serialized = app.flora.serializeDocument();
  const reloaded = createWP6App();
  reloaded.flora.reloadDocument(serialized);
  assert.equal(reloaded.flora.replayHash(), replay); assert.equal(reloaded.flora.completeHero.replayHash(HERO_ID), heroReplay);

  const rollbackApp = createWP6App();
  const before = { doc: rollbackApp.flora.documentHash(), replay: rollbackApp.flora.replayHash(), undo: rollbackApp.history.undoStack.length, map: stable([...rollbackApp.flora.adapter.actionObjectMap]) };
  const original = rollbackApp.flora.adapter.execute.bind(rollbackApp.flora.adapter); let count = 0;
  rollbackApp.flora.adapter.execute = (action, options) => { if (action.type === 'paintRegion' && ++count === 13) throw new Error('WP7R injected pass failure'); return original(action, options); };
  const failed = rollbackApp.flora.completeHero.execute(createWP6Plan()); rollbackApp.flora.adapter.execute = original;
  assert.equal(failed.ok, false); assert.equal(failed.code, 'A4_HERO_ROLLBACK');
  assert.equal(rollbackApp.flora.documentHash(), before.doc); assert.equal(rollbackApp.flora.replayHash(), before.replay); assert.equal(rollbackApp.history.undoStack.length, before.undo); assert.equal(stable([...rollbackApp.flora.adapter.actionObjectMap]), before.map);
});
