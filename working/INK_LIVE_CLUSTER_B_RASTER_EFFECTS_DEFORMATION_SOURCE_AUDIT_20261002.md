# INK Live Cluster B — Raster / Effects / Deformation Source Audit — 2026-10-02

TYPE = SOURCE AUDIT / LIVE GAP CLASSIFICATION
SOURCE_REPO = thedoorw/INK-Browser-QA
AUDIT_BASE_MAIN = 001b1cf2cb96335594fb1f28537b0d917857e7e0
LIVE_DEPLOYED_SOURCE = 66cdb5b4ddc322a2b1027cab2627426f868027d3
LIVE_FINDINGS = R1-RASTER-EDIT-001 / R1-C013-001 / R1-C019-001
CASES = C010 / C011 / C013 / C014 / C015 / C019
FAMILIES = C14 C22 C23 C24 C25 C26 C27 C28

## Result

Cluster B is primarily an exposure gap, with one confirmed product/render gap in the current C019 text-deformation requirement.

```text
PSD / TIFF / EXR / RAW MUTABLE RASTER INGEST = PRODUCT EXISTS / CHAT EXPOSURE GAP
PNG / JPEG / WEBP MUTABLE RASTER INGEST = PRODUCT CONVERSION-INTEGRATION GAP
RASTER DIRECT EDIT CORE = PRODUCT EXISTS / CHAT EXPOSURE GAP
RASTER MASK = PRODUCT EXISTS / CHAT EXPOSURE GAP
ADJUSTMENT / FILTER = PRODUCT EXISTS / CHAT EXPOSURE GAP
BLEND / LAYER EFFECT = PRODUCT EXISTS / CHAT EXPOSURE GAP
RASTER LIQUIFY = PRODUCT EXISTS / CHAT EXPOSURE GAP
VECTOR PATH WARP / DISTORT / PERSPECTIVE = PRODUCT EXISTS / CHAT EXPOSURE GAP
TEXT WARP / CURVED-TEXT RENDER = PRODUCT RENDER-INTEGRATION GAP
REFERENCE IMAGE UNLOCK = NOT A REPAIR / REFERENCE LOCK IS INTENTIONAL
```

## Native raster authority already exists

### Mutable raster ingest

`InkApp.importImageFormat()` in `product/source/src/ink.js` is an existing editable-raster authority for the format-interoperability path.

It:
- calls the existing image-format decoder;
- converts the decoded payload with `formatPayloadToDocumentImageState()`;
- creates native `type:'image'` with `rasterState`;
- inserts through existing `history.pushScoped()`;
- updates document color state;
- selects the new native image;
- refreshes the existing renderer.

Important format boundary:
- `format-interoperability.js` currently decodes PSD / PSB-read-path, TIFF, EXR and registered RAW adapters;
- it does not decode PNG / JPEG / WEBP;
- the ordinary `importImage()` path for browser images creates a display `src` image, not an editable `rasterState` image.

Therefore the existing mutable-raster ingest authority is real, but it does not cover the PNG used by Round 1.

The existing Reference decoder already produces validated browser-local RGBA `ImageData`, and the color-management core already provides `createColorRaster()` / `serializeColorRaster()`. What is missing is the bounded product integration that converts that decoded web raster into the native `ink-image-state / rasterState` representation and commits it through existing History.

Disposition:
- PSD / TIFF / EXR / RAW mutable ingest = CHAT exposure gap;
- PNG / JPEG / WEBP mutable ingest = small product conversion-integration gap;
- do not create a second raster document model.

### Reference image is intentionally different

CHAT Reference import uses `product/source/src/extraction/workspace.js`.

`importReferenceIntoDocument()` creates:
- `type:'image'`;
- embedded `src` data URL;
- extraction/source provenance;
- opacity 0.5;
- `locked:true`;
- no editable `rasterState`.

The lock is part of the Reference contract. Reference decomposition then creates editable extracted Path layers while preserving provenance.

Therefore the Round 1 `CHAT_EDIT_TARGET_LOCKED` result against the imported Reference is expected behavior, not evidence that mutable raster editing is missing.

Required boundary:

```text
DO NOT "FIX" CLUSTER B BY UNLOCKING ReferenceImage.
EXPOSE EXISTING MUTABLE RASTER INGEST / EDIT AUTHORITY INSTEAD.
```

## Non-destructive image stack exists and renders

