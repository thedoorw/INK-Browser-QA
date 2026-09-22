import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../../../../', import.meta.url));
const read = name => readFileSync(path.join(root, name), 'utf8');
const batch = read('.github/workflows/ink-runtime-batch-windows.yml');
const helper = read('qa/runtime/run-ink-runtime-batch.mjs');

// Fail closed unless the trigger block uses this repository's explicit block
// mapping convention. This deliberately does not pretend to be a YAML parser.
function eventBlock(source) {
  assert.equal([...source.matchAll(/^on:/gm)].length, 1, 'One explicit on block required');
  const match = source.match(/^on:\n((?:[ \t]+[^\n]*\n|\n)*)/m);
  assert.ok(match, 'Unsupported trigger syntax; review guard before changing it');
  return match[1];
}
function manualOnly(source) {
  const block = eventBlock(source);
  assert.deepEqual([...block.matchAll(/^  ([\w-]+):/gm)].map(m => m[1]), ['workflow_dispatch']);
  assert.doesNotMatch(block, /[&*]|<<:|\t/);
}
function safeSource(source) {
  assert.doesNotMatch(source, /powershell|pwsh|ExecutionPolicy|Set-MpPreference|Add-MpPreference|ExclusionPath|ExclusionProcess|Start-Process|Invoke-Expression|EncodedCommand/i);
  assert.doesNotMatch(source, /shell:\s*true|detached:\s*true/);
  for (const call of source.matchAll(/\bspawn\([\s\S]*?\}\)/g)) {
    assert.match(call[0], /shell:\s*false/, 'Every child must bypass shell parsing');
    assert.match(call[0], /windowsHide:\s*true/, 'Every child must suppress a console');
  }
}

test('all current self-hosted Runtime definitions are manual only', () => {
  for (const name of readdirSync(path.join(root, '.github/workflows')).filter(name => /\.ya?ml$/.test(name))) {
    const source = read(`.github/workflows/${name}`);
    if (!/self-hosted/.test(source)) continue;
    if (name === 'ra0-9-baseline-import.yml') {
      // Existing non-Runtime import is the only exception: main + incoming ZIP paths.
      assert.equal(eventBlock(source), "  push:\n    branches: [main]\n    paths:\n      - 'reference/RA0_9_baseline/incoming/*.zip'\n      - '.github/workflows/ra0-9-baseline-import.yml'\n      - 'reference/RA0_9_baseline/incoming/RETRY_TRIGGER.txt'\n  workflow_dispatch:\n\n");
    } else manualOnly(source);
  }
  assert.match(batch, /target_ref:\n[^]*?required: true/);
  assert.doesNotMatch(eventBlock(batch), /default:/);
  assert.match(batch, /if: github\.event_name == 'workflow_dispatch'/);
  assert.match(batch, /runs-on: \[self-hosted, Windows, X64\]/);
  assert.match(batch, /tree_sha: commit\.commit\.tree\.sha/);
});

test('active batch workflow and helper have no prohibited process/policy patterns', () => {
  // Ignore prose comments; scan executable source, including inline action JS.
  const active = batch.split('\n').filter(line => !/^\s*#/.test(line)).join('\n');
  const code = helper.split('\n').filter(line => !/^\s*\/\//.test(line)).join('\n');
  safeSource(active); safeSource(code);
  assert.match(active, /shell: false, windowsHide: true/);
  assert.match(code, /shell: false, windowsHide: true/g);
  assert.doesNotMatch(active, /\brun:/);
});

test('guard rejects push/PR/schedule syntax and unsafe launch mutations', () => {
  for (const event of ['push', 'pull_request', 'schedule', 'workflow_run']) {
    assert.throws(() => manualOnly(batch.replace('on:\n', `on:\n  ${event}:\n`)));
  }
  assert.throws(() => manualOnly('on: [push]\n'));
  assert.throws(() => manualOnly(batch.replace('workflow_dispatch:', 'workflow_dispatch: *events')));
  assert.throws(() => safeSource(helper.replace('windowsHide: true', 'windowsHide: false')));
  for (const pattern of ['powershell.exe', '-ExecutionPolicy Bypass', 'Set-ExecutionPolicy', 'Add-MpPreference -ExclusionPath', 'Start-Process powershell', 'shell: true']) assert.throws(() => safeSource(pattern));
});
