# INK Current Work Order

STATUS: `CURRENT / MR_AUTHORIZED / UI_RECONCILIATION_ACTIVE`

DATE: 2026-09-27

## Current program

```text
PRIMARY_TASKS = INK-UI-FULL-CAPABILITY-RECONCILIATION-001
PROGRAM = FULL_CAPABILITY_UI_RECONCILIATION
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
P1_INTEGRATION_PROMOTION_MERGE = d1269334338531228ddfdd9383761cd419e58738
P1_RUNTIME_TARGET_SHA = d1269334338531228ddfdd9383761cd419e58738
P1_RUNTIME_BRANCH = work/ink-p1-integrated-runtime-001
P1_RUNTIME_PROGRESS = working/INK_P1_INTEGRATED_RUNTIME_DEV_PROGRESS.md
P1_RUNTIME_PROGRESS_INIT = 3ebefa880eecc58fa12355fad3daf57fcdedf2ea
P1_RUNTIME_WORKPACK = working/INK_P1_INTEGRATED_RUNTIME_DEV_WORKPACK_v1.0.md
P1_RUNTIME_MR_REVIEW = working/INK_P1_INTEGRATED_RUNTIME_MR_REVIEW_v1.0.md
P1_RUNTIME_STATUS = MR_PASS / RUNTIME_GATE_CLOSED
P1_RUNTIME_HARNESS_WORKPACK = working/INK_P1_RUNTIME_HARNESS_COVERAGE_DEV_WORKPACK_v1.0.md
P1_RUNTIME_HARNESS_BRANCH = work/ink-p1-runtime-harness-coverage-001
P1_RUNTIME_HARNESS_MR_REVIEW = working/INK_P1_RUNTIME_HARNESS_COVERAGE_MR_REVIEW_v1.0.md
P1_RUNTIME_HARNESS_PROMOTION = f112089764b4dc3600ce76ff916c50ca3798456d
P1_RUNTIME_HARNESS_STATUS = MR_PASS / PROMOTED
P1_F_BRANCH = work/ink-p1-f-raster-processing-expansion-001
P1_F_PROMOTION_MERGE = 5bb74c1c0ad655dac8ae00b5474da52b58db18db
P1_H_BRANCH = work/ink-p1-h-format-interoperability-001

FORMAT_VERSION = 4
CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34

UI_PROGRAM = PHOTOSHOP_ALIGNED_FINAL_UI_REBUILD
UI_OWNER = UR / UI REVIEW
UI_STATUS = RECONCILIATION_MR_PASS / IMPLEMENTATION_WORKPACK_REQUIRED
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

## Current gate — Full-capability UI reconciliation

P1 Integrated Runtime has passed MR review and the Runtime gate is closed.

Final Runtime review:
`working/INK_P1_INTEGRATED_RUNTIME_FINAL_MR_REVIEW_v1.0.md`

Exact tested product SHA:
`d1269334338531228ddfdd9383761cd419e58738`

Runtime evidence:
- Run `36330300446`, attempt 2 = SUCCESS;
- P1 A-H + integration = 234/234 PASS, fail 0, skip 0;
- Closure focused = 38 PASS, fail 0;
- browser UI / closure / geometry / creative suites = PASS;
- artifact = `10936541218`;
- artifact digest = `sha256:009cac80f1e11aca065c1ce0ab91014ffccac6427d9e788051ffcb78bb83c1f0`.

The next authorized lane is:
`INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

UR may perform capability-to-UI placement reconciliation and planning.

Formal UI implementation remains HOLD until UR outputs return to MR review.

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
CURRENT_GATE = UI_IMPLEMENTATION_WORKPACK_REQUIRED
P1_A_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_B_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_C_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_D_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_E_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_F_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_G_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
P1_H_PRODUCT_IMPLEMENTATION = MODULE_READY / MR_PASS / PROMOTED
INTEGRATED_RUNTIME = MR_PASS / RUNTIME_GATE_CLOSED
RUNTIME_HARNESS_COVERAGE = MR_PASS / PROMOTED
UI_RECONCILIATION = MR_PASS / CLOSED / PROMOTED
UI_IMPLEMENTATION = NOT_YET_AUTHORIZED / WORKPACK_REQUIRED
INK_MANUAL_PROSE = NON_BLOCKING
```

## Final Runtime closure

```text
RUN_ID = 36330300446
SUCCESSFUL_ATTEMPT = 2
WINDOWS_JOB = 108656605134 / SUCCESS
WINDOWS_RUNNER = DESKTOP-NSOQH69
PRODUCT_TARGET = d1269334338531228ddfdd9383761cd419e58738
P1_TESTS = 234 / 234 PASS
P1_FAIL = 0
P1_SKIP = 0
BROWSER_RUNTIME = PASS
ARTIFACT = 10936541218
RUNTIME_GATE = CLOSED
```

## Final MR review of UI full-capability reconciliation

Initial UR HEAD:
`5eb8ab1703d2a2feb6dc8f0ab1ad2732702bd205`

Bounded revision HEAD:
`867aa95fed4a937c04e4132b34a5757408e16b70`

Final MR review:
`working/INK_UI_FULL_CAPABILITY_RECONCILIATION_MR_REVIEW_v1.0.md`

Promotion:
- PR `#82`
- merge `f84d60c2b16449fd9957995d8f269cdbbd87b09f`

Result:

```text
FAMILY_PLACEMENT = 64 / 64 PASS
PRODUCT_ATOMICS = 496 / 496 PASS
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5 / 5 PASS
TOTAL_NORMALIZED_ATOMICS = 501 / 501 PASS
P1_A_H_PLACEMENT = PASS
PLANNED_CONTROL_IDS = PUI-001 ... PUI-074 / PASS
OPEN_UI_GAPS = 34
ATOMIC_AUDIT_NEW_GAPS = 0
PRODUCT_SOURCE_MUTATION = 0
UI_IMPLEMENTATION_MUTATION = 0
UI_RECONCILIATION = CLOSED / PROMOTED
```

The reconciliation HOLD is cleared for preparation of a bounded UI implementation Work Order.

DEV product mutation remains prohibited until MR issues that explicit Work Order.

## Next action

MR:
- prepare the bounded UI implementation Work Order from the promoted reconciliation SSOT;
- preserve the 64-family / 501-atomic placement authority and PUI planning identities;
- define implementation sequencing and QA without creating duplicate Core authorities.

UR:
- no further reconciliation revision required unless MR discovers a new planning conflict.

DEV:
- no product/UI implementation until the new Work Order is explicitly authorized.
