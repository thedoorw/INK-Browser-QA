import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const root = new URL('../../', import.meta.url);
const workflow = await readFile(new URL('.github/workflows/ink-runtime-batch-windows.yml', root), 'utf8');
const queue = JSON.parse(await readFile(new URL('ACTIVE/INK_RUNTIME_QUEUE.json', root), 'utf8'));
const runtimeHelper = await readFile(new URL('qa/runtime/run-ink-runtime-batch.mjs', root), 'utf8');

const requireText = (text, label) => assert.ok(workflow.includes(text), `missing ${label}`);

assert.deepEqual(queue, {
  schema: 'ink-runtime-queue',
  version: 1,
  state: 'IDLE',
  target_sha: null,
  pending_work_orders: [],
  covered_work_orders: [],
  high_risk: { enabled: false, reason: null },
  batch_policy: { default_target: 3, allowed_min: 2, allowed_max: 4 },
  last_run: { run_id: null, tested_sha: null, result: null }
});

requireText('required: false', 'optional manual target');
requireText("default: ''", 'zero-text manual default');
assert.equal((workflow.match(/getBranch\(\{ owner, repo, branch: 'main' \}\)/g) || []).length, 1,
  'blank manual dispatch must resolve main exactly once');
requireText("source = 'manual-override'", 'advanced explicit override');
requireText("source = 'manual-main'", 'blank manual main resolution');
requireText('paths: [ACTIVE/INK_RUNTIME_QUEUE.json]', 'queue-only push trigger');
requireText("if: needs.controller.outputs.run_runtime == 'true'", 'Windows job READY/manual gate');
requireText("if (queue.state !== 'READY')", 'non-READY skip');
requireText("READY Runtime queue requires an exact 40-character target_sha", 'malformed SHA rejection');
requireText("commit.sha !== queue.target_sha", 'exact queue SHA resolution');
requireText('policy.default_target !== 3', 'default batch target');
requireText('policy.allowed_min !== 2', 'allowed batch minimum');
requireText('policy.allowed_max !== 4', 'allowed batch maximum');
requireText('High-risk immediate Runtime requires an explicit reason', 'high-risk policy');
requireText('INK_TARGET_SHA: ${{ needs.controller.outputs.target_sha }}', 'pinned SHA handoff');
requireText('testedSha: sha', 'exact tested-SHA evidence');
requireText('windowsHide: true', 'hidden browser helper process');
requireText('runs-on: [self-hosted, Windows, X64]', 'existing Windows runner labels');

assert.ok(!/paths:[\s\S]{0,100}product\/source/.test(workflow), 'product pushes must not trigger Runtime');
assert.ok(!/TinyFish|browser-agent/i.test(workflow), 'external browser agent dependency prohibited');
assert.ok(!/Set-ExecutionPolicy|ExecutionPolicy\s+Bypass/i.test(workflow), 'PowerShell policy mutation prohibited');

assert.match(runtimeHelper, /\{ id: 'ui', file:/);
assert.match(runtimeHelper, /\{ id: 'creative', file:/);
assert.match(runtimeHelper, /\{ id: 'geometry', file:/);
assert.match(runtimeHelper, /FORMAT_VERSION\\s\*=\\s\*4/);

const lines = workflow.split(/\r?\n/);
for (let index = 0; index < lines.length; index += 1) {
  if (!/^\s+script:\s*\|\s*$/.test(lines[index])) continue;
  const indent = lines[index].match(/^\s*/)[0].length;
  const body = [];
  for (index += 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.trim() && line.match(/^\s*/)[0].length <= indent) {
      index -= 1;
      break;
    }
    body.push(line.slice(Math.min(line.length, indent + 2)));
  }
  new vm.Script(`(async () => {\n${body.join('\n')}\n})`, { filename: 'workflow-inline-script.js' });
}

console.log('INK-RUNTIME-AUTOMATION-001 static QA: PASS');
