import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { normalizeCreativeMemoryRecord } from '../product/source/src/memory/creative-memory.js';
import {
  RESEARCH_CREATION_ADVISORY_SCHEMA,
  RESEARCH_CREATION_FORMAT_VERSION,
  RESEARCH_CONSTRAINT_CLASSES,
  RESEARCH_EVIDENCE_CLASSES,
  RESEARCH_PRINCIPLE_CATEGORIES,
  ResearchCreationBridgeError,
  bridgeResearchToCreativeConstraints,
  buildResearchCreationAdvisoryContext,
  createCreativeMemoryCandidate,
  createResearchCreationBridgeAdapter,
  createResearchCreationBundle,
  extractResearchPrinciples,
  normalizeResearchEvidence,
  normalizeResearchPrinciple
} from '../product/source/src/research/research-creation-bridge.js';

const clone = value => JSON.parse(JSON.stringify(value));

function evidence(overrides = {}) {
  return {
    source: { id: 'reference:poster:001', type: 'LOCAL_REFERENCE', label: 'Poster reference' },
    evidenceClass: 'COMPOSITION_OBSERVATION',
    title: 'Dominant center mass',
    observation: 'A dominant central form occupies most of the visual field while secondary elements remain subordinate.',
    attributes: { dominance: 'high', symmetry: 'near-axis' },
    confidence: 0.9,
    evidenceStrength: 'DIRECT',
    tags: ['poster', 'centered', 'poster'],
    relatedSourceRefs: [{ type: 'REFERENCE', id: 'reference:poster:001' }],
    state: 'RESOLVED',
    provenance: {
      revisionIds: ['revision:2'],
      provenanceIds: ['fnv1a32:prov1'],
      decisionIds: ['decision:1'],
      objectIds: ['object:hero'],
      regionIds: ['region:hero']
    },
    ...overrides
  };
}

function principle(evidenceId, overrides = {}) {
  return {
    category: 'COMPOSITION',
    label: 'Single dominant center',
    statement: 'Keep one dominant central form and subordinate surrounding elements.',
    supportingEvidenceRefs: [evidenceId],
    applicabilityScope: { projectId: 'project:ink-study', tags: ['poster'] },
    confidence: 0.85,
    evidenceStrength: 'DIRECT',
    tags: ['centered', 'hierarchy'],
    assumptions: ['Applies to single-focus compositions.'],
    ...overrides
  };
}

function constraint(principleId, overrides = {}) {
  return {
    label: 'Dominant center constraint',
    statement: 'Reserve the primary visual mass for one centered dominant form.',
    principleRefs: [principleId],
    parameters: { dominantCount: 1, centerBias: 'high', secondaryWeight: 'low' },
    tags: ['composition'],
    ...overrides
  };
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof ResearchCreationBridgeError && error.code === code);
}

assert.equal(RESEARCH_CREATION_FORMAT_VERSION, 4);
assert.ok(RESEARCH_EVIDENCE_CLASSES.includes('VISUAL_REFERENCE'));
assert.ok(RESEARCH_EVIDENCE_CLASSES.includes('USER_RESEARCH_NOTE'));
assert.ok(RESEARCH_PRINCIPLE_CATEGORIES.includes('REPETITION_VARIATION'));
assert.ok(RESEARCH_CONSTRAINT_CLASSES.includes('METHOD_GUIDANCE'));

const evidenceA = normalizeResearchEvidence(evidence());
const evidenceB = normalizeResearchEvidence(evidence({
  tags: ['centered', 'poster'],
  relatedSourceRefs: [{ id: 'reference:poster:001', type: 'REFERENCE' }],
  provenance: {
    regionIds: ['region:hero'],
    objectIds: ['object:hero'],
    decisionIds: ['decision:1'],
    provenanceIds: ['fnv1a32:prov1'],
    revisionIds: ['revision:2']
  }
}));
assert.deepEqual(evidenceA, evidenceB, 'equivalent evidence must normalize deterministically');
assert.equal(evidenceA.evidenceId, evidenceB.evidenceId);
assert.equal(evidenceA.fingerprint, evidenceB.fingerprint);
assert.equal(evidenceA.tags.length, 2);

expectCode(
  () => normalizeResearchEvidence(evidence({ evidenceClass: 'REMOTE_SCRAPE' })),
  'RESEARCH_CREATION_EVIDENCE_CLASS_UNSUPPORTED'
);
expectCode(
  () => normalizeResearchEvidence(evidence({ observation: 'x'.repeat(2001) })),
  'RESEARCH_CREATION_FIELD_INVALID'
);
expectCode(
  () => normalizeResearchEvidence({ ...evidence(), formatVersion: 5 }),
  'RESEARCH_CREATION_FORMAT_VERSION_UNSUPPORTED'
);

