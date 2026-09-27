# INK P1-G Color / Bit Depth / Channels — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED / PARALLEL_LANE_G`

TASK: `INK-P1-G-COLOR-BITDEPTH-CHANNELS-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-g-color-bitdepth-channels-001`

PARALLEL_WITH: `INK-P1-F-RASTER-PROCESSING-EXPANSION-001`

BASELINE_MAIN: `PARALLEL_BRANCH_CUT — exact SHA recorded in lane progress file`

UPSTREAM:
- P1-A = MODULE_READY / MR_PASS / PROMOTED
- P1-B = MODULE_READY / MR_PASS / PROMOTED
- P1-C = MODULE_READY / MR_PASS / PROMOTED
- P1-D = MODULE_READY / MR_PASS / PROMOTED
- P1-E = MODULE_READY / MR_PASS / PROMOTED

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Build the Core color-data contract required by P1-H interoperability and final P1 Integration:

1. 8 / 16 / 32-bit raster sample workflow
2. RGB / CMYK / Lab / Multichannel color modes
3. bounded ICC color-management Core
4. Channels / alpha / spot channels

This lane is data/transform Core only. It does not change the current document FORMAT_VERSION or final Renderer wiring.

## 2. Bit-depth Core

Required raster buffer contract:

- 8-bit unsigned integer samples;
- 16-bit unsigned integer samples;
- 32-bit floating-point samples;
- explicit width / height / channel count / bit depth / color mode;
- normalized read/write conversion;
- deterministic 8↔16↔32 conversion;
- alpha semantics;
- finite-value validation;
- clamping rules for integer formats;
- Float32 preservation policy documented for HDR values.

No hidden conversion to 8-bit is allowed inside the Core contract.

## 3. Color modes

Required native mode descriptors and deterministic conversion primitives for:

- RGB
- CMYK
- Lab
- Multichannel

Minimum conversion paths:
- RGB ↔ XYZ/PCS ↔ Lab;
- RGB ↔ CMYK using an explicit bounded device-independent fallback model when no usable ICC transform is available;
- mode/channel naming and expected channel counts;
- alpha remains separate from process color channels.

Conversions must explicitly state profile/white-point assumptions and may not silently claim press-proof parity.

## 4. ICC Core

Required bounded ICC support:

- ICC v2/v4 header validation;
- profile class / color space / PCS inspection;
- tag-table parsing with bounds checks;
- profile fingerprint/identity metadata;
- embedded profile byte preservation;
- built-in profile descriptors at minimum for sRGB and Lab/PCS reference behavior;
- matrix/TRC RGB profile transform path when required XYZ/TRC tags are present;
- chromatic adaptation/white-point handling where data exists;
- explicit `unsupported-transform` result for profile structures not implemented rather than silent approximation.

LUT-based CMYK/complex ICC profiles may be preserved and inspected even when native transform execution is unsupported at MODULE_READY; P1-H must use this explicit capability boundary rather than discarding profile data.

No external/network color service is authorized.

## 5. Channel Core

Required:
- process channels derived from current color mode;
- arbitrary alpha channels;
- spot channels with name, preview color and solidity metadata;
- Multichannel arbitrary named channels;
- add/remove/rename/reorder auxiliary channels;
- extract channel plane;
- replace channel plane;
- validate matching dimensions/bit depth;
- deterministic channel serialization descriptor suitable for later document/format integration.

This is not a second Layer system.

## 6. Parallel source boundary

DEV may add:

- `product/source/src/image/color-management-core.js`
- `product/source/src/image/channel-core.js`
- `qa/ink-p1-g-color-bitdepth-channels.test.mjs`

DEV must not modify during this lane:

- `product/source/src/image/image-core.js`
- P1-F `raster-processing-advanced.js`
- document model/migration/storage
- Renderer / WebGL / Canvas2D
- `studio-core.js`
- `ink.js`
- History
- CHAT
- Recipe
- FORMAT_VERSION

Lane progress authority:
- `working/INK_P1_G_DEV_PROGRESS.md`

This no-overlap rule is mandatory so P1-F and P1-G can execute in parallel from the same baseline.

## 7. Authority rule

P1-G establishes one color/channel Core contract for later integration.

It must not create:
- a second Document authority;
- a second Layer authority;
- a parallel save format;
- a second Renderer;
- duplicate image-stack semantics.

P1 Integration will decide document fields, migration and renderer wiring after P1-F/G/H are accepted.

## 8. Focused QA

Required minimum:
- exact 8/16 integer endpoint conversion;
- 32-bit finite/HDR policy fixtures;
- round-trip normalized conversions within documented tolerance;
- RGB↔Lab deterministic fixtures;
- RGB↔CMYK fallback round-trip bounded fixture;
- color mode/channel-count validation;
- ICC v2/v4 valid-header fixtures;
- malformed/out-of-bounds ICC rejection;
- matrix/TRC profile transform fixture;
- unsupported ICC transform explicit status;
- embedded-profile byte preservation;
- alpha channel add/extract/replace;
- spot channel metadata;
- Multichannel ordering;
- dimension/bit-depth mismatch rejection;
- input immutability;
- repeat determinism;
- Node import/parse;
- no skipped tests.

Required result:

```text
P1_G_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

## 9. MODULE_READY boundary

At MODULE_READY:
- bit-depth Core exists;
- RGB/CMYK/Lab/Multichannel contracts exist;
- bounded ICC Core exists with explicit supported/unsupported transform behavior;
- channel/alpha/spot Core exists;
- focused QA passes;
- no FORMAT_VERSION/document/renderer integration has occurred;
- no Runtime is run.

## 10. DEV handoff

Report exact HEAD, changed files, QA command/count/result, completion table, blobs, limitations and confirm:

```text
image-core.js changes = 0
P1-F files changes = 0
document schema changes = 0
Renderer changes = 0
UI changes = 0
CHAT changes = 0
Recipe changes = 0
FORMAT_VERSION change = 0
second Document/Layer/Renderer authority = 0
P1-H scope intrusion = 0
Runtime = NOT RUN
```

Then STOP for MR review.
