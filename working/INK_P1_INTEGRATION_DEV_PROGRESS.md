# INK DEV Progress — INK-P1-INTEGRATION-001

TASK: `INK-P1-INTEGRATION-001`

BRANCH: `work/ink-p1-integration-001`

ACTIVATION_MAIN: `87f57980a071ff8f009f3aa354951d81025fecf0`

IMPLEMENTATION_HEAD_BEFORE_HANDOFF_DOC: `e2b2a3cec30bcc9ea23cd4d9de3eb2b1574d46bd`

STATUS: `DEV_COMPLETE / STOP_FOR_MR_REVIEW`

WORKPACK:
`working/INK_P1_INTEGRATION_DEV_WORKPACK_v1.0.md`

EXECUTION_OWNER: `DEV`

NEXT_OWNER: `MR`

UI: `NOT IMPLEMENTED / HOLD`

INTEGRATED_RUNTIME: `NOT RUN`

FORMAT_VERSION_CHANGE: `0`

## Upstream gate

```text
P1-A = MODULE_READY / MR_PASS / PROMOTED
P1-B = MODULE_READY / MR_PASS / PROMOTED
P1-C = MODULE_READY / MR_PASS / PROMOTED
P1-D = MODULE_READY / MR_PASS / PROMOTED
P1-E = MODULE_READY / MR_PASS / PROMOTED
P1-F = MODULE_READY / MR_PASS / PROMOTED
P1-G = MODULE_READY / MR_PASS / PROMOTED
P1-H = MODULE_READY / MR_PASS / PROMOTED
```

## Integration commit list

```text
f9e4a012a4dfd1f805981d0b4f94b1238bacd50f  docs(dev): initialize P1 Integration progress
9bdaf56718f1e9aacf3e1f3ce90c8e0fd4264812  feat(p1-integration): converge precision and transform snapping
83752c271c9019c8a66e9c5bef50c8bf42766a9c  feat(p1-integration): persist guide snap and color document state
9e2db87d064b3e10f279286df6b2ec359425504b  feat(p1-integration): register raster color and format authorities
63b775de66efc11f93d516ac2426a24fc6b503ac  feat(p1-integration): wire renderer guides snap and format routes
030ea34313674d5385b6d83222026df52762f676  test(p1-integration): add authority convergence QA
a8e843e10984a108f49430a5813080004b6534b0  fix(p1-integration): include document color clone authority
63827c65c2ff74922ee5a6fdce947ea93f1a8a81  fix(p1-integration): render persistent document guides
e2b2a3cec30bcc9ea23cd4d9de3eb2b1574d46bd  test(p1-integration): cover C D E authority wiring
```

## Changed files

```text
product/source/src/document/migration.js
product/source/src/document/model.js
product/source/src/editor/index.js
product/source/src/editor/precision-layout.js
product/source/src/editor/transform.js
product/source/src/image/color-management-core.js
product/source/src/image/format-interoperability.js
product/source/src/image/image-core.js
product/source/src/ink.js
product/source/src/studio-core.js
qa/ink-p1-integration-001.test.mjs
working/INK_P1_INTEGRATION_DEV_PROGRESS.md
```

No second Document / History / Renderer / Selection / Mask / Transform / Adjustment / Filter / Color / Channel authority was added.

## Authority reconciliation

| Domain | Existing authority retained | Integration result |
|---|---|---|
| Document / project state | `document/model.js` + migration/storage path | Added additive `page.guides`, `page.snap`, and document `colorState`; no FORMAT_VERSION bump. |
| History | Existing `HistoryManager` | Guide add/move/remove/lock/visibility and snap-setting mutations use existing scoped History path. |
| Transform / direct manipulation | Existing `editor/transform.js` | Movement and rotation snap through Transform authority; precision module supplies bounded snap calculation only. |
| Layout / precision | Existing P1-C `precision-layout.js` | Persistent guide state, unified categories, equal-distance, tolerance, hysteresis, evidence, angle snap. |
| Selection / masks | Existing image/selection authorities | P1-A / P1-E providers are exposed through existing image authority; no duplicate selection model. |
| Adjustment / Filter | Existing `image-core.js` stacks | P1-F advanced adjustment/filter IDs registered in existing stacks; Liquify represented as existing filter-stack item. |
| Renderer | Existing Renderer + existing Studio renderer extension | Persistent guides are rendered; P1-G raster state is consumed through bounded preview path; unsupported modes remain explicit. |
| Color / bit depth / ICC | Existing P1-G `color-management-core.js` | JSON-safe 8/16/32-bit raster state, ICC preservation/inspection, explicit bounded RGBA8 preview conversion. |
| Channels | Existing P1-G `channel-core.js` | Channel descriptors stay in color state; actual alpha/spot/additional channel data preserved in image raster state. |
| Format interoperability | Existing P1-H `format-interoperability.js` | PSD/PSB/TIFF/RAW/EXR normalized payload is bridged to one INK image state; InkApp import/export route consumes that bridge. |
| Text / advanced transform / vector appearance | Existing editor/text/vector authorities | P1-C advanced transform, text layout, measurement, gradient/pattern appearance exposed through existing editor facade. |

