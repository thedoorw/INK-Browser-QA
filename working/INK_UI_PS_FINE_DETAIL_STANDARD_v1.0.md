# INK UI — Photoshop Fine Detail Standard v1.0

STATUS: `UR_FINE_DETAIL_AUTHORITY / UI_HOLD_COMPATIBLE / NO_PRODUCT_MUTATION`

DATE: 2026-09-27

BASE_MAIN: `624e9863aaab43d905e71be6eb392df79b2dc98c`

PURPOSE:
Create one exhaustive fine-detail answer key for Photoshop-aligned INK UI work. This standard covers the previously identified 12 detail areas plus explicit Panel Tabs, Panel Options Menu, and active-document-only Document Status Strip rules.

This document does **not** authorize UI implementation while `UI_STATUS = HOLD`.

Related authorities:
- `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
- `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md`
- `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
- `working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`
- `governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

Fixed USER reference pack:
- `ps-1.png` — 1280×1024 — SHA256 `9bb8f329df55f6e6617e32e60a138c6cd21451509465073d4821802482815f76`
- `ps-2.png` — 1280×1024 — SHA256 `df316d46821c2840acf1dad277dca6442b4b093034b9dd809d6cb4aa917860e2`

---

# 0. Fine-detail audit method

Every UI detail must be classified as one of:

- `MEASURED` — numeric value measured from the fixed Photoshop reference.
- `BEHAVIOR_CONFIRMED` — behavior supported by Adobe documentation/reference behavior.
- `VISUAL_REFERENCE_ONLY` — visually observed but not numerically trustworthy.
- `OBSERVED_DENSITY` — useful density evidence, not a hard fixed dimension.
- `ELASTIC` — user-resizable or state-dependent dimension.
- `INK_ADAPTATION` — Photoshop grammar adapted to INK-specific capability.
- `REFERENCE_MISSING` — reference needed; DEV must not invent an arbitrary “Photoshop value.”
- `NOT_APPLICABLE` — Photoshop detail deliberately excluded from INK.
- `CAPABILITY_PENDING` — final content waits for MR capability reconciliation.

For each component the final audit records:

```text
COMPONENT_ID
REFERENCE_SOURCE
APPLICABILITY
GEOMETRY
SPACING
TYPOGRAPHY
ICONOGRAPHY
COLOR_ROLE
BORDER
RADIUS
SHADOW
DEFAULT_STATE
HOVER_STATE
ACTIVE_STATE
FOCUS_STATE
DISABLED_STATE
DRAG_STATE
KEYBOARD_BEHAVIOR
POINTER_BEHAVIOR
RESPONSIVE_BEHAVIOR
STATE_AUTHORITY
PRIMARY_HOME
EVIDENCE_REQUIRED
STATUS
```

No component is “complete” if any applicable field is silently omitted.

---

# 1. Global shell geometry

## 1.1 Top chrome

Measured:

```text
Application/menu content = 24 px
Divider 1                = 1 px
Options content          = 35 px
Divider 2                = 1 px
Workspace origin         = y 61 px
```

Status:
- menu height: `MEASURED / LOCKED_FIXED`
- divider: `MEASURED / LOCKED_FIXED`
- Options height: `MEASURED / LOCKED_FIXED`
- workspace origin: `MEASURED / LOCKED_FIXED`

Acceptance:
- no extra vertical gap;
- no double border;
- left Tools, canvas and right Dock all start at y=61.

## 1.2 Left shell

Measured reference states:

```text
single rail visible = 39 px
divider             = 1 px
canvas x            = 40

