# INK DEV PROGRESS

STATUS: `INK-CLOUD-014 / READY_TO_START`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-014` |
| TITLE | `Creative Workspace Minimum UX v0.1` |
| BRANCH | `work/ink-cloud-014` |
| BASE_MAIN | `512426a20b4dcfd76fb6e90b38bfc9cd366e2833` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `CREATIVE_WORKSPACE_MINIMUM_UX_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — workspace state model and shell
2. Phase B — Reference → Extract → Path continuity
3. Phase C — Edit → Compose → Repaint continuity
4. Phase D — CHAT ↔ canvas bounded edit loop
5. Phase E — Revision capture / restore UX
6. Phase F — integrated workspace regression + report

## Core rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-014`.
- Expose existing controllers; do not duplicate document/editor authorities.
- Keep static-hosting + browser-local core.
- Do not start multi-step CHAT agent planning.
- Do not redesign Structure-Aware Reconstruction.
- Do not update package.
- Do not merge main.
- Keep `FORMAT_VERSION = 4`; if a bump is required, STOP.
- `RUNTIME_QA = DEFERRED`; never claim unexecuted runtime QA passed.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`
