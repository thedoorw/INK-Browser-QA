# INK P1-H Format Interoperability — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-H-FORMAT-INTEROPERABILITY-001`

OWNER: `MR / MAIN REVIEW`

MANDATORY_DEV_BRANCH: `work/ink-p1-h-format-interoperability-001`

UPSTREAM:
- P1-A through P1-E = MODULE_READY / MR_PASS / PROMOTED
- P1-G = MODULE_READY / MR_PASS / PROMOTED
- P1-F = independent lane; may still be in progress
- P1-H may run in parallel with remaining P1-F work because source boundaries must remain disjoint

UI STATUS: `HOLD`

RUNTIME STATUS: `PROHIBITED — ALL P1 A-H + P1 INTEGRATION BEFORE ONE INTEGRATED RUNTIME`

## 1. Goal

Close the P1 external image-format interoperability contract for:

1. PSD
2. PSB
3. TIFF
4. RAW
5. EXR

The goal is reliable import/export interoperability without replacing INK document truth, color authority, channel authority, renderer authority or save format.

P1-H must consume, not redefine, P1-G:
- 8/16/32-bit sample contract;
- RGB / CMYK / Lab / Multichannel descriptors;
- ICC preservation/inspection/transform boundary;
- alpha / spot / auxiliary channel semantics.

## 2. Architecture rule

External formats are adapters around INK-native data.

```text
external bytes
→ format probe / bounded parser or decoder adapter
→ normalized interoperability payload
→ P1-G color/channel Core
→ existing INK image/document integration later

INK-native state
→ normalized interoperability payload
→ bounded encoder/adapter
→ external bytes
```

No external format becomes a second Document authority.

At MODULE_READY, H owns codec/adapter Core and normalized payloads only. Final Document/History/UI wiring belongs to P1 Integration.

## 3. Shared normalized interoperability payload

H must define one common payload suitable for all five formats, including where available:

- format / version;
- width / height;
- bit depth;
- color mode;
- process channel count/names;
- alpha channels;
- spot/additional channels;
- ICC embedded bytes + profile inspection metadata;
- flattened/composite raster;
- layer/group descriptors when the format exposes them;
- layer raster payloads when supported;
- compression/encoding metadata;
- orientation/resolution metadata;
- original-format metadata preservation bucket;
- explicit warnings/losses;
- decoder/encoder provenance;
- capability status per feature.

Unknown data must not be silently discarded when bounded byte preservation is feasible.

## 4. PSD / PSB

Minimum native contract:
- recognize PSD (`8BPS` version 1) and PSB (`8BPS` version 2);
- validate dimensions/channel count/bit depth/color mode bounds;
- parse section lengths safely, including PSB 64-bit lengths where applicable;
- preserve color-mode data/image-resource/layer-mask section bytes when not natively interpreted;
- extract embedded ICC profile when present;
- expose layer/group/channel metadata where bounded parsing supports it;
- decode composite image for supported compression/sample combinations;
- preserve unsupported layer effects/smart-object/resource data as opaque metadata where bounded.

Encoder/adapter minimum:
- write a valid flattened PSD for supported bounded image sizes/sample modes;
- PSB export may use an adapter path if native encoding is not practical;
- explicitly report unsupported preservation on round trip.

No claim of perfect Photoshop round-trip parity is allowed.

## 5. TIFF

Minimum:
- little- and big-endian TIFF probe;
- classic TIFF IFD parsing with strict bounds;
- BigTIFF may be adapter-backed or explicitly unsupported with preserved capability status;
- strip/tile metadata;
- 8/16/32 sample metadata;
- RGB/CMYK/Lab/grayscale/multichannel-relevant tags where representable;
- alpha/extra samples;
- ICC profile tag preservation;
- resolution/orientation;
- bounded decode for at least uncompressed and one common compressed path available in the chosen implementation;
- bounded encode for at least uncompressed baseline TIFF or adapter equivalent.

Unsupported compression must return explicit decoder-required status, not corrupt output.

## 6. RAW

RAW is adapter-class decoding, not a native Camera Raw redevelopment.

Required:
- identify supported RAW family through adapter probe;
- preserve original bytes/reference identity metadata;
- expose sensor/decode metadata returned by adapter;
- decode to a normalized 16-bit or 32-bit RGB raster when an approved decoder adapter supports the source;
- preserve embedded/derived profile metadata where available;
- explicit `decoder-unavailable` / `unsupported-raw-family` statuses.

No native demosaic/color-science engine is required.
No Camera Raw UI/editor is authorized.

RAW export is not required unless the underlying approved adapter explicitly supports a valid raw-encoding workflow.

## 7. EXR

