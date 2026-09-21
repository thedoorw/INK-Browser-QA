import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import { Matrix } from '../../../../product/source/src/core/index.js';
import {
  RevisionController,
  defaultDocument,
  findPageObject
} from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { applyWorldTransformBatch } from '../../../../product/source/src/editor/transform.js';
import { PathRepaintMaterialController } from '../../../../product/source/src/editor/repaint-material.js';
import { ChatBoundedEditController } from '../../../../product/source/src/editor/chat-bounded-edit.js';
import {
  ChatCreativePlanController,
  chatCreativePlanSource,
  createChatCreativePlanAdapter,
  normalizeChatCreativePlan,
  validateChatCreativePlanAgainstState
} from '../../../../product/source/src/editor/chat-creative-plan.js';
import { createPath } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function pathFixture(id, fill = '#e6dfcf') {
  return createPath({
    id,
    fill,
    stroke: '#403b37',
    strokeWidth: 2,
    subpaths: [{
      id: `${id}:outer`,
      closed: true,
      role: 'outer',
      anchors: [
        { id: `${id}:a0`, x: 0, y: 0 },
        { id: `${id}:a1`, x: 20, y: 0 },
        { id: `${id}:a2`, x: 20, y: 20 }
      ]
    }]
  });
}

function makeApp() {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  layer.objects.push(pathFixture('path-a'), pathFixture('path-b'), pathFixture('path-c'));
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
    replaceDocument(next) { this.doc = clone(next); },
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
  app.revisions = new RevisionController(app, { store: null });
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  app.chatCreativePlan = new ChatCreativePlanController(app);
  return app;
}

function refFor(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function planFixture(app, {
  id = null,
  steps = null,
  intentSummary = 'Refine two selected structural paths'
} = {}) {
  const source = chatCreativePlanSource(app);
  return {
    schema: 'INK-CHAT-CREATIVE-PLAN',
    version: 1,
    ...(id ? { planId: id } : {}),
    source,
    intentSummary,
    steps: steps || [
      {
        stepId: 'repaint-a',
        operation: 'path.repaint.v1',
        targets: [refFor(app, 'path-a')],
        arguments: { fill: '#b63c36' },
        dependsOn: []
      },
      {
        stepId: 'move-b',
        operation: 'object.translate.v1',
        targets: [refFor(app, 'path-b')],
        arguments: { dx: 16, dy: -4 },
        dependsOn: ['repaint-a']
      }
    ]
  };
}

async function initializeRevision(app) {
  const capture = await app.revisions.capture({
    createdAt: '2026-09-21T01:00:00.000Z',
    reason: 'test-base',
    label: 'Plan base'
  });
  assert.equal(capture.created, true);
  return capture.record.revisionId;
}

test('creative-plan contract is deterministic and ordered dependencies reject forward/cyclic references', async () => {
  const app = makeApp();
  await initializeRevision(app);
  const raw = planFixture(app);
  const first = normalizeChatCreativePlan(raw);
  const second = normalizeChatCreativePlan(raw);
  assert.equal(first.planId, second.planId);
  assert.deepEqual(first.steps, second.steps);
  assert.deepEqual(JSON.parse(JSON.stringify(first)), first);
  assert.equal(first.steps.length, 2);
  assert.equal(first.source.revisionId, app.revisions.revisionIdFor(app.doc.id));

  assert.throws(() => normalizeChatCreativePlan({
    ...raw,
    planId: 'bad-order',
    steps: [
      { ...raw.steps[0], dependsOn: ['move-b'] },
      raw.steps[1]
    ]
  }), error => error?.code === 'CHAT_PLAN_DEPENDENCY_ORDER_INVALID');
});

test('validation is mutation-neutral and execute-before-approval is rejected', async () => {
  const app = makeApp();
  await initializeRevision(app);
  const adapter = createChatCreativePlanAdapter(app.chatCreativePlan);
  const raw = planFixture(app);
  const before = clone(app.doc);

  const checked = validateChatCreativePlanAgainstState(app, raw);
  assert.equal(checked.validation.valid, true);
  assert.equal(checked.validation.steps.length, 2);
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);

  const proposed = adapter.propose(raw);
  assert.equal(proposed.ok, true);
  assert.equal(proposed.result.status, 'PROPOSED');
  assert.deepEqual(app.doc, before);

  const blocked = await adapter.execute(proposed.result.planId, 'not-approved');
  assert.equal(blocked.ok, false);
  assert.equal(blocked.code, 'CHAT_PLAN_APPROVAL_REQUIRED');
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);
});

