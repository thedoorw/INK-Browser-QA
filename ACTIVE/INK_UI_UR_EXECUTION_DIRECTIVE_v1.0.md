# INK UI Photoshop Alignment — UR Execution Directive v1.0

STATUS: `SUPERSEDED_FOR_CURRENT_UI_LANE / USER_DIRECT_UI_MODE`

DATE: 2026-09-28

PROGRAM:
`INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001`

UI OWNER:
`NONE / DELEGATED UI PROGRAM CLOSED`

## 1. User directive

UR owns the remaining Photoshop-aligned UI engineering end to end.

UI-A is already closed and promoted:

```text
UI_A = MR_PASS / UR_PASS / PROMOTED
UI_A_PROMOTION_PR = 83
UI_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868
```

From this point forward, routine UI management does not pass through MR.

## 2. UR mission

UR is responsible for completing the remaining Photoshop-aligned UI program:

```text
UI-B Full Capability Creative Controls
→ UR review / bounded revision as needed
→ UI-B promotion

→ UI-C Photoshop Fidelity & Final UI Closure
→ UR visual / interaction / fidelity review
→ USER visual revision if requested
→ UI-C promotion

→ STOP to MR for one final exact-SHA integrated Runtime
```

The goal is not partial UI progress. The goal is to finish the current Photoshop-aligned UI program to the defined completion gate.

## 3. UR authority

Within the already approved UI program and while work remains UI-only, UR may:

- issue and refine UI-B / UI-C work instructions;
- hand the approved workpack to UI DEV;
- supervise UI DEV on the named branch;
- inspect source/static/local-interaction/visual evidence;
- return bounded revision findings directly to UI DEV;
- repeat DEV → UR review loops as needed;
- approve or hold UI-only work;
- reconcile and promote accepted UI-only changes to current main;
- update UI status/evidence documents;
- proceed from UI-B promotion to UI-C without an MR intermediary.

DEV stops to UR for delegated UI work.

## 4. MR boundary

MR retains Core / technical / cross-lane authority.

UR must STOP → MR only if correct UI completion requires any of the following:

- Core semantic or algorithm change;
- new product capability outside the promoted capability baseline;
- change to Document / History / Revision / Renderer / Geometry / Recipe / CHAT mutation authority;
- second state/mutation authority;
- capability-placement authority change rather than UI realization;
- `FORMAT_VERSION` change;
- P2 capability or full Plugin SDK expansion;
- central Runtime authorization;
- cross-lane architecture change that is not safely UI-bounded.

A routine UI defect, Photoshop mismatch, layout issue, interaction issue, UI wiring issue, or UI-only regression is not an MR handoff condition.

## 5. Current execution sequence

### UI-B

Task:
`INK-UI-B-FULL-CAPABILITY-CONTROLS-001`

Workpack:
`working/INK_UI_B_FULL_CAPABILITY_CONTROLS_DEV_WORKPACK_v1.0.md`

Mandatory branch:
`work/ink-ui-b-full-capability-controls-001`

Current state:
`UR_PASS / PROMOTED / PR_84`

### UI-C

Task:
`INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

Workpack:
`working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

Mandatory branch:
`work/ink-ui-c-photoshop-fidelity-closure-001`

Current state:
`UR_PASS / PROMOTED / PR_86`

## 6. Locked program rules

```text
PACKAGES = 3 LARGE BOUNDED PACKAGES
UI_A = PROMOTED
UI_B = PROMOTED
UI_C = PROMOTED
CENTRAL_RUNTIME_AFTER_UI_B = NO
CENTRAL_RUNTIME_DURING_UI_C = NO
FINAL_CENTRAL_RUNTIME = ONE / AFTER_UI_A_B_C_PROMOTED
NEW_CORE_CAPABILITY = NO
FORMAT_VERSION_CHANGE = NO
P2_IMPLEMENTATION = NO
PHOTOSHOP_REFERENCE_CONTROLS_POSITION_AND_FORM = YES
```

Focused/unit/static QA and local browser/manual interaction evidence remain required inside each package.

## 7. UI authority references

UR must preserve the existing authority precedence:

1. capability authority:
   - `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
   - `working/INK_CAPABILITY_REGISTRY_v0.1.md`
2. promoted UI reconciliation:
   - `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`
   - `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
   - `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
   - `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`
   - `working/INK_UI_RECONCILIATION_GAP_REGISTER_v1.0.md`
3. Photoshop position/form/interaction authority:
   - `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
   - `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
   - `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
   - `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
   - `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
   - `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`
4. program/master workplan:
   - `working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

## 8. Immediate next action

UR:

1. use promoted main `2d14e3a80e16e0a0d41dc453786b34bebe53e866` as the UI-C activation baseline;
2. hand `INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001` to DEV on `work/ink-ui-c-photoshop-fidelity-closure-001`;
3. require Photoshop-reference-driven geometry, fine-detail, interaction and Light-theme closure;
4. review DEV handoff visually and structurally;
5. issue bounded revision directly to DEV as needed;
6. promote UI-C;
7. after UI-C promotion, STOP → MR for one final exact-SHA integrated Runtime.

UI-B is no longer active work.

MR is not a routine intermediary during UI-C.

## 9. Closure checkpoint

```text
UI_A = PROMOTED
UI_B = UR_PASS / PROMOTED / PR_84
UI_C = UR_PASS / PROMOTED / PR_86
UI_C_PROMOTION_MERGE = 77ee44c94a848588aceeb7797fa8aa737c69b248
UR_PROGRAM_ROLE = CLOSED
CENTRAL_RUNTIME = NOT RUN
NEXT_OWNER = MR
NEXT_ACTION = FINAL EXACT-SHA INTEGRATED RUNTIME
```

If MR's final exact-SHA Runtime exposes a bounded UI-only regression, control may return to UR for one corrective review loop. Otherwise the Photoshop-aligned UI program remains closed.


## 9. Delegation closure

The delegated UI program completed successfully.

```text
UI_A = PROMOTED
UI_B = UR_PASS / PROMOTED
UI_C = UR_PASS / PROMOTED
UR_DELEGATED_UI_WORK = CLOSED

FINAL_RUNTIME_RUN = 36445204976
FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
FINAL_RUNTIME = PASS
UI_COMPLETE = YES
```

UR has no active UI work order after this closure.

Any future UI expansion requires a new bounded Work Order and explicit ownership assignment.

## Superseded by USER direct mode

For the current UI reconstruction lane, this directive is superseded by:
`ACTIVE/INK_UI_USER_DIRECT_EXECUTION_DIRECTIVE_v1.0.md`

UR routing resumes only if USER explicitly restores it after USER UI freeze.
