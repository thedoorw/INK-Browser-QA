# INK Photoshop-Aligned UI Implementation Program — MR Master Workplan v1.0

STATUS: `MR_AUTHORIZED_PLAN / THREE_BOUNDED_IMPLEMENTATION_PACKAGES / FINAL_RUNTIME_DEFERRED`

DATE: 2026-09-28

PROGRAM: `INK-UI-PHOTOSHOP-ALIGNED-IMPLEMENTATION-001`

PLANNING_BASELINE_MAIN: `cc772245f636f8f76f63564faad2dea61045333d`

## 1. USER-locked execution rules

```text
IMPLEMENTATION_PACKAGES = 3
PACKAGE_GRANULARITY = LARGE_BOUNDED_PACKAGES
CENTRAL_RUNTIME_BETWEEN_PACKAGES = PROHIBITED
FINAL_CENTRAL_RUNTIME = ONE / AFTER_ALL_UI_PACKAGES_PROMOTED
PHOTOSHOP_ALIGNMENT = PRIMARY_UI_POSITION_AND_FORM_REFERENCE
NEW_CORE_CAPABILITY = PROHIBITED
SECOND_CORE_AUTHORITY = PROHIBITED
FORMAT_VERSION_CHANGE = PROHIBITED
```

Focused/unit/static QA and local browser interaction checks are required inside each package. They are not accepted as the final integrated Runtime gate.

## 2. Authority precedence

When documents conflict, use this precedence:

1. current product capability authority:
   - `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
   - `working/INK_CAPABILITY_REGISTRY_v0.1.md`
2. promoted full-capability UI reconciliation:
   - `working/INK_UI_ATOMIC_CAPABILITY_DISPOSITION_v1.0.md`
   - `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
   - `working/INK_UI_UPDATED_CONTROL_LEDGER_v1.0.md`
   - `working/INK_UI_RECONCILIATION_GAP_REGISTER_v1.0.md`
   - `working/INK_UI_MENU_TOOLBAR_PANEL_ARCHITECTURE_v1.0.md`
3. Photoshop geometry/form/interaction authority:
   - `working/INK_UI_FINAL_PS_REFERENCE_MEASUREMENT_v1.0.md`
   - `working/INK_UI_PS_ACTIVE_DOCUMENT_MEASUREMENT_v0.1.md`
   - `working/INK_UI_PS_FINE_DETAIL_STANDARD_v1.0.md`
   - `working/INK_UI_PS_INTERACTION_DETAIL_MEASUREMENT_v0.1.md`
   - `working/INK_UI_PS_PANEL_AND_STATUS_DETAIL_SPEC_v0.1.md`
   - `working/INK_UI_PS_LIGHT_THEME_WEB_REFERENCE_v0.1.md`
   - `working/INK_UI_FINAL_PHOTOSHOP_ALIGNMENT_SPEC_v1.0.md` only where not superseded by promoted reconciliation.

Explicit supersession:
- the old Alignment Spec statement that a normal Filter menu is absent is obsolete;
- promoted P1-F reconciliation requires a top-level `Filter` menu;
- promoted panel inventory includes `Color`, `Channels`, and `Adjustments`;
- old Specialist-only Adjustment/Filter placement is obsolete.

## 3. Photoshop placement/form contract

Desktop workstation form:

```text
Application / Menu row
Contextual Options row
Document tab band when a document is active
Rulers when enabled
┌─────────────┬───────────────────────────────┬────────────────────┐
│ Tools       │ Canvas / Document workspace   │ Dock / Panels      │
└─────────────┴───────────────────────────────┴────────────────────┘
Active-document status strip only when justified
```

Measured/locked references:
- Application/menu content: 24 px.
- divider: 1 px.
- Options content: 35 px.
- divider: 1 px.
- base workstation origin: y=61 px.
- active-document tab band: 28 px + 1 px divider.
- horizontal/vertical rulers: 17 px.
- ruler origin corner: 17×17 px.
- active-document status content: 16 px + 1 px bottom boundary.
- no document: no document tab band and no document status strip.
- single Tools reference: 39 px + 1 px divider.
- double Tools reference: 72 px + 1 px divider.
- selected-tool fill reference: 31×24 px.
- tool-row pitch reference: ~26 px.
- flyout marker: ~3×3 px visible.
- collapsed right Dock reference: 39 px + 1 px divider.
- expanded panel reference: 252 px elastic/reference state, never a hard fixed width.
- panel header/tab band: 28 px.
- stacked-panel splitter: ~3 px reference density.
- History row pitch: ~23 px reference density.
- Layers row pitch during reorder reference: ~35 px.
- Layers drag reorder requires ghost + horizontal insertion indicator.
- tool flyout reference: icon + label + right-aligned shortcut, ~20 px row pitch.
- panel/application popup: 1 px border; 1 px separators; ~2 px separator inset.
- Tooltip: light surface, tool name + secondary description; measured 152×53 is reference-state only.
- Navigator proxy and panel resizing must behave Photoshop-like; cursor glyph itself is not pixel-locked.

Light theme:
- use Adobe/Photoshop Light semantic hierarchy, not dark-reference RGB;
- very-light application/options/tools/panel chrome;
- distinct panel bodies and structural boundaries;
- document/workbench background is a separate semantic surface;
- no Adobe logos/assets;
- INK identity remains.

## 4. Final top-level menu authority

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

No dead menu labels.
No top-level Brush menu.
No 3D menu.
Window mirrors one panel authority.
Filter is normal P1-F creative UI.

