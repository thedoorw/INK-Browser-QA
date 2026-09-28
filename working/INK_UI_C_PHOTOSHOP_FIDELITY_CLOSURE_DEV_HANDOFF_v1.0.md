# INK UI-C Photoshop Fidelity & Final UI Closure — DEV Handoff v1.0

STATUS: `DEV_COMPLETE / UR_REVIEW_REQUIRED / STOP_TO_UR`

TASK: `INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

MANDATORY_BRANCH: `work/ink-ui-c-photoshop-fidelity-closure-001`

BASE_MAIN: `fe0ad7dd8aec3cb51314378d4b6b628f5bfbab56`

OWNER: `UR / UI REVIEW`

## Read first

- `README.md`
- `AGENTS.md`
- `ACTIVE/README.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_UI_UR_EXECUTION_DIRECTIVE_v1.0.md`
- `working/WORKING_STATUS.md`
- `working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`
- `working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_DEV_WORKPACK_v1.0.md`
- `working/INK_UI_B_FULL_CAPABILITY_CONTROLS_UR_REVIEW_v1.0.md`
- `working/INK_UI_B_PUI_AND_GAP_DISPOSITION_v1.0.md`
- `working/INK_UI_B_CONTRIBUTION_BOUNDARY_CONTRACT_v1.0.md`
- `working/INK_UI_FINAL_IMPLEMENTATION_INDEX.md`

Photoshop reference authority:
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
- `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
- `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
- `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
- `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`
- `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`

## Mission

UI-C is the final Photoshop-aligned visual/interaction closure package.

Do not add capability. Preserve UI-B wiring and make the full workstation read and behave like one coherent light-gray Photoshop-style editor.

## Priority A — geometry closure

Verify/correct against measured authority:

```text
Application/menu content = 24 px
divider = 1 px
Options content = 35 px
divider = 1 px
workspace origin = 61 px

active document tab = 28 px
tab/workspace divider = 1 px
ruler horizontal = 17 px
ruler vertical = 17 px
ruler corner = 17 × 17 px
active-document status content = 16 px
status bottom boundary = 1 px

single Tools reference = 39 px
double Tools reference = 72 px
collapsed right Dock reference = 39 px
expanded panel reference = 252 px / ELASTIC
panel header/tab band = 28 px
stacked splitter ≈ 3 px
document scrollbar reference ≈ 16 px
```

No dead tab/status/ruler space when no document is active.

## Priority B — Photoshop fine detail

Reconcile:
- selected tool visual fill ~31×24;
- tool row pitch ~26 px;
- flyout marker ~3×3;
- Layers row/reorder reference ~35 px;
- History row pitch ~23 px;
- popup border/separator = 1 px;
- compact menu/flyout rows;
- tooltip grammar;
- panel tabs/options grammar;
- Layers drag ghost + insertion line;
- Navigator proxy states;
- guide drag + transient X/Y readout;
- active/empty document transitions;
- focus/disabled/hover states.

Reference-state values are not fixed where Photoshop behavior is elastic/content-dependent.

## Priority C — Light theme

Use one semantic token authority.

High-confidence Adobe anchors:

```text
workspace structural gray = #E9E9E9
primary elevated surface = #FFFFFF
active accent = #3B63FB
```

Preserve:

```text
CHROME_PALETTE != CANVAS_WORKBENCH_PALETTE
COMPONENT_LOCAL_RANDOM_GRAYS = 0
ONE_LIGHT_GRAY_TOKEN_AUTHORITY = REQUIRED
```

Current Photoshop-on-web Light informs color hierarchy only. Desktop Photoshop remains the geometry/workstation authority.

## Priority D — integrate UI-B controls into Photoshop grammar

UI-B capability controls must not look like a separate web-card subsystem.

Review/correct:
- application menu items;
- tool flyouts;
- contextual Options controls;
- Adjustments/Channels/Layers/Properties additions;
- Filter/Layer Effects/Liquify/Gradient/Pattern/Profile dialogs;
- Recovery/Export secondary controls;
- Object menu additions;
- contribution-driven controls.

They must inherit Photoshop density, typography, border, spacing, hover/active/disabled/focus and popup grammar.

Do not change the capability or mutation authority behind them.

## Priority E — interaction closure

Required source/local interaction QA:
- application-menu keyboard/outside-click/Escape;
- tool flyout open/select/last-used member;
- panel tab switching/options;
- panel width resize;
- stacked panel splitter resize;
- Layers reorder insertion feedback;
- Navigator proxy pan/zoom sync;
- ruler guide drag/readout;
- Snap/Snap To feedback;
- active vs empty document chrome;
- tooltip;
- dialog Escape and focus behavior;
- no dead visible UI-B route.

Mouse cursor raster appearance is not a Photoshop pixel-copy target.

