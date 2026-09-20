import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');

test('Repaint + Material reuses accepted Path/History/renderer architecture without FORMAT_VERSION change', () => {
  const config = read('product/source/src/config.js');
  const appearance = read('product/source/src/vector/paint-appearance.js');
  const repaint = read('product/source/src/editor/repaint-material.js');
  const editorIndex = read('product/source/src/editor/index.js');
  const model = read('product/source/src/document/model.js');
  const vector = read('product/source/src/vector/vector-core.js');
  const ink = read('product/source/src/ink.js');
  const history = read('product/source/src/history/history.js');
  const serviceWorker = read('product/source/service-worker.js');

  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);

  assert.match(appearance, /INK-PATH-MATERIAL-APPEARANCE/);
  assert.match(appearance, /normalizePathRepaint/);
  assert.match(appearance, /normalizePathMaterialAppearance/);
  assert.match(appearance, /resolvePathPaintAppearance/);
  assert.match(appearance, /ordinary-vector-fallback/);
  assert.match(appearance, /unsupportedMaterialEffect/);

  assert.match(repaint, /PathRepaintMaterialController/);
  assert.match(repaint, /history\.pushScoped/);
  assert.match(repaint, /pathGeometryFingerprint/);
  assert.match(repaint, /HISTORY_BUSY/);
  assert.match(repaint, /LOCKED_TARGET/);
  assert.match(repaint, /HIDDEN_TARGET/);
  assert.match(repaint, /STALE_SELECTION/);
  assert.match(repaint, /SINGULAR_TARGET/);
  assert.match(repaint, /stable\(before\) !== stable\(after\)/);
  assert.match(repaint, /normalizeExpressiveStroke/);
  assert.doesNotMatch(repaint, /rasterize|toDataURL|drawImage|canvas/i);
  assert.doesNotMatch(repaint, /fetch\(|WebSocket|XMLHttpRequest/);

  assert.match(editorIndex, /repaint-material\.js/);
  assert.match(model, /normalizePathMaterialAppearance/);
  assert.match(vector, /resolvePathPaintAppearance/);
  assert.match(vector, /data-ink-material-ref=/);
  assert.match(vector, /data-ink-material-fallback="ordinary-vector"/);
  assert.match(vector, /data-ink-type="path"/);
  assert.doesNotMatch(vector, /materialAppearance[^\n]*<image/);

  assert.match(ink, /installRepaintMaterial/);
  assert.match(ink, /pathRepaintMaterial\.repaint/);
  assert.match(ink, /pathRepaintMaterial\.applyMaterial/);
  assert.match(ink, /pathRepaintMaterial\.removeMaterial/);
  assert.match(ink, /resolvePathPaintAppearance\(o,this\.app\.doc\)/);
  assert.match(ink, /repaint-material-core/);

  assert.match(history, /pushScoped\(label, targets, operation\)/);
  assert.match(history, /if \(!forward\.length\)/);
  assert.match(serviceWorker, /src\/vector\/paint-appearance\.js/);
  assert.match(serviceWorker, /src\/editor\/repaint-material\.js/);
});
