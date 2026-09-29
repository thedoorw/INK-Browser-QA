# INK UI Final Runtime — MR Governance Disposition R29 v1.0

STATUS: `MR_QA_ONLY_RECONCILIATION_AUTHORIZED / PRODUCT_MUTATION_FORBIDDEN / ONE_NEW_FINAL_RUNTIME_AFTER_PROMOTION`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`
SOURCE_RUNTIME: `36554403375`
SOURCE_PRODUCT_SHA: `ffefff26d541fb1c2c3d15b52121a2667f488de0`

## MR finding

MR independently reviewed the preserved Runtime job evidence and the R28 UR intake.

```text
P1_EXACT_TARGET = PASS
CLOSURE_FOCUSED_CONTRACT = PASS
UI_BROWSER = FAIL / 109 PASS / 1 STALE_ASSERTION
CREATIVE_BROWSER = FAIL / HARNESS_TIMEOUT_AFTER_74_PASS
PRODUCT_DEFECT_REPRODUCED = NO
PRODUCT_MUTATION_AUTHORIZED = NO
```

### UI disposition

The failed central UI assertion still required nested `#quickControls` to carry
`data-ui-route="PRIMARY_HOME"`.

That requirement conflicts with the authoritative R14 closure, which deliberately
removed Primary Home metadata from nested `#quickControls` and retained
`#contextualOptions` as the single Primary Home.

Disposition:

```text
UI_FAILURE_CLASS = STALE_CENTRAL_QA_ASSERTION
AUTHORIZED_CHANGE = QA_HARNESS_ONLY
PRODUCT_SOURCE_CHANGE = FORBIDDEN
```

### Creative disposition

The Creative suite reached `SMART_LOOP_STABLE_REFS_RETURNED` and 74 PASS checks,
then timed out waiting for the QA-only resolver.

The resolver route preflight passed. The relevant Creative harness/runner and product
authority blobs were already compared against the prior focused Creative PASS baseline,
and no product defect was reproduced.

Disposition:

```text
CREATIVE_FAILURE_CLASS = UNREPRODUCED_HARNESS_RUNTIME_TIMEOUT
PRODUCT_MUTATION = NOT_AUTHORIZED
HARNESS_SEMANTICS_CHANGE = NOT_REQUIRED_FOR_R29
```

The next exact Runtime is allowed to re-execute the unchanged Creative proof after the
UI stale assertion is reconciled.

## Authorized R29 scope

Allowed:

- `qa/runtime/ink-web-ui-001-harness.html`
- `qa/ink-tech-closure-001-final-runtime-prep.test.mjs`
- governance/status documentation required to record this disposition

Forbidden:

- `product/source/**`
- Core semantic changes
- FORMAT_VERSION changes
- UI feature/layout changes
- any repair justified only by the Creative timeout

## Promotion gate

Before promotion:

1. diff must remain QA/governance-only;
2. no `product/source/**` path may change;
3. central UI harness must enforce the R14 single-Primary-Home contract;
4. final Runtime prep focused test must guard against reintroducing the stale assertion.

After promotion, MR authorizes exactly one new central exact-SHA Runtime on the promoted
QA-reconciled main SHA.

```text
NEW_FINAL_RUNTIME_AUTHORIZATION = ONE
NEXT_OWNER = MR
USER_ACCEPTANCE = HOLD_UNTIL_RUNTIME_PASS
UI_COMPLETE = HOLD
```
