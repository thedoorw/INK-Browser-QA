# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-CONNECTOR-002 / MR_SOURCE_PASS / INTEGRATION_RUNTIME_PENDING`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-CONNECTOR-002` |
| PHASE | `PREVIEW_OUTPUT_HANDLE_FOUNDATION` |
| TITLE | `Visual / Asset Feedback — Preview + INK_OUTPUT_HANDLE` |
| DEV_BRANCH | `work/ink-chat-connector-002` |
| ACCEPTED_UPSTREAM | `INK-CHAT-CONNECTOR-001 / MR_PASS / promoted` |
| CONNECTOR_001_PROMOTION_COMMIT | `efd48a429d9998b4871aebf7bd1e47a576d41a95` |
| TARGET_GATE | `INK_VISUAL_ASSET_FEEDBACK_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |
| UI_LANE | `SEPARATE / UI-006 Phase H currently revising after Runtime FAIL` |

## User direction

Connector-001 stays closed.

The next connector stage is redefined to combine:

```text
Preview
+
Asset / Output Handle
```

The goal is not to add a second renderer or external transport.

The goal is:

```text
CHAT requests visual evidence
→ INK uses its existing render/export authority
→ INK creates a bounded preview asset
→ Public Creative API returns JSON-safe metadata + INK_OUTPUT_HANDLE
→ handle is bound to exact document/page/revision/fingerprint/render result
→ future transport can resolve the handle to bytes
```

This Work Order implements the internal visual-feedback and output-handle foundation only.

---

## A — Existing authority reuse

Connector-002 must reuse existing accepted product authorities.

### Rendering

Preferred authoritative route:

```text
app.renderExportCanvas(...)
```

Existing renderer/export helpers may be reused where appropriate:

- `Renderer.viewportWorldBounds()`;
- `Renderer.contentBounds()`;
- `artboardExportGeometry(...)`;
- existing `renderExportWorld(...)`;
- existing Canvas rendering path.

Do not create:

- a second canvas renderer;
- DOM screenshot logic;
- a parallel SVG renderer;
- a new export engine.

### Document identity

Reuse existing:

```text
documentFingerprint(...)
app.revisions.revisionIdFor(...)
stable Page / Layer / Object refs
buildAIDocumentBridge(...)
```

### Public API

Extend the promoted:

```text
app.inkPublicApi
INK_AGENT_RESULT
Named Tool Registry
Capability Registry
```

Do not install a second public connector facade.

---

## B — Preview operation

Required Public Creative API family:

```text
preview.capture(options)
```

Required named tool:

```text
get_ink_preview
```

Supported preview scopes for Connector-002:

```text
artboard
viewport
content
```

Do not add selection-crop/object-crop rendering in this Work Order.

Optional `refs` may be supplied only as semantic binding metadata. They must be validated through the existing document grounding path and must not silently change the rendered crop.

### Bounded preview

Preview rendering must be explicitly bounded.

Target defaults:

```text
defaultMaxDimension = 1200
hardMaxDimension = 1600
hardMaxPixels = 2_560_000
format = image/png
includeBleed = false
cropMarks = false
```

The implementation must derive a safe `ppi` or `scale` before calling the existing render authority so the preview stays below the hard limits and does not enter the large tiled-export/UI-progress path.

Preview generation must not:

- open Export UI;
- call `download(...)`;
- trigger print;
- mutate selection;
- mutate Document;
- create History;
- auto-capture Revision.

For preview PNG encoding, a bounded canvas `toBlob('image/png')` path is allowed.

Do not route preview through the user-facing `exportPNG()` controller if that would mutate Export UI state.

---

## C — INK_OUTPUT_HANDLE v1

Create one reusable JSON-safe descriptor schema:

```text
INK_OUTPUT_HANDLE
version = 1
```

Required descriptor fields:

```text
schema
version
handleId
kind
format
mimeType

documentId
pageId
revisionId
documentFingerprint

renderFingerprint
fingerprintAlgorithm

scope
bounds
pixelSize
background

objectRefs[]
byteLength

