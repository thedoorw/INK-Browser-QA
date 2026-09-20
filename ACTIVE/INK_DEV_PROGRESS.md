# INK DEV PROGRESS

STATUS: `INK-CLOUD-011 / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-011` |
| TITLE | `CHAT Review + Structured Edit Tasks v0.1` |
| BRANCH | `work/ink-cloud-011` |
| BASE_MAIN | `87f11645a38b83c2d770a8601dccb11324f5165c` |
| DEV_HANDOFF | `READY` |
| MR_REVIEW | `REQUIRED` |
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


### Phase C — complete

`APPROVAL_BOUNDARY = IMPLEMENTED`

Committed behavior:

- target existence/type/page validation;
- locked / hidden / unexposed / singular rejection;
- proposal-time expected document/page/target fingerprints;
- stale target rejection before approval/execution;
- browser-local proposal registry;
- explicit `PROPOSED → APPROVED` transition;
- explicit local approval token;
- token/state validation before execution eligibility;
- rejection remains document/History-neutral.

No product mutation occurs in inspect/propose/approve/reject.

Next: Phase D structured execution through accepted controllers/History.


### Phase D — complete

`BOUNDED_EXECUTION = IMPLEMENTED`

Approved tasks now route only through accepted authoritative paths:

- repaint/material → existing `PathRepaintMaterialController`;
- translate → existing `InkApp.translateSelection()` / composition-transform route;
- simplify/refine → existing `PathEditController`;
- committed mutation → existing target-scoped `HistoryManager`.

Additional guarantees:

- execution requires matching APPROVED state + local approval token;
- target fingerprints are revalidated immediately before execution;
- temporary selection is restored after structured operations;
- successful execution consumes approval state/token;
- result object reports operation, target fingerprints and History evidence;
- static/browser-local adapter is installed as `app.chatBoundedEditAdapter`;
- no remote service dependency introduced.

Next: Phase E regression/source evidence.


### Phase E — complete

`REGRESSION_EVIDENCE = RECORDED`

Executed evidence is recorded in:

- `qa/core/evidence/INK_CLOUD_011_STATIC_CHECKS.txt`.

PASS evidence:

- exact GitHub-source static architecture checks;
- exact-source lightweight syntax parse for collaboration module + new tests;
- isolated collaboration-contract harness from committed source blob;
- deterministic summary/proposal/approval behavior;
- approved repaint, translate and Path simplify operation families;
- stale/locked rejection and forced atomic rollback;
- branch scope compare: ahead, not behind authorized base;
- `FORMAT_VERSION = 4`;
- package mutation = 0;
- serialization surface mutation = 0.

Authored repository regressions:

- `qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs`;
- `qa/core/tests/unit/chat-bounded-edit-source-v0.1.test.mjs`.

Not executed:

- full repository Node runner — checkout unavailable because execution environment could not resolve github.com;
- browser/runtime QA — `DEFERRED` by Work Order.

No unexecuted check is claimed PASS.

Next: Phase F report + DEV handoff.


### Phase F — complete

`REPORT_AND_HANDOFF = COMPLETE`

Created:

- `research/INK_CHAT_BOUNDED_EDIT_LOOP_REPORT_v0.1.md`.

Acceptance gate:

```text
CHAT_STATE_SUMMARY = IMPLEMENTED
STRUCTURED_EDIT_TASK_SCHEMA = IMPLEMENTED
PROPOSAL_EXECUTION_SEPARATION = PRESERVED
APPROVAL_BOUNDARY = IMPLEMENTED
BOUNDED_EXECUTION = IMPLEMENTED
EXISTING_EDIT_CONTROLLERS = REUSED
HISTORY = REUSED
ATOMIC_FAILURE = PRESERVED
STATIC_BROWSER_LOCAL_CORE = PRESERVED
REMOTE_SERVICE_REQUIRED = 0
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
```

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-011
BRANCH = work/ink-cloud-011
GATE = CHAT_BOUNDED_EDIT_LOOP_WORKS
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
