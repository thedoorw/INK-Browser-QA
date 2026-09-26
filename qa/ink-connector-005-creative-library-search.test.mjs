import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import { createFrame, defaultDocument } from '../product/source/src/document/index.js';
import { CHAT_EDIT_OPERATIONS } from '../product/source/src/editor/chat-bounded-edit.js';
import {
  createInkPublicCreativeApi,
  getInkNamedToolDefinitions,
  resolveInkCapabilityDescriptor
} from '../product/source/src/agent/index.js';
import {
  INK_CREATIVE_LIBRARY_REF_SCHEMA,
  INK_CREATIVE_LIBRARY_TYPES,
  INK_CREATIVE_LIBRARY_REUSE
} from '../product/source/src/agent/creative-library-search.js';
import { createAnchor, createPath, createRepeat } from '../product/source/src/vector/vector-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const clone = value => JSON.parse(JSON.stringify(value));

const ACCEPTED_21_TOOL_PREFIX = [
  'get_ink_capabilities',
  'get_ink_context',
  'get_ink_selection',
  'inspect_ink_objects',
  'decompose_ink_reference',
  'propose_ink_edit',
  'approve_ink_edit',
  'execute_ink_edit',
  'get_ink_history',
  'undo_ink',
  'redo_ink',
  'get_ink_revisions',
  'capture_ink_revision',
  'restore_ink_revision',
  'get_ink_preview',
  'inspect_ink_output',
  'release_ink_output',
  'describe_ink_capability',
  'use_ink',
  'import_ink_reference',
  'export_ink_asset'
];

function pathFixture(id, name = id) {
  return createPath({
    id,
    name,
    fill: '#d7889b',
    stroke: '#55343d',
    strokeWidth: 1,
    subpaths: [{
      id: id + ':outer',
      role: 'outer',
      closed: true,
      anchors: [
        createAnchor(0, 0),
        createAnchor(32, 0),
        createAnchor(32, 42),
        createAnchor(0, 42)
      ]
    }]
  });
}

function makeApp() {
  const doc = defaultDocument();
  doc.id = 'doc:connector-005';
  doc.title = 'Creative Library fixture';
  doc.modifiedAt = '2026-09-26T00:00:00.000Z';
  const page = doc.pages[0];
  page.id = 'page:library';
  page.name = 'Library Page';
  doc.activePageId = page.id;
  const layer = page.layers[0];
  layer.id = 'layer:library';
  layer.name = 'Library Layer';
  page.activeLayerId = layer.id;

  const componentPath = pathFixture('component-child', 'Component child');
  const componentFrame = createFrame({
    id: 'component-source-root',
    name: 'Petal Emblem Source',
    width: 120,
    height: 120,
    children: [componentPath]
  });
  componentPath.parentId = componentFrame.id;

  const repeatSource = pathFixture('repeat-source', 'Repeat source');
  const repeat = createRepeat(repeatSource, {
    id: 'shared-library-id',
    name: 'Radial Petal Array',
    mode: 'radial',
    count: 8,
    center: { x: 60, y: 60 },
    sourceObjectId: repeatSource.id
  });

  const referenceDerived = pathFixture('reference-derived-path', 'Reference Petal Region');
  referenceDerived.metadata = {
    ...(referenceDerived.metadata || {}),
    source: { type: 'reference', id: 'sha-source', name: 'rose-window-primary.png' },
    decomposition: {
      schema: 'INK-REFERENCE-DECOMPOSITION/1',
      role: 'color-region',
      referenceObjectId: 'reference-image-1',
      sourceSha256: 'a'.repeat(64),
      batchId: 'decompose-batch-1',
      sourceChannel: 'CHAT_REFERENCE_DECOMPOSITION'
    }
  };

  layer.objects = [componentFrame, repeat, referenceDerived];

  doc.components = {
    schema: 'INK-COMPONENTS-1',
    definitions: [{
      id: 'shared-library-id',
      name: 'Petal Emblem',
      sourceRootId: componentFrame.id
    }]
  };

  doc.materialLibrary = {
    format: 'INK-MATERIAL-LIBRARY',
    version: '1.0',
    templates: [{
      templateId: 'material:flower:petal-pointed',
      templateVersion: '1.0.0',
      materialType: 'pointed-petal',
      semanticRole: 'petal',
      sourceBenchmark: { source: 'connector-005-fixture', benchmarkId: 'material-benchmark-1' },
      validationState: { status: 'VALIDATED', checkedBy: 'connector-005-fixture' }
    }]
  };

  page.floraRecipeState = {
    schemaVersion: '0.1',
    recipes: {
      'recipe:petal-glaze': {
        recipe: {
          recipeId: 'recipe:petal-glaze',
          schemaVersion: '0.2',
          operation: 'Transparent Glaze',
          targetRegionId: referenceDerived.id,
          palette: ['#d7889b', '#f0b7c1'],
          metadata: { label: 'Petal Transparent Glaze' }
        },
        compileHash: 'compile:petal-glaze',
        layerId: layer.id,
        actionIds: ['action:petal-glaze'],
        strokeIds: [],
        revision: 2,
        operation: 'Transparent Glaze',
        targetRegionId: referenceDerived.id
      }
    },
    actionToRecipe: {},
    strokeToRecipe: {}
  };

  const history = {
    undoStack: [],
    redoStack: [],
    pending: null,
    limit: 30,
    timeline() {
      return { entries: [], applied: 0, limit: 30 };
    }
  };
  let revisionId = 'revision:connector-005';
  const app = {
    doc,
    selection: [],
    history,
    page() { return doc.pages.find(item => item.id === doc.activePageId) || doc.pages[0]; },
    layer() { return this.page().layers.find(item => item.id === this.page().activeLayerId) || this.page().layers[0]; },
    revisions: {
      revisionIdFor() { return revisionId; },
      list() { return []; },
      diagnostics() { return { currentRevisionId: revisionId }; }
    }
  };
  return app;
}

