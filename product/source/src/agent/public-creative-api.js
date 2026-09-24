import { buildAIDocumentBridge } from '../ai/document-bridge.js';
import { installInkOutputRegistry } from './output-handle-registry.js';
import { captureInkPreview, inspectInkOutput, releaseInkOutput } from './visual-feedback.js';
import { getInkCapabilitySummaries, getInkNamedToolDefinitions, resolveInkCapabilityDescriptor } from './capability-registry.js';

export const INK_PUBLIC_CREATIVE_API_SCHEMA = 'INK-PUBLIC-CREATIVE-API';
export const INK_PUBLIC_CREATIVE_API_VERSION = 1;
export const INK_AGENT_RESULT_SCHEMA = 'INK_AGENT_RESULT';
export const INK_AGENT_RESULT_VERSION = 1;

export const INK_AGENT_ROUTING_CLASSES = Object.freeze([
  'NAMED_TOOL',
  'PROGRAMMABLE_FUTURE',
  'READ_ONLY',
  'PROPOSAL_REQUIRED',
  'UNAVAILABLE'
]);

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

function jsonSafe(value, seen = new WeakSet()) {
  if (value === undefined) return null;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value === 'bigint' || typeof value === 'function' || typeof value === 'symbol') {
    throw Object.assign(new TypeError('INK_AGENT_RESULT_NON_JSON_VALUE'), { code: 'AGENT_RESULT_NON_JSON_VALUE' });
  }
  if (Array.isArray(value)) return value.map(item => jsonSafe(item, seen));
  if (!isRecord(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw Object.assign(new TypeError('INK_AGENT_RESULT_NON_PLAIN_OBJECT'), { code: 'AGENT_RESULT_NON_PLAIN_OBJECT' });
  }
  if (seen.has(value)) throw Object.assign(new TypeError('INK_AGENT_RESULT_CYCLIC_VALUE'), { code: 'AGENT_RESULT_CYCLIC_VALUE' });
  seen.add(value);
  const output = {};
  for (const key of Object.keys(value).sort()) output[key] = jsonSafe(value[key], seen);
  seen.delete(value);
  return output;
}

function safeClone(value) {
  return jsonSafe(value);
}

function diagnostic(error, phase = null) {
  const source = isRecord(error) ? error : {};
  const details = {};
  for (const key of ['field', 'operation', 'objectId', 'pageId', 'layerId', 'expected', 'actual', 'proposalId']) {
    if (source[key] !== undefined) {
      try { details[key] = safeClone(source[key]); } catch {}
    }
  }
  return {
    code: typeof source.code === 'string' ? source.code : 'INK_AGENT_OPERATION_FAILED',
    message: typeof source.message === 'string' ? source.message : String(error || 'INK agent operation failed'),
    phase,
    details
  };
}

function selectedObjectIds(app) {
  const ids = [];
  for (const item of Array.isArray(app?.selection) ? app.selection : []) {
    const id = typeof item === 'string' ? item : item?.objectId ?? item?.id;
    if (typeof id === 'string' && id.trim()) ids.push(id.trim());
  }
  return [...new Set(ids)].sort((a, b) => a.localeCompare(b));
}

function activePage(app) {
  if (typeof app?.page === 'function') {
    try { return app.page(); } catch {}
  }
  const document = app?.doc;
  return document?.pages?.find(page => page.id === document.activePageId) || document?.pages?.[0] || null;
}

function currentRevisionId(app) {
  try { return app?.revisions?.revisionIdFor?.(app?.doc?.id) ?? null; }
  catch { return null; }
}

function contextIdentity(app) {
  return {
    documentId: app?.doc?.id || null,
    pageId: activePage(app)?.id || null,
    revisionId: currentRevisionId(app)
  };
}

