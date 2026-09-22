import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  ChatClientInterface,
  ChatSessionManager,
  GROUNDED_TOOL_NAMES,
  RuntimeError,
  ToolCallRouter,
  toolDefinitions
} from '../product/source/src/ai/chat-runtime.js';
import { CREATIVE_INTELLIGENCE_FORMAT_VERSION } from '../product/source/src/ai/creative-intelligence-context.js';
import { PARAMETRIC_STRUCTURE_FORMAT_VERSION } from '../product/source/src/structure/parametric-structure.js';

const clone = value => JSON.parse(JSON.stringify(value));

function layerFixture() {
  const document = {
    format: 'INK',
    formatVersion: 4,
    id: 'document:tool-surface',
    title: 'Tool Surface Fixture',
    pages: []
  };
  return {
    document,
    history: { undoStack: [{ label: 'before' }], redoStack: [] },
    revisions: { records: [{ revisionId: 'revision:before' }] },
    manifest: {
      toJSON: () => ({ format: 'INK-CAPABILITY-MANIFEST', version: 1, operations: [] }),
      get: () => ({ operationName: 'fixture' })
    },
    stateReader: { read: () => ({ documentSummary: { documentId: document.id }, layerTree: [], objectIndex: [], strokeIndex: [], regionIndex: [], editableTargets: [], protectedTargets: [], palette: [], historySummary: { entries: [] } }) },
    currentDocument() { return document; },
    createPlanFromSteps(intent, steps, plan) { return { ...clone(plan), userIntent: intent, orderedSteps: clone(steps), planId: plan.planId || 'plan:fixture' }; },
    editPlan: () => ({ status: 'VALID' }),
    preview: () => ({ previewId: 'preview:fixture' }),
    previews: new Map(),
    approve: () => ({ approvalId: 'approval:fixture' }),
    executeApproval: () => ({ executionId: 'execution:fixture' }),
    rollback: () => ({ status: 'ROLLED_BACK' }),
    previewEngine: { branch: () => clone(document) }
  };
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
    structureId: 'structure:tool-surface',
    seed: 7,
    nodes: [{ key: 'node', role: 'shape', transform: [1, 0, 0, 1, 0, 0] }],
    relationships: []
  };
}

function call(id, name, args = {}) {
  return { id, name, arguments: clone(args) };
}

const layer = layerFixture();
const groundedReads = [];
const groundedContextProvider = {
  read(options = {}) {
    groundedReads.push(clone(options));
    return {
      schema: 'INK-GROUNDED-CREATIVE-INTELLIGENCE-CONTEXT',
      version: 1,
      formatVersion: 4,
      contextFingerprint: 'fnv1a32:grounded-tool-surface',
      authority: {
        role: 'ADVISORY_READ_ONLY_CONTEXT',
        documentWrite: false,
        historyWrite: false,
        revisionWrite: false,
        geometryWrite: false,
        renderer: false,
        execution: false
      }
    };
  }
};
const router = new ToolCallRouter({ layer, groundedContextProvider });
const beforeDocument = JSON.stringify(layer.document);
const beforeHistory = JSON.stringify(layer.history);
const beforeRevisions = JSON.stringify(layer.revisions);

{
  const definitions = toolDefinitions();
  const names = definitions.map(item => item.function.name);
  for (const name of GROUNDED_TOOL_NAMES) assert.ok(names.includes(name), `${name} must be published`);
  for (const legacy of ['get_capabilities', 'get_document_summary', 'request_preview', 'execute_approved_plan']) assert.ok(names.includes(legacy), `legacy tool ${legacy} must remain published`);
  const compare = definitions.find(item => item.function.name === 'compare_visual_subjects').function.parameters;
  assert.deepEqual(compare.required, ['subjectA', 'subjectB']);
  const parametric = definitions.find(item => item.function.name === 'resolve_parametric_structure').function.parameters;
  assert.deepEqual(parametric.required, ['descriptor']);
}

{
  const grounded = await router.route(call('grounded-1', 'get_grounded_creative_context'), { permission: 'OBSERVE' });
  assert.equal(grounded.result.contextFingerprint, 'fnv1a32:grounded-tool-surface');
  assert.deepEqual(groundedReads.at(-1), { historyEntries: [] });

  const compareOne = await router.route(call('compare-1', 'compare_visual_subjects', compareArgs()), { permission: 'OBSERVE' });
  const compareTwo = await router.route(call('compare-2', 'compare_visual_subjects', compareArgs()), { permission: 'OBSERVE' });
  assert.equal(compareOne.result.comparisonFingerprint, compareTwo.result.comparisonFingerprint);
  assert.deepEqual(compareOne.result, compareTwo.result);

  const missingCompare = await router.route(call('compare-missing', 'compare_visual_subjects', { subjectA: compareArgs().subjectA }), { permission: 'OBSERVE' });
  assert.equal(missingCompare.result.status, 'INPUT_REQUIRED');
  assert.equal(missingCompare.result.code, 'EXPLICIT_COMPARISON_SUBJECTS_REQUIRED');

  const structureOne = await router.route(call('structure-1', 'resolve_parametric_structure', { descriptor: structureDescriptor() }), { permission: 'PROPOSE' });
  const structureTwo = await router.route(call('structure-2', 'resolve_parametric_structure', { descriptor: structureDescriptor() }), { permission: 'PROPOSE' });
  assert.equal(structureOne.result.structureFingerprint, structureTwo.result.structureFingerprint);
  assert.deepEqual(structureOne.result, structureTwo.result);
  assert.equal(structureOne.result.authority.documentWrite, false);
  assert.equal(structureOne.result.authority.historyWrite, false);
  assert.equal(structureOne.result.authority.revisionWrite, false);
  assert.equal(structureOne.result.authority.renderer, false);

  const missingStructure = await router.route(call('structure-missing', 'resolve_parametric_structure'), { permission: 'PROPOSE' });
  assert.equal(missingStructure.result.status, 'INPUT_REQUIRED');
  assert.equal(missingStructure.result.code, 'EXPLICIT_PARAMETRIC_DESCRIPTOR_REQUIRED');

  await assert.rejects(
    router.route(call('structure-observe', 'resolve_parametric_structure', { descriptor: structureDescriptor() }), { permission: 'OBSERVE' }),
    error => error instanceof RuntimeError && error.code === 'PERMISSION_DENIED'
  );

  await assert.rejects(
    router.route(call('legacy-preview-observe', 'request_preview', { recipeId: 'recipe:1' }), { permission: 'OBSERVE' }),
    error => error instanceof RuntimeError && error.code === 'PERMISSION_DENIED'
  );
  await assert.rejects(
    router.route(call('legacy-execute-propose', 'execute_approved_plan', { approvalId: 'approval:1' }), { permission: 'PROPOSE' }),
    error => error instanceof RuntimeError && error.code === 'PERMISSION_DENIED'
  );
}

