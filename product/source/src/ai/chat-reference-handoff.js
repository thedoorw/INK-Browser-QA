export const CHAT_REFERENCE_HANDOFF_SCHEMA = 'INK-CHAT-REFERENCE-HANDOFF/1';
export const CHAT_REFERENCE_HANDOFF_CHANNEL = 'CHAT_ATTACHMENT_HANDOFF';
export const CHAT_REFERENCE_HANDOFF_OPERATION = 'reference.import';

const clone = value => value == null ? value : structuredClone(value);

function fail(code, message = code, details = {}) {
  throw Object.assign(new Error(message), { code, details });
}

function isBlob(value) {
  return typeof Blob !== 'undefined' && value instanceof Blob;
}

function isFile(value) {
  return typeof File !== 'undefined' && value instanceof File;
}

export function normalizeChatAttachment(input, options = {}) {
  const direct = input?.file ?? input;
  if (isFile(direct)) return direct;

  const blob = isBlob(direct) ? direct : input?.blob;
  if (!isBlob(blob)) fail('CHAT_REFERENCE_HANDOFF_BINARY_REQUIRED', 'CHAT handoff requires a File or Blob');

  const name = String(options.name || input?.name || '').trim();
  const type = String(options.type || options.mimeType || input?.type || blob.type || '').trim();
  if (!name) fail('CHAT_REFERENCE_HANDOFF_NAME_REQUIRED', 'Blob handoff requires an explicit file name');
  if (!type) fail('CHAT_REFERENCE_HANDOFF_TYPE_REQUIRED', 'Blob handoff requires an explicit MIME type');
  if (typeof File === 'undefined') fail('CHAT_REFERENCE_HANDOFF_FILE_API_UNAVAILABLE', 'Browser File API is required');

  return new File([blob], name, {
    type,
    lastModified: Number(options.lastModified || input?.lastModified || Date.now())
  });
}

function historySnapshot(app) {
  const history = app?.history;
  const undo = Array.isArray(history?.undoStack) ? history.undoStack : [];
  const redo = Array.isArray(history?.redoStack) ? history.redoStack : [];
  let timeline = null;
  try { timeline = typeof history?.timeline === 'function' ? history.timeline() : null; } catch {}
  const entries = Array.isArray(timeline?.entries) ? timeline.entries : [...undo, ...[...redo].reverse()];
  const applied = Number.isInteger(timeline?.applied) ? timeline.applied : undo.length;
  const limit = Number.isInteger(timeline?.limit)
    ? timeline.limit
    : Number.isInteger(history?.limit) ? history.limit : Math.max(applied, entries.length);
  const last = applied > 0 ? entries[applied - 1] || null : null;
  return {
    undoCount: undo.length,
    redoCount: redo.length,
    applied,
    retainedCount: entries.length,
    limit,
    pending: Boolean(history?.pending),
    lastEntry: last ? {
      label: last.label || null,
      objectIds: clone(last.objectIds || []),
      patchCount: Number(last.patchCount || 0),
      captureMode: last.captureMode || null
    } : null
  };
}

function historyCommitValidation(before, after, referenceObjectId) {
  const expectedApplied = Math.min(before.applied + 1, after.limit);
  const newestMatches = after.lastEntry?.label === 'Reference import · CHAT attachment'
    && Array.isArray(after.lastEntry?.objectIds)
    && after.lastEntry.objectIds.includes(referenceObjectId);
  const redoCleared = after.redoCount === 0;
  const valid = !after.pending
    && after.applied === expectedApplied
    && newestMatches
    && redoCleared;
  return {
    valid,
    saturatedBefore: before.applied >= before.limit,
    expectedApplied,
    actualApplied: after.applied,
    limit: after.limit,
    newestMatches,
    redoCleared
  };
}

function revisionIdentity(app) {
  return app?.revisions?.revisionIdFor?.(app?.doc?.id) ?? null;
}

