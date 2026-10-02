import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH];
  if (process.platform === 'win32') {
    for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      candidates.push(
        path.join(base, 'Google/Chrome/Application/chrome.exe'),
        path.join(base, 'Microsoft/Edge/Application/msedge.exe')
      );
    }
  } else {
    candidates.push('/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser','/opt/google/chrome/chrome');
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Installed Chrome/Chromium required; set INK_CHROMIUM_PATH');
  return found;
}

async function stopBrowser(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn(path.join(process.env.SystemRoot, 'System32/taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { shell:false, windowsHide:true, stdio:'ignore' });
    await new Promise(resolve => { killer.once('error', resolve); killer.once('exit', resolve); });
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
}

function cdpPipe(child) {
  const input = child.stdio?.[3], output = child.stdio?.[4];
  assert.ok(input?.writable && output?.readable, 'CDP pipe unavailable');
  let nextId=1, buffer=Buffer.alloc(0);
  const pending=new Map();
  const failAll=error=>{ for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error);} pending.clear(); };
  output.on('data',chunk=>{
    buffer=Buffer.concat([buffer,chunk]);
    while(true){
      const boundary=buffer.indexOf(0); if(boundary<0) break;
      const raw=buffer.subarray(0,boundary).toString('utf8'); buffer=buffer.subarray(boundary+1);
      if(!raw) continue;
      let message; try{message=JSON.parse(raw);}catch(error){failAll(error);continue;}
      if(!message.id) continue;
      const entry=pending.get(message.id); if(!entry) continue;
      pending.delete(message.id); clearTimeout(entry.timer);
      if(message.error) entry.reject(new Error(entry.method+': '+message.error.message));
      else entry.resolve(message.result||{});
    }
  });
  output.once('error',failAll); output.once('close',()=>failAll(new Error('CDP pipe closed')));
  const send=(method,params={},sessionId=null,timeoutMs=30000)=>new Promise((resolve,reject)=>{
    const id=nextId++;
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},timeoutMs);
    pending.set(id,{method,resolve,reject,timer});
    const message={id,method,params}; if(sessionId) message.sessionId=sessionId;
    input.write(JSON.stringify(message)+'\0');
  });
  return {send};
}

function mime(file) {
  const ext=path.extname(file).toLowerCase();
  return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'})[ext] || 'application/octet-stream';
}

async function startStaticServer(rootPath) {
  const root=path.resolve(rootPath);
  assert.ok(existsSync(path.join(root,'index.html')), 'Candidate product/source index.html missing');
  const server=createServer(async(req,res)=>{
    try{
      const url=new URL(req.url||'/', 'http://127.0.0.1');
      let pathname=decodeURIComponent(url.pathname);
      if(pathname==='/'||pathname.endsWith('/')) pathname += 'index.html';
      const file=path.resolve(root,'.'+pathname);
      const rootPrefix=(root.endsWith(path.sep)?root:root+path.sep).toLowerCase();
      if(file.toLowerCase()!==root.toLowerCase() && !file.toLowerCase().startsWith(rootPrefix)) {
        res.writeHead(403); res.end('forbidden'); return;
      }
      const bytes=await readFile(file);
      res.writeHead(200,{'Content-Type':mime(file),'Cache-Control':'no-store, max-age=0'});
      res.end(bytes);
    }catch(error){
      res.writeHead(error?.code==='ENOENT'?404:500,{'Content-Type':'text/plain; charset=utf-8'});
      res.end(error?.message||String(error));
    }
  });
  await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
  const address=server.address();
  return {server,baseUrl:'http://127.0.0.1:'+address.port+'/'};
}

async function stopServer(server) {
  if(!server) return;
  await new Promise(resolve=>server.close(()=>resolve()));
}

