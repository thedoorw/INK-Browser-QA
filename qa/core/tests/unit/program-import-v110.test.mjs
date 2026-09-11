import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {
  ActionRecipeCompiler, GapFrequencyRanking, UniversalProgramImporter,
  canonicalOperation, capabilityCoverage, compareReference, detectFormat,
  maturityAssessment, scanSecurity, validateCanonicalOperation
} from '../../src/program-import/index.js';
import { RecipeEngine, installProgramImportSchema } from '../../src/recipe/recipe-engine.js';
import { createAnchor, createPath } from '../../src/vector/vector-core.js';
import { defaultDocument } from '../../src/document/model.js';
import { migrateDocument } from '../../src/document/migration.js';

const ROOT = process.cwd();
const asset = relative => path.join(ROOT, 'external-assets', 'library', relative);
const textAsset = relative => fs.readFileSync(asset(relative), 'utf8');
const byteAsset = relative => new Uint8Array(fs.readFileSync(asset(relative)));
const provenance = sourceUrl => ({ sourceUrl, revision: 'verified-test-revision' });
const MIT = { spdx: 'MIT' };

const makeTarget = (id = 'target-path') => createPath({ id, name: id, subpaths: [{ closed: true, role: 'outer', anchors: [createAnchor(0, 0), createAnchor(60, 0), createAnchor(30, 90)] }] });
const makeDocument = target => {
  const document = defaultDocument();
  document.pages[0].layers[0].objects.push(target);
  return document;
};
const engineFor = () => { const engine = new RecipeEngine(); installProgramImportSchema(engine); return engine; };

test('format detector identifies real JSX, Python, SVG, JSON, and binary ATN assets', () => {
  const jsx = textAsset('vector/illustrator/circular.jsx');
  const python = textAsset('vector/inkscape/tiling.py');
  const svg = textAsset('vector/inkscape/reference-floret-tessagon.svg');
  const json = textAsset('image/json-workflows/stroke_example.json');
  const atn = byteAsset('image/photoshop/Frequency-Separation.atn');
  assert.equal(detectFormat({ name: 'circular.jsx', text: jsx }).format, 'ILLUSTRATOR_JSX');
  assert.equal(detectFormat({ name: 'tiling.py', text: python }).format, 'INKSCAPE_PYTHON_EXTENSION');
  assert.equal(detectFormat({ name: 'reference.svg', text: svg }).format, 'SVG_EXTENSION');
  assert.equal(detectFormat({ name: 'workflow.json', text: json }).format, 'JSON_PROGRAM');
  assert.equal(detectFormat({ name: 'frequency.atn', bytes: atn }).format, 'PHOTOSHOP_ACTION');
});

test('malformed assets reject without a document target or pollution', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'broken.json', text: '{"steps":[', license: MIT, provenance: provenance('https://example.invalid/broken'), safetyMode: 'TRANSLATE_ONLY' });
  assert.equal(report.status, 'REJECTED');
  assert.equal(report.error.code, 'MALFORMED_ASSET');
  assert.equal(report.documentPolluted, false);
  assert.equal(report.rollback.succeeded, true);
});

test('security scanner rejects shell, undeclared network, filesystem write, dynamic code, and unknown license', () => {
  const report = scanSecurity({ text: 'child_process.execSync("cmd.exe"); fetch("https://bad.invalid"); writeFile("x", "y"); eval(payload);', license: {}, provenance: {} });
  assert.equal(report.status, 'REJECTED');
  for (const rule of ['SHELL', 'NETWORK', 'FILESYSTEM_WRITE', 'DYNAMIC_DOWNLOAD', 'LICENSE_UNCONFIRMED', 'SOURCE_UNCONFIRMED']) assert.ok(report.blockedBy.includes(rule));
  assert.equal(report.directExecutionAllowed, false);
});

test('real Inkscape Python dependency and version scanners preserve evidence', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'tiling.py', text: textAsset('vector/inkscape/tiling.py'), license: MIT, provenance: provenance('https://github.com/cwant/inkscape-tiling-extension'), safetyMode: 'STATIC_PARSE' });
  assert.equal(report.detection.format, 'INKSCAPE_PYTHON_EXTENSION');
  assert.ok(report.dependencies.dependencies.some(item => item.name === 'inkex'));
  assert.ok(report.dependencies.dependencies.some(item => item.name === 'tessagon'));
  assert.equal(report.versions.inkImporterVersion, '1.5.0');
});

