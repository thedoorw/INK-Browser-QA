import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ExternalReferenceRunnerRegistry, REFERENCE_DECISIONS, attachReferencePackage,
  compareReference, completedReferenceRun, createManualReferenceRunKit,
  createReferencePackage, maturityAssessment, unavailableReferenceRun,
  validateReferencePackage
} from '../../src/program-import/index.js';
import { defaultDocument } from '../../src/document/model.js';
import { migrateDocument } from '../../src/document/migration.js';

const request = { assetId: 'asset-real-001', runnerId: 'inkscape', software: 'Inkscape', program: { path: 'program.svg' }, input: { path: 'input.svg' } };

test('unavailable commercial runners use formal non-success states', () => {
  const value = unavailableReferenceRun({ ...request, runnerId: 'photoshop', software: 'Adobe Photoshop' }, 'INSTALLATION_REQUIRED');
  assert.equal(value.statusLabel, 'INSTALLATION REQUIRED');
  assert.equal(value.originalProgramExecuted, false);
});

test('completed runner evidence requires version, output and original execution', () => {
  assert.throws(() => completedReferenceRun(request, { softwareVersion: '1.2.2', output: { path: 'out.svg' } }), /ORIGINAL_EXECUTION/);
  const value = completedReferenceRun(request, { softwareVersion: '1.2.2', output: { path: 'out.svg' }, originalProgramExecuted: true });
  assert.equal(value.status, 'COMPLETED');
});

test('registry never promotes missing runner to completed', async () => {
  const registry = new ExternalReferenceRunnerRegistry();
  const result = await registry.execute(request, { userApproved: true });
  assert.equal(result.status, 'EXTERNAL_EXECUTION_UNAVAILABLE');
});

test('trusted runner requires explicit approval', async () => {
  const registry = new ExternalReferenceRunnerRegistry();
  registry.register({ id: 'inkscape', software: 'Inkscape', availability: () => ({ available: true }), run: async () => ({ softwareVersion: '1.2.2', output: { path: 'out.svg' }, originalProgramExecuted: true }) });
  const result = await registry.execute(request, { userApproved: false });
  assert.equal(result.status, 'MANUAL_REFERENCE_RUN_REQUIRED');
});

test('manual kit is formal evidence but not an automatic runner', () => {
  const kit = createManualReferenceRunKit(request, { instructions: ['open input', 'run program'], requiredImports: ['output', 'structure'] });
  assert.equal(kit.acceptance.mayServeAsFormalReferenceEvidence, true);
  assert.equal(kit.acceptance.mayBeClaimedAsAutomaticRunner, false);
});

test('reference package rejects cross-asset traceability', () => {
  const files = Object.fromEntries(['asset.json','source-program','source-license','source-input','source-application-version','source-execution-log','source-intermediate-states','source-output','source-structure-summary','canonical-operations','ink-recipe','ink-document','ink-output','capability-report','gap-report','difference-report','replay-report','qa-report'].map(name => [name, { path: name, assetId: 'asset-real-001' }]));
  files['ink-output'].assetId = 'wrong';
  const value = createReferencePackage({ assetId: 'asset-real-001', files });
  assert.equal(validateReferencePackage(value).valid, false);
});

test('reference packages survive .ink migration', () => {
  const document = defaultDocument(), value = createReferencePackage({ assetId: 'asset-real-001', files: {} });
  attachReferencePackage(document, value);
  const reopened = migrateDocument(JSON.parse(JSON.stringify(document)));
  assert.equal(reopened.referencePackages[0].assetId, 'asset-real-001');
});

test('threshold engine emits only permitted decisions', () => {
  const vector = { objects: [] };
  const report = compareReference({ reference: vector, ink: vector, kind: 'vector', metadata: { referenceSoftware: 'Inkscape', referenceVersion: '1.2.2', sameInputConfirmed: true, svgRoundtripStability: 1 } });
  assert.ok(REFERENCE_DECISIONS.includes(report.decision));
  assert.equal(report.decision, 'EQUIVALENT');
});

test('missing original software evidence is rejected even with identical values', () => {
  const report = compareReference({ reference: { objects: [] }, ink: { objects: [] }, kind: 'vector', metadata: { sameInputConfirmed: true, svgRoundtripStability: 1 } });
  assert.equal(report.decision, 'REJECTED');
});

test('MATURE enforces five real programs and two inputs', () => {
  const evidence = Array.from({ length: 5 }, (_, index) => ({ assetId: `a${index}`, inputId: index % 2 ? 'i1' : 'i2', kind: 'external-reference', originalProgramExecuted: true, passed: true, structureCorrect: true, roundtripConsistent: true, replayConsistent: true, rollbackMajorIssue: false, withinThreshold: true, approximated: false }));
  assert.equal(maturityAssessment({ capability: 'path', evidence }).level, 'MATURE');
});

test('approximation cannot be promoted to MATURE', () => {
  const evidence = Array.from({ length: 5 }, (_, index) => ({ assetId: `a${index}`, inputId: index % 2 ? 'i1' : 'i2', kind: 'external-reference', originalProgramExecuted: true, passed: true, structureCorrect: true, roundtripConsistent: true, replayConsistent: true, withinThreshold: true, approximated: index === 0 }));
  assert.notEqual(maturityAssessment({ capability: 'brush', evidence }).level, 'MATURE');
});
