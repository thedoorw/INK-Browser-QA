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

test('contextual coordinator parses and re-hosts only existing command-bearing nodes', () => {
  assert.doesNotThrow(() => new Function(shell));
  assert.match(shell, /CONTEXT_CONTROL_IDS = Object\.freeze\(\['quickControls', 'eraserOptions', 'shapeOptions', 'textOptions', 'selectionBar'\]\)/);
  assert.match(shell, /node && node\.parentElement !== host/);
  assert.match(shell, /host\.append\(node\)/);
  assert.doesNotMatch(ink, /contextualOptions|contextualControlHost|contextualAdvancedBtn/);

  for (const html of [web, portable]) {
    for (const id of ['quickColorInput', 'quickSizeInput', 'quickOpacityInput', 'shapeFill', 'fontFamily', 'fontSize', 'selectionBar']) {
      assert.equal(html.split(`id="${id}"`).length - 1, 1, `Existing command ID must remain unique: ${id}`);
    }
  }
});

test('drawing, eraser, shape, text and selection reuse existing authoritative bindings', () => {
  assert.match(ink, /\$\('#quickSizeInput'\)\.oninput=e=>this\.updateBrushSetting\('size',\+e\.target\.value\)/);
  assert.match(ink, /\$\('#quickOpacityInput'\)\.oninput=e=>this\.updateBrushSetting\('opacity',\+e\.target\.value\/100\)/);
  assert.match(ink, /\$\('#quickColorInput'\)\.oninput=e=>this\.setColor\(e\.target\.value,false\)/);
  assert.match(ink, /\$\$\('\[data-eraser-mode\]'\)\.forEach/);
  assert.match(ink, /\$\$\('\[data-shape\]'\)\.forEach/);
  assert.match(ink, /\$\('#shapeFill'\)\.onchange=e=>this\.shapeFill=e\.target\.checked/);
  assert.match(ink, /\$\('#fontFamily'\)\.onchange=e=>this\.font\.family=e\.target\.value/);
  assert.match(ink, /\$\('#fontSize'\)\.oninput=e=>\{this\.font\.size=\+e\.target\.value/);
  assert.match(ink, /runSelectionAction\(action\)\{const actions=\{duplicate:\(\)=>this\.duplicateSelection\(\),group:\(\)=>this\.groupSelection\(\),front:\(\)=>this\.reorderSelection\('front'\),alignCenter:\(\)=>this\.alignSelection\('centerX'\),delete:\(\)=>this\.deleteSelection\(\)\}/);
  assert.match(ink, /eraserRadiusWorld\(\)\{return Math\.max\(3,this\.toolSettings\[this\.lastDrawTool\]\.size\*\.9\)\/2;\}/);
});

test('context matrix exposes only the requested high-frequency surface', () => {
  for (const html of [web, portable]) {
    for (const control of ['color', 'size', 'opacity']) assert.ok(html.includes(`data-context-control="${control}"`));
    for (const mode of ['segment', 'object']) assert.ok(html.includes(`data-eraser-mode="${mode}"`));
    for (const shape of ['line', 'arrow', 'rect', 'ellipse', 'triangle']) assert.ok(html.includes(`data-shape="${shape}"`));
    for (const action of ['duplicate', 'group', 'front', 'alignCenter', 'delete']) assert.ok(html.includes(`data-selection-action="${action}"`));
  }

  for (const mode of ['draw', 'eraser', 'shape', 'text', 'selection']) assert.match(css, new RegExp(`data-context-mode="${mode}"`));
  assert.match(css, /data-context-mode="eraser"[\s\S]+data-context-control="color"/);
  assert.match(css, /data-context-mode="shape"[\s\S]+data-context-control="size"/);
  assert.match(css, /data-context-mode="text"[\s\S]+data-context-control="opacity"/);
  assert.match(shell, /app\.selection\?\.length \? 'object' : 'brush'/);
  assert.match(shell, /advanced\.hidden = !\['draw', 'eraser', 'shape', 'text', 'selection'\]\.includes/);
});

test('contextual geometry is shared while format and delivery identity stay unchanged', () => {
  assert.match(css, /--contextual-h:36px/);
  assert.match(css, /\.stage-wrap\{top:calc\(var\(--topbar-h\) \+ var\(--contextual-h\)\)\}/);
  assert.match(css, /\.panel-dock,[\s\S]+top:calc\(var\(--topbar-h\) \+ var\(--contextual-h\)\)/);
  assert.match(web, /INK v0\.1 · Web/);
  assert.match(portable, /INK v0\.1 · Portable/);
  assert.match(read('src/config.js'), /FORMAT_VERSION\s*=\s*4\b/);
});
