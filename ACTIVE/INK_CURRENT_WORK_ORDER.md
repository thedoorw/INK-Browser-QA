# INK CURRENT WORK ORDER

STATUS: `AUTHORIZED / DEV_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-003` |
| TITLE | `INK Container / Ownership / Structural Semantics Foundation v0.1` |
| AUTHORITY | `MAIN REVIEW + USER_APPROVED` |
| DEV_WORK_BRANCH | `work/ink-cloud-003` |
| DEV_AUTHORIZATION | `BOUNDED_SHARED_CORE_IMPLEMENTATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CURRENT_GATE | `DEV_AUTHORIZED` |
| NEXT_AUTHORIZED_ACTION | `DEV_IMPLEMENTATION` |
| CLOUD_START_GATE | `BLOCKED` |
| RUNTIME_QA | `DEFERRED` |

## Baseline

Accepted Frame + Nested Hierarchy foundation is promoted to main at:

`7c03793ce7d289d0a1ecf1fafe3602aa9eedff13`

This task builds on that accepted source baseline.

Read:

- `governance/INK_Product_Delivery_Model_v0.1.md`
- `research/INK_CLOUD_EDITOR_PENPOT_GAP_AUDIT_v0.1.md`
- `research/INK_FRAME_NESTED_HIERARCHY_IMPLEMENTATION_REPORT_v0.1.md`

## Objective

Stabilize the structural semantics that determine how INK objects belong to containers and how inherited container state affects them.

This is a pre-Cloud shared-core task.

It must make the document model safer for future Component / Layout / Cloud persistence work without implementing those capabilities yet.

## Required baseline read order

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. this Current Work Order
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
8. `governance/INK_Product_Delivery_Model_v0.1.md`
9. accepted INK-CLOUD-001 / 002 research reports
10. only source / QA files required for this bounded task

## Structural model to establish

### 1. Container role definitions

Define and enforce clear structural roles for existing object families.

Minimum intended semantics:

- `Frame`
  - explicit rectangular container;
  - owns ordered children;
  - may be nested;
  - future target for constraints/layout/component placement.

- `Group`
  - structural grouping container;
  - owns ordered children;
  - extent derives from child content;
  - remains behaviorally distinct from Frame.

- `Repeat`
  - procedural generator;
  - its source/instances are not to be silently reclassified as ordinary container ownership children.

Do not merge these types into one user-visible object type.

Implementation may use shared internal helpers/capabilities where appropriate.

### 2. Ownership invariants

Establish deterministic rules that can be checked by integrity/migration logic:

- every serialized ordinary object has one structural owner location;
- top-level objects belong to exactly one Layer object array;
- nested structural children belong to exactly one structural parent;
- `parentId`, where used, must agree with the actual structural parent;
- stale top-level `parentId` is removed;
- duplicate ownership / duplicate structural IDs must be detected or normalized safely;
- cycles must be rejected or repaired deterministically;
- child array order is authoritative.

Do not introduce cross-Layer Frame reparenting. The INK-CLOUD-002 same-Layer restriction remains active.

### 3. Group / Frame nested combinations

At source/model level, define deterministic behavior for at least:

- Group inside Frame;
- Frame inside Group;
- nested Frame;
- nested Group where already supported by existing documents.

The task must explicitly distinguish:

- structural traversal;
- rendering traversal;
- selection/hit-test behavior.

Existing Group interaction behavior must not be silently redesigned. If deep Group selection would require a UX redesign, preserve current interaction and document the boundary.

### 4. Inherited state semantics

Define and make consistent:

```text
effectiveVisible
effectiveLocked
effectiveOpacity
```

across:

```text
Layer
→ Frame / Group ancestry
→ object
```

Expected principles:

- hidden ancestor makes descendants effectively hidden;
- locked ancestor makes descendants effectively locked;
- opacity composes deterministically through Layer/container/object ancestry;
- source/model traversal, renderer expectations, selection filtering and serialization must not disagree about these semantics.

Do not add new blend/effect systems.

### 5. Transform / coordinate ownership consistency

Preserve the accepted hierarchy rule:

```text
world = ancestorWorld × local
```

Ensure Group/Frame combinations use deterministic local/world transform semantics.

Do not change the accepted same-Layer world-preserving Frame reparent rule.

### 6. Z-order / structural order contract

Define the source-of-truth ordering rules:

- Layer order;
- top-level object array order;
- container child array order;
- nested draw order;
- hit-test ordering relative to rendered order.

Fix only bounded inconsistencies required for deterministic structural order.

Do not redesign the full Layers-panel drag/drop UX.

### 7. Serialization / migration / integrity

Extend current model/integrity/migration behavior so the new semantics survive:

- save/load;
- structured JSON serialization;
- existing Group documents;
- accepted Frame documents;
- nested Group/Frame combinations;
- SVG structure where applicable.

No raster flattening as a shortcut.

### 8. Schema/version decision

DEV must report whether this task requires a document format-version change.

If a format-version bump is believed necessary:

`STOP and request MR decision before changing FORMAT_VERSION.`

Do not independently bump product/document version.

## Required compatibility checks

At minimum protect:

- legacy Group documents;
- accepted Frame documents from INK-CLOUD-002;
- stroke/stylus;
- vector path;
- text;
- image/raster;
- Repeat stable identity;
- History undo/redo;
- spatial selection/indexing;
- local save/load;
- SVG structured export/import where touched;
- semantic/dependency traversal where touched.

## Explicit exclusions

Do NOT implement:

- Cloud backend / remote file storage;
- authentication;
- collaboration;
- components / instances / variants;
- constraints;
- flex/grid/auto-layout;
- persistent ruler/guide system;
- cross-Layer Frame reparent;
- full Group-selection UX redesign;
- renderer replacement;
- Penpot source copying;
- FLORA/AI/Recipe boundary promotion;
- single-file `INK.html` packaging;
- `package/ink-current` update;
- version promotion/certification.

## Temporary Runtime QA constraint

GitHub Actions quota remains exhausted.

Therefore:

- do not depend on hosted GitHub Actions;
- perform source/static/unit/serialization checks available without hosted Actions;
- record browser/runtime-only checks as `RUNTIME_QA_DEFERRED`;
- no Runtime-verified or certified claim may be made.

## Required deliverables

Create:

`research/INK_CONTAINER_OWNERSHIP_STRUCTURAL_SEMANTICS_REPORT_v0.1.md`

Update:

`ACTIVE/INK_DEV_PROGRESS.md`

The report must include:

- final container-role contract;
- ownership invariants;
- Group/Frame nesting rules;
- effective visibility/lock/opacity rules;
- z-order contract;
- files changed;
- migration/integrity behavior;
- tests/checks;
- schema/version conclusion;
- known limitations;
- Runtime QA debt;
- exact implementation/handoff fingerprint.

## Acceptance requirements

MR expects evidence that:

1. Group and Frame roles are explicitly defined and not conflated.
2. structural ownership is deterministic.
3. duplicate/cyclic/stale ownership states are handled safely.
4. Group-in-Frame and Frame-in-Group do not corrupt transforms or ownership.
5. effective visibility/lock/opacity semantics are deterministic.
6. z-order and hit-test ordering do not contradict structural/render order for the covered cases.
7. legacy Group documents remain structurally compatible.
8. accepted Frame documents remain structurally compatible.
9. Repeat procedural identity is not converted into ordinary container ownership.
10. no excluded capability is introduced.
11. no format-version bump occurs without MR approval.

## Branch / commit rules

Use only:

`work/ink-cloud-003`

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
TASK_ID = INK-CLOUD-003
BRANCH = work/ink-cloud-003
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

The project remains:

```text
structural-core stabilization
→ PRE_CLOUD_CORE_READY
→ remind user
→ explicit user approval
→ first Cloud Work Order
```
