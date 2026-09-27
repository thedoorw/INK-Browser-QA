# INK P1 Integration — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED / AWAITING_BRANCH_CUT`

TASK: `INK-P1-INTEGRATION-001`

OWNER: `MR / MAIN REVIEW`

EXECUTION_OWNER: `DEV`

MANDATORY_DEV_BRANCH: `work/ink-p1-integration-001`

UI STATUS: `HOLD`

RUNTIME STATUS: `NOT AUTHORIZED INSIDE THIS WORKPACK`

## 1. Activation gate

Gate status: `SATISFIED`

This workpack may start only when:

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

All P1-A through P1-H gates are now MR_PASS / PROMOTED. MR must record the exact activation main SHA and cut `work/ink-p1-integration-001` before DEV starts.

## 2. Goal

DEV performs the complete technical integration of accepted P1 A-H Core modules into the existing INK product authorities.

This is the wiring stage that converts MODULE_READY capabilities into one coherent product path before the single integrated Runtime.

MR does not perform the implementation. MR authorizes, reviews and accepts/rejects the DEV handoff.

## 3. Required integration domains

DEV must reconcile accepted P1 capabilities with the existing single authorities for:

- Document / project state;
- Image / raster processing;
- Selection / masks;
- Transform / direct manipulation;
- Layout / precision;
- Renderer;
- History / Undo / Redo;
- save / load / recovery / migration;
- export / format interoperability;
- capability exposure required for later UI;
- deterministic module composition.

No second Document, History, Renderer, Selection, Mask, Transform, Adjustment, Filter, Color or Channel authority may be created.

## 4. Mandatory P1-C ruler / guide / snapping technical wiring

The following technical wiring is REQUIRED in this Integration workpack so the later UI can expose the already-locked twelve ruler/guide/snap behaviors without inventing new Core:

- persistent horizontal / vertical guide state wired into accepted Document authority;
- guide add / move / remove / lock / visibility wired to accepted mutation path;
- guide mutations converge with existing History / Undo / Redo;
- guide state survives accepted save/load/reopen flow;
- current smart edge / center / grid / angle snapping and P1-C equal-distance snapping converge under one manipulation snap authority;
- snapping applies through existing direct-manipulation / Transform authority;
- global snap enable state and per-target category state have one technical owner suitable for later UI;
- temporary snap bypass is supported without mutating the saved global setting;
- tolerance / hysteresis policy is normalized so competing snap candidates do not jitter or oscillate;
- live snap evidence contains enough bounded geometry for later visual guide / equal-spacing / distance feedback.

This workpack does not authorize final Photoshop-aligned UI.

UI acceptance remains owned by UR after integrated Runtime passes.

## 5. P1-F integration

DEV must connect accepted P1-F advanced raster-processing algorithms to the existing Image / Adjustment / Filter authorities rather than keeping them as isolated helpers.

Required:
- accepted adjustment identifiers reachable through existing adjustment-stack authority;
- accepted filter identifiers reachable through existing filter-stack authority;
- Liquify Core wired through accepted image mutation / non-destructive policy;
- History/save-load behavior reconciled where the current product contract requires persistence;
- no duplicate Adjustment or Filter stack.

## 6. P1-G integration

DEV must connect the accepted P1-G color/bit-depth/channel Core to the existing product data flow.

Required:
- 8/16/32-bit data policy reaches appropriate document/image boundaries;
- color mode / ICC / channel descriptors are preserved through relevant save/load/export paths;
- Renderer/output paths consume the accepted contract where supported;
- unsupported transforms remain explicit and never silently degrade;
- alpha / spot / multichannel metadata is not discarded by integration.

If preserving accepted P1-G state provably requires a document schema or FORMAT_VERSION change, DEV must STOP and provide exact evidence to MR. A schema/version mutation requires a separately recorded MR authorization before continuing.

## 7. P1-H integration

DEV must connect accepted PSD / PSB / TIFF / RAW-adapter / EXR boundaries to the product import/export route.

Required:
- adapters consume P1-G color/bit-depth/channel authority;
- imported external metadata does not become a second INK document truth;
- unsupported external semantics are explicit;
- no silent flattening/data loss when the accepted adapter contract says preserve/reject;
- export capability remains bounded by actual native support.

## 8. Integration QA

DEV must run focused integration QA covering at minimum:

- A-H module imports/exports and authority composition;
- save/load round-trip for newly persistent P1 state;
- History convergence for newly wired mutations;
- guide persistence + History + snap transform composition;
- P1-F stack registration;
- P1-G bit-depth/color/channel persistence;
- P1-H interoperability using frozen P1-G contract;
- renderer/output smoke checks where touched;
- no duplicate authority creation;
- no skipped tests.

Required:

```text
P1_INTEGRATION_QA = PASS
FAIL = 0
SKIP = 0
INTEGRATED_RUNTIME = NOT RUN
```

## 9. DEV handoff

DEV reports:

- exact branch HEAD;
- exact activation-main SHA;
- changed files;
- integration commit list;
- focused/integration QA command and result;
- authority reconciliation table;
- persistence/history/render/export wiring table;
- ruler/guide/snap technical wiring table;
- exact blobs where practical;
- any unresolved Runtime-only risks.

Then:

```text
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
```

MR reviews the exact HEAD. DEV does not run the integrated Runtime under this workpack.

## 10. Completion gate

MR may mark `P1_INTEGRATION_READY` only when:

- all accepted P1 A-H modules are product-integrated;
- the ruler/guide/snap technical wiring required above is complete;
- integration QA passes;
- no duplicate authority exists;
- no silent persistence/color/format loss is identified;
- any required FORMAT_VERSION change was separately authorized and reviewed.

After MR PASS/promotion, MR authorizes the dedicated DEV Runtime workpack.
