# INK UI REBUILD 001 — Function Placement Map v0.1

STATUS: `UR_PRE_C3_COMPLETE_CURRENT_BASELINE / FINAL_LOCK_PENDING_C3`

PURPOSE:
Account for every current INK UI function family before the Photoshop-aligned rebuild, prevent duplicate homes, and define whether each function belongs in:
- left Tools panel;
- top application menu;
- contextual Options row;
- right panel dock;
- panel-local controls;
- Specialist/diagnostics;
- hidden/internal UI;
- responsive alternate placement.

This is a complete **current-main** placement map. C3 may change technical availability; rows marked `C3-PENDING` must be reconciled after `CURRENT_CAPABILITY_BASELINE_FROZEN`.

## 0. Source baseline

Current main planning baseline:

`c91ccc877bc48ebd3282c0ed902d852698c794a5`

Source snapshots:
- `product/source/shell.template.html` blob `23c5616692cc52eef704cea37bcac86907a23a1e`
- `product/source/web-shell.js` blob `e8becd7b868c36b9f1a97e78073d3352fe4fd5ca`
- `research/INK_WORKSTATION_UI_CAPABILITY_MATRIX_v0.1.md` blob `230fe3367bd7ea883fd38201684980fde2d65059`
- `working/INK_TECH_CLOSURE_001_CAPABILITY_LEDGER.md` blob `e4e46df9bae265b3fc008dc5e4eac7aa1e4d15d3`

Current raw shell inventory:

```text
BUTTON_COUNT = 212
SELECT_COUNT = 29
UNIQUE_PERSISTENT_TOOL_MODES = 12
CURRENT_REGISTERED_PANEL_DESTINATIONS = 8
CURRENT_APPLICATION_MENU_LABELS = 9
CURRENT_LIVE_TOP_MENUS = 2  (File, Window)
```

Raw button count is **not** a function count. It includes:
- duplicated desktop/mobile routes;
- close/cancel controls;
- panel-local actions;
- repeated routes to the same command;
- Specialist and QA controls.

## 1. Placement vocabulary

- `TOOL_PRIMARY` — persistent canvas interaction mode; left Tools panel.
- `MENU_PRIMARY` — one-shot/general command; top application menu.
- `OPTIONS_PRIMARY` — immediate parameters/actions for the active tool.
- `PANEL_PRIMARY` — persistent structural/state surface.
- `PANEL_LOCAL` — action belongs only inside its owning panel.
- `SHORTCUT` — secondary route to an existing command.
- `RESPONSIVE` — compact/mobile alternate placement.
- `SPECIALIST` — advanced engineering/device/AI configuration/diagnostic surface.
- `HIDDEN_INTERNAL` — engine/readout capability should not become ordinary UI.
- `REMOVE_DUPLICATE` — visible duplicate route should disappear from normal desktop.
- `C3-PENDING` — placement shape is known, but final exposure waits for C3 capability freeze.

Invariant:

`PRIMARY_HOME_PER_FUNCTION = 1`

## 2. Pre-C3 top-menu target

Photoshop-aligned target taxonomy:

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
- follows the fixed Photoshop screenshot ordering closely;
- omits historical Photoshop `3D`;
- inserts INK-specific `Object` for vector/path/geometry commands;
- removes current top-level `Brush` candidate because brush choice belongs in Tools + Options/Properties;
- final menu content is locked only after C3.

Current registry:

```text
File      live
Edit      dead label
View      dead label
Select    dead label
Object    dead label
Layer     dead label
Brush     dead label
Window    live
Help      dead label
```

Target rule:

`DEAD_TOP_MENU_LABELS = 0`

## 3. Persistent tools — exact current semantic set

All 12 modes are `TOOL_PRIMARY`.

| Tool | Current endpoint | Target visible home | Grouping |
|---|---|---|---|
| Pen | `pen` | left Tools | Draw flyout |
| Pencil | `pencil` | left Tools | Draw flyout |
| Marker | `marker` | left Tools | Draw flyout |
| Brush | `brush` | left Tools | Draw flyout |
| Airbrush | `airbrush` | left Tools | Draw flyout |
| Eraser | `eraser` | left Tools | own slot |
| Select | `select` | left Tools | own slot |
| Lasso | `lasso` | left Tools | own slot |
| Shape | `shape` | left Tools | own slot |
| Text | `text` | left Tools | own slot |
| Image | `image` | left Tools | own slot |
| Pan | `pan` | left Tools | own slot |

