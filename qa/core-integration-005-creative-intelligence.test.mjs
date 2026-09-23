import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

import {
  CREATIVE_INTELLIGENCE_FORMAT_VERSION,
  createCreativeIntelligenceContextAdapter
} from '../product/source/src/ai/creative-intelligence-context.js';
import {
  ChatClientInterface,
  ChatSessionManager,
  GROUNDED_CONTINUATION_MAX,
  GROUNDED_TOOL_NAMES,
  ToolCallRouter,
  toolDefinitions
} from '../product/source/src/ai/chat-runtime.js';
import {
  createCreativeMemoryAdapter,
  createCreativeMemoryCollection
} from '../product/source/src/memory/creative-memory.js';
import {
  bridgeResearchToCreativeConstraints,
  createResearchCreationBridgeAdapter,
  extractResearchPrinciples,
  normalizeResearchEvidence
} from '../product/source/src/research/research-creation-bridge.js';
import { FORMAT_VERSION } from '../product/source/src/config.js';
import { defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { ChatCreativePlanController, chatCreativePlanSource } from '../product/source/src/editor/chat-creative-plan.js';
import { createPath } from '../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function memoryRecord(id, overrides = {}) {
  return {
    scope: { projectId: 'project:integration-005', documentId: 'document:integration-005' },
    category: 'COMPOSITION_RULE',
    title: `Memory ${id}`,
    sourceEvidence: [{ kind: 'GROUNDED_DECISION', id: `decision:${id}`, fingerprint: `fnv1a32:decision-${id}`, status: 'RESOLVED' }],
    references: {
      revisionIds: [`revision:${id}`],
      provenanceIds: [],
      decisionIds: [`fnv1a32:decision-${id}`],
      objectIds: ['path-a'],
      regionIds: []
    },
    statement: `Keep a bounded dominant form for ${id}.`,
    attributes: { hierarchy: 'dominant' },
    outcome: 'Retained after review.',
    disposition: 'ACCEPTED',
    confidence: 0.9,
    evidenceStrength: 'DIRECT',
    tags: ['hierarchy', id],
    createdFrom: { kind: 'GROUNDED_DECISION', id: `decision:${id}`, fingerprint: `fnv1a32:decision-${id}` },
    notes: null,
    unresolvedEvidence: [],
    ...overrides
  };
}

function researchFixture() {
  const evidence = normalizeResearchEvidence({
    source: { id: 'reference:integration-005', type: 'LOCAL_REFERENCE', label: 'Local study' },
    evidenceClass: 'COMPOSITION_OBSERVATION',
    title: 'Dominant center',
    observation: 'One dominant form carries the main visual weight.',
    attributes: { dominance: 'high' },
    confidence: 0.9,
    evidenceStrength: 'DIRECT',
    tags: ['centered'],
    relatedSourceRefs: [{ type: 'REFERENCE', id: 'reference:integration-005' }],
    state: 'RESOLVED',
    provenance: {
      revisionIds: ['revision:research'],
      provenanceIds: [],
      decisionIds: [],
      objectIds: ['path-a'],
      regionIds: []
    }
  });
  const principles = extractResearchPrinciples([evidence], [{
    category: 'COMPOSITION',
    label: 'Single dominant center',
    statement: 'Keep one dominant central form.',
    supportingEvidenceRefs: [evidence.evidenceId],
    applicabilityScope: { projectId: 'project:integration-005', documentId: 'document:integration-005' },
    confidence: 0.9,
    evidenceStrength: 'DIRECT',
    tags: ['centered'],
    assumptions: []
  }]);
  const constraints = bridgeResearchToCreativeConstraints(principles, [{
    label: 'Dominant center constraint',
    statement: 'Reserve the primary visual mass for one dominant form.',
    principleRefs: [principles[0].principleId],
    parameters: { dominantCount: 1 },
    tags: ['composition']
  }]);
  return { evidence: [evidence], principles, constraints };
}

function pathFixture(id) {
  return createPath({
    id,
    fill: '#d8d1c7',
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
  });
}

