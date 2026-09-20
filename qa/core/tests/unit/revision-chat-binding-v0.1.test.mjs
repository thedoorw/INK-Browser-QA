import test from 'node:test';
import assert from 'node:assert/strict';

import { Matrix } from '../../../../product/source/src/core/index.js';
import { defaultDocument, findPageObject } from '../../../../product/source/src/document/index.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { PathRepaintMaterialController } from '../../../../product/source/src/editor/repaint-material.js';
import {
  ChatBoundedEditController,
  buildChatStateSummary,
  createChatBoundedEditAdapter
} from '../../../../product/source/src/editor/chat-bounded-edit.js';
import { createPath } from '../../../../product/source/src/vector/vector-core.js';

const clone = value => JSON.parse(JSON.stringify(value));

function makeApp() {
  const doc = defaultDocument();
  const layer = doc.pages[0].layers[0];
  layer.objects.push(createPath({
    id: 'path-a',
    fill: '#e6dfcf',
    stroke: '#403b37',
    strokeWidth: 2,
    subpaths: [{
      id: 'outer',
      closed: true,
      role: 'outer',
      anchors: [
        { id: 'a0', x: 0, y: 0 },
        { id: 'a1', x: 20, y: 0 },
        { id: 'a2', x: 20, y: 20 }
      ]
    }]
  }));
  const revisions = {
    current: 'revision-a',
    revisionIdFor(documentId) {
      return documentId === doc.id ? this.current : null;
    }
  };
  const app = {
    doc,
    revisions,
    selection: [],
    page() { return this.doc.pages[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    objectPath(found) { return found ? ['pages', 0, ...found.path] : null; },
    queueSpatialObject() {},
    refreshSelectionUI() {},
    renderer: { render() {} },
    markDirty() {},
    updateHistoryUI() {},
    replaceDocument(next) { this.doc = next; },
    translateSelection(dx, dy, label = 'Move') {
      const selected = this.selectedObjects();
      const targets = selected.map(found => this.objectPath(found));
      const transform = Matrix.translate(dx, dy);
      this.history.pushScoped(label, targets, () => {
        for (const found of selected) {
          const object = this.findObject({ layerId: found.layer.id, objectId: found.object.id }).object;
          object.matrix = Matrix.multiply(transform, object.matrix);
        }
      });
    }
  };
  app.history = new HistoryManager(app);
  app.pathRepaintMaterial = new PathRepaintMaterialController(app);
  return app;
}

function targetRef(app) {
  const found = findPageObject(app.page(), 'path-a');
  return { pageId: app.page().id, layerId: found.layer.id, objectId: 'path-a' };
}

function repaintTask(app, id = 'chat-revision') {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId: id,
    operation: 'path.repaint.v1',
    targets: [targetRef(app)],
    arguments: { fill: '#b63c36' }
  };
}

test('CHAT state summary exposes stable Revision binding', () => {
  const app = makeApp();
  const summary = buildChatStateSummary(app);
  assert.equal(summary.revision.revisionId, 'revision-a');
  assert.match(summary.revision.documentFingerprint, /^fnv1a32:/);
});

test('CHAT proposal captures Revision precondition and stale Revision rejects before mutation', () => {
  const app = makeApp();
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const before = clone(app.doc);
  const proposal = adapter.propose(repaintTask(app, 'stale-revision')).result;
  assert.equal(proposal.revisionId, 'revision-a');
  assert.equal(proposal.expected.revisionId, 'revision-a');

  const approved = adapter.approve(proposal.proposalId).result;
  app.revisions.current = 'revision-b';
  const result = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(result.ok, false);
  assert.equal(result.code, 'CHAT_EDIT_STALE_REVISION');
  assert.equal(result.expected, 'revision-a');
  assert.equal(result.actual, 'revision-b');
  assert.deepEqual(app.doc, before);
  assert.equal(app.history.undoStack.length, 0);
});

test('CHAT result records inspected/current Revision identities after approved edit', () => {
  const app = makeApp();
  const adapter = createChatBoundedEditAdapter(new ChatBoundedEditController(app));
  const proposal = adapter.propose(repaintTask(app, 'revision-result')).result;
  const approved = adapter.approve(proposal.proposalId).result;
  const result = adapter.execute(proposal.proposalId, approved.approvalToken);

  assert.equal(result.ok, true);
  assert.equal(result.result.revision.inspectedRevisionId, 'revision-a');
  assert.equal(result.result.revision.currentRevisionId, 'revision-a');
  assert.match(result.result.revision.documentFingerprint, /^fnv1a32:/);
  assert.equal(findPageObject(app.page(), 'path-a').object.fill, '#b63c36');
  assert.equal(app.history.undoStack.length, 1);
});