transport
persistence
```

Required values for Connector-002 preview output:

```text
kind = "preview"
format = "png"
mimeType = "image/png"
transport = "INTERNAL_EPHEMERAL"
persistence = "NONE"
```

### Binding rules

A handle must bind the visual result to:

- exact Document ID;
- exact active Page ID;
- current Revision ID when one exists;
- exact current Document fingerprint;
- normalized render request;
- actual encoded preview result through `renderFingerprint`;
- validated optional object refs.

The handle descriptor itself must contain no:

- Blob;
- Canvas;
- DOM node;
- function;
- ObjectURL;
- raw base64/data URL;
- live mutable Document/Object reference.

### Handle identity

`handleId` must be deterministic/content-addressed from the normalized output identity.

Do not use a random UUID as the only identity.

The descriptor must state the render fingerprint algorithm.

A small deterministic byte-hash helper may be added for preview bytes. This is not a new rendering/document authority.

---

## D — Internal ephemeral output registry

Connector-002 may add one bounded internal registry for preview payloads.

Purpose:

```text
INK_OUTPUT_HANDLE descriptor
↔
actual preview Blob/string payload
```

This registry is transport preparation, not persistent asset storage.

Requirements:

```text
persistence = NONE
maxEntries <= 8
maxTotalBytes <= 32 MiB
bounded eviction required
duplicate content-addressed handle may reuse an existing entry
```

The raw payload resolver must **not** be exposed as a normal Named Tool and must **not** be embedded inside `INK_AGENT_RESULT`.

Future MCP/plugin transport may explicitly import/use the internal resolver in a later Work Order.

No filesystem, IndexedDB, project-document, or cloud persistence in Connector-002.

---

## E — Handle inspection / release

Required Public API methods:

```text
asset.inspect(handleId)
asset.release(handleId)
```

Required named tools:

```text
inspect_ink_output
release_ink_output
```

### inspect

Returns only JSON-safe metadata.

It should report:

```text
handle
available
stale
staleReasons[]
currentDocumentFingerprint
currentRevisionId
```

At minimum, stale detection must catch:

- current Document fingerprint differs from the handle binding;
- active document/page identity differs;
- payload has been evicted/released.

A null Revision ID is valid. Document fingerprint remains the exact-state binding even without a captured Revision.

### release

Releases the internal ephemeral payload/entry only.

It must not mutate:

- Document;
- History;
- Revision;
- selection.

---

## F — Extend INK_AGENT_RESULT

`preview.capture()` / `get_ink_preview` must return:

```text
INK_AGENT_RESULT {
  ...
  targetRefs[]
  outputHandles: [INK_OUTPUT_HANDLE]
  diagnostics[]
  result
}
```

`outputHandles[]` now has a concrete v1 contract.

No raw binary belongs inside the result envelope.

Connector-001 result-envelope fields and ordering remain compatible.

---

## G — Capability / Named Tool registry update

Add capabilities:

```text
preview.capture
asset.inspect
asset.release
```

Add Named Tools:

```text
get_ink_preview
inspect_ink_output
release_ink_output
```

Expected Named Tool count after Connector-002:

```text
14 existing
+ 3 Connector-002
= 17
```

Routing:

```text
preview.capture = NAMED_TOOL
asset.inspect = READ_ONLY
asset.release = NAMED_TOOL
```

All three must declare:

- authoritative route;
- read/write role;
- History expectation;
- Revision expectation;
- availability;
- result-envelope contract.

Preview/asset release are connector-side ephemeral operations and do not count as Document writes.

---

## H — Suggested source shape

Preferred:

```text
product/source/src/agent/
  index.js
  public-creative-api.js
  output-handle-registry.js
  visual-feedback.js
