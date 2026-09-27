import test from 'node:test';
import assert from 'node:assert/strict';
import {ADVANCED_ADJUSTMENTS,ADVANCED_FILTERS,FILTER_GALLERY,LIQUIFY_OPERATIONS,applyAdvancedAdjustment,applyAdvancedFilter,liquifyRaster} from '../product/source/src/image/raster-processing-advanced.js';

const image=(w,h,rgba=[64,96,128,255])=>{const data=new Uint8ClampedArray(w*h*4);for(let i=0;i<w*h;i++)data.set(rgba,i*4);return{width:w,height:h,data};};
const set=(im,x,y,rgba)=>im.data.set(rgba,(y*im.width+x)*4);
const px=(im,x,y)=>[...im.data.slice((y*im.width+x)*4,(y*im.width+x)*4+4)];
const changed=(a,b)=>a.data.some((v,i)=>v!==b.data[i]);
const alphaEqual=(a,b)=>{for(let i=3;i<a.data.length;i+=4)assert.equal(a.data[i],b.data[i]);};
const impulse=()=>{const im=image(7,7,[0,0,0,255]);set(im,3,3,[255,255,255,255]);return im;};
const lut=(invert=false)=>{const size=2,data=[];for(let b=0;b<size;b++)for(let g=0;g<size;g++)for(let r=0;r<size;r++){const rgb=[r,g,b].map(v=>v/(size-1));data.push(...(invert?rgb.map(v=>1-v):rgb));}return{size,data};};

test('registry: required adjustment identifiers exist',()=>assert.deepEqual(ADVANCED_ADJUSTMENTS,['exposure','vibrance','blackWhite','photoFilter','channelMixer','colorLookup','invert','posterize','threshold','selectiveColor']));
test('registry: required filter identifiers and gallery descriptors exist',()=>{assert.deepEqual(ADVANCED_FILTERS,['motionBlur','median','unsharpMask','emboss','mosaic','minimum','maximum','reduceNoise']);assert.equal(FILTER_GALLERY.length,8);assert.deepEqual(LIQUIFY_OPERATIONS,['forwardWarp','twirl','pucker','bloat','reconstruct']);});

for(const [type,params] of [
 ['exposure',{exposure:1}],['vibrance',{amount:80}],['blackWhite',{}],['photoFilter',{color:'#ff8000',density:45}],
 ['channelMixer',{matrix:[[0,1,0],[0,0,1],[1,0,0]]}],['invert',{}],['posterize',{levels:3}],['threshold',{level:100}],['selectiveColor',{corrections:{blues:{blue:-40,red:30}}}]
])test(`adjustment ${type}: deterministic fixture changes RGB and preserves alpha`,()=>{const src=image(2,1,[40,100,180,77]),before=[...src.data],a=applyAdvancedAdjustment(src,{type,params}),b=applyAdvancedAdjustment(src,{type,params});assert.deepEqual([...a.data],[...b.data]);assert.ok(changed(src,a));assert.deepEqual([...src.data],before);alphaEqual(src,a);});

test('adjustment colorLookup: identity LUT is identity',()=>{const src=image(2,1,[64,128,192,99]),out=applyAdvancedAdjustment(src,{type:'colorLookup',params:{lut:lut(false)}});assert.ok(Math.abs(out.data[0]-64)<=1&&Math.abs(out.data[1]-128)<=1&&Math.abs(out.data[2]-192)<=1);assert.equal(out.data[3],99);});
test('adjustment colorLookup: non-identity LUT transforms color',()=>{const src=image(1,1,[10,60,200,111]),out=applyAdvancedAdjustment(src,{type:'colorLookup',params:{lut:lut(true)}});assert.ok(out.data[0]>200&&out.data[2]<80);assert.equal(out.data[3],111);});
test('adjustment opacity/mask contract blends per pixel',()=>{const src=image(2,1,[10,20,30,255]),mask={alpha:[255,0]},out=applyAdvancedAdjustment(src,{type:'invert',opacity:.5,mask});assert.deepEqual(px(out,1,0),px(src,1,0));assert.ok(out.data[0]>10&&out.data[0]<245);});

