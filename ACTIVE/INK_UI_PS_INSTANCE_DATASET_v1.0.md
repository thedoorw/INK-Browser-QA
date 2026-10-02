# Photoshop UI Instance Dataset / Measurement Master v1.0

STATUS: ACTIVE / AUTHORITATIVE PHOTOSHOP UI INSTANCE DATASET
DATE: 2026-10-01
PROGRAM: INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001

## 1. Purpose

This is the single authoritative Photoshop UI instance dataset for INK UI work.

It replaces the previous split measurement/reference documents. Git history is the provenance record; normal implementation and review must not reconstruct the answer by reading older measurement files.

This dataset answers:

```text
WHAT DOES THE REFERENCE PHOTOSHOP UI ACTUALLY LOOK LIKE?
```

It does not decide INK capability scope. It supplies measured geometry, density, visual hierarchy, interaction-state evidence and explicit unknowns.

## 2. Reference environment

Primary reference family:
- Photoshop 21.2.12
- Traditional Chinese UI
- Windows desktop
- 1280×1024 capture
- Photoshop application area 1280×994
- dark Photoshop theme

Known unknowns:
- exact Windows version
- Windows display scale
- Photoshop UI scaling
- UI Font Size preference
- Scale UI To Font state

Rule:
- pixel values are authoritative inside this matched reference family;
- elastic/resizable regions are reference-state values, not universal fixed dimensions;
- unknown scaling metadata must not be silently guessed.

## 3. Measurement classes

```text
LOCKED_FIXED
ALIGNMENT_RELATION
REFERENCE_STATE_ONLY
MEASURED
MEASURED_REFERENCE_STATE
OBSERVED_DENSITY
VISUAL_REFERENCE_ONLY
ELASTIC
BEHAVIOR_CONFIRMED
REFERENCE_MISSING
NOT_APPLICABLE
```

A visible glyph envelope is not automatically a CSS font-size or pointer hitbox.

## 4. Global shell geometry

Normalized Photoshop application crop:

```text
1280 × 994
```

Top shell:

| Surface | Range | Size | Class |
| --- | --- | ---: | --- |
| Application/menu row | y 0..24 | 24 px | LOCKED_FIXED |
| divider | y 24..25 | 1 px | LOCKED_FIXED |
| Options row | y 25..60 | 35 px | LOCKED_FIXED |
| divider | y 60..61 | 1 px | LOCKED_FIXED |
| workstation begins | y 61 | — | ALIGNMENT_RELATION |

```text
TOP_CHROME = 24 + 1 + 35 + 1 = 61 px
```

### 4.1 Left Tools reference states

Double column:
- visible Tools width ≈72 px
- divider = 1 px
- workspace begins x=73

Single/collapsed:
- visible Tools width ≈39 px
- divider = 1 px
- workspace begins x=40

Local structure:
- collapse/handle strip ≈11 px
- local divider = 1 px
- selected tool fill ≈31×24 px
- repeated row pitch ≈26 px
- double-column horizontal origin shift ≈33 px

### 4.2 Right dock/panel reference states

Collapsed dock:
- width ≈39 px
- edge attached
- 11 px collapse/handle strip + 1 px local divider

Expanded stack:
- captured width ≈252 px / ELASTIC
- 1 px canvas/panel boundary
- panel group A ≈269 px
- splitter ≈3 px
- panel group B ≈261 px
- splitter ≈3 px
- panel group C ≈384 px
- panel tab/header band ≈28 px

Captured group widths/heights are not fixed product locks. Edge attachment, splitter grammar and stack continuity are the durable relations.

## 5. Active document / workspace

Document tab band:
- height = 28 px
- tab/workspace divider = 1 px
- captured active-tab width ≈233 px / content dependent

Rulers:
- top ruler = 17 px
- left ruler = 17 px
- origin corner = 17×17 px

Document status:
- content band = 16 px
- bottom boundary = 1 px
- zoom region ≈48 px reference
- document-info region ≈184 px reference

