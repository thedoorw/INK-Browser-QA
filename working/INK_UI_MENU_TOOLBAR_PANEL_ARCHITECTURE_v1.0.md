# INK UI Menu / Toolbar / Panel Architecture v1.0

STATUS: `UR_COMPLETE / MR_REVIEW_REQUIRED / UI_HOLD`

TASK: `INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

DATE: 2026-09-28

REFERENCE PRINCIPLE:
- Photoshop Light theme is a mature workstation reference, not a 1:1 replication target.
- INK keeps its own creation/layout/CHAT/Compose/Reference model.
- high-frequency direct actions stay close to canvas;
- complex low-frequency operations move to menus, dialogs or Specialist;
- one capability has one primary home;
- responsive duplicates share the same state/authority;
- Runtime, asset lifecycle and engineering diagnostics do not become normal creative chrome.

PRODUCT / UI SOURCE MUTATION: `0`

## 1. Final workstation zoning

```text
┌─────────────────────────────────────────────────────────────────┐
│ Top Menu                                                        │
├─────────────────────────────────────────────────────────────────┤
│ Contextual Options Bar                                          │
├───────┬──────────────────────────────────────────────┬──────────┤
│ Left  │                                              │ Right    │
│ Tools │             Canvas / Workspace               │ Dock     │
│       │                                              │ Panels   │
├───────┴──────────────────────────────────────────────┴──────────┤
│ Status / zoom / document state / bounded diagnostics shortcut   │
└─────────────────────────────────────────────────────────────────┘
```

Specialist workspaces/dialogs overlay or temporarily replace the canvas work area only when invoked.

## 2. Top Menu architecture

Final normal menu taxonomy:

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

### File

Purpose:
document lifecycle, import/export, print.

Structure:

```text
File
├─ New
├─ Open
├─ Open / Import External Image
│  ├─ PSD
│  ├─ PSB
│  ├─ TIFF
│  ├─ RAW
│  └─ EXR
├─ Import
│  ├─ Reference
│  └─ SVG
├─ Save
├─ Export…
└─ Print
```

Format entries must reflect actual codec/adapter availability. Unsupported writer paths are not shown as operational.

### Edit

```text
Edit
├─ Undo
├─ Redo
├─ Duplicate
├─ Delete
└─ Preferences / Settings
```

History remains the single state authority. Permanent desktop Undo/Redo topbar buttons remain unnecessary once Edit/History/shortcuts are complete.

### Image

```text
Image
├─ Mode
│  ├─ 8-bit
│  ├─ 16-bit
│  ├─ 32-bit
│  ├─ RGB
│  ├─ CMYK
│  ├─ Lab
│  └─ Multichannel
├─ Color Profile…
├─ Adjustments >
├─ Crop
├─ Resize
└─ Document / Artboard Settings…
```

The exact Crop/Resize command labels must bind existing C22 authority; this document does not invent additional image operations.

### Layer

```text
Layer
├─ New Layer
├─ Duplicate Layer
├─ Delete Layer
├─ Group / Ungroup
├─ Mask >
├─ Layer Effects…
├─ Arrange >
└─ hierarchy/context routes as applicable
```

Layers panel is still primary for hierarchy/reorder/visibility/lock/opacity.

### Type

```text
Type
├─ Horizontal / Paragraph Type
├─ Vertical Type
├─ Text on Path
└─ text contextual commands
```

Text creation remains tool-primary.

### Select

```text
Select
├─ selection tool routes
├─ Select All
├─ Select from Alpha
├─ Select from Path
├─ Modify / refine routes
└─ Select and Mask…
```

Selection algorithms remain tool-primary where interactive.

### Filter

New normal top-level menu, justified by C25 + promoted P1-F.

```text
Filter
├─ Blur >
├─ Sharpen >
├─ Edge / High Pass >
├─ Noise / Grain >
├─ Texture >
├─ Motion Blur
├─ Median
├─ Unsharp Mask
├─ Emboss
├─ Mosaic / Pixelate
├─ Minimum
├─ Maximum
├─ Reduce Noise
├─ Filter Gallery…
└─ Liquify…
```

Only supported algorithms are listed. Grouping may be simplified during visual design without changing capability coverage.

### Object

```text
Object
├─ Transform >
│  ├─ Skew
│  ├─ Distort
│  ├─ Perspective
│  └─ Warp
├─ Arrange >
├─ Align / Distribute >
├─ Path / Stroke >
├─ Boolean >
├─ Repeat >
├─ Frame / Layout >
└─ Component >
```

### View

```text
View
├─ Zoom / Fit / Reset
├─ Rotate / Reset Rotation
├─ Fullscreen
├─ Rulers
├─ Guides >
├─ Grid
├─ Snap
├─ Snap To >
│  ├─ Guides
│  ├─ Object Edges
│  ├─ Object Centers
│  ├─ Grid
│  ├─ Angles
│  └─ Equal Distance
└─ Workspace >
```

Temporary snap bypass is interaction-state, not a persistent menu toggle.

### Window

Mirrors panel state; no duplicate panel instances.

```text
Window
├─ Properties
├─ Layers
├─ History
├─ Navigator
├─ Pages
├─ Color
├─ Channels
├─ Adjustments
├─ Libraries
├─ Reference
├─ Compose
├─ CHAT
├─ Revision
└─ Specialist
```

### Help

```text
Help
├─ Keyboard Shortcuts
├─ Capability / About
├─ Updates
├─ Storage / Offline Health
├─ Product Diagnostics
├─ Pen / Device Diagnostics
└─ Release / External Diagnostic Bundle
```

## 3. Left Toolbar architecture

The toolbar is organized by workflow families, not by the raw count of Core functions.

### A. Draw
Flyout:
- Pen
- Pencil
- Marker
- Brush
- Airbrush
- Blender
- Smudge

Eraser remains a direct slot because of frequency.

### B. Selection
Three interaction groups:

1. basic Select;
2. Lasso flyout:
   - Lasso
   - Polygonal Lasso
   - Magnetic Lasso
3. Smart Selection flyout:
   - Quick Selection
   - Magic Wand
   - Object Selection

### C. Fill / Sampling
Fill flyout:
- Gradient
- Paint Bucket

Sampling flyout:
- Eyedropper
- Color Sampler
- Measure may be grouped here if visual studies show a dedicated slot is unnecessary.

### D. Raster Retouch
Compact flyouts:
- Clone Stamp / Pattern Stamp
- Healing / Spot Healing / Patch
- Dodge / Burn / Sponge
- Blur / Sharpen
- Color Replacement Brush as shared Brush/Retouch flyout member

This avoids eleven additional persistent slots.

### E. Structure
- Shape
- Text
- Image
- Pan

Shape uses its own flyout for current primitives.

## 4. Tool Flyout rules

1. Flyout member selection changes the slot icon to the last-used member where practical.
2. Flyouts group tools sharing a motor pattern and contextual parameter model.
3. A flyout is not a second authority; it changes the active mode routed to existing Core.
4. Mobile uses the same groups through responsive sheets/pickers.
5. Low-frequency one-shot algorithms are menus/dialogs, not toolbar flyouts.
6. Tool groups must be keyboard-accessible and visibly discoverable.

## 5. Contextual Options Bar architecture

The Options Bar is shallow and fast.

### Selection
- selection mode: new/add/subtract/intersect;
- tolerance/contiguous for Magic Wand;
- brush/sample settings for Quick Selection;
- ROI mode for Object Selection;
- bounded Magnetic Lasso settings.

### Fill / Sampling
- foreground/current color;
- gradient preview/type/opacity;
- Paint Bucket tolerance/contiguous;
- sample radius/mode.

### Retouch
- brush size;
- opacity/strength;
- source/pattern state;
- only tool-specific high-frequency fields.

### Draw
- preset;
- color;
- size;
- opacity;
- small set of active dynamics.

### Text
- font;
- size;
- immediate alignment/writing direction;
- commit/cancel.

### Transform
- active mode;
- numeric high-frequency fields;
- apply/cancel for advanced transform modes.

### Path/Stroke
- node mode;
- immediate add/delete/split;
- apply/cancel edit state.

Deep state always moves to Properties/dialogs.

## 6. Right-side Panels architecture

### Editor group

#### Properties
Context-sensitive sections:
- Document / Artboard
- Transform
- Appearance
- Text
- Mask
- Brush
- Brush Dynamics
- Media / Paper
- Layout
- Layout Item
- Component
- Image / Raster State
- Color State

Properties is not a dumping ground: only the active selection/document/tool sections are expanded.

#### Layers
Owns:
- hierarchy;
- active layer;
- add/duplicate/delete;
- drag reorder;
- visibility;
- lock;
- opacity;
- blend mode;
- mask entry/state;
- Layer Effects `fx` entry;
- adjustment/filter stack readout and contextual reorder.

#### History
Owns:
- step list;
- jump;
- configurable retention;
- one History authority shared with Edit/keyboard.

#### Navigator
Owns:
- thumbnail;
- viewport proxy;
- drag proxy pan;
- click reposition;
- zoom percentage;
- minus/slider/plus.

#### Pages
Owns:
- add;
- duplicate;
- delete;
- switch;
- rename.

### Color group

#### Color
Normal creative color selection/sampling only.
Does not replace ICC/color-management Core.

#### Channels
Owns:
- process channels;
- alpha channels;
- spot channels;
- Multichannel channels;
- supported add/remove/rename/reorder;
- preview visibility;
- selected channel properties where supported.

### Raster-processing group

#### Adjustments
Owns creation and list-oriented access for the supported adjustment stack.

It does not duplicate Layers: if stack ownership is per image/layer, selection synchronization points to the same existing stack authority.

No permanent Filters panel.

### Creative group

#### Libraries
Search/filter/inspect and native reuse.

#### Reference
Import/decompose/extract/vectorize.

#### Compose
Recipe/structure/creative advanced configuration.

#### CHAT
Governed proposal/approval/execute flow.

#### Revision
Capture/list/inspect/restore/compare/provenance.

### Advanced group

#### Specialist
Contains:
- Program Import;
- external reference evidence;
- Recipe engineering/QA;
- Stroke Session;
- stylus/device validation;
- calibration details;
- benchmark/artwork QA;
- layer manifest diagnostics;
- renderer/GPU diagnostics;
- storage/offline/release/update diagnostics;
- component reference repair.

Specialist is dockable/launchable but not intended as constant normal-creative attention.

## 7. Properties architecture

Properties uses target-aware sections rather than permanent feature panels.

Examples of target ownership:

| Target | Properties sections |
|---|---|
| Document | Artboard, Media, Color State |
| Vector object | Transform, Appearance, Layout Item, Component |
| Text | Transform, Text, Appearance |
| Raster image/layer | Transform, Appearance, Mask, Adjustment/Filter stack details, Raster/Color State |
| Brush tool/stroke | Brush, Dynamics, Media, Stroke |
| Repeat object | Transform, Repeat |
| Frame | Transform, Layout |
| Component instance | Transform, Appearance, Component |
| Guide/ruler selection where applicable | position/lock/visibility only if direct interaction needs numeric edit |

Properties must not expose renderer/GPU internals.

## 8. Dialog / Modal architecture

### Select and Mask
Use when selection refinement needs visual comparison and multiple coupled parameters.

### Layer Effects
One effect editor for:
- Drop Shadow
- Inner Shadow
- Outer Glow
- Color Overlay
- Stroke

### Filter dialogs
Each menu command opens a bounded parameter dialog when parameters are non-trivial.

### Filter Gallery
One chooser/editor for supported Gallery descriptors.

### Liquify workspace
Temporary focused creative workspace:
- canvas dominant;
- compact left tool strip or internal tool group;
- Options/Properties for strength/radius;
- Forward Warp/Twirl/Pucker/Bloat/Reconstruct;
- freeze/protect mask;
- Apply/Cancel.

No permanent dock occupation.

### Gradient editor
One visible editor dispatching to raster or vector gradient authority based on active target.

### Color Profile dialog
Profile inspection and only supported operations.

### Export dialog
Format availability and bounded capability/loss status are explicit.

### Recovery modal
Only appears when recovery state exists.

## 9. Ruler / Guide / Snap interaction architecture

This is part of the normal canvas workstation.

Required geometry:

```text
top ruler
left ruler
ruler origin
guide drag lanes
canvas snap feedback
distance/equal-spacing feedback
```

State ownership:
- guide persistence → existing page/document authority;
- guide mutations → existing History path;
- snap global/categories → existing page.snap;
- direct manipulation → existing Transform authority;
- feedback → integrated snap evidence.

UI must not add a parallel guide/snap state machine.

## 10. P1-G color architecture

Three distinct surfaces, one Core:

1. Color panel — choosing/sampling ordinary creative colors.
2. Channels panel — channel structure and per-channel workflow.
3. Image > Mode / Color Profile — document/image color/bit-depth/profile operations.

Do not merge all three into one panel.

Unsupported color transforms must remain explicit and must never be hidden behind automatic conversion.

## 11. P1-H format architecture

External formats are adapters, not document modes.

```text
File Open/Import
→ format adapter
→ normalized payload
→ existing INK image/document authority

