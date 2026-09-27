import test from 'node:test';
import assert from 'node:assert/strict';
import {
  RETOUCH_METRICS,
  burn,
  cloneStamp,
  colorReplacementBrush,
  dodge,
  healingBrush,
  localBlur,
  localSharpen,
  patchRaster,
  patternStamp,
  sponge,
  spotHealing
} from '../product/source/src/image/raster-retouch-tools.js';

const image = (width, height, pixels) => ({ width, height, data: new Uint8ClampedArray(pixels.flat()) });
const px = (value, x, y = 0) => [...value.data.slice((y * value.width + x) * 4, (y * value.width + x) * 4 + 4)];
const grayLine = values => image(values.length, 1, values.map(value => [value, value, value, 255]));
const fullMask = (width, height = 1) => ({ width, height, alpha: Array(width * height).fill(255) });
const chroma = rgba => Math.max(...rgba.slice(0,3)) - Math.min(...rgba.slice(0,3));

test('clone stamp maps source offset to target and clips source/target edges', () => {
  const src = grayLine([10,20,30,100,110]);
  const result = cloneStamp(src, { sourcePoint:{x:1,y:0}, targetPoint:{x:3,y:0}, radius:1 });
  assert.deepEqual(px(result,2), [10,10,10,255]);
  assert.deepEqual(px(result,3), [20,20,20,255]);
  assert.deepEqual(px(result,4), [30,30,30,255]);
  const clipped = cloneStamp(src, { sourcePoint:{x:0,y:0}, targetPoint:{x:4,y:0}, radius:1 });
  assert.deepEqual(px(clipped,3), [100,100,100,255]);
  assert.deepEqual(px(clipped,4), [10,10,10,255]);
});

test('clone stamp opacity blends deterministically without mutating source', () => {
  const src = grayLine([0,100]); const original = [...src.data];
  const result = cloneStamp(src, { sourcePoint:{x:0,y:0}, targetPoint:{x:1,y:0}, radius:0, opacity:0.5 });
  assert.deepEqual(px(result,1), [50,50,50,255]);
  assert.deepEqual([...src.data], original);
});

test('pattern stamp tiles external pattern with deterministic origin', () => {
  const src = grayLine([0,0,0,0]);
  const pattern = grayLine([25,200]);
  const result = patternStamp(src, { pattern, targetPoint:{x:0,y:0}, mask:fullMask(4), origin:{x:0,y:0} });
  assert.deepEqual([px(result,0)[0],px(result,1)[0],px(result,2)[0],px(result,3)[0]], [25,200,25,200]);
});

test('healing copies source structure while adapting toward target tone and is deterministic', () => {
  const src = grayLine([10,20,30,100,110]); const original=[...src.data];
  const options = { sourcePoint:{x:1,y:0}, targetPoint:{x:3,y:0}, radius:1 };
  const a = healingBrush(src, options), b = healingBrush(src, options);
  assert.deepEqual([px(a,2)[0],px(a,3)[0],px(a,4)[0]], [70,80,90]);
  assert.deepEqual([...a.data], [...b.data]);
  assert.deepEqual([...src.data], original);
});

test('spot healing derives replacement from bounded neighbors and preserves outside pixels', () => {
  const src = grayLine([10,10,200,30,30]);
  const result = spotHealing(src, { targetPoint:{x:2,y:0}, radius:0, neighborRadius:1 });
  assert.deepEqual(px(result,2), [20,20,20,255]);
  assert.deepEqual(px(result,0), px(src,0));
  assert.deepEqual(px(result,4), px(src,4));
});

test('patch maps compatible source region to target and clips target boundary', () => {
  const src = grayLine([10,20,30,100,110,120]);
  const result = patchRaster(src, { sourceRegion:{x:0,y:0,w:2,h:1}, targetRegion:{x:4,y:0,w:2,h:1} });
  assert.deepEqual([px(result,4)[0], px(result,5)[0]], [10,20]);
  const clipped = patchRaster(src, { sourceRegion:{x:1,y:0,w:1,h:1}, targetRegion:{x:5,y:0,w:2,h:1} });
  assert.equal(px(clipped,5)[0], 20);
  assert.throws(() => patchRaster(src, { sourceRegion:{x:0,y:0,w:2,h:1}, targetRegion:{x:3,y:0,w:1,h:1} }), /INK_RETOUCH_PATCH_GEOMETRY_MISMATCH/);
});

