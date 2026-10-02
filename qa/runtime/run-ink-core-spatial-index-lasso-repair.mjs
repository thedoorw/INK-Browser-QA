import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_SHA = process.env.GITHUB_SHA || process.env.INK_TARGET_SHA || '';
assert.match(TARGET_SHA, /^[a-f0-9]{40}$/, 'Exact target SHA required');

const mime = {
  '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8',
  '.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css; charset=utf-8',
  '.svg':'image/svg+xml',
  '.png':'image/png',
  '.jpg':'image/jpeg',
  '.jpeg':'image/jpeg',
  '.json':'application/json',
  '.webmanifest':'application/manifest+json',
  '.wasm':'application/wasm'
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const round = value => Number(Number(value).toFixed(4));
const boundsChanged = (a,b) => Boolean(a && b && ['x','y','w','h'].some(key => Math.abs((a[key]||0)-(b[key]||0)) > 0.01));

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH];
  for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
    candidates.push(path.join(base, 'Google/Chrome/Application/chrome.exe'));
    candidates.push(path.join(base, 'Microsoft/Edge/Application/msedge.exe'));
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Installed Chrome/Edge required');
  return found;
}

async function startServer(root) {
  const site = path.join(root, 'product/source');
  const server = createServer(async (req,res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      res.setHeader('Cache-Control','no-store');
      if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.includes('\\') || decoded.includes('\0')) { res.writeHead(403).end(); return; }
      let dest = path.resolve(site, '.' + (decoded === '/' ? '/index.html' : decoded));
      if (!dest.startsWith(site + path.sep) && dest !== path.join(site,'index.html')) { res.writeHead(403).end(); return; }
      if (!(await stat(dest)).isFile()) { res.writeHead(404).end(); return; }
      const bytes = await readFile(dest);
      res.setHeader('Content-Type', mime[path.extname(dest)] || 'application/octet-stream');
      res.writeHead(200).end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Request failed');
    }
  });
  server.requestTimeout = 15000;
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  return {server,origin:'http://127.0.0.1:'+server.address().port};
}

function createCdpPipe(child) {
  const input=child.stdio[3],output=child.stdio[4];
  assert.ok(input?.writable && output?.readable,'CDP pipe unavailable');
  let nextId=1,buffer=Buffer.alloc(0);
  const pending=new Map();
  const rejectAll=error=>{for(const entry of pending.values()){clearTimeout(entry.timer);entry.reject(error);}pending.clear();};
  output.on('data',chunk=>{
    buffer=Buffer.concat([buffer,chunk]);
    while(true){
      const boundary=buffer.indexOf(0);if(boundary<0)break;
      const raw=buffer.subarray(0,boundary).toString('utf8');buffer=buffer.subarray(boundary+1);if(!raw)continue;
      let message;try{message=JSON.parse(raw);}catch(error){rejectAll(error);continue;}
      if(!message.id)continue;const entry=pending.get(message.id);if(!entry)continue;
      pending.delete(message.id);clearTimeout(entry.timer);
      if(message.error)entry.reject(new Error(entry.method+': '+message.error.message));else entry.resolve(message.result||{});
    }
  });
  output.once('error',rejectAll);output.once('close',()=>rejectAll(new Error('CDP pipe closed')));child.once('error',rejectAll);
  const send=(method,params={},sessionId=null,timeoutMs=20000)=>new Promise((resolve,reject)=>{
    const id=nextId++;const timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},timeoutMs);
    pending.set(id,{method,resolve,reject,timer});const message={id,method,params};if(sessionId)message.sessionId=sessionId;
    input.write(JSON.stringify(message)+'\0');
  });
  return {send};
}

async function stopBrowser(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    const killer=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(resolve=>{killer.once('error',resolve);killer.once('exit',resolve);});
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL'); await once(child,'exit');
  }
}

async function newTarget(cdp,width=1280,height=1024) {
  const created=await cdp.send('Target.createTarget',{url:'about:blank'});
  const attached=await cdp.send('Target.attachToTarget',{targetId:created.targetId,flatten:true});
  const sessionId=attached.sessionId;
  await cdp.send('Page.enable',{},sessionId);
  await cdp.send('Runtime.enable',{},sessionId);
  await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false},sessionId);
  return {targetId:created.targetId,sessionId};
}

