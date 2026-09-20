import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');

test('Multi-Contour Composition reuses accepted transform/hierarchy/History and keeps editable Path identity contracts', () => {
  const config = read('product/source/src/config.js');
  const composition = read('product/source/src/editor/composition.js');
  const editorIndex = read('product/source/src/editor/index.js');
  const transform = read('product/source/src/editor/transform.js');
  const hierarchy = read('product/source/src/document/hierarchy.js');
  const ink = read('product/source/src/ink.js');
  const extraction = read('product/source/src/extraction/workspace.js');
  const vector = read('product/source/src/vector/vector-core.js');
  const serviceWorker = read('product/source/service-worker.js');

  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.match(editorIndex, /composition\.js/);
  assert.match(serviceWorker, /src\/editor\/composition\.js/);

  assert.match(composition, /pathSourceIdentity/);
  assert.match(composition, /cloneCompositionObject/);
  assert.match(composition, /regenerateCompositionIds/);
  assert.match(composition, /resolveCompositionSelection/);
  assert.match(composition, /inspectComposition/);
  assert.match(composition, /duplicatedFromObjectId/);
  assert.match(composition, /sourceObjectId/);
  assert.match(composition, /subpath\.id\s*=\s*freshId/);
  assert.match(composition, /anchor\.id\s*=\s*freshId/);
  assert.doesNotMatch(composition, /rasterize|toDataURL|drawImage|canvas/i);

  assert.match(transform, /applyWorldTransformBatch/);
  assert.match(transform, /applyObjectMatrices/);
  assert.match(transform, /Matrix\.toLocal|localMatrixFromWorld/);
  assert.match(hierarchy, /reparentPageObject/);
  assert.match(hierarchy, /hierarchyLocalMatrix/);

  assert.match(ink, /compositionTransformObjects/);
  assert.match(ink, /resolveCompositionSelection/);
  assert.match(ink, /regenerateCompositionIds/);
  assert.match(ink, /history\.pushScoped\('複製物件'/);
  assert.match(ink, /reorderSelection\(where\)/);
  assert.match(ink, /history\.pushScoped\(where==='front'/);
  assert.match(ink, /groupSelection\(\)/);
  assert.match(ink, /reparentPageObject/);
  assert.match(ink, /frameSelection/);
  assert.match(ink, /multi-contour-composition/);
  assert.match(ink, /vectorObjectToSVG/);
  assert.match(ink, /o\.type==='path'\)return vectorObjectToSVG\(o,defs\)/);

  assert.match(extraction, /batchId=uid\(\)/);
  assert.match(extraction, /referenceObjectId:referenceId,batchId/);
  assert.match(vector, /data-ink-type="path"/);
  assert.match(vector, /data-ink-expressive-fallback="ordinary-vector"/);

  assert.doesNotMatch(composition, /repaint|material/i);
  assert.doesNotMatch(composition, /fetch\(|WebSocket|XMLHttpRequest/);
});
