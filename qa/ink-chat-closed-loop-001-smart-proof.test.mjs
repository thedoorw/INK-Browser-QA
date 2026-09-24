import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import { createInkPublicCreativeApi } from '../product/source/src/agent/public-creative-api.js';
import { captureInkPreview } from '../product/source/src/agent/visual-feedback.js';
import { getInkNamedToolDefinitions, resolveInkCapabilityDescriptor } from '../product/source/src/agent/capability-registry.js';
import { createChatReferenceHandoffAdapter } from '../product/source/src/ai/chat-reference-handoff.js';
import { defaultDocument, findPageObject, installRevision } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { PathRepaintMaterialController } from '../product/source/src/editor/repaint-material.js';
import { ChatBoundedEditController, createChatBoundedEditAdapter } from '../product/source/src/editor/chat-bounded-edit.js';
import { ChatCreativePlanController } from '../product/source/src/editor/chat-creative-plan.js';
import { createPath } from '../product/source/src/vector/vector-core.js';
import { startServer, smartLoopRequired, finalizeSmartLoopEvidence } from './runtime/run-ink-runtime-batch.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const prefix=['get_ink_capabilities','get_ink_context','get_ink_selection','inspect_ink_objects','decompose_ink_reference',
  'propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_history','undo_ink','redo_ink',
  'get_ink_revisions','capture_ink_revision','restore_ink_revision','get_ink_preview','inspect_ink_output',
  'release_ink_output','describe_ink_capability','use_ink'];
const basicApp=()=>({doc:{id:'doc-1'},page:()=>({id:'page-1'}),revisions:{revisionIdFor:()=>null}});
const jsonSafe=value=>assert.deepEqual(JSON.parse(JSON.stringify(value)),value);

test('Tool 20 appends the exact 19-tool prefix; discovery exposes the local import contract only',()=>{
  const tools=getInkNamedToolDefinitions();
  assert.deepEqual(tools.map(t=>t.name),[...prefix,'import_ink_reference']);
  const api=createInkPublicCreativeApi(basicApp());
  const byId=api.tools.invoke('describe_ink_capability',{idOrToolName:'reference.import'});
  const byTool=api.tools.invoke('describe_ink_capability',{idOrToolName:'import_ink_reference'});
  assert.deepEqual(byId,byTool);
  assert.equal(byId.result.publicMethod,'reference.import');
  assert.equal(byId.result.routingClass,'NAMED_TOOL');
  assert.equal(byId.result.availability,true);
  assert.equal(byId.result.authoritativeRoute,'app.chatReferenceHandoff.importReference');
  assert.equal(resolveInkCapabilityDescriptor('external.transport').availability,false);
  jsonSafe(api.tools.invoke('get_ink_capabilities'));
});

test('Public and named import delegate input/options by identity once and preserve detached receipts',async()=>{
  for(const named of [false,true]){
    const app=basicApp();
    const input=new File(['fixture'],'fixture.png',{type:'image/png'});
    const options={intent:'bounded import',matrix:[1,0,0,1,0,0]};
    let calls=0;
    const raw={status:'COMPLETED',referenceObjectId:'ref-1',targetLayerId:'layer-1',source:{sha256:'a'.repeat(64)},
      history:{commit:{valid:true}},revision:{before:null,after:null},provenance:{eventIds:['event-1']},error:null};
    app.chatReferenceHandoff={async importReference(given,opts){calls++;assert.equal(given,input);assert.equal(opts,options);return raw;}};
    const api=createInkPublicCreativeApi(app);
    const result=await (named?api.tools.invoke('import_ink_reference',{input,options}):api.reference.import(input,options));
    assert.equal(calls,1);
    assert.equal(result.schema,'INK_AGENT_RESULT');assert.equal(result.version,1);
    assert.equal(result.action,'reference.import');assert.equal(result.status,'COMPLETED');
    assert.deepEqual(result.createdRefs,[{pageId:'page-1',layerId:'layer-1',objectId:'ref-1'}]);
    assert.deepEqual(result.changedRefs,result.createdRefs);
    assert.deepEqual(result.historyReceipt,raw.history);
    assert.deepEqual(result.revisionReceipt,raw.revision);
    assert.deepEqual(result.provenanceReceipt,raw.provenance);
    jsonSafe(result);
    result.result.source.sha256='changed';assert.equal(raw.source.sha256,'a'.repeat(64));
    assert.equal(JSON.stringify(result).includes('fixture.png'),false,'Input is never echoed');
  }
});

