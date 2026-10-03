# Core performance stability 002 — Authority review — 2026-10-03

Original DEV candidate: f2dd755e54d53cd1d5f2f67b77f6d17917ade31a.
Authority browser-tested candidate: 87158d5c372cfd40deff5ee6c887ddecbc7a4e69.

ACCEPTED_FOR_INTEGRATION. Formal Live acceptance remains pending.

Production change: one cache-key expression in studio-core.js. External sources retain their existing cache using source/stack identity. Raster-state sources retain document modifiedAt invalidation. Existing getImage source caching and replaceDocument cache clearing were inspected. No second authority, UI or FORMAT_VERSION change.

Local checks: 18 focused/cache/Paper plus 5 existing History checks PASS. Relocated History harness needs temporary qa/core/src -> product/source/src resolution; source was unchanged.

Candidate browser run 37107672964 / request 39235f0ea86923d0ad35b2ac092fe919a291b141: real Canvas2D warm cache, fresh pixel parity, adjustment/source/raster invalidation, stack state roundtrip, raster/external transition, clear/rebuild PASS. Five independent qualified B2 families (brightnessContrast/gaussianBlur/multiply/colorOverlay/twirl) with Preview and exact Undo/Redo PASS; A1/A2/A3/A5/B4, Mask/source Retouch/advanced ingest PASS.

Initial full-B2 run 37107512936 failed the old opaque-image dropShadow RENDER_UNCHANGED assertion before reaching the cache probe. Baseline diagnostic 37107617887 reproduced exactly the same failure on unchanged 0793cdbe0d72115962c23ee31353304babfe5472. This is an existing unqualified shadow fixture/finding, not a new cache regression; no dropShadow qualification claimed. Failure evidence is retained. Representative B2 coverage is independent, not weakened.

Latest-main intervening changes are QA/documentation only; latest product composition is retained. Deployment must preserve established CSP wrapper adaptation and verify exact source.

Timing: 64x48 real Canvas2D cold 4.600000000005821 ms; warm 0.1999999999825377/0.10000000000582077/0.10000000000582077/0.20000000001164153 ms. No before/after browser speedup claim. DEV performance figures remain isolated-harness only.
