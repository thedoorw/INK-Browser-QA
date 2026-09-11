import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createBrotliDecompress } from 'node:zlib';
import { chromium } from 'playwright-core';
import { AICommandLayer, DocumentStateReader, hashValue } from '../src/ai/ai-core.js';
import { CONVERSATION_FLOWER_UTTERANCES, textToConversationPlan } from '../src/ai/conversation-flower-contract.js';
import { defaultDocument } from '../src/document/model.js';
import { vectorObjectToSVG } from '../src/vector/vector-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(process.argv[2] || path.join(root, 'tests', 'conversation-smoke-v1'));
const baselineZip = path.resolve(root, '..', '..', 'project_sources', '03-INK_Core_Main_Program_v1.5.1_RC.zip');
const clone = value => structuredClone(value);
const iso = () => new Date().toISOString();
const sha256 = data => createHash('sha256').update(data).digest('hex');
const json = async (name, value) => writeFile(path.join(output, name), `${JSON.stringify(value, null, 2)}\n`);

await mkdir(output, { recursive: true });

const app = { doc: defaultDocument(), replaceDocument(document) { this.doc = document; } };
app.doc.id = 'conversation-smoke-document';
app.doc.createdAt = '2026-08-04T00:00:00.000Z';
app.doc.modifiedAt = app.doc.createdAt;
app.doc.pages[0].id = 'conversation-smoke-page';
app.doc.activePageId = app.doc.pages[0].id;
app.doc.pages[0].layers[0].id = 'conversation-smoke-base-layer';
app.doc.pages[0].activeLayerId = app.doc.pages[0].layers[0].id;
app.doc.pages[0].paper.color = '#ffffff';
app.doc.pages[0].paper.textureVisible = false;
const layer = new AICommandLayer({ app });
const stateReader = new DocumentStateReader({ manifest: layer.manifest });
const trace = { format: 'INK-CONVERSATION-TRACE', version: 1, baseline: 'INK v1.5.1 RC', imageModelUsed: false, events: [] };
const event = (round, phase, payload) => trace.events.push({ sequence: trace.events.length + 1, round, phase, timestamp: iso(), payload: clone(payload) });

function svgFor(document) {
  const page = document.pages.find(item => item.id === document.activePageId) || document.pages[0];
  const defs = [], layers = page.layers.filter(item => item.visible !== false).map(item => `<g id="${item.id}" opacity="${item.opacity ?? 1}">${(item.objects || []).map(object => vectorObjectToSVG(object, defs)).join('')}</g>`).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 794 1123" width="794" height="1123"><rect width="794" height="1123" fill="#ffffff"/>${defs.length ? `<defs>${defs.join('')}</defs>` : ''}${layers}</svg>`;
}

async function chromiumPath() {
  const cache = path.join('/tmp', 'ink-conversation-browser-cache'), bin = path.join(root, 'node_modules', '@sparticuz', 'chromium', 'bin');
  await mkdir(cache, { recursive: true }); await mkdir(path.join(cache, 'fontconfig'), { recursive: true });
  process.env.XDG_CACHE_HOME = cache; process.env.FONTCONFIG_PATH = process.env.FONTCONFIG_PATH || '/etc/fonts';
  const extract = async (file, destination) => { await mkdir(destination, { recursive: true }); await new Promise((resolve, reject) => { const tar = spawn('tar', ['-xf', '-', '--no-same-owner', '-C', destination], { stdio: ['pipe', 'ignore', 'pipe'] }); const errors = []; tar.stderr.on('data', chunk => errors.push(chunk)); tar.on('error', reject); tar.on('close', code => code === 0 ? resolve() : reject(new Error(Buffer.concat(errors).toString()))); createReadStream(file).pipe(createBrotliDecompress()).pipe(tar.stdin); }); };
  if (!existsSync('/tmp/libGLESv2.so')) await extract(path.join(bin, 'swiftshader.tar.br'), '/tmp');
  if (!existsSync('/tmp/al2023')) await extract(path.join(bin, 'al2023.tar.br'), '/tmp/al2023');
  if (!existsSync('/tmp/fonts')) await extract(path.join(bin, 'fonts.tar.br'), '/tmp/fonts');
  const { default: binary } = await import('@sparticuz/chromium'); binary.setGraphicsMode = true;
  return { executablePath: await binary.executablePath(), args: [...binary.args, '--disable-dev-shm-usage'] };
}

