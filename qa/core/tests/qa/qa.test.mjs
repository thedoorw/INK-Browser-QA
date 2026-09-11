import assert from 'node:assert/strict';
import test from 'node:test';
import { runStructuralQA } from '../../src/headless/structural-qa.js';
import { runVisualQA } from '../../src/headless/visual-qa.js';
import { createdFlower } from '../headless/runtime-fixture.mjs';

test('Structural and measurement-only Visual QA accept the bounded flower', async () => {
  const created = createdFlower(), structural = runStructuralQA(created.document), visual = await runVisualQA(created.document, { intent: created.intent });
  assert.equal(structural.passed, true); assert.equal(structural.metrics.petals, 9); assert.equal(structural.metrics.leaves, 2);
  assert.equal(visual.passed, true); assert.equal(visual.metrics.petalCount, 9); assert.equal(visual.metrics.nearBlank, false);
});
