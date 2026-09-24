# INK-CHAT-CONNECTOR-004 — DEV Handoff

STATUS: `DEV_HANDOFF / MR_REVISION_COMPLETE / BROWSER_FEATURE_QA_READY / STOP`

## Control

```text
TASK_ID = INK-CHAT-CONNECTOR-004
PHASE = USE_INK_PROGRAMMABLE_EXECUTION_FOUNDATION
BRANCH = work/ink-chat-connector-004
BRANCH_BASE = 0495094e0dfff2c5991438909ac132f2a2383499
TARGET_GATE = INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS

FINAL_DEV_HEAD =
  exact final branch HEAD containing this handoff is reported externally
  after this commit, per the existing handoff convention
```

## Changed paths

```text
CHANGED_PRODUCT_FILES =
  product/source/src/agent/capability-registry.js
  product/source/src/agent/public-creative-api.js

CHANGED_QA_FILES =
  qa/ink-chat-connector-001-agent-foundation.test.mjs
  qa/ink-chat-connector-002-visual-asset-feedback.test.mjs
  qa/ink-chat-connector-003-capability-schema-discovery.test.mjs
  qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs

CHANGED_EVIDENCE_FILES =
  research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md
  ACTIVE/INK_DEV_PROGRESS.md
  working/WORKING_STATUS.md
  working/INK_CHAT_CONNECTOR_004_DEV_HANDOFF.md
```

## Public bridge

```text
PUBLIC_API_COMPOSITION_INSPECT = IMPLEMENTED
PUBLIC_API_COMPOSITION_PROPOSE = IMPLEMENTED
PUBLIC_API_COMPOSITION_APPROVE = IMPLEMENTED
PUBLIC_API_COMPOSITION_EXECUTE = IMPLEMENTED
PUBLIC_API_COMPOSITION_CANCEL = IMPLEMENTED

USE_INK_TOOL = IMPLEMENTED / TOOL 19
NAMED_TOOL_TOTAL = 19 / SOURCE_STATIC_PASS
CONNECTOR_003_PREFIX_18 = PRESERVED / SOURCE_STATIC_PASS

COMPOSITION_PROGRAMMABLE_DESCRIPTOR = AVAILABLE / PROPOSAL_REQUIRED
EXTERNAL_TRANSPORT_DESCRIPTOR = UNAVAILABLE
```

Canonical `use_ink` actions:

```text
inspect
propose
approve
execute
cancel
```

Unsupported action:

`INK_USE_INK_ACTION_UNSUPPORTED`

## Authority

```text
PLAN_AUTHORITY = app.chatCreativePlan / EXISTING / UNCHANGED

STEP_AUTHORITY =
  existing Chat Creative Plan per-step bounded-edit authority
  current unchanged implementation = app.chatBoundedEdit controller
  app.chatBoundedEditAdapter remains installed/canonical for existing bounded-edit facade
  no second bounded-edit authority added

HISTORY_AUTHORITY = EXISTING / UNCHANGED
REVISION_AUTHORITY = EXISTING / UNCHANGED
```

Core blob evidence:

```text
CHAT_CREATIVE_PLAN =
  baaa3cc92480ba564acbbe7aa26fabeadc31323e / UNCHANGED

CHAT_BOUNDED_EDIT =
  a0051d60d016d1875a881708e249590b9fe207e3 / UNCHANGED

HISTORY =
  a1c3cefe60b9923d030bcead1d8565b134aebd21 / UNCHANGED

RENDERER =
  b9eabc748e4a357d67febacadc3cacd2be6067ce / UNCHANGED

FORMAT_CONFIG =
  5d5b9791166427f2c46786fd8b33c49b11ea2ff9 / UNCHANGED
```

## Existing plan semantics preserved

```text
PROPOSE_MUTATION_NEUTRAL =
  PRESERVED BY EXISTING AUTHORITY
  connector adds no Document/History/Revision mutation path
  executable focused QA authored

EXECUTE_BEFORE_APPROVAL_REJECTED =
  PRESERVED BY EXISTING ChatCreativePlanController.assertApproved
  executable focused QA authored

STALE_REVISION_REJECTED =
  PRESERVED BY EXISTING execution identity checks
  existing semantics = STOPPED before bounded step mutation
  executable focused QA authored

MID_PLAN_FAILURE_STOPS_REMAINDER =
  PRESERVED BY EXISTING ordered execute loop
  executable focused QA authored

PARTIAL_REVISION_BEHAVIOR_PRESERVED =
  PRESERVED BY EXISTING capturePlanRevision
  executable focused QA authored

CANCEL =
  composition.cancel → existing ChatCreativePlanController.reject
```

