import test from 'node:test';
import assert from 'node:assert/strict';

import { Matrix } from '../product/source/src/core/index.js';
import { localMatrixFromWorld } from '../product/source/src/editor/transform.js';
import {
  createSkewMatrix, createDistortTransform, createPerspectiveTransform,
  mapProjectivePoint, invertProjectiveTransform, warpNormalizedPoint,
  createWarpDeformationPlan
} from '../product/source/src/editor/transform-advanced.js';
import { createTextObject, updateTextObject } from '../product/source/src/editor/text-object.js';
import { layoutParagraphText, layoutVerticalText, layoutTextOnPath } from '../product/source/src/editor/text-layout.js';
import { resolvePathPaintAppearance } from '../product/source/src/vector/paint-appearance.js';
import { normalizeGradientFill, normalizePatternFill, resolveVectorFillAppearance } from '../product/source/src/vector/fill-appearance.js';
import {
  normalizeRulerGuide, addRulerGuide, moveRulerGuide, removeRulerGuide,
  equalDistanceSmartSnap, measurePoints, measureBounds
} from '../product/source/src/editor/precision-layout.js';

const close = (actual, expected, epsilon=1e-8) => assert.ok(Math.abs(actual-expected)<=epsilon, `${actual} != ${expected}`);
const anchor = (x,y, incoming={x:0,y:0}, outgoing={x:0,y:0}) => ({x,y,in:incoming,out:outgoing,mode:'corner'});

test('skew X/Y uses current affine Matrix authority and preserves pivot', () => {
  const matrix = createSkewMatrix({xDegrees:45,yDegrees:0,pivot:{x:10,y:10}});
  const pivot = Matrix.point(matrix,{x:10,y:10});
  close(pivot.x,10); close(pivot.y,10);
  const point = Matrix.point(matrix,{x:10,y:20});
  close(point.x,20); close(point.y,20);
  assert.deepEqual(localMatrixFromWorld(Matrix.identity(),matrix),matrix);
});

test('distort/projective transform maps all four exact corners', () => {
  const source=[{x:0,y:0},{x:100,y:0},{x:100,y:100},{x:0,y:100}];
  const destination=[{x:10,y:20},{x:120,y:10},{x:100,y:130},{x:-5,y:90}];
  const matrix=createDistortTransform(source,destination);
  source.forEach((point,index)=>{
    const mapped=mapProjectivePoint(matrix,point);
    close(mapped.x,destination[index].x,1e-7); close(mapped.y,destination[index].y,1e-7);
  });
});

test('perspective inverse round-trips and degenerate quad is rejected', () => {
  const source=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const destination=[{x:0,y:0},{x:2,y:.2},{x:1.5,y:1.3},{x:.1,y:1}];
  const matrix=createPerspectiveTransform(source,destination);
  const inverse=invertProjectiveTransform(matrix);
  const p={x:.31,y:.72};
  const round=mapProjectivePoint(inverse,mapProjectivePoint(matrix,p));
  close(round.x,p.x,1e-7); close(round.y,p.y,1e-7);
  assert.throws(()=>createPerspectiveTransform([{x:0,y:0},{x:1,y:0},{x:2,y:0},{x:3,y:0}],destination),/QUAD_DEGENERATE/);
});

test('warp is identity at zero, deterministic and bounded when non-zero', () => {
  const point={x:.25,y:.5};
  assert.deepEqual(warpNormalizedPoint(point,{strength:0}),point);
  const a=warpNormalizedPoint(point,{strength:.8,maxDisplacement:.25});
  const b=warpNormalizedPoint(point,{strength:.8,maxDisplacement:.25});
  assert.deepEqual(a,b); assert.ok(a.x>=-.25&&a.x<=1.25&&a.y>=-.25&&a.y<=1.25);
  const plan=createWarpDeformationPlan({x:0,y:0,w:200,h:100},{strength:.5,maxDisplacement:.25});
  assert.equal(plan.authority,'INK-NON-DESTRUCTIVE-DEFORMATION');
  close(plan.parameters.bend,25);
});

