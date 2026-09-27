import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, sanitizeDocument, documentColorStateFromPayload } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import {
  addRulerGuide, moveRulerGuide, setRulerGuideLocked, setRulerGuideVisibility,
  resolveSnappedTranslation, resolveSnappedRotation,
  createProjectiveTransform, layoutParagraphText, measurePoints, measureBounds,
  normalizeGradientFill, normalizePatternFill
} from '../product/source/src/editor/index.js';
import {
  IMAGE_CAPABILITIES, createAdjustment, createFilter, createLiquifyFilter, renderImageStack,
  createLayerEffect, applyLayerEffects, magicWandSelection, objectSelection, gradientFill, cloneStamp,
  createColorRaster, serializeColorRaster, deserializeColorRaster, colorRasterToRgba8,
  createNormalizedPayload, formatPayloadToDocumentImageState, documentImageStateToFormatPayload,
  encodeFormat, decodeFormat
} from '../product/source/src/image/image-core.js';
import { installStudioCore } from '../product/source/src/studio-core.js';
import { readFileSync } from 'node:fs';

const rgba=(values,width=2,height=1)=>({width,height,data:new Uint8ClampedArray(values)});

test('FORMAT_VERSION remains authorized baseline',()=>assert.equal(FORMAT_VERSION,4));

test('Document owns persistent guide, snap and color defaults',()=>{
  const doc=defaultDocument(),page=doc.pages[0];
  assert.deepEqual(page.guides,[]);
  assert.equal(page.snap.enabled,true);
  assert.equal(page.snap.categories.angle,true);
  assert.equal(page.snap.categories.grid,false);
  assert.equal(doc.colorState.bitDepth,8);
  assert.equal(doc.colorState.colorMode,'RGB');
});

test('migration preserves persistent guide/snap/color state without version bump',()=>{
  const raw=defaultDocument(),page=raw.pages[0];
  page.guides=[{id:'g1',orientation:'vertical',position:12,locked:true,visible:false}];
  page.snap={enabled:true,categories:{guides:true,edges:false,centers:true,grid:true,angle:false,equalDistance:true},tolerance:9,hysteresis:3,angleStep:30};
  raw.colorState={bitDepth:16,colorMode:'CMYK',channelLayout:{type:'channel-layout',process:[],auxiliary:[{kind:'spot',name:'Spot'}]}};
  const migrated=sanitizeDocument(JSON.parse(JSON.stringify(raw)));
  assert.equal(migrated.formatVersion,4);
  assert.deepEqual(migrated.pages[0].guides,page.guides);
  assert.equal(migrated.pages[0].snap.categories.grid,true);
  assert.equal(migrated.pages[0].snap.categories.edges,false);
  assert.equal(migrated.colorState.bitDepth,16);
  assert.equal(migrated.colorState.colorMode,'CMYK');
  assert.equal(migrated.colorState.channelLayout.auxiliary[0].kind,'spot');
});

test('guide mutations converge through one guide authority',()=>{
  let guides=[];
  guides=addRulerGuide(guides,{id:'g1',orientation:'horizontal',position:20});
  guides=moveRulerGuide(guides,'g1',30);
  guides=setRulerGuideLocked(guides,'g1',true);
  guides=setRulerGuideVisibility(guides,'g1',false);
  assert.deepEqual(guides,[{id:'g1',orientation:'horizontal',position:30,locked:true,visible:false}]);
  assert.throws(()=>moveRulerGuide(guides,'g1',40),/GUIDE_LOCKED/);
});

test('History undo/redo restores guide state through Document patches',()=>{
  const doc=defaultDocument(),app={doc,replaceDocument(next){this.doc=next;},markDirty(){},updateHistoryUI(){}};
  const history=new HistoryManager(app,30),path=['pages',0,'guides'];
  history.pushScoped('guide',[path],()=>{app.doc.pages[0].guides=addRulerGuide(app.doc.pages[0].guides,{id:'g1',orientation:'vertical',position:15});});
  assert.equal(app.doc.pages[0].guides.length,1);
  assert.equal(history.undo(),true);
  assert.equal(app.doc.pages[0].guides.length,0);
  assert.equal(history.redo(),true);
  assert.equal(app.doc.pages[0].guides[0].position,15);
});

test('unified snap authority composes guide, peer edge/center, grid and bypass',()=>{
  const base={x:10,y:10,w:20,h:20},peers=[{x:50,y:10,w:20,h:20}];
  let r=resolveSnappedTranslation({movingBounds:base,delta:{x:17,y:0},peerBounds:peers,guides:[{id:'g',orientation:'vertical',position:48,visible:true}],snapSettings:{categories:{guides:true,edges:false,centers:false,equalDistance:false,grid:false}},cameraScale:1});
  assert.equal(r.delta.x,18);
  assert.equal(r.evidence.x.type,'guide');
  r=resolveSnappedTranslation({movingBounds:base,delta:{x:19,y:0},peerBounds:peers,snapSettings:{categories:{guides:false,edges:true,centers:true,equalDistance:false,grid:false}},cameraScale:1});
  assert.equal(r.snapped.x,true);
  r=resolveSnappedTranslation({movingBounds:base,delta:{x:5,y:5},gridSize:16,snapSettings:{categories:{guides:false,edges:false,centers:false,equalDistance:false,grid:true}},cameraScale:1});
  assert.equal(r.snapped.x,true);
  const bypass=resolveSnappedTranslation({movingBounds:base,delta:{x:17,y:0},guides:[{id:'g',orientation:'vertical',position:48,visible:true}],snapSettings:{},cameraScale:1,bypass:true});
  assert.deepEqual(bypass.delta,{x:17,y:0});
  assert.equal(bypass.snapped.x,false);
});

