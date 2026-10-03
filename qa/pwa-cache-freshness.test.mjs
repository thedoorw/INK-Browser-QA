import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { computeBuildId, renderBuildIdentity } from '../product/source/generate-build-identity.mjs';

const read = path => readFile(new URL('../' + path, import.meta.url), 'utf8');

test('generated PWA build identity matches complete product/source fingerprint', async () => {
  const actual = await read('product/source/build-identity.js');
  const buildId = await computeBuildId();
  assert.equal(actual, renderBuildIdentity(buildId));
  assert.match(buildId, /^src-[a-f0-9]{24}$/);
});

test('legacy worker URL is a no-fetch migration bridge', async () => {
  const source = await read('product/source/service-worker.js');
  assert.match(source, /MIGRATION_ID = 'ink-pwa-cache-migration-v1'/);
  assert.match(source, /self\.skipWaiting\(\)/);
  assert.match(source, /key\.startsWith\(CACHE_PREFIX\)/);
  assert.match(source, /client\.navigate\?\.\(client\.url\)/);
  assert.doesNotMatch(source, /addEventListener\('fetch'/);
});

test('runtime worker is online-first with build-scoped offline fallback', async () => {
  const source = await read('product/source/service-worker-runtime.js');
  assert.match(source, /importScripts\('\.\/build-identity\.js'\)/);
  assert.match(source, /new Request\(request, \{ cache: 'no-store' \}\)/);
  assert.match(source, /event\.request\.mode === 'navigate'/);
  assert.match(source, /buildConsistentNavigation/);
  assert.match(source, /networkFirstAsset/);
  assert.match(source, /self\.skipWaiting\(\)/);
  assert.match(source, /key\.startsWith\(CACHE_PREFIX\)/);
  assert.match(source, /replacingPreviousBuild/);
  assert.match(source, /client\.navigate\?\.\(client\.url\)/);
  assert.doesNotMatch(source, /const BUILD_ID = '2026/);
  assert.doesNotMatch(source, /if \(cached\) return cached;/);
});

test('update manager targets runtime worker and auto-activates updates', async () => {
  const source = await read('product/source/src/pwa/update-manager.js');
  const appSource = await read('product/source/src/ink.js');
  assert.match(source, /scriptURL = '\.\/service-worker-runtime\.js'/);
  assert.match(appSource, /scriptURL:'\.\/service-worker-runtime\.js'/);
  assert.match(source, /updateViaCache: 'none'/);
  assert.match(source, /await this\.registration\.update\(\)/);
  assert.match(source, /this\.autoActivate/);
  assert.match(source, /controllerchange/);
  assert.match(source, /INK_GET_VERSION/);
});
