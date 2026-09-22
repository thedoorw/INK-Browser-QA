# INK DEV PROGRESS

STATUS: `INK-WEB-UI-001 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-001` |
| TITLE | `Photoshop-Aligned Workspace Shell & Collapsible Panel Dock v0.1` |
| BRANCH | `work/ink-web-ui-001` |
| BRANCH_BASE | `e00ff4edd81ab659e62a87d700bcbb9fc6dd465d` |
| TASK_STATUS | `AUTHORIZED / READY_TO_START` |
| CURRENT_PHASE | `PHASE_A / SHELL_INVENTORY` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `INK_WEB_UI_PHASE1_COMPLETE` |
| FORMAT_VERSION | `4 / PRESERVE` |
| WEB_DISPLAY_VERSION | `INK v0.1 · Web / REQUIRED` |
| FAVICON | `USER ORIGINAL MARK / REQUIRED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `REQUIRED` |

## Authoritative source

Current Work Order:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

UI plan:

`research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`

User-original mark:

`reference/brand/INK_MARK_SOURCE_W-300.jpg`

SHA256:

`08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`

## Planned phases

- Phase A — exact shell inventory + regression map
- Phase B — Photoshop-aligned canvas-first shell
- Phase C — collapsible panel dock
- Phase D — v0.1 Web identity + INK mark + favicon + cache identity
- Phase E — regression + real-browser runtime closure

## Checkpoint rule

At every meaningful checkpoint:

- commit;
- update this branch-local file;
- record exact HEAD;
- record files changed;
- record checks/tests actually executed;
- record blocker;
- record next phase.

Do not infer approval to merge main, mutate package, change `FORMAT_VERSION`, broaden CHAT semantics, or clone Adobe visual assets/code.

## Initial constraints

```text
HUMAN_UI = quiet / compact / canvas-first
CHAT_CAPABILITY = preserved below UI
ADOBE_REFERENCE = interaction grammar only
PRODUCT_DISPLAY_VERSION = INK v0.1 · Web
FORMAT_VERSION = 4
FAVICON = user original mark
PUBLIC_STAGING = unchanged until MR promotion to main
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-001
BRANCH = work/ink-web-ui-001
FINAL_HEAD = <exact SHA>
GATE = INK_WEB_UI_PHASE1_COMPLETE
FORMAT_VERSION = 4 / PRESERVED
WEB_DISPLAY_VERSION = INK v0.1 · Web
FAVICON = PRESENT
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
BROWSER_RUNTIME_QA = EXECUTED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
