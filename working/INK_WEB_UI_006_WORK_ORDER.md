# INK-WEB-UI-006 — UI System Realignment Work Order

STATUS: PHASE_A_B_UI_PASS / UI_ONLY
OWNER: INK UR
BRANCH: `work/ink-web-ui-standard-001`
BASELINE:
- `research/INK_IDEAL_UI_STANDARD_v0.1.md`
- `working/INK_UI_MODIFICATION_CHECKLIST_v0.1.md`
- user-provided Photoshop references: `ps-1.png`, `ps-2.png`
- user-provided INK brand source image: Y-mark original artwork

## Goal

Re-align INK's visible workstation UI around a mature editor grammar:
- Photoshop for workstation structure and panel/tool behavior
- Figma-like light chrome for a cleaner modern shell
- INK-specific Creative Loop kept intact

This work order is UI-only. Do not alter Core/document/history/revision authority, renderer contracts, persistence format, or FORMAT_VERSION.

---

## Phase A — Baseline lock and command map

### A1. Freeze UI command inventory
- Map all visible buttons/controls to their command/capability.
- Mark each as:
  - Primary Home
  - Contextual Shortcut
  - Keyboard Shortcut
  - Responsive Alternative
  - Specialist/Diagnostic
- Identify ambiguous duplicates.

### A2. Produce duplicate-resolution table
Must explicitly cover:
- New / Open / Save / Export
- Creation / Layout
- Color / Size / Opacity
- Duplicate / Group / Front / Delete
- Inspector open/close entry points
- Zoom / Fit / Rotation

### A3. Boundary check
Any required change to Core semantics or authoritative command behavior:
`INTEGRATION_REQUIRED → MR`

---

## Phase B — Global shell + branding

### B1. Light UI shell
Move main chrome toward a Figma-like light workstation treatment:
- top bars
- left toolbar
- right panel dock
- panel surfaces
- status bar

Keep clear visual separation between:
- chrome
- workspace
- paper/canvas

Do not flatten the whole UI into one white field.

### B2. Brand mark test — original image only
Use the user-provided Y-mark image directly, without redesign.

Test two usages:
1. top-left app mark
2. browser favicon

Rules:
- Phase 1 is direct proportional scaling from the original image.
- No simplification/redrawing in this phase.
- Preserve the original visible composition, including its source appearance.
- Judge only after runtime inspection.
- If small-size readability fails, record as a later optional Phase 2; do not silently alter the mark.

### B3. Startup visual consistency
Remove misleading dark→white startup flash.
Loading/startup must visually match the expected final workspace or show a deliberate neutral loading state.

---

## Phase C — Top area cleanup

### C1. File command consolidation
Primary home: File menu.

Move/remove permanent top buttons for:
- New
- Open
- Save
- Export

If any quick action remains visible, justify it as a secondary shortcut, not another Primary Home.

### C2. Contextual Options bar
Top options must respond to active tool/selection.

Expected categories:
- Draw → color / size / opacity / tool-specific essentials
- Selection → high-value object actions / transform
- Text → font / size / alignment
- Shape → type / fill / geometry essentials

### C3. Undo/Redo
Review against Photoshop-style density.
Primary semantic home remains Edit + shortcuts.

### C4. Top geometry
Align total top-stack density toward the supplied Photoshop reference.
Do not blindly hard-code screenshot pixels; validate proportionally in runtime.

---

## Phase D — Left Toolbar

### D1. Tool grouping
Keep core tool identity and shortcut order stable:
- Draw family
- Eraser
- Select
- Lasso
- Shape
- Text
- Image
- Pan

### D2. Draw family
Keep Pen / Pencil / Marker / Brush / Airbrush as one tool family/flyout.

### D3. Single-column / two-column mode
Implement:
- single-column default
- user-selectable two-column mode

Requirements:
- no command changes
- no shortcut changes
- stable grouping/order
- two-column mode shortens vertical footprint
- switching must not disturb canvas interaction
- control must be compact and discoverable

### D4. Visual balance
Compare left toolbar weight against the right dock and canvas centerline.

---

