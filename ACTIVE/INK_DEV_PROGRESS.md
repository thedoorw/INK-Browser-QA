# INK DEV PROGRESS

STATUS: `AUTHORIZED / NOT_STARTED`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-004` |
| AUTHORIZED_SCOPE | `TRANSFORM / BOUNDS / COORDINATE SYSTEM FOUNDATION` |
| DEV_STATE | `AUTHORIZED / NOT_STARTED` |
| MR_GATE | `DEV_IMPLEMENTATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-004` |
| LATEST_IMPLEMENTATION_COMMIT | `NONE` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION_CHANGE | `0 / CHANGE_REQUIRES_MR_STOP` |

## Start instruction

Read the authoritative sequence in `ACTIVE/INK_CURRENT_WORK_ORDER.md`.

Implement only INK-CLOUD-004.

Required discipline:

- use only `work/ink-cloud-004`;
- commit meaningful checkpoints continuously;
- update this file after each meaningful checkpoint;
- do not merge main;
- do not update `package/ink-current`;
- do not begin Component / Layout / Cloud work;
- do not change FORMAT_VERSION without STOP + MR decision;
- do not report unexecuted tests as PASS;
- keep browser/runtime-only evidence as `RUNTIME_QA_DEFERRED`.

## Completion

At completion, provide the required report, exact branch HEAD, actual checks performed, known limitations, Runtime QA debt, then:

```text
DEV_HANDOFF
MR_REVIEW_REQUIRED
STOP
```
