import assert from 'node:assert/strict';
import test from 'node:test';
import { parseIntent } from '../../src/ai/intent/intent-parser.js';
import { validateIntent } from '../../src/ai/intent/intent-validator.js';

test('structured intent separates subjects, operations, composition, and constraints', () => {
  const intent = parseIntent('只把花瓣改成深紅色，其他不動，保留構圖與線條。');
  assert.equal(validateIntent(intent).valid, true); assert.equal(intent.operations[0].operation, 'recolor'); assert.deepEqual(intent.operations[0].subjects, ['petal']);
  assert.ok(intent.constraints.includes('preserve-all-others')); assert.ok(intent.constraints.includes('preserve-composition')); assert.ok(intent.constraints.includes('preserve-stroke'));
});

test('Test 6: unsupported request is explicit and non-executable', () => {
  const intent = parseIntent('把花變成會旋轉的 3D 寫實動畫並加入複雜城市背景。');
  assert.equal(intent.status, 'UNSUPPORTED'); assert.equal(intent.operations.length, 0); assert.ok(intent.unsupportedItems.length > 0);
});
