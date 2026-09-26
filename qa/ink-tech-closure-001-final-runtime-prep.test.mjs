import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('final Closure Runtime runner classifies UI/Closure/Geometry/Creative independently', async () => {
  const runner = await readFile(path.join(root, 'qa/runtime/run-ink-runtime-batch.mjs'), 'utf8');

  assert.match(runner, /\{ id: 'ui', file: 'ink-web-ui-001-harness\.html' \}/);
  assert.match(runner, /\{ id: 'closure', file: 'ink-tech-closure-001-browser-harness\.html' \}/);
  assert.match(runner, /\{ id: 'geometry', file: 'ink-ra-001-browser-harness\.html' \}/);
  assert.match(runner, /\{ id: 'creative', file: 'ink-cloud-018-browser-harness\.html' \}/);

  const suiteOrder = [
    runner.indexOf("{ id: 'ui'"),
    runner.indexOf("{ id: 'closure'"),
    runner.indexOf("{ id: 'geometry'"),
    runner.indexOf("{ id: 'creative'")
  ];
  assert.ok(suiteOrder.every(index => index >= 0));
  assert.deepEqual([...suiteOrder].sort((a, b) => a - b), suiteOrder);

  assert.match(runner, /id === 'closure'/);
  assert.match(runner, /INK-TECH-CLOSURE-001-BROWSER-PROOF/);
  assert.match(runner, /CLOSURE_GATE_PASS/);
  assert.match(runner, /failedSuites = report\.suites\.filter/);
  assert.match(runner, /Suite failures:/);

  const suiteCatch = runner.slice(
    runner.indexOf("entry.status = 'FAIL';"),
    runner.indexOf("} finally {", runner.indexOf("entry.status = 'FAIL';"))
  );
  assert.doesNotMatch(suiteCatch, /throw\s+error/);
});

test('isolated Closure harness owns C1/C2 proof and exact capability baseline', async () => {
  const harness = await readFile(path.join(root, 'qa/runtime/ink-tech-closure-001-browser-harness.html'), 'utf8');

  for (const marker of [
    'CLOSURE_EXACT_34_OPERATION_VOCABULARY',
    'GEOMETRY_OPS_GATE_PASS',
    'C2A_GATE_PASS',
    'C2B_GATE_PASS',
    'C2C_GATE_PASS',
    'CLOSURE_REVISION_CAPTURED_PER_APPROVED_PLAN',
    'CLOSURE_HISTORY_ACCUMULATED',
    'CLOSURE_GATE_PASS'
  ]) assert.match(harness, new RegExp(marker));

  assert.match(harness, /namedTools\?\.length===22/);
  assert.match(harness, /repeat\.expand\.v1/);
  assert.match(harness, /CORE_ONLY_ACCEPTED/);

  const expected = [
    'path.repaint.v1','path.material.apply.v1','path.material.remove.v1','object.translate.v1','path.simplify.v1','path.refine.v1',
    'path.create.v1','path.edit.v1','object.rotate.v1','object.clone.v1','repeat.radial.v1','boolean.apply.v1','group.create.v1','object.reparent.v1',
    'frame.create.v1','text.create.v1','text.edit.v1','svg.import.v1','object.resize.v1','object.scale.v1','object.order.v1',
    'repeat.mirror.v1','repeat.grid.v1','layout.frame.set.v1','layout.frame.remove.v1','layout.item.set.v1','layout.item.remove.v1',
    'component.register.v1','component.instance.create.v1','component.override.set.v1','component.override.reset.v1','component.instance.detach.v1','component.definition.duplicate.v1','component.reference.repair.v1'
  ];
  for (const operation of expected) assert.match(harness, new RegExp(operation.replace(/\./g, '\\.')));
});

test('Creative regression suite no longer owns Closure proof and accepts append-only named tool growth', async () => {
  const creative = await readFile(path.join(root, 'qa/runtime/ink-cloud-018-browser-harness.html'), 'utf8');
  assert.match(creative, /namedTools\.length===22/);
  assert.match(creative, /namedTools\[19\]\.name==='import_ink_reference'/);
  assert.match(creative, /namedTools\[20\]\.name==='export_ink_asset'/);
  assert.match(creative, /namedTools\[21\]\.name==='search_ink_library'/);
  assert.doesNotMatch(creative, /GEOMETRY_OPS_GATE_PASS/);
  assert.doesNotMatch(creative, /C2A_GATE_PASS/);
  assert.doesNotMatch(creative, /C2B_GATE_PASS/);
  assert.doesNotMatch(creative, /C2C_GATE_PASS/);
});

console.log('INK-TECH-CLOSURE-001 final Runtime prep focused QA: PASS');
