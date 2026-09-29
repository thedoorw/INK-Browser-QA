# INK final checklist — evidence-only QA workpack v1.0

STATUS: `UR_AUTHORIZED / EVIDENCE_ONLY / NO_PRODUCT_MUTATION`

TASK: `INK-UI-FINAL-CHECKLIST-EVIDENCE-002`
OWNER: `UI DEV / QA → UR RECHECK`
BRANCH: `work/ink-ui-final-checklist-evidence-002`
BASE: pin current main SHA at branch creation
AUTHORITY: `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md` and `working/INK_UI_FINAL_CHECKLIST_CLOSURE_UR_EVIDENCE_R1_v1.0.md`

## Mission

Close evidence gaps before proposing any product change. Current ledger: 592 total / 399 PASS / 192 FAIL / 1 N_A / 0 UNREVIEWED. Ten USER items, AB02/AO03 confirmed CSS findings and AF11 derivative closure remain outside this evidence-only branch. Every candidate ID must have its own exact disposition and source/browser/visual/reference evidence. Summary PASS does not count.

## Evidence families

- UI-AUD-02: capture missing current-main compact, double Tools, expanded panels, History multi-state, Navigator normal/after pan/zoom, Libraries results, and other listed visual states. Preserve viewport, zoom and DPR metadata.
- UI-AUD-03: implementation-level Fine Detail table: Component / Field / Target / Actual / Evidence / Result. Explicitly resolve or keep open each REFERENCE_MISSING.
- UI-AUD-05: browser keyboard Escape focus-return assertion, including trigger focus.
- UI-AUD-06: exact current-main source/health/click-through inventory for each remaining ID, including duplicate Primary Homes and dead controls. AO03 remains a reproduced CSS defect for separate correction.
- UI-AUD-07: record remaining reference environment values as measured or UNKNOWN where checklist permits. Do not infer missing OS/font/scaling data from pixels.
- UI-AUD-08: targeted interaction evidence for the listed 79 initial IDs, checking real event paths and resulting state rather than code-string presence.
- UI-AUD-09: guide and snap behavior QA for remaining 18 initial IDs, including persistence, History, tolerance/hysteresis and feedback. Cross-lane issues are escalated.

Use the current passed Runtime artifact where it directly proves an item. Run focused browser QA for missing states on an exact product SHA through the approved Windows browser runner or an equivalent recorded environment. Do not rerun the full central Runtime for this evidence-only task. No new product behavior, Core authority or FORMAT_VERSION changes.

## Handoff

For each ID: result, exact evidence location, test or screenshot assertion, viewport/DPR where relevant, and reason for any remaining FAIL. Provide a machine-checkable count reconciliation and exact branch HEAD. If QA reproduces a UI-only defect, file a bounded finding to UR and keep product untouched on this branch. If it needs Core/global authority: STOP → MR / INTEGRATION_REQUIRED. DEV returns STOP → UR; UR rechecks affected IDs. USER acceptance remains separate.
