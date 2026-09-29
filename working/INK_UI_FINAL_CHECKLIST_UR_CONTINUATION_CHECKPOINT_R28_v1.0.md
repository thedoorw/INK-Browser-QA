# INK UI Final Checklist — UR Continuation Checkpoint R28 v1.0

STATUS: `TERMINAL_RUNTIME_FAIL / MR_GOVERNANCE_DISPOSITION_REQUIRED / USER_ACCEPTANCE_HOLD / UI_COMPLETE_HOLD`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`
TRACKER: Issue #92
CHECKPOINT_BASE_MAIN: `6660f5dce5b2f19e209b3da0ba23d7a3ff8e6694`

This checkpoint supersedes the older R11 continuation checkpoint for current resume purposes.
GitHub remains the only SSOT.

## Authoritative resume state

```text
FINAL_PRODUCT_SHA = ffefff26d541fb1c2c3d15b52121a2667f488de0
FINAL_PRODUCT_PROMOTION = PR106
PENDING_PRODUCT_MUTATIONS = 0
REPRODUCED_OPEN_PRODUCT_DEFECTS = 0

TOTAL = 592
PASS = 580
FAIL = 11
N_A = 1
UNREVIEWED = 0
OPEN = 11
USER_ACCEPTANCE = 10 / HOLD
AF11 = FAIL / TERMINAL_PREDICATE_FALSE

FINAL_RUNTIME_RUN = 36554403375
FINAL_RUNTIME_TESTED_SHA = ffefff26d541fb1c2c3d15b52121a2667f488de0
FINAL_RUNTIME = FAIL
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED_CONTRACT = PASS
UI_BROWSER = 109 / 110 / FAIL
CLOSURE_BROWSER = PASS
GEOMETRY_BROWSER = PASS
CREATIVE_BROWSER = FAIL / HARNESS_FAILURE
RUNTIME_ARTIFACT_ID = 11026936322
RUNTIME_ARTIFACT_DIGEST = sha256:0896c1a97dd9cd574b43c887d00446cc797710561695be99709c8be7be5e7632
FORMAT_VERSION = 4

RUNTIME_QUEUE_STATE = READY / DO_NOT_TOUCH_AS_UR
SECOND_FINAL_RUNTIME_AUTHORIZED = NO
PRODUCT_MUTATION_AUTHORIZED = NO
UI_COMPLETE = HOLD
NEXT_OWNER = MR
```

## Failure classification

### UI

The single failed UI check is a stale central Runtime harness assertion. The harness still
expects nested `#quickControls` to carry `data-ui-route="PRIMARY_HOME"`, while the
authoritative R14 Primary Home closure intentionally removed that metadata to eliminate
the duplicated Primary Home. Current runtime behavior matches the R14 product contract.

```text
UI_FAILURE_CLASS = STALE_QA_ASSERTION
PRODUCT_DEFECT = NO
```

### Creative

Creative passed 74 checks through `SMART_LOOP_STABLE_REFS_RETURNED`, then timed out while
waiting for the QA-only resolver function after loading `/__qa_smart_loop_resolver.js`.

The route preflight passed. Creative harness, Runtime runner, output-handle registry,
service worker, public creative API, and agent index relevant to this resolver are
byte-identical to the prior c636 focused Creative PASS baseline; the prior focused suite
completed 154 checks.

```text
CREATIVE_FAILURE_CLASS = UNREPRODUCED_RUNTIME_HARNESS_TIMEOUT
PRODUCT_DEFECT = NOT_REPRODUCED
```

## Evidence authority

- `working/INK_UI_FINAL_RUNTIME_UR_FAILURE_INTAKE_R28_v1.0.md`
- GitHub Actions run `36554403375`
- artifact `11026936322`
- `working/INK_UI_FINAL_CHECKLIST_UR_R14_PRIMARY_HOME_CLOSURE_v1.0.md`
- `qa/ink-ui-final-primary-home.test.mjs`
- prior focused Creative evidence:
  `qa/evidence/ink-ui-final-checklist-issue92-creative-suite-c636354c29f0/`

## Mandatory next action

```text
NEXT_OWNER = MR
NEXT_ACTION = GOVERNANCE_DISPOSITION_OF_FAILED_TERMINAL_RUNTIME
DO_NOT_RERUN = YES
DO_NOT_MODIFY_PRODUCT = YES
USER_ACCEPTANCE = HOLD
```

MR must decide whether a bounded QA/harness correction is authorized. A subsequent
authoritative Runtime, if any, requires new explicit MR authorization because the R27
one-final-Runtime authorization has been consumed by failed run 36554403375.