function normalizeRefs(value) {
  if (value == null) return [];
  const list = Array.isArray(value) ? value : [value];
  const refs = [];
  for (const item of list) {
    if (typeof item === 'string' && item.trim()) refs.push({ objectId: item.trim() });
    else if (isRecord(item) && typeof (item.objectId ?? item.id) === 'string') {
      refs.push({
        pageId: typeof item.pageId === 'string' ? item.pageId : null,
        layerId: typeof item.layerId === 'string' ? item.layerId : null,
        objectId: String(item.objectId ?? item.id)
      });
    }
  }
  const byKey = new Map();
  for (const ref of refs) byKey.set(`${ref.pageId || ''}\u0000${ref.layerId || ''}\u0000${ref.objectId}`, ref);
  return [...byKey.values()].sort((a, b) =>
    String(a.pageId || '').localeCompare(String(b.pageId || ''))
    || String(a.layerId || '').localeCompare(String(b.layerId || ''))
    || String(a.objectId).localeCompare(String(b.objectId)));
}

function bridgeOptions(app, options = {}) {
  const next = isRecord(options) ? { ...options } : {};
  if (!hasOwn(next, 'selectedObjectIds')) next.selectedObjectIds = selectedObjectIds(app);
  if (!hasOwn(next, 'revisionId')) next.revisionId = currentRevisionId(app);
  return next;
}

function bridgeRead(app, options = {}) {
  if (!app?.doc) throw Object.assign(new Error('INK public API document unavailable'), { code: 'INK_AGENT_DOCUMENT_UNAVAILABLE' });
  return buildAIDocumentBridge(app.doc, bridgeOptions(app, options));
}

function refsFromBridgeObjects(objects = []) {
  return normalizeRefs(objects.map(item => item?.ref).filter(Boolean));
}

function compactRevisionReceipt(value) {
  if (!isRecord(value)) return value == null ? null : safeClone(value);
  const record = value.record;
  return safeClone({
    created: value.created ?? null,
    equivalent: value.equivalent ?? null,
    persisted: value.persisted ?? null,
    restored: value.restored ?? null,
    revisionId: value.revisionId ?? record?.revisionId ?? null,
    documentId: value.documentId ?? record?.documentId ?? null,
    sequence: record?.sequence ?? null,
    parentRevisionId: record?.parentRevisionId ?? null,
    documentFingerprint: value.documentFingerprint ?? record?.documentFingerprint ?? null,
    historyBoundary: value.historyBoundary ?? null
  });
}

function normalizeDiagnostics(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return safeClone(value);
  return [safeClone(value)];
}

function referenceResultMetadata(raw, app) {
  const pageId = activePage(app)?.id || null;
  const targetRefs = normalizeRefs([{ pageId, objectId: raw?.sourceReferenceObjectId }]);
  const createdRefs = normalizeRefs([
    ...(raw?.colorObjectIds || []).map(objectId => ({ pageId, layerId: raw?.colorLayerId || null, objectId })),
    ...(raw?.lineObjectIds || []).map(objectId => ({ pageId, layerId: raw?.lineLayerId || null, objectId }))
  ]);
  return {
    targetRefs,
    createdRefs,
    changedRefs: createdRefs,
    historyReceipt: raw?.history ?? null,
    revisionReceipt: raw?.revision ?? null,
    provenanceReceipt: raw?.provenance ?? null,
    diagnostics: normalizeDiagnostics(raw?.diagnostics)
  };
}

function editResultMetadata(raw) {
  const payload = raw?.result;
  const task = payload?.task || payload?.result?.task || null;
  const targets = payload?.targets?.map(item => item?.ref || item) || task?.targets || [];
  return {
    targetRefs: normalizeRefs(targets),
    changedRefs: raw?.ok && payload?.changed ? normalizeRefs(targets) : [],
    historyReceipt: payload?.history ?? null,
    revisionReceipt: payload?.revision ?? null,
    diagnostics: raw?.ok ? [] : [safeClone({
      code: raw?.code || 'CHAT_EDIT_FAILED',
      phase: raw?.phase || null,
      details: Object.fromEntries(Object.entries(raw || {}).filter(([key]) =>
        !['ok', 'action', 'result', 'code', 'phase'].includes(key)))
    })]
  };
}

