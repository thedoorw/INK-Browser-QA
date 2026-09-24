import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { PathRepaintMaterialController } from '../product/source/src/editor/repaint-material.js';
import {
  ChatBoundedEditController,
  createChatBoundedEditAdapter
} from '../product/source/src/editor/chat-bounded-edit.js';
import { createPath } from '../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function phasePath(id, { fill = null, stroke = null, strokeWidth = 0, sourceColorObjectId = null } = {}) {
  return createPath({
    id,
    name: id,
    fill,
    stroke,
    strokeWidth,
    metadata: {
      source: { type: 'reference', id: 'f'.repeat(64), name: 'phase-c-reference.png' },
      decomposition: {
        schema: 'INK-REFERENCE-DECOMPOSITION/1',
        referenceObjectId: 'reference-phase-c',
        sourceColorObjectId
      }
    },
    subpaths: [{
      id: id + ':outer',
      role: 'outer',
      closed: true,
      anchors: [
        { id: id + ':a0', x: 0, y: 0 },
        { id: id + ':a1', x: 24, y: 0 },
        { id: id + ':a2', x: 24, y: 18 },
        { id: id + ':a3', x: 0, y: 18 }
      ]
    }]
  });
}

function makePhaseCApp() {
  const doc = defaultDocument();
  doc.id = 'doc-phase-c';
  const page = doc.pages[0];
  const sourceLayer = page.layers[0];
  sourceLayer.id = 'source-layer-phase-c';
  sourceLayer.name = 'Reference';
  sourceLayer.objects.push({
    id: 'reference-phase-c',
    type: 'image',
    name: 'Reference · phase-c-reference.png',
    visible: true,
    locked: false,
    opacity: 1,
    matrix: [1, 0, 0, 1, 0, 0],
    w: 640,
    h: 480,
    metadata: {
      referenceImport: {
        operation: 'reference.import',
        source: { sha256: 'f'.repeat(64), name: 'phase-c-reference.png' }
      }
    }
  });

  const colorObjects = [
    phasePath('color-phase-c-1', { fill: '#d16a5a' }),
    phasePath('color-phase-c-2', { fill: '#5a8d6b' })
  ];
  const lineObjects = [
    phasePath('line-phase-c-1', { stroke: '#202020', strokeWidth: 1, sourceColorObjectId: 'color-phase-c-1' }),
    phasePath('line-phase-c-2', { stroke: '#202020', strokeWidth: 1, sourceColorObjectId: 'color-phase-c-2' })
  ];
  const colorLayer = { id: 'color-layer-phase-c', name: 'Color', visible: true, locked: false, opacity: 1, objects: colorObjects };
  const lineLayer = { id: 'line-layer-phase-c', name: 'Line', visible: true, locked: false, opacity: 1, objects: lineObjects };
  page.layers.push(colorLayer, lineLayer);
  page.activeLayerId = lineLayer.id;

  const app = {
    doc,
    selection: [],
    page() { return this.doc.pages[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    objectPath(found) { return found ? ['pages', 0, ...found.path] : null; },
    queueSpatialObject() {},
    refreshAll() {},
    refreshSelectionUI() {},
    renderer: { render() {} },
    markDirty() {},
    updateHistoryUI() {},
    replaceDocument(next) { this.doc = next; },
    revisions: { revisionIdFor() { return 'revision-phase-c'; } }
  };
  app.history = new HistoryManager(app);
  app.pathRepaintMaterial = new PathRepaintMaterialController(app);
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  app.chatBoundedEditAdapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  return app;
}

function ref(app, layerId, objectId) {
  return { pageId: app.page().id, layerId, objectId };
}

function repaintTask(taskId, target, patch) {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId,
    operation: 'path.repaint.v1',
    targets: [target],
    arguments: patch
  };
}

function object(app, objectId) {
  return findPageObject(app.page(), objectId)?.object || null;
}

function layer(app, layerId) {
  return app.page().layers.find(item => item.id === layerId) || null;
}

test('Phase C Color Path bounded repaint preserves generated structure and uses authoritative History', () => {
  const app = makePhaseCApp();
  const adapter = app.chatBoundedEditAdapter;
  const target = ref(app, 'color-layer-phase-c', 'color-phase-c-1');
  const beforeDoc = clone(app.doc);
  const beforeReference = clone(object(app, 'reference-phase-c'));
  const beforeSiblingColor = clone(object(app, 'color-phase-c-2'));
  const beforeLineA = clone(object(app, 'line-phase-c-1'));
  const beforeLineB = clone(object(app, 'line-phase-c-2'));
  const beforeGeometry = clone({
    matrix: object(app, target.objectId).matrix,
    subpaths: object(app, target.objectId).subpaths
  });
  const beforeColorLayerId = layer(app, 'color-layer-phase-c').id;
  const beforeColorCount = layer(app, 'color-layer-phase-c').objects.length;
  const revisionBefore = app.revisions.revisionIdFor(app.doc.id);

  const proposed = adapter.propose(repaintTask('phase-c-color', target, { fill: '#8f4c78' }));
  assert.equal(proposed.ok, true);
  assert.deepEqual(app.doc, beforeDoc);
  assert.equal(app.history.undoStack.length, 0);

  const blocked = adapter.execute(proposed.result.proposalId, 'not-approved');
  assert.equal(blocked.ok, false);
  assert.equal(blocked.code, 'CHAT_EDIT_APPROVAL_REQUIRED');
  assert.deepEqual(app.doc, beforeDoc);
  assert.equal(app.history.undoStack.length, 0);

  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true);
  assert.deepEqual(app.doc, beforeDoc);
  assert.equal(app.history.undoStack.length, 0);

  const executed = adapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true);
  assert.equal(executed.result.changed, true);
  assert.equal(object(app, target.objectId).fill, '#8f4c78');
  assert.equal(layer(app, 'color-layer-phase-c').id, beforeColorLayerId);
  assert.equal(layer(app, 'color-layer-phase-c').objects.length, beforeColorCount);
  assert.deepEqual({
    matrix: object(app, target.objectId).matrix,
    subpaths: object(app, target.objectId).subpaths
  }, beforeGeometry);
  assert.deepEqual(object(app, 'reference-phase-c'), beforeReference);
  assert.deepEqual(object(app, 'color-phase-c-2'), beforeSiblingColor);
  assert.deepEqual(object(app, 'line-phase-c-1'), beforeLineA);
  assert.deepEqual(object(app, 'line-phase-c-2'), beforeLineB);
  assert.equal(app.revisions.revisionIdFor(app.doc.id), revisionBefore);
  assert.equal(app.history.undoStack.at(-1)?.label, 'CHAT repaint Path');

  assert.equal(app.history.undo(), true);
  assert.equal(object(app, target.objectId).fill, beforeDoc.pages[0].layers.find(item => item.id === 'color-layer-phase-c').objects[0].fill);
  assert.equal(app.history.redo(), true);
  assert.equal(object(app, target.objectId).fill, '#8f4c78');
});

