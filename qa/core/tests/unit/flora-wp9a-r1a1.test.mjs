import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App } from '../helpers/flora-wp6-fixture.mjs';
import { createFLR012HeroPaintingPlan } from '../../src/flora/species/flr012-adonis.js';
import { buildCompleteCrownBenchmarkStructure, evaluateNarrowSpoonGeometry } from '../../src/flora/painting/complete-crown-benchmark.js';
import {
  GEOMETRY_GATE_THRESHOLDS,
  measureCrownGeometryGates,
  measureLeafGeometryGates,
  measureFourLeafSeparation,
  rasterizeGeometryPath
} from '../../src/flora/structure/geometry-measurement-gates.js';

const compile = (seed = 12012, mutate = null) => {
  const app = createWP6App();
  const plan = createFLR012HeroPaintingPlan(seed);
  if (mutate) mutate(plan);
  const result = app.flora.completeHero.compile(plan);
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  return result;
};
const mean = values => values.reduce((sum, value) => sum + value, 0) / values.length;

let cached = null;
function measured() {
  if (!cached) {
    const result = compile();
    cached = {
      ...result,
      crown: measureCrownGeometryGates(result.structure),
      leaves: result.structure.regions.filter(region => region.kind === 'leaf-region').map(region => measureLeafGeometryGates(region)),
      separation: measureFourLeafSeparation(result.structure)
    };
  }
  return cached;
}

test('R1a.1 crown union forms one primary connected mass', () => {
  const metrics = measured().crown;
  assert.equal(metrics.petalUnionComponentCount, 1);
  assert.equal(metrics.crownUnionComponentCount, 1);
  assert.ok(metrics.primaryPetalMassRatio >= .995, metrics.primaryPetalMassRatio);
});

test('R1a.1 outer petal roots have actual adjacent mask intersections', () => {
  const metrics = measured().crown, gate = GEOMETRY_GATE_THRESHOLDS.crown;
  assert.equal(metrics.outerAdjacentRootOverlaps.length, 8);
  assert.ok(metrics.outerAdjacentRootOverlaps.every(item => item.intersectionPixels > 0));
  assert.ok(Math.min(...metrics.outerAdjacentRootOverlaps.map(item => item.ratio)) >= gate.minimumAdjacentRootOverlapRatio);
});

test('R1a.1 inner petal roots have actual adjacent mask intersections', () => {
  const metrics = measured().crown, gate = GEOMETRY_GATE_THRESHOLDS.crown;
  assert.equal(metrics.innerAdjacentRootOverlaps.length, 6);
  assert.ok(metrics.innerAdjacentRootOverlaps.every(item => item.intersectionPixels > 0));
  assert.ok(Math.min(...metrics.innerAdjacentRootOverlaps.map(item => item.ratio)) >= gate.minimumAdjacentRootOverlapRatio);
});

test('R1a.1 inner and outer rings intersect in actual masks', () => {
  const metrics = measured().crown, gate = GEOMETRY_GATE_THRESHOLDS.crown;
  assert.ok(metrics.innerOuterIntersectionPixels > 0);
  assert.ok(metrics.innerOuterIntersectionRatio >= gate.minimumInnerOuterIntersectionRatio, metrics.innerOuterIntersectionRatio);
  const edges = measured().structure.crownOverlapGraph.edges.filter(edge => edge.kind === 'inner-over-outer-seam');
  assert.ok(edges.length >= 8);
  assert.ok(edges.every(edge => edge.actualIntersectionPixels > 0 && edge.actualIntersectionRatio > 0));
});

test('R1a.1 crown core occupancy and radial gap gates pass', () => {
  const metrics = measured().crown, gate = GEOMETRY_GATE_THRESHOLDS.crown;
  assert.ok(metrics.crownCoreOccupancy >= gate.minimumCrownCoreOccupancy, metrics.crownCoreOccupancy);
  assert.ok(metrics.petalCoreOccupancy >= gate.minimumPetalCoreOccupancy, metrics.petalCoreOccupancy);
  assert.ok(metrics.radialGapRatio <= gate.maximumRadialGapRatio, metrics.radialGapRatio);
  assert.ok(metrics.rootZoneEmptyWedges <= gate.maximumRootZoneEmptyWedges, metrics.rootZoneEmptyWedges);
  assert.equal(metrics.repeatedEmptyWedgePattern, false);
});

