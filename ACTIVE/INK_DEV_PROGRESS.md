# INK DEV PROGRESS

STATUS: `INK-CLOUD-008A / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-008A` |
| TITLE | `Path Editing Core v0.1` |
| BRANCH | `work/ink-cloud-008a` |
| BASE_MAIN | `1c29d4e1eee2158678b5cc351b673717fdd5c15e` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `EDITABLE_PATH_CORE_WORKS` |
| EXPRESSIVE_STROKE | `NOT_STARTED / OUT_OF_SCOPE` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Path edit state and selection contract
2. Phase B — Anchor and Bézier handle editing
3. Phase C — Topology editing
4. Phase D — Simplify / refine
5. Phase E — History / serialization / regression evidence
6. Phase F — report + DEV handoff

## Accepted baseline

INK-CLOUD-007 is promoted to main and provides:

```text
Reference → Extract → authoritative editable INK Path
```

008A must reuse existing vector primitives, object identity, History, serialization and SVG.

## Rules

- GitHub is SSOT.
- Read Current Work Order before implementation.
- Work only on `work/ink-cloud-008a`.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not start Expressive Stroke.
- Do not run rose-window benchmark.
- Do not begin 008B or later tasks.
- STOP for FORMAT_VERSION change, accepted contract break, second core engine, broad UI redesign or scope expansion.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`
