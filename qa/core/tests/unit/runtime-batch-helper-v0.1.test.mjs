import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { startServer, validateEvidence } from '../../../runtime/run-ink-runtime-batch.mjs';

test('loopback serves modules and fixture; rejects traversal and malformed/duplicate callbacks', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'ink-helper-test-'));
  for (const dir of ['product/source/src', 'qa/runtime', 'qa/fixtures/rose-window']) await mkdir(path.join(root, dir), { recursive: true });
  for (const [name, text] of Object.entries({ 'product/source/index.html': '<html>INK</html>', 'product/source/src/ink.js': 'export const x=1;', 'qa/runtime/test.html': '<html>QA</html>', 'qa/fixtures/rose-window/rose-window-primary.png': 'fixture', 'secret': 'outside' })) await writeFile(path.join(root, name), text);
  const received = [];
  const { server, origin } = await startServer(root, { id: 'ui', file: 'test.html' }, value => received.push(value));
  try {
    assert.match(origin, /^http:\/\/127\.0\.0\.1:/);
    const module = await fetch(origin + '/src/ink.js');
    assert.match(module.headers.get('content-type'), /javascript/);
    assert.equal(await module.text(), 'export const x=1;');
    assert.equal(await (await fetch(origin + '/__qa_rose_window.png')).text(), 'fixture');
    assert.equal((await fetch(origin + '/..%2f..%2fsecret')).status, 403);
    assert.equal((await fetch(origin + '/%5csecret')).status, 403);
    assert.equal((await fetch(origin + '/missing')).status, 404);
    assert.equal((await fetch(origin + '/__qa_result', { method: 'POST', body: 'invalid' })).status, 400);
    assert.equal(received.length, 0);
    assert.equal((await fetch(origin + '/__qa_result', { method: 'POST', body: '{"status":"FAIL"}' })).status, 200);
    assert.deepEqual(received, [{ status: 'FAIL' }]);
    assert.equal((await fetch(origin + '/__qa_result', { method: 'POST', body: '{}' })).status, 409);
  } finally {
    server.closeAllConnections(); await new Promise(resolve => server.close(resolve));
    await rm(root, { recursive: true, force: true });
  }
});

test('evidence validation fails closed on empty, partial or contradictory results', () => {
  for (const id of ['ui', 'creative', 'geometry']) assert.throws(() => validateEvidence(id, {}));
  const ui = { schema: 'INK-WEB-UI-001-BROWSER-QA-TRANSPORT', status: 'PASS', formatVersion: 4, checks: Array.from({ length: 40 }, (_, i) => ({ name: `check-${i}`, pass: true })), summary: { total: 40, passed: 40, failed: 0 } };
  assert.equal(validateEvidence('ui', ui), ui);
  assert.throws(() => validateEvidence('ui', { ...ui, checks: [] }));
  assert.throws(() => validateEvidence('ui', { ...ui, checks: ui.checks.map((c, i) => ({ ...c, pass: i !== 7 })) }));
  assert.throws(() => validateEvidence('ui', { ...ui, summary: { total: 40, passed: 39, failed: 1 } }));
  assert.throws(() => validateEvidence('creative', { task: 'INK-CLOUD-018', checks: [], failures: [] }));
  const geometry = { status: 'PASS', formatVersion: 4, roseOutputSubpaths: 12, deterministicRepeat: true };
  assert.equal(validateEvidence('geometry', geometry), geometry);
  assert.throws(() => validateEvidence('geometry', { ...geometry, roseOutputSubpaths: 11 }));
  assert.throws(() => validateEvidence('geometry', { ...geometry, deterministicRepeat: false }));
});
