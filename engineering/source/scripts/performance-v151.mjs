import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createBrotliDecompress } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { performance } from 'node:perf_hooks';
import { chromium } from 'playwright-core';
import { defaultDocument } from '../src/document/model.js';
import { AICommandLayer } from '../src/ai/ai-core.js';
import { createChatRuntime } from '../src/ai/chat-runtime.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.join(root, 'reports', 'v1.5.1-rc');
await mkdir(output, { recursive: true });
const measure = async (name, work, iterations = 1) => {
  const samples = [];
  for (let index = 0; index < iterations; index++) { const start = performance.now(); await work(index); samples.push(performance.now() - start); }
  samples.sort((a, b) => a - b);
  return { name, iterations, averageMs: samples.reduce((sum, value) => sum + value, 0) / samples.length, p95Ms: samples[Math.min(samples.length - 1, Math.floor(samples.length * .95))], p99Ms: samples[Math.min(samples.length - 1, Math.floor(samples.length * .99))], maximumMs: samples.at(-1) };
};

const startup = await measure('Standard Mode runtime initialization', () => { const layer = new AICommandLayer(); layer.setDocument(defaultDocument()); createChatRuntime(layer, { fetchImpl: async () => { throw new Error('network forbidden'); } }); }, 50);
const layer = new AICommandLayer(); layer.setDocument(defaultDocument());
const runtime = createChatRuntime(layer, { fetchImpl: async () => { throw new Error('network forbidden'); } });
runtime.manager.setMode('LOCAL_ONLY');
const contextSummary = await measure('Document Summary Context build', () => runtime.contextBuilder.build({ level: 'DOCUMENT_SUMMARY', includeHistory: true, tokenBudget: 12000 }), 100);
const contextDetailed = await measure('Detailed Context build', index => runtime.contextBuilder.build({ level: 'DETAILED_CONTEXT', userApprovedDetailed: true, includeHistory: true, tokenBudget: 64000, documentVersion: `benchmark-${index}` }), 40);
const steps100 = Array.from({ length: 100 }, (_, index) => ({ stepId: `step-${index + 1}`, operation: 'layer.rename', target: layer.currentDocument().pages[0].layers[0].id, parameters: { name: `Layer ${index + 1}` } }));
const plan = layer.createPlanFromSteps('100 Steps Plan rendering benchmark', steps100, { confidence: .99, seed: 1510 });
const preview10 = await measure('Preview 100 Steps × 10', () => { const preview = layer.preview(plan.recipeDraft.recipeId); layer.previewEngine.discard(preview.previewId); }, 10);
const audit1000 = await measure('Audit 1,000 records', () => { for (let index = 0; index < 1000; index++) layer.audit.add({ permissionLevel: 'OBSERVE', commands: ['get_document_summary'], duration: index % 4, securityEvents: ['SAFE'] }); });
const auditSerialize = await measure('Audit 1,000 serialization', () => JSON.stringify(layer.audit.list()), 30);
const saveLoad = await measure('Save/Load current .ink JSON', () => JSON.parse(JSON.stringify(layer.currentDocument())), 50);