```

Exact file split may vary, but authority must remain single:

```text
app.inkPublicApi
```

Do not expose a new unrestricted `window` or `globalThis` API.

---

## I — Required QA

Focused QA must cover at minimum:

1. Connector-001 14 existing named tools remain unchanged;
2. total named tools = 17;
3. capability registry exposes preview/asset operations deterministically;
4. `get_ink_preview` delegates to the existing INK render/export path;
5. preview dimensions obey max-dimension/max-pixel limits;
6. preview does not enter large tiled-export/UI-progress behavior;
7. preview does not call download/print/user export UI;
8. `INK_OUTPUT_HANDLE` is deterministic and JSON-safe;
9. no Blob/Canvas/DOM/ObjectURL/base64 appears in public result;
10. internal registry can resolve the exact stored preview payload;
11. duplicate content-addressed result reuses a compatible handle;
12. registry obeys entry/byte bounds and eviction;
13. descriptor binds document/page/revision/document fingerprint;
14. actual encoded preview contributes to `renderFingerprint`;
15. optional refs are grounded/validated but do not alter crop;
16. `asset.inspect` reports current/stale state correctly after document mutation;
17. `asset.release` invalidates availability without Document mutation;
18. Preview/inspect/release do not create History;
19. Preview/inspect/release do not auto-capture Revision;
20. Connector-001 focused QA remains PASS;
21. `FORMAT_VERSION = 4`;
22. Web / Portable use the same source implementation.

Required regressions:

- Connector-001 Agent Foundation focused QA;
- Document Bridge core;
- History core;
- Revision core;
- Renderer/export focused checks relevant to `renderExportCanvas`.

---

## J — Browser/runtime gate coordination

UI-006 Phase H currently has a separate Runtime FAIL and revision lane.

Connector-002 DEV must not take over or rewrite the central UI Runtime queue.

During DEV:

```text
focused source/unit QA = REQUIRED
browser Runtime = DO NOT CLAIM FINAL PASS
```

After DEV handoff, MR will choose an exact-SHA browser gate after reconciling against the then-current accepted UI/main state.

A Runtime failure inherited solely from unresolved UI-006 Phase H is not permission for Connector DEV to modify UI.

---

## Explicit non-goals

Do not implement:

- external MCP/plugin transport;
- ChatGPT image attachment transport;
- `use_ink`;
- arbitrary JS/eval/Function execution;
- Capability Schema Discovery / `describe_ink_capability` — reserved for Connector-003;
- Creative Session;
- Recipe/Workflow registry;
- Creative Library Search;
- Design Critic / Fix;
- selection/object crop preview;
- new Renderer;
- DOM screenshot;
- persistent asset library;
- cloud upload;
- automatic Revision capture;
- new drawing/edit operation;
- new trace/decomposition behavior;
- Document schema / FORMAT_VERSION change;
- UI redesign;
- Service Worker/bootstrap/cache changes.

If required:

`STOP → MR → separate next Work Order`

---

## Planned next sequence — not authorized by this Work Order

```text
Connector-003
= Capability Discovery / describe capability / input schema

Connector-004
= use_ink programmable native composition

Connector-005
= INK Skill / Capability Router

Connector-006
= Creative Library + Recipe foundation

Connector-007
= Creative Session / reusable Workflow

Connector-008
= Design Critic / Fix

Final
= full creative closed loop
```

---

## MR source disposition

```text
REVIEW_HEAD = f0ad1547de0fce791878b533662058a754993b5b
SOURCE_REVIEW = PASS
SCOPE_REVIEW = PASS
FOCUSED_QA_EVIDENCE = PASS
FINAL_MR_PASS = PENDING_INTEGRATION_RUNTIME

UI_PHASE_I_RUNTIME_RUN = 35954873725
UI_PHASE_I_TESTED_SHA = 5ad4a271b37a1dca9236239be8bb867bff320b7c
UI_PHASE_I_RUNTIME = PASS / separate lane

CONNECTOR_002_RUNTIME_QUEUE = NOT_TAKEN_OVER
CONNECTOR_003 = NOT_AUTHORIZED
```

## Gate

```text
DEV_AUTHORIZED
→ implementation
→ focused QA + required regressions
→ DEV_HANDOFF / STOP
→ MR exact-HEAD source review
→ MR runtime decision / integration reconciliation
→ MR_PASS / MR_REVISE
```

Acceptance:

`INK_VISUAL_ASSET_FEEDBACK_WORKS`
