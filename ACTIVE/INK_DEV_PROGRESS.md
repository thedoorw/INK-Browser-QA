# INK DEV PROGRESS

STATUS: `ACTIVE / PHASE_E_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-017` |
| TITLE | `Structure-Aware Reconstruction Multi-Path Closure v0.1` |
| BRANCH | `work/ink-cloud-017` |
| BASE_MAIN | `38ae99eb391eb70c7e9ebe35b69ce3fdb210a28e` |
| TASK_STATUS | `ACTIVE / PHASE_E_COMPLETE` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS` |
| DIRECT_EXTRACTION_BASELINE | `PRESERVE` |
| PIPELINE_SELECTION | `MR_DECISION_REQUIRED` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED` |

## Objective

```text
sector extraction
→ complete multi-Path prototype set
→ existing Repeat / Transform
→ overlay QA
→ bounded local correction
→ hard-benchmark comparison
```

## Checkpoints

### Phase A — Reconstruction contract audit
- Status: `COMPLETE`
- Checkpoint: `0a56b3389ca4372028628ea488d58cc8560a8e50`
- Pinned the benchmark largest-Path collapse, Path-only reconstruction guard,
  Group ownership, existing Repeat/Transform capability, provenance contract and
  bounded workspace traversal gap.

### Phase B — Multi-Path prototype-set reconstruction
- Status: `COMPLETE`
- Checkpoint: `f942f2b423908f97ef301e0f179531d37945c8d5`
- Added deterministic Group-backed prototype sets and Path-array support while
  retaining single-Path compatibility.
- Preserves child Path IDs/metadata, linked Repeat identity and exact extraction
  provenance; no flattening or second vector engine.

### Phase C — Structured output + local correction closure
- Status: `COMPLETE`\n- Checkpoint: `a781b7dce261c8843f223d01ffc463e0e451dc16`
- Bounded workspace compatibility fix adds existing Repeat traversal to:
  - canvas renderer;
  - world-bounds traversal;
  - container-style hit testing;
  - workspace SVG export.
- Reuses `repeatTransforms()`, `vectorObjectToSVG()` and recursive
  `drawObject()`; no renderer authority is duplicated.
- Focused multi-Path QA verifies:
  - source prototype children remain editable Paths;
  - source Path IDs remain stable;
  - generated expanded child IDs are deterministic;
  - a bounded child-anchor correction propagates through linked Repeat
    instances while Repeat instance IDs remain stable;
  - JSON/migration/integrity accepts Repeat-of-Group;
  - SVG structured traversal emits all repeated Paths.
- Added a workspace source-contract regression for renderer/bounds/hit/export
  Repeat traversal.

Files changed through Phase C:
- `product/source/src/extraction/structure.js`
- `product/source/src/ink.js`
- `qa/core/tests/unit/extraction-structure-v0.1.test.mjs`
- `qa/core/tests/unit/extraction-structure-workspace-source-v0.1.test.mjs`
- `ACTIVE/INK_DEV_PROGRESS.md`

Checks pending executable validation:
- changed-module syntax;
- focused unit regression;
- serialization/export regression;
- extraction/integrated regressions;
- hard benchmark;
- comparison evidence;
- diff whitespace check.

Browser/runtime QA remains `DEFERRED`.

## Planned phases
- Phase A — Reconstruction contract audit — `COMPLETE`
- Phase B — Multi-Path prototype-set reconstruction — `COMPLETE`
- Phase C — Structured output + local correction closure — `COMPLETE`
- Phase D — Overlay QA + hard benchmark rerun — `HARNESS_READY / EXECUTION_DEFERRED_BY_ENVIRONMENT`
- Phase E — Comparative decision evidence — `COMPLETE`
- Phase F — report + DEV handoff

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-017
BRANCH = work/ink-cloud-017
FINAL_HEAD = <exact SHA>
GATE = STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Phase D harness checkpoint

Status: `READY_FOR_EXECUTION / CHECKPOINT_COMMIT_CONTAINS_THIS_RECORD`

The canonical hard-benchmark runner now:

- passes all sector `prototype.paths` into `reconstructRadial()`;
- samples the complete Group-backed prototype set through the same Repeat
  transforms;
- preserves the original fixture SHA, ROI, threshold, candidate counts, grid
  step and Direct Extraction route;
- records complete retained Path/subpath/hole/node counts;
- records effective expanded nodes, stable Repeat instance IDs and exact
  transforms;
- verifies exact Path-level extraction provenance;
- records deterministic rerun status;
- records same-coordinate overlay raster-proxy recall/precision/IoU and
  false-positive/false-negative samples;
- records a bounded two-component correction-cost proxy without choosing a
  pipeline.

No old benchmark assertion requiring Structure-Aware recall < 0.1 remains.
A weaker result is recordable and does not auto-fail the technical contract.


## Executed QA checkpoint

Executed against exact GitHub branch source:

- changed-module syntax parse:
  - `product/source/src/extraction/structure.js` — PASS
  - `product/source/src/ink.js` — PASS
  - `qa/core/tests/unit/extraction-structure-v0.1.test.mjs` — PASS
  - `qa/core/tests/unit/extraction-structure-workspace-source-v0.1.test.mjs` — PASS
  - `qa/core/tests/rose-window-hard-benchmark-v0.1.mjs` — PASS as module syntax
- focused multi-Path execution using exact Structure/Repeat/vector source:
  `FOCUSED_MULTI_PATH_UNIT = PASS`;
- Repeat instance IDs remain stable across bounded prototype-child correction;
- expanded generated child IDs remain deterministic;
- local correction propagates through linked reconstruction;
- structured SVG export traverses Repeat-of-Group correctly;
- JSON serialization roundtrip preserves prototype Path IDs and Repeat IDs;
- workspace renderer/bounds/hit/export Repeat source contract — PASS;
- `FORMAT_VERSION = 4` — PASS.

Authoritative branch/base SHA equality confirms the following are unchanged:

- Direct Extraction core;
- extraction adapters;
- vector/Repeat engine;
- migration/integrity serialization authority;
- History;
- Revision;
- integrated creative-loop test.

Branch scope compare from base main:

```text
ahead = 4
behind = 0
changed files = 6
package/release mutation = 0
main merge = 0
```

Local Git checkout was attempted and failed before checkout because the execution
environment cannot resolve `github.com`. The two pre-existing local INK ZIP
packages were inspected only for a byte-identical cache of the canonical
rose-window fixture; neither contains that fixture.

Therefore the canonical deterministic rose-window harness is committed and
ready, but the 2.97 MB binary fixture cannot be materialized in the current
execution environment. Per the user's explicit instruction, no external browser
workaround is used and no unexecuted benchmark result is claimed.

```text
RUNTIME_QA = DEFERRED
ROSE_WINDOW_HARD_BENCHMARK_RERUN = NOT_EXECUTED_ENVIRONMENT
OVERLAY_QA_HARNESS = READY
NEW_STRUCTURE_AWARE_METRICS = NOT_CLAIMED
```

## Phase E — Comparative decision evidence

Status: `COMPLETE / CHECKPOINT_COMMIT_CONTAINS_THIS_RECORD`

```text
STRUCTURE_AWARE_TECHNICALLY_CLOSED = YES
STRUCTURE_AWARE_BENCHMARK = NOT_EVALUATED_CURRENT_ENVIRONMENT
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
```

The original INK-CLOUD-013 benchmark remains the only executed canonical
rose-window comparison evidence. No DEV-side pipeline replacement is authorized.
