# INK UI Updated Control Ledger v1.0

STATUS: `UR_COMPLETE / MR_REVIEW_REQUIRED / UI_HOLD`

TASK: `INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

DATE: 2026-09-28

PREDECESSOR:
`working/INK_UI_FINAL_STATIC_CONTROL_LEDGER_v1.0.md`

PLACEMENT AUTHORITY:
`working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`

PRODUCT MUTATION: `0`

## 1. Ledger rule

The predecessor enumerates all existing static shell controls:

```text
STATIC_BUTTONS = 212 / 212
SELECT_CONTROLS = 29 / 29
```

This updated ledger keeps every predecessor row by ID unless explicitly superseded below. Therefore existing control coverage remains 212/212 + 29/29 while new P1/full-capability controls are added as PLANNED UI CONTROL REQUIREMENTS, not implemented controls.

No existing control disappears by omission.

## 2. Existing static control disposition — unchanged ranges

These predecessor ranges remain semantically valid:

| Existing IDs | Disposition retained |
|---|---|
| 1–25 | application/file/workspace/topbar; duplicate New/Open/Save and desktop Undo/Redo still retire where already marked |
| 26–36 | Pages + primary tool shell |
| 37–41 | Draw flyout |
| 42–49 | contextual/options/text commit |
| 50–66 | panel navigation + Shapes + Layers local actions |
| 67–72 | selection/object structure actions |
| 73–83 | Stroke editing |
| 84–96 | Path editing / expressive appearance |
| 97–105 | aspect / align / distribute |
| 106–116 | Geometry / Boolean / Repeat |
| 117–138 | CHAT / Plan / Compare / consent / GPU diagnostics |
| 139–151 | Program Import / external-reference evidence Specialist |
| 152–158 | Compose / Recipe / SVG / QA advanced |
| 163–179 | Stroke Session / device / benchmark / artwork QA Specialist |
| 180–193 | responsive/mobile tool duplicates |
| 194–205 | canvas/settings/health/update |
| 206–208 | Export dialog |
| 209–212 | status/view/navigation |

Only IDs 159–162 require primary-disposition correction after the full capability rebaseline.

## 3. Existing buttons requiring corrected disposition

| ID | Current control | Old disposition | Updated disposition | Reason |
|---:|---|---|---|---|
| 159 | `maskAdd` — 建立 Mask | LEGACY Specialist | Layers panel local action / Layer > Mask secondary | C23 is normal raster/vector mask capability |
| 160 | `adjustmentAdd` — 加入 Adjustment | LEGACY Specialist | Adjustments panel primary / Image > Adjustments secondary | C24 + P1-F are normal creative capability |
| 161 | `filterAdd` — 加入 Filter | LEGACY Specialist | Filter menu primary / existing Filter-stack Properties readout | C25 + P1-F are normal creative capability |
| 162 | `filterMoveUp` — 上移 Filter | LEGACY Specialist | Properties/Layers filter-stack contextual reorder | stack ordering is contextual state, not Specialist-only |

Specialist may retain diagnostic access, but it is no longer the primary creative route for these controls.

## 4. Existing select controls requiring corrected disposition

| Existing select | Old disposition | Updated disposition |
|---|---|---|
| `adjustmentType` | LEGACY Specialist | Adjustments panel / adjustment chooser popover; contextual parameters in Properties/dialog |
| `filterType` | LEGACY Specialist | Filter menu / Filter Gallery chooser; selected stack item in Properties |
| `paintBrush` | advanced Stroke Session | retain advanced route, but ordinary Blender/Smudge and promoted brush families must also be reachable from normal Draw/Retouch flyouts |
| `artboardUnit` | Properties > Document/Layout | retained; also drives ruler/measurement display unit where current authority permits |
| `paperType` | Properties > Document/Layout | retained; Brush/Media contextual secondary allowed |

All other predecessor select dispositions remain valid.

## 5. Updated left-toolbar control inventory

Persistent shell should remain compact. New P1 functions are grouped into flyouts rather than each becoming a permanent slot.

| Toolbar slot / group | Primary visible member | Flyout contents / behavior | New? |
|---|---|---|---|
| Draw | current last-used draw tool | Pen, Pencil, Marker, Brush, Airbrush, Blender, Smudge | expanded |
| Eraser | Eraser | Eraser modes only if supported | existing |
| Selection basic | Select | basic object/select interaction | existing |
| Lasso | Lasso | Lasso, Polygonal Lasso, Magnetic Lasso | expanded |
| Smart selection | last-used smart selection | Quick Selection, Magic Wand, Object Selection | NEW group |
| Fill | last-used fill | Gradient, Paint Bucket | NEW group |
| Sampling | Eyedropper | Eyedropper, Color Sampler | NEW group |
| Retouch — Clone | Clone Stamp | Clone Stamp, Pattern Stamp | NEW group |
| Retouch — Healing | Spot Healing | Healing, Spot Healing, Patch | NEW group |
| Retouch — Tone | Dodge | Dodge, Burn, Sponge | NEW group |
| Retouch — Detail | Blur | Local Blur, Local Sharpen | NEW group |
| Color replacement | Color Replacement Brush | may share Brush/Retouch flyout to avoid extra slot | NEW contextual |
| Shape | last-used shape | Line, Arrow, Rectangle, Ellipse/Circle, Triangle, Polygon, Polyline | normalized |
| Text | Text | Horizontal/Paragraph, Vertical Type; Text on Path is contextual/menu action | expanded |
| Image | Image | image/reference placement only | existing |
| Pan | Pan | view navigation | existing |
| Measure | Measure/ruler interaction | optional compact route when ruler direct interaction is insufficient | NEW requirement, may be grouped with Sampling |

Final physical visible-slot count is intentionally not frozen by this planning document; grouping must preserve low-interference layout.

## 6. Contextual Options Bar requirements

Options Bar contains only high-frequency parameters of the active tool/mode.

| Context | Required quick controls |
|---|---|
| Lasso/Polygonal/Magnetic | new/add/subtract/intersect selection mode; feather where existing authority supports; Magnetic bounded settings only |
| Quick Selection | brush/sample size; add/subtract; tolerance/edge setting |
| Magic Wand | tolerance; contiguous |
| Object Selection | ROI mode; seed behavior only if exposed without implying semantic AI |
| Select and Mask | command entry; refinement itself belongs to dialog |
| Gradient | raster/vector target context; linear/radial; gradient preview; opacity |
| Paint Bucket | color; tolerance; contiguous; opacity |
| Eyedropper/Color Sampler | sample radius/mode; current sample readout |
| Clone/Pattern Stamp | size; opacity; source/pattern state |
| Healing tools | size; strength/source state as applicable |
| Dodge/Burn/Sponge | size; strength; tool mode |
| Blur/Sharpen | size; strength/radius |
| Color Replacement | replacement color; tolerance; strength |
| Text | font, size, immediate paragraph/writing-direction state, commit/cancel |
| Transform advanced | active Skew/Distort/Perspective/Warp mode; apply/cancel |
| Draw | color; size; opacity; preset; high-frequency dynamics only |
| Pan/View | zoom/view state only where useful |

Deep parameter sets remain in Properties/dialogs.

## 7. Right-side panel control ledger

### Required normal panels

| Panel | Core controls |
|---|---|
| Properties | Document, Transform, Appearance, Text, Mask, Brush, Media, Layout, Component, selected raster/color state |
| Layers | hierarchy, add/duplicate/delete/reorder, visibility, lock, opacity, blend mode, mask entry, `fx` entry, adjustment/filter stack state |
| History | step list, jump, retention options; Undo/Redo same authority |
| Navigator | thumbnail, proxy viewport, pan/jump, zoom percentage, minus/slider/plus |
| Pages | add/duplicate/delete/switch/rename |
| Color | foreground/background/current/sample color; no second color-management engine |
| Channels | process/alpha/spot/multichannel channel list and supported channel actions |
| Adjustments | create supported adjustment stack items and presets/entry; selected item parameters route to Properties/dialog |
| Libraries | search/filter/inspect/use through native authority |
| Reference | import/decompose/extraction actions |
| Compose | recipe/structure/advanced creative configuration |
| CHAT | governed proposal/approval/execute workflow |
| Revision | capture/list/inspect/restore/compare |
| Specialist | engineering/QA/Program Import/Stroke Session/diagnostics |

### Panels not created

- permanent Filters panel;
- permanent Layer Effects panel per effect;
- permanent Liquify panel;
- separate Mask panel unless later usability evidence requires it;
- Runtime panel;
- Asset Lifecycle panel;
- Renderer/GPU panel in normal creative dock.

## 8. Dialog / modal / specialist-workspace controls

| Surface | Entry | Required content |
|---|---|---|
| Select and Mask | Select menu / Properties Mask | smooth, feather, expand, contract; preview/apply/cancel |
| Layer Effects | Layers `fx` / Layer menu | Drop Shadow, Inner Shadow, Outer Glow, Color Overlay, Stroke; effect enable/order/parameters |
| Filter parameter dialog | Filter menu command | command-specific bounded parameters + preview/apply/cancel |
| Filter Gallery | Filter > Filter Gallery | promoted filter-gallery descriptor foundation; filter choice + supported parameters |
| Liquify | Filter > Liquify | Forward Warp, Twirl, Pucker, Bloat, Reconstruct, freeze/protect mask; apply/cancel |
| Gradient editor | Gradient Options / Properties | stops, offsets, colors, opacity; raster/vector dispatch through one visible editor |
| Pattern fill editor | Properties > Appearance | pattern reference, origin, scale, rotation, repeat |
| Color Profile | Image > Color Profile | inspect embedded ICC; only supported assign/convert paths enabled |
| Export | File > Export | supported format, scope, scale, PPI, format-specific status/loss disclosure |
| Pen Calibration | Settings/Help | calibration profile controls |
| Recovery | automatic contextual modal | recover prior valid snapshot/checkpoint when needed |

## 9. Top-menu control ledger after reconciliation

### File
- New
- Open INK
- Open/Import external image: PSD / PSB / TIFF / RAW / EXR as supported
- Import Reference
- Import SVG
- Save
- Export
- Print

### Edit
- Undo / Redo
- Duplicate
- Delete
- Preferences/Settings route

### Image
- Document/Artboard settings route
- Mode: 8/16/32-bit; RGB/CMYK/Lab/Multichannel
- Color Profile / ICC inspect-supported operations
- Adjustments submenu
- raster/image operations that already exist such as crop/resize where appropriate

### Layer
- Add/Duplicate/Delete
- Group/Ungroup/hierarchy routes
- Mask submenu
- Layer Effects
- adjustment-layer/stack entry only when it maps to existing C24 authority
- arrange secondary route

### Type
- Text tool routes
- Paragraph / Vertical Type
- Text on Path contextual command

### Select
- selection tools secondary routes
- Select and Mask
- selection from alpha/path where appropriate
- selection modification routes that map to existing mask/selection authority

### Filter — NEW NORMAL MENU
- existing and P1-F filters
- Filter Gallery
- Liquify

### Object
- Transform
- Arrange
- Align/Distribute
- Path/Stroke
- Boolean
- Repeat
- Frame/Layout
- Component

### View
- zoom/fit/reset/fullscreen
- Rulers
- Guides
- Grid
- Snap
- Snap To categories
- show/hide guide/grid/bleed/safe-area where supported
- workspace secondary routes

### Window
Mirrors dockable panels:
- Properties
- Layers
- History
- Navigator
- Pages
- Color
- Channels
- Adjustments
- Libraries
- Reference
- Compose
- CHAT
- Revision
- Specialist

### Help
- shortcuts/help/about/capability readout
- updates
- diagnostics/product health
- storage/offline/release health
- pen/device diagnostics

## 10. Headless-only / hidden control ledger

No ordinary UI control is planned for:

- C62 asset manifest validation/audit/package/migration;
- dependency-graph/recompute internals except reports where useful;
- renderer cache/resource internals;
- tile atlas/resource budget internals;
- migration helpers;
- output handle lifecycle internals;
- semantic grounding internals;
- external model/transport internals beyond accepted CHAT settings;
- runtime harness/controller state.

These remain automatic, CHAT-internal, or Specialist diagnostics.

## 11. Updated ledger result

```text
PREDECESSOR_STATIC_BUTTONS_ACCOUNTED = 212 / 212
PREDECESSOR_SELECTS_ACCOUNTED = 29 / 29
EXISTING_BUTTON_DISPOSITION_CORRECTIONS = 4
EXISTING_SELECT_DISPOSITION_CORRECTIONS = 2 primary + contextual brush normalization
NEW_P1_TOOL_GROUPS_DEFINED = YES
NEW_REQUIRED_PANELS = Color / Channels / Adjustments
NEW_REQUIRED_DIALOGS_WORKSPACES = SelectAndMask / LayerEffects / Filter / FilterGallery / Liquify / ColorProfile
FILTER_TOP_MENU = REQUIRED
HEADLESS_NORMAL_UI_CONTROLS = 0
IMPLEMENTATION = 0
NEXT = MR REVIEW
```
