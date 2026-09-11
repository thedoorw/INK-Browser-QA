import { inspectPreservation } from './preservation-guard.js';

function walk(document) {
  const page = document.pages.find(item => item.id === document.activePageId) || document.pages[0];
  return { page, entries: page.layers.flatMap(layer => (layer.objects || []).map(object => ({ layer, object }))) };
}

function bounds(object) {
  const points = object.subpaths?.flatMap(subpath => subpath.anchors || []) || object.points || [];
  if (!points.length) return null;
  const m = object.matrix || [1, 0, 0, 1, 0, 0], xy = points.map(point => ({ x: m[0] * point.x + m[2] * point.y + m[4], y: m[1] * point.x + m[3] * point.y + m[5] }));
  return { x: Math.min(...xy.map(point => point.x)), y: Math.min(...xy.map(point => point.y)), right: Math.max(...xy.map(point => point.x)), bottom: Math.max(...xy.map(point => point.y)) };
}

export function runStructuralQA(document, { before = null, plan = null } = {}) {
  const errors = [], warnings = [], { page, entries } = walk(document), ids = entries.map(item => item.object.id), duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (!page) errors.push({ code: 'PAGE_MISSING' });
  if (!page?.layers?.length) errors.push({ code: 'LAYER_MISSING' });
  if (duplicateIds.length) errors.push({ code: 'DUPLICATE_OBJECT_ID', ids: [...new Set(duplicateIds)] });
  for (const { object } of entries) {
    if (!Array.isArray(object.matrix) || object.matrix.length !== 6 || object.matrix.some(value => !Number.isFinite(value))) errors.push({ code: 'INVALID_MATRIX', target: object.id });
    if (object.type === 'path') {
      if (!object.subpaths?.length || object.subpaths.some(subpath => !subpath.anchors?.length)) errors.push({ code: 'EMPTY_PATH', target: object.id });
      if (object.subpaths?.some(subpath => subpath.anchors.some(anchor => !Number.isFinite(anchor.x) || !Number.isFinite(anchor.y)))) errors.push({ code: 'INVALID_ANCHOR', target: object.id });
      if (object.subpaths?.some(subpath => subpath.closed && subpath.anchors.length < 3)) errors.push({ code: 'TOPOLOGY_DAMAGED', target: object.id });
    }
    const box = bounds(object); if (box && (box.x < -5 || box.y < -5 || box.right > 799 || box.bottom > 1128)) warnings.push({ code: 'OUTSIDE_SAFE_BOUNDARY', target: object.id, bounds: box });
  }
  const labels = label => entries.filter(item => item.object.metadata?.semanticLabel === label);
  const petals = labels('petal'), centers = labels('flower-center'), leaves = labels('leaf'), stems = labels('stem');
  if (petals.length && !centers.length) errors.push({ code: 'FLOWER_CENTER_MISSING' });
  if (centers.length && petals.length < 3) errors.push({ code: 'PETAL_STRUCTURE_INVALID', count: petals.length });
  if (leaves.length && !stems.length) warnings.push({ code: 'LEAF_MAIN_SUBJECT_CONNECTION_UNRESOLVED' });
  let preservation = null;
  if (before && plan) { preservation = inspectPreservation(before, document, plan); if (!preservation.passed) errors.push({ code: 'UNDECLARED_OBJECT_CHANGED', targets: preservation.undeclaredChanges }); }
  return { format: 'INK-STRUCTURAL-QA', version: '1.0', passed: errors.length === 0, errors, warnings, metrics: { layers: page?.layers?.length || 0, objects: entries.length, paths: entries.filter(item => item.object.type === 'path').length, petals: petals.length, flowerCenters: centers.length, leaves: leaves.length, stems: stems.length }, preservation };
}