## 5. Final left Tools workflow grouping

Photoshop-style compact flyouts, not one permanent slot per Core function:

- Draw: Pen / Pencil / Marker / Brush / Airbrush / Blender / Smudge.
- Eraser: direct high-frequency slot.
- Select: basic object selection.
- Lasso: Lasso / Polygonal Lasso / Magnetic Lasso.
- Smart Selection: Quick Selection / Magic Wand / Object Selection.
- Fill: Gradient / Paint Bucket.
- Sampling: Eyedropper / Color Sampler; Measure may share this family when appropriate.
- Retouch Clone: Clone Stamp / Pattern Stamp.
- Retouch Healing: Healing / Spot Healing / Patch.
- Retouch Tone: Dodge / Burn / Sponge.
- Retouch Detail: Blur / Sharpen.
- Color Replacement: shared Brush/Retouch route, no mandatory extra permanent slot.
- Shape: all supported primitives through one flyout.
- Text: horizontal/paragraph + vertical; Text on Path contextual.
- Image.
- Pan.

Tool selection must change the Contextual Options row, not create a second Inspector.

## 6. Right-side panel authority

Normal dock/panel inventory:

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

No ordinary permanent Filters panel.
No permanent Liquify panel.
No ordinary Runtime/GPU/Recompute/Semantic/Asset-Lifecycle panels.

Panel anatomy:
- 28 px-style tab/header band;
- active/inactive tabs;
- panel options menu;
- scrollable body;
- optional local footer;
- elastic stacked grouping;
- synchronized Window menu state;
- collapsed icon Dock and expanded panels share one state authority.

## 7. Three implementation packages

### Package A — Photoshop Workstation Shell & Panel System
Task:
`INK-UI-A-PHOTOSHOP-SHELL-PANELS-001`

Owns:
- workstation shell geometry;
- Light theme token system;
- application menu framework;
- Options-row framework;
- active-document tabs/rulers/status geometry;
- left Tools single/double rail framework;
- right Dock/panel framework;
- panel grouping/resize/tabs/options/footer grammar;
- core panel normalization and panel state convergence;
- Navigator/History/Layers/Pages workstation behavior;
- normal Color/Channels/Adjustments panel homes;
- duplicate desktop chrome retirement;
- Window/Help panel routes;
- host surfaces required by later capability wiring.

No final P1 tool/dialog wiring unless needed to prove host-surface architecture.

### Package B — Full Capability Creative Controls & Wiring
Task:
`INK-UI-B-FULL-CAPABILITY-CONTROLS-001`

Owns:
- complete toolbar/flyout membership;
- complete contextual Options controls;
- P1 A-H human UI wiring;
- Image/Layer/Type/Select/Filter/Object/View/File command placement;
- mask/adjustment/filter/effects normal creative placement;
- Select and Mask;
- Layer Effects;
- filter dialogs / Filter Gallery;
- Liquify temporary workspace;
- Gradient/Pattern editors;
- Color Profile;
- Export/import interoperability/status disclosure;
- Pen Calibration / Recovery;
- all remaining PUI planning requirements and G-01..G-34 functional closure.

No Core algorithm replacement; if existing authority cannot support a required UI route, STOP to MR.

### Package C — Photoshop Fidelity, Interaction & Final UI Closure
Task:
`INK-UI-C-PHOTOSHOP-FIDELITY-CLOSURE-001`

Owns:
- fine geometry/detail convergence;
- menu/flyout/tooltip/popup density;
- Layers reorder interaction state;
- Navigator proxy interaction;
- panel resize/splitter behavior;
- guide drag/live readout/ruler origin interaction;
- status-strip active-document rules;
- typography, icon, border, spacing, hover/focus/disabled states;
- light-gray semantic token finalization;
- responsive/mobile routes without changing desktop authority;
- accessibility/focus;
- 74 PUI final disposition audit;
- 34-gap final audit;
- refresh/finalize completion checklist;
- no new capability.

Package C is the last UI mutation package.

## 8. Review/promotion sequence

```text
A DEV
→ MR technical review
→ UR Photoshop/interaction review
→ A promotion

→ B DEV
→ MR technical review
→ UR placement/workflow review
→ B promotion

→ C DEV
→ MR technical review
→ UR visual/fidelity review
→ USER visual revision if needed
→ C promotion

→ ONE final exact-SHA integrated Runtime
→ AI Completion Checklist
→ MR final Runtime review
→ UI_COMPLETE candidate
```

No central Runtime after A or B.

## 9. Final Runtime rule

The final UI Runtime is not authorized until A/B/C are all MR_PASS and promoted.

It must test the exact promoted product SHA and include:
- existing Closure/P0/P1 suites;
- UI A/B/C focused contract suites;
- full menu/tool/panel interaction;
- active/empty document states;
- 1280×994 normalized Photoshop comparison states;
- single/double Tools;
- collapsed/expanded panels;
- active document tabs/rulers/status;
- final visual captures;
- responsive checks;
- artifact preservation.

There is exactly one final integrated UI Runtime gate unless that Runtime exposes a defect requiring a separate correction + rerun.

## 10. Program gate

```text
UI_RECONCILIATION = CLOSED / PROMOTED
UI_IMPLEMENTATION_PROGRAM = AUTHORIZED
ACTIVE_PACKAGE = A
PACKAGE_B = WAIT_FOR_A_PROMOTION
PACKAGE_C = WAIT_FOR_B_PROMOTION
FINAL_RUNTIME = DEFERRED_UNTIL_A_B_C_PROMOTED
```