test('paragraph type wraps deterministically inside bounded box', () => {
  const object=createTextObject({id:'t1',text:'aa bb cc',fontSize:10,lineHeight:1,textBox:{width:50,height:30}});
  const plan=layoutParagraphText(object,{measureText:text=>text.length*10});
  assert.deepEqual(plan.lines.map(line=>line.text),['aa bb','cc']);
  assert.equal(plan.overflow,false);
  assert.deepEqual(object.textBox,{width:50,height:30});
});

test('paragraph alignment supports center and right', () => {
  const object=createTextObject({text:'abc',fontSize:10,lineHeight:1,textBox:{width:100,height:20},paragraphAlign:'center'});
  let plan=layoutParagraphText(object,{measureText:text=>text.length*10});
  close(plan.lines[0].x,35);
  updateTextObject(object,{paragraphAlign:'right'});
  plan=layoutParagraphText(object,{measureText:text=>text.length*10});
  close(plan.lines[0].x,70);
});

test('vertical type preserves explicit Text authority state and advance order', () => {
  const object=createTextObject({id:'vertical',text:'ABC',fontSize:20,lineHeight:1.2,writingMode:'vertical-rl'});
  const plan=layoutVerticalText(object);
  assert.equal(object.type,'text');
  assert.equal(object.writingMode,'vertical-rl');
  assert.deepEqual(plan.glyphs.map(g=>g.character),['A','B','C']);
  close(plan.glyphs[2].y,48);
});

test('text on editable Path honors start offset/tangent and never mutates source Path', () => {
  const object=createTextObject({id:'path-text',text:'AB',fontSize:10,lineHeight:1,pathText:{pathId:'p1',startOffset:10}});
  const path={id:'p1',type:'path',matrix:Matrix.identity(),subpaths:[{closed:false,role:'outer',anchors:[anchor(0,0),anchor(100,0)]}]};
  const before=JSON.stringify(path);
  const plan=layoutTextOnPath(object,path,{measureText:()=>10});
  close(plan.placements[0].x,15); close(plan.placements[0].y,0); close(plan.placements[0].angle,0);
  assert.equal(plan.overflow,false);
  assert.equal(JSON.stringify(path),before);
});

test('text on Path reports bounded overflow when text exceeds path', () => {
  const object=createTextObject({text:'ABCDE',fontSize:10,pathText:{pathId:'p2',startOffset:0}});
  const path={id:'p2',type:'path',matrix:Matrix.identity(),subpaths:[{closed:false,role:'outer',anchors:[anchor(0,0),anchor(20,0)]}]};
  const plan=layoutTextOnPath(object,path,{measureText:()=>10});
  assert.equal(plan.placements.length,2);
  assert.equal(plan.overflow,true);
});

test('gradient fill normalizes linear/radial stops including opacity/order', () => {
  const linear=normalizeGradientFill({type:'linear',stops:[{offset:1,color:'#fff',opacity:.4},{offset:0,color:'#000'},{offset:.5,color:'#f00',opacity:.8}]});
  assert.deepEqual(linear.stops.map(stop=>stop.offset),[0,.5,1]);
  assert.deepEqual(linear.stops.map(stop=>stop.opacity),[1,.8,.4]);
  const radial=normalizeGradientFill({type:'radial',radius:.75,stops:[{offset:0,color:'#000'},{offset:1,color:'#fff'}]});
  assert.equal(radial.type,'radial'); close(radial.radius,.75);
});

test('pattern fill normalizes transform/repeat and unavailable reference falls back', () => {
  const pattern=normalizePatternFill({patternRef:'pattern-1',origin:{x:3,y:4},scale:{x:2,y:.5},rotation:30,repeat:'repeat-x',fallback:'#123456'});
  assert.deepEqual(pattern.origin,{x:3,y:4}); assert.deepEqual(pattern.scale,{x:2,y:.5}); assert.equal(pattern.rotation,30); assert.equal(pattern.repeat,'repeat-x');
  const path={fill:'#abcdef',stroke:'none',fillAppearance:pattern};
  const resolved=resolveVectorFillAppearance(path,{patternRegistry:new Set()});
  assert.equal(resolved.mode,'solid-fallback'); assert.equal(resolved.fill,'#123456');
});

