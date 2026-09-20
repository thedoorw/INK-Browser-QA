# INK CURRENT WORK ORDER

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-006` |
| TITLE | `INK Layout / Constraints Schema + Persistence Contract Closure v0.1` |
| AUTHORITY | `MAIN REVIEW + USER_CONTINUE_AUTHORIZATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-006` |
| DEV_MODE | `LONG_SEQUENCE_WORKPACK` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED_WITHIN_SCOPE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| CURRENT_GATE | `MR_PASS` |
| NEXT_AUTHORIZED_ACTION | `USER_PROMOTION_DECISION_REQUIRED` |
| CLOUD_START_GATE | `BLOCKED` |
| RUNTIME_QA | `DEFERRED` |

## Baseline

Accepted and promoted structural foundations:

- `INK-CLOUD-002` — Frame + Nested Hierarchy
- `INK-CLOUD-003` — Container / Ownership Structural Semantics
- `INK-CLOUD-004` — Transform / Bounds / Coordinate System
- `INK-CLOUD-005` — Component / Instance Data Model

Pre-Cloud readiness assessment:

`research/INK_PRE_CLOUD_CORE_READINESS_ASSESSMENT_v0.1.md`

Decision:

`PRE_CLOUD_CORE_READY = NO / ONE_FINAL_STRUCTURAL_WORKPACK_REQUIRED`

## Objective

Close the final document-format / structural gaps before first Cloud implementation:

1. establish a minimal versioned Layout / Constraints data contract;
2. establish a transport-neutral persistence / revision envelope contract;
3. prove migration, integrity, save/load, History and existing structural compatibility;
4. do not build Cloud transport or a full layout editor.

This is a shared-core structural task, not Cloud implementation.

## Required starting reads

1. `README.md`
2. `AGENTS.md`
3. this Current Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`

Read governance, accepted reports and source/QA only when required by this Work Order or implementation.

## A. Layout / Constraints structural schema

Create the smallest versioned optional structural contract that future responsive layout can extend without destabilizing existing documents.

Requirements:

- Frame is the primary layout-container authority.
- Group remains grouping semantics and must not silently become a layout Frame.
- Repeat remains procedural and is not a layout container.
- layout metadata must be optional and versioned.
- child layout/constraint metadata must be optional and versioned or unambiguously scoped.
- existing Frame documents without layout metadata must retain current behavior exactly.
- no derived world geometry/bounds are serialized.

The model must define enough semantics for future:

- no-layout / manual positioning;
- horizontal / vertical flow capability;
- gap;
- padding;
- alignment;
- fixed / fill / hug-style sizing concepts or an equally explicit INK-native equivalent;
- child participation versus absolute/manual placement;
- horizontal and vertical resize/anchor constraint intent.

Do not implement a broad UI.

Do not overbuild a full production Auto Layout engine.

Implement only the minimum deterministic evaluation/normalization needed to prove that the schema is coherent and can evolve safely.

## B. Layout identity / transform / ownership rules

Layout must reuse accepted hierarchy and transform contracts.

Required:

- layout does not create a second hierarchy;
- ownership remains existing Frame/Group arrays;
- child IDs remain stable;
- layout evaluation never changes definition/Instance identity semantics;
- parent/local/world matrix meaning remains unchanged;
- layout-computed geometry must have a clearly documented authority boundary;
- resize/constraint evaluation must not silently mutate unrelated ancestors;
- singular transform protections remain intact.

If implementing layout requires replacing accepted transform/ownership semantics:

`STOP / MR_DECISION_REQUIRED`.

## C. History

Use existing HistoryManager.

At minimum, any source-level commands introduced for:

- applying/removing layout metadata;
- changing bounded layout properties;
- changing child sizing/constraint metadata

must be atomic, undoable, and not leave partial History state.

No replacement History engine.

## D. Serialization / migration / integrity

Verify and formalize:

- old format-4 documents without layout data remain valid;
- Frame / Group / Component / Instance documents remain valid;
- optional layout data survives native save/load;
- unknown future extension fields are preserved unless explicitly migrated;
- malformed known layout fields fail or normalize deterministically;
- integrity can diagnose invalid known layout/constraint data;
- no silent identity retargeting;
- structured SVG remains based on resolved geometry and does not raster-flatten merely because layout metadata exists.

DEV must explicitly decide whether a FORMAT_VERSION change is necessary.

If yes:

`STOP / MR_DECISION_REQUIRED`

before changing it.

## E. Transport-neutral file / revision envelope

Define and implement/test a backend-neutral persistence envelope around the native INK document.

