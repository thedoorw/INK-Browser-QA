import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { Matrix } from '../product/source/src/core/index.js';
import { createFrame, defaultDocument, findPageObject } from '../product/source/src/document/index.js';
import { HistoryManager } from '../product/source/src/history/index.js';
import {
  CHAT_EDIT_OPERATIONS,
  ChatBoundedEditController,
  createChatBoundedEditAdapter
} from '../product/source/src/editor/chat-bounded-edit.js';
import { createAnchor, createPath } from '../product/source/src/vector/vector-core.js';
import { resolveInkCapabilityDescriptor } from '../product/source/src/agent/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const C2B_TOTAL = [
  'path.repaint.v1',
  'path.material.apply.v1',
  'path.material.remove.v1',
  'object.translate.v1',
  'path.simplify.v1',
  'path.refine.v1',
  'path.create.v1',
  'path.edit.v1',
  'object.rotate.v1',
  'object.clone.v1',
  'repeat.radial.v1',
  'boolean.apply.v1',
  'group.create.v1',
  'object.reparent.v1',
  'frame.create.v1',
  'text.create.v1',
  'text.edit.v1',
  'svg.import.v1',
  'object.resize.v1',
  'object.scale.v1',
  'object.order.v1',
  'repeat.mirror.v1',
  'repeat.grid.v1',
  'layout.frame.set.v1',
  'layout.frame.remove.v1',
  'layout.item.set.v1',
  'layout.item.remove.v1'
];

const C2C = [
  'component.register.v1',
  'component.instance.create.v1',
  'component.override.set.v1',
  'component.override.reset.v1',
  'component.instance.detach.v1',
  'component.definition.duplicate.v1',
  'component.reference.repair.v1'
];

function makeApp() {
  const doc = defaultDocument();
  const page = doc.pages[0];
  const layer = page.layers[0];
  doc.id = 'c2c-doc';
  page.id = 'page-1';
  doc.activePageId = page.id;
  layer.id = 'layer-1';
  page.activeLayerId = layer.id;
  layer.objects = [];

  const sourceChild = createPath({
    id: 'component-source-child',
    name: 'Source Child',
    subpaths: [{
      role: 'outer',
      closed: true,
      anchors: [
        createAnchor(0, 0),
        createAnchor(40, 0),
        createAnchor(40, 30),
        createAnchor(0, 30)
      ]
    }],
    fill: '#ddd',
    stroke: '#222',
    strokeWidth: 1
  });
  const sourceFrame = createFrame({
    id: 'component-source-root',
    name: 'Source Root',
    matrix: Matrix.translate(20, 20),
    width: 120,
    height: 90,
    children: [sourceChild]
  });
  sourceChild.parentId = sourceFrame.id;
  layer.objects.push(sourceFrame);

  const app = {
    doc,
    selection: [],
    spatialDirty: false,
    page() { return this.doc.pages[0]; },
    layer() { return this.page().layers.find(item => item.id === this.page().activeLayerId) || this.page().layers[0]; },
    pagePath(p = this.page()) {
      const index = this.doc.pages.indexOf(p);
      return index < 0 ? null : ['pages', index];
    },
    layerPath(l = this.layer(), p = this.page()) {
      const base = this.pagePath(p);
      const index = p.layers.indexOf(l);
      return !base || index < 0 ? null : [...base, 'layers', index];
    },
    layerObjectsPath(l = this.layer(), p = this.page()) {
      const base = this.layerPath(l, p);
      return base ? [...base, 'objects'] : null;
    },
    objectPath(found) {
      const base = this.pagePath();
      return !found || !base ? null : [...base, ...found.path];
    },
    findObject(ref) { return findPageObject(this.page(), ref); },
    selectedObjects() { return this.selection.map(ref => this.findObject(ref)).filter(Boolean); },
    queueSpatialObject() {},
    refreshAll() {},
    refreshSelectionUI() {},
    markDirty() {},
    updateHistoryUI() {},
    renderer: { render() {} },
    revisions: { revisionIdFor() { return null; } }
  };
  app.history = new HistoryManager(app);
  app.chatBoundedEdit = new ChatBoundedEditController(app);
  app.chatBoundedEditAdapter = createChatBoundedEditAdapter(app.chatBoundedEdit);
  return app;
}

function task(id, operation, targets, args) {
  return {
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId: id,
    operation,
    targets,
    arguments: args
  };
}

function ref(app, objectId) {
  const found = findPageObject(app.page(), objectId);
  assert.ok(found, objectId);
  return { pageId: app.page().id, layerId: found.layer.id, objectId };
}

function run(app, raw) {
  const beforeProposal = JSON.stringify(app.doc);
  const proposed = app.chatBoundedEditAdapter.propose(raw);
  assert.equal(proposed.ok, true, JSON.stringify(proposed));
  assert.equal(JSON.stringify(app.doc), beforeProposal);
  const before = app.history.undoStack.length;
  const approved = app.chatBoundedEditAdapter.approve(proposed.result.proposalId);
  assert.equal(approved.ok, true, JSON.stringify(approved));
  const executed = app.chatBoundedEditAdapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, true, JSON.stringify(executed));
  assert.equal(app.history.undoStack.length, before + 1);
  return executed.result;
}

