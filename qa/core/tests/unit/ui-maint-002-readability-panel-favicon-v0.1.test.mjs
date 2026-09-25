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
    for (const id of ['contextualAdvancedBtn', 'inspector', 'stageWrap']) {
      assert.equal(html.split(`id="${id}"`).length - 1, 1, `Expected one shared hook: ${id}`);
    }
  }
});

test('primary-panel authority is owned by web-shell and Dock clicks use its toggle route', () => {
  assert.match(shell, /function selectPanel\(id\)/);
  assert.match(shell, /function togglePanel\(id\)/);
  assert.match(shell, /function closePrimaryPanels\(\)/);
  assert.match(shell, /dock\.addEventListener\('click'[\s\S]*?togglePanel\(button\.dataset\.shellPanel\)/);
  assert.match(shell, /open: selectPanel/);
  assert.match(shell, /toggle: togglePanel/);
  assert.match(shell, /close: closePrimaryPanels/);
  assert.doesNotMatch(shell, /function bindCollapseControl\(\)/);
});

test('contextual Advanced is synchronized navigation to Properties, not a second panel toggle authority', () => {
  assert.match(shell, /function openContextualAdvanced\(\)[\s\S]*?return selectPanel\('properties'\)/);
  assert.doesNotMatch(shell, /function openContextualAdvanced\(\)[\s\S]{0,240}?closePrimaryPanels\(\)/);
  assert.match(shell, /advanced\.setAttribute\('aria-pressed', String\(propertiesOpen\)\)/);
  assert.match(shell, /advanced\.setAttribute\('aria-expanded', String\(propertiesOpen\)\)/);
  assert.match(shell, /advanced\.classList\.toggle\('active', propertiesOpen\)/);
  for (const html of [web, portable]) {
    assert.match(html, /id="contextualAdvancedBtn"[^>]*aria-pressed="false"[^>]*aria-expanded="false"[^>]*aria-controls="inspector"/);
    assert.doesNotMatch(html, /id="inspectorEdgeToggle"/);
  }
});

test('Inspector and Creative Loop bodies own vertical scroll without horizontal overflow', () => {
  assert.match(css, /INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY/);
  assert.match(css, /\.inspector-section\.active,[\s\S]*?\.creative-workspace-body\{[\s\S]*?min-height:0;[\s\S]*?overflow-y:auto;[\s\S]*?overflow-x:hidden/);
  assert.match(css, /\.inspector\{[\s\S]*?overflow:hidden;[\s\S]*?display:flex;[\s\S]*?flex-direction:column/);
  assert.match(css, /\.creative-workspace-panel\{[\s\S]*?overflow:hidden;[\s\S]*?flex-direction:column/);
  assert.match(css, /\.creative-workspace-panel:not\(\.open\)\{display:none\}/);
  assert.match(css, /\.creative-workspace-panel\.open\{display:flex\}/);
  assert.match(css, /\.creative-workspace-body pre\{[\s\S]*?min-width:0;[\s\S]*?max-width:100%/);
});

test('one semantic typography authority owns workstation font stack and scale', () => {
  assert.match(css, /--ui-font:"Segoe UI","Noto Sans TC","PingFang TC","Microsoft JhengHei",system-ui,sans-serif/);
  assert.match(css, /--ui-font-mono:ui-monospace,SFMono-Regular,Consolas,"Liberation Mono",monospace/);
  for (const token of ['xs','sm','md','lg','xl','display']) assert.match(css, new RegExp(`--ui-type-${token}:`));
  assert.match(css, /--ui-type-brand:var\(--ui-type-md\)/);
  assert.equal((css.match(/font-size\s*:\s*[0-9.]+px/gi) || []).length, 0, 'No hard-coded workstation font-size declarations');
  assert.doesNotMatch(css, /font-family:Georgia/i);
  assert.doesNotMatch(css, /--font:/);
  assert.doesNotMatch(css, /font-family:Inter,"Noto Sans TC"/);
  assert.doesNotMatch(css, /font-size:var\(--ui-type-xs\)!important/);
  assert.match(css, /\.contextual-advanced-button,[\s\S]*?font-size:var\(--ui-type-md\)/);
  assert.match(css, /\.creative-workspace-status,[\s\S]*?font-size:var\(--ui-type-sm\)/);
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
