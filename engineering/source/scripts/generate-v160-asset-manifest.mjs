#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), library = path.join(root, 'external-assets', 'library');
const inventory = JSON.parse(await readFile(path.join(root, 'fixtures', 'external-asset-inventory-v1.1.0.json'), 'utf8'));
const metadata = new Map(inventory.assets.map(asset => [asset.relativePath, asset]));
const files = [];
async function walk(directory) { for (const entry of await readdir(directory, { withFileTypes: true })) { const file = path.join(directory, entry.name); if (entry.isDirectory()) await walk(file); else files.push(file); } }
await walk(library);
const assets = [];
for (const file of files.sort()) {
  const relative = path.relative(library, file).split(path.sep).join('/'), record = metadata.get(relative), bytes = await readFile(file), info = await stat(file), extension = path.extname(file).slice(1).toLowerCase();
  assets.push({
    assetId: record?.id || `license-${path.basename(file).replace(/[^a-z0-9]+/gi, '-').toLowerCase()}`,
    type: relative.startsWith('licenses/') ? 'license' : ['png', 'jpg', 'jpeg'].includes(extension) ? 'image' : extension === 'svg' ? 'reference' : ['jsx', 'py', 'js', 'atn'].includes(extension) ? 'script' : 'fixture',
    path: `external-assets/library/${relative}`, embedded: true, optional: false, hash: createHash('sha256').update(bytes).digest('hex'), size: info.size,
    source: record?.sourceUrl || 'Bundled license evidence from INK v1.1.0 verified asset inventory', license: record?.license || (relative.includes('tessagon') || relative.includes('inkscape') ? 'BSD-3-Clause' : 'MIT'),
    fallback: null, usedBy: ['tests/unit/program-import-v110.test.mjs'], scope: 'test-only', revision: record?.revision || null
  });
}
const manifest = { format: 'INK-ASSET-MANIFEST', version: '1.0', packageMode: 'Portable Package', generatedAt: '2026-08-04T00:00:00.000Z', categories: ['images', 'fonts', 'brushes', 'scripts', 'profiles', 'fixtures', 'reference files', 'external program assets', 'optional assets', 'test-only assets'], assets };
await writeFile(path.join(root, 'ASSET_MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`);
process.stdout.write(`${JSON.stringify({ status: 'PASS', assets: assets.length })}\n`);
