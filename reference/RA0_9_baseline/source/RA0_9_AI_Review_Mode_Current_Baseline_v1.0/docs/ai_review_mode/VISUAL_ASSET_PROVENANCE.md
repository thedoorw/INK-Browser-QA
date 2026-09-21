# Visual Asset Provenance

Source evidence package:

- `RA0_9_RC4_Standard10_Review_and_Correction_Minimal_Package.zip`
- SHA-256: `213cde7a0227ce0ef8b495182519f1a94ef2e7f3297192534acaab2987a3e334`
- Source verifier: `9/9 PASS`
- Role: evidence source only; never a program parent

Cases:

- `PL-015` — Accepted
- `PL-036` — Diagnostic

For each case, `reference.png` and `runtime.png` are exact pixel crops from the authoritative `*_FINAL_REVIEW_SHEET.png`. No resizing, filtering, tracing, redrawing, image generation, or geometry modification was performed. The Runtime source panel is `Final Runtime`, not `Parent Runtime`.

Exact source-sheet SHA-256, crop rectangles, delivered image hashes, case-data hashes, and Target hashes are recorded in `visual_test_assets/asset_manifest.json`.

Historical Overlay and Difference panels are not embedded. Current Overlay and Difference views are recomputed live from the delivered Reference and Runtime images.
