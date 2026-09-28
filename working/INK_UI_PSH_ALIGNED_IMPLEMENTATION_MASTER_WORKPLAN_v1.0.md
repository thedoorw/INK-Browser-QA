# INK Photoshop-Aligned UI Implementation Program — MR Master Workplan v1.0

STATUS: `PROGRAM_CLOSED / UI_A_B_C_PROMOTED / FINAL_RUNTIME_PASS / UI_COMPLETE`

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

→ B DEV under UR
→ UR placement/workflow/technical-boundary review
→ bounded revision loop as needed
→ B promotion by UR

→ C DEV under UR
→ UR visual/fidelity/interaction review
→ USER visual revision if needed
→ bounded revision loop as needed
→ C promotion by UR

→ ONE final exact-SHA integrated Runtime
→ AI Completion Checklist
→ MR final Runtime review
→ UI_COMPLETE candidate
```

No central Runtime after A or B.

## 9. Final Runtime rule

The final UI Runtime is not authorized until A/B/C are promoted under their applicable review authority. UI-B/UI-C are UR-owned; MR owns only the later central Runtime authorization.

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
PACKAGE_A = MR_PASS / UR_PASS / PROMOTED
PACKAGE_B = UR_PASS / PROMOTED
PACKAGE_C = UR_PASS / PROMOTED
ACTIVE_PACKAGE = NONE / PROGRAM_CLOSED
FINAL_RUNTIME = DEFERRED_UNTIL_A_B_C_PROMOTED
```


## 11. Added USER/MR requirements — extensibility + brand identity

Future capability growth:
- current architecture already has capability registry, Public Creative API, Connector/adapter boundaries, Program Import and Creative Library surfaces;
- the current UI program must preserve a clean UI contribution/registration boundary for future native/adaptor capabilities;
- this does not authorize a full third-party Plugin SDK, marketplace, remote package loader or arbitrary code execution;
- full Plugin Ecosystem remains P2 expansion.

Brand identity:
- visible INK logo authority = `product/source/assets/INK_MARK_SOURCE_W-300.jpg`;
- approved visible-logo SHA-256 = `08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`;
- browser favicon authority = `product/source/assets/favicon.svg`;
- favicon contract = 32×32 / #69BFE3 background / white simplified Y;
- Adobe logo/proprietary branding is prohibited.

PWA / installed-desktop App Icon:
`OUT_OF_SCOPE_FOR_CURRENT_UI_PROGRAM`

Existing manifest behavior is preserved unless a future separate Work Order explicitly reopens it.


## 12. Package A promotion record

```text
PACKAGE_A_TASK = INK-UI-A-PHOTOSHOP-SHELL-PANELS-001
PACKAGE_A_MR = PASS
PACKAGE_A_UR = PASS
PACKAGE_A_PROMOTION_PR = 83
PACKAGE_A_PROMOTION_MERGE = f839f542d6da1eaa68791a0c8f3a5834b6ba0868
PACKAGE_A = PROMOTED
PACKAGE_B = ELIGIBLE / NOT_STARTED
CENTRAL_RUNTIME_AFTER_A = NOT_RUN / CORRECT
```

Package B does not start automatically from Package A promotion.


## 13. UR delegation for remaining UI program

Current authority:
`ACTIVE/INK_UI_UR_EXECUTION_DIRECTIVE_v1.0.md`

The remaining UI program is delegated to UR end to end.

```text
UI_B_OWNER = UR
UI_C_OWNER = UR
UI_DEV_SUPERVISION = UR
ROUTINE_UI_REVIEW = UR
ROUTINE_UI_PROMOTION = UR
MR_INTERMEDIARY_BETWEEN_DEV_AND_UR = NO
STOP_TO_MR = CORE / CROSS-LANE / FORMAT_VERSION / P2 / CENTRAL_RUNTIME ONLY
FINAL_EXACT_SHA_RUNTIME_OWNER = MR
```

This delegation allows MR to continue independent technical/Core R&D while UR completes the Photoshop-aligned UI program.


## 14. Program closure

```text
PACKAGE_A = PROMOTED
PACKAGE_B = UR_PASS / PROMOTED
PACKAGE_C = UR_PASS / PROMOTED

UI_C_PROMOTION_SHA = 77ee44c94a848588aceeb7797fa8aa737c69b248
RUNTIME_HARNESS_RECONCILE_PR = 88
FINAL_RUNTIME_TESTED_SHA = 24d3b3f607a17b3cb9331ec3635b34d804ee445b
PRODUCT_SOURCE_EQUIVALENCE = PASS

FINAL_RUNTIME_RUN = 36445204976
FINAL_RUNTIME_ARTIFACT = 10979718534
FINAL_RUNTIME = PASS

UI_COMPLETE = VERIFIED
PROGRAM = CLOSED
```

Final MR review:
`working/INK_UI_FINAL_RUNTIME_MR_REVIEW_v1.0.md`

Any further UI work is a new program or bounded follow-up, not a continuation of UI-A/B/C.
