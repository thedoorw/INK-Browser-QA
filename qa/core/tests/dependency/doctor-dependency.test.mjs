import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

test('Doctor reports required dependencies as structured failures without node_modules', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-doctor-missing-'));
  const runtime = path.join(temp, 'Runtime'), scripts = path.join(runtime, 'scripts');
  await mkdir(scripts, { recursive: true });
  const script = path.join(scripts, 'ink-doctor.mjs');
  await writeFile(script, await readFile(path.join(root, 'scripts', 'ink-doctor.mjs')));
  await writeFile(path.join(runtime, 'package-lock.json'), await readFile(path.join(root, 'package-lock.json')));
  const result = spawnSync(process.execPath, [script], { cwd: runtime, encoding: 'utf8', env: { ...process.env, NODE_PATH: '' } });
  const report = JSON.parse(result.stdout);
  assert.equal(result.status, 2);
  assert.equal(report.status, 'FAIL');
  assert.equal(report.code, 'DEPENDENCY_MISSING');
  assert.ok(report.errors.some(item => item.code === 'DEPENDENCY_MISSING' && item.dependency === 'playwright-core'));
  assert.equal(report.installCommand, 'npm ci');
  await rm(temp, { recursive: true, force: true });
});

test('Doctor source contains no top-level third-party imports', async () => {
  const source = await readFile(path.join(root, 'scripts', 'ink-doctor.mjs'), 'utf8');
  assert.doesNotMatch(source, /^import .* from ['"](?:playwright-core|@sparticuz\/chromium|pngjs|polygon-clipping)['"]/m);
  assert.match(source, /DEPENDENCY_MISSING/);
  assert.match(source, /installCommand: 'npm ci'/);
});
