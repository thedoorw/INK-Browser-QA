import test from 'node:test';
import assert from 'node:assert/strict';

import { createLayerEffect, applyLayerEffects } from '../product/source/src/image/image-core.js';

const image=(width,height)=>({width,height,data:new Uint8ClampedArray(width*height*4)});
const setPixel=(value,x,y,rgba)=>value.data.set(rgba,(y*value.width+x)*4);
const pixel=(value,x,y)=>[...value.data.slice((y*value.width+x)*4,(y*value.width+x)*4+4)];
const singlePixel=()=>{const value=image(7,7);setPixel(value,3,3,[255,255,255,255]);return value;};
const solidSquare=()=>{const value=image(7,7);for(let y=2;y<=4;y++)for(let x=2;x<=4;x++)setPixel(value,x,y,[255,255,255,255]);return value;};

test('Drop Shadow: hard-alpha fixture has exact bounded offset and source remains intact',()=>{
  const source=singlePixel();
  const result=applyLayerEffects(source,[createLayerEffect('dropShadow',{color:'#000000',offsetX:1,offsetY:1,blur:0})]);
  assert.deepEqual(pixel(result,4,4),[0,0,0,255]);
  assert.deepEqual(pixel(result,3,3),[255,255,255,255]);
});

test('Drop Shadow: blur produces soft alpha',()=>{
  const result=applyLayerEffects(singlePixel(),[createLayerEffect('dropShadow',{color:'#000000',offsetX:0,offsetY:0,blur:1})]);
  assert.ok(pixel(result,2,3)[3]>0&&pixel(result,2,3)[3]<255);
});

test('Drop Shadow: opacity changes shadow strength',()=>{
  const result=applyLayerEffects(singlePixel(),[createLayerEffect('dropShadow',{color:'#000000',offsetX:1,offsetY:0},{opacity:.5})]);
  assert.ok(pixel(result,4,3)[3]>=127&&pixel(result,4,3)[3]<=128);
});

test('Drop Shadow: spread expands the hard-alpha footprint before blur',()=>{
  const result=applyLayerEffects(singlePixel(),[createLayerEffect('dropShadow',{color:'#000000',offsetX:0,offsetY:0,blur:0,spread:1})]);
  assert.equal(pixel(result,2,3)[3],255);
});

test('Drop Shadow: edge clipping is deterministic',()=>{
  const source=image(5,5);setPixel(source,4,4,[255,255,255,255]);
  const a=applyLayerEffects(source,[createLayerEffect('dropShadow',{offsetX:2,offsetY:2,blur:0})]);
  const b=applyLayerEffects(source,[createLayerEffect('dropShadow',{offsetX:2,offsetY:2,blur:0})]);
  assert.deepEqual([...a.data],[...source.data]);
  assert.deepEqual([...a.data],[...b.data]);
});

test('Inner Shadow: effect remains inside source alpha and exterior remains transparent',()=>{
  const source=solidSquare();
  const result=applyLayerEffects(source,[createLayerEffect('innerShadow',{color:'#000000',offsetX:1,offsetY:0,blur:0})]);
  assert.equal(pixel(result,1,3)[3],0);
  assert.equal(pixel(result,2,3)[3],255);
  assert.ok(pixel(result,2,3)[0]<pixel(result,4,3)[0]);
});

test('Inner Shadow: offset direction changes the affected edge',()=>{
  const source=solidSquare();
  const positive=applyLayerEffects(source,[createLayerEffect('innerShadow',{color:'#000000',offsetX:1,offsetY:0,blur:0})]);
  const negative=applyLayerEffects(source,[createLayerEffect('innerShadow',{color:'#000000',offsetX:-1,offsetY:0,blur:0})]);
  assert.ok(pixel(positive,2,3)[0]<pixel(positive,4,3)[0]);
  assert.ok(pixel(negative,4,3)[0]<pixel(negative,2,3)[0]);
});

test('Inner Shadow: original alpha is preserved',()=>{
  const source=solidSquare();
  setPixel(source,2,3,[255,255,255,96]);
  const result=applyLayerEffects(source,[createLayerEffect('innerShadow',{color:'#000000',offsetX:1,blur:1,choke:1})]);
  for(let i=3;i<source.data.length;i+=4)assert.equal(result.data[i],source.data[i]);
});

test('Outer Glow: glow appears outside source while source pixel remains source-dominant',()=>{
  const result=applyLayerEffects(singlePixel(),[createLayerEffect('outerGlow',{color:'#ff0000',radius:1})]);
  assert.ok(pixel(result,2,3)[3]>0);
  assert.deepEqual(pixel(result,3,3),[255,255,255,255]);
});

test('Outer Glow: radius changes footprint',()=>{
  const small=applyLayerEffects(singlePixel(),[createLayerEffect('outerGlow',{color:'#ff0000',radius:1})]);
  const large=applyLayerEffects(singlePixel(),[createLayerEffect('outerGlow',{color:'#ff0000',radius:2})]);
  assert.equal(pixel(small,1,3)[3],0);
  assert.ok(pixel(large,1,3)[3]>0);
});

