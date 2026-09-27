# INK UI Capability Reconciliation Gaps v0.1

STATUS: `MR_RECONCILIATION / UI_STILL_HOLD`

TASK: `INK-CAPABILITY-BASELINE-MANUAL-001`

NORMALIZED_REGISTRY: `working/INK_CAPABILITY_REGISTRY_v0.1.md`

CURRENT_UI_MAP: `working/INK_UI_FINAL_FUNCTION_PLACEMENT_MAP_v1.0.md`

## 1. Purpose

The previous final UI placement map was complete against the old frozen baseline, but the full-product census has now proven that the old baseline omitted or under-described existing INK capabilities.

Therefore the historical statement:

`UNCLASSIFIED_FUNCTION_FAMILIES = 0`

is no longer valid against the refreshed full-product truth until UR reconciles the new registry.

This does not mean the old map is discarded. It remains valuable placement work and already covers a large part of the workstation. It must be refreshed, not rebuilt from zero.

## 2. Major placement corrections required

### A. Raster / image processing can no longer be treated as legacy-only Specialist behavior

The old map says legacy Mask/Adjustment/Filter controls are Specialist and not authorized as final normal UI under the then-frozen baseline.

The new census confirms these are real preserved product families:

- C22 Raster / Image objects
- C23 Raster / vector masks
- C24 Adjustment stack
- C25 Filter stack
- C26 Blend modes
- C27 Layer effects
- C28 Reusable raster source

Required UR reconciliation:

- assign a normal professional home for masks;
- assign a normal professional home for adjustments;
- assign a normal professional home for filters;
- expose Blend Mode where layer/object appearance is edited;
- expose completed Layer Effects through the same appearance/layer authority;
- expose Reusable Raster Source / instance semantics without inventing a second Smart Object model;
- preserve Specialist diagnostics only as secondary/engineering routes.

This is the most important UI correction caused by the capability rebaseline.

### B. Drawing / brush capabilities require full-parameter placement, not only tool buttons

Existing UI mapping correctly preserves Pen/Pencil/Marker/Brush/Airbrush/Eraser and advanced Stroke Session routes, but the refreshed registry includes:

- C30 Brush engine
- C31 Natural media
- C32 Brush dynamics
- C33 Blender / Smudge
- C34 Stroke editing
- C35 Stroke Session
- C36 Stylus
- C37 Device calibration
- C38 Paper / media

UR must ensure final Properties/Options/Specialist placement accounts for the supported dynamics and paper/media parameters rather than only the visible brush-family picker.

Do not create one permanent control for every parameter; contextual Properties/Options may own them.

### C. Existing Vector Geometry Kernel remains mostly headless/shared Core

The census found additional geometry primitives:
- intersection;
- projection;
- segment split;
- robust offset;
- line/circle fitting;
- geometry measurement.

These are supporting vector capabilities. The previous UI decision remains valid:
low-level kernel primitives do not require direct controls unless a real user workflow needs them.

No UI expansion is required merely because the source API exists.

### D. Specialist / advanced routes are already substantially preserved

The existing Static Control Ledger already accounts for:
- Program Import;
- external reference evidence;
- Recipe Studio;
- mask/adjustment/filter legacy controls;
- Stroke Session;
- Drawing Workflow import;
- Brush Package export;
- Stylus tests;
- calibration profiles;
- interactive benchmark;
- artwork QA;
- layer manifest;
- storage/offline health;
- release health;
- external diagnostic bundle;
- update check / activate update.

These routes should be retained while the ordinary creative UI is reconciled.

### E. New canonical families beyond the old 61

#### C62 Asset lifecycle
Classification: headless/platform-support by default.

UI requirement:
- no ordinary panel required;
- diagnostics/status may appear in Specialist only when needed;
- asset portability/integrity must remain preserved.

#### C63 PWA / update management
Existing UI evidence already includes:
- Check Update;
- Activate Update;
- update diagnostics.

Final home:
`Help / Specialist / Product Health`.

#### C64 Product health / diagnostics
Existing UI evidence already includes:
- storage/offline health;
- release health;
- external diagnostic bundle;
- GPU self-check;
- stylus/device reports;
- interactive benchmark;
- artwork QA;
- update diagnostics.

Final home:
`Help / Specialist / Diagnostics`.

No ordinary creative panel should be added.

## 3. Current pre-P1 UI gap state

```text
OLD_UI_MAP_REUSABLE = YES
OLD_UI_MAP_COMPLETE_AGAINST_REFRESHED_REGISTRY = NO
PRIMARY_RECONCILIATION_GAP = RASTER_IMAGE_PROCESSING_NORMAL_UI
SPECIALIST_ADVANCED_PRESERVATION = MOSTLY_ALREADY_MAPPED
NEW_PLATFORM_FAMILIES_NEED_NEW_NORMAL_PANELS = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
```

## 4. P1/P2 implementation impact on future UI

After all P1 A-H packages close and the single integrated Runtime passes, UR must additionally place:

### P1-A Selection / Fill / Sampling
- Polygonal Lasso;
- Quick Selection;
- Magic Wand;
- Select and Mask refinement;
- Gradient;
- Paint Bucket;
- Eyedropper / Color Sampler.

### P1-B Local Raster Retouch
- Clone / Pattern Stamp;
- Healing / Spot Healing / Patch;
- Dodge / Burn / Sponge;
- Local Blur / Sharpen;
- Color Replacement Brush.

### P1-C Vector / Text / Precision
- Skew / Distort / Perspective / Warp;
- Paragraph / Vertical Type;
- Text on Path;
- Gradient / Pattern fills;
- persistent ruler guides;
- equal-distance snapping;
- ruler / measurement.

### P1-D Layer Effects
- Drop Shadow;
- Inner Shadow;
- Outer Glow;
- Stroke;
- existing Color Overlay remains.

### P1-E Advanced Selection
- Magnetic Lasso;
- Object Selection.

### P1-F Raster Processing Expansion
- Adjustment breadth;
- Filter / Filter Gallery breadth;
- Liquify.

### P1-G Color / Bit Depth / Channels
- 8/16/32-bit workflow;
- RGB / CMYK / Lab / Multichannel;
- ICC color management;
- Channels / alpha / spot channels.

### P1-H Format Interoperability
- PSD / PSB / TIFF / RAW / EXR breadth.

These functions must converge on existing native authorities and may not create parallel panels/engines.

No UI implementation starts between P1 packages. Runtime also waits until A-H are complete and integrated.

## 5. UR release gate after MR technical work

UI HOLD may be cleared when:

```text
NORMALIZED_CAPABILITY_REGISTRY = MR_FROZEN
P1_P2_DISPOSITION = MR_FROZEN
AUTHORIZED_PRE_UI_P1_P2_PACKAGES = CLOSED
REFRESHED_ACTIVE_CAPABILITY_BASELINE = PUBLISHED
UR_FUNCTION_MAP_RECONCILIATION_INPUT = READY
```

Manual prose is not a gate.