`product/source/src/image/image-core.js` already owns serialized image-stack primitives for:
- raster/vector masks;
- adjustments;
- filters;
- Liquify filters;
- layer effects;
- blend-capable stack rendering;
- crop / resize / raster conversion helpers.

Current advertised image capability families include masks, common blend modes, adjustment families, filter families and layer effects.

The basic renderer in `ink.js` is not the whole authority. `installStudioCore()` installs the formal image renderer hook before CHAT Public API installation.

`product/source/src/studio-core.js` patches image/layer rendering so native raster objects use:
- `renderImageStack()` for adjustment / filter / mask processing;
- `applyLayerEffects()` for effects;
- object/layer blend mode;
- `rasterState.colorRaster` as the editable source.

Thus these are real product capabilities, not inert UI descriptors.

## Existing History-backed UI routes confirm mutation authority

`product/source/ui/full-capability-controls.js` already provides History-backed product routes for:
- adjustment add/remove;
- filter add/remove/reorder;
- blend mode mutation;
- layer effects;
- raster mask creation;
- Select and Mask;
- Liquify filter creation.

They mutate the same native object/layer state consumed by the installed renderer.

Disposition: expose these existing operations through bounded CHAT edit routes; do not reproduce the UI interaction model.

## Raster direct-edit core exists

`product/source/ui/capability-raster-tools.js` operates only on native `image` objects carrying `rasterState.colorRaster`.

It:
- reads the existing native raster state;
- calls existing raster-processing functions;
- writes the raster back to the same `rasterState`;
- wraps commits in existing History;
- invalidates the existing renderer caches.

Existing raster tools include selection and local-edit families such as:
- magic / quick / object selection;
- raster lasso variants;
- paint bucket / raster gradient;
- clone / pattern stamp;
- healing / spot healing / patch;
- dodge / burn / sponge;
- local blur / sharpen;
- color replacement.

Disposition: product algorithms and mutation seam exist. CHAT exposure should be structured, bounded operations over explicit native image refs, not pointer-event emulation.

## Liquify exists

`product/source/src/image/raster-processing-advanced.js` provides bounded `liquifyRaster()` operations:
- forwardWarp;
- twirl;
- pucker;
- bloat;
- reconstruct.

The UI creates a native `createLiquifyFilter()`, appends it through History, and the installed image renderer applies it through the existing filter stack.

Disposition: raster Liquify is an exposure gap.

## Vector deformation exists

`product/source/src/editor/transform-advanced.js` provides:
- skew;
- projective transform;
- distort;
- perspective;
- `createWarpDeformationPlan()`.

`product/source/src/vector/deformation.js` provides reversible `applyNonDestructiveDeformation()` for native Path objects.

The UI uses these existing authorities for Path warp/distort/perspective.

Disposition: Path deformation is an exposure gap.

## C019 text-deformation boundary

Native Text currently supports ordinary editable text fields plus a `pathText` descriptor in `product/source/src/editor/text-object.js`.

However the installed formal renderer's current `drawText()` in `product/source/src/ink.js` renders ordinary line text only and does not consume `pathText`.

The advanced-transform UI also limits warp/distort/perspective execution to Path objects.

No formal installed text warp/envelope/path-text rendering authority was found in the audited current product source.

Therefore:

```text
C019 TEXT WARP / CURVED TEXT
= PRODUCT RENDER-INTEGRATION GAP
NOT CHAT-EXPOSURE-ONLY
```

The presence of a stored `pathText` descriptor is not sufficient to claim a rendered/editable text-deformation capability.

## C013 boundary

The raster/filter/effect portion of C013 is product-existing and needs CHAT exposure.

The separate fresh-document material-catalog issue remains outside this Cluster B classification and belongs to the reusable-creative-asset / material workstream.

Do not close the material finding merely because filter/effect exposure becomes available.

## Recommended smallest coherent exposure packages

### B0 — web-raster → native rasterState bridge

Add the missing bounded product integration for PNG / JPEG / WEBP:
- reuse the existing browser-local Reference decode result or equivalent validated ImageData;
- convert RGBA8 into the existing color-management `color-raster` state;
- create the existing native `image + rasterState` shape;
- commit through existing History;
- preserve source identity/provenance;
- do not unlock or repurpose ReferenceImage;
- do not create a second renderer, image model or raster state owner.

### B1 — mutable raster ingest CHAT exposure

Expose the existing editable-raster ingest authority after B0:
- common web raster through the B0 bridge;
- PSD / TIFF / EXR / RAW through existing `importImageFormat()`;
- structured receipts and stable native refs.