assert.equal(JSON.stringify(layer.document), beforeDocument, 'grounded tools must not mutate the document');
assert.equal(JSON.stringify(layer.history), beforeHistory, 'grounded tools must not mutate History state');
assert.equal(JSON.stringify(layer.revisions), beforeRevisions, 'grounded tools must not mutate Revision state');

class CaptureClient extends ChatClientInterface {
  constructor() {
    super({ provider: 'capture', localOnlyMode: true });
    this.planRequest = null;
    this.conversationRequest = null;
  }
  async createPlan(request) {
    this.planRequest = clone(request);
    return {
      content: JSON.stringify({
        format: 'INK-EDITABLE-PLAN',
        planId: 'plan:capture',
        userIntent: 'inspect',
        summary: 'inspect',
        orderedSteps: [],
        rollbackStrategy: 'none',
        recipeDraft: { format: 'fixture' }
      }),
      toolCalls: [call('plan-grounded', 'get_grounded_creative_context')]
    };
  }
  async createMessage(request) {
    this.conversationRequest = clone(request);
    return {
      content: 'Grounded context requested.',
      source: 'DETERMINISTIC_TEST',
      toolCalls: [call('conversation-compare', 'compare_visual_subjects', compareArgs())]
    };
  }
}

{
  const client = new CaptureClient();
  const contextBuilder = {
    build: () => ({
      format: 'INK-CHAT-CONTEXT',
      version: '1.6.0',
      level: 'DOCUMENT_SUMMARY',
      hash: 'fnv1a32:context',
      payload: { documentSummary: { documentId: layer.document.id } }
    })
  };
  const validator = {
    async repair(raw) { return { plan: JSON.parse(raw), attempts: 0 }; }
  };
  const auditBridge = { recordTransmission() {} };
  const manager = new ChatSessionManager({
    layer,
    contextBuilder,
    validator,
    toolRouter: router,
    auditBridge,
    credentialStore: { clearAll() {} }
  });
  manager.register('capture', client);
  const session = manager.start({ client: 'capture' });

  const plan = await manager.requestPlan(session.sessionId, { prompt: 'Inspect', transmissionDecision: 'LOCAL_ONLY' });
  assert.deepEqual(plan.toolCalls.map(item => item.name), ['get_grounded_creative_context']);
  assert.equal(plan.toolResults[0].result.contextFingerprint, 'fnv1a32:grounded-tool-surface');
  for (const name of GROUNDED_TOOL_NAMES) assert.ok(client.planRequest.metadata.tools.some(item => item.function.name === name));

  const conversation = await manager.requestConversation(session.sessionId, { prompt: 'Compare', transmissionDecision: 'LOCAL_ONLY' });
  assert.deepEqual(conversation.toolCalls.map(item => item.name), ['compare_visual_subjects']);
  assert.ok(conversation.toolResults[0].result.comparisonFingerprint);
  for (const name of GROUNDED_TOOL_NAMES) assert.ok(client.conversationRequest.metadata.tools.some(item => item.function.name === name));
}

{
  const source = readFileSync(new URL('../product/source/src/ai/chat-runtime.js', import.meta.url), 'utf8');
  const start = source.indexOf("case 'get_grounded_creative_context':");
  const end = source.indexOf("case 'create_plan':", start);
  assert.ok(start >= 0 && end > start);
  const groundedCases = source.slice(start, end);
  for (const forbidden of ['executeApproval(', '.approve(', '.rollback(', 'restoreCheckpoint', '.commit(', 'renderExportCanvas(', 'document.querySelector', 'fetch(']) {
    assert.equal(groundedCases.includes(forbidden), false, `grounded router cases must not use ${forbidden}`);
  }
  assert.ok(source.includes("metadata: { tools: toolDefinitions() }"), 'CHAT request paths must publish the bounded tool definitions');
  assert.ok(source.includes("groundedContextProvider: resolvedGroundedContextProvider"), 'router must reuse the Integration-001 grounded provider');
}

assert.equal(CREATIVE_INTELLIGENCE_FORMAT_VERSION, 4);
assert.equal(PARAMETRIC_STRUCTURE_FORMAT_VERSION, 4);

console.log('INK-CORE-INTEGRATION-002 grounded creative tool surface deterministic/source tests: PASS');