double rail visible = 72 px
divider             = 1 px
canvas x            = 73
```

Status:
- exact width: `ELASTIC / REFERENCE_STATE_ONLY`
- edge attachment: `LOCKED_ALIGNMENT`

## 1.3 Right shell

Measured reference states:

```text
collapsed Dock visible = 39 px
expanded panel         = 252 px reference
divider                = 1 px
```

252 px remains `ELASTIC`.

## 1.4 Canvas

Canvas is derived remaining area:
- no screenshot-specific fixed canvas width;
- fills between left and right shell boundaries;
- no normal desktop overlap.

---

# 2. Application Menu — fine detail

This is original detail area 1.

Audit fields:

```text
MENU_BAR_HEIGHT = 24 px content / MEASURED
MENU_LABEL_VERTICAL_ALIGNMENT = REFERENCE_MISSING
MENU_LABEL_LEFT_RIGHT_PADDING = REFERENCE_MISSING
MENU_LABEL_FONT_SIZE = REFERENCE_MISSING
MENU_LABEL_WEIGHT = REFERENCE_MISSING
MENU_LABEL_LINE_HEIGHT = REFERENCE_MISSING
MENU_LABEL_NORMAL_CONTRAST = REFERENCE_MISSING
MENU_LABEL_HOVER_BACKGROUND = REFERENCE_MISSING
MENU_LABEL_OPEN_BACKGROUND = REFERENCE_MISSING
MENU_LABEL_FOCUS_RING = REFERENCE_MISSING
MENU_DROPDOWN_TOP_OFFSET = REFERENCE_MISSING
MENU_DROPDOWN_MIN_WIDTH = REFERENCE_MISSING
MENU_ITEM_HEIGHT = REFERENCE_MISSING
MENU_ITEM_HORIZONTAL_PADDING = REFERENCE_MISSING
MENU_ICON_CHECK_COLUMN_WIDTH = REFERENCE_MISSING
MENU_SHORTCUT_COLUMN_ALIGNMENT = REQUIRED
MENU_SUBMENU_ARROW_POSITION = REFERENCE_MISSING
MENU_SEPARATOR_HEIGHT = REFERENCE_MISSING
MENU_DISABLED_CONTRAST = REFERENCE_MISSING
MENU_SHADOW = REFERENCE_MISSING
MENU_BORDER = REFERENCE_MISSING
MENU_RADIUS = Photoshop-like minimal / exact value REFERENCE_MISSING
```

Required states:
- normal;
- hover;
- open;
- keyboard focus;
- checked;
- disabled;
- submenu-open.

Required interactions:
- click open;
- outside click close;
- Escape close;
- Up/Down navigation;
- Enter/Space activate where applicable;
- submenu keyboard navigation;
- only one application menu open.

Final menu contents remain capability-reconciled separately.

---

# 3. Contextual Options Bar — fine detail

Original detail area 2.

Measured:
- content height = 35 px;
- bottom/top shell dividers = 1 px.

Audit fields:

```text
OPTIONS_HEIGHT = 35 px / MEASURED
CONTROL_HEIGHT = REFERENCE_MISSING
ICON_BUTTON_BOX = REFERENCE_MISSING
INPUT_HEIGHT = REFERENCE_MISSING
SELECT_HEIGHT = REFERENCE_MISSING
NUMERIC_FIELD_MIN_WIDTH = REFERENCE_MISSING
CONTROL_HORIZONTAL_GAP = REFERENCE_MISSING
GROUP_SEPARATOR_WIDTH = REFERENCE_MISSING
GROUP_SEPARATOR_MARGIN = REFERENCE_MISSING
LABEL_CONTROL_GAP = REFERENCE_MISSING
TOOL_ICON_SIZE = REFERENCE_MISSING
DROPDOWN_ARROW_SIZE = REFERENCE_MISSING
FIELD_BORDER = REFERENCE_MISSING
FIELD_RADIUS = REFERENCE_MISSING
FIELD_FOCUS_STATE = REFERENCE_MISSING
DISABLED_STATE = REFERENCE_MISSING
```

Rules:
- controls remain vertically centered;
- context changes without bar-height jump;
- deep settings route to Properties;
- no second Inspector;
- overflow policy must be defined for DESKTOP_NARROW.

States to capture:
- Draw;
- Eraser;
- Select;
- Shape;
- Text;
- Path/Node edit;
- neutral/no-context.

---

# 4. Left Tools — fine detail

Original detail area 3.

Measured evidence:

```text
selected visual fill ≈ 31×24 px
tool row pitch ≈ 26 px
double-column horizontal origin shift ≈ 33 px
top handle strip ≈ 11 px
local divider = 1 px
```

Classify first three as `OBSERVED_DENSITY`.

Audit fields:

```text
TOOL_HITBOX
TOOL_ICON_BOX
TOOL_ICON_VISIBLE_SIZE
TOOL_ICON_STROKE_WEIGHT
TOOL_ROW_PITCH
TOOL_COLUMN_PITCH
TOOL_SELECTED_FILL
TOOL_HOVER_FILL
TOOL_FOCUS_RING
TOOL_DISABLED_CONTRAST
FLYOUT_TRIANGLE_SIZE
FLYOUT_TRIANGLE_OFFSET
TOOL_SECTION_SEPARATOR
TOOL_SECTION_GAP
TOOLTIP_DELAY
TOOLTIP_OFFSET
TOOLTIP_SHORTCUT_FORMAT
LAYOUT_TOGGLE_HITBOX
```

All unspecified numeric values remain `REFERENCE_MISSING`.

Required states:
- normal;
- hover;
- active;
- keyboard focus;
- flyout available;
- flyout open;
- disabled;
- drag/reorder only if toolbar customization is later authorized.

---

# 5. Right Dock / general Panel shell — fine detail

Original detail area 4.

Measured:
- collapsed Dock ≈39 px;
- expanded panel ≈252 px reference;
- header bands ≈28 px;
- stacked splitters ≈3 px.

Audit fields:

```text
DOCK_ICON_BOX
DOCK_ICON_VISIBLE_SIZE
DOCK_ICON_VERTICAL_PITCH
DOCK_GROUP_SEPARATOR
DOCK_ACTIVE_INDICATOR
DOCK_HOVER_STATE
DOCK_FOCUS_STATE
COLLAPSE_ARROW_BOX
PANEL_MIN_WIDTH
PANEL_MAX_WIDTH
PANEL_DEFAULT_WIDTH
PANEL_RESIZE_HANDLE_WIDTH
PANEL_RESIZE_CURSOR
PANEL_BORDER
PANEL_BACKGROUND
PANEL_HEADER_HEIGHT
PANEL_BODY_PADDING_X
PANEL_BODY_PADDING_TOP
PANEL_FOOTER_HEIGHT
PANEL_GROUP_SPLITTER_THICKNESS
PANEL_GROUP_SPLITTER_HITBOX
```

Known:
- header ≈28 px = `OBSERVED_DENSITY`
- splitter ≈3 px = `OBSERVED_DENSITY`
- width = `ELASTIC`

Rules:
- Dock touches right edge;
- no floating external gap;
- resizing reflows canvas;
- one panel authority only.

---

# 6. Layers Panel — fine detail

Original detail area 5.

Audit fields:

```text
LAYER_ROW_HEIGHT
LAYER_ROW_HORIZONTAL_PADDING
LAYER_INDENT_STEP
DISCLOSURE_TRIANGLE_BOX
VISIBILITY_ICON_BOX
LOCK_ICON_BOX
THUMBNAIL_BOX
THUMBNAIL_BORDER
LAYER_NAME_FONT
LAYER_METADATA_FONT
SELECTED_ROW_BACKGROUND
HOVER_ROW_BACKGROUND
DRAG_INSERTION_LINE
DRAG_GHOST
NESTED_GROUP_GUIDE
OPACITY_CONTROL_HEIGHT
FOOTER_HEIGHT
FOOTER_ICON_BOX
FOOTER_BUTTON_PITCH
SCROLLBAR
```

States:
- normal;
- selected;
- hover;
- hidden;
- locked;
- group collapsed;
- group expanded;
- drag reorder;
- drop target;
- rename/edit if supported;
- long-name truncation.

Behavior:
- selection sync;
- drag reorder;
- add/duplicate/delete;
- hierarchy/reparent;
- panel menu separate from footer.

All local pixel values currently `REFERENCE_MISSING` unless later measured.

---

# 7. History Panel — fine detail

Original detail area 6.

Audit fields:

```text
HISTORY_ROW_HEIGHT
STATE_ICON_BOX
STATE_TEXT_INDENT
CURRENT_STATE_INDICATOR
PAST_STATE_APPEARANCE
FUTURE_STATE_APPEARANCE
HOVER_ROW_BACKGROUND
FOCUS_STATE
PANEL_HEADER
PANEL_MENU
SCROLLBAR
EMPTY_STATE
```

Required visual semantics:
- older above newer;
- current distinct;
- future states distinct after reverting;
- History != Revision.

No unsupported Photoshop Snapshot semantics.

---

# 8. Navigator Panel — fine detail

Original detail area 7.

Audit fields:

```text
NAV_THUMBNAIL_MARGIN
NAV_THUMBNAIL_BACKGROUND
NAV_THUMBNAIL_BORDER
PROXY_RECT_LINE_WIDTH
PROXY_RECT_COLOR_ROLE
PROXY_RECT_FILL
ZOOM_ROW_HEIGHT
ZOOM_FIELD_WIDTH
ZOOM_FIELD_HEIGHT
ZOOM_MINUS_BOX
ZOOM_PLUS_BOX
ZOOM_SLIDER_TRACK_HEIGHT
ZOOM_SLIDER_THUMB_SIZE
ZOOM_CONTROL_GAP
PANEL_MENU
```

States:
- normal;
- pan;
- proxy drag;
- zoom input focus;
- minimum/maximum zoom;
- content smaller than viewport;
- very large/infinite workspace.

All geometry except broad panel shell remains `REFERENCE_MISSING`.

---

# 9. Typography System — fine detail

Original detail area 8.

Create semantic tokens, not scattered values.

Required roles:

```text
UI_MENU
UI_CONTROL
UI_PANEL_TAB
UI_PANEL_ROW
UI_PANEL_SECTION_LABEL
UI_SECONDARY
UI_TOOLTIP
UI_STATUS
UI_MONOSPACE_DIAGNOSTIC
```

For every role record:
- family;
- size;
- weight;
- line-height;
- letter spacing;
- normal contrast;
- disabled contrast;
- truncation rule.

Rules:
- one normal UI font authority;
- no raw normal-UI px sizes outside tokens;
- Photoshop-like compactness without returning to previous “too small/too gray” INK problem;
- monospace only for diagnostic/code semantics.

Exact token values:
`REFERENCE_MISSING / TO BE RESOLVED IN FINE-DETAIL VISUAL PASS`

---

# 10. Light-gray Palette / Surface Hierarchy — fine detail

Original detail area 9.

Current screenshots are dark Photoshop references and cannot define the final light-gray palette numerically.

Required semantic roles:

```text
APP_BACKGROUND
MENU_BACKGROUND
OPTIONS_BACKGROUND
TOOLS_BACKGROUND
PANEL_BACKGROUND
PANEL_HEADER_BACKGROUND
PANEL_ACTIVE_TAB
PANEL_INACTIVE_TAB
CANVAS_WORKBENCH_BACKGROUND
CONTROL_BACKGROUND
CONTROL_HOVER
CONTROL_ACTIVE
CONTROL_DISABLED
FIELD_BACKGROUND
FIELD_BORDER
DIVIDER
TEXT_PRIMARY
TEXT_SECONDARY
TEXT_DISABLED
ICON_PRIMARY
ICON_SECONDARY
ACCENT_ACTIVE
SELECTION_FILL
FOCUS_RING
DRAG_TARGET
WARNING
ERROR
```

Rules:
- light-gray Photoshop-like hierarchy;
- subtle 1px boundaries;
- no glassy gradients;
- no large card shadows;
- accent restrained;
- canvas visually distinct from chrome.

All final RGB/hex values:
`REFERENCE_MISSING` until a light-gray Photoshop reference or approved visual derivation is locked.

---

# 11. Scrollbar / Tooltip / Cursor / Focus — fine detail

Original detail area 10, expanded into four explicit submodules.

## 11.1 Scrollbar

Audit:
```text
TRACK_WIDTH
THUMB_WIDTH
MIN_THUMB_LENGTH
TRACK_CONTRAST
THUMB_NORMAL
THUMB_HOVER
THUMB_DRAG
CORNER_BEHAVIOR
PANEL_VS_CANVAS_SCROLLBAR
```

Rule:
- compact;
- visible enough;
- no OS-inconsistent visual break where custom styling is used.

## 11.2 Tooltip

Audit:
```text
DELAY
OFFSET
PADDING
FONT_TOKEN
BACKGROUND
TEXT_COLOR
BORDER
SHADOW
RADIUS
MAX_WIDTH
SHORTCUT_FORMAT
DISMISS_BEHAVIOR
```

Rule:
- tooltips explain icons;
- do not duplicate permanent labels.

## 11.3 Cursor

Required cursor classes:
- default;
- pointer;
- text;
- crosshair if tool semantics require;
- move;
- pan/open-hand;
- pan/closed-hand;
- resize EW;
- resize NS;
- transform rotate if supported;
- drag reorder;
- forbidden/not-allowed.

No custom cursor merely for decoration.

## 11.4 Focus

Required:
- keyboard focus always visible;
- focus ring does not rely on hover;
- menu focus, tool focus, panel tab focus, input focus all have defined state;
- focus visuals must survive light-gray palette.

Numeric values:
`REFERENCE_MISSING`.

---

# 12. Special-State Reference Matrix — fine detail

Original detail area 12.

The current two Photoshop screenshots do not cover all interactive states. Required reference/evidence states:

```text
EMPTY_WORKSPACE
ACTIVE_DOCUMENT
APPLICATION_MENU_OPEN
APPLICATION_SUBMENU_OPEN
TOOL_NORMAL
TOOL_ACTIVE
TOOL_FLYOUT_OPEN
OPTIONS_DRAW
OPTIONS_TEXT
OPTIONS_SELECTION
RIGHT_DOCK_COLLAPSED
RIGHT_PANEL_EXPANDED
PANEL_TAB_ACTIVE_INACTIVE
PANEL_OPTIONS_MENU_OPEN
PANEL_RESIZE_IN_PROGRESS
LAYERS_SELECTED
LAYERS_DRAG_REORDER
HISTORY_MULTISTATE
HISTORY_REVERTED_WITH_FUTURE
NAVIGATOR_NORMAL
NAVIGATOR_PROXY_DRAG
FIELD_FOCUSED
CONTROL_DISABLED
TOOLTIP_VISIBLE
KEYBOARD_FOCUS_VISIBLE
DOCUMENT_STATUS_VISIBLE
DOCUMENT_STATUS_HIDDEN_EMPTY
DESKTOP_NARROW
COMPACT
```

Each state must have either:
- Photoshop screenshot/reference;
- Adobe behavior evidence;
- explicit INK adaptation rationale.

Unknown state:
`REFERENCE_MISSING`, never “assume default.”

---

# 13. Panel Tabs — explicit fine-detail module

Added detail area.

Measured reference:
- panel header/tab band ≈28 px = `OBSERVED_DENSITY`.

Audit fields:

```text
TAB_ROW_HEIGHT
TAB_MIN_WIDTH
TAB_HORIZONTAL_PADDING
TAB_LABEL_FONT_TOKEN
TAB_ICON_BOX
TAB_ACTIVE_INDICATOR
TAB_ACTIVE_BACKGROUND
TAB_INACTIVE_BACKGROUND
TAB_HOVER
TAB_FOCUS
TAB_DRAG_STATE
TAB_CLOSE_CONTEXT_ROUTE
TAB_OVERFLOW_BEHAVIOR
TAB_GROUP_GAP
```

Rules:
- active tab visibly owns body;
- inactive tabs remain readable;
- no duplicate title directly under the tab without reason;
- grouping uses one panel-state authority;
- drag regrouping must not be implied if not implemented.

---

# 14. Panel Options Menu — explicit fine-detail module

Added detail area.

Every panel must declare:
- whether it has a menu;
- exact trigger location;
- actual commands;
- empty/dead menu prohibited.

Audit fields:

```text
PANEL_MENU_TRIGGER_BOX
PANEL_MENU_ICON_SIZE
PANEL_MENU_ICON_OFFSET
PANEL_MENU_POPUP_ANCHOR
PANEL_MENU_POPUP_OFFSET
PANEL_MENU_MIN_WIDTH
PANEL_MENU_ITEM_HEIGHT
PANEL_MENU_ICON_COLUMN
PANEL_MENU_CHECK_COLUMN
PANEL_MENU_SHORTCUT_COLUMN
PANEL_MENU_SEPARATOR
PANEL_MENU_HOVER
PANEL_MENU_FOCUS
PANEL_MENU_DISABLED
PANEL_MENU_CHECKED
PANEL_MENU_SUBMENU
```

Command placement rule:

```text
frequent direct action → panel body/footer
panel-local configuration → panel menu
application-wide action → application menu
persistent selected-object state → Properties/body
diagnostics → Specialist/Help
```

Panel-specific menu inventory must be reconciled for:
- Properties;
- Layers;
- History;
- Navigator;
- Pages;
- Libraries;
- Reference;
- Compose;
- CHAT;
- Revision;
- Specialist.

No decorative menu icon.

---

# 15. Document Status Strip — explicit fine-detail module

This supersedes any generic assumption that INK always has a bottom status bar.

State rule:

```text
NO ACTIVE DOCUMENT
→ DOCUMENT_STATUS_STRIP = HIDDEN
→ RESERVED_BOTTOM_HEIGHT = 0

