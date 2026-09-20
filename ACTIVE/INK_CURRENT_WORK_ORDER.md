# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-012 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-012` |
| TITLE | `Revision Closure v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-012` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED` |
| PROMOTION_POLICY | `MR_PASS_AUTO_PROMOTE / NO_USER_PAUSE` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-011 is promoted to main with gate:

`CHAT_BOUNDED_EDIT_LOOP_WORKS`

Accepted chain:

```text
Reference
→ Extract
→ editable Path
→ Path Editing
→ Expressive Stroke
→ Multi-Contour Composition
→ Repaint / Material
→ CHAT Review + Structured Edit Tasks
```

This Work Order adds only:

```text
accepted document state
→ stable Revision identity
→ snapshot/envelope
→ before/after metadata
→ restore/reopen
→ CHAT revision binding
```

## Objective

Close the first creative loop by adding a browser-local, transport-neutral Revision layer that preserves recoverable structured document states without flattening or introducing a second History/document engine.

Core rule:

```text
History = local edit chronology.
Revision = named/stable recoverable document checkpoint.
Revision must preserve authoritative structured INK state.
```

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`
8. existing document/file-envelope/storage/History/CHAT bounded-edit source as required

## Scope

Required:

- stable revision identity and versioned revision record;
- deterministic snapshot of authoritative INK structured document state;
- revision metadata including parent/base relation, creation reason and bounded before/after comparison metadata;
- restore/reopen of a revision into valid editable INK state;
- no flattening/raster substitution;
- integrity/fingerprint validation;
- browser-local/static-hosted persistence path using existing storage/file-envelope architecture where possible;
- CHAT state/proposal/result records may reference stable revision identity without becoming the authoritative document;
- deterministic failure diagnostics;
- atomic restore: failed validation/restore leaves active document unchanged;
- History interaction defined explicitly so Revision restore does not create a second History engine;
- save/load/serialization integrity with `FORMAT_VERSION = 4` unless a required change triggers Hard STOP.

## Phases

### Phase A — Revision identity + snapshot contract

Define/reuse a bounded revision record.

Required:
- revision ID;
- document ID;
- parent/base revision ID where applicable;
- created-at/reason/label metadata;
- deterministic document fingerprint;
- structured document snapshot/envelope;
- bounded metadata only; no duplicated renderer/vector engines.

Checkpoint commit required.

### Phase B — capture + comparison metadata

Implement browser-local revision capture.

Required:
- capture current valid document;
- deterministic before/after relation;
- bounded comparison metadata such as changed object IDs/counts, geometry/appearance/structure fingerprints where already available;
- no mutation caused by capture;
- deterministic no-op/equivalent-state handling.

Checkpoint commit required.

### Phase C — restore / reopen

Implement validated restoration through existing document/persistence architecture.

Required:
- validate schema/integrity/fingerprint;
- restore structured editable state;
- preserve IDs/provenance/Path geometry/material/CHAT-compatible references where the snapshot contains them;
- atomic failure;
- define History reset/boundary behavior explicitly;
- no flattening.

Checkpoint commit required.

### Phase D — CHAT revision binding

Extend the transport-neutral CHAT contract only as needed so discussion/edit records can name the revision they inspected or modified.

Required:
- stable `revisionId` exposure in CHAT-readable state or bounded context;
- proposal/result revision precondition or binding where useful;
- stale-revision rejection;
- no conversation-storage platform;
- no mandatory remote service.

Checkpoint commit required.

### Phase E — regression evidence

Prove:
- deterministic revision capture;
- capture causes zero document mutation;
- before/after metadata is deterministic;
- restore/reopen returns equivalent structured state;
- failed/corrupt restore is atomic;
- Path geometry, composition, appearance, provenance and CHAT references survive;
- History behavior is explicit and non-duplicative;
- static/browser-local operation requires no backend;
- `FORMAT_VERSION = 4`;
- package untouched.

Checkpoint commit required.

### Phase F — report + DEV handoff

Create:

`research/INK_REVISION_CLOSURE_REPORT_v0.1.md`

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
REVISION_IDENTITY = IMPLEMENTED
REVISION_SNAPSHOT = IMPLEMENTED
BEFORE_AFTER_METADATA = IMPLEMENTED
RESTORE_REOPEN = IMPLEMENTED
ATOMIC_RESTORE_FAILURE = PRESERVED
CHAT_REVISION_BINDING = IMPLEMENTED
STRUCTURED_DOCUMENT = PRESERVED
HISTORY = REUSED_OR_EXPLICIT_BOUNDARY
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`CREATIVE_LOOP_V1_COMPLETE`

## Explicit exclusions

Do not implement:

- rose-window hard integrated benchmark;
- generic comments/chat-storage platform;
- multiplayer presence/cursors;
- mandatory backend/auth/sync;
- broad Cloud dashboard/project management;
- broad UI redesign;
- package/single-file release;
- FORMAT_VERSION bump;
- second document/History/vector/hierarchy/transform/renderer engine.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. accepted file-envelope/document/History contracts must break;
3. a second document/History/vector/hierarchy/transform/renderer engine becomes necessary;
4. remote service becomes required for core revision semantics;
5. structured document state must be flattened/rasterized;
6. scope must expand into hard integrated benchmark or broad platform work.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run feasible source/static/unit/serialization/migration checks.
Never claim unexecuted checks as PASS.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-012
BRANCH = work/ink-cloud-012
GATE = CREATIVE_LOOP_V1_COMPLETE
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
