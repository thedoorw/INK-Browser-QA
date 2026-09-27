# INK DEV Progress — INK-P1-G-COLOR-BITDEPTH-CHANNELS-001

TASK: `INK-P1-G-COLOR-BITDEPTH-CHANNELS-001`

BRANCH: `work/ink-p1-g-color-bitdepth-channels-001`

BASELINE_MAIN: `dcc41aa595bad8eaa73dce05a7b2fa988a7cce2f`

STATUS: `AUTHORIZED / DEV_NOT_STARTED / PARALLEL_LANE`

WORKPACK:
`working/INK_P1_G_COLOR_BITDEPTH_CHANNELS_DEV_WORKPACK_v1.0.md`

CORE_AUTHORITY_TARGET:
`product/source/src/image/color-management-core.js + channel-core.js`

PARALLEL_PEER:
`INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

RUNTIME: `NOT RUN / PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE`

## Scope

1. 8/16/32-bit raster Core
2. RGB / CMYK / Lab / Multichannel
3. bounded ICC Core
4. Channels / alpha / spot channels

## Parallel isolation

```text
SHARED_PRODUCT_SOURCE_WITH_PEER = 0
FORBIDDEN = P1-F files / image-core.js / document schema / Renderer / FORMAT_VERSION
UI = PROHIBITED
CHAT = PROHIBITED
RECIPE = PROHIBITED
HISTORY/SAVE-LOAD = DEFERRED TO INTEGRATION
```

## Initial checkpoint

```text
LATEST_CHECKPOINT_SHA = branch creation baseline
PRODUCT_SOURCE_CHANGES = 0
FOCUSED_QA = NOT RUN
DEV_HANDOFF = NO
```

DEV updates only this lane progress file and STOPs after exact handoff for MR review.
