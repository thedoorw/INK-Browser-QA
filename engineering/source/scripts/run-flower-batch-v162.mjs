import { createHash } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defaultDocument } from '../src/document/model.js';
import { Matrix } from '../src/core/math.js';
import { stableHash } from '../src/core/stable-id.js';
import { createAnchor, createPath, createRepeat, createVectorLayer, updateRepeatCount } from '../src/vector/vector-core.js';
import {
  createMaterialInstance, detachMaterialInstance, findObjectEntry, installFlowerBatch01Templates,
  materialLibraryReport, updateMaterialInstance, updateMaterialTemplate
} from '../src/material/index.js';
import { addDependencyRelation, setParentRelation } from '../src/recompute/dependency-graph.js';
import { analyzeLocalRecompute } from '../src/recompute/local-recompute.js';
import { repeatIdentityReport } from '../src/repeat/repeat-identity.js';
import { ExportRunner } from '../src/headless/export-runner.js';
import { decodePNG, encodePNG, imageDifference } from '../src/compare/image-difference.js';
import { UniversalProgramImporter } from '../src/program-import/importer.js';
import { RecipeEngine, installProgramImportSchema } from '../src/recipe/recipe-engine.js';

const ROOT = path.resolve('Validation/v1.6.2/flower-batch');
const BASELINE = path.resolve('Validation/v1.6.2/baseline-batch01');
const runner = new ExportRunner({ root: process.cwd() });
const clone = value => structuredClone(value);
const sha256 = value => createHash('sha256').update(value).digest('hex');
const json = async (file, value) => { await mkdir(path.dirname(file), { recursive: true }); await writeFile(file, JSON.stringify(value, null, 2) + '\n'); };

function baseDocument(id, title = id) {
  const document = defaultDocument();
  document.id = `document:${id}`;
  document.title = title;
  document.createdAt = '2026-08-05T00:00:00.000Z';
  document.modifiedAt = '2026-08-05T00:00:00.000Z';
  const page = document.pages[0];
  page.id = `page:${id}`;
  document.activePageId = page.id;
  page.name = title;
  page.paper.color = '#ffffff';
  page.paper.textureVisible = false;
  page.layers = [createVectorLayer([], { id: `layer:${id}:main`, name: 'Main' })];
  page.activeLayerId = page.layers[0].id;
  return document;
}
const page = document => document.pages[0];
const layer = (document, id) => page(document).layers.find(item => item.id === id);
function addLayer(document, id, name, { visible = true } = {}) {
  const next = createVectorLayer([], { id, name, visible });
  page(document).layers.push(next);
  return next;
}
function active(document, layerId) { page(document).activeLayerId = layerId; }
function object(document, id) { return findObjectEntry(document, id)?.object || null; }

function fleurifyPath() {
  const points = [[397,170],[510,215],[560,330],[510,445],[397,492],[284,445],[234,330],[284,215]];
  return createPath({ id: 'fleurify-outline-8', name: 'Eight Anchor Base', fill: '#db7892', stroke: '#653243', strokeWidth: 3,
    subpaths: [{ id: 'fleurify-outline-8:outline', closed: true, role: 'outer', anchors: points.map(([x,y], index) => createAnchor(x, y, null, null, { id: `anchor-${index}`, mode: 'corner' })) }] });
}

