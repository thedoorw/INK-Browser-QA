// Manual batch only. Native Node HTTP server; no shell, Git or PowerShell dependency.
import assert from 'node:assert/strict';
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
const creativeRequired = [
  'CANVAS_EDITOR_RENDERED', 'CREATIVE_WORKSPACE_VISIBLE', 'REFERENCE_IMPORT_VISIBLE',
  'DIRECT_EXTRACTION_EXECUTED', 'EDITABLE_PATH_RESULT_VISIBLE', 'REFERENCE_OVERLAY_CONTROLLABLE',
  'PATH_EDIT_ENTERED', 'MUTATION_BLOCKED_BEFORE_APPROVAL', 'BOUNDED_EDIT_EXECUTED',
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

const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.wasm': 'application/wasm' };

export async function startServer(root, suite, onEvidence) {
  const site = path.join(root, 'product/source');
  const harness = await readFile(path.join(root, 'qa/runtime', suite.file));
  let delivered = false;
  const server = createServer(async (req, res) => {
    try {
      const url = new URL(req.url, 'http://127.0.0.1');
      res.setHeader('Cache-Control', 'no-store');
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
      if (url.pathname === '/__qa_harness.html') { bytes = harness; ext = '.html'; }
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
    const browser = findBrowser(); report.browser = browser;
    for (const suite of suites) {
      const entry = { id: suite.id, status: 'RUNNING' }; report.suites.push(entry);
      const profile = await mkdtemp(path.join(root, `profile-${suite.id}-`));
      let child; let server; let timer; let log;
      try {
        let receive;
        const result = new Promise(resolve => { receive = resolve; });
        const started = await startServer(root, suite, receive); server = started.server;
        for (const route of ['/', '/src/ink.js', '/styles.css', '/__qa_harness.html', '/__qa_rose_window.png']) {
          const response = await fetch(started.origin + route, { signal: AbortSignal.timeout(5000) });
          assert.equal(response.status, 200, `HTTP preflight: ${route}`);
          if (route.endsWith('.js')) assert.match(response.headers.get('content-type'), /javascript/);
          await response.arrayBuffer();
        }
        log = createWriteStream(path.join(evidenceDir, `${suite.id}-browser.log`));
        child = spawn(browser, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check', '--disable-extensions', '--disable-background-timer-throttling', '--disable-background-networking', `--user-data-dir=${profile}`, `${started.origin}/__qa_harness.html`], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        child.stdout.pipe(log, { end: false }); child.stderr.pipe(log, { end: false });
        const failure = new Promise((_, reject) => {
          child.once('error', reject);
          child.once('exit', (code, signal) => reject(new Error(`Browser exited before evidence: ${code}/${signal}`)));
          timer = setTimeout(() => reject(new Error('Harness timeout (240 seconds)')), 240000);
        });
        const evidence = await Promise.race([result, failure]);
        await writeFile(path.join(evidenceDir, `${suite.id}.json`), JSON.stringify(evidence, null, 2));
        validateEvidence(suite.id, evidence);
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
    // INK-WEB-UI-006 visual-closure evidence: capture the exact tested product UI
    // at the same 1280×1024 reference viewport used for Photoshop comparison.
    {
      const visualSuite = suites.find(s => s.id === 'ui');
      const started = await startServer(root, visualSuite, () => {});
      const visualProfile = await mkdtemp(path.join(root, 'profile-ui-visual-'));
      try {
        const shot = path.join(evidenceDir, 'ink-ui-latest-1280x1024.png');
        const child = spawn(browser, [
          '--headless=new',
          '--disable-gpu',
          '--no-first-run',
          '--no-default-browser-check',
          '--disable-extensions',
          '--disable-background-networking',
          '--hide-scrollbars',
          '--window-size=1280,1024',
          '--force-device-scale-factor=1',
          '--virtual-time-budget=5000',
          `--user-data-dir=${visualProfile}`,
          `--screenshot=${shot}`,
          `${started.origin}/index.html?fresh=1&ink-ui-visual-closure=1`
        ], { shell: false, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
        let stderr = '';
        child.stderr.on('data', chunk => { stderr += chunk.toString(); });
        const [code] = await once(child, 'exit');
        assert.equal(code, 0, `Visual screenshot Chrome exit: ${code} ${stderr}`);
        assert.ok((await stat(shot)).size > 10000, 'Visual screenshot artifact must be non-empty');
        report.visualEvidence = {
          file: 'ink-ui-latest-1280x1024.png',
          viewport: { width: 1280, height: 1024 },
          source: 'exact-tested-product'
        };
      } finally {
        started.server.closeAllConnections();
        await new Promise(resolve => started.server.close(resolve));
        await rm(visualProfile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
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
