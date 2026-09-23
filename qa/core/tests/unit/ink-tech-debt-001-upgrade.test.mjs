import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const source = readFileSync(fileURLToPath(new URL('../../../../product/source/service-worker.js', import.meta.url)), 'utf8');
const base = 'https://example.test/INK/';

function simulateWorker(script, storage, deployment) {
  const handlers = new Map();
  const normalize = input => new URL(typeof input === 'string' ? input : input.url, base).href;
  const cache = name => {
    const entries = storage.get(name) || new Map();
    storage.set(name, entries);
    return {
      async addAll(requests) {
        for (const request of requests) entries.set(normalize(request), { ok: true, value: deployment, clone() { return this; } });
      },
      async match(request, options = {}) {
        const key = normalize(request);
        if (!options.ignoreSearch) return entries.get(key);
        return [...entries].find(([url]) => new URL(url).pathname === new URL(key).pathname)?.[1];
      },
      async put(request, response) { entries.set(normalize(request), response); }
    };
  };
  const context = {
    URL, Request: class { constructor(path, options) { this.url = normalize(path); this.cache = options.cache; } },
    self: { location: { href: base + 'service-worker.js?build=old-client', origin: new URL(base).origin },
      addEventListener(name, callback) { handlers.set(name, callback); }, clients: { claim: async () => {} } },
    caches: { open: async name => cache(name), keys: async () => [...storage.keys()],
      delete: async name => storage.delete(name), match: async request => {
        for (const name of storage.keys()) { const found = await cache(name).match(request); if (found) return found; }
      } },
    fetch: async () => ({ ok: true, value: deployment, clone() { return this; } }),
    Response: { error: () => ({ value: 'error' }) }
  };
  vm.runInNewContext(script, context);
  const lifecycle = async name => {
    let pending;
    handlers.get(name)({ waitUntil(promise) { pending = promise; } });
    await pending;
  };
  const request = path => ({ url: base + path, method: 'GET', mode: path.endsWith('.html') ? 'navigate' : 'same-origin' });
  const fetchFromWorker = async path => {
    let pending;
    handlers.get('fetch')({ request: request(path), respondWith(promise) { pending = promise; } });
    return (await pending).value;
  };
  return { lifecycle, fetchFromWorker };
}

test('old client query cannot choose new worker identity; waiting build keeps old shell coherent', async () => {
  const storage = new Map();
  const old = simulateWorker(source.replace(/(const BUILD_ID = ')[^']+/, '$1build-A'), storage, 'A');
  await old.lifecycle('install');
  await old.lifecycle('activate');
  const next = simulateWorker(source.replace(/(const BUILD_ID = ')[^']+/, '$1build-B'), storage, 'B');
  await next.lifecycle('install');
  assert.ok(storage.has('ink-build-build-A-shell'));
  assert.ok(storage.has('ink-build-build-B-shell'));
  assert.ok([...storage.get('ink-build-build-A-shell').values()].every(response => response.value === 'A'));
  assert.ok([...storage.get('ink-build-build-B-shell').values()].every(response => response.value === 'B'));
  assert.equal(await old.fetchFromWorker('index.html'), 'A');
  assert.equal(await old.fetchFromWorker('src/config.js?v=0.1'), 'A');
  await next.lifecycle('activate');
  assert.equal(storage.has('ink-build-build-A-shell'), false);
  assert.equal(await next.fetchFromWorker('index.html'), 'B');
  assert.equal(await next.fetchFromWorker('src/config.js?v=0.1'), 'B');
});
