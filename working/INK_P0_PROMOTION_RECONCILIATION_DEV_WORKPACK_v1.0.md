# INK P0 Promotion Reconciliation DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV`

TASK: `INK-P0-PROMOTION-RECONCILE-001`

OWNER: `MR / MAIN REVIEW`

BRANCH: `work/ink-p0-promotion-reconcile-001`

BASELINE_MAIN: `27b5ab481d4181a3117faf1d05f45b027e3368ad`

RUNTIME_VERIFIED_SOURCE_BRANCH: `work/ink-p0-restore-all-001`

RUNTIME_VERIFIED_PRODUCT_SHA: `f911f777f770cbe290e290c4b0cbc3692b36641e`

RUNTIME_RUN: `36255595714`

RUNTIME_RESULT: `PASS`

## Goal

Cleanly reconcile the already Runtime-verified P0 restoration payload onto the latest main without re-implementing, expanding, or altering product behavior.

This is a promotion/reconciliation task, not a development-expansion task.

## Exact product payload to preserve byte-for-byte

The following product files must match the Runtime-verified SHA `f911f777f770cbe290e290c4b0cbc3692b36641e` exactly after reconciliation:

- `product/source/src/image/image-core.js`
- `product/source/src/ink.js`
- `product/source/src/semantic/semantic-region-grounding.js`
- `product/source/src/studio-core.js`

Also preserve the Runtime-verified focused regression:

- `qa/ink-p0-restore-all-001-focused.test.mjs`

And bring forward the accepted evidence:

- `working/INK_P0_EXISTING_CAPABILITY_RESTORE_LEDGER_v1.0.md`
- `working/INK_P0_EXISTING_CAPABILITY_RESTORE_DEV_HANDOFF_v1.0.md`

## Required constraints

DEV must:

- start from latest main baseline above;
- reconcile only the exact verified P0 payload;
- preserve all newer main governance/runtime-harness changes;
- verify blob/content equivalence against `f911f777f770cbe290e290c4b0cbc3692b36641e`;
- verify Section 4 ledger remains 61/61;
- verify `UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0`;
- run focused/static/non-integrated QA only as needed.

## Forbidden

- NO P1/P2 implementation.
- NO new product feature.
- NO UI rebuild.
- NO capability-baseline rewrite.
- NO Runtime queue submission.
- NO integrated Runtime.
- NO merge/promotion to main.
- NO alteration of the 4 Runtime-verified product files beyond exact source equivalence.
- NO replacement of current main governance/runtime harness with stale branch copies.
- NO carrying forward stale branch-local `ACTIVE/INK_DEV_PROGRESS.md` from the previous task.

## Required DEV handoff evidence

Provide:

1. exact branch HEAD;
2. changed-file list;
3. blob/content SHA comparison for all 4 product files vs Runtime-verified SHA;
4. focused regression file equivalence check;
5. 61/61 ledger count confirmation;
6. `UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0`;
7. proof newer main docs/workflow were preserved;
8. focused/static QA results;
9. explicit statement:
   `RUNTIME_VERIFIED_PRODUCT_SOURCE_EQUIVALENCE = PASS`.

## Stop gate

When reconciliation is complete:

```text
DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ STOP
```

DEV must not merge main or trigger Runtime.