### B2 — non-destructive raster stack edit

Expose explicit stable-ref operations for existing native raster images:
- mask;
- adjustment;
- filter;
- blend mode;
- layer effect;
- Liquify.

Requirements:
- proposal → explicit approval → execute;
- optimistic state/revision/fingerprint checks;
- existing image-core descriptors only;
- existing History / Renderer only.

### B3 — structured raster direct edit

Expose bounded algorithms from the existing raster tool/controller layer using explicit regions/parameters, not pointer events.

### B4 — vector deformation

Expose existing Path warp/distort/perspective authorities on explicit stable Path refs.

### Product package — text deformation

C019 requires product/render work before CHAT exposure can be truthful. It must not be implemented as a registry-only operation over the current descriptor.

## B0 candidate checkpoint — 2026-10-02

Fresh current-main replay after C04 combined product integration:

- main product checkpoint observed: `aa01f1e311eb22cb572a61efea19b8bb21a96157`
- branch: `work/ink-live-web-raster-bridge-002`
- Draft PR: `#114`
- candidate HEAD: `5bec56b5a4db08404a03ea43d71d158c849a4b56`
- superseded historical PR: `#113` CLOSED

Candidate product delta:
- `product/source/src/image/format-interoperability.js`
  - adds `webRasterImageDataToDocumentState()`;
  - converts validated RGBA8 browser raster pixels into the existing `color-raster` / `ink-image-state` authority.
- `product/source/src/ink.js`
  - adds History-backed `InkApp.importWebRaster()`;
  - reuses installed extraction decode;
  - creates the existing native `type:'image' + rasterState` shape;
  - preserves source / provenance metadata.

Explicitly unchanged:
- ReferenceImage remains locked and separate;
- ordinary UI `importImage()` behavior is unchanged;
- no Public Creative API / named-tool exposure yet;
- no new renderer, History, Document or raster-state owner;
- no FORMAT_VERSION change.

Static QA:
```text
format-interoperability.js = SYNTAX PASS
ink.js = SYNTAX PASS
candidate diff = exactly 2 intended source files
```

Runtime/browser status:
```text
B0_RUNTIME = NOT_YET_CLAIMED
HOSTED_LIVE_RUNNER = FORMAL LIVE URL ONLY
BRANCH_CANDIDATE_BROWSER_PROOF = NOT AVAILABLE THROUGH CURRENT LIVE REQUEST RUNNER
```

Do not promote PR #114 from static QA alone.

## B0 + B1 accepted / deployed closure — 2026-10-02

Historical PR #114 is superseded by the accepted fresh replay.

```text
B0_FINAL_PR = #118
B0_EXACT_TESTED_CANDIDATE = 076400c52bcd3f6a62e7de0a87dc26bfc010f8e4
B0_MAIN_INTEGRATION = 3110a40227351cdc99a1639d09e55838d54cc8ed
B0_RESULT = PASS

B1_FINAL_PR = #119
B1_EXACT_TESTED_CANDIDATE = e535234b1b3ad47d4fa0f4300ec3539275b0b4ca
B1_MAIN_INTEGRATION = 3a785b90d6f7922175cca3662fd2b72bf95430ce
LIVE_SOURCE_SHA = 3a785b90d6f7922175cca3662fd2b72bf95430ce
LIVE_REQUEST = clusterB-B1-live-rerun-004
B1_RESULT = PASS
```

B0 proves the missing PNG/JPEG/WebP conversion seam without changing ReferenceImage semantics.

B1 exposes that seam through the direct named tool `import_ink_raster`, reusing:
`normalizeChatAttachment → InkApp.importWebRaster → existing History → native image+rasterState → existing Renderer`.

Formal Live evidence:
- PNG source 1086×1448 / 2,969,222 bytes;
- stable native image ref returned;
- source SHA-256 `e0c8039f6a30b21ac87483cfacfaa1c7fa2b05d2be79596d1a3d3f765469b807`;
- editable `ink-image-state`;
- Preview PASS;
- scoped History PASS;
- Undo PASS;
- Redo PASS.

Scope boundary:
- PNG/JPEG/WebP attachment path is qualified.
- PSD/TIFF/EXR/RAW native ingest remains product-existing but is not yet CHAT-qualified through this named tool.
- adjustment/filter/blend/effect/Liquify remain B2 exposure gaps.
- local/destructive raster tools and masks remain B3.
- Path deformation remains B4.
- Text warp remains a product render-integration gap.

