# INK-CHAT-CONNECTOR-002 — Visual / Asset Feedback Evidence v0.1

STATUS: `DEV_SOURCE_STATIC_ISOLATED_QA_PASS / HANDOFF_READY`

## Scope

Implemented the authorized Connector-002 visual-feedback foundation only:

- `preview.capture(options)` / `get_ink_preview`;
- `INK_OUTPUT_HANDLE v1`;
- bounded internal ephemeral output registry;
- `asset.inspect(handleId)` / `inspect_ink_output`;
- `asset.release(handleId)` / `release_ink_output`;
- Connector-001 named-tool registry extended from 14 to 17.

The implementation reuses the existing `app.renderExportCanvas(...)` / Renderer path. It does not add a renderer, UI export path, persistent asset store, external transport, `use_ink`, capability discovery, or FORMAT_VERSION change.

## Exact branch baseline / implementation checkpoints

```text
BRANCH = work/ink-chat-connector-002
BRANCH_BASE = 9d20eca90b826bf60c23602c6e74ac081251e776
CONNECTOR_001_PROMOTION = efd48a429d9998b4871aebf7bd1e47a576d41a95

OUTPUT_REGISTRY_COMMIT = 76fdf7ab4b081562fa43b538c1ffdb6e333f49b2
VISUAL_FEEDBACK_COMMIT = 428798082b1858ac7a35509171b3270f3bf97d9e
PUBLIC_API_WIRING_COMMIT = ee4c206cfc70e9c7016b55b25f36a5591e9715d8
CONNECTOR_001_QA_COMPAT_COMMIT = 799076bef85cc405892bf52ca3df5721e7cd5ec3
FOCUSED_QA_COMMIT = 19d23b6ce89ce6108f2296f725007ab73caeef31
FORMAT_VERSION = 4 / PRESERVED
```

## Product implementation

Changed product files:

- `product/source/src/agent/output-handle-registry.js`
- `product/source/src/agent/visual-feedback.js`
- `product/source/src/agent/public-creative-api.js`

No changes were made to `product/source/src/ink.js`, Renderer, Document schema, History, Revision, Service Worker, bootstrap, or UI.

### Preview authority

```text
Public API / Named Tool
→ preview.capture / get_ink_preview
→ bounded request planning
→ app.renderExportCanvas(...)
→ existing Renderer / renderExportWorld path
→ canvas.toBlob("image/png")
→ internal ephemeral registry
→ JSON-safe INK_OUTPUT_HANDLE v1
```

Supported scopes:

- `artboard`
- `viewport`
- `content`

Optional refs are validated through `buildAIDocumentBridge` and participate only in semantic output binding. They do not alter render crop/options.

Preview bounds:

```text
DEFAULT_MAX_DIMENSION = 1200
HARD_MAX_DIMENSION = 1600
HARD_MAX_PIXELS = 2,560,000
EXISTING_TILED_EXPORT_THRESHOLD = 6,000,000 pixels
INCLUDE_BLEED = false
CROP_MARKS = false
FORMAT = image/png
```

Because preview planning is bounded below the existing 6M-pixel tiled-export threshold, the connector does not enter the user-facing tiled export/progress path.

## INK_OUTPUT_HANDLE v1

Descriptor:

```text
schema = INK_OUTPUT_HANDLE
version = 1
kind = preview
format = png
mimeType = image/png
transport = INTERNAL_EPHEMERAL
persistence = NONE
```

Bindings included:

- document ID;
- active page ID;
- current revision ID or null;
- exact `documentFingerprint(...)`;
- normalized render request;
- scope/world bounds;
- actual pixel size;
- background semantics;
- validated object refs;
- encoded PNG byte length;
- encoded PNG byte fingerprint contribution;
- deterministic render fingerprint.

`handleId` is deterministic/content-addressed from the normalized output identity, not a random UUID.

Public descriptors contain no Blob, Canvas, DOM node, ObjectURL, data URL/base64, function, or live mutable Document/Object reference.

## Ephemeral output registry

```text
MAX_ENTRIES = 8
MAX_TOTAL_BYTES = 32 MiB
PERSISTENCE = NONE
BOUNDED_EVICTION = YES
DUPLICATE_HANDLE_REUSE = YES
RAW_PAYLOAD_NAMED_TOOL = NO
RAW_PAYLOAD_AGENT_RESULT = NO
```

The raw payload resolver remains an internal module export for a future explicitly authorized transport layer. No filesystem, IndexedDB, project-document or cloud persistence is used.

## Public API / named tools

Connector-001 14-tool order is preserved exactly.

Appended tools:

15. `get_ink_preview` → `preview.capture`
16. `inspect_ink_output` → `asset.inspect`
17. `release_ink_output` → `asset.release`

