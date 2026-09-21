import {
  chatStateFingerprint,
  normalizeChatEditTask
} from './chat-bounded-edit.js';

export const CHAT_CREATIVE_PLAN_SCHEMA = 'INK-CHAT-CREATIVE-PLAN';
export const CHAT_CREATIVE_PLAN_VERSION = 1;
export const CHAT_CREATIVE_PLAN_RESULT_SCHEMA = 'INK-CHAT-CREATIVE-PLAN-RESULT';
export const CHAT_CREATIVE_PLAN_RESULT_VERSION = 1;

export const CHAT_CREATIVE_PLAN_STATES = Object.freeze([
  'PROPOSED',
  'APPROVED',
  'EXECUTING',
  'COMPLETED',
  'STOPPED',
  'REJECTED'
]);

const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);

function planFail(code, details = {}) {
  throw Object.assign(new Error(`INK_CHAT_PLAN_${code}`), {
    code: `CHAT_PLAN_${code}`,
    ...details
  });
}

function boundedText(value, field, { required = true, max = 240 } = {}) {
  if (value == null || value === '') {
    if (!required) return null;
    planFail('FIELD_REQUIRED', { field });
  }
  if (typeof value !== 'string') planFail('FIELD_INVALID', { field });
  const text = value.trim();
  if ((required && !text) || text.length > max) planFail('FIELD_INVALID', { field });
  return text || null;
}

function normalizeSource(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) planFail('SOURCE_REQUIRED');
  const source = {
    documentId: boundedText(raw.documentId, 'source.documentId', { max: 160 }),
    pageId: boundedText(raw.pageId, 'source.pageId', { max: 160 }),
    revisionId: hasOwn(raw, 'revisionId')
      ? (raw.revisionId == null ? null : boundedText(raw.revisionId, 'source.revisionId', { max: 220 }))
      : null,
    documentFingerprint: boundedText(raw.documentFingerprint, 'source.documentFingerprint', { max: 160 })
  };
  return source;
}

function normalizeDependencies(raw, index) {
  if (raw == null) return [];
  if (!Array.isArray(raw) || raw.length > 32) planFail('DEPENDENCIES_INVALID', { index });
  const dependencies = raw.map((value, dependencyIndex) =>
    boundedText(value, `steps[${index}].dependsOn[${dependencyIndex}]`, { max: 160 }));
  if (new Set(dependencies).size !== dependencies.length) {
    planFail('DEPENDENCY_DUPLICATE', { index });
  }
  return dependencies;
}

function normalizeStep(raw, index) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) planFail('STEP_INVALID', { index });
  const stepId = boundedText(raw.stepId, `steps[${index}].stepId`, { max: 160 });
  const task = normalizeChatEditTask({
    schema: 'INK-CHAT-EDIT-TASK',
    version: 1,
    taskId: raw.taskId || `plan-step:${stepId}`,
    operation: raw.operation,
    targets: raw.targets,
    arguments: raw.arguments,
    expected: raw.expected ?? null
  });
  return {
    stepId,
    operation: task.operation,
    targets: clone(task.targets),
    arguments: clone(task.arguments),
    dependsOn: normalizeDependencies(raw.dependsOn, index)
  };
}

function validateStepGraph(steps) {
  const ids = steps.map(step => step.stepId);
  const unique = new Set(ids);
  if (unique.size !== ids.length) planFail('STEP_ID_DUPLICATE');

  const indexById = new Map(ids.map((id, index) => [id, index]));
  steps.forEach((step, index) => {
    for (const dependency of step.dependsOn) {
      if (!indexById.has(dependency)) {
        planFail('DEPENDENCY_MISSING', { stepId: step.stepId, dependency });
      }
      const dependencyIndex = indexById.get(dependency);
      if (dependencyIndex >= index) {
        planFail('DEPENDENCY_ORDER_INVALID', {
          stepId: step.stepId,
          dependency,
          dependencyIndex,
          stepIndex: index
        });
      }
    }
  });
}

function derivePlanId(source, intentSummary, steps) {
  const fingerprint = chatStateFingerprint({
    source,
    intentSummary,
    steps: steps.map(step => ({
      stepId: step.stepId,
      operation: step.operation,
      targets: step.targets,
      arguments: step.arguments,
      dependsOn: step.dependsOn
    }))
  });
  return `plan:${source.documentId}:${fingerprint.slice(-8)}`;
}

export function normalizeChatCreativePlan(raw, { source = null } = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) planFail('PLAN_INVALID');
  if (raw.schema != null && raw.schema !== CHAT_CREATIVE_PLAN_SCHEMA) {
    planFail('SCHEMA_UNSUPPORTED', { schema: raw.schema });
  }
  if (raw.version != null && Number(raw.version) !== CHAT_CREATIVE_PLAN_VERSION) {
    planFail('VERSION_UNSUPPORTED', { version: raw.version });
  }

  if (!Array.isArray(raw.steps) || raw.steps.length < 2 || raw.steps.length > 32) {
    planFail('STEPS_INVALID', { min: 2, max: 32, actual: raw.steps?.length ?? null });
  }

  const normalizedSource = normalizeSource(raw.source ?? source);
  const intentSummary = boundedText(raw.intentSummary, 'intentSummary', { max: 1000 });
  const steps = raw.steps.map(normalizeStep);
  validateStepGraph(steps);

  const planId = raw.planId
    ? boundedText(raw.planId, 'planId', { max: 220 })
    : derivePlanId(normalizedSource, intentSummary, steps);

  return {
    schema: CHAT_CREATIVE_PLAN_SCHEMA,
    version: CHAT_CREATIVE_PLAN_VERSION,
    planId,
    source: normalizedSource,
    intentSummary,
    steps,
    status: 'PROPOSED',
    diagnostics: []
  };
}

export function chatCreativePlanDiagnostic(error, phase = 'unknown') {
  const code = typeof error?.code === 'string' ? error.code : 'CHAT_PLAN_UNKNOWN';
  const diagnostic = { ok: false, phase, code };
  for (const key of [
    'field', 'schema', 'version', 'stepId', 'stepIndex', 'dependency',
    'dependencyIndex', 'operation', 'objectId', 'pageId', 'layerId',
    'expected', 'actual', 'min', 'max'
  ]) {
    if (error?.[key] !== undefined) diagnostic[key] = clone(error[key]);
  }
  return diagnostic;
}
