## MR revision completion / Runtime infrastructure state

```text
REVISION_HEAD = a050e0d87d9b53b2d0ad5c34baffb4a88a070fdc
REVISION_SCOPE = browser QA + Runtime required markers + evidence only
PRODUCT_SOURCE_CHANGE = 0

RUNTIME_RUN = 35970456976
ATTEMPT_1 =
  Windows job 107538744566
  failure before step 1
  steps = 0
  artifacts = 0
  logs = 0
  classification = SELF_HOSTED_RUNNER_START_FAILURE / NOT_PRODUCT_RUNTIME

ATTEMPT_2 =
  Windows job 107541920713
  state = QUEUED
  steps = 0

TARGET_SHA = a050e0d87d9b53b2d0ad5c34baffb4a88a070fdc
MR_SOURCE_RECHECK = PASS
FINAL_RUNTIME_GATE = PENDING_RUNNER
PROMOTION = BLOCKED_UNTIL_REAL_RUNTIME_RESULT
```

Do not revise Connector product source for this infrastructure condition.

# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-004 / MR_RUNTIME_RERUN_QUEUED / SELF_HOSTED_RUNNER_BLOCKED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-004` |
| PHASE | `USE_INK_PROGRAMMABLE_EXECUTION_FOUNDATION` |
| TITLE | `use_ink — CHAT-native programmable composition bridge v0.1` |
| DEV_BRANCH | `work/ink-chat-connector-004` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-003 / CLOSED / MR_PASS / PROMOTED` |
| CONNECTOR_003_PROMOTION | `96f8c553e87fd53b5ca0d2b01cc2972902f2fd69` |
| CONNECTOR_003_RUNTIME | `35961649436 / PASS` |
| TARGET_GATE | `INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |

## Purpose

Connector-004 establishes the general CHAT-native programmable entry:

```text
CHAT
→ Capability Discovery
→ use_ink
→ existing Chat Creative Plan authority
→ existing bounded edit authority
→ existing History
→ existing Revision
→ explicit get_ink_preview when visual verification is needed
```

`use_ink` is declarative plan execution, not arbitrary code execution.

## A — Authoritative route

Required route:

```text
use_ink
→ app.inkPublicApi.composition.*
→ app.chatCreativePlan
→ app.chatBoundedEditAdapter
→ accepted operation authorities
→ History
→ Revision
```

Reuse `product/source/src/editor/chat-creative-plan.js` and its existing proposal / approval / execution / partial-stop / Revision behavior.

Do not create a second plan store, approval-token format, execution loop, History system, Revision system, or Document authority.

## B — Public Creative API

Extend the existing single `app.inkPublicApi` with:

```text
composition.inspect(input?)
composition.propose({ plan })
composition.approve({ planId })
composition.execute({ planId, approvalToken })
composition.cancel({ planId })
```

Canonical object input is authoritative. Backward-compatible positional forms may remain, but Descriptor v1 must describe the canonical object form.

No `composition.*` method may directly mutate `app.doc`.

## C — Named Tool

Append exactly:

```text
19. use_ink
```

Existing 18 Named Tools remain the exact ordered prefix.

Canonical `use_ink` input:

```text
{
  action: "inspect" | "propose" | "approve" | "execute" | "cancel",
  plan?: INK-CHAT-CREATIVE-PLAN / 1,
  planId?: string,
  approvalToken?: string
}
```

Routing:

```text
inspect  → composition.inspect
propose  → composition.propose
approve  → composition.approve
execute  → composition.execute
cancel   → composition.cancel
```

Unknown action returns deterministic FAILED with:

`INK_USE_INK_ACTION_UNSUPPORTED`

The tool is facade/router only. No Document mutation logic belongs in `use_ink`.

## D — Capability Discovery

Change the existing `composition.programmable` descriptor from unavailable to available:

```text
availability = true
namedTool = use_ink
publicMethod = composition.propose
routingClass = PROPOSAL_REQUIRED
```

Descriptor must state:

- no arbitrary JS;
- proposal is mutation-neutral;
- execute requires explicit plan approval token;
- every step still passes bounded-edit validation;
- History and Revision behavior remains the existing Chat Creative Plan behavior;
- Preview remains a separate `get_ink_preview` action.

`external.transport` remains unavailable.

## E — v0.1 operation scope

Connector-004 validates the programmable bridge before expanding operation vocabulary.

Allowed plan step operations remain exactly:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

Do not add Boolean / Repeat / Group / Frame / Component / Layout / raw Path creation or arbitrary property-write operations in this Work Order.

These existing INK capabilities are reserved for a later bounded native-operation exposure stage behind the accepted `use_ink` architecture.

## F — Existing plan semantics must remain authoritative

Preserve:

- 2–32 steps;
- deterministic plan ID and stable step IDs;
- dependency graph validation;
- exact source Document / Revision / fingerprint checks;
- History idle requirement;
- explicit top-level approval;
- execute-before-approval rejection;
- ordered execution;
- stop remaining steps after failure;
- partial execution receipt;
- existing partial/final Revision capture;
- stale Revision rejection;
- no autonomous retry loop.

The existing Chat Creative Plan controller may continue its accepted per-step bounded-edit technical approval only after the explicit top-level plan approval gate is passed.

## G — Result envelope

All `composition.*` methods and `use_ink` return existing `INK_AGENT_RESULT / 1`.

Map real plan receipts into existing fields where available:

```text
status
targetRefs[]
createdRefs[]
changedRefs[]
historyReceipt
revisionReceipt
diagnostics[]
result
```

Do not fabricate refs/status. Keep the raw JSON-safe plan receipt under `result` when useful.

