# Fourfold Benefit Summary

## INK Capability Increment
- 30+ material instances remain editable
- three-ring hierarchy and occlusion order
- ring-local edit preserves middle/inner/center
- count increase preserves prior repeat IDs
- Non-front flower assembled from independent template instances
- front/back layer ordering
- perspective-like scale and bend
- single folded petal update preserves other petals
- Four-level plant hierarchy
- parent transform moves attached branches and flowers
- detached leaf local edit preserves main crown
- shared flower/leaf materials reused across plant
- Illustrator .js host detection and security scan on a 212-line procedural script
- partial operation extraction from loops, conditionals, layers, rectangles and ellipses
- reviewed deterministic Recipe reproduces an 80-object spirograph flower
- parameter change and rollback remain deterministic
- Complete A4 botanical poster with six semantic layers
- 36-petal main flower plus two buds, foliage, stems, frame and composition hierarchy
- main-flower edit preserves background, frame and foliage hashes
- background-color edit preserves vector structure hashes
- deterministic work-level SVG and PNG export
- INK can preserve a structured vector flower input and a separate named focus layer
- focus-region edit and rollback are deterministic
- unsupported raster operations are explicitly rejected instead of being replaced by vector opacity effects

## Capability Gap Increment
- B02-GAP-COROLLA-001 [MEDIUM]: Cross-ring occlusion and local asymmetry require reviewed strategy steps rather than automatic inference.
- B02-GAP-PERSPECTIVE-001 [HIGH]: Perspective is expressed by scale/rotation/bend approximations; no native envelope or projective warp.
- B02-GAP-BOTANICAL-001 [MEDIUM]: Leaf-vein substructure and botanical attachment semantics are not native templates.
- B02-GAP-JSX-001 [HIGH]: Only a minority of source operations compile directly; object construction, random color assignment and host-specific geometry require reviewed equivalents.
- B02-GAP-GT-004 [MEDIUM]: Adobe Illustrator execution and pixel ground truth are unavailable.
- B02-GAP-COMPOSITION-001 [MEDIUM]: Composition is encoded in a reviewed Recipe; INK does not yet infer focal hierarchy, margins, negative space or title placement from a target.
- B02-GAP-PDF-001 [LOW]: No verified PDF export path was available in this benchmark Runtime.
- B02-GAP-RASTER-001 [CRITICAL]: No native raster-layer document object can execute the action input and output workflow.
- B02-GAP-ATN-001 [HIGH]: The original ATN is opaque and cannot be imported, parsed or replayed.
- B02-GAP-WATERCOLOR-001 [CRITICAL]: The confirmed setup can be represented, but the watercolor transformation and final layer stack cannot execute.

## AI Behavior Library Increment

### Atomic
- B02-A-SET-PETAL-OVERRIDE
- B02-A-SCALE-PETAL-FOR-FORESHORTENING
- B02-A-DETACH-LEAF-INSTANCE
- B02-A-CREATE-ELLIPSE-SEQUENCE
- B02-A-CHANGE-BACKGROUND-LAYER
- B02-A-CREATE-FOCUS-LAYER
### Composite
- B02-C-BUILD-DENSE-THREE-RING-COROLLA
- B02-C-CROSS-RING-OCCLUSION
- B02-C-ASSEMBLE-THREE-QUARTER-FLOWER
- B02-C-FOLD-PETAL-FRONT-BACK
- B02-C-ASSEMBLE-BRANCHED-PLANT
- B02-C-BUILD-HALF-OPEN-FLOWER
- B02-C-TRANSLATE-SPIROGRAPH-SEQUENCE
- B02-C-BUILD-BOTANICAL-POSTER
- B02-C-PRESERVE-LAYOUT-DURING-MAIN-FLOWER-EDIT
- B02-C-PREPARE-WATERCOLOR-ACTION-INPUT
### Strategy
- B02-S-BREAK-RADIAL-UNIFORMITY-WITH-LOCAL-CORRECTION
- B02-S-ORDER-PETALS-BY-VIEW-DEPTH
- B02-S-PROPAGATE-PARENT-TRANSFORM-WITH-PRESERVATION
- B02-S-FIX-RANDOM-SEED-FOR-REPLAY
- B02-S-COMPOSE-FOREGROUND-MIDGROUND-BACKGROUND
- B02-S-SEPARATE-STYLE-RESEARCH-FROM-VECTOR-VALIDATION
- B02-S-CHOOSE-RASTER-RESEARCH-BOUNDARY

## Material / Structure Library Increment
- B02-MAT-PEONY-OUTER-BROAD
- B02-MAT-PEONY-MIDDLE-TRANSITION
- B02-MAT-PEONY-INNER-TIGHT
- B02-STRUCT-THREE-RING-PEONY
- B02-MAT-TULIP-FRONT-PETAL
- B02-MAT-TULIP-BACK-PETAL
- B02-MAT-TULIP-FOLDED-PETAL
- B02-STRUCT-THREE-QUARTER-TULIP
- B02-MAT-BRANCH-STEM
- B02-MAT-HALF-OPEN-FLOWER
- B02-MAT-BUD-CALYX-ASSEMBLY
- B02-STRUCT-FOUR-LEVEL-PLANT-HIERARCHY
- B02-MAT-SPIROGRAPH-ELLIPSE-CLUSTER
- B02-STRUCT-PROCEDURAL-80-OBJECT-FLOWER
- B02-MAT-HERO-PEONY-COROLLA
- B02-MAT-SECONDARY-BUD-PAIR
- B02-STRUCT-BOTANICAL-POSTER-A4
- B02-STRUCT-SEMANTIC-SIX-LAYER-COMPOSITION
- B02-STYLE-WATERCOLOR-ACTION-REFERENCE
- B02-STRUCT-FOCUS-SELECTION-LAYER
- B02-STYLE-PAPER-BRUSH-PATTERN-DEPENDENCY-REFERENCE
