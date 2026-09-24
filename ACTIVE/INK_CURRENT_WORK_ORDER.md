# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-003 / CLOSED / MR_PASS / PROMOTED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-003` |
| PHASE | `SELF_DESCRIBING_CAPABILITY_REGISTRY` |
| TITLE | `Capability / Schema Discovery — CHAT Self-Describing INK` |
| DEV_BRANCH | `work/ink-chat-connector-003` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-002 / MR_PASS / promoted / closed` |
| CONNECTOR_002_INTEGRATION_SHA | `c728266fa2ec65c2fd53852ae32fd368b9a7d832` |
| CONNECTOR_002_RUNTIME_RUN | `35957389410 / PASS` |
| TARGET_GATE | `INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |

## User direction

The project now follows:

```text
CHAT-FIRST TOOL DEVELOPMENT

before teaching CHAT a bespoke workflow:
→ expose what the tool can do
→ expose how each capability is invoked
→ expose constraints/policies/result contracts
→ let CHAT discover newly added capabilities at Runtime
```

Connector-003 implements the OpenArt-style lesson:

```text
capability list
→ capability describe
→ input schema
→ constraints / target compatibility
→ policy metadata
→ result contract
```

It does not execute arbitrary native code.

---

## A — Preserve Connector-001 / Connector-002

Must preserve unchanged behavior for:

```text
app.inkPublicApi
INK_AGENT_RESULT v1
INK_OUTPUT_HANDLE v1
17 existing Named Tools
preview.capture
asset.inspect
asset.release
```

No second facade.

No rewrite of:

- Document Bridge;
- Reference Handoff;
- bounded edit authority;
- History;
- Revision;
- Renderer/export;
- output-handle payload registry.

---

## B — Capability Descriptor v1

Introduce one machine-readable descriptor schema:

```text
INK_CAPABILITY_DESCRIPTOR
version = 1
```

Every registered capability must expose a deterministic JSON-safe descriptor.

Required fields:

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

### Policy objects

Use explicit machine-readable objects, not prose-only strings.

Minimum policy shape:

```text
approvalPolicy {
  required
  mode
}

historyPolicy {
  mode
}

revisionPolicy {
  mode
}

previewPolicy {
  recommended
  required
  reason
}
```

Existing Connector-001 metadata may be retained as compatibility fields where useful, but Descriptor v1 is the authoritative self-description surface.

### Availability

Unavailable/future capabilities remain discoverable.

Examples:

```text
composition.programmable
external.transport
```

They must return:

- `availability = false`;
- stable `availabilityReason`;
- no false claim that CHAT can execute them.

---

## C — Input schema contract

`inputSchema` must use a bounded JSON-Schema-like subset.

Allowed keywords:

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

Do not implement a general JSON Schema engine.

The schema describes the actual public/named-tool input contract.

It must not invent unsupported parameters.

### Required coverage

At minimum provide correct schemas for:

```text
document.context
document.selection
document.inspect

reference.decompose

path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1

history.undo
history.redo

revision.capture
revision.restore

preview.capture
asset.inspect
asset.release

composition.programmable
external.transport
```

For edit operations, the descriptor may describe the task payload expected by `propose_ink_edit`, but must make the approval/execution boundary explicit.

---

## D — Target compatibility

Descriptor v1 must tell CHAT what kinds of targets a capability can accept.

Use stable product terms, for example:

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

Do not infer semantic content such as flower/petal/person unless an accepted authority already provides it.

For capability-specific restrictions, use `constraints[]`.

Examples:

```text
Path repaint:
  targetTypes = ["Path"]

Reference decomposition:
  targetTypes = ["ReferenceImage"]

Preview:
  targetTypes = ["Document", "Page", "Object"]
  object refs are semantic binding only; not crop authority

History undo:
  targetTypes = ["None"]
```

---

## E — Discovery Public API

Preserve:

```text
capabilities()
get_ink_capabilities
```

Upgrade the returned capability summaries so CHAT can discover:

- capability ID;
- title;
- availability;
- routing class;
- named tool;
- public method;
- descriptor version.

Do not place every full input schema into the list result.

Add:

```text
capability.describe(idOrToolName)
```

Required Named Tool:

```text
describe_ink_capability
```

Expected Named Tool count:

