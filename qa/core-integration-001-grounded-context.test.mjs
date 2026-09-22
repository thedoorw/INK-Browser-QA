import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CREATIVE_INTELLIGENCE_CONTEXT_SCHEMA,
  CREATIVE_INTELLIGENCE_FORMAT_VERSION,
  CreativeIntelligenceContextError,
  buildCreativeIntelligenceContext,
  createCreativeIntelligenceContextAdapter
} from '../product/source/src/ai/creative-intelligence-context.js';
import { ContextBuilder } from '../product/source/src/ai/chat-runtime.js';

const clone = value => JSON.parse(JSON.stringify(value));

function rectangle(id, x, y, role, sourceId) {
  return {
    id,
    type: 'path',
    name: id,
    matrix: [1, 0, 0, 1, 0, 0],
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
    subpaths: [{
      id: `${id}:sub`,
      role: 'outer',
      closed: true,
      anchors: [
        { id: `${id}:a0`, x, y },
        { id: `${id}:a1`, x: x + 20, y },
        { id: `${id}:a2`, x: x + 20, y: y + 20 },
        { id: `${id}:a3`, x, y: y + 20 }
      ]
    }],
    semantic: { role, confidence: 1 },
    metadata: { source: { type: 'reference', id: sourceId } }
  };
}

function fixture() {
  return {
    format: 'INK',
    formatVersion: 4,
    appVersion: '0.1',
    id: 'document:integration',
    title: 'Grounded integration fixture',
    activePageId: 'page:1',
    pages: [{
      id: 'page:1',
      name: 'Page 1',
      activeLayerId: 'layer:1',
      layers: [{
        id: 'layer:1',
        name: 'Layer 1',
        visible: true,
        locked: false,
        opacity: 1,
        objects: [
          rectangle('path:a', 0, 0, 'petal', 'asset:a'),
          rectangle('path:b', 30, 0, 'center', 'asset:b')
        ]
      }]
    }]
  };
}

function evidence() {
  return {
    selectedObjectIds: ['path:b', 'path:a'],
    revisionId: 'revision:current',
    relationshipEvidence: [
      { fromObjectId: 'path:a', relation: 'adjacent', toObjectId: 'path:b', supported: true, evidenceRef: 'evidence:1' },
      { fromObjectId: 'path:b', relation: 'bridge', toObjectId: 'missing:path', status: 'UNRESOLVED', reason: 'fixture-unresolved' }
    ],
    historyEntries: [
      { evidenceId: 'history:1', label: 'Move A', objectIds: ['path:a'], patchCount: 1, storedBytes: 64 },
      { evidenceId: 'history:2', label: 'Move B', objectIds: ['path:b'], patchCount: 1, storedBytes: 64 }
    ]
  };
}

function minimalStructure() {
  return {
    schema: 'INK-PARAMETRIC-STRUCTURE',
    version: 1,
    structureId: 'structure:fixture',
    label: 'Fixture',
    seed: 7,
    parameters: [],
    values: {},
    nodes: [{
      key: 'node',
      role: 'shape',
      source: { objectId: 'path:a' },
      transform: [1, 0, 0, 1, 0, 0]
    }],
    relationships: []
  };
}

