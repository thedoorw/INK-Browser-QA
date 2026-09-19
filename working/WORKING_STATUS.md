# INK WORKING STATUS

STATUS: `DEV_AUTHORIZED`

## Active control

| Field | Value |
|---|---|
| CURRENT_WORK_ORDER | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| CURRENT_TASK_ID | `INK-CLOUD-003` |
| DEV_BRANCH | `work/ink-cloud-003` |
| DEV_BRANCH_HEAD | `NOT_STARTED` |
| DEV_HANDOFF | `PENDING` |
| MR_REVIEW | `NOT_STARTED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| PACKAGE_UPDATE | `PROHIBITED` |
| NEXT_STAGE | `CONTAINER_OWNERSHIP_STRUCTURAL_SEMANTICS` |
| CLOUD_START_GATE | `BLOCKED_UNTIL_PRE_CLOUD_CORE_READY_AND_USER_APPROVAL` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| SOURCE_STATIC_QA | `REQUIRED` |

## Accepted baseline

`INK-CLOUD-002`:

```text
SOURCE_REVIEW_PASS
RUNTIME_QA_DEFERRED
PROMOTED_TO_MAIN
PROMOTION_COMMIT = 7c03793ce7d289d0a1ecf1fafe3602aa9eedff13
```

Accepted capability:

`Frame + Nested Hierarchy Foundation v0.1`

## Current objective

Stabilize:

- Frame / Group structural roles;
- ownership invariants;
- inherited visibility / lock / opacity;
- nested structural order;
- Group/Frame transform consistency;
- serialization / migration / integrity behavior.

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
