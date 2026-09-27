# INK DEV Progress

TASK: `INK-P1-A-RASTER-SELECTION-FILL-SAMPLING-001`

BRANCH: `work/ink-p1-a-raster-selection-fill-sampling-001`

BASELINE_MAIN: `0f3a5b099c77f5ff1f6860ddfdb333276b65a2fe`

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

WORKPACK:
`working/INK_P1_A_RASTER_SELECTION_FILL_SAMPLING_DEV_WORKPACK_v1.0.md`

RUNTIME: `DEFERRED / NOT AUTHORIZED FOR MODULE_READY`

UI_IMPLEMENTATION: `PROHIBITED`

CHAT_EXPANSION: `PROHIBITED`

FORMAT_VERSION_CHANGE: `PROHIBITED`

## Scope

1. Polygonal Lasso Core
2. Quick Selection Core
3. Magic Wand / tolerance selection Core
4. Select-and-Mask refinement Core
5. Gradient fill Core
6. Paint Bucket / tolerance flood fill Core
7. Eyedropper / Color Sampler Core

## Allowed source boundary

May add:
- `product/source/src/image/raster-selection-tools.js`
- `product/source/src/image/raster-fill-tools.js`

May modify only if strictly necessary:
- `product/source/src/image/image-core.js`
- `product/source/src/editor/selection.js`

Focused QA:
- `qa/ink-p1-a-raster-selection-fill-sampling.test.mjs`

## Initial checkpoint

```text
LATEST_CHECKPOINT_SHA = branch creation baseline
PRODUCT_SOURCE_CHANGES = 0
FOCUSED_QA = NOT RUN
DEV_HANDOFF = NO
```

DEV must update this file with each meaningful checkpoint and STOP after final handoff for MR review.
