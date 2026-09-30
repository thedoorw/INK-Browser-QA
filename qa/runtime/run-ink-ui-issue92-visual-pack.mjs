import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
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
  {mode:'desktop-layers',width:1280,height:1024},
  {mode:'tools-dual',width:1280,height:1024},
  {mode:'tools-single',width:1280,height:1024},
  {mode:'menu-edit',width:1280,height:1024},
  {mode:'menu-view',width:1280,height:1024},
  {mode:'menu-filter',width:1280,height:1024},
  {mode:'context-shape',width:1280,height:1024},
  {mode:'tool-flyout',width:1280,height:1024},
  {mode:'history',width:1280,height:1024},
  {mode:'navigator',width:1280,height:1024},
  {mode:'navigator-zoom',width:1280,height:1024},
  {mode:'panel-exact',width:1296,height:1089},
  {mode:'panel-resize',width:1280,height:1024},
  {mode:'layers-states',width:1280,height:1024},
  {mode:'status-scrollbars',width:1280,height:1024},
  {mode:'libraries',width:1280,height:1024},
  {mode:'compact',width:760,height:900},
  {mode:'context-tools',width:1280,height:1024},
  {mode:'keyboard-focus',width:1280,height:1024},
  {mode:'chat',width:1280,height:1024},
  {mode:'guides',width:1280,height:1024},
  {mode:'guides-px',width:1280,height:1024},
  {mode:'tooltip',width:1280,height:1024},
  {mode:'focus',width:1280,height:1024}
];
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.json':'application/json','.webmanifest':'application/manifest+json','.wasm':'application/wasm'};

function browser(){
  const c=[process.env.INK_CHROMIUM_PATH,process.env.CHROME_PATH];
  for(const b of [process.env.ProgramFiles,process.env['ProgramFiles(x86)'],process.env.LOCALAPPDATA].filter(Boolean)){
    c.push(path.join(b,'Google/Chrome/Application/chrome.exe'),path.join(b,'Microsoft/Edge/Application/msedge.exe'));
  }
  const found=c.find(x=>x&&existsSync(x));
  if(!found)throw new Error('browser unavailable');
  return found;
}
async function stop(child){
  if(!child?.pid)return;
  if(process.platform==='win32'){
    const killer=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(r=>{killer.once('error',r);killer.once('exit',r);});
  }else if(child.exitCode===null&&child.signalCode===null){
    child.kill('SIGKILL');await once(child,'exit');
  }
}
async function startServer(root,reports){
  const site=path.join(root,'product/source');
  const harness=await readFile(path.join(root,'qa/runtime/ink-ui-issue92-visual-harness.html'));
  const server=createServer(async(req,res)=>{
    try{
      const url=new URL(req.url,'http://127.0.0.1');
      res.setHeader('Cache-Control','no-store');
      if(url.pathname==='/__qa_result'&&req.method==='POST'){
        const chunks=[];let size=0;
        for await(const chunk of req){size+=chunk.length;if(size>4*1024*1024){res.writeHead(413).end();return;}chunks.push(chunk);}
        const evidence=JSON.parse(Buffer.concat(chunks).toString('utf8'));
        if(evidence?.mode)reports.set(evidence.mode,evidence);
        res.writeHead(200).end('OK');
        return;
      }
      if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
      let bytes,ext;
      if(url.pathname==='/__qa_harness.html'){bytes=harness;ext='.html';}
      else{
        const decoded=decodeURIComponent(url.pathname);
        if(decoded.includes('\\')||decoded.includes('\0')){res.writeHead(403).end();return;}
        const dest=path.resolve(site,'.'+(decoded==='/'?'/index.html':decoded));
        if(!dest.startsWith(site+path.sep)){res.writeHead(403).end();return;}
        const info=await stat(dest);
        if(!info.isFile()){res.writeHead(404).end();return;}
        bytes=await readFile(dest);ext=path.extname(dest);
      }
      res.setHeader('Content-Type',mime[ext]||'application/octet-stream');
      res.writeHead(200).end(req.method==='HEAD'?undefined:bytes);
    }catch(error){
      res.writeHead(error?.code==='ENOENT'?404:400).end('request failed');
    }
  });
  server.requestTimeout=15000;
  server.listen(0,'127.0.0.1');await once(server,'listening');
  return {server,origin:'http://127.0.0.1:'+server.address().port};
}
const LIVE_BASE='https://thedoorw.github.io/INK-Browser-QA/';
const LIVE_HARNESS='qa/runtime/ink-ui-pvsi-pack5-live-harness.html';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');

