# INK DEV PROGRESS

STATUS: `INK-CLOUD-010 / DEV_IN_PROGRESS / PHASE_A_COMPLETE`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-010` |
| TITLE | `Repaint + Material v0.1` |
| BRANCH | `work/ink-cloud-010` |
| BASE_MAIN | `7ac7c4a65d198c79cd713f389aea9da78928af94` |
| DEV_HANDOFF | `NOT_YET` |
| MR_REVIEW | `PENDING` |
| GATE | `REPAINT_MATERIAL_WORKS` |
| FORMAT_VERSION_CHANGE | `0 / REQUIRED_STOP_IF_NEEDED` |
| PACKAGE_MUTATION | `0 / PROHIBITED` |
| RUNTIME_QA | `DEFERRED` |

## Authorized sequence

1. Phase A — repaint/material contract
2. Phase B — mutation + History
3. Phase C — renderer integration
4. Phase D — composition integration
5. Phase E — regression evidence
6. Phase F — report + DEV handoff

## Core rule

```text
Geometry / Composition != Paint / Material Appearance
```

## Rules

- GitHub is SSOT.
- Work only on `work/ink-cloud-010`.
- Read Current Work Order before implementation.
- Commit every meaningful checkpoint.
- Update this file continuously.
- Run feasible source/static/unit/serialization checks.
- Never claim unexecuted checks as PASS.
- Do not merge main.
- Do not update package.
- Do not begin CHAT Review or Revision.
- Do not run rose-window benchmark.
- STOP for FORMAT_VERSION change, accepted contract break, second core engine, authoritative Path flattening/rasterization, broad UI redesign or scope expansion.

## Start state

`READY_FOR_DEV_WORK / BEGIN_PHASE_A`


## Checkpoint — Phase A

Status: `COMPLETE`

Checkpoint HEAD: `c8c92af47772c0a3b1f0febdb4bc5826d6a321f6`

Implemented:
- bounded `INK-PATH-MATERIAL-APPEARANCE` reference/fallback contract;
- geometry-independent fill/stroke/opacity repaint normalization;
- deterministic material fallback and unsupported-effect diagnostics;
- Path create/load normalization without FORMAT_VERSION change.

Files:
- `product/source/src/vector/paint-appearance.js`
- `product/source/src/vector/vector-core.js`
- `product/source/src/document/model.js`

Next: `BEGIN_PHASE_B / MUTATION_HISTORY`
