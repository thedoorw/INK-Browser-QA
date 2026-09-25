import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import {
  ChatCreativePlanController,
  chatCreativePlanSource
} from '../product/source/src/editor/chat-creative-plan.js';
import { CHAT_EDIT_OPERATIONS } from '../product/source/src/editor/chat-bounded-edit.js';
import {
  createInkPublicCreativeApi,
  getInkNamedToolDefinitions,
  resolveInkCapabilityDescriptor
} from '../product/source/src/agent/index.js';
import { createPath } from '../product/source/src/vector/vector-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clone = value => JSON.parse(JSON.stringify(value));

const CONNECTOR_003_PREFIX = [
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
  'restore_ink_revision',
  'get_ink_preview',
  'inspect_ink_output',
  'release_ink_output',
  'describe_ink_capability'
];

const CONNECTOR_004_OPERATIONS = [
  'path.repaint.v1',
  'path.material.apply.v1',
  'path.material.remove.v1',
  'object.translate.v1',
  'path.simplify.v1',
  'path.refine.v1'
];

const GEOMETRY_OPS_001_ADDITIONS = [
  'path.create.v1',
  'path.edit.v1',
  'object.rotate.v1',
  'object.clone.v1',
  'repeat.radial.v1',
  'boolean.apply.v1',
  'group.create.v1',
  'object.reparent.v1'
];

const ALLOWED_PLAN_OPERATIONS = [...CONNECTOR_004_OPERATIONS, ...GEOMETRY_OPS_001_ADDITIONS];

function pathFixture(id, fill) {
  const item = createPath({
    id,
    fill,
    stroke: '#202020',
    strokeWidth: 1,
    subpaths: [{
      id: id + ':outer',
      role: 'outer',
      closed: true,
      anchors: [
        { id: id + ':a0', x: 0, y: 0 },
        { id: id + ':a1', x: 24, y: 0 },
        { id: id + ':a2', x: 24, y: 24 },
        { id: id + ':a3', x: 0, y: 24 }
      ]
    }]
  });
  item.matrix = [1, 0, 0, 1, 0, 0];
  return item;
}