test('Existing File/Blob normalization is used through the facade; invalid binary stays non-mutating',async()=>{
  const app=basicApp();let imports=0;let decoded=0;
  app.layer=()=>({id:'layer-1'});
  app.history={undoStack:[],redoStack:[],pending:null,limit:30};
  app.extraction={
    async decode(file){decoded++;assert.ok(file instanceof File);return {source:{name:file.name,mimeType:file.type,sizeBytes:file.size,sha256:'b'.repeat(64),width:1,height:1}};},
    importReference(){imports++;app.history.undoStack.push({label:'Reference import · CHAT attachment',objectIds:['ref-'+imports],patchCount:1});return {documentId:app.doc.id,layerId:'layer-1',referenceObjectId:'ref-'+imports};}
  };
  app.chatReferenceHandoff=createChatReferenceHandoffAdapter(app);
  const api=createInkPublicCreativeApi(app);
  const blob=new Blob(['fixture'],{type:'image/png'});
  for(const input of [new File([blob],'f.png',{type:'image/png'}),blob,{file:new File([blob],'f.png',{type:'image/png'})},{blob,name:'f.png',type:'image/png'}]){
    const result=await api.tools.invoke('import_ink_reference',{input,options:{name:'f.png'}});
    assert.equal(result.status,'COMPLETED');assert.equal(result.historyReceipt.commit.valid,true);jsonSafe(result);
  }
  const before=JSON.stringify(app.history);
  for(const input of ['https://example.test/image.png',{name:'spoof.png',type:'image/png',arrayBuffer:async()=>new ArrayBuffer(0)}]){
    const failed=await api.reference.import(input);
    assert.equal(failed.status,'FAILED');assert.equal(failed.diagnostics[0].code,'CHAT_REFERENCE_HANDOFF_BINARY_REQUIRED');
    assert.deepEqual(failed.createdRefs,[]);assert.equal(JSON.stringify(app.history),before);jsonSafe(failed);
  }
  assert.equal(imports,4);assert.equal(decoded,4);
});

test('Committed-error identity and failure diagnostics survive; missing authority and raw binary results fail closed',async()=>{
  const app=basicApp();const api=createInkPublicCreativeApi(app);
  assert.equal((await api.reference.import(new Blob())).diagnostics[0].code,'INK_AGENT_REFERENCE_AUTHORITY_UNAVAILABLE');
  app.chatReferenceHandoff={async importReference(){return {status:'COMMITTED_WITH_ERROR',referenceObjectId:'ref-1',targetLayerId:'layer-1',history:{commit:{valid:false}},error:{code:'RECEIPT_ERROR',message:'receipt'}};}};
  const committed=await api.reference.import(new Blob());
  assert.equal(committed.status,'COMMITTED_WITH_ERROR');assert.equal(committed.createdRefs[0].objectId,'ref-1');
  assert.equal(committed.diagnostics[0].code,'RECEIPT_ERROR');jsonSafe(committed);
  app.chatReferenceHandoff.importReference=async()=>{throw Object.assign(new Error('decode failed'),{code:'DECODE_FAILED'});};
  assert.equal((await api.reference.import(new Blob())).diagnostics[0].code,'DECODE_FAILED');
  app.chatReferenceHandoff.importReference=async()=>({status:'COMPLETED',bytes:new Blob(['secret'])});
  const binary=await api.reference.import(new Blob());
  assert.equal(binary.status,'FAILED');assert.equal(binary.diagnostics[0].code,'AGENT_RESULT_NON_PLAIN_OBJECT');jsonSafe(binary);
});

function editingApp(){
  const doc=defaultDocument(),page=doc.pages[0],layer=page.layers[0];
  for(const [id,fill,stroke] of [['color-path','#123456','none'],['line-path','none','#202020']]){
    layer.objects.push(createPath({id,fill,stroke,strokeWidth:1,subpaths:[{id:id+':outer',role:'outer',closed:true,
      anchors:[{x:0,y:0},{x:30,y:0},{x:30,y:30},{x:0,y:30}].map((p,i)=>({...p,id:id+':'+i}))}]}));
  }
  const app={doc,selection:[],dirty:false,draft:null,strokeEdit:null,
    page(){return this.doc.pages[0];},layer(){return this.page().layers[0];},
    findObject(ref){return findPageObject(this.page(),ref);},selectedObjects(){return [];},
    objectPath(found){return found?['pages',0,...found.path]:null;},queueSpatialObject(){},refreshAll(){},refreshSelectionUI(){},updateHistoryUI(){},markDirty(){this.dirty=true;},toast(){},renderer:{render(){}}};
  app.history=new HistoryManager(app);installRevision(app,{store:null});
  app.pathRepaintMaterial=new PathRepaintMaterialController(app);
  app.chatBoundedEdit=new ChatBoundedEditController(app);
  app.chatBoundedEditAdapter=createChatBoundedEditAdapter(app.chatBoundedEdit);
  app.chatCreativePlan=new ChatCreativePlanController(app);
  return app;
}

