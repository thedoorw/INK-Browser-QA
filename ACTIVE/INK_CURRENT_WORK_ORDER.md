# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-007 / ENGINE_FIRST DEVELOPMENT`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-007` |
| TITLE | `Extraction Engine + Reference-to-Path Technical Prototype v0.1` |
| AUTHORITY | `USER_EXPLICIT_DEVELOPMENT_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-007` |
| DEV_MODE | `LONG_SEQUENCE_WORKPACK` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CLOUD_SCOPE | `BOUNDED_EXTRACTION_WORKSPACE / NO_GENERIC_PLATFORM` |
| DEVELOPMENT_ORDER | `ENGINE_FIRST / BENCHMARK_AFTER` |
| RUNTIME_QA | `DEFERRED` |

## Product objective

The current highest-priority INK Cloud creative loop remains:

```text
Reference → Extract → Path → Edit → Compose → Repaint → CHAT Review → Revision
```

This Work Order implements only:

```text
Reference → Extract → editable Path
```

The extraction capability is the product under construction. The rose-window image is a later hard benchmark, not a prerequisite for building the engine.

## Engine-first principle

Build the car before choosing the road.

Development must not block on obtaining, uploading, hashing, or normalizing the user rose-window fixture.

The required order is:

```text
Extraction core / adapters
→ INK Path conversion
→ deterministic engineering fixtures
→ History / serialization / overlay contract
→ hard rose-window benchmark
→ direct-vs-structure-aware comparison
→ pipeline selection
```

If the user benchmark binary is unavailable, continue all engineering work that does not require it.

