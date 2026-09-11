import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createBrotliDecompress } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import { PNG } from 'pngjs';
import { defaultDocument } from '../src/document/model.js';
import { AICommandLayer, hashValue } from '../src/ai/ai-core.js';
import { createChatRuntime, RuntimeDeterministicTestClient } from '../src/ai/chat-runtime.js';
import { VersionConflictControl } from '../src/ai/plan-analyzers.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'validation', 'non-scripted-collaboration-v1.5.1');
const evidence = path.join(out, 'evidence');
const variants = path.join(out, 'variants');
await mkdir(evidence, { recursive: true });
await mkdir(variants, { recursive: true });
const save = async (name, value) => writeFile(path.join(out, name), typeof value === 'string' ? value : `${JSON.stringify(value, null, 2)}\n`);
const clone = value => structuredClone(value);
const runTool = (runtime, calls, name, args = {}, permission = 'PROPOSE') => {
  const id = `workflow_${String(calls.length + 1).padStart(3, '0')}`;
  return runtime.toolRouter.route({ id, name, arguments: args }, { permission, sessionId: 'non-scripted-v151' }).then(result => {
    calls.push({ id, name, arguments: args, permission, result });
    return result.result;
  });
};

const document = defaultDocument();
document.title = '暮色燈籠果';
document.appVersion = '1.5.1';
const page = document.pages[0];
page.layers[0].id = 'layer-background';
page.layers[0].name = 'Background';
const ai = new AICommandLayer();
ai.setDocument(document);
const runtime = createChatRuntime(ai, { fetchImpl: async () => { throw new Error('Local-only validation made an external request'); } });
runtime.manager.setMode('LOCAL_ONLY');
const calls = [], contexts = [], responses = [], approvals = [], executions = [], differences = [], conversation = [];
const prompt1 = '從空白畫布建立「暮色下三枚橙紅燈籠果」：霧藍背景、彎曲深綠枝條、兩片葉；保留向量與手繪筆畫可編輯，不要套用既有山茶花 Recipe。';
conversation.push({ role: 'user', content: prompt1 });

const initialSteps = [
  { stepId: 'document-title', operation: 'document.create', target: null, parameters: { title: '暮色燈籠果', widthMm: 210, heightMm: 297 } },
  { stepId: 'background', operation: 'vector.createShape', target: 'layer-background', parameters: { id: 'evening-background', name: '霧藍背景', shape: 'rectangle', cx: 0, cy: 0, width: 760, height: 1040, fill: '#cad6dc', stroke: 'none', semanticLabel: 'background' } },
  { stepId: 'botanical-layer', operation: 'layer.create', target: 'layer-background', parameters: { id: 'layer-botanical', name: 'Branch · Leaves' } },
  { stepId: 'branch', operation: 'stroke.draw', target: 'layer-botanical', parameters: { id: 'lantern-branch', name: '彎曲枝條', brushId: 'dry-brush', color: '#355441', size: 18, semanticLabel: 'branch', seed: 1511, points: [{ x: -210, y: 330, p: .2, t: 0 }, { x: -120, y: 120, p: .72, t: 25 }, { x: 10, y: -70, p: .78, t: 50 }, { x: 185, y: -260, p: .18, t: 82 }] } },
  { stepId: 'leaf-left', operation: 'vector.createShape', target: 'layer-botanical', parameters: { id: 'lantern-leaf-left', name: '左葉', shape: 'ellipse', cx: -125, cy: 110, width: 150, height: 280, fill: '#4e705b', stroke: '#294938', semanticLabel: 'leaf' } },
  { stepId: 'leaf-right', operation: 'vector.createShape', target: 'layer-botanical', parameters: { id: 'lantern-leaf-right', name: '右葉', shape: 'ellipse', cx: 115, cy: -85, width: 135, height: 245, fill: '#587862', stroke: '#294938', semanticLabel: 'leaf' } },
  { stepId: 'fruit-layer', operation: 'layer.create', target: 'layer-botanical', parameters: { id: 'layer-fruit', name: 'Lantern Fruits' } },
  ...[-135, 5, 145].flatMap((x, index) => {
    const n = index + 1;
    return [
      { stepId: `fruit-${n}`, operation: 'vector.createShape', target: 'layer-fruit', parameters: { id: `lantern-fruit-${n}`, name: `燈籠果 ${n}`, shape: 'ellipse', cx: x, cy: -170 + index * 24, width: 150 - index * 8, height: 205 - index * 6, fill: index === 1 ? '#d85c3b' : '#e06b42', stroke: '#863b2d', strokeWidth: 2, semanticLabel: 'lantern-fruit' } },
      { stepId: `fruit-detail-${n}`, operation: 'stroke.draw', target: 'layer-fruit', parameters: { id: `lantern-detail-${n}`, name: `果實手繪紋理 ${n}`, brushId: 'watercolor', color: '#8f3d31', size: 8, opacity: .64, semanticLabel: 'lantern-fruit', seed: 1520 + n, points: [{ x: x - 45, y: -205 + index * 24, p: .15, t: 0 }, { x, y: -90 + index * 24, p: .7, t: 22 }, { x: x + 42, y: -205 + index * 24, p: .18, t: 44 }] } }
    ];
  }),
  { stepId: 'detail-layer', operation: 'layer.create', target: 'layer-fruit', parameters: { id: 'layer-highlights', name: 'Hand-drawn Highlights' } }
];

