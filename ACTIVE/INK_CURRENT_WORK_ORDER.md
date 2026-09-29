# INK Current Work Order

STATUS: `CURRENT / FINAL_CHECKLIST_CLOSURE_ACTIVE / PR93_PROMOTED / RUNTIME_DEBT_DEFERRED`

DATE: 2026-09-28

## Current program

```text
PROGRAM = INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001
UI_OWNER = UR / FINAL_CHECKLIST_CLOSURE
MR_OWNER = CORE / TECHNICAL / FUTURE_WORK

TECHNICAL_BASELINE = CLOSED / P1_RUNTIME_PASS
UI_FULL_CAPABILITY_RECONCILIATION = MR_PASS / CLOSED / PROMOTED

CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501
PUI_PLANNING_IDENTITIES = 74
UI_GAP_REGISTER_ROWS = 34 / FINAL_DISPOSITION_COMPLETE

LAST_COMPLETED_TASK = INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001
UI_A_PROMOTION_PR = 83
UI_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868

ACTIVE_TASK = INK-UI-FINAL-CHECKLIST-CLOSURE-001
ACTIVE_UI_DIRECTIVE = ACTIVE/INK_UI_FINAL_CHECKLIST_AUDIT_DIRECTIVE_v1.0.md
ACTIVE_UI_BRANCH = work/ink-ui-final-checklist-css-001 + evidence-only closure branch

UI_B = UR_PASS / PROMOTED
UI_B_PROMOTION_PR = 84
UI_B_PROMOTION_MERGE = 2d14e3a80e16e0a0d41dc453786b34bebe53e866
UI_C = UR_PASS / PROMOTED
FINAL_UI_RUNTIME = PASS / RUN_36445204976 / TESTED_SHA_24d3b3f607a17b3cb9331ec3635b34d804ee445b

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
CURRENT_GATE = REMAINING_171_FINDINGS_CLOSURE
UI_A = MR_PASS / UR_PASS / PROMOTED
UI_B = UR_PASS / PROMOTED
UI_C = UR_PASS / PROMOTED
FINAL_RUNTIME = PASS / RUN_36445204976
FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
UI_C_PRODUCT_SHA = 77ee44c94a848588aceeb7797fa8aa737c69b248
PRODUCT_SOURCE_EQUIVALENCE_TO_LAST_FINAL_RUNTIME = NO / PR93_CHANGED_PRODUCT_BYTES
DEV_MAY_MODIFY_UI = BOUNDED_CSS_FINDINGS_ONLY / WORKPACK_IN_WORKING
OPEN_FINAL_RUNTIME_BLOCKERS = 0
RUNTIME_DEBT = OPEN / DEFERRED_TO_FINAL_CHECKLIST_BATCH
CURRENT_PRODUCT_PROMOTION = PR93 / c66b1eba2376f01cfba14f71b6f29d7e2fa022e4
CURRENT_PRODUCT_CENTRAL_RUNTIME = NOT_RUN / DEFERRED
LAST_FINAL_RUNTIME_COVERS_CURRENT_PRODUCT = NO
UR_FULL_CHECKLIST_AUDIT = MR_PASS_AS_AUDIT_RECORD
CHECKLIST_TOTAL = 592
CHECKLIST_PASS = 434
CHECKLIST_FAIL = 157
CHECKLIST_N_A = 1
UNREVIEWED_CHECKLIST_ITEMS = 0
OPEN_CHECKLIST_ITEMS = 157
USER_ACCEPTANCE_PENDING = 10
UI_COMPLETE = HOLD
FORMAT_VERSION = 4
```

## PR #93 closure checkpoint

```text
PR93_CORRECTED_CANDIDATE = b7dc5971768893c2d690eed22bf2801fc0aec4ae
PR93_TARGETED_BROWSER = PASS / RUN_36511504388
PR93_PROMOTION = c66b1eba2376f01cfba14f71b6f29d7e2fa022e4
CHECKLIST_CLOSED_THIS_BATCH = AB02 AO03 AH02 AH12 AM08 AN09 AN10 AO05 AO06 F21 AC08 AH06 AH16 AH18
RUNTIME_DEBT = DEFERRED_TO_FINAL_CHECKLIST_BATCH
CENTRAL_RUNTIME_THIS_BATCH = NOT_RUN
```

