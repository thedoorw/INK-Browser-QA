# INK UI Updated Control Ledger v1.0

STATUS: `UR_REVISION_COMPLETE / MR_REVIEW_REQUIRED / UI_IMPLEMENTATION_HOLD`

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

## 11. Stable planned-control identity

These `PUI-xxx` values are planning identities only. They are stable reconciliation references and **must not be treated as DOM IDs, implementation selectors, component IDs, or command IDs**.

Every row below has implementation status `PLANNED`. Existing predecessor IDs 1–212 and the existing select names remain unchanged.

| Planning ID | Disposition | Capability / atomic source | Planned control / surface requirement | Primary surface | Implementation status |
|---|---|---|---|---|---|
| PUI-001 | RELOCATE | C23 / predecessor #159 maskAdd | Mask add/create authority | Layers local action; Layer > Mask secondary | PLANNED |
| PUI-002 | RELOCATE | C24 / predecessor #160 adjustmentAdd | Adjustment add/create authority | Adjustments panel; Image > Adjustments secondary | PLANNED |
| PUI-003 | RELOCATE | C25 / predecessor #161 filterAdd | Filter add/create authority | Filter top menu; stack readout secondary | PLANNED |
| PUI-004 | RELOCATE | C25 / predecessor #162 filterMoveUp | Filter stack reorder authority | Properties/Layers contextual stack | PLANNED |
| PUI-005 | RETIRE_DUPLICATE | C01 / predecessor duplicate New | Duplicate desktop New control | Retire duplicate; File/top shell remains authority | PLANNED |
| PUI-006 | RETIRE_DUPLICATE | C01 / predecessor duplicate Open | Duplicate desktop Open control | Retire duplicate; File/top shell remains authority | PLANNED |
| PUI-007 | RETIRE_DUPLICATE | C01 / predecessor duplicate Save | Duplicate desktop Save control | Retire duplicate; File/top shell remains authority | PLANNED |
| PUI-008 | RETIRE_DUPLICATE | C43 / predecessor desktop Undo | Duplicate desktop Undo control | Retire duplicate; Edit/History/shortcut remains authority | PLANNED |
| PUI-009 | RETIRE_DUPLICATE | C43 / predecessor desktop Redo | Duplicate desktop Redo control | Retire duplicate; Edit/History/shortcut remains authority | PLANNED |
| PUI-010 | EXPAND_FLYOUT | C29/C33 | Draw flyout expansion | Left toolbar Draw: Pen/Pencil/Marker/Brush/Airbrush/Blender/Smudge | PLANNED |
| PUI-011 | EXPAND_FLYOUT | C07 + P1-A/P1-E | Lasso flyout expansion | Left toolbar Lasso: Lasso/Polygonal/Magnetic | PLANNED |
| PUI-012 | NEW | P1-A/P1-E | Smart Selection tool group | Left toolbar: Quick Selection/Magic Wand/Object Selection | PLANNED |
| PUI-013 | NEW | P1-A | Fill tool group | Left toolbar: Gradient/Paint Bucket | PLANNED |
| PUI-014 | NEW | P1-A | Sampling tool group | Left toolbar: Eyedropper/Color Sampler | PLANNED |
| PUI-015 | NEW | P1-B | Retouch Clone group | Left toolbar: Clone Stamp/Pattern Stamp | PLANNED |
| PUI-016 | NEW | P1-B | Retouch Healing group | Left toolbar: Healing/Spot Healing/Patch | PLANNED |
| PUI-017 | NEW | P1-B | Retouch Tone group | Left toolbar: Dodge/Burn/Sponge | PLANNED |
| PUI-018 | NEW | P1-B | Retouch Detail group | Left toolbar: Local Blur/Local Sharpen | PLANNED |
| PUI-019 | CONTEXTUAL_ONLY | P1-B | Color Replacement Brush route | Shared Brush/Retouch flyout; no dedicated persistent slot | PLANNED |
| PUI-020 | EXPAND_FLYOUT | C11 | Shape flyout normalization | Left toolbar Shape: all supported primitives | PLANNED |
| PUI-021 | EXPAND_FLYOUT | C20 + P1-C | Text tool expansion | Text tool: paragraph/horizontal + vertical; Text on Path contextual | PLANNED |
| PUI-022 | CONTEXTUAL_ONLY | P1-C ruler/measurement | Measure/ruler interaction route | Ruler/direct interaction; Sampling-group fallback only if needed | PLANNED |
| PUI-023 | CONTEXTUAL_ONLY | C07 + P1-A/P1-E | Selection Options controls | Options Bar: mode/tolerance/contiguous/ROI/bounded Magnetic settings | PLANNED |
| PUI-024 | CONTEXTUAL_ONLY | P1-A/P1-C gradient | Gradient Options controls | Options Bar: target-aware type/preview/opacity | PLANNED |
| PUI-025 | CONTEXTUAL_ONLY | P1-B | Retouch Options controls | Options Bar: size/strength/source/pattern by active tool | PLANNED |
| PUI-026 | CONTEXTUAL_ONLY | C30-C32 | Brush Options controls | Options Bar high-frequency preset/color/size/opacity/dynamics subset | PLANNED |
| PUI-027 | CONTEXTUAL_ONLY | C13/C14 + P1-C | Advanced Transform Options | Options Bar/canvas: mode + apply/cancel + numeric quick fields | PLANNED |
| PUI-028 | PANEL | C06 / G-04 | Navigator panel normalization | Right dock / Window > Navigator | PLANNED |
| PUI-029 | PANEL | P1-G | Color panel | Right dock / Window > Color | PLANNED |
| PUI-030 | PANEL | P1-G | Channels panel | Right dock / Window > Channels | PLANNED |
| PUI-031 | PANEL | C24 + P1-F | Adjustments panel | Right dock / Window > Adjustments | PLANNED |
| PUI-032 | PANEL | C03/C13/C19/C20/C23/C28/C30-C32/C38 | Properties target-aware sections | Right dock / Window > Properties | PLANNED |
| PUI-033 | PANEL | C03/C23-C28 | Layers capability expansion | Right dock: blend/mask/fx/adjustment-filter state | PLANNED |
| PUI-034 | PANEL | C43 | History normalization | Right dock / Window > History | PLANNED |
| PUI-035 | PANEL | C02 / G-01 | Pages normalization | Right dock / Window > Pages | PLANNED |
| PUI-036 | PANEL | C59 | Libraries normalization | Right dock / Window > Libraries | PLANNED |
| PUI-037 | PANEL | C40/C41 | Reference normalization | Right dock / Window > Reference | PLANNED |
| PUI-038 | PANEL | C42/C55/C60/C61 | Compose normalization | Right dock / Window > Compose | PLANNED |
| PUI-039 | PANEL | C57/C60 | CHAT normalization | Right dock / Window > CHAT | PLANNED |
| PUI-040 | PANEL | C44-C46 | Revision/Compare normalization | Right dock / Window > Revision | PLANNED |
| PUI-041 | DIALOG/WORKSPACE | P1-A / C23 | Select and Mask dialog | Select menu / Properties > Mask | PLANNED |
| PUI-042 | DIALOG/WORKSPACE | C27 + P1-D | Layer Effects dialog | Layers fx / Layer > Layer Effects | PLANNED |
| PUI-043 | DIALOG/WORKSPACE | C25 + P1-F | Filter parameter dialog | Filter command-specific modal | PLANNED |
| PUI-044 | DIALOG/WORKSPACE | P1-F | Filter Gallery | Filter > Filter Gallery | PLANNED |
| PUI-045 | DIALOG/WORKSPACE | P1-F | Liquify temporary workspace | Filter > Liquify | PLANNED |
| PUI-046 | DIALOG/WORKSPACE | P1-A/P1-C | Gradient editor | Gradient Options / Properties; target-aware dispatch | PLANNED |
| PUI-047 | DIALOG/WORKSPACE | P1-C | Pattern fill editor | Properties > Appearance | PLANNED |
| PUI-048 | DIALOG/WORKSPACE | P1-G | Color Profile dialog | Image > Color Profile | PLANNED |
| PUI-049 | DIALOG/WORKSPACE | C52/C53 + P1-H | Export dialog | File > Export | PLANNED |
| PUI-050 | DIALOG/WORKSPACE | C37 | Pen Calibration dialog | Settings/Help > Pen Calibration | PLANNED |
| PUI-051 | DIALOG/WORKSPACE | C48 | Recovery modal | Automatic/contextual when recoverable state exists | PLANNED |
| PUI-052 | NEW | C25 + P1-F | Top-level Filter menu | Top Menu > Filter | PLANNED |
| PUI-053 | NEW | P1-G | Image > Mode hierarchy | Top Menu > Image > Mode | PLANNED |
| PUI-054 | NEW | P1-G | Image > Color Profile entry | Top Menu > Image > Color Profile | PLANNED |
| PUI-055 | NEW | C08 + P1-C | Ruler/Guide/Snap workstation controls | View + top/left rulers + direct guide/snap feedback | PLANNED |
| PUI-056 | NEW | P1-H / C53 | External format availability/loss disclosure | File Open/Import + Export dialog | PLANNED |
| PUI-057 | HEADLESS_NO_CONTROL | C47 | Storage implementation internals | No normal control; Help health readout only | PLANNED |
| PUI-058 | HEADLESS_NO_CONTROL | C49 | Renderer implementation internals | No normal creative control; Specialist diagnostics only | PLANNED |
| PUI-059 | HEADLESS_NO_CONTROL | C50 | Natural-media renderer internals | No normal creative control | PLANNED |
| PUI-060 | HEADLESS_NO_CONTROL | C51 | GPU/tile/cache infrastructure | No normal creative control; Specialist diagnostics only | PLANNED |
| PUI-061 | HEADLESS_NO_CONTROL | C54 | Dependency/recompute internals | No normal creative control; reports may be read-only | PLANNED |
| PUI-062 | HEADLESS_NO_CONTROL | C58 | Semantic grounding internals | No semantic-grounding panel; CHAT readout only | PLANNED |
| PUI-063 | HEADLESS_NO_CONTROL | C62 / 5 platform-support atomics | Asset lifecycle support | No normal control; Specialist diagnostic readout only | PLANNED |
| PUI-064 | HEADLESS_NO_CONTROL | C53 output-handle lifecycle | Output handle inspect/release lifecycle | No ordinary Export control | PLANNED |
| PUI-065 | HEADLESS_NO_CONTROL | C36 automatic stylus signals | Pressure/tilt/altitude/azimuth/twist/event pipeline | No dedicated controls; diagnostics/readouts only | PLANNED |
| PUI-066 | HEADLESS_NO_CONTROL | C63 automatic update lifecycle | Service-worker registration/detection/install tracking | No direct control; status/activation handled separately | PLANNED |
| PUI-067 | NEW | C63 / G-34 | Help > Updates surface | Help/Settings update status + activate waiting update | PLANNED |
| PUI-068 | NEW | C64 | Help > Diagnostics normalization | Help/Specialist health, device, bundle, benchmark routes | PLANNED |
| PUI-069 | CONTEXTUAL_ONLY | C52 / G-30 | High-resolution export progress controls | Export progress: cancel/resume/state | PLANNED |
| PUI-070 | CONTEXTUAL_ONLY | C30 / G-19 | Brush Package import/export actions | Brush preset menu / Libraries; no persistent toolbar slot | PLANNED |
| PUI-071 | CONTEXTUAL_ONLY | C22 | Raster image histogram/snapshot/compare readouts | Properties/Revision; no permanent Image subpanel | PLANNED |
| PUI-072 | CONTEXTUAL_ONLY | C46 / G-28 | Compare mode controls | Revision/canvas compare mode; shared authority | PLANNED |
| PUI-073 | CONTEXTUAL_ONLY | C60 / G-33 | Memory/Research advisory controls | CHAT/Compose readout + explicit promotion candidate action | PLANNED |
| PUI-074 | CONTEXTUAL_ONLY | C64 | Diagnostics/benchmark execution controls | Help/Specialist only when diagnostic context is invoked | PLANNED |

