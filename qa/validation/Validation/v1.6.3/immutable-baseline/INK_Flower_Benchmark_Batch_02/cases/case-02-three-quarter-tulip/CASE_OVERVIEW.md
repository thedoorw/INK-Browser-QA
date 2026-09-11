# Three-quarter Tulip Structure

- Case ID: `case-02-three-quarter-tulip`
- Status: **PASS**
- Decision: **VALIDATION REQUIRED**
- Role: side / 3-quarter flower
- Ground Truth: Structural acceptance criteria; external botanical Ground Truth unavailable

## Capability increment
- Non-front flower assembled from independent template instances
- front/back layer ordering
- perspective-like scale and bend
- single folded petal update preserves other petals

## Gap increment
- B02-GAP-PERSPECTIVE-001: Perspective is expressed by scale/rotation/bend approximations; no native envelope or projective warp.

## Behaviors
- atomic: B02-A-SCALE-PETAL-FOR-FORESHORTENING
- composite: B02-C-ASSEMBLE-THREE-QUARTER-FLOWER, B02-C-FOLD-PETAL-FRONT-BACK
- strategy: B02-S-ORDER-PETALS-BY-VIEW-DEPTH

## Materials / Structures
- B02-MAT-TULIP-FRONT-PETAL
- B02-MAT-TULIP-BACK-PETAL
- B02-MAT-TULIP-FOLDED-PETAL
- B02-STRUCT-THREE-QUARTER-TULIP
