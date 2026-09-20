import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../../../../', import.meta.url);
const source = path => readFile(new URL(path, root), 'utf8');

test('Revision closure stays on FORMAT_VERSION 4 and static/browser-local architecture', async () => {
  const [config, revision, chat, ink, serviceWorker] = await Promise.all([
    source('product/source/src/config.js'),
    source('product/source/src/document/revision.js'),
    source('product/source/src/editor/chat-bounded-edit.js'),
    source('product/source/src/ink.js'),
    source('product/source/service-worker.js')
  ]);

  assert.match(config, /FORMAT_VERSION\s*=\s*4/);
  assert.match(revision, /INK-REVISION-RECORD/);
  assert.match(revision, /INK-REVISION-COMPARISON/);
  assert.match(revision, /RESET_TO_REVISION/);
  assert.match(revision, /this\.store\.save|this\.store\?\.save/);
  assert.doesNotMatch(revision, /fetch\s*\(|XMLHttpRequest|WebSocket|https?:\/\//);

  assert.match(chat, /STALE_REVISION/);
  assert.match(chat, /revisionId/);
  assert.match(ink, /installRevision\(this,\{store:this\.store\}\);installChatBoundedEdit\(this\)/);
  assert.match(serviceWorker, /\.\/src\/document\/revision\.js/);
});

test('Revision source reuses the accepted envelope/integrity/History boundary instead of a second engine', async () => {
  const revision = await source('product/source/src/document/revision.js');
  assert.match(revision, /wrapInkFile/);
  assert.match(revision, /unwrapInkFile/);
  assert.match(revision, /inspectDocument/);
  assert.match(revision, /app\.history\?\.clear/);
  assert.doesNotMatch(revision, /class\s+.*History/);
  assert.doesNotMatch(revision, /canvas|toDataURL|rasterize|flatten/i);
});
