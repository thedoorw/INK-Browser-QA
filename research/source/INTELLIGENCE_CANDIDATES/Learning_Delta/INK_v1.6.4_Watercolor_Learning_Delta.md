# INK v1.6.4 Watercolor Learning Delta

## Before

INK v1.6.3 could execute an editable vector-watercolor procedure, but the visual result still relied heavily on uniform transparent closed paths, regular outlines, rectangular wash logic, uniform splatter, and a paper reference rather than a separable verified overlay.

## After

INK can now select a versioned Brush Material v2 before construction; replay deterministic edge, width, opacity, color, and density variation; build petals from multiple pigment layers and concentration strokes; create directional leaves and tapered stems; generate non-rectangular wash and seeded irregular splatter; and separate a traceable paper overlay from editable vector structure.

The result is visibly more varied than v1.6.3, but remains vector-structured and does not yet meet professional Illustrator watercolor reference quality. Paper interaction and pigment physics remain research gaps.

## Evidence

- WC-01 through WC-05 under `Validation/v1.6.4/watercolor-benchmark/`
- `Validation/v1.6.4/visual-comparisons/`
- `tests/v164/watercolor-visual-core-v2.test.mjs`
