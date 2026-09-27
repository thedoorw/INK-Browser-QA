import { createRasterMask, modifyRasterMask } from './image-core.js';

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const clampByte = value => clamp(Math.round(Number(value) || 0), 0, 255);
const cloneAlpha = alpha => Uint8ClampedArray.from(alpha || []);

function assertImageData(imageData) {
  const width = Math.floor(Number(imageData?.width));
  const height = Math.floor(Number(imageData?.height));
  if (!(width > 0 && height > 0) || !imageData?.data || imageData.data.length !== width * height * 4) {
    throw new Error('INK_RASTER_IMAGE_DATA_INVALID');
  }
  return { width, height, data: imageData.data };
}

function assertDimensions(width, height) {
  width = Math.floor(Number(width));
  height = Math.floor(Number(height));
  if (!(width > 0 && height > 0)) throw new Error('INK_RASTER_SELECTION_DIMENSIONS_INVALID');
  return { width, height };
}

function selectionBounds(alpha, width, height) {
  let minX = width, minY = height, maxX = -1, maxY = -1;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (!alpha[y * width + x]) continue;
    minX = Math.min(minX, x); minY = Math.min(minY, y);
    maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
  }
  return maxX < 0 ? { x: 0, y: 0, w: 0, h: 0 } : { x: minX, y: minY, w: maxX - minX + 1, h: maxY - minY + 1 };
}

function makeSelection(source, width, height, alpha, metadata = {}) {
  return {
    type: 'selection', source, width, height,
    alpha: Array.from(alpha),
    bounds: selectionBounds(alpha, width, height),
    metadata: { ...metadata }
  };
}

function pointOnSegment(point, a, b) {
  const cross = (point.x - a.x) * (b.y - a.y) - (point.y - a.y) * (b.x - a.x);
  if (Math.abs(cross) > 1e-9) return false;
  const dot = (point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y);
  if (dot < 0) return false;
  const lengthSq = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  return dot <= lengthSq;
}

function evenOddContains(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const a = polygon[j], b = polygon[i];
    if (pointOnSegment(point, a, b)) return true;
    if (((a.y > point.y) !== (b.y > point.y)) && point.x < (b.x - a.x) * (point.y - a.y) / (b.y - a.y || 1e-12) + a.x) inside = !inside;
  }
  return inside;
}

function normalizePolygon(points, width, height) {
  if (!Array.isArray(points) || points.length < 3) throw new Error('INK_POLYGON_SELECTION_REQUIRES_THREE_POINTS');
  return points.map(point => ({
    x: clamp(Number(point?.x) || 0, 0, width),
    y: clamp(Number(point?.y) || 0, 0, height)
  }));
}

export function polygonalLassoSelection(width, height, points) {
  ({ width, height } = assertDimensions(width, height));
  const polygon = normalizePolygon(points, width, height);
  const alpha = new Uint8ClampedArray(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    if (evenOddContains({ x: x + 0.5, y: y + 0.5 }, polygon)) alpha[y * width + x] = 255;
  }
  return makeSelection('polygonal-lasso', width, height, alpha, { fillRule: 'evenodd', polygon });
}

export function rgbaDistance(a, b) {
  let sum = 0;
  for (let channel = 0; channel < 4; channel++) {
    const delta = (a[channel] || 0) - (b[channel] || 0);
    sum += delta * delta;
  }
  return Math.sqrt(sum / 4);
}

export function colorMatchesTolerance(a, b, tolerance = 0) {
  return rgbaDistance(a, b) <= clamp(Number(tolerance) || 0, 0, 255);
}

function pixelRgba(data, index) {
  const offset = index * 4;
  return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
}

function normalizeSeed(x, y, width, height) {
  const sx = Math.floor(Number(x));
  const sy = Math.floor(Number(y));
  if (!Number.isFinite(sx) || !Number.isFinite(sy) || sx < 0 || sy < 0 || sx >= width || sy >= height) {
    throw new Error('INK_RASTER_SELECTION_SEED_OUT_OF_BOUNDS');
  }
  return { x: sx, y: sy, index: sy * width + sx };
}

function contiguousRegion(imageData, seed, tolerance, { edgeThreshold = 255, maxVisited = null } = {}) {
  const { width, height, data } = assertImageData(imageData);
  const limit = maxVisited == null ? width * height : Math.max(1, Math.floor(Number(maxVisited) || 0));
  const reference = pixelRgba(data, seed.index);
  const selected = new Uint8ClampedArray(width * height);
  const seen = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0, tail = 0, visited = 0;
  queue[tail++] = seed.index;
  seen[seed.index] = 1;
  while (head < tail) {
    if (++visited > limit) throw new Error('INK_QUICK_SELECTION_WORK_LIMIT');
    const index = queue[head++];
    const current = pixelRgba(data, index);
    if (!colorMatchesTolerance(current, reference, tolerance)) continue;
    selected[index] = 255;
    const x = index % width, y = Math.floor(index / width);
    const neighbors = [x > 0 ? index - 1 : -1, x + 1 < width ? index + 1 : -1, y > 0 ? index - width : -1, y + 1 < height ? index + width : -1];
    for (const next of neighbors) {
      if (next < 0 || seen[next]) continue;
      seen[next] = 1;
      if (rgbaDistance(current, pixelRgba(data, next)) <= edgeThreshold) queue[tail++] = next;
    }
  }
  return { alpha: selected, visited };
}

