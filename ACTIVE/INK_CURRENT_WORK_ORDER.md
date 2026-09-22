# INK CURRENT WORK ORDER

STATUS: INK-UI-MAINT-001 / UR_AUTHORIZED / DEV_READY

## Control

CURRENT_TASK_ID: INK-UI-MAINT-001
TITLE: Photoshop Shell Geometry / Pixel Alignment v0.1
AUTHORITY: USER_DIRECT_UI_MAINTENANCE / UR
DEV_WORK_BRANCH: work/ink-ui-maint-001
BASE_MAIN: c0adc842c1d1b52c8cdf74303e087704b0047caa
DEV_MODE: BOUNDED_UI_MAINTENANCE
PRODUCT_SOURCE_MUTATION: AUTHORIZED / UI_ONLY
FORMAT_VERSION: 4 / PRESERVE
PRODUCT_BASE_VERSION: v0.1 / PRESERVE
PACKAGE_MUTATION: PROHIBITED
CORE_MUTATION: PROHIBITED
RUNTIME_QA: REQUIRED_BEFORE_UI_PASS / USER_REPORTED_VISUAL_REGRESSION

## User direction

Use the supplied Photoshop screenshots as a geometric reference for INK shell alignment.

This is not a Photoshop feature clone and not a Core redesign.

Target:
Photoshop pixel geometry
→ INK shell alignment
→ tighter top chrome
→ edge-attached left rail
→ coherent right dock/panel geometry
→ clearer dark workbench / page relationship
→ preserve all INK commands and semantics

Favicon/logo repair is explicitly secondary and is out of scope for this workpack unless a broken path blocks the UI test.

## Authoritative Photoshop pixel reference

Reference screenshots: 1280 × 1024.

Measured desktop geometry:

| Region | Photoshop measured reference |
|---|---:|
| Menu row | y = 0–23 → 24 px |
| Menu separator | y = 24 → 1 px |
| Options row | y = 25–59 → 35 px |
| Options/workspace separator | y = 60 → 1 px |
| Workspace begins | y = 61 |
| Single-column left toolbar | x = 0–39 → 40 px total |
| Left toolbar content field | x = 1–37 |
| Workspace begins after left rail | x = 40 |
| Collapsed right dock | x = 1240–1279 → 40 px total |
| Expanded right panel content | about 250 px |
| Expanded right panel total edge region | about 252–253 px |
| Empty workspace base | approximately #262626 |
| Chrome fill family | approximately #535353 with #383838 separators |

Do not copy Photoshop branding or exact color identity. Preserve INK accent color and product identity. Geometry and interaction grammar are the reference.

## Current INK defects to correct

Current source contains these conflicting geometry conditions:

--menu-h = 28px
--options-h = 38px
--topbar-h = 66px
--contextual-h = 36px
effective canvas start ≈ 102px
Photoshop workspace start ≈ 61px

Also:

--tool-w = 38px
UI-001 attached the rail to left:0
UI-004 later overrides .tool-rail to left:7px
→ visible detached/floating rail regression

And:

--inspector-w = 316px
Photoshop expanded panel reference ≈ 252px

Creation-space renderer currently fills the full canvas with paper color. UI DEV must not alter Renderer semantics in this task.

## Required scope

### A — collapse desktop shell from three visible rows to two

Current desktop shell is visually:
menu + document/app topbar + contextual options = about 102 px before canvas.

Target desktop shell:
menu row about 24 px + one Photoshop-style options/context row about 36 px = workspace origin about 60–61 px.

Requirements:
- preserve #contextualOptions, current command IDs and bindings;
- contextual tool controls remain the active options surface;
- compact document title / workspace switch / file controls must share the same second-row shell instead of consuming a third permanent row;
- no duplicated command state;
- no simulated mouse authority;
- no extra permanent toolbar row;
- Web / Portable structure must remain equivalent.

Pixel gate at desktop:
MENU_H = 24 ± 1 px
OPTIONS_H = 36 ± 1 px
WORKSPACE_TOP = 60–61 ± 1 px

Gate: PS_TOP_SHELL_GEOMETRY_ALIGNED

### B — left rail must be shell-attached

Required:
- final computed .tool-rail left edge = 0px;
- width = 40px ± 1px;
- top begins exactly at workspace origin;
- no 6/7/8/10 px outer gap;
- no floating border radius / card geometry on desktop;
- compact single-column tool grammar;
- tool icons remain reachable and current tool IDs/commands preserved;
- later CSS blocks must not re-detach the rail.

Recommended compact rhythm:
- button pitch approximately 26–28 px;
- icon approximately 18–19 px;
- 1 px separators / shell borders.

Gate: LEFT_RAIL_PIXEL_ATTACHED

### C — right dock and primary panel geometry

Required:
- collapsed right dock remains edge-attached and 40px ± 1px;
- no outside gap;
- default Inspector / Creative primary width should move from 316 px toward Photoshop reference: 252px ± 8px at 1280 px desktop;
- preserve resize behavior and minimum usability;
- one primary right panel at a time;
- panel header/tab/body alignment stays compact;
- Reference / Compose / CHAT / Revision / Layers / History remain reachable.

