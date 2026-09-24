# INK DEV PROGRESS

STATUS: `INK-CHAT-CONNECTOR-001 / AGENT_CONNECTOR_FOUNDATION / REISSUED / DEV_NOT_STARTED`

```text
TASK_ID = INK-CHAT-CONNECTOR-001
PHASE = PUBLIC_API_NAMED_TOOLS_RESULT_ENVELOPE
BRANCH = work/ink-chat-connector-001
ORIGINAL_BRANCH_BASE = 5d9eeee4c39fb39d1413191033bcb5e78a255e25
REVISED_AUTHORIZATION_MAIN = 3e0d71c9190848b6cffcb642ee0bb9840507a7ff
LATEST_MAIN_SEEN = e40475c28ac4aa43b2a79bcf06198481d2a93b1b
LATEST_MAIN_DELTA = UI-006 Phase F Runtime queue only / no Connector source conflict
TARGET_GATE = INK_AGENT_CONNECTOR_FOUNDATION_WORKS

RESEARCH_BASELINE =
  research/INK_CHAT_CONNECTOR_FIGMA_PENPOT_CAPABILITY_MAP_v0.1.md
  now includes Figma + Penpot + Adobe

DRAWING_VALIDATION =
  Phase C Runtime HOLD
  Phase D-F NOT_AUTHORIZED

PRODUCT_SOURCE_MUTATION = 0 / NOT_STARTED
QA_MUTATION = 0 / NOT_STARTED

PUBLIC_CREATIVE_API = NOT_STARTED
NAMED_TOOL_REGISTRY = NOT_STARTED
INK_AGENT_RESULT = NOT_STARTED
CAPABILITY_ROUTING_METADATA = NOT_STARTED

CONNECTOR_002_PREVIEW = NOT_AUTHORIZED
CONNECTOR_003_USE_INK = NOT_AUTHORIZED
MCP_TRANSPORT = NOT_AUTHORIZED
EXTERNAL_ASSET_TRANSPORT = NOT_AUTHORIZED

DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
DECOMPOSITION_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVE
IMAGE_MODEL = 0
```

## Revised implementation order

1. deterministic Public Creative API capability registry;
2. normalized JSON-safe `INK_AGENT_RESULT` envelope;
3. JSON-safe Document / Selection / Inspect facade;
4. Adobe-style named-tool registry wrapping the same facade;
5. Reference decomposition delegation;
6. bounded edit inspect / propose / approve / execute delegation;
7. History inspect / undo / redo delegation;
8. Revision current / list / capture / restore delegation;
9. install exactly one facade on `InkApp`;
10. focused QA + required regressions;
11. update evidence / handoff;
12. `DEV_HANDOFF → STOP`.

## Routing principle

```text
future CHAT:
named tool first
→ future use_ink only when a named tool is insufficient

Connector-001:
build common authority underneath both
```

## Hard boundary

Do not add:

- `use_ink`, eval, Function or arbitrary execution;
- MCP/plugin external transport;
- preview/screenshot transport;
- external asset transport;
- Adobe/Figma/Penpot runtime dependency;
- Adobe image_vectorize inside INK;
- new drawing operations;
- second Document/History/Revision/Geometry/decomposition authority;
- automatic approval or automatic Revision;
- UI redesign;
- Service Worker/bootstrap/cache changes;
- FORMAT_VERSION changes.

If required: `STOP → MR`.