function stateSnapshot(app) {
  return JSON.stringify({
    document: app.doc,
    modifiedAt: app.doc.modifiedAt,
    history: {
      undo: app.history.undoStack.length,
      redo: app.history.redoStack.length,
      pending: Boolean(app.history.pending)
    },
    revision: app.revisions.revisionIdFor(app.doc.id),
    selection: app.selection
  });
}

function byType(result) {
  return new Map(result.result.results.map(item => [item.type, item]));
}

test('Connector-005 appends search_ink_library after the accepted 21-tool prefix', () => {
  const tools = getInkNamedToolDefinitions();
  assert.equal(tools.length, 22);
  assert.deepEqual(tools.slice(0, 21).map(item => item.name), ACCEPTED_21_TOOL_PREFIX);
  assert.equal(tools[21].name, 'search_ink_library');
  assert.equal(tools[21].publicMethod, 'library.query');
  assert.equal(tools[21].role, 'READ');

  const descriptor = resolveInkCapabilityDescriptor('search_ink_library');
  assert.equal(descriptor.id, 'library.search');
  assert.equal(descriptor.availability, true);
  assert.equal(descriptor.routingClass, 'NAMED_TOOL');
  assert.equal(descriptor.namedTool, 'search_ink_library');
  assert.equal(descriptor.publicMethod, 'library.query');
});

test('search returns all five existing families with deterministic stable typed refs and bounded reuse metadata', () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const before = stateSnapshot(app);
  const first = api.tools.invoke('search_ink_library', { action: 'search', limit: 50 });
  const second = api.tools.invoke('search_ink_library', { action: 'search', limit: 50 });

  assert.equal(first.status, 'COMPLETED', JSON.stringify(first));
  assert.equal(stateSnapshot(app), before);
  assert.deepEqual(first.result, second.result);
  assert.deepEqual(first.result.types, INK_CREATIVE_LIBRARY_TYPES);
  assert.ok(first.result.results.length >= 5);

  const types = new Set(first.result.results.map(item => item.type));
  for (const type of INK_CREATIVE_LIBRARY_TYPES) assert.ok(types.has(type), type);

  const resultByType = byType(first);
  assert.deepEqual(resultByType.get('material').metadata.validationState, {
    status: 'VALIDATED',
    checkedBy: 'connector-005-fixture'
  });
  assert.deepEqual(resultByType.get('material').provenance.sourceBenchmark, {
    source: 'connector-005-fixture',
    benchmarkId: 'material-benchmark-1'
  });
  assert.equal(resultByType.get('recipe').label, 'Petal Transparent Glaze');
  assert.equal(resultByType.get('recipe').metadata.schemaVersion, '0.2');
  assert.deepEqual(resultByType.get('recipe').metadata.palette, ['#d7889b', '#f0b7c1']);
  assert.equal(resultByType.get('recipe').metadata.revision, 2);
  assert.equal(resultByType.get('recipe').provenance.compileHash, 'compile:petal-glaze');

  for (const item of first.result.results) {
    assert.equal(item.ref.schema, INK_CREATIVE_LIBRARY_REF_SCHEMA);
    assert.equal(item.ref.version, 1);
    assert.equal(item.ref.type, item.type);
    assert.equal(item.ref.scope.documentId, app.doc.id);
    assert.equal(typeof item.ref.id, 'string');
    assert.ok(item.ref.id);
    assert.equal(typeof item.ref.source, 'string');
    assert.ok(item.ref.source);
    assert.ok(Object.values(INK_CREATIVE_LIBRARY_REUSE).includes(item.reuse.classification));
  }

  const json = JSON.stringify(first.result);
  assert.doesNotMatch(json, /function\s*\(|=>|javascript:|<script/i);
});

