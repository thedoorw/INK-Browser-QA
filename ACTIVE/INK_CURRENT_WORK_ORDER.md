# INK CURRENT WORK ORDER

STATUS: `CORE-MOD-005 / AUTHORIZED / READY_FOR_DEV`

## Prior closure

```text
CORE-MOD-004 = Visual Compare + Variant / MR_PASS / PROMOTED
REVIEWED_HEAD = dc4ae21e0457cbca1d67034fca778857a4bb87cd
NODE_QA = PASS / run 35707165761
PROMOTION_PR = #32
MAIN = 620f17965f096796a2374e1078432c484010b051
INTEGRATION_QUEUE += VISUAL_COMPARE_VARIANT
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
```

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `CORE-MOD-005` |
| TITLE | `Parametric Creative Structure Module v0.1` |
| ROLE_OWNER | `MR / CORE MODULE LANE` |
| DEV_WORK_BRANCH | `work/ink-core-parametric-structure-005` |
| DEV_MODE | `BOUNDED_MODULE_PREPARATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / MODULE_ONLY` |
| UI_MUTATION | `PROHIBITED` |
| DOCUMENT_MUTATION | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_MUTATION | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Objective

Prepare a pure deterministic module for describing and resolving bounded parametric creative structures without creating a second geometry engine, renderer, editor, document store, or UI workbench.

Target:

```text
parametric structure descriptor
→ validated parameters / constraints
→ deterministic structure plan
→ stable generated-node identities
→ bounded transform / relationship evidence
→ later Integration adapter
```

The module prepares data and adapters only. It does not write objects into the authoritative INK document.

## Existing authority to preserve

- authoritative Document / object identity;
- existing Geometry / Path / Repeat / Transform behavior;
- existing History / Revision semantics;
- existing renderer;
- AI Document Bridge / Semantic Region / Provenance / Visual Compare modules;
- `FORMAT_VERSION = 4`.

## Scope

### Phase A — contract inventory

Inventory current Repeat / Transform / geometry helpers and object identity rules needed for a parametric structure description.

Define one INK-owned descriptor contract supporting at minimum:

- structure identity and version;
- explicit parameter definitions and resolved values;
- deterministic seed when a seed is used;
- node / part roles;
- parent-child or relationship graph;
- transform descriptors;
- bounded repetition/count rules;
- explicit unresolved/unsupported evidence;
- deterministic structure fingerprint.

Gate: `PARAMETRIC_STRUCTURE_CONTRACT_DEFINED`

### Phase B — pure resolver

Recommended path:

`product/source/src/structure/parametric-structure.js`

Required properties:

- pure / non-mutating;
- no DOM/network dependency;
- JSON-compatible;
- deterministic ordering and fingerprint;
- no renderer ownership;
- no document writes;
- no History / Revision writes;
- no guessed object identity;
- bounded expansion;
- stable generated-node IDs derived deterministically from structure identity + rule position/evidence.

Gate: `PARAMETRIC_STRUCTURE_RESOLVER_WORKS`

### Phase C — adapters / evidence

Provide narrow read-only adapters that can later consume existing INK objects or semantic regions as source evidence and emit a structure plan.

At minimum support:

- explicit source object IDs;
- semantic region refs when supplied;
- provenance refs when supplied;
- structure parameters;
- transform/repetition plan metadata;
- unresolved refs without fabrication.

No formal cross-module product wiring is performed in this task.

Gate: `PARAMETRIC_STRUCTURE_ADAPTER_READY`

### Phase D — deterministic QA

Tests must cover at minimum:

- same descriptor + same parameters → same output/fingerprint;
- reordered equivalent input → same normalized output/fingerprint;
- deterministic generated-node IDs;
- bounded repeat/count handling;
- transform descriptor normalization;
- invalid / unsupported parameter evidence;
- unresolved source refs;
- provenance refs preserved where available;
- no source mutation;
- no document/history/revision mutation;
- no renderer/DOM/network dependency;
- `FORMAT_VERSION = 4`.

Gate: `CORE_MOD_005_MODULE_READY`

## Hard boundaries

Do not:

- modify UI;
- mutate authoritative documents;
- create object insertion/execution commands;
- change Geometry / Path / Repeat / Transform authority;
- change History or Revision semantics;
- change renderer behavior;
- change document schema;
- change `FORMAT_VERSION`;
- integrate prepared modules into the production shell;
- start the cross-module Integration stage inside this task.

## Required report

Exactly one:

`research/INK_CORE_MOD_005_PARAMETRIC_CREATIVE_STRUCTURE_REPORT_v0.1.md`

## DEV progress discipline

Branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

Update every meaningful checkpoint.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-005
BRANCH = work/ink-core-parametric-structure-005
GATE = CORE_MOD_005_MODULE_READY
UI_MUTATION = 0
DOCUMENT_MUTATION = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
