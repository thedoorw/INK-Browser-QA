# INK REVIEW STATUS

STATUS: `INK-CHAT-CONNECTOR-003 / CLOSED / MR_PASS / PROMOTED`

## Connector-003 promotion closure — 2026-09-24

```text
PROMOTION_COMMIT = 96f8c553e87fd53b5ca0d2b01cc2972902f2fd69
TESTED_HEAD = a873c4324225b8c760d83bdcc100cc3427dd3bee
PROMOTED_PRODUCT_AND_QA_BLOBS = EXACT_MATCH
RUNTIME = 35961649436 / PASS
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS

TASK = CLOSED
CONNECTOR_004 = NOT_AUTHORIZED
```

## Connector-003 final MR PASS — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-003
REVIEW_HEAD = a873c4324225b8c760d83bdcc100cc3427dd3bee
SOURCE_REVIEW = PASS
SCHEMA_CONTRACT = PASS
EXACT_SHA_RUNTIME = PASS

RUN = 35961649436
TESTED_SHA = a873c4324225b8c760d83bdcc100cc3427dd3bee
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
ARTIFACT_ID = 10792144512

MR = PASS
PROMOTION = NOT_YET_EXECUTED
CONNECTOR_004 = NOT_AUTHORIZED
```

## Connector-003 bounded-fix re-review — 2026-09-24

```text
REVIEW_HEAD = a873c4324225b8c760d83bdcc100cc3427dd3bee
SOURCE_ARCHITECTURE = PASS
SCHEMA_CONTRACT = PASS
PUBLIC_INPUT_COMPATIBILITY = PASS
SCOPE = PASS
AUTHORITY_REUSE = PASS

FINAL_SOURCE_GATE = PASS
RUNTIME = QUEUED
FINAL_MR_PASS = PENDING_RUNTIME
```

The previous MR blockers are resolved without expanding execution authority.

## Connector-003 MR source review — 2026-09-24

```text
REVIEW_HEAD = 5c531dba2c87ee0762c3f21d54845effafe33164
SOURCE_ARCHITECTURE = PASS
SCOPE = PASS
AUTHORITY_REUSE = PASS
DESCRIPTOR_REGISTRY = STRUCTURALLY_PASS
NAMED_TOOL_18 = PASS

FINAL_SOURCE_GATE = REVISE
RUNTIME = HELD
```

Blocking findings:

- Descriptor ranges currently advertise some values the accepted authority rejects:
  - `path.refine.v1.maxControlLength = 0`;
  - `preview.capture.scale <= 0`;
  - `preview.capture.ppi <= 0`;
  - `object.translate.v1 dx=0,dy=0`;
  - `path.repaint.v1 arguments={}`.
- `inputSchema` currently mixes Named Tool envelope shape with positional/direct Public API method signatures. Descriptor v1 therefore does not yet provide one unambiguous callable contract.

No change is requested to Document Bridge, Reference Handoff, bounded edit execution, History, Revision, Renderer/export, Preview, Output Handle, UI, or FORMAT_VERSION.

Runtime is not queued until this metadata/input-contract correction passes source review.

## Connector-003 review target — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-003
PHASE = SELF_DESCRIBING_CAPABILITY_REGISTRY
BRANCH = work/ink-chat-connector-003
TARGET_GATE = INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS

ACCEPTED_UPSTREAM =
  Connector-001 CLOSED / MR_PASS / promoted
  Connector-002 CLOSED / MR_PASS / promoted

CONNECTOR_003 =
  self-describing capability registry
  + INK_CAPABILITY_DESCRIPTOR v1
  + capability.describe(idOrToolName)
  + describe_ink_capability

NAMED_TOOLS =
  existing 17 exact prefix
  + describe_ink_capability
  = 18

USE_INK = NOT_AUTHORIZED
EXTERNAL_TRANSPORT = NOT_AUTHORIZED
CREATIVE_SESSION = NOT_AUTHORIZED
RECIPE_WORKFLOW = NOT_AUTHORIZED
```

Review focus:

- one canonical metadata registry rather than duplicate capability/tool definitions;
- bounded JSON-Schema-like input schema only;
- descriptor matches actual existing Public API contract;
- targetTypes and constraints do not invent semantics;
- approval/history/revision/preview policy is machine-readable;
- unavailable/future capabilities remain discoverable but unavailable;
- describe by capability ID and Named Tool resolve same canonical descriptor;
- no execution authority changes;
- Connector-001/002 behavior and 17-tool ordered prefix preserved;
- FORMAT_VERSION 4 preserved.

