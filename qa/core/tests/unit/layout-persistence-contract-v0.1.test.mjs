import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix } from '../../../../product/source/src/core/index.js';
import {
  defaultDocument, createFrame, findPageObject, migrateDocument, inspectDocument,
  LAYOUT_SCHEMA, LAYOUT_ITEM_SCHEMA, normalizeFrameLayout, normalizeLayoutItem,
  evaluateFrameLayout, evaluateResizeConstraints, inspectLayouts, setFrameLayout, setChildLayoutItem,
  FILE_ENVELOPE_SCHEMA, FILE_ENVELOPE_VERSION, declaredDocumentExtensions,
  wrapInkFile, unwrapInkFile, inspectInkFileEnvelope, nextInkFileRevision
} from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { InkStore } from '../../../../product/source/src/document/storage.js';
import { vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';
import { resolveComponentInstance, registerComponentDefinition, createComponentInstance, detachComponentInstance } from '../../../../product/source/src/document/components.js';

const shape = (id,w=20,h=10,x=0,y=0) => ({id,type:'shape',shape:'rect',w,h,matrix:Matrix.translate(x,y),opacity:1,color:'#000',fill:true});
function fixture() {
  const doc=defaultDocument(),page=doc.pages[0],layer=page.layers[0];
  const frame=createFrame({id:'frame',width:200,height:100,children:[shape('a',20,10),shape('b',30,20),shape('c',40,30,7,8)]});
  layer.objects.push(frame);
  const app={doc,history:null,spatialDirty:false,refreshes:0,markDirty(){},updateHistoryUI(){},refreshAll(){this.refreshes++;},replaceDocument(next){this.doc=next;}};
  app.history=new HistoryManager(app);
  return {app,doc,page,layer,frame};
}
const fullLayout = extra => ({schema:LAYOUT_SCHEMA,mode:'horizontal',gap:10,padding:{top:5,right:6,bottom:7,left:8},align:{main:'start',cross:'start'},sizing:{horizontal:'fixed',vertical:'fixed'},...extra});
const fullItem = extra => ({schema:LAYOUT_ITEM_SCHEMA,participation:'flow',sizing:{horizontal:'hug',vertical:'hug'},fixedSize:{width:1,height:1},constraints:{horizontal:'start',vertical:'start'},...extra});

test('format-4 Frame without layout remains exact no-layout behavior',()=>{
  const f=fixture(),before=structuredClone(f.doc),plan=evaluateFrameLayout(f.frame);
  assert.equal(plan.status,'no-layout');assert.deepEqual(f.doc,before);
  const migrated=migrateDocument(f.doc);assert.equal(findPageObject(migrated.pages[0],'frame').object.layout,undefined);
  assert.equal(migrated.formatVersion,4);assert.equal(inspectDocument(migrated).passed,true);
});

test('known layout fields normalize deterministically while future fields survive',()=>{
  const layout=normalizeFrameLayout({schema:LAYOUT_SCHEMA,mode:'grid-future',gap:-4,padding:{top:-1,futurePad:9},align:{main:'bad'},sizing:{horizontal:'bad'},future:{tracks:3}});
  assert.equal(layout.mode,'manual');assert.equal(layout.gap,0);assert.equal(layout.padding.top,0);
  assert.equal(layout.padding.futurePad,9);assert.deepEqual(layout.future,{tracks:3});
  const item=normalizeLayoutItem({schema:LAYOUT_ITEM_SCHEMA,participation:'bad',sizing:{horizontal:'future'},constraints:{vertical:'bad'},futureItem:true});
  assert.equal(item.participation,'flow');assert.equal(item.sizing.horizontal,'hug');assert.equal(item.constraints.vertical,'start');assert.equal(item.futureItem,true);
});

test('migration normalizes known schema and preserves unknown future extension fields',()=>{
  const f=fixture();f.frame.layout={schema:LAYOUT_SCHEMA,mode:'bad',gap:-2,padding:{future:1},align:{future:'x'},sizing:{future:'y'},futureLayout:{x:1}};
  f.frame.children[0].layoutItem={schema:LAYOUT_ITEM_SCHEMA,participation:'bad',sizing:{future:'x'},fixedSize:{future:2},constraints:{future:'y'},futureChild:[1,2]};
  const migrated=migrateDocument(f.doc),frame=findPageObject(migrated.pages[0],'frame').object;
  assert.equal(frame.layout.mode,'manual');assert.equal(frame.layout.gap,0);assert.deepEqual(frame.layout.futureLayout,{x:1});assert.equal(frame.layout.padding.future,1);
  assert.equal(frame.children[0].layoutItem.participation,'flow');assert.deepEqual(frame.children[0].layoutItem.futureChild,[1,2]);
  assert.deepEqual(inspectLayouts(migrated),[]);
});

test('Frame is sole layout-container authority; Group and Repeat are not reclassified',()=>{
  const f=fixture(),group={id:'g',type:'group',matrix:Matrix.identity(),opacity:1,children:[],layout:fullLayout()},repeat={id:'r',type:'repeat',matrix:Matrix.identity(),opacity:1,source:shape('rs'),instances:[],layout:fullLayout()};
  f.layer.objects.push(group,repeat);
  const codes=inspectLayouts(f.doc).map(x=>x.code);assert.equal(codes.filter(x=>x==='layout-non-frame-container').length,2);
  assert.equal(group.type,'group');assert.equal(repeat.type,'repeat');assert.throws(()=>evaluateFrameLayout(group),{code:'layout-frame-required'});
});

test('horizontal flow resolves hug/fixed/fill, padding, gap and cross alignment without mutation',()=>{
  const f=fixture(),before=structuredClone(f.frame);
  f.frame.layout=fullLayout({align:{main:'start',cross:'center'}});
  f.frame.children[0].layoutItem=fullItem();
  f.frame.children[1].layoutItem=fullItem({sizing:{horizontal:'fixed',vertical:'fixed'},fixedSize:{width:50,height:40}});
  f.frame.children[2].layoutItem=fullItem({sizing:{horizontal:'fill',vertical:'hug'}});
  const plan=evaluateFrameLayout(f.frame);
  assert.equal(plan.status,'resolved');assert.deepEqual(plan.items.map(x=>x.objectId),['a','b','c']);
  assert.deepEqual(plan.items.map(x=>x.width),[20,50,96]);
  assert.deepEqual(plan.items.map(x=>x.x),[8,38,98]);
  assert.deepEqual(plan.items.map(x=>x.y),[44,29,34]);
  assert.deepEqual(f.frame,{...before,layout:f.frame.layout,children:f.frame.children});
  assert.deepEqual(f.frame.children.map(x=>x.matrix.slice(4)),[[0,0],[0,0],[7,8]]);
});

test('vertical flow keeps absolute children out and computes hug container intent',()=>{
  const f=fixture();f.frame.layout=fullLayout({mode:'vertical',gap:4,sizing:{horizontal:'hug',vertical:'hug'},align:{main:'end',cross:'stretch'}});
  f.frame.children[2].layoutItem=fullItem({participation:'absolute'});
  const plan=evaluateFrameLayout(f.frame);
  assert.deepEqual(plan.items.map(x=>x.objectId),['a','b']);assert.deepEqual(plan.absoluteObjectIds,['c']);
  assert.deepEqual(plan.items.map(x=>x.width),[20,30]);
  assert.deepEqual(plan.frameSize,{width:44,height:46});
  assert.deepEqual(f.frame.children[2].matrix,Matrix.translate(7,8));
});

test('resize constraints express start/end/center/scale/stretch without changing matrices',()=>{
  const f=fixture(),intents=[['start','start'],['end','center'],['scale','stretch']];
  f.frame.children.forEach((child,i)=>child.layoutItem=fullItem({constraints:{horizontal:intents[i][0],vertical:intents[i][1]}}));
  f.frame.children[0].matrix=Matrix.translate(10,10);f.frame.children[1].matrix=Matrix.translate(150,40);f.frame.children[2].matrix=Matrix.translate(50,20);
  const before=f.frame.children.map(x=>[...x.matrix]);const plan=evaluateResizeConstraints(f.frame,{previousWidth:200,previousHeight:100,width:300,height:150});
  assert.deepEqual(plan.items.map(x=>[x.x,x.y,x.width,x.height]),[[10,10,20,10],[250,65,30,20],[75,20,60,80]]);
  assert.deepEqual(f.frame.children.map(x=>x.matrix),before);
});

test('layout History commands are atomic, undoable and reject busy/invalid targets before mutation',()=>{
  const f=fixture();setFrameLayout(f.app,'frame',{mode:'horizontal',gap:12,future:true});
  assert.equal(f.frame.layout.schema,LAYOUT_SCHEMA);assert.equal(f.frame.layout.future,true);assert.equal(f.app.spatialDirty,true);
  setChildLayoutItem(f.app,'a',{participation:'absolute',constraints:{horizontal:'end'}});assert.equal(f.frame.children[0].layoutItem.participation,'absolute');
  f.app.history.undo();assert.equal(f.frame.children[0].layoutItem,undefined);f.app.history.redo();assert.equal(f.frame.children[0].layoutItem.participation,'absolute');
  setFrameLayout(f.app,'frame',null);assert.equal(f.frame.layout,undefined);f.app.history.undo();assert.equal(f.frame.layout.mode,'horizontal');
  const before=JSON.stringify(f.doc),count=f.app.history.undoStack.length;
  assert.throws(()=>setFrameLayout(f.app,'a',{}),{code:'layout-frame-required'});
  assert.throws(()=>setChildLayoutItem(f.app,'frame',{}),{code:'layout-item-frame-parent-required'});
  assert.equal(JSON.stringify(f.doc),before);assert.equal(f.app.history.undoStack.length,count);assert.equal(f.app.history.pending,null);
  f.app.history.begin('external');const pending=f.app.history.pending;
  assert.throws(()=>setFrameLayout(f.app,'frame',{}),{code:'layout-history-busy'});assert.equal(f.app.history.pending,pending);f.app.history.cancel();
});

test('layout metadata keeps child identity/ownership and singular transforms untouched',()=>{
  const f=fixture();f.frame.matrix=Matrix.scale(0,1);const ids=f.frame.children.map(x=>x.id),parents=f.frame.children.map(x=>x.parentId),matrices=f.frame.children.map(x=>[...x.matrix]);
  setFrameLayout(f.app,'frame',{mode:'horizontal'});setChildLayoutItem(f.app,'a',{sizing:{horizontal:'fill'}});
  evaluateFrameLayout(f.frame);
  assert.deepEqual(f.frame.children.map(x=>x.id),ids);assert.deepEqual(f.frame.children.map(x=>x.parentId),parents);assert.deepEqual(f.frame.children.map(x=>x.matrix),matrices);assert.deepEqual(f.frame.matrix,Matrix.scale(0,1));
});

test('integrity diagnoses malformed raw layout and accepts normalized save/load data',()=>{
  const f=fixture();f.frame.layout={schema:LAYOUT_SCHEMA,mode:'sideways',gap:-1};f.frame.children[0].layoutItem={schema:'future-layout-item'};
  const raw=inspectDocument(f.doc);assert.ok(raw.warnings.some(x=>x.code==='layout-known-fields-not-normalized'));assert.ok(raw.warnings.some(x=>x.code==='layout-item-unknown-or-invalid-schema'));
  const migrated=migrateDocument(f.doc);assert.equal(inspectDocument(migrated).passed,true);
  assert.ok(inspectDocument(migrated).warnings.some(x=>x.code==='layout-item-unknown-or-invalid-schema'));
});

test('Component source and Instance identity/override/detach remain compatible with layout metadata',()=>{
  const f=fixture();f.frame.layout=fullLayout();f.frame.children[0].layoutItem=fullItem({participation:'absolute'});
  const definition=registerComponentDefinition(f.app,'frame','Card');
  const instance=createComponentInstance(f.app,definition.id,{pageId:f.page.id,layerId:f.layer.id,matrix:Matrix.translate(30,40)});
  const resolved=resolveComponentInstance(f.doc,instance);assert.equal(resolved.status,'linked');assert.equal(resolved.geometry.children[0].layout.schema,LAYOUT_SCHEMA);
  assert.equal(instance.definitionId,definition.id);assert.deepEqual(instance.overrides,{});
  const detached=detachComponentInstance(f.app,instance.id);assert.equal(detached.children[0].layout.schema,LAYOUT_SCHEMA);assert.equal(detached.definitionId,undefined);
});

test('structured SVG stays structural and ignores layout metadata rather than flattening',()=>{
  const f=fixture();f.frame.layout=fullLayout();f.frame.children[0].layoutItem=fullItem();
  const svg=vectorObjectToSVG(f.frame,[]);assert.match(svg,/<g/);assert.doesNotMatch(svg,/<image[^>]+data:image/);assert.doesNotMatch(svg,/layout=/);
  assert.equal(f.frame.layout.schema,LAYOUT_SCHEMA);
});

test('file envelope wraps/unwraps native document losslessly without mutation',()=>{
  const f=fixture();f.frame.layout=fullLayout();const before=structuredClone(f.doc);
  const envelope=wrapInkFile(f.doc,{fileId:'file-1',revision:7,appliedMigrations:['format4-base'],savedAt:'2026-09-20T00:00:00.000Z'});
  assert.equal(envelope.schema,FILE_ENVELOPE_SCHEMA);assert.equal(envelope.version,FILE_ENVELOPE_VERSION);assert.equal(envelope.revision,7);assert.equal(envelope.documentFormatVersion,4);
  assert.deepEqual(unwrapInkFile(envelope),f.doc);assert.deepEqual(f.doc,before);assert.notEqual(envelope.document,f.doc);assert.equal(inspectInkFileEnvelope(envelope).valid,true);
});

test('envelope declares Component/Layout extensions and rejects omitted required declaration',()=>{
  const f=fixture();f.frame.layout=fullLayout();f.doc.components={schema:'INK-COMPONENTS-1',definitions:[]};
  assert.deepEqual(declaredDocumentExtensions(f.doc),['ink.components.v1','ink.layout.v1']);
  const envelope=wrapInkFile(f.doc);envelope.extensions=['ink.components.v1'];
  const result=inspectInkFileEnvelope(envelope);assert.equal(result.valid,false);assert.ok(result.errors.some(x=>x.code==='file-envelope-missing-extension'));
});

test('fingerprint, format version and malformed envelope fail closed',()=>{
  const f=fixture(),base=wrapInkFile(f.doc);
  for(const mutate of [
    e=>e.document.title='tampered',e=>e.documentFormatVersion=999,e=>e.revision=-1,
    e=>e.schema='future',e=>e.appliedMigrations='bad'
  ]) {
    const envelope=structuredClone(base);mutate(envelope);const result=inspectInkFileEnvelope(envelope);assert.equal(result.valid,false);assert.throws(()=>unwrapInkFile(envelope),{code:'file-envelope-verification-failed'});
  }
});

test('asset reference boundary mirrors assetManifest and detects divergence',()=>{
  const f=fixture();f.doc.assetManifest={format:'INK-DOCUMENT-ASSET-MANIFEST',version:'1.0',mode:'Linked Document',assets:[{assetId:'asset-1',uri:'media/a.png',hash:'abc',mediaType:'image/png',future:'preserved'}]};
  const envelope=wrapInkFile(f.doc);assert.deepEqual(envelope.assetReferences,f.doc.assetManifest.assets);assert.notEqual(envelope.assetReferences,f.doc.assetManifest.assets);
  envelope.assetReferences[0].hash='wrong';assert.ok(inspectInkFileEnvelope(envelope).errors.some(x=>x.code==='file-envelope-asset-reference-mismatch'));
});

test('next revision keeps file identity, advances monotonically and fingerprints new native payload',()=>{
  const f=fixture(),first=wrapInkFile(f.doc,{fileId:'file-stable',revision:0,extensions:['vendor.future.v3']});
  const nextDoc=structuredClone(f.doc);nextDoc.title='Revision 1';
  const next=nextInkFileRevision(first,nextDoc,{savedAt:'2026-09-20T01:00:00.000Z'});
  assert.equal(next.fileId,'file-stable');assert.equal(next.revision,1);assert.notEqual(next.revisionId,first.revisionId);assert.deepEqual(unwrapInkFile(next),nextDoc);assert.equal(first.document.title,f.doc.title);assert.ok(next.extensions.includes('vendor.future.v3'));
});

test('unsupported future layout schemas are preserved but never interpreted as current layout',()=>{
  const f=fixture();f.frame.layout={schema:'INK-LAYOUT-2',mode:'grid',future:true};
  const plan=evaluateFrameLayout(f.frame);assert.equal(plan.status,'unsupported-layout-schema');assert.equal(f.frame.layout.future,true);
  f.frame.layout=fullLayout({sizing:{horizontal:'hug',vertical:'fixed'}});f.frame.children[0].layoutItem=fullItem({sizing:{horizontal:'fill',vertical:'hug'}});
  const hug=evaluateFrameLayout(f.frame);assert.equal(hug.items[0].width,20);assert.ok(hug.diagnostics.some(x=>x.code==='layout-fill-in-hug-axis-uses-intrinsic'));
  f.frame.children[0].layoutItem={schema:'INK-LAYOUT-ITEM-2',future:true};assert.throws(()=>evaluateFrameLayout(f.frame),{code:'layout-item-unsupported-schema'});
});

test('file-envelope constructors reject malformed known input before producing an envelope',()=>{
  const f=fixture();
  for(const call of [
    ()=>wrapInkFile(f.doc,{extensions:'bad'}),()=>wrapInkFile(f.doc,{savedAt:''}),
    ()=>wrapInkFile(f.doc,{revisionId:''}),()=>wrapInkFile({...f.doc,formatVersion:0})
  ]) assert.throws(call);
});

test('InkStore remains a separate native-document recovery path with layout and assetManifest',async()=>{
  const f=fixture();f.frame.layout=fullLayout();f.doc.assetManifest.assets=[{assetId:'a',uri:'a.png'}];
  const store=new InkStore({databaseName:'INK_LAYOUT_PERSISTENCE_TEST'});assert.equal(await store.save('native',f.doc),true);
  const loaded=migrateDocument(await store.load('native'));assert.equal(findPageObject(loaded.pages[0],'frame').object.layout.schema,LAYOUT_SCHEMA);assert.deepEqual(loaded.assetManifest.assets,f.doc.assetManifest.assets);
  assert.equal(loaded.schema,undefined,'InkStore must not silently substitute the transport-neutral file envelope');
});
