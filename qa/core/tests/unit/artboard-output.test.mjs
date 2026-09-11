import test from 'node:test';
import assert from 'node:assert/strict';
import {
  artboardBleedBounds, artboardExportGeometry, artboardPixelSize,
  artboardSafeBounds, createArtboard, defaultDocument, inspectDocument, migrateDocument, activateWorkspace, workspaceDiagnostics, normalizeLayoutViewport
} from '../../src/document/index.js';
import { buildSinglePageJpegPdf } from '../../src/export/index.js';
import { LiveCanvasTileRenderer } from '../../src/render/index.js';

test('A4 portrait at 300 PPI resolves to print-ready dimensions', () => {
  const artboard = createArtboard({ orientation: 'portrait', ppi: 300 });
  const size = artboardPixelSize(artboard, { ppi: 300 });
  assert.deepEqual([artboard.widthMm, artboard.heightMm], [210, 297]);
  assert.deepEqual([size.width, size.height], [2480, 3508]);
});

test('A4 landscape swaps physical and pixel dimensions', () => {
  const artboard = createArtboard({ orientation: 'landscape', widthMm: 297, heightMm: 210, ppi: 300 });
  const size = artboardPixelSize(artboard, { ppi: 300 });
  assert.deepEqual([artboard.widthMm, artboard.heightMm], [297, 210]);
  assert.deepEqual([size.width, size.height], [3508, 2480]);
});

test('bleed, safety and crop-mark export geometry remain physically bounded', () => {
  const artboard = createArtboard({ bleedMm: 3, safeMarginMm: 12 });
  const bleed = artboardBleedBounds(artboard, true);
  const safe = artboardSafeBounds(artboard);
  const geometry = artboardExportGeometry(artboard, { ppi: 300, includeBleed: true, cropMarks: true, cropMarkMarginMm: 6 });
  assert.ok(bleed.w > geometry.trimBounds.w);
  assert.ok(safe.w < geometry.trimBounds.w);
  assert.equal(geometry.widthMm, 228);
  assert.equal(geometry.heightMm, 315);
  assert.ok(geometry.width * geometry.height < 36_000_000);
});

test('new documents start in full creation space while retaining an A4 layout definition', () => {
  const current = defaultDocument();
  current.pages[0].artboard.bleedMm = 3;
  assert.equal(current.pages[0].workspace.activeSpace, 'creation');
  assert.equal(current.pages[0].workspace.showLayoutFrameInCreation, false);
  assert.deepEqual(current.pages[0].workspace.layoutViewport, { x: 0, y: 0, scale: 1, rotation: 0 });
  assert.equal(inspectDocument(current).passed, true);
  const legacy = structuredClone(current);
  legacy.appVersion = '0.7.0';
  delete legacy.pages[0].artboard;
  delete legacy.pages[0].workspace;
  const migrated = migrateDocument(legacy);
  assert.equal(migrated.pages[0].artboard.mode, 'fixed');
  assert.equal(migrated.pages[0].workspace.activeSpace, 'creation');
  assert.equal(migrated.formatVersion, 4);
});

test('PDF output encodes one exact A4 page in points', () => {
  const jpeg = new Uint8Array([0xff, 0xd8, 0xff, 0xd9]);
  const bytes = buildSinglePageJpegPdf({ jpegBytes: jpeg, pixelWidth: 2480, pixelHeight: 3508, widthMm: 210, heightMm: 297, title: 'A4 test' });
  const text = new TextDecoder('latin1').decode(bytes);
  assert.match(text, /^%PDF-1\.4/);
  assert.match(text, /\/MediaBox \[0 0 595\.2756 841\.8898\]/);
  assert.match(text, /\/Subtype \/Image/);
});

test('live Canvas tile renderer completes dirty tiles and serves a clean atlas', async () => {
  const context = { setTransform() {}, clearRect() {}, drawImage() {} };
  const renderer = new LiveCanvasTileRenderer({
    tileSize: 256,
    overlap: 16,
    budgetBytes: 8 * 1024 * 1024,
    canvasFactory: () => ({ width: 0, height: 0, getContext: () => context, dispose() {} })
  });
  renderer.ensure({ x: -100, y: -100, w: 200, h: 200 }, 1);
  let renders = 0;
  const completed = await renderer.schedule(async () => { renders++; });
  assert.equal(completed, true);
  assert.ok(renders > 0);
  assert.equal(renderer.isReady(), true);
  assert.equal(renderer.diagnostics().atlas.dirty, 0);
  assert.equal(renderer.draw(context), true);
});


test('creation and layout spaces share objects while retaining independent cameras', () => {
  const document = defaultDocument();
  const page = document.pages[0];
  page.layers[0].objects.push({ id: 'shared-object', type: 'shape', matrix: [1,0,0,1,0,0], opacity: 1, shape: 'rect', color: '#000000', fillColor: '#ffffff', fill: false, size: 1, x2: 0, y2: 0, w: 100, h: 80 });
  page.camera.x = -130;
  page.camera.scale = 1.6;
  activateWorkspace(page, 'layout');
  page.camera.x = 42;
  page.camera.scale = .72;
  assert.equal(page.layers[0].objects[0].id, 'shared-object');
  activateWorkspace(page, 'creation');
  assert.equal(page.camera.x, -130);
  assert.equal(page.camera.scale, 1.6);
  activateWorkspace(page, 'layout');
  assert.equal(page.camera.x, 42);
  assert.equal(page.camera.scale, .72);
  assert.deepEqual(workspaceDiagnostics(page).visited, { creation: true, layout: true });
  assert.equal(inspectDocument(document).passed, true);
});

test('layout viewport is finite, bounded and independent from original objects', () => {
  const document = defaultDocument();
  const page = document.pages[0];
  const original = { id: 'model-object', type: 'shape', matrix: [1,0,0,1,400,-120], opacity: 1, shape: 'rect', color: '#000000', fillColor: '#ffffff', fill: false, size: 1, x2: 0, y2: 0, w: 500, h: 300 };
  page.layers[0].objects.push(original);
  page.workspace.layoutViewport = normalizeLayoutViewport({ x: 650, y: 30, scale: .42, rotation: .2 });
  const diagnostic = workspaceDiagnostics(page);
  assert.deepEqual(diagnostic.layoutViewport, { x: 650, y: 30, scale: .42, rotation: .2 });
  assert.deepEqual(page.layers[0].objects[0].matrix, [1,0,0,1,400,-120]);
  assert.equal(inspectDocument(document).passed, true);
});
