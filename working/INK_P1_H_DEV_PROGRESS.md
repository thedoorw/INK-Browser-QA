# INK DEV Progress — INK-P1-H-FORMAT-INTEROPERABILITY-001

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

BRANCH: `work/ink-p1-h-format-interoperability-001`

BASELINE_MAIN: `136ca9c961ff0f2e543e196e74a3ae0983faaf78`

STATUS: `BOUNDED_CORRECTION_HANDOFF_READY / STOP_FOR_MR / PARALLEL_WITH_P1_F`

WORKPACK:
`working/INK_P1_H_FORMAT_INTEROPERABILITY_DEV_WORKPACK_v1.0.md`

UPSTREAM:
- P1-A through P1-E = MODULE_READY / MR_PASS / PROMOTED
- P1-G = MODULE_READY / MR_PASS / PROMOTED
- P1-G promotion merge = `fff2e6961a5f72d42134ca2fedca533be0aa31c7`
- P1-F = independent lane; may remain in progress

P1-G AUTHORITY INPUTS:
- `product/source/src/image/color-management-core.js` = `5e56e219e964912e85c68b644004f1b5c14dcbef`
- `product/source/src/image/channel-core.js` = `c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1`

IMPLEMENTATION_COMMIT:
`b47ab6c67665355a0ec41b0bda7332fffc7f0d45`

RUNTIME: `NOT RUN / PROHIBITED UNTIL ALL P1 A-H + P1 INTEGRATION CLOSE`

UI: `HOLD / PROHIBITED`

## Implemented scope

1. PSD
2. PSB
3. TIFF
4. RAW decoder-adapter boundary
5. EXR

## Added files / exact blobs

- `product/source/src/image/format-interoperability.js`
  - `9bbfb41508dedda69da36f7577fe524d273fa6f9`
- `product/source/src/image/formats/binary.js`
  - `3fc1d3225519b6cd3a37efba16cd65a0145b978f`
- `product/source/src/image/formats/normalized-payload.js`
  - `a8817b6ab5141981f8bc63d7957434568fb3ba61`
- `product/source/src/image/formats/psd.js`
  - `da14e912081807a4a7250162db60eba3cf7e4dda`
- `product/source/src/image/formats/tiff.js`
  - `736f6cd0eea1503d9d1ee4eeba1919127ad75bab`
- `product/source/src/image/formats/exr.js`
  - `aa73b9eef36c4f48ac314c1019c3767226b9f21e`
- `product/source/src/image/formats/adapters/raw-adapter.js`
  - `ff855ec93840da3806b1222b4c50bdd36f1f3c89`
- `qa/fixtures/p1-h/fixtures.mjs`
  - `b62b9e7310c85ed042e9b283ee745574c1391fa5`
- `qa/ink-p1-h-format-interoperability.test.mjs`
  - `8ff90c92cb9f7e6a1810f69e6d2938e33aeb1138`

Detached implementation tree:
`8f369062afe19815bcd064020aad7bdb6c3d116d`

All nine implementation/QA blob SHAs were re-fetched from the detached implementation commit and matched exactly before branch fast-forward.

## Focused QA

Command:

```text
node --test qa/ink-p1-h-format-interoperability.test.mjs
```

Result:

```text
tests = 48
pass = 48
fail = 0
skip = 0
cancelled = 0
todo = 0
```

The final QA run used exact frozen P1-G authority bytes:
- color-management-core = `5e56e219e964912e85c68b644004f1b5c14dcbef`
- channel-core = `c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1`

Covered:
- common normalized payload contract
- ICC preservation/inspection
- malformed/truncated rejection and hard bounds
- deterministic PackBits path
- input immutability
- PSD/PSB probe/header, PSB 64-bit section length, composite, ICC, bounded layer/channel metadata, flattened PSD round trip
- TIFF LE/BE, strict IFD bounds, 16-bit, alpha, ICC, orientation, raw + PackBits decode, baseline encode, BigTIFF boundary
- RAW adapter policy, supported 16/32-bit decode through injected approved adapter, unsupported family, decoder unavailable, original byte preservation
- EXR magic/header, HALF/FLOAT, HDR values > 1, alpha, chromaticities, basic encode/decode, special compression status
- P1-G convergence for bit depth / color mode / ICC / channel layout / no hidden 8-bit conversion
- facade routing and explicit unsupported/adapter-required statuses

