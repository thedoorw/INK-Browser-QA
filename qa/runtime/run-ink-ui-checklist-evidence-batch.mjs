import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { startServer, suites, validateEvidence } from './run-ink-runtime-batch.mjs';

const TARGET_SHA = process.env.INK_TESTED_SHA || '';
assert.match(TARGET_SHA, /^[a-f0-9]{40}$/, 'Exact tested SHA required');
const uiSuite = suites.find(s => s.id === 'ui');
assert.ok(uiSuite, 'UI suite required');

function findBrowser(){
  const candidates=[process.env.INK_CHROMIUM_PATH,process.env.CHROME_PATH];
  for(const base of [process.env.ProgramFiles,process.env['ProgramFiles(x86)'],process.env.LOCALAPPDATA].filter(Boolean)){
    candidates.push(path.join(base,'Google/Chrome/Application/chrome.exe'));
    candidates.push(path.join(base,'Microsoft/Edge/Application/msedge.exe'));
  }
  const found=candidates.find(file=>file&&existsSync(file));
  if(!found) throw new Error('Installed Chrome/Edge required');
  return found;
}
async function stopBrowser(child){
  if(!child?.pid)return;
  if(process.platform==='win32'){
    const killer=spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'),['/PID',String(child.pid),'/T','/F'],{shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(resolve=>{killer.once('error',resolve);killer.once('exit',resolve);});
  }else if(child.exitCode===null&&child.signalCode===null){
    child.kill('SIGKILL'); await once(child,'exit');
  }
}
export async function run(root){
  const evidenceDir=path.join(root,'evidence');
  await mkdir(evidenceDir,{recursive:true});
  const report={schema:'INK-UI-FINAL-CHECKLIST-ISSUE92-UI-SUITE',version:1,task:'INK-UI-FINAL-CHECKLIST-CLOSURE-001',targetSha:TARGET_SHA,workflowSha:process.env.INK_WORKFLOW_SHA||null,centralRuntimeExecuted:false,status:'RUNNING'};
  const browser=findBrowser();
  const profile=await mkdtemp(path.join(root,'profile-issue92-ui-'));
  let child,server,timer;
  try{
    let receive;
    const result=new Promise(resolve=>{receive=resolve;});
    const started=await startServer(root,uiSuite,receive,{evidenceDir}); server=started.server;
    for(const route of ['/','/src/ink.js','/styles.css','/__qa_harness.html','/__qa_rose_window.png']){
      const response=await fetch(started.origin+route,{signal:AbortSignal.timeout(5000)});
      assert.equal(response.status,200,'HTTP preflight '+route);
      await response.arrayBuffer();
    }
    child=spawn(browser,['--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-extensions','--disable-background-timer-throttling','--disable-background-networking','--user-data-dir='+profile,started.origin+'/__qa_harness.html'],{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe']});
    let stderr=''; child.stderr.on('data',c=>{if(stderr.length<20000)stderr+=c.toString();});
    const failure=new Promise((_,reject)=>{
      child.once('error',reject);
      child.once('exit',(code,signal)=>reject(new Error('Browser exited before evidence: '+code+'/'+signal+'\n'+stderr)));
      timer=setTimeout(()=>reject(new Error('UI harness timeout')),360000);
    });
    const evidence=await Promise.race([result,failure]);
    await writeFile(path.join(evidenceDir,'ui.json'),JSON.stringify(evidence,null,2));
    validateEvidence('ui',evidence);
    report.browserChecks=evidence.summary;
    report.status='PASS';
  }catch(error){
    report.status='FAIL'; report.error=String(error?.stack||error); process.exitCode=1;
  }finally{
    clearTimeout(timer);
    await writeFile(path.join(evidenceDir,'report.json'),JSON.stringify(report,null,2));
    await writeFile(path.join(evidenceDir,'revision.json'),JSON.stringify({targetSha:TARGET_SHA,workflowSha:report.workflowSha,centralRuntimeExecuted:false},null,2));
    try{await stopBrowser(child);}finally{
      if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
      await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:200});
    }
  }
  return report;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)) await run(path.resolve(process.argv[2]||'.'));
