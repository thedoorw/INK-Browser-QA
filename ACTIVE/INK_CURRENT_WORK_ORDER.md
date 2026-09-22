# INK CURRENT WORK ORDER

STATUS: `INK-WEB-UI-002 / MR_PASS / PROMOTED / CLOSED`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-WEB-UI-002` |
| TITLE | `Shared Portable/Web Shell Sync + Runtime Trigger Guard v0.1` |
| AUTHORITY | `USER_EXPLICIT / PACKAGE_WORK` |
| DEV_WORK_BRANCH | `work/ink-web-ui-002` |
| DEV_MODE | `BOUNDED_LONG_SEQUENCE` |
| PRODUCT_SOURCE_MUTATION | `AUTHORIZED / REGRESSION_GUARD_ONLY` |
| UI_MUTATION | `NO NEW VISUAL REDESIGN` |
| WORKFLOW_MUTATION | `AUTHORIZED / RUNTIME_TRIGGER_AND_PROCESS_HYGIENE` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_BATCH` |

## Prior closure

`INK-WEB-UI-001` is accepted and promoted.

```text
REVIEWED_HANDOFF_HEAD = 8b8a59e08e4c31a1f317b5b4c57acf05cf160cc5
TESTED_PRODUCT_SHA = 72ad6869f02bce293ae923755db0a154c9bff98b
RUNTIME_RUN = 35679835724 / SUCCESS
BROWSER_CHECKS = 40 / 40 PASS
PROMOTION_PR = #22 / MERGED
MAIN_MERGE = 29f06010fa539e5951d18d48b88045ab75ace84a
```

The task-local auto-push Runtime workflow from the DEV branch was intentionally excluded from promotion.

## Why this task exists

Two follow-up risks were confirmed during UI-001:

1. task-specific full Runtime was auto-triggering on ordinary DEV pushes and waking the user's self-hosted Windows runner;
2. Portable and Web currently share the same shell by implementation discipline, but there is no explicit parity guard preventing later Web-only drift.

This package closes both risks together.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `research/INK_WEB_UI_DEVELOPMENT_PLAN_v0.1.md`
7. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
8. `governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`
9. only the product / QA / workflow files required below

## Product invariant

```text
UI_SHELL = SHARED
Web      = INK v0.1 · Web
Portable = INK v0.1 · Portable
FORMAT_VERSION = 4
```

The following must remain shared unless explicitly delivery-specific:

- top-level workspace regions;
- left tool rail;
- right panel dock;
- Layers / History access;
- Reference / Compose / CHAT / Revision access;
- shared shell coordinator;
- primary CSS behavior;
- mark/favicon usage.

Allowed delivery-specific differences:

- supplementary product label;
- manifest identity;
- service-worker/cache behavior;
- adapter/persistence behavior.

## Long Sequence Workpack

### Phase A — Runtime workflow audit

Audit current self-hosted Windows runtime workflows and classify:

```text
AUTO_PUSH_ACTIVE
MANUAL_ONLY
HISTORICAL_CLOSED_BRANCH
UNSAFE_PROCESS_LAUNCH
SAFE_BOUNDED
```

At minimum inspect:

- `.github/workflows/ink-cloud-018-self-hosted-preflight.yml`
- `.github/workflows/ink-cloud-018-windows-runtime.yml`
- `.github/workflows/ink-ra-001-windows-runtime.yml`
- `.github/workflows/ink-v0.1-runtime-baseline.yml`
- any new runtime workflow introduced by this task

Do not rewrite historical workflows merely for stylistic consistency. Change only what is required to establish the current project-wide batch Runtime path and to prevent ordinary DEV pushes from waking the runner.

Checkpoint commit required.

Gate: `RUNTIME_WORKFLOW_AUDIT_COMPLETE`

### Phase B — Manual/batch Runtime trigger guard

Create or adapt one current project-wide Runtime entry point for future batched browser QA.

Requirements:

- self-hosted Windows full Runtime must not trigger on ordinary `push`;
- current active batch workflow uses `workflow_dispatch` only;
- explicit `target_ref` or exact SHA input;
- no automatic wake-up of the user's Windows runner on DEV commits;
- no task-specific UI workflow copied forward from UI-001;
- no background promise of Runtime verification when no batch was executed.