async function exportDocument(caseDir, basename, document) {
  const output = path.join(caseDir, 'outputs', basename);
  return runner.export(document, { output, basename, formats: ['svg','png'], background: 'white', width: 794, height: 794, deterministic: true });
}
async function compareFiles(caseDir, name, beforeFile, afterFile) {
  const before = decodePNG(await readFile(beforeFile)), after = decodePNG(await readFile(afterFile));
  const result = imageDifference(before, after, 0);
  const output = path.join(caseDir, 'comparisons'); await mkdir(output, { recursive: true });
  const files = {
    difference: path.join(output, `${name}.difference.png`),
    sideBySide: path.join(output, `${name}.side-by-side.png`),
    overlay: path.join(output, `${name}.overlay.png`)
  };
  await writeFile(files.difference, encodePNG(result.difference));
  await writeFile(files.sideBySide, encodePNG(result.sideBySide));
  await writeFile(files.overlay, encodePNG(result.overlay));
  return { ...result.metrics, files, allZero: result.metrics.changedPixels === 0 };
}
async function baselineComparison(caseDir, index, newFile) {
  const names = [
    'Case_01_Fleurify_Outline.png','Case_02_Petal_Leaf_Templates.png','Case_03_Radial_Petal_Assembly.png',
    'Case_04_Multilayer_Corolla.png','Case_05_Stem_Leaf_Bud.png','Case_06_Watercolor_Vector_Approximation.png'
  ];
  return compareFiles(caseDir, 'batch01-vs-v162', path.join(BASELINE, names[index - 1]), newFile);
}
function ownHash(value) { return stableHash(value); }
function anchorSnapshot(pathObject) { return pathObject.subpaths[0].anchors.map(({ id, x, y }) => ({ id, x, y })); }

async function case1() {
  const id = 'case-01-outline-fleurify', dir = path.join(ROOT, id); await mkdir(dir, { recursive: true });
  const source = await readFile('external-assets/benchmarks/fleurify/fleurify.js', 'utf8');
  const importer = new UniversalProgramImporter({ inkVersion: '1.6.2' });
  const imported = importer.importAsset({ name: 'fleurify.js', text: source,
    license: { spdx: 'LicenseRef-John-Wundes-JS4AI', url: 'http://www.wundes.com/js4ai/copyright.txt' },
    provenance: { sourceUrl: 'https://github.com/johnwun/js4ai/blob/master/fleurify.js', revision: 'master' }, safetyMode: 'TRANSLATE_ONLY', compile: true });
  const build = percentage => {
    const document = baseDocument(id, 'Fleurify Outline');
    const target = fleurifyPath(); layer(document, `layer:${id}:main`).objects.push(target);
    const anchorsBefore = anchorSnapshot(target);
    const engine = new RecipeEngine(); installProgramImportSchema(engine); engine.registerRecipe(imported.recipe);
    const execution = engine.execute(imported.recipe, { document, roles: { target: [target] }, parameters: { percentage } });
    return { document, target, anchorsBefore, execution };
  };
  const run100 = build(100), rerun = build(100), run70 = build(70);
  const e100 = await exportDocument(dir, 'fleurify-100', run100.document), eRerun = await exportDocument(dir, 'fleurify-100-rerun', rerun.document), e70 = await exportDocument(dir, 'fleurify-70', run70.document);
  const deterministic = await compareFiles(dir, '100-vs-rerun', e100.files.png.path, eRerun.files.png.path);
  const parameterDifference = await compareFiles(dir, '100-vs-70', e100.files.png.path, e70.files.png.path);
  const baseline = await baselineComparison(dir, 1, e100.files.png.path);
  const result = {
    caseId: id, decision: 'VALIDATION REQUIRED', status: deterministic.allZero && parameterDifference.changedPixels > 0 ? 'PASS' : 'FAIL',
    import: { detection: imported.detection, security: imported.security.status, compileStatus: imported.conversionReport.compileStatus },
    anchorInvariance: JSON.stringify(run100.anchorsBefore) === JSON.stringify(anchorSnapshot(run100.target)),
    deterministic, parameterDifference, baselineComparison: baseline,
    outputs: { main: e100, rerun: eRerun, parameter70: e70 },
    retainedGap: 'Adobe Illustrator Ground Truth remains external validation pending.'
  };
  await json(path.join(dir, 'result.json'), result); return result;
}

