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
const favicon = read('assets/favicon.svg');
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

test('Web and Portable keep one shared UI shell', () => {
  assert.equal(normalizeDelivery(web, 'Web'), normalizeDelivery(portable, 'Portable'));
  assert.doesNotThrow(() => new Function(shell));
  for (const html of [web, portable]) {
    for (const id of ['contextualAdvancedBtn', 'inspectorToggle', 'inspectorEdgeToggle', 'inspector', 'stageWrap']) {
      assert.equal(html.split(`id="${id}"`).length - 1, 1, `Expected one shared hook: ${id}`);
    }
  }
});

test('primary-panel authority is selection-first with one desktop collapse chevron', () => {
  assert.match(shell, /function selectPanel\(id\)/);
  assert.match(shell, /selectPanel\(button\.dataset\.shellPanel\)/);
  assert.match(shell, /function bindCollapseControl\(\)/);
  assert.match(shell, /state\.lastPanel \|\| 'properties'/);
  assert.match(shell, /open: selectPanel/);
  assert.doesNotMatch(shell, /\.click\(\)/);
  assert.match(css, /#inspectorToggle\.legacy-inspector-toggle\{display:none!important\}/);
  assert.doesNotMatch(css, /\.inspector-edge-toggle\{display:none!important\}/);
  assert.match(css, /#closeInspector,[\s\S]*?data-workspace-action="close"[\s\S]*?display:none!important/);
});

test('contextual Advanced is a synchronized two-way Properties toggle', () => {
  assert.match(shell, /if \(currentPanel\(\) === 'properties'\)[\s\S]*?closePrimaryPanels\(\)/);
  assert.match(shell, /return selectPanel\('properties'\)/);
  assert.match(shell, /advanced\.setAttribute\('aria-pressed', String\(propertiesOpen\)\)/);
  assert.match(shell, /advanced\.setAttribute\('aria-expanded', String\(propertiesOpen\)\)/);
  assert.match(shell, /advanced\.classList\.toggle\('active', propertiesOpen\)/);
  for (const html of [web, portable]) {
    assert.match(html, /id="contextualAdvancedBtn"[^>]*aria-pressed="false"[^>]*aria-expanded="false"[^>]*aria-controls="inspector"/);
  }
});

test('Inspector and Creative Loop bodies own vertical scroll without horizontal overflow', () => {
  assert.match(css, /INK-UI-MAINT-002 — readability \/ single panel authority \/ containment/);
  assert.match(css, /\.inspector-section\.active,[\s\S]*?\.creative-workspace-body\{[\s\S]*?min-height:0;[\s\S]*?overflow-y:auto;[\s\S]*?overflow-x:hidden/);
  assert.match(css, /\.inspector,[\s\S]*?\.creative-workspace-panel,[\s\S]*?overflow:hidden;[\s\S]*?display:flex;[\s\S]*?flex-direction:column/);
  assert.match(css, /\.creative-workspace-body pre\{[\s\S]*?min-width:0;[\s\S]*?max-width:100%/);
});

test('bounded readability lift removes critical 7–8 px secondary text from active desktop authority', () => {
  assert.match(css, /\.contextual-advanced-button\{[\s\S]*?font-size:10px/);
  assert.match(css, /\.creative-workspace-state span\{font-size:9px/);
  assert.match(css, /\.creative-workspace-state strong\{font-size:9\.5px/);
  assert.match(css, /\.creative-workspace-tabs button\{font-size:10px/);
  assert.match(css, /\.creative-workspace-field\{font-size:10px/);
  assert.match(css, /\.creative-workspace-status\{font-size:9\.5px/);
  assert.match(css, /\.statusbar\{font-size:9\.5px/);
});

test('local favicon is dedicated, mirrored and small-pixel robust', () => {
  for (const html of [web, portable]) {
    assert.match(html, /<link rel="icon" href="assets\/favicon\.svg\?v=0\.1" type="image\/svg\+xml" sizes="32x32">/);
    assert.doesNotMatch(html, /rel="icon" href="assets\/ink-mark\.svg/);
  }
  assert.match(favicon, /width="32" height="32" viewBox="0 0 32 32"/);
  assert.match(favicon, /fill="#69BFE3"/);
  assert.match(favicon, /fill="#FFFFFF"/);
  assert.doesNotMatch(favicon, /\d+\.\d+/);
});

test('task preserves v0.1 identity, FORMAT_VERSION 4 and CSS parse guards', () => {
  assert.match(web, /INK v0\.1 · Web/);
  assert.match(portable, /INK v0\.1 · Portable/);
  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length, 'CSS brace balance');
  assert.doesNotMatch(css, /minmax:0/);
});