const initialClient = new RuntimeDeterministicTestClient({ planFactory: request => ({
  format: 'INK-MODEL-PLAN',
  version: '1.5.1',
  userIntent: request.prompt,
  summary: '依自然語言建立三枚燈籠果、枝葉與背景的可編輯混合媒材構圖。',
  orderedSteps: initialSteps,
  confidence: .96,
  requestedAction: 'PROPOSE',
  rollbackStrategy: { type: 'CHECKPOINT', required: true },
  destructiveOperations: [],
  unsupportedItems: []
}) });
runtime.manager.register('workflow-initial', initialClient);
const session1 = runtime.manager.start({ client: 'workflow-initial' });
await runTool(runtime, calls, 'get_capabilities');
await runTool(runtime, calls, 'get_document_summary');
const context1 = runtime.contextBuilder.build({ level: 'DOCUMENT_SUMMARY', includeHistory: true, tokenBudget: 12000 });
contexts.push({ round: 1, context: context1 });
const response1 = await runtime.manager.requestPlan(session1.sessionId, { prompt: prompt1, contextOptions: { level: 'DOCUMENT_SUMMARY', includeHistory: true, tokenBudget: 12000 }, transmissionDecision: 'LOCAL_ONLY', userConsent: true });
responses.push({ round: 1, client: 'DETERMINISTIC TEST CLIENT — NOT REAL CHAT', response: response1 });
conversation.push({ role: 'assistant', client: 'deterministic-test', content: response1.plan.summary, planId: response1.plan.planId });

// The user changes a concrete Plan parameter before the first Preview.
const backgroundStep = response1.plan.orderedSteps.find(step => step.stepId === 'background');
const editedPlan1 = ai.editPlan(response1.plan.planId, { updateStep: { stepId: 'background', changes: { parameters: { ...backgroundStep.parameters, fill: '#c2d1d8' } } } });
conversation.push({ role: 'user', content: '把背景改成再冷一點的霧藍 #c2d1d8，其餘保持。' });
const preview1 = await runTool(runtime, calls, 'request_preview', { recipeId: editedPlan1.recipeDraft.recipeId, options: { quality: 'BALANCED' } }, 'PREVIEW');
const approval1 = ai.approve(preview1.previewId, { decision: 'APPROVE', actor: { type: 'user', id: 'validation-operator' } });
approvals.push(approval1);
const execution1 = await runTool(runtime, calls, 'execute_approved_plan', { approvalId: approval1.approvalId }, 'EXECUTE');
executions.push(execution1); differences.push({ round: 1, difference: execution1.difference });
const afterRound1 = clone(ai.currentDocument());