test('Two repaint steps use real bounded edit, History and Revision authorities with explicit approval',async()=>{
  const app=editingApp(),api=createInkPublicCreativeApi(app);
  const refs=['color-path','line-path'].map(objectId=>({pageId:app.page().id,layerId:app.layer().id,objectId}));
  const plan={intentSummary:'Color fill then Line stroke',steps:[
    {stepId:'color',operation:'path.repaint.v1',targets:[refs[0]],arguments:{fill:'#00b8d9'},dependsOn:[]},
    {stepId:'line',operation:'path.repaint.v1',targets:[refs[1]],arguments:{stroke:'#ff00aa'},dependsOn:['color']}]};
  const before=JSON.stringify({doc:app.doc,history:app.history.undoStack,revision:app.revisions.revisionIdFor(app.doc.id)});
  const proposal=await api.tools.invoke('use_ink',{action:'propose',plan});
  assert.equal(proposal.status,'PROPOSED');
  const planId=proposal.result.planId;
  const blocked=await api.tools.invoke('use_ink',{action:'execute',planId,approvalToken:'not-approved'});
  assert.equal(blocked.diagnostics[0].code,'CHAT_PLAN_APPROVAL_REQUIRED');
  assert.equal(JSON.stringify({doc:app.doc,history:app.history.undoStack,revision:app.revisions.revisionIdFor(app.doc.id)}),before);
  const approval=await api.tools.invoke('use_ink',{action:'approve',planId});
  const executed=await api.tools.invoke('use_ink',{action:'execute',planId,approvalToken:approval.result.approvalToken});
  assert.equal(executed.status,'COMPLETED',JSON.stringify(executed.diagnostics));
  assert.deepEqual(executed.result.stepResults.map(s=>s.stepId),['color','line']);
  assert.equal(app.findObject(refs[0]).object.fill,'#00b8d9');assert.equal(app.findObject(refs[1]).object.stroke,'#ff00aa');
  assert.equal(executed.historyReceipt.steps.length,2);assert.equal(app.history.undoStack.length,2);
  assert.equal(executed.revisionReceipt.endingRevisionId,app.revisions.revisionIdFor(app.doc.id));
  assert.equal(executed.revisionReceipt.captureSkipped,null);
  const revisions=await api.tools.invoke('get_ink_revisions');
  assert.ok(revisions.result.items.some(r=>r.revisionId===executed.revisionReceipt.endingRevisionId));jsonSafe(executed);
});

test('Content preview fractional max-dimension boundary stays within requested dimension and renderer sizing',async()=>{
  const doc=defaultDocument(),page=doc.pages[0];
  const contentBounds={x:12.25,y:8.5,w:1254.370453,h:600.25};
  let renderedPixelSize=null;
  const app={
    doc,
    page:()=>page,
    revisions:{revisionIdFor:()=>null},
    renderer:{contentBounds:()=>({...contentBounds})},
    async renderExportCanvas(options){
      const pad=24;
      const bounds={
        x:contentBounds.x-pad,
        y:contentBounds.y-pad,
        w:contentBounds.w+pad*2,
        h:contentBounds.h+pad*2
      };
      const width=Math.max(1,Math.ceil(bounds.w*options.scale));
      const height=Math.max(1,Math.ceil(bounds.h*options.scale));
      renderedPixelSize={width,height};
      return {width,height,toBlob(callback){callback(new Blob([Uint8Array.of(137,80,78,71)],{type:'image/png'}));}};
    }
  };
  const registry={store(handle){return handle;}};
  const result=await captureInkPreview(app,registry,{scope:'content',maxDimension:960,background:true});
  assert.deepEqual(renderedPixelSize,{width:960,height:478});
  assert.deepEqual(result.handle.pixelSize,renderedPixelSize);
  assert.ok(result.handle.pixelSize.width<=960&&result.handle.pixelSize.height<=960);
});

