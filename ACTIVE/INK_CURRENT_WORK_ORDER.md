# INK CURRENT WORK ORDER

STATUS: `INK-CORE-INTEGRATION-003 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CORE-INTEGRATION-003` |
| TITLE | `Bounded Grounded Tool Reasoning Loop v0.1` |
| ROLE_OWNER | `MR / CORE INTEGRATION` |
| DEV_WORK_BRANCH | `work/ink-core-integration-003` |
| DEV_MODE | `BOUNDED_INTEGRATION` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / CHAT ORCHESTRATION ONLY` |
| UI_LAYOUT_MUTATION | `PROHIBITED` |
| DOCUMENT_SCHEMA_CHANGE | `PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `PROHIBITED` |
| REVISION_SEMANTICS_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_MUTATION | `PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `PROHIBITED` |
| AUTONOMOUS_AGENT_LOOP | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `REQUIRED_AFTER_MR_PASS_AND_PROMOTION` |

## Upstream accepted baseline

```text
INK-CORE-INTEGRATION-001 = grounded creative-intelligence context / LIVE
INK-CORE-INTEGRATION-002 = grounded creative tool surface / PROMOTED
PROMOTED_MAIN = 4b03897d7ba984bcbe0898ab3ebaa0a5c2df7138
```

## Objective

Close one bounded reasoning cycle:

```text
user prompt
→ model requests grounded read-only tool
→ INK executes approved grounded read-only tool locally
→ structured tool result
→ one bounded model continuation using that result
→ final grounded response or editable Plan
```

This is not an autonomous agent loop. It is a single bounded tool continuation.

## Allowed automatic tool set

Only these tools may participate in the automatic continuation loop:

```text
get_grounded_creative_context
compare_visual_subjects
resolve_parametric_structure
```

No legacy mutation/proposal/approval/execution tool may be auto-executed as part of the continuation loop.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/ai/chat-runtime.js`
7. `product/source/src/ai/creative-intelligence-context.js`
8. `qa/core-integration-002-grounded-tool-surface.test.mjs`
9. relevant provider adapters / request-response contracts

## Phase A — bounded continuation contract

Define a transport-neutral continuation contract for grounded tools.

Requirements:

- exactly one automatic continuation round by default;
- hard maximum = 1 continuation round in v0.1;
- only grounded tool names are eligible;
- tool call IDs and results remain stable and auditable;
- tool result payload is bounded and JSON-compatible;
- no hidden user approval;
- no tool result may be treated as a document mutation result;
- if provider asks for another tool after the continuation round, return bounded `TOOL_CONTINUATION_LIMIT_REACHED` evidence instead of recursing.

Gate: `GROUNDED_CONTINUATION_CONTRACT_DEFINED`

## Phase B — provider-neutral orchestration

Add orchestration in the existing CHAT runtime/session path.

Required behavior:

- first model response may contain grounded tool calls;
- INK executes only eligible grounded tools;
- collect structured tool results;
- build a continuation request containing original context + tool calls + tool results;
- call the same provider once more;
- return final response/Plan plus traceable tool evidence;
- local/manual deterministic client path must remain testable;
- remote provider remains optional;
- no direct Document / History / Revision / Geometry / Renderer write;
- no direct DOM/file/credential access;
- existing transmission approval policy remains authoritative for external continuation calls.

Gate: `GROUNDED_CONTINUATION_ORCHESTRATION_WORKS`

## Phase C — safety / authority boundary

Automatic continuation must never execute:

```text
create_plan
request_preview
request_approval
execute_approved_plan
rollback_execution
save_variant
export_document
or any other legacy mutating/proposal tool
```

If any non-grounded tool is returned during the automatic reasoning phase:

- preserve it as surfaced tool intent/evidence;
- do not route it automatically;
- final response must indicate that normal existing user-governed flow is required.

Existing explicit preview → approval → execution → rollback semantics remain unchanged.

Gate: `GROUNDED_REASONING_AUTHORITY_PRESERVED`

## Phase D — deterministic/source QA

At minimum verify:

- grounded tool call → local tool result → one continuation → final response;
- grounded compare result can inform final response;
- parametric structure result can inform final response without document insertion;
- continuation request contains traceable tool call/result identity;
- max continuation round = 1;
- second-round tool request does not recurse;
- non-grounded tool request is not auto-routed;
- existing explicit mutation permission gates remain unchanged;
- external continuation still requires normal transmission consent/policy;
- local-only mode performs no network call;
- document/history/revision remain unchanged;
- existing Integration-001 and Integration-002 QA remain PASS;
- `FORMAT_VERSION = 4`.

Gate: `INK_CORE_INTEGRATION_003_SOURCE_READY`

## Runtime gate

This task changes CHAT orchestration semantics, so Runtime may not be deferred at final closure.

After MR source PASS and clean promotion:

```text
exact promoted main SHA
→ self-hosted Windows Chrome Runtime
→ existing UI / Creative / Geometry suites
→ task-specific grounded continuation browser evidence
```

At minimum Runtime must verify:

- existing CHAT conversation still works without tool calls;
- one grounded tool-call continuation completes;
- document remains unchanged during read-only reasoning;
- existing bounded edit / approval / execution path still works;
- no fatal runtime health error.

Final gate:

`INK_CORE_INTEGRATION_003_RUNTIME_PASS`

## Hard boundaries

Do not:

- create autonomous recursive agents;
- allow more than one automatic continuation round;
- auto-route legacy mutation/proposal tools;
- alter user approval/execution authority;
- redesign UI;
- alter Document / History / Revision / Geometry / Renderer authority;
- make network mandatory;
- change `FORMAT_VERSION`;
- mutate `package/ink-current`;
- begin another integration stage.

## Required report

Exactly one:

`research/INK_CORE_INTEGRATION_003_BOUNDED_GROUNDED_TOOL_REASONING_LOOP_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CORE-INTEGRATION-003
BRANCH = work/ink-core-integration-003
GATE = INK_CORE_INTEGRATION_003_SOURCE_READY
AUTONOMOUS_AGENT_LOOP = 0
AUTO_CONTINUATION_MAX = 1
AUTO_LEGACY_MUTATION_TOOL_EXECUTION = 0
UI_LAYOUT_MUTATION = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = PENDING_MR_PROMOTION_AND_WINDOWS_RUNTIME
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
