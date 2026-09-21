# KNOWN LIMITATIONS

1. This package uses only `PL-015` (Accepted) and `PL-036` (Diagnostic) for real visual verification; it is not a bundled Standard 10 corpus.
2. Visual assets are `TEST_ONLY_NON_AUTHORITATIVE`. They are not formal Authoring parent data and cannot change Review Authority, Formal state, or Benchmark decisions.
3. The image pairs are lossless crops from authoritative Final Review Sheets rather than original full-resolution source files.
4. Geometry Brain Engine is not completed by acceptance of this UI layer.
5. The frozen Full Workbench's historical case paths remain unchanged; the visual resolver applies only to AI Review Mode.
6. `PL-055` intentionally has no bundled visual assets and is retained for explicit missing-asset error testing.
7. Measurement Request remains a UI event/hook and does not create a persistent core record. A persistent implementation would require a separate `POTENTIAL_RA_TOOL_GAP` review.
8. Later UI changes must use this package or an accepted successor as parent. Any Schema, Compiler, Runtime, Review Authority, Formal Gate, or iCAD contract change requires separate governance approval.
9. This package is RA0.9, not RA1.0.
