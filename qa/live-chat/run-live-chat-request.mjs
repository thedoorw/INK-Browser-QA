import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';

const LIVE_URL = 'https://thedoorw.github.io/INK/';

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH];
  if (process.platform === 'win32') {
    for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
      candidates.push(
        path.join(base, 'Google/Chrome/Application/chrome.exe'),
        path.join(base, 'Microsoft/Edge/Application/msedge.exe')
      );
    }
  } else {
    candidates.push(
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
      '/opt/google/chrome/chrome'
    );
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Installed Chrome/Chromium required; set INK_CHROMIUM_PATH');
  return found;
}

async function stopBrowser(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    const killer = spawn(
      path.join(process.env.SystemRoot, 'System32/taskkill.exe'),
      ['/PID', String(child.pid), '/T', '/F'],
      { shell: false, windowsHide: true, stdio: 'ignore' }
    );
    await new Promise(resolve => {
      killer.once('error', resolve);
      killer.once('exit', resolve);
    });
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
}

function cdpPipe(child) {
  const input = child.stdio?.[3];
  const output = child.stdio?.[4];
  assert.ok(input?.writable && output?.readable, 'CDP pipe unavailable');
  let nextId = 1;
  let buffer = Buffer.alloc(0);
  const pending = new Map();

  const failAll = error => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(error);
    }
    pending.clear();
  };

  output.on('data', chunk => {
    buffer = Buffer.concat([buffer, chunk]);
    while (true) {
      const boundary = buffer.indexOf(0);
      if (boundary < 0) break;
      const raw = buffer.subarray(0, boundary).toString('utf8');
      buffer = buffer.subarray(boundary + 1);
      if (!raw) continue;
      let message;
      try { message = JSON.parse(raw); }
      catch (error) { failAll(error); continue; }
      if (!message.id) continue;
      const entry = pending.get(message.id);
      if (!entry) continue;
      pending.delete(message.id);
      clearTimeout(entry.timer);
      if (message.error) entry.reject(new Error(`${entry.method}: ${message.error.message}`));
      else entry.resolve(message.result || {});
    }
  });
  output.once('error', failAll);
  output.once('close', () => failAll(new Error('CDP pipe closed')));

  const send = (method, params = {}, sessionId = null, timeoutMs = 30000) => new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP timeout: ${method}`));
    }, timeoutMs);
    pending.set(id, { method, resolve, reject, timer });
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    input.write(JSON.stringify(message) + '\0');
  });

  return { send };
}

async function waitForInk(cdp, sessionId, expectedSourceSha) {
  const started = Date.now();
  let last = null;
  while (Date.now() - started < 30000) {
    const probe = await cdp.send('Runtime.evaluate', {
      expression: `(() => ({
        href: location.href,
        readyState: document.readyState,
        apiReady: Boolean(window.INK_APP?.inkPublicApi?.tools?.invoke),
        sourceSha: document.querySelector('meta[name="ink-live-source-sha"]')?.content || null,
        toolCount: window.INK_APP?.inkPublicApi?.tools?.registry?.().length || 0
      }))()`,
      returnByValue: true,
      awaitPromise: false
    }, sessionId, 5000);
    last = probe.result?.value || null;
    if (last?.href === LIVE_URL && last?.readyState === 'complete' && last?.apiReady) {
      if (expectedSourceSha) assert.equal(last.sourceSha, expectedSourceSha, 'Live source SHA mismatch');
      return last;
    }
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  let diagnostics = null;
  try {
    const probe = await cdp.send('Runtime.evaluate', {
      expression: `(() => ({
        errors: Array.isArray(window.__INK_QA_ERRORS__) ? window.__INK_QA_ERRORS__.slice(-20) : [],
        scripts: [...document.scripts].map(script => ({ type: script.type || null, src: script.src || null })),
        resources: performance.getEntriesByType('resource').map(entry => ({
          name: entry.name,
          initiatorType: entry.initiatorType,
          duration: Math.round(entry.duration),
          transferSize: entry.transferSize || 0
        })).filter(entry => /INK-Browser-QA|jsdelivr|src\\/ink|web-shell|studio-core|public-creative-api|chat-bounded-edit|capability-registry/.test(entry.name)).slice(-80)
      }))()`,
      returnByValue: true,
      awaitPromise: false
    }, sessionId, 5000);
    diagnostics = probe.result?.value || null;
  } catch {}
  throw new Error(`INK live readiness timeout: ${JSON.stringify(last)} diagnostics=${JSON.stringify(diagnostics)}`);
}

function validateRequest(request) {
  assert.equal(request?.liveUrl, LIVE_URL, 'Unsupported live URL');
  assert.match(String(request?.requestId || ''), /^[A-Za-z0-9_.:-]{1,120}$/);
  const hasSingle = typeof request?.tool === 'string';
  const hasSteps = Array.isArray(request?.steps) && request.steps.length > 0;
  assert.ok(hasSingle !== hasSteps, 'Request must contain exactly one of tool or steps');
  if (hasSingle) {
    assert.match(String(request.tool), /^[a-z0-9_]{1,80}$/);
    assert.ok(request?.input == null || (typeof request.input === 'object' && !Array.isArray(request.input)), 'input must be an object');
  }
  if (hasSteps) {
    assert.ok(request.steps.length <= 32, 'Too many steps');
    const ids = new Set();
    for (const step of request.steps) {
      assert.match(String(step?.id || ''), /^[A-Za-z0-9_.:-]{1,80}$/);
      assert.ok(!ids.has(step.id), 'Duplicate step id');
      ids.add(step.id);
      assert.match(String(step?.tool || ''), /^[a-z0-9_]{1,80}$/);
      assert.ok(step?.input == null || (typeof step.input === 'object' && !Array.isArray(step.input)), 'step input must be an object');
      if (step.file != null) {
        assert.ok(['import_ink_reference','import_ink_raster'].includes(step.tool), 'file payload is only allowed for import_ink_reference or import_ink_raster');
        assert.ok(step.file && typeof step.file === 'object' && !Array.isArray(step.file), 'step file must be an object');
        assert.match(String(step.file.path || ''), /^qa\/fixtures\/[A-Za-z0-9._\/-]+$/);
        assert.ok(!String(step.file.path).includes('..'), 'fixture path traversal rejected');
        assert.match(String(step.file.name || ''), /^[A-Za-z0-9._-]{1,120}$/);
        assert.ok(['image/png','image/jpeg','image/webp'].includes(String(step.file.type || '')), 'unsupported fixture MIME type');
      }
    }
  }
  if (request?.expectedSourceSha) assert.match(String(request.expectedSourceSha), /^[a-f0-9]{40}$/);
  return request;
}

function valueAtPath(root, pathText) {
  const parts = String(pathText || '').split('.').filter(Boolean);
  let value = root;
  for (const part of parts) {
    if (value == null || !Object.prototype.hasOwnProperty.call(Object(value), part)) {
      throw new Error('INK_SEQUENCE_REF_NOT_FOUND:' + pathText);
    }
    value = value[part];
  }
  return value;
}

function resolveRefs(value, results) {
  if (Array.isArray(value)) return value.map(item => resolveRefs(item, results));
  if (!value || typeof value !== 'object') return value;
  if (Object.keys(value).length === 1 && typeof value.$ref === 'string') {
    const [stepId, ...rest] = value.$ref.split('.');
    if (!results.has(stepId)) throw new Error('INK_SEQUENCE_STEP_NOT_FOUND:' + stepId);
    return valueAtPath(results.get(stepId), rest.join('.'));
  }
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolveRefs(item, results)]));
}

async function run() {
  const requestPath = path.resolve(process.argv[2]);
  const outputPath = path.resolve(process.argv[3]);
  const screenshotPath = path.resolve(process.argv[4]);
  const request = validateRequest(JSON.parse(await readFile(requestPath, 'utf8')));
  const browser = findBrowser();
  const profile = await mkdtemp(path.join(process.env.RUNNER_TEMP || '.', 'ink-live-chat-'));
  let child;
  let stderr = '';
  try {
    child = spawn(browser, [
      '--headless=new',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--remote-debugging-pipe',
      `--user-data-dir=${profile}`,
      'about:blank'
    ], {
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']
    });
    child.stderr.on('data', chunk => {
      if (stderr.length < 12000) stderr += chunk.toString();
    });

    const cdp = cdpPipe(child);
    await cdp.send('Browser.getVersion');
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Page.addScriptToEvaluateOnNewDocument', {
      source: `window.__INK_QA_ERRORS__ = [];
        addEventListener('error', event => {
          window.__INK_QA_ERRORS__.push({
            type: 'error',
            message: event.message || null,
            source: event.filename || null,
            line: event.lineno || null,
            column: event.colno || null
          });
        });
        addEventListener('unhandledrejection', event => {
          const reason = event.reason;
          window.__INK_QA_ERRORS__.push({
            type: 'unhandledrejection',
            message: reason?.message || String(reason || ''),
            stack: reason?.stack || null
          });
        });`
    }, sessionId);

    const nav = await cdp.send('Page.navigate', { url: LIVE_URL }, sessionId, 30000);
    assert.ok(!nav.errorText, nav.errorText || 'Navigation failed');
    const identity = await waitForInk(cdp, sessionId, request.expectedSourceSha || null);

    const invoke = async (tool, input = {}, fileSpec = null) => {
      let file = null;
      if (fileSpec) {
        const root = path.resolve(process.cwd());
        const fixtureRoot = path.resolve(root, 'qa/fixtures') + path.sep;
        const filePath = path.resolve(root, fileSpec.path);
        assert.ok(filePath.startsWith(fixtureRoot), 'Fixture path outside qa/fixtures');
        const bytes = await readFile(filePath);
        assert.ok(bytes.length > 0 && bytes.length <= 8 * 1024 * 1024, 'Fixture byte size out of bounds');
        file = {
          name: fileSpec.name,
          type: fileSpec.type,
          base64: bytes.toString('base64')
        };
      }
      const payload = Buffer.from(JSON.stringify({ tool, input, file }), 'utf8').toString('base64');
      const execution = await cdp.send('Runtime.evaluate', {
        expression: `(async () => {
          const request = JSON.parse(atob(${JSON.stringify(payload)}));
          const api = window.INK_APP?.inkPublicApi;
          if (!api?.tools?.invoke || !api?.tools?.registry) throw new Error('INK_PUBLIC_API_UNAVAILABLE');
          const names = api.tools.registry().map(item => item.name);
          if (!names.includes(request.tool)) throw new Error('INK_NAMED_TOOL_NOT_FOUND:' + request.tool);
          let toolInput = request.input || {};
          if (request.file) {
            const raw = atob(request.file.base64);
            const bytes = new Uint8Array(raw.length);
            for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
            const file = new File([bytes], request.file.name, { type: request.file.type });
            toolInput = { ...toolInput, input: { file } };
          }
          return await Promise.resolve(api.tools.invoke(request.tool, toolInput));
        })()`,
        returnByValue: true,
        awaitPromise: true
      }, sessionId, 60000);
      if (execution.exceptionDetails) {
        throw new Error(execution.exceptionDetails.text || 'INK tool execution failed');
      }
      return execution.result?.value ?? null;
    };

    let executionResult;
    if (Array.isArray(request.steps)) {
      const results = new Map();
      const steps = [];
      for (const step of request.steps) {
        const input = resolveRefs(step.input || {}, results);
        const result = await invoke(step.tool, input, step.file || null);
        results.set(step.id, result);
        steps.push({ id: step.id, tool: step.tool, result });
        if (result?.status === 'FAILED' && step.allowFailure !== true) {
          throw new Error('INK_SEQUENCE_STEP_FAILED:' + step.id + ':' + (result.diagnostics?.[0]?.code || 'UNKNOWN'));
        }
      }
      executionResult = { steps };
    } else {
      executionResult = await invoke(request.tool, request.input || {});
    }

    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false
    }, sessionId, 30000);
    await mkdir(path.dirname(screenshotPath), { recursive: true });
    await writeFile(screenshotPath, Buffer.from(shot.data, 'base64'));

    const result = {
      schema: 'INK-LIVE-CHAT-RESULT',
      version: 1,
      requestId: request.requestId,
      tool: request.tool || null,
      liveUrl: LIVE_URL,
      expectedSourceSha: request.expectedSourceSha || null,
      runtimeIdentity: identity,
      result: executionResult,
      status: 'COMPLETED'
    };
    await writeFile(outputPath, JSON.stringify(result, null, 2));
  } catch (error) {
    const result = {
      schema: 'INK-LIVE-CHAT-RESULT',
      version: 1,
      requestId: request?.requestId || null,
      tool: request?.tool || null,
      liveUrl: LIVE_URL,
      status: 'FAILED',
      error: error?.message || String(error),
      stderr: stderr.slice(-4000)
    };
    await writeFile(outputPath, JSON.stringify(result, null, 2));
    process.exitCode = 1;
  } finally {
    await stopBrowser(child);
    await rm(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 150 });
  }
}

await run();
