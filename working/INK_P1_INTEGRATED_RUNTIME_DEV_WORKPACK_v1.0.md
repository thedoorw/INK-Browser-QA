# INK P1 Integrated Runtime — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-INTEGRATED-RUNTIME-001`

OWNER: `MR / MAIN REVIEW`

EXECUTION_OWNER: `DEV`

MANDATORY_DEV_BRANCH: `work/ink-p1-integrated-runtime-001`

PRODUCT_MUTATION: `PROHIBITED`

UI STATUS: `HOLD`

## 1. Activation gate

This Runtime workpack may start only after:

```text
P1-A THROUGH P1-H = MODULE_READY / MR_PASS / PROMOTED
P1_INTEGRATION = MR_PASS / PROMOTED
RUNTIME_TARGET_SHA = exact promoted integration product SHA
```

MR-pinned Runtime target SHA:
`d1269334338531228ddfdd9383761cd419e58738`

This exact SHA is mandatory. A branch-only or later-main substitute is not accepted.

## 1A. Active authorization

```text
RUNTIME_TARGET_SHA = d1269334338531228ddfdd9383761cd419e58738
P1_INTEGRATION = MR_PASS / PROMOTED
PRODUCT_MUTATION = PROHIBITED
UI = HOLD
```

## 2. Responsibility

DEV executes the integrated Runtime.

MR does not manually perform the Runtime as the normal execution path. MR owns:
- Runtime authorization;
- exact-SHA target pinning;
- evidence review;
- PASS / REVISE / HOLD decision.

DEV owns:
- executing the authorized Runtime harness against the exact target;
- collecting run/artifact/log evidence;
- recording failures without modifying product code;
- handing the evidence back to MR.

## 3. Runtime immutability rule

This is an evidence-only lane.

DEV must not fix product code inside the Runtime branch.

If Runtime exposes a defect:

```text
RUNTIME_FAIL
→ capture exact evidence
→ STOP
→ MR_REVIEW
→ separate bounded correction Work Order if required
```

The failed Runtime evidence remains preserved.

## 4. Required Runtime coverage

Use the established INK Runtime harness and accepted current product verification path.

At minimum verify the integrated product behaviors affected by P1:

- core startup/load;
- document open/save/reopen;
- History / Undo / Redo;
- Selection / mask operations;
- raster fill/retouch/advanced selection;
- transform/text/precision-layout integration;
- ruler/guide persistence and snap manipulation smoke path;
- layer effects;
- advanced adjustment/filter/Liquify registration;
- 8/16/32-bit and color/channel integrated paths supported by current Runtime fixtures;
- PSD/PSB/TIFF/RAW-adapter/EXR interoperability fixtures supported by the harness;
- renderer/output/export paths touched by Integration;
- recovery/storage integrity where the integrated schema/data path is involved.

Runtime must target the exact MR-pinned SHA. No branch-only substitute is accepted.

## 5. Evidence

DEV records:

- exact target SHA;
- exact Runtime command/workflow;
- run identifier;
- artifact identifier;
- environment/browser/runtime versions where available;
- PASS/FAIL summary;
- failing test names/steps if any;
- logs/evidence locations;
- confirmation product source mutation = 0.

Required successful result:

```text
P1_INTEGRATED_RUNTIME = PASS
TARGET_SHA = exact MR-pinned integration SHA
PRODUCT_SOURCE_MUTATION_DURING_RUNTIME = 0
RUNTIME_DEBT = 0
```

## 6. DEV handoff

After execution, DEV updates Runtime progress/evidence and STOPs for MR.

MR independently reviews that:
- evidence belongs to the pinned SHA;
- required coverage ran;
- failures/skips are not hidden;
- artifacts correspond to the run;
- no product code was changed during Runtime.

Only MR may declare the Runtime gate closed.

## 7. Next gate after MR PASS

```text
P1_INTEGRATED_RUNTIME = MR_ACCEPTED
→ refreshed promoted capability authority
→ UR full-capability reconciliation
→ UI_HOLD may be cleared
→ UI implementation / visual acceptance
```
