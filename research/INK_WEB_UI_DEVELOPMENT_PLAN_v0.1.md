# INK Web UI Development Plan v0.1

STATUS: `PLANNING / USER_DIRECTION_ACCEPTED / IMPLEMENTATION_NOT_YET_AUTHORIZED`

## Core principle

```text
人類介面可以盡量安靜、簡潔；
CHAT 能力則維持在底層完整。
```

INK Web 第一階段不重新發明介面語言。工作區骨架以 Photoshop / Illustrator 類型的成熟桌面編輯器配置作為主要 reference：

```text
top menu + contextual options
left compact tool rail
center canvas
right collapsible panel dock
bottom low-noise status
```

This is a layout / interaction reference, not a pixel copy, brand copy, code reuse, or Adobe asset reuse.

## Why this direction

1. USER already knows Photoshop / Illustrator workspace behavior.
2. Photoshop and Illustrator share a familiar editor grammar.
3. Mature collapse / expand panel behavior permits a clean canvas without removing functionality.
4. CHAT does not need visible panels to remain open if commands/document operations remain available below the UI.
5. INK already contains many capabilities; the immediate problem is hierarchy and exposure, not lack of controls.

## Current INK observations

Current source already contains application menu strip, top bar, workspace switch, Undo / Redo, left-side tools, Layers, History, object inspector, fullscreen, Creative Workspace, Reference / Recipe / Path / Repeat / Mask, CHAT and Revision foundations.

The first UI program should reorganize these capabilities rather than rewrite product logic.

Current visible shell still contains historical `INK v1.6.5 RC` identity. Existing product policy defines the current display label as `INK v0.1 · Web`; the visible correction may be included in the first authorized UI workpack without changing document `FORMAT_VERSION = 4`.

## Target workspace model

```text
┌──────────────────────────────────────────────────────────────┐
│ Menu / document identity                                     │
├──────────────────────────────────────────────────────────────┤
│ Contextual options for current tool / selection              │
├────┬────────────────────────────────────────────────────┬─────┤
│    │                                                    │     │
│ T  │                    CANVAS                          │  P  │
│ O  │                                                    │  A  │
│ O  │                                                    │  N  │
│ L  │                                                    │  E  │
│ S  │                                                    │  L  │
│    │                                                    │  S  │
├────┴────────────────────────────────────────────────────┴─────┤
│ quiet status / zoom / document state                         │
└──────────────────────────────────────────────────────────────┘
```

### Left side

- compact vertical tool rail;
- tool identity only by default;
- no permanently expanded brush/property controls;
- tool-specific properties move to contextual top options or compact popover.

### Center

- canvas is the visual subject;
- no large Creative Workspace panel on initial view;
- remove/redesign the small central rounded INK empty-state card;
- minimal empty-state guidance only when necessary;
- visual center calculated from actual available canvas viewport.

### Right side

Default state: `icon dock only`.

Candidate panel groups:

```text
Properties / Object
Layers
History
Reference
Compose
CHAT
Revision
```

Rules: one primary panel group occupies width at a time; the dock can collapse to icons; clicking the active panel can collapse it; panel state may be restored locally; panel visibility must not gate CHAT or command availability.

### Top

Two logical levels are acceptable in phase 1: application/menu/document level, then contextual tool/selection options. Avoid permanently filling the top with unrelated controls.

### Bottom

Keep only low-noise status information such as zoom, useful document/selection state, and actionable runtime status.

## CHAT rule

UI visibility is not CHAT capability.

```text
CHAT
→ reads authoritative document / selection / revision context
→ plans supported structured operations
→ executes through INK command / History boundaries
```

CHAT must remain able to operate INK whether its panel is open, collapsed, or hidden.

UI refactoring must not duplicate command authority, move product logic into DOM-only button handlers, require simulated mouse interaction for CHAT, or create separate CHAT-only document state.

## Reference-workflow rule

Future CHAT drawing may reuse mature workflow concepts from external applications or reconstructed Recipe logic:

```text
Photoshop-like layer workflow
Illustrator-like Path / Boolean workflow
Figma-like frame / alignment workflow
RA-derived Recipe reconstruction
```

These are translated into INK-native commands and structures. The UI exposes them to humans when useful; CHAT may access the same underlying operations without requiring all corresponding controls to remain visible.

## Development sequence

### UI Phase A — Current shell inventory + regression map

Inventory every shell region, panel/tab ID, JS hook, keyboard shortcut, fullscreen behavior, Pages / Inspector / Layers / History, Creative Workspace, CHAT / Revision, mobile/narrow viewport rule, and current staging behavior.

Output one implementation matrix inside DEV progress/report, not another standalone research document.

Gate: `UI_SHELL_INVENTORY_COMPLETE`

### UI Phase B — Photoshop-aligned workspace shell

