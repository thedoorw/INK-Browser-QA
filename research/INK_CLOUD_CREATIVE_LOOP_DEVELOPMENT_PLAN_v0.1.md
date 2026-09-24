# INK Cloud Creative Loop Development Plan v0.1

STATUS: `ACTIVE DEVELOPMENT PLAN / PHASE_0_1 AUTHORIZED`

## Primary Product Goal

The current highest-priority goal for INK Cloud is to complete one concrete human-AI creative loop:

```text
Reference → Extract → Path → Edit → Compose → Repaint → CHAT Review → Revision
```

INK Cloud is not being defined as a feature-complete generic Cloud platform.

The immediate objective is to make this loop usable, editable, inspectable and repeatable before expanding into broader Cloud capabilities.

## Product intent

INK Cloud should become a shared human-AI creative workspace built around the same INK core.

The first closed loop must prove that:

1. a user can bring a reference image into the workspace;
2. the target subject can be extracted with high contour completeness and accuracy;
3. extraction becomes editable path geometry rather than a flattened image;
4. path geometry can be reshaped independently from stroke appearance;
5. multiple extracted paths from different references can coexist and be composed;
6. closed regions can be repainted with color and material;
7. CHAT can inspect the current structured document, discuss it with the user, and express bounded modification tasks;
8. revisions preserve the before/after state and remain recoverable.

## Four core creative capabilities

### 1. Precise Capture

Goal: extract complete, verifiable, editable contours from reference imagery.

Target workflow:

```text
Reference image
→ target identification
→ segmentation / mask
→ contour extraction
→ vector fitting
→ original/path overlay
→ completeness review
→ bounded local correction
→ accepted editable Path
```

Architecture direction:

- formal extraction should occur in the INK workspace, not only inside a CHAT message;
- CHAT provides semantic target selection, reasoning, review and correction instructions;
- extraction should be deterministic enough to compare against the original reference;
- original image and extracted path must remain visually overlayable for QA;
- automated extraction must allow manual/local correction instead of requiring full retrace.

Before implementation, benchmark candidate extraction methods on representative reference images.

Candidate classes to compare:

- edge/contour extraction;
- bitmap-to-vector tracing;
- segmentation-assisted tracing;
- hybrid segmentation + contour + Bézier fitting;
- manual bounded correction after automatic trace.

Acceptance should prioritize contour completeness, topology, editability and correction cost rather than only visual similarity.

### 2. Editable Path + Expressive Stroke

Geometry and visual stroke must remain separate.

```text
Path Geometry
+
Stroke Style
```

Required direction:

- node/handle editing;
- local reshape;
- simplify/refine;
- open/closed path integrity;
- stroke width and profile;
- expressive brush/stroke appearance;
- changing stroke appearance must not destroy editable path geometry.

### 3. Multi-Contour Composition

Multiple extracted subjects must be usable together in one INK document.

Required direction:

- import/extract multiple references;
- keep stable source/path identity;
- Layer / Group / Frame organization;
- move / scale / rotate;
- z-order;
- duplicate;
- crop/mask boundary where appropriate;
- composition without flattening source paths.

### 4. Repaint + Material

Closed path regions must support new visual treatment independent of the original image.

Required direction:

- solid fill;
- gradient/pattern-ready structure;
- material/effect attachment;
- INK natural-media/material compatibility where structurally appropriate;
- fill/material changes remain non-destructive to contour geometry.

## Human-AI collaboration model

### Human

- selects references and desired subject;
- judges visual completeness;
- performs or approves local corrections;
- composes and directs artistic intent;
- accepts/rejects CHAT proposals.

### CHAT

- understands the reference and creative intent;
- identifies extraction targets;
- inspects path/document structure;
- detects likely omissions or unwanted regions;
- proposes bounded modifications;
- translates natural-language requests into structured edit tasks;
- compares revisions and discusses alternatives.

### INK Cloud

- owns the authoritative editable document;
- displays reference and extracted geometry together;
- executes supported structured edits;
- preserves History and Revision;
- exposes document state to CHAT through a bounded collaboration contract.

## Development sequence

### Phase 0 — Extraction Benchmark + Workflow Contract

Purpose: determine the best extraction pipeline before building the Cloud workflow around the wrong tracing method.

Primary benchmark:

`research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`

Technology survey:

`research/INK_EXTRACTION_TECHNOLOGY_SURVEY_v0.1.md`

Current benchmark hypothesis:

```text
SAM-class segmentation
→ OpenCV.js geometry/contour preprocessing
→ VTracer primary vectorization
→ INK Path / Repeat / Transform reconstruction
→ overlay QA + bounded correction
```

ImageTracerJS is retained as a lightweight browser fallback/baseline. Potrace is retained as an external quality reference unless a separate GPL licensing decision is made.

Deliverables:

