# INK Final UI — Photoshop Alignment Spec v1.0

STATUS: `FINAL_UI_SPEC / IMPLEMENTATION_READY / UR_AUTHORITY`

DATE: 2026-09-26

BASE_MAIN: `b1374ecec242b8206aa3000a784c7498e0044030`

CAPABILITY_AUTHORITY:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
STATUS = `FROZEN / POST-CONNECTOR-005 / UI-AUTHORITATIVE`

REFERENCE_MEASUREMENT:
`working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`

USER DIRECTION:

> INK should become a near-complete light-gray Photoshop-style workstation, while preserving INK capability semantics and one authoritative route per function.

This document is the final Photoshop-alignment design contract for the UI implementation program. It describes **what must visually/behaviorally align**. Function placement is authoritative in:
`working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`

Completion is audited against:
`working/INK_UI_FINAL_AI_COMPLETION_CHECKLIST_v1.0.md`

---

# 1. Evidence hierarchy

When evidence conflicts, use this order:

```text
Photoshop behavior
→ Adobe official documentation

Photoshop captured geometry
→ fixed USER screenshots + measurement sheet

INK actual rendered geometry
→ Runtime DOM/computed geometry

visual mismatch
→ screenshot overlay / edge difference

implementation cause
→ CSS / DOM / source

perceptual quality
→ USER + CHAT visual review
```

Official Adobe behavior references:
- Workspace overview:
  https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/workspace-overview.html
- Customize toolbar:
  https://helpx.adobe.com/photoshop/desktop/get-started/set-up-toolbars-panels/customize-the-toolbar.html
- Arrange/group panels:
  https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/manipulate-panel-groups.html
- Navigator:
  https://helpx.adobe.com/photoshop/using/viewing-images.html
- History:
  https://helpx.adobe.com/photoshop/desktop/get-started/set-up-toolbars-panels/history-panel-overview.html
  https://helpx.adobe.com/photoshop/desktop/get-started/set-up-toolbars-panels/manage-image-states.html
- Hide/show panels:
  https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/hide-show-panels.html

Adobe's current workspace model still defines an Application bar, Panels, Tools panel, Document window and Options bar. Panels may be grouped/stacked and tools are organized by related functions. Options bar settings depend on the active tool.

---

# 2. Fixed Photoshop reference pack

USER captures:

```text
ps-1.png
1280 × 1024
SHA256 9bb8f329df55f6e6617e32e60a138c6cd21451509465073d4821802482815f76

ps-2.png
1280 × 1024
SHA256 df316d46821c2840acf1dad277dca6442b4b093034b9dd809d6cb4aa917860e2
```

Roles:

### ps-1
- double-column left Tools state;
- expanded right stacked-panel state;
- panel header/splitter density;
- major edge alignment.

### ps-2
- single-column left Tools state;
- collapsed right icon-dock state;
- major edge alignment.

The centered Photoshop About dialog in ps-2 is excluded from shell geometry.

The Windows taskbar occupies the bottom 30 px. Normalize comparison to Photoshop application area:

`1280 × 994`

---

# 3. Hard geometry contract

## 3.1 Top shell

Measured Photoshop reference:

```text
Application/menu content   24 px
divider                     1 px
Options content            35 px
divider                     1 px
TOTAL WORKSPACE ORIGIN     61 px
```

Required:
- application/menu row visually ends at the first divider;
- contextual Options row ends at the second divider;
- canvas, left Tools and right Dock all begin at y=61;
- no accidental extra gap/overlap.

`PS_TOP_CHROME = 61PX_LOCKED`

## 3.2 Dividers

Major workstation dividers:
- 1 px;
- continuous;
- no double-border appearance;
- no 2–4 px accidental gaps created by margins.

## 3.3 Left Tools states

Reference states:

```text
single visible rail = 39 px
+ divider           = 1 px
canvas begins       = x 40

double visible rail = 72 px
+ divider           = 1 px
canvas begins       = x 73
```

Exact widths are reference states; edge continuity is mandatory.

## 3.4 Right collapsed Dock

Reference:

```text
collapsed visible dock = 39 px
divider                = 1 px
```

The Dock:
- touches the application right edge;
- never floats with an outer gap;
- never overlays the canvas as ordinary desktop behavior.

## 3.5 Expanded Panels

Reference expanded right state:
- 252 px captured width;
- **elastic reference only**.

Rules:
- user-resizable;
- width must not be hard-frozen only to match the screenshot;
- canvas fills remaining width;
- resizer remains functional;
- panel state and Window menu stay synchronized.

## 3.6 Canvas

Canvas/workbench is derived space:
- left = right edge of Tools;
- right = left edge of Dock/expanded panel system;
- top = 61 px;
- bottom = accepted INK bottom/status boundary;
- no hard-coded screenshot canvas width.

