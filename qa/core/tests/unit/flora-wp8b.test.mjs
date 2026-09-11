import test from 'node:test';
import assert from 'node:assert/strict';
import { Canvas2DNaturalMediaRenderer } from '../../src/render/canvas2d/natural-media-canvas2d.js';
import {
  REFINED_PAINTING_PARAMETERS_VERSION, defaultRefinedPaintingParameters,
  validateRefinedPaintingParameters
} from '../../src/flora/recipe/refined-painting-parameters.js';
import { createWP6App, createWP6Plan, addManualStroke, stableObjectHash } from '../helpers/flora-wp6-fixture.mjs';

const HERO_ID='wp6-a4-hero';
const objectsFor=(app)=>{const mapping=app.flora.completeHero.mapping(HERO_ID);return {mapping,objects:mapping.strokeIds.map(id=>app.flora.adapter.findObject(id)?.object).filter(Boolean)};};
const saturation=(hex)=>{const n=parseInt(hex.slice(1),16),rgb=[(n>>16)&255,(n>>8)&255,n&255],mx=Math.max(...rgb),mn=Math.min(...rgb);return mx?((mx-mn)/mx):0;};

test('WP8B frequency-layer separation and renderer switches are explicit',()=>{
  const renderer=new Canvas2DNaturalMediaRenderer();
  assert.equal(renderer.surfaceRevision,'WP8B-1');
  assert.deepEqual(renderer.setFrequencyVisibility({low:true,mid:false,high:false}),{low:true,mid:false,high:false});
  assert.deepEqual(renderer.setFrequencyVisibility({low:false,mid:true,high:false}),{low:false,mid:true,high:false});
  assert.deepEqual(renderer.setFrequencyVisibility({low:false,mid:false,high:true}),{low:false,mid:false,high:true});
  assert.deepEqual(renderer.diagnostics().frequencyVisibility,{low:false,mid:false,high:true});
});

test('WP8B pigment-load schema validates and WP8A refinement remains compatible',()=>{
  const current=defaultRefinedPaintingParameters('crown');
  assert.equal(current.schemaVersion,REFINED_PAINTING_PARAMETERS_VERSION);
  assert.equal(validateRefinedPaintingParameters(current).ok,true);
  const old=structuredClone(current);old.schemaVersion='0.2';delete old.frequencyLayers;delete old.pigmentMass;
  assert.equal(validateRefinedPaintingParameters(old).ok,true);
  const bad=structuredClone(current);bad.pigmentMass.opacityFloor=.8;
  const result=validateRefinedPaintingParameters(bad);
  assert.equal(result.ok,false);assert.ok(result.errors.some(error=>error.path.includes('opacityFloor')));
});

test('WP8B whole-page compile emits bounded low and mid frequency pigment strokes',()=>{
  const app=createWP6App();const result=app.flora.completeHero.execute(createWP6Plan());assert.equal(result.ok,true,JSON.stringify(result));
  const {objects}=objectsFor(app);assert.ok(objects.length>250);
  assert.ok(objects.every(o=>o.floraPaint?.painterlyMassVersion==='WP8B-1'));
  assert.deepEqual(new Set(objects.map(o=>o.floraPaint.frequencyLayer)),new Set(['low','mid']));
  assert.ok(objects.every(o=>Number.isFinite(o.opacity)&&o.opacity>=0&&o.opacity<=o.floraPaint.refinement.pigmentMass.opacityCeiling+1e-9));
  const low=objects.filter(o=>o.floraPaint.frequencyLayer==='low');const mid=objects.filter(o=>o.floraPaint.frequencyLayer==='mid');
  assert.ok(low.length>mid.length);assert.ok(mid.length>50);
});

test('WP8B deposit accumulation gives Base Wash more mass than directional accents without black nodes',()=>{
  const app=createWP6App();assert.equal(app.flora.completeHero.execute(createWP6Plan()).ok,true);
  const {objects}=objectsFor(app);const mean=a=>a.reduce((s,o)=>s+o.opacity,0)/a.length;
  const wash=objects.filter(o=>o.floraPaint.operation==='Base Wash'&&o.floraPaint.component!=='background');
  const brush=objects.filter(o=>o.floraPaint.operation==='Directional Brushwork'&&o.floraPaint.component!=='background');
  assert.ok(mean(wash)>mean(brush));assert.ok(Math.max(...wash.map(o=>o.opacity))<=.64);
  assert.ok(objects.every(o=>o.color!=='#000000'));
});

test('WP8B saturation and value retention preserve chromatic shadows and visible lights',()=>{
  const app=createWP6App();assert.equal(app.flora.completeHero.execute(createWP6Plan()).ok,true);
  const {objects}=objectsFor(app);const crown=objects.filter(o=>o.floraPaint.component==='crown');
  assert.ok(crown.filter(o=>['Root Shadow','Fold Shadow','Overlap Shadow'].includes(o.floraPaint.operation)).every(o=>saturation(o.color)>.18));
  const lights=crown.filter(o=>['Central Light','Edge Light'].includes(o.floraPaint.operation));
  assert.ok(lights.some(o=>o.opacity>.02));
});

test('WP8B glaze color depth is source-over for subject and remains bounded',()=>{
  const app=createWP6App();const compiled=app.flora.completeHero.compile(createWP6Plan());assert.equal(compiled.ok,true);
  const subject=compiled.recipes.filter(r=>r.operation==='Transparent Glaze'&&r.metadata.component!=='background');
  assert.ok(subject.length>5);assert.ok(subject.every(r=>r.blendMode==='source-over'));
  assert.ok(subject.every(r=>r.refinement.pigmentMass.glazeAccumulation>.6));
  const background=compiled.recipes.filter(r=>r.operation==='Transparent Glaze'&&r.metadata.component==='background');
  assert.ok(background.every(r=>r.blendMode==='soft-light'));
});

