# Dense Multi-layer Peony / Rose

- Case ID: `case-01-dense-multilayer-peony`
- Status: **PASS**
- Decision: **VALIDATION REQUIRED**
- Role: high-density multi-layer corolla
- Ground Truth: Structural acceptance criteria; external visual Ground Truth unavailable

## Capability increment
- 30+ material instances remain editable
- three-ring hierarchy and occlusion order
- ring-local edit preserves middle/inner/center
- count increase preserves prior repeat IDs

## Gap increment
- B02-GAP-COROLLA-001: Cross-ring occlusion and local asymmetry require reviewed strategy steps rather than automatic inference.

## Behaviors
- atomic: B02-A-SET-PETAL-OVERRIDE
- composite: B02-C-BUILD-DENSE-THREE-RING-COROLLA, B02-C-CROSS-RING-OCCLUSION
- strategy: B02-S-BREAK-RADIAL-UNIFORMITY-WITH-LOCAL-CORRECTION

## Materials / Structures
- B02-MAT-PEONY-OUTER-BROAD
- B02-MAT-PEONY-MIDDLE-TRANSITION
- B02-MAT-PEONY-INNER-TIGHT
- B02-STRUCT-THREE-RING-PEONY
