const RELEASE_VERSION = '1.5.1';
const SHELL_CACHE = `ink-v${RELEASE_VERSION}-shell`;
const RUNTIME_CACHE = `ink-v${RELEASE_VERSION}-runtime`;
const APP_SHELL = [
  './', './index.html', './index-standalone.html', './styles.css',
  './src/config.js', './src/ink.js', './src/ai/ai-core.js', './src/ai/install-ai.js', './src/export/png-worker-encoder.js',
  './src/studio-core.js', './src/vector/vector-core.js', './src/vector/stroke-appearance.js', './src/vector/paint-appearance.js', './src/image/image-core.js', './src/paint/paint-core.js', './src/paint/stroke-model.js', './src/paint/brush-engine.js', './src/paint/stroke-session.js', './src/paint/drawing-workflow-import.js', './src/paint/drawing-quality.js', './src/recipe/recipe-engine.js', './src/vendor/polygon-clipping.umd.min.js',
  './src/program-import/index.js', './src/program-import/importer.js', './src/program-import/format-detector.js', './src/program-import/parsers.js', './src/program-import/security.js', './src/program-import/canonical-operation.js', './src/program-import/compiler.js', './src/program-import/coverage-engine.js', './src/program-import/comparison-engine.js',
  './src/core/index.js', './src/core/math.js', './src/core/geometry.js', './src/core/utils.js',
  './src/document/index.js', './src/document/artboard.js', './src/document/workspace.js', './src/document/model.js', './src/document/migration.js', './src/document/storage.js', './src/document/integrity.js',
  './src/history/index.js', './src/history/diff.js', './src/history/history.js',
  './src/input/input-arbiter.js', './src/input/pen-calibration.js', './src/input/stylus-test.js',
  './src/stroke/index.js', './src/stroke/edit.js',
  './src/spatial/index.js', './src/spatial/quadtree.js', './src/spatial/page-spatial-index.js',
  './src/editor/index.js', './src/editor/selection.js', './src/editor/transform.js', './src/editor/path-edit.js', './src/editor/expressive-stroke.js', './src/editor/composition.js', './src/editor/repaint-material.js', './src/editor/chat-bounded-edit.js',
  './src/render/index.js', './src/render/natural-media-utils.js', './src/render/natural-media-run-utils.js',
  './src/render/paper-profile.js', './src/render/multi-channel-ink.js', './src/render/gpu-resource-budget.js',
  './src/render/tile-atlas.js', './src/render/live-canvas-tile-renderer.js', './src/render/pixel-compare.js', './src/render/tiled-export.js', './src/render/natural-media-controller.js', './src/render/interactive-benchmark.js',
  './src/render/canvas2d/natural-media-canvas2d.js', './src/render/canvas2d/multi-channel-ink-canvas2d.js',
  './src/render/webgl/natural-media-webgl.js', './src/render/webgl/multi-channel-ink-webgl.js',
  './src/export/index.js', './src/export/pdf.js',
  './src/release/index.js', './src/release/runtime-health.js', './src/release/external-diagnostics.js', './src/pwa/index.js', './src/pwa/update-manager.js',
  './dist/ink.compat.js', './manifest.webmanifest', './icons/ink-192.png', './icons/ink-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(APP_SHELL)));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key.startsWith('ink-v') && ![SHELL_CACHE, RUNTIME_CACHE].includes(key)).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  const message = event.data || {};
  if (message.type === 'INK_SKIP_WAITING') self.skipWaiting();
  if (message.type === 'INK_GET_VERSION') event.source?.postMessage?.({ type: 'INK_VERSION', version: RELEASE_VERSION });
  if (message.type === 'INK_CLEAR_RUNTIME_CACHE') event.waitUntil(caches.delete(RUNTIME_CACHE));
});

async function networkFirstNavigation(request) {
  try {
    const response = await fetch(request);
    if (response?.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return await caches.match(request) || await caches.match('./index.html') || Response.error();
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then(async response => {
    if (response?.ok && response.type !== 'opaque') {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  return cached || await fetchPromise || Response.error();
}

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirstNavigation(event.request));
    return;
  }
  event.respondWith(staleWhileRevalidate(event.request));
});
