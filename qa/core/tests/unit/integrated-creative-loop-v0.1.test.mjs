import test from 'node:test';
import assert from 'node:assert/strict';

import { FORMAT_VERSION } from '../../../../product/source/src/config.js';
import {
  InkStore,
  RevisionController,
  createFrame,
  defaultDocument,
  documentFingerprint,
  findPageObject,
  inspectDocument,
  inspectInkFileEnvelope,
  migrateDocument,
  reparentPageObject,
  unwrapInkFile,
  wrapInkFile
} from '../../../../product/source/src/document/index.js';
import {
  ChatBoundedEditController,
  createChatBoundedEditAdapter
} from '../../../../product/source/src/editor/chat-bounded-edit.js';
import {
  cloneCompositionObject,
  inspectComposition,
  pathIdentityRecord
} from '../../../../product/source/src/editor/composition.js';
import { PathStrokeAppearanceController } from '../../../../product/source/src/editor/expressive-stroke.js';
import { PathEditController } from '../../../../product/source/src/editor/path-edit.js';
import { PathRepaintMaterialController } from '../../../../product/source/src/editor/repaint-material.js';
import { executeExtraction } from '../../../../product/source/src/extraction/core.js';
import { HistoryManager } from '../../../../product/source/src/history/index.js';
import { normalizeExpressiveStroke, pathGeometryFingerprint } from '../../../../product/source/src/vector/stroke-appearance.js';

const clone = value => JSON.parse(JSON.stringify(value));
const FIXED_TIME = '2026-09-20T12:00:00.000Z';

function rasterFixture() {
  return { width: 32, height: 32, data: new Uint8ClampedArray(32 * 32 * 4).fill(255) };
}

function contourAdapter(offset = 0) {
  return {
    id: `integrated-contours-${offset}`,
    version: '1',
    extract: () => ({
      contours: [
        { parent: -1, points: [[2 + offset, 2], [22 + offset, 2], [22 + offset, 22], [2 + offset, 22]] },
        { parent: 0, points: [[8 + offset, 8], [16 + offset, 8], [16 + offset, 16], [8 + offset, 16]] }
      ]
    })
  };
}

async function extractedPath(name, shaChar, offset = 0) {
  const result = await executeExtraction({
    raster: rasterFixture(),
    source: { name, sha256: shaChar.repeat(64) }
  }, contourAdapter(offset));
  assert.equal(result.paths.length, 1);
  return result.paths[0];
}

function fixedDocument() {
  const doc = defaultDocument();
  doc.id = 'doc-integrated-loop';
  doc.title = 'Integrated Creative Loop Fixture';
  doc.createdAt = FIXED_TIME;
  doc.modifiedAt = FIXED_TIME;
  doc.activePageId = 'page-integrated';
  doc.pages[0].id = 'page-integrated';
  doc.pages[0].name = 'Integrated Page';
  doc.pages[0].activeLayerId = 'layer-integrated';
  doc.pages[0].layers[0].id = 'layer-integrated';
  doc.pages[0].layers[0].name = 'Integrated Layer';
  return doc;
}

function makeApp(doc = fixedDocument(), store = new InkStore()) {
  const app = {
    doc,
    store,
    selection: [],
    draft: null,
    strokeEdit: null,
    dirty: false,
    spatialDirty: false,
    page() { return this.doc.pages.find(page => page.id === this.doc.activePageId) || this.doc.pages[0]; },
    layer() { return this.page().layers.find(layer => layer.id === this.page().activeLayerId) || this.page().layers[0]; },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    objectPath(found) { return found ? ['pages', this.doc.pages.indexOf(this.page()), ...found.path] : null; },
    replaceDocument(raw, { fromHistory = false, skipSanitize = false } = {}) {
      this.doc = skipSanitize ? clone(raw) : migrateDocument(raw);
      this.selection = [];
      this.draft = null;
      this.strokeEdit = null;
      this.spatialDirty = true;
      if (!fromHistory) {
        this.history?.clear();
        this.dirty = false;
      }
    },
    markDirty() { this.dirty = true; },
    updateHistoryUI() {},
    refreshAll() {},
    refreshSelectionUI() {},
    queueSpatialObject() {},
    renderer: { render() {} }
  };
  app.history = new HistoryManager(app);
  app.pathRepaintMaterial = new PathRepaintMaterialController(app);
  app.revisions = new RevisionController(app, { store });
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  app.chatBoundedEditAdapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  return app;
}

