# INK Current Work Order

STATUS: `CURRENT / MR_AUTHORIZED / UI_HOLD`

DATE: 2026-09-27

## Current program

```text
PRIMARY_TASKS = INK-P1-INTEGRATION-001
PROGRAM = ALL_P1_BEFORE_RUNTIME_CAPABILITY_COMPLETION
OWNER = MR / MAIN REVIEW

BASELINE_MAIN = dcc41aa595bad8eaa73dce05a7b2fa988a7cce2f
CAPABILITY_BASELINE = ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
EXPLICIT_PARTIAL_BOUNDED_ITEMS = 8

P1_P2_DISPOSITION = working/INK_P1_P2_GAP_DISPOSITION_v1.0.md
P1_A = MODULE_READY / PROMOTED
P1_B = MODULE_READY / PROMOTED
P1_C = MODULE_READY / PROMOTED
P1_D = MODULE_READY / PROMOTED
P1_E = MODULE_READY / PROMOTED
P1_F_WORKPACK = working/INK_P1_F_RASTER_PROCESSING_EXPANSION_DEV_WORKPACK_v1.0.md
P1_G = MODULE_READY / MR_PASS / PROMOTED
P1_G_MR_REVIEW = working/INK_P1_G_MR_REVIEW_v1.0.md
P1_H_WORKPACK = working/INK_P1_H_FORMAT_INTEROPERABILITY_DEV_WORKPACK_v1.0.md
P1_INTEGRATION_WORKPACK = working/INK_P1_INTEGRATION_DEV_WORKPACK_v1.0.md
P1_INTEGRATION_BRANCH = work/ink-p1-integration-001
P1_INTEGRATION_ACTIVATION_MAIN = 87f57980a071ff8f009f3aa354951d81025fecf0
P1_INTEGRATION_PROGRESS = working/INK_P1_INTEGRATION_DEV_PROGRESS.md
P1_RUNTIME_WORKPACK = working/INK_P1_INTEGRATED_RUNTIME_DEV_WORKPACK_v1.0.md
P1_F_BRANCH = work/ink-p1-f-raster-processing-expansion-001
P1_F_PROMOTION_MERGE = 5bb74c1c0ad655dac8ae00b5474da52b58db18db
P1_H_BRANCH = work/ink-p1-h-format-interoperability-001

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

## Current DEV authorization — P1 Integration

All P1 capability packages A through H are now `MODULE_READY / MR_PASS / PROMOTED`.

Current task:
`INK-P1-INTEGRATION-001`

Workpack:
`working/INK_P1_INTEGRATION_DEV_WORKPACK_v1.0.md`

Mandatory DEV branch:
`work/ink-p1-integration-001`

Execution owner:
`DEV`

MR owns:
- exact activation-main SHA;
- scope/authority review;
- handoff acceptance or bounded revision;
- promotion.

DEV owns:
- complete technical integration of accepted P1 A-H capabilities;
- focused/integrated QA;
- exact handoff evidence;
- STOP for MR.

The integrated Runtime remains prohibited inside this workpack.

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
→ [P1-F Raster Processing Expansion || P1-G Color / Bit Depth / Channels]
→ independent MR MODULE_READY reviews
→ P1-H Format Interoperability
→ MR MODULE_READY review
→ P1 INTEGRATION DEV WORK ORDER
→ DEV technical integration + focused/integrated QA
→ MR review / promotion
→ P1 INTEGRATED RUNTIME DEV WORK ORDER
→ DEV executes ONE exact-SHA integrated Runtime
→ MR Runtime evidence review
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
CURRENT_GATE = P1_INTEGRATION_MR_REVISE_RENDERER
P1_A_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_B_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_C_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_D_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_E_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_F_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_G_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_H_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
INTEGRATED_RUNTIME = PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE
UI_IMPLEMENTATION = HOLD
INK_MANUAL_PROSE = NON_BLOCKING
```

## Next action

DEV-Integration:
- continue only on `work/ink-p1-integration-001`;
- reviewed handoff HEAD `4c985ec692b2c1275ec23205c0823bb40283430a` = MR_REVISE;
- perform only the bounded renderer dispatch correction in `working/INK_P1_INTEGRATION_MR_REVIEW_v1.0.md`;
- ensure rasterState-only imported images route through the integrated color-raster renderer;
- add the missing renderer regression;
- rerun complete Integration QA with fail=0 / skip=0;
- update lane progress;
- do not run integrated Runtime;
- hand off a new exact HEAD;
- STOP for MR re-review.

MR:
- record exact activation-main SHA;
- Integration reviewed HEAD `4c985ec692b2c1275ec23205c0823bb40283430a` = MR_REVISE; review record `working/INK_P1_INTEGRATION_MR_REVIEW_v1.0.md`;
- re-review exact Integration handoff after bounded renderer correction;
- promote only after `P1_INTEGRATION_QA = PASS / FAIL 0 / SKIP 0`;
- only after Integration MR_PASS/promoted, authorize `INK-P1-INTEGRATED-RUNTIME-001` for DEV.

UR:
- remain on HOLD.

