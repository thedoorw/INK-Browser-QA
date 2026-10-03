# INK Core Performance / Stability 003 — DEV Return — 2026-10-03

STATUS = DEV COMPLETE / AUTHORITY REVIEW REQUIRED

Branch: `work/ink-core-performance-stability-003`
Latest-main integration base: `3aa4c8268851d778aeea9fadcc99b53c4aed8ad0`
Exact candidate: `b7b4f95f4cec1e5827b537040f916556eeef9b98`
Candidate tree: `236d65c52339df92886c0cb50f643090d52741d1`
Production source blob: `product/source/src/spatial/page-spatial-index.js` = `7d08238152cfe32c2737928a262aa4ae48e99a56`

## Reproduced bottleneck

Large multi-object spatial-index synchronization repeated full page hierarchy discovery and index removal work once per changed object:

`queueSpatialSelection → ensureSpatialIndex → syncObjects → K × syncObject → K × findPageObject / upsertObject`.

This is observable on large documents and multi-object move/transform/align workloads. It is not a memory-leak claim.

## Minimal repair

`PageSpatialIndex.syncObjects()` now deduplicates target ids once and preserves the existing incremental path while the unique batch size is at or below the existing quadtree `capacity` (default 12).

When the batch is larger than that existing capacity, it calls the existing `PageSpatialIndex.rebuild()` once instead of repeating K per-object hierarchy/index passes.

No new spatial authority, cache, Renderer, History, UI behavior or FORMAT_VERSION was introduced.

## Measurement

Isolated source-algorithm timing, Node v22.16.0, 11 trials per cell:

| Objects | Changed batch | Current median | Candidate median |
| ---: | ---: | ---: | ---: |
| 1,000 | 1 | 0.127 ms | 0.104 ms |
| 1,000 | 12 | 1.145 ms | 1.079 ms |
| 1,000 | 13 | 0.863 ms | 0.231 ms |
| 3,000 | 100 | 23.020 ms | 0.787 ms |
| 5,000 | 250 | 93.140 ms | 1.485 ms |

Evidence: `qa/evidence/ink-core-performance-stability-003/measurement.json`.

These are bounded isolated measurements, not browser-frame, GPU or Formal Live performance claims.

## Focused QA / regression

Committed regression: `qa/ink-core-performance-stability-003.test.mjs`.

DEV isolated semantic harness: 4 / 4 PASS:
- small batches stay incremental;
- large batches rebuild once and do not run per-object sync;
- duplicate ids do not falsely cross the threshold;
- visibility exclusion and spatial query state remain correct after a large-batch rebuild.

Focused QA record: `qa/evidence/ink-core-performance-stability-003/focused-qa.json`.

The only production file changed is `product/source/src/spatial/page-spatial-index.js` (6 additions / 1 deletion). `ink.js`, quadtree, hierarchy, History, Renderer, Image Core, Stroke, UI and FORMAT_VERSION are unchanged. Packages 001/002 have no source overlap with this repair. The pre-existing dropShadow finding was not touched or re-qualified.

The current execution environment did not expose a full repository checkout or a workflow-dispatch route. Therefore DEV does not claim a full-checkout Node run, browser Runtime, Formal Live qualification, acceptance, merge or deployment. The committed focused test is ready for authority execution on this exact candidate.

## Memory boundary

No heap profiler evidence was available.

`MEMORY_LEAK_CLAIM = NONE`

The repair adds no retained cache. No heap or leak improvement is claimed.

## Handoff

NEXT_OWNER = CHAT / Core / Live authority

Required authority continuation:
`exact candidate review → execute committed focused QA / affected regressions → integration decision → deployment identity → Formal Live as required`.

DEV stops here. No self-acceptance, merge or deployment.
