import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile, mkdtemp, rm } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';

const [baselineArg, candidateArg, outputArg] = process.argv.slice(2);
assert.ok(baselineArg && candidateArg && outputArg, 'usage: node qa/pwa-cache-freshness-browser.mjs <baseline-source> <candidate-source> <output-json>');
const baselineRoot = path.resolve(baselineArg);
const candidateRoot = path.resolve(candidateArg);
const outputPath = path.resolve(outputArg);
assert.ok(existsSync(path.join(baselineRoot, 'index.html')), 'baseline index missing');
assert.ok(existsSync(path.join(candidateRoot, 'index.html')), 'candidate index missing');

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH];
  if (process.platform === 'win32') {
    for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      candidates.push(path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Microsoft/Edge/Application/msedge.exe'));
    }
  } else {
    candidates.push('/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium','/usr/bin/chromium-browser','/opt/google/chrome/chrome');
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Installed Chrome/Chromium required');
  return found;
}

function mime(file) {
  const ext = path.extname(file).toLowerCase();
  return ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.ico':'image/x-icon'})[ext] || 'application/octet-stream';
}

async function startSwitchableServer() {
  let root = baselineRoot;
  let label = 'baseline';
  const requests = [];
  const server = createServer(async (req, res) => {
    const now = Date.now();
    try {
      const url = new URL(req.url || '/', 'http://127.0.0.1');
      const requestPath = decodeURIComponent(url.pathname);
      requests.push({
        at: now,
        label,
        path: requestPath,
        search: url.search,
        mode: req.headers['sec-fetch-mode'] || null,
        dest: req.headers['sec-fetch-dest'] || null
      });
      let pathname = requestPath;
      if (pathname === '/' || pathname.endsWith('/')) pathname += 'index.html';
      const file = path.resolve(root, '.' + pathname);
      const rootPrefix = (root.endsWith(path.sep) ? root : root + path.sep).toLowerCase();
      if (file.toLowerCase() !== root.toLowerCase() && !file.toLowerCase().startsWith(rootPrefix)) {
        res.writeHead(403); res.end('forbidden'); return;
      }
      const bytes = await readFile(file);
      res.writeHead(200, {
        'Content-Type': mime(file),
        'Cache-Control': 'public, max-age=600',
        'X-INK-Test-Root': label
      });
      res.end(bytes);
    } catch (error) {
      res.writeHead(error?.code === 'ENOENT' ? 404 : 500, {'Content-Type':'text/plain; charset=utf-8'});
      res.end(error?.message || String(error));
    }
  });
  await new Promise((resolve,reject) => { server.once('error',reject); server.listen(0,'127.0.0.1',resolve); });
  const address = server.address();
  return {
    server,
    requests,
    baseUrl: 'http://127.0.0.1:' + address.port + '/',
    switchToCandidate() { root = candidateRoot; label = 'candidate'; },
    stop() { return new Promise(resolve => server.close(() => resolve())); }
  };
}

function cdpPipe(child) {
  const input = child.stdio?.[3], output = child.stdio?.[4];
  assert.ok(input?.writable && output?.readable, 'CDP pipe unavailable');
  let nextId = 1, buffer = Buffer.alloc(0);
  const pending = new Map();
  const failAll = error => { for (const entry of pending.values()) { clearTimeout(entry.timer); entry.reject(error); } pending.clear(); };
  output.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const boundary = buffer.indexOf(0);
      if (boundary < 0) break;
      const raw = buffer.subarray(0,boundary).toString('utf8');
      buffer = buffer.subarray(boundary + 1);
      if (!raw) continue;
      let message;
      try { message = JSON.parse(raw); } catch (error) { failAll(error); continue; }
      if (!message.id) continue;
      const entry = pending.get(message.id);
      if (!entry) continue;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      if (message.error) entry.reject(new Error(entry.method + ': ' + message.error.message));
      else entry.resolve(message.result || {});
    }
  });
  output.once('error', failAll);
  output.once('close', () => failAll(new Error('CDP pipe closed')));
  const send = (method, params = {}, sessionId = null, timeoutMs = 30000) => new Promise((resolve,reject) => {
    const id = nextId++;
    const timer = setTimeout(() => { pending.delete(id); reject(new Error('CDP timeout: ' + method)); }, timeoutMs);
    pending.set(id,{method,resolve,reject,timer});
    const message = {id,method,params};
    if (sessionId) message.sessionId = sessionId;
    input.write(JSON.stringify(message) + '\0');
  });
  return { send };
}

