# INK DEV Progress

TASK: `INK-P1-A-RASTER-SELECTION-FILL-SAMPLING-001`

BRANCH: `work/ink-p1-a-raster-selection-fill-sampling-001`

BASELINE_MAIN: `0f3a5b099c77f5ff1f6860ddfdb333276b65a2fe`

WORKPACK_BASELINE_MAIN: `9c808b6ef68480dbfd3d394b8dabddaee2aab0b4`

STATUS: `DEV_COMPLETE / QA_ASSERTIONS_STRENGTHENED / MODULE_READY_HANDOFF / WAITING_MR`

WORKPACK:
`working/INK_P1_A_RASTER_SELECTION_FILL_SAMPLING_DEV_WORKPACK_v1.0.md`

RUNTIME: `DEFERRED / NOT AUTHORIZED FOR MODULE_READY`

UI_IMPLEMENTATION: `PROHIBITED / CHANGES_0`

CHAT_EXPANSION: `PROHIBITED / CHANGES_0`

FORMAT_VERSION_CHANGE: `PROHIBITED / CHANGES_0`

## Scope completion

| Capability | Result | Core contract |
|---|---|---|
| Polygonal Lasso Core | COMPLETE | bounded coordinates; deterministic pixel-center even-odd raster selection; no document mutation |
| Quick Selection Core | COMPLETE | deterministic seeded region growth; add/subtract samples; alpha-aware color distance; explicit bounded-work guard |
| Magic Wand / tolerance selection Core | COMPLETE | alpha-aware RGBA tolerance; contiguous flood and non-contiguous scan share one match authority |
| Select-and-Mask refinement Core | COMPLETE | smooth / feather / expand / contract reuse existing `createRasterMask` / `modifyRasterMask` authority |
| Gradient fill Core | COMPLETE | deterministic linear/radial gradients; 2+ stops; stop/global opacity; raster result only |
| Paint Bucket / tolerance flood fill Core | COMPLETE | reuses Magic Wand tolerance authority; contiguous/non-contiguous; preserves non-target pixels; source remains immutable |
| Eyedropper / Color Sampler Core | COMPLETE | exact RGBA point sample; bounded averaged radius; deterministic edge clipping; read-only |

## Changed files

Core implementation files unchanged in this QA-only revision.

QA-only revision:
- `qa/ink-p1-a-raster-selection-fill-sampling.test.mjs`

Handoff record:
- `ACTIVE/INK_DEV_PROGRESS.md`

Existing authorities intentionally not modified:
- `product/source/src/image/raster-selection-tools.js`
- `product/source/src/image/raster-fill-tools.js`
- `product/source/src/image/image-core.js`
- `product/source/src/editor/selection.js`
- `product/source/src/history/history.js`

## QA assertion strengthening

Added only the MR-requested assertions:

1. Select-and-Mask `smooth` now verifies the actual alpha result:
   `[0,0,255,0,0]`
   instead of only checking output length.
2. Linear Gradient now verifies:
   - three-stop / multi-stop interpolation at 25%, 50%, and 75%;
   - global `opacity: 0.5` produces alpha `128`.

QA assertion checkpoint:
`72fd0ba43978ed94d2bc20d4f8581d65116fcf50`

## Focused QA rerun

```text
NODE_SYNTAX_CHECK = PASS
COMMAND = node --test qa/ink-p1-a-raster-selection-fill-sampling.test.mjs
P1_A_FOCUSED_QA = PASS
TESTS = 10 / 10 PASS
FAIL = 0
SKIP = 0
```

Current QA blob:
`5799591e5f0f84d08ccc534c0ef78c21fb776e78`

Core implementation checkpoint remains:
`c782727e77f79cfcee8404d01ef8d2f4d785b4a0`

Core implementation blobs remain unchanged:

```text
raster-selection-tools.js = 181fafbabff7d71e05015e8479a664880291551d
raster-fill-tools.js      = 4881e9ecd7929500d6f307a0d379ac33e99ac81e
```

## Bounded limitations / deferred integration

- MODULE_READY Core only; no final document mutation, History, save/load or UI wiring was added.
- Quick Selection is deterministic pixel-region growth, not Object Selection and not AI/model segmentation.
- Select-and-Mask implements the required smooth/feather/expand/contract set; optional edge-shift is not added.
- Color Sampler average radius uses a bounded square sample window clipped to canvas edges.
- Gradient fill is limited to the authorized linear/radial Core behavior.
- Integrated browser Runtime remains intentionally deferred by workpack.
- This revision changed QA assertions only; no Core behavior changed.

## Scope confirmation

```text
Core source changes in QA revision = 0
UI changes = 0
CHAT changes = 0
FORMAT_VERSION change = 0
second Selection/Mask/Image/History authority introduced = 0
P1-B/C/D implementation = 0
P1_A_FOCUSED_QA = PASS
DEV_HANDOFF = YES
NEXT = STOP / WAIT_MR
```
