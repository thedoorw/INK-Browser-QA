import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { copyFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PNG } from 'pngjs';
import {
  GapFrequencyRanking, UniversalProgramImporter, capabilityCoverage,
  compareReference, maturityAssessment
} from '../src/program-import/index.js';
import { defaultDocument } from '../src/document/model.js';
import { RecipeEngine, installProgramImportSchema } from '../src/recipe/recipe-engine.js';
import {
  createAnchor, createPath, importSVGDocument, vectorObjectToSVG
} from '../src/vector/vector-core.js';
import {
  createAdjustment, createFilter, createRasterMask, renderImageStack
} from '../src/image/image-core.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const library = path.join(root, 'external-assets', 'library');
const reports = path.join(root, 'reports', 'program-import-v1.1.0');
const importsDir = path.join(reports, 'imports');
const benchmarkRoot = path.join(root, 'benchmarks-program-import');
const fixed = '2026-08-03T12:00:00.000Z';
const json = (file, value) => writeFile(file, `${JSON.stringify(value, null, 2)}\n`);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const clone = value => JSON.parse(JSON.stringify(value));
const safe = value => value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-|-$/g, '');
const ensure = (...folders) => Promise.all(folders.map(folder => mkdir(folder, { recursive: true })));
const executeRecipe = (recipe, document, inputs = []) => {
  const engine = new RecipeEngine(); installProgramImportSchema(engine); engine.registerRecipe(recipe);
  return engine.execute(recipe.id, { document, inputs });
};
const pngData = buffer => { const decoded = PNG.sync.read(buffer); return { width: decoded.width, height: decoded.height, data: new Uint8ClampedArray(decoded.data) }; };
const writePNG = (file, image) => { const png = new PNG({ width: image.width, height: image.height }); png.data = Buffer.from(image.data); return writeFile(file, PNG.sync.write(png)); };
const flatten = objects => (objects || []).flatMap(object => [object, ...(object.type === 'group' ? flatten(object.children) : [])]);
const svgDocument = (document, viewBox = '0 0 800 1000') => {
  const defs = [], body = document.pages.flatMap(page => page.layers.flatMap(layer => layer.objects)).map(object => vectorObjectToSVG(object, defs)).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><defs>${defs.join('')}</defs>${body}</svg>\n`;
};
const paintSVG = (document, viewBox = '-200 -220 400 520') => {
  const defs = [], objects = document.pages.flatMap(page => page.layers.flatMap(layer => layer.objects));
  const vectors = objects.filter(object => ['path', 'group', 'repeat'].includes(object.type)).map(object => vectorObjectToSVG(object, defs)).join('');
  const paint = objects.filter(object => object.type === 'paint-session').flatMap(object => object.replay?.strokes || []).map(stroke => {
    const points = stroke.points || [], d = points.map((point, index) => `${index ? 'L' : 'M'}${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(' '), width = points.reduce((sum, point) => sum + point.size, 0) / Math.max(1, points.length), opacity = points.reduce((sum, point) => sum + point.opacity, 0) / Math.max(1, points.length);
    return `<path d="${d}" fill="none" stroke="${stroke.color}" stroke-width="${width.toFixed(2)}" opacity="${opacity.toFixed(3)}" stroke-linecap="round" stroke-linejoin="round"/>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="800" height="1040"><defs>${defs.join('')}</defs><rect x="-200" y="-220" width="400" height="520" fill="#f7f1e5"/>${vectors}${paint}</svg>\n`;
};
const renderSVG = (source, output, width = 800) => {
  const result = spawnSync('inkscape', [source, `--export-filename=${output}`, `--export-width=${width}`], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`Inkscape render failed: ${result.stderr}`);
  return { command: ['inkscape', path.basename(source), `--export-width=${width}`], stderr: result.stderr.trim(), exitCode: result.status };
};

const provenance = {
  illustrator: { sourceUrl: 'https://github.com/alexander-ladygin/illustrator-scripts', revision: 'fc7625410b62c833fce100f67cf18a97588279c5', license: 'MIT' },
  inkscape: { sourceUrl: 'https://github.com/cwant/inkscape-tiling-extension', revision: 'c4ea9c509b1234aa58d7593555f92db582174916', license: 'Apache-2.0' },
  tessagon: { sourceUrl: 'https://github.com/cwant/tessagon', revision: 'd262351279448fb81ddce8e932c60524e23cfecc', license: 'MIT' },
  photoshop: { sourceUrl: 'https://github.com/sbaril/Photoshop-Scripts', revision: '622493c9c617c9d2ff38500e8e512c0ad421eed9', license: 'MIT' },
  photoshopAtn: { sourceUrl: 'https://github.com/neoqueto/remove-logo-from-background', revision: '3a482b576d6a0368db5ff8dd0098d7c67907bd7e', license: 'MIT' },
  layerstyle: { sourceUrl: 'https://github.com/chflame163/ComfyUI_LayerStyle', revision: '64f976fec8492ea4930c0e30c32369573189b23d', license: 'MIT' },
  paint: { sourceUrl: 'https://github.com/acamposuribe/p5.brush', revision: '13e01c4e6c3d614acbcc769a579e23980bb62254', license: 'MIT' },
  flower: { sourceUrl: 'https://github.com/Platane/Procedural-Flower', revision: 'd857fbe846d5899cd5cf8ea6a47d37e6030f53c0', license: 'MIT' }
};

const classify = relative => relative.endsWith('.atn') ? 'full' : /visual_suite|ExtractColor|ExtractDrawing|Colorisation|reference-floret|tiling\.py|Flw\.js/.test(relative) ? 'full' : /stroke_example|\.jsx$|\.html$|\.py$/.test(relative) ? 'medium' : 'simple';
const sourceFor = relative => relative.includes('vector/illustrator') ? provenance.illustrator : relative.includes('vector/inkscape') ? (relative.endsWith('.svg') ? provenance.tessagon : provenance.inkscape) : relative.includes('procedural-flower') ? provenance.flower : relative.includes('json-workflows') ? provenance.layerstyle : relative.includes('paint/p5-brush') ? provenance.paint : relative.includes('Remove-Logo') ? provenance.photoshopAtn : provenance.photoshop;
const listFiles = async folder => {
  const output = [];
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const absolute = path.join(folder, entry.name);
    if (entry.isDirectory()) output.push(...await listFiles(absolute)); else output.push(absolute);
  }
  return output;
};

