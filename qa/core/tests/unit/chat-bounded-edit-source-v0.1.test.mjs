import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(path, 'utf8');

test('CHAT bounded edit loop is wired into shared browser-local source without second engines or FORMAT_VERSION change', () => {
  const config = read('product/source/src/config.js');
  const chat = read('product/source/src/editor/chat-bounded-edit.js');
  const editorIndex = read('product/source/src/editor/index.js');
  const ink = read('product/source/src/ink.js');
  const history = read('product/source/src/history/history.js');
  const repaint = read('product/source/src/editor/repaint-material.js');
  const pathEdit = read('product/source/src/editor/path-edit.js');
  const serviceWorker = read('product/source/service-worker.js');

  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);

  assert.match(chat, /INK-CHAT-STATE-SUMMARY/);
  assert.match(chat, /INK-CHAT-EDIT-TASK/);
  assert.match(chat, /INK-CHAT-EDIT-PROPOSAL/);
  assert.match(chat, /INK-CHAT-EDIT-RESULT/);
  assert.match(chat, /path\.repaint\.v1/);
  assert.match(chat, /path\.material\.apply\.v1/);
  assert.match(chat, /object\.translate\.v1/);
  assert.match(chat, /path\.simplify\.v1/);
  assert.match(chat, /path\.refine\.v1/);
  assert.match(chat, /new Map\(\)/);
  assert.match(chat, /approvalToken/);
  assert.match(chat, /state = 'APPROVED'/);
  assert.match(chat, /APPROVAL_REQUIRED/);
  assert.match(chat, /TARGET_STALE/);
  assert.match(chat, /TARGET_LOCKED/);
  assert.match(chat, /TARGET_HIDDEN/);
  assert.match(chat, /TARGET_SINGULAR/);
  assert.match(chat, /app\.pathRepaintMaterial/);
  assert.match(chat, /app\.translateSelection/);
  assert.match(chat, /new PathEditController\(app\)/);
  assert.match(chat, /createChatBoundedEditAdapter/);

  assert.doesNotMatch(chat, /\beval\s*\(/);
  assert.doesNotMatch(chat, /new\s+Function\s*\(/);
  assert.doesNotMatch(chat, /\bfetch\s*\(/);
  assert.doesNotMatch(chat, /\bWebSocket\b/);
  assert.doesNotMatch(chat, /XMLHttpRequest/);
  assert.doesNotMatch(chat, /sendBeacon/);

  assert.match(editorIndex, /chat-bounded-edit\.js/);
  assert.match(ink, /installChatBoundedEdit/);
  assert.match(ink, /chat-bounded-edit-loop/);
  assert.match(serviceWorker, /src\/editor\/chat-bounded-edit\.js/);

  assert.match(repaint, /history\.pushScoped/);
  assert.match(pathEdit, /history\?\.pushScoped|history\.pushScoped/);
  assert.match(history, /pushScoped\(label, targets, operation\)/);
  assert.match(history, /cancel\(\{ restore: true \}\)/);
  assert.match(history, /if \(!forward\.length\)/);
});
