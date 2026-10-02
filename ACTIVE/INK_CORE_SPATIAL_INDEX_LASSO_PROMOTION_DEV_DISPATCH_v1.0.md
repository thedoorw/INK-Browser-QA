# INK Core Spatial Index / Lasso Repair — Promotion DEV Dispatch v1.0

STATUS: ACTIVE / PROMOTION-ONLY
DATE: 2026-10-02
REPOSITORY: thedoorw/INK-Browser-QA
SSOT: GitHub

## 1. Purpose

Promote the already Supervisor-accepted Core spatial-index / Lasso repair onto the current `main` line without importing unrelated branch history.

This is **not** a new Core repair task.

Accepted source branch:
`work/core-spatial-index-lasso-repair-001`

Accepted final branch HEAD:
`7913b332247c0892928501761975bf59d96e3885`

Exact browser-tested SHA:
`864e72d5aa6b37ca5625c9ea3634fa506ea6b644`

Supervisor review:
`working/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_SUPERVISOR_REVIEW_20261002.md`

Current main baseline when this promotion package was prepared:
`3267b27d60b8bb9fd99f96f29a69b050dc0bee16`

## 2. Promotion strategy

Do **not** merge the old work branch wholesale.

Create a fresh promotion branch from current main:

`work/core-spatial-index-lasso-promotion-001`

Then replay only the accepted final delta.

Required product mutation on current main:

`product/source/src/ink.js`

Only these two semantic changes are authorized:

```text
finalized Stroke creation
→ after document commit, queueSpatialObject(it.object.id)

finalized Shape creation
→ after document commit, queueSpatialObject(it.object.id)
```

Current main has been checked and still contains the pre-repair forms at these lifecycle points, so the accepted two-line repair is applicable without redesign.

## 3. Evidence / QA files to carry forward

Carry forward the accepted focused QA assets as provenance:

- `qa/runtime/run-ink-core-spatial-index-lasso-repair.mjs`
- `qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/spatial-index-browser.json`
- `qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/shape-lasso-pass.png`
- `working/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_RETURN_20261002.md`

Do not reintroduce:
`.github/workflows/ink-core-spatial-index-lasso-repair.yml`

## 4. Required current-main verification

After replaying the accepted delta on the fresh promotion branch:

1. confirm `git diff` contains no unrelated product mutation;
2. confirm `FORMAT_VERSION = 4`;
3. run the existing focused browser runner against the promotion branch;
4. require all existing 33 checks to PASS;
5. confirm fresh Shape → native Lasso still works without manual `refreshAll()`;
6. confirm exact-ID lifecycle checks still cover:
   - create;
   - move;
   - resize;
   - rotate;
   - duplicate;
   - delete;
   - undo / redo;
   - group / ungroup;
   - frame / reparent;
   - page switch;
7. verify no UI / New Document / workspace source files changed.

If current-main replay changes the generated evidence identity, write a **new** evidence directory keyed to the promotion-tested SHA. Do not overwrite the historical accepted evidence.

## 5. Hard boundaries

Do not:
- redesign the spatial index;
- add new `refreshAll()` calls;
- create another selection authority;
- alter UI;
- alter New Document / A4;
- alter Creation / Layout workspace;
- alter History semantics;
- alter FORMAT_VERSION;
- combine post-SUP11 UI candidate work into this promotion;
- merge the divergent repair branch wholesale.

If the two-line replay no longer applies cleanly because current main changed at the same lifecycle points, STOP and return the conflict for Supervisor review instead of resolving it speculatively.

## 6. Required return

Return:

```text
PROMOTION_BASE_SHA
PROMOTION_BRANCH
PROMOTION_CANDIDATE_SHA
CHANGED_PRODUCT_FILES
EVIDENCE_FILES
FOCUSED_BROWSER_PASS_COUNT
FORMAT_VERSION
UNRELATED_PRODUCT_MUTATION = NONE
OLD_WORK_BRANCH_WHOLESALE_MERGE = NO
TASK_WORKFLOW_REINTRODUCED = NO
```

Then STOP → Core / Supervisor review.

Do not merge to main and do not delete the old repair branch until Supervisor confirms the promotion candidate.