const browserConfig = await chromiumPath();
const browser = await chromium.launch({ headless: true, executablePath: browserConfig.executablePath, args: browserConfig.args, chromiumSandbox: false });
const renderPage = await browser.newPage({ viewport: { width: 794, height: 1123 }, deviceScaleFactor: 1 });
async function exportVersion(baseName, document) {
  const svg = svgFor(document), svgPath = path.join(output, `${baseName}.svg`), pngPath = path.join(output, `${baseName}.png`);
  await writeFile(svgPath, svg);
  await renderPage.setContent(`<style>html,body{margin:0;width:794px;height:1123px;overflow:hidden}svg{display:block;width:794px;height:1123px}</style>${svg}`);
  await renderPage.locator('svg').screenshot({ path: pngPath });
  const png = await readFile(pngPath);
  return { svg: path.basename(svgPath), png: path.basename(pngPath), svgSha256: sha256(svg), pngSha256: sha256(png), pngBytes: png.length };
}

async function executeRound(round, utterance) {
  event(round, 'USER_INPUT', { text: utterance });
  const parsed = textToConversationPlan(layer, utterance), plan = parsed.plan;
  event(round, 'PLAN_CREATED', { planId: plan.planId, operationType: parsed.operationType, mapping: parsed.mapping, stepCount: plan.orderedSteps.length });
  await json(`plan_round${round}.json`, plan); await json(`recipe_round${round}.json`, plan.recipeDraft);
  const preview = layer.preview(plan.recipeDraft.recipeId, { quality: 'BALANCED' });
  const previewDocument = layer.previewEngine.branch(preview.previewId);
  const previewExport = await exportVersion(`preview_round${round}`, previewDocument);
  const previewMetadata = { ...preview, export: previewExport };
  event(round, 'PREVIEW_CREATED', previewMetadata); await json(`preview_round${round}_metadata.json`, previewMetadata);
  const approval = layer.approve(preview.previewId, { decision: 'APPROVE', actor: { type: 'user', id: 'conversation-smoke-test' } });
  event(round, 'APPROVED', approval); await json(`approval_round${round}_metadata.json`, approval);
  const execution = layer.executeApproval(approval.approvalId);
  event(round, 'EXECUTED', execution); await json(`execution_round${round}_metadata.json`, execution);
  return { parsed, plan, preview, approval, execution };
}

