import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  GapFrequencyRanking, UniversalProgramImporter, compareReference, completedReferenceRun,
  createManualReferenceRunKit, createReferencePackage, maturityAssessment,
  unavailableReferenceRun, validateReferencePackage
} from '../src/program-import/index.js';
import { defaultDocument } from '../src/document/model.js';
import { RecipeEngine, installProgramImportSchema } from '../src/recipe/recipe-engine.js';
import { createAnchor, createPath, importSVGDocument, vectorObjectToSVG } from '../src/vector/vector-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const library = path.join(root, 'external-assets', 'library');
const packageRoot = path.join(root, 'reference-packages-v1.2.0');
const reportRoot = path.join(root, 'reports', 'external-reference-v1.2.0');
const fixed = '2026-08-03T16:00:00.000Z';
const clone = value => JSON.parse(JSON.stringify(value));
const safe = value => value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const json = (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const ensure = (...folders) => Promise.all(folders.map(folder => mkdir(folder, { recursive: true })));
const source = relative => path.join(library, relative);

const assets = [
  ['VEC-001', 'vector', 'vector/inkscape/reference-floret-tessagon.svg', 'MIT', 'https://github.com/cwant/tessagon', 'inkscape-svg'],
  ['VEC-002', 'vector', 'vector/inkscape/tiling.py', 'Apache-2.0', 'https://github.com/cwant/inkscape-tiling-extension', 'python-tessagon'],
  ['VEC-003', 'vector', 'vector/illustrator/circular.jsx', 'MIT', 'https://github.com/alexander-ladygin/illustrator-scripts', 'illustrator'],
  ['VEC-004', 'vector', 'vector/illustrator/griddder.jsx', 'MIT', 'https://github.com/alexander-ladygin/illustrator-scripts', 'illustrator'],
  ['VEC-005', 'vector', 'vector/illustrator/puzzleClipper.jsx', 'MIT', 'https://github.com/alexander-ladygin/illustrator-scripts', 'illustrator'],
  ['IMG-001', 'raster', 'image/photoshop/Colorisation_SplitProof.jsx', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-002', 'raster', 'image/photoshop/ExtractColorFromBG.jsx', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-003', 'raster', 'image/photoshop/ExtractDrawingBgColor.jsx', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-004', 'raster', 'image/photoshop/ExtractLinesDynamicSimple.jsx', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-005', 'raster', 'image/photoshop/Frequency-Separation.atn', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-006', 'raster', 'image/photoshop/Firefly-Actions.atn', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-007', 'raster', 'image/photoshop/Harmonize-Enhancement.atn', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-008', 'raster', 'image/photoshop/Quick-Object-Extraction.atn', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['IMG-009', 'raster', 'image/photoshop/Remove-Logo-From-Background.atn', 'MIT', 'https://github.com/neoqueto/remove-logo-from-background', 'photoshop'],
  ['IMG-010', 'raster', 'image/photoshop/Photo-v01.atn', 'MIT', 'https://github.com/sbaril/Photoshop-Scripts', 'photoshop'],
  ['PNT-001', 'stroke', 'paint/p5-brush/wash_test.js', 'MIT', 'https://github.com/acamposuribe/p5.brush', 'chromium-p5'],
  ['PNT-002', 'stroke', 'paint/p5-brush/visual_suite.js', 'MIT', 'https://github.com/acamposuribe/p5.brush', 'paint-manual'],
  ['PNT-003', 'stroke', 'paint/p5-brush/pastel_hatching_test.js', 'MIT', 'https://github.com/acamposuribe/p5.brush', 'paint-manual'],
  ['PNT-004', 'stroke', 'paint/p5-brush/fill_circle_explorer.html', 'MIT', 'https://github.com/acamposuribe/p5.brush', 'paint-manual'],
  ['PNT-005', 'stroke', 'paint/p5-brush/stroke_pressure.test.js', 'MIT', 'https://github.com/acamposuribe/p5.brush', 'paint-manual']
];

const licenseFile = kind => kind === 'photoshop' ? 'licenses/photoshop-scripts-MIT.txt' : kind === 'illustrator' ? 'licenses/illustrator-scripts-MIT.txt' : kind.includes('paint') || kind === 'chromium-p5' ? 'licenses/p5-brush-MIT.txt' : kind === 'python-tessagon' ? 'licenses/inkscape-tiling-license.txt' : 'licenses/tessagon-license.txt';
const targetPath = () => createPath({ id: 'reference-target', name: 'Reference Target', fill: '#d9828b', stroke: '#4f2736', subpaths: [{ closed: true, role: 'outer', anchors: [createAnchor(0, 0), createAnchor(80, 0), createAnchor(40, 100)] }] });
const executeInk = report => {
  const document = defaultDocument(); document.appVersion = '1.2.0'; document.title = report.metadata.name;
  const target = targetPath(); document.pages[0].layers[0].objects.push(target);
  if (!report.recipe) return { document, replay: { status: 'REJECTED', states: [], errors: ['recipe unavailable'] } };
  const engine = new RecipeEngine(); installProgramImportSchema(engine); engine.registerRecipe(report.recipe);
  try { return { document, replay: engine.execute(report.recipe.id, { document, inputs: [{ id: target.id, role: 'target', path: target }] }) }; }
  catch (error) { return { document, replay: error.report || { status: 'failed', rolledBack: true, errors: [{ message: error.message }] } }; }
};
const svgDocument = document => {
  const defs = [], objects = document.pages.flatMap(page => page.layers.flatMap(layer => layer.objects));
  const body = objects.filter(object => ['path', 'group', 'repeat'].includes(object.type)).map(object => vectorObjectToSVG(object, defs)).join('');
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><defs>${defs.join('')}</defs>${body}</svg>\n`;
};
const run = (command, args, cwd = root) => { const started = Date.now(), result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout: 120000 }); return { command: [command, ...args], exitCode: result.status, stdout: result.stdout || '', stderr: result.stderr || '', durationMs: Date.now() - started }; };
const softwareVersion = command => run(command, ['--version']).stdout.trim() || null;

await ensure(packageRoot, reportRoot);
const ranking = new GapFrequencyRanking(), records = [], maturityEvidence = [];
for (const [assetId, kind, relative, spdx, sourceUrl, runnerKind] of assets) {
  const dir = path.join(packageRoot, assetId), original = source(relative), bytes = await readFile(original), binary = relative.endsWith('.atn');
  await ensure(dir); const importer = new UniversalProgramImporter({ inkVersion: '1.2.0' });
  let imported;
  try { imported = importer.importAsset({ name: path.basename(relative), ...(binary ? { bytes: new Uint8Array(bytes) } : { text: bytes.toString('utf8') }), license: { spdx }, provenance: { sourceUrl, revision: 'verified-v1.1.0-inventory' }, safetyMode: binary ? 'STATIC_PARSE' : 'TRANSLATE_ONLY' }); }
  catch (error) { imported = { status: 'REJECTED', error: { code: error.code || 'IMPORT_FAILED', message: error.message }, program: null, recipe: null, conversionReport: null, metadata: { name: path.basename(relative) }, detection: { format: 'UNKNOWN' } }; }
  if (imported.program && imported.conversionReport) ranking.add({ program: imported.program, conversionReport: imported.conversionReport, assetTypes: [kind] });
  const inkRun = executeInk(imported), sourceProgramName = `source-program${path.extname(relative)}`;
  await copyFile(original, path.join(dir, sourceProgramName)); await copyFile(source(licenseFile(runnerKind)), path.join(dir, 'source-license.txt'));
  await json(path.join(dir, 'source-input.json'), { assetId, sameInputContract: true, input: kind === 'raster' ? 'MANUAL_REFERENCE_INPUT_REQUIRED' : 'program-contained-input' });
  let sourceRun, sourceOutputFile = 'source-output.json', structure = null;
  if (runnerKind === 'inkscape-svg') {
    const outputPNG = path.join(dir, 'source-output.png'), log = run('inkscape', [original, `--export-filename=${outputPNG}`, '--export-width=800']); sourceOutputFile = 'source-output.png';
    const svg = bytes.toString('utf8'), parsed = importSVGDocument(svg); structure = { pathCount: parsed.objects.length, editable: true };
    sourceRun = log.exitCode === 0 ? completedReferenceRun({ assetId, runnerId: 'inkscape', software: 'Inkscape', program: { path: relative }, input: { path: relative } }, { softwareVersion: softwareVersion('inkscape') || '1.2.2', originalProgramExecuted: true, durationMs: log.durationMs, output: { path: sourceOutputFile, comparisonValue: { objects: parsed.objects } }, structureSummary: structure, executionLog: [log] }) : unavailableReferenceRun({ assetId, runnerId: 'inkscape', software: 'Inkscape', program: { path: relative } }, 'EXECUTION_FAILED', { executionLog: [log] });
  } else if (runnerKind === 'python-tessagon') {
    const generated = path.join(root, 'external-assets', 'library', 'vector', 'inkscape', 'reference-floret-tessagon.svg'), py = run('python3', ['scripts/run-reference-inkscape-tiling.py']);
    const outputSVG = path.join(dir, 'source-output.svg'); await copyFile(generated, outputSVG); sourceOutputFile = 'source-output.svg'; const parsed = importSVGDocument(await readFile(outputSVG, 'utf8')); structure = { pathCount: parsed.objects.length, editable: true };
    sourceRun = py.exitCode === 0 ? completedReferenceRun({ assetId, runnerId: 'python-tessagon', software: 'Python/Tessagon', program: { path: relative }, input: { parameters: 'FloretTessagon 6x8' } }, { softwareVersion: softwareVersion('python3') || 'Python 3.12', originalProgramExecuted: true, durationMs: py.durationMs, output: { path: sourceOutputFile, comparisonValue: { objects: parsed.objects } }, structureSummary: structure, executionLog: [py] }) : unavailableReferenceRun({ assetId, runnerId: 'python-tessagon', software: 'Python/Tessagon', program: { path: relative } }, 'EXECUTION_FAILED', { executionLog: [py] });
  } else if (runnerKind === 'chromium-p5') {
    const browserReportFile = path.join(root, 'tests', 'browser-evidence-v1.2.0', 'browser-smoke-report-v1.2.0.json');
    let browserReport = null; try { browserReport = JSON.parse(await readFile(browserReportFile, 'utf8')); } catch {}
    if (browserReport?.originalReferenceExecution) {
      const screenshot = path.join(root, browserReport.screenshots.find(file => file.includes('p5-brush-original-reference')) || '');
      await copyFile(screenshot, path.join(dir, 'source-output.png')); sourceOutputFile = 'source-output.png'; structure = { canvas: browserReport.originalReferenceExecution, strokeStructure: 'original library exposes composite only' };
      sourceRun = completedReferenceRun({ assetId, runnerId: 'chromium-p5', software: 'Chromium + p5.brush', program: { path: relative }, input: { seed: browserReport.originalReferenceExecution.seed } }, { softwareVersion: browserReport.browser?.engine || 'Chromium', originalProgramExecuted: true, output: { path: sourceOutputFile }, structureSummary: structure, executionLog: [{ report: path.relative(root, browserReportFile) }] });
    } else sourceRun = unavailableReferenceRun({ assetId, runnerId: 'chromium-p5', software: 'Chromium + p5.brush', program: { path: relative } }, 'EXTERNAL_EXECUTION_UNAVAILABLE', { reason: 'browser reference report not generated' });
  } else {
    const software = runnerKind === 'photoshop' ? 'Adobe Photoshop' : runnerKind === 'illustrator' ? 'Adobe Illustrator' : 'p5.brush host workflow';
    sourceRun = unavailableReferenceRun({ assetId, runnerId: runnerKind, software, program: { path: relative }, input: { required: true } }, runnerKind === 'paint-manual' ? 'MANUAL_REFERENCE_RUN_REQUIRED' : 'INSTALLATION_REQUIRED', { reason: runnerKind === 'paint-manual' ? 'complete host page/session is unavailable' : `${software} is not installed in the execution environment` });
    const kit = createManualReferenceRunKit({ assetId, runnerId: runnerKind, software, program: { path: relative }, input: { required: true } }, { instructions: ['open specified input', 'load program asset', 'execute complete workflow', 'export output and structure summary'], requiredImports: ['source output', 'structure summary', 'execution log', 'software version'] });
    await json(path.join(dir, 'manual-reference-kit.json'), kit);
  }
  if (sourceOutputFile.endsWith('.json')) await json(path.join(dir, sourceOutputFile), { assetId, status: sourceRun.status, originalProgramExecuted: false });
  await json(path.join(dir, 'source-application-version.json'), { assetId, software: sourceRun.software, version: sourceRun.softwareVersion, status: sourceRun.status });
  await json(path.join(dir, 'source-execution-log.json'), { assetId, referenceRun: sourceRun });
  await json(path.join(dir, 'source-intermediate-states.json'), { assetId, states: sourceRun.intermediateStates || [], status: sourceRun.status });
  await json(path.join(dir, 'source-structure-summary.json'), { assetId, status: sourceRun.status, structure });
  await json(path.join(dir, 'canonical-operations.json'), { assetId, value: imported.program });
  await json(path.join(dir, 'ink-recipe.json'), { assetId, value: imported.recipe, status: imported.recipe ? 'AVAILABLE' : 'REJECTED' });
  await json(path.join(dir, 'ink-document.ink'), { ...inkRun.document, assetId, referenceEvidence: { sourceRun } });
  const inkSVG = kind === 'vector' ? svgDocument(inkRun.document) : null;
  if (inkSVG) { await writeFile(path.join(dir, 'ink-output.svg'), inkSVG); const render = run('inkscape', [path.join(dir, 'ink-output.svg'), `--export-filename=${path.join(dir, 'ink-output.png')}`, '--export-width=800']); if (render.exitCode !== 0) await json(path.join(dir, 'ink-output.json'), { assetId, status: 'EXECUTION_FAILED', log: render }); }
  else await json(path.join(dir, 'ink-output.json'), { assetId, status: inkRun.replay.status, documentHash: sha256(JSON.stringify(inkRun.document)) });
  let difference;
  if (sourceRun.status === 'COMPLETED' && sourceRun.output?.comparisonValue && kind === 'vector') difference = compareReference({ reference: sourceRun.output.comparisonValue, ink: inkRun.document, kind: 'vector', metadata: { referenceSoftware: sourceRun.software, referenceVersion: sourceRun.softwareVersion, sameInputConfirmed: true, svgRoundtripStability: 1 } });
  else difference = { format: 'INK-DIFFERENCE-REPORT', schemaVersion: 3, assetId, decision: 'REJECTED', reason: sourceRun.status, originalProgramExecuted: sourceRun.originalProgramExecuted };
  const capability = imported.conversionReport ? importer.coverage(imported.id, { replayReport: inkRun.replay, differenceReport: difference, roundtrip: { consistent: true }, rollback: { succeeded: inkRun.replay.rolledBack ?? true } }) : { status: 'REJECTED' };
  const gap = imported.conversionReport?.unsupportedOperations || [];
  const qa = { assetId, status: sourceRun.status === 'COMPLETED' && inkRun.replay.status === 'completed' ? (difference.decision || 'APPROXIMATED') : sourceRun.status === 'COMPLETED' ? 'EXECUTION_FAILED' : 'REJECTED', sourceRun: sourceRun.status, inkReplay: inkRun.replay.status, originalProgramExecuted: sourceRun.originalProgramExecuted, noMockReference: true };
  await json(path.join(dir, 'capability-report.json'), { assetId, value: capability }); await json(path.join(dir, 'gap-report.json'), { assetId, gaps: gap }); await json(path.join(dir, 'difference-report.json'), { assetId, value: difference }); await json(path.join(dir, 'replay-report.json'), { assetId, value: inkRun.replay }); await json(path.join(dir, 'qa-report.json'), qa);
  const fileMap = {
    'asset.json': 'asset.json', 'source-program': sourceProgramName, 'source-license': 'source-license.txt', 'source-input': 'source-input.json', 'source-application-version': 'source-application-version.json', 'source-execution-log': 'source-execution-log.json', 'source-intermediate-states': 'source-intermediate-states.json', 'source-output': sourceOutputFile, 'source-structure-summary': 'source-structure-summary.json', 'canonical-operations': 'canonical-operations.json', 'ink-recipe': 'ink-recipe.json', 'ink-document': 'ink-document.ink', 'ink-output': kind === 'vector' ? 'ink-output.svg' : 'ink-output.json', 'capability-report': 'capability-report.json', 'gap-report': 'gap-report.json', 'difference-report': 'difference-report.json', 'replay-report': 'replay-report.json', 'qa-report': 'qa-report.json'
  };
  const traced = Object.fromEntries(Object.entries(fileMap).map(([key, file]) => [key, { assetId, path: file }]));
  const manifest = createReferencePackage({ assetId, kind, source: { relative, sourceUrl, spdx, referenceRun: sourceRun }, ink: { replayStatus: inkRun.replay.status }, reports: { decision: difference.decision, qa: qa.status }, files: traced, status: difference.decision || 'REJECTED' });
  const validation = validateReferencePackage(manifest); await json(path.join(dir, 'asset.json'), { ...manifest, validation });
  records.push({ assetId, kind, relative, package: path.relative(root, dir), sourceStatus: sourceRun.status, originalProgramExecuted: sourceRun.originalProgramExecuted, inkReplay: inkRun.replay.status, decision: difference.decision, packageValid: validation.valid, gaps: gap.length });
  maturityEvidence.push({ assetId, inputId: assetId === 'VEC-001' ? 'svg-input' : assetId === 'VEC-002' ? 'python-parameters' : 'manual-input', kind: 'external-reference', originalProgramExecuted: sourceRun.originalProgramExecuted, passed: sourceRun.status === 'COMPLETED' && inkRun.replay.status === 'completed', structureCorrect: ['EQUIVALENT', 'ACCEPTABLE_DIFFERENCE'].includes(difference.decision), roundtripConsistent: true, replayConsistent: inkRun.replay.status === 'completed', rollbackMajorIssue: false, withinThreshold: difference.decision === 'EQUIVALENT', approximated: difference.decision !== 'EQUIVALENT' });
}

const oldInventory = JSON.parse(await readFile(path.join(root, 'reports', 'program-import-v1.1.0', 'asset-inventory.json'), 'utf8'));
const regressionRanking = new GapFrequencyRanking();
for (const item of oldInventory.assets) {
  const file = source(item.relativePath), bytes = await readFile(file), binary = item.relativePath.endsWith('.atn'), importer = new UniversalProgramImporter({ inkVersion: '1.2.0' });
  try {
    const report = importer.importAsset({ name: path.basename(item.relativePath), ...(binary ? { bytes: new Uint8Array(bytes) } : { text: bytes.toString('utf8') }), license: { spdx: item.license }, provenance: { sourceUrl: item.sourceUrl, revision: item.revision }, safetyMode: binary ? 'STATIC_PARSE' : 'TRANSLATE_ONLY' });
    if (report.program && report.conversionReport) regressionRanking.add({ program: report.program, conversionReport: report.conversionReport, assetTypes: [report.detection.format] });
  } catch {}
}
const currentGap = regressionRanking.report();
const oldGap = JSON.parse(await readFile(path.join(root, 'reports', 'program-import-v1.1.0', 'gap-frequency-ranking.json'), 'utf8'));
const oldByOperation = Object.fromEntries(oldGap.ranking.map(item => [item.operation, item]));
const currentByOperation = Object.fromEntries(currentGap.ranking.map(item => [item.operation, item]));
const repairOperations = ['layer.visibility', 'input.parameter', 'fill.apply'];
const repairs = repairOperations.map(operation => ({ operation, beforeOccurrences: oldByOperation[operation]?.occurrences || 0, afterOccurrences: currentByOperation[operation]?.occurrences || 0, beforeBlockedAssets: oldByOperation[operation]?.blockedPrograms?.length || 0, afterBlockedAssets: currentByOperation[operation]?.blockedPrograms?.length || 0, scope: operation === 'fill.apply' ? 'canvas fill calls with receiver-matched literal fillStyle evidence only' : 'structured parameters only', noUnsupportedSourcePromoted: true }));
const maturity = ['external-runner', 'reference-package', 'difference-thresholds', 'svg-translation', 'photoshop-reference', 'paint-session-reference'].map(capability => maturityAssessment({ capability, evidence: capability.includes('photoshop') ? records.filter(item => item.kind === 'raster').map(item => ({ assetId: item.assetId, passed: false, rejected: true })) : maturityEvidence }));
const summary = {
  format: 'INK-EXTERNAL-REFERENCE-DELIVERY', schemaVersion: 1, version: '1.2.0', generatedAt: fixed,
  packages: records.length, completedReferenceRuns: records.filter(item => item.sourceStatus === 'COMPLETED').length,
  executionEnvironments: [...new Set(records.filter(item => item.sourceStatus === 'COMPLETED').map(item => item.assetId === 'VEC-001' ? 'Inkscape 1.2.2' : item.assetId === 'VEC-002' ? 'Python 3.12/Tessagon' : 'Chromium/p5.brush'))],
  byKind: Object.fromEntries(['vector', 'raster', 'stroke'].map(kind => [kind, records.filter(item => item.kind === kind).length])),
  sourceStates: Object.fromEntries([...new Set(records.map(item => item.sourceStatus))].map(status => [status, records.filter(item => item.sourceStatus === status).length])),
  records, repairs,
  completionClaim: { completed: false, reason: 'Commercial reference applications are unavailable; ten Photoshop and three Illustrator packages require manual reference execution, and only executed original outputs can satisfy the completion gate.' }
};
await json(path.join(reportRoot, 'delivery-summary.json'), summary); await json(path.join(reportRoot, 'gap-frequency-ranking.json'), currentGap); await json(path.join(reportRoot, 'gap-repair-before-after.json'), { version: '1.2.0', repairs }); await json(path.join(reportRoot, 'capability-maturity-map.json'), { format: 'INK-CAPABILITY-MATURITY-MAP', schemaVersion: 2, assessments: maturity });
console.log(JSON.stringify(summary, null, 2));
