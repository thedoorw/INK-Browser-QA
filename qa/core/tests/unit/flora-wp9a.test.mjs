import test from 'node:test';
import assert from 'node:assert/strict';
import { createWP6App, addManualStroke, stableObjectHash } from '../helpers/flora-wp6-fixture.mjs';
import {
  FLR012_EXCEL_IDENTITY,
  FLR012_REFERENCE_MANIFEST,
  verifyFLR012ReferenceMapping,
  createFLR012HeroProfile,
  createFLR012HeroPaintingPlan
} from '../../src/flora/species/flr012-adonis.js';
import { resolveReferenceMapping } from '../../src/flora/reference/reference-mapping.js';

const HERO_ID='flr012-adonis-candidate-a';

function compile(seed=12012){
  const app=createWP6App();
  const result=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(seed));
  assert.equal(result.ok,true,JSON.stringify(result));
  return {app,result};
}

test('WP9A reference mapping verifies 1-A slot 12 D012 and rejects filename-tail inference',()=>{
  const verified=verifyFLR012ReferenceMapping({requestedFiles:['1-A.png']});
  assert.equal(verified.ok,true,JSON.stringify(verified));
  assert.equal(verified.status,'VERIFIED');
  assert.equal(verified.monthSheet,'1-A.png');
  assert.equal(verified.month,1);
  assert.equal(verified.day,12);
  assert.equal(verified.slot,12);
  assert.equal(verified.dCode,'D012');
  assert.equal(verified.matchCount,6);
  assert.equal(verified.governance.dateIsNotMonth,true);

  const wrong=verifyFLR012ReferenceMapping({requestedFiles:['12-A.png','12-B.png']});
  assert.equal(wrong.ok,false);
  assert.equal(wrong.status,'REFERENCE_MAPPING_CONFLICT');
  assert.ok(wrong.errors.some(error=>error.code==='FORBIDDEN_FILENAME_INFERENCE'));

  const wrongMonth=resolveReferenceMapping({...FLR012_EXCEL_IDENTITY,month:12},FLR012_REFERENCE_MANIFEST,{requestedFiles:['1-A.png']});
  assert.equal(wrongMonth.ok,false);
  assert.equal(wrongMonth.status,'REFERENCE_MAPPING_CONFLICT');
});

test('WP9A FLR-012 profile and plan serialize with fixed Single/Four Hero skeleton',()=>{
  const profile=createFLR012HeroProfile();
  assert.equal(profile.status,'COMPATIBLE');
  assert.equal(profile.botanicalIdentity.profileId,'FLR-012');
  assert.deepEqual(profile.morphology.petalCountNatural,[10,20]);
  assert.equal(profile.morphology.heroPetalCount,14);
  assert.equal(profile.morphology.petalShape,'narrow-spoon');
  assert.deepEqual(profile.fpl,['MultiPetalCup','FiligreeLeaf','BasalClump']);
  assert.equal(profile.heroSkeleton.crownMode,'Single');
  assert.equal(profile.heroSkeleton.leafCount,'Four');
  assert.equal(profile.heroSkeleton.leafWidth,'Narrow');
  assert.equal(profile.heroSkeleton.leafTip,'Pointed');
  assert.equal(profile.heroSkeleton.leafCurve,'Strong Wave');
  assert.deepEqual(JSON.parse(JSON.stringify(profile)),profile);

  const plan=createFLR012HeroPaintingPlan();
  assert.equal(plan.composition.page,'A4 portrait');
  assert.equal(plan.composition.crownMode,'Single');
  assert.equal(plan.composition.leafCount,'Four');
  assert.equal(plan.composition.crownTop,.02);
  assert.equal(plan.composition.crownHeight,.50);
  assert.equal(plan.composition.stemAxisX,.5);
  assert.equal(plan.composition.stemWidthRatio,1/12);
  assert.equal(plan.crownPlan.petalCount,14);
  assert.equal(plan.crownPlan.metadata.petalGeometryFamily,'narrow-spoon');
  assert.equal(plan.leafPlans.length,4);
  assert.equal(new Set(plan.leafPlans.map(item=>item.metadata.slot)).size,4);
  assert.deepEqual(JSON.parse(JSON.stringify(plan)),plan);
});

