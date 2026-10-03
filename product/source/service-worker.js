// INK legacy cache migration worker.
// Keep this URL stable for browsers still registered against ./service-worker.js.
// It exists only to migrate stale cache-first clients onto the publication-bound
// runtime worker without requiring Ctrl+F5, cache clearing, or unregister.
const MIGRATION_ID = 'ink-pwa-cache-migration-v4';
const MIGRATION_PARAM = 'ink-pwa-migrate';
const CACHE_PREFIX = 'ink-build-';

function isOwnedInkCache(key) {
  return key.startsWith(CACHE_PREFIX) || key.startsWith('ink-v');
}

async function clearLegacyInkCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter(isOwnedInkCache).map(key => caches.delete(key)));
}

async function navigateWindows() {
  const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
  for (const client of windows) {
    try {
      const url = new URL(client.url);
      if (url.origin !== self.location.origin) continue;
      if (url.searchParams.get(MIGRATION_PARAM) === MIGRATION_ID) continue;
      url.searchParams.set(MIGRATION_PARAM, MIGRATION_ID);
      client.navigate?.(url.href).catch(() => null);
    } catch (_) {}
  }
}

// Set the takeover flag immediately, then repeat it inside install. In addition,
// clear the stale cache-first build before navigating controlled clients. This
// makes the recovery deterministic even if Chromium briefly leaves this worker
// in waiting: the previous worker can no longer satisfy the migration
// navigation from its stale build cache and must go to the network.
self.skipWaiting();

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    await clearLegacyInkCaches();
    await self.skipWaiting();
    await navigateWindows();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    await self.clients.claim();
    await navigateWindows();
  })());
});

async function migrationNetworkFirst(request) {
  try {
    const response = await fetch(new Request(request, { cache: 'reload' }));
    if (response) return response;
  } catch (_) {}
  return await caches.match(request, { ignoreSearch: true })
    || await caches.match('./index.html')
    || Response.error();
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(migrationNetworkFirst(event.request));
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'INK_GET_VERSION') return;
  const target = event.ports?.[0] || event.source;
  target?.postMessage?.({
    type: 'INK_VERSION',
    version: '0.1',
    buildId: MIGRATION_ID,
    shellCache: null,
    runtimeCache: null,
    navigationStrategy: 'migration-network-first',
    assetStrategy: 'migration-network-first',
    migration: true
  });
});
