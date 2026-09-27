import test from 'node:test';
import assert from 'node:assert/strict';
import {probePsd,parsePsd,encodeFlattenedPsd} from '../product/source/src/image/formats/psd.js';
import {probeTiff,parseTiff,encodeBaselineTiff} from '../product/source/src/image/formats/tiff.js';
import {probeExr,parseExr,encodeBasicExr} from '../product/source/src/image/formats/exr.js';
import {createRawAdapterRegistry} from '../product/source/src/image/formats/adapters/raw-adapter.js';
import {probeFormat,decodeFormat,encodeFormat,rawAdapters} from '../product/source/src/image/format-interoperability.js';
import {createNormalizedPayload} from '../product/source/src/image/formats/normalized-payload.js';
import {decodePackBits,encodePackBits,asBytes} from '../product/source/src/image/formats/binary.js';
import {minimalIcc,rgb8Payload,psdFlat,psbFlat,layeredPsd,tiffBE,tiffPackBits,tiff16AlphaIcc,tiffUnspecifiedExtra,tiffAssociatedAlpha,exrFloat,exrHalf,exrAdditionalChannel,rawBytes} from './fixtures/p1-h/fixtures.mjs';

const clone=b=>new Uint8Array(b);

test('common normalized payload uses P1-G color raster and channel layout',()=>{const p=rgb8Payload({alpha:true});assert.equal(p.compositeRaster.type,'color-raster');assert.equal(p.channelLayout.type,'channel-layout');assert.equal(p.bitDepth,8);assert.equal(p.colorMode,'RGB');assert.equal(p.channelLayout.auxiliary.length,1);});
test('common ICC bytes are preserved and inspected',()=>{const icc=minimalIcc(),p=rgb8Payload({icc:true});assert.deepEqual([...p.icc.bytes],[...icc]);assert.equal(p.icc.inspection.versionMajor,4);});
test('common input copy helper is immutable',()=>{const b=Uint8Array.from([1,2,3]),c=asBytes(b);c[0]=9;assert.equal(b[0],1);});
test('packbits deterministic round trip',()=>{const b=Uint8Array.from([1,1,1,2,3,4,4,4,4,5]);assert.deepEqual([...decodePackBits(encodePackBits(b),b.length)],[...b]);});
test('packbits malformed rejected',()=>assert.throws(()=>decodePackBits(Uint8Array.from([2,1]),3),/OUT_OF_BOUNDS|TRUNCATED/));

test('PSD probe',()=>{const p=probePsd(psdFlat());assert.equal(p.format,'PSD');assert.equal(p.version,1);});
test('PSB probe',()=>{const p=probePsd(psbFlat());assert.equal(p.format,'PSB');assert.equal(p.version,2);});
test('PSD malformed header rejected',()=>assert.throws(()=>parsePsd(Uint8Array.from([56,66,80,83])),/OUT_OF_BOUNDS/));
test('PSD flattened round trip',()=>{const a=rgb8Payload({alpha:true}),b=encodeFlattenedPsd(a),d=parsePsd(b);assert.equal(d.width,2);assert.equal(d.height,1);assert.deepEqual([...d.compositeRaster.data],[...a.compositeRaster.data]);assert.deepEqual([...d.compositeRaster.alpha],[255,128]);});
test('PSD ICC preservation',()=>{const d=parsePsd(psdFlat({icc:true}));assert.equal(d.icc.bytes.length,132);assert.equal(d.icc.inspection.versionMajor,4);});
test('PSD bounded layer metadata',()=>{const d=parsePsd(layeredPsd());assert.equal(d.layers.length,1);assert.equal(d.layers[0].name,'L1');assert.equal(d.layers[0].channels.length,3);});
test('PSB 64-bit layer-mask section length path',()=>{const d=parsePsd(psbFlat());assert.equal(d.format,'PSB');assert.deepEqual([...d.compositeRaster.data],[1,2,3]);});
test('PSD unsupported compression explicit',()=>{const b=psdFlat(),v=new DataView(b.buffer,b.byteOffset,b.byteLength);let o=26;o+=4+v.getUint32(o,false);o+=4+v.getUint32(o,false);o+=4+v.getUint32(o,false);v.setUint16(o,2,false);const d=parsePsd(b);assert.equal(d.capabilities.composite.status,'decoder-required');assert.match(d.warnings.join(' '),/compression 2/);});
test('PSD encode is deterministic',()=>{const p=rgb8Payload({icc:true});assert.deepEqual([...encodeFlattenedPsd(p)],[...encodeFlattenedPsd(p)]);});
test('PSD input immutable after parse',()=>{const b=psdFlat(),before=clone(b);parsePsd(b);assert.deepEqual([...b],[...before]);});

