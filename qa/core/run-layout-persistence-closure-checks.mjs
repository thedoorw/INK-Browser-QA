// INK-CLOUD-006 source/unit/serialization/migration evidence runner.
import { readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root=fileURLToPath(new URL('../../',import.meta.url));
const run=(args,{capture=false}={})=>{
  const result=spawnSync(process.execPath,args,{cwd:root,encoding:'utf8'});
  if(!capture){process.stdout.write(result.stdout||'');process.stderr.write(result.stderr||'');}
  if(result.status!==0)throw new Error(`Node check failed: ${args.join(' ')}`);
  return `${result.stdout||''}${result.stderr||''}`;
};
console.log('CHECK: accepted INK-CLOUD-002 through 005 and retained shared-core suites');
const accepted=run(['qa/core/run-component-foundation-checks.mjs'],{capture:true});
for(const line of accepted.split('\n'))if(/^(CHECK:|ℹ tests |ℹ pass |ℹ fail |PASS:|RUNTIME_QA)/.test(line))console.log(line);
console.log('CHECK: INK-CLOUD-006 Layout / Constraints + persistence envelope suite');
run(['--test','--test-concurrency=1','qa/core/tests/unit/layout-persistence-contract-v0.1.test.mjs']);
for(const path of [
  'document/layout.js','document/file-envelope.js','document/model.js','document/migration.js',
  'document/integrity.js','document/storage.js','document/components.js','document/hierarchy.js'
])run(['--check',join(root,'product/source/src',path)]);
const config=readFileSync(join(root,'product/source/src/config.js'),'utf8');
if(!/FORMAT_VERSION = 4;/.test(config))throw new Error('Unexpected FORMAT_VERSION');
const bounded=[
  readFileSync(join(root,'product/source/src/document/layout.js'),'utf8'),
  readFileSync(join(root,'product/source/src/document/file-envelope.js'),'utf8')
].join('\n');
if(/\b(fetch|WebSocket|XMLHttpRequest|EventSource)\s*\(/.test(bounded))throw new Error('Network transport found in bounded schema modules');
console.log('PASS: 8 source syntax checks; FORMAT_VERSION = 4; no network transport primitive in new schema modules');
console.log('RUNTIME_QA = DEFERRED (no browser, Canvas/WebGL visual, pointer, IndexedDB or hosted Actions execution)');
