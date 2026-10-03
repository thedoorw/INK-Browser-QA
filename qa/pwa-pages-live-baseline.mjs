import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';

const [url, profile, output] = process.argv.slice(2);
assert.ok(url && profile && output, 'usage: node qa/pwa-pages-live-baseline.mjs <url> <profile> <output>');

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
async function evaluate(cdp, sessionId, expression) {
  const result = await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
  return result.result?.value;
}
async function waitFor(cdp, sessionId, expression, label, timeoutMs = 60000) {
  const end = Date.now() + timeoutMs;
  while (Date.now() < end) {
    try { if (await evaluate(cdp,sessionId,expression)) return; } catch {}
    await new Promise(resolve => setTimeout(resolve,250));
  }
  throw new Error('timeout waiting for ' + label);
}
async function workerIdentity(cdp, sessionId) {
  return evaluate(cdp,sessionId,`new Promise((resolve,reject)=>{const c=navigator.serviceWorker.controller;if(!c)return reject(new Error('no controller'));const ch=new MessageChannel();const t=setTimeout(()=>reject(new Error('identity timeout')),3000);ch.port1.onmessage=e=>{clearTimeout(t);resolve(e.data)};c.postMessage({type:'INK_GET_VERSION'},[ch.port2]);})`);
}

await mkdir(profile,{recursive:true});
await mkdir(path.dirname(output),{recursive:true});
const child = spawn(browserPath(),[
  '--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions',
  '--remote-debugging-pipe',`--user-data-dir=${profile}`,'about:blank'
],{stdio:['ignore','ignore','pipe','pipe','pipe']});
const cdp = cdpPipe(child);
try {
  await cdp.send('Browser.getVersion');
  const {targetId} = await cdp.send('Target.createTarget',{url});
  const {sessionId} = await cdp.send('Target.attachToTarget',{targetId,flatten:true});
  await cdp.send('Runtime.enable',{},sessionId);
  await cdp.send('Page.enable',{},sessionId);
  await waitFor(cdp,sessionId,"document.readyState==='complete' && !!window.INK_APP",'app ready');
  await waitFor(cdp,sessionId,"!!navigator.serviceWorker.controller",'worker controller');
  const report = {
    schema:'INK_PWA_PAGES_BASELINE',
    version:1,
    status:'PASS',
    url,
    identity:await workerIdentity(cdp,sessionId),
    appBuildId:await evaluate(cdp,sessionId,'window.INK_ARCHITECTURE?.buildId || null'),
    caches:await evaluate(cdp,sessionId,'caches.keys()'),
    href:await evaluate(cdp,sessionId,'location.href'),
    capturedAt:new Date().toISOString(),
    ctrlF5Used:false,
    devtoolsClearCacheUsed:false,
    unregisterUsed:false
  };
  await writeFile(output,JSON.stringify(report,null,2)+'\n');
} finally {
  child.kill('SIGKILL');
}
