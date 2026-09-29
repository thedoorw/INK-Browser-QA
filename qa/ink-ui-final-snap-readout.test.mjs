import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const shell=await readFile(new URL('../product/source/web-shell.js',import.meta.url),'utf8');
const ink=await readFile(new URL('../product/source/src/ink.js',import.meta.url),'utf8');

test('snap readout is one transient shell surface derived from existing evidence',()=>{
  assert.match(shell,/id = 'shellSnapReadout'/);
  assert.match(shell,/item\.type === 'equal-distance'/);
  assert.match(shell,/item\.gap/);
  assert.match(shell,/item\.correction/);
  assert.match(shell,/readout\.hidden = false/);
  assert.match(shell,/function clearSnapFeedback\(\)/);
});

test('direct movement forwards existing snap evidence and clears it on pointer end',()=>{
  assert.match(ink,/showSnapFeedback\?\.\(snapped\.evidence,\{clientX:d\.clientX,clientY:d\.clientY\}\)/);
  assert.match(ink,/clearSnapFeedback\?\.\(\);this\.interaction=null/);
});

test('readout does not create a second snap authority',()=>{
  const start=shell.indexOf('function showSnapFeedback');
  const end=shell.indexOf('\n  function clearSnapFeedback',start);
  const body=shell.slice(start,end);
  assert.doesNotMatch(body,/page\(\)\.snap\s*=|setSnapEnabledState|setSnapCategoryState|resolveManipulationSnap/);
});
