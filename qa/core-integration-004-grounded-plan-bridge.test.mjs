import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  ChatClientInterface,
  ChatSessionManager,
  ToolCallRouter
} from '../product/source/src/ai/chat-runtime.js';
import {
  createGroundedCreativePlanProposal,
  normalizeGroundedCreativeDecision
} from '../product/source/src/ai/grounded-creative-decision.js';
import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import {
  ChatCreativePlanController,
  chatCreativePlanSource
} from '../product/source/src/editor/chat-creative-plan.js';
import { createPath } from '../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));
const REQUEST = Object.freeze({ requestId: 'chatmsg:integration-004', sessionId: 'chat:integration-004' });
const CONTEXT_FINGERPRINT = 'fnv1a32:integration-004-grounded';

function pathFixture(id, { visible = true } = {}) {
  return {
    ...createPath({
      id,
      fill: '#e6dfcf',
      stroke: '#403b37',
      strokeWidth: 2,
      subpaths: [{
        id: `${id}:outer`,
        role: 'outer',
        closed: true,
        anchors: [
          { id: `${id}:a0`, x: 0, y: 0 },
          { id: `${id}:a1`, x: 20, y: 0 },
          { id: `${id}:a2`, x: 20, y: 20 }
        ]
      }]
    }),
    visible
  };
}

function makeApp() {
  const doc = defaultDocument();
  doc.id = 'document:integration-004';
  doc.title = 'Grounded decision bridge fixture';
  const layer = doc.pages[0].layers[0];
  layer.objects.push(
    pathFixture('path-a'),
    pathFixture('path-b'),
    pathFixture('path-hidden', { visible: false })
  );
  const counters = { approve: 0, execute: 0, revisionCapture: 0 };
  const app = {
    doc,
    selection: [],
    counters,
    history: { undoStack: [], redoStack: [], pending: null },
    revisions: {
      records: [{ revisionId: 'revision:integration-004' }],
      revisionIdFor: () => 'revision:integration-004',
      capture() { counters.revisionCapture++; throw new Error('revision capture must not run'); }
    },
    page() { return this.doc.pages[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); }
  };
  app.chatBoundedEdit = {
    propose() { counters.execute++; throw new Error('bounded edit must not run'); },
    approve() { counters.approve++; throw new Error('approval must not run'); },
    execute() { counters.execute++; throw new Error('execution must not run'); }
  };
  app.chatCreativePlan = new ChatCreativePlanController(app);
  return app;
}

