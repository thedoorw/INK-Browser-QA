# INK CURRENT WORK ORDER

STATUS: `INK-RUNTIME-AUTOMATION-001 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-RUNTIME-AUTOMATION-001` |
| TITLE | `Central Runtime Queue & Auto Dispatch v0.1` |
| ROLE_OWNER | `MR / RUNTIME INFRASTRUCTURE` |
| DEV_WORK_BRANCH | `work/ink-runtime-automation-001` |
| DEV_MODE | `BOUNDED_INFRASTRUCTURE` |
| PRODUCT_BEHAVIOR_MUTATION | `PROHIBITED` |
| UI_LAYOUT_MUTATION | `PROHIBITED` |
| DOCUMENT_SCHEMA_CHANGE | `PROHIBITED` |
| HISTORY_REVISION_GEOMETRY_RENDERER_CHANGE | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| SELF_HOSTED_WINDOWS_RUNTIME | `PRESERVE / CENTRALIZE` |
| EXTERNAL_BROWSER_AUTOMATION_DEPENDENCY | `PROHIBITED` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |

## Objective

Reduce user-facing Runtime ceremony while preserving exact-SHA evidence.

Target operating model:

```text
MR_PASS
→ clean promotion
→ MR registers task in central Runtime Queue
→ queue policy decides WAIT or READY
→ READY/high-risk change triggers one central Windows Runtime batch
→ workflow reads exact queued target SHA
→ UI + Creative + Geometry + task-specific eligible runtime checks
→ artifact/evidence
→ MR clears all covered runtime debt
```

Normal user interaction should require no SHA copy/paste and no workflow selection.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `governance/INK_SELF_HOSTED_WINDOWS_RUNTIME_STANDARD.md`
7. `.github/workflows/ink-runtime-batch-windows.yml`
8. `qa/runtime/run-ink-runtime-batch.mjs`

## Phase A — central queue contract

Create:

`ACTIVE/INK_RUNTIME_QUEUE.json`

Required schema intent:

- schema/version;
- state: `IDLE | ACCUMULATING | READY | RUNNING | PASS | FAIL`;
- exact `target_sha`;
- pending Work Order IDs;
- covered Work Order IDs;
- high-risk immediate-run flag/reason;
- default batch target = 3;
- allowed batch range = 2–4;
- last run ID / tested SHA / result;
- deterministic bounded JSON structure.

Queue is governance/runtime metadata only; never product document state.

Gate: `RUNTIME_QUEUE_CONTRACT_DEFINED`

## Phase B — no-copy manual fallback

Revise the central Windows Runtime workflow so manual dispatch no longer requires text entry.

Required behavior:

- `target_ref` becomes optional;
- blank manual input resolves `main` once at workflow start;
- resolved exact SHA is immediately pinned and recorded;
- explicit SHA/ref remains available only as advanced/debug override;
- all later materialization uses the pinned SHA;
- current git-free materialization, `windowsHide: true`, artifact preservation and cleanup remain intact;
- no PowerShell policy mutation;
- no external browser automation.

Gate: `RUNTIME_MANUAL_ZERO_TEXT_READY`

## Phase C — queue-driven automatic dispatch

The same central Runtime system must support automatic start from queue state.

Preferred bounded design:

```text
MR updates ACTIVE/INK_RUNTIME_QUEUE.json on main
→ push path trigger sees queue file
→ lightweight controller job reads queue
→ if state != READY: no Windows job
→ if state == READY:
     pin queue.target_sha
     run existing self-hosted Windows batch
```

Requirements:

- do not run Windows Runtime on every main push;
- only the queue file may trigger the queue controller;
- automatic run requires explicit `state = READY`;
- `high_risk = true` may allow immediate READY with fewer than default batch count;
- ordinary compatible work accumulates to default 3, allowed 2–4;
- target SHA comes from queue metadata, not user text;
- reject missing/invalid/nonexistent target SHA;
- do not silently substitute latest main if queue supplied an explicit target SHA;
- concurrency remains serialized;
- manual fallback remains available.

Gate: `RUNTIME_QUEUE_AUTO_DISPATCH_READY`

## Phase D — evidence / regression QA

Source/static QA must verify:

- blank manual dispatch path resolves main exactly once;
- explicit override still works;
- queue `ACCUMULATING` does not start Windows job;
- queue `READY` does start the runtime job;
- malformed target SHA is rejected;
- queue target SHA is the tested/materialized SHA;
- default batch target = 3;
- allowed range = 2–4;
- high-risk immediate run logic is explicit;
- no push-on-product-source full Runtime trigger is introduced;
- no TinyFish/external browser automation dependency;
- `windowsHide: true` remains;
- no `Set-ExecutionPolicy` / `ExecutionPolicy Bypass`;
- existing runtime batch validation logic remains compatible;
- `FORMAT_VERSION = 4`.

Gate: `INK_RUNTIME_AUTOMATION_001_SOURCE_READY`

## Runtime validation for this infrastructure change

Because this task changes the Runtime trigger itself, final MR closure requires one real self-hosted Windows test after promotion.

Preferred acceptance:

```text
promoted main
→ queue/manual central workflow
→ zero user-entered target text
→ exact SHA pinned
→ UI PASS
→ Creative PASS
→ Geometry PASS
→ artifact exact-SHA evidence
```

Final gate:

`INK_RUNTIME_AUTOMATION_001_RUNTIME_PASS`

## Hard boundaries

Do not:

- modify INK product behavior;
- add external browser automation;
- make TinyFish or any browser-agent plugin a dependency;
- trigger full Windows Runtime on every main/product-source push;
- remove exact-SHA evidence;
- make `main` mutable after pinning during a run;
- change FORMAT_VERSION;
- mutate package/ink-current;
- begin another implementation stage.

## Required report

`research/INK_RUNTIME_AUTOMATION_001_CENTRAL_QUEUE_AUTO_DISPATCH_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-RUNTIME-AUTOMATION-001
BRANCH = work/ink-runtime-automation-001
GATE = INK_RUNTIME_AUTOMATION_001_SOURCE_READY
PRODUCT_BEHAVIOR_MUTATION = 0
EXTERNAL_BROWSER_AUTOMATION_DEPENDENCY = 0
MANUAL_SHA_ENTRY_REQUIRED = 0
DEFAULT_BATCH_TARGET = 3
ALLOWED_BATCH_RANGE = 2-4
FORMAT_VERSION = 4
RUNTIME_QA = PENDING_MR_PROMOTION_AND_WINDOWS_RUNTIME
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