```text
17 existing
+ 1 Connector-003
= 18
```

`capability.describe` must accept:

- canonical capability ID, e.g. `preview.capture`;
- registered named tool, e.g. `get_ink_preview`.

Both must resolve to the same canonical Descriptor v1.

Unknown IDs/tool names return deterministic FAILED result with a stable diagnostic code.

---

## F — Single metadata authority

Connector-003 must reduce metadata drift.

Preferred design:

```text
capability-registry.js
  canonical capability definitions
  ↓
capability list summaries
capability.describe
named-tool discovery metadata
```

Do not create separate independently maintained copies of:

- capability ID;
- routing class;
- availability;
- named-tool mapping;
- public method;
- policy metadata.

Existing tool handler functions remain in Public Creative API.

The registry describes and routes to accepted handlers; it does not become a second execution engine.

---

## G — Named Tool compatibility

All existing 17 Named Tools must remain in exact order and preserve existing public method mappings.

Append only:

```text
18. describe_ink_capability
```

Connector-003 must not rename:

- `get_ink_capabilities`;
- `get_ink_preview`;
- `inspect_ink_output`;
- `release_ink_output`;
- any Connector-001 tool.

---

## H — Result contract description

Descriptor v1 `resultContract` describes the expected public result.

At minimum:

```text
resultEnvelope = INK_AGENT_RESULT
resultEnvelopeVersion = 1
outputHandleSchema = INK_OUTPUT_HANDLE / 1 when applicable
possibleStatuses[]
createsRefs
changesRefs
returnsOutputHandles
```

This is descriptive metadata only.

Do not introduce a second result-envelope implementation.

---

## I — Examples

Each executable/available capability should contain at least one small JSON-safe example input.

Rules:

- examples are illustrative input objects only;
- no user-private data;
- no binary;
- no huge geometry;
- no promise that an unavailable capability works;
- examples must conform to the declared schema.

Keep examples small enough for capability discovery responses.

---

## J — Suggested source shape

Preferred:

```text
product/source/src/agent/
  index.js
  public-creative-api.js
  capability-registry.js
  output-handle-registry.js
  visual-feedback.js
```

Exact split may vary.

Do not add a global/window capability object.

---

## K — Required QA

Focused QA must cover at minimum:

1. existing 17 Named Tools remain exact ordered prefix;
2. total Named Tools = 18;
3. `describe_ink_capability` appended exactly once;
4. capability list order deterministic;
5. repeated capability list JSON identical;
6. every capability ID unique;
7. every mapped named tool unique where one-to-one is expected;
8. every available named-tool capability maps to a real Public API method;
9. Descriptor schema/version correct;
10. descriptors JSON-safe;
11. no live mutable refs;
12. describe by capability ID works;
13. describe by Named Tool resolves same canonical descriptor;
14. unknown capability returns deterministic FAILED diagnostic;
15. input schemas use only the allowed bounded keyword subset;
16. every declared required field exists in properties;
17. available capability example inputs satisfy the bounded schema checks used by QA;
18. targetTypes use the accepted vocabulary;
19. unavailable future capabilities remain unavailable;
20. edit capability descriptors expose proposal/approval boundary correctly;
21. preview descriptor states semantic refs do not define crop;
22. preview/result descriptor references `INK_OUTPUT_HANDLE v1`;
23. History policies match existing authority behavior;
24. Revision policies match existing authority behavior;
25. Connector-001 focused QA remains PASS;
26. Connector-002 focused QA remains PASS;
27. FORMAT_VERSION = 4;
28. no `use_ink`, eval/Function, MCP/external transport, new execution engine;
29. Web / Portable share the same source.

Required regressions:

- Connector-001 focused QA;
- Connector-002 focused QA;
- Document Bridge;
- bounded edit;
- History;
- Revision;
- preview/output-handle focused checks.

---

## L — Explicit non-goals

Do not implement:

- `use_ink`;
- arbitrary JS / eval / Function;
- generic JSON Schema validator engine;
- external MCP/plugin transport;
- external asset upload/download;
- Creative Session;
- Recipe registry;
- saved Workflow graph;
- Creative Library Search;
- Design Critic / Fix;
- new design/drawing operations;
- new target semantics;
- new Renderer/export path;
- preview crop expansion;
- automatic tool execution based on discovery;
- automatic approval;
- automatic Revision;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- Document schema / FORMAT_VERSION change.

