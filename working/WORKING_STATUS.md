# INK Working Status

STATUS: `CURRENT CHECKPOINT`

DATE: 2026-09-27

```text
CURRENT_MAIN = repository current main
CURRENT_PRIMARY_TASK = INK-P1-A-RASTER-SELECTION-FILL-SAMPLING-001
CURRENT_PROGRAM = ALL_P1_BEFORE_RUNTIME_CAPABILITY_COMPLETION
CURRENT_GATE = P1_A_MODULE_READY_AWAIT_PROMOTION

CAPABILITY_BASELINE = ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
EXPLICIT_PARTIAL_BOUNDED_ITEMS = 8

P1_P2_DISPOSITION = RECORDED
P1_A_WORKPACK = working/INK_P1_A_RASTER_SELECTION_FILL_SAMPLING_DEV_WORKPACK_v1.0.md
P1_A_BRANCH = work/ink-p1-a-raster-selection-fill-sampling-001

FIRST_REBASELINE_RUNTIME = PASS
FIRST_REBASELINE_RUNTIME_TARGET = f911f777f770cbe290e290c4b0cbc3692b36641e
FIRST_REBASELINE_RUNTIME_RUN = 36255595714
FIRST_REBASELINE_RUNTIME_ARTIFACT = 10910238715
P0_PROMOTED_SOURCE_EQUIVALENT_TO_RUNTIME = PASS

UI_PROGRAM = PHOTOSHOP_ALIGNED_FINAL_UI_REBUILD
UI_STATUS = HOLD

FORMAT_VERSION = 4
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34
CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_IS_NOT_FULL_PRODUCT_CAPABILITY = TRUE

TECHNICAL_CLOSURE = CLOSED
RUNTIME_STABILITY = CLOSED
CONNECTOR_005 = CLOSED
```

## Current next step

The full capability census is closed and the refreshed capability baseline is published on main.

P1-A has passed MR MODULE_READY review on exact DEV head `21918c7e47ab1f31f70ff77816a6179fda4e2800`.

P1-A MODULE_READY = PASS. Product branch is not yet promoted to current main.

Final UI wiring remains prohibited.

Next: promote/reconcile P1-A onto latest main, then authorize P1-B. P1-B through P1-H each require a separate bounded MR authorization.

## UI release sequence

```text
P1-A MODULE_READY
→ P1-B MODULE_READY
→ P1-C MODULE_READY
→ P1-D MODULE_READY
→ P1-E MODULE_READY
→ P1-F MODULE_READY
→ P1-G MODULE_READY
→ P1-H MODULE_READY
→ P1 INTEGRATION
→ focused/integrated QA
→ ONE exact-SHA Runtime
→ UR capability reconciliation
→ UI_HOLD CLEARED
```

Manual prose does not block this sequence.

Integrated Runtime is intentionally prohibited until all native P1 packages A–H are complete and integrated.

## Historical technical milestone

`ARCHIVE/milestones/2026-09-26-chat-technical-closure/README.md`

## Document lifecycle

`governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`

This file is not an append-only event log. Replace it when the current checkpoint changes.
