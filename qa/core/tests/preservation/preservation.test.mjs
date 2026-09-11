import assert from 'node:assert/strict';
import test from 'node:test';
import { inspectPreservation } from '../../src/headless/preservation-guard.js';
import { createdFlower } from '../headless/runtime-fixture.mjs';

test('Test 7: undeclared change is rejected by Preservation Guard', () => {
  const created = createdFlower(), before = structuredClone(created.document), after = structuredClone(before);
  after.pages[0].layers.find(layer => layer.id === 'layer-artwork').objects.find(object => object.id === 'leaf-left').fill = '#000000';
  const plan = { parsedIntent: { operations: [{ operation: 'recolor' }] }, orderedSteps: [{ operation: 'vector.setFill', target: ['petal-1'], parameters: { fill: '#9f2338' } }] };
  const report = inspectPreservation(before, after, plan); assert.equal(report.passed, false); assert.deepEqual(report.undeclaredChanges, ['leaf-left']); assert.equal(report.action, 'REJECT_AND_ROLLBACK');
});
