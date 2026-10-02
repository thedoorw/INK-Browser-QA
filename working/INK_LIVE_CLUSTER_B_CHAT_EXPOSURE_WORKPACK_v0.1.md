# INK Live Cluster B — CHAT Exposure Workpack v0.1

TYPE = IMPLEMENTATION DESIGN / NOT YET AUTHORIZED FOR MAIN PROMOTION
DATE = 2026-10-02
SOURCE_REPO = thedoorw/INK-Browser-QA
PARENT_AUDIT = working/INK_LIVE_CLUSTER_B_RASTER_EFFECTS_DEFORMATION_SOURCE_AUDIT_20261002.md

## Execution status — 2026-10-02

```text
B0 = COMPLETE / PR #118 / browser PASS / merged
B1 = COMPLETE / PR #119 / browser PASS / merged / Live PASS
B2 = NEXT
B3 = LATER
B4 = OPEN
```

Authoritative B1 formal Live evidence:
`clusterB-B1-live-rerun-004` on deployed source `3a785b90d6f7922175cca3662fd2b72bf95430ce`.

The current B1 named-tool qualification covers browser-local PNG/JPEG/WebP. Do not silently broaden that PASS to PSD/TIFF/EXR/RAW.

## Objective

Close the highest-value Raster / Filter / Effect / Deformation Live gaps by exposing existing native authorities to CHAT without creating duplicate Document, History, Renderer, raster-state or transform authorities.

The package sequence is intentionally narrow:

```text
B0 web raster → native rasterState bridge
→ B1 mutable raster attachment import
→ B2 non-destructive image-stack edits
→ B4 native Path deformation
→ later B3 local/destructive raster tools + masks
```

Text warp remains a separate product/render package and is not part of this exposure work.

## B0 — web raster bridge

Current candidate:
- branch `work/ink-live-web-raster-bridge-002`
- Draft PR `#114`
- HEAD `5bec56b5a4db08404a03ea43d71d158c849a4b56`
- base product checkpoint `aa01f1e311eb22cb572a61efea19b8bb21a96157`

Native seam:
- existing extraction decoder validates PNG/JPEG/WebP and returns RGBA ImageData + source identity;
- `webRasterImageDataToDocumentState()` converts RGBA8 into existing `color-raster / ink-image-state`;
- `InkApp.importWebRaster()` commits existing `type:'image' + rasterState` through History.

Required before promotion:
- exact candidate browser/runtime proof;
- native raster object is visible through existing Studio renderer;
- object reports `rasterState.colorRaster`;
- History undo removes import;
- History redo restores import and pixels;
- ReferenceImage semantics remain unchanged.

## B1 — mutable raster attachment import

### Public surface

Add one direct named tool:

```text
CAPABILITY_ID = raster.import
NAMED_TOOL = import_ink_raster
PUBLIC_METHOD = raster.import
ROLE = WRITE
ROUTING_CLASS = NAMED_TOOL
```

Reason for direct named-tool routing:
- binary attachment import is a create/ingest boundary analogous to existing `reference.import`;
- proposal/approval is still required for later edits to the resulting object;
- do not encode binary data in bounded edit task JSON.

### Authority route

```text
browser-local File / Blob
→ existing normalizeChatAttachment()
→ existing browser-local web-raster decode authority
→ InkApp.importWebRaster()
→ existing History
→ native image + rasterState
→ existing Renderer
→ structured public result
```

Do not unlock or repurpose ReferenceImage.

### Result contract

Return:
- status;
- created native stable ref;
- source identity summary;
- History receipt;
- Revision before/after identity;
- provenance/audit receipt when existing handoff audit infrastructure is available.

Do not return:
- raw File/Blob;
- full raster pixel arrays;
- data URL;
- external URL.

### QA runner delta

The existing `qa/live-chat/run-live-chat-request.mjs` currently permits file payload only for `import_ink_reference`.

When B1 is ready for Live qualification, extend the QA-only validation to permit the same bounded fixture payload for:
- `import_ink_reference`;
- `import_ink_raster`.

This is test infrastructure only, not product authority.

## B2 — bounded non-destructive raster stack edits

All B2 operations use the existing bounded edit controller:

```text
propose_ink_edit
→ explicit approve_ink_edit
→ execute_ink_edit
→ existing History
→ existing image-core descriptors
→ existing Studio raster renderer
```

Every operation:
- requires exactly one stable target ref;
- target must be a visible, unlocked native `image`;
- target must contain `rasterState.colorRaster`;
- uses captured target fingerprint / document / page / revision preconditions;
- rejects ReferenceImage and ordinary src-only image objects;
- invalidates/render-refreshes through existing app authority;
- creates one History entry.

