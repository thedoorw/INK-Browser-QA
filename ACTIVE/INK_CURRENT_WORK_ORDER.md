# INK CURRENT WORK ORDER

STATUS: `CORE-MOD-002 / AUTHORIZED / READY_FOR_DEV`

## Prior closure

```text
CORE-MOD-001 = MR_PASS / PROMOTED
PR = #26 / MERGED
MAIN = 618a594ae88aacbe847bbc7a1700bb8ed61ab14c
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
```

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `CORE-MOD-002` |
| TITLE | `Semantic Region Grounding Module v0.1` |
| ROLE_OWNER | `MR / CORE MODULE LANE` |
| DEV_WORK_BRANCH | `work/ink-core-semantic-region-002` |
| DEV_MODE | `BOUNDED_MODULE_PREPARATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / MODULE_ONLY` |
| UI_MUTATION | `PROHIBITED` |
| SELECTION_AUTHORITY_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Objective

Prepare a pure semantic-region grounding module that converts existing INK Path / Region / semantic evidence into deterministic region and relationship descriptors without creating a second selection or geometry authority.

Target:

```text
INK Path / Region / object evidence
→ region boundary / hole / island grounding
→ contains / inside / intersects / overlaps / adjacency relations
→ deterministic semantic-region graph
```

## Existing authority to preserve

- INK Path and Geometry Kernel;
- existing semantic model / relationship graph;
- existing selection authority;
- existing Document / History / Revision;
- FORMAT_VERSION = 4.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `product/source/src/semantic/*`
8. `product/source/src/vector/geometry-kernel.js`
9. relevant Region / extraction modules only as needed

## Scope

### Phase A — contract inventory

Define one INK-owned semantic-region output contract.

At minimum cover:

- source object/path identity;
- outer boundary / hole / island role;
- deterministic region IDs;
- bounds / area / centroid references when available;
- contains / inside;
- intersects / overlaps;
- adjacency / crossing / gap / bridge evidence only when supported by source evidence;
- confidence / unresolved state;
- source/provenance references;
- deterministic fingerprint.

Gate: `SEMANTIC_REGION_CONTRACT_DEFINED`

### Phase B — pure grounding module

Recommended:

`product/source/src/semantic/semantic-region-grounding.js`

Requirements:

- pure / non-mutating;
- no DOM/network dependency;
- plain JSON-compatible values;
- deterministic IDs/order/fingerprint;
- reuse existing geometry calculations rather than create a second geometry engine;
- fail closed on malformed structural input;
- unresolved relationships remain explicitly unresolved rather than guessed.

Gate: `SEMANTIC_REGION_GROUNDING_WORKS`

### Phase C — bridge boundary

Provide a narrow adapter that later Integration may consume from AI Document Bridge / selection / CHAT.

This task must not make the module the active production selection source.

Gate: `SEMANTIC_REGION_ADAPTER_READY`

### Phase D — deterministic evidence

Tests must cover at minimum:

- outer + hole + island;
- nested/overlapping regions;
- stable input-order normalization;
- deterministic region IDs and fingerprint;
- relationship classification;
- unresolved evidence behavior;
- malformed geometry rejection;
- no source mutation;
- FORMAT_VERSION = 4;
- compatibility with existing AI Document Bridge consumption shape where practical.

Gate: `CORE_MOD_002_MODULE_READY`

## Hard boundaries

Do not:

- alter UI;
- replace selection authority;
- create a new Path representation;
- add a second Boolean/geometry engine;
- change Document / History / Revision semantics;
- change schema or FORMAT_VERSION;
- activate remote segmentation/ONNX;
- integrate visual compare or parametric modules.

## Required report

Exactly one:

`research/INK_CORE_MOD_002_SEMANTIC_REGION_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-002
BRANCH = work/ink-core-semantic-region-002
GATE = CORE_MOD_002_MODULE_READY
UI_MUTATION = 0
SELECTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