The formal Live runner now permits a 90-second exact-SHA module readiness window and records module-network diagnostics. Earlier readiness timeouts on the same exact source were deployment/CDN variability, not product-operation failures.

## Current gate

```text
B0 WEB_RASTER_BRIDGE = MERGED / PASS
B1 WEB_RASTER_NAMED_TOOL = MERGED / DEPLOYED / LIVE PASS
B2 NON_DESTRUCTIVE_RASTER_STACK = NEXT
B3 LOCAL_RASTER_MASKS = OPEN / LATER
B4 PATH_DEFORMATION = OPEN
C019 TEXT_DEFORMATION = PRODUCT RENDER-INTEGRATION GAP
```

Concurrent whole-UI fidelity work remains separate. B0/B1 changed no reviewed UI-authority blobs; future Cluster B work must maintain that boundary.

## B2 incremental qualification — adjustment / brightnessContrast — 2026-10-02

```text
B2_ADJUSTMENT_PR = #121 / MERGED
B2_ADJUSTMENT_EXACT_CANDIDATE = 4df08a4498723cfec19b825b1df9eb3ecb0ae7ea
B2_ADJUSTMENT_SOURCE_INTEGRATION = 11551eab8c1ec78e04031f178b7ab24b91b40d26
B2_ADJUSTMENT_CANDIDATE_QA = live-raster-adjustment-candidate-001 / PASS
B2_ADJUSTMENT_LIVE = clusterB-B2-adjustment-live-002 / PASS
B2_ADJUSTMENT_COVERAGE = brightnessContrast QUALIFIED
B2_FILTER = NEXT
B2_BLEND = OPEN
B2_EFFECT = OPEN / prior over-broad candidate had unqualified render delta
B2_LIQUIFY = OPEN
B2_OVERALL = PARTIAL / NOT COMPLETE
```

Qualification proof:
- CHAT uses existing `propose_ink_edit → approve_ink_edit → execute_ink_edit` authority; no second raster model, renderer, History or effect engine was added.
- target is the existing editable native `image + rasterState.colorRaster`; ReferenceImage remains locked/separate.
- native `createAdjustment('brightnessContrast')` stack mutation produced a renderer fingerprint change `fnv1a32:34d01658 → fnv1a32:17debb38`.
- scoped History added `CHAT add image adjustment: brightnessContrast`.
- Preview completed; Undo restored renderer fingerprint `fnv1a32:34d01658`; Redo restored `fnv1a32:17debb38`.
- first formal Live attempt timed out before Public API readiness on the same exact deployed SHA with no window/module exception or HTTP failure; warm rerun completed the full operation chain.
- superseded over-broad PR #120 was closed unmerged. Filter / blend / effect / Liquify require separate qualification and are not covered by this PASS.

## B2 incremental qualification — filter / gaussianBlur — 2026-10-02

```text
B2_FILTER_PR = #122 / MERGED
B2_FILTER_EXACT_CANDIDATE = c7a0b08e43d3410811efdd5532571002a1acb478
B2_FILTER_SOURCE_INTEGRATION = e2ce5e409f42c992bcf411e5e23d8f02435b1a63
B2_FILTER_CANDIDATE_QA = live-raster-filter-candidate-001 / PASS
B2_FILTER_LIVE = clusterB-B2-filter-live-002 / PASS
B2_FILTER_COVERAGE = gaussianBlur QUALIFIED
B2_ADJUSTMENT = brightnessContrast QUALIFIED
B2_BLEND = NEXT
B2_EFFECT = OPEN / prior over-broad candidate had unqualified render delta
B2_LIQUIFY = OPEN
B2_OVERALL = PARTIAL / NOT COMPLETE
```

Qualification proof:
- CHAT reuses existing `createFilter('gaussianBlur')`, native image `filterStack`, scoped History and existing Renderer.
- exact candidate browser QA changed canvas hash `7883b22 → a9f6be1d`; Undo/Redo restored those exact hashes.
- formal Live renderer fingerprint changed `fnv1a32:34d01658 → fnv1a32:c6017f2e`.
- History added `CHAT add image filter: gaussianBlur`.
- Undo restored `fnv1a32:34d01658`; Redo restored `fnv1a32:c6017f2e`.
- first formal Live attempt timed out before Public API readiness on the same deployed SHA; no filter operation ran and no product failure was observed. Warm rerun completed the full chain.
- blend / effect / Liquify remain unqualified and do not inherit this PASS.

