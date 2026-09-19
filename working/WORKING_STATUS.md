# INK WORKING STATUS

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

## Active control

| Field | Value |
|---|---|
| CURRENT_WORK_ORDER | `ACTIVE/INK_CURRENT_WORK_ORDER.md` |
| CURRENT_TASK_ID | `INK-CLOUD-005` |
| DEV_BRANCH | `work/ink-cloud-005` |
| DEV_BRANCH_HEAD | `Final handoff commit on work/ink-cloud-005; exact SHA in DEV response; MR must pin before review` |
| DEV_HANDOFF | `COMPLETE` |
| MR_REVIEW | `REQUIRED / NOT_YET_PERFORMED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| PACKAGE_UPDATE | `PROHIBITED` |
| NEXT_STAGE | `MR_REVIEW_REQUIRED / DEV_STOPPED` |
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

## INK-CLOUD-005 DEV checkpoint

- Actual branch checkout: `c0a0e441c1b699398167a8559b72af750ba496a8`.
- Design: `c0ed73c3382ab4d9f9acd0710125c81ee8cdc198`.
- Core/editor: `67833ed5e00dcdd839f51a0cb072bd955785d063`.
- Final implementation + QA: `a40885903c2e17e910b6a57672a2be1576e5f29a`.
- Required report: `research/INK_COMPONENT_INSTANCE_DATA_MODEL_REPORT_v0.1.md`.
- Evidence: `qa/core/evidence/INK_CLOUD_005_NODE_CHECKS.txt`.
- Executed: 91/91 Node tests, 6/6 product syntax checks; FORMAT_VERSION remains 4.
- Runtime/browser/Actions QA remains DEFERRED.

Final handoff commit is documentation-only. Its own SHA cannot be embedded in itself; DEV returns the exact resulting branch HEAD for MR to pin. This is a DEV status update, not an MR acceptance decision. Current Work Order authorization is unchanged; DEV is stopped pending MR.
