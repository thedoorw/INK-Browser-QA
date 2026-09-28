# INK UI-C Photoshop Fidelity & Final UI Closure — DEV Handoff v1.0

STATUS: `AUTHORIZED / DEV_ACTIVE / STOP_TO_UR`

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