This is a schema/adapter boundary only.

Minimum concepts:

- envelope schema/version;
- stable file ID;
- revision identity or monotonic revision field;
- native document formatVersion;
- declared feature/extension identifiers;
- migration identifiers or applied-migration record;
- document payload;
- asset/media reference list compatible with existing assetManifest;
- savedAt / modifiedAt;
- integrity fingerprint.

Required behavior:

- wrapping/unwrapping must not alter the native document;
- invalid fingerprint / malformed envelope must fail safely;
- native document remains authoritative;
- local InkStore remains separate and continues to work;
- envelope must be usable later by either local file transport or Cloud transport;
- no remote backend assumptions in core schema.

Do NOT add:

- HTTP/API calls;
- authentication;
- permissions;
- server storage;
- sync;
- collaboration;
- conflict-resolution protocol;
- websocket/presence.

## F. Compatibility closure

Protect at minimum:

- legacy non-Frame documents;
- Frame / nested hierarchy;
- Group ownership semantics;
- Transform / bounds / singular guards;
- Component / Instance identity, overrides and detach;
- Repeat identity;
- History;
- spatial indexing;
- native save/load;
- InkStore recovery;
- structured SVG;
- creation/layout workspace cameras;
- assetManifest.

## G. Required report

Create:

`research/INK_LAYOUT_PERSISTENCE_CONTRACT_CLOSURE_REPORT_v0.1.md`

Report:

- final layout schema;
- container/child authority;
- constraint/sizing semantics;
- normalization/evaluation behavior;
- History behavior;
- serialization/migration/integrity behavior;
- file/revision envelope schema;
- extension/feature policy;
- asset reference policy;
- FORMAT_VERSION conclusion;
- tests actually executed;
- tests authored but not executed;
- Runtime QA debt;
- known limitations;
- exact handoff fingerprint.

## Explicit exclusions

Do not implement:

- first Cloud backend;
- remote storage;
- auth;
- permissions;
- collaboration/presence;
- remote libraries;
- full Component variants;
- full Auto Layout UI;
- mature flex/grid property panels;
- persistent rulers/guides;
- snapping redesign;
- worker architecture;
- renderer replacement;
- package update;
- single-file packaging;
- version promotion/certification;
- next Work Order.

## Runtime QA constraint

`GITHUB_ACTIONS = QUOTA_EXHAUSTED`

`RUNTIME_QA = DEFERRED`

Execute all feasible source/static/unit/serialization/migration tests locally/in the active environment.

Never claim unexecuted tests as PASS.

## Long Sequence rule

WORK may proceed continuously across implementation phases without user confirmation.

Each meaningful checkpoint must:

- commit;
- update `ACTIVE/INK_DEV_PROGRESS.md`;
- record exact SHA;
- retain evidence.

Hard STOP only if:

1. FORMAT_VERSION change is required;
2. accepted hierarchy/ownership/transform/component contracts must be broken;
3. a parallel engine becomes necessary;
4. scope must expand beyond this Work Order.

## Acceptance

MR must be able to verify:

1. layout/constraint metadata has a clear versioned optional schema;
2. existing no-layout documents preserve behavior;
3. Frame remains layout authority without reclassifying Group/Repeat;
4. child identity/ownership stays stable;
5. layout/constraint mutations use existing History;
6. known malformed layout data is handled deterministically;
7. save/load preserves valid layout data;
8. old format-4 documents remain compatible;
9. Component/Instance documents remain compatible;
10. file/revision envelope round-trips native document losslessly;
11. envelope fingerprint validation fails closed;
12. local InkStore remains compatible;
13. asset references have a documented stable boundary;
14. no Cloud transport/backend capability was introduced;
15. FORMAT_VERSION is unchanged unless MR explicitly authorizes otherwise.

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-006
BRANCH = work/ink-cloud-006
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0 OR MR_DECISION_REQUIRED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

After MR PASS + promotion, MR must perform the final PRE_CLOUD_CORE_READY assessment.

Cloud implementation remains blocked until that assessment passes and the user explicitly approves Cloud start.


## MR Pass

MR reviewed final DEV handoff HEAD:

`b3a59ab6a11869c6273ffdd7754b3b11af41ab74`

Implementation + executed QA checkpoint:

`184c74195e976526713ad549b236e13c9dac9ad7`

Decision:

`MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

No blocking source/schema finding remains. `FORMAT_VERSION_CHANGE = 0`.

DEV remains stopped. Main promotion requires user approval.

After promotion, MR must perform the final `PRE_CLOUD_CORE_READY` assessment. This PASS does not authorize Cloud implementation.
