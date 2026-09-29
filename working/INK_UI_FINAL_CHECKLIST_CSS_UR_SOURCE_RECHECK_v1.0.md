# INK final checklist closure — UR CSS source recheck v1.0

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`  
REVIEWED MAIN: `d438dc3eac7e342d541d2135c63efe010761fb5c`  
DEV CANDIDATE: `c0c3ddacd07b3022685990352b93335a8a6bd7eb` / `work/ink-ui-final-checklist-css-001` / draft PR #93  
RESULT: `SOURCE_QA_PASS / BROWSER_QA_OPEN / STOP → MR REVIEW`

## Evidence and decision

MR's previous final Runtime was PASS on product SHA `24d3b3f607a17b3cb9331ec3635b34d804ee445b`. Main through the reviewed SHA has unchanged product source relative to the CSS DEV branch base `0e49341ac24aedd53d903606d5e2c256628bc1c7`. The DEV candidate changes `product/source/styles.css`, `qa/ink-ui-final-checklist-css.test.mjs`, and its handoff only.

UR independently reviewed the complete CSS diff and ran:

`node --test qa/ink-ui-final-checklist-css.test.mjs qa/ink-ui-a-photoshop-shell-panels.test.mjs qa/ink-ui-b-full-capability-controls.test.mjs qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`

Result: **26 PASS / 0 FAIL** on exact candidate SHA. The diff removes six presentation `!important` declarations while retaining 30 visibility, motion, and resize-state declarations. It connects the reproduced Light shell gray roles to the existing semantic palette and adds one root scrollbar thumb token. CSS selector blocks, width families and tracked shell selector-definition counts do not grow. No JS, Core, global state or format change appears in the candidate.

| Checklist ID | Current main | Candidate source recheck | Remaining acceptance |
|---|---|---|---|
| AB02 | FAIL | Six presentation `!important` removed; focused source QA PASS. | Browser cascade/visible state in 1280×1024 and 960×800, including empty hint, labels, brush flyout and panel layout. |
| AO03 | FAIL | Reproduced local gray bypasses are tokenized; focused source QA PASS. | Compare actual Light UI hover, focus, disabled, panel, scrollbar and expanded dock states on candidate. |

**Neither ID is promoted to PASS.** The candidate has not had exact changed-product browser evidence. No Chromium binary was available in the local UR workspace. Source and static tests cannot certify visual or interaction results. A targeted browser QA run on the exact candidate SHA is required, along with UR recheck of adjacent visual IDs affected by the palette and cascade. If the browser run reproduces a new defect, return a bounded UI finding to DEV; Core/global authority goes to MR as `INTEGRATION_REQUIRED`.

## Runtime policy

This CSS candidate changes product bytes, so the previous final Runtime does not cover its exact SHA. The repository's batched Runtime policy allows a bounded change to defer full Runtime only when MR explicitly judges the risk compatible and records debt; release/certification gate or insufficient source confidence requires immediate Runtime. MR must determine whether targeted browser QA suffices at this closure stage or an exact-SHA integrated Runtime is required after promotion. UR did not launch the central Runtime automatically.

## Gate and follow-up

Authoritative main ledger remains **TOTAL 592 / PASS 406 / FAIL 185 / N_A 1 / UNREVIEWED 0 / OPEN 185**. Ten USER acceptance items remain pending. `UI_COMPLETE=HOLD`.

- CSS candidate: draft PR #93; exact-SHA visual/browser evidence and MR revalidation decision pending.
- Evidence-only QA: issue #92 and `working/INK_UI_FINAL_CHECKLIST_EVIDENCE_ONLY_QA_WORKPACK_v1.0.md`; no product mutation.
- UR rechecks affected IDs individually after evidence; no summary PASS substitution. Then STOP → MR REVIEW.
