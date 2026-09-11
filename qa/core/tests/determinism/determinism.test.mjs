import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { documentSVG } from '../../src/headless/export-runner.js';
import { semanticDocumentHash } from '../../src/headless/headless-runtime.js';
import { createdFlower } from '../headless/runtime-fixture.mjs';

test('Test 8: same seed, document, and instruction retain semantic JSON, SVG, and stable IDs', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ink-determinism-test-'));
  try {
    const runs = Array.from({ length: 3 }, () => createdFlower().document), hashes = runs.map(document => semanticDocumentHash(document)), svgs = runs.map(document => documentSVG(document).svg), ids = runs.map(document => document.pages[0].layers.flatMap(layer => layer.objects.map(object => object.id)));
    assert.equal(new Set(hashes).size, 1); assert.equal(new Set(svgs).size, 1); assert.deepEqual(ids[0], ids[1]); assert.deepEqual(ids[1], ids[2]);
  } finally { await rm(root, { recursive: true, force: true }); }
});