test('TIFF little-endian probe',()=>{const p=probeTiff(encodeBaselineTiff(rgb8Payload()));assert.equal(p.byteOrder,'II');assert.equal(p.bigTiff,false);});
test('TIFF big-endian probe and decode',()=>{const b=tiffBE(),p=probeTiff(b),d=parseTiff(b);assert.equal(p.byteOrder,'MM');assert.deepEqual([...d.compositeRaster.data],[7,8,9]);});
test('TIFF malformed IFD rejected',()=>{const b=tiffBE();new DataView(b.buffer).setUint32(4,999999,false);assert.throws(()=>parseTiff(b),/OUT_OF_BOUNDS/);});
test('TIFF 16-bit alpha decode',()=>{const d=parseTiff(tiff16AlphaIcc());assert.equal(d.bitDepth,16);assert.deepEqual([...d.compositeRaster.data],[1000,2000,3000]);assert.deepEqual([...d.compositeRaster.alpha],[4000]);});
test('TIFF ICC preservation',()=>{const d=parseTiff(tiff16AlphaIcc());assert.equal(d.icc.bytes.length,132);});
test('TIFF orientation metadata',()=>{const d=parseTiff(tiff16AlphaIcc());assert.equal(d.orientation,3);});
test('TIFF PackBits decode',()=>{const d=parseTiff(tiffPackBits());assert.deepEqual([...d.compositeRaster.data],[10,20,30,40,50,60]);assert.equal(d.compression,'packbits');});
test('TIFF baseline encode/decode round trip',()=>{const p=rgb8Payload({alpha:true,icc:true}),d=parseTiff(encodeBaselineTiff(p));assert.deepEqual([...d.compositeRaster.data],[...p.compositeRaster.data]);assert.deepEqual([...d.compositeRaster.alpha],[...p.compositeRaster.alpha]);});
test('TIFF BigTIFF explicit adapter boundary',()=>{const b=new Uint8Array(16);b.set([73,73,43,0]);const d=parseTiff(b);assert.equal(d.version,'BigTIFF');assert.equal(d.capabilities.decode.status,'adapter-required');});
test('TIFF input immutable',()=>{const b=tiffBE(),before=clone(b);parseTiff(b);assert.deepEqual([...b],[...before]);});

test('RAW adapter policy rejects unlicensed adapter',()=>{const r=createRawAdapterRegistry();assert.throws(()=>r.register({browserCompatible:true,deterministic:true,probe(){},decode(){}}),/POLICY_REJECTED/);});
test('RAW decoder-unavailable status',()=>{const r=createRawAdapterRegistry(),p=r.probe(rawBytes);assert.equal(p.status,'decoder-unavailable');});
test('RAW unsupported-family status',()=>{const r=createRawAdapterRegistry();r.register({id:'x',browserCompatible:true,deterministic:true,license:'MIT',probe:()=>false,decode:async()=>null});assert.equal(r.probe(rawBytes).status,'unsupported-family');});
test('RAW adapter supported decode to 16-bit RGB',async()=>{const r=createRawAdapterRegistry();r.register({id:'qa',browserCompatible:true,deterministic:true,license:'QA fixture',probe:b=>String.fromCharCode(...b.slice(0,4))==='RAWT'?{family:'QA-RAW'}:false,decode:async()=>({family:'QA-RAW',width:1,height:1,bitDepth:16,data:Uint16Array.from([100,200,300]),sensor:{cfa:'RGGB'}})});const d=await r.decode(rawBytes);assert.equal(d.bitDepth,16);assert.equal(d.colorMode,'RGB');assert.deepEqual([...d.compositeRaster.data],[100,200,300]);assert.equal(d.metadata.raw.sensor.cfa,'RGGB');});
test('RAW adapter supported decode to 32-bit RGB HDR',async()=>{const r=createRawAdapterRegistry();r.register({id:'qa32',browserCompatible:true,deterministic:true,license:'QA fixture',probe:()=>true,decode:async()=>({width:1,height:1,bitDepth:32,data:Float32Array.from([2,.5,4])})});const d=await r.decode(rawBytes);assert.equal(d.compositeRaster.data[2],4);});
test('RAW preserves original bytes identity and opaque copy',async()=>{const r=createRawAdapterRegistry();r.register({id:'qa',browserCompatible:true,deterministic:true,license:'QA fixture',probe:()=>true,decode:async()=>({width:1,height:1,bitDepth:16,data:Uint16Array.from([1,2,3])})});const d=await r.decode(rawBytes);assert.deepEqual([...d.opaque.originalBytes],[...rawBytes]);assert.match(d.metadata.raw.originalByteIdentity,/fnv1a:/);});
test('RAW export explicitly not required',()=>assert.throws(()=>encodeFormat('RAW',rgb8Payload()),/RAW_EXPORT_NOT_REQUIRED/));

