// Manual batch only. Native Node HTTP server; no shell, Git or PowerShell dependency.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, mkdtemp, rm, stat } from 'node:fs/promises';
import { existsSync, createWriteStream } from 'node:fs';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const suites = [
  { id: 'ui', file: 'ink-web-ui-001-harness.html' },
  { id: 'creative', file: 'ink-cloud-018-browser-harness.html' },
  { id: 'geometry', file: 'ink-ra-001-browser-harness.html' }
];
export const smartLoopRequired = [
  'SMART_LOOP_CAPABILITIES_DISCOVERED',
  'SMART_LOOP_REFERENCE_IMPORTED',
  'SMART_LOOP_IMPORT_HISTORY_PROVENANCE_RECORDED',
  'SMART_LOOP_COLOR_LINE_DECOMPOSED',
  'SMART_LOOP_STABLE_REFS_RETURNED',
  'SMART_LOOP_PREVIEW_BEFORE_CAPTURED',
  'SMART_LOOP_PREVIEW_BEFORE_MATERIALIZED',
  'SMART_LOOP_USE_INK_PROPOSE_MUTATION_NEUTRAL',
  'SMART_LOOP_USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL',
  'SMART_LOOP_USE_INK_APPROVED',
  'SMART_LOOP_TWO_STEP_REPAINT_EXECUTED',
  'SMART_LOOP_HISTORY_RECORDED',
  'SMART_LOOP_FINAL_REVISION_CAPTURED',
  'SMART_LOOP_PREVIEW_AFTER_CAPTURED',
  'SMART_LOOP_PREVIEW_AFTER_MATERIALIZED',
  'SMART_LOOP_RENDER_FINGERPRINT_CHANGED',
  'SMART_LOOP_ARTIFACT_EVIDENCE_READY',
];
const SMART_LOOP_RESOLVER_ROUTE = '/__qa_smart_loop_resolver.js';
const SMART_LOOP_RESOLVER_MODULE = [
  "import { resolveInkOutputPayload } from '/src/agent/output-handle-registry.js';",
  'window.__INK_SMART_LOOP_QA_RESOLVE = handleId => resolveInkOutputPayload(window.INK_APP, handleId);',
  ''
].join('\n');
const creativeRequired = [
  ...smartLoopRequired,
  'CANVAS_EDITOR_RENDERED', 'CREATIVE_WORKSPACE_VISIBLE', 'REFERENCE_IMPORT_VISIBLE',
  'DIRECT_EXTRACTION_EXECUTED', 'EDITABLE_PATH_RESULT_VISIBLE', 'REFERENCE_OVERLAY_CONTROLLABLE',
  'PATH_EDIT_ENTERED', 'MUTATION_BLOCKED_BEFORE_APPROVAL', 'BOUNDED_EDIT_EXECUTED',
  'USE_INK_TOOL_AVAILABLE', 'USE_INK_PROPOSE_MUTATION_NEUTRAL',
  'USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL', 'USE_INK_APPROVAL_TOKEN_ISSUED',
  'USE_INK_TWO_STEP_EXECUTION_ORDERED', 'USE_INK_HISTORY_RECORDED',
  'USE_INK_FINAL_REVISION_CAPTURED', 'USE_INK_UNSUPPORTED_ACTION_REJECTED',
  'USE_INK_FORBIDDEN_OPERATION_REJECTED', 'USE_INK_NO_AUTO_PREVIEW',
  'CHAT_DOCUMENT_CONTEXT_BOUND', 'CHAT_NATURAL_LANGUAGE_RESPONSE', 'CHAT_DISCUSSION_NON_MUTATING',
  'STRUCTURE_AWARE_EXECUTED', 'REVISION_RESTORE_EXECUTED', 'PROJECT_RELOAD_INTEGRITY',
  'WORKSTATION_PROPERTIES_UNAVAILABLE_STATE_EXPLICIT', 'WORKSTATION_PROPERTIES_GROUNDED_READOUT',
  'WORKSTATION_REFERENCE_RESEARCH_READOUT', 'WORKSTATION_REFERENCE_RESEARCH_READ_ONLY',
  'WORKSTATION_COMPOSE_UNAVAILABLE_STATE_EXPLICIT', 'WORKSTATION_COMPOSE_PARAMETRIC_STATUS',
  'WORKSTATION_CHAT_GROUNDED_READOUT', 'WORKSTATION_CHAT_MEMORY_READOUT',
  'WORKSTATION_CHAT_RESEARCH_READOUT', 'WORKSTATION_CHAT_ADVISORY_READ_ONLY',
  'WORKSTATION_REVISION_STRUCTURAL_COMPARE', 'WORKSTATION_REVISION_PROVENANCE_VISIBLE',
  'WORKSTATION_REVISION_COMPARE_READ_ONLY', 'WORKSTATION_SINGLE_PANEL_AUTHORITY',
  'CHAT_REFERENCE_HANDOFF_CROSS_REALM_BINARY_CONFIRMED', 'CHAT_REFERENCE_HANDOFF_NORMALIZED_LOCAL_FILE',
  'CHAT_REFERENCE_HANDOFF_INVALID_OBJECT_REJECTED',
  'CHAT_REFERENCE_HANDOFF_LIVENESS_SHORT_TIMEOUT_BOUND', 'CHAT_REFERENCE_HANDOFF_LIVENESS_INPUT_CONFIRMED',
  'CHAT_REFERENCE_HANDOFF_LIVENESS_NORMALIZATION_RETURNED', 'CHAT_REFERENCE_HANDOFF_LIVENESS_DECODER_ENTERED',
  'CHAT_REFERENCE_HANDOFF_LIVENESS_DECODER_RETURNED', 'CHAT_REFERENCE_HANDOFF_LIVENESS_REFERENCE_IMPORT_COMMITTED',
  'CHAT_REFERENCE_HANDOFF_LIVENESS_RECEIPT_RETURNED', 'CHAT_REFERENCE_HANDOFF_LIVENESS_SEQUENCE_COMPLETE',
  'CHAT_REFERENCE_HANDOFF_COMPLETED', 'CHAT_REFERENCE_HANDOFF_FILE_INPUT_UNTOUCHED_AFTER',
  'CHAT_REFERENCE_HANDOFF_OPERATION_RECORDED', 'CHAT_REFERENCE_HANDOFF_REFERENCE_OBJECT_VISIBLE',
  'CHAT_REFERENCE_HANDOFF_ACTOR_CHANNEL_METADATA', 'CHAT_REFERENCE_HANDOFF_SOURCE_IDENTITY_RETAINED',
  'CHAT_REFERENCE_HANDOFF_HISTORY_EXACTLY_ONE', 'CHAT_REFERENCE_HANDOFF_NO_AUTO_REVISION',
  'CHAT_REFERENCE_HANDOFF_NO_DOCUMENT_REPLACEMENT', 'CHAT_REFERENCE_HANDOFF_AUDIT_INSPECTABLE',
  'CHAT_REFERENCE_HANDOFF_PROVENANCE_INSPECTABLE', 'CHAT_REFERENCE_HANDOFF_RECEIPT_INSPECTABLE',
  'CHAT_REFERENCE_DECOMPOSITION_API_VISIBLE', 'CHAT_REFERENCE_DECOMPOSITION_COMPLETED',
  'CHAT_REFERENCE_DECOMPOSITION_BOUNDED_TRACE_RUNTIME', 'CHAT_REFERENCE_DECOMPOSITION_SOURCE_COORDINATE_MAPPING',
  'CHAT_REFERENCE_DECOMPOSITION_SOURCE_REFERENCE_RETAINED', 'CHAT_REFERENCE_DECOMPOSITION_REFERENCE_REMAINS',
  'CHAT_REFERENCE_DECOMPOSITION_SEPARATE_LAYERS', 'CHAT_REFERENCE_DECOMPOSITION_LAYER_ORDER',
  'CHAT_REFERENCE_DECOMPOSITION_EDITABLE_COLOR_REGIONS', 'CHAT_REFERENCE_DECOMPOSITION_EDITABLE_BOUNDARY_LINES',
  'CHAT_REFERENCE_DECOMPOSITION_BOUNDED_POST_COMMIT_SELECTION',
  'CHAT_REFERENCE_DECOMPOSITION_ALIGNED_REGION_GEOMETRY', 'CHAT_REFERENCE_DECOMPOSITION_PROVENANCE_LINKAGE',
  'CHAT_REFERENCE_DECOMPOSITION_RECEIPT_INSPECTABLE', 'CHAT_REFERENCE_DECOMPOSITION_HISTORY_RECORDED',
  'CHAT_REFERENCE_DECOMPOSITION_NO_AUTO_REVISION', 'CHAT_REFERENCE_DECOMPOSITION_AUDIT_INSPECTABLE',
  'CHAT_REFERENCE_DECOMPOSITION_PROVENANCE_INSPECTABLE',
  'MANUAL_REFERENCE_FILE_INPUT_STILL_AVAILABLE',
  'NO_FATAL_RUNTIME_HEALTH_ERRORS'
];

