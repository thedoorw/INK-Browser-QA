import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL(path, import.meta.url), 'utf8');

test('Path Editing Core is wired into shared source without format/package expansion', () => {
  const pathEdit = read('../../../../product/source/src/editor/path-edit.js');
  const editorIndex = read('../../../../product/source/src/editor/index.js');
  const ink = read('../../../../product/source/src/ink.js');
  const config = read('../../../../product/source/src/config.js');
  const serviceWorker = read('../../../../product/source/service-worker.js');
  const shell = read('../../../../product/source/index.html');
  const standalone = read('../../../../product/source/index-standalone.html');

  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.match(editorIndex, /path-edit\.js/);
  assert.match(pathEdit, /vector\/vector-core\.js/);
  assert.match(pathEdit, /history\?\.pushScoped|history\.pushScoped/);
  assert.match(pathEdit, /IDENTITY_CHANGED/);
  assert.match(pathEdit, /METADATA_CHANGED/);
  assert.match(pathEdit, /CLOSED_PATH_MINIMUM_ANCHORS/);
  assert.match(pathEdit, /OPEN_PATH_MINIMUM_ANCHORS/);
  assert.match(pathEdit, /maxPasses/);
  assert.match(pathEdit, /maxAddedAnchors/);
  assert.doesNotMatch(pathEdit, /rasterize|toDataURL|drawImage/);

  assert.match(ink, /tracePath/);
  assert.match(ink, /path-anchor-move/);
  assert.match(ink, /path-handle-move/);
  assert.match(ink, /path-editing-core/);
  assert.match(serviceWorker, /src\/editor\/path-edit\.js/);

  for (const html of [shell, standalone]) {
    assert.match(html, /id="pathEditCard"/);
    assert.match(html, /id="insertPathAnchorBtn"/);
    assert.match(html, /id="deletePathAnchorsBtn"/);
  }
});
