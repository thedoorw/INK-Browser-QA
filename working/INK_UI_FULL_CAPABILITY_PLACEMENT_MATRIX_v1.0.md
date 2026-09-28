# INK UI Full Capability Placement Matrix v1.0

STATUS: `UR_REVISION_COMPLETE / MR_REVIEW_REQUIRED / UI_IMPLEMENTATION_HOLD`

TASK: `INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

BRANCH: `work/ink-ui-full-capability-reconciliation-001`

DATE: 2026-09-28

AUTHORITY INPUTS:
- `README.md`
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `working/WORKING_STATUS.md`
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_CAPABILITY_CENSUS_v0.1.md`
- `working/INK_UI_FINAL_STATIC_CONTROL_LEDGER_v1.0.md`
- `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`
- `working/INK_UI_CAPABILITY_RECONCILIATION_GAPS_v0.1.md`
- promoted P1 A-H + P1 Integration evidence on main

PRODUCT MUTATION: `0`

UI IMPLEMENTATION: `0`

## 1. Purpose

Reconcile the full normalized product capability registry against the final workstation UI architecture after P1 A-H completion.

This document is placement planning only. It does not authorize implementation and does not clear the current UI HOLD.

Coverage rule:

```text
CANONICAL_CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
P1_A_TO_H = INCLUDED
PRIMARY_HOME_PER_CAPABILITY = 1
SECONDARY_ENTRY = ONLY_WHEN_WORKFLOW_VALUE_EXISTS
DUPLICATE_AUTHORITIES = 0
```

Every normalized atomic capability inherits the placement rule of its canonical family unless an explicit atomic exception is listed in section 4. No atomic capability is omitted merely because it has no dedicated button.

## Atomic-level authority

The 64-family matrix below remains the high-level architecture. It is no longer the only disposition evidence.

Authoritative atomic companion:
`working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`

Coverage:
```text
PRODUCT_ATOMICS = 496 / 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5 / 5
TOTAL_NORMALIZED_ATOMICS = 501 / 501
ATOMIC_AUDIT_NEW_GAPS = 0
```

Every normalized atomic has its own explicit row. `INHERIT:Cxx` is used only where the atomic genuinely shares the family placement; heterogeneous families are split atomically. Promoted P1 A-H placement remains an explicit overlay in the atomic companion.

## 2. Placement vocabulary

- `GENERAL` — normal creative UI entry required.
- `CONTEXTUAL` — shown only when relevant target/tool/state is active.
- `SPECIALIST` — advanced/engineering/diagnostic workflow.
- `HEADLESS` — no general human UI required.
- `DIRECT` — direct canvas manipulation is the primary route.
- `MENU`, `TOOL`, `FLYOUT`, `OPTIONS`, `PANEL`, `PROPERTIES`, `DIALOG`, `WORKSPACE` — surface type.
- Existing entry: `YES`, `PARTIAL`, `NO`, `INTERNAL`.
- Position issue: `YES` means current entry exists but is not suitable as the final primary home.

## 3. Full family placement matrix

