# INK Core Spatial Index / Lasso Consistency — Supervisor Review 2026-10-02

STATUS: SUPERVISOR_ACCEPTED / PROMOTION_PENDING

Repository: `thedoorw/INK-Browser-QA`

Dispatch:
`ACTIVE/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_DISPATCH_v1.0.md`

Baseline:
`a9d122ccba14734caf6220a53044545494a8429b`

Candidate branch:
`work/core-spatial-index-lasso-repair-001`

Final branch HEAD:
`7913b332247c0892928501761975bf59d96e3885`

Exact browser-tested SHA:
`864e72d5aa6b37ca5625c9ea3634fa506ea6b644`

Focused browser run:
`36972999791`

## 1. Final source review

The product mutation remains narrowly bounded to:

`product/source/src/ink.js`

The exact Core change is two mutation-lifecycle notifications:

- finalized Stroke creation queues `it.object.id` with `queueSpatialObject(it.object.id)`;
- finalized Shape creation queues `it.object.id` with `queueSpatialObject(it.object.id)`.

No other product source is changed relative to the task baseline.

The repair is placed after the object has been committed into the document and uses the pre-existing `spatialPending` / `PageSpatialIndex.syncObjects()` path.

It does not:
- add a new `refreshAll()` workaround;
- create a second spatial index;
- create a second selection authority;
- alter UI;
- alter New Document / A4;
- alter Creation / Layout workspace;
- alter FORMAT_VERSION.

## 2. Spatial authority review

Existing authority remains singular:

```text
document/page object graph
→ queueSpatialObject / queueSpatialSelection
→ spatialPending
→ ensureSpatialIndex
→ PageSpatialIndex.syncObjects
→ fallback full rebuild only when existing authority requires it
```

The new create path therefore joins the same mutation lifecycle already used by object edits.

Independent source inspection confirms:
- `queueSpatialObject()` only records the exact object ID;
- `ensureSpatialIndex()` consumes pending IDs incrementally when the current page/index is valid;
- unsafe incremental synchronization falls back through the existing rebuild path;
- native Lasso queries `ensureSpatialIndex()`, not a second selection/index implementation.

## 3. Browser evidence

Committed evidence:

- `qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/spatial-index-browser.json`
- `qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/shape-lasso-pass.png`
- `working/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_RETURN_20261002.md`

Evidence identity:

```text
targetSha = 864e72d5aa6b37ca5625c9ea3634fa506ea6b644
FORMAT_VERSION = 4
status = PASS
checks = 33 / 33 PASS
failures = 0
central Runtime = NOT EXECUTED
```

The focused runner uses the actual browser product.

For the reproduced defect it:
1. selects the native Shape tool;
2. creates the Shape by pointer drag;
3. confirms the exact new object ID is pending while not yet present in the index;
4. selects the native Lasso tool;
5. performs a polygon pointer gesture around the new Shape;
6. verifies native Lasso selects that exact Shape ID;
7. verifies the pending ID is incrementally consumed by the existing index.

The runner does not call `refreshAll()` to make the fresh Shape selectable.

## 4. Required lifecycle coverage

All required focused checks are present and PASS:

| Area | Evidence disposition |
| --- | --- |
| Shape create | exact ID queued; native Lasso selects it without blanket rebuild |
| Stroke create | exact ID queued and incrementally indexed |
| Move | selected ID queued; new bounds indexed; stale old hit removed |
| Resize | selected ID queued; bounds updated |
| Rotate | selected ID queued; bounds updated |
| Duplicate | existing structural dirty/rebuild path contains original + copy IDs |
| Delete | deleted ID removed |
| Undo delete | exact ID restored |
| Redo delete | exact ID removed again |
| Undo/redo creation | same created ID removed/restored correctly |
| Group / ungroup | group/child IDs reconcile correctly |
| Frame | frame + nested child IDs reconcile correctly |
| Reparent | child ID and world bounds preserved across root/frame moves |
| Page switch | index switches page authority with no cross-page ID leakage |

Final evidence counters include both incremental updates and the pre-existing structural full rebuild paths. This is expected; the dispatch prohibited adding a blanket rebuild workaround, not removing legitimate structural rebuilds already owned by the Core lifecycle.

## 5. Evidence-handoff hygiene

The earlier blocking evidence gap is closed.

The task-specific GitHub Actions workflow:
`.github/workflows/ink-core-spatial-index-lasso-repair.yml`

is absent from the final candidate tree.

Final branch delta versus the task baseline contains only:
- `product/source/src/ink.js`;
- focused runner;
- committed JSON evidence;
- committed PNG evidence;
- DEV return.

No UI/New Document/workspace product file is part of the final delta.

## 6. Branch promotion note

The work branch is now diverged from current `main` because main continued receiving Supervisor/work-order documentation while the Core task was isolated.

Therefore:

```text
DO NOT use branch divergence as a reason to reopen the Core fix.
DO NOT fold unrelated current-main work into this repair review.
PROMOTION should preserve the exact accepted final tree delta on current main.
```

A clean promotion/replay of the accepted final delta is preferable to importing transient task-workflow history.

No promotion or product mutation is performed by this Supervisor review.

## Supervisor disposition

```text
CORE_REPAIR_SOURCE = ACCEPTED
MUTATION_LIFECYCLE_LOCATION = ACCEPTED
SPATIAL_INDEX_AUTHORITY = PRESERVED
SECOND_SELECTION_AUTHORITY = NONE
NEW_REFRESHALL_WORKAROUND = NONE

FOCUSED_BROWSER_EVIDENCE = PASS / 33_OF_33
EXACT_ID_VALIDATION = PASS
CREATE_MOVE_RESIZE_ROTATE = PASS
DUPLICATE_DELETE_UNDO_REDO = PASS
GROUP_FRAME_REPARENT = PASS
PAGE_SWITCH_ISOLATION = PASS

FORMAT_VERSION = 4 / UNCHANGED
UI_MUTATION = NONE
NEW_DOCUMENT_A4_MUTATION = NONE
WORKSPACE_MUTATION = NONE
TASK_WORKFLOW_RETAINED = NO

CANDIDATE_HEAD = 7913b332247c0892928501761975bf59d96e3885
TESTED_SHA = 864e72d5aa6b37ca5625c9ea3634fa506ea6b644
CORE_SUPERVISOR_REVIEW = ACCEPTED
PROMOTION = PENDING / SEPARATE ACTION
```
