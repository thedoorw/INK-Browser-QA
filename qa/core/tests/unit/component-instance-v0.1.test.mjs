import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Matrix, transformBounds } from '../../../../product/source/src/core/index.js';
import { defaultDocument, createFrame, findPageObject, migrateDocument, inspectDocument, reparentPageObject, walkPageObjects } from '../../../../product/source/src/document/index.js';
import { COMPONENT_SCHEMA, resolveComponentInstance, inspectComponents, registerComponentDefinition, createComponentInstance, setComponentOverride, detachComponentInstance, duplicateComponentDefinition, repairComponentReference } from '../../../../product/source/src/document/components.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { InkStore } from '../../../../product/source/src/document/storage.js';
import { applyWorldTransform, collapseTransformRoots } from '../../../../product/source/src/editor/index.js';
import { PageSpatialIndex } from '../../../../product/source/src/spatial/index.js';
import { createPath, createAnchor, createRepeat } from '../../../../product/source/src/vector/vector-core.js';

const shape = (id, x = 0) => ({id,type:'shape',shape:'rect',matrix:Matrix.translate(x,0),opacity:1,w:20,h:10,color:'#123456',fill:true,size:1});
const fixture = () => {
  const app = {doc:defaultDocument(),markDirty(){},updateHistoryUI(){},refreshAll(){},replaceDocument(doc){this.doc=doc;}};
  const page = app.doc.pages[0], layer = page.layers[0];
  const root = createFrame({id:'source',matrix:Matrix.translate(500,600),width:60,height:40,children:[
    {id:'nested',type:'group',matrix:Matrix.translate(4,5),opacity:.8,children:[shape('leaf',3)]}
  ]});
  layer.objects.push(root);
  app.doc = migrateDocument(app.doc);
  app.history = new HistoryManager(app);
  const definition = registerComponentDefinition(app,'source','Button');
  const placement = {pageId:page.id,layerId:layer.id,matrix:Matrix.translate(100,200)};
  const instance = createComponentInstance(app,definition.id,placement);
  return {app,definition,instance,placement,page:app.doc.pages[0],layer:app.doc.pages[0].layers[0]};
};
const view = (f, id = f.instance.id) => resolveComponentInstance(f.app.doc, findPageObject(f.app.doc.pages[0],id).object);
const leaf = result => result.geometry.children[0].children[0].children[0];
const codes = doc => inspectComponents(doc).map(item => item.code);

// Execute actual editor/renderer methods with constructors/DOM boot disabled.
// This is Node integration coverage, not browser/Canvas visual QA.
const inkURL = new URL('../../../../product/source/src/ink.js',import.meta.url);
const ink = readFileSync(inkURL,'utf8').replace(/from '(\.[^']+)'/g,(_,path)=>`from '${new URL(path,inkURL).href}'`)
  .replace(/window\.INK_ARCHITECTURE=[\s\S]*$/, 'export { Renderer, InkApp };');
const {Renderer,InkApp} = await import(`data:text/javascript;base64,${Buffer.from(ink).toString('base64')}`).catch(error=>{console.error(error.name,error.message);process.exit(1);});
const studioURL = new URL('../../../../product/source/src/studio-core.js',import.meta.url);
const studio = readFileSync(studioURL,'utf8').replace(/from '(\.[^']+)'/g,(_,path)=>`from '${new URL(path,studioURL).href}'`)+ '\nexport { installRenderer };';
const {installRenderer} = await import(`data:text/javascript;base64,${Buffer.from(studio).toString('base64')}`).catch(error=>{console.error(error.name,error.message);process.exit(1);});
function editor(f) {
  const app = Object.assign(Object.create(InkApp.prototype), f.app);
  app.page = () => app.doc.pages[0];
  app.selection=[];app.spatialPending=new Set();app.spatialDirty=true;app.spatialIndex=new PageSpatialIndex();
  app.renderer = Object.assign(Object.create(Renderer.prototype),{app,measureCtx:{measureText:()=>({width:10})}});
  installRenderer(app);
  return app;
}

