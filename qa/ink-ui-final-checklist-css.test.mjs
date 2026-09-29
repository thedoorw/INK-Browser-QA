import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync('product/source/styles.css', 'utf8');
const importantRules = [...css.matchAll(/([^{}]+)\{([^{}]*!important[^{}]*)\}/g)].flatMap(([, selector, declarations]) =>
  [...declarations.matchAll(/([\w-]+):([^;{}]*?)!important/g)].map(([, property, value]) => ({ selector: selector.trim(), property, value: value.trim() }))
);

assert.equal(importantRules.length, 30, 'inventory all retained semantic importance declarations');
for (const { selector, property, value } of importantRules) {
  assert.ok(['display', 'animation', 'transition'].includes(property), `presentation !important in ${selector}: ${property}`);
  if (property === 'display') assert.ok(['none', 'grid', 'flex'].includes(value), `unexpected state display in ${selector}`);
  if (property === 'animation') assert.equal(value, 'none');
  if (property === 'transition') {
    assert.equal(value, 'none');
    assert.ok(selector === '*' || selector.includes('.app.panel-width-resizing'), `transition exception lacks semantic state: ${selector}`);
  }
}

assert.match(css, /\.document-status-info\{gap:8px\}/);
assert.match(css, /\.shell-panel-section\{padding:0;overflow:hidden\}/);
const orphanContextHide = '#quickControls,#selectionBar,#eraserOptions,#shapeOptions,#textOptions{display:none}';
assert.ok(css.includes(orphanContextHide), 'legacy contextual controls must be hidden before JS mount');
assert.ok(css.indexOf(orphanContextHide) < css.indexOf('.contextual-options #quickControls'), 'mounted contextual authority must follow first-paint concealment');
for (const rule of [
  '.panel-dock-button{color:var(--ink-ui-text-muted)}',
  '.inspector-head strong,.creative-workspace-head strong{color:var(--ink-ui-text)}',
  'width:162px;padding:2px;background:var(--ink-ui-surface);border:1px solid var(--ink-ui-border-strong)',
  '.panel-options-menu button:hover,.panel-options-menu button:focus-visible{background:var(--ink-ui-control-hover);outline:none}',
  '.shell-panel-footer button{height:22px;padding:0 7px;border-radius:1px;background:var(--ink-ui-surface);border:1px solid var(--ink-ui-border)',
  'scrollbar-color:var(--ink-ui-scrollbar-thumb) var(--ink-ui-surface-subtle)'
]) assert.ok(css.includes(rule), `Light role must use semantic token: ${rule}`);

assert.match(css, /@media\(prefers-reduced-motion:reduce\)\{\*\{animation:none!important;transition:none!important\}\}/);
const finalLightRules = css.slice(css.indexOf('INK-UI-A-PHOTOSHOP-SHELL-PANELS-001'), css.indexOf('INK-UI-B-FULL-CAPABILITY-CONTROLS-001'));
assert.doesNotMatch(finalLightRules, /#(?:555|303030|ddd|c9c9c9)\b/i, 'final Light shell must not bypass semantic gray roles');

console.log('PASS ink-ui-final-checklist-css AB02/AO03 focused QA');
