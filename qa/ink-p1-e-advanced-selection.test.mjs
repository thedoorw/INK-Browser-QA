import test from 'node:test';
import assert from 'node:assert/strict';

import {
  magneticLassoSelection,
  objectSelection,
  polygonalLassoSelection,
  magicWandSelection,
  quickSelection,
  refineRasterSelection
} from '../product/source/src/image/raster-selection-tools.js';

const image=(width,height,rgba=[0,0,0,255])=>{const data=new Uint8ClampedArray(width*height*4);for(let i=0;i<width*height;i++)data.set(rgba,i*4);return{width,height,data};};
const setPixel=(value,x,y,rgba)=>value.data.set(rgba,(y*value.width+x)*4);
const selected=(selection,x,y)=>selection.alpha[y*selection.width+x]>0;
const selectionShape=selection=>({type:selection.type,width:selection.width,height:selection.height,alpha:selection.alpha.length,bounds:selection.bounds});
const distanceToSegment=(point,a,b)=>{const dx=b.x-a.x,dy=b.y-a.y,lengthSq=dx*dx+dy*dy||1,t=Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.y-a.y)*dy)/lengthSq));return Math.hypot(point.x-(a.x+t*dx),point.y-(a.y+t*dy));};

function contrastSquare(){
  const value=image(12,12,[0,0,0,255]);
  for(let y=3;y<=8;y++)for(let x=3;x<=8;x++)setPixel(value,x,y,[255,255,255,255]);
  return value;
}

function twoObjects(){
  const value=image(14,10,[20,20,20,255]);
  for(let y=2;y<=5;y++)for(let x=1;x<=3;x++)setPixel(value,x,y,[230,20,20,255]);
  for(let y=2;y<=7;y++)for(let x=8;x<=11;x++)setPixel(value,x,y,[20,220,20,255]);
  return value;
}

test('Magnetic Lasso: high-contrast edge attracts the resolved path',()=>{
  const source=image(12,10,[0,0,0,255]);
  for(let y=0;y<10;y++)for(let x=6;x<12;x++)setPixel(source,x,y,[255,255,255,255]);
  const result=magneticLassoSelection(source,{points:[{x:3,y:1},{x:3,y:8}],close:false,searchRadius:4,edgeSensitivity:10,continuityWeight:.2});
  assert.ok(result.metadata.path.some(point=>point.x>=5));
  assert.equal(result.metadata.fallbackSegments,0);
});

test('Magnetic Lasso: resolved path stays inside raster bounds',()=>{
  const result=magneticLassoSelection(contrastSquare(),{points:[{x:0,y:0},{x:11,y:0},{x:11,y:11},{x:0,y:11}],searchRadius:3});
  assert.ok(result.metadata.path.every(point=>point.x>=0&&point.x<12&&point.y>=0&&point.y<12));
});

test('Magnetic Lasso: closed path creates expected inside/outside selection',()=>{
  const result=magneticLassoSelection(contrastSquare(),{points:[{x:2,y:2},{x:9,y:2},{x:9,y:9},{x:2,y:9}],searchRadius:2,edgeSensitivity:10});
  assert.equal(selected(result,5,5),true);
  assert.equal(selected(result,0,0),false);
  assert.equal(result.metadata.closed,true);
});

test('Magnetic Lasso: alpha edge contributes to edge evidence',()=>{
  const source=image(10,8,[100,100,100,0]);
  for(let y=0;y<8;y++)for(let x=5;x<10;x++)setPixel(source,x,y,[100,100,100,255]);
  const result=magneticLassoSelection(source,{points:[{x:2,y:1},{x:2,y:6}],close:false,searchRadius:4,edgeSensitivity:10,continuityWeight:.2});
  assert.ok(result.metadata.segmentEvidence[0].peakEdge>100);
  assert.equal(result.metadata.segmentEvidence[0].fallback,false);
});

test('Magnetic Lasso: search corridor radius is respected',()=>{
  const source=image(12,10,[0,0,0,255]);
  for(let y=0;y<10;y++)for(let x=6;x<12;x++)setPixel(source,x,y,[255,255,255,255]);
  const a={x:4,y:1},b={x:4,y:8},radius=2;
  const result=magneticLassoSelection(source,{points:[a,b],close:false,searchRadius:radius,edgeSensitivity:10,continuityWeight:.2});
  assert.ok(result.metadata.path.every(point=>distanceToSegment(point,a,b)<=radius+1e-9));
});

