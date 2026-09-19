# INK CURRENT WORK ORDER

STATUS: `AUTHORIZED / DEV_READY`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-002` |
| TITLE | `INK Editor Frame + Nested Hierarchy Foundation v0.1` |
| AUTHORITY | `MAIN REVIEW + USER_APPROVED` |
| DEV_WORK_BRANCH | `work/ink-cloud-002` |
| DEV_AUTHORIZATION | `BOUNDED_RUNTIME_IMPLEMENTATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CURRENT_GATE | `DEV_AUTHORIZED` |
| NEXT_AUTHORIZED_ACTION | `DEV_IMPLEMENTATION` |

## Product direction

Read:

`governance/INK_Product_Delivery_Model_v0.1.md`

INK has one shared core and two delivery forms:

- portable/offline target: single `INK.html`;
- cloud target: `INK Cloud Editor`.

This task changes shared editor-core capability. It is not a cloud-backend task and must remain compatible with the portable single-HTML direction.

## Accepted architecture baseline

Read:

`research/INK_CLOUD_EDITOR_PENPOT_GAP_AUDIT_v0.1.md`

MR accepted the audit conclusion that INK remains the architectural core.

Penpot remains a reference only. No Penpot source-copy authorization is granted.

## Objective

Add the smallest explicit Frame/container + nested hierarchy foundation needed for future components, responsive layout, guide scoping and mature nested selection.

Do this by extending the existing INK document/editor core rather than replacing it.

## Required baseline

DEV must read, in order:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. this Current Work Order
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
8. `governance/INK_Product_Delivery_Model_v0.1.md`
9. `research/INK_CLOUD_EDITOR_PENPOT_GAP_AUDIT_v0.1.md`
10. only source / QA files required to implement this bounded slice

## Mandatory implementation scope

### 1. Explicit frame/container object

Add an INK-native `frame` object/container model with at least:

- stable object ID;
- name;
- affine matrix / transform compatibility;
- width / height or explicit frame bounds;
- opacity/visibility behavior compatible with existing editor expectations;
- ordered child ownership;
- serialization-safe properties;
- migration/default normalization for older documents.

Do not map procedural Repeat objects into Frame.

### 2. Parent / child ownership rules

Define deterministic hierarchy rules:

- a child belongs to one parent container at most;
- frame children preserve stable IDs;
- reparenting must not silently change world-space appearance;
- local/world transform conversion must be explicit;
- invalid/cyclic parent relationships must be rejected or normalized safely.

This task only needs a bounded hierarchy depth sufficient to prove the model; one nested-frame level must work correctly. The implementation should not deliberately block deeper nesting if the model naturally supports it.

### 3. Selection / bounds / hit-test

Existing selection behavior must correctly handle:

- selecting a frame;
- selecting objects inside a frame;
- frame world bounds;
- child world bounds;
- moving/scaling/rotating a frame with its children;
- deep-selection entry or equivalent bounded interaction for selecting a child inside a frame.

Do not redesign the full selection UX beyond what is required to make hierarchy valid.

### 4. History / spatial index / recompute compatibility

Frame operations must integrate with existing:

- HistoryManager transactions/patches;
- undo / redo;
- PageSpatialIndex updates/queries;
- dependency/recompute identity rules where applicable.

No replacement history or spatial engine.

### 5. Layers panel nested tree

Expose frame hierarchy in the existing Layers panel:

- frame row;
- nested child rows;
- deterministic order;
- selectability;
- existing visibility/lock semantics must not regress.

Do not redesign the whole UI.

### 6. Serialization / migration

Frame documents must:

- save/load through current INK document storage;
- preserve IDs and hierarchy;
- survive structured project serialization;
- not break existing documents without frames.

SVG behavior must remain coherent:
- frame content must not be flattened to raster;
- if SVG has no exact INK frame concept, use a structure-preserving group/container representation.

### 7. Regression protection

At minimum verify existing behavior for:

- stroke / stylus;
- editable vector path;
- text;
- image/raster object;
- existing group;
- SVG import/export;
- undo/redo;
- local save/load;
- layer reorder/visibility/lock;
- selection transform;
- repeat/material/recompute data compatibility where touched.

