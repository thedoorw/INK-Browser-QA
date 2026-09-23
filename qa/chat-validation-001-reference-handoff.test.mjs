import assert from 'node:assert/strict';
import { Blob, File } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import {
  CHAT_REFERENCE_HANDOFF_CHANNEL,
  CHAT_REFERENCE_HANDOFF_OPERATION,
  createChatReferenceHandoffAdapter,
  normalizeChatAttachment
} from '../product/source/src/ai/chat-reference-handoff.js';

globalThis.Blob ||= Blob;
globalThis.File ||= File;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const source = async relative => readFile(path.join(root, relative), 'utf8');

function createMockApp() {
  const history = {
    undoStack: [],
    redoStack: [],
    pending: null,
    limit: 30,
    timeline() {
      return {
        entries: [...this.undoStack, ...[...this.redoStack].reverse()],
        applied: this.undoStack.length,
        limit: this.limit
      };
    }
  };
  const layer = { id: 'layer-1' };
  const app = {
    doc: { id: 'doc-1' },
    history,
    layer: () => layer,
    revisions: { revisionIdFor: () => 'rev-7' },
    extraction: {}
  };
  return app;
}

{
  const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
  const normalized = await normalizeChatAttachment(blob, { name: 'attachment.png', type: 'image/png', lastModified: 1 });
  assert.equal(normalized.name, 'attachment.png');
  assert.equal(normalized.type, 'image/png');
  assert.equal(normalized.size, 3);
}

{
  const foreignBlob = new Blob([new Uint8Array([4, 5, 6])], { type: 'image/png' });
  Object.setPrototypeOf(foreignBlob, Object.prototype);
  assert.equal(foreignBlob instanceof Blob, false);
  const normalized = await normalizeChatAttachment(foreignBlob, { name: 'cross-realm.png', type: 'image/png', lastModified: 2 });
  assert.equal(normalized instanceof File, true);
  assert.equal(normalized.name, 'cross-realm.png');
  assert.equal(normalized.type, 'image/png');
  assert.equal(normalized.size, 3);
  assert.deepEqual([...new Uint8Array(await normalized.arrayBuffer())], [4, 5, 6]);
}

{
  const foreignFile = new File([new Uint8Array([7, 8])], 'foreign-file.png', { type: 'image/png', lastModified: 33 });
  Object.setPrototypeOf(foreignFile, Object.prototype);
  assert.equal(foreignFile instanceof File, false);
  const normalized = await normalizeChatAttachment(foreignFile);
  assert.equal(normalized instanceof File, true);
  assert.equal(normalized.name, 'foreign-file.png');
  assert.equal(normalized.type, 'image/png');
  assert.equal(normalized.lastModified, 33);
  assert.deepEqual([...new Uint8Array(await normalized.arrayBuffer())], [7, 8]);
}

{
  const spoof = {
    name: 'spoof.png',
    type: 'image/png',
    size: 3,
    arrayBuffer: async () => new Uint8Array([1, 2, 3]).buffer,
    slice() { return this; },
    [Symbol.toStringTag]: 'Blob'
  };
  await assert.rejects(
    normalizeChatAttachment(spoof, { name: 'spoof.png', type: 'image/png' }),
    error => error?.code === 'CHAT_REFERENCE_HANDOFF_BINARY_REQUIRED'
  );
}

