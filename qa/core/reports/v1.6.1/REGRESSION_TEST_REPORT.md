# INK v1.6.1 RC Regression Test Report

- Clean `npm ci`: PASS.
- v1.6.0 regression: 7/7 PASS.
- v1.6.1 Fleurify unit regression: 2/2 PASS.
- Full Fleurify Import → Parse → Recipe → Preview → Approval → Execute → SVG → formal PNG: 21/21 PASS.
- Renderer: `CHROMIUM_CDP_CANONICAL_PNG`.
- 100/rerun PNG SHA-256 and pixel data: identical.
- 100/70 Difference: non-empty.
- Stable ID, Local Recompute, invalid-input rollback, and deterministic replay: PASS.

Decision: APPROVED
