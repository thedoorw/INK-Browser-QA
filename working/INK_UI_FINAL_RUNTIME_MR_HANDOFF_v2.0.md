# INK Final Exact-SHA Integrated Runtime — MR Handoff v2.0

STATUS: `MR_FINAL_RUNTIME_REQUIRED / FINAL_PRODUCT_SHA_PINNED / PRODUCT_MUTATIONS_COMPLETE / CENTRAL_RUNTIME_NOT_RUN`

PROGRAM: `INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001`
TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`

FINAL_PRODUCT_SHA:
`ffefff26d541fb1c2c3d15b52121a2667f488de0`

UR_LEDGER_BEFORE_RUNTIME:
```text
TOTAL = 592
PASS = 580
FAIL = 11
N_A = 1
OPEN = 11
USER_ACCEPTANCE = 10 / PENDING
AF11 = PENDING
```

## MR mission

Run exactly ONE new authoritative integrated Runtime against the exact pinned SHA:

`ffefff26d541fb1c2c3d15b52121a2667f488de0`

Required:
- exact-SHA materialization;
- P1 exact-target contract;
- closure-focused tests;
- UI browser suite;
- closure browser suite;
- geometry browser suite;
- creative browser suite;
- evidence preservation;
- Runtime screenshot inspection;
- verify FORMAT_VERSION remains 4;
- verify no Core/cross-lane regression.

## Hard constraints

- Do not retarget Runtime to moving `main`.
- Do not silently repair product during the gate.
- Do not run a second new final Runtime in this closure sequence.
- If this Runtime fails, record the failure and STOP for governance disposition.
- QA/harness or product changes are not authorized by this handoff.
- Product bytes are frozen at the pinned SHA above.

## UR authority

- `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`
- `working/INK_UI_FINAL_CHECKLIST_FINE_DETAIL_ACTUAL_AUDIT_v2.0.md`
- `working/INK_UI_FINAL_CHECKLIST_UR_R25_CURRENT_PRODUCT_VISUAL_CLOSURE_v1.0.md`
- `working/INK_UI_FINAL_CHECKLIST_UR_R26_FINE_DETAIL_PARTIAL_CLOSURE_v1.0.md`
- `working/INK_UI_FINAL_CHECKLIST_UR_R27_AJ20_CLOSURE_v1.0.md`

## Expected post-Runtime state

If Runtime PASS:
```text
PRODUCT_MUTATIONS_COMPLETE = YES
FINAL_RUNTIME = PASS
USER_ACCEPTANCE = 10 / PENDING
AF11 = PENDING_UNTIL_USER_ACCEPTANCE_AND_ALL_REQUIRED_RECORDS
UI_COMPLETE = HOLD
```

Only USER acceptance remains before the terminal AF11 predicate can close.
