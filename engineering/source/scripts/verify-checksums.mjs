import { createHash } from 'node:crypto';
import { readFile, readdir, stat } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = join(root, 'CHECKSUMS_SHA256.txt');
const manifest = await readFile(manifestPath, 'utf8');
const expected = new Map();
for (const line of manifest.split(/\r?\n/)) {
  if (!line.trim()) continue;
  const match = line.match(/^([0-9a-f]{64})  (.+)$/);
  if (!match) throw new Error(`Malformed checksum line: ${line}`);
  if (expected.has(match[2])) throw new Error(`Duplicate path: ${match[2]}`);
  expected.set(match[2], match[1]);
}

async function walk(dir) {
  const result = [];
  for (const name of await readdir(dir)) {
    if (name === 'node_modules' || name === '.npm-cache' || name.startsWith('.browser-home') || name === '__pycache__') continue;
    const path = join(dir, name);
    const info = await stat(path);
    if (info.isDirectory()) result.push(...await walk(path));
    else if (info.isFile()) result.push(path);
  }
  return result;
}
const files = (await walk(root)).filter(path => relative(root, path).replaceAll('\\', '/') !== 'CHECKSUMS_SHA256.txt');
const actualPaths = new Set(files.map(path => relative(root, path).replaceAll('\\', '/')));
for (const path of expected.keys()) if (!actualPaths.has(path)) throw new Error(`Missing file: ${path}`);
for (const path of actualPaths) if (!expected.has(path)) throw new Error(`Unlisted file: ${path}`);
for (const path of [...expected.keys()].sort()) {
  const digest = createHash('sha256').update(await readFile(join(root, path))).digest('hex');
  if (digest !== expected.get(path)) throw new Error(`Checksum mismatch: ${path}`);
}
console.log(`CHECKSUM VERIFICATION PASS: ${expected.size} files`);
