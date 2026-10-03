import { B4_BROWSER_CASE } from '../shared/b4-browser-case.mjs';
import { PAPER_WEBGL_ROUGHNESS_CASE } from '../shared/paper-webgl-roughness-case.mjs';
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
  assert.ok(['path-deformation-b4','page-paper-webgl-roughness','page-paper-a3','page-paper-single-stroke','paint-session-create','stroke-create-a2','stroke-erase-a4','web-raster-bridge','raster-import-named-tool','raster-stack-b2','raster-stack-adjustment-b2','raster-stack-filter-b2','raster-stack-blend-b2','raster-stack-effect-b2','raster-stack-liquify-b2'].includes(request?.case),'Unsupported candidate QA case');
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
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED') throw new Error('PREVIEW_FAILED');
  const previewBounds=preview?.result?.bounds||preview?.outputHandles?.[0]?.bounds||null;
  if(!(previewBounds?.w>200&&previewBounds?.h>160)) throw new Error('PAINT_SESSION_CONTENT_BOUNDS:'+JSON.stringify(previewBounds));
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(undone?.status==='FAILED') throw new Error('UNDO_FAILED');
  if(flatObjects().some(item=>item.id===object.id)) throw new Error('UNDO_OBJECT_RETAINED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));
  if(redone?.status==='FAILED') throw new Error('REDO_FAILED');
  const restored=flatObjects().find(item=>item.id===object.id);
  if(!restored||restored.type!=='paint-session') throw new Error('REDO_OBJECT_MISSING');
  return {passed:true,before,after,previewStatus:preview.status,previewBounds,undoStatus:undone.status,redoStatus:redone.status,restoredStrokeCount:restored.session?.strokes?.length||0};
})()`;

const STROKE_A2_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
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
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const edit=async(task)=>{
    const proposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING');
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();
    return {executed,objectId:findField(executed,'objectId')};
  };
  const before={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas()};
  const specs=[
    {taskId:'qa-a2-pencil',name:'QA A2 Pencil',kind:'pencil',color:'#243746',size:6,opacity:.82,smoothing:.42,pressure:.78,grain:.68,samples:[
      {x:-170,y:-105,pressure:.22,timestamp:0,tiltX:2,tiltY:8},{x:-95,y:-135,pressure:.7,timestamp:24,tiltX:6,tiltY:10},{x:-20,y:-80,pressure:.9,timestamp:48,tiltX:4,tiltY:5}
    ]},
    {taskId:'qa-a2-brush',name:'QA A2 Brush',kind:'brush',color:'#8f3f58',size:20,opacity:.9,smoothing:.46,pressure:.95,taper:.36,flow:.78,wetness:.62,bristle:.28,samples:[
      {x:20,y:-105,pressure:.3,timestamp:0,tiltX:-4,tiltY:7},{x:90,y:-140,pressure:.88,timestamp:24,tiltX:-8,tiltY:12},{x:170,y:-72,pressure:.52,timestamp:48,tiltX:-3,tiltY:4}
    ]},
    {taskId:'qa-a2-airbrush',name:'QA A2 Airbrush',kind:'airbrush',color:'#42689a',size:44,opacity:.28,smoothing:.7,pressure:.6,softness:.86,flow:.55,samples:[
      {x:-170,y:35,pressure:.28,timestamp:0},{x:-95,y:78,pressure:.7,timestamp:25},{x:-20,y:105,pressure:.42,timestamp:50}
    ]},
    {taskId:'qa-a2-drybrush',name:'QA A2 DryBrush',kind:'drybrush',color:'#6a573e',size:26,opacity:.65,smoothing:.36,pressure:.9,taper:.3,grain:.82,flow:.58,wetness:.08,bristle:.78,samples:[
      {x:20,y:35,pressure:.32,timestamp:0},{x:95,y:92,pressure:.86,timestamp:25},{x:170,y:55,pressure:.48,timestamp:50}
    ]}
  ];
  const created=[];
  for(const spec of specs){
    const {objectId}=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:spec.taskId,operation:'stroke.create.v1',targets:[],arguments:spec});
    if(!objectId) throw new Error('STROKE_OBJECT_ID_MISSING:'+spec.kind);
    const object=flatObjects().find(item=>item.id===objectId);
    if(!object||object.type!=='stroke'||object.kind!==spec.kind) throw new Error('STROKE_OBJECT_INVALID:'+spec.kind);
    if(object.points?.length!==spec.samples.length) throw new Error('STROKE_POINT_COUNT:'+spec.kind);
    const natural=['brush','drybrush','airbrush'].includes(spec.kind);
    if(natural&&object.mediaModel!=='natural-v2') throw new Error('NATURAL_MEDIA_MODEL_MISSING:'+spec.kind);
    if(natural&&!app.renderer?.naturalMedia?.supports?.(object)) throw new Error('NATURAL_MEDIA_CONTROLLER_REJECTED:'+spec.kind);
    if(!natural&&app.renderer?.naturalMedia?.supports?.(object)) throw new Error('PENCIL_NATURAL_MEDIA_MISROUTE');
    created.push({id:object.id,kind:object.kind,mediaModel:object.mediaModel||null,pointCount:object.points.length});
  }
  const after={count:flatObjects().length,undo:app.history.undoStack.length,canvas:hashCanvas()};
  if(after.count!==before.count+4) throw new Error('STROKE_OBJECT_COUNT');
  if(after.undo!==before.undo+4) throw new Error('STROKE_HISTORY_COUNT');
  if(after.canvas===before.canvas) throw new Error('STROKE_RENDER_UNCHANGED');
  const historyLabels=app.history.undoStack.slice(-4).map(entry=>entry.label);
  if(historyLabels.some(label=>label!=='CHAT create Stroke')) throw new Error('STROKE_HISTORY_LABEL');
  const inspected=app.chatBoundedEdit.inspect().objects.filter(item=>created.some(entry=>entry.id===item.ref?.objectId));
  if(inspected.length!==4||inspected.some(item=>item.type!=='stroke')) throw new Error('STROKE_CONTEXT_SUMMARY');
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED') throw new Error('PREVIEW_FAILED');
  const previewBounds=preview?.result?.bounds||preview?.outputHandles?.[0]?.bounds||null;
  if(!(previewBounds?.w>300&&previewBounds?.h>180)) throw new Error('STROKE_CONTENT_BOUNDS:'+JSON.stringify(previewBounds));
  const lastId=created.at(-1).id;
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(undone?.status==='FAILED'||flatObjects().some(item=>item.id===lastId)) throw new Error('STROKE_UNDO_FAILED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));
  if(redone?.status==='FAILED') throw new Error('STROKE_REDO_FAILED');
  await waitFrames();
  const restored=flatObjects().find(item=>item.id===lastId);
  if(!restored||restored.type!=='stroke'||restored.kind!=='drybrush') throw new Error('STROKE_REDO_OBJECT_MISSING');
  const redoCanvas=hashCanvas();
  if(redoCanvas!==after.canvas) throw new Error('STROKE_REDO_RENDER_NOT_RESTORED');
  return {
    passed:true,
    operation:'stroke.create.v1',
    created,
    before,
    after,
    historyLabels,
    previewStatus:preview.status,
    previewBounds,
    undoStatus:undone.status,
    redoStatus:redone.status,
    redoCanvas,
    naturalMedia:app.renderer?.naturalMedia?.diagnostics?.()||null
  };
})()`;

