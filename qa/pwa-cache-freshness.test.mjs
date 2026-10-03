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

test('legacy worker URL forces one bounded identity navigation with network freshness', async () => {
  const source = await read('product/source/service-worker.js');
  assert.match(source, /MIGRATION_ID = 'ink-pwa-cache-migration-v4'/);
  assert.match(source, /MIGRATION_PARAM = 'ink-pwa-migrate'/);
  assert.match(source, /self\.skipWaiting\(\)/);
  assert.match(source, /clearLegacyInkCaches/);
  assert.match(source, /caches\.delete/);
  assert.match(source, /await clearLegacyInkCaches\(\)/);
  assert.match(source, /await navigateWindows\(\)/);
  assert.match(source, /await self\.clients\.claim\(\)/);
  assert.match(source, /url\.searchParams\.get\(MIGRATION_PARAM\) === MIGRATION_ID/);
  assert.match(source, /url\.searchParams\.set\(MIGRATION_PARAM, MIGRATION_ID\)/);
  assert.match(source, /client\.navigate\?\.\(url\.href\)/);
  assert.match(source, /new Request\(request, \{ cache: 'reload' \}\)/);
  assert.match(source, /caches\.match\(request, \{ ignoreSearch: true \}\)/);
});

test('runtime worker is online-first with build-scoped offline fallback', async () => {
  const source = await read('product/source/service-worker-runtime.js');
  assert.match(source, /importScripts\('\.\/build-identity\.js'\)/);
  assert.match(source, /WORKER_URL\.searchParams\.get\('build'\)/);
  assert.match(source, /PUBLISHED_REVISION/);
  assert.match(source, /new Request\(request, \{ cache: 'no-store' \}\)/);
  assert.match(source, /event\.request\.mode === 'navigate'/);
  assert.match(source, /buildConsistentNavigation/);
  assert.match(source, /networkFirstAsset/);
  assert.match(source, /self\.skipWaiting\(\)/);
  assert.match(source, /key\.startsWith\(CACHE_PREFIX\)/);
  assert.doesNotMatch(source, /client\.navigate/);
  assert.doesNotMatch(source, /const BUILD_ID = '2026/);
  assert.doesNotMatch(source, /if \(cached\) return cached;/);
});

test('application runtime exposes source fallback and Pages publication identity', async () => {
  const config = await read('product/source/src/config.js');
  const template = await read('product/source/shell.template.html');
  const web = await read('product/source/index.html');
  const appSource = await read('product/source/src/ink.js');
  const pagesIdentity = await read('pwa-pages-build-identity.txt');
  assert.match(config, /BUILD_ID = globalThis\.INK_BUILD_ID \|\| 'ink-build-unidentified'/);
  assert.match(template, /<script src="build-identity\.js"><\/script>/);
  assert.match(web, /<script src="build-identity\.js"><\/script>/);
  assert.match(appSource, /deploymentIdentityURL:'\.\/pages-build-identity\.txt'/);
  assert.match(appSource, /window\.INK_ARCHITECTURE\.buildId=status\.buildId/);
  assert.match(pagesIdentity, /permalink: \/product\/source\/pages-build-identity\.txt/);
  assert.match(pagesIdentity, /site\.github\.build_revision/);
});

test('update manager targets runtime worker and auto-activates updates', async () => {
  const source = await read('product/source/src/pwa/update-manager.js');
  const appSource = await read('product/source/src/ink.js');
  assert.match(source, /scriptURL = '\.\/service-worker-runtime\.js'/);
  assert.match(appSource, /scriptURL:'\.\/service-worker-runtime\.js'/);
  assert.match(source, /deploymentIdentityURL = '\.\/pages-build-identity\.txt'/);
  assert.match(source, /pages-jekyll-build-revision/);
  assert.match(source, /url\.searchParams\.set\('build', buildId\)/);
  assert.match(source, /cache: 'no-store'/);
  assert.match(source, /reuseOfflineRegistration/);
  assert.match(source, /updateViaCache: 'none'/);
  assert.match(source, /await this\.registration\.update\(\)/);
  assert.match(source, /this\.autoActivate/);
  assert.match(source, /controllerchange/);
  assert.match(source, /INK_GET_VERSION/);
});
