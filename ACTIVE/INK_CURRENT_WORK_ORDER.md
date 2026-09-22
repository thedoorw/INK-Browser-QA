# INK CURRENT WORK ORDER

STATUS: `CORE-MOD-001 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `CORE-MOD-001` |
| TITLE | `AI Document Bridge Module v0.1` |
| ROLE_OWNER | `MR / CORE MODULE LANE` |
| DEV_WORK_BRANCH | `work/ink-core-ai-bridge-001` |
| DEV_MODE | `BOUNDED_MODULE_PREPARATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / MODULE_ONLY` |
| UI_MUTATION | `PROHIBITED` |
| INTEGRATION_TO_UI | `PROHIBITED_THIS_TASK` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Objective

Prepare a standalone AI Document Bridge module that converts the authoritative INK document into grounded, structured, CHAT-readable context without mutating the document.

Target chain:

```text
INK Document
→ object / region / relationship grounding
→ bounded structured context
→ CHAT-readable payload
```

This task does **not** execute CHAT edits and does not wire new UI.

## Existing authority to preserve

Authoritative:

- current Document model;
- stable IDs;
- existing semantic model / relationship graph;
- existing CHAT bounded-edit approval semantics;
- History;
- Revision;
- FORMAT_VERSION = 4.

The bridge is a reader/translator, not a new authority.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_CLOUD_CREATIVE_LOOP_DEVELOPMENT_PLAN_v0.1.md`
7. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
8. relevant existing modules only:
   - `product/source/src/ai/chat-runtime.js`
   - `product/source/src/editor/chat-bounded-edit.js`
   - `product/source/src/semantic/*`
   - `product/source/src/document/*`

## Scope

### Phase A — Contract inventory

Inventory existing document/context/semantic/CHAT contracts.

Define one INK-owned bridge output contract, including at minimum:

- document identity;
- active page / layer identity;
- selected object IDs;
- object summaries;
- geometry summary references where available;
- semantic roles;
- relationship edges;
- revision identity when available;
- protected properties / editability hints;
- deterministic context fingerprint.

Do not duplicate full document payload unnecessarily.

Gate: `AI_DOCUMENT_BRIDGE_CONTRACT_DEFINED`

### Phase B — Pure bridge module

Implement a pure module, recommended path:

`product/source/src/ai/document-bridge.js`

Required properties:

- no DOM dependency;
- no network dependency;
- no mutation;
- deterministic output from equivalent input;
- plain JSON-compatible INK-owned values;
- no external engine objects;
- bounded output size strategy;
- fail-closed handling of malformed input.

Gate: `AI_DOCUMENT_BRIDGE_PURE_MODULE_WORKS`

### Phase C — Adapter boundary

Provide a narrow adapter that existing CHAT/runtime code can call later.

This task may expose functions/imports but must **not** change UI or make the new bridge the active production CHAT context source yet.

Required separation:

```text
bridge = read / ground / summarize
CHAT mutation = existing proposal/approval/execution path
```

Gate: `AI_DOCUMENT_BRIDGE_ADAPTER_READY`

### Phase D — deterministic evidence

Add focused unit/deterministic tests covering at minimum:

- same document → same fingerprint/output;
- stable ordering;
- nested Frame/Group objects;
- semantic roles and relationship graph;
- selected subset context;
- bounded output behavior;
- malformed input rejection;
- no source mutation;
- FORMAT_VERSION remains 4.

No browser Runtime required unless DEV discovers a real browser-only dependency.

Gate: `CORE_MOD_001_MODULE_READY`

## Hard boundaries

Do not:

- modify UI;
- add buttons/panels;
- change CHAT approval semantics;
- execute document mutations through the new bridge;
- change History/Revision semantics;
- change document schema;
- change FORMAT_VERSION;
- introduce remote AI dependency;
- create a second semantic/document model;
- integrate CORE-MOD-002 or later modules in this task.

## Required report

Exactly one:

`research/INK_CORE_MOD_001_AI_DOCUMENT_BRIDGE_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-001
BRANCH = work/ink-core-ai-bridge-001
GATE = CORE_MOD_001_MODULE_READY
UI_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
