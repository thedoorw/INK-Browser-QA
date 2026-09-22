import assert from 'node:assert/strict';
import {
  ChatClientInterface,
  ChatSessionManager,
  GROUNDED_CONTINUATION_MAX,
  GROUNDED_TOOL_RESULT_MAX_BYTES,
  ToolCallRouter
} from '../product/source/src/ai/chat-runtime.js';
import { CREATIVE_INTELLIGENCE_FORMAT_VERSION } from '../product/source/src/ai/creative-intelligence-context.js';
import { PARAMETRIC_STRUCTURE_FORMAT_VERSION } from '../product/source/src/structure/parametric-structure.js';

const clone = value => JSON.parse(JSON.stringify(value));

function layerFixture() {
  const document = {
    format: 'INK',
    formatVersion: 4,
    id: 'document:integration-003',
    title: 'Bounded continuation fixture',
    pages: []
  };
  const counters = { preview: 0, approval: 0, execute: 0, rollback: 0 };
  return {
    document,
    counters,
    history: { undoStack: [{ label: 'before' }], redoStack: [] },
    revisions: { records: [{ revisionId: 'revision:before' }] },
    manifest: {
      toJSON: () => ({ format: 'INK-CAPABILITY-MANIFEST', version: 1, operations: [] }),
      get: () => ({ operationName: 'fixture' })
    },
    stateReader: {
      read: () => ({
        documentSummary: { documentId: document.id, title: document.title, objectCount: 0 },
        layerTree: [],
        objectIndex: [],
        strokeIndex: [],
        regionIndex: [],
        editableTargets: [],
        protectedTargets: [],
        selection: [],
        semanticRegions: [],
        palette: [],
        historySummary: { entries: [] }
      })
    },
    currentDocument() { return document; },
    createPlanFromSteps(intent, steps, plan) { return { ...clone(plan), userIntent: intent, orderedSteps: clone(steps), planId: plan.planId || 'plan:fixture' }; },
    editPlan: () => ({ status: 'VALID' }),
    preview() { counters.preview++; return { previewId: 'preview:fixture' }; },
    previews: new Map(),
    approve() { counters.approval++; return { approvalId: 'approval:fixture' }; },
    executeApproval() { counters.execute++; return { executionId: 'execution:fixture' }; },
    rollback() { counters.rollback++; return { status: 'ROLLED_BACK' }; },
    previewEngine: { branch: () => clone(document) }
  };
}

function call(id, name, args = {}) {
  return { id, name, arguments: clone(args) };
}

function compareArgs() {
  return {
    subjectA: {
      kind: 'reference',
      referenceId: 'reference:a',
      label: 'Reference A',
      visualDescriptors: { silhouette: 'round', density: 0.5 }
    },
    subjectB: {
      kind: 'reference',
      referenceId: 'reference:b',
      label: 'Reference B',
      visualDescriptors: { silhouette: 'round', density: 0.75 }
    },
    options: { mode: 'structural' }
  };
}

function structureDescriptor() {
  return {
    schema: 'INK-PARAMETRIC-STRUCTURE',
    version: 1,
    structureId: 'structure:integration-003',
    seed: 7,
    nodes: [{ key: 'node', role: 'shape', transform: [1, 0, 0, 1, 0, 0] }],
    relationships: []
  };
}

class SequenceClient extends ChatClientInterface {
  constructor(sequence, settings = { provider: 'sequence', localOnlyMode: true }) {
    super(settings);
    this.sequence = [...sequence];
    this.requests = [];
  }
  async createMessage(request) {
    this.requests.push(clone(request));
    const next = this.sequence.shift();
    if (!next) throw new Error('Unexpected createMessage call');
    return typeof next === 'function' ? next(request, this) : clone(next);
  }
  async createPlan(request) {
    this.requests.push(clone(request));
    const next = this.sequence.shift();
    if (!next) throw new Error('Unexpected createPlan call');
    return typeof next === 'function' ? next(request, this) : clone(next);
  }
}

function contextBuilder(layer) {
  return {
    build: () => ({
      format: 'INK-CHAT-CONTEXT',
      version: '1.6.0',
      level: 'DOCUMENT_SUMMARY',
      hash: 'fnv1a32:integration-003-context',
      payload: { documentSummary: { documentId: layer.document.id, title: layer.document.title, objectCount: 0 } }
    })
  };
}

function validator() {
  return {
    validate(raw) { return typeof raw === 'string' ? JSON.parse(raw) : clone(raw); },
    async repair(raw) { return { plan: typeof raw === 'string' ? JSON.parse(raw) : clone(raw), attempts: 0 }; }
  };
}

function auditBridge() {
  return {
    transmissions: [],
    toolRecords: [],
    record(entry) { this.toolRecords.push(clone(entry)); },
    recordTransmission(preview, decision) { this.transmissions.push({ preview: clone(preview), decision }); }
  };
}