function historyEntrySummary(entry) {
  if (!entry) return null;
  return safeClone({
    label: entry.label || null,
    objectIds: Array.isArray(entry.objectIds) ? [...entry.objectIds].sort((a, b) => String(a).localeCompare(String(b))) : [],
    patchCount: Number.isFinite(Number(entry.patchCount)) ? Number(entry.patchCount) : 0,
    captureMode: entry.captureMode || null,
    targetCount: Number.isFinite(Number(entry.targetCount)) ? Number(entry.targetCount) : null,
    storedBytes: Number.isFinite(Number(entry.storedBytes)) ? Number(entry.storedBytes) : null
  });
}

function historyInspection(app) {
  const history = app?.history;
  if (!history) throw Object.assign(new Error('INK History authority unavailable'), { code: 'INK_AGENT_HISTORY_UNAVAILABLE' });
  const timeline = typeof history.timeline === 'function'
    ? history.timeline()
    : { entries: [...(history.undoStack || []), ...[...(history.redoStack || [])].reverse()], applied: history.undoStack?.length || 0, limit: history.limit || 0 };
  return safeClone({
    applied: timeline.applied,
    retainedCount: timeline.entries?.length || 0,
    limit: timeline.limit,
    pending: Boolean(history.pending),
    canUndo: Boolean(history.undoStack?.length),
    canRedo: Boolean(history.redoStack?.length),
    entries: (timeline.entries || []).map(historyEntrySummary),
    stats: typeof history.stats === 'function' ? history.stats() : null
  });
}

export function createInkAgentResult(app, action, {
  status = 'COMPLETED',
  targetRefs = [],
  createdRefs = [],
  changedRefs = [],
  historyReceipt = null,
  revisionReceipt = null,
  provenanceReceipt = null,
  outputHandles = [],
  diagnostics = [],
  result = null
} = {}) {
  const identity = contextIdentity(app);
  return {
    schema: INK_AGENT_RESULT_SCHEMA,
    version: INK_AGENT_RESULT_VERSION,
    action: String(action || 'unknown'),
    status: String(status || 'COMPLETED'),
    documentId: identity.documentId,
    pageId: identity.pageId,
    revisionId: identity.revisionId,
    targetRefs: safeClone(normalizeRefs(targetRefs)),
    createdRefs: safeClone(normalizeRefs(createdRefs)),
    changedRefs: safeClone(normalizeRefs(changedRefs)),
    historyReceipt: safeClone(historyReceipt),
    revisionReceipt: safeClone(revisionReceipt),
    provenanceReceipt: safeClone(provenanceReceipt),
    outputHandles: safeClone(outputHandles),
    diagnostics: safeClone(diagnostics),
    result: safeClone(result)
  };
}

function failedResult(app, action, error, result = null) {
  return createInkAgentResult(app, action, {
    status: 'FAILED',
    diagnostics: [diagnostic(error, action)],
    result
  });
}

