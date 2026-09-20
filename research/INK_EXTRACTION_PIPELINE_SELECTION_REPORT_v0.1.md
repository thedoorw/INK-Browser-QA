# INK Extraction Pipeline Selection Report v0.1

STATUS: `DEV_HANDOFF / SOURCE_ENGINE_COMPLETE / RUNTIME_QA_DEFERRED`

Task: `INK-CLOUD-007`  
Branch: `work/ink-cloud-007`  
Scope: `Reference → Extract → editable Path`

## 1. Decision summary

INK-CLOUD-007 completed the generic extraction engine and the minimum Reference → editable INK Path vertical slice without depending on the rose-window fixture.

`HARD_BENCHMARK = DEFERRED_BY_USER_DECISION`

The formal rose-window comparison was not executed and no benchmark quality winner is claimed.

Current executable product route:

```text
Reference raster
→ optional source-bound binary mask
→ ImageTracerJS 1.2.6
→ normalized authoritative INK Path
→ existing INK History / serialization / SVG
```

Current structure-aware candidate route:

```text
Reference raster
→ generic center/ring/rotation evidence
→ sector mask / prototype extraction
→ ImageTracerJS
→ native INK Repeat / Transform reconstruction
→ overlay QA
```

OpenCV.js and VTracer are retained as optional adapter upgrades, not selected as verified runtime routes in this task because their executable browser/WASM runtimes were not tested.

## 2. Implemented extraction engine capability

Implemented in shared INK source:

- extraction request/result contract and `INK-EXTRACTION/1` schema;
- RGBA raster boundary, source SHA-256 identity and optional source-bound binary mask;
- deterministic provenance, geometry SHA-256 and diagnostics;
- contour hierarchy normalization with outer/hole roles;
- SVG vector-adapter intake with unsafe element rejection;
- deterministic native Path IDs, node limits and non-finite geometry guards;
- cancellation/failure behavior before successful output;
- no second vector, hierarchy, transform, History or renderer engine;
- no rose-window-specific constants or product hardcoding.

Authoritative geometry remains the existing INK Path model.

## 3. Reference → editable INK Path vertical slice

Implemented:

- reference image + extracted paths committed atomically through existing scoped History;
- embedded reference identity retained in Path provenance;
- stale-document, locked target, pending-History and singular-transform guards;
- undo/redo through the existing History engine;
- save/load and migration through existing document serialization;
- InkStore storage contract exercised by the unit suite;
- SVG export through existing vector output;
- overlay opacity control without geometry mutation;
- bounded anchor correction delegated to existing native `moveAnchor`;
- repeated extraction generates unique object/node identities.

Browser decoding uses the existing browser boundary (`createImageBitmap`, Canvas, FileReader); that runtime path is not browser-verified in this task.

## 4. Adapter status

| Adapter / stage | Implementation status | Execution status in INK-CLOUD-007 |
|---|---|---|
| ImageTracerJS 1.2.6 | vendored lightweight baseline, deterministic black/white settings | EXECUTED in branch unit evidence |
| OpenCV.js | injected contour/hierarchy adapter, explicit runtime version required | **NOT TESTED** runtime |
| VTracer | injected converter boundary for separately verified runtime/WASM bridge | **NOT TESTED** runtime |
| SAM-class segmentation | optional source-bound mask contract only; no model/runtime shipped | **NOT TESTED** inference |
| Potrace | not embedded | NOT EXECUTED / benchmark reference only |

ImageTracerJS remains the only executable direct vectorization route demonstrated in this task.

## 5. Structure-aware radial / Repeat capability

Generic reusable support exists for:

- foreground-centroid or provided center hypotheses;
- ring occupancy candidates;
- rotational agreement candidates across configurable repeat counts;
- explicit geometric sector masks;
- prototype extraction through the same extraction core;
- native `Repeat` reconstruction using the existing INK vector/transform model;
- structure evidence stored as metadata;
- output marked `CANDIDATE_REQUIRES_OVERLAY_QA`.

The radial score measures binary-mask rotational agreement only. It is not semantic motif recognition and does not prove visual completeness.

## 6. Tests and checks actually executed

### Branch checkpoint evidence

The branch-local progress and checkpoint commits record these executed suites:

1. Phase A — `533d8e4a86d1e4d440e6bdcec91652240837be1c`  
   3 extraction-core tests: deterministic hierarchy/Path/provenance, input guards, cancellation/failure.

2. Phase B — `b97cdd436eaa33a5aa3078e3384ea6dfbfc96ea0`  
   extraction-core suite expanded to 5 tests, including actual ImageTracerJS raster→native Path tracing and threshold/alpha behavior.

3. Phase C — `f98257a00c179b14df30b23507abe48468771dc3`  
   total extraction engineering evidence reached 8 tests, adding atomic History, undo/redo, serialization/migration, InkStore memory fallback, SVG export, overlay, stale/singular/locked guards and identity uniqueness.

