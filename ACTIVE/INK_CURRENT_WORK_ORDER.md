# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-017 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-017` |
| TITLE | `Structure-Aware Reconstruction Multi-Path Closure v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-017` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_STRUCTURE_AWARE_MULTI_PATH_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED_EXCEPT_EXECUTABLE_LOCAL_HARNESS` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |

## Accepted baseline

INK-CLOUD-016 is promoted with gate:

`PORTABLE_SHARED_CORE_INTEGRITY_WORKS`

Portable/shared-core constraints are preserved:

```text
STATIC_MODULE_CLOSURE = VERIFIED
SHARED_CORE_REUSED = VERIFIED
MANDATORY_REMOTE_DEPENDENCY = 0
SECOND_EDITOR_CORE = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
RUNTIME_QA = DEFERRED
```

The hard rose-window benchmark from INK-CLOUD-013 remains authoritative for extraction comparison:

```text
DIRECT_EXTRACTION = CURRENT_ACCEPTED_BASELINE
STRUCTURE_AWARE = CANDIDATE_REQUIRES_OVERLAY_QA

sector extraction = 265 Paths / 269 subpaths / 4 holes / 1631 nodes
retained structural prototype = 1 Path / 3 subpaths / 2 holes / 67 nodes
structure-aware recall = 0.031866
direct-extraction recall = 0.904256
```

The known defect is bounded: the current `reconstructRadial()` contract accepts one Path, while the extracted sector contains many editable Paths.

## Objective

Close the single-Path reconstruction bottleneck without redesigning the extraction stack.

Target:

```text
sector extraction
→ complete multi-Path prototype set
→ structured radial reconstruction
→ existing Repeat / Transform
→ deterministic overlay QA
→ bounded local-correction compatibility
→ fair hard-benchmark comparison
```

The purpose is to obtain a valid multi-Path Structure-Aware result. It is not to force Structure-Aware Reconstruction to replace Direct Extraction.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`
8. `research/INK_INTEGRATED_CREATIVE_LOOP_VALIDATION_REPORT_v0.1.md`
9. `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`
10. `qa/core/tests/rose-window-hard-benchmark-v0.1.mjs`
11. `qa/core/evidence/INK_CLOUD_013_ROSE_WINDOW_HARD_BENCHMARK.json`
12. `product/source/src/extraction/structure.js`
13. existing Repeat / Transform / vector serialization-rendering source only as required

## Product principle

Direct Extraction remains the production baseline during this task.

```text
MULTI_PATH_CLOSURE
≠
PIPELINE_REPLACEMENT
```

DEV may produce comparative evidence. Only MR may change the accepted extraction baseline after review.

The implementation must reuse the existing INK Path / Group / Repeat / Transform / History / Revision authorities.

## Scope

Required:

- audit the exact single-Path assumptions in Structure-Aware reconstruction and its benchmark/QA path;
- extend the reconstruction contract to accept a deterministic multi-Path prototype set while retaining single-Path compatibility where feasible;
- preserve all valid extracted prototype Paths required by the selected sector instead of selecting only the largest Path;
- represent the prototype set using existing structured vector/container primitives rather than flattening into raster or inventing a second geometry engine;
- reconstruct the prototype set through existing Repeat / Transform semantics;
- preserve stable editable Path identity inside the prototype set and deterministic generated Repeat identity;
- preserve exact extraction/source/mask provenance for the reconstructed structured result;
- verify serialization/export/render traversal required by repeat-of-prototype-set output, fixing only bounded compatibility defects;
- verify a bounded local-correction path remains possible on the editable prototype set without destructively flattening the Repeat architecture;
- update the rose-window hard benchmark so Structure-Aware metrics are measured across the complete reconstructed prototype set;
- add deterministic overlay/comparison QA that records Direct Extraction and Structure-Aware output using the same ROI, threshold and sampling contract;
- compare completeness, precision/IoU proxy, retained paths/subpaths/holes/nodes, effective expanded nodes, Repeat identity, provenance, deterministic rerun and a bounded correction-cost proxy;
- retain the canonical fixture identity and existing Direct Extraction route unchanged except for QA plumbing strictly required for fair comparison;
- run all feasible source/static/unit/serialization/integration checks;
- produce a closure report;
- keep `FORMAT_VERSION = 4`;
- do not mutate package/release artifacts.

## Phases

### Phase A — Reconstruction contract audit

Pin the current assumptions and evidence.

Required findings:

- where the prototype collapses from many Paths to one;
- which existing structured primitive should own the multi-Path prototype set;
- current Repeat source/render/export/serialization behavior for that primitive;
- exact provenance and identity requirements;
- any bounded compatibility gaps.

Checkpoint commit required.

### Phase B — Multi-Path prototype-set reconstruction

Implement a deterministic prototype-set contract.

Required:

- accept the complete valid sector Path set;
- preserve child Path structure and IDs;
- preserve Path-level extraction metadata;
- produce one linked radial reconstruction using existing Repeat / Transform semantics;
- retain compatibility with current single-Path callers unless doing so requires a broader architecture change;
- no raster flattening;
- no second vector engine.

Checkpoint commit required.

### Phase C — Structured output + local correction closure

Verify the reconstructed output remains usable as structured INK geometry.

At minimum verify:

- source prototype children remain editable Paths;
- Repeat identity is deterministic;
- expand/structured traversal retains child identities correctly;
- serialization/export required by the accepted core can represent the output;
- renderer/exporter traversal handles the prototype set without introducing a second rendering authority;
- a bounded correction to a prototype child can propagate through the linked reconstruction using existing Repeat refresh/identity semantics;
- History/Revision authority is not duplicated or bypassed.

Bounded fixes are allowed only where the multi-Path source exposes a concrete compatibility defect.

Checkpoint commit required.

### Phase D — Overlay QA + hard benchmark rerun

Use the same canonical fixture:

`qa/fixtures/rose-window/rose-window-primary.png`

Preserve:

- fixture SHA-256;
- ROI;
- threshold;
- candidate radial counts;
- sampling grid;
- Direct Extraction measurement contract.

Measure the full multi-Path Structure-Aware result rather than a single retained Path.

Evidence must include at least:

- sector prototype total vs retained path count;
- subpaths / holes / unique nodes;
- effective expanded nodes;
- raster-proxy recall / precision / IoU;
- false-positive / false-negative samples;
- selected radial count and evidence score;
- Repeat instance count / transform consistency;
- exact provenance;
- deterministic rerun;
- machine-readable comparison output.

Do not reinterpret raster-proxy metrics as semantic vector ground truth.

Checkpoint commit required.

### Phase E — Comparative decision evidence

Record a fair comparison against the currently accepted Direct Extraction baseline.

Required outcome classification:

```text
STRUCTURE_AWARE_TECHNICALLY_CLOSED = YES / NO
STRUCTURE_AWARE_BENCHMARK = IMPROVED / NOT_IMPROVED / MIXED
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
```

A weaker benchmark result is not by itself task failure if the multi-Path reconstruction contract is correctly closed and measured. Do not tune the benchmark or discard prototype Paths merely to improve the score.

Checkpoint commit required.

### Phase F — report + DEV handoff

Create:

`research/INK_STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_REPORT_v0.1.md`

Update branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

Return:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
MULTI_PATH_PROTOTYPE_SET = IMPLEMENTED
SINGLE_PATH_BOTTLENECK = CLOSED
VALID_SECTOR_PATH_RETENTION = COMPLETE
EXISTING_REPEAT_TRANSFORM = REUSED
EDITABLE_STRUCTURED_OUTPUT = VERIFIED
REPEAT_IDENTITY = DETERMINISTIC
EXACT_PROVENANCE = PRESERVED
LOCAL_CORRECTION_COMPATIBILITY = VERIFIED
OVERLAY_QA = EXECUTED
HARD_BENCHMARK_COMPARISON = RECORDED
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
MANDATORY_REMOTE_DEPENDENCY = 0
SECOND_VECTOR_ENGINE = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS`

## Explicit exclusions

Do not implement:

- broad extraction-stack redesign;
- new segmentation/model runtime;
- automatic replacement of Direct Extraction;
- semantic ground-truth annotation program;
- broad UI redesign;
- autonomous/open-ended CHAT agent execution;
- new vector/document/History/Revision/renderer authority;
- Cloud account/auth/sync/backend;
- package/release regeneration;
- final single-file `INK.html` build;
- `FORMAT_VERSION` bump.

## Hard STOP

STOP if:

1. `FORMAT_VERSION` change is required;
2. multi-Path support requires a second vector/document/History/Revision/renderer engine;
3. existing Repeat/Transform cannot represent the prototype set without a broad architecture redesign;
4. mandatory backend/remote service is required;
5. package/release mutation becomes necessary;
6. accepted Direct Extraction behavior must be broken to complete the task;
7. the canonical benchmark contract must be materially redefined rather than fairly extended;
8. a broader product/pipeline selection decision is required before implementation can continue.

## QA

GitHub Actions quota remains exhausted.

Run all feasible:

- source/static checks;
- exact changed-module syntax checks;
- focused unit tests;
- Repeat/identity tests;
- serialization/export tests affected by prototype-set traversal;
- extraction regression;
- integrated creative-loop regression affected by the change;
- deterministic rose-window hard benchmark;
- machine-readable comparison validation;
- `git diff --check`.

Never claim unexecuted browser/runtime paths pass.

`RUNTIME_QA = DEFERRED`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-017
BRANCH = work/ink-cloud-017
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
