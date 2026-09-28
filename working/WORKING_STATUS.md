# INK Working Status

STATUS: `CURRENT CHECKPOINT`

DATE: 2026-09-28

```text
CURRENT_PROGRAM = INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001
CURRENT_GATE = UI_A_R1_UR_BOUNDED_RECHECK

TECHNICAL_BASELINE = CLOSED / RUNTIME_PASS
UI_RECONCILIATION = MR_PASS / CLOSED / PROMOTED

CAPABILITY_FAMILIES = 64
PRODUCT_ATOMICS = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501
PUI_IDENTITIES = 74
UI_GAPS = 34

UI_A = R1_DEV_COMPLETE / MR_TECHNICAL_PASS / UR_RECHECK_REQUIRED
UI_A_BRANCH = work/ink-ui-a-photoshop-shell-panels-001
UI_B = HOLD_FOR_UI_A_R1_UR_PASS
UI_C = WAIT_FOR_UI_B_PROMOTION

CENTRAL_RUNTIME_BETWEEN_PACKAGES = NO
FINAL_RUNTIME = AFTER_UI_A_B_C_PROMOTED / ONE_EXACT_SHA_GATE

FORMAT_VERSION = 4
```

## Execution authority

Master plan:
`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

Active Work Order:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`

Future Work Orders:
- `working/INK_UI_B_FULL_CAPABILITY_CONTROLS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

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

After UI-A, UI-B and UI-C are all MR_PASS / UR_PASS / promoted, MR authorizes one exact-SHA final integrated Runtime.

## Next owner

`DEV — UI-A`

DEV must STOP after UI-A handoff. No automatic start of UI-B.


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