Gate: RIGHT_DOCK_PANEL_GEOMETRY_ALIGNED

### D — document title / top-row visual weight

Required:
- reduce default document-title visual width at 1280 desktop;
- target max visual width approximately 220–240px;
- title remains editable and command semantics unchanged;
- workspace switch / file actions and contextual controls align to one shared baseline;
- avoid a large isolated dark title block.

Gate: TOPBAR_VISUAL_WEIGHT_ALIGNED

### E — workbench / page relationship

Target visual grammar:
dark workbench + clear white document/page when in Layout space + no impression that the whole application surface is one white sheet.

Allowed UI work:
- shell/stage CSS;
- Layout-space presentation;
- shadows/borders around the existing artboard;
- removal of redundant CSS that forces white shell background where it is not authoritative.

Hard boundary:
- do not modify Renderer.render(), paper rendering, workspace coordinate semantics, artboard geometry, History, or document model;
- do not fake an A4 page with an unrelated DOM rectangle that does not track the actual artboard.

If Creation-space paper behavior prevents the requested Photoshop-like workbench without renderer changes:
INTEGRATION_REQUIRED = CREATION_PASTEBOARD_RENDERER
→ record exact finding
→ do not cross the boundary.

Layout-space must nevertheless present a clearly bounded white A4 page on a dark workbench.

Gate: WORKBENCH_PAGE_RELATIONSHIP_POLISHED

### F — pixel-grid cleanup

Normalize the shell around the measured reference:
- 1 px separators;
- no accidental 7 px shell gaps;
- compact control heights;
- consistent icon boxes;
- aligned text/input baselines;
- right/left shell edges exactly attached;
- remove obsolete later overrides that defeat accepted shell geometry.

Do not perform a broad theme rewrite.

Gate: SHELL_PIXEL_GRID_CLEAN

### G — Web / Portable parity and regression guard

Required:
- index.html and index-standalone.html remain structurally equivalent except delivery-specific differences;
- extend/add focused static test qa/core/tests/unit/photoshop-shell-geometry-v0.1.test.mjs;
- test the final intended geometry contract, including no later detached-rail override;
- retain UI-003/UI-004/UI-005 tests;
- changed JS parses;
- no duplicate command IDs.

Gate: PS_SHELL_PARITY_REGRESSION_PASS

## Runtime acceptance — required

This is a user-reported visual/runtime regression. Static evidence alone is insufficient.

At 100% browser zoom, capture actual computed geometry using getBoundingClientRect() at a desktop viewport close to 1280 CSS px width.

Required Runtime evidence:
menu height ≈ 24px
options/context row ≈ 36px
stage/workspace top ≈ 60–61px
tool rail left = 0px
tool rail width ≈ 40px
panel dock right = 0px
panel dock width ≈ 40px
default primary panel width ≈ 252px ± 8px
no overlap between top shell / rail / dock / canvas
Layout space shows white A4 against dark workbench

Also verify:
- Pen/Pencil/Marker/Brush/Airbrush contextual controls;
- Eraser / Shape / Text options;
- Selection actions;
- Layers / History;
- Reference / Compose / CHAT / Revision;
- fullscreen enter/exit;
- narrow desktop containment.

If Runtime cannot be executed:
TASK_STATUS = RUNTIME_BLOCKED
→ STOP
→ do not claim UI_PASS.

## Hard boundaries

Do not modify:
- Document authority / schema / migration;
- History semantics;
- Revision semantics;
- Recipe / Geometry;
- Renderer / WebGL / Canvas engine;
- Core module contracts;
- CHAT proposal/approval/execution semantics;
- persistence semantics;
- package/certification;
- product base version.

If required:
INTEGRATION_REQUIRED → STOP → UR/MR

## Expected changed files

Prefer a small UI-only payload:
- product/source/styles.css
- product/source/index.html
- product/source/index-standalone.html
- product/source/web-shell.js only if necessary for re-hosting without semantic duplication
- focused QA
- report

Do not touch Core semantic modules.

## Evidence report

Create exactly one:
research/INK_UI_MAINT_001_PS_SHELL_ALIGNMENT_REPORT_v0.1.md

Include:
- measured before/after geometry;
- exact computed Runtime rectangles;
- screenshots or numeric Runtime evidence;
- changed-file inventory;
- command/ID preservation;
- Web/Portable parity;
- any INTEGRATION_REQUIRED finding.

## Completion

TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-UI-MAINT-001
BRANCH = work/ink-ui-maint-001
GATE = PS_SHELL_PIXEL_ALIGNMENT_WORKS
RUNTIME_QA = PASS
PORTABLE_WEB_PARITY = PASS
FORMAT_VERSION = 4
PRODUCT_BASE_VERSION = v0.1
PACKAGE_MUTATION = 0
CORE_MUTATION = 0
NEXT_ACTION = UR_REVIEW_REQUIRED
STOP
