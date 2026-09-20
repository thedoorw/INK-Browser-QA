# INK Rose Window Extraction Benchmark v0.1

STATUS: `PHASE_0_BENCHMARK_BASELINE / PLANNING_ONLY`

## Purpose

Use a church rose window as the first hard extraction benchmark for the INK Cloud creative loop.

The benchmark is deliberately difficult:

- dense nested contours;
- many closed regions;
- strong radial symmetry;
- repeated motifs;
- circles, arcs and pointed-arch geometry;
- real-world perspective, lighting, texture and occlusion noise;
- enough structure for AI to infer geometry rather than merely trace pixels.

The benchmark must test both visual extraction and structural reasoning.

## Pipelines to compare

### Pipeline A — Direct Extraction

```text
Reference
→ segmentation / edge preparation
→ contour extraction
→ vector fitting
→ editable Path
```

Goal: measure the strongest result obtainable from direct tracing/vectorization.

### Pipeline B — AI + INK Structural Reconstruction

```text
Reference
→ AI identifies center / symmetry / repeated motif
→ extract representative prototype
→ reconstruct through Repeat / Transform / geometry
→ local Path correction
→ editable structured result
```

Goal: determine whether structure-aware reconstruction produces cleaner, more editable and more accurate geometry than tracing every visible contour independently.

## Evaluation dimensions

The benchmark must not be judged by visual similarity alone.

Measure at minimum:

1. contour completeness;
2. missing-line count;
3. false/additional contour count;
4. closed-region topology correctness;
5. hole/nesting correctness;
6. node count and unnecessary-node density;
7. radial symmetry error;
8. repeated-motif consistency;
9. geometric regularity recovery;
10. editability of resulting paths;
11. local correction effort;
12. ability to retain provenance from reference to path;
13. deterministic/repeatable output where applicable.

## Benchmark image set

Do not rely on one image only.

Use a compact set representing increasing difficulty:

- Case A — near-frontal, high-contrast rose window;
- Case B — perspective-distorted photograph;
- Case C — aged/low-contrast stone and glass;
- Case D — partially occluded or shadowed structure;
- Case E — highly complex tracery with nested radial motifs.

The same cases should be reused across candidate pipelines.

## Candidate technology classes

Research and compare mature, reusable implementations before custom-building:

- interactive segmentation;
- edge/contour extraction;
- raster-to-vector tracing;
- Bézier/polyline simplification and fitting;
- symmetry/rotation estimation;
- repeated-pattern/prototype detection;
- hybrid segmentation + tracing + geometry reconstruction.

For each candidate record:

- license;
- browser/WASM/WebGPU/server requirements;
- model/runtime size;
- offline feasibility;
- deterministic behavior;
- vector output quality;
- integration complexity;
- whether it can become shared-core or must stay an optional adapter.

## Acceptance philosophy

The preferred solution is the one that minimizes total correction cost while retaining clean editable structure.

A pipeline that produces a visually close but noisy 20,000-node path can lose to a structure-aware pipeline with fewer, cleaner nodes and small bounded corrections.

Target decision:

`EXTRACTION_PIPELINE_SELECTED`

No implementation is authorized by this benchmark document.


## Benchmark Candidate A — User Long-Running Rose Window Reference

User-selected reference image:

`ChatGPT Image 2026年6月26日 上午06_44_33.png`

Observed file metadata in current conversation:

- 1086 × 1448 px;
- RGBA;
- near-frontal Gothic rose-window/tracery composition;
- dense nested closed contours;
- strong central radial organization;
- repeated quatrefoil/trefoil-like motifs;
- layered pointed-arch geometry;
- side circular windows and architectural framing;
- sufficient regularity for AI structural inference and sufficient ornamental complexity to expose tracing noise.

Benchmark role:

`CASE_A_PRIMARY / STRUCTURE_AWARE_HARD_REFERENCE`

This image is specifically intended to test whether INK can outperform blind tracing by combining:

- geometric/radial reasoning;
- prototype extraction;
- Repeat / Transform reconstruction;
- contour/path capture;
- local exception correction.

The binary asset itself must be added to the repository benchmark fixtures by the implementation task using an authorized binary-safe path. This planning document records the canonical benchmark identity and purpose.
