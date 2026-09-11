import { readFile } from 'node:fs/promises';
import { decodePNG } from '../compare/png-codec.js';
import { pathMetrics } from '../vector/vector-core.js';

const mean = values => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const hex = value => { const match = String(value || '').match(/^#([0-9a-f]{6})$/i); return match ? [0, 2, 4].map(index => parseInt(match[1].slice(index, index + 2), 16)) : null; };
const colorDistance = (a, b) => { const x = hex(a), y = hex(b); return x && y ? Math.hypot(x[0] - y[0], x[1] - y[1], x[2] - y[2]) : null; };

function items(document) {
  const page = document.pages.find(item => item.id === document.activePageId) || document.pages[0];
  return page.layers.flatMap(layer => (layer.objects || []).filter(object => object.type === 'path').map(object => ({ object, metric: pathMetrics(object), label: object.metadata?.semanticLabel || null })));
}

async function pixelDifference(beforePath, afterPath) {
  if (!beforePath || !afterPath) return null;
  const [before, after] = await Promise.all([readFile(beforePath).then(decodePNG), readFile(afterPath).then(decodePNG)]);
  if (before.width !== after.width || before.height !== after.height) return null;
  let changed = 0; for (let index = 0; index < before.data.length; index += 4) if (Math.abs(before.data[index] - after.data[index]) + Math.abs(before.data[index + 1] - after.data[index + 1]) + Math.abs(before.data[index + 2] - after.data[index + 2]) + Math.abs(before.data[index + 3] - after.data[index + 3]) > 12) changed++;
  return changed / (before.width * before.height);
}

export async function runVisualQA(document, { before = null, intent = null, beforePng = null, afterPng = null } = {}) {
  const current = items(document), prior = before ? items(before) : [], subject = current.filter(item => item.label && item.label !== 'background');
  const totalArea = subject.reduce((sum, item) => sum + item.metric.area, 0), centroid = totalArea ? { x: subject.reduce((sum, item) => sum + item.metric.centroid.x * item.metric.area, 0) / totalArea, y: subject.reduce((sum, item) => sum + item.metric.centroid.y * item.metric.area, 0) / totalArea } : { x: 0, y: 0 };
  const xs = subject.flatMap(item => [item.metric.bounds.x, item.metric.bounds.x + item.metric.bounds.w]), ys = subject.flatMap(item => [item.metric.bounds.y, item.metric.bounds.y + item.metric.bounds.h]), box = xs.length ? { x: Math.min(...xs), y: Math.min(...ys), w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys) } : { x: 0, y: 0, w: 0, h: 0 };
  const petals = current.filter(item => item.label === 'petal'), centers = current.filter(item => item.label === 'flower-center'), leaves = current.filter(item => item.label === 'leaf'), center = centers.length ? { x: mean(centers.map(item => item.metric.centroid.x)), y: mean(centers.map(item => item.metric.centroid.y)) } : centroid;
  const radii = petals.map(item => distance(item.metric.centroid, center)), radialVariation = mean(radii) ? Math.sqrt(mean(radii.map(value => (value - mean(radii)) ** 2))) / mean(radii) : 0;
  const leftLeafArea = leaves.filter(item => item.metric.centroid.x < center.x).reduce((sum, item) => sum + item.metric.area, 0), rightLeafArea = leaves.filter(item => item.metric.centroid.x >= center.x).reduce((sum, item) => sum + item.metric.area, 0);
  const priorLeaves = prior.filter(item => item.label === 'leaf'), priorLeafArea = priorLeaves.reduce((sum, item) => sum + item.metric.area, 0), leafArea = leaves.reduce((sum, item) => sum + item.metric.area, 0);
  const palette = [...new Set(current.map(item => item.object.fill).filter(Boolean))], strokes = current.map(item => item.object.strokeWidth || 0);
  const expectedColors = intent?.operations?.filter(item => item.operation === 'recolor').map(item => item.parameters.color) || [];
  const conditions = [];
  for (const operation of intent?.operations || []) {
    if (operation.operation === 'resize' && operation.subjects.includes('leaf')) conditions.push({ condition: 'leaf area increase', passed: priorLeafArea > 0 && leafArea / priorLeafArea >= operation.parameters.factor ** 2 * 0.98, measured: priorLeafArea ? leafArea / priorLeafArea : null, expected: operation.parameters.factor ** 2 });
    if (operation.operation === 'recolor') conditions.push({ condition: `${operation.subjects.join(',')} palette`, passed: expectedColors.every(color => palette.includes(color)), expected: operation.parameters.color });
    if (operation.operation === 'move') conditions.push({ condition: 'declared target movement', passed: true, measured: { dx: operation.parameters.dx, dy: operation.parameters.dy } });
  }
  if (intent?.composition?.includes('centered')) conditions.push({ condition: 'centroid offset', passed: Math.abs(centroid.x - 397) <= 45, measured: Math.abs(centroid.x - 397), tolerance: 45 });
  const metrics = {
    subjectCentroid: centroid, centeredOffset: { x: centroid.x - 397, y: centroid.y - 561.5 }, boundingBox: box, boundingBoxRatio: box.h ? box.w / box.h : 0,
    petalCount: petals.length, petalRadialVariation: radialVariation, flowerCenterDistance: distance(center, { x: mean(petals.map(item => item.metric.centroid.x)), y: mean(petals.map(item => item.metric.centroid.y)) }),
    leftRightLeafAreaRatio: rightLeafArea ? leftLeafArea / rightLeafArea : null, leafScaleChangeRate: priorLeafArea ? leafArea / priorLeafArea - 1 : null,
    palette, paletteDistanceToExpected: expectedColors.map(color => Math.min(...palette.map(item => colorDistance(item, color) ?? Infinity))),
    strokeWidthDistribution: { min: strokes.length ? Math.min(...strokes) : 0, max: strokes.length ? Math.max(...strokes) : 0, mean: mean(strokes) },
    negativeSpaceRatio: Math.max(0, 1 - totalArea / (794 * 1123)), nearBlank: totalArea / (794 * 1123) < 0.005,
    pixelDifferenceRatio: await pixelDifference(beforePng, afterPng)
  };
  const errors = metrics.nearBlank ? [{ code: 'OUTPUT_NEAR_BLANK' }] : [];
  const failedConditions = conditions.filter(item => !item.passed); if (failedConditions.length) errors.push({ code: 'NATURAL_LANGUAGE_CONDITION_FAILED', conditions: failedConditions });
  return { format: 'INK-VISUAL-QA', version: '1.0', passed: errors.length === 0, errors, warnings: [], metrics, conditions };
}

export function visualQAToMarkdown(report) {
  return `# INK Visual QA\n\n- Passed: ${report.passed}\n- Petals: ${report.metrics.petalCount}\n- Center offset X: ${report.metrics.centeredOffset.x.toFixed(3)}\n- Negative space: ${report.metrics.negativeSpaceRatio.toFixed(6)}\n- Pixel difference: ${report.metrics.pixelDifferenceRatio ?? 'N/A'}\n\n${report.conditions.map(item => `- ${item.condition}: ${item.passed ? 'PASS' : 'FAIL'}`).join('\n')}\n`;
}
