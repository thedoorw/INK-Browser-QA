import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import { Matrix } from '../../../../product/source/src/core/index.js';
import {
  defaultDocument, findPageObject, inspectDocument, migrateDocument, unwrapInkFile, wrapInkFile
} from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { PathEditController } from '../../../../product/source/src/editor/path-edit.js';
import { createPath, vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));
const geometry = path => clone(path.subpaths);
const anchorIds = path => path.subpaths.map(subpath => subpath.anchors.map(anchor => anchor.id));
const nearly = (a, b, epsilon = 1e-8) => Math.abs(a - b) <= epsilon;

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

function nativePath({
  id = 'path-native',
  metadata = { source: 'native' },
  closed = false,
  role = 'outer',
  anchors = null
} = {}) {
  return createPath({
    id,
    metadata,
    subpaths: [{
      id: `${id}:outer`,
      closed,
      role,
      anchors: anchors || [
        { id: `${id}:a0`, x: 0, y: 0, in: { x: 0, y: 0 }, out: { x: 8, y: 0 }, mode: 'corner' },
        { id: `${id}:a1`, x: 20, y: 10, in: { x: -5, y: 0 }, out: { x: 5, y: 0 }, mode: 'smooth' },
        { id: `${id}:a2`, x: 40, y: 0, in: { x: -8, y: 0 }, out: { x: 0, y: 0 }, mode: 'corner' },
        { id: `${id}:a3`, x: 60, y: 10, in: { x: 0, y: 0 }, out: { x: 0, y: 0 }, mode: 'corner' }
      ]
    }]
  });
}

function cubicPoint(from, to, t) {
  const p0 = { x: from.x, y: from.y };
  const p1 = { x: from.x + from.out.x, y: from.y + from.out.y };
  const p2 = { x: to.x + to.in.x, y: to.y + to.in.y };
  const p3 = { x: to.x, y: to.y };
  const u = 1 - t;
  return {
    x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
    y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y
  };
}

test('path edit state is selection-only and rejects busy, hidden, locked, singular and stale targets', () => {
  const path = nativePath();
  const app = appFixture(path);
  const editor = new PathEditController(app);
  const before = geometry(path);

  assert.equal(editor.enter().active, true);
  editor.selectAnchor(0, 0);
  editor.selectAnchor(0, 1, { add: true });
  editor.selectHandle(0, 1, 'out');
  assert.deepEqual(geometry(path), before);
  assert.equal(app.history.undoStack.length, 0);
  editor.exit();

  app.history.begin('busy');
  assert.throws(() => editor.enter(), /HISTORY_BUSY/);
  app.history.cancel();

  path.visible = false;
  assert.throws(() => editor.enter(), /TARGET_UNAVAILABLE/);
  path.visible = true;
  path.locked = true;
  assert.throws(() => editor.enter(), /TARGET_UNAVAILABLE/);
  path.locked = false;

  path.matrix = [0,0,0,1,0,0];
  assert.throws(() => editor.enter(), /SINGULAR_TARGET/);
  path.matrix = Matrix.identity();

  editor.enter();
  app.doc = defaultDocument();
  assert.throws(() => editor.resolve(), /STALE_TARGET/);
});

test('anchor, handle and mode edits use scoped History and undo/redo exact geometry without changing IDs', () => {
  const path = nativePath();
  const app = appFixture(path);
  const editor = new PathEditController(app);
  editor.enter();

  const original = geometry(path);
  const ids = anchorIds(path);
  editor.selectAnchors([{ subpathIndex: 0, anchorIndex: 0 }, { subpathIndex: 0, anchorIndex: 1 }]);
  editor.moveSelectedAnchors(3, -2);
  const moved = geometry(app.layer().objects[0]);
  assert.notDeepEqual(moved, original);
  assert.deepEqual(anchorIds(app.layer().objects[0]), ids);
  assert.equal(app.layer().objects[0].id, 'path-native');

  assert.equal(app.history.undo(), true);
  assert.deepEqual(geometry(app.layer().objects[0]), original);
  assert.equal(app.history.redo(), true);
  assert.deepEqual(geometry(app.layer().objects[0]), moved);

  editor.selectAnchor(0, 1);
  editor.setSelectedAnchorMode('symmetric');
  const modeGeometry = geometry(app.layer().objects[0]);
  assert.equal(app.layer().objects[0].subpaths[0].anchors[1].mode, 'symmetric');
  assert.equal(app.history.undo(), true);
  assert.deepEqual(geometry(app.layer().objects[0]), moved);
  assert.equal(app.history.redo(), true);
  assert.deepEqual(geometry(app.layer().objects[0]), modeGeometry);

  editor.selectHandle(0, 1, 'out');
  editor.moveSelectedHandle(12, 6);
  const handled = geometry(app.layer().objects[0]);
  const node = app.layer().objects[0].subpaths[0].anchors[1];
  assert.deepEqual(node.out, { x: 12, y: 6 });
  assert.ok(nearly(Math.hypot(node.in.x, node.in.y), Math.hypot(node.out.x, node.out.y)));
  assert.equal(app.history.undo(), true);
  assert.deepEqual(geometry(app.layer().objects[0]), modeGeometry);
  assert.equal(app.history.redo(), true);
  assert.deepEqual(geometry(app.layer().objects[0]), handled);

  const count = app.history.undoStack.length;
  editor.selectAnchor(0, 0);
  editor.moveSelectedAnchors(0, 0);
  assert.equal(app.history.undoStack.length, count);
});