test('snap hysteresis retains prior candidate inside hold window',()=>{
  const settings={tolerance:2,hysteresis:3,categories:{guides:true,edges:false,centers:false,equalDistance:false,grid:false}};
  const first=resolveSnappedTranslation({movingBounds:{x:0,y:0,w:10,h:10},delta:{x:9,y:0},guides:[{id:'g1',orientation:'vertical',position:20}],snapSettings:settings,cameraScale:1});
  assert.equal(first.evidence.x.targetId,'g1');
  const second=resolveSnappedTranslation({movingBounds:{x:0,y:0,w:10,h:10},delta:{x:6,y:0},guides:[{id:'g1',orientation:'vertical',position:20}],snapSettings:settings,cameraScale:1,previousEvidence:first.evidence});
  assert.equal(second.evidence.x.targetId,'g1');
});

test('angle snap and temporary bypass use Transform authority',()=>{
  const radians=14*Math.PI/180;
  const snapped=resolveSnappedRotation(radians,{snapSettings:{angleStep:15,categories:{angle:true}}});
  assert.ok(Math.abs(snapped.angle-15*Math.PI/180)<1e-12);
  const bypass=resolveSnappedRotation(radians,{snapSettings:{angleStep:15,categories:{angle:true}},bypass:true});
  assert.equal(bypass.angle,radians);
});