function comparison() {
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

function build(extra = {}, options = {}) {
  return buildCreativeIntelligenceContext({
    document: fixture(),
    ...evidence(),
    ...extra
  }, options);
}

{
  const one = build();
  const two = build();
  assert.deepEqual(one, two, 'same document/evidence must produce identical integrated context');
  assert.equal(one.contextFingerprint, two.contextFingerprint);
  assert.equal(one.schema, CREATIVE_INTELLIGENCE_CONTEXT_SCHEMA);
  assert.equal(one.formatVersion, 4);
  assert.equal(CREATIVE_INTELLIGENCE_FORMAT_VERSION, 4);
  assert.equal(one.identity.documentId, 'document:integration');
  assert.equal(one.identity.revisionId, 'revision:current');
  assert.deepEqual(one.modules.documentBridge.context.selection.objectIds, ['path:a', 'path:b']);
  assert.equal(one.modules.semanticRegions.status, 'AVAILABLE');
  assert.ok(one.modules.semanticRegions.context.semanticRegions.some(region => region.ref.objectId === 'path:a'));
  assert.ok(one.modules.provenance.fingerprint);
  assert.ok(one.modules.provenance.context.events.some(event => event.kind === 'object-source'));
  assert.equal(one.modules.visualCompare.status, 'NOT_REQUESTED');
  assert.equal(one.modules.parametricStructure.status, 'NOT_REQUESTED');
  assert.ok(one.unresolved.some(item => item.module === 'semantic-regions'));
  assert.ok(one.bounds.outputBytes <= one.bounds.limits.maxBytes);
}

{
  const reordered = evidence();
  reordered.selectedObjectIds.reverse();
  reordered.relationshipEvidence.reverse();
  reordered.historyEntries.reverse();
  const one = build();
  const two = build(reordered);
  assert.deepEqual(one, two, 'reordered equivalent evidence must normalize identically');
  assert.equal(one.contextFingerprint, two.contextFingerprint);
}

{
  const withComparison = build({ comparison: comparison() });
  assert.equal(withComparison.modules.visualCompare.status, 'AVAILABLE');
  assert.ok(withComparison.modules.visualCompare.fingerprint);
  assert.equal(withComparison.modules.parametricStructure.status, 'NOT_REQUESTED');

  const withStructure = build({ parametricDescriptor: minimalStructure() });
  assert.equal(withStructure.modules.parametricStructure.status, 'AVAILABLE');
  assert.ok(withStructure.modules.parametricStructure.fingerprint);
  assert.equal(withStructure.modules.visualCompare.status, 'NOT_REQUESTED');
  assert.equal(withStructure.modules.parametricStructure.evidence.authority.documentWrite, false);
  assert.equal(withStructure.modules.parametricStructure.evidence.authority.historyWrite, false);
  assert.equal(withStructure.modules.parametricStructure.evidence.authority.revisionWrite, false);
  assert.equal(withStructure.modules.parametricStructure.evidence.authority.renderer, false);
}

{
  const projected = build({}, { allowedObjectIds: ['path:a'] });
  const serialized = JSON.stringify(projected);
  assert.equal(projected.transmission.objectProjectionApplied, true);
  assert.deepEqual(projected.modules.documentBridge.context.objects.map(item => item.ref.objectId), ['path:a']);
  assert.deepEqual(projected.modules.documentBridge.context.selection.objectIds, ['path:a']);
  assert.ok(projected.modules.semanticRegions.context.semanticRegions.every(region => region.ref.objectId === 'path:a'));
  assert.equal(serialized.includes('"path:b"'), false, 'projection must not transmit filtered object IDs');
}

{
  const document = fixture();
  const before = JSON.stringify(document);
  let documentReads = 0;
  let selectionReads = 0;
  let revisionReads = 0;
  const adapter = createCreativeIntelligenceContextAdapter({
    getDocument: () => { documentReads += 1; return document; },
    getSelectedObjectIds: () => { selectionReads += 1; return ['path:a']; },
    getRevisionId: () => { revisionReads += 1; return 'revision:adapter'; },
    getHistoryEntries: () => [{ label: 'Adapter history', objectIds: ['path:a'], patchCount: 1, storedBytes: 32 }]
  });
  const result = adapter.read({ allowedObjectIds: ['path:a'] });
  assert.equal(result.identity.revisionId, 'revision:adapter');
  assert.equal(JSON.stringify(document), before, 'providers/document must not mutate');
  assert.equal(documentReads, 1);
  assert.equal(selectionReads, 1);
  assert.equal(revisionReads, 1);
}

{
  const bad = fixture();
  bad.formatVersion = 5;
  assert.throws(
    () => buildCreativeIntelligenceContext({ document: bad }),
    error => error instanceof CreativeIntelligenceContextError
      && error.code === 'CREATIVE_INTELLIGENCE_CONTEXT_FORMAT_VERSION_UNSUPPORTED'
  );
}

{
  const state = {
    documentSummary: { id: 'document:integration', title: 'Fixture' },
    layerTree: [],
    selection: [],
    semanticRegions: [],
    palette: [],
    historySummary: { entries: [] },
    objectIndex: [{ objectId: 'path:a' }],
    strokeIndex: [{ strokeId: 'stroke:a' }],
    regionIndex: [],
    documentHash: 'document-hash'
  };
  const capabilityProvider = { get: () => ({ format: 'INK-CAPABILITY-MANIFEST', version: 1, operations: [] }) };
  const documentStateProvider = { get: () => clone(state) };
  let groundedReads = 0;
  const groundedContextProvider = {
    read: options => {
      groundedReads += 1;
      assert.deepEqual(options.allowedObjectIds, ['path:a', 'stroke:a']);
      return {
        schema: CREATIVE_INTELLIGENCE_CONTEXT_SCHEMA,
        version: 1,
        contextFingerprint: 'fnv1a32:grounded',
        authority: { role: 'ADVISORY_READ_ONLY_CONTEXT' }
      };
    }
  };

  const builder = new ContextBuilder({ capabilityProvider, documentStateProvider, groundedContextProvider });
  const enabled = builder.build({ tokenBudget: 16000 });
  assert.equal(enabled.payload.groundedCreativeIntelligence.contextFingerprint, 'fnv1a32:grounded');
  assert.equal(groundedReads, 1);

  const disabled = builder.build({ tokenBudget: 16000, groundedContext: false });
  assert.equal('groundedCreativeIntelligence' in disabled.payload, false);
  assert.equal(groundedReads, 1);

  const fallback = new ContextBuilder({
    capabilityProvider,
    documentStateProvider,
    groundedContextProvider: { read: () => { throw Object.assign(new Error('unavailable'), { code: 'FIXTURE_UNAVAILABLE' }); } }
  }).build({ tokenBudget: 16000 });
  assert.equal('groundedCreativeIntelligence' in fallback.payload, false);
  assert.ok(fallback.payload.documentSummary);
}

{
  const integrationSource = readFileSync(new URL('../product/source/src/ai/creative-intelligence-context.js', import.meta.url), 'utf8');
  for (const forbidden of [
    '.restore(',
    '.execute(',
    '.apply(',
    '.commit(',
    'history.push',
    'replaceDocument(',
    'document.querySelector',
    'window.',
    'fetch(',
    'XMLHttpRequest',
    'renderExportCanvas('
  ]) {
    assert.equal(integrationSource.includes(forbidden), false, `integration source must not use ${forbidden}`);
  }
}

console.log('INK-CORE-INTEGRATION-001 grounded context deterministic/source tests: PASS');