## Priority F — responsive/mobile

Keep one command/state authority.

Desktop Photoshop-aligned placement remains authoritative.
Compact/mobile may use sheets/pickers but may not create duplicate tool, panel or mutation state.

## Engineering-health hard stops

Do not introduce:

```text
NEW_PRESENTATION_IMPORTANT > 0
NEW_UNAUTHORIZED_WIDTH_THRESHOLD > 0
PANEL_STATE_OWNERS > 1
MENU_STATE_CONTROLLERS > 1
DUPLICATE_LITERAL_DOM_IDS > 0
PRIMARY_HOME_PER_FUNCTION > 1
DEAD_VISIBLE_CONTROLS > 0
HARD_CODED_NORMAL_UI_PX_FONT_SIZE > 0
HAND_EDITED_GENERATED_SHELL = 1
FINAL_OVERRIDE_LAYER_ADDED = 1
FIRST_PAINT_BLACK_FLASH = 1
FROZEN_CORE_MUTATION > 0
```

If fidelity cannot be fixed without Core/Renderer/Document/History/Revision/Geometry/Recipe/CHAT authority change:
`STOP → UR → MR / INTEGRATION_REQUIRED`.

## Brand closure

Preserve:
- visible logo: `assets/INK_MARK_SOURCE_W-300.jpg`;
- favicon: `assets/favicon.svg`;
- favicon 32×32, `#69BFE3`, white simplified Y;
- no Adobe logo/proprietary assets;
- PWA installed-app icon redesign remains out of scope.

## Required DEV QA/evidence

Before handoff provide:

1. exact DEV HEAD;
2. changed files;
3. focused/static QA results;
4. local interaction smoke results;
5. Photoshop geometry/fine-detail comparison notes;
6. Light-theme token table;
7. visual evidence pack prepared for UR;
8. refreshed `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`;
9. 64/64 family and 501/501 atomic placement preservation statement;
10. PUI-001..074 preservation statement;
11. G-01..G-34 final-state statement;
12. predecessor 212 buttons / 29 selects accounting statement;
13. 22 CHAT named tools / 34 bounded edits preservation statement;
14. UI engineering-health delta;
15. contribution-boundary/brand audit;
16. explicit `CENTRAL_RUNTIME = NOT RUN`;
17. any `INTEGRATION_REQUIRED` blocker.

Suggested QA:
`qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`

## Runtime rule

```text
CENTRAL_RUNTIME_DURING_UI_C = PROHIBITED
DEV_SELF_PROMOTION = NO
DEV_NEXT = STOP_TO_UR
```

Final authoritative integrated Runtime occurs only after UR promotes UI-C and returns control to MR.

## DEV completion evidence — 2026-09-28

Source closure commit before documentation-only handoff update:

`d5fccb906bce3201f0f9e829f71fb92d5dc786ef`

### Changed product / QA source

- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/src/config.js`
- `product/source/service-worker.js`
- `qa/ink-ui-a-photoshop-shell-panels.test.mjs`
- `qa/ink-ui-b-full-capability-controls.test.mjs`
- `qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`

No Core / Document / History / Renderer / Geometry / Recipe / CHAT authority file was changed.

### Focused QA

```text
UI_C_SOURCE_STATIC_ASSERTIONS = 50 / 50 PASS
FORMAT_VERSION = 4 / UNCHANGED
BUILD_ID = 20260928-ui-c-photoshop-fidelity-closure-001
SERVICE_WORKER_BUILD_ID_SYNC = PASS
WEB_PORTABLE_SHELL_PARITY = PASS
DUPLICATE_LITERAL_DOM_IDS = 0
RESPONSIVE_WIDTH_FAMILY = 760 / 761 / 1120 ONLY
HARD_CODED_NORMAL_UI_PX_FONT_SIZE = 0
```

The central Runtime was not started. Interaction closure was checked at source/event-path level only; UR owns browser visual/interaction acceptance.

### Local interaction/source smoke

```text
APPLICATION_MENU_KEYBOARD_ESCAPE_OUTSIDE_CLICK = SOURCE_PATH_PASS
TOOL_FLYOUT_DENSITY_AND_EXISTING_SELECTION_PATH = SOURCE_PATH_PASS
PANEL_WIDTH_RESIZE = EXISTING_AUTHORITY_PRESERVED
PANEL_STACK_SPLITTER_RESIZE = SOURCE_PATH_PASS
LAYERS_DRAG_INSERTION_FEEDBACK = SOURCE_PATH_PASS
NAVIGATOR_PROXY_DRAG = SOURCE_PATH_PASS
NAVIGATOR_CLICK_TO_PAN = SOURCE_PATH_PASS
NAVIGATOR_ZOOM_SYNC = SOURCE_PATH_PASS
RULER_GUIDE_DRAG = SOURCE_PATH_PASS
RULER_GUIDE_LIVE_XY_READOUT = SOURCE_PATH_PASS
SNAP_AUTHORITY = EXISTING_CORE_AUTHORITY_PRESERVED
TOOLTIP = SOURCE_PATH_PASS
FOCUS_DISABLED_HOVER = SOURCE_STYLE_PASS
AUTHORITATIVE_BROWSER_RUNTIME_SMOKE = NOT RUN
```

### Photoshop geometry / fine detail

```text
TOP_SHELL = 24 + 1 + 35 + 1 = 61 px
DOCUMENT_TAB = 28 + 1 px band
RULERS = 17 px
DOCUMENT_STATUS = 16 + 1 px
TOOLS_SINGLE = 39 + 1 reference
TOOLS_DOUBLE = 72 + 1 reference
DOCK_COLLAPSED = 39 + 1 reference
PANEL_REFERENCE = 252 px / ELASTIC
PANEL_HEADER_TAB = 28 px
STACK_SPLITTER = 3 px
TOOL_SELECTED_FILL = 31 px width / 26 px pitch authority retained
FLYOUT_ROW = 20 px
LAYERS_ROW = 35 px
HISTORY_ROW = 23 px
SCROLLBAR = 16 px
```

### Light theme semantic authority

| Token | Final value |
| --- | --- |
| `--ink-ui-bg-base` | `#E9E9E9` |
| `--ink-ui-surface` | `#FFFFFF` |
| `--ink-ui-surface-subtle` | `#F4F4F4` |
| `--ink-ui-text` | `#222222` |
| `--ink-ui-text-muted` | `#666666` |
| `--ink-ui-text-disabled` | `#919191` |
| `--ink-ui-border` | `#CFCFCF` |
| `--ink-ui-control-hover` | `#EEEEEE` |
| `--ink-ui-control-active` | `#E8EDFF` |
| `--ink-ui-accent` | `#3B63FB` |

UI-B controls now consume the same semantic Light grammar; the UI-B CSS section has no private hard-coded hex palette and no presentation `!important`.

### Engineering health delta

Compared with base main `fe0ad7dd8aec3cb51314378d4b6b628f5bfbab56`:

```text
styles.css chars = 178767 → 184824  (+6057 / +3.39%)
!important total = 49 → 36  (-13)
new presentation !important = 0
hard-coded normal UI px font-size = 0 → 0
media width thresholds = 760 / 761 / 1120 → unchanged
tracked shell selector definition counts = unchanged
duplicate literal DOM ids = 0 → 0
FORMAT_VERSION = 4 → 4
frozen Core mutation = 0
```

Tracked definitions unchanged:
`.topbar`, `.tool-rail`, `.inspector`, `.stage-wrap`, `.statusbar`, `.control-row`, `.inspector-tab`, `.creative-workspace-panel`.

### Final reconciliation preservation

```text
FAMILY_PLACEMENT = 64 / 64 PRESERVED
NORMALIZED_ATOMICS = 501 / 501 PRESERVED
PUI_RANGE = PUI-001 .. PUI-074 / 74 PRESERVED
GAP_RANGE = G-01 .. G-34 / 34 PRESERVED
PREDECESSOR_STATIC_BUTTON_FAMILIES = 212 ACCOUNTED
SELECT_CONTROLS = 29 / 29 ACCOUNTED
CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22 / 22 PRESERVED
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34 / 34 PRESERVED
```

### Contribution / brand audit

```text
UI_B_CONTRIBUTION_BOUNDARY = PRESERVED
SECOND_MUTATION_AUTHORITY = 0
PLUGIN_SDK_MARKETPLACE_REMOTE_LOADING = NOT CLAIMED / P2 NOT STARTED
VISIBLE_LOGO = assets/INK_MARK_SOURCE_W-300.jpg
FAVICON = assets/favicon.svg
ADOBE_BRANDING_ASSET_COPY = 0
WEB_PORTABLE_FAVICON_ROUTE_PARITY = PASS
```

### Visual evidence handoff

The capture matrix required by the workpack is retained for UR:
1280×994 desktop, single/double Tools, collapsed/expanded panel, active document rulers off/on, Navigator/History, Layers reorder, flyout, tooltip, popup, guide drag, empty workspace and final Light theme.

Authoritative exact-SHA screenshots are intentionally **not** produced by DEV because the central Runtime is prohibited during UI-C.

### Gate

```text
PHOTOSHOP_FIDELITY_RESULT = DEV_SOURCE_CLOSURE_PASS / UR_VISUAL_REVIEW_REQUIRED
LIGHT_THEME_RESULT = SOURCE_STATIC_PASS / UR_VISUAL_REVIEW_REQUIRED
UI_HEALTH_DELTA = PASS
CENTRAL_RUNTIME = NOT RUN
INTEGRATION_REQUIRED = NO
DEV_SELF_PROMOTION = NO
DEV_NEXT = STOP_TO_UR
```

