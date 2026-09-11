# Branched Botanical Unit

- Case ID: `case-03-branched-botanical-unit`
- Status: **PASS**
- Decision: **VALIDATION REQUIRED**
- Role: complete branched plant hierarchy
- Ground Truth: Structural acceptance criteria; external botanical Ground Truth unavailable

## Capability increment
- Four-level plant hierarchy
- parent transform moves attached branches and flowers
- detached leaf local edit preserves main crown
- shared flower/leaf materials reused across plant

## Gap increment
- B02-GAP-BOTANICAL-001: Leaf-vein substructure and botanical attachment semantics are not native templates.

## Behaviors
- atomic: B02-A-DETACH-LEAF-INSTANCE
- composite: B02-C-ASSEMBLE-BRANCHED-PLANT, B02-C-BUILD-HALF-OPEN-FLOWER
- strategy: B02-S-PROPAGATE-PARENT-TRANSFORM-WITH-PRESERVATION

## Materials / Structures
- B02-MAT-BRANCH-STEM
- B02-MAT-HALF-OPEN-FLOWER
- B02-MAT-BUD-CALYX-ASSEMBLY
- B02-STRUCT-FOUR-LEVEL-PLANT-HIERARCHY
