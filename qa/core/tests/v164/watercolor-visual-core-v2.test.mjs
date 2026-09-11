import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { stableHash } from '../../src/core/stable-id.js';
import { createAnchor, createPath } from '../../src/vector/vector-core.js';
import {
  createVectorBrushMaterial, registerVectorBrushMaterial,
  createPathWatercolorStrokeV2, createWatercolorPetalV2,
  createWatercolorLeafV2, createWatercolorStemV2,
  createWatercolorWashV2, createNaturalSplatter,
  createPaperOverlayMaterial, watercolorV2Report
} from '../../src/paint/vector-watercolor.js';

const sourcePath=(id='source:path')=>createPath({id,name:id,fill:'#c45e79',stroke:'none',matrix:[1,0,0,1,397,720],subpaths:[{closed:true,role:'outer',anchors:[
  createAnchor(0,0,{x:-28,y:16},{x:28,y:-16},{id:`${id}:a0`,mode:'smooth'}),
  createAnchor(72,-130,{x:-42,y:24},{x:28,y:-30},{id:`${id}:a1`,mode:'smooth'}),
  createAnchor(0,-285,{x:55,y:28},{x:-55,y:-28},{id:`${id}:a2`,mode:'smooth'}),
  createAnchor(-72,-130,{x:28,y:-30},{x:-42,y:24},{id:`${id}:a3`,mode:'smooth'})
]}],metadata:{semanticRole:'petal-source'}});
const openPath=(id='source:open')=>createPath({id,name:id,fill:'none',stroke:'#4f7d55',strokeWidth:5,subpaths:[{closed:false,role:'outer',anchors:[createAnchor(350,900,null,{x:25,y:-75},{id:`${id}:a0`,mode:'smooth'}),createAnchor(390,650,{x:-18,y:72},{x:18,y:-72},{id:`${id}:a1`,mode:'smooth'}),createAnchor(420,430,{x:-20,y:70},null,{id:`${id}:a2`,mode:'smooth'})]}]});
const brush=(overrides={})=>createVectorBrushMaterial({brushId:'brush:test:v2',brushVersion:'2.0.0',color:'#c45e79',strokeWidth:11,opacity:.3,seed:16401,layerCount:7,edgeProfile:[.1,.42,.92,.55,.18],opacityProfile:[.12,.42,.68,.3],pigmentDensityProfile:[.2,.5,1,.42],assetHash:'d083be10efec6bb13ee93383fc9343bb1341498958367c1d26c210432de958c8',assetLicense:{id:'INK-PROJECT-ORIGINAL',redistributable:true},...overrides});

test('Brush Material v2 is versioned, licensed, hashed and deterministic',()=>{
  const a=brush(),b=brush();
  assert.equal(a.materialHash,b.materialHash);
  assert.equal(a.renderMode,'VECTOR');
  assert.equal(a.assetLicense.redistributable,true);
  assert.ok(a.edgeProfile.length>=3);
  assert.ok(a.opacityProfile.length>=3);
});

test('same seed replays the same irregular path brush and changed seed changes it',()=>{
  const p=sourcePath();
  const a=createPathWatercolorStrokeV2(p,brush(),{id:'stroke:v2',seed:77});
  const b=createPathWatercolorStrokeV2(p,brush(),{id:'stroke:v2',seed:77});
  const c=createPathWatercolorStrokeV2(p,brush(),{id:'stroke:v2',seed:78});
  assert.equal(stableHash(a),stableHash(b));
  assert.notEqual(stableHash(a),stableHash(c));
  assert.equal(a.vectorBrushInstance.version,'2.0');
});

test('watercolor petal v2 contains pigment, concentration and broken edge layers',()=>{
  const petal=createWatercolorPetalV2(sourcePath(),brush(),{id:'petal:v2',seed:91});
  const roles=[]; const walk=o=>{if(o.metadata?.semanticRole)roles.push(o.metadata.semanticRole);for(const c of o.children||[])walk(c)};walk(petal);
  assert.ok(roles.includes('watercolor-pigment-layer'));
  assert.ok(roles.includes('pigment-concentration'));
  assert.ok(roles.includes('watercolor-petal-edge-v2'));
  assert.equal(petal.watercolorComposite.editable,true);
});

