# INK-CHAT-CONNECTOR-003 — Capability / Schema Discovery Evidence v0.1

STATUS: `DEV_SOURCE_STATIC_ISOLATED_QA_PASS / HANDOFF_READY`

## Scope

Implemented the authorized Connector-003 self-describing capability layer only:

- canonical `INK_CAPABILITY_DESCRIPTOR / 1` registry;
- deterministic capability summaries;
- full descriptor lookup by canonical capability ID;
- descriptor lookup by registered Named Tool;
- bounded JSON-Schema-like input metadata;
- stable target-type vocabulary;
- explicit approval / History / Revision / preview policies;
- explicit `INK_AGENT_RESULT / 1` result contract metadata;
- unavailable future capability discovery without false executability;
- Named Tool #18: `describe_ink_capability`.

No execution authority was added. Existing Document Bridge, Reference Handoff, bounded edit, History, Revision, Renderer/export, preview and output-handle authorities remain the execution sources.

## Branch / checkpoints

```text
TASK = INK-CHAT-CONNECTOR-003
BRANCH = work/ink-chat-connector-003
BRANCH_BASE = 652bdb76ef16cac84512b6d57eec1bbbae54580e
TARGET_GATE = INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS

CAPABILITY_REGISTRY_COMMIT = 0093c5a651704251adae58ae29d51aff68507f1f
PUBLIC_API_WIRING_COMMIT = dd8f558d01021182de8dea96676b2f7f79a9e5e0
AGENT_EXPORT_COMMIT = 0ad72f07985450c2742ea8170a0f998d67f44e7a
REGISTRY_BOUNDARY_CLEANUP_COMMIT = e6f55eba838c255e5f53016a26ed41ea481586db
CONNECTOR_001_COMPAT_QA_COMMIT = e7453c72ccec695c9333149ba814cf81d54ac845
CONNECTOR_002_COMPAT_QA_COMMIT = a153ecc23e9280b4177e3ce1157ffb9a8c45add1
CONNECTOR_003_QA_COMMIT = c977f9298f6d58c86787938e8aa761333260f727

FORMAT_VERSION = 4 / PRESERVED
```

## Product implementation

Changed product files:

- `product/source/src/agent/capability-registry.js` — new canonical descriptor and Named Tool metadata authority;
- `product/source/src/agent/public-creative-api.js` — capability list/describe wiring only;
- `product/source/src/agent/index.js` — exports discovery schema/registry helpers.

No changes were made to:

- Document Bridge;
- Reference Handoff;
- bounded edit engine;
- History;
- Revision;
- Renderer/export;
- `visual-feedback.js`;
- `output-handle-registry.js`;
- UI;
- Service Worker/bootstrap/cache;
- document schema / FORMAT_VERSION.

## Descriptor contract

```text
SCHEMA = INK_CAPABILITY_DESCRIPTOR
VERSION = 1
DESCRIPTOR_COUNT = 26
NAMED_TOOL_COUNT = 18
```

Every descriptor includes:

```text
schema
version
id
title
description
availability
availabilityReason
routingClass
namedTool
publicMethod
role
inputSchema
targetTypes[]
constraints[]
approvalPolicy
historyPolicy
revisionPolicy
previewPolicy
resultContract
examples[]
```

Capability list results contain compact summaries only; full input schemas remain behind `capability.describe`.

Accepted input-schema keyword subset:

```text
type
properties
required
items
enum
const
minimum
maximum
minItems
maxItems
additionalProperties
description
default
```

Accepted target vocabulary:

```text
Document
Page
Layer
Object
Path
ReferenceImage
INK_OUTPUT_HANDLE
Revision
None
```

## Named Tool compatibility

The exact Connector-002 17-tool prefix is preserved.

Appended only:

```text
18. describe_ink_capability
    → capability.describe
```

The canonical registry derives Named Tool metadata, capability summaries and full descriptors from one metadata source.

Operation-specific edit descriptors continue to route through:

```text
propose_ink_edit
→ explicit approval
→ execute_ink_edit
→ existing bounded edit authority
```

No discovery result automatically executes an operation.

## Discovery behavior

Accepted:

```text
capability.describe("preview.capture")
capability.describe("get_ink_preview")
describe_ink_capability({ idOrToolName: "get_ink_preview" })
```

All resolve to the same canonical Descriptor v1.

Unknown capability/tool input returns:

```text
status = FAILED
diagnostic.code = INK_CAPABILITY_NOT_FOUND
diagnostic.details.field = idOrToolName
```

Unavailable future capabilities remain discoverable but unavailable:

```text
composition.programmable
  availability = false
  availabilityReason = CONNECTOR_004_NOT_IMPLEMENTED

external.transport
  availability = false
  availabilityReason = EXTERNAL_TRANSPORT_NOT_IMPLEMENTED
```

## Focused QA evidence

New focused QA:

- `qa/ink-chat-connector-003-capability-schema-discovery.test.mjs`

Compatibility QA adjusted only for the authorized additive discovery tool:

- `qa/ink-chat-connector-001-agent-foundation.test.mjs`;
- `qa/ink-chat-connector-002-visual-asset-feedback.test.mjs`.

Committed-source checks performed in the available DEV environment:

```text
CAPABILITY_REGISTRY_ISOLATED_EXECUTION = PASS
PUBLIC_API_DISCOVERY_ISOLATED_EXECUTION = PASS
PRODUCT_SOURCE_SYNTAX_PARSE = PASS
CONNECTOR_001_QA_SYNTAX_PARSE = PASS
CONNECTOR_002_QA_SYNTAX_PARSE = PASS
CONNECTOR_003_QA_SYNTAX_PARSE = PASS

DESCRIPTOR_SCHEMA_VERSION = PASS
DESCRIPTOR_ID_UNIQUENESS = PASS
CAPABILITY_LIST_DETERMINISM = PASS
CAPABILITY_LIST_NO_FULL_SCHEMAS = PASS
NAMED_TOOL_PREFIX_17 = PASS
NAMED_TOOL_TOTAL_18 = PASS
NAMED_TOOL_MAPPING = PASS
PUBLIC_METHOD_MAPPING = PASS
DESCRIBE_BY_CAPABILITY_ID = PASS
DESCRIBE_BY_NAMED_TOOL = PASS
UNKNOWN_DIAGNOSTIC = PASS
UNAVAILABLE_FUTURES = PASS
EDIT_APPROVAL_BOUNDARY_METADATA = PASS
PREVIEW_OUTPUT_HANDLE_CONTRACT = PASS
FORMAT_VERSION_4 = PRESERVED
```

Isolated committed-source execution result:

```text
namedToolCount = 18
capabilitySummaryCount = 26
descriptorSchema = INK_CAPABILITY_DESCRIPTOR
descriptorVersion = 1
unknownDiagnostic = INK_CAPABILITY_NOT_FOUND
```

## Regression preservation by exact unchanged authority blobs

```text
DOCUMENT_BRIDGE =
  product/source/src/ai/document-bridge.js
  f55262329ea4d792bf55c5fb04e3e342301fddfd

REFERENCE_HANDOFF =
  product/source/src/ai/chat-reference-handoff.js
  7e63499c914670ce6176011d1d88a92c1d472bae

BOUNDED_EDIT =
  product/source/src/editor/chat-bounded-edit.js
  a0051d60d016d1875a881708e249590b9fe207e3

HISTORY =
  product/source/src/history/history.js
  a1c3cefe60b9923d030bcead1d8565b134aebd21

REVISION =
  product/source/src/document/revision.js
  18028bb15866ff07c87d81073a63a3265ff6839e

PREVIEW =
  product/source/src/agent/visual-feedback.js
  66aa44d3d19d679466cc6e71f1b224f994982ffe

OUTPUT_HANDLE_REGISTRY =
  product/source/src/agent/output-handle-registry.js
  4d1877d49dae0798ef74788a2fea90090fc65310

FORMAT_CONFIG =
  product/source/src/config.js
  5d5b9791166427f2c46786fd8b33c49b11ea2ff9

INK_APP_RENDERER =
  product/source/src/ink.js
  b9eabc748e4a357d67febacadc3cacd2be6067ce
```

Unchanged regression-test blobs:

```text
DOCUMENT_BRIDGE_QA = 0bc6fa97a47203c6d6a7937406c99bd9af137074
HISTORY_QA = b55fdbfa1628a9973c9cd9fe785b35247b1742c3
REVISION_QA = a5e59229f4c93ab3eb5ae40afcd1f18e83212d57
CHAT_PHASE_B_QA = bfb9f62074ebdee159670e635184e2525668beff
```

## Execution limits / claims

The current DEV tool environment does not provide a runnable checkout shell for the GitHub branch, and no authorized workflow-dispatch action is exposed here.

Therefore:

```text
FULL_REPOSITORY_NODE_TEST = NOT_EXECUTED / NOT_CLAIMED
CONNECTOR_BROWSER_RUNTIME = NOT_EXECUTED / MR exact-HEAD stage
```

No Runtime or full-repository Node PASS is claimed.

## Hard boundaries preserved

```text
USE_INK = 0
ARBITRARY_EXECUTION = 0
EXTERNAL_TRANSPORT = 0
AUTO_EXECUTION_FROM_DISCOVERY = 0
GENERIC_JSON_SCHEMA_ENGINE = 0
SECOND_EXECUTION_AUTHORITY = 0
DOCUMENT_MUTATION = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
RENDERER_CHANGE = 0
OUTPUT_HANDLE_CONTRACT_CHANGE = 0
UI_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVED
```

Gate: `DEV_HANDOFF → STOP → MR exact-HEAD source review`.