const STROKE_ERASE_A4_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const hashCanvas=()=>{const text=app.el.canvas.toDataURL('image/png');let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16);};
  const findField=(value,key,depth=0)=>{
    if(value==null||depth>10||typeof value!=='object')return undefined;
    if(Object.prototype.hasOwnProperty.call(value,key))return value[key];
    for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}
    return undefined;
  };
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const invokeEdit=async(task)=>{
    const proposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));
    if(proposed?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+task.operation+':'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING:'+task.operation);
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED')throw new Error('APPROVE_FAILED:'+task.operation+':'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING:'+task.operation);
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+task.operation+':'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED:'+task.operation);
    await waitFrames();
    return executed;
  };
  const preview=async()=>{
    const value=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:false}));
    if(value?.status==='FAILED')throw new Error('PREVIEW_FAILED:'+JSON.stringify(value.diagnostics||[]));
    return {value,fingerprint:findField(value,'renderFingerprint')||findField(value,'fingerprint')||null,bounds:findField(value,'bounds')||null};
  };

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'stroke.erase.circle.v1'}));
  if(descriptor?.status==='FAILED')throw new Error('ERASER_CAPABILITY_MISSING:'+JSON.stringify(descriptor.diagnostics||[]));

  const create=await invokeEdit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-a4-source-stroke',operation:'stroke.create.v1',targets:[],arguments:{
    objectId:'qa-a4-source-stroke',name:'QA A4 Source Stroke',kind:'pencil',color:'#2c4456',size:14,opacity:.9,smoothing:.2,pressure:.8,grain:.35,
    samples:[
      {x:-180,y:0,pressure:.7,timestamp:0},
      {x:-90,y:0,pressure:.78,timestamp:20},
      {x:0,y:0,pressure:.85,timestamp:40},
      {x:90,y:0,pressure:.78,timestamp:60},
      {x:180,y:0,pressure:.7,timestamp:80}
    ]
  }});
  const source=flatObjects().find(item=>item.id==='qa-a4-source-stroke');
  if(!source||source.type!=='stroke')throw new Error('SOURCE_STROKE_MISSING');
  const ref={pageId:app.page().id,layerId:app.page().activeLayerId,objectId:source.id};
  app.history.clear();
  await waitFrames();
  const baseline={canvas:hashCanvas(),preview:await preview(),pointCount:source.points?.length||0};

  const erased=await invokeEdit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-a4-erase-main',operation:'stroke.erase.circle.v1',targets:[ref],arguments:{x:0,y:0,radius:32}});
  const controllerResult=findField(erased,'controllerResult')||{};
  if(controllerResult.erasedTargetCount!==1)throw new Error('ERASE_TARGET_COUNT:'+JSON.stringify(controllerResult));
  if(controllerResult.fragmentCount!==2)throw new Error('ERASE_FRAGMENT_COUNT:'+JSON.stringify(controllerResult));
  if(flatObjects().some(item=>item.id===source.id))throw new Error('SOURCE_STROKE_RETAINED');
  const fragments=flatObjects().filter(item=>item.type==='stroke'&&item.name==='QA A4 Source Stroke');
  if(fragments.length!==2)throw new Error('FRAGMENT_OBJECT_COUNT:'+fragments.length);
  if(fragments.some(item=>item.kind!=='pencil'))throw new Error('FRAGMENT_KIND_CHANGED');
  const fragmentIds=fragments.map(item=>item.id).sort();
  if(new Set(fragmentIds).size!==2)throw new Error('FRAGMENT_IDS_NOT_UNIQUE');
  if(app.history.undoStack.length!==1||app.history.undoStack.at(-1)?.label!=='CHAT erase Stroke')throw new Error('ERASER_HISTORY_INVALID:'+JSON.stringify(app.history.undoStack.map(x=>x.label)));
  const after={canvas:hashCanvas(),preview:await preview(),fragmentIds};
  if(after.canvas===baseline.canvas)throw new Error('ERASER_CANVAS_UNCHANGED');
  if(after.preview.fingerprint&&baseline.preview.fingerprint&&after.preview.fingerprint===baseline.preview.fingerprint)throw new Error('ERASER_PREVIEW_UNCHANGED');

  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  const undoSource=flatObjects().find(item=>item.id===source.id);
  if(!undoSource||undoSource.type!=='stroke')throw new Error('UNDO_SOURCE_NOT_RESTORED');
  if(fragmentIds.some(id=>flatObjects().some(item=>item.id===id)))throw new Error('UNDO_FRAGMENT_RETAINED');
  const undoState={canvas:hashCanvas(),preview:await preview()};
  if(undoState.canvas!==baseline.canvas)throw new Error('UNDO_CANVAS_MISMATCH');
  if(baseline.preview.fingerprint&&undoState.preview.fingerprint!==baseline.preview.fingerprint)throw new Error('UNDO_PREVIEW_MISMATCH');

  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));
  if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();
  const redoIds=flatObjects().filter(item=>item.type==='stroke'&&item.name==='QA A4 Source Stroke').map(item=>item.id).sort();
  if(JSON.stringify(redoIds)!==JSON.stringify(fragmentIds))throw new Error('REDO_FRAGMENT_IDS_MISMATCH:'+JSON.stringify({fragmentIds,redoIds}));
  const redoState={canvas:hashCanvas(),preview:await preview()};
  if(redoState.canvas!==after.canvas)throw new Error('REDO_CANVAS_MISMATCH');
  if(after.preview.fingerprint&&redoState.preview.fingerprint!==after.preview.fingerprint)throw new Error('REDO_PREVIEW_MISMATCH');

  const restore=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(restore?.status==='FAILED')throw new Error('RESTORE_UNDO_FAILED');
  await waitFrames();
  const staleProposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:{schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-a4-stale-erase',operation:'stroke.erase.circle.v1',targets:[ref],arguments:{x:0,y:0,radius:24}}}));
  if(staleProposed?.status==='FAILED')throw new Error('STALE_PROPOSE_SETUP_FAILED');
  const staleProposalId=findField(staleProposed,'proposalId');if(!staleProposalId)throw new Error('STALE_PROPOSAL_ID_MISSING');
  await invokeEdit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-a4-stale-mutation',operation:'object.translate.v1',targets:[ref],arguments:{dx:7,dy:0}});
  const staleApprove=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleProposalId}));
  if(staleApprove?.status!=='FAILED')throw new Error('STALE_PROPOSAL_NOT_REJECTED');
  const staleCode=findField(staleApprove,'code');
  if(!['STALE_REVISION','TARGET_STALE'].includes(staleCode))throw new Error('STALE_DIAGNOSTIC_UNEXPECTED:'+JSON.stringify(staleApprove));
  const untranslate=await Promise.resolve(api.tools.invoke('undo_ink',{}));
  if(untranslate?.status==='FAILED')throw new Error('STALE_MUTATION_UNDO_FAILED');
  await waitFrames();

  const noOpProposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:{schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-a4-noop',operation:'stroke.erase.circle.v1',targets:[ref],arguments:{x:900,y:900,radius:10}}}));
  if(noOpProposed?.status==='FAILED')throw new Error('NOOP_PROPOSE_FAILED');
  const noOpProposalId=findField(noOpProposed,'proposalId');if(!noOpProposalId)throw new Error('NOOP_PROPOSAL_ID_MISSING');
  const noOpApproved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:noOpProposalId}));
  if(noOpApproved?.status==='FAILED')throw new Error('NOOP_APPROVE_FAILED');
  const noOpToken=findField(noOpApproved,'approvalToken');if(!noOpToken)throw new Error('NOOP_TOKEN_MISSING');
  const noOpExecuted=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:noOpProposalId,approvalToken:noOpToken}));
  if(noOpExecuted?.status!=='FAILED'||findField(noOpExecuted,'code')!=='NO_OP')throw new Error('NOOP_NOT_REJECTED:'+JSON.stringify(noOpExecuted));

  return {
    passed:true,
    descriptorStatus:descriptor.status,
    sourceId:source.id,
    fragmentIds,
    baselineCanvas:baseline.canvas,
    erasedCanvas:after.canvas,
    previewBefore:baseline.preview.fingerprint,
    previewAfter:after.preview.fingerprint,
    undoCanvas:undoState.canvas,
    redoCanvas:redoState.canvas,
    historyLabel:'CHAT erase Stroke',
    staleCode,
    noOpCode:findField(noOpExecuted,'code'),
    controllerResult
  };
})()`;


const PAPER_A3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app.inkPublicApi;
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const invoke=(tool,input={})=>Promise.resolve(api.tools.invoke(tool,input));
  const find=(v,k)=>{if(!v||typeof v!=='object')return; if(Object.hasOwn(v,k))return v[k];for(const a of Object.values(v)){const r=find(a,k);if(r!==undefined)return r;}};
  const task=(id,key,value)=>({taskId:id,operation:'page.paper.set.v1',targets:[],arguments:{key,value}});
  const propose=async t=>{const r=await invoke('propose_ink_edit',{task:t});if(r.status!=='PROPOSED')throw new Error('PROPOSE:'+JSON.stringify(r));return find(r,'proposalId');};
  const edit=async t=>{const proposalId=await propose(t);const a=await invoke('approve_ink_edit',{proposalId});const r=await invoke('execute_ink_edit',{proposalId,approvalToken:find(a,'approvalToken')});if(r.status!=='EXECUTED'||find(r,'changed')!==true)throw new Error('EXECUTE:'+JSON.stringify(r));return r;};
  const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const preview=async()=>{await frames();const r=await invoke('get_ink_preview',{scope:'content',background:false,maxDimension:800});if(r.status!=='COMPLETED')throw new Error('PREVIEW');return r.outputHandles[0].renderFingerprint;};
  const descriptor=await invoke('describe_ink_capability',{idOrToolName:'page.paper.set.v1'});
  if(descriptor.status==='FAILED')throw new Error('DISCOVERY');
  const paper0=JSON.parse(JSON.stringify(app.page().paper));
  const strokeTask={taskId:'qa-a3-natural-stroke',operation:'stroke.create.v1',targets:[],arguments:{kind:'brush',color:'#8f3f58',size:72,opacity:.85,flow:.75,wetness:.8,grain:.4,bristle:.4,samples:[{x:-120,y:-20,pressure:.3,timestamp:0},{x:0,y:70,pressure:.9,timestamp:24},{x:120,y:-40,pressure:.6,timestamp:48}]}};
  await edit(strokeTask);
  await edit({...strokeTask,taskId:'qa-a3-natural-stroke-2',arguments:{...strokeTask.arguments,kind:'drybrush',wetness:.2,color:'#42689a',samples:[{x:-100,y:45,pressure:.4,timestamp:0},{x:15,y:-45,pressure:.85,timestamp:24},{x:100,y:40,pressure:.65,timestamp:48}]}});
  const baseline=await preview();
  const objectBefore=JSON.stringify(app.page().layers.flatMap(l=>l.objects));
  const beforeUndo=app.history.undoStack.length;
  const proposedId=await propose(task('qa-a3-roughness','roughness',.95));
  if(JSON.stringify(app.page().paper)!==JSON.stringify(paper0)||app.history.undoStack.length!==beforeUndo)throw new Error('PROPOSE_MUTATED');
  const approval=await invoke('approve_ink_edit',{proposalId:proposedId});
  const rough=await invoke('execute_ink_edit',{proposalId:proposedId,approvalToken:find(approval,'approvalToken')});
  if(rough.status!=='EXECUTED'||find(rough,'changed')!==true||app.page().paper.roughness!==.95)throw new Error('ROUGHNESS');
  const roughPreview=await preview();
  await edit(task('qa-a3-absorbency','absorbency',.05));const changedPreview=await preview();
  if(app.page().paper.absorbency!==.05||app.history.undoStack.length!==beforeUndo+2)throw new Error('PAPER_HISTORY');
  if(changedPreview===baseline)throw new Error('NATURAL_PAPER_RENDER_NO_DELTA');
  if(JSON.stringify(app.page().layers.flatMap(l=>l.objects))!==objectBefore)throw new Error('PAPER_MUTATED_STROKE');
  const paperAfter=JSON.parse(JSON.stringify(app.page().paper));
  const fingerprint=find(rough,'paperProfileFingerprint');if(!fingerprint)throw new Error('PROFILE_RECEIPT');
  await invoke('undo_ink');await invoke('undo_ink');
  if(JSON.stringify(app.page().paper)!==JSON.stringify(paper0)||(await preview())!==baseline)throw new Error('UNDO_PAPER_RENDER');
  await invoke('redo_ink');await invoke('redo_ink');
  if(JSON.stringify(app.page().paper)!==JSON.stringify(paperAfter)||(await preview())!==changedPreview)throw new Error('REDO_PAPER_RENDER');
  const rejectCases=[['unknown',1],['roughness',2],['seed',1.5],['textureVisible','false'],['color','url(https://example.com/)']];
  for(let i=0;i<rejectCases.length;i++){const [key,value]=rejectCases[i];const r=await invoke('propose_ink_edit',{task:task('qa-a3-invalid-'+i,key,value)});if(r.status!=='FAILED')throw new Error('INVALID_ACCEPTED:'+key);}
  const noOp=await invoke('propose_ink_edit',{task:task('qa-a3-noop','roughness',.95)});if(noOp.status!=='FAILED')throw new Error('NOOP_ACCEPTED');
  const staleId=await propose(task('qa-a3-stale','roughness',.6));const staleA=await invoke('approve_ink_edit',{proposalId:staleId});
  app.page().paper.seed+=1;const n=app.history.undoStack.length;
  const stale=await invoke('execute_ink_edit',{proposalId:staleId,approvalToken:find(staleA,'approvalToken')});
  app.page().paper.seed-=1;
  if(stale.status!=='FAILED'||!JSON.stringify(stale).includes('STALE_PAPER')||app.history.undoStack.length!==n)throw new Error('STALE_NOT_REJECTED');
  app.paperPreview={key:'roughness',before:.95};const busy=await invoke('propose_ink_edit',{task:task('qa-a3-busy','roughness',.6)});app.paperPreview=null;
  if(busy.status!=='FAILED'||!JSON.stringify(busy).includes('PAPER_PREVIEW_BUSY'))throw new Error('PREVIEW_BUSY_NOT_REJECTED');
  app.renderer.render();
  return {passed:true,operation:'page.paper.set.v1',paperCoupledRunStrokeCount:2,paperBefore:paper0,paperAfter,baseline,roughPreview,changedPreview,undoRedoRenderExact:true,scopedPaperEntries:app.history.undoStack.slice(-2).map(e=>({label:e.label,captureMode:e.captureMode})),paperProfileFingerprint:fingerprint,invalidCasesRejected:rejectCases.length,noOpRejected:true,staleRejected:true,pendingPreviewRejected:true,naturalMedia:app.renderer.naturalMedia.diagnostics()};
})()`;


