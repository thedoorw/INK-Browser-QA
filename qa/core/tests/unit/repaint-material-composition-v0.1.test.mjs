import test from 'node:test';
import assert from 'node:assert/strict';

import { Matrix } from '../../../../product/source/src/core/index.js';
import { defaultDocument, findPageObject } from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { PathRepaintMaterialController } from '../../../../product/source/src/editor/repaint-material.js';
import { cloneCompositionObject } from '../../../../product/source/src/editor/composition.js';
import { createPath, pathData } from '../../../../product/source/src/vector/vector-core.js';
import { normalizeExpressiveStroke, pathGeometryFingerprint } from '../../../../product/source/src/vector/stroke-appearance.js';
import { resolvePathPaintAppearance } from '../../../../product/source/src/vector/paint-appearance.js';

const clone = value => JSON.parse(JSON.stringify(value));

function fixturePath(id, x = 0) {
  return createPath({
    id,
    matrix: Matrix.translate(x, 0),
    fill: '#eee8d8',
    stroke: '#343434',
    strokeWidth: 2,
    expressiveStroke: normalizeExpressiveStroke({ color: '#6f4152', baseWidth: 5 }),
    metadata: {
      source: 'repaint-composition-fixture',
      extraction: {
        schema: 'INK-EXTRACTION/1',
        batchId: 'batch-' + id,
        referenceObjectId: 'reference-' + id
      }
    },
    subpaths: [{
      id: id + ':outer',
      closed: true,
      role: 'outer',
      anchors: [
        { id: id + ':a0', x: 0, y: 0 },
        { id: id + ':a1', x: 36, y: 0 },
        { id: id + ':a2', x: 18, y: 28 }
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

const ref = (layer, path) => ({ layerId: layer.id, objectId: path.id });

test('three composed Paths repaint/materialize independently without geometry, transform, hierarchy or provenance changes', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const a = fixturePath('repaint-a', -60);
  const b = fixturePath('repaint-b', 0);
  const c = cloneCompositionObject(fixturePath('repaint-c-source', 60), {
    idFactory: (() => { let i = 0; return () => 'repaint-c-fresh-' + (++i); })()
  });
  layer.objects.push(a, b, c);

  doc.materialLibrary.templates.push({
    templateId: 'material:path-paper',
    templateVersion: '1.0.0',
    materialType: 'paper',
    metadata: {
      pathAppearance: {
        fill: '#d8d1bd',
        stroke: '#5c5549',
        texture: 'fibrous'
      }
    }
  });

  const app = makeApp(doc);
  const controller = new PathRepaintMaterialController(app);
  const orderBefore = layer.objects.map(object => object.id);
  const before = new Map([a, b, c].map(path => [path.id, {
    d: pathData(path),
    geometry: pathGeometryFingerprint(path),
    matrix: clone(path.matrix),
    metadata: clone(path.metadata),
    expressive: clone(path.expressiveStroke),
    parentId: path.parentId || null
  }]));

  const aResult = controller.repaint({ fill: '#b63c36' }, { refs: [ref(layer, a)] });
  const bResult = controller.applyMaterial({
    templateId: 'material:path-paper',
    parameterOverrides: { grain: 0.7 }
  }, { refs: [ref(layer, b)] });
  const cResult = controller.repaint({ stroke: '#2f718f' }, { refs: [ref(layer, c)] });

  assert.equal(aResult.changedCount, 1);
  assert.equal(bResult.changedCount, 1);
  assert.equal(cResult.changedCount, 1);

  const currentA = findPageObject(app.page(), a.id).object;
  const currentB = findPageObject(app.page(), b.id).object;
  const currentC = findPageObject(app.page(), c.id).object;

  assert.equal(currentA.fill, '#b63c36');
  assert.equal(currentA.materialAppearance, undefined);
  assert.equal(currentB.fill, '#eee8d8');
  assert.equal(currentB.materialAppearance.templateId, 'material:path-paper');
  assert.equal(currentC.stroke, '#2f718f');
  assert.equal(currentC.materialAppearance, undefined);

  for (const path of [currentA, currentB, currentC]) {
    const prior = before.get(path.id);
    assert.equal(pathData(path), prior.d);
    assert.equal(pathGeometryFingerprint(path), prior.geometry);
    assert.deepEqual(path.matrix, prior.matrix);
    assert.deepEqual(path.metadata, prior.metadata);
    assert.deepEqual(path.expressiveStroke, prior.expressive);
    assert.equal(path.parentId || null, prior.parentId);
  }

  assert.deepEqual(layer.objects.map(object => object.id), orderBefore);

  const renderedB = resolvePathPaintAppearance(currentB, app.doc);
  assert.equal(renderedB.fill, '#d8d1bd');
  assert.equal(renderedB.stroke, '#5c5549');
  assert.equal(renderedB.diagnostics.mode, 'material-template-path-appearance');
  assert.equal(renderedB.diagnostics.unsupportedMaterialEffect, true);
  assert.deepEqual(renderedB.diagnostics.unsupportedAppearanceKeys, ['texture']);
  assert.deepEqual(renderedB.diagnostics.ignoredParameterOverrides, ['grain']);
});

test('multi-selection repaint changes only requested appearance fields and deterministic no-op adds no History entry', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const a = fixturePath('multi-a', -30);
  const b = fixturePath('multi-b', 30);
  layer.objects.push(a, b);
  const app = makeApp(doc);
  const controller = new PathRepaintMaterialController(app);
  const refs = [ref(layer, a), ref(layer, b)];

  const first = controller.repaint({ fill: '#d18b2f', opacity: 0.75 }, { refs });
  assert.equal(first.changedCount, 2);
  assert.equal(app.history.undoStack.length, 1);

  const second = controller.repaint({ fill: '#d18b2f', opacity: 0.75 }, { refs });
  assert.equal(second.changed, false);
  assert.equal(second.changedCount, 0);
  assert.equal(app.history.undoStack.length, 1);
});