Current desktop toolbar therefore represents 12 modes using approximately 8 visible slots because five draw tools share one grouped slot.

Rules:
- single/double column changes layout only;
- tool membership/order remains one system;
- mobile tool copies are `RESPONSIVE`, not new functions;
- Boolean/Group/Align/Repeat/etc. are commands and must not be added to the left toolbar.

Photoshop parity candidates, not yet authorized features:
- Zoom tool;
- foreground/background color-swatch grammar;
- Edit > Toolbar / Extra Tools customization.

## 4. Contextual Options row

### 4.1 Draw family

Primary immediate controls:
- current color;
- size;
- opacity;
- active draw-tool identity;
- active stroke/preset where applicable.

Placement:
`OPTIONS_PRIMARY`

Deeper brush/material settings:
`Properties / brush-specific panel`

### 4.2 Eraser

Immediate eraser mode/options:
`OPTIONS_PRIMARY`

### 4.3 Selection

Current quick actions represented in shell:
- Duplicate
- Group
- Bring to Front
- Align Center
- Delete

Placement:
- current-selection quick route = `OPTIONS_PRIMARY / SHORTCUT`;
- canonical general command = corresponding Object/Layer menu command.

### 4.4 Shape

Shape choices currently represented:
- line;
- arrow;
- rectangle;
- ellipse;
- triangle.

Placement:
`OPTIONS_PRIMARY`

Shape tool itself remains:
`TOOL_PRIMARY`

### 4.5 Text

Immediate controls:
- font family;
- text editing commit/cancel;
- other current type parameters.

Placement:
`OPTIONS_PRIMARY`

Canonical persistent text mode:
`TOOL_PRIMARY`

Future Type menu:
secondary command route only.

### 4.6 Path / stroke edit

Selected-node operations may appear contextually while editing, but complete command families belong under Object + Properties.

## 5. File / document commands

| Semantic command | Current endpoint(s) | Target |
|---|---|---|
| New | File menu + `newBtn` | `File > New` MENU_PRIMARY; keyboard SHORTCUT; desktop duplicate button REMOVE_DUPLICATE |
| Open | File menu + `openBtn` | `File > Open` MENU_PRIMARY; keyboard SHORTCUT; desktop duplicate button REMOVE_DUPLICATE |
| Save | File menu + `saveBtn` | `File > Save` MENU_PRIMARY; keyboard SHORTCUT; desktop duplicate button REMOVE_DUPLICATE |
| Export | File menu + `exportBtn` | `File > Export` MENU_PRIMARY; compact Export may remain RESPONSIVE |
| Run export | `runExportBtn` | PANEL_LOCAL inside Export dialog |
| Cancel export | `cancelExportBtn` | PANEL_LOCAL inside Export dialog |
| Import SVG Path | `svgImportFile` | candidate `File > Import > SVG`; C3-PENDING exposure |
| Import external program asset | `programAssetPick` | SPECIALIST; not ordinary File menu |
| Export Layer Manifest | `layerManifestExport` | SPECIALIST / advanced Export, not normal File primary |
| Export Stroke Session / Brush Package | `strokeSessionExport`, `brushPackageExport` | panel-local advanced creative asset export |
| Save Recipe / Report / Reference Package | program/reference endpoints | SPECIALIST / owning panel |

Export-dialog-only properties:
- format;
- scope;
- scale;
- PPI.

They remain `PANEL_LOCAL`, never top-level menu rows.

## 6. Edit / History commands

| Function | Current | Target |
|---|---|---|
| Undo | `undoBtn`, keyboard | `Edit > Undo` MENU_PRIMARY + keyboard SHORTCUT |
| Redo | `redoBtn`, keyboard | `Edit > Redo` MENU_PRIMARY + keyboard SHORTCUT |
| permanent top Undo/Redo buttons | current topbar | REMOVE_DUPLICATE on Photoshop-aligned desktop unless later user decision overrides |
| Step Backward / Step Forward | History semantic path | Edit menu secondary route to same History authority |
| History-state navigation | History panel | PANEL_PRIMARY |

