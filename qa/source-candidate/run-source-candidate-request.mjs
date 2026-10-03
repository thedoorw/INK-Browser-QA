import { IMAGE_STACK_CACHE_REVIEW_CASE } from '../shared/image-stack-cache-review-case.mjs';
import { NATURAL_MEDIA_CACHE_REVIEW_CASE } from '../shared/natural-media-cache-review-case.mjs';
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
  assert.ok(['path-deformation-b4','page-paper-webgl-roughness','page-paper-a3','page-paper-single-stroke','paint-session-create','stroke-create-a2','stroke-erase-a4','blender-smudge-a5','raster-direct-paint-bucket-b3','raster-mask-b3','raster-spot-heal-b3','raster-local-retouch-b3','raster-source-retouch-b3','raster-advanced-ingest','page-ops-c1','align-distribute-c2','snap-guides-c3','web-raster-bridge','raster-import-named-tool','raster-stack-b2','raster-stack-adjustment-b2','raster-stack-filter-b2','raster-stack-blend-b2','raster-stack-effect-b2','raster-stack-liquify-b2'].includes(request?.case),'Unsupported candidate QA case');
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
  if(!['STALE_REVISION','TARGET_STALE','CHAT_EDIT_STALE_REVISION','CHAT_EDIT_TARGET_STALE'].includes(staleCode))throw new Error('STALE_DIAGNOSTIC_UNEXPECTED:'+JSON.stringify(staleApprove));
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
  if(noOpExecuted?.status!=='FAILED'||!['NO_OP','CHAT_EDIT_NO_OP'].includes(findField(noOpExecuted,'code')))throw new Error('NOOP_NOT_REJECTED:'+JSON.stringify(noOpExecuted));

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


const BLENDER_SMUDGE_A5_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.renderer?.naturalMedia?.setPreference?.('canvas2d');
  app.history.clear();
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const findField=(value,key,depth=0)=>{if(value==null||depth>10||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:900,background:false}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED:'+JSON.stringify(r.diagnostics||[]));return {status:r.status,fingerprint:findField(r,'renderFingerprint')||findField(r,'fingerprint')||null,bounds:findField(r,'bounds')||null};};
  const edit=async(task)=>{
    const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE:'+task.operation+':'+JSON.stringify(p.diagnostics||[]));
    const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')throw new Error('APPROVE:'+JSON.stringify(a.diagnostics||[]));
    const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');
    const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:token}));if(e?.status==='FAILED')throw new Error('EXECUTE:'+JSON.stringify(e.diagnostics||[]));
    if(findField(e,'changed')!==true)throw new Error('NOT_CHANGED:'+task.taskId);
    await waitFrames();return e;
  };
  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'stroke.create.v1'}));
  if(descriptor?.status==='FAILED')throw new Error('STROKE_DESCRIPTOR_FAILED');
  const descriptorText=JSON.stringify(descriptor);
  if(!descriptorText.includes('blender')||!descriptorText.includes('smudge'))throw new Error('MIXER_KINDS_NOT_DISCOVERABLE');

  const base=(taskId,objectId,name,kind,color,size,samples,extra={})=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation:'stroke.create.v1',targets:[],arguments:{objectId,name,kind,color,size,opacity:.9,smoothing:.35,pressure:.85,flow:.82,wetness:.52,grain:.2,bristle:.22,...extra,samples}});
  await edit(base('qa-a5-red','qa-a5-red','QA A5 Red','brush','#c14e56',58,[{x:-150,y:-18,pressure:.7,timestamp:0},{x:0,y:-8,pressure:.9,timestamp:25},{x:150,y:-18,pressure:.75,timestamp:50}],{wetness:.7}));
  await edit(base('qa-a5-blue','qa-a5-blue','QA A5 Blue','drybrush','#385f9c',58,[{x:-145,y:22,pressure:.7,timestamp:0},{x:0,y:12,pressure:.9,timestamp:25},{x:145,y:22,pressure:.75,timestamp:50}],{wetness:.18,grain:.65,bristle:.68}));
  const depositObjects=flatObjects().filter(o=>['qa-a5-red','qa-a5-blue'].includes(o.id));
  if(depositObjects.length!==2)throw new Error('DEPOSIT_STROKES_MISSING');
  const baseline=await preview();
  app.history.clear();

  await edit(base('qa-a5-blender','qa-a5-blender','QA A5 Blender','blender','#00ff00',76,[{x:-95,y:-5,pressure:.65,timestamp:0},{x:0,y:4,pressure:.95,timestamp:28},{x:95,y:8,pressure:.75,timestamp:56}],{flow:0,wetness:0,blend:.96,smudge:.58,drag:.28}));
  const blenderObject=flatObjects().find(o=>o.id==='qa-a5-blender');
  if(!blenderObject||blenderObject.kind!=='blender'||blenderObject.mediaModel!=='natural-v2')throw new Error('BLENDER_NATIVE_STROKE_INVALID');
  const afterBlender=await preview();
  if(baseline.fingerprint&&afterBlender.fingerprint===baseline.fingerprint)throw new Error('BLENDER_RENDER_UNCHANGED');

  await edit(base('qa-a5-smudge','qa-a5-smudge','QA A5 Smudge','smudge','#00ff00',68,[{x:-80,y:4,pressure:.6,timestamp:0},{x:5,y:28,pressure:.95,timestamp:30},{x:105,y:42,pressure:.78,timestamp:60}],{flow:0,wetness:0,blend:.48,smudge:.98,drag:.88}));
  const smudgeObject=flatObjects().find(o=>o.id==='qa-a5-smudge');
  if(!smudgeObject||smudgeObject.kind!=='smudge'||smudgeObject.mediaModel!=='natural-v2')throw new Error('SMUDGE_NATIVE_STROKE_INVALID');
  const afterSmudge=await preview();
  if(afterBlender.fingerprint&&afterSmudge.fingerprint===afterBlender.fingerprint)throw new Error('SMUDGE_RENDER_UNCHANGED');

  const diagnostics=app.renderer?.naturalMedia?.diagnostics?.()||{};
  const multi=diagnostics.multiChannelCanvas2d||{};
  if(diagnostics.activeBackend!=='canvas2d-multichannel')throw new Error('MIXER_BACKEND_INVALID:'+JSON.stringify(diagnostics));
  if(!(diagnostics.mixingRuns>=2))throw new Error('MIXING_RUNS_NOT_RECORDED:'+JSON.stringify(diagnostics));
  if(!(multi.mixingStrokes>=3))throw new Error('MIXER_STROKES_NOT_RECORDED:'+JSON.stringify(multi));
  if(!(multi.mixerStamps>0&&multi.transportedPigment>0))throw new Error('PIGMENT_TRANSPORT_NOT_OBSERVED:'+JSON.stringify(multi));

  const undoSmudge=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoSmudge?.status==='FAILED')throw new Error('UNDO_SMUDGE_FAILED');
  const undoSmudgePreview=await preview();
  if(afterBlender.fingerprint&&undoSmudgePreview.fingerprint!==afterBlender.fingerprint)throw new Error('UNDO_SMUDGE_PREVIEW_MISMATCH');
  const undoBlender=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoBlender?.status==='FAILED')throw new Error('UNDO_BLENDER_FAILED');
  const undoBlenderPreview=await preview();
  if(baseline.fingerprint&&undoBlenderPreview.fingerprint!==baseline.fingerprint)throw new Error('UNDO_BLENDER_PREVIEW_MISMATCH');
  const redoBlender=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redoBlender?.status==='FAILED')throw new Error('REDO_BLENDER_FAILED');
  const redoBlenderPreview=await preview();
  if(afterBlender.fingerprint&&redoBlenderPreview.fingerprint!==afterBlender.fingerprint)throw new Error('REDO_BLENDER_PREVIEW_MISMATCH');
  const redoSmudge=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redoSmudge?.status==='FAILED')throw new Error('REDO_SMUDGE_FAILED');
  const redoSmudgePreview=await preview();
  if(afterSmudge.fingerprint&&redoSmudgePreview.fingerprint!==afterSmudge.fingerprint)throw new Error('REDO_SMUDGE_PREVIEW_MISMATCH');

  return {passed:true,operation:'stroke.create.v1',kinds:['blender','smudge'],baseline,afterBlender,afterSmudge,historyLabels:app.history.undoStack.map(x=>x.label),diagnostics:{activeBackend:diagnostics.activeBackend,mixingRuns:diagnostics.mixingRuns,multiChannelCanvas2d:multi},undoStatus:[undoSmudge.status,undoBlender.status],redoStatus:[redoBlender.status,redoSmudge.status]};
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

