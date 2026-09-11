#!/usr/bin/env node
import { access, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const args = Object.fromEntries(process.argv.slice(2).flatMap((value, index, all) =>
  value.startsWith('--') ? [[value.slice(2), all[index + 1]?.startsWith('--') ? true : all[index + 1]]] : []));
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sectionNames = ['CORE', 'WEB', 'HEADLESS', 'EXPORT', 'TEST', 'ASSETS', 'DEPENDENCIES'];
const sections = Object.fromEntries(sectionNames.map(name => [name, { status: 'PASS', checks: {} }]));
const report = {
  format: 'INK-DOCTOR-REPORT',
  version: '1.6.5',
  status: 'PASS',
  code: null,
  node: { version: process.version, supported: false },
  sections,
  errors: [],
  warnings: [],
  installCommand: 'npm ci',
  runtimeDependencyMode: 'BUNDLED_MODULES_AND_SYSTEM_CHROMIUM',
  limitations: [
    'Vector Watercolor is a deterministic editable procedural-equivalence implementation; the exact external Illustrator brush asset and pixel-equivalent Illustrator ground truth remain pending.',
    'The package PNG codec supports non-interlaced 8-bit RGB/RGBA PNG.',
    'Canonical PNG export requires a compatible system Chromium executable.'
  ]
};
let exitCode = 0;
let exporter;
let temp;

const setCheck = (section, name, status, details = undefined) => {
  sections[section].checks[name] = details === undefined ? status : { status, ...details };
  if (status === 'FAIL') sections[section].status = 'FAIL';
  else if (status === 'PARTIAL' && sections[section].status === 'PASS') sections[section].status = 'PARTIAL';
};
const fail = (section, error, code = 2) => {
  report.errors.push({ status: 'FAIL', ...error });
  setCheck(section, error.check || error.code, 'FAIL', error);
  exitCode = Math.max(exitCode, code);
};
const recordFile = async (section, name, relative, requiredBy = []) => {
  try {
    await access(path.join(root, relative));
    setCheck(section, name, 'PASS', { path: relative });
  } catch {
    fail(section, { code: 'RUNTIME_FILE_MISSING', check: name, expectedPath: relative, requiredBy }, 2);
  }
};

try {
  temp = await mkdtemp(path.join(os.tmpdir(), 'ink-doctor-'));
  await writeFile(path.join(temp, 'write-test'), 'INK');

  const major = Number(process.versions.node.split('.')[0]);
  report.node.supported = major >= 22 && major < 25;
  setCheck('CORE', 'node', report.node.supported ? 'PASS' : 'FAIL', {
    version: process.version,
    supportedRange: '>=22.0.0 <25'
  });
  if (!report.node.supported) {
    fail('CORE', { code: 'NODE_VERSION_UNSUPPORTED', check: 'node', detected: process.version, supportedRange: '>=22.0.0 <25' }, 2);
  }
  setCheck('CORE', 'writePermission', 'PASS');
  setCheck('CORE', 'temporaryDirectory', 'PASS', { path: os.tmpdir() });

  try {
    const packageJson = JSON.parse(await readFile(path.join(root, 'package.json'), 'utf8'));
    const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8'));
    const dependencies = Object.keys(packageJson.dependencies || {});
    const devDependencies = Object.keys(packageJson.devDependencies || {});
    const invalid = Object.entries(lock.packages || {}).filter(([key, value]) =>
      key && (!value.version || (!value.link && (!value.resolved || !value.integrity))));
    const versionAligned = lock.packages?.['']?.version === packageJson.version && (lock.version === undefined || lock.version === packageJson.version);
    if (lock.lockfileVersion !== 3 || invalid.length || !versionAligned) {
      fail('DEPENDENCIES', {
        code: 'PACKAGE_LOCK_INVALID',
        check: 'packageLock',
        lockfileVersion: lock.lockfileVersion,
        packageVersion: packageJson.version,
        rootLockVersion: lock.packages?.['']?.version,
        invalidEntries: invalid.map(([key]) => key)
      }, 2);
    } else {
      setCheck('DEPENDENCIES', 'packageLock', 'PASS', {
        lockfileVersion: 3,
        packageEntries: Object.keys(lock.packages).length - 1,
        packageVersion: packageJson.version
      });
    }
    setCheck('DEPENDENCIES', 'requiredNpmDependencies', dependencies.length === 0 ? 'PASS' : 'FAIL', { dependencies });
    setCheck('DEPENDENCIES', 'requiredDevDependencies', devDependencies.length === 0 ? 'PASS' : 'FAIL', { devDependencies });
    if (dependencies.length || devDependencies.length) {
      fail('DEPENDENCIES', { code: 'UNEXPECTED_NPM_DEPENDENCY', check: 'dependencyManifest', dependencies, devDependencies }, 2);
    }
  } catch (error) {
    fail('DEPENDENCIES', { code: 'PACKAGE_LOCK_INVALID', check: 'packageLock', message: error.message }, 2);
  }

  for (const item of [
    ['CORE', 'runtimeModules', 'src/ink.js'],
    ['CORE', 'recipeEngine', 'src/recipe/recipe-engine.js'],
    ['CORE', 'recipeSchema', 'schemas/ink-recipe-v1.schema.json'],
    ['CORE', 'semanticModel', 'src/semantic/semantic-model.js'],
    ['CORE', 'dependencyGraph', 'src/recompute/dependency-graph.js'],
    ['CORE', 'changeDomain', 'src/recompute/change-domain.js'],
    ['CORE', 'affectedScope', 'src/recompute/affected-scope.js'],
    ['CORE', 'localRecompute', 'src/recompute/local-recompute.js'],
    ['CORE', 'materialLibrary', 'src/material/material-library.js'],
    ['CORE', 'repeatIdentity', 'src/repeat/repeat-identity.js'],
    ['CORE', 'pngCodec', 'src/compare/png-codec.js'],
    ['CORE', 'expressionIR', 'src/program-import/expression-ir.js'],
    ['CORE', 'deformation', 'src/vector/deformation.js'],
    ['CORE', 'compositionConstraints', 'src/composition/composition-constraints.js'],
    ['CORE', 'vectorWatercolor', 'src/paint/vector-watercolor.js'],
    ['CORE', 'svgIdNormalizer', 'src/vector/svg-id-normalizer.js'],
    ['CORE', 'vendoredPolygonClipping', 'src/vendor/polygon-clipping.umd.min.js'],
    ['CORE', 'rollback', 'src/history/history.js'],
    ['WEB', 'webEntry', 'index.html'],
    ['WEB', 'standaloneEntry', 'index-standalone.html'],
    ['WEB', 'compatBundle', 'dist/ink.compat.js'],
    ['HEADLESS', 'headlessRuntime', 'src/headless/headless-runtime.js'],
    ['HEADLESS', 'canonicalRenderer', 'src/headless/chromium-cdp-renderer.js'],
    ['HEADLESS', 'cliEntry', 'scripts/ink-cli.mjs'],
    ['HEADLESS', 'session', 'src/headless/session-manager.js'],
    ['HEADLESS', 'structuralQA', 'src/headless/structural-qa.js'],
    ['HEADLESS', 'visualQA', 'src/headless/visual-qa.js'],
    ['EXPORT', 'exportBackend', 'src/headless/export-runner.js'],
    ['TEST', 'unitRegression', 'tests/unit'],
    ['TEST', 'headlessRegression', 'tests/headless'],
    ['TEST', 'v160Regression', 'tests/v160'],
    ['TEST', 'v161Regression', 'tests/v161'],
    ['TEST', 'v162Regression', 'tests/v162'],
    ['TEST', 'v163Regression', 'tests/v163'],
    ['TEST', 'v163IdRegression', 'tests/v163-id'],
    ['TEST', 'v164Regression', 'tests/v164'],
    ['TEST', 'v165Regression', 'tests/v165'],
    ['ASSETS', 'assetManifest', 'ASSET_MANIFEST.json'],
    ['ASSETS', 'materialTemplates', 'assets/material/flower-batch-01-templates-v1.6.2.json'],
    ['ASSETS', 'behaviorMapping', 'assets/behavior/flower-vector-structure-v1.6.2.json'],
    ['ASSETS', 'vectorWatercolorBehaviorCandidates', 'assets/behavior/vector-watercolor-candidates-v1.6.3.json'],
    ['ASSETS', 'vectorWatercolorMaterialCandidates', 'assets/material/vector-watercolor-candidates-v1.6.3.json'],
    ['ASSETS', 'jsxModuleCandidates', 'assets/program-modules/illustrator-jsx-module-candidates-v1.6.3.json'],
    ['ASSETS', 'videoTimeline', 'INTELLIGENCE_CANDIDATES/Video_Observed_Behaviors/Illustrator_Vector_Watercolor_Video_Timeline.json'],
    ['ASSETS', 'videoDerivedRecipe', 'INTELLIGENCE_CANDIDATES/Video_Derived_Recipes/Illustrator_Vector_Watercolor_Flower_Video_Derived_Recipe_v0.2.json'],
    ['ASSETS', 'videoBenchmarkSummary', 'Validation/v1.6.3/VW-VIDEO-01/VW-VIDEO-01-summary.json'],
    ['ASSETS', 'case5NormalizationSummary', 'Validation/v1.6.3/case-05-id-normalization/Case_5_ID_Normalization_Summary.json']
  ]) await recordFile(item[0], item[1], item[2], [item[1]]);

  if (sections.CORE.status === 'PASS' && sections.HEADLESS.status === 'PASS' && sections.DEPENDENCIES.status === 'PASS') {
    const [
      { AssetManager },
      { buildDependencyGraph },
      { validateSemanticDocument },
      { ExportRunner },
      { deterministicBlankDocument, SessionManager },
      { chromiumExecutable }
    ] = await Promise.all([
      import('../src/assets/asset-manifest.js'),
      import('../src/recompute/dependency-graph.js'),
      import('../src/semantic/semantic-validator.js'),
      import('../src/headless/export-runner.js'),
      import('../src/headless/session-manager.js'),
      import('../src/headless/chromium-cdp-renderer.js')
    ]);

    const executable = await chromiumExecutable();
    await access(executable);
    setCheck('HEADLESS', 'chromiumExecutable', 'PASS', { path: executable });

    const document = deterministicBlankDocument();
    const graph = buildDependencyGraph(document);
    const semantic = validateSemanticDocument(document);
    setCheck('CORE', 'semanticValidation', semantic.passed ? 'PASS' : 'FAIL');
    setCheck('CORE', 'dependencyGraphValidation', graph.missingDependencies.length ? 'FAIL' : 'PASS', {
      missingDependencies: graph.missingDependencies
    });
    if (!semantic.passed || graph.missingDependencies.length) exitCode = 2;

    const manager = new SessionManager({ root: path.join(temp, 'sessions') });
    const session = await manager.create({ seed: 15101 });
    const reopened = await manager.document(session.sessionId);
    const sessionPass = reopened.session.sessionId === session.sessionId;
    setCheck('HEADLESS', 'sessionPersistence', sessionPass ? 'PASS' : 'FAIL');
    if (!sessionPass) exitCode = 2;

    const assetManager = new AssetManager({ root });
    await assetManager.load();
    const assetAudit = await assetManager.audit();
    setCheck('ASSETS', 'manifestAudit', assetAudit.status, { summary: assetAudit.summary || null });
    if (assetAudit.status === 'FAIL') exitCode = 2;
    else if (assetAudit.status === 'PARTIAL') exitCode = Math.max(exitCode, 1);

    exporter = new ExportRunner({ root });
    const first = await exporter.export(document, {
      output: path.join(temp, 'export-1'), formats: ['png', 'svg'], basename: 'doctor', width: 256, height: 256
    });
    const second = await exporter.export(document, {
      output: path.join(temp, 'export-2'), formats: ['png', 'svg'], basename: 'doctor', width: 256, height: 256
    });
    const exportChecks = {
      svg: first.files.svg?.bytes > 0,
      png: first.files.png?.bytes > 0,
      canonicalRenderer: first.files.png?.backend === 'CHROMIUM_CDP_CANONICAL_PNG',
      deterministicSvg: first.files.svg?.sha256 === second.files.svg?.sha256,
      deterministicPng: first.files.png?.sha256 === second.files.png?.sha256
    };
    for (const [name, passed] of Object.entries(exportChecks)) {
      setCheck('EXPORT', name, passed ? 'PASS' : 'FAIL', name === 'canonicalRenderer' ? { backend: first.files.png?.backend } : undefined);
      if (!passed) exitCode = 2;
    }
  } else {
    fail('EXPORT', { code: 'RUNTIME_PREREQUISITE_FAILED', check: 'runtimeExecution' }, 2);
  }
} catch (error) {
  fail('CORE', {
    code: error.code || 'DOCTOR_FAILED',
    check: 'doctorExecution',
    message: error.message,
    stage: error.stage,
    details: error.details || {}
  }, 2);
} finally {
  if (exporter) await exporter.close();
  if (temp) await rm(temp, { recursive: true, force: true });
}

for (const section of Object.values(sections)) {
  if (section.status === 'FAIL') exitCode = Math.max(exitCode, 2);
  else if (section.status === 'PARTIAL') exitCode = Math.max(exitCode, 1);
}
report.status = exitCode === 0 ? 'PASS' : exitCode === 1 ? 'PARTIAL' : 'FAIL';
report.code = report.errors[0]?.code || null;
if (args.output && args.output !== true) await writeFile(path.resolve(args.output), `${JSON.stringify(report, null, 2)}\n`);
process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
process.exitCode = exitCode;
