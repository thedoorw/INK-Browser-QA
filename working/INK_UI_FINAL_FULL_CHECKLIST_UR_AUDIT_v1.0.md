# INK UI final full checklist audit — UR review v1.0

TASK: `INK-UI-FINAL-FULL-CHECKLIST-AUDIT-001`  
STATUS: `UR_AUDIT_RECORDED / FINDINGS_OPEN / USER_ACCEPTANCE_PENDING / STOP_TO_MR_REVIEW`  
BASE CURRENT MAIN: `3608962c17ecbea864be18049462badfc7021a38`  
AUDIT BRANCH: `work/ink-ui-final-full-checklist-audit-001`

## Result

```text
TOTAL = 592
PASS = 384
FAIL = 207
N_A = 1
UNREVIEWED = 0
OPEN = 207
USER_VISUAL_ACCEPTANCE = PENDING (10 IDs; 8 marked [USER], 2 explicit USER requirements)
FINAL_RUNTIME = PASS / RUN_36445204976 / PRODUCT_SHA_24d3b3f607a17b3cb9331ec3635b34d804ee445b
UI_COMPLETE = HOLD
```

The authoritative per-ID ledger is appended to `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`. Each of the 592 IDs has PASS, FAIL or N_A and an evidence/reason. FAIL includes missing direct proof, so it must not be read as 207 independently reproduced product defects. `AH25` is N_A because multi-document status following is conditional on future multi-document support.

## Evidence reviewed

- Current-main tree, baseline, placement map, UI-A/B/C UR reviews, UI-C DEV handoff and Photoshop measurement/fine-detail authorities.
- Attached `ps-1.png` and `ps-2.png`: 1280×1024; SHA-256 match the locked reference pack exactly. Application crop excludes 30px taskbar (1280×994).
- Final Runtime artifact `10979718534`: `ui.json` 110/110 PASS; `ui-first-paint.png`, `ui-1280x1024.png`, `ui-960x800.png`; Closure/Geometry/Creative evidence. Screenshots visually inspected.
- Current-main source: `product/source/styles.css` contains 36 `!important` occurrences (`rg -o '!important' product/source/styles.css | wc -l`).
- Current-main focused tests: `node --test qa/ink-ui-{a-photoshop-shell-panels,b-full-capability-controls,c-photoshop-fidelity-closure}.test.mjs` yielded 24 PASS / 1 FAIL. The failing UI-A assertion expects a former Navigator camera source string; current `product/source/web-shell.js` uses renderer viewport/world bounds and existing camera flow. This is a stale QA contract pending correction and recheck, not evidence of a Navigator product regression.
- GitHub comparison `24d3b3f607a17b3cb9331ec3635b34d804ee445b..3608962c17ecbea864be18049462badfc7021a38`: 28 subsequent commits, no `product/source/**` changes. The final Runtime remains valid for product bytes. No central Runtime was rerun for this document audit.

## Bounded findings and routing

| Finding | IDs | Scope / required closure | Owner |
|---|---:|---|---|
| UI-AUD-01 | 1 | `AB02`: total `!important` is 36, requirement says 0. DEV to reconcile CSS without altering Core; focused layout QA, UR recheck; assess product-change Runtime revalidation policy before closure. | UR → DEV |
| UI-AUD-02 | 29 | Missing item-specific current-main state screenshots/crops, 960 compact, panel/History/Navigator/Library visual states, major-edge overlay and difference image. Capture exact viewport/DPR and apply reference crop; UR inspect. | UR → DEV evidence |
| UI-AUD-03 | 22 | Complete Fine Detail Standard's implementation table with Component / Field / Target / Actual / Evidence / Result for each outstanding field. Resolve `REFERENCE_MISSING` explicitly. | UR → DEV evidence |
| UI-AUD-04 | 1 | `AF11`: closure predicate fails while other findings remain; recheck only after all required blockers resolve. | UR |
| UI-AUD-05 | 1 | `D09`: Escape closure is tested, focus return is not. Add targeted browser assertion and recheck. | UR → DEV QA |
| UI-AUD-06 | 33 | Exact source/health/click-through checks absent or incomplete for the listed IDs, including dead controls and duplicate Primary Homes. Produce ID-linked source assertions and live sweep, correcting only reproduced UI defects. | UR → DEV QA |
| UI-AUD-07 | 11 | Adobe behavior provenance and controlled Photoshop reference environment details missing (version, OS/scaling/font settings, active-document P0 evidence). Record known/UNKNOWN values honestly; UR determines reference sufficiency. | UR / reference evidence |
| UI-AUD-08 | 79 | Current-main interactions are not directly exercised at per-ID level by the 110 UI Runtime cases. Add focused browser/manual evidence for listed controls and flows; fix only failed UI routes. | UR → DEV QA |
| UI-AUD-09 | 19 | Guide/Snap and official-behavior cases lack direct browser traces for movement, tolerance, persistence, history, feedback and enabled states. Targeted QA first; Core/global gap, if found: STOP → MR / INTEGRATION_REQUIRED. | UR → DEV QA; MR if Core |
| UI-AUD-10 | 1 | `AF08`: UI-A static test fails on stale Navigator source-string assertion. Reconcile test against current renderer authority, run focused suite, UR recheck. | UR → DEV QA |
| USER-ACCEPT | 10 | USER visual and ergonomic review pending; never self-mark PASS. | USER acceptance / UR recording |

The exact membership of each finding is recorded in the per-ID ledger, so a correction can be checked against its affected IDs without reopening unrelated items. Do not change product to satisfy an evidence-only gap. Do not start another central Runtime merely because the checklist was audited; product changes require a separate revalidation decision.

## USER acceptance set

| ID | Acceptance question |
|---|---|
| F22 | Tool density compared with Photoshop |
| G01 | Canvas dominance |
| H12 | Panel header/tab density |
| Y07 | Status/readout noise |
| Z01 | Light-gray Photoshop-style workstation |
| Z07 | Normal command text readability |
| AI11 | Live movement readout usefulness/noise |
| AI16 | Snap jitter/oscillation/pointer trapping |
| AO10 | Final light-gray token set approval |
| AF10 | Final visual acceptance/revision completion |

No USER acceptance is recorded at this gate. Present this bounded set after AI/QA findings are resolved and evidence is ready.

## MR handoff

Review the checklist ledger and bounded findings. The known CSS mismatch is UI presentation scope; if a proposed correction crosses Core/global authority, route `STOP → MR / INTEGRATION_REQUIRED`. Keep `UI_COMPLETE=HOLD`. After DEV evidence or corrections, UR rechecks only affected IDs and any Runtime revalidation required by product changes. `STOP → MR REVIEW`.
