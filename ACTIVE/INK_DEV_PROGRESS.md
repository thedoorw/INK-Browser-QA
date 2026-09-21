# INK DEV PROGRESS

STATUS: `PRE_RUNTIME_ENVIRONMENT_VERIFIED / READY_FOR_DEV_PRODUCT_INTEGRATION`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-018` |
| TITLE | `First Visible Web Platform + Rose Window Runtime v0.1` |
| BRANCH | `work/ink-cloud-018` |
| BASE_MAIN | `f964ee758d8d3db31ad1054eb0de046de4e1b53d` |
| TASK_STATUS | `PRE_RUNTIME_ENVIRONMENT_VERIFIED / DEV_PRODUCT_INTEGRATION_READY` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `INK_WEB_FIRST_VISIBLE_PLATFORM_WORKS` |
| DEFAULT_EXTRACTION | `DIRECT_EXTRACTION` |
| STRUCTURE_AWARE | `OPTIONAL` |
| FORMAT_VERSION | `4 / NO_CHANGE_EXPECTED` |
| PACKAGE_INK_CURRENT_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| BROWSER_RUNTIME_QA | `REQUIRED_FOR_GATE` |

## Objective

Turn the already implemented browser/editor/Creative Workspace/CHAT core into the first visible INK Web platform.

```text
static web URL
→ visible INK workspace
→ reference image import
→ Direct Extraction + editable Path + overlay
→ optional Structure-Aware reconstruction
→ visible natural-language CHAT surface
→ bounded approval/execution
→ Revision
→ Rose Window first runtime case
```

This task does not build Figma parity or multi-user collaboration.

## Existing baseline to reuse

- `product/source/index.html`
- `product/source/src/ink.js`
- `product/source/src/editor/creative-workspace.js`
- `product/source/src/ai/chat-runtime.js`
- accepted extraction / Path / compose / repaint / Revision controllers
- accepted Structure-Aware multi-Path implementation

Do not create a second editor or document authority.

## Planned phases

- Phase A — existing-web audit + deployment closure plan
- Phase B — first visible web shell
- Phase C — visible conversational CHAT surface
- Phase D — Rose Window first visible runtime case
- Phase E — static deployment preparation
- Phase F — real browser runtime QA
- Phase G — report + DEV handoff

## Checkpoint rule

At every meaningful checkpoint:

- commit;
- update this branch-local file;
- record exact SHA;
- record files changed;
- record checks actually executed;
- record browser/runtime evidence;
- record anything not executed;
- STOP on Work Order Hard STOP.

Final gate cannot close with browser runtime QA deferred.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-018
BRANCH = work/ink-cloud-018
FINAL_HEAD = <exact SHA>
GATE = INK_WEB_FIRST_VISIBLE_PLATFORM_WORKS
DEFAULT_EXTRACTION = DIRECT_EXTRACTION
STRUCTURE_AWARE = OPTIONAL
FORMAT_VERSION = 4
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
BROWSER_RUNTIME_QA = EXECUTED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## MR pre-runtime preparation checkpoint

Prepared before asking the user to execute anything on the local Windows machine:

- audited current static browser entry and hosting assumptions;
- confirmed existing image import, Creative Workspace, extraction, CHAT runtime and Revision sources;
- confirmed manifest / Service Worker use relative static scope;
- confirmed required legacy shell files referenced by Service Worker exist;
- recorded version/cache drift requiring bounded 018 fix before deployment;
- added a dependency-free PowerShell/.NET loopback static server;
- added local HTTP/MIME/browser preflight;
- added Windows runtime runbook;
- added pre-runtime audit report.

Artifacts:

- `qa/runtime/start-ink-local.ps1`
- `qa/runtime/check-ink-local.ps1`
- `qa/runtime/INK_CLOUD_018_POWERSHELL_RUNTIME_RUNBOOK.md`
- `research/INK_FIRST_VISIBLE_WEB_PLATFORM_PRE_RUNTIME_AUDIT_v0.1.md`

Current boundary:

```text
MR_PRE_RUNTIME_PREP = COMPLETE
GITHUB_ACTIONS = NOT_REQUIRED
USER_MACHINE_RUNTIME = NOT_YET_EXECUTED
POWERSHELL_PREFLIGHT = NEXT
DEV_PRODUCT_INTEGRATION = NOT_STARTED
BROWSER_RUNTIME_QA = NOT_YET_EXECUTED
```

The PowerShell scripts were statically reviewed after correcting the required `param(...)` declaration order. This environment does not provide Windows PowerShell, so actual script execution is intentionally reserved for the user's Windows machine.

Known pre-deployment fix registered for later DEV phase:

```text
config.js INK_VERSION = 1.6.5-RC
index.html visible version = 1.5.1 RC
service-worker.js RELEASE_VERSION = 1.5.1
```

Do not declare the 018 runtime gate until user-machine PowerShell/browser evidence is recorded.


## User runtime correction

The user's existing Windows self-hosted GitHub runner is confirmed online:

```text
path = C:\actions-runner-ink
runner version = 2.337.0
state = Connected to GitHub / Listening for Jobs
```

Therefore the primary INK-CLOUD-018 runtime path is:

```text
GitHub bounded workflow
→ self-hosted Windows runner
→ local PowerShell/browser execution
```

The ZIP-first manual path is superseded as the primary method and retained only as fallback.

Next prerequisite before dispatch:

- confirm registered runner labels;
- prepare a bounded 018 self-hosted runtime workflow;
- ensure it targets self-hosted Windows only.


## Self-hosted Windows runtime verification — PASS

Successful workflow run:

`35574792555`

Exact tested branch SHA:

`1b0740126ccf712a4c500681b625b78d5606b83d`

Environment:

```text
RUNNER_NAME = DESKTOP-NSOQH69
RUNNER_VERSION = 2.337.0
RUNNER_LABELS = self-hosted / Windows / X64
POWERSHELL = 5.1.19041.7725
BROWSER = C:\Program Files\Google\Chrome\Application\chrome.exe
GIT = NOT_REQUIRED
NODE = NOT_REQUIRED_FOR_PREFLIGHT
```

Bounded exact-SHA materialization:

```text
product/source/** = MATERIALIZED
qa/runtime/** = MATERIALIZED
qa/fixtures/rose-window/** = MATERIALIZED
file count = 223
```

HTTP/module checks:

```text
/ = 200 text/html
/styles.css = 200 text/css
/src/ink.js = 200 text/javascript
/src/editor/creative-workspace.js = 200 text/javascript
/src/ai/chat-runtime.js = 200 text/javascript
/manifest.webmanifest = 200 application/manifest+json
/service-worker.js = 200 text/javascript
PRECHECK = PASS
```

Real Chromium smoke:

```text
INK_SHELL_RENDERED = PASS
CREATIVE_WORKSPACE_MOUNTED = PASS
CREATIVE_WORKSPACE_TOGGLE_MOUNTED = PASS
```

Runtime path decision:

```text
PRIMARY_RUNTIME = SELF_HOSTED_WINDOWS_RUNNER
GITHUB_HOSTED_RUNNER = DO_NOT_USE
VAL_TOWN_OR_EXTERNAL_PROXY = DO_NOT_USE
MANUAL_LOCAL_POWERSHELL = FALLBACK_ONLY
```

This checkpoint verifies the Windows/PowerShell/HTTP/Chromium execution environment only. It does not yet close the full INK-CLOUD-018 product gate.

Next:

`DEV_PRODUCT_INTEGRATION_READY`


## Phase B — first visible web shell checkpoint

Product checkpoint SHA:

`f8ca3f2c3e99d6937d2459fd84d0e2517fee9616`

Implemented:

- retained `product/source/index.html` as the single browser/editor entrypoint;
- retained the existing canvas/editor and Creative Workspace authority;
- kept Creative Workspace open on first mount and made the Reference → Direct Extraction entry explicit;
- aligned visible shell / manifest / Service Worker version identity to `1.6.5-RC`;
- added a bounded `WEB` surface marker only; no duplicate shell or document authority;
- retained no-sign-in static/browser-local startup.

Files changed:

- `product/source/index.html`
- `product/source/manifest.webmanifest`
- `product/source/service-worker.js`
- `product/source/src/editor/creative-workspace.js`
- `product/source/styles.css`

Checks actually executed:

- exact branch source reread through GitHub SSOT;
- manifest `start_url = ./index.html` and `scope = ./` retained;
- Service Worker asset paths remain relative/static-host compatible;
- `FORMAT_VERSION = 4` unchanged;
- `package/ink-current` mutation = 0;
- second editor/document authority = 0.

Runtime note:

The already-verified Windows self-hosted preflight workflow is path-triggered by these product-source changes. Full Phase F runtime acceptance remains pending after Phase C–E integration.

Next:

`PHASE_C_VISIBLE_CONVERSATIONAL_CHAT`


## Phase C — visible conversational CHAT checkpoint

Product checkpoint SHA:

`a4d0951d5d67f472264e626bcd75b1509ac9015a`

Implemented:

- added `INK-CONVERSATION-REQUEST` / `INK-CONVERSATION-RESPONSE` over the accepted CHAT runtime;
- added a visible transcript, natural-language prompt, runtime/provider status and current-document context inspection to Creative Workspace;
- local/manual conversation remains available without any remote service;
- external OpenAI-compatible / HTTP / custom endpoint conversation reuses the existing provider, endpoint and session-only credential contract;
- external text/context transmission requires the existing explicit transmission approval path;
- conversation execution snapshots the authoritative document before/after and rejects any out-of-band document mutation;
- all actual artwork mutation remains delegated to existing bounded-edit / multi-step proposal → approval → execution controls;
- History and Revision authorities are unchanged;
- no model gets direct DOM, Canvas, file-system or credential mutation authority.

Files changed:

- `product/source/src/ai/chat-runtime.js`
- `product/source/src/editor/creative-workspace.js`
- `product/source/styles.css`

Source checks actually executed:

- exact branch source reread after write;
- conversation runtime is additive to the existing plan runtime;
- local client has no external endpoint requirement;
- external request path keeps `credentials: omit` and session credential lookup;
- structured edit execution still requires accepted local approval tokens;
- `FORMAT_VERSION = 4` unchanged;
- committed credential/secret = 0 by implementation path.

Browser execution is reserved for the required Phase F self-hosted Windows run after the Rose Window and deployment preparation are integrated.

Next:

`PHASE_D_ROSE_WINDOW_VISIBLE_RUNTIME`
