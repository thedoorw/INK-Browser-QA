import test from 'node:test';
import assert from 'node:assert/strict';
import { InputArbiter } from '../../src/input/input-arbiter.js';

const drawTools = new Set(['pen', 'brush']);
const context = { fingerDraw: false, spaceDown: false, tool: 'pen', drawTools };

test('single touch navigates by default', () => {
  const input = new InputArbiter();
  const decision = input.register({ pointerId: 1, pointerType: 'touch', button: 0 }, { sx: 1 }, context);
  assert.equal(decision.role, 'navigate');
});

test('pen uses active tool and two pointers promote gesture', () => {
  const input = new InputArbiter();
  assert.equal(input.register({ pointerId: 1, pointerType: 'pen', button: 0 }, {}, context).role, 'tool');
  assert.equal(input.register({ pointerId: 2, pointerType: 'touch', button: 0 }, {}, context).role, 'gesture');
  assert.equal(input.firstTwo().length, 2);
});