State rule:
```text
NO ACTIVE DOCUMENT
→ no document tab
→ no rulers
→ no document status strip

ACTIVE DOCUMENT
→ document tab eligible
→ rulers according to View state
→ document status eligible
```

High-zoom document scrollbar thickness:
- ≈16 px reference

## 6. Application menu

Measured/observed:
- menu row = 24 px
- visible top-menu glyph envelope ≈11–13 px high
- visible whitespace between adjacent top-menu labels ≈12–13 px
- application popup border = 1 px
- popup separator = 1 px
- separator inset ≈2 px each side
- repeated menu text pitch ≈19–20 px / OBSERVED_DENSITY
- captured Edit-menu outer width ≈219 px / content dependent

Still not a universal fixed value:
- true menu item hitbox height
- exact font-size declaration
- exact horizontal item padding
- shortcut/check/submenu column widths
- exact radius/shadow

Structural rule:
```text
COMMAND GROUPS
→ separated by sparse 1 px separators
→ labels and shortcut columns align
→ no card treatment
```

## 7. Options Bar

Measured:
- row = 35 px
- common bordered control outer height ≈21 px
- selected segmented-control fill ≈24×25 px / OBSERVED_DENSITY

Visual grammar:
- contextual controls form compact horizontal groups;
- separators are sparse;
- group rhythm is created by whitespace before extra boxes/lines;
- disabled states remain legible but lower contrast.

Exact numeric values still reference-dependent for:
- group gaps
- label/control gap
- numeric-field minimum width
- dropdown arrow box
- field radius/focus border

## 8. Tools micro-geometry

Measured/observed:
- selected fill = 31×24 px
- row pitch ≈26 px
- common visible tool-icon envelope clusters around ≈20×16 px
- practical observed range ≈16–22 px wide × 11–18 px high
- flyout marker = 3×3 px visible
- collapse glyph = 7×5 px visible
- foreground/background swatches are **layout-state dependent** in Photoshop; single-column and double-column Tools do not use the same visible swatch size.
- the previous 18×18 px entry has no recoverable single-layout source crop in the available canonical assets; it must not be presented as a verified single-column measurement.
- single-column and double-column swatch size/overlap must be recorded as separate measurements.
- shared authority is the color-cluster grammar (foreground/background diagonal overlap + reset/swap utilities), not one universal swatch dimension.

2026-10-02 source-raster remeasurement (all three canonical Photoshop captures show dual Tools):

| State | Foreground / background visible outer size | Diagonal origin offset | Shared overlap | Evidence |
| --- | --- | --- | --- | --- |
| Dual | 25×25 px each | 16×16 px | 9×9 px | ps-1 foreground x17–41/y383–407; background x33–57/y399–423, inclusive pixel bounds; PS-2/PS-3 confirm same geometry |
| Single | REFERENCE_MISSING | REFERENCE_MISSING | REFERENCE_MISSING | No original single-column capture recovered; existing INK 18×18 / offset10 / overlap8 retained provisionally |

Origin offset and overlap are different measurements: shared overlap = swatch size − diagonal origin offset on each axis. Do not label the 16px dual origin offset as a 16px shared overlap. Implement layout variants through shared state tokens. The provisional single values are implementation evidence only; SUP-04 cannot be fully closed until a valid single-layout reference is measured.

Window-control source-raster visible envelopes in ps-1 (threshold≥145 on the dark reference): minimize x1183–1192/y11–13 = 10×3 px; restore x1210–1221/y5–14 = 12×10 px; close x1248–1257/y5–12 = 10×8 px. These are visible raster bounds, not button hitbox or SVG viewport measurements.

Window-control cluster placement rule:
- cluster placement is an `ALIGNMENT_RELATION`, not a free visual choice;
- next implementation/review must record the Photoshop cluster outer bounds and right-edge relation from the canonical raster before accepting a horizontal move;
- INK placement is compared as one cluster; per-button offsets do not substitute for cluster alignment;
- until that measurement is recorded, a DEV-chosen horizontal inset must remain provisional and cannot close fidelity.

