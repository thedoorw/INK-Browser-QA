#!/usr/bin/env node
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';
import { createInkHeadlessRuntime } from '../src/headless/headless-runtime.js';
import { writeJSON } from '../src/headless/result-packager.js';

function parseArgs(values) {
  const result = { _: [] };
  for (let index = 0; index < values.length; index++) {
    const value = values[index];
    if (!value.startsWith('--')) result._.push(value);
    else { const key = value.slice(2), next = values[index + 1]; result[key] = next && !next.startsWith('--') ? values[++index] : true; }
  }
  return result;
}

const script = path.basename(process.argv[1]).replace(/\.mjs$/, ''), argv = parseArgs(process.argv.slice(2));
const command = script === 'ink-cli' ? argv._.shift() : script.replace(/^ink-/, '');
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'), runtimeRoot = path.resolve(argv['runtime-root'] || '.ink-headless');
const runtime = await createInkHeadlessRuntime({ root: runtimeRoot, projectRoot });
const needed = (name, value) => { if (!value) throw Object.assign(new Error(`Missing --${name}`), { code: 'CLI_ARGUMENT_REQUIRED' }); return value; };

try {
  let result;
  if (command === 'plan') {
    result = await runtime.plan({ sessionId: argv.session || null, document: argv.document || null, prompt: needed('prompt', argv.prompt), output: needed('output', argv.output), seed: Number(argv.seed || 15101), target: argv.target || null, allowedScope: argv.scope || null });
  } else if (command === 'preview') {
    result = await runtime.preview({ sessionId: argv.session || null, document: argv.document || null, plan: needed('plan', argv.plan), output: needed('output', argv.output) });
  } else if (command === 'approve') {
    const selectedSteps = argv.steps ? String(argv.steps).split(',') : null;
    result = await runtime.approve({ sessionId: argv.session || null, preview: needed('preview', argv.preview), decision: argv.decision || 'approve', selectedSteps, parameters: argv.parameters ? JSON.parse(argv.parameters) : null, output: needed('output', argv.output) });
  } else if (command === 'execute') {
    result = await runtime.execute({ sessionId: argv.session || null, document: argv.document || null, plan: needed('plan', argv.plan), approval: needed('approval', argv.approval), output: needed('output', argv.output) });
  } else if (command === 'export') {
    result = await runtime.export({ sessionId: argv.session || null, document: argv.document || null, formats: String(argv.format || 'png,svg').split(','), output: needed('output', argv.output), basename: argv.basename || 'output', background: argv.background || 'white', range: argv.range || 'artboard', width: argv.width ? Number(argv.width) : null, height: argv.height ? Number(argv.height) : null, ppi: Number(argv.ppi || 96) });
  } else if (command === 'modify') {
    result = await runtime.modify({ sessionId: needed('session', argv.session), prompt: needed('prompt', argv.prompt), output: needed('output', argv.output), seed: Number(argv.seed || 15101) });
  } else if (command === 'rollback') {
    result = await runtime.rollback({ sessionId: needed('session', argv.session), executionId: argv.execution || null, output: needed('output', argv.output) });
  } else throw Object.assign(new Error(`Unknown INK command: ${command || '(none)'}`), { code: 'CLI_COMMAND_UNKNOWN' });
  process.stdout.write(`${JSON.stringify({ status: result.status || 'PASS', command, result }, null, 2)}\n`);
  if (['UNSUPPORTED', 'USER_CHOICE_REQUIRED', 'FULL_REGENERATION_REQUIRED'].includes(result.status)) process.exitCode = 1;
} catch (error) {
  const failure = { status: 'FAILED', command, error: { code: error.code || 'CLI_FAILED', message: error.message, details: error.details || {} } };
  if (argv.output && String(argv.output).endsWith('.json')) await writeJSON(path.resolve(argv.output), failure).catch(() => {});
  process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`); process.exitCode = 2;
} finally { await runtime.close(); }