export function validateEvidence(id, evidence) {
  if (id === 'creative') {
    assert.equal(evidence.task, 'INK-CLOUD-018');
    assert.deepEqual(evidence.failures, []);
    assert.ok(Array.isArray(evidence.checks));
    assert.ok(evidence.checks.every(check => check.status === 'PASS'));
    for (const name of creativeRequired) assert.ok(evidence.checks.some(c => c.name === name), `Missing ${name}`);
  } else if (id === 'ui') {
    assert.equal(evidence.schema, 'INK-WEB-UI-001-BROWSER-QA-TRANSPORT');
    assert.equal(evidence.status, 'PASS');
    assert.equal(evidence.formatVersion, 4);
    assert.ok(!evidence.fatal);
    assert.ok(Array.isArray(evidence.checks) && evidence.checks.length >= 40, 'Full UI checks required');
    assert.ok(evidence.checks.every(check => check.pass === true));
    assert.equal(evidence.summary.total, evidence.checks.length);
    assert.equal(evidence.summary.passed, evidence.checks.length);
    assert.equal(evidence.summary.failed, 0);
  } else if (id === 'geometry') {
    assert.equal(evidence.status, 'PASS');
    assert.equal(evidence.formatVersion, 4);
    assert.equal(evidence.roseOutputSubpaths, 12);
    assert.equal(evidence.deterministicRepeat, true);
  } else throw new Error(`Unknown suite: ${id}`);
  return evidence;
}