| ID | Family | General UI? | Primary entry | Secondary entry | Contextual | Panel / dialog | Group / flyout | Avoid duplicate | Existing entry | Position issue | New gap |
|---|---|---|---|---|---|---|---|---|---|---|---|
| C01 | Document / project | GENERAL | File | keyboard / start surface | No | New/Open/Save dialogs as needed | File group | one document authority | YES | No | — |
| C02 | Pages | GENERAL | Pages panel | Window > Pages | Yes | PANEL | — | no second page navigator | YES | PARTIAL | G-01 |
| C03 | Layers | GENERAL | Layers panel | Layer menu | Yes | PANEL | layer actions | one layer hierarchy authority | YES | No | — |
| C04 | Creation / Layout workspaces | GENERAL | workspace switcher | View > Workspace | No | shell state | — | one workspace state owner | YES | PARTIAL | G-02 |
| C05 | Artboard / print | GENERAL | Properties > Document/Layout | File > Print / View fit | Yes | PROPERTIES / print dialog | — | no second print-layout model | YES | PARTIAL | G-03 |
| C06 | Canvas navigation | GENERAL | DIRECT canvas + Navigator | View menu / status controls | Yes | Navigator PANEL | navigation group | one camera per workspace | YES | PARTIAL | G-04 |
| C07 | Selection | GENERAL | Selection tool family | Select menu | Yes | OPTIONS / Properties | selection flyouts | one selection authority | YES | YES | G-05 |
| C08 | Smart guides / snapping | GENERAL | View > Snap / Snap To + direct manipulation | Properties/View quick state | Yes | OPTIONS / transient canvas feedback | snap controls | one page.snap authority | PARTIAL | YES | G-06 |
| C09 | Align / distribute | GENERAL | Object > Align / Distribute | contextual Options / Properties | Yes | OPTIONS / PROPERTIES | align group | no toolbar duplication | YES | No | — |
| C10 | Pen / vector Path | GENERAL | Pen/Draw tools | Object > Path | Yes | OPTIONS / PROPERTIES | Draw flyout | one Path authority | YES | No | — |
| C11 | Shapes | GENERAL | Shape tool | Properties | Yes | OPTIONS / PROPERTIES | Shape flyout | one shape creation route | YES | PARTIAL | G-07 |
| C12 | Boolean | GENERAL | Object > Boolean | contextual Properties shortcut | Yes | — | submenu | no dedicated toolbar group | YES | No | — |
| C13 | Transform | GENERAL | DIRECT canvas | Object > Transform / Properties numeric | Yes | PROPERTIES | transform group | one transform authority | YES | PARTIAL | G-08 |
| C14 | Non-destructive deformation | GENERAL | Object > Transform > Warp/Deform | contextual Options | Yes | DIALOG / on-canvas mode | transform group | no second deformation model | PARTIAL | YES | G-09 |
| C15 | Group / ungroup | GENERAL | Object / Edit menu | contextual shortcut | Yes | — | — | avoid topbar duplicates | YES | No | — |
| C16 | Frame / hierarchy | GENERAL | Layers direct hierarchy + Object > Frame | Properties > Layout | Yes | PANEL / PROPERTIES | hierarchy group | one hierarchy authority | YES | No | — |
| C17 | Repeat / parametric | GENERAL | Object > Repeat | Properties / Compose | Yes | PROPERTIES | Repeat submenu | no second parametric engine | YES | No | — |
| C18 | Components | GENERAL | Object > Component / Libraries | Properties > Component | Yes | PANEL / PROPERTIES | Component submenu | no second component engine | YES | No | — |
| C19 | Auto / Flex layout | GENERAL | Properties > Layout | Object > Frame/Layout | Yes | PROPERTIES | layout section | no Grid engine invention | YES | PARTIAL | G-10 |
| C20 | Text | GENERAL | Text tool | Type menu | Yes | OPTIONS / PROPERTIES | Text tool group | one text object model | YES | YES | G-11 |
| C21 | SVG | GENERAL | File > Import/Export | Object/Reference contextual route | No | Import/Export dialog | format group | one SVG parser/exporter | YES | No | — |
| C22 | Raster / Image objects | GENERAL | Image tool + Layers | Image menu / Properties | Yes | PROPERTIES | image group | one raster object model | YES | YES | G-12 |
| C23 | Raster / vector masks | GENERAL | Layers mask controls + Properties > Mask | Layer menu | Yes | PROPERTIES / mask refinement dialog | mask action group | no Specialist-only primary | PARTIAL | YES | G-13 |
| C24 | Adjustment stack | GENERAL | Adjustments panel | Image > Adjustments / Layer > New Adjustment | Yes | PANEL / parameter dialog | adjustment family | one existing adjustment stack | PARTIAL | YES | G-14 |
| C25 | Filter stack | GENERAL | Filter menu | Properties/Layers stack readout | Yes | DIALOG / Filter Gallery | filter family | one existing filter stack | PARTIAL | YES | G-15 |
| C26 | Blend modes | GENERAL | Layers / Properties > Appearance | — | Yes | PROPERTIES | appearance group | one compositing authority | INTERNAL/PARTIAL | YES | G-16 |
| C27 | Layer effects | GENERAL | Layers `fx` / Layer > Layer Effects | Properties > Appearance | Yes | DIALOG / PROPERTIES | effects group | one applyLayerEffects authority | PARTIAL | YES | G-17 |
| C28 | Reusable raster source | GENERAL | Layers/Properties raster-source state | contextual create/instance action | Yes | PROPERTIES | image/source group | do not invent Smart Object #2 | INTERNAL/PARTIAL | YES | G-18 |
| C29 | Drawing tools | GENERAL | Left Toolbar | brush/draw flyout | Yes | OPTIONS | Draw flyout | no duplicated desktop buttons | YES | No | — |
| C30 | Brush engine | GENERAL | Brush tool Options | Properties > Brush | Yes | PROPERTIES | Brush flyout/preset picker | preset registry is single authority | YES | PARTIAL | G-19 |
| C31 | Natural media | GENERAL | Brush preset / mode | Properties > Brush/Media | Yes | PROPERTIES | brush preset family | no separate media toolbar | YES | PARTIAL | G-20 |
| C32 | Brush dynamics | GENERAL | Contextual Options quick set | Properties > Brush Dynamics | Yes | PROPERTIES | collapsed sections | do not expose every param permanently | PARTIAL | YES | G-21 |
| C33 | Blender / Smudge | GENERAL | Draw/Retouch flyout | Properties | Yes | OPTIONS | Draw flyout | same brush engine | PARTIAL | YES | G-22 |
| C34 | Stroke editing | GENERAL | Object > Path/Stroke + canvas edit mode | Options/Properties | Yes | OPTIONS / PROPERTIES | Path/Stroke group | no second node editor | YES | No | — |
| C35 | Stroke Session | SPECIALIST | Specialist > Stroke Session | advanced draw workflow shortcut | Yes | WORKSPACE/PANEL | — | not normal permanent chrome | YES | No | — |
| C36 | Stylus | GENERAL + SPECIALIST | direct input behavior | Help/Diagnostics test route | Yes | Specialist diagnostics | — | diagnostics secondary only | YES | PARTIAL | G-23 |
| C37 | Device calibration | SPECIALIST | Help/Settings > Pen Calibration | Specialist | No | DIALOG / Specialist | — | keep off normal creative chrome | YES | PARTIAL | G-24 |
| C38 | Paper / media | GENERAL | Properties > Document/Media | brush/media contextual shortcut | Yes | PROPERTIES | media section | one paper model | YES | PARTIAL | G-25 |
| C39 | Material system | GENERAL | Properties > Appearance | Libraries shortcut | Yes | PROPERTIES / PANEL | appearance group | no second material engine | YES | No | — |
| C40 | Reference import | GENERAL | Reference panel | File > Import Reference / Image contextual | Yes | PANEL | reference group | one reference authority | YES | No | — |
| C41 | Extraction / vectorization | GENERAL | Reference panel action | Object contextual route | Yes | DIALOG / PANEL | Reference actions | no standalone duplicate tool | PARTIAL | PARTIAL | G-26 |
| C42 | Structure reconstruction | ADVANCED GENERAL | Compose panel | Reference/CHAT shortcut | Yes | PANEL / specialist detail | reconstruction section | one structure plan authority | PARTIAL | PARTIAL | G-27 |
| C43 | History | GENERAL | History panel | Edit Undo/Redo / keyboard | Yes | PANEL | — | one HistoryManager | YES | No | — |
| C44 | Revision | GENERAL | Revision panel | CHAT governed shortcut | Yes | PANEL | — | never merge with History | YES | No | — |
| C45 | Provenance | GENERAL READOUT | Revision / CHAT readout | Properties details | Yes | PANEL readout | — | no separate provenance editor | PARTIAL | No | — |
| C46 | Compare / Variant | GENERAL | Compare/Revision contextual view | CHAT shortcut | Yes | DIALOG / canvas compare mode | compare group | one preview authority | YES/PARTIAL | PARTIAL | G-28 |
| C47 | Storage | HEADLESS + DIAGNOSTIC | no general entry | Help > Diagnostics | No | Specialist diagnostic | — | never expose backend choices as creative controls | INTERNAL | No | — |
| C48 | Recovery | GENERAL only when needed | recovery prompt | Help > Diagnostics | Contextual | MODAL | — | no permanent panel | INTERNAL | No | G-29 |
| C49 | Renderer | HEADLESS + SPECIALIST | automatic | Specialist renderer setting | No | Specialist | — | no creative renderer duplication | YES | No | — |
| C50 | Natural-media renderer | HEADLESS | automatic via media selection | Specialist diagnostics | Yes | — | — | no renderer controls in brush chrome | INTERNAL | No | — |
| C51 | GPU / large-canvas infrastructure | HEADLESS + DIAGNOSTIC | automatic | Help/Specialist diagnostics | No | Specialist | — | no normal GPU panel | YES | No | — |
| C52 | High-resolution export | GENERAL | Export dialog | output status | Contextual | DIALOG | export advanced section | one export pipeline | YES | PARTIAL | G-30 |
| C53 | Output | GENERAL | File > Export / Print | CHAT governed shortcut | No | DIALOG | export group | no second CHAT export engine | YES | PARTIAL | G-31 |
| C54 | Recompute | HEADLESS / CONTEXTUAL | automatic dependency recompute | Specialist report only | No | Specialist readout | — | no normal button per dependency op | INTERNAL | No | — |
| C55 | Recipe / automation | ADVANCED GENERAL | Compose / Recipe workspace | Specialist / CHAT | Yes | PANEL/WORKSPACE | recipe group | one Recipe authority | YES | PARTIAL | G-32 |
| C56 | Program Import | SPECIALIST | Specialist > Program Import | File advanced import shortcut only if accepted | No | WORKSPACE | — | not ordinary File import family | YES | No | — |
| C57 | CHAT control | GENERAL | CHAT panel | contextual governed shortcuts | Yes | PANEL | — | human tools route to native authorities | YES | No | — |
| C58 | Semantic grounding | HEADLESS + READOUT | CHAT internal | Properties semantic readout if useful | Yes | no dedicated panel | — | no semantic toolbar | INTERNAL | No | — |
| C59 | Creative Library | GENERAL | Libraries panel | contextual insert/apply routes | Yes | PANEL | family filter | search/inspect only, native apply | YES | No | — |
| C60 | Creative Memory / Research | ADVANCED GENERAL | CHAT / Compose advisory context | Specialist research detail | Yes | PANEL readout | — | no autonomous memory writes | PARTIAL | No | G-33 |
| C61 | FLORA specialization | SPECIALIST / CONTEXTUAL | Compose/Recipe specialization | CHAT | Yes | WORKSPACE | specialization section | no global FLORA toolbar | INTERNAL/PARTIAL | No | — |
| C62 | Asset lifecycle | HEADLESS | none | Specialist diagnostics only if failure | No | none/general | — | must not enter ordinary UI | INTERNAL | No | — |
| C63 | PWA / update management | SETTINGS/DIAGNOSTIC | Help > Updates | Specialist | No | DIALOG / diagnostic | — | not creative panel | YES | PARTIAL | G-34 |
| C64 | Product health / diagnostics | SPECIALIST | Help > Diagnostics | Specialist | No | WORKSPACE/PANEL | diagnostic groups | no normal creative chrome | YES | No | — |

