# INK P1-G MR Review v1.0

STATUS: `MR_PASS / P1_G_MODULE_READY / PROMOTED`

TASK: `INK-P1-G-COLOR-BITDEPTH-CHANNELS-001`

REVIEWED_BRANCH: `work/ink-p1-g-color-bitdepth-channels-001`

REVIEWED_HEAD: `d90985320989607c527199e9c31d75fb6614bfca`

PROMOTION_MERGE: `fff2e6961a5f72d42134ca2fedca533be0aa31c7`

DATE: 2026-09-27

## MR verdict

```text
P1_G_COLOR_BITDEPTH_CHANNELS = PASS
P1_G_SCOPE = PASS
P1_G_AUTHORITY_PRESERVATION = PASS
P1_G_FOCUSED_QA = PASS (30/30)
P1_G_CHAD_DOUBLE_ADAPTATION_BLOCKER = RESOLVED
P1_G_MODULE_READY = YES
PRODUCT_BRANCH_PROMOTED = YES
INTEGRATED_RUNTIME = NOT RUN / PROHIBITED
```

## Reviewed product changes

- `product/source/src/image/color-management-core.js`
- `product/source/src/image/channel-core.js`
- `qa/ink-p1-g-color-bitdepth-channels.test.mjs`
- `working/INK_P1_G_DEV_PROGRESS.md`

No P1-F source, `image-core.js`, Document schema, Renderer, UI, CHAT, Recipe or FORMAT_VERSION change.

## Exact blobs

```text
color-management-core.js = 5e56e219e964912e85c68b644004f1b5c14dcbef
channel-core.js          = c3d5540f97af3c9fec94e6ac2a3e9b9053aa8bc1
focused QA               = 832800d9a46cb64f7a816553dee4ddcccc609410
```

## ICC chad re-review closure

Verified:
- device RGB → PCS matrix/TRC transform no longer applies `chad` a second time;
- PCS colorant tags remain authoritative for that transform path;
- `chad` remains parsed/preserved/inspectable;
- explicit native-illuminant → PCS and PCS → native-illuminant helpers isolate adaptation behavior;
- same PCS colorants produce the same device→PCS result with or without `chad`;
- D65→D50 pre-adapted colorant regression fixture prevents future double adaptation.

## Focused QA

```text
TESTS = 30
PASS = 30
FAIL = 0
SKIP = 0
```

## Next gate

P1-H may now consume the frozen P1-G color/bit-depth/ICC/channel Core contract.

Runtime remains prohibited until P1 A-H and P1 Integration close.
