import { CHAT_EDIT_OPERATIONS } from '../editor/chat-bounded-edit.js';

export const INK_CAPABILITY_DESCRIPTOR_SCHEMA = 'INK_CAPABILITY_DESCRIPTOR';
export const INK_CAPABILITY_DESCRIPTOR_VERSION = 1;

export const INK_CAPABILITY_INPUT_SCHEMA_KEYWORDS = Object.freeze([
  'type', 'properties', 'required', 'items', 'enum', 'const',
  'minimum', 'maximum', 'minItems', 'maxItems',
  'additionalProperties', 'description', 'default'
]);

export const INK_CAPABILITY_TARGET_TYPES = Object.freeze([
  'Document', 'Page', 'Layer', 'Object', 'Path',
  'ReferenceImage', 'INK_OUTPUT_HANDLE', 'Revision', 'None'
]);

const RESULT_ENVELOPE = 'INK_AGENT_RESULT';
const OUTPUT_HANDLE = 'INK_OUTPUT_HANDLE / 1';

const clone = value => JSON.parse(JSON.stringify(value));
const freeze = value => {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const item of Object.values(value)) freeze(item);
  return value;
};

const str = (description, extra = {}) => ({ type: 'string', description, ...extra });
const num = (description, extra = {}) => ({ type: 'number', description, ...extra });
const bool = (description, extra = {}) => ({ type: 'boolean', description, ...extra });
const arr = (items, description, extra = {}) => ({ type: 'array', items, description, ...extra });
const obj = (properties = {}, required = [], description = '', additionalProperties = false) => ({
  type: 'object',
  properties,
  required,
  additionalProperties,
  description
});

const objectRefSchema = obj({
  pageId: str('Stable page id.'),
  layerId: str('Stable layer id.'),
  objectId: str('Stable object id.')
}, ['pageId', 'layerId', 'objectId'], 'Stable INK object reference.');

const bridgeOptionsSchema = obj({
  selectedObjectIds: arr(str('Selected object id.'), 'Optional selected object ids.', { maxItems: 32 }),
  objectIds: arr(str('Focused object id.'), 'Optional focused object ids.', { maxItems: 512 }),
  revisionId: str('Optional revision id.'),
  limits: obj({
    maxObjects: { type: 'integer', minimum: 1, maximum: 512, default: 96, description: 'Maximum object summaries.' },
    maxRelationships: { type: 'integer', minimum: 1, maximum: 1024, default: 192, description: 'Maximum relationship edges.' },
    maxBytes: { type: 'integer', minimum: 1, maximum: 524288, default: 98304, description: 'Maximum JSON payload bytes.' }
  }, [], 'Document Bridge output limits.')
}, [], 'Grounded Document Bridge options.');

const expectedStateSchema = obj({
  documentId: str('Expected document id.'),
  pageId: str('Expected page id.'),
  revisionId: str('Expected revision id; omit when not constraining revision.'),
  targetFingerprints: { type: 'object', properties: {}, additionalProperties: true, description: 'Optional target fingerprint map.' }
}, [], 'Optional optimistic-concurrency preconditions.');

const targetArraySchema = arr(objectRefSchema, 'Stable edit targets.', { minItems: 1, maxItems: 64 });

const editTaskSchema = (operationSchema, argumentSchema, maxTargets = 64) => obj({
  schema: { type: 'string', const: 'INK-CHAT-EDIT-TASK', default: 'INK-CHAT-EDIT-TASK', description: 'Bounded edit task schema.' },
  version: { type: 'integer', const: 1, default: 1, description: 'Bounded edit task version.' },
  taskId: str('Caller supplied stable task id.'),
  operation: operationSchema,
  targets: { ...targetArraySchema, maxItems: maxTargets },
  arguments: argumentSchema,
  expected: expectedStateSchema
}, ['taskId', 'operation', 'targets', 'arguments'], 'Input accepted by propose_ink_edit / edit.propose.');

const genericEditArguments = { type: 'object', properties: {}, additionalProperties: true, description: 'Operation-specific arguments; inspect the operation descriptor for exact fields.' };

const creativePlanSourceSchema = obj({
  documentId: str('Source document id.'),
  pageId: str('Source page id.'),
  revisionId: { description: 'Source Revision id or null when the document has no captured Revision.' },
  documentFingerprint: str('Exact source document fingerprint.')
}, ['documentId', 'pageId', 'documentFingerprint'], 'Exact Chat Creative Plan source identity.');

