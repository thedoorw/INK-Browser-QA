import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source=await readFile(new URL('../product/source/src/ink.js',import.meta.url),'utf8');

test('Pages add uses the exported defaultPage authority',()=>{
  assert.match(source,/defaultDocument, defaultPage, defaultLayer/);
  assert.match(source,/addPage\(\)\{this\.history\.pushScoped\('新增頁面',[\s\S]*?const p=defaultPage\(this\.doc\.pages\.length\+1\)/);
});

test('Pages mutation remains within existing History/document authority',()=>{
  const start=source.indexOf('addPage(){');
  const end=source.indexOf('\n  deletePage(',start);
  const body=source.slice(start,end);
  assert.match(body,/this\.history\.pushScoped/);
  assert.match(body,/this\.doc\.pages\.push\(p\)/);
  assert.match(body,/this\.doc\.activePageId=p\.id/);
});
