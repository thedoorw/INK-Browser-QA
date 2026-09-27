# INK DEV Progress

STATUS: `P1-F + P1-G PARALLEL / DEV_AUTHORIZED`

DATE: 2026-09-27

PROGRAM: `ALL_P1_BEFORE_RUNTIME_CAPABILITY_COMPLETION`

PARALLEL_BRANCH_CUT: `dcc41aa595bad8eaa73dce05a7b2fa988a7cce2f`

UPSTREAM:
- P1-A = MODULE_READY / MR_PASS / PROMOTED
- P1-B = MODULE_READY / MR_PASS / PROMOTED
- P1-C = MODULE_READY / MR_PASS / PROMOTED
- P1-D = MODULE_READY / MR_PASS / PROMOTED
- P1-E = MODULE_READY / MR_PASS / PROMOTED

## Lane F

TASK: `INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

BRANCH:
`work/ink-p1-f-raster-processing-expansion-001`

WORKPACK:
`working/INK_P1_F_RASTER_PROCESSING_EXPANSION_DEV_WORKPACK_v1.0.md`

LANE_PROGRESS:
`working/INK_P1_F_DEV_PROGRESS.md`

Scope:
- Adjustment breadth
- Filter / Filter Gallery breadth
- Liquify Core

## Lane G

TASK: `INK-P1-G-COLOR-BITDEPTH-CHANNELS-001`

BRANCH:
`work/ink-p1-g-color-bitdepth-channels-001`

WORKPACK:
`working/INK_P1_G_COLOR_BITDEPTH_CHANNELS_DEV_WORKPACK_v1.0.md`

LANE_PROGRESS:
`working/INK_P1_G_DEV_PROGRESS.md`

Scope:
- 8/16/32-bit raster Core
- RGB / CMYK / Lab / Multichannel
- bounded ICC Core
- Channels / alpha / spot channels

## Isolation / gate

```text
P1-F/P1-G SHARED PRODUCT SOURCE = 0
image-core.js mutation during parallel MODULE_READY = 0
document schema mutation = 0
Renderer mutation = 0
FORMAT_VERSION mutation = 0
P1-H = NOT YET AUTHORIZED
RUNTIME = PROHIBITED
UI = HOLD
```

P1-H may be authorized only after P1-G is MR_PASS and the color/bit-depth/channel contract is frozen.

Each DEV lane updates its own lane progress file and STOPs independently for MR review.