History limit selector:
- current: 20 / 30 / 50;
- target: History panel menu/preferences;
- not a general toolbar control.

Existing History authority:
`HistoryManager`

Do not create a second undo stack.

## 7. View / workspace / viewport

| Function | Current endpoint | Target |
|---|---|---|
| Creation workspace | workspace switch/menu | one application/workspace control PRIMARY; `View/Window > Workspace` SHORTCUT |
| Layout workspace | workspace switch/menu | same authority |
| Fit current space | workspace menu | `View` MENU_PRIMARY |
| Reset current view | workspace menu / `resetViewBtn` | `View` MENU_PRIMARY |
| Fit A4 viewport | workspace menu / `fitViewportContentBtn` | `View` MENU_PRIMARY |
| Fit artboard | `fitArtboardBtn` | `View` or document/layout contextual route |
| Full screen | `fullscreenToggle` | `View > Screen Mode / Full Screen` MENU_PRIMARY + shortcut |
| Reset rotation | `rotateResetBtn` | status/view control + View secondary route |
| Fit content | `fitBtn` | status/view control + View secondary route |
| Zoom Out | `zoomOutBtn` | status/view + Navigator + View route; same viewport authority |
| Zoom In | `zoomInBtn` | status/view + Navigator + View route; same viewport authority |
| Toolbar single/double | `toolbarLayoutToggle` | local Tools-panel affordance; candidate `Edit > Toolbar` secondary route |

View-display properties from Canvas settings:
- bleed visibility;
- safe-area visibility;
- center guides;
- hide outside artboard;
- paper/grid display.

Target:
`View` menu for visibility toggles, with document/layout Properties as the state-editing surface where needed.

## 8. Pages

Current:
- top button `pagesToggle`;
- separate Pages panel;
- `addPageBtn`;
- close button.

Target:
- `Window > Pages`;
- Pages = `PANEL_PRIMARY`;
- Add Page = PANEL_LOCAL footer/header action;
- unique permanent top Pages button should become SHORTCUT or REMOVE_DUPLICATE;
- no second page state authority.

## 9. Layers / structure

### Layer panel

`Layers = PANEL_PRIMARY`

Panel-local actions:
- Add Layer — `addLayerBtn`
- Duplicate Layer — `duplicateLayerBtn`
- Delete Layer — `deleteLayerBtn`
- drag reorder
- lock
- visibility
- opacity

Layer menu:
`SHORTCUT / MENU_PRIMARY for one-shot global layer commands, same underlying document authority`

### Structural commands

| Function | Current endpoint | Target |
|---|---|---|
| Duplicate selected object | `duplicateSelectionBtn` | Object MENU_PRIMARY + contextual shortcut |
| Group | `groupSelectionBtn` | Object/Layer MENU_PRIMARY + contextual shortcut |
| Ungroup | `ungroupSelectionBtn` | Object/Layer MENU_PRIMARY |
| Bring to Front | `frontSelectionBtn` | Layer/Object > Arrange |
| Send to Back | `backSelectionBtn` | Layer/Object > Arrange |
| Delete selected | `deleteSelectionBtn` | Edit/Object command + Delete key |
| Mask | `maskAdd` | candidate `Layer > Mask` / Properties; promote-from-Specialist candidate |
| Adjustment Layer | `adjustmentAdd` | candidate `Layer > New Adjustment Layer`; promote-from-Specialist candidate |

Mask/Adjustment exposure is subject to C3/current-product maturity review, but they should not remain engineering-diagnostic controls if accepted as mature creative functions.

## 10. Transform / align / distribute

Current functions:
- aspect ratio lock;
- align left;
- align center X;
- align right;
- align top;
- align center Y;
- align bottom;
- distribute horizontally;
- distribute vertically.