test('R1a.1 center is partly occluded and partly visible by actual intersections', () => {
  const metrics = measured().crown, gate = GEOMETRY_GATE_THRESHOLDS.crown;
  assert.ok(metrics.centerOcclusionRatio >= gate.minimumCenterOcclusionRatio, metrics.centerOcclusionRatio);
  assert.ok(metrics.centerOcclusionRatio <= gate.maximumCenterOcclusionRatio, metrics.centerOcclusionRatio);
  assert.ok(metrics.centerVisibleRatio > .4 && metrics.centerVisibleRatio < .9, metrics.centerVisibleRatio);
  assert.ok(metrics.actualCenterOccluderIds.length >= 3 && metrics.actualCenterOccluderIds.length <= 5);
});

test('R1a.1 bowl projection is geometric, staggered, and bounded', () => {
  const metrics = measured().crown;
  assert.ok(metrics.innerMeanLength < metrics.outerMeanLength * .88);
  assert.ok(metrics.innerMeanElevation > metrics.outerMeanElevation + .20);
  assert.ok(metrics.staggerMinimum > .06, metrics.staggerMinimum);
  assert.ok(metrics.bowlDepthMin > .1 && metrics.bowlDepthMax <= .95);
});

test('R1a.1 near-circle crown envelope remains within declared deviation', () => {
  const metrics = measured().crown, gate = GEOMETRY_GATE_THRESHOLDS.crown;
  assert.ok(metrics.nearCircleEnvelopeDeviation <= gate.maximumNearCircleEnvelopeDeviation, metrics.nearCircleEnvelopeDeviation);
});

test('R1a.1 narrow-spoon widest points and rounded tips remain valid', () => {
  const petals = measured().structure.regions.filter(region => region.kind === 'petal-region');
  for (const petal of petals) {
    const spoon = evaluateNarrowSpoonGeometry(petal);
    assert.ok(spoon.widestPointT >= .55 && spoon.widestPointT <= .80, JSON.stringify(spoon));
    assert.ok(spoon.rootToPeakRatio <= .34, JSON.stringify(spoon));
    assert.ok(spoon.roundedTipCurvature >= .55, JSON.stringify(spoon));
    assert.equal(spoon.spearTip, false);
  }
});

test('R1a.1 generic single-ring radial-flower detector does not trigger', () => {
  assert.equal(measured().crown.genericRadialFlowerWarning, false);
  assert.equal(measured().structure.botanicalGeometry.genericSingleRingWarning, false);
  const generic = buildCompleteCrownBenchmarkStructure({ crownId: 'r1a1-generic', petalCount: 14, seed: 88, petalGeometryFamily: 'narrow-spoon', petalRhythm: 'single-layer' });
  assert.equal(generic.botanicalGeometry.genericSingleRingWarning, true);
});

test('R1a.1 each final leaf contour has 6–10 measurable lobes and valleys per side', () => {
  const gate = GEOMETRY_GATE_THRESHOLDS.leaf;
  for (const leaf of measured().leaves) {
    assert.ok(leaf.effectiveLobeCountLeft >= gate.minimumEffectiveLobesPerSide && leaf.effectiveLobeCountLeft <= gate.maximumEffectiveLobesPerSide, JSON.stringify(leaf));
    assert.ok(leaf.effectiveLobeCountRight >= gate.minimumEffectiveLobesPerSide && leaf.effectiveLobeCountRight <= gate.maximumEffectiveLobesPerSide, JSON.stringify(leaf));
    assert.ok(leaf.leftProminence >= gate.minimumProminence && leaf.rightProminence >= gate.minimumProminence, JSON.stringify(leaf));
    assert.ok(leaf.leftValleyDepth >= gate.minimumValleyDepth && leaf.rightValleyDepth >= gate.minimumValleyDepth, JSON.stringify(leaf));
  }
});

