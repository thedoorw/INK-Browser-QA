import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { createInkHeadlessRuntime } from '../../src/headless/headless-runtime.js';

test('Test 1-5: create, local edits, movement, and rollback use one persistent document', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ink-headless-test-')), runtime = await createInkHeadlessRuntime({ root, projectRoot: path.resolve('.') });
  try {
    const session = await runtime.createSession({ seed: 15101 });
    const first = await runtime.plan({ sessionId: session.sessionId, prompt: '畫一朵正面的粉紅色花，白底，兩片綠葉，置中，簡單乾淨。' });
    const preview1 = await runtime.preview({ sessionId: session.sessionId, plan: first, output: path.join(root, 'preview1') });
    const approval1 = await runtime.approve({ sessionId: session.sessionId, preview: preview1 });
    const execution1 = await runtime.execute({ sessionId: session.sessionId, plan: first, approval: approval1, output: path.join(root, 'execute1') });
    assert.equal(execution1.status, 'COMPLETED'); assert.equal(execution1.objectIds.length, 14); assert.equal(execution1.structuralQA.passed, true);

    const second = await runtime.modify({ sessionId: session.sessionId, prompt: '只把花瓣改成深紅色，其他不動。', output: path.join(root, 'preview2') });
    const approval2 = await runtime.approve({ sessionId: session.sessionId, preview: second.preview });
    const execution2 = await runtime.execute({ sessionId: session.sessionId, plan: second.plan, approval: approval2, output: path.join(root, 'execute2') });
    assert.deepEqual(execution2.preservationGuard.differences.modified.sort(), Array.from({ length: 9 }, (_, index) => `petal-${index + 1}`).sort());
    assert.deepEqual(execution2.preservationGuard.differences.added, []); assert.deepEqual(execution2.preservationGuard.differences.deleted, []);

    const third = await runtime.modify({ sessionId: session.sessionId, prompt: '只把兩片葉子放大 15%，位置和其他部分不動。', output: path.join(root, 'preview3') });
    const approval3 = await runtime.approve({ sessionId: session.sessionId, preview: third.preview });
    const execution3 = await runtime.execute({ sessionId: session.sessionId, plan: third.plan, approval: approval3, output: path.join(root, 'execute3') });
    assert.deepEqual(execution3.preservationGuard.differences.modified.sort(), ['leaf-left', 'leaf-right']); assert.equal(execution3.visualQA.passed, true);

    const fourth = await runtime.modify({ sessionId: session.sessionId, prompt: '把整朵花往上移 20，葉子和莖保持不動。', output: path.join(root, 'preview4') });
    const approval4 = await runtime.approve({ sessionId: session.sessionId, preview: fourth.preview });
    const execution4 = await runtime.execute({ sessionId: session.sessionId, plan: fourth.plan, approval: approval4, output: path.join(root, 'execute4') });
    assert.equal(execution4.preservationGuard.differences.modified.length, 11); assert.ok(!execution4.preservationGuard.differences.modified.includes('stem')); assert.ok(!execution4.preservationGuard.differences.modified.includes('leaf-left'));

    const rollback = await runtime.rollback({ sessionId: session.sessionId, executionId: execution4.executionId, output: path.join(root, 'rollback') });
    assert.equal(rollback.status, 'ROLLED_BACK'); assert.equal(rollback.hashMatch, true);
  } finally { await runtime.close(); await rm(root, { recursive: true, force: true }); }
});