// The second model request is built from the actual post-execution document.
const prompt2 = '讀取剛完成的文件，讓中間燈籠果更醒目：只局部重畫它的高光、將三枚果實改為較深橙紅、把果實紋理換成乾筆；不要改背景、枝條與葉。先預覽，不執行。';
conversation.push({ role: 'user', content: prompt2 });
const actualStateHash = hashValue(afterRound1);
const secondClient = new RuntimeDeterministicTestClient({ planFactory: request => {
  const doc = ai.currentDocument();
  const ids = doc.pages[0].layers.flatMap(layer => layer.objects).map(object => object.id);
  if (!ids.includes('lantern-fruit-2') || !ids.includes('lantern-detail-2')) throw new Error('Actual document targets were not resolved');
  return {
    format: 'INK-MODEL-PLAN', version: '1.5.1', userIntent: request.prompt,
    summary: `第二輪以實際文件 ${hashValue(doc)} 與已解析 Target 建立局部修改。`,
    orderedSteps: [
      { stepId: 'local-redraw', operation: 'stroke.draw', target: 'layer-highlights', parameters: { id: 'lantern-highlight-center', name: '中間果實局部高光', brushId: 'watercolor', color: '#f1b27e', size: 12, opacity: .72, semanticLabel: 'lantern-fruit', seed: 1591, candidates: [[{ x: -28, y: -240, p: .15, t: 0 }, { x: 0, y: -170, p: .75, t: 20 }, { x: 24, y: -115, p: .2, t: 42 }], [{ x: -22, y: -238, p: .18, t: 0 }, { x: 8, y: -165, p: .82, t: 21 }, { x: 28, y: -118, p: .18, t: 43 }]], choice: 0 } },
      { stepId: 'recolor-fruit', operation: 'vector.setFill', target: ['lantern-fruit-1', 'lantern-fruit-2', 'lantern-fruit-3'], parameters: { fill: '#c94d32', preserveLuminance: true, preserveMaterialState: true } },
      { stepId: 'replace-fruit-brush', operation: 'stroke.replaceBrush', target: ['lantern-detail-1', 'lantern-detail-2', 'lantern-detail-3'], parameters: { brushId: 'dry-brush', preservePath: true, preservePressure: true, preserveTilt: true, preserveTiming: true, preserveColor: true, recomputeMaterialState: false, classification: 'EQUIVALENT' } },
      { stepId: 'local-replay', operation: 'stroke.partialReplay', target: ['lantern-detail-2', 'lantern-highlight-center'], parameters: { seed: 1591, range: [0, 1] } }
    ],
    confidence: .93, requestedAction: 'PROPOSE', rollbackStrategy: { type: 'CHECKPOINT', required: true }, destructiveOperations: [], unsupportedItems: []
  };
} });
runtime.manager.register('workflow-second', secondClient);
const session2 = runtime.manager.start({ client: 'workflow-second' });
await runTool(runtime, calls, 'get_document_summary');
await runTool(runtime, calls, 'get_editable_targets');
const context2 = runtime.contextBuilder.build({ level: 'TARGET_CONTEXT', targets: ['lantern-fruit-2', 'lantern-detail-2'], layerIds: ['layer-fruit', 'layer-highlights'], includeHistory: true, tokenBudget: 16000 });
contexts.push({ round: 2, basedOnDocumentHash: actualStateHash, context: context2 });
const response2 = await runtime.manager.requestPlan(session2.sessionId, { prompt: prompt2, contextOptions: { level: 'TARGET_CONTEXT', targets: ['lantern-fruit-2', 'lantern-detail-2'], layerIds: ['layer-fruit', 'layer-highlights'], includeHistory: true, tokenBudget: 16000 }, transmissionDecision: 'LOCAL_ONLY', userConsent: true });
responses.push({ round: 2, client: 'DETERMINISTIC TEST CLIENT — NOT REAL CHAT', response: response2 });
conversation.push({ role: 'assistant', client: 'deterministic-test', content: response2.plan.summary, planId: response2.plan.planId });

// Reject one Preview, modify the Plan, then preview again.
const rejectedPreview = await runTool(runtime, calls, 'request_preview', { recipeId: response2.plan.recipeDraft.recipeId, options: { quality: 'BALANCED' } }, 'PREVIEW');
const rejectedApproval = ai.approve(rejectedPreview.previewId, { decision: 'REJECT', actor: { type: 'user', id: 'validation-operator' } });
approvals.push(rejectedApproval);
conversation.push({ role: 'user', content: '拒絕：高光太偏黃，改成較淡的暖粉 #f3c0aa 後重做 Preview。' });
const redraw = response2.plan.orderedSteps.find(step => step.stepId === 'local-redraw');
const editedPlan2 = ai.editPlan(response2.plan.planId, { updateStep: { stepId: 'local-redraw', changes: { parameters: { ...redraw.parameters, color: '#f3c0aa', choice: 1 } } } });
const preview2 = await runTool(runtime, calls, 'request_preview', { recipeId: editedPlan2.recipeDraft.recipeId, options: { quality: 'HIGH' } }, 'PREVIEW');

