import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const sourceRoot = resolve(repoRoot, 'product/source');
const read = name => readFileSync(resolve(sourceRoot, name), 'utf8');

const template = read('shell.template.html');
const web = read('index.html');
const portable = read('index-standalone.html');
const shell = read('web-shell.js');
const css = read('styles.css');

test('Phase C file commands use File menu as desktop Primary Home', () => {
  assert.match(template, /id="fileMenuToggle"[^>]+aria-haspopup="menu"/);
  for (const command of ['new','open','save','export']) {
    assert.equal((template.match(new RegExp(`data-file-command="${command}"`, 'g')) || []).length, 1);
  }
  assert.match(shell, /FILE_COMMAND_TARGETS = Object\.freeze\(\{[\s\S]*?new: 'newBtn',[\s\S]*?open: 'openBtn',[\s\S]*?save: 'saveBtn',[\s\S]*?export: 'exportBtn'/);
  assert.match(shell, /const target = targetId \? document\.getElementById\(targetId\) : null;[\s\S]*?if \(target\) target\.click\(\)/);
  assert.match(css, /\.file-group \.desktop-file,\.file-group #exportBtn\{display:none\}/);
});

test('Phase C preserves contextual options and removes equal-weight desktop workspace duplication', () => {
  assert.equal((template.match(/id="contextualOptions"/g) || []).length, 1);
  assert.match(template, /id="workspaceMenu"[^>]+role="menu"/);
  assert.match(template, /data-workspace-command="creation"/);
  assert.match(template, /data-workspace-command="layout"/);
  assert.match(template, /id="workspaceSwitch"/);
  assert.match(css, /\.topbar-center \.workspace-switch\{display:none\}/);
  assert.match(css, /--menu-h:24px;[\s\S]*?--options-h:32px;[\s\S]*?--topbar-h:56px;/);
  assert.match(css, /\.topbar \.history-group \.icon-button\{width:24px;height:24px\}/);
});

test('Phase D toolbar keeps tool and Draw-family identity while changing layout only', () => {
  const rail = template.match(/<nav class="tool-rail[\s\S]*?<\/nav>/)?.[0] || '';
  const tools = [...rail.matchAll(/data-tool="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(tools, ['pen','eraser','select','lasso','shape','text','image','pan']);
  const family = template.match(/id="brushFamilyPopover"[\s\S]*?<\/section>/)?.[0] || '';
  const subtools = [...family.matchAll(/data-subtool="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(subtools, ['pen','pencil','marker','brush','airbrush']);
  assert.match(template, /id="toolRailColumnsToggle"[^>]+aria-pressed="false"/);
  assert.match(shell, /TOOLBAR_COLUMNS_KEY = 'ink\.web\.ui\.toolbar-columns\.v0\.1'/);
  assert.match(shell, /Number\(localStorage\.getItem\(TOOLBAR_COLUMNS_KEY\)\) === 2 \? 2 : 1/);
  assert.match(shell, /localStorage\.setItem\(TOOLBAR_COLUMNS_KEY, String\(value\)\)/);
  const setColumns = shell.slice(shell.indexOf('function setToolRailColumns'), shell.indexOf('function bindToolRailColumns'));
  assert.doesNotMatch(setColumns, /replaceDocument|history\.|revisions?\.|FORMAT_VERSION|documentState/i);
  assert.match(css, /\.app\.tool-rail-two-column\{--tool-w:72px\}/);
  assert.match(css, /\.app\.tool-rail-two-column \.tool-rail-tools\{[\s\S]*?grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
});

test('Phase C/D retains technical-debt regression guards', () => {
  execFileSync(process.execPath, [resolve(sourceRoot, 'generate-shell.mjs'), '--check']);
  assert.equal((css.match(/INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY/g) || []).length, 1);
  assert.equal((css.match(/INK-WEB-UI-006 Phase B — LIGHT SHELL \/ ORIGINAL BRAND SOURCE/g) || []).length, 0);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
  assert.ok((css.match(/:root\s*\{/g) || []).length <= 14);
  assert.ok((css.match(/!important/g) || []).length <= 222);
  assert.match(shell, /RUNTIME_READY_EVENT = 'ink:runtime-ready'/);
  assert.doesNotMatch(shell, /retryCount|setTimeout\(tryBind/);
  assert.equal(web.includes('id="fileMenu"'), true);
  assert.equal(portable.includes('id="fileMenu"'), true);
});