function makeApp({ failStepId = null } = {}) {
  const doc = defaultDocument();
  doc.id = 'document:connector-004';
  doc.title = 'Connector-004 fixture';
  const page = doc.pages[0];
  page.id = 'page-1';
  page.name = 'Page 1';
  doc.activePageId = page.id;
  const layer = page.layers[0];
  layer.id = 'layer-1';
  layer.name = 'Layer 1';
  page.activeLayerId = layer.id;
  layer.objects = [
    pathFixture('path-a', '#ded8ca'),
    pathFixture('path-b', '#c8d8de'),
    pathFixture('path-c', '#d8c8de')
  ];

  const calls = {
    propose: [],
    approve: [],
    execute: [],
    revisionCapture: [],
    preview: 0
  };
  let revisionId = 'revision:start';
  let boundedSequence = 0;
  let revisionSequence = 0;
  const proposals = new Map();

  const app = {
    doc,
    selection: [],
    calls,
    history: { undoStack: [], redoStack: [], pending: null },
    page() { return page; },
    async renderExportCanvas() {
      calls.preview += 1;
      throw new Error('Preview must remain explicit and separate from use_ink');
    },
    revisions: {
      revisionIdFor() { return revisionId; },
      diagnostics() { return { currentRevisionId: revisionId }; },
      async capture(options = {}) {
        const next = 'revision:' + (++revisionSequence);
        calls.revisionCapture.push(clone(options));
        const parentRevisionId = options.parentRevisionId ?? revisionId;
        revisionId = next;
        return {
          created: true,
          equivalent: false,
          record: {
            revisionId: next,
            documentId: doc.id,
            sequence: revisionSequence,
            parentRevisionId,
            documentFingerprint: chatCreativePlanSource(app).documentFingerprint
          },
          comparison: { equal: false }
        };
      }
    }
  };

  const bounded = {
    propose(task) {
      const proposalId = 'bounded:' + (++boundedSequence) + ':' + task.taskId;
      const record = { proposalId, task: clone(task), state: 'PROPOSED' };
      proposals.set(proposalId, record);
      calls.propose.push(task.taskId);
      return clone(record);
    },
    approve(proposalId) {
      const record = proposals.get(proposalId);
      if (!record) throw Object.assign(new Error('missing proposal'), { code: 'CHAT_EDIT_PROPOSAL_NOT_FOUND' });
      record.state = 'APPROVED';
      record.approvalToken = 'bounded-token:' + proposalId;
      calls.approve.push(record.task.taskId);
      return clone(record);
    },
    execute(proposalId, approvalToken) {
      const record = proposals.get(proposalId);
      if (!record || approvalToken !== record.approvalToken) {
        throw Object.assign(new Error('invalid bounded approval'), { code: 'CHAT_EDIT_APPROVAL_TOKEN_INVALID' });
      }
      const task = record.task;
      const stepId = String(task.taskId).split(':').at(-1);
      calls.execute.push(task.taskId);
      if (failStepId && stepId === failStepId) {
        throw Object.assign(new Error('bounded test failure'), {
          code: 'CHAT_EDIT_TEST_FAILURE',
          operation: task.operation
        });
      }

      for (const target of task.targets) {
        const found = findPageObject(page, target);
        if (!found) throw Object.assign(new Error('target missing'), { code: 'CHAT_EDIT_TARGET_MISSING' });
        if (task.operation === 'path.repaint.v1') {
          if (Object.hasOwn(task.arguments, 'fill')) found.object.fill = task.arguments.fill;
          if (Object.hasOwn(task.arguments, 'stroke')) found.object.stroke = task.arguments.stroke;
          if (Object.hasOwn(task.arguments, 'opacity')) found.object.opacity = task.arguments.opacity;
        } else if (task.operation === 'object.translate.v1') {
          found.object.matrix[4] += task.arguments.dx;
          found.object.matrix[5] += task.arguments.dy;
        }
      }

      const history = {
        label: 'CHAT ' + task.operation,
        objectIds: task.targets.map(item => item.objectId),
        patchCount: task.targets.length
      };
      app.history.undoStack.push(clone(history));
      app.history.redoStack.length = 0;
      record.state = 'EXECUTED';
      return {
        schema: 'INK-CHAT-EDIT-RESULT',
        version: 1,
        changed: true,
        targets: clone(task.targets),
        history,
        revision: {
          revisionId,
          documentFingerprint: chatCreativePlanSource(app).documentFingerprint
        }
      };
    }
  };

  app.chatBoundedEdit = bounded;
  app.chatBoundedEditAdapter = Object.freeze({
    propose: task => bounded.propose(task),
    approve: proposalId => bounded.approve(proposalId),
    execute: (proposalId, approvalToken) => bounded.execute(proposalId, approvalToken)
  });
  app.chatCreativePlan = new ChatCreativePlanController(app);
  return app;
}

function ref(objectId) {
  return { pageId: 'page-1', layerId: 'layer-1', objectId };
}

function planCandidate(app, { source = null, secondOperation = 'object.translate.v1', thirdStep = false } = {}) {
  const steps = [
    {
      stepId: 'repaint-a',
      operation: 'path.repaint.v1',
      targets: [ref('path-a')],
      arguments: { fill: '#b44a3a' },
      dependsOn: []
    },
    {
      stepId: 'move-b',
      operation: secondOperation,
      targets: [ref('path-b')],
      arguments: secondOperation === 'object.translate.v1' ? { dx: 8, dy: -2 } : {},
      dependsOn: ['repaint-a']
    }
  ];
  if (thirdStep) {
    steps.push({
      stepId: 'move-c',
      operation: 'object.translate.v1',
      targets: [ref('path-c')],
      arguments: { dx: -4, dy: 3 },
      dependsOn: ['move-b']
    });
  }
  return {
    schema: 'INK-CHAT-CREATIVE-PLAN',
    version: 1,
    ...(source ? { source } : {}),
    intentSummary: 'Bounded Connector-004 plan',
    steps
  };
}

function snapshotMutationState(app) {
  return JSON.stringify({
    doc: app.doc,
    history: app.history,
    revisionId: app.revisions.revisionIdFor(app.doc.id),
    revisionCapture: app.calls.revisionCapture
  });
}

