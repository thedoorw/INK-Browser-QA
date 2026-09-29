# INK UI Assembly Completion Work Order v1.0

STATUS: `ACTIVE / USER_AUTHORIZED / DIRECT_IMPLEMENTATION`

TASK: `INK-UI-ASSEMBLY-COMPLETION-001`

DATE: 2026-09-29

ROLE: `DIRECT MR / UI IMPLEMENTATION EXECUTOR`

## 1. Mission

This is not a review task and not another UI planning round.

The mission is to assemble the already-installed INK capability base into the complete visible and operable workstation UI.

```text
501 installed capabilities
→ existing 74 PUI placement plan
→ complete workstation UI
→ USER inspection
```

The current problem is not lack of Core capability. The current problem is incomplete UI assembly.

## 2. Read first

Mandatory:

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_UI_DIRECT_MR_NEW_WINDOW_HANDOFF_v1.0.md`
- `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`
- `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
- `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`
- `working/INK_UI_RECONCILIATION_GAP_REGISTER_v1.0.md`

Primary visual authority:

- `ps-1.png`
- `ps-2.png`

Current source:

- `product/source/index.html`
- `product/source/index-standalone.html`
- `product/source/styles.css`
- current UI-facing JS
- current Core / P1 / CHAT wiring

Always read current `main` first. Do not work from stale branches or old chat assumptions.

## 3. Protected capability baseline

Authoritative baseline:

```text
CANONICAL_CAPABILITY_FAMILIES = 64
PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
TOTAL_NORMALIZED_ATOMICS = 501

PUI_PLANNING_IDENTITIES = 74

CHAT_NAMED_TOOLS = 22
CHAT_BOUNDED_EDIT_OPERATIONS = 34

FORMAT_VERSION = 4
```

No installed capability may be deleted, disconnected or silently downgraded merely to simplify UI.

This includes:

- all original INK capabilities;
- recovered P0 capabilities that were previously at risk of omission;
- Creative Loop;
- Reference / Extract / Path / Edit / Compose / Repaint;
- History / Revision / Provenance;
- Geometry / Boolean / Repeat / Parametric;
- CHAT / Public Creative API / `use_ink`;
- Creative Memory / Research → Creation;
- P1-A through P1-H;
- Raster Selection;
- Retouch;
- Advanced Transform;
- Text / Layout;
- Layer Effects;
- Adjustment;
- Filter / Filter Gallery;
- Liquify;
- Color / Bit Depth / ICC / Channels;
- PSD / PSB / TIFF / RAW / EXR interoperability;
- Diagnostics / PWA / Asset lifecycle platform support.

## 4. Assembly objective

The implementation target is:

```text
501 capability base
→ 74 PUI placement
→ complete workstation UI
→ every capability that should be human-visible/operable has a real route
```

Do not build only a shell.

Do not leave placeholders.

Do not strand normal creative capability inside Specialist when the placement plan says it belongs in normal UI.

## 5. Top Menu assembly

Top taxonomy remains:

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

Each must be populated and wired to real existing capability routes.

### File

At minimum:

```text
New
Open
Open / Import external formats
Import Reference
Import SVG
Save
Export
Print
```

Show only external format operations supported by current adapters/capability contracts.

### Edit

At minimum:

```text
Undo
Redo
Duplicate
Delete
Preferences / Settings
```

Existing Branding Settings must remain.

### Image

At minimum:

```text
Mode
  8-bit
  16-bit
  32-bit
  RGB
  CMYK
  Lab
  Multichannel

Color Profile
Adjustments
Crop
Resize
Document / Artboard Settings
```

### Layer

At minimum:

```text
New Layer
Duplicate Layer
Delete Layer
Group / Ungroup
Mask
Layer Effects
Arrange
```

Layers panel remains the primary hierarchy home.

### Type

At minimum:

```text
Horizontal / Paragraph Type
Vertical Type
Text on Path
```

### Select

At minimum:

```text
Select All
selection mode routes
Select from Alpha
Select from Path
Modify / Refine
Select and Mask
```

Interactive selection families must be represented:

- Lasso
- Polygonal Lasso
- Magnetic Lasso
- Quick Selection
- Magic Wand
- Object Selection

### Filter

The current disabled placeholder must be removed.

Build a real working Filter menu using the current supported operations, including at minimum:

```text
Blur
Sharpen
High Pass / Edge
Noise / Grain
Texture
Motion Blur
Median
Unsharp Mask
Emboss
Mosaic / Pixelate
Minimum
Maximum
Reduce Noise
Filter Gallery
Liquify
```

No development placeholder such as `命令控制由 UI-B 配線` may remain.

