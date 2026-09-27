# INK DEV Progress — INK-P1-F-RASTER-PROCESSING-EXPANSION-001

TASK: `INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

BRANCH: `work/ink-p1-f-raster-processing-expansion-001`

BASELINE_MAIN: `dcc41aa595bad8eaa73dce05a7b2fa988a7cce2f`

STATUS: `FINAL_NORMALIZATION_BOUNDED_CORRECTION_HANDOFF_READY / STOP_FOR_MR`

WORKPACK:
`working/INK_P1_F_RASTER_PROCESSING_EXPANSION_DEV_WORKPACK_v1.0.md`

CORE_AUTHORITY_TARGET:
`product/source/src/image/raster-processing-advanced.js`

PARALLEL_PEER:
`INK-P1-G-COLOR-BITDEPTH-CHANNELS-001`

RUNTIME: `NOT RUN / PROHIBITED UNTIL ALL P1 A-H + INTEGRATION CLOSE`

## Completion

| Area | Result |
|---|---|
| Exposure | COMPLETE |
| Vibrance | COMPLETE |
| Black & White | COMPLETE |
| Photo Filter | COMPLETE |
| Channel Mixer | COMPLETE |
| Color Lookup / bounded 3D LUT | COMPLETE |
| Invert | COMPLETE |
| Posterize | COMPLETE |
| Threshold | COMPLETE |
| Selective Color | COMPLETE |
| Motion Blur | COMPLETE |
| Median | COMPLETE |
| Unsharp Mask | COMPLETE |
| Emboss | COMPLETE |
| Mosaic / Pixelate | COMPLETE |
| Minimum | COMPLETE |
| Maximum | COMPLETE |
| Reduce Noise | COMPLETE |
| Filter Gallery descriptor foundation | COMPLETE |
| Liquify Forward Warp | COMPLETE |
| Liquify Twirl | COMPLETE |
| Liquify Pucker | COMPLETE |
| Liquify Bloat | COMPLETE |
| Liquify Reconstruct | COMPLETE |
| Liquify freeze/protect mask | COMPLETE |

## Implementation

```text
IMPLEMENTATION_COMMIT = f176143be363c134f9b35fecb2c6d34be7391f26
IMPLEMENTATION_HEAD_BEFORE_HANDOFF_DOC = f176143be363c134f9b35fecb2c6d34be7391f26
```

Changed product/QA files:
- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`

No other product-source file changed in this lane.

## Exact blobs

```text
raster-processing-advanced.js = 7c62d46a36e177142d18e0d1ddd16929ce4c6b14
focused QA                    = d8bc46c7960bb7c789e6095cb43f0738134581b8
```

## Focused QA

Command:
```text
node --test qa/ink-p1-f-raster-processing-expansion.test.mjs
```

Exact branch blobs were verified with `git hash-object` before execution.

```text
P1_F_FOCUSED_QA = PASS
TESTS = 33
PASS = 33
FAIL = 0
SKIP = 0
```

Coverage includes:
- every required advanced adjustment;
- alpha preservation and opacity/mask composition contract;
- identity and non-identity bounded 3D LUT fixtures;
- every required advanced filter;
- bounded raster-edge behavior;
- deterministic repeat behavior and source immutability;
- all required Liquify operations;
- freeze/protect mask;
- hard Liquify work limit;
- unchanged output dimensions;
- predictable unsupported-algorithm rejection.

## Bounded limitations

- This module is an algorithm provider only; accepted algorithms are not registered into the existing Adjustment/Filter stack until P1 Integration.
- Advanced adjustment/filter processors currently use the lane's bounded 8-bit RGBA/ImageData-like contract; 16/32-bit integration belongs to final P1 integration with accepted P1-G Core.
- Selective Color is a bounded deterministic range correction, not Photoshop full visual/math parity.
- Color Lookup supports bounded uniformly sampled 3D LUT application; LUT-file parsing and UI are not part of P1-F.
- Reduce Noise uses a bounded deterministic local smoothing/edge-preservation heuristic.
- Liquify uses a Float32 displacement field and bounded bilinear raster sampling; no face-aware/AI Liquify or UI mesh is included.

## Parallel / scope confirmation