- Quick Mask visible envelope ≈17×13 px
- Screen Mode visible envelope ≈17×13 px
- flyout outer reference ≈172×100 px for 5 rows
- flyout row pitch ≈20 px
- tooltip body reference ≈152×53 px for captured state

Important:
- icon visual envelope and pointer hitbox are separate measurements;
- optical center may differ from geometric center;
- icons share one stroke grammar rather than equal raster bounding boxes.

## 9. Right-panel micro-geometry

Panel header/tab:
- band = 28 px
- visible tab glyph height ≈11 px
- inactive two-character label side whitespace ≈9–10 px each side
- panel-menu visible glyph ≈10×7 px
- panel-menu glyph right inset ≈6 px

Panel stack:
- splitter ≈3 px
- structural divider is visually stronger than ordinary internal row separators
- panel footer captured in Layers ≈24 px + 1 px bottom boundary

Panel body:
- compact content
- low frame count
- grouping primarily by alignment, spacing, and text hierarchy
- repeated card boxes are not a Photoshop panel grammar

## 10. Layers

Measured/observed:
- layer row pitch ≈35 px
- drag insertion line = 1 px-class horizontal target
- drag ghost occupies the row class rather than becoming a large card
- selected row remains within normal row rhythm
- footer ≈24 px content + 1 px boundary

Required structural fields:
- visibility box
- thumbnail
- layer label
- lock/state indication
- hierarchy indent
- selected/hover/locked states
- drag target
- footer action bar
- panel scrollbar

The reference does not justify adding unsupported Photoshop-only semantics.

## 11. History

Measured:
- repeated row pitch ≈23 px
- same 28 px panel-header grammar

Required visual semantics:
- older/newer order
- current state distinct
- future states distinct after revert
- compact list rhythm

History is not Revision.

## 12. Navigator

Measured reference:
- header = 28 px
- body ≈208 px / reference state
- footer ≈33 px / reference state
- panel splitter below ≈3 px

Required grammar:
- thumbnail/preview
- viewport proxy
- compact zoom/footer row
- proxy drag
- ordinary document view authority; no second camera state

## 13. Popups / contextual surfaces

Panel options popup:
- captured outer ≈118×319 px
- border = 1 px
- separator = 1 px
- separator inset ≈2 px
- compact rows ≈19–20 px visual pitch

Status-information popup:
- captured outer ≈114×234 px
- border = 1 px

Tool flyout:
- ≈172×100 px in captured five-row state
- ≈20 px row pitch

Principle:
- popup geometry is content-dependent;
- shared menu grammar, not independent one-off styling.

## 14. Typography hierarchy

Photoshop does not rely on many large font sizes.

Measured visible envelopes:
- top menu ≈11–13 px high
- Options/control text ≈12–13 px-class visible envelope
- panel tabs ≈11 px visible glyph height
- ordinary panel/dialog text generally ≈11–12 px-class visible envelope

Durable lesson:
```text
HIERARCHY IS CREATED PRIMARILY BY
placement + spacing + contrast + state
NOT by proliferating large headings and bold card titles
```

Exact CSS font declarations remain environment-dependent. The target product should use a small semantic role set rather than per-component font sizes.

## 15. Gray / surface hierarchy

Dark-theme captured roles are useful for hierarchy only:

- application/panel base ≈ #535353
- canvas ≈ #262626
- major boundary ≈ #383838
- local header/strip ≈ #424242
- boundary highlight / splitter center ≈ #474747
- selected surface ≈ #6B6B6B-class

For INK light theme:
- do not copy these RGBs;
- reproduce the number of hierarchy levels and their relative contrast;
- use the fewest semantic gray roles needed.

## 16. Divider hierarchy

Reference-derived structural hierarchy:

```text
LEVEL 1 — ordinary divider
1 px
low visual weight

LEVEL 2 — major region boundary
1 px
clearer contrast than internal divider

LEVEL 3 — panel-group splitter
Photoshop capture occupies ≈3 px structural raster/envelope.
For INK light-theme application, do not copy that envelope as a 3 px solid visible band:
- visible junction line = 1 px;
- junction contrast may be slightly stronger than an ordinary divider;
- draggable interaction envelope may extend to ≈5 px transparently around the line.
Visual thickness and pointer hit area are separate measurements.
```

Do not use borders around every row/control to create hierarchy.

## 17. Control geometry

Reference control families:

### Compact Options controls
- outer height ≈21 px

### Compact panel controls
- roughly 19–22 px-class depending on control/state

### Dialog / Preferences controls
- input/select around ≈23 px-class
- captured dialog action button around ≈92×26 px

### Tool cells
- active visual fill 31×24 px
- row pitch ≈26 px

Controls of different semantic classes need not share one height; controls of the same class must.

## 18. Spacing rhythm

Measured/derived useful instances:
- compact 2 px popup separator inset
- panel body side inset ≈6 px-class in reference
- tab label side whitespace ≈9–10 px
- Preferences group inset ≈10 px-class
- ordinary control grouping ≈10 px-class
- larger section separation ≈16–17 px-class

Recommended reusable rhythm derived from the reference:
```text
2 / 4 / 6 / 8 / 10 / 16 px
```

This is a grammar, not permission to apply every token everywhere.

## 19. Scrollbar grammar

Reference:
- document scrollbar thickness ≈16 px
- square/rectilinear workstation treatment
- scrollbar belongs to region/content geometry

INK adaptation target:
- no pill/capsule scrollbar;
- rectangular track/thumb language;
- hover/drag may use contrast change rather than rounded shape.

## 20. Slider grammar

Reference-derived target:
- thin horizontal track
- circular thumb/control point
- no extra container box unless the control itself requires a field boundary
- value and label align to the shared control baseline

## 21. Window / collapse / menu glyphs

Reference characteristics:
- window controls use crisp, optically centered glyphs;
- collapse controls sit in a dedicated narrow strip;
- Photoshop captured collapse/expand glyph is a compact **double chevron** (`<<` / `>>` morphology), measured visible envelope ≈7×5 px; it must be rendered as controlled vector geometry rather than a text character;
- Photoshop captured panel-menu glyph is **three horizontal lines**, measured visible envelope ≈10×7 px;
- side-region collapse strip is separated from content by a clear boundary.

Do not use arbitrary Unicode glyph weight as a replacement for a controlled icon.

## 22. Interaction states represented by the dataset

Covered:
- empty workspace
- active document
- rulers off/on
- application menu open
- panel menu open
- tooltip
- tool flyout
- guide drag + live coordinate readout
- high-zoom scrollbars
- Navigator proxy
- Layers selected
- Layers drag reorder
- status popup

Behavior-authority-supported:
- panel resize
- Navigator proxy drag
- ruler-origin semantics
- Smart Guide/equal-spacing behavior

Target-product review must still verify its own rendered states independently.

## 23. Reference-missing / intentionally unresolved

Still not claimed as universal Photoshop pixel constants:
- exact CSS font-size/line-height declarations
- true pointer hitboxes not visible in static captures
- exact focus-ring metrics
- exact light-theme Photoshop RGB tokens
- exact OS-dependent window-control raster
- exact popup shadows/radii where not measurable
- environment scaling metadata listed in §2

These are not permission for arbitrary styling. They must be resolved through the INK Micro-Module Grammar and current USER direction.

## 24. Dataset usage rule

Normal implementation order:

```text
Photoshop Dataset
→ INK Micro-Module Grammar
→ current DEV dispatch
→ rendered INK verification
```

Do not read old measurement documents to override this dataset.

## 25. Consolidation statement

This file consolidates the applicable measurement content formerly split across:
- shell/reference measurement;
- active-document measurement;
- interaction-detail measurement;
- fine-detail field inventory;
- reference-capture plan.

Git history remains the provenance source. Legacy split files are superseded after migration audit.

