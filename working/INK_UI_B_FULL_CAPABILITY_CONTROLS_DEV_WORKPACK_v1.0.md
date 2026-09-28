# INK UI-B Full Capability Creative Controls — DEV Workpack v1.0

STATUS: `AUTHORIZED / UR_OWNED / READY_FOR_DEV_HANDOFF`

TASK: `INK-UI-B-FULL-CAPABILITY-CONTROLS-001`

OWNER: `UR / UI REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-ui-b-full-capability-controls-001`

MASTER_PLAN:
`working/INK_UI_PSH_ALIGNED_IMPLEMENTATION_MASTER_WORKPLAN_v1.0.md`

## 1. Goal

Wire the promoted 501-atomic capability placement into the Photoshop-aligned shell from Package A, with primary emphasis on P1 A-H creative UI.

This is one large capability-wiring package; do not split by individual tool family unless UR records a bounded UI blocking reason.

## 2. Final Tools membership/form

Use Photoshop compact flyouts and last-used-member behavior where practical:

- Draw: Pen/Pencil/Marker/Brush/Airbrush/Blender/Smudge.
- Eraser.
- Select.
- Lasso: Lasso/Polygonal/Magnetic.
- Smart Selection: Quick Selection/Magic Wand/Object Selection.
- Fill: Gradient/Paint Bucket.
- Sampling: Eyedropper/Color Sampler (+ Measure fallback if needed).
- Clone: Clone Stamp/Pattern Stamp.
- Healing: Healing/Spot Healing/Patch.
- Tone: Dodge/Burn/Sponge.
- Detail: Blur/Sharpen.
- Color Replacement through shared Brush/Retouch route.
- Shape family.
- Text horizontal/paragraph + vertical; Text-on-Path contextual.
- Image.
- Pan.

Flyout form follows Photoshop evidence:
- icon column;
- command label;
- right-aligned shortcut when defined;
- compact ~20 px reference pitch;
- active member reflected in slot;
- no second tool state authority.

## 3. Contextual Options wiring

Wire active context to one Options row:
- Selection: new/add/subtract/intersect, tolerance/contiguous, ROI, bounded Magnetic settings.
- Gradient: target-aware raster/vector route, linear/radial, preview, opacity.
- Paint Bucket: color/tolerance/contiguous/opacity.
- Sampling: radius/mode/readout.
- Retouch: size/opacity/strength/source/pattern.
- Draw: preset/color/size/opacity/high-frequency dynamics only.
- Text: font/size/alignment/direction/commit/cancel.
- Transform: skew/distort/perspective/warp mode + numeric quick fields + apply/cancel.
- Path/Stroke: immediate editing controls only.

Deep state goes to Properties/dialogs.

## 4. Menu/command placement

Complete functional mapping:

File:
- New/Open/Save;
- external image open/import;
- Reference/SVG import;
- Export/Print.

Image:
- artboard/document operations;
- crop/resize where supported;
- Mode 8/16/32 + RGB/CMYK/Lab/Multichannel;
- Color Profile;
- Adjustments.

Layer:
- layer/group/hierarchy;
- masks;
- Layer Effects;
- adjustment/filter stack secondary routes where appropriate.

Type:
- paragraph/horizontal;
- vertical;
- Text on Path contextual.

Select:
- selection routes;
- Select and Mask;
- alpha/path selection;
- supported modifications.

Filter:
- supported existing/P1-F filters;
- Filter Gallery;
- Liquify.

Object:
- Transform;
- Arrange;
- Align/Distribute;
- Path/Stroke;
- Boolean;
- Repeat;
- Frame/Layout;
- Component.

View:
- zoom/fit/reset/fullscreen;
- Rulers/Guides/Grid;
- Snap/Snap To;
- visibility overlays.

Window:
- same panel authority only.

Help:
- updates/diagnostics/device/storage/release routes, de-emphasized.

## 5. Required normal creative UI

Close promoted reconciliation for:
- Masks → Layers + Properties + Select and Mask.
- Blend Modes → Layers/Appearance.
- Adjustments → Adjustments panel + Image.
- Filters → Filter menu + dialogs + stack readout.
- Layer Effects → Layers fx + one Layer Effects dialog.
- Raster source state → Layers/Properties without inventing Smart Object semantics.
- Brush engine/dynamics/media → Options + Properties.
- Color/bit depth/ICC → Image + Color/Channels/Properties.
- Format interoperability → File/Open/Import/Export disclosure.

## 6. Required dialogs/workspaces

Implement/wire:
- Select and Mask.
- Layer Effects.
- Filter parameter dialogs.
- Filter Gallery.
- Liquify temporary focused workspace/modal.
- Gradient editor.
- Pattern fill editor.
- Color Profile.
- Export.
- Pen Calibration.
- Recovery contextual modal.

Liquify must expose only promoted bounded operations. No face-aware/generative controls.

## 7. Guide/snap closure

Close all required P1-C behaviors:
1. rulers;
2. drag guides;
3. move/delete/lock/show-hide guides;
4. guide edge/center snapping;
5. object edge/center snapping;
6. grid snap;
7. angle snap;
8. equal-distance/equal-spacing feedback;
9. movement position/distance readout;
10. Snap + Snap To;
11. temporary bypass;
12. coherent tolerance/hysteresis.

Use existing Document/History/Transform authorities only.

Guide drag must use transient cyan preview + compact coordinate readout per Photoshop interaction evidence.

## 8. P1-H UI rule

