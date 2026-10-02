# INK Core Spatial Index / Lasso Consistency — DEV Return 2026-10-02

STATUS: FOCUSED_BROWSER_PASS / READY_FOR_CORE_SUPERVISOR_REVIEW

Repository: thedoorw/INK-Browser-QA
Branch: work/core-spatial-index-lasso-repair-001
Baseline: a9d122ccba14734caf6220a53044545494a8429b
Exact tested SHA: 864e72d5aa6b37ca5625c9ea3634fa506ea6b644
Focused browser result: 33 / 33 PASS
FORMAT_VERSION: 4
Central Runtime: NOT EXECUTED

## Core repair

No Core change was added in this evidence pass. The accepted repair remains exactly the two mutation-lifecycle notifications in product/source/src/ink.js:
- finalized Stroke creation queues its exact object ID with queueSpatialObject(it.object.id);
- finalized Shape creation queues its exact object ID with queueSpatialObject(it.object.id).

No new refreshAll() workaround, second spatial index, second selection authority, UI mutation, New Document/A4 change, or Creation/Layout workspace change was introduced.

## Browser evidence

- JSON: qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/spatial-index-browser.json
- PNG: qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/shape-lasso-pass.png
- Browser status: PASS
- Checks: 33 / 33 PASS
- Failures: 0

## Lifecycle / exact ID summary

- Shape create: 991eade1-34db-48a9-80b3-b3fba8866822 enters spatialPending; native Lasso query consumes it incrementally and selects the same ID. Index count 0 -> 1; incremental updates 0 -> 1.
- Stroke create: af8308d9-ec3b-4066-b188-0516fb4e0f25 enters spatialPending then enters the index. Index count 1 -> 2.
- Move / resize / rotate: selected Shape ID remains 991eade1-34db-48a9-80b3-b3fba8866822; focused checks confirm new bounds and no stale hit.
- Duplicate: copy ID 3106e383-342e-4902-8dfc-c364eebf39df appears after structural rebuild; delete removes it; undo restores the same ID; redo removes the same ID again.
- Group: group ID a754600a-2ac8-45f4-b953-9abaac369ac2 is indexed with child IDs; ungroup removes the group ID while preserving children.
- Frame / reparent: frame ID bddf550d-f7d4-447e-936f-fec929ea8dfd and nested child IDs are indexed; reparent root/frame preserves the child ID and world-space bounds contract.
- Page switch: page 1 468f8684-3e57-4e63-a3c1-3054776d2731; page 2 5616c78d-6e6e-4e72-8c03-361cf77943e4; page-2 object 28f3e055-0e69-4e85-a1ed-971b0fe1856d. Switch-back index IDs match page 1 and exclude page 2; switch-forward index IDs match page 2 and exclude page 1.
- Final spatial counters: full rebuilds 19; incremental updates 7.

## Final branch changed files vs baseline

- product/source/src/ink.js — two-line Core mutation-lifecycle repair.
- qa/runtime/run-ink-core-spatial-index-lasso-repair.mjs — focused browser runner.
- qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/spatial-index-browser.json — committed browser/index evidence.
- qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/shape-lasso-pass.png — committed native Lasso browser capture.
- working/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_RETURN_20261002.md — this return record.

Task-specific workflow .github/workflows/ink-core-spatial-index-lasso-repair.yml is removed in this evidence handoff and is not part of the final candidate tree.

## Stop

FOCUSED_CORE_REPAIR = COMPLETE
FOCUSED_BROWSER_EVIDENCE = PASS
INDEX_ENTRY_ID_VALIDATION = PASS
FORMAT_VERSION = 4
STOP -> Core / Supervisor review