async function evaluate(cdp,sessionId,expression,timeoutMs=20000) {
  const result=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId,timeoutMs);
  if(result.exceptionDetails)throw new Error('Runtime.evaluate failed: '+JSON.stringify(result.exceptionDetails));
  return result.result?.value;
}

async function navigate(cdp,sessionId,url) {
  const nav=await cdp.send('Page.navigate',{url},sessionId,20000);
  if(nav.errorText)throw new Error('Navigation failed: '+nav.errorText);
}

async function waitRuntime(cdp,sessionId,url) {
  const started=Date.now();let last=null;
  while(Date.now()-started<30000){
    try{
      last=await evaluate(cdp,sessionId,"(()=>({href:location.href,ready:document.readyState,app:Boolean(window.INK_APP),test:Boolean(window.INK_TEST)}))()");
      if(last?.href===url && last.ready==='complete' && last.app && last.test)return last;
    }catch{}
    await sleep(100);
  }
  throw new Error('Runtime readiness timeout: '+JSON.stringify(last));
}

async function mouse(cdp,sessionId,type,x,y,extra={}) {
  await cdp.send('Input.dispatchMouseEvent',{type,x,y,...extra},sessionId);
}

async function drag(cdp,sessionId,a,b,steps=8) {
  await mouse(cdp,sessionId,'mouseMoved',a.x,a.y);
  await mouse(cdp,sessionId,'mousePressed',a.x,a.y,{button:'left',buttons:1,clickCount:1});
  for(let i=1;i<=steps;i++){
    const t=i/steps;
    await mouse(cdp,sessionId,'mouseMoved',a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t,{button:'left',buttons:1});
  }
  await mouse(cdp,sessionId,'mouseReleased',b.x,b.y,{button:'left',buttons:0,clickCount:1});
  await sleep(120);
}

async function polygonGesture(cdp,sessionId,points) {
  const first=points[0];
  await mouse(cdp,sessionId,'mouseMoved',first.x,first.y);
  await mouse(cdp,sessionId,'mousePressed',first.x,first.y,{button:'left',buttons:1,clickCount:1});
  for(const p of points.slice(1))await mouse(cdp,sessionId,'mouseMoved',p.x,p.y,{button:'left',buttons:1});
  await mouse(cdp,sessionId,'mouseReleased',points.at(-1).x,points.at(-1).y,{button:'left',buttons:0,clickCount:1});
  await sleep(120);
}

const snapshotExpression = label => `(()=>{const app=INK_APP,page=app.page(),walk=(objects,out=[])=>{for(const object of objects||[]){out.push(object.id);if(Array.isArray(object.children))walk(object.children,out);}return out;};const entries=app.spatialIndex.items.map(item=>({id:item.object.id,type:item.object.type,depth:item.depth,parentId:item.parentObject?.id||null,bounds:{x:Number(item.bounds.x.toFixed(4)),y:Number(item.bounds.y.toFixed(4)),w:Number(item.bounds.w.toFixed(4)),h:Number(item.bounds.h.toFixed(4))}})).sort((a,b)=>a.id.localeCompare(b.id));return{label:${JSON.stringify(label)},pageId:page.id,indexPageId:app.spatialIndex.pageId,dirty:app.spatialDirty,pending:[...app.spatialPending].sort(),documentIds:walk(page.layers.flatMap(layer=>layer.objects),[]).sort(),indexIds:entries.map(entry=>entry.id),indexCount:entries.length,entries,selection:app.selection.map(ref=>ref.objectId).sort(),stats:app.spatialIndex.stats()};})()`;

async function snapshot(cdp,sessionId,label){return evaluate(cdp,sessionId,snapshotExpression(label));}
async function ensureSnapshot(cdp,sessionId,label){await evaluate(cdp,sessionId,"INK_APP.ensureSpatialIndex();true");return snapshot(cdp,sessionId,label);}
const entryFor=(snap,id)=>snap.entries.find(entry=>entry.id===id);
const sameSet=(a,b)=>JSON.stringify([...a].sort())===JSON.stringify([...b].sort());

