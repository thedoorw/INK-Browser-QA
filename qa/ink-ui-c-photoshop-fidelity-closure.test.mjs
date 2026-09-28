import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { UI_B_GAP_IDS, UI_B_PUI_IDS, UI_B_CONTRIBUTION_REPORT } from '../product/source/ui/capability-contributions.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'..');
const read=relative=>fs.readFileSync(path.join(repo,relative),'utf8');
const css=read('product/source/styles.css');
const webShell=read('product/source/web-shell.js');
const shell=read('product/source/shell.template.html');
const config=read('product/source/src/config.js');
const serviceWorker=read('product/source/service-worker.js');
const controls=read('product/source/ui/full-capability-controls.js');

test('UI-C preserves Photoshop reference geometry and fine-detail density',()=>{
  for(const token of [
    '--menu-content-h:24px','--menu-h:25px','--options-content-h:35px','--options-h:36px','--topbar-h:61px',
    '--document-tab-h:29px','--ruler-size:17px','--document-status-h:17px',
    '--tool-single-w:40px','--tool-double-w:73px','--panel-dock-w:40px','--panel-expanded-w:252px',
    '--ui-panel-head-h:28px','--panel-splitter-size:3px'
  ]) assert.ok(css.includes(token),token);
  assert.match(css,/\.tool-rail \.tool-button\{width:31px;height:26px/);
  assert.match(css,/\.subtool-button\{height:20px/);
  assert.match(css,/\.layer-row\{min-height:35px/);
  assert.match(css,/\.history-step\{min-height:23px/);
  assert.match(css,/::-webkit-scrollbar\{width:16px;height:16px/);
});

test('Photoshop Light semantic palette has one global authority',()=>{
  for(const [token,value] of [
    ['--ink-ui-bg-base','#E9E9E9'],['--ink-ui-surface','#FFFFFF'],['--ink-ui-accent','#3B63FB']
  ]){
    assert.equal(css.split(token+':').length-1,1,token);
    assert.ok(css.includes(token+':'+value),token+' value');
  }
  const compact=css.match(/@media\(max-width:760px\)\{\n  html,body,\.app\{background:var\(--ink-ui-bg-base\)[\s\S]*?\n\}/)?.[0]||'';
  assert.ok(compact.length>1000,'compact Light authority missing');
  assert.match(compact,/\.mobile-dock\{background:var\(--ink-ui-surface-subtle\)/);
  assert.match(compact,/\.mobile-tool-sheet,\.inspector,\.pages-panel,\.floating-panel,\.dialog\{background:var\(--ink-ui-surface\)/);
});

test('UI-B controls inherit semantic Light grammar without a private gray palette',()=>{
  const section=css.split('INK-UI-B-FULL-CAPABILITY-CONTROLS-001')[1]||'';
  assert.ok(section.length>100);
  assert.doesNotMatch(section,/#[0-9a-fA-F]{3,6}\b/);
  assert.doesNotMatch(section,/!important/);
  assert.doesNotMatch(section,/@media[^\{]*(?:min|max)-width/);
  assert.doesNotMatch(section,/font-size\s*:\s*\d+(?:\.\d+)?px/);
  assert.match(section,/outline:1px solid var\(--ink-ui-focus\)/);
  assert.match(section,/color:var\(--ink-ui-text-disabled\)/);
});

test('UI-C closes required shell interaction surfaces on existing authorities',()=>{
  assert.match(webShell,/function ensureTooltipController\(\)/);
  assert.match(webShell,/function bindRulerGuideDrag\(\)/);
  assert.match(webShell,/app\.addGuide\?\.\(\{ orientation, position: value \}\)/);
  assert.match(webShell,/data-ruler-axis="horizontal"/);
  assert.match(webShell,/data-ruler-axis="vertical"/);
  assert.match(webShell,/const stackMove = event =>/);
  assert.match(webShell,/data-panel-stack-splitter/);
  assert.match(webShell,/camera\.x = start\.camX/);
  assert.match(webShell,/event\.key === 'Escape'/);
  assert.match(css,/\.shell-tooltip\{/);
  assert.match(css,/\.shell-guide-readout\{/);
  assert.match(css,/cursor:ns-resize/);
  assert.match(css,/\.layer-row\.drop-before::before,\.layer-row\.drop-after::after\{background:var\(--ink-ui-accent\)/);
});

test('responsive taxonomy remains exactly the authorized width family',()=>{
  const widths=[...css.matchAll(/(?:min|max)-width\s*:\s*(\d+)px/g)].map(match=>Number(match[1]));
  for(const width of new Set(widths)) assert.ok([760,761,1120].includes(width),'unauthorized width '+width);
  assert.ok(widths.includes(760));
  assert.ok(widths.includes(761));
  assert.ok(widths.includes(1120));
});

test('UI-B PUI/GAP coverage and contribution boundary remain intact',()=>{
  assert.equal(UI_B_PUI_IDS.length,74);
  assert.equal(UI_B_PUI_IDS[0],'PUI-001');
  assert.equal(UI_B_PUI_IDS.at(-1),'PUI-074');
  assert.equal(UI_B_GAP_IDS.length,34);
  assert.equal(UI_B_GAP_IDS[0],'G-01');
  assert.equal(UI_B_GAP_IDS.at(-1),'G-34');
  assert.equal(new Set(UI_B_CONTRIBUTION_REPORT.contributionIds).size,UI_B_CONTRIBUTION_REPORT.contributionIds.length);
  assert.doesNotMatch(controls,/remote plugin|marketplace|plugin sandbox|permission system/i);
});

test('build/cache identity advances without FORMAT_VERSION or brand drift',()=>{
  const configBuild=config.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  const swBuild=serviceWorker.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  assert.equal(configBuild,'20260928-ui-c-photoshop-fidelity-closure-001');
  assert.equal(swBuild,configBuild);
  assert.match(config,/FORMAT_VERSION\s*=\s*4\b/);
  assert.match(shell,/assets\/INK_MARK_SOURCE_W-300\.jpg\?v=0\.1/);
  assert.match(shell,/assets\/favicon\.svg\?v=0\.1/);
  assert.doesNotMatch(shell,/Adobe/i);
});

test('shell authority and generated Web/Portable parity remain intact',()=>{
  const ids=[...shell.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length);
  const generate=(template,delivery,manifest,badge,runtime)=>template.replace(/\{\{([A-Z_]+)\}\}/g,(match,name)=>{
    const substitutions={DELIVERY:delivery,MANIFEST:manifest,WEB_BADGE:badge,RUNTIME_SCRIPT:runtime};
    if(!(name in substitutions))throw new Error('Unknown shell token: '+name);
    return substitutions[name];
  });
  assert.equal(read('product/source/index.html'),generate(shell,'Web','manifest.webmanifest','<span class="web-surface-badge">WEB</span>','<script type="module" src="src/ink.js?v=0.1"></script>'));
  assert.equal(read('product/source/index-standalone.html'),generate(shell,'Portable','manifest-portable.webmanifest','','<script src="dist/ink.compat.js?v=0.1"></script>'));
});
