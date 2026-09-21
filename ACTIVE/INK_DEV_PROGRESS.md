# INK DEV PROGRESS

STATUS: `INK-RA-001 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-RA-001` |
| BRANCH | `work/ink-ra-001` |
| BRANCH_BASE | `94fbdb12753feecfe3dc7053677812c96cd2cf76` |
| CURRENT_PHASE | `PHASE_A / INK_GEOMETRY_INVENTORY` |
| DEV_HANDOFF | `NO` |
| TARGET_GATE | `STUDIO_VECTOR_GEOMETRY_KERNEL_INTEGRATED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| UI_MUTATION | `PROHIBITED` |
| PRODUCT_VERSION_CHANGE | `PROHIBITED_IN_THIS_TASK` |
| PACKAGE_MUTATION | `PROHIBITED` |

## Workpack

Read and execute:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Long sequence:

```text
Phase A — exact INK geometry inventory
Phase B — RA capability verification
Phase C — Paper.js / Clipper2 / Bezier.js isolated benchmark
Phase D — selection gate
Phase E — bounded INK-owned adapter implementation
Phase F — deterministic + real-browser closure
```

## Starting baseline

```text
RA_BASELINE = IMPORTED_REFERENCE_BASELINE
RA_FILES = 158
RA_BYTES = 19909084
RA_ZIP_SHA256 = 525fdff89305135eedebde4fa039517040220724fdee8e557a3d5a2ad5add1d4
INK_WEB_STAGING = LIVE
```

## Required DEV discipline

- meaningful checkpoint commit after each phase;
- update this file at each checkpoint;
- do not wait for user confirmation between phases unless Work Order STOP condition is hit;
- do not touch INK Web UI or display version;
- do not add permanent external dependency before Phase D selection gate;
- final DEV_HANDOFF then STOP for MR.
