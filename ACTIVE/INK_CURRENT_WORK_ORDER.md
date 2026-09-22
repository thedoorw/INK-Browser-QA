# INK CURRENT WORK ORDER

STATUS: `INK-RA-001 / CLOSED / MR_PASS / PROMOTED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-RA-001` |
| TITLE | `RA Foundation A — Vector Geometry Kernel Integration v0.1` |
| AUTHORITY | `USER_EXPLICIT_RA_FIRST / PACKAGE_WORK` |
| DEV_WORK_BRANCH | `work/ink-ra-001` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `COMPLETED / PROMOTED` |
| UI_MUTATION | `PROHIBITED` |
| PRODUCT_DISPLAY_VERSION_CHANGE | `POLICY_DECIDED / MUTATION_OUT_OF_SCOPE` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CORE_RUNTIME | `STATIC_HOSTING + BROWSER_LOCAL` |
| RUNTIME_QA | `35670775922 / SUCCESS` |

## Why this task exists

The RA0.9 accepted baseline is now imported as read-only reference material:

`reference/RA0_9_baseline/source/RA0_9_AI_Review_Mode_Current_Baseline_v1.0/`

Import identity:

```text
ZIP_SHA256 = 525fdff89305135eedebde4fa039517040220724fdee8e557a3d5a2ad5add1d4
EXTRACTED_FILE_COUNT = 158
EXTRACTED_BYTES = 19909084
STATUS = IMPORTED_REFERENCE_BASELINE
```

The user has explicitly asked to start the RA line first and prefers work to be issued as a DEV package rather than handled as open-ended MR analysis.

The product roadmap remains:

`research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`

This Work Order activates its first RA-first foundation:

`Foundation A — Vector Geometry Kernel integration`

## Product boundary

RA is implementation material, not a second INK product.

Mandatory authority chain:

```text
existing INK capability
+ reusable RA capability
+ mature external geometry capability where stronger
        ↓
evidence-based selection
        ↓
bounded INK-owned adapter
        ↓
authoritative INK Path / Document / Command / History / Revision
```

Hard prohibitions:

- no second Document authority;
- no second Path authority;
- no second History / Revision authority;
- no second renderer;
- no RA workbench shell transplanted into INK;
- no UI redesign in this task;
- no INK Web version-number change in this task;
- no CRDT / multiplayer;
- no broad parametric solver project;
- no speculative import of every RA module or every external library.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `reference/RA0_9_baseline/README.md`
8. `reference/RA0_9_baseline/IMPORT_MANIFEST.md`
9. only the RA source / INK source / QA files required by the phases below

## Candidate RA material

Evaluate at minimum:

- `runtime/geometry_measurement_engine.js`
- `runtime/compound_topology_engine.js`
- `runtime/constraint_parameter_engine.js`
- `runtime/generator_authoring_engine.js`
- `runtime/dependency_recompute_engine.js`

Also inspect their directly relevant tests, schemas and documented limitations.

Do not assume these modules are production-ready for INK merely because they exist.

## External benchmark candidates

Benchmark only where they solve the same concrete geometry problem:

- Paper.js — Bézier path intersections / compound path / Boolean behavior;
- Clipper2 — polygon Boolean / offset / inflate / deflate robustness;
- Bezier.js — Bézier split / project / nearest / intersection / reduction math.

For each candidate verify:

- official/current project source;
- license;
- browser-local compatibility;
- dependency / bundle implications;
- deterministic behavior relevant to INK;
- normalization cost back into INK Path.

No library is pre-authorized for permanent product inclusion before the evaluation gate.

## Long Sequence Workpack

### Phase A — Exact INK geometry inventory

Map current INK capabilities before adding anything.

At minimum determine current support and exact gaps for:

- path / curve intersection;
- Boolean union / subtract / intersect / exclude;
- offset / inflate / deflate;
- split / project / nearest-point;
- compound path / winding / hole integrity;
- geometry measurement / fitting;
- topology relations;
- dependency / recompute concepts already present in INK.

Output a concise capability matrix:

```text
CAPABILITY
→ EXISTING_INK
→ GAP
→ RA_CANDIDATE
→ EXTERNAL_CANDIDATE
→ DECISION_PENDING
```

Checkpoint commit required.

### Phase B — RA capability verification

Execute or extend bounded tests against the relevant RA modules.

Required result for each module:

`ADOPT / ADAPT / REFERENCE_ONLY / DEFER`

Record why.

Pay special attention to:

- numerical behavior;
- topology preservation;
- stable IDs / provenance assumptions;
- dependency semantics;
- known unsupported compound / weave / offset cases;
- whether the module assumes an RA-specific scene/workbench authority.

Checkpoint commit required.

### Phase C — External geometry benchmark

Build a small isolated benchmark harness; do not wire external libraries into product source yet.

Use representative fixtures, including:

1. intersecting cubic Béziers;
2. overlapping closed contours;
3. subtract producing a hole;
4. compound path with winding/hole preservation;
5. positive and negative offset;
6. near-tangent / numerically difficult intersection;
7. split/project/nearest-point case;
8. one geometry fixture derived from existing INK/Rose Window material where practical.

Compare:

- correctness;
- deterministic repeatability;
- topology preservation;
- browser-local execution;
- serialization friendliness;
- performance adequate for editor use;
- dependency size / complexity;
- normalization into INK Path.

Checkpoint commit required.

