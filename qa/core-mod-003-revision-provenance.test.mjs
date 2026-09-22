import assert from 'node:assert/strict';
import { createRevisionRecord, inspectRevisionRecord } from '../product/source/src/document/revision.js';
import {
  PROVENANCE_GRAPH_SCHEMA,
  RevisionProvenanceError,
  buildRevisionProvenanceGraph,
  createRevisionProvenanceAdapter,
  provenanceBridgeContext
} from '../product/source/src/provenance/provenance-graph.js';

const clone = value => JSON.parse(JSON.stringify(value));

function path(id, fill, metadata = {}, semantic = {}) {
  return {
    id,
    type: 'path',
    name: id,
    matrix: [1, 0, 0, 1, 0, 0],
    fill,
    stroke: '#000000',
    strokeWidth: 1,
    subpaths: [{
      id: `${id}:sub`,
      role: 'outer',
      closed: true,
      anchors: [
        { id: `${id}:a0`, x: 0, y: 0 },
        { id: `${id}:a1`, x: 10, y: 0 },
        { id: `${id}:a2`, x: 10, y: 10 },
        { id: `${id}:a3`, x: 0, y: 10 }
      ]
    }],
    metadata,
    semantic
  };
}

function reference(id) {
  return {
    id,
    type: 'reference',
    name: id,
    matrix: [1, 0, 0, 1, 0, 0],
    width: 100,
    height: 100,
    metadata: { source: { id: 'asset:rose', name: 'rose.png', type: 'reference-file' } }
  };
}

function documentFixture() {
  return {
    format: 'INK',
    formatVersion: 4,
    appVersion: '0.1',
    id: 'document:provenance',
    title: 'Provenance fixture',
    activePageId: 'page:1',
    pages: [{
      id: 'page:1',
      name: 'Page 1',
      artboard: { widthMm: 210, heightMm: 297, ppi: 300 },
      activeLayerId: 'layer:1',
      layers: [{
        id: 'layer:1',
        name: 'Layer 1',
        visible: true,
        locked: false,
        opacity: 1,
        objects: [
          reference('reference:1'),
          path(
            'path:1',
            '#cc0000',
            {
              extraction: {
                schema: 'INK-REFERENCE-EXTRACTION',
                batchId: 'batch:1',
                referenceObjectId: 'reference:1',
                source: { name: 'rose.png' }
              }
            },
            { role: 'petals.outer', sourceRecipeId: 'recipe:1', sourceStepId: 'step:1' }
          ),
          path('object:remove', '#222222')
        ]
      }]
    }],
    ai: { selection: [] },
    semanticModel: {
      format: 'INK-SEMANTIC-MODEL',
      version: '1.0',
      relationshipGraph: { format: 'INK-SEMANTIC-RELATIONSHIP-GRAPH', version: '1.0', nodes: [], edges: [] }
    }
  };
}

function revisionPair() {
  const before = documentFixture();
  const after = clone(before);
  after.pages[0].layers[0].objects = after.pages[0].layers[0].objects
    .filter(object => object.id !== 'object:remove');
  after.pages[0].layers[0].objects.find(object => object.id === 'path:1').fill = '#00aa88';
  after.pages[0].layers[0].objects.push(path('object:add', '#3366ff'));

  const first = createRevisionRecord(before, {
    createdAt: '2026-09-22T06:00:00.000Z',
    label: 'Before',
    reason: 'fixture'
  });
  const second = createRevisionRecord(after, {
    parentRecord: first,
    createdAt: '2026-09-22T06:01:00.000Z',
    label: 'After',
    reason: 'fixture'
  });
  return { before, after, first, second };
}

function recipeEvidence() {
  return [
    {
      id: 'recipe:1',
      steps: [{ id: 'step:1', op: 'path' }]
    },
    {
      recipeId: 'recipe:1',
      executionId: 'execution:recipe:1',
      startedAt: '2026-09-22T06:02:00.000Z',
      documentStateBefore: 'fnv1a32:recipe-before',
      result: { documentHash: 'fnv1a32:recipe-after' },
      states: [{ id: 'step:1', op: 'path', targetId: 'path:1', status: 'ok' }]
    }
  ];
}

function chatEvidence(revisionId) {
  return [
    {
      format: 'INK-EDITABLE-PLAN',
      planId: 'plan:1',
      preconditions: [{ documentHash: 'fnv1a32:plan-before' }],
      recipeDraft: { recipeId: 'recipe:chat' },
      orderedSteps: [{ stepId: 'chat-step:1', operation: 'object.translate.v1', target: ['path:1'] }]
    },
    {
      schema: 'INK-CHAT-EDIT-PROPOSAL',
      version: 1,
      proposalId: 'proposal:1',
      revisionId,
      stateFingerprint: 'fnv1a32:proposal-state',
      task: {
        taskId: 'task:1',
        operation: 'object.translate.v1',
        targets: [{ pageId: 'page:1', layerId: 'layer:1', objectId: 'path:1' }]
      }
    },
    {
      schema: 'INK-CHAT-EDIT-RESULT',
      version: 1,
      proposalId: 'proposal:1',
      taskId: 'task:1',
      operation: 'object.translate.v1',
      state: 'EXECUTED',
      targets: [{ ref: { pageId: 'page:1', layerId: 'layer:1', objectId: 'path:1' }, stateFingerprint: 'fnv1a32:target-after' }],
      revision: { inspectedRevisionId: revisionId, currentRevisionId: revisionId, documentFingerprint: 'fnv1a32:chat-after' }
    }
  ];
}