If required:

`STOP → MR → separate next Work Order`

---

## M — Planned next sequence — not authorized

```text
Connector-004
= use_ink programmable native composition

Connector-005
= INK Skill / Capability Router

Connector-006
= Creative Library + Recipe foundation

Connector-007
= Creative Session / reusable Workflow

Connector-008
= Design Critic / Fix

Final
= full creative closed loop
```

---

## MR source review revision — 2026-09-24

```text
REVIEW_HEAD = 5c531dba2c87ee0762c3f21d54845effafe33164
SOURCE_ARCHITECTURE = PASS
AUTHORITY_BOUNDARIES = PASS
CANONICAL_REGISTRY_DIRECTION = PASS
NAMED_TOOL_PREFIX_17 = PASS
NAMED_TOOL_TOTAL_18 = PASS

MR = REVISE
RUNTIME = NOT_QUEUED

BLOCKER_CLASS =
  SELF_DESCRIPTION_CONTRACT_MISMATCH
```

The execution authorities are not rejected. The revision is limited to making Descriptor v1 truthful enough for CHAT to rely on.

### Blocker A — schema-valid values rejected by accepted authorities

Current Descriptor v1 permits values that the real authority rejects.

Confirmed examples:

```text
path.refine.v1
descriptor:
  maxControlLength.minimum = 0
authority:
  maxControlLength > 0
  (Number.EPSILON minimum)

preview.capture
descriptor:
  scale = number / no positive minimum
  ppi   = number / no positive minimum
authority:
  scale > 0
  ppi > 0

object.translate.v1
descriptor:
  dx = 0, dy = 0 passes declared schema
authority:
  dx = 0 AND dy = 0 → NO_OP rejection

path.repaint.v1
descriptor schema:
  arguments {} is structurally allowed
authority:
  empty arguments → ARGUMENTS_EMPTY
```

The bounded schema subset does not need a general JSON Schema engine. Where the allowed keyword subset cannot express a cross-field rule, the capability descriptor must state the exact restriction in `constraints[]` and QA must verify it.

Review all operation/preview descriptors for the same class of mismatch, not only the four examples above.

### Blocker B — inputSchema surface ambiguity

Several descriptors expose both:

```text
namedTool
publicMethod
inputSchema
```

but the declared object-shaped `inputSchema` matches the Named Tool wrapper while the referenced Public API method still uses positional/direct arguments.

Examples include:

```text
document.inspect
reference.decompose
edit.approve
edit.execute
revision.list
revision.capture
revision.restore
asset.inspect
asset.release
capability.describe
```

Concrete failure mode:

```text
revision.capture descriptor
→ schema suggests { options: { reason, label } }

publicMethod = revision.capture

api.revision.capture({ options: { reason, label } })
→ existing RevisionController receives the wrapper object
→ reason/label are not the intended top-level capture options
```

Connector-003 must establish one canonical invocation contract.

Preferred bounded fix:

```text
Descriptor inputSchema = canonical object input
Named Tool accepts canonical object input
Public API method also accepts that same object input
existing positional/direct forms may remain as backward-compatible overloads
```

Alternative designs are acceptable only if Descriptor v1 explicitly distinguishes the two invocation surfaces without ambiguity.

Do not change any underlying execution authority.

### Required revision QA

Add focused checks for:

1. Descriptor-valid positive boundary values accepted by the corresponding input normalizers;
2. `maxControlLength = 0` is not advertised as valid;
3. preview `scale <= 0` and `ppi <= 0` are not advertised as valid;
4. translate `dx=0,dy=0` restriction is explicit;
5. repaint empty-arguments restriction is explicit;
6. descriptor canonical input shape is accepted by both Named Tool and declared Public API route, or the descriptor explicitly distinguishes the surfaces;
7. existing 17-tool prefix and Connector-002 behavior remain unchanged;
8. no execution authority, Renderer, History, Revision, output-handle contract, UI, or FORMAT_VERSION change.

### Scope boundary

