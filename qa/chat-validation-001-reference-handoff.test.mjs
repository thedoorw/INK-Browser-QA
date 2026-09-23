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
    pending: null
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
  const normalized = normalizeChatAttachment(blob, { name: 'attachment.png', type: 'image/png', lastModified: 1 });
  assert.equal(normalized.name, 'attachment.png');
  assert.equal(normalized.type, 'image/png');
  assert.equal(normalized.size, 3);
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
  const receipt = await adapter.importReference(blob, {
    name: 'attachment.png',
    type: 'image/png',
    actor: { type: 'chat', id: 'unit-chat' },
    intent: 'Use this attachment as the INK reference'
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
  assert.match(handoffSource, /app\.extraction\.importReference\(decoded/);
  assert.doesNotMatch(handoffSource, /app\.doc\s*=|replaceDocument\s*\(/);
  assert.match(inkSource, /installExtraction\(this\);installChatReferenceHandoff\(this\)/);
}

console.log('INK-CHAT-VALIDATION-001 Phase A source/unit QA: PASS');
