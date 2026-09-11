import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App, createWP6Plan } from '../helpers/flora-wp6-fixture.mjs';
import { createFLR012HeroPaintingPlan } from '../../src/flora/species/flr012-adonis.js';
import {
  buildCompleteCrownBenchmarkStructure,
  evaluateNarrowSpoonGeometry,
  evaluateCrownBotanicalGeometry
} from '../../src/flora/painting/complete-crown-benchmark.js';
import { buildCompleteA4HeroStructure, evaluateFiligreePinnateLeafGeometry } from '../../src/flora/hero/complete-hero-structure.js';

const angleDistance = (a,b) => { let d=Math.abs(a-b)%(Math.PI*2); return d>Math.PI?Math.PI*2-d:d; };
const compile = (seed=12012) => {
  const app=createWP6App();
  const result=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(seed));
  assert.equal(result.ok,true,JSON.stringify(result.errors));
  return result;
};

test('R1a MultiPetalCup creates 8 outer and 6 inner petals',()=>{
  const {structure}=compile();
  const petals=structure.regions.filter(r=>r.kind==='petal-region');
  assert.equal(petals.length,14);
  assert.equal(petals.filter(r=>r.petal.ring==='outer').length,8);
  assert.equal(petals.filter(r=>r.petal.ring==='inner').length,6);
  assert.deepEqual(structure.ringStructure.counts,{outer:8,inner:6,single:0});
});

test('R1a inner and outer ring angles are staggered',()=>{
  const {structure}=compile();
  const {outer,inner}=structure.ringStructure.angles;
  assert.equal(outer.length,8); assert.equal(inner.length,6);
  const nearest=inner.map(a=>Math.min(...outer.map(b=>angleDistance(a,b))));
  assert.ok(nearest.every(value=>value>.06),JSON.stringify(nearest));
  assert.ok(new Set(nearest.map(value=>value.toFixed(4))).size>3);
});

test('R1a inner petals are shorter and more elevated than outer petals',()=>{
  const petals=compile().structure.regions.filter(r=>r.kind==='petal-region');
  const outer=petals.filter(r=>r.petal.ring==='outer'), inner=petals.filter(r=>r.petal.ring==='inner');
  const mean=items=>items.reduce((sum,item)=>sum+item,0)/items.length;
  assert.ok(mean(inner.map(r=>r.petal.length)) < mean(outer.map(r=>r.petal.length))*.88);
  assert.ok(mean(inner.map(r=>r.petal.elevation)) > mean(outer.map(r=>r.petal.elevation))+.20);
});

test('R1a ring topology contains valid inner-over-outer overlaps',()=>{
  const {structure}=compile();
  const petals=structure.regions.filter(r=>r.kind==='petal-region');
  const byId=new Map(petals.map(r=>[r.regionId,r]));
  const edges=structure.crownOverlapGraph.edges.filter(e=>e.kind==='inner-over-outer-seam');
  assert.ok(edges.length>=8,`edges=${edges.length}`);
  for(const edge of edges){
    assert.equal(byId.get(edge.backRegionId)?.petal.ring,'outer');
    assert.equal(byId.get(edge.frontRegionId)?.petal.ring,'inner');
    assert.ok(byId.get(edge.frontRegionId).z>byId.get(edge.backRegionId).z);
  }
});

test('R1a bowl depth is nonzero, bounded, and ring-specific',()=>{
  const field=compile().structure.bowlDepthField;
  assert.equal(field.enabled,true);
  assert.ok(field.min>.1 && field.max<=.95);
  assert.ok(field.rings.inner>field.rings.outer+.25);
});

test('R1a narrow-spoon widest point lies at 0.55–0.80 with narrow root',()=>{
  const petals=compile().structure.regions.filter(r=>r.kind==='petal-region');
  for(const petal of petals){
    const result=evaluateNarrowSpoonGeometry(petal);
    assert.ok(result.widestPointT>=.55 && result.widestPointT<=.80,JSON.stringify(result));
    assert.ok(result.rootToPeakRatio<.34,JSON.stringify(result));
  }
});

test('R1a generated spoon tips pass rounded-tip threshold',()=>{
  const petals=compile().structure.regions.filter(r=>r.kind==='petal-region');
  for(const petal of petals){
    const result=evaluateNarrowSpoonGeometry(petal);
    assert.ok(result.roundedTipCurvature>=.55,JSON.stringify(result));
    assert.equal(result.spearTip,false,JSON.stringify(result));
  }
});

test('R1a spear-tip geometry is rejected or warned',()=>{
  const synthetic={
    crossSections:[{t:0,width:.01},{t:.65,width:.10},{t:.93,width:.06}],
    spoonMetrics:{tipRoundness:.18,roundedTipCurvature:.22}
  };
  const result=evaluateNarrowSpoonGeometry(synthetic);
  assert.equal(result.spearTip,true);
  assert.ok(result.warnings.includes('SPEAR_TIP_WARNING'));
});

test('R1a dense center contour is measurably irregular and noncircular',()=>{
  const center=compile().structure.regions.find(r=>r.kind==='flower-center-region');
  assert.equal(center.center.mode,'dense-irregular-gold');
  assert.ok(center.center.contourMetrics.radialCv>.04);
  assert.ok(center.center.contourMetrics.circularity<.97);
  assert.ok(center.center.massField.core<center.center.massField.mid);
});

test('R1a center is partly occluded by 3–5 inner petals',()=>{
  const {structure}=compile();
  const center=structure.regions.find(r=>r.kind==='flower-center-region');
  const byId=new Map(structure.regions.map(r=>[r.regionId,r]));
  assert.ok(center.overlaps.length>=3 && center.overlaps.length<=5);
  assert.ok(center.overlaps.every(edge=>byId.get(edge.frontRegionId)?.petal.ring==='inner'));
});

