import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import { Matrix } from '../../../../product/source/src/core/index.js';
import {
  createFrame,
  defaultDocument,
  findPageObject,
  inspectDocument,
  migrateDocument,
  reparentPageObject,
  unwrapInkFile,
  wrapInkFile
} from '../../../../product/source/src/document/index.js';
import {
  cloneCompositionObject,
  inspectComposition,
  pathIdentityRecord,
  resolveCompositionSelection
} from '../../../../product/source/src/editor/composition.js';
import { applyWorldTransformBatch } from '../../../../product/source/src/editor/transform.js';
import { normalizeExpressiveStroke } from '../../../../product/source/src/vector/stroke-appearance.js';
import { createPath, pathData, vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));
const ids = path => ({
  object: path.id,
  subpaths: path.subpaths.map(item => item.id),
  anchors: path.subpaths.flatMap(item => item.anchors.map(anchor => anchor.id))
});

function fixturePath(id, referenceObjectId, batchId, x = 0) {
  return createPath({
    id,
    matrix: Matrix.translate(x, 0),
    fill: 'none',
    stroke: '#334455',
    strokeWidth: 2,
    expressiveStroke: normalizeExpressiveStroke({ color: '#8a3154', baseWidth: 7 }),
    metadata: {
      source: 'composition-fixture',
      extraction: {
        schema: 'INK-EXTRACTION/1',
        batchId,
        referenceObjectId,
        source: { name: referenceObjectId + '.png', sha256: 'sha-' + referenceObjectId }
      }
    },
    subpaths: [{
      id: id + ':outer',
      role: 'outer',
      closed: true,
      anchors: [
        { id: id + ':a0', x: 0, y: 0 },
        { id: id + ':a1', x: 40, y: 0 },
        { id: id + ':a2', x: 20, y: 30 }
      ]
    }]
  });
}

test('multiple independently sourced Paths coexist with stable source and path identities', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const a = fixturePath('path-a', 'reference-a', 'batch-a', -60);
  const b = fixturePath('path-b', 'reference-b', 'batch-b', 60);
  layer.objects.push(a, b);

  const diagnostic = inspectComposition(doc.pages[0]);
  assert.equal(diagnostic.pathCount, 2);
  assert.equal(diagnostic.extractedPaths, 2);
  assert.equal(diagnostic.expressivePaths, 2);
  assert.equal(diagnostic.sourceIdentityCount, 2);
  assert.equal(diagnostic.valid, true);
  assert.deepEqual(diagnostic.duplicatePathNodeIds, []);

  assert.equal(pathIdentityRecord(a).source.referenceObjectId, 'reference-a');
  assert.equal(pathIdentityRecord(b).source.referenceObjectId, 'reference-b');
  assert.notEqual(a.id, b.id);
});

test('explicit composition duplicate gets fresh object/subpath/anchor identities while preserving source provenance and appearance', () => {
  const source = fixturePath('path-source', 'reference-source', 'batch-source');
  const before = ids(source);
  const beforeMetadata = clone(source.metadata);
  const beforeD = pathData(source);
  const beforeStyle = clone(source.expressiveStroke);
  let sequence = 0;
  const duplicate = cloneCompositionObject(source, { idFactory: () => 'fresh-' + (++sequence) });
  const after = ids(duplicate);

  assert.notEqual(after.object, before.object);
  assert.equal(new Set([...before.subpaths, ...after.subpaths]).size, before.subpaths.length + after.subpaths.length);
  assert.equal(new Set([...before.anchors, ...after.anchors]).size, before.anchors.length + after.anchors.length);
  assert.equal(pathData(duplicate), beforeD);
  assert.deepEqual(duplicate.expressiveStroke, beforeStyle);
  assert.deepEqual(duplicate.metadata.extraction, beforeMetadata.extraction);
  assert.equal(duplicate.metadata.composition.sourceObjectId, 'path-source');
  assert.equal(duplicate.metadata.composition.duplicatedFromObjectId, 'path-source');
  assert.equal(source.metadata.composition, undefined);
});

test('composition selection guards stale, locked, hidden and singular targets without changing geometry', () => {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  const path = fixturePath('guarded', 'reference-guarded', 'batch-guarded');
  layer.objects.push(path);
  const ref = { layerId: layer.id, objectId: path.id };
  const before = clone(path.subpaths);

  assert.equal(resolveCompositionSelection(page, [ref]).length, 1);
  path.locked = true;
  assert.throws(() => resolveCompositionSelection(page, [ref]), /LOCKED_TARGET/);
  path.locked = false;
  path.visible = false;
  assert.throws(() => resolveCompositionSelection(page, [ref]), /HIDDEN_TARGET/);
  path.visible = true;
  path.matrix = [0, 0, 0, 1, 0, 0];
  assert.throws(() => resolveCompositionSelection(page, [ref]), /SINGULAR_TARGET/);
  path.matrix = Matrix.identity();
  assert.throws(() => resolveCompositionSelection(page, [{ layerId: layer.id, objectId: 'missing' }]), /STALE_SELECTION/);
  assert.deepEqual(path.subpaths, before);
});