- representative reference-image benchmark set;
- extraction quality criteria;
- comparison of candidate tracing pipelines;
- contour completeness/topology/editability measurements;
- correction-cost observations;
- recommended extraction architecture;
- Reference → Extract → Path data contract;
- decision on which operations are shared-core and which are workspace adapters.

No broad Cloud platform work.

Gate:

`EXTRACTION_PIPELINE_SELECTED`

Before this gate, the Rose Window benchmark must compare direct tracing against AI + INK structural reconstruction.

### Phase 1 — Reference / Extract / Path Minimum Vertical Slice

Build the smallest usable slice:

```text
Reference
→ Extract
→ editable Path
```

Required:

- reference image import;
- target/mask boundary;
- trace execution;
- overlay comparison;
- editable vector path output;
- History;
- save/load;
- deterministic diagnostics.

Gate:

`REFERENCE_TO_EDITABLE_PATH_WORKS`

### Phase 2 — Path Editing + Expressive Stroke

Build:

```text
Path
→ Edit
→ Stroke
```

Required:

- node/handle editing;
- local correction;
- simplify/refine;
- expressive stroke assignment;
- stroke/geometry separation;
- undo/redo and serialization.

Gate:

`EDITABLE_PATH_AND_STROKE_WORKS`

### Phase 3 — Multi-Contour Composition

Build:

```text
Path A + Path B + Path C
→ Compose
```

Required:

- multiple source references;
- multiple extracted paths;
- Layer/Group/Frame organization;
- transform/z-order/duplicate;
- source identity retention;
- composition save/load.

Gate:

`MULTI_CONTOUR_COMPOSITION_WORKS`

### Phase 4 — Repaint + Material

Build:

```text
Compose
→ Repaint
```

Required:

- closed-region fill;
- color replacement;
- material/effect attachment boundary;
- non-destructive geometry retention;
- compatibility with existing INK material/render capabilities where possible.

Gate:

`REPAINT_MATERIAL_WORKS`

### Phase 5 — CHAT Review + Structured Edit Tasks

Build:

```text
INK document
→ CHAT inspection/discussion
→ bounded edit proposal
→ user approval
→ structured mutation
```

Required:

- document-state summary for CHAT;
- stable object/path references;
- bounded edit-command schema;
- preview/proposal boundary;
- approval before destructive/high-impact changes;
- History integration;
- failure diagnostics.

Gate:

`CHAT_BOUNDED_EDIT_LOOP_WORKS`

### Phase 6 — Revision Closure

Complete:

```text
Reference → Extract → Path → Edit → Compose → Repaint → CHAT Review → Revision
```

Required:

- revision snapshots/envelopes;
- before/after comparison metadata;
- restore/reopen;
- CHAT discussion tied to stable revision identity;
- no document flattening.

Gate:

`CREATIVE_LOOP_V1_COMPLETE`

## What is deliberately deferred

The first creative loop does not require:

- general-purpose team administration;
- broad account system;
- multiplayer cursors/presence;
- comments platform;
- generic dashboard;
- large plugin marketplace;
- complete Figma-equivalent UI;
- full component/variant ecosystem;
- full Auto Layout UI;
- broad project-management features.

These are added only when a real creative workflow needs them.

## Shared-core rule

Whenever a capability is fundamentally part of editing or the document model, implement it in the shared INK core/editor domain so both:

- portable `INK.html`;
- INK Cloud

can eventually consume it.

Cloud-only transport/session/service concerns remain adapters.

The creative-loop plan must not create a second vector engine, History engine, hierarchy, transform system or renderer.

## Portable INK checkpoint

After the first Cloud adapter/workspace boundary is proven, perform a controlled Portable Baseline Integration to verify that the evolved shared core can still be packaged toward a single `INK.html`.

This checkpoint is validation of shared-core integrity, not a requirement to freeze Cloud development.

## Current authorization state

```text
PRE_CLOUD_CORE_READY = YES
PRIMARY_CREATIVE_GOAL = REFERENCE_TO_REVISION_CLOSED_LOOP
DEVELOPMENT_PLAN = CREATED
DISCUSSION_HOLD = ENDED
CLOUD_IMPLEMENTATION = BOUNDED_EXTRACTION_WORK_AUTHORIZED
NEXT_WORK_ORDER = INK-CLOUD-007
```

The next step is to discuss/refine this plan, especially Phase 0 extraction benchmark scope and acceptance criteria, before issuing the first implementation Work Order.


## Phase 0 research checkpoint

Completed planning artifacts:

- `research/INK_ROSE_WINDOW_EXTRACTION_BENCHMARK_v0.1.md`
- `research/INK_EXTRACTION_TECHNOLOGY_SURVEY_v0.1.md`

Research conclusion so far:

- use mature reusable technologies first;
- do not rely on CHAT-only pixel tracing;
- benchmark direct trace and structure-aware reconstruction separately;
- keep final geometry authoritative as editable INK Path;
- prefer hybrid extraction rather than a monolithic tracer.

No extraction implementation has started.