function assertJsonSafe(value) {
  assert.doesNotThrow(() => JSON.stringify(value));
  const visit = item => {
    if (item == null) return;
    assert.notEqual(typeof item, 'function');
    assert.notEqual(typeof item, 'symbol');
    assert.notEqual(typeof item, 'bigint');
    if (Array.isArray(item)) item.forEach(visit);
    else if (typeof item === 'object') Object.values(item).forEach(visit);
  };
  visit(value);
}

test('Connector-004 use_ink remains the exact tool after the Connector-003 prefix; later named tools stay append-only', () => {
  const tools = getInkNamedToolDefinitions();
  assert.deepEqual(tools.slice(0, 18).map(item => item.name), CONNECTOR_003_PREFIX);
  assert.equal(tools[18].name, 'use_ink');
  assert.equal(tools[19].name, 'import_ink_reference');
  assert.ok(tools.length >= 20);
  assert.equal(tools.filter(item => item.name === 'use_ink').length, 1);

  const composition = resolveInkCapabilityDescriptor('composition.programmable');
  assert.equal(composition.availability, true);
  assert.equal(composition.namedTool, 'use_ink');
  assert.equal(composition.publicMethod, 'composition.propose');
  assert.equal(composition.routingClass, 'PROPOSAL_REQUIRED');
  assert.ok(composition.constraints.some(item => /arbitrary JavaScript/i.test(item)));
  assert.ok(composition.constraints.some(item => /get_ink_preview/i.test(item)));

  const external = resolveInkCapabilityDescriptor('external.transport');
  assert.equal(external.availability, false);
  assert.equal(external.namedTool, null);
});

test('use_ink preserves Connector-004 operations and appends only the authorized Geometry Ops 001 vocabulary', () => {
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(0, ALLOWED_PLAN_OPERATIONS.length), ALLOWED_PLAN_OPERATIONS);
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(0, CONNECTOR_004_OPERATIONS.length), CONNECTOR_004_OPERATIONS);
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(CONNECTOR_004_OPERATIONS.length, ALLOWED_PLAN_OPERATIONS.length), GEOMETRY_OPS_001_ADDITIONS);
  for (const stillForbidden of ['component.', 'layout.']) {
    assert.equal(CHAT_EDIT_OPERATIONS.some(item => item.toLowerCase().includes(stillForbidden)), false);
  }
});

test('composition.propose and inspect are document/history/revision mutation-neutral and match direct Chat Creative Plan proposal identity', () => {
  const directApp = makeApp();
  const facadeApp = makeApp();
  const directPlan = planCandidate(directApp);
  const facadePlan = planCandidate(facadeApp);
  const directBefore = snapshotMutationState(directApp);
  const facadeBefore = snapshotMutationState(facadeApp);

  const direct = directApp.chatCreativePlan.propose(directPlan);
  const api = createInkPublicCreativeApi(facadeApp);
  const proposed = api.composition.propose({ plan: facadePlan });

  assert.equal(proposed.status, 'PROPOSED');
  assert.equal(proposed.result.planId, direct.planId);
  assert.equal(proposed.result.status, direct.status);
  assert.equal(proposed.result.approved, false);
  assert.equal(proposed.result.approvalToken, null);
  assert.equal(snapshotMutationState(directApp), directBefore);
  assert.equal(snapshotMutationState(facadeApp), facadeBefore);

  const inspected = api.composition.inspect({ planId: proposed.result.planId });
  assert.equal(inspected.status, 'PROPOSED');
  assert.equal(inspected.result.plan.planId, proposed.result.planId);
  assert.equal(inspected.result.plan.approved, false);
  assert.equal(inspected.result.plan.intentSummary, 'Bounded Connector-004 plan');
  assert.equal(inspected.result.plan.stepCount, 2);
  assert.equal(inspected.result.plan.source.documentId, facadeApp.doc.id);
  assert.equal(inspected.result.plan.source.revisionId, 'revision:start');
  assert.equal(snapshotMutationState(facadeApp), facadeBefore);
});