test('topology insertion preserves cubic geometry; deletion and open/close protect viable path topology and roles', () => {
  const path = createPath({
    id: 'topology-path',
    metadata: { keep: true },
    subpaths: [
      {
        id: 'topology-path:outer',
        closed: false,
        role: 'outer',
        anchors: [
          { id: 'outer-a', x: 0, y: 0, in: {x:0,y:0}, out: {x:30,y:50}, mode: 'corner' },
          { id: 'outer-b', x: 100, y: 0, in: {x:-30,y:50}, out: {x:0,y:0}, mode: 'corner' }
        ]
      },
      {
        id: 'topology-path:hole',
        closed: true,
        role: 'hole',
        anchors: [
          { id: 'hole-a', x: 30, y: 10 },
          { id: 'hole-b', x: 45, y: 25 },
          { id: 'hole-c', x: 60, y: 10 }
        ]
      }
    ]
  });
  const app = appFixture(path);
  const editor = new PathEditController(app);
  editor.enter();

  const outerBefore = clone(path.subpaths[0].anchors);
  const oldIds = outerBefore.map(anchor => anchor.id);
  const quarter = cubicPoint(outerBefore[0], outerBefore[1], .25);
  const midpoint = cubicPoint(outerBefore[0], outerBefore[1], .5);
  const threeQuarter = cubicPoint(outerBefore[0], outerBefore[1], .75);

  const inserted = editor.addAnchorOnSegment(0, 0, .5);
  const outer = app.layer().objects[0].subpaths[0].anchors;
  assert.equal(outer.length, 3);
  assert.deepEqual([outer[0].id, outer[2].id], oldIds);
  assert.notEqual(outer[1].id, oldIds[0]);
  assert.notEqual(outer[1].id, oldIds[1]);
  assert.ok(nearly(outer[1].x, midpoint.x));
  assert.ok(nearly(outer[1].y, midpoint.y));

  const splitQuarter = cubicPoint(outer[0], outer[1], .5);
  const splitThreeQuarter = cubicPoint(outer[1], outer[2], .5);
  assert.ok(nearly(splitQuarter.x, quarter.x) && nearly(splitQuarter.y, quarter.y));
  assert.ok(nearly(splitThreeQuarter.x, threeQuarter.x) && nearly(splitThreeQuarter.y, threeQuarter.y));
  assert.equal(inserted.insertedAnchorId, outer[1].id);
  assert.deepEqual(app.layer().objects[0].subpaths.map(subpath => subpath.role), ['outer', 'hole']);

  editor.setSubpathClosed(0, true);
  assert.equal(app.layer().objects[0].subpaths[0].closed, true);
  const historyCount = app.history.undoStack.length;
  editor.selectAnchor(0, 1);
  assert.throws(() => editor.deleteSelectedAnchors(), /CLOSED_PATH_MINIMUM_ANCHORS/);
  assert.equal(app.history.undoStack.length, historyCount);

  editor.setSubpathClosed(0, false);
  editor.selectAnchor(0, 1);
  editor.deleteSelectedAnchors();
  assert.equal(app.layer().objects[0].subpaths[0].anchors.length, 2);
  const openHistoryCount = app.history.undoStack.length;
  editor.selectAnchor(0, 0);
  assert.throws(() => editor.deleteSelectedAnchors(), /OPEN_PATH_MINIMUM_ANCHORS/);
  assert.equal(app.history.undoStack.length, openHistoryCount);
  assert.equal(app.layer().objects[0].id, 'topology-path');
  assert.deepEqual(app.layer().objects[0].metadata, { keep: true });
});

