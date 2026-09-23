# INK CURRENT WORK ORDER

STATUS: INK-UI-DEBT-001 / UR_AUTHORIZED / DEV_READY

TASK_ID: INK-UI-DEBT-001
TITLE: Shell / Panel Authority Consolidation v0.1
BRANCH: work/ink-ui-debt-001
BASE_MAIN: 4c1834fdb1b93c843e15455f6468e39bceef8ef1
AUTHORITY: USER_DIRECT_UI_DEBT_CLEANUP / UR

RUNTIME_QA: REQUIRED_BEFORE_UI_PASS
PORTABLE_WEB_PARITY: REQUIRED
FORMAT_VERSION: 4 / PRESERVE
PRODUCT_BASE_VERSION: v0.1 / PRESERVE
PACKAGE_MUTATION: 0 / PROHIBITED
CORE_MUTATION: 0 / PROHIBITED

## Purpose

Clear accumulated desktop UI shell / primary-panel technical debt before further visual tuning.

This is NOT a feature workpack.
Do not add new UI capabilities.
Do not broaden product scope.

The goal is to reduce competing authorities, duplicate navigation and CSS override layering so the current UI can be reasoned about from one clean shell model.

## User-confirmed regressions to eliminate

Current main exhibits:
- primary panel unexpectedly open on fresh entry;
- right panel cannot reliably close;
- global chevron overlaps / occludes Dock Properties;
- contextual Advanced / Dock Properties / legacy Inspector logic compete;
- Dock navigation and internal Inspector navigation duplicate Layers / History;
- prior CSS overrides produced impossible Inspector tab geometry;
- UI Runtime could pass while visible shell remained wrong.

These are technical-debt symptoms, not isolated cosmetic defects.

## A. Single desktop primary-panel authority — HARD GATE

Required target:

```text
PRIMARY PANEL STATE
  collapsed
  properties
  layers
  history
  reference
  compose
  chat
  revision
```

Desktop authority rules:
- exactly one controller owns primary panel open/close state;
- exactly one controller owns active primary panel selection;
- `web-shell.js` may own desktop shell routing;
- legacy `ink.js` Inspector event bindings must not independently override the same desktop control;
- no duplicate `onclick` authority on the same collapse control;
- Creative Workspace and Inspector must not both be open;
- no simulated-click chaining as an authority bridge.

Gate:
`PRIMARY_PANEL_AUTHORITY = SINGLE`
`COMPETING_PANEL_EVENT_OWNERS = 0`

## B. Fresh-entry state — HARD GATE

Desktop fresh entry:
- primary panel starts collapsed;
- canvas-first view;
- last selected panel identity may be remembered;
- open/closed state must NOT be restored automatically;
- Reference / Properties / other panels must not auto-open unless explicitly required by a user action.

Gate:
`DEFAULT_PANEL_STATE = COLLAPSED`
`CANVAS_FIRST_ENTRY = PASS`

## C. Chevron authority and placement — HARD GATE

Chevron semantics:
- only open/close the whole primary panel;
- when collapsed, reopen last selected panel;
- when expanded, collapse current primary panel;
- must not select a different content type.

Placement:
- visually located at the canvas / primary-panel boundary;
- must not overlap any Dock button;
- Properties must remain fully visible and clickable;
- no z-index occlusion of Dock actions.

Target visual grammar:

```text
Canvas | < | Primary Panel | Dock
```

Gate:
`PANEL_COLLAPSE_CONTROL = SINGLE_CHEVRON`
`DOCK_OCCLUSION = 0`

## D. Primary navigation de-duplication — HARD GATE

Current debt:
Dock exposes Properties / Layers / History while Inspector also exposes Layers / History tabs.

Required:
- one primary navigation layer only;
- Dock items select primary content;
- do not duplicate Layers / History as a second navigation layer inside the same primary panel;
- internal controls may exist only when they represent sub-navigation unique to that panel;
- Tool/Object/AI/Core content must be organized under an explicit Properties/internal substructure that does not duplicate Dock-level destinations.

Allowed architecture examples:
- Dock Properties opens a Properties surface with contextual subsections/tool-object modes;
- Dock Layers opens Layers directly;
- Dock History opens History directly.

Not allowed:
`Dock Layers → Inspector → Layers tab`

Gate:
`DUPLICATE_PANEL_NAVIGATION = 0`

## E. Inspector / panel geometry cleanup — HARD GATE

Remove impossible or conflicting geometry.

Requirements:
- no fixed 31px container attempting to hold two rows of 26px tabs;
- header/body geometry must be explicit;
- body owns vertical scroll;
- horizontal overflow = 0;
- panel must remain usable at 1280x1024, 1280x800, 960x800 and short desktop height;
- if internal Properties sub-navigation is needed, its geometry must be one row or otherwise explicitly sized.

Gate:
`RIGHT_PANEL_HEADER_GEOMETRY = PASS`
`RIGHT_PANEL_CONTENT_CONTAINMENT = PASS`
`HORIZONTAL_PANEL_OVERFLOW = 0`

## F. CSS authority consolidation — HARD GATE

