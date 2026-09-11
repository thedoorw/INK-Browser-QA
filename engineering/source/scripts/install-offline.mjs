#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const requested = process.argv.indexOf('--bundle');
const candidates = [
  requested >= 0 ? path.resolve(process.argv[requested + 1] || '') : null,
  path.join(root, 'offline-dependencies'),
  path.join(root, '..', '..', 'INK_Core_Main_Program_v1.6.0_RC_Offline_Dependencies')
].filter(Boolean);
const exists = async value => { try { await access(value); return true; } catch { return false; } };
const bundle = (await Promise.all(candidates.map(async value => [value, await exists(path.join(value, 'manifest.json'))]))).find(([, found]) => found)?.[0];
if (!bundle) {
  process.stderr.write(`${JSON.stringify({ status: 'FAIL', code: 'OFFLINE_BUNDLE_NOT_FOUND', searched: candidates, usage: 'node scripts/install-offline.mjs --bundle <directory>' }, null, 2)}\n`);
  process.exit(2);
}
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const manifest = JSON.parse(await readFile(path.join(bundle, 'manifest.json'), 'utf8'));
const lockBytes = await readFile(path.join(root, 'package-lock.json'));
if (sha256(lockBytes) !== manifest.packageLockSha256) {
  process.stderr.write(`${JSON.stringify({ status: 'FAIL', code: 'PACKAGE_LOCK_MISMATCH', expected: manifest.packageLockSha256, actual: sha256(lockBytes) }, null, 2)}\n`);
  process.exit(2);
}
for (const item of manifest.packages) {
  const target = path.join(bundle, 'tarballs', item.file);
  const bytes = await readFile(target).catch(() => null);
  if (!bytes || sha256(bytes) !== item.sha256) {
    process.stderr.write(`${JSON.stringify({ status: 'FAIL', code: bytes ? 'OFFLINE_TARBALL_HASH_MISMATCH' : 'OFFLINE_TARBALL_MISSING', dependency: `${item.name}@${item.version}`, file: item.file }, null, 2)}\n`);
    process.exit(2);
  }
}
const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-offline-install-'));
const cache = path.join(temp, 'cache'), userconfig = path.join(temp, 'npmrc');
await writeFile(userconfig, 'audit=false\nfund=false\nupdate-notifier=false\n');
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const cleanEnvironment = Object.fromEntries(Object.entries(process.env).filter(([key]) => !/^npm_config_/i.test(key)));
const run = args => new Promise((resolve, reject) => {
  const child = spawn(npm, args, { cwd: root, stdio: 'inherit', env: { ...cleanEnvironment, npm_config_cache: cache, npm_config_userconfig: userconfig, npm_config_offline: 'true', npm_config_audit: 'false', npm_config_fund: 'false', npm_config_update_notifier: 'false' } });
  child.on('error', reject); child.on('exit', code => code === 0 ? resolve() : reject(Object.assign(new Error(`npm exited ${code}`), { code })));
});
try {
  for (const item of manifest.packages) await run(['cache', 'add', path.join(bundle, 'tarballs', item.file)]);
  await run(['ci', '--offline', '--no-audit', '--fund=false']);
  process.stdout.write(`${JSON.stringify({ status: 'PASS', mode: 'OFFLINE', packages: manifest.packages.length, packageLockSha256: manifest.packageLockSha256 }, null, 2)}\n`);
} catch (error) {
  process.stderr.write(`${JSON.stringify({ status: 'FAIL', code: 'OFFLINE_INSTALL_FAILED', message: error.message }, null, 2)}\n`); process.exitCode = 2;
} finally { await rm(temp, { recursive: true, force: true }); }
