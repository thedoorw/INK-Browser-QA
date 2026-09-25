import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, 'product/source', name), 'utf8');
const shell = read('web-shell.js');
const ink = read('src/ink.js');
const css = read('styles.css');
const web = read('index.html');
const portable = read('index-standalone.html');
const config = read('src/config.js');
const serviceWorker = read('service-worker.js');

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

test('delivered shell owns a light workstation first paint before Runtime boot', () => {
  for (const html of [web, portable]) {
    assert.match(html, /<meta name="theme-color" content="#e7e7e7">/);
    assert.match(html, /<style id="inkFirstPaintStyle">[\s\S]*?html,body\{margin:0;background:#e7e7e7;color:#262626\}[\s\S]*?#app\{background:#e7e7e7;color:#262626\}[\s\S]*?<\/style>/);
    assert.match(html, /<body data-ink-first-paint="workstation">/);
    assert.match(html, /<div id="app" class="app web-shell-v0-1" data-panel="brush" data-space="creation" data-shell-panel="collapsed" data-toolbar-layout="single" data-first-paint="ready" style="--active-panel-w:0px">/);
    assert.doesNotMatch(html, /inkFirstPaintStyle[\s\S]{0,240}?(?:#000|black|#111|#1[0-9a-f]{5})/i);
  }
  assert.match(serviceWorker, /const BUILD_ID = '20260925-ui-rebuild-001-g3-first-paint-r1';/);
});

test('desktop primary-panel state is explicit and fresh entry is collapsed', () => {
  assert.match(shell, /PRIMARY_PANEL_STATES = Object\.freeze\(\['collapsed', \.\.\.PANEL_DEFS\.map\(def => def\.id\)\]\)/);
  for (const id of ['properties','layers','history','reference','compose','chat','revision']) assert.match(shell, new RegExp(`\\{ id: '${id}'`));
  assert.match(shell, /activePanel: 'collapsed'/);
  assert.match(shell, /state\.activePanel = 'collapsed';[\s\S]*?creativeWorkspace\?\.setOpen\?\.\(false\);[\s\S]*?toggleInspector\?\.\(false\)/);
  assert.match(shell, /Only the last selected panel[\s\S]*?open\/closed state is never restored/);
  assert.doesNotMatch(shell, /localStorage\.setItem\([^\n]*(?:open|expanded)/i);
});

test('web-shell owns primary-panel open close state independently of any legacy presenter', () => {
  assert.match(shell, /function selectPanel\(id\)/);
  assert.match(shell, /function togglePanel\(id\)/);
  assert.match(shell, /function closePrimaryPanels\(\)/);
  assert.match(shell, /function bindInspectorCloseControl\(\)/);
  assert.doesNotMatch(shell, /button\.onclick\s*=/);
  assert.doesNotMatch(ink, /\$\('#inspectorEdgeToggle'\)\.onclick/);
  assert.doesNotMatch(ink, /\$\('#closeInspector'\)\.onclick/);
  assert.match(ink, /globalThis\.INK_WEB_SHELL\?\.open\?\.\('properties'\)/);
  assert.match(ink, /const primary=globalThis\.INK_WEB_SHELL\?\.state\?\.\(\)\.activePanel/);
});

test('Dock is primary navigation and Properties owns only Tool Object AI Core sub-navigation', () => {
  for (const html of [web, portable]) {
    const tabs = [...html.matchAll(/class="inspector-tab[^"]*" data-tab="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(tabs, ['brush','object','ai','studio']);
    assert.equal((html.match(/data-tab="layers"/g) || []).length, 0);
    assert.equal((html.match(/data-tab="history"/g) || []).length, 0);
    assert.equal((html.match(/data-content="layers"/g) || []).length, 1);
    assert.equal((html.match(/data-content="history"/g) || []).length, 1);
    assert.equal((html.match(/data-panel-subnav="properties"/g) || []).length, 1);
  }
  assert.match(shell, /\{ id: 'layers',[^\n]+kind: 'inspector', tab: 'layers'/);
  assert.match(shell, /\{ id: 'history',[^\n]+kind: 'inspector', tab: 'history'/);
});

test('single CSS authority owns panel geometry and rejects known contradictory patterns', () => {
  assert.equal((css.match(/INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY/g) || []).length, 1);
  assert.match(css, /\.stage-wrap\{[^}]*right:var\(--panel-dock-w\)[^}]*transition:right/);
  assert.match(css, /\.app\.panel-primary-open \.stage-wrap\{right:calc\(var\(--panel-dock-w\) \+ var\(--active-panel-w\)\)\}/);
  assert.match(css, /\.panel-dock\{[^}]*right:0;[^}]*width:var\(--panel-dock-w\)/);
  assert.match(css, /\.inspector\{[^}]*right:var\(--panel-dock-w\);[^}]*width:var\(--inspector-w\);[^}]*overflow:hidden/);
  assert.match(css, /\.creative-workspace-panel:not\(\.open\)\{display:none\}/);
  assert.match(css, /\.creative-workspace-panel\.open\{display:flex\}/);
  assert.match(css, /right:calc\(var\(--panel-dock-w\) \+ var\(--active-panel-w\)\)/);
  assert.match(css, /\.properties-subnav\{[^}]*height:31px;[^}]*display:flex;[^}]*overflow:hidden/);
  assert.match(css, /data-panel="layers"\] \.properties-subnav,[^\n]*data-panel="history"\] \.properties-subnav\{display:none\}/);
  assert.match(css, /\.inspector-section\.active,\.creative-workspace-body\{[^}]*overflow-y:auto;[^}]*overflow-x:hidden/);
  assert.doesNotMatch(css, /\.inspector-edge-toggle\{right:0!important/);
  assert.doesNotMatch(css, /\.inspector-tabs\{grid-template-columns:repeat\(4,1fr\)!important\}/);
  assert.doesNotMatch(css, /\.inspector-tabs\{overflow-x:auto\}/);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
});

