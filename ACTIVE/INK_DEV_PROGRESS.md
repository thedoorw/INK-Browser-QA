# INK DEV PROGRESS

STATUS: `INK-CHAT-CONNECTOR-004 / USE_INK_PROGRAMMABLE_BRIDGE / AUTHORIZED / DEV_NOT_STARTED`

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

AUTHORITATIVE_ROUTE =
  use_ink
  → app.inkPublicApi.composition.*
  → app.chatCreativePlan
  → app.chatBoundedEditAdapter
  → History
  → Revision

TARGET_NAMED_TOOL_TOTAL = 19
APPENDED_TOOL = use_ink
composition.programmable = TO_BECOME_AVAILABLE
external.transport = REMAINS_UNAVAILABLE

V0_1_OPERATIONS =
  path.repaint.v1
  path.material.apply.v1
  path.material.remove.v1
  object.translate.v1
  path.simplify.v1
  path.refine.v1

NEW_NATIVE_OPERATION_FAMILIES = 0
ARBITRARY_CODE_EXECUTION = 0
SECOND_PLAN_ENGINE = 0
SECOND_HISTORY = 0
SECOND_REVISION = 0
DIRECT_DOCUMENT_JSON_WRITE = 0
AUTO_APPROVAL = 0
AUTO_PREVIEW = 0
EXTERNAL_TRANSPORT = 0
FORMAT_VERSION = 4 / PRESERVE
IMAGE_MODEL = 0
```

## Implementation order

1. add `composition.*` Public Creative API adapters over `app.chatCreativePlan`;
2. append Named Tool `use_ink` as tool 19;
3. make `composition.programmable` available in canonical capability registry;
4. route inspect/propose/approve/execute/cancel deterministically;
5. preserve canonical object inputs and JSON-safe `INK_AGENT_RESULT`;
6. preserve explicit approval / stale-state / stop-on-failure / Revision behavior;
7. run Connector-001/002/003 + Chat Creative Plan + bounded-edit regressions;
8. update evidence/handoff;
9. `DEV_HANDOFF → STOP`.

## Hard boundary

Do not add Boolean / Repeat / Group / Frame / Component / Layout command exposure in this Work Order.
Do not add eval / Function / arbitrary app-method dispatch / raw Document writes / external transport / UI changes.