## Format support matrix / bounded losses

### PSD
- Native bounded probe/parse: YES
- Composite decode: raw + PackBits
- ICC preservation/inspection: YES
- Bounded layer/group/channel metadata parse: YES
- Opaque preservation buckets for uninterpreted color-mode/resources/layer-mask bytes: YES
- Encode: flattened PSD v1 native
- Loss boundary: native encoder does not claim layered Photoshop round-trip, effects, smart objects, or perfect resource parity.

### PSB
- Native bounded probe/parse: YES
- 64-bit top-level section lengths: YES
- Composite decode path shares PSD raw + PackBits boundary
- Encode: adapter-required
- Loss boundary: no native PSB writer claim.

### TIFF
- Classic TIFF LE + BE: YES
- Strict classic IFD bounds: YES
- Strip metadata/decode: YES
- Tile metadata preservation: YES
- 8/16/32 sample path: YES; 32-bit requires float sample format
- RGB / CMYK / Lab / single-channel path: YES
- Alpha ExtraSamples: YES
- ICC / orientation / resolution metadata: YES
- Decode: uncompressed + PackBits
- Encode: baseline uncompressed TIFF
- BigTIFF: explicit adapter-required
- Loss boundary: tile pixel decode is not claimed; other compression families are explicit decoder-required.

### RAW
- Adapter boundary only: YES
- Adapter registration requires browser-compatible + deterministic + declared license: YES
- Supported adapter decode normalizes to 16/32-bit RGB: YES
- Original bytes/reference identity preserved: YES
- Decoder unavailable / unsupported family: explicit
- Native demosaic / camera color science: NOT IMPLEMENTED / NOT CLAIMED
- RAW export: NOT REQUIRED
- QA adapter is synthetic fixture-only and is not a product dependency.

### EXR
- Native magic/version/header bounds: YES
- dataWindow/displayWindow/channels: YES
- HALF/FLOAT scanline uncompressed path: YES
- HDR values preserved in P1-G Float32: YES
- Alpha and additional channels: bounded normalized path
- Chromaticities metadata: YES
- Encode: basic single-part RGB/RGBA HALF/FLOAT, uncompressed scanline
- Loss boundary: multipart, deep, tiled, and special compression are explicit unsupported/adapter-required or decoder-required paths; no parity claim beyond bounded path.

## Dependencies / licenses

```text
PRODUCT_DEPENDENCIES_ADDED = 0
UNREVIEWED_BINARY_DEPENDENCIES = 0
SERVER_OR_NATIVE_EXECUTABLE_DEPENDENCIES = 0
PRODUCT_LICENSE_ADDITIONS = 0
```

No external codec package was added.

## Isolation confirmation

```text
P1_G_CORE_MUTATION = 0
P1_F_MUTATION = 0
IMAGE_CORE_MUTATION = 0
DOCUMENT_MODEL_MUTATION = 0
RENDERER_MUTATION = 0
STUDIO_CORE_MUTATION = 0
INK_JS_MUTATION = 0
HISTORY_MUTATION = 0
CHAT_MUTATION = 0
RECIPE_MUTATION = 0
FORMAT_VERSION_MUTATION = 0
UI_MUTATION = 0
RUNTIME_RUN = 0
```

Baseline compare before handoff showed only the nine authorized P1-H implementation/QA additions plus this P1-H lane progress file.

## DEV handoff

```text
IMPLEMENTATION_COMMIT = b47ab6c67665355a0ec41b0bda7332fffc7f0d45
DEPENDENCIES_ADDED = 0
FOCUSED_QA = PASS 48/48 / FAIL 0 / SKIP 0
RUNTIME = NOT RUN
DEV_HANDOFF = YES
NEXT_ACTION = STOP FOR MR REVIEW
```

DEV does not self-merge, promote, run Runtime, or begin another package.


## MR bounded correction — 2026-09-27

