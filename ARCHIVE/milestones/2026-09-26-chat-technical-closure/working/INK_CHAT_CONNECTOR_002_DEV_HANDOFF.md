# INK-CHAT-CONNECTOR-002 — DEV Handoff

STATUS: `DEV_HANDOFF / SOURCE_STATIC_ISOLATED_QA_PASS / STOP`

## Control

```text
TASK_ID = INK-CHAT-CONNECTOR-002
PHASE = PREVIEW_OUTPUT_HANDLE_FOUNDATION
BRANCH = work/ink-chat-connector-002
BRANCH_BASE = 9d20eca90b826bf60c23602c6e74ac081251e776
CONNECTOR_001_PROMOTION = efd48a429d9998b4871aebf7bd1e47a576d41a95
TARGET_GATE = INK_VISUAL_ASSET_FEEDBACK_WORKS
FINAL_DEV_HEAD = exact post-handoff HEAD reported externally
```

## Final changed paths

```text
CHANGED_PRODUCT_FILES =
  product/source/src/agent/output-handle-registry.js
  product/source/src/agent/visual-feedback.js
  product/source/src/agent/public-creative-api.js

CHANGED_QA_FILES =
  qa/ink-chat-connector-001-agent-foundation.test.mjs
  qa/ink-chat-connector-002-visual-asset-feedback.test.mjs

CHANGED_EVIDENCE_FILES =
  research/INK_CHAT_CONNECTOR_002_VISUAL_ASSET_FEEDBACK_REPORT_v0.1.md
  ACTIVE/INK_DEV_PROGRESS.md
  working/INK_CHAT_CONNECTOR_002_DEV_HANDOFF.md
```

No UI, Renderer, Document schema, History, Revision, Service Worker, bootstrap, or cache source was changed.

## Visual / asset feedback contract

```text
PREVIEW_PUBLIC_METHOD = preview.capture(options)
PREVIEW_NAMED_TOOL = get_ink_preview

OUTPUT_HANDLE_SCHEMA = INK_OUTPUT_HANDLE / version 1
OUTPUT_HANDLE_REGISTRY = INTERNAL_EPHEMERAL / bounded / content-addressed

ASSET_INSPECT = asset.inspect(handleId) / inspect_ink_output
ASSET_RELEASE = asset.release(handleId) / release_ink_output

EXISTING_NAMED_TOOLS_PRESERVED = 14 / exact prefix
FINAL_NAMED_TOOL_TOTAL = 17

AUTHORITATIVE_RENDER_ROUTE = app.renderExportCanvas(...) + existing Renderer / renderExportWorld
PREVIEW_SCOPES = artboard / viewport / content
PREVIEW_DEFAULT_MAX_DIMENSION = 1200
PREVIEW_MAX_DIMENSION = 1600
PREVIEW_MAX_PIXELS = 2560000
EXISTING_TILED_EXPORT_THRESHOLD = 6000000
PREVIEW_RAW_PAYLOAD_PUBLIC = 0

DOCUMENT_ID_BINDING = YES
PAGE_ID_BINDING = YES
REVISION_ID_BINDING = YES / null allowed
DOCUMENT_FINGERPRINT_BINDING = YES / documentFingerprint(...)
RENDER_FINGERPRINT_BINDING = YES / normalized render request + encoded PNG bytes
OBJECT_REF_BINDING = YES / buildAIDocumentBridge grounded / semantic only / does not alter crop

EPHEMERAL_REGISTRY_MAX_ENTRIES = 8
EPHEMERAL_REGISTRY_MAX_BYTES = 33554432 / 32 MiB
PERSISTENT_ASSET_STORAGE = 0

DOCUMENT_MUTATION = 0
HISTORY_MUTATION = 0
AUTO_REVISION_CAPTURE = 0
SELECTION_MUTATION = 0
SECOND_RENDERER = 0
DOM_SCREENSHOT = 0
USER_EXPORT_UI = 0
USE_INK = 0
CAPABILITY_DISCOVERY = 0
EXTERNAL_TRANSPORT = 0
UI_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVED
```

## QA / regression evidence

```text
FOCUSED_QA =
  PASS
  exact committed-source syntax/static checks
  + isolated committed-source execution harness
  + qa/ink-chat-connector-002-visual-asset-feedback.test.mjs

CONNECTOR_001_REGRESSION =
  COMPAT_PASS
  existing 14 named tools preserved as exact ordered prefix
  Connector-001 focused QA updated only for authorized additive 3-tool surface

DOCUMENT_BRIDGE_REGRESSION =
  BASELINE_PRESERVED
  source blob = f55262329ea4d792bf55c5fb04e3e342301fddfd

BOUNDED_EDIT_REGRESSION =
  BASELINE_PRESERVED
  source blob = a0051d60d016d1875a881708e249590b9fe207e3
  test blob = 53dfcbea5a301b09003bdcec8fc1c8c96b7b628d

HISTORY_REGRESSION =
  BASELINE_PRESERVED
  authority blob = a1c3cefe60b9923d030bcead1d8565b134aebd21
  test blob = b55fdbfa1628a9973c9cd9fe785b35247b1742c3

REVISION_REGRESSION =
  BASELINE_PRESERVED
  authority blob = 18028bb15866ff07c87d81073a63a3265ff6839e
  test blob = 1afde9e32430f2daad297b2ab9b2fad94ca8a992

RENDER_EXPORT_REGRESSION =
  BASELINE_PRESERVED + FOCUSED_AUTHORITY_THRESHOLD_PASS
  product/source/src/ink.js blob = b9eabc748e4a357d67febacadc3cacd2be6067ce
  preview hard bound 2.56M pixels < existing tiled-export threshold 6M pixels

PHASE_B_REGRESSION =
  BASELINE_PRESERVED
  test blob = bfb9f62074ebdee159670e635184e2525668beff

FORMAT_VERSION_REGRESSION =
  PASS / product/source/src/config.js unchanged
  blob = 5d5b9791166427f2c46786fd8b33c49b11ea2ff9

FULL_REPOSITORY_NODE_TEST =
  NOT_CLAIMED / connector-only DEV environment

INHERITED_UI_PHASE_H_FAILURE =
  SEPARATE_RUNTIME_LANE / NOT_MODIFIED / NOT_CLAIMED_RESOLVED

CONNECTOR_BROWSER_RUNTIME =
  NOT_CLAIMED / MR_COORDINATED_AFTER_HANDOFF
```

Detailed evidence:

`research/INK_CHAT_CONNECTOR_002_VISUAL_ASSET_FEEDBACK_REPORT_v0.1.md`

## Exact implementation checkpoints

```text
OUTPUT_REGISTRY_COMMIT = 76fdf7ab4b081562fa43b538c1ffdb6e333f49b2
VISUAL_FEEDBACK_COMMIT = 428798082b1858ac7a35509171b3270f3bf97d9e
PUBLIC_API_WIRING_COMMIT = ee4c206cfc70e9c7016b55b25f36a5591e9715d8
CONNECTOR_001_QA_COMPAT_COMMIT = 799076bef85cc405892bf52ca3df5721e7cd5ec3
FOCUSED_QA_COMMIT = 19d23b6ce89ce6108f2296f725007ab73caeef31
EVIDENCE_REPORT_COMMIT = ac1f5d7e55091945e7b2c13d093d510b7e25eaba
DEV_PROGRESS_COMMIT = 396c6fbc41de6375d0bc6c0c6c146531cef06c82
```

## Gate

`DEV_HANDOFF → STOP → MR exact-HEAD source review`

Do not start Connector-003, `use_ink`, MCP/external transport, UI work, or browser Runtime from this DEV handoff.
