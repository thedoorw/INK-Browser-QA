import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { readFile,mkdir,mkdtemp,rm,stat,writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const TARGET_SHA=process.env.INK_TESTED_SHA||'';
assert.match(TARGET_SHA,/^[a-f0-9]{40}$/);
const STATES=[
  ['window',1280,1024],
  ['options-select-empty',1280,1024],
  ['options-select-selected',1280,1024],
  ['options-draw',1280,1024],
  ['options-eraser',1280,1024],
  ['options-shape',1280,1024],
  ['options-text',1280,1024],
  ['options-lasso',1280,1024],
  ['options-raster',1280,1024],
  ['options-path-edit',1280,1024],
  ['options-stroke-edit',1280,1024],
  ['panel-navigator',1280,1024],
  ['panel-properties',1280,1024],
  ['panel-color',1280,1024],
  ['panel-adjustments',1280,1024],
  ['panel-libraries',1280,1024],
  ['panel-reference',1280,1024],
  ['panel-compose',1280,1024],
  ['panel-chat',1280,1024],
  ['panel-revision',1280,1024],
  ['panel-layers',1280,1024],
  ['panel-history',1280,1024],
  ['panel-channels',1280,1024],
  ['panel-pages',1280,1024],
  ['sameclass-expanded',1280,1024],
  ['sameclass-collapsed',1280,1024],
  ['tools-dual',1280,1024],
  ['tools-single',1280,1024],
  ['scrollbars',1280,1024],
  ['focus-state',1280,1024],
  ['narrow-960',960,800]
].map(([mode,width,height])=>({mode,width,height}));
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.json':'application/json','.webmanifest':'application/manifest+json','.wasm':'application/wasm'};

function browser(){
  const c=[process.env.INK_CHROMIUM_PATH,process.env.CHROME_PATH];
  for(const b of [process.env.ProgramFiles,process.env['ProgramFiles(x86)'],process.env.LOCALAPPDATA].filter(Boolean)){
    c.push(path.join(b,'Google/Chrome/Application/chrome.exe'),path.join(b,'Microsoft/Edge/Application/msedge.exe'));
  }
  const found=c.find(x=>x&&existsSync(x));if(!found)throw new Error('browser unavailable');return found;
}
async function stop(child){
  if(!child?.pid)return;
  if(process.platform==='win32'){
    const k=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(r=>{k.once('error',r);k.once('exit',r);});
  }else if(child.exitCode===null&&child.signalCode===null){child.kill('SIGKILL');await once(child,'exit');}
}
async function start(root,reports){
  const site=path.join(root,'product/source');
  const harness=await readFile(path.join(root,'qa/runtime/ink-ui-remaining-fidelity-harness.html'));
  const server=createServer(async(req,res)=>{
    try{
      const url=new URL(req.url,'http://127.0.0.1');res.setHeader('Cache-Control','no-store');
      if(url.pathname==='/__qa_result'&&req.method==='POST'){
        const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>8*1024*1024){res.writeHead(413).end();return;}chunks.push(chunk);}
        const e=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(e?.mode)reports.set(e.mode,e);res.writeHead(200).end('OK');return;
      }
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
      let bytes,ext;
      if(url.pathname==='/__qa_harness.html'){bytes=harness;ext='.html';}
      else{
        const decoded=decodeURIComponent(url.pathname);
        if(decoded.includes('\\')||decoded.includes('\0')){res.writeHead(403).end();return;}
        const dest=path.resolve(site,'.'+(decoded==='/'?'/index.html':decoded));
        if(!dest.startsWith(site+path.sep)){res.writeHead(403).end();return;}
        const info=await stat(dest);if(!info.isFile()){res.writeHead(404).end();return;}
        bytes=await readFile(dest);ext=path.extname(dest);
      }
      res.setHeader('Content-Type',mime[ext]||'application/octet-stream');res.writeHead(200).end(req.method==='HEAD'?undefined:bytes);
    }catch(error){res.writeHead(error?.code==='ENOENT'?404:400).end('request failed');}
  });
  server.requestTimeout=15000;server.listen(0,'127.0.0.1');await once(server,'listening');
  return{server,origin:'http://127.0.0.1:'+server.address().port};
}
async function waitReport(reports,mode,timeoutMs=8000){
  const t=Date.now();while(Date.now()-t<timeoutMs){if(reports.has(mode))return reports.get(mode);await new Promise(r=>setTimeout(r,100));}return null;
}
async function capture(root,origin,state,reports){
  const profile=await mkdtemp(path.join(root,'profile-remaining-'+state.mode+'-'));
  const file=state.mode+'.png',shot=path.join(root,'evidence',file);
  const url=origin+'/__qa_harness.html?mode='+encodeURIComponent(state.mode);
  const args=['--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions','--disable-background-networking','--force-device-scale-factor=1',
    '--window-size='+state.width+','+state.height,'--virtual-time-budget=5000','--run-all-compositor-stages-before-draw','--user-data-dir='+profile,'--screenshot='+shot,url];
  let child,stderr='',timer;
  try{
    child=spawn(browser(),args,{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe']});
    child.stderr.on('data',c=>{if(stderr.length<100000)stderr+=c.toString();});
    const exit=await Promise.race([once(child,'exit').then(([code,signal])=>({code,signal})),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('capture timeout '+state.mode+' '+stderr)),90000);})]);
    if(exit.code!==0)throw new Error('capture exit '+state.mode+' '+exit.code+'/'+exit.signal+' '+stderr);
    const info=await stat(shot);if(info.size<5000)throw new Error('screenshot too small '+state.mode+' '+info.size);
    const evidence=await waitReport(reports,state.mode);if(!evidence)throw new Error('missing metrics '+state.mode);
    return{...state,screenshot:file,bytes:info.size,evidence};
  }finally{clearTimeout(timer);await stop(child);await rm(profile,{recursive:true,force:true,maxRetries:4,retryDelay:150});}
}
export async function run(root){
  const evidenceDir=path.join(root,'evidence');await mkdir(evidenceDir,{recursive:true});
  const reports=new Map();let server;
  const report={schema:'INK-UI-REMAINING-WHOLE-FIDELITY-REPORT',version:1,targetSha:TARGET_SHA,centralRuntimeExecuted:false,status:'RUNNING',states:[]};
  try{
    const started=await start(root,reports);server=started.server;
    for(const route of ['/','/styles.css','/web-shell.js','/ui/capability-contributions.js','/__qa_harness.html?mode=window']){
      const response=await fetch(started.origin+route,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,200,'preflight '+route);await response.arrayBuffer();
    }
    for(const state of STATES)report.states.push(await capture(root,started.origin,state,reports));
    const failed=report.states.filter(x=>x.evidence?.status!=='PASS');
    report.status=failed.length?'FAIL':'PASS';
    report.summary={total:report.states.length,passed:report.states.length-failed.length,failed:failed.length,screenshotBytes:report.states.reduce((n,x)=>n+x.bytes,0)};
    report.failures=failed.map(x=>({mode:x.mode,failures:x.evidence?.failures||[],error:x.evidence?.error||null}));
  }catch(error){
    report.status='FAIL';report.error=String(error?.stack||error);report.summary={total:STATES.length,passed:report.states.length,failed:STATES.length-report.states.length};process.exitCode=1;
  }finally{
    await writeFile(path.join(evidenceDir,'metrics.json'),JSON.stringify({schema:'INK-UI-REMAINING-WHOLE-FIDELITY-METRICS',version:1,targetSha:TARGET_SHA,states:report.states.map(x=>x.evidence)},null,2));
    await writeFile(path.join(evidenceDir,'report.json'),JSON.stringify(report,null,2));
    if(report.status!=='PASS')process.exitCode=1;
    if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}
  }
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await run(path.resolve(process.argv[2]||'.'));