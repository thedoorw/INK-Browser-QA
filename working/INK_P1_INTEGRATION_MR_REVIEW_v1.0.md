# INK P1 Integration MR Review v1.0

STATUS: `MR_REVISE / BOUNDED_RENDERER_DISPATCH_CORRECTION`

TASK: `INK-P1-INTEGRATION-001`

REVIEWED_BRANCH: `work/ink-p1-integration-001`

REVIEWED_HEAD: `4c985ec692b2c1275ec23205c0823bb40283430a`

IMPLEMENTATION_HEAD_BEFORE_HANDOFF_DOC: `e2b2a3cec30bcc9ea23cd4d9de3eb2b1574d46bd`

ACTIVATION_MAIN: `87f57980a071ff8f009f3aa354951d81025fecf0`

DATE: 2026-09-27

## MR verdict

```text
P1_INTEGRATION_SCOPE = PASS
P1_INTEGRATION_AUTHORITY_CONVERGENCE = PASS
P1_F_STACK_REGISTRATION = PASS
P1_G_COLOR_BITDEPTH_CHANNEL_WIRING = PASS
P1_H_INTEROPERABILITY_BRIDGE = PASS
RULER_GUIDE_SNAP_TECHNICAL_WIRING = PASS
FORMAT_VERSION_CHANGE = 0
INTEGRATED_RUNTIME = NOT RUN
P1_INTEGRATION_RENDERER_DISPATCH = REVISE
P1_INTEGRATION_READY = NO
PROMOTION = BLOCKED
```

## Reviewed scope

Activation main → handoff changes only:

- `product/source/src/document/migration.js`
- `product/source/src/document/model.js`
- `product/source/src/editor/index.js`
- `product/source/src/editor/precision-layout.js`
- `product/source/src/editor/transform.js`
- `product/source/src/image/color-management-core.js`
- `product/source/src/image/format-interoperability.js`
- `product/source/src/image/image-core.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- `qa/ink-p1-integration-001.test.mjs`
- `working/INK_P1_INTEGRATION_DEV_PROGRESS.md`

No integrated Runtime was run. No FORMAT_VERSION change was made.

## Authority review

MR source review confirms:

- persistent guides + snap settings are stored on existing Document/page authority;
- guide mutations use existing History-backed mutation paths;
- direct move / rotation snapping routes through existing Transform authority;
- temporary bypass uses the existing interaction path and does not mutate saved snap settings;
- P1-F advanced adjustments / filters / Liquify are registered through existing `image-core.js` stacks;
- P1-G raster/color/bit-depth/ICC state is attached to the existing image/document data path;
- P1-H format payload is bridged into one INK image `rasterState`, not a second document truth;
- unsupported Lab / Multichannel / unsupported ICC render paths remain explicit;
- persistent guide rendering is wired;
- no second Document / History / Renderer / Selection / Mask / Transform / Adjustment / Filter / Color / Channel authority was identified.

## Blocking finding — rasterState-only imported images do not enter the new renderer path

P1-H import creates an INK image object like:

```text
type = image
w / h = payload dimensions
rasterState = formatPayloadToDocumentImageState(payload)
src = absent
```

The base renderer's image path is still:

```text
getImage(o.src)
```

and falls back to a placeholder when no source image exists.

The integrated Studio renderer has the correct P1-G raster-state renderer in `renderer.drawImage()`:

```text
hasRasterState = Boolean(o.rasterState?.colorRaster)
colorRasterToRgba8(...)
```

but `renderer.drawObject()` only dispatches to that overridden drawImage path when the image has:

- adjustments, or
- filterStack, or
- effects, or
- rasterMask.

A newly imported PSD/TIFF/EXR image with only `rasterState` therefore falls through to the old renderer and does not display its actual imported raster.

This violates the Integration workpack requirement that P1-G renderer wiring and P1-H import routing converge into the product path before Runtime.

## QA gap

Checked-in integration QA contains 19 `test(...)` declarations and zero skip tokens.

It verifies:
- color raster conversion directly;
- P1-H payload/state round-trip;
- TIFF encode/decode;
- renderer module import.

It does not functionally verify that a rasterState-only image object is routed through the integrated renderer.

DEV also records that the committed:

```bash
node --test qa/ink-p1-integration-001.test.mjs
```

was not launched in its sandbox; exact-source checks were used instead.

## Bounded correction authorization

DEV may continue on the same Integration branch only for:

1. ensure an image with `o.rasterState?.colorRaster` is dispatched into the existing integrated `renderer.drawImage()` path even when adjustment/filter/effect/mask stacks are empty;
2. retain the existing unsupported-color diagnostic behavior;
3. add a deterministic integration regression proving a rasterState-only image does not fall back to the legacy `o.src` renderer path;
4. preserve existing ordinary `src` image behavior;
5. rerun the complete Integration QA with fail=0 / skip=0;
6. update `working/INK_P1_INTEGRATION_DEV_PROGRESS.md`;
7. STOP for MR re-review.

Preferred correction boundary:

- `product/source/src/studio-core.js`
- `qa/ink-p1-integration-001.test.mjs`
- `working/INK_P1_INTEGRATION_DEV_PROGRESS.md`

Do not modify other product source unless the new regression proves it is technically required. If another file is required, document exact evidence before changing it.

## Still prohibited

- Integrated Runtime
- final UI implementation
- P2 expansion
- FORMAT_VERSION change
- new/parallel authority
- P1-F/G/H semantic redesign
- unrelated snap/layout redesign

## Non-blocking note for later UI

History-backed snap-setting methods exist:
- `setSnapEnabledState()`
- `setSnapCategoryState()`

Legacy current UI toggles still use compatibility setters directly. This is not the renderer blocker above; final Photoshop-aligned UI must bind to the accepted page.snap authority and should use the History-backed mutation path where UR/MR specifies undoability.

## Current gate

```text
P1_INTEGRATION = MR_REVISE / BOUNDED_RENDERER_DISPATCH_CORRECTION
P1_INTEGRATION_PROMOTION = BLOCKED
P1_INTEGRATED_RUNTIME = PROHIBITED
UI = HOLD
```
