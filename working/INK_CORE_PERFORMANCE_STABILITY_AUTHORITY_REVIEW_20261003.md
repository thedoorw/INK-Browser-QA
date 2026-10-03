# Core performance authority review — 2026-10-03

Authority: ACTIVE/INK_CHAT_CORE_LIVE_AUTHORITY_v1.0.md

Original DEV candidate: 17bfdeccec76cba24970578f048296485e3af4bb.
Original return: 8f54859d9dc020ca8171d8d933ca0eb858ceb729.
Disposition: NOT ACCEPTED AS SUBMITTED / REPRODUCED CACHE INVALIDATION REGRESSION.

## Finding PERF-01

The early request key rounded matrix coefficients to 0.001 but omitted the prior derived-scale discriminator. A legal transform [1,0,0,1,0,0] → [1.0004,0,0,1.0004,0,0] reused old bounds/scale in the submitted candidate. Baseline b3c1b8f77a0d4369508ce811506b423a9ed000ad correctly missed its cache.

Reproducer: native Brush size14, seed9182, points (0,0,p.8)/(300,25,p.8), minimumStrokes1, preferredScale1, maxDimension=max(run bounds)*.60055, maxPixels100000.

Baseline after edit: scale .6003098760495802, bounds [-8.041149242852622,-8.041149242852622,315.17432915758405,40.71732163014329], matches fresh rendering.
Submitted cached result: scale .60055, bounds [-8.037934069224931,-8.037934069224931,315.0483098336506,40.701041213657824].
Both local raster hashes were 4234280415, demonstrating why pixel hash alone missed the stale placement geometry.

## Bounded authority revision

Revised immutable candidate: 0ac6e236a2baff587224398bc6f3e3aff35f5318.
Same existing cache and preparation authority; preserve exact preferredScale and request points/matrix/opacity in the request key. Warm identical calls still skip preparation. No UI/FORMAT_VERSION/new engine.

Added fractional transform, point, opacity, scale, dimension/pixel budget and Paper invalidation checks against a fresh renderer, including exact bounds/scale and pixel bytes.

An existing Paper singleton test had a stale source-spelling assertion after accepted A5 includeMixers support. Replaced only that assertion with native backend behavioral checks preserving the 2+ default and explicit singleton support. No product behavior was changed for this harness reconciliation.

Authority checkout tests: 24/24 PASS (focused cache5, B4 5, Paint Session bounds5, Paper singleton5, roughness4).
DEV timing reductions remain isolated-harness observations for the original candidate, not browser performance proof for this revision.

## Next gate

Queue an exact revised-candidate browser A5 regression with bounded real Canvas2D cache diagnostics and A1/A2/A3/B2/B4/singleton/roughness regressions. Existing hosted request concurrency is non-cancelling and runs immutable request commits; preserve concurrent B3 product work.

TECHNICAL_SCOPE = BOUNDED
CANDIDATE_BROWSER = PENDING
INTEGRATION = NOT PERFORMED
FORMAL_LIVE = PENDING
FINAL_ACCEPTANCE = NOT CLAIMED

Combined Capability Qualification TEST remains a pure evidence owner. Its next scoped handoff is Draw + Reference combined regression on the accepted optimization composition, using exact candidate/deployed identity; no product mutation or self-acceptance. Review/integration/deployment remain with authority.