test('WP8B mid-scale stroke clustering is deterministic, sparse, and curvature-following',()=>{
  const appA=createWP6App(),appB=createWP6App();assert.equal(appA.flora.completeHero.execute(createWP6Plan(606)).ok,true);assert.equal(appB.flora.completeHero.execute(createWP6Plan(606)).ok,true);
  const a=objectsFor(appA).objects.filter(o=>o.floraPaint.operation==='Directional Brushwork');
  const b=objectsFor(appB).objects.filter(o=>o.floraPaint.operation==='Directional Brushwork');
  assert.deepEqual(a.map(o=>({id:o.id,points:o.points,color:o.color,opacity:o.opacity})),b.map(o=>({id:o.id,points:o.points,color:o.color,opacity:o.opacity})));
  assert.ok(a.length<80&&a.length>20);assert.ok(a.every(o=>o.floraPaint.frequencyLayer==='mid'));
  assert.ok(a.some(o=>o.points.length>20&&new Set(o.points.map(p=>Math.round(p.x*10))).size>3));
});

test('WP8B edge hierarchy includes focal clear edges, lost edges, and silhouette protection',()=>{
  const app=createWP6App();const compiled=app.flora.completeHero.compile(createWP6Plan());assert.equal(compiled.ok,true);
  const edge=compiled.recipes.filter(r=>r.operation==='Edge Light');const lost=compiled.recipes.filter(r=>r.operation==='Boundary Dissolve');
  assert.ok(edge.length>0&&lost.length>0);
  assert.ok(edge.every(r=>r.refinement.localEdgeHardness.edge>=.3));
  assert.ok(lost.every(r=>r.refinement.localEdgeHardness.edge<=.3));
  assert.ok(compiled.recipes.every(r=>r.refinement.silhouetteProtection>=.9));
});

test('WP8B same seed replays exactly while different seed changes mass/stroke output',()=>{
  const app=createWP6App();
  const first=app.flora.completeHero.compile(createWP6Plan(606));
  const second=app.flora.completeHero.compile(createWP6Plan(606));
  const changed=app.flora.completeHero.compile(createWP6Plan(607));
  assert.equal(first.ok,true);assert.equal(second.ok,true);assert.equal(changed.ok,true);
  assert.equal(first.compileHash,second.compileHash);
  assert.notEqual(first.compileHash,changed.compileHash);
  assert.deepEqual(first.recipes.map(r=>({seed:r.seed,refinement:r.refinement,opacity:r.opacity,widthRange:r.widthRange})),second.recipes.map(r=>({seed:r.seed,refinement:r.refinement,opacity:r.opacity,widthRange:r.widthRange})));
});

test('WP8B local recompile preserves non-target regions and manual stroke',()=>{
  const app=createWP6App();const manual=addManualStroke(app,'manual-wp8b');assert.equal(app.flora.completeHero.execute(createWP6Plan()).ok,true);
  const mapping=app.flora.completeHero.mapping(HERO_ID),petal=app.flora.adapter.hero().regions.find(r=>r.kind==='petal-region').regionId;
  const target=new Set((mapping.regionRecipeIds[petal]||[]).flatMap(id=>mapping.recipeToStrokeIds[id]||[]));const non=mapping.strokeIds.filter(id=>!target.has(id));const before=stableObjectHash(app,non);
  const local=app.flora.completeHero.recompilePetal(HERO_ID,petal,{operation:'Directional Brushwork',patch:{opacity:[.04,.11]}});
  assert.equal(local.ok,true,JSON.stringify(local));assert.equal(stableObjectHash(app,non),before);assert.ok(app.flora.adapter.objectExists(manual));
});

test('WP8B atomic rollback, Undo Redo, and .ink roundtrip retain deterministic state',()=>{
  const app=createWP6App();addManualStroke(app,'manual-wp8b-reliability');const result=app.flora.completeHero.execute(createWP6Plan());assert.equal(result.ok,true);
  const doc=app.flora.documentHash(),replay=app.flora.replayHash(),hero=app.flora.completeHero.replayHash(HERO_ID);assert.equal(app.history.undo(),true);assert.equal(app.history.redo(),true);assert.equal(app.flora.documentHash(),doc);assert.equal(app.flora.replayHash(),replay);
  const serialized=app.flora.serializeDocument(),reload=createWP6App();reload.flora.reloadDocument(serialized);assert.equal(reload.flora.replayHash(),replay);assert.equal(reload.flora.completeHero.replayHash(HERO_ID),hero);
  const rb=createWP6App(),before={doc:rb.flora.documentHash(),replay:rb.flora.replayHash(),history:rb.history.undoStack.length};const original=rb.flora.adapter.execute.bind(rb.flora.adapter);let count=0;
  rb.flora.adapter.execute=(action,options)=>{if(action.type==='paintRegion'&&++count===17)throw new Error('WP8B injected failure');return original(action,options);};const failed=rb.flora.completeHero.execute(createWP6Plan());rb.flora.adapter.execute=original;
  assert.equal(failed.ok,false);assert.equal(rb.flora.documentHash(),before.doc);assert.equal(rb.flora.replayHash(),before.replay);assert.equal(rb.history.undoStack.length,before.history);
});
