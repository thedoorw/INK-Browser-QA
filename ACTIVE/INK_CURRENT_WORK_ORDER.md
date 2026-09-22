# INK CURRENT WORK ORDER

STATUS: `INK-CORE-INTEGRATION-001 / AUTHORIZED / READY_FOR_DEV`

## Prior closure

```text
CORE-MOD-001 = AI Document Bridge / PROMOTED
CORE-MOD-002 = Semantic Region Grounding / PROMOTED
CORE-MOD-003 = Revision Provenance / PROMOTED
CORE-MOD-004 = Visual Compare + Variant / PROMOTED
CORE-MOD-005 = Parametric Creative Structure / PROMOTED
CORE MODULE PREPARATION SEQUENCE = COMPLETE
```

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CORE-INTEGRATION-001` |
| TITLE | `Grounded Creative Intelligence Context Integration v0.1` |
| ROLE_OWNER | `MR / CORE INTEGRATION` |
| DEV_WORK_BRANCH | `work/ink-core-integration-001` |
| DEV_MODE | `BOUNDED_INTEGRATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / INTEGRATION_ONLY` |
| UI_LAYOUT_MUTATION | `PROHIBITED` |
| DOCUMENT_SCHEMA_CHANGE | `PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `PROHIBITED` |
| REVISION_SEMANTICS_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_MUTATION | `PROHIBITED` |
| CHAT_EXECUTION_SEMANTICS_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `REQUIRED_AFTER_PROMOTION / MANUAL_WINDOWS_BATCH` |

## Objective

Connect the five prepared Core modules into one bounded, read-only creative-intelligence context that the existing CHAT planning/runtime path can consume without creating a second editor, second document authority, or new execution path.

Target:

```text
authoritative current INK document
+ current selection / revision evidence
→ AI Document Bridge
→ Semantic Region Grounding
→ Revision Provenance context
→ optional Parametric Structure planning evidence
→ optional Visual Compare evidence
→ one deterministic grounded creative-intelligence context
→ existing CHAT plan/runtime context
```

This task integrates context and evidence only. Existing preview / approve / execute / rollback semantics remain authoritative and unchanged.

## Existing authority to preserve

- `product/source/src/ai/document-bridge.js`;
- `product/source/src/semantic/semantic-region-grounding.js`;
- `product/source/src/provenance/provenance-graph.js`;
- `product/source/src/compare/visual-compare.js`;
- `product/source/src/structure/parametric-structure.js`;
- current `chat-runtime.js` and AI command layer approval/execution semantics;
- current Document / History / Revision / Geometry / Renderer authority;
- `FORMAT_VERSION = 4`.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. the five prepared module files above
7. `product/source/src/ai/chat-runtime.js`
8. `product/source/src/ai/install-ai.js`
9. `product/source/src/editor/chat-creative-plan.js`
10. `.github/workflows/ink-runtime-batch-windows.yml`
11. existing relevant QA only as needed

## Scope

### Phase A — integration contract

Define one INK-owned integration context contract.

Recommended path:

`product/source/src/ai/creative-intelligence-context.js`

At minimum include:

- document bridge fingerprint + bounded document context;
- semantic-region fingerprint + bounded region/relationship context;
- provenance fingerprint + bounded lineage refs;
- current revision/document identity;
- optional visual comparison evidence when explicit comparison subjects are supplied;
- optional parametric structure plan evidence when an explicit descriptor is supplied;
- unresolved/unsupported evidence;
- deterministic overall context fingerprint;
- bounded byte/output limits.

No implicit generation of variants or structures.

Gate: `CREATIVE_INTELLIGENCE_CONTEXT_DEFINED`

### Phase B — deterministic read-only integration service

Create a pure/read-only integration service or adapter that:

- reads the authoritative current document through providers;
- composes the existing five modules rather than reimplementing them;
- does not mutate provider data;
- does not call restore, execute, apply, commit, history push, document replace, renderer, DOM or network;
- exposes explicit optional inputs for compare/parametric evidence;
- returns JSON-compatible deterministic context;
- preserves module fingerprints and unresolved evidence;
- rejects unsupported FORMAT_VERSION rather than migrating it.

Gate: `CREATIVE_INTELLIGENCE_CONTEXT_WORKS`

### Phase C — bounded CHAT context wiring

Wire the integration context into the existing CHAT planning/runtime context path.

Required behavior:

- existing CHAT command/planning behavior remains backward compatible;
- existing preview → approval → execution → rollback authority remains untouched;
- context is advisory/read-only evidence only;
- local-only operation remains possible;
- no remote service dependency;
- no new UI layout/panel;
- existing context transmission policy remains authoritative;
- when context is absent/unavailable, existing CHAT path still functions.

Recommended integration point: existing CHAT context construction/provider layer, not execution engine.

Gate: `CHAT_GROUNDED_CONTEXT_WIRED`

### Phase D — deterministic/source QA

Tests must cover at minimum:

- same document/evidence → same integrated context/fingerprint;
- reordered equivalent module evidence → same normalized output;
- current selection/document bridge preserved;
- semantic region refs preserved;
- provenance refs preserved;
- explicit compare input produces compare evidence only;
- explicit parametric descriptor produces structure evidence only;
- no implicit compare/structure generation;
- unresolved evidence stays explicit;
- no provider/document mutation;
- no restore/history/revision/document-write API invocation;
- no renderer/DOM/network dependency in integration module;
- existing CHAT planning works with context disabled;
- existing CHAT planning works with grounded context enabled;
- `FORMAT_VERSION = 4`.

Gate: `INK_CORE_INTEGRATION_001_SOURCE_READY`

## Promotion + Runtime gate

DEV stops at source handoff.

After MR source review PASS:

```text
clean promotion to current main
→ exact promoted main SHA
→ manual workflow:
   .github/workflows/ink-runtime-batch-windows.yml
→ target_ref = exact promoted main SHA
```

Runtime batch must cover at minimum:

- Web shell loads;
- existing Creative Loop remains functional;
- existing CHAT plan / preview / approve / execute / rollback remains functional;
- grounded context can be constructed from the live document;
- no fatal module/import/runtime error;
- existing geometry runtime remains functional;
- `FORMAT_VERSION = 4`;
- exact tested SHA recorded.

Final gate:

`INK_CORE_INTEGRATION_001_RUNTIME_PASS`

This Runtime checkpoint also clears compatible deferred Runtime debt for promoted Core modules 002–005 if the tested product path exercises their integrated import/context path successfully.

## Hard boundaries

Do not:

- redesign UI;
- add a new CHAT panel/workbench;
- alter existing approval/execution/rollback semantics;
- mutate Document schema;
- change History or Revision authority;
- change Geometry / Path / Repeat / Transform authority;
- change renderer;
- create a second module store or creative document store;
- make external AI/network services mandatory;
- change `FORMAT_VERSION`;
- mutate `package/ink-current`;
- begin a subsequent integration stage.

## Required report

Exactly one:

`research/INK_CORE_INTEGRATION_001_GROUNDED_CREATIVE_INTELLIGENCE_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-001
BRANCH = work/ink-core-integration-001
GATE = INK_CORE_INTEGRATION_001_SOURCE_READY
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_SEMANTICS_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = PENDING_MR_PROMOTION_AND_MANUAL_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
