# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-010 / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-010` |
| TITLE | `Repaint + Material v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-010` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| RUNTIME_QA | `DEFERRED` |
| PROMOTION_POLICY | `MR_PASS_AUTO_PROMOTE / NO_USER_PAUSE` |

## Accepted baseline

INK-CLOUD-009 is promoted to main.

Accepted chain:

```text
Reference
→ Extract
→ editable Path
→ Path Editing
→ Expressive Stroke
→ Multi-Contour Composition
```

This Work Order adds only:

```text
editable composed Paths
→ Repaint / Material
```

## Objective

Enable non-destructive recolor and bounded material reassignment while preserving authoritative Path geometry, identity, provenance, expressive stroke and composition structure.

Core rule:

```text
Geometry / Composition != Paint / Material Appearance
```

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_MULTI_CONTOUR_COMPOSITION_REPORT_v0.1.md`
8. existing material/style/render/History/serialization source as required

## Scope

Required:

- recolor Path fill and stroke appearance without geometry mutation;
- apply/remove/replace bounded material appearance using existing material/render architecture where available;
- preserve Path ID, topology, node IDs, transform, hierarchy and provenance;
- preserve expressive stroke unless explicitly changed by the repaint operation;
- support independently repainting multiple composed Paths;
- History-backed mutations;
- deterministic no-op behavior;
- save/load/serialization integrity;
- structured SVG fallback/export remains explicit and valid;
- bounded diagnostics for unsupported material effects.

## Phases

### Phase A — repaint/material contract

Define/reuse a bounded appearance contract for:
- fill/stroke color;
- opacity where already supported;
- material reference/instance where existing architecture permits;
- deterministic fallback;
- geometry-independent normalization/validation.

Checkpoint commit required.

### Phase B — mutation + History

Implement:
- apply/replace/remove repaint/material appearance;
- multi-selection bounded repaint;
- locked/hidden/stale/singular/busy-History guards;
- stable identity/provenance invariants;
- no-op mutation does not create corrupt History.

Checkpoint commit required.

### Phase C — renderer integration

Reuse existing renderer/material pathways.

Required:
- same authoritative Paths render with changed appearance;
- no Path flattening/raster replacement;
- no second renderer;
- expressive stroke remains compatible;
- unsupported material effects degrade predictably.

Checkpoint commit required.

### Phase D — composition integration

Prove:
- at least three composed Paths can be recolored/materialized independently;
- hierarchy/z-order/transforms remain untouched;
- duplicate/source lineage preserved;
- style changes do not alter geometry fingerprints.

Checkpoint commit required.

### Phase E — regression evidence

Prove:
- geometry invariance under repaint/material changes;
- independent undo/redo for geometry vs appearance;
- save/load;
- provenance and expressive stroke retention;
- structured SVG behavior;
- `FORMAT_VERSION = 4`;
- no package mutation.

Checkpoint commit required.

### Phase F — report + handoff

Create:

`research/INK_REPAINT_MATERIAL_REPORT_v0.1.md`

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
REPAINT = IMPLEMENTED
MATERIAL_APPEARANCE = IMPLEMENTED_OR_BOUNDED_EXISTING_REUSE
GEOMETRY_SEPARATION = PRESERVED
COMPOSITION = PRESERVED
EXPRESSIVE_STROKE = PRESERVED
PROVENANCE = PRESERVED
HISTORY = REUSED
SERIALIZATION = PRESERVED
SVG_EXPORT = PRESERVED_WITH_EXPLICIT_FALLBACK
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Gate:

`REPAINT_MATERIAL_WORKS`

## Explicit exclusions

Do not implement:

- CHAT mutation;
- Revision closure;
- rose-window benchmark;
- generic Cloud backend/auth/collaboration;
- broad UI redesign;
- package/single-file release;
- FORMAT_VERSION bump;
- second material/vector/History/renderer engine.

## Hard STOP

STOP if:

1. FORMAT_VERSION change is required;
2. accepted Path/composition/material/History/renderer contract must break;
3. a second core engine becomes necessary;
4. authoritative Paths must be flattened or rasterized;
5. scope must expand into CHAT Review, Revision or broad UI redesign.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run feasible source/static/unit/serialization checks.
Never claim unexecuted checks as PASS.

## Completion

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
