# A3 Paper bounded exposure

Classification: EXPOSURE_GAP. USER authorized the Live Test / Deployment MR repair loop and continuation from A2 to A3. Branch: `work/ink-live-paper-exposure-001`; base: `7b735cd91f2952e0609fe607457044f6fc287aaf`.

`page.paper.set.v1` uses zero object targets and one key/value pair, scoped to the captured active page. It calls existing `InkApp.changePaper()`: existing page.paper, scoped History, paper texture cache, NaturalMedia cache, UI refresh and Renderer stay authoritative. A paper-state fingerprint rejects proposals after paper changes; pending interactive previews, no-op and invalid values are rejected.

Allowed keys: type, color, gridSize, absorbency, roughness, fiberStrength, fiberAngle, sizing, granulation, seed, textureVisible. Color uses #RRGGBB; bounded numeric profile fields follow native UI ranges; seed is uint32. One changed field is one atomic native History entry. Return includes active page id, normalized native paper state and existing paperProfileFingerprint.

QA: hosted exact-candidate native natural Stroke; change roughness and absorbency; renderer-backed transparent Preview delta; unchanged stroke data; two History entries; Undo/Redo restore exact paper and Preview; invalid/no-op/stale/pending-preview rejection. Existing A2/A1/B2 representative regression stays separate. FORMAT_VERSION=4. UI/Core/History implementation unchanged.

Status: candidate implementation prepared; no browser PASS or promotion claimed yet.
