import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { FORMAT_VERSION } from '../product/source/src/config.js';
import {
  INK_CAPABILITY_DESCRIPTOR_SCHEMA,
  INK_CAPABILITY_DESCRIPTOR_VERSION,
  INK_CAPABILITY_INPUT_SCHEMA_KEYWORDS,
  INK_CAPABILITY_TARGET_TYPES,
  createInkPublicCreativeApi,
  getInkCapabilityDescriptors,
  getInkCapabilitySummaries,
  getInkNamedToolDefinitions,
  resolveInkCapabilityDescriptor
} from '../product/source/src/agent/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const CONNECTOR_002_TOOLS = [
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
  'release_ink_output'
];

const REQUIRED_DESCRIPTOR_FIELDS = [
  'schema', 'version', 'id', 'title', 'description',
  'availability', 'availabilityReason', 'routingClass', 'namedTool',
  'publicMethod', 'role', 'inputSchema', 'targetTypes', 'constraints',
  'approvalPolicy', 'historyPolicy', 'revisionPolicy', 'previewPolicy',
  'resultContract', 'examples'
];

const REQUIRED_CAPABILITIES = [
  'document.context',
  'document.selection',
  'document.inspect',
  'reference.decompose',
  'path.repaint.v1',
  'path.material.apply.v1',
  'path.material.remove.v1',
  'object.translate.v1',
  'path.simplify.v1',
  'path.refine.v1',
  'history.undo',
  'history.redo',
  'revision.capture',
  'revision.restore',
  'preview.capture',
  'asset.inspect',
  'asset.release',
  'composition.programmable',
  'external.transport'
];

function resolvePath(rootValue, dotted) {
  return String(dotted || '').split('.').reduce((value, key) => value?.[key], rootValue);
}

function assertSchemaKeywords(schema, allowed, at = 'inputSchema') {
  assert.ok(schema && typeof schema === 'object' && !Array.isArray(schema), at + ' must be an object');
  for (const key of Object.keys(schema)) {
    assert.ok(allowed.has(key), `unsupported schema keyword ${key} at ${at}`);
  }
  if (schema.properties) {
    for (const [key, child] of Object.entries(schema.properties)) assertSchemaKeywords(child, allowed, at + '.properties.' + key);
  }
  if (schema.items) assertSchemaKeywords(schema.items, allowed, at + '.items');
  for (const required of schema.required || []) {
    assert.ok(schema.properties && Object.hasOwn(schema.properties, required), `required field ${required} missing properties entry at ${at}`);
  }
}

function matchesType(value, declared) {
  if (declared === 'object') return value !== null && typeof value === 'object' && !Array.isArray(value);
  if (declared === 'array') return Array.isArray(value);
  if (declared === 'string') return typeof value === 'string';
  if (declared === 'boolean') return typeof value === 'boolean';
  if (declared === 'number') return typeof value === 'number' && Number.isFinite(value);
  if (declared === 'integer') return Number.isInteger(value);
  return true;
}

