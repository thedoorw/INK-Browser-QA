# AI Review Mode — Real Visual Assets

AI Review Mode retains the original Full Workbench and focuses on one Decision Target at a time.

The visual verification resolver loads only the two test cases listed in `visual_test_assets/asset_manifest.json`. It does not modify the embedded case records, Candidate decisions, AI Task State semantics, Action hook semantics, Review Authority, or Formal Compiler Gate.

Available visual operations:

- Reference / Runtime side-by-side
- synchronized target crop, zoom, and pan
- 50% Overlay
- Difference computed in-browser
- Wipe with persistent slider state
- explicit missing-asset error for an unprovisioned case

Raw Boundary remains collapsed by default and marked `Evidence only · Not formal geometry`.
