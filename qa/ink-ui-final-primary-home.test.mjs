import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const index = await readFile(new URL('../product/source/index.html', import.meta.url), 'utf8');
const shell = await readFile(new URL('../product/source/web-shell.js', import.meta.url), 'utf8');

test('immediate-context exposes exactly one PRIMARY_HOME', () => {
  const primaryHomes = index.match(/data-ui-home="immediate-context"[^>]*data-ui-route="PRIMARY_HOME"/g) || [];
  assert.equal(primaryHomes.length, 1);
  assert.match(index, /id="contextualOptions"[^>]*data-ui-home="immediate-context"[^>]*data-ui-route="PRIMARY_HOME"/);
});

test('quickControls is contextual content, not a second Primary Home', () => {
  const tag = index.match(/<section id="quickControls"[^>]*>/)?.[0] || '';
  assert.ok(tag);
  assert.doesNotMatch(tag, /data-ui-home=/);
  assert.doesNotMatch(tag, /data-ui-route="PRIMARY_HOME"/);
});

test('quickControls remains re-hosted into the contextual Primary Home', () => {
  assert.match(shell, /CONTEXT_CONTROL_IDS = Object\.freeze\(\['quickControls'/);
  assert.match(shell, /const host = document\.querySelector\('#contextualControlHost'\)/);
  assert.match(shell, /if \(node && node\.parentElement !== host\) host\.append\(node\)/);
});
