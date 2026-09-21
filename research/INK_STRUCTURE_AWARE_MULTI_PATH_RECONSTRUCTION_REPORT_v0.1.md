# INK Structure-Aware Multi-Path Reconstruction Report v0.1

Task: `INK-CLOUD-017`  
Branch: `work/ink-cloud-017`  
Base main: `38ae99eb391eb70c7e9ebe35b69ce3fdb210a28e`

## Result

The Structure-Aware reconstruction single-Path bottleneck is technically closed
without changing the accepted extraction stack.

```text
sector extraction
→ complete deterministic Path set
→ existing Group
→ existing Repeat / Transform
→ structured renderer/export traversal
→ bounded child correction
```

Direct Extraction remains the production baseline pending MR review.

## Reconstruction closure

`createStructurePrototypeSet()` retains the complete valid sector Path set in
the existing INK Group primitive. `reconstructRadial()` accepts both the
original single Path and the complete Path array, then delegates to the existing
Repeat / Transform authority.

Verified properties:

- complete prototype child Path retention;
- stable child Path identities and extraction provenance;
- deterministic Repeat instance identities;
- structured SVG/render traversal;
- JSON serialization roundtrip;
- bounded prototype-child correction propagation;
- no raster flattening;
- no second vector/document/History/Revision/renderer authority;
- `FORMAT_VERSION = 4`;
- package mutation = 0;
- main merge = 0.

## Supplementary benchmark execution

The USER-authorized supplied fixture was executed as:

```text
TEST_CLASS = NON_CANONICAL_SUPPLEMENTARY_TEST
USER_ACCEPTED_FOR_017_OPERATIONAL_COMPLETION = YES
dimensions = 1086 × 1448
mode = RGBA
sha256 = af86d03e8947234a1cc301cd8c224520fc6065272f3f80d795b5a314953fdc25
```

The benchmark logic came from
`qa/core/tests/rose-window-hard-benchmark-v0.1.mjs`
(blob `7d0868e82d1a1d3ce588c8187ec076b36c8e88ec`).

Only fixture intake was adapted for execution: the USER-approved supplementary
SHA was accepted and PNG color type 6 RGBA was decoded in addition to the
historical color type 2 RGB. ROI, threshold, candidate counts, sampling grid,
Direct Extraction route and metric definitions were unchanged.

The run was executed twice. Both emitted JSON results were identical.

## Executed evidence

Machine-readable evidence:

`qa/core/evidence/INK_CLOUD_017_SUPPLEMENTARY_ROSE_WINDOW_BENCHMARK.json`

Setup:

- threshold: `128`
- ROI center: `543, 638`
- ROI radius: `466`
- grid step: `4`
- candidate counts: `6, 8, 10, 12, 14, 16, 18, 20, 24`
- samples: `42,584`

### Same-input comparison

| Metric | Direct Extraction | Structure-Aware multi-Path |
|---|---:|---:|
| Paths | 1386 | 265 retained / 265 prototype |
| Subpaths | 1426 | 269 |
| Holes | 40 | 4 |
| Unique editable nodes | 9339 | 1631 |
| Effective expanded nodes | 9339 | 9786 |
| Recall | 0.904256 | 0.505239 |
| Precision | 0.932975 | 0.509176 |
| IoU | 0.849098 | 0.339764 |
| False positive samples | 899 | 6740 |
| False negative samples | 1325 | 6847 |

Structure-Aware selected radial count `6` with rotational mask IoU
`0.317206`. All `265` prototype Paths, `269` subpaths, `4` holes and
`1631` nodes were retained. Six linked Repeat instances yield `9786`
effective expanded nodes.

Repeat identities and transforms were deterministic. Direct extraction,
prototype extraction and reconstructed structure all passed rerun determinism.
Result digest:

`1eae7a22fe8d1eafbd01a353e59cd2b817ceaf9f246cc255154e9b903df38f1d`

## Correction-cost proxy

The bounded proxy remains two-component and is not collapsed into a pipeline
score.

```text
Direct Extraction:
  sampled mismatch = 2224
  unique editable nodes = 9339
  linked edit reuse = 1

Structure-Aware:
  sampled mismatch = 13587
  unique editable nodes = 1631
  linked edit reuse = 6
```

This shows the structural tradeoff directly: the multi-Path linked result uses
far fewer unique editable nodes and six-way linked reuse, but its sampled
raster mismatch is substantially larger on this supplied fixture.

## Interpretation

Against Direct Extraction on the same supplied input, Structure-Aware is not
improved on recall, precision or IoU. Therefore:

```text
STRUCTURE_AWARE_TECHNICALLY_CLOSED = YES
STRUCTURE_AWARE_BENCHMARK = NOT_IMPROVED
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = MR_DECISION_REQUIRED
```

The new result materially closes the prior single-Path retention defect, but it
does not justify automatic pipeline replacement.

The historical INK-CLOUD-013 evidence remains untouched. Because the supplied
file has a different binary SHA and RGBA encoding, this report does not claim a
strict same-binary numerical comparison to the INK-CLOUD-013 canonical fixture.

## QA status

Executed in this continuation:

- supplementary Rose Window benchmark: PASS;
- overlay/sample comparison: EXECUTED;
- full multi-Path prototype retention: PASS;
- exact provenance: PASS;
- Repeat transform consistency: PASS;
- direct/prototype/structure deterministic rerun: PASS;
- second complete benchmark run produced identical JSON: PASS;
- changed extraction-module syntax checks: PASS;
- supplementary runner syntax check: PASS;
- fixture dimensions/mode/SHA verification: PASS.

Browser/runtime USER-path QA remains deferred.

## DEV handoff

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-017
BRANCH = work/ink-cloud-017
TECHNICAL_CLOSURE = COMPLETE
SUPPLEMENTARY_BENCHMARK = EXECUTED_PASS
OVERLAY_QA = EXECUTED
HARD_BENCHMARK_COMPARISON = RECORDED
STRUCTURE_AWARE_BENCHMARK = NOT_IMPROVED
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
