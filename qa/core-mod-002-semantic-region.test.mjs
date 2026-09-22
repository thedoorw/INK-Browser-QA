import assert from 'node:assert/strict';
import {
  SemanticRegionGroundingError,
  createSemanticRegionGroundingAdapter,
  groundSemanticRegions,
  semanticRegionBridgeContext
} from '../product/source/src/semantic/semantic-region-grounding.js';

const anchor = (id, x, y) => ({ id, x, y, in: { x: 0, y: 0 }, out: { x: 0, y: 0 }, mode: 'corner' });

function rectangle(id, x1, y1, x2, y2, role = 'outer') {
  return {
    id,
    role,
    closed: true,
    anchors: [
      anchor(`${id}:a0`, x1, y1),
      anchor(`${id}:a1`, x2, y1),
      anchor(`${id}:a2`, x2, y2),
      anchor(`${id}:a3`, x1, y2)
    ]
  };
}

function path(id, subpaths, matrix = [1, 0, 0, 1, 0, 0]) {
  return {
    id,
    type: 'path',
    name: id,
    matrix,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
    subpaths,
    semantic: { role: 'shape', confidence: 0.9 },
    metadata: { source: { id: `source:${id}`, name: id, type: 'fixture' } }
  };
}

function fixture() {
  const donut = path('donut', [
    rectangle('outer', 0, 0, 100, 100, 'outer'),
    rectangle('hole', 20, 20, 80, 80, 'hole'),
    rectangle('island', 40, 40, 60, 60, 'outer')
  ]);
  const inner = path('inner', [rectangle('inner:outer', 5, 5, 15, 15)]);
  const overlap = path('overlap', [rectangle('overlap:outer', 90, 90, 120, 120)]);
  const right = path('right', [rectangle('right:outer', 130, 0, 140, 10)]);

  return {
    format: 'INK',
    formatVersion: 4,
    appVersion: '0.1',
    id: 'document:semantic-region',
    title: 'Semantic Region Fixture',
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
        objects: [donut, inner, overlap, right]
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

function regionFor(graph, objectId, predicate = () => true) {
  return graph.regions.find(region => region.ref.objectId === objectId && predicate(region));
}

function edgeExists(graph, from, type, to = null) {
  return graph.relationships.edges.some(edge => edge.from === from && edge.type === type && (to == null || edge.to === to));
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof SemanticRegionGroundingError && error.code === code);
}

{
  const document = fixture();
  const before = JSON.stringify(document);
  const evidence = [{ fromObjectId: 'inner', toObjectId: 'right', relation: 'adjacent', supported: true, evidenceRef: 'fixture:adjacent' }];
  const one = groundSemanticRegions(document, { relationshipEvidence: evidence });
  const two = groundSemanticRegions(document, { relationshipEvidence: evidence });

  assert.deepEqual(one, two, 'same source must produce identical graph output');
  assert.equal(one.fingerprint, two.fingerprint);
  assert.equal(JSON.stringify(document), before, 'grounding must not mutate the source document');
  assert.equal(one.document.formatVersion, 4);

  const donutRegions = one.regions.filter(region => region.ref.objectId === 'donut');
  assert.deepEqual(
    Object.fromEntries(donutRegions.map(region => [region.ref.subpathId, region.role])),
    { hole: 'hole', island: 'island', outer: 'outer' }
  );

  const outerId = regionFor(one, 'donut', region => region.role === 'outer').regionId;
  const innerId = regionFor(one, 'inner').regionId;
  const overlapId = regionFor(one, 'overlap').regionId;
  const rightId = regionFor(one, 'right').regionId;

  assert.equal(edgeExists(one, outerId, 'contains', innerId), true);
  assert.equal(edgeExists(one, innerId, 'inside', outerId), true);
  assert.equal(edgeExists(one, overlapId, 'overlaps'), true);
  assert.equal(edgeExists(one, overlapId, 'intersects'), true);
  assert.equal(edgeExists(one, innerId, 'adjacent', rightId), true);
  assert.equal(edgeExists(one, rightId, 'adjacent', innerId), true);
}

{
  const a = fixture();
  const b = fixture();
  b.pages[0].layers[0].objects.reverse();

  const evidence = [
    { fromObjectId: 'inner', toObjectId: 'right', relation: 'adjacent', supported: true, evidenceRef: 'evidence:a' },
    { fromObjectId: 'inner', toObjectId: 'right', relation: 'gap', supported: true, evidenceRef: 'evidence:b' }
  ];

  const first = groundSemanticRegions(a, { relationshipEvidence: evidence });
  const second = groundSemanticRegions(b, { relationshipEvidence: [...evidence].reverse() });

  assert.deepEqual(first, second, 'object/evidence input order must normalize deterministically');
  assert.equal(first.fingerprint, second.fingerprint);
  assert.deepEqual(
    first.regions.map(region => region.regionId),
    [...first.regions.map(region => region.regionId)].sort()
  );
}

{
  const graph = groundSemanticRegions(fixture(), {
    relationshipEvidence: [{
      fromObjectId: 'donut',
      toObjectId: 'right',
      relation: 'bridge',
      status: 'UNRESOLVED',
      reason: 'fixture-unresolved'
    }]
  });

  assert.equal(graph.relationships.edges.some(edge => edge.type === 'bridge'), false);
  assert.equal(graph.relationships.unresolved.some(item => item.relation === 'bridge' && item.status === 'UNRESOLVED'), true);
}

{
  const graph = groundSemanticRegions(fixture(), { objectIds: ['inner', 'right'] });
  assert.deepEqual(graph.regions.map(region => region.ref.objectId), ['inner', 'right']);

  const context = semanticRegionBridgeContext(graph);
  assert.equal(context.schema, 'INK-AI-DOCUMENT-BRIDGE-SEMANTIC-REGIONS');
  assert.equal(context.documentId, 'document:semantic-region');
  assert.equal(context.pageId, 'page:1');
  assert.equal(context.semanticRegionFingerprint, graph.fingerprint);
  assert.equal(context.semanticRegions.length, 2);

  const adapter = createSemanticRegionGroundingAdapter({
    getDocument: () => fixture(),
    getRelationshipEvidence: () => []
  });
  assert.deepEqual(adapter.read({ objectIds: ['inner'] }), groundSemanticRegions(fixture(), { objectIds: ['inner'], relationshipEvidence: [] }));
  assert.equal(adapter.readBridgeContext({ objectIds: ['inner'] }).semanticRegions.length, 1);
}

{
  const badVersion = fixture();
  badVersion.formatVersion = 5;
  expectCode(() => groundSemanticRegions(badVersion), 'SEMANTIC_REGION_FORMAT_VERSION_UNSUPPORTED');

  const open = fixture();
  open.pages[0].layers[0].objects = [path('open', [{ ...rectangle('open:subpath', 0, 0, 10, 10), closed: false }])];
  expectCode(() => groundSemanticRegions(open), 'SEMANTIC_REGION_REGION_REQUIRES_CLOSED_SUBPATH');

  const duplicate = fixture();
  duplicate.pages[0].layers[0].objects.push(path('inner', [rectangle('duplicate:outer', 200, 200, 210, 210)]));
  expectCode(() => groundSemanticRegions(duplicate), 'SEMANTIC_REGION_DUPLICATE_OBJECT_ID');
}

console.log('CORE-MOD-002 semantic-region deterministic tests: PASS');
