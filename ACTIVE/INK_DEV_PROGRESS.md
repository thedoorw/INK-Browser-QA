# INK DEV PROGRESS

STATUS: `INK-CLOUD-013 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-013` |
| TITLE | `Integrated Creative Loop Validation v0.1` |
| BRANCH | `work/ink-cloud-013` |
| BASE_MAIN | `4de2a4324c318abebab6a3fb1dcd096b7d0ac78a` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `INTEGRATED_CREATIVE_LOOP_VALIDATED` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |

## Authorized sequence

1. Phase A — integrated deterministic fixture
2. Phase B — cross-stage invariants
3. Phase C — save/load integrated closure
4. Phase D — rose-window hard integrated benchmark
5. Phase E — bounded fixes + regression
6. Phase F — report + DEV handoff

## Core rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-013`.
- Validation-first; bounded cross-stage fixes only.
- Do not add a broad new feature family.
- Preserve existing Path/document/History/Revision/CHAT authorities.
- Use deterministic non-image fixture for the integrated harness.
- Run rose-window hard benchmark only if the registered fixture is available.
- Fixture unavailable => record `HARD_BENCHMARK = BLOCKED_BY_FIXTURE_INTAKE` and continue.
- Do not redesign workspace UI.
- Do not start multi-step CHAT planner/agent work.
- Do not update package.
- Do not merge main.
- Do not change FORMAT_VERSION without STOP.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`