async function stopBrowser(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn(path.join(process.env.SystemRoot,'System32/taskkill.exe'), ['/PID',String(child.pid),'/T','/F'], {shell:false,windowsHide:true,stdio:'ignore'});
    await new Promise(resolve => { killer.once('error',resolve); killer.once('exit',resolve); });
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
    await once(child,'exit');
  }
}

async function attachPage(cdp, targetId) {
  const attached = await cdp.send('Target.attachToTarget',{targetId,flatten:true});
  const sessionId = attached.sessionId;
  await cdp.send('Runtime.enable',{},sessionId);
  await cdp.send('Page.enable',{},sessionId);
  return sessionId;
}

async function evaluate(cdp, sessionId, expression, timeoutMs = 15000) {
  const result = await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true},sessionId,timeoutMs);
  if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text || 'Runtime evaluation failed');
  return result.result?.value ?? null;
}

async function waitFor(cdp, sessionId, expression, label, timeoutMs = 45000) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < timeoutMs) {
    try {
      last = await evaluate(cdp,sessionId,expression,5000);
      if (last) return last;
    } catch {}
    await new Promise(resolve => setTimeout(resolve,150));
  }
  throw new Error('timeout waiting for ' + label + ': ' + JSON.stringify(last));
}

async function waitReady(cdp, sessionId) {
  return waitFor(cdp,sessionId,
    "(() => document.readyState === 'complete' && Boolean(window.INK_APP) && Boolean(navigator.serviceWorker))()",
    'INK document ready');
}

async function waitControlled(cdp, sessionId) {
  return waitFor(cdp,sessionId,
    "(() => Boolean(navigator.serviceWorker.controller))()",
    'service worker controller');
}

async function registrationDiagnostics(cdp, sessionId) {
  return evaluate(cdp,sessionId,`
    (async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      const describe = worker => worker ? {scriptURL:worker.scriptURL,state:worker.state} : null;
      return {
        controller: describe(navigator.serviceWorker.controller),
        active: describe(registration?.active),
        waiting: describe(registration?.waiting),
        installing: describe(registration?.installing)
      };
    })()
  `).catch(error => ({error:error?.message || String(error)}));
}

async function workerIdentity(cdp, sessionId) {
  return evaluate(cdp,sessionId,`
    (() => new Promise((resolve, reject) => {
      const controller = navigator.serviceWorker.controller;
      if (!controller) return reject(new Error('no controller'));
      const timer = setTimeout(() => reject(new Error('identity timeout')), 3000);
      const handler = event => {
        if (event.data?.type !== 'INK_VERSION') return;
        clearTimeout(timer);
        navigator.serviceWorker.removeEventListener('message', handler);
        resolve(event.data);
      };
      navigator.serviceWorker.addEventListener('message', handler);
      controller.postMessage({ type: 'INK_GET_VERSION' });
    }))()
  `);
}

async function cacheKeys(cdp, sessionId) {
  return evaluate(cdp,sessionId,"caches.keys()");
}

async function appBuildIdentity(cdp, sessionId) {
  return evaluate(cdp,sessionId,"window.INK_ARCHITECTURE?.buildId || null");
}

async function coherentCacheProbe(cdp, sessionId, identity) {
  const shell = JSON.stringify(identity.shellCache);
  const id = JSON.stringify(identity.buildId);
  return evaluate(cdp,sessionId,`
    (async () => {
      const cache = await caches.open(${shell});
      const [buildResponse, managerResponse, htmlResponse] = await Promise.all([
        cache.match('./build-identity.js'),
        cache.match('./src/pwa/update-manager.js'),
        cache.match('./index.html')
      ]);
      const [buildText, managerText, htmlText] = await Promise.all([
        buildResponse?.text() || '',
        managerResponse?.text() || '',
        htmlResponse?.text() || ''
      ]);
      return {
        buildIdentityMatches: buildText.includes(${id}),
        managerIsCandidate: managerText.includes('autoActivate = true') && managerText.includes("updateViaCache: 'none'"),
        htmlPresent: htmlText.includes('<title>INK v0.1 · Web</title>')
      };
    })()
  `);
}

