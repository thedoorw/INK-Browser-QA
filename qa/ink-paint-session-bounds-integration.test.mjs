import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import { paintSessionWorldBounds } from '../product/source/src/studio-core.js';
import { BrushPresetRegistry, StrokeSessionRecorder, replayStrokeSession } from '../product/source/src/paint/paint-core.js';

function paintFixture(){
  const registry=new BrushPresetRegistry();
  const recorder=new StrokeSessionRecorder({id:'bounds-session',name:'Bounds Session',seed:17,registry});
  recorder.beginStroke({id:'wide-stroke',brushId:'pencil',color:'#202020',seed:17,layerId:'layer-1'});
  recorder.addSample({x:-110,y:-95,pressure:.35,timestamp:0});
  recorder.addSample({x:0,y:0,pressure:.8,timestamp:16});
  recorder.addSample({x:100,y:70,pressure:.55,timestamp:32});
  recorder.endStroke();
  return replayStrokeSession(recorder.finish(),{registry,fixedSeed:true});
}

test('paint-session bounds derive from compiled replay dabs instead of generic 1x1 fallback',()=>{
  const replay=paintFixture(),before=JSON.stringify(replay);
  const bounds=paintSessionWorldBounds({type:'paint-session',matrix:[1,0,0,1,0,0],replay});
  assert.ok(bounds);
  assert.ok(bounds.w>200,`expected replay width > 200, got ${bounds.w}`);
  assert.ok(bounds.h>165,`expected replay height > 165, got ${bounds.h}`);
  assert.ok(bounds.x<-110);
  assert.ok(bounds.y<-95);
  assert.ok(bounds.x+bounds.w>100);
  assert.ok(bounds.y+bounds.h>70);
  assert.equal(JSON.stringify(replay),before,'bounds calculation must not mutate replay state');
});

test('paint-session world bounds preserve object and parent transforms',()=>{
  const replay=paintFixture();
  const local=paintSessionWorldBounds({type:'paint-session',matrix:[1,0,0,1,0,0],replay});
  const world=paintSessionWorldBounds({type:'paint-session',matrix:[2,0,0,3,40,-20],replay},[1,0,0,1,10,5]);
  assert.ok(Math.abs(world.x-(50+local.x*2))<1e-9);
  assert.ok(Math.abs(world.y-(-15+local.y*3))<1e-9);
  assert.ok(Math.abs(world.w-local.w*2)<1e-9);
  assert.ok(Math.abs(world.h-local.h*3)<1e-9);
});

test('paint-session bounds remain conservative for affine rotation',()=>{
  const replay=paintFixture();
  const local=paintSessionWorldBounds({type:'paint-session',matrix:[1,0,0,1,0,0],replay});
  const world=paintSessionWorldBounds({type:'paint-session',matrix:[0,1,-1,0,0,0],replay});
  assert.ok(Math.abs(world.w-local.h)<1e-9);
  assert.ok(Math.abs(world.h-local.w)<1e-9);
});

test('empty paint-session replay stays on existing renderer fallback path',()=>{
  assert.equal(paintSessionWorldBounds({type:'paint-session',matrix:[1,0,0,1,0,0],replay:{strokes:[]}}),null);
});

test('Studio renderer keeps native paint replay and routes paint-session bounds through the integration helper',()=>{
  const source=readFileSync('product/source/src/studio-core.js','utf8');
  assert.match(source,/drawStrokeReplay\(ctx,o\.replay\)/);
  assert.match(source,/o\.type==='paint-session'\)\{return paintSessionWorldBounds\(o,parent\)\|\|originalBounds\(o,parent\);\}/);
});
