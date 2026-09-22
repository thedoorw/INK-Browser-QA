# INK DEV PROGRESS

STATUS: `INK-WEB-UI-001 / IN_PROGRESS`

| Field | Value |
|---|---|
| TASK_ID | `INK-WEB-UI-001` |
| TITLE | `Photoshop-Aligned Workspace Shell & Collapsible Panel Dock v0.1` |
| BRANCH | `work/ink-web-ui-001` |
| BRANCH_BASE | `e00ff4edd81ab659e62a87d700bcbb9fc6dd465d` |
| TASK_STATUS | `IN_PROGRESS` |
| CURRENT_PHASE | `PHASE_D / WEB_IDENTITY_AND_CACHE` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `INK_WEB_UI_PHASE1_SOURCE_COMPLETE` |
| FORMAT_VERSION | `4 / PRESERVE` |
| WEB_DISPLAY_VERSION | `INK v0.1 · Web / REQUIRED` |
| PORTABLE_DISPLAY_VERSION | `INK v0.1 · Portable / REQUIRED` |
| UI_SHELL_SCOPE | `SHARED PORTABLE + WEB/CLOUD` |
| FAVICON | `USER ORIGINAL MARK / REQUIRED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_BATCH` |

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
- Phase D — v0.1 Portable/Web identity + INK mark + favicon + cache identity
- Phase E — regression closure + Runtime batch registration

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
WEB_DISPLAY_VERSION = INK v0.1 · Web
PORTABLE_DISPLAY_VERSION = INK v0.1 · Portable
UI_SHELL = shared Portable/Web
FORMAT_VERSION = 4
FAVICON = user original mark
PUBLIC_STAGING = unchanged until MR promotion to main
```


## Checkpoint — Phase A

```text
GATE = UI_SHELL_INVENTORY_COMPLETE / PASS
IMPLEMENTATION_HEAD = 894dc85da0e1cd6266663e67a4644d51afb463db
FILES_CHANGED =
  research/INK_WEB_UI_PHASE1_IMPLEMENTATION_REPORT_v0.1.md
CHECKS =
  exact shell DOM/hook inventory
  Creative Workspace controller entry-point audit
  keyboard shortcut regression map
  responsive/mobile rule inventory
  FORMAT_VERSION authority confirmed = 4
BLOCKER = NONE
NEXT = PHASE_B / CANVAS_FIRST_SHELL
```

Containment decision:

- preserve existing command-bearing DOM IDs and data attributes;
- reorganize presentation rather than duplicate document/editor state;
- use existing Inspector and Creative Workspace controllers as right-panel content authorities;
- use `#stageWrap` geometry + existing ResizeObserver for canvas recentering;
- keep the new desktop dock presentation separate from existing mobile fallback.


## Checkpoint — Phase B + C

```text
GATES =
  WEB_WORKSPACE_SHELL_ALIGNED / PASS_SOURCE_STATIC
  COLLAPSIBLE_PANEL_DOCK_WORKS / PASS_SOURCE_STATIC
IMPLEMENTATION_HEAD = 81584872319f7b433e717f496770d33d971b9e9f
EVIDENCE_HEAD = 36b10460495402172fe944a6988e3395124b4f65
FILES_CHANGED =
  product/source/assets/ink-mark.svg
  product/source/web-shell.js
  product/source/styles.css
  product/source/src/editor/creative-workspace.js
  product/source/index.html
  product/source/index-standalone.html
  research/INK_WEB_UI_PHASE1_IMPLEMENTATION_REPORT_v0.1.md
CHECKS =
  web-shell syntax / PASS
  command DOM identity preservation / PASS
  dock entry contract / PASS
  single-primary-panel contract / PASS
  measured canvas-width contract / PASS
  mobile breakpoint containment / PASS
  Creative Workspace default collapsed / PASS
  FORMAT_VERSION = 4 / PASS
BLOCKER = NONE
NEXT = PHASE_D / WEB_IDENTITY_AND_CACHE
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-WEB-UI-001
BRANCH = work/ink-web-ui-001
FINAL_HEAD = <exact SHA>
GATE = INK_WEB_UI_PHASE1_SOURCE_COMPLETE
FORMAT_VERSION = 4 / PRESERVED
WEB_DISPLAY_VERSION = INK v0.1 · Web
FAVICON = PRESENT
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
BROWSER_RUNTIME_QA = DEFERRED_TO_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Scope correction

USER clarified after package issuance:

```text
The Photoshop-aligned UI is shared by Portable and Web/Cloud.
Do not implement it as a Web-only fork.
```

Required shell alignment:

- `product/source/index.html`
- `product/source/index-standalone.html`
- shared CSS / UI behavior

Only the supplementary delivery label differs.


## Runtime cadence update

USER changed project cadence:

```text
Every Work Order:
  source/static/unit checks = REQUIRED
  full browser Runtime = NOT REQUIRED

Runtime batch:
  2–4 compatible Work Orders
  default target = 3
```

This task is runtime-deferred unless a high-risk trigger appears.