async function waitForInk(cdp,sessionId,baseUrl){
  const started=Date.now(); let last=null;
  while(Date.now()-started<30000){
    const probe=await cdp.send('Runtime.evaluate',{expression:"(() => ({href:location.href,readyState:document.readyState,apiReady:Boolean(window.INK_APP?.inkPublicApi?.tools?.invoke),toolCount:window.INK_APP?.inkPublicApi?.tools?.registry?.().length||0,appVersion:window.INK_APP?.doc?.appVersion||null}))()",returnByValue:true},sessionId,5000);
    last=probe.result?.value||null;
    if(last?.href?.startsWith(baseUrl)&&last?.readyState==='complete'&&last?.apiReady) return last;
    await new Promise(resolve=>setTimeout(resolve,100));
  }
  throw new Error('INK candidate readiness timeout: '+JSON.stringify(last));
}

async function evaluate(cdp,sessionId,expression,timeoutMs=60000){
  const result=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId,timeoutMs);
  if(result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text||'Runtime evaluation failed');
  return result.result?.value ?? null;
}

function validateRequest(request){
  assert.equal(request?.schema,'INK-SOURCE-CANDIDATE-QA-REQUEST');
  assert.equal(request?.version,1);
  assert.match(String(request?.requestId||''),/^[A-Za-z0-9_.:-]{1,120}$/);
  assert.match(String(request?.candidateSha||''),/^[a-f0-9]{40}$/);
  assert.ok(['paint-session-create','web-raster-bridge','raster-import-named-tool','raster-stack-b2'].includes(request?.case),'Unsupported candidate QA case');
  return request;
}

const PAINT_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['propose_ink_edit','approve_ink_edit','execute_ink_edit','undo_ink','redo_ink','get_ink_preview']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const hashCanvas=()=>{const text=app.el.canvas.toDataURL('image/png');let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const findField=(value,key,depth=0)=>{
    if(value==null||depth>8||typeof value!=='object') return undefined;
    if(Object.prototype.hasOwnProperty.call(value,key)) return value[key];
    for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}
    return undefined;
  };
  const before={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas()};
  const task={taskId:'qa-paint-session-create',operation:'paint.session.create.v1',targets:[],arguments:{name:'QA Paint Session',seed:37,opacity:1,strokes:[
    {brushId:'pencil',color:'#25384a',seed:101,samples:[{x:-110,y:-55,pressure:.25,timestamp:0},{x:-20,y:-95,pressure:.65,timestamp:20},{x:80,y:-30,pressure:.9,timestamp:40}]},
    {brushId:'watercolor',color:'#b86d83',seed:102,samples:[{x:-90,y:20,pressure:.35,timestamp:0},{x:0,y:70,pressure:.7,timestamp:22},{x:100,y:25,pressure:.5,timestamp:44}]}
  ]}};
  const proposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));
  if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
  const proposalId=findField(proposed,'proposalId'); if(!proposalId) throw new Error('PROPOSAL_ID_MISSING');
  const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
  if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
  const approvalToken=findField(approved,'approvalToken'); if(!approvalToken) throw new Error('APPROVAL_TOKEN_MISSING');
  const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
  if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const object=flatObjects().find(item=>item.type==='paint-session'&&item.name==='QA Paint Session');
  if(!object) throw new Error('PAINT_SESSION_OBJECT_MISSING');
  if(object.session?.strokes?.length!==2) throw new Error('PAINT_SESSION_STROKE_COUNT');
  if(!object.replay||!object.session) throw new Error('PAINT_SESSION_REPLAY_MISSING');
  const after={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas(),id:object.id,strokes:object.session.strokes.length,replayHash:object.replay.replayHash||object.replay.report?.replayHash||null};
  if(after.count!==before.count+1) throw new Error('PAINT_SESSION_OBJECT_COUNT');
  if(after.undo!==before.undo+1) throw new Error('PAINT_SESSION_HISTORY_COUNT');
  if(after.canvas===before.canvas) throw new Error('PAINT_SESSION_RENDER_UNCHANGED');
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{}));
  if(preview?.status==='FAILED') throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(undone?.status==='FAILED') throw new Error('UNDO_FAILED');
  if(flatObjects().some(item=>item.id===object.id)) throw new Error('UNDO_OBJECT_RETAINED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));
  if(redone?.status==='FAILED') throw new Error('REDO_FAILED');
  const restored=flatObjects().find(item=>item.id===object.id);
  if(!restored||restored.type!=='paint-session') throw new Error('REDO_OBJECT_MISSING');
  return {passed:true,before,after,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,restoredStrokeCount:restored.session?.strokes?.length||0};
})()`;

const RASTER_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(typeof app?.importWebRaster!=='function') throw new Error('IMPORT_WEB_RASTER_MISSING');
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const hashCanvas=()=>{const text=app.el.canvas.toDataURL('image/png');let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const before={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas()};
  const source=document.createElement('canvas');source.width=32;source.height=24;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,16,24);ctx.fillStyle='#375b9b';ctx.fillRect(16,0,16,24);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(8,6,16,12);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png')); if(!blob) throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster.png',{type:'image/png'});
  const object=await app.importWebRaster(file,{name:'QA Editable Raster',sourceChannel:'SOURCE_CANDIDATE_QA'});
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  if(!object?.rasterState?.colorRaster) throw new Error('RASTER_STATE_MISSING');
  const raster=object.rasterState.colorRaster;
  if(raster.width!==32||raster.height!==24||raster.channelCount!==3||raster.bitDepth!==8) throw new Error('RASTER_STATE_DIMENSION_OR_FORMAT');
  if(!Array.isArray(raster.data)||raster.data.length!==32*24*3) throw new Error('RASTER_RGB_DATA_INVALID');
  if(!Array.isArray(raster.alpha)||raster.alpha.length!==32*24) throw new Error('RASTER_ALPHA_INVALID');
  if(object.metadata?.source?.type!=='editable-web-raster') throw new Error('RASTER_PROVENANCE_TYPE');
  const after={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas(),id:object.id,width:raster.width,height:raster.height,sourceSha256:object.metadata?.rasterImport?.source?.sha256||null};
  if(after.count!==before.count+1) throw new Error('RASTER_OBJECT_COUNT');
  if(after.undo!==before.undo+1) throw new Error('RASTER_HISTORY_COUNT');
  if(after.canvas===before.canvas) throw new Error('RASTER_RENDER_UNCHANGED');
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{}));
  if(preview?.status==='FAILED') throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(undone?.status==='FAILED'||flatObjects().some(item=>item.id===object.id)) throw new Error('RASTER_UNDO_FAILED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));
  const restored=flatObjects().find(item=>item.id===object.id);
  if(redone?.status==='FAILED'||!restored?.rasterState?.colorRaster) throw new Error('RASTER_REDO_FAILED');
  return {passed:true,before,after,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,restoredFormat:restored.rasterState.type||null};
})()`;