// A deliberate document change makes this Preview stale and execution must fail closed.
const conflict = new VersionConflictControl(ai);
const conflictSnapshot = conflict.snapshot(editedPlan2);
const beforeConflictMutation = clone(ai.currentDocument());
ai.currentDocument().recentColors.push('#112233');
const conflictCheck = conflict.check(conflictSnapshot);
const staleApproval = ai.approve(preview2.previewId, { decision: 'APPROVE', selectedSteps: ['local-redraw', 'recolor-fruit', 'replace-fruit-brush'], actor: { type: 'user', id: 'validation-operator' } });
let staleExecutionError = null;
try { ai.executeApproval(staleApproval.approvalId); } catch (error) { staleExecutionError = { code: error.code, message: error.message }; }
ai.setDocument(beforeConflictMutation);

// Rebase and approve only selected steps; local replay is intentionally excluded.
const rebasedPlan2 = ai.editPlan(editedPlan2.planId, {});
const preview3 = await runTool(runtime, calls, 'request_preview', { recipeId: rebasedPlan2.recipeDraft.recipeId, options: { quality: 'HIGH' } }, 'PREVIEW');
const backgroundBeforeSelective = hashValue(ai.currentDocument().pages[0].layers.find(layer => layer.id === 'layer-background'));
const selected = ['local-redraw', 'recolor-fruit', 'replace-fruit-brush'];
const approval2 = ai.approve(preview3.previewId, { decision: 'APPROVE', selectedSteps: selected, actor: { type: 'user', id: 'validation-operator' } });
approvals.push(approval2);
const execution2 = await runTool(runtime, calls, 'execute_approved_plan', { approvalId: approval2.approvalId }, 'EXECUTE');
executions.push(execution2); differences.push({ round: 2, difference: execution2.difference });
const backgroundAfterSelective = hashValue(ai.currentDocument().pages[0].layers.find(layer => layer.id === 'layer-background'));
const variantBeforeRollback = clone(ai.currentDocument());
await writeFile(path.join(variants, 'Variant_A_Deep_Orange_Dry_Brush.ink'), `${JSON.stringify(variantBeforeRollback, null, 2)}\n`);

// Roll back the partial execution, then rebuild Preview and execute the revised Plan again.
const rollback = await runTool(runtime, calls, 'rollback_execution', { executionId: execution2.executionId }, 'EXECUTE');
const preview4 = await runTool(runtime, calls, 'request_preview', { recipeId: rebasedPlan2.recipeDraft.recipeId, options: { quality: 'HIGH', selectedSteps: selected } }, 'PREVIEW');
const approval3 = ai.approve(preview4.previewId, { decision: 'APPROVE', selectedSteps: selected, actor: { type: 'user', id: 'validation-operator' } });
approvals.push(approval3);
const execution3 = await runTool(runtime, calls, 'execute_approved_plan', { approvalId: approval3.approvalId }, 'EXECUTE');
executions.push(execution3); differences.push({ round: '2-reapply', difference: execution3.difference });

// A third local-only plan performs only the deferred local replay.
const replayPlan = ai.createPlanFromSteps('只重播中間果實既有細節與剛核准的高光，固定 Seed；不碰其他內容。', [{ stepId: 'local-replay', operation: 'stroke.partialReplay', target: ['lantern-detail-2', 'lantern-highlight-center'], parameters: { seed: 1591, range: [0, 1] } }], { confidence: .98, seed: 1591 });
const replayPreview = ai.preview(replayPlan.recipeDraft.recipeId);
const replayApproval = ai.approve(replayPreview.previewId, { decision: 'APPROVE', actor: { type: 'user', id: 'validation-operator' } });
approvals.push(replayApproval);
const replayExecution = ai.executeApproval(replayApproval.approvalId);
executions.push(replayExecution); differences.push({ round: 3, difference: replayExecution.difference });