```text
SHARED_PRODUCT_SOURCE_WITH_PEER = 0
image-core.js changes = 0
P1-G files changes = 0
UI changes = 0
CHAT changes = 0
Recipe changes = 0
FORMAT_VERSION change = 0
History/save-load integration = 0
second Adjustment/Filter authority = 0
second Renderer authority = 0
P1-H scope intrusion = 0
Runtime = NOT RUN
```

## Handoff

```text
PRODUCT_SOURCE_CHANGES = 1 new algorithm-provider file
FOCUSED_QA = PASS / 33 of 33
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
```

DEV-F stops here for independent MR review.


## MR bounded correction — zero/default normalization — 2026-09-27

MR REVIEW REFERENCE:
- `working/INK_P1_F_MR_REVIEW_v1.0.md`
- The review file was not visible on the P1-F branch or repository search surface when DEV executed this correction.
- DEV followed the explicit user-authorized bounded correction scope in-chat only.

CORRECTION_COMMIT:
`dac5dce2ad6c57c7ec91ce3524bfb6ad86810e1f`

CORRECTION_TREE:
`6d09f1f07f06ab1e08eb516fa8ae4c105f6926e5`

### Zero/default normalization correction

Replaced truthy-default normalization only where zero is a legal value.

Corrected legal-zero parameters:

- Photo Filter `density = 0`
- Threshold `level = 0`
- Unsharp Mask `amount = 0`
- Emboss `strength = 0`
- Reduce Noise `strength = 0`
- Reduce Noise `preserveEdges = 0`
- Liquify Reconstruct `strength = 0`

A bounded numeric default helper now distinguishes:
- missing / NaN => configured default
- explicit numeric zero => zero

Parameters whose bounded domain excludes zero were not widened or redefined.

### Regression coverage added

- Photo Filter density zero is exact identity.
- Threshold level zero remains zero and maps black to white at the threshold boundary.
- Unsharp Mask amount zero is exact identity.
- Emboss strength zero remains zero rather than defaulting to one.
- Reduce Noise strength zero is exact identity.
- Reduce Noise preserveEdges zero remains zero rather than defaulting to 24.
- Liquify Reconstruct strength zero preserves the existing displacement rather than applying the default reconstruction amount.

### Full P1-F QA rerun

Command target:

```text
node --test qa/ink-p1-f-raster-processing-expansion.test.mjs
```

Result:

```text
tests = 40
pass = 40
fail = 0
skip = 0
```

### Correction exact blobs

- `product/source/src/image/raster-processing-advanced.js`
  - `4234e2aacbd8febf6870f635888336e728f461d3`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`
  - `a23bf1f036ac04a118bfb91eb4dd58576ffd7c19`

### Bounded correction isolation

Before this progress update, the delta from the prior P1-F handoff HEAD contained only:

- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`

```text
IMAGE_CORE_MUTATION = 0
P1_G_MUTATION = 0
P1_H_MUTATION = 0
DOCUMENT_MODEL_MUTATION = 0
RENDERER_MUTATION = 0
HISTORY_MUTATION = 0
INTEGRATION_MUTATION = 0
RUNTIME_RUN = 0
UI_MUTATION = 0
FORMAT_VERSION_MUTATION = 0
DEPENDENCIES_ADDED = 0
```

### Correction handoff

```text
CORRECTION_COMMIT = dac5dce2ad6c57c7ec91ce3524bfb6ad86810e1f
FULL_P1_F_QA = PASS 40/40 / FAIL 0 / SKIP 0
RUNTIME = NOT RUN
DEV_HANDOFF = YES
NEXT_ACTION = STOP FOR MR REVIEW
```

DEV does not self-merge, promote, enter Integration, run Runtime, or begin another package.


## MR exact-scope correction — six legal zero endpoints — 2026-09-27

This entry supersedes the immediately prior zero/default correction scope where DEV had also changed Liquify Reconstruct `strength=0`.

MR-authorized legal-zero endpoints are exactly:

1. `photoFilter.density = 0`
2. `threshold.level = 0`
3. `unsharpMask.amount = 0`
4. `emboss.strength = 0`
5. `reduceNoise.strength = 0`
6. `reduceNoise.preserveEdges = 0`

Liquify Reconstruct `strength=0` is NOT part of this MR correction scope and has been restored to the prior branch behavior.

SCOPE_CORRECTION_COMMIT:
`2bc3214d6cee22294398b57948737aa5e54a5d76`

SCOPE_CORRECTION_TREE:
`19fb874df1c40df2620b7e15a3357671121607aa`

