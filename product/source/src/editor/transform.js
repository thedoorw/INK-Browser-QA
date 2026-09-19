import { Matrix } from '../core/index.js';

export function worldMatrixForFound(found) {
  return found?.worldMatrix || Matrix.multiply(found?.parentWorldMatrix || Matrix.identity(), found?.object?.matrix || Matrix.identity());
}

export function applyWorldTransform(found, transform) {
  if (!found?.object) return false;
  const parentWorld = found.parentWorldMatrix || Matrix.identity();
  const world = worldMatrixForFound(found);
  found.object.matrix = Matrix.multiply(Matrix.invert(parentWorld), Matrix.multiply(transform, world));
  return true;
}

export function applyObjectMatrices(initial, findObject, transform) {
  for (const entry of initial) {
    const found = findObject(entry.ref);
    if (!found) continue;
    const parentWorld = entry.parentWorldMatrix || found.parentWorldMatrix || Matrix.identity();
    const initialWorld = entry.worldMatrix || Matrix.multiply(parentWorld, entry.matrix);
    const nextWorld = transform(initialWorld, entry);
    found.object.matrix = Matrix.multiply(Matrix.invert(parentWorld), nextWorld);
  }
}

export function cloneInitialMatrices(selected) {
  return selected.map(found => ({
    ref: { layerId: found.layer.id, objectId: found.object.id },
    matrix: [...found.object.matrix],
    parentWorldMatrix: [...(found.parentWorldMatrix || Matrix.identity())],
    worldMatrix: [...worldMatrixForFound(found)]
  }));
}
