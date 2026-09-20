# INK Extraction Technology Survey v0.1

STATUS: `PHASE_0_RESEARCH_BASELINE / NO_IMPLEMENTATION_AUTHORIZATION`

## Goal

Identify mature technology that can be benchmarked and potentially integrated into the first INK Cloud creative loop:

```text
Reference → Extract → Path
```

The preferred approach is reuse-first: adopt proven segmentation/tracing/geometry techniques where they fit INK, and build custom logic only where INK's structure-aware workflow requires it.

## Current recommendation

Do not select one monolithic tracing library.

Benchmark a hybrid pipeline:

```text
Reference
→ optional perspective correction
→ semantic target segmentation
→ contour/hierarchy extraction
→ raster-to-vector trace
→ Bézier/path cleanup
→ symmetry/repetition inference
→ INK structured reconstruction
→ overlay QA + bounded correction
```

Recommended first benchmark stack:

1. SAM 2 / browser-capable SAM 2 path for semantic target masks;
2. OpenCV.js for perspective correction, contours, hierarchy, approximation, circles/geometry evidence;
3. VTracer as primary raster-to-vector candidate;
4. ImageTracerJS as lightweight pure-JavaScript baseline/fallback;
5. existing INK vector/path/Repeat/Transform engine for final editable structured reconstruction.

Potrace remains a quality benchmark reference, but direct core integration is not preferred because its library is GPL-licensed.

## Candidate A — SAM 2 / SAM 2.1

Role:

- interactive semantic segmentation;
- foreground/background point prompts;
- object mask refinement;
- separating desired architectural tracery from glass/background/noise.

Evidence:

- official SAM 2 supports promptable segmentation for images and video;
- official developer suite includes demo code;
- official model/demo/training code is Apache 2.0;
- browser-side demonstrations exist using ONNX Runtime Web.

Integration note:

The official reference stack is Python/PyTorch and can use a backend/GPU. Browser-only SAM 2 implementations should therefore be benchmarked for model size, latency, memory and browser compatibility rather than assumed as the production path.

Decision:

`BENCHMARK / HIGH_VALUE_MASK_STAGE`

## Candidate B — OpenCV.js

Role:

- threshold / Canny preprocessing;
- contour extraction;
- contour hierarchy / holes;
- contour features;
- polygon approximation;
- Hough circle detection;
- affine/perspective normalization.

Why important for rose windows:

- nested tracery requires parent/child contour hierarchy;
- circle/center evidence can support radial structure recovery;
- perspective photographs can be rectified before geometry comparison;
- polygon/contour approximation gives a deterministic baseline.

Decision:

`BENCHMARK / HIGH_VALUE_GEOMETRY_STAGE`

OpenCV.js should complement INK's own vector model, not replace it.

## Candidate C — VTracer

Role:

- raster-to-vector conversion;
- color/high-resolution image tracing;
- compact SVG generation;
- curve simplification;
- adaptive black/white tracing;
- watershed/region-based clustering.

Relevant implementation evidence:

- Rust implementation;
- browser webapp exists through WebAssembly;
- Node package also exposes a WebAssembly build;
- supports raw RGBA / image conversion;
- current tooling includes original-vs-trace comparison and curve inspection concepts.

Why it is a strong candidate:

- better suited than binary-only tracing for photographic rose-window sources;
- browser/WASM direction aligns with portable/shared-core goals;
- compact vector output is directly relevant to editable-path quality.

License:

- webapp package declares `MIT OR Apache-2.0`;
- exact license boundary of any core crate actually embedded must be rechecked before promotion.

Decision:

`PRIMARY_VECTOR_TRACE_CANDIDATE`

## Candidate D — ImageTracerJS

Role:

- simple in-browser raster-to-SVG baseline;
- zero/native-install JavaScript fallback;
- quick comparison against VTracer.

Evidence:

- runs directly in browser;
- produces SVG;
- original project uses Unlicense / public-domain dedication.

Strength:

