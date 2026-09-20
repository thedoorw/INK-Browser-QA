import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import {
  declaredDocumentExtensions,
  defaultDocument,
  findPageObject,
  inspectDocument,
  migrateDocument,
  unwrapInkFile,
  wrapInkFile
} from '../../../../product/source/src/document/index.js';
import { PathEditController } from '../../../../product/source/src/editor/path-edit.js';
import { PathStrokeAppearanceController } from '../../../../product/source/src/editor/expressive-stroke.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { BUILTIN_BRUSH_PRESETS } from '../../../../product/source/src/paint/brush-engine.js';
import {
  EXPRESSIVE_STROKE_EXTENSION,
  EXPRESSIVE_STROKE_MAX_PROFILE_SAMPLES,
  expressiveStrokeFromBrushPreset,
  normalizeExpressiveStroke,
  pathGeometryFingerprint,
  validateExpressiveStroke
} from '../../../../product/source/src/vector/stroke-appearance.js';
import { createPath, pathData, vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function appFixture(path) {
  const app = {
    doc: defaultDocument(),
    selection: [],
    page() { return this.doc.pages[0]; },
    layer() { return this.page().layers[0]; },
    selectedObjects() { return this.selection.map(ref => findPageObject(this.page(), ref)).filter(Boolean); },
    objectPath(found) { return ['pages', 0, ...found.path]; },
    replaceDocument(document) { this.doc = document; },
    markDirty() {},
    updateHistoryUI() {},
    toast() {},
    refreshAll() {},
    queueSpatialObject() {}
  };
  if (path) {
    app.layer().objects.push(path);
    app.selection = [{ layerId: app.layer().id, objectId: path.id }];
  }
  app.history = new HistoryManager(app);
  return app;
}

function fixturePath({
  id = 'expressive-path',
  metadata = {
    extraction: {
      schema: 'INK-EXTRACTION/1',
      batchId: 'batch-expressive',
      referenceObjectId: 'reference-expressive'
    }
  }
} = {}) {
  return createPath({
    id,
    metadata,
    fill: 'none',
    stroke: '#334455',
    strokeWidth: 2.5,
    subpaths: [{
      id: `${id}:outer`,
      role: 'outer',
      closed: false,
      anchors: [
        { id: `${id}:a0`, x: 0, y: 0, in: { x: 0, y: 0 }, out: { x: 10, y: 0 }, mode: 'corner' },
        { id: `${id}:a1`, x: 24, y: 12, in: { x: -6, y: 0 }, out: { x: 6, y: 0 }, mode: 'smooth' },
        { id: `${id}:a2`, x: 48, y: 0, in: { x: -10, y: 0 }, out: { x: 0, y: 0 }, mode: 'corner' }
      ]
    }]
  });
}

function currentPath(app, id = 'expressive-path') {
  return findPageObject(app.page(), id)?.object;
}

function expressiveStyle(overrides = {}) {
  return normalizeExpressiveStroke({
    color: '#8a3154',
    baseWidth: 9,
    opacity: .72,
    profile: {
      pressureInfluence: .8,
      taperStart: .25,
      taperEnd: .4,
      samples: [
        { t: 0, width: .55, pressure: .6 },
        { t: .45, width: 1.3, pressure: 1 },
        { t: 1, width: .7, pressure: .75 }
      ]
    },
    media: {
      engine: 'ink',
      flow: .9,
      grain: .1,
      wetness: 0,
      bristle: .05,
      softness: .02,
      seed: 77
    },
    ...overrides
  });
}

test('style-only assignment/replacement/removal keeps authoritative Path geometry, identity and extraction provenance unchanged', () => {
  const path = fixturePath();
  const app = appFixture(path);
  const controller = new PathStrokeAppearanceController(app);
  const originalGeometry = pathGeometryFingerprint(path);
  const originalPathData = pathData(path);
  const originalMetadata = clone(path.metadata);
  const ordinary = { stroke: path.stroke, strokeWidth: path.strokeWidth };

  const first = expressiveStyle();
  const applied = controller.assign(first);
  assert.equal(applied.changed, true);
  assert.equal(applied.geometryFingerprint, originalGeometry);
  assert.equal(pathGeometryFingerprint(currentPath(app)), originalGeometry);
  assert.equal(pathData(currentPath(app)), originalPathData);
  assert.equal(currentPath(app).id, 'expressive-path');
  assert.deepEqual(currentPath(app).metadata, originalMetadata);
  assert.deepEqual({ stroke: currentPath(app).stroke, strokeWidth: currentPath(app).strokeWidth }, ordinary);

  const historyAfterFirst = app.history.undoStack.length;
  const noop = controller.assign(first);
  assert.equal(noop.changed, false);
  assert.equal(app.history.undoStack.length, historyAfterFirst);

  const second = expressiveStyle({
    color: '#276b7d',
    baseWidth: 14,
    profile: {
      pressureInfluence: .35,
      taperStart: .7,
      taperEnd: .1,
      samples: [{ t: 0, width: .4, pressure: .8 }, { t: 1, width: 1.5, pressure: 1 }]
    },
    media: { engine: 'marker', flow: .62, grain: .05, wetness: 0, bristle: 0, softness: .08, seed: 91 }
  });
  controller.replace(second);
  assert.equal(currentPath(app).expressiveStroke.color, '#276b7d');
  assert.equal(pathGeometryFingerprint(currentPath(app)), originalGeometry);
  assert.equal(pathData(currentPath(app)), originalPathData);
  assert.deepEqual(currentPath(app).metadata, originalMetadata);

  controller.remove();
  assert.equal(currentPath(app).expressiveStroke, undefined);
  assert.equal(pathGeometryFingerprint(currentPath(app)), originalGeometry);
  assert.equal(pathData(currentPath(app)), originalPathData);
  assert.deepEqual({ stroke: currentPath(app).stroke, strokeWidth: currentPath(app).strokeWidth }, ordinary);
});

test('geometry edit after expressive style assignment remains independent in existing History undo/redo', () => {
  const path = fixturePath();
  const app = appFixture(path);
  const stroke = new PathStrokeAppearanceController(app);
  const editor = new PathEditController(app);
  const geometryBefore = pathGeometryFingerprint(path);
  const metadataBefore = clone(path.metadata);

  stroke.assign(expressiveStyle());
  const styledBeforeEdit = clone(currentPath(app).expressiveStroke);
  editor.enter();
  editor.selectAnchor(0, 1);
  editor.moveSelectedAnchors(5, -3);

  const geometryAfter = pathGeometryFingerprint(currentPath(app));
  assert.notEqual(geometryAfter, geometryBefore);
  assert.deepEqual(currentPath(app).expressiveStroke, styledBeforeEdit);
  assert.deepEqual(currentPath(app).metadata, metadataBefore);
  assert.equal(currentPath(app).id, 'expressive-path');

  assert.equal(app.history.undo(), true);
  assert.equal(pathGeometryFingerprint(currentPath(app)), geometryBefore);
  assert.deepEqual(currentPath(app).expressiveStroke, styledBeforeEdit);

  assert.equal(app.history.undo(), true);
  assert.equal(pathGeometryFingerprint(currentPath(app)), geometryBefore);
  assert.equal(currentPath(app).expressiveStroke, undefined);

  assert.equal(app.history.redo(), true);
  assert.equal(pathGeometryFingerprint(currentPath(app)), geometryBefore);
  assert.deepEqual(currentPath(app).expressiveStroke, styledBeforeEdit);

  assert.equal(app.history.redo(), true);
  assert.equal(pathGeometryFingerprint(currentPath(app)), geometryAfter);
  assert.deepEqual(currentPath(app).expressiveStroke, styledBeforeEdit);
  assert.deepEqual(currentPath(app).metadata, metadataBefore);
});

test('expressive style survives file roundtrip and structured SVG keeps Path d with explicit ordinary-vector fallback', () => {
  const path = fixturePath({ id: 'roundtrip-expressive' });
  const app = appFixture(path);
  app.selection = [{ layerId: app.layer().id, objectId: path.id }];
  const stroke = new PathStrokeAppearanceController(app);
  const preset = BUILTIN_BRUSH_PRESETS.find(item => item.id === 'watercolor');
  assert.ok(preset);

  const geometryBefore = pathGeometryFingerprint(path);
  const dBefore = pathData(path);
  const metadataBefore = clone(path.metadata);
  const assignment = stroke.assignBrushPreset(preset, {
    color: '#7a4368',
    baseWidth: 18,
    taperStart: .3,
    taperEnd: .55
  });
  assert.equal(assignment.bridge.sourcePresetId, 'watercolor');
  assert.equal(assignment.bridge.fallback, 'ordinary-vector');
  assert.equal(assignment.bridge.rendererModel, 'deterministic-vector-approximation');
  assert.ok(assignment.bridge.degraded.includes('diffusion'));

  assert.ok(declaredDocumentExtensions(app.doc).includes(EXPRESSIVE_STROKE_EXTENSION));
  const envelope = wrapInkFile(app.doc);
  assert.ok(envelope.extensions.includes(EXPRESSIVE_STROKE_EXTENSION));

  const loaded = migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(envelope))));
  const loadedPath = findPageObject(loaded.pages[0], path.id).object;
  assert.equal(loaded.formatVersion, 4);
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(inspectDocument(loaded).passed, true);
  assert.equal(pathGeometryFingerprint(loadedPath), geometryBefore);
  assert.equal(pathData(loadedPath), dBefore);
  assert.deepEqual(loadedPath.metadata, metadataBefore);
  assert.equal(loadedPath.id, path.id);
  assert.deepEqual(loadedPath.expressiveStroke, currentPath(app, path.id).expressiveStroke);

  const svg = vectorObjectToSVG(loadedPath, []);
  assert.match(svg, /data-ink-expressive-stroke="INK-PATH-STROKE-APPEARANCE@1"/);
  assert.match(svg, /data-ink-expressive-fallback="ordinary-vector"/);
  assert.match(svg, /data-ink-profile-samples="/);
  assert.match(svg, /\sd="/);
  assert.doesNotMatch(svg, /<image\b/);

  const loadedApp = appFixture();
  loadedApp.doc = loaded;
  loadedApp.selection = [{ layerId: loadedApp.layer().id, objectId: loadedPath.id }];
  const loadedStroke = new PathStrokeAppearanceController(loadedApp);
  loadedStroke.remove();
  const ordinaryPath = currentPath(loadedApp, loadedPath.id);
  assert.equal(pathGeometryFingerprint(ordinaryPath), geometryBefore);
  assert.equal(pathData(ordinaryPath), dBefore);
  assert.equal(ordinaryPath.expressiveStroke, undefined);
  const ordinarySvg = vectorObjectToSVG(ordinaryPath, []);
  assert.doesNotMatch(ordinarySvg, /data-ink-expressive-stroke=/);
  assert.match(ordinarySvg, /stroke="#334455"/);
  assert.match(ordinarySvg, /stroke-width="2\.5"/);
});