// Tiny pre-existing PNG byte fixtures exercise file transport only, never browser visual proof.
const pngA=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aXioAAAAASUVORK5CYII=','base64');
const pngB=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=','base64');
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
async function temporaryRoot(t){const dir=await mkdtemp(path.join(tmpdir(),'ink-smart-qa-'));t.after(()=>rm(dir,{recursive:true,force:true}));return dir;}

test('QA artifact bridge writes only the two fixed bounded PNGs and rejects duplicate/arbitrary/invalid payloads',async t=>{
  const dir=await temporaryRoot(t);await mkdir(path.join(dir,'qa/runtime'),{recursive:true});
  await writeFile(path.join(dir,'qa/runtime/harness.html'),'<!doctype html>');
  const {server,origin}=await startServer(dir,{id:'creative',file:'harness.html'},()=>{}, {evidenceDir:path.join(dir,'evidence')});
  t.after(()=>new Promise(resolve=>{server.closeAllConnections();server.close(resolve);}));
  const resolverResponse=await fetch(origin+'/__qa_smart_loop_resolver.js');
  assert.equal(resolverResponse.status,200);assert.match(resolverResponse.headers.get('content-type')||'',/javascript/);
  assert.equal(await resolverResponse.text(),
    "import { resolveInkOutputPayload } from '/src/agent/output-handle-registry.js';\n"+
    "window.__INK_SMART_LOOP_QA_RESOLVE = handleId => resolveInkOutputPayload(window.INK_APP, handleId);\n");
  const post=(phase,body,type='image/png')=>fetch(origin+'/__qa_smart_loop/'+phase,{method:'POST',headers:{'Content-Type':type},body});
  assert.equal((await post('other',pngA)).status,404);
  assert.equal((await post('before',pngA,'text/plain')).status,415);
  const response=await post('before',pngA);assert.equal(response.status,200);
  assert.deepEqual(await response.json(),{file:'smart-loop-before.png',byteLength:pngA.length,sha256:sha(pngA)});
  assert.deepEqual(await readFile(path.join(dir,'evidence/smart-loop-before.png')),pngA);
  assert.equal((await post('before',pngB)).status,409);
  assert.equal((await post('after',Buffer.from('not a PNG'))).status,400);
});

test('Artifact finalization binds fixture hash, real files, refs, plan, History, Revision and exact SHA; detects tampering',async t=>{
  const dir=await temporaryRoot(t);await mkdir(path.join(dir,'qa/fixtures/rose-window'),{recursive:true});await mkdir(path.join(dir,'evidence'));
  await writeFile(path.join(dir,'qa/fixtures/rose-window/rose-window-primary.png'),pngA);
  const refs=[{pageId:'p',layerId:'color',objectId:'c'},{pageId:'p',layerId:'line',objectId:'l'}];
  const proof={schema:'INK-SMART-CLOSED-LOOP-PROOF',version:1,returnPath:'RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT',
    fixture:'qa/fixtures/rose-window/rose-window-primary.png',source:{sha256:sha(pngA)},documentId:'d',pageId:'p',
    importHistory:{commit:{valid:true}},importProvenance:{status:'AVAILABLE',eventIds:['e']},decompositionHistory:{commit:{valid:true}},
    proposalStatus:'PROPOSED',blockedCode:'CHAT_PLAN_APPROVAL_REQUIRED',approval:{status:'APPROVED'},executionStatus:'COMPLETED',planId:'plan',
    targets:{color:refs[0],line:refs[1]},colorRefs:[refs[0]],lineRefs:[refs[1]],
    plan:{steps:refs.map((ref,i)=>({stepId:String(i),operation:'path.repaint.v1',targets:[ref]}))},
    stepResults:refs.map((ref,i)=>({stepId:String(i),ok:true,changed:true})),historyReceipt:{steps:[{history:{}},{history:{}}]},
    revisionReceipt:{startingRevisionId:null,endingRevisionId:'r',captureSkipped:null},artifacts:{}};
  for(const [phase,bytes] of [['before',pngA],['after',pngB]]){
    const file='smart-loop-'+phase+'.png';await writeFile(path.join(dir,'evidence',file),bytes);
    proof.artifacts[phase]={file,byteLength:bytes.length,sha256:sha(bytes),handle:{schema:'INK_OUTPUT_HANDLE',pixelSize:{width:1,height:1},
      byteLength:bytes.length,documentId:'d',pageId:'p',transport:'INTERNAL_EPHEMERAL',revisionId:phase==='after'?'r':null,renderFingerprint:phase}};
  }
  const evidence={smartLoop:proof,checks:smartLoopRequired.map(name=>({name,status:'PASS'}))};
  const record=await finalizeSmartLoopEvidence(dir,evidence,'a'.repeat(40));assert.equal(record.status,'PASS');
  assert.equal(JSON.parse(await readFile(path.join(dir,'evidence/smart-loop.json'),'utf8')).testedSha,'a'.repeat(40));
  await writeFile(path.join(dir,'evidence/smart-loop-after.png'),pngA);
  await assert.rejects(finalizeSmartLoopEvidence(dir,evidence,'a'.repeat(40)));
  await assert.rejects(finalizeSmartLoopEvidence(dir,{...evidence,checks:[]},'a'.repeat(40)));
});

