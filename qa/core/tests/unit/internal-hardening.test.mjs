import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/index.js';
import { HistoryManager } from '../../src/history/index.js';
import {
  PersistentTileAtlas, TiledExportCancelledError, TiledExportJob,
  renderTiledCanvas, validateTiledExportCheckpoint
} from '../../src/render/index.js';
import {
  ExternalValidationRecorder, buildExternalDiagnosticBundle,
  collectPlatformCapabilities, probeWebGLCapabilities
} from '../../src/release/index.js';

test('target-scoped history captures only selected paths and applies undo redo in place', () => {
  const app = {
    doc: defaultDocument(),
    updateHistoryUI() {}, markDirty() {}, toast() {},
    replaceDocument(document) { this.doc = document; }
  };
  const layer = app.doc.pages[0].layers[0];
  for (let index = 0; index < 1000; index++) layer.objects.push({ id: `o-${index}`, type: 'shape', matrix: [1, 0, 0, 1, 0, 0], opacity: 1, value: index });
  const history = new HistoryManager(app);
  history.pushScoped('rename', [['title']], () => { app.doc.title = 'Scoped'; });
  assert.equal(app.doc.title, 'Scoped');
  const stats = history.stats();
  assert.equal(stats.mode, 'hybrid-target-scoped-id-aware-patches');
  assert.equal(stats.scopedEntries, 1);
  assert.equal(stats.fullEntries, 0);
  assert.ok(stats.capturedBytes < JSON.stringify(app.doc).length / 100);
  assert.equal(history.undo(), true);
  assert.equal(app.doc.title, '未命名作品');
  assert.equal(history.redo(), true);
  assert.equal(app.doc.title, 'Scoped');
  assert.equal(history.stats().metrics.inPlaceApplies, 2);
});

test('scoped history cancellation restores the target without replacing unrelated data', () => {
  const doc = defaultDocument();
  doc.pages[0].layers[0].objects.push({ id: 'a', value: 1 });
  const unrelated = doc.pages[0].paper;
  const app = { doc, updateHistoryUI() {}, replaceDocument(document) { this.doc = document; } };
  const history = new HistoryManager(app);
  history.begin('edit', { targets: [['pages', 0, 'layers', 0, 'objects', 0]] });
  app.doc.pages[0].layers[0].objects[0].value = 9;
  history.cancel({ restore: true });
  assert.equal(app.doc.pages[0].layers[0].objects[0].value, 1);
  assert.equal(app.doc.pages[0].paper, unrelated);
});

test('persistent tile atlas updates dirty tiles, retains clean tiles and exposes bounded diagnostics', async () => {
  let disposed = 0;
  const atlas = new PersistentTileAtlas({
    bounds: { x: 0, y: 0, w: 1600, h: 900 }, scale: 1,
    tileSize: 512, overlap: 16, budgetBytes: 32 * 1024 * 1024
  });
  let rendered = 0;
  const resourceFactory = async tile => ({
    resource: { tile: tile.index, dispose() { disposed++; } },
    bytes: tile.width * tile.height * 4
  });
  const first = await atlas.updateDirty({
    resourceFactory,
    renderTile: async () => { rendered++; },
    maxTiles: 3
  });
  assert.equal(first.completed, 3);
  assert.equal(atlas.diagnostics().dirty, atlas.plan.tiles.length - 3);
  await atlas.updateDirty({ resourceFactory, renderTile: async () => { rendered++; } });
  assert.equal(atlas.diagnostics().dirty, 0);
  const affected = atlas.markDirty({ x: 0, y: 0, w: 100, h: 100 });
  assert.ok(affected >= 1 && affected < atlas.plan.tiles.length);
  await atlas.updateDirty({ resourceFactory, renderTile: async () => { rendered++; } });
  const diagnostics = atlas.diagnostics();
  assert.equal(diagnostics.dirty, 0);
  assert.ok(diagnostics.stats.renders >= atlas.plan.tiles.length + affected);
  assert.ok(diagnostics.budget.usedBytes <= diagnostics.budget.budgetBytes);
  atlas.clear();
  assert.ok(disposed > 0);
});

function fakeCanvasFactory(registry = []) {
  return () => {
    const operations = [];
    const context = {
      operations,
      setTransform() {}, clearRect() {},
      drawImage(...args) { operations.push(args); }
    };
    const canvas = { width: 0, height: 0, context, getContext: () => context };
    registry.push(canvas);
    return canvas;
  };
}

