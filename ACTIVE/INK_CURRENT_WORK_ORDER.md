# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-001 / PUBLIC_CREATIVE_API / MR_ISSUED / DEV_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-001` |
| PHASE | `PUBLIC_CREATIVE_API_FACADE` |
| TITLE | `Figma/Penpot-compatible INK Public Creative API foundation` |
| DEV_BRANCH | `work/ink-chat-connector-001` |
| BASELINE | `main after connector research + UI lane independent progress` |
| RESEARCH_BASELINE | `research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md` |
| PREVIOUS_CHAT_GATE | `INK-CHAT-VALIDATION-001 Phase C = MR_SOURCE_PASS / HOLD_BY_USER` |
| TARGET_GATE | `INK_PUBLIC_CREATIVE_API_FOUNDATION_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |
| UI_LANE | `SEPARATE / DO NOT MUTATE UI WORK ORDER` |

## User direction

The user requested that the two connector questions and their analysis be preserved, then that CHAT ↔ INK connection points be planned and development begin.

The research record is authoritative for intent:

`research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md`

Drawing validation remains paused:

```text
PHASE_C_RUNTIME = HOLD
PHASE_D_TO_F = HOLD / NOT_AUTHORIZED
```

This Work Order replaces isolated drawing-validation development as the current CHAT engineering priority.

## Purpose

Create one stable public creative API facade over existing INK authorities so future CHAT/MCP/plugin tooling does not need a custom adapter for every operation.

Target architecture:

```text
CHAT / future MCP / future plugin
            ↓
         use_ink
            ↓
   INK Public Creative API
            ↓
 existing INK authorities only
            ↓
 Document / Reference / Path / History / Revision
```

This task builds only the **Public Creative API foundation**.

It does not build `use_ink`, external MCP transport, screenshot transport, asset upload transport, or new drawing behavior.

## Required connection points

### A — Document / selection / object inspection

Expose JSON-safe read-only methods backed by existing grounded state:

```text
capabilities()
context(options)
selection()
inspect(objectIds / refs)
```

Required authority:

- existing `buildAIDocumentBridge` / grounded document state;
- existing stable page/layer/object IDs;
- existing selection state.

Rules:

- do not return live mutable Document/Object references;
- callers must not be able to mutate `app.doc` by changing returned values;
- bounded output rules remain enforced.

### B — Reference decomposition

Expose the existing decomposition path through the facade:

```text
reference.decompose(referenceObjectId, options)
```

Required authority:

`app.chatReferenceHandoff` / existing `CHAT_REFERENCE_DECOMPOSITION`

Preserve:

- current bounded ImageTracerJS behavior;
- current Reference → Color + Line semantics;
- History receipt;
- Revision behavior;
- audit/provenance;
- stable generated IDs.

Do not retune or rewrite Phase B decomposition.

### C — Bounded edit

Expose only the already accepted proposal/approval/execution path:

```text
edit.propose(task)
edit.approve(proposalId)
edit.execute(proposalId, approvalToken)
```

Required authority:

`app.chatBoundedEditAdapter`

Do not add direct convenience writes that bypass proposal/approval.

Existing operation registry remains authoritative:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

### D — History

Expose the existing History authority:

```text
history.inspect()
history.undo()
history.redo()
```

Required authority:

`app.history`

No second history stack or connector-owned undo model.

### E — Revision

Expose existing Revision authority:

```text
revision.list()
revision.capture(options)
revision.restore(revisionId)
revision.current()
```

Required authority:

`app.revisions`

No second revision store and no automatic revision capture after every edit.

## Capability registry

The facade must expose a deterministic JSON-safe capability registry that identifies:

- method/family name;
- read vs write/proposal behavior;
- authoritative INK route;
- whether explicit approval is required;
- whether History is expected;
- whether Revision is expected;
- current availability.

This registry will later drive `get_ink_capabilities` and the INK Skill.

## Installation boundary

Install the facade on the existing `InkApp` instance using a single product module.

Recommended shape:

```text
product/source/src/agent/
  index.js
  public-creative-api.js
```

Recommended app surface:

```text
app.inkPublicApi
```

Naming may be adjusted if repository conventions clearly require it, but there must be one facade and one authority.

Do **not** expose a new unrestricted global API on `window` in this task.
External transport belongs to Connector-002.

## Result contract

Every facade result must be JSON-safe.

Writes/proposals must preserve the underlying authoritative receipt and return enough identity to inspect what happened.

No returned object may be a live mutable reference into the INK document.

## Required QA

Add focused tests covering at minimum:

1. capability registry deterministic and JSON-safe;
2. context/selection/inspect return clones/summaries, not live mutable references;
3. Reference decomposition delegates to the existing reference-handoff authority;
4. bounded edit delegates to existing propose → approve → execute authority;
5. execution without existing approval remains rejected by the underlying authority;
6. History inspect/undo/redo use the existing HistoryManager;
7. Revision list/capture/restore use the existing RevisionController;
8. no direct document JSON mutation path exists in the facade;
9. no second History / Revision / Geometry / decomposition engine;
10. `FORMAT_VERSION = 4`;
11. Web / Portable shared source remains one implementation.

Regression:

- Phase B decomposition focused QA remains PASS;
- accepted CHAT bounded-edit core QA remains PASS;
- current document/history/revision core tests remain PASS.

## Explicit non-goals

Do not implement in this Work Order:

- `use_ink` arbitrary/general code execution;
- `eval`, `Function`, arbitrary JS sandboxing;
- MCP server;
- ChatGPT plugin packaging;
- WebSocket/postMessage bridge;
- screenshot or canvas-image transport;
- asset upload/import transport;
- new trace/decomposition algorithm;
- Figma/Penpot adapters;
- new drawing operation;
- new token/design-system engine;
- new Creative Library;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- Document schema or FORMAT_VERSION changes;
- automatic approval;
- automatic Revision capture.

Any need for these:

`STOP → MR → next Connector Work Order`

## Planned sequence after this task — not authorized by this Work Order

```text
Connector-002
= use_ink execution bridge over the accepted Public Creative API

Connector-003
= get_ink_metadata + get_ink_screenshot feedback channel

Connector-004
= INK Skill / Figma-Penpot-to-INK workflow grammar

Connector-005
= Creative Library Search

Connector-006
= resume full Reference → Color + Line → CHAT closed-loop creative validation
```

## Gate

```text
DEV_AUTHORIZED
→ implementation + focused QA
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ regression
→ MR_PASS / MR_REVISE
```

No Windows browser Runtime is required unless implementation changes browser integration outside the bounded facade installation path. MR decides Runtime necessity after source review.

Acceptance:

`INK_PUBLIC_CREATIVE_API_FOUNDATION_WORKS`