const creativePlanStepSchema = obj({
  stepId: str('Stable plan step id.'),
  taskId: str('Optional compatibility task id; the existing plan authority derives its own bounded task identity.'),
  operation: { type: 'string', enum: CHAT_EDIT_OPERATIONS, description: 'Existing bounded-edit operation.' },
  targets: targetArraySchema,
  arguments: genericEditArguments,
  dependsOn: arr(str('Earlier step id dependency.'), 'Earlier step dependencies.', { maxItems: 32 })
}, ['stepId', 'operation', 'targets', 'arguments'], 'One existing bounded-edit step in a Chat Creative Plan.');

const creativePlanSchema = obj({
  schema: { type: 'string', const: 'INK-CHAT-CREATIVE-PLAN', default: 'INK-CHAT-CREATIVE-PLAN', description: 'Existing Chat Creative Plan schema.' },
  version: { type: 'integer', const: 1, default: 1, description: 'Existing Chat Creative Plan version.' },
  planId: str('Optional stable plan id; when omitted the existing authority derives it deterministically.'),
  source: creativePlanSourceSchema,
  intentSummary: str('Bounded human-readable plan intent summary.'),
  steps: arr(creativePlanStepSchema, 'Ordered bounded-edit steps.', { minItems: 2, maxItems: 32 })
}, ['intentSummary', 'steps'], 'Existing INK-CHAT-CREATIVE-PLAN / 1 proposal. Source may be omitted so the existing authority can bind current state.');

const useInkSchema = obj({
  action: { type: 'string', enum: ['inspect', 'propose', 'approve', 'execute', 'cancel'], description: 'Programmable composition action.' },
  plan: creativePlanSchema,
  planId: str('Existing Chat Creative Plan id.'),
  approvalToken: str('Explicit plan approval token returned by the existing plan authority.')
}, ['action'], 'Declarative use_ink request. Action-specific fields are validated by the existing Chat Creative Plan authority.');

const editSchemas = {
  'path.repaint.v1': editTaskSchema(
    { type: 'string', const: 'path.repaint.v1', description: 'Repaint Path appearance.' },
    obj({
      fill: str('Fill paint token.'),
      stroke: str('Stroke paint token.'),
      opacity: num('Opacity.', { minimum: 0, maximum: 1 }),
      expressiveStrokeColor: str('Expressive-stroke color token.')
    }, [], 'At least one of fill, stroke, opacity, or expressiveStrokeColor is required; empty arguments are rejected by the edit authority.'),
    64
  ),
  'path.material.apply.v1': editTaskSchema(
    { type: 'string', const: 'path.material.apply.v1', description: 'Apply material appearance to Path.' },
    obj({
      templateId: str('Material template id.'),
      templateVersion: str('Optional template version.'),
      parameterOverrides: { type: 'object', properties: {}, additionalProperties: true, description: 'Bounded parameter override object.' },
      fallback: obj({ fill: str('Fallback fill.'), stroke: str('Fallback stroke.') }, [], 'Optional fallback appearance.')
    }, ['templateId'], 'Material application arguments.'),
    64
  ),
  'path.material.remove.v1': editTaskSchema(
    { type: 'string', const: 'path.material.remove.v1', description: 'Remove material appearance from Path.' },
    obj({}, [], 'No arguments.', false),
    64
  ),
  'object.translate.v1': editTaskSchema(
    { type: 'string', const: 'object.translate.v1', description: 'Translate editable objects.' },
    obj({ dx: num('World-space X delta.', { minimum: -1000000, maximum: 1000000 }), dy: num('World-space Y delta.', { minimum: -1000000, maximum: 1000000 }) }, ['dx', 'dy'], 'Translation arguments.'),
    64
  ),
  'path.simplify.v1': editTaskSchema(
    { type: 'string', const: 'path.simplify.v1', description: 'Simplify one Path.' },
    obj({
      tolerance: num('Simplification tolerance.', { minimum: 0, maximum: 1000000, default: 0.75 }),
      handleTolerance: num('Handle tolerance.', { minimum: 0, maximum: 1000000 }),
      maxPasses: { type: 'integer', minimum: 1, maximum: 4096, default: 256, description: 'Maximum simplification passes.' }
    }, [], 'Path simplification arguments.'),
    1
  ),
  'path.refine.v1': editTaskSchema(
    { type: 'string', const: 'path.refine.v1', description: 'Refine one Path.' },
    obj({
      maxControlLength: num('Maximum control length; must be greater than zero.', { minimum: Number.EPSILON, maximum: 1000000, default: 48 }),
      maxAddedAnchors: { type: 'integer', minimum: 1, maximum: 4096, default: 128, description: 'Maximum added anchors.' }
    }, [], 'Path refinement arguments.'),
    1
  )
};