test('search is type-disambiguated, query-normalized, empty-safe and limit-bounded', () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);

  const shared = api.tools.invoke('search_ink_library', {
    action: 'search',
    query: 'shared-library-id',
    limit: 50
  });
  assert.equal(shared.status, 'COMPLETED');
  assert.ok(shared.result.results.some(item => item.type === 'component' && item.ref.id === 'shared-library-id'));
  assert.ok(shared.result.results.some(item => item.type === 'parametric-structure' && item.ref.id === 'shared-library-id'));

  const material = api.tools.invoke('search_ink_library', {
    action: 'search',
    query: 'BENCHMARK-1',
    types: ['material']
  });
  assert.equal(material.status, 'COMPLETED');
  assert.ok(material.result.results.length >= 1);
  assert.ok(material.result.results.every(item => item.type === 'material'));

  const recipe = api.tools.invoke('search_ink_library', {
    action: 'search',
    query: 'transparent glaze',
    types: ['recipe']
  });
  assert.equal(recipe.status, 'COMPLETED');
  assert.equal(recipe.result.results[0].label, 'Petal Transparent Glaze');

  const empty = api.tools.invoke('search_ink_library', {
    action: 'search',
    query: 'definitely-not-in-library',
    types: ['component', 'recipe']
  });
  assert.equal(empty.status, 'COMPLETED');
  assert.deepEqual(empty.result.results, []);

  const limited = api.tools.invoke('search_ink_library', { action: 'search', limit: 2 });
  assert.equal(limited.status, 'COMPLETED');
  assert.equal(limited.result.results.length, 2);
  assert.ok(limited.result.totalMatched > limited.result.results.length);

  const clamped = api.tools.invoke('search_ink_library', { action: 'search', limit: 5000 });
  assert.equal(clamped.status, 'COMPLETED');
  assert.equal(clamped.result.limit, 50);
});

test('inspect resolves the exact stable ref and rejects stale refs without mutation', () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const searched = api.tools.invoke('search_ink_library', {
    action: 'search',
    types: ['component'],
    query: 'Petal Emblem'
  });
  const ref = searched.result.results[0].ref;
  const before = stateSnapshot(app);

  const inspected = api.tools.invoke('search_ink_library', { action: 'inspect', ref });
  assert.equal(inspected.status, 'COMPLETED');
  assert.equal(inspected.result.valid, true);
  assert.deepEqual(inspected.result.ref, ref);
  assert.equal(inspected.result.item.reuse.operation, 'component.instance.create.v1');
  assert.equal(stateSnapshot(app), before);

  const stale = clone(ref);
  stale.id = 'missing-component-definition';
  const failed = api.tools.invoke('search_ink_library', { action: 'inspect', ref: stale });
  assert.equal(failed.status, 'FAILED');
  assert.equal(failed.diagnostics[0].code, 'INK_CREATIVE_LIBRARY_REF_STALE');
  assert.equal(stateSnapshot(app), before);
});

test('reuse metadata reports only existing accepted authorities and never auto-executes', () => {
  const app = makeApp();
  const api = createInkPublicCreativeApi(app);
  const before = stateSnapshot(app);
  const result = api.tools.invoke('search_ink_library', { action: 'search', limit: 50 });
  const items = byType(result);

  assert.deepEqual(items.get('component').reuse, {
    classification: 'REUSE_AVAILABLE_EXISTING_AUTHORITY',
    authority: 'document/components.js:createComponentInstance',
    namedTool: 'propose_ink_edit',
    operation: 'component.instance.create.v1',
    arguments: { definitionId: 'shared-library-id' }
  });

  assert.equal(items.get('material').reuse.classification, 'REUSE_AVAILABLE_EXISTING_AUTHORITY');
  assert.equal(items.get('material').reuse.namedTool, 'propose_ink_edit');
  assert.equal(items.get('material').reuse.operation, 'path.material.apply.v1');

  assert.equal(items.get('recipe').reuse.classification, 'READ_ONLY_NO_ACCEPTED_MUTATION_ROUTE');
  assert.equal(items.get('parametric-structure').reuse.operation, 'object.clone.v1');
  assert.equal(items.get('reference-derived-structure').reuse.operation, 'object.clone.v1');

  assert.equal(stateSnapshot(app), before);
  assert.equal(app.history.undoStack.length, 0);
});

test('Connector-005 preserves operation and format baselines and contains no network/eval path', async () => {
  assert.equal(CHAT_EDIT_OPERATIONS.length, 34);
  assert.equal(FORMAT_VERSION, 4);

  const source = await readFile(path.join(root, 'product/source/src/agent/creative-library-search.js'), 'utf8');
  assert.doesNotMatch(source, /\beval\s*\(|\bFunction\s*\(|\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|navigator\.sendBeacon/);
  assert.doesNotMatch(source, /markDirty|history\.(?:push|begin|commit|cancel)|revisions\.(?:capture|restore)|replaceDocument|selection\s*=/);
  assert.match(source, /page\?\.floraRecipeState\?\.recipes/);
  assert.match(source, /\.map\(value => normalized\(value\)\)/);
  assert.match(source, /document\?\.materialLibrary\?\.templates/);
  assert.match(source, /document\?\.components\?\.definitions/);
  assert.match(source, /entry\.object\?\.type === 'repeat'/);
  assert.match(source, /metadata\.decomposition/);
  assert.match(source, /metadata\.extraction/);
});

console.log('INK-CONNECTOR-005 Creative Library Search focused QA: PASS');