const SMART_PNG_MAX_BYTES = 4 * 1024 * 1024;
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const UI_VISUAL_CAPTURES = Object.freeze([
  { file: 'ui-first-paint.png', width: 1280, height: 1024, kind: 'DELIVERED_FIRST_PAINT', disableScript: true },
  { file: 'ui-1280x1024.png', width: 1280, height: 1024, kind: 'RUNTIME_1280x1024', disableScript: false },
  { file: 'ui-960x800.png', width: 960, height: 800, kind: 'RUNTIME_960x800', disableScript: false }
]);
function assertSmartPng(bytes) {
  assert.ok(bytes.length >= 45 && bytes.length <= SMART_PNG_MAX_BYTES, 'Bounded PNG required');
  assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'PNG signature required');
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  assert.ok(width > 0 && height > 0 && width <= 960 && height <= 960, 'Smart preview dimensions must be bounded to 960');
  assert.equal(bytes.toString('ascii', bytes.length - 8, bytes.length - 4), 'IEND');
  return { width, height };
}

function assertUiPng(bytes, expectedWidth, expectedHeight) {
  assert.ok(bytes.length >= 45, 'UI PNG payload required');
  assert.ok(bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), 'UI PNG signature required');
  assert.equal(bytes.toString('ascii', 12, 16), 'IHDR');
  const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
  assert.deepEqual({ width, height }, { width: expectedWidth, height: expectedHeight }, 'UI capture dimensions must match requested viewport');
  assert.equal(bytes.toString('ascii', bytes.length - 8, bytes.length - 4), 'IEND');
  return { width, height };
}

