import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { Matrix } from '../product/source/src/core/index.js';
import { createFrame, defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { CHAT_EDIT_OPERATIONS, ChatBoundedEditController, createChatBoundedEditAdapter } from '../product/source/src/editor/chat-bounded-edit.js';
import { applyWorldTransformBatch } from '../product/source/src/editor/transform.js';
import { resolveInkCapabilityDescriptor } from '../product/source/src/agent/index.js';

const OPS=[
  'path.repaint.v1','path.material.apply.v1','path.material.remove.v1','object.translate.v1','path.simplify.v1','path.refine.v1',
  'path.create.v1','path.edit.v1','object.rotate.v1','object.clone.v1','repeat.radial.v1','boolean.apply.v1','group.create.v1','object.reparent.v1'
];
const clone=v=>JSON.parse(JSON.stringify(v));

function makeApp(){
  const doc=defaultDocument(),page=doc.pages[0],layer=page.layers[0];
  doc.id='geometry-ops-doc';page.id='page-1';doc.activePageId=page.id;layer.id='layer-1';page.activeLayerId=layer.id;layer.objects=[];
  const app={
    doc,selection:[],spatialDirty:false,
    page(){return this.doc.pages[0];},
    layer(){return this.page().layers.find(x=>x.id===this.page().activeLayerId)||this.page().layers[0];},
    pagePath(p=this.page()){const i=this.doc.pages.indexOf(p);return i<0?null:['pages',i];},
    layerPath(l=this.layer(),p=this.page()){const base=this.pagePath(p),i=p.layers.indexOf(l);return!base||i<0?null:[...base,'layers',i];},
    layerObjectsPath(l=this.layer(),p=this.page()){const base=this.layerPath(l,p);return base?[...base,'objects']:null;},
    objectPath(found){const base=this.pagePath();return!found||!base?null:[...base,...found.path];},
    findObject(ref){return findPageObject(this.page(),ref);},
    selectedObjects(){return this.selection.map(ref=>this.findObject(ref)).filter(Boolean);},
    translateSelection(dx,dy,label='Move'){
      const found=this.selectedObjects(),paths=found.map(x=>this.objectPath(x)).filter(Boolean),transform=Matrix.translate(dx,dy);
      this.history.pushScoped(label,paths,()=>applyWorldTransformBatch(found.map(x=>({found:this.findObject({layerId:x.layer.id,objectId:x.object.id}),transform}))));
    },
    queueSpatialObject(){},refreshAll(){},refreshSelectionUI(){},renderer:{render(){}},markDirty(){},updateHistoryUI(){},
    replaceDocument(next){this.doc=clone(next);}
  };
  app.history=new HistoryManager(app);app.chatBoundedEdit=new ChatBoundedEditController(app);return app;
}
function ref(app,id){const found=findPageObject(app.page(),id);assert.ok(found,id);return{pageId:app.page().id,layerId:found.layer.id,objectId:id};}
function task(id,operation,targets,args){return{schema:'INK-CHAT-EDIT-TASK',version:1,taskId:id,operation,targets,arguments:args};}
function run(adapter,raw){
  const p=adapter.propose(raw);assert.equal(p.ok,true,JSON.stringify(p));
  const a=adapter.approve(p.result.proposalId);assert.equal(a.ok,true,JSON.stringify(a));
  const e=adapter.execute(p.result.proposalId,a.result.approvalToken);assert.equal(e.ok,true,JSON.stringify(e));return e.result;
}
function square(id,x=0,y=0,s=20){return{shape:'path',objectId:id,name:id,fill:'none',stroke:'#202020',strokeWidth:1,subpaths:[{role:'outer',closed:true,anchors:[{x,y},{x:x+s,y},{x:x+s,y:y+s},{x,y:y+s}]}]};}

test('authorized geometry vocabulary remains the exact original-six plus eight prefix',()=>{
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(0,OPS.length),OPS);assert.ok(CHAT_EDIT_OPERATIONS.length>=OPS.length);assert.equal(FORMAT_VERSION,4);
  for(const op of OPS){const d=resolveInkCapabilityDescriptor(op);assert.equal(d?.availability,true,op);assert.ok(d?.inputSchema,op);}
  assert.equal(resolveInkCapabilityDescriptor('path.create.v1').inputSchema.properties.targets.minItems,0);
  assert.equal(resolveInkCapabilityDescriptor('boolean.apply.v1').inputSchema.properties.targets.minItems,2);
});