INK image/document authority
→ Export dialog
→ supported encoder/adapter
→ external bytes
```

UI rules:
- show codec/adapter availability;
- disclose bounded losses/warnings;
- preserve explicit unsupported states;
- no Camera RAW editor is introduced;
- no external-format-specific document panel is introduced.

## 12. Responsive architecture

Desktop and mobile/tablet share capability topology.

Responsive changes:
- toolbar groups may collapse into sheets;
- right panels may become drawers;
- Options Bar may become bottom/context sheets;
- dialogs may become full-screen;
- primary/secondary placement semantics do not change.

Responsive duplicates never create second state/authority owners.

## 13. Explicit exclusions from normal creative architecture

Do not add:
- Runtime queue/status panel;
- asset lifecycle panel;
- PWA engineering panel;
- GPU tile/cache panel;
- semantic-grounding panel;
- dependency-recompute panel;
- one control for every brush dynamic;
- one permanent toolbar slot for every retouch algorithm;
- one panel per Layer Effect;
- a second Smart Object/reusable-raster model;
- a second Adjustment/Filter/Selection/Mask authority.

## 14. Architecture closure

```text
TOP_MENU_FILTER_ADDED = YES
LEFT_TOOLBAR_GROUPING_RECONCILED = YES
CONTEXTUAL_OPTIONS_RECONCILED = YES
RIGHT_PANELS_RECONCILED = YES
PROPERTIES_RECONCILED = YES
DIALOG_MODAL_WORKSPACE_RECONCILED = YES
HEADLESS_BOUNDARY_RECONCILED = YES
P1_A_H_INCLUDED = YES
PRODUCT_MUTATION = 0
UI_IMPLEMENTATION = 0
UI_HOLD_CLEARED = NO
NEXT_OWNER = MR REVIEW
```

STOP.