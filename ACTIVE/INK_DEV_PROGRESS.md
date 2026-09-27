# INK DEV Progress

STATUS: `P1-F + P1-H PARALLEL / DEV_AUTHORIZED`

DATE: 2026-09-27

PROGRAM: `ALL_P1_BEFORE_RUNTIME_CAPABILITY_COMPLETION`

UPSTREAM:
- P1-A = MODULE_READY / MR_PASS / PROMOTED
- P1-B = MODULE_READY / MR_PASS / PROMOTED
- P1-C = MODULE_READY / MR_PASS / PROMOTED
- P1-D = MODULE_READY / MR_PASS / PROMOTED
- P1-E = MODULE_READY / MR_PASS / PROMOTED
- P1-G = MODULE_READY / MR_PASS / PROMOTED
- P1-G promotion merge = `fff2e6961a5f72d42134ca2fedca533be0aa31c7`

## Lane F

TASK: `INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

BRANCH:
`work/ink-p1-f-raster-processing-expansion-001`

LANE_PROGRESS:
`working/INK_P1_F_DEV_PROGRESS.md`

## Lane H

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

BRANCH:
`work/ink-p1-h-format-interoperability-001`

WORKPACK:
`working/INK_P1_H_FORMAT_INTEROPERABILITY_DEV_WORKPACK_v1.0.md`

LANE_PROGRESS:
`working/INK_P1_H_DEV_PROGRESS.md`

Scope:
- PSD / PSB
- TIFF
- RAW decoder-adapter boundary
- EXR

## Isolation / gate

```text
P1-H consumes P1-G Core = YES
P1-G source mutation by H = 0
P1-F/P1-H shared product source = 0
image-core.js mutation = 0
document schema mutation = 0
Renderer mutation = 0
FORMAT_VERSION mutation = 0
RUNTIME = PROHIBITED
UI = HOLD
```

P1 Integration is blocked until P1-F and P1-H are both MR_PASS/promoted.