test('EXR probe',()=>{const p=probeExr(exrFloat());assert.equal(p.format,'EXR');});
test('EXR FLOAT preserves HDR above 1',()=>{const d=parseExr(exrFloat());assert.equal(d.bitDepth,32);assert.equal(d.compositeRaster.data[0],2.5);assert.equal(d.compositeRaster.data[3],4);});
test('EXR alpha preserved',()=>{const d=parseExr(exrFloat());assert.deepEqual([...d.compositeRaster.alpha],[1,.5]);});
test('EXR chromaticities metadata',()=>{const d=parseExr(exrFloat());assert.equal(d.metadata.exr.chromaticities.length,8);assert.ok(Math.abs(d.metadata.exr.chromaticities[0]-.64)<1e-5);});
test('EXR HALF decode',()=>{const d=parseExr(exrHalf());assert.ok(Math.abs(d.compositeRaster.data[0]-1.5)<.01);});
test('EXR basic FLOAT encode/decode round trip',()=>{const p=createNormalizedPayload({format:'x',width:1,height:1,bitDepth:32,colorMode:'RGB',data:Float32Array.from([8,2,.25]),alpha:Float32Array.from([.75])}),d=parseExr(encodeBasicExr(p));assert.equal(d.compositeRaster.data[0],8);assert.equal(d.compositeRaster.alpha[0],.75);});
test('EXR malformed truncated rejected',()=>assert.throws(()=>parseExr(exrFloat().slice(0,20)),/OUT_OF_BOUNDS|CSTRING/));
test('EXR special compression explicit',()=>{const b=exrFloat();let o=8;while(b[o]){let e=o;while(b[e])e++;const name=String.fromCharCode(...b.slice(o,e));o=e+1;while(b[o])o++;o++;const size=new DataView(b.buffer,b.byteOffset,b.byteLength).getUint32(o,true);o+=4;if(name==='compression'){b[o]=3;break;}o+=size;}const d=parseExr(b);assert.equal(d.capabilities.decode.status,'decoder-required');});
test('EXR input immutable',()=>{const b=exrHalf(),before=clone(b);parseExr(b);assert.deepEqual([...b],[...before]);});

test('facade probes PSD',()=>assert.equal(probeFormat(psdFlat()).format,'PSD'));
test('facade probes TIFF',()=>assert.equal(probeFormat(tiffBE()).format,'TIFF'));
test('facade probes EXR',()=>assert.equal(probeFormat(exrHalf()).format,'EXR'));
test('facade decode routes PSD',async()=>assert.equal((await decodeFormat(psdFlat())).format,'PSD'));
test('facade encode routes TIFF',()=>assert.equal(probeTiff(encodeFormat('TIFF',rgb8Payload())).matched,true));
test('PSB encode explicitly adapter-required',()=>assert.throws(()=>encodeFormat('PSB',rgb8Payload()),/ADAPTER_REQUIRED/));
test('32-bit normalized payload uses Float32Array without hidden 8-bit conversion',()=>{const p=createNormalizedPayload({format:'x',width:1,height:1,bitDepth:32,colorMode:'RGB',data:Float32Array.from([5,-1,.5])});assert.ok(p.compositeRaster.data instanceof Float32Array);assert.deepEqual([...p.compositeRaster.data],[5,-1,.5]);});

test('TIFF ExtraSamples=0 stays non-alpha additional data',()=>{const d=parseTiff(tiffUnspecifiedExtra());assert.equal(d.compositeRaster.alpha,null);assert.equal(d.channelLayout.auxiliary.length,0);assert.equal(d.additionalChannels.length,1);assert.equal(d.additionalChannels[0].semantics,'tiff-extra-unspecified');assert.deepEqual([...d.additionalChannels[0].data],[255,128]);assert.deepEqual(d.metadata.tiff.extraSamples,[0]);});
test('TIFF ExtraSamples=1 associated alpha is normalized to straight alpha',()=>{const d=parseTiff(tiffAssociatedAlpha());assert.deepEqual([...d.compositeRaster.data],[60,120,180]);assert.deepEqual([...d.compositeRaster.alpha],[85]);assert.equal(d.metadata.tiff.alphaAssociation,'associated');assert.match(d.warnings.join(' '),/associated alpha/);assert.equal(d.losses.length,1);});
test('TIFF ExtraSamples=2 remains unassociated alpha',()=>{const d=parseTiff(tiff16AlphaIcc());assert.equal(d.metadata.tiff.alphaAssociation,'unassociated');assert.equal(d.additionalChannels.length,0);});
test('TIFF encoder refuses unspecified additional channels instead of dropping them',()=>{const d=parseTiff(tiffUnspecifiedExtra());assert.throws(()=>encodeBaselineTiff(d),/ADDITIONAL_CHANNELS_UNSUPPORTED/);});
test('EXR additional channel is preserved without alpha misclassification',()=>{const d=parseExr(exrAdditionalChannel());assert.deepEqual([...d.compositeRaster.alpha],[.75]);assert.equal(d.channelLayout.auxiliary.length,1);assert.equal(d.channelLayout.auxiliary[0].kind,'alpha');assert.equal(d.additionalChannels.length,1);assert.equal(d.additionalChannels[0].name,'Z');assert.equal(d.additionalChannels[0].semantics,'exr-channel');assert.deepEqual([...d.additionalChannels[0].data],[42]);assert.equal(d.metadata.exr.additionalChannels[0].name,'Z');});
test('EXR encoder refuses additional channels instead of silently dropping them',()=>{const d=parseExr(exrAdditionalChannel());assert.throws(()=>encodeBasicExr(d),/ADDITIONAL_CHANNELS_UNSUPPORTED/);});
