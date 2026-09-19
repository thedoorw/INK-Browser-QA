import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ink = readFileSync(new URL('../../../../product/source/src/ink.js', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../../../../product/source/styles.css', import.meta.url), 'utf8');

test('frame editor integration is wired through existing INK editor surfaces', () => {
  assert.match(ink, /createFrame, findPageObject, reparentPageObject, walkPageObjects/);
  assert.match(ink, /hitTest\(d\.world,\{deep:e\.altKey\}\)/);
  assert.match(ink, /o\.type==='group'\|\|o\.type==='frame'/);
  assert.match(ink, /data-ink-type="frame"/);
  assert.match(ink, /frame-tree-row/);
  assert.match(ink, /selectedTransformObjects\(\)/);
  assert.match(ink, /reparentObjectToFrame/);
  assert.match(ink, /found\.worldMatrix\|\|found\.object\.matrix/);
  assert.match(ink, /frameSelection/);
});

test('layers panel receives bounded nested tree styling without replacing layer rows', () => {
  assert.match(styles, /\.object-tree-row/);
  assert.match(styles, /\.frame-tree-row/);
  assert.match(styles, /\.child-tree-row/);
  assert.match(styles, /\.layer-row/);
});

test('excluded cloud and layout capabilities are not introduced by frame integration', () => {
  const marker = ink.slice(ink.indexOf('reparentObjectToFrame'), ink.indexOf('changeArtboard'));
  assert.doesNotMatch(marker, /websocket|authentication|flex-layout|grid-layout|penpot/i);
});
