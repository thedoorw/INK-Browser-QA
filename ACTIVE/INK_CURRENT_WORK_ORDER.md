# INK CURRENT WORK ORDER

STATUS: `INK-CORE-INTEGRATION-002 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CORE-INTEGRATION-002` |
| TITLE | `Grounded Creative Tool Surface v0.1` |
| ROLE_OWNER | `MR / CORE INTEGRATION` |
| DEV_WORK_BRANCH | `work/ink-core-integration-002` |
| DEV_MODE | `BOUNDED_INTEGRATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / CHAT TOOL SURFACE ONLY` |
| UI_LAYOUT_MUTATION | `PROHIBITED` |
| DOCUMENT_SCHEMA_CHANGE | `PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `PROHIBITED` |
| REVISION_SEMANTICS_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_MUTATION | `PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_NEXT_COMPATIBLE_BATCH UNLESS HIGH-RISK TRIGGER` |

## Upstream accepted baseline

```text
INK-CORE-INTEGRATION-001 = MR_PASS / PROMOTED / RUNTIME_PASS
PROMOTED_MAIN = b7d013da3a27d0fea0922d83e799c5c51652e53f
GROUNDED_CREATIVE_INTELLIGENCE_CONTEXT = LIVE
```

## Objective

Expose the newly integrated grounded creative-intelligence capabilities through the existing CHAT public tool contract so CHAT can deliberately inspect and reason with them.

Target:

```text
CHAT
→ published bounded tool request
→ grounded creative context / explicit visual compare / explicit parametric structure plan
→ structured read-only result
→ CHAT reasoning / bounded proposal
→ existing preview → approval → execution authority
```

This stage does not authorize direct document mutation by the new tools.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/ai/chat-runtime.js`
7. `product/source/src/ai/creative-intelligence-context.js`
8. `product/source/src/compare/visual-compare.js`
9. `product/source/src/structure/parametric-structure.js`
10. existing CHAT tool/router QA as needed

## Phase A — public tool contract

Extend the existing published CHAT tool surface with a minimal bounded set:

```text
get_grounded_creative_context
compare_visual_subjects
resolve_parametric_structure
```

Requirements:

- explicit stable tool names;
- explicit JSON-compatible input contracts;
- bounded output;
- no raw DOM/Canvas/file/credential access;
- no hidden document write;
- compare requires explicit subjects;
- parametric resolver requires explicit descriptor;
- grounded context uses current authoritative document/provider;
- existing tools remain backward compatible.

Permission class:

```text
get_grounded_creative_context = OBSERVE
compare_visual_subjects = OBSERVE
resolve_parametric_structure = PROPOSE / READ_ONLY_PLAN
```

`resolve_parametric_structure` returns a plan/evidence object only. It must not insert generated nodes into the document.

Gate: `GROUNDED_TOOL_CONTRACT_DEFINED`

## Phase B — ToolCallRouter integration

Wire the three tools into the existing `ToolCallRouter`.

Required behavior:

- reuse the Integration-001 grounded provider/module outputs;
- do not reimplement semantic/provenance/compare/structure algorithms;
- `get_grounded_creative_context` returns the current bounded grounded context;
- `compare_visual_subjects` calls existing Visual Compare only with explicit subjects;
- `resolve_parametric_structure` calls existing Parametric Structure resolver only with explicit descriptor;
- results pass existing secret/redaction/result-envelope rules;
- current document must remain byte-for-byte unchanged;
- current History/Revision state must remain unchanged;
- tool call rate limits and audit rules remain authoritative;
- existing mutation tool permission gates remain unchanged.

Gate: `GROUNDED_TOOL_ROUTER_WORKS`

## Phase C — CHAT request compatibility

Ensure both existing CHAT planning/conversation paths can advertise/use the new published tools without making them mandatory.

Requirements:

- local/manual CHAT remains usable;
- remote provider remains optional;
- existing plan schema remains valid;
- no automatic tool execution;
- model request only receives published definitions;
- unsupported/missing explicit compare or structure input returns bounded diagnostic evidence;
- existing preview/approval/execution/rollback path is unchanged.

Gate: `CHAT_GROUNDED_TOOLS_AVAILABLE`

## Phase D — deterministic/source QA

At minimum verify:

- tool definition names/contracts stable;
- grounded context tool returns current integrated context;
- explicit compare request returns deterministic compare evidence;
- explicit parametric request returns deterministic structure-plan evidence;
- compare missing subjects is rejected/diagnosed;
- parametric missing descriptor is rejected/diagnosed;
- repeated equivalent requests are deterministic;
- source document does not mutate;
- History/Revision state does not mutate;
- OBSERVE permission can use read-only tools;
- no new tool can call execute/approve/restore/commit;
- existing mutation tools preserve their old permission checks;
- existing CHAT tests remain compatible;
- no DOM/network dependency introduced into read-only module path;
- `FORMAT_VERSION = 4`.

Gate: `INK_CORE_INTEGRATION_002_SOURCE_READY`

## Hard boundaries

Do not:

- redesign CHAT UI or add another panel;
- create a second tool router;
- add direct document mutation to the three new tools;
- execute parametric generated nodes;
- auto-create compare subjects or variants;
- alter approval/execution/rollback authority;
- alter Document / History / Revision / Geometry / Renderer authority;
- make network/remote AI mandatory;
- change `FORMAT_VERSION`;
- mutate `package/ink-current`;
- begin the next integration stage.

## Required report

Exactly one:

`research/INK_CORE_INTEGRATION_002_GROUNDED_CREATIVE_TOOL_SURFACE_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-002
BRANCH = work/ink-core-integration-002
GATE = INK_CORE_INTEGRATION_002_SOURCE_READY
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_NEXT_COMPATIBLE_BATCH UNLESS HIGH-RISK_TRIGGER
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
