# Watercolor Artist Photoshop Action research

- Case ID: `case-06-real-watercolor-procedure-research`
- Status: **PASS**
- Decision: **RESEARCH**
- Role: real watercolor procedure research
- Ground Truth: Adobe tutorial Before/After and process evidence; action not bundled or executed

## Capability increment
- INK can preserve a structured vector flower input and a separate named focus layer
- focus-region edit and rollback are deterministic
- unsupported raster operations are explicitly rejected instead of being replaced by vector opacity effects

## Gap increment
- B02-GAP-RASTER-001: No native raster-layer document object can execute the action input and output workflow.
- B02-GAP-ATN-001: The original ATN is opaque and cannot be imported, parsed or replayed.
- B02-GAP-WATERCOLOR-001: The confirmed setup can be represented, but the watercolor transformation and final layer stack cannot execute.

## Behaviors
- atomic: B02-A-CREATE-FOCUS-LAYER
- composite: B02-C-PREPARE-WATERCOLOR-ACTION-INPUT
- strategy: B02-S-SEPARATE-STYLE-RESEARCH-FROM-VECTOR-VALIDATION, B02-S-CHOOSE-RASTER-RESEARCH-BOUNDARY

## Materials / Structures
- B02-STYLE-WATERCOLOR-ACTION-REFERENCE
- B02-STRUCT-FOCUS-SELECTION-LAYER
- B02-STYLE-PAPER-BRUSH-PATTERN-DEPENDENCY-REFERENCE
