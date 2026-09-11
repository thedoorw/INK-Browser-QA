# INK v1.6.4 Watercolor Visual Core Report

## Implemented Increment

Brush Material v2 extends the existing vector brush system with artwork and mask metadata, edge and opacity profiles, pigment density, deterministic width/rotation/spacing/color variation, grain reference, license/hash provenance, and VECTOR/RASTER/HYBRID render classification.

The renderer remains the existing INK vector runtime. No second brush runtime was created.

## Visual Components

- Path-driven irregular multi-layer strokes
- Watercolor Petal v2 with multiple pigment fills, concentration strokes, and broken edge layers
- Watercolor Leaf v2 with directional vein
- Watercolor Stem v2 with directional width and opacity variation
- Non-rectangular multi-lobe wash
- Seeded non-uniform splatter
- Separable procedural paper overlay

## Determinism

All variation is generated from serialized seeds. Identical input and seed reproduce identical object IDs, document structure, SVG, and PNG. Changed seed produces a visible and traceable result.

## Claim Boundary

This increment is a vector/hybrid visual approximation. It does not implement fluid flow, paper absorption, pigment granulation, or physical watercolor simulation.
