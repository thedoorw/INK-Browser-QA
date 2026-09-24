# INK-CHAT-CONNECTOR-004 — use_ink Programmable Bridge Evidence v0.1

STATUS: `MR_REVISION_COMPLETE / BROWSER_FEATURE_QA_READY / RUNTIME_RERUN_PENDING`

## Control

```text
TASK_ID = INK-CHAT-CONNECTOR-004
PHASE = USE_INK_PROGRAMMABLE_EXECUTION_FOUNDATION
BRANCH = work/ink-chat-connector-004
BRANCH_BASE = 0495094e0dfff2c5991438909ac132f2a2383499
TARGET_GATE = INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS
FORMAT_VERSION = 4 / PRESERVED
```

## Implemented route

```text
CHAT
→ Capability Discovery
→ use_ink
→ app.inkPublicApi.composition.*
→ app.chatCreativePlan
→ existing Chat Creative Plan per-step bounded-edit authority
→ existing History
→ existing Revision
```

No second plan engine, plan store, approval-token system, bounded-edit engine, History, Revision, Renderer, Preview engine, or Document authority was added.

The existing `chat-creative-plan.js` source is unchanged. Its pre-existing execution path uses the installed `app.chatBoundedEdit` controller, which is the same bounded-edit authority installed alongside `app.chatBoundedEditAdapter`. Connector-004 does not rewrite that internal route.

## Product delta

```text
product/source/src/agent/capability-registry.js
  blob = 03c165facf5625febb0d55548793fb8768c0e068

product/source/src/agent/public-creative-api.js
  blob = 34402dbe3e1681b36ea1adec94067300cb534eb8

product/source/src/agent/index.js
  blob = 63c45cc687c77ef8ec43ea5067831f0aed2339c1 / UNCHANGED
```

### Public Creative API

Added bounded facades only:

```text
composition.inspect(input?)
composition.propose({ plan })
composition.approve({ planId })
composition.execute({ planId, approvalToken })
composition.cancel({ planId })
```

All outputs remain `INK_AGENT_RESULT / 1`. Plan receipts are converted to grounded refs / History / Revision / diagnostics where available and retain the JSON-safe raw plan receipt under `result`.

### Named Tool

```text
CONNECTOR_003_PREFIX = exact tools 1–18 / PRESERVED
TOOL_19 = use_ink
NAMED_TOOL_TOTAL = 19
USE_INK_DUPLICATE_COUNT = 0
```

Canonical action vocabulary:

```text
inspect
propose
approve
execute
cancel
```

Unknown action diagnostic:

```text
INK_USE_INK_ACTION_UNSUPPORTED
```

### Capability registry

```text
composition.programmable
  availability = true
  routingClass = PROPOSAL_REQUIRED
  namedTool = use_ink
  publicMethod = composition.propose

external.transport
  availability = false
  namedTool = null
```

The Descriptor explicitly preserves proposal-first execution, explicit plan approval, existing bounded-edit validation, History/Revision authority, and separate Preview verification.

## Operation boundary

The existing bounded-edit operation list remains exact:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

Not added:

```text
Boolean
Repeat
Group
Frame
Component
Layout
arbitrary path mutation
arbitrary property write
```

## Authority preservation

GitHub SSOT blob checks:

```text
CHAT_CREATIVE_PLAN =
  baaa3cc92480ba564acbbe7aa26fabeadc31323e / UNCHANGED

CHAT_BOUNDED_EDIT =
  a0051d60d016d1875a881708e249590b9fe207e3 / UNCHANGED

HISTORY =
  a1c3cefe60b9923d030bcead1d8565b134aebd21 / UNCHANGED

RENDERER / product source ink.js =
  b9eabc748e4a357d67febacadc3cacd2be6067ce / UNCHANGED

FORMAT_VERSION =
  4 / config blob 5d5b9791166427f2c46786fd8b33c49b11ea2ff9 / UNCHANGED
```

The unchanged Chat Creative Plan authority still owns:

- deterministic plan identity;
- 2–32 step validation and dependency order;
- exact source Document/Page/Revision/fingerprint checks;
- History-idle precondition;
- explicit top-level plan approval token;
- execute-before-approval rejection;
- ordered per-step bounded execution;
- stop-on-first-failure semantics;
- partial-success receipt;
- partial/final Revision capture.

## Focused QA

Added:

`qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs`

Blob:

`a1a820f7a8b6d95d2dccd4f050d9ebd2dea97b9f`

Executable QA covers:

1. exact Connector-003 18-tool prefix + one `use_ink`;
2. exact six-operation vocabulary;
3. direct-plan vs facade proposal identity;
4. propose/inspect Document-History-Revision neutrality;
5. execute-before-approval rejection;
6. explicit approval token;
7. deterministic ordered execution;
8. History receipts;
9. final Revision capture;
10. canonical `use_ink` object routing;
11. cancel → existing rejection semantics;
12. unsupported action diagnostic;
13. unsupported operation rejection;
14. stale Revision stop-before-step-mutation;
15. mid-plan failure stop / remaining-step suppression;
16. partial-success Revision capture;
17. direct Chat Creative Plan vs facade behavioral equivalence;
18. JSON-safe envelopes;
19. no automatic Preview;
20. no eval / Function / arbitrary app dispatch / direct Document replacement / external transport;
21. FORMAT_VERSION 4.

### Source-static focused QA executed against GitHub SSOT

