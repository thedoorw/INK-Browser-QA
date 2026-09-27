# INK P0 Promotion Reconciliation — DEV Handoff

TASK: `INK-P0-PROMOTION-RECONCILE-001`
BRANCH: `work/ink-p0-promotion-reconcile-001`
BASELINE_MAIN: `27b5ab481d4181a3117faf1d05f45b027e3368ad`
RUNTIME_VERIFIED_PRODUCT_SHA: `f911f777f770cbe290e290c4b0cbc3692b36641e`
RUNTIME_RUN: `36255595714` (previously PASS; not rerun here)
BRANCH_HEAD: exact commit containing this handoff, reported on delivery
GATE: `DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP`

## Exact source equivalence

Each Git blob below matches the same path at the Runtime-verified product SHA:

| Product source | Reconciled blob = Runtime-verified blob |
|---|---|
| `product/source/src/image/image-core.js` | `740394d141d872b3ed61c87bcb833ac149cc6bd0` |
| `product/source/src/ink.js` | `cfe69947538a237fb6c12f22aaaea38173f8cb3d` |
| `product/source/src/semantic/semantic-region-grounding.js` | `86520b7a83bace87d4fa46afbb9a2252731a4d59` |
| `product/source/src/studio-core.js` | `13d8deafebcb2a0566a814ebe1d3bca489eec5a4` |

`qa/ink-p0-restore-all-001-focused.test.mjs` likewise matches its Runtime-verified blob `b00c60e5a2b38e6d3a5febbbaaa46f099e0598fa`. The original ledger and original DEV handoff match the source branch blobs `17448f237cf0e528dcffffd3aa78e824803c0102` and `de79e097a4bd5deab4352a0b5d1af5289e1ad1f5`, respectively.

## Preservation and scope

Against `BASELINE_MAIN`, the changed files are precisely:

```text
ACTIVE/INK_DEV_PROGRESS.md
product/source/src/image/image-core.js
product/source/src/ink.js
product/source/src/semantic/semantic-region-grounding.js
product/source/src/studio-core.js
qa/ink-p0-restore-all-001-focused.test.mjs
working/INK_P0_EXISTING_CAPABILITY_RESTORE_LEDGER_v1.0.md
working/INK_P0_EXISTING_CAPABILITY_RESTORE_DEV_HANDOFF_v1.0.md
working/INK_P0_PROMOTION_RECONCILIATION_DEV_HANDOFF_v1.0.md
working/INK_P0_PROMOTION_RECONCILIATION_DEV_WORKPACK_v1.0.md
```

The last workpack was already committed as branch initialization. `README.md`, `ACTIVE/INK_CURRENT_WORK_ORDER.md`, `ACTIVE/INK_RUNTIME_QUEUE.json`, `.github/workflows/ink-runtime-batch-windows.yml`, `working/WORKING_STATUS.md`, and `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md` have identical blobs to `BASELINE_MAIN`. The branch starts from that exact main commit. No stale source-branch progress, governance, or workflow was copied.

The ledger enumerates rows `01` through `61`, with 61 entries and `0 identified` remaining loss in every row. The original restoration handoff also reports `UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0 identified` against the accepted historical/current P0 scope. MR retains the review authority for that classification.

## Focused QA on reconciled branch

| Check | Result |
|---|---|
| `node --test qa/ink-p0-restore-all-001-focused.test.mjs` | 4 / 4 PASS, including History and `.ink` save/load |
| `node --check` for all four product files | PASS |
| `git diff --check` on four product paths | PASS; preserved source-branch Markdown evidence contains intentional hard line breaks |
| Runtime and Runtime queue | Not run or submitted |

```text
PRODUCT_FILES_SOURCE_EQUIVALENT = 4 / 4
FOCUSED_TEST_EQUIVALENT = PASS
SECTION_4_LEDGER = 61 / 61
UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0 identified
NEWER_MAIN_AUTHORITY_PRESERVED = PASS
RUNTIME_VERIFIED_PRODUCT_SOURCE_EQUIVALENCE = PASS
MR_REVIEW_REQUIRED = TRUE
```
