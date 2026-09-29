import assert from 'node:assert/strict';
import { existsSync, createWriteStream } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer, suites, validateEvidence, finalizeSmartLoopEvidence } from './run-ink-runtime-batch.mjs';

const TARGET_SHA=process.env.INK_TESTED_SHA||'';
assert.match(TARGET_SHA,/^[a-f0-9]{40}$/,'Exact tested SHA required');
const suite=suites.find(item=>item.id==='creative');
assert.ok(suite,'Creative suite required');

function findBrowser(){
  const candidates=[process.env.INK_CHROMIUM_PATH,process.env.CHROME_PATH];
  for(const base of [process.env.ProgramFiles,process.env['ProgramFiles(x86)'],process.env.LOCALAPPDATA].filter(Boolean)){
    candidates.push(path.join(base,'Google/Chrome/Application/chrome.exe'));
    candidates.push(path.join(base,'Microsoft/Edge/Application/msedge.exe'));
  }
  const found=candidates.find(file=>file&&existsSync(file));
  if(!found)throw new Error('Installed Chrome/Edge required');
  return found;
}
async function stopBrowser(child){
  if(!child?.pid)return;
  if(process.platform==='win32'){
    const killer=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(resolve=>{killer.once('error',resolve);killer.once('exit',resolve);});
  }else if(child.exitCode===null&&child.signalCode===null){
    child.kill('SIGKILL');await once(child,'exit');
  }
}
export async function run(root){
  const evidenceDir=path.join(root,'evidence');
  await mkdir(evidenceDir,{recursive:true});
  const report={schema:'INK-UI-FINAL-CHECKLIST-ISSUE92-CREATIVE-SUITE',version:1,task:'INK-UI-FINAL-CHECKLIST-CLOSURE-001',targetSha:TARGET_SHA,workflowSha:process.env.INK_WORKFLOW_SHA||null,centralRuntimeExecuted:false,status:'RUNNING'};
  const browser=findBrowser(),profile=await mkdtemp(path.join(root,'profile-issue92-creative-'));
  let child,server,timer,log;
  try{
    let receive;
    const result=new Promise(resolve=>{receive=resolve;});
    let latestProgress=null;const trace=[];
    const onProgress=async progress=>{
      if(latestProgress&&progress.sequence<=latestProgress.sequence)return;
      latestProgress=progress;trace.push(progress);if(trace.length>160)trace.splice(0,trace.length-160);
      await writeFile(path.join(evidenceDir,'creative-progress.json'),JSON.stringify({targetSha:TARGET_SHA,latest:latestProgress,trace},null,2));
    };
    const started=await startServer(root,suite,receive,{evidenceDir,onProgress});server=started.server;
    for(const route of ['/','/src/ink.js','/styles.css','/__qa_harness.html','/__qa_rose_window.png','/__qa_smart_loop_resolver.js']){
      const response=await fetch(started.origin+route,{signal:AbortSignal.timeout(5000)});
      assert.equal(response.status,200,'HTTP preflight '+route);await response.arrayBuffer();
    }
    log=createWriteStream(path.join(evidenceDir,'creative-browser.log'));
    child=spawn(browser,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--disable-background-timer-throttling','--disable-background-networking','--user-data-dir='+profile,started.origin+'/__qa_harness.html'],{shell:false,windowsHide:true,stdio:['ignore','pipe','pipe']});
    child.stdout.pipe(log,{end:false});child.stderr.pipe(log,{end:false});
    const failure=new Promise((_,reject)=>{
      child.once('error',reject);
      child.once('exit',(code,signal)=>reject(new Error('Browser exited before evidence: '+code+'/'+signal)));
      timer=setTimeout(()=>reject(new Error('Creative harness timeout')),360000);
    });
    const evidence=await Promise.race([result,failure]);
    await writeFile(path.join(evidenceDir,'creative.json'),JSON.stringify(evidence,null,2));
    validateEvidence('creative',evidence);
    await finalizeSmartLoopEvidence(root,evidence,TARGET_SHA);
    report.checks={total:evidence.checks?.length||0,failed:evidence.failures?.length||0};
    report.lastProgress=latestProgress;report.status='PASS';
  }catch(error){
    report.status='FAIL';report.error=String(error?.stack||error);process.exitCode=1;
  }finally{
    clearTimeout(timer);
    await writeFile(path.join(evidenceDir,'report.json'),JSON.stringify(report,null,2));
    await writeFile(path.join(evidenceDir,'revision.json'),JSON.stringify({targetSha:TARGET_SHA,workflowSha:report.workflowSha,centralRuntimeExecuted:false},null,2));
    try{await stopBrowser(child);}finally{
      if(log){log.end();await once(log,'finish');}
      if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
      await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});
    }
  }
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await run(path.resolve(process.argv[2]||'.'));