function provenanceIdentity(provider, referenceObjectId) {
  if (!provider?.read || !referenceObjectId) return null;
  const context = provider.read();
  const provenance = context?.modules?.provenance;
  const events = provenance?.context?.events || [];
  const matched = events.filter(event =>
    event?.target?.type === 'object' && event.target.id === referenceObjectId
    || Array.isArray(event?.objectIds) && event.objectIds.includes(referenceObjectId)
  );
  return {
    status: provenance?.status || 'UNAVAILABLE',
    fingerprint: provenance?.fingerprint || null,
    eventIds: matched.map(event => event.eventId).filter(Boolean),
    eventKinds: matched.map(event => event.kind).filter(Boolean)
  };
}

function addAudit(auditLog, record) {
  return auditLog?.add ? auditLog.add(record) : null;
}

export function createChatReferenceHandoffAdapter(app, {
  auditLog = null,
  groundedContextProvider = null
} = {}) {
  if (!app?.extraction?.decode || !app?.extraction?.importReference) {
    fail('CHAT_REFERENCE_HANDOFF_REFERENCE_AUTHORITY_UNAVAILABLE', 'Authoritative Reference import authority is unavailable');
  }

  return Object.freeze({
    schema: CHAT_REFERENCE_HANDOFF_SCHEMA,
    async importReference(input, options = {}) {
      const intent = String(options.intent || 'Import CHAT attachment as INK Reference');
      const actor = clone(options.actor || { type: 'chat', id: 'chat', channel: CHAT_REFERENCE_HANDOFF_CHANNEL });
      const historyBefore = historySnapshot(app);
      const revisionBefore = revisionIdentity(app);
      const documentIdBefore = app?.doc?.id || null;
      let file = null;
      let decoded = null;
      let imported = null;
      let audit = null;

      try {
        file = normalizeChatAttachment(input, options);
        decoded = await app.extraction.decode(file);
        imported = app.extraction.importReference(decoded, {
          actor,
          sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL,
          operation: CHAT_REFERENCE_HANDOFF_OPERATION,
          matrix: options.matrix
        });

        const historyAfter = historySnapshot(app);
        const revisionAfter = revisionIdentity(app);
        const historyCommit = historyCommitValidation(historyBefore, historyAfter, imported.referenceObjectId);
        if (!historyCommit.valid) {
          fail('CHAT_REFERENCE_HANDOFF_HISTORY_CONTRACT', 'Reference import History receipt does not match the committed authoritative entry', {
            historyBefore,
            historyAfter,
            historyCommit,
            referenceObjectId: imported.referenceObjectId
          });
        }

        audit = addAudit(auditLog, {
          actor,
          modelClient: 'CHAT_ATTACHMENT_HANDOFF',
          promptSummary: intent,
          permissionLevel: 'EXECUTE',
          targetIds: [imported.referenceObjectId],
          commands: [CHAT_REFERENCE_HANDOFF_OPERATION],
          parameters: {
            sourceName: decoded.source.name,
            mimeType: decoded.source.mimeType,
            sourceSha256: decoded.source.sha256,
            width: decoded.source.width,
            height: decoded.source.height,
            sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL
          },
          executionResult: {
            status: 'COMPLETED',
            documentId: imported.documentId,
            layerId: imported.layerId,
            referenceObjectId: imported.referenceObjectId
          },
          securityEvents: ['BROWSER_LOCAL_BINARY_HANDOFF', 'AUTHORITATIVE_HISTORY_PATH'],
          auditMetadata: {
            schema: CHAT_REFERENCE_HANDOFF_SCHEMA,
            operation: CHAT_REFERENCE_HANDOFF_OPERATION,
            sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL
          }
        });

        const provenance = provenanceIdentity(groundedContextProvider, imported.referenceObjectId);
        return {
          schema: CHAT_REFERENCE_HANDOFF_SCHEMA,
          version: 1,
          operation: CHAT_REFERENCE_HANDOFF_OPERATION,
          intent,
          actor,
          sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL,
          documentId: imported.documentId,
          targetLayerId: imported.layerId,
          referenceObjectId: imported.referenceObjectId,
          source: {
            name: decoded.source.name,
            mimeType: decoded.source.mimeType,
            sha256: decoded.source.sha256,
            width: decoded.source.width,
            height: decoded.source.height,
            sizeBytes: decoded.source.sizeBytes
          },
          history: { before: historyBefore, after: historyAfter, commit: historyCommit },
          revision: { before: revisionBefore, after: revisionAfter },
          audit: audit ? { auditId: audit.auditId, format: audit.format } : null,
          provenance,
          status: 'COMPLETED',
          error: null
        };
      } catch (error) {
        const historyAfter = historySnapshot(app);
        const revisionAfter = revisionIdentity(app);
        const committed = Boolean(imported);
        const historyCommit = committed
          ? historyCommitValidation(historyBefore, historyAfter, imported.referenceObjectId)
          : null;
        const receiptStatus = committed ? 'COMMITTED_WITH_ERROR' : 'FAILED';
        const failureAudit = addAudit(auditLog, {
          actor,
          modelClient: 'CHAT_ATTACHMENT_HANDOFF',
          promptSummary: intent,
          permissionLevel: 'EXECUTE',
          commands: [CHAT_REFERENCE_HANDOFF_OPERATION],
          parameters: {
            sourceName: decoded?.source?.name || file?.name || options.name || null,
            mimeType: decoded?.source?.mimeType || file?.type || options.type || options.mimeType || null,
            sourceSha256: decoded?.source?.sha256 || null,
            sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL
          },
          executionResult: imported ? {
            status: 'COMMITTED_WITH_ERROR',
            documentId: imported.documentId,
            layerId: imported.layerId,
            referenceObjectId: imported.referenceObjectId
          } : { status: 'FAILED' },
          error: { code: error?.code || 'CHAT_REFERENCE_HANDOFF_FAILED', message: error?.message || String(error) },
          securityEvents: ['BROWSER_LOCAL_BINARY_HANDOFF'],
          auditMetadata: {
            schema: CHAT_REFERENCE_HANDOFF_SCHEMA,
            operation: CHAT_REFERENCE_HANDOFF_OPERATION,
            sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL
          }
        });
        return {
          schema: CHAT_REFERENCE_HANDOFF_SCHEMA,
          version: 1,
          operation: CHAT_REFERENCE_HANDOFF_OPERATION,
          intent,
          actor,
          sourceChannel: CHAT_REFERENCE_HANDOFF_CHANNEL,
          documentId: app?.doc?.id || documentIdBefore,
          targetLayerId: imported?.layerId || app?.layer?.()?.id || null,
          referenceObjectId: imported?.referenceObjectId || null,
          source: decoded?.source ? {
            name: decoded.source.name,
            mimeType: decoded.source.mimeType,
            sha256: decoded.source.sha256,
            width: decoded.source.width,
            height: decoded.source.height,
            sizeBytes: decoded.source.sizeBytes
          } : null,
          history: { before: historyBefore, after: historyAfter, commit: historyCommit },
          revision: { before: revisionBefore, after: revisionAfter },
          audit: failureAudit ? { auditId: failureAudit.auditId, format: failureAudit.format } : null,
          provenance: imported ? provenanceIdentity(groundedContextProvider, imported.referenceObjectId) : null,
          status: receiptStatus,
          error: { code: error?.code || 'CHAT_REFERENCE_HANDOFF_FAILED', message: error?.message || String(error) }
        };
      }
    }
  });
}

export function installChatReferenceHandoff(app, {
  auditLog = globalThis.INK_AI?.layer?.audit || null,
  groundedContextProvider = globalThis.INK_AI?.runtime?.groundedContextProvider || null
} = {}) {
  if (app?.chatReferenceHandoff?.importReference) return app.chatReferenceHandoff;
  const adapter = createChatReferenceHandoffAdapter(app, { auditLog, groundedContextProvider });
  app.chatReferenceHandoff = adapter;
  globalThis.INK_CHAT_HANDOFF = Object.freeze({
    version: 1,
    schema: CHAT_REFERENCE_HANDOFF_SCHEMA,
    importReference: (input, options) => adapter.importReference(input, options)
  });
  return adapter;
}