---

# 4. Overall Photoshop workstation grammar

Target desktop hierarchy:

```text
Application / Menu row
Contextual Options row
┌─────────────┬───────────────────────────────┬────────────────────┐
│ Tools       │ Canvas / Document workspace   │ Dock / Panels      │
└─────────────┴───────────────────────────────┴────────────────────┘
Low-noise status / zoom / view controls
```

Rules:
- canvas remains dominant;
- UI chrome remains compact and edge-attached;
- avoid floating rounded-card desktop grammar for primary workstation surfaces;
- use a quiet light-gray Photoshop-like chrome;
- preserve INK branding rather than Adobe assets/logo;
- no fake Photoshop feature that is outside the frozen INK capability baseline.

---

# 5. Application menu bar

Final top-level taxonomy:

```text
File
Edit
Image
Layer
Type
Select
Object
Filter
View
Window
Help
```

Rationale:
- follows Photoshop ordering closely;
- historical Photoshop `3D` is omitted;
- vector-centric `Object` is an INK-required menu;
- old top-level `Brush` is removed; Brush belongs to Tools + Options/Properties.

Requirements:
- every visible top-level label opens a functional menu;
- `DEAD_MENU_LABELS = 0`;
- one shared application-menu controller;
- click, outside-click, Escape and keyboard navigation behave consistently;
- separators, check marks and disabled states are visually coherent;
- keyboard shortcuts are right-aligned where shown;
- no permanent duplicate New/Open/Save group in desktop top chrome after File menu becomes authoritative;
- Window menu is a secondary route to the same Panel authority.

---

# 6. Contextual Options row

Photoshop behavior target:
- displays controls for the selected tool/current editing context;
- does not become a second Inspector.

INK contexts:

### Draw family
- current tool identity;
- foreground/current color;
- size;
- opacity;
- accepted stroke/preset controls.

### Eraser
- eraser options/mode;
- size/opacity where supported.

### Selection
- context-relevant actions only;
- persistent/global commands remain in menus/panels.

### Shape
- shape type;
- immediate creation options.

### Text
- font family and immediate text settings;
- commit/cancel while editing.

### Path/Node edit
- selected-node immediate actions only where efficient.

Requirements:
- contextual content switches without layout jump;
- labels remain readable;
- deeper parameters route to Properties;
- no duplicate command/state authority.

---

# 7. Left Tools panel

Only persistent canvas interaction modes belong here.

Frozen current modes:

```text
Pen
Pencil
Marker
Brush
Airbrush
Eraser
Select
Lasso
Shape
Text
Image
Pan
```

Grouping:
- Pen / Pencil / Marker / Brush / Airbrush share one Draw flyout;
- remaining persistent modes have normal tool slots unless later usability evidence justifies grouping.

Required Photoshop-like behavior:
- edge-attached vertical rail;
- single/double-column mode;
- same tools in both modes;
- active tool clearly selected;
- hover/focus state;
- flyout indicator for grouped tools;
- dense icon-first layout;
- tool labels are not permanently consuming desktop rail width;
- layout toggle belongs to the Tools system;
- keyboard shortcuts remain functional.

Reference density:
- selected visual fill ≈ 31 × 24 px;
- tool row pitch ≈ 26 px;
- density is guidance, not a separate hard contract.

Not allowed:
- Boolean / Group / Align / Repeat / export / diagnostics as tool slots.

---

# 8. Right Dock / Panel system

One state authority owns:
- collapsed icon Dock;
- opened Panel(s);
- Window-menu state;
- resize state.

Required Photoshop behavior:
- right-edge Dock;
- collapsed icon presentation;
- expand/collapse;
- panel width resize;
- panel groups/tabs;
- vertical stacking/grouping may exist inside the one authority;
- panel header/tab density comparable to Photoshop;
- panel body scrolls rather than overflowing over canvas;
- clicking Window menu and Dock reaches the same panel state;
- active panel indication is unambiguous;
- no duplicate floating edge opener.

Final panel inventory:

### Core editor
- Properties
- Layers
- History
- Navigator
- Pages

### INK creative
- Libraries
- Reference
- Compose
- CHAT
- Revision

### Advanced
- Specialist

`Libraries` means the installed Connector-005 read-only Creative Library Search surface, **not** a full Library Manager.

---

# 9. Properties

Properties is the primary state/parameter surface for:
- selected object;
- transform values;
- fill/stroke/opacity;
- material appearance;
- Path/Node editing state;
- Frame/Layout state;
- LayoutItem constraints/sizing;
- Component instance state/allowed override;
- document/layout settings;
- tool deeper settings where applicable.

