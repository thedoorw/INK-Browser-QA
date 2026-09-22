# INK CURRENT WORK ORDER

STATUS: `INK-CORE-INTEGRATION-004 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CORE-INTEGRATION-004` |
| TITLE | `Grounded Creative Decision & Plan Bridge v0.1` |
| ROLE_OWNER | `MR / CORE INTEGRATION` |
| DEV_WORK_BRANCH | `work/ink-core-integration-004` |
| DEV_MODE | `BOUNDED_INTEGRATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / CHAT PLANNING BRIDGE ONLY` |
| UI_LAYOUT_MUTATION | `PROHIBITED` |
| DOCUMENT_SCHEMA_CHANGE | `PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `PROHIBITED` |
| REVISION_SEMANTICS_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_MUTATION | `PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `PROHIBITED` |
| AUTO_APPROVAL | `PROHIBITED` |
| AUTO_EXECUTION | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_CENTRAL_RUNTIME_QUEUE_UNLESS_MR_HIGH_RISK` |

## Upstream accepted baseline

```text
INK-CORE-INTEGRATION-001 = grounded creative-intelligence context / LIVE
INK-CORE-INTEGRATION-002 = grounded creative tool surface / LIVE
INK-CORE-INTEGRATION-003 = one bounded grounded continuation / LIVE
INK-RUNTIME-AUTOMATION-001 = central Runtime queue / LIVE
```

## Objective

Bridge grounded reasoning into the existing editable creative-plan path without changing execution authority.

Target:

```text
user prompt
→ grounded context / grounded tool reasoning
→ final creative decision
→ structured plan candidate
→ existing INK plan validation
→ editable PROPOSED plan
→ existing user approval
→ existing execution
→ existing Revision / provenance
```

This task does not authorize auto-approval, auto-execution or a second plan/execution engine.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/ai/chat-runtime.js`
7. `product/source/src/ai/creative-intelligence-context.js`
8. `product/source/src/editor/chat-creative-plan.js`
9. `product/source/src/editor/chat-bounded-edit.js`
10. Integration-001/002/003 QA files as needed

## Phase A — grounded decision contract

Define a bounded, deterministic bridge contract for a grounded model result that intends to create an editable plan.

Required fields should include, at minimum:

- decision type / disposition;
- source request identity;
- grounded context fingerprint;
- tool call/result evidence references;
- target object/region references where applicable;
- bounded rationale/assumptions;
- optional structured plan candidate;
- unresolved/unsupported evidence;
- deterministic fingerprint.

The bridge is advisory until the candidate passes existing plan validation.

Gate: `GROUNDED_CREATIVE_DECISION_CONTRACT_DEFINED`

## Phase B — reuse existing plan authority

When a grounded continuation yields a plan candidate:

- normalize only into the existing `INK-CHAT-CREATIVE-PLAN` contract;
- reuse `createChatCreativePlanProposal` / existing plan validation;
- preserve source document/page/revision/fingerprint identity;
- reject stale or ungrounded targets;
- preserve existing operation allowlist and bounded-edit validation;
- preserve dependency graph validation;
- do not invent a second plan schema unless a thin bridge envelope is necessary;
- do not write Document / History / Revision while creating the proposal.

Gate: `GROUNDED_PLAN_PROPOSAL_BRIDGE_WORKS`

## Phase C — user-governed handoff

Required behavior:

```text
grounded result
→ PROPOSED editable plan
→ STOP at existing approval boundary
```

Must not:

- call plan approval automatically;
- generate or consume approval tokens automatically;
- execute bounded edit automatically;
- capture a new Revision merely from reasoning/proposal;
- bypass preview/approval requirements;
- reinterpret a grounded read-only tool result as mutation evidence.

If the result is discussion-only or insufficiently grounded, return discussion/evidence without fabricating a plan.

Gate: `USER_GOVERNED_PLAN_BOUNDARY_PRESERVED`

## Phase D — deterministic/source QA

At minimum verify:

- grounded continuation can yield a valid existing plan candidate;
- grounded context fingerprint and tool evidence remain traceable into bridge metadata;
- equivalent grounded evidence normalizes deterministically;
- stale document/page/revision/fingerprint is rejected by existing validation;
- unknown/hidden object targets are rejected;
- unsupported operation is rejected;
- discussion-only response creates no plan;
- unresolved evidence remains explicit;
- plan proposal causes no document/history/revision mutation;
- approval token is not created during bridge creation;
- execution is not invoked;
- existing Integration-001 QA remains PASS;
- existing Integration-002 QA remains PASS;
- existing Integration-003 QA remains PASS;
- existing creative-plan QA remains PASS;
- `FORMAT_VERSION = 4`.

Gate: `INK_CORE_INTEGRATION_004_SOURCE_READY`

## Runtime disposition

This task enters the central Runtime Queue after MR source PASS + promotion.

Default:

```text
RUNTIME_DEBT = ACCUMULATE
CENTRAL_BATCH_TARGET = 3
```

MR may mark it high-risk and run immediately only if review finds execution-boundary risk.

When eventually covered by Runtime, evidence must include:

- existing CHAT discussion still works;
- grounded reasoning can produce a PROPOSED editable plan;
- no mutation occurs before approval;
- existing approve/execute flow still works unchanged;
- Revision behavior remains intact;
- no fatal runtime error.

## Hard boundaries

Do not:

- add autonomous planning loops;
- auto-approve or auto-execute;
- change creative-plan execution semantics;
- change bounded-edit authority;
- change Document / History / Revision / Geometry / Renderer authority;
- redesign UI;
- require remote AI/network for the core path;
- change FORMAT_VERSION;
- mutate package/ink-current;
- begin Creative Memory or Research→Creation work.

## Required report

`research/INK_CORE_INTEGRATION_004_GROUNDED_CREATIVE_DECISION_PLAN_BRIDGE_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-004
BRANCH = work/ink-core-integration-004
GATE = INK_CORE_INTEGRATION_004_SOURCE_READY
AUTO_APPROVAL = 0
AUTO_EXECUTION = 0
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_CENTRAL_RUNTIME_QUEUE
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