function resultContract({
  statuses = ['COMPLETED', 'FAILED'],
  createsRefs = false,
  changesRefs = false,
  returnsOutputHandles = false
} = {}) {
  return {
    resultEnvelope: RESULT_ENVELOPE,
    resultEnvelopeVersion: 1,
    outputHandleSchema: returnsOutputHandles ? OUTPUT_HANDLE : null,
    possibleStatuses: statuses,
    createsRefs,
    changesRefs,
    returnsOutputHandles
  };
}

const policy = (approvalRequired, approvalMode, historyMode, revisionMode, previewRecommended = false, previewRequired = false, previewReason = '') => ({
  approvalPolicy: { required: approvalRequired, mode: approvalMode },
  historyPolicy: { mode: historyMode },
  revisionPolicy: { mode: revisionMode },
  previewPolicy: { recommended: previewRecommended, required: previewRequired, reason: previewReason }
});

function descriptor(def) {
  return freeze({
    schema: INK_CAPABILITY_DESCRIPTOR_SCHEMA,
    version: INK_CAPABILITY_DESCRIPTOR_VERSION,
    availabilityReason: def.availability ? null : 'NOT_IMPLEMENTED_IN_CURRENT_INK_CONNECTOR',
    constraints: [],
    examples: [],
    ...def
  });
}