const PAPER_SINGLE_STROKE_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app.inkPublicApi;
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const invoke=(tool,input={})=>Promise.resolve(api.tools.invoke(tool,input));
  const find=(v,k)=>{if(!v||typeof v!=='object')return;if(Object.hasOwn(v,k))return v[k];for(const a of Object.values(v)){const r=find(a,k);if(r!==undefined)return r;}};
  const frames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const preview=async()=>{await frames();const r=await invoke('get_ink_preview',{scope:'content',background:false,maxDimension:800});if(r.status!=='COMPLETED')throw new Error('PREVIEW');return r.outputHandles[0].renderFingerprint;};
  const edit=async task=>{
    const p=await invoke('propose_ink_edit',{task});if(p.status!=='PROPOSED')throw new Error('PROPOSE:'+JSON.stringify(p));
    const proposalId=find(p,'proposalId'),a=await invoke('approve_ink_edit',{proposalId});
    const r=await invoke('execute_ink_edit',{proposalId,approvalToken:find(a,'approvalToken')});
    if(r.status!=='EXECUTED'||find(r,'changed')!==true)throw new Error('EXECUTE:'+JSON.stringify(r));
    return r;
  };
  const paperTask=(id,key,value)=>({taskId:id,operation:'page.paper.set.v1',targets:[],arguments:{key,value}});
  const strokeTask=(id,kind)=>({taskId:id,operation:'stroke.create.v1',targets:[],arguments:{
    kind,color:kind==='drybrush'?'#42689a':'#8f3f58',size:72,opacity:.85,flow:.75,
    wetness:kind==='drybrush'?.22:.82,grain:kind==='drybrush'?.82:.4,bristle:kind==='drybrush'?.78:.4,
    samples:[{x:-120,y:-20,pressure:.3,timestamp:0},{x:0,y:70,pressure:.9,timestamp:24},{x:120,y:-40,pressure:.6,timestamp:48}]
  }});
  const flat=()=>app.page().layers.flatMap(l=>l.objects||[]);
  const paper0=JSON.parse(JSON.stringify(app.page().paper));
  const cases=[];
  for(const kind of ['brush','drybrush']){
    app.history.clear();
    if(flat().some(o=>o.type==='stroke'))throw new Error('SETUP_NOT_EMPTY:'+kind);
    const created=await edit(strokeTask('qa-single-'+kind,kind));
    const objectId=find(created,'objectId');const object=flat().find(o=>o.id===objectId);
    if(!object||object.type!=='stroke'||object.kind!==kind)throw new Error('STROKE_INVALID:'+kind);
    const identity=JSON.stringify(object),baseline=await preview(),historyBefore=app.history.undoStack.length;
    await edit(paperTask('qa-single-paper-'+kind,'absorbency',.05));
    const changed=await preview();
    if(changed===baseline)throw new Error('SINGLE_PAPER_RENDER_NO_DELTA:'+kind);
    if(JSON.stringify(flat().find(o=>o.id===objectId))!==identity)throw new Error('STROKE_MUTATED:'+kind);
    if(app.history.undoStack.length!==historyBefore+1)throw new Error('PAPER_HISTORY_EXTRA:'+kind);
    const diagnostics=app.renderer.naturalMedia.diagnostics();
    if(!String(diagnostics.activeBackend).includes('multichannel'))throw new Error('NOT_MULTICHANNEL:'+kind+':'+diagnostics.activeBackend);
    const undoPaper=await invoke('undo_ink');if(undoPaper.status==='FAILED'||(await preview())!==baseline)throw new Error('PAPER_UNDO:'+kind);
    const redoPaper=await invoke('redo_ink');if(redoPaper.status==='FAILED'||(await preview())!==changed)throw new Error('PAPER_REDO:'+kind);
    await invoke('undo_ink');
    const undoStroke=await invoke('undo_ink');if(undoStroke.status==='FAILED'||flat().some(o=>o.id===objectId))throw new Error('STROKE_UNDO:'+kind);
    if(JSON.stringify(app.page().paper)!==JSON.stringify(paper0))throw new Error('PAPER_NOT_RESTORED:'+kind);
    cases.push({kind,objectId,baseline,changed,historyBefore,paperHistoryAfter:historyBefore+1,activeBackend:diagnostics.activeBackend,identityStable:true,undoRedoExact:true});
  }
  return {passed:true,paperBefore:paper0,cases,naturalMedia:app.renderer.naturalMedia.diagnostics()};
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

