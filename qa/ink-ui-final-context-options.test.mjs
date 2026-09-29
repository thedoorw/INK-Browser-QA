import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../product/source/ui/full-capability-controls.js',import.meta.url),'utf8');

test('context option binding uses collection selector for generated controls',()=>{
  assert.match(source,/\$\$\('\[data-ui-b-option\]',host\)\.forEach/);
  assert.match(source,/\$\$\('\[data-ui-b-context-action\]',host\)\.forEach/);
  assert.doesNotMatch(source,/\$\('\[data-ui-b-option\]',host\)\.forEach/);
  assert.doesNotMatch(source,/\$\('\[data-ui-b-context-action\]',host\)\.forEach/);
});
