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
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json','.webmanifest':'application/manifest+json','.wasm':'application/wasm'};

function browser(){
  const c=[process.env.INK_CHROMIUM_PATH,process.env.CHROME_PATH];
  for(const b of [process.env.ProgramFiles,process.env['ProgramFiles(x86)'],process.env.LOCALAPPDATA].filter(Boolean)){
    c.push(path.join(b,'Google/Chrome/Application/chrome.exe'),path.join(b,'Microsoft/Edge/Application/msedge.exe'));
  }
  const f=c.find(x=>x&&existsSync(x));if(!f)throw new Error('browser unavailable');return f;
}
async function stop(child){
  if(!child?.pid)return;
  if(process.platform==='win32'){
    const k=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(r=>{k.once('error',r);k.once('exit',r);});
  }else if(child.exitCode===null&&child.signalCode===null){child.kill('SIGKILL');await once(child,'exit');}
}
async function start(root,onEvidence){
  const site=path.join(root,'product/source');
  const harness=await readFile(path.join(root,'qa/runtime/ink-ui-issue92-health-detail-harness.html'));
  let delivered=false;
  const server=createServer(async(req,res)=>{
    try{
      const url=new URL(req.url,'http://127.0.0.1');
      res.setHeader('Cache-Control','no-store');
      if(url.pathname==='/__qa_result'&&req.method==='POST'){
        if(delivered){res.writeHead(409).end();return;}
        const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>2*1024*1024){res.writeHead(413).end();return;}chunks.push(chunk);}
        delivered=true;const e=JSON.parse(Buffer.concat(chunks).toString('utf8'));res.writeHead(200).end('OK');onEvidence(e);return;
      }
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
      let bytes,ext;
      if(url.pathname==='/__qa_harness.html'){bytes=harness;ext='.html';}
      else{
        const decoded=decodeURIComponent(url.pathname);
        if(decoded.includes('\\')||decoded.includes('\0')){res.writeHead(403).end();return;}
        const dest=path.resolve(site,'.'+(decoded==='/'?'/index.html':decoded));
        if(!dest.startsWith(site+path.sep)){res.writeHead(403).end();return;}
        if(!(await stat(dest)).isFile()){res.writeHead(404).end();return;}
        bytes=await readFile(dest);ext=path.extname(dest);
      }
      res.setHeader('Content-Type',mime[ext]||'application/octet-stream');res.writeHead(200).end(req.method==='HEAD'?undefined:bytes);
    }catch(e){res.writeHead(e?.code==='ENOENT'?404:400).end('request failed');}
  });
  server.requestTimeout=15000;server.listen(0,'127.0.0.1');await once(server,'listening');
  return{server,origin:'http://127.0.0.1:'+server.address().port};
}
export async function run(root){
  const evidenceDir=path.join(root,'evidence');await mkdir(evidenceDir,{recursive:true});
  let child,server,timer,profile;
  const report={schema:'INK-UI-ISSUE92-HEALTH-DETAIL-REPORT',targetSha:TARGET_SHA,centralRuntimeExecuted:false,status:'RUNNING'};
  try{
    let receive;const result=new Promise(r=>receive=r);
    const started=await start(root,receive);server=started.server;
    for(const route of ['/','/styles.css','/web-shell.js','/src/ink.js','/__qa_harness.html']){const response=await fetch(started.origin+route,{signal:AbortSignal.timeout(5000)});assert.equal(response.status,200,'preflight '+route);await response.arrayBuffer();}
    profile=await mkdtemp(path.join(root,'profile-health-'));
    child=spawn(browser(),['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--disable-background-networking','--user-data-dir='+profile,started.origin+'/__qa_harness.html'],{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe']});
    let stderr='';child.stderr.on('data',c=>{if(stderr.length<20000)stderr+=c.toString();});
    const fail=new Promise((_,rej)=>{child.once('error',rej);child.once('exit',(c,s)=>rej(new Error('browser exit '+c+'/'+s+' '+stderr)));timer=setTimeout(()=>rej(new Error('timeout '+stderr)),180000);});
    const e=await Promise.race([result,fail]);
    await writeFile(path.join(evidenceDir,'health-detail.json'),JSON.stringify(e,null,2));
    report.summary=e.summary;report.status=e.status;if(e.status!=='PASS')process.exitCode=1;
  }catch(e){report.status='FAIL';report.error=String(e?.stack||e);process.exitCode=1;}
  finally{
    clearTimeout(timer);await writeFile(path.join(evidenceDir,'report.json'),JSON.stringify(report,null,2));
    await stop(child);if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}
    if(profile)await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:150});
  }
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await run(path.resolve(process.argv[2]||'.'));