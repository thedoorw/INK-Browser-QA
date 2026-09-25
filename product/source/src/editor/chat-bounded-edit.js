import { Matrix } from '../core/index.js';
import { createFrame, findPageObject, reparentPageObject, walkPageObjects } from '../document/hierarchy.js';
import { setFrameLayout, setChildLayoutItem } from '../document/layout.js';
import { PathEditController } from './path-edit.js';
import { cloneCompositionObject } from './composition.js';
import { applyWorldTransformBatch } from './transform.js';
import { resizeFrameGeometry } from './bounds.js';
import { createTextObject, updateTextObject } from './text-object.js';
import { pathGeometryFingerprint } from '../vector/stroke-appearance.js';
import { booleanPaths, createAnchor, createPath, createRepeat, createVectorGroup, dividePaths, importSVGDocument } from '../vector/vector-core.js';
import { documentFingerprint } from '../document/integrity.js';

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
    roles: subpaths.slice(0, 64).map(subpath => subpath?.role || 'outer'),
    rolesTruncated: subpaths.length > 64,
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
    revision: {
      revisionId: app?.revisions?.revisionIdFor?.(document.id) ?? null,
      documentFingerprint: documentFingerprint(document)
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


export const CHAT_EDIT_TASK_SCHEMA = 'INK-CHAT-EDIT-TASK';
export const CHAT_EDIT_TASK_VERSION = 1;
export const CHAT_EDIT_PROPOSAL_SCHEMA = 'INK-CHAT-EDIT-PROPOSAL';
export const CHAT_EDIT_PROPOSAL_VERSION = 1;

export const CHAT_EDIT_OPERATIONS = Object.freeze([
  'path.repaint.v1',
  'path.material.apply.v1',
  'path.material.remove.v1',
  'object.translate.v1',
  'path.simplify.v1',
  'path.refine.v1',
  'path.create.v1',
  'path.edit.v1',
  'object.rotate.v1',
  'object.clone.v1',
  'repeat.radial.v1',
  'boolean.apply.v1',
  'group.create.v1',
  'object.reparent.v1',
  'frame.create.v1',
  'text.create.v1',
  'text.edit.v1',
  'svg.import.v1',
  'object.resize.v1',
  'object.scale.v1',
  'object.order.v1',
  'repeat.mirror.v1',
  'repeat.grid.v1',
  'layout.frame.set.v1',
  'layout.frame.remove.v1',
  'layout.item.set.v1',
  'layout.item.remove.v1'
]);

const CHAT_EDIT_OPERATION_SET = new Set(CHAT_EDIT_OPERATIONS);
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

function editFail(code, details = {}) {
  throw Object.assign(new Error(`INK_CHAT_EDIT_${code}`), { code: `CHAT_EDIT_${code}`, ...details });
}

function boundedText(value, field, { required = true, max = 160 } = {}) {
  if (value == null || value === '') {
    if (!required) return null;
    editFail('FIELD_REQUIRED', { field });
  }
  if (typeof value !== 'string') editFail('FIELD_INVALID', { field });
  const text = value.trim();
  if ((required && !text) || text.length > max) editFail('FIELD_INVALID', { field });
  return text || null;
}

function boundedRawString(value, field, { required = true, max = 32768 } = {}) {
  if (value == null) {
    if (!required) return null;
    editFail('FIELD_REQUIRED', { field });
  }
  if (typeof value !== 'string' || value.length > max || (required && !value.trim())) editFail('FIELD_INVALID', { field });
  return value;
}

function boundedNumber(value, field, { min = -1e6, max = 1e6, integer = false } = {}) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < min || number > max || (integer && !Number.isInteger(number))) {
    editFail('ARGUMENT_INVALID', { field });
  }
  return number;
}

function boundedPaintToken(value, field) {
  return boundedText(value, field, { max: 256 });
}

function normalizeTargetRef(ref, index) {
  if (!ref || typeof ref !== 'object' || Array.isArray(ref)) editFail('TARGET_REF_INVALID', { index });
  return {
    pageId: boundedText(ref.pageId, `targets[${index}].pageId`, { max: 160 }),
    layerId: boundedText(ref.layerId, `targets[${index}].layerId`, { max: 160 }),
    objectId: boundedText(ref.objectId, `targets[${index}].objectId`, { max: 160 })
  };
}

function normalizeTargets(raw, { exact = null, min = 1, max = 64 } = {}) {
  if (!Array.isArray(raw) || raw.length < min || raw.length > max) editFail('TARGETS_INVALID');
  const targets = raw.map(normalizeTargetRef);
  const unique = new Set(targets.map(ref => `${ref.pageId}\u0000${ref.layerId}\u0000${ref.objectId}`));
  if (unique.size !== targets.length) editFail('TARGET_DUPLICATE');
  if (exact != null && targets.length !== exact) editFail('TARGET_COUNT_INVALID', { expected: exact, actual: targets.length });
  return targets;
}

function boundedBoolean(value, field, fallback = null) {
  if (value == null && fallback !== null) return fallback;
  if (typeof value !== 'boolean') editFail('ARGUMENT_INVALID', { field });
  return value;
}

function boundedEnum(value, field, allowed) {
  const text = boundedText(value, field, { max: 80 });
  if (!allowed.includes(text)) editFail('ARGUMENT_INVALID', { field });
  return text;
}

function normalizePoint(value, field, { optional = false } = {}) {
  if (value == null && optional) return null;
  if (!value || typeof value !== 'object' || Array.isArray(value)) editFail('ARGUMENT_INVALID', { field });
  return {
    x: boundedNumber(value.x, `${field}.x`),
    y: boundedNumber(value.y, `${field}.y`)
  };
}

function normalizeAnchor(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) editFail('ARGUMENT_INVALID', { field });
  const mode = value.mode == null ? 'corner' : boundedEnum(value.mode, `${field}.mode`, ['corner', 'smooth', 'symmetric']);
  return {
    x: boundedNumber(value.x, `${field}.x`),
    y: boundedNumber(value.y, `${field}.y`),
    in: value.in == null ? { x: 0, y: 0 } : normalizePoint(value.in, `${field}.in`),
    out: value.out == null ? { x: 0, y: 0 } : normalizePoint(value.out, `${field}.out`),
    mode
  };
}

function normalizePathCreateArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const shape = boundedEnum(raw.shape || 'path', 'arguments.shape', ['path', 'ellipse', 'circle', 'rectangle', 'polygon', 'polyline']);
  const result = {
    shape,
    objectId: raw.objectId == null ? null : boundedText(raw.objectId, 'arguments.objectId', { max: 160 }),
    name: raw.name == null ? 'CHAT Path' : boundedText(raw.name, 'arguments.name', { max: 160 }),
    fill: raw.fill == null ? 'none' : boundedPaintToken(raw.fill, 'arguments.fill'),
    stroke: raw.stroke == null ? '#202020' : boundedPaintToken(raw.stroke, 'arguments.stroke'),
    strokeWidth: boundedNumber(raw.strokeWidth ?? 1.5, 'arguments.strokeWidth', { min: 0, max: 1e5 }),
    opacity: boundedNumber(raw.opacity ?? 1, 'arguments.opacity', { min: 0, max: 1 })
  };
  if (shape === 'path') {
    if (!Array.isArray(raw.subpaths) || !raw.subpaths.length || raw.subpaths.length > 64) editFail('ARGUMENTS_INVALID');
    let anchorCount = 0;
    result.subpaths = raw.subpaths.map((subpath, subpathIndex) => {
      if (!subpath || typeof subpath !== 'object' || Array.isArray(subpath)) editFail('ARGUMENT_INVALID', { field: `arguments.subpaths[${subpathIndex}]` });
      if (!Array.isArray(subpath.anchors) || subpath.anchors.length < 2) editFail('ARGUMENT_INVALID', { field: `arguments.subpaths[${subpathIndex}].anchors` });
      anchorCount += subpath.anchors.length;
      if (anchorCount > 4096) editFail('ARGUMENTS_BOUNDS');
      return {
        closed: subpath.closed === undefined ? true : boundedBoolean(subpath.closed, `arguments.subpaths[${subpathIndex}].closed`),
        role: subpath.role == null ? 'outer' : boundedEnum(subpath.role, `arguments.subpaths[${subpathIndex}].role`, ['outer', 'hole']),
        anchors: subpath.anchors.map((anchor, anchorIndex) => normalizeAnchor(anchor, `arguments.subpaths[${subpathIndex}].anchors[${anchorIndex}]`))
      };
    });
  } else if (shape === 'ellipse' || shape === 'circle') {
    result.cx = boundedNumber(raw.cx, 'arguments.cx');
    result.cy = boundedNumber(raw.cy, 'arguments.cy');
    result.rx = boundedNumber(raw.rx ?? raw.r, 'arguments.rx', { min: Number.EPSILON, max: 1e6 });
    result.ry = shape === 'circle'
      ? result.rx
      : boundedNumber(raw.ry ?? raw.r ?? raw.rx, 'arguments.ry', { min: Number.EPSILON, max: 1e6 });
  } else if (shape === 'rectangle') {
    result.x = boundedNumber(raw.x, 'arguments.x');
    result.y = boundedNumber(raw.y, 'arguments.y');
    result.width = boundedNumber(raw.width, 'arguments.width', { min: Number.EPSILON, max: 1e6 });
    result.height = boundedNumber(raw.height, 'arguments.height', { min: Number.EPSILON, max: 1e6 });
  } else {
    if (!Array.isArray(raw.points) || raw.points.length < (shape === 'polygon' ? 3 : 2) || raw.points.length > 4096) editFail('ARGUMENTS_INVALID');
    result.points = raw.points.map((point, index) => normalizePoint(point, `arguments.points[${index}]`));
  }
  return result;
}

function normalizePathEditArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const action = boundedEnum(raw.action, 'arguments.action', [
    'move-anchor', 'move-handle', 'set-anchor-mode', 'add-anchor', 'delete-anchors', 'set-subpath-closed'
  ]);
  const index = (value, field) => boundedNumber(value, field, { min: 0, max: 4096, integer: true });
  if (action === 'move-anchor') return {
    action, subpathIndex: index(raw.subpathIndex, 'arguments.subpathIndex'), anchorIndex: index(raw.anchorIndex, 'arguments.anchorIndex'),
    x: boundedNumber(raw.x, 'arguments.x'), y: boundedNumber(raw.y, 'arguments.y')
  };
  if (action === 'move-handle') return {
    action, subpathIndex: index(raw.subpathIndex, 'arguments.subpathIndex'), anchorIndex: index(raw.anchorIndex, 'arguments.anchorIndex'),
    side: boundedEnum(raw.side, 'arguments.side', ['in', 'out']),
    x: boundedNumber(raw.x, 'arguments.x'), y: boundedNumber(raw.y, 'arguments.y')
  };
  if (action === 'set-anchor-mode') return {
    action, subpathIndex: index(raw.subpathIndex, 'arguments.subpathIndex'), anchorIndex: index(raw.anchorIndex, 'arguments.anchorIndex'),
    mode: boundedEnum(raw.mode, 'arguments.mode', ['corner', 'smooth', 'symmetric'])
  };
  if (action === 'add-anchor') return {
    action, subpathIndex: index(raw.subpathIndex, 'arguments.subpathIndex'), segmentIndex: index(raw.segmentIndex, 'arguments.segmentIndex'),
    t: boundedNumber(raw.t ?? 0.5, 'arguments.t', { min: Number.EPSILON, max: 1 - Number.EPSILON })
  };
  if (action === 'delete-anchors') {
    if (!Array.isArray(raw.anchors) || !raw.anchors.length || raw.anchors.length > 512) editFail('ARGUMENTS_INVALID');
    return {
      action,
      anchors: raw.anchors.map((ref, refIndex) => ({
        subpathIndex: index(ref?.subpathIndex, `arguments.anchors[${refIndex}].subpathIndex`),
        anchorIndex: index(ref?.anchorIndex, `arguments.anchors[${refIndex}].anchorIndex`)
      }))
    };
  }
  return {
    action,
    subpathIndex: index(raw.subpathIndex, 'arguments.subpathIndex'),
    closed: boundedBoolean(raw.closed, 'arguments.closed')
  };
}

function normalizeRotateArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const degrees = boundedNumber(raw.degrees, 'arguments.degrees', { min: -360000, max: 360000 });
  if (degrees === 0) editFail('NO_OP');
  return { degrees, center: normalizePoint(raw.center, 'arguments.center', { optional: true }) };
}

function normalizeCloneArguments(raw = {}) {
  if (raw == null) raw = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    dx: boundedNumber(raw.dx ?? 0, 'arguments.dx'),
    dy: boundedNumber(raw.dy ?? 0, 'arguments.dy')
  };
}

function normalizeRepeatRadialArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    count: boundedNumber(raw.count, 'arguments.count', { min: 2, max: 720, integer: true }),
    center: normalizePoint(raw.center, 'arguments.center'),
    sweep: boundedNumber(raw.sweep ?? 360, 'arguments.sweep', { min: -360000, max: 360000 }),
    startAngle: boundedNumber(raw.startAngle ?? 0, 'arguments.startAngle', { min: -360000, max: 360000 }),
    linked: raw.linked === undefined ? true : boundedBoolean(raw.linked, 'arguments.linked')
  };
}

function normalizeBooleanArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    operation: boundedEnum(raw.operation, 'arguments.operation', ['union', 'difference', 'intersection', 'xor', 'divide']),
    name: raw.name == null ? null : boundedText(raw.name, 'arguments.name', { max: 160 }),
    tolerance: boundedNumber(raw.tolerance ?? 0.65, 'arguments.tolerance', { min: Number.EPSILON, max: 1e4 })
  };
}

function normalizeGroupArguments(raw = {}) {
  if (raw == null) raw = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return { name: raw.name == null ? 'CHAT Group' : boundedText(raw.name, 'arguments.name', { max: 160 }) };
}

function normalizeReparentArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    parentObjectId: raw.parentObjectId == null ? null : boundedText(raw.parentObjectId, 'arguments.parentObjectId', { max: 160 }),
    targetLayerId: raw.targetLayerId == null ? null : boundedText(raw.targetLayerId, 'arguments.targetLayerId', { max: 160 }),
    index: raw.index == null ? null : boundedNumber(raw.index, 'arguments.index', { min: 0, max: 1e6, integer: true })
  };
}


function normalizeFrameCreateArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    name: raw.name == null ? 'CHAT Frame' : boundedText(raw.name, 'arguments.name', { max: 160 }),
    x: boundedNumber(raw.x ?? 0, 'arguments.x'),
    y: boundedNumber(raw.y ?? 0, 'arguments.y'),
    width: boundedNumber(raw.width ?? 320, 'arguments.width', { min: Number.EPSILON, max: 1e6 }),
    height: boundedNumber(raw.height ?? 240, 'arguments.height', { min: Number.EPSILON, max: 1e6 }),
    opacity: boundedNumber(raw.opacity ?? 1, 'arguments.opacity', { min: 0, max: 1 })
  };
}

function normalizeTextCreateArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    text: boundedRawString(raw.text, 'arguments.text', { max: 32768 }),
    x: boundedNumber(raw.x ?? 0, 'arguments.x'),
    y: boundedNumber(raw.y ?? 0, 'arguments.y'),
    opacity: boundedNumber(raw.opacity ?? 1, 'arguments.opacity', { min: 0, max: 1 }),
    color: raw.color == null ? '#202020' : boundedPaintToken(raw.color, 'arguments.color'),
    fontFamily: raw.fontFamily == null ? 'system-ui' : boundedText(raw.fontFamily, 'arguments.fontFamily', { max: 160 }),
    fontSize: boundedNumber(raw.fontSize ?? 32, 'arguments.fontSize', { min: Number.EPSILON, max: 1e4 }),
    lineHeight: boundedNumber(raw.lineHeight ?? 1.25, 'arguments.lineHeight', { min: Number.EPSILON, max: 20 }),
    fontWeight: raw.fontWeight == null ? null : boundedNumber(raw.fontWeight, 'arguments.fontWeight', { min: 1, max: 1000 })
  };
}

function normalizeTextEditArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const patch = {};
  if (hasOwn(raw, 'text')) patch.text = boundedRawString(raw.text, 'arguments.text', { max: 32768 });
  if (hasOwn(raw, 'x')) patch.x = boundedNumber(raw.x, 'arguments.x');
  if (hasOwn(raw, 'y')) patch.y = boundedNumber(raw.y, 'arguments.y');
  if (hasOwn(raw, 'opacity')) patch.opacity = boundedNumber(raw.opacity, 'arguments.opacity', { min: 0, max: 1 });
  if (hasOwn(raw, 'color')) patch.color = boundedPaintToken(raw.color, 'arguments.color');
  if (hasOwn(raw, 'fontFamily')) patch.fontFamily = boundedText(raw.fontFamily, 'arguments.fontFamily', { max: 160 });
  if (hasOwn(raw, 'fontSize')) patch.fontSize = boundedNumber(raw.fontSize, 'arguments.fontSize', { min: Number.EPSILON, max: 1e4 });
  if (hasOwn(raw, 'lineHeight')) patch.lineHeight = boundedNumber(raw.lineHeight, 'arguments.lineHeight', { min: Number.EPSILON, max: 20 });
  if (hasOwn(raw, 'fontWeight')) patch.fontWeight = boundedNumber(raw.fontWeight, 'arguments.fontWeight', { min: 1, max: 1000 });
  if (!Object.keys(patch).length) editFail('ARGUMENTS_EMPTY');
  return patch;
}

function normalizeSvgImportArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const svg = boundedRawString(raw.svg, 'arguments.svg', { max: 1048576 });
  if (
    /<\s*(?:script|foreignObject|iframe|object|embed)\b/i.test(svg)
    || /\son[a-z]+\s*=/i.test(svg)
    || /(?:href|xlink:href)\s*=\s*["']\s*(?:https?:|\/\/|javascript:|data:text\/html)/i.test(svg)
    || /url\s*\(\s*["']?\s*(?:https?:|\/\/|javascript:)/i.test(svg)
    || /@import\b/i.test(svg)
  ) editFail('SVG_UNSAFE_CONTENT');
  return { svg };
}

function normalizeResizeArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const width = raw.width == null ? null : boundedNumber(raw.width, 'arguments.width', { min: Number.EPSILON, max: 1e6 });
  const height = raw.height == null ? null : boundedNumber(raw.height, 'arguments.height', { min: Number.EPSILON, max: 1e6 });
  if (width == null && height == null) editFail('ARGUMENTS_EMPTY');
  return {
    width,
    height,
    preserveAspect: raw.preserveAspect === undefined ? false : boundedBoolean(raw.preserveAspect, 'arguments.preserveAspect')
  };
}

function normalizeScaleArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const sx = boundedNumber(raw.sx, 'arguments.sx', { min: -1e4, max: 1e4 });
  const sy = boundedNumber(raw.sy ?? raw.sx, 'arguments.sy', { min: -1e4, max: 1e4 });
  if (Math.abs(sx) < 1e-6 || Math.abs(sy) < 1e-6) editFail('SINGULAR_SCALE');
  if (sx === 1 && sy === 1) editFail('NO_OP');
  return { sx, sy, center: normalizePoint(raw.center, 'arguments.center', { optional: true }) };
}

function normalizeOrderArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return { action: boundedEnum(raw.action, 'arguments.action', ['front', 'back']) };
}

function normalizeRepeatMirrorArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  return {
    axis: boundedEnum(raw.axis ?? 'y', 'arguments.axis', ['x', 'y']),
    center: normalizePoint(raw.center, 'arguments.center', { optional: true }),
    linked: raw.linked === undefined ? true : boundedBoolean(raw.linked, 'arguments.linked')
  };
}

function normalizeRepeatGridArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const columns = boundedNumber(raw.columns, 'arguments.columns', { min: 1, max: 64, integer: true });
  const rows = boundedNumber(raw.rows, 'arguments.rows', { min: 1, max: 64, integer: true });
  if (columns * rows > 1024) editFail('ARGUMENTS_BOUNDS', { field: 'arguments.columns/rows' });
  return {
    columns,
    rows,
    dx: boundedNumber(raw.dx ?? 0, 'arguments.dx', { min: -1e5, max: 1e5 }),
    dy: boundedNumber(raw.dy ?? 0, 'arguments.dy', { min: -1e5, max: 1e5 }),
    linked: raw.linked === undefined ? true : boundedBoolean(raw.linked, 'arguments.linked')
  };
}

function normalizeFrameLayoutSetArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const padding = raw.padding == null ? {} : raw.padding;
  const align = raw.align == null ? {} : raw.align;
  const sizing = raw.sizing == null ? {} : raw.sizing;
  for (const [value, field] of [[padding, 'arguments.padding'], [align, 'arguments.align'], [sizing, 'arguments.sizing']]) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) editFail('ARGUMENT_INVALID', { field });
  }
  const layout = {
    mode: boundedEnum(raw.mode ?? 'manual', 'arguments.mode', ['manual', 'horizontal', 'vertical']),
    gap: boundedNumber(raw.gap ?? 0, 'arguments.gap', { min: 0, max: 1e6 }),
    padding: {
      top: boundedNumber(padding.top ?? 0, 'arguments.padding.top', { min: 0, max: 1e6 }),
      right: boundedNumber(padding.right ?? 0, 'arguments.padding.right', { min: 0, max: 1e6 }),
      bottom: boundedNumber(padding.bottom ?? 0, 'arguments.padding.bottom', { min: 0, max: 1e6 }),
      left: boundedNumber(padding.left ?? 0, 'arguments.padding.left', { min: 0, max: 1e6 })
    },
    align: {
      main: boundedEnum(align.main ?? 'start', 'arguments.align.main', ['start', 'center', 'end', 'space-between']),
      cross: boundedEnum(align.cross ?? 'start', 'arguments.align.cross', ['start', 'center', 'end', 'stretch'])
    },
    sizing: {
      horizontal: boundedEnum(sizing.horizontal ?? 'fixed', 'arguments.sizing.horizontal', ['fixed', 'hug']),
      vertical: boundedEnum(sizing.vertical ?? 'fixed', 'arguments.sizing.vertical', ['fixed', 'hug'])
    }
  };
  return layout;
}

function normalizeLayoutItemSetArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const sizing = raw.sizing == null ? {} : raw.sizing;
  const fixedSize = raw.fixedSize == null ? {} : raw.fixedSize;
  const constraints = raw.constraints == null ? {} : raw.constraints;
  for (const [value, field] of [[sizing, 'arguments.sizing'], [fixedSize, 'arguments.fixedSize'], [constraints, 'arguments.constraints']]) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) editFail('ARGUMENT_INVALID', { field });
  }
  return {
    participation: boundedEnum(raw.participation ?? 'flow', 'arguments.participation', ['flow', 'absolute']),
    sizing: {
      horizontal: boundedEnum(sizing.horizontal ?? 'hug', 'arguments.sizing.horizontal', ['fixed', 'fill', 'hug']),
      vertical: boundedEnum(sizing.vertical ?? 'hug', 'arguments.sizing.vertical', ['fixed', 'fill', 'hug'])
    },
    fixedSize: {
      width: boundedNumber(fixedSize.width ?? 1, 'arguments.fixedSize.width', { min: 0, max: 1e6 }),
      height: boundedNumber(fixedSize.height ?? 1, 'arguments.fixedSize.height', { min: 0, max: 1e6 })
    },
    constraints: {
      horizontal: boundedEnum(constraints.horizontal ?? 'start', 'arguments.constraints.horizontal', ['start', 'end', 'center', 'scale', 'stretch']),
      vertical: boundedEnum(constraints.vertical ?? 'start', 'arguments.constraints.vertical', ['start', 'end', 'center', 'scale', 'stretch'])
    }
  };
}

function normalizeNoArguments(raw = {}) {
  if (raw == null) return {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).length) editFail('ARGUMENTS_INVALID');
  return {};
}

function normalizeRepaintArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const patch = {};
  if (hasOwn(raw, 'fill')) patch.fill = boundedPaintToken(raw.fill, 'arguments.fill');
  if (hasOwn(raw, 'stroke')) patch.stroke = boundedPaintToken(raw.stroke, 'arguments.stroke');
  if (hasOwn(raw, 'opacity')) patch.opacity = boundedNumber(raw.opacity, 'arguments.opacity', { min: 0, max: 1 });
  if (hasOwn(raw, 'expressiveStrokeColor')) patch.expressiveStrokeColor = boundedPaintToken(raw.expressiveStrokeColor, 'arguments.expressiveStrokeColor');
  if (!Object.keys(patch).length) editFail('ARGUMENTS_EMPTY');
  return patch;
}

function normalizeMaterialArguments(raw = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('ARGUMENTS_INVALID');
  const templateId = boundedText(raw.templateId ?? raw.materialRef?.templateId, 'arguments.templateId', { max: 160 });
  const templateVersion = boundedText(raw.templateVersion ?? raw.materialRef?.templateVersion, 'arguments.templateVersion', { required: false, max: 80 });
  let parameterOverrides = {};
  if (raw.parameterOverrides !== undefined) {
    if (!raw.parameterOverrides || typeof raw.parameterOverrides !== 'object' || Array.isArray(raw.parameterOverrides)) editFail('ARGUMENTS_INVALID');
    if (Object.keys(raw.parameterOverrides).length > 32 || stableChatStringify(raw.parameterOverrides).length > 4096) editFail('ARGUMENTS_BOUNDS');
    parameterOverrides = clone(raw.parameterOverrides);
  }
  const fallback = {};
  if (raw.fallback !== undefined) {
    if (!raw.fallback || typeof raw.fallback !== 'object' || Array.isArray(raw.fallback)) editFail('ARGUMENTS_INVALID');
    if (hasOwn(raw.fallback, 'fill')) fallback.fill = boundedPaintToken(raw.fallback.fill, 'arguments.fallback.fill');
    if (hasOwn(raw.fallback, 'stroke')) fallback.stroke = boundedPaintToken(raw.fallback.stroke, 'arguments.fallback.stroke');
  }
  return { templateId, templateVersion, parameterOverrides, fallback };
}