{
  const app = createMockApp();
  const decoded = {
    source: {
      name: 'attachment.png',
      mimeType: 'image/png',
      sizeBytes: 4,
      sha256: 'a'.repeat(64),
      width: 20,
      height: 10
    }
  };
  let decodeCalls = 0;
  let importCalls = 0;
  app.extraction.decode = async file => {
    decodeCalls += 1;
    assert.equal(file.name, 'attachment.png');
    assert.equal(file.type, 'image/png');
    return decoded;
  };
  app.extraction.importReference = (value, options) => {
    importCalls += 1;
    assert.equal(value, decoded);
    assert.equal(options.sourceChannel, CHAT_REFERENCE_HANDOFF_CHANNEL);
    assert.equal(options.operation, CHAT_REFERENCE_HANDOFF_OPERATION);
    app.history.undoStack.push({
      label: 'Reference import · CHAT attachment',
      objectIds: ['reference-1'],
      patchCount: 1,
      captureMode: 'scoped'
    });
    return {
      documentId: app.doc.id,
      layerId: 'layer-1',
      referenceObjectId: 'reference-1'
    };
  };

  const audits = [];
  const auditLog = {
    add(record) {
      const normalized = { format: 'INK-AI-AUDIT', auditId: `audit-${audits.length + 1}`, ...structuredClone(record) };
      audits.push(normalized);
      return structuredClone(normalized);
    }
  };
  const groundedContextProvider = {
    read() {
      return {
        modules: {
          provenance: {
            status: 'AVAILABLE',
            fingerprint: 'prov-fingerprint',
            context: {
              events: [{
                eventId: 'prov-object-source-1',
                kind: 'object-source',
                target: { type: 'object', id: 'reference-1' },
                objectIds: ['reference-1']
              }]
            }
          }
        }
      };
    }
  };

  const adapter = createChatReferenceHandoffAdapter(app, { auditLog, groundedContextProvider });
  const blob = new Blob([new Uint8Array([137, 80, 78, 71])], { type: 'image/png' });
  const checkpoints = [];
  const receipt = await adapter.importReference(blob, {
    name: 'attachment.png',
    type: 'image/png',
    actor: { type: 'chat', id: 'unit-chat' },
    intent: 'Use this attachment as the INK reference',
    checkpoint: event => checkpoints.push(event.stage)
  });

  assert.equal(receipt.status, 'COMPLETED');
  assert.equal(receipt.operation, CHAT_REFERENCE_HANDOFF_OPERATION);
  assert.equal(receipt.sourceChannel, CHAT_REFERENCE_HANDOFF_CHANNEL);
  assert.equal(receipt.documentId, 'doc-1');
  assert.equal(receipt.targetLayerId, 'layer-1');
  assert.equal(receipt.referenceObjectId, 'reference-1');
  assert.equal(receipt.source.sha256, 'a'.repeat(64));
  assert.equal(receipt.source.mimeType, 'image/png');
  assert.equal(receipt.source.width, 20);
  assert.equal(receipt.source.height, 10);
  assert.equal(receipt.history.before.undoCount, 0);
  assert.equal(receipt.history.after.undoCount, 1);
  assert.equal(receipt.revision.before, 'rev-7');
  assert.equal(receipt.revision.after, 'rev-7');
  assert.equal(receipt.audit.auditId, 'audit-1');
  assert.deepEqual(receipt.provenance.eventIds, ['prov-object-source-1']);
  assert.deepEqual(receipt.provenance.eventKinds, ['object-source']);
  assert.equal(decodeCalls, 1);
  assert.equal(importCalls, 1);
  assert.equal(audits[0].commands[0], CHAT_REFERENCE_HANDOFF_OPERATION);
  assert.deepEqual(checkpoints, [
    'normalization returned',
    'decoder entered',
    'decoder returned',
    'Reference import committed'
  ]);
}

{
  const app = createMockApp();
  app.history.limit = 20;
  for (let index = 0; index < app.history.limit; index++) {
    app.history.undoStack.push({
      label: `Existing history ${index + 1}`,
      objectIds: [`existing-${index + 1}`],
      patchCount: 1,
      captureMode: 'scoped'
    });
  }
  const oldestBefore = app.history.undoStack[0].objectIds[0];
  const decoded = {
    source: {
      name: 'saturated.png',
      mimeType: 'image/png',
      sizeBytes: 4,
      sha256: 'b'.repeat(64),
      width: 12,
      height: 8
    }
  };
  app.extraction.decode = async () => decoded;
  app.extraction.importReference = () => {
    app.history.undoStack.push({
      label: 'Reference import · CHAT attachment',
      objectIds: ['reference-saturated'],
      patchCount: 1,
      captureMode: 'scoped'
    });
    if (app.history.undoStack.length > app.history.limit) app.history.undoStack.shift();
    app.history.redoStack = [];
    return {
      documentId: app.doc.id,
      layerId: 'layer-1',
      referenceObjectId: 'reference-saturated'
    };
  };
  const audits = [];
  const adapter = createChatReferenceHandoffAdapter(app, {
    auditLog: { add(record) { const item = { format: 'INK-AI-AUDIT', auditId: `audit-saturated-${audits.length + 1}`, ...structuredClone(record) }; audits.push(item); return structuredClone(item); } }
  });
  const receipt = await adapter.importReference(
    new Blob([new Uint8Array([1, 2, 3, 4])], { type: 'image/png' }),
    { name: 'saturated.png', type: 'image/png', actor: { type: 'chat', id: 'unit-chat' } }
  );

  assert.equal(receipt.status, 'COMPLETED');
  assert.equal(receipt.history.before.applied, 20);
  assert.equal(receipt.history.before.limit, 20);
  assert.equal(receipt.history.after.applied, 20);
  assert.equal(receipt.history.after.limit, 20);
  assert.equal(receipt.history.commit.valid, true);
  assert.equal(receipt.history.commit.saturatedBefore, true);
  assert.equal(receipt.history.commit.expectedApplied, 20);
  assert.equal(receipt.history.commit.newestMatches, true);
  assert.equal(app.history.undoStack.length, 20);
  assert.notEqual(app.history.undoStack[0].objectIds[0], oldestBefore);
  assert.equal(app.history.undoStack.at(-1).objectIds[0], 'reference-saturated');
}

