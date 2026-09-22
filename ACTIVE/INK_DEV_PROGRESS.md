# INK DEV PROGRESS

STATUS: `INK-WEB-UI-002 / DEV_HANDOFF / STOP`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-002` |
| TITLE | `Shared Portable/Web Shell Sync + Runtime Trigger Guard v0.1` |
| BRANCH | `work/ink-web-ui-002` |
| BRANCH_BASE | `d50c59ffb1c015b0776ac1864486869098be9181` |
| TASK_STATUS | `DEV_HANDOFF` |
| CURRENT_PHASE | `ALL_PHASES_COMPLETE / SOURCE_STATIC` |
| DEV_HANDOFF | `YES` |
| MR_REVIEW | `MR_REVIEW_REQUIRED` |
| TARGET_GATE | `INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE` |
| FORMAT_VERSION | `4 / PRESERVE` |
| UI_SHELL_SCOPE | `SHARED PORTABLE + WEB/CLOUD` |
| RUNTIME_TRIGGER | `MANUAL_BATCH_ONLY` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| BROWSER_RUNTIME_QA | `DEFERRED_TO_BATCH` |

## Authoritative task

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

## Completed phases

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
SOURCE_CLOSURE_HEAD = 0656d4cb35888d82cba4ea955032a508ad1022df
FINAL_HEAD = resolve work/ink-web-ui-002 at this documentation-only handoff commit
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

## Phase A checkpoint

- Previous HEAD: `5ad06e68334a2afa1551f595177e7c72ab44a0ec`.
- Read: README, AGENTS, 我說, ACTIVE entry/start/work order/progress, working status,
  development handoff, MR/DEV governance, Windows runtime standard and UI plan.
- Audited all six current workflow definitions, both HTML shells, shared coordinator,
  Creative Workspace and existing browser harnesses.
- Changed: this progress file and the single required report.
- Gate: `RUNTIME_WORKFLOW_AUDIT_COMPLETE`.
- Runtime not dispatched. Next: manual batch entry.

## Phase B checkpoint

- Previous checkpoint: `eab7ce427a399cfce6dc46fa86f82be32a852701` (Phase A).
- Removed only push blocks from CLOUD-018 and RA-001 runtime definitions.
- Added `ink-runtime-batch-windows.yml`: workflow_dispatch only, required target_ref,
  resolve once to exact SHA, bounded Git-blob materialization with hash checks,
  no Git installation or PowerShell requirement.
- Batch runner helper is the next Phase C dependency; no dispatch authorized here.
- Trigger source inspection: PASS; `RUNTIME_BATCH_TRIGGER_GUARD_WORKS`.
- Browser Runtime: `DEFERRED_TO_BATCH`.

## Phase C checkpoint

- Previous GitHub checkpoint: `d8fcf29655a4e87603c1874d55a76f95f0929e9a`.
- Added checked-in Node batch helper: same-process loopback server, random port,
  isolated browser profiles, hidden shell-free Chrome/Edge spawn, bounded callback
  wait, exact evidence validation, PID-scoped cleanup and artifact output.
- Existing harness adapters: UI callback now includes full checks; creative harness
  explicitly opens the intentionally collapsed panel; geometry adds JSON callback.
- Updated current Windows standard to supersede the historical bypass example.
- Node parse PASS; focused helper HTTP/evidence tests PASS (2/2).
- Gate: `WINDOWS_RUNTIME_PROCESS_HYGIENE_WORKS / SOURCE_ONLY`.
- Windows visible-window verification is still `DEFERRED_TO_BATCH`.

## Phase D checkpoint

- Previous GitHub checkpoint: `4cc38cfbdbca172d382d0bacd806388a406379fb`.
- Added strict whole-HTML parity test with a narrow field-by-field delivery allowlist.
- Required command/region IDs, tool hooks, shared CSS/coordinator/favicon/mark,
  dynamic dock routes, Creative Workspace installation/default containment checked.
- Added current workflow trigger + active process safety regression guard.
- Positive checks and negative mutation cases PASS (6/6 tests).
- No product source changed; existing Web/Portable labels and FORMAT_VERSION preserved.
- Gate: `PORTABLE_WEB_SHELL_PARITY_GUARD_WORKS`.
- Next: final consolidated verification/report; Runtime remains deferred.

## Phase E source/static checkpoint

- Previous GitHub checkpoint: `4aafe483b70ed3c6c27bbd99aa221fb0258be844`.
- Combined guard/helper suite: 8/8 PASS.
- Seven workflow YAML definitions parse with unique keys (PyYAML BaseLoader).
- Three inline action scripts, helper and all three harness scripts parse.
- Geometry callback restricted to HTTP so historical file delivery remains usable.
- `git diff --check`: PASS; `product/source` diff from starting HEAD: empty.
- FORMAT_VERSION=4; Web/Portable v0.1 identity unchanged.
- Final source gate: `INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE`.
- Source closure complete; documentation-only DEV_HANDOFF follows.
- No browser/Windows runtime dispatched or claimed.

## Final handoff

- Latest source/static closure commit: `0656d4cb35888d82cba4ea955032a508ad1022df`.
- This final commit changes only progress, working-status and report documentation.
- All five phases complete; 8/8 non-browser tests PASS and syntax/static gates PASS.
- Exactly 14 changed files from initial DEV HEAD; product tree unchanged.
- Report: `research/INK_UI_RUNTIME_GUARD_REPORT_v0.1.md`.
- Runtime debt recorded in `working/WORKING_STATUS.md`; no Runtime dispatch.
- MR must resolve and pin the exact final branch HEAD (including this commit),
  rather than use SOURCE_CLOSURE_HEAD as the review fingerprint. A commit cannot
  embed its own hash; the handoff response also supplies the exact final SHA.
- `DEV_HANDOFF → STOP → MR_REVIEW_REQUIRED`. No next task started.
