# INK Rose Window Extraction Benchmark v0.1

STATUS: `EXECUTED / DIRECT EXTRACTION CURRENT BASELINE`

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
- canonical fixture is RGB;
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

Canonical binary fixture is now present on the active DEV branch at:

`qa/fixtures/rose-window/rose-window-primary.png`

This path is the authoritative Phase D benchmark input for INK-CLOUD-013.


## Historical deferral checkpoint

User decision: defer execution of this benchmark while the creative-loop implementation continues.

```text
HARD_BENCHMARK = DEFERRED_BY_USER_DECISION
REFERENCE = RETAINED
BENCHMARK_SPEC = RETAINED
CURRENT_IMPLEMENTATION_BLOCKER = NO
```

This state was superseded when the canonical fixture was committed to the
active branch.


## Fixture intake resolved — INK-CLOUD-013

The canonical hard benchmark fixture is now available at:

`qa/fixtures/rose-window/rose-window-primary.png`

Blob SHA:

`0977531b94011300300bd69602c566fb58452522`

Phase D blocker is cleared.

```text
HARD_BENCHMARK = READY_TO_EXECUTE
REFERENCE = qa/fixtures/rose-window/rose-window-primary.png
```

## Phase D execution — INK-CLOUD-013

Execution fixture:

```text
path: qa/fixtures/rose-window/rose-window-primary.png
sha256: e0c8039f6a30b21ac87483cfacfaa1c7fa2b05d2be79596d1a3d3f765469b807
dimensions: 1086 × 1448 RGB
```

The deterministic runner is
`qa/core/tests/rose-window-hard-benchmark-v0.1.mjs`; machine-readable evidence
is `qa/core/evidence/INK_CLOUD_013_ROSE_WINDOW_HARD_BENCHMARK.json`.

Both pipelines use the fixed main-window ROI centered at `(543, 638)` with
radius `466`, luminance threshold `128`, and a 4 px raster-evaluation grid.
Because no semantic vector ground truth exists for the reference, completeness,
missing and additional geometry are measured as sampled-raster proxies. They
must not be read as manually labelled contour counts.

| Measure | Direct Extraction | Structure-Aware Reconstruction |
|---|---:|---:|
| raster-proxy recall | `0.904256` | `0.031866` |
| raster-proxy precision | `0.932975` | `0.654303` |
| raster-proxy IoU | `0.849098` | `0.031339` |
| false-negative samples | `1325` | `13398` |
| false-positive samples | `899` | `233` |
| paths retained | `1386` | `1` linked prototype |
| subpaths / holes retained | `1426 / 40` | `3 / 2` |
| unique editable nodes | `9339` | `67` |
| effective expanded nodes | `9339` | `402` |
| exact source provenance | PASS | PASS |
| deterministic rerun | PASS | PASS |

The structural evidence ranked sixfold rotation first with mask IoU
`0.317206`. The resulting native linked Repeat has zero generated-instance
rotation drift, exact motif consistency and far lower unique-node cost. It does
not, however, recover the full rose-window topology: sector extraction produced
265 Paths, while the accepted `reconstructRadial()` boundary can consume only
one Path. Retaining the largest prototype therefore omits most visible
geometry and would require substantially more local correction than the direct
result.

Evaluation conclusion across the thirteen dimensions:

- Direct Extraction wins current contour completeness, topology coverage and
  total correction-cost proxy, but carries substantial cleanup density at
  9339 nodes and 1386 Paths.
- Structure-Aware Reconstruction wins radial regularity, linked motif
  consistency and editability density, but fails current completeness and
  hole/nesting coverage on this hard fixture.
- Both outputs preserve exact source/mask provenance and rerun
  deterministically.
- Semantic topology correctness remains unscored where no labelled vector
  ground truth exists; sampled-raster evidence is reported instead.

Decision:

```text
HARD_BENCHMARK = EXECUTED
EXTRACTION_PIPELINE_SELECTED = DIRECT_EXTRACTION_CURRENT_BASELINE
STRUCTURE_AWARE = CANDIDATE_REQUIRES_OVERLAY_QA
```
