import assert from 'node:assert/strict';
import { Blob, File } from 'node:buffer';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { defaultDocument, activeLayer, activePage } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import { AuditLog } from '../product/source/src/ai/ai-core.js';
import {
  buildRevisionProvenanceGraph,
  provenanceBridgeContext
} from '../product/source/src/provenance/provenance-graph.js';
import { importReferenceIntoDocument } from '../product/source/src/extraction/workspace.js';
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

function createApp() {
  const doc = defaultDocument();
  const app = {
    doc,
    selection: [],
    spatialDirty: false,
    refreshCount: 0,
    replaceCount: 0,
    page() { return activePage(this.doc); },
    layer() { return activeLayer(this.doc); },
    layerObjectsPath(layer = this.layer(), page = this.page()) {
      const pageIndex = this.doc.pages.indexOf(page);
      const layerIndex = page.layers.indexOf(layer);
      return ['pages', pageIndex, 'layers', layerIndex, 'objects'];
    },
    refreshAll() { this.refreshCount += 1; },
    markDirty() {},
    updateHistoryUI() {},
    replaceDocument(next) { this.replaceCount += 1; this.doc = next; }
  };
  app.history = new HistoryManager(app);
  app.revisions = { revisionIdFor: () => null };
  return app;
}

function decodedFixture() {
  return {
    source: {
      name: 'chat-fixture.png',
      mimeType: 'image/png',
      sizeBytes: 4,
      sha256: 'a'.repeat(64),
      width: 1,
      height: 1
    },
    raster: {
      width: 1,
      height: 1,
      data: new Uint8ClampedArray([0, 0, 0, 255])
    },
    referenceSrc: 'data:image/png;base64,AAAA'
  };
}

function historyEvidence(app) {
  return [
    ...(app.history.undoStack || []),
    ...(app.history.redoStack || [])
  ].map(entry => ({
    label: entry.label,
    objectIds: entry.objectIds || [],
    patchCount: entry.patchCount || 0,
    storedBytes: entry.storedBytes || 0
  }));
}

function provenanceProvider(app) {
  return {
    read() {
      const graph = buildRevisionProvenanceGraph({
        document: app.doc,
        historyEntries: historyEvidence(app)
      });
      return {
        modules: {
          provenance: {
            status: 'AVAILABLE',
            fingerprint: graph.fingerprint,
            context: provenanceBridgeContext(graph)
          }
        }
      };
    }
  };
}

{
  const app = createApp();
  const decoded = decodedFixture();
  const before = app.history.undoStack.length;
  const result = importReferenceIntoDocument(app, decoded, {
    actor: { type: 'chat', id: 'unit-chat' },
    sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL,
    operation: CHAT_REFERENCE_HANDOFF_OPERATION
  });
  const found = app.layer().objects.find(object => object.id === result.referenceObjectId);
  assert.ok(found);
  assert.equal(found.type, 'image');
  assert.equal(found.metadata.referenceImport.source.name, 'chat-fixture.png');
  assert.equal(found.metadata.referenceImport.source.mimeType, 'image/png');
  assert.equal(found.metadata.referenceImport.source.sha256, 'a'.repeat(64));
  assert.equal(found.metadata.referenceImport.width, 1);
  assert.equal(found.metadata.referenceImport.height, 1);
  assert.equal(found.metadata.referenceImport.sourceChannel, CHAT_REFERENCE_HANDOFF_CHANNEL);
  assert.equal(found.metadata.referenceImport.actor.type, 'chat');
  assert.equal(found.metadata.source.type, 'chat-attachment');
  assert.equal(app.history.undoStack.length, before + 1);
  assert.equal(app.history.undoStack.at(-1).label, 'Reference import · CHAT attachment');
  assert.equal(app.replaceCount, 0);
}

{
  const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/png' });
  const normalized = normalizeChatAttachment(blob, { name: 'attachment.png', type: 'image/png', lastModified: 1 });
  assert.equal(normalized.name, 'attachment.png');
  assert.equal(normalized.type, 'image/png');
  assert.equal(normalized.size, 3);
}