test('bounded simplify/refine is deterministic, diagnostic and preserves extraction provenance', () => {
  const metadata = {
    extraction: {
      schema: 'INK-EXTRACTION/1',
      batchId: 'batch-1',
      referenceObjectId: 'reference-1',
      source: { name: 'fixture' }
    }
  };
  const path = nativePath({
    id: 'extracted-path',
    metadata,
    anchors: [
      { id: 'n0', x: 0, y: 0 },
      { id: 'n1', x: 10, y: 0 },
      { id: 'n2', x: 20, y: 0 },
      { id: 'n3', x: 30, y: 0 }
    ]
  });
  const app = appFixture(path);
  const editor = new PathEditController(app);
  editor.enter();
  const metadataBefore = clone(path.metadata);

  const simplify = editor.simplify({ tolerance: 0.01, handleTolerance: 0, maxPasses: 8 });
  assert.equal(simplify.operation, 'simplify');
  assert.equal(simplify.beforeNodeCount, 4);
  assert.equal(simplify.afterNodeCount, 2);
  assert.equal(simplify.removedNodeCount, 2);
  assert.deepEqual(app.layer().objects[0].metadata, metadataBefore);
  assert.equal(app.layer().objects[0].id, 'extracted-path');

  assert.equal(app.history.undo(), true);
  assert.equal(app.layer().objects[0].subpaths[0].anchors.length, 4);
  assert.deepEqual(app.layer().objects[0].metadata, metadataBefore);
  assert.equal(app.history.redo(), true);
  assert.equal(app.layer().objects[0].subpaths[0].anchors.length, 2);

  const refine = editor.refine({ maxControlLength: 8, maxAddedAnchors: 16 });
  assert.equal(refine.operation, 'refine');
  assert.ok(refine.addedNodeCount > 0);
  assert.equal(refine.truncated, false);
  assert.ok(refine.afterNodeCount > refine.beforeNodeCount);
  assert.deepEqual(app.layer().objects[0].metadata, metadataBefore);
  assert.equal(app.layer().objects[0].subpaths[0].closed, false);
  assert.equal(app.layer().objects[0].subpaths[0].role, 'outer');
});

test('edited path survives save/load, migration, integrity and structured SVG with FORMAT_VERSION 4', () => {
  const metadata = { extraction: { schema: 'INK-EXTRACTION/1', batchId: 'b', referenceObjectId: 'r' } };
  const path = nativePath({ id: 'roundtrip-path', metadata });
  const app = appFixture(path);
  const editor = new PathEditController(app);
  editor.enter();
  editor.selectAnchor(0, 1);
  editor.moveSelectedAnchors(4, 7);
  editor.selectHandle(0, 1, 'out');
  editor.moveSelectedHandle(9, -3);
  editor.addAnchorOnSegment(0, 1, .4);

  const beforeGeometry = geometry(app.layer().objects[0]);
  const beforeMetadata = clone(app.layer().objects[0].metadata);
  const beforeId = app.layer().objects[0].id;

  const envelope = wrapInkFile(app.doc);
  const loaded = migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(envelope))));
  const loadedPath = findPageObject(loaded.pages[0], beforeId).object;
  assert.deepEqual(geometry(loadedPath), beforeGeometry);
  const { semanticLabel, ...loadedMetadata } = loadedPath.metadata;
  assert.equal(semanticLabel, loadedPath.semantic.role);
  assert.deepEqual(loadedMetadata, beforeMetadata);
  assert.equal(loadedPath.id, beforeId);
  assert.equal(loaded.formatVersion, 4);
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(inspectDocument(loaded).passed, true);

  const historical = clone(app.doc);
  historical.formatVersion = 3;
  const migratedHistorical = migrateDocument(historical);
  assert.deepEqual(geometry(findPageObject(migratedHistorical.pages[0], beforeId).object), beforeGeometry);
  assert.equal(migratedHistorical.formatVersion, 4);

  const svg = vectorObjectToSVG(loadedPath, []);
  assert.match(svg, /<path\b/);
  assert.match(svg, /\sd="/);
  assert.doesNotMatch(svg, /<image\b/);
});
