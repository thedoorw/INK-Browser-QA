import test from 'node:test';
import assert from 'node:assert/strict';
import { OptionalCapabilityRegistry } from '../../../../product/source/src/capabilities/optional-capability-registry.js';

test('optional capability has deterministic available to installed state', async () => {
  const app = {};
  const registry = new OptionalCapabilityRegistry(app);
  registry.register({
    id: 'sample',
    load: async () => ({ marker: true }),
    install: async (module, context) => ({
      api: { module, sameApp: context.app === app },
      hooks: { ownsObject: ({ object }) => object.capability === 'sample' }
    })
  });

  assert.deepEqual(registry.status('sample'), { id: 'sample', state: 'available', error: null });
  const api = await registry.install('sample');
  assert.equal(api.module.marker, true);
  assert.equal(api.sameApp, true);
  assert.deepEqual(registry.status('sample'), { id: 'sample', state: 'installed', error: null });
  assert.equal(registry.some('ownsObject', { object: { capability: 'sample' } }), true);
});

test('unavailable and failed capability states are observable without startup mutation', async () => {
  const unavailable = new OptionalCapabilityRegistry({});
  unavailable.register({ id: 'missing', load: async () => ({}), install: async () => ({}) });
  unavailable.markUnavailable('missing', 'not shipped');
  assert.deepEqual(unavailable.status('missing'), { id: 'missing', state: 'unavailable', error: 'not shipped' });
  await assert.rejects(unavailable.install('missing'), /not shipped/);

  const failed = new OptionalCapabilityRegistry({});
  failed.register({ id: 'broken', load: async () => { throw new Error('load rejected'); }, install: async () => ({}) });
  await assert.rejects(failed.install('broken'), /load rejected/);
  assert.deepEqual(failed.status('broken'), { id: 'broken', state: 'failed', error: 'load rejected' });
});

test('installed hook failure is surfaced and isolated', async () => {
  const registry = new OptionalCapabilityRegistry({});
  registry.register({
    id: 'fragile',
    load: async () => ({}),
    install: async () => ({ api: {}, hooks: { renderOverlay: () => { throw new Error('overlay rejected'); } } })
  });
  await registry.install('fragile');
  assert.doesNotThrow(() => registry.notify('renderOverlay', {}));
  assert.deepEqual(registry.status('fragile'), { id: 'fragile', state: 'failed', error: 'renderOverlay: overlay rejected' });
});
