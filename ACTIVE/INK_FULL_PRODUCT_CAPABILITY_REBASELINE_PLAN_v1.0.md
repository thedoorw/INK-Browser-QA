# INK Full Product Capability Rebaseline & Preservation Plan v1.0

STATUS: `CURRENT / MR AUTHORITY / UI-BLOCKING / DEVELOPMENT BASIS`

DATE: 2026-09-26

TASK: `INK-FULL-CAPABILITY-REBASELINE-001`

BASELINE_MAIN_AT_AUDIT_START: `387064f20906f19661acc16d1eeb1154f462b8e4`

OWNER: `MR / MAIN REVIEW`

UI STATUS: `HOLD — NO UI IMPLEMENTATION UNTIL THIS TASK CLOSES AND UR RECONCILES`

RUNTIME STATUS: `HOLD — NO REBASELINE RUNTIME UNTIL ALL EXISTING INK CAPABILITIES ARE RESTORED`

---

## 1. Purpose

This document is the authoritative development basis for correcting the incomplete INK capability baseline before the Photoshop-aligned final UI rebuild resumes.

The user-defined product direction is preserved in GitHub SSOT:

> 「當初設計想結合PS、ILLUSTRATOR、手繪 三種功能」

INK must therefore be treated as one integrated creative workstation combining:

```text
Raster / Image editing
+ Vector / Illustrator-class structure
+ Hand drawing / Stylus / Natural Media
+ INK-native USER × CHAT collaboration
```

The previous:

```text
NAMED_TOOLS = 22
BOUNDED_EDIT_OPERATIONS = 34
```

is a valid CHAT public/control surface snapshot, but it is **not** the complete INK product capability inventory.

Hard correction:

```text
INK PRODUCT CAPABILITY != 22 tools + 34 operations
22 tools / 34 operations = CHAT PUBLIC SURFACE SUBSET
```

No capability may be removed, hidden from UI planning, or treated as nonexistent merely because it is absent from the CHAT operation registry.

---

## 2. Preservation evidence

Original product source baseline:

- archive: `INK_v1.6.5_RC_MAIN.zip`
- SHA256: `59d43a9650f4de20863e21723344b0fbf4307d5cbdb4a1a402929008d2f9e97d`
- original imported `product/source/` files inspected: **198**
- current-main `product/source/` files at audit start: **252**
- original product files absent from current main: **0**
- original product files byte-identical: **174**
- original product files later modified/integrated: **24**
- additional product files added later: **54**

Interpretation:

```text
SOURCE PRESERVATION = currently encouraging
CAPABILITY AUTHORITY / UI INVENTORY = incomplete and must be rebuilt
MODIFIED ORIGINAL FILES = require behavioral regression confirmation
```

Original product-boundary evidence already identified these product-core candidates:

- Drawing / Stylus
- Vector
- Raster / Image
- Natural Media
- Document / History
- Render / Export
- Material
- Recompute
- basic Program Import
- UI shell

Source:
`ARCHIVE/original-import-1.6.5/INK_Product_Boundary_v0.1.md`

---

## 3. Mandatory decision rules

### 3.1 Preserve by default

Any capability implemented in current main or preserved original product source is presumed **KEEP** unless an explicit, evidence-backed `RETIRED` decision exists.

Absence from a later Connector / CHAT list is not retirement evidence.

### 3.2 Reconcile before rebuild

If a capability already exists, development must first reuse and reconcile the existing INK authority. Do not reimplement it merely to fit a new UI.

### 3.3 CHAT exposure is a separate axis

Every capability must be classified separately by:

1. Product/Core existence
2. Human-facing UI exposure
3. History/Undo participation
4. Revision/Provenance participation where applicable
5. CHAT read/control exposure where useful
6. QA evidence
7. Runtime evidence

### 3.4 Photoshop is a maturity comparator, not a cloning mandate

Photoshop comparison is used to discover mature image-editor capability gaps. INK must not copy every Photoshop feature by default.

Classifications:

- `P0 PRESERVE` — existing INK capability; must not be lost.
- `P0 RECONCILE` — existing capability but authority/UI/History/CHAT wiring is incomplete.
- `P1 MATURE-PLATFORM GAP` — high-value missing ability for INK's PS + Illustrator + hand-drawing direction.
- `P2 EXPANSION` — valuable later capability.
- `ADAPTER` — better supplied through optional AI/external adapter than native drawing core.
- `OUTSIDE CURRENT CORE` — not required for present INK direction.

### 3.5 Restore-all-before-first-Runtime — USER hard gate

The first execution priority is **not** Photoshop gap expansion and **not** UI reconstruction.

It is:

```text
RECOVER FULL EXISTING INK INVENTORY
→ RESTORE / RECONCILE EVERY EXISTING P0 CAPABILITY
→ COMPLETE PRE-RUNTIME SELF-CHECK
→ ONLY THEN RUN THE FIRST REBASELINE INTEGRATED RUNTIME
```

For this task, "all original/existing INK capabilities restored" means every capability in Section 4 has been dispositioned and every `P0 PRESERVE` / `P0 RECONCILE` item is present in current product source at its accepted historical/current scope, wired to the native product authority, save/load-safe, History-safe when mutating, and covered by focused QA appropriate to that capability.

A historically partial capability may remain partial for the first Runtime only when:
- the preserved historical/current partial scope is explicitly documented;
- no existing supported behavior is lost;
- unfinished expansion is classified separately as P1/P2.

Before this gate passes:

```text
NEW_REBASELINE_RUNTIME = PROHIBITED
INTEGRATED_BROWSER_RUNTIME = PROHIBITED
RUNTIME_QUEUE_SUBMISSION = PROHIBITED
P1 / P2 NEW CAPABILITY IMPLEMENTATION = PROHIBITED
FINAL UI IMPLEMENTATION = PROHIBITED
```

Allowed before first Runtime:
- source inventory and diff work;
- implementation/restoration of existing P0 capabilities;
- static inspection;
- unit/focused non-integrated QA;
- History/save-load/schema checks needed to establish restoration readiness.

Previous historical Runtime evidence remains evidence only and does not satisfy this new first-Runtime gate.

### 3.6 No UI restart before rebaseline closure

UR/UI DEV remains on HOLD until:

```text
FULL PRODUCT INVENTORY = COMPLETE
ALL EXISTING P0 CAPABILITIES RESTORED = PASS
FIRST REBASELINE RUNTIME = PASS
P1 GAP DISPOSITION = RECORDED
REFRESHED ACTIVE CAPABILITY BASELINE = PUBLISHED
UR FUNCTION MAP RECONCILIATION = PASS
```

---

# 4. Existing INK full-product inventory — preservation register

The following capability families were found in current main source, UI wiring and/or current QA and must be carried into the refreshed product baseline.

