import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '.');
const output = path.resolve(process.argv[3] || path.join(root, 'working/INK_CHAT_DRAWING_EXPOSURE_PROOF.json'));
const screenshot = path.resolve(process.argv[4] || path.join(root, 'working/INK_CHAT_DRAWING_EXPOSURE_PROOF.png'));
const site = path.join(root, 'product/source');

const mime = {
  '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8',
  '.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json',
  '.webmanifest':'application/manifest+json','.wasm':'application/wasm'
};

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH,
    '/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser'];
  if (process.platform === 'win32') {
    for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      candidates.push(path.join(base,'Google/Chrome/Application/chrome.exe'),path.join(base,'Microsoft/Edge/Application/msedge.exe'));
    }
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Chrome/Chromium not found');
  return found;
}

async function startServer() {
  const server = createServer(async (req,res) => {
    try {
      const url = new URL(req.url,'http://127.0.0.1');
      if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
      const decoded = decodeURIComponent(url.pathname);
      if (decoded.includes('\\') || decoded.includes('\0')) { res.writeHead(403).end(); return; }
      const dest = path.resolve(site, '.' + (decoded === '/' ? '/index.html' : decoded));
      if (!dest.startsWith(site + path.sep) && dest !== path.join(site,'index.html')) { res.writeHead(403).end(); return; }
      if (!(await stat(dest)).isFile()) { res.writeHead(404).end(); return; }
      const bytes = await readFile(dest);
      res.setHeader('Cache-Control','no-store');
      res.setHeader('Content-Type', mime[path.extname(dest)] || 'application/octet-stream');
      res.writeHead(200).end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      res.writeHead(error?.code === 'ENOENT' ? 404 : 500).end();
    }
  });
  server.listen(0,'127.0.0.1');
  await once(server,'listening');
  return {server,origin:`http://127.0.0.1:${server.address().port}`};
}

function cdpPipe(child) {
  const input=child.stdio[3], output=child.stdio[4];
  let nextId=1, buffer=Buffer.alloc(0);
  const pending=new Map();
  output.on('data',chunk=>{
    buffer=Buffer.concat([buffer,chunk]);
    while(true){
      const boundary=buffer.indexOf(0); if(boundary<0) break;
      const raw=buffer.subarray(0,boundary).toString('utf8'); buffer=buffer.subarray(boundary+1);
      if(!raw) continue;
      const message=JSON.parse(raw);
      if(!message.id) continue;
      const entry=pending.get(message.id); if(!entry) continue;
      pending.delete(message.id); clearTimeout(entry.timer);
      message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result||{});
    }
  });
  const send=(method,params={},sessionId=null,timeoutMs=30000)=>new Promise((resolve,reject)=>{
    const id=nextId++;
    const timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},timeoutMs);
    pending.set(id,{resolve,reject,timer});
    const msg={id,method,params}; if(sessionId) msg.sessionId=sessionId;
    input.write(JSON.stringify(msg)+'\0');
  });
  return {send};
}

async function stopBrowser(child) {
  if(!child?.pid) return;
  if(process.platform==='win32'){
    const killer=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(resolve=>{killer.once('error',resolve);killer.once('exit',resolve);});
  } else if(child.exitCode===null && child.signalCode===null) {
    child.kill('SIGKILL'); await once(child,'exit');
  }
}

async function waitReady(cdp,sessionId) {
  const started=Date.now(); let last=null;
  while(Date.now()-started<30000){
    const out=await cdp.send('Runtime.evaluate',{expression:`(() => ({
      readyState:document.readyState,
      apiReady:Boolean(window.INK_APP?.inkPublicApi?.tools?.invoke),
      toolCount:window.INK_APP?.inkPublicApi?.tools?.registry?.().length||0
    }))()`,returnByValue:true},sessionId,5000);
    last=out.result?.value;
    if(last?.readyState==='complete'&&last?.apiReady) return last;
    await new Promise(r=>setTimeout(r,100));
  }
  throw new Error('INK readiness timeout: '+JSON.stringify(last));
}

async function evaluate(cdp,sessionId,expression,timeout=60000){
  const out=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId,timeout);
  if(out.exceptionDetails) throw new Error(out.exceptionDetails.text||'Browser evaluation failed');
  return out.result?.value;
}

