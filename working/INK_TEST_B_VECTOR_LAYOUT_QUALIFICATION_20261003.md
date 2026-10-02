# INK TEST B — Vector / Layout Qualification — 2026-10-03

TYPE = TEST / EVIDENCE / RECORD ONLY
ROLE = INK TEST B — Vector / Layout Qualification
SOURCE_REPO = thedoorw/INK-Browser-QA
LIVE_REPO = thedoorw/INK
LIVE_URL = https://thedoorw.github.io/INK/
PRODUCT_MUTATION = NONE

## Pinned identities

- LIVE_REPO_MAIN_AT_TEST_START: `145a00587bcc6dbc9717b05179f2c5e131a5b587`
- LIVE_DEPLOYED_SOURCE_SHA: `cc9b623258123da0e00e31a9e686357fba0d4ec0`
- B4_DISCOVERY_RESULT_COMMIT: `b10039403339196b6f43675c2b0b5a0476850cb6`
- TEST_B_INVENTORY_REQUEST_COMMIT: `8f1ce8f2656cbe08182b3b84b676e4252fead3b3`
- TEST_B_INVENTORY_RESULT_COMMIT: `cb64322e38a1525c0d2ca5507a7518ea4224e59a`
- SUCCESSFUL_RUNTIME_IDENTITY: sourceSha `cc9b623258123da0e00e31a9e686357fba0d4ec0`, apiReady `true`, toolCount `23`

The first inventory attempt (`testB-capability-inventory-001`) failed before Public API execution with `net::ERR_CERT_VERIFIER_CHANGED`. Classification: `QA_OR_DEPLOYMENT_GAP`. The immediate retry on the same deployed source completed successfully, so that transport failure is not product-capability evidence.

## Qualification result

| Package | Requested surface | Native authority at deployed source | CHAT/public exposure | Formal qualification result | Failure classification |
|---|---|---|---|---|---|
| B4 Path deformation | warp / distort / perspective | EXISTS — `src/vector/deformation.js` / `applyNonDestructiveDeformation()` | ABSENT | Cannot enter Path mutation → Canvas → History → Preview → Undo/Redo gate | `EXPOSURE_GAP` |
| C1 Page | create / delete / duplicate / rename / switch | EXISTS — `src/ink.js` Page authority | ABSENT | Cannot execute through named tool/public API | `EXPOSURE_GAP` |
| C2 Align / Distribute | align X/Y / distribute X/Y | EXISTS — `InkApp.alignSelection()` + `applyWorldTransformBatch()` | ABSENT | Cannot execute explicit-ref CHAT route | `EXPOSURE_GAP` |
| Guides | add / move / remove / lock / visibility | EXISTS — precision-layout + InkApp wrappers | ABSENT | Qualification stops at exposure gate | `EXPOSURE_GAP` |
| Snapping | enabled/categories + native smart snap | EXISTS — `precision-layout.js` | ABSENT | Qualification stops at exposure gate | `EXPOSURE_GAP` |
| Artboard state | existing normalized artboard mutation | EXISTS — `InkApp.changeArtboard()` | ABSENT | Qualification stops at exposure gate | `EXPOSURE_GAP` |

No `PRODUCT_CAPABILITY_GAP` was found for the requested B4/C1/C2/native layout authorities at this deployed source.

## Live public-surface evidence

Successful request:

```json
{
  "schema": "INK-LIVE-CHAT-REQUEST",
  "version": 1,
  "requestId": "testB-capability-inventory-002",
  "liveUrl": "https://thedoorw.github.io/INK/",
  "expectedSourceSha": "cc9b623258123da0e00e31a9e686357fba0d4ec0",
  "steps": [
    {
      "id": "capabilities",
      "tool": "get_ink_capabilities",
      "input": {}
    }
  ]
}
```

Observed Runtime identity:

```text
href = https://thedoorw.github.io/INK/
readyState = complete
apiReady = true
sourceSha = cc9b623258123da0e00e31a9e686357fba0d4ec0
toolCount = 23
status = COMPLETED
```

The returned canonical capability list does not contain any of:

```text
path.warp.v1
path.distort.v1
path.perspective.v1

page.create.v1
page.duplicate.v1
page.delete.v1
page.rename.v1
page.activate.v1

object.align.v1

page.snap.set.v1
guide.add.v1
guide.move.v1
guide.remove.v1
guide.lock.set.v1
guide.visibility.set.v1

page.artboard.set.v1
```

