import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, 'product/source', name), 'utf8');
const readBytes = name => readFileSync(path.join(root, 'product/source', name));
const readRuntimeQa = name => readFileSync(path.join(root, 'qa/runtime', name), 'utf8');
const shell = read('web-shell.js');
const ink = read('src/ink.js');
const css = read('styles.css');
const web = read('index.html');
const portable = read('index-standalone.html');
const config = read('src/config.js');
const serviceWorker = read('service-worker.js');
const runtimeUiHarness = readRuntimeQa('ink-web-ui-001-harness.html');
const runtimeBatch = readRuntimeQa('run-ink-runtime-batch.mjs');

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
  const appBuildId = config.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  const workerBuildId = serviceWorker.match(/const BUILD_ID = '([^']+)'/)?.[1];
  assert.ok(appBuildId);
  assert.equal(workerBuildId, appBuildId);
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
  const authorityStart = css.indexOf('INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY');
  const authorityEnd = css.indexOf('@media(max-width:1120px) and (min-width:761px)', authorityStart);
  const desktopAuthority = css.slice(authorityStart, authorityEnd);
  for (const selector of ['.topbar','.tool-rail','.inspector','.stage-wrap','.statusbar','.control-row','.inspector-tab','.creative-workspace-panel']) {
    const escaped = selector.replace('.', '\\.');
    assert.equal((desktopAuthority.match(new RegExp(`(^|\\n)\\s*${escaped}\\s*\\{`, 'gm')) || []).length, 1, `one desktop authority for ${selector}`);
  }
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