function createCdpPipe(child) {
  const input = child.stdio?.[3];
  const output = child.stdio?.[4];
  assert.ok(input?.writable && output?.readable, 'CDP pipe transport unavailable');
  let nextId = 1;
  let buffer = Buffer.alloc(0);
  const pending = new Map();
  const eventWaiters = new Set();

  const rejectAll = error => {
    for (const entry of pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(error);
    }
    pending.clear();
    for (const waiter of eventWaiters) {
      clearTimeout(waiter.timer);
      waiter.reject(error);
    }
    eventWaiters.clear();
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
      catch (error) { rejectAll(new Error(`Invalid CDP payload: ${error.message}`)); continue; }

      if (message.id) {
        const entry = pending.get(message.id);
        if (!entry) continue;
        pending.delete(message.id);
        clearTimeout(entry.timer);
        if (message.error) entry.reject(new Error(`CDP ${entry.method} failed: ${message.error.code} ${message.error.message}`));
        else entry.resolve(message.result || {});
        continue;
      }

      for (const waiter of [...eventWaiters]) {
        if (waiter.method !== message.method) continue;
        if (waiter.sessionId && waiter.sessionId !== message.sessionId) continue;
        eventWaiters.delete(waiter);
        clearTimeout(waiter.timer);
        waiter.resolve(message.params || {});
      }
    }
  });
  output.once('error', rejectAll);
  output.once('close', () => rejectAll(new Error('CDP pipe closed before capture completed')));
  child.once('error', rejectAll);
  child.once('exit', (code, signal) => rejectAll(new Error(`Chrome exited during CDP capture: ${code}/${signal}`)));

  const send = (method, params = {}, sessionId = null, timeoutMs = 15000) => new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`CDP command timeout: ${method}`));
    }, timeoutMs);
    pending.set(id, { method, resolve, reject, timer });
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    input.write(JSON.stringify(message) + '\0');
  });

  const waitFor = (method, sessionId = null, timeoutMs = 15000) => new Promise((resolve, reject) => {
    const waiter = { method, sessionId, resolve, reject, timer: null };
    waiter.timer = setTimeout(() => {
      eventWaiters.delete(waiter);
      reject(new Error(`CDP event timeout: ${method}`));
    }, timeoutMs);
    eventWaiters.add(waiter);
  });

  return { send, waitFor };
}