## Connector-002 final MR PASS — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-002
DEV_REVIEW_HEAD = f0ad1547de0fce791878b533662058a754993b5b
INTEGRATION_PROMOTION_COMMIT = c728266fa2ec65c2fd53852ae32fd368b9a7d832

SOURCE_REVIEW = PASS
SCOPE_REVIEW = PASS
FOCUSED_QA_EVIDENCE = PASS
COMBINED_EXACT_SHA_RUNTIME = PASS

RUNTIME_RUN = 35957389410
RUNTIME_TESTED_SHA = c728266fa2ec65c2fd53852ae32fd368b9a7d832
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
RUNTIME_ARTIFACT_ID = 10790747302

GET_INK_PREVIEW = PASS
INK_OUTPUT_HANDLE_V1 = PASS
EPHEMERAL_OUTPUT_REGISTRY = PASS
INSPECT_INK_OUTPUT = PASS
RELEASE_INK_OUTPUT = PASS
NAMED_TOOLS = 17
CONNECTOR_001_PREFIX_14 = PRESERVED
AUTHORITY_BOUNDARIES = PASS
FORMAT_VERSION = 4 / PRESERVED

FINAL_GATE = INK_VISUAL_ASSET_FEEDBACK_WORKS
MR = PASS
PROMOTION = COMPLETE
TASK = CLOSED

CONNECTOR_003 = NOT_AUTHORIZED
```

## Connector-002 MR exact-HEAD checkpoint — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-002
REVIEW_HEAD = f0ad1547de0fce791878b533662058a754993b5b
BRANCH = work/ink-chat-connector-002
SOURCE_REVIEW = PASS
SCOPE_REVIEW = PASS
FOCUSED_QA_EVIDENCE = PASS
FINAL_MR_PASS = PASS

PRODUCT_DIFF =
  product/source/src/agent/output-handle-registry.js
  product/source/src/agent/visual-feedback.js
  product/source/src/agent/public-creative-api.js

UNCHANGED_AUTHORITIES =
  InkApp / Renderer
  Document Bridge
  Reference Handoff
  Bounded Edit
  History
  Revision
  UI
  Service Worker / bootstrap / cache

NAMED_TOOLS = 17 / PASS
CONNECTOR_001_PREFIX_14 = PRESERVED
GET_INK_PREVIEW = PASS
INK_OUTPUT_HANDLE_V1 = PASS
EPHEMERAL_REGISTRY = PASS
ASSET_INSPECT = PASS
ASSET_RELEASE = PASS
DOCUMENT_PAGE_REVISION_FINGERPRINT_BINDING = PASS
RENDER_FINGERPRINT = PASS
RAW_BINARY_PUBLIC_RESULT = 0
SECOND_RENDERER = 0
DOM_SCREENSHOT = 0
PERSISTENT_ASSET_STORAGE = 0
USE_INK = 0
CAPABILITY_DISCOVERY = 0
EXTERNAL_TRANSPORT = 0
FORMAT_VERSION = 4 / PRESERVED
```

MR source findings:

- preview delegates to existing `app.renderExportCanvas(...)`;
- preview is bounded below the existing tiled-export threshold;
- optional refs are grounded through Document Bridge and remain semantic-only;
- `INK_OUTPUT_HANDLE v1` is deterministic/content-addressed and JSON-safe;
- encoded PNG bytes participate in `renderFingerprint`;
- output payload stays in a bounded internal WeakMap-backed ephemeral registry;
- inspect catches document/page/revision/fingerprint drift and unavailable payload;
- release only affects connector-side ephemeral payload;
- no Document / selection / History / Revision mutation is introduced.

Runtime coordination:

```text
UI-006 Phase I exact-SHA runtime run 35954873725 = PASS
UI tested SHA = 5ad4a271b37a1dca9236239be8bb867bff320b7c
UI / Creative / Geometry = PASS

However the UI runtime queue is still owned by UI governance.
Connector-002 must not overwrite that queue.
Connector-002 final exact-SHA combined browser gate waits for UI queue closure / integration promotion.
```