Do not spend extended time waiting for a binary fixture, external model download, or remote runtime. Record the blocker and proceed with available bounded work.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_EXTRACTION_TECHNOLOGY_SURVEY_v0.1.md`
8. `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`

## Technical candidates

Evaluate and integrate only after license/runtime verification:

- OpenCV.js — contour/hierarchy/geometry preprocessing candidate;
- VTracer — primary raster-to-vector candidate;
- ImageTracerJS — lightweight browser baseline/fallback;
- SAM-class segmentation — optional semantic mask adapter, not an engine-start blocker;
- Potrace — benchmark reference only unless separate GPL decision;
- existing INK Path / Repeat / Transform / History remain authoritative.

No second vector engine, hierarchy, transform system, History engine or renderer.

## Long Sequence phases

### Phase A — Extraction core and adapter contracts

Implement the engine scaffolding first.

Required:

- extraction request/result contract;
- raster/reference input boundary;
- optional mask input boundary;
- contour/vector adapter interface;
- normalized editable-path result contract;
- provenance metadata;
- deterministic diagnostics;
- failure/cancel behavior;
- no dependency on the rose-window fixture.

Use small deterministic repo fixtures or generated geometric fixtures for engineering tests.

Checkpoint commit required.

### Phase B — Direct extraction implementations

Implement the strongest feasible direct routes:

1. OpenCV contour/hierarchy adapter where feasible;
2. VTracer adapter where feasible;
3. ImageTracerJS baseline/fallback where appropriate.

Requirements:

- external dependency failures must not stall the whole workpack;
- unavailable runtimes are recorded as blockers;
- at least one executable baseline must reach authoritative INK Path conversion;
- no benchmark-specific hardcoding.

Checkpoint commit required.

### Phase C — INK Path vertical slice

Integrate:

```text
Reference / raster
→ extraction adapter
→ authoritative editable INK Path
```

Required:

- path/node geometry uses existing INK vector model;
- History integration;
- save/load and serialization integrity;
- reference-to-path provenance;
- overlay/comparison boundary;
- local correction-ready output;
- minimum diagnostics/control surface only.

This phase must be testable without the user rose-window fixture.

Checkpoint commit required.

### Phase D — Structure-aware extraction layer

Add reusable structure reasoning support, not rose-window-only code.

Establish reusable evidence/adapter contracts for:

- center/ring candidates;
- radial repetition;
- repeated motif/prototype candidates;
- Repeat / Transform reconstruction;
- optional semantic segmentation input.

A SAM-class runtime may be benchmarked if practical, but large model/runtime acquisition must not block completion. An adapter contract plus documented blocker is acceptable when runtime integration is not bounded.

Checkpoint commit required.

### Phase E — Hard benchmark — DEFERRED

The formal rose-window benchmark is explicitly deferred by user decision. Do not execute it in INK-CLOUD-007.

Canonical benchmark:

`CASE_A_PRIMARY / STRUCTURE_AWARE_HARD_REFERENCE`

User image identity:

`ChatGPT Image 2026年6月26日 上午06_44_33.png`

If binary intake is unavailable, mark:

`HARD_BENCHMARK = DEFERRED_BY_USER_DECISION`

and hand off the completed engine with available engineering evidence.

Compare:

A. Direct extraction  
B. AI/structure-aware INK reconstruction

Record:

- contour completeness;
- topology/hole nesting;
- false/missing contours;
- node density;
- curve fidelity;
- symmetry/repetition consistency;
- correction cost;
- latency/memory where measurable;
- browser feasibility;
- license/portable implications.

Checkpoint commit required when executed.

### Phase F — Selection report and handoff

Create:

`research/INK_EXTRACTION_PIPELINE_SELECTION_REPORT_v0.1.md`

Report separately:

1. engine capability actually implemented;
2. engineering tests actually executed;
3. external adapters tested/not tested;
4. hard benchmark executed or blocked;
5. direct-vs-structure-aware evidence if available;
6. selected current pipeline and fallback;
7. unresolved benchmark/runtime debt;
8. exact final branch HEAD.

## Acceptance

MR must be able to verify at minimum:

1. extraction core exists independently of the benchmark image;
2. at least one extraction route converts deterministic raster/contour input into editable INK Path;
3. existing INK vector/History/serialization contracts are reused;
4. extraction result retains source/provenance identity;
5. failures do not leave partial History or corrupted document state;
6. no second core engine was created;
7. rose-window-specific logic is not baked into generic extraction core;
8. hard benchmark status is explicit: `DEFERRED_BY_USER_DECISION`;
9. FORMAT_VERSION remains 4 unless MR explicitly approves otherwise;
10. package/main remain untouched by DEV.

## Explicit exclusions

Do not implement:

- generic Cloud backend;
- auth/accounts;
- remote persistence service;
- permissions;
- collaboration/presence;
- Compose/Repaint;
- CHAT edit execution;
- full Auto Layout;
- package update;
- single-file packaging;
- release/version certification.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run all feasible source/static/unit/serialization/engine tests locally/in the active environment.

Never claim an unexecuted test or unavailable external runtime as PASS.

## Hard STOP

STOP only if:

1. FORMAT_VERSION change is required;
2. accepted Frame/Group/Ownership/Transform/Component/History contract must be broken;
3. a second vector/hierarchy/transform/renderer/History engine becomes necessary;
4. scope must expand beyond this Work Order.

A missing rose-window binary, unavailable SAM model, or unavailable external tracer is **not** a hard STOP; document and continue.

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-007
BRANCH = work/ink-cloud-007
EXTRACTION_ENGINE = IMPLEMENTED
REFERENCE_TO_PATH = TECHNICAL_VERTICAL_SLICE_COMPLETE
HARD_BENCHMARK = DEFERRED_BY_USER_DECISION
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## User benchmark deferral decision

The user explicitly chose to postpone the rose-window hard benchmark so development can continue toward the full creative loop.

Current rule:

```text
HARD_BENCHMARK = DEFERRED_BY_USER_DECISION
INK-CLOUD-007 = ENGINE_COMPLETION + REPORT + HANDOFF
NEXT_PRODUCT_STAGE_AFTER_MR = PATH_EDITING + EXPRESSIVE_STROKE
```

DEV must not spend time on the rose-window benchmark in this Work Order.


## MR Review — INK-CLOUD-007

Reviewed HEAD:

`b006a3a7dadc5d261e3dda5b377f61ec13221ddb`

Decision:

`MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

Accepted bounded result:

```text
Extraction engine = IMPLEMENTED
Reference → editable Path = TECHNICAL_VERTICAL_SLICE_COMPLETE
Structure-aware radial/Repeat candidate = IMPLEMENTED
Hard rose-window benchmark = DEFERRED_BY_USER_DECISION
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
```

DEV remains stopped.

The branch is diverged from current main; do not merge it directly. Any promotion must be performed from current main using a bounded promotion branch and requires explicit user approval.

Next action:

`USER_PROMOTION_DECISION`


## Main Promotion — INK-CLOUD-007

User authorized clean promotion.

Promotion branch:

`promote/ink-cloud-007`

Reviewed DEV HEAD:

`b006a3a7dadc5d261e3dda5b377f61ec13221ddb`

Promotion payload commit:

`1823a5b523cb6da8182b5356361ea526ec3ccc35`

PR:

`#8`

Main merge commit:

`59d8cbfe374e172293a2b2ba1a5dd367d72e20ee`

Promotion verification:

- 12/12 promoted blob SHAs matched reviewed DEV HEAD;
- promotion branch was based on current main;
- stale branch-local governance/progress state was excluded;
- no package update;
- `FORMAT_VERSION = 4`;
- `RUNTIME_QA = DEFERRED`;
- `HARD_BENCHMARK = DEFERRED_BY_USER_DECISION`.

INK-CLOUD-007 is now closed on main.

No next Work Order is authorized by this promotion itself.
