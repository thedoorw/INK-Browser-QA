# INK C06 Canvas Navigation 12800% Zoom — DEV Dispatch v1.0

STATUS: ACTIVE
REPO: thedoorw/INK-Browser-QA
BASE: latest main at execution time
PREPARED_FROM_MAIN: `e6486e1efb351597dd3062df7b5f3f1baf012167`

## Task

Raise INK manual canvas zoom ceiling from **2400%** to **12800%** as one bounded C06 capability package.

Create fresh branch:

`work/c06-canvas-navigation-12800-zoom-001`

## Required implementation

Use **one shared zoom-limit authority** for:
- wheel zoom;
- pinch / gesture zoom;
- +/- controls;
- Navigator slider;
- Navigator numeric input.

Target:
- max camera scale: `24 → 128`
- max manual zoom: `2400% → 12800%`

Do not patch only the Navigator UI.

## Required verification

Verify at high zoom:
- center-preserving zoom;
- pan;
- selection / hit tolerance;
- brush / eraser cursor geometry;
- rulers / guides / overlays;
- Navigator proxy rectangle;
- Canvas2D / WebGL rendering;
- tile/cache/memory behavior;
- no NaN / overflow / precision drift.

Run existing navigation/regression checks plus focused C06 browser evidence.

## Boundaries

Do not modify:
- C04 圖紙 / 手繪板;
- New Document / A4;
- History;
- unrelated UI fidelity;
- FORMAT_VERSION;
- unrelated Core capability ownership.

No second zoom-state authority and no slider-only workaround.

## Return

Return:
- branch;
- exact candidate SHA;
- changed files;
- focused browser evidence;
- regression result;
- technical-debt delta.

Then STOP → Supervisor review. Do not merge.
