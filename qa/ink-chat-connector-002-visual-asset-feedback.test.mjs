import test from 'node:test';
import assert from 'node:assert/strict';
import { Blob } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject, installRevision } from '../product/source/src/document/index.js';
import { artboardExportGeometry } from '../product/source/src/document/artboard.js';
import { documentFingerprint } from '../product/source/src/document/integrity.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { createPath } from '../product/source/src/vector/vector-core.js';
import { createInkPublicCreativeApi } from '../product/source/src/agent/index.js';
import {
  INK_OUTPUT_HANDLE_SCHEMA,
  INK_OUTPUT_HANDLE_VERSION,
  createInkOutputRegistry,
  getInkOutputRegistry,
  resolveInkOutputPayload
} from '../product/source/src/agent/output-handle-registry.js';
import {
  INK_PREVIEW_DEFAULT_MAX_DIMENSION,
  INK_PREVIEW_HARD_MAX_DIMENSION,
  INK_PREVIEW_HARD_MAX_PIXELS
} from '../product/source/src/agent/visual-feedback.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clone = value => JSON.parse(JSON.stringify(value));

const CONNECTOR_001_TOOLS = [
  'get_ink_capabilities',
  'get_ink_context',
  'get_ink_selection',
  'inspect_ink_objects',
  'decompose_ink_reference',
  'propose_ink_edit',
  'approve_ink_edit',
  'execute_ink_edit',
  'get_ink_history',
  'undo_ink',
  'redo_ink',
  'get_ink_revisions',
  'capture_ink_revision',
  'restore_ink_revision'
];

function pathFixture(id = 'path-preview') {
  return createPath({
    id,
    fill: '#e6dfcf',
    stroke: '#403b37',
    strokeWidth: 2,
    subpaths: [{
      id: id + ':outer',
      closed: true,
      role: 'outer',
      anchors: [
        { id: id + ':a0', x: 0, y: 0 },
        { id: id + ':a1', x: 120, y: 0 },
        { id: id + ':a2', x: 120, y: 80 },
        { id: id + ':a3', x: 0, y: 80 }
      ]
    }]
  });
}

function fakeCanvas(width, height, seed) {
  return {
    width,
    height,
    toBlob(callback, type) {
      callback(new Blob(['PNG|' + width + 'x' + height + '|' + seed], { type: type || 'image/png' }));
    }
  };
}

