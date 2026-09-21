# INK-CLOUD-018 Windows Runtime Runbook

Purpose: execute INK browser/runtime QA on the user's existing Windows self-hosted runner because GitHub-hosted Actions quota is exhausted.

## Authoritative runtime path

The user already has a configured GitHub self-hosted runner:

```text
C:\actions-runner-ink
→ .\run.cmd
→ Connected to GitHub
→ Listening for Jobs
```

This is the preferred 018 runtime path.

The runner executes on the user's Windows machine, so browser/runtime evidence comes from the real target environment rather than a GitHub-hosted runner.

## Important distinction

```text
GitHub-hosted Actions quota = exhausted
self-hosted Windows runner = available
```

Do not substitute Val Town or another external proxy.

A manual PowerShell loopback-server path remains available only as a fallback if workflow dispatch is unavailable.

## Step 1 — keep the runner online

Open Windows PowerShell:

```powershell
cd C:\actions-runner-ink
.\run.cmd
```

Expected:

```text
Connected to GitHub
Listening for Jobs
```

Keep this window open.

## Step 2 — DEV/MR prepares a bounded self-hosted runtime workflow

The workflow must target the existing Windows self-hosted runner and must not use a GitHub-hosted image.

Required runner selection should match the repository's registered runner labels, typically including:

```yaml
runs-on: [self-hosted, Windows]
```

If a repository-specific label exists, use it as well.

The job should:

1. check out the exact `work/ink-cloud-018` revision;
2. start the INK static site locally on loopback;
3. run HTTP/static preflight;
4. execute browser/runtime QA using an installed Chrome/Edge-compatible browser where automation is available;
5. record runtime evidence to branch evidence/report files or emit a deterministic handoff artifact for MR review;
6. never commit secrets;
7. stop after the bounded 018 QA scope.

## Step 3 — manual PowerShell fallback

If workflow dispatch itself is unavailable, use the branch scripts locally from an extracted/current source tree:

- `qa/runtime/start-ink-local.ps1`
- `qa/runtime/check-ink-local.ps1`

Start:

```powershell
powershell -ExecutionPolicy Bypass -File .\qa\runtime\start-ink-local.ps1
```

Preflight in another PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\qa\runtime\check-ink-local.ps1
```

Default URL:

`http://127.0.0.1:4173/`

## Runtime evidence required

```text
SELF_HOSTED_RUNNER = ONLINE
RUNNER_VERSION =
RUNNER_LABELS =
EXACT_BRANCH_HEAD =
LOCAL_URL =
HTTP_PREFLIGHT =
BROWSER =
INK_SHELL =
CANVAS =
CREATIVE_WORKSPACE =
IMAGE_IMPORT =
CONSOLE_FATAL_ERRORS =
SERVICE_WORKER =
ROSE_WINDOW_IMPORT =
DIRECT_EXTRACTION =
OVERLAY =
EDITABLE_PATH =
STRUCTURE_AWARE =
CHAT_CONTEXT =
CHAT_APPROVAL_BOUNDARY =
REVISION_CAPTURE_RESTORE =
NOTES =
```

## Security / architecture rules

- No API key in repository.
- No external proxy.
- No second editor/document authority.
- Browser-local INK core remains authoritative.
- Remote AI remains optional.
- `package/ink-current` is not mutated by this runtime path.
