# INK Core Spatial Index / Lasso Consistency — Supervisor Review 2026-10-02

STATUS: REVISION_REQUIRED / EVIDENCE_MISSING

Repository: `thedoorw/INK-Browser-QA`

Dispatch:
`ACTIVE/INK_CORE_SPATIAL_INDEX_LASSO_REPAIR_DEV_DISPATCH_v1.0.md`

Baseline:
`a9d122ccba14734caf6220a53044545494a8429b`

Candidate branch:
`work/core-spatial-index-lasso-repair-001`

Candidate head:
`fbe5e9a0c782198ccfa2ea1db04e7640ae97c6cc`

## 1. Product-source review

The candidate product mutation is narrowly bounded to `product/source/src/ink.js`.

Only two product lines change:

- finalized stroke creation now calls `queueSpatialObject(it.object.id)`;
- finalized Shape creation now calls `queueSpatialObject(it.object.id)`.

This is the correct mutation-lifecycle location for the reproduced stale-index defect.

The repair:
- does not call `refreshAll()` as a new blanket workaround;
- does not create a second spatial index;
- does not create a second selection authority;
- does not alter UI;
- does not alter FORMAT_VERSION;
- preserves the existing `PageSpatialIndex` / `spatialPending` incremental path.

Independent source inspection confirms `PageSpatialIndex.syncObject()` can incrementally upsert a newly created root object and falls back to a full rebuild when incremental sync is unsafe.

## 2. Existing lifecycle paths checked

The surrounding existing authority is consistent with the intended classification:

| Mutation | Existing authority / expected mode |
| --- | --- |
| Shape create | **fixed by candidate** → incremental `queueSpatialObject` |
| Stroke create | **fixed by candidate** → incremental `queueSpatialObject` |
| move | existing `queueSpatialSelection()` |
| resize | existing `queueSpatialSelection()` |
| rotate | existing `queueSpatialSelection()` |
| duplicate | existing structural `refreshAll()` → full dirty/rebuild |
| delete | existing structural `refreshAll()` → full dirty/rebuild |
| group / ungroup | existing structural `refreshAll()` → full dirty/rebuild |
| frame / reparent | explicit `spatialDirty=true` + existing refresh path |
| undo / redo / history jump | `replaceDocument(...fromHistory)` → `spatialDirty=true` + refresh |
| add/switch page | existing `refreshAll()` → page-safe full dirty/rebuild |

The pre-existing full refreshes above were not introduced by this candidate and are not reopened by this focused repair.

## 3. Focused QA runner review

The added runner:
`qa/runtime/run-ink-core-spatial-index-lasso-repair.mjs`

is materially aligned with the dispatch. It contains checks for:
- fresh Shape → native Lasso selection without manual `refreshAll()`;
- stroke creation;
- move / resize / rotate bounds;
- duplicate / delete;
- undo / redo of create/delete;
- group / ungroup;
- frame / reparent;
- page switching and cross-page leakage;
- exact index IDs / counts / dirty / pending state;
- FORMAT_VERSION = 4.

The runner design is sufficient for the required evidence **if it is actually executed against the exact candidate**.

## 4. Blocking issue — required browser evidence is absent from GitHub branch content

The candidate branch contains the runner, but not the required generated evidence.

No branch files were found for:
- `spatial-index-browser.json`;
- `shape-lasso-pass.png`;
- a DEV return/result record.

The compare from baseline to candidate contains only:
- `product/source/src/ink.js`;
- `qa/runtime/run-ink-core-spatial-index-lasso-repair.mjs`;
- `.github/workflows/ink-core-spatial-index-lasso-repair.yml`.

Therefore the Supervisor cannot verify:
- that the runner completed;
- actual PASS/FAIL count;
- actual index entry IDs/counts;
- that native Lasso selected the new Shape in the browser;
- exact tested SHA identity.

A test script is not test evidence.

## 5. GitHub Actions workflow

The candidate additionally introduces:
`.github/workflows/ink-core-spatial-index-lasso-repair.yml`.

This workflow is not required for the product repair itself.

For this project, do not make the review depend on a transient workflow artifact. Run the focused browser harness, then commit the small resulting evidence files directly to the candidate branch so GitHub source history remains sufficient for inspection.

The workflow should be removed from this candidate unless USER explicitly chooses to retain it.

## 6. Required revision

DEV should not change the two-line Core repair unless the focused run exposes a failure.

Required next step:

```text
1. execute the existing focused runner against the exact candidate SHA
2. commit spatial-index-browser.json
3. commit shape-lasso-pass.png
4. add a short DEV return with:
   - exact tested SHA
   - PASS / FAIL count
   - lifecycle/index ID summary
   - changed files
5. remove the task-specific GitHub Actions workflow unless USER explicitly retains it
6. STOP → Core / Supervisor review
```

Do not:
- add more Core changes preemptively;
- modify UI;
- touch New Document / A4;
- touch Creation / Layout workspace;
- add `refreshAll()` as a new workaround.

## Supervisor disposition

```text
CORE_REPAIR_SOURCE = PLAUSIBLE / CORRECTLY_BOUNDED
MUTATION_LIFECYCLE_LOCATION = ACCEPTED
FOCUSED_QA_DESIGN = ACCEPTED
ACTUAL_BROWSER_EVIDENCE = MISSING
CANDIDATE = REVISION_REQUIRED
FINAL_CORE_ACCEPTANCE = NOT GRANTED
```