- minimal integration friction;
- suitable as deterministic lightweight baseline.

Weakness:

- should not be assumed to match segmentation-assisted or structure-aware quality on complex photographs.

Decision:

`BASELINE / FALLBACK_CANDIDATE`

## Candidate E — Potrace

Role:

- mature bitmap tracing quality reference;
- benchmark for clean binary masks.

Strength:

- established smooth vectorization;
- SVG output;
- useful when segmentation has already produced a clean binary target.

Constraint:

- Potrace/libpotrace is GNU GPL v2-or-later;
- direct embedding into INK core would impose license obligations inconsistent with a casual copy-in strategy.

Decision:

`QUALITY_REFERENCE / BENCHMARK_ONLY_UNLESS_LICENSE_DECISION`

## Path cleanup / fitting

INK already has its own vector/path editing architecture, so external vector libraries should not become a second vector engine.

Useful algorithm references:

- Douglas-Peucker contour approximation via OpenCV;
- Schneider-style Bézier fitting / path simplification as used by Paper.js-derived implementations.

Rule:

Use external algorithms only to produce/clean input geometry; normalize the result into authoritative INK Path objects.

## Rose-window structure-aware reconstruction

Direct tracing alone is not sufficient.

The benchmark must also test whether INK can infer:

- dominant center;
- outer/inner circular rings;
- radial sector count;
- repeated motif similarity;
- rotational transforms;
- mirror relationships;
- prototype + Repeat reconstruction;
- deviations caused by perspective or photographic noise.

Proposed structural route:

```text
rectify perspective
→ estimate center/rings
→ detect radial repetition
→ select representative sector/motif
→ trace prototype
→ rebuild with INK Repeat/Transform
→ compare against reference
→ locally deform/correct exceptions
```

This path should be compared directly against tracing the whole image independently.

## Phase 0 benchmark matrix

Every rose-window case should be run through at least:

### P0-A — Direct OpenCV contour baseline

```text
preprocess → findContours / hierarchy → simplify → INK Path
```

### P0-B — VTracer direct trace

```text
reference / prepared image → VTracer → SVG → INK Path
```

### P0-C — Segmentation + VTracer

```text
SAM mask → cleaned mask/image → VTracer → INK Path
```

### P0-D — Segmentation + OpenCV contour + INK fitting

```text
SAM mask → contour hierarchy → approximation/fitting → INK Path
```

### P0-E — AI + INK structural reconstruction

```text
reference → semantic/geometric analysis → prototype extraction
→ Repeat/Transform reconstruction → bounded correction
```

### Optional P0-F — ImageTracerJS

Use as browser-only baseline/fallback.

### Optional P0-G — Potrace

Use only as an external quality reference on binary masks unless licensing is separately approved.

## Selection criteria

Do not choose solely by pixel similarity.

Score:

- contour completeness;
- topology/holes;
- false contours;
- node economy;
- smooth-curve fidelity;
- radial symmetry;
- repeated-motif consistency;
- correction time;
- browser feasibility;
- memory/latency;
- deterministic repeatability;
- license suitability;
- direct conversion to editable INK Path;
- compatibility with portable `INK.html`.

## Preliminary architecture preference

The likely best architecture is hybrid:

```text
CHAT
  semantic intent / structural reasoning / QA
       ↓
Extraction Adapter
  SAM-class segmentation (optional)
       ↓
Geometry Preprocessor
  OpenCV.js
       ↓
Vectorizer
  VTracer primary
  ImageTracerJS fallback
       ↓
INK Shared Core
  Path / nodes / topology / Repeat / Transform / History
       ↓
Overlay QA + local correction
```

This is a hypothesis to be tested by the Rose Window Benchmark, not yet an implementation decision.

## Current gate

```text
ROSE_WINDOW_BENCHMARK = DEFINED
TECHNOLOGY_SURVEY = INITIAL_COMPLETE
EXTRACTION_PIPELINE_SELECTED = NO
IMPLEMENTATION_AUTHORIZED = NO
```
