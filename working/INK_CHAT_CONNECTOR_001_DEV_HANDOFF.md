# INK-CHAT-CONNECTOR-001 — DEV Handoff

STATUS: `DEV_HANDOFF / SOURCE_STATIC_ISOLATED_QA_PASS / STOP`

## Control

```text
TASK_ID = INK-CHAT-CONNECTOR-001
PHASE = PUBLIC_API_NAMED_TOOLS_RESULT_ENVELOPE
BRANCH = work/ink-chat-connector-001
REVISED_AUTHORIZATION_MAIN = 3e0d71c9190848b6cffcb642ee0bb9840507a7ff
DEV_HANDOFF_BASE = 611c025d983dbbde2dc8200ddebca0df55011596
IMPLEMENTATION_SOURCE_HEAD = f6495effb2bbcae927a247c26b134089f5ca6cbb
EVIDENCE_REPORT_COMMIT = 62a7761d2f237759cc4ad30fe18b2f9493efe37c
DEV_PROGRESS_COMMIT = bc249a55b18aea6e751cb84a6ebf1e15ea949f18
FINAL_DEV_HEAD = report exact post-handoff commit externally
TARGET_GATE = INK_AGENT_CONNECTOR_FOUNDATION_WORKS
```

## Final changed paths

```text
CHANGED_PRODUCT_FILES =
  product/source/src/agent/index.js
  product/source/src/agent/public-creative-api.js
  product/source/src/ink.js

CHANGED_QA_FILES =
  qa/ink-chat-connector-001-agent-foundation.test.mjs

CHANGED_EVIDENCE_FILES =
  research/INK_CHAT_CONNECTOR_001_AGENT_FOUNDATION_REPORT_v0.1.md
  ACTIVE/INK_DEV_PROGRESS.md
  working/INK_CHAT_CONNECTOR_001_DEV_HANDOFF.md
```

Transient Service Worker/build-identity edits were reverted because the Current Work Order explicitly marks Service Worker/bootstrap/cache changes as a non-goal. Final tree diff for those paths is zero.

## Connector foundation

```text
PUBLIC_API_INSTALL_POINT = app.inkPublicApi / installed once after installChatBoundedEdit(this)
CAPABILITY_REGISTRY = IMPLEMENTED / deterministic / JSON-safe
CAPABILITY_ROUTING_METADATA = READ_ONLY + NAMED_TOOL + PROPOSAL_REQUIRED + PROGRAMMABLE_FUTURE + UNAVAILABLE
NAMED_TOOL_REGISTRY = IMPLEMENTED / 14 Adobe-style narrow tools
INK_AGENT_RESULT_SCHEMA = INK_AGENT_RESULT / version 1 / normalized JSON-safe envelope

DOCUMENT_READ_FACADE = buildAIDocumentBridge
REFERENCE_DECOMPOSITION_DELEGATION = app.chatReferenceHandoff.decomposeReference
BOUNDED_EDIT_DELEGATION = app.chatBoundedEditAdapter
HISTORY_DELEGATION = app.history / existing HistoryManager
REVISION_DELEGATION = app.revisions / existing RevisionController

DIRECT_DOCUMENT_JSON_MUTATION = 0
LIVE_MUTABLE_REFERENCE_RETURNED = 0
SECOND_TOOL_AUTHORITY = 0
SECOND_HISTORY = 0
SECOND_REVISION = 0
SECOND_GEOMETRY = 0
SECOND_DECOMPOSITION = 0
ARBITRARY_EXECUTION_BRIDGE = 0
USE_INK = 0
MCP_PLUGIN_TRANSPORT = 0
PREVIEW_SCREENSHOT_TRANSPORT = 0
NEW_DRAWING_OPERATION = 0
NEW_TRACE = 0
ADOBE_RUNTIME_DEPENDENCY = 0
FORMAT_VERSION = 4 / PRESERVED
```

## Named tools

- `get_ink_capabilities`
- `get_ink_context`
- `get_ink_selection`
- `inspect_ink_objects`
- `decompose_ink_reference`
- `propose_ink_edit`
- `approve_ink_edit`
- `execute_ink_edit`
- `get_ink_history`
- `undo_ink`
- `redo_ink`
- `get_ink_revisions`
- `capture_ink_revision`
- `restore_ink_revision`

## QA / regression evidence

```text
FOCUSED_QA = PASS / exact-source syntax + isolated committed-source behavior harness
FOCUSED_QA_FILE = qa/ink-chat-connector-001-agent-foundation.test.mjs

PHASE_B_REGRESSION =
  BASELINE_PRESERVED / exact test blob identical to current main
  bfb9f62074ebdee159670e635184e2525668beff

BOUNDED_EDIT_REGRESSION =
  BASELINE_PRESERVED / exact test blob identical to current main
  53dfcbea5a301b09003bdcec8fc1c8c96b7b628d

DOCUMENT_HISTORY_REVISION_REGRESSION =
  BASELINE_PRESERVED / exact test blobs identical to current main
  document = 4bc0449d5fe1ae5dc1f41de39bac834db5ae2ce0
  history = b55fdbfa1628a9973c9cd9fe785b35247b1742c3
  revision = 1afde9e32430f2daad297b2ab9b2fad94ca8a992

FULL_REPOSITORY_NODE_TEST_RERUN =
  NOT_EXECUTED / connector-only DEV environment cannot resolve github.com for exact checkout

BROWSER_RUNTIME_QA =
  DEFERRED_TO_MR
```

Authority source blobs are unchanged from current main:

- Document Bridge: `f55262329ea4d792bf55c5fb04e3e342301fddfd`
- Reference Handoff: `7e63499c914670ce6176011d1d88a92c1d472bae`
- bounded edit: `a0051d60d016d1875a881708e249590b9fe207e3`
- History: `a1c3cefe60b9923d030bcead1d8565b134aebd21`
- Revision: `18028bb15866ff07c87d81073a63a3265ff6839e`

Detailed evidence:

`research/INK_CHAT_CONNECTOR_001_AGENT_FOUNDATION_REPORT_v0.1.md`

No unavailable full Node/browser execution is claimed PASS.

## Gate

`DEV_HANDOFF → STOP → MR exact-HEAD review`
