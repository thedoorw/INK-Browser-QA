# INK Core Spatial Index / Lasso Consistency — Supervisor Review 2026-10-02

STATUS: FINAL_CORE_ACCEPTANCE / PASS

Repository: `thedoorw/INK-Browser-QA`

Dispatch:
`ACTIVE/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_DISPATCH_v1.0.md`

Baseline:
`a9d122ccba14734caf6220a53044545494a8429b`

Candidate branch:
`work/core-spatial-index-lasso-repair-001`

Final candidate HEAD:
`7913b332247c0892928501761975bf59d96e3885`

Exact browser-tested SHA:
`864e72d5aa6b37ca5625c9ea3634fa506ea6b644`

Focused browser result:
`33 / 33 PASS`

## 1. Product-source review

The final candidate remains narrowly bounded to `product/source/src/ink.js`.

Only two product lines differ from baseline:

- finalized Stroke creation now calls `queueSpatialObject(it.object.id)`;
- finalized Shape creation now calls `queueSpatialObject(it.object.id)`.

This is the accepted mutation-lifecycle location for the reproduced stale-index defect.

The repair:
- does not add `refreshAll()` as a blanket workaround;
- does not create a second spatial index;
- does not create a second selection authority;
- does not alter UI;
- does not touch New Document / A4;
- does not touch Creation / Layout workspace;
- preserves `FORMAT_VERSION = 4`;
- preserves the existing `PageSpatialIndex` / `spatialPending` incremental authority.

## 2. Exact tested-SHA identity

The focused runner executed against:

`864e72d5aa6b37ca5625c9ea3634fa506ea6b644`

and produced:

`33 / 33 PASS`

The final branch HEAD is:

`7913b332247c0892928501761975bf59d96e3885`

Comparison from the tested SHA to final HEAD shows no product-source or runner mutation.

Only the following changed after the exact browser run:
- committed JSON evidence added;
- committed PNG evidence added;
- DEV return added;
- task-specific GitHub Actions workflow removed.

Therefore the final candidate contains the same tested product and focused-runner bytes.

## 3. Committed browser evidence

The branch now contains:

- `qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/spatial-index-browser.json`;
- `qa/evidence/ink-core-spatial-index-lasso-repair-864e72d5aa6b/shape-lasso-pass.png`;
- `working/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_RETURN_20261002.md`.

The JSON records:
- status `PASS`;
- `33 / 33` focused checks passing;
- zero failures;
- `FORMAT_VERSION = 4`;
- exact tested SHA identity;
- exact index entry IDs, counts, dirty state and pending IDs across lifecycle mutations.

## 4. Required lifecycle acceptance

Focused browser evidence closes the dispatch requirements:

| Mutation / state | Supervisor result |
| --- | --- |
| fresh Shape create → native Lasso | PASS |
| Stroke create | PASS |
| move | PASS |
| resize | PASS |
| rotate | PASS |
| duplicate | PASS |
| delete | PASS |
| undo / redo creation | PASS |
| undo / redo deletion | PASS |
| group / ungroup | PASS |
| frame / reparent | PASS |
| page switch / cross-page leakage | PASS |
| exact index entry IDs / counts | PASS |
| FORMAT_VERSION = 4 | PASS |

Critical reproduced defect is closed:

```text
fresh Shape creation
→ document contains Shape
→ exact Shape ID enters spatialPending
→ native Lasso query consumes pending ID incrementally
→ same Shape ID enters spatial index
→ Shape is selected
→ no manual refreshAll()
```

The fresh Shape path changes:
- index count: `0 → 1`;
- incremental updates: `0 → 1`;
- full rebuild count remains unchanged for that incremental synchronization.

## 5. Structural lifecycle review

The evidence confirms the surrounding existing lifecycle remains coherent:

- move / resize / rotate use exact-ID incremental synchronization;
- duplicate / delete use the pre-existing structural dirty/rebuild path;
- undo / redo restore/remove exact IDs through document replacement and rebuild;
- group / ungroup and frame / reparent preserve expected hierarchy/index IDs;
- page switching rebuilds against the active page and does not leak previous-page entries.

No additional Core repair is required by this package.

## 6. GitHub Actions cleanup

The task-specific workflow:

`.github/workflows/ink-core-spatial-index-lasso-repair.yml`

is absent from the final candidate tree.

Review no longer depends on a transient workflow artifact; the required JSON and PNG are committed to GitHub source history.

## 7. Final candidate diff

Baseline → final candidate contains only:

- `product/source/src/ink.js` — accepted two-line Core repair;
- `qa/runtime/run-ink-core-spatial-index-lasso-repair.mjs` — focused browser runner;
- committed JSON evidence;
- committed PNG evidence;
- DEV return.

No unrelated Core, UI, New Document/A4, or workspace mutation is present.

## Supervisor disposition

```text
CORE_REPAIR_SOURCE = PASS
MUTATION_LIFECYCLE_LOCATION = ACCEPTED
FOCUSED_QA_DESIGN = PASS
ACTUAL_BROWSER_EVIDENCE = 33 / 33 PASS
INDEX_ENTRY_ID_VALIDATION = PASS
TESTED_SHA_IDENTITY_CHAIN = PASS
TASK_WORKFLOW_REMOVED = YES
FORMAT_VERSION = 4
FINAL_CORE_ACCEPTANCE = GRANTED
CANDIDATE = ACCEPTED / NOT_MERGED
NEXT_ACTION = USER / PROMOTION_DECISION
STOP = TRUE
```