## Connector-002 review target — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-002
PHASE = PREVIEW_OUTPUT_HANDLE_FOUNDATION
BRANCH = work/ink-chat-connector-002
TARGET_GATE = INK_VISUAL_ASSET_FEEDBACK_WORKS

CONNECTOR_001 =
  MR_PASS
  promoted on main
  promotion commit = efd48a429d9998b4871aebf7bd1e47a576d41a95

CONNECTOR_002 =
  get_ink_preview
  + INK_OUTPUT_HANDLE
  + inspect/release output handle
  + exact document/page/revision/fingerprint binding

CONNECTOR_003_CAPABILITY_DISCOVERY = NOT_AUTHORIZED
USE_INK = NOT_AUTHORIZED
EXTERNAL_TRANSPORT = NOT_AUTHORIZED
```

Review focus:

- reuse existing `renderExportCanvas` / Renderer authority;
- no second renderer or DOM screenshot;
- bounded preview dimensions/pixels;
- output handle is JSON-safe and content-addressed;
- raw preview payload remains internal/ephemeral;
- no Blob/Canvas/data URL/ObjectURL in `INK_AGENT_RESULT`;
- handle binds exact Document/Page/Revision/Document fingerprint/render result;
- asset inspect detects stale/evicted/released state;
- preview/asset operations do not mutate Document/History/Revision;
- existing Connector-001 14 tools remain compatible;
- 17 named tools total;
- FORMAT_VERSION 4 preserved.

Runtime coordination:

```text
UI-006 Phase H = separate Runtime FAIL / revision lane
Connector-002 DEV = do not take over UI Runtime queue
Final browser gate = MR decision after DEV handoff and UI/main reconciliation
```

## Connector-001 final MR PASS — 2026-09-24

```text
TASK = INK-CHAT-CONNECTOR-001
REVIEW_HEAD = d95d8f80fb57920d8bba2f07557d084a11305ecd
DEV_HANDOFF_PAYLOAD_END = 6e92d63d332c961987058aaca2982407d834eeb3
POST_HANDOFF_DELTA = README-only MR sync

SOURCE_REVIEW = PASS
SCOPE_REVIEW = PASS
EXACT_SHA_RUNTIME = PASS
RUNTIME_RUN = 35951192558
RUNTIME_TESTED_SHA = d95d8f80fb57920d8bba2f07557d084a11305ecd
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
RUNTIME_ARTIFACT_ID = 10788043896

PUBLIC_CREATIVE_API = PASS
NAMED_TOOL_REGISTRY = PASS / 14 tools
INK_AGENT_RESULT = PASS
AUTHORITY_BOUNDARIES = PASS
FORMAT_VERSION = 4 / PRESERVED

FINAL_GATE = INK_AGENT_CONNECTOR_FOUNDATION_WORKS
MR = PASS
PROMOTION = NOT_YET_EXECUTED
NEXT_CONNECTOR_WORK_ORDER = NOT_AUTHORIZED
```

MR accepts the unchanged historical Node regression baselines together with Connector-001 focused isolated QA and the exact-SHA browser regression because the delegated Document / Reference Handoff / bounded edit / History / Revision authority blobs were unchanged.

## Connector-001 MR exact-HEAD checkpoint — 2026-09-24

```text
REVIEW_HEAD = d95d8f80fb57920d8bba2f07557d084a11305ecd
DEV_HANDOFF_PAYLOAD_END = 6e92d63d332c961987058aaca2982407d834eeb3
POST_HANDOFF_DELTA = README-only MR sync
SOURCE_REVIEW = PASS
SCOPE_REVIEW = PASS
AUTHORITY_REUSE = PASS

PUBLIC_CREATIVE_API = PASS
NAMED_TOOL_REGISTRY = PASS / 14 tools
INK_AGENT_RESULT = PASS
DOCUMENT_SELECTION_INSPECT = PASS
REFERENCE_DECOMPOSITION_DELEGATION = PASS
BOUNDED_EDIT_APPROVAL_BOUNDARY = PASS
HISTORY_DELEGATION = PASS
REVISION_DELEGATION = PASS