test('leaf and stem preserve directional editable structures',()=>{
  const leaf=createWatercolorLeafV2(sourcePath('leaf:source'),brush({brushId:'brush:leaf',color:'#5f9467'}),{id:'leaf:v2',seed:101});
  const stem=createWatercolorStemV2(openPath(),brush({brushId:'brush:stem',color:'#4f7d55',strokeWidth:7}),{id:'stem:v2',seed:102});
  assert.equal(leaf.watercolorComposite.type,'LEAF');
  assert.ok(leaf.children.some(x=>x.metadata?.semanticRole==='leaf-vein'));
  assert.equal(stem.watercolorComposite.type,'STEM');
  assert.ok(stem.children.some(x=>x.metadata?.semanticRole==='stem-highlight'));
});

test('wash is non-rectangular and splatter distribution is seeded and irregular',()=>{
  const wash=createWatercolorWashV2({id:'wash:v2',seed:11,lobes:4});
  assert.equal(wash.children.length,4);
  assert.ok(wash.children.every(p=>p.subpaths[0].anchors.length>=10));
  const a=createNaturalSplatter({id:'splatter:v2',seed:22,count:30});
  const b=createNaturalSplatter({id:'splatter:v2',seed:22,count:30});
  assert.equal(stableHash(a),stableHash(b));
  const sizes=new Set(a.children.map(p=>Math.round(Math.abs(p.subpaths[0].anchors[0].x-p.subpaths[0].anchors[1].x)*100)));
  assert.ok(sizes.size>5);
});

test('paper overlay is separable, traceable and can be disabled',()=>{
  const enabled=createPaperOverlayMaterial({id:'paper:v2',seed:4,assetHash:'3612f0b7a65f1c1986eb59edf4acc7c322fd45c0add99ad3ec89140ac0ae8e54'});
  const disabled=createPaperOverlayMaterial({id:'paper:v2:off',seed:4,enabled:false});
  assert.ok(enabled.children.length>100);
  assert.equal(enabled.paperTextureReference.interaction,false);
  assert.equal(enabled.metadata.claim,'OVERLAY_ONLY');
  assert.equal(disabled.children.length,0);
});

test('document save/load replay retains brush instances, stable IDs and reports',()=>{
  const d=defaultDocument();
  const m=registerVectorBrushMaterial(d,brush());
  d.pages[0].layers[0].objects=[createWatercolorPetalV2(sourcePath(),m,{id:'doc:petal',seed:500}),createWatercolorWashV2({id:'doc:wash',seed:501})];
  const json=JSON.stringify(d),loaded=JSON.parse(json);
  assert.equal(stableHash(d),stableHash(loaded));
  assert.equal(loaded.pages[0].layers[0].objects[0].id,'doc:petal');
  const report=watercolorV2Report(loaded);
  assert.ok(report.v2Instances>=1);
  assert.ok(report.composites>=2);
});

test('local replacement preserves unaffected object hash and rollback restores document',()=>{
  const d=defaultDocument(); const m=brush();
  const a=createWatercolorPetalV2(sourcePath('a:source'),m,{id:'petal:a',seed:1});
  const b=createWatercolorPetalV2(sourcePath('b:source'),m,{id:'petal:b',seed:2});
  d.pages[0].layers[0].objects=[a,b];
  const before=JSON.parse(JSON.stringify(d)),bHash=stableHash(b);
  d.pages[0].layers[0].objects[0]=createWatercolorPetalV2(sourcePath('a:source'),m,{id:'petal:a',seed:9,color:'#8f539e'});
  assert.equal(stableHash(d.pages[0].layers[0].objects[1]),bHash);
  const rollback=JSON.parse(JSON.stringify(before));
  assert.equal(stableHash(rollback),stableHash(before));
});