## 4. P1 A-H atomic placement overrides / additions

These placements supersede the previous frozen-map assumptions where the old baseline lacked the capability.

### P1-A — Selection / Fill / Sampling

| Capability | General UI | Primary | Secondary | Contextual / dialog | Group |
|---|---|---|---|---|---|
| Polygonal Lasso | YES | Lasso flyout | Select menu | Options: add/subtract/intersect | Lasso group |
| Quick Selection | YES | Selection flyout | Select menu | brush size/tolerance in Options | Quick/Magic/Object group |
| Magic Wand | YES | Selection flyout | Select menu | tolerance/contiguous in Options | Quick/Magic/Object group |
| Select and Mask refinement | YES | Select > Select and Mask | Properties > Mask | refinement DIALOG | selection refinement |
| Gradient fill — raster | YES | Gradient/Paint Bucket flyout | Image/Layer contextual | Options: type/stops/opacity | Fill group |
| Paint Bucket | YES | Gradient/Paint Bucket flyout | contextual fill action | tolerance/contiguous in Options | Fill group |
| Eyedropper | YES | Sampling flyout | color control shortcut | sample mode/radius in Options | Sampling group |
| Color Sampler | YES | Sampling flyout | Info/Properties readout | averaged radius/contextual | Sampling group |

One Gradient tool route must dispatch by target context to the existing raster-gradient or vector-fill authority; no duplicate Gradient tools.

