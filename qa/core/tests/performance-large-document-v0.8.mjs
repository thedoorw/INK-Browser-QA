import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { defaultDocument, inspectDocument, migrateDocument } from '../src/document/index.js';
import { PageSpatialIndex } from '../src/spatial/index.js';

const objectCount = 20000;
const pointsPerStroke = 5;
const document = defaultDocument();
document.title = 'INK v3.3 Large Document Regression';
const page = document.pages[0];
const layer = page.layers[0];
const columns = 200;

const heapBefore = process.memoryUsage().heapUsed;
const createStart = performance.now();
for (let index = 0; index < objectCount; index++) {
  const col = index % columns;
  const row = Math.floor(index / columns);
  layer.objects.push({
    id: `large-${index}`,
    type: 'stroke',
    name: '大型文件筆畫',
    matrix: [1, 0, 0, 1, col * 18 - 1800, row * 14 - 700],
    opacity: 1,
    color: index % 7 === 0 ? '#2f718f' : '#202020',
    size: 2 + (index % 4),
    kind: index % 11 === 0 ? 'brush' : 'pen',
    smoothing: .48,
    pressure: .72,
    flow: .8,
    wetness: index % 11 === 0 ? .42 : 0,
    points: Array.from({ length: pointsPerStroke }, (_, pointIndex) => ({
      x: pointIndex * 8,
      y: Math.sin((index + pointIndex) * .17) * 5,
      p: .25 + pointIndex * .15,
      t: pointIndex * 8
    }))
  });
}
const createMs = performance.now() - createStart;

const integrityStart = performance.now();
const integrity = inspectDocument(document);
const integrityMs = performance.now() - integrityStart;

const serializeStart = performance.now();
const json = JSON.stringify(document);
const parsed = JSON.parse(json);
const serializeRoundTripMs = performance.now() - serializeStart;

const migrateStart = performance.now();
const migrated = migrateDocument(parsed);
const migrateMs = performance.now() - migrateStart;

const boundsOf = object => {
  const tx = object.matrix?.[4] || 0;
  const ty = object.matrix?.[5] || 0;
  const points = object.points || [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const point of points) {
    minX = Math.min(minX, point.x + tx);
    minY = Math.min(minY, point.y + ty);
    maxX = Math.max(maxX, point.x + tx);
    maxY = Math.max(maxY, point.y + ty);
  }
  const pad = object.size || 1;
  return { x: minX - pad, y: minY - pad, w: maxX - minX + pad * 2, h: maxY - minY + pad * 2 };
};

const spatial = new PageSpatialIndex();
const spatialStart = performance.now();
spatial.rebuild(migrated.pages[0], boundsOf);
const spatialBuildMs = performance.now() - spatialStart;
const queryStart = performance.now();
let candidateTotal = 0;
for (let index = 0; index < 1000; index++) {
  const x = (index % 50) * 72 - 1800;
  const y = Math.floor(index / 50) * 50 - 700;
  candidateTotal += spatial.query({ x, y, w: 180, h: 120 }).length;
}
const spatialQueryMs = performance.now() - queryStart;
const heapAfter = process.memoryUsage().heapUsed;
const heapDeltaMiB = (heapAfter - heapBefore) / 1048576;

const report = {
  version: '0.8.3',
  objectCount,
  points: objectCount * pointsPerStroke,
  jsonBytes: Buffer.byteLength(json),
  createMs,
  integrityMs,
  serializeRoundTripMs,
  migrateMs,
  spatialBuildMs,
  spatialQueryMs,
  candidateTotal,
  heapDeltaMiB,
  integrity: {
    passed: integrity.passed,
    warnings: integrity.warnings.length,
    fingerprint: integrity.fingerprint,
    stats: integrity.stats
  },
  spatial: spatial.stats(),
  passed: integrity.passed
    && integrity.stats.objects === objectCount
    && integrity.stats.points === objectCount * pointsPerStroke
    && spatial.stats().objects === objectCount
    && createMs < 10000
    && integrityMs < 10000
    && serializeRoundTripMs < 10000
    && migrateMs < 10000
    && spatialBuildMs < 10000
    && spatialQueryMs < 5000
    && heapDeltaMiB < 400
};

fs.writeFileSync(new URL('./performance-large-document-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
