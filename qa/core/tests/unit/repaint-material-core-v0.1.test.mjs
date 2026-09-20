import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import { Matrix } from '../../../../product/source/src/core/index.js';
import {
  defaultDocument,
  findPageObject,
  inspectDocument,
  migrateDocument,
  unwrapInkFile,
  wrapInkFile
} from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { PathRepaintMaterialController } from '../../../../product/source/src/editor/repaint-material.js';
import { createPath, pathData, vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';
import { normalizeExpressiveStroke, pathGeometryFingerprint } from '../../../../product/source/src/vector/stroke-appearance.js';

const clone = value => JSON.parse(JSON.stringify(value));

function fixturePath(id = 'repaint-regression') {
  return createPath({
    id,
    fill: '#e6dfcf',
    stroke: '#403b37',
    strokeWidth: 3,
    expressiveStroke: normalizeExpressiveStroke({
      color: '#75445d',
      baseWidth: 6,
      media: { engine: 'ink', seed: 17 }
    }),
    metadata: {
      source: 'repaint-regression',
      extraction: {
        schema: 'INK-EXTRACTION/1',
        batchId: 'batch-regression',
        referenceObjectId: 'reference-regression',
        source: { name: 'fixture.png', sha256: 'fixture-sha' }
      }
    },
    subpaths: [{
      id: id + ':outer',
      closed: true,
      role: 'outer',
      anchors: [
        { id: id + ':a0', x: 0, y: 0 },
        { id: id + ':a1', x: 40, y: 0 },
        { id: id + ':a2', x: 42, y: 32 },
        { id: id + ':a3', x: 0, y: 30 }
      ]
    }]
  });
}

function makeApp(doc) {
  const app = {
    doc,
    selection: [],
    page() { return this.doc.pages[0]; },
    objectPath(found) { return found ? ['pages', 0, ...found.path] : null; },
    queueSpatialObject() {},
    refreshAll() {},
    markDirty() {},
    updateHistoryUI() {},
    replaceDocument(next) { this.doc = next; }
  };
  app.history = new HistoryManager(app);
  return app;
}

test('appearance History is independent from geometry History and undo/redo restores each layer of state', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const path = fixturePath();
  layer.objects.push(path);
  const app = makeApp(doc);
  const controller = new PathRepaintMaterialController(app);
  const ref = { layerId: layer.id, objectId: path.id };

  const originalX = path.subpaths[0].anchors[0].x;
  const originalFill = path.fill;
  const originalGeometry = pathGeometryFingerprint(path);

  let found = findPageObject(app.page(), ref);
  app.history.pushScoped('geometry edit', [app.objectPath(found)], () => {
    found.object.subpaths[0].anchors[0].x += 9;
  });
  const editedGeometry = pathGeometryFingerprint(found.object);
  assert.notEqual(editedGeometry, originalGeometry);

  controller.repaint({ fill: '#b63c36' }, { refs: [ref] });
  assert.equal(app.history.undoStack.length, 2);
  assert.equal(findPageObject(app.page(), ref).object.fill, '#b63c36');

  assert.equal(app.history.undo(), true);
  found = findPageObject(app.page(), ref);
  assert.equal(found.object.fill, originalFill);
  assert.equal(found.object.subpaths[0].anchors[0].x, originalX + 9);

  assert.equal(app.history.undo(), true);
  found = findPageObject(app.page(), ref);
  assert.equal(found.object.subpaths[0].anchors[0].x, originalX);
  assert.equal(found.object.fill, originalFill);

  assert.equal(app.history.redo(), true);
  assert.equal(findPageObject(app.page(), ref).object.subpaths[0].anchors[0].x, originalX + 9);
  assert.equal(app.history.redo(), true);
  assert.equal(findPageObject(app.page(), ref).object.fill, '#b63c36');
});