for(const [type,params] of [
 ['motionBlur',{distance:2,angle:0}],['median',{radius:1}],['unsharpMask',{radius:1,amount:150}],['emboss',{strength:1}],['mosaic',{size:3}],['minimum',{radius:1}],['maximum',{radius:1}],['reduceNoise',{radius:1,strength:80}]
])test(`filter ${type}: deterministic, immutable, alpha-preserving`,()=>{const src=impulse();set(src,2,2,[30,90,160,88]);const before=[...src.data],a=applyAdvancedFilter(src,{type,params}),b=applyAdvancedFilter(src,{type,params});assert.deepEqual([...a.data],[...b.data]);assert.deepEqual([...src.data],before);alphaEqual(src,a);assert.equal(a.width,src.width);assert.equal(a.height,src.height);assert.ok(changed(src,a));});

test('filter edge behavior is bounded at raster borders',()=>{const src=image(3,3,[0,0,0,255]);set(src,0,0,[255,255,255,255]);for(const type of ADVANCED_FILTERS){const params=type==='mosaic'?{size:2}:type==='motionBlur'?{distance:4,angle:45}:{radius:2};const out=applyAdvancedFilter(src,{type,params});assert.equal(out.data.length,src.data.length);assert.ok([...out.data].every(v=>Number.isInteger(v)&&v>=0&&v<=255));}});
test('filter opacity/mask contract leaves masked pixel untouched',()=>{const src=impulse(),mask={alpha:Array(49).fill(255)};mask.alpha[3*7+3]=0;const out=applyAdvancedFilter(src,{type:'emboss',mask});assert.deepEqual(px(out,3,3),px(src,3,3));});

function liquifyFixture(){const im=image(9,9,[0,0,0,255]);for(let y=2;y<=6;y++)for(let x=2;x<=6;x++)set(im,x,y,[x*25,y*25,180,255]);return im;}
for(const [type,extra] of [
 ['forwardWarp',{dx:2,dy:0,strength:1}],['twirl',{angle:45,strength:1}],['pucker',{strength:.8}],['bloat',{strength:.8}]
])test(`liquify ${type}: deterministic bounded displacement`,()=>{const src=liquifyFixture(),before=[...src.data],opts={operations:[{type,x:4,y:4,radius:4,...extra}]},a=liquifyRaster(src,opts),b=liquifyRaster(src,opts);assert.deepEqual([...a.data],[...b.data]);assert.deepEqual([...src.data],before);assert.equal(a.width,9);assert.equal(a.height,9);assert.ok(changed(src,a));});

test('liquify reconstruct moves displacement toward original',()=>{const src=liquifyFixture(),warp={type:'forwardWarp',x:4,y:4,radius:4,dx:2,dy:0,strength:1},warped=liquifyRaster(src,{operations:[warp]}),recon=liquifyRaster(src,{operations:[warp,{type:'reconstruct',x:4,y:4,radius:4,strength:1}]});const err=im=>[...im.data].reduce((s,v,i)=>s+Math.abs(v-src.data[i]),0);assert.ok(err(recon)<err(warped));});
test('liquify freeze mask protects frozen center pixel',()=>{const src=liquifyFixture(),freeze={alpha:Array(81).fill(0)};freeze.alpha[4*9+4]=255;const out=liquifyRaster(src,{freezeMask:freeze,operations:[{type:'forwardWarp',x:4,y:4,radius:4,dx:3,dy:0,strength:1}]});assert.deepEqual(px(out,4,4),px(src,4,4));});
test('liquify hard work limit guards operation',()=>assert.throws(()=>liquifyRaster(liquifyFixture(),{operations:[{type:'twirl',x:4,y:4,radius:4,strength:1}],maxWork:2}),/INK_LIQUIFY_WORK_LIMIT/));
test('liquify empty operation list is exact identity',()=>{const src=liquifyFixture(),out=liquifyRaster(src,{operations:[]});assert.deepEqual([...out.data],[...src.data]);});
test('Node contract rejects unsupported algorithms predictably',()=>{const src=image(1,1);assert.throws(()=>applyAdvancedAdjustment(src,{type:'levels'}),/INK_ADVANCED_ADJUSTMENT_UNSUPPORTED/);assert.throws(()=>applyAdvancedFilter(src,{type:'gaussianBlur'}),/INK_ADVANCED_FILTER_UNSUPPORTED/);assert.throws(()=>liquifyRaster(src,{operations:[{type:'faceWarp'}]}),/INK_LIQUIFY_OPERATION_UNSUPPORTED/);});
