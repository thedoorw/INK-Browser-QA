# INK P1 Integration MR Review v1.0

STATUS: `MR_PASS / P1_INTEGRATION_READY / AWAITING_PROMOTION`

TASK: `INK-P1-INTEGRATION-001`

REVIEWED_BRANCH: `work/ink-p1-integration-001`

REVIEWED_HEAD: `63b247fd4e8c98b54c4cc6974af7a61d2a71fcc1`

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
P1_INTEGRATION_RENDERER_DISPATCH = PASS
P1_INTEGRATION_READY = YES
PROMOTION = AWAITING_MR_CONTROLLED_MERGE
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


## Bounded renderer correction closure

Final handoff:
`63b247fd4e8c98b54c4cc6974af7a61d2a71fcc1`

Correction commits:
```text
0da5855881b52340d634998219d334ccf79d67e6  fix(p1-integration): dispatch raster-state images to renderer
dd4eb8083d322d103ab8de60ff57461e1cadd8d2  test(p1-integration): cover raster-state renderer dispatch
63b247fd4e8c98b54c4cc6974af7a61d2a71fcc1  docs(dev): hand off bounded renderer correction
```

Verified:
- correction delta contains only `studio-core.js`, Integration QA and lane progress;
- rasterState-only image dispatches into the existing integrated image renderer;
- ordinary src-only image remains on the legacy/base image path;
- unsupported Multichannel state retains explicit `unsupported-render` diagnostic and fallback;
- no second Renderer/Image/Color authority was introduced;
- FORMAT_VERSION unchanged;
- integrated Runtime not run.

Final exact blobs:

```text
studio-core.js                  = 2922a9faf888b30a497e0054b85a8b4a44725c0b
qa/ink-p1-integration-001.test = 04e7a750d58f2e5bba2617c91037dbcd96758ac6
```

Checked-in Integration QA:
```text
declared tests = 20
skip tokens = 0
DEV exact-source result = PASS
FAIL = 0
SKIP = 0
INTEGRATED_RUNTIME = NOT RUN
```

MR reviewed the exact source/test blobs and the functional renderer regression. MR does not claim an independent second Node execution in this review environment.

Final verdict:
```text
P1_INTEGRATION = READY / MR_PASS / AWAITING_PROMOTION
P1_INTEGRATED_RUNTIME = BLOCKED_UNTIL_PROMOTION
UI = HOLD
```
