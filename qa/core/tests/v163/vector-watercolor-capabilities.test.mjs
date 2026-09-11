import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { migrateDocument } from '../../src/document/migration.js';
import { stableHash } from '../../src/core/stable-id.js';
import { createAnchor, createPath, vectorObjectToSVG } from '../../src/vector/vector-core.js';
import { applyNonDestructiveDeformation, resetNonDestructiveDeformation } from '../../src/vector/deformation.js';
import { evaluateComposition, compareCompositionPreservation } from '../../src/composition/composition-constraints.js';
import { evaluateDeterministicExpression } from '../../src/program-import/expression-ir.js';
import { UniversalProgramImporter } from '../../src/program-import/importer.js';
import { RecipeEngine, installProgramImportSchema } from '../../src/recipe/recipe-engine.js';
import {
  createVectorBrushMaterial, registerVectorBrushMaterial, getVectorBrushMaterial,
  createPathWatercolorStroke, createWatercolorPetal, createWatercolorWash,
  createVectorSplatter, createPaperTextureReference, vectorWatercolorReport
} from '../../src/paint/vector-watercolor.js';

const petalPath = (id='petal') => createPath({ id, name:'Petal', fill:'#d76b86', stroke:'#7f3850', subpaths:[{ closed:true, role:'outer', anchors:[
  createAnchor(0,0,{x:-8,y:18},{x:8,y:-18},{id:`${id}:a0`,mode:'smooth'}),
  createAnchor(32,-82,{x:-20,y:18},{x:20,y:-18},{id:`${id}:a1`,mode:'smooth'}),
  createAnchor(0,-155,{x:26,y:20},{x:-26,y:-20},{id:`${id}:a2`,mode:'smooth'}),
  createAnchor(-32,-82,{x:20,y:-18},{x:-20,y:18},{id:`${id}:a3`,mode:'smooth'})
] }], matrix:[1,0,0,1,397,620], metadata:{semanticRole:'main-subject'} });

const stemPath = (id='stem') => createPath({ id, name:'Stem', fill:'none', stroke:'#4f7d55', strokeWidth:5, subpaths:[{ closed:false, role:'outer', anchors:[
  createAnchor(390,850,null,{x:35,y:-90},{id:`${id}:a0`,mode:'smooth'}),
  createAnchor(410,520,{x:-35,y:90},null,{id:`${id}:a1`,mode:'smooth'})
] }] });

const brush = overrides => createVectorBrushMaterial({ brushId:'brush:watercolor:video-derived', brushVersion:'1.0.0', brushType:'art-brush', sourceType:'procedural-vector', strokeWidth:10, opacity:.22, blendMode:'multiply', color:'#be5772', seed:42017, layerCount:7, jitter:1.8, widthVariation:.24, validationState:'VALIDATION REQUIRED', ...overrides });

test('Deterministic Math/Random IR is whitelisted, serializable and replayable', () => {
  const first=evaluateDeterministicExpression('sin(pi / 2) + cos(0) + indexedRandom(index, 0, 1)',{index:4},{seed:77,log:[]});
  const second=evaluateDeterministicExpression('Math.sin(Math.PI / 2) + Math.cos(0) + indexedRandom(index, 0, 1)',{index:4},{seed:77,log:[]});
  assert.equal(first.value,second.value);
  assert.deepEqual(first.log.map(item=>item.value),second.log.map(item=>item.value));
  const a=evaluateDeterministicExpression('random(10, 20)',{},{seed:99,log:[]});
  const b=evaluateDeterministicExpression('random(10, 20)',{},{seed:99,log:[]});
  assert.equal(a.value,b.value);
  assert.throws(()=>evaluateDeterministicExpression('eval(1)',{}),/FUNCTION_DENIED/);
});

test('Illustrator ellipse/rectangle operations compile to executable Recipe geometry', () => {
  const source=`var doc=app.activeDocument;\nvar a=doc.pathItems.ellipse(100,200,80,40);\nvar b=doc.pathItems.rectangle(20,30,90,50);`;
  const importer=new UniversalProgramImporter({inkVersion:'1.6.3-RC'});
  const report=importer.importAsset({name:'primitives.jsx',text:source,license:{spdx:'MIT'},provenance:{sourceUrl:'https://example.invalid/primitives.jsx',revision:'test'},safetyMode:'TRANSLATE_ONLY',compile:true});
  assert.equal(report.detection.sourceSoftware,'Adobe Illustrator');
  assert.equal(report.conversionReport.statusCounts.DIRECT>=2,true);
  const document=defaultDocument(),engine=new RecipeEngine(); installProgramImportSchema(engine); engine.execute(report.recipe,{document,inputs:[],parameters:{}});
  const paths=document.pages[0].layers[0].objects.filter(object=>object.type==='path');
  assert.equal(paths.length,2);
  assert.equal(paths[0].subpaths[0].anchors.length,4);
  assert.equal(paths[1].subpaths[0].anchors.length,4);
});

