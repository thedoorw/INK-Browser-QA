import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { migrateDocument } from '../../src/document/migration.js';
import { Matrix } from '../../src/core/math.js';
import { stableHash } from '../../src/core/stable-id.js';
import {
  createMaterialInstance, detachMaterialInstance, findObjectEntry, installFlowerBatch01Templates,
  materialLibraryReport, reparentObject, updateMaterialInstance, updateMaterialTemplate
} from '../../src/material/index.js';
import { createRepeat, updateRepeatCount, updateRepeatParameters, vectorObjectToSVG } from '../../src/vector/vector-core.js';
import { repeatIdentityReport } from '../../src/repeat/repeat-identity.js';
import {
  addDependencyRelation, buildDependencyGraph, removeDependencyRelation, setParentRelation
} from '../../src/recompute/dependency-graph.js';
import { affectedScope } from '../../src/recompute/affected-scope.js';
import { analyzeLocalRecompute } from '../../src/recompute/local-recompute.js';
import { RecipeEngine } from '../../src/recipe/recipe-engine.js';

const page = document => document.pages[0];
const objects = document => page(document).layers[0].objects;
const get = (document, id) => findObjectEntry(document, id)?.object;

function templateDocument() {
  const document = defaultDocument();
  installFlowerBatch01Templates(document);
  return document;
}

function createRing(document, { templateId = 'material:flower:petal-rounded', sourceId, generatorId, count = 12, ringIndex = 0, role = 'petals.outer', center = { x: 397, y: 397 }, transform = [1,0,0,1,397,397] } = {}) {
  const source = createMaterialInstance(document, templateId, { instanceId: sourceId, transform, semanticRole: role });
  const repeat = createRepeat(source, { id: generatorId, name: generatorId, mode: 'radial', count, center, ringIndex, semanticRole: role, recipeVersion: '1.6.2', sourceMaterialInstanceId: source.id });
  objects(document).push(repeat);
  return { source, repeat };
}

test('Material Template and Instance are native, parameterized, versioned, replayable and detachable', () => {
  const document = templateDocument(), report = materialLibraryReport(document);
  assert.equal(report.templateCount, 10);
  const pointed = createMaterialInstance(document, 'material:flower:petal-pointed', { instanceId: 'petal-a', transform: Matrix.translate(200, 400) });
  const linked = createMaterialInstance(document, 'material:flower:petal-pointed', { instanceId: 'petal-b', transform: Matrix.translate(400, 400) });
  assert.equal(pointed.materialInstance.templateId, 'material:flower:petal-pointed');
  assert.notEqual(pointed.id, linked.id);
  const linkedBefore = stableHash(linked);
  updateMaterialInstance(document, pointed.id, { parameterOverrides: { length: 220, bend: 18 } });
  assert.equal(pointed.materialInstance.effectiveParameters.length, 220);
  assert.equal(stableHash(linked), linkedBefore);
  const detachedGeometry = stableHash(linked.children);
  detachMaterialInstance(document, linked.id);
  const update = updateMaterialTemplate(document, 'material:flower:petal-pointed', { templateVersion: '1.1.0', defaultParameters: { fill: '#aa4466' } });
  assert.deepEqual(update.updatedInstanceIds, ['petal-a']);
  assert.equal(pointed.materialInstance.templateVersion, '1.1.0');
  assert.equal(stableHash(linked.children), detachedGeometry);
  assert.equal(linked.materialInstance, undefined);
  const reopened = migrateDocument(JSON.parse(JSON.stringify(document)));
  assert.equal(reopened.materialLibrary.templates.length, 10);
  assert.equal(get(reopened, 'petal-a').materialInstance.templateVersion, '1.1.0');
  assert.equal(get(reopened, 'petal-b').metadata.detachedFromMaterial.templateVersion, '1.0.0');
});

