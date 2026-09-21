# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-015 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-015` |
| TITLE | `CHAT Multi-Step Creative Collaboration v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-015` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_CHAT_COLLABORATION_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED_EXCEPT_EXECUTABLE_LOCAL_HARNESS` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-014 is promoted with gate:

`CREATIVE_WORKSPACE_MINIMUM_UX_WORKS`

Accepted collaboration path:

```text
INK structured document
→ CHAT inspect
→ one bounded proposal
→ explicit approval
→ structured edit
→ History
→ Revision
```

The minimum Creative Workspace now exposes the full accepted engine chain.

## Objective

Advance CHAT from one bounded edit command to one reviewable multi-step creative plan while preserving user control and all existing editor authorities.

Target collaboration path:

```text
inspect structured state
→ express creative intent / receive structured plan
→ review ordered steps
→ explicit user approval
→ execute through existing bounded edit operations
→ stop deterministically on stale/failed step
→ inspect result
→ Revision comparison / continue or revise plan
```

This task builds a local orchestration and plan contract. It does not require a remote AI service and does not authorize autonomous editing.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`
8. `research/INK_CREATIVE_WORKSPACE_MINIMUM_UX_REPORT_v0.1.md`
9. existing CHAT bounded-edit, Revision, History and Creative Workspace source as required

## Product principle

CHAT may reason about a sequence; INK remains the execution authority.

```text
CHAT PLAN
≠
DIRECT DOCUMENT MUTATION
```

Every executable step must resolve to an already-supported bounded INK operation or an explicitly added bounded operation using existing controllers.

## Scope

Required:

- define a versioned multi-step creative-plan schema;
- preserve stable plan ID, source Revision ID, target references and ordered step IDs;
- support step dependencies and deterministic sequence order;
- validate every step before approval and revalidate immediately before execution;
- expose plan summary, target summary and expected operations for user review;
- require explicit approval before execution;
- execute steps through the existing CHAT bounded-edit / editor authorities;
- stop on stale Revision, stale target, failed precondition or failed operation;
- never silently retarget or skip a failed step;
- produce deterministic per-step and whole-plan result records;
- bind plan execution to Revision identity and expose before/after Revision relation;
- permit an optional external/AI adapter to propose a plan, but keep validation/execution browser-local;
- expose the plan flow minimally in the existing Creative Workspace CHAT area;
- preserve History and Revision semantics;
- preserve static-hosted/browser-local execution.

## Phases

### Phase A — Creative plan contract

Define a versioned plan schema, minimally including:

- `planId`;
- source document / page / Revision identity;
- user-intent summary;
- ordered `steps[]`;
- stable `stepId`;
- operation;
- targets;
- arguments;
- optional dependency references;
- plan status and diagnostics.

The plan is data, not an alternate document model.

Checkpoint commit required.

### Phase B — Validation + preconditions

Implement deterministic validation:

- schema/version;
- supported operation;
- target existence/type;
- source Revision match;
- dependency validity;
- cycle/order rejection;
- locked/hidden/unexposed target guards as already supported;
- no execution during busy/invalid History state.

Validation must not mutate the active document.

Checkpoint commit required.

### Phase C — Approval + local orchestration

Implement:

```text
PROPOSED
→ APPROVED
→ EXECUTING
→ COMPLETED | STOPPED | REJECTED
```

Required:

- explicit user approval token/boundary;
- no execution before approval;
- ordered execution through existing bounded-edit/editor commands;
- immediate revalidation before each step;
- deterministic stop on first failure;
- successful completed steps remain accurately recorded;
- no silent continue after failure;
- no autonomous approval.

Do not create a second History engine.

Checkpoint commit required.

### Phase D — Revision-aware result / continuation

Bind execution to Revision:

- record starting Revision;
- expose changed/touched targets and step results;
- capture or reference an ending Revision through the accepted Revision authority where appropriate;
- expose before/after comparison metadata already supported;
- allow a subsequent plan to explicitly base on the resulting Revision;
- reject stale source-Revision plans.

Do not create a second diff or Revision engine.

Checkpoint commit required.

### Phase E — Creative Workspace plan UX

Extend the existing CHAT workspace area minimally to show:

- intent/plan summary;
- ordered step list;
- target/operation for each step;
- validation state;
- Approve / Reject;
- execution progress;
- stopped-step diagnostics;
- resulting Revision identity.

This is not a broad UI redesign.

Checkpoint commit required.

### Phase F — regression evidence + report

Exercise at least:

- deterministic two-or-more-step plan;
- validation causes zero mutation;
- execute-before-approval rejection;
- successful ordered execution;
- stale Revision rejection;
- stale target rejection;
- mid-plan failure stops remaining steps;
- no silent retarget/skip;
- History remains single authority;
- Revision before/after relation is preserved;
- static/browser-local core works with no remote service;
- `FORMAT_VERSION = 4`;
- package untouched.

Create:

`research/INK_CHAT_MULTI_STEP_CREATIVE_COLLABORATION_REPORT_v0.1.md`

Return:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
MULTI_STEP_PLAN_SCHEMA = IMPLEMENTED
PLAN_VALIDATION = IMPLEMENTED
EXPLICIT_APPROVAL = PRESERVED
ORDERED_BOUNDED_EXECUTION = IMPLEMENTED
STEP_REVALIDATION = IMPLEMENTED
STOP_ON_FAILURE = IMPLEMENTED
STALE_REVISION_REJECTION = IMPLEMENTED
STALE_TARGET_REJECTION = IMPLEMENTED
PLAN_RESULT_RECORD = IMPLEMENTED
REVISION_BINDING = IMPLEMENTED
WORKSPACE_PLAN_UI = CONNECTED
EXISTING_CONTROLLERS = REUSED
HISTORY_AUTHORITY = PRESERVED
STRUCTURED_DOCUMENT = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
AUTONOMOUS_APPROVAL = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS`

## Explicit exclusions

Do not implement:

- autonomous agent execution without user approval;
- free-running recursive planner;
- mandatory LLM/backend/API;
- generic conversation storage;
- multiplayer/presence/comments;
- broad UI redesign;
- new vector/document/History/Revision/renderer engine;
- Structure-Aware Reconstruction redesign;
- Portable INK packaging;
- package/release mutation;
- `FORMAT_VERSION` bump.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. existing CHAT/History/Revision/editor contracts must be broken rather than extended boundedly;
3. a second execution/document/History/Revision authority becomes necessary;
4. remote service becomes mandatory for plan semantics or execution;
5. user approval can no longer remain explicit;
6. scope expands into autonomous open-ended agent behavior or broad platform work;
7. package/release mutation becomes necessary.

## QA

GitHub Actions quota remains exhausted.

Run all feasible source/static/unit/serialization/workspace orchestration checks.

Do not claim browser/runtime paths that were not executed.

`RUNTIME_QA = DEFERRED`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-015
BRANCH = work/ink-cloud-015
GATE = CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
