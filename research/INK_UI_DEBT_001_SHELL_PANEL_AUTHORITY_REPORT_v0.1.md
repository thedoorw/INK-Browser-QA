# INK-UI-DEBT-001 — Shell / Panel Authority Report v0.1

STATUS: RUNTIME_BLOCKED / STOP

TASK_ID: INK-UI-DEBT-001
BRANCH: work/ink-ui-debt-001
BASE_MAIN: 4c1834fdb1b93c843e15455f6468e39bceef8ef1
LAST_RUNTIME_TESTED_SHA: 0207b647ecf41d872abd7ba37ab27bdd541999ff
RUNTIME_RUN: 35806396592
TINYFISH_USED: NO

## 1. Before authority map

Desktop primary-panel behavior had overlapping authority:

- `product/source/web-shell.js`
  - Dock routing;
  - contextual Advanced routing;
  - primary-panel selection;
  - Chevron collapse/restore behavior.
- `product/source/src/ink.js`
  - independently bound `#inspectorEdgeToggle`;
  - independently bound `#closeInspector`;
  - directly opened Inspector from object-context flows;
  - tool changes could change Inspector tab state independently of Dock selection.
- Creative Workspace retained its own controller-level `setOpen` / `setStage` implementation.
- CSS desktop shell geometry was spread across Phase-1, UI-004, UI-005, MAINT-001 and MAINT-002 late rules, including contradictory Chevron and Inspector-tab geometry.

Observed debt matched the Work Order:
- fresh primary panel could appear open;
- close authority was unreliable;
- Chevron could occupy the Dock edge;
- Advanced / Dock Properties / legacy Inspector logic competed;
- Layers / History were duplicated at Dock and Inspector navigation levels;
- late CSS overrides described mutually incompatible geometry.

## 2. After authority map

Desktop routing is consolidated around one shell state model in `web-shell.js`:

```text
collapsed
properties
layers
history
reference
compose
chat
revision
```

Responsibilities:

- `web-shell.js`
  - authoritative desktop open/close state;
  - authoritative active primary-panel selection;
  - Dock routing;
  - contextual Advanced routing;
  - Chevron collapse / restore-last-panel behavior;
  - Inspector / Creative mutual exclusion;
  - stage reserve measurement via `--active-panel-w`.
- `src/ink.js`
  - editor/runtime semantics remain intact;
  - desktop object-context requests route to `INK_WEB_SHELL.open('properties')`;
  - no independent desktop Chevron or Inspector-close event ownership;
  - mobile Inspector behavior remains separate.
- Creative Workspace controller
  - remains the existing content/stage implementation;
  - does not become a second desktop shell authority.
- CSS
  - accepted desktop geometry is consolidated into the single
    `INK-UI-DEBT-001 — SINGLE DESKTOP SHELL AUTHORITY` region.

## 3. Removed duplicate event owners

Removed from legacy desktop `ink.js` ownership:

- `#inspectorEdgeToggle.onclick`;
- `#closeInspector.onclick`.

The shell binds the Chevron once with an idempotent `data-shell-collapse-bound` guard and `addEventListener`.

Result:
- PRIMARY_PANEL_AUTHORITY = SINGLE
- COMPETING_PANEL_EVENT_OWNERS = 0

## 4. Removed duplicate navigation

Inspector top-level navigation no longer duplicates Dock Layers / History.

Properties sub-navigation is explicitly limited to:

- Tool;
- Object;
- AI;
- Core.

Layers and History content surfaces remain present, but are selected directly by Dock routes.

Result:
- DUPLICATE_PANEL_NAVIGATION = 0

## 5. CSS consolidation inventory

Consolidated desktop authority now owns:

- topbar;
- stage-wrap;
- left tool rail;
- panel Dock;
- Inspector;
- Creative Workspace primary panel;
- primary-panel Chevron;
- Properties sub-navigation;
- panel body containment;
- desktop breakpoint deltas.

Removed / neutralized contradictory patterns include:

- global Chevron `right:0!important`;
- legacy open-state Chevron translation;
- obsolete `repeat(4)` Inspector-tab grid;
- global desktop Inspector-tab horizontal overflow;
- earlier Phase-1 primary-panel placement authority;
- earlier Phase-4 creative-panel width authority;
- separate MAINT-001 / MAINT-002 late desktop authority blocks.

Mobile-specific behavior remains outside the desktop authority.

## 6. Fresh-entry state

Fresh desktop entry is explicitly:

```text
activePanel = collapsed
Inspector = closed
Creative Workspace = closed
canvas = Dock-only reserve
```

Only last selected panel identity may persist.
Open/closed state is not restored.

Expected transition examples:

| Input | From | To |
| --- | --- | --- |
| Dock Properties | collapsed | properties |
| Dock Layers | any primary state | layers |
| Dock History | any primary state | history |
| Dock Reference | any primary state | reference |
| Advanced | collapsed | properties |
| Advanced | properties | collapsed |
| Chevron | expanded | collapsed |
| Chevron | collapsed | last selected panel |
| Creative route | Inspector route | selected Creative route only |
| Inspector route | Creative route | selected Inspector route only |

