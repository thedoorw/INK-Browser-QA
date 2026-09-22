# INK Self-Hosted Windows Runtime Standard

STATUS: `ACTIVE / AUTHORITATIVE_RUNTIME_BASELINE`

## Current manual/batch path — INK-WEB-UI-002

Current entry: `.github/workflows/ink-runtime-batch-windows.yml`.
Only explicit `workflow_dispatch` with `target_ref` may run this batch. Resolve the
ref once; all product/helper/harness bytes come from that exact SHA. Ordinary DEV
pushes must not wake the Windows Runtime runner. Default cadence is 2–4 compatible
Work Orders (target 3), per MR/DEV governance; an explicit Work Order may defer.

The new path uses actions/github-script's bundled Node, bounded Git blob reads,
a checked-in Node HTTP/browser helper, and installed Chrome/Edge. It needs neither
Git nor Node on PATH. The server lives in the helper process; browser children use
`shell: false` and `windowsHide: true`. Preserve per-suite JSON, browser logs and
resolved input hashes as evidence. Never infer Runtime PASS from static checks.

No policy changes/bypass flags, security exclusions, remote PowerShell execution,
or extra child PowerShell consoles are permitted in the current path. Historical
workflow bodies below are retained evidence, not templates for new execution.
The new batch path remains **source-verified only / DEFERRED_TO_BATCH** until MR
schedules and observes a Windows run, including absence of visible extra windows.

## Purpose

This document records the persistent Windows runtime path for INK browser/runtime QA.

It exists to prevent confusion between:

1. GitHub-hosted Actions quota; and
2. the user's own GitHub self-hosted Windows runner.

These are separate resources.

## Authoritative runner baseline

```text
Local runner directory:
C:\actions-runner-ink

Start command:
cd C:\actions-runner-ink
.\run.cmd

Expected state:
Connected to GitHub
Listening for Jobs
```

Known verified runner baseline:

```text
runner version = 2.337.0
runner labels = self-hosted / Windows / X64
PowerShell = Windows PowerShell 5.1
browser = Google Chrome available
```

Repository workflows targeting this machine must use the registered self-hosted labels, normally:

```yaml
runs-on: [self-hosted, Windows, X64]
```

## Critical distinction

```text
GITHUB_HOSTED_ACTIONS_QUOTA_EXHAUSTED
does NOT mean
SELF_HOSTED_WINDOWS_RUNTIME_UNAVAILABLE
```

When GitHub-hosted Actions quota is exhausted:

- do not automatically defer runtime QA;
- first check whether the existing self-hosted Windows runner can execute the required bounded job;
- keep the user's runner window open at `Listening for Jobs`;
- target the self-hosted labels explicitly.

Runtime QA may be marked `DEFERRED_TO_BATCH` when the Current Work Order explicitly authorizes batching. Otherwise, unavailability must be established against the existing self-hosted path before declaring Runtime blocked.

## Existing historical workflow

The repository already contains:

`.github/workflows/ink-v0.1-runtime-baseline.yml`

This workflow is historical proof that INK runtime QA was designed to execute on:

`[self-hosted, Windows, X64]`

New Work Orders should reuse the self-hosted pattern but may create a bounded task-specific workflow when the product/runtime target has changed.

Do not assume the historical workflow's old reconstructed/original-runtime target is automatically appropriate for the current `product/source`.

## Current browser-web runtime pattern

For current INK Web work, prefer:

```text
GitHub bounded workflow
→ self-hosted Windows runner
→ exact task revision
→ local loopback HTTP
→ installed Chrome/Edge
→ browser/runtime evidence
```

Core editor/runtime remains browser-local.

No external proxy such as Val Town is required.

## Windows constraints already observed

The following constraints are known and should not be rediscovered from scratch:

### No Git installed on user machine

The self-hosted runner can still operate.

Do not require manual `git --version` or `git status` as a prerequisite for using the runner.

A workflow may need a Git-free exact-revision materialization route if `actions/checkout` falls back to ZIP and encounters Windows-specific extraction problems.

### ExecutionPolicy

Do not change user-wide or machine-wide execution policy. Do not use bypass
flags, including custom GitHub Actions PowerShell shell templates. The active
batch uses Node actions/helpers and requires no PowerShell execution at all.

### Windows MAX_PATH

The repository contains historical QA paths long enough to exceed traditional Windows extraction limits.

For runtime-only jobs, use bounded materialization of the exact directories required by the task rather than extracting the entire repository if necessary.

For INK Web runtime, the bounded payload may include:

```text
product/source/**
qa/runtime/**
qa/fixtures/<required fixture>/**
```

### Background process lifetime

Do not assume a locally started HTTP server will survive across separate GitHub Actions steps on the self-hosted runner.

For deterministic runtime QA, keep:

```text
start local server
→ HTTP preflight
→ browser smoke
→ stop server
```

inside one workflow step when required.

## Verified INK-CLOUD-018 preflight

Successful run:

`35574792555`

Exact tested SHA:

`1b0740126ccf712a4c500681b625b78d5606b83d`

Verified:

```text
SELF_HOSTED_WINDOWS_RUNTIME = PASS
POWERSHELL_RUNTIME_PATH = PASS
BOUNDED_EXACT_SHA_MATERIALIZATION = PASS
LOOPBACK_HTTP = PASS
ES_MODULE_MIME = PASS
MANIFEST = PASS
SERVICE_WORKER_ASSET = PASS
CHROME_HEADLESS_RENDER = PASS
INK_SHELL_RENDER = PASS
CREATIVE_WORKSPACE_MOUNT = PASS
```

A subsequent checkpoint run also passed after recording the result.

## Default decision order

Before declaring runtime blocked:

```text
1. Is C:\actions-runner-ink already configured?
2. Is .\run.cmd showing Connected / Listening for Jobs?
3. Can the Work Order use [self-hosted, Windows, X64]?
4. Can the current product target be tested with a bounded self-hosted workflow?
5. Only then consider manual fallback or RUNTIME_QA_DEFERRED.
```

Do not rebuild or replace the runner path unless a concrete failure requires it.
