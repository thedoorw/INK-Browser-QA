# INK DEV Progress — INK-P1-INTEGRATION-001

TASK: `INK-P1-INTEGRATION-001`

BRANCH: `work/ink-p1-integration-001`

ACTIVATION_MAIN: `87f57980a071ff8f009f3aa354951d81025fecf0`

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

WORKPACK:
`working/INK_P1_INTEGRATION_DEV_WORKPACK_v1.0.md`

EXECUTION_OWNER: `DEV`

MR_OWNER: `MAIN REVIEW`

UI: `HOLD`

RUNTIME: `NOT AUTHORIZED INSIDE THIS WORKPACK`

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

## DEV authorization

DEV may now execute only the bounded P1 Integration workpack.

Required:
- integrate accepted P1 A-H into existing product authorities;
- complete ruler / guide / snapping technical wiring;
- reconcile Document / History / save-load / transform / renderer / output boundaries where authorized by the workpack;
- register accepted P1-F algorithms into existing Adjustment / Filter authority;
- connect P1-G color / bit-depth / ICC / channel contract;
- connect P1-H interoperability to the accepted product route;
- run focused/integrated QA with fail=0 / skip=0;
- hand off exact HEAD and evidence;
- STOP for MR.

Prohibited:
- integrated Runtime;
- final UI implementation;
- P2 expansion;
- second Document / History / Renderer / Selection / Mask / Transform / Adjustment / Filter / Color / Channel authority;
- FORMAT_VERSION mutation without separate MR authorization.

## Handoff contract

DEV must report:
- exact branch HEAD;
- exact activation main SHA;
- changed files;
- commit list;
- integration QA command/result;
- authority reconciliation table;
- persistence/history/render/export wiring;
- ruler/guide/snap wiring;
- exact blobs where practical;
- unresolved Runtime-only risks.

Then:

```text
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
```