const RASTER_NAMED_TOOL_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const hashCanvas=()=>{const text=app.el.canvas.toDataURL('image/png');let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const before={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas()};
  const source=document.createElement('canvas');source.width=32;source.height=24;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,16,24);ctx.fillStyle='#375b9b';ctx.fillRect(16,0,16,24);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(8,6,16,12);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png')); if(!blob) throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-named-tool.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA Named Raster',type:'image/png',intent:'B1 candidate QA'}}));
  if(imported?.status==='FAILED') throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0]; if(!ref?.objectId) throw new Error('RASTER_CREATED_REF_MISSING');
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const object=flatObjects().find(item=>item.id===ref.objectId);
  if(!object?.rasterState?.colorRaster) throw new Error('RASTER_STATE_MISSING');
  const raster=object.rasterState.colorRaster;
  if(raster.width!==32||raster.height!==24||raster.channelCount!==3||raster.bitDepth!==8) throw new Error('RASTER_STATE_DIMENSION_OR_FORMAT');
  if(object.metadata?.source?.type!=='editable-web-raster') throw new Error('RASTER_PROVENANCE_TYPE');
  const serialized=JSON.stringify(imported);
  if(serialized.includes('data:image/')||serialized.includes('base64,')) throw new Error('RASTER_RESULT_BINARY_LEAK');
  const after={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas(),id:object.id,width:raster.width,height:raster.height,sourceSha256:object.metadata?.rasterImport?.source?.sha256||null};
  if(after.count!==before.count+1) throw new Error('RASTER_OBJECT_COUNT');
  if(after.undo!==before.undo+1) throw new Error('RASTER_HISTORY_COUNT');
  if(after.canvas===before.canvas) throw new Error('RASTER_RENDER_UNCHANGED');
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{}));
  if(preview?.status==='FAILED') throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(undone?.status==='FAILED'||flatObjects().some(item=>item.id===object.id)) throw new Error('RASTER_UNDO_FAILED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));
  const restored=flatObjects().find(item=>item.id===object.id);
  if(redone?.status==='FAILED'||!restored?.rasterState?.colorRaster) throw new Error('RASTER_REDO_FAILED');
  return {passed:true,before,after,importStatus:imported.status,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,restoredFormat:restored.rasterState.type||null};
})()`;

const RASTER_STACK_B2_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const hashCanvas=()=>{const text=app.el.canvas.toDataURL('image/png');let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const findField=(value,key,depth=0)=>{if(value==null||depth>10||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const edit=async(task)=>{
    const proposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+task.operation+':'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING:'+task.operation);
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+task.operation+':'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING:'+task.operation);
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+task.operation+':'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED:'+task.operation);
    await waitFrames();return executed;
  };
  app.history.clear();
  await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-underlay',operation:'path.create.v1',targets:[],arguments:{shape:'rectangle',x:0,y:0,width:64,height:48,fill:'#e3b957',stroke:'none',strokeWidth:0,opacity:1}});
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(10,8,44,12);ctx.fillStyle='rgba(20,20,20,.45)';ctx.fillRect(18,26,28,14);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-stack-b2.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B2 Raster',type:'image/png',intent:'B2 candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_CREATED_REF_MISSING');
  await waitFrames();let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');
  app.history.clear();
  const baselineHash=hashCanvas(),receipts=[];
  const runStackEdit=async(operation,args,index)=>{
    object=flatObjects().find(item=>item.id===ref.objectId);
    const beforeState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
    const beforeFingerprint=beforeState?.stateFingerprint||null,beforeHash=hashCanvas(),beforeUndo=app.history.undoStack.length;
    const result=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-'+index,operation,targets:[ref],arguments:args});
    object=flatObjects().find(item=>item.id===ref.objectId);
    const afterState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
    const afterFingerprint=afterState?.stateFingerprint||null,afterHash=hashCanvas(),afterUndo=app.history.undoStack.length;
    if(!beforeFingerprint||!afterFingerprint||beforeFingerprint===afterFingerprint)throw new Error('STATE_FINGERPRINT_UNCHANGED:'+operation);
    if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT:'+operation);
    if(afterHash===beforeHash)throw new Error('RENDER_UNCHANGED:'+operation);
    receipts.push({operation,beforeFingerprint,afterFingerprint,beforeHash,afterHash,historyLabel:app.history.undoStack.at(-1)?.label||null,controllerResult:findField(result,'controllerResult')||null});
  };
  await runStackEdit('image.adjustment.add.v1',{type:'brightnessContrast',params:{brightness:18,contrast:22},opacity:1},1);
  if(object.adjustments?.length!==1||object.adjustments[0]?.type!=='brightnessContrast')throw new Error('ADJUSTMENT_STACK_INVALID');
  await runStackEdit('image.filter.add.v1',{type:'gaussianBlur',params:{radius:2},opacity:1},2);
  if(object.filterStack?.length!==1||object.filterStack[0]?.type!=='gaussianBlur')throw new Error('FILTER_STACK_INVALID');
  await runStackEdit('image.blend.set.v1',{mode:'multiply'},3);if(object.blendMode!=='multiply')throw new Error('BLEND_MODE_INVALID');
  await runStackEdit('image.effect.add.v1',{type:'dropShadow',params:{color:'#000000',opacity:.65,offsetX:5,offsetY:4,blur:5,spread:1},opacity:1},4);
  if(object.effects?.length!==1||object.effects[0]?.type!=='dropShadow')throw new Error('EFFECT_STACK_INVALID');
  await runStackEdit('image.liquify.add.v1',{operations:[{type:'twirl',x:32,y:24,radius:18,strength:.45,angle:18}],opacity:1,maxWork:1000000},5);
  if(object.filterStack?.length!==2||object.filterStack[1]?.type!=='liquify')throw new Error('LIQUIFY_STACK_INVALID');
  const finalHash=hashCanvas();if(finalHash===baselineHash)throw new Error('B2_FINAL_RENDER_UNCHANGED');
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(preview?.status==='FAILED')throw new Error('PREVIEW_FAILED');
  const beforeUndoFilterCount=object.filterStack.length;
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  object=flatObjects().find(item=>item.id===ref.objectId);if(!object||object.filterStack?.length!==beforeUndoFilterCount-1||object.filterStack?.some(item=>item.type==='liquify'))throw new Error('LIQUIFY_UNDO_FAILED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  object=flatObjects().find(item=>item.id===ref.objectId);if(!object||object.filterStack?.length!==beforeUndoFilterCount||object.filterStack.at(-1)?.type!=='liquify')throw new Error('LIQUIFY_REDO_FAILED');
  return {passed:true,objectId:ref.objectId,historyCount:app.history.undoStack.length,adjustmentCount:object.adjustments?.length||0,filterCount:object.filterStack?.length||0,effectCount:object.effects?.length||0,blendMode:object.blendMode||null,baselineHash,finalHash,receipts,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status};
})()`;