test('definition authority, source IDs and instance IDs persist through native migration without caches',()=>{
  const f=fixture();setComponentOverride(f.app,f.instance.id,'leaf',.25);
  const saved=JSON.stringify(f.app.doc),doc=migrateDocument(JSON.parse(saved));
  assert.equal(doc.formatVersion,4);assert.deepEqual(doc.components,f.app.doc.components);
  const instance=findPageObject(doc.pages[0],f.instance.id).object;
  assert.deepEqual(instance.overrides,{leaf:{opacity:.25}});assert.equal(instance.children,undefined);
  assert.equal(resolveComponentInstance(doc,instance).status,'linked');
  assert.ok(!saved.includes('component-view:'));assert.ok(!saved.includes('worldBounds'));
  assert.equal(inspectDocument(doc).passed,true);
});

test('stable source identity survives reorder, rename and reparent; source placement is not copied',()=>{
  const f=fixture();setComponentOverride(f.app,f.instance.id,'leaf',.3);
  const root=findPageObject(f.page,'source').object;
  root.name='Renamed';root.matrix=Matrix.translate(-800,70);root.children.unshift(shape('extra'));
  const result=view(f);assert.equal(result.status,'linked');
  assert.deepEqual(result.geometry.matrix,f.instance.matrix);
  assert.deepEqual(result.geometry.children[0].matrix,Matrix.identity());
  assert.equal(result.geometry.children[0].children[1].children[0].opacity,.3);
  const parent=createFrame({id:'parent',matrix:Matrix.translate(9,12)});f.layer.objects.push(parent);
  reparentPageObject(f.page,'source','parent');
  assert.equal(view(f).status,'linked');assert.equal(f.app.doc.components.definitions[0].sourceRootId,'source');
});

test('source edits are live, overrides win, reset returns to current source value',()=>{
  const f=fixture();setComponentOverride(f.app,f.instance.id,'leaf',.3);
  findPageObject(f.page,'leaf').object.opacity=.7;
  assert.equal(leaf(view(f)).opacity,.3);
  setComponentOverride(f.app,f.instance.id,'leaf',null);
  assert.equal(leaf(view(f)).opacity,.7);
  assert.equal(findPageObject(f.page,'leaf').object.opacity,.7);
});

test('unknown property and stale target are retained diagnostically, never applied',()=>{
  const f=fixture();f.instance.overrides={leaf:{matrix:[0],opacity:.2},missing:{opacity:.4}};
  const result=view(f);assert.equal(result.status,'linked-with-diagnostics');
  assert.equal(leaf(result).opacity,1);
  assert.ok(codes(f.app.doc).includes('component-invalid-override-property'));
  assert.ok(codes(f.app.doc).includes('component-stale-override-target'));
  const doc=migrateDocument(JSON.parse(JSON.stringify(f.app.doc)));
  assert.deepEqual(findPageObject(doc.pages[0],f.instance.id).object.overrides,f.instance.overrides);
  setComponentOverride(f.app,f.instance.id,'missing',null);
  assert.equal(f.instance.overrides.missing,undefined);
});

test('missing definition/source and duplicate definitions fail closed without retargeting',()=>{
  for (const mode of ['missing','source','duplicate']) {
    const f=fixture();
    if(mode==='missing')f.instance.definitionId='missing';
    if(mode==='source')f.layer.objects.splice(0,1);
    if(mode==='duplicate')f.app.doc.components.definitions.push({...f.definition});
    assert.equal(view(f).status,'broken');
    const doc=migrateDocument(JSON.parse(JSON.stringify(f.app.doc)));
    assert.equal(resolveComponentInstance(doc,findPageObject(doc.pages[0],f.instance.id).object).status,'broken');
    assert.equal(inspectDocument(doc).passed,true,'diagnostics must not prevent retention in storage');
    assert.ok(inspectDocument(doc).warnings.some(item=>item.code.startsWith('component-')));
  }
});

