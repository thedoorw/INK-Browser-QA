# INK DEV PROGRESS

STATUS: `DEV_IN_PROGRESS`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-006` |
| DEV_MODE | `LONG_SEQUENCE_WORKPACK` |
| DEV_WORK_BRANCH | `work/ink-cloud-006` |
| BASE_BRANCH_HEAD_AT_START | `ef88e8432690df6de7f05d67c281d351aa58353d` |
| LATEST_DEV_COMMIT | `d1f90889ed3f50a372692a7b41bd5a7323d2f6fd` |
| DEV_STATE | `SCHEMA_IMPLEMENTATION_CHECKPOINT` |
| MR_GATE | `REQUIRED_AFTER_HANDOFF` |
| FORMAT_VERSION_CHANGE | `0 / OPTIONAL_FORMAT_4_EXTENSIONS` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| CLOUD_START_GATE | `BLOCKED` |

## Objective

Complete the final pre-Cloud structural workpack defined in:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Focus:

- Layout / Constraints versioned structural schema;
- transport-neutral file/revision persistence contract;
- migration / integrity / save-load closure;
- compatibility with accepted INK-CLOUD-002 through 005.

## Progress rule

At each meaningful checkpoint record:

- exact SHA;
- files changed;
- schema decisions;
- checks actually executed;
- checks not executed;
- known gaps.

If FORMAT_VERSION change is required:

`STOP / MR_DECISION_REQUIRED`

Do not independently change FORMAT_VERSION.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-006
BRANCH = work/ink-cloud-006
FINAL_HEAD = <exact SHA>
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0 OR MR_DECISION_REQUIRED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

## Checkpoint 1 — Layout and persistence schema

Branch checkout started from GitHub `d1f90889ed3f50a372692a7b41bd5a7323d2f6fd`. Read required control files, readiness assessment, accepted Component report, and required document/storage/assets/source tests.

Implemented initial optional schemas:

- `INK-LAYOUT-1` on Frame and `INK-LAYOUT-ITEM-1` on Frame children;
- pure horizontal/vertical flow and resize-constraint evaluation plans;
- existing-History commands for set/remove Frame and child metadata;
- deterministic known-field normalization with unknown extension preservation;
- `INK-FILE-ENVELOPE` v1.0 with stable file/revision identity, format/extension/migration declarations, document payload, asset reference mirror, timestamps and canonical fingerprint;
- migration/integrity exports and diagnostics.

Actually executed: source syntax checks for new modules and touched document modules PASS; `git diff --check` PASS. New layout/persistence suite initially 17/18 because one expected hug-height arithmetic value was incorrect (51 vs actual 46); expectation corrected from padding + intrinsic sizes + gap. Final rerun pending at this checkpoint. Browser Runtime QA remains DEFERRED.
