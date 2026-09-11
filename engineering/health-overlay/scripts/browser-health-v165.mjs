import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const evidence = path.join(root, 'tests', 'browser-evidence-v1.6.5');
const reportFile = path.join(evidence, 'browser-health-report-v1.6.5.json');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const freePort = async () => {
  const server = net.createServer();
  await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
  const port = server.address().port;
  await new Promise(resolve => server.close(resolve));
  return port;
};

class CDP {
  constructor(url, onEvent = () => {}) {
    this.id = 0;
    this.pending = new Map();
    this.ws = new WebSocket(url);
    this.open = new Promise((resolve, reject) => {
      this.ws.addEventListener('open', resolve, { once: true });
      this.ws.addEventListener('error', reject, { once: true });
    });
    this.ws.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
      } else if (message.method) onEvent(message);
    });
  }
  async send(method, params = {}) {
    await this.open;
    const id = ++this.id;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { try { this.ws.close(); } catch {} }
}

await mkdir(evidence, { recursive: true });
const report = {
  version: '1.6.5-RC',
  status: 'RUNNING',
  startedAt: new Date().toISOString(),
  checks: [],
  pageExceptions: [],
  criticalConsoleErrors: [],
  environment: {}
};
const check = (name, passed, details = {}) => report.checks.push({ name, passed: Boolean(passed), details });
const finish = async (status, exitCode) => {
  report.status = status;
  report.finishedAt = new Date().toISOString();
  await writeFile(reportFile, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = exitCode;
};

const chromium = [process.env.INK_CHROMIUM_PATH, '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable'].filter(Boolean).find(existsSync);
if (!chromium) {
  report.environment.reason = 'CHROMIUM_NOT_FOUND';
  await finish('BLOCKED_BY_ENVIRONMENT', 2);
} else {
  const webPort = await freePort();
  const debugPort = await freePort();
  const profile = await mkdtemp(path.join(os.tmpdir(), 'ink-health-'));
  let serverLog = '', browserLog = '';
  const server = spawn(process.execPath, ['scripts/serve.mjs', '--host', '127.0.0.1', '--port', String(webPort)], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', chunk => serverLog += chunk);
  server.stderr.on('data', chunk => serverLog += chunk);
  let browser;
  let browserConnection;
  let pageConnection;
  try {
    let serverReady = false;
    for (let i = 0; i < 80; i++) {
      try { if ((await fetch(`http://127.0.0.1:${webPort}/index.html`)).ok) { serverReady = true; break; } } catch {}
      await sleep(100);
    }
    check('local server responds', serverReady, { webPort });
    if (!serverReady) throw new Error('SERVER_START_FAILED');

    browser = spawn(chromium, [
      '--headless=new', '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu', '--no-first-run',
      `--remote-debugging-port=${debugPort}`, `--user-data-dir=${profile}`, 'about:blank'
    ], { stdio: ['ignore', 'ignore', 'pipe'] });
    browser.stderr.on('data', chunk => browserLog += chunk);

    let version;
    for (let i = 0; i < 100; i++) {
      try {
        const response = await fetch(`http://127.0.0.1:${debugPort}/json/version`);
        if (response.ok) { version = await response.json(); break; }
      } catch {}
      await sleep(50);
    }
    if (!version) throw new Error('CHROMIUM_CDP_START_FAILED');
    report.environment.chromium = version.Browser;
    browserConnection = new CDP(version.webSocketDebuggerUrl);
    const target = await browserConnection.send('Target.createTarget', { url: 'about:blank' });

    let page;
    for (let i = 0; i < 100; i++) {
      const targets = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      page = targets.find(item => item.id === target.targetId);
      if (page?.webSocketDebuggerUrl) break;
      await sleep(50);
    }
    if (!page?.webSocketDebuggerUrl) throw new Error('PAGE_TARGET_MISSING');

    pageConnection = new CDP(page.webSocketDebuggerUrl, message => {
      if (message.method === 'Runtime.exceptionThrown') report.pageExceptions.push(message.params.exceptionDetails?.exception?.description || message.params.exceptionDetails?.text || 'page exception');
      if (message.method === 'Runtime.consoleAPICalled' && message.params.type === 'error') report.criticalConsoleErrors.push(message.params.args?.map(arg => arg.value || arg.description || '').join(' ') || 'console.error');
    });
    await pageConnection.send('Runtime.enable');
    await pageConnection.send('Page.enable');
    await pageConnection.send('Page.navigate', { url: `http://127.0.0.1:${webPort}/index.html` });

    let state = {};
    for (let i = 0; i < 150; i++) {
      const result = await pageConnection.send('Runtime.evaluate', {
        expression: `JSON.stringify({href:location.href,ready:document.readyState,title:document.title,text:(document.body?.innerText||'').slice(0,160),stage:!!document.querySelector('#stage'),app:!!window.INK_STUDIO?.app,doc:!!window.INK_STUDIO?.app?.doc,studioVersion:window.INK_STUDIO?.version||null,aiVersion:window.INK_AI?.version||null})`,
        returnByValue: true
      });
      state = JSON.parse(result.result.value || '{}');
      if (state.href?.startsWith('chrome-error://')) break;
      if (state.ready === 'complete' && state.app) break;
      await sleep(100);
    }
    report.state = state;

    if (state.href?.startsWith('chrome-error://') && /blocked|organization/i.test(state.text || '')) {
      report.environment.reason = 'LOCAL_NAVIGATION_BLOCKED_BY_ORGANIZATION_POLICY';
      await finish('BLOCKED_BY_ENVIRONMENT', 2);
    } else {
      check('document ready', state.ready === 'complete', state);
      check('canvas exists', state.stage, state);
      check('INK Studio app initialized', state.app, state);
      check('document initialized', state.doc, state);
      check('page exception count = 0', report.pageExceptions.length === 0, { count: report.pageExceptions.length });
      check('critical console error count = 0', report.criticalConsoleErrors.length === 0, { count: report.criticalConsoleErrors.length });
      const passed = report.checks.every(item => item.passed);
      await finish(passed ? 'PASS' : 'FAIL', passed ? 0 : 1);
    }
  } catch (error) {
    report.error = String(error?.stack || error);
    report.environment.serverLogTail = serverLog.slice(-1200);
    report.environment.browserLogTail = browserLog.slice(-1200);
    await finish('FAIL', 1);
  } finally {
    try { await browserConnection?.send('Browser.close'); } catch {}
    pageConnection?.close();
    browserConnection?.close();
    try { server.kill('SIGTERM'); } catch {}
    try { browser?.kill('SIGTERM'); } catch {}
    await rm(profile, { recursive: true, force: true });
  }
}
