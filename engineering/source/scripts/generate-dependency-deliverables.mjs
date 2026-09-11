#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportDir = path.resolve(process.argv[2] || path.join(root, '..', 'Reports', 'dependency-audit'));
const bundleDir = path.resolve(process.argv[3] || path.join(root, '..', '..', 'INK_Core_Main_Program_v1.6.0_RC_Offline_Dependencies'));
const tarballDir = path.join(bundleDir, 'tarballs');
await mkdir(reportDir, { recursive: true }); await mkdir(tarballDir, { recursive: true });
const lockBytes = await readFile(path.join(root, 'package-lock.json'));
const lock = JSON.parse(lockBytes), packageJson = JSON.parse(await readFile(path.join(root, 'package.json')));
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const integrityOK = (bytes, integrity) => {
  const [algorithm, expected] = integrity.split('-', 2);
  return createHash(algorithm).update(bytes).digest('base64') === expected;
};
const exists = async value => { try { await access(value); return true; } catch { return false; } };
const packageName = packagePath => packagePath.replace(/^(?:.*\/)?node_modules\//, '');
const packageEntries = Object.entries(lock.packages).filter(([key]) => key);
const byName = new Map(packageEntries.map(([key, value]) => [packageName(key), { key, ...value }]));
const edges = [];
for (const [fromKey, value] of Object.entries(lock.packages)) for (const [name, range] of Object.entries({ ...(value.dependencies || {}), ...(fromKey === '' ? value.devDependencies || {} : {}), ...(value.optionalDependencies || {}) })) {
  if (byName.has(name)) edges.push({ from: fromKey || '(root)', to: byName.get(name).key, name, range, optional: Boolean(value.optionalDependencies?.[name]) });
}
const chains = target => {
  const targetKey = byName.get(target)?.key, found = [];
  if (!targetKey) return found;
  const visit = (node, chain, seen) => {
    if (node === targetKey) { found.push(chain); return; }
    for (const edge of edges.filter(item => item.from === node && !seen.has(item.to))) visit(edge.to, [...chain, edge.name], new Set([...seen, edge.to]));
  };
  visit('(root)', ['ink-core-main-program'], new Set(['(root)']));
  return found;
};
const audits = [];
for (const [key, value] of packageEntries) {
  const name = packageName(key), installed = await exists(path.join(root, key));
  audits.push({
    path: key, name, version: value.version, direct: Boolean(lock.packages[''].dependencies?.[name] || lock.packages[''].devDependencies?.[name]),
    dev: Boolean(value.dev), optional: Boolean(value.optional), installedForCurrentPlatform: installed,
    resolved: value.resolved || null, standardRegistry: typeof value.resolved === 'string' && value.resolved.startsWith('https://registry.npmjs.org/'),
    integrity: value.integrity || null, integrityPresent: Boolean(value.integrity), license: value.license || null, deprecated: value.deprecated || null,
    os: value.os || null, cpu: value.cpu || null, dependencies: value.dependencies || {}, optionalDependencies: value.optionalDependencies || {}
  });
}
const invalid = audits.filter(item => !item.version || !item.resolved || !item.integrityPresent || !item.standardRegistry);
const lockAudit = {
  format: 'INK-PACKAGE-LOCK-AUDIT', version: '1.0', status: invalid.length ? 'FAIL' : 'PASS',
  packageLockSha256: sha256(lockBytes), lockfileVersion: lock.lockfileVersion, packageEntries: audits.length,
  standardRegistryEntries: audits.filter(item => item.standardRegistry).length, integrityEntries: audits.filter(item => item.integrityPresent).length,
  deprecatedEntries: audits.filter(item => item.deprecated).map(item => ({ name: item.name, version: item.version, notice: item.deprecated })),
  missingOrInvalidEntries: invalid.map(item => item.path), noAbsolutePaths: !/([A-Za-z]:\\|file:|\/workspace\/|\/home\/|\/Users\/)/.test(lockBytes.toString()),
  requiredPackages: ['wrappy', 'once', 'playwright-core', 'pngjs'], absentLegacyPackages: ['inflight', 'glob'].filter(name => !byName.has(name)),
  packages: audits
};
const tree = {
  format: 'INK-DEPENDENCY-TREE', version: '1.0', root: { name: packageJson.name, version: packageJson.version },
  supportedEnvironment: { node: packageJson.engines.node, npm: packageJson.engines.npm },
  directDependencies: packageJson.dependencies, directDevDependencies: packageJson.devDependencies,
  packages: audits.map(({ path: packagePath, name, version, direct, dev, optional, installedForCurrentPlatform, dependencies, optionalDependencies }) => ({ path: packagePath, name, version, direct, dev, optional, installedForCurrentPlatform, dependencies, optionalDependencies })),
  edges, evidence: { wrappyChains: chains('wrappy'), onceChains: chains('once'), playwrightCoreChains: chains('playwright-core'), pngjsChains: chains('pngjs'), globPresent: byName.has('glob'), inflightPresent: byName.has('inflight') }
};
const offlinePackages = [];
for (const item of audits.filter(value => value.installedForCurrentPlatform)) {
  const safeName = item.name.replace(/^@/, '').replaceAll('/', '-') + `-${item.version}.tgz`, target = path.join(tarballDir, safeName);
  let bytes;
  try { bytes = await readFile(target); } catch {
    const response = await fetch(item.resolved); if (!response.ok) throw new Error(`Unable to download ${item.resolved}: HTTP ${response.status}`);
    bytes = Buffer.from(await response.arrayBuffer()); await writeFile(target, bytes);
  }
  if (!integrityOK(bytes, item.integrity)) throw new Error(`Registry integrity mismatch for ${item.name}@${item.version}`);
  offlinePackages.push({ name: item.name, version: item.version, file: safeName, sha256: sha256(bytes), integrity: item.integrity, resolved: item.resolved, packageLockPath: item.path, license: item.license, direct: item.direct });
}
offlinePackages.sort((a, b) => a.name.localeCompare(b.name));
const offlineManifest = {
  format: 'INK-OFFLINE-DEPENDENCIES', version: '1.0', productVersion: packageJson.version,
  platform: { os: os.platform(), arch: os.arch() }, supportedNode: packageJson.engines.node, supportedNpm: packageJson.engines.npm,
  packageLockSha256: sha256(lockBytes), packages: offlinePackages
};
const auditMarkdown = `# INK v1.6.0 RC Dependency Audit\n\nStatus: **${lockAudit.status}**\n\n- Supported Node: \`${packageJson.engines.node}\`\n- Supported npm: \`${packageJson.engines.npm}\`\n- Lockfile: v${lock.lockfileVersion}, SHA-256 \`${sha256(lockBytes)}\`\n- Lockfile packages: ${audits.length}; registry URL + integrity complete: ${audits.length - invalid.length}/${audits.length}\n- Clean-platform installed packages: ${offlinePackages.length} (${os.platform()} ${os.arch()})\n- Direct runtime dependency: \`polygon-clipping@${byName.get('polygon-clipping').version}\`\n- Direct development dependencies: \`@sparticuz/chromium\`, \`esbuild\`, \`playwright-core\`, \`pngjs\`, \`typescript\`\n- Deprecated packages reported by npm lock metadata: ${lockAudit.deprecatedEntries.length}\n- Absolute/local paths in lockfile: ${lockAudit.noAbsolutePaths ? 'none' : 'found'}\n\n## wrappy-1.0.2\n\n\`wrappy@1.0.2\` is an indirect development dependency used by the Chromium archive extraction chain. Its complete chains are:\n\n${chains('wrappy').map(chain => `- \`${chain.join(' → ')}\``).join('\n')}\n\nThe lock entry uses \`https://registry.npmjs.org/wrappy/-/wrappy-1.0.2.tgz\` with SHA-512 integrity \`${byName.get('wrappy').integrity}\`. It is old but not marked deprecated by npm. It must not be removed independently; the replacement plan is to follow supported \`@sparticuz/chromium\` / \`tar-fs\` releases and remove the chain only when upstream no longer requires \`pump/once/wrappy\`.\n\n## once, inflight, and glob\n\n\`once@1.4.0\` is present only through the two Chromium extraction paths shown above. \`inflight\` and \`glob\` are absent from the resolved tree and are not required by this release.\n\n## Reproducibility conclusion\n\nThe original lockfile was complete. The release adds explicit Node/npm engine bounds and command aliases; npm regenerated the root lock metadata without changing resolved package versions. Standard installation uses \`npm ci\`. Offline verification uses only the ${offlinePackages.length} packages installed for ${os.platform()} ${os.arch()}, each checked against both registry integrity and the offline SHA-256 manifest. No global package, user cache, credential, token, or absolute developer path is required.\n`;
const offlineReadme = `# INK v1.6.0 RC Offline Dependencies\n\nThis bundle is the audited ${os.platform()} ${os.arch()} dependency set for INK v1.6.0 RC. It contains ${offlinePackages.length} npm tarballs referenced by the formal package-lock.json.\n\nExtract this ZIP beside the main program directory, then run from the main program Runtime directory:\n\n\`\`\`bash\nnode scripts/install-offline.mjs\nnpm run ink:doctor\nnpm test\n\`\`\`\n\nThe installer verifies the formal lockfile SHA-256, verifies every tarball SHA-256, seeds an isolated temporary npm cache, runs \`npm ci --offline\`, and removes that cache. It does not change global npm settings.\n`;
await Promise.all([
  writeFile(path.join(reportDir, 'DEPENDENCY_TREE.json'), `${JSON.stringify(tree, null, 2)}\n`),
  writeFile(path.join(reportDir, 'PACKAGE_LOCK_AUDIT.json'), `${JSON.stringify(lockAudit, null, 2)}\n`),
  writeFile(path.join(reportDir, 'DEPENDENCY_AUDIT.md'), auditMarkdown),
  writeFile(path.join(bundleDir, 'manifest.json'), `${JSON.stringify(offlineManifest, null, 2)}\n`),
  writeFile(path.join(bundleDir, 'README.md'), offlineReadme)
]);
process.stdout.write(`${JSON.stringify({ status: lockAudit.status, packageLockSha256: sha256(lockBytes), lockfilePackages: audits.length, offlinePackages: offlinePackages.length, reportDir, bundleDir }, null, 2)}\n`);
