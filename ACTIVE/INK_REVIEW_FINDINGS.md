# INK REVIEW FINDINGS

STATUS: `MR_PASS / SOURCE_REVIEW_PASS / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-017`

REVIEW_PAYLOAD_HEAD: `a0fe5833f0a3449c380c7adb5817b4c7cc4b5bd8`

## Decision

`MR_PASS`

Gate accepted:

`STRUCTURE_AWARE_MULTI_PATH_RECONSTRUCTION_WORKS`

## Findings

- The single-Path reconstruction bottleneck is closed.
- All 265 valid sector prototype Paths are retained in the tested multi-Path result.
- Existing Group + Repeat / Transform authorities are reused.
- Editable child Path identity, provenance, Repeat identity and transform determinism are preserved.
- Bounded prototype-child correction propagates through linked instances.
- Renderer/bounds/hit/SVG traversal support existing Repeat sources without a second renderer authority.
- No second vector/document/History/Revision engine was introduced.
- `FORMAT_VERSION = 4`.
- Package mutation = 0.
- Mandatory remote dependency = 0.
- Browser/runtime USER-path QA remains deferred.

## Benchmark finding

USER-authorized supplementary same-input comparison:

```text
Direct Extraction
recall     = 0.904256
precision  = 0.932975
IoU        = 0.849098
mismatch   = 2224
nodes      = 9339

Structure-Aware multi-Path
recall     = 0.505239
precision  = 0.509176
IoU        = 0.339764
mismatch   = 13587
unique nodes = 1631
linked reuse = 6
```

Structure-Aware materially improves on the old one-Path failure and preserves all prototype Paths, but it does not outperform Direct Extraction on the current hard image.

## Pipeline decision

```text
DIRECT_EXTRACTION_BASELINE = PRESERVED
DIRECT_EXTRACTION = DEFAULT
STRUCTURE_AWARE = OPTIONAL_STRUCTURED_RECONSTRUCTION
STRUCTURE_AWARE_BENCHMARK = NOT_IMPROVED
```

Structure-Aware remains valuable where radial/repeated geometry and linked editing matter, but it is not selected as the default extraction route.

## Promotion

Clean promotion completed through PR `#19`.

Main promotion:

`edb8f11c39e43043584a20ec648dace242574742`

Branch-local `ACTIVE/INK_DEV_PROGRESS.md` was excluded from promotion.