const RASTER_STACK_ADJUSTMENT_B2_CASE = String.raw`(async()=>{
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
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING');
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();return executed;
  };
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(10,8,44,12);ctx.fillStyle='rgba(20,20,20,.45)';ctx.fillRect(18,26,28,14);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-adjustment-b2.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B2 Adjustment Raster',type:'image/png',intent:'B2 adjustment candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_CREATED_REF_MISSING');
  await waitFrames();
  let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');
  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();
  app.history.clear();
  const beforeState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const beforeFingerprint=beforeState?.stateFingerprint||null;
  const beforeHash=hashCanvas();
  const beforeUndo=app.history.undoStack.length;
  const executed=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-adjustment-1',operation:'image.adjustment.add.v1',targets:[ref],arguments:{type:'brightnessContrast',params:{brightness:18,contrast:22},opacity:1}});
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const afterFingerprint=afterState?.stateFingerprint||null;
  const afterHash=hashCanvas();
  const afterUndo=app.history.undoStack.length;
  if(!beforeFingerprint||!afterFingerprint||beforeFingerprint===afterFingerprint)throw new Error('STATE_FINGERPRINT_UNCHANGED');
  if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT');
  if(afterHash===beforeHash)throw new Error('RENDER_UNCHANGED');
  if(object.adjustments?.length!==1||object.adjustments[0]?.type!=='brightnessContrast')throw new Error('ADJUSTMENT_STACK_INVALID');
  const historyLabel=app.history.undoStack.at(-1)?.label||null;
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED')throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const undoHash=hashCanvas();
  if(!object||object.adjustments?.length)throw new Error('ADJUSTMENT_UNDO_FAILED');
  if(undoHash!==beforeHash)throw new Error('UNDO_RENDER_NOT_RESTORED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const redoHash=hashCanvas();
  if(!object||object.adjustments?.length!==1||object.adjustments[0]?.type!=='brightnessContrast')throw new Error('ADJUSTMENT_REDO_FAILED');
  if(redoHash!==afterHash)throw new Error('REDO_RENDER_NOT_RESTORED');
  return {passed:true,operation:'image.adjustment.add.v1',adjustmentType:'brightnessContrast',objectId:ref.objectId,beforeFingerprint,afterFingerprint,beforeHash,afterHash,undoHash,redoHash,historyLabel,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,controllerResult:findField(executed,'controllerResult')||null};
})()`;