### B2.1 image.adjustment.add.v1

Arguments:
- `type`: enum from existing `IMAGE_CAPABILITIES.adjustments`;
- `params`: bounded JSON object;
- optional `opacity` 0..1.

Execution:
- `createAdjustment(type, params, options)`;
- append to target `adjustments`.

Initial qualification cases should use a small supported subset:
- brightnessContrast;
- hueSaturation;
- levels;
- curves.

Do not claim all adjustment types PASS until individually exercised.

### B2.2 image.filter.add.v1

Arguments:
- `type`: enum from existing `IMAGE_CAPABILITIES.filters`, excluding `liquify` in this operation;
- `params`: bounded JSON object;
- optional `opacity` 0..1.

Execution:
- `createFilter(type, params, options)`;
- append to target `filterStack`.

Initial qualification subset:
- gaussianBlur;
- sharpen;
- noiseGrain;
- textureOverlay.

### B2.3 image.effect.add.v1

Arguments:
- `type`: dropShadow / innerShadow / outerGlow / colorOverlay / stroke;
- `params`: bounded JSON object;
- optional `opacity` 0..1.

Execution:
- existing `createLayerEffect()`;
- append to target `effects`.

### B2.4 image.blend.set.v1

Arguments:
- `mode`: existing supported blend-mode enum.

Execution:
- mutate target `blendMode` through existing History.

No new compositor is allowed.

### B2.5 image.liquify.add.v1

Arguments:
- `operations`: bounded array, maximum 32;
- each operation type: forwardWarp / twirl / pucker / bloat / reconstruct;
- finite x/y/radius/strength/dx/dy values with bounded ranges;
- optional maxWork with product-safe ceiling.

Execution:
- existing `createLiquifyFilter()`;
- append to `filterStack`.

Do not expose arbitrary freeze-mask pixel arrays in v0.1.

## B3 — later local raster tools / masks

Do not fold into B2.

Separate work is required for:
- selection-derived raster masks;
- vector-path masks;
- clone/heal/patch;
- dodge/burn/sponge;
- local blur/sharpen;
- color replacement;
- paint bucket / raster gradient.

Reason:
these need bounded regions, source points, mask geometry or local pixel-edit contracts beyond a simple stack descriptor.

Pointer-event emulation is prohibited.

## B4 — native Path deformation exposure

Product authorities already exist:
- skew/projective/distort/perspective planning in `editor/transform-advanced.js`;
- reversible Path deformation in `vector/deformation.js`.

Initial bounded operations:

```text
path.warp.v1
path.distort.v1
path.perspective.v1
```

All:
- target exactly one native Path stable ref;
- use existing proposal/approval/fingerprint authority;
- return the same Path stable ref;
- preserve editable vector structure;
- use existing History.

Do not route Text into these operations.

## Text deformation exclusion

Current native Text contains a `pathText` descriptor, but current formal `drawText()` does not consume it.

Therefore:

```text
text.warp.v1 = DO NOT EXPOSE YET
text.path.v1 = DO NOT CLAIM RENDERED CAPABILITY YET
C019 = PRODUCT RENDER-INTEGRATION GAP
```

A registry descriptor without real rendering is explicitly prohibited.

## Bounded JSON rule for params

B2 generic parameter objects must not accept unlimited arbitrary JSON.

Minimum normalizer:
- plain object only;
- maximum serialized size 8 KiB;
- maximum depth 4;
- maximum 64 object keys total;
- maximum array length 128;
- strings maximum 512 characters;
- finite numbers only;
- no functions / prototypes / binary arrays.

Native constructors remain the semantic allowlist after structural bounding.

## Qualification order

```text
1. B0 exact browser/runtime
2. B1 PNG import → native rasterState → Preview → History undo/redo
3. B2 brightnessContrast
4. B2 gaussianBlur
5. B2 blend mode
6. B2 one layer effect
7. B2 one Liquify operation
8. B4 Path warp/distort
9. rerun C010/C011/C013/C014/C015
10. keep C019 open until product text-deformation implementation
```

Tool-call success alone is not PASS.

## Promotion rule

Only an exact reviewed SHA may move to `thedoorw/INK`.

After promotion:
- update `BUILD_INFO.json`;
- run the formal Live request runner against `https://thedoorw.github.io/INK/`;
- record results in `INK/TEST_FINDINGS.md`;
- close only the capability families actually exercised.

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

