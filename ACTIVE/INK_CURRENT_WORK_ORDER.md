# INK Current Work Order

STATUS: `CURRENT / MR_AUTHORIZED / UI_HOLD`

DATE: 2026-09-27

## Current program

```text
PRIMARY_TASK = INK-P1-A-RASTER-SELECTION-FILL-SAMPLING-001
PROGRAM = PRE_UI_MATURE_PLATFORM_CAPABILITY_COMPLETION
OWNER = MR / MAIN REVIEW

BASELINE_MAIN = 9c808b6ef68480dbfd3d394b8dabddaee2aab0b4
CAPABILITY_BASELINE = ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
EXPLICIT_PARTIAL_BOUNDED_ITEMS = 8

P1_P2_DISPOSITION = working/INK_P1_P2_GAP_DISPOSITION_v1.0.md
P1_A_WORKPACK = working/INK_P1_A_RASTER_SELECTION_FILL_SAMPLING_DEV_WORKPACK_v1.0.md
MANDATORY_DEV_BRANCH = work/ink-p1-a-raster-selection-fill-sampling-001

FORMAT_VERSION = 4
CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34

UI_PROGRAM = PHOTOSHOP_ALIGNED_FINAL_UI_REBUILD
UI_OWNER = UR / UI REVIEW
UI_STATUS = HOLD
```

## Completed upstream gates

```text
INK-RUNTIME-HARNESS-STABILITY-001 = CLOSED
INK-TECH-CLOSURE-001 = CLOSED / PROMOTED
INK-CONNECTOR-005 = CLOSED / PROMOTED

FULL_PRODUCT_CAPABILITY_CENSUS = CLOSED
NORMALIZED_CAPABILITY_REGISTRY = MR_FROZEN
P1_P2_GAP_DISPOSITION = RECORDED
REFRESHED_CAPABILITY_BASELINE = PUBLISHED

FIRST_REBASELINE_RUNTIME = PASS
FIRST_REBASELINE_RUNTIME_TARGET = f911f777f770cbe290e290c4b0cbc3692b36641e
FIRST_REBASELINE_RUNTIME_RUN = 36255595714
FIRST_REBASELINE_RUNTIME_ARTIFACT = 10910238715
P0_PROMOTION = CLOSED
```

The old 61-row P0 register remains preservation evidence, not the full product count.

The current full-product truth is:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

## Current DEV authorization — P1-A

DEV is authorized only for:

1. Polygonal Lasso Core
2. Quick Selection Core
3. Magic Wand / tolerance selection Core
4. Select-and-Mask refinement Core
5. Gradient fill Core
6. Paint Bucket / tolerance flood fill Core
7. Eyedropper / Color Sampler Core

Mandatory branch:
`work/ink-p1-a-raster-selection-fill-sampling-001`

Authoritative workpack:
`working/INK_P1_A_RASTER_SELECTION_FILL_SAMPLING_DEV_WORKPACK_v1.0.md`

P1-A is a UI-neutral Core-module task.

No final UI wiring is authorized.

No P1-B/P1-C/P1-D implementation is authorized by this Work Order.

## P1/P2 execution sequence

```text
P1-A Raster Selection / Fill / Sampling
→ MR MODULE_READY review
→ P1-B Local Raster Retouch
→ MR MODULE_READY review
→ P1-C Vector / Text / Precision Layout
→ MR MODULE_READY review
→ P1-D Layer Effects Completion
→ MR MODULE_READY review
→ PRE-UI INTEGRATION WORK ORDER
→ focused/integrated QA + exact-SHA Runtime
→ refreshed promoted capability authority
→ UR full-capability reconciliation
→ UI_HOLD may be cleared
```

The following strategic items are explicitly after-UI or Adapter-class and do not block final UI:
- high-bit-depth workflow;
- RGB/CMYK/Lab/Multichannel;
- ICC;
- Channels;
- broader PSD/PSB/TIFF/RAW/EXR interoperability;
- Liquify;
- Magnetic/Object Selection;
- broader filter/adjustment breadth;
- plugin ecosystem;
- generative/content-aware/Neural/RAW engines where classified Adapter.

## UI authority during HOLD

The Photoshop measurement/alignment reference remains valid.

The previous Function Placement Map remains a reusable reference but is not complete against the refreshed 64-family inventory.

Reconciliation input:
`working/INK_UI_CAPABILITY_RECONCILIATION_GAPS_v0.1.md`

Primary correction:
Raster/Image/Masks/Adjustments/Filters/Blend Modes/Layer Effects/Reusable Raster Source are real product capabilities and may not remain hidden merely because the old capability-facing UI baseline omitted them.

UR must not issue final UI implementation Work Orders yet.

## Current gate

```text
CURRENT_GATE = P1_A_DEV_IN_PROGRESS_OR_HANDOFF
P1_A_PRODUCT_IMPLEMENTATION = AUTHORIZED
P1_B_C_D = NOT YET AUTHORIZED
INTEGRATED_RUNTIME = NOT AUTHORIZED FOR MODULE_READY
UI_IMPLEMENTATION = HOLD
INK_MANUAL_PROSE = NON_BLOCKING
```

## Next action

DEV:
- create/use the mandatory P1-A branch;
- implement only the bounded workpack;
- run focused QA;
- update branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
- hand off exact HEAD;
- STOP.

MR:
- review exact P1-A HEAD and diff;
- mark MODULE_READY or REVISE;
- only then authorize P1-B.

UR:
- remain on HOLD.
