export function applyObjectMatrices(initial, findObject, transform) {
  for (const entry of initial) {
    const found = findObject(entry.ref);
    if (found) found.object.matrix = transform(entry.matrix, entry);
  }
}

export function cloneInitialMatrices(selected) {
  return selected.map(found => ({
    ref: { layerId: found.layer.id, objectId: found.object.id },
    matrix: [...found.object.matrix]
  }));
}