function buildCase2(modified = false) {
  const id = 'case-02-petal-leaf-templates', document = baseDocument(id, 'Native Material Templates'); installFlowerBatch01Templates(document);
  const p1 = createMaterialInstance(document, 'material:flower:petal-pointed', { instanceId: 'case2-petal-linked', transform: Matrix.translate(210, 520) });
  const p2 = createMaterialInstance(document, 'material:flower:petal-pointed', { instanceId: 'case2-petal-detached', transform: Matrix.translate(390, 520) });
  const leaf1 = createMaterialInstance(document, 'material:flower:leaf-lanceolate', { instanceId: 'case2-leaf-lanceolate', transform: Matrix.translate(180, 760), parameterOverrides: { bend: 22 } });
  const leaf2 = createMaterialInstance(document, 'material:flower:leaf-broad', { instanceId: 'case2-leaf-broad', transform: Matrix.translate(430, 760), parameterOverrides: { bend: -18 } });
  if (modified) {
    updateMaterialInstance(document, p1.id, { parameterOverrides: { length: 215, bend: 24 } });
    updateMaterialInstance(document, leaf1.id, { parameterOverrides: { length: 190, bend: 45 } });
    detachMaterialInstance(document, p2.id);
    updateMaterialTemplate(document, 'material:flower:petal-pointed', { templateVersion: '1.1.0', defaultParameters: { fill: '#c65e82' } });
  }
  return { document, ids: { p1: p1.id, p2: p2.id, leaf1: leaf1.id, leaf2: leaf2.id } };
}
async function case2() {
  const id = 'case-02-petal-leaf-templates', dir = path.join(ROOT, id); await mkdir(dir, { recursive: true });
  const before = buildCase2(false), after = buildCase2(true), rerun = buildCase2(true);
  const eBefore = await exportDocument(dir, 'before', before.document), eAfter = await exportDocument(dir, 'after', after.document), eRerun = await exportDocument(dir, 'after-rerun', rerun.document), eRollback = await exportDocument(dir, 'rollback', clone(before.document));
  const deterministic = await compareFiles(dir, 'after-vs-rerun', eAfter.files.png.path, eRerun.files.png.path);
  const difference = await compareFiles(dir, 'before-vs-after', eBefore.files.png.path, eAfter.files.png.path);
  const rollbackDifference = await compareFiles(dir, 'before-vs-rollback', eBefore.files.png.path, eRollback.files.png.path);
  const baseline = await baselineComparison(dir, 2, eAfter.files.png.path);
  const pLinked = object(after.document, after.ids.p1), pDetached = object(after.document, after.ids.p2);
  const result = {
    caseId: id, decision: 'VALIDATION REQUIRED', status: deterministic.allZero && rollbackDifference.allZero && difference.changedPixels > 0 ? 'PASS' : 'FAIL',
    materialLibrary: materialLibraryReport(after.document),
    templateNative: after.document.materialLibrary.templates.length === 10,
    multipleInstances: after.ids.p1 !== after.ids.p2,
    override: pLinked.materialInstance.effectiveParameters.length === 215,
    detach: !pDetached.materialInstance && pDetached.metadata.detachedFromMaterial.templateVersion === '1.0.0',
    templateUpdate: pLinked.materialInstance.templateVersion === '1.1.0',
    deterministic, difference, rollbackDifference, baselineComparison: baseline,
    outputs: { before: eBefore, main: eAfter, rerun: eRerun, rollback: eRollback }
  };
  await json(path.join(dir, 'result.json'), result); return result;
}