function makeApp() {
  const doc = defaultDocument();
  doc.id = 'document:integration-005';
  doc.title = 'Creative intelligence integration fixture';
  doc.pages[0].layers[0].objects.push(pathFixture('path-a'));
  const counters = { approve: 0, execute: 0, revisionCapture: 0 };
  const app = {
    doc,
    selection: [],
    counters,
    history: { undoStack: [], redoStack: [], pending: null },
    revisions: {
      records: [{ revisionId: 'revision:integration-005' }],
      revisionIdFor: () => 'revision:integration-005',
      capture() { counters.revisionCapture++; throw new Error('Revision capture must not run before approval.'); }
    },
    page() { return this.doc.pages[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); }
  };
  app.chatBoundedEdit = {
    propose() { counters.execute++; throw new Error('Bounded edit must not execute.'); },
    approve() { counters.approve++; throw new Error('Approval must not run.'); },
    execute() { counters.execute++; throw new Error('Execution must not run.'); }
  };
  app.chatCreativePlan = new ChatCreativePlanController(app);
  return app;
}

function layerFor(app) {
  return {
    app,
    currentDocument: () => app.doc,
    manifest: {
      toJSON: () => ({ format: 'INK-CAPABILITY-MANIFEST', version: 1, operations: [] }),
      get: () => ({ operationName: 'fixture' })
    },
    stateReader: {
      read: () => ({
        documentSummary: { documentId: app.doc.id, title: app.doc.title, objectCount: 1 },
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
    }
  };
}

function call(id, name, args = {}) {
  return { id, name, arguments: clone(args) };
}

class SequenceClient extends ChatClientInterface {
  constructor(sequence) {
    super({ provider: 'integration-005-sequence', localOnlyMode: true });
    this.sequence = [...sequence];
    this.requests = [];
  }
  async createMessage(request) {
    this.requests.push(clone(request));
    const next = this.sequence.shift();
    if (!next) throw new Error('Unexpected createMessage call');
    return typeof next === 'function' ? next(request) : clone(next);
  }
}

function auditBridge() {
  return {
    records: [],
    transmissions: [],
    record(value) { this.records.push(clone(value)); },
    recordTransmission(preview, decision) { this.transmissions.push({ preview: clone(preview), decision }); }
  };
}

const app = makeApp();
const document = app.doc;
const memories = [memoryRecord('b'), memoryRecord('a'), memoryRecord('c', {
  disposition: 'UNRESOLVED',
  evidenceStrength: 'UNRESOLVED',
  unresolvedEvidence: [{ code: 'SOURCE_PENDING', kind: 'GROUNDED_DECISION', id: 'decision:c' }]
})];
const memoryProviderA = createCreativeMemoryAdapter({ getRecords: () => memories });
const memoryProviderB = createCreativeMemoryAdapter({ getRecords: () => [...memories].reverse() });
const research = researchFixture();
const researchProviderA = createResearchCreationBridgeAdapter({
  getEvidence: () => research.evidence,
  getPrinciples: () => research.principles,
  getConstraints: () => research.constraints
});
const researchProviderB = createResearchCreationBridgeAdapter({
  getEvidence: () => [...research.evidence].reverse(),
  getPrinciples: () => [...research.principles].reverse(),
  getConstraints: () => [...research.constraints].reverse()
});

function adapter({ memory = null, researchProvider = null } = {}) {
  return createCreativeIntelligenceContextAdapter({
    getDocument: () => document,
    getSelectedObjectIds: () => ['path-a'],
    creativeMemoryProvider: memory,
    researchCreationProvider: researchProvider
  });
}

const plain = adapter().read();
assert.equal('creativeMemory' in plain.modules, false);
assert.equal('researchCreation' in plain.modules, false);

const memoryOnly = adapter({ memory: memoryProviderA }).read();
assert.equal(memoryOnly.modules.creativeMemory.status, 'AVAILABLE');
assert.equal(memoryOnly.modules.creativeMemory.authority.execution, false);
assert.equal(memoryOnly.modules.creativeMemory.fingerprint, memoryOnly.modules.creativeMemory.context.contextFingerprint);
assert.equal('researchCreation' in memoryOnly.modules, false);

const researchOnly = adapter({ researchProvider: researchProviderA }).read();
assert.equal(researchOnly.modules.researchCreation.status, 'AVAILABLE');
assert.equal(researchOnly.modules.researchCreation.authority.researchSourceAuthority, 'EVIDENCE_ONLY');
assert.equal(researchOnly.modules.researchCreation.authority.creativeMemoryAutoWrite, false);
assert.equal('creativeMemory' in researchOnly.modules, false);

const bothA = adapter({ memory: memoryProviderA, researchProvider: researchProviderA });
const bothB = adapter({ memory: memoryProviderB, researchProvider: researchProviderB });
const combinedA = bothA.read();
const combinedB = bothB.read();
assert.equal(combinedA.contextFingerprint, combinedB.contextFingerprint, 'equivalent advisory inputs must produce the same root fingerprint');
assert.deepEqual(combinedA.modules.creativeMemory.context.selectedRecords, combinedB.modules.creativeMemory.context.selectedRecords);
assert.deepEqual(combinedA.modules.researchCreation.context.derivedPrinciples, combinedB.modules.researchCreation.context.derivedPrinciples);
assert.notEqual(combinedA.contextFingerprint, plain.contextFingerprint, 'advisory sections must participate in root fingerprinting');
assert.ok(combinedA.modules.creativeMemory.context.unresolvedEvidence.some(item => item.code === 'SOURCE_PENDING'));

const bounded = bothA.read({ creativeMemoryOptions: { maxRecords: 1, maxBytes: 32 * 1024 } });
assert.equal(bounded.modules.creativeMemory.context.selectedRecords.length, 1);
assert.equal(bounded.modules.creativeMemory.context.bounds.truncatedByCount, true);
assert.ok(bounded.bounds.outputBytes <= bounded.bounds.limits.maxBytes);

const failedProvider = createCreativeIntelligenceContextAdapter({
  getDocument: () => document,
  creativeMemoryProvider: { readAdvisoryContext() { throw Object.assign(new Error('blocked'), { code: 'FIXTURE_PROVIDER_BLOCKED' }); } }
}).read();
assert.equal('creativeMemory' in failedProvider.modules, false);
assert.ok(failedProvider.unresolved.some(item => item.module === 'creative-memory' && item.code === 'FIXTURE_PROVIDER_BLOCKED'));

for (const name of ['get_creative_memory_context', 'get_research_creation_context']) {
  assert.ok(GROUNDED_TOOL_NAMES.includes(name));
  assert.ok(toolDefinitions().some(item => item.function.name === name));
}
for (const forbidden of ['write_creative_memory', 'add_creative_memory', 'replace_creative_memory', 'fetch_research_source', 'scrape_research_source']) {
  assert.equal(GROUNDED_TOOL_NAMES.includes(forbidden), false);
  assert.equal(toolDefinitions().some(item => item.function.name === forbidden), false);
}
assert.equal(GROUNDED_CONTINUATION_MAX, 1);

{
  const audit = auditBridge();
  const router = new ToolCallRouter({ layer: layerFor(app), auditBridge: audit, groundedContextProvider: bothA });
  const beforeDocument = JSON.stringify(app.doc);
  const beforeHistory = JSON.stringify(app.history);
  const beforeRevisions = JSON.stringify(app.revisions.records);

  const memory = await router.route(call('memory-read-1', 'get_creative_memory_context', {
    query: { tags: ['hierarchy'] },
    options: { maxRecords: 2, maxBytes: 24 * 1024 }
  }), { permission: 'OBSERVE' });
  assert.equal(memory.result.authority.role, 'ADVISORY_READ_ONLY');
  assert.ok(memory.result.selectedRecords.length <= 2);

  const researchResult = await router.route(call('research-read-1', 'get_research_creation_context', {
    selection: { principleIds: [research.principles[0].principleId] },
    options: { maxPrinciples: 1, maxBytes: 32 * 1024 }
  }), { permission: 'OBSERVE' });
  assert.equal(researchResult.result.authority.researchSourceAuthority, 'EVIDENCE_ONLY');
  assert.equal(researchResult.result.authority.networkRequired, false);
  assert.equal(researchResult.result.creativeMemory.requested, false);

  assert.equal(JSON.stringify(app.doc), beforeDocument);
  assert.equal(JSON.stringify(app.history), beforeHistory);
  assert.equal(JSON.stringify(app.revisions.records), beforeRevisions);
}

{
  const missing = adapter();
  const router = new ToolCallRouter({ layer: layerFor(app), auditBridge: auditBridge(), groundedContextProvider: missing });
  const memory = await router.route(call('memory-missing', 'get_creative_memory_context'), { permission: 'OBSERVE' });
  const researchResult = await router.route(call('research-missing', 'get_research_creation_context'), { permission: 'OBSERVE' });
  assert.equal(memory.result.status, 'UNAVAILABLE');
  assert.equal(researchResult.result.status, 'UNAVAILABLE');
}

{
  const grounded = combinedA;
  const client = new SequenceClient([
    {
      content: '',
      toolCalls: [
        call('memory-continuation', 'get_creative_memory_context', { query: { tags: ['hierarchy'] } }),
        call('memory-write-intent', 'write_creative_memory', { record: { unsafe: true } }),
        call('research-fetch-intent', 'fetch_research_source', { url: 'https://invalid.example/' })
      ]
    },
    request => {
      assert.equal(request.metadata.groundedContinuation.round, 1);
      assert.equal(request.metadata.groundedContinuation.maxRounds, 1);
      assert.equal(request.metadata.groundedContinuation.toolResults[0].name, 'get_creative_memory_context');
      return { content: 'Advisory evidence considered; no edit proposed.', source: 'DETERMINISTIC_TEST' };
    }
  ]);
  const layer = layerFor(app);
  const manager = new ChatSessionManager({
    layer,
    contextBuilder: {
      build: () => ({
        format: 'INK-CHAT-CONTEXT',
        version: '1.6.0',
        level: 'DOCUMENT_SUMMARY',
        hash: 'fnv1a32:integration-005-context',
        payload: { groundedCreativeIntelligence: grounded }
      })
    },
    validator: { async repair(raw) { return { plan: JSON.parse(raw), attempts: 0 }; } },
    toolRouter: new ToolCallRouter({ layer, auditBridge: auditBridge(), groundedContextProvider: bothA }),
    auditBridge: auditBridge(),
    credentialStore: { clearAll() {} }
  });
  manager.register('sequence', client);
  const session = manager.start({ client: 'sequence' });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Use advisory context only.', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(client.requests.length, 2);
  assert.equal(response.continuation.maxRounds, 1);
  assert.equal(response.continuation.status, 'COMPLETED');
  assert.equal(response.planProposal, null);
  assert.equal(response.toolResults.find(item => item.toolCallId === 'memory-write-intent').status, 'NOT_AUTO_ROUTED');
  assert.equal(response.toolResults.find(item => item.toolCallId === 'research-fetch-intent').status, 'NOT_AUTO_ROUTED');
}

{
  const planApp = makeApp();
  const layer = layerFor(planApp);
  const groundedProvider = createCreativeIntelligenceContextAdapter({
    getDocument: () => planApp.doc,
    getSelectedObjectIds: () => ['path-a'],
    creativeMemoryProvider: memoryProviderA,
    researchCreationProvider: researchProviderA
  });
  const grounded = groundedProvider.read();
  const targetFound = findPageObject(planApp.page(), 'path-a');
  const target = { pageId: planApp.page().id, layerId: targetFound.layer.id, objectId: 'path-a' };
  const source = chatCreativePlanSource(planApp);
  const beforeDocument = JSON.stringify(planApp.doc);
  const beforeHistory = JSON.stringify(planApp.history);
  const beforeRevisions = JSON.stringify(planApp.revisions.records);

  const client = new SequenceClient([
    { content: '', toolCalls: [call('memory-plan-evidence', 'get_creative_memory_context', { query: { tags: ['hierarchy'] } })] },
    () => ({
      content: JSON.stringify({
        schema: 'INK-GROUNDED-CREATIVE-DECISION',
        version: 1,
        decisionType: 'PLAN_PROPOSAL',
        sourceRequest: { requestId: 'placeholder', sessionId: 'placeholder' },
        groundedContextFingerprint: grounded.contextFingerprint,
        toolEvidence: [{ toolCallId: 'memory-plan-evidence', tool: 'get_creative_memory_context' }],
        targets: [target],
        rationale: 'Creative Memory supports a bounded repaint proposal.',
        assumptions: ['User approval remains required.'],
        planCandidate: {
          schema: 'INK-CHAT-CREATIVE-PLAN',
          version: 1,
          source,
          intentSummary: 'Bounded advisory-assisted repaint',
          steps: [{
            stepId: 'repaint-a',
            operation: 'path.repaint.v1',
            targets: [target],
            arguments: { fill: '#b63c36' },
            dependsOn: []
          }]
        },
        unresolvedEvidence: [],
        unsupportedEvidence: []
      }),
      source: 'DETERMINISTIC_TEST'
    })
  ]);

  const contextBuilder = {
    build: () => ({
      format: 'INK-CHAT-CONTEXT',
      version: '1.6.0',
      level: 'DOCUMENT_SUMMARY',
      hash: 'fnv1a32:integration-005-plan-context',
      payload: { groundedCreativeIntelligence: grounded }
    })
  };
  const audit = auditBridge();
  const manager = new ChatSessionManager({
    layer,
    contextBuilder,
    validator: { async repair(raw) { return { plan: JSON.parse(raw), attempts: 0 }; } },
    toolRouter: new ToolCallRouter({ layer, auditBridge: audit, groundedContextProvider: groundedProvider }),
    auditBridge: audit,
    credentialStore: { clearAll() {} }
  });
  manager.register('sequence', client);
  const session = manager.start({ client: 'sequence' });

  const originalCreateMessage = client.createMessage.bind(client);
  client.createMessage = async request => {
    const result = await originalCreateMessage(request);
    if (client.requests.length === 2 && typeof result.content === 'string' && result.content.startsWith('{')) {
      const value = JSON.parse(result.content);
      value.sourceRequest = {
        requestId: request.metadata.groundedContinuation.originalRequestId,
        sessionId: request.metadata.groundedContinuation.sessionId
      };
      result.content = JSON.stringify(value);
    }
    return result;
  };

  const response = await manager.requestConversation(session.sessionId, { prompt: 'Propose one grounded repaint.', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(response.planProposal.status, 'PROPOSED');
  assert.equal(response.planProposal.proposal.approved, false);
  assert.equal(response.planProposal.proposal.approvalToken, null);
  assert.equal(response.groundedDecision.toolEvidence[0].tool, 'get_creative_memory_context');
  assert.equal(planApp.chatCreativePlan.approvalSequence, 0);
  assert.deepEqual(planApp.counters, { approve: 0, execute: 0, revisionCapture: 0 });
  assert.equal(JSON.stringify(planApp.doc), beforeDocument);
  assert.equal(JSON.stringify(planApp.history), beforeHistory);
  assert.equal(JSON.stringify(planApp.revisions.records), beforeRevisions);
}

{
  const client = new SequenceClient([{ content: 'Discussion only.', source: 'DETERMINISTIC_TEST' }]);
  const layer = layerFor(app);
  const manager = new ChatSessionManager({
    layer,
    contextBuilder: {
      build: () => ({
        format: 'INK-CHAT-CONTEXT',
        version: '1.6.0',
        level: 'DOCUMENT_SUMMARY',
        hash: 'fnv1a32:discussion',
        payload: { groundedCreativeIntelligence: combinedA }
      })
    },
    validator: {},
    toolRouter: new ToolCallRouter({ layer, auditBridge: auditBridge(), groundedContextProvider: bothA }),
    auditBridge: auditBridge(),
    credentialStore: { clearAll() {} }
  });
  manager.register('sequence', client);
  const session = manager.start({ client: 'sequence' });
  const response = await manager.requestConversation(session.sessionId, { prompt: 'Discuss only.', transmissionDecision: 'LOCAL_ONLY' });
  assert.equal(response.planProposal, null);
  assert.equal(response.groundedDecision, null);
  assert.equal(response.continuation, null);
}

{
  const source = readFileSync(new URL('../product/source/src/ai/chat-runtime.js', import.meta.url), 'utf8');
  const start = source.indexOf("case 'get_grounded_creative_context':");
  const end = source.indexOf("case 'create_plan':", start);
  assert.ok(start >= 0 && end > start);
  const groundedCases = source.slice(start, end);
  for (const forbidden of ['putCreativeMemoryRecord', 'addCreativeMemoryRecord', 'replaceCreativeMemoryRecord', 'createCreativeMemoryCandidate', 'executeApproval(', '.approve(', '.rollback(', 'fetch(', 'XMLHttpRequest', 'WebSocket']) {
    assert.equal(groundedCases.includes(forbidden), false, `grounded advisory router must not use ${forbidden}`);
  }
}

assert.equal(CREATIVE_INTELLIGENCE_FORMAT_VERSION, 4);
assert.equal(FORMAT_VERSION, 4);

console.log('INK-CORE-INTEGRATION-005 creative intelligence memory/research integration deterministic/source tests: PASS');