test('R1a.1 leaf lobes alternate, taper, and preserve a continuous central axis', () => {
  const gate = GEOMETRY_GATE_THRESHOLDS.leaf;
  for (const leaf of measured().leaves) {
    assert.ok(leaf.alternationOffset >= gate.minimumAlternationOffset, leaf.alternationOffset);
    assert.ok(leaf.lobeTaperRatio < gate.maximumTipTaperRatio, leaf.lobeTaperRatio);
    assert.equal(leaf.centralAxisContinuous, true);
    assert.ok(leaf.centralAxisMaximumStep <= gate.maximumAxisStep, leaf.centralAxisMaximumStep);
    assert.equal(leaf.pointedTipComplete, true);
  }
});

test('R1a.1 four final leaf masks are independent connected Regions', () => {
  const separation = measured().separation;
  assert.equal(separation.leafCount, 4);
  assert.equal(separation.uniqueRegionCount, 4);
  assert.equal(separation.allIndividualContoursConnected, true, JSON.stringify(separation));
  assert.ok(separation.pairIntersections.every(item => item.pixels === 0), JSON.stringify(separation));
  assert.equal(separation.separated, true);
});

test('R1a.1 generic ribbon-leaf detector is cleared and small-view lobes remain readable', () => {
  for (const leaf of measured().leaves) {
    assert.equal(leaf.genericRibbonSimilarity, false, JSON.stringify(leaf));
    assert.equal(leaf.smallViewReadable, true, JSON.stringify(leaf));
    assert.ok(leaf.smallViewReadableLeft >= 5 && leaf.smallViewReadableRight >= 5);
  }
});

test('R1a.1 Vector Masks contain the repaired final Region contours', () => {
  const { structure } = measured();
  const targetRegions = structure.regions.filter(region => region.kind === 'petal-region' || region.kind === 'flower-center-region' || region.kind === 'leaf-region');
  const masks = new Map(structure.masks.map(mask => [mask.regionId, mask]));
  for (const region of targetRegions) {
    assert.deepEqual(masks.get(region.regionId)?.path, region.path);
    const raster = rasterizeGeometryPath(region.path, 128, 181);
    assert.ok(raster.some(Boolean), region.regionId);
  }
});

test('R1a.1 botanical profile fields alter actual geometry, not metadata only', () => {
  const normal = measured().structure;
  const flatBowl = compile(12012, plan => { plan.crownPlan.bowlBias = .18; }).structure;
  assert.notEqual(normal.bowlDepthField.min, flatBowl.bowlDepthField.min);
  assert.notDeepEqual(normal.regions.find(region => region.kind === 'petal-region').path, flatBowl.regions.find(region => region.kind === 'petal-region').path);
  const smoothLeaves = compile(12012, plan => { for (const leaf of plan.leafPlans) leaf.leafEdgeMode = 'smooth-band'; }).structure;
  const smoothLeaf = smoothLeaves.regions.find(region => region.kind === 'leaf-region');
  assert.notDeepEqual(normal.regions.find(region => region.kind === 'leaf-region').path, smoothLeaf.path);
  assert.equal(smoothLeaf.leaf.pinnate, null);
  const abstractCenter = compile(12012, plan => { plan.crownPlan.centerMode = 'abstract-irregular'; }).structure.regions.find(region => region.kind === 'flower-center-region');
  assert.notEqual(abstractCenter.center.features.length, normal.regions.find(region => region.kind === 'flower-center-region').center.features.length);
});

test('R1a.1 same-seed geometry is exact and different-seed variation remains bounded', () => {
  const a = compile(12012).structure, b = compile(12012).structure, c = compile(12013).structure;
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  const aPetals = a.regions.filter(region => region.kind === 'petal-region'), cPetals = c.regions.filter(region => region.kind === 'petal-region');
  const shifts = aPetals.map((region, index) => Math.hypot(region.growthAxis.tip.x - cPetals[index].growthAxis.tip.x, region.growthAxis.tip.y - cPetals[index].growthAxis.tip.y));
  assert.ok(Math.max(...shifts) > .001 && Math.max(...shifts) < .10, Math.max(...shifts));
  assert.equal(mean(aPetals.map(region => region.petal.length)) - mean(cPetals.map(region => region.petal.length)) < .03, true);
});