const ALIGN_DISTRIBUTE_C2_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke)throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','undo_ink','redo_ink'])if(!toolNames.includes(name))throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();
  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const edit=async task=>{
    const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE:'+JSON.stringify(p.diagnostics||[]));
    const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')throw new Error('APPROVE:'+JSON.stringify(a.diagnostics||[]));
    const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');
    const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:token}));if(e?.status==='FAILED')throw new Error('EXECUTE:'+JSON.stringify(e.diagnostics||[]));
    return e;
  };
  const create=async(id,x,y,w,h)=>{
    const e=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c2-create-'+id,operation:'path.create.v1',targets:[],arguments:{objectId:id,name:id,shape:'rectangle',x,y,width:w,height:h,fill:'#d4878b',stroke:'#49383b',strokeWidth:2,opacity:1}});
    return findField(e,'resultRefs')[0];
  };
  const refs=[
    await create('qa-c2-a',10,20,40,30),
    await create('qa-c2-b',90,70,50,30),
    await create('qa-c2-c',260,125,60,30)
  ];
  const bounds=()=>refs.map(ref=>{const f=app.findObject({layerId:ref.layerId,objectId:ref.objectId});if(!f)throw new Error('TARGET_MISSING:'+ref.objectId);return app.renderer.objectWorldBounds(f.object,f.parentWorldMatrix);});
  const close=(a,b,eps=.001)=>Math.abs(a-b)<=eps;
  const sameBounds=(a,b)=>a.length===b.length&&a.every((x,i)=>['x','y','w','h'].every(k=>close(x[k],b[i][k])));
  const align=async(mode,targets=refs)=>{
    return edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c2-'+mode+'-'+targets.length,operation:'object.align.v1',targets,arguments:{mode}});
  };

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'object.align.v1'}));
  if(descriptor?.status==='FAILED'||!JSON.stringify(descriptor).includes('distributeX'))throw new Error('ALIGN_DESCRIPTOR_INVALID');

  app.history.clear();
  const sentinelSelection=[{layerId:refs[2].layerId,objectId:refs[2].objectId}];
  const setSentinel=()=>{app.selection=sentinelSelection.map(item=>({...item}));app.refreshSelectionUI?.();return JSON.stringify(app.selection);};
  const selectionBeforeLeft=setSentinel();
  const baseline=bounds();

  const leftResult=await align('left');
  const left=bounds();
  if(!left.every(b=>close(b.x,left[0].x)))throw new Error('LEFT_ALIGN_FAILED:'+JSON.stringify(left));
  if(JSON.stringify(app.selection)!==selectionBeforeLeft)throw new Error('SELECTION_NOT_RESTORED_LEFT');
  if(findField(leftResult,'mode')!=='left'||findField(leftResult,'changedTargetCount')<1)throw new Error('LEFT_RECEIPT_INVALID');
  if(app.history.undoStack.at(-1)?.label!=='對齊物件')throw new Error('LEFT_HISTORY_LABEL_INVALID');
  await Promise.resolve(api.tools.invoke('undo_ink',{}));if(!sameBounds(bounds(),baseline))throw new Error('LEFT_UNDO_MISMATCH');
  await Promise.resolve(api.tools.invoke('redo_ink',{}));if(!sameBounds(bounds(),left))throw new Error('LEFT_REDO_MISMATCH');
  await Promise.resolve(api.tools.invoke('undo_ink',{}));if(!sameBounds(bounds(),baseline))throw new Error('LEFT_RESET_MISMATCH');

  const selectionBeforeCenter=setSentinel();
  const centerResult=await align('centerX');
  const center=bounds(),centers=center.map(b=>b.x+b.w/2);
  if(!centers.every(v=>close(v,centers[0])))throw new Error('CENTERX_ALIGN_FAILED:'+JSON.stringify(center));
  if(JSON.stringify(app.selection)!==selectionBeforeCenter)throw new Error('SELECTION_NOT_RESTORED_CENTER');
  if(findField(centerResult,'mode')!=='centerX')throw new Error('CENTER_RECEIPT_INVALID');
  await Promise.resolve(api.tools.invoke('undo_ink',{}));if(!sameBounds(bounds(),baseline))throw new Error('CENTER_UNDO_MISMATCH');

  const selectionBeforeDistribute=setSentinel();
  const distributeResult=await align('distributeX');
  const distributed=bounds().sort((a,b)=>a.x-b.x);
  const gap1=distributed[1].x-(distributed[0].x+distributed[0].w);
  const gap2=distributed[2].x-(distributed[1].x+distributed[1].w);
  if(!close(gap1,gap2,.01))throw new Error('DISTRIBUTEX_GAP_MISMATCH:'+gap1+':'+gap2);
  if(JSON.stringify(app.selection)!==selectionBeforeDistribute)throw new Error('SELECTION_NOT_RESTORED_DISTRIBUTE');
  if(findField(distributeResult,'mode')!=='distributeX')throw new Error('DISTRIBUTE_RECEIPT_INVALID');
  const distributedExact=bounds();
  await Promise.resolve(api.tools.invoke('undo_ink',{}));if(!sameBounds(bounds(),baseline))throw new Error('DISTRIBUTE_UNDO_MISMATCH');
  await Promise.resolve(api.tools.invoke('redo_ink',{}));if(!sameBounds(bounds(),distributedExact))throw new Error('DISTRIBUTE_REDO_MISMATCH');

  const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:{schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c2-distribute-two',operation:'object.align.v1',targets:refs.slice(0,2),arguments:{mode:'distributeX'}}}));
  if(p?.status==='FAILED')throw new Error('TWO_TARGET_PROPOSE_UNEXPECTED_FAIL');
  const twoProposalId=findField(p,'proposalId');if(!twoProposalId)throw new Error('TWO_TARGET_PROPOSAL_ID_MISSING');
  const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:twoProposalId}));
  if(a?.status==='FAILED')throw new Error('TWO_TARGET_APPROVE_UNEXPECTED_FAIL');
  const twoToken=findField(a,'approvalToken');if(!twoToken)throw new Error('TWO_TARGET_TOKEN_MISSING');
  const rejected=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:twoProposalId,approvalToken:twoToken}));
  const rejectCode=rejected?.diagnostics?.[0]?.code||null;
  if(rejected?.status!=='FAILED'||rejectCode!=='CHAT_EDIT_TARGET_COUNT_INVALID')throw new Error('DISTRIBUTE_TWO_NOT_REJECTED:'+JSON.stringify(rejected));

  return {passed:true,operation:'object.align.v1',modes:['left','centerX','distributeX'],baseline,left,center,distributed:distributedExact,gaps:[gap1,gap2],selectionRestored:true,distributionGuard:rejectCode,historyLabel:'對齊物件'};
})()`;

const PAGE_OPS_C1_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke)throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const requiredTools=['describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','undo_ink','redo_ink','get_ink_history'];
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of requiredTools)if(!toolNames.includes(name))throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();

  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const historyCount=()=>app.history.undoStack.length;
  const edit=async task=>{
    const proposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));
    if(proposed?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+task.operation+':'+JSON.stringify(proposed.diagnostics||[]));
    const proposalId=findField(proposed,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING:'+task.operation);
    const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));
    if(approved?.status==='FAILED')throw new Error('APPROVE_FAILED:'+task.operation+':'+JSON.stringify(approved.diagnostics||[]));
    const approvalToken=findField(approved,'approvalToken');if(!approvalToken)throw new Error('APPROVAL_TOKEN_MISSING:'+task.operation);
    const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));
    if(executed?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+task.operation+':'+JSON.stringify(executed.diagnostics||[]));
    if(findField(executed,'changed')!==true)throw new Error('NOT_CHANGED:'+task.operation);
    return executed;
  };
  const proposeFailure=async(task,code)=>{
    const result=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));
    const text=(findField(result,'code')||JSON.stringify(result?.diagnostics||[]));
    if(result?.status!=='FAILED'||!String(text).includes(code))throw new Error('EXPECTED_PROPOSE_FAILURE:'+code+':'+String(text));
    return String(text);
  };
  const task=(taskId,operation,args={})=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation,targets:[],arguments:args});

  const operations=['page.create.v1','page.duplicate.v1','page.delete.v1','page.rename.v1','page.activate.v1'];
  for(const operation of operations){
    const described=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:operation}));
    if(described?.status==='FAILED')throw new Error('DESCRIBE_FAILED:'+operation);
    const text=JSON.stringify(described);
    if(!text.includes(operation))throw new Error('DESCRIPTOR_OPERATION_MISSING:'+operation);
    const targetMax=findField(described,'maxItems');
    if(targetMax!==0)throw new Error('PAGE_TARGET_SCHEMA_NOT_ZERO:'+operation+':'+targetMax);
  }

  if(app.doc.pages.length!==1)throw new Error('FRESH_PAGE_COUNT:'+app.doc.pages.length);
  const page1=app.doc.pages[0],page1Id=page1.id;
  const createHistoryBefore=historyCount();
  const created=await edit(task('qa-c1-create','page.create.v1',{}));
  const page2Id=findField(created,'pageId');
  if(!page2Id||page2Id===page1Id||app.doc.activePageId!==page2Id||app.doc.pages.length!==2)throw new Error('PAGE_CREATE_STATE');
  if(historyCount()!==createHistoryBefore+1||app.history.undoStack.at(-1)?.label!=='新增頁面')throw new Error('PAGE_CREATE_HISTORY');

  const pathCreated=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-c1-source-path',operation:'path.create.v1',targets:[],arguments:{objectId:'qa-c1-page2-path',name:'C1 Page 2 Path',shape:'rectangle',x:0,y:0,width:80,height:60,fill:'#d4878b',stroke:'#49383b',strokeWidth:2,opacity:1}});
  if(findField(pathCreated,'objectId')!=='qa-c1-page2-path')throw new Error('PAGE2_PATH_CREATE_FAILED');

  const renamed=await edit(task('qa-c1-rename','page.rename.v1',{pageId:page2Id,name:'QA Page 2'}));
  if(app.doc.pages.find(page=>page.id===page2Id)?.name!=='QA Page 2')throw new Error('PAGE_RENAME_STATE');
  if(app.history.undoStack.at(-1)?.label!=='重新命名頁面')throw new Error('PAGE_RENAME_HISTORY');
  const renameNoOpCode=await proposeFailure(task('qa-c1-rename-noop','page.rename.v1',{pageId:page2Id,name:'QA Page 2'}),'CHAT_EDIT_NO_OP');

  const page2=app.doc.pages.find(page=>page.id===page2Id);
  const sourceLayerIds=new Set(page2.layers.map(layer=>layer.id));
  const sourceObjectIds=new Set(page2.layers.flatMap(layer=>layer.objects||[]).map(object=>object.id));
  const duplicated=await edit(task('qa-c1-duplicate','page.duplicate.v1',{pageId:page2Id}));
  const page3Id=findField(duplicated,'pageId');
  const page3=app.doc.pages.find(page=>page.id===page3Id);
  if(!page3||page3Id===page2Id||app.doc.activePageId!==page3Id||app.doc.pages.length!==3)throw new Error('PAGE_DUPLICATE_STATE');
  if(app.history.undoStack.at(-1)?.label!=='複製頁面')throw new Error('PAGE_DUPLICATE_HISTORY');
  if(page3.layers.some(layer=>sourceLayerIds.has(layer.id)))throw new Error('PAGE_DUPLICATE_LAYER_ID_REUSED');
  const duplicateObjectIds=page3.layers.flatMap(layer=>layer.objects||[]).map(object=>object.id);
  if(!duplicateObjectIds.length||duplicateObjectIds.some(id=>sourceObjectIds.has(id)))throw new Error('PAGE_DUPLICATE_OBJECT_ID_REUSED');

  const activateHistoryBefore=historyCount();
  const activated=await edit(task('qa-c1-activate','page.activate.v1',{pageId:page1Id}));
  if(app.doc.activePageId!==page1Id)throw new Error('PAGE_ACTIVATE_STATE');
  if(historyCount()!==activateHistoryBefore)throw new Error('PAGE_ACTIVATE_HISTORY_MUTATED');
  if(findField(activated,'historyEntryCreated')!==false)throw new Error('PAGE_ACTIVATE_RECEIPT');
  const activateNoOpCode=await proposeFailure(task('qa-c1-activate-noop','page.activate.v1',{pageId:page1Id}),'CHAT_EDIT_NO_OP');

  const deleteHistoryBefore=historyCount();
  await edit(task('qa-c1-delete-copy','page.delete.v1',{pageId:page3Id}));
  if(app.doc.pages.some(page=>page.id===page3Id)||app.doc.pages.length!==2)throw new Error('PAGE_DELETE_STATE');
  if(historyCount()!==deleteHistoryBefore+1||app.history.undoStack.at(-1)?.label!=='刪除頁面')throw new Error('PAGE_DELETE_HISTORY');
  const activeAfterDelete=app.doc.activePageId;

  const undoDelete=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoDelete?.status==='FAILED')throw new Error('PAGE_DELETE_UNDO_FAILED');
  if(!app.doc.pages.some(page=>page.id===page3Id)||app.doc.pages.length!==3||app.doc.activePageId!==page1Id)throw new Error('PAGE_DELETE_UNDO_STATE');
  const redoDelete=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redoDelete?.status==='FAILED')throw new Error('PAGE_DELETE_REDO_FAILED');
  if(app.doc.pages.some(page=>page.id===page3Id)||app.doc.pages.length!==2||app.doc.activePageId!==activeAfterDelete)throw new Error('PAGE_DELETE_REDO_STATE');

  if(app.doc.activePageId!==page2Id)await edit(task('qa-c1-activate-page2','page.activate.v1',{pageId:page2Id}));
  const staleProposal=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:task('qa-c1-stale-rename','page.rename.v1',{pageId:page2Id,name:'Should Not Apply'})}));
  if(staleProposal?.status==='FAILED')throw new Error('STALE_PROPOSE_FAILED');
  const staleProposalId=findField(staleProposal,'proposalId');if(!staleProposalId)throw new Error('STALE_PROPOSAL_ID_MISSING');
  const page4Created=await edit(task('qa-c1-create-for-stale','page.create.v1',{}));
  const page4Id=findField(page4Created,'pageId');if(!page4Id||app.doc.activePageId!==page4Id)throw new Error('STALE_MUTATION_CREATE_FAILED');
  const staleApproved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleProposalId}));
  const staleCode=findField(staleApproved,'code')||JSON.stringify(staleApproved?.diagnostics||[]);
  if(staleApproved?.status!=='FAILED'||!String(staleCode).includes('CHAT_EDIT_STALE_PAGE'))throw new Error('STALE_PAGE_NOT_REJECTED:'+String(staleCode));

  await edit(task('qa-c1-delete-page4','page.delete.v1',{pageId:page4Id}));
  if(app.doc.pages.length!==2)throw new Error('PAGE4_DELETE_FAILED');
  await edit(task('qa-c1-delete-page2','page.delete.v1',{pageId:page2Id}));
  if(app.doc.pages.length!==1||app.doc.pages[0].id!==page1Id)throw new Error('CLEANUP_TO_ONE_PAGE_FAILED');
  const minPageCode=await proposeFailure(task('qa-c1-delete-last','page.delete.v1',{pageId:page1Id}),'CHAT_EDIT_MINIMUM_PAGE_REQUIRED');

  const history=await Promise.resolve(api.tools.invoke('get_ink_history',{}));
  if(history?.status==='FAILED')throw new Error('HISTORY_INSPECT_FAILED');
  return {
    passed:true,
    operations,
    initialPageId:page1Id,
    createdPageId:page2Id,
    duplicatedPageId:page3Id,
    duplicateIdentity:{sourceLayerIds:[...sourceLayerIds],sourceObjectIds:[...sourceObjectIds],duplicateLayerIds:page3.layers.map(layer=>layer.id),duplicateObjectIds},
    noOpCodes:{rename:renameNoOpCode,activate:activateNoOpCode},
    staleCode:String(staleCode),
    minimumPageCode:minPageCode,
    finalPageCount:app.doc.pages.length,
    finalActivePageId:app.doc.activePageId,
    historyLabels:app.history.undoStack.map(entry=>entry.label)
  };
})()`;

