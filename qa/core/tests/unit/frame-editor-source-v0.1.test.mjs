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


test('frameSelection rejects cross-layer selections before Frame/history mutation', () => {
  const start = ink.indexOf("frameSelection({name='Frame'");
  const end = ink.indexOf("\n\n  changeArtboard", start);
  const method = ink.slice(start, end);
  const guard = method.indexOf("selected.some(found=>found.layer.id!==layer.id)");
  const create = method.indexOf("createFrame");
  const history = method.indexOf("this.history.pushScoped('建立 Frame'");
  assert.ok(start >= 0 && end > start);
  assert.ok(guard >= 0);
  assert.ok(guard < create);
  assert.ok(guard < history);
  assert.match(method, /選取物件必須位於同一圖層/);
});

test('reparentObjectToFrame rejects cross-layer moves before hierarchy/history mutation', () => {
  const start = ink.indexOf('reparentObjectToFrame(objectId,frameId=null)');
  const end = ink.indexOf('\n  frameSelection', start);
  const method = ink.slice(start, end);
  const guard = method.indexOf('frameId&&source.layer.id!==target.layer.id');
  const history = method.indexOf("this.history.pushScoped(frameId?'移入 Frame':'移出 Frame'");
  const mutation = method.indexOf('reparentPageObject(');
  assert.ok(start >= 0 && end > start);
  assert.ok(guard >= 0);
  assert.ok(guard < history);
  assert.ok(guard < mutation);
  assert.match(method, /Frame 只能包含同一圖層的物件/);
});