Target:
- persistent transform values/state = `Properties`;
- one-shot Align/Distribute = `Object` MENU_PRIMARY;
- contextual shortcut buttons may appear only when selection makes them useful;
- no left-toolbar slots for these commands.

Full transform/rotate/resize/scale exposure:
`C3-PENDING`

## 11. Stroke editing

Current semantic command family:
- Enter Stroke Edit;
- Exit Stroke Edit;
- Select all stroke nodes;
- Simplify stroke nodes;
- Insert stroke node;
- Split stroke segment;
- Corner node;
- Smooth node;
- Symmetric node;
- Delete stroke nodes;
- Reset segment style.

Target:
- editing mode/state = Properties/Object contextual surface;
- one-shot commands = `Object > Stroke/Path` menu;
- selected-node quick commands may appear in Options row;
- no separate Stroke editor authority.

## 12. Path editing

Current semantic command family:
- Enter Path Edit;
- Exit Path Edit;
- Select all anchors;
- Simplify;
- Insert anchor;
- Refine;
- Corner;
- Smooth;
- Symmetric;
- Toggle closed;
- Delete anchors;
- Apply/update expressive stroke;
- Remove expressive stroke.

Target:
- mode/state = Properties;
- one-shot commands = `Object > Path`;
- relevant selected-anchor operations may appear in Options row;
- existing Path document/geometry authority remains sole authority.

## 13. Boolean / geometry / repeat

Current commands:
- Boolean Union
- Difference
- Intersection
- XOR
- Divide
- Repeat Radial
- Repeat Mirror
- Repeat Grid
- Repeat Expand
- Path/Node Edit
- Update selected Node

Target:

```text
Object
├─ Path
├─ Boolean
│  ├─ Union
│  ├─ Difference
│  ├─ Intersection
│  ├─ XOR
│  └─ Divide
└─ Repeat
   ├─ Radial
   ├─ Mirror
   ├─ Grid
   └─ Expand
```

Rules:
- one-shot operation = Object menu primary;
- parameters/state = Properties primary;
- Compose may show deterministic Repeat state but must not become a second mutation authority;
- C3 decides final exposure of operations currently being reconciled by Technical Closure.

## 14. Image / artboard / document-layout properties

Current properties:
- A4 preset;
- orientation;
- PPI;
- unit;
- bleed;
- safe area;
- center guides;
- clip outside artboard;
- layout viewport scale;
- model center X/Y;
- viewport rotation;
- paper type;
- paper/background color;
- grid size.

Target split:

### Document/layout state
`Properties > Document / Layout`
- artboard preset;
- orientation;
- PPI;
- unit;
- viewport numeric state;
- paper/background.

### View-only toggles
`View`
- bleed;
- safe area;
- center guides;
- grid/paper display where it is purely visual.

### One-shot view commands
`View`
- fit viewport;
- reset viewport;
- fit artboard.

Pre-C3 target top-level `Image` may host document/image sizing and bitmap/document-wide operations if/when current capabilities justify them. Do not invent empty Image commands merely to imitate Photoshop.

## 15. Filter / Adjustment / material

Current:
- Adjustment type selector + Add Adjustment;
- Filter type selector + Add Filter;
- Move Filter Up;
- expressive stroke/material controls elsewhere.

Target:
- accepted nondestructive adjustment creation → Layer menu / Properties;
- accepted filter application/stack commands → Filter menu;
- active filter/adjustment parameters → Properties;
- material/brush appearance → Options/Properties;
- if a capability remains validation-only, keep it SPECIALIST rather than exposing a dead Photoshop-like menu item.

Current filter types:
- Gaussian Blur
- Sharpen
- High Pass
- Edge Detection
- Noise/Grain
- Texture Overlay

Current adjustment types:
- Brightness/Contrast
- Levels
- Curves
- Hue/Saturation
- Color Balance
- Gradient Map

Final ordinary exposure:
`C3-PENDING / MATURITY_REVIEW`

## 16. Right panel destinations

### Current registered panels

