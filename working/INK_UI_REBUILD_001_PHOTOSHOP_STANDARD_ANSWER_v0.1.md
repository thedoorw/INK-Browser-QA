# INK UI REBUILD 001 — Photoshop Standard Answer v0.1

STATUS: `UR_PRE_C3_REFERENCE / NO_PRODUCT_CHANGE`

PURPOSE:
Create one stable answer key for Photoshop-aligned INK UI work before implementation. This document defines what counts as authoritative when screenshots, CSS, Runtime geometry and visual judgment disagree.

REFERENCE FILE:
- `working/INK_UI_REBUILD_001_PS_REFERENCE_MEASUREMENT_SHEET_v0.1.md`

FIXED USER CAPTURES:
- `ps-1.png` — 1280 × 1024 — Photoshop dark workspace, double-column toolbar, expanded right panels
- `ps-2.png` — 1280 × 1024 — Photoshop 21.2.12 About overlay, single-column toolbar, collapsed right dock

## 1. Authority hierarchy

### 1.1 Adobe official documentation = behavior authority

Use Adobe official documentation to answer:
- what a Photoshop workspace surface does;
- how panels dock, group, collapse and expand;
- how toolbar grouping works;
- how Navigator behaves;
- how History behaves;
- what an Options bar is expected to expose.

Do not use Adobe docs as the sole authority for the pixel size of the USER's fixed 1280 × 1024 captures.

Official references used by this program:

1. Workspace overview
   https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/workspace-overview.html
   - Application bar contains workspace switcher, menus and controls.
   - Panels monitor/modify work and can be grouped/stacked.
   - Tools panel groups related creation/editing tools.
   - Document window is the primary document surface.
   - Options bar exposes settings for the currently selected tool.

2. Customize toolbar
   https://helpx.adobe.com/photoshop/desktop/get-started/set-up-toolbars-panels/customize-the-toolbar.html
   - toolbar is for commonly used persistent tools;
   - tools may be grouped;
   - tools/groups may be rearranged;
   - less-used tools may move to Extra Tools;
   - toolbar customization is reached from Edit > Toolbar.

3. Dock / undock panels
   https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/dock-undock-panels.html
   - Window opens panels;
   - panels dock by tab;
   - panel groups dock by title bar;
   - panels/groups can be undocked or made floating.

4. Expand / collapse panel icons
   https://helpx.adobe.com/ca/photoshop/desktop/get-started/learn-the-basics/collapse-expand-icons.html
   - dock can collapse to icons;
   - a single panel icon can expand;
   - double-arrow collapses/expands the dock;
   - dock width can be changed so labels appear/disappear;
   - panel icons can be reordered.

5. Arrange / group panels
   https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/manipulate-panel-groups.html
   - Window selects panels;
   - tabs can be moved within/between groups;
   - grouped panels remain a workspace arrangement, not separate application authorities.

6. Save custom workspaces
   https://helpx.adobe.com/photoshop/desktop/get-started/learn-the-basics/save-custom-workspaces.html
   - panel locations, shortcuts, menus and toolbar arrangement can be captured by a workspace.

7. Navigator
   https://helpx.adobe.com/photoshop/using/viewing-images.html
   - Window > Navigator;
   - artwork thumbnail;
   - proxy view area matching the visible document area;
   - zoom text field;
   - Zoom Out;
   - zoom slider;
   - Zoom In;
   - drag proxy to pan;
   - click thumbnail to reposition visible area.

8. History panel
   https://helpx.adobe.com/photoshop/desktop/get-started/set-up-toolbars-panels/history-panel-overview.html
   https://helpx.adobe.com/photoshop/desktop/get-started/set-up-toolbars-panels/manage-image-states.html
   - Window > History;
   - each edit creates a history state;
   - older states precede newer states;
   - click a state to revert to it;
   - later states can become dimmed and can be discarded by continuing from an earlier state;
   - Step Backward / Step Forward converge with the same history authority;
   - snapshots/non-linear history exist in Photoshop but are not automatically required in INK.

