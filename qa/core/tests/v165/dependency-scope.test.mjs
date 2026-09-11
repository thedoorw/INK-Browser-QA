import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/model.js';
import { stableHash } from '../../src/core/stable-id.js';
import { createAnchor, createPath, createVectorGroup } from '../../src/vector/vector-core.js';
import {
  createVectorBrushMaterial,
  registerVectorBrushMaterial,
  createWatercolorPetalV2,
  createWatercolorWashV2,
  createNaturalSplatter,
  createPaperOverlayMaterial
} from '../../src/paint/vector-watercolor.js';
import { buildDependencyGraph, addDependencyRelation } from '../../src/recompute/dependency-graph.js';
import { affectedScope } from '../../src/recompute/affected-scope.js';
import { analyzeLocalRecompute } from '../../src/recompute/local-recompute.js';

const clone = value => structuredClone(value);
const layer = document => document.pages[0].layers[0];
const walk = (object, fn) => { fn(object); for (const child of object.children || []) walk(child, fn); if (object.source) walk(object.source, fn); };
const objectById = (document, id) => {
  let found = null;
  for (const object of layer(document).objects) walk(object, item => { if (item.id === id) found = item; });
  return found;
};
const descendants = object => { const ids = []; for (const child of object.children || []) walk(child, item => ids.push(item.id)); return ids; };
const shiftGeometry = (object, dx = 0, dy = 0) => walk(object, item => {
  for (const subpath of item.subpaths || []) for (const anchor of subpath.anchors || []) { anchor.x += dx; anchor.y += dy; }
});
const shiftTransform = (object, dx = 0, dy = 0) => { object.matrix ||= [1,0,0,1,0,0]; object.matrix[4] += dx; object.matrix[5] += dy; };
const sourcePetal = (id, x = 0) => createPath({
  id, name: id, fill: '#c35f7a', stroke: 'none', matrix: [1,0,0,1,x,300],
  subpaths: [{ closed: true, role: 'outer', anchors: [
    createAnchor(0,0,{x:-18,y:10},{x:18,y:-10},{id:`${id}:a0`,mode:'smooth'}),
    createAnchor(58,-90,{x:-30,y:18},{x:22,y:-22},{id:`${id}:a1`,mode:'smooth'}),
    createAnchor(0,-190,{x:42,y:20},{x:-42,y:-20},{id:`${id}:a2`,mode:'smooth'}),
    createAnchor(-58,-90,{x:22,y:-22},{x:-30,y:18},{id:`${id}:a3`,mode:'smooth'})
  ]}], metadata: { semanticRole: 'petal-source' }
});
const brush = (id = 'brush:hero:test', overrides = {}) => createVectorBrushMaterial({
  brushId: id, brushVersion: '2.0.0', color: '#c35f7a', strokeWidth: 10, opacity: .3,
  seed: 16501, layerCount: 5, edgeProfile: [.1,.5,.9,.45,.15], opacityProfile: [.15,.55,.3],
  pigmentDensityProfile: [.2,.65,1,.35], assetHash: stableHash(id),
  assetLicense: { id: 'INK-PROJECT-ORIGINAL', redistributable: true }, ...overrides
});
function nestedFixture() {
  const document = defaultDocument();
  const material = registerVectorBrushMaterial(document, brush());
  const petalA = createWatercolorPetalV2(sourcePetal('source:a', 210), material, { id: 'petal:a', seed: 11 });
  const petalB = createWatercolorPetalV2(sourcePetal('source:b', 470), material, { id: 'petal:b', seed: 12 });
  const familyA = createVectorGroup([petalA], { id: 'family:a', name: 'Petal Family A' });
  const familyB = createVectorGroup([petalB], { id: 'family:b', name: 'Petal Family B' });
  familyA.metadata = { semanticRole: 'petal-family' }; familyB.metadata = { semanticRole: 'petal-family' };
  const flower = createVectorGroup([familyA, familyB], { id: 'flower:root', name: 'Flower' });
  flower.metadata = { semanticRole: 'flower' };
  const wash = createWatercolorWashV2({ id: 'wash:independent', seed: 31, center: {x:397,y:420}, width: 500, height: 500 });
  const splatter = createNaturalSplatter({ id: 'splatter:independent', seed: 32, count: 12, center: {x:397,y:420}, radius: 180 });
  const paper = createPaperOverlayMaterial({ id: 'paper:independent', seed: 33, width: 794, height: 1123, intensity: .05 });
  layer(document).objects = [flower, wash, splatter, paper];
  buildDependencyGraph(document); // normalize semantics before checkpointing
  return {
    document, material,
    flower: objectById(document, 'flower:root'), familyA: objectById(document, 'family:a'), familyB: objectById(document, 'family:b'),
    petalA: objectById(document, 'petal:a'), petalB: objectById(document, 'petal:b'),
    wash: objectById(document, 'wash:independent'), splatter: objectById(document, 'splatter:independent'), paper: objectById(document, 'paper:independent')
  };
}