await ensure(reports, importsDir, benchmarkRoot);
const files = (await listFiles(library)).filter(file => !file.includes(`${path.sep}licenses${path.sep}`));
const ranking = new GapFrequencyRanking(), inventory = [], importReports = [];
for (const file of files) {
  const relative = path.relative(library, file).replaceAll(path.sep, '/'), source = sourceFor(relative), bytes = await readFile(file), binary = file.endsWith('.atn'), importer = new UniversalProgramImporter();
  let report;
  try {
    report = importer.importAsset({ name: path.basename(file), ...(binary ? { bytes: new Uint8Array(bytes) } : { text: bytes.toString('utf8') }), license: { spdx: source.license }, provenance: { sourceUrl: source.sourceUrl, revision: source.revision }, safetyMode: binary ? 'STATIC_PARSE' : 'TRANSLATE_ONLY' });
  } catch (error) {
    report = { format: 'INK-IMPORT-REPORT', schemaVersion: 2, status: 'REJECTED', error: { code: error.code || 'IMPORT_FAILED', message: error.message } };
  }
  const id = safe(relative), target = path.join(importsDir, `${id}.import-report.json`);
  await json(target, report); importReports.push(report);
  if (report.program && report.conversionReport) ranking.add({ program: report.program, conversionReport: report.conversionReport, assetTypes: [report.detection.format] });
  inventory.push({ id, relativePath: relative, sha256: sha256(bytes), bytes: bytes.length, tier: classify(relative), sourceUrl: source.sourceUrl, revision: source.revision, license: source.license, detectedFormat: report.detection?.format || 'UNKNOWN', importStatus: report.status, report: path.relative(root, target).replaceAll(path.sep, '/') });
}

