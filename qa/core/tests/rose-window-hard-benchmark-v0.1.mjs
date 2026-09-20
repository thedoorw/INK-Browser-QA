import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { createHash } from 'node:crypto';

import { executeExtraction } from '../../../product/source/src/extraction/core.js';
import { imageTracerAdapter } from '../../../product/source/src/extraction/adapters.js';
import { radialEvidence, reconstructRadial, sectorMask } from '../../../product/source/src/extraction/structure.js';
import tracer from '../../../product/source/src/vendor/imagetracer-1.2.6.js';
import { flattenSubpath, repeatTransforms } from '../../../product/source/src/vector/vector-core.js';

const FIXTURE = new URL('../../fixtures/rose-window/rose-window-primary.png', import.meta.url);
const EXPECTED_SHA256 = 'e0c8039f6a30b21ac87483cfacfaa1c7fa2b05d2be79596d1a3d3f765469b807';
const THRESHOLD = 128;
const ROI = Object.freeze({ center: { x: 543, y: 638 }, radius: 466 });
const COUNTS = Object.freeze([6, 8, 10, 12, 14, 16, 18, 20, 24]);
const GRID_STEP = 4;

function decodePng(bytes) {
  assert.equal(bytes.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
  let offset = 8, width, height, bitDepth, colorType, interlace;
  const idat = [];
  while (offset < bytes.length) {
    const length = bytes.readUInt32BE(offset); const type = bytes.toString('ascii', offset + 4, offset + 8);
    const data = bytes.subarray(offset + 8, offset + 8 + length); offset += length + 12;
    if (type === 'IHDR') {
      width = data.readUInt32BE(0); height = data.readUInt32BE(4); bitDepth = data[8]; colorType = data[9]; interlace = data[12];
    } else if (type === 'IDAT') idat.push(data);
    else if (type === 'IEND') break;
  }
  assert.equal(bitDepth, 8); assert.equal(colorType, 2); assert.equal(interlace, 0);
  const channels = 3, stride = width * channels, raw = inflateSync(Buffer.concat(idat));
  const scan = new Uint8Array(height * stride), rgba = new Uint8ClampedArray(width * height * 4);
  let input = 0;
  const paeth = (a, b, c) => { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); return pa <= pb && pa <= pc ? a : pb <= pc ? b : c; };
  for (let y = 0; y < height; y++) {
    const filter = raw[input++];
    for (let x = 0; x < stride; x++) {
      const value = raw[input++], left = x >= channels ? scan[y * stride + x - channels] : 0;
      const up = y ? scan[(y - 1) * stride + x] : 0, upperLeft = y && x >= channels ? scan[(y - 1) * stride + x - channels] : 0;
      const predictor = filter === 0 ? 0 : filter === 1 ? left : filter === 2 ? up : filter === 3 ? Math.floor((left + up) / 2) : filter === 4 ? paeth(left, up, upperLeft) : NaN;
      assert.ok(Number.isFinite(predictor), `unsupported PNG filter ${filter}`);
      scan[y * stride + x] = (value + predictor) & 255;
    }
  }
  for (let i = 0, j = 0; i < scan.length; i += 3, j += 4) { rgba[j] = scan[i]; rgba[j + 1] = scan[i + 1]; rgba[j + 2] = scan[i + 2]; rgba[j + 3] = 255; }
  return { width, height, data: rgba };
}

const dark = (raster, x, y) => {
  const i = (y * raster.width + x) * 4;
  return raster.data[i] * .2126 + raster.data[i + 1] * .7152 + raster.data[i + 2] * .0722 < THRESHOLD;
};

function roiMask(raster, source) {
  const data = new Uint8Array(raster.width * raster.height);
  for (let y = 0; y < raster.height; y++) for (let x = 0; x < raster.width; x++) {
    if (Math.hypot(x - ROI.center.x, y - ROI.center.y) <= ROI.radius && dark(raster, x, y)) data[y * raster.width + x] = 255;
  }
  return { width: raster.width, height: raster.height, data, sourceSha256: source.sha256, provider: 'rose-window-fixed-radial-roi', model: null };
}

