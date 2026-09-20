# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-011 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-011` |
| TITLE | `CHAT Review + Structured Edit Tasks v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-011` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED` |
| PROMOTION_POLICY | `MR_PASS_AUTO_PROMOTE / NO_USER_PAUSE` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-010 is promoted to main.

Accepted chain:

```text
Reference
→ Extract
→ editable Path
→ Path Editing
→ Expressive Stroke
→ Multi-Contour Composition
→ Repaint / Material
```

This Work Order adds only:

```text
INK document
→ CHAT inspection contract
→ bounded edit proposal
→ approval boundary
→ structured mutation
```

Revision closure is not part of this task.

## Objective

Build the first transport-neutral human-AI editing contract so CHAT can inspect structured INK state, propose bounded edits against stable object references, and—only through an explicit approval/execution boundary—apply supported mutations through existing INK editor/History systems.

The local product must remain functional without a remote service.

Core rule:

```text
CHAT proposes intent.
INK validates and executes authoritative mutations.
Existing editor + History remain authoritative.
```

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_REPAINT_MATERIAL_REPORT_v0.1.md`
8. existing document/hierarchy/selection/History/path-edit/composition/repaint source as required

## Scope

Required:

- deterministic CHAT-facing document-state summary;
- stable object/path references suitable for structured tasks;
- bounded edit-task schema with versioned operation names;
- proposal object separate from execution;
- validation before execution;
- explicit approval token/state or equivalent local approval boundary;
- execution routed through existing editor controllers/History;
- deterministic rejection diagnostics;
- atomic behavior: rejected/failed task leaves no partial mutation;
- support a bounded first set of already-accepted operations, sufficient to prove the loop;
- serialization/export only where needed for the task/proposal contract;
- browser-local/static-hosted execution path;
- transport-neutral adapter boundary for optional future CHAT transport.

Initial supported operation set should reuse existing capabilities rather than invent new editing semantics. Prefer a bounded subset such as:
- repaint Path appearance;
- apply/remove material appearance;
- transform/move supported objects through existing transform route;
- bounded Path edit where an accepted controller already exists.

DEV may narrow the exact initial operation set if required for atomicity and testability, but must prove more than one operation family.

## Phases

### Phase A — CHAT inspection/state-summary contract

Implement deterministic structured summary for the current document/page/selection and relevant editable objects.

Required:
- stable IDs;
- type/parent/visibility/lock state;
- bounded geometry/appearance summaries;
- provenance where already present;
- no full binary/raster dump;
- deterministic ordering.

Checkpoint commit required.

### Phase B — edit-task / proposal schema

Implement versioned structured task contract.

Required fields:
- task/proposal identity;
- target references;
- operation;
- bounded arguments;
- expected preconditions where useful;
- proposal vs approved/executable state;
- deterministic diagnostics.

No arbitrary code/eval.

Checkpoint commit required.

### Phase C — validation + approval boundary

Implement:
- schema validation;
- stale/missing/locked/hidden/singular target rejection using existing rules where applicable;
- operation allowlist;
- explicit local approval/execution boundary;
- no mutation during proposal/preview;
- no History entry for rejected/no-op proposals.

Checkpoint commit required.

### Phase D — structured execution

Route approved tasks through existing authoritative controllers.

Required:
- reuse Path edit/composition/repaint/material/transform/History routes;
- no second mutation engine;
- atomic bounded execution;
- deterministic result object;
- preserve object identity/provenance unless the underlying accepted operation explicitly changes identity.

Checkpoint commit required.

### Phase E — regression evidence

Prove:
- document summary determinism;
- proposal causes zero mutation;
- unapproved proposal cannot execute;
- approved supported task mutates through History;
- invalid/stale/locked target leaves document unchanged;
- undo/redo works through existing History;
- at least two operation families execute;
- static/browser-local path has no required network/backend dependency;
- `FORMAT_VERSION = 4`;
- package untouched.

Checkpoint commit required.

### Phase F — report + DEV handoff

Create:

`research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
CHAT_STATE_SUMMARY = IMPLEMENTED
STRUCTURED_EDIT_TASK_SCHEMA = IMPLEMENTED
PROPOSAL_EXECUTION_SEPARATION = PRESERVED
APPROVAL_BOUNDARY = IMPLEMENTED
BOUNDED_EXECUTION = IMPLEMENTED
EXISTING_EDIT_CONTROLLERS = REUSED
HISTORY = REUSED
ATOMIC_FAILURE = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`CHAT_BOUNDED_EDIT_LOOP_WORKS`

## Explicit exclusions

Do not implement:

- revision snapshot/restore closure;
- CHAT conversation storage platform;
- generic comments/presence/multiplayer;
- mandatory server/backend/API;
- remote AI dependency for core semantics;
- arbitrary script/eval command execution;
- broad UI redesign;
- rose-window benchmark;
- package/single-file release;
- FORMAT_VERSION bump;
- second History/vector/hierarchy/transform/renderer/mutation engine.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. accepted editor/History/document contracts must break;
3. a second mutation/History/vector/hierarchy/transform engine becomes necessary;
4. remote service becomes required for the core proposal/approval/execution path;
5. scope must expand into Revision closure or broad collaboration platform work.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run feasible source/static/unit/serialization checks.
Never claim unexecuted checks as PASS.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-011
BRANCH = work/ink-cloud-011
GATE = CHAT_BOUNDED_EDIT_LOOP_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
