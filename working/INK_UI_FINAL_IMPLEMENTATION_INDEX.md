# INK Final UI — Implementation Index

STATUS: `IMPLEMENTATION_PROGRAM_AUTHORIZED / UI-A_ACTIVE / FINAL_RUNTIME_DEFERRED`

DATE: 2026-09-28

CURRENT_CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`

PROMOTED_UI_RECONCILIATION:
- `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
- `working/INK_UI_RECONCILIATION_GAP_REGISTER_v1.0.md`
- `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`
- final MR PASS: `working/INK_UI_FULL_CAPABILITY_RECONCILIATION_MR_REVIEW_v1.0.md`

PHOTOSHOP_POSITION_FORM_AUTHORITIES:
1. `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
2. `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
3. `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
4. `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
5. `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
6. `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`
7. `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md` where not superseded by current capability placement.

MASTER_IMPLEMENTATION_PLAN:
`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

## Work Order sequence

```text
UI-A Photoshop Workstation Shell & Panels
→ MR review
→ UR Photoshop/interaction review
→ promotion

UI-B Full Capability Creative Controls
→ MR review
→ UR workflow/placement review
→ promotion

UI-C Photoshop Fidelity & Final UI Closure
→ MR review
→ UR fidelity review
→ USER visual revision if needed
→ promotion

ONE final exact-SHA integrated Runtime
→ completion checklist
→ MR final Runtime review
```

Workpacks:
- `working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_B_FULL_CAPABILITY_CONTROLS_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`

## Runtime policy

```text
CENTRAL_RUNTIME_AFTER_UI_A = NO
CENTRAL_RUNTIME_AFTER_UI_B = NO
CENTRAL_RUNTIME_DURING_UI_C = NO
CENTRAL_RUNTIME_AFTER_UI_A_B_C_PROMOTED = ONE
```

Each package still requires focused/unit/static QA and may use local browser/manual interaction checks. These do not substitute for the final central exact-SHA Runtime.

## Supersession note

Older pre-P1 UI references remain valid for Photoshop geometry/form but not for capability placement where superseded.

In particular:
- top-level `Filter` is now REQUIRED;
- `Color`, `Channels`, `Adjustments` are normal panels;
- masks/adjustments/filters/effects are no longer Specialist-only;
- P1 A-H placement follows the promoted reconciliation.

## Current readiness

```text
TECHNICAL_BASELINE = CLOSED / RUNTIME_PASS
UI_RECONCILIATION = CLOSED / MR_PASS / PROMOTED
FAMILY_PLACEMENT = 64 / 64
NORMALIZED_ATOMICS = 501 / 501
PUI_PLANNING_IDENTITIES = 74
OPEN_IMPLEMENTATION_GAPS = 34
UI_IMPLEMENTATION_PROGRAM = AUTHORIZED
ACTIVE_WORK_ORDER = INK-UI-A-PHOTOSHOP-SHELL-PANELS-001
UI-B = WAIT
UI-C = WAIT
FINAL_RUNTIME = DEFERRED
```

The old AI Completion Checklist remains a framework only until UI-C refreshes all pre-P1 capability/menu/panel wording. It must not override the promoted reconciliation.


## Added current-program constraints

```text
UI_EXTENSION_BOUNDARY = REQUIRED_IN_UI_B / FINAL_AUDIT_IN_UI_C
FULL_PLUGIN_SDK = P2 / NOT_CURRENT_SCOPE
VISIBLE_LOGO_AUTHORITY = assets/INK_MARK_SOURCE_W-300.jpg
BROWSER_FAVICON_AUTHORITY = assets/favicon.svg
PWA_APP_ICON_WORK = OUT_OF_SCOPE
```

UI-A MR technical review:
`working/INK_UI_A_PHOTOSHOP_SHELL_PANELS_MR_REVIEW_v1.0.md`

Current UI-A state:
`MR_TECHNICAL_PASS / UR_REVIEW_REQUIRED / NOT_PROMOTED`