const RASTER_STACK_FILTER_B2_CASE = String.raw`(async()=>{
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
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING');
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();return executed;
  };
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(10,8,44,12);ctx.fillStyle='rgba(20,20,20,.45)';ctx.fillRect(18,26,28,14);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-filter-b2.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B2 Filter Raster',type:'image/png',intent:'B2 filter candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_CREATED_REF_MISSING');
  await waitFrames();
  let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');
  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();
  app.history.clear();
  const beforeState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const beforeFingerprint=beforeState?.stateFingerprint||null;
  const beforeHash=hashCanvas();
  const beforeUndo=app.history.undoStack.length;
  const executed=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-filter-1',operation:'image.filter.add.v1',targets:[ref],arguments:{type:'gaussianBlur',params:{radius:2},opacity:1}});
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const afterFingerprint=afterState?.stateFingerprint||null;
  const afterHash=hashCanvas();
  const afterUndo=app.history.undoStack.length;
  if(!beforeFingerprint||!afterFingerprint||beforeFingerprint===afterFingerprint)throw new Error('STATE_FINGERPRINT_UNCHANGED');
  if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT');
  if(afterHash===beforeHash)throw new Error('RENDER_UNCHANGED');
  if(object.filterStack?.length!==1||object.filterStack[0]?.type!=='gaussianBlur')throw new Error('FILTER_STACK_INVALID');
  const historyLabel=app.history.undoStack.at(-1)?.label||null;
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED')throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const undoHash=hashCanvas();
  if(!object||object.filterStack?.length)throw new Error('FILTER_UNDO_FAILED');
  if(undoHash!==beforeHash)throw new Error('UNDO_RENDER_NOT_RESTORED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const redoHash=hashCanvas();
  if(!object||object.filterStack?.length!==1||object.filterStack[0]?.type!=='gaussianBlur')throw new Error('FILTER_REDO_FAILED');
  if(redoHash!==afterHash)throw new Error('REDO_RENDER_NOT_RESTORED');
  return {passed:true,operation:'image.filter.add.v1',filterType:'gaussianBlur',objectId:ref.objectId,beforeFingerprint,afterFingerprint,beforeHash,afterHash,undoHash,redoHash,historyLabel,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,controllerResult:findField(executed,'controllerResult')||null};
})()`;

