# INK DEV PROGRESS

STATUS: `INK-CHAT-CONNECTOR-001 / PUBLIC_CREATIVE_API_FACADE / AUTHORIZED / DEV_NOT_STARTED`

```text
TASK_ID = INK-CHAT-CONNECTOR-001
PHASE = PUBLIC_CREATIVE_API_FACADE
BRANCH = work/ink-chat-connector-001
BRANCH_BASE = 5d9eeee4c39fb39d1413191033bcb5e78a255e25
TARGET_GATE = INK_PUBLIC_CREATIVE_API_FOUNDATION_WORKS

RESEARCH_BASELINE =
  research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md

DRAWING_VALIDATION =
  Phase C Runtime HOLD
  Phase D-F NOT_AUTHORIZED

PRODUCT_SOURCE_MUTATION = 0 / NOT_STARTED
QA_MUTATION = 0 / NOT_STARTED

PUBLIC_FACADE = NOT_STARTED
USE_INK_EXECUTION_BRIDGE = NOT_AUTHORIZED
MCP_TRANSPORT = NOT_AUTHORIZED
SCREENSHOT_TRANSPORT = NOT_AUTHORIZED
ASSET_TRANSPORT = NOT_AUTHORIZED

DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
DECOMPOSITION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVE
IMAGE_MODEL = 0
```

## Required implementation order

1. deterministic capability registry;
2. JSON-safe Document / Selection / Inspect facade;
3. Reference decomposition delegation;
4. bounded edit inspect / propose / approve / execute delegation;
5. History inspect / undo / redo delegation;
6. Revision current / list / capture / restore delegation;
7. install exactly one facade on `InkApp`;
8. focused QA + required regressions;
9. update evidence / handoff;
10. `DEV_HANDOFF → STOP`.

## Hard boundary

Do not add:

- arbitrary code execution / eval / Function;
- MCP/plugin transport;
- screenshot transport;
- asset transport;
- new drawing operations;
- second Document/History/Revision/Geometry/decomposition authority;
- automatic approval or automatic Revision;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- FORMAT_VERSION changes.

If required: `STOP → MR`.
