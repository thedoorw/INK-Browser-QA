import fs from 'node:fs/promises';
import path from 'node:path';

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : fallback;
}

function routePrefix(p) {
  const seg = p.split('/').filter(Boolean)[0];
  return seg ? `/${seg}/` : '/';
}

function representative(records) {
  return [...records].sort((a, b) => {
    const depthA = a.path.split('/').filter(Boolean).length;
    const depthB = b.path.split('/').filter(Boolean).length;
    return depthA - depthB || a.path.length - b.path.length || a.path.localeCompare(b.path);
  })[0];
}

const configPath = arg('config', 'config/case-001.json');
const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
const censusPath = arg('census', path.join(config.artifactsDir ?? 'artifacts/case-001', 'census', 'site-census.json'));
const census = JSON.parse(await fs.readFile(censusPath, 'utf8'));

const groups = new Map();
for (const record of census.records ?? []) {
  if (!groups.has(record.signature)) groups.set(record.signature, []);
  groups.get(record.signature).push(record);
}

const families = [...groups.entries()]
  .map(([signature, records]) => {
    const rep = representative(records);
    const prefixCounts = {};
    for (const r of records) {
      const prefix = routePrefix(r.path);
      prefixCounts[prefix] = (prefixCounts[prefix] ?? 0) + 1;
    }
    return {
      signature,
      count: records.length,
      representative: rep?.path ?? null,
      routePrefixes: Object.entries(prefixCounts)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .map(([prefix, count]) => ({ prefix, count })),
      examples: records.slice(0, 8).map((r) => r.path),
      structuralProfile: rep ? {
        bodyClassTokens: rep.structure?.bodyClassTokens ?? [],
        landmarkSequence: rep.structure?.landmarkSequence ?? [],
        headingLevels: rep.structure?.headingLevels ?? [],
        tagCounts: rep.structure?.tagCounts ?? {},
        formCount: rep.structure?.forms?.length ?? 0,
        imageCount: rep.structure?.images?.length ?? 0
      } : null
    };
  })
  .sort((a, b) => b.count - a.count || a.signature.localeCompare(b.signature))
  .map((family, index) => ({ familyId: `FAM-${String(index + 1).padStart(3, '0')}`, ...family }));

const routePrefixSummary = {};
for (const record of census.records ?? []) {
  const prefix = routePrefix(record.path);
  routePrefixSummary[prefix] = (routePrefixSummary[prefix] ?? 0) + 1;
}

const output = {
  schema: 'ink-web-reproduction-page-families',
  version: 1,
  caseId: config.caseId,
  generatedAt: new Date().toISOString(),
  sourceCensus: censusPath,
  familyCount: families.length,
  routePrefixSummary: Object.entries(routePrefixSummary)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([prefix, count]) => ({ prefix, count })),
  families
};

const outDir = path.resolve(config.artifactsDir ?? 'artifacts/case-001', 'families');
await fs.mkdir(outDir, { recursive: true });
await fs.writeFile(path.join(outDir, 'page-families.json'), JSON.stringify(output, null, 2));
await fs.writeFile(
  path.join(outDir, 'representative-routes.json'),
  JSON.stringify(families.map(({ familyId, representative, count, routePrefixes }) => ({
    familyId, representative, count, routePrefixes
  })), null, 2)
);

console.log(JSON.stringify({
  caseId: config.caseId,
  familyCount: families.length,
  output: outDir
}, null, 2));
