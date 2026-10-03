// INK legacy cache migration worker.
// Keep this URL stable for browsers still registered against ./service-worker.js.
// Intentionally NO fetch handler: once this worker takes over, online requests
// bypass the legacy cache-first worker and reach the deployed source directly.
const CACHE_PREFIX = 'ink-build-';
const MIGRATION_ID = 'ink-pwa-cache-migration-v1';

self.addEventListener('install', () => {
  // Standard recovery pattern for a buggy legacy worker: take over immediately.
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Keep activation lifetime tied only to cache cleanup. Do not await
  // WindowClient.navigate() here: navigation may itself wait for activation.
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX)).map(key => caches.delete(key)))
    )
  );
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then(windows => windows.forEach(client => {
      client.navigate?.(client.url).catch(() => null);
    }))
    .catch(() => null);
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
    navigationStrategy: 'network-pass-through',
    assetStrategy: 'network-pass-through',
    migration: true
  });
});