### P1-B — Local Raster Retouch

| Capability | Primary | Secondary | Contextual controls | Group |
|---|---|---|---|---|
| Clone Stamp | Retouch flyout | — | brush/radius/opacity/source state | Clone/Pattern |
| Pattern Stamp | Retouch flyout | — | pattern/origin/opacity | Clone/Pattern |
| Healing | Retouch flyout | — | source/brush/strength | Heal group |
| Spot Healing | Retouch flyout | — | brush/radius | Heal group |
| Patch | Retouch flyout | — | source/target/feather | Heal group |
| Dodge | Retouch flyout | — | range/strength/radius | Tone group |
| Burn | Retouch flyout | — | range/strength/radius | Tone group |
| Sponge | Retouch flyout | — | saturate/desaturate/strength | Tone group |
| Local Blur | Retouch flyout | Filter menu optional secondary | radius/strength | Blur/Sharpen |
| Local Sharpen | Retouch flyout | Filter menu optional secondary | radius/amount | Blur/Sharpen |
| Color Replacement Brush | Brush/Retouch flyout | — | tolerance/replacement/strength | Color replace |

All are contextual raster tools. None should be permanent separate top-level menu items.

### P1-C — Vector / Text / Precision

| Capability | Primary | Secondary | UI form |
|---|---|---|---|
| Skew | Object > Transform | Properties | command + on-canvas transform mode |
| Distort | Object > Transform | Properties | command + on-canvas transform mode |
| Perspective | Object > Transform | Properties | command + on-canvas transform mode |
| Warp | Object > Transform > Warp | — | DIALOG/on-canvas mode |
| Paragraph Type | Text tool | Type menu | Options + Properties |
| Vertical Type | Text flyout / Type menu | Properties | contextual text mode |
| Text on Path | Type menu / contextual Path action | Properties | contextual |
| Gradient Fill — vector | Properties > Appearance | Gradient tool contextual route | gradient editor popover/dialog |
| Pattern Fill | Properties > Appearance | Libraries pattern reference | contextual property editor |
| Persistent ruler guides | rulers + direct drag | View > Guides | direct workstation surface |
| Equal-distance snapping | direct manipulation | View > Snap To | transient canvas evidence |
| Ruler / measurement | rulers / Measure tool route | View | direct + Options readout |

