# INK CURRENT WORK ORDER

STATUS: `ACTIVE / INK-CLOUD-008B / DEVELOPMENT_AUTHORIZED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-008B` |
| TITLE | `Expressive Stroke v0.1` |
| AUTHORITY | `USER_CONTINUOUS_ADVANCE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-008b` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| PROMOTION_POLICY | `MR_PASS_AUTO_PROMOTE / NO_USER_PAUSE` |

## Continuous advance rule

The user has authorized forward progression without waiting for a separate promotion decision.

For bounded INK creative-loop work:

```text
DEV_HANDOFF
→ MR_REVIEW
→ if MR_PASS: clean promotion to main
→ issue next bounded Work Order
```

Do not pause for a user promotion decision after MR_PASS.

Still STOP for any Hard STOP condition, MR_REVISE/MR_HOLD, FORMAT_VERSION change, architecture break, package/release decision, or scope expansion outside the planned creative loop.

## Accepted baseline

INK-CLOUD-008A is promoted to main.

Accepted chain:

```text
Reference
→ Extract
→ authoritative editable INK Path
→ direct Path Editing
```

008B extends this only to:

```text
editable Path Geometry
+
independent Expressive Stroke Appearance
```

Geometry must remain authoritative and editable.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `research/INK_PATH_EDITING_CORE_REPORT_v0.1.md`
8. existing vector/stroke/render/History/serialization source as required

## Product objective

Implement expressive stroke assignment on editable Path geometry without converting the Path into raster or destructive outline geometry.

Core rule:

```text
Path Geometry != Stroke Appearance
```

Changing stroke appearance must not alter anchor positions, Bézier handles, topology, subpath roles, extraction provenance, or Path identity.

## Scope

Required capabilities:

- assign expressive stroke style to an authoritative Path;
- change stroke style independently from geometry;
- retain ordinary vector stroke compatibility;
- define a bounded serializable stroke-style contract;
- support width/profile behavior without rewriting geometry;
- support pressure-like/taper/profile samples as appearance data where structurally appropriate;
- map approved existing INK brush/media characteristics onto Path stroke appearance through the existing renderer architecture;
- allow switching/removing expressive stroke without geometry loss;
- History-backed style mutation;
- undo/redo;
- save/load/serialization;
- structured SVG fallback/export behavior must remain explicit and non-corrupting;
- extraction provenance and Path editing remain intact after stroke assignment.

Do not require artistic perfection in this workpack. Prove separation, editability, persistence and bounded rendering behavior first.

## Long Sequence phases

### Phase A — Stroke appearance contract

Establish a versioned, bounded Path stroke-appearance contract using existing document/vector conventions.

Required:

- geometry-independent style payload;
- normalization/validation;
- deterministic defaults;
- bounded sample/profile limits;
- no duplicate Path geometry;
- no FORMAT_VERSION change unless Hard STOP is raised.

Checkpoint commit required.

### Phase B — Style mutation + History

Implement:

- assign style;
- replace style;
- remove expressive style / return to ordinary vector stroke;
- bounded width/profile/taper parameters;
- stable Path ID and metadata/provenance;
- existing scoped History;
- no-op edits do not create corrupt History.

Checkpoint commit required.

### Phase C — Renderer integration

Use existing INK renderer domains.

Required:

- render expressive Path stroke without rasterizing source geometry;
- preserve existing ordinary vector rendering;
- deterministic fallback when advanced media cannot render;
- no second renderer;
- no brush-to-outline destructive conversion;
- geometry edit after style assignment updates rendering from the same Path.

Checkpoint commit required.

### Phase D — Existing natural-media bridge

Where bounded and structurally compatible, map selected existing INK brush/media properties to Path stroke appearance.

Required:

- reuse existing brush/media concepts rather than create a parallel brush system;
- keep geometry/style separation explicit;
- unsupported natural-media fields must degrade predictably;
- no new generic brush marketplace/preset platform.

Checkpoint commit required.

### Phase E — Integration and regression evidence

Prove at minimum:

- same Path geometry under multiple stroke styles;
- geometry hash/invariant unchanged by style-only mutation;
- anchor/handle editing after expressive style assignment;
- undo/redo of style-only and geometry-only changes independently;
- save/load roundtrip;
- extraction provenance retention;
- ordinary vector stroke fallback;
- SVG export behavior explicitly tested/documented;
- locked/hidden/busy-History invalid target rejection;
- `FORMAT_VERSION = 4`;
- no package mutation.

Checkpoint commit required.

### Phase F — report + handoff

Create:

`research/INK_EXPRESSIVE_STROKE_REPORT_v0.1.md`

Report:

- implemented contract;
- rendering route;
- existing brush/media reuse;
- tests executed;
- tests not executed;
- browser/runtime debt;
- SVG/export limitations;
- exact candidate HEAD;
- confirmation that Composition/Repaint were not started.

Set:

`DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Acceptance gate

```text
EXPRESSIVE_STROKE = IMPLEMENTED
PATH_GEOMETRY_SEPARATION = PRESERVED
PATH_EDIT_AFTER_STYLE = WORKS
HISTORY = REUSED
SERIALIZATION = PRESERVED
EXTRACTION_PROVENANCE = PRESERVED
ORDINARY_VECTOR_FALLBACK = PRESERVED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

Full Phase-2 gate:

`EDITABLE_PATH_AND_STROKE_WORKS`

## Explicit exclusions

Do not implement:

- Multi-Contour Composition;
- Repaint / Material;
- CHAT mutation;
- rose-window benchmark;
- generic Cloud backend/auth/collaboration;
- full brush/preset marketplace;
- package/single-file release;
- FORMAT_VERSION bump;
- second vector/History/transform/renderer engine.

## Hard STOP

STOP and request MR decision if:

1. FORMAT_VERSION change is required;
2. accepted Path/History/renderer/transform contract must break;
3. a second vector, brush, History or renderer engine becomes necessary;
4. expressive stroke requires destructive Path-to-outline/raster conversion as the authoritative representation;
5. scope must expand into Composition/Repaint/CHAT or broad UI redesign.

## QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Run all feasible source/static/unit/serialization checks.

Never claim unexecuted checks as PASS.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-008B
BRANCH = work/ink-cloud-008b
GATE = EDITABLE_PATH_AND_STROKE_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
