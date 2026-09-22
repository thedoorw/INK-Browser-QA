# INK CURRENT WORK ORDER

STATUS: `CORE-MOD-004 / AUTHORIZED / READY_FOR_DEV`

## Prior closures

```text
CORE-MOD-001 = AI Document Bridge / MR_PASS / PROMOTED / RUNTIME_DEBT_CLEARED
CORE-MOD-002 = Semantic Region Grounding / MR_PASS / PROMOTED
CORE-MOD-003 = Revision Provenance / MR_PASS / PROMOTED
CORE-MOD-003 PROMOTION PR = #31
CORE-MOD-003 MAIN = bffd922ce92bca8a21102d87087020b1286e2b42
```

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `CORE-MOD-004` |
| TITLE | `Visual Compare + Variant Module v0.1` |
| ROLE_OWNER | `MR / CORE MODULE LANE` |
| DEV_WORK_BRANCH | `work/ink-core-visual-compare-004` |
| DEV_MODE | `BOUNDED_MODULE_PREPARATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / MODULE_ONLY` |
| UI_MUTATION | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| RESTORE_SEMANTICS_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Objective

Prepare a pure comparison/variant module that can compare references, current document state, revisions and bounded variants without creating a second editor, second Revision authority or UI workbench.

Target:

```text
reference/current/revision/variant inputs
→ normalized comparison subjects
→ visual/structural comparison model
→ deterministic evidence
→ choose/restore/continue metadata for later Integration
```

This task prepares comparison data and adapters only. It does not add a comparison UI and does not execute Revision restore.

## Existing authority to preserve

- `product/source/src/document/revision.js`;
- current Revision comparison and restore semantics;
- current Document / object identity;
- existing renderer;
- existing provenance module;
- AI Document Bridge / Semantic Region modules;
- FORMAT_VERSION = 4.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/document/revision.js`
7. `product/source/src/provenance/provenance-graph.js`
8. `product/source/src/ai/document-bridge.js`
9. existing document/object helpers only as needed

## Scope

### Phase A — comparison contract inventory

Inventory existing Revision comparison, object fingerprints, document fingerprints, provenance refs and any current reference/current comparison data.

Define one INK-owned comparison contract supporting at minimum:

- subject A / subject B identity;
- subject kind: reference / current / revision / variant;
- document / revision / object IDs where available;
- structural added / removed / changed object sets;
- shared object correspondence;
- deterministic comparison fingerprint;
- provenance refs where available;
- explicit unsupported / unresolved comparison evidence;
- bounded comparison output.

Gate: `VISUAL_COMPARE_CONTRACT_DEFINED`

### Phase B — pure compare module

Recommended path:

`product/source/src/compare/visual-compare.js`

Required properties:

- pure / non-mutating;
- no DOM/network dependency;
- JSON-compatible;
- deterministic ordering/fingerprint;
- no renderer ownership;
- no pixel capture requirement;
- structural comparison can reuse authoritative Revision comparison evidence;
- optional visual descriptors may be represented as data only;
- no guessed object correspondence beyond stable identity/evidence;
- bounded output.

Supported modes in the contract should include:

```text
side-by-side
overlay
wipe
difference
structural
```

These are mode descriptors for later UI/renderer integration, not UI implementation.

Gate: `VISUAL_COMPARE_PURE_MODULE_WORKS`

### Phase C — variant model + adapters

Provide a bounded variant descriptor for later Integration.

At minimum:

- variantId;
- base subject;
- derived subject;
- label / reason;
- source revision or provenance fingerprint where available;
- comparison fingerprint;
- decision state limited to neutral workflow states such as `UNRESOLVED / SELECTED / REJECTED`;
- no automatic choice;
- no restore execution.

Provide narrow read-only adapters for:

```text
reference ↔ current
revision ↔ revision
current ↔ revision
variant A ↔ variant B
```

Gate: `VISUAL_VARIANT_ADAPTER_READY`

### Phase D — deterministic evidence

Tests must cover at minimum:

- current vs revision;
- revision vs revision;
- reference/current identity handling;
- variant descriptors;
- added/removed/changed structural evidence;
- stable correspondence by existing identity only;
- reordered equivalent input → same output/fingerprint;
- unresolved/unsupported evidence;
- bounded output;
- no source mutation;
- no Revision restore invocation;
- no renderer/DOM/network dependency;
- provenance refs preserved where available;
- FORMAT_VERSION = 4.

Gate: `CORE_MOD_004_MODULE_READY`

## Hard boundaries

Do not:

- modify UI;
- implement side-by-side/overlay/wipe visual rendering;
- execute restore/select/reject actions against authoritative state;
- change Revision schema or restore behavior;
- change History semantics;
- change Document schema;
- change FORMAT_VERSION;
- create a second renderer;
- create a second Revision/variant document store;
- integrate CORE-MOD-005 in this task.

## Required report

Exactly one:

`research/INK_CORE_MOD_004_VISUAL_COMPARE_VARIANT_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-004
BRANCH = work/ink-core-visual-compare-004
GATE = CORE_MOD_004_MODULE_READY
UI_MUTATION = 0
REVISION_AUTHORITY_CHANGE = 0
RESTORE_SEMANTICS_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