Capability routing:

```text
preview.capture = NAMED_TOOL
asset.inspect = READ_ONLY
asset.release = NAMED_TOOL
```

Each Connector-002 capability records authoritative route, role, History expectation, Revision expectation, availability and `INK_AGENT_RESULT` envelope contract.

## Executed DEV checks

This connector-only DEV environment does not provide an exact full Git checkout/runtime shell, so the accepted Connector-001 method was reused: exact GitHub branch blobs + V8 syntax/static parsing + isolated committed-source execution harness.

Executed against exact committed Connector-002 source:

- output-registry source syntax — PASS;
- visual-feedback source syntax — PASS;
- Public Creative API source syntax — PASS;
- Connector-001 focused QA source syntax — PASS;
- Connector-002 focused QA source syntax — PASS;
- Named Tools 14-prefix preservation — PASS;
- final Named Tool count 17 — PASS;
- Connector-002 capability metadata/routing — PASS;
- Public API preview/inspect/release isolated wiring — PASS;
- `INK_AGENT_RESULT` JSON-safe serialization — PASS;
- deterministic duplicate preview handle — PASS;
- A4 bounded preview planning — PASS / isolated result 848 × 1200;
- viewport hard-bound planning — PASS / isolated result 1600 × 1200;
- content hard-bound planning — PASS / isolated result 1600 × 1030;
- actual PNG bytes contribute to render identity — PASS;
- optional refs grounded without crop change — PASS;
- registry byte eviction — PASS;
- registry entry-count eviction — PASS;
- registry release — PASS;
- handle identity collision guard — PASS;
- fresh/stale document fingerprint detection — PASS;
- released payload stale detection — PASS;
- preview uses `app.renderExportCanvas(plan.renderOptions)` — PASS;
- no `exportPNG` / print / download / ObjectURL / DOM screenshot route — PASS;
- no second Renderer / tiled exporter implementation — PASS;
- no `use_ink` / capability discovery / MCP / WebSocket / postMessage — PASS;
- no persistent/cloud storage — PASS;
- `FORMAT_VERSION = 4` — PASS.

Focused QA files:

- `qa/ink-chat-connector-002-visual-asset-feedback.test.mjs`
- `qa/ink-chat-connector-001-agent-foundation.test.mjs` — adjusted only so the accepted 14-tool registry remains an exact prefix and Connector-002 may append the authorized three tools.

No full-repository `node --test` or browser Runtime PASS is claimed from this DEV environment.

## Required regression preservation

Unchanged authority source blobs against branch base `9d20eca90b826bf60c23602c6e74ac081251e776`:

- Document Bridge: `f55262329ea4d792bf55c5fb04e3e342301fddfd`
- Reference Handoff: `7e63499c914670ce6176011d1d88a92c1d472bae`
- bounded edit: `a0051d60d016d1875a881708e249590b9fe207e3`
- History authority: `a1c3cefe60b9923d030bcead1d8565b134aebd21`
- Revision authority: `18028bb15866ff07c87d81073a63a3265ff6839e`
- existing InkApp/Renderer source: `b9eabc748e4a357d67febacadc3cacd2be6067ce`
- config: `5d5b9791166427f2c46786fd8b33c49b11ea2ff9`

Unchanged regression test blobs:

- Phase B: `bfb9f62074ebdee159670e635184e2525668beff`
- bounded edit: `53dfcbea5a301b09003bdcec8fc1c8c96b7b628d`
- Document: `4bc0449d5fe1ae5dc1f41de39bac834db5ae2ce0`
- History: `b55fdbfa1628a9973c9cd9fe785b35247b1742c3`
- Revision: `1afde9e32430f2daad297b2ab9b2fad94ca8a992`

Renderer/export regression is covered by exact unchanged `product/source/src/ink.js` plus Connector-002 focused authority/threshold checks. No renderer source was modified.

## Final boundaries

```text
DOCUMENT_MUTATION = 0
HISTORY_MUTATION = 0
AUTO_REVISION_CAPTURE = 0
SELECTION_MUTATION = 0
SECOND_RENDERER = 0
DOM_SCREENSHOT = 0
USER_EXPORT_UI = 0
RAW_BINARY_PUBLIC_RESULT = 0
PERSISTENT_ASSET_STORAGE = 0
USE_INK = 0
CAPABILITY_DISCOVERY = 0
MCP_EXTERNAL_TRANSPORT = 0
UI_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVED
```

Browser Runtime remains MR-coordinated after handoff. The separate UI-006 Phase H Runtime-failure lane is not modified or claimed resolved here.

Gate: `DEV_HANDOFF → STOP → MR exact-HEAD source review`.
