# INK CURRENT WORK ORDER

STATUS: `CORE-MOD-003 / AUTHORIZED / READY_FOR_DEV`

## Prior closures

```text
CORE-MOD-001 = AI Document Bridge / MR_PASS / PROMOTED / RUNTIME_DEBT_CLEARED
CORE-MOD-002 = Semantic Region Grounding / MR_PASS / PROMOTED
CORE-MOD-002 PROMOTION PR = #30
CORE-MOD-002 MAIN = 05bd690f09a9c2cd81fe4a8744f7641805e5cfe2
```

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `CORE-MOD-003` |
| TITLE | `Revision Provenance Module v0.1` |
| ROLE_OWNER | `MR / CORE MODULE LANE` |
| DEV_WORK_BRANCH | `work/ink-core-revision-provenance-003` |
| DEV_MODE | `BOUNDED_MODULE_PREPARATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / MODULE_ONLY` |
| UI_MUTATION | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Objective

Prepare a pure provenance module that explains how an INK object, change, Revision, extraction result, Recipe result or CHAT operation was derived, while keeping existing Revision and History systems authoritative.

Target:

```text
reference / extraction / recipe / CHAT operation / revision evidence
→ normalized provenance events
→ object/change/revision lineage
→ deterministic provenance graph
→ bounded CHAT-readable provenance context
```

This module records/normalizes evidence only. It does not replace existing Revision records, History transactions, or document mutation semantics.

## Existing authority to preserve

- `product/source/src/document/revision.js`;
- existing Revision record/index/restore semantics;
- existing History implementation;
- existing file-envelope integrity;
- existing object IDs / document IDs / revision IDs;
- existing extraction / Recipe / CHAT metadata already present in source records;
- AI Document Bridge and Semantic Region Grounding as read-only consumers/producers;
- FORMAT_VERSION = 4.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/document/revision.js`
7. `product/source/src/document/file-envelope.js`
8. `product/source/src/history/*`
9. `product/source/src/ai/document-bridge.js`
10. relevant extraction / Recipe / CHAT modules only as needed

## Scope

### Phase A — provenance contract inventory

Inventory existing provenance-bearing fields from:

- reference/import source metadata;
- extraction metadata;
- Recipe / step IDs;
- CHAT proposal / plan / execution IDs;
- Revision IDs / parent/base links;
- object source IDs;
- file-envelope / document identity;
- semantic-region provenance refs.

Define one INK-owned provenance event/graph contract.

At minimum include:

- deterministic event ID;
- event kind;
- source entity;
- target entity;
- document ID;
- revision ID when available;
- parent/source event IDs;
- operation / recipe / step / proposal / plan identity when available;
- before/after fingerprints or object IDs where available;
- timestamp as evidence only, excluded from deterministic identity where necessary;
- unresolved provenance;
- deterministic graph fingerprint.

Gate: `REVISION_PROVENANCE_CONTRACT_DEFINED`

### Phase B — pure provenance module

Recommended:

`product/source/src/provenance/provenance-graph.js`

Requirements:

- pure / non-mutating;
- no DOM/network dependency;
- JSON-compatible;
- deterministic IDs/order/fingerprint;
- normalize existing evidence; do not invent lineage;
- unresolved/missing links remain explicit;
- bounded event / edge output;
- no modification of Revision record schema.

Gate: `REVISION_PROVENANCE_GRAPH_WORKS`

### Phase C — adapters

Provide narrow read-only adapters for later Integration:

```text
existing Revision records / comparison
existing document/object metadata
optional extraction / Recipe / CHAT evidence
→ provenance graph

provenance graph
→ bounded AI Document Bridge-compatible context
```

Do not make provenance the active Revision store or History store.

Gate: `REVISION_PROVENANCE_ADAPTER_READY`

### Phase D — deterministic evidence

Tests must cover at minimum:

- reference → extraction → object lineage;
- Recipe / step lineage;
- CHAT proposal/plan/execution lineage;
- Revision parent/base lineage;
- object added/changed/removed evidence from existing revision comparison;
- equivalent reordered input → same graph/fingerprint;
- unresolved/missing source links;
- duplicate/conflicting evidence handling;
- bounded output;
- no source mutation;
- existing Revision record inspection remains valid;
- FORMAT_VERSION = 4.

Gate: `CORE_MOD_003_MODULE_READY`

## Hard boundaries

Do not:

- alter Revision schema or restore behavior;
- change History semantics;
- add timestamps to deterministic IDs in a way that breaks equivalence;
- modify UI;
- change Document schema;
- change FORMAT_VERSION;
- create a second revision store;
- create a second History;
- integrate Compare / Variant or Parametric modules in this task.

## Required report

Exactly one:

`research/INK_CORE_MOD_003_REVISION_PROVENANCE_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-003
BRANCH = work/ink-core-revision-provenance-003
GATE = CORE_MOD_003_MODULE_READY
UI_MUTATION = 0
REVISION_AUTHORITY_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