const finalDocument = clone(ai.currentDocument());
finalDocument.ai.semanticTargets = ai.semantics.build(finalDocument);
finalDocument.ai.audit = ai.audit.list();
finalDocument.ai.variants = [
  { variantId: 'variant-a-deep-orange', documentHash: hashValue(variantBeforeRollback), editable: true },
  { variantId: 'variant-b-soft-highlight', documentHash: hashValue(finalDocument), editable: true }
];
await writeFile(path.join(variants, 'Variant_B_Soft_Highlight_Final.ink'), `${JSON.stringify(finalDocument, null, 2)}\n`);
await save('INK_Non_Scripted_Lantern_Fruit_v1.5.1_RC.ink', finalDocument);
await save('original-conversation.json', conversation);
await save('contexts.json', contexts);
await save('tool-calls.json', calls);
await save('model-responses.json', responses);
await save('plans.json', { initial: editedPlan1, second: editedPlan2, rebased: rebasedPlan2, replay: replayPlan });
await save('previews.json', { initial: preview1, rejected: rejectedPreview, stale: preview2, rebased: preview3, rollbackRepreview: preview4, replay: replayPreview });
await save('approvals.json', approvals);
await save('executions.json', executions);
await save('differences.json', differences);
await save('audit.json', finalDocument.ai.audit);
await save('rollback-evidence.json', rollback);
await save('version-conflict-evidence.json', { snapshot: conflictSnapshot, check: conflictCheck, executionError: staleExecutionError, blocked: staleExecutionError?.code === 'DOCUMENT_VERSION_MISMATCH' });
await save('outside-region-preservation.json', { target: 'layer-background', beforeHash: backgroundBeforeSelective, afterHash: backgroundAfterSelective, unchanged: backgroundBeforeSelective === backgroundAfterSelective });
await save('workflow-status.json', {
  format: 'INK-NON-SCRIPTED-COLLABORATION', version: '1.5.1', decision: 'VALIDATION REQUIRED',
  externalModelStatus: 'REAL CHAT EXECUTION PENDING USER CREDENTIAL', semanticClient: 'DETERMINISTIC TEST CLIENT — NOT A REAL CHAT SERVICE',
  imageModelUsed: false, fixedV150CamelliaRecipeUsed: false, secondPlanBasedOnActualDocumentHash: actualStateHash,
  completed: { blankDocument: true, naturalLanguageRequest: true, capabilityRead: true, userEditedPlanParameter: true, preview: true, approvalAndExecution: true, postExecutionStateRead: true, secondRoundPlan: true, localRedraw: true, localRecolor: true, localReplaceBrush: true, previewRejected: true, planEditedAndRepreviewed: true, partialApproval: true, rollback: rollback.status === 'ROLLED_BACK', variant: true, finalInk: true, export: true },
  proof: { stalePreviewBlocked: staleExecutionError?.code === 'DOCUMENT_VERSION_MISMATCH', actualTargetsResolved: true, outsideRegionUnchanged: backgroundBeforeSelective === backgroundAfterSelective, rollbackComplete: rollback.status === 'ROLLED_BACK', auditTraceable: finalDocument.ai.audit.length > 0 },
  manual: { realExternalChat: 'EXTERNAL CREDENTIAL REQUIRED', artQuality: 'USER VISUAL VALIDATION REQUIRED', physicalStylus: 'DEFERRED' }
});