function normalizeOperationArguments(operation, raw) {
  if (operation === 'path.repaint.v1') return normalizeRepaintArguments(raw);
  if (operation === 'path.material.apply.v1') return normalizeMaterialArguments(raw);
  if (operation === 'path.material.remove.v1') {
    if (raw != null && (typeof raw !== 'object' || Array.isArray(raw) || Object.keys(raw).length)) editFail('ARGUMENTS_INVALID');
    return {};
  }
  if (operation === 'object.translate.v1') {
    const dx = boundedNumber(raw?.dx, 'arguments.dx');
    const dy = boundedNumber(raw?.dy, 'arguments.dy');
    if (dx === 0 && dy === 0) editFail('NO_OP');
    return { dx, dy };
  }
  if (operation === 'path.simplify.v1') {
    return {
      tolerance: boundedNumber(raw?.tolerance ?? 0.75, 'arguments.tolerance', { min: 0, max: 1e6 }),
      handleTolerance: boundedNumber(raw?.handleTolerance ?? Math.max(0.05, Number(raw?.tolerance ?? 0.75) * 0.25), 'arguments.handleTolerance', { min: 0, max: 1e6 }),
      maxPasses: boundedNumber(raw?.maxPasses ?? 256, 'arguments.maxPasses', { min: 1, max: 4096, integer: true })
    };
  }
  if (operation === 'path.refine.v1') {
    return {
      maxControlLength: boundedNumber(raw?.maxControlLength ?? 48, 'arguments.maxControlLength', { min: Number.EPSILON, max: 1e6 }),
      maxAddedAnchors: boundedNumber(raw?.maxAddedAnchors ?? 128, 'arguments.maxAddedAnchors', { min: 1, max: 4096, integer: true })
    };
  }
  if (operation === 'path.create.v1') return normalizePathCreateArguments(raw);
  if (operation === 'path.edit.v1') return normalizePathEditArguments(raw);
  if (operation === 'object.rotate.v1') return normalizeRotateArguments(raw);
  if (operation === 'object.clone.v1') return normalizeCloneArguments(raw);
  if (operation === 'repeat.radial.v1') return normalizeRepeatRadialArguments(raw);
  if (operation === 'boolean.apply.v1') return normalizeBooleanArguments(raw);
  if (operation === 'group.create.v1') return normalizeGroupArguments(raw);
  if (operation === 'object.reparent.v1') return normalizeReparentArguments(raw);
  if (operation === 'frame.create.v1') return normalizeFrameCreateArguments(raw);
  if (operation === 'text.create.v1') return normalizeTextCreateArguments(raw);
  if (operation === 'text.edit.v1') return normalizeTextEditArguments(raw);
  if (operation === 'svg.import.v1') return normalizeSvgImportArguments(raw);
  if (operation === 'object.resize.v1') return normalizeResizeArguments(raw);
  if (operation === 'object.scale.v1') return normalizeScaleArguments(raw);
  if (operation === 'object.order.v1') return normalizeOrderArguments(raw);
  if (operation === 'repeat.mirror.v1') return normalizeRepeatMirrorArguments(raw);
  if (operation === 'repeat.grid.v1') return normalizeRepeatGridArguments(raw);
  if (operation === 'layout.frame.set.v1') return normalizeFrameLayoutSetArguments(raw);
  if (operation === 'layout.frame.remove.v1') return normalizeNoArguments(raw);
  if (operation === 'layout.item.set.v1') return normalizeLayoutItemSetArguments(raw);
  if (operation === 'layout.item.remove.v1') return normalizeNoArguments(raw);
  editFail('OPERATION_NOT_ALLOWED', { operation });
}

function operationTargetRules(operation) {
  if (operation === 'path.create.v1' || operation === 'frame.create.v1' || operation === 'text.create.v1' || operation === 'svg.import.v1') return { exact: 0, min: 0, max: 0 };
  if (operation === 'path.edit.v1'
    || operation.startsWith('path.simplify.')
    || operation.startsWith('path.refine.')
    || operation === 'object.clone.v1'
    || operation === 'repeat.radial.v1'
    || operation === 'object.reparent.v1'
    || operation === 'text.edit.v1'
    || operation === 'object.resize.v1'
    || operation === 'repeat.mirror.v1'
    || operation === 'repeat.grid.v1'
    || operation === 'layout.frame.set.v1'
    || operation === 'layout.frame.remove.v1'
    || operation === 'layout.item.set.v1'
    || operation === 'layout.item.remove.v1') return { exact: 1, max: 1 };
  if (operation === 'boolean.apply.v1') return { min: 2, max: 64 };
  return { min: 1, max: 64 };
}

function normalizeExpected(raw) {
  if (raw == null) return null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('EXPECTED_INVALID');
  const expected = {};
  if (raw.documentId != null) expected.documentId = boundedText(raw.documentId, 'expected.documentId', { max: 160 });
  if (raw.pageId != null) expected.pageId = boundedText(raw.pageId, 'expected.pageId', { max: 160 });
  if (hasOwn(raw, 'revisionId')) {
    expected.revisionId = raw.revisionId == null
      ? null
      : boundedText(raw.revisionId, 'expected.revisionId', { max: 220 });
  }
  if (raw.targetFingerprints != null) {
    if (!raw.targetFingerprints || typeof raw.targetFingerprints !== 'object' || Array.isArray(raw.targetFingerprints)) editFail('EXPECTED_INVALID');
    const keys = Object.keys(raw.targetFingerprints);
    if (keys.length > 64) editFail('EXPECTED_INVALID');
    expected.targetFingerprints = Object.fromEntries(keys.sort().map(key => [
      boundedText(key, 'expected.targetFingerprints.key', { max: 360 }),
      boundedText(raw.targetFingerprints[key], `expected.targetFingerprints.${key}`, { max: 160 })
    ]));
  }
  return expected;
}

export function normalizeChatEditTask(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('TASK_INVALID');
  if (raw.schema != null && raw.schema !== CHAT_EDIT_TASK_SCHEMA) editFail('SCHEMA_UNSUPPORTED', { schema: raw.schema });
  if (raw.version != null && Number(raw.version) !== CHAT_EDIT_TASK_VERSION) editFail('VERSION_UNSUPPORTED', { version: raw.version });
  const operation = boundedText(raw.operation, 'operation', { max: 80 });
  if (!CHAT_EDIT_OPERATION_SET.has(operation)) editFail('OPERATION_NOT_ALLOWED', { operation });
  return {
    schema: CHAT_EDIT_TASK_SCHEMA,
    version: CHAT_EDIT_TASK_VERSION,
    taskId: boundedText(raw.taskId, 'taskId', { max: 160 }),
    operation,
    targets: normalizeTargets(raw.targets, operationTargetRules(operation)),
    arguments: normalizeOperationArguments(operation, raw.arguments),
    expected: normalizeExpected(raw.expected)
  };
}

export function createChatEditProposal(rawTask, { proposalId = null, expected = null, stateFingerprint = null } = {}) {
  const task = normalizeChatEditTask(rawTask);
  const identity = proposalId || `proposal:${task.taskId}:${chatStateFingerprint(task).slice(-8)}`;
  return {
    schema: CHAT_EDIT_PROPOSAL_SCHEMA,
    version: CHAT_EDIT_PROPOSAL_VERSION,
    proposalId: boundedText(identity, 'proposalId', { max: 220 }),
    task,
    expected: normalizeExpected(expected ?? task.expected),
    revisionId: normalizeExpected(expected ?? task.expected)?.revisionId ?? null,
    stateFingerprint: stateFingerprint ? boundedText(stateFingerprint, 'stateFingerprint', { max: 160 }) : null,
    state: 'PROPOSED',
    approved: false,
    approvalToken: null
  };
}

export function chatEditDiagnostic(error, phase = 'unknown') {
  const code = typeof error?.code === 'string' ? error.code : 'CHAT_EDIT_UNKNOWN';
  const diagnostic = { ok: false, phase, code };
  for (const key of ['field', 'operation', 'index', 'objectId', 'pageId', 'layerId', 'expected', 'actual']) {
    if (error?.[key] !== undefined) diagnostic[key] = clone(error[key]);
  }
  return diagnostic;
}


function targetRefKey(ref) {
  return `${ref.layerId}/${ref.objectId}`;
}

function operationRequiresPath(operation) {
  return operation.startsWith('path.') && operation !== 'path.create.v1';
}

function currentTargetFingerprint(page, found) {
  return summarizeChatObject(page.id, found).stateFingerprint;
}

function captureExpectedState(app, task, resolved) {
  const page = app.page();
  return {
    documentId: app.doc?.id || null,
    pageId: page?.id || null,
    revisionId: app?.revisions?.revisionIdFor?.(app.doc?.id) ?? null,
    targetFingerprints: Object.fromEntries(resolved
      .map(({ ref, found }) => [targetRefKey(ref), currentTargetFingerprint(page, found)])
      .sort((a, b) => a[0].localeCompare(b[0])))
  };
}

