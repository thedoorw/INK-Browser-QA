# INK Current Capability Baseline

STATUS: `CURRENT / REFRESHED FULL-PRODUCT AUTHORITY / MR`

DATE: 2026-09-27

PROGRAM: `INK-FULL-CAPABILITY-REBASELINE-001`

SOURCE_BASELINE_MAIN: `d3f73cdcc1f4e902f90e7eb3973cc64764fb05b3`

FIRST_REBASELINE_RUNTIME_TARGET: `f911f777f770cbe290e290c4b0cbc3692b36641e`

FIRST_REBASELINE_RUNTIME: `PASS`

P0_PROMOTION: `CLOSED`

UI_STATUS: `HOLD — UNTIL ALL NATIVE P1 A-H CLOSE, ONE INTEGRATED RUNTIME PASSES, AND UR RECONCILES THIS BASELINE`

---

## 1. Purpose

This document is the authoritative current answer to:

> What capabilities does INK currently own, and what is their technical/product status?

It replaces the earlier incomplete interpretation in which the CHAT public surface or the 61-row P0 restoration ledger could be mistaken for the whole product.

Hard correction:

```text
INK PRODUCT CAPABILITY != 22 named CHAT tools + 34 bounded edit operations
INK PRODUCT CAPABILITY != only the 61 Section-4 P0 restoration rows
```

The 61 rows remain the preserved existing-capability backbone. Full current-source census adds three explicit anti-omission families and normalizes the product into the model below.

---

## 2. Current counts

```text
CANONICAL_CAPABILITY_FAMILIES = 64

  PRESERVED_SECTION4_BACKBONE = 61
  ANTI_OMISSION_ADDITIONS = 3
    C62 Asset lifecycle
    C63 PWA / update management
    C64 Product health / diagnostics

PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
EXPLICIT_PARTIAL_BOUNDED_ITEMS = 8

CHAT_PUBLIC_SURFACE_NAMED_TOOLS = 22
CHAT_PUBLIC_SURFACE_BOUNDED_EDIT_OPERATIONS = 34
CHAT_PUBLIC_SURFACE_IS_NOT_FULL_PRODUCT_CAPABILITY = TRUE
```

Counting policy:

- Product Atomic = one user/CHAT/Specialist-recognizable product behavior after aliases are deduplicated.
- Platform Contract = internal support behavior preserved for product integrity but not counted as a user feature.
- Enumerated options such as individual Blend Mode names or import-format identifiers remain vocabulary under the owning capability unless they are materially separate tools/algorithms.
- Distinct adjustments, filters and drawing tools are separate atomics because they are separate creative operations.
- One Core capability is counted once even when Human UI, CHAT, Recipe and Specialist all expose it.

Detailed normalization evidence:
`working/INK_CAPABILITY_REGISTRY_v0.1.md`

Raw source census:
`working/INK_CAPABILITY_CENSUS_v0.1.md`

---

## 3. Current full-product capability inventory