function managerFixture({ client, groundedContextProvider } = {}) {
  const layer = layerFixture();
  const audit = auditBridge();
  const provider = groundedContextProvider || {
    read: () => ({
      schema: 'INK-GROUNDED-CREATIVE-INTELLIGENCE-CONTEXT',
      version: 1,
      formatVersion: 4,
      contextFingerprint: 'fnv1a32:integration-003-grounded',
      authority: {
        role: 'ADVISORY_READ_ONLY_CONTEXT',
        documentWrite: false,
        historyWrite: false,
        revisionWrite: false,
        geometryWrite: false,
        renderer: false,
        execution: false
      }
    })
  };
  const router = new ToolCallRouter({ layer, auditBridge: audit, groundedContextProvider: provider });
  const manager = new ChatSessionManager({
    layer,
    contextBuilder: contextBuilder(layer),
    validator: validator(),
    toolRouter: router,
    auditBridge: audit,
    credentialStore: { clearAll() {} }
  });
  manager.register('sequence', client);
  const session = manager.start({ client: 'sequence' });
  return { layer, audit, router, manager, session };
}

assert.equal(GROUNDED_CONTINUATION_MAX, 1);
assert.ok(GROUNDED_TOOL_RESULT_MAX_BYTES > 0);

{
  const client = new SequenceClient([
    { content: '', toolCalls: [call('grounded-1', 'get_grounded_creative_context')] },
    request => {
      const evidence = request.metadata.groundedContinuation;
      assert.equal(evidence.format, 'INK-GROUNDED-TOOL-CONTINUATION');
      assert.equal(evidence.round, 1);
      assert.equal(evidence.maxRounds, 1);
      assert.equal(evidence.toolCalls[0].id, 'grounded-1');
      assert.equal(evidence.toolResults[0].toolCallId, 'grounded-1');
      assert.equal(evidence.toolResults[0].result.contextFingerprint, 'fnv1a32:integration-003-grounded');
      return { content: 'Final grounded response.', source: 'DETERMINISTIC_TEST' };
    }
  ]);
  const { layer, manager, session } = managerFixture({ client });
  const beforeDocument = JSON.stringify(layer.document);
  const beforeHistory = JSON.stringify(layer.history);
  const beforeRevisions = JSON.stringify(layer.revisions);
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Inspect grounded context', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(client.requests.length, 2);
  assert.equal(response.content, 'Final grounded response.');
  assert.equal(response.continuation.status, 'COMPLETED');
  assert.deepEqual(response.continuation.groundedToolCallIds, ['grounded-1']);
  assert.equal(JSON.stringify(layer.document), beforeDocument);
  assert.equal(JSON.stringify(layer.history), beforeHistory);
  assert.equal(JSON.stringify(layer.revisions), beforeRevisions);
}

{
  const client = new SequenceClient([
    { content: '', toolCalls: [call('compare-1', 'compare_visual_subjects', compareArgs())] },
    request => {
      const comparison = request.metadata.groundedContinuation.toolResults[0].result;
      assert.ok(comparison.comparisonFingerprint);
      return { content: `Comparison evidence used: ${comparison.comparisonFingerprint}`, source: 'DETERMINISTIC_TEST' };
    }
  ]);
  const { manager, session } = managerFixture({ client });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Compare these subjects', transmissionDecision: 'LOCAL_ONLY' });
  assert.match(response.content, /Comparison evidence used:/);
  assert.equal(response.toolResults[0].name, 'compare_visual_subjects');
}

{
  const client = new SequenceClient([
    { content: '', toolCalls: [call('structure-1', 'resolve_parametric_structure', { descriptor: structureDescriptor() })] },
    request => {
      const structure = request.metadata.groundedContinuation.toolResults[0].result;
      assert.ok(structure.structureFingerprint);
      assert.equal(structure.authority.documentWrite, false);
      return { content: `Structure evidence used: ${structure.structureFingerprint}`, source: 'DETERMINISTIC_TEST' };
    }
  ]);
  const { layer, manager, session } = managerFixture({ client });
  const before = JSON.stringify(layer.document);
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Resolve structure only', transmissionDecision: 'LOCAL_ONLY' });
  assert.match(response.content, /Structure evidence used:/);
  assert.equal(JSON.stringify(layer.document), before, 'parametric grounded continuation must not insert document geometry');
}

{
  const client = new SequenceClient([
    { content: '', toolCalls: [call('grounded-limit-1', 'get_grounded_creative_context')] },
    { content: '', toolCalls: [call('grounded-limit-2', 'get_grounded_creative_context')] }
  ]);
  const { manager, session } = managerFixture({ client });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Try another read', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(client.requests.length, 2, 'automatic continuation must not recurse');
  assert.equal(response.status, 'TOOL_CONTINUATION_LIMIT_REACHED');
  assert.match(response.content, /TOOL_CONTINUATION_LIMIT_REACHED/);
  const blocked = response.toolResults.find(item => item.toolCallId === 'grounded-limit-2');
  assert.equal(blocked.status, 'BLOCKED');
  assert.equal(blocked.result.code, 'TOOL_CONTINUATION_LIMIT_REACHED');
}