async function main(){
  await mkdir(path.dirname(output),{recursive:true});
  const {server,origin}=await startServer();
  const profile=await mkdtemp(path.join(process.env.RUNNER_TEMP||'.','ink-draw-proof-'));
  const browser=findBrowser(); let child;
  try{
    child=spawn(browser,['--headless=new','--no-sandbox','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--remote-debugging-pipe',`--user-data-dir=${profile}`,'about:blank'],
      {shell:false,windowsHide:true,stdio:['ignore','ignore','pipe','pipe','pipe']});
    const cdp=cdpPipe(child);
    await cdp.send('Browser.getVersion');
    const {targetId}=await cdp.send('Target.createTarget',{url:'about:blank'});
    const {sessionId}=await cdp.send('Target.attachToTarget',{targetId,flatten:true});
    await cdp.send('Page.enable',{},sessionId);
    await cdp.send('Runtime.enable',{},sessionId);
    const nav=await cdp.send('Page.navigate',{url:origin+'/?fresh=1'},sessionId,30000);
    assert.ok(!nav.errorText,nav.errorText||'navigation failed');
    const ready=await waitReady(cdp,sessionId);

    const result=await evaluate(cdp,sessionId,`(async()=>{
      const api=window.INK_APP.inkPublicApi;
      const capabilities=await api.tools.invoke('get_ink_capabilities',{});
      const strokeDescriptor=capabilities.result.capabilities.find(item=>item.id==='stroke.create.v1')||null;
      if(!strokeDescriptor?.availability) throw new Error('STROKE_CREATE_NOT_EXPOSED');

      const plan={
        schema:'INK-CHAT-CREATIVE-PLAN',version:1,
        intentSummary:'CHAT drawing exposure proof: pencil stroke plus wet natural-media brush stroke',
        steps:[
          {stepId:'pencil',operation:'stroke.create.v1',targets:[],arguments:{
            kind:'pencil',name:'CHAT Pencil Proof',color:'#263238',size:5,opacity:.76,smoothing:.42,pressure:.72,grain:.62,
            points:[
              {x:120,y:160,p:.25,t:0},{x:170,y:125,p:.55,t:16},{x:225,y:180,p:.9,t:32},{x:285,y:135,p:.65,t:48},{x:340,y:170,p:.3,t:64}
            ]
          },dependsOn:[]},
          {stepId:'wet-brush',operation:'stroke.create.v1',targets:[],arguments:{
            kind:'brush',name:'CHAT Wet Brush Proof',color:'#b7355d',size:24,opacity:.8,smoothing:.5,pressure:.95,taper:.35,flow:.74,wetness:.82,bristle:.22,grain:.16,mediaModel:'natural-v2',
            points:[
              {x:120,y:260,p:.22,t:0},{x:180,y:215,p:.7,t:18},{x:245,y:275,p:1,t:36},{x:315,y:220,p:.72,t:54},{x:380,y:265,p:.3,t:72}
            ]
          },dependsOn:['pencil']}
        ]
      };
      const proposed=await api.tools.invoke('use_ink',{action:'propose',plan});
      const blocked=await api.tools.invoke('use_ink',{action:'execute',planId:proposed.result.planId,approvalToken:'not-approved'});
      const approved=await api.tools.invoke('use_ink',{action:'approve',planId:proposed.result.planId});
      const executed=await api.tools.invoke('use_ink',{action:'execute',planId:proposed.result.planId,approvalToken:approved.result.approvalToken});
      const previewCreated=await api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:960,background:true});

      const pencilRef=executed.result.stepResults[0]?.targets?.[0]?.ref;
      if(!pencilRef) throw new Error('PENCIL_REF_MISSING');

      const editProposed=await api.tools.invoke('propose_ink_edit',{
        taskId:'stroke-edit-proof',
        operation:'stroke.edit.v1',
        targets:[pencilRef],
        arguments:{action:'move-node',index:1,x:185,y:105}
      });
      const editApproved=await api.tools.invoke('approve_ink_edit',{proposalId:editProposed.result.result.proposalId});
      const editExecuted=await api.tools.invoke('execute_ink_edit',{
        proposalId:editProposed.result.result.proposalId,
        approvalToken:editApproved.result.result.approvalToken
      });
      const previewEdited=await api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:960,background:true});

      const eraseProposed=await api.tools.invoke('propose_ink_edit',{
        taskId:'stroke-erase-proof',
        operation:'stroke.erase.v1',
        targets:[pencilRef],
        arguments:{center:{x:225,y:180},radius:18}
      });
      const eraseApproved=await api.tools.invoke('approve_ink_edit',{proposalId:eraseProposed.result.result.proposalId});
      const eraseExecuted=await api.tools.invoke('execute_ink_edit',{
        proposalId:eraseProposed.result.result.proposalId,
        approvalToken:eraseApproved.result.result.approvalToken
      });

      const context=await api.tools.invoke('get_ink_context',{maxObjects:32});
      const history=await api.tools.invoke('get_ink_history',{});
      const preview=await api.tools.invoke('get_ink_preview',{scope:'content',maxDimension:960,background:true});
      return {
        capabilities:{status:capabilities.status,strokeDescriptor},
        proposed,blocked,approved,executed,
        previewCreated,editProposed,editApproved,editExecuted,previewEdited,
        eraseProposed,eraseApproved,eraseExecuted,
        context,history,preview
      };
    })()`);

    assert.equal(result.capabilities.status,'COMPLETED');
    assert.equal(result.proposed.status,'PROPOSED');
    assert.equal(result.blocked.status,'FAILED');
    assert.equal(result.blocked.diagnostics?.[0]?.code,'CHAT_PLAN_APPROVAL_REQUIRED');
    assert.equal(result.approved.status,'APPROVED');
    assert.equal(result.executed.status,'COMPLETED');
    assert.equal(result.executed.result.stepResults.length,2);
    assert.ok(result.executed.result.stepResults.every(step=>step.ok===true&&step.changed===true));

    if(result.editProposed.status!=='PROPOSED') throw new Error('STROKE_EDIT_PROPOSE_FAILED:'+JSON.stringify(result.editProposed));
    if(result.editApproved.status!=='APPROVED') throw new Error('STROKE_EDIT_APPROVE_FAILED:'+JSON.stringify(result.editApproved));
    assert.equal(result.editExecuted.status,'EXECUTED');
    if(result.eraseProposed.status!=='PROPOSED') throw new Error('STROKE_ERASE_PROPOSE_FAILED:'+JSON.stringify(result.eraseProposed));
    if(result.eraseApproved.status!=='APPROVED') throw new Error('STROKE_ERASE_APPROVE_FAILED:'+JSON.stringify(result.eraseApproved));
    assert.equal(result.eraseExecuted.status,'EXECUTED');

    const strokes=(result.context.result.objects||[]).filter(item=>item.type==='stroke');
    assert.ok(strokes.length>=2);
    const lastLabels=result.history.result.entries.slice(-4).map(item=>item.label);
    assert.deepEqual(lastLabels,[
      'CHAT create Stroke','CHAT create Stroke','CHAT edit Stroke','CHAT erase Stroke'
    ]);

    assert.equal(result.previewCreated.status,'COMPLETED');
    assert.equal(result.previewEdited.status,'COMPLETED');
    assert.equal(result.preview.status,'COMPLETED');
    assert.equal(result.preview.outputHandles.length,1);
    assert.notEqual(
      result.previewCreated.outputHandles[0].renderFingerprint,
      result.previewEdited.outputHandles[0].renderFingerprint,
      'Stroke edit must change rendered output'
    );
    assert.notEqual(
      result.previewEdited.outputHandles[0].renderFingerprint,
      result.preview.outputHandles[0].renderFingerprint,
      'Stroke erase must change rendered output'
    );

    const shot=await cdp.send('Page.captureScreenshot',{format:'png',fromSurface:true,captureBeyondViewport:false},sessionId,30000);
    await writeFile(screenshot,Buffer.from(shot.data,'base64'));
    const evidence={schema:'INK-CHAT-DRAWING-EXPOSURE-PROOF',version:1,status:'PASS',ready,
      checks:{
        capabilityExposed:true,
        proposalNeutral:true,
        approvalGateBlockedBeforeApproval:true,
        explicitApproval:true,
        nativeStrokeCount:strokes.length,
        strokeEditExecuted:true,
        strokeEraseExecuted:true,
        renderChangedAfterEdit:true,
        renderChangedAfterErase:true,
        historyLabels:lastLabels,
        revisionId:result.executed.revisionReceipt?.endingRevisionId||result.executed.revisionId||null,
        previewHandle:result.preview.outputHandles[0]
      },
      result
    };
    await writeFile(output,JSON.stringify(evidence,null,2));
    console.log(JSON.stringify({status:evidence.status,checks:evidence.checks},null,2));
  }catch(error){
    await writeFile(output,JSON.stringify({schema:'INK-CHAT-DRAWING-EXPOSURE-PROOF',version:1,status:'FAIL',error:error.stack||String(error)},null,2));
    console.error(error.stack||error); process.exitCode=1;
  }finally{
    await stopBrowser(child);
    server.closeAllConnections?.();
    await new Promise(resolve=>server.close(resolve));
    await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:150});
  }
}

await main();
