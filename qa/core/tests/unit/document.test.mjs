import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument, migrateDocument } from '../../src/document/index.js';

test('default document uses current format version', () => {
  const document = defaultDocument();
  assert.equal(document.format, 'INK');
  assert.equal(document.formatVersion, 4);
  assert.equal(document.appVersion, '0.1');
  assert.equal(document.pages[0].artboard.mode, 'fixed');
  assert.equal(document.pages[0].workspace.activeSpace, 'creation');
  assert.equal(document.pages[0].workspace.showLayoutFrameInCreation, false);
  assert.deepEqual(document.pages[0].workspace.layoutViewport, { x: 0, y: 0, scale: 1, rotation: 0 });
  assert.equal(document.pages[0].camera, document.pages[0].workspace.cameras.creation);
  assert.equal(document.pages[0].artboard.preset, 'A4');
  assert.equal(document.pages[0].paper.absorbency, .58);
  assert.equal(document.pages[0].paper.textureVisible, true);
});

test('migration normalizes legacy format 3 content without changing format 4 schema', () => {
  const legacy = defaultDocument();
  legacy.formatVersion = 3;
  legacy.appVersion = '1.9.0';
  delete legacy.pages[0].paper.gridSize;
  delete legacy.pages[0].artboard;
  delete legacy.pages[0].workspace;
  const migrated = migrateDocument(legacy);
  assert.equal(migrated.formatVersion, 4);
  assert.equal(migrated.appVersion, '0.1');
  assert.equal(migrated.pages[0].artboard.mode, 'fixed');
  assert.equal(migrated.pages[0].workspace.activeSpace, 'creation');
  assert.equal(migrated.pages[0].paper.gridSize, 32);
  assert.equal(migrated.pages[0].paper.roughness, .42);
  assert.equal(migrated.pages[0].paper.seed, 1337);
});

test('future document versions are rejected', () => {
  const document = defaultDocument();
  document.formatVersion = 99;
  assert.throws(() => migrateDocument(document), /高於目前支援/);
});