### Phase D — Selection gate

Before product mutation, freeze one explicit decision matrix.

Required form:

```text
CAPABILITY
→ KEEP_INK
→ ADAPT_RA
→ USE_EXTERNAL_ADAPTER
→ REFERENCE_ONLY
→ DEFER
```

Selection principle:

```text
RA = semantic geometry / measurement / dependency intelligence where useful
external = low-level geometry math only where demonstrably stronger
INK = sole authoritative editable model
```

If the matrix cannot establish a bounded architecture without creating a parallel vector authority:

`STOP = MR_REVIEW_REQUIRED`

Otherwise continue automatically to Phase E.

### Phase E — Bounded shared-core implementation

Implement only the selected Foundation A capabilities through INK-owned adapter boundaries.

Requirements:

- normalize all results to existing authoritative INK Path structures;
- all mutations must pass existing INK command / transaction / History semantics;
- preserve stable object identity rules;
- preserve save/load/serialization;
- preserve `FORMAT_VERSION = 4`;
- external or RA internal objects must not survive as second authoritative document state;
- adapters must be replaceable without rewriting the document model.

Do not add UI except minimal non-user-facing hooks required for QA.

Checkpoint commits required by meaningful capability group.

### Phase F — Closure validation

Required checks:

- source/static checks;
- deterministic geometry fixtures;
- repeated-run equality where applicable;
- History undo/redo;
- save/load roundtrip;
- compound/hole integrity;
- no stale/duplicate ownership;
- browser-local execution;
- self-hosted Windows real-browser QA;
- at least one real artwork/complex-geometry acceptance case.

Use the existing self-hosted Windows runtime path. Do not modify PowerShell execution policy.

Final gate:

`STUDIO_VECTOR_GEOMETRY_KERNEL_INTEGRATED`

## Required evidence artifact

Create/update exactly one task-level report:

`research/INK_RA_FOUNDATION_A_VECTOR_GEOMETRY_REPORT_v0.1.md`

It must contain:

- exact INK inventory;
- RA module disposition;
- external benchmark evidence;
- selected adapter architecture;
- product files changed;
- tests executed;
- runtime evidence;
- unresolved limitations;
- final gate status.

Do not create additional planning documents unless a concrete technical contract cannot fit in the Work Order or report.

## DEV progress discipline

Branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

Update at every meaningful checkpoint with:

- exact HEAD;
- phase;
- files changed;
- tests run;
- current blockers;
- next phase.

## Current INK Web observation — held outside this task

The deployed staging platform is live:

`https://thedoorw.github.io/INK-Browser-QA/`

User observation:

```text
INK_WEB_UI = VISUALLY_TOO_CLUTTERED / DISCUSSION_REQUIRED
PRODUCT_VERSION_POLICY = PORTABLE_v0.1 + WEB_v0.1 / USER_DECIDED
```

These are intentionally not part of INK-RA-001.

The product display-version policy is now decided: both Portable and Web/Cloud remain at base version `v0.1`, with optional supplementary text after the base version. Actual product/UI string mutation remains outside INK-RA-001. MR and USER will still separately define the INK Web UI direction. No DEV should pre-empt that UI discussion.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-RA-001
BRANCH = work/ink-ra-001
GATE = STUDIO_VECTOR_GEOMETRY_KERNEL_INTEGRATED
FORMAT_VERSION = 4
UI_MUTATION = 0
PRODUCT_DISPLAY_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
BROWSER_RUNTIME_QA = EXECUTED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Product display-version decision

USER decision:

```text
PORTABLE_BASE_VERSION = v0.1
CLOUD_WEB_BASE_VERSION = v0.1
SUPPLEMENTARY_TEXT = ALLOWED_AFTER_BASE_VERSION
FIX_ONLY_VERSION_BUMP = PROHIBITED
BASE_VERSION_CHANGE = USER_EXPLICIT_ONLY
```

This corrects the prior habit of treating ordinary fixes or bounded milestones as reasons to advance the visible product version.

Historical `v1.6.5 RC` references remain source/baseline identity only.

This decision does not authorize version-string mutation inside `INK-RA-001`.


## Closure — 2026-09-22

```text
DEV_HANDOFF_HEAD = 14578d3ddcba2b2fa4aedcd54eb24a31b3f955e5
TESTED_PRODUCT_SHA = 6ec1ad1d7e35ba8a384fb44e184b7429e96f7c47
RUNTIME_RUN = 35670775922 / SUCCESS
MR_DECISION = MR_PASS
PROMOTION_PR = #21 / MERGED
MAIN_MERGE = 0f82c4aecbb24cd02981a68e0e1ba6b5d67bdeb3
GATE = STUDIO_VECTOR_GEOMETRY_KERNEL_INTEGRATED / ACCEPTED
```

Accepted Foundation A result:

- INK remains sole Path / Document / History / Revision authority.
- Bezier.js is bounded cubic math only.
- Clipper2 TS is bounded polygon offset math only.
- RA geometry measurement concepts are adapted into INK-owned values.
- Paper.js remains benchmark/reference only.
- general constraint / parametric solver remains deferred.
- `FORMAT_VERSION = 4`.
- UI mutation = 0.
- product display-version mutation = 0.
- package mutation = 0.

No next engineering Work Order is authorized by this closure.

Next active product discussion returns to INK Web UI organization and the already-decided `v0.1` display-version policy.
