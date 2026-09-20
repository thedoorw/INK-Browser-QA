// INK-CLOUD-005 non-browser evidence runner. No packages, network or Actions.
import { mkdtempSync, readFileSync, writeFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
const root = fileURLToPath(new URL('../../', import.meta.url));
const tests = join(root, 'qa/core/tests/unit');
const temp = mkdtempSync(join(tmpdir(), 'ink-cloud-005-'));
const run = args => {
  const result = spawnSync(process.execPath, args, { cwd: root, encoding: 'utf8' });
  process.stdout.write(result.stdout || '');
  process.stderr.write(result.stderr || '');
  if (result.status !== 0) throw new Error(`Node check failed: ${args.join(' ')}`);
};
try {
  const legacy = ['core', 'editor', 'history', 'spatial', 'storage', 'stroke', 'artboard-output'];
  const staged = legacy.map(name => {
    // Archived unit files still import the pre-repository-layout ../../src path.
    // Change only those module specifiers in disposable copies; assertions stay exact.
    const source = readFileSync(join(tests, `${name}.test.mjs`), 'utf8')
      .replaceAll("'../../src/", `'${new URL('../../product/source/src/', import.meta.url).href}`);
    const file = join(temp, `${name}.test.mjs`);
    writeFileSync(file, source);
    return file;
  });
  const current = readdirSync(tests).filter(name => /^(frame-|container-structural-|transform-bounds-coordinate-|singular-interaction-history-guard-|component-instance-).*\.test\.mjs$/.test(name)).sort().map(name => join(tests,name));
  console.log('CHECK: current Component + accepted 002/003/004 contracts');
  run(['--test', '--test-concurrency=1', ...current]);
  console.log('CHECK: retained core/editor/history/spatial/storage/stroke/artboard tests (import paths adapted only)');
  run(['--test', '--test-concurrency=1', ...staged]);
  for (const path of ['document/components.js','document/hierarchy.js','document/index.js','document/integrity.js','ink.js','studio-core.js']) {
    run(['--check', join(root, 'product/source/src', path)]);
  }
  if (!/FORMAT_VERSION = 4;/.test(readFileSync(join(root,'product/source/src/config.js'),'utf8'))) throw new Error('Unexpected FORMAT_VERSION');
  console.log('PASS: 6 product syntax checks; FORMAT_VERSION = 4');
  console.log('RUNTIME_QA = DEFERRED (no browser, Canvas/WebGL visual, pointer, IndexedDB or hosted Actions execution)');
} finally {
  rmSync(temp, { recursive: true, force: true });
}
