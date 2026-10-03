# INK Core Performance / Stability 002 — DEV Return — 2026-10-03

ROLE: INK Main-Program Optimization DEV  
AUTHORITY: `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`  
SOURCE: `thedoorw/INK-Browser-QA`  
LIVE: `thedoorw/INK`  
BRANCH: `work/ink-core-performance-stability-002`

```text
DEV_DISPOSITION = FIX_COMPLETED
SELF_ACCEPTANCE = NO
SELF_MERGE = NO
SELF_DEPLOY = NO
AUTHORITY_REVIEW_REQUIRED = YES
```

## Exact identities

- Work baseline / latest main at branch creation: `cdfef7b3085782747cc98e286fcd12624f70891a`
- Repair commit: `a69aaf3723d6acc270d7c83fe0c1870365c4ca58`
- **EXACT_CANDIDATE (product + focused test): `f2dd755e54d53cd1d5f2f67b77f6d17917ade31a`**
- Measurement evidence commit: `980c3628799a4bb37e2859cb1b43125817d43192`
- Focused evidence commit: `4cfa4f0977086e711b14663b6079c4d63b93ac75`

Evidence-only commits after the exact candidate do not alter product source or the focused test. Authority should review the exact candidate as the source/test identity and use the later branch commits as its DEV evidence package.

During execution, other CHAT/Core work advanced `main` to `491af48322d1d103be377530f4575b8511a4b5c7`. At final concurrency recheck, the relevant current-main blobs remained byte-identical to this package baseline:

- `product/source/src/studio-core.js` = `70bada16c182975c4500a5434ef81af933ca6c52`
- `product/source/src/image/image-core.js` = `65f6c8c4ea19e2c3058d984c42e5989633e16bc4`
- `product/source/src/history/history.js` = `a1c3cefe60b9923d030bcead1d8565b134aebd21`

No concrete owner overlap was reproduced.

## Reproduced bottleneck

Existing `installRenderer().drawImage()` used this cache identity for image objects with adjustment/filter/effect/mask processing:

```text
object/source identity
+ global app.doc.modifiedAt
+ image stack state
```

For an external-source image, an unrelated document edit therefore changed the cache key even though the image source and its non-destructive stack were unchanged. The renderer then repeated:

```text
source canvas read
→ renderImageStack()
→ applyLayerEffects()
→ processed canvas write
```

This is distinct from performance package 001, which repaired Canvas2D natural-media preparation before an existing warm-cache hit.

## Bounded repair

Changed production source:

- `product/source/src/studio-core.js`

Repair:

- external-source image stacks no longer include global `app.doc.modifiedAt` in their cache identity;
- source identity, adjustments, filters, effects and raster mask remain in the key;
- raster-state images **continue** to include `app.doc.modifiedAt`.

The raster-state boundary is intentionally preserved because History can restore raster pixels through document state. The package does not introduce a raster-content hash, a second cache, or a second Renderer authority.

Not changed:

- Image Core processing algorithms;
- B3 raster mutation implementation;
- History / Revision authority;
- Canvas2D natural-media cache;
- Preview transient semantics;
- UI;
- cache limits;
- `FORMAT_VERSION`.

## Before / after

Source-exact isolated harness, external image stack:

Workload: 192 × 192, 36,864 px, brightness/contrast + hue/saturation + Gaussian blur radius 3 + noise grain.

Before, five unrelated document identity changes:

- processing runs: **5**
- timings: **1598 / 1462 / 1635 / 1560 / 1595 ms**
- median: **1595 ms**
- cache entries: **5**

After:

- processing runs: **1**
- timings: **1521 / 0 / 0 / 0 / 0 ms**
- cache entries: **1**
- repeated unchanged calls: below `Date.now()` millisecond resolution
- eliminated processing executions: **4 / 5 (80%)**

Representative processed output hash remained `1850951412`.

A second exact `studio-core.js` harness at 96 × 96 reproduced the actual cache-key behavior:

- before: 3 document identities → 3 source reads / 3 processed writes / 3 cache entries;
- after: 3 document identities → 1 source read / 1 processed write / 1 cache entry;
- before/after output hash: `3260145365` / `3260145365`.

Relevant invalidation remains:

- adjustment mutation → fresh processing / second cache entry;
- source identity mutation → fresh processing / second cache entry;
- raster-state document identity mutation → 2 raster conversions / 2 cache entries.

## Other required measurements

### Existing drawing

Brush + DryBrush, 120 points each:

- cold: 577 ms;
- five warm calls: 1 / 1 / 1 / 1 / 1 ms;
- one preparation, five preparation skips, one retained cache entry.

Disposition: package 001 warm-cache repair remains effective; no new drawing bottleneck selected.

### Preview

Transient Preview-style Canvas2D multichannel runs:

- 511 / 485 / 510 ms;
- cache entries: 0;
- preparations: 3;
- preparation skips: 0.

Disposition: intentional transient semantics unchanged. No Preview speedup is claimed.

### Undo / Redo

Representative target-scoped History:

- Stroke / 1200 points: commit 9 ms; 49,420 captured bytes; 155 stored bytes; Undo/Redo applies 0–1 ms.
- Raster / 192 × 192: commit 76 ms; 541,600 captured bytes; 155 stored bytes; Undo/Redo applies 0 ms at this clock resolution.

Disposition: Undo/Redo patch application is not the selected bottleneck; History source is unchanged.

## Focused QA / affected regression evidence

Focused test:

`qa/ink-core-performance-stability-002.test.mjs`

Evidence:

- `qa/evidence/ink-core-performance-stability-002/measurement.json`
- `qa/evidence/ink-core-performance-stability-002/focused-qa.json`

DEV source-harness checks:

1. unrelated document mutation does not invalidate unchanged external image stack — PASS;
2. adjustment mutation still invalidates — PASS;
3. external source mutation still invalidates — PASS;
4. raster-state History invalidation remains active — PASS;
5. before/after processed output parity — PASS;
6. drawing warm-cache control — PASS;
7. Preview transient control — PASS;
8. representative History Undo/Redo control — PASS.

Affected-regression scope remains bounded to the existing renderer/image-stack integration. Existing Image Core, raster-processing, History and package-001 regression blobs are unchanged. No central browser Runtime or Formal Live PASS is claimed by DEV.

## Candidate diff

Baseline `cdfef7b3085782747cc98e286fcd12624f70891a` → exact candidate `f2dd755e54d53cd1d5f2f67b77f6d17917ade31a`:

- `product/source/src/studio-core.js`: 1 addition / 1 deletion;
- `qa/ink-core-performance-stability-002.test.mjs`: new focused QA.

No other product source is changed by the exact candidate.

## Measurement limits

The available DEV execution environment could not clone/run the repository checkout directly. Measurements therefore execute exact fetched repository module bodies in an isolated JavaScript harness. DOM/Canvas boundaries are mocked; timing is not browser frame/GPU timing. No heap profiler was available, so no memory-leak claim is made.

## Authority handoff

```text
EXACT_CANDIDATE = f2dd755e54d53cd1d5f2f67b77f6d17917ade31a
DEV_STATUS = READY_FOR_CHAT_CORE_LIVE_AUTHORITY_REVIEW
FORMAL_RUNTIME_ACCEPTANCE = PENDING
FORMAL_LIVE_ACCEPTANCE = PENDING
MERGE = NOT_PERFORMED
DEPLOY = NOT_PERFORMED
```

CHAT/Core/Live authority should review the exact candidate and evidence, reconcile it against then-current `main`, and own any integration / browser Runtime / deployment / Formal Live chain.
