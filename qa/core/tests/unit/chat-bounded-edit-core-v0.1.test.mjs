import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import { Matrix } from '../../../../product/source/src/core/index.js';
import { defaultDocument, findPageObject } from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { applyWorldTransformBatch } from '../../../../product/source/src/editor/transform.js';
import { PathRepaintMaterialController } from '../../../../product/source/src/editor/repaint-material.js';
import {
  ChatBoundedEditController,
  buildChatStateSummary,
  createChatBoundedEditAdapter,
  stableChatStringify
} from '../../../../product/source/src/editor/chat-bounded-edit.js';
import { createPath } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function pathFixture(id, { fill = '#e6dfcf', anchors = null } = {}) {
  return createPath({
    id,
    fill,
    stroke: '#403b37',
    strokeWidth: 2,
    metadata: {
      extraction: {
        schema: 'INK-EXTRACTION/1',
        batchId: `batch-${id}`,
        referenceObjectId: `reference-${id}`,
        source: { name: `${id}.png` }
      }
    },
    subpaths: [{
      id: `${id}:outer`,
      closed: false,
      role: 'outer',
      anchors: anchors || [
        { id: `${id}:a0`, x: 0, y: 0 },
        { id: `${id}:a1`, x: 20, y: 0 },
        { id: `${id}:a2`, x: 40, y: 10 }
      ]
    }]
  });
}

function makeApp(paths = [pathFixture('path-a'), pathFixture('path-b')]) {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  layer.objects.push(...paths);
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
    translateSelection(dx, dy, label = 'Move') {
      const selected = this.selectedObjects();
      const targets = selected.map(found => this.objectPath(found));
      const transform = Matrix.translate(dx, dy);
      this.history.pushScoped(label, targets, () => {
        applyWorldTransformBatch(selected.map(item => ({
          found: this.findObject({ layerId: item.layer.id, objectId: item.object.id }),
          transform
        })));
      });
    }
  };
  app.history = new HistoryManager(app);
  app.pathRepaintMaterial = new PathRepaintMaterialController(app);
  return { app, layer };
}

function refFor(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function task(taskId, operation, targets, args = {}, expected = null) {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId,
    operation,
    targets,
    arguments: args,
    expected
  };
}

test('CHAT state summary is deterministic, bounded and omits arbitrary raster/binary payloads', () => {
  const { app } = makeApp();
  app.selection = [
    { layerId: app.page().layers[0].id, objectId: 'path-b' },
    { layerId: app.page().layers[0].id, objectId: 'path-a' }
  ];
  findPageObject(app.page(), 'path-a').object.previewData = 'data:image/png;base64,SHOULD_NOT_LEAK';

  const first = buildChatStateSummary(app);
  const second = buildChatStateSummary(app);
  assert.deepEqual(second, first);
  assert.equal(stableChatStringify(first), stableChatStringify(second));
  assert.equal(first.schema, 'INK-CHAT-STATE-SUMMARY');
  assert.equal(first.version, 1);
  assert.deepEqual(first.selection.map(item => item.objectId), ['path-a', 'path-b']);
  assert.equal(first.objects[0].ref.pageId, app.page().id);
  assert.equal(typeof first.objects[0].geometry.fingerprint, 'string');
  assert.equal(first.objects[0].provenance.kind, 'extraction');
  assert.doesNotMatch(JSON.stringify(first), /SHOULD_NOT_LEAK/);
});

test('proposal and approval are mutation-neutral; unapproved execution is rejected', () => {
  const { app } = makeApp();
  const controller = new ChatBoundedEditController(app);
  const adapter = createChatBoundedEditAdapter(controller);
  const ref = refFor(app, 'path-a');
  const before = clone(app.doc);

  const proposed = adapter.propose(task('repaint-1', 'path.repaint.v1', [ref], { fill: '#b63c36' }));
  assert.equal(proposed.ok, true);
  assert.equal(proposed.result.state, 'PROPOSED');
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);

  const blocked = adapter.execute(proposed.result.proposalId, 'not-approved');
  assert.equal(blocked.ok, false);
  assert.equal(blocked.code, 'CHAT_EDIT_APPROVAL_REQUIRED');
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);

  const approved = adapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true);
  assert.equal(approved.result.state, 'APPROVED');
  assert.match(approved.result.approvalToken, /^INK-LOCAL-APPROVAL:/);
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);
});

test('approved repaint executes through existing repaint controller and History with undo/redo', () => {
  const { app } = makeApp();
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const ref = refFor(app, 'path-a');
  const original = findPageObject(app.page(), 'path-a').object.fill;

  const proposal = adapter.propose(task('repaint-history', 'path.repaint.v1', [ref], { fill: '#b63c36' })).result;
  const approved = adapter.approve(proposal.proposalId).result;
  const executed = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(executed.ok, true);
  assert.equal(executed.result.state, 'EXECUTED');
  assert.equal(executed.result.changed, true);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.equal(app.history.undoStack.length, 1);
  assert.equal(executed.result.history.latestLabel, 'CHAT repaint Path');

  assert.equal(app.history.undo(), true);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, original);
  assert.equal(app.history.redo(), true);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
});