const conflictEvidence = normalizeResearchEvidence(evidence({
  source: { id: 'reference:poster:002', type: 'LOCAL_REFERENCE' },
  title: 'Competing composition',
  observation: 'The visual field uses two equal focal masses.',
  evidenceStrength: 'PARTIAL'
}));
const evidenceSet = [conflictEvidence, evidenceA];

const principles1 = extractResearchPrinciples(evidenceSet, [principle(evidenceA.evidenceId)]);
const principles2 = extractResearchPrinciples([...evidenceSet].reverse(), [principle(evidenceA.evidenceId, { tags: ['hierarchy', 'centered'] })]);
assert.deepEqual(principles1, principles2, 'equivalent reordered evidence must produce identical principle output');
assert.equal(principles1.length, 1);
assert.equal(principles1[0].supportingEvidence[0].evidenceId, evidenceA.evidenceId);
assert.ok(principles1[0].fingerprint.startsWith('fnv1a32:'));

const conflictingPrinciple = normalizeResearchPrinciple(principle(evidenceA.evidenceId, {
  state: 'CONFLICTING',
  conflictingEvidenceRefs: [conflictEvidence.evidenceId],
  unresolvedEvidence: [{ code: 'COMPOSITION_CONFLICT', evidenceId: conflictEvidence.evidenceId }]
}), evidenceSet);
assert.equal(conflictingPrinciple.state, 'CONFLICTING');
assert.equal(conflictingPrinciple.conflictingEvidence[0].evidenceId, conflictEvidence.evidenceId);
expectCode(
  () => normalizeResearchPrinciple(principle('research-evidence:missing'), evidenceSet),
  'RESEARCH_CREATION_SUPPORTING_EVIDENCE_MISSING'
);
expectCode(
  () => normalizeResearchPrinciple(principle(evidenceA.evidenceId, {
    state: 'RESOLVED', conflictingEvidenceRefs: [conflictEvidence.evidenceId]
  }), evidenceSet),
  'RESEARCH_CREATION_PRINCIPLE_STATE_CONTRADICTION'
);

const constraints1 = bridgeResearchToCreativeConstraints(principles1, [constraint(principles1[0].principleId)]);
const constraints2 = bridgeResearchToCreativeConstraints(principles1, [constraint(principles1[0].principleId, {
  parameters: { secondaryWeight: 'low', centerBias: 'high', dominantCount: 1 }
})]);
assert.deepEqual(constraints1, constraints2, 'constraint parameter object key order must not change normalized result');
assert.equal(constraints1[0].constraintClass, 'COMPOSITION');
assert.equal(constraints1[0].advisory, true);
assert.equal(constraints1[0].execution, false);
assert.deepEqual(constraints1[0].principleRefs, [principles1[0].principleId]);
expectCode(
  () => bridgeResearchToCreativeConstraints(principles1, [constraint(principles1[0].principleId, {
    parameters: { command: 'delete-object' }
  })]),
  'RESEARCH_CREATION_EXECUTION_SHAPE_PROHIBITED'
);

expectCode(
  () => createCreativeMemoryCandidate(principles1[0], evidenceSet, {}),
  'RESEARCH_CREATION_MEMORY_PROMOTION_EXPLICIT_REQUEST_REQUIRED'
);
const promotion = {
  requested: true,
  disposition: 'UNRESOLVED',
  scope: { projectId: 'project:ink-study' },
  notes: 'Explicit research promotion candidate only.'
};
const memoryCandidate1 = createCreativeMemoryCandidate(principles1[0], evidenceSet, promotion);
const memoryCandidate2 = createCreativeMemoryCandidate(principles1[0], [...evidenceSet].reverse(), clone(promotion));
assert.deepEqual(memoryCandidate1, memoryCandidate2, 'equivalent promotion inputs must create identical Creative Memory candidates');
assert.equal(memoryCandidate1.autoWrite, false);
assert.equal(memoryCandidate1.targetSchema, 'INK-CREATIVE-MEMORY-RECORD');
assert.equal(memoryCandidate1.candidate.createdFrom.id, principles1[0].principleId);
assert.equal(memoryCandidate1.candidate.sourceEvidence[0].id, evidenceA.evidenceId);
const normalizedMemory = normalizeCreativeMemoryRecord(memoryCandidate1.candidate);
assert.equal(normalizedMemory.schema, 'INK-CREATIVE-MEMORY-RECORD');
assert.equal(normalizedMemory.formatVersion, 4);
assert.equal(normalizedMemory.createdFrom.fingerprint, principles1[0].fingerprint);