test('Phase C Line Path bounded repaint changes only stroke appearance and remains undoable', () => {
  const app = makePhaseCApp();
  const adapter = app.chatBoundedEditAdapter;
  const target = ref(app, 'line-layer-phase-c', 'line-phase-c-1');
  const beforeDoc = clone(app.doc);
  const beforeReference = clone(object(app, 'reference-phase-c'));
  const beforeColorA = clone(object(app, 'color-phase-c-1'));
  const beforeColorB = clone(object(app, 'color-phase-c-2'));
  const beforeSiblingLine = clone(object(app, 'line-phase-c-2'));
  const beforeGeometry = clone({
    matrix: object(app, target.objectId).matrix,
    subpaths: object(app, target.objectId).subpaths
  });
  const beforeLineLayerId = layer(app, 'line-layer-phase-c').id;
  const beforeLineCount = layer(app, 'line-layer-phase-c').objects.length;
  const revisionBefore = app.revisions.revisionIdFor(app.doc.id);

  const proposed = adapter.propose(repaintTask('phase-c-line', target, { stroke: '#315f86' }));
  assert.equal(proposed.ok, true);
  assert.deepEqual(app.doc, beforeDoc);

  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true);
  assert.deepEqual(app.doc, beforeDoc);

  const executed = adapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true);
  assert.equal(object(app, target.objectId).stroke, '#315f86');
  assert.equal(layer(app, 'line-layer-phase-c').id, beforeLineLayerId);
  assert.equal(layer(app, 'line-layer-phase-c').objects.length, beforeLineCount);
  assert.deepEqual({
    matrix: object(app, target.objectId).matrix,
    subpaths: object(app, target.objectId).subpaths
  }, beforeGeometry);
  assert.deepEqual(object(app, 'reference-phase-c'), beforeReference);
  assert.deepEqual(object(app, 'color-phase-c-1'), beforeColorA);
  assert.deepEqual(object(app, 'color-phase-c-2'), beforeColorB);
  assert.deepEqual(object(app, 'line-phase-c-2'), beforeSiblingLine);
  assert.equal(app.revisions.revisionIdFor(app.doc.id), revisionBefore);
  assert.equal(app.history.undoStack.at(-1)?.label, 'CHAT repaint Path');

  assert.equal(app.history.undo(), true);
  assert.equal(object(app, target.objectId).stroke, '#202020');
  assert.equal(app.history.redo(), true);
  assert.equal(object(app, target.objectId).stroke, '#315f86');
});

test('Phase C stale generated target rejects atomically after approval', () => {
  const app = makePhaseCApp();
  const adapter = app.chatBoundedEditAdapter;
  const target = ref(app, 'color-layer-phase-c', 'color-phase-c-1');
  const proposed = adapter.propose(repaintTask('phase-c-stale', target, { fill: '#b25a3d' }));
  assert.equal(proposed.ok, true);
  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true);

  object(app, target.objectId).fill = '#3d875d';
  const beforeAttempt = clone(app.doc);
  const result = adapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(result.ok, false);
  assert.equal(result.code, 'CHAT_EDIT_TARGET_STALE');
  assert.deepEqual(app.doc, beforeAttempt);
  assert.equal(app.history.undoStack.length, 0);
});

test('Phase C focused source guard keeps accepted authorities and runtime wiring visible', async () => {
  const { readFile } = await import('node:fs/promises');
  const source = await readFile(new URL('../product/source/src/editor/chat-bounded-edit.js', import.meta.url), 'utf8');
  const harness = await readFile(new URL('./runtime/ink-cloud-018-browser-harness.html', import.meta.url), 'utf8');

  assert.match(source, /'path\.repaint\.v1'/);
  assert.match(source, /controller\.repaint\(task\.arguments, \{ refs, label: 'CHAT repaint Path' \}\)/);
  assert.match(source, /requireHistoryIdle: true/);
  assert.match(source, /TARGET_STALE/);
  assert.match(harness, /CHAT_PHASE_C_COLOR_BOUNDED_EDIT/);
  assert.match(harness, /CHAT_PHASE_C_LINE_BOUNDED_EDIT/);
  assert.match(harness, /CHAT_PHASE_C_STALE_STATE_REJECTED/);
  assert.equal(FORMAT_VERSION, 4);
});

console.log('INK-CHAT-VALIDATION-001 Phase C bounded Color-Line edit focused QA: PASS');
