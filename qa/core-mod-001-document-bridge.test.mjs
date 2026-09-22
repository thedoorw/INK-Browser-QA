import assert from 'node:assert/strict';
import { buildAIDocumentBridge, createAIDocumentBridgeAdapter, AIDocumentBridgeError } from '../product/source/src/ai/document-bridge.js';

function path(id, role, parentId = null) {
  return {
    id, type: 'path', name: id, ...(parentId ? { parentId } : {}), matrix: [1,0,0,1,0,0],
    subpaths: [{ id: `${id}:sub`, closed: true, anchors: [{ id: `${id}:a1`, x: 0, y: 0 }, { id: `${id}:a2`, x: 10, y: 10 }] }],
    semantic: { role, parent: 'flower', protectedProperties: role === 'flower-center' ? ['geometry'] : [], editableParameters: { fill: '#fff' }, dependencyIds: [], constraintIds: [] }
  };
}

function fixture() {
  const p1 = path('path-a', 'petals.outer', 'group-a');
  const p2 = path('path-b', 'flower-center', 'group-a');
  const group = { id: 'group-a', type: 'group', name: 'Group A', parentId: 'frame-a', matrix: [1,0,0,1,0,0], children: [p2, p1], semantic: { role: 'flower', children: ['path-a', 'path-b'] } };
  const frame = { id: 'frame-a', type: 'frame', name: 'Frame A', matrix: [1,0,0,1,0,0], width: 320, height: 240, children: [group], semantic: { role: 'composition' } };
  return {
    format: 'INK', formatVersion: 4, appVersion: '0.1', id: 'doc-a', title: 'Bridge fixture', activePageId: 'page-a',
    pages: [{ id: 'page-a', name: 'Page A', activeLayerId: 'layer-a', layers: [{ id: 'layer-a', name: 'Layer A', visible: true, locked: false, opacity: 1, objects: [frame] }] }],
    ai: { selection: [{ objectId: 'path-b' }, { objectId: 'path-a' }] },
    semanticModel: { format: 'INK-SEMANTIC-MODEL', version: '1.0', relationshipGraph: { format: 'INK-SEMANTIC-RELATIONSHIP-GRAPH', version: '1.0', nodes: [], edges: [
      { from: 'flower', type: 'parent-of', to: 'path-b' },
      { from: 'flower', type: 'parent-of', to: 'path-a' },
      { from: 'group-a', type: 'groups', to: 'path-a' }
    ] } }
  };
}

function expectCode(fn, code) {
  assert.throws(fn, error => error instanceof AIDocumentBridgeError && error.code === code);
}

{
  const doc = fixture();
  const before = JSON.stringify(doc);
  const one = buildAIDocumentBridge(doc, { revisionId: 'rev:001' });
  const two = buildAIDocumentBridge(doc, { revisionId: 'rev:001' });
  assert.deepEqual(one, two, 'same document must produce identical output');
  assert.equal(one.contextFingerprint, two.contextFingerprint);
  assert.equal(JSON.stringify(doc), before, 'source document must not mutate');
  assert.equal(one.document.formatVersion, 4);
  assert.equal(one.revision.revisionId, 'rev:001');
  assert.deepEqual(one.selection.objectIds, ['path-a', 'path-b']);
  assert.deepEqual(one.objects.map(item => item.ref.objectId), ['frame-a', 'group-a', 'path-a', 'path-b']);
  assert.equal(one.objects.find(item => item.ref.objectId === 'path-a').depth, 2);
  assert.equal(one.objects.find(item => item.ref.objectId === 'path-b').semantic.role, 'flower-center');
  assert.deepEqual(one.objects.find(item => item.ref.objectId === 'path-b').editability.protectedProperties, ['geometry']);
  assert.equal(one.relationships.source, 'semanticModel.relationshipGraph');
  assert.deepEqual(one.relationships.edges.map(edge => `${edge.from}:${edge.type}:${edge.to}`), [
    'flower:parent-of:path-a', 'flower:parent-of:path-b', 'group-a:groups:path-a'
  ]);
}

{
  const doc = fixture();
  doc.semanticModel.relationshipGraph.edges.reverse();
  doc.ai.selection.reverse();
  const a = buildAIDocumentBridge(fixture());
  const b = buildAIDocumentBridge(doc);
  assert.equal(a.contextFingerprint, b.contextFingerprint, 'edge/selection input order must not change canonical context');
  assert.deepEqual(a, b);
}

{
  const doc = fixture();
  const subset = buildAIDocumentBridge(doc, { objectIds: ['path-b'], selectedObjectIds: ['path-b'] });
  assert.deepEqual(subset.objects.map(item => item.ref.objectId), ['path-b']);
  assert.deepEqual(subset.focus.objectIds, ['path-b']);
  assert.deepEqual(subset.selection.objectIds, ['path-b']);
}

{
  const doc = fixture();
  const group = doc.pages[0].layers[0].objects[0].children[0];
  for (let index = 0; index < 40; index += 1) group.children.push(path(`extra-${String(index).padStart(2, '0')}`, 'petals.outer', 'group-a'));
  const bounded = buildAIDocumentBridge(doc, { selectedObjectIds: [], limits: { maxObjects: 5, maxRelationships: 2, maxBytes: 8192 } });
  assert.equal(bounded.objects.length, 5);
  assert.equal(bounded.bounds.objects.truncated, true);
  assert.ok(bounded.relationships.edges.length <= 2);
  assert.ok(bounded.bounds.outputBytes <= 8192);
}

{
  const doc = fixture();
  doc.pages[0].layers[0].visible = false;
  doc.pages[0].layers[0].opacity = 0.5;
  const nested = buildAIDocumentBridge(doc, { objectIds: ['path-a'] });
  assert.equal(nested.objects[0].structure.effectiveVisible, false);
  assert.equal(nested.objects[0].structure.effectiveOpacity, 0.5);
}

{
  const doc = fixture();
  const adapter = createAIDocumentBridgeAdapter({ getDocument: () => doc, getSelectedObjectIds: () => ['path-a'], getRevisionId: () => 'rev:adapter' });
  const payload = adapter.read({ objectIds: ['path-a'] });
  assert.equal(payload.revision.revisionId, 'rev:adapter');
  assert.deepEqual(payload.selection.objectIds, ['path-a']);
  assert.deepEqual(payload.objects.map(item => item.ref.objectId), ['path-a']);
}

{
  const badVersion = fixture();
  badVersion.formatVersion = 5;
  expectCode(() => buildAIDocumentBridge(badVersion), 'AI_DOCUMENT_BRIDGE_FORMAT_VERSION_UNSUPPORTED');

  const duplicate = fixture();
  const group = duplicate.pages[0].layers[0].objects[0].children[0];
  group.children.push(path('path-a', 'petals.inner', 'group-a'));
  expectCode(() => buildAIDocumentBridge(duplicate), 'AI_DOCUMENT_BRIDGE_DUPLICATE_OBJECT_ID');

  const missing = fixture();
  expectCode(() => buildAIDocumentBridge(missing, { objectIds: ['not-there'] }), 'AI_DOCUMENT_BRIDGE_FOCUS_TARGET_MISSING');
}

console.log('CORE-MOD-001 document bridge deterministic tests: PASS');
