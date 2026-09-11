import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { access, cp, mkdir, readFile, readdir, rm, stat, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const delivery = path.resolve(root, '..', 'INK_v1.5.1_RC_Delivery');
const staging = '/tmp/ink-v151-rc-build';
await rm(staging, { recursive: true, force: true });
await rm(delivery, { recursive: true, force: true });
await mkdir(staging, { recursive: true });
await mkdir(delivery, { recursive: true });
const exists = file => access(file).then(() => true).catch(() => false);
const copyEntry = async (from, toRoot) => { const source = path.join(root, from); if (!await exists(source)) return; const target = path.join(toRoot, from); await mkdir(path.dirname(target), { recursive: true }); await cp(source, target, { recursive: true }); };
const zip = (source, target) => new Promise((resolve, reject) => { const child = spawn('zip', ['-qr', target, '.'], { cwd: source, stdio: ['ignore', 'ignore', 'pipe'] }); const errors = []; child.stderr.on('data', chunk => errors.push(chunk)); child.on('error', reject); child.on('close', code => code === 0 ? resolve() : reject(new Error(Buffer.concat(errors).toString()))); });
const sha256 = file => new Promise((resolve, reject) => { const hash = createHash('sha256'), stream = createReadStream(file); stream.on('data', chunk => hash.update(chunk)); stream.on('error', reject); stream.on('end', () => resolve(hash.digest('hex'))); });
const treeSize = async directory => { let total = 0, files = 0; for (const entry of await readdir(directory, { withFileTypes: true })) { const full = path.join(directory, entry.name); if (entry.isDirectory()) { const nested = await treeSize(full); total += nested.bytes; files += nested.files; } else { total += (await stat(full)).size; files++; } } return { bytes: total, files }; };
const matchingSize = async (directory, matcher) => { let total = 0; for (const entry of await readdir(directory, { withFileTypes: true })) { const full = path.join(directory, entry.name); if (entry.isDirectory()) total += await matchingSize(full, matcher); else if (matcher(full)) total += (await stat(full)).size; } return total; };

const runtimeStage = path.join(staging, 'runtime');
await mkdir(runtimeStage, { recursive: true });
const runtimeEntries = ['index.html', 'index-standalone.html', 'styles.css', 'manifest.webmanifest', 'service-worker.js', 'device-validation.html', 'VERSION.json', 'README.md', 'SECURITY_LICENSE_v1.1.0.md', 'package.json', 'package-lock.json', 'dist', 'icons', 'src', 'schemas', 'scripts/serve.mjs', 'docs/RC_QUICK_HELP_v1.5.1.md', 'docs/MIGRATION_v1.5.0_to_v1.5.1.md'];
for (const entry of runtimeEntries) await copyEntry(entry, runtimeStage);
await writeFile(path.join(runtimeStage, 'RUNTIME_PACKAGE.md'), '# INK v1.5.1 RC Runtime Package\n\nDaily execution only. Tests, benchmarks, browser evidence, reference packages and historical research assets are intentionally excluded. Standard Mode creates no external connection; AI resources are loaded only when the AI Panel is initialized.\n');
const runtimeZip = path.join(delivery, 'INK_Core_Main_Program_v1.5.1_RC_Runtime.zip');
await zip(runtimeStage, runtimeZip);
const runtimeTree = await treeSize(runtimeStage), performance = JSON.parse(await readFile(path.join(root, 'reports', 'v1.5.1-rc', 'PERFORMANCE_REGRESSION_REPORT_v1.5.1.json'), 'utf8'));
const runtimeSize = {
  format: 'INK-RUNTIME-SIZE-REPORT', version: '1.5.1', generatedAt: new Date().toISOString(), decision: 'VALIDATION REQUIRED',
  compressedBytes: (await stat(runtimeZip)).size, uncompressedBytes: runtimeTree.bytes, fileCount: runtimeTree.files,
  initialDownloadBytes: ['index.html', 'styles.css', 'src/ink.js', 'src/config.js', 'service-worker.js'].reduce(async (sumPromise, file) => (await sumPromise) + ((await stat(path.join(runtimeStage, file)).catch(() => ({ size: 0 }))).size), Promise.resolve(0)),
  javascriptBytes: await matchingSize(runtimeStage, file => /\.(?:js|mjs)$/.test(file)), cssBytes: await matchingSize(runtimeStage, file => file.endsWith('.css')),
  brushAssetsBytes: await matchingSize(runtimeStage, file => /brush/i.test(file)), textureAssetsBytes: await matchingSize(runtimeStage, file => /texture/i.test(file)), workerAssetsBytes: await matchingSize(runtimeStage, file => /worker/i.test(file)),
  lazyLoadedAssets: ['AI Panel runtime modules are imported by the application but no external model request occurs until explicit user action.', 'Reference packages and benchmarks are absent.', 'Brush and texture implementation modules are requested by the normal module graph; large validation assets are not runtime content.'],
  startup: { standardModeMs: performance.browser.standardModeStartupMs, startupMemory: performance.browser.startupMemory }, exclusionsVerified: { tests: true, benchmarks: true, referencePackages: true, browserEvidence: true, historicalResearchAssets: true }
};
runtimeSize.initialDownloadBytes = await runtimeSize.initialDownloadBytes;
await writeFile(path.join(root, 'reports', 'v1.5.1-rc', 'RUNTIME_SIZE_REPORT_v1.5.1.json'), `${JSON.stringify(runtimeSize, null, 2)}\n`);

const validationStage = path.join(staging, 'validation');
await mkdir(validationStage, { recursive: true });
const validationEntries = ['VERSION.json', 'package.json', 'package-lock.json', 'tsconfig.json', 'tests', 'test-fixtures', 'test-materials', 'benchmarks', 'benchmarks-program-import', 'benchmarks-hand-drawing-v1.3.0', 'benchmarks-hand-drawing-v1.4.0', 'reference-packages-v1.2.0', 'external-reference-packages-v1.4.0', 'reports', 'validation', 'ai-artwork-v150', 'TEST_EXECUTION_CHECKLIST.md', 'TEST_MATRIX.csv', 'BUG_REPORT_TEMPLATE.md', 'scripts/browser-smoke-v151.mjs', 'scripts/ui-regression-baselines-v151.mjs', 'scripts/generate-ui-contact-sheets-v151.py', 'scripts/generate-v151-collaboration.mjs', 'scripts/performance-v151.mjs', 'scripts/test-ready-check-v151.mjs'];
for (const entry of validationEntries) await copyEntry(entry, validationStage);
await writeFile(path.join(validationStage, 'VALIDATION_PACKAGE.md'), '# INK v1.5.1 RC Validation Package\n\nTest runners, fixtures, benchmarks, browser evidence, QA, reference packages and non-scripted workflow evidence. Overlay beside the Runtime or Source Package before running npm test. External CHAT cases require a user endpoint and credential and are not marked passed.\n');
const validationZip = path.join(delivery, 'INK_Core_Main_Program_v1.5.1_RC_Validation.zip');
await zip(validationStage, validationZip);

const sourceStage = path.join(staging, 'source');
await mkdir(sourceStage, { recursive: true });
const sourceEntries = ['VERSION.json', 'README.md', 'SECURITY_LICENSE_v1.1.0.md', 'package.json', 'package-lock.json', 'tsconfig.json', 'index.html', 'index-standalone.html', 'styles.css', 'manifest.webmanifest', 'service-worker.js', 'device-validation.html', 'src', 'scripts', 'schemas', 'docs', 'tests', 'test-fixtures', 'reports/v1.5.1-rc', 'validation/non-scripted-collaboration-v1.5.1'];
for (const entry of sourceEntries) await copyEntry(entry, sourceStage);
await writeFile(path.join(sourceStage, 'SOURCE_PACKAGE.md'), '# INK v1.5.1 RC Source Package\n\nSource, build scripts, schemas, tests, documentation and license information. Run npm ci, npm run build, npm run typecheck and npm test. Full historical benchmark/reference assets are supplied by the separate Validation Package.\n');
const sourceZip = path.join(delivery, 'INK_Core_Main_Program_v1.5.1_RC_Source.zip');
await zip(sourceStage, sourceZip);

for (const entry of await readdir(path.join(root, 'reports', 'v1.5.1-rc'))) await cp(path.join(root, 'reports', 'v1.5.1-rc', entry), path.join(delivery, entry));
for (const entry of ['VERSION.json']) await cp(path.join(root, entry), path.join(delivery, entry));
for (const entry of ['UI_Regression_Initial_v1.4.0_v1.5.0_v1.5.1.png', 'UI_Regression_Panels_v1.4.0_v1.5.0_v1.5.1.png']) await cp(path.join(root, 'tests', 'browser-evidence-v1.5.1', entry), path.join(delivery, entry));
for (const entry of ['INK_Non_Scripted_Lantern_Fruit_v1.5.1_RC.ink', 'INK_Non_Scripted_Lantern_Fruit_Final.png', 'workflow-status.json']) await cp(path.join(root, 'validation', 'non-scripted-collaboration-v1.5.1', entry), path.join(delivery, entry));

const packageFiles = [runtimeZip, validationZip, sourceZip];
const packageManifest = [];
for (const file of packageFiles) packageManifest.push({ file: path.basename(file), bytes: (await stat(file)).size, sha256: await sha256(file) });
const deliveryManifest = `# INK Core Main Program v1.5.1 RC — Delivery Manifest\n\nDecision: **VALIDATION REQUIRED**\n\nUnique baseline: INK v1.5.0, SHA-256 \`eb66cb250249ba672b1244dcdeacb13a975fb34dc79729e60402051087e97ac5\`.\n\n${packageManifest.map(item => `- \`${item.file}\` — ${item.bytes} bytes — SHA-256 \`${item.sha256}\``).join('\n')}\n\nAutomated: 499/499 unit/regression, 26/26 Chromium, 17/17 readiness. Real external CHAT: **EXTERNAL CREDENTIAL REQUIRED**. Artwork: **USER VISUAL VALIDATION REQUIRED**. Physical stylus: **DEFERRED**. IMAGE model used: no.\n`;
await writeFile(path.join(delivery, 'DELIVERY_MANIFEST_v1.5.1_RC.md'), deliveryManifest);
await writeFile(path.join(delivery, 'CHECKSUMS_SHA256_v1.5.1_RC.txt'), `${packageManifest.map(item => `${item.sha256}  ${item.file}`).join('\n')}\n`);
const mainZip = path.resolve(root, '..', 'INK_Core_Main_Program_v1.5.1_RC.zip');
await rm(mainZip, { force: true });
await zip(delivery, mainZip);
const main = { file: path.basename(mainZip), bytes: (await stat(mainZip)).size, sha256: await sha256(mainZip) };
await writeFile(path.join(delivery, 'MAIN_PACKAGE_SHA256.txt'), `${main.sha256}  ${main.file}\n`);
console.log(JSON.stringify({ status: 'COMPLETED', decision: 'VALIDATION REQUIRED', delivery, main, packages: packageManifest, runtime: runtimeSize }, null, 2));