test('repaint/material survives native file roundtrip with provenance, expressive stroke and structured SVG fallback', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const path = fixturePath('roundtrip-material');
  layer.objects.push(path);
  const app = makeApp(doc);
  const controller = new PathRepaintMaterialController(app);
  const ref = { layerId: layer.id, objectId: path.id };
  const geometryBefore = pathGeometryFingerprint(path);
  const dataBefore = pathData(path);
  const metadataBefore = clone(path.metadata);
  const expressiveBefore = clone(path.expressiveStroke);

  controller.repaint({ fill: '#d7c64b', stroke: '#2f718f', opacity: 0.68 }, { refs: [ref] });
  controller.applyMaterial({
    templateId: 'material:unsupported-natural',
    templateVersion: '1.2.0',
    parameterOverrides: { wetness: 0.8 }
  }, { refs: [ref] });

  const envelope = wrapInkFile(app.doc);
  assert.ok(envelope.extensions.includes('ink.path-material-appearance.v1'));
  const loaded = migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(envelope))));
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(loaded.formatVersion, 4);
  assert.equal(inspectDocument(loaded).passed, true);

  const loadedPath = findPageObject(loaded.pages[0], path.id).object;
  assert.equal(pathData(loadedPath), dataBefore);
  assert.equal(pathGeometryFingerprint(loadedPath), geometryBefore);
  const { semanticLabel, ...loadedMetadata } = loadedPath.metadata;
  assert.equal(semanticLabel, loadedPath.semantic.role);
  assert.deepEqual(loadedMetadata, metadataBefore);
  assert.deepEqual(loadedPath.expressiveStroke, expressiveBefore);
  assert.equal(loadedPath.fill, '#d7c64b');
  assert.equal(loadedPath.stroke, '#2f718f');
  assert.equal(loadedPath.opacity, 0.68);
  assert.equal(loadedPath.materialAppearance.templateId, 'material:unsupported-natural');
  assert.equal(loadedPath.materialAppearance.fallback.fill, '#d7c64b');
  assert.equal(loadedPath.materialAppearance.fallback.stroke, '#2f718f');

  const svg = vectorObjectToSVG(loadedPath, []);
  assert.match(svg, /data-ink-type="path"/);
  assert.match(svg, /data-ink-material-ref="material:unsupported-natural"/);
  assert.match(svg, /data-ink-material-fallback="ordinary-vector"/);
  assert.match(svg, /data-ink-expressive-fallback="ordinary-vector"/);
  assert.match(svg, /fill="#d7c64b"/);
  assert.match(svg, / d="/);
  assert.doesNotMatch(svg, /<image\b/);
});

test('repaint only changes expressive stroke color when explicitly requested', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const path = fixturePath('expressive-retention');
  layer.objects.push(path);
  const app = makeApp(doc);
  const controller = new PathRepaintMaterialController(app);
  const ref = { layerId: layer.id, objectId: path.id };
  const before = clone(path.expressiveStroke);

  controller.repaint({ stroke: '#3d875d' }, { refs: [ref] });
  assert.deepEqual(findPageObject(app.page(), ref).object.expressiveStroke, before);

  controller.repaint({ expressiveStrokeColor: '#202020' }, { refs: [ref] });
  const after = findPageObject(app.page(), ref).object.expressiveStroke;
  assert.equal(after.color, '#202020');
  assert.equal(after.baseWidth, before.baseWidth);
  assert.deepEqual(after.profile, before.profile);
  assert.deepEqual(after.media, before.media);
});

test('locked hidden stale singular and busy-History targets are rejected before appearance mutation', () => {
  const fresh = () => {
    const doc = defaultDocument();
    const layer = doc.pages[0].layers[0];
    const path = fixturePath('guard-path');
    layer.objects.push(path);
    const app = makeApp(doc);
    return { app, layer, path, controller: new PathRepaintMaterialController(app), ref: { layerId: layer.id, objectId: path.id } };
  };

  {
    const { app, layer, controller, ref } = fresh();
    layer.locked = true;
    assert.throws(() => controller.repaint({ fill: '#fff' }, { refs: [ref] }), /LOCKED_TARGET/);
    assert.equal(app.history.undoStack.length, 0);
  }
  {
    const { app, layer, controller, ref } = fresh();
    layer.visible = false;
    assert.throws(() => controller.repaint({ fill: '#fff' }, { refs: [ref] }), /HIDDEN_TARGET/);
    assert.equal(app.history.undoStack.length, 0);
  }
  {
    const { app, layer, controller } = fresh();
    assert.throws(() => controller.repaint({ fill: '#fff' }, { refs: [{ layerId: layer.id, objectId: 'missing' }] }), /STALE_SELECTION/);
    assert.equal(app.history.undoStack.length, 0);
  }
  {
    const { app, path, controller, ref } = fresh();
    path.matrix = [0, 0, 0, 1, 0, 0];
    assert.throws(() => controller.repaint({ fill: '#fff' }, { refs: [ref] }), /SINGULAR_TARGET/);
    assert.equal(app.history.undoStack.length, 0);
  }
  {
    const { app, controller, ref } = fresh();
    app.history.begin('busy');
    assert.throws(() => controller.repaint({ fill: '#fff' }, { refs: [ref] }), /HISTORY_BUSY/);
    app.history.cancel();
    assert.equal(app.history.undoStack.length, 0);
  }
});
