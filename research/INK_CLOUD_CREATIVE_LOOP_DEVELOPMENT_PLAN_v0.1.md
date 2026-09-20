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
