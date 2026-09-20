# INK DEV PROGRESS

STATUS: `INK-CLOUD-008B / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-008B` |
| TITLE | `Expressive Stroke v0.1` |
| BRANCH | `work/ink-cloud-008b` |
| BASE_MAIN | `18edd731d1fb4e10100190a0b303b284010e3de6` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `EDITABLE_PATH_AND_STROKE_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — Stroke appearance contract
2. Phase B — Style mutation + History
3. Phase C — Renderer integration
4. Phase D — Existing natural-media bridge
5. Phase E — Integration / regression evidence
6. Phase F — report + DEV handoff

## Core rule

```text
Path Geometry != Stroke Appearance
```

Style changes must not rewrite Path geometry, identity, topology or extraction provenance.

## Rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-008b`.
- Read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not begin Composition/Repaint/CHAT.
- Do not run the rose-window benchmark.
- STOP for FORMAT_VERSION change, accepted architecture break, second core engine, destructive authoritative Path conversion, broad UI redesign or scope expansion.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`