Only run tests needed for affected surfaces; do not expand into unrelated full-platform work.

## Explicit exclusions

Do NOT implement in this task:

- cloud backend / remote storage;
- login/authentication;
- collaboration / presence / websocket;
- components / instances / variants;
- flex layout;
- grid layout;
- full ruler/guide system;
- renderer replacement;
- Penpot source-code copying;
- FLORA/AI/Recipe product-boundary promotion;
- single-file `INK.html` packaging;
- `package/ink-current` update;
- version promotion/certification.

## Penpot use rule

Penpot may be consulted only to clarify mature Frame/container/hierarchy interaction concepts.

If DEV believes direct code reuse is necessary, STOP and request a separate MR license/dependency decision before copying any source.

## Mandatory DEV branch

Use only:

`work/ink-cloud-002`

DEV must:

- commit meaningful checkpoints;
- continuously update `ACTIVE/INK_DEV_PROGRESS.md` on this branch;
- include current branch HEAD / checkpoint SHA in progress;
- preserve tests/evidence in GitHub;
- never merge to `main`;
- never update `package/ink-current`.

## Required deliverables

Implementation changes under the minimum necessary `product/source/**` and QA paths.

Create:

`research/INK_FRAME_NESTED_HIERARCHY_IMPLEMENTATION_REPORT_v0.1.md`

Update:

`ACTIVE/INK_DEV_PROGRESS.md`

The report must include:

- files changed;
- schema/model changes;
- transform and reparent rules;
- selection/hit-test behavior;
- history/spatial behavior;
- serialization/migration behavior;
- regression tests performed;
- known limitations;
- exact DEV branch HEAD.

## Temporary Runtime QA constraint

GitHub Actions quota is currently exhausted.

For this Work Order:

- do not depend on GitHub Actions or hosted Runtime QA;
- do not spend work trying to restore or bypass Actions capacity;
- perform source-level, structural, serialization, deterministic/unit-style, and other locally/repository-executable checks that do not require GitHub Actions;
- record every acceptance item that cannot be proven without Runtime/browser execution as `RUNTIME_QA_DEFERRED`;
- deferred Runtime evidence is a known validation debt, not permission to omit implementation evidence;
- MR may pass the bounded implementation as `SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED` if source evidence is sufficient;
- certification, package promotion, or claims of Runtime-verified behavior remain prohibited until deferred Runtime checks are later completed.

This is a temporary resource constraint, not a change to the intended product behavior.

## Acceptance requirements

MR expects source/static evidence for the following; Runtime-only portions may be explicitly marked `RUNTIME_QA_DEFERRED`:

1. existing documents still open;
2. a frame can contain existing object types;
3. moving/scaling/rotating frame preserves child relative geometry;
4. child selection inside a frame works by the defined bounded interaction;
5. reparenting preserves world appearance;
6. undo/redo restores hierarchy and transforms;
7. save/reload preserves hierarchy and IDs;
8. spatial selection does not silently miss nested objects;
9. existing group behavior remains functional;
10. no excluded capability was introduced.

## Completion gate

When complete:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-002
BRANCH = work/ink-cloud-002
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

DEV must STOP after handoff.


## Cloud Start Gate

The project sequence is fixed as:

```text
document-format / structural core stabilization
→ MR confirms PRE_CLOUD_CORE_READY
→ USER_REMINDER_REQUIRED
→ USER_APPROVAL
→ Cloud implementation may begin
```

Cloud implementation must NOT begin automatically when the structural-core work appears complete.

Before any first Cloud work order is issued, MR must:
1. verify the pre-Cloud structural/core acceptance criteria;
2. update `working/WORKING_STATUS.md` to `PRE_CLOUD_CORE_READY`;
3. remind the user that the pre-Cloud core stage is complete;
4. wait for explicit user approval;
5. only then issue the first Cloud Work Order.

Current `INK-CLOUD-002` remains a shared-core/editor-structure task, not Cloud implementation.
