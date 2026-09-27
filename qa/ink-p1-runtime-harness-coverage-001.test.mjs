import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const workflow = readFileSync(
  new URL('../.github/workflows/ink-runtime-batch-windows.yml', import.meta.url),
  'utf8'
);

const p1Tests = [
  'qa/ink-p1-a-raster-selection-fill-sampling.test.mjs',
  'qa/ink-p1-b-local-raster-retouch.test.mjs',
  'qa/ink-p1-c-vector-text-precision-layout.test.mjs',
  'qa/ink-p1-d-layer-effects-completion.test.mjs',
  'qa/ink-p1-e-advanced-selection.test.mjs',
  'qa/ink-p1-f-raster-processing-expansion.test.mjs',
  'qa/ink-p1-g-color-bitdepth-channels.test.mjs',
  'qa/ink-p1-h-format-interoperability.test.mjs',
  'qa/ink-p1-integration-001.test.mjs'
];

const between = (start, end) => {
  const a = workflow.indexOf(start);
  const b = workflow.indexOf(end, a + start.length);
  assert.ok(a >= 0, `Missing workflow marker: ${start}`);
  assert.ok(b > a, `Missing/invalid workflow marker: ${end}`);
  return workflow.slice(a, b);
};

test('central workflow preserves manual and queued exact-target resolution', () => {
  assert.match(workflow, /workflow_dispatch:/);
  assert.match(workflow, /target_ref:/);
  assert.match(workflow, /context\.eventName === 'workflow_dispatch'/);
  assert.match(workflow, /queue\.target_sha/);
  assert.match(workflow, /getCommit\(\{ owner, repo, ref: queue\.target_sha \}\)/);
  assert.match(workflow, /commit\.sha !== queue\.target_sha/);
  assert.match(workflow, /INK_TARGET_SHA: \$\{\{ needs\.controller\.outputs\.target_sha \}\}/);
  assert.match(workflow, /Pinned exact target SHA required/);
});

test('all nine P1 contracts are exact-target materialized', () => {
  const materialization = between('const exact = new Set([', ']);\n            const files = tree.tree.filter');
  for (const file of p1Tests) assert.ok(materialization.includes(`'${file}'`), `Missing materialized P1 test: ${file}`);
  assert.ok(materialization.includes("'qa/fixtures/p1-h/fixtures.mjs'"), 'P1-H fixture must be materialized');
});

test('all nine P1 contracts execute together before Closure and browser Runtime', () => {
  const p1Step = between('- name: Execute P1 exact-target contract tests', '- name: Execute Closure focused contract tests');
  for (const file of p1Tests) assert.ok(p1Step.includes(`'${file}'`), `Missing executed P1 test: ${file}`);
  assert.match(p1Step, /spawn\(process\.execPath, \['--test', \.\.\.tests\]/);
  assert.match(p1Step, /p1-runtime-coverage\.json/);
  assert.match(p1Step, /status: execution\.code === 0 \? 'PASS' : 'FAIL'/);
  assert.match(p1Step, /throw new Error\(\`P1 exact-target contract tests failed:/);

  const p1Index = workflow.indexOf('- name: Execute P1 exact-target contract tests');
  const closureIndex = workflow.indexOf('- name: Execute Closure focused contract tests');
  const browserIndex = workflow.indexOf('- name: Execute bounded browser batch');
  assert.ok(p1Index < closureIndex && closureIndex < browserIndex);
});

test('existing Closure P0 browser and artifact preservation remain present', () => {
  assert.match(workflow, /qa\/ink-p0-restore-all-001-focused\.test\.mjs/);
  assert.match(workflow, /qa\/ink-tech-closure-001-c2a\.test\.mjs/);
  assert.match(workflow, /qa\/runtime\/run-ink-runtime-batch\.mjs/);
  assert.match(workflow, /- name: Execute bounded browser batch/);
  assert.match(workflow, /- name: Preserve exact-revision evidence/);
  assert.match(workflow, /if: always\(\) && steps\.source\.outputs\.root != ''/);
  assert.match(workflow, /path: \$\{\{ steps\.source\.outputs\.root \}\}\/evidence\//);
});
