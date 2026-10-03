# INK Architecture Recomposition — B0 Baseline Freeze + B1 Command/State Contract Dispatch v1.0

STATUS: ACTIVE DISPATCH / PLANNING + BASELINE ONLY  
DATE: 2026-10-03  
REPO: `thedoorw/INK-Browser-QA`  
GITHUB: SOLE SSOT

## Role

You are **INK Architecture Recomposition MR — B0/B1**.

## Read first

1. `README.md`
2. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
3. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
4. `research/INK_ARCHITECTURE_RECOMPOSITION_EXECUTION_PLAN_v0.1.md`
5. `research/INK_ARCHITECTURE_RECOMPOSITION_ASSESSMENT_v0.1.md`
6. `research/INK_UI_ASSEMBLY_REBUILD_FEASIBILITY_v0.1.md`

## Mission

Prepare the safe starting point for Architecture Recomposition.

### B0 — freeze the accepted pre-recomposition baseline

Do not freeze an intermediate PWA state.

First confirm the current bounded PWA integration + actual Pages/live gate is closed. Then freeze the exact accepted main revision as:

```text
tag:
pre-architecture-recomposition-v1

archive branch:
archive/pre-architecture-recomposition
```

Create a baseline manifest recording at minimum:

```text
exact main SHA
FORMAT_VERSION
source/build identity
deployed/Pages identity
browser-loaded identity
capability baseline
Runtime / QA evidence
PWA closure evidence
independent open lanes
source snapshot/checksum
```

Create/retain an immutable source snapshot ZIP or equivalent archive and checksum.

Verify the frozen baseline can be recovered.

If the PWA live gate is still open:

```text
DO NOT choose an earlier baseline
STOP B0 freeze
record BLOCKED_BY_PWA_CLOSURE
continue B1 contract research only if it requires no product mutation
```

### B1 — define Command + State Architecture Contract

No product refactor yet.

Produce:

1. canonical state-domain map:
   - Product State
   - View State
   - UI-local State
2. command contract schema;
3. UI-critical command registry;
4. old-route → target-command mapping for:
   - `src/ink.js`
   - `ui/full-capability-controls.js`
   - `web-shell.js`
   - CHAT bounded edit
   - Recipe/API routes where relevant;
5. History/Revision/render-invalidation policy;
6. first low-risk B2 vertical-slice recommendation;
7. parity/evidence gate for switching a caller;
8. explicit RETIRE conditions for old handlers/routes.

## Architecture rule

```text
Human UI ─┐
CHAT/API ─┼→ Shared Command Authority → Core → History/Revision → Render/Output
Recipe ───┘
```

UI may own only UI-local state.

## Protected scope

Do not:
- rewrite Core;
- change `FORMAT_VERSION`;
- rebuild UI;
- delete old handlers;
- mass-move files;
- alter product behavior;
- begin B2 product refactor.

## Required GitHub outputs

Create/update authoritative planning/evidence documents for B0/B1 and update `ACTIVE/INK_CURRENT_WORK_ORDER.md`.

No product-source files are to be changed.

## Stop condition

Return:

```text
B0_BASELINE = FROZEN / BLOCKED_BY_PWA_CLOSURE
B1_COMMAND_STATE_CONTRACT = COMPLETE
B2_VERTICAL_SLICE = PROPOSED
PRODUCT_SOURCE_MUTATION = NONE
STOP → MR / USER REVIEW
```
