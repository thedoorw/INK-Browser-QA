import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const shell=await readFile(new URL('../product/source/web-shell.js',import.meta.url),'utf8');

test('Libraries panel uses existing search authority and all five families',()=>{
  assert.match(shell,/id="shellLibrarySearch"/);
  for(const type of ['component','material','recipe','parametric-structure','reference-derived-structure']) assert.match(shell,new RegExp('data-library-type="'+type+'"'));
  assert.match(shell,/tools\.invoke\('search_ink_library', \{ action: 'search'/);
  assert.match(shell,/tools\.invoke\('search_ink_library', \{ action: 'inspect'/);
});

test('Libraries reuse remains governed proposal-only',()=>{
  const start=shell.indexOf('function proposeLibraryReuse');
  const end=shell.indexOf('\n  function renderShellLibraries',start);
  assert.ok(start>=0&&end>start);
  const body=shell.slice(start,end);
  assert.match(body,/reuse\.namedTool \|\| 'propose_ink_edit'/);
  assert.match(body,/operation: reuse\.operation/);
  assert.match(body,/argumentsPayload\.pageId = pageId/);
  assert.match(body,/argumentsPayload\.layerId = layerId/);
  assert.doesNotMatch(body,/approve_ink_edit|execute_ink_edit|\.approve\(|\.execute\(/);
  assert.doesNotMatch(body,/doc\.components\s*=|doc\.materialLibrary\s*=/);
});

test('Libraries inspect is explicitly read-only',()=>{
  assert.match(shell,/id="shellLibraryInspect"[^>]*readonly[^>]*aria-readonly="true"/);
  assert.match(shell,/data\.libraryReuseType = item\.type/);
});
