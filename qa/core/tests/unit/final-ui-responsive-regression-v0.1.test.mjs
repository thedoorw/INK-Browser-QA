import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, 'product/source', name), 'utf8');

const web = read('index.html');
const portable = read('index-standalone.html');
const shell = read('web-shell.js');
const css = read('styles.css');
const ink = read('src/ink.js');
const config = read('src/config.js');

function normalizeDelivery(html, delivery) {
  const label = `INK v0.1 · ${delivery}`;
  return html
    .replace(`<meta name="application-name" content="${label}">`, '<meta name="application-name" content="INK v0.1">')
    .replace(`<title>${label}</title>`, '<title>INK v0.1</title>')
    .replace(`<div class="menu-app-mark" aria-label="${label}">`, '<div class="menu-app-mark" aria-label="INK v0.1">')
    .replace(`<div class="brand" aria-label="${label}">`, '<div class="brand" aria-label="INK v0.1">')
    .replace(`<span class="version-badge">v0.1 · ${delivery}</span>`, '<span class="version-badge">v0.1</span>')
    .replace(`<link rel="manifest" href="${delivery === 'Web' ? 'manifest' : 'manifest-portable'}.webmanifest?v=0.1">`, '<link rel="manifest" href="DELIVERY_MANIFEST">')
    .replace(delivery === 'Web' ? '<script type="module" src="src/ink.js?v=0.1"></script>' : '<script src="dist/ink.compat.js?v=0.1"></script>', '<script src="DELIVERY_BOOT"></script>')
    .replace(delivery === 'Web' ? '<span class="web-surface-badge">WEB</span>' : '', '');
}

test('final UI keeps Portable and Web on one shared shell', () => {
  assert.equal(normalizeDelivery(web, 'Web'), normalizeDelivery(portable, 'Portable'));
  assert.doesNotThrow(() => new Function(shell));
  for (const html of [web, portable]) {
    for (const id of ['contextualOptions', 'stageWrap', 'fullscreenToggle', 'inspector', 'pagesPanel', 'mobileToolSheet']) {
      assert.equal(html.split(`id="${id}"`).length - 1, 1, `Expected one shared UI hook: ${id}`);
    }
  }
});

test('medium desktop constrains primary panels while preserving canvas compensation', () => {
  assert.match(css, /INK-WEB-UI-005 — responsive \/ fullscreen \/ final containment closure/);
  assert.match(css, /@media\(max-width:980px\) and \(min-width:761px\)/);
  assert.match(css, /\.inspector\{[\s\S]*?width:min\(var\(--inspector-w\),38vw\);[\s\S]*?max-width:360px/);
  assert.match(css, /\.creative-workspace-panel,[\s\S]*?width:clamp\(280px,38vw,340px\)/);
  assert.match(css, /\.app\.panel-primary-open \.stage-wrap\{[\s\S]*?--active-panel-w|--active-panel-w/);
  assert.match(shell, /getBoundingClientRect\(\)/);
  assert.match(shell, /--active-panel-w/);
});

test('mobile and coarse-pointer surfaces stay inside the dynamic viewport', () => {
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?\.panel-dock,\.panel-window-menu\{display:none!important\}/);
  assert.match(css, /\.contextual-control-host\{[\s\S]*?touch-action:pan-x/);
  assert.match(css, /height:min\(72dvh,620px\)/);
  assert.match(css, /max-height:calc\(100dvh - var\(--topbar-h\) - var\(--contextual-h\) - 12px\)/);
  assert.match(css, /#app\[data-panel="ai"\] #inspector\{[\s\S]*?inset:calc\(var\(--topbar-h\) \+ var\(--contextual-h\)\) 0 0 0/);
  assert.match(css, /@media\(pointer:coarse\) and \(max-height:520px\)/);
  assert.match(css, /@media\(max-width:560px\)/);
  assert.match(css, /@media\(max-width:440px\)/);
  assert.match(css, /\.mobile-tool-sheet\{[\s\S]*?overflow-y:auto/);
});

test('contextual and selection controls remain reachable rather than wrapped into canvas', () => {
  assert.match(css, /\.contextual-control-host\{[\s\S]*?overflow-x:auto/);
  assert.match(css, /\.contextual-tool-identity,[\s\S]*?\.contextual-advanced-button\{flex-shrink:0\}/);
  for (const action of ['duplicate', 'group', 'front', 'alignCenter', 'delete']) {
    assert.ok(web.includes(`data-selection-action="${action}"`));
    assert.ok(portable.includes(`data-selection-action="${action}"`));
  }
  assert.match(shell, /CONTEXT_CONTROL_IDS = Object\.freeze/);
});

test('fullscreen command authority and presentation contract remain unchanged', () => {
  for (const html of [web, portable]) assert.equal(html.split('id="fullscreenToggle"').length - 1, 1);
  assert.match(ink, /async toggleFullscreen\(\)/);
  assert.match(ink, /requestFullscreen\|\|target\.webkitRequestFullscreen/);
  assert.match(ink, /document\.addEventListener\('fullscreenchange'/);
  assert.match(ink, /this\.el\.app\.classList\.toggle\('fullscreen-active',active\)/);
  assert.match(css, /\.app\.fullscreen-active\{[\s\S]*?width:100%;[\s\S]*?height:100%/);
});

test('Editor and Creative Loop routes stay reachable after responsive closure', () => {
  for (const id of ['layers', 'history', 'reference', 'compose', 'chat', 'revision']) {
    assert.match(shell, new RegExp(`\\{ id: '${id}'`));
  }
  assert.match(shell, /PANEL_GROUPS = Object\.freeze/);
  assert.match(shell, /enforceSinglePrimary/);
  assert.doesNotMatch(shell, /\.click\(\)/);
});

test('final UI closure preserves product identity and document format', () => {
  assert.match(web, /INK v0\.1 · Web/);
  assert.match(portable, /INK v0\.1 · Portable/);
  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'CSS brace balance');
});
