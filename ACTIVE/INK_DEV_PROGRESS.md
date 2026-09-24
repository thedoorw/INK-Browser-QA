# INK DEV PROGRESS

STATUS: `INK-CHAT-CONNECTOR-003 / CAPABILITY_SCHEMA_DISCOVERY / AUTHORIZED / DEV_NOT_STARTED`

```text
TASK_ID = INK-CHAT-CONNECTOR-003
PHASE = SELF_DESCRIBING_CAPABILITY_REGISTRY
BRANCH = work/ink-chat-connector-003
BRANCH_BASE = 652bdb76ef16cac84512b6d57eec1bbbae54580e

ACCEPTED_UPSTREAM =
  INK-CHAT-CONNECTOR-001 / CLOSED / MR_PASS / PROMOTED
  INK-CHAT-CONNECTOR-002 / CLOSED / MR_PASS / PROMOTED

CONNECTOR_002_INTEGRATION_SHA = c728266fa2ec65c2fd53852ae32fd368b9a7d832
CONNECTOR_002_RUNTIME_RUN = 35957389410 / PASS

TARGET_GATE = INK_CAPABILITY_SCHEMA_DISCOVERY_WORKS

CURRENT_NAMED_TOOLS = 17
TARGET_NAMED_TOOLS = 18

CAPABILITY_DESCRIPTOR_V1 = NOT_STARTED
CANONICAL_CAPABILITY_REGISTRY = NOT_STARTED
CAPABILITY_LIST_SUMMARY = NOT_STARTED
CAPABILITY_DESCRIBE = NOT_STARTED
DESCRIBE_INK_CAPABILITY = NOT_STARTED
INPUT_SCHEMA_METADATA = NOT_STARTED
TARGET_TYPE_METADATA = NOT_STARTED
POLICY_METADATA = NOT_STARTED
RESULT_CONTRACT_METADATA = NOT_STARTED
EXAMPLES = NOT_STARTED

USE_INK = 0 / NOT_AUTHORIZED
ARBITRARY_EXECUTION = 0
EXTERNAL_TRANSPORT = 0
AUTO_EXECUTION_FROM_DISCOVERY = 0
GENERIC_JSON_SCHEMA_ENGINE = 0
NEW_DRAWING_OPERATION = 0
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
RENDERER_CHANGE = 0
OUTPUT_HANDLE_CONTRACT_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVE
IMAGE_MODEL = 0
```

## Implementation order

1. inventory all currently registered capability IDs and Named Tools;
2. create one canonical capability metadata registry;
3. define `INK_CAPABILITY_DESCRIPTOR v1`;
4. define bounded input schemas for current capabilities;
5. add stable targetTypes / constraints / policy metadata;
6. derive capability list summaries from the canonical registry;
7. add `capability.describe(idOrToolName)`;
8. append `describe_ink_capability` as Named Tool #18;
9. preserve the existing 17-tool ordered prefix exactly;
10. add deterministic JSON-safe QA and schema consistency checks;
11. run Connector-001 + Connector-002 regressions;
12. update evidence/handoff;
13. `DEV_HANDOFF → STOP`.

## Hard boundaries

Do not add:

- `use_ink`;
- eval / Function / arbitrary JS;
- external MCP/plugin transport;
- automatic capability execution;
- generic JSON Schema validator engine;
- Recipe / Workflow / Creative Session / Creative Library;
- new design semantics;
- new drawing/edit commands;
- Document / History / Revision / Renderer authority;
- UI changes;
- Service Worker/bootstrap/cache changes;
- FORMAT_VERSION changes.

If required: `STOP → MR`.
