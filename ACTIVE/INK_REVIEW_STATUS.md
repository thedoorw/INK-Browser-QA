# INK REVIEW STATUS

STATUS: `INK-WEB-UI-001 / MR_PASS / CLEAN_PROMOTION_REQUIRED`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-001` |
| DEV_BRANCH | `work/ink-web-ui-001` |
| REVIEWED_HANDOFF_HEAD | `8b8a59e08e4c31a1f317b5b4c57acf05cf160cc5` |
| TESTED_PRODUCT_SHA | `72ad6869f02bce293ae923755db0a154c9bff98b` |
| TARGET_GATE | `INK_WEB_UI_PHASE1_COMPLETE` |
| DEV_HANDOFF | `YES` |
| MR_REVIEW | `MR_PASS` |
| FORMAT_VERSION | `4 / PRESERVED` |
| UI_MUTATION | `AUTHORIZED / ACCEPTED` |
| WEB_DISPLAY_VERSION | `INK v0.1 · Web` |
| PORTABLE_DISPLAY_VERSION | `INK v0.1 · Portable` |
| FAVICON | `USER ORIGINAL MARK / PRESENT` |
| PACKAGE_INK_CURRENT | `NO_MUTATION` |
| BROWSER_RUNTIME_QA | `35679835724 / SUCCESS / 40 OF 40` |

## MR findings

Accepted:

- canvas-first shared shell implemented;
- Web and Portable entry shells both changed;
- right collapsible dock implemented;
- Layers / History / Reference / Compose / CHAT / Revision remain reachable;
- Creative Workspace defaults collapsed without removing underlying controller capability;
- Web identity = `INK v0.1 · Web`;
- Portable identity = `INK v0.1 · Portable`;
- user-original mark/favion integrated;
- service-worker/cache identity moved to `0.1-Web`;
- `FORMAT_VERSION = 4` preserved;
- no package mutation;
- exact tested SHA passed Windows self-hosted Chrome runtime with 40/40 browser checks.

Runtime:

```text
RUN = 35679835724
TESTED_SHA = 72ad6869f02bce293ae923755db0a154c9bff98b
RUNNER = DESKTOP-NSOQH69
RESULT = SUCCESS
BROWSER_CHECKS = 40 / 40 PASS
```

Handoff HEAD is two documentation-only commits ahead of the tested product SHA.

## Promotion containment

The DEV branch is diverged from current main, so direct merge is prohibited.

Clean promotion is required.

The following branch-only file is explicitly EXCLUDED from promotion:

`.github/workflows/ink-web-ui-001-runtime.yml`

Reason:

- it still auto-triggers on push;
- it wakes the user's self-hosted Windows runner on ordinary DEV commits;
- it contains task-local PowerShell launch behavior that conflicts with the newly adopted batched Runtime policy and current PowerShell safety standard.

The accepted product implementation does not depend on promoting that workflow file.

Branch-local `ACTIVE/INK_DEV_PROGRESS.md` and branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` are also excluded from clean product promotion.

Next bounded package will address:

`INK-WEB-UI-002 — Shared Portable/Web Shell Sync + Runtime Trigger Guard v0.1`
