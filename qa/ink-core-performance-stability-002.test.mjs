import test from 'node:test';
import assert from 'node:assert/strict';

import { installRenderer } from '../product/source/src/studio-core.js';

function withImageHarness(run) {
  const previousDocument = globalThis.document;
  const previousImageData = globalThis.ImageData;
  let sourceReads = 0;
  let processedWrites = 0;

  class TestImageData {
    constructor(data, width, height) {
      this.data = data;
      this.width = width;
      this.height = height;
    }
  }

  const sourceImage = { complete: true, naturalWidth: 12, naturalHeight: 10 };
  const createCanvas = () => {
    const canvas = { width: 0, height: 0 };
    canvas.getContext = () => ({
      drawImage() {},
      getImageData(_x, _y, width, height) {
        sourceReads += 1;
        const data = new Uint8ClampedArray(width * height * 4);
        for (let index = 0; index < width * height; index += 1) {
          data[index * 4] = (index * 13) % 256;
          data[index * 4 + 1] = (index * 7) % 256;
          data[index * 4 + 2] = (index * 3) % 256;
          data[index * 4 + 3] = 255;
        }
        return { width, height, data };
      },
      putImageData() { processedWrites += 1; }
    });
    return canvas;
  };

  globalThis.document = { createElement: type => {
    assert.equal(type, 'canvas');
    return createCanvas();
  }};
  globalThis.ImageData = TestImageData;

  const renderer = {
    drawObject() {},
    objectWorldBounds() { return { x: 0, y: 0, w: 1, h: 1 }; },
    drawLayerObjects() {},
    drawImage() {},
    drawSelectionOverlay() {},
    getImage() { return sourceImage; },
    dpr: 1,
    worldToScreen(point) { return point; }
  };
  const app = {
    renderer,
    doc: { modifiedAt: 'doc-1', components: { definitions: [] } },
    objectToSVG() { return ''; },
    hitObject() { return false; },
    page() { return { id: 'page-1' }; },
    selectedObjects() { return []; }
  };
  installRenderer(app);

  const ctx = { drawImage() {} };
  const image = {
    id: 'image-1',
    type: 'image',
    src: 'asset://stable-source',
    w: 12,
    h: 10,
    adjustments: [{
      id: 'adjustment-1',
      type: 'brightnessContrast',
      params: { brightness: 8, contrast: 12 },
      enabled: true,
      opacity: 1,
      mask: null
    }],
    filterStack: [{
      id: 'filter-1',
      type: 'gaussianBlur',
      params: { radius: 1 },
      enabled: true,
      opacity: 1,
      mask: null
    }],
    effects: [],
    rasterMask: null
  };

  try {
    return run({ app, renderer, ctx, image, counters: () => ({ sourceReads, processedWrites }) });
  } finally {
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
    if (previousImageData === undefined) delete globalThis.ImageData;
    else globalThis.ImageData = previousImageData;
  }
}

test('external image stack survives unrelated document modifiedAt changes', () => {
  withImageHarness(({ app, renderer, ctx, image, counters }) => {
    renderer.drawImage(ctx, image);
    assert.deepEqual(counters(), { sourceReads: 1, processedWrites: 1 });
    assert.equal(renderer.studioImageCache.size, 1);

    app.doc.modifiedAt = 'doc-2';
    renderer.drawImage(ctx, image);

    assert.deepEqual(counters(), { sourceReads: 1, processedWrites: 1 });
    assert.equal(renderer.studioImageCache.size, 1);
  });
});

test('external image stack cache still invalidates on stack mutation', () => {
  withImageHarness(({ app, renderer, ctx, image, counters }) => {
    renderer.drawImage(ctx, image);
    app.doc.modifiedAt = 'unrelated-doc-change';
    image.adjustments[0].params.brightness = 9;
    renderer.drawImage(ctx, image);

    assert.deepEqual(counters(), { sourceReads: 2, processedWrites: 2 });
    assert.equal(renderer.studioImageCache.size, 2);
  });
});

test('external image stack cache still invalidates when source identity changes', () => {
  withImageHarness(({ renderer, ctx, image, counters }) => {
    renderer.drawImage(ctx, image);
    image.src = 'asset://different-source';
    renderer.drawImage(ctx, image);

    assert.deepEqual(counters(), { sourceReads: 2, processedWrites: 2 });
    assert.equal(renderer.studioImageCache.size, 2);
  });
});

test('raster-state image cache keeps document modifiedAt in its request identity', () => {
  const source = String(installRenderer);
  assert.match(
    source,
    /hasRasterState\?app\.doc\.modifiedAt:null/,
    'raster-state render identity must retain document timestamp invalidation for History restoration'
  );
});
