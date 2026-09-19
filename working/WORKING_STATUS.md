# INK WORKING STATUS

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

## Active control

| Field | Value |
|---|---|
| CURRENT_WORK_ORDER | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| CURRENT_TASK_ID | `INK-CLOUD-004` |
| DEV_BRANCH | `work/ink-cloud-004` |
| DEV_BRANCH_HEAD | `436c7bded529f481f22a7657f7a2cc62d43f4053` |
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

`INK-CLOUD-003`:

```text
SOURCE_REVIEW_PASS
RUNTIME_QA_DEFERRED
PROMOTED_TO_MAIN
PROMOTION_COMMIT = d340664cf554755abfa146f607c05c03200e8799
```

Accepted capability:

`Container / Ownership / Structural Semantics Foundation v0.1`

## Current objective

Stabilize:

- local / parent / world / screen coordinate definitions;
- affine transform rules;
- bounds taxonomy;
- Frame transform vs geometry resize;
- Group child-derived bounds;
- nested selection transform semantics;
- spatial / hit-test / selection bounds consistency;
- serialization of authoritative geometry only.

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


## MR revision checkpoint

Reviewed branch head:

`479bcca83e0c375592bff6542115b971e88002c7`

Decision:

`MR_REVISE`

Only authorized revision:

- singular node/handle/interactive transform History preflight/cleanup;
- regression evidence for no pending History and no mutation;
- progress/report update.

Transform/Bounds core architecture is otherwise retained.

Runtime QA remains `DEFERRED`.


## MR pass checkpoint

Reviewed branch head:

`436c7bded529f481f22a7657f7a2cc62d43f4053`

Decision:

`MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

The Singular Interaction / History Guard revision closes the prior blocking finding.

Main promotion is not automatic and remains pending user approval.

Cloud Start Gate remains blocked.
