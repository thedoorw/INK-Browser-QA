import { deepClone, nowISO } from '../core/index.js';
import { documentFingerprint, fnv1a32, inspectDocument, stableStringify } from './integrity.js';
import { inspectInkFileEnvelope, wrapInkFile } from './file-envelope.js';

export const REVISION_RECORD_SCHEMA = 'INK-REVISION-RECORD';
export const REVISION_RECORD_VERSION = 1;
export const REVISION_INTEGRITY_ALGORITHM = 'fnv1a32-canonical-json';

const record = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const validString = value => typeof value === 'string' && value.trim().length > 0;
const validTimestamp = value => validString(value) && Number.isFinite(Date.parse(value));
const nullableString = value => value == null || validString(value);
const fail = (code, details = {}) => { throw Object.assign(new Error(code), { code, ...details }); };

function boundedText(value, fallback, max = 240) {
  const text = String(value == null ? fallback : value).trim();
  if (!text || text.length > max) fail('revision-invalid-metadata');
  return text;
}

export function revisionRecordFingerprint(revision) {
  if (!record(revision)) fail('revision-invalid-record');
  const { integrity, ...payload } = revision;
  return `fnv1a32:${fnv1a32(stableStringify(payload))}`;
}

export function deriveRevisionId({
  documentId,
  parentRevisionId = null,
  sequence = 1,
  documentFingerprint: fingerprint
} = {}) {
  if (!validString(documentId) || !nullableString(parentRevisionId)) fail('revision-invalid-identity');
  if (!Number.isSafeInteger(sequence) || sequence < 1 || !validString(fingerprint)) fail('revision-invalid-identity');
  const documentKey = fnv1a32(documentId);
  const relationKey = fnv1a32(stableStringify({
    documentId,
    parentRevisionId: parentRevisionId || null,
    sequence,
    documentFingerprint: fingerprint
  }));
  return `ink-rev:${documentKey}:r${sequence}:${relationKey}:${fingerprint.split(':').at(-1)}`;
}

export function inspectRevisionRecord(revision) {
  const errors = [];
  const add = (code, details = {}) => errors.push({ code, ...details });
  if (!record(revision)) return { valid: false, errors: [{ code: 'revision-invalid-record' }] };
  if (revision.schema !== REVISION_RECORD_SCHEMA || revision.version !== REVISION_RECORD_VERSION) add('revision-unsupported-schema');
  if (!validString(revision.revisionId) || !validString(revision.documentId)) add('revision-invalid-identity');
  if (!Number.isSafeInteger(revision.sequence) || revision.sequence < 1) add('revision-invalid-sequence');
  if (!nullableString(revision.parentRevisionId) || !nullableString(revision.baseRevisionId)) add('revision-invalid-relation');
  if (!validTimestamp(revision.createdAt)) add('revision-invalid-created-at');
  if (!validString(revision.reason) || !validString(revision.label)) add('revision-invalid-metadata');
  if (!validString(revision.documentFingerprint)) add('revision-invalid-document-fingerprint');
  if (revision.comparison !== null && !record(revision.comparison)) add('revision-invalid-comparison');

  const envelopeInspection = inspectInkFileEnvelope(revision.envelope);
  if (!envelopeInspection.valid) add('revision-envelope-invalid', { inspection: envelopeInspection });
  const document = revision.envelope?.document;
  const documentInspection = document ? inspectDocument(document) : { passed: false, errors: [{ code: 'missing-document' }] };
  if (!documentInspection.passed) add('revision-document-invalid', { inspection: documentInspection });
  if (document?.id !== revision.documentId) add('revision-document-id-mismatch');
  if (revision.envelope?.revision !== revision.sequence) add('revision-sequence-mismatch');
  if (revision.envelope?.revisionId !== revision.revisionId) add('revision-envelope-id-mismatch');
  const actualDocumentFingerprint = document ? documentFingerprint(document) : null;
  if (actualDocumentFingerprint !== revision.documentFingerprint) add('revision-document-fingerprint-mismatch', { actualDocumentFingerprint });

  let actualRecordFingerprint = null;
  try { actualRecordFingerprint = revisionRecordFingerprint(revision); }
  catch (error) { add('revision-record-not-serializable', { cause: String(error) }); }
  if (revision.integrity?.algorithm !== REVISION_INTEGRITY_ALGORITHM
      || revision.integrity?.fingerprint !== actualRecordFingerprint) {
    add('revision-record-fingerprint-mismatch', { actualRecordFingerprint });
  }

  return {
    valid: errors.length === 0,
    errors,
    actualDocumentFingerprint,
    actualRecordFingerprint,
    documentInspection,
    envelopeInspection
  };
}

export function createRevisionRecord(document, {
  parentRecord = null,
  baseRevisionId = null,
  createdAt = nowISO(),
  reason = 'manual',
  label = 'Revision',
  revisionId = null,
  comparison = null
} = {}) {
  const documentInspection = inspectDocument(document);
  if (!documentInspection.passed) fail('revision-document-invalid', { inspection: documentInspection });
  if (!validTimestamp(createdAt)) fail('revision-invalid-created-at');

  let parent = null;
  if (parentRecord != null) {
    const parentInspection = inspectRevisionRecord(parentRecord);
    if (!parentInspection.valid) fail('revision-parent-invalid', { inspection: parentInspection });
    parent = parentRecord;
    if (parent.documentId !== document.id) fail('revision-parent-document-mismatch');
  }

  const parentRevisionId = parent?.revisionId || null;
  const sequence = parent ? parent.sequence + 1 : 1;
  const fingerprint = documentInspection.fingerprint || documentFingerprint(document);
  const resolvedBase = baseRevisionId == null
    ? (parent?.baseRevisionId || parent?.revisionId || null)
    : baseRevisionId;
  if (!nullableString(resolvedBase)) fail('revision-invalid-base-revision');

  const resolvedRevisionId = revisionId || deriveRevisionId({
    documentId: document.id,
    parentRevisionId,
    sequence,
    documentFingerprint: fingerprint
  });
  if (!validString(resolvedRevisionId)) fail('revision-invalid-identity');

  const snapshotEnvelope = wrapInkFile(document, {
    fileId: document.id,
    revision: sequence,
    revisionId: resolvedRevisionId,
    savedAt: createdAt
  });

  const revision = {
    schema: REVISION_RECORD_SCHEMA,
    version: REVISION_RECORD_VERSION,
    revisionId: resolvedRevisionId,
    documentId: document.id,
    sequence,
    parentRevisionId,
    baseRevisionId: resolvedBase,
    createdAt,
    reason: boundedText(reason, 'manual', 120),
    label: boundedText(label, 'Revision', 240),
    documentFingerprint: fingerprint,
    envelope: snapshotEnvelope,
    comparison: comparison == null ? null : deepClone(comparison)
  };
  revision.integrity = {
    algorithm: REVISION_INTEGRITY_ALGORITHM,
    fingerprint: revisionRecordFingerprint(revision)
  };
  return revision;
}

export function cloneRevisionRecord(revision) {
  const inspection = inspectRevisionRecord(revision);
  if (!inspection.valid) fail('revision-invalid-record', { inspection });
  return deepClone(revision);
}
