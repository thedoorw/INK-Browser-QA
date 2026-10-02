# INK Live Cluster C — Layout / Page / Artboard Source Audit — 2026-10-02

TYPE = SOURCE AUDIT / LIVE GAP CLASSIFICATION
SOURCE_REPO = thedoorw/INK-Browser-QA
AUDIT_MAIN = 8209bb2c6aacc716032482e7eb8f2aa60d81499f
PRODUCT_INK_SHA = ec9f7af9487d38a0b2302dabbccd96201e717d88
LIVE_DEPLOYED_SOURCE = 66cdb5b4ddc322a2b1027cab2627426f868027d3
CASES = C001 / C002 / C003 / C008
FAMILIES = C02 C05 C08 C09

## Result

```text
PAGE CREATE / DELETE / DUPLICATE / RENAME = PRODUCT EXISTS / CHAT EXPOSURE GAP
PAGE SWITCH = PRODUCT EXISTS / CHAT EXPOSURE GAP
ALIGN = PRODUCT EXISTS / CHAT EXPOSURE GAP
DISTRIBUTE X / Y = PRODUCT EXISTS / CHAT EXPOSURE GAP
SMART SNAP / EQUAL DISTANCE / ANGLE SNAP = PRODUCT EXISTS / CHAT EXPOSURE GAP
RULER GUIDES = PRODUCT EXISTS / CHAT EXPOSURE GAP
ARTBOARD STATE / MUTATION = PRODUCT EXISTS / CHAT EXPOSURE GAP
ARTBOARD OUTPUT = PRODUCT EXISTS / PARTIALLY CHAT-EXPOSED THROUGH EXISTING EXPORT
NEW DOCUMENT ARCHITECTURE = OUT OF CLUSTER C REPAIR SCOPE / SEPARATE USER-GATED WORK
```

No new layout, page, snapping or artboard engine is required for the Round 1 gaps audited here.

## Page authority

`InkApp` already owns History-backed page mutation:

- `addPage()`
  - pushes one `新增頁面` History entry;
  - creates via existing `defaultPage()`;
  - appends to `doc.pages`;
  - switches `activePageId`.
- `deletePage(id)`
  - preserves the minimum-one-page invariant;
  - pushes History over `pages + activePageId`;
  - selects a surviving page.
- `duplicatePage(id)`
  - deep-clones the page;
  - rekeys page/layer/object identities through existing ID authority;
  - pushes History and activates the copy.
- page rename already commits through existing History.
- `switchPage(id)` uses the existing `activePageId` navigation authority and clears transient selection/draft state.

`defaultPage()` already creates:
- native Artboard;
- workspace;
- paper;
- guides;
- snap settings;
- one native layer.

Disposition: page mutation is an exposure gap, not a missing product model.

This does **not** authorize the separate New Document / A4 architecture redesign.

## Align / distribute authority

`InkApp.alignSelection(mode)` already implements one shared History-backed transform authority.

Supported modes:

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

It:
- resolves current native composition transform objects;
- measures existing renderer world bounds;
- computes align/distribution transforms;
- applies them through existing `applyWorldTransformBatch()`;
- records one scoped History entry;
- refreshes spatial/selection/render state.

Distribution is therefore already a real product capability; the Round 1 C008 gap is CHAT exposure only.

CHAT exposure must use explicit stable refs. It may temporarily route those refs through the existing selection-based authority, but it must not duplicate the alignment/distribution algorithm.

## Smart Snap / Precision Layout

`product/source/src/editor/precision-layout.js` is a formal product authority.

Existing capabilities include:
- `normalizeSnapSettings()`;
- `setSnapEnabled()`;
- `setSnapCategory()`;
- `resolveManipulationSnap()`;
- `equalDistanceSmartSnap()`;
- `resolveAngleSnap()`.

Native snap categories:

```text
guides
edges
centers
grid
angle
equalDistance
```

The manipulation snap authority already supports:
- tolerance;
- hysteresis;
- previous-evidence hold;
- guide snapping;
- edge/center snapping;
- document origin;
- grid snapping;
- equal-distance evidence;
- structured snap evidence.

Disposition: Smart Guides / snapping is a CHAT exposure gap.

## Ruler guide authority

Existing precision-layout functions:
- `addRulerGuide()`;
- `moveRulerGuide()`;
- `removeRulerGuide()`;
- `setRulerGuideLocked()`;
- `setRulerGuideVisibility()`.

