import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  CREATIVE_MEMORY_ADVISORY_SCHEMA,
  CREATIVE_MEMORY_CATEGORIES,
  CREATIVE_MEMORY_COLLECTION_SCHEMA,
  CREATIVE_MEMORY_FORMAT_VERSION,
  CreativeMemoryError,
  addCreativeMemoryRecord,
  bindCreativeMemoryEvidence,
  buildCreativeMemoryAdvisoryContext,
  compareCreativeMemoryRecords,
  createCreativeMemoryAdapter,
  createCreativeMemoryCollection,
  normalizeCreativeMemoryRecord,
  queryCreativeMemory,
  replaceCreativeMemoryRecord,
  serializeCreativeMemoryCollection,
  validateCreativeMemoryRecord
} from '../product/source/src/memory/creative-memory.js';

const clone = value => JSON.parse(JSON.stringify(value));

function memory(overrides = {}) {
  return {
    scope: { projectId: 'project:flora', documentId: 'document:1' },
    category: 'COMPOSITION_RULE',
    title: 'Centered dominant form',
    sourceEvidence: [
      { kind: 'GROUNDED_DECISION', id: 'decision:1', fingerprint: 'fnv1a32:decision', status: 'RESOLVED' },
      { kind: 'REVISION', id: 'revision:2', fingerprint: 'fnv1a32:revision', status: 'RESOLVED' }
    ],
    references: {
      revisionIds: ['revision:2', 'revision:1'],
      provenanceIds: ['prov-event:2', 'prov-event:1'],
      decisionIds: ['fnv1a32:decision'],
      objectIds: ['object:b', 'object:a'],
      regionIds: ['region:b', 'region:a']
    },
    statement: 'Keep one dominant centered form with supporting geometry subordinate to it.',
    attributes: { symmetry: 'near', hierarchy: { dominant: 1, support: 2 } },
    outcome: 'Improved visual hierarchy.',
    disposition: 'ACCEPTED',
    confidence: 0.9,
    evidenceStrength: 'CORROBORATED',
    tags: ['symmetry', 'hierarchy', 'centered'],
    createdFrom: { kind: 'GROUNDED_DECISION', id: 'decision:1', fingerprint: 'fnv1a32:decision' },
    notes: 'Bounded method note.',
    unresolvedEvidence: [],
    ...overrides
  };
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof CreativeMemoryError && error.code === code);
}

{
  const a = memory();
  const b = clone(a);
  b.tags.reverse();
  b.sourceEvidence.reverse();
  b.references.revisionIds.reverse();
  b.references.provenanceIds.reverse();
  b.references.objectIds.reverse();
  b.references.regionIds.reverse();
  b.attributes = { hierarchy: { support: 2, dominant: 1 }, symmetry: 'near' };
  b.createdAt = '2099-01-01T00:00:00.000Z';
  a.createdAt = '2000-01-01T00:00:00.000Z';

  const first = normalizeCreativeMemoryRecord(a);
  const second = normalizeCreativeMemoryRecord(b);
  assert.deepEqual(first, second, 'equivalent reordered input must normalize identically');
  assert.equal(first.recordId, second.recordId);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.formatVersion, 4);
  assert.equal('createdAt' in first, false, 'wall-clock fields must not enter record identity/output');
  assert.equal('userProfile' in first, false);
}