| Panel | Current state | Target |
|---|---|---|
| Properties | registered | PANEL_PRIMARY |
| Layers | registered | PANEL_PRIMARY |
| History | registered | PANEL_PRIMARY; Photoshop behavior alignment |
| Reference | registered | PANEL_PRIMARY / INK-specific |
| Compose | registered | PANEL_PRIMARY / INK-specific |
| CHAT | registered | PANEL_PRIMARY / INK-specific |
| Revision | registered | PANEL_PRIMARY / INK-specific |
| Specialist | registered | SPECIALIST; de-emphasized from ordinary workflow |

### Planned normalization

| Panel | Current state | Target |
|---|---|---|
| Navigator | missing | PANEL_PRIMARY; mandatory Photoshop parity |
| Pages | separate panel outside registry | normalize into Window/panel grammar |

Window menu must mirror panel state with one authority.

## 17. Reference / Compose / CHAT / Revision

These are INK-native and remain visible, but must use Photoshop panel grammar.

### Reference
Primary:
- reference image/evidence workflow;
- research-to-creation advisory readout where accepted.

Current specialist evidence-package actions:
- manual reference kit;
- evidence import;
- attach reference package;
- export reference package.

Target:
- routine reference actions may migrate into Reference;
- engineering evidence/package actions remain advanced/SPECIALIST.

### Compose
Primary:
- composition state;
- accepted Repeat/parametric state readout;
- structural creative controls.

### CHAT
Primary:
- grounded context;
- proposal;
- approval;
- execution;
- plan;
- advisory memory/research.

Do not duplicate document mutation controls just because CHAT can invoke the same capability.

### Revision
Primary:
- capture/list/restore;
- provenance;
- accepted structural compare.

History != Revision.

## 18. AI Plan / compare controls

Current AI-related creative controls:
- Generate Plan
- Image → Plan
- Document → Plan
- Inspect document
- Capability list
- Audit log
- Execute JSON Command
- Preview
- Approve
- Reject
- Cancel
- Rollback
- transmission approval
- Before/After
- Split
- Overlay
- Difference

Placement:

### Ordinary creative workflow
- Plan / proposal / approval / rejection / rollback → CHAT;
- visual plan preview → CHAT/Revision compare surface;
- structural compare → Revision;
- explicit transmission approval → CHAT privacy/consent flow.

### Specialist only
- provider credentials;
- raw JSON Command execution;
- raw capability/audit engineering inspection where not user-facing;
- provider/logging/transport configuration.

Overlay/Difference must not claim rendered capability where current accepted compare authority is structural/metadata-only.

## 19. Specialist / engineering-only actions

Keep out of ordinary Photoshop-like chrome unless explicitly promoted by later maturity review.

### AI configuration
- startup mode;
- provider;
- auth method;
- credentials;
- timeout/retry/context;
- data policy;
- image policy;
- logging policy;
- preview quality;
- local-only;
- connect/disconnect.

### GPU / engine
- render engine mode;
- GPU validation.

### Program / Recipe engineering
- program safety mode;
- import external asset;
- compile Recipe;
- trial run;
- step run;
- breakpoint;
- before/after;
- attach to document;
- save Recipe;
- save report.

### Original-software evidence
- reference runner;
- manual kit;
- evidence import;
- attach/export Reference Package;
- raw/canonical step previews;
- dependency/unsupported reports.

### Cross-skeleton / Recipe lab
- skeleton selector;
- load structure;
- load Recipe JSON;
- recipe parameters;
- run all;
- local replay;
- rollback;
- QA.

### Stroke-session engineering
- record start/pause/finish;
- import drawing workflow;
- create complete paint session;
- replace/replay;
- export Session;
- export Brush Package.

### Device validation
- stylus test pattern;
- start measurement;
- save Device Report;
- calibration profile;
- save/export/import/reset calibration.

### QA / benchmark / release diagnostics
- interactive 1K/10K/100K benchmark;
- artwork QA benchmark/export;
- storage/offline health;
- release health;
- diagnostics package;
- update check/activate.

Normal-user placement:
`SPECIALIST` or `Help > Diagnostics` only.

## 20. Current 29 select controls — complete disposition