async function captureUiVisual(browser, root, origin, evidenceDir, spec) {
  const output = path.join(evidenceDir, spec.file);
  const profile = await mkdtemp(path.join(root, 'profile-ui-visual-'));
  let child;
  let stderr = '';
  try {
    await rm(output, { force: true });
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--disable-background-networking',
      '--hide-scrollbars',
      '--remote-debugging-pipe',
      `--user-data-dir=${profile}`,
      'about:blank'
    ];
    child = spawn(browser, args, {
      shell: false,
      windowsHide: true,
      stdio: ['ignore', 'ignore', 'pipe', 'pipe', 'pipe']
    });
    child.stderr.on('data', chunk => { if (stderr.length < 8192) stderr += chunk.toString(); });

    const cdp = createCdpPipe(child);
    await cdp.send('Browser.getVersion');
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    assert.ok(targetId, `CDP target missing for ${spec.file}`);
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    assert.ok(sessionId, `CDP session missing for ${spec.file}`);

    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Emulation.setDeviceMetricsOverride', {
      width: spec.width,
      height: spec.height,
      deviceScaleFactor: 1,
      mobile: false
    }, sessionId);
    if (spec.disableScript) {
      await cdp.send('Emulation.setScriptExecutionDisabled', { value: true }, sessionId);
    }

    const loaded = cdp.waitFor('Page.loadEventFired', sessionId, 20000);
    const navigation = await cdp.send('Page.navigate', { url: `${origin}/` }, sessionId, 20000);
    assert.ok(!navigation.errorText, `CDP navigation failed for ${spec.file}: ${navigation.errorText}`);
    await loaded;
    if (!spec.disableScript) await new Promise(resolve => setTimeout(resolve, 1200));

    const layout = await cdp.send('Page.getLayoutMetrics', {}, sessionId);
    const viewport = layout.cssVisualViewport || layout.cssLayoutViewport;
    assert.ok(viewport, `CDP viewport missing for ${spec.file}`);
    assert.equal(Math.round(viewport.clientWidth), spec.width, `CDP viewport width mismatch for ${spec.file}`);
    assert.equal(Math.round(viewport.clientHeight), spec.height, `CDP viewport height mismatch for ${spec.file}`);

    const shot = await cdp.send('Page.captureScreenshot', {
      format: 'png',
      fromSurface: true,
      captureBeyondViewport: false
    }, sessionId, 30000);
    assert.ok(typeof shot.data === 'string' && shot.data.length > 0, `UI_CAPTURE_DATA_MISSING: ${spec.file}`);
    const bytes = Buffer.from(shot.data, 'base64');
    const pixelSize = assertUiPng(bytes, spec.width, spec.height);

    await writeFile(output, bytes);
    let persisted;
    try { persisted = await readFile(output); }
    catch (error) { throw new Error(`UI_CAPTURE_FILE_MISSING: ${spec.file}: ${error.message}`); }
    assert.equal(persisted.length, bytes.length, `UI capture persisted byte length mismatch: ${spec.file}`);
    assert.equal(sha256(persisted), sha256(bytes), `UI capture persisted SHA mismatch: ${spec.file}`);

    return {
      file: spec.file,
      kind: spec.kind,
      transport: 'BROWSER_NATIVE_CDP_PAGE_CAPTURE_SCREENSHOT',
      scriptMode: spec.disableScript ? 'DISABLED_DELIVERED_SHELL' : 'RUNTIME_ENABLED',
      pixelSize,
      byteLength: bytes.length,
      sha256: sha256(bytes)
    };
  } catch (error) {
    if (error?.message && !error.message.includes('stderr=')) {
      error.message += ` stderr=${stderr?.slice(-1200) || ''}`;
    }
    throw error;
  } finally {
    if (child && child.exitCode === null && child.signalCode === null) await stopBrowser(child);
    await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  }
}

/* Retired Runtime failure source: Chrome CLI --screenshot=${output} side effects are not used.
   Previous static-probe tokens retained as diagnostics only:
   BROWSER_NATIVE_HEADLESS_SCREENSHOT
   --blink-settings=scriptEnabled=false
   --window-size=${spec.width},${spec.height}
*/

