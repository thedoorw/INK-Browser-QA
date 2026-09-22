import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, 'product/source', name), 'utf8');
const web = read('index.html');
const portable = read('index-standalone.html');

function replaceExactlyOnce(html, from, to) {
  assert.equal(html.split(from).length - 1, 1, `Expected one explicit delivery field: ${from}`);
  return html.replace(from, to);
}

function normalize(html, delivery) {
  html = html.replace(/\r\n/g, '\n');
  const label = `INK v0.1 · ${delivery}`;
  // Only these complete, named fields can differ. Never strip arbitrary script,
  // style, text, data attributes, or an entire branding/toolbar subtree.
  for (const [from, to] of [
    [`<meta name="application-name" content="${label}">`, '<meta name="application-name" content="INK v0.1">'],
    [`<title>${label}</title>`, '<title>INK v0.1</title>'],
    [`<div class="menu-app-mark" aria-label="${label}">`, '<div class="menu-app-mark" aria-label="INK v0.1">'],
    [`<div class="brand" aria-label="${label}">`, '<div class="brand" aria-label="INK v0.1">'],
    [`<span class="version-badge">v0.1 · ${delivery}</span>`, '<span class="version-badge">v0.1</span>'],
    [`<link rel="manifest" href="${delivery === 'Web' ? 'manifest' : 'manifest-portable'}.webmanifest?v=0.1">`, '<link rel="manifest" href="DELIVERY_MANIFEST">'],
    [delivery === 'Web' ? '<script type="module" src="src/ink.js?v=0.1"></script>' : '<script src="dist/ink.compat.js?v=0.1"></script>', '<script src="DELIVERY_BOOT"></script>']
  ]) html = replaceExactlyOnce(html, from, to);
  if (delivery === 'Web') html = replaceExactlyOnce(html, '<span class="web-surface-badge">WEB</span>', '');
  return html;
}

function parity(webHtml, portableHtml) {
  assert.equal(normalize(webHtml, 'Web'), normalize(portableHtml, 'Portable'), 'Shared shell drift outside the explicit delivery allowlist');
}

test('entire Portable/Web shell matches after exact delivery-only normalization', () => {
  parity(web, portable);
  const requiredIds = ['app', 'stageWrap', 'stage', 'pagesToggle', 'pagesList', 'drawToolButton', 'drawToolUse', 'drawToolLabel', 'contextualOptions', 'contextualToolUse', 'contextualToolName', 'contextualControlHost', 'contextualAdvancedBtn', 'quickControls', 'quickColorInput', 'quickSizeInput', 'quickOpacityInput', 'selectionBar', 'inspector', 'inspectorToggle', 'layersList', 'historyList', 'historyLimit', 'docTitle', 'projectInput', 'imageInput', 'fullscreenToggle'];
  for (const html of [web, portable]) {
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, 'Command/region IDs must be unique');
    for (const id of requiredIds) assert.ok(ids.includes(id), `Missing required hook: ${id}`);
    for (const region of ['menu-strip', 'topbar', 'contextual-options', 'tool-rail', 'stage-wrap', 'inspector', 'statusbar', 'mobile-dock']) assert.match(html, new RegExp(`class="[^"\\n]*\\b${region}\\b`));
    for (const tool of ['pen', 'eraser', 'select', 'lasso', 'shape', 'text', 'image', 'pan']) assert.ok(html.includes(`data-tool="${tool}"`));
    for (const tab of ['layers', 'history']) {
      assert.ok(html.includes(`data-tab="${tab}"`));
      assert.ok(html.includes(`data-content="${tab}"`));
    }
    assert.ok(html.includes('data-tool-stack="draw"'));
    for (const tag of ['<link rel="stylesheet" href="styles.css?v=0.1">', '<script src="web-shell.js?v=0.1" defer></script>', '<link rel="icon" href="assets/ink-mark.svg?v=0.1" type="image/svg+xml" sizes="any">']) assert.equal(html.split(tag).length - 1, 1);
  }
});

