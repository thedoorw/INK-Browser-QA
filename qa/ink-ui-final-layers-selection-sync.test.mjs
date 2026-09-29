import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../product/source/src/ink.js',import.meta.url),'utf8');

test('refreshSelectionUI mirrors canonical object selection into existing Layers rows',()=>{
  const start=source.indexOf('refreshSelectionUI(){');
  const end=source.indexOf('\n  refreshPaperUI(){',start);
  assert.ok(start>=0&&end>start);
  const body=source.slice(start,end);
  assert.match(body,/const selectedObjectIds=new Set\(this\.selection\.map\(ref=>ref\.objectId\)\)/);
  assert.match(body,/document\.querySelectorAll\('#layersList \[data-object-id\]'\)\.forEach\(row=>row\.classList\.toggle\('active',selectedObjectIds\.has\(row\.dataset\.objectId\)\)\)/);
  assert.doesNotMatch(body,/this\.selection\s*=/);
});
