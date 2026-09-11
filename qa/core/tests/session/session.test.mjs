import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { SessionManager } from '../../src/headless/session-manager.js';

test('Session is saved and restored after manager recreation', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ink-session-test-'));
  try {
    const first = new SessionManager({ root }), session = await first.create({ seed: 15101 }), file = first.sessionPath(session.sessionId);
    const second = new SessionManager({ root }), restored = await second.load(file), document = await second.document(file);
    assert.equal(restored.session.sessionId, session.sessionId); assert.equal(document.document.id, 'document-15101'); assert.equal(restored.session.rounds.length, 0);
  } finally { await rm(root, { recursive: true, force: true }); }
});
