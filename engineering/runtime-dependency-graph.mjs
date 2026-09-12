#!/usr/bin/env node

import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import process from 'node:process';

const repositoryRoot = resolve(import.meta.dirname, '..');
const sourceRoot = resolve(repositoryRoot, 'product/source');
const entryArg = process.argv.find(argument => argument.startsWith('--entry='));
const entry = resolve(sourceRoot, entryArg ? entryArg.slice('--entry='.length) : 'src/ink.js');

const STATIC_PATTERNS = [
  /\bimport\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]/g,
  /\bexport\s+[^'";]*?\s+from\s+['"]([^'"]+)['"]/g
];
const DYNAMIC_PATTERN = /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g;

function runtimePath(file) {
  return relative(sourceRoot, file).split(sep).join('/');
}

function classify(file) {
  const path = runtimePath(file);
  if (path.startsWith('src/flora/')) return 'FLORA_CAPABILITY';
  if (path.startsWith('src/ai/')) return 'AI_CAPABILITY';
  if (path.startsWith('src/recipe/')) return 'RECIPE_AUTOMATION';
  if (path.startsWith('src/pwa/') || path === 'service-worker.js' || path === 'manifest.webmanifest') return 'PWA_SHELL';
  if (path.startsWith('src/assets/') || path.startsWith('assets/')) return 'RUNTIME_ASSET';
  if (path.startsWith('schemas/')) return 'SCHEMA';
  if (path === 'src/ink.js' || path.startsWith('src/core/') || path.startsWith('src/document/') || path.startsWith('src/history/') || path.startsWith('src/input/') || path.startsWith('src/stroke/') || path.startsWith('src/spatial/') || path.startsWith('src/editor/') || path.startsWith('src/render/') || path.startsWith('src/export/') || path.startsWith('src/release/') || path.startsWith('src/material/') || path.startsWith('src/recompute/') || path.startsWith('src/program-import/')) return 'CORE_RUNTIME';
  return 'CORE_UI';
}

async function resolveModule(importer, specifier) {
  if (!specifier.startsWith('.')) return null;
  const candidate = resolve(dirname(importer), specifier);
  const candidates = extname(candidate) ? [candidate] : [candidate, `${candidate}.js`, `${candidate}.mjs`, resolve(candidate, 'index.js')];
  for (const path of candidates) {
    try {
      if ((await stat(path)).isFile()) return path;
    } catch {}
  }
  throw new Error(`Unresolved local module: ${runtimePath(importer)} -> ${specifier}`);
}

function matches(source, patterns) {
  const imports = [];
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) imports.push(match[1]);
  }
  return [...new Set(imports)];
}

const modules = new Map();
const dynamicEdges = [];
const staticEdges = [];

async function visit(file) {
  if (modules.has(file)) return;
  const source = await readFile(file, 'utf8');
  const bytes = Buffer.byteLength(source);
  modules.set(file, { path: runtimePath(file), bytes, classification: classify(file) });

  for (const specifier of matches(source, STATIC_PATTERNS)) {
    const target = await resolveModule(file, specifier);
    if (!target) continue;
    staticEdges.push({ from: runtimePath(file), to: runtimePath(target), specifier });
    await visit(target);
  }
  DYNAMIC_PATTERN.lastIndex = 0;
  for (const match of source.matchAll(DYNAMIC_PATTERN)) {
    const target = await resolveModule(file, match[1]);
    if (!target) continue;
    dynamicEdges.push({ from: runtimePath(file), to: runtimePath(target), specifier: match[1] });
  }
}

await visit(entry);

const records = [...modules.values()].sort((a, b) => a.path.localeCompare(b.path));
const byClassification = Object.fromEntries(
  [...new Set(records.map(record => record.classification))].sort().map(classification => {
    const selected = records.filter(record => record.classification === classification);
    return [classification, { modules: selected.length, bytes: selected.reduce((sum, record) => sum + record.bytes, 0) }];
  })
);

const result = {
  entry: runtimePath(entry),
  measurement: 'static eager ESM graph; literal dynamic imports are recorded but excluded from reachable totals',
  reachableModules: records.length,
  reachableBytes: records.reduce((sum, record) => sum + record.bytes, 0),
  byClassification,
  staticEdges: staticEdges.length,
  dynamicEdges,
  modules: records
};

process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