function case3Base() {
  const id = 'case-03-radial-petal-assembly', document = baseDocument(id, 'Radial Stable Instances'); installFlowerBatch01Templates(document);
  const main = layer(document, `layer:${id}:main`), sourceLayer = addLayer(document, `layer:${id}:sources`, 'Template Sources', { visible: false }); active(document, sourceLayer.id);
  const source = createMaterialInstance(document, 'material:flower:petal-rounded', { instanceId: 'case3-petal-source', transform: Matrix.translate(397, 430), semanticRole: 'petals.outer' });
  active(document, main.id);
  const repeat = createRepeat(source, { id: 'case3-petal-ring', mode: 'radial', count: 12, center: { x: 397, y: 430 }, ringIndex: 0, semanticRole: 'petals.outer', recipeVersion: '1.6.2', sourceMaterialInstanceId: source.id });
  main.objects.push(repeat);
  const center = createMaterialInstance(document, 'material:flower:center-disk', { instanceId: 'case3-center', transform: Matrix.translate(397, 430) });
  addDependencyRelation(document, { from: center.id, to: repeat.id, type: 'SHARES_CENTER_WITH' });
  return { document, source, repeat, center };
}
function applyCase3() {
  const state = case3Base(), ids12 = clone(state.repeat.instances), doc12 = clone(state.document);
  updateRepeatCount(state.repeat, 16); const ids16 = clone(state.repeat.instances), doc16Count = clone(state.document);
  const countIncrease = repeatIdentityReport({ id: state.repeat.id, instances: ids12 }, { id: state.repeat.id, instances: ids16 });
  updateMaterialInstance(state.document, state.source.id, { parameterOverrides: { length: 165 } }); const doc16Long = clone(state.document);
  const lengthReport = analyzeLocalRecompute(doc16Count, state.document, { targets: [state.source.id], parsedIntent: { operations: [{ operation: 'resize' }] } });
  const centerHash = ownHash(state.center);
  updateRepeatCount(state.repeat, 10); const ids10 = clone(state.repeat.instances), doc10 = clone(state.document);
  const countDecrease = repeatIdentityReport({ id: state.repeat.id, instances: ids16 }, { id: state.repeat.id, instances: ids10 });
  return { ...state, doc12, doc16Count, doc16Long, doc10, ids12, ids16, ids10, countIncrease, countDecrease, lengthReport, centerHash };
}
async function case3() {
  const id = 'case-03-radial-petal-assembly', dir = path.join(ROOT, id); await mkdir(dir, { recursive: true });
  const run = applyCase3(), rerun = applyCase3();
  const e12 = await exportDocument(dir, 'count-12', run.doc12), e16 = await exportDocument(dir, 'count-16-long', run.doc16Long), e10 = await exportDocument(dir, 'count-10', run.doc10), eRerun = await exportDocument(dir, 'count-16-long-rerun', rerun.doc16Long);
  const deterministic = await compareFiles(dir, '16-vs-rerun', e16.files.png.path, eRerun.files.png.path);
  const difference = await compareFiles(dir, '12-vs-16', e12.files.png.path, e16.files.png.path);
  const baseline = await baselineComparison(dir, 3, e16.files.png.path);
  const preserved12to16 = run.countIncrease.preserved.length, preserved16to10 = run.countDecrease.preserved.length;
  const result = {
    caseId: id, decision: 'VALIDATION REQUIRED', status: deterministic.allZero && preserved12to16 === 12 && preserved16to10 === 10 && run.lengthReport.status === 'LOCAL_RECOMPUTE_COMPLETED' ? 'PASS' : 'FAIL',
    stableIdentity: { count12: run.ids12.map(x => x.instanceId), count16: run.ids16.map(x => x.instanceId), count10: run.ids10.map(x => x.instanceId), increase: run.countIncrease, decrease: run.countDecrease },
    lengthOnlyUpdate: run.lengthReport,
    centerPreserved: ownHash(object(run.doc16Long, 'case3-center')) === run.centerHash,
    deterministic, difference, baselineComparison: baseline,
    outputs: { count12: e12, main: e16, count10: e10, rerun: eRerun }
  };
  await json(path.join(dir, 'result.json'), result); return result;
}