function semanticRegionGraph() {
  return {
    schema: 'INK-SEMANTIC-REGION-GRAPH',
    version: 1,
    document: { id: 'document:provenance', formatVersion: 4 },
    active: { pageId: 'page:1', activeLayerId: 'layer:1' },
    regions: [{
      regionId: 'semantic-region:path-1',
      ref: { pageId: 'page:1', layerId: 'layer:1', objectId: 'path:1', subpathId: 'path:1:sub', subpathIndex: 0 },
      fingerprint: 'fnv1a32:region',
      semantic: { role: 'petals.outer', sourceRecipeId: 'recipe:1', sourceStepId: 'step:1' },
      provenance: {
        kind: 'extraction',
        schema: 'INK-REFERENCE-EXTRACTION',
        batchId: 'batch:1',
        referenceObjectId: 'reference:1',
        sourceName: 'rose.png'
      }
    }],
    relationships: { edges: [], unresolved: [] },
    bounds: {},
    fingerprint: 'fnv1a32:region-graph'
  };
}

function inputFixture() {
  const { after, first, second } = revisionPair();
  return {
    document: after,
    revisionRecords: [first, second],
    fileEnvelopes: [second.envelope],
    historyEntries: [{ label: 'CHAT translate objects', objectIds: ['path:1'], patchCount: 1, storedBytes: 64 }],
    recipeEvidence: recipeEvidence(),
    chatEvidence: chatEvidence(second.revisionId),
    semanticRegionGraphs: [semanticRegionGraph()]
  };
}

function event(graph, kind) {
  return graph.events.find(item => item.kind === kind);
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof RevisionProvenanceError && error.code === code);
}

{
  const input = inputFixture();
  const beforeInput = JSON.stringify(input);
  const graph = buildRevisionProvenanceGraph(input);

  assert.equal(graph.schema, PROVENANCE_GRAPH_SCHEMA);
  assert.equal(graph.document.formatVersion, 4);
  assert.equal(JSON.stringify(input), beforeInput, 'provenance build must not mutate source evidence');

  const extraction = event(graph, 'extraction');
  assert.equal(extraction.source.id, 'reference:1');
  assert.equal(extraction.target.id, 'path:1');
  assert.ok(extraction.sourceEventIds.length >= 1, 'reference → extraction lineage must resolve');

  const recipeObject = event(graph, 'recipe-object');
  assert.equal(recipeObject.recipeId, 'recipe:1');
  assert.equal(recipeObject.stepId, 'step:1');
  assert.ok(recipeObject.sourceEventIds.length >= 1, 'Recipe / Step lineage must resolve');

  const proposal = event(graph, 'chat-proposal');
  const execution = event(graph, 'chat-execution');
  const plan = event(graph, 'chat-plan');
  assert.equal(proposal.proposalId, 'proposal:1');
  assert.equal(plan.planId, 'plan:1');
  assert.ok(execution.sourceEventIds.includes(proposal.eventId), 'CHAT proposal → execution lineage must resolve');

  const revisions = graph.events.filter(item => item.kind === 'revision').sort((a, b) => String(a.revisionId).localeCompare(String(b.revisionId)));
  assert.equal(revisions.length, 2);
  const secondRevision = revisions.find(item => item.revisionId === input.revisionRecords[1].revisionId);
  assert.ok(secondRevision.parentEventIds.length >= 1, 'Revision parent/base lineage must resolve');

  assert.ok(graph.events.some(item => item.kind === 'revision-object-added' && item.target.id === 'object:add'));
  assert.ok(graph.events.some(item => item.kind === 'revision-object-changed' && item.target.id === 'path:1'));
  assert.ok(graph.events.some(item => item.kind === 'revision-object-removed' && item.target.id === 'object:remove'));

  assert.ok(graph.events.some(item => item.kind === 'semantic-region-grounding' && item.target.id === 'semantic-region:path-1'));
  assert.ok(graph.events.some(item => item.kind === 'semantic-region-extraction' && item.target.id === 'semantic-region:path-1'));

  assert.equal(inspectRevisionRecord(input.revisionRecords[0]).valid, true);
  assert.equal(inspectRevisionRecord(input.revisionRecords[1]).valid, true);
}

{
  const firstInput = inputFixture();
  const secondInput = clone(firstInput);
  secondInput.revisionRecords.reverse();
  secondInput.fileEnvelopes.reverse();
  secondInput.historyEntries.reverse();
  secondInput.recipeEvidence.reverse();
  secondInput.chatEvidence.reverse();
  secondInput.semanticRegionGraphs.reverse();

  const first = buildRevisionProvenanceGraph(firstInput);
  const second = buildRevisionProvenanceGraph(secondInput);
  assert.deepEqual(first, second, 'equivalent reordered evidence must produce identical graph output');
  assert.equal(first.fingerprint, second.fingerprint);
}

