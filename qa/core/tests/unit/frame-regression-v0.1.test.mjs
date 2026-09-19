import test from 'node:test';
import assert from 'node:assert/strict';
import { Matrix } from '../../../../product/source/src/core/index.js';
import { createFrame, defaultDocument, findPageObject, migrateDocument } from '../../../../product/source/src/document/index.js';
import { InkStore } from '../../../../product/source/src/document/storage.js';
import { PenInputCalibrator } from '../../../../product/source/src/input/pen-calibration.js';
import { createAnchor, createPath, importSVGDocument, vectorObjectToSVG } from '../../../../product/source/src/vector/vector-core.js';
import { repeatInstanceStableId } from '../../../../product/source/src/repeat/repeat-identity.js';

const shape = id => ({ id, type:'shape', name:id, matrix:Matrix.identity(), opacity:1, shape:'rect', w:20, h:10, color:'#000', fill:false });

test('existing group normalization remains functional', () => {
  const doc = defaultDocument();
  doc.pages[0].layers[0].objects.push({ id:'g', type:'group', name:'G', matrix:Matrix.identity(), opacity:1, children:[shape('c')] });
  const migrated = migrateDocument(structuredClone(doc));
  const group = migrated.pages[0].layers[0].objects[0];
  assert.equal(group.type, 'group');
  assert.equal(group.children[0].id, 'c');
  assert.equal(group.children[0].parentId, 'g');
});

test('InkStore round-trip preserves frame hierarchy through fallback storage', async () => {
  const doc = defaultDocument();
  doc.pages[0].layers[0].objects.push(createFrame({ id:'f', children:[shape('inside')] }));
  const store = new InkStore({ databaseName:'INK_FRAME_TEST' });
  assert.equal(await store.save('frame', doc), true);
  const migrated = migrateDocument(await store.load('frame'));
  assert.equal(findPageObject(migrated.pages[0], 'inside').parentObject.id, 'f');
  assert.equal(findPageObject(migrated.pages[0], 'f').object.id, 'f');
});

test('stylus normalization remains available', () => {
  const pen = new PenInputCalibrator({}, { clock:() => 1000 });
  const sample = pen.normalizeEvent({ pointerId:7, pointerType:'pen', pressure:.6, tiltX:20, tiltY:-10, twist:15, timeStamp:999 });
  assert.ok(sample.pressure > 0 && sample.pressure <= 1);
  assert.equal(sample.pointerType, 'pen');
  assert.equal(pen.diagnostics().penSamples, 1);
});

test('editable vector path SVG and SVG import remain structured', () => {
  const path = createPath({ id:'p', subpaths:[{ closed:true, anchors:[createAnchor(0,0),createAnchor(40,0),createAnchor(40,40)] }] });
  const svg = vectorObjectToSVG(path, []);
  assert.match(svg, /<path/);
  assert.match(svg, /data-ink-type="path"/);
  const imported = importSVGDocument('<svg xmlns="http://www.w3.org/2000/svg"><path id="p2" d="M0 0 L20 0 L20 20 Z" fill="#ff0000"/></svg>');
  assert.equal(imported.paths.length, 1);
  assert.equal(imported.paths[0].type, 'path');
  assert.ok(imported.paths[0].subpaths[0].anchors.length >= 3);
});

test('repeat stable identity remains deterministic', () => {
  const input = { generatorId:'r', sourceObjectId:'s', instanceIndex:2, ringIndex:1, semanticRole:'petal', recipeVersion:'1' };
  assert.equal(repeatInstanceStableId(input), repeatInstanceStableId(input));
});
