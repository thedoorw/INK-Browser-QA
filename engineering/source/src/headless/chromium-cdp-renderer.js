import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import net from 'node:net';
import os from 'node:os';
import path from 'node:path';
import { decodePNG, encodePNG } from '../compare/png-codec.js';

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');

function stageError(code, stage, message, details = {}) {
  return Object.assign(new Error(`${code}:${message}`), { code, stage, details });
}

async function withTimeout(promise, timeoutMs, code, stage) {
  let timer;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(stageError(code, stage, `timeout after ${timeoutMs}ms`, { timeoutMs })), timeoutMs);
      })
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function freePort() {
  const server = net.createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise(resolve => server.close(resolve));
  return port;
}

async function waitForJson(url, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { cache: 'no-store' });
      if (response.ok) return await response.json();
      lastError = new Error(`HTTP_${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(50);
  }
  throw lastError || new Error('JSON_ENDPOINT_TIMEOUT');
}

class CdpConnection {
  constructor(url, { onEvent = () => {} } = {}) {
    if (typeof globalThis.WebSocket !== 'function') {
      throw stageError('INK_HEADLESS_NODE_WEBSOCKET_UNAVAILABLE', 'browser_connection', 'Node.js built-in WebSocket is required');
    }
    this.url = url;
    this.onEvent = onEvent;
    this.sequence = 0;
    this.pending = new Map();
    this.socket = new WebSocket(url);
    this.opened = new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', event => reject(stageError('INK_HEADLESS_CDP_CONNECT_FAILED', 'browser_connection', 'CDP WebSocket connection failed', { event: String(event) })), { once: true });
    });
    this.socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (message.id && this.pending.has(message.id)) {
        const pending = this.pending.get(message.id);
        this.pending.delete(message.id);
        if (message.error) pending.reject(stageError('INK_HEADLESS_CDP_COMMAND_FAILED', pending.method, message.error.message || 'CDP command failed', { cdpError: message.error }));
        else pending.resolve(message.result);
      } else if (message.method) {
        this.onEvent(message);
      }
    });
    this.socket.addEventListener('close', () => {
      for (const pending of this.pending.values()) pending.reject(stageError('INK_HEADLESS_CDP_CLOSED', pending.method, 'CDP connection closed before command completed'));
      this.pending.clear();
    });
  }

  async send(method, params = {}, timeoutMs = 10000) {
    await withTimeout(this.opened, timeoutMs, 'INK_HEADLESS_CDP_CONNECT_TIMEOUT', 'browser_connection');
    const id = ++this.sequence;
    const command = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject, method });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
    return withTimeout(command, timeoutMs, 'INK_HEADLESS_CDP_COMMAND_TIMEOUT', method);
  }

  close() {
    try { this.socket.close(); } catch {}
  }
}

export async function chromiumExecutable() {
  const candidates = [
    process.env.INK_CHROMIUM_PATH,
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable'
  ].filter(Boolean);
  const found = candidates.find(candidate => existsSync(candidate));
  if (!found) throw stageError('INK_HEADLESS_CHROMIUM_NOT_FOUND', 'process_start', 'No supported Chromium executable was found', { candidates });
  return found;
}

function renderDocument(html, { width, height, background }) {
  const backgroundCss = background === 'transparent' ? 'transparent' : '#ffffff';
  return `<!doctype html><html><head><meta charset="utf-8"><style>html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden;background:${backgroundCss};}svg{display:block;width:${width}px;height:${height}px}</style></head><body>${html}<script>(async()=>{try{if(document.fonts&&document.fonts.ready)await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));document.documentElement.dataset.inkRenderReady='true';}catch(error){document.documentElement.dataset.inkRenderError=String(error&&error.message||error);}})();</script></body></html>`;
}

function processSnapshot(child) {
  return { pid: child.pid, exitCode: child.exitCode, signalCode: child.signalCode, killed: child.killed };
}

export async function renderHtmlToPng(html, outputFile, {
  width,
  height,
  background = 'white',
  stageTimeoutMs = 10000,
  browserExitTimeoutMs = 3000,
  diagnosticsFile = null
} = {}) {
  if (!Number.isInteger(width) || width <= 0 || !Number.isInteger(height) || height <= 0) {
    throw stageError('INK_HEADLESS_DIMENSIONS_INVALID', 'validation', 'width and height must be positive integers', { width, height });
  }
  const startedAt = Date.now();
  const stages = [];
  const consoleMessages = [];
  const pageErrors = [];
  let stderr = '';
  let stdout = '';
  let child;
  let pageConnection;
  let browserConnection;
  let profileDirectory;
  let rendererVersion = null;
  let rawPngSha256 = null;
  const mark = (stage, status = 'PASS', details = {}) => stages.push({ stage, status, elapsedMs: Date.now() - startedAt, ...details });

  try {
    const executable = await chromiumExecutable();
    const port = await freePort();
    profileDirectory = await import('node:fs/promises').then(({ mkdtemp }) => mkdtemp(path.join(os.tmpdir(), 'ink-chromium-')));
    await mkdir(path.dirname(outputFile), { recursive: true });
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-background-networking',
      '--disable-default-apps',
      '--disable-extensions',
      '--disable-sync',
      '--hide-scrollbars',
      '--metrics-recording-only',
      '--no-first-run',
      '--no-default-browser-check',
      '--password-store=basic',
      '--use-mock-keychain',
      `--remote-debugging-port=${port}`,
      `--user-data-dir=${profileDirectory}`,
      'about:blank'
    ];
    child = spawn(executable, args, { stdio: ['ignore', 'pipe', 'pipe'], detached: true });
    child.stdout.on('data', chunk => { stdout += chunk; });
    child.stderr.on('data', chunk => { stderr += chunk; });
    child.on('error', error => { stderr += `\nPROCESS_ERROR:${error.stack || error.message}`; });
    mark('process_start', 'PASS', { executable, args, pid: child.pid });

    const version = await withTimeout(waitForJson(`http://127.0.0.1:${port}/json/version`, stageTimeoutMs), stageTimeoutMs, 'INK_HEADLESS_BROWSER_CONNECTION_TIMEOUT', 'browser_connection');
    rendererVersion = version.Browser || 'Unknown Chromium';
    mark('browser_connection', 'PASS', { rendererVersion, endpoint: version.webSocketDebuggerUrl });

    let targets = await withTimeout(waitForJson(`http://127.0.0.1:${port}/json/list`, stageTimeoutMs), stageTimeoutMs, 'INK_HEADLESS_TARGET_DISCOVERY_TIMEOUT', 'page_target');
    let page = targets.find(target => target.type === 'page');
    if (!page?.webSocketDebuggerUrl) {
      browserConnection = new CdpConnection(version.webSocketDebuggerUrl);
      await browserConnection.send('Target.createTarget',{url:'about:blank'},stageTimeoutMs);
      const deadline=Date.now()+stageTimeoutMs;
      while(Date.now()<deadline&&!page?.webSocketDebuggerUrl){await sleep(25);targets=await waitForJson(`http://127.0.0.1:${port}/json/list`,stageTimeoutMs);page=targets.find(target=>target.type==='page');}
    }
    if (!page?.webSocketDebuggerUrl) throw stageError('INK_HEADLESS_PAGE_TARGET_MISSING', 'page_target', 'No page target was available after Target.createTarget', { targets });
    mark('page_target', 'PASS', { targetId: page.id, initialUrl: page.url });

    pageConnection = new CdpConnection(page.webSocketDebuggerUrl, {
      onEvent(message) {
        if (message.method === 'Runtime.consoleAPICalled') consoleMessages.push(message.params);
        if (message.method === 'Runtime.exceptionThrown') pageErrors.push(message.params);
        if (message.method === 'Log.entryAdded') pageErrors.push(message.params.entry);
      }
    });
    await pageConnection.send('Page.enable', {}, stageTimeoutMs);
    await pageConnection.send('Runtime.enable', {}, stageTimeoutMs);
    await pageConnection.send('Log.enable', {}, stageTimeoutMs);
    await pageConnection.send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false, screenWidth: width, screenHeight: height }, stageTimeoutMs);
    if (background === 'transparent') {
      await pageConnection.send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } }, stageTimeoutMs);
    }
    mark('page_connection', 'PASS');

    const frameTree = await pageConnection.send('Page.getFrameTree', {}, stageTimeoutMs);
    const documentHtml = renderDocument(html, { width, height, background });
    await pageConnection.send('Page.setDocumentContent', { frameId: frameTree.frameTree.frame.id, html: documentHtml }, stageTimeoutMs);
    mark('document_injection', 'PASS', { htmlBytes: Buffer.byteLength(documentHtml) });

    const readyDeadline = Date.now() + stageTimeoutMs;
    let readyState = null;
    while (Date.now() < readyDeadline) {
      const evaluation = await pageConnection.send('Runtime.evaluate', {
        expression: `JSON.stringify({readyState:document.readyState,ready:document.documentElement.dataset.inkRenderReady||null,error:document.documentElement.dataset.inkRenderError||null,svgCount:document.querySelectorAll('svg').length})`,
        returnByValue: true
      }, stageTimeoutMs);
      readyState = JSON.parse(evaluation.result.value || '{}');
      if (readyState.error) throw stageError('INK_HEADLESS_RENDER_PAGE_ERROR', 'render_ready', readyState.error, { readyState });
      if (readyState.readyState === 'complete' && readyState.ready === 'true' && readyState.svgCount > 0) break;
      await sleep(25);
    }
    if (!(readyState?.readyState === 'complete' && readyState?.ready === 'true' && readyState?.svgCount > 0)) {
      throw stageError('INK_HEADLESS_RENDER_READY_TIMEOUT', 'render_ready', 'Render-ready signal was not observed', { readyState, timeoutMs: stageTimeoutMs });
    }
    mark('render_ready', 'PASS', readyState);

    mark('screenshot_start', 'PASS');
    const screenshot = await pageConnection.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false,
      clip: { x: 0, y: 0, width, height, scale: 1 }
    }, stageTimeoutMs);
    const rawPng = Buffer.from(screenshot.data, 'base64');
    rawPngSha256 = sha256(rawPng);
    const decoded = decodePNG(rawPng);
    if (decoded.width !== width || decoded.height !== height) {
      throw stageError('INK_HEADLESS_SCREENSHOT_DIMENSIONS_MISMATCH', 'png_validation', 'Chromium screenshot dimensions were incorrect', { expected: { width, height }, actual: { width: decoded.width, height: decoded.height } });
    }
    const canonicalPng = encodePNG(decoded);
    await writeFile(outputFile, canonicalPng);
    const written = await readFile(outputFile);
    const writtenStat = await stat(outputFile);
    mark('png_write', 'PASS', { bytes: writtenStat.size, rawPngSha256, sha256: sha256(written), width: decoded.width, height: decoded.height });

    browserConnection ||= new CdpConnection(version.webSocketDebuggerUrl);
    await browserConnection.send('Browser.close', {}, browserExitTimeoutMs).catch(() => null);
    const closeResult = await Promise.race([
      new Promise(resolve => child.once('close', (code, signal) => resolve({ code, signal, timedOut: false }))),
      sleep(browserExitTimeoutMs).then(() => ({ code: child.exitCode, signal: child.signalCode, timedOut: true }))
    ]);
    if (closeResult.timedOut) {
      try { process.kill(-child.pid, 'SIGTERM'); } catch {}
      await Promise.race([new Promise(resolve => child.once('close', resolve)), sleep(1000)]);
    }
    if (child.exitCode === null) {
      try { process.kill(-child.pid, 'SIGKILL'); } catch {}
      await Promise.race([new Promise(resolve => child.once('close', resolve)), sleep(1000)]);
    }
    mark('browser_exit', child.exitCode === 0 ? 'PASS' : 'PASS_WITH_FORCED_CLEANUP', { ...closeResult, process: processSnapshot(child) });

    const report = {
      format: 'INK-HEADLESS-PNG-REPORT',
      version: '1.0',
      status: 'PASS',
      renderer: 'CHROMIUM_CDP_CANONICAL_PNG',
      rendererVersion,
      outputFile,
      width,
      height,
      background,
      durationMs: Date.now() - startedAt,
      stages,
      consoleMessages,
      pageErrors,
      stderr,
      stdout
    };
    if (diagnosticsFile) await writeFile(diagnosticsFile, `${JSON.stringify(report, null, 2)}\n`);
    return report;
  } catch (error) {
    mark(error.stage || 'unknown', 'FAIL', { code: error.code || 'INK_HEADLESS_UNKNOWN', message: error.message, details: error.details || null });
    const report = {
      format: 'INK-HEADLESS-PNG-REPORT',
      version: '1.0',
      status: 'FAIL',
      renderer: 'CHROMIUM_CDP_CANONICAL_PNG',
      rendererVersion,
      outputFile,
      width,
      height,
      background,
      durationMs: Date.now() - startedAt,
      error: { code: error.code || 'INK_HEADLESS_UNKNOWN', stage: error.stage || null, message: error.message, details: error.details || null },
      stages,
      consoleMessages,
      pageErrors,
      stderr,
      stdout
    };
    if (diagnosticsFile) await writeFile(diagnosticsFile, `${JSON.stringify(report, null, 2)}\n`);
    throw Object.assign(error, { report });
  } finally {
    pageConnection?.close();
    browserConnection?.close();
    if (child && child.exitCode === null) {
      try { process.kill(-child.pid, 'SIGTERM'); } catch {}
      await Promise.race([new Promise(resolve => child.once('close', resolve)), sleep(1000)]);
      if (child.exitCode === null) {
        try { process.kill(-child.pid, 'SIGKILL'); } catch {}
      }
    }
    if (profileDirectory) await rm(profileDirectory, { recursive: true, force: true }).catch(() => null);
  }
}