## H — Inspection

`composition.inspect()` must return bounded JSON-safe data from the existing Chat Creative Plan authority only. No live controller record/reference may escape.

At minimum expose plan ID, status, approval state, intent summary, step count/progress, and source Document/Revision identity when the existing authority provides them.

## I — Preview relationship

Expected closed loop:

```text
use_ink(propose)
→ explicit approval
→ use_ink(execute)
→ INK_AGENT_RESULT
→ get_ink_preview
→ visual inspection
→ next bounded plan if needed
```

No automatic Preview generation in Connector-004.

## J — Security boundary

Strictly prohibited:

```text
eval
Function constructor
dynamic import from user input
arbitrary app[method] dispatch
arbitrary property-path writes
raw Document JSON replacement
user-supplied callback/function
unregistered operation execution
unrestricted window/global bridge
MCP transport
postMessage transport
WebSocket transport
```

Every executable step remains inside the accepted bounded-edit allowlist.

## K — Canonical metadata authority

Connector-003 `capability-registry.js` remains the single metadata authority.

Expected:

```text
Named Tools = 19
composition.programmable = available
external.transport = unavailable
```

Do not maintain a second independent `use_ink` metadata table.

## L — Required QA

Focused QA must cover:

1. existing 18 tools remain exact prefix; total = 19;
2. `use_ink` appended exactly once;
3. `composition.programmable` available and mapped to `use_ink`;
4. `external.transport` still unavailable;
5. no eval / Function / arbitrary dispatch / direct Document write;
6. inspect/propose are mutation-neutral;
7. proposal identity/state matches direct Chat Creative Plan;
8. execute-before-approval rejected;
9. approve uses existing plan approval-token contract;
10. execute delegates to existing Chat Creative Plan;
11. unsupported step operation still rejected by bounded edit;
12. deterministic two-step execution order;
13. History behavior matches direct Chat Creative Plan;
14. Revision behavior matches direct Chat Creative Plan;
15. stale Revision blocks before mutation;
16. mid-plan failure stops remaining steps;
17. partial-success Revision behavior preserved;
18. cancel preserves existing semantics;
19. unknown action returns `INK_USE_INK_ACTION_UNSUPPORTED`;
20. canonical object input works through Named Tool and Public API;
21. result JSON-safe; no live refs/functions/binary;
22. no automatic Preview;
23. Connector-001/002/003 QA remain PASS;
24. Chat Creative Plan unit/source QA remain PASS;
25. bounded edit / History / Revision regressions remain PASS;
26. `FORMAT_VERSION = 4`;
27. Web / Portable share implementation.

## M — Runtime coordination

UI/main work remains a separate lane. Connector DEV must not rewrite UI or central Runtime queue.

```text
DEV = source + focused QA
DEV_HANDOFF → STOP
browser Runtime = MR exact-HEAD stage
```

## Explicit non-goals

- new geometry algorithm;
- new Boolean/Repeat engine;
- new Group/Frame/Component/Layout command exposure;
- arbitrary native-object mutation;
- external connector transport;
- Creative Library / Recipe / Workflow / Creative Session / Design Critic;
- automatic approval;
- autonomous agent loop;
- automatic Preview;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- Document schema / FORMAT_VERSION change.

## Planned next — not authorized by Connector-004

```text
Native operation exposure
= Boolean / Repeat / Group / Frame / Component / Layout
  added behind accepted use_ink

Connector-005
= INK Skill / Capability Router

Connector-006
= Creative Library + Recipe

Connector-007
= Creative Session + reusable Workflow

Connector-008
= Design Critic / Fix

Final
= full creative closed loop
```

## MR bounded revision — browser feature coverage

```text
REVIEW_HEAD = adb994650c62ea7e917cb15af574545ab0d72d9a
SOURCE_REVIEW = PASS
EXACT_SHA_RUNTIME = PASS / REGRESSION ONLY
RUNTIME_RUN = 35968312192
RUNTIME_TESTED_SHA = adb994650c62ea7e917cb15af574545ab0d72d9a

BLOCKER =
  browser Runtime does not exercise use_ink / composition.*
  therefore target gate is not yet proven

MR = REVISE
PROMOTION = BLOCKED
```

### Revision scope

Stay on:

`work/ink-chat-connector-004`

Product source is frozen unless browser QA exposes a real defect.

Authorized:

```text
qa/runtime/ink-cloud-018-browser-harness.html
qa/runtime/run-ink-runtime-batch.mjs
qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs   (only if needed)
research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
working/WORKING_STATUS.md
working/INK_CHAT_CONNECTOR_004_DEV_HANDOFF.md
```

Required new browser checks:

```text
USE_INK_TOOL_AVAILABLE
USE_INK_PROPOSE_MUTATION_NEUTRAL
USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL
USE_INK_APPROVAL_TOKEN_ISSUED
USE_INK_TWO_STEP_EXECUTION_ORDERED
USE_INK_HISTORY_RECORDED
USE_INK_FINAL_REVISION_CAPTURED
USE_INK_UNSUPPORTED_ACTION_REJECTED
USE_INK_NO_AUTO_PREVIEW
```

Equivalent marker names are acceptable, but `run-ink-runtime-batch.mjs` must require them.

No new native operation families, external transport, UI changes, eval/arbitrary execution, or FORMAT_VERSION change.

Return:

`DEV_HANDOFF → STOP`.


## Gate

```text
DEV_AUTHORIZED
→ implement use_ink facade over existing Chat Creative Plan
→ focused QA + regressions
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ MR exact-SHA Runtime
→ MR_PASS / MR_REVISE
```

Acceptance:

`INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS`
