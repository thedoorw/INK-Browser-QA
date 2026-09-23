import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
const sourceRoot = resolve(repoRoot, 'product/source');
const srcRoot = resolve(sourceRoot, 'src');
const read = path => readFileSync(resolve(sourceRoot, path), 'utf8');

function walk(root) {
  const out = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const full = resolve(root, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function sourceRelative(file) {
  return relative(srcRoot, file).split(sep).join('/');
}

function normalizeDelivery(html, delivery) {
  const label = `INK v0.1 · ${delivery}`;
  return html.replace(/\r\n/g, '\n')
    .replace(`<meta name="application-name" content="${label}">`, '<meta name="application-name" content="INK v0.1">')
    .replace(`<title>${label}</title>`, '<title>INK v0.1</title>')
    .replace(`<div class="menu-app-mark" aria-label="${label}">`, '<div class="menu-app-mark" aria-label="INK v0.1">')
    .replace(`<div class="brand" aria-label="${label}">`, '<div class="brand" aria-label="INK v0.1">')
    .replace(`<span class="version-badge">v0.1 · ${delivery}</span>`, '<span class="version-badge">v0.1</span>')
    .replace(`<link rel="manifest" href="${delivery === 'Web' ? 'manifest' : 'manifest-portable'}.webmanifest?v=0.1">`, '<link rel="manifest" href="DELIVERY_MANIFEST">')
    .replace(delivery === 'Web' ? '<script type="module" src="src/ink.js?v=0.1"></script>' : '<script src="dist/ink.compat.js?v=0.1"></script>', '<script src="DELIVERY_BOOT"></script>')
    .replace(delivery === 'Web' ? '<span class="web-surface-badge">WEB</span>' : '', '');
}

test('offline closure and build identity are deterministic', () => {
  const sw = read('service-worker.js');
  const sourceFiles = walk(srcRoot)
    .filter(file => /\.(?:js|json)$/i.test(file))
    .map(file => `./src/${sourceRelative(file)}`)
    .sort();
  const shellFiles = [...sw.matchAll(/['"](\.\/src\/[^'"]+\.(?:js|json))['"]/g)]
    .map(match => match[1])
    .sort();

  assert.deepEqual(shellFiles, sourceFiles);
  assert.doesNotThrow(() => new Function(sw));
  assert.match(sw, /const PRODUCT_VERSION = '0\.1'/);
  assert.match(sw, /const CACHE_PREFIX = 'ink-build-'/);
  assert.match(sw, /const BUILD_ID = '[^']+'/);
  assert.doesNotMatch(sw, /searchParams\.get\('build'\)/);
  assert.match(sw, /cache: 'reload'/);
  assert.match(read('src/pwa/update-manager.js'), /updateViaCache: 'none'/);
  assert.match(read('src/ink.js'), /scriptURL:'\.\/service-worker\.js'/);
  assert.doesNotMatch(sw, /ink-v0\.1-Web-shell/);
  assert.ok(sw.includes("'./qa/runtime-test-bridge.js'"));
});

test('bootstrap has one ready contract and no retry polling', () => {
  const ink = read('src/ink.js');
  const shell = read('web-shell.js');

  assert.match(ink, /CustomEvent\('ink:runtime-ready'/);
  assert.match(shell, /RUNTIME_READY_EVENT = 'ink:runtime-ready'/);
  assert.match(shell, /addEventListener\(RUNTIME_READY_EVENT, onRuntimeReady, \{ once: true \}\)/);
  assert.doesNotMatch(shell, /retryCount/);
  assert.doesNotMatch(shell, /setTimeout\(tryBind/);
});

test('large QA surface is opt-in and outside production src', () => {
  const ink = read('src/ink.js');
  const bridge = read('qa/runtime-test-bridge.js');

  assert.ok(existsSync(resolve(sourceRoot, 'qa/runtime-test-bridge.js')));
  assert.match(ink, /searchParams\.get\('ink-qa'\)==='1'/);
  assert.match(ink, /import\('\.\.\/qa\/runtime-test-bridge\.js'\)/);
  assert.match(ink, /INK_QA_BRIDGE_READY=loadRuntimeQaBridge\(app\)\.finally\(\(\)=>signalRuntimeReady\(app\)\)/);
  assert.doesNotMatch(ink, /window\.INK_TEST\s*=/);
  assert.doesNotMatch(ink, /fresh\(\)\{app\.replaceDocument/);
  assert.match(bridge, /target\.INK_TEST = bridge/);
});

test('Web and Portable keep one shared shell contract', () => {
  const web = read('index.html');
  const portable = read('index-standalone.html');

  assert.equal(normalizeDelivery(web, 'Web'), normalizeDelivery(portable, 'Portable'));
  execFileSync(process.execPath, [resolve(sourceRoot, 'generate-shell.mjs'), '--check']);
  for (const html of [web, portable]) {
    assert.doesNotMatch(html, /ink-startup-shell/);
    assert.match(html, /<link rel="icon" href="assets\/INK_MARK_SOURCE_W-300\.jpg\?v=0\.1" type="image\/jpeg">/);
    assert.equal((html.match(/INK_MARK_SOURCE_W-300\.jpg/g) || []).length, 3);
    const shellIndex = html.indexOf('<script src="web-shell.js?v=0.1"></script>');
    const bootIndex = Math.max(
      html.indexOf('<script type="module" src="src/ink.js?v=0.1"></script>'),
      html.indexOf('<script src="dist/ink.compat.js?v=0.1"></script>')
    );
    assert.ok(shellIndex >= 0 && bootIndex > shellIndex);
  }
});

test('CSS and active metadata expose one current authority', () => {
  const css = read('styles.css');
  const config = read('src/config.js');
  const compat = read('dist/ink.compat.js');
  const ink = read('src/ink.js');

  assert.equal((css.match(/INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY/g) || []).length, 1);
  assert.equal((css.match(/INK-WEB-UI-006 Phase B — LIGHT SHELL \/ ORIGINAL BRAND SOURCE/g) || []).length, 0);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
  assert.ok((css.match(/:root\s*\{/g) || []).length <= 14);
  assert.ok((css.match(/!important/g) || []).length <= 222);
  assert.doesNotMatch(css, /ink-mark\.svg|\.brand-mark|menu-app-mark>span/);
  assert.doesNotMatch(css, /INK v(?:0\.8|1\.5)/);
  assert.match(config, /INK_VERSION\s*=\s*'0\.1'/);
  assert.match(config, /FORMAT_VERSION\s*=\s*4\b/);
  const appBuild = config.match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  const workerBuild = read('service-worker.js').match(/BUILD_ID\s*=\s*'([^']+)'/)?.[1];
  assert.ok(appBuild);
  assert.equal(appBuild, workerBuild);
  assert.match(ink, /buildExternalDiagnosticBundle\(\{app:this,target:window,recorder:this\.externalValidation,version:INK_VERSION,buildId:BUILD_ID,formatVersion:FORMAT_VERSION\}\)/);
  assert.doesNotMatch(compat, /v1\.6|RC/);
  assert.match(ink, /inventory:'partial-runtime-capability-tags',complete:false/);
});

test('browser QA checks worker-owned identity without rewriting the registration', () => {
  const harness = readFileSync(resolve(repoRoot, 'qa/runtime/ink-web-ui-001-harness.html'), 'utf8');
  assert.match(harness, /registration\.active\.postMessage\(\{ type: 'INK_GET_VERSION' \}\)/);
  assert.match(harness, /workerBuildId === appBuildId/);
  assert.match(harness, /await registration\.update\(\)/);
  assert.match(harness, /swUpdateViaCache === 'none'/);
  assert.doesNotMatch(harness, /qa-refresh|service-worker\.js\?build=|serviceWorker\.register\(/);
});