| Select | Target disposition |
|---|---|
| `renderEngineMode` | SPECIALIST |
| `fontFamily` | Text OPTIONS_PRIMARY |
| `historyLimit` | History panel options |
| `pathStrokePreset` | Path/Draw Options or Properties |
| `aiStartupMode` | SPECIALIST |
| `aiProvider` | SPECIALIST |
| `aiAuthMethod` | SPECIALIST |
| `aiDataPolicy` | CHAT advanced/privacy |
| `aiImagePolicy` | CHAT advanced/privacy |
| `aiLoggingPolicy` | CHAT advanced/privacy |
| `aiPreviewQuality` | CHAT/SPECIALIST advanced |
| `programSafetyMode` | SPECIALIST |
| `referenceRunner` | SPECIALIST reference-evidence tooling |
| `studioSkeleton` | Compose/Recipe advanced; not top chrome |
| `adjustmentType` | Layer/Properties candidate; C3-PENDING |
| `filterType` | Filter/Properties candidate; C3-PENDING |
| `paintBrush` | Brush/Stroke Session advanced |
| `stylusTestPattern` | SPECIALIST |
| `calibrationProfileSelect` | SPECIALIST |
| `artworkQaBenchmark` | SPECIALIST |
| `artboardPreset` | Document/Layout Properties |
| `artboardOrientation` | Document/Layout Properties |
| `artboardPpi` | Document/Layout Properties |
| `artboardUnit` | Document/Layout Properties |
| `paperType` | Document/Layout Properties / view presentation |
| `exportFormat` | Export dialog PANEL_LOCAL |
| `exportScope` | Export dialog PANEL_LOCAL |
| `exportScale` | Export dialog PANEL_LOCAL |
| `exportPpi` | Export dialog PANEL_LOCAL |

## 21. C3 capability ledger → UI placement reconciliation

All 40 technical capability families are accounted for here. This does not claim they are all ordinary visible commands.

| # | Capability family | Pre-C3 UI placement |
|---:|---|---|
| 1 | Current document/file context | HIDDEN_INTERNAL + Properties/CHAT readout |
| 2 | Stable node/object identity | HIDDEN_INTERNAL + Properties/CHAT readout |
| 3 | Selection | Select tool / contextual selection / CHAT |
| 4 | Query hierarchy | Properties/CHAT read-only |
| 5 | Screenshot/render check | CHAT/Reference preview; not toolbar |
| 6 | Frame/container | C3-PENDING; likely Object/Properties; tool slot only if a real persistent Frame-create mode exists |
| 7 | Group | Object/Layer command |
| 8 | Path/vector | Path/Shape tools + Object/Properties |
| 9 | Rectangle/Ellipse primitives | Shape tool flyout/options |
| 10 | Text | Text tool + Type/Options/Properties |
| 11 | Raster/image reference | Image tool / Reference panel |
| 12 | SVG import | File > Import; C3-PENDING |
| 13 | Fill/stroke/opacity | Options/Properties |
| 14 | Material/expressive stroke | Options/Properties |
| 15 | Translate | direct manipulation + Properties/Object |
| 16 | Resize/rotate/scale | direct manipulation + Properties/Object; C3-PENDING |
| 17 | Z-order/reorder | Layer/Object > Arrange; Layers drag reorder; C3-PENDING CHAT exposure |
| 18 | Path edit | Object > Path + Properties; C3-PENDING CHAT exposure |
| 19 | Simplify/refine | Object > Path + contextual edit |
| 20 | Boolean geometry | Object > Boolean; C3-PENDING final exposure |
| 21 | Repeat/parametric | Object > Repeat + Properties + Compose state; C3-PENDING final exposure |
| 22 | Auto/Flex layout | C3-PENDING; Properties/Object if accepted |
| 23 | Grid layout | DEFERRED; no visible command |
| 24 | Constraints/fill/hug | C3-PENDING; Properties if accepted |
| 25 | Components | C3-PENDING; panel/Object if accepted; do not pre-create UI |
| 26 | Component overrides | C3-PENDING; Properties if accepted |
| 27 | Variants | DEFERRED; no fake Variant panel |
| 28 | Variables/tokens | DEFERRED; no fake token panel |
| 29 | Styles/library reuse | PLANNED; no generic Library panel until implementation |
| 30 | History/Undo/Redo | History PANEL_PRIMARY + Edit/shortcuts |
| 31 | Revision/version | Revision PANEL_PRIMARY |
| 32 | Compare | Revision/CHAT compare; respect structural-vs-rendered boundary |
| 33 | Prototype interactions | RETIRED; no UI |
| 34 | Asset export | File > Export + Export dialog; C3-PENDING CHAT boundary |
| 35 | Design → code | RETIRED; no UI |
| 36 | Code/live UI → design | OPTIONAL; no ordinary UI |
| 37 | Creative Library Search | PLANNED Connector-005; no visible Library surface until implemented |
| 38 | Semantic grounding | Properties/CHAT read-only |
| 39 | Reference decomposition/vectorization | Reference/Image workflow |
| 40 | Creative Memory/Research | CHAT/Reference advisory read-only |

