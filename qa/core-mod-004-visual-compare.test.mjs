import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRevisionRecord } from '../product/source/src/document/revision.js';
import {
  VISUAL_COMPARE_MODES,
  VisualCompareError,
  compareVisualSubjects,
  createVariantDescriptor,
  createVisualCompareAdapter
} from '../product/source/src/compare/visual-compare.js';

const clone = value => JSON.parse(JSON.stringify(value));

function path(id, fill) {
  return {
    id,
    type: 'path',
    name: id,
    matrix: [1, 0, 0, 1, 0, 0],
    visible: true,
    locked: false,
    opacity: 1,
    fill,
    stroke: '#000000',
    strokeWidth: 1,
    subpaths: [{
      id: `${id}:sub`,
      closed: true,
      anchors: [
        { id: `${id}:a0`, x: 0, y: 0 },
        { id: `${id}:a1`, x: 10, y: 0 },
        { id: `${id}:a2`, x: 10, y: 10 }
      ]
    }]
  };
}

function documentFixture() {
  return {
    format: 'INK',
    formatVersion: 4,
    appVersion: '0.1',
    id: 'doc:compare',
    title: 'Visual compare fixture',
    activePageId: 'page:1',
    pages: [{
      id: 'page:1',
      name: 'Page 1',
      artboard: { mode: 'fixed', widthMm: 210, heightMm: 297, ppi: 300, bleedMm: 0 },
      workspace: {
        activeSpace: 'creation',
        layoutViewport: { x: 0, y: 0, scale: 1, rotation: 0 },
        cameras: {
          creation: { x: 0, y: 0, scale: 1, rotation: 0 },
          layout: { x: 0, y: 0, scale: 1, rotation: 0 }
        }
      },
      activeLayerId: 'layer:1',
      layers: [{
        id: 'layer:1',
        name: 'Layer 1',
        visible: true,
        locked: false,
        opacity: 1,
        objects: [
          path('path:shared', '#cc0000'),
          path('object:remove', '#00aa66')
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

function modifiedFixture() {
  const document = clone(documentFixture());
  document.pages[0].layers[0].objects = document.pages[0].layers[0].objects
    .filter(object => object.id !== 'object:remove');
  document.pages[0].layers[0].objects.find(object => object.id === 'path:shared').fill = '#3366ff';
  document.pages[0].layers[0].objects.push(path('object:add', '#ffcc00'));
  return document;
}

function provenanceContext() {
  return {
    schema: 'INK-AI-DOCUMENT-BRIDGE-PROVENANCE',
    version: 1,
    documentId: 'doc:compare',
    provenanceFingerprint: 'fnv1a32:prov0001',
    events: [{
      eventId: 'event:object',
      kind: 'revision-object-changed',
      revisionId: 'revision:fixture',
      objectIds: ['path:shared']
    }],
    edges: [],
    unresolvedCount: 0,
    conflictCount: 0,
    truncated: { events: false, edges: false }
  };
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof VisualCompareError && error.code === code);
}

const before = documentFixture();
const current = modifiedFixture();
const revisionA = createRevisionRecord(before, {
  createdAt: '2026-09-22T07:00:00.000Z',
  label: 'Base',
  reason: 'fixture'
});
const revisionB = createRevisionRecord(current, {
  parentRecord: revisionA,
  createdAt: '2026-09-22T08:00:00.000Z',
  label: 'Changed',
  reason: 'fixture'
});

{
  const beforeJson = JSON.stringify(before);
  const currentJson = JSON.stringify(current);
  const revisionJson = JSON.stringify(revisionA);
  const comparison = compareVisualSubjects(
    { kind: 'revision', revisionRecord: revisionA, label: 'Base revision' },
    { kind: 'current', document: current, label: 'Current' }
  );

  assert.equal(comparison.schema, 'INK-VISUAL-COMPARISON');
  assert.equal(comparison.version, 1);
  assert.equal(comparison.structural.status, 'RESOLVED');
  assert.deepEqual(comparison.structural.addedObjectIds, ['object:add']);
  assert.deepEqual(comparison.structural.removedObjectIds, ['object:remove']);
  assert.deepEqual(comparison.structural.changedObjectIds, ['path:shared']);
  assert.deepEqual(comparison.structural.correspondence.sharedObjectIds, ['path:shared']);
  assert.equal(comparison.mode.renderingExecuted, false);
  assert.deepEqual(comparison.mode.supported, VISUAL_COMPARE_MODES);
  assert.equal(comparison.workflow.restore, 'NOT_EXECUTED');
  assert.equal(JSON.stringify(before), beforeJson);
  assert.equal(JSON.stringify(current), currentJson);
  assert.equal(JSON.stringify(revisionA), revisionJson);
}

{
  const comparison = compareVisualSubjects(
    { kind: 'revision', revisionRecord: revisionA },
    { kind: 'revision', revisionRecord: revisionB },
    { mode: 'difference' }
  );
  assert.equal(comparison.structural.status, 'RESOLVED');
  assert.equal(comparison.subjects.a.identity.revisionId, revisionA.revisionId);
  assert.equal(comparison.subjects.b.identity.revisionId, revisionB.revisionId);
  assert.equal(comparison.mode.requested, 'difference');
}

{
  const same = compareVisualSubjects(
    { kind: 'reference', referenceId: 'reference:1', document: clone(before) },
    { kind: 'current', document: clone(before) }
  );
  assert.equal(same.structural.status, 'RESOLVED');
  assert.equal(same.structural.equivalent, true);

  const other = clone(before);
  other.id = 'doc:other';
  const mismatch = compareVisualSubjects(
    { kind: 'reference', referenceId: 'reference:other', document: other },
    { kind: 'current', document: before }
  );
  assert.equal(mismatch.structural.status, 'UNRESOLVED');
  assert.ok(mismatch.unresolved.some(item => item.code === 'DOCUMENT_IDENTITY_MISMATCH'));
  assert.deepEqual(mismatch.structural.correspondence.sharedObjectIds, []);
}

{
  const descriptorOnly = compareVisualSubjects(
    {
      kind: 'reference',
      referenceId: 'reference:descriptor',
      documentFingerprint: 'fnv1a32:reference',
      visualDescriptors: { width: 100, height: 100, source: 'reference-only' }
    },
    { kind: 'current', document: before },
    { mode: 'overlay' }
  );
  assert.equal(descriptorOnly.structural.status, 'UNRESOLVED');
  assert.ok(descriptorOnly.unresolved.some(item => item.code === 'STRUCTURAL_DOCUMENT_UNAVAILABLE'));
  assert.equal(descriptorOnly.visual.status, 'DESCRIPTORS_AVAILABLE');
  assert.equal(descriptorOnly.visual.rendererInvoked, false);
  assert.equal(descriptorOnly.visual.pixelCaptureExecuted, false);
}

{
  const one = compareVisualSubjects(
    {
      kind: 'current',
      document: before,
      objectIds: ['object:remove', 'path:shared'],
      provenanceRefs: [{ type: 'manual', id: 'b' }, { type: 'manual', id: 'a' }]
    },
    {
      kind: 'variant',
      variantId: 'variant:reorder',
      document: current,
      objectIds: ['object:add', 'path:shared']
    }
  );
  const two = compareVisualSubjects(
    {
      kind: 'current',
      document: before,
      objectIds: ['path:shared', 'object:remove'],
      provenanceRefs: [{ type: 'manual', id: 'a' }, { type: 'manual', id: 'b' }]
    },
    {
      kind: 'variant',
      variantId: 'variant:reorder',
      document: current,
      objectIds: ['path:shared', 'object:add']
    }
  );
  assert.deepEqual(one, two);
  assert.equal(one.comparisonFingerprint, two.comparisonFingerprint);
}

{
  const comparison = compareVisualSubjects(
    {
      kind: 'current',
      document: current,
      objectIds: ['path:shared'],
      provenanceContext: provenanceContext(),
      provenanceRefs: [{ type: 'manual', id: 'manual:1' }]
    },
    { kind: 'revision', revisionRecord: revisionA }
  );
  const refs = comparison.subjects.a.provenanceRefs.map(item => `${item.type}:${item.id}`);
  assert.ok(refs.includes('manual:manual:1'));
  assert.ok(refs.includes('provenance-graph:fnv1a32:prov0001'));
  assert.ok(refs.includes('provenance-event:event:object'));
}

{
  const comparison = compareVisualSubjects(
    { kind: 'revision', revisionRecord: revisionA },
    {
      kind: 'variant',
      variantId: 'variant:blue',
      document: current,
      provenanceContext: provenanceContext()
    }
  );
  const variant = createVariantDescriptor({
    variantId: 'variant:blue',
    baseSubject: { kind: 'revision', revisionRecord: revisionA },
    derivedSubject: {
      kind: 'variant',
      variantId: 'variant:blue',
      document: current,
      provenanceContext: provenanceContext()
    },
    label: 'Blue variant',
    reason: 'fixture',
    sourceRevisionId: revisionA.revisionId,
    decisionState: 'UNRESOLVED',
    comparison
  });
  assert.equal(variant.schema, 'INK-VISUAL-VARIANT');
  assert.equal(variant.variantId, 'variant:blue');
  assert.equal(variant.decisionState, 'UNRESOLVED');
  assert.equal(variant.sourceRevisionId, revisionA.revisionId);
  assert.equal(variant.provenanceFingerprint, 'fnv1a32:prov0001');
  assert.equal(variant.comparisonFingerprint, comparison.comparisonFingerprint);
  assert.ok(variant.variantFingerprint.startsWith('fnv1a32:'));

  const selectedMetadata = createVariantDescriptor({
    variantId: 'variant:selected-metadata',
    baseSubject: { kind: 'current', document: before },
    derivedSubject: { kind: 'variant', variantId: 'variant:selected-metadata', document: current },
    label: 'Selected metadata',
    reason: 'explicit metadata fixture',
    decisionState: 'SELECTED'
  });
  assert.equal(selectedMetadata.decisionState, 'SELECTED');
}

{
  const largeA = documentFixture();
  const largeB = clone(largeA);
  for (let index = 0; index < 80; index += 1) {
    const id = `extra:${String(index).padStart(3, '0')}`;
    largeA.pages[0].layers[0].objects.push(path(id, '#111111'));
    largeB.pages[0].layers[0].objects.push(path(id, '#111111'));
  }
  const bounded = compareVisualSubjects(
    { kind: 'current', document: largeA },
    { kind: 'variant', variantId: 'variant:bounded', document: largeB },
    { limits: { maxObjectIds: 8, maxProvenanceRefs: 4, maxBytes: 16 * 1024 } }
  );
  assert.ok(bounded.structural.correspondence.sharedObjectIds.length <= 8);
  assert.ok(bounded.bounds.outputBytes <= 16 * 1024);
  assert.ok(bounded.unresolved.some(item => item.code === 'SUBJECT_OBJECT_IDS_TRUNCATED'));
}

{
  const revisions = new Map([
    [revisionA.revisionId, revisionA],
    [revisionB.revisionId, revisionB]
  ]);
  const variants = new Map([
    ['variant:a', { variantId: 'variant:a', document: before }],
    ['variant:b', { variantId: 'variant:b', document: current }]
  ]);
  const adapter = createVisualCompareAdapter({
    getCurrentDocument: () => current,
    getReference: id => ({ referenceId: id, document: before }),
    getRevision: id => revisions.get(id),
    getVariant: id => variants.get(id),
    getProvenanceContext: () => provenanceContext()
  });
  assert.equal(adapter.referenceCurrent('reference:1').structural.status, 'RESOLVED');
  assert.equal(adapter.revisionRevision(revisionA.revisionId, revisionB.revisionId).structural.status, 'RESOLVED');
  assert.equal(adapter.currentRevision(revisionA.revisionId).structural.status, 'RESOLVED');
  assert.equal(adapter.variantVariant('variant:a', 'variant:b').structural.status, 'RESOLVED');
}

{
  const bad = documentFixture();
  bad.formatVersion = 5;
  expectCode(
    () => compareVisualSubjects({ kind: 'current', document: bad }, { kind: 'current', document: before }),
    'VISUAL_COMPARE_FORMAT_VERSION_UNSUPPORTED'
  );
  expectCode(
    () => compareVisualSubjects({ kind: 'current', document: before }, { kind: 'current', document: current }, { mode: 'render-it' }),
    'VISUAL_COMPARE_MODE_UNSUPPORTED'
  );
  expectCode(
    () => createVariantDescriptor({
      variantId: 'variant:auto',
      baseSubject: { kind: 'current', document: before },
      derivedSubject: { kind: 'variant', variantId: 'variant:auto', document: current },
      decisionState: 'AUTO_CHOOSE'
    }),
    'VISUAL_COMPARE_VARIANT_DECISION_STATE_UNSUPPORTED'
  );
}

{
  const source = readFileSync(new URL('../product/source/src/compare/visual-compare.js', import.meta.url), 'utf8');
  assert.equal(/restoreRevisionDocument\s*\(/.test(source), false, 'compare module must not invoke restore');
  assert.equal(/\bwindow\./.test(source), false);
  assert.equal(/document\.querySelector/.test(source), false);
  assert.equal(/\bfetch\s*\(/.test(source), false);
  assert.equal(/XMLHttpRequest/.test(source), false);
  assert.equal(/WebSocket/.test(source), false);
  assert.equal(/from ['"][^'"]*renderer[^'"]*['"]/.test(source), false);
  assert.equal(/\.render\s*\(/.test(source), false);
}

console.log('CORE-MOD-004 visual-compare deterministic tests: PASS');