const primary = [
  descriptor({
    id: 'capabilities.list', title: 'List INK capabilities', description: 'List deterministic capability summaries and named-tool metadata.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'get_ink_capabilities', publicMethod: 'capabilities', role: 'READ',
    authoritativeRoute: 'Ink Public Creative API capability registry',
    inputSchema: obj({}, [], 'No input is required.'),
    targetTypes: ['None'], ...policy(false, 'NONE', 'NONE', 'NONE'),
    resultContract: resultContract(), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'document.context', title: 'Read document context', description: 'Read grounded document/page/layer/object context through the existing AI Document Bridge.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'get_ink_context', publicMethod: 'context', role: 'READ',
    authoritativeRoute: 'buildAIDocumentBridge',
    inputSchema: bridgeOptionsSchema, targetTypes: ['Document', 'Page', 'Layer', 'Object'],
    ...policy(false, 'NONE', 'NONE', 'READ_CURRENT'), resultContract: resultContract(), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'document.selection', title: 'Read selection', description: 'Read the current grounded selection through the existing AI Document Bridge.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'get_ink_selection', publicMethod: 'selection', role: 'READ',
    authoritativeRoute: 'buildAIDocumentBridge + app.selection',
    inputSchema: bridgeOptionsSchema, targetTypes: ['Object'],
    ...policy(false, 'NONE', 'NONE', 'READ_CURRENT'), resultContract: resultContract(), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'document.inspect', title: 'Inspect objects', description: 'Inspect explicit stable object references through the existing AI Document Bridge.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'inspect_ink_objects', publicMethod: 'inspect', role: 'READ',
    authoritativeRoute: 'buildAIDocumentBridge',
    inputSchema: obj({
      refs: arr(objectRefSchema, 'Object refs to inspect.', { minItems: 1, maxItems: 512 }),
      objectIds: arr(str('Object id.'), 'Compatibility object-id list.', { minItems: 1, maxItems: 512 }),
      options: bridgeOptionsSchema
    }, [], 'Use refs or objectIds.'), targetTypes: ['Object'],
    constraints: ['At least one stable object reference or object id is required.'],
    ...policy(false, 'NONE', 'NONE', 'READ_CURRENT'), resultContract: resultContract(),
    examples: [{ refs: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'object-1' }] }], toolPrimary: true
  }),
  descriptor({
    id: 'reference.decompose', title: 'Decompose Reference into Color + Line', description: 'Decompose an existing INK ReferenceImage through the accepted Reference Handoff/extraction authority.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'decompose_ink_reference', publicMethod: 'reference.decompose', role: 'WRITE',
    authoritativeRoute: 'app.chatReferenceHandoff.decomposeReference',
    inputSchema: obj({
      referenceObjectId: str('Existing ReferenceImage object id.'),
      options: obj({
        intent: str('Optional audit intent.'),
        numberOfColors: { type: 'integer', minimum: 2, maximum: 32, default: 8, description: 'Bounded color quantization target.' },
        pathOmit: { type: 'integer', minimum: 0, maximum: 4096, description: 'Existing extraction path omission control.' },
        lineStroke: str('Boundary-line stroke token.', { default: '#202020' }),
        lineStrokeWidth: num('Boundary-line stroke width.', { minimum: 0, maximum: 1000000, default: 1 })
      }, [], 'Reference decomposition options.')
    }, ['referenceObjectId'], 'Reference decomposition request.'),
    targetTypes: ['ReferenceImage'],
    constraints: ['Uses existing ImageTracerJS-backed extraction authority.', 'Retains the source ReferenceImage.'],
    ...policy(false, 'DIRECT_NAMED_TOOL', 'AUTHORITATIVE_COMMIT', 'NO_AUTO_CAPTURE', true, false, 'Preview is recommended after decomposition for visual verification.'),
    resultContract: resultContract({ createsRefs: true, changesRefs: true }), examples: [{ referenceObjectId: 'reference-1', options: { numberOfColors: 8 } }], toolPrimary: true
  }),
  descriptor({
    id: 'edit.propose', title: 'Propose bounded edit', description: 'Create a bounded edit proposal. This does not execute the edit.',
    availability: true, routingClass: 'PROPOSAL_REQUIRED', namedTool: 'propose_ink_edit', publicMethod: 'edit.propose', role: 'PROPOSAL',
    authoritativeRoute: 'app.chatBoundedEditAdapter.propose',
    inputSchema: editTaskSchema({ type: 'string', enum: CHAT_EDIT_OPERATIONS, description: 'Accepted bounded operation.' }, genericEditArguments, 64),
    targetTypes: ['Object', 'Path'],
    constraints: ['Proposal only; no mutation occurs until approval and execute.', 'Operation-specific descriptors define exact target and argument constraints.'],
    ...policy(false, 'PROPOSE_ONLY', 'NONE', 'NONE', true, false, 'Preview may be useful before approval.'),
    resultContract: resultContract({ statuses: ['PROPOSED', 'FAILED'] }),
    examples: [{ taskId: 'task-1', operation: 'path.repaint.v1', targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }], arguments: { fill: '#ffffff' } }], toolPrimary: true
  }),
  descriptor({
    id: 'edit.approve', title: 'Approve bounded edit', description: 'Approve an existing bounded edit proposal and obtain/confirm the approval token.',
    availability: true, routingClass: 'PROPOSAL_REQUIRED', namedTool: 'approve_ink_edit', publicMethod: 'edit.approve', role: 'PROPOSAL',
    authoritativeRoute: 'app.chatBoundedEditAdapter.approve',
    inputSchema: obj({ proposalId: str('Proposal id.') }, ['proposalId'], 'Proposal approval request.'),
    targetTypes: ['None'], constraints: ['Approval does not itself execute the edit.'],
    ...policy(true, 'EXPLICIT_PROPOSAL_APPROVAL', 'NONE', 'NONE'),
    resultContract: resultContract({ statuses: ['APPROVED', 'FAILED'] }), examples: [{ proposalId: 'proposal:task-1:abcd1234' }], toolPrimary: true
  }),
  descriptor({
    id: 'edit.execute', title: 'Execute approved bounded edit', description: 'Execute an already approved bounded edit through the existing bounded-edit authority.',
    availability: true, routingClass: 'PROPOSAL_REQUIRED', namedTool: 'execute_ink_edit', publicMethod: 'edit.execute', role: 'WRITE',
    authoritativeRoute: 'app.chatBoundedEditAdapter.execute',
    inputSchema: obj({ proposalId: str('Approved proposal id.'), approvalToken: str('Approval token returned by the accepted authority.') }, ['proposalId', 'approvalToken'], 'Approved proposal execution request.'),
    targetTypes: ['Object', 'Path'], constraints: ['Requires prior proposal approval.', 'No automatic Revision capture.'],
    ...policy(true, 'APPROVED_PROPOSAL_REQUIRED', 'AUTHORITATIVE_COMMIT', 'NO_AUTO_CAPTURE', true, false, 'Preview is recommended after execution.'),
    resultContract: resultContract({ statuses: ['EXECUTED', 'FAILED'], changesRefs: true }), examples: [{ proposalId: 'proposal:task-1:abcd1234', approvalToken: 'approval-token' }], toolPrimary: true
  }),
  descriptor({
    id: 'history.inspect', title: 'Inspect History', description: 'Read existing History state without mutation.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'get_ink_history', publicMethod: 'history.inspect', role: 'READ',
    authoritativeRoute: 'app.history', inputSchema: obj({}, [], 'No input is required.'), targetTypes: ['None'],
    ...policy(false, 'NONE', 'READ_EXISTING', 'NONE'), resultContract: resultContract(), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'history.undo', title: 'Undo', description: 'Move the authoritative History stack one step backward.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'undo_ink', publicMethod: 'history.undo', role: 'WRITE',
    authoritativeRoute: 'app.history.undo', inputSchema: obj({}, [], 'No input is required.'), targetTypes: ['None'],
    ...policy(false, 'DIRECT_NAMED_TOOL', 'MOVE_EXISTING_STACK', 'NO_AUTO_CAPTURE'), resultContract: resultContract({ statuses: ['COMPLETED', 'NO_OP', 'FAILED'], changesRefs: true }), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'history.redo', title: 'Redo', description: 'Move the authoritative History stack one step forward.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'redo_ink', publicMethod: 'history.redo', role: 'WRITE',
    authoritativeRoute: 'app.history.redo', inputSchema: obj({}, [], 'No input is required.'), targetTypes: ['None'],
    ...policy(false, 'DIRECT_NAMED_TOOL', 'MOVE_EXISTING_STACK', 'NO_AUTO_CAPTURE'), resultContract: resultContract({ statuses: ['COMPLETED', 'NO_OP', 'FAILED'], changesRefs: true }), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'revision.list', title: 'List Revisions', description: 'List existing Revisions for a document.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'get_ink_revisions', publicMethod: 'revision.list', role: 'READ',
    authoritativeRoute: 'app.revisions.list', inputSchema: obj({ documentId: str('Document id; defaults to the current document.') }, [], 'Revision list request.'), targetTypes: ['Document', 'Revision'],
    ...policy(false, 'NONE', 'NONE', 'READ_EXISTING'), resultContract: resultContract(), examples: [{}], toolPrimary: true
  }),
  descriptor({
    id: 'revision.capture', title: 'Capture Revision', description: 'Explicitly capture a Revision through the existing Revision authority.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'capture_ink_revision', publicMethod: 'revision.capture', role: 'WRITE',
    authoritativeRoute: 'app.revisions.capture',
    inputSchema: obj({ reason: str('Revision reason.'), label: str('Human-readable label.') }, [], 'Revision capture options passed directly to revision.capture; the Named Tool also accepts this direct shape.'),
    targetTypes: ['Document'], constraints: ['Requires an idle History boundary.'],
    ...policy(false, 'DIRECT_NAMED_TOOL', 'REQUIRE_IDLE', 'EXPLICIT_CAPTURE'), resultContract: resultContract({ statuses: ['COMPLETED', 'NO_OP', 'FAILED'] }), examples: [{ reason: 'chat-checkpoint', label: 'CHAT checkpoint' }], toolPrimary: true
  }),
  descriptor({
    id: 'revision.restore', title: 'Restore Revision', description: 'Explicitly restore an existing Revision through the existing Revision authority.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'restore_ink_revision', publicMethod: 'revision.restore', role: 'WRITE',
    authoritativeRoute: 'app.revisions.restore',
    inputSchema: obj({ revisionId: str('Revision id.'), options: { type: 'object', properties: {}, additionalProperties: true, description: 'Existing restore options.' } }, ['revisionId'], 'Revision restore request.'),
    targetTypes: ['Revision'], constraints: ['Restores document state and resets History to the Revision boundary.'],
    ...policy(false, 'DIRECT_NAMED_TOOL', 'RESET_TO_REVISION', 'EXPLICIT_RESTORE'), resultContract: resultContract({ changesRefs: true }), examples: [{ revisionId: 'revision-1' }], toolPrimary: true
  }),
  descriptor({
    id: 'preview.capture', title: 'Capture Preview', description: 'Render a bounded PNG preview through the existing Renderer and return an ephemeral output handle.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'get_ink_preview', publicMethod: 'preview.capture', role: 'READ',
    authoritativeRoute: 'app.renderExportCanvas + existing Renderer',
    inputSchema: obj({
      scope: { type: 'string', enum: ['artboard', 'viewport', 'content'], default: 'artboard', description: 'Preview scope.' },
      maxDimension: { type: 'integer', minimum: 1, maximum: 1600, default: 1200, description: 'Maximum output dimension.' },
      scale: num('Viewport/content scale; must be greater than zero.', { minimum: Number.EPSILON }),
      ppi: num('Artboard PPI; must be greater than zero.', { minimum: Number.EPSILON }),
      background: bool('Include existing page background.', { default: true }),
      refs: arr(objectRefSchema, 'Optional semantic object bindings.', { maxItems: 512 })
    }, [], 'Preview request.'),
    targetTypes: ['Document', 'Page', 'Object'],
    constraints: ['Object refs are semantic bindings only and never define crop authority.', 'Preview is bounded to 1600 px per dimension and 2,560,000 pixels.'],
    ...policy(false, 'NONE', 'NONE', 'READ_CURRENT'), resultContract: resultContract({ returnsOutputHandles: true }), examples: [{ scope: 'artboard', maxDimension: 1200 }], toolPrimary: true
  }),
  descriptor({
    id: 'asset.inspect', title: 'Inspect output handle', description: 'Inspect an ephemeral INK_OUTPUT_HANDLE and exact-state staleness.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'inspect_ink_output', publicMethod: 'asset.inspect', role: 'READ',
    authoritativeRoute: 'Connector ephemeral INK_OUTPUT_HANDLE registry + documentFingerprint',
    inputSchema: obj({ handleId: str('INK output handle id.') }, ['handleId'], 'Output-handle inspection request.'),
    targetTypes: ['INK_OUTPUT_HANDLE'], ...policy(false, 'NONE', 'NONE', 'READ_CURRENT'), resultContract: resultContract({ returnsOutputHandles: true }), examples: [{ handleId: 'ink-output-v1:example' }], toolPrimary: true
  }),
  descriptor({
    id: 'asset.release', title: 'Release output handle payload', description: 'Release only the ephemeral payload associated with an INK_OUTPUT_HANDLE.',
    availability: true, routingClass: 'NAMED_TOOL', namedTool: 'release_ink_output', publicMethod: 'asset.release', role: 'WRITE',
    authoritativeRoute: 'Connector ephemeral INK_OUTPUT_HANDLE registry',
    inputSchema: obj({ handleId: str('INK output handle id.') }, ['handleId'], 'Output-handle release request.'),
    targetTypes: ['INK_OUTPUT_HANDLE'], constraints: ['Does not mutate Document, History, or Revision.'],
    ...policy(false, 'DIRECT_NAMED_TOOL', 'NONE', 'NONE'), resultContract: resultContract({ statuses: ['COMPLETED', 'NO_OP', 'FAILED'], returnsOutputHandles: true }), examples: [{ handleId: 'ink-output-v1:example' }], toolPrimary: true
  }),
  descriptor({
    id: 'capability.describe', title: 'Describe INK capability', description: 'Return the full canonical INK_CAPABILITY_DESCRIPTOR v1 for a capability id or registered named tool.',
    availability: true, routingClass: 'READ_ONLY', namedTool: 'describe_ink_capability', publicMethod: 'capability.describe', role: 'READ',
    authoritativeRoute: 'Ink canonical capability registry',
    inputSchema: obj({ idOrToolName: str('Capability id or registered named tool name.') }, ['idOrToolName'], 'Capability description request.'),
    targetTypes: ['None'], ...policy(false, 'NONE', 'NONE', 'NONE'), resultContract: resultContract(),
    examples: [{ idOrToolName: 'preview.capture' }], toolPrimary: true
  }),
  descriptor({
    id: 'composition.programmable', title: 'Programmable native composition', description: 'Declarative CHAT-native plan bridge over the existing Chat Creative Plan and bounded-edit authorities.',
    availability: true, routingClass: 'PROPOSAL_REQUIRED', namedTool: 'use_ink', publicMethod: 'composition.propose', role: 'PROPOSAL',
    authoritativeRoute: 'app.inkPublicApi.composition.* → app.chatCreativePlan → existing bounded-edit authority → History → Revision',
    inputSchema: useInkSchema,
    targetTypes: ['Document', 'Page', 'Object', 'Path'],
    constraints: [
      'Declarative plan actions only; arbitrary JavaScript, arbitrary method dispatch, callbacks, and direct Document JSON writes are prohibited.',
      'propose is Document/History/Revision mutation-neutral and does not approve or execute.',
      'execute requires the explicit approval token issued by the existing Chat Creative Plan authority.',
      'Every plan step remains subject to the existing bounded-edit allowlist and state validation.',
      'History and partial/final Revision behavior are inherited from the existing Chat Creative Plan authority.',
      'Visual verification remains a separate get_ink_preview action; use_ink does not auto-capture Preview.'
    ],
    ...policy(true, 'PLAN_PROPOSE_THEN_EXPLICIT_APPROVAL_BEFORE_EXECUTE', 'EXISTING_CHAT_CREATIVE_PLAN', 'EXISTING_PARTIAL_OR_FINAL_CAPTURE', true, false, 'Call get_ink_preview separately when visual verification is needed.'),
    resultContract: resultContract({ statuses: ['PROPOSED', 'APPROVED', 'COMPLETED', 'STOPPED', 'REJECTED', 'FAILED'], changesRefs: true }),
    examples: [{
      action: 'propose',
      plan: {
        schema: 'INK-CHAT-CREATIVE-PLAN',
        version: 1,
        intentSummary: 'Repaint one path and then translate another object.',
        steps: [
          { stepId: 'repaint', operation: 'path.repaint.v1', targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }], arguments: { fill: '#ffffff' }, dependsOn: [] },
          { stepId: 'move', operation: 'object.translate.v1', targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'object-2' }], arguments: { dx: 8, dy: 0 }, dependsOn: ['repaint'] }
        ]
      }
    }],
    toolPrimary: true
  })
];

