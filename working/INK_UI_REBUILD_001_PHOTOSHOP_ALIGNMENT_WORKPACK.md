# INK UI REBUILD 001 — Photoshop Alignment Workpack

STATUS: `UR_PREPARED / MR_AUTHORIZATION_REQUIRED / NO_PRODUCT_CHANGE`

PLANNING_BRANCH: `planning/ink-ui-rebuild-001-photoshop-alignment`

BASELINE_MAIN: `79b76ccafd6e1d3443d2565fcc6d4f284e1d6eac`

UPSTREAM:
- `INK-UI-REBUILD-001-TECH-DEBT-CLEANUP = COMPLETE / MR_PASS / PROMOTED`
- promoted product baseline: `9ebdbe771346e6509c902f71766b117ab674f503`
- final UI Runtime: `36112690309 / UI PASS`
- Creative 360s timeout remains a separate MR HOLD and must not be folded into this UI lane.

REFERENCE:
- user-supplied Photoshop workstation captures `ps-1.png` and `ps-2.png`;
- prior UI REBUILD 001 development plan / function inventory / master checklist;
- current `INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md`;
- technical-debt completion record / evidence / health report on main.

## 1. Goal

Align INK to Photoshop's mature workstation grammar before applying INK-specific visual refinement.

This is structural alignment, not a Photoshop skin.

Target workstation grammar:

```text
application/menu row
→ contextual options row
→ edge-attached left tool rail
→ dominant center canvas/workspace
→ edge-attached right panel dock
→ compact status/view controls
```

INK-specific functions remain INK-native:
- Reference
- Compose
- CHAT
- Revision
- Specialist
- Creation / Layout workspace

They must fit the same workstation grammar and must not create a second UI system.

## 2. Reference geometry

Authoritative user measurement already established for the Photoshop top chrome:

```text
menu row        24 px
divider          1 px
options row     35 px
divider          1 px
TOTAL           61 px
```

Therefore:

`PS_TOP_CHROME_REFERENCE = 61px`

Other dimensions are not to be guessed from memory. Phase P0 must measure the supplied 1280×1024 Photoshop captures and the current INK shell and record:
- left rail width in single-column mode;
- left rail width in two-column mode;
- collapsed right dock width;
- expanded right panel width;
- status row height;
- canvas/panel boundaries;
- spacing and divider thickness.

No implementation may treat an approximate visual estimate as an exact contract before P0 records it.

## 3. Functional-placement rules carried forward

Classification vocabulary:

- `PRIMARY` — one canonical visible home;
- `CONTEXTUAL` — current tool/selection only;
- `SHORTCUT` — secondary route to the same command;
- `RESPONSIVE` — alternate placement for smaller viewport;
- `SPECIALIST` — advanced/diagnostic surface;
- `REMOVE` — redundant, obsolete or misleading.

Mandatory rule:

`PRIMARY_HOME_PER_FUNCTION = 1`

### File
- File menu = PRIMARY.
- Keyboard = SHORTCUT.
- Compact Export = RESPONSIVE.
- Permanent desktop New/Open/Save copies = REMOVE.

### Workspace / view
- one compact Creation/Layout control = PRIMARY;
- View menu = SHORTCUT;
- status row = viewport operations only;
- no equal-weight duplicate workspace switch.

### Tools
- left tool rail = PRIMARY;
- grouped draw-family popover = CONTEXTUAL;
- compact placement = RESPONSIVE;
- no second permanent tool list.

### Object / selection
- fast current-selection actions = CONTEXTUAL;
- complete command family = Object menu / Properties;
- one underlying command authority.

### Layers
- Layers panel = PRIMARY;
- Layer menu = SHORTCUT;
- panel footer owns add / duplicate / delete;
- lock and opacity remain visible and functional.

### Right panels
Primary dock destinations:
- Properties
- Layers
- History
- Reference
- Compose
- CHAT
- Revision
- Specialist

Rules:
- Dock = PRIMARY.
- Window menu = SHORTCUT.
- same dock item toggles open/close.
- different item switches panel.
- one primary panel open at a time.
- panel header owns local actions only.
- contextual Advanced may navigate inside Properties but may not own a second panel state.
- no floating panel opener.

### Specialist / diagnostics
- SPECIALIST only.
- never occupy permanent ordinary top chrome.

## 4. Photoshop alignment program

The rebuild must be split into bounded work orders. Do not execute all stages as one large CSS pass.

### P0 — Measurement + current-main source map

No product mutation.

Required outputs:
- current-main visible-control inventory;
- exact Photoshop reference measurement table;
- current INK measurement table;
- Photoshop ↔ INK delta table;
- current selector/state-owner map for each shell surface;
- explicit list of obsolete controls to remove or reclassify.

Gate:

```text
REFERENCE_MEASUREMENTS = LOCKED
CURRENT_VISIBLE_FUNCTIONS_CLASSIFIED = 100%
PRIMARY_HOME_PER_FUNCTION = 1
UNCLASSIFIED_VISIBLE_FUNCTIONS = 0
PRODUCT_MUTATION = 0
```

### P1 — Workstation shell geometry

