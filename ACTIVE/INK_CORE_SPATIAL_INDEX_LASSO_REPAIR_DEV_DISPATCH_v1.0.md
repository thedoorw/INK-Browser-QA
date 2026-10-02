# INK Core Spatial Index / Lasso Consistency — DEV Dispatch v1.0

STATUS: QUEUED / USER-AUTHORIZED CORE-BOUNDED REPAIR
DATE: 2026-10-02
OWNER: CORE DEV
PRODUCT: thedoorw/INK-Browser-QA
BASELINE: a9d122ccba14734caf6220a53044545494a8429b

Read first:
1. `working/INK_UI_SUP08_11_REPAIR_RETURN_20261002.md`
2. `working/evidence/ink-ui-sup08-11-20261002/after-spatial-probe.json`
3. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
4. current `product/source/src/ink.js` spatial-index lifecycle.

## Defect

The accepted UI candidate reproduced an existing Core inconsistency:

```text
create new Shape
→ document contains object
→ spatialDirty may remain false
→ spatial index can contain zero entry for the new object
→ native Lasso misses it
→ refreshAll / index rebuild makes it selectable
```

This is not a UI problem.

## Goal

Repair the existing spatial-index invalidation/synchronization contract so newly created, removed, transformed and history-restored selectable objects are represented by the native selection index at the correct time.

Use the existing authority:
- `spatialIndex`;
- `spatialDirty`;
- `spatialPending`;
- `ensureSpatialIndex()`;
- `queueSpatialObject()`;
- `queueSpatialSelection()`;
- `rebuildSpatialIndex()`.

Do not create a second selection/index model.

## Required investigation

Identify the exact mutation path that creates the reproduced stale state.

Audit at minimum:
- Shape creation commit;
- stroke/path creation where applicable;
- add/remove object;
- group/frame/reparent;
- transform completion;
- duplicate/delete;
- undo/redo/history jump;
- page switch / document replacement.

Classify each mutation as:
- incremental queue is sufficient;
- full dirty/rebuild required;
- already correct.

## Repair rules

- fix invalidation at the mutation/lifecycle source;
- do not call `refreshAll()` after every pointer operation as a blanket workaround;
- do not rebuild the whole index on every frame when incremental sync is sufficient;
- renderer bounds remain the existing bounds authority;
- preserve Selection and History semantics;
- preserve FORMAT_VERSION;
- no UI changes in this package.

## Acceptance

Fresh browser sequence must pass without manual `refreshAll()`:

```text
new document
→ draw Shape
→ switch/select Lasso
→ gesture around Shape
→ Shape selected
```

Also verify:
- create → select;
- move/resize/rotate → select at new bounds, not stale bounds;
- duplicate → both originals/copies index correctly;
- delete → deleted object no longer hits;
- undo/redo of creation/deletion;
- group/frame/reparent if those paths touch bounds/index lifecycle;
- page switch does not leak previous-page entries.

Evidence must record index entry counts/IDs before and after each mutation.

## Guard

```text
NO_SECOND_SPATIAL_INDEX = TRUE
NO_SECOND_SELECTION_AUTHORITY = TRUE
NO_UI_MUTATION = TRUE
FORMAT_VERSION = 4
HISTORY_SEMANTICS = PRESERVED
```

Return candidate + focused evidence, then STOP to Supervisor / Core review.