test('nested instances, self and indirect cycles reject and remain finite under inspection',()=>{
  const f=fixture();
  assert.throws(()=>createComponentInstance(f.app,f.definition.id,{...f.placement,parentId:'source'}),{code:'component-nested-instance-unsupported'});
  const second=createFrame({id:'second',children:[]});f.layer.objects.push(second);
  const def2=registerComponentDefinition(f.app,'second','Second');
  const a={...structuredClone(f.instance),id:'nested-a',parentId:'source',definitionId:def2.id};
  const b={...structuredClone(f.instance),id:'nested-b',parentId:'second'};
  findPageObject(f.page,'source').object.children.push(a);second.children.push(b);
  assert.equal(view(f).status,'broken');assert.ok(codes(f.app.doc).includes('component-cycle'));
  a.definitionId=f.definition.id;assert.ok(codes(f.app.doc).includes('component-cycle'));
  assert.doesNotThrow(()=>JSON.stringify(f.app.doc));
  assert.equal(resolveComponentInstance(migrateDocument(f.app.doc),f.instance).status,'broken');
});

test('malformed registry, envelope, owned children and structural cycles fail safely',()=>{
  const f=fixture();f.instance.overrides=null;assert.equal(view(f).status,'linked-with-diagnostics');
  f.instance.children=[];assert.equal(view(f).status,'broken');delete f.instance.children;
  f.app.doc.components.schema='future';assert.equal(view(f).status,'broken');
  assert.ok(codes(f.app.doc).includes('component-invalid-registry'));
  f.app.doc.components.schema=COMPONENT_SCHEMA;
  const root=findPageObject(f.page,'source').object;root.children.push(root);
  assert.equal(resolveComponentInstance(f.app.doc,f.instance).status,'broken');
  assert.equal(inspectDocument(f.app.doc).passed,false);
});

test('instance transformations use ancestry and preserve definition and other placements',()=>{
  const f=fixture(),parent=createFrame({id:'placement-parent',matrix:Matrix.multiply(Matrix.translate(10,20),Matrix.scale(2,3))});f.layer.objects.push(parent);
  const inst=createComponentInstance(f.app,f.definition.id,{...f.placement,parentId:parent.id});
  const definitionBefore=JSON.stringify(findPageObject(f.page,'source').object),placementBefore=[...f.instance.matrix];
  const found=findPageObject(f.page,inst.id);applyWorldTransform(found,Matrix.rotate(.5));
  assert.deepEqual(collapseTransformRoots([findPageObject(f.page,parent.id),findPageObject(f.page,inst.id)]).map(x=>x.object.id),[parent.id]);
  assert.equal(JSON.stringify(findPageObject(f.page,'source').object),definitionBefore);
  assert.deepEqual(f.instance.matrix,placementBefore);
  const app=editor(f),bounds=app.renderer.objectWorldBounds(inst,found.parentWorldMatrix);
  assert.deepEqual(bounds,transformBounds({x:0,y:0,w:60,h:40},findPageObject(f.page,inst.id).worldMatrix));
  reparentPageObject(f.page,inst.id,null);assert.deepEqual(app.renderer.objectWorldBounds(inst),bounds);
});

test('Frame/Group inherited state and instance-atomic spatial/hit contracts use existing tree',()=>{
  const f=fixture();const parent=createFrame({id:'place',matrix:Matrix.translate(10,20),opacity:.5,locked:true});f.layer.objects.push(parent);
  const inst=createComponentInstance(f.app,f.definition.id,{...f.placement,parentId:parent.id});inst.opacity=.5;
  const found=findPageObject(f.page,inst.id);assert.equal(found.effectiveOpacity,.25);assert.equal(found.effectiveLocked,true);
  const app=editor(f);const index=app.ensureSpatialIndex();assert.ok(index.itemById.has(inst.id));
  assert.ok(!index.items.some(item=>item.object.id.startsWith('component-view:')));
  assert.equal(app.hitObject(inst,{x:120,y:230},found.parentWorldMatrix),true);
  assert.equal(app.hitObject(inst,{x:101,y:201},found.parentWorldMatrix),false);
  findPageObject(f.page,'source').object.width=95;
  assert.equal(app.ensureSpatialIndex().itemById.get(inst.id).bounds.w,95);
  parent.visible=false;assert.ok(!app.ensureSpatialIndex().itemById.has(inst.id));
});

