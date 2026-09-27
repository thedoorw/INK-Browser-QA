# INK DEV Progress — INK-P1-INTEGRATED-RUNTIME-001

TASK: `INK-P1-INTEGRATED-RUNTIME-001`

CONTROL_BRANCH: `work/ink-p1-integrated-runtime-001`

RUNTIME_AUTHORIZATION_MAIN: `5f2c004541f3eb7c8986d779d2738ed1b0d82f98`

MR_PINNED_RUNTIME_TARGET_SHA: `d1269334338531228ddfdd9383761cd419e58738`

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

EXECUTION_OWNER: `DEV`

NEXT_OWNER_AFTER_HANDOFF: `MR`

PRODUCT_MUTATION: `PROHIBITED`

UI: `HOLD`

WORKPACK:
`working/INK_P1_INTEGRATED_RUNTIME_DEV_WORKPACK_v1.0.md`

## Exact target rule

The Runtime must execute against exactly:

```text
d1269334338531228ddfdd9383761cd419e58738
```

The control branch HEAD is not a substitute for the target SHA.

## Required execution

Use the established INK Runtime harness and accepted current product verification path.

Minimum coverage:
- startup/load;
- document open/save/reopen;
- History / Undo / Redo;
- Selection / masks;
- raster fill / retouch / advanced selection;
- transform / text / precision-layout;
- ruler / guide persistence + snap manipulation smoke;
- layer effects;
- advanced adjustment / filter / Liquify;
- 8/16/32-bit + color/channel paths supported by fixtures;
- PSD / PSB / TIFF / RAW-adapter / EXR fixtures supported by harness;
- renderer / output / export paths touched by Integration;
- recovery / storage integrity where involved.

## Evidence required

DEV must record:
- exact target SHA;
- exact Runtime command/workflow;
- run ID;
- artifact ID;
- browser/runtime/environment versions when available;
- PASS/FAIL summary;
- failing test names/steps if any;
- logs/evidence location;
- product source mutation count.

Successful handoff requires:

```text
P1_INTEGRATED_RUNTIME = PASS
TARGET_SHA = d1269334338531228ddfdd9383761cd419e58738
PRODUCT_SOURCE_MUTATION_DURING_RUNTIME = 0
RUNTIME_DEBT = 0
```

If any Runtime defect appears:

```text
CAPTURE EVIDENCE
→ DO NOT FIX PRODUCT
→ STOP
→ MR_REVIEW
```

## Handoff

After execution:
- update this file/evidence;
- STOP;
- return exact evidence to MR.
