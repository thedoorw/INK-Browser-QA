# INK WORKING STATUS

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

## Active control

| Field | Value |
|---|---|
| CURRENT_WORK_ORDER | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| CURRENT_TASK_ID | `INK-CLOUD-005` |
| DEV_BRANCH | `work/ink-cloud-005` |
| DEV_BRANCH_HEAD | `315d4ac2b33894630c0d1a67333fc40acbc145e9` |
| DEV_HANDOFF | `ACCEPTED` |
| MR_REVIEW | `MR_PASS` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| PACKAGE_UPDATE | `PROHIBITED` |
| NEXT_STAGE | `USER_PROMOTION_DECISION_REQUIRED` |
| CLOUD_START_GATE | `BLOCKED_UNTIL_PRE_CLOUD_CORE_READY_AND_USER_APPROVAL` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| SOURCE_STATIC_QA | `REQUIRED` |

## Accepted baseline

`INK-CLOUD-004`:

```text
SOURCE_REVIEW_PASS
RUNTIME_QA_DEFERRED
PROMOTED_TO_MAIN
PROMOTION_COMMIT = 37418ab7f6b994425126e73c60810401d5e6e826
```

Accepted capability:

`Transform / Bounds / Coordinate System Foundation v0.1`

## Current objective

Stabilize the minimum Component / Instance data model:

- definition identity;
- source-node identity;
- linked Instance reference;
- bounded override envelope;
- detach semantics;
- broken-reference/cycle safety;
- History integration;
- serialization/migration/integrity.

No Cloud implementation is authorized.

## Resume rule

Recover from GitHub SSOT:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. this file
6. role-specific progress/review files

## Runtime constraint

Hosted GitHub Actions remain unavailable due quota.

Use source/static/unit evidence where possible and record browser/runtime debt as `RUNTIME_QA_DEFERRED`.


## INK-CLOUD-005 MR pass checkpoint

Reviewed branch head:

`315d4ac2b33894630c0d1a67333fc40acbc145e9`

Decision:

`MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

Accepted capability:

`Component / Instance Data Model Foundation v0.1`

Main promotion is not automatic and remains pending user approval.

Cloud Start Gate remains blocked.
