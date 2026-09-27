# INK DEV Progress

TASK: `INK-P1-E-ADVANCED-SELECTION-001`

BRANCH: `work/ink-p1-e-advanced-selection-001`

BASELINE_MAIN: `e932003795a19f286327b63a6c6b9af6970014e6`

PRODUCT_BASELINE_MAIN: `206f027785c04e56e91293e439fef8fb0cdd8521`

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

WORKPACK:
`working/INK_P1_E_ADVANCED_SELECTION_DEV_WORKPACK_v1.0.md`

AUTHORITY:
`product/source/src/image/raster-selection-tools.js`

UPSTREAM:
- `P1-A = MODULE_READY / MR_PASS / PROMOTED`
- `P1-B = MODULE_READY / MR_PASS / PROMOTED`
- `P1-C = MODULE_READY / MR_PASS / PROMOTED`
- `P1-D = MODULE_READY / MR_PASS / PROMOTED`

RUNTIME: `PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE`

UI_IMPLEMENTATION: `PROHIBITED`

CHAT_EXPANSION: `PROHIBITED`

FORMAT_VERSION_CHANGE: `PROHIBITED`

## Scope

1. Magnetic Lasso Core
2. Object Selection Core

## Allowed source boundary

May modify:
- `product/source/src/image/raster-selection-tools.js`

May add only if necessary:
- `product/source/src/image/raster-selection-edge.js`
- `qa/ink-p1-e-advanced-selection.test.mjs`

Anything beyond this boundary requires STOP → MR.

## Initial checkpoint

```text
LATEST_CHECKPOINT_SHA = branch creation baseline
PRODUCT_SOURCE_CHANGES = 0
FOCUSED_QA = NOT RUN
DEV_HANDOFF = NO
```

DEV must update this file at meaningful checkpoints and STOP after final handoff for MR review.