test('dodge increases luminance and burn decreases luminance while preserving alpha', () => {
  const src = image(1,1,[[100,100,100,123]]);
  const dodged = dodge(src,{region:{x:0,y:0,w:1,h:1},strength:0.5});
  const burned = burn(src,{region:{x:0,y:0,w:1,h:1},strength:0.5});
  assert.ok(RETOUCH_METRICS.luminance(px(dodged,0)) > RETOUCH_METRICS.luminance(px(src,0)));
  assert.ok(RETOUCH_METRICS.luminance(px(burned,0)) < RETOUCH_METRICS.luminance(px(src,0)));
  assert.equal(px(dodged,0)[3],123); assert.equal(px(burned,0)[3],123);
});

test('sponge saturate increases chroma, desaturate decreases chroma, and alpha is preserved', () => {
  const src = image(1,1,[[120,100,100,77]]);
  const saturated = sponge(src,{region:{x:0,y:0,w:1,h:1},mode:'saturate',strength:1});
  const desaturated = sponge(src,{region:{x:0,y:0,w:1,h:1},mode:'desaturate',strength:1});
  assert.ok(chroma(px(saturated,0)) > chroma(px(src,0)));
  assert.ok(chroma(px(desaturated,0)) < chroma(px(src,0)));
  assert.equal(px(saturated,0)[3],77); assert.equal(px(desaturated,0)[3],77);
});

test('local blur changes only selected pixels using an immutable source pass', () => {
  const src = grayLine([0,255,0]);
  const result = localBlur(src,{region:{x:1,y:0,w:1,h:1},radius:1,strength:1});
  assert.equal(px(result,1)[0],85);
  assert.deepEqual(px(result,0),px(src,0)); assert.deepEqual(px(result,2),px(src,2));
});

test('local sharpen changes only selected pixels and remains byte-bounded', () => {
  const src = grayLine([100,200,100]);
  const result = localSharpen(src,{region:{x:1,y:0,w:1,h:1},radius:1,amount:1});
  assert.equal(px(result,1)[0],255);
  assert.deepEqual(px(result,0),px(src,0)); assert.deepEqual(px(result,2),px(src,2));
  assert.ok([...result.data].every(value => value >= 0 && value <= 255));
});

test('color replacement changes within tolerance, preserves outside pixels and alpha, and preserves known-fixture luminance', () => {
  const src = image(3,1,[[100,100,100,123],[104,104,104,123],[140,140,140,123]]);
  const result = colorReplacementBrush(src, {
    region:{x:0,y:0,w:3,h:1}, referenceColor:[100,100,100,123], replacementColor:'#00ff00', tolerance:4, strength:1
  });
  assert.notDeepEqual(px(result,0).slice(0,3), px(src,0).slice(0,3));
  assert.notDeepEqual(px(result,1).slice(0,3), px(src,1).slice(0,3));
  assert.deepEqual(px(result,2), px(src,2));
  assert.equal(px(result,0)[3],123);
  assert.ok(Math.abs(RETOUCH_METRICS.luminance(px(result,0)) - RETOUCH_METRICS.luminance(px(src,0))) <= 1);
});

test('global invariant: pixels outside mask remain unchanged and identical inputs produce identical outputs', () => {
  const src = image(3,1,[[10,20,30,40],[80,90,100,110],[130,140,150,160]]), original=[...src.data];
  const mask = {width:3,height:1,alpha:[0,255,0]};
  const a=dodge(src,{mask,strength:0.25}), b=dodge(src,{mask,strength:0.25});
  assert.deepEqual(px(a,0),px(src,0)); assert.deepEqual(px(a,2),px(src,2));
  assert.deepEqual([...a.data],[...b.data]); assert.deepEqual([...src.data],original);
});

test('invalid dimensions and options fail predictably', () => {
  assert.throws(() => cloneStamp({width:1,height:1,data:new Uint8ClampedArray(3)}, {sourcePoint:{x:0,y:0},targetPoint:{x:0,y:0}}), /INK_RETOUCH_IMAGE_DATA_INVALID/);
  assert.throws(() => sponge(grayLine([10]),{region:{x:0,y:0,w:1,h:1},mode:'invalid'}), /INK_RETOUCH_SPONGE_MODE_UNSUPPORTED/);
  assert.throws(() => patternStamp(grayLine([10]),{pattern:{width:1,height:1,data:new Uint8ClampedArray(3)},targetPoint:{x:0,y:0}}), /INK_RETOUCH_PATTERN_INVALID/);
});
