# A3 Paper bounded exposure

Classification: EXPOSURE_GAP. USER authorized the Live Test / Deployment MR repair loop and continuation from A2 to A3. Branch: `work/ink-live-paper-exposure-001`; base: `7b735cd91f2952e0609fe607457044f6fc287aaf`.

`page.paper.set.v1` uses zero object targets and one key/value pair, scoped to the captured active page. It calls existing `InkApp.changePaper()`: existing page.paper, scoped History, paper texture cache, NaturalMedia cache, UI refresh and Renderer stay authoritative. A paper-state fingerprint rejects proposals after paper changes; pending interactive previews, no-op and invalid values are rejected.

Allowed keys: type, color, gridSize, absorbency, roughness, fiberStrength, fiberAngle, sizing, granulation, seed, textureVisible. Color uses #RRGGBB; bounded numeric profile fields follow native UI ranges; seed is uint32. One changed field is one atomic native History entry. Return includes active page id, normalized native paper state and existing paperProfileFingerprint.

QA: hosted exact-candidate native natural Stroke; change roughness and absorbency; renderer-backed transparent Preview delta; unchanged stroke data; two History entries; Undo/Redo restore exact paper and Preview; invalid/no-op/stale/pending-preview rejection. Existing A2/A1/B2 representative regression stays separate. FORMAT_VERSION=4. UI/Core/History implementation unchanged.

Status: candidate implementation prepared; no browser PASS or promotion claimed yet.

## A3 Paper exposure — accepted / deployed / Live qualified 2026-10-03

PR #128 merged. Exact tested candidate: `1afb52a9c6fc77f5f121f5b7e8d9be2c626006be`; merged/deployed source: `ab84aafc3006f0f14a74d231ca862200bd0b5d94`. Complete product/source tree equals `30d55495650acd365acc2b1e92c7669fa01f1870` for candidate and merge. Live wrapper deployment commit: `8d2fba408efc205c903efaae24a958440a6a71b1`.

- Formal Live request: `clusterA-A3-paper-live-001`; request commit `e64806bf08bcdc2c26c5fd3323af8c78b474356a`; result commit `d85cd4a766a18cdd526ccc54354c6f7f52b93573`.
- Hosted run `37085274905`; artifact `11260127110`; digest `sha256:ad69149bf5c08577a1908e8b370584a777b2f41f050618e537aeb0e4dedc4df1`.
- Exact source verified; apiReady=true; 23 named tools; no pointer emulation.
- `page.paper.set.v1` uses existing InkApp.changePaper and native scoped History. Roughness .42→.95, absorbency .58→.05; normalized paper receipt returned.
- Two native adjacent Brush/DryBrush strokes; two Stroke History entries plus two scoped `調整畫布` entries.
- Transparent content Preview `fnv1a32:dd280788→fnv1a32:20df496f`; two Undo restore `dd280788`; two Redo restore `20df496f`. Two stable native Stroke objects remain.
- Candidate Paper QA, A2 four-mode Stroke, A1 Paint Session and B2 brightnessContrast regressions PASS. Invalid/no-op/stale/pending-preview safety checks PASS.
- Evidence: `qa/evidence/live-a3-20261003/`; source review: `working/INK_LIVE_A3_PAPER_MR_REVIEW_20261003.md`.

Explicit separate confirmed gaps, retained outside this exposure closure:
1. `PAPER_SINGLE_STROKE_RENDER_INTEGRATION`: single native stroke uses renderStroke without page.paper; paper-coupled renderStrokeRun requires 2+ adjacent Brush/DryBrush strokes. Single-stroke candidate probe FAIL is preserved. Classification PRODUCT_RENDER_INTEGRATION_GAP.
2. `PAPER_WEBGL_ROUGHNESS_PARITY`: roughness state changes but roughness-only transparent Preview is unchanged in the tested WebGL multichannel backend; source GPU simulation has no dedicated roughness uniform whereas Canvas2D paper-field resistance consumes roughness. Classification PRODUCT_RENDER_INTEGRATION_GAP / backend parity. No all-field or all-backend completeness claim.

```text
A2_NATIVE_STROKE = PASS / LIVE QUALIFIED
A3_PAPER_EXPOSURE = PASS / MERGED / DEPLOYED / LIVE QUALIFIED
A3_PAPER_RENDER_QUALIFIED_SUBSET = TWO-OR-MORE ADJACENT BRUSH/DRYBRUSH / ABSORBENCY
PAPER_SINGLE_STROKE_RENDER_INTEGRATION = OPEN / CONFIRMED
PAPER_WEBGL_ROUGHNESS_PARITY = OPEN / CONFIRMED
A4_TARGETED_ERASER = OPEN / SEPARATE
A5_BLENDER_SMUDGE = OPEN / SEPARATE PRODUCT_RENDER_INTEGRATION_GAP
FULL_NATURAL_MEDIA_COMPLETENESS = NOT_CLAIMED
```
