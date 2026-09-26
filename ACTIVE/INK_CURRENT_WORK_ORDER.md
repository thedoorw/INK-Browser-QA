# INK Current Work Order

STATUS: `CURRENT / UI_HOLD / CAPABILITY_BASELINE_REOPEN_REQUIRED`

DATE: 2026-09-26

## Current program

```text
PROGRAM = PHOTOSHOP_ALIGNED_FINAL_UI_REBUILD
OWNER = UR / UI REVIEW
TECHNICAL_BASELINE = REOPEN_REQUIRED
UI_IMPLEMENTATION = HOLD
UI_WORK_ORDER = PROHIBITED UNTIL REBASELINE
```

## Technical gate entering UI

```text
INK-RUNTIME-HARNESS-STABILITY-001 = CLOSED
INK-TECH-CLOSURE-001 = CLOSED / PROMOTED
INK-CONNECTOR-005 = CLOSED / PROMOTED

CURRENT_CAPABILITY_BASELINE =
  ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
  FROZEN / POST-CONNECTOR-005 / UI-AUTHORITATIVE

FORMAT_VERSION = 4
BOUNDED_EDIT_OPERATIONS = 34
NAMED_TOOLS = 22
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

- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `governance/INK_PRODUCT_UX_PRINCIPLES_v1.0.md`
- `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`
- `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
- `research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`
- Photoshop reference screenshots / measurement baseline accepted by UR

UI may change placement, grouping, density, panel behavior, typography, icons and interaction presentation.

UI must not change Core/Document/History/Revision/Geometry/CHAT semantics merely to fit the interface.

## Next action

```text
MR
→ audit omitted existing/required INK capabilities
→ restore/add accepted capabilities
→ publish a refreshed ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
→ provide exact promoted/runtime-verified authority

UR
→ diff refreshed baseline against current Function Placement Map
→ add/remove/reposition affected commands, tools and panels
→ refresh AI Completion Checklist counts/coverage
→ explicitly clear UI_HOLD
→ only then issue bounded UI implementation Work Order(s)
```

Until that sequence completes:

`NO UI DEV / NO UI IMPLEMENTATION WORK ORDER / NO FINAL FUNCTION LOCK`

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