test('Browser proof parses, keeps every required marker and uses connector flow plus QA-only payload resolver',async()=>{
  const harness=await readFile(path.join(root,'qa/runtime/ink-cloud-018-browser-harness.html'),'utf8');
  new Script(harness.match(/<script>([\s\S]*)<\/script>/)[1]); // Parse only; never execute arbitrary code.
  for(const name of smartLoopRequired){
    if(/PREVIEW_(BEFORE|AFTER)_MATERIALIZED/.test(name))continue; // Same bounded helper emits both phases.
    assert.ok(harness.includes(name),name);
  }
  for(const tool of ['get_ink_capabilities','import_ink_reference','decompose_ink_reference','get_ink_preview','use_ink'])assert.ok(harness.includes("smartApi.tools.invoke('"+tool+"'"));
  assert.ok(harness.indexOf("smartApi.tools.invoke('get_ink_capabilities'")<harness.indexOf("smartApi.tools.invoke('import_ink_reference'"));
  const historyStart=harness.indexOf("const smartHistory=await smartApi.tools.invoke('get_ink_history')");
  const historyEnd=harness.indexOf("const smartRevisionAfter=",historyStart);
  assert.ok(historyStart>=0&&historyEnd>historyStart,'smart History proof block');
  const historyProof=harness.slice(historyStart,historyEnd);
  assert.match(historyProof,/smartHistorySteps\.length===2/);
  assert.match(historyProof,/Number\.isInteger\(s\.history\?\.beforeUndoCount\)/);
  assert.match(historyProof,/s\.history\.afterUndoCount===s\.history\.beforeUndoCount\+1/);
  assert.match(historyProof,/s\.history\.latestLabel==='CHAT repaint Path'/);
  assert.match(historyProof,/entry\.captureMode==='scoped'/);
  assert.match(historyProof,/entry\.label==='CHAT repaint Path'/);
  assert.match(historyProof,/Number\(entry\.patchCount\)>0/);
  assert.doesNotMatch(historyProof,/objectIds/);
  assert.match(harness,/smartResolverScript\.src='\/__qa_smart_loop_resolver\.js'/);
  assert.match(harness,/delete w\.__INK_SMART_LOOP_QA_RESOLVE/);
  assert.match(harness,/SMART_LOOP_QA_RESOLVER_CLEANED_UP/);
  assert.doesNotMatch(harness,/smartResolverScript\.textContent|resolveInkOutputPayload|\beval\s*\(|new\s+Function\s*\(/);
  const runner=await readFile(path.join(root,'qa/runtime/run-ink-runtime-batch.mjs'),'utf8');
  assert.match(runner,/SMART_LOOP_RESOLVER_ROUTE\s*=\s*'\/__qa_smart_loop_resolver\.js'/);
  assert.match(runner,/resolveInkOutputPayload\(window\.INK_APP, handleId\)/);
  assert.doesNotMatch(runner,/WebSocket|postMessage|\beval\s*\(|new\s+Function\s*\(/);
  const api=await readFile(path.join(root,'product/source/src/agent/public-creative-api.js'),'utf8');
  assert.match(api,/await app\.chatReferenceHandoff\.importReference\(input, options\)/);
  assert.doesNotMatch(api,/__qa_smart_loop|__INK_SMART_LOOP|\bfetch\s*\(|WebSocket|postMessage|\beval\s*\(|new\s+Function\s*\(/);
});