Existing `InkApp` wrappers:
- `addGuide()`;
- `moveGuide()`;
- `removeGuide()`;
- `setGuideLocked()`;
- `setGuideVisible()`.

These wrappers already commit through scoped History and rerender.

Disposition: guide control is a CHAT exposure gap.

## Artboard authority

`product/source/src/document/artboard.js` already owns:
- `normalizeArtboard()`;
- `createArtboard()`;
- A4 preset;
- orientation;
- width / height;
- PPI;
- bleed;
- safe margin;
- units;
- show/hide bleed/safe/center guides;
- clip-content state;
- trim / bleed / safe geometry;
- pixel sizing;
- export geometry.

`InkApp.changeArtboard(key, value)`:
- normalizes through the existing Artboard authority;
- commits through one scoped `調整畫板` History entry;
- invalidates the existing tile renderer;
- refreshes Artboard UI/render state;
- fits the existing artboard view when applicable.

Disposition: Artboard mutation is a CHAT exposure gap.

## Artboard output boundary

The existing Public Creative API already exposes asset export through the current output authority.

Round 1 has already proven SVG/PDF output in other cases.

Therefore Cluster C should not create a second print/export serializer.

The remaining Cluster C need is page/artboard state control and layout assist, not a replacement output engine.

Browser Print remains a separate user-facing interaction and is not required to prove the existing structured CHAT output route.

## Existing exposed layout subset

Round 1 already proves that CHAT can use:
- native Frame creation;
- reparenting;
- Frame layout operations;
- ordinary transforms;
- native History/Revision;
- Preview/output.

Cluster C repair should add only the missing page / align-distribute / precision-layout / artboard surface.

## Smallest coherent CHAT exposure design

### C1 — Page operations

Proposal-required operations:

```text
page.create.v1
page.duplicate.v1
page.delete.v1
page.rename.v1
page.activate.v1
```

Requirements:
- use existing `doc.pages / activePageId` authority;
- reuse existing `InkApp` page methods where semantics match;
- preserve minimum-one-page invariant;
- no New Document redesign;
- stable page IDs returned in structured results;
- proposal captures Document/Page/Revision identity before mutation.

### C2 — Align / distribute

Proposal-required operation:

```text
object.align.v1
```

Arguments:
- `mode`: left / centerX / right / top / centerY / bottom / distributeX / distributeY.

Requirements:
- explicit stable target refs;
- minimum 2 refs for alignment;
- minimum 3 refs for distribution;
- reuse existing `InkApp.alignSelection()` + `applyWorldTransformBatch()`;
- no new align/distribute math;
- target fingerprints / Revision guard remain active.

### C3 — Snap / guides

Proposal-required operations:

```text
page.snap.set.v1
guide.add.v1
guide.move.v1
guide.remove.v1
guide.lock.set.v1
guide.visibility.set.v1
```

Requirements:
- active-page scoped;
- use existing precision-layout functions / InkApp wrappers;
- structured result returns normalized snap settings or guide descriptor;
- no pointer simulation.

A separate read-only descriptor may expose current snap settings/guides through context if current context does not already include enough page precision state.

### C4 — Artboard state

Proposal-required operation:

```text
page.artboard.set.v1
```

Initial arguments:
- key + value, routed to existing `InkApp.changeArtboard()`.

Accepted keys:
- orientation;
- ppi;
- bleedMm;
- safeMarginMm;
- unit;
- showBleed;
- showSafeArea;
- showCenter;
- clipContent.

Width/height/custom-paper architecture is intentionally not expanded by this package.

## Qualification order

```text
1. create second page → Context / History
2. duplicate page → unique identities
3. activate / rename / delete page → minimum-page invariant
4. align left + center
5. distribute X on 3 objects
6. snap settings toggle + guide add/move/remove
7. artboard orientation / bleed mutation
8. Preview / PDF or PNG output using existing export authority
9. rerun C001 / C002 / C003 layout subset / C008
```

Tool-call success alone is not PASS.

## Boundary

Do not combine Cluster C exposure with:
- New Document / A4 architecture redesign;
- C06 12800% zoom;
- C04 workspace authority;
- History redesign;
- Raster / Drawing repair branches;
- new output renderer/serializer.

Only accepted exact source SHA may later be promoted to the Live repo.
