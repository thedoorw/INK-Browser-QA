# INK P1-A MR Review v1.0

STATUS: `MR_PASS / P1_A_MODULE_READY / NOT_YET_PROMOTED`

TASK: `INK-P1-A-RASTER-SELECTION-FILL-SAMPLING-001`

REVIEWED_BRANCH: `work/ink-p1-a-raster-selection-fill-sampling-001`

REVIEWED_HEAD: `21918c7e47ab1f31f70ff77816a6179fda4e2800`

IMPLEMENTATION_COMMIT: `c782727e77f79cfcee8404d01ef8d2f4d785b4a0`

QA_STRENGTHENING_COMMIT: `72fd0ba43978ed94d2bc20d4f8581d65116fcf50`

DATE: 2026-09-27

## MR verdict

```text
P1_A_CORE_IMPLEMENTATION = PASS
P1_A_SCOPE = PASS
P1_A_SOURCE_AUTHORITY = PASS
P1_A_FOCUSED_QA = PASS (DEV 10/10)
P1_A_QA_ASSERTION_REVIEW = PASS
P1_A_MODULE_READY = YES
PRODUCT_BRANCH_PROMOTED = NO
INTEGRATED_RUNTIME = NOT RUN / PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE
```

## Changed product/QA files

Added:
- `product/source/src/image/raster-selection-tools.js`
- `product/source/src/image/raster-fill-tools.js`
- `qa/ink-p1-a-raster-selection-fill-sampling.test.mjs`

Branch-local handoff:
- `ACTIVE/INK_DEV_PROGRESS.md`

No changes to:
- `product/source/src/image/image-core.js`
- `product/source/src/editor/selection.js`
- `product/source/src/history/history.js`
- UI / CHAT / FORMAT_VERSION

## Capability review

| Capability | MR |
|---|---|
| Polygonal Lasso | PASS |
| Quick Selection | PASS |
| Magic Wand | PASS |
| Select-and-Mask refinement | PASS |
| Gradient Fill | PASS |
| Paint Bucket | PASS |
| Eyedropper / Color Sampler | PASS |

## QA assertion follow-up

The requested QA-only revision was completed without changing Core blobs.

Confirmed:
- Smooth now asserts actual alpha result `[0,0,255,0,0]`;
- Gradient now asserts 3-stop interpolation at 25/50/75%;
- Gradient now asserts global opacity 0.5 → alpha 128.

Current focused QA blob:
`5799591e5f0f84d08ccc534c0ef78c21fb776e78`

Core blobs remain:
- raster-selection-tools.js = `181fafbabff7d71e05015e8479a664880291551d`
- raster-fill-tools.js = `4881e9ecd7929500d6f307a0d379ac33e99ac81e`

## Independent MR execution note

MR inspected exact GitHub source, commits, blobs and assertions. The isolated review container could not resolve `github.com`, so MR did not claim an independent second execution of the Node test.

The acceptance basis is:
- exact DEV handoff;
- exact GitHub commit/blob verification;
- source-level review of all seven Core contracts;
- QA assertion content review;
- DEV reported focused run: `10 / 10 PASS`.

This limitation does not change MODULE_READY because the Work Order requires DEV focused QA, not a second MR runtime execution.

## Scope / sequencing

```text
UI_CHANGES = 0
CHAT_CHANGES = 0
FORMAT_VERSION_CHANGE = 0
SECOND_SELECTION_MASK_IMAGE_HISTORY_AUTHORITY = 0
P1_B_THROUGH_H_SCOPE_INTRUSION = 0
```

The reviewed branch is behind current main only by MR governance/sequencing documents; no overlapping product-source changes were identified.

## Next gate

```text
P1_A_MODULE_READY
→ PROMOTE / RECONCILE P1-A onto latest main
→ then authorize P1-B
```

No integrated Runtime between P1 packages.
