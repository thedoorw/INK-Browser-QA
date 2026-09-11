# Botanical HERO Poster

- Case ID: `case-05-botanical-hero-poster`
- Status: **PASS**
- Decision: **VALIDATION REQUIRED**
- Role: complete artwork-level composition
- Ground Truth: Structural and composition acceptance criteria; external design Ground Truth unavailable

## Capability increment
- Complete A4 botanical poster with six semantic layers
- 36-petal main flower plus two buds, foliage, stems, frame and composition hierarchy
- main-flower edit preserves background, frame and foliage hashes
- background-color edit preserves vector structure hashes
- deterministic work-level SVG and PNG export

## Gap increment
- B02-GAP-COMPOSITION-001: Composition is encoded in a reviewed Recipe; INK does not yet infer focal hierarchy, margins, negative space or title placement from a target.
- B02-GAP-PDF-001: No verified PDF export path was available in this benchmark Runtime.

## Behaviors
- atomic: B02-A-CHANGE-BACKGROUND-LAYER
- composite: B02-C-BUILD-BOTANICAL-POSTER, B02-C-PRESERVE-LAYOUT-DURING-MAIN-FLOWER-EDIT
- strategy: B02-S-COMPOSE-FOREGROUND-MIDGROUND-BACKGROUND

## Materials / Structures
- B02-MAT-HERO-PEONY-COROLLA
- B02-MAT-SECONDARY-BUD-PAIR
- B02-STRUCT-BOTANICAL-POSTER-A4
- B02-STRUCT-SEMANTIC-SIX-LAYER-COMPOSITION
