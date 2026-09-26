# Repository Governance Cleanup Milestone — 2026-09-26

STATUS: `MR_PASS / GOVERNANCE_CLEANUP_COMPLETE`

TASK: `INK-REPOSITORY-GOVERNANCE-CLEANUP-001`

BASE_MAIN:
`ecc43333d9f43bd12f3ea6f8a423584dff37efe3`

## Purpose

Reset the repository document/governance surface after CHAT technical closure so future windows read current authority instead of accumulated historical task state.

## Structural result

```text
ACTIVE files       11 → 5
working files      52 → 1
executable workflows 7 → 1
product changes     0
qa changes          0
```

Current ACTIVE:

```text
ACTIVE/README.md
ACTIVE/INK_CURRENT_WORK_ORDER.md
ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
ACTIVE/INK_RUNTIME_QUEUE.json
ACTIVE/INK_DEV_NEW_WINDOW_START.md
```

Current working:

`working/WORKING_STATUS.md`

Current executable Runtime workflow:

`.github/workflows/ink-runtime-batch-windows.yml`

## New durable governance

- `governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`
- `governance/INK_CHAT_INTEGRATION_ARCHITECTURE_v1.0.md`
- `governance/INK_PRODUCT_UX_PRINCIPLES_v1.0.md`
- `governance/README.md`

## Archive actions

Completed CHAT/Closure/Runtime/Connector work:
`ARCHIVE/milestones/2026-09-26-chat-technical-closure/`

UI technical-debt evidence:
`ARCHIVE/milestones/2026-09-25-ui-tech-debt-cleanup/`

Original import/classification:
`ARCHIVE/original-import-1.6.5/`

Retired workflows are indexed at:
`ARCHIVE/workflows/README.md`

Pure global status logs were removed from the current tree because Git history already preserves them.

## Retired executable workflows

- ink-cloud-018-self-hosted-preflight
- ink-cloud-018-windows-runtime
- ink-ra-001-windows-runtime
- ink-v0.1-runtime-baseline
- ra0-9-baseline-import
- unpack-staging-zip

Their functions are complete/absorbed and exact historical YAML remains in Git history.

## Verification

```text
PRODUCT_QA_CHANGED = 0
CURRENT_AUTHORITY_STALE_REFERENCE_SCAN = PASS
ACTIVE_TARGET = PASS
WORKING_TARGET = PASS
WORKFLOW_TARGET = PASS
RUNTIME_RERUN = NOT_REQUIRED / GOVERNANCE-ONLY
```

Repository cleanup follows:
`governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`