test('canonical operation schema requires evidence, mapping, status, state, and confidence', () => {
  const operation = canonicalOperation({ sourceSoftware: 'Inkscape', sourceCommand: 'create_mesh()', canonicalOperation: 'path.createMesh', category: 'Path', target: { kind: 'path' }, inputState: {}, parameters: { tiles: 12 }, dependencies: ['tessagon'], expectedStateChange: { paths: 12 }, outputState: {}, inkCapabilityMapping: 'path.create', fallbackCandidate: null, confidence: 0.8, evidence: [{ line: 1 }], conversionStatus: 'EQUIVALENT' });
  assert.equal(validateCanonicalOperation(operation).valid, true);
  assert.equal(operation.deterministic, true);
  assert.equal(operation.category, 'Path');
});

test('complex real SVG compiles to INK Recipe and executes editable paths', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'reference-floret-tessagon.svg', text: textAsset('vector/inkscape/reference-floret-tessagon.svg'), license: MIT, provenance: provenance('https://github.com/cwant/tessagon'), safetyMode: 'TRANSLATE_ONLY' });
  assert.ok(report.program.operations.length >= 50);
  assert.ok(report.recipe.steps.some(step => step.op === 'path'));
  assert.equal(report.conversionReport.compileStatus, 'COMPLETE');
  const document = defaultDocument(), engine = engineFor();
  engine.registerRecipe(report.recipe);
  const replay = engine.execute(report.recipe.id, { document, inputs: [] });
  assert.equal(replay.status, 'completed');
  const descend = objects => objects.flatMap(object => [object, ...(object.type === 'group' ? descend(object.children) : [])]);
  const importedObjects = descend(document.pages[0].layers[0].objects), importedPaths = importedObjects.filter(object => object.type === 'path');
  assert.ok(importedPaths.length >= 50);
  assert.ok(importedPaths.every(object => object.subpaths[0].anchors.length >= 3));
});

test('real Illustrator radial script translates safe creative subset and keeps security/parameter gaps explicit', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'circular.jsx', text: textAsset('vector/illustrator/circular.jsx'), license: MIT, provenance: provenance('https://github.com/alexander-ladygin/illustrator-scripts'), safetyMode: 'TRANSLATE_ONLY' });
  assert.equal(report.detection.format, 'ILLUSTRATOR_JSX');
  assert.ok(report.recipe.steps.some(step => step.op === 'repeat' && step.params.mode === 'radial'));
  assert.ok(report.unsupportedOperations.length > 0);
  assert.notEqual(report.status, 'COMPILED');
  assert.ok(report.conversionReport.statusCounts.PARTIAL > 0);
});

test('opaque real Photoshop ATN is metadata-readable but formally rejected for translation', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'Frequency-Separation.atn', bytes: byteAsset('image/photoshop/Frequency-Separation.atn'), license: MIT, provenance: provenance('https://github.com/sbaril/Photoshop-Scripts'), safetyMode: 'STATIC_PARSE' });
  assert.equal(report.detection.format, 'PHOTOSHOP_ACTION');
  assert.equal(report.originalSourceExecuted, false);
  assert.ok(report.program.warnings.some(warning => /opaque binary/i.test(warning)));
  assert.ok(report.program.operations.every(operation => operation.conversionStatus === 'REJECTED'));
});

test('real Photoshop JSX and ComfyUI JSON expose layer/selection/adjustment/blend operations without claiming full compatibility', () => {
  const importer = new UniversalProgramImporter();
  const jsx = importer.importAsset({ name: 'ExtractColorFromBG.jsx', text: textAsset('image/photoshop/ExtractColorFromBG.jsx'), license: MIT, provenance: provenance('https://github.com/sbaril/Photoshop-Scripts'), safetyMode: 'TRANSLATE_ONLY' });
  const json = importer.importAsset({ name: 'auto_adjust_v2_example.json', text: textAsset('image/json-workflows/auto_adjust_v2_example.json'), license: MIT, provenance: provenance('https://github.com/chflame163/ComfyUI_LayerStyle'), safetyMode: 'TRANSLATE_ONLY' });
  assert.ok(jsx.program.operations.some(operation => operation.canonicalOperation === 'adjustment.levels'));
  assert.ok(jsx.program.operations.some(operation => operation.category === 'Selection'));
  assert.ok(json.program.operations.some(operation => operation.category === 'Adjustment'));
  assert.ok(json.program.operations.some(operation => operation.canonicalOperation === 'import.raster'));
  assert.notEqual(jsx.conversionReport.compileStatus, 'COMPLETE');
  assert.notEqual(json.conversionReport.compileStatus, 'COMPLETE');
});