Show actual bounded support only:
- PSD/PSB/TIFF/RAW/EXR import/open according to current adapters;
- export only where current encoders exist;
- RAW export absent;
- unsupported compression/features are explicit;
- bounded-loss warning is explicit;
- no silent metadata/channel loss claim.

## 9. Planning IDs/gaps

Package B is responsible for functional completion of all PUI rows not fully closed by A, especially:
- PUI-001..004;
- PUI-010..027;
- PUI-041..051;
- PUI-052..056 functional wiring;
- PUI-069..074.

By B handoff:
- all 74 PUI rows must be IMPLEMENTED / INTENTIONAL_HEADLESS / RETIRED_DUPLICATE / explicitly bounded;
- G-01..G-34 must have a concrete implementation disposition;
- remaining items may only be visual/fine-detail closure assigned to C.

## 10. Allowed source boundary

Primary UI wiring files:
- `product/source/shell.template.html`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `product/source/src/ink.js`
- `product/source/src/studio-core.js`
- accepted shell generation files
- QA/evidence/progress.

Existing Core modules are READ/IMPORT authority. Do not alter them merely to simplify UI wiring.

If a promoted UI route cannot be implemented without a Core semantic change:
`STOP → MR`.

## 11. Prohibited

- no new Core algorithms/capabilities;
- no second History/Selection/Mask/Renderer/Guide/Snap/Color/CHAT authority;
- no generative/content-aware feature invention;
- no P2 implementation;
- no FORMAT_VERSION change;
- no central Runtime;
- no Photoshop feature that INK does not own.

## 12. Package-B QA

Required:
- focused tool/menu/panel/dialog contract QA;
- command reaches intended existing authority;
- History/save-load preserved where applicable;
- no dead menu/tool entries;
- no duplicated mutation routes;
- 74-PUI disposition report;
- 34-gap implementation report;
- local browser/manual interaction checks allowed;
- central exact-SHA Runtime prohibited.

Suggested focused QA:
`qa/ink-ui-b-full-capability-controls.test.mjs`

## 13. DEV handoff

Provide exact HEAD, changed files, focused QA, PUI/gap closure tables, bounded limitations, health delta, and STOP to UR.

UR owns technical/UI review inside the delegated UI boundary, may issue bounded revisions directly to DEV, and promotes UI-B after UR PASS. MR is not a routine intermediary. STOP → MR only when the implementation requires a Core/global authority change under `ACTIVE/INK_UI_UR_EXECUTION_DIRECTIVE_v1.0.md`.


## 14. Added MR requirement — future capability extensibility

This package must preserve and improve the workstation's ability to accept future registered capabilities without turning this task into a full Plugin SDK project.

Current existing extension-related authorities include:
- canonical capability registry;
- INK Public Creative API;
- Connector / adapter boundaries;
- Program Import;
- Creative Library reuse surfaces.

UI-A centralized application menus and panels into built-in registries, but they remain frozen internal lists.

UI-B must add or prepare a bounded UI contribution boundary so future native/adaptor capabilities can be registered without rewriting unrelated shell logic.

Accepted scope:
- one documented UI-contribution registration contract or equivalent centralized extension boundary;
- capability-to-menu / toolbar-flyout / panel / dialog contribution metadata where appropriate;
- validation against duplicate IDs/routes;
- explicit mapping back to an existing capability/Core authority;
- registered contributions remain subject to MR capability governance.

Not required:
- third-party package loader;
- marketplace;
- arbitrary remote code execution;
- plugin sandbox;
- plugin permissions system;
- public third-party SDK completeness.

```text
FULL_PLUGIN_SDK = P2 / NOT_IN_UI_B
UI_CONTRIBUTION_EXTENSION_BOUNDARY = REQUIRED
SECOND_CORE_AUTHORITY = PROHIBITED
```

If a clean bounded extension boundary cannot be introduced without architectural expansion, STOP → MR rather than inventing a plugin system.

## 15. Added MR requirement — INK brand identity preservation

UI-B must preserve the existing brand authorities while adding new menus/tools/panels:

Visible logo authority:
`product/source/assets/INK_MARK_SOURCE_W-300.jpg`

Approved visible-logo SHA-256:
`08fdfd29832ffc06779eae8da9be6d14e9564ed292ba5548483def016338fed8`

Browser favicon authority:
`product/source/assets/favicon.svg`

Favicon contract:
- 32×32;
- background `#69BFE3`;
- white simplified Y;
- Web / Portable shell uses the same favicon;
- no fallback to full `ink-mark.svg` as browser favicon.

Requirements:
- do not replace the INK logo with Adobe branding;
- do not duplicate competing visible-logo asset authorities;
- do not silently remove/change favicon routing;
- add focused QA for visible-logo route + favicon route preservation.

PWA / installed-desktop App Icon work is explicitly outside the current UI program and must not be expanded in this package.


## 16. Current ownership override

Current authority:
`ACTIVE/INK_UI_UR_EXECUTION_DIRECTIVE_v1.0.md`

```text
PACKAGE_B_OWNER = UR
DEV_HANDOFF = STOP_TO_UR
ROUTINE_REVIEW = UR
BOUNDED_REVISION = UR → DEV → UR
UI_B_PROMOTION = UR
MR_INTERMEDIARY = NO
STOP_TO_MR = INTEGRATION_REQUIRED ONLY
CENTRAL_RUNTIME = PROHIBITED
```

After UI-B promotion, UR may activate UI-C without returning to MR, provided no Core/cross-lane escalation condition exists.
