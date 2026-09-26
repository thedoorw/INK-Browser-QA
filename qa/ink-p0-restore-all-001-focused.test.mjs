import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../product/source/src/document/model.js';
import { sanitizeDocument } from '../product/source/src/document/migration.js';
import { inspectDocument } from '../product/source/src/document/integrity.js';
import { HistoryManager } from '../product/source/src/history/history.js';
import { InkStore } from '../product/source/src/document/storage.js';
import { createStrokeSession } from '../product/source/src/paint/stroke-session.js';
import { BrushPresetRegistry, createBrushPackage, importBrushPackage } from '../product/source/src/paint/brush-engine.js';
import { IMAGE_CAPABILITIES, applyLayerEffects, compositeImageData, createAdjustment, createFilter, createRasterMask, renderImageStack } from '../product/source/src/image/image-core.js';

const pixels = { width: 2, height: 1, data: new Uint8ClampedArray([80, 100, 120, 255, 20, 30, 40, 255]) };

test('existing image stack, raster mask and color overlay compose without editing source', () => {
  const original = [...pixels.data];
  const stack = renderImageStack(pixels, {
    adjustments: [createAdjustment('brightnessContrast', { brightness: 20 }, { id: 'adjustment' })],
    filters: [createFilter('noiseGrain', { amount: 4, seed: 42 }, { id: 'filter' })],
    mask: createRasterMask(2, 1, [255, 0], { id: 'mask' })
  });
  const effect = applyLayerEffects(stack, [{ type: 'colorOverlay', enabled: true, opacity: 1, params: { color: '#ff0000' } }]);
  assert.deepEqual([...pixels.data], original);
  assert.deepEqual([...effect.data.slice(0, 4)], [255, 0, 0, 255]);
  assert.equal(effect.data[7], 0);
});

test('declared blend modes affect pixel compositing and respect transparent backdrops', () => {
  const base = { width: 1, height: 1, data: new Uint8ClampedArray([80, 120, 160, 255]) };
  const top = { width: 1, height: 1, data: new Uint8ClampedArray([220, 35, 90, 255]) };
  for (const mode of IMAGE_CAPABILITIES.blendModes.filter(item => item !== 'source-over')) {
    const actual = compositeImageData(base, top, { mode });
    assert.notDeepEqual([...actual.data.slice(0, 3)], [...top.data.slice(0, 3)], mode);
  }
  const empty = { width: 1, height: 1, data: new Uint8ClampedArray([0, 0, 0, 0]) };
  const translucent = compositeImageData(empty, top, { mode: 'multiply', opacity: 0.5 });
  assert.deepEqual([...translucent.data.slice(0, 3)], [...top.data.slice(0, 3)]);
  assert.equal(translucent.data[3], 128);
});

test('existing layer stacks and stroke sessions survive History and .ink storage', async () => {
  const app = { doc: defaultDocument(), markDirty() {}, replaceDocument(value) { this.doc = value; }, updateHistoryUI() {} };
  const history = new HistoryManager(app);
  const layer = app.doc.pages[0].layers[0];
  history.pushScoped('save filter and brush recording', [['pages'], ['strokeSessions']], () => {
    layer.adjustments = [createAdjustment('brightnessContrast', { brightness: 12 }, { id: 'a' })];
    layer.filterStack = [createFilter('gaussianBlur', { radius: 1 }, { id: 'f' })];
    layer.mask = createRasterMask(2, 1, [255, 0], { id: 'm' });
    layer.effects = [{ id: 'e', type: 'colorOverlay', params: { color: '#ffaa00' }, enabled: true }];
    app.doc.strokeSessions.push(createStrokeSession({ id: 'session-1', status: 'complete' }));
  });
  assert.equal(history.undo(), true);
  assert.equal(app.doc.pages[0].layers[0].filterStack, undefined);
  assert.equal(app.doc.strokeSessions.length, 0);
  assert.equal(history.redo(), true);
  assert.equal(app.doc.pages[0].layers[0].filterStack[0].type, 'gaussianBlur');
  const store = new InkStore();
  await store.save('ink-p0-restoration', app.doc);
  const loaded = await store.load('ink-p0-restoration');
  assert.equal(loaded.pages[0].layers[0].mask.alpha[1], 0);
  assert.equal(loaded.pages[0].layers[0].effects[0].type, 'colorOverlay');
  assert.equal(loaded.strokeSessions[0].id, 'session-1');
  const sanitized = sanitizeDocument(loaded);
  assert.equal(inspectDocument(sanitized).passed, true);
  assert.equal(sanitized.pages[0].layers[0].filterStack[0].id, 'f');
});

test('existing brush package import is serializable and registry can be rebuilt after Undo/Redo', () => {
  const builtins = new BrushPresetRegistry();
  const pack = createBrushPackage({ id: 'preserved-pack', presets: [builtins.get('watercolor')] });
  const app = { doc: defaultDocument(), markDirty() {}, replaceDocument(value) { this.doc = value; }, updateHistoryUI() {} };
  const history = new HistoryManager(app);
  history.pushScoped('brush import', [['brushPackages']], () => app.doc.brushPackages.push(pack));
  assert.equal(importBrushPackage(app.doc.brushPackages[0], new BrushPresetRegistry([])).imported[0].id, 'watercolor');
  history.undo();
  assert.equal(app.doc.brushPackages.length, 0);
  history.redo();
  const reloaded = sanitizeDocument(JSON.parse(JSON.stringify(app.doc)));
  assert.equal(importBrushPackage(reloaded.brushPackages[0], new BrushPresetRegistry([])).imported[0].id, 'watercolor');
});