const RASTER_STACK_BLEND_B2_CASE = String.raw`(async()=>{
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
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING');
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();return executed;
  };
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(10,8,44,12);ctx.fillStyle='rgba(20,20,20,.45)';ctx.fillRect(18,26,28,14);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const importOne=async(name)=>{
    const file=new File([blob],name+'.png',{type:'image/png'});
    const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name,type:'image/png',intent:'B2 blend candidate QA'}}));
    if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
    const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_CREATED_REF_MISSING');
    return ref;
  };
  const baseRef=await importOne('QA B2 Blend Base');
  const ref=await importOne('QA B2 Blend Target');
  await waitFrames();
  const baseObject=flatObjects().find(item=>item.id===baseRef.objectId);if(!baseObject?.rasterState?.colorRaster)throw new Error('BASE_RASTER_STATE_MISSING');
  let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');
  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();
  app.history.clear();
  const beforeState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const beforeFingerprint=beforeState?.stateFingerprint||null;
  const beforeHash=hashCanvas();
  const beforeUndo=app.history.undoStack.length;
  const executed=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-blend-1',operation:'image.blend.set.v1',targets:[ref],arguments:{mode:'multiply'}});
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const afterFingerprint=afterState?.stateFingerprint||null;
  const afterHash=hashCanvas();
  const afterUndo=app.history.undoStack.length;
  if(!beforeFingerprint||!afterFingerprint||beforeFingerprint===afterFingerprint)throw new Error('STATE_FINGERPRINT_UNCHANGED');
  if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT');
  if(afterHash===beforeHash)throw new Error('RENDER_UNCHANGED');
  if(object.blendMode!=='multiply')throw new Error('BLEND_MODE_INVALID');
  const historyLabel=app.history.undoStack.at(-1)?.label||null;
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED')throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const undoHash=hashCanvas();
  if(!object||((object.blendMode||'source-over')!=='source-over'))throw new Error('BLEND_UNDO_FAILED');
  if(undoHash!==beforeHash)throw new Error('UNDO_RENDER_NOT_RESTORED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const redoHash=hashCanvas();
  if(!object||object.blendMode!=='multiply')throw new Error('BLEND_REDO_FAILED');
  if(redoHash!==afterHash)throw new Error('REDO_RENDER_NOT_RESTORED');
  return {passed:true,operation:'image.blend.set.v1',blendMode:'multiply',objectId:ref.objectId,baseObjectId:baseRef.objectId,beforeFingerprint,afterFingerprint,beforeHash,afterHash,undoHash,redoHash,historyLabel,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,controllerResult:findField(executed,'controllerResult')||null};
})()`;

