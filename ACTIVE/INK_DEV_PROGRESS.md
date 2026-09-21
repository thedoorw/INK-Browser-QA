# INK DEV PROGRESS

STATUS: `MR_PRE_RUNTIME_PREP_COMPLETE / AWAITING_USER_POWERSHELL_PREFLIGHT`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-018` |
| TITLE | `First Visible Web Platform + Rose Window Runtime v0.1` |
| BRANCH | `work/ink-cloud-018` |
| BASE_MAIN | `f964ee758d8d3db31ad1054eb0de046de4e1b53d` |
| TASK_STATUS | `PRE_RUNTIME_PREP_COMPLETE / DEV_PRODUCT_WORK_NOT_STARTED` |
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
