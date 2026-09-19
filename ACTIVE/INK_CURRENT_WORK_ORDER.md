# INK CURRENT WORK ORDER

STATUS: `AUTHORIZED / DEV_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-004` |
| TITLE | `INK Transform / Bounds / Coordinate System Foundation v0.1` |
| AUTHORITY | `MAIN REVIEW + USER_APPROVED` |
| DEV_WORK_BRANCH | `work/ink-cloud-004` |
| DEV_AUTHORIZATION | `BOUNDED_SHARED_CORE_IMPLEMENTATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CURRENT_GATE | `DEV_AUTHORIZED` |
| NEXT_AUTHORIZED_ACTION | `DEV_IMPLEMENTATION` |
| CLOUD_START_GATE | `BLOCKED` |
| RUNTIME_QA | `DEFERRED` |

## Accepted baseline

INK-CLOUD-003 was accepted as:

`SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

and promoted to main at:

`d340664cf554755abfa146f607c05c03200e8799`

This task builds on the accepted Frame / Group ownership and structural-semantics foundation.

## Objective

Stabilize the coordinate, transform, and bounds contracts that all future Component, Layout, snapping, guide, persistence, and Cloud work will depend on.

This is a pre-Cloud shared-core task.

The goal is not to redesign the transform UI. The goal is to make geometric meaning deterministic across nested containers and serialized documents.

## Required baseline read order

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. this Current Work Order
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
8. `governance/INK_Product_Delivery_Model_v0.1.md`
9. accepted reports for INK-CLOUD-001 / 002 / 003
10. only source / QA files required for this bounded task

## Required structural contract

### 1. Coordinate-space definitions

Define and use explicit meanings for:

- object-local space;
- parent/container space;
- page/world space;
- viewport/screen space.

Preserve the accepted hierarchy rule:

```text
world = ancestorWorld × local
```

Screen/view conversion must remain a derived editor concern and must not silently rewrite serialized object geometry.

### 2. Matrix invariants

Establish one deterministic affine-transform contract for editable objects:

- six-number affine matrix representation remains authoritative;
- matrices must contain finite values;
- local/world conversion must use shared helpers rather than ad-hoc multiplication order;
- structural operations that require inversion must fail safely on non-invertible transforms rather than corrupt hierarchy;
- negative scale / reflection behavior, if currently supported, must remain deterministic;
- near-zero / singular transform behavior must be explicitly documented.

Do not replace the existing matrix engine.

### 3. Bounds taxonomy

Define explicit bounds concepts rather than using one ambiguous “bounds” meaning.

At minimum distinguish:

- local geometry bounds;
- world geometry bounds;
- container bounds;
- selection bounds.

Required semantics:

- Frame bounds come from its explicit width/height transformed to world space;
- Group bounds derive from child content and do not gain persistent width/height;
- nested child world bounds use complete ancestry;
- selection bounds are the union of selected transform roots after ancestor/descendant collapse;
- derived world/selection bounds must not be serialized as authoritative geometry.

If a visual/effect bounds concept is needed for current code, keep it explicitly separate from geometry bounds. Do not add a new effects system.

### 4. Transform semantics

Make the following deterministic for Frame / Group / ordinary objects:

- move;
- rotate;
- scale;
- nested transform;
- ancestor + descendant multi-selection;
- world-space transform converted back to local space;
- same-Layer reparent appearance preservation.

Ancestor + descendant selected together must not double-transform the descendant.

Do not change the accepted same-Layer reparent restriction.

### 5. Frame resize vs Frame transform

Explicitly separate these meanings:

- **Frame transform**: modifies the Frame affine matrix; children follow through ancestry.
- **Frame geometry resize**: modifies Frame width/height.

For this v0.1 foundation:

- resizing Frame geometry must not silently rewrite child local transforms;
- no constraints/auto-layout behavior is implied;
- child response to future constraints/layout remains a later task;
- any existing UI path that currently conflates frame geometry resize with matrix scaling must be identified and boundedly normalized if necessary.

No full transform-UX redesign.

### 6. Group bounds contract

Group remains content-derived:

- no persistent width/height;
- bounds come from descendants;
- nested Group/Frame combinations must produce deterministic bounds;
- empty Group fallback behavior must be explicit and stable;
- Group transform must not bake child geometry unless an existing explicit operation already requires it.

### 7. Spatial / hit-test / selection consistency

Where the same geometry is being interpreted, these systems must not disagree:

