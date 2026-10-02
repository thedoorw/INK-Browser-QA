# INK Core Spatial Index / Lasso Repair — Promotion DEV Return 2026-10-02

STATUS: FOCUSED_BROWSER_PASS / READY_FOR_CORE_SUPERVISOR_REVIEW

PROMOTION_BASE_SHA = 3c9b7c63bdb48b5c5ff6947a4ddccd7bb2959434
PROMOTION_BRANCH = work/core-spatial-index-lasso-promotion-001
PROMOTION_CANDIDATE_SHA = 66cdb5b4ddc322a2b1027cab2627426f868027d3
CHANGED_PRODUCT_FILES = product/source/src/ink.js
EVIDENCE_FILES = qa/evidence/ink-core-spatial-index-lasso-repair-66cdb5b4ddc3/spatial-index-browser.json ; qa/evidence/ink-core-spatial-index-lasso-repair-66cdb5b4ddc3/shape-lasso-pass.png
FOCUSED_BROWSER_PASS_COUNT = 33 / 33 PASS
FORMAT_VERSION = 4
UNRELATED_PRODUCT_MUTATION = NONE
OLD_WORK_BRANCH_WHOLESALE_MERGE = NO
TASK_WORKFLOW_REINTRODUCED = NO

Accepted Core delta replayed on current main only:
- finalized Stroke creation queues queueSpatialObject(it.object.id) after document commit;
- finalized Shape creation queues queueSpatialObject(it.object.id) after document commit.

Fresh Shape -> native Lasso passes without manual refreshAll().
Exact-ID lifecycle coverage passes for create, move, resize, rotate, duplicate, delete, undo/redo, group/ungroup, frame/reparent, and page switch.
No UI, New Document/A4, Creation/Layout workspace, History semantic, or FORMAT_VERSION mutation.

Historical accepted evidence remains unchanged and is carried as provenance.
Fresh promotion evidence is stored separately under the candidate-keyed directory.

STOP -> Core / Supervisor review
