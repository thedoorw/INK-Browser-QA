import test from 'node:test';
import assert from 'node:assert/strict';
import { defaultDocument } from '../../src/document/index.js';
import { HistoryManager, applyPatches, createPatchPair } from '../../src/history/index.js';
import { deepClone } from '../../src/core/index.js';

test('document patches reproduce and reverse a change', () => {
  const before = { title: 'A', values: [1, 2], nested: { opacity: 1 } };
  const after = { title: 'B', values: [1, 2], nested: { opacity: .5 } };
  const pair = createPatchPair(before, after);
  assert.deepEqual(applyPatches(deepClone(before), pair.forward), after);
  assert.deepEqual(applyPatches(deepClone(after), pair.inverse), before);
  assert.ok(pair.forward.length < 4);
});

test('history stores patches and supports undo redo', () => {
  const app = {
    doc: defaultDocument(),
    updateHistoryUI() {},
    markDirty() {},
    toast() {},
    replaceDocument(document) { this.doc = document; }
  };
  const history = new HistoryManager(app);
  history.push('rename', () => { app.doc.title = 'Test'; });
  assert.equal(app.doc.title, 'Test');
  assert.equal(history.stats().mode, 'hybrid-target-scoped-id-aware-patches');
  assert.equal(history.undo(), true);
  assert.equal(app.doc.title, '未命名作品');
  assert.equal(history.redo(), true);
  assert.equal(app.doc.title, 'Test');
});

test('ID-aware array patches insert and remove one object without replacing the whole array', () => {
  const before = { objects: [{ id: 'a', value: 1 }, { id: 'b', value: 2 }] };
  const after = { objects: [{ id: 'a', value: 3 }, { id: 'c', value: 4 }, { id: 'b', value: 2 }] };
  const pair = createPatchPair(before, after);
  assert.ok(pair.forward.some(patch => patch.op === 'array-insert' && patch.id !== 'objects'));
  assert.ok(!pair.forward.some(patch => patch.op === 'set' && patch.path.length === 1 && patch.path[0] === 'objects'));
  assert.deepEqual(applyPatches(deepClone(before), pair.forward), after);
  assert.deepEqual(applyPatches(deepClone(after), pair.inverse), before);
});

test('ID-aware array patches preserve reorder operations', () => {
  const before = { objects: [{ id: 'a' }, { id: 'b' }, { id: 'c' }] };
  const after = { objects: [{ id: 'c' }, { id: 'a' }, { id: 'b' }] };
  const pair = createPatchPair(before, after);
  assert.ok(pair.forward.some(patch => patch.op === 'array-move'));
  assert.deepEqual(applyPatches(deepClone(before), pair.forward), after);
  assert.deepEqual(applyPatches(deepClone(after), pair.inverse), before);
});

test('history defaults to 30 steps, supports 20 30 50 limits and jumps to a selected state', () => {
  const app = {
    doc: defaultDocument(),
    updateHistoryUI() {},
    markDirty() {},
    toast() {},
    replaceDocument(document) { this.doc = document; }
  };
  const history = new HistoryManager(app);
  assert.equal(history.limit, 30);
  history.pushScoped('A', [['title']], () => { app.doc.title = 'A'; });
  history.pushScoped('B', [['title']], () => { app.doc.title = 'B'; });
  history.pushScoped('C', [['title']], () => { app.doc.title = 'C'; });
  assert.deepEqual(history.timeline().entries.map(entry => entry.label), ['A', 'B', 'C']);
  assert.equal(history.jumpTo(1), true);
  assert.equal(app.doc.title, 'A');
  assert.equal(history.undoStack.length, 1);
  assert.equal(history.redoStack.length, 2);
  assert.equal(history.jumpTo(3), true);
  assert.equal(app.doc.title, 'C');
  assert.equal(history.setLimit(50), 50);
  assert.equal(history.setLimit(999), 30);
});
