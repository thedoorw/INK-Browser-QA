# INK Web UI Phase 1 Implementation Report v0.1

STATUS: `IN_PROGRESS / PHASE_A_COMPLETE`

## Control

| Field | Value |
|---|---|
| TASK | `INK-WEB-UI-001` |
| BRANCH | `work/ink-web-ui-001` |
| BASE | `e00ff4edd81ab659e62a87d700bcbb9fc6dd465d` |
| TARGET | `INK_WEB_UI_PHASE1_COMPLETE` |
| PRODUCT_DISPLAY | `INK v0.1 · Web` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_MUTATION | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |

## Phase A — exact shell inventory

### Authoritative shell files

| Surface | Current role | Regression-sensitive identity |
|---|---|---|
| `product/source/index.html` | modular Web shell | fixed DOM IDs, `data-tool`, `data-tab`, `data-content`, workspace command attributes |
| `product/source/index-standalone.html` | standalone-compatible shell | mirrors the same interactive DOM contract; boots `dist/ink.compat.js` |
| `product/source/styles.css` | responsive shell/layout/panels | `.inspector-open`, mobile breakpoints, tool rail, stage, status, Creative Workspace |
| `product/source/src/ink.js` | editor boot + UI bindings | direct selectors for existing IDs/classes; drawing/document/history authority remains here |
| `product/source/src/editor/creative-workspace.js` | Reference/Edit/Compose/CHAT/Revision UI controller | public `setOpen()` and `setStage()`; capability remains installed when panel is closed |
| `product/source/manifest.webmanifest` | Web app metadata | historical current-product display identity present before this task |
| `product/source/service-worker.js` | shell/runtime cache | historical release/cache namespace present before this task |
| `reference/brand/INK_MARK_SOURCE_W-300.jpg` | user-authoritative Phase-1 mark | source artwork; no visual reinterpretation allowed |

### Shell region / hook map

| Region | Existing hooks / behavior | Phase-1 rule |
|---|---|---|
| Menu strip | `.menu-strip`, `.application-menus`, `#workspaceMenuToggle`, `#workspaceMenu`, `[data-workspace-command]` | preserve application/menu layer; use as compact top-level grammar |
| Topbar | `.topbar`, brand, `#docTitle`, workspace switch, Undo/Redo, file actions, fullscreen, inspector/settings | retain existing commands; visually separate document/app row from contextual options |
| Workspace | `#workspaceSwitch`, `[data-space]`, Ctrl+1 / Ctrl+2 | no workspace-model changes |
| Pages | `#pagesToggle`, `#pagesPanel`, `#pagesList`, `#addPageBtn`, `#closePagesBtn`; `P` shortcut | preserve panel and command binding |
| Tool rail | `.tool-rail`, `#drawToolButton`, `[data-tool]`, `#brushFamilyPopover` | compact presentation only; no drawing-command rewrite |
| Canvas | `#stageWrap`, `#stage`; Renderer uses ResizeObserver on wrapper | shell may resize available viewport; renderer will follow wrapper geometry |
| Empty state | `#emptyHint`, `.empty-mark` | remove/redesign large rounded central mark; retain minimal guidance |
| Quick controls | `#quickControls`, quick color/size/opacity IDs | preserve current controls; broader contextual-control migration deferred |
| Inspector | `#inspector`, `#inspectorToggle`, `#inspectorEdgeToggle`, `#closeInspector`, `#inspectorResizer`, `.inspector-open` | becomes one right-side primary panel surface |
| Inspector tabs | `[data-tab=brush/layers/history/object/ai/studio]` + matching `[data-content]` | preserve all tab contents and identifiers |
| Layers | `#layersList` plus existing add/delete/duplicate/reorder controls | direct dock reachability required; no layer-model change |
| History | `#historyList`, `#historyLimit`, existing HistoryManager | direct dock reachability required; no History semantics change |
| Creative Workspace | `#creativeWorkspaceToggle`, injected `#creativeWorkspace`; controller `setOpen()/setStage()` | collapsed by default; dock can summon stages without removing controller |
| Reference | Creative Workspace stage `reference` | direct dock entry to same controller |
| Compose | Creative Workspace stage `compose` | direct dock entry to same controller |
| CHAT | Creative Workspace stage `chat`; underlying `app.chatBoundedEdit` / plan controller | closing UI must not disable CHAT/document capability |
| Revision | Creative Workspace stage `revision`; underlying `app.revisions` | direct dock entry; controller remains installed when hidden |
| Fullscreen | `#fullscreenToggle`, Ctrl+Shift+F, `toggleFullscreen()` | preserve |
| New/Open/Save/Export | `#newBtn`, `#openBtn`, `#saveBtn`, `#exportBtn`, project/export inputs/dialog | preserve |
| Status | `.statusbar`, zoom/document/tool state | reduce visual noise only; retain actionable state |
| Mobile/narrow | existing <=1120px and <=760px rules; mobile dock/sheets; inspector becomes bottom sheet | desktop dock must not break mobile fallback |

