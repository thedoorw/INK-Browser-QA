# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-007 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-007` |
| TITLE | `Rose Window Extraction Benchmark + Reference-to-Path Technical Prototype v0.1` |
| AUTHORITY | `USER_EXPLICIT_DEVELOPMENT_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-007` |
| DEV_MODE | `LONG_SEQUENCE_WORKPACK` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CLOUD_SCOPE | `BOUNDED_EXTRACTION_WORKSPACE / NO_GENERIC_PLATFORM` |
| RUNTIME_QA | `DEFERRED` |

## Product objective

The current highest-priority INK Cloud creative loop remains:

```text
Reference → Extract → Path → Edit → Compose → Repaint → CHAT Review → Revision
```

This Work Order implements only the first technical slice:

```text
Reference → Extract → editable Path
```

Do not expand into Compose, Repaint, CHAT mutation or broad Cloud platform features.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`
8. `research/INK_EXTRACTION_TECHNOLOGY_SURVEY_v0.1.md`

Read additional source/governance only when implementation requires it.

## Primary benchmark

Canonical first hard reference:

`CASE_A_PRIMARY / STRUCTURE_AWARE_HARD_REFERENCE`

User-provided image identity:

`ChatGPT Image 2026年6月26日 上午06_44_33.png`

Observed metadata:

`1086 × 1448 / RGBA`

The image is a near-frontal Gothic tracery/rose-window composition with strong radial repetition and dense nested contours.

If the binary fixture is not yet available in the repo, establish a documented fixture intake path and do not substitute a materially easier benchmark without recording it.

## Technical candidates

Benchmark and integrate only after license/runtime verification:

- SAM-class segmentation: semantic mask candidate;
- OpenCV.js: preprocessing, contour hierarchy, approximation, perspective/geometric evidence;
- VTracer: primary raster-to-vector candidate;
- ImageTracerJS: lightweight browser baseline/fallback;
- Potrace: quality benchmark only unless separate GPL decision;
- existing INK Path / Repeat / Transform / History remain authoritative.

Do not introduce a second vector engine, hierarchy, transform system, History engine or renderer.

## Long Sequence phases

### Phase A — Benchmark harness and fixture contract

Create deterministic benchmark tooling/data contract for:

- source image identity;
- extraction parameters;
- mask/contour/vector outputs;
- timing and node counts;
- topology/hole diagnostics;
- overlay/comparison evidence;
- reproducible result records.

Checkpoint commit required.

### Phase B — Direct extraction baselines

Implement/evaluate at minimum feasible candidates:

1. OpenCV contour/hierarchy baseline;
2. VTracer direct vectorization;
3. ImageTracerJS baseline if technically appropriate.

Record actual executed evidence; do not claim unavailable dependency results.

Checkpoint commit required.

### Phase C — Segmentation-assisted and structure-aware route

Establish adapter boundary for semantic mask input.

If a SAM-class runtime can be integrated within reasonable browser/repo constraints, benchmark it. If model/runtime size prevents bounded integration, implement the adapter contract and document the exact blocker rather than inventing PASS evidence.

Implement rose-window structural analysis sufficient to test:

- dominant center/rings where detectable;
- radial/repeated motif evidence;
- representative prototype candidate;
- Repeat/Transform reconstruction using existing INK structures.

Checkpoint commit required.

### Phase D — Reference → editable Path vertical slice

Integrate the strongest evidence-supported route into shared INK/editor code:

- import/reference object boundary;
- extraction invocation;
- conversion to authoritative editable INK Path;
- original/path overlay;
- local correction-ready output;
- History integration;
- save/load/serialization integrity;
- stable provenance from reference to extracted path.

No broad UI. Minimum controls/diagnostics only.

Checkpoint commit required.

### Phase E — Selection report and handoff

Create:

`research/INK_EXTRACTION_PIPELINE_SELECTION_REPORT_v0.1.md`

Report:

- candidates actually tested;
- versions/licenses;
- benchmark fixture identities;
- metrics/results;
- direct trace vs structure-aware comparison;
- selected pipeline and fallback;
- browser/portable implications;
- tests executed;
- tests authored but not executed;
- runtime debt;
- known limitations;
- exact final branch HEAD.

## Evaluation criteria

Do not select by visual similarity alone.

Measure:

- contour completeness;
- missing/false contours;
- topology and hole nesting;
- unnecessary node density;
- curve fidelity;
- radial symmetry error;
- repeated motif consistency;
- editability;
- correction cost;
- determinism;
- latency/memory where measurable;
- browser feasibility;
- license suitability;
- portability toward single `INK.html`.

## Compatibility requirements

Protect accepted:

- FORMAT_VERSION 4 unless MR explicitly decides otherwise;
- Frame/Group/ownership;
- Transform/bounds/singular guards;
- Component/Instance;
- Repeat identity;
- History;
- native save/load;
- InkStore;
- structured SVG;
- assetManifest;
- portable shared-core direction.

If FORMAT_VERSION change or accepted structural contract break becomes necessary:

`STOP / MR_DECISION_REQUIRED`.

## Explicit exclusions

Do not implement:

- generic Cloud backend;
- auth/accounts;
- remote persistence service;
- permissions;
- collaboration/presence;
- Compose/Repaint workflow;
- CHAT edit execution;
- full Auto Layout;
- package update;
- single-file packaging;
- release/version certification.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

All feasible source/static/unit/serialization/benchmark checks must be executed in the active environment. Never report an unexecuted check as PASS.

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-007
BRANCH = work/ink-cloud-007
BENCHMARK = EXECUTED_WITH_RECORDED_EVIDENCE
REFERENCE_TO_PATH = TECHNICAL_VERTICAL_SLICE_COMPLETE
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