test('workstation presentation CSS has no !important cascade war', () => {
  const count = (css.match(/!important/g) || []).length;
  assert.ok(count <= 19, `semantic !important ceiling exceeded: ${count}`);
  const importantLines = css.split(/\r?\n/).filter(line => line.includes('!important'));
  for (const line of importantLines) {
    const semanticVisibility = /display\s*:\s*(?:none|flex|grid)!important/.test(line);
    const reducedMotion = /prefers-reduced-motion:reduce/.test(line) && /(?:animation|transition):none!important/.test(line);
    assert.ok(semanticVisibility || reducedMotion, `presentation !important is not allowed: ${line.trim()}`);
  }
  assert.doesNotMatch(css, /(?:font-size|color|background(?:-color)?|border(?:-[a-z-]+)?|width|height|padding|margin|box-shadow|backdrop-filter)\s*:[^;{}]*!important/);
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

test('responsive width authority uses exactly DESKTOP_WIDE DESKTOP_NARROW COMPACT taxonomy', () => {
  assert.match(css, /INK-UI-RESPONSIVE-001 — WIDTH TAXONOMY/);
  assert.match(shell, /const LAYOUT_MODES = Object\.freeze\(\{[\s\S]*?DESKTOP_WIDE: 'DESKTOP_WIDE',[\s\S]*?DESKTOP_NARROW: 'DESKTOP_NARROW',[\s\S]*?COMPACT: 'COMPACT'/);
  assert.match(shell, /function resolveLayoutMode\(width = globalThis\.innerWidth \|\| 1280\)[\s\S]*?width <= 760[\s\S]*?COMPACT[\s\S]*?width <= 1120[\s\S]*?DESKTOP_NARROW[\s\S]*?DESKTOP_WIDE/);
  const widthQueries = [...css.matchAll(/@media\s*\(([^)]*(?:min|max)-width[^)]*)\)/g)].map(match => match[1]);
  assert.ok(widthQueries.length > 0);
  for (const query of widthQueries) {
    assert.match(query, /^(?:max-width:1120px|max-width:760px|min-width:761px|max-width:1120px\) and \(min-width:761px)$/);
  }
  assert.doesNotMatch(css, /(?:max|min)-width\s*:\s*(?:410|440|560|860|900|980)px/);
  assert.match(css, /@media\(max-width:1120px\) and \(min-width:761px\)\{[\s\S]*?\.inspector\{width:min\(var\(--inspector-w\),38vw\)/);
  assert.match(css, /@media\(max-width:1120px\) and \(min-width:761px\)\{[\s\S]*?\.creative-workspace-panel\{width:clamp\(244px,38vw,340px\)/);
  assert.equal(normalizeDelivery(web, 'Web'), normalizeDelivery(portable, 'Portable'));
});

test('approved visible-logo route is singular and exact asset SHA is locked', () => {
  const approvedRoute = 'assets/INK_MARK_SOURCE_W-300.jpg';
  const approvedSha256 = '08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8';
  for (const html of [web, portable]) {
    const visibleLogoRoutes = [...html.matchAll(/class="brand-source-mark" src="([^"]+)"/g)].map(match => match[1].replace(/\?v=.*$/, ''));
    assert.ok(visibleLogoRoutes.length >= 1);
    assert.equal(new Set(visibleLogoRoutes).size, 1);
    assert.equal(visibleLogoRoutes[0], approvedRoute);
    assert.doesNotMatch(html, /class="brand-source-mark"[^>]+assets\/favicon\.svg/);
    assert.doesNotMatch(html, /class="brand-source-mark"[^>]+assets\/ink-mark\.svg/);
    assert.doesNotMatch(html, /rel="icon"[^>]+INK_MARK_SOURCE_W-300\.jpg/);
  }
  const actualSha256 = createHash('sha256').update(readBytes(approvedRoute)).digest('hex');
  assert.equal(actualSha256, approvedSha256);
});

test('G8 compact file commands and build identity are isolated to the accepted contract', () => {
  assert.match(css, /@media\(max-width:760px\)\{[\s\S]*?#newBtn,#openBtn,#saveBtn\{display:none\}[\s\S]*?#exportBtn\{display:flex\}/);
  const configBuild = config.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  const workerBuild = serviceWorker.match(/const BUILD_ID = '([^']+)'/)?.[1];
  assert.equal(configBuild, '20260925-ui-rebuild-001-g8-runtime-r1');
  assert.equal(workerBuild, configBuild);
  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  assert.match(serviceWorker, /const PRODUCT_VERSION = '0\.1';/);
});

test('G8 Runtime QA uses current DOM keyboard typography and compact-toolbar contracts', () => {
  assert.match(runtimeUiHarness, /escapeMenuItem\?\.dispatchEvent\(new win\.KeyboardEvent\('keydown'/);
  assert.doesNotMatch(runtimeUiHarness, /dispatchKey\(win, 'Escape'\)/);
  assert.match(runtimeUiHarness, /getPropertyValue\('--ui-font'\)\.trim\(\)/);
  assert.doesNotMatch(runtimeUiHarness, /item\.family\.includes\('Inter'\)/);
  assert.match(runtimeUiHarness, /compact toolbar resolves to effective single mode without requiring legacy rail hiding/);
  assert.doesNotMatch(runtimeUiHarness, /getComputedStyle\(doc\.querySelector\('\.tool-rail'\)\)\.display === 'none'/);
});

test('G8 Runtime batch emits bounded browser-native UI visual evidence', () => {
  for (const file of ['ui-first-paint.png','ui-1280x1024.png','ui-960x800.png']) assert.ok(runtimeBatch.includes(file));
  assert.match(runtimeBatch, /BROWSER_NATIVE_HEADLESS_SCREENSHOT/);
  assert.match(runtimeBatch, /--blink-settings=scriptEnabled=false/);
  assert.match(runtimeBatch, /--window-size=\$\{spec\.width\},\$\{spec\.height\}/);
  assert.match(runtimeBatch, /--screenshot=\$\{output\}/);
  assert.match(runtimeBatch, /report\.uiVisualEvidence = entry\.visualCaptures/);
  assert.match(runtimeBatch, /assertUiPng\(bytes, spec\.width, spec\.height\)/);
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
