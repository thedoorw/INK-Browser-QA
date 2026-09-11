# Spirograph.js

- Case ID: `case-04-real-complex-illustrator-spirograph`
- Status: **PASS**
- Decision: **VALIDATION REQUIRED**
- Role: real complex Illustrator procedure
- Ground Truth: Repository source and preview; Illustrator execution EXTERNAL VALIDATION PENDING

## Capability increment
- Illustrator .js host detection and security scan on a 212-line procedural script
- partial operation extraction from loops, conditionals, layers, rectangles and ellipses
- reviewed deterministic Recipe reproduces an 80-object spirograph flower
- parameter change and rollback remain deterministic

## Gap increment
- B02-GAP-JSX-001: Only a minority of source operations compile directly; object construction, random color assignment and host-specific geometry require reviewed equivalents.
- B02-GAP-GT-004: Adobe Illustrator execution and pixel ground truth are unavailable.

## Behaviors
- atomic: B02-A-CREATE-ELLIPSE-SEQUENCE
- composite: B02-C-TRANSLATE-SPIROGRAPH-SEQUENCE
- strategy: B02-S-FIX-RANDOM-SEED-FOR-REPLAY

## Materials / Structures
- B02-MAT-SPIROGRAPH-ELLIPSE-CLUSTER
- B02-STRUCT-PROCEDURAL-80-OBJECT-FLOWER
