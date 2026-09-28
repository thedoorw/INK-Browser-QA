import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const read = relative => readFileSync(join(root, relative), 'utf8');
const shell = read('product/source/shell.template.html');
const css = read('product/source/styles.css');
const webShell = read('product/source/web-shell.js');
const ink = read('product/source/src/ink.js');
const indexWeb = read('product/source/index.html');
const indexPortable = read('product/source/index-standalone.html');

const expectedMenus = ['file','edit','image','layer','type','select','filter','object','view','window','help'];
const menuIds = [...shell.matchAll(/data-application-menu-trigger="([^"]+)"/g)].map(match => match[1]);
assert.deepEqual(menuIds, expectedMenus, 'top menu host order must match UI-A Photoshop workpack');
assert.ok(!shell.includes('data-application-menu-trigger="brush"'), 'Brush must not remain a top-level menu');

const panelBlock = webShell.match(/const PANEL_DEFS = Object\.freeze\(\[([\s\S]*?)\]\);/)?.[1] || '';
const panelIds = [...panelBlock.matchAll(/\{ id: '([^']+)'/g)].map(match => match[1]);
assert.deepEqual(panelIds, [
  'properties','layers','history','navigator','pages','color','channels','adjustments',
  'libraries','reference','compose','chat','revision','specialist'
], 'right panel inventory must expose one final placement home per UI-A workpack');

for (const token of [
  '--menu-content-h:24px','--menu-h:25px','--options-content-h:35px','--options-h:36px','--topbar-h:61px',
  '--document-tab-h:29px','--ruler-size:17px','--document-status-h:17px',
  '--tool-single-w:40px','--tool-double-w:73px','--panel-dock-w:40px','--panel-expanded-w:252px',
  '--ui-panel-head-h:28px'
]) assert.ok(css.includes(token), `missing measured geometry token: ${token}`);

assert.ok(css.includes('.app.panel-primary-open .stage-wrap{right:var(--active-panel-w)}'), 'expanded panel must reflow canvas without additive collapsed dock');
assert.ok(css.includes('.app[data-document-active="false"] .statusbar{display:none}'), 'status must be active-document-only');
assert.ok(css.includes('.topbar .history-group{display:none!important}'), 'desktop Undo/Redo duplicates must be retired');
assert.ok(css.includes('.file-group .desktop-file{display:none!important}'), 'desktop New/Open/Save duplicates must be retired');
assert.ok(css.includes('#pagesToggle,#inspectorToggle.legacy-inspector-toggle{display:none!important}'), 'legacy desktop panel openers must be retired');
assert.ok(css.includes('--ink-ui-bg-base:#E9E9E9') && css.includes('--ink-ui-surface:#FFFFFF') && css.includes('--ink-ui-accent:#3B63FB'), 'light semantic authority anchors missing');

assert.ok(webShell.includes("action === 'toggle-rulers'"), 'View > Rulers route missing');
assert.ok(webShell.includes('app.switchPage?.') && webShell.includes('app.addPage?.') && webShell.includes('app.duplicatePage?.') && webShell.includes('app.deletePage?.'), 'Pages panel must route to existing document APIs');
assert.ok(webShell.includes('const camera = app.page().camera') && webShell.includes('app.renderer?.render?.()'), 'Navigator panel must route to existing viewport authority');
assert.ok(webShell.includes('app.setColor?.'), 'Color panel must route to existing color authority');
assert.ok(webShell.includes('data-panel-option="reset-width"') && webShell.includes('data-panel-option="close"'), 'panel options menu requires reset width and close');
assert.ok(ink.includes("globalThis.INK_WEB_SHELL?.toggle?.('pages')"), 'desktop Pages shortcut/opener must converge on shell router');

const generate = (template, delivery, manifest, badge, runtime) => template.replace(/\{\{([A-Z_]+)\}\}/g, (match, name) => {
  const substitutions = { DELIVERY: delivery, MANIFEST: manifest, WEB_BADGE: badge, RUNTIME_SCRIPT: runtime };
  if (!(name in substitutions)) throw new Error(`Unknown shell token: ${name}`);
  return substitutions[name];
});
assert.equal(indexWeb, generate(shell, 'Web', 'manifest.webmanifest', '<span class="web-surface-badge">WEB</span>', '<script type="module" src="src/ink.js?v=0.1"></script>'));
assert.equal(indexPortable, generate(shell, 'Portable', 'manifest-portable.webmanifest', '', '<script src="dist/ink.compat.js?v=0.1"></script>'));

console.log('PASS ink-ui-a-photoshop-shell-panels static/focused QA');