{
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('SHAPE_VOCABULARY'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('COMPOSITION_RULE'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('LINE_BEHAVIOR'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('MATERIAL_TREATMENT'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('COLOR_LOGIC'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('METHOD'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('CREATIVE_DECISION'));
  assert.ok(CREATIVE_MEMORY_CATEGORIES.includes('APPROACH_RESULT'));
  expectCode(() => normalizeCreativeMemoryRecord(memory({ category: 'PERSONALITY' })), 'CREATIVE_MEMORY_CATEGORY_UNSUPPORTED');
  expectCode(() => normalizeCreativeMemoryRecord(memory({ formatVersion: 5 })), 'CREATIVE_MEMORY_FORMAT_VERSION_UNSUPPORTED');
  expectCode(() => normalizeCreativeMemoryRecord(memory({ tags: Array.from({ length: 65 }, (_, i) => `t${i}`) })), 'CREATIVE_MEMORY_LIST_LIMIT_EXCEEDED');
  expectCode(() => createCreativeMemoryCollection([memory(), memory({ statement: 'Second rule.', createdFrom: { kind: 'REVISION', id: 'r:2' } })], { limits: { maxRecords: 1 } }), 'CREATIVE_MEMORY_COLLECTION_LIMIT_EXCEEDED');
  assert.equal(validateCreativeMemoryRecord(memory()).valid, true);
  assert.equal(validateCreativeMemoryRecord(memory({ confidence: 2 })).valid, false);
}

{
  const source = memory();
  const sourceBefore = JSON.stringify(source);
  const collection = createCreativeMemoryCollection([source, clone(source)]);
  assert.equal(collection.schema, CREATIVE_MEMORY_COLLECTION_SCHEMA);
  assert.equal(collection.records.length, 1);
  assert.equal(collection.bounds.deduplicated, 1);
  assert.equal(JSON.stringify(source), sourceBefore, 'collection creation must not mutate source records');

  const dedup = addCreativeMemoryRecord(collection, clone(source));
  assert.equal(dedup.status, 'DEDUPLICATED');
  assert.equal(dedup.collection.records.length, 1);

  const changed = memory({ notes: 'Changed note', disposition: 'REJECTED', outcome: 'Rejected after review.' });
  const normalizedChanged = normalizeCreativeMemoryRecord(changed);
  assert.equal(normalizedChanged.recordId, collection.records[0].recordId, 'mutable evidence/disposition changes retain stable identity');
  assert.notEqual(normalizedChanged.fingerprint, collection.records[0].fingerprint);
  expectCode(() => addCreativeMemoryRecord(collection, changed), 'CREATIVE_MEMORY_REPLACEMENT_REQUIRED');
  const replaced = replaceCreativeMemoryRecord(collection, changed);
  assert.equal(replaced.status, 'REPLACED');
  assert.equal(replaced.collection.records[0].disposition, 'REJECTED');
}

{
  const accepted = memory();
  const rejected = memory({
    category: 'APPROACH_RESULT',
    title: 'Avoid equal-weight secondary forms',
    statement: 'Do not let supporting forms compete at equal visual weight.',
    createdFrom: { kind: 'REVISION', id: 'revision:reject' },
    sourceEvidence: [{ kind: 'REVISION', id: 'revision:reject', status: 'RESOLVED' }],
    references: { revisionIds: ['revision:reject'], provenanceIds: [], decisionIds: [], objectIds: [], regionIds: [] },
    disposition: 'REJECTED',
    confidence: 0.8,
    evidenceStrength: 'DIRECT',
    tags: ['hierarchy', 'rejected'],
    outcome: 'Secondary forms competed with the focal form.'
  });
  const unresolved = memory({
    category: 'COLOR_LOGIC',
    title: 'Warm accent hypothesis',
    statement: 'Use one restrained warm accent against a quiet field.',
    createdFrom: { kind: 'PROVENANCE', id: 'prov:missing' },
    sourceEvidence: [{ kind: 'PROVENANCE', id: 'prov:missing', status: 'UNRESOLVED' }],
    references: { revisionIds: [], provenanceIds: ['prov:missing'], decisionIds: [], objectIds: [], regionIds: [] },
    disposition: 'UNRESOLVED',
    confidence: 0.4,
    evidenceStrength: 'PARTIAL',
    tags: ['color', 'accent']
  });

  const first = createCreativeMemoryCollection([rejected, unresolved, accepted]);
  const second = createCreativeMemoryCollection([accepted, rejected, unresolved]);
  assert.deepEqual(first, second, 'collection ordering must be deterministic');
  assert.equal(serializeCreativeMemoryCollection(first), serializeCreativeMemoryCollection(second));

  const queryA = queryCreativeMemory(first, { tags: ['hierarchy'], scope: { projectId: 'project:flora' } });
  const queryB = queryCreativeMemory(second, { scope: { projectId: 'project:flora' }, tags: ['hierarchy'] });
  assert.deepEqual(queryA, queryB);
  assert.equal(queryA.records.length, 2);
  const revisionQuery = queryCreativeMemory(first, { relatedRevisionId: 'revision:reject', disposition: 'REJECTED' });
  assert.equal(revisionQuery.records.length, 1);
  assert.equal(revisionQuery.records[0].category, 'APPROACH_RESULT');
}

{
  const raw = memory();
  const bound = bindCreativeMemoryEvidence(raw, {
    revisionRecords: [{ revisionId: 'revision:1' }, { revisionId: 'revision:2' }],
    provenanceGraphs: [{ fingerprint: 'fnv1a32:prov', events: [{ eventId: 'prov-event:1' }, { eventId: 'prov-event:2' }] }],
    groundedDecisions: [{ fingerprint: 'fnv1a32:decision' }]
  });
  assert.equal(bound.unresolvedEvidence.length, 0);
  assert.deepEqual(bound.references.revisionIds, ['revision:1', 'revision:2']);
  assert.deepEqual(bound.references.provenanceIds, ['prov-event:1', 'prov-event:2']);
  assert.deepEqual(bound.references.decisionIds, ['fnv1a32:decision']);

  const missing = bindCreativeMemoryEvidence(raw, {
    revisionRecords: [{ revisionId: 'revision:1' }],
    provenanceGraphs: [{ events: [{ eventId: 'prov-event:1' }] }],
    groundedDecisions: []
  });
  assert.ok(missing.unresolvedEvidence.some(item => item.code === 'REVISION_EVIDENCE_MISSING' && item.id === 'revision:2'));
  assert.ok(missing.unresolvedEvidence.some(item => item.code === 'PROVENANCE_EVIDENCE_MISSING' && item.id === 'prov-event:2'));
  assert.ok(missing.unresolvedEvidence.some(item => item.code === 'GROUNDED_DECISION_EVIDENCE_MISSING' && item.id === 'fnv1a32:decision'));

  const sameMissing = bindCreativeMemoryEvidence(clone(raw), {
    groundedDecisions: [],
    provenanceGraphs: [{ events: [{ eventId: 'prov-event:1' }] }],
    revisionRecords: [{ revisionId: 'revision:1' }]
  });
  assert.deepEqual(missing, sameMissing, 'equivalent evidence inputs must bind deterministically');
}

{
  const a = memory();
  const b = memory({ notes: 'comparison note', tags: ['hierarchy', 'centered', 'contrast'], confidence: 0.7 });
  const first = compareCreativeMemoryRecords(a, b);
  const second = compareCreativeMemoryRecords(clone(a), clone(b));
  assert.deepEqual(first, second);
  assert.equal(first.sameStableIdentity, true);
  assert.equal(first.equivalent, false);
  assert.deepEqual(first.tags.onlyB, ['contrast']);
  assert.equal(typeof first.comparisonFingerprint, 'string');
}

{
  const accepted = memory();
  const rejected = memory({
    category: 'APPROACH_RESULT',
    title: 'Rejected treatment',
    statement: 'Avoid equal visual weight across every element.',
    createdFrom: { kind: 'REVISION', id: 'revision:reject' },
    sourceEvidence: [{ kind: 'REVISION', id: 'revision:reject', status: 'RESOLVED' }],
    references: { revisionIds: ['revision:reject'], provenanceIds: [], decisionIds: [], objectIds: [], regionIds: [] },
    disposition: 'REJECTED',
    evidenceStrength: 'DIRECT',
    confidence: 0.8,
    tags: ['hierarchy']
  });
  const unresolved = memory({
    category: 'METHOD',
    title: 'Unresolved method',
    statement: 'Test a bounded alternate path treatment.',
    createdFrom: { kind: 'PROVENANCE', id: 'prov:unknown' },
    sourceEvidence: [{ kind: 'PROVENANCE', id: 'prov:unknown', status: 'UNRESOLVED' }],
    references: { revisionIds: [], provenanceIds: ['prov:unknown'], decisionIds: [], objectIds: [], regionIds: [] },
    disposition: 'UNRESOLVED',
    evidenceStrength: 'UNRESOLVED',
    confidence: null,
    tags: ['method'],
    unresolvedEvidence: [{ code: 'PROVENANCE_EVIDENCE_MISSING', kind: 'PROVENANCE', id: 'prov:unknown' }]
  });
  const collection = createCreativeMemoryCollection([accepted, rejected, unresolved]);
  const contextA = buildCreativeMemoryAdvisoryContext(collection, {}, { maxRecords: 2 });
  const contextB = buildCreativeMemoryAdvisoryContext(createCreativeMemoryCollection([unresolved, accepted, rejected]), {}, { maxRecords: 2 });
  assert.equal(contextA.schema, CREATIVE_MEMORY_ADVISORY_SCHEMA);
  assert.deepEqual(contextA, contextB);
  assert.equal(contextA.authority.role, 'ADVISORY_READ_ONLY');
  assert.equal(contextA.authority.documentWrite, false);
  assert.equal(contextA.authority.historyWrite, false);
  assert.equal(contextA.authority.revisionWrite, false);
  assert.equal(contextA.authority.execution, false);
  assert.equal(contextA.authority.networkRequired, false);
  assert.ok(contextA.selectedRecords.length <= 2);
  assert.equal(contextA.bounds.truncatedByCount, true);
  assert.ok(contextA.bounds.outputBytes <= 128 * 1024);
  assert.equal(typeof contextA.contextFingerprint, 'string');

  const fullContext = buildCreativeMemoryAdvisoryContext(collection);
  assert.equal(fullContext.approaches.accepted.length, 1);
  assert.equal(fullContext.approaches.rejected.length, 1);
  assert.equal(fullContext.approaches.unresolved.length, 1);
  assert.ok(fullContext.unresolvedEvidence.some(item => item.code === 'PROVENANCE_EVIDENCE_MISSING'));
  assert.ok(fullContext.references.revisionIds.includes('revision:reject'));
}

{
  const records = [memory()];
  const adapter = createCreativeMemoryAdapter({ getRecords: () => records });
  const collection = adapter.read();
  assert.equal(collection.records.length, 1);
  const query = adapter.query({ category: 'COMPOSITION_RULE' });
  assert.equal(query.records.length, 1);
  const context = adapter.readAdvisoryContext();
  assert.equal(context.authority.execution, false);
  assert.equal(records.length, 1, 'adapter must not mutate provider records');
}

{
  assert.equal(CREATIVE_MEMORY_FORMAT_VERSION, 4);
  const source = readFileSync(new URL('../product/source/src/memory/creative-memory.js', import.meta.url), 'utf8');
  for (const forbidden of [
    'fetch(', 'XMLHttpRequest', 'WebSocket', 'eval(', 'new Function',
    'window.', 'document.querySelector', 'localStorage', 'sessionStorage'
  ]) {
    assert.equal(source.includes(forbidden), false, `forbidden dependency/token present: ${forbidden}`);
  }
  for (const forbiddenImport of [
    "../document/revision.js", "../history/", "../geometry/", "../renderer/"
  ]) {
    assert.equal(source.includes(forbiddenImport), false, `authority-changing dependency present: ${forbiddenImport}`);
  }
}

console.log('CORE-MOD-006 creative-memory deterministic tests: PASS');
