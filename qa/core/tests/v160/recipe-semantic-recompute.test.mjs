import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createRecipeAsset, applyRecipeAsset, compareRecipeAssets, checkRecipeDependencies } from '../../src/recipe/recipe-asset.js';
import { openRecipe, packageRecipe, saveRecipe } from '../../src/recipe/recipe-io.js';
import { migrateRecipeAsset } from '../../src/recipe/recipe-migration.js';
import { validateRecipeAsset } from '../../src/recipe/recipe-validator.js';
import { defaultDocument } from '../../src/document/model.js';
import { migrateDocument } from '../../src/document/migration.js';
import { createAnchor, createPath } from '../../src/vector/vector-core.js';
import { resolveSemanticTargets } from '../../src/semantic/semantic-resolver.js';
import { validateSemanticDocument } from '../../src/semantic/semantic-validator.js';
import { analyzeLocalRecompute } from '../../src/recompute/local-recompute.js';
import { buildDependencyGraph } from '../../src/recompute/dependency-graph.js';

const makePath = (id, semanticLabel) => createPath({ id, name: id, fill: '#668844', subpaths: [{ role: 'outer', closed: true, anchors: [createAnchor(0, 0), createAnchor(20, 0), createAnchor(10, 20)] }], metadata: { semanticLabel } });
const run = promisify(execFile);
const flowerDocument = () => { const document = defaultDocument(), objects = document.pages[0].layers[0].objects; objects.push(makePath('petal-outer-1', 'petal'), makePath('flower-center', 'flower-center'), makePath('stem', 'stem'), makePath('leaf-left', 'leaf'), makePath('leaf-right', 'leaf')); return migrateDocument(document); };