export async function finalizeSmartLoopEvidence(root, evidence, testedSha) {
  assert.match(testedSha || '', /^[a-f0-9]{40}$/);
  for (const name of smartLoopRequired) {
    assert.ok(evidence.checks?.some(check => check.name === name && check.status === 'PASS'), `Missing ${name}`);
  }
  const proof = evidence.smartLoop;
  assert.equal(proof?.schema, 'INK-SMART-CLOSED-LOOP-PROOF');
  assert.equal(proof.version, 1);
  assert.equal(proof.returnPath, 'RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT');
  assert.equal(proof.fixture, 'qa/fixtures/rose-window/rose-window-primary.png');
  assert.equal(proof.source.sha256, sha256(await readFile(path.join(root, proof.fixture))));
  assert.equal(proof.importHistory.commit.valid, true);
  assert.equal(proof.importProvenance.status, 'AVAILABLE');
  assert.ok(proof.importProvenance.eventIds.length > 0);
  assert.equal(proof.decompositionHistory.commit.valid, true);
  assert.equal(proof.proposalStatus, 'PROPOSED');
  assert.equal(proof.blockedCode, 'CHAT_PLAN_APPROVAL_REQUIRED');
  assert.equal(proof.approval.status, 'APPROVED');
  assert.equal(proof.executionStatus, 'COMPLETED');
  assert.ok(proof.planId);
  assert.deepEqual(proof.plan.steps.map(step => step.operation), ['path.repaint.v1', 'path.repaint.v1']);
  assert.deepEqual(proof.stepResults.map(step => step.stepId), proof.plan.steps.map(step => step.stepId));
  assert.ok(proof.stepResults.every(step => step.ok === true && step.changed === true));
  assert.deepEqual(proof.plan.steps.map(step => step.targets), [[proof.targets.color], [proof.targets.line]]);
  assert.ok(proof.colorRefs.some(ref => JSON.stringify(ref) === JSON.stringify(proof.targets.color)));
  assert.ok(proof.lineRefs.some(ref => JSON.stringify(ref) === JSON.stringify(proof.targets.line)));
  assert.notEqual(proof.targets.color.layerId, proof.targets.line.layerId);
  assert.equal(proof.historyReceipt.steps.length, 2);
  assert.ok(proof.historyReceipt.steps.every(step => step.history));
  assert.ok(proof.revisionReceipt.endingRevisionId);
  assert.notEqual(proof.revisionReceipt.startingRevisionId, proof.revisionReceipt.endingRevisionId);
  assert.equal(proof.revisionReceipt.captureSkipped, null);
  const evidenceDir = path.join(root, 'evidence');
  for (const phase of ['before', 'after']) {
    const artifact = proof.artifacts[phase];
    assert.equal(artifact.file, `smart-loop-${phase}.png`);
    const bytes = await readFile(path.join(evidenceDir, artifact.file));
    assert.deepEqual(assertSmartPng(bytes), artifact.handle.pixelSize);
    assert.equal(bytes.length, artifact.byteLength);
    assert.equal(bytes.length, artifact.handle.byteLength);
    assert.equal(sha256(bytes), artifact.sha256);
    assert.equal(artifact.handle.schema, 'INK_OUTPUT_HANDLE');
    assert.equal(artifact.handle.documentId, proof.documentId);
    assert.equal(artifact.handle.pageId, proof.pageId);
    assert.equal(artifact.handle.transport, 'INTERNAL_EPHEMERAL');
  }
  assert.equal(proof.artifacts.after.handle.revisionId, proof.revisionReceipt.endingRevisionId);
  assert.notEqual(proof.artifacts.before.sha256, proof.artifacts.after.sha256);
  assert.notEqual(proof.artifacts.before.handle.renderFingerprint, proof.artifacts.after.handle.renderFingerprint);
  const record = { ...proof, testedSha, status: 'PASS', checks: evidence.checks.filter(check => smartLoopRequired.includes(check.name)) };
  await writeFile(path.join(evidenceDir, 'smart-loop.json'), JSON.stringify(record, null, 2));
  return record;
}

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm' };