// Append only: the accepted Connector-004 19-tool registry remains the exact prefix.
primary.push(descriptor({
  id: 'reference.import', title: 'Import Reference', description: 'Import a browser-local File/Blob through the existing CHAT Reference Handoff authority.',
  availability: true, routingClass: 'NAMED_TOOL', namedTool: 'import_ink_reference', publicMethod: 'reference.import', role: 'WRITE',
  authoritativeRoute: 'app.chatReferenceHandoff.importReference',
  inputSchema: obj({
    input: { description: 'Browser-local File or Blob, or the existing normalizeChatAttachment {file} / {blob, name, type} handoff. This is a local binary input, not JSON-encoded bytes or a remote URL.' },
    options: obj({
      name: str('Explicit file name required for a bare Blob.'),
      type: str('MIME type; defaults to the supplied binary MIME type.'),
      mimeType: str('Existing MIME type alias.'),
      lastModified: num('Optional file modification time.'),
      intent: str('Optional audit intent.'),
      actor: obj({ type: str('Actor type.'), id: str('Actor id.'), channel: str('Actor channel.') }, [], 'Existing handoff actor metadata.'),
      matrix: arr(num('Affine matrix coefficient.'), 'Optional existing Reference placement matrix.', { minItems: 6, maxItems: 6 })
    }, [], 'Existing Reference Handoff options; passed unchanged to the authority.')
  }, ['input'], 'Named Tool canonical request: {input, options?}. Public method: reference.import(input, options?).'),
  targetTypes: ['ReferenceImage'],
  constraints: [
    'Browser-local File/Blob handoff only; normalization, decoding, import, History and provenance use existing authorities.',
    'Raw File/Blob payloads never appear in the JSON-safe public result.',
    'No remote URL fetch or external transport; no automatic Revision capture.',
    'The example input is symbolic: replace <browser-local File> with the actual File/Blob object; passing the placeholder string is rejected.'
  ],
  ...policy(false, 'DIRECT_NAMED_TOOL', 'AUTHORITATIVE_COMMIT', 'NO_AUTO_CAPTURE', true, false, 'Preview is recommended after import or decomposition.'),
  resultContract: resultContract({ statuses: ['COMPLETED', 'COMMITTED_WITH_ERROR', 'FAILED'], createsRefs: true, changesRefs: true }),
  examples: [{ input: '<browser-local File>', options: { name: 'reference.png', type: 'image/png' } }], toolPrimary: true
}));