function refFor(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  assert.ok(found);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function localRefFor(app, objectId) {
  const ref = refFor(app, objectId);
  return { layerId: ref.layerId, objectId: ref.objectId };
}

function chatRepaintTask(app, objectId, taskId, fill) {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId,
    operation: 'path.repaint.v1',
    targets: [refFor(app, objectId)],
    arguments: { fill }
  };
}

function assertPathContract(path, expected) {
  assert.equal(path.id, expected.identity.objectId);
  assert.deepEqual(pathIdentityRecord(path), expected.identity);
  assert.deepEqual(path.metadata.extraction, expected.provenance);
  assert.equal(path.type, 'path');
  assert.ok(path.subpaths.length > 0);
  assert.ok(path.subpaths.every(subpath => subpath.anchors.length >= 3));
}

async function buildIntegratedLoop() {
  const first = await extractedPath('fixture-a.rgba', 'a');
  const second = await extractedPath('fixture-b.rgba', 'b', 3);
  const deterministicFirst = await extractedPath('fixture-a.rgba', 'a');
  assert.deepEqual(deterministicFirst, first);

  const app = makeApp();
  app.layer().objects.push(first);
  app.selection = [localRefFor(app, first.id)];
  const firstContract = {
    identity: pathIdentityRecord(first),
    provenance: clone(first.metadata.extraction)
  };

  const extractionEnvelope = wrapInkFile(app.doc, { savedAt: FIXED_TIME });
  assert.equal(inspectInkFileEnvelope(extractionEnvelope).valid, true);

  const pathEditor = new PathEditController(app);
  pathEditor.enter(localRefFor(app, first.id));
  const geometryBeforeEdit = pathGeometryFingerprint(first);
  pathEditor.selectAnchor(0, 1);
  pathEditor.moveSelectedAnchors(4, -2);
  pathEditor.exit();
  assert.notEqual(pathGeometryFingerprint(findPageObject(app.page(), first.id).object), geometryBeforeEdit);

  const strokeController = new PathStrokeAppearanceController(app);
  const geometryAfterEdit = pathGeometryFingerprint(findPageObject(app.page(), first.id).object);
  strokeController.assign(normalizeExpressiveStroke({
    color: '#6e354e',
    baseWidth: 7,
    opacity: 0.8,
    profile: { taperStart: 0.2, taperEnd: 0.35 },
    media: { engine: 'ink', flow: 0.82, grain: 0.18, seed: 13 }
  }), { ref: localRefFor(app, first.id) });
  assert.equal(pathGeometryFingerprint(findPageObject(app.page(), first.id).object), geometryAfterEdit);

  let idSequence = 0;
  const duplicate = cloneCompositionObject(first, { idFactory: () => `integrated-copy-${++idSequence}` });
  const primaryFrame = createFrame({
    id: 'frame-integrated-primary',
    name: 'Primary composition',
    width: 180,
    height: 180
  });
  app.history.push('Compose extracted Paths', () => {
    app.layer().objects.push(second, duplicate, primaryFrame);
    for (const path of [first, second, duplicate]) {
      reparentPageObject(app.page(), path.id, primaryFrame.id, { targetLayerId: app.layer().id });
    }
  });
  const composition = inspectComposition(app.page());
  assert.equal(composition.pathCount, 3);
  assert.equal(composition.valid, true);
  assert.equal(composition.sourceIdentityCount, 2);

  const refs = [first.id, second.id, duplicate.id].map(id => localRefFor(app, id));
  app.pathRepaintMaterial.repaint({ fill: '#d6a45f', stroke: '#5b3041', opacity: 0.9 }, { refs });
  app.pathRepaintMaterial.applyMaterial({
    templateId: 'integrated-paper-wash',
    templateVersion: '1',
    parameterOverrides: { grain: 0.25 },
    fallback: { fill: '#d6a45f', stroke: '#5b3041' }
  }, { refs });
  assert.equal(pathGeometryFingerprint(findPageObject(app.page(), first.id).object), geometryAfterEdit);

  const beforeChat = await app.revisions.capture({
    createdAt: '2026-09-20T12:01:00.000Z',
    reason: 'integrated-before-chat',
    label: 'Before CHAT'
  });
  assert.equal(beforeChat.created, true);

  const structuralProposal = app.chatBoundedEdit.propose(
    chatRepaintTask(app, duplicate.id, 'stale-after-reparent', '#a85e48')
  );
  const structuralApproval = app.chatBoundedEdit.approve(structuralProposal.proposalId);
  const alternateFrame = createFrame({
    id: 'frame-integrated-alternate',
    name: 'Alternate composition',
    width: 120,
    height: 120
  });
  app.history.push('Reparent composed Path', () => {
    app.layer().objects.push(alternateFrame);
    reparentPageObject(app.page(), duplicate.id, alternateFrame.id, { targetLayerId: app.layer().id });
  });
  const staleStructuralExecution = app.chatBoundedEditAdapter.execute(
    structuralProposal.proposalId,
    structuralApproval.approvalToken
  );
  assert.equal(staleStructuralExecution.ok, false);
  assert.equal(staleStructuralExecution.code, 'CHAT_EDIT_TARGET_STALE');

  const staleProposal = app.chatBoundedEdit.propose(chatRepaintTask(app, first.id, 'stale-after-revision', '#bc6d45'));
  const staleApproval = app.chatBoundedEdit.approve(staleProposal.proposalId);

  const editAfterComposition = new PathEditController(app);
  editAfterComposition.enter(localRefFor(app, first.id));
  editAfterComposition.selectAnchor(0, 2);
  editAfterComposition.moveSelectedAnchors(-3, 5);
  editAfterComposition.exit();

  const afterGeometry = await app.revisions.capture({
    createdAt: '2026-09-20T12:02:00.000Z',
    reason: 'integrated-geometry',
    label: 'Geometry after composition'
  });
  assert.equal(afterGeometry.created, true);
  const staleExecution = app.chatBoundedEditAdapter.execute(staleProposal.proposalId, staleApproval.approvalToken);
  assert.equal(staleExecution.ok, false);
  assert.equal(staleExecution.code, 'CHAT_EDIT_STALE_REVISION');

  const chatProposal = app.chatBoundedEdit.propose(chatRepaintTask(app, first.id, 'integrated-chat-repaint', '#b84d55'));
  const chatApproval = app.chatBoundedEdit.approve(chatProposal.proposalId);
  const chatResult = app.chatBoundedEdit.execute(chatProposal.proposalId, chatApproval.approvalToken);
  assert.equal(chatResult.ok, true);
  assert.equal(chatResult.changed, true);
  assert.equal(chatResult.revision.inspectedRevisionId, afterGeometry.record.revisionId);

  const afterChat = await app.revisions.capture({
    createdAt: '2026-09-20T12:03:00.000Z',
    reason: 'integrated-after-chat',
    label: 'After CHAT'
  });
  assert.equal(afterChat.created, true);
  assert.ok(afterChat.comparison.changedObjectIds.includes(first.id));

  return {
    app,
    firstId: first.id,
    secondId: second.id,
    duplicateId: duplicate.id,
    firstContract,
    extractionEnvelope,
    beforeChat,
    afterGeometry,
    afterChat,
    hierarchy: Object.fromEntries([first.id, second.id, duplicate.id].map(id => {
      const found = findPageObject(app.page(), id);
      return [id, found.parentObject?.id || null];
    })),
    fingerprint: documentFingerprint(app.doc)
  };
}