## 7. Chevron geometry

Desktop Chevron geometry is owned by the consolidated authority:

```css
right: calc(var(--panel-dock-w) + var(--active-panel-w));
width: 18px;
```

This places the control on the canvas / primary-panel boundary:

```text
Canvas | < | Primary Panel | Dock
```

The Runtime harness was hardened to verify:
- Chevron right edge remains outside the Dock hit area;
- Dock Properties remains fully inside the Dock bounds;
- Dock Properties can be clicked after collapse;
- Chevron reopens the last selected Properties panel.

These browser assertions are written but could not be executed because PowerShell was blocked before the harness started.

## 8. Source / static / unit / parity evidence

Final pre-runtime run:
- Run: `35806396592`
- Tested SHA: `0207b647ecf41d872abd7ba37ab27bdd541999ff`
- bounded exact-SHA materialization: PASS
- source/static: PASS
- focused unit/parity: 39 / 39 PASS
- failures: 0
- Web / Portable parity: PASS
- FORMAT_VERSION: 4 preserved
- product base version: v0.1 preserved
- favicon contract: `assets/favicon.svg` preserved

An earlier run `35806247844` stopped at 37 / 39 because two old regression tests still described superseded source spelling / favicon mutation. Those guards were corrected; no product implementation change was required for those two failures.

## 9. Runtime evidence

Run `35806396592` correctly started the PowerShell Runtime step only after pre-runtime PASS.

The self-hosted Windows runner then rejected the generated GitHub Actions temporary PowerShell script before the Runtime body could execute:

```text
PSSecurityException
running scripts is disabled on this system
```

Consequences:
- PowerShell Runtime body: NOT EXECUTED
- loopback browser server: NOT STARTED by the step
- Chrome/Edge UI harness: NOT EXECUTED
- Runtime visual assertions: NOT EXECUTED
- RUNTIME_QA: BLOCKED

Current Runtime governance prohibits changing user/machine Execution Policy and prohibits `ExecutionPolicy Bypass`.

Therefore:

```text
RUNTIME_BLOCKED → STOP
```

No Runtime PASS is inferred from static or unit evidence.

## 10. Exact changed-file list

Relative to task base `4c1834fdb1b93c843e15455f6468e39bceef8ef1`, this branch contains task/governance, implementation, QA and evidence changes in:

1. `.github/workflows/ink-ui-debt-001-branch-runtime.yml`
2. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
3. `ACTIVE/INK_DEV_PROGRESS.md`
4. `product/source/index-standalone.html`
5. `product/source/index.html`
6. `product/source/src/ink.js`
7. `product/source/styles.css`
8. `product/source/web-shell.js`
9. `qa/core/tests/unit/contextual-tool-options-v0.1.test.mjs`
10. `qa/core/tests/unit/final-ui-responsive-regression-v0.1.test.mjs`
11. `qa/core/tests/unit/panel-chat-polish-v0.1.test.mjs`
12. `qa/core/tests/unit/photoshop-shell-geometry-v0.1.test.mjs`
13. `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`
14. `qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs`
15. `qa/core/tests/unit/ui-maint-002-readability-panel-favicon-v0.1.test.mjs`
16. `qa/runtime/ink-web-ui-001-harness.html`
17. `research/INK_UI_DEBT_001_SHELL_PANEL_AUTHORITY_REPORT_v0.1.md`

No Renderer / WebGL / Canvas engine, document schema, migration, History semantics, Revision semantics, Recipe / Geometry, CHAT execution semantics, Core contracts, package/certification or product base-version mutation was introduced by the UI cleanup implementation.

## 11. Terminal status

```text
TASK_STATUS = RUNTIME_BLOCKED
TASK_ID = INK-UI-DEBT-001
BRANCH = work/ink-ui-debt-001

PRIMARY_PANEL_AUTHORITY = SINGLE
COMPETING_PANEL_EVENT_OWNERS = 0
DEFAULT_PANEL_STATE = COLLAPSED
CANVAS_FIRST_ENTRY = SOURCE_UNIT_PASS
PANEL_COLLAPSE_CONTROL = SINGLE_CHEVRON
DUPLICATE_PANEL_NAVIGATION = 0
CSS_SHELL_AUTHORITY = SINGLE
CONTEXTUAL_ADVANCED_AUTHORITY = SHARED
FAVICON = PRESERVED_PASS
PORTABLE_WEB_PARITY = PASS
SOURCE_STATIC_UNIT_PARITY = PASS
RUNTIME_QA = BLOCKED
RUNTIME_BLOCK_REASON = WINDOWS_POWERSHELL_EXECUTION_POLICY
TINYFISH_USED = NO
CORE_MUTATION = 0
PACKAGE_MUTATION = 0
DEV_HANDOFF = NOT_REACHED
NEXT_ACTION = STOP
```