test('Magnetic Lasso: low-edge fixture uses deterministic straight fallback',()=>{
  const source=image(10,10,[80,80,80,255]);
  const result=magneticLassoSelection(source,{points:[{x:1,y:1},{x:8,y:8}],close:false,searchRadius:3});
  assert.equal(result.metadata.fallbackSegments,1);
  assert.deepEqual(result.metadata.path[0],{x:1,y:1});
  assert.deepEqual(result.metadata.path.at(-1),{x:8,y:8});
});

test('Magnetic Lasso: deterministic tie-breaking returns identical path',()=>{
  const source=image(11,11,[40,40,40,255]);
  const options={points:[{x:1,y:5},{x:9,y:5}],close:false,searchRadius:3,edgeSensitivity:0};
  const a=magneticLassoSelection(source,options),b=magneticLassoSelection(source,options);
  assert.deepEqual(a.metadata.path,b.metadata.path);
});

test('Magnetic Lasso: hard work-limit guard fails predictably',()=>{
  assert.throws(()=>magneticLassoSelection(contrastSquare(),{points:[{x:1,y:1},{x:10,y:10}],maxWork:2}),/INK_MAGNETIC_LASSO_WORK_LIMIT/);
});

test('Magnetic Lasso: repeated identical input gives identical path and mask',()=>{
  const source=contrastSquare(),options={points:[{x:2,y:2},{x:9,y:2},{x:9,y:9},{x:2,y:9}],searchRadius:2,edgeSensitivity:10};
  const a=magneticLassoSelection(source,options),b=magneticLassoSelection(source,options);
  assert.deepEqual(a.metadata.path,b.metadata.path);
  assert.deepEqual(a.alpha,b.alpha);
});

test('Object Selection: opaque foreground on transparent background is selected',()=>{
  const source=image(10,10,[0,0,0,0]);
  for(let y=3;y<=6;y++)for(let x=3;x<=6;x++)setPixel(source,x,y,[180,40,40,255]);
  const result=objectSelection(source,{roi:{x:0,y:0,w:10,h:10}});
  assert.equal(selected(result,4,4),true);
  assert.equal(selected(result,0,0),false);
  assert.ok(result.metadata.evidence.meanAlphaContrast>0);
});

test('Object Selection: colored foreground against uniform background is selected',()=>{
  const source=image(10,10,[25,25,25,255]);
  for(let y=2;y<=7;y++)for(let x=3;x<=6;x++)setPixel(source,x,y,[220,30,30,255]);
  const result=objectSelection(source,{roi:{x:0,y:0,w:10,h:10},colorThreshold:30});
  assert.equal(selected(result,4,4),true);
  assert.equal(selected(result,1,1),false);
});

test('Object Selection: ROI excludes an external distractor',()=>{
  const source=twoObjects();
  const result=objectSelection(source,{roi:{x:0,y:0,w:6,h:10},colorThreshold:30});
  assert.equal(selected(result,2,3),true);
  assert.equal(selected(result,9,3),false);
});

test('Object Selection: explicit seed selects intended component among multiple candidates',()=>{
  const source=twoObjects();
  const result=objectSelection(source,{roi:{x:0,y:0,w:14,h:10},seed:{x:2,y:3},colorThreshold:30});
  assert.equal(selected(result,2,3),true);
  assert.equal(selected(result,9,3),false);
  assert.equal(result.metadata.evidence.seedUsed,true);
});

test('Object Selection: no-seed candidate ranking is deterministic',()=>{
  const source=twoObjects(),options={roi:{x:0,y:0,w:14,h:10},colorThreshold:30};
  const a=objectSelection(source,options),b=objectSelection(source,options);
  assert.deepEqual(a.alpha,b.alpha);
  assert.equal(selected(a,9,3),true);
  assert.equal(selected(a,2,3),false);
});

test('Object Selection: alpha-aware segmentation prefers opaque component',()=>{
  const source=image(12,8,[100,100,100,0]);
  for(let y=2;y<=5;y++)for(let x=4;x<=7;x++)setPixel(source,x,y,[100,100,100,220]);
  const result=objectSelection(source,{roi:{x:0,y:0,w:12,h:8},colorThreshold:255,alphaThreshold:20});
  assert.equal(selected(result,5,3),true);
  assert.equal(selected(result,1,1),false);
});

test('Object Selection: outside-ROI pixels remain unselected',()=>{
  const source=image(10,10,[20,20,20,255]);
  for(let y=1;y<=8;y++)for(let x=1;x<=8;x++)setPixel(source,x,y,[220,30,30,255]);
  const result=objectSelection(source,{roi:{x:3,y:3,w:4,h:4},colorThreshold:30});
  for(let y=0;y<10;y++)for(let x=0;x<10;x++)if(x<3||x>=7||y<3||y>=7)assert.equal(selected(result,x,y),false);
});