test('shared dynamic dock and Creative Workspace remain reachable and contained', () => {
  const coordinator = read('web-shell.js');
  assert.match(coordinator, /dock\.id = 'panelDock'/);
  assert.match(coordinator, /appRoot\.append\(dock\)/);
  for (const [id, kind, target] of [['layers','inspector','tab'], ['history','inspector','tab'], ['reference','creative','stage'], ['compose','creative','stage'], ['chat','creative','stage'], ['revision','creative','stage']]) {
    assert.match(coordinator, new RegExp(`\\{ id: '${id}'[^\\n]+kind: '${kind}', ${target}: '${id}' \\}`));
  }
  assert.match(coordinator, /data-shell-panel=/);
  assert.match(coordinator, /creativeWorkspace\?\.setOpen\?\.\(false\)/);
  const creative = read('src/editor/creative-workspace.js');
  assert.match(creative, /this\.open = false;/);
  assert.match(creative, /root\.id = 'creativeWorkspace'/);
  assert.match(creative, /root\.setAttribute\('aria-hidden', 'true'\)/);
  assert.match(creative, /appRoot\.append\(root\)/);
  assert.match(read('src/ink.js'), /installCreativeWorkspace\(this\)/);
  const css = read('styles.css');
  assert.match(css, /\.panel-dock/);
  assert.match(css, /\.creative-workspace-panel/);
  assert.match(css, /\.brand-mark\s*\{[^}]*url\("assets\/ink-mark\.svg"\)/);
  assert.ok(existsSync(path.join(root, 'product/source/assets/ink-mark.svg')));
  assert.match(read('src/config.js'), /FORMAT_VERSION\s*=\s*4\b/);
});

test('shared contextual-options contract preserves one command surface across deliveries', () => {
  for (const html of [web, portable]) {
    for (const id of ['contextualOptions', 'contextualControlHost', 'contextualAdvancedBtn', 'quickControls', 'selectionBar', 'eraserOptions', 'shapeOptions', 'textOptions']) {
      assert.equal(html.split(`id="${id}"`).length - 1, 1, `Expected exactly one contextual hook: ${id}`);
    }
    for (const control of ['color', 'size', 'opacity']) assert.ok(html.includes(`data-context-control="${control}"`));
    for (const action of ['duplicate', 'group', 'front', 'alignCenter', 'delete']) assert.ok(html.includes(`data-selection-action="${action}"`));
    assert.match(html, /id="contextualOptions"[^>]+data-context-mode="draw"[^>]+data-context-tool="pen"/);
  }

  const coordinator = read('web-shell.js');
  assert.match(coordinator, /CONTEXT_CONTROL_IDS = Object\.freeze\(\['quickControls', 'eraserOptions', 'shapeOptions', 'textOptions', 'selectionBar'\]\)/);
  assert.match(coordinator, /host\.append\(node\)/);
  assert.match(coordinator, /descriptor\.mode === 'selection'/);
  assert.match(coordinator, /app\.toggleInspector\?\.\(true, app\.selection\?\.length \? 'object' : 'brush'\)/);
  assert.match(coordinator, /\['draw', 'eraser', 'shape', 'text', 'selection'\]/);

  const css = read('styles.css');
  for (const mode of ['draw', 'eraser', 'shape', 'text', 'selection']) assert.match(css, new RegExp(`data-context-mode="${mode}"`));
  assert.match(css, /\.stage-wrap\{top:calc\(var\(--topbar-h\) \+ var\(--contextual-h\)\)\}/);
});

test('Web-only mutations fail: structure, command hooks, tool hooks, styles, coordinator and brand', () => {
  const mutations = [
    html => html.replace('id="stageWrap"', 'id="otherStage"'),
    html => html.replace('id="historyList"', 'id="missingHistory"'),
    html => html.replace('data-tool="lasso"', 'data-tool="wrong"'),
    html => html.replace('data-content="layers"', 'data-content="other"'),
    html => html.replace('web-shell.js?v=0.1', 'other-shell.js?v=0.1'),
    html => html.replace('styles.css?v=0.1', 'web-only.css?v=0.1'),
    html => html.replace('assets/ink-mark.svg?v=0.1', 'other-mark.svg?v=0.1'),
    html => html.replace('<main id="stageWrap"', '<aside id="stageWrap"'),
    html => html.replace('</head>', '<style>.tool-rail{display:none}</style></head>'),
    html => html.replace('</body>', '<script src="web-only.js"></script></body>'),
    html => html.replace('INK v0.1 · Web</title>', 'INK v0.2 · Web</title>'),
    html => html.replace('>WEB</span>', '>CUSTOM</span>')
  ];
  for (const mutate of mutations) {
    const changed = mutate(web); assert.notEqual(changed, web);
    assert.throws(() => parity(changed, portable));
  }
  assert.throws(() => parity(web, portable.replace('data-tool="lasso"', 'data-tool="wrong"')));
});