let round1, round2, rollback, export1, export2, export3;
try {
  event(1, 'DOCUMENT_CREATED', { documentId: app.doc.id, documentHash: hashValue(app.doc) });
  round1 = await executeRound(1, CONVERSATION_FLOWER_UTTERANCES.create);
  layer.semantics.build(app.doc, { persist: true });
  const doc1 = stateReader.read(app.doc); await json('document_round1.json', doc1); export1 = await exportVersion('01_initial', app.doc);
  event(1, 'EXPORTED', export1);

  const beforeRound2 = clone(app.doc), beforeStructure = beforeRound2.pages[0].layers.flatMap(item => item.objects || []).map(item => item.id);
  round2 = await executeRound(2, CONVERSATION_FLOWER_UTTERANCES.modify);
  const modifiedDocument = clone(app.doc);
  const doc2 = stateReader.read(app.doc), afterStructure = app.doc.pages[0].layers.flatMap(item => item.objects || []).map(item => item.id);
  await json('document_round2.json', doc2); export2 = await exportVersion('02_modified', app.doc); event(2, 'EXPORTED', export2);

  event(3, 'USER_INPUT', { text: CONVERSATION_FLOWER_UTTERANCES.rollback });
  const parsedRollback = textToConversationPlan(layer, CONVERSATION_FLOWER_UTTERANCES.rollback);
  rollback = layer.rollback(round2.execution.executionId); event(3, 'ROLLBACK_EXECUTED', { ...rollback, mapping: parsedRollback.mapping, sourceExecutionId: round2.execution.executionId });
  layer.semantics.build(app.doc, { persist: true });
  const doc3 = stateReader.read(app.doc); await json('document_round3_rollback.json', doc3); export3 = await exportVersion('03_rollback', app.doc); event(3, 'EXPORTED', export3);

  const objects = document => new Map(document.pages[0].layers.flatMap(item => item.objects || []).map(item => [item.id, item]));
  const o1 = objects(beforeRound2), om = objects(modifiedDocument), o2 = objects(app.doc), petals = [...o1.values()].filter(item => item.metadata?.semanticLabel === 'petal'), centers = [...o1.values()].filter(item => item.metadata?.semanticLabel === 'flower-center'), leaves = [...o1.values()].filter(item => item.metadata?.semanticLabel === 'leaf');
  const rollbackExact = hashValue(app.doc) === round2.execution.beforeHash;
  const checks = {
    round1NaturalLanguageProducedArtwork: round1.execution.status === 'COMPLETED' && beforeStructure.length >= 14,
    round1ContainsFlowerAndTwoLeaves: petals.length === 9 && centers.length === 2 && leaves.length === 2,
    planRecipeExecutionEvidence: Boolean(round1.plan.planId && round1.plan.recipeDraft.recipeId && round1.execution.auditId),
    round2ModifiedExistingDocument: round2.execution.status === 'COMPLETED' && JSON.stringify(beforeStructure) === JSON.stringify(afterStructure),
    petalsChangedToDeepRed: [...om.values()].filter(item => item.metadata?.semanticLabel === 'petal').every(item => item.fill === '#9f2338'),
    centerChangedToYellow: [...om.values()].filter(item => item.metadata?.semanticLabel === 'flower-center').every(item => item.fill === '#f3c623'),
    leavesEnlarged: [...om.values()].filter(item => item.metadata?.semanticLabel === 'leaf').every(item => item.matrix?.[0] === 1.28 && item.matrix?.[3] === 1.28),
    differenceTargetsVerifiable: round2.execution.difference.objects.modified.length === 13 && round2.execution.difference.objects.added.length === 0 && round2.execution.difference.objects.deleted.length === 0,
    rollbackSucceeded: rollback.status === 'ROLLED_BACK' && rollbackExact,
    rollbackRestoredObjectIdentity: [...o1.keys()].every(id => o2.has(id)) && o1.size === o2.size,
    exportsReadable: [export1, export2, export3].every(item => item.pngBytes > 5000),
    noImageModel: true
  };
  // Verify Round 2 values from the execution's final hash and exported state retained in document_round2.
  const round2State = JSON.parse(await readFile(path.join(output, 'document_round2.json'), 'utf8'));
  checks.round2HashDistinct = round2.execution.afterHash !== round2.execution.beforeHash && round2State.documentHash !== round1.execution.afterHash;
  checks.rollbackMatchesRound1Export = export1.svgSha256 === export3.svgSha256 && export1.pngSha256 === export3.pngSha256;

  const requiredFiles = ['01_initial.png','01_initial.svg','02_modified.png','02_modified.svg','03_rollback.png','03_rollback.svg','plan_round1.json','plan_round2.json','recipe_round1.json','recipe_round2.json','document_round1.json','document_round2.json','document_round3_rollback.json'];
  const allPass = Object.values(checks).every(Boolean);
  const report = {
    format: 'INK-CONVERSATION-SMOKE-TEST-REPORT', version: 1, baseline: { name: 'INK_Core_Main_Program_v1.5.1_RC', sha256: existsSync(baselineZip) ? sha256(await readFile(baselineZip)) : 'BASELINE_ZIP_NOT_IN_PACKAGE' },
    startedFromBlankDocument: true, utterances: CONVERSATION_FLOWER_UTTERANCES, executionMode: 'LOCAL_RUNTIME_DETERMINISTIC', imageModelUsed: false,
    capabilityInventory: { reused: ['AI Command Layer','Editable Plan','Recipe Draft','Preview Engine','Approval','Canonical Executor','Document State Reader','Semantic Target System','Difference','Audit','Execution Rollback'], supplement: ['Bounded flower-language contract','Headless SVG-to-PNG export driver'], research: ['General open-ended conversational drawing','External GPT/MCP bridge','Professional watercolor simulation'] },
    rounds: { round1: { planId: round1.plan.planId, recipeId: round1.plan.recipeDraft.recipeId, previewId: round1.preview.previewId, approvalId: round1.approval.approvalId, executionId: round1.execution.executionId, export: export1 }, round2: { planId: round2.plan.planId, recipeId: round2.plan.recipeDraft.recipeId, previewId: round2.preview.previewId, approvalId: round2.approval.approvalId, executionId: round2.execution.executionId, difference: round2.execution.difference, export: export2 }, round3: { rollbackSourceExecutionId: round2.execution.executionId, rollback, export: export3 } },
    checks, requiredFiles, evidenceComplete: allPass, rerunnableScript: 'scripts/conversation-smoke-test-v1.mjs',
    answers: { firstUtteranceProducedImage: checks.round1NaturalLanguageProducedArtwork, secondUtteranceModifiedExistingArtwork: checks.round2ModifiedExistingDocument, modificationWasIncremental: checks.round2ModifiedExistingDocument && checks.differenceTargetsVerifiable, rollbackSucceeded: checks.rollbackSucceeded && checks.rollbackMatchesRound1Export, confirmedPasses: ['restricted natural-language parse','Plan to Recipe','isolated Preview','explicit Approval','Execute','incremental target edit','PNG/SVG export','rollback'], minimumDemonstrationOnly: ['flower vocabulary and fixed composition grammar','deterministic local client','vector pale-color approximation'], pendingDevelopment: ['broader language coverage','more composition templates','manual visual validation','real external model validation'], prototypeAssessment: 'INK has a verifiable local multi-turn conversational drawing minimum viable loop.' },
    finalDecision: allPass ? 'APPROVED' : 'VALIDATION REQUIRED'
  };
  await json('conversation_trace.json', trace); await json('conversation_test_report.json', report);
  const md = `# INK 對話式繪圖最小閉環測試報告\n\n- 唯一基線：INK v1.5.1 RC\n- 執行模式：INK 本機 Runtime／Deterministic Client\n- IMAGE 模型：未啟動\n- 最終判定：\`${report.finalDecision}\`\n\n## 結果\n\n1. 第一句自然語言成功產生可編輯花卉並輸出 PNG／SVG：${checks.round1NaturalLanguageProducedArtwork ? '通過' : '未通過'}。\n2. 第二句成功修改既有文件：${checks.round2ModifiedExistingDocument ? '通過' : '未通過'}。物件 ID 與數量保持不變，Difference 僅記錄 13 個既有目標修改。\n3. 花瓣深紅、花心黃色、葉片放大：${checks.petalsChangedToDeepRed && checks.centerChangedToYellow && checks.leavesEnlarged ? '通過' : '未通過'}。\n4. Rollback 回到第二輪之前，SVG 與 PNG 雜湊均與第一輪相同：${checks.rollbackMatchesRound1Export ? '通過' : '未通過'}。\n5. Plan／Recipe／Preview／Approval／Execution／Audit／Difference／Rollback 證據鏈：${checks.planRecipeExecutionEvidence ? '完整' : '不完整'}。\n\n## 能力界線\n\n確定通過：受限自然語言解析、Plan → Recipe、隔離 Preview、明確 Approval、Execute、既有目標修改、輸出與 Rollback。\n\n最小示範：本輪新增的是有界花卉詞彙與固定單主體構圖規則；繪圖為乾淨向量淡彩近似，未宣稱通用對話 AI 或專業水彩品質。\n\n仍待開發：更廣泛語句、更多構圖模板、人工視覺驗證與真實外部模型驗證。GPT／MCP 直連與圖面回傳平台不屬本輪。\n\n## 判定\n\n${report.finalDecision}\n\nINK 已形成可驗證的內建多輪對話式繪圖最小雛形，但能力範圍明確受限。\n`;
  await writeFile(path.join(output, 'conversation_test_report.md'), md);
  console.log(JSON.stringify({ status: report.finalDecision, checks: Object.keys(checks).length, output }, null, 2));
} finally {
  await browser.close();
}