test('detach preserves resolved appearance/world bounds and creates ordinary fresh identities',()=>{
  const f=fixture();setComponentOverride(f.app,f.instance.id,'leaf',.42);
  const parent=createFrame({id:'place',matrix:Matrix.translate(17,19)});f.layer.objects.push(parent);
  reparentPageObject(f.page,f.instance.id,parent.id);
  const app=editor(f),found=findPageObject(f.page,f.instance.id);
  const bounds=app.renderer.objectWorldBounds(found.object,found.parentWorldMatrix),before=view(f).geometry;
  const ordinary=detachComponentInstance(f.app,f.instance.id);
  assert.notEqual(ordinary.id,f.instance.id);assert.equal(ordinary.type,'group');assert.equal(ordinary.parentId,parent.id);
  assert.equal(ordinary.definitionId,undefined);assert.equal(ordinary.componentSchema,undefined);
  assert.deepEqual(ordinary.matrix,before.matrix);assert.equal(ordinary.children[0].children[0].children[0].opacity,.42);
  assert.deepEqual(app.renderer.objectWorldBounds(ordinary,found.parentWorldMatrix),bounds);
  assert.equal(inspectDocument(f.app.doc).passed,true);
  f.app.history.undo();assert.equal(view(f).status,'linked');
  f.app.history.redo();assert.equal(findPageObject(f.app.doc.pages[0],ordinary.id).object.type,'group');
});

test('register/create/override/reset/repair support History; rejection does not touch pending history',()=>{
  const f=fixture();const definitionId=f.definition.id,instanceId=f.instance.id;
  f.app.history.undo();assert.equal(findPageObject(f.app.doc.pages[0],instanceId),null);
  f.app.history.undo();assert.equal(f.app.doc.components,undefined);
  f.app.history.redo();f.app.history.redo();assert.equal(view(f).status,'linked');
  setComponentOverride(f.app,instanceId,'leaf',.2);f.app.history.undo();assert.equal(leaf(view(f)).opacity,1);f.app.history.redo();assert.equal(leaf(view(f)).opacity,.2);
  setComponentOverride(f.app,instanceId,'leaf',null);f.app.history.undo();assert.equal(leaf(view(f)).opacity,.2);f.app.history.redo();assert.equal(leaf(view(f)).opacity,1);
  findPageObject(f.app.doc.pages[0],instanceId).object.definitionId='missing';
  repairComponentReference(f.app,instanceId,definitionId);assert.equal(view(f).status,'linked');
  f.app.history.undo();assert.equal(view(f).status,'broken');f.app.history.redo();assert.equal(view(f).status,'linked');
  for(const op of [()=>setComponentOverride(f.app,instanceId,'bad',.3),()=>setComponentOverride(f.app,instanceId,'leaf',NaN),()=>repairComponentReference(f.app,instanceId,'bad')]) {
    const before=JSON.stringify(f.app.doc),count=f.app.history.undoStack.length;assert.throws(op);
    assert.equal(JSON.stringify(f.app.doc),before);assert.equal(f.app.history.undoStack.length,count);assert.equal(f.app.history.pending,null);
  }
  f.app.history.begin('external');const before=JSON.stringify(f.app.doc),pending=f.app.history.pending;
  assert.throws(()=>setComponentOverride(f.app,instanceId,'leaf',.5),{code:'component-history-busy'});
  assert.equal(f.app.history.pending,pending);assert.equal(JSON.stringify(f.app.doc),before);f.app.history.cancel();
});