The exact deployed `chat-bounded-edit.js` and `capability-registry.js` likewise contain none of those operation IDs.

## B4 exact reproducer

Existing Live request `clusterB-B4-discovery-live-001`:

```json
{
  "schema": "INK-LIVE-CHAT-REQUEST",
  "version": 1,
  "requestId": "clusterB-B4-discovery-live-001",
  "liveUrl": "https://thedoorw.github.io/INK/",
  "expectedSourceSha": "cc9b623258123da0e00e31a9e686357fba0d4ec0",
  "steps": [
    { "id": "capabilities", "tool": "get_ink_capabilities", "input": {} },
    { "id": "describeWarp", "tool": "describe_ink_capability", "input": { "idOrToolName": "path.warp.v1" } },
    { "id": "describeDistort", "tool": "describe_ink_capability", "input": { "idOrToolName": "path.distort.v1" } },
    { "id": "describePerspective", "tool": "describe_ink_capability", "input": { "idOrToolName": "path.perspective.v1" } }
  ]
}
```

Observed:

```text
status = FAILED
error = INK_SEQUENCE_STEP_FAILED:describeWarp:INK_CAPABILITY_NOT_FOUND
```

Because discovery fails before a legal edit proposal can be formed, B4 cannot legitimately test native Path mutation, renderer delta, History, Preview, Undo or Redo. No pointer/mouse substitute was used.

Native source evidence still shows real Path deformation authority:
- requires `path.type === 'path'`;
- preserves native Path identity;
- mutates `path.subpaths`;
- retains `deformation.baseSubpaths`;
- records reversible deformation parameters/revision;
- reset restores base subpaths.

Therefore B4 failure classification is `EXPOSURE_GAP`, not raster fake and not missing native deformation core.

## C1 source evidence

At deployed source `cc9b623...`:

- `addPage()`: scoped History over `pages + activePageId`, creates `defaultPage()`, activates new stable page id.
- `deletePage()`: minimum-one-page invariant, scoped History, surviving active page chosen.
- `duplicatePage()`: scoped History; deep clone; fresh page/layer/object identities; activates copy.
- rename: existing page UI path commits through scoped History on the native page path.
- `switchPage()`: changes native `activePageId`, clears transient selection/draft, refreshes the same document state.

Boundary to preserve during later exposure qualification:
`switchPage()` is navigation and does not currently create a History entry. This record does not classify that as a product defect before `page.activate.v1` exists; the formal exposed semantics must be checked when available.

No CHAT-only page state is present in the native authority.

## C2 source evidence

`InkApp.alignSelection(mode)` supports:

```text
left
centerX
right
top
centerY
bottom
distributeX
distributeY
```

It measures renderer world bounds, computes transforms, applies them through existing `applyWorldTransformBatch()`, records one scoped `對齊物件` History entry, refreshes selection/spatial state, and renders.

The requested CHAT route `object.align.v1` is absent, so explicit stable-ref qualification cannot yet run.

## Guides / snapping / artboard authority inventory

Native authority exists at the deployed source:

Guides:
- `addRulerGuide()`, `moveRulerGuide()`, `removeRulerGuide()`
- `setRulerGuideLocked()`, `setRulerGuideVisibility()`
- InkApp wrappers commit through scoped History and rerender.

Snapping:
- `normalizeSnapSettings()`
- `setSnapEnabled()`, `setSnapCategory()`
- `resolveManipulationSnap()`
- `equalDistanceSmartSnap()`
- `resolveAngleSnap()`
- categories: guides / edges / centers / grid / angle / equalDistance.

Artboard:
- existing normalized Artboard model.
- `InkApp.changeArtboard()` commits one scoped `調整畫板` History entry, invalidates tiles, refreshes Artboard state, renders, and fits when relevant.

All three remain `EXPOSURE_GAP` at the formal CHAT/public surface.

## Gate

```text
B4 = EXPOSURE_GAP
C1 = EXPOSURE_GAP
C2 = EXPOSURE_GAP
GUIDES = EXPOSURE_GAP
SNAPPING = EXPOSURE_GAP
ARTBOARD_STATE = EXPOSURE_GAP

PRODUCT_MUTATION = NONE
POINTER_MOUSE_SIMULATION = NONE
TEXT_DEFORMATION = EXCLUDED
NEXT_TEST = only after the corresponding public/named operation IDs exist on an exact deployed source SHA
```