test('Recipe asset supports validation, migration, save/open, apply, compare, package, and dependency refusal', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-v160-recipe-'));
  try {
    const executableRecipe = { format: 'INK-AI-RECIPE', version: '1.6.0', recipeId: 'recipe:portable', planId: 'plan:portable', seed: 1600, status: 'DRAFT', constraints: {}, rollbackStrategy: 'CHECKPOINT_AND_INVERSE_PATCH', steps: [{ stepId: 'create-one', enabled: true, operation: 'vector.createShape', target: null, parameters: { id: 'portable-shape', name: 'Portable Shape', semanticLabel: 'flower-center', cx: 100, cy: 100, width: 40, height: 40, fill: '#ddaa44' } }] };
    const recipe = createRecipeAsset({ recipeId: 'recipe-portable', title: 'Portable Recipe', dependencies: [{ assetId: 'required-brush', optional: false }], capabilities: { operations: ['vector.createShape'] }, rollbackPolicy: { strategy: 'CHECKPOINT_AND_INVERSE_PATCH' }, testStatus: { status: 'PASS' }, executableRecipe });
    assert.equal(validateRecipeAsset(recipe).valid, true);
    const file = path.join(temp, 'portable.inkrecipe.json'); await saveRecipe(file, recipe); assert.equal((await openRecipe(file)).recipe.recipeId, recipe.recipeId);
    const migrated = migrateRecipeAsset(executableRecipe); assert.equal(migrated.report.status, 'MIGRATED'); assert.equal(validateRecipeAsset(migrated.recipe).valid, true);
    const awaiting = applyRecipeAsset(recipe, defaultDocument()); assert.equal(awaiting.status, 'AWAITING_APPROVAL');
    const applied = applyRecipeAsset(recipe, defaultDocument(), { approved: true }); assert.equal(applied.status, 'COMPLETED'); assert.ok(applied.document.pages[0].layers[0].objects.some(object => object.id === 'portable-shape'));
    const changed = structuredClone(recipe); changed.editableParameters.color = { value: '#aa1122' }; assert.equal(Object.keys(compareRecipeAssets(recipe, changed).parameterDifference).length, 1);
    assert.equal(checkRecipeDependencies(recipe, { assets: [] }).passed, false);
    const archive = await packageRecipe(path.join(temp, 'portable.inkrecipe.zip'), recipe); assert.ok(archive.bytes > 100); assert.equal((await readFile(archive.path)).subarray(0, 2).toString(), 'PK');
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('Semantic Relationship Model resolves outer petals, center, left/right leaves, parent scope and exclusions', () => {
  const document = flowerDocument(), validation = validateSemanticDocument(document); assert.equal(validation.passed, true);
  assert.deepEqual(resolveSemanticTargets(document, '只修改外圈花瓣').targets, ['petal-outer-1']);
  assert.deepEqual(resolveSemanticTargets(document, '只修改花心').targets, ['flower-center']);
  assert.deepEqual(resolveSemanticTargets(document, '左葉').targets, ['leaf-left']);
  assert.deepEqual(resolveSemanticTargets(document, '右葉').targets, ['leaf-right']);
  const flower = resolveSemanticTargets(document, '整朵花但不包含莖與葉，保留花心'); assert.deepEqual(flower.targets, ['petal-outer-1']);
  assert.equal(document.semanticModel.relationshipGraph.edges.some(edge => edge.type === 'attachedTo'), true);
});

test('Local Recompute preserves unaffected IDs and hashes, detects over-recompute, missing dependencies, and full regeneration', () => {
  const before = flowerDocument(), after = structuredClone(before), left = after.pages[0].layers[0].objects.find(object => object.id === 'leaf-left'); left.fill = '#114422';
  const report = analyzeLocalRecompute(before, after, { targets: ['leaf-left'], parsedIntent: { operations: [{ operation: 'recolor' }] } });
  assert.equal(report.status, 'LOCAL_RECOMPUTE_COMPLETED'); assert.deepEqual(report.changedObjectIds, ['leaf-left']); assert.ok(report.preservedObjectIds.includes('stem'));
  const over = structuredClone(after); over.pages[0].layers[0].objects.find(object => object.id === 'stem').fill = '#000000'; const rejected = analyzeLocalRecompute(before, over, { targets: ['leaf-left'], parsedIntent: { operations: [{ operation: 'recolor' }] } }); assert.equal(rejected.overRecomputeDetected, true); assert.ok(rejected.overRecomputed.includes('stem'));
  const count = analyzeLocalRecompute(before, after, { targets: ['petal-outer-1'], parsedIntent: { operations: [{ operation: 'adjust-count' }] } }); assert.equal(count.status, 'FULL_REGENERATION_REQUIRED');
  const missing = flowerDocument(); missing.pages[0].layers[0].objects.find(object => object.id === 'leaf-left').semantic.dependencyIds = ['missing-object']; assert.equal(buildDependencyGraph(missing).missingDependencies.length, 1);
});

test('ink-recipe CLI validates, inspects, migrates, compares and packages through the formal asset layer', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-v160-recipe-cli-'));
  try {
    const legacy = { format: 'INK-AI-RECIPE', version: '1.5.1', recipeId: 'recipe:legacy-cli', planId: 'plan:legacy-cli', steps: [{ stepId: 'inspect', enabled: true, operation: 'document.inspect', target: null, parameters: {} }] };
    const legacyFile = path.join(temp, 'legacy.json'); await saveRecipe(path.join(temp, 'formal.inkrecipe.json'), createRecipeAsset({ recipeId: 'recipe-formal-cli', title: 'CLI', capabilities: {}, rollbackPolicy: {}, testStatus: {}, executableRecipe: legacy }));
    await import('node:fs/promises').then(({ writeFile }) => writeFile(legacyFile, `${JSON.stringify(legacy)}\n`));
    const script = path.resolve('scripts/ink-recipe.mjs'), formal = path.join(temp, 'formal.inkrecipe.json'), migrated = path.join(temp, 'migrated.inkrecipe.json'), archive = path.join(temp, 'migrated.inkrecipe.zip');
    assert.match((await run(process.execPath, [script, 'validate', '--input', formal])).stdout, /"valid": true/);
    assert.match((await run(process.execPath, [script, 'inspect', '--input', formal])).stdout, /recipe-formal-cli/);
    await run(process.execPath, [script, 'migrate', '--input', legacyFile, '--output', migrated]);
    await run(process.execPath, [script, 'compare', '--before', formal, '--after', migrated]);
    await run(process.execPath, [script, 'package', '--input', migrated, '--output', archive]); assert.equal((await readFile(archive)).subarray(0, 2).toString(), 'PK');
  } finally { await rm(temp, { recursive: true, force: true }); }
});
