# INK DEV PROGRESS

STATUS: `DEV_HANDOFF`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-004` |
| AUTHORIZED_SCOPE | `TRANSFORM / BOUNDS / COORDINATE SYSTEM FOUNDATION` |
| DEV_STATE | `DEV_HANDOFF` |
| MR_GATE | `MR_REVIEW_REQUIRED` |
| DEV_WORK_BRANCH | `work/ink-cloud-004` |
| BASE_BRANCH_HEAD_AT_START | `2d68ae4aa5dfdd29f1c1a864ccd3ddff5e96eb43` |
| LATEST_IMPLEMENTATION_COMMIT | `f49210b45878377bccdc18991e9300f66ab7a5ac` |
| DEV_VERIFICATION_CHECKPOINT | `15d46e733a8989b4ebd71efcc38a78e06f3dfeee` |
| REPORT_COMMIT | `391decde5f353540443b97a5a3230ce35602badd` |
| FINAL_HANDOFF_HEAD | `PENDING_THIS_COMMIT_SHA` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION_CHANGE | `0` |

## Baseline

Accepted INK-CLOUD-003 was promoted to main at:

`d340664cf554755abfa146f607c05c03200e8799`

The authorized work branch was initialized with control/status commits above that promotion baseline and no product-source mutation.

## Progress log

### Checkpoint 1 — SSOT / transform-bounds source audit

Required SSOT and accepted INK-CLOUD-001 / 002 / 003 reports read.

Audit identified:

- silent identity fallback on singular affine inversion in editable transform paths;
- reparent local-matrix derivation occurring after detach;
- selection bounds not sharing transform-root collapse semantics;
- Frame/Group bounds definitions embedded only in renderer code;
- single Frame W/H fields conflating geometry resize with affine scale;
- inverse-dependent hit/stroke-edit paths needing singular-safe behavior;
- interactive scale needing a deterministic near-zero rule.

### Checkpoint 2 — bounded coordinate / transform / bounds implementation

Implemented on this branch only:

- explicit affine helpers:
  - `Matrix.isFinite`
  - `Matrix.determinant`
  - `Matrix.isInvertible`
  - `Matrix.tryInvert`
  - `Matrix.toWorld`
  - `Matrix.toLocal`
- existing six-number affine representation and multiplication order retained;
- negative scale / reflection retained;
- interactive near-zero scale is clamped away from singular zero while preserving sign;
- world→local editable transforms reject non-invertible parent ancestry before mutation;
- multi-object transforms preflight every target and apply atomically;
- same-Layer reparent computes the target local matrix before detaching the source;
- shared bounds taxonomy added:
  - Frame local/world geometry bounds;
  - Group child-derived world geometry bounds;
  - explicit empty Group 1×1 world-origin fallback;
  - transform-root collapse;
  - selection world geometry bounds;
- selection bounds and transform roots now share the same ancestor/descendant collapse rule;
- Frame matrix transform remains distinct from Frame geometry resize;
- single selected Frame W/H fields resize `width/height` without rewriting Frame matrix or child local matrices;
- renderer/spatial/marquee/lasso/selection paths use the same renderer world-geometry bounds source;
- singular ordinary-object hit-test, stroke node editing and eraser inverse paths fail/skip safely;
- derived world/selection/container bounds remain runtime-derived and are not added to document model/migration;
- existing cross-Layer reparent rejection remains unchanged;
- `FORMAT_VERSION = 4` remains unchanged.

## Product files changed

- `product/source/src/core/math.js`
- `product/source/src/document/hierarchy.js`
- `product/source/src/editor/bounds.js` — new
- `product/source/src/editor/index.js`
- `product/source/src/editor/transform.js`
- `product/source/src/ink.js`

## QA files changed

- `qa/core/tests/unit/transform-bounds-coordinate-v0.1.test.mjs` — new

## Implementation commits

- `d152905825fdfedf1bd60a64696152d944b8fc03` — safe affine inversion contract
- `6bef593e34bedf8c5c510b1ded1c6af3aa7ba3a4` — singular-safe world/local transforms
- `84679843dd1cad383dab30386c550a475f738001` — shared geometry bounds taxonomy
- `f7f2423305f78e36a8308f4e2e61eeea7f259286` — export bounds contract
- `d50cfef75abba94247ee5f5cdaf9b4aace7d92cf` — reject singular reparent before mutation
- `19064e9b275c57e2c90dc5bba6457c30543dbcd2` — near-zero interactive scale rule
- `b46a9aefb0bb1c09f92e65c723a94d7e704c1afd` — editor bounds / Frame resize integration
- `14e6d2ec2df989454b0718b66b713a37899c8406` — initial transform-bounds QA
- `6574b2315c5ab29aa2624bbd08087f147c4f085c` — atomic batch world transforms
- `462001dd64ac817aa76aaeec4a1129efc1e7eedc` — multi-selection preflight integration
- `f49210b45878377bccdc18991e9300f66ab7a5ac` — batch transform QA coverage

## Checks actually executed

### Node pure-core/editor subset

Executed against the transform/bounds implementation before the final batch-preflight hardening:

- existing core tests: 3
- existing editor selection tests: 2
- new transform/bounds tests at that checkpoint: 6

Result:

`11 / 11 PASS`

Covered matrix inversion, bounds helpers, marquee/lasso behavior, singular rejection, reflection, atomic object-matrix transform, Frame/Group bounds, selection-root collapse, and Frame geometry resize.

### Current branch exact-source direct execution

After the final batch-preflight hardening, current GitHub source text for:

- `core/math.js`
- `core/geometry.js`
- `editor/transform.js`
- `editor/bounds.js`

was loaded from `work/ink-cloud-004` and executed directly.

Result:

`9 / 9 PASS`

Checks:

1. singular inversion rejection;
2. reflection round-trip;
3. single world transform fails before mutation;
4. batch world transform is atomic;
5. Frame explicit world bounds;
6. Group child-derived bounds + empty fallback;
7. selection transform-root collapse;
8. Frame geometry resize preserves matrix / child local matrix;
9. near-zero reflection-preserving scale clamp.

### Source/static checks

PASS:

- no unsafe `M.invert()` / `Matrix.invert()` remains in the touched editable hierarchy/transform/INK paths;
- `reparentPageObject()` derives `nextLocalMatrix` before source detach;
- cross-Layer reparent guard remains present;
- document model/migration do not contain authoritative `worldBounds`, `selectionBounds`, or `containerBounds` fields;
- `FORMAT_VERSION = 4`;
- History `pushScoped()` catches transform exceptions, restores pending scoped changes, clears pending state, and rethrows.

## Authored test note

Current `transform-bounds-coordinate-v0.1.test.mjs` contains seven Node tests.

The first six were executed through the Node subset run above. The seventh batch-preflight test was added afterward; its exact current-source logic was executed and passed in the 9/9 direct-source check, but the final seven-test file was not rerun as a full repository Node suite.

No unexecuted test is reported as Node PASS.

## Runtime QA debt

`RUNTIME_QA_DEFERRED`

Not claimed Runtime-verified:

- pointer move/scale/rotate;
- reflected transform visual behavior;
- singular transform live interaction;
- Frame W/H inspector live behavior;
- nested Frame/Group overlay geometry;
- marquee/lasso/hit-test visual agreement;
- browser save/open;
- creation/layout workspace camera interaction;
- structured SVG browser inspection.

## Handoff

Required report:

`research/INK_TRANSFORM_BOUNDS_COORDINATE_SYSTEM_REPORT_v0.1.md`

Report commit:

`391decde5f353540443b97a5a3230ce35602badd`

Handoff state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-004
BRANCH = work/ink-cloud-004
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

This handoff-status commit cannot contain its own resulting SHA. The exact final branch HEAD is reported in the DEV handoff response and must be pinned by MR before review.