### Exact correction blobs

- `product/source/src/image/raster-processing-advanced.js`
  - `8aca747a0825d37d79241fd0f666aa9a030a7619`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`
  - `21ada9d8a1815bb468084dc336bff9742ff60215`

### Regression set

Six legal-zero regressions remain and pass:

- Photo Filter density zero = exact identity.
- Threshold level zero = legal threshold endpoint.
- Unsharp Mask amount zero = exact identity.
- Emboss strength zero = zero-strength endpoint retained.
- Reduce Noise strength zero = exact identity.
- Reduce Noise preserveEdges zero = legal edge-preservation endpoint.

The previously-added Liquify Reconstruct zero regression has been removed.

### Full P1-F QA rerun

```text
tests = 39
pass = 39
fail = 0
skip = 0
```

### Isolation

The scope-constraining commit from the previous DEV handoff changes only:

- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`

No changes were made to:

```text
image-core.js
P1-G
P1-H
Document
Renderer
History
Integration
Runtime
UI
FORMAT_VERSION
```

### Final handoff

```text
SCOPE_CORRECTION_COMMIT = 2bc3214d6cee22294398b57948737aa5e54a5d76
AUTHORIZED_ZERO_ENDPOINTS = 6
FULL_P1_F_QA = PASS 39/39 / FAIL 0 / SKIP 0
RUNTIME = NOT RUN
DEV_HANDOFF = YES
NEXT_ACTION = STOP FOR MR REVIEW
```

DEV stops here.


## MR final normalization bounded correction — 2026-09-27

Gate:
`P1_F = MR_REVISE / FINAL_NORMALIZATION_BOUNDED_CORRECTION`

FINAL_NORMALIZATION_COMMIT:
`48a54869fc2e104e317d858db0fec2cd7bf4adf9`

FINAL_NORMALIZATION_TREE:
`b83010e7521b24cd723ddf7bb73b7f706514281b`

### numberOr() normalization

`numberOr(value, fallback)` now accepts only values satisfying:

```text
typeof value === 'number'
Number.isFinite(value) === true
```

Therefore:

- finite numeric `0` remains `0`
- other finite numbers remain unchanged
- `NaN` -> fallback
- `+Infinity` -> fallback
- `-Infinity` -> fallback
- non-number values -> fallback

The six MR-authorized legal-zero endpoints remain unchanged:

1. `photoFilter.density`
2. `threshold.level`
3. `unsharpMask.amount`
4. `emboss.strength`
5. `reduceNoise.strength`
6. `reduceNoise.preserveEdges`

No Liquify behavior was modified.

### Regression coverage

Existing six legal-zero regressions remain.

Added non-finite normalization regression across all six endpoints. Each endpoint is verified for:

- `NaN`
- `+Infinity`
- `-Infinity`

Each non-finite result must exactly match the existing omitted-parameter fallback behavior.

### Full P1-F QA rerun

```text
tests = 40
pass = 40
fail = 0
skip = 0
```

### Exact blobs

- `product/source/src/image/raster-processing-advanced.js`
  - `1ede3198687ee0a92a54f7c77a2020d55e34ad2c`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`
  - `66982fdb7783ed0e236698cd071dccbd4e06f55f`

### Isolation

Correction commit changed only:

- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`

```text
OTHER_CAPABILITY_MUTATION = 0
LIQUIFY_MUTATION = 0
IMAGE_CORE_MUTATION = 0
P1_G_MUTATION = 0
P1_H_MUTATION = 0
DOCUMENT_MODEL_MUTATION = 0
RENDERER_MUTATION = 0
HISTORY_MUTATION = 0
INTEGRATION_MUTATION = 0
RUNTIME_RUN = 0
UI_MUTATION = 0
FORMAT_VERSION_MUTATION = 0
DEPENDENCIES_ADDED = 0
```

### Final handoff

```text
FINAL_NORMALIZATION_COMMIT = 48a54869fc2e104e317d858db0fec2cd7bf4adf9
AUTHORIZED_ZERO_ENDPOINTS = 6
NON_FINITE_REGRESSION = PASS
FULL_P1_F_QA = PASS 40/40 / FAIL 0 / SKIP 0
RUNTIME = NOT RUN
DEV_HANDOFF = YES
NEXT_ACTION = STOP FOR MR REVIEW
```

DEV stops here.