test('execute before approval is rejected; explicit plan approval token enables deterministic ordered execution with History and final Revision', async () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const proposed = api.composition.propose({ plan: planCandidate(app) });
  const planId = proposed.result.planId;

  const rejected = await api.composition.execute({ planId, approvalToken: 'not-approved' });
  assert.equal(rejected.status, 'FAILED');
  assert.equal(rejected.diagnostics[0].code, 'CHAT_PLAN_APPROVAL_REQUIRED');
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.calls.revisionCapture.length, 0);

  const approved = api.composition.approve({ planId });
  assert.equal(approved.status, 'APPROVED');
  assert.equal(approved.result.approved, true);
  assert.match(approved.result.approvalToken, /^INK-LOCAL-PLAN-APPROVAL:/);

  const executed = await api.composition.execute({
    planId,
    approvalToken: approved.result.approvalToken
  });
  assert.equal(executed.status, 'COMPLETED');
  assert.deepEqual(app.calls.execute.map(item => item.split(':').at(-1)), ['repaint-a', 'move-b']);
  assert.equal(app.history.undoStack.length, 2);
  assert.equal(app.calls.revisionCapture.length, 1);
  assert.equal(app.calls.revisionCapture[0].reason, 'chat-plan-complete');
  assert.equal(executed.historyReceipt.steps.length, 2);
  assert.equal(executed.revisionReceipt.startingRevisionId, 'revision:start');
  assert.equal(executed.revisionReceipt.endingRevisionId, 'revision:1');
  assert.equal(findPageObject(app.page(), ref('path-a')).object.fill, '#b44a3a');
  assert.deepEqual(findPageObject(app.page(), ref('path-b')).object.matrix.slice(4), [8, -2]);
  assert.equal(app.calls.preview, 0, 'use_ink must not auto-capture Preview');
});

test('use_ink named tool canonical object actions reuse composition authority and cancel preserves existing rejection semantics', async () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const proposed = await api.tools.invoke('use_ink', { action: 'propose', plan: planCandidate(app) });
  assert.equal(proposed.status, 'PROPOSED');

  const inspected = await api.tools.invoke('use_ink', { action: 'inspect', planId: proposed.result.planId });
  assert.equal(inspected.result.plan.status, 'PROPOSED');

  const cancelled = await api.tools.invoke('use_ink', { action: 'cancel', planId: proposed.result.planId });
  assert.equal(cancelled.status, 'REJECTED');
  assert.equal(cancelled.result.approved, false);
  assert.equal(cancelled.result.approvalToken, null);
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.calls.revisionCapture.length, 0);

  const unsupported = await api.tools.invoke('use_ink', { action: 'boolean' });
  assert.equal(unsupported.status, 'FAILED');
  assert.equal(unsupported.action, 'use_ink');
  assert.equal(unsupported.diagnostics[0].code, 'INK_USE_INK_ACTION_UNSUPPORTED');
});

test('unsupported plan operation is still rejected by existing bounded-edit validation before mutation', () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const before = snapshotMutationState(app);
  const result = api.composition.propose({
    plan: planCandidate(app, { secondOperation: 'object.delete.v1' })
  });
  assert.equal(result.status, 'FAILED');
  assert.equal(result.diagnostics[0].code, 'CHAT_EDIT_OPERATION_NOT_ALLOWED');
  assert.equal(snapshotMutationState(app), before);
});

test('stale Revision blocks execution before any bounded step mutation', async () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const proposed = api.composition.propose({ plan: planCandidate(app) });
  const approved = api.composition.approve({ planId: proposed.result.planId });
  await app.revisions.capture({ reason: 'external-change', label: 'External change' });
  const historyBefore = app.history.undoStack.length;

  const result = await api.composition.execute({
    planId: proposed.result.planId,
    approvalToken: approved.result.approvalToken
  });
  assert.equal(result.status, 'STOPPED');
  assert.equal(result.diagnostics[0].code, 'CHAT_PLAN_STALE_REVISION');
  assert.equal(result.result.stoppedStepId, 'repaint-a');
  assert.equal(app.history.undoStack.length, historyBefore);
  assert.equal(app.calls.execute.length, 0);
});