test('resumable tiled export preserves checkpoint and continues after cancellation', async () => {
  const canvases = [];
  let rendered = 0;
  const options = {
    bounds: { x: 0, y: 0, w: 1800, h: 900 }, scale: 1,
    tileSize: 512, overlap: 16,
    canvasFactory: fakeCanvasFactory(canvases),
    renderTile: async () => { rendered++; },
    isCancelled: () => rendered >= 3
  };
  let cancelled;
  try {
    await renderTiledCanvas(options);
  } catch (error) {
    cancelled = error;
  }
  assert.ok(cancelled instanceof TiledExportCancelledError);
  assert.equal(cancelled.checkpoint.nextTileIndex, 2);
  const resumed = await renderTiledCanvas({
    ...options,
    isCancelled: null,
    checkpoint: cancelled.checkpoint,
    outputCanvas: cancelled.canvas
  });
  assert.equal(resumed.stats.complete, true);
  assert.equal(resumed.stats.resumedFrom, 2);
  assert.equal(validateTiledExportCheckpoint(resumed.checkpoint, resumed.plan).valid, true);
  assert.equal(rendered, resumed.plan.tiles.length + 1);
});

test('tiled export job reports cancellation and can resume', async () => {
  let renders = 0;
  const job = new TiledExportJob({
    bounds: { x: 0, y: 0, w: 1200, h: 700 }, scale: 1,
    tileSize: 512, overlap: 16,
    canvasFactory: fakeCanvasFactory(),
    renderTile: async () => {
      renders++;
      if (renders === 2) job.cancel();
    }
  });
  await assert.rejects(() => job.run(), error => error instanceof TiledExportCancelledError);
  assert.equal(job.diagnostics().state, 'cancelled');
  job.options.renderTile = async () => { renders++; };
  const result = await job.resume();
  assert.equal(result.stats.complete, true);
  assert.equal(job.diagnostics().state, 'completed');
});

test('external diagnostic bundle is bounded and records platform, pen and gate evidence', async () => {
  const gl = {
    VERSION: 1, SHADING_LANGUAGE_VERSION: 2, VENDOR: 3, RENDERER: 4,
    MAX_TEXTURE_SIZE: 5, MAX_RENDERBUFFER_SIZE: 6, MAX_COMBINED_TEXTURE_IMAGE_UNITS: 7,
    getParameter(id) { return `p-${id}`; },
    getSupportedExtensions() { return []; },
    getContextAttributes() { return { alpha: true }; }
  };
  const target = {
    navigator: {
      userAgent: 'INK-Test', platform: 'TestOS', language: 'zh-TW', languages: ['zh-TW'],
      hardwareConcurrency: 8, deviceMemory: 4, maxTouchPoints: 10, onLine: true,
      storage: { estimate: async () => ({ quota: 1000, usage: 100 }), persisted: async () => true }
    },
    location: { origin: 'https://ink.test', protocol: 'https:' },
    screen: { width: 1920, height: 1080, colorDepth: 24, pixelDepth: 24 },
    devicePixelRatio: 2,
    isSecureContext: true,
    PointerEvent: function PointerEvent() {},
    indexedDB: {}, caches: {},
    document: { createElement: () => ({ getContext: type => type === 'webgl2' ? gl : null }) }
  };
  target.PointerEvent.prototype = { getCoalescedEvents() {}, getPredictedEvents() {} };
  const recorder = new ExternalValidationRecorder({ maxSamples: 10, maxEvents: 20, clock: () => 1 });
  recorder.recordPenSample({ pointerType: 'pen', pressure: .5, rawPressure: .4, tiltX: 10, latencyMs: 5 });
  recorder.setGate('webgl2', 'pass', { note: 'unit' });
  const capabilities = collectPlatformCapabilities(target, { canvasFactory: () => target.document.createElement('canvas') });
  assert.equal(capabilities.secureContext, true);
  assert.equal(capabilities.webgl.webgl2.available, true);
  assert.equal(probeWebGLCapabilities({ canvasFactory: () => target.document.createElement('canvas') }).webgl2.available, true);
  const bundle = await buildExternalDiagnosticBundle({ target, recorder, version: '0.8.3', formatVersion: 4 });
  assert.equal(bundle.schema, 'INK_EXTERNAL_DIAGNOSTIC_BUNDLE_V1');
  assert.equal(bundle.validation.pen.count, 1);
  assert.equal(bundle.validation.gates[0].status, 'pass');
  assert.equal(bundle.storage.persistent, true);
});