## Operation boundary

Exact existing allowlist:

```text
path.repaint.v1
path.material.apply.v1
path.material.remove.v1
object.translate.v1
path.simplify.v1
path.refine.v1
```

```text
BOOLEAN_OPERATION = 0
REPEAT_OPERATION = 0
GROUP_OPERATION = 0
FRAME_OPERATION = 0
COMPONENT_OPERATION = 0
LAYOUT_OPERATION = 0
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

## Focused QA

```text
CONNECTOR_004_FOCUSED_QA =
  qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs
  blob a1a820f7a8b6d95d2dccd4f050d9ebd2dea97b9f

SOURCE_STATIC_FOCUSED_QA = PASS

SOURCE_STATIC_PASS_INCLUDES =
  exact Connector-003 prefix 18
  tool total 19
  use_ink exactly once at position 19
  composition.programmable available
  use_ink / composition.propose mapping
  external.transport unavailable
  exact six-operation allowlist
  five composition methods present
  existing plan authority route present
  use_ink action router present
  no auto Preview inside composition route
  no eval / Function constructor
  no external transport
  no direct app.doc replacement
  existing Chat Creative Plan blob preserved
  existing bounded-edit blob preserved
  existing History blob preserved
  existing Renderer blob preserved
  existing Revision capture route preserved
  FORMAT_VERSION 4

EXECUTABLE_FOCUSED_QA =
  AUTHORED / NOT EXECUTED IN CURRENT DEV ENVIRONMENT

LOCAL_NODE_CHECKOUT =
  NOT AVAILABLE
  reason: DEV environment cannot resolve github.com

FULL_REPOSITORY_NODE_TEST =
  NOT_EXECUTED / NOT_CLAIMED

BROWSER_RUNTIME =
  NOT_EXECUTED / MR EXACT-HEAD STAGE
```

Regression status:

```text
CONNECTOR_001_REGRESSION =
  SOURCE CONTRACT PRESERVED
  exact original 14-tool prefix retained
  executable regression updated for appended tool count

CONNECTOR_002_REGRESSION =
  SOURCE CONTRACT PRESERVED
  Preview/Asset tools remain positions 15–17
  executable regression aligned with canonical Descriptor v1

CONNECTOR_003_REGRESSION =
  SOURCE CONTRACT PRESERVED
  describe_ink_capability remains position 18
  executable regression updated for authorized composition availability

CHAT_CREATIVE_PLAN_REGRESSION =
  CORE BLOB UNCHANGED
  executable Connector-004 behavioral comparison authored

BOUNDED_EDIT_REGRESSION =
  CORE BLOB UNCHANGED
  exact six-operation allowlist source-static PASS

HISTORY_REGRESSION =
  CORE BLOB UNCHANGED

REVISION_REGRESSION =
  existing Chat Creative Plan Revision route unchanged
```

Detailed evidence:

`research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md`

## Gate

`DEV_HANDOFF → STOP → MR exact-HEAD review`

Do not start Connector-005, external transport, new native operation families, UI work, or runtime certification from this handoff.

## MR bounded revision completion — browser feature coverage

```text
MR_BASELINE_HEAD = adb994650c62ea7e917cb15af574545ab0d72d9a
MR_BASELINE_RUNTIME = 35968312192 / PASS / regression only
MR_BLOCKER = use_ink not exercised by browser harness

REVISION_PRODUCT_SOURCE_CHANGE = 0

CHANGED_FOR_REVISION =
  qa/runtime/ink-cloud-018-browser-harness.html
  qa/runtime/run-ink-runtime-batch.mjs
  research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md
  ACTIVE/INK_DEV_PROGRESS.md
  working/WORKING_STATUS.md
  working/INK_CHAT_CONNECTOR_004_DEV_HANDOFF.md
```

Browser evidence now requires:

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

The test plan uses only the existing allowed operations:

```text
path.repaint.v1
object.translate.v1
```

The forbidden-operation check attempts `object.delete.v1` only to prove deterministic rejection before mutation.

```text
NEW_NATIVE_OPERATION_FAMILIES = 0
EXTERNAL_TRANSPORT = 0
AUTO_PREVIEW = 0
UI_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVED
DEV_RUNTIME_PASS_CLAIM = 0
```

Gate:

`DEV_HANDOFF → STOP → MR exact-HEAD review → exact-SHA Runtime rerun`.

