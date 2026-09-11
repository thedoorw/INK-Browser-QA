# INK Product Import Status

STATUS: IN_PROGRESS

SOURCE_BASELINE: `INK_v1.6.5_RC_MAIN.zip`

SOURCE_SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`

WORK_BRANCH: `work/import-product-v0.1`

## Current progress

- PRODUCT classified files: 169
- PRODUCT files written to this branch so far: 52
- Imported bytes are copied from the original ZIP without product refactoring.
- No file is promoted to certified product status by this import.
- FLORA / AI / Recipe remain product-boundary pending even when their original source is preserved under `product/source/`.
- PWA / icons / schema boundary remains pending.

## Safety rule

The import branch preserves original source first. Refactoring, optional-module extraction, deletion, single-file build and three-piece Candidate creation are separate later steps.