const RASTER_STACK_EFFECT_B2_CASE = String.raw`(async()=>{
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
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING');
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();return executed;
  };
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(10,8,44,12);ctx.fillStyle='rgba(20,20,20,.45)';ctx.fillRect(18,26,28,14);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-effect-b2.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B2 Effect Raster',type:'image/png',intent:'B2 effect candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_CREATED_REF_MISSING');
  await waitFrames();
  let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');
  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();
  app.history.clear();
  const beforeState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const beforeFingerprint=beforeState?.stateFingerprint||null;
  const beforeHash=hashCanvas();
  const beforeUndo=app.history.undoStack.length;
  const executed=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-effect-1',operation:'image.effect.add.v1',targets:[ref],arguments:{type:'colorOverlay',params:{color:'#00cc66'},opacity:.55}});
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const afterFingerprint=afterState?.stateFingerprint||null;
  const afterHash=hashCanvas();
  const afterUndo=app.history.undoStack.length;
  if(!beforeFingerprint||!afterFingerprint||beforeFingerprint===afterFingerprint)throw new Error('STATE_FINGERPRINT_UNCHANGED');
  if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT');
  if(afterHash===beforeHash)throw new Error('RENDER_UNCHANGED');
  if(object.effects?.length!==1||object.effects[0]?.type!=='colorOverlay')throw new Error('EFFECT_STACK_INVALID');
  const historyLabel=app.history.undoStack.at(-1)?.label||null;
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED')throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const undoHash=hashCanvas();
  if(!object||object.effects?.length)throw new Error('EFFECT_UNDO_FAILED');
  if(undoHash!==beforeHash)throw new Error('UNDO_RENDER_NOT_RESTORED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const redoHash=hashCanvas();
  if(!object||object.effects?.length!==1||object.effects[0]?.type!=='colorOverlay')throw new Error('EFFECT_REDO_FAILED');
  if(redoHash!==afterHash)throw new Error('REDO_RENDER_NOT_RESTORED');
  return {passed:true,operation:'image.effect.add.v1',effectType:'colorOverlay',objectId:ref.objectId,beforeFingerprint,afterFingerprint,beforeHash,afterHash,undoHash,redoHash,historyLabel,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,controllerResult:findField(executed,'controllerResult')||null};
})()`;