## Persistence / History / Render / Export wiring

| Item | Wiring |
|---|---|
| Guides | `page.guides` → migration/save-load → History → Renderer → snap target input |
| Snap settings | `page.snap` → migration/save-load → History → Transform snap authority |
| P1-F stack | Existing image adjustment/filter stacks → renderer image stack |
| Liquify | Existing filterStack item → `liquifyRaster`; source pixels remain non-destructive at stack level |
| P1-G | `colorState` descriptors + per-image `rasterState.colorRaster` / ICC / channels |
| P1-G render | Supported RGB/CMYK path → explicit bounded preview; unsupported Lab/Multichannel/ICC transforms return explicit unsupported diagnostic |
| P1-H import | external bytes → accepted decoder → normalized payload → single INK image `rasterState` + document color descriptor |
| P1-H export | INK image `rasterState` → normalized payload → accepted encoder; unsupported external semantics remain adapter-owned and explicit |

## Ruler / guide / snapping technical wiring

```text
persistent H/V guides        = WIRED
guide add                     = WIRED / History-backed
guide move                    = WIRED / History-backed / locked guide rejected
guide remove                  = WIRED / History-backed
guide lock                    = WIRED / History-backed
guide visibility              = WIRED / History-backed / renderer honors visibility
save/load/reopen              = WIRED through accepted Document migration/JSON path
global snap enable            = ONE OWNER: page.snap.enabled
per-category snap state       = ONE OWNER: page.snap.categories
guide snapping                = WIRED
edge snapping                 = WIRED
center snapping               = WIRED
grid snapping                 = WIRED
angle snapping                = WIRED
equal-distance snapping       = WIRED
temporary bypass              = WIRED without mutating saved setting
tolerance                     = NORMALIZED
hysteresis                    = NORMALIZED
live bounded evidence         = WIRED
direct manipulation           = WIRED through existing Transform authority
persistent guide rendering    = WIRED
ruler UI                      = NOT IMPLEMENTED / deferred to UI work
```

## Focused / integrated QA

Committed replay test:

```bash
node --test qa/ink-p1-integration-001.test.mjs
```

The current execution sandbox could not clone GitHub into the local container because outbound DNS to `github.com` is unavailable, so the committed Node test file was not launched from that container.

Instead, the exact current branch sources were fetched from GitHub SSOT and executed in isolated exact-source harnesses. Results:

```text
functional exact-source checks = 20 PASS
syntax checks on modified source files = 10 PASS
FAIL = 0
SKIP = 0
```

Covered:
- guide add/move/lock/visibility;
- History commit/undo/redo;
- guide / edge / center / grid / angle snapping;
- temporary bypass;
- hysteresis;
- 16-bit persistence;
- 32-bit HDR source preservation + bounded preview;
- explicit unsupported Multichannel render path;
- P1-F advanced adjustment/filter registration;
- Liquify registration;
- source immutability through non-destructive image stack;
- P1-G document color state normalization;
- P1-H bit-depth / alpha / spot / additional-channel / metadata bridge;
- P1-C measurement and vector fill descriptor exposure;
- P1-D layer effects;
- P1-E object selection;
- persistent guide renderer wiring.

```text
P1_INTEGRATION_QA = PASS
FAIL = 0
SKIP = 0
INTEGRATED_RUNTIME = NOT RUN
```

MR should replay the committed `node --test` command in a repository-capable environment before promotion.

## Exact source blobs

```text
document/migration.js              4fe277614002cc8f723e4bfe6b2e4029f0af02db
document/model.js                  6f3ffac0457cc3d29cd888276fcd432d949ce736
editor/index.js                    5e0ec31d1078551e23b0c8a09e7c074af7a7ce6b
editor/precision-layout.js         3eea143f51e3d0a36bd35b1495ec7e193bfb6858
editor/transform.js                c12833f94e20ec615f480a10a8c3e1381f49d878
image/color-management-core.js     ac8b08427e8a4347a820a452ba5b5b813cc5201d
image/format-interoperability.js   13b7373ca0f74cb6be496615b8601e28dee06005
image/image-core.js                65f6c8c4ea19e2c3058d984c42e5989633e16bc4
ink.js                             3ef95f3b269d3518116e32fbc6f9d82828171fe4
studio-core.js                     7d0a6f0c02d943e1e7928ad109e8633ef5ddfcfb
qa/ink-p1-integration-001.test.mjs e560fc8be3d94010abae41d3ff54f44fc70a83b0
```

## Remaining Runtime-only risk

- Integrated browser Runtime was deliberately not run under this workpack.
- Browser Canvas / ImageData behavior for imported 16/32-bit + ICC assets remains Runtime-only verification.
- Real-file PSD / PSB / TIFF / RAW-adapter / EXR end-to-end import/export remains Runtime-only verification beyond promoted module contracts and integration harness.
- Persistent ruler/guide UI interaction is intentionally absent; only technical Document/History/Renderer/Transform wiring is complete.
- Final UI acceptance remains UR-owned after integrated Runtime authorization.

## Handoff

```text
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
STOP FOR MR REVIEW
```
