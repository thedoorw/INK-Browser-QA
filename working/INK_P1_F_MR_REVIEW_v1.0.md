# INK P1-F MR Review v1.0

STATUS: `MR_REVISE / P1_F_NOT_MODULE_READY / BOUNDED_PARAMETER_NORMALIZATION_CORRECTION`

TASK: `INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

REVIEWED_BRANCH: `work/ink-p1-f-raster-processing-expansion-001`

REVIEWED_HEAD: `5abe3d8c696f6eb74a56da415587d9f4834121f5`

IMPLEMENTATION_COMMIT: `f176143be363c134f9b35fecb2c6d34be7391f26`

DATE: 2026-09-27

## MR verdict

```text
P1_F_SCOPE = PASS
P1_F_AUTHORITY_ISOLATION = PASS
P1_F_ALGORITHM_BREADTH = PASS
P1_F_LIQUIFY_BOUNDARY = PASS
P1_F_FOCUSED_QA_REPORTED = PASS 33/33
P1_F_PARAMETER_ZERO_SEMANTICS = REVISE
P1_F_MODULE_READY = NO
PROMOTION = BLOCKED
RUNTIME = NOT RUN
```

## Verified scope

Baseline `dcc41aa595bad8eaa73dce05a7b2fa988a7cce2f` → handoff contains only:

- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`
- `working/INK_P1_F_DEV_PROGRESS.md`

No image-core, P1-G, P1-H, Document, Renderer, History, CHAT, Recipe, FORMAT_VERSION or UI mutation was found.

Exact blobs reviewed:

```text
raster-processing-advanced.js = 7c62d46a36e177142d18e0d1ddd16929ce4c6b14
focused QA                    = d8bc46c7960bb7c789e6095cb43f0738134581b8
```

## Capability breadth

Required P1-F breadth is present:

- 10 advanced adjustments;
- 8 advanced filters;
- Filter Gallery descriptor foundation;
- Liquify Forward Warp / Twirl / Pucker / Bloat / Reconstruct;
- freeze/protect mask;
- deterministic source-immutable processing;
- opacity/mask composition;
- hard Liquify work limit.

The module remains an algorithm provider rather than a second Adjustment/Filter stack, as required.

## Blocking finding — legal zero parameters are replaced by defaults

Several parameter normalization paths use:

```text
Number(value) || default
```

This makes numeric zero indistinguishable from an omitted/invalid value.

The following accepted parameter ranges explicitly include zero and therefore currently produce incorrect endpoint semantics:

1. Photo Filter `density=0`
   - current code falls back to 25;
   - expected bounded behavior: zero density is a valid no-effect endpoint.

2. Threshold `level=0`
   - current code falls back to 128;
   - expected bounded behavior: threshold zero must remain zero.

3. Unsharp Mask `amount=0`
   - current code falls back to 100;
   - expected bounded behavior: zero amount is a valid no-effect endpoint.

4. Emboss `strength=0`
   - current code falls back to 1;
   - expected bounded behavior: zero must remain zero rather than silently becoming the default.

5. Reduce Noise `strength=0`
   - current code falls back to 50;
   - expected bounded behavior: zero strength is a valid no-effect endpoint.

6. Reduce Noise `preserveEdges=0`
   - current code falls back to 24;
   - expected bounded behavior: zero is a valid edge-threshold endpoint.

This is user-visible and would make future UI sliders incorrect at their lower bound.

Other parameters whose defined valid domain starts above zero, such as radius/distance/size, are not part of this blocker.

## QA gap

DEV reports:

```text
P1_F_FOCUSED_QA = PASS
TESTS = 33
PASS = 33
FAIL = 0
SKIP = 0
```

The checked-in test source has zero skip tokens, but it does not contain regression coverage for the legal-zero endpoints above.

## Bounded correction authorization

DEV may continue on the same P1-F branch only for:

1. fix number/default normalization so a finite numeric `0` is preserved when zero is in the valid domain;
2. keep omitted/non-finite values on the existing documented defaults;
3. add deterministic regression coverage for at minimum:
   - Photo Filter `density=0`;
   - Threshold `level=0`;
   - Unsharp Mask `amount=0`;
   - Emboss `strength=0`;
   - Reduce Noise `strength=0`;
   - Reduce Noise `preserveEdges=0`;
4. rerun full P1-F focused QA with fail=0 / skip=0;
5. update `working/INK_P1_F_DEV_PROGRESS.md`;
6. STOP for MR re-review.

Allowed files:
- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`
- `working/INK_P1_F_DEV_PROGRESS.md`

Prohibited:
- `image-core.js`;
- P1-G / P1-H files;
- Document / Renderer / History / UI;
- FORMAT_VERSION;
- P1 Integration;
- Runtime.

No architecture expansion is authorized.

## Promotion safety

Current main has advanced well beyond the P1-F branch cut. After final PASS, promotion must use an MR-controlled reconcile/merge preserving the reviewed P1-F payload.

Until then:

```text
P1_F = MR_REVISE / BOUNDED_CORRECTION
P1_H = MODULE_READY / MR_PASS / PROMOTED
P1_INTEGRATION = BLOCKED_PENDING_P1_F
RUNTIME = PROHIBITED
```