test('create, edit, rotate, clone and radial repeat are native, undoable, and return stable refs',()=>{
  const app=makeApp(),adapter=createChatBoundedEditAdapter(app.chatBoundedEdit);
  let out=run(adapter,task('create','path.create.v1',[],square('rose-module')));
  assert.equal(out.targets[0].ref.objectId,'rose-module');
  out=run(adapter,task('edit','path.edit.v1',[ref(app,'rose-module')],{action:'move-anchor',subpathIndex:0,anchorIndex:0,x:-8,y:0}));
  assert.equal(findPageObject(app.page(),'rose-module').object.subpaths[0].anchors[0].x,-8);
  const before=clone(findPageObject(app.page(),'rose-module').object.matrix);
  run(adapter,task('rotate','object.rotate.v1',[ref(app,'rose-module')],{degrees:30,center:{x:10,y:10}}));
  assert.notDeepEqual(findPageObject(app.page(),'rose-module').object.matrix,before);
  out=run(adapter,task('clone','object.clone.v1',[ref(app,'rose-module')],{dx:40,dy:0}));
  const cloneId=out.targets[0].ref.objectId,copy=findPageObject(app.page(),cloneId).object;
  assert.notEqual(cloneId,'rose-module');assert.equal(copy.metadata.composition.duplicatedFromObjectId,'rose-module');
  assert.notEqual(copy.subpaths[0].id,findPageObject(app.page(),'rose-module').object.subpaths[0].id);
  out=run(adapter,task('repeat','repeat.radial.v1',[ref(app,'rose-module')],{count:8,center:{x:10,y:10},sweep:360,startAngle:0,linked:true}));
  const repeat=findPageObject(app.page(),out.targets[0].ref.objectId).object;
  assert.equal(repeat.type,'repeat');assert.equal(repeat.count,8);assert.equal(repeat.instances.length,8);
  assert.equal(app.history.undoStack.length,5);assert.equal(app.history.undo(),true);assert.equal(findPageObject(app.page(),repeat.id),null);
  assert.equal(app.history.redo(),true);assert.equal(findPageObject(app.page(),repeat.id)?.object.type,'repeat');
});

test('boolean proposal plus group and reparent preserve existing structural authorities',()=>{
  const app=makeApp(),adapter=createChatBoundedEditAdapter(app.chatBoundedEdit);
  run(adapter,task('a','path.create.v1',[],square('a',0,0,30)));run(adapter,task('b','path.create.v1',[],square('b',15,0,30)));
  const beforeBoolean=clone(app.doc);
  const booleanProposal=adapter.propose(task('boolean','boolean.apply.v1',[ref(app,'a'),ref(app,'b')],{operation:'union',name:'Union'}));
  assert.equal(booleanProposal.ok,true,JSON.stringify(booleanProposal));
  assert.deepEqual(app.doc,beforeBoolean);
  const booleanApproval=adapter.approve(booleanProposal.result.proposalId);
  assert.equal(booleanApproval.ok,true,JSON.stringify(booleanApproval));
  assert.equal(resolveInkCapabilityDescriptor('boolean.apply.v1')?.availability,true);
  // Browser Closure Runtime owns actual polygon-clipping execution; Node focused QA verifies
  // bounded proposal/approval and leaves the browser-specific UMD execution environment to that gate.

  run(adapter,task('g1','path.create.v1',[],square('g1',60,0,10)));run(adapter,task('g2','path.create.v1',[],square('g2',80,0,10)));
  let out=run(adapter,task('group','group.create.v1',[ref(app,'g1'),ref(app,'g2')],{name:'Module'}));
  const groupId=out.targets[0].ref.objectId,group=findPageObject(app.page(),groupId).object;
  assert.equal(group.type,'group');assert.deepEqual(group.children.map(x=>x.id),['g1','g2']);

  const frame=createFrame({id:'frame-target',width:200,height:200});app.layer().objects.push(frame);
  const world=clone(findPageObject(app.page(),'g1').worldMatrix);
  out=run(adapter,task('reparent','object.reparent.v1',[ref(app,'g1')],{parentObjectId:'frame-target'}));
  const moved=findPageObject(app.page(),out.targets[0].ref);
  assert.equal(moved.parentObject.id,'frame-target');assert.deepEqual(moved.worldMatrix,world);
  assert.equal(app.history.undo(),true);assert.equal(findPageObject(app.page(),'g1').parentObject?.id,groupId);
});

test('invalid geometry requests fail before document mutation',()=>{
  const app=makeApp(),adapter=createChatBoundedEditAdapter(app.chatBoundedEdit),before=clone(app.doc);
  assert.equal(adapter.propose(task('bad-polygon','path.create.v1',[],{shape:'polygon',points:[{x:0,y:0},{x:1,y:1}]})).ok,false);
  assert.equal(adapter.propose(task('bad-rotate','object.rotate.v1',[],{degrees:0,center:{x:0,y:0}})).ok,false);
  assert.deepEqual(app.doc,before);assert.equal(app.history.undoStack.length,0);
});