Rules:
- direct manipulation remains primary for move/resize/rotate;
- Properties refines state numerically;
- Properties must not become a second execution engine.

---

# 10. Layers

Required:
- clear hierarchy;
- selection sync with canvas;
- visibility;
- lock;
- opacity where supported;
- add;
- duplicate;
- delete;
- direct drag reorder;
- hierarchy/reparent behavior where accepted;
- compact footer/action row;
- scrollable long lists;
- Layer menu and Layers panel converge on same document authority.

No old three-button/duplicate UI should remain elsewhere when Layers owns the operation.

---

# 11. History

Installed authority:
- History inspect;
- Undo;
- Redo.

Photoshop parity requirement:
- older states above, newer below;
- current state visibly selected;
- click earlier state reverts;
- later states visually communicate future/discard status;
- subsequent editing from an earlier state follows existing History semantics;
- Undo/Redo and panel-state selection converge;
- Step Backward / Step Forward may be secondary Edit routes;
- History-limit control belongs to History options, not global chrome.

Boundary:
`History != Revision`

Do not add Photoshop snapshots/non-linear history unless separately authorized by Core semantics.

---

# 12. Navigator

Mandatory new panel.

Required:
- thumbnail/overview of current artwork/document extent;
- proxy rectangle for current main viewport;
- proxy updates when canvas pans/zooms;
- dragging proxy pans main canvas;
- clicking thumbnail repositions view;
- zoom percentage input/readout;
- Zoom Out;
- zoom slider;
- Zoom In;
- two-way synchronization;
- Window > Navigator + Dock route to same panel.

Boundary:
- no second renderer;
- no second camera authority;
- no second document state;
- if an accurate overview requires new Renderer semantics, STOP → MR.

For INK infinite canvas:
- Navigator overview uses document/artboard/content extent + current viewport;
- it does not pretend to preview infinite space.

---

# 13. Pages

Normalize existing Pages UI into normal panel grammar.

Required:
- Window > Pages;
- right-side panel/dock destination;
- Add Page local action;
- list/selection/state;
- existing top Pages button removed or explicitly classified as secondary shortcut;
- no second Pages state owner.

---

# 14. Libraries — Connector-005

Installed public tool:
`search_ink_library`

Searchable families:
- component;
- material;
- recipe;
- parametric-structure;
- reference-derived-structure.

Required UI:
- right panel `Libraries`;
- search;
- family/type filter;
- result list;
- inspect/details;
- read-only status where appropriate;
- selected result may route to existing governed native use/apply/create operations.

Boundaries:
- no full Library Manager;
- no remote/cloud asset search;
- no automatic tagging;
- no second Component/Material/Recipe/Repeat authority;
- no autonomous apply.

---

# 15. Reference

Primary home for:
- local reference import;
- reference decomposition/vectorization;
- research-to-creation advisory readout at accepted scope;
- reference-derived structures.

Keep engineering evidence/package tooling in Specialist unless it is a normal creative action.

---

# 16. Compose

Primary home for:
- composition/structure state;
- Repeat/parametric status;
- reusable creative structural controls that are not transient tool options.

Mutation continues through existing native Object/Repeat/command authority.

---

# 17. CHAT

Primary visible collaboration surface for:
- grounded context;
- proposal;
- approval;
- execute;
- Creative Plan;
- rollback where accepted;
- Creative Memory/Research advisory reads;
- capability/library use through installed named tools.

Rules:
- panel open state never gates CHAT capability;
- CHAT does not become a second editor engine;
- mutating operations remain proposal/approval governed;
- raw provider/credential engineering controls stay out of ordinary CHAT presentation.

---

# 18. Revision

Primary for:
- list;
- capture;
- restore;
- provenance;
- accepted structural compare.

Boundary:
- not History;
- do not invent rendered overlay/wipe/difference where current Core only guarantees structural/grounded compare.

---

# 19. Specialist

Specialist contains engineering/advanced surfaces, not normal creative chrome:

- AI provider/credential/transport settings;
- raw JSON command execution;
- GPU validation;
- renderer selection;
- Program/Recipe engineering;
- external software evidence packaging;
- device/stylus calibration;
- benchmark;
- QA reports;
- release/storage diagnostics;
- update diagnostics.

It should be de-emphasized in normal workstation use.

---

# 20. View / Fullscreen / status

Required:
- View menu owns view-level one-shot commands;
- Fullscreen behaves reliably and has visible on/off state;
- fit/reset/zoom/rotation controls converge on existing viewport authority;
- bottom status is low-noise;
- useful zoom/readout remains accessible;
- status controls do not duplicate Navigator state ownership.

---

# 21. Workspace / document title / top-right cleanup