export function validateChatEditTaskAgainstState(app, rawTask, { expected = null, requireHistoryIdle = false } = {}) {
  const task = normalizeChatEditTask(rawTask);
  const document = app?.doc;
  const page = typeof app?.page === 'function' ? app.page() : null;
  if (!document || !page) editFail('STATE_UNAVAILABLE');
  if (requireHistoryIdle && app.history?.pending) editFail('HISTORY_BUSY');

  const preconditions = normalizeExpected(expected ?? task.expected);
  if (preconditions?.documentId && preconditions.documentId !== document.id) {
    editFail('STALE_DOCUMENT', { expected: preconditions.documentId, actual: document.id || null });
  }
  if (preconditions?.pageId && preconditions.pageId !== page.id) {
    editFail('STALE_PAGE', { expected: preconditions.pageId, actual: page.id || null });
  }
  if (preconditions && hasOwn(preconditions, 'revisionId')) {
    const actualRevisionId = app?.revisions?.revisionIdFor?.(document.id) ?? null;
    if (preconditions.revisionId !== actualRevisionId) {
      editFail('STALE_REVISION', { expected: preconditions.revisionId, actual: actualRevisionId });
    }
  }

  const resolved = task.targets.map(ref => {
    if (ref.pageId !== page.id) editFail('TARGET_PAGE_INACTIVE', { pageId: ref.pageId, actual: page.id || null });
    const found = findPageObject(page, ref);
    if (!found) editFail('TARGET_MISSING', { layerId: ref.layerId, objectId: ref.objectId });
    if ((operationRequiresPath(task.operation) || task.operation === 'boolean.apply.v1') && found.object?.type !== 'path') {
      editFail('PATH_REQUIRED', { objectId: found.object?.id || null });
    }
    if (task.operation === 'text.edit.v1' && found.object?.type !== 'text') {
      editFail('TEXT_REQUIRED', { objectId: found.object?.id || null });
    }
    if (found.effectiveLocked) editFail('TARGET_LOCKED', { objectId: found.object.id });
    if (found.effectiveVisible === false) editFail('TARGET_HIDDEN', { objectId: found.object.id });
    if (found.interactionExposed === false) editFail('TARGET_UNEXPOSED', { objectId: found.object.id });
    if (!Matrix.isInvertible(found.worldMatrix || found.object?.matrix || Matrix.identity())) {
      editFail('TARGET_SINGULAR', { objectId: found.object.id });
    }
    const expectedFingerprint = preconditions?.targetFingerprints?.[targetRefKey(ref)];
    if (expectedFingerprint) {
      const actualFingerprint = currentTargetFingerprint(page, found);
      if (actualFingerprint !== expectedFingerprint) {
        editFail('TARGET_STALE', { objectId: found.object.id, expected: expectedFingerprint, actual: actualFingerprint });
      }
    }
    return { ref, found };
  });

  return { task, resolved, expected: preconditions };
}

export class ChatBoundedEditController {
  constructor(app) {
    this.app = app;
    this.proposals = new Map();
    this.approvalSequence = 0;
  }

  inspect() {
    return buildChatStateSummary(this.app);
  }

  getProposal(proposalId) {
    const proposal = this.proposals.get(String(proposalId || ''));
    return proposal ? clone(proposal) : null;
  }

  propose(rawTask) {
    const { task, resolved } = validateChatEditTaskAgainstState(this.app, rawTask);
    const summary = this.inspect();
    const expected = captureExpectedState(this.app, task, resolved);
    const proposal = createChatEditProposal(task, {
      expected,
      stateFingerprint: chatStateFingerprint(summary)
    });
    if (this.proposals.has(proposal.proposalId)) editFail('PROPOSAL_EXISTS', { proposalId: proposal.proposalId });
    this.proposals.set(proposal.proposalId, proposal);
    return clone(proposal);
  }

  approve(proposalId) {
    const key = String(proposalId || '');
    const proposal = this.proposals.get(key);
    if (!proposal) editFail('PROPOSAL_NOT_FOUND');
    if (proposal.state !== 'PROPOSED') editFail('PROPOSAL_STATE_INVALID', { actual: proposal.state });
    validateChatEditTaskAgainstState(this.app, proposal.task, { expected: proposal.expected });
    const approvalToken = `INK-LOCAL-APPROVAL:${proposal.proposalId}:${++this.approvalSequence}`;
    proposal.state = 'APPROVED';
    proposal.approved = true;
    proposal.approvalToken = approvalToken;
    this.proposals.set(key, proposal);
    return clone(proposal);
  }

  reject(proposalId) {
    const key = String(proposalId || '');
    const proposal = this.proposals.get(key);
    if (!proposal) editFail('PROPOSAL_NOT_FOUND');
    if (proposal.state === 'EXECUTED') editFail('PROPOSAL_STATE_INVALID', { actual: proposal.state });
    proposal.state = 'REJECTED';
    proposal.approved = false;
    proposal.approvalToken = null;
    this.proposals.set(key, proposal);
    return clone(proposal);
  }

  assertApproved(proposalId, approvalToken) {
    const proposal = this.proposals.get(String(proposalId || ''));
    if (!proposal) editFail('PROPOSAL_NOT_FOUND');
    if (proposal.state !== 'APPROVED' || !proposal.approved) editFail('APPROVAL_REQUIRED', { actual: proposal.state });
    if (!approvalToken || approvalToken !== proposal.approvalToken) editFail('APPROVAL_TOKEN_INVALID');
    validateChatEditTaskAgainstState(this.app, proposal.task, {
      expected: proposal.expected,
      requireHistoryIdle: true
    });
    return proposal;
  }
}

export function installChatBoundedEdit(app) {
  const controller = new ChatBoundedEditController(app);
  app.chatBoundedEdit = controller;
  app.chatBoundedEditAdapter = createChatBoundedEditAdapter(controller);
  return controller;
}


export const CHAT_EDIT_RESULT_SCHEMA = 'INK-CHAT-EDIT-RESULT';
export const CHAT_EDIT_RESULT_VERSION = 1;

function snapshotRefs(app, refs) {
  const page = app.page();
  return refs.map(ref => {
    const found = findPageObject(page, ref);
    if (!found) editFail('TARGET_MISSING', { layerId: ref.layerId, objectId: ref.objectId });
    return {
      ref: clone(ref),
      stateFingerprint: currentTargetFingerprint(page, found),
      worldMatrix: clone(found.worldMatrix || found.object?.matrix || null)
    };
  });
}

function snapshotTaskTargets(app, task) {
  return snapshotRefs(app, task.targets);
}

function targetSnapshotsChanged(before, after) {
  if (before.length !== after.length) return true;
  return before.some((item, index) =>
    item.ref.layerId !== after[index]?.ref?.layerId
    || item.ref.objectId !== after[index]?.ref?.objectId
    || item.stateFingerprint !== after[index]?.stateFingerprint);
}

function withTemporarySelection(app, refs, operation) {
  const previous = clone(Array.isArray(app.selection) ? app.selection : []);
  app.selection = refs.map(ref => ({ layerId: ref.layerId, objectId: ref.objectId }));
  try {
    return operation();
  } finally {
    app.selection = previous;
    app.refreshSelectionUI?.();
    app.renderer?.render?.();
  }
}

function executeAppearanceTask(app, task) {
  const controller = app.pathRepaintMaterial;
  if (!controller) editFail('CONTROLLER_UNAVAILABLE', { operation: task.operation });
  const refs = task.targets.map(ref => ({ layerId: ref.layerId, objectId: ref.objectId }));
  if (task.operation === 'path.repaint.v1') return controller.repaint(task.arguments, { refs, label: 'CHAT repaint Path' });
  if (task.operation === 'path.material.apply.v1') return controller.applyMaterial(task.arguments, { refs, label: 'CHAT apply Path material' });
  if (task.operation === 'path.material.remove.v1') return controller.removeMaterial({ refs, label: 'CHAT remove Path material' });
  editFail('OPERATION_NOT_ALLOWED', { operation: task.operation });
}

function executeTranslateTask(app, task) {
  if (typeof app.translateSelection !== 'function') editFail('CONTROLLER_UNAVAILABLE', { operation: task.operation });
  return withTemporarySelection(app, task.targets, () => {
    app.translateSelection(task.arguments.dx, task.arguments.dy, 'CHAT translate objects');
    return { dx: task.arguments.dx, dy: task.arguments.dy };
  });
}

function executePathEditTask(app, task) {
  if (app.pathEditing?.active) editFail('EDIT_MODE_BUSY', { operation: task.operation });
  const ref = task.targets[0];
  return withTemporarySelection(app, [ref], () => {
    const editor = new PathEditController(app);
    editor.enter({ layerId: ref.layerId, objectId: ref.objectId });
    try {
      if (task.operation === 'path.simplify.v1') return editor.simplify(task.arguments);
      if (task.operation === 'path.refine.v1') return editor.refine(task.arguments);
      if (task.operation === 'path.edit.v1') {
        const args = task.arguments;
        if (args.action === 'move-anchor') return editor.moveAnchorTo(args.subpathIndex, args.anchorIndex, args.x, args.y);
        if (args.action === 'move-handle') {
          editor.selectHandle(args.subpathIndex, args.anchorIndex, args.side);
          return editor.moveSelectedHandle(args.x, args.y);
        }
        if (args.action === 'set-anchor-mode') {
          editor.selectAnchor(args.subpathIndex, args.anchorIndex);
          return editor.setSelectedAnchorMode(args.mode);
        }
        if (args.action === 'add-anchor') return editor.addAnchorOnSegment(args.subpathIndex, args.segmentIndex, args.t);
        if (args.action === 'delete-anchors') {
          editor.selectAnchors(args.anchors);
          return editor.deleteSelectedAnchors();
        }
        if (args.action === 'set-subpath-closed') return editor.setSubpathClosed(args.subpathIndex, args.closed);
      }
      editFail('OPERATION_NOT_ALLOWED', { operation: task.operation });
    } finally {
      editor.exit();
    }
  });
}

function activeLayer(app) {
  const page = app.page();
  return page.layers.find(layer => layer.id === page.activeLayerId) || app.layer?.() || page.layers[0] || null;
}