const RASTER_ADVANCED_INGEST_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const fnv=value=>{const text=typeof value==='string'?value:JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED:'+JSON.stringify(r.diagnostics||[]));return {status:r.status,fingerprint:findField(r,'renderFingerprint')||null};};

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'raster.import'}));
  if(descriptor?.status==='FAILED')throw new Error('RASTER_DESCRIPTOR_FAILED');
  const descriptorText=JSON.stringify(descriptor);
  for(const format of ['PSD','TIFF','EXR'])if(!descriptorText.includes(format))throw new Error('ADVANCED_FORMAT_NOT_DISCOVERABLE:'+format);
  if(!descriptorText.includes('RAW')||!descriptorText.includes('decoder'))throw new Error('RAW_BOUNDARY_NOT_DISCOVERABLE');

  const formatCore=await import('./src/image/format-interoperability.js');
  const normalized=await import('./src/image/formats/normalized-payload.js');
  const width=16,height=12,pixels=width*height;
  const rgb8=new Uint8Array(pixels*3),alpha8=new Uint8Array(pixels);
  for(let i=0;i<pixels;i++){const x=i%width,y=Math.floor(i/width),o=i*3;rgb8[o]=(30+x*11+y*3)%256;rgb8[o+1]=(80+x*5+y*13)%256;rgb8[o+2]=(140+x*7+y*9)%256;alpha8[i]=255;}
  const payload8=normalized.createNormalizedPayload({format:'QA',width,height,bitDepth:8,colorMode:'RGB',data:rgb8,alpha:alpha8,metadata:{qa:'advanced-ingest'}});
  const rgb32=new Float32Array(pixels*3),alpha32=new Float32Array(pixels);
  for(let i=0;i<pixels;i++){const x=i%width,y=Math.floor(i/width),o=i*3;rgb32[o]=.2+x/12;rgb32[o+1]=.15+y/10;rgb32[o+2]=.3+(x+y)/20;alpha32[i]=1;}
  const payload32=normalized.createNormalizedPayload({format:'QA',width,height,bitDepth:32,colorMode:'RGB',data:rgb32,alpha:alpha32,metadata:{qa:'advanced-ingest-exr'}});
  const specs=[
    {format:'PSD',name:'candidate-advanced.psd',type:'image/vnd.adobe.photoshop',bytes:formatCore.encodeFormat('PSD',payload8),bitDepth:8},
    {format:'TIFF',name:'candidate-advanced.tiff',type:'image/tiff',bytes:formatCore.encodeFormat('TIFF',payload8),bitDepth:8},
    {format:'EXR',name:'candidate-advanced.exr',type:'image/x-exr',bytes:formatCore.encodeFormat('EXR',payload32),bitDepth:32}
  ];
  app.history.clear();
  const imports=[];
  for(const spec of specs){
    const file=new File([spec.bytes],spec.name,{type:spec.type});
    const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA '+spec.format,type:spec.type,intent:'advanced mutable raster ingest candidate QA'}}));
    if(imported?.status==='FAILED')throw new Error('ADVANCED_IMPORT_FAILED:'+spec.format+':'+JSON.stringify(imported.diagnostics||[]));
    const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('ADVANCED_REF_MISSING:'+spec.format);
    await waitFrames();
    const object=flatObjects().find(item=>item.id===ref.objectId);
    if(!object||object.type!=='image'||!object.rasterState?.colorRaster)throw new Error('ADVANCED_NATIVE_RASTER_MISSING:'+spec.format);
    if(object.rasterState?.source?.format!==spec.format)throw new Error('ADVANCED_SOURCE_FORMAT:'+spec.format+':'+object.rasterState?.source?.format);
    if(object.rasterState.colorRaster.bitDepth!==spec.bitDepth)throw new Error('ADVANCED_BIT_DEPTH:'+spec.format);
    if(findField(imported,'format')!==spec.format)throw new Error('ADVANCED_RESULT_FORMAT:'+spec.format+':'+findField(imported,'format'));
    if(findField(imported,'importRoute')!=='advanced-format')throw new Error('ADVANCED_ROUTE:'+spec.format);
    const latest=app.history.undoStack.at(-1);
    if(latest?.label!=='匯入格式影像')throw new Error('ADVANCED_HISTORY_LABEL:'+spec.format+':'+latest?.label);
    const p=await preview();
    imports.push({format:spec.format,ref,objectId:object.id,bitDepth:object.rasterState.colorRaster.bitDepth,colorMode:object.rasterState.colorRaster.colorMode,preview:p});
  }

  const psd=imports.find(item=>item.format==='PSD'),psdObject=flatObjects().find(item=>item.id===psd.objectId);
  const beforeHash=fnv(psdObject.rasterState.colorRaster);
  const task={schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-advanced-psd-edit',operation:'image.raster.paintBucket.v1',targets:[psd.ref],arguments:{x:0,y:0,color:'#20b86a',tolerance:0,contiguous:true,opacity:1}};
  const proposed=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(proposed?.status==='FAILED')throw new Error('PSD_EDIT_PROPOSE_FAILED');
  const proposalId=findField(proposed,'proposalId');
  const approved=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(approved?.status==='FAILED')throw new Error('PSD_EDIT_APPROVE_FAILED');
  const approvalToken=findField(approved,'approvalToken');
  const executed=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken}));if(executed?.status==='FAILED'||findField(executed,'changed')!==true)throw new Error('PSD_EDIT_EXECUTE_FAILED:'+JSON.stringify(executed?.diagnostics||[]));
  await waitFrames();
  const afterHash=fnv(flatObjects().find(item=>item.id===psd.objectId).rasterState.colorRaster);
  if(afterHash===beforeHash)throw new Error('PSD_EDIT_PIXELS_UNCHANGED');
  const afterEditPreview=await preview();
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('PSD_EDIT_UNDO_FAILED');
  await waitFrames();
  const undoHash=fnv(flatObjects().find(item=>item.id===psd.objectId).rasterState.colorRaster);
  if(undoHash!==beforeHash)throw new Error('PSD_EDIT_UNDO_HASH');
  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('PSD_EDIT_REDO_FAILED');
  await waitFrames();
  const redoHash=fnv(flatObjects().find(item=>item.id===psd.objectId).rasterState.colorRaster);
  if(redoHash!==afterHash)throw new Error('PSD_EDIT_REDO_HASH');

  const rawBytes=Uint8Array.from([82,65,87,84,1,2,3,4]);
  const rawFile=new File([rawBytes],'candidate-camera.dng',{type:'image/x-adobe-dng'});
  const raw=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file:rawFile},options:{name:'candidate-camera.dng',type:'image/x-adobe-dng'}}));
  const rawCode=findField(raw,'code')||JSON.stringify(raw.diagnostics||[]);
  if(raw?.status!=='FAILED'||!String(rawCode).includes('RAW_DECODER_UNAVAILABLE'))throw new Error('RAW_DECODER_BOUNDARY_NOT_ENFORCED:'+String(rawCode));

  formatCore.rawAdapters.register({
    id:'qa-raw-adapter',
    browserCompatible:true,
    deterministic:true,
    license:'CC0-1.0',
    probe:bytes=>bytes?.length>=4&&bytes[0]===82&&bytes[1]===65&&bytes[2]===87&&bytes[3]===84?{family:'QA-RAW'}:false,
    decode:async bytes=>{
      const width=6,height=4,pixels=width*height,data=new Uint16Array(pixels*3),alpha=new Uint16Array(pixels);
      for(let i=0;i<pixels;i++){const o=i*3;data[o]=1000+i*97;data[o+1]=2000+i*83;data[o+2]=3000+i*71;alpha[i]=65535;}
      return {family:'QA-RAW',width,height,bitDepth:16,colorMode:'RGB',data,alpha,decodeMetadata:{qa:true,inputLength:bytes.length}};
    }
  });
  const rawApprovedFile=new File([rawBytes],'candidate-camera.dng',{type:'image/x-adobe-dng'});
  const rawImported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file:rawApprovedFile},options:{name:'QA RAW',type:'image/x-adobe-dng',intent:'policy-gated RAW candidate QA'}}));
  if(rawImported?.status==='FAILED')throw new Error('RAW_APPROVED_ADAPTER_IMPORT_FAILED:'+JSON.stringify(rawImported.diagnostics||[]));
  const rawRef=rawImported?.createdRefs?.[0];if(!rawRef?.objectId)throw new Error('RAW_APPROVED_REF_MISSING');
  await waitFrames();
  const rawObject=flatObjects().find(item=>item.id===rawRef.objectId);
  if(!rawObject?.rasterState?.colorRaster)throw new Error('RAW_APPROVED_RASTER_STATE_MISSING');
  if(rawObject.rasterState?.source?.format!=='RAW')throw new Error('RAW_APPROVED_SOURCE_FORMAT:'+rawObject.rasterState?.source?.format);
  if(rawObject.rasterState.colorRaster.bitDepth!==16)throw new Error('RAW_APPROVED_BIT_DEPTH:'+rawObject.rasterState.colorRaster.bitDepth);
  if(findField(rawImported,'importRoute')!=='advanced-format-raw')throw new Error('RAW_APPROVED_ROUTE:'+findField(rawImported,'importRoute'));
  const rawPreview=await preview();

  return {passed:true,operation:'raster.import',imports,psdMutation:{beforeHash,afterHash,undoHash,redoHash,afterEditPreview},rawDefaultRejected:true,rawDefaultCode:String(rawCode),rawApproved:{ref:rawRef,bitDepth:rawObject.rasterState.colorRaster.bitDepth,colorMode:rawObject.rasterState.colorRaster.colorMode,preview:rawPreview,route:findField(rawImported,'importRoute')}};
})()`;

const RASTER_SOURCE_RETOUCH_B3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const fnv=value=>{const text=typeof value==='string'?value:JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const rasterHash=object=>fnv(object?.rasterState?.colorRaster||null);
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED');return {status:r.status,fingerprint:findField(r,'renderFingerprint')||null};};
  const propose=async task=>{const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+JSON.stringify(p.diagnostics||[]));const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');return proposalId;};
  const approve=async proposalId=>{const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')return a;const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');return {result:a,token};};
  const edit=async task=>{const proposalId=await propose(task),approved=await approve(proposalId);if(!approved.token)throw new Error('APPROVE_FAILED:'+JSON.stringify(approved));const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:approved.token}));if(e?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+JSON.stringify(e.diagnostics||[]));if(findField(e,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED');await waitFrames();return e;};

  const source=document.createElement('canvas');source.width=80;source.height=60;
  const ctx=source.getContext('2d'),image=ctx.createImageData(80,60);
  for(let y=0;y<60;y++)for(let x=0;x<80;x++){const o=(y*80+x)*4;image.data[o]=(30+x*3+y*2)%256;image.data[o+1]=(70+x*5+y*7)%256;image.data[o+2]=(110+x*11+y*3)%256;image.data[o+3]=255;}
  for(let y=7;y<21;y++)for(let x=7;x<21;x++){const o=(y*80+x)*4;image.data[o]=235;image.data[o+1]=55;image.data[o+2]=45;}
  for(let y=8;y<22;y++)for(let x=50;x<66;x++){const o=(y*80+x)*4;image.data[o]=35;image.data[o+1]=180;image.data[o+2]=210;}
  ctx.putImageData(image,0,0);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-source-retouch-b3.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B3 Source Retouch',type:'image/png',intent:'B3 source-dependent retouch candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED');
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_REF_MISSING');
  await waitFrames();let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'image.raster.sourceRetouch.v1'}));
  if(descriptor?.status==='FAILED')throw new Error('SOURCE_RETOUCH_DESCRIPTOR_FAILED');
  const descriptorText=JSON.stringify(descriptor);
  for(const type of ['cloneStamp','healingBrush','patch'])if(!descriptorText.includes(type))throw new Error('SOURCE_RETOUCH_TYPE_MISSING:'+type);
  if(descriptorText.includes('patternStamp'))throw new Error('PATTERN_STAMP_PREMATURELY_EXPOSED');

  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();app.history.clear();
  const baselineHash=rasterHash(object),baselinePreview=await preview();
  const task=(taskId,type,args)=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation:'image.raster.sourceRetouch.v1',targets:[ref],arguments:{type,...args}});

  const staleProposal=await propose(task('qa-b3-source-stale','cloneStamp',{sourceX:12,sourceY:12,targetX:58,targetY:15,radius:7,opacity:1,hardness:1}));
  await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b3-source-intervening',operation:'image.raster.paintBucket.v1',targets:[ref],arguments:{x:2,y:2,color:'#20b86a',tolerance:0,contiguous:true,opacity:1}});
  const staleApproval=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleProposal}));
  const staleCode=findField(staleApproval,'code')||JSON.stringify(staleApproval.diagnostics||[]);
  if(staleApproval?.status!=='FAILED'||!String(staleCode).includes('TARGET_STALE'))throw new Error('SOURCE_RETOUCH_STALE_NOT_REJECTED:'+String(staleCode));
  const undoIntervening=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoIntervening?.status==='FAILED')throw new Error('UNDO_INTERVENING_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);if(rasterHash(object)!==baselineHash)throw new Error('STALE_BASELINE_NOT_RESTORED');

  const cases=[
    {type:'cloneStamp',args:{sourceX:12,sourceY:12,targetX:58,targetY:15,radius:7,opacity:1,hardness:1}},
    {type:'healingBrush',args:{sourceX:12,sourceY:12,targetX:58,targetY:15,radius:7,opacity:1,hardness:.9}},
    {type:'patch',args:{sourceRegion:{x:8,y:8,width:12,height:10},targetRegion:{x:52,y:35,width:12,height:10},opacity:1,feather:2}}
  ];
  const results=[];
  for(const item of cases){
    const executed=await edit(task('qa-b3-source-'+item.type,item.type,item.args));
    object=flatObjects().find(value=>value.id===ref.objectId);
    const afterHash=rasterHash(object),afterPreview=await preview();
    if(afterHash===baselineHash)throw new Error('SOURCE_RETOUCH_PIXELS_UNCHANGED:'+item.type);
    if(baselinePreview.fingerprint&&afterPreview.fingerprint===baselinePreview.fingerprint)throw new Error('SOURCE_RETOUCH_PREVIEW_UNCHANGED:'+item.type);
    const controller=findField(executed,'controllerResult');
    if(controller?.rasterEdit?.type!==item.type||!(controller?.rasterEdit?.changedPixels>0))throw new Error('SOURCE_RETOUCH_RECEIPT_INVALID:'+item.type+':'+JSON.stringify(controller));
    const serialized=JSON.stringify(controller);
    if(serialized.includes('"data"')||serialized.includes('"alpha"'))throw new Error('SOURCE_RETOUCH_RAW_PAYLOAD_LEAK:'+item.type);
    if(app.history.undoStack.at(-1)?.label!=='CHAT raster source retouch: '+item.type)throw new Error('SOURCE_RETOUCH_HISTORY_LABEL:'+item.type);

    const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('SOURCE_RETOUCH_UNDO_FAILED:'+item.type);
    await waitFrames();object=flatObjects().find(value=>value.id===ref.objectId);const undoHash=rasterHash(object),undoPreview=await preview();
    if(undoHash!==baselineHash)throw new Error('SOURCE_RETOUCH_UNDO_PIXELS:'+item.type);
    if(baselinePreview.fingerprint&&undoPreview.fingerprint!==baselinePreview.fingerprint)throw new Error('SOURCE_RETOUCH_UNDO_PREVIEW:'+item.type);

    const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('SOURCE_RETOUCH_REDO_FAILED:'+item.type);
    await waitFrames();object=flatObjects().find(value=>value.id===ref.objectId);const redoHash=rasterHash(object),redoPreview=await preview();
    if(redoHash!==afterHash)throw new Error('SOURCE_RETOUCH_REDO_PIXELS:'+item.type);
    if(afterPreview.fingerprint&&redoPreview.fingerprint!==afterPreview.fingerprint)throw new Error('SOURCE_RETOUCH_REDO_PREVIEW:'+item.type);

    results.push({type:item.type,afterHash,afterPreview,changedPixels:controller.rasterEdit.changedPixels,changedChannels:controller.rasterEdit.changedChannels});
    const restore=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(restore?.status==='FAILED')throw new Error('SOURCE_RETOUCH_RESTORE_FAILED:'+item.type);
    await waitFrames();object=flatObjects().find(value=>value.id===ref.objectId);if(rasterHash(object)!==baselineHash)throw new Error('SOURCE_RETOUCH_RESTORE_PIXELS:'+item.type);
  }

  const noopProposal=await propose(task('qa-b3-source-noop','cloneStamp',{sourceX:20,sourceY:20,targetX:20,targetY:20,radius:6,opacity:1,hardness:1}));
  const noopApproved=await approve(noopProposal);if(!noopApproved.token)throw new Error('SOURCE_RETOUCH_NOOP_APPROVE_FAILED');
  const noop=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:noopProposal,approvalToken:noopApproved.token}));
  const noopCode=findField(noop,'code')||JSON.stringify(noop.diagnostics||[]);
  if(noop?.status!=='FAILED'||!String(noopCode).includes('NO_OP'))throw new Error('SOURCE_RETOUCH_NOOP_NOT_REJECTED:'+String(noopCode));

  const rangeProposal=await propose(task('qa-b3-source-range','healingBrush',{sourceX:999,sourceY:12,targetX:58,targetY:15,radius:7,opacity:1,hardness:1}));
  const rangeApproved=await approve(rangeProposal);if(!rangeApproved.token)throw new Error('SOURCE_RETOUCH_RANGE_APPROVE_FAILED');
  const range=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:rangeProposal,approvalToken:rangeApproved.token}));
  const rangeCode=findField(range,'code')||JSON.stringify(range.diagnostics||[]);
  if(range?.status!=='FAILED'||!String(rangeCode).includes('ARGUMENT_OUT_OF_RANGE'))throw new Error('SOURCE_RETOUCH_RANGE_NOT_REJECTED:'+String(rangeCode));

  return {passed:true,operation:'image.raster.sourceRetouch.v1',objectId:ref.objectId,baselineHash,baselinePreview,types:results,staleRejected:true,noOpRejected:true,outOfRangeRejected:true};
})()`;

