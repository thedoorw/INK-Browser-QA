# INK DEV Progress — INK-P1-H-FORMAT-INTEROPERABILITY-001

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

BRANCH: `work/ink-p1-h-format-interoperability-001`

BASELINE_MAIN: `136ca9c961ff0f2e543e196e74a3ae0983faaf78`

STATUS: `AUTHORIZED / DEV_NOT_STARTED / PARALLEL_WITH_P1_F`

WORKPACK:
`working/INK_P1_H_FORMAT_INTEROPERABILITY_DEV_WORKPACK_v1.0.md`

UPSTREAM:
- P1-A through P1-E = MODULE_READY / MR_PASS / PROMOTED
- P1-G = MODULE_READY / MR_PASS / PROMOTED
- P1-G promotion merge = `fff2e6961a5f72d42134ca2fedca533be0aa31c7`
- P1-F = independent lane; may remain in progress

P1-G AUTHORITY INPUTS:
- `product/source/src/image/color-management-core.js`
- `product/source/src/image/channel-core.js`

RUNTIME: `NOT RUN / PROHIBITED UNTIL ALL P1 A-H + P1 INTEGRATION CLOSE`

UI: `HOLD / PROHIBITED`

## Scope

1. PSD
2. PSB
3. TIFF
4. RAW decoder-adapter boundary
5. EXR

## Allowed source boundary

May add:
- `product/source/src/image/format-interoperability.js`
- `product/source/src/image/formats/**`
- `product/source/src/image/formats/adapters/**`
- `qa/fixtures/p1-h/**`
- `qa/ink-p1-h-format-interoperability.test.mjs`

Must not modify:
- P1-G Core files
- P1-F source
- `product/source/src/image/image-core.js`
- Document model/migration/storage
- Renderer
- `studio-core.js`
- `ink.js`
- History
- CHAT
- Recipe
- FORMAT_VERSION
- UI

## Initial checkpoint

```text
LATEST_CHECKPOINT_SHA = branch creation baseline
PRODUCT_SOURCE_CHANGES = 0
DEPENDENCIES_ADDED = 0
FOCUSED_QA = NOT RUN
DEV_HANDOFF = NO
```

DEV updates this lane file at meaningful checkpoints and STOPs after exact handoff for MR review.