| Capability family | Evidence/current state | Required disposition |
|---|---|---|
| Document / project | .ink save/open, migration, integrity, stable IDs | P0 PRESERVE |
| Pages | add, duplicate, delete, switch, rename | P0 PRESERVE |
| Layers | add, duplicate, delete, drag reorder, opacity, visibility/lock foundations | P0 PRESERVE |
| Creation/Layout workspaces | dual spaces with separate cameras | P0 PRESERVE |
| Artboard / print | presets, orientation, PPI, bleed, safe area, crop marks, print | P0 PRESERVE |
| Canvas navigation | pan, zoom, rotate, fit, infinite creation space | P0 PRESERVE |
| Selection | click, multi, marquee, lasso, contain/intersect | P0 PRESERVE |
| Smart guides / snapping | smart edge/center snapping, grid snap, angle snap | P0 PRESERVE |
| Align / distribute | left/center/right/top/middle/bottom + distribute X/Y | P0 PRESERVE — omitted by old baseline |
| Pen / vector Path | Bézier anchors, handles, node editing, open/close | P0 PRESERVE |
| Shapes | line, arrow, rectangle, ellipse, triangle and path primitives | P0 PRESERVE |
| Boolean | union, difference, intersection, xor, divide | P0 PRESERVE |
| Transform | move, resize, scale, rotate, aspect lock | P0 PRESERVE |
| Non-destructive deformation | reversible deformation / foreshortening / perspective-like parameters | P0 PRESERVE |
| Group / ungroup | structural grouping | P0 PRESERVE |
| Frame / hierarchy | Frame, nested hierarchy, reparent | P0 PRESERVE |
| Repeat / parametric | radial, mirror, grid, linear foundations, expand | P0 PRESERVE |
| Components | definition, instance, override, detach, duplicate, repair | P0 PRESERVE |
| Auto/Flex layout | horizontal/vertical, gap, padding, alignment, hug/fill, constraints | P0 PRESERVE |
| Text | editable text, family, size, line-height, color | P0 PRESERVE |
| SVG | structured editable import/export | P0 PRESERVE |
| Raster / Image objects | image import, raster layer model, crop/resize core | P0 PRESERVE — omitted by old baseline |
| Raster/vector masks | layer/clipping/group masks, invert, feather, expand/contract | P0 RECONCILE |
| Adjustment stack | brightness/contrast, levels, curves, hue/saturation, color balance, gradient map | P0 RECONCILE — omitted by old baseline |
| Filter stack | Gaussian blur, sharpen, high pass, edge detection, noise/grain, texture overlay | P0 RECONCILE — omitted by old baseline |
| Blend modes | multiply, screen, overlay, soft/hard light, darken/lighten, dodge/burn, difference/exclusion, hue/saturation/color/luminosity etc. | P0 PRESERVE |
| Layer effects | drop/inner shadow, outer glow, color overlay, stroke data model; rendering incomplete | P0 RECONCILE / PARTIAL |
| Reusable raster source | reusable source + instances + non-destructive stacks | P0 PRESERVE |
| Drawing tools | Pen, Pencil, Marker, Brush, Airbrush, Eraser | P0 PRESERVE — omitted by old baseline |
| Brush engine | built-in brush classes/presets, brush package import/export | P0 PRESERVE |
| Natural media | watercolor, oil-like, dry brush, soft/opaque paint | P0 PRESERVE |
| Brush dynamics | pressure, tilt, velocity, direction, flow, grain, texture, wetness, bristle, scatter etc. | P0 PRESERVE |
| Blender / Smudge | pigment mixing / transport behavior | P0 PRESERVE |
| Stroke editing | nodes, handles, segments, local erase/style | P0 PRESERVE |
| Stroke Session | record, pause/resume, replay, brush replacement, local replay | P0 PRESERVE |
| Stylus | pressure, tilt, azimuth/altitude, coalesced input | P0 PRESERVE |
| Device calibration | pressure curve, profile save/import/export, palm preference | P0 PRESERVE |
| Paper / media | absorbency, roughness, fiber, sizing, granulation, grid/ruled/dots | P0 PRESERVE |
| Material system | templates, instances, parameters, detach, repaint | P0 PRESERVE |
| Reference import | local reference image handoff | P0 PRESERVE |
| Extraction / vectorization | raster → contours/paths, mask-assisted extraction | P0 PRESERVE |
| Structure reconstruction | radial evidence, prototype/repeat reconstruction | P0 PRESERVE |
| History | scoped History, Undo/Redo | P0 PRESERVE |
| Revision | capture/list/restore | P0 PRESERVE |
| Provenance | source → operation → revision lineage | P0 PRESERVE |
| Compare | before/after and structural comparison | P0 PRESERVE |
| Storage | IndexedDB → localStorage → memory fallback | P0 PRESERVE |
| Recovery | previous save, checkpoints, fingerprint verification | P0 PRESERVE |
| Renderer | Canvas2D + WebGL2 | P0 PRESERVE |
| Natural-media renderer | multi-channel ink/media rendering | P0 PRESERVE |
| GPU / large-canvas infra | GPU budget, Persistent Tile Atlas, dirty regions | P0 PRESERVE |
| High-resolution export | tiled/resumable export, worker PNG | P0 PRESERVE |
| Output | PNG, SVG, PDF, Print | P0 PRESERVE |
| Recompute | dependency graph / local recompute | P0 PRESERVE |
| Recipe / automation | Recipe engine, replay, breakpoint, rollback | P0 PRESERVE |
| Program Import | Photoshop / Illustrator / Inkscape / JSON analysis/translation framework | P0 PRESERVE |
| CHAT control | grounding, proposal → approval → execution, Creative Plan | P0 PRESERVE |
| Semantic grounding | object / region relationships | P0 PRESERVE |
| Creative Library | component/material/recipe/structure search/inspect | P0 PRESERVE |
| Creative Memory / Research | read-only advisory | P0 PRESERVE |
| FLORA specialization | geometry / painting / recipe runtimes | PRESERVE BOUNDARY; not a reason to redefine generic Core |