test('P1-C advanced transform and text layout are exposed by editor facade',()=>{
  const h=createProjectiveTransform([{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],[{x:0,y:0},{x:2,y:0},{x:2,y:2},{x:0,y:2}]);
  assert.equal(h.length,9);
  const layout=layoutParagraphText({type:'text',text:'INK integration',fontSize:10,lineHeight:1,textBox:{width:100,height:30},paragraphAlign:'left'});
  assert.equal(layout.mode,'paragraph');
});

test('P1-C measurement and vector fill appearance are exposed by editor facade',()=>{
  const point=measurePoints({x:0,y:0},{x:3,y:4});
  assert.equal(point.distance,5);
  const bounds=measureBounds({x:2,y:3,w:40,h:20});
  assert.equal(bounds.width,40);
  assert.equal(bounds.height,20);
  const gradient=normalizeGradientFill({type:'linear',start:{x:0,y:0},end:{x:1,y:0},stops:[{offset:0,color:'#000000'},{offset:1,color:'#ffffff'}]});
  assert.equal(gradient.mode,'gradient');
  const pattern=normalizePatternFill({patternRef:'pattern:1',origin:{x:1,y:2},scale:{x:2,y:3},rotation:15,repeat:'repeat'});
  assert.equal(pattern.mode,'pattern');
});

test('persistent Document guides are wired into renderer overlay',()=>{
  const source=readFileSync(new URL('../product/source/src/ink.js',import.meta.url),'utf8');
  assert.match(source,/page\.guides\|\|\[\]/);
  assert.match(source,/guide\.orientation==='vertical'\?'x':'y'/);
});

test('P1 A/B/E raster providers are exposed through the existing image authority',()=>{
  const image=rgba([10,10,10,255,240,240,240,255]);
  assert.equal(magicWandSelection(image,{x:0,y:0,tolerance:1}).width,2);
  assert.equal(gradientFill(2,1,{from:{x:0,y:0},to:{x:1,y:0},stops:[{offset:0,color:[0,0,0,255]},{offset:1,color:[255,255,255,255]}]}).width,2);
  assert.equal(cloneStamp(image,{sourcePoint:{x:0,y:0},targetPoint:{x:1,y:0},radius:0}).width,2);
});

test('P1-D effects and P1-E advanced selection remain on the existing image authority',()=>{
  const source=rgba([10,20,30,255,40,50,60,255]);
  const effect=createLayerEffect('colorOverlay',{color:'#ff0000'});
  const rendered=applyLayerEffects(source,[effect]);
  assert.equal(rendered.width,2);
  const selected=objectSelection(source,{roi:{x:0,y:0,w:2,h:1},seed:{x:0,y:0},colorThreshold:64,edgeThreshold:255,alphaThreshold:1,minComponentSize:1});
  assert.equal(selected.width,2);
});

test('P1-F advanced adjustment/filter and Liquify register in the existing stack',()=>{
  assert.ok(IMAGE_CAPABILITIES.adjustments.includes('exposure'));
  assert.ok(IMAGE_CAPABILITIES.filters.includes('median'));
  assert.ok(IMAGE_CAPABILITIES.filters.includes('liquify'));
  const source=rgba([50,60,70,255,90,100,110,255]),before=Array.from(source.data);
  const out=renderImageStack(source,{adjustments:[createAdjustment('exposure',{exposure:1})],filters:[createFilter('median',{radius:1})]});
  assert.equal(out.width,2);
  assert.deepEqual(Array.from(source.data),before);
  const liquify=createLiquifyFilter([{type:'forwardWarp',x:0,y:0,radius:2,strength:0.5,dx:1,dy:0}],{maxWork:128});
  assert.equal(liquify.type,'liquify');
});

test('P1-G 16/32-bit raster serialization preserves source data and bounded preview is explicit',()=>{
  const r16=createColorRaster({width:1,height:1,bitDepth:16,colorMode:'RGB',data:[65535,32768,0],alpha:[65535]});
  const state16=serializeColorRaster(r16),round16=deserializeColorRaster(JSON.parse(JSON.stringify(state16)));
  assert.deepEqual(Array.from(round16.data),[65535,32768,0]);
  const preview=colorRasterToRgba8(state16);
  assert.equal(preview.status,'ok');
  assert.equal(preview.imageData.data[0],255);
  const r32=createColorRaster({width:1,height:1,bitDepth:32,colorMode:'RGB',data:[2,-0.5,0.25],alpha:[1]});
  const state32=serializeColorRaster(r32),round32=deserializeColorRaster(JSON.parse(JSON.stringify(state32)));
  assert.deepEqual(Array.from(round32.data),[2,-0.5,0.25]);
  assert.deepEqual(Array.from(colorRasterToRgba8(state32).imageData.data),[255,0,64,255]);
  const multi=createColorRaster({width:1,height:1,bitDepth:8,colorMode:'Multichannel',channelCount:2,channelNames:['A','B'],data:[1,2]});
  assert.equal(colorRasterToRgba8(serializeColorRaster(multi)).status,'unsupported-render');
});

test('P1-H payload bridge preserves bit depth, spot/additional metadata and one INK image truth',()=>{
  const raster=createColorRaster({width:1,height:1,bitDepth:16,colorMode:'RGB',data:[100,200,300],alpha:[400]});
  const payload=createNormalizedPayload({format:'TIFF',width:1,height:1,bitDepth:16,colorMode:'RGB',compositeRaster:raster,alpha:raster.alpha,spotChannels:[{name:'Spot',data:[500],previewColor:[255,0,0],solidity:.7}],additionalChannels:[{name:'Extra',kind:'unspecified',data:[600]}],metadata:{tag:'kept'}});
  const state=formatPayloadToDocumentImageState(payload);
  const restored=documentImageStateToFormatPayload(JSON.parse(JSON.stringify(state)),{format:'TIFF'});
  assert.equal(restored.bitDepth,16);
  assert.equal(restored.channels.auxiliary.some(channel=>channel.kind==='spot'&&channel.name==='Spot'),true);
  assert.equal(restored.additionalChannels[0].name,'Extra');
  assert.equal(restored.metadata.tag,'kept');
  assert.equal(documentColorStateFromPayload(restored).bitDepth,16);
});

test('P1-H TIFF encode/decode consumes frozen P1-G normalized contract',async()=>{
  const raster=createColorRaster({width:1,height:1,bitDepth:8,colorMode:'RGB',data:[10,20,30],alpha:[255]});
  const payload=createNormalizedPayload({format:'TIFF',width:1,height:1,bitDepth:8,colorMode:'RGB',compositeRaster:raster,alpha:raster.alpha});
  const bytes=encodeFormat('TIFF',payload);
  const decoded=await decodeFormat(bytes);
  assert.equal(decoded.format,'TIFF');
  assert.equal(decoded.bitDepth,8);
  assert.equal(decoded.colorMode,'RGB');
});

test('JSON save/load + sanitize preserves P1 document state and raster payload',()=>{
  const doc=defaultDocument(),payload=createNormalizedPayload({format:'TIFF',width:1,height:1,bitDepth:8,colorMode:'RGB',data:[1,2,3],alpha:[255]});
  doc.pages[0].guides=addRulerGuide([],{id:'g',orientation:'vertical',position:10});
  doc.pages[0].layers[0].objects.push({id:'img',type:'image',name:'img',matrix:[1,0,0,1,0,0],opacity:1,w:1,h:1,rasterState:formatPayloadToDocumentImageState(payload)});
  doc.colorState=documentColorStateFromPayload(payload);
  const reopened=sanitizeDocument(JSON.parse(JSON.stringify(doc)));
  assert.equal(reopened.pages[0].guides[0].position,10);
  assert.equal(reopened.pages[0].layers[0].objects[0].rasterState.colorRaster.data[2],3);
  assert.equal(reopened.colorState.colorMode,'RGB');
});

test('renderer module imports with the existing renderer authority',()=>assert.equal(typeof installStudioCore,'function'));
