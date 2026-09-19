import { Matrix } from '../core/index.js';

function transformError(code, details = {}) {
  return Object.assign(new Error(`INK_TRANSFORM_${code}`), { code, ...details });
}

export function nonSingularScaleComponent(value, epsilon = 1e-6) {
  if (!Number.isFinite(value)) return 1;
  const minimum = Math.max(Number.EPSILON, Math.abs(epsilon));
  if (Math.abs(value) >= minimum) return value;
  return value < 0 ? -minimum : minimum;
}

export function worldMatrixForFound(found) {
  return found?.worldMatrix || Matrix.toWorld(found?.parentWorldMatrix || Matrix.identity(), found?.object?.matrix || Matrix.identity());
}

export function localMatrixFromWorld(parentWorldMatrix, worldMatrix, details = {}) {
  const local = Matrix.toLocal(parentWorldMatrix || Matrix.identity(), worldMatrix || Matrix.identity());
  if (!local) throw transformError('NON_INVERTIBLE_PARENT', details);
  if (!Matrix.isFinite(local)) throw transformError('NON_FINITE_MATRIX', details);
  return local;
}

export function applyWorldTransform(found, transform) {
  if (!found?.object) return false;
  const parentWorld = found.parentWorldMatrix || Matrix.identity();
  const world = worldMatrixForFound(found);
  const nextWorld = Matrix.multiply(transform || Matrix.identity(), world);
  const nextLocal = localMatrixFromWorld(parentWorld, nextWorld, { objectId: found.object.id });
  found.object.matrix = nextLocal;
  return true;
}

export function applyObjectMatrices(initial, findObject, transform) {
  const updates = [];
  for (const entry of initial) {
    const found = findObject(entry.ref);
    if (!found) continue;
    const parentWorld = entry.parentWorldMatrix || found.parentWorldMatrix || Matrix.identity();
    const initialWorld = entry.worldMatrix || Matrix.toWorld(parentWorld, entry.matrix);
    const nextWorld = transform(initialWorld, entry);
    const nextLocal = localMatrixFromWorld(parentWorld, nextWorld, { objectId: found.object.id });
    updates.push({ object: found.object, matrix: nextLocal });
  }
  for (const update of updates) update.object.matrix = update.matrix;
  return updates.length;
}

export function cloneInitialMatrices(selected) {
  return selected.map(found => ({
    ref: { layerId: found.layer.id, objectId: found.object.id },
    matrix: [...found.object.matrix],
    parentWorldMatrix: [...(found.parentWorldMatrix || Matrix.identity())],
    worldMatrix: [...worldMatrixForFound(found)]
  }));
}