async function waitLiveProduct(root,timeoutMs=180000){
  const localCss=await readFile(path.join(root,'product/source/styles.css'));
  const localShell=await readFile(path.join(root,'product/source/web-shell.js'));
  const localIndex=await readFile(path.join(root,'product/source/index.html'));
  const localCreative=await readFile(path.join(root,'product/source/src/editor/creative-workspace.js'));
  const localBranding=await readFile(path.join(root,'product/source/ui/branding-settings.js'));
  const expected={styles:digest(localCss),webShell:digest(localShell),index:digest(localIndex),creative:digest(localCreative),branding:digest(localBranding)};
  const started=Date.now();let last={};
  while(Date.now()-started<timeoutMs){
    try{
      const bust='?pvsi='+encodeURIComponent(TARGET_SHA)+'&t='+Date.now();
      const [cssRes,shellRes,indexRes,creativeRes,brandingRes,harnessRes]=await Promise.all([
        fetch(LIVE_BASE+'product/source/styles.css'+bust,{cache:'no-store',signal:AbortSignal.timeout(10000)}),
        fetch(LIVE_BASE+'product/source/web-shell.js'+bust,{cache:'no-store',signal:AbortSignal.timeout(10000)}),
        fetch(LIVE_BASE+'product/source/index.html'+bust,{cache:'no-store',signal:AbortSignal.timeout(10000)}),
        fetch(LIVE_BASE+'product/source/src/editor/creative-workspace.js'+bust,{cache:'no-store',signal:AbortSignal.timeout(10000)}),
        fetch(LIVE_BASE+'product/source/ui/branding-settings.js'+bust,{cache:'no-store',signal:AbortSignal.timeout(10000)}),
        fetch(LIVE_BASE+LIVE_HARNESS+bust,{cache:'no-store',signal:AbortSignal.timeout(10000)})
      ]);
      const css=cssRes.ok?Buffer.from(await cssRes.arrayBuffer()):Buffer.alloc(0);
      const shell=shellRes.ok?Buffer.from(await shellRes.arrayBuffer()):Buffer.alloc(0);
      const index=indexRes.ok?Buffer.from(await indexRes.arrayBuffer()):Buffer.alloc(0);
      const creative=creativeRes.ok?Buffer.from(await creativeRes.arrayBuffer()):Buffer.alloc(0);
      const branding=brandingRes.ok?Buffer.from(await brandingRes.arrayBuffer()):Buffer.alloc(0);
      last={
        stylesStatus:cssRes.status,webShellStatus:shellRes.status,indexStatus:indexRes.status,creativeStatus:creativeRes.status,brandingStatus:brandingRes.status,harnessStatus:harnessRes.status,
        styles:css.length?digest(css):null,webShell:shell.length?digest(shell):null,index:index.length?digest(index):null,
        creative:creative.length?digest(creative):null,branding:branding.length?digest(branding):null
      };
      if(cssRes.ok&&shellRes.ok&&indexRes.ok&&creativeRes.ok&&brandingRes.ok&&harnessRes.ok&&last.styles===expected.styles&&last.webShell===expected.webShell&&last.index===expected.index&&last.creative===expected.creative&&last.branding===expected.branding){
        return {baseUrl:LIVE_BASE,expected,observed:last,waitMs:Date.now()-started};
      }
    }catch(error){last={error:String(error?.message||error)};}
    await sleep(3000);
  }
  throw new Error('live Pages identity timeout '+JSON.stringify({expected,last,timeoutMs}));
}
async function browserCommand(executable,args,timeoutMs=90000){
  let child,stdout='',stderr='',timer;
  try{
    child=spawn(executable,args,{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
    child.stdout.on('data',chunk=>{if(stdout.length<8*1024*1024)stdout+=chunk.toString();});
    child.stderr.on('data',chunk=>{if(stderr.length<200000)stderr+=chunk.toString();});
    const exit=await Promise.race([
      once(child,'exit').then(([code,signal])=>({code,signal})),
      new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('browser command timeout '+stderr)),timeoutMs);})
    ]);
    if(exit.code!==0)throw new Error('browser command exit '+exit.code+'/'+exit.signal+' '+stderr);
    return {stdout,stderr};
  }finally{clearTimeout(timer);await stop(child);}
}
async function captureLivePages(root,identity){
  const evidence=path.join(root,'evidence');
  const executable=browser();
  const profile=await mkdtemp(path.join(root,'profile-live-pvsi5-'));
  const common=[
    '--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions','--disable-background-networking',
    '--force-device-scale-factor=1','--window-size=1280,1024','--virtual-time-budget=8000',
    '--run-all-compositor-stages-before-draw','--user-data-dir='+profile
  ];
  const modes=[
    'prefs-general','prefs-interface','prefs-tools','prefs-canvas','prefs-guides','prefs-performance','prefs-storage','prefs-branding',
    'creative-reference','panel-libraries','creative-compose','creative-chat','creative-revision',
    'panel-properties','panel-color','panel-adjustments','panel-history','panel-channels','panel-pages'
  ];
  const urls={},screenshots={};
  try{
    for(const mode of modes){
      const url=LIVE_BASE+LIVE_HARNESS+'?mode='+encodeURIComponent(mode)+'&target='+encodeURIComponent(TARGET_SHA);
      const file='live-'+mode+'.png',dest=path.join(evidence,file);
      urls[mode]=url;
      await browserCommand(executable,[...common,'--screenshot='+dest,url]);
      const info=await stat(dest);
      if(info.size<5000)throw new Error('live screenshot too small '+mode+' '+info.size);
      screenshots[mode]={file,bytes:info.size};
    }
    const auditUrl=LIVE_BASE+LIVE_HARNESS+'?mode=audit&target='+encodeURIComponent(TARGET_SHA);
    urls.audit=auditUrl;
    const dump=await browserCommand(executable,[...common,'--dump-dom',auditUrl],120000);
    const match=dump.stdout.match(/<pre id="pvsiMetrics"[^>]*>([\s\S]*?)<\/pre>/i);
    if(!match)throw new Error('live metrics marker missing from audit dump');
    const unescape=s=>s.replace(/&quot;/g,'"').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
    const metrics=JSON.parse(unescape(match[1]));
    if(metrics.status!=='PASS')throw new Error('live package5 harness '+(metrics.error||metrics.status));
    const live={schema:'INK-UI-PVSI-PACK5-LIVE-EVIDENCE',version:1,targetSha:TARGET_SHA,identity,urls,screenshots,metrics};
    await writeFile(path.join(evidence,'live-metrics.json'),JSON.stringify(live,null,2));
    return live;
  }finally{await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:150});}
}
async function waitReport(reports,mode,timeoutMs=5000){
  const start=Date.now();
  while(Date.now()-start<timeoutMs){
    if(reports.has(mode))return reports.get(mode);
    await new Promise(r=>setTimeout(r,100));
  }
  return null;
}
async function capture(root,origin,state,reports){
  const profile=await mkdtemp(path.join(root,'profile-visual-'+state.mode+'-'));
  const shot=path.join(root,'evidence',state.mode+'.png');
  const url=origin+'/__qa_harness.html?mode='+encodeURIComponent(state.mode);
  const args=[
    '--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions','--disable-background-networking',
    '--force-device-scale-factor=1',
    '--window-size='+state.width+','+state.height,
    '--virtual-time-budget=5000',
    '--run-all-compositor-stages-before-draw',
    '--user-data-dir='+profile,
    '--screenshot='+shot,
    url
  ];
  let child,stderr='',timer;
  try{
    child=spawn(browser(),args,{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe']});
    child.stderr.on('data',chunk=>{if(stderr.length<50000)stderr+=chunk.toString();});
    const exit=await Promise.race([
      once(child,'exit').then(([code,signal])=>({code,signal})),
      new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('capture timeout '+state.mode+' '+stderr)),90000);})
    ]);
    if(exit.code!==0)throw new Error('capture exit '+state.mode+' '+exit.code+'/'+exit.signal+' '+stderr);
    const info=await stat(shot);
    if(info.size<5000)throw new Error('screenshot too small '+state.mode+' '+info.size);
    const evidence=await waitReport(reports,state.mode,5000);
    if(!evidence)throw new Error('missing visual evidence '+state.mode);
    if(evidence.status!=='PASS')throw new Error('visual harness '+state.mode+' '+(evidence.error||evidence.status));
    return {mode:state.mode,width:state.width,height:state.height,screenshot:path.basename(shot),bytes:info.size,evidence};
  }finally{
    clearTimeout(timer);
    await stop(child);
    await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:150});
  }
}
export async function run(root){
  const evidenceDir=path.join(root,'evidence');await mkdir(evidenceDir,{recursive:true});
  const reports=new Map();let server;
  const report={schema:'INK-UI-ISSUE92-VISUAL-PACK-REPORT',version:1,targetSha:TARGET_SHA,centralRuntimeExecuted:false,status:'RUNNING',states:[]};
  try{
    const started=await startServer(root,reports);server=started.server;
    for(const route of ['/','/styles.css','/web-shell.js','/src/ink.js','/__qa_harness.html?mode=desktop-layers']){
      const response=await fetch(started.origin+route,{signal:AbortSignal.timeout(5000)});
      assert.equal(response.status,200,'preflight '+route);await response.arrayBuffer();
    }
    const liveIdentity=await waitLiveProduct(root);
    report.live=await captureLivePages(root,liveIdentity);
    for(const state of STATES){
      report.states.push(await capture(root,started.origin,state,reports));
    }
    report.status='PASS';
    report.summary={total:STATES.length,passed:STATES.length,failed:0,screenshotBytes:report.states.reduce((n,x)=>n+x.bytes,0)};
    await writeFile(path.join(evidenceDir,'visual-metrics.json'),JSON.stringify({schema:'INK-UI-ISSUE92-VISUAL-METRICS',version:1,targetSha:TARGET_SHA,states:report.states.map(x=>x.evidence)},null,2));
  }catch(error){
    report.status='FAIL';report.error=String(error?.stack||error);
    report.summary={total:STATES.length,passed:report.states.length,failed:STATES.length-report.states.length};
    process.exitCode=1;
  }finally{
    await writeFile(path.join(evidenceDir,'report.json'),JSON.stringify(report,null,2));
    if(server){server.closeAllConnections();await new Promise(r=>server.close(r));}
  }
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await run(path.resolve(process.argv[2]||'.'));