### 1.2 Fixed USER screenshots = visual / captured-geometry authority

The fixed screenshots define:
- shell proportions;
- edge relationships;
- visual density;
- relative spacing;
- tool/panel arrangement;
- the actual 1280 × 1024 reference state.

They do **not** make every resizable Photoshop panel width a permanent product constant.

### 1.3 Photoshop measurement sheet = numeric reference authority

Use:
`working/INK_UI_REBUILD_001_PS_REFERENCE_MEASUREMENT_SHEET_v0.1.md`

Locked structural result:

```text
menu content       24 px
divider             1 px
options content    35 px
divider             1 px
TOTAL              61 px
```

Elastic captured states:

```text
single left rail visible region      39 px
double left rail visible region      72 px
collapsed right dock visible region  39 px
expanded right panel reference      252 px
```

Elastic values are reference-state values. Docking, edge continuity and resizing behavior are the true contract.

### 1.4 INK Runtime computed geometry = implementation truth

Final INK geometry must be read from the running product, not inferred only from CSS declarations.

Use:
- `getBoundingClientRect()`;
- `getComputedStyle()`;
- matched viewport screenshots.

CSS/DOM source explains the cause. Runtime geometry proves the result.

## 2. Fixed screenshot interpretation

### ps-1

Role:
- double-column Photoshop tool panel reference;
- expanded/right stacked-panel reference;
- panel tab/header density;
- major shell edge reference.

Top menu visible in the fixed capture:

```text
File
Edit
Image
Layer
Type
Select
Filter
3D
View
Window
Help
```

The capture is an older Photoshop generation. The visible `3D` menu is therefore a screenshot-specific historical feature, not a requirement for INK.

### ps-2

Role:
- single-column Photoshop tool panel reference;
- collapsed icon-dock reference;
- full shell edge reference.

The About overlay identifies the captured Photoshop version as `21.2.12`.

The About dialog is an excluded overlay and must not affect shell geometry.

## 3. Photoshop workstation grammar to reproduce

INK should follow this structure:

```text
application/menu row
→ contextual Options row
→ edge-attached left Tools panel
→ dominant document/canvas area
→ edge-attached right panel dock / grouped panels
→ compact view/status controls where justified
```

### 3.1 Menu/Application row

Contract:
- visually compact;
- top-level command taxonomy;
- workspace/menu controls live here, not large floating cards;
- commands must not exist as dead labels.

### 3.2 Options row

Contract:
- current selected tool determines the controls;
- no second unrelated tool-settings system;
- immediate controls only;
- deeper state belongs in Properties/other panels.

INK mapping:
- draw: color / size / opacity / stroke preset;
- eraser: eraser mode/options;
- selection: contextual selection operations;
- shape: shape type/immediate creation options;
- text: font/immediate type controls;
- path edit: selected-node immediate controls where useful.

### 3.3 Left Tools panel

Contract:
- persistent canvas interaction modes only;
- related tools may share one slot/flyout;
- single- and double-column layouts expose the same tool set;
- one toolbar authority;
- no one-shot document/object command should be added merely to fill empty slots.

INK persistent tools currently qualifying:
- Pen
- Pencil
- Marker
- Brush
- Airbrush
- Eraser
- Select
- Lasso
- Shape
- Text
- Image
- Pan

Current grouping target:
- Pen/Pencil/Marker/Brush/Airbrush = one grouped draw slot;
- remaining persistent modes = individual slots unless a later usability review justifies grouping.

Photoshop parity gaps that may be evaluated later:
- dedicated Zoom tool;
- foreground/background color-swatch grammar;
- toolbar customization / Extra Tools behavior.

These are not authorized features merely because Photoshop has them.

### 3.4 Right Panels / Dock

