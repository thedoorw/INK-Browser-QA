import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Matrix } from '../../../../product/source/src/core/index.js';
import { preflightObjectMatrices } from '../../../../product/source/src/editor/transform.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';

const inkSource = readFileSync(
  new URL('../../../../product/source/src/ink.js', import.meta.url),
  'utf8'
);

function sourceBlock(start, end) {
  const startIndex = inkSource.indexOf(start);
  const endIndex = inkSource.indexOf(end, startIndex);
  assert.ok(startIndex >= 0, `missing source block: ${start}`);
  assert.ok(endIndex > startIndex, `missing source block end: ${end}`);
  return inkSource.slice(startIndex, endIndex);
}

test('singular selection preflight rejects before History begins and leaves geometry unchanged', () => {
  const object = { id: 'child', matrix: Matrix.translate(3, 4) };
  const before = [...object.matrix];
  const found = {
    object,
    parentWorldMatrix: Matrix.scale(0, 1),
    worldMatrix: Matrix.translate(3, 4)
  };
  const initial = [{
    ref: { objectId: 'child' },
    matrix: [...object.matrix],
    parentWorldMatrix: [...found.parentWorldMatrix],
    worldMatrix: [...found.worldMatrix]
  }];
  const app = {
    doc: { object },
    updateHistoryUI() {},
    markDirty() {},
    replaceDocument(next) { this.doc = next; }
  };
  const history = new HistoryManager(app);

  assert.throws(
    () => {
      preflightObjectMatrices(initial, () => found);
      history.begin('move', { targets: [['object']] });
    },
    error => error?.code === 'NON_INVERTIBLE_PARENT'
  );

  assert.equal(history.pending, null);
  assert.deepEqual(object.matrix, before);
  assert.deepEqual(app.doc.object.matrix, before);
});

test('stroke node and handle inversion preflight occurs before History begin', () => {
  const block = sourceBlock(
    '  beginSelection(d,pointerId,e){',
    '  finishMarquee(it){'
  );
  const inverseIndex = block.indexOf('const strokeInverse=');
  const handleHistoryIndex = block.indexOf("this.history.begin('調整筆畫切線'");
  const nodeHistoryIndex = block.indexOf("this.history.begin('移動筆畫節點'");

  assert.ok(inverseIndex >= 0);
  assert.ok(handleHistoryIndex > inverseIndex);
  assert.ok(nodeHistoryIndex > inverseIndex);
  assert.match(block, /this\.interaction=null;this\.draft=null;/);
});

test('selection transform roots are preflighted before History begin', () => {
  const block = sourceBlock(
    '  startSelectionTransform(handle,d,pointerId){',
    '  restoreMatrices(initial){'
  );
  const preflightIndex = block.indexOf('preflightObjectMatrices(');
  const historyIndex = block.indexOf('this.history.begin(');

  assert.ok(preflightIndex >= 0);
  assert.ok(historyIndex > preflightIndex);
  assert.match(block, /this\.interaction=null;this\.draft=null;/);
});

test('singular interaction rejection cancels History and clears active interaction state', () => {
  const rejectBlock = sourceBlock(
    '  rejectSingularInteraction(it,message){',
    '  snapMove(dx,dy,it){'
  );
  assert.match(rejectBlock, /this\.history\.cancel\(\)/);
  assert.match(rejectBlock, /this\.interaction=null;this\.draft=null;/);

  const moveBlock = sourceBlock(
    '  onPointerMove(e){',
    '  onPointerUp(e,cancelled=false){'
  );
  assert.match(moveBlock, /stroke-node-move[\s\S]*rejectSingularInteraction/);
  assert.match(moveBlock, /stroke-handle-move[\s\S]*rejectSingularInteraction/);

  const transformBlock = sourceBlock(
    '  updateSelectionTransform(d,e){',
    '  hitTest(world,{deep=false}={})'
  );
  assert.match(transformBlock, /catch\(error\)/);
  assert.match(transformBlock, /rejectSingularInteraction/);
});