PR93_UR_BROWSER_RECHECK = working/INK_UI_FINAL_CHECKLIST_CSS_UR_BROWSER_RECHECK_v1.0.md
ISSUE92_R3_SOURCE_CLOSURE = working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R3_SOURCE_CLOSURE_v1.0.md
ISSUE92_R4_REFERENCE_ENV_CLOSURE = working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R4_REFERENCE_ENV_CLOSURE_v1.0.md
ISSUE92_R5_SOURCE_REFERENCE_CLOSURE = working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R5_SOURCE_REFERENCE_CLOSURE_v1.0.md
ISSUE92_R6_UI_SUITE_CLOSURE = working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_UR_R6_UI_SUITE_CLOSURE_v1.0.md
UR_BATCH_REPORT = working/INK_UI_FINAL_CHECKLIST_CLOSURE_UR_BATCH_REPORT_v1.0.md
MR_BATCH_REVIEW = working/INK_UI_FINAL_CHECKLIST_CLOSURE_MR_BATCH_REVIEW_v1.0.md

## Next action

MR CSS review:
`working/INK_UI_FINAL_CHECKLIST_CSS_MR_REVIEW_v1.0.md`

Current:
```text
TOTAL = 592
PASS = 434
FAIL = 157
N_A = 1
UNREVIEWED = 0
OPEN = 157
USER_ACCEPTANCE = 10 / PENDING

PR_93 = MERGED / c66b1eba2376f01cfba14f71b6f29d7e2fa022e4 / EXACT_CANDIDATE_BROWSER_PASS
PR_94 = MERGED / a0cb94de9fe56b23f56faa852bbd2f0e183700f8
ISSUE_92 = ACTIVE / EVIDENCE_ONLY_QA / R6_UI_SUITE_CLOSED_D09_AD04_AM02
UI_COMPLETE = HOLD
```

UR batch result:
- exact corrected candidate `b7dc5971768893c2d690eed22bf2801fc0aec4ae`: source QA 26/26 PASS and required 1280×1024 / 960×800 browser evidence PASS;
- reproduced first-paint orphan-control defect corrected by bounded CSS-only DEV revision and rechecked PASS;
- PR #93 promoted as `c66b1eba2376f01cfba14f71b6f29d7e2fa022e4`;
- checklist batch closed 14 IDs total, including Issue #92 source-only AH06/AH16/AH18;
- USER acceptance remains 10 / PENDING;
- central Runtime not run; debt deferred to final checklist batch.

NEXT_OWNER = UR
NEXT_ACTION = CONTINUE ISSUE_92 / REMAINING_171_FINDINGS_CLOSURE
STOP_TO_MR = CORE_GLOBAL_ESCALATION / NEXT_PRODUCT_MUTATION_BATCH / TERMINAL_RUNTIME

MR Runtime decision:
- no central Runtime now;
- PR #93 passed targeted browser QA and is promoted; Runtime debt is deferred;
- after ALL checklist-driven product mutations finish, run ONE new final exact-SHA integrated Runtime on final product bytes before `UI_COMPLETE`;
- previous final Runtime remains valid only while product bytes remain unchanged.

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


## Current UI delegation

Authority:
`ACTIVE/INK_UI_UR_EXECUTION_DIRECTIVE_v1.0.md`

```text
UI_OWNER = UR
UI_B = UR_AUTHORIZED
UI_C = UR_OWNED_AFTER_UI_B_PROMOTION
ROUTINE_UI_REVIEW = UR
ROUTINE_UI_BOUNDED_REVISION = UR → DEV → UR
UI_ONLY_PROMOTION = UR
MR_INTERMEDIARY = NO
STOP_TO_MR = CORE / FORMAT_VERSION / P2 / CROSS-LANE / CENTRAL_RUNTIME ONLY
FINAL_RUNTIME_OWNER = MR
```


## UI-B promotion checkpoint

```text
UI_B_REVIEW = working/INK_UI_B_FULL_CAPABILITY_CONTROLS_UR_REVIEW_v1.0.md
UI_B_PUI = 74 / 74
UI_B_GAPS = 34 / 34
UI_B_UR = PASS
UI_B_PROMOTION_PR = 84
UI_B_PROMOTION_MERGE = 2d14e3a80e16e0a0d41dc453786b34bebe53e866
INTEGRATED_MAIN_HEALTH_RECHECK = PASS
CENTRAL_RUNTIME = NOT RUN
NEXT = UI_C
```


## UI-C promotion checkpoint

```text
UI_C_UR = PASS
UI_C_R1_DYNAMIC_RULERS = PASS
UI_C_R1_NAVIGATOR_SYNC = PASS
UI_C_R1_TOOL_ACTIVE_FILL = PASS
UI_C_R1_POPUP_SEPARATOR = PASS
UI_C_PROMOTION_PR = 86
UI_C_PROMOTION_MERGE = 77ee44c94a848588aceeb7797fa8aa737c69b248
CENTRAL_RUNTIME = NOT RUN
NEXT_OWNER = MR
NEXT_GATE = ONE FINAL EXACT-SHA INTEGRATED RUNTIME
```

