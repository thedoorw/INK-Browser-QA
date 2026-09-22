import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, 'product/source', name), 'utf8');
const web = read('index.html');
const portable = read('index-standalone.html');
const css = read('styles.css');
const shell = read('web-shell.js');
const ink = read('src/ink.js');

function topbar(html) {
  const match = html.match(/<header class="topbar[^"]*">([\s\S]*?)<\/header>/);
  assert.ok(match, 'topbar required');
  return match[1];
}

test('desktop shell collapses contextual controls into the second chrome row', () => {
  for (const html of [web, portable]) {
    const bar = topbar(html);
    assert.match(bar, /id="docTitle"/);
    assert.match(bar, /id="contextualOptions"/);
    assert.match(bar, /id="workspaceSwitch"/);
    assert.match(bar, /id="fullscreenToggle"/);
    assert.equal(html.split('id="contextualOptions"').length - 1, 1);
  }
  for (const token of ['--menu-h:24px','--options-h:36px','--topbar-h:60px','--tool-w:40px','--inspector-w:252px']) {
    assert.ok(css.includes(token), 'missing geometry token ' + token);
  }
  assert.match(css, /\.topbar > \.contextual-options\{[\s\S]*?position:relative;[\s\S]*?height:100%/);
});

test('left rail, canvas, right dock and primary panel share one pixel grid', () => {
  assert.doesNotMatch(css, /\.tool-rail\{\s*left:7px;/);
  assert.match(css, /INK-UI-MAINT-001[\s\S]*?\.stage-wrap\{[\s\S]*?left:var\(--tool-w\);[\s\S]*?right:var\(--panel-dock-w\)/);
  assert.match(css, /INK-UI-MAINT-001[\s\S]*?\.tool-rail\{[\s\S]*?left:0;[\s\S]*?width:var\(--tool-w\)/);
  assert.match(css, /INK-UI-MAINT-001[\s\S]*?\.panel-dock\{[\s\S]*?right:0;[\s\S]*?width:var\(--panel-dock-w\)/);
  assert.match(css, /INK-UI-MAINT-001[\s\S]*?\.inspector\{[\s\S]*?width:var\(--inspector-w\);[\s\S]*?min-width:244px/);
  assert.match(css, /\.doc-title\{[\s\S]*?max-width:236px/);
});

test('fresh primary panel defaults to 252 px without taking over user resize persistence', () => {
  assert.match(shell, /DEFAULT_PRIMARY_PANEL_WIDTH = 252/);
  assert.match(shell, /!localStorage\.getItem\('ink-inspector-width'\)/);
  assert.match(shell, /app\.inspectorNormalWidth = DEFAULT_PRIMARY_PANEL_WIDTH/);
  assert.doesNotMatch(shell, /localStorage\.setItem\('ink-inspector-width'/);
  assert.doesNotThrow(() => new Function(shell));
});

test('Layout uses the existing real artboard renderer on a dark workbench', () => {
  assert.match(css, /\.app\[data-space="layout"\] \.stage-wrap\{background:#262626\}/);
  assert.match(ink, /ctx\.fillStyle=fixed\?'#2b2c2e':page\.paper\.color/);
  assert.match(ink, /drawArtboardFrameWorld\(ctx,page/);
  assert.match(ink, /ctx\.fillStyle=page\.paper\.color;ctx\.fillRect\(bleed\.x,bleed\.y,bleed\.w,bleed\.h\)/);
});

test('maintenance preserves format and command hook uniqueness', () => {
  assert.match(read('src/config.js'), /FORMAT_VERSION\s*=\s*4\b/);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
  for (const id of ['docTitle','contextualOptions','stageWrap','inspector','fullscreenToggle']) {
    assert.equal(web.split('id="' + id + '"').length - 1, 1);
    assert.equal(portable.split('id="' + id + '"').length - 1, 1);
  }
});