**STOP → UR**


## DEV bounded revision — UR Review Round 1

Authority:
`working/INK_UI_C_PHOTOSHOP_FIDELITY_CLOSURE_UR_REVIEW_R1_v1.0.md`

UR return head:
`48c36674eb2ad60ad002a873e1e2151c9177c209`

Revision source head before documentation-only handoff:
`d736dc880dffdd7832b9cc37484616f3185d950a`

### R1 — Dynamic rulers

```text
RESULT = SOURCE_AND_INTERACTION_PATH_READY
TICK_NUMBER_SOURCE = EXISTING renderer.screenToWorld()
PAN_ZOOM_SYNC = renderer render heartbeat + bounded shell view sync
SECOND_COORDINATE_ENGINE = 0
RULER_THICKNESS = 17 px PRESERVED
GUIDE_COMMIT = existing app.addGuide() PRESERVED
GUIDE_READOUT = X: / Y:
GUIDE_PREVIEW = DISTINCT FROM ACTIVE ACCENT
```

Static repeating ruler gradients were removed from the final ruler authority. Horizontal and vertical ruler canvases derive their ticks and numeric labels from current renderer/camera world mapping.

### R2 — Navigator synchronization

```text
RESULT = SOURCE_AND_INTERACTION_PATH_READY
THUMBNAIL_WORLD_BOUNDS = renderer.contentBounds() + stable padding/aspect fit
THUMBNAIL_RENDER = existing renderer.renderPageWorld()
VIEWPORT_RECT = existing renderer.viewportWorldBounds()
PROXY_SIZE = viewport bounds / thumbnail world bounds
PROXY_POSITION = viewport origin / thumbnail world bounds
CLICK_TO_PAN = existing page.camera only
PROXY_DRAG = existing page.camera only
HARD_CENTER_ON_RENDER = REMOVED
CURRENT_VIEWPORT_SCREENSHOT_THUMBNAIL = REMOVED
GRAB / GRABBING = PRESERVED
```

### R3 — selected Tools fill

```text
TOOLS_HIT_TARGET = 31 × 26 px PRESERVED
TOOLS_ROW_PITCH = 26 px PRESERVED
TOOLS_SELECTED_VISUAL_FILL = 31 × 24 px CENTERED
```

### R4 — popup separator

One semantic popup-separator role was added without changing the general structural soft-border authority:

```text
--ink-ui-popup-separator = #C0C0C0
SEPARATOR_HEIGHT = 1 px
SEPARATOR_INSET = 2 px
APPLICATION_POPUP = SAME TOKEN
PANEL_OPTIONS_POPUP = SAME TOKEN
--ink-ui-border-soft = #E2E2E2 UNCHANGED
```

### Focused source/static gate

```text
R1_R4_AND_REGRESSION_ASSERTIONS = 58 / 58 PASS
web-shell.js PARSE = PASS
PUI_001_074 = PRESERVED / 74 OF 74
G_01_34 = PRESERVED / 34 OF 34
FORMAT_VERSION = 4 / UNCHANGED
BUILD_ID / SERVICE_WORKER_BUILD_ID = 20260928-ui-c-photoshop-fidelity-closure-r1 / SYNC
RESPONSIVE_WIDTH_FAMILY = 760 / 761 / 1120 ONLY
DUPLICATE_LITERAL_DOM_IDS = 0
```

Bounded diff from UR return head to revision source head:
- `product/source/web-shell.js`
- `product/source/styles.css`
- `product/source/src/config.js`
- `product/source/service-worker.js`
- `qa/ink-ui-c-photoshop-fidelity-closure.test.mjs`

No Core / Document / History / Renderer / Geometry / Recipe / CHAT authority file changed.

Engineering-health delta from UR return head:

```text
styles.css chars = 184824 → 184692 (-132)
!important total = 36 → 36
new width thresholds = 0
duplicate literal DOM ids = 0
FORMAT_VERSION drift = 0
```

The central Runtime and authoritative browser smoke were not run. UR owns exact-SHA visual and interaction acceptance.

### R1 return gate

```text
R1_DYNAMIC_RULERS = PASS
R2_NAVIGATOR_SYNC = PASS
R3_TOOL_ACTIVE_FILL = PASS
R4_POPUP_SEPARATOR = PASS
FOCUSED_QA = 58 / 58 SOURCE_STATIC PASS
UI_HEALTH_DELTA = PASS
CENTRAL_RUNTIME = NOT RUN
INTEGRATION_REQUIRED = NO
DEV_SELF_PROMOTION = NO
DEV_NEXT = STOP_TO_UR
```

**STOP → UR**
