import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

test('CLI creates a Plan file without HTML UI', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ink-cli-test-'));
  try {
    const prompt = path.join(root, 'prompt.txt'), output = path.join(root, 'plan.json'); await writeFile(prompt, '畫一朵正面的粉紅色花，白底，兩片綠葉，置中，簡單乾淨。');
    const result = spawnSync(process.execPath, ['scripts/ink-cli.mjs', 'plan', '--prompt', prompt, '--output', output, '--runtime-root', path.join(root, 'runtime')], { cwd: path.resolve('.'), encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr); const plan = JSON.parse(await readFile(output, 'utf8')); assert.equal(plan.status, 'READY'); assert.ok(plan.recipeDraft);
  } finally { await rm(root, { recursive: true, force: true }); }
});

test('CLI Preview Approval Execute Export chain uses the shared Headless core', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'ink-cli-chain-'));
  try {
    const prompt = path.join(root, 'prompt.txt'), plan = path.join(root, 'plan.json'), preview = path.join(root, 'preview'), approval = path.join(root, 'approval.json'), execution = path.join(root, 'execution'), exported = path.join(root, 'export');
    await writeFile(prompt, '畫一朵正面的粉紅色花，白底，兩片綠葉，置中，簡單乾淨。');
    const run = args => spawnSync(process.execPath, ['scripts/ink-cli.mjs', ...args, '--runtime-root', path.join(root, 'runtime')], { cwd: path.resolve('.'), encoding: 'utf8' });
    let result = run(['plan', '--prompt', prompt, '--output', plan]); assert.equal(result.status, 0, result.stderr);
    result = run(['preview', '--plan', plan, '--output', preview]); assert.equal(result.status, 0, result.stderr);
    result = run(['approve', '--preview', path.join(preview, 'preview.json'), '--decision', 'approve', '--output', approval]); assert.equal(result.status, 0, result.stderr);
    result = run(['execute', '--plan', plan, '--approval', approval, '--output', execution]); assert.equal(result.status, 0, result.stderr);
    result = run(['export', '--document', path.join(execution, 'document_after.ink'), '--format', 'png,svg', '--output', exported]); assert.equal(result.status, 0, result.stderr);
    const executionReport = JSON.parse(await readFile(path.join(execution, 'execution.json'), 'utf8')), exportReport = JSON.parse(await readFile(path.join(exported, 'export_report.json'), 'utf8'));
    assert.equal(executionReport.status, 'COMPLETED'); assert.equal(executionReport.objectIds.length, 14); assert.ok(exportReport.files.png.bytes > 5000); assert.ok(exportReport.files.svg.bytes > 1000);
  } finally { await rm(root, { recursive: true, force: true }); }
});