const RASTER_LOCAL_RETOUCH_B3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const fnv=value=>{const text=typeof value==='string'?value:JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const rasterHash=object=>fnv(object?.rasterState?.colorRaster||null);
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED');return {status:r.status,fingerprint:findField(r,'renderFingerprint')||null};};
  const propose=async task=>{const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+JSON.stringify(p.diagnostics||[]));const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');return proposalId;};
  const approve=async proposalId=>{const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')return a;const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');return {result:a,token};};
  const edit=async task=>{const proposalId=await propose(task),approved=await approve(proposalId);if(!approved.token)throw new Error('APPROVE_FAILED:'+JSON.stringify(approved));const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:approved.token}));if(e?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+JSON.stringify(e.diagnostics||[]));if(findField(e,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED');await waitFrames();return e;};

  const source=document.createElement('canvas');source.width=72;source.height=54;
  const ctx=source.getContext('2d'),image=ctx.createImageData(72,54);
  for(let y=0;y<54;y++)for(let x=0;x<72;x++){
    const o=(y*72+x)*4;
    image.data[o]=60+((x*7+y*3)%140);
    image.data[o+1]=50+((x*3+y*11)%150);
    image.data[o+2]=70+((x*13+y*5)%140);
    image.data[o+3]=255;
  }
  for(let y=8;y<21;y++)for(let x=52;x<65;x++){
    const o=(y*72+x)*4;image.data[o]=180;image.data[o+1]=70;image.data[o+2]=60;image.data[o+3]=255;
  }
  ctx.putImageData(image,0,0);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-local-retouch-b3.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B3 Local Retouch',type:'image/png',intent:'B3 non-source local retouch candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED');
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_REF_MISSING');
  await waitFrames();let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'image.raster.localRetouch.v1'}));
  if(descriptor?.status==='FAILED')throw new Error('LOCAL_RETOUCH_DESCRIPTOR_FAILED');
  const descriptorText=JSON.stringify(descriptor);
  for(const type of ['dodge','burn','sponge','localBlur','localSharpen','colorReplacement'])if(!descriptorText.includes(type))throw new Error('LOCAL_RETOUCH_TYPE_MISSING:'+type);
  for(const excluded of ['cloneStamp','healingBrush','patchRaster','patternStamp'])if(descriptorText.includes(excluded))throw new Error('SOURCE_DEPENDENT_TYPE_EXPOSED:'+excluded);

  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();app.history.clear();
  const baselineHash=rasterHash(object),baselinePreview=await preview();
  const task=(taskId,type,args={})=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation:'image.raster.localRetouch.v1',targets:[ref],arguments:{type,x:18,y:18,radius:8,hardness:.9,...args}});
  const bucketTask={schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b3-local-retouch-intervening',operation:'image.raster.paintBucket.v1',targets:[ref],arguments:{x:2,y:2,color:'#20b86a',tolerance:0,contiguous:true,opacity:1}};

  const staleProposal=await propose(task('qa-b3-local-retouch-stale','burn',{strength:.7}));
  await edit(bucketTask);
  const staleApproval=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleProposal}));
  const staleCode=findField(staleApproval,'code')||JSON.stringify(staleApproval.diagnostics||[]);
  if(staleApproval?.status!=='FAILED'||!String(staleCode).includes('TARGET_STALE'))throw new Error('LOCAL_RETOUCH_STALE_NOT_REJECTED:'+String(staleCode));
  const undoIntervening=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoIntervening?.status==='FAILED')throw new Error('UNDO_INTERVENING_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);if(rasterHash(object)!==baselineHash)throw new Error('STALE_BASELINE_NOT_RESTORED');

  const cases=[
    {type:'dodge',args:{x:18,y:18,radius:8,strength:.7,hardness:.9}},
    {type:'burn',args:{x:18,y:18,radius:8,strength:.7,hardness:.9}},
    {type:'sponge',args:{x:18,y:18,radius:8,strength:.8,mode:'saturate',hardness:.9}},
    {type:'localBlur',args:{x:36,y:27,radius:10,strength:1,kernelRadius:3,hardness:.9}},
    {type:'localSharpen',args:{x:36,y:27,radius:10,amount:2,kernelRadius:2,hardness:.9}},
    {type:'colorReplacement',args:{x:58,y:14,radius:6,replacementColor:'#2d74cf',referenceColor:'#b4463c',tolerance:0,strength:1,hardness:1}}
  ];
  const results=[];
  for(const item of cases){
    const executed=await edit(task('qa-b3-local-retouch-'+item.type,item.type,item.args));
    object=flatObjects().find(value=>value.id===ref.objectId);
    const afterHash=rasterHash(object),afterPreview=await preview();
    if(afterHash===baselineHash)throw new Error('LOCAL_RETOUCH_PIXELS_UNCHANGED:'+item.type);
    if(baselinePreview.fingerprint&&afterPreview.fingerprint===baselinePreview.fingerprint)throw new Error('LOCAL_RETOUCH_PREVIEW_UNCHANGED:'+item.type);
    const controller=findField(executed,'controllerResult');
    if(controller?.rasterEdit?.type!==item.type||!(controller?.rasterEdit?.changedPixels>0))throw new Error('LOCAL_RETOUCH_RECEIPT_INVALID:'+item.type+':'+JSON.stringify(controller));
    const serialized=JSON.stringify(controller);
    if(serialized.includes('"data"')||serialized.includes('"alpha"'))throw new Error('LOCAL_RETOUCH_RAW_PAYLOAD_LEAK:'+item.type);
    if(app.history.undoStack.at(-1)?.label!=='CHAT raster local retouch: '+item.type)throw new Error('LOCAL_RETOUCH_HISTORY_LABEL:'+item.type);

    const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('LOCAL_RETOUCH_UNDO_FAILED:'+item.type);
    await waitFrames();object=flatObjects().find(value=>value.id===ref.objectId);const undoHash=rasterHash(object),undoPreview=await preview();
    if(undoHash!==baselineHash)throw new Error('LOCAL_RETOUCH_UNDO_PIXELS:'+item.type);
    if(baselinePreview.fingerprint&&undoPreview.fingerprint!==baselinePreview.fingerprint)throw new Error('LOCAL_RETOUCH_UNDO_PREVIEW:'+item.type);

    const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('LOCAL_RETOUCH_REDO_FAILED:'+item.type);
    await waitFrames();object=flatObjects().find(value=>value.id===ref.objectId);const redoHash=rasterHash(object),redoPreview=await preview();
    if(redoHash!==afterHash)throw new Error('LOCAL_RETOUCH_REDO_PIXELS:'+item.type);
    if(afterPreview.fingerprint&&redoPreview.fingerprint!==afterPreview.fingerprint)throw new Error('LOCAL_RETOUCH_REDO_PREVIEW:'+item.type);

    results.push({type:item.type,afterHash,afterPreview,changedPixels:controller.rasterEdit.changedPixels,changedChannels:controller.rasterEdit.changedChannels});
    const restore=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(restore?.status==='FAILED')throw new Error('LOCAL_RETOUCH_RESTORE_FAILED:'+item.type);
    await waitFrames();object=flatObjects().find(value=>value.id===ref.objectId);if(rasterHash(object)!==baselineHash)throw new Error('LOCAL_RETOUCH_RESTORE_PIXELS:'+item.type);
  }

  const noopProposal=await propose(task('qa-b3-local-retouch-noop','dodge',{strength:0}));
  const noopApproved=await approve(noopProposal);if(!noopApproved.token)throw new Error('LOCAL_RETOUCH_NOOP_APPROVE_FAILED');
  const noop=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:noopProposal,approvalToken:noopApproved.token}));
  const noopCode=findField(noop,'code')||JSON.stringify(noop.diagnostics||[]);
  if(noop?.status!=='FAILED'||!String(noopCode).includes('NO_OP'))throw new Error('LOCAL_RETOUCH_NOOP_NOT_REJECTED:'+String(noopCode));

  return {passed:true,operation:'image.raster.localRetouch.v1',objectId:ref.objectId,baselineHash,baselinePreview,types:results,staleRejected:true,noOpRejected:true};
})()`;

const RASTER_SPOT_HEAL_B3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const fnv=value=>{const text=typeof value==='string'?value:JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const rasterHash=object=>fnv(object?.rasterState?.colorRaster||null);
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED');return {status:r.status,fingerprint:findField(r,'renderFingerprint')||null};};
  const propose=async task=>{const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+JSON.stringify(p.diagnostics||[]));const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');return proposalId;};
  const approve=async proposalId=>{const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')return a;const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');return {result:a,token};};
  const edit=async task=>{const proposalId=await propose(task),approved=await approve(proposalId);if(!approved.token)throw new Error('APPROVE_FAILED:'+JSON.stringify(approved));const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:approved.token}));if(e?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+JSON.stringify(e.diagnostics||[]));if(findField(e,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED');await waitFrames();return e;};

  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#68758a';ctx.fillRect(0,0,64,48);ctx.fillStyle='#d53852';ctx.fillRect(28,20,8,8);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-spot-heal-b3.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B3 Spot Heal',type:'image/png',intent:'B3 spot healing candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED');
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_REF_MISSING');
  await waitFrames();let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'image.raster.spotHeal.v1'}));
  if(descriptor?.status==='FAILED'||!JSON.stringify(descriptor).includes('neighborRadius'))throw new Error('SPOT_HEAL_DESCRIPTOR_MISSING');

  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();app.history.clear();
  const beforeHash=rasterHash(object),beforePreview=await preview();
  const healTask=(taskId,patch={})=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation:'image.raster.spotHeal.v1',targets:[ref],arguments:{x:32,y:24,radius:6,opacity:1,hardness:1,neighborRadius:2,...patch}});
  const bucketTask={schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b3-spot-heal-intervening',operation:'image.raster.paintBucket.v1',targets:[ref],arguments:{x:2,y:2,color:'#20b86a',tolerance:0,contiguous:true,opacity:1}};

  const staleProposal=await propose(healTask('qa-b3-spot-heal-stale'));
  await edit(bucketTask);
  const staleApproval=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleProposal}));
  const staleCode=findField(staleApproval,'code')||JSON.stringify(staleApproval.diagnostics||[]);
  if(staleApproval?.status!=='FAILED'||!String(staleCode).includes('TARGET_STALE'))throw new Error('SPOT_HEAL_STALE_NOT_REJECTED:'+String(staleCode));
  const undoIntervening=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoIntervening?.status==='FAILED')throw new Error('UNDO_INTERVENING_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);if(rasterHash(object)!==beforeHash)throw new Error('STALE_BASELINE_NOT_RESTORED');

  const executed=await edit(healTask('qa-b3-spot-heal-main'));
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterHash=rasterHash(object),afterPreview=await preview();
  if(afterHash===beforeHash)throw new Error('SPOT_HEAL_PIXELS_UNCHANGED');
  if(beforePreview.fingerprint&&afterPreview.fingerprint===beforePreview.fingerprint)throw new Error('SPOT_HEAL_PREVIEW_UNCHANGED');
  const controller=findField(executed,'controllerResult');
  if(!(controller?.rasterEdit?.changedPixels>0))throw new Error('SPOT_HEAL_CHANGED_PIXELS_MISSING');
  if(JSON.stringify(controller).includes('affectedMask'))throw new Error('SPOT_HEAL_MASK_LEAK');
  if(app.history.undoStack.at(-1)?.label!=='CHAT raster Spot Healing')throw new Error('SPOT_HEAL_HISTORY_LABEL');

  const noopProposal=await propose(healTask('qa-b3-spot-heal-noop',{opacity:0}));
  const noopApproved=await approve(noopProposal);if(!noopApproved.token)throw new Error('SPOT_HEAL_NOOP_APPROVE_FAILED');
  const noop=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:noopProposal,approvalToken:noopApproved.token}));
  const noopCode=findField(noop,'code')||JSON.stringify(noop.diagnostics||[]);
  if(noop?.status!=='FAILED'||!String(noopCode).includes('NO_OP'))throw new Error('SPOT_HEAL_NOOP_NOT_REJECTED:'+String(noopCode));

  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('SPOT_HEAL_UNDO_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);const undoHash=rasterHash(object),undoPreview=await preview();
  if(undoHash!==beforeHash)throw new Error('SPOT_HEAL_UNDO_PIXELS');
  if(beforePreview.fingerprint&&undoPreview.fingerprint!==beforePreview.fingerprint)throw new Error('SPOT_HEAL_UNDO_PREVIEW');

  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('SPOT_HEAL_REDO_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);const redoHash=rasterHash(object),redoPreview=await preview();
  if(redoHash!==afterHash)throw new Error('SPOT_HEAL_REDO_PIXELS');
  if(afterPreview.fingerprint&&redoPreview.fingerprint!==afterPreview.fingerprint)throw new Error('SPOT_HEAL_REDO_PREVIEW');

  return {passed:true,operation:'image.raster.spotHeal.v1',objectId:ref.objectId,beforeHash,afterHash,undoHash,redoHash,beforePreview,afterPreview,undoPreview,redoPreview,historyLabel:'CHAT raster Spot Healing',changedPixels:controller.rasterEdit.changedPixels,changedChannels:controller.rasterEdit.changedChannels,staleRejected:true,noOpRejected:true,controllerResult:controller};
})()`;