const operationDescriptors = CHAT_EDIT_OPERATIONS.map(operation => {
  const pathOnly = operation.startsWith('path.');
  const operationConstraints = pathOnly
    ? ['Targets must resolve to editable visible unlocked Path objects.']
    : ['Targets must resolve to editable visible unlocked objects.'];
  if (operation === 'path.repaint.v1') {
    operationConstraints.push('arguments must contain at least one of fill, stroke, opacity, or expressiveStrokeColor; empty arguments are rejected with ARGUMENTS_EMPTY.');
  }
  if (operation === 'object.translate.v1') {
    operationConstraints.push('dx and dy may each be zero, but they must not both be zero; {dx:0,dy:0} is rejected as NO_OP.');
  }
  return descriptor({
    id: operation,
    title: operation,
    description: 'Operation-specific bounded edit descriptor for ' + operation + '.',
    availability: true,
    routingClass: 'PROPOSAL_REQUIRED',
    namedTool: 'propose_ink_edit',
    publicMethod: 'edit.propose',
    role: 'PROPOSAL',
    authoritativeRoute: 'app.chatBoundedEditAdapter.propose → explicit approval → app.chatBoundedEditAdapter.execute',
    inputSchema: editSchemas[operation],
    targetTypes: pathOnly ? ['Path'] : ['Object'],
    constraints: operationConstraints,
    ...policy(true, 'PROPOSE_THEN_EXPLICIT_APPROVAL_BEFORE_EXECUTE', 'AUTHORITATIVE_COMMIT_ON_EXECUTE_ONLY', 'NO_AUTO_CAPTURE', true, false, 'Preview is recommended after execution.'),
    resultContract: resultContract({ statuses: ['PROPOSED', 'FAILED'] }),
    examples: operation === 'object.translate.v1'
      ? [{ taskId: 'translate-1', operation, targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'object-1' }], arguments: { dx: 10, dy: 5 } }]
      : operation === 'path.repaint.v1'
        ? [{ taskId: 'repaint-1', operation, targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }], arguments: { fill: '#ffffff' } }]
        : operation === 'path.material.apply.v1'
          ? [{ taskId: 'material-1', operation, targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }], arguments: { templateId: 'material-template' } }]
          : operation === 'path.material.remove.v1'
            ? [{ taskId: 'material-remove-1', operation, targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }], arguments: {} }]
            : [{ taskId: operation + '-1', operation, targets: [{ pageId: 'page-1', layerId: 'layer-1', objectId: 'path-1' }], arguments: {} }],
    toolPrimary: false
  });
});

