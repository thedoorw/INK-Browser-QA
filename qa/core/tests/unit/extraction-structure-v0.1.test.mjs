import test from 'node:test';import assert from 'node:assert/strict';
import { radialEvidence,sectorMask,reconstructRadial,createStructurePrototypeSet } from '../../../../product/source/src/extraction/structure.js';
import { executeExtraction } from '../../../../product/source/src/extraction/core.js';
import { imageTracerAdapter } from '../../../../product/source/src/extraction/adapters.js';
import tracer from '../../../../product/source/src/vendor/imagetracer-1.2.6.js';
import { expandRepeat,refreshRepeatInstances,repeatTransforms,vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';
import { defaultDocument,migrateDocument,inspectDocument } from '../../../../product/source/src/document/index.js';

function fourfoldFixture(){
 const raster={width:96,height:96,data:new Uint8ClampedArray(96*96*4).fill(255)},source={name:'fourfold',sha256:'b'.repeat(64)};
 for(let y=0;y<96;y++)for(let x=0;x<96;x++)if([[72,48],[48,72],[24,48],[48,24]].some(([cx,cy])=>Math.hypot(x-cx,y-cy)<7))raster.data.fill(0,(y*96+x)*4,(y*96+x)*4+3);
 return {raster,source};
}
async function extractedPrototype(){
 const {raster,source}=fourfoldFixture(),e=radialEvidence(raster,{center:{x:48,y:48},radius:40,counts:[3,4,5]});
 const mask=sectorMask(raster,source,e,{count:4}),r=await executeExtraction({raster,source,mask},imageTracerAdapter(tracer));
 return {e,r};
}

test('reusable fourfold fixture yields evidence, prototype and native Repeat with stable identities',async()=>{
 const {e,r}=await extractedPrototype();assert.equal(e.candidates[0].count,4);assert.ok(e.candidates[0].maskIoU>.95);
 const repeat=reconstructRadial(r.paths[0],e,{count:4});assert.equal(repeatTransforms(repeat).length,4);
 assert.deepEqual(repeat,reconstructRadial(r.paths[0],e,{count:4}));assert.match(vectorObjectToSVG(repeat,[]),/<path/);
 const doc=defaultDocument();doc.pages[0].layers[0].objects.push(repeat);const restored=migrateDocument(JSON.parse(JSON.stringify(doc)));assert.equal(inspectDocument(restored).passed,true);
});

test('multi-Path prototype set preserves editable child identity and deterministic linked expansion',async()=>{
 const {e,r}=await extractedPrototype(),first=r.paths[0],second=structuredClone(first);
 second.id=`${first.id}-variant`;second.name='Extracted path variant';second.matrix=[1,0,0,1,3,0];
 second.subpaths.forEach((subpath,i)=>{subpath.id=`${second.id}-s${i}`;subpath.anchors.forEach((anchor,j)=>anchor.id=`${subpath.id}-n${j}`);});
 const set=createStructurePrototypeSet([first,second],{id:'fourfold-prototype-set'});
 assert.equal(set.type,'group');assert.deepEqual(set.children.map(path=>path.id),[first.id,second.id]);
 assert.equal(set.metadata.prototypeSet.pathCount,2);assert.equal(set.metadata.prototypeSet.pathProvenanceExact,true);
 const repeat=reconstructRadial([first,second],e,{count:4,id:'fourfold-multi-repeat'});
 const rerun=reconstructRadial([first,second],e,{count:4,id:'fourfold-multi-repeat'});
 assert.deepEqual(repeat,rerun);assert.equal(repeat.source.type,'group');assert.equal(repeat.source.children.length,2);
 assert.deepEqual(repeat.source.children.map(path=>path.id),[first.id,second.id]);assert.equal(repeat.instances.length,4);
 const expandedA=expandRepeat(repeat),expandedB=expandRepeat(repeat);
 assert.deepEqual(expandedA,expandedB);assert.equal(expandedA.children.length,4);
 assert.ok(expandedA.children.every(group=>group.type==='group'&&group.children.length===2));
 const beforeInstanceIds=repeat.instances.map(instance=>instance.instanceId),beforeGeneratedIds=expandedA.children.map(group=>group.children.map(path=>path.id));
 const beforeX=expandedA.children[0].children[0].subpaths[0].anchors[0].x;
 repeat.source.children[0].subpaths[0].anchors[0].x+=2;refreshRepeatInstances(repeat);
 const expandedCorrected=expandRepeat(repeat);
 assert.deepEqual(repeat.instances.map(instance=>instance.instanceId),beforeInstanceIds);
 assert.deepEqual(expandedCorrected.children.map(group=>group.children.map(path=>path.id)),beforeGeneratedIds);
 assert.equal(expandedCorrected.children[0].children[0].subpaths[0].anchors[0].x,beforeX+2);
 const svg=vectorObjectToSVG(repeat,[]);assert.equal((svg.match(/data-ink-type=\"path\"/g)||[]).length,8);
 const doc=defaultDocument();doc.pages[0].layers[0].objects.push(repeat);const restored=migrateDocument(JSON.parse(JSON.stringify(doc)));
 assert.equal(inspectDocument(restored).passed,true);assert.equal(restored.pages[0].layers[0].objects[0].source.children.length,2);
 assert.throws(()=>createStructurePrototypeSet([first,first]),/PROTOTYPE_IDENTITY/);
});