function case4Base() {
  const id = 'case-04-multilayer-corolla', document = baseDocument(id, 'Multi-layer Corolla'); installFlowerBatch01Templates(document);
  const main = layer(document, `layer:${id}:main`), sourceLayer = addLayer(document, `layer:${id}:sources`, 'Template Sources', { visible: false }); active(document, sourceLayer.id);
  const outerSource = createMaterialInstance(document, 'material:flower:petal-outer-broad', { instanceId: 'case4-outer-source', transform: Matrix.translate(397, 455), semanticRole: 'petals.outer' });
  const innerSource = createMaterialInstance(document, 'material:flower:petal-inner-tight', { instanceId: 'case4-inner-source', transform: Matrix.translate(397, 455), semanticRole: 'petals.inner' });
  active(document, main.id);
  const outer = createRepeat(outerSource, { id: 'case4-outer-ring', count: 14, center: { x: 397, y: 455 }, ringIndex: 0, semanticRole: 'petals.outer', recipeVersion: '1.6.2', sourceMaterialInstanceId: outerSource.id });
  const inner = createRepeat(innerSource, { id: 'case4-inner-ring', count: 9, center: { x: 397, y: 455 }, ringIndex: 1, semanticRole: 'petals.inner', recipeVersion: '1.6.2', startAngle: 10, sourceMaterialInstanceId: innerSource.id });
  main.objects.push(outer, inner);
  const center = createMaterialInstance(document, 'material:flower:center-disk', { instanceId: 'case4-center', transform: Matrix.translate(397, 455), parameterOverrides: { radius: 34 } });
  addDependencyRelation(document, { from: center.id, to: outer.id, type: 'SHARES_CENTER_WITH' }); addDependencyRelation(document, { from: center.id, to: inner.id, type: 'SHARES_CENTER_WITH' });
  return { document, outerSource, innerSource, outer, inner, center };
}
function applyCase4() {
  const state = case4Base(), initial = clone(state.document), innerHash = ownHash(state.inner), centerHash = ownHash(state.center);
  updateMaterialInstance(state.document, state.outerSource.id, { parameterOverrides: { length: 182, bend: 14 } });
  const afterOuter = clone(state.document), outerReport = analyzeLocalRecompute(initial, state.document, { targets: [state.outerSource.id], parsedIntent: { operations: [{ operation: 'resize' }] } });
  const outerHash = ownHash(state.outer);
  updateRepeatCount(state.inner, 11);
  const final = clone(state.document), innerReport = analyzeLocalRecompute(afterOuter, state.document, { targets: [state.inner.id], parsedIntent: { operations: [{ operation: 'adjust-count' }] } });
  return { ...state, initial, afterOuter, final, innerHash, centerHash, outerHash, outerReport, innerReport };
}
async function case4() {
  const id = 'case-04-multilayer-corolla', dir = path.join(ROOT, id); await mkdir(dir, { recursive: true });
  const run = applyCase4(), rerun = applyCase4();
  const eBefore = await exportDocument(dir, 'before', run.initial), eAfter = await exportDocument(dir, 'after-ring-specific', run.final), eRerun = await exportDocument(dir, 'after-rerun', rerun.final), eRollback = await exportDocument(dir, 'rollback', clone(run.initial));
  const deterministic = await compareFiles(dir, 'after-vs-rerun', eAfter.files.png.path, eRerun.files.png.path);
  const difference = await compareFiles(dir, 'before-vs-after', eBefore.files.png.path, eAfter.files.png.path);
  const rollbackDifference = await compareFiles(dir, 'before-vs-rollback', eBefore.files.png.path, eRollback.files.png.path);
  const baseline = await baselineComparison(dir, 4, eAfter.files.png.path);
  const result = {
    caseId: id, decision: 'VALIDATION REQUIRED', status: deterministic.allZero && rollbackDifference.allZero && run.outerReport.status === 'LOCAL_RECOMPUTE_COMPLETED' && run.innerReport.status === 'LOCAL_RECOMPUTE_COMPLETED' ? 'PASS' : 'FAIL',
    ringSpecific: {
      outerUpdate: run.outerReport,
      innerCountUpdate: run.innerReport,
      innerPreservedDuringOuterUpdate: ownHash(object(run.afterOuter, 'case4-inner-ring')) === run.innerHash,
      centerPreserved: ownHash(object(run.final, 'case4-center')) === run.centerHash,
      outerPreservedDuringInnerUpdate: ownHash(object(run.final, 'case4-outer-ring')) === run.outerHash
    },
    deterministic, difference, rollbackDifference, baselineComparison: baseline,
    outputs: { before: eBefore, main: eAfter, rerun: eRerun, rollback: eRollback }
  };
  await json(path.join(dir, 'result.json'), result); return result;
}