function structuralHistoryPaths(app, foundItems = []) {
  const layers = new Map();
  for (const found of foundItems) if (found?.layer?.id) layers.set(found.layer.id, found.layer);
  if (!layers.size) {
    const layer = activeLayer(app);
    if (layer?.id) layers.set(layer.id, layer);
  }
  const paths = [...layers.values()].map(layer => app.layerObjectsPath?.(layer)).filter(Array.isArray);
  if (!paths.length) editFail('HISTORY_REQUIRED');
  return paths;
}

function finishStructuralMutation(app) {
  app.spatialDirty = true;
  app.refreshAll?.();
  app.renderer?.render?.();
}

function pathForCreate(args) {
  let subpaths;
  if (args.shape === 'path') {
    subpaths = args.subpaths;
  } else if (args.shape === 'ellipse' || args.shape === 'circle') {
    const k = 0.5522847498307936;
    subpaths = [{
      role: 'outer', closed: true,
      anchors: [
        createAnchor(args.cx + args.rx, args.cy, { x: 0, y: -args.ry * k }, { x: 0, y: args.ry * k }, { mode: 'smooth' }),
        createAnchor(args.cx, args.cy + args.ry, { x: args.rx * k, y: 0 }, { x: -args.rx * k, y: 0 }, { mode: 'smooth' }),
        createAnchor(args.cx - args.rx, args.cy, { x: 0, y: args.ry * k }, { x: 0, y: -args.ry * k }, { mode: 'smooth' }),
        createAnchor(args.cx, args.cy - args.ry, { x: -args.rx * k, y: 0 }, { x: args.rx * k, y: 0 }, { mode: 'smooth' })
      ]
    }];
  } else if (args.shape === 'rectangle') {
    subpaths = [{
      role: 'outer', closed: true,
      anchors: [
        createAnchor(args.x, args.y),
        createAnchor(args.x + args.width, args.y),
        createAnchor(args.x + args.width, args.y + args.height),
        createAnchor(args.x, args.y + args.height)
      ]
    }];
  } else {
    subpaths = [{
      role: 'outer',
      closed: args.shape === 'polygon',
      anchors: args.points.map(point => createAnchor(point.x, point.y))
    }];
  }
  return createPath({
    ...(args.objectId ? { id: args.objectId } : {}),
    name: args.name,
    subpaths,
    fill: args.fill,
    stroke: args.stroke,
    strokeWidth: args.strokeWidth,
    opacity: args.opacity
  });
}