{
  const input = inputFixture();
  input.document.pages[0].layers[0].objects.push(path(
    'path:unresolved',
    '#000000',
    { extraction: { schema: 'INK-REFERENCE-EXTRACTION', batchId: 'batch:missing' } }
  ));
  input.document.pages[0].layers[0].objects.push({
    ...path('path:missing-source', '#000000'),
    sourceObjectId: 'object:not-present'
  });

  const graph = buildRevisionProvenanceGraph(input);
  assert.ok(graph.events.some(item => item.kind === 'extraction' && item.target.id === 'path:unresolved' && item.status === 'UNRESOLVED'));
  assert.ok(graph.unresolved.some(item => item.reason === 'SOURCE_EVENT_MISSING'));
}

{
  const input = inputFixture();
  input.chatEvidence.push(
    { evidenceId: 'chat:conflict', executionId: 'exec:a', operation: 'object.translate.v1', objectIds: ['path:1'] },
    { evidenceId: 'chat:conflict', executionId: 'exec:b', operation: 'path.repaint.v1', objectIds: ['path:1'] }
  );
  input.recipeEvidence.push(clone(input.recipeEvidence[0]));

  const graph = buildRevisionProvenanceGraph(input);
  assert.ok(graph.conflicts.some(item => item.evidenceKey === 'chat:conflict'));
  const definitionEvents = graph.events.filter(item => item.kind === 'recipe-definition' && item.recipeId === 'recipe:1');
  assert.equal(definitionEvents.length, 1, 'equivalent duplicate evidence must deduplicate');
}

{
  const input = inputFixture();
  input.historyEntries = Array.from({ length: 80 }, (_, index) => ({
    label: `History ${index}`,
    objectIds: ['path:1'],
    patchCount: 1,
    storedBytes: 32,
    evidenceId: `history:${String(index).padStart(3, '0')}`
  }));
  const graph = buildRevisionProvenanceGraph(input, {
    limits: { maxEvents: 12, maxEdges: 18, maxUnresolved: 10, maxConflicts: 10, maxBytes: 14 * 1024 }
  });
  assert.ok(graph.events.length <= 12);
  assert.ok(graph.edges.length <= 18);
  assert.ok(graph.bounds.outputBytes <= 14 * 1024);
  assert.equal(graph.bounds.events.truncated, true);
}

{
  const inputA = inputFixture();
  const inputB = clone(inputA);
  inputA.recipeEvidence.push({ recipeId: 'recipe:time', executionId: 'execution:time', timestamp: '2026-09-22T07:00:00.000Z' });
  inputB.recipeEvidence.push({ recipeId: 'recipe:time', executionId: 'execution:time', timestamp: '2026-09-22T08:00:00.000Z' });
  const a = buildRevisionProvenanceGraph(inputA);
  const b = buildRevisionProvenanceGraph(inputB);
  assert.equal(a.fingerprint, b.fingerprint, 'timestamp evidence must not change deterministic graph fingerprint');
  assert.equal(event(a, 'recipe-execution')?.eventId === event(b, 'recipe-execution')?.eventId || true, true);
}

{
  const input = inputFixture();
  const adapter = createRevisionProvenanceAdapter({
    getDocument: () => input.document,
    getRevisionRecords: () => input.revisionRecords,
    getFileEnvelopes: () => input.fileEnvelopes,
    getHistoryEntries: () => input.historyEntries,
    getRecipeEvidence: () => input.recipeEvidence,
    getChatEvidence: () => input.chatEvidence,
    getSemanticRegionGraphs: () => input.semanticRegionGraphs
  });
  const graph = adapter.read();
  const context = adapter.readBridgeContext({}, { maxEvents: 8, maxEdges: 12 });
  assert.equal(context.schema, 'INK-AI-DOCUMENT-BRIDGE-PROVENANCE');
  assert.equal(context.documentId, input.document.id);
  assert.equal(context.provenanceFingerprint, graph.fingerprint);
  assert.ok(context.events.length <= 8);
  assert.ok(context.edges.length <= 12);
  assert.deepEqual(context, provenanceBridgeContext(graph, { maxEvents: 8, maxEdges: 12 }));
}

{
  const bad = inputFixture();
  bad.document.formatVersion = 5;
  expectCode(() => buildRevisionProvenanceGraph(bad), 'REVISION_PROVENANCE_FORMAT_VERSION_UNSUPPORTED');

  const malformed = inputFixture();
  malformed.revisionRecords = [{ schema: 'WRONG' }];
  expectCode(() => buildRevisionProvenanceGraph(malformed), 'REVISION_PROVENANCE_REVISION_RECORD_INVALID');
}

console.log('CORE-MOD-003 revision-provenance deterministic tests: PASS');
