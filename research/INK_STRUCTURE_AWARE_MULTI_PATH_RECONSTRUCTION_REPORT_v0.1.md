# INK Structure-Aware Multi-Path Reconstruction Report v0.1

Task: `INK-CLOUD-017`  
Branch: `work/ink-cloud-017`  
Base main: `38ae99eb391eb70c7e9ebe35b69ce3fdb210a28e`

## Result

The Structure-Aware reconstruction single-Path bottleneck is technically closed
without changing the accepted extraction stack.

Previous boundary:

```text
sector extraction
→ 265 Paths
→ keep one largest Path
→ Repeat
```

New boundary:

```text
sector extraction
→ complete deterministic Path set
→ existing Group
→ existing Repeat / Transform
→ structured renderer/export traversal
→ bounded child correction
```

Direct Extraction remains the production baseline during DEV.

## Reconstruction contract

`product/source/src/extraction/structure.js` now provides a deterministic
prototype-set contract.

`createStructurePrototypeSet()`:

- requires one or more valid Paths;
- rejects duplicate Path IDs;
- requires common extraction provenance;
- creates the prototype set using the existing INK `group` primitive;
- preserves child Path IDs and Path-level extraction metadata;
- records retained Path IDs/count and provenance status.

`reconstructRadial()` retains the original single-Path contract and additionally
accepts a complete Path array. A Path array is converted to the structured
Group-backed prototype set and then passed through the existing
`createRepeat()` authority.

No raster flattening or second geometry engine was introduced.

## Repeat / identity / correction closure

Focused exact-source execution verified:

- one linked radial Repeat owns the complete prototype set;
- Repeat instance IDs remain stable across a bounded prototype-child edit;
- expanded generated child IDs remain deterministic;
- the child edit propagates through linked instances;
- source Path IDs remain stable;
- Repeat-of-Group SVG output recursively preserves the structured Paths.

The existing Repeat identity implementation and vector engine were not modified.

## Workspace traversal compatibility

The multi-Path source exposed one bounded compatibility gap in
`product/source/src/ink.js`: the main workspace did not directly traverse
`repeat` objects even though the lower-level vector exporter already did.

The bounded fix reuses existing authorities:

- `repeatTransforms()`;
- recursive `drawObject()`;
- `vectorObjectToSVG()`.

Repeat traversal is now covered by:

- canvas rendering;
- world bounds;
- container-style hit testing;
- workspace SVG export.

No second renderer was added.

## Serialization / authority preservation

Executed verification includes JSON roundtrip of a Repeat whose source is a
Group of editable Paths. It preserves:

- prototype child Path IDs;
- Repeat instance IDs;
- complete structured source shape;
- recursive SVG export after roundtrip.

Exact GitHub blob comparison confirms no changes to:

- Direct Extraction core;
- extraction adapter;
- vector/Repeat engine;
- migration/integrity authority;
- History;
- Revision;
- integrated creative-loop regression source.

`FORMAT_VERSION = 4` remains unchanged.

## Hard benchmark harness

`qa/core/tests/rose-window-hard-benchmark-v0.1.mjs` was updated only to make
the Structure-Aware comparison fair for the complete prototype set.

Preserved:

- canonical fixture identity;
- fixture SHA-256;
- ROI;
- threshold;
- candidate radial counts;
- 4 px sampling grid;
- Direct Extraction route.

The updated Structure-Aware measurement records:

- sector prototype total and retained total;
- paths/subpaths/holes/nodes;
- effective expanded nodes;
- raster-proxy recall/precision/IoU;
- false-positive / false-negative samples;
- selected radial count and evidence score;
- Repeat instance IDs and transform consistency;
- exact provenance;
- deterministic rerun;
- a bounded two-component correction-cost proxy.

Raster-proxy values remain explicitly non-semantic evidence.

## Canonical benchmark execution status

The canonical PNG is approximately 2.97 MB and is authoritative only in GitHub.
The current local executor cannot resolve `github.com`; the available local INK
ZIP packages do not contain the fixture.

Per explicit user direction, external browser services are not a required QA
path and are not used as a workaround.

Therefore the updated canonical harness was not executed in this environment.

```text
ROSE_WINDOW_HARD_BENCHMARK_RERUN = NOT_EXECUTED_ENVIRONMENT
OVERLAY_QA_HARNESS = READY
NEW_STRUCTURE_AWARE_METRICS = NOT_CLAIMED
RUNTIME_QA = DEFERRED
```

The last executed canonical comparison remains
`qa/core/evidence/INK_CLOUD_013_ROSE_WINDOW_HARD_BENCHMARK.json`.

## QA evidence

Machine-readable / text evidence:

- `qa/core/evidence/INK_CLOUD_017_STATIC_CHECKS.txt`
- `qa/core/evidence/INK_CLOUD_017_COMPARISON_STATUS.json`

Executed PASS evidence:

- changed-module syntax;
- focused multi-Path exact-source unit execution;
- deterministic Repeat identity;
- bounded child-correction propagation;
- structured SVG traversal;
- JSON serialization roundtrip;
- workspace traversal source contract;
- base-main immutability of accepted Direct Extraction, Repeat, persistence,
  History, Revision and integrated-loop authorities;
- `FORMAT_VERSION = 4`;
- package mutation = 0;
- main merge = 0.

Browser/runtime USER-path QA and the canonical hard-benchmark rerun are not
claimed PASS.

## Comparative classification

```text
STRUCTURE_AWARE_TECHNICALLY_CLOSED = YES
STRUCTURE_AWARE_BENCHMARK = NOT_EVALUATED_CURRENT_ENVIRONMENT
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
```

The task closes the structural defect. It does not authorize DEV to replace
Direct Extraction.

## Scope

Changed product source is bounded to:

- `product/source/src/extraction/structure.js`
- `product/source/src/ink.js`

QA / evidence changes are bounded to the Structure-Aware unit/source tests,
hard-benchmark harness and INK-CLOUD-017 evidence.

No package/release path, backend, account/sync system, document format,
History/Revision engine, or second vector/render authority was introduced.

## DEV handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-017
BRANCH = work/ink-cloud-017
TECHNICAL_CLOSURE = COMPLETE
TARGET_GATE = STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