test('failed imported Recipe execution restores complete document state', () => {
  const target = makeTarget(), document = makeDocument(target), before = JSON.stringify(document), engine = engineFor();
  const recipe = { format: 'INK-RECIPE', schemaVersion: 3, id: 'rollback-test', name: 'Rollback Test', version: 1, roleSchema: 'ink.import.target.v1', steps: [{ id: 'bad-transform', op: 'transform', role: 'target', params: { action: 'missing' } }] };
  engine.registerRecipe(recipe);
  assert.throws(() => engine.execute(recipe.id, { document, inputs: [{ id: target.id, role: 'target', path: target }] }), /INK_TRANSFORM_PARAMETERS_REQUIRED/);
  assert.equal(JSON.stringify(document), before);
  assert.equal(engine.replayReport().rolledBack, true);
});

test('compiled radial script replays deterministically on two structurally different targets', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'circular.jsx', text: textAsset('vector/illustrator/circular.jsx'), license: MIT, provenance: provenance('https://github.com/alexander-ladygin/illustrator-scripts'), safetyMode: 'TRANSLATE_ONLY' });
  const radialOnly = { ...report.recipe, id: 'circular-safe-radial', steps: report.recipe.steps.filter(step => step.op === 'repeat' || step.op === 'checkpoint') };
  const run = target => { const document = makeDocument(target), engine = engineFor(); engine.registerRecipe(radialOnly); const replay = engine.execute(radialOnly.id, { document, inputs: [{ id: target.id, role: 'target', path: target }] }); return { document, replay }; };
  const first = run(makeTarget('triangle'));
  const secondTarget = createPath({ id: 'quad', subpaths: [{ closed: true, anchors: [createAnchor(0, 0), createAnchor(80, 0), createAnchor(80, 40), createAnchor(0, 40)] }] });
  const second = run(secondTarget);
  assert.equal(first.replay.status, 'completed');
  assert.equal(second.replay.status, 'completed');
  assert.equal(first.document.pages[0].layers[0].objects.at(-1).mode, 'radial');
  assert.equal(second.document.pages[0].layers[0].objects.at(-1).mode, 'radial');
  const again = run(makeTarget('triangle'));
  assert.equal(first.replay.result.deterministicKey, again.replay.result.deterministicKey);
});

test('.ink migration roundtrip retains import, license, security, canonical, and conversion reports', () => {
  const importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'reference-floret-tessagon.svg', text: textAsset('vector/inkscape/reference-floret-tessagon.svg'), license: MIT, provenance: provenance('https://github.com/cwant/tessagon'), safetyMode: 'TRANSLATE_ONLY' });
  const document = defaultDocument();
  importer.attachToDocument(report.id, document);
  const reopened = migrateDocument(JSON.parse(JSON.stringify(document)));
  assert.equal(reopened.programAssets.length, 1);
  assert.equal(reopened.programAssets[0].license.spdx, 'MIT');
  assert.equal(reopened.programAssets[0].program.format, 'INK-CANONICAL-PROGRAM');
  assert.equal(reopened.programAssets[0].conversionReport.format, 'INK-CONVERSION-REPORT');
});

test('coverage report does not hide critical gaps behind one percentage', () => {
  const operation = canonicalOperation({ operationId: 'mask-gap', sourceSoftware: 'Photoshop', sourceCommand: 'mask', canonicalOperation: 'vendor.mask', category: 'Mask', inkCapabilityMapping: null, confidence: 0.4, evidence: [{ line: 1 }], unsupportedReason: 'descriptor missing', conversionStatus: 'PARTIAL' });
  const program = { id: 'critical-program', operations: [operation] };
  const conversionReport = { normalizedOperations: [{ operationId: 'mask-gap', status: 'PARTIAL' }], unsupportedOperations: [{ operationId: 'mask-gap', canonicalOperation: 'vendor.mask', status: 'PARTIAL', gapCategory: 'PARAMETER_MISSING' }] };
  const coverage = capabilityCoverage({ program, conversionReport });
  assert.equal(coverage.complete, false);
  assert.equal(coverage.decision, 'NOT_COMPLETE_CRITICAL_GAP');
  assert.equal(coverage.metrics.partialSupport, 1);
});

