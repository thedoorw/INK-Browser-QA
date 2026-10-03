import test from 'node:test';
import assert from 'node:assert/strict';

import { Canvas2DMultiChannelInkRenderer } from '../product/source/src/render/canvas2d/multi-channel-ink-canvas2d.js';

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

function stroke(kind,id,y=0){
  return {
    id,type:'stroke',kind,color:'#355d73',size:18,opacity:1,pressure:.9,taper:.08,
    flow:.78,wetness:kind==='drybrush'?.08:.58,grain:kind==='drybrush'?.84:.2,
    bristle:kind==='drybrush'?.86:.28,softness:.72,blend:.9,smudge:.92,drag:.78,seed:9182,
    points:Array.from({length:80},(_,index)=>({
      x:index*2.2,
      y:y+Math.sin(index*.08)*18,
      p:.3+.6*((Math.sin(index*.031)+1)/2),
      tiltX:0,tiltY:0,t:index*4
    }))
  };
}

const paper={absorbency:.62,roughness:.51,fiberStrength:.43,fiberAngle:17,sizing:.23,granulation:.47,seed:241};
const options={minimumStrokes:1,preferredScale:1,maxDimension:480,maxPixels:90000};

function renderer(){
  return new Canvas2DMultiChannelInkRenderer({
    canvasFactory:captureCanvasFactory(),
    cacheLimit:8,
    maxDimension:480,
    maxPixels:90000
  });
}

test('warm multichannel cache hit bypasses repeated run preparation',()=>{
  const instance=renderer();
  const entries=[
    {stroke:stroke('brush','brush-1',0),matrix:[1,0,0,1,0,0],opacity:1},
    {stroke:stroke('drybrush','dry-1',28),matrix:[1,0,0,1,0,0],opacity:.9}
  ];

  const first=instance.render(entries,paper,options);
  const afterFirst=instance.diagnostics();
  const second=instance.render(entries,paper,options);
  const afterSecond=instance.diagnostics();

  assert.ok(first);
  assert.strictEqual(second,first,'warm cache returns the same retained render result');
  assert.equal(afterFirst.preparations,1);
  assert.equal(afterFirst.preparationSkips,0);
  assert.equal(afterSecond.preparations,1,'warm hit must not prepare stamps/bounds again');
  assert.equal(afterSecond.preparationSkips,1);
  assert.equal(afterSecond.cacheHits,1);
  assert.equal(afterSecond.cacheMisses,1);
  assert.equal(afterSecond.runs,1);
  assert.equal(afterSecond.cacheEntries,1);
});

test('cache request fingerprint invalidates when native stroke geometry changes',()=>{
  const instance=renderer();
  const entries=[
    {stroke:stroke('brush','brush-geometry',0),matrix:[1,0,0,1,0,0],opacity:1},
    {stroke:stroke('drybrush','dry-geometry',28),matrix:[1,0,0,1,0,0],opacity:.9}
  ];

  const first=instance.render(entries,paper,options);
  entries[0].stroke.points[24].x+=11;
  const second=instance.render(entries,paper,options);
  const diagnostics=instance.diagnostics();

  assert.ok(first&&second);
  assert.notStrictEqual(second,first);
  assert.equal(diagnostics.cacheHits,0);
  assert.equal(diagnostics.cacheMisses,2);
  assert.equal(diagnostics.preparations,2);
  assert.equal(diagnostics.preparationSkips,0);
  assert.equal(diagnostics.cacheEntries,2);
});

test('accepted Blender/Smudge warm hits bypass preparation while transient Preview-style renders do not cache',()=>{
  const entries=[
    {stroke:stroke('brush','brush-mix',0),matrix:[1,0,0,1,0,0],opacity:1},
    {stroke:stroke('drybrush','dry-mix',24),matrix:[1,0,0,1,0,0],opacity:.92},
    {stroke:stroke('blender','blend-mix',12),matrix:[1,0,0,1,0,0],opacity:.85},
    {stroke:stroke('smudge','smudge-mix',16),matrix:[1,0,0,1,0,0],opacity:.8}
  ];

  const cached=renderer();
  assert.ok(cached.render(entries,paper,options));
  assert.ok(cached.render(entries,paper,options));
  assert.equal(cached.diagnostics().preparations,1);
  assert.equal(cached.diagnostics().preparationSkips,1);
  assert.equal(cached.diagnostics().mixingStrokes,2);

  const transient=renderer();
  assert.ok(transient.render(entries,paper,{...options,transient:true}));
  assert.ok(transient.render(entries,paper,{...options,transient:true}));
  const diagnostics=transient.diagnostics();
  assert.equal(diagnostics.cacheHits,0);
  assert.equal(diagnostics.cacheEntries,0);
  assert.equal(diagnostics.preparations,2,'Preview/export transient semantics remain uncached');
  assert.equal(diagnostics.preparationSkips,0);
  assert.equal(diagnostics.runs,2);
});
