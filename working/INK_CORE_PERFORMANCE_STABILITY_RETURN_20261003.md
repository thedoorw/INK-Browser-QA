# INK Core Performance / Stability DEV Return — 2026-10-03

ROLE: INK Main-Program Optimization DEV  
AUTHORITY: `ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md`  
DISPATCH: `ACTIVE/INK_CORE_PERFORMANCE_STABILITY_DEV_DISPATCH_v1.0.md`  
SOURCE: `thedoorw/INK-Browser-QA`  
LIVE: `thedoorw/INK`  
BRANCH: `work/ink-core-performance-stability-001`

```
DEV_DISPOSITION = FIX_COMPLETED
SELF_ACCEPTANCE = NO
SELF_MERGE = NO
AUTHORITY_REVIEW_REQUIRED = YES
```

## Exact identities

- Work baseline / latest main at repair start: `b3c1b8f77a0d4369508ce811506b423a9ed000ad`
- Repair commit: `f93aae7bf4efb02f910b29e04d60054a6f47fec7`
- Focused QA commit: `1833c6363a27917dccb5d86d74db6d9005b5f7df`
- Measurement evidence commit: `805252298daf488852b4507a7fbb393aa020d017`
- **EXACT_CANDIDATE:** `17bfdeccec76cba24970578f048296485e3af4bb`

During execution, unrelated B3 local-retouch work advanced `main` to `904ebd4a8f0f73036d10c656a2d94f0f8022e77b`. I did not merge or absorb that owner's lane. The current-main blobs for the repaired renderer, `ink.js`, History, Image Core and B4 deformation/orchestration files are byte-identical to the work baseline, so no concrete source overlap was found. Authority should integrate the exact candidate onto the then-current main.

## Reproduced bottleneck

Existing `Canvas2DMultiChannelInkRenderer.render()` performed:

```
supports
→ prepareNaturalMediaRun(entries)
→ resample / stamp / transform / bounds
→ scale
→ build cache key
→ cache lookup
```

Therefore a render-cache hit still repeated the expensive natural-media run preparation before returning the already-rendered result.

The defect is reproducible on the native Canvas2D multichannel route used by Brush / DryBrush and accepted Blender / Smudge.

## Bounded repair

Changed production source:

- `product/source/src/render/canvas2d/multi-channel-ink-canvas2d.js`

Repair:

- derive an existing-semantics request fingerprint before `prepareNaturalMediaRun()`;
- check the existing render cache first;
- on hit, return the existing cached result without repeating run preparation;
- on miss, continue through the existing preparation / scale / multichannel rendering path;
- add diagnostics counters `preparations` and `preparationSkips`.

Not changed:

- cache instance or cache authority;
- cache limit;
- native Stroke state;
- History authority;
- raster authority;
- Renderer authority;
- Preview/export transient semantics;
- UI;
- `FORMAT_VERSION`.

No second Core or Renderer path was introduced.

## Before / after measurements

All timing evidence is recorded in:

`qa/evidence/ink-core-performance-stability-001/measurement.json`

### Native Brush + DryBrush

Workload: 2 native Stroke objects, 280 points each, Canvas2D multichannel, maxPixels 220000.

- before warm median: **45 ms**
- after warm median: **2 ms**
- reduction: **95.56%**
- measured speedup: **22.5x**
- pixel hash: `3400334722 → 3400334722`

### Brush + DryBrush + Blender + Smudge

Workload: 4 native Stroke objects, 280 / 280 / 220 / 220 points.

- before warm median: **67.5 ms**
- after warm median: **4 ms**
- reduction: **94.07%**
- measured speedup: **16.875x**
- pixel hash: `2019481362 → 2019481362`

### Larger Brush + DryBrush

Workload: 2 native Stroke objects, 800 points each.

- before warm median: **77 ms**
- after warm median: **6 ms**
- reduction: **92.21%**
- measured speedup: **12.833x**
- pixel hash: `1436354055 → 1436354055`

### Cold control

Same bounded drawing route, 3 fresh renderer instances:

- before: 1894 / 1786 / 1787 ms; median 1787 ms
- after: 1797 / 1756 / 1909 ms; median 1797 ms