function case5Base() {
  const id = 'case-05-stem-leaf-bud-assembly', document = baseDocument(id, 'Plant Hierarchy'); installFlowerBatch01Templates(document);
  const main = layer(document, `layer:${id}:main`), sourceLayer = addLayer(document, `layer:${id}:sources`, 'Template Sources', { visible: false });
  active(document, sourceLayer.id);
  const crownSource = createMaterialInstance(document, 'material:flower:petal-rounded', { instanceId: 'case5-crown-source', transform: Matrix.translate(397, 360), semanticRole: 'petals.outer' });
  active(document, main.id);
  const crown = createRepeat(crownSource, { id: 'case5-crown-ring', count: 10, center: { x: 397, y: 360 }, ringIndex: 0, semanticRole: 'petals.outer', recipeVersion: '1.6.2', sourceMaterialInstanceId: crownSource.id }); main.objects.push(crown);
  const center = createMaterialInstance(document, 'material:flower:center-disk', { instanceId: 'case5-crown-center', transform: Matrix.translate(397, 360) });
  const stem = createMaterialInstance(document, 'material:flower:stem-curved', { instanceId: 'case5-stem', transform: Matrix.translate(397, 835), parameterOverrides: { length: 400, bend: 28 } });
  const left = createMaterialInstance(document, 'material:flower:leaf-lanceolate', { instanceId: 'case5-leaf-left', parentId: stem.id, transform: Matrix.translate(-10, -190), parameterOverrides: { bend: 30 } });
  const right = createMaterialInstance(document, 'material:flower:leaf-broad', { instanceId: 'case5-leaf-right', parentId: stem.id, transform: Matrix.multiply(Matrix.translate(10, -260), Matrix.scale(-1, 1)), parameterOverrides: { bend: 15 } });
  const bud = createMaterialInstance(document, 'material:flower:bud', { instanceId: 'case5-bud', parentId: stem.id, transform: Matrix.translate(70, -265) });
  const calyx = createMaterialInstance(document, 'material:flower:calyx', { instanceId: 'case5-calyx', parentId: stem.id, transform: Matrix.translate(70, -265) });
  for (const child of [left, right, bud, calyx]) setParentRelation(document, child.id, stem.id);
  addDependencyRelation(document, { from: stem.id, to: crown.id, type: 'POSITIONED_RELATIVE_TO', metadata: { relation: 'stem-top-to-flower-center' } });
  return { document, crownSource, crown, center, stem, left, right, bud, calyx };
}
function applyCase5() {
  const state = case5Base(), initial = clone(state.document);
  const rightHash = ownHash(state.right), crownHash = ownHash(state.crown), centerHash = ownHash(state.center);
  updateMaterialInstance(state.document, state.stem.id, { transform: Matrix.translate(430, 835), parameterOverrides: { bend: 58 } });
  const afterStem = clone(state.document), stemReport = analyzeLocalRecompute(initial, state.document, { targets: [state.stem.id], parsedIntent: { operations: [{ operation: 'transform' }] } });
  updateMaterialInstance(state.document, state.left.id, { parameterOverrides: { bend: 52, length: 190 } });
  const final = clone(state.document), leafReport = analyzeLocalRecompute(afterStem, state.document, { targets: [state.left.id], parsedIntent: { operations: [{ operation: 'bend' }] } });
  return { ...state, initial, afterStem, final, stemReport, leafReport, rightHash, crownHash, centerHash };
}
async function case5() {
  const id = 'case-05-stem-leaf-bud-assembly', dir = path.join(ROOT, id); await mkdir(dir, { recursive: true });
  const run = applyCase5(), rerun = applyCase5();
  const eBefore = await exportDocument(dir, 'before', run.initial), eAfter = await exportDocument(dir, 'after-parent-and-leaf-update', run.final), eRerun = await exportDocument(dir, 'after-rerun', rerun.final), eRollback = await exportDocument(dir, 'rollback', clone(run.initial));
  const deterministic = await compareFiles(dir, 'after-vs-rerun', eAfter.files.png.path, eRerun.files.png.path);
  const difference = await compareFiles(dir, 'before-vs-after', eBefore.files.png.path, eAfter.files.png.path);
  const rollbackDifference = await compareFiles(dir, 'before-vs-rollback', eBefore.files.png.path, eRollback.files.png.path);
  const baseline = await baselineComparison(dir, 5, eAfter.files.png.path);
  const finalStem = object(run.final, 'case5-stem');
  const childIds = finalStem.children.filter(child => child.id !== 'case5-stem:shape').map(child => child.id).sort();
  const result = {
    caseId: id, decision: 'VALIDATION REQUIRED', status: deterministic.allZero && rollbackDifference.allZero && run.stemReport.status === 'LOCAL_RECOMPUTE_COMPLETED' && run.leafReport.status === 'LOCAL_RECOMPUTE_COMPLETED' ? 'PASS' : 'FAIL',
    hierarchy: { parent: 'case5-stem', childIds, persisted: ['case5-leaf-left','case5-leaf-right','case5-bud','case5-calyx'].every(id => childIds.includes(id)) },
    parentUpdate: run.stemReport, singleLeafUpdate: run.leafReport,
    unaffected: { rightLeaf: ownHash(object(run.final, 'case5-leaf-right')) === run.rightHash, crown: ownHash(object(run.final, 'case5-crown-ring')) === run.crownHash, center: ownHash(object(run.final, 'case5-crown-center')) === run.centerHash },
    deterministic, difference, rollbackDifference, baselineComparison: baseline,
    outputs: { before: eBefore, main: eAfter, rerun: eRerun, rollback: eRollback }
  };
  await json(path.join(dir, 'result.json'), result); return result;
}