test('reference comparison measures vector, raster, and stroke structure and limits equivalence claims', () => {
  const vector = makeDocument(makeTarget());
  const v = compareReference({ reference: vector, ink: JSON.parse(JSON.stringify(vector)), kind: 'vector', metadata: { referenceSoftware: 'Inkscape', referenceVersion: '1.2.2', sameInputConfirmed: true, svgRoundtripStability: 1 } });
  assert.equal(v.structure.retention, 1);
  assert.equal(v.decision, 'EQUIVALENT');
  const raster = { width: 2, height: 1, data: new Uint8ClampedArray([10, 20, 30, 255, 200, 180, 160, 255]) };
  const r = compareReference({ reference: raster, ink: raster, kind: 'raster', metadata: { referenceSoftware: 'Reference', referenceVersion: '1', sameInputConfirmed: true } });
  assert.equal(r.metrics.sizeMatch, true);
  assert.equal(r.visual.measured, true);
  const stroke = { sessions: [{ strokes: [{ brushId: 'ink', samples: [{ pressure: .2 }, { pressure: .8 }] }] }] };
  const s = compareReference({ reference: stroke, ink: stroke, kind: 'stroke', metadata: {} });
  assert.equal(s.metrics.strokeRetention, 1);
  assert.notEqual(s.decision, 'EQUIVALENT');
});

test('gap ranking prioritizes frequent blockers and maturity requires repeated external evidence', () => {
  const ranking = new GapFrequencyRanking();
  const report = { unsupportedOperations: [{ operationId: 'a', canonicalOperation: 'vendor.mask', status: 'PARTIAL', gapCategory: 'PARAMETER_MISSING' }] };
  ranking.add({ program: { id: 'one', operations: [] }, conversionReport: report, assetTypes: ['Photoshop'] });
  ranking.add({ program: { id: 'two', operations: [] }, conversionReport: report, assetTypes: ['Photoshop'] });
  const result = ranking.report();
  assert.equal(result.ranking[0].occurrences, 2);
  const oneTest = maturityAssessment({ capability: 'mask', evidence: [{ assetId: 'one', passed: true }] });
  assert.equal(oneTest.level, 'EXPERIMENTAL');
  const repeated = maturityAssessment({ capability: 'mask', evidence: Array.from({ length: 10 }, (_, index) => ({ assetId: `a${index}`, kind: 'external-reference', passed: true })) });
  assert.equal(repeated.level, 'OPERATIONAL');
});

test('large real-derived Action stress parse is bounded and preserves every detected operation', () => {
  const source = textAsset('image/photoshop/ExtractDrawingBgColor.jsx');
  const stressed = Array.from({ length: 20 }, () => source).join('\n');
  const started = performance.now(), importer = new UniversalProgramImporter();
  const report = importer.importAsset({ name: 'large.jsx', text: stressed, license: MIT, provenance: provenance('https://github.com/sbaril/Photoshop-Scripts'), safetyMode: 'STATIC_PARSE' });
  assert.ok(report.program.operations.length > 500);
  assert.ok(performance.now() - started < 5000);
  assert.equal(report.documentPolluted, false);
});

test('benchmark library contains the required real vector, Photoshop, paint, JSON, and license assets', () => {
  const countFiles = relative => fs.readdirSync(asset(relative), { withFileTypes: true }).filter(entry => entry.isFile()).length;
  assert.ok(countFiles('vector/illustrator') >= 5);
  assert.ok(countFiles('image/photoshop') >= 10);
  assert.ok(countFiles('paint/p5-brush') >= 5);
  assert.ok(countFiles('image/json-workflows') >= 5);
  assert.ok(countFiles('licenses') >= 8);
  assert.ok(fs.statSync(asset('vector/inkscape/reference-floret-tessagon.svg')).size > 10_000);
});
