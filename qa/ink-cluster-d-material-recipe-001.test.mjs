import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CHAT_EDIT_OPERATIONS,
  CHAT_MATERIAL_OPERATIONS,
  CHAT_RECIPE_OPERATIONS
} from '../product/source/src/editor/chat-bounded-edit.js';
import {
  getInkCapabilityDescriptors,
  getInkNamedToolDefinitions,
  resolveInkCapabilityDescriptor
} from '../product/source/src/agent/capability-registry.js';

test('Cluster D exposes only bounded native Material and one Studio Recipe execution route', () => {
  assert.deepEqual(CHAT_MATERIAL_OPERATIONS, ['material.template.create.v1', 'material.instance.create.v1']);
  assert.deepEqual(CHAT_RECIPE_OPERATIONS, ['recipe.studio.execute.v1']);
  for (const id of [...CHAT_MATERIAL_OPERATIONS, ...CHAT_RECIPE_OPERATIONS]) assert.ok(CHAT_EDIT_OPERATIONS.includes(id));

  const descriptors = getInkCapabilityDescriptors();
  for (const id of ['material.template.create.v1', 'material.instance.create.v1', 'recipe.inventory', 'recipe.studio.execute.v1']) {
    assert.ok(descriptors.some(item => item.id === id), 'missing capability '+id);
  }

  const inventory = resolveInkCapabilityDescriptor('recipe.inventory');
  assert.equal(inventory.role, 'READ');
  assert.equal(inventory.namedTool, 'get_ink_recipe_inventory');
  assert.match(inventory.authoritativeRoute, /app\.studio\.engine\.list\/describe/);
  assert.ok(inventory.constraints.some(text => /Workflow IR/.test(text)));
  assert.ok(inventory.constraints.some(text => /Read-only/.test(text)));

  const execute = resolveInkCapabilityDescriptor('recipe.studio.execute.v1');
  assert.equal(execute.role, 'WRITE');
  assert.match(execute.constraints.join('\n'), /existing Studio RecipeEngine/);
  assert.match(execute.constraints.join('\n'), /Inline recipe definitions are prohibited/);

  const createTemplate = resolveInkCapabilityDescriptor('material.template.create.v1');
  assert.match(createTemplate.constraints.join('\n'), /existing Document materialLibrary/);
  assert.match(createTemplate.constraints.join('\n'), /arbitrary executable expressions\/tokens are rejected/);

  const toolNames = getInkNamedToolDefinitions().map(item => item.name);
  assert.ok(toolNames.includes('get_ink_recipe_inventory'));
  assert.equal(toolNames.filter(name => name === 'get_ink_recipe_inventory').length, 1);
});
