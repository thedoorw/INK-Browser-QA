import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';

const [url, profile, expectedBuildId, expectedSha, baselinePath, output] = process.argv.slice(2);
assert.ok(url && profile && expectedBuildId && expectedSha && baselinePath && output,
  'usage: node qa/pwa-pages-live-verify.mjs <url> <profile> <build> <sha> <baseline> <output>');
const baseline = JSON.parse(await readFile(baselinePath,'utf8'));

function browserPath() {
  for (const p of ['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser']) if (existsSync(p)) return p;
  throw new Error('Chrome/Chromium not found');
}
function cdpPipe(child) {
  const input = child.stdio[3], output = child.stdio[4];
  let nextId = 1, buffer = Buffer.alloc(0);
  const pending = new Map();
  output.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const boundary = buffer.indexOf(0);
      if (boundary < 0) break;
      const raw = buffer.subarray(0,boundary).toString('utf8');
      buffer = buffer.subarray(boundary + 1);
      if (!raw) continue;
      const message = JSON.parse(raw);
      if (!message.id) continue;
      const entry = pending.get(message.id);
      if (!entry) continue;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      message.error ? entry.reject(new Error(message.error.message)) : entry.resolve(message.result || {});
    }
  });
  const send = (method, params = {}, sessionId = null, timeoutMs = 30000) => new Promise((resolve,reject) => {
    const id = nextId++;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, timeoutMs);
    pending.set(id,{resolve,reject,timer});
    const message = {id,method,params};
    if (sessionId) message.sessionId = sessionId;
    input.write(JSON.stringify(message) + '\0');
  });
  return { send };
}
async function evaluate(cdp, sessionId, expression, timeoutMs = 30000) {
  const result = await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId,timeoutMs);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
}
async function waitFor(cdp, sessionId, expression, label, timeoutMs = 90000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try { if (await evaluate(cdp,sessionId,expression,5000)) return; } catch {}
    await new Promise(resolve => setTimeout(resolve,250));
  }
  throw new Error('timeout waiting for ' + label);
}
async function workerIdentity(cdp, sessionId) {
  return evaluate(cdp,sessionId,`new Promise((resolve,reject)=>{const c=navigator.serviceWorker.controller;if(!c)return reject(new Error('no controller'));const ch=new MessageChannel();const t=setTimeout(()=>reject(new Error('identity timeout')),3000);ch.port1.onmessage=e=>{clearTimeout(t);resolve(e.data)};c.postMessage({type:'INK_GET_VERSION'},[ch.port2]);})`);
}
async function snapshot(cdp, sessionId) {
  return {
    identity:await workerIdentity(cdp,sessionId),
    appBuildId:await evaluate(cdp,sessionId,'window.INK_ARCHITECTURE?.buildId || null'),
    caches:await evaluate(cdp,sessionId,'caches.keys()'),
    href:await evaluate(cdp,sessionId,'location.href')
  };
}

const child = spawn(browserPath(),[
  '--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions',
  '--remote-debugging-pipe',`--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','ignore','pipe','pipe','pipe']});
const cdp = cdpPipe(child);
const report = {
  schema:'INK_PWA_PAGES_LIVE_GATE',
  version:1,
  url,
  expectedBuildId,
  expectedSha,
  baseline,
  ordinaryReloadMechanism:'Chromium Page.reload; ignoreCache=false',
  checks:{}
};
try {
  await cdp.send('Browser.getVersion');
  let {targetId} = await cdp.send('Target.createTarget',{url});
  let attached = await cdp.send('Target.attachToTarget',{targetId,flatten:true});
  let sessionId = attached.sessionId;
  await cdp.send('Runtime.enable',{},sessionId);
  await cdp.send('Page.enable',{},sessionId);
  await waitFor(cdp,sessionId,"document.readyState==='complete' && !!window.INK_APP",'ordinary open app');
  await waitFor(cdp,sessionId,"!!navigator.serviceWorker.controller",'ordinary open controller');
  await waitFor(cdp,sessionId,`new Promise(r=>{const c=navigator.serviceWorker.controller;if(!c)return r(false);const ch=new MessageChannel();const t=setTimeout(()=>r(false),1200);ch.port1.onmessage=e=>{clearTimeout(t);r(e.data?.buildId===${JSON.stringify(expectedBuildId)})};c.postMessage({type:'INK_GET_VERSION'},[ch.port2]);})`,'candidate identity after ordinary open');
  const openState = await snapshot(cdp,sessionId);
  assert.equal(openState.identity.buildId,expectedBuildId);
  assert.equal(openState.appBuildId,expectedBuildId);

  await cdp.send('Page.reload',{ignoreCache:false},sessionId);
  await waitFor(cdp,sessionId,"document.readyState==='complete' && !!window.INK_APP",'ordinary F5-equivalent reload');
  await waitFor(cdp,sessionId,"!!navigator.serviceWorker.controller",'reload controller');
  const reloadState = await snapshot(cdp,sessionId);
  assert.equal(reloadState.identity.buildId,expectedBuildId);
  assert.equal(reloadState.appBuildId,expectedBuildId);
  assert.ok(reloadState.caches.every(key => !key.startsWith('ink-build-') || key.includes(expectedBuildId)));

  await cdp.send('Target.closeTarget',{targetId});
  ({targetId} = await cdp.send('Target.createTarget',{url}));
  attached = await cdp.send('Target.attachToTarget',{targetId,flatten:true});
  sessionId = attached.sessionId;
  await cdp.send('Runtime.enable',{},sessionId);
  await cdp.send('Page.enable',{},sessionId);
  await waitFor(cdp,sessionId,"document.readyState==='complete' && !!window.INK_APP",'close reopen app');
  await waitFor(cdp,sessionId,"!!navigator.serviceWorker.controller",'reopen controller');
  const reopenState = await snapshot(cdp,sessionId);
  assert.equal(reopenState.identity.buildId,expectedBuildId);
  assert.equal(reopenState.appBuildId,expectedBuildId);

  await cdp.send('Network.enable',{},sessionId);
  await cdp.send('Network.emulateNetworkConditions',{
    offline:true,latency:0,downloadThroughput:0,uploadThroughput:0
  },sessionId);
  await cdp.send('Page.reload',{ignoreCache:false},sessionId);
  await waitFor(cdp,sessionId,"document.readyState==='complete' && !!window.INK_APP",'offline app');
  await waitFor(cdp,sessionId,"!!navigator.serviceWorker.controller",'offline controller');
  const offlineState = await snapshot(cdp,sessionId);
  assert.equal(offlineState.identity.buildId,expectedBuildId);
  assert.equal(offlineState.appBuildId,expectedBuildId);

  report.open=openState;
  report.reload=reloadState;
  report.reopen=reopenState;
  report.offline=offlineState;
  report.checks={
    baselineHadPreviousController:Boolean(baseline.identity?.buildId),
    baselineDifferentFromCandidate:baseline.identity?.buildId!==expectedBuildId,
    ordinaryOpenReachedCandidate:true,
    ordinaryF5ReachedCandidate:true,
    closeReopenReachedCandidate:true,
    offlineFallbackLoads:true,
    oldInkCachesCleaned:true,
    appWorkerIdentityAgree:true,
    ctrlF5Used:false,
    devtoolsClearCacheUsed:false,
    unregisterUsed:false
  };
  report.status='PASS';
  await writeFile(output,JSON.stringify(report,null,2)+'\n');
} catch (error) {
  report.status='FAIL';
  report.error=error?.stack || String(error);
  await writeFile(output,JSON.stringify(report,null,2)+'\n');
  throw error;
} finally {
  child.kill('SIGKILL');
}
