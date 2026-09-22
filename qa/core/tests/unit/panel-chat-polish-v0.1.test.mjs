import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, 'product/source', name), 'utf8');

const shell = read('web-shell.js');
const css = read('styles.css');
const creative = read('src/editor/creative-workspace.js');
const ink = read('src/ink.js');

test('panel hierarchy is explicit and one primary surface remains authoritative', () => {
  assert.doesNotThrow(() => new Function(shell));
  assert.match(shell, /PANEL_GROUPS = Object\.freeze/);
  assert.match(shell, /\{ id: 'editor', label: 'Editor'/);
  assert.match(shell, /\{ id: 'creative', label: 'Creative Loop'/);
  assert.match(shell, /data-panel-group=/);
  assert.match(shell, /panel-window-group-label/);
  assert.match(shell, /app\.creativeWorkspace\?\.setOpen\?\.\(false\)/);
  assert.match(shell, /app\.toggleInspector\?\.\(false\)/);
  assert.match(shell, /enforceSinglePrimary/);
  assert.match(css, /\.app\.panel-primary-open \.stage-wrap/);
  assert.match(css, /--active-panel-w/);
});

test('creative dock routes reuse existing workspace controller without simulated UI authority', () => {
  for (const stage of ['reference', 'compose', 'chat', 'revision']) {
    assert.match(shell, new RegExp(`id: '${stage}'[^\\n]+kind: 'creative'[^\\n]+stage: '${stage}'`));
  }
  assert.match(shell, /creative\.setStage\?\.\(def\.stage\)/);
  assert.match(shell, /creative\.setOpen\?\.\(true\)/);
  assert.doesNotMatch(shell, /\.click\(\)/);
  assert.match(creative, /setOpen\(open\)/);
  assert.match(creative, /setStage\(stage\)/);
  assert.match(creative, /chat-conversation-send/);
  assert.match(creative, /chat-propose/);
  assert.match(creative, /chat-approve/);
  assert.match(creative, /chat-execute/);
  assert.match(ink, /installCreativeWorkspace\(this\)/);
});

test('creative stage presentation sync changes labels only, not CHAT state or execution semantics', () => {
  assert.match(shell, /function syncCreativePresentation\(\)/);
  assert.match(shell, /creative\.dataset\.shellStage = stage/);
  assert.match(shell, /title\.textContent = label/);
  assert.match(shell, /event\.target\.closest\('\[data-workspace-stage\]'\)/);
  assert.doesNotMatch(shell, /activeProposalId\s*=/);
  assert.doesNotMatch(shell, /activePlanId\s*=/);
  assert.doesNotMatch(shell, /conversationMessages\s*=/);
  assert.doesNotMatch(shell, /chatBoundedEdit\.[A-Za-z]+\(/);
  assert.doesNotMatch(shell, /chatCreativePlan\.[A-Za-z]+\(/);
});

test('panel spacing and CHAT visual priority remain presentation-only', () => {
  assert.match(css, /INK-WEB-UI-004 — panel hierarchy/);
  assert.match(css, /\.panel-dock-group\.group-active::before/);
  assert.match(css, /\.panel-window-group-label/);
  assert.match(css, /\.inspector-head \.eyebrow\{display:none\}/);
  assert.match(css, /\.creative-workspace-head \.eyebrow\{display:none\}/);
  assert.match(css, /\.creative-workspace-panel\[data-shell-stage="chat"\] \.creative-chat-transcript/);
  assert.match(css, /\.creative-workspace-panel\[data-shell-stage="chat"\] \.creative-workspace-prompt textarea/);
  assert.match(css, /\.contextual-options\{padding-inline:5px\}/);
  assert.match(css, /INK-UI-MAINT-001 — Photoshop shell geometry[\s\S]*?\.tool-rail\{[\s\S]*?top:var\(--topbar-h\);[\s\S]*?left:0;/);
  assert.doesNotMatch(css, /\.tool-rail\{\s*left:7px;/);
  assert.doesNotMatch(css, /display:\s*none[^}]*creative-chat-transcript/);
});

test('UI-003 contextual surface and version contracts remain intact', () => {
  assert.match(shell, /CONTEXT_CONTROL_IDS = Object\.freeze/);
  assert.match(css, /INK-WEB-UI-003 — contextual top options/);
  assert.match(read('src/config.js'), /FORMAT_VERSION\s*=\s*4\b/);
  assert.match(read('index.html'), /INK v0\.1 · Web/);
  assert.match(read('index-standalone.html'), /INK v0\.1 · Portable/);
});


test('shell state exposes creative stage exactly once and resolves active panel locally', () => {
  const stateBlock = shell.match(/state\(\) \{([\s\S]*?)return \{([\s\S]*?)\n      \};/);
  assert.ok(stateBlock, 'Expected INK_WEB_SHELL.state() return payload');
  assert.match(stateBlock[1], /const active = currentPanel\(\);/);
  assert.equal((stateBlock[2].match(/creativeStage:/g) || []).length, 1);
  assert.match(stateBlock[2], /panelGroup: active && PANEL_DEFS\.find\(def => def\.id === active\)/);
});
