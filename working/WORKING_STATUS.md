# INK Working Status

STATUS: `CURRENT CHECKPOINT`

DATE: 2026-09-28

```text
CURRENT_PROGRAM = INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001
CURRENT_GATE = UI_A_DEV

TECHNICAL_BASELINE = CLOSED / RUNTIME_PASS
UI_RECONCILIATION = MR_PASS / CLOSED / PROMOTED

CAPABILITY_FAMILIES = 64
PRODUCT_ATOMICS = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501
PUI_IDENTITIES = 74
UI_GAPS = 34

UI_A = AUTHORIZED / DEV_NOT_STARTED
UI_A_BRANCH = work/ink-ui-a-photoshop-shell-panels-001
UI_B = WAIT_FOR_UI_A_PROMOTION
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