test('approved translation executes a second operation family through existing transform/History route', () => {
  const { app } = makeApp();
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const ref = refFor(app, 'path-b');
  const before = clone(findPageObject(app.page(), 'path-b').object.matrix);

  const proposal = adapter.propose(task('move-1', 'object.translate.v1', [ref], { dx: 18, dy: -7 })).result;
  const approved = adapter.approve(proposal.proposalId).result;
  const executed = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(executed.ok, true);
  assert.equal(executed.result.changed, true);
  assert.notDeepEqual(findPageObject(app.page(), 'path-b').object.matrix, before);
  assert.equal(app.history.undoStack.length, 1);

  assert.equal(app.history.undo(), true);
  assert.deepEqual(findPageObject(app.page(), 'path-b').object.matrix, before);
  assert.equal(app.history.redo(), true);
  assert.notDeepEqual(findPageObject(app.page(), 'path-b').object.matrix, before);
});

test('bounded Path simplify executes through existing PathEditController and remains undoable', () => {
  const simplifyPath = pathFixture('path-simplify', {
    anchors: [
      { id: 's0', x: 0, y: 0 },
      { id: 's1', x: 10, y: 0 },
      { id: 's2', x: 20, y: 0 },
      { id: 's3', x: 30, y: 0 }
    ]
  });
  const { app } = makeApp([simplifyPath]);
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const ref = refFor(app, 'path-simplify');

  const proposal = adapter.propose(task('simplify-1', 'path.simplify.v1', [ref], {
    tolerance: 0.01,
    handleTolerance: 0,
    maxPasses: 8
  })).result;
  const approved = adapter.approve(proposal.proposalId).result;
  const executed = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(executed.ok, true);
  assert.equal(findPageObject(app.page(), 'path-simplify').object.subpaths[0].anchors.length, 2);
  assert.equal(app.history.undoStack.length, 1);
  assert.equal(app.history.undo(), true);
  assert.equal(findPageObject(app.page(), 'path-simplify').object.subpaths[0].anchors.length, 4);
  assert.equal(app.history.redo(), true);
  assert.equal(findPageObject(app.page(), 'path-simplify').object.subpaths[0].anchors.length, 2);
});

test('invalid, locked, hidden, singular and stale targets reject without task mutation', () => {
  for (const mode of ['locked', 'hidden', 'singular']) {
    const { app } = makeApp();
    const target = findPageObject(app.page(), 'path-a').object;
    if (mode === 'locked') target.locked = true;
    if (mode === 'hidden') target.visible = false;
    if (mode === 'singular') target.matrix = [0, 0, 0, 1, 0, 0];
    const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
    const before = clone(app.doc);
    const result = adapter.propose(task(`guard-${mode}`, 'path.repaint.v1', [refFor(app, 'path-a')], { fill: '#fff' }));
    assert.equal(result.ok, false);
    assert.match(result.code, new RegExp(`CHAT_EDIT_TARGET_${mode.toUpperCase()}`));
    assert.deepEqual(app.doc, before);
    assert.equal(app.history.undoStack.length, 0);
  }

  {
    const { app } = makeApp();
    const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
    const missing = {
      pageId: app.page().id,
      layerId: app.page().layers[0].id,
      objectId: 'missing-object'
    };
    const before = clone(app.doc);
    const result = adapter.propose(task('missing', 'path.repaint.v1', [missing], { fill: '#fff' }));
    assert.equal(result.ok, false);
    assert.equal(result.code, 'CHAT_EDIT_TARGET_MISSING');
    assert.deepEqual(app.doc, before);
    assert.equal(app.history.undoStack.length, 0);
  }

  {
    const { app } = makeApp();
    const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
    const ref = refFor(app, 'path-a');
    const proposal = adapter.propose(task('stale', 'path.repaint.v1', [ref], { fill: '#fff' })).result;
    const approved = adapter.approve(proposal.proposalId).result;
    findPageObject(app.page(), 'path-a').object.fill = '#3d875d';
    const beforeAttempt = clone(app.doc);
    const result = adapter.execute(proposal.proposalId, approved.approvalToken);
    assert.equal(result.ok, false);
    assert.equal(result.code, 'CHAT_EDIT_TARGET_STALE');
    assert.deepEqual(app.doc, beforeAttempt);
    assert.equal(app.history.undoStack.length, 0);
  }
});

test('failed controller mutation is rolled back atomically by existing History', () => {
  const { app } = makeApp();
  const original = findPageObject(app.page(), 'path-a').object.fill;
  app.pathRepaintMaterial = {
    repaint(_patch, { refs }) {
      const found = findPageObject(app.page(), refs[0]);
      app.history.pushScoped('forced atomic failure', [app.objectPath(found)], () => {
        found.object.fill = '#ff00ff';
        throw Object.assign(new Error('forced failure'), { code: 'FORCED_FAILURE' });
      });
    }
  };
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const ref = refFor(app, 'path-a');
  const proposal = adapter.propose(task('atomic-failure', 'path.repaint.v1', [ref], { fill: '#fff' })).result;
  const approved = adapter.approve(proposal.proposalId).result;
  const result = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(result.ok, false);
  assert.equal(result.code, 'FORCED_FAILURE');
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, original);
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.history.pending, null);
});

test('deterministic no-op creates no History entry and FORMAT_VERSION stays 4', () => {
  const { app } = makeApp();
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const ref = refFor(app, 'path-a');
  const currentFill = findPageObject(app.page(), 'path-a').object.fill;
  const proposal = adapter.propose(task('noop', 'path.repaint.v1', [ref], { fill: currentFill })).result;
  const approved = adapter.approve(proposal.proposalId).result;
  const executed = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(executed.ok, true);
  assert.equal(executed.result.changed, false);
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(app.doc.formatVersion, 4);
});
