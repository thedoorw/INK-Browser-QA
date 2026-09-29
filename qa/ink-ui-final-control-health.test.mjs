import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const ui=await readFile(new URL('../product/source/ui/full-capability-controls.js',import.meta.url),'utf8');
const css=await readFile(new URL('../product/source/styles.css',import.meta.url),'utf8');

test('context option refresh queries collections with $$',()=>{
  assert.match(ui,/\$\$\('\[data-ui-b-option\]',host\)\.forEach/);
  assert.match(ui,/\$\$\('\[data-ui-b-context-action\]',host\)\.forEach/);
  assert.equal((ui.match(/\$\$\('\[data-ui-b-option\]',host\)\.forEach/g)||[]).length,1);
  assert.equal((ui.match(/\$\$\('\[data-ui-b-context-action\]',host\)\.forEach/g)||[]).length,1);
});

test('no single-element selector is used as a collection',()=>{
  assert.doesNotMatch(ui,/(?<!\\$)\\$\\([^;\\n]+?\\)\\.forEach/);
});

test('compact interactive controls retain 24px effective target floor',()=>{
  assert.match(css,/@media\(max-width:760px\)[\s\S]*?\.app button:not\(\[disabled\]\)[\s\S]*?min-width:24px;[\s\S]*?min-height:24px;/);
  assert.match(css,/\.app label:has\(input:not\(\[disabled\]\)\)[\s\S]*?min-height:24px;/);
  assert.match(css,/\.quick-controls #quickColor,[\s\S]*?#quickColorInput[\s\S]*?min-width:27px;[\s\S]*?min-height:27px;/);
});
