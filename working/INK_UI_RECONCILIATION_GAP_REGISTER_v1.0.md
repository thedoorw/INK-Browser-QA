# INK UI Reconciliation Gap Register v1.0

STATUS: `UR_COMPLETE / MR_REVIEW_REQUIRED / UI_IMPLEMENTATION_HOLD`

TASK: `INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

DATE: 2026-09-28

SOURCE:
- `working/INK_CAPABILITY_REGISTRY_v0.1.md`
- `working/INK_UI_CAPABILITY_RECONCILIATION_GAPS_v0.1.md`
- `working/INK_UI_FULL_CAPABILITY_PLACEMENT_MATRIX_v1.0.md`
- promoted P1 A-H + P1 Integration evidence

This register records UI gaps only. It does not authorize implementation.

## 1. Priority model

- `P0-UI` — required for a coherent normal workstation; UI closure prohibited if unresolved.
- `P1-UI` — important professional workflow; may be staged only with explicit MR/USER approval.
- `P2-UI` — advanced/secondary discoverability or refinement.
- `NO-GAP` — headless/Specialist placement is already intentional.

## 2. Gap register

| Gap | Priority | Capability / source | Current condition | Required reconciliation | Surface | Owner after HOLD clear |
|---|---|---|---|---|---|---|
| G-01 | P1-UI | C02 Pages | existing panel not fully normalized | one dockable Pages authority with add/duplicate/delete/switch/rename | right panel | UI DEV → UR |
| G-02 | P1-UI | C04 Workspaces | workspace controls exist but shell hierarchy remains legacy | normalize Creation/Layout switcher + View secondary route | top shell/View | UI DEV → UR |
| G-03 | P1-UI | C05 Artboard/print | Properties coverage incomplete | consolidate artboard size/orientation/PPI/bleed/safe/clipping/print state | Properties | UI DEV → UR |
| G-04 | P0-UI | C06 Navigator | required Navigator panel absent/incomplete | implement thumbnail viewport proxy + pan/jump/zoom sync | right panel | UI DEV → UR |
| G-05 | P0-UI | C07 + P1-A/E | current Select/Lasso surface lacks full selection set | Lasso and smart-selection flyouts + Select menu mapping | toolbar/options/menu | UI DEV → UR |
| G-06 | P0-UI | C08 + P1-C Integration | Core wired; ruler/snap UI absent | satisfy all 12 ruler/guide/snap workstation behaviors | rulers/View/direct feedback | UI DEV → UR |
| G-07 | P1-UI | C11 Shapes | shape family not fully normalized | one shape flyout for all supported primitives | toolbar/options | UI DEV → UR |
| G-08 | P0-UI | C13 + P1-C | current transform surface lacks advanced transforms | Skew/Distort/Perspective routes + contextual apply/cancel | Object/Properties/canvas | UI DEV → UR |
| G-09 | P1-UI | C14 + P1-C Warp | reversible deformation exists; no mature interaction surface | Warp/Deform command with bounded dialog/on-canvas mode | Object/dialog | UI DEV → UR |
| G-10 | P1-UI | C19 Layout | current controls fragmented | consolidate frame/item layout into Properties sections | Properties | UI DEV → UR |
| G-11 | P0-UI | C20 + P1-C | text UI only covers basic create/edit | Paragraph, Vertical Type, Text-on-Path placement | Text tool/Type/Properties | UI DEV → UR |
| G-12 | P0-UI | C22 | image capability broader than current Image tool | normalize raster object crop/resize/histogram/snapshot/compare/status placement | Image/Properties | UI DEV → UR |
| G-13 | P0-UI | C23 | mask primary route incorrectly Specialist | move mask creation/state/refinement to Layers + Properties + Select-and-Mask | Layers/Properties/dialog | UI DEV → UR |
| G-14 | P0-UI | C24 + P1-F | adjustment stack incorrectly Specialist-only | normal Adjustments panel + Image > Adjustments | panel/menu | UI DEV → UR |
| G-15 | P0-UI | C25 + P1-F | filter stack incorrectly Specialist-only; no Filter menu | create Filter menu + parameter dialogs + stack readout | top menu/dialog | UI DEV → UR |
| G-16 | P0-UI | C26 | blend mode authority exists but normal placement incomplete | Layers/Properties Appearance blend-mode control | panel/properties | UI DEV → UR |
| G-17 | P0-UI | C27 + P1-D | effects renderer complete; UI absent | Layers fx + Layer Effects dialog covering five effects | Layers/dialog | UI DEV → UR |
| G-18 | P1-UI | C28 | reusable raster source semantics hidden | expose source/instance state without inventing Smart Object system | Layers/Properties | UI DEV → UR |
| G-19 | P0-UI | C30 | brush engine visible mainly as tool/preset | normal Brush Properties covering registry/imported preset use | Options/Properties | UI DEV → UR |
| G-20 | P1-UI | C31 | natural-media modes underexposed | present media modes through brush presets + contextual media properties | Options/Properties | UI DEV → UR |
| G-21 | P0-UI | C32 | supported brush dynamics not surfaced coherently | contextual Brush Dynamics Properties with collapsed sections | Properties | UI DEV → UR |
| G-22 | P1-UI | C33 | Blender/Smudge currently advanced route | promote to normal Draw/Retouch flyout | toolbar/options | UI DEV → UR |
| G-23 | P1-UI | C36 | stylus behavior exists but user feedback/calibration discoverability uneven | keep normal drawing automatic; diagnostics secondary | Settings/Help | UI DEV → UR |
| G-24 | P2-UI | C37 | calibration controls Specialist-only and scattered | consolidate Pen Calibration dialog/Settings route | dialog/settings | UI DEV → UR |
| G-25 | P1-UI | C38 | paper/media parameters fragmented | Properties > Document/Media with contextual brush secondary | Properties | UI DEV → UR |
| G-26 | P1-UI | C41 | extraction/vectorization route underdefined | Reference-panel action + progress/cancel/result placement | Reference/dialog | UI DEV → UR |
| G-27 | P2-UI | C42 | reconstruction is capable but advanced | Compose subsection; keep off general toolbar | Compose | UI DEV → UR |
| G-28 | P1-UI | C46 | compare/variant actions currently scattered across CHAT/legacy | one compare mode/dialog shared with Revision/Preview authority | Revision/canvas/dialog | UI DEV → UR |
| G-29 | P1-UI | C48 | recovery is technical but user-facing when failure occurs | recovery modal with explicit snapshot/checkpoint choice/status | modal | UI DEV → UR |
| G-30 | P1-UI | C52 | high-res export state exists but export dialog needs full progress/cancel/resume | consolidate in Export dialog/status | dialog | UI DEV → UR |
| G-31 | P0-UI | C53 + P1-H | current export formats predate P1-H | update import/export surface with actual PSD/TIFF/EXR etc. support and loss/status disclosure | File/dialog | UI DEV → UR |
| G-32 | P2-UI | C55 | Recipe surface split between Compose and Specialist | distinguish normal Compose workflow from engineering Recipe controls | Compose/Specialist | UI DEV → UR |
| G-33 | P2-UI | C60 | memory/research advisory state lacks clear human readout | CHAT/Compose advisory readout only; no autonomous write UI | CHAT/Compose | UI DEV → UR |
| G-34 | P2-UI | C63 | update controls exist in settings/legacy surface | normalize Help > Updates + diagnostics state | Help/dialog | UI DEV → UR |

## 3. Mandatory P1-A gap closure

### Selection flyouts
Required:
- Lasso / Polygonal Lasso / Magnetic Lasso;
- Quick Selection / Magic Wand / Object Selection;
- Select and Mask dialog;
- selection mode add/subtract/intersect controls.

### Fill / sampling
Required:
- Gradient + Paint Bucket flyout;
- Eyedropper + Color Sampler flyout;
- context-sensitive Gradient dispatch between raster and vector fill authorities.

No new selection/mask engine may be introduced.

## 4. Mandatory P1-B gap closure

Required normal raster-retouch groups:
- Clone / Pattern Stamp;
- Healing / Spot Healing / Patch;
- Dodge / Burn / Sponge;
- Local Blur / Local Sharpen;
- Color Replacement Brush.

Constraint:
These should be grouped into a small number of flyout slots. Eleven new permanent toolbar slots are explicitly rejected.

## 5. Mandatory P1-C ruler / guide / snap closure

UI closure is prohibited until all twelve behaviors are present:

1. top ruler + left ruler;
2. drag horizontal/vertical guides from rulers;
3. move/delete/lock/show-hide guides;
4. object edge/center snapping to guides;
5. object-to-object edge/center snapping;
6. grid snapping;
7. angle snapping;
8. equal-distance/equal-spacing snapping with visible feedback;
9. movement distance/position readout;
10. global Snap + Snap To categories;
11. temporary snap bypass;
12. coherent tolerance/hysteresis behavior without jitter.

Technical authority is already integrated under the existing Document/History/Transform path. UI must bind to that path rather than legacy compatibility setters.

## 6. Mandatory P1-D/F raster-processing closure

### Layer Effects
One dialog/property surface only:
- Drop Shadow
- Inner Shadow
- Outer Glow
- Color Overlay
- Stroke

### Adjustments
Normal creative placement required for:
- Brightness/Contrast
- Levels
- Curves
- Hue/Saturation
- Color Balance
- Gradient Map
- Exposure
- Vibrance
- Black & White
- Photo Filter
- Channel Mixer
- Color Lookup
- Invert
- Posterize
- Threshold
- Selective Color

### Filters
Normal Filter menu required for existing and P1-F filter algorithms.

Filter Gallery:
- one dialog;
- descriptor foundation is not permission to invent unsupported filters.

Liquify:
- dedicated bounded workspace/modal;
- no face-aware/AI controls;
- expose only Forward Warp, Twirl, Pucker, Bloat, Reconstruct and freeze/protect mask.

## 7. Mandatory P1-G color/channel closure

### Color / bit depth
Required:
- Image > Mode entry for 8/16/32 and RGB/CMYK/Lab/Multichannel.
- unsupported render/transform states remain explicit; UI must not silently coerce to RGB8.

### ICC
Required:
- inspect embedded profile;
- expose only supported assign/convert operations;
- unsupported complex ICC transforms must be disabled or report explicit unsupported status.

### Channels
A Channels panel is required for:
- process channels;
- alpha channels;
- spot channels with preview color/solidity;
- Multichannel named channels;
- add/remove/rename/reorder;
- extract/replace plane where appropriate.

## 8. Mandatory P1-H format closure

Import/open:
- PSD
- PSB
- TIFF
- RAW through approved decoder adapter
- EXR

Export:
- only actual available encoders;
- RAW export absent;
- PSB export conditional on accepted adapter;
- TIFF/EXR bounded capability status visible;
- no silent metadata/channel loss.

The File UI must distinguish:
- normal success;
- decoder/adapter required;
- unsupported feature/compression;
- bounded-loss warning.

## 9. Explicit non-gaps

No normal creative UI gap exists for the following because headless/Specialist behavior is intentional:

- C47 storage backend selection;
- C49 renderer internals;
- C50 natural-media renderer internals;
- C51 GPU/tile infrastructure;
- C54 recompute internals;
- C58 semantic grounding internals;
- C62 asset lifecycle;
- Runtime queue/harness/execution state.

These must not be turned into normal workstation panels merely for capability completeness.

## 10. Gate result

```text
OPEN_UI_GAPS = 34
P0_UI_GAPS = 14
P1_UI_GAPS = 15
P2_UI_GAPS = 5
HEADLESS_FALSE_GAPS = 0
UI_IMPLEMENTATION_AUTHORIZED = NO
MR_UI_HOLD_CLEARANCE_REQUIRED = YES
CURRENT_TASK = PLANNING_COMPLETE
NEXT_OWNER = MR REVIEW
```

STOP.