function executePathCreateTask(app, task) {
  const layer = activeLayer(app);
  if (!layer) editFail('LAYER_UNAVAILABLE');
  const path = pathForCreate(task.arguments);
  if (findPageObject(app.page(), path.id)) editFail('OBJECT_ID_COLLISION', { objectId: path.id });
  app.history.pushScoped('CHAT create Path', structuralHistoryPaths(app, []), () => {
    layer.objects.push(path);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: layer.id, objectId: path.id };
  return { createdRefs: [ref], resultRefs: [ref], objectId: path.id, shape: task.arguments.shape };
}

function executeRotateTask(app, task) {
  const foundItems = task.targets.map(ref => findPageObject(app.page(), ref));
  if (foundItems.some(found => !found)) editFail('TARGET_MISSING');
  let center = task.arguments.center;
  if (!center) {
    const translations = foundItems.map(found => found.worldMatrix || found.object.matrix || Matrix.identity());
    center = {
      x: translations.reduce((sum, matrix) => sum + matrix[4], 0) / translations.length,
      y: translations.reduce((sum, matrix) => sum + matrix[5], 0) / translations.length
    };
  }
  const radians = task.arguments.degrees * Math.PI / 180;
  const transform = Matrix.around(center.x, center.y, Matrix.rotate(radians));
  app.history.pushScoped('CHAT rotate objects', structuralHistoryPaths(app, foundItems), () => {
    applyWorldTransformBatch(foundItems.map(found => ({ found, transform })));
  });
  finishStructuralMutation(app);
  return { degrees: task.arguments.degrees, center };
}

function executeCloneTask(app, task) {
  const source = findPageObject(app.page(), task.targets[0]);
  if (!source) editFail('TARGET_MISSING');
  const cloneObject = cloneCompositionObject(source.object, { parentId: source.parentObject?.id || null });
  if (task.arguments.dx || task.arguments.dy) {
    cloneObject.matrix = Matrix.multiply(
      Matrix.translate(task.arguments.dx, task.arguments.dy),
      cloneObject.matrix || Matrix.identity()
    );
  }
  const sourceIndex = source.parentArray.indexOf(source.object);
  if (sourceIndex < 0) editFail('TARGET_MISSING');
  app.history.pushScoped('CHAT clone object', structuralHistoryPaths(app, [source]), () => {
    source.parentArray.splice(sourceIndex + 1, 0, cloneObject);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: source.layer.id, objectId: cloneObject.id };
  return { createdRefs: [ref], resultRefs: [ref], sourceObjectId: source.object.id };
}

function executeRepeatRadialTask(app, task) {
  const source = findPageObject(app.page(), task.targets[0]);
  if (!source) editFail('TARGET_MISSING');
  const parentWorld = source.parentWorldMatrix || Matrix.identity();
  const inverseParentWorld = Matrix.tryInvert(parentWorld);
  if (!inverseParentWorld) editFail('SINGULAR_TARGET', { objectId: source.object.id });
  const nativeCenter = Matrix.point(inverseParentWorld, task.arguments.center);
  const repeat = createRepeat(source.object, {
    mode: 'radial',
    count: task.arguments.count,
    center: nativeCenter,
    sweep: task.arguments.sweep,
    startAngle: task.arguments.startAngle,
    linked: task.arguments.linked,
    sourceObjectId: source.object.id
  });
  if (source.parentObject?.id) repeat.parentId = source.parentObject.id;
  const sourceIndex = source.parentArray.indexOf(source.object);
  app.history.pushScoped('CHAT create radial Repeat', structuralHistoryPaths(app, [source]), () => {
    source.parentArray.splice(sourceIndex + 1, 0, repeat);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: source.layer.id, objectId: repeat.id };
  return {
    createdRefs: [ref],
    resultRefs: [ref],
    sourceObjectId: source.object.id,
    count: repeat.count,
    center: { ...task.arguments.center },
    nativeCenter
  };
}

function assertSameStructuralParent(foundItems, operation) {
  if (!foundItems.length || foundItems.some(found => !found)) editFail('TARGET_MISSING', { operation });
  const first = foundItems[0];
  if (foundItems.some(found => found.layer.id !== first.layer.id || found.parentArray !== first.parentArray)) {
    editFail('STRUCTURAL_PARENT_MISMATCH', { operation });
  }
  return first;
}

function executeBooleanTask(app, task) {
  const foundItems = task.targets.map(ref => findPageObject(app.page(), ref));
  const first = assertSameStructuralParent(foundItems, task.operation);
  const paths = foundItems.map(found => found.object);
  const operation = task.arguments.operation;
  const result = operation === 'divide'
    ? dividePaths(paths, { name: task.arguments.name || 'CHAT Divide', tolerance: task.arguments.tolerance })
    : booleanPaths(paths, operation, { name: task.arguments.name || `CHAT ${operation}`, tolerance: task.arguments.tolerance });
  const created = result.type === 'group' ? result.children : [result];
  const indexes = foundItems.map(found => first.parentArray.indexOf(found.object));
  const insertionIndex = Math.min(...indexes);
  const parentId = first.parentObject?.id || null;
  for (const object of created) {
    if (parentId) object.parentId = parentId;
    else delete object.parentId;
  }
  app.history.pushScoped(`CHAT boolean ${operation}`, structuralHistoryPaths(app, foundItems), () => {
    const selected = new Set(paths);
    first.parentArray.splice(0, first.parentArray.length, ...first.parentArray.filter(object => !selected.has(object)));
    first.parentArray.splice(Math.max(0, Math.min(insertionIndex, first.parentArray.length)), 0, ...created);
  });
  finishStructuralMutation(app);
  const refs = created.map(object => ({ pageId: app.page().id, layerId: first.layer.id, objectId: object.id }));
  return { createdRefs: refs, resultRefs: refs, operation, sourceObjectIds: paths.map(path => path.id) };
}

function executeGroupTask(app, task) {
  const foundItems = task.targets.map(ref => findPageObject(app.page(), ref));
  const first = assertSameStructuralParent(foundItems, task.operation);
  const objects = foundItems.map(found => found.object);
  const indexes = foundItems.map(found => first.parentArray.indexOf(found.object));
  const insertionIndex = Math.min(...indexes);
  const group = createVectorGroup(objects, { name: task.arguments.name });
  if (first.parentObject?.id) group.parentId = first.parentObject.id;
  for (const child of group.children) child.parentId = group.id;
  app.history.pushScoped('CHAT create Group', structuralHistoryPaths(app, foundItems), () => {
    const selected = new Set(objects);
    first.parentArray.splice(0, first.parentArray.length, ...first.parentArray.filter(object => !selected.has(object)));
    first.parentArray.splice(Math.max(0, Math.min(insertionIndex, first.parentArray.length)), 0, group);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: first.layer.id, objectId: group.id };
  return { createdRefs: [ref], resultRefs: [ref], childObjectIds: group.children.map(child => child.id) };
}

function executeReparentTask(app, task) {
  const found = findPageObject(app.page(), task.targets[0]);
  if (!found) editFail('TARGET_MISSING');
  app.history.pushScoped('CHAT reparent object', structuralHistoryPaths(app, [found]), () => {
    reparentPageObject(app.page(), found.object.id, task.arguments.parentObjectId, {
      targetLayerId: task.arguments.targetLayerId,
      index: task.arguments.index
    });
  });
  finishStructuralMutation(app);
  const after = findPageObject(app.page(), { layerId: found.layer.id, objectId: found.object.id });
  if (!after) editFail('TARGET_MISSING', { objectId: found.object.id });
  return { resultRefs: [{ pageId: app.page().id, layerId: after.layer.id, objectId: after.object.id }], parentObjectId: task.arguments.parentObjectId };
}


function executeFrameCreateTask(app, task) {
  const layer = activeLayer(app);
  if (!layer) editFail('LAYER_UNAVAILABLE');
  const frame = createFrame({
    name: task.arguments.name,
    matrix: Matrix.translate(task.arguments.x, task.arguments.y),
    width: task.arguments.width,
    height: task.arguments.height,
    opacity: task.arguments.opacity
  });
  if (findPageObject(app.page(), frame.id)) editFail('OBJECT_ID_COLLISION', { objectId: frame.id });
  app.history.pushScoped('CHAT create Frame', structuralHistoryPaths(app, []), () => {
    layer.objects.push(frame);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: layer.id, objectId: frame.id };
  return { createdRefs: [ref], resultRefs: [ref], width: frame.width, height: frame.height };
}

function executeTextCreateTask(app, task) {
  const layer = activeLayer(app);
  if (!layer) editFail('LAYER_UNAVAILABLE');
  const textObject = createTextObject(task.arguments);
  if (findPageObject(app.page(), textObject.id)) editFail('OBJECT_ID_COLLISION', { objectId: textObject.id });
  app.history.pushScoped('CHAT create Text', structuralHistoryPaths(app, []), () => {
    layer.objects.push(textObject);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: layer.id, objectId: textObject.id };
  return { createdRefs: [ref], resultRefs: [ref], objectId: textObject.id };
}

function executeTextEditTask(app, task) {
  const found = findPageObject(app.page(), task.targets[0]);
  if (!found || found.object?.type !== 'text') editFail('TEXT_REQUIRED');
  app.history.pushScoped('CHAT edit Text', structuralHistoryPaths(app, [found]), () => {
    if (!updateTextObject(found.object, task.arguments)) editFail('TEXT_REQUIRED');
  });
  finishStructuralMutation(app);
  return { resultRefs: [{ pageId: app.page().id, layerId: found.layer.id, objectId: found.object.id }] };
}

function collectImportedObjects(objects, output = []) {
  for (const object of objects || []) {
    if (!object || typeof object !== 'object') continue;
    output.push(object);
    if (Array.isArray(object.children)) collectImportedObjects(object.children, output);
  }
  return output;
}

function executeSvgImportTask(app, task) {
  const layer = activeLayer(app);
  if (!layer) editFail('LAYER_UNAVAILABLE');
  const imported = importSVGDocument(task.arguments.svg, {
    sourceDocumentIdentity: app.doc?.id || 'document',
    importSessionSeed: task.taskId
  });
  const topLevel = Array.isArray(imported?.objects) ? imported.objects : [];
  if (!topLevel.length) editFail('SVG_NO_SUPPORTED_OBJECTS');

  const importedObjects = collectImportedObjects(topLevel);
  const importedIds = new Set();
  for (const object of importedObjects) {
    if (!object.id) editFail('SVG_OBJECT_ID_MISSING');
    if (importedIds.has(object.id) || findPageObject(app.page(), object.id)) {
      editFail('OBJECT_ID_COLLISION', { objectId: object.id });
    }
    importedIds.add(object.id);
  }

  app.history.pushScoped('CHAT import SVG', structuralHistoryPaths(app, []), () => {
    layer.objects.push(...topLevel);
  });
  finishStructuralMutation(app);
  const refs = importedObjects.map(object => ({ pageId: app.page().id, layerId: layer.id, objectId: object.id }));
  return {
    createdRefs: refs,
    resultRefs: refs,
    format: imported.format,
    version: imported.version,
    unsupported: clone(imported.unsupported || []),
    metadata: clone(imported.metadata || null)
  };
}

function executeResizeTask(app, task) {
  const found = findPageObject(app.page(), task.targets[0]);
  if (!found) editFail('TARGET_MISSING');
  const args = task.arguments;
  if (found.object.type === 'frame') {
    app.history.pushScoped('CHAT resize Frame', structuralHistoryPaths(app, [found]), () => {
      if (!resizeFrameGeometry(found.object, {
        width: args.width,
        height: args.height,
        preserveAspect: args.preserveAspect
      })) editFail('RESIZE_INVALID');
    });
    finishStructuralMutation(app);
    return {
      resultRefs: [{ pageId: app.page().id, layerId: found.layer.id, objectId: found.object.id }],
      width: found.object.width,
      height: found.object.height
    };
  }

  if (typeof app?.renderer?.objectWorldBounds !== 'function') editFail('BOUNDS_AUTHORITY_UNAVAILABLE');
  const bounds = app.renderer.objectWorldBounds(found.object, found.parentWorldMatrix);
  if (!bounds || !Number.isFinite(bounds.w) || !Number.isFinite(bounds.h) || bounds.w <= 0 || bounds.h <= 0) editFail('BOUNDS_INVALID');
  let sx = args.width == null ? 1 : args.width / bounds.w;
  let sy = args.height == null ? 1 : args.height / bounds.h;
  if (args.preserveAspect && args.width != null && args.height == null) sy = sx;
  if (args.preserveAspect && args.height != null && args.width == null) sx = sy;
  if (!Number.isFinite(sx) || !Number.isFinite(sy) || Math.abs(sx) < 1e-6 || Math.abs(sy) < 1e-6) editFail('SINGULAR_SCALE');
  const transform = Matrix.around(bounds.x, bounds.y, Matrix.scale(sx, sy));
  app.history.pushScoped('CHAT resize object', structuralHistoryPaths(app, [found]), () => {
    applyWorldTransformBatch([{ found, transform }]);
  });
  finishStructuralMutation(app);
  return {
    resultRefs: [{ pageId: app.page().id, layerId: found.layer.id, objectId: found.object.id }],
    width: args.width,
    height: args.height,
    preserveAspect: args.preserveAspect
  };
}

function executeScaleTask(app, task) {
  const foundItems = task.targets.map(ref => findPageObject(app.page(), ref));
  if (!foundItems.length || foundItems.some(found => !found)) editFail('TARGET_MISSING');
  let center = task.arguments.center;
  if (!center) {
    const matrices = foundItems.map(found => found.worldMatrix || found.object.matrix || Matrix.identity());
    center = {
      x: matrices.reduce((sum, matrix) => sum + matrix[4], 0) / matrices.length,
      y: matrices.reduce((sum, matrix) => sum + matrix[5], 0) / matrices.length
    };
  }
  const transform = Matrix.around(center.x, center.y, Matrix.scale(task.arguments.sx, task.arguments.sy));
  app.history.pushScoped('CHAT scale objects', structuralHistoryPaths(app, foundItems), () => {
    applyWorldTransformBatch(foundItems.map(found => ({ found, transform })));
  });
  finishStructuralMutation(app);
  return { sx: task.arguments.sx, sy: task.arguments.sy, center };
}

function executeOrderTask(app, task) {
  const foundItems = task.targets.map(ref => findPageObject(app.page(), ref));
  const first = assertSameStructuralParent(foundItems, task.operation);
  const selected = new Set(foundItems.map(found => found.object));
  const orderedSelected = first.parentArray.filter(object => selected.has(object));
  const kept = first.parentArray.filter(object => !selected.has(object));
  app.history.pushScoped(task.arguments.action === 'front' ? 'CHAT move to front' : 'CHAT move to back', structuralHistoryPaths(app, foundItems), () => {
    first.parentArray.splice(
      0,
      first.parentArray.length,
      ...(task.arguments.action === 'front' ? [...kept, ...orderedSelected] : [...orderedSelected, ...kept])
    );
  });
  finishStructuralMutation(app);
  return {
    resultRefs: orderedSelected.map(object => ({ pageId: app.page().id, layerId: first.layer.id, objectId: object.id })),
    action: task.arguments.action
  };
}


function repeatDefaultWorldCenter(app, found) {
  if (typeof app?.renderer?.objectWorldBounds === 'function') {
    const bounds = app.renderer.objectWorldBounds(found.object, found.parentWorldMatrix);
    if (bounds && [bounds.x, bounds.y, bounds.w, bounds.h].every(Number.isFinite)) {
      return { x: bounds.x + bounds.w / 2, y: bounds.y + bounds.h / 2 };
    }
  }
  const matrix = found.worldMatrix || found.object?.matrix || Matrix.identity();
  return { x: Number(matrix[4]) || 0, y: Number(matrix[5]) || 0 };
}

function insertRepeatAdjacent(app, source, repeat, label) {
  if (source.parentObject?.id) repeat.parentId = source.parentObject.id;
  const sourceIndex = source.parentArray.indexOf(source.object);
  app.history.pushScoped(label, structuralHistoryPaths(app, [source]), () => {
    source.parentArray.splice(sourceIndex + 1, 0, repeat);
  });
  finishStructuralMutation(app);
  const ref = { pageId: app.page().id, layerId: source.layer.id, objectId: repeat.id };
  return { createdRefs: [ref], resultRefs: [ref] };
}

function executeRepeatMirrorTask(app, task) {
  const source = findPageObject(app.page(), task.targets[0]);
  if (!source) editFail('TARGET_MISSING');
  const parentWorld = source.parentWorldMatrix || Matrix.identity();
  const inverseParentWorld = Matrix.tryInvert(parentWorld);
  if (!inverseParentWorld) editFail('SINGULAR_TARGET', { objectId: source.object.id });
  const worldCenter = task.arguments.center || repeatDefaultWorldCenter(app, source);
  const nativeCenter = Matrix.point(inverseParentWorld, worldCenter);
  const repeat = createRepeat(source.object, {
    mode: 'mirror',
    count: 2,
    axis: task.arguments.axis,
    center: nativeCenter,
    linked: task.arguments.linked,
    sourceObjectId: source.object.id
  });
  const result = insertRepeatAdjacent(app, source, repeat, 'CHAT create mirror Repeat');
  return { ...result, sourceObjectId: source.object.id, axis: repeat.axis, center: worldCenter, nativeCenter };
}

function executeRepeatGridTask(app, task) {
  const source = findPageObject(app.page(), task.targets[0]);
  if (!source) editFail('TARGET_MISSING');
  const count = task.arguments.columns * task.arguments.rows;
  const repeat = createRepeat(source.object, {
    mode: 'grid',
    count,
    columns: task.arguments.columns,
    rows: task.arguments.rows,
    dx: task.arguments.dx,
    dy: task.arguments.dy,
    linked: task.arguments.linked,
    sourceObjectId: source.object.id
  });
  const result = insertRepeatAdjacent(app, source, repeat, 'CHAT create grid Repeat');
  return {
    ...result,
    sourceObjectId: source.object.id,
    columns: repeat.columns,
    rows: repeat.rows,
    dx: repeat.dx,
    dy: repeat.dy,
    count
  };
}

function executeFrameLayoutTask(app, task, remove = false) {
  const found = findPageObject(app.page(), task.targets[0]);
  if (!found || found.object?.type !== 'frame') editFail('FRAME_REQUIRED');
  setFrameLayout(app, found.object.id, remove ? null : task.arguments);
  app.renderer?.render?.();
  return {
    resultRefs: [{ pageId: app.page().id, layerId: found.layer.id, objectId: found.object.id }],
    layout: clone(found.object.layout ?? null)
  };
}

function executeLayoutItemTask(app, task, remove = false) {
  const found = findPageObject(app.page(), task.targets[0]);
  if (!found) editFail('TARGET_MISSING');
  if (!found.parentObject || found.parentObject.type !== 'frame') editFail('LAYOUT_ITEM_FRAME_PARENT_REQUIRED');
  setChildLayoutItem(app, found.object.id, remove ? null : task.arguments);
  app.renderer?.render?.();
  return {
    resultRefs: [{ pageId: app.page().id, layerId: found.layer.id, objectId: found.object.id }],
    layoutItem: clone(found.object.layoutItem ?? null)
  };
}

function executeApprovedTask(app, task) {
  if (task.operation === 'path.repaint.v1'
    || task.operation === 'path.material.apply.v1'
    || task.operation === 'path.material.remove.v1') {
    return executeAppearanceTask(app, task);
  }
  if (task.operation === 'object.translate.v1') return executeTranslateTask(app, task);
  if (task.operation === 'path.simplify.v1' || task.operation === 'path.refine.v1' || task.operation === 'path.edit.v1') return executePathEditTask(app, task);
  if (task.operation === 'path.create.v1') return executePathCreateTask(app, task);
  if (task.operation === 'object.rotate.v1') return executeRotateTask(app, task);
  if (task.operation === 'object.clone.v1') return executeCloneTask(app, task);
  if (task.operation === 'repeat.radial.v1') return executeRepeatRadialTask(app, task);
  if (task.operation === 'boolean.apply.v1') return executeBooleanTask(app, task);
  if (task.operation === 'group.create.v1') return executeGroupTask(app, task);
  if (task.operation === 'object.reparent.v1') return executeReparentTask(app, task);
  if (task.operation === 'frame.create.v1') return executeFrameCreateTask(app, task);
  if (task.operation === 'text.create.v1') return executeTextCreateTask(app, task);
  if (task.operation === 'text.edit.v1') return executeTextEditTask(app, task);
  if (task.operation === 'svg.import.v1') return executeSvgImportTask(app, task);
  if (task.operation === 'object.resize.v1') return executeResizeTask(app, task);
  if (task.operation === 'object.scale.v1') return executeScaleTask(app, task);
  if (task.operation === 'object.order.v1') return executeOrderTask(app, task);
  if (task.operation === 'repeat.mirror.v1') return executeRepeatMirrorTask(app, task);
  if (task.operation === 'repeat.grid.v1') return executeRepeatGridTask(app, task);
  if (task.operation === 'layout.frame.set.v1') return executeFrameLayoutTask(app, task, false);
  if (task.operation === 'layout.frame.remove.v1') return executeFrameLayoutTask(app, task, true);
  if (task.operation === 'layout.item.set.v1') return executeLayoutItemTask(app, task, false);
  if (task.operation === 'layout.item.remove.v1') return executeLayoutItemTask(app, task, true);
  editFail('OPERATION_NOT_ALLOWED', { operation: task.operation });
}

ChatBoundedEditController.prototype.execute = function execute(proposalId, approvalToken) {
  const proposal = this.assertApproved(proposalId, approvalToken);
  const beforeTargets = snapshotTaskTargets(this.app, proposal.task);
  const beforeUndoCount = this.app.history?.undoStack?.length ?? null;

  const controllerResult = executeApprovedTask(this.app, proposal.task);

  const resultRefs = Array.isArray(controllerResult?.resultRefs) ? controllerResult.resultRefs : null;
  const afterTargets = resultRefs ? snapshotRefs(this.app, resultRefs) : snapshotTaskTargets(this.app, proposal.task);
  const afterUndoCount = this.app.history?.undoStack?.length ?? null;
  const changed = resultRefs ? resultRefs.length > 0 : targetSnapshotsChanged(beforeTargets, afterTargets);
  const latestHistory = this.app.history?.undoStack?.at?.(-1) || null;

  proposal.state = 'EXECUTED';
  proposal.approved = false;
  proposal.approvalToken = null;
  this.proposals.set(proposal.proposalId, proposal);

  return {
    schema: CHAT_EDIT_RESULT_SCHEMA,
    version: CHAT_EDIT_RESULT_VERSION,
    ok: true,
    proposalId: proposal.proposalId,
    taskId: proposal.task.taskId,
    operation: proposal.task.operation,
    state: 'EXECUTED',
    changed,
    targets: afterTargets,
    history: {
      beforeUndoCount,
      afterUndoCount,
      latestLabel: latestHistory?.label || null
    },
    revision: {
      inspectedRevisionId: proposal.revisionId ?? null,
      currentRevisionId: this.app?.revisions?.revisionIdFor?.(this.app?.doc?.id) ?? null,
      documentFingerprint: documentFingerprint(this.app.doc)
    },
    controllerResult: clone(controllerResult ?? null)
  };
};

export function createChatBoundedEditAdapter(appOrController) {
  const controller = appOrController instanceof ChatBoundedEditController
    ? appOrController
    : (appOrController?.chatBoundedEdit || new ChatBoundedEditController(appOrController));

  return Object.freeze({
    inspect() {
      try { return { ok: true, action: 'inspect', result: controller.inspect() }; }
      catch (error) { return chatEditDiagnostic(error, 'inspect'); }
    },
    propose(task) {
      try { return { ok: true, action: 'propose', result: controller.propose(task) }; }
      catch (error) { return chatEditDiagnostic(error, 'propose'); }
    },
    approve(proposalId) {
      try { return { ok: true, action: 'approve', result: controller.approve(proposalId) }; }
      catch (error) { return chatEditDiagnostic(error, 'approve'); }
    },
    reject(proposalId) {
      try { return { ok: true, action: 'reject', result: controller.reject(proposalId) }; }
      catch (error) { return chatEditDiagnostic(error, 'reject'); }
    },
    execute(proposalId, approvalToken) {
      try { return { ok: true, action: 'execute', result: controller.execute(proposalId, approvalToken) }; }
      catch (error) { return chatEditDiagnostic(error, 'execute'); }
    }
  });
}
