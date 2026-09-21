# INK REVIEW EVIDENCE

STATUS: `MR_PASS_EVIDENCE / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-017`

REVIEW_PAYLOAD_HEAD: `a0fe5833f0a3449c380c7adb5817b4c7cc4b5bd8`

## Review fingerprint

```text
prior source-review checkpoint = 3000674329127956d20f6cb7f4a2fb88938152a7
final reviewed DEV HEAD = a0fe5833f0a3449c380c7adb5817b4c7cc4b5bd8
supplementary delta = 2 commits
supplementary delta product source changes = 0
promotion PR = #19
main promotion = edb8f11c39e43043584a20ec648dace242574742
```

## Accepted product / QA payload

- `product/source/src/extraction/structure.js`
- `product/source/src/ink.js`
- `qa/core/tests/rose-window-hard-benchmark-v0.1.mjs`
- `qa/core/tests/unit/extraction-structure-v0.1.test.mjs`
- `qa/core/tests/unit/extraction-structure-workspace-source-v0.1.test.mjs`
- `qa/core/evidence/INK_CLOUD_017_STATIC_CHECKS.txt`
- `qa/core/evidence/INK_CLOUD_017_COMPARISON_STATUS.json`
- `qa/core/evidence/INK_CLOUD_017_SUPPLEMENTARY_ROSE_WINDOW_BENCHMARK.json`
- `research/INK_STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_REPORT_v0.1.md`

Branch-local DEV progress was reviewed but not promoted.

## Supplementary benchmark

```text
TEST_CLASS = NON_CANONICAL_SUPPLEMENTARY_TEST
USER_ACCEPTED_FOR_017_OPERATIONAL_COMPLETION = YES
fixture = 1086 × 1448 RGBA
fixture sha256 = af86d03e8947234a1cc301cd8c224520fc6065272f3f80d795b5a314953fdc25
threshold = 128
ROI center = 543,638
ROI radius = 466
grid step = 4
candidate counts = 6,8,10,12,14,16,18,20,24
second complete run JSON identical = PASS
```

Direct Extraction:

```text
paths/subpaths/holes/nodes = 1386 / 1426 / 40 / 9339
recall = 0.904256
precision = 0.932975
IoU = 0.849098
FP/FN = 899 / 1325
```

Structure-Aware multi-Path:

```text
selected radial count = 6
prototype retained = 265 / 265 Paths
subpaths/holes/nodes = 269 / 4 / 1631
effective expanded nodes = 9786
recall = 0.505239
precision = 0.509176
IoU = 0.339764
FP/FN = 6740 / 6847
repeat identity = deterministic
transforms = exact
provenance = exact
```

The supplementary Direct counts and raster metrics match the historical 013 benchmark values, while the evidence remains explicitly non-canonical because binary SHA / encoding differs.

## Acceptance classification

```text
MULTI_PATH_PROTOTYPE_SET = IMPLEMENTED
SINGLE_PATH_BOTTLENECK = CLOSED
VALID_SECTOR_PATH_RETENTION = COMPLETE
EXISTING_REPEAT_TRANSFORM = REUSED
EDITABLE_STRUCTURED_OUTPUT = VERIFIED
REPEAT_IDENTITY = DETERMINISTIC
EXACT_PROVENANCE = PRESERVED
LOCAL_CORRECTION_COMPATIBILITY = VERIFIED
OVERLAY_QA = EXECUTED
HARD_BENCHMARK_COMPARISON = RECORDED
DIRECT_EXTRACTION_BASELINE = PRESERVED
PIPELINE_SELECTION = DIRECT_EXTRACTION_DEFAULT
MANDATORY_REMOTE_DEPENDENCY = 0
SECOND_VECTOR_ENGINE = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
RUNTIME_QA = DEFERRED
```