| ID | Family | Class | Atomic count | Normalized atomic capabilities |
|---|---|---:|---:|---|
| C01 | Document / project | EDITOR | 7 | New document; Open .ink document; Save .ink document; Autosave; Serialize/deserialize INK document; Document migration; Document integrity validation |
| C02 | Pages | EDITOR | 5 | Add page; Duplicate page; Delete page; Switch active page; Rename page |
| C03 | Layers | EDITOR | 8 | Add layer; Duplicate layer; Delete layer; Drag/reorder layer; Layer opacity; Layer visibility; Layer lock; Select active layer |
| C04 | Creation / Layout workspaces | EDITOR | 8 | Creation workspace; Layout workspace; Switch workspace; Independent creation camera; Independent layout camera; Layout viewport; First-visit fit behavior; Shared document content across spaces |
| C05 | Artboard / print | EDITOR | 9 | A4 artboard preset; Portrait/landscape orientation; PPI selection; Bleed; Safe margin; Center guide; Content clipping flag; Fit artboard/layout; Browser print |
| C06 | Canvas navigation | EDITOR | 6 | Pan; Zoom; Rotate view; Fit content; Fit artboard/layout; Reset view |
| C07 | Selection | EDITOR | 7 | Topmost click selection; Shift multi-select/toggle; Marquee contain; Marquee intersect; Lasso selection; Select all visible/unlocked; Selection-aware context |
| C08 | Smart guides / snapping | EDITOR | 5 | Smart edge snapping; Smart center snapping; Grid snapping; Angle snapping; Temporary smart-snap bypass |
| C09 | Align / distribute | EDITOR | 8 | Align left; Align center X; Align right; Align top; Align center Y; Align bottom; Distribute X; Distribute Y |
| C10 | Pen / vector Path | VECTOR | 11 | Create editable Path; Add anchor; Delete anchor; Move anchor; Corner node mode; Smooth node mode; Symmetric node mode; Move incoming handle; Move outgoing handle; Open/close subpath; Pen Path session |
| C11 | Shapes | VECTOR | 8 | Line; Arrow; Rectangle; Ellipse; Circle; Triangle; Polygon; Polyline |
| C12 | Boolean | VECTOR | 5 | Union; Difference; Intersection; XOR; Divide |
| C13 | Transform | EDITOR | 9 | Move/translate; Resize; Uniform scale; Non-uniform scale; Rotate; Aspect-ratio lock; Keyboard nudge; Fast keyboard nudge; Numeric transform |
| C14 | Non-destructive deformation | VECTOR | 3 | Apply reversible deformation; Reset deformation; Inspect deformation state |
| C15 | Group / ungroup | EDITOR | 2 | Group; Ungroup |
| C16 | Frame / hierarchy | EDITOR | 5 | Create Frame; Nested hierarchy; Reparent object; Reparent to layer root; Hierarchy drag/direct structure |
| C17 | Repeat / parametric | VECTOR | 6 | Radial repeat; Mirror repeat; Grid repeat; Repeat count/parameters; Linked repeat instances; Expand repeat |
| C18 | Components | VECTOR | 7 | Register component; Create instance; Set override; Reset override; Detach instance; Duplicate definition; Repair component reference |
| C19 | Auto / Flex layout | VECTOR | 12 | Horizontal layout; Vertical layout; Gap; Padding; Alignment; Hug sizing; Fill sizing; Child constraints; Set frame layout; Remove frame layout; Set child layout item; Remove child layout item |
| C20 | Text | EDITOR | 6 | Create text; Edit text; Font family; Font size; Line height; Text color |
| C21 | SVG | VECTOR | 4 | Import SVG; Export SVG; Preserve editable vector structure; Normalize imported SVG IDs |
| C22 | Raster / Image objects | RASTER | 9 | Import image; Create raster layer; Raster layer group; Crop image; Resize image; Image histogram; Image snapshot; Before/after image-state compare; Layer manifest diagnostic export |
| C23 | Raster / vector masks | RASTER | 11 | Layer mask; Clipping mask; Group mask; Vector mask; Raster mask; Selection from alpha; Selection from Path; Invert mask; Feather mask; Expand mask; Contract mask |
| C24 | Adjustment stack | RASTER | 10 | Brightness/Contrast; Levels; Curves; Hue/Saturation; Color Balance; Gradient Map; Toggle adjustment; Reorder adjustment; Update adjustment; Remove adjustment |
| C25 | Filter stack | RASTER | 10 | Gaussian Blur; Sharpen; High Pass; Edge Detection; Noise/Grain; Texture Overlay; Toggle filter; Reorder filter; Update filter; Remove filter |
| C26 | Blend modes | RASTER | 1 | Blend-mode compositing |
| C27 | Layer effects | RASTER | 1 | Color Overlay rendering |
| C28 | Reusable raster source | RASTER | 3 | Create reusable raster source; Create raster-source instance; Instance non-destructive adjustment/filter stack |
| C29 | Drawing tools | DRAW | 6 | Pen drawing tool; Pencil; Marker; Brush; Airbrush; Eraser |
| C30 | Brush engine | DRAW | 7 | Brush preset selection; Brush preset registry; Import Brush Package; Export Brush Package; Persist/reload imported Brush Package; Replace brush on existing Stroke/Session; Drawing Workflow detect/import |
| C31 | Natural media | DRAW | 5 | Watercolor behavior; Oil-like behavior; Dry Brush; Soft/Opaque paint behavior; Natural-media render mode selection |
| C32 | Brush dynamics | DRAW | 14 | Pressure; Tilt; Velocity; Direction/orientation; Width; Taper; Flow; Wetness; Grain; Texture; Bristle; Scatter; Softness; Pigment/ink amount |
| C33 | Blender / Smudge | DRAW | 2 | Blender; Smudge |
| C34 | Stroke editing | DRAW | 9 | Simplify stroke; Set segment style; Clear segment style; Set node mode; Move Bézier handle; Insert node; Delete nodes; Split segment; Local circle erase |
| C35 | Stroke Session | DRAW | 15 | Create session; Record session; Pause session; Resume session; Checkpoint; Replay session; Select session strokes; Delete session strokes; Recolor session strokes; Set session stroke opacity; Replace session stroke brush; Transform session strokes; Session undo; Session redo; Export session |
| C36 | Stylus | INPUT | 10 | Pressure input; Tilt input; Altitude input; Azimuth input; Twist input; Coalesced events; Predicted preview events; Latency/sample diagnostics; Stylus test recording; Palm/contact filtering foundation |
| C37 | Device calibration | INPUT | 13 | Pressure minimum; Pressure maximum; Pressure gamma; Pressure smoothing; Tilt sensitivity; Tilt deadzone; Azimuth offset; Pressure Curve Editor; Select calibration profile; Save calibration profile; Reset calibration profile; Import calibration profile; Export calibration profile |
| C38 | Paper / media | DRAW | 11 | Paper type selection; Paper color; Grid size; Absorbency; Roughness; Fiber strength; Fiber angle; Sizing; Granulation; Deterministic paper seed; Texture visibility |
| C39 | Material system | VECTOR | 8 | Create material template; Update material template; Install material templates; Create material instance; Update material instance; Detach material instance; Apply material; Remove material |
| C40 | Reference import | COLLAB | 4 | Import local Reference; CHAT reference handoff; Decompose Reference into color/line; Preserve source Reference identity |
| C41 | Extraction / vectorization | COLLAB | 5 | Raster-to-contour extraction; Mask-assisted extraction; Contours-to-editable Paths; Normalize extracted Paths; Cancel extraction |
| C42 | Structure reconstruction | COLLAB | 7 | Radial evidence analysis; Sector mask; Prototype set; Radial reconstruction; Parametric descriptor; Resolve parametric parameters; Generate deterministic structure plan |
| C43 | History | HISTORY | 6 | Undo; Redo; History step list; Jump to history step; Configurable retention limit; Linear redo invalidation after new edit |
| C44 | Revision | HISTORY | 5 | Capture Revision; List Revisions; Inspect Revision; Restore Revision; Compare Revisions |
| C45 | Provenance | HISTORY | 3 | Build provenance graph; Source→operation→Revision lineage; CHAT provenance readout |
| C46 | Compare / Variant | HISTORY | 6 | Structural compare; Before/after preview; Split preview; Overlay preview; Difference preview; Variant descriptor |
| C47 | Storage | PLATFORM | 3 | IndexedDB primary storage; LocalStorage preference/fallback; Memory fallback |
| C48 | Recovery | PLATFORM | 5 | Recover previous valid snapshot; Recover from checkpoints; Fingerprint verification; Corrupted-current recovery; Storage-envelope migration |
| C49 | Renderer | RENDER | 7 | Canvas2D renderer; WebGL2 renderer path; Automatic renderer fallback; Vector/object rendering; Raster/image rendering; Renderer cache invalidation; Renderer mode selection |
| C50 | Natural-media renderer | RENDER | 14 | Pigment amount channel; Pigment RGB channel; Water channel; Deposition channel; Paper field interaction; Directional diffusion; Paper absorption; Pigment movement; Sedimentation/deposition; Evaporation; Wet-edge compositing; Cross-stroke wet interaction; Canvas2D reference backend; WebGL2/MRT backend |
| C51 | GPU / large-canvas infrastructure | RENDER | 9 | GPU resource budget; LRU resource accounting; Dirty-region tracking; Tile-plan creation; Persistent Tile Atlas; Live Canvas tile renderer; Context-lost handling; Context-restore handling; GPU/tile diagnostics |
| C52 | High-resolution export | OUTPUT | 6 | Tiled export; Export checkpoint; Cancel export; Resume export; Worker PNG encoding; High-resolution export progress/state |
| C53 | Output | OUTPUT | 8 | PNG export; SVG export; PDF export; Browser print; Export scope; Export scale; Export PPI; Output handle inspect/release lifecycle |
| C54 | Recompute | AUTOMATION | 7 | Dependency relation add; Dependency relation remove; Parent dependency relation; Affected-scope analysis; Local recompute analysis; Local recompute execution; Recompute report |
| C55 | Recipe / automation | AUTOMATION | 17 | Recipe execute; Recipe replay; Recipe edit; Operation recording; Expression evaluation; Role mapping/schema; Condition control; Repeat-over control; Local replay; Resume; Breakpoint; Step-by-step; Rollback; Cancel; Deterministic replay; Replay diff; Recipe report |
| C56 | Program Import | AUTOMATION | 15 | Detect program format; Translate to canonical operations; Compile translated program; Trial run; Step run; Breakpoint; Safety mode; Issues/coverage preview; Before/after comparison; Save translated Recipe; Save import report; Attach import result to document; Reference package; Manual reference-run kit; External reference runner |
| C57 | CHAT control | COLLAB | 25 | Capability discovery; Grounded document context; Selection readout; Object inspection; Bounded edit proposal; Explicit approval; Execute approved edit; Cancel/reject proposal; Multi-step Creative Plan; Plan dependency ordering; Plan validation against current state; Preview; Capability description; Public Creative API; AI Document Bridge; Semantic target system; Approval policy; Security sandbox; Canonical executor; Audit log; Local JSON mode; External model mode; Transmission preview; Stale-preview invalidation; CHAT session/runtime management |
| C58 | Semantic grounding | COLLAB | 8 | Semantic role inference; Semantic query from text; Resolve semantic targets; Semantic-region grounding; Region relationship evaluation; Relationship graph; Semantic document migration; Semantic document validation |
| C59 | Creative Library | COLLAB | 7 | Search Creative Library; Filter by family; Inspect library item; Stable library reference; Reuse component through native authority; Reuse material through native authority; Reuse parametric/reference-derived structure through native authority |
| C60 | Creative Memory / Research | COLLAB | 9 | Query Creative Memory; Compare memory records; Bind memory evidence; Build advisory context; Research evidence intake; Derive visual principles; Derive creative constraints; Resolved/unresolved/conflicting state; Create explicit Memory-promotion candidate |
| C61 | FLORA specialization | SPECIALIZATION | 17 | FLORA action validation/dispatch; Crown painting plan/runtime; Crown visual checks; Petal recipe generation; A4 HERO plan/validation; Complete HERO structure; HERO painting compiler/runtime; HERO recipe generation; Region paint operations; Region-stroke compiler; Painting Recipe compiler/runtime; Refined painting parameters; Reference mapping; Painted-geometry retention; Geometry measurement gates; Species/profile specialization; FLORA runtime adapter |
| C62 | Asset lifecycle | PLATFORM_SUPPORT | 5 | Asset manifest validation; Asset audit/check; Portable asset package; Linked-document asset descriptor; Asset-manifest migration |
| C63 | PWA / update management | PLATFORM_OPS | 5 | Service Worker registration; Update detection/check; Track installing update; Activate waiting update; Update status/diagnostics |
| C64 | Product health / diagnostics | PLATFORM_OPS | 12 | Runtime error monitoring; Frame/long-frame monitoring; Operation timing; Runtime heartbeat/health assessment; WebGL capability probe; Platform capability collection; External diagnostic bundle; External pen/event/gate validation recording; Storage/offline health check; Release/update health readout; Browser interactive benchmark; Artwork QA benchmark/export |