test('Material operations use the existing Recipe runtime and rollback restores the original document', () => {
  const app = { doc: templateDocument(), replaceDocument(value) { this.doc = structuredClone(value); }, markDirty() {}, refreshAll() {} };
  const engine = new RecipeEngine({ app });
  engine.registerRoleSchema({ id: 'ink.material.test', roles: [] });
  const recipe = {
    id: 'recipe-material-v162', name: 'Material Recipe', version: 1, roleSchema: 'ink.material.test', parameters: {},
    steps: [
      { id: 'instance', op: 'material', params: { action: 'create-instance', templateId: 'material:flower:leaf-lanceolate', instanceId: 'recipe-leaf', parameterOverrides: { bend: 30 }, transform: [1,0,0,1,250,430] } },
      { id: 'override', op: 'material', params: { action: 'update-instance', instanceId: 'recipe-leaf', parameterOverrides: { length: 180 } } },
      { id: 'checkpoint', op: 'checkpoint', checkpoint: true, params: {} }
    ]
  };
  const before = stableHash(app.doc), run = engine.execute(recipe, { document: app.doc, inputs: [] });
  assert.equal(run.status, 'completed');
  assert.equal(get(app.doc, 'recipe-leaf').materialInstance.effectiveParameters.length, 180);
  engine.rollback(run.id);
  assert.equal(stableHash(app.doc), before);
});

test('Repeat Instance Stable IDs survive replay, count increase/decrease and ring-specific updates', () => {
  const document = templateDocument();
  const { repeat: outer } = createRing(document, { sourceId: 'outer-source', generatorId: 'outer-ring', count: 12, ringIndex: 0, role: 'petals.outer' });
  const original = structuredClone(outer), originalIds = outer.instances.map(item => item.instanceId), originalSvg = vectorObjectToSVG(outer, []);
  assert.equal(new Set(originalIds).size, 12);
  const rerun = createRepeat(outer.source, { id: 'outer-ring', count: 12, center: outer.center, ringIndex: 0, semanticRole: 'petals.outer', recipeVersion: '1.6.2', sourceObjectId: outer.sourceObjectId });
  assert.deepEqual(rerun.instances.map(item => item.instanceId), originalIds);
  assert.equal(vectorObjectToSVG(rerun, []), originalSvg);
  updateRepeatCount(outer, 16);
  const increased = structuredClone(outer), increaseReport = repeatIdentityReport(original, increased);
  assert.deepEqual(increaseReport.preserved, originalIds);
  assert.equal(increaseReport.added.length, 4);
  updateRepeatCount(outer, 10);
  const decreaseReport = repeatIdentityReport(increased, outer);
  assert.equal(decreaseReport.preserved.length, 10);
  assert.equal(decreaseReport.removed.length, 6);
  assert.deepEqual(outer.instances.map(item => item.instanceId), originalIds.slice(0, 10));

  const { repeat: inner } = createRing(document, { templateId: 'material:flower:petal-inner-tight', sourceId: 'inner-source', generatorId: 'inner-ring', count: 8, ringIndex: 1, role: 'petals.inner' });
  const outerHash = stableHash(outer), innerBefore = structuredClone(inner);
  updateRepeatParameters(inner, { count: 11, startAngle: 8 });
  assert.equal(stableHash(outer), outerHash);
  assert.equal(repeatIdentityReport(innerBefore, inner).preserved.length, 8);
});

test('Template modification updates linked repeat source without replacing generator or instance identities', () => {
  const document = templateDocument();
  const { source, repeat } = createRing(document, { sourceId: 'repeat-linked-source', generatorId: 'repeat-linked', count: 12 });
  const beforeIds = repeat.instances.map(item => item.instanceId), sourceHash = stableHash(repeat.source);
  updateMaterialInstance(document, source.id, { parameterOverrides: { length: 170 } });
  assert.notEqual(stableHash(repeat.source), sourceHash);
  assert.deepEqual(repeat.instances.map(item => item.instanceId), beforeIds);
  const beforeTemplate = stableHash(repeat.source);
  updateMaterialTemplate(document, 'material:flower:petal-rounded', { templateVersion: '1.1.0', defaultParameters: { fill: '#c85d7d' } });
  assert.notEqual(stableHash(repeat.source), beforeTemplate);
  assert.deepEqual(repeat.instances.map(item => item.instanceId), beforeIds);
  assert.equal(repeat.templateVersion, '1.1.0');
});