UR work on UI-A/B/C is closed unless MR returns a UI-only regression from the final exact-SHA Runtime.


## Final Runtime closure checkpoint

```text
FIRST_FINAL_RUNTIME_RUN = 36443008810 / FAIL
FIRST_RUNTIME_CLASSIFICATION = STALE_UI_RUNTIME_HARNESS / PRODUCT_REGRESSION_0
RUNTIME_HARNESS_RECONCILE_PR = 88
RUNTIME_HARNESS_RECONCILE_MERGE = 24d3b3f607a17b3cb9331ec3635b34d804ee445b

FINAL_RUNTIME_RUN = 36445204976
FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
FINAL_RUNTIME_ARTIFACT = 10979718534
FINAL_RUNTIME_ARTIFACT_SHA256 = e4d822f19aea910db3a19a583d95843c57b012bb8062a47ba20609dfa4d91aad

UI_BROWSER = 110 / 110 PASS
CLOSURE_BROWSER = PASS
GEOMETRY_BROWSER = PASS
CREATIVE_BROWSER = PASS
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED = PASS
OPEN_FINAL_RUNTIME_BLOCKERS = 0
UI_COMPLETE = VERIFIED
```

MR final review:
`working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md`


## Completion-gate correction — 2026-09-28

The earlier `UI_COMPLETE` declaration was premature.

Reason:
- final integrated Runtime passed;
- however `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md` still contained undispositioned `[ ]` items;
- UR had not performed the required full-item final audit.

Corrected rule:

```text
FINAL_RUNTIME_PASS = runtime subgate only
FULL_CHECKLIST_AUDIT = independent mandatory subgate
USER_VISUAL_ACCEPTANCE = mandatory where checklist requires USER evidence
UI_COMPLETE = all mandatory subgates closed
```

This correction is durable governance and must be automatically enforced in future programs.


## Final checklist closure R1 — 2026-09-29

```text
PR = 90 / MERGED / 2f3b3ff542389b2f66637e38520ecf98adb05822
EVIDENCE = working/INK_UI_FINAL_CHECKLIST_CLOSURE_UR_EVIDENCE_R1_v1.0.md
TOTAL = 592
PASS = 399
FAIL = 192
N_A = 1
UNREVIEWED = 0
OPEN = 192
USER_ACCEPTANCE_PENDING = 10
AF08_STALE_QA = RECONCILED / FOCUSED_QA_25_OF_25_PASS
AB02 = PRESENTATION_IMPORTANT_REPRODUCED / DEV_BOUNDED_CORRECTION
AO03 = LOCAL_GRAY_TOKEN_BYPASS_REPRODUCED / DEV_BOUNDED_CORRECTION
DEV_WORKPACK = working/INK_UI_FINAL_CHECKLIST_CSS_BOUNDED_DEV_WORKPACK_v1.0.md
NEXT_OWNER = UR / EVIDENCE_CLOSURE_AND_DEV_RECHECK
UI_COMPLETE = HOLD
```

No product source changed in R1. Final integrated Runtime remains valid for unchanged product bytes. Additional evidence and actual reproduced UI defects are reconciled before any further product edits.


## Bounded closure handoffs — 2026-09-29

- UI-only reproduced CSS findings `AB02 / AO03`: [issue #91](https://github.com/thedoorw/INK-Browser-QA/issues/91), branch `work/ink-ui-final-checklist-css-001`, workpack `working/INK_UI_FINAL_CHECKLIST_CSS_BOUNDED_DEV_WORKPACK_v1.0.md`.
- Evidence-only QA backlog: [issue #92](https://github.com/thedoorw/INK-Browser-QA/issues/92), branch `work/ink-ui-final-checklist-evidence-002`, workpack `working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_QA_WORKPACK_v1.0.md`.

UR owns both rechecks. Neither issue authorizes Core/global mutation or automatic central Runtime. `UI_COMPLETE = HOLD`.


## Final checklist closure R2 — 2026-09-29

`working/INK_UI_FINAL_CHECKLIST_CLOSURE_UR_EVIDENCE_R2_v1.0.md` closes `D02 D05 F12 F13 F16 F17 F18` from exact Runtime/source evidence. Current: `592 / 406 PASS / 185 FAIL / 1 N_A / 0 UNREVIEWED / 185 OPEN`. USER acceptance 10 pending; `UI_COMPLETE = HOLD`. No product source change or central Runtime rerun.
