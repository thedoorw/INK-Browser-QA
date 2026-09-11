import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createDocumentSnapshot, defaultDocument, documentFingerprint,
  inspectDocument, verifyDocumentSnapshot, InkStore
} from '../../src/document/index.js';
import { RuntimeHealthMonitor } from '../../src/release/index.js';
import { ServiceWorkerUpdateManager } from '../../src/pwa/index.js';

test('document integrity accepts the normalized baseline and reports deterministic fingerprint', () => {
  const document = defaultDocument();
  const first = inspectDocument(document);
  const second = inspectDocument(structuredClone(document));
  assert.equal(first.passed, true);
  assert.equal(first.fingerprint, second.fingerprint);
  assert.equal(first.fingerprint, documentFingerprint(document));
  assert.equal(first.stats.pages, 1);
  assert.equal(first.stats.layers, 1);
});

test('document integrity rejects duplicate IDs and invalid point coordinates', () => {
  const document = defaultDocument();
  const layer = document.pages[0].layers[0];
  layer.objects.push({
    id: layer.id,
    type: 'stroke',
    matrix: [1, 0, 0, 1, 0, 0],
    opacity: 1,
    color: '#000000',
    size: 2,
    kind: 'pen',
    smoothing: .5,
    pressure: .5,
    points: [{ x: Number.NaN, y: 0 }]
  });
  const result = inspectDocument(document);
  assert.equal(result.passed, false);
  assert.ok(result.errors.some(item => item.code === 'duplicate-id'));
  assert.ok(result.errors.some(item => item.code === 'invalid-point'));
});

test('document snapshots detect payload tampering', () => {
  const snapshot = createDocumentSnapshot(defaultDocument(), { reason: 'unit-test' });
  assert.equal(verifyDocumentSnapshot(snapshot).valid, true);
  snapshot.value.title = 'tampered';
  const verification = verifyDocumentSnapshot(snapshot);
  assert.equal(verification.valid, false);
  assert.equal(verification.reason, 'fingerprint-mismatch');
});

test('storage V3 verifies checksum and recovers through checkpoint generations', async () => {
  const store = new InkStore({ databaseName: 'INK_RC_TEST', checkpointLimit: 3 });
  const one = defaultDocument(); one.modifiedAt = 'one';
  const two = defaultDocument(); two.modifiedAt = 'two';
  const three = defaultDocument(); three.modifiedAt = 'three';
  await store.save('autosave', one);
  await store.save('autosave', two);
  await store.save('autosave', three);
  const current = store.memory.get('autosave');
  current.value.title = 'corrupted-current';
  const previous = store.memory.get('autosave:previous');
  previous.value.title = 'corrupted-previous';
  const result = await store.loadWithRecovery('autosave', value => inspectDocument(value).passed);
  assert.equal(result.recovered, true);
  assert.equal(result.source, 'checkpoint-1');
  assert.equal(result.verified, true);
  assert.equal(result.value.modifiedAt, 'two');
  assert.ok(result.rejected.some(item => item.reason === 'fingerprint-mismatch'));
});

test('runtime health monitor records frames operations and errors without exposing raw event objects', () => {
  let time = 0;
  const monitor = new RuntimeHealthMonitor({ clock: () => time, longFrameMs: 50 });
  monitor.recordFrame(12);
  monitor.recordFrame(72);
  const token = monitor.beginOperation('export');
  time = 25;
  const sample = monitor.endOperation(token, { tiles: 3 });
  monitor.recordError(new Error('synthetic failure'), { source: 'unit-test' });
  const heartbeat = monitor.heartbeat({ document: { passed: true } });
  const diagnostics = monitor.diagnostics();
  assert.equal(sample.durationMs, 25);
  assert.equal(diagnostics.frames, 2);
  assert.equal(diagnostics.longFrames, 1);
  assert.equal(diagnostics.status, 'warn');
  assert.equal(heartbeat.document.passed, true);
  assert.equal(diagnostics.errors[0].message, 'synthetic failure');
});

test('service worker update manager fails closed when the environment is unsupported', async () => {
  const manager = new ServiceWorkerUpdateManager();
  const result = await manager.register();
  assert.equal(result.supported, false);
  assert.equal(result.state, 'unsupported');
  assert.equal(manager.activateUpdate(), false);
});