test('Hierarchy and Dependency Graph persist supported relations, produce topological order and reject cycles', () => {
  const document = templateDocument();
  const stem = createMaterialInstance(document, 'material:flower:stem-curved', { instanceId: 'stem-parent', transform: Matrix.translate(397, 700) });
  const left = createMaterialInstance(document, 'material:flower:leaf-lanceolate', { instanceId: 'leaf-left', transform: Matrix.translate(0, -160) });
  reparentObject(document, left.id, stem.id); setParentRelation(document, left.id, stem.id);
  const bud = createMaterialInstance(document, 'material:flower:bud', { instanceId: 'bud-child', parentId: stem.id, transform: Matrix.translate(0, -315) });
  setParentRelation(document, bud.id, stem.id);
  addDependencyRelation(document, { from: 'stem-parent', to: 'bud-child', type: 'POSITIONED_RELATIVE_TO' });
  addDependencyRelation(document, { from: 'stem-parent', to: 'leaf-left', type: 'CHILD_OF', metadata: { inverseLabel: true } });
  const graph = buildDependencyGraph(document), topology = graph.topologicalOrder();
  assert.equal(topology.status, 'ORDERED');
  assert.ok(graph.edges.some(edge => edge.type === 'PARENT_OF'));
  assert.ok(graph.edges.some(edge => edge.type === 'INSTANCE_OF'));
  assert.ok(graph.edges.some(edge => edge.type === 'POSITIONED_RELATIVE_TO'));
  assert.equal(removeDependencyRelation(document, { from: 'stem-parent', to: 'leaf-left', type: 'CHILD_OF' }), 1);
  addDependencyRelation(document, { from: 'leaf-left', to: 'stem-parent', type: 'POSITIONED_RELATIVE_TO' });
  const cyclic = buildDependencyGraph(document);
  assert.ok(cyclic.cycles.length > 0);
  const scope = affectedScope(cyclic, { targetIds: ['stem-parent'], operation: 'transform' });
  assert.equal(scope.status, 'REJECTED');
  assert.equal(scope.code, 'DEPENDENCY_CYCLE');
  assert.equal(scope.approvalRequired, true);
});