test('Perspective/Fold deformation is non-destructive, reversible and preserves Stable ID', () => {
  const path=petalPath('fold-petal'),before=structuredClone(path),beforeId=path.id;
  applyNonDestructiveDeformation(path,{foreshortening:.58,taper:.28,bend:18,foldAxis:.42,foldAngle:34,frontBack:'back'});
  assert.equal(path.id,beforeId); assert.notEqual(stableHash(path.subpaths),stableHash(before.subpaths));
  assert.equal(path.deformation.reversible,true); assert.equal(path.deformation.frontBack,'back');
  resetNonDestructiveDeformation(path);
  assert.equal(path.id,beforeId); assert.deepEqual(path.subpaths,before.subpaths);
});

test('Composition constraints measure safe margins, clipping and preserve unaffected layout', () => {
  const document=defaultDocument(),page=document.pages[0]; page.layers[0].objects.push(petalPath('main'));
  const secondary=petalPath('secondary');secondary.matrix=[.45,0,0,.45,620,820];secondary.metadata.semanticRole='secondary-subject';page.layers[0].objects.push(secondary);
  const before=structuredClone(document),pass=evaluateComposition(document,{safeMargin:20,minDominance:1.1});
  assert.equal(pass.status,'PASS');
  document.pages[0].layers[0].objects[0].fill='#cc3355';
  const preservation=compareCompositionPreservation(before,document,['main']);
  assert.equal(preservation.status,'PASS'); assert.ok(preservation.preservedObjectIds.includes('secondary'));
  secondary.matrix=[1,0,0,1,780,1100];
  assert.equal(evaluateComposition(document,{safeMargin:40}).status,'VIOLATION');
});

test('Vector Brush Material saves, loads, instances, overrides and survives migration', () => {
  const document=defaultDocument(),material=registerVectorBrushMaterial(document,brush());
  assert.equal(getVectorBrushMaterial(document,material.brushId).materialHash,material.materialHash);
  const reopened=migrateDocument(JSON.parse(JSON.stringify(document)));
  assert.equal(getVectorBrushMaterial(reopened,material.brushId).brushVersion,'1.0.0');
  const stroke=createPathWatercolorStroke(stemPath(),material,{id:'stroke-instance',color:'#537e5d',scale:.8,seed:11});
  assert.equal(stroke.vectorBrushInstance.instanceId,'stroke-instance');
  assert.equal(stroke.children.length,7); assert.equal(stroke.children[0].stroke,'#537e5d');
});

test('Path Watercolor Stroke produces deterministic editable SVG and different seed changes brush texture', () => {
  const source=stemPath(),material=brush({color:'#4f805d'});
  const a=createPathWatercolorStroke(source,material,{id:'wc-stem',seed:100}),b=createPathWatercolorStroke(source,material,{id:'wc-stem',seed:100}),c=createPathWatercolorStroke(source,material,{id:'wc-stem',seed:101});
  assert.equal(vectorObjectToSVG(a,[]),vectorObjectToSVG(b,[]));
  assert.notEqual(vectorObjectToSVG(a,[]),vectorObjectToSVG(c,[]));
  assert.deepEqual(a.vectorBrushInstance.editablePath.subpaths,source.subpaths);
  assert.match(vectorObjectToSVG(a,[]),/mix-blend-mode:multiply/);
});

test('Watercolor composites keep independent layers and explicitly mark hybrid paper dependency', () => {
  const document=defaultDocument(),material=registerVectorBrushMaterial(document,brush()),page=document.pages[0];
  page.layers[0].objects.push(createWatercolorWash({id:'wash'}),createWatercolorPetal(petalPath(),material,{id:'wc-petal'}),createVectorSplatter({id:'splatter',seed:3}),createPaperTextureReference({id:'paper',sourceAsset:'paper-grain-required.png'}));
  const report=vectorWatercolorReport(document);
  assert.equal(report.brushMaterials,1); assert.equal(report.hybridDependencies,1);
  assert.equal(page.layers[0].objects.find(item=>item.id==='paper').paperTextureReference.rendered,false);
});

test('Recipe executes vector brush, deformation, expression and composition without changing schema', () => {
  const document=defaultDocument(),path=petalPath('recipe-petal');document.pages[0].layers[0].objects.push(path);
  const engine=new RecipeEngine();engine.registerRoleSchema({id:'test.roles',roles:[{id:'target',required:true,multiple:false,aliases:['target']}]});
  const recipe={id:'test.v163.recipe',name:'V170',version:1,roleSchema:'test.roles',parameters:{seed:{type:'number',default:17}},steps:[
    {id:'register',op:'brush',params:{action:'register-material',material:brush()}},
    {id:'fold',op:'deformation',role:'target',params:{foreshortening:.72,bend:9,foldAxis:.4,foldAngle:22}},
    {id:'paint',op:'brush',role:'target',params:{action:'watercolor-petal',brushId:'brush:watercolor:video-derived',id:'recipe-wc-petal',seed:17}},
    {id:'math',op:'expression',params:{expression:'sin(pi/2)+random(0,1)',seed:17}},
    {id:'layout',op:'composition',params:{safeMargin:12}},
    {id:'checkpoint',op:'checkpoint',checkpoint:true,params:{}}
  ]};
  const report=engine.execute(recipe,{document,inputs:[{...path,role:'target'}]});
  assert.equal(report.status,'completed'); assert.equal(document.vectorBrushLibrary.materials.length,1);
  assert.ok(document.pages[0].layers[0].objects.some(item=>item.id==='recipe-wc-petal'));
  assert.ok(report.expressionLog.length>=1); assert.equal(document.formatVersion,4);
});
