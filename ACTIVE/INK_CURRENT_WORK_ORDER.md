# INK CURRENT WORK ORDER

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-005` |
| TITLE | `INK Component / Instance Data Model Foundation v0.1` |
| AUTHORITY | `MAIN REVIEW + USER_APPROVED` |
| DEV_WORK_BRANCH | `work/ink-cloud-005` |
| DEV_AUTHORIZATION | `BOUNDED_SHARED_CORE_IMPLEMENTATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CURRENT_GATE | `MR_PASS` |
| NEXT_AUTHORIZED_ACTION | `USER_PROMOTION_DECISION_REQUIRED` |
| CLOUD_START_GATE | `BLOCKED` |
| RUNTIME_QA | `DEFERRED` |

## Accepted baseline

`INK-CLOUD-004` was accepted as:

`SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

and promoted to main at:

`37418ab7f6b994425126e73c60810401d5e6e826`

This task builds on the accepted:

- Frame + nested hierarchy foundation;
- container / ownership / structural semantics;
- transform / bounds / coordinate system contract.

## Objective

Stabilize the minimum Component / Instance data model that future reusable design systems, variants, layout, document persistence, and Cloud revisioning can safely depend on.

This is a **pre-Cloud shared-core task**.

The goal is not to build a complete Component UI. The goal is to establish deterministic identity, reference, override, detach, history, and serialization semantics without creating a second geometry or hierarchy engine.

## Required baseline read order

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. this Current Work Order
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`
8. `governance/INK_Product_Delivery_Model_v0.1.md`
9. accepted reports for INK-CLOUD-001 / 002 / 003 / 004
10. only source / QA files required for this bounded task

## Required structural contract

### 1. One geometry / hierarchy engine

Component capability must reuse the accepted INK object, Frame/Group, transform, bounds, History, spatial, serialization, and renderer contracts.

Do not create a parallel scene graph, transform engine, selection engine, or renderer.

A Component definition may introduce metadata/reference structure, but its editable visual structure must remain ordinary INK structural geometry.

### 2. Definition identity

Establish an explicit Component-definition identity contract.

Requirements:

- stable definition ID independent from instance object ID;
- human-readable name;
- deterministic reference to the definition's editable source structure;
- definition identity survives ordinary save/load;
- duplicated definitions must receive new definition identity;
- deleting/renaming/moving the editable source must not silently retarget unrelated instances.

DEV must document where Component definition authority lives and why.

### 3. Source-node identity

Overrides require deterministic source-node targeting.

Define how an instance refers to nodes inside its Component definition.

Requirements:

- source-node identity must be stable while the definition remains structurally the same;
- instance-local object IDs must not be confused with source-definition node IDs;
- source-node identity must work through Frame / Group nesting;
- stale or missing override targets must fail safely and remain diagnosable;
- no positional-array-index-only identity contract.

### 4. Instance contract

Add the minimum explicit Instance model.

An Instance must have at least:

- stable instance object ID;
- reference to one Component-definition ID;
- normal INK local matrix / parent ownership semantics;
- deterministic resolved geometry/bounds from the referenced definition;
- serialization-safe override state;
- explicit broken/missing-definition state;
- normal visibility / lock / opacity behavior through existing container semantics.

Instance placement inside Layer / Frame / Group must use the existing ownership model.

### 5. Linked vs detached state

A linked Instance must not silently become an independent duplicate tree.

Define deterministic detach behavior.

Detach must:

- preserve current world appearance;
- materialize ordinary editable INK structure;
- generate appropriate new ordinary object IDs;
- remove Component linkage from the detached result;
- preserve valid parent ownership;
- remain undoable through existing History.

Do not build a full detach UI; a bounded core/editor command or test entry point is sufficient.

### 6. Override envelope

Establish the minimum deterministic override data contract.

Requirements:

- overrides are serialized data, not hidden runtime state;
- keyed by stable source-node identity;
- property names/values must be explicit and schema-safe;
- unknown/stale targets do not corrupt the document;
- reset/remove override is deterministic;
- source updates and overrides have a defined precedence rule.

For v0.1, implement only the smallest property surface necessary to prove the model. Do not build a broad Figma-style override UI.

### 7. Definition resolution and cycle safety

Component resolution must fail safely.

Required handling:

- missing definition;
- missing source root;
- stale override target;
- self-reference;
- indirect cyclic component reference if nested instances are structurally possible.

No infinite traversal/render/serialization recursion.

If nested Component instances are not supported in v0.1, reject them explicitly rather than leaving behavior ambiguous.

### 8. Bounds / transform / selection semantics

Reuse INK-CLOUD-004 contracts.

Required:

- Instance placement transform is ordinary INK local matrix;
- resolved Instance bounds are deterministic in world space;
- parent transform ancestry works normally;
- selecting/moving/scaling/rotating an Instance does not mutate the Component definition;
- definition edits do not rewrite Instance placement matrices;
- ancestor/descendant transform-root rules remain valid;
- no serialized derived world bounds.

