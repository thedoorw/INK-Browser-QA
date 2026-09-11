import { hashValue } from '../ai/ai-core.js';
import { walkSemanticObjects } from '../semantic/semantic-model.js';

const index = document => new Map(walkSemanticObjects(document).map(({ object, layer }) => [object.id, { object, layerId: layer.id, hash: hashValue(object), role: object.semantic?.role || 'unclassified' }]));

export function semanticDifference(before, after, declaredTargets = []) {
  const left = index(before), right = index(after), added = [], deleted = [], modified = [], preserved = [];
  for (const id of new Set([...left.keys(), ...right.keys()])) {
    if (!left.has(id)) added.push({ objectId: id, role: right.get(id).role, layerId: right.get(id).layerId });
    else if (!right.has(id)) deleted.push({ objectId: id, role: left.get(id).role, layerId: left.get(id).layerId });
    else if (left.get(id).hash !== right.get(id).hash) modified.push({ objectId: id, role: right.get(id).role, beforeHash: left.get(id).hash, afterHash: right.get(id).hash });
    else preserved.push({ objectId: id, role: right.get(id).role, hash: right.get(id).hash });
  }
  const declared = new Set(declaredTargets), matches = id => [...declared].some(pattern => pattern === id || (pattern.endsWith('*') && id.startsWith(pattern.slice(0, -1))));
  const undeclared = [...added, ...deleted, ...modified].filter(item => !matches(item.objectId));
  return { format: 'INK-SEMANTIC-DIFFERENCE', version: '1.0', added, deleted, modified, preserved, declaredTargets: [...declared], undeclaredChanges: undeclared, passed: undeclared.length === 0 };
}