export function createInkPublicCreativeApi(app) {
  if (!app) throw new TypeError('INK public API requires an InkApp instance');
  const outputRegistry = installInkOutputRegistry(app);
  const capabilitySummaries = getInkCapabilitySummaries();
  const namedToolDefinitions = getInkNamedToolDefinitions();

  const capabilities = () => {
    try {
      return createInkAgentResult(app, 'capabilities', {
        result: {
          api: { schema: INK_PUBLIC_CREATIVE_API_SCHEMA, version: INK_PUBLIC_CREATIVE_API_VERSION },
          capabilities: capabilitySummaries,
          namedTools: namedToolDefinitions
        }
      });
    } catch (error) {
      return failedResult(app, 'capabilities', error);
    }
  };

  const context = (options = {}) => {
    try {
      const result = bridgeRead(app, options);
      return createInkAgentResult(app, 'context', {
        targetRefs: refsFromBridgeObjects(result.objects),
        result
      });
    } catch (error) {
      return failedResult(app, 'context', error);
    }
  };

  const selection = (options = {}) => {
    try {
      const ids = selectedObjectIds(app);
      const result = bridgeRead(app, ids.length ? { ...options, objectIds: ids } : options);
      const selected = new Set(ids);
      const objects = result.objects.filter(item => selected.has(item.ref.objectId));
      return createInkAgentResult(app, 'selection', {
        targetRefs: refsFromBridgeObjects(objects),
        result: {
          selection: result.selection,
          objects,
          contextFingerprint: result.contextFingerprint
        }
      });
    } catch (error) {
      return failedResult(app, 'selection', error);
    }
  };

  const inspect = (refsOrObjectIds, options = {}) => {
    try {
      if (isRecord(refsOrObjectIds) && (hasOwn(refsOrObjectIds, 'refs') || hasOwn(refsOrObjectIds, 'objectIds') || hasOwn(refsOrObjectIds, 'options'))) {
        const input = refsOrObjectIds;
        refsOrObjectIds = input.refs ?? input.objectIds ?? [];
        options = input.options ?? options;
      }
      const refs = normalizeRefs(refsOrObjectIds);
      if (!refs.length) throw Object.assign(new Error('INK inspect requires at least one stable object reference'), { code: 'INK_AGENT_INSPECT_TARGET_REQUIRED' });
      const result = bridgeRead(app, { ...options, objectIds: refs.map(ref => ref.objectId) });
      return createInkAgentResult(app, 'inspect', {
        targetRefs: refsFromBridgeObjects(result.objects),
        result
      });
    } catch (error) {
      return failedResult(app, 'inspect', error);
    }
  };

  const reference = Object.freeze({
    async decompose(referenceObjectId, options = {}) {
      const action = 'reference.decompose';
      try {
        if (isRecord(referenceObjectId) && hasOwn(referenceObjectId, 'referenceObjectId')) {
          const input = referenceObjectId;
          referenceObjectId = input.referenceObjectId;
          options = input.options ?? options;
        }
        if (typeof app?.chatReferenceHandoff?.decomposeReference !== 'function') {
          throw Object.assign(new Error('INK Reference decomposition authority unavailable'), { code: 'INK_AGENT_REFERENCE_AUTHORITY_UNAVAILABLE' });
        }
        const raw = await app.chatReferenceHandoff.decomposeReference(referenceObjectId, options);
        const metadata = referenceResultMetadata(raw, app);
        return createInkAgentResult(app, action, {
          status: raw?.status || 'COMPLETED',
          ...metadata,
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const edit = Object.freeze({
    inspect() {
      const action = 'edit.inspect';
      try {
        const raw = app?.chatBoundedEditAdapter?.inspect?.();
        if (!raw) throw Object.assign(new Error('INK bounded edit authority unavailable'), { code: 'INK_AGENT_EDIT_AUTHORITY_UNAVAILABLE' });
        const metadata = editResultMetadata(raw);
        return createInkAgentResult(app, action, {
          status: raw.ok ? 'COMPLETED' : 'FAILED',
          ...metadata,
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    propose(task) {
      const action = 'edit.propose';
      try {
        const raw = app?.chatBoundedEditAdapter?.propose?.(task);
        if (!raw) throw Object.assign(new Error('INK bounded edit authority unavailable'), { code: 'INK_AGENT_EDIT_AUTHORITY_UNAVAILABLE' });
        const metadata = editResultMetadata(raw);
        return createInkAgentResult(app, action, {
          status: raw.ok ? (raw.result?.state || 'PROPOSED') : 'FAILED',
          ...metadata,
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    approve(proposalId) {
      const action = 'edit.approve';
      try {
        if (isRecord(proposalId)) proposalId = proposalId.proposalId;
        const raw = app?.chatBoundedEditAdapter?.approve?.(proposalId);
        if (!raw) throw Object.assign(new Error('INK bounded edit authority unavailable'), { code: 'INK_AGENT_EDIT_AUTHORITY_UNAVAILABLE' });
        const metadata = editResultMetadata(raw);
        return createInkAgentResult(app, action, {
          status: raw.ok ? (raw.result?.state || 'APPROVED') : 'FAILED',
          ...metadata,
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    execute(proposalId, approvalToken) {
      const action = 'edit.execute';
      try {
        if (isRecord(proposalId)) {
          const input = proposalId;
          proposalId = input.proposalId;
          approvalToken = input.approvalToken ?? approvalToken;
        }
        const raw = app?.chatBoundedEditAdapter?.execute?.(proposalId, approvalToken);
        if (!raw) throw Object.assign(new Error('INK bounded edit authority unavailable'), { code: 'INK_AGENT_EDIT_AUTHORITY_UNAVAILABLE' });
        const metadata = editResultMetadata(raw);
        return createInkAgentResult(app, action, {
          status: raw.ok ? (raw.result?.state || 'EXECUTED') : 'FAILED',
          ...metadata,
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const history = Object.freeze({
    inspect() {
      const action = 'history.inspect';
      try {
        return createInkAgentResult(app, action, { result: historyInspection(app) });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    undo() {
      const action = 'history.undo';
      try {
        if (typeof app?.history?.undo !== 'function') throw Object.assign(new Error('INK History authority unavailable'), { code: 'INK_AGENT_HISTORY_UNAVAILABLE' });
        const before = historyInspection(app);
        const applied = app.history.undo();
        const after = historyInspection(app);
        return createInkAgentResult(app, action, {
          status: applied ? 'COMPLETED' : 'NO_OP',
          historyReceipt: { applied, before, after },
          result: { applied, history: after }
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    redo() {
      const action = 'history.redo';
      try {
        if (typeof app?.history?.redo !== 'function') throw Object.assign(new Error('INK History authority unavailable'), { code: 'INK_AGENT_HISTORY_UNAVAILABLE' });
        const before = historyInspection(app);
        const applied = app.history.redo();
        const after = historyInspection(app);
        return createInkAgentResult(app, action, {
          status: applied ? 'COMPLETED' : 'NO_OP',
          historyReceipt: { applied, before, after },
          result: { applied, history: after }
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const revision = Object.freeze({
    current() {
      const action = 'revision.current';
      try {
        if (!app?.revisions) throw Object.assign(new Error('INK Revision authority unavailable'), { code: 'INK_AGENT_REVISION_UNAVAILABLE' });
        return createInkAgentResult(app, action, {
          result: {
            revisionId: currentRevisionId(app),
            diagnostics: typeof app.revisions.diagnostics === 'function' ? app.revisions.diagnostics() : null
          }
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    async list(documentId = app?.doc?.id) {
      const action = 'revision.list';
      try {
        if (isRecord(documentId)) documentId = documentId.documentId ?? app?.doc?.id;
        if (typeof app?.revisions?.list !== 'function') throw Object.assign(new Error('INK Revision authority unavailable'), { code: 'INK_AGENT_REVISION_UNAVAILABLE' });
        const items = await app.revisions.list(documentId);
        return createInkAgentResult(app, action, { result: { items } });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    async capture(options = {}) {
      const action = 'revision.capture';
      try {
        if (typeof app?.revisions?.capture !== 'function') throw Object.assign(new Error('INK Revision authority unavailable'), { code: 'INK_AGENT_REVISION_UNAVAILABLE' });
        const raw = await app.revisions.capture(options);
        return createInkAgentResult(app, action, {
          status: raw?.created === false ? 'NO_OP' : 'COMPLETED',
          revisionReceipt: compactRevisionReceipt(raw),
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    async restore(revisionId, options = {}) {
      const action = 'revision.restore';
      try {
        if (isRecord(revisionId) && hasOwn(revisionId, 'revisionId')) {
          const input = revisionId;
          revisionId = input.revisionId;
          options = input.options ?? options;
        }
        if (typeof app?.revisions?.restore !== 'function') throw Object.assign(new Error('INK Revision authority unavailable'), { code: 'INK_AGENT_REVISION_UNAVAILABLE' });
        const raw = await app.revisions.restore(revisionId, options);
        return createInkAgentResult(app, action, {
          status: raw?.restored === false ? 'FAILED' : 'COMPLETED',
          revisionReceipt: compactRevisionReceipt(raw),
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const preview = Object.freeze({
    async capture(options = {}) {
      const action = 'preview.capture';
      try {
        const raw = await captureInkPreview(app, outputRegistry, isRecord(options) ? options : {});
        return createInkAgentResult(app, action, {
          targetRefs: raw.targetRefs,
          outputHandles: [raw.handle],
          result: raw.result
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const asset = Object.freeze({
    inspect(handleId) {
      const action = 'asset.inspect';
      try {
        if (isRecord(handleId)) handleId = handleId.handleId;
        const raw = inspectInkOutput(app, outputRegistry, handleId);
        return createInkAgentResult(app, action, {
          targetRefs: raw.handle?.objectRefs || [],
          outputHandles: raw.handle ? [raw.handle] : [],
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    },
    release(handleId) {
      const action = 'asset.release';
      try {
        if (isRecord(handleId)) handleId = handleId.handleId;
        const raw = releaseInkOutput(app, outputRegistry, handleId);
        return createInkAgentResult(app, action, {
          status: raw.found ? 'COMPLETED' : 'NO_OP',
          targetRefs: raw.handle?.objectRefs || [],
          outputHandles: raw.handle ? [raw.handle] : [],
          result: raw
        });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const capability = Object.freeze({
    describe(idOrToolName) {
      const action = 'capability.describe';
      try {
        if (isRecord(idOrToolName)) idOrToolName = idOrToolName.idOrToolName ?? idOrToolName.capabilityId ?? idOrToolName.toolName;
        const descriptor = resolveInkCapabilityDescriptor(idOrToolName);
        if (!descriptor) {
          throw Object.assign(new Error('Unknown INK capability or named tool'), {
            code: 'INK_CAPABILITY_NOT_FOUND',
            field: 'idOrToolName',
            actual: String(idOrToolName || '')
          });
        }
        return createInkAgentResult(app, action, { result: descriptor });
      } catch (error) {
        return failedResult(app, action, error);
      }
    }
  });

  const publicMethods = Object.freeze({ capabilities, context, selection, inspect, reference, edit, history, revision, preview, asset, capability });
  const toolHandlers = Object.freeze({
    get_ink_capabilities: () => capabilities(),
    get_ink_context: input => context(input?.options ?? input ?? {}),
    get_ink_selection: input => selection(input?.options ?? input ?? {}),
    inspect_ink_objects: input => inspect(input?.refs ?? input?.objectIds ?? input, input?.options ?? {}),
    decompose_ink_reference: input => reference.decompose(input?.referenceObjectId, input?.options ?? {}),
    propose_ink_edit: input => edit.propose(input?.task ?? input),
    approve_ink_edit: input => edit.approve(input?.proposalId),
    execute_ink_edit: input => edit.execute(input?.proposalId, input?.approvalToken),
    get_ink_history: () => history.inspect(),
    undo_ink: () => history.undo(),
    redo_ink: () => history.redo(),
    get_ink_revisions: input => revision.list(input?.documentId ?? app?.doc?.id),
    capture_ink_revision: input => revision.capture(input?.options ?? input ?? {}),
    restore_ink_revision: input => revision.restore(input?.revisionId, input?.options ?? {}),
    get_ink_preview: input => preview.capture(input?.options ?? input ?? {}),
    inspect_ink_output: input => asset.inspect(input?.handleId ?? input),
    release_ink_output: input => asset.release(input?.handleId ?? input),
    describe_ink_capability: input => capability.describe(input?.idOrToolName ?? input?.capabilityId ?? input?.toolName ?? input)
  });

  const tools = Object.freeze({
    registry() { return safeClone(namedToolDefinitions); },
    invoke(name, input = {}) {
      const handler = toolHandlers[String(name || '')];
      if (!handler) return failedResult(app, 'tools.invoke', Object.assign(new Error('Unknown INK named tool'), { code: 'INK_AGENT_TOOL_NOT_FOUND' }));
      return handler(input);
    }
  });

  return Object.freeze({
    schema: INK_PUBLIC_CREATIVE_API_SCHEMA,
    version: INK_PUBLIC_CREATIVE_API_VERSION,
    ...publicMethods,
    tools
  });
}

export function installInkPublicCreativeApi(app) {
  if (app?.inkPublicApi?.schema === INK_PUBLIC_CREATIVE_API_SCHEMA) return app.inkPublicApi;
  const api = createInkPublicCreativeApi(app);
  Object.defineProperty(app, 'inkPublicApi', {
    value: api,
    writable: false,
    configurable: false,
    enumerable: true
  });
  return api;
}
