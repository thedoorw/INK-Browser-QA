# INK Active

STATUS: `CURRENT AUTHORITY INDEX`

## Read order

For every new INK window:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
6. `working/WORKING_STATUS.md`
7. role/task-specific governance or workpack files explicitly named by the Current Work Order

DEV also reads:
`ACTIVE/INK_DEV_NEW_WINDOW_START.md`

## Current authority

`ACTIVE/INK_CURRENT_WORK_ORDER.md`
= current program / gate / next action.

`ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
= installed technical capability truth.

`ACTIVE/INK_RUNTIME_QUEUE.json`
= central Windows Runtime queue state.

`working/WORKING_STATUS.md`
= compact cross-window current checkpoint.

## What is not ACTIVE

Historical:
- Workpacks;
- DEV checkpoints/handoffs;
- MR review logs;
- import status;
- superseded review boards;
- old workflow-specific state.

These belong in selected `ARCHIVE/` milestones or Git history.

Repository lifecycle rules:
`governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`
