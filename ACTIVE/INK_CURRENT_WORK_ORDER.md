# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-014 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-014` |
| TITLE | `Creative Workspace Minimum UX v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-014` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_WORKSPACE_UX_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED_EXCEPT_EXECUTABLE_LOCAL_HARNESS` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-013 is promoted with gate:

`INTEGRATED_CREATIVE_LOOP_VALIDATED`

Accepted technical chain:

```text
Reference
→ Extract
→ editable Path
→ Path Editing
→ Expressive Stroke
→ Multi-Contour Composition
→ Repaint / Material
→ CHAT Review + Structured Edit Tasks
→ Revision
```

Hard-benchmark baseline:

```text
HARD_BENCHMARK = EXECUTED
EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE
STRUCTURE_AWARE = CANDIDATE_REQUIRES_OVERLAY_QA
```

## Objective

Turn the accepted engine chain into one minimally usable creative workspace without broad UI redesign.

The user must be able to move through the existing creative loop from a coherent workspace while preserving existing document/editor authorities.

This task is UX integration, not a new drawing engine and not an agent-planning task.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md`
8. existing workspace/UI/editor shell source as required
9. accepted reports for INK-CLOUD-007 through 013 only as needed

## Product principle

Expose the existing engine; do not duplicate it.

The workspace should make these three properties visible and usable:

```text
STATE VISIBILITY
+
WORKFLOW CONTINUITY
+
CHAT ↔ CANVAS ↔ REVISION LOOP
```

## Scope

Required:

- create one minimal workspace path through the accepted creative loop;
- expose reference/extraction context and overlay entry points already supported by the accepted extraction workspace;
- expose selected object / Path identity and provenance where useful;
- expose Path edit mode and appearance distinction without introducing a second editor;
- expose composition and repaint/material entry points through existing commands/controllers;
- expose CHAT state/proposal/approve/reject/execute through the accepted bounded-edit controller;
- expose current Revision identity and capture/restore affordances through the accepted Revision controller;
- provide deterministic stage/state diagnostics;
- maintain coherent selection across stage transitions where existing contracts permit;
- preserve History/Revision semantics;
- preserve static-hosted/browser-local operation;
- bounded CSS/layout/component work needed for this workspace is allowed.

The UX may be compact and developer-oriented in v0.1. It does not need final visual polish.

## Phases

### Phase A — workspace state model and shell

Define a minimal workspace view/state model over existing runtime state.

Required visible context:

- current document/page;
- active stage or tool context;
- current selection/object ID/type;
- source/provenance summary where available;
- current Revision ID;
- pending CHAT proposal state.

Do not create a second document/workflow state authority.

### Phase B — Reference → Extract → Path continuity

Wire the accepted Reference/Extract/overlay/Path flow into the workspace.

Required:

- reference intake/selection entry;
- extraction trigger through existing extraction authority;
- overlay/review entry;
- accepted editable Path handoff;
- deterministic error/status display.

No new extraction pipeline family.

### Phase C — Edit → Compose → Repaint continuity

Expose existing:

- anchor/handle/local Path edit entry;
- expressive-stroke controls or minimal affordance;
- composition/transform organization;
- repaint/material controls.

The workspace must call existing controllers/commands rather than mutate document structures directly.

### Phase D — CHAT ↔ canvas bounded edit loop

Expose:

```text
inspect current state
→ proposal
→ user approve/reject
→ execute
→ visible result
```

Required:

- proposal target/operation summary;
- approval remains explicit;
- stale target/Revision failures are visible;
- no autonomous multi-step planner;
- no conversation platform.

### Phase E — Revision capture / restore UX

Expose:

- current Revision identity;
- capture checkpoint;
- bounded before/after metadata summary;
- restore/reopen;
- explicit History reset/boundary behavior in diagnostics.

Failed restore must remain atomic.

### Phase F — integrated workspace regression + report

Exercise one deterministic UI/workspace integration path across all exposed stages.

Create:

`research/INK_CREATIVE_WORKSPACE_MINIMUM_UX_REPORT_v0.1.md`

Return:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
MINIMUM_WORKSPACE = IMPLEMENTED
STATE_VISIBILITY = IMPLEMENTED
REFERENCE_EXTRACT_PATH_UI = CONNECTED
PATH_EDIT_UI = CONNECTED
COMPOSE_REPAINT_UI = CONNECTED
CHAT_APPROVAL_LOOP_UI = CONNECTED
REVISION_CAPTURE_RESTORE_UI = CONNECTED
EXISTING_CONTROLLERS = REUSED
STRUCTURED_DOCUMENT = PRESERVED
HISTORY_REVISION_BOUNDARY = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`CREATIVE_WORKSPACE_MINIMUM_UX_WORKS`

## Explicit exclusions

Do not implement:

- broad UI redesign or final visual system;
- multi-step CHAT creative reasoning / autonomous agent planner;
- comments/presence/multiplayer;
- mandatory backend/auth/sync;
- generic project dashboard;
- plugin marketplace;
- Portable INK packaging;
- Structure-Aware Reconstruction redesign;
- second document/vector/History/Revision/renderer engine;
- FORMAT_VERSION bump.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. existing core/controller contracts must be broken rather than reused/bounded-fixed;
3. a second workflow/document/editor authority becomes necessary;
4. remote service becomes mandatory for the core workspace;
5. scope expands into multi-step agent planning or broad Cloud platform work;
6. package/release mutation becomes necessary.

## QA

GitHub Actions quota remains exhausted.

Run all feasible source/static/unit/workspace integration checks.

Do not claim browser/runtime paths that were not executed.

`RUNTIME_QA = DEFERRED`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-014
BRANCH = work/ink-cloud-014
GATE = CREATIVE_WORKSPACE_MINIMUM_UX_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