export async function startServer(root, suite, onEvidence, { evidenceDir = null } = {}) {
  const site = path.join(root, 'product/source');
  const harness = await readFile(path.join(root, 'qa/runtime', suite.file));
  let delivered = false;
  const smartWritten = new Set();
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      res.setHeader('Cache-Control', 'no-store');
      // QA-only, loopback-bound, two fixed artifact names; never a product transport.
      if (url.pathname.startsWith('/__qa_smart_loop/')) {
        const phase = url.pathname.slice('/__qa_smart_loop/'.length);
        if (suite.id !== 'creative' || !evidenceDir || !['before', 'after'].includes(phase)) {
          res.writeHead(404).end(); return;
        }
        if (req.method !== 'POST') { res.writeHead(405).end(); return; }
        if (delivered || smartWritten.has(phase)) { res.writeHead(409).end(); return; }
        if (req.headers['content-type'] !== 'image/png') { res.writeHead(415).end(); return; }
        smartWritten.add(phase);
        const chunks = []; let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > SMART_PNG_MAX_BYTES) { res.writeHead(413).end(); return; }
          chunks.push(chunk);
        }
        const bytes = Buffer.concat(chunks);
        assertSmartPng(bytes);
        const file = `smart-loop-${phase}.png`;
        await mkdir(evidenceDir, { recursive: true });
        await writeFile(path.join(evidenceDir, file), bytes);
        res.setHeader('Content-Type', 'application/json');
        res.writeHead(200).end(JSON.stringify({ file, byteLength: bytes.length, sha256: sha256(bytes) }));
        return;
      }
      if (url.pathname === '/__qa_result' && req.method === 'POST') {
        if (delivered) { res.writeHead(409).end(); return; }
        const chunks = []; let size = 0;
        for await (const chunk of req) {
          size += chunk.length;
          if (size > 2 * 1024 * 1024) { res.writeHead(413).end(); return; }
          chunks.push(chunk);
        }
        const body = Buffer.concat(chunks).toString('utf8');
        const evidence = JSON.parse(suite.id === 'creative' ? Buffer.from(body, 'base64').toString('utf8') : body);
        delivered = true;
        res.writeHead(200).end('OK');
        onEvidence(evidence);
        return;
      }
      if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
      let bytes; let ext;
      if (url.pathname === SMART_LOOP_RESOLVER_ROUTE) {
        if (suite.id !== 'creative') { res.writeHead(404).end(); return; }
        bytes = Buffer.from(SMART_LOOP_RESOLVER_MODULE, 'utf8'); ext = '.js';
      }
      else if (url.pathname === '/__qa_harness.html') { bytes = harness; ext = '.html'; }
      else {
        const decoded = decodeURIComponent(url.pathname);
        if (decoded.includes('\\') || decoded.includes('\0')) { res.writeHead(403).end(); return; }
        const dest = decoded === '/__qa_rose_window.png'
          ? path.join(root, 'qa/fixtures/rose-window/rose-window-primary.png')
          : path.resolve(site, '.' + (decoded === '/' ? '/index.html' : decoded));
        if (decoded !== '/__qa_rose_window.png' && !dest.startsWith(site + path.sep)) { res.writeHead(403).end(); return; }
        if (!(await stat(dest)).isFile()) { res.writeHead(404).end(); return; }
        bytes = await readFile(dest); ext = path.extname(dest);
      }
      res.setHeader('Content-Type', mime[ext] || 'application/octet-stream');
      res.writeHead(200).end(req.method === 'HEAD' ? undefined : bytes);
    } catch (error) {
      res.writeHead(error.code === 'ENOENT' ? 404 : 400).end('Request failed');
    }
  });
  server.requestTimeout = 15000;
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, origin: `http://127.0.0.1:${server.address().port}` };
}

function findBrowser() {
  const candidates = [process.env.INK_CHROMIUM_PATH, process.env.CHROME_PATH];
  for (const base of [process.env.ProgramFiles, process.env['ProgramFiles(x86)'], process.env.LOCALAPPDATA].filter(Boolean)) {
    candidates.push(path.join(base, 'Google/Chrome/Application/chrome.exe'), path.join(base, 'Microsoft/Edge/Application/msedge.exe'));
  }
  const found = candidates.find(file => file && existsSync(file));
  if (!found) throw new Error('Installed Chrome/Edge required; set INK_CHROMIUM_PATH');
  return found;
}

async function stopBrowser(child) {
  if (!child?.pid) return;
  if (process.platform === 'win32') {
    // Only terminate the browser tree launched for this suite, never by image name.
    const killer = spawn(path.join(process.env.SystemRoot, 'System32/taskkill.exe'), ['/PID', String(child.pid), '/T', '/F'], { shell: false, windowsHide: true, stdio: 'ignore' });
    await new Promise((resolve, reject) => { killer.once('error', reject); killer.once('exit', resolve); });
  } else if (child.exitCode === null && child.signalCode === null) {
    child.kill('SIGKILL');
    await once(child, 'exit');
  }
}