- renderer bounds;
- PageSpatialIndex bounds;
- hit-test;
- marquee/lasso candidate bounds;
- selection overlay bounds;
- snapping feature bounds.

Fix only bounded inconsistencies required to establish one coordinate/bounds contract.

Do not implement the future full snapping/guide system here.

### 8. Serialization / migration

Verify that:

- local matrices remain serialized source-of-truth geometry;
- Frame width/height remain serialized Frame geometry;
- derived world/selection/container cache data is not treated as authoritative serialized state;
- existing Frame and Group documents migrate safely;
- no accidental screen-space values are written into document objects;
- structured SVG mapping remains coherent where touched.

### 9. Format-version decision

DEV must explicitly report whether the stabilized contract requires a format-version change.

If DEV believes a format-version bump is necessary:

`STOP and request MR decision before changing FORMAT_VERSION.`

Do not independently change product or document version.

## Required compatibility protection

At minimum protect:

- accepted INK-CLOUD-002 Frame documents;
- accepted INK-CLOUD-003 Group/ownership documents;
- legacy Group documents;
- stroke/stylus;
- editable vector path;
- text;
- image/raster;
- Repeat stable identity;
- History undo/redo;
- selection transform;
- same-Layer reparent;
- spatial indexing;
- local save/load;
- SVG structured export/import where touched;
- creation/layout workspace camera behavior.

## Explicit exclusions

Do NOT implement:

- Cloud backend / remote file storage;
- authentication;
- collaboration / presence;
- components / instances / variants;
- constraints;
- flex/grid/auto-layout;
- persistent ruler/guide system;
- full snapping-engine redesign;
- cross-Layer Frame reparent;
- full transform UI redesign;
- renderer replacement;
- Penpot source copying;
- FLORA/AI/Recipe boundary promotion;
- single-file `INK.html` packaging;
- `package/ink-current` update;
- version promotion/certification.

## Temporary Runtime QA constraint

GitHub Actions quota remains exhausted.

Therefore:

- do not depend on hosted Actions;
- perform source/static/unit/serialization checks available in the active environment;
- never report an unexecuted test as PASS;
- record browser/runtime-only checks as `RUNTIME_QA_DEFERRED`;
- no Runtime-verified or certified claim may be made.

## Required deliverables

Create:

`research/INK_TRANSFORM_BOUNDS_COORDINATE_SYSTEM_REPORT_v0.1.md`

Update:

`ACTIVE/INK_DEV_PROGRESS.md`

The report must include:

- final coordinate-space contract;
- matrix/inversion rules;
- bounds taxonomy;
- Frame transform vs resize contract;
- Group bounds contract;
- selection/multi-select transform rules;
- spatial/hit-test/bounds alignment;
- files changed;
- migration/serialization behavior;
- tests/checks actually executed;
- tests authored but not executed, if any;
- schema/version conclusion;
- known limitations;
- Runtime QA debt;
- exact implementation/handoff fingerprint.

## Acceptance requirements

MR expects evidence that:

1. local / parent / world / screen meanings are explicit and consistent.
2. nested world/local transform math is deterministic.
3. singular/non-invertible transform cases fail safely.
4. Frame bounds use explicit Frame geometry.
5. Group bounds remain child-derived.
6. nested Frame/Group bounds remain correct under transforms.
7. ancestor + descendant selection does not double-transform.
8. Frame matrix transform and Frame width/height resize are not conflated.
9. spatial / hit-test / marquee / selection bounds agree for covered cases.
10. reparent still preserves world appearance within the same Layer.
11. no derived world bounds become authoritative serialized document state.
12. accepted Frame/Group documents remain structurally compatible.
13. no excluded capability is introduced.
14. no format-version bump occurs without MR approval.

## Branch / commit rules

Use only:

`work/ink-cloud-004`

DEV must continuously commit meaningful checkpoints and keep `ACTIVE/INK_DEV_PROGRESS.md` current on that branch.

DEV must not:

- merge main;
- update `package/ink-current`;
- start Cloud work;
- start the next task.

## Completion gate

When complete:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-004
BRANCH = work/ink-cloud-004
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

## Cloud Start Gate

Still blocked.

Completion of this task alone does not authorize Cloud implementation.

The sequence remains:

```text
structural-core stabilization
→ PRE_CLOUD_CORE_READY
→ remind user
→ explicit user approval
→ first Cloud Work Order
```