test('ordinary solid fill remains governed by current paint appearance authority', () => {
  const path={fill:'#445566',stroke:'#000'};
  assert.equal(resolvePathPaintAppearance(path).fill,'#445566');
  const resolved=resolveVectorFillAppearance(path);
  assert.equal(resolved.mode,'solid'); assert.equal(resolved.fill,'#445566');
});

test('persistent ruler guides normalize and add/move/remove as pure state', () => {
  const base=[];
  const guide=normalizeRulerGuide({id:'g1',orientation:'horizontal',position:12,visible:true});
  const added=addRulerGuide(base,guide);
  const moved=moveRulerGuide(added,'g1',20);
  const removed=removeRulerGuide(moved,'g1');
  assert.equal(base.length,0); assert.equal(added[0].position,12); assert.equal(moved[0].position,20); assert.deepEqual(removed,[]);
  const vertical=normalizeRulerGuide({id:'g2',orientation:'vertical',position:5,locked:true});
  assert.equal(vertical.orientation,'vertical'); assert.equal(vertical.locked,true);
});

test('equal-distance smart snapping finds X opportunity with evidence', () => {
  const result=equalDistanceSmartSnap({x:39,y:100,w:10,h:10},[{x:0,y:0,w:10,h:10},{x:20,y:0,w:10,h:10}],{tolerance:2});
  assert.equal(result.snapped.x,true); close(result.delta.x,1); assert.equal(result.evidence.x.type,'match-existing-gap-after');
});

test('equal-distance smart snapping finds Y opportunity and tolerance miss', () => {
  const hit=equalDistanceSmartSnap({x:100,y:39,w:10,h:10},[{x:0,y:0,w:10,h:10},{x:0,y:20,w:10,h:10}],{tolerance:2});
  assert.equal(hit.snapped.y,true); close(hit.delta.y,1);
  const miss=equalDistanceSmartSnap({x:55,y:100,w:10,h:10},[{x:0,y:0,w:10,h:10},{x:20,y:0,w:10,h:10}],{tolerance:2});
  assert.equal(miss.snapped.x,false); assert.equal(miss.delta.x,0);
});

test('equal-distance tie-breaking and identical inputs are deterministic', () => {
  const input=[{x:0,y:0,w:10,h:10},{x:20,y:0,w:10,h:10},{x:40,y:0,w:10,h:10}];
  const a=equalDistanceSmartSnap({x:59,y:0,w:10,h:10},input,{tolerance:2});
  const b=equalDistanceSmartSnap({x:59,y:0,w:10,h:10},input,{tolerance:2});
  assert.deepEqual(a,b); assert.equal(a.snapped.x,true);
});

test('ruler measurement reports distance/delta/angle and bounds size', () => {
  const measurement=measurePoints({x:1,y:2},{x:4,y:6});
  assert.deepEqual({dx:measurement.dx,dy:measurement.dy},{dx:3,dy:4}); close(measurement.distance,5); close(measurement.angleDegrees,53.13010235415598);
  const bounds=measureBounds({x:10,y:20,w:30,h:40});
  assert.equal(bounds.width,30); assert.equal(bounds.height,40); assert.deepEqual(bounds.center,{x:25,y:40});
});

test('invalid P1-C inputs fail predictably and modules parse/import in Node', () => {
  assert.throws(()=>createSkewMatrix({xDegrees:Infinity}),/SKEW_INPUT_INVALID/);
  assert.throws(()=>normalizeGradientFill({type:'linear',stops:[{offset:0,color:'#000'}]}),/GRADIENT_STOPS_REQUIRED/);
  assert.throws(()=>normalizeRulerGuide({orientation:'diagonal',position:0}),/GUIDE_INVALID/);
  assert.throws(()=>measurePoints({x:0,y:0},{x:Infinity,y:0}),/MEASURE_POINT_INVALID/);
});