## Development Authorization Checkpoint

The user explicitly ended the discussion-only phase and requested that planning be completed and technical development proceed without extended discussion.

Authorized first implementation workpack:

`INK-CLOUD-007 — Rose Window Extraction Benchmark + Reference-to-Path Technical Prototype v0.1`

Assigned branch:

`work/ink-cloud-007`

This workpack combines Phase 0 evidence with the minimum Phase 1 technical vertical slice so research does not stall before implementation.


## Engine-first development rule

The development sequence is corrected to prevent benchmark-fixture work from blocking the product capability itself.

```text
Build extraction capability first.
Use simple deterministic fixtures to prove it works.
Run the user rose-window only after the engine and Reference→Path slice exist.
```

The rose window remains the first hard benchmark, but it is no longer a prerequisite for Phases A–D.

This rule applies to INK-CLOUD-007 and later extraction work.


## Benchmark timing decision

The user chose to defer the rose-window hard benchmark until later in the creative-loop buildout.

Development priority is now continuous capability growth:

```text
Extraction
→ Path Editing
→ Expressive Stroke
→ Multi-Contour Compose
→ Repaint / Material
→ CHAT Review
→ Revision
→ hard integrated benchmark
```

Engineering fixtures and bounded regression tests remain required at each stage. The deferred rose-window benchmark remains registered as a future integrated acceptance case and is not removed from the program.


## Phase 2 split execution

To keep implementation bounded and reviewable, Phase 2 is split:

```text
INK-CLOUD-008A = Path Editing Core
INK-CLOUD-008B = Expressive Stroke
```

INK-CLOUD-008A must complete anchor/handle/topology editing, simplify/refine, History and serialization without beginning expressive stroke work.

Only after 008A is reviewed/promoted should 008B implement geometry-independent expressive stroke behavior.

Current authorized task:

`INK-CLOUD-008A — Path Editing Core v0.1`


## Continuous advancement governance

The user authorized bounded creative-loop progression without a separate pause for each promotion.

Default sequence:

```text
DEV_HANDOFF
→ MR_REVIEW
→ MR_PASS
→ clean promotion to main
→ next planned bounded Work Order
```

This automatic progression applies only while the next stage is already inside the accepted creative-loop plan and no Hard STOP, MR_REVISE/MR_HOLD, FORMAT_VERSION, architecture, package/release or broader-scope decision is encountered.

Current stage:

`INK-CLOUD-008B — Expressive Stroke v0.1`


## Current continuous stage — INK-CLOUD-009

INK-CLOUD-008B completed and promoted with gate:

`EDITABLE_PATH_AND_STROKE_WORKS`

The next bounded creative-loop stage is:

`INK-CLOUD-009 — Multi-Contour Composition v0.1`

Target gate:

`MULTI_CONTOUR_COMPOSITION_WORKS`


## Static-hosting / browser-local collaboration constraint

The human-AI collaboration core for INK Cloud must remain viable under:

```text
static hosting
+
browser-local execution
```

This requirement applies to the full creative loop, including the future CHAT Review / bounded edit / Revision stages.

Therefore:

- browser-local document state is authoritative for the core workflow;
- History, structured edits, proposals, approvals and revision logic must be executable client-side;
- any CHAT collaboration contract must support a transport-neutral/local execution path;
- GitHub Actions cannot be a required runtime dependency;
- server APIs cannot be required for core editing/collaboration semantics;
- paid cloud services cannot be required for the core loop;
- remote AI, sync, hosted storage and automation may be added only as optional adapters/accelerators.

Architecture test:

```text
If all optional remote services are removed,
can the static-hosted INK workspace still execute
the core human-AI collaboration workflow locally?
```

Required answer:

`YES`

A `NO` result is a Hard STOP / architecture failure.


## Current continuous stage — INK-CLOUD-010

INK-CLOUD-009 completed and promoted with gate:

`MULTI_CONTOUR_COMPOSITION_WORKS`

The next bounded creative-loop stage is:

`INK-CLOUD-010 — Repaint + Material v0.1`

Target gate:

`REPAINT_MATERIAL_WORKS`


## Current continuous stage — INK-CLOUD-011

INK-CLOUD-010 completed and promoted with gate:

`REPAINT_MATERIAL_WORKS`

The next bounded creative-loop stage is:

`INK-CLOUD-011 — CHAT Review + Structured Edit Tasks v0.1`

Target gate:

`CHAT_BOUNDED_EDIT_LOOP_WORKS`

This stage establishes the transport-neutral/browser-local collaboration contract and bounded proposal→approval→mutation path. Revision closure remains reserved for the next stage.


## Current continuous stage — INK-CLOUD-012

INK-CLOUD-011 completed and promoted with gate:

`CHAT_BOUNDED_EDIT_LOOP_WORKS`

The next bounded creative-loop stage is:

`INK-CLOUD-012 — Revision Closure v0.1`

Target gate:

`CREATIVE_LOOP_V1_COMPLETE`

This stage closes the first Reference→Revision creative loop with browser-local revision identity, structured snapshot/restore and CHAT revision binding. The deferred hard integrated rose-window benchmark remains outside this task.


## Current continuous stage — INK-CLOUD-013

INK-CLOUD-012 completed and promoted with gate:

`CREATIVE_LOOP_V1_COMPLETE`

The next bounded stage is:

`INK-CLOUD-013 — Integrated Creative Loop Validation v0.1`

Target gate:

`INTEGRATED_CREATIVE_LOOP_VALIDATED`

This stage validates the full accepted chain as one workflow and, when the registered fixture is available, executes the deferred rose-window hard integrated benchmark before broader workspace UX work.


## Current continuous stage — INK-CLOUD-014

INK-CLOUD-013 completed and promoted with gate:

`INTEGRATED_CREATIVE_LOOP_VALIDATED`

The first Reference→Revision engine chain has now been validated as one integrated workflow, including the deferred canonical rose-window hard benchmark.

Current extraction decision:

```text
EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE
STRUCTURE_AWARE = CANDIDATE_REQUIRES_OVERLAY_QA
```

The next bounded stage is:

`INK-CLOUD-014 — Creative Workspace Minimum UX v0.1`

Target gate:

`CREATIVE_WORKSPACE_MINIMUM_UX_WORKS`

This stage changes emphasis from engine construction to human-usable workflow integration. It must expose the accepted engine through one coherent minimum workspace without introducing a second document/editor authority or broad visual redesign.

Multi-step CHAT creative reasoning remains explicitly deferred until the minimum workspace boundary is proven.


## Current continuous stage — INK-CLOUD-015

INK-CLOUD-014 completed and promoted with gate:

`CREATIVE_WORKSPACE_MINIMUM_UX_WORKS`

The minimum workspace boundary is now proven. The previously deferred next collaboration layer is authorized:

`INK-CLOUD-015 — CHAT Multi-Step Creative Collaboration v0.1`

Target gate:

`CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS`

This stage advances CHAT from a single bounded edit proposal to a reviewable ordered creative plan composed of existing bounded operations.

Core rule:

```text
AI / CHAT may propose the plan.
INK validates and executes the plan locally.
The user explicitly approves before execution.
```

Remote AI remains optional. The browser-local orchestration, validation, approval and execution path must work without any mandatory backend.

This stage does not authorize autonomous open-ended agents, recursive self-planning, broad Cloud platform work, or a second editor/History/Revision authority.


## Current continuous stage — INK-CLOUD-016

INK-CLOUD-015 completed and promoted with gate:

`CHAT_MULTI_STEP_CREATIVE_LOOP_WORKS`

The accepted creative-loop plan already registered a Portable INK checkpoint after the Cloud adapter/workspace boundary was proven. That checkpoint is now due.

Next bounded stage:

`INK-CLOUD-016 — Portable Baseline Integration v0.1`

Target gate:

`PORTABLE_SHARED_CORE_INTEGRITY_WORKS`

Purpose:

```text
verify that the evolved shared core
still supports a static/browser-local portable baseline
without Cloud-only dependencies or a forked editor core
```

This task validates module/dependency closure, persistence, History, Revision and CHAT local collaboration compatibility. It does not authorize package/release regeneration or a final single-file `INK.html` build.


## Next bounded stage after Portable Baseline Integration — INK-CLOUD-017

INK-CLOUD-016 completed and was promoted with gate:

`PORTABLE_SHARED_CORE_INTEGRITY_WORKS`

The portable/static shared-core checkpoint is therefore closed.

The next bounded stage is selected from the remaining hard-benchmark gap already documented by INK-CLOUD-013:

`INK-CLOUD-017 — Structure-Aware Reconstruction Multi-Path Closure v0.1`

Target technical problem:

```text
rose-window sector extraction = many editable Paths
current reconstructRadial() boundary = single Path
→ most sector topology discarded
→ structure-aware completeness collapses
```

Bounded target:

```text
multi-Path prototype set
→ structured radial reconstruction
→ Repeat / Transform identity
→ overlay QA
→ bounded local correction
→ hard benchmark comparison
```

Provisional gate:

`STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS`

Constraints:

- Direct Extraction remains the current accepted baseline until new evidence proves otherwise.
- Do not redesign the full extraction stack.
- Do not introduce a second vector/Path/History/Revision engine.
- Preserve exact provenance and editable structured output.
- Preserve static hosting + browser-local execution.
- Remote AI may assist reasoning only as an optional adapter.
- `FORMAT_VERSION = 4` unless a required change triggers Hard STOP.
- Package/release mutation remains out of scope.

The purpose is not to force Structure-Aware Reconstruction to win; it is to close the known one-Path bottleneck and obtain a fair multi-Path benchmark.


## Post-017 transition — real creative work