function assertExample(schema, value, at = 'example') {
  if (schema.type) assert.ok(matchesType(value, schema.type), `${at} expected ${schema.type}`);
  if (Object.hasOwn(schema, 'const')) assert.deepEqual(value, schema.const, at + ' const mismatch');
  if (schema.enum) assert.ok(schema.enum.some(item => Object.is(item, value)), at + ' enum mismatch');
  if (typeof value === 'number') {
    if (schema.minimum != null) assert.ok(value >= schema.minimum, at + ' below minimum');
    if (schema.maximum != null) assert.ok(value <= schema.maximum, at + ' above maximum');
  }
  if (Array.isArray(value)) {
    if (schema.minItems != null) assert.ok(value.length >= schema.minItems, at + ' minItems');
    if (schema.maxItems != null) assert.ok(value.length <= schema.maxItems, at + ' maxItems');
    if (schema.items) value.forEach((item, index) => assertExample(schema.items, item, at + '[' + index + ']'));
  }
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    for (const required of schema.required || []) assert.ok(Object.hasOwn(value, required), `${at} missing ${required}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) assertExample(schema.properties[key], item, at + '.' + key);
      else if (schema.additionalProperties === false) assert.fail(`${at} unexpected property ${key}`);
    }
  }
}

test('Connector-003 appends describe_ink_capability as tool 18 and preserves the exact Connector-002 prefix', () => {
  const tools = getInkNamedToolDefinitions();
  assert.deepEqual(tools.slice(0, 17).map(item => item.name), CONNECTOR_002_TOOLS);
  assert.equal(tools[17].name, 'describe_ink_capability');
  assert.equal(tools.length, 18);
  assert.equal(new Set(tools.map(item => item.name)).size, 18);
  assert.equal(new Set(tools.map(item => item.publicMethod)).size, 18);
});

test('Capability registry is deterministic, unique, JSON-safe, and complete for required coverage', () => {
  const first = getInkCapabilityDescriptors();
  const second = getInkCapabilityDescriptors();
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.doesNotThrow(() => JSON.stringify(first));
  assert.equal(new Set(first.map(item => item.id)).size, first.length);

  const ids = new Set(first.map(item => item.id));
  for (const id of REQUIRED_CAPABILITIES) assert.ok(ids.has(id), 'missing capability ' + id);

  for (const descriptor of first) {
    for (const field of REQUIRED_DESCRIPTOR_FIELDS) assert.ok(Object.hasOwn(descriptor, field), `${descriptor.id} missing ${field}`);
    assert.equal(descriptor.schema, INK_CAPABILITY_DESCRIPTOR_SCHEMA);
    assert.equal(descriptor.version, INK_CAPABILITY_DESCRIPTOR_VERSION);
    assert.equal(typeof descriptor.availability, 'boolean');
    assert.ok(Array.isArray(descriptor.targetTypes));
    assert.ok(Array.isArray(descriptor.constraints));
    assert.ok(Array.isArray(descriptor.examples));
    assert.equal(typeof descriptor.approvalPolicy.required, 'boolean');
    assert.equal(typeof descriptor.approvalPolicy.mode, 'string');
    assert.equal(typeof descriptor.historyPolicy.mode, 'string');
    assert.equal(typeof descriptor.revisionPolicy.mode, 'string');
    assert.equal(typeof descriptor.previewPolicy.recommended, 'boolean');
    assert.equal(typeof descriptor.previewPolicy.required, 'boolean');
    assert.equal(typeof descriptor.previewPolicy.reason, 'string');
    assert.equal(descriptor.resultContract.resultEnvelope, 'INK_AGENT_RESULT');
    assert.equal(descriptor.resultContract.resultEnvelopeVersion, 1);
    assert.ok(Array.isArray(descriptor.resultContract.possibleStatuses));
    assert.equal(typeof descriptor.resultContract.createsRefs, 'boolean');
    assert.equal(typeof descriptor.resultContract.changesRefs, 'boolean');
    assert.equal(typeof descriptor.resultContract.returnsOutputHandles, 'boolean');
    if (descriptor.availability) assert.ok(descriptor.examples.length >= 1, descriptor.id + ' requires an example');
  }
});

test('Input schemas use only the bounded keyword subset and available examples satisfy the declared bounded shape', () => {
  const allowed = new Set(INK_CAPABILITY_INPUT_SCHEMA_KEYWORDS);
  for (const descriptor of getInkCapabilityDescriptors()) {
    assertSchemaKeywords(descriptor.inputSchema, allowed, descriptor.id + '.inputSchema');
    if (!descriptor.availability) continue;
    for (const [index, example] of descriptor.examples.entries()) {
      assertExample(descriptor.inputSchema, example, descriptor.id + '.examples[' + index + ']');
    }
  }
});

test('Target types stay inside the accepted INK vocabulary', () => {
  const vocabulary = new Set(INK_CAPABILITY_TARGET_TYPES);
  for (const descriptor of getInkCapabilityDescriptors()) {
    for (const target of descriptor.targetTypes) assert.ok(vocabulary.has(target), `${descriptor.id} invalid target ${target}`);
  }
});

test('Named-tool and Public API mappings are consistent with the canonical registry', () => {
  const api = createInkPublicCreativeApi({});
  const tools = api.tools.registry();
  for (const tool of tools) {
    const descriptor = resolveInkCapabilityDescriptor(tool.name);
    assert.ok(descriptor, 'missing named-tool descriptor ' + tool.name);
    assert.equal(descriptor.id, tool.capabilityId);
    assert.equal(descriptor.namedTool, tool.name);
    assert.equal(descriptor.publicMethod, tool.publicMethod);
    assert.equal(typeof resolvePath(api, tool.publicMethod), 'function', 'missing Public API method ' + tool.publicMethod);
  }
});

test('capabilities() returns deterministic summaries, not full input schemas', () => {
  const api = createInkPublicCreativeApi({});
  const first = api.capabilities();
  const second = api.capabilities();
  assert.equal(first.status, 'COMPLETED');
  assert.equal(JSON.stringify(first), JSON.stringify(second));
  assert.deepEqual(first.result.capabilities, getInkCapabilitySummaries());
  assert.deepEqual(first.result.namedTools, getInkNamedToolDefinitions());
  assert.ok(first.result.capabilities.every(item => !Object.hasOwn(item, 'inputSchema')));
  assert.ok(first.result.capabilities.every(item => item.descriptorVersion === 1));
});

test('capability.describe resolves canonical id and registered named tool to the same Descriptor v1', () => {
  const api = createInkPublicCreativeApi({});
  const byId = api.capability.describe('preview.capture');
  const byTool = api.capability.describe('get_ink_preview');
  const byNamedToolInvocation = api.tools.invoke('describe_ink_capability', { idOrToolName: 'get_ink_preview' });

  assert.equal(byId.status, 'COMPLETED');
  assert.equal(byTool.status, 'COMPLETED');
  assert.equal(byNamedToolInvocation.status, 'COMPLETED');
  assert.deepEqual(byId.result, byTool.result);
  assert.deepEqual(byId.result, byNamedToolInvocation.result);
  assert.equal(byId.result.schema, INK_CAPABILITY_DESCRIPTOR_SCHEMA);
  assert.equal(byId.result.version, 1);
});

test('unknown capability/tool returns deterministic FAILED diagnostic', () => {
  const api = createInkPublicCreativeApi({});
  const first = api.capability.describe('missing.capability');
  const second = api.tools.invoke('describe_ink_capability', { idOrToolName: 'missing.capability' });
  for (const result of [first, second]) {
    assert.equal(result.status, 'FAILED');
    assert.equal(result.action, 'capability.describe');
    assert.equal(result.diagnostics[0].code, 'INK_CAPABILITY_NOT_FOUND');
    assert.equal(result.diagnostics[0].details.field, 'idOrToolName');
    assert.equal(result.diagnostics[0].details.actual, 'missing.capability');
  }
});

test('policy/result metadata keeps proposal approval, Preview semantics, History/Revision authority, and unavailable futures explicit', () => {
  const repaint = resolveInkCapabilityDescriptor('path.repaint.v1');
  assert.equal(repaint.namedTool, 'propose_ink_edit');
  assert.equal(repaint.approvalPolicy.required, true);
  assert.match(repaint.approvalPolicy.mode, /APPROVAL/);
  assert.equal(repaint.historyPolicy.mode, 'AUTHORITATIVE_COMMIT_ON_EXECUTE_ONLY');
  assert.equal(repaint.revisionPolicy.mode, 'NO_AUTO_CAPTURE');

  const preview = resolveInkCapabilityDescriptor('preview.capture');
  assert.equal(preview.resultContract.outputHandleSchema, 'INK_OUTPUT_HANDLE / 1');
  assert.equal(preview.resultContract.returnsOutputHandles, true);
  assert.ok(preview.constraints.some(item => /semantic bindings only/i.test(item)));

  assert.equal(resolveInkCapabilityDescriptor('history.undo').historyPolicy.mode, 'MOVE_EXISTING_STACK');
  assert.equal(resolveInkCapabilityDescriptor('revision.capture').revisionPolicy.mode, 'EXPLICIT_CAPTURE');
  assert.equal(resolveInkCapabilityDescriptor('revision.restore').revisionPolicy.mode, 'EXPLICIT_RESTORE');

  for (const id of ['composition.programmable', 'external.transport']) {
    const item = resolveInkCapabilityDescriptor(id);
    assert.equal(item.availability, false);
    assert.equal(typeof item.availabilityReason, 'string');
    assert.ok(item.availabilityReason.length > 0);
  }
});

test('Connector-003 source boundary adds discovery metadata only and preserves FORMAT_VERSION 4', async () => {
  const [registrySource, apiSource, configSource] = await Promise.all([
    readFile(path.join(root, 'product/source/src/agent/capability-registry.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/agent/public-creative-api.js'), 'utf8'),
    readFile(path.join(root, 'product/source/src/config.js'), 'utf8')
  ]);

  assert.equal(FORMAT_VERSION, 4);
  assert.match(configSource, /FORMAT_VERSION\s*=\s*4/);
  assert.doesNotMatch(registrySource + '\n' + apiSource, /\beval\s*\(|\bFunction\s*\(|\buse_ink\b|WebSocket|postMessage|createObjectURL/i);
  assert.doesNotMatch(apiSource, /app\.doc\s*=/);
  assert.doesNotMatch(registrySource, /new\s+HistoryManager|new\s+RevisionController|new\s+Renderer/);
  assert.match(apiSource, /resolveInkCapabilityDescriptor/);
  assert.match(apiSource, /describe_ink_capability/);
});
