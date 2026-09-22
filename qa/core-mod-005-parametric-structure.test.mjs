import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import {
  PARAMETRIC_STRUCTURE_FORMAT_VERSION,
  PARAMETRIC_STRUCTURE_PLAN_SCHEMA,
  ParametricStructureError,
  createParametricStructureAdapter,
  normalizeStructureTransform,
  resolveParametricStructure
} from '../product/source/src/structure/parametric-structure.js';

const clone = value => JSON.parse(JSON.stringify(value));

function descriptor() {
  return {
    schema: 'INK-PARAMETRIC-STRUCTURE',
    version: 1,
    structureId: 'structure:flower',
    label: 'Fixture flower',
    seed: 42,
    parameters: [
      { name: 'spacing', type: 'number', default: 12, min: 0, max: 100 },
      { name: 'petalCount', type: 'integer', required: true, min: 1, max: 12 },
      { name: 'mode', type: 'enum', default: 'radial', values: ['linear', 'radial'] }
    ],
    values: { petalCount: 4, spacing: 10 },
    nodes: [
      {
        key: 'core',
        role: 'center',
        source: {
          objectId: 'object:core',
          semanticRegionRef: 'region:core',
          provenanceRefs: [{ type: 'revision', id: 'revision:base' }]
        },
        transform: { translate: { x: 10, y: 20 } }
      },
      {
        key: 'petal',
        role: 'petal',
        parentKey: 'core',
        source: {
          objectId: 'object:petal',
          semanticRegionRef: 'region:petal',
          provenanceRefs: [
            { type: 'revision', id: 'revision:base' },
            { type: 'recipe-step', id: 'step:petal' }
          ]
        },
        transform: [1, 0, 0, 1, 0, 0],
        repeat: {
          count: '$petalCount',
          stepTransform: { translate: { x: 10, y: 0 } }
        }
      }
    ],
    relationships: [
      { from: 'core', type: 'anchors', to: 'petal' }
    ]
  };
}

function reorderEquivalent(input) {
  const value = clone(input);
  value.parameters.reverse();
  value.nodes.reverse();
  value.relationships.reverse();
  value.nodes.forEach(node => {
    if (Array.isArray(node.source?.provenanceRefs)) node.source.provenanceRefs.reverse();
  });
  value.values = { spacing: 10, petalCount: 4 };
  return value;
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof ParametricStructureError && error.code === code);
}

{
  const one = resolveParametricStructure(descriptor());
  const two = resolveParametricStructure(clone(descriptor()));
  assert.deepEqual(one, two);
  assert.equal(one.structureFingerprint, two.structureFingerprint);
  assert.equal(one.schema, PARAMETRIC_STRUCTURE_PLAN_SCHEMA);
  assert.equal(one.formatVersion, 4);
  assert.equal(PARAMETRIC_STRUCTURE_FORMAT_VERSION, 4);
  assert.equal(one.status, 'RESOLVED');
  assert.equal(one.generatedNodes.length, 5);
  assert.equal(one.authority.documentWrite, false);
  assert.equal(one.authority.historyWrite, false);
  assert.equal(one.authority.revisionWrite, false);
  assert.equal(one.authority.renderer, false);
}

{
  const one = resolveParametricStructure(descriptor());
  const two = resolveParametricStructure(reorderEquivalent(descriptor()));
  assert.deepEqual(one, two, 'reordered equivalent descriptor must normalize identically');
  assert.equal(one.structureFingerprint, two.structureFingerprint);
}

{
  const plan = resolveParametricStructure(descriptor());
  const petalIds = plan.generatedNodes
    .filter(node => node.templateKey === 'petal')
    .map(node => node.nodeId);
  const again = resolveParametricStructure(descriptor()).generatedNodes
    .filter(node => node.templateKey === 'petal')
    .map(node => node.nodeId);
  assert.deepEqual(petalIds, again);
  assert.equal(new Set(petalIds).size, 4);
  assert.ok(petalIds.every(id => id.startsWith('structure-node:structure-flower:petal:')));
}

{
  const plan = resolveParametricStructure(descriptor());
  const petals = plan.generatedNodes
    .filter(node => node.templateKey === 'petal')
    .sort((a, b) => a.index - b.index);
  assert.deepEqual(petals[0].transform.matrix, [1, 0, 0, 1, 0, 0]);
  assert.deepEqual(petals[1].transform.matrix, [1, 0, 0, 1, 10, 0]);
  assert.deepEqual(petals[2].transform.matrix, [1, 0, 0, 1, 20, 0]);
  assert.deepEqual(petals[3].transform.matrix, [1, 0, 0, 1, 30, 0]);
  assert.equal(petals.every(node => node.parentNodeId && node.parentKey === 'core'), true);

  const transform = normalizeStructureTransform({
    translate: [4, 5],
    scale: [2, 3],
    rotateRadians: 0
  });
  assert.deepEqual(transform.matrix, [2, 0, 0, 3, 4, 5]);
}

{
  const bad = descriptor();
  bad.parameters.push({ name: 'unsupported', type: 'vector', required: true });
  bad.values.unsupported = [1, 2];
  const plan = resolveParametricStructure(bad);
  assert.equal(plan.status, 'PARTIAL');
  assert.ok(plan.unresolved.some(item =>
    item.code === 'PARAMETER_TYPE_UNSUPPORTED' && item.parameter === 'unsupported'
  ));
}