const unavailable = [
  descriptor({
    id: 'external.transport', title: 'External connector transport', description: 'Future external transport capability; not implemented by Connector-003.',
    availability: false, availabilityReason: 'EXTERNAL_TRANSPORT_NOT_IMPLEMENTED', routingClass: 'UNAVAILABLE', namedTool: null, publicMethod: null, role: 'UNAVAILABLE',
    authoritativeRoute: 'UNAVAILABLE', inputSchema: obj({}, [], 'Unavailable capability.'), targetTypes: ['None'],
    constraints: ['Discovery only. External plugin transport is unavailable.'],
    ...policy(false, 'UNAVAILABLE', 'NONE', 'NONE'), resultContract: resultContract({ statuses: ['FAILED'] }), examples: [], toolPrimary: false
  })
];

const DESCRIPTORS = freeze([...primary, ...operationDescriptors, ...unavailable]);
const BY_ID = new Map(DESCRIPTORS.map(item => [item.id, item]));
const BY_TOOL = new Map(primary.filter(item => item.toolPrimary && item.namedTool).map(item => [item.namedTool, item]));

if (BY_ID.size !== DESCRIPTORS.length) throw new Error('INK_CAPABILITY_ID_DUPLICATE');
if (BY_TOOL.size !== primary.filter(item => item.toolPrimary && item.namedTool).length) throw new Error('INK_NAMED_TOOL_DUPLICATE');

