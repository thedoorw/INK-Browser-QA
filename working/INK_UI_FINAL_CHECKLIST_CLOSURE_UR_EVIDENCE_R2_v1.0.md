# INK final checklist — UR evidence R2

STATUS: `SOURCE_RUNTIME_RECHECK / UI_COMPLETE_HOLD`
TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`
BASE: R1 promoted via PR #90; no product source changes since final Runtime.

Seven IDs moved FAIL → PASS: `D02 D05 F12 F13 F16 F17 F18`. Exact current-main UI-A/B/C focused QA is 25/25 PASS. Final Runtime artifact `10979718534` UI checks #20, #51–56 and #67–71 record the menu state and visible tool stack/context routes. `qa/ink-ui-b-full-capability-controls.test.mjs` checks all visible UI-B menu contributions are dispatched, specifically Filter Gallery and the Draw tool group; `qa/ink-ui-a-photoshop-shell-panels.test.mjs` checks the 11 top-level menu triggers.

```text
TOTAL = 592
PASS = 406
FAIL = 185
N_A = 1
UNREVIEWED = 0
OPEN = 185
USER_ACCEPTANCE_PENDING = 10
UI_COMPLETE = HOLD
```

Each ID's direct references are written in the authoritative checklist ledger. These seven source/Runtime facts do not establish all keyboard, flyout styling or other untested interactions. The evidence-only QA branch/issue #92 retains those IDs. Product CSS findings #91 remain separate. No central Runtime was rerun.
