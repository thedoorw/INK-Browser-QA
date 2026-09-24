# INK DEV PROGRESS

STATUS: `INK-CHAT-CONNECTOR-002 / VISUAL_ASSET_FEEDBACK / AUTHORIZED / DEV_NOT_STARTED`

```text
TASK_ID = INK-CHAT-CONNECTOR-002
PHASE = PREVIEW_OUTPUT_HANDLE_FOUNDATION
BRANCH = work/ink-chat-connector-002
BRANCH_BASE = 9d20eca90b826bf60c23602c6e74ac081251e776
CONNECTOR_001_PROMOTION = efd48a429d9998b4871aebf7bd1e47a576d41a95
TARGET_GATE = INK_VISUAL_ASSET_FEEDBACK_WORKS

PUBLIC_API_BASE = app.inkPublicApi / Connector-001
EXISTING_NAMED_TOOLS = 14
TARGET_NAMED_TOOLS = 17

PREVIEW_CAPTURE = NOT_STARTED
INK_OUTPUT_HANDLE = NOT_STARTED
EPHEMERAL_OUTPUT_REGISTRY = NOT_STARTED
ASSET_INSPECT = NOT_STARTED
ASSET_RELEASE = NOT_STARTED

USE_INK = 0 / NOT_AUTHORIZED
CAPABILITY_DISCOVERY = 0 / RESERVED_FOR_CONNECTOR_003
MCP_PLUGIN_TRANSPORT = 0 / NOT_AUTHORIZED
PERSISTENT_ASSET_LIBRARY = 0
NEW_RENDERER = 0
DOM_SCREENSHOT = 0
NEW_DRAWING_OPERATION = 0
NEW_TRACE = 0
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVE
IMAGE_MODEL = 0

UI_PHASE_H_BASELINE = RUNTIME_FAIL / SEPARATE_REVISION_LANE
CONNECTOR_DEV_MUST_NOT_FIX_UI = 1
FINAL_BROWSER_RUNTIME = MR_COORDINATED_AFTER_HANDOFF
```

## Implementation order

1. add bounded internal output-handle registry;
2. define deterministic JSON-safe `INK_OUTPUT_HANDLE v1`;
3. add preview capture using existing `app.renderExportCanvas`;
4. bind Document/Page/Revision/Document fingerprint/render fingerprint;
5. add `asset.inspect` stale/availability reporting;
6. add `asset.release`;
7. extend `INK_AGENT_RESULT.outputHandles[]`;
8. add 3 named tools and capability metadata;
9. keep all 14 Connector-001 tools compatible;
10. run focused QA + required source/unit regressions;
11. update evidence/handoff;
12. `DEV_HANDOFF → STOP`.

## Hard boundaries

Do not add:

- second renderer or DOM screenshot;
- user-facing export/download behavior;
- raw Blob/Canvas/data URL/ObjectURL in agent results;
- persistent/cloud asset storage;
- external connector/MCP transport;
- `use_ink`;
- capability schema discovery;
- selection/object crop preview;
- Document/History/Revision/Geometry authority changes;
- UI fixes for the inherited UI-006 Phase H failure;
- Service Worker/bootstrap/cache changes;
- FORMAT_VERSION changes.

If required: `STOP → MR`.
