# INK Working Status

STATUS: `CURRENT CHECKPOINT`

DATE: 2026-09-28

```text
CURRENT_PROGRAM = INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001
CURRENT_GATE = UI_C_DEV_HANDOFF_READY

TECHNICAL_BASELINE = CLOSED / RUNTIME_PASS
UI_RECONCILIATION = MR_PASS / CLOSED / PROMOTED

CAPABILITY_FAMILIES = 64
PRODUCT_ATOMICS = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501
PUI_IDENTITIES = 74
UI_GAPS = 34

UI_A = MR_PASS / UR_PASS / PROMOTED
UI_A_BRANCH = work/ink-ui-a-photoshop-shell-panels-001
UI_B = UR_PASS / PROMOTED
UI_C = UR_AUTHORIZED / READY_FOR_DEV_HANDOFF

CENTRAL_RUNTIME_BETWEEN_PACKAGES = NO
FINAL_RUNTIME = AFTER_UI_A_B_C_PROMOTED / ONE_EXACT_SHA_GATE

FORMAT_VERSION = 4
```

## Execution authority

Master plan:
`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

Last completed Work Order:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`

Last completed Work Order:
`working/INK_UI_B_FULL_CAPABILITY_CONTROLS_DEV_WORKPACK_v1.0.md`

Active Work Order:
`working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

## Photoshop alignment rule

Current promoted capability reconciliation determines capability placement semantics.

Photoshop reference package determines position, geometry, grouping, density and interaction form.

Important fixed/reference items include:
- 61 px base top chrome;
- 28 px active-document tab band;
- 17 px rulers;
- 39/72 px single/double Tools reference states;
- 39 px collapsed right Dock reference;
- 252 px expanded panel reference state, elastic;
- 28 px panel header/tab;
- Photoshop-like flyout/menu/tooltip/panel-resize/drag grammar;
- Adobe Light semantic visual hierarchy.

## Runtime rule

No formal central Runtime occurs after UI-A or UI-B.

UI-C also does not trigger the central Runtime during implementation.

After UI-A, UI-B and UI-C are all promoted under their applicable review authority, MR authorizes one exact-SHA final integrated Runtime.

## Next owner

`UR → UI-C DEV → UR review`

Current execution state:
- UI-A is promoted.
- UI-B is UR PASS and promoted by PR #84.
- UI-C is authorized and ready for DEV handoff.
- routine UI-C review/revision/promotion does not pass through MR.
- MR re-enters only for Core/cross-lane escalation and the final exact-SHA Runtime.
- central Runtime remains deferred.

## UI-A MR checkpoint

```text
DEV_HEAD = 9c1d1ef4c020603296154000cccaea5c9c111dc6
MR_TECHNICAL = PASS
UR_VISUAL_INTERACTION_REVIEW = REQUIRED
PROMOTION = HOLD
UI_B = HOLD
FINAL_RUNTIME = DEFERRED
```

MR review:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

Additional future requirements recorded:
- UI contribution/extension boundary in UI-B, without claiming a full Plugin SDK;
- Logo/Favicon preservation and focused QA;
- PWA installed-app icon redesign = out of scope.


## UI-A UR bounded revision checkpoint

UR review:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_UR_REVIEW_v1.0.md`

Bounded revision:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_BOUNDED_REVISION_WORKPACK_v1.0.md`

```text
UR_A_01_STACKED_PANEL_SPLITTER = CONFIRMED
UR_A_02_LIGHT_PANEL_INTERIORS = CONFIRMED
UR_A_03_CREATIVE_PANEL_RESIZER = CONFIRMED

UI_A_PROMOTION = HOLD
UI_A_R1 = AUTHORIZED
UI_B = HOLD
UI_C = HOLD
CENTRAL_RUNTIME = DEFERRED
NEXT_OWNER = DEV
```


## UI-A-R1 MR re-review checkpoint

```text
R1_DEV_HEAD = 74542bcff80017da04aca5a412f610f4810024f0
R1_IMPLEMENTATION_HEAD = 1b3df1f61f52fd373f082b6780118440b099e5a7

UR_A_01 = MR_PASS_STATIC
UR_A_02 = MR_PASS_STATIC / UR_VISUAL_RECHECK
UR_A_03 = MR_PASS_STATIC

CORE_MUTATION = 0
SECOND_AUTHORITY = 0
FORMAT_VERSION = 4 / UNCHANGED
CENTRAL_RUNTIME = NOT_RUN

UI_A_R1_MR = PASS
UI_A_PROMOTION = HOLD
UI_B = HOLD
NEXT_OWNER = UR
```


## UI-A promotion checkpoint

```text
UI_A_R1_UR = PASS
UR_A_01 = CLOSED
UR_A_02 = CLOSED
UR_A_03 = CLOSED
NEW_UI_A_BLOCKER = 0

UI_A_PROMOTION_PR = 83
UI_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868
UI_A = PROMOTED

UI_B = UR_AUTHORIZED / READY_FOR_DEV_HANDOFF
DEV = STOP_UNTIL_UR_HANDOFF
UR = ACTIVE_UI_OWNER
CENTRAL_RUNTIME = NOT_RUN
```


## UR UI completion authority

`ACTIVE/INK_UI_UR_EXECUTION_DIRECTIVE_v1.0.md`

```text
UI_OWNER = UR
UI_B_DEV_HANDOFF = UR
UI_B_REVIEW = UR
UI_B_PROMOTION = UR
UI_C_DEV_HANDOFF = UR
UI_C_REVIEW = UR
UI_C_PROMOTION = UR
ROUTINE_MR_UI_REVIEW = NO
STOP_TO_MR = INTEGRATION_REQUIRED ONLY
FINAL_CENTRAL_RUNTIME = MR AFTER UI_C_PROMOTION
```


## UI-B promotion checkpoint

```text
UI_B_UR_REVIEW = PASS
UI_B_PROMOTION_PR = 84
UI_B_PROMOTION_MERGE = 2d14e3a80e16e0a0d41dc453786b34bebe53e866
PUI = 74 / 74 DISPOSED
GAPS = 34 / 34 DISPOSED
EXACT_MAIN_HEALTH_RECHECK = PASS
CENTRAL_RUNTIME = NOT RUN
UI_C = READY_FOR_DEV_HANDOFF
```
