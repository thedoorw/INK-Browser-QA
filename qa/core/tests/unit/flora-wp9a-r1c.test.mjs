import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App } from '../helpers/flora-wp6-fixture.mjs';
import { createFLR012HeroPaintingPlan } from '../../src/flora/species/flr012-adonis.js';
import {
  measureHeroPaintedRetention, evaluatePaintedRetentionGates, PAINTED_RETENTION_THRESHOLDS
} from '../../src/flora/retention/painted-geometry-retention.js';

const HERO_ID = 'flr012-adonis-candidate-a';
function buildExecutedFixture() {
  const app = createWP6App(), plan = createFLR012HeroPaintingPlan(12012);
  const result = app.flora.completeHero.execute(plan);
  assert.equal(result.ok, true, JSON.stringify(result));
  const page = app.page(), structure = page.floraHero;
  const measurement = measureHeroPaintedRetention({ page, structure, width: 128, height: 181 });
  const gates = evaluatePaintedRetentionGates(measurement);
  const recipes = Object.values(page.floraRecipeState.recipes).map(entry => entry.recipe);
  return { app, plan, result, page, structure, measurement, gates, recipes };
}
const cache = buildExecutedFixture();
function executed() { return cache; }
const regionMetric = id => executed().measurement.regions.find(item => item.regionId === id);
const regionsOf = kind => executed().structure.regions.filter(region => region.kind === kind);

// Actual Path -> Mask -> Stroke-coverage gates.
test('R1c geometry-to-mask area retention reads actual paths and masks', () => {
  const { measurement } = executed();
  assert.ok(measurement.regions.every(item => item.geometryToMaskRetention >= PAINTED_RETENTION_THRESHOLDS.geometryToMaskArea), JSON.stringify(measurement.regions));
});

test('R1c mask-to-raster area retention passes for painted subject regions', () => {
  const { gates, measurement } = executed();
  assert.equal(gates.checks.maskToFinalAlphaArea, true, JSON.stringify(measurement.regions));
});

test('R1c visible-color retention passes sampled stroke raster', () => {
  const { gates } = executed();
  assert.equal(gates.checks.finalVisibleColorArea, true, JSON.stringify(gates));
});

test('R1c petal body coverage passes normalized gate', () => {
  const { measurement } = executed();
  assert.ok(measurement.crown.bodyCoverage >= PAINTED_RETENTION_THRESHOLDS.petalBodyCoverage, measurement.crown.bodyCoverage);
});

test('R1c petal root coverage passes localized root selector', () => {
  const { measurement } = executed();
  assert.ok(measurement.crown.rootCoverage >= PAINTED_RETENTION_THRESHOLDS.petalRootCoverage, measurement.crown.rootCoverage);
});

test('R1c inner and outer rings survive painted raster', () => {
  const { measurement } = executed();
  assert.ok(measurement.crown.innerRingSurvival >= PAINTED_RETENTION_THRESHOLDS.ringSurvival, measurement.crown.innerRingSurvival);
  assert.ok(measurement.crown.outerRingSurvival >= PAINTED_RETENTION_THRESHOLDS.ringSurvival, measurement.crown.outerRingSurvival);
});

test('R1c painted crown remains one primary connected mass', () => {
  const { measurement } = executed();
  assert.equal(measurement.crown.paintedConnectedComponentCount, 1, JSON.stringify(measurement.crown));
  assert.ok(measurement.crown.primaryComponentRatio >= .985, measurement.crown.primaryComponentRatio);
});

test('R1c painted radial gap and crown core occupancy do not regress', () => {
  const { measurement } = executed();
  assert.ok(measurement.crown.radialGapRatio <= PAINTED_RETENTION_THRESHOLDS.maximumPaintedRadialGapRatio, measurement.crown.radialGapRatio);
  assert.ok(measurement.crown.coreCoverage >= PAINTED_RETENTION_THRESHOLDS.crownCoreCoverage, measurement.crown.coreCoverage);
});

test('R1c center mass field remains visible after painting', () => {
  const { measurement } = executed();
  assert.ok(measurement.center.bodyCoverage >= PAINTED_RETENTION_THRESHOLDS.centerVisibleRatio, JSON.stringify(measurement.center));
  assert.ok(measurement.center.meanPigmentDensity >= .20, measurement.center.meanPigmentDensity);
});

test('R1c center irregular features survive actual stroke raster', () => {
  const { measurement } = executed();
  assert.ok(measurement.center.featureSurvival >= PAINTED_RETENTION_THRESHOLDS.centerFeatureSurvival, measurement.center.featureSurvival);
});

test('R1c center geometry remains partly occluded and partly visible', () => {
  const center = executed().structure.regions.find(region => region.kind === 'flower-center-region');
  assert.ok(center.center.occludedBy.length >= 3 && center.center.occludedBy.length <= 5);
  const metric = executed().measurement.center;
  assert.ok(metric.centerOcclusionRatio > .02 && metric.centerOcclusionRatio < .65, JSON.stringify(metric));
  assert.ok(metric.centerExpectedVisibleRatio > .35 && metric.centerExpectedVisibleRatio < .98, JSON.stringify(metric));
  assert.ok(metric.centerVisibleCoverage >= .90, JSON.stringify(metric));
});

