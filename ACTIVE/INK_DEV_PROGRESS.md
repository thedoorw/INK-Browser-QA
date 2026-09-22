# INK DEV PROGRESS

STATUS: `CORE-MOD-003 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `CORE-MOD-003` |
| TITLE | `Revision Provenance Module v0.1` |
| BRANCH | `work/ink-core-revision-provenance-003` |
| BRANCH_BASE | `c0adc842c1d1b52c8cdf74303e087704b0047caa` |
| TASK_STATUS | `AUTHORIZED / READY_TO_START` |
| CURRENT_PHASE | `PHASE_A / PROVENANCE_CONTRACT_INVENTORY` |
| DEV_HANDOFF | `NO` |
| MR_REVIEW | `PENDING_AFTER_HANDOFF` |
| TARGET_GATE | `CORE_MOD_003_MODULE_READY` |
| UI_MUTATION | `0 / PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `0 / PROHIBITED` |
| HISTORY_SEMANTICS_CHANGE | `0 / PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| MAIN_MERGE | `0 / PROHIBITED_BY_DEV` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |

## Planned phases

- Phase A — provenance contract inventory
- Phase B — pure provenance graph
- Phase C — read-only adapters
- Phase D — deterministic evidence

## Core rule

```text
normalize / trace / explain
not mutate / not restore / not replace Revision or History
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-003
BRANCH = work/ink-core-revision-provenance-003
FINAL_HEAD = <exact SHA>
GATE = CORE_MOD_003_MODULE_READY
UI_MUTATION = 0
REVISION_AUTHORITY_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