test('Dependency-driven Partial Recompute preserves unrelated ring, center, right leaf and flower crown', () => {
  const document = templateDocument();
  const { source: outerSource, repeat: outer } = createRing(document, { sourceId: 'outer-source', generatorId: 'outer-ring', count: 12, ringIndex: 0, role: 'petals.outer' });
  const { repeat: inner } = createRing(document, { templateId: 'material:flower:petal-inner-tight', sourceId: 'inner-source', generatorId: 'inner-ring', count: 9, ringIndex: 1, role: 'petals.inner' });
  const center = createMaterialInstance(document, 'material:flower:center-disk', { instanceId: 'flower-center', transform: Matrix.translate(397, 397) });
  addDependencyRelation(document, { from: 'flower-center', to: 'outer-ring', type: 'SHARES_CENTER_WITH' });
  addDependencyRelation(document, { from: 'flower-center', to: 'inner-ring', type: 'SHARES_CENTER_WITH' });
  const before = structuredClone(document), innerHash = stableHash(inner), centerHash = stableHash(center);
  updateMaterialInstance(document, outerSource.id, { parameterOverrides: { length: 164 } });
  const report = analyzeLocalRecompute(before, document, { targets: [outerSource.id], parsedIntent: { operations: [{ operation: 'resize' }] } });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.ok(report.changedObjectIds.includes(outerSource.id));
  assert.ok(report.changedObjectIds.includes(outer.id));
  assert.equal(stableHash(inner), innerHash);
  assert.equal(stableHash(center), centerHash);
  assert.ok(report.preservedObjectIds.includes('inner-ring'));
  assert.ok(report.preservedGeometryHashes['flower-center']);

  const plant = templateDocument();
  const stem = createMaterialInstance(plant, 'material:flower:stem-curved', { instanceId: 'plant-stem', transform: Matrix.translate(397, 700) });
  const left = createMaterialInstance(plant, 'material:flower:leaf-lanceolate', { instanceId: 'plant-leaf-left', parentId: stem.id, transform: Matrix.translate(0, -150) });
  const right = createMaterialInstance(plant, 'material:flower:leaf-broad', { instanceId: 'plant-leaf-right', parentId: stem.id, transform: Matrix.translate(0, -220) });
  const crown = createMaterialInstance(plant, 'material:flower:center-disk', { instanceId: 'plant-crown', transform: Matrix.translate(397, 350) });
  setParentRelation(plant, left.id, stem.id); setParentRelation(plant, right.id, stem.id);
  const plantBefore = structuredClone(plant), rightHash = stableHash(right), crownHash = stableHash(crown);
  updateMaterialInstance(plant, left.id, { parameterOverrides: { bend: 42 } });
  const leafReport = analyzeLocalRecompute(plantBefore, plant, { targets: [left.id], parsedIntent: { operations: [{ operation: 'bend' }] } });
  assert.equal(leafReport.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.equal(stableHash(right), rightHash);
  assert.equal(stableHash(crown), crownHash);
  assert.ok(leafReport.preservedObjectIds.includes('plant-leaf-right'));
  assert.ok(leafReport.preservedObjectIds.includes('plant-crown'));
});

test('Dependency graph incomplete state refuses silent full-document fallback', () => {
  const document = templateDocument();
  createMaterialInstance(document, 'material:flower:leaf-lanceolate', { instanceId: 'leaf-a' });
  addDependencyRelation(document, { from: 'missing-source', to: 'leaf-a', type: 'POSITIONED_RELATIVE_TO' });
  const graph = buildDependencyGraph(document), scope = affectedScope(graph, { targetIds: ['leaf-a'], operation: 'bend' });
  assert.equal(scope.status, 'REJECTED');
  assert.equal(scope.code, 'UNRESOLVED_DEPENDENCY');
  assert.equal(scope.fallbackScope, 'FULL_DOCUMENT');
  assert.equal(scope.approvalRequired, true);
});

test('Repeat, hierarchy and dependency state survive save/load; rollback restores IDs and unique SVG identities', () => {
  const document = templateDocument();
  const { repeat } = createRing(document, { sourceId: 'saved-source', generatorId: 'saved-ring', count: 12, ringIndex: 2, role: 'petals.outer' });
  const center = createMaterialInstance(document, 'material:flower:center-disk', { instanceId: 'saved-center', transform: Matrix.translate(397, 397) });
  addDependencyRelation(document, { from: center.id, to: repeat.id, type: 'SHARES_CENTER_WITH' });
  const checkpoint = JSON.stringify(document), canonicalCheckpoint = migrateDocument(JSON.parse(checkpoint)), checkpointHash = stableHash(canonicalCheckpoint), ids = repeat.instances.map(item => item.instanceId);
  const reopened = migrateDocument(JSON.parse(checkpoint)), reopenedRepeat = get(reopened, 'saved-ring');
  assert.deepEqual(reopenedRepeat.instances.map(item => item.instanceId), ids);
  assert.equal(buildDependencyGraph(reopened).topologicalOrder().status, 'ORDERED');
  const svg = vectorObjectToSVG(reopenedRepeat, []), svgIds = [...svg.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(svgIds).size, svgIds.length);
  updateRepeatCount(reopenedRepeat, 16);
  assert.equal(repeatIdentityReport(repeat, reopenedRepeat).preserved.length, 12);
  const rolledBack = migrateDocument(JSON.parse(checkpoint));
  assert.equal(stableHash(rolledBack), checkpointHash);
  assert.deepEqual(get(rolledBack, 'saved-ring').instances.map(item => item.instanceId), ids);
});