export async function runBatch(root) {
  const evidenceDir = path.join(root, 'evidence');
  await mkdir(evidenceDir, { recursive: true });
  const report = { status: 'RUNNING', testedSha: process.env.INK_TESTED_SHA, workflowSha: process.env.INK_WORKFLOW_SHA, runner: process.env.RUNNER_NAME, suites: [] };
  try {
    assert.match(report.testedSha || '', /^[a-f0-9]{40}$/, 'Exact tested SHA required');
    assert.match(await readFile(path.join(root, 'product/source/src/config.js'), 'utf8'), /FORMAT_VERSION\s*=\s*4\b/);
    for (const name of ['smart-loop-before.png', 'smart-loop-after.png', 'smart-loop.json', ...UI_VISUAL_CAPTURES.map(item => item.file)]) {
      await rm(path.join(evidenceDir, name), { force: true });
    }
    const browser = findBrowser(); report.browser = browser;
    for (const suite of suites) {
      const entry = { id: suite.id, status: 'RUNNING' }; report.suites.push(entry);
      const profile = await mkdtemp(path.join(root, `profile-${suite.id}-`));
      let child; let server; let timer; let log;
      try {
        let receive;
        const result = new Promise(resolve => { receive = resolve; });
        const started = await startServer(root, suite, receive, { evidenceDir }); server = started.server;
        const preflightRoutes = ['/', '/src/ink.js', '/styles.css', '/__qa_harness.html', '/__qa_rose_window.png'];
        if (suite.id === 'creative') preflightRoutes.push(SMART_LOOP_RESOLVER_ROUTE);
        for (const route of preflightRoutes) {
          const response = await fetch(started.origin + route, { signal: AbortSignal.timeout(5000) });
          assert.equal(response.status, 200, `HTTP preflight: ${route}`);
          if (route.endsWith('.js')) assert.match(response.headers.get('content-type'), /javascript/);
          await response.arrayBuffer();
        }
        if (suite.id === 'ui') {
          entry.visualCaptures = [];
          for (const spec of UI_VISUAL_CAPTURES) {
            entry.visualCaptures.push(await captureUiVisual(browser, root, started.origin, evidenceDir, spec));
          }
          report.uiVisualEvidence = entry.visualCaptures;
        }
        log = createWriteStream(path.join(evidenceDir, `${suite.id}-browser.log`));
        child = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-timer-throttling', '--disable-background-networking', `--user-data-dir=${profile}`, `${started.origin}/__qa_harness.html`], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.pipe(log, { end: false }); child.stderr.pipe(log, { end: false });
        const failure = new Promise((_, reject) => {
          child.once('error', reject);
          child.once('exit', (code, signal) => reject(new Error(`Browser exited before evidence: ${code}/${signal}`)));
          timer = setTimeout(() => reject(new Error('Harness timeout (360 seconds)')), 360000);
        });
        const evidence = await Promise.race([result, failure]);
        await writeFile(path.join(evidenceDir, `${suite.id}.json`), JSON.stringify(evidence, null, 2));
        validateEvidence(suite.id, evidence);
        if (suite.id === 'creative') await finalizeSmartLoopEvidence(root, evidence, report.testedSha);
        entry.status = 'PASS';
      } catch (error) {
        entry.status = 'FAIL'; entry.error = String(error.stack || error); throw error;
      } finally {
        clearTimeout(timer);
        try { await stopBrowser(child); }
        finally {
          if (log) { log.end(); await once(log, 'finish'); }
          if (server) { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); }
          await rm(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
        }
      }
    }
    report.status = 'PASS';
  } catch (error) {
    report.status = 'FAIL'; report.error = String(error.stack || error); process.exitCode = 1;
  } finally {
    await writeFile(path.join(evidenceDir, 'batch.json'), JSON.stringify(report, null, 2));
    console.log(JSON.stringify(report, null, 2));
    if (process.env.GITHUB_STEP_SUMMARY) {
      const { appendFile } = await import('node:fs/promises');
      await appendFile(process.env.GITHUB_STEP_SUMMARY, `\nBatch result: **${report.status}**\n\n${report.suites.map(s => `- ${s.id}: ${s.status}`).join('\n')}\n`);
    }
  }
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runBatch(path.resolve(process.argv[2] || '.'));
}
