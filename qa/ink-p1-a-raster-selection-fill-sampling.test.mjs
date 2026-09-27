import test from 'node:test';
import assert from 'node:assert/strict';
import {
  magicWandSelection,
  polygonalLassoSelection,
  quickSelection,
  refineRasterSelection,
  sampleRasterColor
} from '../product/source/src/image/raster-selection-tools.js';
import { gradientFill, paintBucketFill } from '../product/source/src/image/raster-fill-tools.js';

const image = (width, height, pixels) => ({ width, height, data: new Uint8ClampedArray(pixels.flat()) });
const alphaAt = (selection, x, y) => selection.alpha[y * selection.width + x];
const rgbaAt = (value, x, y) => [...value.data.slice((y * value.width + x) * 4, (y * value.width + x) * 4 + 4)];

test('polygonal lasso uses bounded even-odd raster fill with predictable pixel-center boundary', () => {
  const selection = polygonalLassoSelection(4, 4, [{ x: -5, y: 0 }, { x: 3, y: 0 }, { x: 3, y: 3 }, { x: 0, y: 3 }]);
  assert.equal(alphaAt(selection, 1, 1), 255);
  assert.equal(alphaAt(selection, 3, 3), 0);
  assert.deepEqual(selection.bounds, { x: 0, y: 0, w: 3, h: 3 });
  const edge = polygonalLassoSelection(2, 1, [{ x: 0.5, y: 0 }, { x: 0.5, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 0 }]);
  assert.equal(alphaAt(edge, 0, 0), 255);
});

test('magic wand tolerance 0 is exact, positive tolerance is bounded, and contiguous differs from global scan', () => {
  const src = image(3, 1, [[10,10,10,255],[20,10,10,255],[10,10,10,255]]);
  assert.deepEqual(magicWandSelection(src, { x:0, y:0, tolerance:0, contiguous:true }).alpha, [255,0,0]);
  assert.deepEqual(magicWandSelection(src, { x:0, y:0, tolerance:0, contiguous:false }).alpha, [255,0,255]);
  assert.deepEqual(magicWandSelection(src, { x:0, y:0, tolerance:6, contiguous:true }).alpha, [255,255,255]);
});

test('magic wand color match is alpha-aware', () => {
  const src = image(2, 1, [[10,10,10,0],[10,10,10,255]]);
  assert.deepEqual(magicWandSelection(src, { x:0, y:0, tolerance:0, contiguous:false }).alpha, [255,0]);
});

test('quick selection composes add/subtract samples and enforces bounded work', () => {
  const src = image(4, 1, [[10,10,10,255],[10,10,10,255],[200,200,200,255],[200,200,200,255]]);
  const selection = quickSelection(src, { samples:[{x:0,y:0,mode:'add'},{x:3,y:0,mode:'add'},{x:2,y:0,mode:'subtract'}], tolerance:0 });
  assert.deepEqual(selection.alpha, [255,255,0,0]);
  assert.throws(() => quickSelection(src, { samples:[{x:0,y:0}], tolerance:255, maxVisited:2 }), /INK_QUICK_SELECTION_WORK_LIMIT/);
});

test('select-and-mask refinement reuses raster-mask authority for smooth feather expand and contract', () => {
  const single = { width:5, height:1, alpha:[0,0,255,0,0] };
  assert.deepEqual(refineRasterSelection(single, { expand:1 }).alpha, [0,255,255,255,0]);
  assert.deepEqual(refineRasterSelection({ width:5, height:1, alpha:[0,255,255,255,0] }, { contract:1 }).alpha, [0,0,255,0,0]);
  const feathered = refineRasterSelection(single, { feather:1 });
  assert.ok(feathered.alpha[1] > 0 && feathered.alpha[1] < 255);
  const smoothed = refineRasterSelection({ width:5, height:1, alpha:[0,255,0,255,0] }, { smooth:1 });
  assert.deepEqual(smoothed.alpha, [0,0,255,0,0]);
});

test('eyedropper samples exact RGBA and averages safely at canvas edge', () => {
  const src = image(2, 2, [[10,20,30,40],[20,30,40,50],[30,40,50,60],[40,50,60,70]]);
  assert.deepEqual(sampleRasterColor(src, { x:1, y:1 }).rgba, [40,50,60,70]);
  const average = sampleRasterColor(src, { x:0, y:0, radius:1 });
  assert.deepEqual(average.rgba, [25,35,45,55]);
  assert.equal(average.count, 4);
});

test('linear gradient hits endpoints and midpoint deterministically', () => {
  const gradient = gradientFill(3, 1, { type:'linear', start:{x:0,y:0}, end:{x:2,y:0}, stops:[{offset:0,color:'#000000'},{offset:1,color:'#ffffff'}] });
  assert.deepEqual(rgbaAt(gradient,0,0), [0,0,0,255]);
  assert.deepEqual(rgbaAt(gradient,1,0), [128,128,128,255]);
  assert.deepEqual(rgbaAt(gradient,2,0), [255,255,255,255]);
  const multi = gradientFill(5, 1, { type:'linear', start:{x:0,y:0}, end:{x:4,y:0}, stops:[{offset:0,color:'#000000'},{offset:0.5,color:'#ff0000'},{offset:1,color:'#ffffff'}] });
  assert.deepEqual(rgbaAt(multi,1,0), [128,0,0,255]);
  assert.deepEqual(rgbaAt(multi,2,0), [255,0,0,255]);
  assert.deepEqual(rgbaAt(multi,3,0), [255,128,128,255]);
  const halfOpacity = gradientFill(1, 1, { type:'linear', stops:[{offset:0,color:'#204060'},{offset:1,color:'#204060'}], opacity:0.5 });
  assert.deepEqual(rgbaAt(halfOpacity,0,0), [32,64,96,128]);
});

test('radial gradient maps center to first stop and radius edge to last stop', () => {
  const gradient = gradientFill(3, 3, { type:'radial', center:{x:1,y:1}, radius:1, stops:[{offset:0,color:'#ff0000'},{offset:1,color:'#0000ff'}] });
  assert.deepEqual(rgbaAt(gradient,1,1), [255,0,0,255]);
  assert.deepEqual(rgbaAt(gradient,2,1), [0,0,255,255]);
});

test('paint bucket preserves non-target pixels and does not mutate source', () => {
  const src = image(3, 1, [[10,10,10,255],[10,10,10,255],[200,200,200,255]]);
  const original = [...src.data];
  const result = paintBucketFill(src, { x:0, y:0, color:'#ff0000', tolerance:0 });
  assert.deepEqual(rgbaAt(result,0,0), [255,0,0,255]);
  assert.deepEqual(rgbaAt(result,1,0), [255,0,0,255]);
  assert.deepEqual(rgbaAt(result,2,0), [200,200,200,255]);
  assert.deepEqual([...src.data], original);
});

test('repeated identical inputs produce identical outputs and inputs remain immutable', () => {
  const src = image(2, 1, [[12,34,56,78],[90,87,65,43]]), original=[...src.data];
  const a = paintBucketFill(src,{x:0,y:0,color:[1,2,3,4],tolerance:0,contiguous:false});
  const b = paintBucketFill(src,{x:0,y:0,color:[1,2,3,4],tolerance:0,contiguous:false});
  assert.deepEqual([...a.data], [...b.data]);
  assert.deepEqual([...src.data], original);
});