test('deterministic fixture traverses Extract → Path → Edit → Stroke → Compose → Repaint → CHAT → Revision', async () => {
  const firstRun = await buildIntegratedLoop();
  const secondRun = await buildIntegratedLoop();

  assert.equal(firstRun.fingerprint, secondRun.fingerprint);
  assert.equal(firstRun.afterChat.record.revisionId, secondRun.afterChat.record.revisionId);
  assert.equal(FORMAT_VERSION, 4);
  assert.equal(firstRun.app.doc.formatVersion, 4);

  const first = findPageObject(firstRun.app.page(), firstRun.firstId).object;
  assertPathContract(first, firstRun.firstContract);
  assert.ok(first.expressiveStroke);
  assert.ok(first.materialAppearance);
  assert.equal(first.fill, '#b84d55');
});

test('cross-stage invariants survive Revision restore and History resumes from an explicit boundary', async () => {
  const state = await buildIntegratedLoop();
  const { app } = state;
  const snapshotPath = findPageObject(state.afterChat.record.envelope.document.pages[0], state.firstId).object;
  const snapshotGeometry = pathGeometryFingerprint(snapshotPath);
  const snapshotAppearance = clone({
    fill: snapshotPath.fill,
    expressiveStroke: snapshotPath.expressiveStroke,
    materialAppearance: snapshotPath.materialAppearance
  });
  assert.ok(app.history.undoStack.length > 0);

  const laterEdit = new PathEditController(app);
  laterEdit.enter(localRefFor(app, state.firstId));
  laterEdit.selectAnchor(0, 0);
  laterEdit.moveSelectedAnchors(9, 1);
  laterEdit.exit();
  assert.notEqual(pathGeometryFingerprint(findPageObject(app.page(), state.firstId).object), snapshotGeometry);

  const restored = await app.revisions.restore(state.afterChat.record);
  assert.equal(restored.historyBoundary, 'RESET_TO_REVISION');
  assert.equal(app.history.undoStack.length, 0);
  assert.equal(app.history.redoStack.length, 0);

  const path = findPageObject(app.page(), state.firstId).object;
  assertPathContract(path, state.firstContract);
  assert.equal(pathGeometryFingerprint(path), snapshotGeometry);
  assert.deepEqual({
    fill: path.fill,
    expressiveStroke: path.expressiveStroke,
    materialAppearance: path.materialAppearance
  }, snapshotAppearance);
  assert.equal(inspectComposition(app.page()).valid, true);
  for (const [objectId, parentId] of Object.entries(state.hierarchy)) {
    assert.equal(findPageObject(app.page(), objectId).parentObject?.id || null, parentId);
  }

  const postRestoreEditor = new PathEditController(app);
  postRestoreEditor.enter(localRefFor(app, state.firstId));
  postRestoreEditor.selectAnchor(0, 0);
  postRestoreEditor.moveSelectedAnchors(2, 2);
  postRestoreEditor.exit();
  assert.equal(app.history.undoStack.length, 1);
  assert.equal(app.history.undo(), true);
  assert.equal(pathGeometryFingerprint(findPageObject(app.page(), state.firstId).object), snapshotGeometry);
  assert.equal(app.history.redo(), true);
  assert.notEqual(pathGeometryFingerprint(findPageObject(app.page(), state.firstId).object), snapshotGeometry);
});