test('approved multi-step plan executes in order through existing bounded-edit and History, then captures Revision', async () => {
  const app = makeApp();
  const startingRevisionId = await initializeRevision(app);
  const adapter = createChatCreativePlanAdapter(app.chatCreativePlan);
  const beforeMatrix = clone(findPageObject(app.page(), 'path-b').object.matrix);

  const proposed = adapter.propose(planFixture(app)).result;
  const approved = adapter.approve(proposed.planId).result;
  assert.match(approved.approvalToken, /^INK-LOCAL-PLAN-APPROVAL:/);

  const response = await adapter.execute(proposed.planId, approved.approvalToken);
  assert.equal(response.ok, true);
  assert.equal(response.result.ok, true);
  assert.equal(response.result.status, 'COMPLETED');
  assert.deepEqual(response.result.stepResults.map(item => item.stepId), ['repaint-a', 'move-b']);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.notDeepEqual(findPageObject(app.page(), 'path-b').object.matrix, beforeMatrix);
  assert.equal(app.history.undoStack.length, 2);
  assert.equal(response.result.revision.startingRevisionId, startingRevisionId);
  assert.notEqual(response.result.revision.endingRevisionId, startingRevisionId);
  assert.equal(app.revisions.revisionIdFor(app.doc.id), response.result.revision.endingRevisionId);
  assert.equal(response.result.revision.comparison.objectCounts.changed, 2);
  assert.deepEqual(JSON.parse(JSON.stringify(response.result)), response.result);
  assert.equal(app.chatCreativePlan.history, undefined);

  assert.equal(app.history.undo(), true);
  assert.deepEqual(findPageObject(app.page(), 'path-b').object.matrix, beforeMatrix);
  assert.equal(app.history.undo(), true);
  assert.notEqual(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.equal(app.history.redo(), true);
  assert.equal(app.history.redo(), true);
});

test('stale Revision rejects before plan mutation', async () => {
  const app = makeApp();
  await initializeRevision(app);
  const adapter = createChatCreativePlanAdapter(app.chatCreativePlan);
  const proposed = adapter.propose(planFixture(app)).result;
  const approved = adapter.approve(proposed.planId).result;
  const before = clone(app.doc);

  app.revisions.currentRevisionId = 'revision-external';
  const response = await adapter.execute(proposed.planId, approved.approvalToken);

  assert.equal(response.ok, true);
  assert.equal(response.result.ok, false);
  assert.equal(response.result.status, 'STOPPED');
  assert.equal(response.result.stoppedStepId, 'repaint-a');
  assert.equal(response.result.diagnostic.code, 'CHAT_PLAN_STALE_REVISION');
  assert.deepEqual(response.result.remainingStepIds, ['move-b']);
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);
});

test('stale target is rejected specifically and is never silently retargeted', async () => {
  const app = makeApp();
  await initializeRevision(app);
  const adapter = createChatCreativePlanAdapter(app.chatCreativePlan);
  const proposed = adapter.propose(planFixture(app)).result;
  const approved = adapter.approve(proposed.planId).result;

  const layer = app.page().layers[0];
  layer.objects = layer.objects.filter(object => object.id !== 'path-a');
  const before = clone(app.doc);
  const response = await adapter.execute(proposed.planId, approved.approvalToken);

  assert.equal(response.ok, true);
  assert.equal(response.result.ok, false);
  assert.equal(response.result.status, 'STOPPED');
  assert.equal(response.result.stoppedStepId, 'repaint-a');
  assert.equal(response.result.diagnostic.code, 'CHAT_EDIT_TARGET_MISSING');
  assert.deepEqual(response.result.remainingStepIds, ['move-b']);
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(findPageObject(app.page(), 'path-b')?.object.id, 'path-b');
});

test('mid-plan failure records successful steps, captures partial Revision and stops all remaining steps', async () => {
  const app = makeApp();
  const startingRevisionId = await initializeRevision(app);
  const adapter = createChatCreativePlanAdapter(app.chatCreativePlan);
  const steps = [
    {
      stepId: 'repaint-a',
      operation: 'path.repaint.v1',
      targets: [refFor(app, 'path-a')],
      arguments: { fill: '#b63c36' },
      dependsOn: []
    },
    {
      stepId: 'move-b',
      operation: 'object.translate.v1',
      targets: [refFor(app, 'path-b')],
      arguments: { dx: 10, dy: 0 },
      dependsOn: ['repaint-a']
    },
    {
      stepId: 'repaint-c',
      operation: 'path.repaint.v1',
      targets: [refFor(app, 'path-c')],
      arguments: { fill: '#336699' },
      dependsOn: ['move-b']
    }
  ];
  const proposed = adapter.propose(planFixture(app, { id: 'mid-failure-plan', steps })).result;
  const approved = adapter.approve(proposed.planId).result;

  const originalExecute = app.chatBoundedEdit.execute.bind(app.chatBoundedEdit);
  let executeCount = 0;
  app.chatBoundedEdit.execute = (...args) => {
    executeCount += 1;
    if (executeCount === 2) {
      throw Object.assign(new Error('forced bounded failure'), { code: 'CHAT_EDIT_FORCED_FAILURE' });
    }
    return originalExecute(...args);
  };

  const response = await adapter.execute(proposed.planId, approved.approvalToken);

  assert.equal(response.ok, true);
  assert.equal(response.result.ok, false);
  assert.equal(response.result.status, 'STOPPED');
  assert.deepEqual(response.result.stepResults.map(item => item.state), ['COMPLETED', 'STOPPED']);
  assert.equal(response.result.stoppedStepId, 'move-b');
  assert.deepEqual(response.result.remainingStepIds, ['repaint-c']);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.notEqual(findPageObject(app.page(), 'path-c').object.fill, '#336699');
  assert.equal(app.history.undoStack.length, 1);
  assert.equal(response.result.revision.startingRevisionId, startingRevisionId);
  assert.notEqual(response.result.revision.endingRevisionId, startingRevisionId);
});

test('invalid or busy History blocks validation without mutation', async () => {
  const app = makeApp();
  await initializeRevision(app);
  const raw = planFixture(app);
  const before = clone(app.doc);

  app.history.pending = { label: 'busy' };
  assert.throws(
    () => validateChatCreativePlanAgainstState(app, raw),
    error => error?.code === 'CHAT_PLAN_HISTORY_BUSY'
  );
  app.history.pending = null;
  const validHistory = app.history;
  app.history = { pending: false };
  assert.throws(
    () => validateChatCreativePlanAgainstState(app, raw),
    error => error?.code === 'CHAT_PLAN_HISTORY_INVALID'
  );
  app.history = validHistory;
  assert.deepEqual(app.doc, before);
});

test('format remains v4', () => {
  assert.equal(FORMAT_VERSION, 4);
});