// Render the actual editable .ink state and export through the production PNG Worker path.
const browserHome = path.join(root, '.browser-home-v151-collaboration');
const chromiumBin = path.join(root, 'node_modules', '@sparticuz', 'chromium', 'bin');
await mkdir(path.join(browserHome, '.cache', 'fontconfig'), { recursive: true });
process.env.HOME = browserHome;
process.env.FONTCONFIG_PATH = process.env.FONTCONFIG_PATH || '/etc/fonts';
const extractTar = async (file, destination) => {
  await mkdir(destination, { recursive: true });
  await new Promise((resolve, reject) => {
    const tar = spawn('tar', ['-xf', '-', '--no-same-owner', '-C', destination], { stdio: ['pipe', 'ignore', 'pipe'] });
    const errors = [];
    tar.stderr.on('data', chunk => errors.push(chunk));
    tar.on('error', reject);
    tar.on('close', code => code === 0 ? resolve() : reject(new Error(Buffer.concat(errors).toString())));
    createReadStream(file).pipe(createBrotliDecompress()).pipe(tar.stdin);
  });
};
if (!existsSync('/tmp/libGLESv2.so')) await extractTar(path.join(chromiumBin, 'swiftshader.tar.br'), '/tmp');
if (!existsSync('/tmp/al2023')) await extractTar(path.join(chromiumBin, 'al2023.tar.br'), '/tmp/al2023');
if (!existsSync('/tmp/fonts')) await extractTar(path.join(chromiumBin, 'fonts.tar.br'), '/tmp/fonts');
const { default: chromiumBinary } = await import('@sparticuz/chromium');
chromiumBinary.setGraphicsMode = true;
const server = spawn(process.execPath, ['scripts/serve.mjs', '--host', '127.0.0.1', '--port', '4181'], { cwd: root, stdio: ['ignore', 'pipe', 'pipe'] });
for (let index = 0; index < 80; index++) {
  try { if ((await fetch('http://127.0.0.1:4181/index.html')).ok) break; } catch {}
  await new Promise(resolve => setTimeout(resolve, 100));
}
const browser = await chromium.launch({ headless: true, executablePath: await chromiumBinary.executablePath(), args: [...chromiumBinary.args, '--disable-dev-shm-usage'], chromiumSandbox: false });
const browserPage = await browser.newPage({ viewport: { width: 1100, height: 1000 }, deviceScaleFactor: 1 });
await browserPage.goto('http://127.0.0.1:4181/index.html?v=1.5.1', { waitUntil: 'networkidle' });
await browserPage.waitForFunction(() => window.INK_AI?.version === '1.5.1');
const renderState = async (state, name) => {
  await browserPage.evaluate(doc => { window.INK_STUDIO.reloadState(doc); window.INK_STUDIO.app.fitContent(); window.INK_STUDIO.app.renderer.render(); }, state);
  await browserPage.waitForTimeout(100);
  const target = path.join(evidence, name);
  await browserPage.locator('#stage').screenshot({ path: target });
  return target;
};
const initialImage = await renderState(afterRound1, '01-initial-execution.png');
const variantImage = await renderState(variantBeforeRollback, '02-partial-approved-variant.png');
const finalImage = await renderState(finalDocument, '03-final.png');
const exportResult = await browserPage.evaluate(async () => {
  const samples = []; let expected = performance.now() + 16; let active = true;
  const tick = () => { const current = performance.now(); samples.push(Math.max(0, current - expected)); expected = current + 16; if (active) setTimeout(tick, 16); };
  tick();
  const blob = await window.INK_STUDIO.app.exportPNG({ scope: 'artboard', ppi: 300, background: true });
  active = false;
  await new Promise(resolve => setTimeout(resolve, 32));
  const dataUrl = await new Promise((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = () => reject(reader.error); reader.readAsDataURL(blob); });
  return { base64: String(dataUrl).split(',')[1], bytes: blob.size, report: window.INK_STUDIO.app.lastPNGExportReport, longestMainThreadBlockMs: Math.max(...samples), samples: samples.length };
});
const { base64, ...exportReport } = exportResult;
await writeFile(path.join(out, 'INK_Non_Scripted_Lantern_Fruit_Final.png'), Buffer.from(base64, 'base64'));
await save('png-worker-export-report.json', exportReport);
const combine = async (left, right, name) => {
  const a = PNG.sync.read(await readFile(left)); const b = PNG.sync.read(await readFile(right));
  const result = new PNG({ width: a.width + b.width, height: Math.max(a.height, b.height) });
  PNG.bitblt(a, result, 0, 0, a.width, a.height, 0, 0); PNG.bitblt(b, result, 0, 0, b.width, b.height, a.width, 0);
  await writeFile(path.join(evidence, name), PNG.sync.write(result));
};
await combine(initialImage, variantImage, 'comparison-round1-round2.png');
await combine(variantImage, finalImage, 'comparison-variant-final.png');
await browser.close();
server.kill('SIGTERM');

await save('known-limits.json', {
  decision: 'VALIDATION REQUIRED',
  items: [
    { status: 'EXTERNAL CREDENTIAL REQUIRED', item: 'Ten real external model executions were not run; no provider credential was supplied.' },
    { status: 'USER VISUAL VALIDATION REQUIRED', item: 'Professional artistic quality and natural-media feel.' },
    { status: 'DEFERRED', item: 'Physical stylus validation.' },
    { status: 'RESEARCH', item: 'Deterministic validation client verifies the runtime workflow, not language-model semantic maturity.' }
  ]
});
console.log(JSON.stringify({ status: 'COMPLETED', decision: 'VALIDATION REQUIRED', externalModel: 'REAL CHAT EXECUTION PENDING USER CREDENTIAL', toolCalls: calls.length, auditRecords: finalDocument.ai.audit.length, staleBlocked: staleExecutionError?.code, rollback: rollback.status, outsideUnchanged: backgroundBeforeSelective === backgroundAfterSelective, export: exportReport }, null, 2));
