import { Matrix } from '../core/index.js';
import { findPageObject, walkPageObjects } from '../document/hierarchy.js';
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
  'path.refine.v1'
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

function normalizeTargets(raw, { exact = null, max = 64 } = {}) {
  if (!Array.isArray(raw) || !raw.length || raw.length > max) editFail('TARGETS_INVALID');
  const targets = raw.map(normalizeTargetRef);
  const unique = new Set(targets.map(ref => `${ref.pageId}\u0000${ref.layerId}\u0000${ref.objectId}`));
  if (unique.size !== targets.length) editFail('TARGET_DUPLICATE');
  if (exact != null && targets.length !== exact) editFail('TARGET_COUNT_INVALID', { expected: exact, actual: targets.length });
  return targets;
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
  editFail('OPERATION_NOT_ALLOWED', { operation });
}

function operationTargetRules(operation) {
  if (operation.startsWith('path.simplify.') || operation.startsWith('path.refine.')) return { exact: 1, max: 1 };
  return { max: 64 };
}

function normalizeExpected(raw) {
  if (raw == null) return null;
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) editFail('EXPECTED_INVALID');
  const expected = {};
  if (raw.documentId != null) expected.documentId = boundedText(raw.documentId, 'expected.documentId', { max: 160 });
  if (raw.pageId != null) expected.pageId = boundedText(raw.pageId, 'expected.pageId', { max: 160 });
  if (raw.targetFingerprints != null) {
    if (!raw.targetFingerprints || typeof raw.targetFingerprints !== 'object' || Array.isArray(raw.targetFingerprints)) editFail('EXPECTED_INVALID');
    const keys = Object.keys(raw.targetFingerprints);
    if (keys.length > 64) editFail('EXPECTED_INVALID');
    expected.targetFingerprints = Object.fromEntries(keys.sort().map(key => [
      boundedText(key, 'expected.targetFingerprints.key', { max: 160 }),
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
  return operation.startsWith('path.');
}

function currentTargetFingerprint(page, found) {
  return summarizeChatObject(page.id, found).stateFingerprint;
}

function captureExpectedState(app, task, resolved) {
  const page = app.page();
  return {
    documentId: app.doc?.id || null,
    pageId: page?.id || null,
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

  const resolved = task.targets.map(ref => {
    if (ref.pageId !== page.id) editFail('TARGET_PAGE_INACTIVE', { pageId: ref.pageId, actual: page.id || null });
    const found = findPageObject(page, ref);
    if (!found) editFail('TARGET_MISSING', { layerId: ref.layerId, objectId: ref.objectId });
    if (operationRequiresPath(task.operation) && found.object?.type !== 'path') {
      editFail('PATH_REQUIRED', { objectId: found.object?.id || null });
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
  return controller;
}