INK-CLOUD-017 completed and was promoted with gate:

`STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS`

Final extraction decision:

```text
DIRECT_EXTRACTION = DEFAULT
STRUCTURE_AWARE = OPTIONAL_STRUCTURED_RECONSTRUCTION
STRUCTURE_AWARE_BENCHMARK = NOT_IMPROVED
```

The first planned creative-loop capability buildout is now considered sufficient to begin real creative use.

Current transition:

```text
capability construction
→ real artwork / real workflow use
→ observed friction and gap register
→ need-driven bounded engineering
```

No automatic INK-CLOUD-018 feature workpack is pre-authorized.

The next engineering stage should come from a concrete limitation encountered while making real work, rather than from speculative feature accumulation.

Program state:

`REAL_CREATIVE_WORK_READY`


## INK-CLOUD-018 — First Visible Web Platform

User clarified the post-017 priority:

```text
existing core capability
→ first visible web platform
→ visible CHAT + image import
→ Rose Window first runtime case
→ evaluate actual usable capability before further engine expansion
```

This stage intentionally does not seek Figma parity. The first target is a single-user browser platform.

Existing source already includes:

- `product/source/index.html` browser UI;
- Creative Workspace;
- image import;
- extraction/overlay controllers;
- Path editing / compose / repaint;
- CHAT bounded edit + multi-step plan;
- CHAT runtime/provider contract;
- Revision.

INK-CLOUD-018 therefore focuses on:

1. static web/deployment closure;
2. visible/discoverable Creative Workspace;
3. visible natural-language CHAT surface over the existing runtime;
4. Rose Window as first end-to-end visible runtime case;
5. actual browser QA;
6. fixed public/static URL preparation.

Target gate:

`INK_WEB_FIRST_VISIBLE_PLATFORM_WORKS`

No automatic next feature stage should be selected until the user has seen and used this first web platform.


## AI Drawing Studio execution plan — single-user + CHAT collaboration

The next product evolution target is not generic multiplayer collaboration. Phase 1 of the AI drawing studio is explicitly:

```text
PRIMARY_HUMAN_USER = ONE
COLLABORATION_TEAM = USER + CHAT
MULTI_USER_REALTIME_COLLABORATION = DEFERRED
TEAM_ADMIN / PRESENCE / CURSORS / COMMENTS_PLATFORM = NOT_REQUIRED
```

The first studio milestone is therefore a single-user human-AI creative workspace in which CHAT acts as the collaboration team around the same authoritative INK document.

This plan extends the already-validated creative loop rather than creating a second product roadmap.

### Shared-core rule for studio evolution

Capabilities that define drawing, geometry, document state, selection, history, revision or AI edit semantics must evolve in the shared INK core so both delivery forms can consume them:

```text
                         shared INK core
                              │
              ┌───────────────┴───────────────┐
              │                               │
      Portable / Web INK                 Cloud delivery
      browser-local first                optional adapters
```

External technologies may provide algorithms or runtimes, but must not become a second document/vector/history authority.

```text
external algorithm/runtime
→ bounded adapter
→ normalize into INK model
→ INK remains authoritative
```

Cloud-only services such as hosted persistence, remote AI providers, account/session infrastructure and future synchronization remain optional adapters. They must not be required for the core drawing studio workflow.

### Execution sequence

The next implementation stages should be selected from this sequence and converted one at a time into bounded Work Orders. Each stage requires a concrete implementation target, reusable technology evaluation where appropriate, static/browser runtime verification, and an acceptance gate.

#### Stage A — Vector Geometry Kernel

Purpose: strengthen the mathematical editing core beneath existing Path editing.

Candidate reusable technologies:

- Paper.js algorithms;
- Clipper2;
- Bezier.js or equivalent curve math.

Bounded capability target:

- path / curve intersections;
- Boolean union / subtract / intersect / exclude;
- offset / inflate / deflate where structurally safe;
- split / project / nearest-point operations;
- compound-path / winding / hole integrity;
- deterministic normalization back into authoritative INK Path.

Acceptance principle:

```text
external geometry operation
→ normalized INK Path result
→ History / save / load / runtime verified
→ no second vector authority
```

#### Stage B — AI Document Bridge

Purpose: allow CHAT to understand and address the current artwork precisely without direct document mutation.

Build on the existing CHAT context and bounded-edit contract.

Required direction:

- stable document/object/path references;
- object and region grounding;
- selection-aware context;
- structured document summaries;
- semantic labels where confidence is sufficient;
- natural-language intent → validated INK command;
- explicit proposal / approval / execution boundary.

Core contract:

```text
CHAT
→ document context
→ object / region / geometry grounding
→ structured command
→ schema validation
→ user approval
→ INK execution
```

CHAT must not directly rewrite document JSON or bypass INK command semantics.

#### Stage C — Revision / Provenance Engine

Purpose: evolve current revision recovery into traceable creative history.

Required direction:

- semantic operation log;
- periodic snapshots;
- stable revision identity;
- before/after metadata;
- source derivation;
- user vs CHAT action attribution;
- restore/reopen;
- relationship from reference → extraction → path → edit → revision.

Conceptual model:

```text
reference
→ extraction activity
→ path
→ user / CHAT edit
→ revision
```

JSON Patch and W3C PROV concepts may be used as references, but the authoritative model remains INK-specific.

CRDT/multiplayer systems such as Yjs or Automerge are explicitly deferred until a real multi-user requirement exists.

#### Stage D — Semantic Region / Selection Grounding

Purpose: make local visual discussion and editing precise.

Required direction:

- point / box / path / group selection;
- mask / semantic region boundary;
- AI-suggested region with user confirmation;
- stable selected-object identity;
- selection history where needed;
- commands that target regions without flattening geometry.

This stage should reuse existing extraction and document structures rather than create an independent segmentation editor.

#### Stage E — Visual Comparison + Variant Exploration

Purpose: support actual creative exploration rather than one-way editing.

Required direction:

- current vs previous;
- reference vs current;
- Variant A / B / C;
- side-by-side and overlay comparison;
- structural difference metadata;
- choose / restore / branch / merge where bounded;
- variants remain editable INK documents, not flattened image outputs.

#### Stage F — Style / Method / Creative Memory

Purpose: retain reusable creative knowledge across work.

Required direction:

- shape vocabulary;
- composition rules;
- line behavior;
- material treatment;
- color logic;
- accepted / rejected approaches;
- project-level creative decisions;
- reusable method records tied to real revisions and outcomes.

This must grow from actual use evidence. It must not become a speculative ontology project.

#### Stage G — Research → Creation Bridge

Purpose: convert visual research into usable creative constraints and methods.

Target flow:

```text
research / references
→ extracted visual principles
→ geometry / composition / palette / material constraints
→ bounded creative operations
→ editable INK artwork
```

This is a later studio capability and must depend on the preceding document, grounding, revision and comparison foundations.

### Existing capability reuse

The following are already part of the Creative Loop and should be strengthened in place rather than restarted as separate programs:

- Reference processing;
- Extract / segmentation;
- Path vectorization;
- Path editing;
- Compose;
- Repaint / Material;
- CHAT structured edit;
- Revision / History;
- Structure-Aware reconstruction;
- Portable / Web shared-core validation.

Candidate mature technologies should be integrated only when they solve a demonstrated gap. The program should prefer composition of mature modules over reimplementing known algorithms.

### Practical execution rule

This document is the product/development plan. Do not create a new planning document for every studio concept.

Implementation should proceed as:

```text
master development plan
→ select next bounded studio gap
→ Current Work Order
→ DEV implementation
→ source/static/runtime evidence
→ MR review
→ promotion
→ real creative use
→ next observed gap
```

Documentation growth is not itself progress. A new document is justified only when implementation requires a durable technical contract or evidence artifact that cannot be kept clearly inside the existing plan / Work Order / review structure.

### Phase-1 studio boundary

Until explicitly changed by the user:

```text
STUDIO_USER_MODEL = SINGLE_USER
HUMAN_AI_TEAM = USER + CHAT
MULTI_USER_COLLABORATION = DEFERRED
REALTIME_PRESENCE = DEFERRED
SHARED_CURSORS = DEFERRED
COMMENT_PLATFORM = DEFERRED
TEAM_ADMIN = DEFERRED
CRDT = DEFERRED
```

The priority is to make USER + CHAT capable of sustained, precise, revisable visual creation inside one authoritative INK workspace.


## RA-first integration strategy for the AI Drawing Studio

The Studio capability plan above is already the product roadmap. The RA baseline is the first available implementation-material pool, not a second product line and not a replacement for INK authority.

Integration must compare three sources before each foundation stage is implemented:

```text
A. existing INK capability
B. reusable RA module / contract
C. mature external algorithm / runtime
        ↓
choose the smallest reliable combination
        ↓
bounded adapter
        ↓
authoritative INK model
```

The goal is to avoid both reimplementation and blind transplantation.

### Integration rule

For every candidate module:

1. identify the exact INK gap;
2. verify whether INK already owns part of the capability;
3. inspect the corresponding RA implementation and tests;
4. benchmark mature external alternatives when they provide stronger math/runtime behavior;
5. decide `ADOPT / ADAPT / REFERENCE_ONLY / DEFER`;
6. wrap accepted capability behind an INK-owned adapter;
7. normalize results into INK Path / Document / Command / History / Revision;
8. run portable/browser-local regression and real artwork acceptance;
9. only then promote.

No external module and no RA subsystem may become a second Document, Path, History, Revision, renderer or collaboration authority.

### Foundation A — Vector Geometry Kernel integration

RA material to reuse:

- `geometry_measurement_engine.js` for measurement / fitting / geometric interpretation;
- `compound_topology_engine.js` for topology concepts and already-proven bounded operations;
- `constraint_parameter_engine.js` for semantic constraint records;
- `generator_authoring_engine.js` for reusable generator concepts;
- `dependency_recompute_engine.js` for dependency graph / local recompute concepts.

External candidates to benchmark:

- Paper.js for Bézier-aware path intersections, compound paths and Boolean operations;
- Clipper2 for robust polygon clipping and offset/inflate/deflate;
- Bezier.js for curve split/project/intersection/reduction/offset math.

Selection principle:

```text
RA = semantic geometry / measurement / dependency intelligence
external geometry libraries = robust low-level math where stronger
INK = authoritative Path representation and edit transaction
```

Do not treat RA's constraint records as a completed general geometric constraint solver. A full solver is a separate demonstrated need and must be benchmarked before adoption.

Gate:

`STUDIO_VECTOR_GEOMETRY_KERNEL_INTEGRATED`

### Foundation B — AI Document Bridge integration

RA material to reuse:

- `semantic_boundary_engine.js`;
- `geometry_measurement_engine.js`;
- `ai_review_queue_engine.js`;
- stable IDs / relationship graph / selected-rejected-unresolved semantics.

INK material that remains authoritative:

- current document/context exposure;
- CHAT bounded edit schema;
- proposal → approval → execution boundary;
- document/path identity;
- History / Revision.

Integration target:

```text
INK document
→ grounded objects / regions / relationships
→ CHAT-readable structured context
→ validated semantic command
→ explicit approval
→ INK mutation
```

RA review states may inform the bridge state machine, but must be translated into the existing INK collaboration contract rather than imported as a parallel authority.

Gate:

`STUDIO_AI_DOCUMENT_BRIDGE_INTEGRATED`

### Foundation C — Revision / Provenance integration

RA material to reuse:

- stable object IDs;
- deterministic replay concepts;
- source SHA / version identity;
- accepted / rejected / unresolved candidate records;
- review evidence / decision reason;
- compiler/replay provenance concepts.

INK material that remains authoritative:

- current Revision snapshots and restore;
- History;
- document serialization;
- CHAT revision binding.

External reference:

- W3C PROV concepts may inform Entity / Activity / Agent / Derivation relationships.

Target provenance chain:

```text
Reference
→ extraction activity
→ INK Path / object
→ user or CHAT operation
→ revision
→ variant / restore / comparison
```

Do not add CRDT or multiplayer provenance requirements during the single-user + CHAT phase.

Gate:

`STUDIO_REVISION_PROVENANCE_INTEGRATED`

### Foundation D — Semantic Region / Selection integration

RA material to reuse:

- Compare / Region / Trace workspace concepts;
- semantic boundary outer / hole / island;
- split / merge candidates;
- contains / inside / intersects / overlaps;
- gap / bridge / crossing / occlusion relationships.

External candidates:

- existing OpenCV.js contour / hierarchy processing;
- segmentation inference through ONNX Runtime Web only when semantic selection cannot be achieved reliably with current extraction tools.

INK remains owner of selection, object identity and editable geometry.

Gate:

`STUDIO_SEMANTIC_REGION_GROUNDING_INTEGRATED`

### Foundation E — Visual Compare / Variant integration

RA material to reuse first:

- side-by-side;
- overlay;
- wipe;
- difference;
- synchronized viewport;
- evidence/review comparison workflow.

Integrate these into INK Revision / Variant rather than preserving an RA case-workbench shell.

Target:

```text
reference vs current
revision A vs revision B
variant A / B / C
→ visual + structural comparison
→ choose / restore / continue editing
```

Gate:

`STUDIO_VISUAL_VARIANT_WORKFLOW_INTEGRATED`

### Foundation F — Parametric creative structure

After Foundations A–E are stable, evaluate RA:

- shared parameters;
- generators;
- arrays / mirror / rotation / radius sequence;
- dependency graph;
- local recompute;
- bounded per-instance deviations.

These should extend existing INK Repeat / Transform / Group semantics, not create a second parametric scene model.

A full geometric constraint solver is not pre-authorized. If real creative work proves it necessary, benchmark solver approaches separately with licensing, WASM/browser-local compatibility and integration cost included.

Gate:

`STUDIO_PARAMETRIC_CREATIVE_STRUCTURE_INTEGRATED`

### External technology disposition

The current default disposition is:

```text
OpenCV.js       = ADAPT / already compatible with browser-local processing
Paper.js        = BENCHMARK for Bézier path Boolean/intersections
Clipper2        = BENCHMARK for polygon Boolean/offset robustness
Bezier.js       = BENCHMARK for local Bézier math
VTracer         = KEEP for raster→vector boundary where useful
ONNX Runtime Web= DEFER until a real model-backed selection gap exists
CanvasKit       = DEFER until current INK renderer/material shows a demonstrated limitation
W3C PROV        = REFERENCE model, not runtime dependency
CRDT            = DEFER during single-user + CHAT phase
```

