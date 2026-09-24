# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-001 / MR_PASS / PROMOTION_NOT_YET_EXECUTED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-001` |
| PHASE | `PUBLIC_API_NAMED_TOOLS_RESULT_ENVELOPE` |
| TITLE | `Figma / Penpot / Adobe-informed INK Agent Connector Foundation` |
| DEV_BRANCH | `work/ink-chat-connector-001` |
| RESEARCH_BASELINE | `research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md` |
| PREVIOUS_CHAT_GATE | `INK-CHAT-VALIDATION-001 Phase C = MR_SOURCE_PASS / HOLD_BY_USER` |
| TARGET_GATE | `INK_AGENT_CONNECTOR_FOUNDATION_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |
| UI_LANE | `SEPARATE / DO NOT MUTATE UI WORK ORDER` |

## User direction

The user requested that the connector design be expanded from Figma/Penpot to include the installed Adobe for ChatGPT workflow, then that CHAT ↔ INK capabilities be replanned and re-issued for development.

Research baseline now includes:

```text
Figma
= generic programmable native-object access

Penpot
= generic execute-code / Plugin API access

Adobe
= capability routing
  + specialized tools
  + stable asset/result handles
  + before/after model preview
  + targeted selection/mask workflow
  + template/library reuse
```

Drawing validation remains paused:

```text
PHASE_C_RUNTIME = HOLD
PHASE_D_TO_F = HOLD / NOT_AUTHORIZED
```

## Revised target architecture

```text
USER / CHAT intent
        ↓
future INK Skill / Capability Router
        ↓
 ┌─────────────────────────────┐
 │ Layer A — Named INK Tools   │  Adobe pattern
 └─────────────────────────────┘
        ↓ when sufficient

 OR

 ┌─────────────────────────────┐
 │ Layer B — future use_ink    │  Figma / Penpot pattern
 └─────────────────────────────┘
        ↓
INK Public Creative API
        ↓
existing INK authorities only
        ↓
Document / Reference / Path
History / Revision / Grounding
```

This Work Order builds the common foundation under both future layers.

It does **not** build external MCP/plugin transport, arbitrary `use_ink` execution, screenshot transport, or new drawing behavior.

---

## A — Public Creative API facade

Install exactly one JSON-safe facade on the existing `InkApp`.

Recommended module:

```text
product/source/src/agent/
  index.js
  public-creative-api.js
```

Recommended install surface:

```text
app.inkPublicApi
```

The facade must delegate to existing authorities and must never return a live mutable reference into `app.doc`.

### Required read families

```text
capabilities()
context(options)
selection()
inspect(refs / objectIds)
```

Authority:

- existing `buildAIDocumentBridge`;
- stable Page / Layer / Object IDs;
- existing selection state.

---

## B — Adobe-style Named Tool foundation

Within the same facade, expose a deterministic named-tool registry.

Do **not** create a second engine or second global tool router.

Required logical tool names:

```text
get_ink_capabilities
get_ink_context
get_ink_selection
inspect_ink_objects

decompose_ink_reference

propose_ink_edit
approve_ink_edit
execute_ink_edit

get_ink_history
undo_ink
redo_ink

get_ink_revisions
capture_ink_revision
restore_ink_revision
```

Implementation may expose them as a registry/map or `tools` family under `app.inkPublicApi`.

Each named tool must declare:

- tool name;
- read / proposal / write role;
- authoritative INK route;
- approval requirement;
- History expectation;
- Revision expectation;
- availability;
- result-envelope behavior.

The named tool is only a wrapper over the Public Creative API method.

---

## C — Reference decomposition connection

Named/public operation:

```text
reference.decompose(referenceObjectId, options)
decompose_ink_reference
```

Authority:

`app.chatReferenceHandoff.decomposeReference`

Preserve unchanged:

- accepted ImageTracerJS bounded trace;
- Reference → editable Color + boundary Line;
- separate layer identities;
- generated stable object IDs;
- History receipt;
- Revision behavior;
- audit/provenance.

Do not use Adobe `image_vectorize` inside INK and do not rewrite Phase B.

Adobe is a workflow reference, not the decomposition authority.

---

## D — Bounded edit connection

Public methods:

```text
edit.inspect()
edit.propose(task)
edit.approve(proposalId)
edit.execute(proposalId, approvalToken)
```

Named tools:

```text
propose_ink_edit
approve_ink_edit
execute_ink_edit
```

Authority:

`app.chatBoundedEditAdapter`

Existing operation registry remains authoritative:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

No named tool may bypass proposal/approval by directly mutating Document/Path state.

---

## E — History connection

Public methods / named tools:

```text
history.inspect()   / get_ink_history
history.undo()      / undo_ink
history.redo()      / redo_ink
```

Authority:

`app.history`

No second stack.

---

## F — Revision connection

Public methods / named tools:

```text
revision.current()
revision.list()       / get_ink_revisions
revision.capture()    / capture_ink_revision
revision.restore()    / restore_ink_revision
```

Authority:

`app.revisions`

No automatic Revision after every operation.

---

## G — Normalized INK agent result envelope

Borrow Adobe's mature structured-result pattern.

All public/named tool results must be normalized into one JSON-safe envelope while retaining the original underlying receipt.

Target schema:

```text
INK_AGENT_RESULT
{
  schema
  version
  action
  status

  documentId
  pageId
  revisionId

  targetRefs[]
  createdRefs[]
  changedRefs[]

  historyReceipt
  revisionReceipt
  provenanceReceipt

  outputHandles[]
  diagnostics[]

  result
}
```

Requirements:

- deterministic field ordering where serialized for tests;
- JSON-safe only;
- no Blob/Canvas/DOM/live object references;
- no live mutable Document reference;
- preserve useful underlying receipt under `result`;
- empty/unsupported fields use bounded null/empty forms rather than fabricated values.

Preview fields such as `previewHandle`, `renderFingerprint`, bounds and mime type are reserved for Connector-002 and are not produced in this Work Order.

---

## H — Capability routing metadata

The registry must let a later INK Skill choose:

```text
named tool first
→ if not sufficient, future use_ink
```

Each capability should identify a routing class:

```text
NAMED_TOOL
PROGRAMMABLE_FUTURE
READ_ONLY
PROPOSAL_REQUIRED
UNAVAILABLE
```

Examples:

```text
Reference decomposition
= NAMED_TOOL

