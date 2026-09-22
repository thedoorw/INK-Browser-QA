# INK CORE INTEGRATION 003 — Bounded Grounded Tool Reasoning Loop Report v0.1

## Status

`INK_CORE_INTEGRATION_003_SOURCE_READY`

Task: `INK-CORE-INTEGRATION-003`  
Branch: `work/ink-core-integration-003`  
Runtime: `PENDING_MR_PROMOTION_AND_WINDOWS_RUNTIME`

## Objective

Close one bounded grounded reasoning cycle without creating an autonomous agent loop:

```text
user prompt
→ first provider response requests an approved grounded read-only tool
→ INK executes only the eligible grounded tool locally
→ INK records a bounded structured tool result
→ the same provider receives exactly one continuation request
→ final grounded response or editable Plan
```

The automatic continuation ceiling is hard-coded to one round.

## Implemented contract

The CHAT runtime now defines:

- `GROUNDED_CONTINUATION_MAX = 1`
- `GROUNDED_TOOL_RESULT_MAX_BYTES = 32768`
- a transport-neutral `INK-GROUNDED-TOOL-CONTINUATION` evidence envelope
- a trace record carrying original request identity, continuation request identity, grounded tool-call IDs, surfaced non-grounded tool IDs, and any second-round tool-call IDs
- bounded JSON-compatible grounded results with deterministic result hashes when truncation is required
- explicit `TOOL_CONTINUATION_LIMIT_REACHED` evidence instead of recursion

Only the following tools are eligible for automatic grounded continuation:

```text
get_grounded_creative_context
compare_visual_subjects
resolve_parametric_structure
```

## Provider-neutral orchestration

Both existing CHAT paths were extended:

- `ChatSessionManager.requestConversation()`
- `ChatSessionManager.requestPlan()`

Behavior:

1. The first provider response is inspected for tool calls.
2. If at least one approved grounded tool is requested, only approved grounded calls are automatically routed.
3. Grounded results are bounded and attached to a second request together with the original CHAT context and stable call/result identity.
4. The same client/provider is invoked exactly once more.
5. Any tool request in that second provider response is evidence only and is never recursively routed.
6. The final text response or editable Plan is returned with continuation trace evidence.
7. Existing no-tool behavior remains a single provider call.

The public response `toolCalls` surface retains the existing first-round contract for backward compatibility. Second-round requests are represented in continuation trace/evidence rather than changing the Integration-002 response contract.

## Authority and safety boundary

Automatic grounded reasoning does not route legacy mutation/proposal/approval/execution tools.

When a non-grounded tool appears during a grounded automatic reasoning phase, INK records `INK-TOOL-INTENT-EVIDENCE` with:

- `status = SURFACED_INTENT`
- `code = NORMAL_USER_GOVERNED_FLOW_REQUIRED`
- `automaticExecution = false`

This preserves the existing preview → approval → execution → rollback authority path.

No changes were made to:

- Document schema or Document authority
- History semantics
- Revision semantics
- Geometry authority
- Renderer
- CHAT execution authority
- UI layout
- `package/ink-current`

`FORMAT_VERSION = 4` is preserved.

## Transmission policy

The continuation request uses the existing CHAT request path and transmission preview/audit policy.

For an external client:

- first transmission still requires the existing user-consent policy;
- the grounded continuation does not create a bypass;
- a consented external grounded cycle produces two audited transmissions: initial request and the single continuation request.

For a local-only client, no network path is introduced.

## Deterministic/source QA

Task-specific deterministic QA:

`qa/core-integration-003-bounded-grounded-reasoning.test.mjs`

Coverage includes:

- grounded context → local result → one continuation → final response;
- visual comparison evidence informs continuation output;
- parametric structure evidence informs continuation output without document insertion;
- stable tool-call/result identity in continuation evidence;
- hard continuation maximum of one;
- second-round grounded tool request yields `TOOL_CONTINUATION_LIMIT_REACHED` and does not recurse;
- initial and second-round non-grounded tool intents are not auto-routed;
- existing legacy mutation counters remain untouched inside the grounded reasoning phase;
- no-tool conversation remains single-round;
- editable Plan continuation path;
- bounded oversized grounded result payload;
- external transmission consent and audit path;
- document/history/revision state unchanged;
- Integration-001 regression;
- Integration-002 regression;
- format version 4 preservation.

### QA evidence

First source-QA run:

- Run: `35731334110`
- SHA: `b8c64a783c7c5aaabcfccb41d0be012f06a86c63`
- Result: FAIL
- Cause: the new Plan continuation path directly called a validator method not present in the Integration-002 test adapter.

Bounded compatibility correction:

- Commit: `92f4bc2dd6cb74b1881a75186a40dad4409326fa`
- restored the existing validator contract;
- preserved the existing first-round response `toolCalls` surface.

Passing source-QA run:

- Run: `35731547730`
- Tested SHA: `92f4bc2dd6cb74b1881a75186a40dad4409326fa`
- Integration-001: PASS
- Integration-002: PASS
- Integration-003: PASS

The task-local GitHub Actions workflow used only to execute this source QA was removed from the DEV branch after evidence was captured.

## Runtime disposition

No Windows/Chrome Runtime closure is claimed by DEV.

Per task governance, Runtime remains:

`PENDING_MR_PROMOTION_AND_WINDOWS_RUNTIME`

The promoted-main runtime batch must verify the existing CHAT conversation path, one grounded continuation, read-only document state, the existing bounded edit/approval/execution path, and runtime health.

## DEV conclusion

```text
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
```