test('C2-C preserves exact C2-B prefix and appends seven component operations for total 34', () => {
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(0, C2B_TOTAL.length), C2B_TOTAL);
  assert.deepEqual(CHAT_EDIT_OPERATIONS.slice(C2B_TOTAL.length), C2C);
  assert.equal(CHAT_EDIT_OPERATIONS.length, 34);
  assert.equal(FORMAT_VERSION, 4);
  for (const operation of C2C) {
    const descriptor = resolveInkCapabilityDescriptor(operation);
    assert.equal(descriptor?.availability, true, operation);
    assert.ok(descriptor?.inputSchema, operation);
  }
});

test('Component Definition/Instance/Override/Duplicate/Repair/Detach all route through native transactions', () => {
  const app = makeApp();
  const sourceRef = ref(app, 'component-source-root');

  let result = run(app, task('register', 'component.register.v1', [sourceRef], {
    name: 'QA Component'
  }));
  const definitionId = result.controllerResult.definitionId;
  assert.ok(definitionId);
  assert.equal(app.doc.components.definitions.length, 1);
  assert.equal(app.doc.components.definitions[0].sourceRootId, 'component-source-root');

  result = run(app, task('instance-create', 'component.instance.create.v1', [], {
    definitionId,
    pageId: app.page().id,
    layerId: app.layer().id,
    matrix: [1, 0, 0, 1, 220, 80]
  }));
  const instanceRef = result.targets[0].ref;
  let instance = findPageObject(app.page(), instanceRef.objectId).object;
  assert.equal(instance.type, 'component-instance');
  assert.equal(instance.definitionId, definitionId);

  run(app, task('override-set', 'component.override.set.v1', [instanceRef], {
    sourceNodeId: 'component-source-child',
    opacity: 0.4
  }));
  instance = findPageObject(app.page(), instanceRef.objectId).object;
  assert.equal(instance.overrides['component-source-child'].opacity, 0.4);

  run(app, task('override-reset', 'component.override.reset.v1', [instanceRef], {
    sourceNodeId: 'component-source-child'
  }));
  instance = findPageObject(app.page(), instanceRef.objectId).object;
  assert.equal(Object.hasOwn(instance.overrides, 'component-source-child'), false);

  result = run(app, task('definition-duplicate', 'component.definition.duplicate.v1', [], {
    definitionId,
    name: 'QA Component Copy'
  }));
  const duplicateDefinitionId = result.controllerResult.definitionId;
  const duplicateSourceRootId = result.controllerResult.sourceRootId;
  assert.ok(duplicateDefinitionId);
  assert.notEqual(duplicateDefinitionId, definitionId);
  assert.ok(findPageObject(app.page(), duplicateSourceRootId));

  run(app, task('reference-repair', 'component.reference.repair.v1', [instanceRef], {
    definitionId: duplicateDefinitionId
  }));
  instance = findPageObject(app.page(), instanceRef.objectId).object;
  assert.equal(instance.definitionId, duplicateDefinitionId);

  result = run(app, task('detach', 'component.instance.detach.v1', [instanceRef], {}));
  const detachedRef = result.targets[0].ref;
  assert.notEqual(detachedRef.objectId, instanceRef.objectId);
  assert.equal(findPageObject(app.page(), instanceRef.objectId), null);
  const detached = findPageObject(app.page(), detachedRef.objectId).object;
  assert.notEqual(detached.type, 'component-instance');
  assert.equal(app.history.undoStack.length, 7);
});

test('zero-target component mutations remain proposal-neutral and active-page placement is bounded', () => {
  const app = makeApp();

  let proposed = app.chatBoundedEditAdapter.propose(task('create-invalid-page', 'component.instance.create.v1', [], {
    definitionId: 'unknown-definition',
    pageId: 'other-page',
    layerId: app.layer().id
  }));
  assert.equal(proposed.ok, true);
  const approved = app.chatBoundedEditAdapter.approve(proposed.result.proposalId);
  const executed = app.chatBoundedEditAdapter.execute(proposed.result.proposalId, approved.result.approvalToken);
  assert.equal(executed.ok, false);
  assert.equal(executed.code, 'CHAT_EDIT_ACTIVE_PAGE_REQUIRED');

  proposed = app.chatBoundedEditAdapter.propose(task('duplicate-missing', 'component.definition.duplicate.v1', [], {
    definitionId: 'missing-definition'
  }));
  assert.equal(proposed.ok, true);
  assert.equal(app.doc.components?.definitions?.length || 0, 0);
});

test('C2-C source boundary keeps components.js frozen and exposes opacity override only', async () => {
  const [boundedSource, registrySource, componentsSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/editor/chat-bounded-edit.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/capability-registry.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/document/components.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);

  for (const nativeName of [
    'registerComponentDefinition',
    'createComponentInstance',
    'setComponentOverride',
    'detachComponentInstance',
    'duplicateComponentDefinition',
    'repairComponentReference'
  ]) {
    assert.match(boundedSource, new RegExp(nativeName));
    assert.match(componentsSource, new RegExp('export function ' + nativeName));
  }

  assert.match(registrySource, /component\.override\.set\.v1/);
  assert.match(registrySource, /opacity/);
  assert.doesNotMatch(registrySource, /component\.variant|variables\.token|component\.override\.fill|component\.override\.stroke/i);

  const c2cSource = [boundedSource, registrySource].join('\n');
  assert.doesNotMatch(c2cSource, /\beval\s*\(|new\s+Function\s*\(|\bFunction\s*\(|WebSocket|XMLHttpRequest|sendBeacon/i);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
  assert.equal(FORMAT_VERSION, 4);
});

console.log('INK-TECH-CLOSURE-001 C2-C focused QA: PASS');
