import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const hierarchy = readFileSync(new URL('../../../../product/source/src/document/hierarchy.js', import.meta.url), 'utf8');
const model = readFileSync(new URL('../../../../product/source/src/document/model.js', import.meta.url), 'utf8');
const migration = readFileSync(new URL('../../../../product/source/src/document/migration.js', import.meta.url), 'utf8');
const integrity = readFileSync(new URL('../../../../product/source/src/document/integrity.js', import.meta.url), 'utf8');
const ink = readFileSync(new URL('../../../../product/source/src/ink.js', import.meta.url), 'utf8');
const vector = readFileSync(new URL('../../../../product/source/src/vector/vector-core.js', import.meta.url), 'utf8');
const config = readFileSync(new URL('../../../../product/source/src/config.js', import.meta.url), 'utf8');

test('shared hierarchy contract covers Frame and Group with inherited state and explicit interaction boundary', () => {
  assert.match(hierarchy, /isStructuralContainer\(object\)/);
  assert.match(hierarchy, /isFrame\(object\) \|\| isGroup\(object\)/);
  assert.match(hierarchy, /effectiveOpacity/);
  assert.match(hierarchy, /interactionExposed: groupAncestorIds\.length === 0/);
  assert.match(hierarchy, /comparePageObjectHitOrder/);
  assert.match(hierarchy, /HIERARCHY_CROSS_LAYER_REPARENT/);
});

test('migration and integrity enforce deterministic ownership without format promotion', () => {
  assert.match(model, /HIERARCHY_DUPLICATE_OWNERSHIP/);
  assert.match(model, /HIERARCHY_DUPLICATE_ID/);
  assert.match(model, /HIERARCHY_CYCLE/);
  assert.match(migration, /createStructuralNormalizationState/);
  assert.match(integrity, /duplicate-ownership/);
  assert.match(integrity, /structural-cycle/);
  assert.match(integrity, /stale-top-level-parent-id/);
  assert.match(config, /FORMAT_VERSION = 4/);
});

test('selection, eraser and spatial refresh respect Group atomic interaction while using structural traversal', () => {
  assert.match(ink, /comparePageObjectHitOrder/);
  assert.match(ink, /item\.interactionExposed!==false&&item\.effectiveVisible&&!item\.effectiveLocked/);
  assert.match(ink, /item\.object\.type==='stroke'&&item\.interactionExposed!==false/);
  assert.match(ink, /item\.interactionExposed!==false&&!item\.effectiveLocked/);
  assert.match(ink, /found\.object\.type==='frame'\|\|found\.object\.type==='group'/);
  assert.match(ink, /found\?\.object\.type==='stroke'&&found\.interactionExposed!==false/);
  assert.match(readFileSync(new URL('../../../../product/source/src/spatial/page-spatial-index.js', import.meta.url), 'utf8'), /found\.ancestorTypes\?\.includes\('group'\)/);
});

test('renderer and structured SVG retain recursive visibility/opacity semantics', () => {
  assert.match(ink, /if\(o\?\.visible===false\)return;/);
  assert.match(ink, /ctx\.globalAlpha\*=o\.opacity\?\?1/);
  assert.match(ink, /o\.type==='group'\|\|o\.type==='frame'/);
  assert.match(vector, /if\(object\.type==='group'\)\{if\(object\.visible===false\)return'';/);
});