test('R1a center feature spacing is nonuniform without point grid',()=>{
  const center=compile().structure.regions.find(r=>r.kind==='flower-center-region');
  assert.ok(center.center.features.length>=36);
  assert.ok(center.center.featureSpacingCv>.20,center.center.featureSpacingCv);
  const xs=new Set(center.center.features.map(f=>f.x.toFixed(4)));
  const ys=new Set(center.center.features.map(f=>f.y.toFixed(4)));
  assert.ok(xs.size>center.center.features.length*.75);
  assert.ok(ys.size>center.center.features.length*.75);
});

test('R1a creates exactly four independent filigree leaf regions and masks',()=>{
  const {structure}=compile();
  const leaves=structure.regions.filter(r=>r.kind==='leaf-region');
  assert.equal(leaves.length,4);
  assert.equal(new Set(leaves.map(r=>r.regionId)).size,4);
  assert.ok(leaves.every(leaf=>structure.masks.some(mask=>mask.regionId===leaf.regionId)));
  assert.ok(leaves.every(leaf=>leaf.leaf.edgeMode==='filigree-pinnate-impression'));
});

test('R1a leaf central axes remain continuous',()=>{
  const leaves=compile().structure.regions.filter(r=>r.kind==='leaf-region');
  for(const leaf of leaves){
    const result=evaluateFiligreePinnateLeafGeometry(leaf);
    assert.ok(result.axisPointCount>=60);
    assert.ok(!result.warnings.includes('LEAF_AXIS_DISCONTINUITY'),JSON.stringify(result));
  }
});

test('R1a lateral lobes alternate and count 6–10 per side',()=>{
  const leaves=compile().structure.regions.filter(r=>r.kind==='leaf-region');
  for(const leaf of leaves){
    const p=leaf.leaf.pinnate;
    assert.ok(p.lobeCountPerSide>=6 && p.lobeCountPerSide<=10);
    assert.equal(p.leftLobes.length,p.lobeCountPerSide);
    assert.equal(p.rightLobes.length,p.lobeCountPerSide);
    assert.equal(p.alternating,true);
    const offsets=p.leftLobes.map((l,i)=>Math.abs(l.center-p.rightLobes[i].center));
    assert.ok(offsets.some(value=>value>.02));
  }
});

test('R1a lobe sizes taper toward leaf tip',()=>{
  const leaves=compile().structure.regions.filter(r=>r.kind==='leaf-region');
  for(const leaf of leaves){
    const p=leaf.leaf.pinnate;
    assert.ok(p.taperRatio<.86,p.taperRatio);
    assert.ok(p.leftLobes.at(-1).amplitude<p.leftLobes[0].amplitude);
  }
});

test('R1a generic ribbon-leaf warning activates on old smooth-band leaf',()=>{
  const plan=createWP6Plan(606);
  const structure=buildCompleteA4HeroStructure(plan);
  const generic=structure.regions.find(r=>r.kind==='leaf-region');
  const result=evaluateFiligreePinnateLeafGeometry(generic);
  assert.equal(result.genericRibbonWarning,true);
});

test('R1a generic single-ring radial-flower warning activates',()=>{
  const generic=buildCompleteCrownBenchmarkStructure({crownId:'generic-radial',petalCount:14,seed:77,petalGeometryFamily:'narrow-spoon',petalRhythm:'single-layer'});
  const result=evaluateCrownBotanicalGeometry(generic);
  assert.equal(result.genericSingleRingWarning,true);
});

test('R1a metadata controls actual geometry, masks, topology, and recipes',()=>{
  const {structure,recipes}=compile();
  assert.equal(structure.ringStructure.mode,'MultiPetalCup');
  assert.equal(structure.bowlDepthField.bias,.76);
  assert.ok(structure.regions.filter(r=>r.kind==='petal-region').every(r=>r.petal.geometryFamily==='narrow-spoon'));
  assert.equal(structure.regions.find(r=>r.kind==='flower-center-region').center.mode,'dense-irregular-gold');
  assert.ok(structure.regions.filter(r=>r.kind==='leaf-region').every(r=>r.leaf.edgeMode==='filigree-pinnate-impression'));
  assert.ok(recipes.filter(r=>r.metadata?.ring==='inner').some(r=>r.metadata.bowlDepth>.6));
  assert.ok(recipes.filter(r=>r.metadata?.component==='flower-center').some(r=>r.density>=20));
  assert.ok(recipes.filter(r=>String(r.metadata?.component).startsWith('leaf-')).some(r=>r.widthRange[1]<=28));
});

test('R1a deterministic same-seed geometry and bounded different-seed variation',()=>{
  const a=compile(12012).structure,b=compile(12012).structure,c=compile(12013).structure;
  assert.deepEqual(a,b);
  assert.notDeepEqual(a,c);
  const pa=a.regions.filter(r=>r.kind==='petal-region'), pc=c.regions.filter(r=>r.kind==='petal-region');
  assert.equal(pa.length,pc.length);
  const maxTipShift=Math.max(...pa.map((p,i)=>Math.hypot(p.growthAxis.tip.x-pc[i].growthAxis.tip.x,p.growthAxis.tip.y-pc[i].growthAxis.tip.y)));
  assert.ok(maxTipShift>.001 && maxTipShift<.10,maxTipShift);
  assert.deepEqual(a.ringStructure.counts,c.ringStructure.counts);
});
