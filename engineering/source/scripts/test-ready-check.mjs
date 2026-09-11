import { readFile, writeFile, access, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { migrateDocument } from '../src/document/migration.js';
import { inspectDocument } from '../src/document/integrity.js';
import { verifyStorageRecord } from '../src/document/storage.js';

const ROOT=resolve(new URL('..',import.meta.url).pathname);
const checks=[];
const check=(name,passed,details=null)=>{checks.push({name,passed:Boolean(passed),details});if(!passed)throw new Error(`${name}: ${JSON.stringify(details)}`)};
const load=async path=>JSON.parse(await readFile(resolve(ROOT,path),'utf8'));
const versionMeta=await load('VERSION.json').catch(()=>({packageRevision:'P7',coreVersion:'1.5.0'}));

const required=['index-standalone.html','dist/ink.compat.js','scripts/generate-test-fixtures.mjs','TEST_EXECUTION_CHECKLIST.md','BUG_REPORT_TEMPLATE.md','TEST_MATRIX.csv','docs/INK_MASTER_SPEC_v2.5.md',
'test-fixtures/01_blank_a4.ink','test-fixtures/02_creation_outside_artboard.ink','test-fixtures/03_multilayer_poster.ink','test-fixtures/04_natural_media_stress.ink','test-fixtures/05_v082_fixed_migration.ink','test-fixtures/06_v082_infinite_migration.ink','test-fixtures/07_invalid_duplicate_id.ink','test-fixtures/08_storage_recovery_scenario.json','benchmarks/A-vector-flower/artwork-A.ink','benchmarks/B-painted-flower/artwork-B.ink','benchmarks/C-image-translation/front-artwork.ink','benchmarks-program-import/A-vector-script/ink-output.ink','benchmarks-program-import/B-image-program/ink-output.ink','benchmarks-program-import/C-paint-workflow/ink-output.ink','tests/browser-evidence-v1.2.0/browser-smoke-report-v1.2.0.json','reports/external-reference-v1.2.0/delivery-summary.json','reports/external-reference-v1.2.0/gap-repair-before-after.json','reports/external-reference-v1.2.0/capability-maturity-map.json','tests/browser-evidence-v1.3.0/browser-smoke-report-v1.3.0.json','reports/hand-drawing-v1.3.0/delivery-summary.json','reports/hand-drawing-v1.3.0/gap-frequency-ranking.json','reports/hand-drawing-v1.3.0/performance-stress-report.json','benchmarks-hand-drawing-v1.3.0/A-line-flower/A-line-flower.ink','benchmarks-hand-drawing-v1.3.0/B-watercolor-flower/B-watercolor-flower.ink','benchmarks-hand-drawing-v1.3.0/C-oil-like-flower/C-oil-like-flower.ink','device-validation.html','tests/browser-evidence-v1.4.0/browser-smoke-report-v1.4.0.json','tests/browser-evidence-v1.4.0/browser-interactive-performance-report.json','reports/hand-drawing-v1.4.0/delivery-summary.json','reports/hand-drawing-v1.4.0/performance-repair-report.json','reports/hand-drawing-v1.4.0/workflow-reassessment.json','benchmarks-hand-drawing-v1.4.0/A-line-flower/v1.4.0-corrected/A-line-flower.ink','benchmarks-hand-drawing-v1.4.0/B-watercolor-flower/v1.4.0-corrected/B-watercolor-flower.ink','benchmarks-hand-drawing-v1.4.0/C-oil-like-flower/v1.4.0-corrected/C-oil-like-flower.ink'];
for(const file of required)await access(resolve(ROOT,file));
const requiredV150=['src/ai/ai-core.js','src/ai/install-ai.js','src/export/png-worker-encoder.js','schemas/ink-ai-command-v1.schema.json','schemas/ink-ai-capability-manifest-v1.schema.json','schemas/ink-document-state-v1.schema.json','schemas/ink-editable-plan-v1.schema.json','schemas/ink-ai-preview-v1.schema.json','schemas/ink-ai-approval-v1.schema.json','schemas/ink-ai-execution-v1.schema.json','schemas/ink-ai-result-v1.schema.json','schemas/ink-ai-error-v1.schema.json','schemas/ink-ai-audit-v1.schema.json','ai-artwork-v150/AI_Assisted_Camellia_v1.5.0.ink','ai-artwork-v150/AI_Assisted_Camellia_Final.png','ai-artwork-v150/AI_Artwork_Template_v1.json','ai-artwork-v150/variants/Template_Variant_7_Petal.ink','ai-artwork-v150/variants/Template_Variant_12_Petal.ink','tests/browser-evidence-v1.5.0/browser-smoke-report-v1.5.0.json'];
for(const file of requiredV150)await access(resolve(ROOT,file));
check('Test-ready files are present',true,{count:required.length});
check('v1.5 AI command, schema, artwork, template and browser evidence files are present',true,{count:requiredV150.length});

for(const file of required.filter(x=>x.endsWith('.ink')&&!x.includes('invalid'))){const raw=await load(file);const migrated=migrateDocument(raw);const integrity=inspectDocument(migrated);check(`Valid fixture: ${file}`,integrity.passed,integrity.errors);}
const fixed=migrateDocument(await load('test-fixtures/05_v082_fixed_migration.ink'));
check('v0.8.2 fixed migrates to layout',fixed.pages[0].workspace.activeSpace==='layout',fixed.pages[0].workspace);
const infinite=migrateDocument(await load('test-fixtures/06_v082_infinite_migration.ink'));
check('v0.8.2 infinite migrates to creation',infinite.pages[0].workspace.activeSpace==='creation',infinite.pages[0].workspace);
const stress=migrateDocument(await load('test-fixtures/04_natural_media_stress.ink'));
const stressIntegrity=inspectDocument(stress);
check('Natural-media fixture contains at least 18,000 points',stressIntegrity.stats.points>=18000,stressIntegrity.stats);
const invalid=migrateDocument(await load('test-fixtures/07_invalid_duplicate_id.ink'));
const invalidIntegrity=inspectDocument(invalid);
check('Negative fixture is rejected for duplicate IDs',!invalidIntegrity.passed&&invalidIntegrity.errors.some(x=>x.code==='duplicate-id'),invalidIntegrity.errors);
const recovery=await load('test-fixtures/08_storage_recovery_scenario.json');
const current=verifyStorageRecord(recovery.current), previous=verifyStorageRecord(recovery.previous);
check('Recovery scenario rejects current and accepts previous',!current.valid&&previous.valid,{current:current.reason,previous:previous.reason});

const standalone=await readFile(resolve(ROOT,'index-standalone.html'),'utf8');
const bundle=await readFile(resolve(ROOT,'dist/ink.compat.js'),'utf8');
check('Direct HTML entry references compatibility bundle',standalone.includes('dist/ink.compat.js')&&standalone.includes(`INK Core ${versionMeta.coreVersion}`),{entry:'index-standalone.html'});
check('Compatibility bundle contains FLORA WP-3 modules',bundle.includes('FloraCommandDispatcher')&&bundle.includes('compileRegionStrokes')&&bundle.includes('buildAbstractPetalBenchmarkStructure'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains Vector/Image/Recipe cores',bundle.includes('booleanPaths')&&bundle.includes('renderImageStack')&&bundle.includes('RecipeEngine'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains Paint and Automation cores',bundle.includes('StrokeSessionRecorder')&&bundle.includes('BrushPresetRegistry')&&bundle.includes('ExternalAssetAdapterRegistry'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains Universal Program Import cores',bundle.includes('UniversalProgramImporter')&&bundle.includes('ActionRecipeCompiler')&&bundle.includes('GapFrequencyRanking'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains External Reference cores',bundle.includes('ExternalReferenceRunnerRegistry')&&bundle.includes('createReferencePackage')&&bundle.includes('REFERENCE_DECISIONS'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains Unified Stroke, 12 Brush, Workflow Import and Stylus cores',bundle.includes('createUnifiedStroke')&&bundle.includes('compileBrushStroke')&&bundle.includes('importDrawingWorkflow')&&bundle.includes('StylusTestRecorder'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains v1.4 quality, calibration and interactive rendering cores',bundle.includes('PressureCurveEditor')&&bundle.includes('NaturalMediaStateMap')&&bundle.includes('CalibrationProfileStore')&&bundle.includes('BrowserInteractiveBenchmark'),{bytes:Buffer.byteLength(bundle)});
check('Compatibility bundle contains AI Command, State, Semantic, Plan, Preview, Audit, Adapter and Worker cores',bundle.includes('AICommandLayer')&&bundle.includes('DocumentStateReader')&&bundle.includes('SemanticTargetSystem')&&bundle.includes('PlanGenerator')&&bundle.includes('PreviewEngine')&&bundle.includes('AuditLog')&&bundle.includes('ChatIntegrationAdapter')&&bundle.includes('PNGWorkerEncoder'),{bytes:Buffer.byteLength(bundle)});
const packages=await readdir(resolve(ROOT,'reference-packages-v1.2.0'));
check('Twenty traceable Reference Packages are present',packages.filter(name=>/^(VEC|IMG|PNT)-/.test(name)).length===20,{count:packages.length});
const browserReport=await load('tests/browser-evidence-v1.4.0/browser-smoke-report-v1.4.0.json');
check('Chromium browser smoke test completed',browserReport.status==='COMPLETED'&&browserReport.checks.every(item=>item.passed),{checks:browserReport.checks.length,screenshots:browserReport.screenshots.length});
const drawingDelivery=await load('reports/hand-drawing-v1.3.0/delivery-summary.json');
check('Three complete flower benchmarks and ten public workflows are present',drawingDelivery.artworks.length===3&&drawingDelivery.externalWorkflows.total>=10&&drawingDelivery.externalWorkflows.convertedToRecipeAndSession>=5,drawingDelivery);
const v140Delivery=await load('reports/hand-drawing-v1.4.0/delivery-summary.json'),referencePackages=await readdir(resolve(ROOT,'external-reference-packages-v1.4.0')),interactive=await load('tests/browser-evidence-v1.4.0/browser-interactive-performance-report.json');
check('Three corrected benchmarks preserve v1.3 baselines and deterministic local replay',v140Delivery.benchmarks.length===3&&v140Delivery.benchmarks.every(item=>item.deterministic&&item.localReplayOnly&&item.rollback),v140Delivery.benchmarks);
check('Six categorized external workflow Reference Packages are present',referencePackages.length===6&&v140Delivery.referencePackages.filter(item=>item.category==='LINE').length===2&&v140Delivery.referencePackages.filter(item=>item.category==='WATERCOLOR').length===2&&v140Delivery.referencePackages.filter(item=>item.category==='OIL_IMPASTO').length===2,{count:referencePackages.length});
check('Interactive Canvas benchmark rendered 1K, 10K and chunked 100K without crash',interactive.executedInBrowser&&interactive.cases.length===3&&interactive.cases[2].strokes===100000&&interactive.cases[2].viewportOnly&&interactive.cases.every(item=>!item.crash),interactive.cases);
check('HP x360 and professional artwork decisions remain manual',v140Delivery.decision==='VALIDATION REQUIRED'&&v140Delivery.manual.length>=4,v140Delivery.manual);
check('Direct HTML runtime does not require HTTP startup',!standalone.includes('http://127.0.0.1:4173')&&!standalone.includes('localhost:4173'),{runtime:'file://'});
const browserV150=await load('tests/browser-evidence-v1.5.0/browser-smoke-report-v1.5.0.json'),artworkQa=await load('ai-artwork-v150/qa-report.json'),pngWorker=await load('ai-artwork-v150/png-worker-export-report.json'),template=await load('ai-artwork-v150/AI_Artwork_Template_v1.json');
check('v1.5 Chromium AI Command, permission, Preview, selective edit, sandbox and performance checks completed',browserV150.status==='COMPLETED'&&browserV150.checks.every(item=>item.passed),{checks:browserV150.checks.length,screenshots:browserV150.screenshots.length});
check('Complete AI-assisted flower workflow contains all required reversible edit stages',artworkQa.automated.blankDocumentStart&&artworkQa.automated.localRedraw&&artworkQa.automated.recolor&&artworkQa.automated.replaceBrush&&artworkQa.automated.rollback&&artworkQa.automated.partialReplay&&artworkQa.automated.variants>=2,artworkQa.automated);
check('300 PPI PNG uses Worker Offscreen encoding without long main-thread block',pngWorker.report.method==='WORKER_OFFSCREEN'&&!pngWorker.report.mainThreadEncoding&&pngWorker.longestMainThreadBlockMs<1000&&pngWorker.report.resourcesReleased,pngWorker);
check('Reusable AI Artwork Template exposes editable parameters and protected approval rules',template.parameters.petalCount&&template.parameters.mainColor&&template.parameters.brushSet&&template.previewRules.required&&template.approvalRules.executeRequiresExplicitApproval,template.parameters);
check('Physical stylus, subjective art quality and final approval remain user decisions',artworkQa.decision==='VALIDATION REQUIRED'&&artworkQa.manual.physicalStylus==='USER VALIDATION REQUIRED'&&artworkQa.manual.professionalArtQuality==='USER VALIDATION REQUIRED',artworkQa.manual);

const result={schema:'INK_TEST_READY_REPORT_V1',version:versionMeta.coreVersion,packageRevision:versionMeta.packageRevision||'P3',passed:checks.every(x=>x.passed),checksPassed:checks.filter(x=>x.passed).length,checksTotal:checks.length,checks};
await writeFile(resolve(ROOT,'tests/test-ready-report-v1.5.0.json'),JSON.stringify(result,null,2)+'\n');
console.log(`INK v${versionMeta.coreVersion} Test-Ready: ${result.checksPassed}/${result.checksTotal} checks passed`);