const RASTER_MASK_B3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const fnv=value=>{const text=typeof value==='string'?value:JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const rasterHash=object=>fnv(object?.rasterState?.colorRaster||null);
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED');return {status:r.status,fingerprint:findField(r,'renderFingerprint')||null};};
  const propose=async task=>{const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+JSON.stringify(p.diagnostics||[]));const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');return proposalId;};
  const approve=async proposalId=>{const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')return a;const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');return {result:a,token};};
  const edit=async task=>{const proposalId=await propose(task),approved=await approve(proposalId);if(!approved.token)throw new Error('APPROVE_FAILED:'+JSON.stringify(approved));const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:approved.token}));if(e?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+JSON.stringify(e.diagnostics||[]));if(findField(e,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED');await waitFrames();return e;};
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);ctx.fillStyle='#ffffff';ctx.fillRect(8,8,48,10);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-mask-b3.png',{type:'image/png'});
  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B3 Raster Mask',type:'image/png',intent:'B3 raster mask candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED');
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_REF_MISSING');
  await waitFrames();let object=flatObjects().find(item=>item.id===ref.objectId);if(!object?.rasterState?.colorRaster)throw new Error('RASTER_STATE_MISSING');

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'image.mask.raster.set.v1'}));
  if(descriptor?.status==='FAILED')throw new Error('MASK_DESCRIPTOR_FAILED');
  const argumentProps=findField(descriptor,'arguments')?.properties||findField(descriptor,'inputSchema')?.properties?.arguments?.properties||{};
  if(Object.prototype.hasOwnProperty.call(argumentProps,'alpha'))throw new Error('RAW_ALPHA_EXPOSED');

  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();app.history.clear();
  const baselineHash=rasterHash(object),baselinePreview=await preview();
  const maskTask=(taskId,patch={})=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation:'image.mask.raster.set.v1',targets:[ref],arguments:{shape:'rectangle',x:8,y:6,width:32,height:24,invert:false,feather:0,expand:0,...patch}});
  const bucketTask=(taskId,color)=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation:'image.raster.paintBucket.v1',targets:[ref],arguments:{x:4,y:4,color,tolerance:0,contiguous:true,opacity:1}});

  const staleMaskProposal=await propose(maskTask('qa-b3-mask-stale-pixels'));
  await edit(bucketTask('qa-b3-mask-intervening-pixels','#20b86a'));
  const staleMaskApproval=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleMaskProposal}));
  const stalePixelCode=findField(staleMaskApproval,'code')||JSON.stringify(staleMaskApproval.diagnostics||[]);
  if(staleMaskApproval?.status!=='FAILED'||!String(stalePixelCode).includes('TARGET_STALE'))throw new Error('PIXEL_STALE_NOT_REJECTED:'+String(stalePixelCode));
  const undoPixels=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoPixels?.status==='FAILED')throw new Error('UNDO_PIXELS_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);
  if(rasterHash(object)!==baselineHash)throw new Error('PIXEL_STALE_TEST_NOT_RESTORED');

  const staleBucketProposal=await propose(bucketTask('qa-b3-bucket-stale-mask','#20b86a'));
  const maskExecuted=await edit(maskTask('qa-b3-mask-main'));
  object=flatObjects().find(item=>item.id===ref.objectId);
  if(!object?.rasterMask||object.rasterMask.type!=='raster-mask')throw new Error('RASTER_MASK_MISSING');
  const afterMaskHash=rasterHash(object);
  if(afterMaskHash!==baselineHash)throw new Error('MASK_MUTATED_PIXELS');
  const afterMaskPreview=await preview();
  if(baselinePreview.fingerprint&&afterMaskPreview.fingerprint===baselinePreview.fingerprint)throw new Error('MASK_PREVIEW_UNCHANGED');
  const maskController=findField(maskExecuted,'controllerResult');
  if(!maskController?.rasterMask?.fingerprint||maskController?.rasterMask?.bounds?.w!==32||maskController?.rasterMask?.bounds?.h!==24)throw new Error('MASK_RECEIPT_INVALID:'+JSON.stringify(maskController));
  if(JSON.stringify(maskController).includes('"alpha"'))throw new Error('MASK_RECEIPT_ALPHA_LEAK');

  const staleBucketApproval=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:staleBucketProposal}));
  const staleMaskCode=findField(staleBucketApproval,'code')||JSON.stringify(staleBucketApproval.diagnostics||[]);
  if(staleBucketApproval?.status!=='FAILED'||!String(staleMaskCode).includes('TARGET_STALE'))throw new Error('MASK_STALE_NOT_REJECTED:'+String(staleMaskCode));

  const noOpProposal=await propose(maskTask('qa-b3-mask-noop'));
  const noOpApproved=await approve(noOpProposal);if(!noOpApproved.token)throw new Error('NOOP_APPROVE_FAILED');
  const noOp=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:noOpProposal,approvalToken:noOpApproved.token}));
  const noOpCode=findField(noOp,'code')||JSON.stringify(noOp.diagnostics||[]);
  if(noOp?.status!=='FAILED'||!String(noOpCode).includes('NO_OP'))throw new Error('MASK_NO_OP_NOT_REJECTED:'+String(noOpCode));

  if(app.history.undoStack.at(-1)?.label!=='CHAT set raster mask')throw new Error('MASK_HISTORY_LABEL');
  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_MASK_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);const undoPreview=await preview();
  if(object?.rasterMask)throw new Error('MASK_UNDO_STATE');
  if(baselinePreview.fingerprint&&undoPreview.fingerprint!==baselinePreview.fingerprint)throw new Error('MASK_UNDO_PREVIEW');

  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_MASK_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);const redoPreview=await preview();
  if(!object?.rasterMask)throw new Error('MASK_REDO_STATE');
  if(afterMaskPreview.fingerprint&&redoPreview.fingerprint!==afterMaskPreview.fingerprint)throw new Error('MASK_REDO_PREVIEW');

  return {passed:true,operation:'image.mask.raster.set.v1',objectId:ref.objectId,baselineHash,afterMaskHash,baselinePreview,afterMaskPreview,undoPreview,redoPreview,historyLabel:'CHAT set raster mask',maskReceipt:maskController.rasterMask,pixelStaleRejected:true,maskStaleRejected:true,noOpRejected:true};
})()`;

const RASTER_DIRECT_PAINT_BUCKET_B3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const toolNames=api.tools.registry().map(item=>item.name);
  for(const name of ['import_ink_raster','import_ink_reference','describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','get_ink_preview','undo_ink','redo_ink']) if(!toolNames.includes(name)) throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  const flatObjects=()=>app.page().layers.flatMap(layer=>layer.objects||[]);
  const waitFrames=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const findField=(value,key,depth=0)=>{if(value==null||depth>10||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const fnv=value=>{const text=typeof value==='string'?value:JSON.stringify(value);let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619);}return (h>>>0).toString(16).padStart(8,'0');};
  const rasterHash=object=>fnv(object?.rasterState?.colorRaster||null);
  const preview=async()=>{await waitFrames();const r=await Promise.resolve(api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:800,background:true}));if(r?.status==='FAILED')throw new Error('PREVIEW_FAILED');return {status:r.status,fingerprint:findField(r,'renderFingerprint')||null};};
  const proposeApprove=async(task)=>{
    const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task}));if(p?.status==='FAILED')throw new Error('PROPOSE_FAILED:'+JSON.stringify(p.diagnostics||[]));
    const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING');
    const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId}));if(a?.status==='FAILED')throw new Error('APPROVE_FAILED:'+JSON.stringify(a.diagnostics||[]));
    const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING');
    return {proposalId,token};
  };
  const edit=async(task)=>{
    const {proposalId,token}=await proposeApprove(task);
    const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId,approvalToken:token}));
    if(e?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+JSON.stringify(e.diagnostics||[]));
    if(findField(e,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED');
    await waitFrames();return e;
  };
  const source=document.createElement('canvas');source.width=64;source.height=48;
  const ctx=source.getContext('2d');
  ctx.fillStyle='#d64d6b';ctx.fillRect(0,0,32,48);
  ctx.fillStyle='#375b9b';ctx.fillRect(32,0,32,48);
  ctx.fillStyle='#ffffff';ctx.fillRect(8,8,48,10);
  const blob=await new Promise(resolve=>source.toBlob(resolve,'image/png'));if(!blob)throw new Error('PNG_BLOB_FAILED');
  const file=new File([blob],'candidate-raster-paint-bucket-b3.png',{type:'image/png'});

  const imported=await Promise.resolve(api.tools.invoke('import_ink_raster',{input:{file},options:{name:'QA B3 Paint Bucket Raster',type:'image/png',intent:'B3 destructive raster candidate QA'}}));
  if(imported?.status==='FAILED')throw new Error('RASTER_IMPORT_FAILED:'+JSON.stringify(imported.diagnostics||[]));
  const ref=imported?.createdRefs?.[0];if(!ref?.objectId)throw new Error('RASTER_REF_MISSING');
  await waitFrames();
  let object=flatObjects().find(item=>item.id===ref.objectId);
  if(!object?.rasterState?.colorRaster||object.rasterState.colorRaster.bitDepth!==8||object.rasterState.colorRaster.colorMode!=='RGB')throw new Error('RASTER_STATE_INVALID');

  const descriptor=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:'image.raster.paintBucket.v1'}));
  if(descriptor?.status==='FAILED'||!JSON.stringify(descriptor).includes('paintBucket'))throw new Error('PAINT_BUCKET_DESCRIPTOR_MISSING');

  app.selection=[];app.refreshSelectionUI?.();app.renderer?.render?.();await waitFrames();
  app.history.clear();
  const beforeHash=rasterHash(object), beforePreview=await preview(), beforeUndo=app.history.undoStack.length;

  const executed=await edit({schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b3-paint-bucket-1',operation:'image.raster.paintBucket.v1',targets:[ref],arguments:{x:4,y:4,color:'#20b86a',tolerance:0,contiguous:true,opacity:1}});
  object=flatObjects().find(item=>item.id===ref.objectId);
  const afterHash=rasterHash(object), afterPreview=await preview(), afterUndo=app.history.undoStack.length;
  if(afterHash===beforeHash)throw new Error('RASTER_PIXELS_UNCHANGED');
  if(beforePreview.fingerprint&&afterPreview.fingerprint===beforePreview.fingerprint)throw new Error('PREVIEW_UNCHANGED');
  if(afterUndo!==beforeUndo+1)throw new Error('HISTORY_COUNT');
  if(app.history.undoStack.at(-1)?.label!=='CHAT raster Paint Bucket')throw new Error('HISTORY_LABEL');
  const controller=findField(executed,'controllerResult');
  if(!(controller?.rasterEdit?.changedPixels>0))throw new Error('CHANGED_PIXELS_NOT_REPORTED');

  const noOpTask={schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b3-paint-bucket-noop',operation:'image.raster.paintBucket.v1',targets:[ref],arguments:{x:4,y:4,color:'#20b86a',tolerance:0,contiguous:true,opacity:1}};
  const noOpAuth=await proposeApprove(noOpTask);
  const noOp=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:noOpAuth.proposalId,approvalToken:noOpAuth.token}));
  const noOpCode=findField(noOp,'code')||findField(noOp,'errorCode')||JSON.stringify(noOp.diagnostics||[]);
  if(noOp?.status!=='FAILED'||!String(noOpCode).includes('NO_OP'))throw new Error('NO_OP_NOT_REJECTED:'+String(noOpCode));

  const undone=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undone?.status==='FAILED')throw new Error('UNDO_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);
  const undoHash=rasterHash(object), undoPreview=await preview();
  if(undoHash!==beforeHash)throw new Error('UNDO_RASTER_NOT_EXACT');
  if(beforePreview.fingerprint&&undoPreview.fingerprint!==beforePreview.fingerprint)throw new Error('UNDO_PREVIEW_NOT_EXACT');

  const redone=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redone?.status==='FAILED')throw new Error('REDO_FAILED');
  await waitFrames();object=flatObjects().find(item=>item.id===ref.objectId);
  const redoHash=rasterHash(object), redoPreview=await preview();
  if(redoHash!==afterHash)throw new Error('REDO_RASTER_NOT_EXACT');
  if(afterPreview.fingerprint&&redoPreview.fingerprint!==afterPreview.fingerprint)throw new Error('REDO_PREVIEW_NOT_EXACT');

  const refImport=await Promise.resolve(api.tools.invoke('import_ink_reference',{input:{file},options:{name:'QA B3 Locked Reference'}}));
  if(refImport?.status==='FAILED')throw new Error('REFERENCE_IMPORT_FAILED');
  const lockedRef=refImport?.createdRefs?.[0];if(!lockedRef?.objectId)throw new Error('REFERENCE_REF_MISSING');
  const lockedProposal=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:{schema:'INK-CHAT-EDIT-TASK',version:1,taskId:'qa-b3-reference-reject',operation:'image.raster.paintBucket.v1',targets:[lockedRef],arguments:{x:2,y:2,color:'#ffffff'}}}));
  if(lockedProposal?.status!=='FAILED')throw new Error('REFERENCE_TARGET_NOT_REJECTED');

  return {passed:true,operation:'image.raster.paintBucket.v1',objectId:ref.objectId,beforeHash,afterHash,undoHash,redoHash,beforePreview,afterPreview,undoPreview,redoPreview,historyLabel:'CHAT raster Paint Bucket',changedPixels:controller?.rasterEdit?.changedPixels||0,changedChannels:controller?.rasterEdit?.changedChannels||0,noOpRejected:true,referenceRejected:true,controllerResult:controller};
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


const SNAP_GUIDES_C3_CASE = String.raw`(async()=>{
  const app=window.INK_APP,api=app?.inkPublicApi;
  if(!api?.tools?.invoke)throw new Error('INK_PUBLIC_API_UNAVAILABLE');
  const required=['describe_ink_capability','propose_ink_edit','approve_ink_edit','execute_ink_edit','undo_ink','redo_ink','get_ink_history'];
  const names=api.tools.registry().map(item=>item.name);
  for(const name of required)if(!names.includes(name))throw new Error('MISSING_TOOL:'+name);
  if(!app.documentOpen){app.documentOpen=true;app.refreshWorkspaceUI?.();}
  app.history.clear();

  const findField=(value,key,depth=0)=>{if(value==null||depth>12||typeof value!=='object')return undefined;if(Object.prototype.hasOwnProperty.call(value,key))return value[key];for(const item of Object.values(value)){const found=findField(item,key,depth+1);if(found!==undefined)return found;}return undefined;};
  const task=(taskId,operation,args)=>({schema:'INK-CHAT-EDIT-TASK',version:1,taskId,operation,targets:[],arguments:args});
  const propose=async t=>{const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:t}));if(p?.status==='FAILED')return {failed:p};const proposalId=findField(p,'proposalId');if(!proposalId)throw new Error('PROPOSAL_ID_MISSING:'+t.operation);return {result:p,proposalId};};
  const edit=async t=>{const p=await propose(t);if(p.failed)throw new Error('PROPOSE_FAILED:'+t.operation+':'+JSON.stringify(p.failed.diagnostics||[]));const a=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:p.proposalId}));if(a?.status==='FAILED')throw new Error('APPROVE_FAILED:'+t.operation+':'+JSON.stringify(a.diagnostics||[]));const token=findField(a,'approvalToken');if(!token)throw new Error('TOKEN_MISSING:'+t.operation);const e=await Promise.resolve(api.tools.invoke('execute_ink_edit',{proposalId:p.proposalId,approvalToken:token}));if(e?.status==='FAILED')throw new Error('EXECUTE_FAILED:'+t.operation+':'+JSON.stringify(e.diagnostics||[]));if(findField(e,'changed')!==true)throw new Error('EXECUTE_NOT_CHANGED:'+t.operation);return e;};
  const expectProposeFailure=async(t,code)=>{const p=await Promise.resolve(api.tools.invoke('propose_ink_edit',{task:t}));const found=findField(p,'code')||JSON.stringify(p?.diagnostics||[]);if(p?.status!=='FAILED'||!String(found).includes(code))throw new Error('EXPECTED_PROPOSE_FAILURE:'+code+':'+String(found));return String(found);};
  const guide=id=>(app.page().guides||[]).find(item=>item.id===id)||null;
  const snap=()=>JSON.parse(JSON.stringify(app.page().snap||{}));
  const guideState=()=>JSON.parse(JSON.stringify(app.page().guides||[]));

  const ops=['page.snap.set.v1','guide.add.v1','guide.move.v1','guide.remove.v1','guide.lock.set.v1','guide.visibility.set.v1'];
  for(const operation of ops){
    const d=await Promise.resolve(api.tools.invoke('describe_ink_capability',{idOrToolName:operation}));
    if(d?.status==='FAILED')throw new Error('DESCRIBE_FAILED:'+operation);
    const text=JSON.stringify(d);
    if(!text.includes(operation)||!text.includes('precisionFingerprint'))throw new Error('DESCRIPTOR_INVALID:'+operation);
    const max=findField(d,'maxItems');if(max!==0)throw new Error('C3_TARGET_SCHEMA_NOT_ZERO:'+operation+':'+max);
  }

  const initialSnap=snap(),initialGuides=guideState();
  const baselineGrid=initialSnap?.categories?.grid===true;
  const gridValue=!baselineGrid;

  // Stale precision-layout proposal: any intervening snap/guide mutation must invalidate it.
  const stale=await propose(task('qa-c3-stale','page.snap.set.v1',{key:'grid',value:gridValue}));
  if(stale.failed)throw new Error('STALE_PROPOSE_FAILED');
  const staleGuide=await edit(task('qa-c3-stale-intervening','guide.add.v1',{id:'qa-c3-stale-guide',orientation:'vertical',position:44}));
  if(!guide('qa-c3-stale-guide'))throw new Error('STALE_INTERVENING_GUIDE_MISSING');
  const staleApproval=await Promise.resolve(api.tools.invoke('approve_ink_edit',{proposalId:stale.proposalId}));
  const staleCode=findField(staleApproval,'code')||JSON.stringify(staleApproval?.diagnostics||[]);
  if(staleApproval?.status!=='FAILED'||!String(staleCode).includes('STALE_PRECISION_LAYOUT'))throw new Error('C3_STALE_NOT_REJECTED:'+String(staleCode));
  const undoStale=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoStale?.status==='FAILED')throw new Error('UNDO_STALE_INTERVENING_FAILED');
  if(guide('qa-c3-stale-guide'))throw new Error('STALE_GUIDE_UNDO_FAILED');

  // Snap category mutation + exact Undo/Redo.
  app.history.clear();
  const snapExec=await edit(task('qa-c3-snap-grid','page.snap.set.v1',{key:'grid',value:gridValue}));
  if((app.page().snap?.categories?.grid===true)!==gridValue)throw new Error('SNAP_GRID_STATE');
  if(app.history.undoStack.at(-1)?.label!=='吸附設定')throw new Error('SNAP_HISTORY_LABEL');
  const snapReceipt=findField(snapExec,'controllerResult');
  if(snapReceipt?.snap?.categories?.grid!==gridValue)throw new Error('SNAP_RECEIPT_INVALID');
  const snapNoOp=await expectProposeFailure(task('qa-c3-snap-grid-noop','page.snap.set.v1',{key:'grid',value:gridValue}),'NO_OP');
  const undoSnap=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoSnap?.status==='FAILED'||(app.page().snap?.categories?.grid===true)!==baselineGrid)throw new Error('SNAP_UNDO_FAILED');
  const redoSnap=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redoSnap?.status==='FAILED'||(app.page().snap?.categories?.grid===true)!==gridValue)throw new Error('SNAP_REDO_FAILED');
  const resetSnap=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(resetSnap?.status==='FAILED'||(app.page().snap?.categories?.grid===true)!==baselineGrid)throw new Error('SNAP_RESET_FAILED');

  // Guide lifecycle through native InkApp wrappers.
  app.history.clear();
  const add=await edit(task('qa-c3-guide-add','guide.add.v1',{id:'qa-c3-guide-v',orientation:'vertical',position:120}));
  let g=guide('qa-c3-guide-v');
  if(!g||g.orientation!=='vertical'||g.position!==120||g.locked||g.visible===false)throw new Error('GUIDE_ADD_STATE:'+JSON.stringify(g));
  if(app.history.undoStack.at(-1)?.label!=='新增參考線')throw new Error('GUIDE_ADD_HISTORY');

  const moved=await edit(task('qa-c3-guide-move','guide.move.v1',{guideId:'qa-c3-guide-v',position:180}));
  g=guide('qa-c3-guide-v');if(!g||g.position!==180)throw new Error('GUIDE_MOVE_STATE');
  if(app.history.undoStack.at(-1)?.label!=='移動參考線')throw new Error('GUIDE_MOVE_HISTORY');

  // Prove the stored guide participates in the existing precision-layout snap engine without pointer simulation.
  const precision=await import(new URL('src/editor/precision-layout.js',document.baseURI).href);
  const snapEvidence=precision.resolveManipulationSnap({x:176,y:30,w:20,h:20},[],{delta:{x:0,y:0},guides:app.page().guides||[],settings:app.page().snap||{},gridSize:null,tolerance:7});
  if(!snapEvidence?.snapped?.x||snapEvidence?.evidence?.x?.type!=='guide'||snapEvidence?.evidence?.x?.targetId!=='qa-c3-guide-v')throw new Error('GUIDE_SNAP_EVIDENCE_INVALID:'+JSON.stringify(snapEvidence));

  await edit(task('qa-c3-guide-lock','guide.lock.set.v1',{guideId:'qa-c3-guide-v',locked:true}));
  g=guide('qa-c3-guide-v');if(!g?.locked)throw new Error('GUIDE_LOCK_STATE');
  if(app.history.undoStack.at(-1)?.label!=='鎖定參考線')throw new Error('GUIDE_LOCK_HISTORY');
  const lockedMove=await expectProposeFailure(task('qa-c3-guide-locked-move','guide.move.v1',{guideId:'qa-c3-guide-v',position:220}),'GUIDE_LOCKED');
  await edit(task('qa-c3-guide-unlock','guide.lock.set.v1',{guideId:'qa-c3-guide-v',locked:false}));

  await edit(task('qa-c3-guide-hide','guide.visibility.set.v1',{guideId:'qa-c3-guide-v',visible:false}));
  g=guide('qa-c3-guide-v');if(!g||g.visible!==false)throw new Error('GUIDE_HIDE_STATE');
  if(app.history.undoStack.at(-1)?.label!=='顯示參考線')throw new Error('GUIDE_VISIBILITY_HISTORY');
  const hiddenNoOp=await expectProposeFailure(task('qa-c3-guide-hide-noop','guide.visibility.set.v1',{guideId:'qa-c3-guide-v',visible:false}),'NO_OP');
  await edit(task('qa-c3-guide-show','guide.visibility.set.v1',{guideId:'qa-c3-guide-v',visible:true}));

  const beforeRemove=JSON.stringify(guide('qa-c3-guide-v'));
  await edit(task('qa-c3-guide-remove','guide.remove.v1',{guideId:'qa-c3-guide-v'}));
  if(guide('qa-c3-guide-v'))throw new Error('GUIDE_REMOVE_STATE');
  if(app.history.undoStack.at(-1)?.label!=='刪除參考線')throw new Error('GUIDE_REMOVE_HISTORY');
  const undoRemove=await Promise.resolve(api.tools.invoke('undo_ink',{}));if(undoRemove?.status==='FAILED'||JSON.stringify(guide('qa-c3-guide-v'))!==beforeRemove)throw new Error('GUIDE_REMOVE_UNDO');
  const redoRemove=await Promise.resolve(api.tools.invoke('redo_ink',{}));if(redoRemove?.status==='FAILED'||guide('qa-c3-guide-v'))throw new Error('GUIDE_REMOVE_REDO');

  const history=await Promise.resolve(api.tools.invoke('get_ink_history',{}));
  if(history?.status==='FAILED')throw new Error('HISTORY_FAILED');
  return {
    passed:true,
    operations:ops,
    baselineGrid,
    gridValue,
    staleCode:String(staleCode),
    snapNoOp,
    lockedMove,
    hiddenNoOp,
    snapEvidence,
    finalGuides:guideState(),
    initialGuides,
    historyLabels:app.history.undoStack.map(entry=>entry.label)
  };
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
    const caseExpression=request.case==='path-deformation-b4'?B4_BROWSER_CASE:request.case==='page-paper-webgl-roughness'?PAPER_WEBGL_ROUGHNESS_CASE:request.case==='page-paper-a3'?PAPER_A3_CASE:request.case==='page-paper-single-stroke'?PAPER_SINGLE_STROKE_CASE:request.case==='paint-session-create'?PAINT_CASE:(request.case==='stroke-create-a2'?STROKE_A2_CASE:(request.case==='stroke-erase-a4'?STROKE_ERASE_A4_CASE:(request.case==='blender-smudge-a5'?BLENDER_SMUDGE_A5_CASE:(request.case==='raster-direct-paint-bucket-b3'?RASTER_DIRECT_PAINT_BUCKET_B3_CASE:(request.case==='raster-mask-b3'?RASTER_MASK_B3_CASE:(request.case==='raster-spot-heal-b3'?RASTER_SPOT_HEAL_B3_CASE:(request.case==='raster-local-retouch-b3'?RASTER_LOCAL_RETOUCH_B3_CASE:(request.case==='raster-source-retouch-b3'?RASTER_SOURCE_RETOUCH_B3_CASE:(request.case==='raster-advanced-ingest'?RASTER_ADVANCED_INGEST_CASE:(request.case==='page-ops-c1'?PAGE_OPS_C1_CASE:(request.case==='align-distribute-c2'?ALIGN_DISTRIBUTE_C2_CASE:(request.case==='snap-guides-c3'?SNAP_GUIDES_C3_CASE:(request.case==='web-raster-bridge'?RASTER_CASE:(request.case==='raster-import-named-tool'?RASTER_NAMED_TOOL_CASE:(request.case==='raster-stack-adjustment-b2'?RASTER_STACK_ADJUSTMENT_B2_CASE:(request.case==='raster-stack-filter-b2'?RASTER_STACK_FILTER_B2_CASE:(request.case==='raster-stack-blend-b2'?RASTER_STACK_BLEND_B2_CASE:(request.case==='raster-stack-effect-b2'?RASTER_STACK_EFFECT_B2_CASE:(request.case==='raster-stack-liquify-b2'?RASTER_STACK_LIQUIFY_B2_CASE:RASTER_STACK_B2_CASE)))))))))))))))))));
    const caseResult=await evaluate(cdp,sessionId,caseExpression,90000);
    if(request.imageStackCacheReview===true) caseResult.imageStackCacheReview=await evaluate(cdp,sessionId,IMAGE_STACK_CACHE_REVIEW_CASE,90000);
    if(request.naturalMediaCacheReview===true) caseResult.naturalMediaCacheReview=await evaluate(cdp,sessionId,NATURAL_MEDIA_CACHE_REVIEW_CASE,90000);
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
// Fresh installed-browser process/profile for each required cross-capability regression.
const batchRequest=JSON.parse(await readFile(path.resolve(process.argv[2]),'utf8'));
if(['path-deformation-b4','stroke-erase-a4','blender-smudge-a5','raster-direct-paint-bucket-b3','raster-mask-b3','raster-spot-heal-b3','raster-local-retouch-b3','raster-source-retouch-b3','raster-advanced-ingest','page-ops-c1','align-distribute-c2','snap-guides-c3','raster-stack-b2','raster-stack-adjustment-b2'].includes(batchRequest.case) && batchRequest.regressions===true && !process.exitCode){
  const primary=JSON.parse(await readFile(path.resolve(process.argv[4]),'utf8'));
  primary.regressions=[];
  for(const caseName of (batchRequest.imageStackCacheReview===true?['raster-stack-filter-b2','raster-stack-blend-b2','raster-stack-effect-b2','raster-stack-liquify-b2','paint-session-create','stroke-create-a2','page-paper-a3','blender-smudge-a5','path-deformation-b4','raster-mask-b3','raster-source-retouch-b3','raster-advanced-ingest']:batchRequest.naturalMediaCacheReview===true?['paint-session-create','stroke-create-a2','page-paper-a3','raster-stack-adjustment-b2','path-deformation-b4','page-paper-single-stroke','page-paper-webgl-roughness',...(batchRequest.postIntegration===true?['raster-direct-paint-bucket-b3','raster-mask-b3','raster-local-retouch-b3']:[])]:batchRequest.case==='raster-direct-paint-bucket-b3'?['raster-import-named-tool','raster-stack-adjustment-b2','blender-smudge-a5']:batchRequest.case==='raster-mask-b3'?['raster-direct-paint-bucket-b3','raster-stack-adjustment-b2','blender-smudge-a5']:batchRequest.case==='raster-spot-heal-b3'?['raster-mask-b3','raster-direct-paint-bucket-b3','raster-stack-adjustment-b2']:batchRequest.case==='raster-local-retouch-b3'?['raster-spot-heal-b3','raster-mask-b3','raster-direct-paint-bucket-b3','raster-stack-adjustment-b2']:batchRequest.case==='raster-source-retouch-b3'?['raster-local-retouch-b3','raster-spot-heal-b3','raster-mask-b3','raster-direct-paint-bucket-b3','raster-stack-adjustment-b2']:batchRequest.case==='raster-advanced-ingest'?['raster-import-named-tool','raster-direct-paint-bucket-b3','raster-source-retouch-b3','raster-stack-adjustment-b2']:batchRequest.case==='page-ops-c1'?['stroke-create-a2','page-paper-a3','raster-import-named-tool','raster-stack-adjustment-b2']:batchRequest.case==='align-distribute-c2'?['page-ops-c1','path-deformation-b4','stroke-create-a2','raster-stack-adjustment-b2']:batchRequest.case==='snap-guides-c3'?['align-distribute-c2','page-ops-c1','page-paper-a3','raster-stack-adjustment-b2']:['paint-session-create','stroke-create-a2','page-paper-a3','raster-stack-adjustment-b2'])){
    const prefix=path.resolve(process.argv[4])+'.'+caseName;
    await writeFile(prefix+'.request.json',JSON.stringify({...batchRequest,requestId:batchRequest.requestId+'-'+caseName,case:caseName,regressions:false,naturalMediaCacheReview:false,imageStackCacheReview:false}));
    const regression=spawn(process.execPath,[path.resolve(process.argv[1]),prefix+'.request.json',path.resolve(process.argv[3]),prefix+'.json',prefix+'.png'],{shell:false,stdio:'inherit'});
    const [code]=await once(regression,'exit');
    const result=JSON.parse(await readFile(prefix+'.json','utf8'));
    primary.regressions.push(result);
    if(code!==0||result.status!=='PASS'){primary.status='FAIL';process.exitCode=1;}
  }
  await writeFile(path.resolve(process.argv[4]),JSON.stringify(primary,null,2));
}
