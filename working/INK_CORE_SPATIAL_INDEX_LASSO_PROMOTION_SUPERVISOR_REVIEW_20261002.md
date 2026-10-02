# INK Core Spatial Index / Lasso Promotion — Supervisor Review 2026-10-02

STATUS: ACCEPTED_FOR_MAIN_INTEGRATION

Repository: `thedoorw/INK-Browser-QA`

Promotion base:
`3c9b7c63bdb48b5c5ff6947a4ddccd7bb2959434`

Promotion branch:
`work/core-spatial-index-lasso-promotion-001`

Exact browser-tested candidate:
`66cdb5b4ddc322a2b1027cab2627426f868027d3`

Promotion branch final HEAD:
`f6d03f5be538f2ad2624cac7d3bd9e94402c95c0`

Authority:
- `ACTIVE/INK_CORE_SPATIAL_INDEX_LASSO_PROMOTION_DEV_DISPATCH_v1.0.md`
- `working/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_SUPERVISOR_REVIEW_20261002.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`

## 1. Product-delta review

Base → exact tested candidate changes product source only in:

- `product/source/src/ink.js`

The product mutation is the accepted two lifecycle notifications only:

- finalized Stroke creation → `queueSpatialObject(it.object.id)`;
- finalized Shape creation → `queueSpatialObject(it.object.id)`.

No UI, New Document / A4, Creation / Layout workspace, History semantic or FORMAT_VERSION product mutation is present.

The remaining Base → candidate files are the explicitly authorized carried QA/evidence provenance:
- focused browser runner;
- historical accepted evidence;
- historical DEV return.

No task-specific GitHub Actions workflow is present in the promotion delta.

## 2. Exact tested evidence

Fresh promotion evidence:
- `qa/evidence/ink-core-spatial-index-lasso-repair-66cdb5b4ddc3/spatial-index-browser.json`
- `qa/evidence/ink-core-spatial-index-lasso-repair-66cdb5b4ddc3/shape-lasso-pass.png`

The JSON identifies:
- `targetSha = 66cdb5b4ddc322a2b1027cab2627426f868027d3`;
- `status = PASS`;
- `checks = 33`;
- `passed = 33`;
- `failures = []`;
- `formatVersion = 4`;
- `centralRuntimeExecuted = false`.

Coverage includes:
- Shape create → native Lasso without `refreshAll()`;
- Stroke create;
- move / resize / rotate;
- duplicate / delete;
- undo / redo;
- group / ungroup;
- frame / reparent;
- page switch and cross-page index isolation.

Disposition:
```text
FOCUSED_BROWSER = 33 / 33 PASS
FORMAT_VERSION = 4
EXACT_TESTED_SHA = 66cdb5b4ddc322a2b1027cab2627426f868027d3
CORE_PROMOTION_DELTA = ACCEPTED
```

## 3. Candidate → final branch HEAD

`66cdb5b4...` → `f6d03f5...` adds only:
- fresh promotion evidence JSON;
- fresh promotion PNG;
- `working/INK_CORE_SPATIAL_INDEX_LASSO_PROMOTION_DEV_RETURN_20261002.md`.

No product source changes occur after the exact tested candidate.

Therefore the final branch HEAD carries the tested product bytes unchanged.

## 4. Current-main movement during DEV execution

Current `main` advanced after the promotion branch was created.

Intervening main commits:
- `1afa015ad04aba7f836147d091eda6cef0c9225f` — records C04 圖紙 / 手繪板 workspace-switch gap;
- `90efb3654d1b006d2a62accad3416c851ec2bd1a` — records C06 12800% zoom gap.

Both commits modify only:
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`.

No product source changed on main after promotion base `3c9b7c63...`.

This is a documentation-only branch divergence, not a Core composition divergence.

## 5. Supervisor disposition

```text
CORE_PROMOTION_SUPERVISOR_REVIEW = ACCEPTED
PROMOTION_BRANCH = ACCEPTED_FOR_MAIN_INTEGRATION
EXACT_TESTED_PRODUCT_SHA = 66cdb5b4ddc322a2b1027cab2627426f868027d3
FINAL_BRANCH_HEAD = f6d03f5be538f2ad2624cac7d3bd9e94402c95c0
UNRELATED_PRODUCT_MUTATION = NONE
TASK_WORKFLOW_REINTRODUCED = NO
OLD_REPAIR_BRANCH_WHOLESALE_MERGE = NO
FORMAT_VERSION = 4
```

## 6. Required main integration

Next owner may integrate the accepted promotion branch onto the latest `main`, preserving the two newer Current Work Order commits.

Required guard:

```text
latest main
+ accepted promotion branch final HEAD
→ no product conflict resolution
→ final product/source tree must equal the exact tested candidate product/source tree
→ if product/source differs, STOP and rerun focused browser evidence
```

A documentation-only merge SHA difference does not require repeating the 33 browser checks if the complete `product/source` tree is byte-identical to the exact tested candidate. Record that identity explicitly after integration.

Do not fold the separate post-SUP11 UI candidate, C04 workspace repair, C06 zoom expansion or New Document work into this Core merge.

## 7. After Core reaches main

Immediate follow-up:
1. record Core promotion as integrated in `ACTIVE/INK_CURRENT_WORK_ORDER.md`;
2. keep C04 and C06 open as separate capability/UI work;
3. keep the accepted post-SUP11 UI candidate separate;
4. no New Document product mutation without the existing USER decision gate.

The next UI/Core implementation package requires its own current-main dispatch.