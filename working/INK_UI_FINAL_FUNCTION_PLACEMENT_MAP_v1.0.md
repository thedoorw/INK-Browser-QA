# INK Final UI — Function Placement Map v1.0

STATUS: `FINAL / FROZEN_BASELINE_RECONCILED / C3_PENDING_0`

DATE: 2026-09-26

BASE_MAIN: `b1374ecec242b8206aa3000a784c7498e0044030`

CAPABILITY_AUTHORITY:
`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

Frozen technical counts:
```text
FORMAT_VERSION = 4
BOUNDED_EDIT_OPERATIONS = 34
NAMED_TOOLS = 22
PUBLIC_CREATIVE_API = installed
CONNECTOR_005 = installed
```

Current static shell inventory:
```text
STATIC_BUTTONS = 212
SELECTS = 29
PERSISTENT_CANVAS_TOOL_MODES = 12
```

Purpose:
Every installed capability and every current visible/static UI family receives one intentional UI disposition before the Photoshop-aligned final rebuild.

Invariant:
`PRIMARY_HOME_PER_FUNCTION = 1`

Placement types:
- `TOOL_PRIMARY`
- `MENU_PRIMARY`
- `OPTIONS_PRIMARY`
- `PANEL_PRIMARY`
- `PANEL_LOCAL`
- `DIRECT_MANIPULATION_PRIMARY`
- `SHORTCUT`
- `RESPONSIVE`
- `CHAT_INTERNAL`
- `SPECIALIST`
- `HIDDEN_INTERNAL`
- `RETIRE_FROM_NORMAL_UI`

---

# 1. Final application menu taxonomy

Frozen capability reconciliation removes any menu that would be decorative/dead.

Final:

```text
File
Edit
Image
Layer
Type
Select
Object
View
Window
Help
```

Explicit decisions:
- `Brush` top-level menu: RETIRE; Brush belongs to Tools + Options/Properties.
- `Filter` top-level menu: DO NOT CREATE in final normal UI; no general Filter capability is authorized by the frozen baseline.
- Photoshop historical `3D`: DO NOT CREATE.
- legacy Mask/Adjustment/Filter validation controls remain Specialist/legacy until separately authorized by a future technical baseline.

`DEAD_TOP_LEVEL_MENU = 0`

---

# 2. Left Tools — 12 persistent modes

| Mode | Primary home | Group |
|---|---|---|
| Pen | TOOL_PRIMARY | Draw flyout |
| Pencil | TOOL_PRIMARY | Draw flyout |
| Marker | TOOL_PRIMARY | Draw flyout |
| Brush | TOOL_PRIMARY | Draw flyout |
| Airbrush | TOOL_PRIMARY | Draw flyout |
| Eraser | TOOL_PRIMARY | own slot |
| Select | TOOL_PRIMARY | own slot |
| Lasso | TOOL_PRIMARY | own slot |
| Shape | TOOL_PRIMARY | own slot |
| Text | TOOL_PRIMARY | own slot |
| Image | TOOL_PRIMARY | own slot |
| Pan | TOOL_PRIMARY | own slot |

Rules:
- single/double column = layout only;
- mobile copies = RESPONSIVE;
- no one-shot operation becomes a tool merely to imitate Photoshop;
- current ~8 visible slots may represent all 12 modes through grouping.

---

# 3. Options row

| Context | Primary content |
|---|---|
| Draw | tool identity, color, size, opacity, accepted preset/stroke quick controls |
| Eraser | mode, size/opacity as supported |
| Select/Lasso | selection-mode/context quick actions only |
| Shape | primitive/type + immediate create properties |
| Text | font/immediate text settings + commit/cancel |
| Path/Node | selected-node immediate edit actions only |
| Image | immediate placement/reference controls only where existing |
| Pan | view-related immediate state only if needed |

Deep state moves to Properties. One-shot global commands move to menus.

---

# 4. Final right-panel inventory

## Editor
- Properties — PANEL_PRIMARY
- Layers — PANEL_PRIMARY
- History — PANEL_PRIMARY
- Navigator — PANEL_PRIMARY / new required UI surface
- Pages — PANEL_PRIMARY / normalize existing separate panel

## Creative
- Libraries — PANEL_PRIMARY / Connector-005 search/inspect only
- Reference — PANEL_PRIMARY
- Compose — PANEL_PRIMARY
- CHAT — PANEL_PRIMARY
- Revision — PANEL_PRIMARY

## Advanced
- Specialist — SPECIALIST

Window menu mirrors these panels as SHORTCUT routes to the same panel state authority.

---

# 5. File

| Function | Primary home | Secondary |
|---|---|---|
| New document | File > New | keyboard |
| Open | File > Open | keyboard |
| Save | File > Save | keyboard |
| Export asset | File > Export | export dialog |
| Import local Reference | File > Import Reference | Reference panel |
| SVG import | File > Import > SVG | Object/Reference contextual route if appropriate |
| current desktop New/Open/Save top buttons | RETIRE_FROM_NORMAL_UI | compact responsive route only if needed |

Export dialog owns:
- format;
- scope;
- scale;
- PPI;
- create/cancel.

Supported frozen asset export:
- PNG
- SVG
- PDF

No separate CHAT export engine; `export_ink_asset` routes to accepted native export authority.

---

# 6. Edit

Primary one-shot command home:
- Undo
- Redo
- Duplicate object
- Delete selected object where conventional
- preferences/settings entry where appropriate.

History routing:
- Undo/Redo keyboard = SHORTCUT;
- History panel = PANEL_PRIMARY;
- Step Backward/Forward, if exposed, route to same History authority.

Permanent desktop Undo/Redo topbar buttons:
`RETIRE_FROM_NORMAL_UI` after Edit/History routes are complete, unless USER explicitly re-authorizes.

---

# 7. Image

Image menu is deliberately limited to installed/current document-image/layout functions.

Primary/secondary routes:
- Document / Artboard settings → Properties > Document/Layout
- Canvas / viewport settings → Properties/View
- image/reference placement settings where relevant → Image tool / Reference

Do not invent Photoshop image-processing commands not in frozen baseline.

---

# 8. Layer

Primary one-shot routes:
- Add Layer
- Duplicate Layer
- Delete Layer
- Group/Ungroup where represented at layer hierarchy level
- Arrange Front/Back secondary route
- reparent/hierarchy operations where appropriate

Layers panel remains the primary state/hierarchy surface and owns drag reorder.

Legacy Adjustment/Mask controls:
`SPECIALIST / NOT AUTHORIZED AS FINAL NORMAL UI BY CURRENT BASELINE`

---

# 9. Type

Installed:
- `text.create.v1`
- `text.edit.v1`

Placement:
- Text tool = TOOL_PRIMARY
- immediate font/edit settings = OPTIONS_PRIMARY
- persistent text properties = Properties
- Type menu = one-shot/secondary type commands and route to Text tool/properties.

No type feature is invented beyond installed Text create/edit capability.

---

# 10. Select

Installed selection/context family.

Placement:
- Select = TOOL_PRIMARY
- Lasso = TOOL_PRIMARY
- selection mode / current-selection quick state = OPTIONS_PRIMARY
- selection metadata/readout = Properties/CHAT
- Select menu = secondary selection routes only for existing editor behaviors.

No Photoshop-only selection algorithms are invented.

---

# 11. Object — main vector/structure command home

Submenu structure:

```text
Object
├─ Transform
├─ Arrange
├─ Align / Distribute
├─ Path / Stroke
├─ Boolean
├─ Repeat
├─ Frame / Layout
└─ Component
```

Properties is the persistent parameter/state counterpart.

---

# 12. Object > Transform

Frozen installed:
- `object.translate.v1`
- `object.rotate.v1`
- `object.resize.v1`
- `object.scale.v1`
- `object.clone.v1`

Primary:
- Translate / Resize / Rotate = DIRECT_MANIPULATION_PRIMARY on canvas.
- numeric transform = Properties.
- Duplicate/Clone = Edit/Object MENU_PRIMARY.

No second transform model.

---

# 13. Object > Arrange / hierarchy

Frozen installed:
- `object.order.v1`
- `object.reparent.v1`
- `group.create.v1`

Placement:
- Layers drag = primary direct hierarchy manipulation;
- Object > Arrange = MENU_PRIMARY for front/back ordering;
- Object > Group = MENU_PRIMARY;
- reparent = Layers/direct structure primary; menu route optional secondary;
- Ungroup uses existing editor group authority where supported.

---

# 14. Align / Distribute

Existing editor capability:
- align left;
- center X;
- right;
- top;
- center Y;
- bottom;
- distribute X;
- distribute Y;
- aspect ratio lock.

Placement:
- Object > Align / Distribute = MENU_PRIMARY;
- contextual selection buttons = SHORTCUT when useful;
- transform state/aspect lock = Properties/Options.

Not left Tools.

---

# 15. Path / Stroke

Frozen installed:
- `path.create.v1`
- `path.edit.v1`
- `path.simplify.v1`
- `path.refine.v1`
- `path.repaint.v1`
- `path.material.apply.v1`
- `path.material.remove.v1`

Current editor path/stroke actions also include:
- enter/exit node edit;
- select all nodes/anchors;
- insert node/anchor;
- split segment;
- corner/smooth/symmetric;
- close/open path where existing;
- delete nodes;
- apply/update expressive stroke;
- remove expressive appearance.

Placement:
- path creation = Pen/Shape TOOL_PRIMARY;
- path/node state = Properties;
- selected node quick actions = Options;
- simplify/refine/etc. = Object > Path MENU_PRIMARY;
- repaint/material parameters = Properties > Appearance;
- Material apply may also be triggered from Libraries as SHORTCUT to the same governed operation.

---

# 16. Boolean

Frozen:
`boolean.apply.v1`

UI:
```text
Object > Boolean
- Union
- Difference
- Intersection
- XOR
- Divide
```

Same native Boolean authority.
No left toolbar Boolean buttons.

---

# 17. Repeat / parametric

Frozen:
- `repeat.radial.v1`
- `repeat.mirror.v1`
- `repeat.grid.v1`

Placement:
- Object > Repeat = MENU_PRIMARY for mutation;
- Properties = repeat parameters/state;
- Compose = structural/readout/creative configuration surface;
- Libraries may search/inspect parametric structures and route use through accepted native repeat/object authorities.

No generic second parametric engine.

---

# 18. Frame / Layout

Frozen:
- `frame.create.v1`
- `layout.frame.set.v1`
- `layout.frame.remove.v1`
- `layout.item.set.v1`
- `layout.item.remove.v1`

Placement:
- Object > Frame = MENU_PRIMARY for frame creation;
- Properties > Layout = PANEL_PRIMARY for Auto/Flex frame settings;
- Properties > Layout Item = sizing/constraints for children;
- direct canvas/hierarchy manipulation remains valid;
- no new Grid Layout engine.

The frozen baseline explicitly says general Grid Layout is not installed.

---

# 19. Components

Frozen:
- `component.register.v1`
- `component.instance.create.v1`
- `component.override.set.v1`
- `component.override.reset.v1`
- `component.instance.detach.v1`
- `component.definition.duplicate.v1`
- `component.reference.repair.v1`

Placement:
- Create/Register Component → Object > Component MENU_PRIMARY
- Insert/Create Instance → Libraries PANEL_PRIMARY when chosen from component search; Object menu can be SHORTCUT
- allowed instance override → Properties > Component
- Reset override → Properties > Component
- Detach instance → Object > Component MENU_PRIMARY
- Duplicate definition → Object > Component MENU_PRIMARY
- Reference repair → SPECIALIST / component diagnostic action

Do not expose:
- Variants;
- general Variables/Tokens;
- general Styles system.

---

# 20. View

Primary:
- Fit current content
- Reset view
- Fit A4/artboard viewport
- Fullscreen/screen mode
- zoom routes
- reset rotation
- visible guides/bleed/safe-area/grid toggles where current product supports them
- workspace view switching secondary route.

Status/Navigator may provide SHORTCUT routes to the same viewport authority.

No second camera.

---

# 21. Window

Window menu mirrors panels with checked/open state:

- Properties
- Layers
- History
- Navigator
- Pages
- Libraries
- Reference
- Compose
- CHAT
- Revision
- Specialist

Window may also expose workspace arrangement if implemented under same shell state owner.

No independent panel state machines.

---

# 22. Help

Normal:
- keyboard shortcuts/help
- capability/about information appropriate for user

Advanced:
- diagnostics;
- storage/offline health;
- release health;
- update diagnostics.

Engineering diagnostics may route to Specialist.

---

# 23. Navigator — new UI requirement

Primary home:
`Window > Navigator + right Dock`

Functions:
- artwork thumbnail;
- proxy viewport;
- drag proxy = pan;
- click thumbnail = jump/reposition;
- zoom percentage;
- zoom out;
- slider;
- zoom in;
- two-way sync.

Uses current viewport/document/render read path only.
If missing renderer projection is required:
`STOP → MR`.

---

# 24. History — existing capability, new interaction alignment

Frozen named tools include:
- `get_ink_history`
- `undo_ink`
- `redo_ink`

Human UI:
- History PANEL_PRIMARY;
- Edit Undo/Redo;
- keyboard shortcuts.

One History authority only.

---

# 25. Revision

Frozen named tools:
- `get_ink_revisions`
- `capture_ink_revision`
- `restore_ink_revision`

Placement:
- Revision PANEL_PRIMARY;
- capture/list/restore panel-local actions;
- provenance/structural compare readout;
- CHAT may call same tools internally.

No replacement by History.

---

# 26. Libraries — Connector-005 exact placement

Frozen named tool:
`search_ink_library`

Families:
- component
- material
- recipe
- parametric-structure
- reference-derived-structure

Primary home:
`Libraries PANEL_PRIMARY`

UI:
- query/search;
- family filter;
- results;
- inspect/details;
- read-only/search status.

Use/reuse routing:
- Component → existing governed `component.instance.create.v1`
- Material → existing governed `path.material.apply.v1`
- Recipe → search/inspect only unless an already accepted native route exists
- Parametric structure → existing native object/clone/repeat routes
- Reference-derived structure → existing native object/clone/composition routes

Forbidden:
- full manager;
- cloud/remote library;
- autonomous apply;
- automatic tagging;
- second Library/Component/Material/Recipe engine.

---

# 27. Reference

Named tool:
`import_ink_reference`

Related:
`decompose_ink_reference`

Primary:
- Reference PANEL_PRIMARY
- Image tool may provide contextual local placement shortcut.

Reference decomposition/vectorization belongs here.

Engineering reference-evidence packaging remains Specialist.

---

# 28. CHAT — exact 22 named tool disposition

| # | Named tool | Human UI disposition |
|---:|---|---|
| 01 | `get_ink_capabilities` | CHAT_INTERNAL / Help capability readout |
| 02 | `get_ink_context` | CHAT_INTERNAL; Properties may show human-readable grounded state |
| 03 | `get_ink_selection` | CHAT_INTERNAL; canvas/Properties own human selection |
| 04 | `inspect_ink_objects` | CHAT_INTERNAL; Properties is human inspection surface |
| 05 | `decompose_ink_reference` | Reference PANEL_PRIMARY action; CHAT shortcut |
| 06 | `propose_ink_edit` | CHAT PANEL_PRIMARY |
| 07 | `approve_ink_edit` | CHAT PANEL_PRIMARY |
| 08 | `execute_ink_edit` | CHAT PANEL_PRIMARY, governed |
| 09 | `get_ink_history` | History human UI; CHAT_INTERNAL |
| 10 | `undo_ink` | Edit/History human UI; CHAT_INTERNAL |
| 11 | `redo_ink` | Edit/History human UI; CHAT_INTERNAL |
| 12 | `get_ink_revisions` | Revision human UI; CHAT_INTERNAL |
| 13 | `capture_ink_revision` | Revision PANEL_LOCAL; CHAT shortcut |
| 14 | `restore_ink_revision` | Revision PANEL_LOCAL; CHAT governed shortcut |
| 15 | `get_ink_preview` | CHAT/Reference preview; no separate top command |
| 16 | `inspect_ink_output` | export/output status UI; CHAT_INTERNAL |
| 17 | `release_ink_output` | output lifecycle / CHAT_INTERNAL; no duplicate export engine |
| 18 | `describe_ink_capability` | CHAT_INTERNAL / Help |
| 19 | `use_ink` | CHAT_INTERNAL Creative Plan composition |
| 20 | `import_ink_reference` | Reference PANEL_PRIMARY; CHAT shortcut |
| 21 | `export_ink_asset` | File > Export human UI; CHAT governed shortcut |
| 22 | `search_ink_library` | Libraries PANEL_PRIMARY; CHAT shortcut |

Result:
`NAMED_TOOLS_PLACED = 22 / 22`

---

# 29. Exact 34 bounded edit operation disposition

| # | Operation | Primary human UI home |
|---:|---|---|
| 01 | `path.repaint.v1` | Properties > Appearance |
| 02 | `path.material.apply.v1` | Properties > Appearance; Libraries shortcut |
| 03 | `path.material.remove.v1` | Properties > Appearance |
| 04 | `object.translate.v1` | direct canvas manipulation; Properties numeric |
| 05 | `path.simplify.v1` | Object > Path |
| 06 | `path.refine.v1` | Object > Path |
| 07 | `path.create.v1` | Pen/Shape tool |
| 08 | `path.edit.v1` | Properties/Options Path Edit |
| 09 | `object.rotate.v1` | direct manipulation; Properties numeric |
| 10 | `object.clone.v1` | Edit/Object Duplicate |
| 11 | `repeat.radial.v1` | Object > Repeat |
| 12 | `boolean.apply.v1` | Object > Boolean |
| 13 | `group.create.v1` | Object > Group |
| 14 | `object.reparent.v1` | Layers hierarchy/direct structure |
| 15 | `frame.create.v1` | Object > Frame |
| 16 | `text.create.v1` | Text tool |
| 17 | `text.edit.v1` | Text tool/Options/Properties |
| 18 | `svg.import.v1` | File > Import > SVG |
| 19 | `object.resize.v1` | direct manipulation; Properties |
| 20 | `object.scale.v1` | direct manipulation; Properties |
| 21 | `object.order.v1` | Layers drag + Object > Arrange |
| 22 | `repeat.mirror.v1` | Object > Repeat |
| 23 | `repeat.grid.v1` | Object > Repeat |
| 24 | `layout.frame.set.v1` | Properties > Layout |
| 25 | `layout.frame.remove.v1` | Properties > Layout |
| 26 | `layout.item.set.v1` | Properties > Layout Item |
| 27 | `layout.item.remove.v1` | Properties > Layout Item |
| 28 | `component.register.v1` | Object > Component |
| 29 | `component.instance.create.v1` | Libraries > Component result / Insert |
| 30 | `component.override.set.v1` | Properties > Component |
| 31 | `component.override.reset.v1` | Properties > Component |
| 32 | `component.instance.detach.v1` | Object > Component |
| 33 | `component.definition.duplicate.v1` | Object > Component |
| 34 | `component.reference.repair.v1` | Specialist > Component diagnostics |

Result:
`BOUNDED_EDIT_OPERATIONS_PLACED = 34 / 34`

---

# 30. Current 29 select controls

| Select | Final home |
|---|---|
| `renderEngineMode` | Specialist |
| `fontFamily` | Text Options/Properties |
| `historyLimit` | History panel options |
| `pathStrokePreset` | Draw/Path Options or Properties |
| `aiStartupMode` | Specialist |
| `aiProvider` | Specialist |
| `aiAuthMethod` | Specialist |
| `aiDataPolicy` | CHAT advanced/privacy |
| `aiImagePolicy` | CHAT advanced/privacy |
| `aiLoggingPolicy` | CHAT advanced/privacy |
| `aiPreviewQuality` | CHAT advanced/Specialist |
| `programSafetyMode` | Specialist |
| `referenceRunner` | Specialist evidence tooling |
| `studioSkeleton` | Compose/Recipe advanced |
| `adjustmentType` | Specialist legacy; not final normal UI under frozen baseline |
| `filterType` | Specialist legacy; not final normal UI under frozen baseline |
| `paintBrush` | advanced Stroke Session / Specialist |
| `stylusTestPattern` | Specialist |
| `calibrationProfileSelect` | Specialist |
| `artworkQaBenchmark` | Specialist |
| `artboardPreset` | Properties > Document/Layout |
| `artboardOrientation` | Properties > Document/Layout |
| `artboardPpi` | Properties > Document/Layout |
| `artboardUnit` | Properties > Document/Layout |
| `paperType` | Properties > Document/Layout |
| `exportFormat` | Export dialog |
| `exportScope` | Export dialog |
| `exportScale` | Export dialog |
| `exportPpi` | Export dialog |

`SELECT_CONTROLS_PLACED = 29 / 29`

---

# 31. Legacy/static shell button coverage

The existing 212 static buttons remain fully accounted by semantic families:

```text
1–25    application/file/workspace/topbar
26–36   Pages + desktop Tools/layout
37–41   Draw subtools
42–49   immediate/context/text actions
50–66   Inspector navigation + shape + Layers
67–72   selection/object structure
73–83   Stroke edit
84–96   Path edit / expressive stroke
97–105  aspect/align/distribute
106–116 Geometry / Boolean / Repeat
117–138 AI/Plan/Compare/consent/GPU
139–151 Program + external-reference evidence tooling
152–158 Recipe / SVG / QA
159–162 legacy Mask / Adjustment / Filter
163–170 Stroke Session
171–179 Device / benchmark / artwork QA / manifest
180–193 mobile responsive tool duplicates
194–205 Canvas settings / health / update
206–208 Export dialog
209–212 status/view rotation/fit/zoom
```

Disposition:
- ordinary creative functions migrate to the homes defined above;
- mobile duplicates remain RESPONSIVE;
- engineering/QA remains Specialist;
- legacy Mask/Adjustment/Filter controls do not create normal menu/panel authority;
- obsolete desktop duplicate controls are removed rather than hidden indefinitely.

`STATIC_BUTTON_RANGES_CLASSIFIED = 212 / 212`

---

# 32. Specialist — exact category boundary

Keep in Specialist / Help Diagnostics:
- AI provider/credentials/transport;
- raw JSON command;
- engine/GPU validation;
- program safety / program asset / Recipe compile/step/breakpoint;
- external original-software evidence package;
- raw Recipe lab/QA controls not part of accepted normal creative placement;
- Stroke Session engineering;
- stylus/device validation/calibration;
- interactive benchmark;
- artwork QA export;
- layer manifest diagnostic export;
- storage/offline/release diagnostics;
- update diagnostics;
- component reference repair.

Specialist does not become an ordinary Photoshop panel group competing for constant attention.

---

# 33. Explicit non-capabilities — no final UI

The frozen baseline explicitly forbids presenting these as operational:
- full Library Manager;
- cloud/remote library search;
- automatic tagging/classification;
- Variables/Tokens;
- general Styles system;
- Component Variants;
- general Grid Layout engine;
- CRDT/multiplayer library state;
- automatic Creative Memory writes;
- automatic Research fetch/scrape;
- autonomous asset application;
- external connector transport;
- prototype interactions;
- design-to-code drawing-core feature.

`FAKE_VISIBLE_FEATURES = 0`

---

# 34. Final reconciliation result

```text
CAPABILITY_BASELINE = FROZEN
C3_PENDING = 0
NAMED_TOOLS_PLACED = 22 / 22
BOUNDED_EDIT_OPERATIONS_PLACED = 34 / 34
PERSISTENT_TOOL_MODES_PLACED = 12 / 12
SELECT_CONTROLS_PLACED = 29 / 29
STATIC_BUTTON_RANGES_CLASSIFIED = 212 / 212
FINAL_PANEL_INVENTORY_DEFINED = YES
FINAL_TOP_MENU_TAXONOMY_DEFINED = YES
UNCLASSIFIED_FUNCTION_FAMILIES = 0
PRIMARY_HOME_PER_FUNCTION = 1
PRODUCT_MUTATION_FROM_THIS_DOCUMENT = 0
```

This map is the function-placement authority for final Photoshop-aligned UI implementation.