const bundle1 = createResearchCreationBundle({ evidence: evidenceSet, principles: principles1, constraints: constraints1 });
const bundle2 = createResearchCreationBundle({ evidence: [...evidenceSet].reverse(), principles: [...principles1].reverse(), constraints: [...constraints1].reverse() });
assert.equal(bundle1.fingerprint, bundle2.fingerprint);
assert.deepEqual(bundle1.evidence, bundle2.evidence);
assert.deepEqual(bundle1.principles, bundle2.principles);
assert.deepEqual(bundle1.constraints, bundle2.constraints);
assert.equal(bundle1.authority.researchSourceAuthority, 'EVIDENCE_ONLY');
assert.equal(bundle1.authority.execution, false);

const context = buildResearchCreationAdvisoryContext(bundle1);
assert.equal(context.schema, RESEARCH_CREATION_ADVISORY_SCHEMA);
assert.equal(context.authority.role, 'ADVISORY_READ_ONLY');
assert.equal(context.authority.documentWrite, false);
assert.equal(context.authority.historyWrite, false);
assert.equal(context.authority.revisionWrite, false);
assert.equal(context.authority.geometryWrite, false);
assert.equal(context.authority.renderer, false);
assert.equal(context.authority.execution, false);
assert.equal(context.authority.networkRequired, false);
assert.equal(context.authority.creativeMemoryAutoWrite, false);
assert.equal(context.creativeMemory.requested, false);
assert.deepEqual(context.creativeMemory.candidates, []);
assert.equal(context.traceability.evidenceToPrinciples[0].evidenceIds[0], evidenceA.evidenceId);
assert.equal(context.traceability.principlesToConstraints[0].principleIds[0], principles1[0].principleId);
assert.ok(context.contextFingerprint.startsWith('fnv1a32:'));

const contextWithMemory = buildResearchCreationAdvisoryContext(bundle1, {
  includeCreativeMemoryCandidates: true,
  memoryPromotions: [{ principleId: principles1[0].principleId, ...promotion }]
});
assert.equal(contextWithMemory.creativeMemory.requested, true);
assert.equal(contextWithMemory.creativeMemory.candidates.length, 1);
assert.equal(contextWithMemory.creativeMemory.candidates[0].candidateFingerprint, memoryCandidate1.candidateFingerprint);
expectCode(
  () => buildResearchCreationAdvisoryContext(bundle1, { includeCreativeMemoryCandidates: true }),
  'RESEARCH_CREATION_MEMORY_PROMOTION_EXPLICIT_REQUEST_REQUIRED'
);

const contextSelected = buildResearchCreationAdvisoryContext(bundle1, {
  evidenceIds: [evidenceA.evidenceId],
  principleIds: [principles1[0].principleId],
  constraintIds: [constraints1[0].constraintId]
}, { maxEvidence: 1, maxPrinciples: 1, maxConstraints: 1 });
assert.equal(contextSelected.selectedResearchEvidence.length, 1);
assert.equal(contextSelected.derivedPrinciples.length, 1);
assert.equal(contextSelected.derivedCreativeConstraints.length, 1);
assert.ok(contextSelected.bounds.outputBytes <= contextSelected.bounds.maxBytes);

expectCode(
  () => buildResearchCreationAdvisoryContext(bundle1, {}, { maxBytes: 1024 }),
  'RESEARCH_CREATION_ADVISORY_CONTEXT_BYTE_LIMIT_EXCEEDED'
);

const adapter = createResearchCreationBridgeAdapter({
  getEvidence: () => evidenceSet,
  getPrinciples: () => principles1,
  getConstraints: () => constraints1
});
assert.equal(adapter.read().fingerprint, bundle1.fingerprint);
assert.equal(adapter.advisory().contextFingerprint, context.contextFingerprint);

{
  const source = readFileSync(new URL('../product/source/src/research/research-creation-bridge.js', import.meta.url), 'utf8');
  assert.equal(/\bfetch\s*\(/.test(source), false, 'module must not fetch remote sources');
  assert.equal(/XMLHttpRequest/.test(source), false);
  assert.equal(/WebSocket/.test(source), false);
  assert.equal(/\beval\s*\(/.test(source), false);
  assert.equal(/new\s+Function\s*\(/.test(source), false);
  assert.equal(/localStorage|sessionStorage|indexedDB/.test(source), false);
  assert.equal(/from ['"][^'"]*(document|history|revision|renderer|geometry)[^'"]*['"]/.test(source), false);
  assert.equal(/personality|userProfile|psycholog/i.test(source), false);
  assert.equal(/createChat|executeRecipe|restoreRevisionDocument/.test(source), false);
}

console.log('CORE-MOD-007 research-creation deterministic tests: PASS');