The ruler/guide/snap surface is mandatory normal workstation UI, not Specialist.

### P1-D — Layer Effects

Primary: Layers `fx` action and `Layer > Layer Effects`.

One effects dialog/properties surface owns:
- Drop Shadow
- Inner Shadow
- Outer Glow
- Color Overlay
- Stroke

Do not create separate permanent panels for each effect.

### P1-E — Advanced Selection

| Capability | Primary | Group |
|---|---|---|
| Magnetic Lasso | Lasso flyout | Lasso group |
| Object Selection | Selection flyout | Quick/Magic/Object group |

Object Selection is the promoted deterministic Core behavior; the UI must not imply AI/semantic recognition.

### P1-F — Adjustment / Filter / Liquify

Adjustments use one Adjustments authority:
- existing: Brightness/Contrast, Levels, Curves, Hue/Saturation, Color Balance, Gradient Map;
- added: Exposure, Vibrance, Black & White, Photo Filter, Channel Mixer, Color Lookup, Invert, Posterize, Threshold, Selective Color.

Primary:
- Adjustments panel for non-destructive stack creation;
- `Image > Adjustments` as secondary command route where the existing stack contract can represent the operation.

Filters:
- existing: Gaussian Blur, Sharpen, High Pass, Edge Detection, Noise/Grain, Texture Overlay;
- added: Motion Blur, Median, Unsharp Mask, Emboss, Mosaic/Pixelate, Minimum, Maximum, Reduce Noise.