{
  const client = new SequenceClient([
    {
      content: '',
      toolCalls: [
        call('grounded-mixed', 'get_grounded_creative_context'),
        call('legacy-preview-mixed', 'request_preview', { recipeId: 'recipe:1' })
      ]
    },
    { content: 'Use the normal approval flow for any edit.', source: 'DETERMINISTIC_TEST' }
  ]);
  const { layer, manager, session } = managerFixture({ client });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Inspect then edit', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(layer.counters.preview, 0, 'legacy proposal/mutation tool must not auto-route inside grounded reasoning phase');
  const surfaced = response.toolResults.find(item => item.toolCallId === 'legacy-preview-mixed');
  assert.equal(surfaced.status, 'NOT_AUTO_ROUTED');
  assert.equal(surfaced.result.code, 'NORMAL_USER_GOVERNED_FLOW_REQUIRED');
}

{
  const client = new SequenceClient([
    { content: '', toolCalls: [call('grounded-second-legacy', 'get_grounded_creative_context')] },
    { content: '', toolCalls: [call('legacy-second', 'request_preview', { recipeId: 'recipe:2' })] }
  ]);
  const { layer, manager, session } = managerFixture({ client });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Inspect then request a preview', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(client.requests.length, 2);
  assert.equal(layer.counters.preview, 0);
  assert.equal(response.status, 'USER_GOVERNED_FLOW_REQUIRED');
  assert.match(response.content, /user-governed tool flow/i);
}

{
  const client = new SequenceClient([
    { content: 'No tool needed.', source: 'DETERMINISTIC_TEST' }
  ]);
  const { manager, session } = managerFixture({ client });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Discuss only', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(client.external, false);
  assert.equal(client.requests.length, 1);
  assert.equal(response.continuation, null);
  assert.equal(response.content, 'No tool needed.');
}

{
  const validPlan = {
    format: 'INK-EDITABLE-PLAN',
    planId: 'plan:grounded-final',
    userIntent: 'inspect',
    summary: 'Grounded final plan',
    orderedSteps: [],
    rollbackStrategy: 'none',
    recipeDraft: { format: 'fixture' }
  };
  const client = new SequenceClient([
    { content: '', toolCalls: [call('plan-grounded-1', 'get_grounded_creative_context')] },
    request => {
      assert.equal(request.metadata.groundedContinuation.toolCalls[0].id, 'plan-grounded-1');
      return { content: JSON.stringify(validPlan), toolCalls: [] };
    }
  ]);
  const { manager, session } = managerFixture({ client });
  const response = await manager.requestPlan(session.sessionId, { prompt: 'Create a grounded plan', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(client.requests.length, 2);
  assert.equal(response.plan.planId, 'plan:grounded-final');
  assert.equal(response.continuation.status, 'COMPLETED');
}

{
  const huge = 'x'.repeat(GROUNDED_TOOL_RESULT_MAX_BYTES * 3);
  const client = new SequenceClient([
    { content: '', toolCalls: [call('grounded-bounded', 'get_grounded_creative_context')] },
    request => {
      const result = request.metadata.groundedContinuation.toolResults[0];
      assert.equal(result.status, 'BOUNDED');
      assert.equal(result.result.status, 'TRUNCATED');
      assert.ok(JSON.stringify(result).length < GROUNDED_TOOL_RESULT_MAX_BYTES);
      return { content: 'Bounded evidence received.' };
    }
  ]);
  const { manager, session } = managerFixture({
    client,
    groundedContextProvider: {
      read: () => ({
        schema: 'INK-GROUNDED-CREATIVE-INTELLIGENCE-CONTEXT',
        version: 1,
        formatVersion: 4,
        contextFingerprint: 'fnv1a32:huge',
        payload: huge
      })
    }
  });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Read bounded context', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(response.content, 'Bounded evidence received.');
}

{
  const client = new SequenceClient([
    { content: '', toolCalls: [call('external-grounded', 'get_grounded_creative_context')] },
    { content: 'External continuation complete.' }
  ], {
    provider: 'external-sequence',
    endpoint: 'https://example.test/model',
    model: 'fixture',
    streaming: false,
    retryCount: 0,
    localOnlyMode: false
  });
  const { audit, manager, session } = managerFixture({ client });
  manager.setMode('AI_ASSISTED');
  const blocked = await manager.requestConversation(session.sessionId, { prompt: 'External inspect', transmissionDecision: 'TEXT_SUMMARY', userConsent: false });
  assert.equal(blocked.status, 'TRANSMISSION_APPROVAL_REQUIRED');
  assert.equal(client.requests.length, 0);
  assert.equal(audit.transmissions.length, 0);

  const response = await manager.requestConversation(session.sessionId, { prompt: 'External inspect', transmissionDecision: 'TEXT_SUMMARY', userConsent: true });
  assert.equal(response.content, 'External continuation complete.');
  assert.equal(client.requests.length, 2);
  assert.equal(audit.transmissions.length, 2, 'external continuation must pass through the normal transmission policy/audit path');
}

assert.equal(CREATIVE_INTELLIGENCE_FORMAT_VERSION, 4);
assert.equal(PARAMETRIC_STRUCTURE_FORMAT_VERSION, 4);

console.log('INK-CORE-INTEGRATION-003 bounded grounded tool reasoning deterministic/source tests: PASS');
