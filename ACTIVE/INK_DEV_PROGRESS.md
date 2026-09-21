# INK DEV PROGRESS

STATUS: `AUTHORIZED / NOT_STARTED`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-018` |
| TITLE | `First Visible Web Platform + Rose Window Runtime v0.1` |
| BRANCH | `work/ink-cloud-018` |
| BASE_MAIN | `f964ee758d8d3db31ad1054eb0de046de4e1b53d` |
| TASK_STATUS | `AUTHORIZED / NOT_STARTED` |
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
