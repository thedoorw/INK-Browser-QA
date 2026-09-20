# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-008A / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-008A` |
| TITLE | `Path Editing Core v0.1` |
| AUTHORITY | `USER_EXPLICIT_DEVELOPMENT_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-008a` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |

## Product objective

Continue the creative loop from the accepted INK-CLOUD-007 baseline:

```text
Reference → Extract → editable Path
```

This Work Order implements only:

```text
editable Path → direct Path Editing
```

The purpose is to make extracted/native INK Paths safely and precisely editable before expressive stroke work begins.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_EXTRACTION_PIPELINE_SELECTION_REPORT_v0.1.md`
8. existing vector/editor/History source required by implementation

## Accepted baseline

INK-CLOUD-007 is promoted to main.

Accepted capability:

```text
Reference
→ Extract
→ authoritative editable INK Path
→ existing History / serialization
```

Do not redesign or replace extraction, vector, transform, hierarchy, History or renderer architecture.

## Scope

Implement a bounded Path Editing Core using the existing INK vector model.

Required editing capabilities:

- enter/exit path edit mode;
- select a Path object for node editing;
- select one or multiple anchors;
- move selected anchors;
- select and move incoming/outgoing Bézier handles;
- corner / smooth / symmetric anchor modes;
- add anchor on an existing segment;
- delete anchor while protecting minimum viable geometry;
- open/close path integrity where existing model permits;
- local path reshape without replacing the whole Path object;
- bounded simplify/refine operation with explicit tolerance/diagnostics;
- extracted-path provenance must survive editing;
- stable object identity must survive editing;
- all mutations use existing History;
- undo/redo must restore exact geometry/state;
- save/load/serialization must preserve edit state geometry;
- structured SVG export must remain valid.

## UX boundary

Only the minimum editing interaction/control surface necessary to prove the core is authorized.

Do not redesign the full INK UI.

The implementation may add or extend bounded path-edit controls, hit-testing and handles necessary to operate the core.

## Long Sequence phases

### Phase A — Path edit state and selection contract

Establish reusable editor state for:

- active edited Path identity;
- subpath/anchor selection;
- handle selection;
- stale/locked/hidden/singular target guards;
- edit-mode enter/exit behavior;
- no mutation during selection-only actions.

Use stable existing object IDs.

Checkpoint commit required.

### Phase B — Anchor and handle editing

Implement through existing vector primitives where possible:

- anchor movement;
- Bézier handle movement;
- corner/smooth/symmetric modes;
- multi-anchor move;
- bounded local reshape.

All mutations must be History-backed.

Checkpoint commit required.

### Phase C — Topology editing

Implement:

- add anchor on segment;
- delete anchor;
- protect closed-path minimum anchor count;
- open/close path transition if supported without schema change;
- preserve outer/hole subpath role and compound-path integrity;
- reject invalid/non-finite geometry.

No whole-object regeneration for ordinary node edits.

Checkpoint commit required.

### Phase D — Simplify / refine

Implement a bounded geometry cleanup operation.

Requirements:

- explicit tolerance/settings;
- deterministic result;
- diagnostic before/after node counts;
- preserve Path identity and metadata;
- preserve closed/open state and subpath roles;
- History-backed;
- no rasterization;
- no destructive flattening;
- no hidden benchmark-specific tuning.

Checkpoint commit required.

### Phase E — Integration and regression evidence

Prove at minimum:

- native Path editing;
- extracted Path editing from the INK-CLOUD-007 provenance contract;
- undo/redo for each editing class;
- repeated edits without identity collision;
- save/load roundtrip;
- migration/integrity compatibility where runnable;
- structured SVG export;
- locked/hidden/singular/busy-History rejection;
- failure/cancel/no-op does not create corrupt History entries;
- `FORMAT_VERSION = 4`.

Create/update bounded QA tests.

Checkpoint commit required.

### Phase F — report and DEV handoff

Create:

`research/INK_PATH_EDITING_CORE_REPORT_v0.1.md`

Report:

- implemented capabilities;
- source files changed;
- tests actually executed;
- tests not executed;
- runtime/browser QA debt;
- known limitations;
- exact reviewed candidate HEAD;
- explicit confirmation that expressive stroke was not started.

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
PATH_EDIT_MODE = IMPLEMENTED
ANCHOR_EDIT = IMPLEMENTED
BEZIER_HANDLE_EDIT = IMPLEMENTED
TOPOLOGY_EDIT = IMPLEMENTED
SIMPLIFY_REFINE = IMPLEMENTED
HISTORY = REUSED
SERIALIZATION = PRESERVED
EXTRACTION_PROVENANCE = PRESERVED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

The Work Order gate is:

`EDITABLE_PATH_CORE_WORKS`

This is not yet the full Phase-2 gate `EDITABLE_PATH_AND_STROKE_WORKS`; expressive stroke belongs to INK-CLOUD-008B.

## Explicit exclusions

Do not implement:

- expressive stroke / brush assignment;
- variable-width stroke profile;
- natural-media stroke rendering changes;
- multi-contour composition;
- repaint/material;
- CHAT mutation;
- rose-window benchmark;
- generic Cloud backend/auth/collaboration;
- package/single-file release;
- FORMAT_VERSION bump;
- second vector/History/transform/renderer engine.

## Hard STOP

STOP and request MR decision if any of these become necessary:

1. FORMAT_VERSION change;
2. break to accepted Path/Frame/Group/Transform/History contracts;
3. second vector/history/transform/renderer engine;
4. broad UI redesign;
5. scope expansion into Expressive Stroke or later creative-loop phases.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run all feasible source/static/unit/serialization tests in the active environment.

Never claim unexecuted checks as PASS.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-008A
BRANCH = work/ink-cloud-008a
GATE = EDITABLE_PATH_CORE_WORKS
EXPRESSIVE_STROKE = NOT_STARTED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
