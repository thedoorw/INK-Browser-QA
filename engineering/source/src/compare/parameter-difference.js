export function parameterDifference(before = {}, after = {}) {
  const changed = {};
  for (const key of new Set([...Object.keys(before || {}), ...Object.keys(after || {})])) if (JSON.stringify(before?.[key]) !== JSON.stringify(after?.[key])) changed[key] = { before: before?.[key] ?? null, after: after?.[key] ?? null };
  return { format: 'INK-PARAMETER-DIFFERENCE', version: '1.0', changed, count: Object.keys(changed).length };
}
