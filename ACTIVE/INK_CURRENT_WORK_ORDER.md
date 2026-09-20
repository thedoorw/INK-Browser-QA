# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-009 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-009` |
| TITLE | `Multi-Contour Composition v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-009` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED` |
| PROMOTION_POLICY | `MR_PASS_AUTO_PROMOTE / NO_USER_PAUSE` |

## Accepted baseline

INK-CLOUD-008B is promoted to main.

Accepted creative chain:

```text
Reference
→ Extract
→ editable Path
→ direct Path Editing
→ independent Expressive Stroke
```

This Work Order adds only:

```text
Path A + Path B + Path C
→ Compose
```

## Objective

Enable multiple independently sourced editable Paths to coexist and compose in one INK document without flattening, identity loss, source/provenance loss, or duplicate hierarchy/transform engines.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_PATH_EDITING_CORE_REPORT_v0.1.md`
8. `research/INK_EXPRESSIVE_STROKE_REPORT_v0.1.md`
9. existing hierarchy/transform/selection/History/serialization source as required

## Scope

Required:

- multiple editable Paths from different references in one document;
- stable source/path identity retained;
- Layer / Group / Frame organization using existing hierarchy;
- select one or multiple Path objects;
- move / scale / rotate using existing transform system;
- z-order / reorder;
- duplicate while generating fresh object/node identities and retaining source provenance;
- compose extracted/native/styled Paths together;
- preserve expressive stroke appearance through composition;
- no flattening;
- save/load / serialization integrity;
- structured SVG export remains valid;
- History-backed mutations;
- bounded composition diagnostics.

## Phases

### Phase A — multi-source identity contract

Establish and verify:

- multiple reference/path provenance records can coexist;
- duplicate-source and duplicate-path identity rules;
- stable object IDs for ordinary composition;
- fresh IDs for explicit duplication;
- no provenance collision.

Checkpoint commit required.

### Phase B — composition selection + transforms

Implement/reuse:

- multi-object selection;
- translate / scale / rotate through existing transform model;
- singular/stale/locked/hidden guards;
- History-backed transforms;
- no Path geometry rewriting for ordinary object transforms.

Checkpoint commit required.

### Phase C — hierarchy + z-order

Implement/reuse:

- layer placement;
- Group / Frame organization;
- z-order and reorder;
- reparenting while preserving world-space appearance where required by existing hierarchy contract;
- expressive stroke preserved through hierarchy operations.

Checkpoint commit required.

### Phase D — duplication

Implement bounded duplication:

- fresh object/subpath/anchor IDs;
- retained provenance link to original source;
- no identity collision;
- duplicate can be edited/transformed independently;
- existing style and metadata copied according to accepted conventions;
- History-backed.

Checkpoint commit required.

### Phase E — integration and regression evidence

Prove:

- at least three Paths can coexist and compose;
- paths may come from distinct source identities;
- native/extracted/expressive-stroke Paths remain editable;
- transform/z-order/group/frame/duplicate operations preserve integrity;
- undo/redo;
- save/load;
- migration/integrity where runnable;
- structured SVG;
- FORMAT_VERSION 4;
- no package mutation.

Checkpoint commit required.

### Phase F — report + handoff

Create:

`research/INK_MULTI_CONTOUR_COMPOSITION_REPORT_v0.1.md`

Report:

- implemented composition capabilities;
- identity/provenance behavior;
- hierarchy/transform reuse;
- tests executed/not executed;
- runtime debt;
- exact candidate HEAD;
- confirmation Repaint/Material and CHAT mutation were not started.

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
MULTI_SOURCE_PATHS = IMPLEMENTED
MULTI_OBJECT_COMPOSITION = IMPLEMENTED
TRANSFORM = REUSED
HIERARCHY = REUSED
Z_ORDER = IMPLEMENTED
DUPLICATION_WITH_FRESH_IDENTITIES = IMPLEMENTED
PATH_EDITABILITY = PRESERVED
EXPRESSIVE_STROKE = PRESERVED
PROVENANCE = PRESERVED
HISTORY = REUSED
SERIALIZATION = PRESERVED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`MULTI_CONTOUR_COMPOSITION_WORKS`

## Explicit exclusions

Do not implement:

- Repaint / Material;
- CHAT mutation;
- rose-window benchmark;
- generic Cloud backend/auth/collaboration;
- broad UI redesign;
- package/single-file release;
- FORMAT_VERSION bump;
- second hierarchy/transform/vector/History/renderer engine.

## Hard STOP

STOP if:

1. FORMAT_VERSION change is required;
2. accepted hierarchy/transform/Path/History contract must break;
3. a second core engine becomes necessary;
4. composition requires flattening authoritative Paths;
5. scope must expand into Repaint/Material, CHAT mutation or broad UI redesign.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run feasible source/static/unit/serialization checks.
Never claim unexecuted checks as PASS.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-009
BRANCH = work/ink-cloud-009
GATE = MULTI_CONTOUR_COMPOSITION_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## MR Review — INK-CLOUD-009

Reviewed HEAD:

`044703931886269945b9092019844795e78ddf5a`

Decision:

`MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

Accepted bounded result:

```text
MULTI_SOURCE_PATHS = IMPLEMENTED
MULTI_OBJECT_COMPOSITION = IMPLEMENTED
TRANSFORM = REUSED
HIERARCHY = REUSED
Z_ORDER = IMPLEMENTED
DUPLICATION_WITH_FRESH_IDENTITIES = IMPLEMENTED
PATH_EDITABILITY = PRESERVED
EXPRESSIVE_STROKE = PRESERVED
PROVENANCE = PRESERVED
HISTORY = REUSED
SERIALIZATION = PRESERVED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`MULTI_CONTOUR_COMPOSITION_WORKS`

Per continuous-advance governance, clean promotion proceeds automatically.