---

## 4. Explicit partial / bounded current capabilities

These exist and must be preserved, but may not be represented as fully mature:

### Layer Effects
- Color Overlay rendering = current operational scope.
- Drop Shadow = current data model exists; full rendering belongs to authorized P1-D completion.
- Inner Shadow = current data model exists; full rendering belongs to authorized P1-D completion.
- Outer Glow = current data model exists; full rendering belongs to authorized P1-D completion.
- Stroke effect = current data model exists; full rendering belongs to authorized P1-D completion.

### Visual Compare
- structural comparison and existing Preview modes are real;
- do not claim a general standalone renderer-backed wipe/overlay/difference system beyond accepted Preview surfaces.

### Renderer / GPU
- WebGL2 source/runtime path exists;
- external browser/GPU execution remains environment dependent;
- live WebGL tile-atlas completion is not claimed;
- Canvas fallback remains authoritative compatibility behavior.

### FLORA
- preserved specialization boundary;
- does not replace generic Core authorities.

---

## 5. P0 restoration / Runtime evidence

The original 61 Section-4 capability families remain fully preserved at accepted historical/current scope:

```text
SECTION4_CAPABILITY_FAMILIES = 61
LEDGER_COVERAGE = 61 / 61
NATIVE_SOURCE_AUTHORITY_PATHS_MISSING = 0
LEDGER_QA_POINTERS_MISSING = 0
UNRESOLVED_EXISTING_CAPABILITY_LOSS = 0 identified
FIRST_REBASELINE_RUNTIME = PASS
P0_PROMOTION = CLOSED
```