### Planning-ID totals

```text
PLANNED_CONTROL_IDENTITIES = 74
NEW = 14
RELOCATE = 4
EXPAND_FLYOUT = 4
RETIRE_DUPLICATE = 5
CONTEXTUAL_ONLY = 13
PANEL = 13
DIALOG_WORKSPACE = 11
HEADLESS_NO_CONTROL = 10
IMPLEMENTATION_STATUS = PLANNED_ONLY
DOM_ID_PRESCRIPTION = NONE
```

### Gap-to-planning-ID reconciliation

| Gap range | Planning identity coverage |
|---|---|
| G-01–G-04 | PUI-035, PUI-032, PUI-028 plus existing artboard/workspace shell controls retained by predecessor ledger |
| G-05–G-11 | PUI-011–PUI-014, PUI-020–PUI-027, PUI-041, PUI-055 plus retained Object/Type routes |
| G-12–G-18 | PUI-001–PUI-004, PUI-031–PUI-033, PUI-041–PUI-042, PUI-071 |
| G-19–G-25 | PUI-010, PUI-019, PUI-026, PUI-050, PUI-065, PUI-070 plus Properties/Media planning |
| G-26–G-29 | PUI-037–PUI-040, PUI-051, PUI-072 |
| G-30–G-34 | PUI-049, PUI-053–PUI-056, PUI-067, PUI-069, PUI-073 |

