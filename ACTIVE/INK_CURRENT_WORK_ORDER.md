# INK Current Work Order

STATUS: `CURRENT / UI_A_PROMOTED / UI_B_NOT_STARTED`

DATE: 2026-09-28

## Current program

```text
PROGRAM = INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001
OWNER = MR / MAIN REVIEW

TECHNICAL_BASELINE = CLOSED / P1_RUNTIME_PASS
UI_FULL_CAPABILITY_RECONCILIATION = MR_PASS / CLOSED / PROMOTED

CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501
PUI_PLANNING_IDENTITIES = 74
OPEN_UI_GAPS = 34

LAST_COMPLETED_TASK = INK-UI-A-PHOTOSHOP-SHELL-PANELS-001
UI_A_PROMOTION_PR = 83
UI_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868

UI_B = ELIGIBLE_AFTER_UI_A_PROMOTION / NOT_STARTED
UI_C = WAIT_FOR_UI_B_PROMOTION
FINAL_UI_RUNTIME = DEFERRED_UNTIL_UI_A_B_C_PROMOTED

FORMAT_VERSION = 4
```

## Master plan

`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

Package workpacks:
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_B_FULL_CAPABILITY_CONTROLS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

Implementation index:
`working/INK_UI_FINAL_IMPLEMENTATION_INDEX.md`

## USER-locked implementation policy

```text
PACKAGES = 3 LARGE BOUNDED PACKAGES
DO_NOT_SPLIT_INTO_FINE MICRO-WORK_ORDERS
NO_CENTRAL_RUNTIME_AFTER_UI_A
NO_CENTRAL_RUNTIME_AFTER_UI_B
NO_CENTRAL_RUNTIME_DURING_UI_C
ONE_FINAL_EXACT_SHA_RUNTIME_AFTER_ALL_UI_PROMOTION
PHOTOSHOP_REFERENCE_CONTROLS_POSITION_AND_FORM
```

Focused/unit/static QA remains mandatory per package.

## Photoshop position/form authority

Use current promoted capability placement for WHAT exists and Photoshop evidence for WHERE/HOW it appears.

Primary UI evidence:
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
- `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
- `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
- `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
- `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`

Promoted placement:
- `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
- `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`
- `working/INK_UI_RECONCILIATION_GAP_REGISTER_v1.0.md`

Supersession:
- current P1 placement overrides stale pre-P1 placement statements;
- top-level Filter is required;
- Color / Channels / Adjustments are normal panels;
- masks/adjustments/filters/effects are not Specialist-only.

## Package A current scope

Package A builds the workstation foundation:
- 24 + 1 + 35 + 1 = 61 px top shell;
- active-document tab/ruler/status geometry;
- Photoshop Light semantic chrome;
- single/double Tools host;
- collapsed/expanded right Dock;
- one panel state authority;
- panel tabs/options/stacking/resize;
- Properties/Layers/History/Navigator/Pages normalization;
- Color/Channels/Adjustments panel homes;
- Window/Help convergence;
- duplicate desktop File/Undo/Redo retirement.

No central Runtime.

## Completed prerequisite gates

```text
P1_A_H = MR_PASS / PROMOTED
P1_INTEGRATION = MR_PASS / PROMOTED
P1_INTEGRATED_RUNTIME = PASS
P1_RUNTIME_RUN = 36330300446
P1_RUNTIME_ARTIFACT = 10936541218

UI_RECONCILIATION_PROMOTION_PR = 82
UI_RECONCILIATION_PROMOTION_MERGE = f84d60c2b16449fd9957995d8f269cdbbd87b09f
UI_RECONCILIATION_FINAL_MR_REVIEW = working/INK_UI_FULL_CAPABILITY_RECONCILIATION_MR_REVIEW_v1.0.md
```

## Current gate

```text
CURRENT_GATE = POST_UI_A_PROMOTION / UI_B_NOT_STARTED
UI_A = MR_PASS / UR_PASS / PROMOTED
UI_B = ELIGIBLE / NOT_STARTED
UI_C = WAIT_FOR_UI_B_PROMOTION
FINAL_RUNTIME = HOLD_UNTIL_A_B_C_COMPLETE
DEV_MAY_MODIFY_UI = NO / NO_UI_B_HANDOFF_YET
NEW_CORE_CAPABILITY = NO
CORE_AUTHORITY_CHANGE = NO
FORMAT_VERSION_CHANGE = NO
```

## Next action

```text
UI_A = CLOSED / PROMOTED
UI_B = NOT_STARTED
DEV = STOP
UR = STOP
CENTRAL_RUNTIME = NOT_RUN
NEXT_OWNER = MR / USER — confirm UI-B role and handoff structure before execution
```

Do not start UI-B until the next ownership/workflow decision is recorded. No central Runtime is authorized between packages.

## UI-A MR technical review checkpoint

DEV handoff HEAD:
`9c1d1ef4c020603296154000cccaea5c9c111dc6`

MR review:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

Result:
```text
UI_A_MR_TECHNICAL = PASS
UI_A_UR_REVIEW = REQUIRED
UI_A_PROMOTION = HOLD
UI_B = HOLD
CENTRAL_RUNTIME = DEFERRED
```

Added next-package requirements:
- bounded UI contribution/extension boundary in UI-B;
- final extensibility audit in UI-C;
- preserve approved visible INK logo + browser favicon;
- PWA/App Icon work is out of current scope.


## UI-A UR review disposition

UR review:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_UR_REVIEW_v1.0.md`

Result:
`UR_BOUNDED_REVISION_REQUIRED`

MR independently confirmed all three findings:

```text
UR-A-01 = expanded stacked-panel / splitter framework missing
UR-A-02 = Light theme incomplete in core panel interiors
UR-A-03 = Creative panels lack shared direct resize surface
```

Bounded revision workpack:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_BOUNDED_REVISION_WORKPACK_v1.0.md`

Revision branch:
`work/ink-ui-a-photoshop-shell-panels-001`

Rules:
- same branch only;
- UI-A R1 only;
- no UI-B;
- no Core semantic change;
- no FORMAT_VERSION change;
- no P2;
- no central Runtime;
- STOP to MR after revision.


## UI-A-R1 MR technical re-review

```text
R1_DEV_HANDOFF_HEAD = 74542bcff80017da04aca5a412f610f4810024f0
R1_EXACT_IMPLEMENTATION_QA_HEAD = 1b3df1f61f52fd373f082b6780118440b099e5a7
R1_MR_TECHNICAL = PASS
UR_A_01 = TECHNICALLY_CLOSED
UR_A_02 = TECHNICALLY_CLOSED / VISUAL_RECHECK_REQUIRED
UR_A_03 = TECHNICALLY_CLOSED
UI_A_PROMOTION = HOLD
UI_B = HOLD
CENTRAL_RUNTIME = DEFERRED
NEXT_OWNER = UR
```

UR bounded recheck scope:
1. expanded stacked panel-group / splitter framework;
2. Light theme panel interiors;
3. Creative panels shared resize surface.

No full UI-A re-review is required unless UR finds regression outside those three items.


## UI-A promotion checkpoint

```text
UI_A_R1_DEV_HEAD = 74542bcff80017da04aca5a412f610f4810024f0
UI_A_R1_IMPLEMENTATION_QA_HEAD = 1b3df1f61f52fd373f082b6780118440b099e5a7
UI_A_R1_MR = PASS
UI_A_R1_UR = PASS
UI_A_PROMOTION_PR = 83
UI_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868
UI_A = PROMOTED
UI_B = NOT_STARTED
CENTRAL_RUNTIME = NOT_RUN
```