Path repaint
= PROPOSAL_REQUIRED
  via propose_ink_edit → approve → execute

complex multi-object scripted composition
= PROGRAMMABLE_FUTURE
  future use_ink
```

---

## I — Installation boundary

Required product order:

```text
existing InkApp
→ installExtraction
→ installChatReferenceHandoff
→ installPathEditing / Repaint
→ installRevision
→ installChatBoundedEdit
→ installInkPublicCreativeApi
```

Exact ordering may differ where dependencies prove otherwise, but the Public API must install only after every authority it delegates to is available.

Do not expose a new unrestricted `window` API in Connector-001.

---

## Required QA

Focused tests must cover at minimum:

1. capability registry deterministic and JSON-safe;
2. named-tool registry deterministic and one-to-one with existing Public API methods;
3. routing metadata correctly distinguishes named/proposal/future-programmable operations;
4. `INK_AGENT_RESULT` schema is deterministic and JSON-safe;
5. returned values cannot mutate `app.doc`;
6. context/selection/inspect delegate to grounded Document Bridge;
7. `decompose_ink_reference` delegates to existing Reference Handoff;
8. bounded edit still requires existing proposal → approval → execute authority;
9. direct execution without valid approval remains rejected;
10. History named tools delegate to the existing HistoryManager;
11. Revision named tools delegate to the existing RevisionController;
12. no second History / Revision / Geometry / decomposition engine;
13. no `eval`, `Function`, arbitrary execution or direct JSON write path;
14. `FORMAT_VERSION = 4`;
15. Web / Portable use the same shared source.

Required regressions:

- Phase B Reference → Color + Line focused QA PASS;
- accepted CHAT bounded-edit core QA PASS;
- document/history/revision core QA PASS.

---

## Explicit non-goals

Do not implement:

- `use_ink` / arbitrary programmable execution;
- `eval`, `Function`, arbitrary JS sandbox;
- MCP server or ChatGPT plugin packaging;
- WebSocket/postMessage external transport;
- `get_ink_preview` or screenshot/image transport;
- external asset upload transport;
- Adobe/Figma/Penpot adapters;
- Adobe `image_vectorize` inside INK;
- new trace/decomposition behavior;
- new drawing/edit operation;
- new design-token engine;
- Creative Library Search;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- Document schema / FORMAT_VERSION changes;
- automatic approval;
- automatic Revision capture.

If required:

`STOP → MR → next Connector Work Order`

---

## Revised next sequence — planning only

```text
Connector-002
= Visual Feedback
  get_ink_preview
  + metadata / bounds / render fingerprint

Connector-003
= use_ink programmable execution bridge

Connector-004
= INK Skill / Capability Router
  Figma + Penpot + Adobe workflow grammar

Connector-005
= Creative Library Search
  components / materials / recipes / structures / templates

Connector-006
= full Reference → Color + Line → CHAT
  → preview → correction → History / Revision closed loop
```

The deliberate change is:

```text
Preview BEFORE general use_ink
+
Named tools become first-class
```

---

## MR final disposition

```text
REVIEW_HEAD = d95d8f80fb57920d8bba2f07557d084a11305ecd
SOURCE_REVIEW = PASS
EXACT_SHA_RUNTIME = PASS
RUNTIME_RUN = 35951192558
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
FINAL_GATE = INK_AGENT_CONNECTOR_FOUNDATION_WORKS
MR = PASS
PROMOTION = NOT_YET_EXECUTED
CONNECTOR_002 = NOT_AUTHORIZED
```

## Gate

```text
DEV_AUTHORIZED
→ implementation + focused QA
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ regression review
→ MR_PASS / MR_REVISE
```

Browser Runtime is not automatically required for Connector-001 unless DEV changes browser integration beyond installing the facade. MR decides after exact-HEAD review.

Acceptance:

`INK_AGENT_CONNECTOR_FOUNDATION_WORKS`