## Phase E — Right Panel Dock refactor

### E1. Replace mega-Inspector model
Right side must behave as a panel dock/container.

Everyday Editor group:
- Properties
- Layers
- History

Creative Loop group:
- Reference
- Compose
- CHAT
- Revision

Specialist group:
- AI
- Recipe / advanced production
- Diagnostics / validation

### E2. Panel behavior
Preserve or improve:
- icon-only collapsed dock
- arrow expand/collapse
- resizable width
- last-active panel memory
- Window-menu access
- canvas expansion on collapse

### E3. Properties scope
Properties may contain:
- active tool settings
- selected-object settings
- appearance / transform

Remove from normal Properties hierarchy:
- AI connection engineering
- GPU validation
- program-asset import
- recipe engineering consoles
- device validation
- performance benchmark
- manual QA export

Retain these capabilities in Specialist/Diagnostic surfaces.

### E4. Layers
Retain:
- drag reorder
- visibility
- lock
- add
- duplicate
- delete
- opacity
- compact bottom action rail

### E5. History
Keep History as its own panel.
No change to History semantics.

---

## Phase F — Duplication cleanup

### F1. Drawing properties
Define one Primary Home each for:
- Color
- Size
- Opacity

Contextual copy may remain as shortcut only.

### F2. Selection actions
Resolve duplication between:
- contextual selection bar
- Object/Properties panel

Only immediate high-value actions remain contextual.

### F3. Workspace switch
Resolve duplicate Creation/Layout controls.
Define one Primary Home and one optional shortcut.

### F4. Inspector/panel entry points
Resolve legacy inspector toggle vs edge arrow vs dock button.
Do not leave multiple equal-status permanent entry mechanisms.

---

## Phase G — Typography system

### G1. Typography tokens
Replace scattered arbitrary sizes with named UI tokens.

Required categories:
- UI-XS
- UI-SM
- UI-MD
- UI-LG
- BRAND

### G2. Legibility
- 8–9px reserved for non-critical metadata only
- functional labels must remain comfortably readable
- normalize weight / line-height / letter-spacing
- check Traditional Chinese and Latin together
- use tabular numerals where useful

### G3. Text tool separation
Do not confuse:
- INK UI typography
with
- artwork Text tool typography

Text-tool controls remain document-content capabilities.

---

## Phase H — Canvas / status / responsive

### H1. Canvas dominance
Keep canvas as largest visual field.
Remove unnecessary floating chrome.

### H2. View controls
Consolidate:
- Zoom
- Fit
- Rotation

Primary homes:
- status/view area
- View menu
- shortcuts/gestures

### H3. Status bar
Keep low-noise.
No conversion into another toolbar.

### H4. Responsive
Validate:
- normal desktop
- narrow desktop
- mobile
- fullscreen

Mobile UI remains a responsive alternative, not a second command architecture.

---

## Phase I — Runtime QA and UR gate

### I1. Required comparison
Every visible change must be compared against:
- pre-change INK runtime
- Photoshop `ps-1.png`
- Photoshop `ps-2.png`

### I2. Required evidence
Capture runtime evidence for:
- top density
- left toolbar single-column
- left toolbar two-column
- right dock expanded
- right dock collapsed
- right panel resize
- typography
- light chrome
- Y-mark top-left
- Y-mark favicon
- startup state
- fullscreen
- narrow desktop

### I3. Review result
UR returns exactly one:
- `UI_PASS`
- `UI_REVISE`
- `UI_HOLD`
- `INTEGRATION_REQUIRED → MR`

---

## Current issued package

Phase A + B have passed UR review and runtime visual gating.

Later phases remain UR-held until separately issued.

---

## Implementation order

1. Phase A — inventory/final mapping
2. Phase B — shell + brand + startup
3. Phase C — top cleanup
4. Phase D — left toolbar
5. Phase E — right panel dock
6. Phase F — duplication cleanup
7. Phase G — typography
8. Phase H — canvas/status/responsive
9. Phase I — runtime QA

Do not batch all visual changes into one unreviewable commit.
Each phase should remain independently reviewable and reversible.
