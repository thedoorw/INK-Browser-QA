# INK DEV PROGRESS

STATUS: `INK-WEB-UI-002 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-002` |
| TITLE | `Shared Portable/Web Shell Sync + Runtime Trigger Guard v0.1` |
| BRANCH | `work/ink-web-ui-002` |
| BRANCH_BASE | `d50c59ffb1c015b0776ac1864486869098be9181` |
| TASK_STATUS | `AUTHORIZED / READY_TO_START` |
| CURRENT_PHASE | `PHASE_A / RUNTIME_WORKFLOW_AUDIT` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE` |
| FORMAT_VERSION | `4 / PRESERVE` |
| UI_SHELL_SCOPE | `SHARED PORTABLE + WEB/CLOUD` |
| RUNTIME_TRIGGER | `MANUAL_BATCH_ONLY / TARGET` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| BROWSER_RUNTIME_QA | `DEFERRED_TO_BATCH` |

## Authoritative task

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Planned phases

- Phase A — Runtime workflow audit
- Phase B — manual/batch Runtime trigger guard
- Phase C — Windows runner process hygiene
- Phase D — Portable/Web shell parity guard
- Phase E — source/static closure

## Hard rules

```text
ordinary DEV push must not wake self-hosted Windows full Runtime
no visible child PowerShell console
no ExecutionPolicy bypass
no Set-ExecutionPolicy
no AV/security exclusions
Portable/Web shared shell must not drift
FORMAT_VERSION = 4
```

## Previous accepted UI baseline

```text
INK-WEB-UI-001
MAIN = 29f06010fa539e5951d18d48b88045ab75ace84a
Web = INK v0.1 · Web
Portable = INK v0.1 · Portable
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-002
BRANCH = work/ink-web-ui-002
FINAL_HEAD = <exact SHA>
GATE = INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE
FORMAT_VERSION = 4 / PRESERVED
RUNTIME_TRIGGER = MANUAL_BATCH_ONLY
PORTABLE_WEB_PARITY_GUARD = PASS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
BROWSER_RUNTIME_QA = DEFERRED_TO_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