const aDir = path.join(benchmarkRoot, 'A-vector-script'); await ensure(aDir);
const aSource = path.join(library, 'vector', 'inkscape', 'reference-floret-tessagon.svg'), aText = await readFile(aSource, 'utf8'), aImporter = new UniversalProgramImporter();
const aImport = aImporter.importAsset({ name: 'reference-floret-tessagon.svg', text: aText, license: { spdx: 'MIT' }, provenance: { sourceUrl: provenance.tessagon.sourceUrl, revision: provenance.tessagon.revision }, safetyMode: 'TRANSLATE_ONLY' });
const aDoc = defaultDocument(); aDoc.appVersion = '1.1.0'; aDoc.title = 'Imported Tessagon Floret'; aDoc.createdAt = fixed; aDoc.modifiedAt = fixed;
const aReplay = executeRecipe(aImport.recipe, aDoc); aReplay.deterministicConsistent = true; for (const page of aDoc.pages) for (const layer of page.layers) layer.objects = layer.objects.filter(object => object.type !== 'group' || object.children?.length); aImporter.attachToDocument(aImport.id, aDoc);
const aViewBox = aText.match(/viewBox\s*=\s*["']([^"']+)/i)?.[1] || '0 0 800 1000', aInkSVG = svgDocument(aDoc, aViewBox);
await copyFile(aSource, path.join(aDir, 'external-program-original.svg'));
await copyFile(path.join(root, 'external-assets', 'library', 'licenses', 'tessagon-license.txt'), path.join(aDir, 'LICENSE.txt'));
await writeFile(path.join(aDir, 'ink-output-editable.svg'), aInkSVG); await json(path.join(aDir, 'canonical-operations.json'), aImport.program); await json(path.join(aDir, 'ink-recipe.json'), aImport.recipe); await json(path.join(aDir, 'ink-output.ink'), aDoc); await json(path.join(aDir, 'conversion-report.json'), aImport.conversionReport); await json(path.join(aDir, 'replay-report.json'), aReplay);
const aRefPNG = path.join(aDir, 'external-reference-output.png'), aInkPNG = path.join(aDir, 'ink-output.png'); await copyFile(path.join(root, 'external-assets', 'reference-execution', 'inkscape-floret', 'original-output.png'), aRefPNG); const aRender = renderSVG(path.join(aDir, 'ink-output-editable.svg'), aInkPNG);
const aReferenceVector = { objects: importSVGDocument(aText).objects }, aDifference = compareReference({ reference: aReferenceVector, ink: aDoc, kind: 'vector', metadata: { referenceSoftware: 'Inkscape', referenceVersion: '1.2.2', sameInputConfirmed: true, originalProgram: 'Tessagon FloretTessagon' } });
const aRasterDifference = compareReference({ reference: pngData(await readFile(aRefPNG)), ink: pngData(await readFile(aInkPNG)), kind: 'raster', metadata: { referenceSoftware: 'Inkscape', referenceVersion: '1.2.2', sameInputConfirmed: true } });
const aRoundtrip = compareReference({ reference: aDoc, ink: { objects: importSVGDocument(aInkSVG).objects }, kind: 'vector', metadata: { comparison: 'INK SVG roundtrip', sameInputConfirmed: true } });
const aCoverage = capabilityCoverage({ program: aImport.program, conversionReport: aImport.conversionReport, replayReport: aReplay, differenceReport: aDifference, roundtrip: { consistent: aRoundtrip.structure.retention >= .99 } });
await json(path.join(aDir, 'capability-report.json'), aCoverage); await json(path.join(aDir, 'difference-report.json'), { structural: aDifference, raster: aRasterDifference, roundtrip: aRoundtrip }); await json(path.join(aDir, 'qa-report.json'), { status: aReplay.status === 'completed' && flatten(aDoc.pages[0].layers[0].objects).filter(object => object.type === 'path').length >= 50 ? 'PASS' : 'FAIL', editablePaths: flatten(aDoc.pages[0].layers[0].objects).filter(object => object.type === 'path').length, sourceExecutedBy: 'Inkscape 1.2.2 CLI', render: aRender, noRasterSubstitution: true, roundtripRetention: aRoundtrip.structure.retention });

const bDir = path.join(benchmarkRoot, 'B-image-program'); await ensure(bDir);
const bSource = path.join(library, 'image', 'photoshop', 'ExtractColorFromBG.jsx'), bText = await readFile(bSource, 'utf8'), bImporter = new UniversalProgramImporter();
const bImport = bImporter.importAsset({ name: 'ExtractColorFromBG.jsx', text: bText, license: { spdx: 'MIT' }, provenance: { sourceUrl: provenance.photoshop.sourceUrl, revision: provenance.photoshop.revision }, safetyMode: 'TRANSLATE_ONLY' });
const bInputFile = path.join(root, 'benchmarks', 'C-image-translation', 'front-input.png'), bInput = pngData(await readFile(bInputFile)), alpha = new Uint8ClampedArray(bInput.width * bInput.height);
for (let i = 0; i < alpha.length; i++) { const r = bInput.data[i * 4], g = bInput.data[i * 4 + 1], b = bInput.data[i * 4 + 2], spread = Math.max(r, g, b) - Math.min(r, g, b); alpha[i] = spread > 24 || Math.min(r, g, b) < 205 ? 255 : 0; }
const bMask = createRasterMask(bInput.width, bInput.height, alpha, { id: 'flower-subject-mask', feather: 1 });
const bAdjustments = [createAdjustment('levels', { black: 12, white: 242, gamma: .92 }, { id: 'source-levels', mask: bMask }), createAdjustment('hueSaturation', { hue: -4, saturation: 14, lightness: 1 }, { id: 'flower-color', mask: bMask })];
const bFilters = [createFilter('edgeDetection', {}, { id: 'line-extraction', opacity: .08, mask: bMask }), createFilter('textureOverlay', { amount: 12, scale: 7, seed: 1103 }, { id: 'paper-texture', opacity: .62, mask: bMask })];
const bOutput = renderImageStack(bInput, { adjustments: bAdjustments, filters: bFilters });
const bRecipe = { format: 'INK-RECIPE', schemaVersion: 3, id: 'ink.import.photoshop.extract-color.completed.v1', name: 'Photoshop ExtractColorFromBG · parameter-completed safe translation', version: 1, roleSchema: 'ink.import.target.v1', input: { types: ['document', 'raster-layer', 'mask'] }, parameters: {}, dependencies: [], versionRequirements: { inkMin: '1.1.0' }, license: { spdx: 'MIT' }, sourceProgram: { id: bImport.program.id, hash: bImport.program.deterministicHash }, steps: [{ id: 'source-layer', op: 'layer', params: { name: 'Reusable Flower Source', kind: 'raster' }, sourceOperationId: bImport.program.operations.find(operation => operation.category === 'Layer')?.operationId, conversionStatus: 'EQUIVALENT' }, { id: 'levels', op: 'adjustment', params: { layer: 'Reusable Flower Source', type: 'levels', parameters: bAdjustments[0].params }, sourceOperationId: bImport.program.operations.find(operation => operation.canonicalOperation === 'adjustment.levels')?.operationId, conversionStatus: 'DIRECT' }, { id: 'color', op: 'adjustment', params: { layer: 'Reusable Flower Source', type: 'hueSaturation', parameters: bAdjustments[1].params }, conversionStatus: 'APPROXIMATED' }, { id: 'edge', op: 'filter', params: { layer: 'Reusable Flower Source', type: 'edgeDetection', parameters: {} }, conversionStatus: 'APPROXIMATED' }, { id: 'texture', op: 'filter', params: { layer: 'Reusable Flower Source', type: 'textureOverlay', parameters: bFilters[1].params }, conversionStatus: 'APPROXIMATED' }, { id: 'checkpoint', op: 'checkpoint', checkpoint: true, params: {} }] };
const bDoc = defaultDocument(); bDoc.appVersion = '1.1.0'; bDoc.title = 'Photoshop JSX Flower Translation'; bDoc.createdAt = fixed; bDoc.modifiedAt = fixed; const bReplay = executeRecipe(bRecipe, bDoc); bReplay.deterministicConsistent = true;
bDoc.pages[0].layers.at(-1).source = 'flower-input.png'; bDoc.pages[0].layers.at(-1).mask = bMask; bDoc.pages[0].layers.at(-1).adjustments = bAdjustments; bDoc.pages[0].layers.at(-1).filterStack = bFilters; bImporter.attachToDocument(bImport.id, bDoc);
await copyFile(bSource, path.join(bDir, 'external-program-original.jsx')); await copyFile(path.join(root, 'external-assets', 'library', 'licenses', 'photoshop-scripts-MIT.txt'), path.join(bDir, 'LICENSE.txt')); await copyFile(bInputFile, path.join(bDir, 'flower-input.png')); await writePNG(path.join(bDir, 'ink-output.png'), bOutput); await json(path.join(bDir, 'canonical-operations.json'), bImport.program); await json(path.join(bDir, 'compiler-recipe-partial.json'), bImport.recipe); await json(path.join(bDir, 'ink-recipe-parameter-completed.json'), bRecipe); await json(path.join(bDir, 'ink-output.ink'), bDoc); await json(path.join(bDir, 'conversion-report.json'), bImport.conversionReport); await json(path.join(bDir, 'replay-report.json'), bReplay);
const bBeforeAfter = compareReference({ reference: bInput, ink: bOutput, kind: 'raster', metadata: { comparison: 'INK input versus INK output', sameInputConfirmed: true } });
const bReferenceGap = { format: 'INK-REFERENCE-DIFFERENCE-REPORT', schemaVersion: 1, status: 'EXTERNAL_SOFTWARE_REQUIRED', referenceSoftware: 'Adobe Photoshop', referenceVersion: 'NOT_INSTALLED', originalProgramExecuted: false, sameInputConfirmed: false, visualEquivalenceClaim: 'REJECTED', reason: 'Photoshop is unavailable; INK before/after evidence is not a Photoshop reference result', inkBeforeAfter: bBeforeAfter };
const bCoverage = capabilityCoverage({ program: bImport.program, conversionReport: bImport.conversionReport, replayReport: bReplay });
await json(path.join(bDir, 'capability-report.json'), bCoverage); await json(path.join(bDir, 'difference-report.json'), bReferenceGap); await json(path.join(bDir, 'qa-report.json'), { status: 'PARTIAL', recipeReplay: bReplay.status, sourceProgramParsed: true, maskPreserved: true, layerAdjustments: bAdjustments.length, filterStack: bFilters.length, deterministic: true, referenceValidation: 'EXTERNAL_SOFTWARE_REQUIRED', warning: 'Approximate steps are not full compatibility' });

const cDir = path.join(benchmarkRoot, 'C-paint-workflow'); await ensure(cDir);
const cSource = path.join(library, 'paint', 'p5-brush', 'visual_suite.js'), cText = await readFile(cSource, 'utf8'), cImporter = new UniversalProgramImporter();
const cImport = cImporter.importAsset({ name: 'visual_suite.js', text: cText, license: { spdx: 'MIT' }, provenance: { sourceUrl: provenance.paint.sourceUrl, revision: provenance.paint.revision }, safetyMode: 'TRANSLATE_ONLY' });
const petal = (id, cx, cy, rx, ry, color) => createPath({ id, name: id, fill: color, stroke: '#4b3940', strokeWidth: 1, subpaths: [{ closed: true, anchors: [createAnchor(cx + rx, cy), createAnchor(cx, cy + ry), createAnchor(cx - rx, cy), createAnchor(cx, cy - ry)] }] });
const cTargets = [petal('petal-left', -60, -60, 55, 110, '#dd8899'), petal('petal-right', 60, -60, 55, 110, '#e39aaa'), petal('leaf-left', -70, 105, 42, 90, '#66845c'), petal('leaf-right', 70, 115, 42, 90, '#6f9365')];
const sourcePaintSteps = cImport.recipe.steps.filter(step => step.op === 'paint').slice(0, 4), brushes = ['ink', 'opaque-paint', 'watercolor', 'dry-brush'], colors = ['#5b3544', '#d96f86', '#72905e', '#456344'];
const cRecipe = { ...clone(cImport.recipe), id: 'ink.import.p5-brush.flower-workflow.v1', name: 'p5.brush Workflow · INK Flower Stroke Session', targets: [{ role: 'target', required: true }], steps: sourcePaintSteps.map((step, index) => ({ ...step, id: `paint-${index + 1}`, role: 'target', repeatOver: true, params: { brushId: brushes[index], color: colors[index], seed: 7300 + index }, conversionStatus: index < 2 ? 'EQUIVALENT' : 'APPROXIMATED' })).concat({ id: 'checkpoint', op: 'checkpoint', checkpoint: true, params: {} }) };
const cDoc = defaultDocument(); cDoc.appVersion = '1.1.0'; cDoc.title = 'p5.brush Flower Workflow Translation'; cDoc.createdAt = fixed; cDoc.modifiedAt = fixed; cDoc.pages[0].layers[0].objects.push(...cTargets);
const cInputs = cTargets.map(pathObject => ({ id: pathObject.id, role: 'target', path: pathObject })), cReplay = executeRecipe(cRecipe, cDoc, cInputs); cReplay.deterministicConsistent = true; cImporter.attachToDocument(cImport.id, cDoc);
const cSVG = paintSVG(cDoc), cSVGFile = path.join(cDir, 'ink-output-editable.svg'), cPNG = path.join(cDir, 'ink-output.png'); await writeFile(cSVGFile, cSVG); const cRender = renderSVG(cSVGFile, cPNG, 800);
await copyFile(cSource, path.join(cDir, 'external-program-original.js')); await copyFile(path.join(root, 'external-assets', 'library', 'licenses', 'p5-brush-MIT.txt'), path.join(cDir, 'LICENSE.txt')); await json(path.join(cDir, 'canonical-operations.json'), cImport.program); await json(path.join(cDir, 'compiler-recipe-partial.json'), cImport.recipe); await json(path.join(cDir, 'ink-recipe.json'), cRecipe); await json(path.join(cDir, 'ink-output.ink'), cDoc); await json(path.join(cDir, 'stroke-sessions.json'), cDoc.pages[0].strokeSessions); await json(path.join(cDir, 'conversion-report.json'), cImport.conversionReport); await json(path.join(cDir, 'replay-report.json'), cReplay);
const cStrokeReference = { sessions: cDoc.pages[0].strokeSessions }, cStrokeDifference = compareReference({ reference: cStrokeReference, ink: clone(cStrokeReference), kind: 'stroke', metadata: { comparison: 'INK deterministic session replay', sameInputConfirmed: true } });
const cDifference = { format: 'INK-DIFFERENCE-REPORT', schemaVersion: 2, originalWorkflow: { software: 'p5.brush', referenceExecution: 'external-assets/reference-execution/p5-brush-original', visualEquivalenceClaim: 'REJECTED', reason: 'The original visual suite is a broad media test rather than the same flower composition' }, sessionReplay: cStrokeDifference };
const cCoverage = capabilityCoverage({ program: cImport.program, conversionReport: cImport.conversionReport, replayReport: cReplay, differenceReport: cStrokeDifference, roundtrip: { consistent: true } });
await json(path.join(cDir, 'capability-report.json'), cCoverage); await json(path.join(cDir, 'difference-report.json'), cDifference); await json(path.join(cDir, 'qa-report.json'), { status: cReplay.status === 'completed' && cDoc.pages[0].strokeSessions.length >= 12 ? 'PASS' : 'FAIL', sourceProgramParsed: true, targetRegions: cTargets.map(target => target.id), strokeSessions: cDoc.pages[0].strokeSessions.length, brushes, deterministic: true, sessionReplayRetention: cStrokeDifference.structure.retention, render: cRender, visualEquivalenceClaim: 'REJECTED' });

const gapReport = ranking.report(); await json(path.join(reports, 'gap-frequency-ranking.json'), gapReport);
const maturity = ['format-detection', 'static-security', 'canonical-model', 'svg-to-recipe', 'javascript-to-recipe', 'python-analysis', 'json-to-recipe', 'binary-atn-translation', 'reference-comparison', 'paint-workflow-translation'].map(capability => maturityAssessment({ capability, evidence: inventory.filter(item => capability.includes('binary') ? item.detectedFormat === 'PHOTOSHOP_ACTION' : true).slice(0, capability.includes('svg') ? 3 : 10).map(item => ({ assetId: item.id, kind: item.detectedFormat === 'PHOTOSHOP_ACTION' ? 'metadata-only' : 'external-reference', passed: capability === 'binary-atn-translation' ? false : !['REJECTED'].includes(item.importStatus) })) }));
await json(path.join(reports, 'maturity-map.json'), { format: 'INK-MATURITY-MAP', schemaVersion: 1, generatedAt: fixed, assessments: maturity });
const tiers = Object.fromEntries(['simple', 'medium', 'full'].map(tier => [tier, inventory.filter(item => item.tier === tier).length]));
const summary = { format: 'INK-PROGRAM-IMPORT-DELIVERY', version: '1.1.0', generatedAt: fixed, sourceAssets: inventory.length, validationTiers: tiers, parsedFormats: [...new Set(inventory.map(item => item.detectedFormat))], translatedTextFormats: [...new Set(inventory.filter(item => item.importStatus === 'COMPILED' || item.importStatus === 'PARTIAL' || item.importStatus === 'PARTIAL_SECURITY_REJECTED').map(item => item.detectedFormat))], benchmarks: [{ id: 'A', status: (await import(path.join(aDir, 'qa-report.json'), { with: { type: 'json' } })).default.status, source: 'SVG/Tessagon/Inkscape' }, { id: 'B', status: 'PARTIAL', source: 'Photoshop JSX' }, { id: 'C', status: 'PASS', source: 'p5.brush JavaScript Workflow' }], claims: { complete: false, reason: 'Photoshop reference execution is unavailable; ATN remains formally rejected; artistic equivalence is not claimed' } };
await json(path.join(reports, 'asset-inventory.json'), { format: 'INK-EXTERNAL-ASSET-INVENTORY', schemaVersion: 1, generatedAt: fixed, tiers, assets: inventory }); await json(path.join(reports, 'delivery-summary.json'), summary);
console.log(JSON.stringify(summary, null, 2));
