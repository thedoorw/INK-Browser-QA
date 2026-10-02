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
MUTABLE RASTER INGEST = PRODUCT EXISTS / CHAT EXPOSURE GAP
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

`InkApp.importImageFormat()` in `product/source/src/ink.js` is the existing editable-raster authority.

It:
- calls the existing image-format decoder;
- converts the decoded payload with `formatPayloadToDocumentImageState()`;
- creates native `type:'image'` with `rasterState`;
- inserts through existing `history.pushScoped()`;
- updates document color state;
- selects the new native image;
- refreshes the existing renderer.

The UI's external-image flow already calls this authority for supported image-format bytes.

Disposition: do not create a second raster document model. CHAT needs a bounded transport/exposure seam to this existing ingest authority.

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

### B1 — native mutable raster ingest

Expose the existing native raster ingest authority to CHAT with bounded binary/local-attachment handling and structured receipts.

Requirements:
- create native editable `image + rasterState`;
- preserve source identity/provenance;
- use existing History;
- return stable native refs;
- do not unlock or repurpose ReferenceImage.

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

## Current gate

The active Current Work Order is the accepted C04 recovery + two-state combined-promotion sequence and explicitly keeps unrelated Live CHAT exposure work separate.

Therefore:

```text
CLUSTER_B_PRODUCT_SOURCE_MERGE = HOLD
LIVE_PROMOTION = HOLD
SOURCE_AUDIT / DESIGN = ALLOWED
UNRELATED C04 COMPOSITION = DO NOT MODIFY
```

No thedoorw/INK product-source file was modified by this audit.
No Live rerun is claimed because no Cluster B repair has been promoted.