Contract:
- Window menu and dock converge on the same panel;
- panels may group/stack;
- compact icon mode is legitimate;
- expanded width is elastic;
- same dock/panel state must not be represented by a second floating authority.

Priority panels:
- Properties
- Layers
- History
- Navigator
- Reference
- Compose
- CHAT
- Revision

Advanced:
- Specialist

Additional INK surface to normalize:
- Pages should become a normal panel/window destination rather than depend on a unique top-button grammar.

### 3.5 History

Photoshop answer:
- chronological states;
- current state selected;
- older → newer ordering;
- click earlier state = revert;
- later states communicate their future/discard status;
- Step Backward/Forward and Undo/Redo converge.

INK rule:
- existing `HistoryManager` remains sole operation-history authority;
- UI may be redesigned;
- History must not become Revision.

### 3.6 Navigator

Photoshop answer:
- thumbnail;
- proxy rectangle;
- proxy drag = pan;
- thumbnail click = reposition;
- zoom value;
- Zoom Out;
- slider;
- Zoom In;
- two-way synchronization with the main document view.

INK rule:
- use existing viewport/render/document authority;
- no second camera/document/renderer state.

### 3.7 Layers

Photoshop grammar to preserve:
- Layers is a primary structural panel;
- compact per-layer state;
- panel-local create/delete/reorder controls;
- layer ordering should be directly manipulable;
- Layer menu is a secondary command route, not a second layer model.

INK target:
- drag reorder;
- add;
- duplicate;
- delete;
- lock;
- visibility;
- opacity;
- grouping where supported.

### 3.8 Panel sizing

Rule:

```text
match the boundary behavior
not one arbitrary screenshot width
```

A user-resized valid panel is not a visual regression just because it no longer equals 252 px.

Fail when:
- panel stops docking;
- canvas no longer fills the remaining area;
- overlap/gap appears;
- panel cannot collapse/expand correctly;
- panel state no longer converges with Window menu;
- resize state creates a second layout authority.

## 4. Target INK top-menu grammar — pre-C3

To stay close to the fixed Photoshop screenshot while preserving INK's vector nature, use this as the pre-C3 target taxonomy:

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

Interpretation:
- preserve Photoshop-like ordering;
- omit historical `3D`;
- use that conceptual slot for INK's vector-centric `Object`;
- remove `Brush` as a top-level menu candidate; Brush belongs primarily in Tools + Options/Properties/Brush panel grammar.

This taxonomy is a UI planning target, not final until C3 capability freeze.

## 5. Evidence model for later acceptance

Every major UI phase should produce:

```text
A. fixed Photoshop reference
B. Photoshop pixel measurement
C. INK Runtime computed geometry
D. matched INK screenshot
E. edge / overlay / difference comparison
F. USER + CHAT visual review
```

Conflict rule:

```text
behavior
→ Adobe official documentation

captured PS size
→ fixed PS screenshot + measurement sheet

actual INK size
→ Runtime computed geometry

visual mismatch
→ screenshot overlay / edge difference

implementation cause
→ CSS / DOM / source

perceptual quality
→ USER + CHAT review
```

## 6. Reference change control

Do not silently change the answer key.

A replacement Photoshop reference must record:
- new image identity;
- dimensions;
- Photoshop/workspace state when known;
- which previous reference it supersedes;
- which measurements remain valid;
- which measurements must be re-measured.

## 7. Current lock

```text
PS_BEHAVIOR_AUTHORITY = ADOBE_OFFICIAL_DOCS
PS_VISUAL_AUTHORITY = USER_FIXED_SCREENSHOTS
PS_NUMERIC_AUTHORITY = PS_REFERENCE_MEASUREMENT_SHEET
INK_RENDERED_AUTHORITY = RUNTIME_COMPUTED_GEOMETRY
PANEL_RESIZABILITY = ELASTIC
TOP_CHROME = 61PX_LOCKED
TOP_MENU_TAXONOMY = PRE_C3_TARGET
PRODUCT_MUTATION = 0
```
