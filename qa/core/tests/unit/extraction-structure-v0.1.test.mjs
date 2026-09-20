import test from 'node:test';import assert from 'node:assert/strict';
import { radialEvidence,sectorMask,reconstructRadial } from '../../../../product/source/src/extraction/structure.js';
import { executeExtraction } from '../../../../product/source/src/extraction/core.js';
import { imageTracerAdapter } from '../../../../product/source/src/extraction/adapters.js';
import tracer from '../../../../product/source/src/vendor/imagetracer-1.2.6.js';
import { repeatTransforms,vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';
import { defaultDocument,migrateDocument,inspectDocument } from '../../../../product/source/src/document/index.js';
test('reusable fourfold fixture yields evidence, prototype and native Repeat with stable identities',async()=>{
 const raster={width:96,height:96,data:new Uint8ClampedArray(96*96*4).fill(255)},source={name:'fourfold',sha256:'b'.repeat(64)};
 for(let y=0;y<96;y++)for(let x=0;x<96;x++)if([[72,48],[48,72],[24,48],[48,24]].some(([cx,cy])=>Math.hypot(x-cx,y-cy)<7))raster.data.fill(0,(y*96+x)*4,(y*96+x)*4+3);
 const e=radialEvidence(raster,{center:{x:48,y:48},radius:40,counts:[3,4,5]});assert.equal(e.candidates[0].count,4);assert.ok(e.candidates[0].maskIoU>.95);
 const mask=sectorMask(raster,source,e,{count:4}),r=await executeExtraction({raster,source,mask},imageTracerAdapter(tracer));
 const repeat=reconstructRadial(r.paths[0],e,{count:4});assert.equal(repeatTransforms(repeat).length,4);
 assert.deepEqual(repeat,reconstructRadial(r.paths[0],e,{count:4}));assert.match(vectorObjectToSVG(repeat,[]),/<path/);
 const doc=defaultDocument();doc.pages[0].layers[0].objects.push(repeat);const restored=migrateDocument(JSON.parse(JSON.stringify(doc)));assert.equal(inspectDocument(restored).passed,true);
});
