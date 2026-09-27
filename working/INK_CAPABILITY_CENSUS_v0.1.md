# INK Full Product Capability Census v0.1

STATUS: `MR_CENSUS_IN_PROGRESS / LIST_FIRST / NO_PRODUCT_MUTATION`

TASK: `INK-CAPABILITY-BASELINE-MANUAL-001`

WORK_BRANCH: `work/ink-capability-baseline-manual-001`

BASELINE_MAIN: `d3f73cdcc1f4e902f90e7eb3973cc64764fb05b3`

OWNER: `MR / MAIN REVIEW`

## 1. Purpose

This census exists to prevent INK capabilities from being lost, omitted from UI planning, duplicated, or unnecessarily rebuilt.

The immediate sequence is:

```text
complete full capability list
→ close existing-capability omissions
→ disposition P1/P2
→ bounded P1/P2 implementation
→ refreshed capability baseline
→ release UI HOLD
→ Manual prose can continue without blocking implementation/UI
```

This file is an inventory/evidence document, not the final user manual.

## 2. Authority and counting rules

Current authority:
- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md`
- `working/INK_P0_EXISTING_CAPABILITY_RESTORE_LEDGER_v1.0.md`

Historical recovery evidence may be used only when corroborated by current source/QA:
- `governance/source/docs/INK_Current_Capabilities_and_Limits.md`
- `governance/source/docs/RC_QUICK_HELP_v1.5.1.md`
- `governance/source/docs/INK_Development_Guide.md`
- `governance/source/docs/INK_MASTER_SPEC_v2.5.md`
- `research/INK_TECHNICAL_CAPABILITY_MASTER_v1.0.md`
- `research/INK_CAPABILITY_REVALIDATION_MASTER_v0.1.md`

Counting rule:
- a capability family is one of the 61 preserved Section-4 product families;
- an atomic/sub-capability is a distinct supported action, behavior, state contract, reusable operation, or user-relevant feature;
- parameter values of the same behavior are not automatically counted as separate capabilities;
- UI aliases and CHAT aliases do not duplicate the underlying Core capability;
- CHAT named tools and bounded edit operations are separate exposure metrics, not the full product count;
- historical wish-list items are not counted as installed until current source/QA corroborates them;
- partial capabilities remain listed with `PARTIAL`, not silently upgraded to complete.

Current top-level state:

```text
CAPABILITY_FAMILIES = 61 / 61
ATOMIC_CAPABILITY_TOTAL = OPEN — census not yet closed
CHAT_NAMED_TOOLS = 22
CHAT_BOUNDED_EDIT_OPERATIONS = 34
PRODUCT_SOURCE_MUTATION_IN_THIS_TASK = 0
```

## 3. Existing full-product census

Status legend:
- `CONFIRMED` = current native source authority plus existing evidence supports the listed scope.
- `PARTIAL` = existing capability is real but intentionally/incompletely implemented at current scope.
- `VERIFY_MORE` = family exists, but deep source enumeration is still required before atomic count closure.
- `SPECIALIZED` = preserved specialization boundary, not generic Core.

### C01 — Document / project — CONFIRMED

Native authority: `document/model.js`, `document/migration.js`, `document/integrity.js`, `document/storage.js`

Atomic/sub-capabilities:
- default/new document model;
- default page and layer creation;
- active page/layer resolution;
- document object enumeration;
- object normalization;
- migration;
- document sanitization;
- deterministic stable serialization support;
- document fingerprint;
- integrity inspection;
- document snapshot creation;
- document snapshot verification;
- native .ink save/load authority.

### C02 — Pages — CONFIRMED

Native authority: `ink.js`, `document/model.js`

Atomic/sub-capabilities:
- add page;
- duplicate page;
- delete page;
- switch/activate page;
- rename page;
- preserve page-local layers/objects/workspace state.

### C03 — Layers — CONFIRMED

Native authority: `ink.js`, `document/model.js`

Atomic/sub-capabilities:
- add layer;
- duplicate layer;
- delete layer;
- drag/reorder layer;
- layer opacity;
- layer visibility;
- layer lock foundation;
- active-layer selection;
- layer object containment.

### C04 — Creation / Layout workspaces — CONFIRMED

Native authority: `ink.js`, `document/workspace.js`

Atomic/sub-capabilities:
- creation workspace;
- layout workspace;
- active-space switching;
- independent creation camera;
- independent layout camera;
- layout viewport;
- workspace normalization/migration;
- visited-space state;
- workspace diagnostics;
- shared underlying document objects across both spaces.

### C05 — Artboard / print — CONFIRMED

Native authority: `document/artboard.js`, `ink.js`, `export/pdf.js`

Atomic/sub-capabilities:
- A4 preset;
- portrait/landscape orientation;
- physical mm sizing;
- PPI selection;
- bleed;
- safe margin;
- center guide;
- content clipping flag;
- trim bounds;
- bleed bounds;
- safe bounds;
- pixel-size calculation;
- export geometry;
- fit-to-artboard behavior;
- browser print;
- A4 PDF output.

### C06 — Canvas navigation — CONFIRMED

Native authority: `ink.js`, `document/workspace.js`

Atomic/sub-capabilities:
- pan;
- zoom;
- rotate view;
- fit content;
- fit artboard/layout;
- reset/restore workspace camera;
- infinite creation-space navigation;
- independent camera persistence by workspace.

### C07 — Selection — CONFIRMED

Native authority: `ink.js`, `editor/selection.js`

Atomic/sub-capabilities:
- topmost click selection;
- Shift add/toggle;
- multi-selection;
- marquee contain mode;
- marquee intersect mode;
- lasso selection;
- select-all visible/unlocked objects;
- polygon/lasso bounds calculation;
- selection-aware object context.

### C08 — Smart guides / snapping — CONFIRMED

Native authority: `ink.js`, `editor/transform.js`, `vector/vector-core.js`

Atomic/sub-capabilities:
- smart edge snapping;
- smart center snapping;
- grid snapping;
- angle snapping;
- snap-point resolution;
- temporary smart-snap bypass;
- transform-aware snapping during direct manipulation.

Equal-distance snapping remains a P1 gap unless independently proven elsewhere.

### C09 — Align / distribute — CONFIRMED

Native authority: `ink.js`, `vector/vector-core.js`

Atomic/sub-capabilities:
- align left;
- align center;
- align right;
- align top;
- align middle;
- align bottom;
- distribute X;
- distribute Y.

### C10 — Pen / vector Path — CONFIRMED

Native authority: `editor/path-edit.js`, `vector/vector-core.js`

Atomic/sub-capabilities:
- native editable Path creation;
- anchor creation;
- anchor insertion;
- anchor deletion;
- anchor movement;
- Corner node mode;
- Smooth node mode;
- Symmetric node mode;
- incoming Bézier handle editing;
- outgoing Bézier handle editing;
- open/closed subpath state;
- subpath flattening;
- path tracing/sampling;
- path bounds;
- path metrics;
- Pen Path session;
- path geometry validation.

### C11 — Shapes — CONFIRMED

Native authority: `ink.js`, `vector/vector-core.js`

Atomic/sub-capabilities:
- line;
- arrow;
- rectangle;
- ellipse;
- circle;
- triangle;
- polygon;
- polyline;
- native shape-to-editable-vector structure.

### C12 — Boolean — CONFIRMED

Native authority: `vector/vector-core.js`, `studio-core.js`

Atomic/sub-capabilities:
- union;
- difference/subtract;
- intersection;
- xor/exclude;
- divide;
- path-to-polygon conversion;
- normalized editable Path result.

### C13 — Transform — CONFIRMED

Native authority: `ink.js`, `editor/transform.js`

Atomic/sub-capabilities:
- move/translate;
- resize;
- uniform scale;
- non-uniform scale;
- rotate;
- aspect-ratio lock;
- eight-handle direct resize;
- keyboard nudge;
- accelerated keyboard nudge;
- batch world-transform application;
- world/local matrix conversion;
- preflight transform validation.

### C14 — Non-destructive deformation — CONFIRMED

Native authority: `vector/deformation.js`, `editor/transform.js`

Atomic/sub-capabilities:
- apply reversible deformation;
- reset deformation;
- deformation report/inspection;
- preserved original editable geometry;
- perspective/foreshortening-like parameterized deformation at current accepted scope.

### C15 — Group / ungroup — CONFIRMED

Native authority: `ink.js`, `editor/composition.js`

Atomic/sub-capabilities:
- group selected objects;
- ungroup;
- preserve object appearance/identity rules during composition;
- clone composition object with regenerated IDs;
- inspect composition;
- resolve composition selection.

### C16 — Frame / hierarchy — CONFIRMED

Native authority: `ink.js`, `document/hierarchy.js`

Atomic/sub-capabilities:
- create Frame;
- nested structural containers;
- structural Group/Frame role detection;
- hierarchy traversal;
- hierarchy hit-order calculation;
- find nested object;
- world matrix through hierarchy;
- local matrix through hierarchy;
- reparent object;
- reparent to layer root;
- preserve world appearance during hierarchy changes.

### C17 — Repeat / parametric — CONFIRMED

Native authority: `vector/vector-core.js`, `repeat/repeat-identity.js`

Atomic/sub-capabilities:
- radial Repeat;
- mirror Repeat;
- grid Repeat;
- linear Repeat foundation;
- Repeat count update;
- Repeat parameter update;
- linked Repeat instances;
- deterministic Repeat transforms;
- refresh/reconcile instances;
- stable Repeat instance identity;
- expand Repeat;
- Repeat identity report.

### C18 — Components — CONFIRMED

Native authority: `studio-core.js`, `document/components.js`

Atomic/sub-capabilities:
- register component definition;
- inspect component definitions/instances;
- resolve component instance;
- create component instance;
- set instance override;
- reset override through accepted authority;
- detach instance;
- duplicate component definition;
- repair component reference;
- component schema/identity validation.

### C19 — Auto / Flex layout — CONFIRMED

Native authority: `editor/creative-workspace.js`, `document/layout.js`

Atomic/sub-capabilities:
- horizontal layout;
- vertical layout;
- gap;
- padding;
- alignment;
- Hug sizing;
- Fill sizing;
- child constraints;
- frame-layout normalization;
- layout-item normalization;
- evaluate frame layout;
- evaluate resize constraints;
- set/remove frame layout;
- set/remove child layout item;
- layout inspection.

### C20 — Text — CONFIRMED

Native authority: `ink.js`, `editor/text-object.js`

Atomic/sub-capabilities:
- create editable text object;
- edit/update text;
- font family;
- font size;
- line height;
- text color;
- text transform/opacity through common object model.

### C21 — SVG — CONFIRMED

Native authority: `vector/vector-core.js`, `studio-core.js`

Atomic/sub-capabilities:
- parse SVG path data;
- parse SVG transforms;
- import SVG document;
- import SVG Paths;
- normalize imported structure/IDs through native pipeline;
- convert vector object to SVG;
- preserve scalable vector geometry on export.

### C22 — Raster / Image objects — CONFIRMED

Native authority: `ink.js`, `image/image-core.js`

Atomic/sub-capabilities:
- image import;
- raster layer creation;
- raster layer group creation;
- raster/image object model;
- image histogram;
- crop image data;
- resize image data;
- non-destructive image stack rendering;
- image-state snapshot;
- image-state comparison;
- layer manifest creation.

### C23 — Raster / vector masks — CONFIRMED

Native authority: `image/image-core.js`, `studio-core.js`

Atomic/sub-capabilities:
- create vector mask;
- create raster mask;
- selection from raster alpha;
- selection from Path;
- rasterize Path mask;
- convert selection to raster mask;
- mask bounds;
- modify raster mask;
- mask invert;
- mask feather;
- mask expand;
- mask contract;
- object mask application;
- existing mask History/save-load participation.

### C24 — Adjustment stack — CONFIRMED

Native authority: `image/image-core.js`, `studio-core.js`

Atomic/sub-capabilities:
- create adjustment;
- brightness/contrast;
- levels;
- curves;
- hue/saturation;
- color balance;
- gradient map;
- update stack item;
- toggle stack item;
- reorder adjustment;
- remove adjustment;
- render adjustment stack non-destructively;
- History/cache invalidation at accepted scope.

### C25 — Filter stack — CONFIRMED

Native authority: `image/image-core.js`, `studio-core.js`

Atomic/sub-capabilities:
- create filter;
- Gaussian blur;
- sharpen;
- high pass;
- edge detection;
- noise/grain;
- texture overlay;
- update filter;
- toggle filter;
- reorder filter;
- remove filter;
- render filter stack non-destructively;
- History/cache invalidation at accepted scope.

### C26 — Blend modes — CONFIRMED

Native authority: `image/image-core.js`, `ink.js`, `studio-core.js`

Atomic/sub-capabilities at declared existing scope include:
- normal;
- multiply;
- screen;
- overlay;
- soft light;
- hard light;
- darken;
- lighten;
- color dodge;
- color burn;
- difference;
- exclusion;
- hue;
- saturation;
- color;
- luminosity;
- compositing through raster/layer render paths.

Exact declared mode vocabulary remains subject to final source-enum extraction before atomic-count closure.

### C27 — Layer effects — PARTIAL

Native authority: `image/image-core.js`, `studio-core.js`

Atomic/sub-capabilities:
- layer-effect data model;
- color overlay rendering;
- drop shadow data model only;
- inner shadow data model only;
- outer glow data model only;
- stroke effect data model only;
- effect stack application at current partial scope.

Do not describe the data-model-only effects as fully rendered.

### C28 — Reusable raster source — CONFIRMED

Native authority: `image/image-core.js`, `document/model.js`

Atomic/sub-capabilities:
- reusable raster source creation;
- source instance creation;
- shared source identity;
- instance reuse;
- non-destructive source-associated adjustment/filter stacks;
- save/load of reusable source relationships.

### C29 — Drawing tools — CONFIRMED

Native authority: `ink.js`, `paint/brush-engine.js`

Atomic/sub-capabilities:
- Pen;
- Pencil;
- Marker;
- Brush;
- Airbrush;
- Eraser;
- live drawing onto editable Stroke model;
- brush cursor/live preview;
- geometry-aware local erasing.

### C30 — Brush engine — CONFIRMED

Native authority: `paint/brush-engine.js`, `studio-core.js`

Atomic/sub-capabilities:
- built-in brush presets;
- brush preset migration;
- brush preset normalization;
- brush preset validation;
- brush-stroke compilation;
- brush preset registry;
- brush package creation;
- brush package import;
- brush package export;
- imported package persistence/reload;
- brush replacement through existing Stroke Session;
- package/version format validation.

### C31 — Natural media — CONFIRMED

Native authority: `paint/brush-engine.js`, `render/natural-media-controller.js`

Atomic/sub-capabilities:
- watercolor behavior;
- oil-like behavior;
- dry brush;
- soft/opaque paint behavior;
- natural-media auto mode;
- GPU mode;
- Canvas2D mode;
- automatic fallback;
- editable Stroke remains source of truth.

### C32 — Brush dynamics — CONFIRMED

Native authority: `paint/brush-engine.js`, `paint/stroke-model.js`

Atomic/sub-capabilities:
- pressure;
- tilt;
- velocity;
- direction/orientation;
- width;
- taper;
- flow;
- wetness;
- grain;
- texture;
- bristle;
- scatter;
- softness;
- pigment/ink amount parameters;
- normalized stroke samples;
- transformed/migrated/validated Stroke data.

### C33 — Blender / Smudge — CONFIRMED

Native authority: `paint/brush-engine.js`, `paint/stroke-session.js`

Atomic/sub-capabilities:
- Blender tool behavior;
- Smudge tool behavior;
- local pigment mixing;
- local pigment transport;
- interaction with editable Stroke Session at current accepted scope.

### C34 — Stroke editing — CONFIRMED

Native authority: `stroke/edit.js`, `ink.js`

Atomic/sub-capabilities:
- nearest node;
- nearest segment;
- nearest curve segment;
- stroke/path sampling;
- simplify stroke points;
- set segment style;
- clear segment style;
- set node mode;
- move Bézier handle;
- insert node;
- delete nodes;
- split at segment;
- local circle erase;
- segment-level color/width/opacity override;
- History-aware editing.

### C35 — Stroke Session — CONFIRMED

Native authority: `paint/stroke-session.js`, `studio-core.js`

Atomic/sub-capabilities:
- create Stroke Session;
- migrate Stroke Session;
- record session;
- pause/resume recorder at accepted scope;
- replay session;
- select session strokes;
- delete session strokes;
- recolor session strokes;
- set stroke opacity;
- replace stroke brush;
- transform session strokes;
- local session undo;
- local session redo;
- History participation for committed session changes.

### C36 — Stylus — CONFIRMED

Native authority: `ink.js`, `input/input-arbiter.js`, `input/stylus-test.js`

Atomic/sub-capabilities:
- Pointer Events arbitration;
- mouse/pen/touch role handling;
- pressure capture;
- tilt capture;
- altitude;
- azimuth;
- twist;
- coalesced input;
- optional predicted preview events;
- stylus latency/sample diagnostics;
- stylus test recording;
- stylus test patterns;
- palm/contact filtering foundation.

Physical-device validation remains hardware-dependent.

### C37 — Device calibration — CONFIRMED

Native authority: `input/pen-calibration.js`, `input/device-validation.js`

Atomic/sub-capabilities:
- pressure minimum;
- pressure maximum;
- pressure gamma;
- pressure smoothing;
- pressure-curve application;
- tilt sensitivity;
- tilt deadzone;
- azimuth offset;
- calibration normalization;
- calibration-to-pen-profile conversion;
- apply calibration;
- device profile store;
- local profile persistence;
- profile import/export foundation;
- calibration embedding/reporting at accepted scope.

### C38 — Paper / media — CONFIRMED

Native authority: `render/paper-profile.js`, `document/model.js`

Atomic/sub-capabilities:
- absorbency;
- roughness;
- fiber strength;
- fiber angle;
- sizing;
- granulation;
- deterministic seed;
- paper texture visibility;
- paper field construction;
- paper sampling;
- paper-profile fingerprint;
- paper/media persistence;
- grid/ruled/dot media presentation where retained by current UI/source.

Final grid/ruled/dot source path must be pinned before atomic-count closure.

### C39 — Material system — CONFIRMED

Native authority: `material/material-library.js`, `editor/repaint-material.js`

Atomic/sub-capabilities:
- material library;
- material template creation;
- material template update;
- material template installation;
- material instance creation;
- material instance update;
- parameter overrides;
- template-value resolution;
- list material instances;
- detach material instance;
- object repaint;
- apply material;
- remove material;
- library report.

### C40 — Reference import — CONFIRMED

Native authority: `ai/chat-reference-handoff.js`, `ink.js`

Atomic/sub-capabilities:
- normalize CHAT attachment;
- local reference image handoff;
- import reference into INK;
- stable reference handoff schema/channel;
- reference decomposition request handoff;
- reference identity/context preservation;
- Human/CHAT convergence on the same reference authority.

### C41 — Extraction / vectorization — CONFIRMED

Native authority: `extraction/core.js`, `extraction/install.js`

Atomic/sub-capabilities:
- raster validation;
- mask validation;
- raster-to-contour extraction;
- contours-to-Paths conversion;
- extracted Path normalization;
- mask-assisted extraction;
- bounded extraction execution;
- extraction cancellation/abort handling;
- deterministic extraction result identity at accepted scope.

### C42 — Structure reconstruction — CONFIRMED

Native authority: `extraction/structure.js`, `structure/parametric-structure.js`

Atomic/sub-capabilities:
- radial evidence analysis;
- sector mask;
- prototype set creation;
- radial reconstruction;
- parametric descriptor normalization;
- parameter/default resolution;
- parameter bounds resolution;
- deterministic generated-node plan;
- parametric structure advisory adapter;
- existing Repeat remains mutation authority.

### C43 — History — CONFIRMED

Native authority: `history/history.js`, `ink.js`

Atomic/sub-capabilities:
- transaction capture;
- target-scoped capture;
- ID-aware forward patch;
- ID-aware inverse patch;
- undo;
- redo;
- in-place patch application;
- linear redo invalidation after new edit;
- history step list;
- jump to earlier/later history step;
- configurable retention limit;
- retained-step diagnostics;
- stored-byte diagnostics;
- full-document fallback for non-migrated callers.

History remains session/workspace state and is not serialized into .ink by default.

### C44 — Revision — CONFIRMED

Native authority: `document/revision.js`, `ink.js`

Atomic/sub-capabilities:
- capture revision;
- list revisions;
- inspect revision record;
- stable revision ID derivation;
- revision fingerprint;
- clone revision record;
- restore revision;
- compare revision documents;
- inspect revision comparison;
- revision index/integrity schema;
- explicit separation from Undo/Redo History.

### C45 — Provenance — CONFIRMED

Native authority: `provenance/provenance-graph.js`

Atomic/sub-capabilities:
- build revision provenance graph;
- source-to-operation lineage;
- operation-to-revision lineage;
- reference/extraction/path/edit traceability;
- CHAT-aware provenance context;
- provenance bridge context;
- read-only provenance adapter;
- bounded lineage inspection.

### C46 — Compare — CONFIRMED / PARTIAL_RENDERING

Native authority: `compare/visual-compare.js`, `render/pixel-compare.js`

Atomic/sub-capabilities:
- compare explicit reference/current/revision/variant subjects;
- structural comparison;
- compare metadata;
- variant descriptor creation;
- variant decision state;
- RGBA pixel comparison utility;
- AI preview before/after;
- split preview;
- overlay preview;
- difference preview.

The standalone compare core does not itself provide a general renderer-backed overlay/wipe/difference workflow.

### C47 — Storage — CONFIRMED

Native authority: `document/storage.js`

Atomic/sub-capabilities:
- IndexedDB primary storage;
- localStorage preference/fallback path;
- memory fallback where browser storage is unavailable;
- storage-record verification;
- current snapshot;
- previous snapshot;
- checkpoint generations;
- storage envelope;
- autosave integration;
- local settings separation from full document data.

### C48 — Recovery — CONFIRMED

Native authority: `document/storage.js`, `document/file-envelope.js`

Atomic/sub-capabilities:
- fingerprint verification;
- byte-length verification;
- recover current valid snapshot;
- fall back to previous valid snapshot;
- fall back through checkpoints;
- preserve previous save;
- storage-envelope migration/upgrade;
- corrupted-current recovery;
- file-envelope validation at accepted scope.

### C49 — Renderer — CONFIRMED

Native authority: `ink.js`, `render/index.js`

Atomic/sub-capabilities:
- Canvas2D rendering;
- WebGL2 renderer authority where available;
- renderer capability detection;
- automatic fallback;
- vector/object rendering integration;
- raster/image rendering integration;
- cache invalidation after mutation/document replacement;
- editable document remains source of truth.

### C50 — Natural-media renderer — CONFIRMED

Native authority: `render/natural-media-controller.js`, `render/multi-channel-ink.js`

Atomic/sub-capabilities:
- single-stroke natural-media rasterization;
- multi-channel pigment amount;
- pigment RGB;
- water channel;
- deposition channel;
- paper resistance/absorption field;
- pigment/water deposition;
- directional diffusion;
- paper absorption;
- pigment movement;
- sediment/deposition;
- evaporation;
- wet-edge compositing;
- adjacent wet-stroke interaction;
- deterministic Canvas2D reference backend;
- WebGL2/MRT backend foundation;
- GPU/Canvas fallback.

### C51 — GPU / large-canvas infrastructure — CONFIRMED / PARTIAL_WEBGL_RUNTIME

Native authority: `render/gpu-resource-budget.js`, `render/tile-atlas.js`, `render/live-canvas-tile-renderer.js`

Atomic/sub-capabilities:
- GPU resource budget;
- texture-byte estimation;
- LRU resource accounting;
- dirty-region tracking;
- tile-plan creation;
- Persistent Tile Atlas;
- dirty-tile marking;
- atlas cancellation/diagnostics;
- Live Canvas tile renderer;
- context-lost handling;
- context-restore initialization;
- bounded large-canvas planning.

Live WebGL atlas remains incomplete unless separately runtime-proven.

### C52 — High-resolution export — CONFIRMED

Native authority: `render/tiled-export.js`, `export/png-worker-encoder.js`

Atomic/sub-capabilities:
- tiled export job;
- bounded tile plan;
- export checkpoint creation;
- checkpoint validation;
- cancel export;
- resume export;
- same-output-canvas continuation;
- worker PNG encoding;
- PNG worker capability detection;
- high-resolution transient raster scaling;
- bounded pixel/side limits;
- deterministic export progress state.

### C53 — Output — CONFIRMED

Native authority: `ink.js`, `export/pdf.js`, `vector/vector-core.js`

Atomic/sub-capabilities:
- PNG export;
- SVG export;
- PDF export;
- browser print;
- artboard-range output;
- bleed/crop-mark aware output at accepted scope;
- physical-size SVG output;
- single-page PDF 1.4 raster/JPEG embedding;
- output-handle/release path through current CHAT public surface.

### C54 — Recompute — CONFIRMED

Native authority: `recompute/local-recompute.js`, `recompute/dependency-graph.js`

Atomic/sub-capabilities:
- dependency model;
- add dependency relation;
- remove dependency relation;
- parent relation;
- dependency graph build;
- relation-type/change-domain filtering;
- affected-scope analysis;
- local recompute analysis;
- local recompute execution;
- recompute report/validation path at accepted scope.

### C55 — Recipe / automation — CONFIRMED

Native authority: `recipe/recipe-engine.js`, `studio-core.js`

Atomic/sub-capabilities:
- expression evaluation;
- input measurement;
- role mapping;
- role schema registry;
- recipe validation/migration via existing recipe modules;
- Recipe Engine;
- Recipe Editor;
- operation recording;
- Action Dispatcher;
- external-asset adapter registry;
- deterministic recipe replay;
- breakpoint/pause foundation;
- rollback through existing document/history authority;
- common flower recipe support;
- Program Import schema integration.

### C56 — Program Import — CONFIRMED

Native authority: `program-import/importer.js`, `studio-core.js` plus current program-import modules

Atomic/sub-capabilities:
- source-format detection;
- Photoshop analysis/translation framework;
- Illustrator analysis/translation framework;
- Inkscape analysis/translation framework;
- JSON/program description analysis;
- canonical operation model;
- expression IR;
- parser adapters;
- compiler;
- coverage analysis;
- comparison engine;
- import security checks;
- reference package;
- reference pipeline;
- reference runner;
- importer report/attachment;
- History enclosure for accepted document mutation.

Exact supported syntax breadth remains format-specific and must not be overstated.

### C57 — CHAT control — CONFIRMED

Native authority: `editor/chat-bounded-edit.js`, `editor/chat-creative-plan.js`

Atomic/sub-capabilities:
- grounded current-state summary;
- stable CHAT object refs;
- edit-task normalization;
- edit-task validation against current state;
- optimistic state/fingerprint preconditions;
- edit proposal;
- explicit approval;
- execute approved edit;
- cancel/reject path;
- edit diagnostics;
- bounded operation dispatch;
- multi-step Creative Plan normalization;
- plan dependency ordering;
- plan proposal;
- plan validation against current state;
- explicit plan approval;
- plan execution;
- plan diagnostics;
- proposal/approval/execution state machine;
- History participation for mutations;
- Revision/provenance reporting where applicable.

Public exposure metrics remain separately fixed at 22 named tools / 34 bounded edit operations.

### C58 — Semantic grounding — CONFIRMED

Native authority: `semantic/semantic-model.js`, `semantic/semantic-region-grounding.js`

Atomic/sub-capabilities:
- semantic role inference;
- semantic normalization;
- semantic object traversal;
- semantic-region grounding;
- region boundary structure;
- outer/hole/island relationship foundation;
- contains;
- inside;
- intersects;
- overlaps/relationship evidence at accepted scope;
- stable selected-object grounding;
- semantic bridge context;
- read-only grounding adapter.

### C59 — Creative Library — CONFIRMED

Native authority: `agent/creative-library-search.js`, `agent/public-creative-api.js`

Atomic/sub-capabilities:
- search library;
- inspect library item;
- stable creative-library ref;
- component family search;
- material family search;
- recipe family search;
- parametric-structure search;
- reference-derived-structure search;
- bounded reuse classification;
- component reuse through existing component authority;
- material reuse through existing material authority;
- recipe read-only discovery;
- structure reuse through existing native object/repeat authorities.

### C60 — Creative Memory / Research — CONFIRMED AT READ-ONLY ADVISORY SCOPE

Native authority: `memory/creative-memory.js`, `research/research-creation-bridge.js`

Creative Memory atomic/sub-capabilities:
- normalize/validate memory record;
- memory collection;
- add/put/replace record Core functions;
- query records;
- compare records;
- bind evidence;
- shape-vocabulary memory;
- composition-rule memory;
- line-behavior memory;
- material-treatment memory;
- color-logic memory;
- method memory;
- creative-decision memory;
- accepted/rejected/unresolved disposition;
- advisory-context construction;
- CHAT read-only advisory adapter.

Research → Creation atomic/sub-capabilities:
- supplied research evidence intake;
- extracted visual principles;
- creative constraints/methods;
- resolved/unresolved/conflicting state;
- explicit Creative Memory promotion candidate;
- CHAT/Reference advisory context;
- no mandatory network fetch;
- no automatic Creative Memory write.

Current workstation exposure remains read-only/advisory unless separately authorized.

### C61 — FLORA specialization — SPECIALIZED

Native authority: `flora/hero`, `flora/recipe`, related `flora/*` modules

Preserved specialization capabilities include:
- FLORA action validation/dispatch;
- crown painting plan/schema/runtime;
- crown visual checks;
- petal recipe generation;
- A4 HERO plan/schema/validation;
- complete HERO structure;
- HERO painting compiler/runtime;
- HERO recipe generation;
- region paint operations;
- region-stroke compiler;
- painting recipe schema/validator/compiler/runtime;
- refined painting parameters;
- reference mapping;
- painted-geometry retention;
- geometry measurement gates;
- species/profile specialization;
- FLORA runtime adapter.

FLORA is preserved as specialization and must not redefine generic Document/History/Renderer/Recipe authorities.

## 4. CHAT exposure index — separate from product inventory

Current accepted metrics:

```text
NAMED_TOOLS = 22
BOUNDED_EDIT_OPERATIONS = 34
```

These remain valid CHAT-surface counts only. They are not added to the product total as duplicate Core capabilities.

## 5. Current census open items

The following must be completed before `ATOMIC_CAPABILITY_TOTAL` is frozen:

1. extract exact `ink.js` human-UI command surface for Pages, Layers, Navigation, Shapes, Drawing tools and workspace controls;
2. extract exact declared Blend Mode vocabulary from current image/source authority;
3. pin current source for paper grid/ruled/dot presentation before counting those as atomic;
4. verify exact pause/resume semantics of Stroke Session recorder;
5. enumerate current Recipe breakpoint/rollback surface from source instead of relying on historical wording;
6. enumerate exact Program Import supported format/sub-operation matrix from current parsers/compiler;
7. enumerate exact Semantic relation vocabulary from current source enums;
8. enumerate exact Creative Memory category/disposition vocabularies and Research bridge outputs;
9. enumerate `agent/capability-registry.js` named tools and operation argument sub-actions without double-counting Core actions;
10. cross-check the final atomic list against current QA filenames and UI static-control ledger;
11. classify each atomic item by:
    - Human UI = YES / NO / PARTIAL;
    - CHAT = READ / MUTATE / NO / DEFER;
    - History = YES / NO / N/A;
    - Save/load = YES / LOCAL / OUTPUT / N/A;
    - QA = PASS / PARTIAL / MISSING;
    - Runtime = PASS / PARTIAL / NOT DIRECTLY EXERCISED.

Until these are closed:

`FULL_ATOMIC_CAPABILITY_CENSUS = IN_PROGRESS`

## 6. P1/P2 boundary

P1/P2 implementation is not started by this census branch.

The existing Photoshop/mature-platform gap register remains in:
`ACTIVE/INK_FULL_PRODUCT_CAPABILITY_REBASELINE_PLAN_v1.0.md#5`

After this census closes, every P1 row must receive one explicit disposition:
- IMPLEMENT NOW
- IMPLEMENT AFTER UI BASELINE
- ADAPTER
- DEFER WITH REASON
- OUTSIDE PRODUCT DIRECTION

Only `IMPLEMENT NOW` items may enter a new bounded implementation Work Order.

## 7. Manual relationship

Future `INK_MANUAL.md` must consume the final capability IDs/list from the refreshed baseline/census.

Manual prose must not block:
- P1/P2 disposition;
- authorized P1/P2 implementation;
- UR/UI restart after the refreshed capability baseline is published.

Manual later adds:
- what it is;
- creative problem solved;
- when to use;
- Human usage;
- CHAT usage;
- UI location;
- limitations;
- relationships to other capabilities.

It must not create a second independent capability inventory.
