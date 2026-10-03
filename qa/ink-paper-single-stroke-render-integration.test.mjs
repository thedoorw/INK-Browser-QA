import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  NaturalMediaController,
  supportsNaturalMediaRun
} from '../product/source/src/render/index.js';

const stroke=(kind='brush',id='single')=>({
  id,type:'stroke',kind,color:'#355d73',size:26,opacity:1,pressure:.92,taper:.08,
  flow:.82,wetness:kind==='drybrush'?.48:.82,grain:kind==='drybrush'?.82:.24,
  bristle:kind==='drybrush'?.78:.26,softness:.7,seed:9182,
  matrix:[1,0,0,1,0,0],
  points:[
    {x:0,y:0,p:.24,t:0},{x:42,y:-8,p:.82,t:18},
    {x:86,y:7,p:.96,t:39},{x:132,y:0,p:.42,t:61}
  ]
});

function captureCanvasFactory(){
  return ()=>{
    const canvas={width:0,height:0,bytes:null};
    canvas.getContext=()=>({
      createImageData(width,height){return{width,height,data:new Uint8ClampedArray(width*height*4)};},
      putImageData(image){canvas.bytes=new Uint8ClampedArray(image.data);}
    });
    return canvas;
  };
}
function hash(bytes){
  let h=0x811c9dc5;
  for(const byte of bytes||[]){h^=byte;h=Math.imul(h,0x01000193);}
  return h>>>0;
}
function renderSingle(kind,paper){
  const controller=new NaturalMediaController({
    preference:'canvas2d',
    multiChannelOptions:{canvas2d:{canvasFactory:captureCanvasFactory(),maxDimension:320,maxPixels:102400}}
  });
  const draws=[];
  const ctx={drawImage(canvas,x,y,w,h){draws.push({canvas,x,y,w,h});}};
  const entry={stroke:stroke(kind,kind+'-single'),matrix:[1,0,0,1,13,-9],opacity:1};
  const passed=controller.renderStrokeRun(ctx,[entry],paper,{minimumStrokes:1,preferredScale:1.2,maxDimension:320,maxPixels:102400,transient:true});
  const output=draws[0]?.canvas;
  const result={passed,draws,bytes:output?.bytes,diagnostics:controller.diagnostics()};
  controller.dispose();
  return result;
}

test('single Brush and DryBrush are explicitly legal on the existing paper-coupled run path',()=>{
  assert.equal(supportsNaturalMediaRun([{stroke:stroke('brush')}]),false,'default run contract remains 2+');
  assert.equal(supportsNaturalMediaRun([{stroke:stroke('brush')}],{minimum:1}),true);
  assert.equal(supportsNaturalMediaRun([{stroke:stroke('drybrush')}],{minimum:1}),true);
});

test('single Brush consumes existing paper semantics through Canvas2D multichannel rendering',()=>{
  const smooth=renderSingle('brush',{seed:1337,absorbency:.08,roughness:.08,sizing:.2,granulation:.2,fiberStrength:.3,fiberAngle:0});
  const toothy=renderSingle('brush',{seed:1337,absorbency:.92,roughness:.92,sizing:.2,granulation:.2,fiberStrength:.3,fiberAngle:0});
  assert.equal(smooth.passed,true);
  assert.equal(toothy.passed,true);
  assert.equal(smooth.draws.length,1);
  assert.equal(toothy.draws.length,1);
  assert.equal(smooth.diagnostics.activeBackend,'canvas2d-multichannel');
  assert.equal(toothy.diagnostics.activeBackend,'canvas2d-multichannel');
  assert.notEqual(hash(smooth.bytes),hash(toothy.bytes),'paper state must produce renderer-observable content delta');
});

test('single DryBrush consumes existing paper semantics through Canvas2D multichannel rendering',()=>{
  const smooth=renderSingle('drybrush',{seed:1337,absorbency:.08,roughness:.08,sizing:.2,granulation:.15,fiberStrength:.25,fiberAngle:0});
  const toothy=renderSingle('drybrush',{seed:1337,absorbency:.9,roughness:.95,sizing:.2,granulation:.55,fiberStrength:.65,fiberAngle:25});
  assert.equal(smooth.passed,true);
  assert.equal(toothy.passed,true);
  assert.equal(smooth.diagnostics.activeBackend,'canvas2d-multichannel');
  assert.equal(toothy.diagnostics.activeBackend,'canvas2d-multichannel');
  assert.notEqual(hash(smooth.bytes),hash(toothy.bytes),'paper state must affect single DryBrush pixels');
});

test('page renderer opts singleton Brush/DryBrush into paper-coupled rendering without replacing native Stroke authority',()=>{
  const source=readFileSync('product/source/src/ink.js','utf8');
  assert.match(source,/if\(entries\.length&&this\.naturalMedia\.renderStrokeRun\(ctx,entries,page\.paper,\{\.\.\.options,minimumStrokes:1\}\)\)/);
  assert.doesNotMatch(source,/entries\.length>1&&this\.naturalMedia\.renderStrokeRun/);
  assert.match(source,/if\(o\.type==='stroke'\)this\.drawStroke\(ctx,o\)/);
  assert.match(source,/if\(this\.naturalMedia\.renderStroke\(ctx,render\)\)return/);
});

test('multichannel backend default remains 2+ unless the caller explicitly requests singleton support',()=>{
  const canvasSource=readFileSync('product/source/src/render/canvas2d/multi-channel-ink-canvas2d.js','utf8');
  const webglSource=readFileSync('product/source/src/render/webgl/multi-channel-ink-webgl.js','utf8');
  assert.match(canvasSource,/options\.minimumStrokes \?\? 2/);
  assert.match(webglSource,/options\.minimumStrokes\?\?2/);
  assert.match(canvasSource,/supportsNaturalMediaRun\(entries, \{ minimum \}\)/);
  assert.match(webglSource,/supportsNaturalMediaRun\(entries,\{minimum\}\)/);
});