---

# 5. Photoshop capability comparison — development gap register

External comparator: current Photoshop desktop capability families as reviewed on 2026-09-26 using Adobe official documentation.

This table is a development comparator, not a requirement that every row be implemented.

| Photoshop capability family | INK current state | Development classification |
|---|---|---|
| Layers / groups / hierarchy | present | P0 PRESERVE |
| Smart Objects | reusable source + Components provide partial analogous structure | P1 REVIEW / PARTIAL |
| Marquee / Lasso | present | P0 PRESERVE |
| Polygonal / Magnetic Lasso | no full equivalent confirmed | P1 MATURE-PLATFORM GAP |
| Quick Selection | no pixel-aware equivalent | P1 MATURE-PLATFORM GAP |
| Magic Wand | absent | P1 MATURE-PLATFORM GAP |
| Object Selection | semantic grounding is not pixel segmentation | P1 MATURE-PLATFORM GAP |
| Layer / vector / raster masks | present | P0 RECONCILE |
| Select and Mask edge refinement | incomplete | P1 MATURE-PLATFORM GAP |
| Crop / image resize | core exists; workstation exposure incomplete | P0 RECONCILE |
| Move / scale / rotate | present | P0 PRESERVE |
| Skew / Distort / Perspective / Warp | partial via deformation/transform | P1 REVIEW / PARTIAL |
| Puppet Warp | absent | P2 EXPANSION |
| Brush / Pencil | strong existing implementation | P0 PRESERVE |
| Mixer Brush | INK natural-media/blender provides different but strong model | P0 PRESERVE |
| Airbrush | present | P0 PRESERVE |
| Smudge | present | P0 PRESERVE |
| Eraser | present | P0 PRESERVE |
| History Brush / Art History Brush | absent | P2 EXPANSION |
| Color Replacement Brush | absent | P2 EXPANSION |
| Clone Stamp / Pattern Stamp | absent | P1 MATURE-PLATFORM GAP |
| Gradient Tool | no complete general tool | P1 MATURE-PLATFORM GAP |
| Paint Bucket / tolerance flood fill | no complete raster tool | P1 MATURE-PLATFORM GAP |
| Eyedropper / Color Sampler | partial color UI; professional sampling incomplete | P1 REVIEW / PARTIAL |
| Healing / Spot Healing / Patch | absent | P1 MATURE-PLATFORM GAP |
| Remove / content-aware repair | absent | P1 MATURE-PLATFORM GAP / possible ADAPTER |
| Dodge / Burn / Sponge | no local raster tools | P1 MATURE-PLATFORM GAP |
| Local Blur / Sharpen tools | filters exist; local tools incomplete | P1 REVIEW / PARTIAL |
| Vector Pen / Paths | strong | P0 PRESERVE |
| Shapes | present | P0 PRESERVE |
| Boolean geometry | present | P0 PRESERVE |
| Repeat / Parametric structure | INK differentiator | P0 PRESERVE |
| Basic Text | present | P0 PRESERVE |
| Paragraph / Vertical Type | incomplete | P1 MATURE-PLATFORM GAP |
| Text on Path | absent | P1 MATURE-PLATFORM GAP |
| Advanced glyph typography | absent | P2 EXPANSION |
| Gradient / Pattern fills | incomplete | P1 MATURE-PLATFORM GAP |
| Adjustment Layers | non-destructive architecture present; 6 adjustments | P0 RECONCILE + P1 EXPAND |
| Filter Stack | non-destructive architecture present; 6 filters | P0 RECONCILE + P1 EXPAND |
| Filter Gallery breadth | incomplete | P1 MATURE-PLATFORM GAP |
| Blur Gallery | absent | P2 EXPANSION |
| Liquify | absent | P1 MATURE-PLATFORM GAP |
| Lens correction | absent | P2 EXPANSION |
| Smart Filters | INK filter stack is partially analogous | P0 RECONCILE |
| Neural Filters | absent native equivalent | ADAPTER |
| Layer Styles | model exists, renderer partial | P0 RECONCILE |
| Blend Modes | broad set present | P0 PRESERVE |
| Guides / Grid | grid + transient smart guides present | P0 PRESERVE / P1 EXPAND |
| Persistent ruler guides | incomplete | P1 MATURE-PLATFORM GAP |
| Equal-distance smart snapping | incomplete | P1 MATURE-PLATFORM GAP |
| Ruler / measurement | incomplete | P1 MATURE-PLATFORM GAP |
| History | present | P0 PRESERVE |
| Snapshots | raster snapshot + Revision | P0 PRESERVE |
| Revision / Provenance | INK-specific stronger model | P0 PRESERVE |
| 8/16/32-bit image workflow | no full equivalent confirmed | P1 STRATEGIC IMAGE GAP |
| RGB / CMYK / Lab / Multichannel | no full color-mode system confirmed | P1 STRATEGIC PRINT GAP |
| ICC color management | export mainly sRGB | P1 STRATEGIC PRINT GAP |
| Channels / alpha / spot channels | no full Channels subsystem | P1 STRATEGIC IMAGE GAP |
| Camera Raw | absent | P2 / ADAPTER |
| Photomerge / panorama | absent | P2 EXPANSION |
| Actions | INK Recipe/Program/CHAT provides different automation model | P0 PRESERVE / REVIEW INTEROP |
| Batch / Image Processor | no general workstation batch flow | P2 EXPANSION |
| Generative Fill / Expand / Harmonize / Upscale | no equivalent native pixel-generation authority | ADAPTER |
| Animation / Timeline / Video | absent | OUTSIDE CURRENT CORE unless future use case |
| PSD/PSB/TIFF/RAW/EXR breadth | limited | P1/P2 FORMAT GAP |
| PNG / SVG / PDF / Print | present | P0 PRESERVE |
| Plugin ecosystem | Program Import != full plugin SDK | P2 EXPANSION |

