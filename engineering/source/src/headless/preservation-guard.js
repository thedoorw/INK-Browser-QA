import { hashValue } from '../ai/ai-core.js';

function entries(document) {
  const page = document.pages.find(item => item.id === document.activePageId) || document.pages[0];
  return page.layers.flatMap(layer => (layer.objects || []).map(object => ({ id: object.id, layerId: layer.id, object })));
}

export function targetInventory(document) {
  return Object.fromEntries(entries(document).map(item => [item.id, { id: item.id, layerId: item.layerId, type: item.object.type, semanticLabel: item.object.metadata?.semanticLabel || null, hash: hashValue(item.object) }]));
}

export function declaredTargetIds(document, plan) {
  const semantic = new Map((document.ai?.semanticTargets || []).map(target => [target.targetId, [...(target.objectIds || []), ...(target.strokeIds || [])]]));
  const ids = new Set();
  for (const step of plan?.orderedSteps || []) {
    for (const target of Array.isArray(step.target) ? step.target : step.target ? [step.target] : []) {
      if (semantic.has(target)) semantic.get(target).forEach(id => ids.add(id)); else if (!String(target).startsWith('layer-')) ids.add(target);
    }
    if (step.operation === 'vector.createShape' && step.parameters?.id) ids.add(step.parameters.id);
  }
  return [...ids];
}

export function inspectPreservation(before, after, plan) {
  const beforeInventory = targetInventory(before), afterInventory = targetInventory(after), declared = new Set(declaredTargetIds(before, plan));
  const added = Object.keys(afterInventory).filter(id => !beforeInventory[id]);
  const deleted = Object.keys(beforeInventory).filter(id => !afterInventory[id]);
  const modified = Object.keys(afterInventory).filter(id => beforeInventory[id] && afterInventory[id].hash !== beforeInventory[id].hash);
  const createMode = plan?.parsedIntent?.operations?.some(item => item.operation === 'create');
  const undeclared = createMode ? [] : [...added, ...deleted, ...modified].filter(id => !declared.has(id));
  return {
    format: 'INK-PRESERVATION-GUARD', version: '1.0', passed: undeclared.length === 0,
    beforeTargetInventory: beforeInventory, declaredTargetList: [...declared], afterTargetInventory: afterInventory,
    differences: { added, deleted, modified }, undeclaredChanges: [...new Set(undeclared)],
    action: undeclared.length ? 'REJECT_AND_ROLLBACK' : 'ALLOW'
  };
}

export function assertPreserved(before, after, plan) {
  const report = inspectPreservation(before, after, plan);
  if (!report.passed) throw Object.assign(new Error(`Preservation Guard rejected undeclared changes: ${report.undeclaredChanges.join(', ')}`), { code: 'PRESERVATION_GUARD_REJECTED', details: report });
  return report;
}
