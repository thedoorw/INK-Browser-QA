import { readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, '..');
const sourceRoot = path.join(repoRoot, 'product', 'source');
const entry = 'src/ink.js';
const output = path.join(sourceRoot, 'ink.file-runtime.js');

const moduleId = relativePath => '@ink/' + relativePath.replace(/\\/g, '/');
const normalize = value => value.replace(/\\/g, '/').replace(/^\.\//, '');

const STATIC_PATTERNS = [
  /\bimport\s+(?:[^'";]*?\s+from\s+)?(['"])([^'"]+)\1/g,
  /\bexport\s+[^'";]*?\s+from\s+(['"])([^'"]+)\1/g
];
const DYNAMIC_PATTERN = /\bimport\s*\(\s*(['"])([^'"]+)\1\s*\)/g;

function localSpecifier(specifier) {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

function posixJoin(fromPath, specifier) {
  return path.posix.normalize(path.posix.join(path.posix.dirname(fromPath), specifier));
}

async function resolveSpecifier(fromPath, specifier) {
  const candidate = posixJoin(fromPath, specifier);
  const candidates = path.posix.extname(candidate)
    ? [candidate]
    : [candidate, candidate + '.js', candidate + '.mjs', path.posix.join(candidate, 'index.js')];
  for (const relativePath of candidates) {
    try {
      if ((await stat(path.join(sourceRoot, ...relativePath.split('/')))).isFile()) return relativePath;
    } catch {}
  }
  throw new Error('Unresolved local module: ' + fromPath + ' -> ' + specifier);
}

function collectSpecifiers(source) {
  const found = [];
  for (const pattern of STATIC_PATTERNS) {
    pattern.lastIndex = 0;
    let match;
    while ((match = pattern.exec(source))) found.push(match[2]);
  }
  DYNAMIC_PATTERN.lastIndex = 0;
  let match;
  while ((match = DYNAMIC_PATTERN.exec(source))) found.push(match[2]);
  return [...new Set(found)];
}

function rewriteWithResolution(source, fromPath, resolutionMap) {
  const rewrite = (full, quote, specifier) => {
    if (!localSpecifier(specifier)) return full;
    const resolved = resolutionMap.get(specifier);
    if (!resolved) throw new Error('Missing resolved module: ' + fromPath + ' -> ' + specifier);
    return full.replace(quote + specifier + quote, quote + moduleId(resolved) + quote);
  };
  for (const pattern of STATIC_PATTERNS) {
    pattern.lastIndex = 0;
    source = source.replace(pattern, rewrite);
  }
  DYNAMIC_PATTERN.lastIndex = 0;
  source = source.replace(DYNAMIC_PATTERN, rewrite);
  return source;
}

const modules = new Map();
const resolutions = new Map();
const queue = [entry];

while (queue.length) {
  const relativePath = normalize(queue.shift());
  if (modules.has(relativePath)) continue;
  const absolutePath = path.join(sourceRoot, ...relativePath.split('/'));
  const source = await readFile(absolutePath, 'utf8');
  modules.set(relativePath, source);

  const moduleResolutions = new Map();
  for (const specifier of collectSpecifiers(source)) {
    if (!localSpecifier(specifier)) continue;
    const resolved = await resolveSpecifier(relativePath, specifier);
    moduleResolutions.set(specifier, resolved);
    if (!modules.has(resolved)) queue.push(resolved);
  }
  resolutions.set(relativePath, moduleResolutions);
}

const transformed = {};
for (const [relativePath, source] of modules) {
  transformed[moduleId(relativePath)] = rewriteWithResolution(source, relativePath, resolutions.get(relativePath));
}

const payload = JSON.stringify(transformed);
const generated = `/* INK v0.1 direct-file Runtime payload.
 * GENERATED from product/source/src via engineering/build-file-runtime.mjs.
 * Modular source remains authoritative.
 */
(() => {
  const MODULES = ${payload};
  const state = window.__INK_FILE_RUNTIME__ = {
    mode: 'file-compatible',
    state: 'loading',
    entry: '${moduleId(entry)}',
    moduleCount: Object.keys(MODULES).length,
    error: null
  };

  try {
    const imports = {};
    const objectUrls = [];
    for (const [id, source] of Object.entries(MODULES)) {
      const url = URL.createObjectURL(new Blob([source], { type: 'text/javascript' }));
      imports[id] = url;
      objectUrls.push(url);
    }

    const importMap = document.createElement('script');
    importMap.type = 'importmap';
    importMap.textContent = JSON.stringify({ imports });
    (document.head || document.documentElement).append(importMap);

    const bootstrapUrl = URL.createObjectURL(new Blob([
      'import "${moduleId(entry)}";\\n' +
      'window.__INK_FILE_RUNTIME__.state = "loaded";\\n' +
      'document.documentElement.dataset.inkFileRuntime = "loaded";'
    ], { type: 'text/javascript' }));
    objectUrls.push(bootstrapUrl);

    const bootstrap = document.createElement('script');
    bootstrap.type = 'module';
    bootstrap.src = bootstrapUrl;
    bootstrap.onerror = event => {
      state.state = 'failed';
      state.error = 'BOOTSTRAP_MODULE_FAILED';
      document.documentElement.dataset.inkFileRuntime = 'failed';
      console.error('INK_FILE_RUNTIME_BOOTSTRAP_FAILED', event);
    };
    document.body.append(bootstrap);

    window.addEventListener('error', event => {
      if (state.state === 'loaded') return;
      state.state = 'failed';
      state.error = String(event.error?.message || event.message || 'Runtime error');
      document.documentElement.dataset.inkFileRuntime = 'failed';
    });
    window.addEventListener('unhandledrejection', event => {
      if (state.state === 'loaded') return;
      state.state = 'failed';
      state.error = String(event.reason?.message || event.reason || 'Unhandled rejection');
      document.documentElement.dataset.inkFileRuntime = 'failed';
    });

    window.addEventListener('beforeunload', () => {
      for (const url of objectUrls) URL.revokeObjectURL(url);
    }, { once: true });
  } catch (error) {
    state.state = 'failed';
    state.error = String(error?.message || error);
    document.documentElement.dataset.inkFileRuntime = 'failed';
    console.error('INK_FILE_RUNTIME_SETUP_FAILED', error);
  }
})();
`;

await writeFile(output, generated);
console.log(JSON.stringify({
  status: 'PASS',
  entry,
  modules: modules.size,
  bytes: Buffer.byteLength(generated),
  output: path.relative(repoRoot, output).replace(/\\/g, '/')
}, null, 2));