{
  const app = createMockApp();
  const decoded = {
    source: {
      name: 'post-commit-validation.png',
      mimeType: 'image/png',
      sizeBytes: 2,
      sha256: 'c'.repeat(64),
      width: 4,
      height: 4
    }
  };
  app.extraction.decode = async () => decoded;
  app.extraction.importReference = () => {
    app.history.undoStack.push({
      label: 'Unexpected committed label',
      objectIds: ['reference-post-commit'],
      patchCount: 1,
      captureMode: 'scoped'
    });
    return {
      documentId: app.doc.id,
      layerId: 'layer-1',
      referenceObjectId: 'reference-post-commit'
    };
  };
  const adapter = createChatReferenceHandoffAdapter(app, {
    auditLog: { add: record => ({ format: 'INK-AI-AUDIT', auditId: 'audit-post-commit', ...structuredClone(record) }) }
  });
  const receipt = await adapter.importReference(
    new Blob([new Uint8Array([5, 6])], { type: 'image/png' }),
    { name: 'post-commit-validation.png', type: 'image/png' }
  );

  assert.equal(receipt.status, 'COMMITTED_WITH_ERROR');
  assert.equal(receipt.error.code, 'CHAT_REFERENCE_HANDOFF_HISTORY_CONTRACT');
  assert.equal(receipt.history.commit.valid, false);
  assert.equal(receipt.referenceObjectId, 'reference-post-commit');
  assert.equal(app.history.undoStack.at(-1).objectIds[0], 'reference-post-commit');
  assert.notEqual(receipt.status, 'FAILED');
}

{
  const app = createMockApp();
  app.extraction.decode = async () => { throw new Error('should not decode'); };
  app.extraction.importReference = () => { throw new Error('should not import'); };
  const audits = [];
  const adapter = createChatReferenceHandoffAdapter(app, {
    auditLog: { add: record => ({ format: 'INK-AI-AUDIT', auditId: `audit-fail-${audits.push(record)}` }) }
  });
  const receipt = await adapter.importReference(new Blob([new Uint8Array([1])], { type: 'image/png' }));
  assert.equal(receipt.status, 'FAILED');
  assert.equal(receipt.error.code, 'CHAT_REFERENCE_HANDOFF_NAME_REQUIRED');
  assert.equal(receipt.history.before.undoCount, 0);
  assert.equal(receipt.history.after.undoCount, 0);
  assert.ok(receipt.audit.auditId);
}

{
  const workspaceSource = await source('product/source/src/extraction/workspace.js');
  const handoffSource = await source('product/source/src/ai/chat-reference-handoff.js');
  const installSource = await source('product/source/src/extraction/install.js');
  const inkSource = await source('product/source/src/ink.js');

  assert.match(workspaceSource, /export function importReferenceIntoDocument/);
  assert.match(workspaceSource, /app\.history\.pushScoped\(label,\[target\]/);
  assert.match(workspaceSource, /metadata:\{[\s\S]*referenceImport,[\s\S]*extractionReference:/);
  assert.match(workspaceSource, /mimeType:file\.type/);
  assert.match(workspaceSource, /width:bitmap\.width,height:bitmap\.height/);
  assert.match(installSource, /importReference:\s*\(decoded, options\) => importReferenceIntoDocument/);
  assert.match(handoffSource, /app\.extraction\.decode\(file\)/);
  assert.match(handoffSource, /Blob\.prototype\.arrayBuffer/);
  assert.match(handoffSource, /Object\.getOwnPropertyDescriptor\(Blob\.prototype, 'size'\)/);
  assert.match(handoffSource, /Object\.getOwnPropertyDescriptor\(File\.prototype, 'name'\)/);
  assert.match(handoffSource, /new Uint8Array\(view\)/);
  assert.match(handoffSource, /await normalizeChatAttachment\(input, options\)/);
  assert.match(handoffSource, /emitCheckpoint\('decoder entered'\)/);
  assert.match(handoffSource, /emitCheckpoint\('Reference import committed'/);
  assert.match(handoffSource, /app\.extraction\.importReference\(decoded/);
  assert.match(handoffSource, /history\.timeline/);
  assert.match(handoffSource, /Math\.min\(before\.applied \+ 1, after\.limit\)/);
  assert.match(handoffSource, /newestMatches/);
  assert.match(handoffSource, /COMMITTED_WITH_ERROR/);
  assert.doesNotMatch(handoffSource, /historyAfter\.undoCount\s*!==\s*historyBefore\.undoCount\s*\+\s*1/);
  assert.doesNotMatch(handoffSource, /app\.doc\s*=|replaceDocument\s*\(/);
  assert.match(inkSource, /installExtraction\(this\);installChatReferenceHandoff\(this\)/);
}

console.log('INK-CHAT-VALIDATION-001 Phase A source/unit QA: PASS');
