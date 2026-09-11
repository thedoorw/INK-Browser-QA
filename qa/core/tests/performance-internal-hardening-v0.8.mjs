import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { defaultDocument } from '../src/document/index.js';
import { HistoryManager } from '../src/history/index.js';
import { PersistentTileAtlas, TiledExportCancelledError, renderTiledCanvas } from '../src/render/index.js';

function fakeCanvasFactory() {
  return () => {
    const context = { setTransform() {}, clearRect() {}, drawImage() {} };
    return { width: 0, height: 0, getContext: () => context };
  };
}

function buildLargeDocument(objects = 20000) {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  for (let index = 0; index < objects; index++) {
    layer.objects.push({
      id: `hardening-${index}`,
      type: 'stroke',
      matrix: [1, 0, 0, 1, index % 1000, Math.floor(index / 1000)],
      opacity: 1,
      color: '#202020',
      size: 2,
      kind: 'pen',
      points: [{ x: 0, y: 0, p: .5, t: 0 }, { x: 12, y: 4, p: .5, t: 8 }]
    });
  }
  return doc;
}

const document = buildLargeDocument();
const documentBytes = Buffer.byteLength(JSON.stringify(document));
const app = {
  doc: document,
  updateHistoryUI() {}, markDirty() {}, toast() {},
  replaceDocument(value) { this.doc = value; }
};
const history = new HistoryManager(app);
const historyStart = performance.now();
history.pushScoped('rename-large-document', [['title']], () => { app.doc.title = 'Scoped Large Document'; });
const historyCommitMs = performance.now() - historyStart;
const historyStats = history.stats();
const undoStart = performance.now();
history.undo();
const undoMs = performance.now() - undoStart;
const redoStart = performance.now();
history.redo();
const redoMs = performance.now() - redoStart;

const atlas = new PersistentTileAtlas({
  bounds: { x: 0, y: 0, w: 12000, h: 8000 },
  scale: 1,
  tileSize: 1024,
  overlap: 32,
  budgetBytes: 96 * 1024 * 1024
});
let atlasRenderCount = 0;
const atlasStart = performance.now();
await atlas.updateDirty({
  maxTiles: 24,
  resourceFactory: async tile => ({
    resource: { id: tile.index, dispose() {} },
    bytes: tile.width * tile.height * 4
  }),
  renderTile: async () => { atlasRenderCount++; }
});
const atlasFirstBatchMs = performance.now() - atlasStart;
const dirtyMarked = atlas.markDirty({ x: 4000, y: 2500, w: 1200, h: 900 });
const dirtyStart = performance.now();
await atlas.updateDirty({
  resourceFactory: async tile => ({ resource: { id: tile.index, dispose() {} }, bytes: tile.width * tile.height * 4 }),
  renderTile: async () => { atlasRenderCount++; }
});
const atlasDirtyUpdateMs = performance.now() - dirtyStart;

let exportRenders = 0;
let cancelled = null;
const exportOptions = {
  bounds: { x: 0, y: 0, w: 6000, h: 4000 },
  scale: 1,
  tileSize: 1024,
  overlap: 32,
  maxOutputPixels: 36_000_000,
  maxOutputDimension: 16384,
  canvasFactory: fakeCanvasFactory(),
  renderTile: async () => { exportRenders++; },
  isCancelled: () => exportRenders >= 8
};
const exportCancelStart = performance.now();
try {
  await renderTiledCanvas(exportOptions);
} catch (error) {
  if (!(error instanceof TiledExportCancelledError)) throw error;
  cancelled = error;
}
const exportCancelMs = performance.now() - exportCancelStart;
const exportResumeStart = performance.now();
const resumed = await renderTiledCanvas({
  ...exportOptions,
  isCancelled: null,
  checkpoint: cancelled.checkpoint,
  outputCanvas: cancelled.canvas
});
const exportResumeMs = performance.now() - exportResumeStart;

const report = {
  version: '0.8.3',
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  history: {
    documentObjects: 20000,
    documentBytes,
    commitMs: historyCommitMs,
    undoMs,
    redoMs,
    capturedBytes: historyStats.capturedBytes,
    captureRatio: historyStats.capturedBytes / documentBytes,
    mode: historyStats.mode,
    passed: historyStats.scopedEntries === 1 && historyStats.fullEntries === 0 && historyStats.capturedBytes < documentBytes * .01
  },
  tileAtlas: {
    totalTiles: atlas.plan.tiles.length,
    firstBatchTiles: 24,
    firstBatchMs: atlasFirstBatchMs,
    dirtyMarked,
    dirtyUpdateMs: atlasDirtyUpdateMs,
    renders: atlasRenderCount,
    diagnostics: atlas.diagnostics(),
    passed: atlas.diagnostics().budget.usedBytes <= atlas.diagnostics().budget.budgetBytes && dirtyMarked > 0
  },
  resumableExport: {
    totalTiles: resumed.plan.tiles.length,
    checkpointTile: cancelled.checkpoint.nextTileIndex,
    cancelMs: exportCancelMs,
    resumeMs: exportResumeMs,
    renderCalls: exportRenders,
    completed: resumed.stats.complete,
    passed: resumed.stats.complete && cancelled.checkpoint.nextTileIndex > 0
  }
};
report.passed = report.history.passed && report.tileAtlas.passed && report.resumableExport.passed;
fs.writeFileSync(new URL('./performance-internal-hardening-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
