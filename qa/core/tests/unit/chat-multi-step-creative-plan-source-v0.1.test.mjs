import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const planSource = readFileSync(new URL('../../../../product/source/src/editor/chat-creative-plan.js', import.meta.url), 'utf8');
const workspaceSource = readFileSync(new URL('../../../../product/source/src/editor/creative-workspace.js', import.meta.url), 'utf8');
const editorIndexSource = readFileSync(new URL('../../../../product/source/src/editor/index.js', import.meta.url), 'utf8');
const inkSource = readFileSync(new URL('../../../../product/source/src/ink.js', import.meta.url), 'utf8');
const serviceWorkerSource = readFileSync(new URL('../../../../product/source/service-worker.js', import.meta.url), 'utf8');
const configSource = readFileSync(new URL('../../../../product/source/src/config.js', import.meta.url), 'utf8');

test('creative-plan module is browser-local orchestration over existing authorities', () => {
  assert.match(planSource, /INK-CHAT-CREATIVE-PLAN/);
  assert.match(planSource, /validateChatEditTaskAgainstState/);
  assert.match(planSource, /this\.app\?\.chatBoundedEdit/);
  assert.match(planSource, /revisions\?\.capture/);
  assert.match(planSource, /INK-LOCAL-PLAN-APPROVAL:/);
  assert.match(planSource, /status = 'STOPPED'/);
  assert.doesNotMatch(planSource, /\beval\s*\(/);
  assert.doesNotMatch(planSource, /new Function\s*\(/);
  assert.doesNotMatch(planSource, /\bfetch\s*\(/);
  assert.doesNotMatch(planSource, /WebSocket|XMLHttpRequest/);
});

test('runtime exports/installs plan after bounded edit and before workspace', () => {
  assert.match(editorIndexSource, /export \* from '\.\/chat-creative-plan\.js';/);
  const bounded = inkSource.indexOf('installChatBoundedEdit(this)');
  const plan = inkSource.indexOf('installChatCreativePlan(this)');
  const workspace = inkSource.indexOf('installCreativeWorkspace(this)');
  assert.ok(bounded >= 0 && plan > bounded && workspace > plan);
  assert.match(serviceWorkerSource, /\.\/src\/editor\/chat-creative-plan\.js/);
});

test('workspace exposes explicit plan review and target identities', () => {
  assert.match(workspaceSource, /Multi-step creative plan/);
  assert.match(workspaceSource, /chat-plan-approve/);
  assert.match(workspaceSource, /chat-plan-reject/);
  assert.match(workspaceSource, /chat-plan-execute/);
  assert.match(workspaceSource, /target\.objectId/);
  assert.match(workspaceSource, /startingRevisionId/);
  assert.match(workspaceSource, /endingRevisionId/);
});

test('document format version is unchanged', () => {
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
});
