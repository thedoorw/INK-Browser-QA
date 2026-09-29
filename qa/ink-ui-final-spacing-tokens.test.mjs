import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const css=await readFile(new URL('../product/source/styles.css',import.meta.url),'utf8');
const required={
  '--ui-space-1':'2px',
  '--ui-space-2':'3px',
  '--ui-space-3':'4px',
  '--ui-space-4':'6px',
  '--ui-control-gap':'var(--ui-space-2)',
  '--ui-group-gap':'var(--ui-space-3)',
  '--ui-section-gap':'var(--ui-space-4)',
  '--ui-panel-padding':'8px',
  '--ui-menu-padding':'var(--ui-space-1)'
};

test('Fine Detail spacing roles are explicit',()=>{
  for(const [name,value] of Object.entries(required)){
    assert.ok(css.includes(name+':'+value),name+' missing or changed');
  }
});

test('Final shell consumes semantic spacing roles without changing accepted values',()=>{
  assert.ok(css.includes('.application-menu-separator,.workspace-menu-separator{margin:var(--ui-menu-padding)}'));
  assert.ok(css.includes('.inspector-section{padding:var(--ui-panel-padding)}'));
  assert.ok(css.includes('.shell-library-panel .shell-panel-body,.shell-property-supplement{gap:var(--ui-section-gap)}'));
  assert.ok(css.includes('.shell-library-results,.shell-property-actions{gap:var(--ui-group-gap)}'));
  assert.ok(css.includes('@media(max-width:760px){.contextual-control-host{gap:var(--ui-control-gap)}}'));
});