test('existing world-transform core composes multiple Paths without flattening or provenance/style mutation', () => {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  const a = fixturePath('transform-a', 'reference-a', 'batch-a', -20);
  const b = fixturePath('transform-b', 'reference-b', 'batch-b', 30);
  layer.objects.push(a, b);
  const refs = [a, b].map(path => ({ layerId: layer.id, objectId: path.id }));
  const found = resolveCompositionSelection(page, refs);
  const geometry = new Map(found.map(item => [item.object.id, pathData(item.object)]));
  const metadata = new Map(found.map(item => [item.object.id, clone(item.object.metadata)]));
  const style = new Map(found.map(item => [item.object.id, clone(item.object.expressiveStroke)]));

  const transform = Matrix.multiply(Matrix.translate(25, -12), Matrix.rotate(Math.PI / 12));
  assert.equal(applyWorldTransformBatch(found.map(item => ({ found: item, transform }))), 2);

  for (const path of [a, b]) {
    assert.equal(pathData(path), geometry.get(path.id));
    assert.deepEqual(path.metadata, metadata.get(path.id));
    assert.deepEqual(path.expressiveStroke, style.get(path.id));
    assert.equal(path.type, 'path');
  }
});

test('existing Frame reparenting preserves Path world geometry, identity and provenance', () => {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  const path = fixturePath('frame-path', 'reference-frame', 'batch-frame', 80);
  const frame = createFrame({ id: 'frame-a', matrix: Matrix.translate(20, 15), width: 180, height: 120 });
  layer.objects.push(path, frame);
  const before = findPageObject(page, path.id);
  const worldBefore = [...before.worldMatrix];
  const identityBefore = pathIdentityRecord(path);
  const dBefore = pathData(path);
  const provenanceBefore = clone(path.metadata.extraction);

  const moved = reparentPageObject(page, path.id, frame.id, { targetLayerId: layer.id });
  assert.equal(moved.parentObject.id, frame.id);
  assert.deepEqual(moved.worldMatrix.map(value => +value.toFixed(10)), worldBefore.map(value => +value.toFixed(10)));
  assert.deepEqual(pathIdentityRecord(moved.object), identityBefore);
  assert.equal(pathData(moved.object), dBefore);
  assert.deepEqual(moved.object.metadata.extraction, provenanceBefore);
});

test('multi-contour composition survives native file roundtrip and structured SVG remains vector Path output', () => {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  const a = fixturePath('roundtrip-a', 'reference-a', 'batch-a', -50);
  const b = fixturePath('roundtrip-b', 'reference-b', 'batch-b', 50);
  const duplicate = cloneCompositionObject(a, { idFactory: (() => { let i = 0; return () => 'roundtrip-fresh-' + (++i); })() });
  duplicate.matrix = Matrix.translate(0, 60);
  layer.objects.push(a, b, duplicate);
  const expected = inspectComposition(doc.pages[0]);
  assert.equal(expected.valid, true);

  const envelope = wrapInkFile(doc);
  const loaded = migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(envelope))));
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(loaded.formatVersion, 4);
  assert.equal(inspectDocument(loaded).passed, true);
  const actual = inspectComposition(loaded.pages[0]);
  assert.equal(actual.pathCount, 3);
  assert.equal(actual.valid, true);
  assert.deepEqual(actual.duplicatePathNodeIds, []);

  for (const path of [a, b, duplicate]) {
    const loadedPath = findPageObject(loaded.pages[0], path.id).object;
    assert.equal(pathData(loadedPath), pathData(path));
    const { semanticLabel, ...loadedMetadata } = loadedPath.metadata;
    assert.equal(semanticLabel, loadedPath.semantic.role);
    assert.deepEqual(loadedMetadata, path.metadata);
    assert.deepEqual(loadedPath.expressiveStroke, path.expressiveStroke);
    const svg = vectorObjectToSVG(loadedPath, []);
    assert.match(svg, /data-ink-type="path"/);
    assert.match(svg, new RegExp('data-ink-id="' + path.id + '"'));
    assert.match(svg, /\sd="/);
    assert.doesNotMatch(svg, /<image\b/);
  }
});
