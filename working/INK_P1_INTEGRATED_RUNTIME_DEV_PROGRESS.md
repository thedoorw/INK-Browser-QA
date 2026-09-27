# INK DEV Progress — INK-P1-INTEGRATED-RUNTIME-001

TASK: `INK-P1-INTEGRATED-RUNTIME-001`

CONTROL_BRANCH: `work/ink-p1-integrated-runtime-001`

RUNTIME_AUTHORIZATION_MAIN: `5f2c004541f3eb7c8986d779d2738ed1b0d82f98`

MR_PINNED_RUNTIME_TARGET_SHA: `d1269334338531228ddfdd9383761cd419e58738`

STATUS: `BLOCKED_BEFORE_RUNTIME / EVIDENCE_CAPTURED / STOP_FOR_MR`

EXECUTION_OWNER: `DEV`

NEXT_OWNER: `MR`

PRODUCT_MUTATION: `PROHIBITED / VERIFIED_0`

UI: `HOLD / NOT TOUCHED`

WORKPACK:
`working/INK_P1_INTEGRATED_RUNTIME_DEV_WORKPACK_v1.0.md`

## Exact target rule

The authorized Runtime target remains exactly:

```text
d1269334338531228ddfdd9383761cd419e58738
```

The control branch HEAD was not substituted for the target SHA.

## Runtime workflow / requested command

Authoritative workflow:

` .github/workflows/ink-runtime-batch-windows.yml `

Authorized intended dispatch:

```text
workflow_dispatch
target_ref = d1269334338531228ddfdd9383761cd419e58738
```

The established workflow resolves `target_ref` to an exact SHA before the Windows job and then materializes product/runtime inputs from that pinned revision.

## Execution result

```text
P1_INTEGRATED_RUNTIME = NOT_EXECUTED
RUNTIME_RESULT = BLOCKED_BEFORE_RUN
RUN_ID = NOT_CREATED
ARTIFACT_ID = NOT_CREATED
TARGET_SHA = d1269334338531228ddfdd9383761cd419e58738
PRODUCT_SOURCE_MUTATION_DURING_RUNTIME = 0
```

No Runtime PASS or FAIL is claimed.

## Blocking evidence

### 1. No legal dispatch mutation is available in the active GitHub connector surface

The connected GitHub surface available to DEV can read workflow runs/jobs/artifacts and can rerun an existing workflow job/run, but it does not expose creation of a new `workflow_dispatch` event with `target_ref`.

The alternate queue trigger is intentionally a push to:

`ACTIVE/INK_RUNTIME_QUEUE.json` on `main`.

DEV did not use that route because this work order fixes the mandatory control/evidence branch as:

`work/ink-p1-integrated-runtime-001`

and DEV is not authorized to mutate main as a substitute for the missing dispatch operation.

### 2. Current central batch does not evidence the required complete P1 minimum coverage

The current workflow materialization/execution list includes the established Closure/P0/browser Runtime suites, but it does **not** materialize or execute:

`qa/ink-p1-integration-001.test.mjs`

That committed integration test is the current exact-target test covering the P1 integration authorities, including guide/snap persistence, 8/16/32-bit/color state, P1-F registration, Liquify registration, P1-H payload bridge, and integrated raster renderer dispatch.

Therefore a run of the current central batch, without an MR-authorized Runtime harness extension, would not by itself prove the complete minimum coverage required by this workpack.

DEV did not alter the Runtime harness because this lane is evidence-only and the workpack authorizes use of the established harness, not redesign of Runtime authority.

## Required coverage status

Because no legal complete Runtime run could be started, the following required Runtime areas remain `NOT_RUN` in this work order:

- startup/load;
- save/reopen;
- History Undo/Redo;
- Selection / masks;
- raster fill / retouch / advanced selection;
- transform / text / precision-layout;
- ruler / guides / snapping;
- layer effects;
- advanced adjustment / filter / Liquify;
- 8/16/32-bit, color/channel;
- PSD / PSB / TIFF / RAW adapter / EXR;
- renderer / output / export;
- recovery / storage.

```text
REQUIRED_RUNTIME_COVERAGE_EXECUTED = 0
TEST_FAILURES = NOT_APPLICABLE
TEST_SKIPS = ALL_REQUIRED_RUNTIME_AREAS_NOT_RUN
RUNTIME_DEBT = UNRESOLVED_EXECUTION_BLOCKER
```

## Environment / browser / runtime versions

Actual run environment was not instantiated, so no current-run browser/runtime versions are claimed.

Authoritative known self-hosted baseline from `governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md` remains:

```text
runner version = 2.337.0
runner labels = self-hosted / Windows / X64
PowerShell = Windows PowerShell 5.1
browser = Google Chrome available
```

These are baseline facts only, not evidence of a run for this task.

## Logs / evidence locations

Reviewed authority/evidence:

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `working/INK_P1_INTEGRATED_RUNTIME_DEV_WORKPACK_v1.0.md`
- `.github/workflows/ink-runtime-batch-windows.yml`
- `ACTIVE/INK_RUNTIME_QUEUE.json`
- `governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`
- exact target `qa/runtime/run-ink-runtime-batch.mjs`
- exact target `qa/ink-p1-integration-001.test.mjs`
- exact target Runtime browser harnesses.

GitHub workflow-run lookup for exact target SHA returned no existing Runtime run associated with this target.

## Product source mutation verification

Comparison:

```text
base = d1269334338531228ddfdd9383761cd419e58738
head = work/ink-p1-integrated-runtime-001
ahead = 5
behind = 0
product/source/** changed files = 0
```

Only governance/control/progress files differ from the target in the control branch.

```text
PRODUCT_SOURCE_MUTATION = 0
FORMAT_VERSION_CHANGE = 0
UI_CHANGE = 0
P2_CHANGE = 0
```

## DEV handoff

MR action is required before a valid full Runtime can execute:

- provide/authorize a legal exact-SHA dispatch path available to DEV, or perform the existing `workflow_dispatch` through an authorized executor;
- reconcile the central Runtime harness with the workpack's required P1 minimum coverage, without changing product source;
- then rerun against exactly `d1269334338531228ddfdd9383761cd419e58738`.

```text
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
STOP FOR MR
```
