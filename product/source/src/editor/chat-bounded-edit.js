import { walkPageObjects } from '../document/hierarchy.js';
import { pathGeometryFingerprint } from '../vector/stroke-appearance.js';

export const CHAT_STATE_SUMMARY_SCHEMA = 'INK-CHAT-STATE-SUMMARY';
export const CHAT_STATE_SUMMARY_VERSION = 1;

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const finite = value => Number.isFinite(Number(value)) ? Number(value) : null;

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.keys(value).sort().map(key => [key, stableValue(value[key])]));
}

export function stableChatStringify(value) {
  return JSON.stringify(stableValue(value));
}

export function chatStateFingerprint(value) {
  const text = stableChatStringify(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return `fnv1a32:${(hash >>> 0).toString(16).padStart(8, '0')}`;
}

export function chatObjectRef(pageId, found) {
  return {
    pageId: pageId || null,
    layerId: found?.layer?.id || null,
    objectId: found?.object?.id || null
  };
}

function pathGeometrySummary(path) {
  const subpaths = Array.isArray(path?.subpaths) ? path.subpaths : [];
  return {
    kind: 'path',
    subpathCount: subpaths.length,
    anchorCount: subpaths.reduce((sum, subpath) => sum + (Array.isArray(subpath?.anchors) ? subpath.anchors.length : 0), 0),
    closedSubpathCount: subpaths.filter(subpath => subpath?.closed).length,
    roles: subpaths.map(subpath => subpath?.role || 'outer'),
    fingerprint: pathGeometryFingerprint(path)
  };
}

function genericGeometrySummary(object) {
  if (object?.type === 'path') return pathGeometrySummary(object);
  if (object?.type === 'frame') {
    return { kind: 'frame', width: finite(object.width), height: finite(object.height), childCount: object.children?.length || 0 };
  }
  if (object?.type === 'group') return { kind: 'group', childCount: object.children?.length || 0 };
  if (object?.type === 'stroke') return { kind: 'stroke', pointCount: object.points?.length || 0 };
  if (object?.type === 'text') return { kind: 'text', characterCount: String(object.text || '').length };
  if (object?.type === 'image' || object?.type === 'reference') {
    return { kind: object.type, width: finite(object.width ?? object.w), height: finite(object.height ?? object.h) };
  }
  return { kind: object?.type || 'unknown' };
}

function pathAppearanceSummary(path) {
  const expressive = path?.expressiveStroke;
  const material = path?.materialAppearance;
  return {
    fill: path?.fill ?? 'none',
    stroke: path?.stroke ?? 'none',
    strokeWidth: finite(path?.strokeWidth),
    opacity: finite(path?.opacity) ?? 1,
    fillRule: path?.fillRule || 'nonzero',
    expressiveStroke: expressive ? {
      format: expressive.format || null,
      version: expressive.version ?? null,
      color: expressive.color || null,
      baseWidth: finite(expressive.baseWidth),
      opacity: finite(expressive.opacity)
    } : null,
    material: material ? {
      format: material.format || null,
      version: material.version ?? null,
      templateId: material.templateId || null,
      templateVersion: material.templateVersion || null,
      parameterKeys: Object.keys(material.parameterOverrides || {}).sort(),
      fallback: clone(material.fallback || null)
    } : null
  };
}

function appearanceSummary(object) {
  if (object?.type === 'path') return pathAppearanceSummary(object);
  const result = { opacity: finite(object?.opacity) ?? 1 };
  for (const key of ['color', 'fill', 'fillColor', 'stroke', 'strokeWidth', 'size', 'kind']) {
    if (object?.[key] !== undefined && typeof object[key] !== 'object') result[key] = object[key];
  }
  return result;
}

function provenanceSummary(object) {
  const metadata = object?.metadata;
  if (!metadata || typeof metadata !== 'object') return null;
  const extraction = metadata.extraction;
  if (extraction && typeof extraction === 'object') {
    return {
      kind: 'extraction',
      schema: extraction.schema || null,
      batchId: extraction.batchId || null,
      referenceObjectId: extraction.referenceObjectId || null,
      sourceName: extraction.source?.name || extraction.sourceName || null
    };
  }
  const source = metadata.source;
  if (source && typeof source === 'object') {
    return { kind: 'source', id: source.id || null, name: source.name || null, type: source.type || null };
  }
  return null;
}

export function summarizeChatObject(pageId, found) {
  const object = found.object;
  const summary = {
    ref: chatObjectRef(pageId, found),
    type: object?.type || 'unknown',
    name: object?.name || null,
    parentId: found.parentObject?.id || null,
    depth: found.depth ?? 0,
    renderOrder: found.renderOrder ?? 0,
    effectiveVisible: found.effectiveVisible !== false,
    effectiveLocked: Boolean(found.effectiveLocked),
    effectiveOpacity: finite(found.effectiveOpacity) ?? 1,
    interactionExposed: found.interactionExposed !== false,
    matrix: clone(object?.matrix || null),
    worldMatrix: clone(found.worldMatrix || null),
    geometry: genericGeometrySummary(object),
    appearance: appearanceSummary(object),
    provenance: provenanceSummary(object)
  };
  return { ...summary, stateFingerprint: chatStateFingerprint(summary) };
}

function selectedRefs(app, page) {
  const selected = [];
  for (const ref of Array.isArray(app.selection) ? app.selection : []) {
    const found = typeof app.findObject === 'function' ? app.findObject(ref) : null;
    if (found) selected.push(chatObjectRef(page.id, found));
  }
  return selected.sort((a, b) =>
    String(a.layerId).localeCompare(String(b.layerId))
    || String(a.objectId).localeCompare(String(b.objectId)));
}

export function buildChatStateSummary(app) {
  const document = app?.doc;
  const page = typeof app?.page === 'function' ? app.page() : null;
  if (!document || !page) throw Object.assign(new Error('INK_CHAT_STATE_UNAVAILABLE'), { code: 'CHAT_STATE_UNAVAILABLE' });

  const walked = walkPageObjects(page);
  const objects = walked.map(found => summarizeChatObject(page.id, found));
  const layers = (page.layers || []).map((layer, index) => ({
    id: layer.id || null,
    name: layer.name || null,
    index,
    visible: layer.visible !== false,
    locked: Boolean(layer.locked),
    opacity: finite(layer.opacity) ?? 1,
    objectCount: walked.filter(item => item.layer?.id === layer.id).length
  }));

  return {
    schema: CHAT_STATE_SUMMARY_SCHEMA,
    version: CHAT_STATE_SUMMARY_VERSION,
    document: {
      id: document.id || null,
      title: document.title || null,
      format: document.format || 'INK',
      formatVersion: document.formatVersion ?? null,
      activePageId: document.activePageId || page.id || null,
      pageCount: document.pages?.length || 0
    },
    page: {
      id: page.id || null,
      name: page.name || null,
      activeLayerId: page.activeLayerId || null,
      layerCount: page.layers?.length || 0
    },
    selection: selectedRefs(app, page),
    layers,
    objects
  };
}