Only shell geometry:
- top 61 px reference structure;
- menu row;
- contextual row;
- left rail frame;
- center stage;
- right dock/panel boundary;
- bottom status row.

Do not change Core or invent new function authorities.

Gate:
- 1280×1024 capture;
- 960×800 capture;
- containment;
- no overlap/gap;
- health guardrails PASS.

### P2 — Menus + top-right reduction

Use the existing shared application-menu controller.

Required:
- File / Edit / View / Select / Object / Layer / Brush / Window / Help are functional or intentionally absent;
- no dead menu label;
- no oversized permanent file-command cluster;
- workspace/property/inspector duplicates removed or reclassified;
- Escape / outside click / focus behavior retained.

### P3 — Left toolbar

Required:
- edge-attached;
- single-column default;
- actual two-column mode;
- one integrated layout toggle;
- same tool ordering/groups in both modes;
- no tool loss between modes;
- no duplicate permanent tool family.

### P4 — Right panel dock

Use the existing single panel authority established by technical-debt cleanup.

Required:
- collapsed icon rail;
- panel opens inward;
- same-button close;
- different-button switch;
- resizable panel;
- Window menu convergence;
- zero floating edge opener;
- Properties/Advanced/Inspector duplication = 0.

### P5 — Density / typography / visual system

Preserve the cleaned typography authority.

Required:
- one UI font stack;
- semantic type scale only;
- Photoshop-like density/readability;
- lighter INK treatment may differ in color, but spatial hierarchy must remain workstation-like;
- no new cascade-war override layer.

### P6 — Responsive preservation

Only the accepted three layout modes:

```text
DESKTOP_WIDE    > 1120
DESKTOP_NARROW  761–1120
COMPACT         <= 760
```

Responsive changes may reflow/collapse/move a secondary route but may not create:
- a second command taxonomy;
- a second panel authority;
- a second tool system;
- an unrelated mobile navigation product.

### P7 — Full visual/interaction audit

Mandatory evidence:
- first paint;
- 1280×1024 settled;
- 1280×800;
- 960×800;
- short-height desktop;
- compact representative width;
- left toolbar single;
- left toolbar two-column;
- right dock collapsed;
- Properties open;
- Layers open;
- History open;
- one Creative panel open;
- fullscreen;
- browser favicon;
- top-left logo crop;
- top-right controls crop.

No final PASS from source/static QA alone.

## 5. Previously reported UI requirements that remain active

These requirements may not be silently closed:

- Photoshop top structure alignment;
- left toolbar single/two-column behavior;
- edge-attached toolbar;
- right dock with click-active-to-close;
- no floating right-side panel tab;
- no Properties / Inspector / Advanced duplication;
- top-right command cluster simplified;
- one workspace switch;
- narrow desktop uses same grammar as full desktop;
- readable Photoshop-like text density;
- logo/favicon remain correct;
- black startup flash remains zero;
- visible/function duplicate cleanup must be reflected in deployed UI.

## 6. Protected technical-debt baseline

The rebuild inherits these as non-regression contracts:

```text
PRESENTATION_IMPORTANT = 0
SEMANTIC_IMPORTANT = 19 baseline / no presentation use
HARD_CODED_NORMAL_UI_PX_FONT_SIZE = 0
WIDTH_LAYOUT_MODES = 3
VISIBLE_PANEL_STATE_OWNERS = 1
MENU_STATE_CONTROLLER = 1
DUPLICATE_LITERAL_DOM_IDS = 0
VISIBLE_LOGO_AUTHORITY = 1
FAVICON_AUTHORITY = 1
FIRST_PAINT_BLACK_FLASH = 0
FROZEN_CORE_MUTATION = 0
```

The detailed long-term rules are defined in:
`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

## 7. Hard stops

STOP → MR if any implementation requires:
- a new presentation `!important`;
- a new width breakpoint family;
- a second panel/menu state owner;
- hand-editing generated Web/Portable shell output;
- a late appended “final override” CSS block;
- a duplicate visible Primary Home;
- weakening an accepted regression to make a redesign pass;
- Core / Renderer / Document / History / Revision / Geometry / CHAT / persistence change;
- FORMAT_VERSION or product-version change.

## 8. Final acceptance

```text
PS_TOP_CHROME_ALIGNMENT = PASS
PS_WORKSTATION_STRUCTURE = PASS
FUNCTION_CLASSIFICATION = COMPLETE
DUPLICATE_PRIMARY_HOME = 0
DEAD_VISIBLE_CONTROLS = 0
LEFT_TOOLBAR_SINGLE_DUAL = PASS
RIGHT_PANEL_DOCK = PASS
MENU_COMPLETENESS = PASS
TOP_RIGHT_DEDUPLICATION = PASS
TYPOGRAPHY_HEALTH = PASS
RESPONSIVE_GRAMMAR = PASS
FIRST_PAINT_BLACK_FLASH = 0
UI_HEALTH_GUARDRAILS = PASS
DEPLOYED_SCREENSHOT_SET = PASS
FUNCTIONAL_RUNTIME = PASS
USER_REPORTED_UI_ISSUES_OPEN = 0
```

Photoshop alignment is complete only when all structural, functional, visual and health gates pass together.