```text
CAPABILITY_REGISTRY / PUBLIC_API ADAPTER METADATA FIX ONLY
USE_INK = 0
EXTERNAL_TRANSPORT = 0
NEW_EXECUTION_ENGINE = 0
RENDERER_CHANGE = 0
OUTPUT_HANDLE_CONTRACT_CHANGE = 0
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
UI_CHANGE = 0
FORMAT_VERSION = 4
```

After the bounded revision:

`DEV_HANDOFF → STOP → MR exact-HEAD re-review`

## Promotion closure — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-003
PROMOTION_COMMIT = 96f8c553e87fd53b5ca0d2b01cc2972902f2fd69
TESTED_DEV_HEAD = a873c4324225b8c760d83bdcc100cc3427dd3bee
RUNTIME_RUN = 35961649436
RUNTIME_TESTED_SHA = a873c4324225b8c760d83bdcc100cc3427dd3bee

PROMOTION_EQUIVALENCE =
  capability-registry.js = EXACT_BLOB
  public-creative-api.js = EXACT_BLOB
  agent/index.js = EXACT_BLOB
  Connector-001 QA = EXACT_BLOB
  Connector-002 QA = EXACT_BLOB
  Connector-003 QA = EXACT_BLOB

FINAL_GATE = INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS
MR = PASS
PROMOTION = COMPLETE
TASK = CLOSED

CONNECTOR_004 = NOT_AUTHORIZED
```

## MR final PASS — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-003
REVIEW_HEAD = a873c4324225b8c760d83bdcc100cc3427dd3bee

SOURCE_REVIEW = PASS
BOUNDED_FIX_REVIEW = PASS
EXACT_SHA_RUNTIME = PASS

RUNTIME_RUN = 35961649436
RUNTIME_TESTED_SHA = a873c4324225b8c760d83bdcc100cc3427dd3bee
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
RUNTIME_ARTIFACT_ID = 10792144512

CAPABILITY_DESCRIPTOR_V1 = PASS
CANONICAL_CAPABILITY_REGISTRY = PASS
CAPABILITY_DESCRIBE = PASS
NAMED_TOOLS = 18 / PASS
CONNECTOR_002_PREFIX_17 = PRESERVED
SCHEMA_TRUTHFULNESS = PASS
PUBLIC_INPUT_COMPATIBILITY = PASS
AUTHORITY_BOUNDARIES = PASS
FORMAT_VERSION = 4 / PRESERVED

FINAL_GATE = INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS
MR = PASS
PROMOTION = NOT_YET_EXECUTED
CONNECTOR_004 = NOT_AUTHORIZED
```

## MR bounded-fix re-review — 2026-09-24

```text
REVIEW_HEAD = a873c4324225b8c760d83bdcc100cc3427dd3bee
PREVIOUS_REVIEW_HEAD = 5c531dba2c87ee0762c3f21d54845effafe33164

BOUNDED_FIX_SCOPE = PASS
SCHEMA_TRUTHFULNESS = PASS
CANONICAL_INPUT_SHAPE = PASS
PUBLIC_API_COMPAT_ADAPTERS = PASS
NAMED_TOOL_PREFIX_17 = PASS
NAMED_TOOL_TOTAL_18 = PASS
AUTHORITY_BOUNDARIES = PASS
FORMAT_VERSION = 4 / PRESERVED

SOURCE_REVIEW = PASS
RUNTIME = QUEUED / exact branch SHA
FINAL_MR_PASS = PENDING_RUNTIME
```

Accepted corrections:

- `path.refine.v1.maxControlLength` now advertises strictly positive minimum matching authority;
- Preview `scale` and `ppi` now advertise strictly positive minima;
- translate zero-vector rejection is explicit in `constraints[]`;
- repaint empty-arguments rejection is explicit in `constraints[]`;
- `revision.capture` descriptor now uses the direct canonical options shape;
- object-shaped descriptor input is accepted directly by the declared Public API routes for inspect/reference/approve/execute/revision/asset/describe while legacy forms remain compatible.

No Document Bridge, bounded-edit execution, History, Revision, Renderer, Preview, Output Handle, UI, or FORMAT_VERSION authority changed.

## Gate

```text
DEV_AUTHORIZED
→ implementation
→ focused QA + required regressions
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ integration/runtime decision
→ MR_PASS / MR_REVISE
```

Acceptance:

`INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS`
