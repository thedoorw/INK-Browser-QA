# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-013 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-013` |
| TITLE | `Integrated Creative Loop Validation v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-013` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_FOR_BOUNDED_FIXES_ONLY` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED_EXCEPT_EXECUTABLE_LOCAL_HARNESS` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-012 is promoted with gate:

`CREATIVE_LOOP_V1_COMPLETE`

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

## Objective

Validate the accepted chain as one integrated workflow and expose cross-stage defects before building broader workspace UX.

This task is validation-first. Product mutation is allowed only for bounded fixes required to make already-accepted stages interoperate correctly.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_REVISION_CLOSURE_REPORT_v0.1.md`
8. `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`
9. accepted reports for INK-CLOUD-007 through 012 as needed

## Scope

Required:

- build one deterministic integrated test/harness traversing the full accepted creative loop;
- verify stable object identity/provenance across stages;
- verify Path remains editable after composition/repaint/CHAT mutation/Revision restore;
- verify History and Revision boundaries coexist correctly;
- verify CHAT references remain valid or fail deterministically after structural changes;
- verify save/load/file-envelope integrity at integrated checkpoints;
- execute the deferred rose-window hard benchmark if the registered fixture is available;
- compare direct extraction vs structure-aware reconstruction using the existing benchmark criteria;
- record exact blockers if the hard fixture is unavailable; fixture unavailability does not invalidate the integrated deterministic harness;
- bounded cross-stage fixes only; no new broad feature family.

## Phases

### Phase A — integrated deterministic fixture

Create a deterministic non-image fixture that exercises:

`Extract → Path → Edit → Stroke → Compose → Repaint → CHAT → Revision`

Prove state continuity and checkpoint fingerprints.

### Phase B — cross-stage invariants

Prove:
- IDs/provenance retained;
- geometry remains editable;
- appearance separation retained;
- composition/hierarchy stable;
- CHAT stale-state protections work;
- Revision restore returns structured editable state;
- History/Revision boundaries are non-conflicting.

### Phase C — save/load integrated closure

Exercise file-envelope/storage/serialization around at least two points in the chain and after Revision restore.

### Phase D — rose-window hard integrated benchmark

If fixture is available, run the registered hard benchmark.

Required comparison:
- direct extraction;
- structure-aware reconstruction;
- contour/topology completeness;
- repeated-geometry regularity;
- editability;
- correction cost/proxy evidence.

If fixture is unavailable, set:

`HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE`

and continue remaining phases.

### Phase E — bounded fixes + regression

Fix only defects that violate accepted cross-stage contracts.
Do not redesign individual subsystems.

### Phase F — report + handoff

Create:

`research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md`

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
INTEGRATED_LOOP = VALIDATED
CROSS_STAGE_IDENTITY = PRESERVED
PATH_EDITABILITY = PRESERVED
APPEARANCE_SEPARATION = PRESERVED
COMPOSITION = PRESERVED
CHAT_BINDING = VALIDATED
HISTORY_REVISION_BOUNDARY = VALIDATED
SAVE_LOAD = VALIDATED
HARD_BENCHMARK = EXECUTED_OR_EXPLICITLY_BLOCKED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
```

Gate:

`INTEGRATED_CREATIVE_LOOP_VALIDATED`

## Explicit exclusions

Do not implement:

- broad workspace UI;
- multi-step creative reasoning/agent planner;
- comments/presence/multiplayer;
- mandatory backend/auth/sync;
- Portable INK packaging;
- broad renderer/vector/document redesign;
- FORMAT_VERSION bump.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. accepted core contracts must be broken rather than bounded-fixed;
3. a second core engine is required;
4. remote service becomes mandatory;
5. scope expands into workspace UX or multi-step CHAT planning.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-013
BRANCH = work/ink-cloud-013
GATE = INTEGRATED_CREATIVE_LOOP_VALIDATED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
