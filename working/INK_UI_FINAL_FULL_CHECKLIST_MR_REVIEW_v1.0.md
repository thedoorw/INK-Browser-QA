# INK UI Final Full Checklist — MR Review v1.0

STATUS: `MR_PASS_AS_AUDIT_RECORD / FINDINGS_OPEN / UI_COMPLETE_HOLD`

DATE: 2026-09-29

TASK: `INK-UI-FINAL-FULL-CHECKLIST-AUDIT-001`

UR PR: `#89`

UR AUDIT HEAD: `06b1680bb959bf862cbbe55261cb1b5dbd6185e6`

MERGE: `ee81475fafde2b8eaf082cd64b0a3c7e090f240b`

## 1. MR disposition

```text
TOTAL = 592
PASS = 384
FAIL = 207
N_A = 1
UNREVIEWED = 0
OPEN = 207
USER_ACCEPTANCE = 10 IDs / PENDING
UI_COMPLETE = HOLD
```

The audit record itself passes MR review.

It does not close the UI program.

## 2. Independent integrity checks

MR independently verified:

- original checklist IDs = 592;
- audit ledger IDs = 592;
- missing IDs = 0;
- extra IDs = 0;
- duplicate IDs = 0;
- every ledger row has evidence/reason;
- reconstructed totals exactly match 384 / 207 / 1;
- all 207 FAIL rows reconcile to the declared finding groups;
- all 10 USER acceptance IDs remain FAIL and are not self-approved;
- AH25 N_A matches the checklist's conditional future multi-document wording;
- PR #89 changed only audit/checklist documents; `product/source/**` changes = 0.

## 3. Independently reproduced facts

### AB02

`product/source/styles.css` contains 36 `!important` occurrences.

Checklist requirement:

`AB02 presentation !important total remains 0.`

Therefore:

`UI-AUD-01 = CONFIRMED UI HEALTH MISMATCH`

### AF08

The UI-A static test still asserts the older source pattern:

`const camera = app.page().camera`

Current Navigator implementation uses:

`renderer.viewportWorldBounds()` with the existing page camera authority.

Therefore:

`UI-AUD-10 = CONFIRMED STALE QA CONTRACT / NOT PRODUCT REGRESSION`

### Photoshop reference identity

MR independently recomputed:

```text
ps-1.png SHA-256 = 9bb8f329df55f6e6617e32e60a138c6cd21451509465073d4821802482815f76
ps-2.png SHA-256 = df316d46821c2840acf1dad277dca6442b4b093034b9dd809d6cb4aa917860e2
```

These match the UR audit.

## 4. Meaning of the 207 FAIL items

Do not treat `FAIL = 207` as `207 product bugs`.

Breakdown:

```text
UI-AUD-01 confirmed product/UI-health mismatch = 1
UI-AUD-02 missing targeted visual evidence = 29
UI-AUD-03 incomplete fine-detail evidence table = 22
UI-AUD-04 derivative closure predicate = 1
UI-AUD-05 missing targeted focus-return assertion = 1
UI-AUD-06 source/health/click-through evidence gaps = 33
UI-AUD-07 Adobe/reference provenance gaps = 11
UI-AUD-08 targeted interaction evidence gaps = 79
UI-AUD-09 guide/snap behavior evidence gaps = 19
UI-AUD-10 stale QA contract = 1
USER-ACCEPT = 10
TOTAL = 207
```

Most open items require evidence/QA first, not product mutation.

## 5. Routing

UR remains the owning UI authority for closure.

Required next phase:

`INK-UI-FINAL-CHECKLIST-CLOSURE-001`

Priority order:

1. fix/reconcile AB02 and the stale QA contract;
2. produce the missing targeted source/runtime/visual/reference evidence;
3. reproduce any actual UI defect before changing product;
4. if a reproduced finding requires Core/global authority, `STOP → MR / INTEGRATION_REQUIRED`;
5. UR rechecks only affected checklist IDs;
6. after all AI/QA-verifiable findings close, present the 10 USER acceptance items;
7. only when FAIL=0 / OPEN=0 / UNREVIEWED=0 and USER acceptance is complete may `UI_COMPLETE` be restored.

## 6. Runtime policy

The previously passed final Runtime remains valid for unchanged product bytes.

Do not automatically rerun the full central Runtime for evidence-only closure.

If product changes are made, apply the Runtime revalidation policy to determine whether targeted QA or a new exact-SHA integrated Runtime is required.