const RASTER_STACK_LIQUIFY_B2_CASE = String.raw`(async()=>{
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
    if(proposed?.status==='FAILED') throw new Error('PROPOSE_FAILED:'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED') throw new Error('APPROVE_FAILED:'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING');
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED') throw new Error('EXECUTE_FAILED:'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true) throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();return executed;
  };
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='rgba(255,255,255,.7)';ctx.fillRect(10,8,44,12);ctx.fillStyle='rgba(20,20,20,.45)';ctx.fillRect(18,26,28,14);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-liquify-b2.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B2 Liquify Raster',type:'image/png',intent:'B2 liquify candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_CREATED_REF_MISSING');
  await waitFrames();
  let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');
  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();
  app.history.clear();
  const beforeState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const beforeFingerprint=beforeState?.stateFingerprint||null;
  const beforeHash=hashCanvas();
  const beforeUndo=app.history.undoStack.length;
  const executed=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b2-liquify-1',operation:'image.liquify.add.v1',targets:[ref],arguments:{operations:[{type:'twirl',x:32,y:24,radius:18,strength:.65}],opacity:1,maxWork:500000}});
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterState=app.chatBoundedEdit.inspect().objects.find(item=>item.ref?.objectId===ref.objectId);
  const afterFingerprint=afterState?.stateFingerprint||null;
  const afterHash=hashCanvas();
  const afterUndo=app.history.undoStack.length;
  if(!beforeFingerprint||!afterFingerprint||beforeFingerprint===afterFingerprint)throw new Error('STATE_FINGERPRINT_UNCHANGED');
  if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT');
  if(afterHash===beforeHash)throw new Error('RENDER_UNCHANGED');
  if(object.filterStack?.length!==1||object.filterStack[0]?.type!=='liquify')throw new Error('LIQUIFY_STACK_INVALID');
  const historyLabel=app.history.undoStack.at(-1)?.label||null;
  const preview=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));
  if(preview?.status==='FAILED')throw new Error('PREVIEW_FAILED');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const undoHash=hashCanvas();
  if(!object||object.filterStack?.length)throw new Error('LIQUIFY_UNDO_FAILED');
  if(undoHash!==beforeHash)throw new Error('UNDO_RENDER_NOT_RESTORED');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();
  object=flatObjects().find(item=>item.id===ref.objectId);
  const redoHash=hashCanvas();
  if(!object||object.filterStack?.length!==1||object.filterStack[0]?.type!=='liquify')throw new Error('LIQUIFY_REDO_FAILED');
  if(redoHash!==afterHash)throw new Error('REDO_RENDER_NOT_RESTORED');
  return {passed:true,operation:'image.liquify.add.v1',liquifyType:'liquify',objectId:ref.objectId,beforeFingerprint,afterFingerprint,beforeHash,afterHash,undoHash,redoHash,historyLabel,previewStatus:preview.status,undoStatus:undone.status,redoStatus:redone.status,controllerResult:findField(executed,'controllerResult')||null};
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
    const caseExpression=request.case==='path-deformation-b4'?B4_BROWSER_CASE:request.case==='page-paper-webgl-roughness'?PAPER_WEBGL_ROUGHNESS_CASE:request.case==='page-paper-a3'?PAPER_A3_CASE:request.case==='page-paper-single-stroke'?PAPER_SINGLE_STROKE_CASE:request.case==='paint-session-create'?PAINT_CASE:(request.case==='stroke-create-a2'?STROKE_A2_CASE:(request.case==='stroke-erase-a4'?STROKE_ERASE_A4_CASE:(request.case==='web-raster-bridge'?RASTER_CASE:(request.case==='raster-import-named-tool'?RASTER_NAMED_TOOL_CASE:(request.case==='raster-stack-adjustment-b2'?RASTER_STACK_ADJUSTMENT_B2_CASE:(request.case==='raster-stack-filter-b2'?RASTER_STACK_FILTER_B2_CASE:(request.case==='raster-stack-blend-b2'?RASTER_STACK_BLEND_B2_CASE:(request.case==='raster-stack-effect-b2'?RASTER_STACK_EFFECT_B2_CASE:(request.case==='raster-stack-liquify-b2'?RASTER_STACK_LIQUIFY_B2_CASE:RASTER_STACK_B2_CASE)))))))));
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
// Fresh installed-browser process/profile for each required B4 regression.
const batchRequest=JSON.parse(await readFile(path.resolve(process.argv[2]),'utf8'));
if(batchRequest.case==='path-deformation-b4' && batchRequest.regressions===true && !process.exitCode){
  const primary=JSON.parse(await readFile(path.resolve(process.argv[4]),'utf8'));
  primary.regressions=[];
  for(const caseName of ['paint-session-create','stroke-create-a2','page-paper-a3','raster-stack-adjustment-b2']){
    const prefix=path.resolve(process.argv[4])+'.'+caseName;
    await writeFile(prefix+'.request.json',JSON.stringify({...batchRequest,requestId:batchRequest.requestId+'-'+caseName,case:caseName,regressions:false}));
    const regression=spawn(process.execPath,[path.resolve(process.argv[1]),prefix+'.request.json',path.resolve(process.argv[3]),prefix+'.json',prefix+'.png'],{shell:false,stdio:'inherit'});
    const [code]=await once(regression,'exit');
    const result=JSON.parse(await readFile(prefix+'.json','utf8'));
    primary.regressions.push(result);
    if(code!==0||result.status!=='PASS'){primary.status='FAIL';process.exitCode=1;}
  }
  await writeFile(path.resolve(process.argv[4]),JSON.stringify(primary,null,2));
}
