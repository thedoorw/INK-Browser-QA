# INK WORKING STATUS

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

## Active control

| Field | Value |
|---|---|
| CURRENT_WORK_ORDER | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| CURRENT_TASK_ID | `INK-CLOUD-002` |
| DEV_BRANCH | `work/ink-cloud-002` |
| DEV_BRANCH_HEAD | `HANDOFF_COMMIT_REPORTED_IN_DEV_RESPONSE` |
| DEV_HANDOFF | `COMPLETE` |
| MR_REVIEW | `REQUIRED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| PACKAGE_UPDATE | `PROHIBITED` |
| NEXT_STAGE | `MR_REVIEW` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| SOURCE_STATIC_QA | `REQUIRED` |

## Previous accepted checkpoint

`INK-CLOUD-001` passed MR review.

Accepted audit is now promoted to main:

`research/INK_CLOUD_EDITOR_PENPOT_GAP_AUDIT_v0.1.md`

## Product model

Authoritative direction:

`governance/INK_Product_Delivery_Model_v0.1.md`

One shared INK core, with:
- portable single-`INK.html` delivery;
- INK Cloud Editor delivery.

## Resume rule

New windows recover from GitHub SSOT:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. this file
6. role-specific status/handoff files

## Fingerprint rule

During DEV:

```text
TASK_ID
+ DEV_WORK_BRANCH
+ latest checkpoint commit
```

At DEV handoff, MR pins the exact final branch HEAD before review.


## Temporary validation constraint

GitHub Actions quota is exhausted. Current development proceeds without hosted Runtime QA.

DEV must maximize source/static/structural evidence and explicitly record any checks that remain `RUNTIME_QA_DEFERRED`.

No package certification or Runtime-verified claim may be made while this debt remains open.
