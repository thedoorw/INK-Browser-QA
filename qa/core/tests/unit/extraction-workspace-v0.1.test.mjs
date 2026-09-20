import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument,migrateDocument,inspectDocument,wrapInkFile,unwrapInkFile } from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { InkStore } from '../../../../product/source/src/document/storage.js';
import { extractIntoDocument,correctExtractionAnchor,setReferenceOverlay } from '../../../../product/source/src/extraction/workspace.js';
import { vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';
const source={name:'square',sha256:'a'.repeat(64)},raster={width:8,height:8,data:new Uint8ClampedArray(256).fill(255)};
const request={source,raster},options={referenceSrc:'data:image/png;base64,aGVsbG8='};
const adapter={id:'engineering-contour',version:'1',extract:()=>({contours:[{parent:-1,points:[[0,0],[7,0],[7,7],[0,7]]}]})};
function appFixture(){const app={doc:defaultDocument(),selection:[],page(){return this.doc.pages[0];},layer(){return this.page().layers[0];},layerObjectsPath(){return ['pages',0,'layers',0,'objects'];},objectPath(f){return ['pages',0,...f.path];},replaceDocument(d){this.doc=d;},markDirty(){},refreshAll(){}};app.history=new HistoryManager(app);return app;}
test('reference/path import is atomic, undoable, serializable and correctable',async()=>{
 const app=appFixture();const baseline=structuredClone(app.doc.assetManifest);
 const r=await extractIntoDocument(app,request,adapter,options);assert.equal(app.history.undoStack.length,1);assert.equal(app.layer().objects.length,2);
 assert.equal(inspectDocument(migrateDocument(app.doc)).passed,true);assert.deepEqual(app.doc.assetManifest,baseline);
 const path=app.layer().objects[1],old=path.subpaths[0].anchors[0].x;
 correctExtractionAnchor(app,{objectId:path.id,x:old+1,y:0});assert.equal(path.subpaths[0].anchors[0].x,old+1);
 app.history.undo();assert.equal(app.layer().objects[1].subpaths[0].anchors[0].x,old);
 app.history.undo();assert.equal(app.layer().objects.length,0);app.history.redo();assert.equal(app.layer().objects.length,2);
 const saved=wrapInkFile(app.doc),loaded=migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(saved))));
 assert.equal(loaded.pages[0].layers[0].objects[1].metadata.extraction.referenceObjectId,r.referenceObjectId);
 const store=new InkStore();await store.save('extraction',saved);assert.deepEqual(await store.load('extraction'),saved);
 assert.match(vectorObjectToSVG(app.layer().objects[1],[]),/<path/);
 const geometry=JSON.stringify(app.layer().objects[1].subpaths);setReferenceOverlay(app,r.referenceObjectId,0.2);assert.equal(JSON.stringify(app.layer().objects[1].subpaths),geometry);
});
test('failure, busy History, singular transforms and async stale document cannot mutate target',async()=>{
 const app=appFixture(),before=JSON.stringify(app.doc);
 await assert.rejects(extractIntoDocument(app,request,{...adapter,extract:()=>{throw Error('boom');}},options),/boom/);assert.equal(JSON.stringify(app.doc),before);assert.equal(app.history.undoStack.length,0);
 await assert.rejects(extractIntoDocument(app,request,adapter,{...options,matrix:[0,0,0,1,0,0]}),/SINGULAR/);
 app.history.begin('other');await assert.rejects(extractIntoDocument(app,request,adapter,options),/TARGET_UNAVAILABLE/);assert.equal(app.history.pending.label,'other');app.history.cancel();
 await assert.rejects(extractIntoDocument(app,request,{...adapter,extract:()=>{app.doc.title='changed';return adapter.extract();}},options),/STALE_DOCUMENT/);assert.equal(app.layer().objects.length,0);
});
test('repeated extraction uses unique object/node identities and locked corrections fail',async()=>{
 const app=appFixture();await extractIntoDocument(app,request,adapter,options);await extractIntoDocument(app,request,adapter,options);
 assert.equal(new Set(app.layer().objects.map(o=>o.id)).size,4);assert.equal(inspectDocument(migrateDocument(app.doc)).passed,true);
 const p=app.layer().objects[1];app.layer().locked=true;assert.throws(()=>correctExtractionAnchor(app,{objectId:p.id,x:1,y:0}),/TARGET_UNAVAILABLE/);
});