4. Phase D — `b601884ad06dd954fcc50cfd9e3d44e3eae38f5e`  
   1 structure test: fourfold raster → radial evidence → sector mask → actual trace → native Repeat → serialization/integrity.

### Final closeout checks executed

- `node --check` on:
  - `extraction/core.js`
  - `extraction/adapters.js`
  - `extraction/workspace.js`
  - `extraction/structure.js`
  - `extraction/install.js`
  
  Result: **5/5 PASS**.

- Phase-A core subset rerun in a reconstructed local Node environment using the exact branch extraction core module: **3/3 PASS**. This is corroborative source evidence only; the local product baseline is not a branch-exact full dependency checkout, so it is not presented as a fresh rerun of all branch suites.

- Branch config inspection: `FORMAT_VERSION = 4`.

- Extraction source scan: no rose-window / Gothic / quatrefoil / trefoil benchmark-specific product tokens found.

- GitHub commit status/workflow inspection at pre-handoff HEAD: no runnable status or workflow evidence available; hosted runtime QA is therefore not claimed.

## 7. NOT TESTED / blockers

The following are explicitly **NOT TESTED** and are not PASS:

- OpenCV.js executable contour pipeline;
- VTracer executable browser/WASM/native bridge inside the INK adapter;
- SAM-class model inference;
- browser reference decoding;
- Canvas rendering / visual overlay QA;
- pointer interaction;
- IndexedDB browser persistence;
- browser latency/memory behavior;
- formal rose-window hard benchmark;
- direct-vs-structure-aware rose-window comparison.

Historical migration/endurance regression closure is `BLOCKED / NOT TESTED` in the active closeout environment. The prior accepted-regression attempt reported a missing historical Git object/source closure; the final closeout environment also lacks a branch-exact runnable historical dependency checkout. This check is not declared PASS.

`RUNTIME_QA = DEFERRED`

## 8. Runtime QA debt

Deferred runtime debt remains:

- real browser file decode and Canvas pixel acquisition;
- UI run/cancel/overlay behavior;
- browser History interaction under pointer/user events;
- IndexedDB-backed InkStore rather than memory fallback;
- OpenCV.js load/memory/latency;
- VTracer WASM/browser load/memory/latency;
- optional SAM model size/runtime feasibility;
- complex photographic topology/holes/node density;
- overlay visual fidelity and correction cost;
- portable `INK.html` packaging behavior.

None of these are certified by Node/source evidence.

## 9. Known limitations

- ImageTracer baseline is luminance/binary-mask based, not semantic segmentation.
- Complex photographs may produce noisy topology or excessive nodes; no hard-reference measurement was run.
- Structure-aware evidence currently covers radial repetition heuristics, not general motif semantics.
- Repeat reconstruction is a candidate requiring overlay QA and local exception correction.
- OpenCV-based perspective normalization and contour hierarchy are adapter-ready but unexecuted.
- VTracer remains a candidate upgrade and is not promoted to primary runtime without executable evidence.
- Bounded anchor correction is only a minimal correction hook; Path Editing / Expressive Stroke is outside this Work Order.
- Extraction limits intentionally bound raster size, SVG size, path count and node count.

## 10. Selected current pipeline / fallback

`CURRENT_SELECTED_EXECUTABLE_PIPELINE`:

```text
ImageTracerJS 1.2.6
→ authoritative INK Path
→ existing History / serialization
```

`STRUCTURE_AWARE_ROUTE`:

```text
radial evidence
→ sector mask
→ ImageTracer prototype
→ native Repeat / Transform candidate
```

`FALLBACK`:

When radial structure evidence is not suitable or confidence is insufficient, use direct whole-reference/mask ImageTracer extraction and retain overlay/local correction. OpenCV.js/VTracer are upgrade candidates only after runtime verification.

## 11. Hard benchmark decision

`HARD_BENCHMARK = DEFERRED_BY_USER_DECISION`

No rose-window fixture was required, awaited or executed during closeout. No Phase A–D work was redone and no next task was started.

## 12. Scope / format integrity

- `FORMAT_VERSION = 4`;
- no package mutation;
- no DEV merge to main;
- no Path Editing / Expressive Stroke implementation;
- no generic Cloud backend/auth/collaboration capability;
- no second vector/History/renderer/hierarchy/transform engine.

## 13. Handoff identity

Pre-handoff branch HEAD:

`f02677d59f779fe240f0d23df90579171340eea0`

Final branch HEAD is **the commit containing this report and the final branch-local DEV progress update**.

Because a Git commit ID is a hash of the tree containing this file, the same tracked file cannot contain the literal SHA of its own final commit without changing that SHA. The exact resolved final commit SHA must therefore be pinned from the GitHub branch ref / DEV handoff response immediately after this commit is created. MR review must use that resolved SHA and invalidate the review if HEAD changes.

Final gate:

```text
DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP
```