Observed median difference is about +0.56% at millisecond timing resolution. This is not treated as a demonstrated cold-path regression.

## Preview

`preview.capture` remains renderer-backed through `renderExportCanvas`, whose natural-media call is `transient:true`.

Transient workload before / after:

- before median: 693.5 ms
- after median: 689 ms
- pixel hash: `3714391014 → 3714391014`
- after: `cacheHits=0`, `cacheEntries=0`, `preparations=4`, `preparationSkips=0`

Disposition: **Preview/export transient semantics unchanged.** This repair does not claim a Preview speedup.

## Representative editable-raster image stack

Measured existing `renderImageStack` using two adjustments plus Gaussian blur and noise grain:

- 256 × 256 / 65,536 px: median 1730 ms
- 512 × 384 / 196,608 px: median 5130 ms

This route was measured but not selected for repair. `product/source/src/image/image-core.js` is unchanged.

## History Undo / Redo

Existing target-scoped History was measured separately:

- native Stroke target, 1200 points: commit 6 ms; 65,567 captured bytes; 148 stored patch bytes; 1 patch.
- 256 × 256 raster target: commit 58 ms; 963,804 captured bytes; 154 stored patch bytes; 1 patch.
- 24 in-place Undo/Redo applies in each bounded case measured below 1 ms each at `Date.now()` resolution.

History was not selected for repair. `product/source/src/history/history.js` is unchanged.

Normal History restoration still triggers the existing renderer path; repeated identical cacheable natural-media redraws can consume the repaired warm-cache route without changing History state or patches.

## Focused QA

Added:

`qa/ink-core-performance-stability-001.test.mjs`

Recorded focused results:

`qa/evidence/ink-core-performance-stability-001/focused-qa.json`

DEV source-harness checks:

1. warm cache hit bypasses repeated preparation — PASS;
2. native Stroke geometry mutation invalidates the request fingerprint — PASS;
3. accepted Blender / Smudge warm cache uses the repair — PASS;
4. transient Preview-style rendering remains uncached — PASS;
5. representative before/after pixel hashes are identical — PASS.

## Affected regression boundaries

- A1 / A2 / A3: main renderer orchestration `product/source/src/ink.js` unchanged; representative output parity recorded.
- A5: Blender / Smudge directly covered by focused test and output parity.
- B2: `product/source/src/image/image-core.js` unchanged; representative image-stack measurement recorded.
- B4: `editor/transform-advanced.js`, `editor/chat-bounded-edit.js`, `vector/deformation.js` and B4 QA are unchanged.
- Paper singleton: source orchestration and `qa/ink-paper-single-stroke-render-integration.test.mjs` unchanged.
- Paper WebGL roughness: `qa/ink-paper-webgl-roughness-parity.test.mjs` unchanged.
- History: unchanged.

This is DEV evidence, not Formal Live acceptance.

## Resource / stability observations

- no new cache;
- no cache-limit increase;
- representative repeated warm renders retain one cache entry;
- transient Preview renders retain zero cache entries;
- no heap profiler was available, so no memory-leak claim is made.

## Measurement limits

The available execution environment could not clone/run the repository checkout directly. Measurements and focused checks therefore executed exact fetched repository module bodies in an isolated JavaScript harness. The final Canvas2D image sink was mocked only at `createImageData` / `putImageData`; natural-media preparation, multichannel simulation, cache logic and pixel composition were executed from repository source.

Timing uses `Date.now()` millisecond resolution. It is not browser frame timing, GPU timing, or heap profiling.

## Authority handoff

```
EXACT_CANDIDATE = 17bfdeccec76cba24970578f048296485e3af4bb
DEV_STATUS = READY_FOR_CHAT_CORE_LIVE_AUTHORITY_REVIEW
FORMAL_LIVE_ACCEPTANCE = PENDING
MERGE = NOT_PERFORMED
```

CHAT/Core/Live authority should review the bounded diff and evidence, integrate the exact candidate onto current main, then perform the required candidate/runtime and Formal Live focused/regression chain with exact deployed source identity.
