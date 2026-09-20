import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');

test('Expressive Stroke is wired through shared Path/vector/History/serialization source without format or renderer expansion', () => {
  const config = read('product/source/src/config.js');
  const appearance = read('product/source/src/vector/stroke-appearance.js');
  const controller = read('product/source/src/editor/expressive-stroke.js');
  const editorIndex = read('product/source/src/editor/index.js');
  const vector = read('product/source/src/vector/vector-core.js');
  const model = read('product/source/src/document/model.js');
  const integrity = read('product/source/src/document/integrity.js');
  const envelope = read('product/source/src/document/file-envelope.js');
  const ink = read('product/source/src/ink.js');
  const serviceWorker = read('product/source/service-worker.js');
  const shell = read('product/source/index.html');
  const standalone = read('product/source/index-standalone.html');

  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);

  assert.match(editorIndex, /expressive-stroke\.js/);
  assert.match(controller, /PathStrokeAppearanceController/);
  assert.match(controller, /history\.pushScoped|history\?\.pushScoped/);
  assert.match(controller, /pathGeometryFingerprint/);
  assert.match(controller, /IDENTITY_CHANGED/);
  assert.match(controller, /GEOMETRY_CHANGED/);
  assert.match(controller, /METADATA_CHANGED/);
  assert.match(controller, /assignBrushPreset/);
  assert.doesNotMatch(controller, /outlineStroke\s*\(|rasterize|toDataURL|drawImage/);
  assert.doesNotMatch(controller, /composition|repaint/i);

  assert.match(appearance, /EXPRESSIVE_STROKE_VERSION\s*=\s*1/);
  assert.match(appearance, /EXPRESSIVE_STROKE_MAX_PROFILE_SAMPLES\s*=\s*64/);
  assert.match(appearance, /deterministic-vector-approximation/);
  assert.match(appearance, /ordinary-vector/);
  assert.match(appearance, /BUILTIN_BRUSH_PRESETS|expressiveStrokeFromBrushPreset/);
  const normalizationContract = appearance.slice(
    appearance.indexOf('export function normalizeExpressiveStroke'),
    appearance.indexOf('export function validateExpressiveStroke')
  );
  assert.doesNotMatch(normalizationContract, /subpaths\s*:/);
  assert.doesNotMatch(normalizationContract, /anchors\s*:/);

  assert.match(vector, /drawExpressivePathStroke/);
  assert.match(vector, /pathStrokeRenderWidth/);
  assert.match(vector, /drawVectorObject/);
  assert.match(vector, /data-ink-expressive-stroke/);
  assert.match(vector, /data-ink-expressive-fallback=\"ordinary-vector\"/);
  assert.doesNotMatch(vector, /expressiveStroke[\s\S]{0,240}(rasterize|toDataURL)/);

  assert.match(model, /normalizeExpressiveStroke/);
  assert.match(integrity, /validateExpressiveStroke/);
  assert.match(envelope, /EXPRESSIVE_STROKE_EXTENSION/);
  assert.match(envelope, /ink\.path-expressive-stroke\.v1|EXPRESSIVE_STROKE_EXTENSION/);

  assert.match(ink, /installExpressiveStroke/);
  assert.match(ink, /BUILTIN_BRUSH_PRESETS/);
  assert.match(ink, /applyPathExpressiveStrokeFromUI/);
  assert.match(ink, /clearPathExpressiveStroke/);
  assert.match(ink, /pathStrokeControls/);

  assert.match(serviceWorker, /src\/vector\/stroke-appearance\.js/);
  assert.match(serviceWorker, /src\/editor\/expressive-stroke\.js/);

  for (const html of [shell, standalone]) {
    assert.match(html, /id="pathStrokeControls"/);
    assert.match(html, /id="pathStrokePreset"/);
    assert.match(html, /id="pathStrokeWidth"/);
    assert.match(html, /id="pathStrokeTaperStart"/);
    assert.match(html, /id="pathStrokeTaperEnd"/);
    assert.match(html, /id="applyPathStrokeBtn"/);
    assert.match(html, /id="removePathStrokeBtn"/);
  }
});
