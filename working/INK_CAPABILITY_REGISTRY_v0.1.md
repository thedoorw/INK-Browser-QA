# INK Normalized Capability Registry v0.1

STATUS: `MR_NORMALIZATION_DRAFT / SOURCE_CORROBORATED / NO_PRODUCT_MUTATION`

TASK: `INK-CAPABILITY-BASELINE-MANUAL-001`

WORK_BRANCH: `work/ink-capability-baseline-manual-001`

BASELINE_MAIN: `d3f73cdcc1f4e902f90e7eb3973cc64764fb05b3`

## 1. Normalization result

This registry converts the raw source census into product-level capabilities suitable for P1/P2 planning and later UI reconciliation.

Rules:
- one underlying Core capability is counted once even when Human UI, CHAT, Recipe and Specialist expose it through different routes;
- enumerated choices such as Blend Mode names or Program Import format IDs remain supported vocabulary under one capability unless they are materially separate tools/algorithms;
- distinct image adjustments/filters and distinct drawing tools are counted separately because they are separate creative operations;
- internal helper APIs, math primitives, serialization helpers and third-party adapters are preserved as platform contracts but do not inflate the product feature count;
- a partial/data-model-only capability is explicit and is not counted as fully operational.

Current normalized counts:

```text
CANONICAL_CAPABILITY_FAMILIES = 64
  preserved Section-4 backbone = 61
  explicit anti-omission additions = 3

PRODUCT_ATOMIC_CAPABILITIES = 496
HEADLESS_PLATFORM_SUPPORT_ATOMICS = 5
EXPLICIT_PARTIAL / BOUNDED ITEMS = 8
RAW_SECTION4_CANDIDATE_ENTRIES = 696

CHAT_NAMED_TOOLS = 22
CHAT_BOUNDED_EDIT_OPERATIONS = 34
```

The product atomic count is the number to use for capability planning. The 22/34 metrics remain exposure metrics only.

## 2. Canonical family registry

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

## 3. Explicit partial / bounded capabilities

### C27 — Layer effects

- Drop Shadow data model only
- Inner Shadow data model only
- Outer Glow data model only
- Stroke effect data model only

### C46 — Compare / Variant

- General renderer-backed standalone wipe/overlay/difference workflow beyond existing Preview surface

### C49 — Renderer

- WebGL2 execution remains device/environment dependent

### C51 — GPU / large-canvas infrastructure

- Live WebGL atlas is not complete/runtime-proven

### C61 — FLORA specialization

- Specialization scope is preserved separately from generic Core

## 4. Supporting platform contracts — tracked, not counted as product features

- stable ID / stable hashing
- document snapshot helpers
- bounds math / affine matrix math
- world/local matrix conversion
- quadtree
- page spatial index
- path flattening / metrics internals
- paint appearance normalization
- expressive-stroke normalization/validation
- SVG parser helpers
- dependency-graph internals
- schema/version constants
- migration helpers
- cache fingerprints
- vendor geometry/math adapters
- output registry internals
- agent result envelopes
- error classes
- QA-only deterministic clients
- internal report serializers

These contracts remain preservation requirements. Their exclusion from the product feature count does not authorize deletion or replacement.

## 5. Three additions beyond the old 61-row family register

The current source census requires three explicit anti-omission families:

### C62 — Asset lifecycle
Current implementation is principally packaging/headless infrastructure. It is kept explicit so asset portability, manifest integrity and linked/portable asset behavior cannot disappear by omission.

### C63 — PWA / update management
This is live product-operations behavior instantiated by the current app and visible through update/health UI. It must be included in final capability truth even though it is not a drawing tool.

### C64 — Product health / diagnostics
This is user-accessible Specialist/Help functionality and release/runtime infrastructure. It includes runtime health, external diagnostic bundle, WebGL/platform capability probing, storage/offline/release diagnostics, benchmark and artwork QA routes.

Result:

`OLD_61_REGISTER_IS_NOT_THE_FINAL_FULL_PRODUCT_FAMILY_COUNT = TRUE`

## 6. UI/P1-P2 use rule

For UI planning:
- every PRODUCT_ATOMIC capability must have a primary home, responsive duplicate, CHAT-internal route, Specialist route, or explicit headless/no-UI reason;
- C62 may remain headless/platform-support where appropriate;
- C63/C64 belong to Help/Specialist/Product Operations surfaces, not ordinary creative tool chrome;
- partial items must not appear as complete user-facing functions.

For P1/P2 planning:
- compare mature-platform gaps against this normalized registry, not the old 61-family list;
- do not implement a P1/P2 item if an equivalent existing atomic capability already exists under another family;
- P1/P2 implementation may begin only after final MR disposition records are written.

## 7. Next normalization checks before freeze

The normalized list is structurally complete enough for gap disposition, but MR must still perform these final evidence checks before publishing the refreshed ACTIVE baseline:

1. cross-check all 496 product atomics against the current Function Placement Map / Static Control Ledger;
2. cross-check all current public CHAT descriptors so no named tool or 34 bounded operation creates an untracked product atomic;
3. check Program Import binary detection vs actual translation support and label detect-only formats correctly;
4. check current runtime/QA evidence per family and mark PASS / PARTIAL / NOT_DIRECTLY_EXERCISED;
5. publish the P1/P2 disposition table;
6. then refresh `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`.

Manual prose remains non-blocking.
