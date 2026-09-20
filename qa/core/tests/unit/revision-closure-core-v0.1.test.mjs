import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import {
  InkStore,
  RevisionController,
  compareRevisionDocuments,
  inspectRevisionRecord
} from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { createPath } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function fixtureDocument() {
  const now = '2026-09-20T12:00:00.000Z';
  const path = createPath({
    id: 'path-a',
    fill: '#e6dfcf',
    stroke: '#403b37',
    strokeWidth: 2,
    metadata: {
      extraction: {
        schema: 'INK-EXTRACTION/1',
        batchId: 'batch-a',
        referenceObjectId: 'reference-a',
        source: { name: 'fixture.png' }
      }
    },
    subpaths: [{
      id: 'path-a:outer',
      closed: true,
      role: 'outer',
      anchors: [
        { id: 'a0', x: 0, y: 0 },
        { id: 'a1', x: 30, y: 0 },
        { id: 'a2', x: 30, y: 20 },
        { id: 'a3', x: 0, y: 20 }
      ]
    }]
  });
  return {
    format: 'INK',
    formatVersion: FORMAT_VERSION,
    appVersion: '1.6.5-RC',
    id: 'doc-revision-fixture',
    title: 'Revision Fixture',
    createdAt: now,
    modifiedAt: now,
    activePageId: 'page-a',
    pages: [{
      id: 'page-a',
      name: 'Page A',
      artboard: { mode: 'fixed', preset: 'A4', orientation: 'portrait', widthMm: 210, heightMm: 297, ppi: 300, bleedMm: 3, safeMarginMm: 5, showBleed: false, showSafe: false, clipContent: true, backgroundColor: '#fffef9' },
      workspace: {
        activeSpace: 'creation',
        showLayoutFrameInCreation: false,
        layoutViewport: { x: 0, y: 0, scale: 1, rotation: 0 },
        cameras: {
          creation: { x: 0, y: 0, scale: 1, rotation: 0 },
          layout: { x: 0, y: 0, scale: 0.65, rotation: 0 }
        },
        visited: { creation: true, layout: false }
      },
      camera: { x: 0, y: 0, scale: 1, rotation: 0 },
      paper: { type: 'blank', color: '#fffef9', gridSize: 32, absorbency: .58, roughness: .42, fiberStrength: .36, fiberAngle: 0, sizing: .28, granulation: .32, seed: 1337, textureVisible: true },
      activeLayerId: 'layer-a',
      layers: [{ id: 'layer-a', name: 'Layer A', visible: true, locked: false, opacity: 1, objects: [path] }]
    }],
    programAssets: [],
    referencePackages: [],
    strokeSessions: [],
    brushPackages: [],
    vectorBrushLibrary: { format: 'INK-VECTOR-BRUSH-LIBRARY', version: '1.0', materials: [] },
    handDrawingReports: [],
    deviceCalibrationProfiles: [],
    deviceValidationReports: [],
    interactivePerformanceReports: [],
    ai: { permission: 'PROPOSE', selection: [], semanticTargets: [], unresolvedTargets: [], checkpoints: [], recipes: [], audit: [], variants: [], missingDependencies: [] },
    semanticModel: { format: 'INK-SEMANTIC-MODEL', version: '1.0', migrationStrategy: 'NATIVE', relationshipGraph: { format: 'INK-SEMANTIC-RELATIONSHIP-GRAPH', version: '1.0', nodes: [], edges: [] } },
    materialLibrary: { format: 'INK-MATERIAL-LIBRARY', version: '1.0', templates: [] },
    dependencyModel: { format: 'INK-DOCUMENT-DEPENDENCY-MODEL', version: '1.0', edges: [] },
    assetManifest: { format: 'INK-DOCUMENT-ASSET-MANIFEST', version: '1.0', mode: 'Linked Document', assets: [] },
    deviceReplayProfileSelection: 'ORIGINAL_OR_CURRENT_SELECTABLE',
    drawingGapRanking: null,
    recentColors: ['#202020']
  };
}

function makeApp(store = new InkStore()) {
  const app = {
    doc: fixtureDocument(),
    store,
    selection: [],
    draft: null,
    strokeEdit: null,
    dirty: false,
    updateHistoryUI() {},
    refreshAll() {},
    renderer: { render() {} },
    markDirty() { this.dirty = true; },
    replaceDocument(next, { fromHistory = false } = {}) {
      this.doc = clone(next);
      this.selection = [];
      this.draft = null;
      this.strokeEdit = null;
      if (!fromHistory) {
        this.history.clear();
        this.dirty = false;
      }
    }
  };
  app.history = new HistoryManager(app);
  app.revisions = new RevisionController(app, { store });
  return app;
}

test('Revision capture is mutation-neutral, deterministic and equivalent capture is a no-op', async () => {
  const app = makeApp();
  const before = clone(app.doc);
  const first = await app.revisions.capture({
    createdAt: '2026-09-20T12:01:00.000Z',
    reason: 'checkpoint',
    label: 'First'
  });

  assert.equal(first.created, true);
  assert.equal(first.equivalent, false);
  assert.deepEqual(app.doc, before);
  assert.equal(inspectRevisionRecord(first.record).valid, true);
  assert.equal(first.record.documentFingerprint, first.comparison.afterDocumentFingerprint);
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(app.doc.formatVersion, 4);

  const second = await app.revisions.capture({
    createdAt: '2026-09-20T12:02:00.000Z',
    reason: 'checkpoint',
    label: 'Equivalent'
  });
  assert.equal(second.created, false);
  assert.equal(second.equivalent, true);
  assert.equal(second.record.revisionId, first.record.revisionId);
  assert.equal((await app.revisions.list()).length, 1);
  assert.deepEqual(app.doc, before);
});