test('definition duplication creates new definition/source IDs and never retargets original instance',()=>{
  const f=fixture(),duplicate=duplicateComponentDefinition(f.app,f.definition.id);
  assert.notEqual(duplicate.id,f.definition.id);assert.notEqual(duplicate.sourceRootId,f.definition.sourceRootId);
  assert.equal(f.instance.definitionId,f.definition.id);
  assert.equal(inspectDocument(f.app.doc).passed,true);
  const ids=walkPageObjects(f.page).map(entry=>entry.object.id);assert.equal(new Set(ids).size,ids.length);
  f.app.history.undo();assert.equal(f.app.doc.components.definitions.length,1);
  f.app.history.redo();assert.equal(f.app.doc.components.definitions[1].id,duplicate.id);
});

test('InkStore preserves valid and broken component references with diagnostic overrides',async()=>{
  const f=fixture();f.instance.overrides={gone:{opacity:.4}};f.instance.definitionId='missing';
  const store=new InkStore({databaseName:'component-foundation-test'});
  await store.save('components',f.app.doc);const loaded=await store.load('components');
  assert.ok(loaded);assert.deepEqual(loaded.components,f.app.doc.components);
  assert.equal(findPageObject(loaded.pages[0],f.instance.id).object.definitionId,'missing');
  assert.equal(resolveComponentInstance(loaded,findPageObject(loaded.pages[0],f.instance.id).object).status,'broken');
});

test('main structured SVG resolves mixed paths, strokes, text, images and Repeat without source mutation',()=>{
  const f=fixture();const root=findPageObject(f.page,'source').object;
  const path=createPath({id:'vector',subpaths:[{closed:true,anchors:[createAnchor(0,0),createAnchor(10,0),createAnchor(5,10)]}],fill:'#abcdef'});
  root.children.push(path,{id:'text',type:'text',matrix:Matrix.identity(),opacity:1,text:'Hello',color:'#000',fontSize:12,fontFamily:'sans-serif'},
    {id:'image',type:'image',matrix:Matrix.identity(),opacity:1,w:10,h:10,src:'data:image/png;base64,AA=='},
    {id:'stroke',type:'stroke',matrix:Matrix.identity(),opacity:1,color:'#000',size:2,kind:'pen',points:[{x:0,y:0,p:.5},{x:10,y:10,p:.5}]},
    createRepeat(path,{id:'repeat',count:3}));
  const app=editor(f),before=JSON.stringify(f.app.doc),svg=app.objectToSVG(f.instance);
  for(const token of ['<path','<text','<image','<polygon','<g'])assert.ok(svg.includes(token),token);
  assert.equal(JSON.stringify(f.app.doc),before);
  assert.ok(!svg.includes('<foreignObject'));assert.ok(!svg.includes('<canvas'));
  const svg2=app.objectToSVG(f.instance);assert.equal(svg2,svg);
  const detached=detachComponentInstance(f.app,f.instance.id);assert.ok(app.objectToSVG(detached).includes('Hello'));
});

test('renderer resolves using existing recursive draw methods, composes transforms/opacity and does not persist geometry',()=>{
  const f=fixture();setComponentOverride(f.app,f.instance.id,'leaf',.25);f.instance.opacity=.5;
  const app=editor(f),calls=[],stack=[];
  const ctx={globalAlpha:1,matrix:Matrix.identity(),save(){stack.push([this.globalAlpha,[...this.matrix]]);},restore(){[this.globalAlpha,this.matrix]=stack.pop();},transform(...matrix){this.matrix=Matrix.multiply(this.matrix,matrix);}};
  app.renderer.drawShape=(ctx,o)=>calls.push({matrix:[...ctx.matrix],opacity:ctx.globalAlpha,id:o.id});
  app.renderer.drawObject(ctx,f.instance);
  assert.equal(calls.length,1);assert.equal(calls[0].opacity,.5*.8*.25);
  assert.deepEqual(calls[0].matrix,Matrix.translate(107,205));assert.equal(f.instance.children,undefined);
  f.instance.visible=false;app.renderer.drawObject(ctx,f.instance);assert.equal(calls.length,1);
});
