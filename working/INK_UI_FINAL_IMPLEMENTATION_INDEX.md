# INK Final UI — Implementation Index

STATUS: `UI_HOLD / CAPABILITY_REBASELINE_REQUIRED`

DATE: 2026-09-26

BASE_MAIN: `b1374ecec242b8206aa3000a784c7498e0044030`

CAPABILITY_AUTHORITY:
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

UI AUTHORITIES:

1. `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
   - Photoshop fixed/elastic geometry
   - 61 px top chrome
   - single/double Tools references
   - collapsed/expanded right-side reference states

2. `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`
   - all required/adapted/deferred Photoshop interface concepts
   - shell/menu/options/tools/panel/visual/interaction requirements
   - explicit exclusion matrix so “not implemented” cannot mean “forgotten”

3. `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`
   - final menu taxonomy
   - final panel inventory
   - 12/12 persistent tools
   - 22/22 named tools
   - 34/34 bounded edit operations
   - 29/29 select controls
   - 212/212 static-button ranges accounted
   - C3_PENDING = 0

4. `working/INK_UI_FINAL_STATIC_CONTROL_LEDGER_v1.0.md`
   - every current static button individually enumerated
   - every current select individually enumerated
   - raw source audit against silent loss/duplicate routes

5. `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`
   - mandatory post-implementation AI self-audit
   - source + Runtime + interaction + screenshot + health + current-main closure
   - all items must close before UI_COMPLETE

Governance:
- `governance/INK_PRODUCT_UX_PRINCIPLES_v1.0.md`
- `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

Sequence:

```text
FINAL SPEC LOCK
→ bounded UI implementation Work Order(s)
→ UI DEV
→ DEV handoff + health delta
→ UR source/interaction/visual review
→ clean integration
→ exact integrated-main Runtime
→ run AI Completion Checklist
→ USER visual acceptance/revision
→ OPEN_CHECKLIST_ITEMS = 0
→ UI_COMPLETE = VERIFIED_ON_CURRENT_MAIN
```

Current readiness:

```text
TECHNICAL_BASELINE_FROZEN = YES
PHOTOSHOP_ALIGNMENT_ITEMS_RECORDED = YES
FUNCTION_PLACEMENT_COMPLETE = SNAPSHOT_ONLY_PENDING_REBASELINE
C3_PENDING = REOPENED_BY_CAPABILITY_AUDIT
RAW_CONTROL_LEDGER_COMPLETE = CURRENT_SHELL_SNAPSHOT_ONLY
AI_COMPLETION_CHECKLIST_READY = STRUCTURE_READY_COUNTS_PENDING_REFRESH
PRODUCT_UI_MUTATION = 0
UI_IMPLEMENTATION = HOLD
NEXT = MR_REFRESHED_CAPABILITY_BASELINE
```


## Capability-reopen hold

The Photoshop reference package is retained, but capability-facing placement is no longer final because USER has reopened baseline completeness.

Do not issue UI implementation Work Orders from this index until:
1. MR republishes the authoritative capability baseline;
2. UR diffs that baseline against the current placement map;
3. every added/restored capability receives one Primary Home;
4. all checklist counts and exclusions are refreshed;
5. `UI_HOLD` is explicitly cleared.