test('Revision comparison reports deterministic changed object/facet metadata', async () => {
  const app = makeApp();
  const first = await app.revisions.capture({ createdAt: '2026-09-20T12:01:00.000Z' });
  app.doc.pages[0].layers[0].objects[0].fill = '#b63c36';
  const directA = compareRevisionDocuments(first.record.envelope.document, app.doc);
  const directB = compareRevisionDocuments(first.record.envelope.document, app.doc);
  assert.deepEqual(directB, directA);
  assert.equal(directA.objectCounts.changed, 1);
  assert.deepEqual(directA.changedObjectIds, ['path-a']);
  assert.equal(directA.fingerprints.geometry.before, directA.fingerprints.geometry.after);
  assert.notEqual(directA.fingerprints.appearance.before, directA.fingerprints.appearance.after);

  const second = await app.revisions.capture({ createdAt: '2026-09-20T12:02:00.000Z' });
  assert.equal(second.record.parentRevisionId, first.record.revisionId);
  assert.equal(second.record.sequence, 2);
  assert.deepEqual(second.comparison.changedObjectIds, ['path-a']);
});

test('Revision persistence reopens through existing browser-local InkStore', async () => {
  const store = new InkStore();
  const app = makeApp(store);
  const first = await app.revisions.capture({ createdAt: '2026-09-20T12:01:00.000Z' });

  const reopenedApp = makeApp(store);
  const loaded = await reopenedApp.revisions.loadRecord(first.record.revisionId, { documentId: app.doc.id });
  assert.ok(loaded);
  assert.equal(loaded.revisionId, first.record.revisionId);
  assert.equal(inspectRevisionRecord(loaded).valid, true);
  const listed = await reopenedApp.revisions.list(app.doc.id);
  assert.deepEqual(listed.map(item => item.revisionId), [first.record.revisionId]);
});

test('Revision restore preserves structured Path/provenance and creates an explicit History boundary', async () => {
  const app = makeApp();
  const first = await app.revisions.capture({ createdAt: '2026-09-20T12:01:00.000Z' });
  const original = clone(first.record.envelope.document);

  app.history.push('local edit', () => {
    const path = app.doc.pages[0].layers[0].objects[0];
    path.fill = '#b63c36';
    path.subpaths[0].anchors[1].x = 46;
    path.materialAppearance = {
      format: 'INK-PATH-MATERIAL-APPEARANCE',
      version: 1,
      templateId: 'paper-wash',
      templateVersion: '1',
      parameterOverrides: {},
      fallback: { fill: '#b63c36' }
    };
  });
  assert.equal(app.history.undoStack.length, 1);

  const result = await app.revisions.restore(first.record);
  assert.equal(result.restored, true);
  assert.equal(result.historyBoundary, 'RESET_TO_REVISION');
  assert.deepEqual(app.doc, original);
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.history.redoStack.length, 0);
  assert.equal(app.doc.pages[0].layers[0].objects[0].metadata.extraction.referenceObjectId, 'reference-a');
  assert.equal(app.revisions.revisionIdFor(app.doc.id), first.record.revisionId);
});

test('Corrupt revision is rejected before mutation and failed apply rolls back document + History atomically', async () => {
  const app = makeApp();
  const first = await app.revisions.capture({ createdAt: '2026-09-20T12:01:00.000Z' });

  app.history.push('pre-existing edit', () => {
    app.doc.pages[0].layers[0].objects[0].fill = '#3d875d';
  });
  const beforeCorrupt = clone(app.doc);
  const beforeCorruptHistory = clone(app.history.undoStack);

  const corrupt = clone(first.record);
  corrupt.envelope.document.pages[0].layers[0].objects[0].fill = '#ff00ff';
  await assert.rejects(() => app.revisions.restore(corrupt));
  assert.deepEqual(app.doc, beforeCorrupt);
  assert.deepEqual(app.history.undoStack, beforeCorruptHistory);

  const originalReplace = app.replaceDocument.bind(app);
  let failNext = true;
  app.replaceDocument = function replaceWithInjectedFailure(next, options = {}) {
    originalReplace(next, options);
    if (failNext && !options.fromHistory) {
      failNext = false;
      this.doc.title = 'injected-corruption';
      throw Object.assign(new Error('forced restore failure'), { code: 'FORCED_RESTORE_FAILURE' });
    }
  };

  const beforeFailure = clone(app.doc);
  const beforeFailureHistory = clone(app.history.undoStack);
  await assert.rejects(
    () => app.revisions.restore(first.record),
    error => error?.code === 'revision-restore-failed'
  );
  assert.deepEqual(app.doc, beforeFailure);
  assert.deepEqual(app.history.undoStack, beforeFailureHistory);
  assert.equal(app.history.pending, null);
});

test('Revision capture refuses a busy History transaction', async () => {
  const app = makeApp();
  app.history.begin('pending');
  await assert.rejects(
    () => app.revisions.capture(),
    error => error?.code === 'revision-history-busy'
  );
  app.history.cancel();
});