SECOND_DOCUMENT_AUTHORITY = 0
SECOND_HISTORY = 0
SECOND_REVISION = 0
SECOND_GEOMETRY = 0
SECOND_DECOMPOSITION = 0
ARBITRARY_EXECUTION = 0
MCP_TRANSPORT = 0
PREVIEW_TRANSPORT = 0
FORMAT_VERSION = 4 / PRESERVED

DEV_FOCUSED_ISOLATED_QA = PASS
FULL_NODE_REGRESSION_RERUN = NOT_EXECUTED
MR_DECISION = exact-SHA browser Runtime required because InkApp constructor install chain changed
FINAL_MR_PASS = PASS
```

MR source findings:

- one `app.inkPublicApi` facade only;
- facade is installed after existing Reference / Revision / bounded-edit authorities;
- named tools are wrappers over the same Public API and do not form a second command authority;
- Reference decomposition still delegates to `app.chatReferenceHandoff.decomposeReference`;
- edit execution still delegates to `app.chatBoundedEditAdapter` and preserves explicit approval;
- History and Revision continue using the existing managers/controllers;
- final diff contains no Service Worker/bootstrap/cache mutation;
- no product-source conflict exists with current main-only UI/runtime-queue changes.

The DEV environment did not execute the full repository Node regression. Existing authority/test blobs are unchanged and focused isolated behavior QA passed, so this is not a source-revision blocker; exact-SHA browser Runtime is required before final acceptance.

## Current connector development

```text
TASK = INK-CHAT-CONNECTOR-001
PHASE = PUBLIC_API_NAMED_TOOLS_RESULT_ENVELOPE
BRANCH = work/ink-chat-connector-001
TARGET_GATE = INK_AGENT_CONNECTOR_FOUNDATION_WORKS
RESEARCH = research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md / Adobe added
```

Review focus:

- one Public Creative API facade only;
- Adobe-style named tools are wrappers, not a second authority;
- normalized INK_AGENT_RESULT is JSON-safe and preserves underlying receipts;
- no live mutable document references;
- reuse Document Bridge / Reference Handoff / Bounded Edit / History / Revision;
- capability routing metadata distinguishes named tools from future use_ink;
- no arbitrary execution bridge yet;
- no preview/screenshot transport yet;
- FORMAT_VERSION 4 preserved.

## Adobe-informed revision

```text
ADOBE_CONNECTOR_REFERENCE = ADDED
PATTERN =
  specialized capability routing
  + target/asset/result handles
  + model-side visual verification
  + template/library reuse

CONNECTOR_001 =
  Public Creative API
  + Named Tool registry
  + INK_AGENT_RESULT envelope

CONNECTOR_002 = visual preview feedback
CONNECTOR_003 = use_ink
```

No Adobe tool becomes an INK product dependency.

## Preserved previous CHAT validation

```text
INK-CHAT-VALIDATION-001 Phase B = CLOSED / PASS
INK-CHAT-VALIDATION-001 Phase C = MR_SOURCE_PASS / HOLD_BY_USER
Phase C Runtime = HOLD
Phase D-F = HOLD / NOT_AUTHORIZED
```

Phase C evidence remains valid historical evidence but is not the active engineering work order.

---

## User hold — drawing validation paused

```text
DRAWING_VALIDATION = PAUSED BY USER
PHASE_C_RUNTIME = DO NOT QUEUE
PRIVATE_REAL_IMAGE_ACCEPTANCE = HOLD
PHASE_D_TO_F = HOLD / NOT_AUTHORIZED
UI_LANE = CONTINUES INDEPENDENTLY
NEW_REVIEW_TARGET = INK CONNECTOR / PUBLIC API ARCHITECTURE
REFERENCE_WORKFLOWS = FIGMA + PENPOT
```

Phase C source PASS is retained; no further drawing-validation execution is authorized until the connector architecture is reviewed.

## Phase C MR source disposition

```text
REVIEWED_DEV_HEAD = cd3b4dee28a7a47e2298569138f5dbd73af5cc14
SOURCE_REVIEW = PASS
PRODUCT_SOURCE_CHANGE = 0
CHANGED_PAYLOAD =
  qa/chat-validation-001-phase-c-bounded-edit.test.mjs
  qa/runtime/ink-cloud-018-browser-harness.html
  research/INK_CHAT_VALIDATION_001_PHASE_C_BOUNDED_EDIT_REPORT_v0.1.md
  working/INK_CHAT_VALIDATION_001_PHASE_C_DEV_HANDOFF.md
  ACTIVE/INK_DEV_PROGRESS.md

