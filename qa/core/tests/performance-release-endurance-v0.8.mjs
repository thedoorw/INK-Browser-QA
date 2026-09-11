import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { defaultDocument, InkStore, inspectDocument } from '../src/document/index.js';
import { HistoryManager } from '../src/history/index.js';
import { DirtyRegionTracker, GPUResourceBudget } from '../src/render/index.js';
import { RuntimeHealthMonitor } from '../src/release/index.js';

const heapBefore = process.memoryUsage().heapUsed;
const started = performance.now();

let clock = 0;
const health = new RuntimeHealthMonitor({ clock: () => clock, longFrameMs: 50 });
for (let index = 0; index < 120000; index++) {
  const duration = index % 500 === 0 ? 62 : 8 + (index % 9) * .5;
  health.recordFrame(duration);
  clock += duration;
}
for (let index = 0; index < 5000; index++) {
  const token = health.beginOperation(`operation-${index % 12}`);
  clock += index % 7;
  health.endOperation(token, { index });
}
health.heartbeat({ phase: 'endurance' });

const resourceBudget = new GPUResourceBudget({ budgetBytes: 32 * 1024 * 1024 });
for (let index = 0; index < 50000; index++) {
  const id = `resource-${index}`;
  resourceBudget.reserve(id, 24 * 1024 + (index % 16) * 1024, { type: index % 3 === 0 ? 'texture' : 'raster' });
  if (index % 4 === 0) resourceBudget.release(`resource-${Math.max(0, index - 80)}`);
}

const dirty = new DirtyRegionTracker({ mergeGap: 6, maxRegions: 256 });
for (let index = 0; index < 80000; index++) {
  dirty.add({ x: (index % 400) * 4, y: Math.floor(index / 400) * 3, w: 9, h: 9 });
  if (index % 5000 === 0) dirty.consume();
}
const remainingRegions = dirty.consume().length;

const store = new InkStore({ databaseName: 'INK_ENDURANCE', checkpointLimit: 3 });
const document = defaultDocument();
for (let index = 0; index < 120; index++) {
  document.modifiedAt = `generation-${index}`;
  document.title = `Endurance ${index}`;
  await store.save('autosave', document);
}
const recovery = await store.loadWithRecovery('autosave', value => inspectDocument(value).passed);

const app = {
  doc: defaultDocument(),
  dirtyCount: 0,
  markDirty() { this.dirtyCount++; },
  updateHistoryUI() {},
  replaceDocument(documentValue) { this.doc = documentValue; }
};
const history = new HistoryManager(app, 70);
for (let index = 0; index < 500; index++) history.push(`rename-${index}`, () => { app.doc.title = `History ${index}`; });
for (let index = 0; index < 70; index++) history.undo();
for (let index = 0; index < 35; index++) history.redo();

const elapsedMs = performance.now() - started;
const heapAfter = process.memoryUsage().heapUsed;
const heapDeltaMiB = (heapAfter - heapBefore) / 1048576;
const resourceDiagnostics = resourceBudget.diagnostics();
const healthDiagnostics = health.diagnostics();
const historyStats = history.stats();
const checkpoints = store.memory.get('autosave:checkpoints') || [];

const report = {
  version: '0.8.3',
  elapsedMs,
  heapDeltaMiB,
  frames: healthDiagnostics.frames,
  longFrames: healthDiagnostics.longFrames,
  longFrameRatio: healthDiagnostics.longFrameRatio,
  operationSamplesRetained: healthDiagnostics.operations.length,
  runtimeStatus: healthDiagnostics.status,
  resources: resourceDiagnostics,
  remainingRegions,
  autosave: {
    generations: 120,
    checkpointCount: checkpoints.length,
    recovered: recovery.recovered,
    source: recovery.source,
    verified: recovery.verified,
    backend: recovery.backend
  },
  history: historyStats,
  passed: healthDiagnostics.frames === 120000
    && healthDiagnostics.operations.length <= 20
    && resourceDiagnostics.usedBytes <= resourceDiagnostics.budgetBytes
    && resourceDiagnostics.evictions > 0
    && remainingRegions <= 256
    && checkpoints.length === 3
    && recovery.verified === true
    && historyStats.undo <= 70
    && historyStats.redo <= 70
    && elapsedMs < 30000
    && heapDeltaMiB < 300
};

fs.writeFileSync(new URL('./performance-release-endurance-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
