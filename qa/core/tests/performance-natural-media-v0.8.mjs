import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { buildNaturalMediaStamps, naturalMediaFingerprint } from '../src/render/index.js';

function makeStroke(pointCount, kind = 'brush') {
  const points = Array.from({ length: pointCount }, (_, index) => ({
    x: index * 1.25,
    y: Math.sin(index * .045) * 38 + Math.sin(index * .009) * 12,
    p: .2 + .8 * ((Math.sin(index * .031) + 1) / 2),
    tiltX: Math.sin(index * .013) * 35,
    tiltY: Math.cos(index * .017) * 25,
    t: index * 4
  }));
  return { id: `media-${kind}-${pointCount}`, type: 'stroke', kind, color: '#202020', size: 20, opacity: 1, pressure: .95, taper: .2, smoothing: .48, flow: .78, wetness: kind === 'drybrush' ? .06 : .7, bristle: kind === 'drybrush' ? .88 : .25, grain: kind === 'drybrush' ? .86 : .14, points };
}
function run(pointCount, kind) {
  const stroke = makeStroke(pointCount, kind), before = process.memoryUsage().heapUsed;
  const start = performance.now();const prepared = buildNaturalMediaStamps(stroke);const prepareMs = performance.now() - start;
  const fingerprintStart = performance.now();const fingerprint = naturalMediaFingerprint(stroke, 2);const fingerprintMs = performance.now() - fingerprintStart;
  const after = process.memoryUsage().heapUsed;
  return { pointCount, kind, stamps: prepared.stamps.length, bounds: prepared.bounds, prepareMs: +prepareMs.toFixed(3), fingerprintMs: +fingerprintMs.toFixed(3), heapDeltaBytes: after - before, fingerprint, passed: prepared.stamps.length > 0 && prepared.stamps.length <= 8192 && prepared.bounds.w > 0 && prepared.bounds.h > 0 };
}
const cases = [run(100, 'brush'), run(1000, 'drybrush'), run(10000, 'airbrush')];
const report = { version: '0.8.3', environment: { node: process.version, platform: process.platform, arch: process.arch }, cases, passed: cases.every(item => item.passed), note: 'This validates CPU stamp preparation and cache fingerprinting only. GPU shader execution is not benchmarked because the container does not expose WebGL2.' };
fs.writeFileSync(new URL('./performance-natural-media-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));if (!report.passed) process.exitCode = 1;