{
  const missing = descriptor();
  delete missing.values.petalCount;
  const plan = resolveParametricStructure(missing);
  assert.equal(plan.status, 'PARTIAL');
  assert.equal(plan.generatedNodes.filter(node => node.templateKey === 'petal').length, 0);
  assert.ok(plan.unresolved.some(item => item.code === 'PARAMETER_REQUIRED' && item.parameter === 'petalCount'));
  assert.ok(plan.unresolved.some(item => item.code === 'PARAMETER_REFERENCE_UNRESOLVED'));
}

{
  const bounded = descriptor();
  bounded.values.petalCount = 12;
  expectCode(
    () => resolveParametricStructure(bounded, { limits: { maxNodes: 8 } }),
    'PARAMETRIC_STRUCTURE_NODE_LIMIT_EXCEEDED'
  );

  const invalid = descriptor();
  invalid.nodes.find(node => node.key === 'petal').repeat.count = -1;
  const plan = resolveParametricStructure(invalid);
  assert.equal(plan.status, 'PARTIAL');
  assert.ok(plan.unresolved.some(item => item.code === 'REPEAT_COUNT_INVALID'));
}

{
  const sourceObjects = new Map([
    ['object:core', { id: 'object:core', type: 'path', name: 'Core', matrix: [1, 0, 0, 1, 10, 20] }],
    ['object:petal', { id: 'object:petal', type: 'path', name: 'Petal', matrix: [1, 0, 0, 1, 0, 0] }]
  ]);
  const sourceRegions = new Map([
    ['region:core', { regionId: 'region:core', role: 'outer', status: 'RESOLVED', fingerprint: 'fnv1a32:core' }],
    ['region:petal', { regionId: 'region:petal', role: 'outer', status: 'RESOLVED', fingerprint: 'fnv1a32:petal' }]
  ]);
  const provenance = new Map([
    ['revision:base', { type: 'revision', id: 'revision:base' }],
    ['step:petal', { type: 'recipe-step', id: 'step:petal' }]
  ]);
  const beforeObjects = JSON.stringify([...sourceObjects.entries()]);
  const beforeRegions = JSON.stringify([...sourceRegions.entries()]);
  const beforeProvenance = JSON.stringify([...provenance.entries()]);
  const input = descriptor();
  const inputBefore = JSON.stringify(input);

  const adapter = createParametricStructureAdapter({
    getObject: id => sourceObjects.get(id),
    getSemanticRegion: id => sourceRegions.get(id),
    getProvenanceRef: id => provenance.get(id)
  });
  const plan = adapter.resolve(input);

  assert.equal(plan.status, 'RESOLVED');
  assert.equal(plan.templates.find(node => node.key === 'petal').source.provenanceRefs.length, 2);
  assert.ok(plan.templates.find(node => node.key === 'petal').source.evidence.adapter.some(item => item.objectId === 'object:petal'));
  assert.ok(plan.templates.find(node => node.key === 'petal').source.evidence.adapter.some(item => item.semanticRegionRef === 'region:petal'));
  assert.ok(plan.templates.find(node => node.key === 'petal').source.evidence.adapter.some(item => item.id === 'step:petal'));

  assert.equal(JSON.stringify(input), inputBefore, 'descriptor source must not mutate');
  assert.equal(JSON.stringify([...sourceObjects.entries()]), beforeObjects, 'object provider data must not mutate');
  assert.equal(JSON.stringify([...sourceRegions.entries()]), beforeRegions, 'semantic provider data must not mutate');
  assert.equal(JSON.stringify([...provenance.entries()]), beforeProvenance, 'provenance provider data must not mutate');
}

{
  const adapter = createParametricStructureAdapter({
    getObject: () => null,
    getSemanticRegion: () => null,
    getProvenanceRef: () => null
  });
  const plan = adapter.resolve(descriptor());
  assert.equal(plan.status, 'PARTIAL');
  assert.ok(plan.unresolved.some(item => item.code === 'SOURCE_OBJECT_UNRESOLVED' && item.objectId === 'object:petal'));
  assert.ok(plan.unresolved.some(item => item.code === 'SEMANTIC_REGION_UNRESOLVED' && item.semanticRegionRef === 'region:petal'));
  assert.ok(plan.unresolved.some(item => item.code === 'PROVENANCE_REF_UNRESOLVED' && item.id === 'step:petal'));
  assert.equal(plan.templates.find(node => node.key === 'petal').source.objectId, 'object:petal');
  assert.equal(plan.templates.find(node => node.key === 'petal').source.semanticRegionRef, 'region:petal');
}

{
  const changed = descriptor();
  const before = resolveParametricStructure(changed);
  changed.values.spacing = 99;
  const after = resolveParametricStructure(changed);
  assert.notEqual(before.structureFingerprint, after.structureFingerprint, 'resolved parameter values are fingerprint evidence');
}

{
  const source = readFileSync(new URL('../product/source/src/structure/parametric-structure.js', import.meta.url), 'utf8');
  assert.equal(/\bwindow\./.test(source), false);
  assert.equal(/\bdocument\./.test(source), false);
  assert.equal(/\bfetch\s*\(/.test(source), false);
  assert.equal(/XMLHttpRequest/.test(source), false);
  assert.equal(/WebSocket/.test(source), false);
  assert.equal(/from ['"][^'"]*render[^'"]*['"]/.test(source), false);
  assert.equal(/restoreRevisionDocument\s*\(/.test(source), false);
  assert.equal(/createRevisionRecord\s*\(/.test(source), false);
  assert.equal(/reparentPageObject\s*\(/.test(source), false);
}

console.log('CORE-MOD-005 parametric-structure deterministic tests: PASS');