Headless PUI rows are negative-control planning records. They deliberately prevent internal atomics from being converted into visible chrome.

## 12. Updated ledger result

```text
PREDECESSOR_STATIC_BUTTONS_ACCOUNTED = 212 / 212
PREDECESSOR_SELECTS_ACCOUNTED = 29 / 29
EXISTING_BUTTON_DISPOSITION_CORRECTIONS = 4
EXISTING_SELECT_DISPOSITION_CORRECTIONS = 2 primary + contextual brush normalization
NEW_P1_TOOL_GROUPS_DEFINED = YES
NEW_REQUIRED_PANELS = Color / Channels / Adjustments
NEW_REQUIRED_DIALOGS_WORKSPACES = SelectAndMask / LayerEffects / Filter / FilterGallery / Liquify / ColorProfile
FILTER_TOP_MENU = REQUIRED
PLANNED_CONTROL_IDENTITIES = 74
PLANNED_NEW = 14
PLANNED_RELOCATE = 4
PLANNED_EXPAND_FLYOUT = 4
PLANNED_RETIRE_DUPLICATE = 5
PLANNED_CONTEXTUAL_ONLY = 13
PLANNED_PANELS = 13
PLANNED_DIALOG_WORKSPACES = 11
PLANNED_HEADLESS_NO_CONTROL = 10
HEADLESS_NORMAL_UI_CONTROLS = 0
IMPLEMENTATION = 0
NEXT = MR REVIEW
```
