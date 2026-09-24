# INK DEV PROGRESS

STATUS: `INK-CHAT-CONNECTOR-004 / USE_INK_PROGRAMMABLE_BRIDGE / DEV_SOURCE_COMPLETE / SOURCE_STATIC_QA_PASS / DEV_HANDOFF_READY`

```text
TASK_ID = INK-CHAT-CONNECTOR-004
PHASE = USE_INK_PROGRAMMABLE_EXECUTION_FOUNDATION
BRANCH = work/ink-chat-connector-004
BRANCH_BASE = 0495094e0dfff2c5991438909ac132f2a2383499
TARGET_GATE = INK_USE_INK_PROGRAMMABLE_BRIDGE_WORKS

UPSTREAM =
  Connector-001 CLOSED / PROMOTED
  Connector-002 CLOSED / PROMOTED
  Connector-003 CLOSED / PROMOTED

IMPLEMENTED_ROUTE =
  use_ink
  → app.inkPublicApi.composition.*
  → app.chatCreativePlan
  → existing Chat Creative Plan bounded-edit authority
  → existing History
  → existing Revision

NAMED_TOOL_TOTAL = 19
APPENDED_TOOL_19 = use_ink
CONNECTOR_003_PREFIX_18 = PRESERVED
composition.programmable = AVAILABLE
external.transport = UNAVAILABLE

PUBLIC_API =
  composition.inspect
  composition.propose
  composition.approve
  composition.execute
  composition.cancel

V0_1_OPERATIONS =
  path.repaint.v1
  path.material.apply.v1
  path.material.remove.v1
  object.translate.v1
  path.simplify.v1
  path.refine.v1

NEW_NATIVE_OPERATION_FAMILIES = 0
ARBITRARY_CODE_EXECUTION = 0
ARBITRARY_APP_METHOD_DISPATCH = 0
SECOND_PLAN_ENGINE = 0
SECOND_HISTORY = 0
SECOND_REVISION = 0
DIRECT_DOCUMENT_JSON_WRITE = 0
AUTO_APPROVAL = 0
AUTO_PREVIEW = 0
EXTERNAL_TRANSPORT = 0
UI_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVED
IMAGE_MODEL = 0
```

## Product / authority preservation

```text
CAPABILITY_REGISTRY_BLOB =
  03c165facf5625febb0d55548793fb8768c0e068

PUBLIC_CREATIVE_API_BLOB =
  34402dbe3e1681b36ea1adec94067300cb534eb8

CHAT_CREATIVE_PLAN_BLOB =
  baaa3cc92480ba564acbbe7aa26fabeadc31323e / UNCHANGED

CHAT_BOUNDED_EDIT_BLOB =
  a0051d60d016d1875a881708e249590b9fe207e3 / UNCHANGED

HISTORY_BLOB =
  a1c3cefe60b9923d030bcead1d8565b134aebd21 / UNCHANGED

RENDERER_BLOB =
  b9eabc748e4a357d67febacadc3cacd2be6067ce / UNCHANGED
```

The existing Chat Creative Plan source remains authoritative. Its pre-existing internal per-step route uses the installed `app.chatBoundedEdit` controller; Connector-004 does not create or replace a bounded-edit authority.

## Focused QA

```text
CONNECTOR_004_QA_FILE =
  qa/ink-chat-connector-004-use-ink-programmable-bridge.test.mjs

CONNECTOR_004_QA_BLOB =
  a1a820f7a8b6d95d2dccd4f050d9ebd2dea97b9f

SOURCE_STATIC_FOCUSED_QA = PASS
EXECUTABLE_FOCUSED_QA = AUTHORED / NOT_EXECUTED IN CURRENT DEV ENVIRONMENT
FULL_REPOSITORY_NODE_TEST = NOT_EXECUTED / NOT_CLAIMED
BROWSER_RUNTIME = NOT_EXECUTED / MR EXACT-HEAD STAGE

LOCAL_CHECKOUT_BLOCKER =
  DEV environment cannot resolve github.com
```

Source-static PASS covers tool ordering/count, descriptor mapping, six-operation boundary, five composition methods, existing authority route, no automatic Preview, no eval/Function, no external transport, no direct Document replacement, preserved core blobs, and FORMAT_VERSION 4.

Connector-001/002/003 regression assertions were updated only for the authorized appended tool / composition availability while preserving their original prefix, Preview/Asset, discovery, transport, and safety contracts.

Detailed evidence:

`research/INK_CHAT_CONNECTOR_004_USE_INK_PROGRAMMABLE_BRIDGE_REPORT_v0.1.md`

## Gate

`DEV_HANDOFF → STOP → MR exact-HEAD review`