function makeApp({ rendererWidth = 900, rendererHeight = 700, contentBounds = { x: 10, y: 20, w: 480, h: 320 } } = {}) {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  const object = pathFixture();
  layer.objects.push(object);

  const calls = { render: [], exportPNG: 0, print: 0, download: 0 };
  const app = {
    doc,
    selection: [{ pageId: page.id, layerId: layer.id, objectId: object.id }],
    page() { return this.doc.pages.find(item => item.id === this.doc.activePageId) || this.doc.pages[0]; },
    layer() { return this.page().layers.find(item => item.id === this.page().activeLayerId) || this.page().layers[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    objectPath(found) { return found ? ['pages', 0, ...found.path] : null; },
    renderer: {
      width: rendererWidth,
      height: rendererHeight,
      viewportWorldBounds() { return { x: -rendererWidth / 2, y: -rendererHeight / 2, w: rendererWidth, h: rendererHeight }; },
      contentBounds() { return clone(contentBounds); },
      render() {}
    },
    async renderExportCanvas(options = {}) {
      calls.render.push(clone(options));
      let width;
      let height;
      if (options.scope === 'artboard') {
        const geometry = artboardExportGeometry(this.page(), {
          ppi: options.ppi,
          includeBleed: options.includeBleed,
          cropMarks: options.cropMarks
        });
        width = geometry.width;
        height = geometry.height;
      } else if (options.scope === 'viewport') {
        width = Math.max(1, Math.round(this.renderer.width * options.scale));
        height = Math.max(1, Math.round(this.renderer.height * options.scale));
      } else {
        const b = this.renderer.contentBounds();
        width = Math.max(1, Math.ceil((b.w + 48) * options.scale));
        height = Math.max(1, Math.ceil((b.h + 48) * options.scale));
      }
      return fakeCanvas(width, height, this.doc.title + '|' + JSON.stringify(options));
    },
    exportPNG() { calls.exportPNG++; throw new Error('preview must not call exportPNG'); },
    printArtboard() { calls.print++; throw new Error('preview must not print'); },
    download() { calls.download++; throw new Error('preview must not download'); },
    queueSpatialObject() {},
    refreshAll() {},
    refreshSelectionUI() {},
    updateHistoryUI() {},
    markDirty() {},
    toast() {},
    replaceDocument(next) { this.doc = next; }
  };

  app.history = new HistoryManager(app);
  installRevision(app, { store: null });
  return { app, calls, page, layer, object };
}

function handleFixture(id, byteLength) {
  return {
    schema: INK_OUTPUT_HANDLE_SCHEMA,
    version: INK_OUTPUT_HANDLE_VERSION,
    handleId: id,
    renderFingerprint: 'render:' + id,
    byteLength
  };
}

test('Connector-002 appends exactly three named tools while preserving the Connector-001 14-tool prefix', () => {
  const { app } = makeApp();
  const api = createInkPublicCreativeApi(app);
  const names = api.tools.registry().map(item => item.name);
  assert.deepEqual(names.slice(0, CONNECTOR_001_TOOLS.length), CONNECTOR_001_TOOLS);
  assert.deepEqual(names.slice(CONNECTOR_001_TOOLS.length), [
    'get_ink_preview',
    'inspect_ink_output',
    'release_ink_output'
  ]);
  assert.equal(names.length, 17);

  const capabilities = api.capabilities().result.capabilities;
  for (const id of ['preview.capture', 'asset.inspect', 'asset.release']) {
    const capability = capabilities.find(item => item.id === id);
    assert.ok(capability, 'missing capability ' + id);
    assert.equal(capability.availability, true);
    assert.equal(typeof capability.authoritativeRoute, 'string');
    assert.equal(typeof capability.historyExpectation, 'string');
    assert.equal(typeof capability.revisionExpectation, 'string');
    assert.equal(capability.resultEnvelope, 'INK_AGENT_RESULT');
  }
  assert.equal(capabilities.find(item => item.id === 'preview.capture').routingClass, 'NAMED_TOOL');
  assert.equal(capabilities.find(item => item.id === 'asset.inspect').routingClass, 'READ_ONLY');
  assert.equal(capabilities.find(item => item.id === 'asset.release').routingClass, 'NAMED_TOOL');
});

test('get_ink_preview uses renderExportCanvas, returns JSON-safe INK_OUTPUT_HANDLE v1, and mutates no Document/History/Revision/selection state', async () => {
  const { app, calls, page, layer, object } = makeApp();
  const api = createInkPublicCreativeApi(app);
  const beforeDocument = clone(app.doc);
  const beforeSelection = clone(app.selection);
  const beforeHistory = { undo: app.history.undoStack.length, redo: app.history.redoStack.length };
  const beforeRevision = app.revisions.revisionIdFor(app.doc.id);
  const beforeFingerprint = documentFingerprint(app.doc);

  const result = await api.tools.invoke('get_ink_preview', {
    scope: 'artboard',
    maxDimension: INK_PREVIEW_DEFAULT_MAX_DIMENSION,
    refs: [{ pageId: page.id, layerId: layer.id, objectId: object.id }]
  });

  assert.equal(result.status, 'COMPLETED');
  assert.equal(result.action, 'preview.capture');
  assert.equal(result.outputHandles.length, 1);
  assert.deepEqual(result.targetRefs.map(ref => ref.objectId), [object.id]);

  const handle = result.outputHandles[0];
  assert.equal(handle.schema, INK_OUTPUT_HANDLE_SCHEMA);
  assert.equal(handle.version, INK_OUTPUT_HANDLE_VERSION);
  assert.match(handle.handleId, /^ink-output-v1:/);
  assert.equal(handle.kind, 'preview');
  assert.equal(handle.format, 'png');
  assert.equal(handle.mimeType, 'image/png');
  assert.equal(handle.transport, 'INTERNAL_EPHEMERAL');
  assert.equal(handle.persistence, 'NONE');
  assert.equal(handle.documentId, app.doc.id);
  assert.equal(handle.pageId, page.id);
  assert.equal(handle.revisionId, beforeRevision);
  assert.equal(handle.documentFingerprint, beforeFingerprint);
  assert.equal(handle.scope, 'artboard');
  assert.ok(handle.bounds.w > 0 && handle.bounds.h > 0);
  assert.ok(handle.pixelSize.width <= INK_PREVIEW_DEFAULT_MAX_DIMENSION);
  assert.ok(handle.pixelSize.height <= INK_PREVIEW_DEFAULT_MAX_DIMENSION);
  assert.ok(handle.pixelSize.width * handle.pixelSize.height <= INK_PREVIEW_HARD_MAX_PIXELS);
  assert.deepEqual(handle.objectRefs.map(ref => ref.objectId), [object.id]);
  assert.ok(handle.byteLength > 0);
  assert.equal(typeof handle.renderFingerprint, 'string');
  assert.match(handle.fingerprintAlgorithm, /fnv1a32/);

  assert.equal(calls.render.length, 1);
  assert.equal(calls.render[0].scope, 'artboard');
  assert.equal(calls.render[0].includeBleed, false);
  assert.equal(calls.render[0].cropMarks, false);
  assert.equal(calls.exportPNG, 0);
  assert.equal(calls.print, 0);
  assert.equal(calls.download, 0);

  const serialized = JSON.stringify(result);
  assert.doesNotMatch(serialized, /data:image|;base64,|blob:/i);
  assert.doesNotMatch(serialized, /\bBlob\b|HTMLCanvasElement|ObjectURL/);
  const payload = resolveInkOutputPayload(app, handle.handleId);
  assert.ok(payload instanceof Blob);
  assert.equal(payload.type, 'image/png');

  assert.deepEqual(app.doc, beforeDocument);
  assert.deepEqual(app.selection, beforeSelection);
  assert.equal(app.history.undoStack.length, beforeHistory.undo);
  assert.equal(app.history.redoStack.length, beforeHistory.redo);
  assert.equal(app.revisions.revisionIdFor(app.doc.id), beforeRevision);
});

test('preview scope planning obeys hard dimension/pixel bounds and optional refs never change the rendered crop', async () => {
  const { app, calls, page, layer, object } = makeApp({
    rendererWidth: 2400,
    rendererHeight: 1800,
    contentBounds: { x: -100, y: -80, w: 5000, h: 3200 }
  });
  const api = createInkPublicCreativeApi(app);

  const viewport = await api.preview.capture({ scope: 'viewport', maxDimension: 5000, scale: 4 });
  const content = await api.preview.capture({ scope: 'content', maxDimension: 1600, scale: 3 });
  const withoutRefs = await api.preview.capture({ scope: 'viewport', maxDimension: 1200 });
  const withRefs = await api.preview.capture({
    scope: 'viewport',
    maxDimension: 1200,
    refs: [{ pageId: page.id, layerId: layer.id, objectId: object.id }]
  });

  for (const result of [viewport, content, withoutRefs, withRefs]) {
    assert.equal(result.status, 'COMPLETED');
    const size = result.outputHandles[0].pixelSize;
    assert.ok(size.width <= INK_PREVIEW_HARD_MAX_DIMENSION);
    assert.ok(size.height <= INK_PREVIEW_HARD_MAX_DIMENSION);
    assert.ok(size.width * size.height <= INK_PREVIEW_HARD_MAX_PIXELS);
  }
  assert.equal(viewport.outputHandles[0].pixelSize.width <= INK_PREVIEW_HARD_MAX_DIMENSION, true);
  assert.deepEqual(calls.render.at(-2), calls.render.at(-1), 'semantic refs must not alter viewport render options/crop');
  assert.notEqual(withoutRefs.outputHandles[0].handleId, withRefs.outputHandles[0].handleId, 'semantic binding participates in output identity');

  const beforeInvalid = calls.render.length;
  const invalid = await api.preview.capture({ scope: 'content', refs: ['missing-object'] });
  assert.equal(invalid.status, 'FAILED');
  assert.ok(invalid.diagnostics.some(item => item.code === 'INK_PREVIEW_REF_NOT_FOUND'));
  assert.equal(calls.render.length, beforeInvalid, 'invalid refs must fail before rendering');
});

test('duplicate deterministic previews reuse the same content-addressed registry entry', async () => {
  const { app } = makeApp();
  const api = createInkPublicCreativeApi(app);

  const first = await api.preview.capture({ scope: 'artboard', maxDimension: 1000 });
  const second = await api.preview.capture({ scope: 'artboard', maxDimension: 1000 });
  assert.equal(first.status, 'COMPLETED');
  assert.equal(second.status, 'COMPLETED');
  assert.equal(first.outputHandles[0].handleId, second.outputHandles[0].handleId);
  assert.equal(first.outputHandles[0].renderFingerprint, second.outputHandles[0].renderFingerprint);

  const stats = getInkOutputRegistry(app).stats();
  assert.equal(stats.entries, 1);
  assert.equal(stats.availableEntries, 1);
  assert.ok(stats.totalBytes > 0);
  assert.ok(stats.maxEntries <= 8);
  assert.ok(stats.maxTotalBytes <= 32 * 1024 * 1024);
});

test('inspect detects exact-state staleness and release invalidates only ephemeral payload availability', async () => {
  const { app } = makeApp();
  const api = createInkPublicCreativeApi(app);
  const captured = await api.preview.capture({ scope: 'content' });
  const handleId = captured.outputHandles[0].handleId;
  const historyBefore = app.history.undoStack.length;
  const revisionBefore = app.revisions.revisionIdFor(app.doc.id);

  const fresh = api.asset.inspect(handleId);
  assert.equal(fresh.status, 'COMPLETED');
  assert.equal(fresh.result.available, true);
  assert.equal(fresh.result.stale, false);
  assert.deepEqual(fresh.result.staleReasons, []);

  app.doc.title = 'Changed after preview';
  const stale = api.tools.invoke('inspect_ink_output', { handleId });
  assert.equal(stale.result.available, true);
  assert.equal(stale.result.stale, true);
  assert.ok(stale.result.staleReasons.includes('DOCUMENT_FINGERPRINT_CHANGED'));
  assert.equal(stale.result.currentDocumentFingerprint, documentFingerprint(app.doc));

  const released = api.tools.invoke('release_ink_output', { handleId });
  assert.equal(released.status, 'COMPLETED');
  assert.equal(released.result.released, true);
  assert.equal(released.result.available, false);
  assert.ok(released.result.staleReasons.includes('PAYLOAD_UNAVAILABLE'));
  assert.equal(resolveInkOutputPayload(app, handleId), null);
  assert.equal(app.history.undoStack.length, historyBefore);
  assert.equal(app.revisions.revisionIdFor(app.doc.id), revisionBefore);

  const again = api.asset.release(handleId);
  assert.equal(again.status, 'COMPLETED');
  assert.equal(again.result.released, false);
});

test('ephemeral registry enforces bounded entries/bytes, byte eviction, release, and duplicate identity checks', () => {
  const registry = createInkOutputRegistry({ maxEntries: 2, maxTotalBytes: 10 });
  registry.store(handleFixture('a', 6), { payload: 'a' });
  registry.store(handleFixture('b', 6), { payload: 'b' });

  assert.equal(registry.inspect('a').available, false);
  assert.equal(registry.inspect('a').evicted, true);
  assert.equal(registry.inspect('b').available, true);
  assert.equal(registry.stats().totalBytes, 6);

  registry.store(handleFixture('c', 4), { payload: 'c' });
  assert.equal(registry.inspect('a'), null, 'entry-count eviction removes the oldest descriptor');
  assert.equal(registry.inspect('b').available, true);
  assert.equal(registry.inspect('c').available, true);
  assert.equal(registry.stats().entries, 2);
  assert.equal(registry.stats().totalBytes, 10);

  const released = registry.release('b');
  assert.equal(released.released, true);
  assert.equal(registry.inspect('b').available, false);
  assert.equal(registry.stats().totalBytes, 4);

  assert.throws(
    () => registry.store({ ...handleFixture('c', 5), renderFingerprint: 'different' }, { payload: 'collision' }),
    error => error?.code === 'INK_OUTPUT_HANDLE_ID_COLLISION'
  );
});

test('Connector-002 source boundary preserves existing renderer/export authority, no UI/export transport, no use_ink/discovery/MCP, FORMAT_VERSION 4', async () => {
  const [visualSource, registrySource, apiSource, inkSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/agent/visual-feedback.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/output-handle-registry.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/public-creative-api.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/ink.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);

  assert.equal(FORMAT_VERSION, 4);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
  assert.match(visualSource, /app\.renderExportCanvas\(plan\.renderOptions\)/);
  assert.match(visualSource, /INK_PREVIEW_HARD_MAX_PIXELS\s*=\s*2560000/);
  assert.match(inkSource, /if\(width\*height>6000000\)/, 'preview hard limit stays below the existing tiled-export threshold');

  assert.doesNotMatch(visualSource, /exportPNG\s*\(|printArtboard\s*\(|download\s*\(|createObjectURL|window\.|globalThis|screenshot/i);
  assert.doesNotMatch(registrySource + '\n' + visualSource + '\n' + apiSource, /\buse_ink\b|describe_ink_capability|Capability Schema Discovery|WebSocket|postMessage|\bMCP\b/i);
  assert.doesNotMatch(registrySource + '\n' + visualSource, /IndexedDB|localStorage|sessionStorage|FileSystem|cloud/i);
  assert.doesNotMatch(visualSource, /new\s+Renderer|renderTiledCanvas|TiledExportJob|DOM/);
  assert.equal((apiSource.match(/get_ink_preview/g) || []).length >= 2, true);
});