function refFor(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function planCandidate(app, {
  source = chatCreativePlanSource(app),
  firstTarget = 'path-a',
  secondTarget = 'path-b',
  firstOperation = 'path.repaint.v1'
} = {}) {
  return {
    schema: 'INK-CHAT-CREATIVE-PLAN',
    version: 1,
    source,
    intentSummary: 'Grounded repaint and translation proposal',
    steps: [
      {
        stepId: 'repaint-a',
        operation: firstOperation,
        targets: [firstTarget === 'missing' ? {
          pageId: app.page().id,
          layerId: app.page().layers[0].id,
          objectId: 'missing'
        } : refFor(app, firstTarget)],
        arguments: { fill: '#b63c36' },
        dependsOn: []
      },
      {
        stepId: 'move-b',
        operation: 'object.translate.v1',
        targets: [refFor(app, secondTarget)],
        arguments: { dx: 8, dy: -2 },
        dependsOn: ['repaint-a']
      }
    ]
  };
}

function toolResults() {
  return [{
    format: 'INK-TOOL-RESULT',
    version: '1.6.0',
    toolCallId: 'grounded-context-1',
    name: 'get_grounded_creative_context',
    status: 'COMPLETED',
    result: {
      schema: 'INK-GROUNDED-CREATIVE-INTELLIGENCE-CONTEXT',
      version: 1,
      formatVersion: 4,
      contextFingerprint: CONTEXT_FINGERPRINT
    }
  }];
}

function decision(app, overrides = {}) {
  const candidate = overrides.planCandidate === undefined ? planCandidate(app) : overrides.planCandidate;
  const targets = overrides.targets === undefined
    ? [refFor(app, 'path-b'), refFor(app, 'path-a')]
    : overrides.targets;
  return {
    schema: 'INK-GROUNDED-CREATIVE-DECISION',
    version: 1,
    decisionType: 'PLAN_PROPOSAL',
    sourceRequest: clone(REQUEST),
    groundedContextFingerprint: CONTEXT_FINGERPRINT,
    toolEvidence: [{ toolCallId: 'grounded-context-1', tool: 'get_grounded_creative_context' }],
    targets,
    rationale: 'The grounded structure supports a bounded two-step proposal.',
    assumptions: ['Current visible paths remain editable.', 'User approval is still required.'],
    planCandidate: candidate,
    unresolvedEvidence: [{ code: 'COLOR_INTENT_USER_CONFIRMATION' }],
    unsupportedEvidence: [],
    ...overrides
  };
}

function trust(overrides = {}) {
  return {
    expectedRequest: clone(REQUEST),
    trustedGroundedContextFingerprint: CONTEXT_FINGERPRINT,
    trustedToolResults: toolResults(),
    ...overrides
  };
}

{
  const app = makeApp();
  const raw = decision(app);
  const equivalent = {
    ...clone(raw),
    assumptions: [...raw.assumptions].reverse(),
    targets: [...raw.targets].reverse(),
    toolEvidence: raw.toolEvidence.map(item => ({ tool: item.tool, toolCallId: item.toolCallId }))
  };
  const first = normalizeGroundedCreativeDecision(raw, trust());
  const second = normalizeGroundedCreativeDecision(equivalent, trust());
  assert.equal(first.fingerprint, second.fingerprint);
  assert.deepEqual(first, second);
  assert.equal(first.toolEvidence[0].resultFingerprint.startsWith('fnv1a32:'), true);
}

{
  const app = makeApp();
  const beforeDocument = JSON.stringify(app.doc);
  const beforeHistory = JSON.stringify(app.history);
  const beforeRevisions = JSON.stringify(app.revisions.records);
  const result = createGroundedCreativePlanProposal(app, decision(app), trust());

  assert.equal(result.status, 'PROPOSED');
  assert.equal(result.proposal.schema, 'INK-CHAT-CREATIVE-PLAN');
  assert.equal(result.proposal.status, 'PROPOSED');
  assert.equal(result.proposal.approved, false);
  assert.equal(result.proposal.approvalToken, null);
  assert.equal(result.validation.valid, true);
  assert.equal(result.metadata.groundedContextFingerprint, CONTEXT_FINGERPRINT);
  assert.equal(result.metadata.toolEvidence[0].toolCallId, 'grounded-context-1');
  assert.equal(app.chatCreativePlan.getPlan(result.proposal.planId).status, 'PROPOSED');
  assert.equal(app.chatCreativePlan.approvalSequence, 0);
  assert.deepEqual(app.counters, { approve: 0, execute: 0, revisionCapture: 0 });
  assert.equal(JSON.stringify(app.doc), beforeDocument);
  assert.equal(JSON.stringify(app.history), beforeHistory);
  assert.equal(JSON.stringify(app.revisions.records), beforeRevisions);
}

for (const [field, value, code] of [
  ['documentId', 'document:stale', 'CHAT_PLAN_STALE_DOCUMENT'],
  ['pageId', 'page:stale', 'CHAT_PLAN_STALE_PAGE'],
  ['revisionId', 'revision:stale', 'CHAT_PLAN_STALE_REVISION'],
  ['documentFingerprint', 'fnv1a32:stale', 'CHAT_PLAN_STALE_DOCUMENT_FINGERPRINT']
]) {
  const app = makeApp();
  const staleSource = { ...chatCreativePlanSource(app), [field]: value };
  assert.throws(
    () => createGroundedCreativePlanProposal(app, decision(app, {
      planCandidate: planCandidate(app, { source: staleSource })
    }), trust()),
    error => error?.code === code
  );
}

{
  const app = makeApp();
  const missing = { pageId: app.page().id, layerId: app.page().layers[0].id, objectId: 'missing' };
  assert.throws(
    () => createGroundedCreativePlanProposal(app, decision(app, {
      planCandidate: planCandidate(app, { firstTarget: 'missing' }),
      targets: [missing, refFor(app, 'path-b')]
    }), trust()),
    error => error?.code === 'CHAT_EDIT_TARGET_MISSING'
  );
}

{
  const app = makeApp();
  assert.throws(
    () => createGroundedCreativePlanProposal(app, decision(app, {
      planCandidate: planCandidate(app, { firstTarget: 'path-hidden' }),
      targets: [refFor(app, 'path-hidden'), refFor(app, 'path-b')]
    }), trust()),
    error => error?.code === 'CHAT_EDIT_TARGET_HIDDEN'
  );
}

{
  const app = makeApp();
  const unsupported = planCandidate(app, { firstOperation: 'object.delete.v1' });
  assert.throws(
    () => createGroundedCreativePlanProposal(app, decision(app, { planCandidate: unsupported }), trust()),
    error => error?.code === 'CHAT_EDIT_OPERATION_NOT_ALLOWED'
  );
}

{
  const app = makeApp();
  assert.throws(
    () => createGroundedCreativePlanProposal(app, decision(app, {
      targets: [refFor(app, 'path-a')]
    }), trust()),
    error => error?.code === 'GROUNDED_CREATIVE_DECISION_PLAN_TARGET_UNGROUNDED'
  );
}

{
  const app = makeApp();
  const discussion = decision(app, {
    decisionType: 'DISCUSSION_ONLY',
    planCandidate: null,
    targets: [],
    unresolvedEvidence: [{ code: 'USER_INTENT_IS_DISCUSSION' }]
  });
  const result = createGroundedCreativePlanProposal(null, discussion, trust());
  assert.equal(result.status, 'DISCUSSION_ONLY');
  assert.equal(result.proposal, null);
  assert.deepEqual(result.metadata.unresolvedEvidence, [{ code: 'USER_INTENT_IS_DISCUSSION' }]);
}

{
  const app = makeApp();
  assert.throws(
    () => normalizeGroundedCreativeDecision(decision(app, {
      sourceRequest: { ...REQUEST, requestId: 'chatmsg:stale' }
    }), trust()),
    error => error?.code === 'GROUNDED_CREATIVE_DECISION_STALE_REQUEST'
  );
  assert.throws(
    () => normalizeGroundedCreativeDecision(decision(app, {
      toolEvidence: [{ toolCallId: 'fabricated', tool: 'get_grounded_creative_context' }]
    }), trust()),
    error => error?.code === 'GROUNDED_CREATIVE_DECISION_TOOL_EVIDENCE_UNTRUSTED'
  );
}

class SequenceClient extends ChatClientInterface {
  constructor(sequence) {
    super({ provider: 'integration-004-sequence', localOnlyMode: true });
    this.sequence = [...sequence];
    this.requests = [];
  }
  async createMessage(request) {
    this.requests.push(clone(request));
    const next = this.sequence.shift();
    return typeof next === 'function' ? next(request) : clone(next);
  }
}

function runtimeLayer(app) {
  return {
    app,
    manifest: { toJSON: () => ({ format: 'INK-CAPABILITY-MANIFEST', version: 1, operations: [] }) },
    stateReader: {
      read: () => ({
        documentSummary: { documentId: app.doc.id, title: app.doc.title },
        layerTree: [], objectIndex: [], strokeIndex: [], regionIndex: [], editableTargets: [],
        protectedTargets: [], selection: [], semanticRegions: [], palette: [], historySummary: { entries: [] }
      })
    },
    currentDocument: () => app.doc,
    audit: { add() {} }
  };
}

{
  const app = makeApp();
  const layer = runtimeLayer(app);
  const provider = { read: () => clone(toolResults()[0].result) };
  const audit = { record() {}, recordTransmission() {} };
  const router = new ToolCallRouter({ layer, auditBridge: audit, groundedContextProvider: provider });
  const client = new SequenceClient([
    { content: '', toolCalls: [{ id: 'grounded-context-1', name: 'get_grounded_creative_context', arguments: {} }] },
    request => {
      const identity = request.metadata.groundedContinuation;
      return {
        content: JSON.stringify(decision(app, {
          sourceRequest: { requestId: identity.originalRequestId, sessionId: identity.sessionId }
        })),
        source: 'DETERMINISTIC_TEST'
      };
    }
  ]);
  const contextBuilder = {
    build: () => ({
      format: 'INK-CHAT-CONTEXT', version: '1.6.0', level: 'DOCUMENT_SUMMARY',
      hash: 'fnv1a32:integration-004-context',
      payload: { groundedCreativeIntelligence: clone(toolResults()[0].result) }
    })
  };
  const manager = new ChatSessionManager({
    layer,
    contextBuilder,
    validator: {},
    toolRouter: router,
    auditBridge: audit,
    credentialStore: { clearAll() {} }
  });
  manager.register('sequence', client);
  const session = manager.start({ client: 'sequence' });
  const before = JSON.stringify({ doc: app.doc, history: app.history, revisions: app.revisions.records });
  const response = await manager.requestConversation(session.sessionId, {
    prompt: 'Use grounded evidence to prepare an editable plan.',
    transmissionDecision: 'LOCAL_ONLY'
  });

  assert.equal(client.requests.length, 2);
  assert.equal(response.groundedDecision.decisionType, 'PLAN_PROPOSAL');
  assert.equal(response.planProposal.status, 'PROPOSED');
  assert.equal(response.planProposal.proposal.approvalToken, null);
  assert.equal(app.chatCreativePlan.approvalSequence, 0);
  assert.deepEqual(app.counters, { approve: 0, execute: 0, revisionCapture: 0 });
  assert.equal(JSON.stringify({ doc: app.doc, history: app.history, revisions: app.revisions.records }), before);
}

assert.equal(FORMAT_VERSION, 4);

{
  const decisionSource = readFileSync(new URL('../product/source/src/ai/grounded-creative-decision.js', import.meta.url), 'utf8');
  const runtimeSource = readFileSync(new URL('../product/source/src/ai/chat-runtime.js', import.meta.url), 'utf8');
  const serviceWorkerSource = readFileSync(new URL('../product/source/service-worker.js', import.meta.url), 'utf8');
  assert.match(runtimeSource, /createGroundedCreativePlanProposal/);
  assert.match(runtimeSource, /groundedDecision/);
  assert.match(runtimeSource, /planProposal/);
  assert.match(serviceWorkerSource, /src\/ai\/grounded-creative-decision\.js/);
  assert.doesNotMatch(decisionSource, /\beval\s*\(/);
  assert.doesNotMatch(decisionSource, /new\s+Function\s*\(/);
  assert.doesNotMatch(decisionSource, /\bfetch\s*\(/);
  assert.doesNotMatch(decisionSource, /WebSocket|XMLHttpRequest|sendBeacon/);
}

console.log('INK-CORE-INTEGRATION-004 grounded creative decision and plan bridge deterministic/source tests: PASS');
