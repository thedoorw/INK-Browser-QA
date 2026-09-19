# INK DEV PROGRESS

STATUS: `AUTHORIZED / NOT_STARTED`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-005` |
| AUTHORIZED_SCOPE | `COMPONENT / INSTANCE DATA MODEL FOUNDATION` |
| DEV_STATE | `NOT_STARTED` |
| MR_GATE | `REQUIRED_AFTER_HANDOFF` |
| DEV_WORK_BRANCH | `work/ink-cloud-005` |
| BASE_BRANCH_HEAD_AT_START | `2ed1e9cbb4b77ac38b0c6798b8d75691f5325f46` |
| LATEST_DEV_COMMIT | `NONE` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION_CHANGE | `UNDECIDED / MR_GATE_IF_REQUIRED` |

## Baseline

Accepted INK-CLOUD-004 was promoted to main at:

`37418ab7f6b994425126e73c60810401d5e6e826`

This branch starts from the new INK-CLOUD-005 control baseline:

`2ed1e9cbb4b77ac38b0c6798b8d75691f5325f46`

## Authorized objective

Implement only the bounded Component / Instance data-model foundation defined in:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Primary structural goals:

- stable Component-definition identity;
- stable source-node identity;
- linked Instance reference model;
- minimum override envelope;
- deterministic detach;
- broken-reference / cycle safety;
- existing History integration;
- native serialization/migration/integrity;
- preserve accepted Frame / Group / Transform contracts.

## Required progress rule

Commit meaningful checkpoints and update this file continuously with:

- checkpoint SHA;
- files changed;
- model/schema decisions;
- checks actually executed;
- checks not executed;
- known gaps;
- any FORMAT_VERSION concern.

If a format-version bump appears necessary:

`STOP and request MR decision before changing FORMAT_VERSION.`

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-005
BRANCH = work/ink-cloud-005
FINAL_HEAD = <exact SHA>
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0 OR MR_DECISION_REQUIRED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
