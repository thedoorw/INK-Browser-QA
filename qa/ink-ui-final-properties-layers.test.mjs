import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const shell=await readFile(new URL('../product/source/web-shell.js',import.meta.url),'utf8');

test('Properties appearance routes to existing path and material authorities',()=>{
  for(const id of ['shellPathFill','shellPathStroke','shellPathOpacity','shellMaterialSelect','shellMaterialApply','shellMaterialRemove','shellMaterialState']) assert.match(shell,new RegExp('id="'+id+'"'));
  assert.match(shell,/app\.repaintSelectedPaths\?\.\(/);
  assert.match(shell,/app\.applySelectedPathMaterial\?\.\(/);
  assert.match(shell,/app\.clearSelectedPathMaterial\?\.\(/);
});

test('Frame and LayoutItem controls use existing document state under History',()=>{
  assert.match(shell,/id="shellFrameLayout"/);
  assert.match(shell,/schema: 'INK-LAYOUT-1'/);
  assert.match(shell,/history\.pushScoped\('調整 Frame Layout'/);
  assert.match(shell,/id="shellLayoutItem"/);
  assert.match(shell,/schema: 'INK-LAYOUT-ITEM-1'/);
  assert.match(shell,/history\.pushScoped\('調整 Layout Item'/);
});

test('Component state and hierarchy reparent use existing app authorities',()=>{
  assert.match(shell,/id="shellComponentState"/);
  assert.match(shell,/app\.overrideInstance\?\.\(/);
  assert.match(shell,/data\.reparentAction = 'root'/);
  assert.match(shell,/app\.reparentObjectToFrame\?\.\(found\.object\.id, null\)/);
});