```text
CONNECTOR_003_PREFIX_18 = PASS
NAMED_TOOL_TOTAL_19 = PASS
USE_INK_EXACTLY_ONCE_AT_19 = PASS
COMPOSITION_PROGRAMMABLE_AVAILABLE = PASS
COMPOSITION_NAMED_TOOL_MAPPING = PASS
COMPOSITION_PUBLIC_METHOD_MAPPING = PASS
COMPOSITION_ROUTING_CLASS = PASS
EXTERNAL_TRANSPORT_UNAVAILABLE = PASS
ALLOWED_OPERATIONS_EXACT_6 = PASS
COMPOSITION_METHODS_5 = PASS
PLAN_AUTHORITY_ROUTE_PRESENT = PASS
USE_INK_ACTION_ROUTER = PASS
NO_AUTO_PREVIEW_IN_COMPOSITION = PASS
NO_EVAL_OR_FUNCTION_CONSTRUCTOR = PASS
NO_EXTERNAL_TRANSPORT = PASS
NO_DIRECT_DOCUMENT_REPLACEMENT = PASS
CHAT_CREATIVE_PLAN_BLOB_PRESERVED = PASS
CHAT_BOUNDED_EDIT_BLOB_PRESERVED = PASS
HISTORY_BLOB_PRESERVED = PASS
RENDERER_BLOB_PRESERVED = PASS
FORMAT_VERSION_4 = PASS
EXISTING_PLAN_BOUNDED_ROUTE_PRESENT = PASS
EXISTING_PLAN_REVISION_CAPTURE_PRESENT = PASS
```

## Regression QA updates

The Connector-001/002/003 regression files were changed only where old assertions assumed the previous terminal tool count / previous unavailable state:

```text
qa/ink-chat-connector-001-agent-foundation.test.mjs
  blob = 134f861230c40f9b156bcf4844e7f03297b3edd6

qa/ink-chat-connector-002-visual-asset-feedback.test.mjs
  blob = 622342400003e65cefcb7ad512b13fa11a65a7e2

qa/ink-chat-connector-003-capability-schema-discovery.test.mjs
  blob = 7fb4f0d4e1c8e061ec90c192694763d12e982bc3
```

Preserved regression intent:

- Connector-001 exact 14-tool prefix remains unchanged;
- Connector-002 Preview / inspect-output / release-output remain positions 15–17;
- Connector-003 `describe_ink_capability` remains position 18;
- Connector-004 alone appends `use_ink` at position 19;
- external transport remains unavailable;
- security / no-direct-document-write boundaries remain active.

## Execution limitation

A local checkout / Node test attempt was made from the DEV environment, but that environment cannot resolve GitHub:

```text
git clone ...
fatal: unable to access 'https://github.com/thedoorw/INK-Browser-QA.git/':
Could not resolve host: github.com
```

Therefore:

```text
SOURCE_STATIC_FOCUSED_QA = PASS
EXECUTABLE_FOCUSED_QA = AUTHORED / NOT_EXECUTED IN THIS DEV ENVIRONMENT
FULL_REPOSITORY_NODE_TEST = NOT_EXECUTED / NOT_CLAIMED
BROWSER_RUNTIME = NOT_EXECUTED / MR EXACT-HEAD STAGE
```

No runtime PASS is claimed from unexecuted tests.

## Boundary result

```text
ARBITRARY_CODE_EXECUTION = 0
ARBITRARY_APP_METHOD_DISPATCH = 0
DIRECT_DOCUMENT_JSON_WRITE = 0
NEW_NATIVE_OPERATION_FAMILIES = 0
AUTO_APPROVAL = 0
AUTO_PREVIEW = 0
EXTERNAL_TRANSPORT = 0
UI_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVED
```

## Gate

`DEV_HANDOFF → STOP → MR exact-HEAD source review / executable QA / browser runtime as authorized`

## MR revision — real-browser use_ink coverage

MR found that run `35968312192` passed UI / Creative / Geometry at exact SHA
`adb994650c62ea7e917cb15af574545ab0d72d9a`, but the then-current browser harness did not call `use_ink` or `composition.*`.

The bounded revision adds browser execution without changing Connector product source.

### Browser path now exercised

```text
app.inkPublicApi.tools.invoke("use_ink", ...)
→ propose
→ execute-before-approval rejection
→ approve
→ execute two ordered bounded steps
→ History receipts
→ final Chat Creative Plan Revision
→ unsupported action rejection
→ forbidden operation rejection
→ no automatic Preview
```

Required markers:

```text
USE_INK_TOOL_AVAILABLE
USE_INK_PROPOSE_MUTATION_NEUTRAL
USE_INK_EXECUTE_BLOCKED_BEFORE_APPROVAL
USE_INK_APPROVAL_TOKEN_ISSUED
USE_INK_TWO_STEP_EXECUTION_ORDERED
USE_INK_HISTORY_RECORDED
USE_INK_FINAL_REVISION_CAPTURED
USE_INK_UNSUPPORTED_ACTION_REJECTED
USE_INK_FORBIDDEN_OPERATION_REJECTED
USE_INK_NO_AUTO_PREVIEW
```

`qa/runtime/run-ink-runtime-batch.mjs` now treats all ten as required Creative checks.

### Authority preservation during revision

```text
product/source/src/agent/capability-registry.js = UNCHANGED
product/source/src/agent/public-creative-api.js = UNCHANGED
Chat Creative Plan = UNCHANGED
bounded edit = UNCHANGED
History = UNCHANGED
Revision = UNCHANGED
Renderer = UNCHANGED
FORMAT_VERSION = 4
```

Final exact-SHA browser Runtime is MR stage and is not claimed by DEV.

