# INK UI Final Checklist — UR R14 Primary Home Closure v1.0

STATUS: `2_IDS_CLOSED / DEFECT_CORRECTED_AND_PROMOTED / CENTRAL_RUNTIME_NOT_RUN`

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`
TRACKER: Issue #92
DEFECT: `UI-DEFECT-PRIMARY-HOME-001`
AFFECTED: `AB07 / AE09`
PREVIOUS_PROMOTED_PRODUCT: `7a86ef6124fb18c6d05c0c520020663f65882c5a`
EXACT_CANDIDATE: `8ae252f195d1ea539873dffb52ec6c1e36c0c9fc`
PROMOTION_PR: `#98`
PROMOTED_PRODUCT: `c636354c29f0dfc5e379088de169d083e3df4ce5`

## Correction

The focused R13 browser inventory reproduced two visible `immediate-context` Primary Homes because `#quickControls` was already re-hosted inside `#contextualOptions` but still retained stale `data-ui-home="immediate-context" data-ui-route="PRIMARY_HOME"` metadata.

Bounded correction:
- keep `#contextualOptions` as the single `immediate-context` Primary Home;
- keep `#quickControls` and all existing command-bearing controls;
- keep existing web-shell re-host into `#contextualControlHost`;
- remove only the stale Primary Home authority metadata from nested `#quickControls`;
- add a focused static regression test.

No Core/global authority, schema, FORMAT_VERSION, or Runtime behavior changed.

## Exact-candidate browser recheck

Evidence:
- `qa/evidence/ink-ui-final-checklist-issue92-health-detail-8ae252f195d1/report.json`
- `qa/evidence/ink-ui-final-checklist-issue92-health-detail-8ae252f195d1/health-detail.json`

Result:
```text
TOTAL = 5
PASS = 5
FAIL = 0
CENTRAL_RUNTIME_EXECUTED = false
```

Verified:
- `AB07` PASS — zero visible duplicate Primary Homes in default / Layers-open / Reference-open.
- `AE09` PASS — duplicate Primary Home inventory = 0.
- `AH05` remains PASS.
- `AM01` remains PASS.
- `AO04` remains PASS.

## Promotion

No intervening `product/source/**` change existed between PR97 promotion and the PR98 candidate gate. PR #98 was marked ready only after exact-candidate browser PASS and promoted as `c636354c29f0dfc5e379088de169d083e3df4ce5`.

## Ledger

```text
TOTAL = 592
PASS = 471
FAIL = 120
N_A = 1
UNREVIEWED = 0
OPEN = 120
USER_ACCEPTANCE = 10 / PENDING
UI_COMPLETE = HOLD
```

Central Runtime was not run. The previous integrated Runtime remains historical and does not cover current promoted product bytes. Continue Issue #92 evidence closure; perform no further product mutation unless a remaining item is directly reproduced as a product defect.
