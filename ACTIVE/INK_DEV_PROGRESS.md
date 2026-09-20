# INK DEV PROGRESS

STATUS: `INK-CLOUD-012 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-012` |
| TITLE | `Revision Closure v0.1` |
| BRANCH | `work/ink-cloud-012` |
| BASE_MAIN | `8215489b7c52c741bccd927c38bd72749ea605cb` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `CREATIVE_LOOP_V1_COMPLETE` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Revision identity + snapshot contract
2. Phase B — capture + comparison metadata
3. Phase C — restore / reopen
4. Phase D — CHAT revision binding
5. Phase E — regression evidence
6. Phase F — report + DEV handoff

## Core rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-012`.
- Reuse existing document/file-envelope/storage/History architecture.
- Revision must preserve structured editable INK state.
- No flattening or raster substitution.
- Capture must not mutate the active document.
- Failed restore must be atomic.
- Core semantics must work with static hosting + browser-local execution.
- Remote service may be an optional adapter only.
- Do not run rose-window hard integrated benchmark.
- Do not merge main.
- Do not update package.
- Do not change FORMAT_VERSION without STOP.
- `RUNTIME_QA = DEFERRED`.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`
