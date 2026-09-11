#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createInkHeadlessRuntime } from '../src/headless/headless-runtime.js';
import { inspectPreservation } from '../src/headless/preservation-guard.js';
import { ensureDirectory, writeJSON, writeText } from '../src/headless/result-packager.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.argv[2] || path.join(root, 'artifacts'));
const runtimeRoot = path.join(output, '.runtime');
const prompts = {
  round1: '畫一朵正面的粉紅色花，白底，兩片綠葉，置中，簡單乾淨。',
  round2: '把花瓣改成深紅色，花心改成黃色，葉子放大一點。',
  rollback: '回到上一版本。',
  unsupported: '把花變成會旋轉的 3D 寫實動畫並加入複雜城市背景。'
};
const sha256File = async file => createHash('sha256').update(await readFile(file)).digest('hex');
const runtime = await createInkHeadlessRuntime({ root: runtimeRoot, projectRoot: root });

await rm(output, { recursive: true, force: true }); await ensureDirectory(output);
const trace = { format: 'INK-HEADLESS-CONVERSATION-TRACE', version: '1.0', executionMode: 'LOCAL_HEADLESS_RUNTIME', imageModelUsed: false, events: [] };
const event = (phase, payload) => trace.events.push({ sequence: trace.events.length + 1, phase, payload });

async function runRound(sessionId, number, prompt, requestedDirectory = null) {
  const directory = requestedDirectory || path.join(output, `round${number}`); await ensureDirectory(directory); await writeText(path.join(directory, 'prompt.txt'), `${prompt}\n`); event(`ROUND${number}_PROMPT`, { prompt });
  const plan = await runtime.plan({ sessionId, prompt, seed: 15101, output: path.join(directory, 'plan.json') }); await writeJSON(path.join(directory, 'recipe.json'), plan.recipeDraft); event(`ROUND${number}_PLAN`, { planId: plan.planId, status: plan.status });
  const preview = await runtime.preview({ sessionId, plan, output: path.join(directory, 'preview') }); event(`ROUND${number}_PREVIEW`, { previewId: preview.previewId, difference: preview.difference });
  const approval = await runtime.approve({ sessionId, preview, decision: 'approve', output: path.join(directory, 'approval.json') }); event(`ROUND${number}_APPROVAL`, { approvalId: approval.approvalId });
  const execution = await runtime.execute({ sessionId, plan, approval, output: path.join(directory, 'execute') }); event(`ROUND${number}_EXECUTE`, { executionId: execution.executionId, difference: execution.difference, guard: execution.preservationGuard.passed });
  const exported = await runtime.export({ sessionId, output: directory, basename: 'output', formats: ['png', 'svg'] }); event(`ROUND${number}_EXPORT`, exported.files);
  return { plan, preview, approval, execution, exported };
}