### Object

At minimum:

```text
Transform
  Skew
  Distort
  Perspective
  Warp

Arrange
Align / Distribute
Path / Stroke
Boolean
Repeat
Frame / Layout
Component
```

### View

At minimum:

```text
Zoom / Fit / Reset
Rotate / Reset Rotation
Fullscreen
Rulers
Guides
Grid
Snap
Snap To
  Guides
  Object Edges
  Object Centers
  Grid
  Angles
  Equal Distance
Workspace
```

### Window

Window must route to the same shared panel-state authority for:

```text
Properties
Layers
History
Navigator
Pages
Color
Channels
Adjustments
Libraries
Reference
Compose
CHAT
Revision
Specialist
```

Do not create duplicate panel authorities.

### Help

At minimum:

```text
Keyboard Shortcuts
Capability / About
Updates
Storage / Offline Health
Product Diagnostics
Pen / Device Diagnostics
Release / External Diagnostic Bundle
```

## 6. Left Toolbar assembly

Organize by workflow families.

### Draw flyout

```text
Pen
Pencil
Marker
Brush
Airbrush
Blender
Smudge
```

Eraser may remain a direct high-frequency slot.

### Selection

```text
Select

Lasso flyout
  Lasso
  Polygonal Lasso
  Magnetic Lasso

Smart Selection flyout
  Quick Selection
  Magic Wand
  Object Selection
```

### Fill / Sampling

```text
Gradient
Paint Bucket

Eyedropper
Color Sampler
Measure
```

Use compact flyouts where appropriate.

### Raster Retouch

Expose the existing professional retouch capabilities through compact flyouts:

```text
Clone Stamp
Pattern Stamp
Healing
Spot Healing
Patch
Dodge
Burn
Sponge
Blur
Sharpen
Color Replacement Brush
```

Do not create one permanent toolbar slot for every algorithm.

### Structure

```text
Shape
Text
Image
Pan
```

## 7. Contextual Options Bar

It must respond to active tool/selection rather than remain decorative.

At minimum:

### Draw
- preset
- color
- size
- opacity
- common dynamics

### Selection
- new/add/subtract/intersect
- tolerance
- contiguous
- smart-selection options

### Fill
- color
- gradient
- opacity
- tolerance

### Retouch
- size
- strength
- source/pattern state

### Text
- font
- size
- direction
- commit/cancel

### Transform
- active mode
- numeric controls
- apply/cancel

### Path / Stroke
- node mode
- add/delete/split
- apply/cancel

Deep controls belong in Properties/dialogs.

## 8. Right Dock / Panels

Build a mature shared dock/panel system with:

```text
Properties
Layers
History
Navigator
Pages

Color
Channels
Adjustments

Libraries
Reference
Compose
CHAT
Revision

Specialist
```

Do not keep normal product capabilities trapped inside one oversized Inspector/Specialist panel.

## 9. Properties

Properties must be target-aware.

Supported contextual sections include:

```text
Document / Artboard
Transform
Appearance
Text
Mask
Brush
Brush Dynamics
Media / Paper
Layout
Layout Item
Component
Image / Raster State
Color State
Repeat
```

Do not expose Renderer/GPU internals as normal creative properties.

## 10. Layers

Layers must own the normal layer workflow:

- hierarchy;
- active layer;
- add;
- duplicate;
- delete;
- drag reorder;
- visibility;
- lock;
- opacity;
- blend mode;
- masks;
- Layer Effects `fx`;
- adjustment/filter stack readout;
- contextual reorder.

Reuse the existing Layer authority.

## 11. Move professional raster capabilities out of Specialist

Current Specialist content includes normal creative capability that belongs elsewhere.

Final placement:

```text
Mask
→ Layers / Properties / Layer menu

Adjustments
→ Adjustments panel + Image > Adjustments

Filters
→ Filter menu + contextual dialogs

Layer Effects
→ Layer menu / Layers fx / Properties

Channels
→ Channels panel
```

Specialist must not remain the primary home for these.

## 12. Dialog / Workspace assembly

Build real entry and wiring for existing capability-backed dialogs/workspaces:

```text
Select and Mask
Layer Effects
Filter dialogs
Filter Gallery
Liquify
Gradient editor
Color Profile
Export
Recovery
Pen Calibration
```

Do not create fake dialogs or duplicate algorithms.

## 13. Creative / CHAT panels

Preserve and properly assemble:

```text
Libraries
Reference
Compose
CHAT
Revision
```

### Libraries
- search
- filter
- inspect
- native reuse of component/material/structure

### Reference
- import
- decomposition
- extract/vectorize

### Compose
- Recipe
- Repeat / Parametric
- advanced structure