Minimum:
- OpenEXR magic/version probe;
- header attribute parsing with bounds;
- dataWindow/displayWindow;
- channel names/types;
- HALF/FLOAT sample handling mapped without hidden 8-bit conversion;
- linear/HDR values preserved into P1-G 32-bit float contract;
- alpha/additional channel mapping;
- chromaticities/profile-related metadata preserved where available;
- decode at least one bounded scanline/tile path through native or adapter implementation;
- encode a basic RGB/RGBA HALF/FLOAT EXR through native or adapter implementation.

Unsupported multipart/deep/special compression features must report explicit capability status.

## 8. Decoder / encoder dependency rule

DEV may implement native bounded parsers and/or use a format-specific pure-JS/WASM adapter when needed.

A new dependency is authorized only when all are true:
- browser-compatible;
- deterministic for the covered fixture;
- license is recorded and compatible with repository distribution;
- no server/native executable requirement for normal Core execution;
- dependency is scoped to format decode/encode rather than owning INK document/color/history semantics.

If a required decoder violates these bounds:
`STOP → MR`.

Do not silently vendor an unreviewed binary.

## 9. Allowed source boundary

DEV may add:

- `product/source/src/image/format-interoperability.js`
- bounded helpers under `product/source/src/image/formats/`
- bounded adapter wrappers under `product/source/src/image/formats/adapters/`
- focused fixtures under `qa/fixtures/p1-h/`
- `qa/ink-p1-h-format-interoperability.test.mjs`
- `working/INK_P1_H_DEV_PROGRESS.md`

DEV may read/import:
- `product/source/src/image/color-management-core.js`
- `product/source/src/image/channel-core.js`

DEV must not modify:
- P1-G Core files;
- P1-F source;
- `image-core.js`;
- Document model/migration/storage;
- Renderer;
- `studio-core.js`;
- `ink.js`;
- History;
- CHAT;
- Recipe;
- FORMAT_VERSION;
- UI.

Any required modification outside the allowed boundary requires STOP → MR.

## 10. Focused QA

Required minimum:

### Common
- magic/header probe for all five format families;
- malformed/truncated input rejection;
- hard byte/section bounds;
- no input mutation;
- deterministic repeated parse/decode;
- normalized payload schema;
- explicit warning/loss reporting.

### PSD / PSB
- PSD probe + bounded header;
- PSB probe + 64-bit length fixture;
- composite raster decode fixture;
- ICC extraction fixture;
- layer/channel metadata fixture;
- flattened PSD encode/decode round-trip fixture.

### TIFF
- LE + BE fixture;
- IFD bounds rejection;
- 16-bit sample fixture;
- alpha/extra sample fixture;
- ICC/resolution/orientation fixture;
- supported decode + encode round-trip fixture.

### RAW
- adapter probe fixture;
- supported decode fixture when adapter is present;
- unsupported-family and decoder-unavailable explicit status;
- no Camera-Raw-engine overclaim.

### EXR
- magic/header fixture;
- HALF/FLOAT fixture;
- HDR value preservation >1.0;
- alpha/additional channel fixture;
- supported decode + encode round-trip fixture.

### P1-G convergence
- decoded bit depth maps to P1-G contract;
- decoded color mode maps to P1-G contract;
- ICC bytes survive normalized payload;
- alpha/spot/additional channels map through P1-G channel semantics;
- no hidden 8-bit conversion in 16/32-bit paths.

Required:

```text
P1_H_FOCUSED_QA = PASS
FAIL = 0
SKIP = 0
```

If an adapter-dependent fixture cannot execute in the repository environment, that capability is not MODULE_READY unless the workpack explicitly permits an unsupported status for that subfeature.

## 11. MODULE_READY gate

MR may mark P1-H MODULE_READY only when:
- all five format families have an explicit, tested interoperability path/status;
- required native/adapter decode paths are operational for the bounded fixtures above;
- required PSD/TIFF/EXR bounded encode paths are operational;
- RAW remains an explicit decoder-adapter boundary rather than a fake native engine;
- P1-G color/bit-depth/channel semantics are reused;
- no second Document/Renderer/History authority exists;
- no FORMAT_VERSION or UI change occurs;
- focused QA passes.

## 12. DEV handoff

Report:
- exact branch HEAD;
- implementation commits;
- dependencies/adapters and licenses, if any;
- changed files;
- fixture inventory;
- focused QA command/result/count;
- per-format completion table;
- supported/unsupported matrix;
- exact blobs;
- bounded losses/limitations;
- confirmation:

```text
P1-G files changes = 0
P1-F files changes = 0
image-core.js changes = 0
document schema changes = 0
Renderer changes = 0
UI changes = 0
CHAT changes = 0
Recipe changes = 0
FORMAT_VERSION change = 0
second Document/Renderer/History authority = 0
Runtime = NOT RUN
```

Then STOP for MR review.