Primary evidence:
- `working/INK_P0_EXISTING_CAPABILITY_RESTORE_LEDGER_v1.0.md`
- `working/INK_P0_EXISTING_CAPABILITY_RESTORE_MR_REVIEW_v1.0.md`
- `working/WORKING_STATUS.md`

Runtime PASS is family/integration evidence. It is not a claim that every one of the 496 atomics has an isolated browser Runtime test.

---

## 6. Three anti-omission additions

### C62 — Asset lifecycle

Current source confirms:
- asset manifest validation;
- asset audit/check;
- portable asset packaging;
- linked-document asset descriptor;
- asset-manifest migration.

Classification:
`HEADLESS / PLATFORM SUPPORT`

It is tracked so asset integrity/portability cannot disappear by omission. It does not require a normal creative panel.

### C63 — PWA / update management

Current product source and UI confirm:
- Service Worker registration;
- update check/detection;
- install-state tracking;
- activate waiting update;
- update status/diagnostics.

Classification:
`PRODUCT OPERATIONS / ENVIRONMENT DEPENDENT`

Normal origin/browser restrictions remain evidence boundaries.

### C64 — Product health / diagnostics

Current product source/UI confirm:
- runtime error monitoring;
- frame/performance monitoring;
- operation timing;
- health heartbeat/assessment;
- WebGL capability probe;
- platform capability collection;
- external diagnostic bundle;
- external pen/event/gate validation recording;
- storage/offline health;
- release/update health;
- interactive benchmark;
- artwork QA/export.