async function run(){
  const requestPath=path.resolve(process.argv[2]);
  const candidateRoot=path.resolve(process.argv[3]);
  const outputPath=path.resolve(process.argv[4]);
  const screenshotPath=path.resolve(process.argv[5]);
  const request=validateRequest(JSON.parse(await readFile(requestPath,'utf8')));
  const browser=findBrowser();
  const profile=await mkdtemp(path.join(process.env.RUNNER_TEMP||'.','ink-source-candidate-'));
  let child, server, stderr='';
  try{
    const hosted=await startStaticServer(candidateRoot);server=hosted.server;
    child=spawn(browser,['--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions','--remote-debugging-pipe','--disable-cache',`--user-data-dir=${profile}`,'about:blank'],{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe','pipe','pipe']});
    child.stderr.on('data',chunk=>{if(stderr.length<12000)stderr+=chunk.toString();});
    const cdp=cdpPipe(child);await cdp.send('Browser.getVersion');
    const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await cdp.send('Target.attachToTarget',{targetId,flatten:true});
    await cdp.send('Page.enable',{},sessionId);await cdp.send('Runtime.enable',{},sessionId);
    const url=hosted.baseUrl+'?sourceCandidate='+encodeURIComponent(request.candidateSha);
    const nav=await cdp.send('Page.navigate',{url},sessionId,30000);assert.ok(!nav.errorText,nav.errorText||'Navigation failed');
    const identity=await waitForInk(cdp,sessionId,hosted.baseUrl);
    const caseExpression=request.case==='paint-session-create'?PAINT_CASE:(request.case==='web-raster-bridge'?RASTER_CASE:(request.case==='raster-import-named-tool'?RASTER_NAMED_TOOL_CASE:RASTER_STACK_B2_CASE));
    const caseResult=await evaluate(cdp,sessionId,caseExpression,90000);
    assert.equal(caseResult?.passed,true,'Candidate case did not pass');
    const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false},sessionId,30000);
    await writeFile(screenshotPath,Buffer.from(shot.data,'base64'));
    await writeFile(outputPath,JSON.stringify({schema:'INK-SOURCE-CANDIDATE-QA-RESULT',version:1,requestId:request.requestId,candidateSha:request.candidateSha,case:request.case,runtimeIdentity:identity,result:caseResult,status:'PASS'},null,2));
  }catch(error){
    await writeFile(outputPath,JSON.stringify({schema:'INK-SOURCE-CANDIDATE-QA-RESULT',version:1,requestId:request?.requestId||null,candidateSha:request?.candidateSha||null,case:request?.case||null,status:'FAIL',error:error?.message||String(error),stderr:stderr.slice(-4000)},null,2));
    process.exitCode=1;
  }finally{
    await stopBrowser(child);await stopServer(server);await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:150});
  }
}
await run();