- compact left tool rail;
- canvas-first center;
- right panel dock collapsed by default;
- remove/redesign central INK empty-state card;
- separate application/menu row from contextual options;
- preserve existing panel contents;
- correct all user-facing Web product identity from historical `v1.6.5 RC` to `INK v0.1 · Web`;
- synchronize Web metadata/title/manifest and cache identity so the browser does not continue presenting the historical version;
- add an INK Web favicon (prefer a small INK-owned SVG mark, no Adobe asset reuse), link it from the document head, and register it in Web app metadata where appropriate;
- preserve existing element identity / command bindings where practical.

Gate: `WEB_WORKSPACE_SHELL_ALIGNED`

### UI Phase C — Panel dock behavior

- icon-only collapsed state;
- expand one panel group;
- collapse active panel;
- Window/menu access for hidden panels;
- width constraints;
- local persistence of panel-open state where safe;
- canvas re-centers from actual remaining viewport.

Gate: `COLLAPSIBLE_PANEL_DOCK_WORKS`

### UI Phase D — Contextual controls

Move dense permanent brush, eraser, shape, text, and selection/object settings out of the left column. Current tool determines top contextual options; secondary settings may use compact property panel/popover. Underlying command behavior stays unchanged.

Gate: `CONTEXTUAL_TOOL_OPTIONS_WORK`

### UI Phase E — CHAT / creative-loop panel placement

- CHAT becomes a right-dock panel rather than a permanently occupying workspace;
- Reference / Compose / Revision remain accessible as panels or grouped modes;
- specialist controls open only on demand;
- closing UI does not end CHAT/document capability.

Gate: `CHAT_CAPABILITY_UI_INDEPENDENT`

### UI Phase F — Runtime + responsive closure

Required QA: staging load, canvas-first initial view, panel collapse/expand, Layers, History, CHAT panel open/close, Reference / Compose / Revision access, fullscreen, desktop resize, narrow viewport fallback, save/open/export, shortcuts, favicon visible, user-facing identity = `INK v0.1 · Web`, no stale historical `v1.6.5 RC` Web label, service-worker/cache refresh behavior, no fatal console/runtime errors, `FORMAT_VERSION = 4`, no migration.

Use the existing self-hosted Windows Chrome path and task-specific bounded browser QA.

Gate: `INK_WEB_UI_PHASE1_COMPLETE`

## First implementation package

`INK-WEB-UI-001 — Photoshop-Aligned Workspace Shell & Collapsible Panel Dock v0.1`

Recommended bounded scope:

```text
Phase A
→ Phase B
→ Phase C
→ runtime closure
```

Do not include full contextual-control migration or broad CHAT redesign in the first package unless Phase A proves the shell work is small enough.

Primary acceptance:

```text
Open INK Web
→ canvas is visually dominant
→ left tools remain immediately available
→ right side starts compact
→ Layers / History / CHAT / other panels can be summoned
→ panel can collapse again
→ no drawing/document capability is lost
```

## Web publication rule

Current staging is served from the repository's GitHub Pages content rooted at the promoted main tree.

Therefore:

```text
work/* branch changes
→ NOT live

MR-approved promotion / merge to main
→ GitHub Pages republishes
→ live Web staging updates after the Pages deployment finishes
```

The browser may still temporarily show older assets because INK uses a service worker and cache storage. UI work must therefore treat Web publication and client cache refresh as separate concerns.

For `INK-WEB-UI-001`:

- do not expect work-branch commits to alter the public staging URL;
- after promotion to `main`, verify the live staging URL rather than only source files;
- update the Web cache/release identity away from the historical `1.6.5-RC` namespace as part of the v0.1 Web identity correction;
- ensure a previously opened INK tab can receive the updated shell without requiring users to manually clear browser storage;
- favicon caching is browser-specific, so acceptance should verify a fresh tab/session as well as a normal reload.

This publication rule does not change document `FORMAT_VERSION = 4`.

## Hard boundaries

- no change to authoritative Document / Path / History / Revision models;
- no change to `FORMAT_VERSION = 4`;
- no second renderer or workspace authority;
- no core commands moved into visual-only state;
- no existing creative-loop capability removed;
- no broad design-system rewrite;
- no Adobe proprietary code/assets/branding;
- no product base-version change away from user-authorized `v0.1`;
- no `package/ink-current` mutation unless separately authorized.

## Review principle

Photoshop / Illustrator are references for spatial hierarchy, toolbar/panel grammar, collapse/expand behavior, and contextual exposure of controls. INK remains its own product.

Success:

```text
less interface noise
+ more visible canvas
+ familiar interaction grammar
+ unchanged core capability
+ CHAT remains fully operational below the UI
```

## Authorization state

```text
DEVELOPMENT_PLAN = CREATED
USER_DIRECTION = ACCEPTED
NEXT_PLANNED_WORK_ORDER = INK-WEB-UI-001
IMPLEMENTATION = NOT YET AUTHORIZED
```