---

## 6. Adobe official reference set

The Photoshop comparison above must be refreshed when Adobe materially changes its product.

Primary official references used for the 2026-09-26 comparison:

- Selection tools overview:
  https://helpx.adobe.com/photoshop/desktop/make-selections/get-started-selections/selection-tools-overview.html
- Painting tools overview:
  https://helpx.adobe.com/photoshop/desktop/apply-painting-techniques/fill-objects-selections-layers/painting-tools-overview.html
- Retouch tools overview:
  https://helpx.adobe.com/photoshop/desktop/repair-retouch/remove-objects-fill-space/retouch-tools-overview.html
- Adjustment layer options:
  https://helpx.adobe.com/photoshop/desktop/create-manage-layers/color-adjustment-fill-layers/adjustment-layers-options.html
- Filter Gallery:
  https://helpx.adobe.com/photoshop/desktop/effects-filters/get-started-with-filters/filter-gallery.html
- Smart Objects:
  https://helpx.adobe.com/photoshop/desktop/create-manage-layers/smart-objects/smart-objects-overview-and-benefits.html
- Photoshop file formats:
  https://helpx.adobe.com/photoshop/desktop/save-and-export/export-files-to-different-formats/photoshop-file-formats-overview.html
- Generative AI features:
  https://helpx.adobe.com/photoshop/desktop/generative-ai/generative-ai-features-overview.html