Classification:
`SPECIALIST / HELP / PRODUCT OPERATIONS`

Hardware/GPU/cross-browser gates remain explicitly environment dependent.

---

## 7. Program Import exact boundary

Current detector recognizes multiple Photoshop/Illustrator/Inkscape/GIMP/Krita/Corel/PaintShop/JSON/XML/JavaScript/Python/Text formats.

Important distinction:

- text/script formats supported by current parser paths may proceed into canonical parsing/compilation;
- opaque binary formats such as Photoshop Action and Clip Studio Auto Action currently use metadata-only binary parsing;
- their binary operations are explicitly marked unsupported/rejected for translation and must not be described as full import/execution support.

Detection != mature translation.

---

## 8. CHAT surface

Current source was re-counted directly:

```text
NAMED_TOOLS = 22
BOUNDED_EDIT_OPERATIONS = 34
```

These are CHAT exposure metrics only.

Every mutating CHAT route retains:
`proposal → explicit approval → execution`

CHAT does not own a second Document, History, Renderer, Selection, Transform, Recipe or storage authority.

---

## 9. Current P1/P2 disposition

Authority:
`working/INK_P1_P2_GAP_DISPOSITION_v1.0.md`

All native P1 work is now required before the next integrated Runtime:

1. P1-A — Raster Selection / Fill / Sampling
2. P1-B — Local Raster Retouch
3. P1-C — Vector / Text / Precision Layout
4. P1-D — Layer Effects Completion
5. P1-E — Advanced Selection
6. P1-F — Raster Processing Expansion
7. P1-G — Color / Bit Depth / Channels
8. P1-H — Format Interoperability