const apply = (m, p) => ({ x: m[0] * p.x + m[2] * p.y + m[4], y: m[1] * p.x + m[3] * p.y + m[5] });
const bbox = points => points.reduce((b, p) => ({ minX: Math.min(b.minX, p.x), minY: Math.min(b.minY, p.y), maxX: Math.max(b.maxX, p.x), maxY: Math.max(b.maxY, p.y) }), { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity });
function insideRing(point, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const a = ring[i], b = ring[j];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
function preparedPath(path, transform = [1, 0, 0, 1, 0, 0]) {
  const rings = path.subpaths.map(subpath => {
    const points = flattenSubpath(subpath, 1).map(p => apply(transform, apply(path.matrix, p)));
    return { points, bbox: bbox(points) };
  });
  return point => rings.reduce((parity, ring) => parity ^ (point.x >= ring.bbox.minX && point.x <= ring.bbox.maxX && point.y >= ring.bbox.minY && point.y <= ring.bbox.maxY && insideRing(point, ring.points) ? 1 : 0), 0) === 1;
}
function sampleMask(raster, paths, transforms = [[1, 0, 0, 1, 0, 0]]) {
  const prepared = [];
  for (const transform of transforms) for (const path of paths) prepared.push(preparedPath(path, transform));
  const samples = [];
  for (let y = ROI.center.y - ROI.radius; y <= ROI.center.y + ROI.radius; y += GRID_STEP) for (let x = ROI.center.x - ROI.radius; x <= ROI.center.x + ROI.radius; x += GRID_STEP) {
    if (x < 0 || y < 0 || x >= raster.width || y >= raster.height || Math.hypot(x - ROI.center.x, y - ROI.center.y) > ROI.radius) continue;
    samples.push({ target: dark(raster, x, y), predicted: prepared.some(test => test({ x, y })) });
  }
  return samples;
}
function confusion(samples) {
  let tp = 0, fp = 0, fn = 0, tn = 0;
  for (const sample of samples) sample.target ? (sample.predicted ? tp++ : fn++) : (sample.predicted ? fp++ : tn++);
  const rounded = value => +value.toFixed(6);
  return { samples: samples.length, truePositive: tp, falsePositive: fp, falseNegative: fn, trueNegative: tn,
    recall: rounded(tp / (tp + fn || 1)), precision: rounded(tp / (tp + fp || 1)), iou: rounded(tp / (tp + fp + fn || 1)) };
}
const digest = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const pathStats = paths => ({ paths: paths.length, subpaths: paths.reduce((n, p) => n + p.subpaths.length, 0), holes: paths.reduce((n, p) => n + p.subpaths.filter(s => s.role === 'hole').length, 0), nodes: paths.reduce((n, p) => n + p.subpaths.reduce((m, s) => m + s.anchors.length, 0), 0) });

async function run() {
  const bytes = readFileSync(FIXTURE), sourceSha256 = createHash('sha256').update(bytes).digest('hex');
  assert.equal(sourceSha256, EXPECTED_SHA256);
  const raster = decodePng(bytes); assert.deepEqual([raster.width, raster.height], [1086, 1448]);
  const source = { name: 'rose-window-primary.png', sha256: sourceSha256 };
  const adapter = imageTracerAdapter(tracer), mask = roiMask(raster, source);
  const direct = await executeExtraction({ raster, source, mask, parameters: { threshold: THRESHOLD } }, adapter);
  const evidence = radialEvidence(raster, { ...ROI, counts: [...COUNTS], threshold: THRESHOLD });
  const count = evidence.candidates[0].count, prototypeMask = sectorMask(raster, source, evidence, { count, threshold: THRESHOLD });
  const prototype = await executeExtraction({ raster, source, mask: prototypeMask, parameters: { threshold: THRESHOLD } }, adapter);
  const prototypePath = prototype.paths.toSorted((a, b) => pathStats([b]).nodes - pathStats([a]).nodes)[0];
  const repeat = reconstructRadial(prototypePath, evidence, { count, id: 'rose-window-structure-repeat' });
  const directAgain = await executeExtraction({ raster, source, mask, parameters: { threshold: THRESHOLD } }, adapter);
  const prototypeAgain = await executeExtraction({ raster, source, mask: prototypeMask, parameters: { threshold: THRESHOLD } }, adapter);
  const directMetrics = confusion(sampleMask(raster, direct.paths));
  const structureMetrics = confusion(sampleMask(raster, [repeat.source], repeatTransforms(repeat)));
  const result = {
    schema: 'INK-ROSE-WINDOW-HARD-BENCHMARK/1', fixture: { path: 'qa/fixtures/rose-window/rose-window-primary.png', sha256: sourceSha256, width: raster.width, height: raster.height, colorType: 'RGB' },
    setup: { threshold: THRESHOLD, roi: ROI, gridStep: GRID_STEP, candidateCounts: COUNTS },
    directExtraction: { ...pathStats(direct.paths), geometrySha256: direct.diagnostics.geometrySha256, warnings: direct.diagnostics.warnings, rasterProxy: directMetrics, provenanceExact: direct.provenance.source.sha256 === sourceSha256 && direct.provenance.mask.provider === mask.provider },
    structureAware: { selectedCount: count, selectedMaskIoU: +evidence.candidates[0].maskIoU.toFixed(6), candidates: evidence.candidates.map(x => ({ count: x.count, maskIoU: +x.maskIoU.toFixed(6) })), prototype: pathStats(prototype.paths), prototypeWarnings: prototype.diagnostics.warnings, retainedPrototype: pathStats([prototypePath]), effectiveExpandedNodes: pathStats([prototypePath]).nodes * count, linkedRepeatInstances: repeat.instances.length, rasterProxy: structureMetrics, provenanceExact: repeat.metadata.extraction.source.sha256 === sourceSha256 && repeat.metadata.structureEvidence.schema === evidence.schema },
    deterministic: { direct: direct.diagnostics.geometrySha256 === directAgain.diagnostics.geometrySha256, prototype: prototype.diagnostics.geometrySha256 === prototypeAgain.diagnostics.geometrySha256, resultSha256: digest({ direct: direct.diagnostics.geometrySha256, prototype: prototype.diagnostics.geometrySha256, count, directMetrics, structureMetrics }) },
    interpretation: { contourCountsAreThresholdDerived: true, missingAndAdditionalCountsUseSampledPixelProxy: true, semanticGroundTruthAvailable: false, decision: 'DIRECT_EXTRACTION_CURRENT_BASELINE', structureStatus: 'CANDIDATE_REQUIRES_OVERLAY_QA' }
  };
  assert.equal(result.deterministic.direct, true); assert.equal(result.deterministic.prototype, true);
  assert.equal(result.directExtraction.provenanceExact, true); assert.equal(result.structureAware.provenanceExact, true);
  assert.equal(result.structureAware.linkedRepeatInstances, result.structureAware.selectedCount);
  assert.ok(result.directExtraction.rasterProxy.iou > .8); assert.ok(result.structureAware.rasterProxy.recall < .1);
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

await run();
