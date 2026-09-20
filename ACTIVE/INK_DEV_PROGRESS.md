# INK DEV PROGRESS

STATUS: `INK-CLOUD-011 / PHASE_B_COMPLETE / PHASE_C_IN_PROGRESS`

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

## Source reconnaissance

Existing authoritative routes selected for reuse:

- `PathRepaintMaterialController` for repaint/material appearance;
- `PathEditController` for bounded Path edits;
- `InkApp.translateSelection()` + existing composition/transform route for movement;
- existing target-scoped `HistoryManager` for committed mutation and rollback.

No second vector / transform / History / mutation engine is required.

## Checkpoints

### Start / Phase A

`PHASE_A_IN_PROGRESS`

Target: deterministic CHAT-facing document/page/selection/object summary with stable references and bounded geometry/appearance/provenance.


### Phase A — complete

`CHAT_STATE_SUMMARY = IMPLEMENTED`

Committed contract:

- `INK-CHAT-STATE-SUMMARY / version 1`;
- stable `pageId/layerId/objectId` references;
- deterministic hierarchy/render ordering from the authoritative page walk;
- effective visible/locked/opacity/exposure state;
- bounded geometry + appearance summary;
- Path geometry fingerprint;
- bounded extraction/source provenance;
- no raster/binary payload;
- shared editor export + static/offline shell cache entry.

Next: Phase B structured edit-task / proposal schema.


### Phase B — complete

`STRUCTURED_EDIT_TASK_SCHEMA = IMPLEMENTED`

Committed contracts:

- `INK-CHAT-EDIT-TASK / version 1`;
- `INK-CHAT-EDIT-PROPOSAL / version 1`;
- explicit task/proposal identity;
- stable target refs;
- operation allowlist only;
- bounded operation-specific arguments;
- optional expected preconditions;
- separate `PROPOSED` state with no approval token;
- deterministic diagnostic shape;
- no arbitrary code/eval surface.

Initial operation vocabulary is bounded to repaint/material, translate, and Path simplify/refine families.

Next: Phase C validation + explicit local approval boundary.
