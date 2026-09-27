# INK P1-F Raster Processing Expansion — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED / PARALLEL_LANE_F`

TASK: `INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-f-raster-processing-expansion-001`

PARALLEL_WITH: `INK-P1-G-COLOR-BITDEPTH-CHANNELS-001`

BASELINE_MAIN: `TO_BE_FILLED_AFTER_AUTHORIZATION_DOCS`

UPSTREAM:
- P1-A = MODULE_READY / MR_PASS / PROMOTED
- P1-B = MODULE_READY / MR_PASS / PROMOTED
- P1-C = MODULE_READY / MR_PASS / PROMOTED
- P1-D = MODULE_READY / MR_PASS / PROMOTED
- P1-E = MODULE_READY / MR_PASS / PROMOTED

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Implement the native P1 raster-processing breadth required before Runtime, without creating a second Adjustment Stack, Filter Stack, Renderer or History authority.

This lane owns algorithmic Core only:

1. Adjustment breadth
2. Filter breadth / Filter Gallery foundation
3. Liquify Core

The existing stack/data authority remains `product/source/src/image/image-core.js`.
P1-F must not modify that authority during parallel MODULE_READY work. P1 Integration will register/wire accepted algorithms into the existing stack.

## 2. Required adjustment breadth

Implement deterministic pure raster processors for at least:

- Exposure
- Vibrance
- Black & White
- Photo Filter
- Channel Mixer
- Color Lookup / bounded 3D-LUT application
- Invert
- Posterize
- Threshold
- Selective Color

Existing Brightness/Contrast, Levels, Curves, Hue/Saturation, Color Balance and Gradient Map stay owned by `image-core.js` and must not be duplicated.

Required:
- RGBA/alpha preservation unless the operation explicitly transforms alpha;
- bounded parameters;
- deterministic output;
- input immutability;
- optional per-pixel opacity/mask-compatible contract suitable for later stack integration.

## 3. Required filter breadth

Implement deterministic Core algorithms spanning mature filter categories, minimum:

- Motion Blur
- Median
- Unsharp Mask
- Emboss
- Mosaic / Pixelate
- Minimum
- Maximum
- Reduce Noise / bounded denoise

Existing Gaussian Blur, Sharpen, High Pass, Edge Detection, Noise/Grain and Texture Overlay stay owned by `image-core.js` and must not be duplicated.

Filter Gallery foundation means a normalized algorithm descriptor/registry suitable for later UI categorization; it does not authorize UI.

## 4. Liquify Core

Implement a deterministic bounded displacement-field Core supporting at minimum:

- Forward Warp
- Twirl
- Pucker
- Bloat
- Reconstruct toward original
- optional freeze/protect mask input

Required:
- bounded brush radius/strength;
- deterministic interpolation/sampling;
- source immutable;
- output dimensions unchanged;
- hard operation/work limit;
- no DOM/Canvas-only dependency;
- no document mutation or History ownership.

No face-aware/AI Liquify is authorized.

## 5. Parallel source boundary

DEV may add:

- `product/source/src/image/raster-processing-advanced.js`
- `qa/ink-p1-f-raster-processing-expansion.test.mjs`

DEV must not modify during this lane:

- `product/source/src/image/image-core.js`
- P1-G color/bit-depth/channel modules
- `studio-core.js`
- `ink.js`
- document model/migration/storage
- Renderer
- History
- CHAT
- Recipe
- FORMAT_VERSION

This no-overlap rule is mandatory so P1-F and P1-G can execute in parallel from the same baseline.

## 6. Authority rule

`raster-processing-advanced.js` is an algorithm provider, not a second Adjustment/Filter stack.

It may export:
- supported advanced algorithm identifiers;
- parameter normalization;
- pure application functions;
- Liquify displacement functions.

It must not create:
- a second adjustment item schema;
- a second filter stack schema;
- a second document mutation path;
- a second renderer.

P1 Integration will connect accepted algorithms to existing `createAdjustment/applyAdjustment/createFilter/applyFilter` authority.

## 7. Focused QA

Required minimum:
- one deterministic fixture per adjustment;
- alpha preservation;
- mask/opacity-compatible calculation contract;
- LUT identity + non-identity fixture;
- one deterministic fixture per filter;
- edge/bounds behavior;
- Liquify forward/twirl/pucker/bloat/reconstruct;
- freeze/protect mask if implemented;
- hard work-limit guard;
- no input mutation;
- repeat determinism;
- output dimensions preserved;
- Node import/parse;
- no skipped tests.

Required result:

```text
P1_F_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

## 8. MODULE_READY boundary

At MODULE_READY:
- required advanced adjustment algorithms exist;
- required filter breadth exists;
- Liquify Core exists;
- focused QA passes;
- existing `image-core.js` stack authority is unchanged;
- no UI/History/save-load/Runtime integration is required.

## 9. DEV handoff

Report exact HEAD, changed files, QA command/count/result, algorithm completion table, blobs, limitations and confirm:

```text
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

Then STOP for MR review.