Mature-editor items outside the 40-family connector table:
- Align/distribute → Object + contextual;
- persistent rulers/guides → backlog; no fake UI;
- smart/equal-distance snapping → View/Options/Properties only at accepted maturity;
- transform preview/commit → current direct-manipulation/History authority;
- richer typography/effects → backlog;
- local storage/recovery → internal/Help status, not top chrome;
- stylus/natural media → Tools/Options; device validation remains Specialist.

## 22. Raw static-button coverage

The 212 static buttons are fully covered by these groups:

```text
1–25    application/file/workspace/topbar
26–36   Pages + desktop tools/layout
37–41   Draw subtools
42–49   immediate/context/text actions
50–66   Inspector navigation + shape + Layers
67–72   selection/object structure
73–83   Stroke edit
84–96   Path edit / expressive stroke
97–105  aspect/align/distribute
106–116 Geometry / Boolean / Repeat
117–138 AI/Plan/Compare/consent/GPU
139–151 Program + original-software reference evidence
152–158 Recipe / SVG / QA
159–162 Mask / Adjustment / Filter
163–170 Stroke Session
171–179 Device / benchmark / artwork QA / manifest
180–193 mobile responsive tool duplicates
194–205 Canvas settings / health / update
206–208 Export dialog
209–212 status/view rotation/fit/zoom
```

No static-button range remains unclassified.

## 23. Current placement conclusions

### Keep as left-tool concepts
`12 persistent tools / ~8 visible grouped slots`

### Keep as contextual Options
- tool-specific immediate controls;
- shape/text/eraser selection options;
- selected-object quick actions only when contextually justified.

### Populate top menus
- File;
- Edit;
- Image where real document/image commands exist;
- Layer;
- Type;
- Select;
- Object;
- Filter where accepted creative filters exist;
- View;
- Window;
- Help.

### Right dock / Window
- Properties;
- Layers;
- History;
- Navigator;
- Pages;
- Reference;
- Compose;
- CHAT;
- Revision;
- Specialist only as advanced.

### Hide from ordinary workstation
- raw AI provider/credential configuration;
- JSON/program interpreter;
- GPU validation;
- benchmark/device calibration;
- release diagnostics;
- engineering Recipe/reference-evidence packaging;
- unsupported/deferred technical families.

## 24. Final C3 reconciliation procedure

After Technical Closure C3:

1. replace this document's baseline SHA with the frozen capability baseline;
2. diff the frozen ledger against this map;
3. update only rows whose technical availability changed;
4. resolve all `C3-PENDING`;
5. confirm no planned/deferred capability has a visible dead command;
6. lock menu labels/order;
7. lock toolbar membership/grouping;
8. lock Window/panel inventory;
9. freeze `PRIMARY_HOME_PER_FUNCTION = 1`;
10. issue bounded UI DEV Work Orders.

Final gate before product UI build:

```text
CURRENT_CAPABILITY_BASELINE = FROZEN
FUNCTIONS_ACCOUNTED_FOR = 100%
C3_PENDING = 0
UNCLASSIFIED_VISIBLE_FUNCTIONS = 0
DEAD_MENU_LABELS = 0
DUPLICATE_PRIMARY_HOME = 0
PRODUCT_MUTATION_FROM_THIS_DOC = 0
```
