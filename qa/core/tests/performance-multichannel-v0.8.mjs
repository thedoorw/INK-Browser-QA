import fs from 'node:fs';
import { performance } from 'node:perf_hooks';
import { MultiChannelInkSurface } from '../src/render/index.js';

function stamp(index, width, height) {
  const angle = (index % 11) * .17;
  return {
    x: 12 + (index * 37) % Math.max(24, width - 24),
    y: 12 + (index * 53) % Math.max(24, height - 24),
    radiusX: 5 + index % 9,
    radiusY: 3 + index % 6,
    angle,
    pressure: .25 + (index % 7) / 9,
    seed: (index * .137) % 1,
    grain: .22 + (index % 5) * .1,
    bristle: .18 + (index % 6) * .11
  };
}

function run(width, height, stampCount, steps) {
  const before = process.memoryUsage().heapUsed;
  const createStart = performance.now();
  const surface = new MultiChannelInkSurface(width, height, {
    paper: { absorbency: .64, roughness: .53, fiberStrength: .45, fiberAngle: 17, sizing: .2, granulation: .48, seed: 241 }
  });
  const createMs = performance.now() - createStart;
  const depositStart = performance.now();
  for (let index = 0; index < stampCount; index++) {
    const color = index % 3 === 0 ? [0.12, 0.12, 0.12, 1] : index % 3 === 1 ? [0.18, 0.42, 0.56, 1] : [0.54, 0.21, 0.18, 1];
    surface.depositStamp(stamp(index, width, height), color, { flow: .72, wetness: .76, granulation: .42, opacity: .9 });
  }
  const depositMs = performance.now() - depositStart;
  const simulateStart = performance.now();
  surface.simulate({ steps, diffusion: .21, evaporation: .02, deposition: .12 });
  const simulateMs = performance.now() - simulateStart;
  const compositeStart = performance.now();
  const bytes = surface.compositeRGBA();
  const compositeMs = performance.now() - compositeStart;
  const after = process.memoryUsage().heapUsed;
  const diagnostics = surface.diagnostics();
  return {
    width, height, pixels: width * height, stampCount, steps,
    createMs: +createMs.toFixed(3), depositMs: +depositMs.toFixed(3),
    simulateMs: +simulateMs.toFixed(3), compositeMs: +compositeMs.toFixed(3),
    heapDeltaBytes: after - before, diagnostics,
    passed: bytes.length === width * height * 4 && diagnostics.stamps === stampCount && diagnostics.simulationSteps === steps && diagnostics.maxPigment > 0
  };
}

const cases = [
  run(256, 128, 80, 3),
  run(512, 256, 180, 3),
  run(768, 384, 320, 4)
];
const report = {
  version: '0.8.3',
  environment: { node: process.version, platform: process.platform, arch: process.arch },
  cases,
  passed: cases.every(item => item.passed),
  note: 'CPU multi-channel timings are deterministic regression observations for pigment, water, paper and deposition channels. They are not cross-device performance guarantees and do not validate WebGL2 MRT execution.'
};
fs.writeFileSync(new URL('./performance-multichannel-report-v0.8.json', import.meta.url), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