const browserHome = path.join(root, '.browser-home-v151-performance');
const chromiumBin = path.join(root, 'node_modules', '@sparticuz', 'chromium', 'bin');
await mkdir(path.join(browserHome, '.cache', 'fontconfig'), { recursive: true });
process.env.HOME = browserHome; process.env.FONTCONFIG_PATH = process.env.FONTCONFIG_PATH || '/etc/fonts';
const extractTar = async (file, destination) => { await mkdir(destination, { recursive: true }); await new Promise((resolve, reject) => { const tar = spawn('tar', ['-xf', '-', '--no-same-owner', '-C', destination], { stdio: ['pipe', 'ignore', 'pipe'] }); const errors = []; tar.stderr.on('data', chunk => errors.push(chunk)); tar.on('error', reject); tar.on('close', code => code === 0 ? resolve() : reject(new Error(Buffer.concat(errors).toString()))); createReadStream(file).pipe(createBrotliDecompress()).pipe(tar.stdin); }); };
if (!existsSync('/tmp/libGLESv2.so')) await extractTar(path.join(chromiumBin, 'swiftshader.tar.br'), '/tmp');
if (!existsSync('/tmp/al2023')) await extractTar(path.join(chromiumBin, 'al2023.tar.br'), '/tmp/al2023');
if (!existsSync('/tmp/fonts')) await extractTar(path.join(chromiumBin, 'fonts.tar.br'), '/tmp/fonts');
const { default: chromiumBinary } = await import('@sparticuz/chromium'); chromiumBinary.setGraphicsMode = true;
const server = spawn(process.execPath, ['scripts/serve.mjs', '--host', '127.0.0.1', '--port', '4182'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
for (let index = 0; index < 80; index++) { try { if ((await fetch('http://127.0.0.1:4182/index.html')).ok) break; } catch {} await new Promise(resolve => setTimeout(resolve, 100)); }
const browser = await chromium.launch({ headless: true, executablePath: await chromiumBinary.executablePath(), args: [...chromiumBinary.args, '--disable-dev-shm-usage'], chromiumSandbox: false });
const page = await browser.newPage({ viewport: { width: 1600, height: 1080 }, deviceScaleFactor: 1 });
const startNavigation = performance.now(); await page.goto('http://127.0.0.1:4182/index.html?v=1.5.1', { waitUntil: 'networkidle' }); await page.waitForFunction(() => window.INK_AI?.version === '1.5.1'); const startupBrowserMs = performance.now() - startNavigation;
const browserMetrics = await page.evaluate(() => {
  const toggleSamples = [];
  for (let index = 0; index < 20; index++) { const start = performance.now(); window.INK_STUDIO.app.toggleInspector(index % 2 === 0, 'ai'); document.body.offsetWidth; toggleSamples.push(performance.now() - start); }
  const layerId = window.INK_STUDIO.app.doc.pages[0].layers[0].id;
  const steps = Array.from({ length: 100 }, (_, index) => ({ stepId: `ui-${index + 1}`, operation: 'layer.rename', target: layerId, parameters: { name: `Long Plan Step ${index + 1}` } }));
  const renderStart = performance.now();
  window.INK_AI.uiState.plan = window.INK_AI.planFromSteps('100 Steps Plan UI benchmark', steps, { confidence: .99 });
  window.INK_AI.refreshUI();
  document.body.offsetHeight;
  const planRenderMs = performance.now() - renderStart;
  return { toggleSamples, planRenderMs, renderedSteps: document.querySelectorAll('.ai-plan-step').length, memory: performance.memory ? { usedJSHeapSize: performance.memory.usedJSHeapSize, totalJSHeapSize: performance.memory.totalJSHeapSize, jsHeapSizeLimit: performance.memory.jsHeapSizeLimit } : 'NOT AVAILABLE IN THIS CHROMIUM' };
});
await browser.close(); server.kill('SIGTERM');

const v140 = JSON.parse(await readFile(path.join(root, 'tests', 'browser-evidence-v1.4.0', 'browser-interactive-performance-report.json'), 'utf8'));
const v150 = JSON.parse(await readFile(path.join(root, 'tests', 'browser-evidence-v1.5.0', 'browser-interactive-performance-report.json'), 'utf8'));
const exportReport = JSON.parse(await readFile(path.join(root, 'validation', 'non-scripted-collaboration-v1.5.1', 'png-worker-export-report.json'), 'utf8'));
const baseline100k = v140.cases.find(item => item.strokes === 100000), current100k = v150.cases.find(item => item.strokes === 100000);
const report = {
  format: 'INK-PERFORMANCE-REGRESSION-REPORT', version: '1.5.1', measuredAt: new Date().toISOString(), decision: 'VALIDATION REQUIRED', environment: { runtime: process.version, platform: process.platform, architecture: process.arch, browser: 'Chromium 143 headless' },
  runtime: [startup, contextSummary, contextDetailed, preview10, audit1000, auditSerialize, saveLoad],
  browser: { standardModeStartupMs: startupBrowserMs, aiPanelToggle20: { averageMs: browserMetrics.toggleSamples.reduce((sum, value) => sum + value, 0) / browserMetrics.toggleSamples.length, maximumMs: Math.max(...browserMetrics.toggleSamples) }, longPlan100: { renderMs: browserMetrics.planRenderMs, renderedSteps: browserMetrics.renderedSteps }, startupMemory: browserMetrics.memory },
  rendering100k: { v140: baseline100k, v150CoreRetainedByV151: current100k, fpsImprovementPercentFromV140: (current100k.fps / baseline100k.fps - 1) * 100, note: 'v1.5.1 does not replace or downgrade the v1.5.0 renderer; the complete v1.5.0 performance test is rerun in regression.' },
  pngExport: exportReport,
  coverage: { standardModeStartup: 'MEASURED', aiModeStartup: 'STANDARD RUNTIME PLUS LAZY AI PANEL; NO EXTERNAL REQUEST', panelOpenClose: 'MEASURED 20 TOGGLES', longPlan: 'MEASURED 100 STEPS', preview10: 'MEASURED', acceptReject10: 'COVERED BY UNIT REGRESSION', audit1000: 'MEASURED', longConversationContext: 'COVERED BY CONTEXT TESTS', imageContext: 'COVERED BY IMAGE CONTEXT TESTS', stroke100000: 'RERUN BY V1.5 PERFORMANCE REGRESSION', workerExport: 'MEASURED', saveLoad: 'MEASURED', rollbackVariant: 'COVERED BY NON-SCRIPTED WORKFLOW' },
  manual: { physicalDevicePerformance: 'USER VALIDATION REQUIRED', mobileHardwareMemory: 'USER VALIDATION REQUIRED' }
};
await writeFile(path.join(output, 'PERFORMANCE_REGRESSION_REPORT_v1.5.1.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify({ status: 'COMPLETED', standardStartupMs: startupBrowserMs, plan100RenderMs: browserMetrics.planRenderMs, contextSummaryMs: contextSummary.averageMs, audit1000Ms: audit1000.averageMs, fps100k: current100k.fps, pngExportMs: exportReport.report.durationMs }, null, 2));