test('Dock owns panel toggle state and Advanced only navigates into Properties', () => {
  assert.match(shell, /dock\.addEventListener\('click'[\s\S]*?togglePanel\(button\.dataset\.shellPanel\)/);
  assert.match(shell, /function openContextualAdvanced\(\)[\s\S]*?return selectPanel\('properties'\)/);
  assert.doesNotMatch(shell, /function openContextualAdvanced\(\)[\s\S]{0,240}?closePrimaryPanels\(\)/);
  assert.match(shell, /const propertiesOpen = currentPanel\(\) === 'properties'/);
  assert.match(shell, /advanced\.classList\.toggle\('active', propertiesOpen\)/);
  assert.match(shell, /document\.querySelectorAll\('\[data-shell-panel\]'\)[\s\S]*?button\.dataset\.shellPanel === active/);
});

test('application menus have one registry/controller and dead menu labels are not live buttons', () => {
  assert.match(shell, /const APPLICATION_MENU_REGISTRY = Object\.freeze\(\[/);
  for (const id of ['file','edit','view','select','object','layer','brush','window','help']) {
    assert.match(shell, new RegExp(`\\{ id: '${id}'`));
  }
  assert.match(shell, /function bindApplicationMenus\(\)/);
  assert.match(shell, /function setApplicationMenu\(id, open\)/);
  assert.match(shell, /function closeApplicationMenus\(/);
  for (const html of [web, portable]) {
    for (const id of ['edit','view','select','object','layer','brush','help']) {
      assert.match(html, new RegExp(`<span class="application-menu-label" data-application-menu-id="${id}">`));
      assert.doesNotMatch(html, new RegExp(`<button[^>]+data-application-menu-(?:id|trigger)="${id}"`));
    }
    assert.match(html, /id="fileMenuToggle"[^>]+data-application-menu-trigger="file"/);
    assert.match(html, /id="windowMenuToggle"[^>]+data-application-menu-trigger="window"/);
  }
});

test('Web Portable favicon contract is singular and uses the dedicated SVG favicon', () => {
  assert.equal(normalizeDelivery(web, 'Web'), normalizeDelivery(portable, 'Portable'));
  for (const html of [web, portable]) {
    assert.match(html, /<link rel="icon" href="assets\/favicon\.svg\?v=0\.1" type="image\/svg\+xml" sizes="32x32">/);
    assert.doesNotMatch(html, /rel="icon"[^>]*INK_MARK_SOURCE_W-300\.jpg/);
  }
  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.match(web, /INK v0\.1 · Web/);
  assert.match(portable, /INK v0\.1 · Portable/);
});