export function getInkCapabilityDescriptors() {
  return clone(DESCRIPTORS);
}

export function getInkCapabilitySummaries() {
  return DESCRIPTORS.map(item => clone({
    id: item.id,
    title: item.title,
    availability: item.availability,
    availabilityReason: item.availabilityReason,
    routingClass: item.routingClass,
    namedTool: item.namedTool,
    publicMethod: item.publicMethod,
    role: item.role,
    descriptorSchema: item.schema,
    descriptorVersion: item.version
  }));
}

export function getInkNamedToolDefinitions() {
  return primary
    .filter(item => item.toolPrimary && item.namedTool)
    .map(item => clone({
      name: item.namedTool,
      publicMethod: item.publicMethod,
      role: item.role,
      authoritativeRoute: item.authoritativeRoute,
      approvalRequired: Boolean(item.approvalPolicy?.required),
      historyExpectation: item.historyPolicy?.mode || 'NONE',
      revisionExpectation: item.revisionPolicy?.mode || 'NONE',
      availability: Boolean(item.availability),
      routingClass: item.routingClass,
      resultEnvelope: item.resultContract?.resultEnvelope || RESULT_ENVELOPE,
      capabilityId: item.id,
      descriptorVersion: item.version
    }));
}

export function resolveInkCapabilityDescriptor(idOrToolName) {
  const key = String(idOrToolName || '').trim();
  if (!key) return null;
  const found = BY_ID.get(key) || BY_TOOL.get(key) || null;
  return found ? clone(found) : null;
}