test('Object Selection: polygon ROI is bounded and deterministic',()=>{
  const source=image(10,10,[20,20,20,255]);
  for(let y=2;y<=7;y++)for(let x=2;x<=7;x++)setPixel(source,x,y,[220,30,30,255]);
  const roi=[{x:1,y:1},{x:8,y:1},{x:5,y:8}];
  const a=objectSelection(source,{roi,colorThreshold:30}),b=objectSelection(source,{roi,colorThreshold:30});
  assert.deepEqual(a.alpha,b.alpha);
  assert.equal(selected(a,5,4),true);
  assert.equal(selected(a,2,7),false);
});

test('Object Selection: insufficient evidence returns predictable empty result',()=>{
  const result=objectSelection(image(8,8,[100,100,100,255]),{roi:{x:1,y:1,w:6,h:6}});
  assert.deepEqual(result.bounds,{x:0,y:0,w:0,h:0});
  assert.equal(result.metadata.confidence,0);
  assert.equal(result.metadata.evidence.insufficientEvidence,true);
});

test('Object Selection: hard work-limit guard fails predictably',()=>{
  assert.throws(()=>objectSelection(twoObjects(),{maxWork:1}),/INK_OBJECT_SELECTION_WORK_LIMIT/);
});

test('Object Selection: evidence/confidence metadata is bounded and deterministic',()=>{
  const source=twoObjects(),options={roi:{x:0,y:0,w:14,h:10},colorThreshold:30};
  const a=objectSelection(source,options),b=objectSelection(source,options);
  assert.ok(a.metadata.confidence>=0&&a.metadata.confidence<=1);
  assert.deepEqual(a.metadata,b.metadata);
  assert.ok(Number.isFinite(a.metadata.evidence.meanColorContrast));
});

test('Shared invariant: P1-A and P1-E selections keep the compatible output shape',()=>{
  const source=contrastSquare();
  const p1a=magicWandSelection(source,{x:4,y:4,tolerance:0});
  const p1e=objectSelection(source,{roi:{x:0,y:0,w:12,h:12},colorThreshold:30});
  assert.equal(selectionShape(p1a).type,'selection');
  assert.equal(selectionShape(p1e).type,'selection');
  assert.equal(p1a.alpha.length,p1e.alpha.length);
  assert.ok(Array.isArray(p1e.alpha));
});

test('Shared invariant: P1-E output composes with refineRasterSelection()',()=>{
  const source=contrastSquare();
  const magnetic=magneticLassoSelection(source,{points:[{x:2,y:2},{x:9,y:2},{x:9,y:9},{x:2,y:9}],searchRadius:2,edgeSensitivity:10});
  const object=objectSelection(source,{roi:{x:0,y:0,w:12,h:12},colorThreshold:30});
  const a=refineRasterSelection(magnetic,{smooth:1,feather:1});
  const b=refineRasterSelection(object,{expand:1});
  assert.equal(a.type,'raster-mask');
  assert.equal(b.type,'raster-mask');
  assert.equal(a.alpha.length,144);
  assert.equal(b.alpha.length,144);
});

test('Shared invariant: P1-A polygonal/quick selection behavior remains available',()=>{
  const source=contrastSquare();
  const polygon=polygonalLassoSelection(12,12,[{x:2,y:2},{x:10,y:2},{x:10,y:10},{x:2,y:10}]);
  const quick=quickSelection(source,{samples:[{x:4,y:4}],tolerance:0});
  assert.equal(selected(polygon,5,5),true);
  assert.equal(selected(quick,4,4),true);
});

test('Shared invariant: source ImageData stays immutable for both P1-E capabilities',()=>{
  const source=contrastSquare(),before=[...source.data];
  magneticLassoSelection(source,{points:[{x:2,y:2},{x:9,y:2},{x:9,y:9},{x:2,y:9}],searchRadius:2});
  objectSelection(source,{roi:{x:0,y:0,w:12,h:12}});
  assert.deepEqual([...source.data],before);
});

test('Shared invariant: invalid seed outside Object Selection ROI fails predictably',()=>{
  assert.throws(()=>objectSelection(twoObjects(),{roi:{x:0,y:0,w:5,h:5},seed:{x:10,y:5}}),/INK_OBJECT_SELECTION_SEED_OUTSIDE_ROI/);
});