Primary:
- `Filter` top-level menu is now justified and should be created.
- Filter parameters open bounded dialogs and write through the existing Filter stack.
- `Filter > Filter Gallery` opens one Gallery dialog based on the promoted descriptor foundation.

Liquify:
- `Filter > Liquify` opens a Specialist creative workspace/modal, not a permanent right-side panel.
- Forward Warp, Twirl, Pucker, Bloat, Reconstruct and freeze/protect mask live inside that workspace.

### P1-G — Color / Bit Depth / Channels

Primary placement:
- `Image > Mode`: 8/16/32-bit and RGB/CMYK/Lab/Multichannel document/image mode routes.
- `Image > Color Profile`: ICC inspect/assign/convert only within actual supported transform boundaries.
- Color panel: ordinary foreground/background/sample color workflow.
- Channels panel: process, alpha, spot and multichannel channel structure; add/remove/rename/reorder and channel-plane operations where supported.
- Properties: selected image/document color-state readout.

Do not expose unsupported ICC/LUT transform paths as successful actions. Unsupported transforms must remain explicit status/disabled routes.

### P1-H — Format Interoperability

Primary placement:
- File > Open / Import routes for PSD, PSB, TIFF, RAW, EXR.
- File > Export dialog exposes only formats/encoders actually available under the promoted bounded contract.

Rules:
- PSD import + flattened PSD export may be exposed.
- PSB import may be exposed; PSB export only when an accepted adapter is available.
- TIFF import/export must disclose unsupported compression/tile decode states rather than silently flatten.
- RAW is import/decoder-adapter only; do not expose RAW export.
- EXR import and bounded basic export may be exposed.
- preserved unknown/opaque metadata is status/detail information, not a new editing surface.
- no external format becomes a second Document authority.

## 5. Final top-level normal menu impact

The old map prohibited a Filter menu because the old baseline did not authorize a general filter capability. That conclusion is superseded.

Proposed normal top-level taxonomy after reconciliation:

```text
File
Edit
Image
Layer
Type
Select
Filter
Object
View
Window
Help
```

No Brush top-level menu.
No 3D menu.
No engineering/Runtime menu.

## 6. Reconciliation closure

```text
FAMILY_ROWS_RECONCILED = 64 / 64
ATOMIC_ROWS_RECONCILED = 501 / 501
P1_A_H_EXPLICITLY_PLACED = YES
RASTER_MASK_ADJUSTMENT_FILTER_NORMAL_UI = RESTORED
FILTER_TOP_MENU = NOW_JUSTIFIED
RULER_GUIDE_SNAP_NORMAL_WORKSTATION_UI = REQUIRED
CHANNELS_PANEL = REQUIRED
ADJUSTMENTS_PANEL = REQUIRED
LAYER_EFFECTS_DIALOG = REQUIRED
LIQUIFY_WORKSPACE = REQUIRED
HEADLESS_FORCED_INTO_GENERAL_UI = 0
PRODUCT_SOURCE_MUTATION = 0
UI_IMPLEMENTATION = 0
NEXT_OWNER = MR REVIEW
```

STOP after MR review handoff.