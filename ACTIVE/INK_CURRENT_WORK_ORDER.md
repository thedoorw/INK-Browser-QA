# INK Current Work Order

STATUS: `CURRENT / UI_HOLD / CAPABILITY_BASELINE_REOPEN_REQUIRED`

DATE: 2026-09-26

## Current program

```text
PRIMARY_TASK = INK-FULL-CAPABILITY-REBASELINE-001
PROGRAM = FULL_PRODUCT_CAPABILITY_REBASELINE / PRESERVATION_RECOVERY
OWNER = MR / MAIN REVIEW
DEVELOPMENT_BASIS = ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md
FIRST_PRIORITY = RESTORE_ALL_EXISTING_INK_CAPABILITIES
FIRST_REBASELINE_RUNTIME = AUTHORIZED AFTER MR REVIEW
FIRST_REBASELINE_RUNTIME_TARGET = f911f777f770cbe290e290c4b0cbc3692b36641e
MR_PRE_RUNTIME_REVIEW = working/INK_P0_EXISTING_CAPABILITY_RESTORE_MR_REVIEW_v1.0.md

SECONDARY_UI_PROGRAM = PHOTOSHOP_ALIGNED_FINAL_UI_REBUILD
UI_OWNER = UR / UI REVIEW
TECHNICAL_BASELINE = REOPEN_REQUIRED
UI_IMPLEMENTATION = HOLD
UI_WORK_ORDER = PROHIBITED UNTIL REBASELINE
```

## Technical gate entering UI

```text
INK-RUNTIME-HARNESS-STABILITY-001 = CLOSED
INK-TECH-CLOSURE-001 = CLOSED / PROMOTED
INK-CONNECTOR-005 = CLOSED / PROMOTED

PREVIOUS_CAPABILITY_BASELINE =
  ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
  REOPENED / SNAPSHOT ONLY / NOT FINAL UI AUTHORITY

CURRENT_DEVELOPMENT_AUTHORITY =
  ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md

FORMAT_VERSION = 4
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34
CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_IS_NOT_FULL_PRODUCT_CAPABILITY = TRUE
```

Accepted integrated Runtime:

```text
TESTED_EXACT_SHA = 5d6e6bd81f1bcc65ed9d52cc0249f29f199ffa8f
RUN = 36240038654
FOCUSED_NODE = 32 / 32 PASS
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS
ARTIFACT_ID = 10905628104
ARTIFACT_DIGEST = sha256:beb8790c0c31583cde36eb7c59cf0dbcedbd55b2676f2c5c9b19beccab9fa858
```

## UI authority

Before a final Photoshop-aligned UI Work Order is issued, use:

- `ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md` — current MR remediation authority;
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md` — previous CHAT-surface snapshot for diff only;
- `governance/INK_PRODUCT_UX_PRINCIPLES_v1.0.md`
- `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`
- `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
- `research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`
- Photoshop reference screenshots / measurement baseline accepted by UR

UI may change placement, grouping, density, panel behavior, typography, icons and interaction presentation.

UI must not change Core/Document/History/Revision/Geometry/CHAT semantics merely to fit the interface.

## Current MR development authority

`ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md`

This plan contains:
- the recovered full-product preservation inventory;
- the Photoshop capability comparison / maturity gap register;
- development priority and disposition rules;
- the mandatory completion self-check checklist.

The previous 22-tool / 34-operation baseline is a CHAT public/control surface subset only.

## Next action

```text
MR
→ execute INK-FULL-CAPABILITY-REBASELINE-001 from the new development basis
→ complete full product inventory lock
→ restore/reconcile EVERY existing Section 4 P0 capability to its accepted historical/current scope
→ run focused non-integrated QA, History safety and save/load checks
→ require UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0
→ MR pre-Runtime review PASS recorded
→ FIRST_REBASELINE_RUNTIME_AUTHORIZED = YES
→ run the first integrated Runtime on exact SHA f911f777f770cbe290e290c4b0cbc3692b36641e
→ only after that Runtime, disposition/implement Photoshop and mature-platform P1/P2 gaps
→ republish ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md as full-product truth
→ provide final exact promoted/runtime-verified authority

UR
→ remain on HOLD
→ after MR closure, diff refreshed full-product baseline against current Function Placement Map
→ restore/place all accepted capabilities
→ refresh AI Completion Checklist against full product inventory
→ explicitly clear UI_HOLD
→ only then issue bounded UI implementation Work Order(s)
```

Existing-capability restoration gate has passed MR pre-Runtime review.

Current gate:

```text
FIRST REBASELINE INTEGRATED RUNTIME = AUTHORIZED
TARGET = f911f777f770cbe290e290c4b0cbc3692b36641e
NO P1/P2 NEW CAPABILITY IMPLEMENTATION UNTIL RUNTIME PASS
NO UI DEV
NO UI IMPLEMENTATION WORK ORDER
NO FINAL FUNCTION LOCK
```

Static inspection and focused/unit non-integrated QA required to restore existing P0 capabilities remain allowed.

No technical Closure or Connector task is currently open.

Historical Closure/Connector execution details:
`ARCHIVE/milestones/2026-09-26-chat-technical-closure/`


## UR final UI specification lock — 2026-09-26

The frozen capability baseline has now been fully reconciled into the final Photoshop-aligned UI specification.

Authoritative UI implementation package:

- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`
- `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`
- `working/INK_UI_FINAL_STATIC_CONTROL_LEDGER_v1.0.md`
- `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`
- `working/INK_UI_FINAL_IMPLEMENTATION_INDEX.md`

Reconciliation result:

```text
C3_PENDING = 0
NAMED_TOOLS_PLACED = 22 / 22
BOUNDED_EDIT_OPERATIONS_PLACED = 34 / 34
PERSISTENT_TOOL_MODES_PLACED = 12 / 12
SELECT_CONTROLS_PLACED = 29 / 29
STATIC_BUTTONS_ENUMERATED = 212 / 212
UNCLASSIFIED_FUNCTIONS = 0
PRODUCT_UI_MUTATION = 0
```

Final UI closure must use the AI Completion Checklist and may not declare `UI_COMPLETE` until every required item passes on integrated current main.

Next:

`UR → issue bounded UI implementation Work Order(s)`


## UI HOLD — capability baseline completeness reopened

USER has identified that the current frozen capability baseline may have omitted:
- capabilities INK already had;
- capabilities required for a mature image/drawing workstation.

Therefore the previous final placement reconciliation is preserved as a **reference snapshot**, not an implementation authorization.

The Photoshop visual/interaction reference remains valid where independent of capability inventory.

The following documents must not be treated as final capability-facing authority until MR republishes the capability baseline and UR reconciles it:

- `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`
- `working/INK_UI_FINAL_STATIC_CONTROL_LEDGER_v1.0.md`
- capability/count sections of `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`

The following remain valid reference authorities during HOLD:
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- Photoshop geometry/behavior requirements in `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`

Release condition:

```text
MR_REFRESHED_CAPABILITY_BASELINE = PUBLISHED
UR_CAPABILITY_DIFF = COMPLETE
FUNCTION_PLACEMENT_RECONCILED = PASS
AI_CHECKLIST_RECONCILED = PASS
UNCLASSIFIED_FUNCTIONS = 0
USER/MR CAPABILITY_REOPEN = CLOSED
→ UI_HOLD may be cleared
```