This disposition may change only from evidence, not from technology availability alone.

### One-pass implementation discipline

"Once" does not mean importing every promising library in one change. It means making the architecture decision once, then integrating through stable boundaries so individual engines can be replaced without rewriting INK.

For each foundation:

```text
inventory
→ comparison benchmark
→ adapter contract
→ one bounded implementation
→ deterministic/static tests
→ real browser runtime
→ real artwork acceptance
→ promotion
```

The first implementation Work Order after public-site acceptance should therefore begin with Foundation A and include the RA-vs-external benchmark inside the Work Order, rather than creating another research roadmap.


## Core Module preparation sequence

The existing Foundation A vector geometry work is treated as the current Core Module baseline rather than reopened.

MR-authorized preparation order:

```text
CORE-MOD-000 / Geometry Kernel
status = BASELINE_AVAILABLE

CORE-MOD-001 / AI Document Bridge
INK document
→ grounded structured context
→ CHAT-readable module output
→ no mutation

CORE-MOD-002 / Semantic Region Grounding
Path / region / relationships
→ semantic boundary + region graph
→ no second selection authority

CORE-MOD-003 / Revision + Provenance
reference / extraction / operation / revision
→ deterministic provenance records
→ existing Revision remains authoritative

CORE-MOD-004 / Visual Compare + Variant
reference/current/revision/variant
→ comparison model + evidence
→ no standalone workbench

CORE-MOD-005 / Parametric Creative Structure
Repeat / Transform / dependency graph
→ generators + local recompute
→ no second scene model
```

Each module closes at `MODULE_READY`, not at final product integration.

Prepared modules enter an Integration Queue. MR later issues a bounded Integration Work Order to wire compatible modules into the shared INK skeleton and run a concentrated Runtime batch.


## 2026-09-24 pivot — INK Agent Connectivity

STATUS: `PLANNING / DRAWING_VALIDATION_HOLD`

The user paused further drawing-validation execution after
`INK-CHAT-VALIDATION-001 Phase C` reached MR source PASS.

The next architecture target is a general programmable connection comparable in
workflow to mature Figma and Penpot agent integrations.

### Reference pattern

Figma:

```text
agent
→ general write-to-canvas execution
→ Plugin API
→ native editable nodes
+ reusable task skills
```

Penpot:

```text
agent
→ MCP
→ overview / API discovery / generic execution
→ Plugin API
→ native editable shapes
```

### Proposed INK architecture

```text
ChatGPT / agent
→ INK MCP or plugin transport
→ INK Agent Tools
→ INK Public Agent API
→ existing INK controllers
→ Document / History / Revision / Renderer
```

The public Agent API is a facade over accepted INK authorities. It must not create
a second editor or bypass existing controller/History paths.

### Minimal Agent Tools

```text
ink_overview
ink_api_info
ink_execute
ink_capture
ink_import_asset
ink_export
```

`ink_overview` returns bounded document/page/layer/selection/object state.

`ink_api_info` exposes supported public operations on demand.

`ink_execute` runs bounded programs against only the INK Public Agent API so an
agent can compose multiple existing operations without needing one MCP tool per
creative command.

`ink_capture` provides visual feedback for current canvas/selection.

Asset import/export remain separate from mutation authority.

### Initial skills

```text
ink-use
ink-reference-to-vector
ink-compose-artwork
ink-edit-selection
ink-revise-artwork
ink-design-system
```

Skills hold workflow knowledge, not mutation authority.

### Reuse mature external editors

Do not rebuild Figma/Penpot capabilities merely for parity.

```text
Figma / Penpot
= mature layout, components, tokens, fast agent-generated structure

INK
= personal image laboratory, extraction, geometry, material,
  custom visual operations, provenance and creative grammar
```

Preferred interoperability:

```text
idea / reference
→ Figma or Penpot when mature structural composition helps
→ editable SVG / structured exchange
→ INK custom processing
→ CHAT coordinates both through skills
→ final editable output
```

### ChatGPT connection target

```text
INK browser runtime
↔ INK MCP / plugin adapter
↔ ChatGPT plugin/app
↔ INK skills
```

Transport remains replaceable; the INK Public Agent API is the stable contract.

### Planning gates before drawing tests resume

1. inventory accepted INK controllers and map them to a public Agent API;
2. define safe inspect/result/error schemas;
3. define bounded generic execution;
4. define capture/visual feedback;
5. define MCP/plugin transport separately from Core;
6. draft `ink-use` from Figma/Penpot operating patterns;
7. prototype one complete creative command through the generic bridge;
8. reassess which previous Phase C–F tests are still necessary.

```text
INK-CHAT-VALIDATION-001 Phase C Runtime = HOLD
private-image acceptance = HOLD
Phase D–F = HOLD
NEXT = AGENT CONNECTIVITY ARCHITECTURE / RESEARCH
```
