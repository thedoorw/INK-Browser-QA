#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { applyRecipeAsset, checkRecipeDependencies, compareRecipeAssets, inspectRecipeAsset } from '../src/recipe/recipe-asset.js';
import { exportRecipe, importRecipe, packageRecipe, saveRecipe } from '../src/recipe/recipe-io.js';
import { migrateRecipeAsset } from '../src/recipe/recipe-migration.js';
import { validateRecipeAsset } from '../src/recipe/recipe-validator.js';

function args(values) { const result = { _: [] }; for (let index = 0; index < values.length; index += 1) { const value = values[index]; if (!value.startsWith('--')) result._.push(value); else { const key = value.slice(2), next = values[index + 1]; result[key] = next && !next.startsWith('--') ? values[++index] : true; } } return result; }
const argv = args(process.argv.slice(2)), command = argv._.shift(), input = argv.input || argv.recipe || argv._[0];
const json = file => readFile(path.resolve(file), 'utf8').then(JSON.parse);
const emit = async result => { if (argv.output && command !== 'package' && command !== 'migrate' && !String(argv.output).endsWith('.inkrecipe') && !String(argv.output).endsWith('.inkrecipe.json')) await writeFile(path.resolve(argv.output), `${JSON.stringify(result, null, 2)}\n`); process.stdout.write(`${JSON.stringify(result, null, 2)}\n`); };

try {
  if (!command) throw Object.assign(new Error('Recipe command required'), { code: 'CLI_ARGUMENT_REQUIRED' });
  let result;
  if (command === 'validate') { const { recipe, report } = await importRecipe(input); result = { ...validateRecipeAsset(recipe), migration: report }; }
  else if (command === 'inspect') { const { recipe, report } = await importRecipe(input); result = { ...inspectRecipeAsset(recipe), migration: report }; }
  else if (command === 'migrate') { const migrated = migrateRecipeAsset(await json(input)); if (!argv.output) throw Object.assign(new Error('--output is required'), { code: 'CLI_ARGUMENT_REQUIRED' }); await saveRecipe(argv.output, migrated.recipe); result = migrated.report; }
  else if (command === 'apply') { const { recipe } = await importRecipe(input); const document = await json(argv.document); result = applyRecipeAsset(recipe, document, { approved: argv.approved === true || argv.approved === 'true' }); if (argv.output && result.status === 'COMPLETED') await writeFile(path.resolve(argv.output), `${JSON.stringify(result.document, null, 2)}\n`); }
  else if (command === 'compare') { const before = (await importRecipe(argv.before || input)).recipe, after = (await importRecipe(argv.after || argv._[1])).recipe; result = compareRecipeAssets(before, after); }
  else if (command === 'package') { const { recipe } = await importRecipe(input); if (!argv.output) throw Object.assign(new Error('--output is required'), { code: 'CLI_ARGUMENT_REQUIRED' }); result = await packageRecipe(argv.output, recipe); }
  else if (command === 'dependencies') { const { recipe } = await importRecipe(input); result = checkRecipeDependencies(recipe, argv.assets ? await json(argv.assets) : null); }
  else if (command === 'export') { const { recipe } = await importRecipe(input); result = await exportRecipe(argv.output, recipe); }
  else throw Object.assign(new Error(`Unknown Recipe command: ${command}`), { code: 'CLI_COMMAND_UNKNOWN' });
  await emit(result); if (result.valid === false || result.passed === false || result.status === 'AWAITING_APPROVAL') process.exitCode = 1;
} catch (error) { process.stderr.write(`${JSON.stringify({ status: 'FAILED', error: { code: error.code || 'RECIPE_COMMAND_FAILED', message: error.message, details: error.details || {} } }, null, 2)}\n`); process.exitCode = 2; }
