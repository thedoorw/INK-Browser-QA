import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AssetManager } from '../../src/assets/asset-manifest.js';
import { AssetError } from '../../src/assets/asset-error.js';
import { PreviewCompare } from '../../src/compare/preview-compare.js';
import { ExportRunner } from '../../src/headless/export-runner.js';
import { createInkHeadlessRuntime } from '../../src/headless/headless-runtime.js';
import { deterministicBlankDocument } from '../../src/headless/session-manager.js';
import { createAnchor, createPath } from '../../src/vector/vector-core.js';
import { migrateDocument } from '../../src/document/migration.js';
import { INK_VERSION } from '../../src/config.js';

const runtimeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const withShape = (id, fill = '#cc6688') => { const document = migrateDocument(deterministicBlankDocument(1600)); document.pages[0].layers[0].objects.push(createPath({ id, name: id, fill, subpaths: [{ role: 'outer', closed: true, anchors: [createAnchor(320, 320), createAnchor(470, 320), createAnchor(395, 480)] }], metadata: { semanticLabel: 'petal' } })); return migrateDocument(document); };

test('Preview Compare emits the standardized twelve-file evidence set and undeclared-change classification', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-v160-compare-')), exporter = new ExportRunner({ root: runtimeRoot });
  try {
    const before = withShape('petal-1'), after = structuredClone(before); after.pages[0].layers[0].objects[0].fill = '#771122';
    const report = await new PreviewCompare({ exporter }).create(before, after, { output: temp, declaredTargets: ['petal-1'], beforeParameters: { color: '#cc6688' }, afterParameters: { color: '#771122' } });
    assert.equal(report.status, 'PASS'); assert.equal(report.semanticDifference.modified.length, 1); assert.equal(report.semanticDifference.undeclaredChanges.length, 0);
    for (const file of report.files) assert.ok((await readFile(path.join(temp, file))).length > 0, file);
  } finally { await exporter.close(); await rm(temp, { recursive: true, force: true }); }
});

test('Asset Manifest handles complete, optional, fallback, linked, portable, hash mismatch and structured missing errors without ENOENT leakage', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-v160-assets-'));
  try {
    await writeFile(path.join(temp, 'present.txt'), 'asset');
    const manifest = { format: 'INK-ASSET-MANIFEST', version: '1.0', assets: [
      { assetId: 'present', type: 'fixture', path: 'present.txt', embedded: true, optional: false, hash: '', size: 5, source: 'test', license: 'MIT', fallback: null, usedBy: ['test'] },
      { assetId: 'optional', type: 'font', path: 'optional.ttf', embedded: false, optional: true, hash: '', size: 0, source: 'test', license: 'MIT', fallback: null, usedBy: [] },
      { assetId: 'fallback', type: 'brush', path: 'missing.brush', embedded: false, optional: false, hash: '', size: 0, source: 'test', license: 'MIT', fallback: 'builtin:basic', usedBy: ['test'] },
      { assetId: 'required', type: 'image', path: 'required.png', embedded: false, optional: false, hash: '', size: 0, source: 'test', license: 'MIT', fallback: null, usedBy: ['test'] }
    ] };
    const manager = new AssetManager({ root: temp, manifest }); assert.equal((await manager.check('present')).status, 'AVAILABLE'); assert.equal((await manager.check('optional')).status, 'OPTIONAL_MISSING'); assert.equal((await manager.check('fallback')).status, 'FALLBACK');
    await assert.rejects(() => manager.check('required'), error => error instanceof AssetError && error.code === 'ASSET_MISSING' && !/ENOENT/.test(error.message));
    assert.equal(manager.linkedDocument(['present']).mode, 'Linked Document'); const portable = await manager.portablePackage(['present'], path.join(temp, 'portable')); assert.equal(portable.copied.length, 1);
    manifest.assets[0].hash = 'bad'; await assert.rejects(() => manager.check('present'), error => error.code === 'ASSET_HASH_MISMATCH');
  } finally { await rm(temp, { recursive: true, force: true }); }
});

test('Web, CLI and JavaScript API share the AI core; old document and Session migrate without format breakage', async () => {
  const temp = await mkdtemp(path.join(os.tmpdir(), 'ink-v160-integration-')), runtime = await createInkHeadlessRuntime({ root: path.join(temp, 'runtime'), projectRoot: runtimeRoot });
  try {
    const legacy = deterministicBlankDocument(15101); delete legacy.semanticModel; delete legacy.assetManifest;
    const session = await runtime.createSession({ document: legacy, sessionId: 'session-v160-migration' }), reopened = await runtime.sessions.document(session.sessionId);
    assert.equal(reopened.document.format, 'INK'); assert.equal(reopened.document.formatVersion, 4); assert.equal(reopened.document.appVersion, INK_VERSION); assert.equal(reopened.document.semanticModel.version, '1.0'); assert.equal(reopened.document.assetManifest.version, '1.0');
    const plan = await runtime.plan({ sessionId: session.sessionId, prompt: '畫一朵正面的粉紅色花，白底，兩片綠葉，置中，簡單乾淨。' }); assert.equal(plan.status, 'READY');
    const preview = await runtime.preview({ sessionId: session.sessionId, plan, output: path.join(temp, 'preview') }); assert.equal(preview.approvalRequired, true); assert.ok(preview.compare.files.includes('side_by_side.png'));
    const approval = await runtime.approve({ sessionId: session.sessionId, preview, decision: 'approve', output: path.join(temp, 'approval.json') }); const execution = await runtime.execute({ sessionId: session.sessionId, plan, approval, output: path.join(temp, 'execute') }); assert.equal(execution.localRecompute.status, 'FULL_DOCUMENT_INITIAL_CREATION');
    const resumed = await runtime.sessions.document(session.sessionId); assert.equal(resumed.session.rounds.length, 1); assert.equal(resumed.document.pages[0].layers.flatMap(layer => layer.objects).length, 14);
  } finally { await runtime.close(); await rm(temp, { recursive: true, force: true }); }
});