{
  const app = createApp();
  const decoded = decodedFixture();
  let decodeCalls = 0;
  let importCalls = 0;
  app.extraction = {
    async decode(file) {
      decodeCalls += 1;
      assert.equal(file.name, 'attachment.png');
      assert.equal(file.type, 'image/png');
      return decoded;
    },
    importReference(value, options) {
      importCalls += 1;
      assert.equal(value, decoded);
      return importReferenceIntoDocument(app, value, options);
    }
  };
  const audit = new AuditLog();
  const adapter = createChatReferenceHandoffAdapter(app, {
    auditLog: audit,
    groundedContextProvider: provenanceProvider(app)
  });
  const beforeDoc = app.doc;
  const beforeHistory = app.history.undoStack.length;
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
  assert.equal(receipt.documentId, app.doc.id);
  assert.equal(receipt.targetLayerId, app.layer().id);
  assert.ok(receipt.referenceObjectId);
  assert.equal(receipt.source.sha256, 'a'.repeat(64));
  assert.equal(receipt.source.mimeType, 'image/png');
  assert.equal(receipt.source.width, 1);
  assert.equal(receipt.source.height, 1);
  assert.equal(receipt.history.before.undoCount, beforeHistory);
  assert.equal(receipt.history.after.undoCount, beforeHistory + 1);
  assert.equal(receipt.revision.before, null);
  assert.equal(receipt.revision.after, null);
  assert.ok(receipt.audit?.auditId);
  assert.equal(audit.find(receipt.audit.auditId)?.commands?.[0], CHAT_REFERENCE_HANDOFF_OPERATION);
  assert.equal(receipt.provenance?.status, 'AVAILABLE');
  assert.ok(receipt.provenance.eventIds.length >= 1);
  assert.ok(receipt.provenance.eventKinds.includes('object-source'));
  assert.equal(decodeCalls, 1);
  assert.equal(importCalls, 1);
  assert.equal(app.doc, beforeDoc);
  assert.equal(app.replaceCount, 0);
}

{
  const app = createApp();
  app.extraction = {
    decode: async () => decodedFixture(),
    importReference: value => importReferenceIntoDocument(app, value)
  };
  const audit = new AuditLog();
  const adapter = createChatReferenceHandoffAdapter(app, { auditLog: audit });
  const before = app.history.undoStack.length;
  const receipt = await adapter.importReference(new Blob([new Uint8Array([1])], { type: 'image/png' }));
  assert.equal(receipt.status, 'FAILED');
  assert.equal(receipt.error.code, 'CHAT_REFERENCE_HANDOFF_NAME_REQUIRED');
  assert.equal(app.history.undoStack.length, before);
  assert.ok(receipt.audit?.auditId);
}

{
  const workspaceSource = await source('product/source/src/extraction/workspace.js');
  const handoffSource = await source('product/source/src/ai/chat-reference-handoff.js');
  const installSource = await source('product/source/src/extraction/install.js');
  const inkSource = await source('product/source/src/ink.js');

  assert.match(workspaceSource, /app\.history\.pushScoped\(label,\[target\]/);
  assert.match(workspaceSource, /mimeType:file\.type/);
  assert.match(workspaceSource, /width:bitmap\.width,height:bitmap\.height/);
  assert.match(installSource, /importReference:\s*\(decoded, options\) => importReferenceIntoDocument/);
  assert.match(handoffSource, /app\.extraction\.decode\(file\)/);
  assert.match(handoffSource, /app\.extraction\.importReference\(decoded/);
  assert.match(handoffSource, /auditLog\?\.add|auditLog\.add|auditLog\?\.add/);
  assert.doesNotMatch(handoffSource, /app\.doc\s*=|replaceDocument\s*\(/);
  assert.match(inkSource, /installExtraction\(this\);installChatReferenceHandoff\(this\)/);
  assert.match(inkSource, /FORMAT_VERSION/);
}

console.log('INK-CHAT-VALIDATION-001 Phase A source/unit QA: PASS');