- Photoshop desktop/web feature comparison:
  https://helpx.adobe.com/photoshop/web/get-set-up/learn-the-basics/compare-photoshop-web-and-desktop-features.html

---

# 7. Development execution order

The sequence below is mandatory. Phases may not be reordered merely to obtain earlier Runtime evidence.

## Phase A — Full product inventory lock

Goal: prove what INK already owns before any remediation.

Required:

- enumerate all current generic product modules under `product/source/src/`;
- map human UI wiring;
- map QA tests/evidence;
- compare against original imported product source;
- identify all modified original product files requiring regression;
- classify specialization vs generic Core;
- prohibit deletion-by-omission.

Deliverable:

`FULL_PRODUCT_INVENTORY = COMPLETE`

## Phase B — Restore every existing P0 capability before any Runtime

This is the first implementation phase and the USER-mandated priority.

First remediation targets:

1. Brush / Paint / Natural Media / Stylus
2. Raster / Image
3. Adjustment Stack
4. Filter Stack
5. Masks / Blend Modes / Layer Effects
6. Align / Distribute / Smart Guides
7. Pages / Layers
8. Storage / Recovery
9. Render / large-canvas / export
10. Material / Recompute / Program Import

For each existing capability:

```text
Core/source exists?
→ native product wiring restored?
→ historically/currently human-facing route still reachable?
→ mutating operation History-safe?
→ save/load integrity safe?
→ Revision/Provenance scope classified where applicable?
→ focused QA passes?
→ historical/current supported scope preserved?
```

CHAT expansion is not required merely to unlock the first Runtime unless that CHAT route was already an accepted existing capability. New CHAT exposure belongs later.

Existing capability is repaired/reconciled; it is not rewritten merely because Connector authority is newer.

Deliverable:

`ALL_EXISTING_P0_CAPABILITIES_RESTORED = PASS`

## Phase C — Pre-Runtime restoration gate

Before the first rebaseline Runtime, MR must complete the dedicated pre-Runtime checklist in Section 8.

Required state:

```text
FULL_PRODUCT_INVENTORY = COMPLETE
ALL_SECTION_4_ROWS_CLASSIFIED = PASS
ALL_P0_PRESERVE_RESTORED = PASS
ALL_P0_RECONCILE_RESTORED_TO_ACCEPTED_SCOPE = PASS
FOCUSED_NON_RUNTIME_QA = PASS
SAVE_LOAD_INTEGRITY = PASS
HISTORY_SAFETY = PASS
UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0
```

If any item fails, Runtime remains prohibited.

## Phase D — First rebaseline integrated Runtime

This is the **first permitted integrated Runtime** for `INK-FULL-CAPABILITY-REBASELINE-001`.

It must validate the fully restored existing-capability candidate as one product before any P1/P2 expansion work begins.

Required evidence:

- exact tested SHA;
- integrated browser Runtime result;
- capability-family smoke coverage sufficient to prove restored product wiring;
- no regression in Document / History / save-load;
- no regression in Drawing / Raster / Vector / Natural Media / Render / Export;
- retained CHAT/Connector closure does not break the restored native product.

Failure returns the task to Phase B/C. It does not authorize bypassing a missing capability.

## Phase E — P1 mature-platform gap decisions

P1 candidates must receive one explicit decision:

- IMPLEMENT NOW
- IMPLEMENT AFTER UI BASELINE
- ADAPTER
- DEFER WITH REASON
- OUTSIDE PRODUCT DIRECTION

No P1 row may remain silently unclassified.

Priority review groups:

- pixel-aware selection / edge refinement;
- retouch: clone/heal/patch/remove;
- gradient / pattern / bucket / sampling;
- richer filters and adjustments;
- complete layer effects;
- local raster tools;
- persistent rulers/guides/equal-distance snapping;
- advanced typography;
- high-bit-depth / channels / color mode / ICC if professional print remains a target.

## Phase F — CHAT authority reconciliation

After native product authority is confirmed:

- add CHAT discovery/read/control only where useful;
- mutating CHAT operations remain proposal → approval → execution;
- do not duplicate Core;
- every newly exposed mutation must participate in existing History;
- Preview/Revision/Provenance requirements must be explicit.

