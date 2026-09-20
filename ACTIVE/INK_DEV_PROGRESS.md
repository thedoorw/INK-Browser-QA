# INK DEV PROGRESS

STATUS: `INK-CLOUD-011 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-011` |
| TITLE | `CHAT Review + Structured Edit Tasks v0.1` |
| BRANCH | `work/ink-cloud-011` |
| BASE_MAIN | `87f11645a38b83c2d770a8601dccb11324f5165c` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `CHAT_BOUNDED_EDIT_LOOP_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — CHAT inspection/state-summary contract
2. Phase B — edit-task / proposal schema
3. Phase C — validation + approval boundary
4. Phase D — structured execution
5. Phase E — regression evidence
6. Phase F — report + DEV handoff

## Core rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-011`.
- Read branch-local Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Reuse existing editor controllers and History.
- Proposal/preview must not mutate authoritative document state.
- Unapproved tasks must not execute.
- Core semantics must work with static hosting + browser-local execution.
- Remote AI/backend may be optional adapters only.
- Do not begin Revision closure.
- Do not merge main.
- Do not update package.
- Do not change FORMAT_VERSION without STOP.
- `RUNTIME_QA = DEFERRED`.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`