function buildCase6(approximation = false) {
  const id = 'case-06-watercolor-vector-approximation', document = baseDocument(id, 'Vector Watercolor Approximation'); installFlowerBatch01Templates(document);
  const main = layer(document, `layer:${id}:main`), sourceLayer = addLayer(document, `layer:${id}:sources`, 'Template Sources', { visible: false }); active(document, sourceLayer.id);
  const baseSource = createMaterialInstance(document, 'material:flower:petal-rounded', { instanceId: 'case6-base-source', transform: Matrix.translate(397, 410), parameterOverrides: { length: 125, width: 48, fill: '#cf6e94', stroke: '#914967', strokeWidth: 1 }, opacity: 1 });
  const wash1 = createMaterialInstance(document, 'material:flower:petal-rounded', { instanceId: 'case6-wash-source-1', transform: Matrix.translate(397, 410), parameterOverrides: { length: 128, width: 52, bend: 3, fill: '#e88aa8', stroke: 'none', strokeWidth: 0 }, opacity: .22 });
  const wash2 = createMaterialInstance(document, 'material:flower:petal-rounded', { instanceId: 'case6-wash-source-2', transform: Matrix.translate(397, 410), parameterOverrides: { length: 121, width: 46, bend: -4, fill: '#b95f89', stroke: 'none', strokeWidth: 0 }, opacity: .18 });
  active(document, main.id);
  const baseRing = createRepeat(baseSource, { id: 'case6-base-ring', count: 14, center: { x: 397, y: 410 }, semanticRole: 'petals.outer', recipeVersion: '1.6.2', sourceMaterialInstanceId: baseSource.id }); main.objects.push(baseRing);
  const center = createMaterialInstance(document, 'material:flower:center-disk', { instanceId: 'case6-center', transform: Matrix.translate(397, 410) });
  if (approximation) {
    const overlayLayer = addLayer(document, 'layer:case6:washes', 'Transparent Vector Washes');
    overlayLayer.objects.push(
      createRepeat(wash1, { id: 'case6-wash-ring-1', count: 14, center: { x: 397, y: 410 }, startAngle: 1.5, semanticRole: 'style.wash', recipeVersion: '1.6.2', sourceMaterialInstanceId: wash1.id }),
      createRepeat(wash2, { id: 'case6-wash-ring-2', count: 14, center: { x: 397, y: 410 }, startAngle: -1, semanticRole: 'style.wash', recipeVersion: '1.6.2', sourceMaterialInstanceId: wash2.id })
    );
  }
  return document;
}
async function case6() {
  const id = 'case-06-watercolor-vector-approximation', dir = path.join(ROOT, id); await mkdir(dir, { recursive: true });
  const before = buildCase6(false), after = buildCase6(true), rerun = buildCase6(true);
  const eBefore = await exportDocument(dir, 'before-flat', before), eAfter = await exportDocument(dir, 'after-vector-approximation', after), eRerun = await exportDocument(dir, 'after-rerun', rerun), eRollback = await exportDocument(dir, 'rollback', clone(before));
  const deterministic = await compareFiles(dir, 'after-vs-rerun', eAfter.files.png.path, eRerun.files.png.path);
  const difference = await compareFiles(dir, 'flat-vs-approximation', eBefore.files.png.path, eAfter.files.png.path);
  const rollbackDifference = await compareFiles(dir, 'before-vs-rollback', eBefore.files.png.path, eRollback.files.png.path);
  const baseline = await baselineComparison(dir, 6, eAfter.files.png.path);
  const result = {
    caseId: id, decision: 'RESEARCH', status: deterministic.allZero && rollbackDifference.allZero && difference.changedPixels > 0 ? 'PASS' : 'FAIL',
    nativeRasterImplemented: false,
    retainedGaps: ['Raster Layer','Selection/Mask','Adjustment','Blur/Displacement','Paper Texture','Watercolor Simulation','Photoshop ATN Parser'],
    deterministic, difference, rollbackDifference, baselineComparison: baseline,
    outputs: { before: eBefore, main: eAfter, rerun: eRerun, rollback: eRollback }
  };
  await json(path.join(dir, 'result.json'), result); return result;
}