MR REVIEW REFERENCE:
- `working/INK_P1_H_MR_REVIEW_v1.0.md`
- The referenced review file was not present on the P1-H branch or repository default branch when DEV began this correction.
- DEV executed only the explicit user-authorized correction scope:
  1. EXR additional-channel semantics
  2. TIFF ExtraSamples semantics
  3. fixtures / QA coverage
  4. full P1-H QA rerun
  5. progress update / STOP for MR

CORRECTION_COMMIT:
`5ed7f3a8506b25156be12e8a91df0a4bbf5e1546`

CORRECTION_TREE:
`ffc6d18a3f7f3d88cb98bbb6215257c5d545214f`

### Correction exact blobs

- `product/source/src/image/formats/normalized-payload.js`
  - `52b11f397c362b122a8cd800ab4487c5bb0f6d7f`
- `product/source/src/image/formats/exr.js`
  - `0a63bdfa5c3c00067221cd8ac09191108fb71bd0`
- `product/source/src/image/formats/tiff.js`
  - `871c3afb929d7cad6437c4dcd22ec2cd9818ac31`
- `qa/fixtures/p1-h/fixtures.mjs`
  - `c37ea00dcc216f9b573b0ddfaf1b0f94d93ffae9`
- `qa/ink-p1-h-format-interoperability.test.mjs`
  - `226ab9caa910bcd07583da58ef7f6ff679163411`

### EXR correction

- Arbitrary non-R/G/B/A EXR channels are no longer normalized as alpha channels.
- P1-H now carries them as semantically distinct `additionalChannels`.
- True `A` remains the alpha channel.
- Additional-channel descriptors are preserved in EXR metadata.
- Basic EXR encoder now explicitly rejects payloads containing unsupported additional channels instead of silently dropping them.

### TIFF correction

- `ExtraSamples=0` => unspecified extra data; preserved as `additionalChannels`, not alpha.
- `ExtraSamples=1` => associated alpha; decoded process samples are normalized to straight-alpha INK raster semantics and the storage normalization is explicitly reported.
- `ExtraSamples=2` => unassociated alpha; preserved as straight alpha without process-data unassociation.
- Invalid / ambiguous ExtraSamples semantics are explicitly rejected.
- Baseline TIFF encoder explicitly rejects unsupported additional channels instead of silently dropping them.

### Added fixtures / regression coverage

- TIFF unspecified extra sample fixture.
- TIFF associated-alpha fixture.
- EXR RGBA + independent `Z` additional-channel fixture.
- Regression assertions verify:
  - EXR `Z` is not alpha/spot.
  - TIFF unspecified extra is not alpha.
  - TIFF associated alpha is unassociated correctly.
  - TIFF unassociated alpha remains unassociated.
  - unsupported additional-channel encode paths fail explicitly.

### Full P1-H QA rerun

Command target:

```text
qa/ink-p1-h-format-interoperability.test.mjs
```

Result:

```text
tests = 54
pass = 54
fail = 0
skip = 0
```

The rerun consumed the exact frozen P1-G authority blobs:

- `color-management-core.js` = `5e56e219e964912e85c68b644004f1b5c14dcbef`
- `channel-core.js` = `c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1`

### Bounded correction isolation

```text
P1_G_CORE_MUTATION = 0
P1_F_MUTATION = 0
DOCUMENT_MODEL_MUTATION = 0
RENDERER_MUTATION = 0
INTEGRATION_MUTATION = 0
RUNTIME_RUN = 0
FORMAT_VERSION_MUTATION = 0
UI_MUTATION = 0
DEPENDENCIES_ADDED = 0
```

Correction delta before progress update contained only:
- `product/source/src/image/formats/normalized-payload.js`
- `product/source/src/image/formats/exr.js`
- `product/source/src/image/formats/tiff.js`
- `qa/fixtures/p1-h/fixtures.mjs`
- `qa/ink-p1-h-format-interoperability.test.mjs`

### Correction handoff

```text
CORRECTION_COMMIT = 5ed7f3a8506b25156be12e8a91df0a4bbf5e1546
FULL_P1_H_QA = PASS 54/54 / FAIL 0 / SKIP 0
RUNTIME = NOT RUN
DEV_HANDOFF = YES
NEXT_ACTION = STOP FOR MR REVIEW
```

DEV does not self-merge, promote, enter Integration, run Runtime, or begin another package.