test('R1c each leaf compound mask receives full body coverage', () => {
  for (const leaf of regionsOf('leaf-region')) {
    const metric = regionMetric(leaf.regionId);
    assert.ok(metric.bodyCoverage >= PAINTED_RETENTION_THRESHOLDS.leafBodyWidthRetention, JSON.stringify(metric));
  }
});

test('R1c leaf central axes survive the painted raster', () => {
  for (const leaf of regionsOf('leaf-region')) assert.ok(regionMetric(leaf.regionId).axisSurvival >= .90, leaf.regionId);
});

test('R1c lobe peaks survive and valleys remain mask-negative', () => {
  const { measurement } = executed();
  assert.ok(measurement.leaves.averageLobeSurvival >= PAINTED_RETENTION_THRESHOLDS.leafLobeSurvival, measurement.leaves.averageLobeSurvival);
  for (const leaf of regionsOf('leaf-region')) assert.equal(regionMetric(leaf.regionId).connectedComponentCount, 1, leaf.regionId);
});

test('R1c small-view leaf silhouettes retain compound geometry', () => {
  const { measurement } = executed();
  assert.ok(measurement.leaves.averageSmallViewSilhouetteRetention >= PAINTED_RETENTION_THRESHOLDS.leafSmallViewSilhouette, measurement.leaves.averageSmallViewSilhouetteRetention);
});

test('R1c exactly four painted independent leaf components remain', () => {
  const metrics = executed().measurement.regions.filter(item => item.kind === 'leaf-region');
  assert.equal(metrics.length, 4);
  assert.ok(metrics.every(item => item.connectedComponentCount === 1), JSON.stringify(metrics));
});

test('R1c generic painted-ribbon warning remains cleared by lobe retention', () => {
  for (const leaf of regionsOf('leaf-region')) {
    const metric = regionMetric(leaf.regionId);
    assert.ok(metric.lobeSurvival >= .70 && metric.smallViewSilhouetteRetention >= .72, JSON.stringify(metric));
  }
});

test('R1c stem visual weight no longer exceeds leaf mass', () => {
  const { measurement } = executed();
  assert.ok(measurement.stem.stemToLeafVisualWeightRatio <= PAINTED_RETENTION_THRESHOLDS.stemToLeafVisualWeightMaximum, measurement.stem.stemToLeafVisualWeightRatio);
});

test('R1c Base Wash recipes contain executable retention constraints', () => {
  const base = executed().recipes.filter(recipe => recipe.operation === 'Base Wash' && recipe.metadata.component !== 'background');
  assert.ok(base.length >= 20);
  assert.ok(base.every(recipe => recipe.constraints.coverageRetention?.fillSections >= 4), JSON.stringify(base.slice(0, 2)));
});

test('R1c base-mass strokes are generated before directional strokes', () => {
  const objects = executed().page.layers.flatMap(layer => layer.objects || []).filter(object => object.floraPaint);
  for (const region of regionsOf('petal-region').slice(0, 3)) {
    const regionObjects = objects.filter(object => object.floraPaint.regionId === region.regionId);
    const firstBase = regionObjects.findIndex(object => object.floraPaint.operation === 'Base Wash');
    const firstDirectional = regionObjects.findIndex(object => object.floraPaint.operation === 'Directional Brushwork');
    assert.ok(firstBase >= 0 && firstDirectional > firstBase, region.regionId);
  }
});

test('R1c no dropout applies to retention base-mass strokes', () => {
  const baseObjects = executed().page.layers.flatMap(layer => layer.objects || []).filter(object => object.floraPaint?.operation === 'Base Wash' && object.floraPaint.baseMassStrategy === 'non-periodic-full-body');
  assert.equal(baseObjects.length, 80);
  assert.ok(baseObjects.every(object => object.floraPaint.constraints.coverageRetention));
  assert.ok(baseObjects.filter(object => object.floraPaint.baseMassLayer !== 'sparse-directional-deposit').every(object => object.floraPaint.frequencyLayer === 'low'));
  assert.ok(baseObjects.filter(object => object.floraPaint.baseMassLayer === 'sparse-directional-deposit').every(object => object.floraPaint.frequencyLayer === 'mid'));
  assert.ok(baseObjects.every(object => !String(object.floraPaint.index).includes('cross-fill')));
});

test('R1c adaptive feather is smaller for filigree leaf base mass', () => {
  const leafBase = executed().recipes.filter(recipe => recipe.operation === 'Base Wash' && recipe.metadata.component?.startsWith('leaf-'));
  assert.equal(leafBase.length, 4);
  assert.ok(leafBase.every(recipe => recipe.feather <= .0035 && recipe.constraints.coverageRetention.localFeatherScale <= .18));
});

test('R1c mask erosion is not repeated and Region masks equal locked geometry', () => {
  const { structure } = executed(), masks = new Map(structure.masks.map(mask => [mask.regionId, mask]));
  for (const region of structure.regions.filter(region => region.kind !== 'background-region')) assert.deepEqual(masks.get(region.regionId).path, region.path);
});

test('R1c same seed compiler output is deterministic and different seed varies', () => {
  const app = createWP6App();
  const a = app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  const b = app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  const c = app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12013));
  assert.equal(a.ok, true); assert.equal(b.ok, true); assert.equal(c.ok, true);
  assert.equal(a.compileHash, b.compileHash);
  assert.notEqual(a.compileHash, c.compileHash);
});

test('R1c aggregate painted retention Gate passes', () => {
  const { gates } = executed();
  assert.equal(gates.ok, true, JSON.stringify(gates));
});