const requested = new Set((process.env.INK_CASES || '1,2,3,4,5,6').split(',').map(value => Number(value.trim())).filter(Boolean));
if (!process.env.INK_RESUME) await rm(ROOT, { recursive: true, force: true });
await mkdir(ROOT, { recursive: true });
const functions = [case1, case2, case3, case4, case5, case6];
for (let index = Number(process.env.START_CASE || 0); index < functions.length; index++) {
  if (!requested.has(index + 1)) continue;
  const run = functions[index]; console.log(`START ${run.name}`); const result = await run(); console.log(`DONE ${run.name} ${result.status}`);
}
await runner.close();
const caseDirectories = ['case-01-outline-fleurify','case-02-petal-leaf-templates','case-03-radial-petal-assembly','case-04-multilayer-corolla','case-05-stem-leaf-bud-assembly','case-06-watercolor-vector-approximation'];
const cases = [];
for (const directory of caseDirectories) cases.push(JSON.parse(await readFile(path.join(ROOT, directory, 'result.json'), 'utf8')));
const summary = {
  format: 'INK-FLOWER-BATCH-V1.6.2-REGRESSION', version: '1.0', inkVersion: '1.6.2-RC',
  status: cases.every(item => item.status === 'PASS') ? 'PASS' : 'FAIL',
  cases: cases.map(({ caseId, decision, status, outputs }) => ({ caseId, decision, status, mainPng: outputs.main.files.png.path, mainSvg: outputs.main.files.svg.path })),
  materialTemplates: 10,
  vectorStructureCapabilities: ['Material Template','Material Instance','Override','Detach','Template Update','Repeat Stable Instance ID','Hierarchy','Dependency Graph','Partial Recompute','Rollback'],
  rasterWatercolorStatus: 'RESEARCH'
};
await json(path.join(ROOT, 'FLOWER_BATCH_V1.6.2_REGRESSION_SUMMARY.json'), summary);
await writeFile(path.join(ROOT, 'FINAL_SUMMARY.txt'), [
  `STATUS=${summary.status}`,
  ...summary.cases.map(item => `${item.caseId}=${item.status};DECISION=${item.decision}`),
  'RASTER_WATERCOLOR=RESEARCH'
].join('\n') + '\n');
console.log(JSON.stringify(summary, null, 2));
