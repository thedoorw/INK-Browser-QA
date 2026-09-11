import { createHash } from 'node:crypto';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const excluded = new Set(['CHECKSUMS_SHA256.txt']);
async function walk(folder) {
  const result = [];
  for (const name of await readdir(folder)) {
    if (name === 'node_modules' || name === '.npm-cache' || name.startsWith('.browser-home') || name === '__pycache__') continue;
    const file = join(folder, name), info = await stat(file);
    if (info.isDirectory()) result.push(...await walk(file)); else if (info.isFile()) result.push(file);
  }
  return result;
}
const files = (await walk(root)).filter(file => !excluded.has(relative(root, file).replaceAll('\\', '/'))).sort();
const lines = [];
for (const file of files) lines.push(`${createHash('sha256').update(await readFile(file)).digest('hex')}  ${relative(root, file).replaceAll('\\', '/')}`);
await writeFile(join(root, 'CHECKSUMS_SHA256.txt'), `${lines.join('\n')}\n`);
console.log(`CHECKSUM MANIFEST CREATED: ${files.length} files`);