test('mid-plan failure stops remaining steps and preserves partial-success Revision capture', async () => {
  const app = makeApp({ failStepId: 'move-b' });
  const api = createInkPublicCreativeApi(app);
  const proposed = api.composition.propose({ plan: planCandidate(app, { thirdStep: true }) });
  const approved = api.composition.approve({ planId: proposed.result.planId });
  const result = await api.composition.execute({
    planId: proposed.result.planId,
    approvalToken: approved.result.approvalToken
  });

  assert.equal(result.status, 'STOPPED');
  assert.equal(result.result.status, 'STOPPED');
  assert.equal(result.result.stoppedStepId, 'move-b');
  assert.deepEqual(result.result.remainingStepIds, ['move-c']);
  assert.deepEqual(app.calls.execute.map(item => item.split(':').at(-1)), ['repaint-a', 'move-b']);
  assert.equal(app.history.undoStack.length, 1);
  assert.equal(app.calls.revisionCapture.length, 1);
  assert.equal(app.calls.revisionCapture[0].reason, 'chat-plan-stopped');
  assert.equal(result.revisionReceipt.startingRevisionId, 'revision:start');
  assert.equal(result.revisionReceipt.endingRevisionId, 'revision:1');
  assert.equal(findPageObject(app.page(), ref('path-a')).object.fill, '#b44a3a');
  assert.deepEqual(findPageObject(app.page(), ref('path-c')).object.matrix.slice(4), [0, 0]);
});

test('Public API composition execution is behaviorally equivalent to direct existing Chat Creative Plan execution', async () => {
  const directApp = makeApp();
  const facadeApp = makeApp();

  const directPlan = directApp.chatCreativePlan.propose(planCandidate(directApp));
  const directApproval = directApp.chatCreativePlan.approve(directPlan.planId);
  const directResult = await directApp.chatCreativePlan.execute(directPlan.planId, directApproval.approvalToken);

  const api = createInkPublicCreativeApi(facadeApp);
  const proposed = api.composition.propose({ plan: planCandidate(facadeApp) });
  const approved = api.composition.approve({ planId: proposed.result.planId });
  const facadeResult = await api.composition.execute({
    planId: proposed.result.planId,
    approvalToken: approved.result.approvalToken
  });

  assert.deepEqual(facadeApp.doc, directApp.doc);
  assert.deepEqual(facadeApp.history, directApp.history);
  assert.equal(facadeApp.revisions.revisionIdFor(facadeApp.doc.id), directApp.revisions.revisionIdFor(directApp.doc.id));
  assert.deepEqual(facadeApp.calls.execute, directApp.calls.execute);
  assert.deepEqual(facadeResult.result, directResult);
});

test('Connector-004 result envelopes stay JSON-safe and source boundary excludes arbitrary execution, direct Document replacement, transport, and auto Preview', async () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const proposed = await api.tools.invoke('use_ink', { action: 'propose', plan: planCandidate(app) });
  const approved = await api.tools.invoke('use_ink', { action: 'approve', planId: proposed.result.planId });
  const executed = await api.tools.invoke('use_ink', {
    action: 'execute',
    planId: proposed.result.planId,
    approvalToken: approved.result.approvalToken
  });
  for (const result of [proposed, approved, executed]) assertJsonSafe(result);
  assert.equal(app.calls.preview, 0);

  const [apiSource, registrySource, planSource, boundedSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/agent/public-creative-api.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/capability-registry.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/editor/chat-creative-plan.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/editor/chat-bounded-edit.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);
  const connectorSource = apiSource + '\n' + registrySource;
  assert.doesNotMatch(connectorSource, /\beval\s*\(|\bFunction\s*\(|new\s+Function\s*\(|dynamic\s+import|WebSocket|postMessage|XMLHttpRequest|sendBeacon|\bMCP\b/i);
  assert.doesNotMatch(apiSource, /app\s*\[[^\]]+\]\s*\(|app\.doc\s*=|\.doc\s*=\s*JSON/i);
  assert.match(apiSource, /app\?\.chatCreativePlan/);
  assert.match(planSource, /this\.app\?\.chatBoundedEdit/);
  assert.match(planSource, /capturePlanRevision/);
  assert.match(boundedSource, /CHAT_EDIT_OPERATIONS/);
  assert.equal(FORMAT_VERSION, 4);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
});

console.log('INK-CHAT-CONNECTOR-004 use_ink programmable bridge focused QA: PASS');