Recommended current workflow identity:

`.github/workflows/ink-runtime-batch-windows.yml`

The workflow may reuse proven bounded materialization/runtime logic, but must comply with the current safety standard.

Checkpoint commit required.

Gate: `RUNTIME_BATCH_TRIGGER_GUARD_WORKS`

### Phase C — Windows runner process hygiene

The current batch path must not open extra visible PowerShell windows during normal execution.

Hard rules:

- do not change PowerShell execution policy;
- do not use `Set-ExecutionPolicy`;
- do not use `-ExecutionPolicy Bypass`;
- do not download and immediately execute remote PowerShell scripts;
- do not add antivirus/security exclusions;
- do not use a child `Start-Process powershell` pattern that opens another console window;
- prefer checked-in Node/cmd helpers or same-process bounded shell operations;
- if a local server process is needed, launch it non-interactively without creating a visible extra console.

The current workflow source itself must pass a static safety scan for the prohibited patterns above.

Checkpoint commit required.

Gate: `WINDOWS_RUNTIME_PROCESS_HYGIENE_WORKS`

### Phase D — Portable/Web shell parity guard

Add a focused deterministic source/static test that compares the two active entry shells.

At minimum verify parity for:

- shared top-level shell regions;
- required command-bearing IDs;
- tool-rail hooks;
- `web-shell.js` loading;
- panel dock availability;
- Layers / History reachability;
- Reference / Compose / CHAT / Revision reachability;
- favicon link presence;
- INK mark use;
- shared stylesheet loading;
- Creative Workspace presence/default containment.

Allow only explicit delivery-specific differences:

```text
Web title / label
Portable title / label
manifest file
Web service-worker behavior
compat/modular boot adapter differences already required by delivery form
```

A future Web-only shell mutation that changes shared UI structure must fail the parity test.

Recommended test:

`qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`

Checkpoint commit required.

Gate: `PORTABLE_WEB_SHELL_PARITY_GUARD_WORKS`

### Phase E — Source/static closure

Required:

- parity test PASS;
- runtime workflow trigger audit PASS;
- active batch workflow is manual-only;
- prohibited PowerShell/process patterns absent from the current batch workflow;
- no product UI regression introduced;
- `FORMAT_VERSION = 4`;
- no package mutation;
- no product base-version change;
- runtime debt remains batched unless a high-risk trigger appears.

Final source gate:

`INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE`

## Explicit deferrals

Do not expand into:

- new visual UI redesign;
- contextual-control migration;
- new CHAT semantics;
- new Recipe semantics;
- renderer changes;
- document/schema changes;
- package/release certification;
- broad cleanup of every historical workflow.

## Required evidence artifact

Create/update exactly one report:

`research/INK_UI_RUNTIME_GUARD_REPORT_v0.1.md`

Include:

- workflow audit matrix;
- exact trigger change;
- process-hygiene implementation;
- parity-test contract;
- tests/checks executed;
- files changed;
- known historical workflows intentionally left unchanged;
- final source gate.

## DEV progress discipline

Branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

Update each meaningful checkpoint.

## Completion / STOP

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-002
BRANCH = work/ink-web-ui-002
GATE = INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE
FORMAT_VERSION = 4 / PRESERVED
RUNTIME_TRIGGER = MANUAL_BATCH_ONLY
PORTABLE_WEB_PARITY_GUARD = PASS
PACKAGE_MUTATION = 0
BROWSER_RUNTIME_QA = DEFERRED_TO_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Closure

```text
TASK = INK-WEB-UI-002
DEV_HANDOFF_HEAD = e4b31816be2a24484c853e8defa5f388e9af150e
MR = PASS
SOURCE_GATE = INK_UI_RUNTIME_GUARD_SOURCE_COMPLETE / PASS
PROMOTION_PR = #23 / MERGED
MAIN = 6f3a49e0dd1482cdcbd406ba88ec84e74be9138f
RUNTIME_QA = DEFERRED_TO_BATCH
NEXT = DUAL_TRACK_UI_CORE_GOVERNANCE_DISCUSSION
```

No next implementation Work Order is auto-opened.
