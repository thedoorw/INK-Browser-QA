import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { PenInputCalibrator } from '../src/input/pen-calibration.js';
import { GPUResourceBudget, DirtyRegionTracker, createTilePlan, estimateTextureBytes } from '../src/render/index.js';

function penCase(count = 100000) {
  let now = 1000;
  const calibrator = new PenInputCalibrator({ pressureGamma: 1.35, pressureSmoothing: .18, tiltSensitivity: 1.1 }, { clock: () => now });
  const start = performance.now();
  let checksum = 0;
  for (let i = 0; i < count; i++) {
    now += 4;
    const sample = calibrator.normalizeEvent({ pointerId: 1, pointerType: 'pen', pressure: .05 + .94 * ((i % 997) / 996), tiltX: Math.sin(i * .01) * 55, tiltY: Math.cos(i * .013) * 45, twist: i % 360, timeStamp: now });
    checksum += sample.pressure + sample.altitude * .001 + sample.azimuth * .00001;
  }
  const durationMs = performance.now() - start;
  const diagnostics = calibrator.diagnostics();
  return { count, durationMs: +durationMs.toFixed(3), samplesPerSecond: Math.round(count / Math.max(.001, durationMs / 1000)), checksum: +checksum.toFixed(3), diagnostics, passed: diagnostics.penSamples === count && diagnostics.pressureRange[1] > diagnostics.pressureRange[0] && Number.isFinite(checksum) };
}

function tileCase(width, height, scale) {
  const start = performance.now();
  const plan = createTilePlan({ x: 0, y: 0, w: width, h: height }, scale, { tileSize: 2048, overlap: 48 });
  const durationMs = performance.now() - start;
  const covered = plan.tiles.reduce((sum, tile) => sum + tile.coreWidth * tile.coreHeight, 0);
  const peakTileBytes = Math.max(...plan.tiles.map(tile => estimateTextureBytes(tile.width, tile.height, { attachments: 2 })));
  return { width, height, scale, outputWidth: plan.width, outputHeight: plan.height, tiles: plan.tiles.length, coveredPixels: covered, peakTileBytes, durationMs: +durationMs.toFixed(3), passed: covered === plan.width * plan.height && plan.tiles.length > 1 && peakTileBytes < 64 * 1024 * 1024 };
}

function resourceCase() {
  const budget = new GPUResourceBudget({ budgetBytes: 64 * 1024 * 1024 });
  const start = performance.now();
  for (let i = 0; i < 4000; i++) budget.reserve(`r-${i}`, 64 * 1024, { type: i % 2 ? 'raster-cache' : 'tile' });
  for (let i = 3000; i < 4000; i++) budget.touch(`r-${i}`);
  budget.reserve('pinned-mrt', 16 * 1024 * 1024, { pinned: true, type: 'mrt-target' });
  const durationMs = performance.now() - start;
  const diagnostics = budget.diagnostics();
  return { durationMs: +durationMs.toFixed(3), diagnostics, passed: diagnostics.usedBytes <= diagnostics.budgetBytes && diagnostics.evictions > 0 && diagnostics.resources > 0 };
}

function dirtyCase(count = 20000) {
  const tracker = new DirtyRegionTracker({ mergeGap: 6, maxRegions: 64 });
  const start = performance.now();
  for (let i = 0; i < count; i++) tracker.add({ x: (i * 37) % 4000, y: (i * 53) % 3000, w: 18 + i % 10, h: 14 + i % 8 });
  const durationMs = performance.now() - start;
  const diagnostics = tracker.diagnostics();
  const regions = tracker.consume();
  return { count, durationMs: +durationMs.toFixed(3), diagnostics, consumed: regions.length, passed: diagnostics.regions >= 1 && diagnostics.regions <= 64 && regions.length >= 1 };
}

const report = {
  version: '0.8.3',
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  pen: penCase(),
  tiles: [tileCase(5000, 3000, 2), tileCase(2048, 2048, 4)],
  resources: resourceCase(),
  dirtyRegions: dirtyCase(),
  note: 'These are deterministic Node regressions for calibration math, tile planning, resource budgeting and dirty-region aggregation. They do not validate physical pen hardware, browser GPU execution or full high-resolution image encoding.',
};
report.passed = report.pen.passed && report.tiles.every(item => item.passed) && report.resources.passed && report.dirtyRegions.passed;
fs.writeFileSync(new URL('./performance-platform-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
