# INK Current Work Order

STATUS: `CURRENT / MR_AUTHORIZED / UI_HOLD`

DATE: 2026-09-27

## Current program

```text
PRIMARY_TASK = INK-P1-D-LAYER-EFFECTS-COMPLETION-001
PROGRAM = ALL_P1_BEFORE_RUNTIME_CAPABILITY_COMPLETION
OWNER = MR / MAIN REVIEW

BASELINE_MAIN = b214c177972be2e6175459005720bb72e697cec2
CAPABILITY_BASELINE = ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
EXPLICIT_PARTIAL_BOUNDED_ITEMS = 8

P1_P2_DISPOSITION = working/INK_P1_P2_GAP_DISPOSITION_v1.0.md
P1_A = MODULE_READY / PROMOTED
P1_B = MODULE_READY / PROMOTED
P1_C = MODULE_READY / PROMOTED
P1_D_WORKPACK = working/INK_P1_D_LAYER_EFFECTS_COMPLETION_DEV_WORKPACK_v1.0.md
MANDATORY_DEV_BRANCH = work/ink-p1-d-layer-effects-completion-001

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

## Current DEV authorization — P1-D

P1-A:
`MODULE_READY / MR_PASS / PROMOTED`

P1-B:
`MODULE_READY / MR_PASS / PROMOTED`

P1-C:
`MODULE_READY / MR_PASS / PROMOTED`

P1-C promoted main:
`b214c177972be2e6175459005720bb72e697cec2`

DEV is now authorized only for P1-D:

1. Drop Shadow
2. Inner Shadow
3. Outer Glow
4. Stroke

Existing Color Overlay must remain operational and regression-tested.

Mandatory branch:
`work/ink-p1-d-layer-effects-completion-001`

Authoritative workpack:
`working/INK_P1_D_LAYER_EFFECTS_COMPLETION_DEV_WORKPACK_v1.0.md`

P1-D completes the existing `image-core.js → applyLayerEffects()` renderer authority.

No P1-E through P1-H implementation is authorized by this Work Order.

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
→ P1-E Advanced Selection
→ MR MODULE_READY review
→ P1-F Raster Processing Expansion
→ MR MODULE_READY review
→ P1-G Color / Bit Depth / Channels
→ MR MODULE_READY review
→ P1-H Format Interoperability
→ MR MODULE_READY review
→ P1 INTEGRATION WORK ORDER
→ focused/integrated QA
→ ONE exact-SHA integrated Runtime
→ refreshed promoted capability authority
→ UR full-capability reconciliation
→ UI_HOLD may be cleared
```

User/MR sequencing rule:

```text
ALL NATIVE P1 = COMPLETE BEFORE INTEGRATED RUNTIME
NO INTEGRATED RUNTIME BETWEEN P1 PACKAGES
FOCUSED / UNIT QA PER PACKAGE = REQUIRED
P2 / ADAPTER = NOT PART OF THIS RUNTIME GATE
```

The items previously planned after UI but still classified P1 are now moved before Runtime:
- Magnetic Lasso;
- Object Selection;
- Adjustment breadth;
- Filter / Filter Gallery breadth;
- Liquify;
- 8/16/32-bit workflow;
- RGB/CMYK/Lab/Multichannel;
- ICC color management;
- Channels / alpha / spot channels;
- PSD/PSB/TIFF/RAW/EXR interoperability breadth.

P2, Adapter and Outside-current-core items remain later work.

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
CURRENT_GATE = P1_D_DEV_AUTHORIZED
P1_A_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_B_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_C_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_D_PRODUCT_IMPLEMENTATION = AUTHORIZED
P1_E_F_G_H = NOT YET AUTHORIZED
INTEGRATED_RUNTIME = PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE
UI_IMPLEMENTATION = HOLD
INK_MANUAL_PROSE = NON_BLOCKING
```

## Next action

DEV:
- create/use the mandatory P1-D branch;
- implement only the bounded P1-D workpack;
- run focused QA;
- update branch-local `ACTIVE/INK_DEV_PROGRESS.md`;
- hand off exact HEAD;
- STOP.

MR:
- P1-C MODULE_READY and promotion are closed;
- wait for exact P1-D handoff;
- review P1-D before authorizing P1-E.

UR:
- remain on HOLD.