test('WP9A compiler creates 14 independent spoon-petal regions, dense center contract, four separated leaves, and correct proportions',()=>{
  const {result}=compile();
  const regions=result.structure.regions;
  const petals=regions.filter(region=>region.kind==='petal-region');
  const leaves=regions.filter(region=>region.kind==='leaf-region');
  const center=regions.find(region=>region.kind==='flower-center-region');
  const stem=regions.find(region=>region.kind==='stem-region');
  assert.equal(petals.length,14);
  assert.equal(new Set(petals.map(region=>region.regionId)).size,14);
  assert.ok(petals.every(region=>region.growthAxis && region.mask && Array.isArray(region.path)));
  assert.ok(petals.every(region=>region.petal && region.petal.length>region.petal.width));
  assert.ok(center?.mask && Array.isArray(center.path));
  assert.ok(stem?.mask && Array.isArray(stem.path));
  assert.equal(leaves.length,4);
  assert.equal(new Set(leaves.map(region=>region.regionId)).size,4);
  assert.ok(leaves.every(region=>region.mask && region.growthAxis && region.leaf?.filigreeEdge===true));
  assert.equal(result.structure.profile.crownTop,.02);
  assert.equal(result.structure.profile.crownHeight,.50);
  assert.equal(result.structure.profile.leafCount,'Four');
  assert.equal(result.checks.failed.length,0);
  assert.ok(result.recipes.some(recipe=>recipe.metadata.component==='flower-center'));
});

test('WP9A same seed compiles exactly, different seed varies, and wrong region/brush are rejected without mutation',()=>{
  const app=createWP6App();
  const a=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  const b=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12012));
  const c=app.flora.completeHero.compile(createFLR012HeroPaintingPlan(12013));
  assert.equal(a.ok,true);assert.equal(b.ok,true);assert.equal(c.ok,true);
  assert.equal(a.compileHash,b.compileHash);
  assert.notEqual(a.compileHash,c.compileHash);
  const before={doc:app.flora.documentHash(),history:app.history.undoStack.length};
  const badRegion=structuredClone(createFLR012HeroPaintingPlan());badRegion.leafPlans[0].regionId='missing-region';
  assert.equal(app.flora.completeHero.execute(badRegion).ok,false);
  const badBrush=structuredClone(createFLR012HeroPaintingPlan());badBrush.stemPlan.brushPresets.wash='missing-brush';
  assert.equal(app.flora.completeHero.execute(badBrush).ok,false);
  assert.equal(app.flora.documentHash(),before.doc);
  assert.equal(app.history.undoStack.length,before.history);
});

test('WP9A local recompile preserves non-target strokes and manual input',()=>{
  const app=createWP6App();
  const manual=addManualStroke(app,'manual-wp9a');
  const executed=app.flora.completeHero.execute(createFLR012HeroPaintingPlan());
  assert.equal(executed.ok,true,JSON.stringify(executed));
  const mapping=app.flora.completeHero.mapping(HERO_ID);
  const petal=app.flora.adapter.hero().regions.find(region=>region.kind==='petal-region').regionId;
  const target=new Set((mapping.regionRecipeIds[petal]||[]).flatMap(id=>mapping.recipeToStrokeIds[id]||[]));
  const nonTarget=mapping.strokeIds.filter(id=>!target.has(id));
  const before=stableObjectHash(app,nonTarget);
  const local=app.flora.completeHero.recompilePetal(HERO_ID,petal,{operation:'Directional Brushwork',patch:{opacity:[.05,.12]}});
  assert.equal(local.ok,true,JSON.stringify(local));
  assert.equal(local.nonTargetUnchanged,true);
  assert.equal(stableObjectHash(app,nonTarget),before);
  assert.ok(app.flora.adapter.objectExists(manual));
});

test('WP9A atomic rollback, Undo Redo, and .ink roundtrip preserve deterministic state',()=>{
  const app=createWP6App();
  const manual=addManualStroke(app,'manual-wp9a-reliability');
  const result=app.flora.completeHero.execute(createFLR012HeroPaintingPlan());
  assert.equal(result.ok,true,JSON.stringify(result));
  const doc=app.flora.documentHash(),replay=app.flora.replayHash(),hero=app.flora.completeHero.replayHash(HERO_ID);
  assert.equal(app.history.undo(),true);
  assert.equal(app.history.redo(),true);
  assert.equal(app.flora.documentHash(),doc);
  assert.equal(app.flora.replayHash(),replay);
  assert.ok(app.flora.adapter.objectExists(manual));
  const serialized=app.flora.serializeDocument();
  const reload=createWP6App();reload.flora.reloadDocument(serialized);
  assert.equal(reload.flora.replayHash(),replay);
  assert.equal(reload.flora.completeHero.replayHash(HERO_ID),hero);

  const rb=createWP6App();
  const before={doc:rb.flora.documentHash(),replay:rb.flora.replayHash(),history:rb.history.undoStack.length};
  const original=rb.flora.adapter.execute.bind(rb.flora.adapter);let count=0;
  rb.flora.adapter.execute=(action,options)=>{if(action.type==='paintRegion'&&++count===17)throw new Error('WP9A injected failure');return original(action,options);};
  const failed=rb.flora.completeHero.execute(createFLR012HeroPaintingPlan());
  rb.flora.adapter.execute=original;
  assert.equal(failed.ok,false);
  assert.equal(rb.flora.documentHash(),before.doc);
  assert.equal(rb.flora.replayHash(),before.replay);
  assert.equal(rb.history.undoStack.length,before.history);
});