test('busy History, hidden and locked Paths reject style mutation without corrupting History', () => {
  const path = fixturePath();
  const app = appFixture(path);
  const controller = new PathStrokeAppearanceController(app);
  const style = expressiveStyle();

  app.history.begin('busy');
  assert.throws(() => controller.assign(style), /HISTORY_BUSY/);
  app.history.cancel();
  assert.equal(app.history.undoStack.length, 0);

  path.visible = false;
  assert.throws(() => controller.assign(style), /TARGET_UNAVAILABLE/);
  path.visible = true;
  path.locked = true;
  assert.throws(() => controller.assign(style), /TARGET_UNAVAILABLE/);
  path.locked = false;

  assert.equal(app.history.undoStack.length, 0);
  assert.equal(path.expressiveStroke, undefined);
});

test('profile bounds and existing brush bridge stay bounded, deterministic and geometry-free', () => {
  const oversizeSamples = Array.from({ length: 100 }, (_, index) => ({
    t: index / 99,
    width: 1 + (index % 3) * .1,
    pressure: .5 + (index % 2) * .5
  }));
  const normalized = normalizeExpressiveStroke({
    color: '#111111',
    baseWidth: 5,
    profile: { samples: oversizeSamples },
    media: { engine: 'ink', seed: 1 }
  });
  assert.equal(normalized.profile.samples.length, EXPRESSIVE_STROKE_MAX_PROFILE_SAMPLES);
  assert.equal(validateExpressiveStroke(normalized).valid, true);
  assert.equal('subpaths' in normalized, false);
  assert.equal('anchors' in normalized, false);

  const preset = BUILTIN_BRUSH_PRESETS.find(item => item.id === 'dry-brush');
  const first = expressiveStrokeFromBrushPreset(preset, { color: '#222222', baseWidth: 11 });
  const second = expressiveStrokeFromBrushPreset(preset, { color: '#222222', baseWidth: 11 });
  assert.deepEqual(first, second);
  assert.equal(first.style.media.presetId, 'dry-brush');
  assert.equal(first.style.media.engine, 'dry');
  assert.equal(first.diagnostics.fallback, 'ordinary-vector');
  assert.ok(first.diagnostics.degraded.length > 0);
});