ACTIVE DOCUMENT
→ DOCUMENT_STATUS_STRIP = ELIGIBLE
→ show only approved document/view telemetry

LAST DOCUMENT CLOSED
→ DOCUMENT_STATUS_STRIP = HIDDEN
```

It belongs to document context, not global application chrome.

Allowed information classes:

### View telemetry
- zoom %;
- view rotation when useful;
- compact fit/view indicator.

### Production telemetry
Pending final capability reconciliation:
- dimensions;
- color mode;
- bit depth;
- ICC/profile;
- other truly production-critical state.

### Context hint
Optional:
- brief active-tool/mode hint.

Prohibited:
- GPU;
- benchmark;
- QA;
- storage;
- update;
- AI provider;
- raw autosave internals;
- History/Revision counts;
- full selection properties;
- duplicated tool properties;
- long Help.

Fine-detail fields:

```text
STATUS_HEIGHT
STATUS_BACKGROUND
STATUS_TOP_BORDER
STATUS_TEXT_TOKEN
STATUS_ITEM_GAP
STATUS_LEFT_PADDING
STATUS_RIGHT_PADDING
ZOOM_CLUSTER_WIDTH
ZOOM_FIELD
VIEW_ROTATION_INDICATOR
DOCUMENT_INFO_SELECTOR
CONTEXT_HINT_REGION
HIDDEN_EMPTY_WORKSPACE_GEOMETRY
ACTIVE_DOCUMENT_TRANSITION
```

All exact pixel values remain `REFERENCE_MISSING` until active-document Photoshop reference is measured.

Decision:
- if only zoom/view data is useful, use a compact bottom view cluster rather than a full-width bar;
- if production telemetry justifies it, use a thin active-document-only strip.

---

# 16. Buttons / Inputs / Selects — cross-component control standard

This is an explicit cross-cutting layer required for the 12 detail areas to be internally consistent.

For every button:
```text
HEIGHT
MIN_WIDTH
ICON_BOX
LABEL_PADDING
BORDER
RADIUS
NORMAL
HOVER
PRESSED
ACTIVE
FOCUS
DISABLED
```

For every input:
```text
HEIGHT
MIN_WIDTH
PADDING
TEXT_ALIGN
BORDER
RADIUS
FOCUS
INVALID
DISABLED
UNIT_SUFFIX
STEPPER
```

For every select/dropdown:
```text
HEIGHT
PADDING
ARROW_BOX
POPUP_ALIGNMENT
SELECTED_ITEM
HOVER
FOCUS
DISABLED
```

Use shared tokens wherever visually identical.

---

# 17. Icon System

Fine-detail requirements:

```text
ICON_GRID
VISIBLE_ICON_SIZE
STROKE_WEIGHT
CAP_STYLE
JOIN_STYLE
OPTICAL_CENTERING
ACTIVE_VARIANT
DISABLED_VARIANT
FLYOUT_MARKER
CHECKMARK
CHEVRON
CLOSE
MORE_MENU
COLLAPSE_EXPAND
```

Rules:
- one icon grammar;
- do not mix unrelated stroke weights;
- icon visual center may differ from geometric center;
- no Adobe proprietary icon asset copy.

---

# 18. Spacing Rhythm

Every local gap must derive from a compact token rhythm.

Required token roles:
```text
SPACE_1
SPACE_2
SPACE_3
SPACE_4
CONTROL_GAP
GROUP_GAP
SECTION_GAP
PANEL_PADDING
MENU_PADDING
```

Exact values:
`REFERENCE_MISSING`.

Rule:
- avoid one-off per-component spacing unless justified by optical alignment.

---

# 19. Border / Radius / Shadow

Required semantic roles:

```text
DIVIDER_1PX
CONTROL_BORDER
ACTIVE_BORDER
FOCUS_BORDER
PANEL_BOUNDARY
MENU_SHADOW
TOOLTIP_SHADOW
FLOATING_DIALOG_SHADOW
```

Rules:
- workstation chrome primarily uses boundaries, not card shadows;
- primary docked surfaces use minimal radius;
- dropdown/menu/tooltip may have compact radius/shadow;
- no “modern glass card” drift.

---

# 20. Animation / Transition

Photoshop alignment does not require decorative animation.

Audit:
```text
MENU_OPEN_TRANSITION
PANEL_COLLAPSE_TRANSITION
DOCK_EXPAND_TRANSITION
TOOL_FLYOUT_TRANSITION
TOOLTIP_APPEAR_DELAY
FOCUS_NO_ANIMATION
REDUCED_MOTION
```

Rules:
- interaction must feel immediate;
- no slow panel easing;
- reduced-motion respected;
- animation never masks geometry/state bugs.

Values:
`REFERENCE_MISSING / DEFAULT TO MINIMAL`.

---

# 21. Responsive fine-detail rules

Existing width modes remain:
```text
DESKTOP_WIDE >1120
DESKTOP_NARROW 761–1120
COMPACT <=760
```

For every fine-detail component record:
- remains identical;
- compresses;
- hides label;
- changes to icon-only;
- moves to overflow;
- becomes touch-sized;
- becomes sheet/popover.

No new width family.

---

# 22. Accessibility fine-detail rules

Every interactive visual state must have semantic equivalent.

Required:
- visible focus;
- aria pressed/selected/expanded;
- disabled semantics;
- labels for icon-only controls;
- keyboard-accessible menu/tab traversal;
- sufficient contrast in light-gray palette;
- no color-only active distinction.

---

# 23. Reference acquisition backlog

To convert all `REFERENCE_MISSING` fields to measured values, acquire or capture:

1. Photoshop light-gray workspace at matched Windows scaling.
2. Application menu open.
3. submenu open.
4. active + inactive panel tabs.
5. panel options menu open.
6. Layers populated and selected.
7. Layers drag reorder.
8. History with multiple states.
9. History after reverting to an earlier state.
10. Navigator with active document.
11. tool flyout open.
12. Options bar for at least Draw/Text/Selection.
13. tooltip visible.
14. keyboard focus state.
15. disabled controls.
16. active document with Photoshop status bar visible.
17. empty workspace with no status bar.
18. panel resize state.
19. scrollbar hover/drag state.
20. narrow Photoshop workspace if behavior differs.

These captures are evidence acquisition, not product implementation.

---

# 24. Fine-detail completion gate

The standard itself is complete when every intended category exists and every unknown is explicitly marked.

```text
FINE_DETAIL_DOMAINS_DEFINED = PASS
MENU_DETAIL_FIELDS = PASS
OPTIONS_DETAIL_FIELDS = PASS
TOOLS_DETAIL_FIELDS = PASS
PANEL_SHELL_DETAIL_FIELDS = PASS
LAYERS_DETAIL_FIELDS = PASS
HISTORY_DETAIL_FIELDS = PASS
NAVIGATOR_DETAIL_FIELDS = PASS
TYPOGRAPHY_FIELDS = PASS
LIGHT_GRAY_PALETTE_FIELDS = PASS
SCROLLBAR_TOOLTIP_CURSOR_FOCUS_FIELDS = PASS
SPECIAL_STATE_MATRIX = PASS
PANEL_TAB_FIELDS = PASS
PANEL_OPTIONS_FIELDS = PASS
DOCUMENT_STATUS_FIELDS = PASS
CONTROL_SYSTEM_FIELDS = PASS
ICON_SYSTEM_FIELDS = PASS
SPACING_FIELDS = PASS
BORDER_RADIUS_SHADOW_FIELDS = PASS
RESPONSIVE_FIELDS = PASS
ACCESSIBILITY_FIELDS = PASS
SILENTLY_UNSPECIFIED_DETAIL_CLASSES = 0
PRODUCT_MUTATION = 0
```

The UI is **not** ready for pixel-fidelity closure until all applicable `REFERENCE_MISSING` items have either:
- measured Photoshop evidence;
- documented Adobe behavior evidence;
- explicit INK adaptation approval.

---

# 25. AI implementation audit contract

At implementation review the AI must produce a table:

| Component | Field | Target | Actual | Evidence | Result |
|---|---|---|---|---|---|

Result values:
- PASS
- FAIL
- ELASTIC_VALID
- NOT_APPLICABLE
- BLOCKED_REFERENCE_MISSING

Final rule:

```text
NO SILENT DEFAULTS
NO “CLOSE ENOUGH” WITHOUT EVIDENCE
NO DEV-INVENTED PHOTOSHOP DIMENSIONS
NO DEAD PANEL MENU
NO GLOBAL ALWAYS-ON DOCUMENT STATUS STRIP
NO DUPLICATE STATE AUTHORITY
```

---

# 26. Current status

This Fine Detail Standard is **structurally complete** for the Photoshop-aligned workstation preparation stage.

It intentionally distinguishes:
- what is already measured;
- what is behavior-confirmed;
- what is elastic;
- what belongs to INK adaptation;
- what still needs a reference capture.

Therefore MR may continue capability work independently while UR continues filling the remaining `REFERENCE_MISSING` Photoshop fine-detail values without changing product UI.
