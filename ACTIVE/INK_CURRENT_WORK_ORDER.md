# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-016 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-016` |
| TITLE | `Portable Baseline Integration v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-016` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_PORTABLE_INTEGRATION_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED_EXCEPT_EXECUTABLE_LOCAL_HARNESS` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-015 is promoted with gate:

`CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS`

Accepted shared-core chain:

```text
Reference
→ Extract
→ editable Path
→ Path Edit / Expressive Stroke
→ Multi-Contour Compose
→ Repaint / Material
→ CHAT bounded edit
→ CHAT multi-step creative plan
→ Revision
→ Creative Workspace
```

The first human-AI creative loop and its minimum workspace are now established on main.

## Objective

Perform the planned Portable INK checkpoint: verify that the evolved shared core remains compatible with a portable/static browser baseline and can still be integrated toward a single `INK.html` without creating Cloud-only dependencies in the editing core.

This is an integration/readiness checkpoint, not package/release production.

Target:

```text
accepted shared core
→ portable/static entry compatibility
→ module/dependency closure
→ persistence + History + Revision integrity
→ CHAT local orchestration integrity
→ no mandatory Cloud/backend dependency
→ portable baseline readiness evidence
```

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md` if present
8. `research/INK_CREATIVE_WORKSPACE_MINIMUM_UX_REPORT_v0.1.md`
9. `research/INK_CHAT_MULTI_STEP_CREATIVE_COLLABORATION_REPORT_v0.1.md`
10. current portable/static entry, service-worker, document persistence, History, Revision and editor install source as required

## Product principle

Portable INK and INK Cloud must consume the same authoritative editing core.

```text
PORTABLE INTEGRATION
≠
FORKED EDITOR CORE
```

Cloud/session/remote services remain optional adapters.

## Scope

Required:

- inventory the current portable/static entry path and shared-core dependency graph;
- verify all creative-loop modules can load under the portable/static browser-local runtime;
- verify no mandatory backend/remote API dependency has entered core editing/collaboration;
- verify document save/load, History and Revision contracts remain compatible;
- verify CHAT bounded edit and multi-step plan orchestration remain browser-local;
- identify any module-order, service-worker, import/export, asset-path or initialization gaps that block portable integration;
- fix only bounded shared-core/static integration defects;
- add deterministic source/static/integration harness coverage;
- produce a portable-baseline integration report;
- keep `FORMAT_VERSION = 4`;
- do not regenerate or mutate release/package artifacts.

## Phases

### Phase A — Portable dependency inventory

Map:

- entry points;
- shared editor/core modules;
- service-worker/static shell dependencies;
- persistence/Revision dependencies;
- CHAT collaboration dependencies;
- optional remote adapters.

Classify each dependency as:

`SHARED_CORE / STATIC_LOCAL / OPTIONAL_REMOTE / PACKAGE_ONLY`

Checkpoint commit required.

### Phase B — Static/portable load closure

Verify source-level/module-level closure for the accepted creative-loop modules.

Required:

- imports/exports resolve;
- install order is deterministic;
- no Cloud-only mandatory bootstrap;
- no backend/auth/network requirement for core editing;
- no duplicate editor/document authority.

Bounded fixes allowed.

Checkpoint commit required.

### Phase C — Persistence + collaboration compatibility

Verify:

- structured document save/load;
- History authority remains single;
- Revision capture/restore remains compatible;
- CHAT bounded edit still validates/executes locally;
- CHAT multi-step plans still require explicit approval and execute locally;
- current workspace is an adapter/view, not a portable-core dependency.

Checkpoint commit required.

### Phase D — Portable integration harness

Build deterministic checks for at least:

- static module closure;
- editor install sequence;
- document open/save round-trip surface;
- History + Revision authority wiring;
- CHAT bounded-edit presence;
- CHAT creative-plan presence;
- no mandatory remote runtime calls;
- service-worker/static-shell references;
- `FORMAT_VERSION = 4`.

Do not claim real browser/runtime paths that are not executed.

Checkpoint commit required.

### Phase E — Gap correction

If Phase A-D reveal bounded portable/static integration defects, correct them without:

- package mutation;
- format bump;
- new backend;
- second editor/document/History/Revision engine;
- broad UI redesign.

Checkpoint commit required if changes occur.

### Phase F — report + DEV handoff

Create:

`research/INK_PORTABLE_BASELINE_INTEGRATION_REPORT_v0.1.md`

Return:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
PORTABLE_DEPENDENCY_INVENTORY = COMPLETE
STATIC_MODULE_CLOSURE = VERIFIED
SHARED_CORE_REUSED = VERIFIED
DOCUMENT_PERSISTENCE_COMPATIBILITY = VERIFIED
HISTORY_AUTHORITY = PRESERVED
REVISION_COMPATIBILITY = VERIFIED
CHAT_BOUNDED_EDIT_LOCAL = VERIFIED
CHAT_MULTI_STEP_LOCAL = VERIFIED
MANDATORY_REMOTE_DEPENDENCY = 0
SECOND_EDITOR_CORE = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`PORTABLE_SHARED_CORE_INTEGRITY_WORKS`

## Explicit exclusions

Do not implement:

- package/release regeneration;
- final single-file `INK.html` release build;
- Cloud account/auth/sync;
- multiplayer/presence/comments;
- autonomous agent execution;
- Structure-Aware Reconstruction redesign;
- broad UI redesign;
- new document/vector/History/Revision/renderer engine;
- `FORMAT_VERSION` bump.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. portable support requires forking the editor/document core;
3. mandatory backend/remote service is required for the accepted creative loop;
4. package/release mutation becomes necessary;
5. accepted persistence/History/Revision contracts must be broken;
6. a broad architecture decision outside bounded integration is required.

## QA

GitHub Actions quota remains exhausted.

Run all feasible source/static/unit/serialization/integration checks.

Never claim unexecuted browser/runtime paths pass.

`RUNTIME_QA = DEFERRED`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-016
BRANCH = work/ink-cloud-016
GATE = PORTABLE_SHARED_CORE_INTEGRITY_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
