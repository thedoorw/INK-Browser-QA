# INK DEV Progress

TASK: `INK-P1-C-VECTOR-TEXT-PRECISION-LAYOUT-001`

BRANCH: `work/ink-p1-c-vector-text-precision-layout-001`

BASELINE_MAIN: `38702e793f374e93c613b245d0576fb37d538d84`

WORKPACK_PRODUCT_BASELINE: `c35b81a81845b65dfd462e7d225a192d3393f135`

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

WORKPACK:
`working/INK_P1_C_VECTOR_TEXT_PRECISION_LAYOUT_DEV_WORKPACK_v1.0.md`

UPSTREAM:
- `P1-A = MODULE_READY / MR_PASS / PROMOTED`
- `P1-B = MODULE_READY / MR_PASS / PROMOTED`

RUNTIME: `PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE`

UI_IMPLEMENTATION: `PROHIBITED`

CHAT_EXPANSION: `PROHIBITED`

FORMAT_VERSION_CHANGE: `PROHIBITED`

## Scope

1. Skew
2. Distort
3. Perspective
4. Warp
5. Paragraph Type
6. Vertical Type
7. Text on Path
8. Gradient Fill
9. Pattern Fill
10. Persistent ruler guides
11. Equal-distance smart snapping
12. Ruler / measurement

## Allowed source boundary

May add:
- `product/source/src/editor/transform-advanced.js`
- `product/source/src/editor/text-layout.js`
- `product/source/src/editor/precision-layout.js`
- `product/source/src/vector/fill-appearance.js`
- `qa/ink-p1-c-vector-text-precision-layout.test.mjs`

May modify only if strictly required:
- `product/source/src/editor/transform.js`
- `product/source/src/editor/text-object.js`
- `product/source/src/document/layout.js`
- `product/source/src/vector/paint-appearance.js`
- existing Core geometry/math module used by current authority

Anything beyond this boundary requires STOP → MR.

## Initial checkpoint

```text
LATEST_CHECKPOINT_SHA = branch creation baseline
PRODUCT_SOURCE_CHANGES = 0
FOCUSED_QA = NOT RUN
DEV_HANDOFF = NO
```

DEV must update this file at meaningful checkpoints and STOP after final handoff for MR review.