One P2 capability, Color Replacement Brush, remains opportunistically inside P1-B because it shares the same local-raster/sampling infrastructure.

Sequencing rule:

```text
NO INTEGRATED RUNTIME BETWEEN P1 PACKAGES
ALL P1 A-H COMPLETE + INTEGRATED
→ ONE exact-SHA integrated Runtime
→ UR reconciliation / UI
```

Generative/content-aware/RAW/neural families remain Adapter-class unless later reauthorized. P2 does not block this P1 Runtime gate.

---

## 10. UI reconciliation status

The old Photoshop-aligned Function Placement Map remains useful but is no longer complete against this refreshed product truth.

Primary required correction:

```text
Raster / Image / Masks / Adjustments / Filters / Blend Modes /
Layer Effects / Reusable Raster Source
```

must be treated as real INK product capabilities, not merely legacy Specialist controls.

Authority:
`working/INK_UI_CAPABILITY_RECONCILIATION_GAPS_v0.1.md`

Current state:

```text
OLD_UI_MAP_REUSABLE = YES
OLD_UI_MAP_COMPLETE_AGAINST_REFRESHED_REGISTRY = NO
UI_IMPLEMENTATION_AUTHORIZED = NO
```

UR must reconcile this full inventory after the authorized pre-UI P1/P2 packages close.

---

## 11. Manual relationship

Future `INK_MANUAL.md` consumes this capability inventory.

The Manual answers:
- what the capability is;
- what creative problem it solves;
- when to use it;
- Human usage;
- CHAT usage;
- UI location;
- limitations and related capabilities.

The Manual does not maintain a second independent capability list.

Manual prose is not a gate for P1/P2 implementation or UI restart.

---

## 12. Current gate

```text
FULL_PRODUCT_CAPABILITY_CENSUS = CLOSED
NORMALIZED_CAPABILITY_REGISTRY = MR_FROZEN
P1_P2_GAP_DISPOSITION = RECORDED
REFRESHED_CAPABILITY_BASELINE = PREPARED_ON_MR_BRANCH

NEXT =
  P1-A
  → P1-B
  → P1-C
  → P1-D
  → P1-E
  → P1-F
  → P1-G
  → P1-H
  → P1 INTEGRATION
  → FOCUSED/INTEGRATED QA
  → ONE exact-SHA integrated Runtime
  → UR RECONCILIATION
  → UI HOLD CLEARED

P1-A PRODUCT IMPLEMENTATION = AUTHORIZED / IN PROGRESS OR HANDOFF
P1-B THROUGH P1-H = SEPARATE BOUNDED AUTHORIZATION REQUIRED
P2 = AFTER P1 RUNTIME GATE
UI IMPLEMENTATION = HOLD
```