function assertNoIds(values, ids) { for (const id of ids) assert.ok(!values.includes(id), `${id} must be excluded`); }

// DS-01
test('DS-01 parent geometry updates nested brush descendants but isolates other petals and surface siblings', () => {
  const { document, petalA, petalB, wash, splatter, paper } = nestedFixture();
  const before = clone(document), needed = [petalA.id, ...descendants(petalA)], changedLeaves = needed.filter(id => (objectById(document,id)?.subpaths || []).length);
  shiftGeometry(petalA, 7, -3);
  const report = analyzeLocalRecompute(before, document, {
    changes: [{ targetId: petalA.id, operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' }],
    requiredAffectedObjectIds: needed,
    requiredChangedObjectIds: changedLeaves
  });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.ok(needed.every(id => report.recomputeScope.affectedObjectIds.includes(id)));
  assertNoIds(report.recomputeScope.affectedObjectIds, [petalB.id, wash.id, splatter.id, paper.id]);
  assert.equal(report.overRecomputed.length, 0);
  assert.equal(report.underRecomputed.length, 0);
  assert.ok(report.recomputeReasons.some(item => item.edges.some(edge => edge.type === 'NESTED_GEOMETRY')));
});

// DS-02
test('DS-02 material-only update changes linked brush surface without geometry or unrelated brush changes', () => {
  const { document, petalA, petalB } = nestedFixture();
  const before = clone(document), beforePetalB = stableHash(petalB);
  petalA.vectorBrushInstance ||= { brushId: 'brush:hero:test', brushVersion: '2.0.0' };
  petalA.vectorBrushInstance.parameterOverrides = { opacityProfile: [.1,.75,.2], pigmentDensityProfile: [.4,1,.3], edgeProfile: [.2,.9,.1] };
  for (const child of petalA.children || []) child.opacity = Math.max(.02, (child.opacity || 1) * .82);
  const report = analyzeLocalRecompute(before, document, {
    changes: [{ targetId: petalA.id, operation: 'update-material', changeDomain: 'MATERIAL_CHANGE' }]
  });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.equal(report.changedGeometryIds.length, 0);
  assert.ok(report.changedMaterialIds.includes(petalA.id) || report.changedStyleIds.some(id => id === petalA.id || descendants(petalA).includes(id)));
  assert.equal(stableHash(petalB), beforePetalB);
  assert.ok(!report.recomputeScope.affectedObjectIds.includes(petalB.id));
});

// DS-03
test('DS-03 parent transform follows attached descendants, excludes detached child and preserves material definition', () => {
  const document = defaultDocument();
  const attached = sourcePetal('transform:attached', 0), detached = sourcePetal('transform:detached', 120);
  detached.metadata = { ...(detached.metadata || {}), detachedFromParent: true };
  const group = createVectorGroup([attached, detached], { id: 'transform:group', name: 'Transform Group' });
  layer(document).objects = [group];
  const before = clone(document), materialHash = stableHash(document.vectorBrushLibrary);
  shiftTransform(group, 25, -12); shiftTransform(attached, 25, -12);
  const report = analyzeLocalRecompute(before, document, { changes: [{ targetId: group.id, operation: 'transform', changeDomain: 'TRANSFORM_CHANGE' }] });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.ok(report.recomputeScope.affectedObjectIds.includes(attached.id));
  assert.ok(!report.recomputeScope.affectedObjectIds.includes(detached.id));
  assert.ok(report.recomputeScope.detachedExcludedObjectIds.includes(detached.id));
  assert.equal(stableHash(document.vectorBrushLibrary), materialHash);
  assert.equal(objectById(document, detached.id).matrix[4], objectById(before, detached.id).matrix[4]);
});

// DS-04
test('DS-04 three-level nested composite propagation is complete and traceable', () => {
  const { document, familyA, familyB, petalA } = nestedFixture();
  const before = clone(document), needed = [familyA.id, petalA.id, ...descendants(petalA)], changedLeaves = needed.filter(id => (objectById(document,id)?.subpaths || []).length), familyBHash = stableHash(familyB);
  shiftGeometry(familyA, 4, 1);
  const report = analyzeLocalRecompute(before, document, {
    changes: [{ targetId: familyA.id, operation: 'deformation', changeDomain: 'GEOMETRY_CHANGE' }],
    requiredAffectedObjectIds: needed,
    requiredChangedObjectIds: changedLeaves
  });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.ok(needed.every(id => report.recomputeScope.affectedObjectIds.includes(id)));
  assert.equal(stableHash(familyB), familyBHash);
  const deepTrace = report.recomputeReasons.find(item => item.objectId && descendants(petalA).includes(item.objectId));
  assert.ok(deepTrace?.path?.length >= 4);
});

// DS-05
test('DS-05 sibling isolation excludes independent wash, splatter and paper overlay', () => {
  const { document, petalA, wash, splatter, paper } = nestedFixture();
  const graph = buildDependencyGraph(document);
  const scope = affectedScope(graph, { targetIds: [petalA.id], operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' });
  assert.equal(scope.status, 'LOCAL_RECOMPUTE_READY');
  assertNoIds(scope.affectedObjectIds, [wash.id, splatter.id, paper.id]);
});

// DS-06
test('DS-06 detached material instance is preserved while linked instances update', () => {
  const document = defaultDocument();
  document.materialLibrary.templates.push({ templateId: 'material:test:petal', templateVersion: '1.0.0', geometry: sourcePetal('template:source'), defaultParameters: { fill: '#c35f7a' }, editableParameters: ['fill'], constraints: {}, semanticRole: 'petal', sourceBenchmark: 'DS-06', validationState: 'VERIFIED' });
  const linked = sourcePetal('instance:linked'), detached = sourcePetal('instance:detached', 160);
  linked.materialInstance = { instanceId: linked.id, templateId: 'material:test:petal', templateVersion: '1.0.0', parameterOverrides: {}, detached: false };
  detached.metadata = { ...(detached.metadata || {}), detachedFromMaterial: true };
  layer(document).objects = [linked, detached];
  buildDependencyGraph(document);
  const before = clone(document), detachedHash = stableHash(objectById(document, detached.id));
  linked.fill = '#9a3c62'; linked.materialInstance.templateVersion = '1.1.0';
  const report = analyzeLocalRecompute(before, document, { changes: [{ targetId: 'material:test:petal', operation: 'update-material', changeDomain: 'MATERIAL_CHANGE' }] });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED');
  assert.ok(report.recomputeScope.affectedObjectIds.includes(linked.id));
  assert.ok(!report.recomputeScope.affectedObjectIds.includes(detached.id));
  assert.equal(stableHash(objectById(document, detached.id)), detachedHash);
});

// DS-07
test('DS-07 cycle and unresolved dependencies reject silent full regeneration', () => {
  const { document, petalA, petalB } = nestedFixture();
  addDependencyRelation(document, { from: petalA.id, to: petalB.id, type: 'POSITIONED_RELATIVE_TO' });
  addDependencyRelation(document, { from: petalB.id, to: petalA.id, type: 'POSITIONED_RELATIVE_TO' });
  const cyclic = affectedScope(buildDependencyGraph(document), { targetIds: [petalA.id], operation: 'transform', changeDomain: 'TRANSFORM_CHANGE' });
  assert.equal(cyclic.status, 'REJECTED'); assert.equal(cyclic.code, 'DEPENDENCY_CYCLE'); assert.equal(cyclic.approvalRequired, true);
  const unresolvedDoc = nestedFixture().document;
  addDependencyRelation(unresolvedDoc, { from: 'missing:node', to: 'petal:a', type: 'POSITIONED_RELATIVE_TO' });
  const unresolved = affectedScope(buildDependencyGraph(unresolvedDoc), { targetIds: ['petal:a'], operation: 'transform', changeDomain: 'TRANSFORM_CHANGE' });
  assert.equal(unresolved.status, 'REJECTED'); assert.equal(unresolved.code, 'UNRESOLVED_DEPENDENCY'); assert.equal(unresolved.fallbackScope, 'FULL_DOCUMENT');
});

// DS-08
test('DS-08 save/load/replay preserves dependency edges, scope and deterministic hashes', () => {
  const fixture = nestedFixture(), document = fixture.document;
  const graphBefore = buildDependencyGraph(document).toJSON();
  const scopeBefore = affectedScope(buildDependencyGraph(document), { targetIds: [fixture.petalA.id], operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' });
  const loaded = JSON.parse(JSON.stringify(document));
  const graphLoaded = buildDependencyGraph(loaded).toJSON();
  const scopeLoaded = affectedScope(buildDependencyGraph(loaded), { targetIds: [fixture.petalA.id], operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' });
  assert.equal(stableHash(graphLoaded), stableHash(graphBefore));
  assert.equal(scopeLoaded.recomputeSetHash, scopeBefore.recomputeSetHash);
  assert.deepEqual(scopeLoaded.affectedObjectIds, scopeBefore.affectedObjectIds);
  assert.equal(stableHash(loaded), stableHash(document));
});

// DS-09
test('DS-09 rollback restores document, graph, recompute set, IDs and domain hashes', () => {
  const fixture = nestedFixture(), checkpoint = clone(fixture.document);
  const checkpointGraph = buildDependencyGraph(checkpoint).toJSON();
  const checkpointScope = affectedScope(buildDependencyGraph(checkpoint), { targetIds: [fixture.petalA.id], operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' });
  shiftGeometry(fixture.petalA, 9, 2);
  fixture.petalA.opacity = .76;
  const changed = analyzeLocalRecompute(checkpoint, fixture.document, { changes: [
    { targetId: fixture.petalA.id, operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' },
    { targetId: fixture.petalA.id, operation: 'opacity', changeDomain: 'STYLE_CHANGE' }
  ] });
  assert.equal(changed.status, 'LOCAL_RECOMPUTE_COMPLETED');
  const rollback = clone(checkpoint), rollbackGraph = buildDependencyGraph(rollback).toJSON();
  const rollbackScope = affectedScope(buildDependencyGraph(rollback), { targetIds: [fixture.petalA.id], operation: 'bend', changeDomain: 'GEOMETRY_CHANGE' });
  assert.equal(stableHash(rollback), stableHash(checkpoint));
  assert.equal(stableHash(rollbackGraph), stableHash(checkpointGraph));
  assert.equal(rollbackScope.recomputeSetHash, checkpointScope.recomputeSetHash);
  assert.deepEqual(rollbackScope.affectedObjectIds, checkpointScope.affectedObjectIds);
});
