# INK DEV PROGRESS

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-010` |
| TITLE | `Repaint + Material v0.1` |
| BRANCH | `work/ink-cloud-010` |
| BASE_MAIN | `7ac7c4a65d198c79cd713f389aea9da78928af94` |
| DEV_HANDOFF | `READY` |
| MR_REVIEW | `PENDING` |
| GATE | `REPAINT_MATERIAL_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — repaint/material contract
2. Phase B — mutation + History
3. Phase C — renderer integration
4. Phase D — composition integration
5. Phase E — regression evidence
6. Phase F — report + DEV handoff

## Core rule

```text
Geometry / Composition != Paint / Material Appearance
```

## Rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-010`.
- Read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not begin CHAT Review or Revision.
- Do not run rose-window benchmark.
- STOP for FORMAT_VERSION change, accepted contract break, second core engine, authoritative Path flattening/rasterization, broad UI redesign or scope expansion.

## Start state

`PHASE_F_COMPLETE / DEV_HANDOFF`


## Checkpoint — Phase A

Status: `COMPLETE`

Checkpoint HEAD: `c8c92af47772c0a3b1f0febdb4bc5826d6a321f6`

Implemented:
- bounded `INK-PATH-MATERIAL-APPEARANCE` reference/fallback contract;
- geometry-independent fill/stroke/opacity repaint normalization;
- deterministic material fallback and unsupported-effect diagnostics;
- Path create/load normalization without FORMAT_VERSION change.

Files:
- `product/source/src/vector/paint-appearance.js`
- `product/source/src/vector/vector-core.js`
- `product/source/src/document/model.js`

Next: `BEGIN_PHASE_B / MUTATION_HISTORY`


## Checkpoint — Phase B

Status: `COMPLETE`

Checkpoint HEAD: `879287ffa056514b56af6e6c8bc8c981a6596671`

Implemented:
- multi-Path repaint/material mutation controller;
- locked/hidden/unexposed/stale/singular/busy-History guards;
- target-scoped History reuse;
- deterministic no-op with no History entry;
- Path ID, transform, hierarchy, geometry/node identity and provenance invariants;
- expressive stroke is retained unless `expressiveStrokeColor` is explicitly supplied.

Files:
- `product/source/src/editor/repaint-material.js`
- `product/source/src/editor/index.js`
- `product/source/src/ink.js`

Next: `BEGIN_PHASE_C / RENDERER_INTEGRATION`


## Checkpoint — Phase C

Status: `COMPLETE`

Checkpoint HEAD: `e3ec6cf63195e47b6cdc80c4bc51f60d2ee8c062`

Implemented:
- existing Path Canvas renderer resolves material appearance through the bounded contract;
- existing vector renderer reuses the same deterministic ordinary-vector fallback;
- structured SVG remains a `<path>` and records explicit material reference/fallback attributes;
- expressive stroke renderer remains authoritative when present;
- offline shell includes the new contract/controller modules;
- no raster replacement and no second renderer.

Files:
- `product/source/src/vector/vector-core.js`
- `product/source/src/ink.js`
- `product/source/service-worker.js`

Next: `BEGIN_PHASE_D / COMPOSITION_INTEGRATION`


## Checkpoint — Phase D

Status: `COMPLETE / REGRESSION_EXECUTION_PENDING_PHASE_E`

Checkpoint HEAD: `8c3d6a8cdec86e4f04ca41008bc81eebbd0ccacf`

Composition coverage added for:
- three independently sourced/composed Paths;
- independent fill repaint, stroke repaint and material assignment;
- unchanged geometry fingerprints, transforms, hierarchy/provenance and expressive stroke;
- bounded existing material-template appearance reuse with explicit unsupported-effect diagnostics;
- multi-selection repaint and deterministic no-op behavior.

Evidence source:
- `qa/core/tests/unit/repaint-material-composition-v0.1.test.mjs`

Next: `BEGIN_PHASE_E / REGRESSION_EVIDENCE`


## Checkpoint — Phase E

Status: `COMPLETE / SOURCE_STATIC_EVIDENCE_RECORDED`

Evidence checkpoint: `82a9cb813ae749188ebfd6d00ff78f8e2880c447`.

Follow-up consistency fixes:
- `1e320087455272cded60cbc588e75c52fdf1cc56` — omit absent `materialAppearance` on newly created Paths;
- `d3e0d3dce9e5ddd22dfc7a0675213685a6476a9e` — assert composition z-order invariance.

Executed and PASS:
- exact committed source/test syntax parsing for new/touched repaint/material modules and regression files;
- exact committed appearance normalization/fallback V8 harness;
- exact committed repaint/material controller V8 harness for multi-Path mutation, deterministic no-op, expressive-stroke retention, material assignment, locked and busy-History guards;
- exact committed file-envelope wrap/inspect/unwrap harness with `ink.path-material-appearance.v1`;
- source architecture checks for FORMAT_VERSION=4, existing History reuse, no raster/network controller path, model normalization, renderer reuse, explicit structured-SVG fallback and service-worker wiring;
- post-fix `createPath()` harness proving absent material is omitted and supplied material is retained.

Committed regression suites cover:
- three-Path independent repaint/material;
- geometry/transform/hierarchy/z-order/provenance invariance;
- independent geometry vs appearance History undo/redo;
- save/load and extension declaration;
- expressive-stroke retention;
- structured SVG ordinary-vector fallback;
- locked/hidden/stale/singular/busy-History guards.

Not executed / not claimed PASS:
- full Node test runner: exact-branch clone failed because execution environment could not resolve `github.com`;
- Browser Runtime QA: `DEFERRED`;
- hosted Actions: not used;
- rose-window benchmark: prohibited and not run.

Evidence:
`qa/core/evidence/INK_CLOUD_010_STATIC_CHECKS.txt`

Next: `BEGIN_PHASE_F / REPORT_HANDOFF`


## Checkpoint — Phase F

Closure report checkpoint: `507a2a6b93e71980bed4b9be8230fded2a6da04c`.

Report:
`research/INK_REPAINT_MATERIAL_REPORT_v0.1.md`

Acceptance:
- `REPAINT = IMPLEMENTED`
- `MATERIAL_APPEARANCE = IMPLEMENTED_WITH_BOUNDED_EXISTING_LIBRARY_REUSE`
- `GEOMETRY_SEPARATION = PRESERVED`
- `COMPOSITION = PRESERVED`
- `EXPRESSIVE_STROKE = PRESERVED`
- `PROVENANCE = PRESERVED`
- `HISTORY = REUSED`
- `SERIALIZATION = PRESERVED`
- `SVG_EXPORT = PRESERVED_WITH_EXPLICIT_FALLBACK`
- `FORMAT_VERSION = 4`
- `PACKAGE_MUTATION = 0`
- `MAIN_MERGE = 0`
- `RUNTIME_QA = DEFERRED`

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-010
BRANCH = work/ink-cloud-010
GATE = REPAINT_MATERIAL_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

## Final topology check

Final pre-handoff comparison against `main`:

- branch status: `ahead`;
- ahead: `28`;
- behind: `0`;
- no divergence detected;
- package branch untouched;
- main untouched by DEV.

The final progress/handoff commit follows this topology checkpoint and becomes the review HEAD.