## Phase G — Republish capability truth

Replace the incomplete interpretation of:

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`

with a full-product model that separates:

```text
Product Capability Inventory
UI Exposure
CHAT Named Tools
CHAT Mutation Operations
QA / Runtime Maturity
```

22/34 counts may remain as CHAT-surface metrics only.

## Phase H — UR/UI handoff

Only after MR closes the technical rebaseline:

- UR diffs the refreshed product inventory against Function Placement Map;
- restored existing capabilities must be placed;
- accepted new P1 capabilities must be placed when implementation scope requires;
- AI Completion Checklist must use the full-product inventory;
- `UNCLASSIFIED_FUNCTIONS = 0`;
- only then may UI HOLD be cleared.

---

# 8. Completion self-check checklist

This checklist is mandatory before MR declares `INK-FULL-CAPABILITY-REBASELINE-001 = CLOSED`.

## A. Source preservation

- [ ] Original product-source inventory rechecked against pinned current candidate.
- [ ] No original product capability was removed solely because it was absent from Connector/CHAT registries.
- [ ] Every modified original product file has regression coverage or an explicit bounded exception.
- [ ] Generic Core and FLORA/specialization boundaries are explicitly classified.

## B. Existing capability preservation

- [ ] Drawing tools preserved: Pen / Pencil / Marker / Brush / Airbrush / Eraser.
- [ ] Natural Media preserved.
- [ ] Brush dynamics and stylus calibration preserved.
- [ ] Raster/Image capability preserved.
- [ ] Masks preserved.
- [ ] Adjustment stack preserved.
- [ ] Filter stack preserved.
- [ ] Blend Modes preserved.
- [ ] Layer Effects existing scope reconciled and partial status is explicit.
- [ ] Layer/Page management preserved.
- [ ] Align/Distribute preserved.
- [ ] Smart snapping/guides preserved.
- [ ] Vector/Path/Boolean/Transform/Deformation preserved.
- [ ] Group/Frame/Repeat/Components/Layout preserved.
- [ ] Text preserved.
- [ ] Material system preserved.
- [ ] Reference/Extraction preserved.
- [ ] Storage/Recovery preserved.
- [ ] Canvas2D/WebGL renderer preserved.
- [ ] GPU/tile/high-resolution export preserved.
- [ ] PNG/SVG/PDF/Print preserved.
- [ ] Recipe/Automation preserved.
- [ ] Program Import preserved.
- [ ] History preserved.
- [ ] Revision/Provenance preserved.
- [ ] CHAT/Creative Plan preserved.
- [ ] Creative Library/Memory/Research accepted scope preserved.

## C. Authority reconciliation

For every mutating generic product capability retained in the final workstation:

- [ ] Native Core authority identified.
- [ ] Human UI route identified or deliberately headless with reason.
- [ ] History participation verified.
- [ ] Save/load integrity verified.
- [ ] Revision/Provenance participation classified.
- [ ] CHAT exposure classified as YES / NO / DEFER.
- [ ] No second competing mutation authority introduced.

## D. Pre-Runtime restoration gate — mandatory before first integrated Runtime

- [ ] Full product inventory is complete.
- [ ] Every Section 4 capability row has an explicit current implementation state.
- [ ] Every `P0 PRESERVE` capability is restored and wired at its accepted historical/current scope.
- [ ] Every `P0 RECONCILE` capability is restored to its accepted historical/current scope; later expansion is split out.
- [ ] Drawing / Stylus / Natural Media restoration is complete.
- [ ] Raster / Image / Mask / Adjustment / Filter / Blend restoration is complete.
- [ ] Vector / Path / Boolean / Transform / Deformation restoration is complete.
- [ ] Page / Layer / Selection / Align / Snap restoration is complete.
- [ ] Document / History / Storage / Recovery restoration is complete.
- [ ] Render / GPU / tile / export restoration is complete.
- [ ] Material / Recompute / Recipe / Program Import restoration is complete.
- [ ] Existing CHAT / Revision / Provenance / Library accepted scope remains intact.
- [ ] Focused unit/non-integrated QA for restored families passes.
- [ ] Save/load integrity checks pass.
- [ ] History participation for restored mutating capabilities passes.
- [ ] No known existing capability is missing solely because it was absent from 22/34.
- [ ] `UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0`.
- [ ] MR records `FIRST_REBASELINE_RUNTIME_AUTHORIZED = YES`.

Until every checkbox above passes: **do not run integrated Runtime**.

## E. First rebaseline Runtime

- [ ] First rebaseline Runtime was not started before Section D passed.
- [ ] Exact tested SHA recorded.
- [ ] Integrated browser Runtime passes.
- [ ] Drawing/paint/stylus capability smoke passes.
- [ ] Raster/image/filter/adjustment/mask capability smoke passes.
- [ ] Vector/path/geometry capability smoke passes.
- [ ] Page/layer/selection/transform capability smoke passes.
- [ ] Storage/recovery/save-load capability smoke passes.
- [ ] Render/export capability smoke passes.
- [ ] Existing CHAT/Connector functionality remains non-regressed.
- [ ] Runtime failure, if any, returned the task to restoration instead of skipping a capability.

## F. Photoshop maturity gap review

- [ ] Every row in Section 5 has final disposition.
- [ ] All `P1 MATURE-PLATFORM GAP` rows have an implementation/defer/adapter decision.
- [ ] Image-selection gaps reviewed.
- [ ] Retouch gaps reviewed.
- [ ] Gradient/fill/sampling gaps reviewed.
- [ ] Filter/Adjustment breadth reviewed.
- [ ] Layer Effects completion reviewed.
- [ ] Typography gaps reviewed.
- [ ] Ruler/Guide/Snap gaps reviewed.
- [ ] Color mode / ICC / channels / bit-depth strategy explicitly decided.
- [ ] Format breadth strategy explicitly decided.
- [ ] AI-generation features classified as native vs adapter; no accidental duplication.

## G. Refreshed baseline

- [ ] `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md` no longer treats 22/34 as total product capability.
- [ ] Full Product Capability Inventory is present.
- [ ] UI exposure status is present.
- [ ] CHAT named-tool status is present.
- [ ] CHAT mutating-operation status is present.
- [ ] QA/Runtime maturity status is present.
- [ ] Explicit retired/deferred list is present.
- [ ] Existing capabilities cannot disappear by omission.

## H. Post-Runtime QA / maturity closure

- [ ] Existing professional drawing tests pass.
- [ ] Existing pro creative image/filter/brush tests pass.
- [ ] Storage/recovery tests pass.
- [ ] Renderer/natural-media tests pass.
- [ ] Program-import tests pass.
- [ ] No regression in CHAT closure tests.
- [ ] No regression in Document/History/Revision.
- [ ] Any P1/P2 implementation added after the first Runtime has its own focused QA.
- [ ] Final promoted candidate receives exact-SHA Runtime evidence after all authorized post-Runtime work.

## I. UR release gate

- [ ] MR publishes refreshed capability authority.
- [ ] UR diffs full inventory against Function Placement Map.
- [ ] Existing restored capabilities have UI placement.
- [ ] UI Completion Checklist covers full product inventory.
- [ ] `UNCLASSIFIED_FUNCTIONS = 0`.
- [ ] USER/MR capability reopen is explicitly closed.
- [ ] Only then: `UI_HOLD = CLEARED`.

---

## 9. Closure definition

This task is not complete merely because a new list was written.

Closure requires:

```text
existing INK capability truth recovered
+ ALL existing P0 capabilities restored BEFORE first rebaseline Runtime
+ first rebaseline Runtime passes on the fully restored existing-capability candidate
+ mature-platform gaps explicitly dispositioned
+ refreshed full-product baseline published
+ final exact-SHA QA/Runtime evidence
+ UR full-inventory reconciliation ready
```

Until then:

`NO FINAL UI IMPLEMENTATION / NO FINAL FUNCTION LOCK`