Do NOT append another late override block as the main solution.

Required:
- identify all desktop shell rules affecting:
  - topbar;
  - stage-wrap;
  - panel-dock;
  - inspector;
  - creative-workspace-panel;
  - primary panel collapse control;
  - inspector tabs/navigation;
- consolidate accepted desktop values into one clear authority region;
- remove, merge or neutralize obsolete contradictory rules where safe;
- media-query-specific differences must be intentional and documented;
- keep mobile behavior separate and intact;
- no broad theme rewrite.

Gate:
`CSS_SHELL_AUTHORITY = SINGLE`
`OBSOLETE_CONTRADICTORY_DESKTOP_RULES = 0`

## G. Contextual Advanced behavior — HARD GATE

Advanced remains a contextual route, not an independent panel system.

Required:
- pressing Advanced opens/selects Properties for current tool/object context;
- pressing again while that same contextual Properties surface is active may collapse it;
- active visual state mirrors the single panel authority;
- closing via Chevron clears Advanced active state;
- selecting another Dock panel clears Advanced active state.

Gate:
`CONTEXTUAL_ADVANCED_AUTHORITY = SHARED`

## H. Preserve Favicon

Current minimal favicon is accepted.

Do not regress:
- local `assets/favicon.svg`;
- HTTP success;
- light-blue + white Y mark.

Gate:
`FAVICON = PRESERVED_PASS`

## I. Web / Portable parity — HARD GATE

All structure changes must remain synchronized between:
- `product/source/index.html`
- `product/source/index-standalone.html`

Shared shell behavior must remain shared.

Gate:
`PORTABLE_WEB_PARITY = PASS`

## J. Tests must become architecture-aware

Add / update focused tests that fail if:
- fresh entry opens a panel;
- collapse control has competing desktop handlers;
- Chevron overlaps the Dock hit area;
- Dock Properties is occluded;
- Layers / History are duplicated at both Dock and internal top-level navigation;
- multiple primary panels are open;
- stage reserve does not return to Dock-only width after collapse;
- CSS contains known contradictory shell-authority patterns;
- Web / Portable diverge.

Do not accept tests that only prove:
- element exists;
- `overflow-y:auto`;
- scroll can reach the bottom.

## K. Runtime

Complete the whole implementation and source/static/unit/parity checks first.

Then run final Windows PowerShell/self-hosted Runtime.

Runtime must verify:
- fresh load = collapsed;
- open Properties;
- close via Chevron;
- reopen via Chevron;
- Dock Properties remains clickable;
- switch Properties → Layers → History → Reference → other creative panels;
- only one primary surface visible at once;
- Advanced route and active state;
- 1280x1024;
- 1280x800;
- 960x800;
- short-height desktop;
- Web / Portable parity guards;
- no TinyFish.

**DO NOT use TinyFish.**

If PowerShell Runtime cannot execute:
`RUNTIME_BLOCKED → STOP`

## Hard boundaries

Do NOT modify:
- Renderer / WebGL / Canvas engine;
- Document schema / migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry;
- Core contracts;
- CHAT proposal/approval/execution semantics;
- persistence semantics;
- package/certification;
- base version.

If cleanup requires one of these:
`INTEGRATION_REQUIRED → STOP → MR`

## Expected payload

Likely:
- `product/source/web-shell.js`
- narrowly bounded desktop shell event cleanup in `product/source/src/ink.js`
- `product/source/styles.css`
- `product/source/index.html`
- `product/source/index-standalone.html`
- focused unit/runtime QA
- evidence report

Do not mutate unrelated Core files.

## Evidence report

Create:

`research/INK_UI_DEBT_001_SHELL_PANEL_AUTHORITY_REPORT_v0.1.md`

Must include:
- before authority map;
- after authority map;
- removed duplicate event owners;
- removed duplicate navigation;
- CSS consolidation inventory;
- exact fresh-entry state;
- Chevron geometry;
- panel state transition matrix;
- Web / Portable parity;
- Runtime evidence;
- exact changed-file list.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-UI-DEBT-001
BRANCH = work/ink-ui-debt-001
FINAL_HEAD = <SHA>

PRIMARY_PANEL_AUTHORITY = SINGLE
COMPETING_PANEL_EVENT_OWNERS = 0
DEFAULT_PANEL_STATE = COLLAPSED
CANVAS_FIRST_ENTRY = PASS
PANEL_COLLAPSE_CONTROL = SINGLE_CHEVRON
DOCK_OCCLUSION = 0
DUPLICATE_PANEL_NAVIGATION = 0
RIGHT_PANEL_HEADER_GEOMETRY = PASS
RIGHT_PANEL_CONTENT_CONTAINMENT = PASS
HORIZONTAL_PANEL_OVERFLOW = 0
CSS_SHELL_AUTHORITY = SINGLE
CONTEXTUAL_ADVANCED_AUTHORITY = SHARED
FAVICON = PRESERVED_PASS
PORTABLE_WEB_PARITY = PASS
RUNTIME_QA = PASS
TINYFISH_USED = NO
CORE_MUTATION = 0
PACKAGE_MUTATION = 0
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
```