### Keyboard regression map

Existing shortcuts sampled from `InkApp.onKeyDown()` and treated as regression-sensitive:

`Ctrl/Cmd+1`, `Ctrl/Cmd+2`, `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl/Cmd+Y`, `Ctrl/Cmd+Shift+F`, `Ctrl/Cmd+S`, `Ctrl/Cmd+O`, `Ctrl/Cmd+N`, `Ctrl/Cmd+A`, `Ctrl/Cmd+D`, `Ctrl/Cmd+G`, `Shift+Ctrl/Cmd+G`, arrows, Delete/Backspace, Escape, +/- zoom, F, 0, W, [, ], B/N/M/I/A/E/V/L/S/T/H, P.

### Regression risks and chosen containment

1. Existing runtime binds many controls by exact DOM ID. Phase 1 therefore preserves current interactive IDs and command attributes.
2. Creative Workspace currently mounts open and can visually dominate the canvas. Phase 1 changes presentation/default visibility, not the underlying controller or command authority.
3. Inspector auto-opens for object context. Right-dock coordination must enforce one primary visible panel without suppressing selection behavior.
4. Canvas sizing is already driven by `#stageWrap` through ResizeObserver. Dock expansion should therefore change available CSS geometry rather than camera/document state.
5. The standalone shell boots the compatibility bundle, so Phase-1 shell behavior should remain usable without requiring a rewrite of editor core or a second document state.
6. Service-worker shell caching can keep historical assets visible after promotion. Cache identity and shell asset inventory must change together.
7. Mobile already has a distinct bottom-dock/bottom-sheet model. New desktop dock rules must be bounded to desktop breakpoints.

## Phase B — UI structural changes

Implemented at code HEAD `81584872319f7b433e717f496770d33d971b9e9f`.

- Existing command-bearing DOM IDs and data attributes remain intact in both modular and standalone shells.
- Added `product/source/web-shell.js` as a presentation-only shell coordinator shared by both entry HTML files.
- Left tool rail remains the existing tool authority; no drawing command was moved or rewritten.
- Desktop canvas now reserves only the narrow collapsed dock width by default.
- When a primary right panel is visible, the shell writes its measured width to `--active-panel-w`; `#stageWrap` changes available width and the existing Renderer ResizeObserver handles canvas resize.
- Creative Workspace now defaults closed in modular source; the shell also closes it on fresh entry for standalone compatibility.
- The former central rounded empty-state mark is hidden in the Phase-1 desktop shell, leaving only low-emphasis first-stroke guidance.
- Existing menu strip and option/document bar remain separate chrome layers; broader contextual-control migration is deferred.
- Existing mobile bottom dock/sheets remain the <=760px interaction model.

Gate: `WEB_WORKSPACE_SHELL_ALIGNED = PASS / SOURCE_STATIC`.

## Phase C — panel-dock behavior

Added a compact desktop icon dock with direct access to:

- Properties;
- Layers;
- History;
- Reference;
- Compose;
- CHAT;
- Revision.

Behavior:

- fresh entry is collapsed;
- clicking a dock item opens the existing Inspector or Creative Workspace authority;
- clicking the active dock item collapses the primary panel;
- Layers and History call existing Inspector tabs;
- Reference / Compose / CHAT / Revision call existing Creative Workspace `setStage()` + `setOpen()`;
- closing panels does not uninstall or replace underlying CHAT, Revision, History or document controllers;
- only the last selected panel identity is persisted locally; open/closed state is deliberately not persisted so fresh entry remains canvas-first;
- one-primary-panel coordination closes Creative Workspace when Inspector becomes primary and closes Inspector when Creative Workspace becomes primary;
- the existing `視窗` application-menu entry now has a compact panel menu backed by the same shell commands;
- `window.INK_WEB_SHELL` exposes bounded runtime diagnostics and open/toggle/close helpers for QA.

Source/static contract check passed:

- `web-shell.js` syntax parsed successfully;
- required command DOM IDs remained present in modular and standalone HTML;
- dock contains all seven authorized entry points;
- measured-width stage layout contract present;
- desktop/mobile breakpoint containment present;
- Creative Workspace initial closed state present;
- `FORMAT_VERSION = 4` preserved.

Gate: `COLLAPSIBLE_PANEL_DOCK_WORKS = PASS / SOURCE_STATIC`.

## Phase D — identity / mark / favicon / cache

Pending.

## Phase E — checks and browser runtime evidence

Pending.

## Known deferred UI work

Per Current Work Order: full contextual-control migration, broad CHAT redesign, complete Photoshop visual cloning, general design-system rewrite, new drawing/Recipe/schema behavior, Cloud backend and collaboration are outside this package.

## Gate

`UI_SHELL_INVENTORY_COMPLETE = PASS`

Final gate remains pending Phase D–E.
