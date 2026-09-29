# INK Final Checklist CSS Correction — MR Review v1.0

STATUS: `MR_HOLD_FOR_TARGETED_BROWSER_EVIDENCE / CENTRAL_RUNTIME_DEFERRED_TO_FINAL_PRODUCT_SHA`

DATE: 2026-09-29

TASK: `INK-UI-FINAL-CHECKLIST-CLOSURE-001`

CSS DEV PR: `#93`
UR source-recheck PR: `#94`

## 1. MR disposition

```text
PR_93 = HOLD_FOR_TARGETED_BROWSER_EVIDENCE
PR_94 = PASS_AS_SOURCE_RECHECK_RECORD / MERGED
UI_COMPLETE = HOLD

CURRENT_LEDGER = 592 TOTAL / 406 PASS / 185 FAIL / 1 N_A / 0 UNREVIEWED
USER_ACCEPTANCE = 10 / PENDING
```

PR #94 merge:
`a0cb94de9fe56b23f56faa852bbd2f0e183700f8`

PR #93 candidate:
`c0c3ddacd07b3022685990352b93335a8a6bd7eb`

## 2. Source/static review

MR accepts the bounded source/static evidence:

- changed product file is `product/source/styles.css`;
- focused QA + UI-A/B/C = 26 / 26 PASS;
- six presentation `!important` declarations are removed;
- 30 semantic visibility / reduced-motion / resize-state exceptions remain;
- AO03 local Light gray bypasses are routed to existing semantic tokens;
- no JS / Core / global state / FORMAT_VERSION mutation;
- no new selector blocks, width families or breakpoints.

AB02 and AO03 are reproduced UI/CSS findings. The proposed correction is technically bounded.

## 3. Mandatory pre-promotion browser evidence

Source/static PASS does not authorize PR #93 promotion.

Required on exact candidate SHA `c0c3ddacd07b3022685990352b93335a8a6bd7eb`:

1. 1280×1024 browser capture;
2. 960×800 browser capture;
3. first-paint / normal workstation state;
4. expanded right-panel state;
5. panel stacking and splitter state;
6. panel/body scrolling;
7. menu and panel hover / focus / disabled states;
8. brush flyout / tool-label visibility;
9. statusbar and document chrome;
10. Light-theme token contrast and scrollbar state;
11. viewport / DPR / exact candidate SHA recorded in evidence.

UR must recheck AB02, AO03 and every adjacent checklist ID materially affected by the changed selectors/tokens.

If browser evidence reproduces a new UI defect:

`UR → bounded DEV correction → UR recheck`

If correct resolution requires Core/global authority:

`STOP → MR / INTEGRATION_REQUIRED`

## 4. Promotion decision

If targeted browser evidence and affected-ID UR recheck PASS:

```text
PR_93 = ELIGIBLE_FOR_UI_ONLY_PROMOTION
RUNTIME_DEBT = DEFERRED_TO_FINAL_CHECKLIST_BATCH
```

UR may promote the bounded UI-only correction under the existing delegated UI authority.

Before promotion, reconcile against latest main. If intervening main commits are documentation/evidence only and `product/source/**` is unchanged, the exact-candidate browser evidence remains valid after product-byte equivalence is recorded.

## 5. Central Runtime revalidation

Do not launch the central integrated Runtime now.

Reason:

- checklist closure still has 185 open items;
- issue #92 may reproduce additional product defects;
- running central Runtime after every small CSS/UI correction would repeat the earlier inefficient pattern;
- repository governance explicitly permits compatible Runtime batching.

However, once PR #93 or any later checklist correction changes product bytes, the previous final Runtime SHA `24d3b3f607a17b3cb9331ec3635b34d804ee445b` is no longer sufficient for terminal UI certification.

Therefore the mandatory terminal rule is:

```text
finish all checklist-driven product mutations
→ promote all accepted UI-only corrections
→ pin final current-main product SHA
→ run ONE new final exact-SHA integrated Runtime
→ UR final affected-ID reconciliation
→ USER acceptance
→ only then UI_COMPLETE
```

## 6. Evidence-only QA

Issue #92 remains authorized as evidence/QA only.

Missing evidence does not authorize product mutation.

Each remaining FAIL must first be directly tested or evidenced. Product changes are permitted only for reproduced defects.

## 7. Current MR gate

```text
AB02 = FAIL / CANDIDATE_FIX_EXISTS / BROWSER_EVIDENCE_OPEN
AO03 = FAIL / CANDIDATE_FIX_EXISTS / BROWSER_EVIDENCE_OPEN
PR_93 = DRAFT / HOLD
PR_94 = MERGED
ISSUE_92 = ACTIVE
FINAL_CENTRAL_RUNTIME = DEFERRED_UNTIL_LAST_PRODUCT_MUTATION
UI_COMPLETE = HOLD
NEXT_OWNER = UR
```
