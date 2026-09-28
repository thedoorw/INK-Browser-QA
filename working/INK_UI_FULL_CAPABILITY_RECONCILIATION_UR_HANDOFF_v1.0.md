# INK UI Full Capability Reconciliation — UR Handoff v1.0

STATUS: `UR_REVISION_COMPLETE / STOP_FOR_MR_REVIEW`

TASK: `INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

BRANCH: `work/ink-ui-full-capability-reconciliation-001`

DATE: 2026-09-28

OWNER COMPLETING THIS HANDOFF: `UR / UI REVIEW`

NEXT OWNER: `MR / MAIN REVIEW`

## Scope result

Completed the MR-requested bounded revision against:
- full 64-family normalized capability registry;
- explicit 496/496 product atomic disposition;
- explicit 5/5 headless platform-support atomic disposition;
- total normalized atomic disposition = 501/501;
- promoted P1 A-H placement overlay;
- existing 212-button / 29-select static control ledger;
- previous final function-placement map;
- current reconciliation gaps;
- promoted P1 A-H capability scope;
- promoted P1 Integration authority convergence.

No product source or UI implementation was performed.

## Produced documents

1. `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
2. `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md` — NEW bounded-revision evidence
3. `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
4. `working/INK_UI_RECONCILIATION_GAP_REGISTER_v1.0.md`
5. `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`

This handoff is the sixth planning/review document on the UR branch.

## MR bounded-revision closure

The two MR blockers are addressed without changing the accepted architecture.

```text
BLOCKER_A_ATOMIC_DISPOSITION = CLOSED_BY_UR_FOR_REREVIEW
PRODUCT_ATOMICS = 496 / 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5 / 5
TOTAL_NORMALIZED_ATOMICS = 501 / 501

BLOCKER_B_PLANNED_CONTROL_IDENTITY = CLOSED_BY_UR_FOR_REREVIEW
PUI_PLANNING_IDS = PUI-001 ... PUI-074
PLANNED_CONTROL_IDENTITIES = 74
NEW = 14
RELOCATE = 4
EXPAND_FLYOUT = 4
RETIRE_DUPLICATE = 5
CONTEXTUAL_ONLY = 13
PANEL = 13
DIALOG_WORKSPACE = 11
HEADLESS_NO_CONTROL = 10
IMPLEMENTATION_STATUS = PLANNED_ONLY
DOM_ID_PRESCRIPTION = NONE

ATOMIC_AUDIT_NEW_GAPS = 0
OPEN_UI_GAPS = 34
P0_UI_GAPS = 14
P1_UI_GAPS = 15
P2_UI_GAPS = 5
```

Accepted MR architecture decisions were not redesigned.

## Major reconciliation decisions

1. Mask / Adjustment / Filter are real normal creative capabilities; Specialist is no longer their primary UI home.
2. A normal top-level `Filter` menu is now justified by the promoted C25/P1-F capability set.
3. Required new normal right-side surfaces:
   - Color;
   - Channels;
   - Adjustments.
4. Layer Effects use Layers `fx` + one shared dialog/properties surface.
5. Liquify uses a bounded temporary workspace/modal, not a permanent panel.
6. Selection expansion is grouped:
   - Lasso / Polygonal / Magnetic;
   - Quick Selection / Magic Wand / Object Selection.
7. Raster retouch expansion is grouped into compact flyouts, not one permanent slot per algorithm.
8. Raster and vector Gradient share one visible Gradient workflow that dispatches to the correct existing authority by target context.
9. P1-C ruler/guide/snap is mandatory normal workstation UI and must satisfy the twelve previously locked behaviors.
10. P1-G is split intentionally into:
    - Color panel for ordinary creative color;
    - Channels panel for channel structure;
    - Image > Mode / Color Profile for bit-depth/mode/ICC.
11. P1-H stays under File import/export; external formats do not become document authorities or separate format workspaces.
12. C62 asset lifecycle, Runtime infrastructure, renderer/GPU internals and other headless/platform contracts remain out of normal creative UI.

## Gap summary

```text
OPEN_UI_GAPS = 34
P0_UI_GAPS = 14
P1_UI_GAPS = 15
P2_UI_GAPS = 5
HEADLESS_FALSE_GAPS = 0
```

## Hold / authority status

Latest GitHub authority re-read before handoff records:
- P1 A-H = MODULE_READY / MR_PASS / PROMOTED;
- P1 Integration = MR_PASS / PROMOTED;
- P1 Integrated Runtime = MR_PASS / RUNTIME_GATE_CLOSED;
- exact tested product SHA = `d1269334338531228ddfdd9383761cd419e58738`;
- Runtime Run `36330300446`, attempt 2 = SUCCESS;
- P1 A-H + integration = 234/234 PASS, fail 0, skip 0;
- UI status = RECONCILIATION_AUTHORIZED / IMPLEMENTATION_HOLD.

Runtime closure confirms the upstream gate. This planning task still does not clear the UI implementation HOLD; MR must review these UR outputs first.

## Prohibited-scope confirmation

```text
product/source/** mutation = 0
UI implementation = 0
DEV workpack issued = 0
Runtime mutation = 0
Runtime execution = 0
FORMAT_VERSION change = 0
new product capability invented = 0
P2 implementation = 0
```

## MR review request

MR should re-review only the bounded correction points plus regression safety:
- 501/501 explicit atomic disposition and heterogeneous-family splits;
- PUI-001…PUI-074 stable planning identities/counts;
- atomic gap-audit result `ATOMIC_AUDIT_NEW_GAPS = 0` and retained 34-gap totals;
- P1 A-H overlay remains consistent with the already accepted architecture;
- no headless/internal atomic was converted into false creative chrome;
- no product/source/UI implementation/Runtime/FORMAT_VERSION mutation occurred;
- only MR may decide whether the UI implementation HOLD is cleared.

UR does not issue implementation work until MR explicitly clears the UI HOLD and authorizes the next bounded UI work.

```text
UR_BOUNDED_REVISION = COMPLETE
DEV_ACTION = NONE
NEXT_OWNER = MR
STOP = YES
```
