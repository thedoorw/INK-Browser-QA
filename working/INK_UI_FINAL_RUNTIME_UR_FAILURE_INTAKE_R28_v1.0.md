# INK UI Final Checklist — UR R28 Terminal Runtime Failure Intake v1.0

STATUS: `FINAL_EXACT_SHA_RUNTIME_FAIL / NO_PRODUCT_DEFECT_AUTHORIZED / MR_GOVERNANCE_DISPOSITION_REQUIRED / USER_ACCEPTANCE_HOLD`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`
TRACKER: Issue #92
ROLE: UR failure intake only

## Exact Runtime identity

```text
FINAL_PRODUCT_SHA = ffefff26d541fb1c2c3d15b52121a2667f488de0
WORKFLOW_QUEUE_COMMIT = 15601b49aaca5f1de1b57cdc15010f7e479de8ed
RUNTIME_RUN = 36554403375
RUNTIME_RESULT = FAIL
ARTIFACT_ID = 11026936322
ARTIFACT_DIGEST = sha256:0896c1a97dd9cd574b43c887d00446cc797710561695be99709c8be7be5e7632
FORMAT_VERSION = 4
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED_CONTRACT = PASS
CENTRAL_RUNTIME_RETRY_AUTHORIZED = NO
```

The Runtime materialized and tested the pinned final product SHA exactly. Evidence preservation succeeded.

## Browser suite classification

```text
UI = FAIL / 109 PASS / 1 FAIL
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = FAIL / HARNESS_FAILURE
```

### UI suite

The sole UI failure is:

`UI-006 Phase F immediate contextual controls and deep Properties controls are explicitly separated`

Observed runtime state:

```text
#contextualOptions data-ui-route = PRIMARY_HOME
#quickControls data-ui-route = absent
Properties brush/object/geometry = DEEP_SETTINGS
```

This is **not a reproduced product defect**. The central UI harness still requires
`#quickControls.dataset.uiRoute === PRIMARY_HOME`, but authoritative R14
(`working/INK_UI_FINAL_CHECKLIST_UR_R14_PRIMARY_HOME_CLOSURE_v1.0.md`)
explicitly removed stale Primary Home authority metadata from nested `#quickControls`
to close `UI-DEFECT-PRIMARY-HOME-001`. The focused static regression
`qa/ink-ui-final-primary-home.test.mjs` likewise requires `quickControls` to have
no `data-ui-home` and no `data-ui-route="PRIMARY_HOME"`.

Classification:

```text
UI_RUNTIME_FAILURE = STALE_QA_ASSERTION
PRODUCT_MUTATION_AUTHORIZED = NO
```

### Creative suite

Creative completed 74 checks through:

`SMART_LOOP_STABLE_REFS_RETURNED`

Then the harness timed out while waiting for the QA-only same-origin resolver module
to expose `window.__INK_SMART_LOOP_QA_RESOLVE`.

Evidence:

```text
LAST_PROGRESS = HARNESS_FAILURE
MESSAGE = Runtime condition timeout
QA = null
CHECK_COUNT_BEFORE_TIMEOUT = 74
```

The resolver route passed Runtime HTTP preflight. The following blobs are byte-identical
between the earlier c636 focused Creative PASS and the final product:

- `qa/runtime/ink-cloud-018-browser-harness.html`
- `qa/runtime/run-ink-runtime-batch.mjs`
- `product/source/src/agent/output-handle-registry.js`
- `product/source/service-worker.js`
- `product/source/src/agent/public-creative-api.js`
- `product/source/src/agent/index.js`

The earlier c636 focused Creative evidence completed 154 checks, including the smart-loop
preview/materialization sequence. Current evidence therefore does not directly reproduce
a product defect.

Classification:

```text
CREATIVE_RUNTIME_FAILURE = UNREPRODUCED_RUNTIME_HARNESS_TIMEOUT
PRODUCT_MUTATION_AUTHORIZED = NO
SECOND_FINAL_RUNTIME_AUTHORIZED = NO
```

MR must determine the governance disposition. The prior Runtime handoff explicitly forbids
silent harness/product repair or a second final Runtime after a failure.

## Checklist state

No checklist row disposition changes in R28.

```text
TOTAL = 592
PASS = 580
FAIL = 11
N_A = 1
UNREVIEWED = 0
OPEN = 11
USER_ACCEPTANCE = 10 / HOLD
AF11 = FAIL / TERMINAL_PREDICATE_FALSE
PENDING_PRODUCT_MUTATIONS = 0
FINAL_RUNTIME = FAIL
UI_COMPLETE = HOLD
```

Remaining checklist FAIL rows remain USER 10 + AF11. USER acceptance must not start as
the terminal closure step while the required final Runtime is FAIL.

## Required handoff

```text
NEXT_OWNER = MR
NEXT_ACTION = GOVERNANCE_DISPOSITION_OF_RUN_36554403375
DO_NOT_RETRY_RUNTIME = YES
DO_NOT_MODIFY_PRODUCT = YES / UNLESS_A_REAL_DEFECT_IS_SEPARATELY_REPRODUCED
DO_NOT_CHANGE_FORMAT_VERSION = YES
```

MR should review the preserved artifact and decide whether a bounded QA/harness correction
is authorized. Any new Runtime after this failed terminal run requires a new explicit MR
governance authorization; it is not authorized by the R27 handoff.