test('file-envelope and browser-local storage close at extraction, after CHAT, and after Revision restore', async () => {
  const state = await buildIntegratedLoop();
  const { app } = state;

  const extractionLoaded = migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(state.extractionEnvelope))));
  assert.equal(inspectDocument(extractionLoaded).passed, true);
  const extractionPath = findPageObject(extractionLoaded.pages[0], state.firstId).object;
  assertPathContract(extractionPath, state.firstContract);

  const afterChatEnvelope = wrapInkFile(app.doc, {
    revision: 3,
    revisionId: state.afterChat.record.revisionId,
    savedAt: '2026-09-20T12:04:00.000Z'
  });
  assert.equal(inspectInkFileEnvelope(afterChatEnvelope).valid, true);
  await app.store.save('integrated:after-chat', afterChatEnvelope);
  const stored = await app.store.loadWithRecovery(
    'integrated:after-chat',
    value => inspectInkFileEnvelope(value).valid
  );
  assert.equal(stored.verified, true);
  const loadedAfterChat = migrateDocument(unwrapInkFile(stored.value));
  assert.equal(documentFingerprint(loadedAfterChat), documentFingerprint(migrateDocument(app.doc)));
  assertPathContract(findPageObject(loadedAfterChat.pages[0], state.firstId).object, state.firstContract);

  const mutateAfterSave = new PathEditController(app);
  mutateAfterSave.enter(localRefFor(app, state.firstId));
  mutateAfterSave.selectAnchor(0, 0);
  mutateAfterSave.moveSelectedAnchors(6, 0);
  mutateAfterSave.exit();
  await app.revisions.restore(state.afterChat.record);

  const restoredEnvelope = wrapInkFile(app.doc, {
    revision: 4,
    revisionId: state.afterChat.record.revisionId,
    savedAt: '2026-09-20T12:05:00.000Z'
  });
  const restoredLoaded = migrateDocument(unwrapInkFile(JSON.parse(JSON.stringify(restoredEnvelope))));
  assert.equal(inspectInkFileEnvelope(restoredEnvelope).valid, true);
  assert.equal(inspectDocument(restoredLoaded).passed, true);
  assertPathContract(findPageObject(restoredLoaded.pages[0], state.firstId).object, state.firstContract);
  assert.equal(inspectComposition(restoredLoaded.pages[0]).valid, true);
  assert.equal(restoredLoaded.formatVersion, 4);
});