export function magicWandSelection(imageData, { x, y, tolerance = 0, contiguous = true } = {}) {
  const { width, height, data } = assertImageData(imageData);
  tolerance = clamp(Number(tolerance) || 0, 0, 255);
  const seed = normalizeSeed(x, y, width, height);
  let alpha, visited;
  if (contiguous) {
    ({ alpha, visited } = contiguousRegion(imageData, seed, tolerance, { edgeThreshold: 255, maxVisited: width * height }));
  } else {
    const reference = pixelRgba(data, seed.index);
    alpha = new Uint8ClampedArray(width * height);
    visited = width * height;
    for (let index = 0; index < alpha.length; index++) if (colorMatchesTolerance(pixelRgba(data, index), reference, tolerance)) alpha[index] = 255;
  }
  return makeSelection('magic-wand', width, height, alpha, { tolerance, contiguous: Boolean(contiguous), visited });
}

export function quickSelection(imageData, { samples = [], tolerance = 32, edgeThreshold = 255, maxVisited = null, initialSelection = null } = {}) {
  const { width, height } = assertImageData(imageData);
  if (!Array.isArray(samples) || !samples.length) throw new Error('INK_QUICK_SELECTION_REQUIRES_SAMPLES');
  const result = initialSelection?.alpha ? cloneAlpha(initialSelection.alpha) : new Uint8ClampedArray(width * height);
  if (result.length !== width * height) throw new Error('INK_QUICK_SELECTION_INITIAL_SIZE_MISMATCH');
  const hardLimit = maxVisited == null ? width * height * samples.length : Math.max(1, Math.floor(Number(maxVisited) || 0));
  let totalVisited = 0;
  for (const sample of samples) {
    const seed = normalizeSeed(sample.x, sample.y, width, height);
    const remaining = hardLimit - totalVisited;
    if (remaining <= 0) throw new Error('INK_QUICK_SELECTION_WORK_LIMIT');
    const region = contiguousRegion(imageData, seed, clamp(sample.tolerance ?? tolerance, 0, 255), {
      edgeThreshold: clamp(sample.edgeThreshold ?? edgeThreshold, 0, 255),
      maxVisited: remaining
    });
    totalVisited += region.visited;
    const mode = sample.mode === 'subtract' ? 'subtract' : 'add';
    for (let index = 0; index < result.length; index++) if (region.alpha[index]) result[index] = mode === 'subtract' ? 0 : 255;
  }
  return makeSelection('quick-selection', width, height, result, {
    tolerance: clamp(tolerance, 0, 255), edgeThreshold: clamp(edgeThreshold, 0, 255), visited: totalVisited
  });
}

export function refineRasterSelection(selectionOrMask, { smooth = 0, feather = 0, expand = 0, contract = 0 } = {}) {
  const width = Math.floor(Number(selectionOrMask?.width));
  const height = Math.floor(Number(selectionOrMask?.height));
  const alpha = selectionOrMask?.alpha;
  if (!(width > 0 && height > 0) || !alpha || alpha.length !== width * height) throw new Error('INK_SELECTION_REFINEMENT_INVALID_MASK');
  let mask = createRasterMask(width, height, alpha);
  const smoothRadius = Math.max(0, Math.round(Number(smooth) || 0));
  if (smoothRadius) {
    const softened = modifyRasterMask(mask, { feather: smoothRadius });
    const thresholded = Uint8ClampedArray.from(softened.alpha, value => value >= 128 ? 255 : 0);
    mask = createRasterMask(width, height, thresholded);
  }
  const delta = Math.round(Number(expand) || 0) - Math.round(Number(contract) || 0);
  if (delta) mask = modifyRasterMask(mask, { expand: delta });
  const featherRadius = Math.max(0, Math.round(Number(feather) || 0));
  if (featherRadius) mask = modifyRasterMask(mask, { feather: featherRadius });
  return mask;
}

export function sampleRasterColor(imageData, { x, y, radius = 0 } = {}) {
  const { width, height, data } = assertImageData(imageData);
  const center = normalizeSeed(x, y, width, height);
  radius = clamp(Math.round(Number(radius) || 0), 0, Math.max(width, height));
  const minX = Math.max(0, center.x - radius), maxX = Math.min(width - 1, center.x + radius);
  const minY = Math.max(0, center.y - radius), maxY = Math.min(height - 1, center.y + radius);
  const sums = [0, 0, 0, 0];
  let count = 0;
  for (let yy = minY; yy <= maxY; yy++) for (let xx = minX; xx <= maxX; xx++) {
    const rgba = pixelRgba(data, yy * width + xx);
    for (let channel = 0; channel < 4; channel++) sums[channel] += rgba[channel];
    count++;
  }
  const rgba = sums.map(value => clampByte(value / Math.max(1, count)));
  return { r: rgba[0], g: rgba[1], b: rgba[2], a: rgba[3], rgba, x: center.x, y: center.y, radius, count };
}