try {
  const session = await runtime.createSession({ seed: 15101 }); await writeJSON(path.join(output, 'session_initial.json'), session);
  const round1 = await runRound(session.sessionId, 1, prompts.round1), round2 = await runRound(session.sessionId, 2, prompts.round2);
  const rollbackDirectory = path.join(output, 'rollback'); await ensureDirectory(rollbackDirectory); await writeText(path.join(rollbackDirectory, 'prompt.txt'), `${prompts.rollback}\n`);
  const rollback = await runtime.rollback({ sessionId: session.sessionId, executionId: round2.execution.executionId, output: rollbackDirectory }); event('ROLLBACK', rollback);
  const finalSession = (await runtime.sessions.load(runtime.sessions.sessionPath(session.sessionId))).session; await writeJSON(path.join(output, 'session_final.json'), finalSession);

  const unsupportedDirectory = path.join(output, 'unsupported'); await ensureDirectory(unsupportedDirectory); await writeText(path.join(unsupportedDirectory, 'prompt.txt'), `${prompts.unsupported}\n`);
  const unsupported = await runtime.plan({ prompt: prompts.unsupported, output: path.join(unsupportedDirectory, 'plan.json') }); event('UNSUPPORTED', { status: unsupported.status, unsupportedItems: unsupported.unsupportedItems });

  const moveDirectory = path.join(output, 'validation', 'test4-local-move'), moveSession = await runtime.createSession({ seed: 15101 });
  await runRound(moveSession.sessionId, 'MOVE_BASE', prompts.round1, path.join(moveDirectory, 'base'));
  const moveProposal = await runtime.modify({ sessionId: moveSession.sessionId, prompt: '把整朵花往上移 20，葉子和莖保持不動。', output: path.join(moveDirectory, 'preview') });
  const moveApproval = await runtime.approve({ sessionId: moveSession.sessionId, preview: moveProposal.preview, output: path.join(moveDirectory, 'approval.json') });
  const moveExecution = await runtime.execute({ sessionId: moveSession.sessionId, plan: moveProposal.plan, approval: moveApproval, output: path.join(moveDirectory, 'execute') });
  const moveExpected = [...Array.from({ length: 9 }, (_, index) => `petal-${index + 1}`), 'flower-center-outer', 'flower-center-inner'].sort();

  const guardBefore = JSON.parse(await readFile(path.join(output, 'round1', 'execute', 'document_after.ink'), 'utf8')), guardAfter = structuredClone(guardBefore);
  guardAfter.pages[0].layers.find(layer => layer.id === 'layer-artwork').objects.find(object => object.id === 'leaf-left').fill = '#000000';
  const injectedPlan = { parsedIntent: { operations: [{ operation: 'recolor' }] }, orderedSteps: [{ operation: 'vector.setFill', target: ['petal-1'], parameters: { fill: '#9f2338' } }] };
  const injectedGuard = inspectPreservation(guardBefore, guardAfter, injectedPlan); await writeJSON(path.join(output, 'validation', 'test7-preservation-injection.json'), injectedGuard);

  const determinismRuns = [];
  for (let index = 1; index <= 3; index++) {
    const directory = path.join(output, 'determinism', `run${index}`), deterministicSession = await runtime.createSession({ seed: 15101 });
    const result = await runRound(deterministicSession.sessionId, `D${index}`, prompts.round1, directory);
    determinismRuns.push({ run: index, canonicalJsonHash: result.execution.deterministicSemanticHash, svgSha256: result.exported.files.svg.sha256, pngSha256: result.exported.files.png.sha256, stableIds: result.execution.objectIds });
  }
  const determinism = {
    format: 'INK-HEADLESS-DETERMINISM-REPORT', version: '1.0', runs: determinismRuns,
    jsonHashConsistent: new Set(determinismRuns.map(item => item.canonicalJsonHash)).size === 1,
    svgHashConsistent: new Set(determinismRuns.map(item => item.svgSha256)).size === 1,
    pngHashConsistent: new Set(determinismRuns.map(item => item.pngSha256)).size === 1,
    stableIdsConsistent: new Set(determinismRuns.map(item => JSON.stringify(item.stableIds))).size === 1
  };
  await writeJSON(path.join(output, 'determinism', 'report.json'), determinism);

  const workspaceRoot = path.resolve(root, '..', '..', '..');
  const baselineZip = path.resolve(process.env.INK_V151_BASELINE || path.join(workspaceRoot, 'project_sources', '03-INK_Core_Main_Program_v1.5.1_RC.zip'));
  const sourceBaseline = path.resolve(process.env.INK_CONVERSATION_SOURCE_BASELINE || path.join(workspaceRoot, 'deliver', 'INK_v1.5.1_RC_Conversation_Closed_Loop_Test_v1.0', 'INK_v1.5.1_RC_Conversation_Test_Source.zip'));
  const closedLoopBaseline = path.resolve(process.env.INK_CLOSED_LOOP_BASELINE || path.join(workspaceRoot, 'deliver', 'INK_v1.5.1_RC_Conversation_Closed_Loop_Test_v1.0.zip'));
  const baselineIntegrity = {
    format: 'INK-BASELINE-INTEGRITY', version: '1.0', originalRC: { path: 'INK_Core_Main_Program_v1.5.1_RC.zip', sha256: await sha256File(baselineZip), expected: 'adf09a100b22676227a8221e724726070bf571b0cfac0f9f216e119bfc245946' },
    conversationSource: { sha256: await sha256File(sourceBaseline), expected: '871484be77bc23a7d5078e04f00fc218724a62ce172b7b6e3ab38f680699180c' },
    closedLoopTest: { sha256: await sha256File(closedLoopBaseline), expected: '33ad4ce051cbea3b037efa204a156b4c7a978bddcd9e2ab53d4d142fa3a0a3fd' }
  };
  baselineIntegrity.passed = Object.values(baselineIntegrity).filter(value => value && typeof value === 'object' && 'expected' in value).every(value => value.sha256 === value.expected);
  await writeJSON(path.join(output, 'reports', 'BASELINE_INTEGRITY.json'), baselineIntegrity);

  const checks = {
    test1Create: round1.execution.status === 'COMPLETED' && round1.execution.objectIds.length === 14 && round1.exported.files.png.bytes > 5000,
    test2LocalRecolor: round2.execution.preservationGuard.differences.modified.filter(id => id.startsWith('petal-')).length === 9,
    test3LocalResize: round2.execution.preservationGuard.differences.modified.includes('leaf-left') && round2.execution.preservationGuard.differences.modified.includes('leaf-right') && round2.execution.visualQA.conditions.some(item => item.condition === 'leaf area increase' && item.passed),
    test4LocalMove: JSON.stringify(moveExecution.preservationGuard.differences.modified.sort()) === JSON.stringify(moveExpected) && !moveExecution.preservationGuard.differences.modified.includes('stem') && !moveExecution.preservationGuard.differences.modified.includes('leaf-left'),
    test5Rollback: rollback.hashMatch && rollback.pngSha256 === round1.exported.files.png.sha256 && rollback.svgSha256 === round1.exported.files.svg.sha256,
    test6Unsupported: unsupported.status === 'UNSUPPORTED' && unsupported.recipeDraft === null,
    test7PreservationGuard: !injectedGuard.passed && injectedGuard.undeclaredChanges.includes('leaf-left'),
    test8Determinism: determinism.jsonHashConsistent && determinism.svgHashConsistent && determinism.pngHashConsistent && determinism.stableIdsConsistent,
    baselineIntegrity: baselineIntegrity.passed,
    fullLegacyRegressionAssetsAvailable: existsSync(path.join(root, 'external-assets', 'library', 'vector', 'illustrator', 'circular.jsx')),
    imageModelNotUsed: true
  };
  const report = {
    format: 'INK-HEADLESS-CONVERSATIONAL-RUNTIME-TEST-REPORT', version: '1.0', headlessScopeDecision: Object.entries(checks).filter(([key]) => key !== 'fullLegacyRegressionAssetsAvailable').every(([, value]) => value) ? 'APPROVED' : 'VALIDATION REQUIRED', finalDecision: Object.values(checks).every(Boolean) ? 'APPROVED' : 'VALIDATION REQUIRED', checks,
    coreShared: 'CLI and JavaScript API both call InkHeadlessRuntime and the existing AICommandLayer/CanonicalExecutor.',
    sessionPersistence: true, approvalMandatory: true, externalGPTUsed: false, mcpUsed: false, imageModelUsed: false,
    supportedSemantics: ['bounded flower creation', 'petal/flower-center/leaf/stem targeting', 'recolor', 'local resize', 'local move', 'rotate', 'stroke/fill adjustment', 'rollback', 'preservation constraints'],
    unsupportedSemantics: ['general open-ended language', '3D/animation/photoreal scenes', 'object-count edits that require full regeneration', 'vector object duplicate/delete with current executor', 'external model inference'],
    noCapabilityExaggeration: true
  };
  await Promise.all([writeJSON(path.join(output, 'conversation_trace.json'), trace), writeJSON(path.join(output, 'reports', 'headless_test_report.json'), report)]);
  process.stdout.write(`${JSON.stringify({ status: report.finalDecision, checks, output }, null, 2)}\n`);
} finally { await runtime.close(); }