For v0.1, canvas interaction may remain Instance-atomic.

### 9. History semantics

Use existing HistoryManager.

At minimum, bounded operations for:

- create/register Component definition;
- create Instance;
- apply/reset one supported override;
- detach Instance;
- repair/reject broken reference where applicable

must not leave partial state and must support undo/redo where they mutate document state.

No replacement History engine.

### 10. Serialization / migration / integrity

Verify:

- Component-definition identity survives native save/load;
- Instance references survive save/load;
- overrides survive save/load;
- broken references are retained diagnostically rather than silently retargeted;
- integrity inspection can report duplicate definition IDs, missing definitions, invalid source roots, stale override targets, and cycles where applicable;
- existing non-Component documents remain valid;
- accepted Frame/Group documents remain compatible.

Structured SVG export must remain coherent. If linked Component semantics cannot be represented directly in SVG, export resolved structural geometry without raster flattening while keeping native INK data authoritative.

### 11. Format-version decision

DEV must explicitly report whether this data model requires a document `FORMAT_VERSION` change.

If a format-version bump appears necessary:

`STOP and request MR decision before changing FORMAT_VERSION.`

Do not independently change product or document version.

## Required compatibility protection

Protect at minimum:

- INK-CLOUD-002 Frame documents;
- INK-CLOUD-003 Group/ownership documents;
- INK-CLOUD-004 transform/bounds contracts;
- legacy Group documents;
- stroke/stylus;
- editable vector path;
- text;
- image/raster;
- Repeat stable identity;
- History undo/redo;
- same-Layer reparent;
- spatial indexing;
- local save/load;
- structured SVG;
- creation/layout workspace camera behavior.

## Explicit exclusions

Do NOT implement:

- Cloud backend / remote file storage;
- authentication;
- collaboration / presence;
- remote/shared Component libraries;
- variants / component sets;
- constraints;
- flex/grid/auto-layout;
- persistent ruler/guide system;
- snapping-engine redesign;
- cross-Layer Frame reparent;
- full Component panel/UI;
- full deep-edit Instance UX;
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
- execute source/static/unit/serialization checks available in the active environment;
- never report an unexecuted test as PASS;
- record browser/runtime-only checks as `RUNTIME_QA_DEFERRED`;
- no Runtime-verified or certified claim may be made.

## Required deliverables

Create:

`research/INK_COMPONENT_INSTANCE_DATA_MODEL_REPORT_v0.1.md`

Update on the DEV branch:

`ACTIVE/INK_DEV_PROGRESS.md`

The report must include:

- chosen definition-authority model;
- definition/source-node/instance identity rules;
- linked resolution model;
- override schema and precedence;
- detach semantics;
- cycle / missing-reference behavior;
- transform/bounds/selection behavior;
- History behavior;
- integrity / migration / serialization behavior;
- structured SVG behavior;
- files changed;
- tests/checks actually executed;
- tests authored but not executed, if any;
- schema/version conclusion;
- known limitations;
- Runtime QA debt;
- exact implementation/handoff fingerprint.

## Acceptance requirements

MR expects evidence that:

1. Component definition identity is stable and unambiguous.
2. source-node identity is stable and not based only on array position.
3. Instance reference resolution is deterministic.
4. missing/broken references fail safely.
5. cyclic resolution cannot recurse indefinitely.
6. Instance placement uses existing local/world transform contract.
7. Instance transforms do not mutate the definition.
8. one bounded override type applies/resets deterministically.
9. stale override targets remain diagnosable and non-corrupting.
10. detach preserves appearance and produces ordinary editable structure.
11. create/override/detach mutations integrate with History.
12. native save/load preserves definition/instance/override identity.
13. integrity can diagnose invalid Component references.
14. existing Frame/Group/Repeat documents remain structurally compatible.
15. no excluded capability is introduced.
16. no format-version bump occurs without MR approval.

## Branch / commit rules

Use only:

`work/ink-cloud-005`

DEV must:

- commit meaningful checkpoints;
- keep `ACTIVE/INK_DEV_PROGRESS.md` current on this branch;
- report exact checkpoint SHAs;
- preserve bounded tests/evidence;
- stop at handoff.

DEV must not:

- merge main;
- update `package/ink-current`;
- start Cloud work;
- start the next task.

## Completion gate

When complete:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-005
BRANCH = work/ink-cloud-005
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0 OR MR_DECISION_REQUIRED
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


## MR Pass — Component / Instance Data Model

MR reviewed final handoff HEAD:

`315d4ac2b33894630c0d1a67333fc40acbc145e9`

Decision:

`MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

Accepted source-level foundation:

- stable Component definition identity;
- stable source-node identity;
- linked atomic Instance model;
- bounded serialized opacity override;
- deterministic detach;
- broken-reference / cycle diagnostics;
- existing History integration;
- native serialization / integrity;
- resolved structural SVG;
- no format-version change.

DEV remains stopped.

Main promotion requires user approval.

Cloud implementation remains blocked; this PASS does not mark `PRE_CLOUD_CORE_READY`.
