// INK legacy cache migration worker.
// Keep this URL stable for browsers still registered against ./service-worker.js.
// It exists only to migrate stale cache-first clients onto the generated-identity
// runtime worker without requiring Ctrl+F5 or manual cache clearing.
const MIGRATION_ID = 'ink-pwa-cache-migration-v2';

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    // Claim first so the migration fetch policy governs the forced reload and
    // every bootstrap dependency. Keep previous caches until the runtime worker
    // has installed a complete coherent shell; they remain the offline fallback.
    await self.clients.claim();
    await new Promise(resolve => setTimeout(resolve, 250));
    const windows = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    await Promise.all(windows.map(client => client.navigate?.(client.url).catch(() => null)));
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