test('Outer Glow: opacity is bounded',()=>{
  const source=singlePixel();
  const full=applyLayerEffects(source,[createLayerEffect('outerGlow',{color:'#ff0000',radius:1},{opacity:2})]);
  const one=applyLayerEffects(source,[createLayerEffect('outerGlow',{color:'#ff0000',radius:1},{opacity:1})]);
  const none=applyLayerEffects(source,[createLayerEffect('outerGlow',{color:'#ff0000',radius:1},{opacity:-1})]);
  assert.deepEqual([...full.data],[...one.data]);
  assert.deepEqual([...none.data],[...source.data]);
});

test('Stroke: inside stays within source alpha',()=>{
  const result=applyLayerEffects(solidSquare(),[createLayerEffect('stroke',{color:'#ff0000',size:1,position:'inside'})]);
  assert.deepEqual(pixel(result,2,3),[255,0,0,255]);
  assert.equal(pixel(result,1,3)[3],0);
  assert.deepEqual(pixel(result,3,3),[255,255,255,255]);
});

test('Stroke: outside stays outside source alpha',()=>{
  const result=applyLayerEffects(solidSquare(),[createLayerEffect('stroke',{color:'#ff0000',size:1,position:'outside'})]);
  assert.deepEqual(pixel(result,1,3),[255,0,0,255]);
  assert.deepEqual(pixel(result,2,3),[255,255,255,255]);
});

test('Stroke: center straddles boundary and source center remains visible',()=>{
  const result=applyLayerEffects(solidSquare(),[createLayerEffect('stroke',{color:'#ff0000',size:2,position:'center'})]);
  assert.deepEqual(pixel(result,1,3),[255,0,0,255]);
  assert.deepEqual(pixel(result,2,3),[255,0,0,255]);
  assert.deepEqual(pixel(result,3,3),[255,255,255,255]);
});

test('Stroke: zero size is identity',()=>{
  const source=solidSquare();
  const result=applyLayerEffects(source,[createLayerEffect('stroke',{size:0,position:'inside'})]);
  assert.deepEqual([...result.data],[...source.data]);
});

test('Color Overlay regression: enabled overlay changes only non-transparent pixels and respects opacity',()=>{
  const source=image(2,1);setPixel(source,0,0,[255,255,255,255]);
  const result=applyLayerEffects(source,[createLayerEffect('colorOverlay',{color:'#0000ff'},{opacity:.5})]);
  assert.deepEqual(pixel(result,0,0),[128,128,255,255]);
  assert.deepEqual(pixel(result,1,0),[0,0,0,0]);
});

test('Color Overlay regression: legacy nonzero-alpha strength and source alpha are preserved',()=>{
  const source=image(1,1);setPixel(source,0,0,[255,255,255,64]);
  const result=applyLayerEffects(source,[createLayerEffect('colorOverlay',{color:'#000000'},{opacity:.5})]);
  assert.deepEqual(pixel(result,0,0),[128,128,128,64]);
});

test('disabled effect is identity',()=>{
  const source=singlePixel();
  const result=applyLayerEffects(source,[createLayerEffect('colorOverlay',{color:'#ff0000'},{enabled:false})]);
  assert.deepEqual([...result.data],[...source.data]);
});

test('effect stack array order is deterministic and Color Overlay composes with new effects',()=>{
  const source=singlePixel();
  const shadow=createLayerEffect('dropShadow',{color:'#000000',offsetX:1});
  const overlay=createLayerEffect('colorOverlay',{color:'#ff0000'});
  const shadowThenOverlay=applyLayerEffects(source,[shadow,overlay]);
  const overlayThenShadow=applyLayerEffects(source,[overlay,shadow]);
  const repeat=applyLayerEffects(source,[shadow,overlay]);
  assert.deepEqual([...shadowThenOverlay.data],[...repeat.data]);
  assert.notDeepEqual([...shadowThenOverlay.data],[...overlayThenShadow.data]);
  assert.deepEqual(pixel(shadowThenOverlay,4,3).slice(0,3),[255,0,0]);
  assert.deepEqual(pixel(overlayThenShadow,4,3).slice(0,3),[0,0,0]);
});

test('source input stays immutable and output dimensions stay unchanged',()=>{
  const source=solidSquare(),before=[...source.data];
  const result=applyLayerEffects(source,[createLayerEffect('outerGlow',{radius:2}),createLayerEffect('stroke',{size:1,position:'outside'})]);
  assert.deepEqual([...source.data],before);
  assert.equal(result.width,source.width);
  assert.equal(result.height,source.height);
});

test('RGBA color alpha participates in effect opacity without changing renderer authority',()=>{
  const result=applyLayerEffects(singlePixel(),[createLayerEffect('dropShadow',{color:'#ff000080',offsetX:1,offsetY:0,blur:0})]);
  assert.ok(pixel(result,4,3)[3]>=127&&pixel(result,4,3)[3]<=128);
  assert.deepEqual(pixel(result,4,3).slice(0,3),[255,0,0]);
});

test('invalid numeric parameters normalize safely, bytes remain bounded, and invalid stroke position fails predictably',()=>{
  const source=singlePixel();
  const result=applyLayerEffects(source,[createLayerEffect('dropShadow',{offsetX:Infinity,offsetY:NaN,blur:Infinity,spread:-2,color:'not-a-color'})]);
  assert.ok([...result.data].every(value=>Number.isInteger(value)&&value>=0&&value<=255));
  assert.throws(()=>applyLayerEffects(source,[createLayerEffect('stroke',{size:1,position:'diagonal'})]),/INK_LAYER_EFFECT_STROKE_POSITION_UNSUPPORTED/);
});