Required:
- document title remains editable but visually Photoshop-like;
- workspace mode switch uses compact application-level grammar;
- remove redundant desktop File buttons;
- no separate Inspector toggle when Dock/Window already owns panel visibility;
- no overlapping “Properties / Inspector / Advanced / edge-tab” controls;
- Advanced/context button may be a shortcut into Properties but must visibly reflect open state;
- fullscreen retains a clear single home/shortcut.

---

# 22. Typography

User requirement: Photoshop-like readability, not tiny dim text.

Rules:
- one normal UI font authority;
- semantic size tokens;
- no raw normal-UI px sizes outside tokens;
- regular command labels must be clearly readable;
- secondary metadata may be smaller/dimmer but not below usability threshold;
- menu/panel text hierarchy resembles Photoshop density;
- no decorative typography;
- no layout distortion from oversized labels.

---

# 23. Light-gray visual system

The USER target is a **light-gray Photoshop-style** INK workstation.

Rules:
- use light gray chrome hierarchy;
- subtle 1px boundaries;
- canvas/workbench differentiated from chrome;
- quiet hover/active treatment;
- no glossy glass-card aesthetic on desktop primary surfaces;
- no large rounded corners for primary workstation edges;
- avoid excessive shadows;
- INK accent color used sparingly for active/selection state;
- do not copy Adobe logo, proprietary graphic assets or branding.

Dark Photoshop screenshot RGB values are geometry-reading evidence only, not final INK palette constants.

---

# 24. Icons and controls

Required:
- consistent icon box size;
- consistent stroke weight;
- Photoshop-like dense target size;
- active/hover/focus/disabled states;
- flyout indicators;
- arrows/chevrons clearly signal collapse/expand;
- no decorative indicator dots unless semantically needed;
- no dead controls;
- tooltips/aria labels remain meaningful.

---

# 25. Branding / favicon / first paint

Required:
- one visible INK logo authority;
- one favicon authority;
- approved INK source asset remains clear at workstation size;
- no stale old favicon;
- no initial black/dark flash;
- first visible frame already matches accepted light-gray workstation;
- BUILD_ID/service worker updated when needed to prevent stale shell.

---

# 26. Responsive

Width taxonomy remains:

```text
DESKTOP_WIDE    > 1120
DESKTOP_NARROW  761–1120
COMPACT         <= 760
```

Rules:
- no fourth width family;
- same product semantics across sizes;
- desktop narrow may hide/reflow nonessential labels;
- compact/mobile uses touch-sized alternate routes;
- responsive copies are `RESPONSIVE`, not additional Primary Homes;
- no right panel covering unusable portions of canvas;
- no overflow from menu/options chrome.

---

# 27. Accessibility / interaction completeness

Required:
- keyboard focus;
- Escape closes menus;
- outside click closes application menus;
- menu arrow navigation;
- tool and panel active states expressed through aria/state;
- disabled commands reflect actual availability;
- panel resize cursor/interaction;
- no unreachable control;
- no text-only state that visually contradicts underlying state.

---

# 28. UI engineering health

Mandatory:
```text
PRESENTATION_IMPORTANT_NEW = 0
WIDTH_LAYOUT_MODES = 3
NEW_UNAUTHORIZED_WIDTH_THRESHOLD = 0
PANEL_STATE_OWNERS = 1
MENU_STATE_CONTROLLERS = 1
DUPLICATE_LITERAL_DOM_IDS = 0
PRIMARY_HOME_PER_FUNCTION = 1
DEAD_VISIBLE_CONTROLS = 0
HARD_CODED_NORMAL_UI_PX_FONT_SIZE = 0
HAND_EDITED_GENERATED_SHELL = 0
FINAL_OVERRIDE_LAYER_ADDED = 0
FIRST_PAINT_BLACK_FLASH = 0
FROZEN_CORE_MUTATION = 0
```

Edit accepted CSS/DOM authority; do not append stronger final override layers.

---

# 29. Runtime / visual acceptance

For each major implementation phase:
1. source/static QA;
2. Runtime geometry report;
3. screenshot at 1280 × 1024;
4. screenshot at 960 × 800;
5. relevant compact/mobile evidence;
6. compare fixed Photoshop boundaries;
7. 50% overlay / edge difference for major shell geometry;
8. interaction evidence;
9. health delta.

Final closure:
```text
OPEN_CHECKLIST_ITEMS = 0
UNCLASSIFIED_FUNCTIONS = 0
DEAD_VISIBLE_CONTROLS = 0
DUPLICATE_PRIMARY_HOME = 0
USER_REPORTED_OLD_ISSUES = 0
PHOTOSHOP_ALIGNMENT_REVIEW = PASS
FUNCTIONAL_RUNTIME = PASS
INTEGRATED_CURRENT_MAIN = PASS
```

A branch-only screenshot is not final closure evidence.