### CHAT
- capability discovery
- grounded context
- inspect
- proposal
- approval
- execution
- preview
- `use_ink`

### Revision
- capture
- list
- inspect
- restore
- compare
- provenance

Preserve existing CHAT authority.

## 14. Specialist final scope

Specialist should retain genuinely advanced/engineering workflows such as:

- Program Import;
- Recipe engineering / QA;
- Stroke Session advanced workflow;
- Device validation;
- detailed calibration;
- benchmark / artwork QA;
- layer manifest;
- renderer/GPU diagnostics;
- storage/offline/release diagnostics;
- repair tools.

Normal creative capabilities must not remain there merely because they were previously convenient to expose there.

## 15. Headless boundaries

Do not invent normal UI controls for:

- asset lifecycle internals;
- renderer internals;
- GPU tile/cache internals;
- recompute internals;
- semantic grounding internals;
- output-handle lifecycle;
- automatic stylus signals;
- service-worker lifecycle.

Where useful, expose status only through Help/Diagnostics.

## 16. Visual authority

`ps-1.png` and `ps-2.png` are the primary visual authority.

The rejected generic light/white result is not the target.

Align the workstation in:

- shell hierarchy;
- visual density;
- top menu density;
- toolbar grammar;
- contextual options bar;
- right dock;
- panel tabs;
- panel stacking;
- dark workspace;
- chrome contrast;
- typography;
- control sizing;
- spacing rhythm;
- hover/active/selected state;
- borders/dividers;
- compact professional workstation character.

Do not copy Adobe branding. Reconstruct the mature workstation grammar.

## 17. Branding regression protection

Preserve the repair from:

`05de1c68fbcf06d86fa40321cb0dbd88657179e6`

Required:

```text
Web Runtime = src/ink.js
Portable Runtime = dist/ink.compat.js
Branding Settings = retained
```

No unresolved template token may remain:

```text
{{RUNTIME_SCRIPT}}
{{DELIVERY}}
{{MANIFEST}}
{{WEB_BADGE}}
```

Branding capability must remain:

- Application Name
- Application Title
- Logo
- Favicon
- live preview
- persistence
- Reset
- promote default

## 18. Core authority protection

Do not create or replace a second:

- Document
- History
- Revision
- Renderer
- Geometry
- Selection
- Transform
- Layer
- Component
- Repeat
- Material
- Recipe
- CHAT mutation
- persistence authority

UI must route to existing authorities.

## 19. Execution policy

For this task:

```text
UR = NOT USED
DEV ROLE SPLIT = NOT USED
MR PRE-APPROVAL = NOT USED
RUNTIME GATE = NOT USED DURING UI ITERATION
```

You are the implementation executor.

Use current main directly.

```text
read current main
→ implement
→ bounded reversible commit(s) to main
→ continue until the UI assembly is complete enough for USER inspection
```

Do not stop after every small subsection.

Stop only if:

1. FORMAT_VERSION must change;
2. saved-document compatibility must be broken;
3. an existing Core authority must be replaced;
4. USER intent is genuinely ambiguous and cannot be safely inferred.

## 20. Engineering completion conditions

This implementation pass is complete only when at minimum:

```text
501 capabilities = preserved
74 PUI placement = respected as the assembly baseline

Top menus = assembled
Filter placeholder = 0
Normal creative capability stranded in Specialist = 0 where placement says normal UI

Left Toolbar = assembled
Contextual Options = functional
Right Dock = assembled
Panels = assembled
Dialogs/workspaces = assembled

P1 A-H normal UI homes = present
CHAT / Reference / Compose / Revision = present

Web Runtime = present
Portable Runtime = present
Branding = preserved

Core authority duplication = 0
FORMAT_VERSION = 4
```

Perform source-level sanity checks for:

- unresolved template tokens = 0;
- dead development placeholders = 0;
- capability wiring accidentally removed = 0;
- desktop primary UI routes operable;
- menu → panel/dialog/command wiring connected.

## 21. Report format

Do not return a long review.

Return only:

```text
UI ASSEMBLY IMPLEMENTED

main HEAD = <sha>

主要完成：
- menus
- toolbar
- contextual options
- panels
- dialogs/workspaces
- capability routing

保留：
- 501 capability baseline
- 22 CHAT named tools
- 34 bounded edit operations
- Branding
- Format Version 4

USER ACTION:
重新整理目前 INK 頁面查看
```

Do not declare `UI_COMPLETE`.

Only USER may decide final UI completion.

## 22. Final intent

This task exists to do one thing:

**assemble the already-installed INK capability base into the complete visible and operable INK workstation UI.**