const candidateBuildText = await readFile(path.join(candidateRoot,'build-identity.js'),'utf8');
const match = candidateBuildText.match(/INK_BUILD_ID\s*=\s*'([^']+)'/);
assert.ok(match, 'candidate build identity missing');
const expectedCandidateBuildId = match[1];

const hosted = await startSwitchableServer();
const browser = findBrowser();
const profile = await mkdtemp(path.join(process.env.RUNNER_TEMP || process.cwd(), 'ink-pwa-browser-'));
let child, cdp, targetId, sessionId;
const report = {
  schema: 'INK_PWA_CACHE_FRESHNESS_BROWSER_EVIDENCE',
  version: 1,
  baselineSource: '4188e9cc7673313726abd7986310d758912f63cf',
  candidateBuildId: expectedCandidateBuildId,
  baseUrl: hosted.baseUrl,
  ordinaryReloadMechanism: 'Chromium Page.reload; ignoreCache=false (normal reload, not hard reload)',
  checks: {}
};

try {
  child = spawn(browser,[
    '--headless=new','--no-first-run','--no-default-browser-check','--disable-extensions',
    '--remote-debugging-pipe',`--user-data-dir=${profile}`,'about:blank'
  ],{shell:false,windowsHide:true,stdio:['ignore','ignore','pipe','pipe','pipe']});
  cdp = cdpPipe(child);
  await cdp.send('Browser.getVersion');

  ({targetId} = await cdp.send('Target.createTarget',{url:hosted.baseUrl}));
  sessionId = await attachPage(cdp,targetId);
  await waitReady(cdp,sessionId);
  await waitControlled(cdp,sessionId);
  await cdp.send('Page.reload',{},sessionId);
  await waitReady(cdp,sessionId);
  await waitControlled(cdp,sessionId);

  const baselineIdentity = await workerIdentity(cdp,sessionId);
  const baselineCaches = await cacheKeys(cdp,sessionId);
  assert.equal(baselineIdentity.buildId,'20261002-c04-two-state-repair');
  assert.ok(baselineCaches.some(key => key.includes(baselineIdentity.buildId)));
  report.baseline = { identity: baselineIdentity, caches: baselineCaches };
  report.checks.previousWorkerControlled = true;

  hosted.switchToCandidate();
  const switchAt = Date.now();
  await cdp.send('Page.reload',{ignoreCache:false},sessionId);

  await waitFor(cdp,sessionId,`
    (() => new Promise(resolve => {
      const finish = () => {
        const controller = navigator.serviceWorker.controller;
        if (!controller) return resolve(false);
        const timer = setTimeout(() => resolve(false), 1200);
        const handler = event => {
          if (event.data?.type !== 'INK_VERSION') return;
          clearTimeout(timer);
          navigator.serviceWorker.removeEventListener('message', handler);
          resolve(event.data?.buildId === ${JSON.stringify(expectedCandidateBuildId)});
        };
        navigator.serviceWorker.addEventListener('message', handler);
        controller.postMessage({type:'INK_GET_VERSION'});
      };
      if (document.readyState === 'complete') finish();
      else addEventListener('load', finish, {once:true});
    }))()
  `,'candidate worker identity',60000);
  await waitReady(cdp,sessionId);
  await waitControlled(cdp,sessionId);
  await waitFor(cdp,sessionId,`
    (async () => {
      const registration = await navigator.serviceWorker.getRegistration();
      const keys = await caches.keys();
      return registration?.active?.state === 'activated'
        && keys.every(key => !key.startsWith('ink-build-') || key.includes(${JSON.stringify(expectedCandidateBuildId)}));
    })()
  `,'candidate activation and cache cleanup',30000);

  const candidateIdentity = await workerIdentity(cdp,sessionId);
  const candidateCaches = await cacheKeys(cdp,sessionId);
  const candidateAppBuildId = await appBuildIdentity(cdp,sessionId);
  assert.equal(candidateIdentity.buildId,expectedCandidateBuildId);
  assert.equal(candidateAppBuildId,expectedCandidateBuildId);
  assert.ok(candidateCaches.includes(candidateIdentity.shellCache));
  assert.ok(candidateCaches.every(key => !key.startsWith('ink-build-') || key.includes(expectedCandidateBuildId)));
  const coherent = await coherentCacheProbe(cdp,sessionId,candidateIdentity);
  assert.deepEqual(coherent,{buildIdentityMatches:true,managerIsCandidate:true,htmlPresent:true});

  const migrationRequestCount = () => hosted.requests.filter(r =>
    r.at >= switchAt
    && r.label === 'candidate'
    && new URLSearchParams(r.search || '').get('ink-pwa-migrate') === 'ink-pwa-cache-migration-v3'
  ).length;
  const migrationCount1 = migrationRequestCount();
  await new Promise(resolve => setTimeout(resolve,1800));
  const migrationCount2 = migrationRequestCount();
  await new Promise(resolve => setTimeout(resolve,1200));
  const migrationCount3 = migrationRequestCount();
  assert.equal(migrationCount2,migrationCount3,'migration navigation did not settle; possible reload loop');
  assert.equal(migrationCount3,1,'expected exactly one bounded migration navigation, got: ' + migrationCount3);

  report.afterOrdinaryReload = {
    identity: candidateIdentity,
    appBuildId: candidateAppBuildId,
    caches: candidateCaches,
    coherent,
    migrationRequestCount: migrationCount3,
    pageUrl: await evaluate(cdp,sessionId,'location.href')
  };
  report.checks.ordinaryReloadReachedCandidate = true;
  report.checks.oldInkCachesCleaned = true;
  report.checks.noMixedBuildCache = true;
  report.checks.noReloadLoop = true;

  await cdp.send('Target.closeTarget',{targetId});
  ({targetId} = await cdp.send('Target.createTarget',{url:hosted.baseUrl}));
  sessionId = await attachPage(cdp,targetId);
  await waitReady(cdp,sessionId);
  await waitControlled(cdp,sessionId);
  const reopenIdentity = await workerIdentity(cdp,sessionId);
  const reopenAppBuildId = await appBuildIdentity(cdp,sessionId);
  assert.equal(reopenIdentity.buildId,expectedCandidateBuildId);
  assert.equal(reopenAppBuildId,expectedCandidateBuildId);
  report.reopen = { identity: reopenIdentity, appBuildId: reopenAppBuildId, caches: await cacheKeys(cdp,sessionId) };
  report.checks.closeReopenReachedCandidate = true;

  await hosted.stop();
  await cdp.send('Page.reload',{},sessionId);
  await waitReady(cdp,sessionId);
  await waitControlled(cdp,sessionId);
  const offlineIdentity = await workerIdentity(cdp,sessionId);
  const offlineAppBuildId = await appBuildIdentity(cdp,sessionId);
  const offlineCaches = await cacheKeys(cdp,sessionId);
  const offlineCoherent = await coherentCacheProbe(cdp,sessionId,offlineIdentity);
  assert.equal(offlineIdentity.buildId,expectedCandidateBuildId);
  assert.equal(offlineAppBuildId,expectedCandidateBuildId);
  assert.ok(offlineCaches.includes(offlineIdentity.shellCache));
  assert.deepEqual(offlineCoherent,{buildIdentityMatches:true,managerIsCandidate:true,htmlPresent:true});
  report.offline = { identity: offlineIdentity, appBuildId: offlineAppBuildId, caches: offlineCaches, coherent: offlineCoherent };
  report.checks.offlineFallbackLoads = true;

  report.requestSummary = {
    total: hosted.requests.length,
    baseline: hosted.requests.filter(r => r.label === 'baseline').length,
    candidate: hosted.requests.filter(r => r.label === 'candidate').length,
    migrationIdentityRequests: hosted.requests.filter(r => new URLSearchParams(r.search || '').has('ink-pwa-migrate')).length
  };
  report.status = 'PASS';
} catch (error) {
  report.status = 'FAIL';
  report.error = error?.stack || error?.message || String(error);
  report.failureDiagnostics = {
    registration: cdp && sessionId ? await registrationDiagnostics(cdp,sessionId) : null,
    caches: cdp && sessionId ? await cacheKeys(cdp,sessionId).catch(() => []) : [],
    requestTail: hosted.requests.slice(-80)
  };
  throw error;
} finally {
  try { await mkdir(path.dirname(outputPath),{recursive:true}); await writeFile(outputPath,JSON.stringify(report,null,2) + '\n'); } catch {}
  try { await hosted.stop(); } catch {}
  await stopBrowser(child);
  await rm(profile,{recursive:true,force:true,maxRetries:3,retryDelay:150}).catch(()=>{});
}
