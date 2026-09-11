import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { PageSpatialIndex } from '../src/spatial/index.js';

function makePage(count) {
  const columns = Math.ceil(Math.sqrt(count));
  const objects = new Array(count);
  for (let index = 0; index < count; index += 1) {
    const col = index % columns, row = Math.floor(index / columns);
    objects[index] = { id: `stress-${count}-${index}`, bounds: { x: col * 18, y: row * 14, w: 10, h: 4 } };
  }
  return { id: `stress-page-${count}`, layers: [{ id: 'layer-1', visible: true, objects }] };
}
function run(count) {
  const page = makePage(count), beforeMemory = process.memoryUsage().heapUsed, index = new PageSpatialIndex();
  const buildStart = performance.now();index.rebuild(page, object => object.bounds);const buildMs = performance.now() - buildStart;
  const queryStart = performance.now();const result = index.query({ x: 600, y: 400, w: 120, h: 120 });const queryMs = performance.now() - queryStart;
  const target = page.layers[0].objects[Math.floor(count / 2)];target.bounds = { x: 610, y: 410, w: 10, h: 4 };
  const updateStart = performance.now();const updated = index.syncObject(page, target.id, object => object.bounds);const updateMs = performance.now() - updateStart;
  const stats = index.stats(), afterMemory = process.memoryUsage().heapUsed;
  return { count, passed: updated && stats.objects === count && stats.fullRebuilds === 1 && stats.incrementalUpdates === 1 && result.length < Math.max(1000, count * .05), buildMs: +buildMs.toFixed(3), queryMs: +queryMs.toFixed(3), updateMs: +updateMs.toFixed(3), candidates: result.length, heapDeltaBytes: afterMemory - beforeMemory, stats };
}
const report = { version: '0.8.3', environment: { node: process.version, platform: process.platform, arch: process.arch }, cases: [run(10000), run(50000)], note: 'Spatial timings are environment-specific regression observations, not cross-device guarantees.' };
report.passed = report.cases.every(item => item.passed);
fs.writeFileSync(new URL('./performance-spatial-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));if (!report.passed) process.exitCode = 1;