MAIN_DIVERGENCE = ahead 6 / behind 1
MAIN_ONLY_DELTA = UI C+D Runtime queue commit
SOURCE_CONFLICT = 0

RUNTIME = PENDING
PRIVATE_REAL_IMAGE_ACCEPTANCE = PENDING
FINAL_MR_PASS = NOT_YET_CLAIMED
```

Source review accepted:
- actual Phase B generated Color/Line IDs feed the Phase C browser path;
- Color uses existing `path.repaint.v1` fill mutation;
- Line uses existing `path.repaint.v1` stroke mutation;
- proposal and approval are non-mutating;
- execution remains approval-token gated;
- History / Undo / Redo remain authoritative;
- stale fingerprint rejection is covered;
- no automatic Revision creation is introduced;
- no Product/Core/Document/History/Revision/Geometry authority changed.

Runtime coordination:
- central Windows Runtime is serialized;
- UI-006 Phase C+D run `35940344586` currently owns the queue/runner;
- Phase C queue target must not replace the active UI target.

---

## Drawing validation hold / connectivity pivot

```text
USER_DIRECTION = PAUSE DRAWING TESTS
PHASE_C_DEV_HEAD = cd3b4dee28a7a47e2298569138f5dbd73af5cc14
PHASE_C_SOURCE_REVIEW = PASS / PRESERVED
PHASE_C_RUNTIME = HOLD
PHASE_C_PRIVATE_IMAGE = HOLD
PHASE_D_TO_F = HOLD

CURRENT_RESEARCH =
  Figma MCP / Plugin API / skills workflow
  Penpot MCP / Plugin API / generic execution workflow
  ChatGPT MCP / plugin connection route
```

No Phase C Runtime should be queued until the user explicitly resumes drawing validation.

---

## Accepted closure

- Service Worker offline source closure is exact.
- Build/cache identity is independent from the visible v0.1 label and worker-owned.
- Bootstrap uses one explicit runtime-ready contract; normal retry polling is removed.
- Production QA surface is opt-in rather than embedded as the permanent production control surface.
- Web / Portable shell maintenance has one authoritative template/generator.
- Accepted light-shell CSS is consolidated without a new late override authority.
- active diagnostics/version metadata is current or explicitly partial.
- no Document / History / Revision / Renderer authority change occurred.

## CHAT Phase B regression

```text
Reference → editable Color + Line → separate layers = PASS
COLOR_REGIONS = 1471
BOUNDARY_LINES = 1471
POST_COMMIT_SELECTION = 1 representative Line Path
CHAT_RECEIPT = COMPLETED
HISTORY = PASS
PROVENANCE = PASS
REVISION = UNCHANGED
```

## Next-state boundary

```text
INK-TECH-DEBT-001 = CLOSED
UI-006 B3 = RESOLVED
UI-006 Phase C+D = DEV_HANDOFF / UR_REVIEW / STOP on UI branch
UI-006 Phase E–I = NOT_STARTED / NOT_AUTHORIZED
CHAT Validation Phase C = DEV_HANDOFF / MR_SOURCE_PASS / HOLD_BY_USER
PARALLEL_MODE = SELECTED / WORK ORDERS REMAIN SEPARATE
automatic next-stage start = NO
```


## Dual-track governance boundary

The user selected UI + drawing/CHAT as the next parallel direction. Parallel direction does not merge authorities or automatically start unauthorized work.

```text
UI = presentation / placement / responsive / interaction shell
CHAT = grounding / reasoning / creative command flow / validation
CORE = frozen unless separately authorized
```

Shared-surface rule:
- UI owns how a control/panel is presented.
- CHAT owns what grounded state/behavior the control represents.
- Shared files do not create shared authority.

Hard STOP → MR → separate Core/Integration Work Order if either lane requires:
- Document/schema change;
- History or Revision semantic change;
- Geometry authority change;
- persistence / FORMAT_VERSION change;
- approval/execution authority change.

Branch rule:
- UI and CHAT remain separate task branches.
- no development-branch-to-development-branch merge;
- each lane passes its own review/runtime gate;
- accepted payloads reconcile against current main;
- final combined regression must cover UI + CHAT + Creative + Geometry and unchanged History/Revision authority.