async function capture(cdp,sessionId,file) {
  const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false},sessionId,30000);
  const bytes=Buffer.from(shot.data,'base64');
  await writeFile(file,bytes);
  return {bytes:bytes.length};
}

async function run(root) {
  const evidenceDir=path.join(root,'qa/evidence','ink-core-spatial-index-lasso-repair-'+TARGET_SHA.slice(0,12));
  await mkdir(evidenceDir,{recursive:true});
  const report={
    schema:'INK-CORE-SPATIAL-INDEX-LASSO-REPAIR-EVIDENCE',
    version:1,
    task:'CORE_SPATIAL_INDEX_LASSO_REPAIR',
    targetSha:TARGET_SHA,
    centralRuntimeExecuted:false,
    formatVersion:null,
    status:'RUNNING',
    checks:[],
    lifecycle:[],
    failures:[]
  };
  const check=(name,pass,detail={})=>{const item={name,pass:Boolean(pass),detail};report.checks.push(item);if(!pass)report.failures.push(name);return item;};
  const record=s=>{report.lifecycle.push(s);return s;};

  const started=await startServer(root);
  const browserPath=findBrowser();
  const profile=await mkdtemp(path.join(root,'profile-spatial-'));
  let child,target;
  try{
    child=spawn(browserPath,[
      '--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions',
      '--disable-background-networking','--disable-background-timer-throttling','--remote-debugging-pipe','--user-data-dir='+profile,'about:blank'
    ],{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe','pipe','pipe']});
    let stderr='';child.stderr.on('data',chunk=>{if(stderr.length<16000)stderr+=chunk.toString();});
    const cdp=createCdpPipe(child);
    report.browser=await cdp.send('Browser.getVersion');
    report.browserPath=browserPath;
    target=await newTarget(cdp);
    const url=started.origin+'/?fresh=1&ink-qa=1';
    await navigate(cdp,target.sessionId,url);
    await waitRuntime(cdp,target.sessionId,url);

    const env=await evaluate(cdp,target.sessionId,"(()=>{INK_TEST.fresh();INK_APP.ensureSpatialIndex();const r=INK_APP.el.canvas.getBoundingClientRect();return{formatVersion:INK_ARCHITECTURE.formatVersion,stage:{x:r.x,y:r.y,w:r.width,h:r.height},pageId:INK_APP.page().id};})()");
    report.formatVersion=env.formatVersion;
    check('FORMAT_VERSION remains 4',env.formatVersion===4,env);
    const stage=env.stage;
    const start={x:Math.max(stage.x+90,stage.x+stage.w*.23),y:Math.max(stage.y+100,stage.y+stage.h*.28)};
    const end={x:start.x+100,y:start.y+82};
    record(await snapshot(cdp,target.sessionId,'initial-empty-index'));

    await evaluate(cdp,target.sessionId,"INK_APP.shapeType='rect';INK_APP.shapeFill=true;INK_APP.setTool('shape');true");
    await drag(cdp,target.sessionId,start,end);
    const createdRaw=record(await snapshot(cdp,target.sessionId,'shape-created-before-query'));
    const shapeId=createdRaw.documentIds[0];
    check('shape create queues exact ID without blanket rebuild',
      createdRaw.documentIds.length===1 && createdRaw.indexCount===0 && createdRaw.dirty===false && sameSet(createdRaw.pending,[shapeId]),
      {shapeId,snapshot:createdRaw});

    await evaluate(cdp,target.sessionId,"INK_APP.setTool('lasso');true");
    await polygonGesture(cdp,target.sessionId,[
      {x:start.x-30,y:start.y-30},{x:end.x+30,y:start.y-30},{x:end.x+30,y:end.y+30},
      {x:start.x-30,y:end.y+30},{x:start.x-30,y:start.y-30}
    ]);
    const lassoSnap=record(await snapshot(cdp,target.sessionId,'shape-lasso-native-query'));
    check('fresh draw -> native Lasso selects Shape without refreshAll',
      sameSet(lassoSnap.selection,[shapeId]) && sameSet(lassoSnap.indexIds,[shapeId]) && lassoSnap.pending.length===0,
      {shapeId,snapshot:lassoSnap});
    check('create uses incremental index sync',
      lassoSnap.stats.fullRebuilds===1 && lassoSnap.stats.incrementalUpdates>=1,
      lassoSnap.stats);
    await capture(cdp,target.sessionId,path.join(evidenceDir,'shape-lasso-pass.png'));

    const strokeStart={x:Math.min(stage.x+stage.w-220,end.x+220),y:start.y+10},strokeEnd={x:strokeStart.x+95,y:strokeStart.y+50};
    await evaluate(cdp,target.sessionId,"INK_APP.setTool('pen');true");
    await drag(cdp,target.sessionId,strokeStart,strokeEnd,10);
    const strokeRaw=record(await snapshot(cdp,target.sessionId,'stroke-created-before-query'));
    const strokeId=strokeRaw.documentIds.find(id=>id!==shapeId);
    check('stroke create queues exact ID',Boolean(strokeId)&&strokeRaw.pending.includes(strokeId)&&!strokeRaw.indexIds.includes(strokeId)&&strokeRaw.dirty===false,{strokeId,snapshot:strokeRaw});
    const strokeEnsured=record(await ensureSnapshot(cdp,target.sessionId,'stroke-created-indexed'));
    check('stroke create incrementally enters index',Boolean(strokeId)&&strokeEnsured.indexIds.includes(strokeId)&&strokeEnsured.pending.length===0,{strokeId,snapshot:strokeEnsured});

    await evaluate(cdp,target.sessionId,`INK_APP.selection=[{layerId:INK_APP.layer().id,objectId:${JSON.stringify(shapeId)}}];INK_APP.setTool('select');INK_APP.refreshSelectionUI();true`);
    const beforeMove=await snapshot(cdp,target.sessionId,'before-move');
    const oldMoveBounds=entryFor(beforeMove,shapeId).bounds;
    await evaluate(cdp,target.sessionId,"INK_APP.translateSelection(160,0,'QA spatial move');true");
    const moveRaw=record(await snapshot(cdp,target.sessionId,'move-before-query'));
    check('move queues selected ID',moveRaw.pending.includes(shapeId)&&moveRaw.dirty===false,{shapeId,snapshot:moveRaw});
    const moveEnsured=record(await ensureSnapshot(cdp,target.sessionId,'move-indexed'));
    const movedBounds=entryFor(moveEnsured,shapeId).bounds;
    const oldMoveHits=await evaluate(cdp,target.sessionId,`INK_APP.spatialIndex.query(${JSON.stringify(oldMoveBounds)}).map(item=>item.object.id)`);
    check('move updates bounds and removes stale hit',boundsChanged(oldMoveBounds,movedBounds)&&!oldMoveHits.includes(shapeId),{before:oldMoveBounds,after:movedBounds,oldMoveHits});

    const widthBefore=movedBounds.w;
    await evaluate(cdp,target.sessionId,`(()=>{const b=INK_APP.renderer.selectionWorldBounds();INK_APP.applyTransformField('w',b.w*1.15);return true})()`);
    const resizeRaw=record(await snapshot(cdp,target.sessionId,'resize-before-query'));
    check('resize queues selected ID',resizeRaw.pending.includes(shapeId)&&resizeRaw.dirty===false,{shapeId,snapshot:resizeRaw});
    const resizeEnsured=record(await ensureSnapshot(cdp,target.sessionId,'resize-indexed'));
    const resizedBounds=entryFor(resizeEnsured,shapeId).bounds;
    check('resize updates indexed bounds',resizedBounds.w>widthBefore+0.1,{before:movedBounds,after:resizedBounds});

    await evaluate(cdp,target.sessionId,"INK_APP.applyTransformField('r',25);true");
    const rotateRaw=record(await snapshot(cdp,target.sessionId,'rotate-before-query'));
    check('rotate queues selected ID',rotateRaw.pending.includes(shapeId)&&rotateRaw.dirty===false,{shapeId,snapshot:rotateRaw});
    const rotateEnsured=record(await ensureSnapshot(cdp,target.sessionId,'rotate-indexed'));
    const rotatedBounds=entryFor(rotateEnsured,shapeId).bounds;
    check('rotate updates indexed bounds',boundsChanged(resizedBounds,rotatedBounds),{before:resizedBounds,after:rotatedBounds});

    await evaluate(cdp,target.sessionId,"INK_APP.duplicateSelection(55);true");
    const duplicateRaw=record(await snapshot(cdp,target.sessionId,'duplicate-before-query'));
    const copyId=duplicateRaw.selection[0];
    check('duplicate invalidates existing index authority',Boolean(copyId)&&copyId!==shapeId&&duplicateRaw.dirty===true,{shapeId,copyId,snapshot:duplicateRaw});
    const duplicateEnsured=record(await ensureSnapshot(cdp,target.sessionId,'duplicate-indexed'));
    check('duplicate rebuild contains original and copy IDs',duplicateEnsured.indexIds.includes(shapeId)&&duplicateEnsured.indexIds.includes(copyId),{shapeId,copyId,snapshot:duplicateEnsured});

    await evaluate(cdp,target.sessionId,"INK_APP.deleteSelection();true");
    record(await snapshot(cdp,target.sessionId,'delete-before-query'));
    const deleteEnsured=record(await ensureSnapshot(cdp,target.sessionId,'delete-indexed'));
    check('delete removes deleted ID from index',!deleteEnsured.indexIds.includes(copyId)&&deleteEnsured.indexIds.includes(shapeId),{copyId,snapshot:deleteEnsured});

    await evaluate(cdp,target.sessionId,"INK_APP.history.undo();true");
    const undoDelete=record(await ensureSnapshot(cdp,target.sessionId,'delete-undo-indexed'));
    check('undo delete restores exact ID',undoDelete.indexIds.includes(copyId),{copyId,snapshot:undoDelete});
    await evaluate(cdp,target.sessionId,"INK_APP.history.redo();true");
    const redoDelete=record(await ensureSnapshot(cdp,target.sessionId,'delete-redo-indexed'));
    check('redo delete removes exact ID',!redoDelete.indexIds.includes(copyId),{copyId,snapshot:redoDelete});
    await evaluate(cdp,target.sessionId,"INK_APP.history.undo();true");
    const restoredCopy=record(await ensureSnapshot(cdp,target.sessionId,'delete-undo-restored-for-structure'));
    check('second undo delete restores copy for hierarchy tests',restoredCopy.indexIds.includes(copyId),{copyId});

    const secondStart={x:start.x+35,y:end.y+100},secondEnd={x:secondStart.x+70,y:secondStart.y+60};
    await evaluate(cdp,target.sessionId,"INK_APP.setTool('shape');INK_APP.shapeType='rect';true");
    await drag(cdp,target.sessionId,secondStart,secondEnd);
    const secondRaw=record(await snapshot(cdp,target.sessionId,'second-shape-created-before-query'));
    const secondId=secondRaw.documentIds.find(id=>![shapeId,strokeId,copyId].includes(id));
    const secondEnsured=record(await ensureSnapshot(cdp,target.sessionId,'second-shape-indexed'));
    check('second creation indexes exact ID',Boolean(secondId)&&secondEnsured.indexIds.includes(secondId),{secondId});
    await evaluate(cdp,target.sessionId,"INK_APP.history.undo();true");
    const undoCreate=record(await ensureSnapshot(cdp,target.sessionId,'create-undo-indexed'));
    check('undo creation removes created ID',!undoCreate.indexIds.includes(secondId),{secondId,snapshot:undoCreate});
    await evaluate(cdp,target.sessionId,"INK_APP.history.redo();true");
    const redoCreate=record(await ensureSnapshot(cdp,target.sessionId,'create-redo-indexed'));
    check('redo creation restores same ID',redoCreate.indexIds.includes(secondId),{secondId,snapshot:redoCreate});

    await evaluate(cdp,target.sessionId,`INK_APP.selection=[{layerId:INK_APP.layer().id,objectId:${JSON.stringify(secondId)}}];INK_APP.deleteSelection();true`);
    const deleteSecond=record(await ensureSnapshot(cdp,target.sessionId,'creation-object-deleted'));
    check('delete after creation removes ID',!deleteSecond.indexIds.includes(secondId),{secondId});
    await evaluate(cdp,target.sessionId,"INK_APP.history.undo();true");
    const undoSecondDelete=record(await ensureSnapshot(cdp,target.sessionId,'creation-object-delete-undo'));
    check('undo deletion restores creation ID',undoSecondDelete.indexIds.includes(secondId),{secondId});
    await evaluate(cdp,target.sessionId,"INK_APP.history.redo();true");
    const redoSecondDelete=record(await ensureSnapshot(cdp,target.sessionId,'creation-object-delete-redo'));
    check('redo deletion removes creation ID again',!redoSecondDelete.indexIds.includes(secondId),{secondId});

    await evaluate(cdp,target.sessionId,`(()=>{const l=INK_APP.layer().id;INK_APP.selection=[{layerId:l,objectId:${JSON.stringify(shapeId)}},{layerId:l,objectId:${JSON.stringify(copyId)}}];INK_APP.groupSelection();return true})()`);
    const groupRaw=record(await snapshot(cdp,target.sessionId,'group-before-query'));
    const groupId=groupRaw.selection[0];
    const groupEnsured=record(await ensureSnapshot(cdp,target.sessionId,'group-indexed'));
    check('group rebuild contains group and child IDs',Boolean(groupId)&&groupEnsured.indexIds.includes(groupId)&&groupEnsured.indexIds.includes(shapeId)&&groupEnsured.indexIds.includes(copyId),{groupId,shapeId,copyId,snapshot:groupEnsured});
    await evaluate(cdp,target.sessionId,"INK_APP.ungroupSelection();true");
    const ungroupEnsured=record(await ensureSnapshot(cdp,target.sessionId,'ungroup-indexed'));
    check('ungroup removes group ID and preserves child IDs',!ungroupEnsured.indexIds.includes(groupId)&&ungroupEnsured.indexIds.includes(shapeId)&&ungroupEnsured.indexIds.includes(copyId),{groupId,snapshot:ungroupEnsured});

    await evaluate(cdp,target.sessionId,`(()=>{const l=INK_APP.layer().id;INK_APP.selection=[{layerId:l,objectId:${JSON.stringify(shapeId)}},{layerId:l,objectId:${JSON.stringify(copyId)}}];INK_APP.frameSelection({name:'QA Frame',padding:10});return true})()`);
    const frameRaw=record(await snapshot(cdp,target.sessionId,'frame-before-query'));
    const frameId=frameRaw.selection[0];
    const frameEnsured=record(await ensureSnapshot(cdp,target.sessionId,'frame-indexed'));
    check('frame rebuild contains frame and nested child IDs',Boolean(frameId)&&frameEnsured.indexIds.includes(frameId)&&frameEnsured.indexIds.includes(shapeId)&&frameEnsured.indexIds.includes(copyId),{frameId,snapshot:frameEnsured});
    const childBeforeReparent=entryFor(frameEnsured,shapeId).bounds;
    await evaluate(cdp,target.sessionId,`INK_APP.reparentObjectToFrame(${JSON.stringify(shapeId)},null);true`);
    const reparentRoot=record(await ensureSnapshot(cdp,target.sessionId,'reparent-root-indexed'));
    const childAtRoot=entryFor(reparentRoot,shapeId);
    check('reparent to root preserves ID and world bounds',childAtRoot?.parentId===null&&!boundsChanged(childBeforeReparent,childAtRoot?.bounds),{before:childBeforeReparent,after:childAtRoot});
    await evaluate(cdp,target.sessionId,`INK_APP.reparentObjectToFrame(${JSON.stringify(shapeId)},${JSON.stringify(frameId)});true`);
    const reparentFrame=record(await ensureSnapshot(cdp,target.sessionId,'reparent-frame-indexed'));
    const childBack=entryFor(reparentFrame,shapeId);
    check('reparent back to frame preserves ID and index authority',childBack?.parentId===frameId&&reparentFrame.indexIds.includes(shapeId),{frameId,entry:childBack});

    const page1Id=reparentFrame.pageId;
    const page1Ids=[...reparentFrame.indexIds].sort();
    await evaluate(cdp,target.sessionId,"INK_APP.addPage();INK_APP.ensureSpatialIndex();true");
    const page2Empty=record(await snapshot(cdp,target.sessionId,'page2-empty-indexed'));
    const page2Id=page2Empty.pageId;
    check('page switch/add page clears previous page entries',page2Id!==page1Id&&page2Empty.indexPageId===page2Id&&page2Empty.indexCount===0,{page1Id,page2Id,snapshot:page2Empty});

    const p2Start={x:start.x+20,y:start.y+25},p2End={x:p2Start.x+85,y:p2Start.y+65};
    await evaluate(cdp,target.sessionId,"INK_APP.setTool('shape');INK_APP.shapeType='rect';true");
    await drag(cdp,target.sessionId,p2Start,p2End);
    const p2Raw=record(await snapshot(cdp,target.sessionId,'page2-shape-before-query'));
    const page2ObjectId=p2Raw.documentIds[0];
    const p2Ensured=record(await ensureSnapshot(cdp,target.sessionId,'page2-shape-indexed'));
    check('page2 creation indexed only on page2',sameSet(p2Ensured.indexIds,[page2ObjectId]),{page2ObjectId,snapshot:p2Ensured});
    await evaluate(cdp,target.sessionId,`INK_APP.switchPage(${JSON.stringify(page1Id)});INK_APP.ensureSpatialIndex();true`);
    const backPage1=record(await snapshot(cdp,target.sessionId,'switch-back-page1-indexed'));
    check('switch back restores page1 IDs without page2 leak',backPage1.indexPageId===page1Id&&!backPage1.indexIds.includes(page2ObjectId)&&sameSet(backPage1.indexIds,page1Ids),{page1Ids,page2ObjectId,snapshot:backPage1});
    await evaluate(cdp,target.sessionId,`INK_APP.switchPage(${JSON.stringify(page2Id)});INK_APP.ensureSpatialIndex();true`);
    const backPage2=record(await snapshot(cdp,target.sessionId,'switch-page2-indexed'));
    check('switch forward restores page2 IDs without page1 leak',backPage2.indexPageId===page2Id&&sameSet(backPage2.indexIds,[page2ObjectId])&&page1Ids.every(id=>!backPage2.indexIds.includes(id)),{page1Ids,page2ObjectId,snapshot:backPage2});

    report.status=report.failures.length?'FAIL':'PASS';
    if(report.status!=='PASS')process.exitCode=1;
  }catch(error){
    report.status='FAIL';report.failures.push(String(error?.stack||error));process.exitCode=1;
  }finally{
    report.completedAt=new Date().toISOString();
    await writeFile(path.join(evidenceDir,'spatial-index-browser.json'),JSON.stringify(report,null,2));
    console.log('INK_SPATIAL_EVIDENCE '+JSON.stringify({targetSha:report.targetSha,status:report.status,checks:report.checks.length,passed:report.checks.filter(x=>x.pass).length,failures:report.failures,lifecycle:report.lifecycle.map(s=>({label:s.label,pageId:s.pageId,indexCount:s.indexCount,indexIds:s.indexIds,dirty:s.dirty,pending:s.pending,selection:s.selection,fullRebuilds:s.stats.fullRebuilds,incrementalUpdates:s.stats.incrementalUpdates}))}));
    if(target)try{await createCdpPipe;}catch{}
    await stopBrowser(child);
    started.server.closeAllConnections();
    await new Promise(resolve=>started.server.close(resolve));
    await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});
  }
  return report;
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  await run(path.resolve(process.argv[2]||'.'));
}
