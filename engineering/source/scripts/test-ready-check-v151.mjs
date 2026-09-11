import { access, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { inspectDocument } from '../src/document/integrity.js';
import { migrateDocument } from '../src/document/migration.js';

const root = resolve(new URL('..', import.meta.url).pathname);
const checks = [];
const add = (name, passed, details = null) => checks.push({ name, passed: Boolean(passed), details });
const json = async file => JSON.parse(await readFile(resolve(root, file), 'utf8'));
const required = [
  'index.html', 'index-standalone.html', 'dist/ink.compat.js', 'src/ai/ai-core.js', 'src/ai/chat-runtime.js', 'src/ai/plan-analyzers.js', 'src/ai/install-ai.js',
  'schemas/ink-chat-connection-v151.schema.json', 'schemas/ink-chat-context-v151.schema.json', 'schemas/ink-chat-tool-call-v151.schema.json', 'schemas/ink-local-image-analysis-v151.schema.json',
  'tests/browser-evidence-v1.5.1/browser-smoke-report-v1.5.1.json', 'tests/browser-evidence-v1.5.1/ui-element-manifest-v1.5.1.json', 'tests/browser-evidence-v1.5.1/ui-regression-v1.4.0-v1.5.0-v1.5.1.json',
  'tests/browser-evidence-v1.5.1/UI_Regression_Initial_v1.4.0_v1.5.0_v1.5.1.png', 'tests/browser-evidence-v1.5.1/UI_Regression_Panels_v1.4.0_v1.5.0_v1.5.1.png',
  'validation/non-scripted-collaboration-v1.5.1/INK_Non_Scripted_Lantern_Fruit_v1.5.1_RC.ink', 'validation/non-scripted-collaboration-v1.5.1/INK_Non_Scripted_Lantern_Fruit_Final.png',
  'validation/non-scripted-collaboration-v1.5.1/workflow-status.json', 'validation/non-scripted-collaboration-v1.5.1/version-conflict-evidence.json', 'validation/non-scripted-collaboration-v1.5.1/outside-region-preservation.json',
  'ai-artwork-v150/AI_Assisted_Camellia_v1.5.0.ink', 'tests/browser-evidence-v1.5.0/browser-smoke-report-v1.5.0.json',
  'test-fixtures/01_blank_a4.ink', 'test-fixtures/05_v082_fixed_migration.ink', 'benchmarks-hand-drawing-v1.4.0/A-line-flower/v1.4.0-corrected/A-line-flower.ink'
];
for (const file of required) await access(resolve(root, file));
add('Required runtime, schema, UI evidence, workflow and compatibility files exist', true, { count: required.length });

const version = await json('VERSION.json');
add('Version metadata locks the v1.5.0 package as the unique baseline', version.coreVersion === '1.5.1' && version.baselineSha256 === 'eb66cb250249ba672b1244dcdeacb13a975fb34dc79729e60402051087e97ac5', version);
const bundle = await readFile(resolve(root, 'dist/ink.compat.js'), 'utf8');
add('Compatibility bundle retains v1.5 AI and drawing cores', ['AICommandLayer', 'PreviewEngine', 'SemanticTargetSystem', 'PNGWorkerEncoder', 'createUnifiedStroke', 'UniversalProgramImporter', 'CalibrationProfileStore'].every(token => bundle.includes(token)), { bytes: Buffer.byteLength(bundle) });
const runtimeSource = await readFile(resolve(root, 'src/ai/chat-runtime.js'), 'utf8');
add('CHAT runtime exposes provider-neutral clients, Context, tools, repair and bridges', ['ChatClientInterface', 'ChatSessionManager', 'ContextBuilder', 'HTTPModelAdapter', 'OpenAICompatibleAdapter', 'CustomEndpointAdapter', 'ToolCallRouter', 'StreamHandler', 'ApprovalBridge', 'ExecutionBridge', 'ErrorMapper', 'AuditBridge'].every(token => runtimeSource.includes(token)));
add('Credential and external transmission protections are present', runtimeSource.includes('EXTERNAL_CREDENTIAL_REQUIRED') && runtimeSource.includes('TRANSMISSION_APPROVAL_REQUIRED') && runtimeSource.includes('LOCAL_ONLY_NETWORK_BLOCKED') && runtimeSource.includes("credential: '[NEVER LOGGED]'"));
const browser = await json('tests/browser-evidence-v1.5.1/browser-smoke-report-v1.5.1.json');
add('v1.5.1 Chromium UI checks completed', browser.status === 'COMPLETED' && browser.checks.every(item => item.passed), { checks: browser.checks.length, screenshots: browser.screenshots.length });
const uiRegression = await json('tests/browser-evidence-v1.5.1/ui-regression-v1.4.0-v1.5.0-v1.5.1.json');
const v150Comparison = uiRegression.comparisons?.find(item => item.from === '1.5.0' && item.to === '1.5.1');
add('v1.5.0 to v1.5.1 critical UI elements have no regression', v150Comparison?.regressions?.length === 0 && uiRegression.mainElementRegression?.length === 0, { comparison: v150Comparison, mainElementRegression: uiRegression.mainElementRegression });
const workflow = await json('validation/non-scripted-collaboration-v1.5.1/workflow-status.json');
add('Non-scripted local validation completes the reversible collaboration workflow', Object.values(workflow.completed).every(Boolean) && workflow.proof.stalePreviewBlocked && workflow.proof.outsideRegionUnchanged && workflow.proof.rollbackComplete, workflow.proof);
add('External CHAT is not misreported as passed', workflow.externalModelStatus === 'REAL CHAT EXECUTION PENDING USER CREDENTIAL' && workflow.semanticClient.includes('NOT A REAL CHAT SERVICE'), { externalModelStatus: workflow.externalModelStatus, semanticClient: workflow.semanticClient });
const conflict = await json('validation/non-scripted-collaboration-v1.5.1/version-conflict-evidence.json');
add('Stale Preview execution fails closed', conflict.blocked && conflict.executionError.code === 'DOCUMENT_VERSION_MISMATCH', conflict.executionError);
const preservation = await json('validation/non-scripted-collaboration-v1.5.1/outside-region-preservation.json');
add('Selective edit preserves the unselected background', preservation.unchanged && preservation.beforeHash === preservation.afterHash, preservation);
const png = await json('validation/non-scripted-collaboration-v1.5.1/png-worker-export-report.json');
add('Final PNG uses Worker Offscreen export and releases resources', png.report.method === 'WORKER_OFFSCREEN' && !png.report.mainThreadEncoding && png.report.resourcesReleased && png.report.width === 2480 && png.report.height === 3508, png);
const finalInk = migrateDocument(await json('validation/non-scripted-collaboration-v1.5.1/INK_Non_Scripted_Lantern_Fruit_v1.5.1_RC.ink'));
const integrity = inspectDocument(finalInk);
add('Final non-scripted .ink is structurally valid and editable', integrity.passed, integrity);
const oldInk = migrateDocument(await json('ai-artwork-v150/AI_Assisted_Camellia_v1.5.0.ink'));
add('v1.5.0 .ink remains loadable after v1.5.1 migration', inspectDocument(oldInk).passed);
const csp = await readFile(resolve(root, 'index.html'), 'utf8');
add('CSP disables object/embed and limits script execution', csp.includes("script-src 'self'") && csp.includes("object-src 'none'") && csp.includes("worker-src 'self' blob:"));
add('IMAGE model was not used', version.imageModelUsed === false && workflow.imageModelUsed === false);
add('Physical stylus and artistic quality remain manual', workflow.manual.physicalStylus === 'DEFERRED' && workflow.manual.artQuality === 'USER VISUAL VALIDATION REQUIRED', workflow.manual);

const result = { schema: 'INK_TEST_READY_REPORT_V151', version: '1.5.1', packageRevision: 'RC1', decision: 'VALIDATION REQUIRED', passed: checks.every(item => item.passed), checksPassed: checks.filter(item => item.passed).length, checksTotal: checks.length, checks };
await writeFile(resolve(root, 'tests/test-ready-report-v1.5.1.json'), `${JSON.stringify(result, null, 2)}\n`);
if (!result.passed) throw new Error(`INK v1.5.1 readiness failed: ${result.checksPassed}/${result.checksTotal}`);
console.log(`INK v1.5.1 RC Test-Ready: ${result.checksPassed}/${result.checksTotal} checks passed`);
