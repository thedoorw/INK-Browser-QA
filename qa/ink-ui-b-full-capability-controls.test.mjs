import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  UI_B_MENU_CONTRIBUTIONS, UI_B_TOOL_GROUPS, UI_B_DIALOGS, UI_B_REQUIRED_PANELS,
  UI_B_GAP_IDS, UI_B_PUI_IDS, UI_B_CONTRIBUTION_REPORT
} from '../product/source/ui/capability-contributions.js';

const here=path.dirname(fileURLToPath(import.meta.url));
const repo=path.resolve(here,'..');
const read=relative=>fs.readFileSync(path.join(repo,relative),'utf8');

const controls=read('product/source/ui/full-capability-controls.js');
const rasterTools=read('product/source/ui/capability-raster-tools.js');
const webShell=read('product/source/web-shell.js');
const ink=read('product/source/src/ink.js');
const config=read('product/source/src/config.js');
const serviceWorker=read('product/source/service-worker.js');
const css=read('product/source/styles.css');
const shell=read('product/source/shell.template.html');

function routed(command){
  const exact=[...controls.matchAll(/command==='([^']+)'/g)].map(match=>match[1]);
  const prefixes=[...controls.matchAll(/command\.startsWith\('([^']+)'\)/g)].map(match=>match[1]);
  return exact.includes(command)||prefixes.some(prefix=>command.startsWith(prefix));
}

test('UI-B planning identity coverage is exact',()=>{
  assert.equal(UI_B_PUI_IDS.length,74);
  assert.equal(UI_B_PUI_IDS[0],'PUI-001');
  assert.equal(UI_B_PUI_IDS.at(-1),'PUI-074');
  assert.equal(new Set(UI_B_PUI_IDS).size,74);
  assert.equal(UI_B_GAP_IDS.length,34);
  assert.equal(UI_B_GAP_IDS[0],'G-01');
  assert.equal(UI_B_GAP_IDS.at(-1),'G-34');
  assert.equal(new Set(UI_B_GAP_IDS).size,34);
});

test('UI-B contribution registry is bounded and internally unique',()=>{
  assert.equal(UI_B_CONTRIBUTION_REPORT.menuCount,UI_B_MENU_CONTRIBUTIONS.length);
  assert.equal(UI_B_CONTRIBUTION_REPORT.toolGroupCount,UI_B_TOOL_GROUPS.length);
  assert.equal(UI_B_CONTRIBUTION_REPORT.dialogCount,UI_B_DIALOGS.length);
  assert.equal(UI_B_CONTRIBUTION_REPORT.panelCount,UI_B_REQUIRED_PANELS.length);
  assert.equal(new Set(UI_B_CONTRIBUTION_REPORT.contributionIds).size,UI_B_CONTRIBUTION_REPORT.contributionIds.length);
  assert.ok(UI_B_MENU_CONTRIBUTIONS.some(item=>item.menu==='filter'&&item.command==='filter-gallery'));
  assert.ok(UI_B_MENU_CONTRIBUTIONS.some(item=>item.menu==='image'&&item.command==='color-profile'));
  assert.ok(UI_B_MENU_CONTRIBUTIONS.some(item=>item.menu==='layer'&&item.command==='layer-effects'));
  assert.ok(UI_B_MENU_CONTRIBUTIONS.some(item=>item.menu==='help'&&item.command==='recovery'));
});

test('all visible UI-B menu contributions route to implemented dispatch paths',()=>{
  const missing=[...new Set(UI_B_MENU_CONTRIBUTIONS.map(item=>item.command))].filter(command=>!routed(command));
  assert.deepEqual(missing,[]);
});

test('normal creative tool groups cover promoted P1 families',()=>{
  const groups=new Map(UI_B_TOOL_GROUPS.map(group=>[group.id,group]));
  for(const id of ['draw','lasso','smart-selection','fill','sampling','clone','healing','tone','detail','shape','text'])assert.ok(groups.has(id),id);
  const tools=new Set(UI_B_TOOL_GROUPS.flatMap(group=>group.tools.map(([id])=>id)));
  for(const id of [
    'blender','smudge','polygonalLasso','magneticLasso','quickSelection','magicWand','objectSelection',
    'gradient','paintBucket','eyedropper','colorSampler','measure','cloneStamp','patternStamp',
    'healingBrush','spotHealing','patch','dodge','burn','sponge','localBlur','localSharpen','colorReplacement',
    'shape:line','shape:arrow','shape:rect','shape:ellipse','shape:triangle',
    'text:horizontal-tb','text:vertical-rl','text:vertical-lr'
  ])assert.ok(tools.has(id),id);
});

test('UI-B dialogs and Photoshop shell panels are explicit',()=>{
  for(const id of ['select-and-mask','layer-effects','filter-params','filter-gallery','liquify','gradient-editor','pattern-editor','color-profile','image-size','image-crop','advanced-transform','keyboard-shortcuts','pen-calibration','recovery'])assert.ok(UI_B_DIALOGS.includes(id),id);
  for(const id of ['properties','layers','history','navigator','pages','color','channels','adjustments','libraries','reference','compose','chat','revision','specialist']){
    assert.ok(UI_B_REQUIRED_PANELS.includes(id),id);
    assert.match(webShell,new RegExp("id:\\s*['\"]"+id+"['\"]"));
  }
});

test('UI-B is mounted through existing app and shell authorities',()=>{
  assert.match(ink,/installFullCapabilityControls\(this\)/);
  assert.match(webShell,/closeMenus:\s*closeApplicationMenus/);
  assert.match(controls,/if\(shell\?\.closeMenus\)shell\.closeMenus\(\)/);
  assert.doesNotMatch(controls,/document\.querySelectorAll\('\.application-menu\.open'\)/);
});

test('P1 image tools delegate to existing image-core exports',()=>{
  for(const symbol of ['magicWandSelection','quickSelection','polygonalLassoSelection','magneticLassoSelection','objectSelection','refineRasterSelection','sampleRasterColor','gradientFill','paintBucketFill','cloneStamp','patternStamp','healingBrush','spotHealing','patchRaster','dodge','burn','sponge','localBlur','localSharpen','colorReplacementBrush'])assert.match(rasterTools,new RegExp('\\b'+symbol+'\\b'),symbol);
  assert.match(controls,/createLiquifyFilter/);
  assert.match(controls,/createLayerEffect/);
  assert.match(controls,/createAdjustment/);
  assert.match(controls,/createFilter/);
});

test('bounded unsupported interoperability is explicit rather than fake success',()=>{
  assert.match(controls,/PSB encode requires a registered adapter/);
  assert.match(controls,/RAW export is not supported/);
  assert.match(controls,/Multichannel conversion requires explicit channel construction/);
  assert.match(controls,/app\.importImageFormat/);
  assert.match(controls,/app\.exportImageFormat/);
});

test('high-resolution export keeps existing cancel authority and exposes checkpoint resume',()=>{
  assert.match(controls,/state\.resumableExportJob/);
  assert.match(controls,/job\.resume\(/);
  assert.match(controls,/uiBResumeExportBtn/);
  assert.match(ink,/TiledExportJob/);
  assert.match(ink,/cancelExportBtn/);
});

test('build identity and cache inventory are synchronized without FORMAT_VERSION change',()=>{
  const configBuild=config.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  const swBuild=serviceWorker.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  assert.ok(configBuild,'BUILD_ID must remain explicit');
  assert.equal(swBuild,configBuild);
  assert.match(config,/FORMAT_VERSION\s*=\s*4\b/);
  for(const module of ['./ui/capability-contributions.js','./ui/capability-raster-tools.js','./ui/full-capability-controls.js'])assert.ok(serviceWorker.includes(module),module);
});

test('UI-B CSS adds no presentation important, width family, or px font authority',()=>{
  const section=(css.split('INK-UI-B-FULL-CAPABILITY-CONTROLS-001')[1]||'').split('/* Issue #92 Libraries panel')[0];
  assert.ok(section.length>100);
  assert.doesNotMatch(section,/!important/);
  assert.doesNotMatch(section,/@media[^\{]*(?:min|max)-width/);
  assert.doesNotMatch(section,/font-size\s*:\s*\d+(?:\.\d+)?px/);
});

test('shell markup keeps unique literal DOM ids',()=>{
  const ids=[...shell.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]),seen=new Set(),duplicates=[];
  for(const id of ids){if(seen.has(id)&&!duplicates.includes(id))duplicates.push(id);seen.add(id);}
  assert.deepEqual(duplicates,[]);
});

test('UI-B contribution boundary remains bounded and P2-free',()=>{
  const contributionSource=read('product/source/ui/capability-contributions.js');
  assert.match(contributionSource,/validateUiBContributions/);
  assert.match(contributionSource,/INK_UI_B_DUPLICATE_CONTRIBUTION_ID/);
  assert.doesNotMatch(controls,/remote plugin|marketplace|plugin sandbox|permission system/i);
});

test('Object menu proxy routes target existing source controls',()=>{
  const commands=UI_B_MENU_CONTRIBUTIONS.map(item=>item.command).filter(command=>command.startsWith('proxy:'));
  for(const command of commands){
    const id=command.slice(6);
    assert.ok(shell.includes('id="'+id+'"'),id);
  }
  assert.ok(UI_B_MENU_CONTRIBUTIONS.some(item=>item.command==='align:distributeX'));
  assert.ok(UI_B_MENU_CONTRIBUTIONS.some(item=>item.command==='frame-selection'));
});

test('brand and favicon authorities remain unchanged',()=>{
  const web=read('product/source/index.html');
  const portable=read('product/source/index-standalone.html');
  const favicon=read('product/source/assets/favicon.svg');
  for(const source of [shell,web,portable]){
    assert.match(source,/assets\/INK_MARK_SOURCE_W-300\.jpg\?v=0\.1/);
    assert.match(source,/assets\/favicon\.svg\?v=0\.1/);
  }
  assert.match(favicon,/width="32" height="32"/);
  assert.match(favicon,/#69BFE3/i);
  assert.match(favicon,/#FFFFFF/i);
  assert.doesNotMatch(shell,/Adobe/i);
});

test('review findings for recovery and dialog Escape are closed',()=>{
  assert.match(controls,/source:source\.name,\.\.\.verifyStorageRecord/);
  assert.match(controls,/Array\.from\(document\.querySelectorAll\('\.ui-b-dialog'\)\)\.find/);
  assert.doesNotMatch(controls,/const open=\$\('\.ui-b-dialog'\)\.find/);
});
