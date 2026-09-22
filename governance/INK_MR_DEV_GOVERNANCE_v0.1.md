# INK MR / DEV Governance v0.1

STATUS: `ACTIVE / AUTHORITATIVE_WORKFLOW`

## Purpose

This document defines the cross-window development workflow for INK.

The project uses a gated flow:

```text
USER
  ↓
MR (MAIN REVIEW)
  ↓ writes / updates ACTIVE bulletin
DEV
  ↓ implements only the authorized work order
DEV_PROGRESS
  ↓
MR REVIEW
  ↓ PASS / REVISE / HOLD / NEXT WORK ORDER
```

## Roles

### MR — MAIN REVIEW

MR owns:
- product direction and work decomposition;
- the current GitHub bulletin/work order;
- scope control;
- review of DEV evidence and code changes;
- acceptance / rejection / revision decisions;
- authorization of the next development step.

MR does not treat discussion alone as Runtime modification authorization.

### DEV

DEV:
- reads the current bulletin before doing work;
- implements only the explicitly authorized scope;
- preserves evidence and progress in GitHub;
- does not expand scope autonomously;
- stops at every MR gate.

## Authoritative active files

Read in this order:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`
6. role-specific active files:
   - DEV: `ACTIVE/INK_DEV_PROGRESS.md`
   - MR: `ACTIVE/INK_REVIEW_STATUS.md`
7. governance files explicitly named by the Current Work Order
8. only the product / research / QA files needed for that work order

The single authoritative task definition is:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Cross-window recovery is governed by:

`governance/INK_DEVELOPMENT_CHAT_HANDOFF.md`

Legacy/detail bulletin files may preserve history, but cannot authorize work that is not present in the Current Work Order.

## Gate rule

Every work order has a gate.

Normal sequence:

```text
AUTHORIZED
→ DEV_IN_PROGRESS
→ DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ MR_PASS / MR_REVISE / MR_HOLD
```

DEV must not start the next task merely because the previous implementation appears complete.

Only MR may change the current task to the next authorized work order.

## Mandatory DEV work branch

Every authorized DEV task must use a dedicated Git branch.

Rules:
- MR names the branch in the current work order.
- DEV must work only on that branch until MR review.
- DEV must commit meaningful progress checkpoints to the branch, not keep all work only inside chat.
- `ACTIVE/INK_DEV_PROGRESS.md` must be updated on the same branch.
- Each progress update must record the latest commit SHA and a short milestone note.
- MR reviews the branch commits / diff before PASS.
- DEV must not merge to `main`, update the package branch, or start another branch unless MR explicitly authorizes it.
- Final DEV handoff must leave the branch intact and STOP for MR review.

This makes the Git branch itself the durable implementation/progress record.

MR must pin the exact DEV branch HEAD in `working/WORKING_STATUS.md` before review. If the HEAD changes, the review fingerprint changes and the prior review is stale.

## Change discipline

Unless the current work order explicitly permits it, DEV must not:
- modify `product/source/`;
- change product identity or version;
- update `package/ink-current`;
- package or certify a build;
- delete historical / QA / research evidence;
- expand FLORA / AI / Recipe product boundaries;
- introduce a new framework or platform dependency.

## Evidence retention

DEV must update `ACTIVE/INK_DEV_PROGRESS.md` with:
- task ID;
- mandatory DEV work branch;
- latest commit SHA at each meaningful checkpoint;
- files read;
- files changed;
- tests or checks performed;
- known gaps;
- handoff status.

Long-lived research or architecture outputs belong under `research/` or `governance/`, not only in chat.

## Penpot reference rule

Penpot is currently a reference source for INK Cloud Editor development, not the product platform.

Until a specific work order authorizes code reuse:
- architecture and interaction patterns may be studied;
- source locations may be cited;
- code must not be copied into INK merely because Penpot is open source;
- license / dependency / architectural fit must be reviewed before any direct reuse.

## Product principle

The target is:

```text
INK core
+ mature vector-editor interaction patterns
+ cloud/file collaboration layer
+ GitHub traceability
= INK Cloud Editor
```

The target is not a Penpot fork and not a dependency on Figma MCP availability.


## Batched Runtime QA policy

USER-authoritative development policy:

```text
DO NOT require full real-browser Runtime QA after every bounded Work Order.
Accumulate several compatible bounded changes, then run one concentrated Runtime QA checkpoint.
```

Default cadence:

```text
2–4 bounded Work Orders
→ default target = 3
→ one concentrated Runtime QA batch
```

Every individual Work Order must still execute all practical non-runtime evidence before handoff:

- source/static checks;
- unit/deterministic checks;
- serialization/migration checks when relevant;
- lint/parse/import checks where available;
- exact changed-file / binding inventory;
- MR source review.

A Work Order may be promoted with:

`RUNTIME_QA = DEFERRED_TO_BATCH`

only when MR judges that its risk is compatible with batching and the deferred runtime debt is explicitly recorded in `working/WORKING_STATUS.md`.

Runtime must run immediately instead of batching when a Work Order changes or risks any of the following:

- document schema / migration / persistence integrity;
- renderer / WebGL / Canvas runtime;
- service worker / cache update mechanism where publication correctness depends on it;
- external dependency loading or browser module compatibility;
- input/device behavior that cannot be validated statically;
- destructive History / Revision semantics;
- release / certification / package gate;
- a user-reported runtime regression;
- MR cannot establish adequate confidence from source/static evidence.

A batch checkpoint should cover all accumulated deferred Work Orders in one browser session where practical.

After a batch PASS:

```text
all listed deferred Work Orders
→ RUNTIME_DEBT_CLEARED
```

After a batch FAIL:

```text
STOP new promotion where the failure may propagate
→ isolate the first failing accumulated change
→ bounded fix
→ rerun the affected batch
```

Runtime batching is a development-efficiency policy. It does not permit false claims of runtime verification before the batch actually executes.


## Delegated UI lane — UR

USER-authoritative delegation:

```text
MR = MAIN REVIEW / overall product + Core + Integration authority
UR = UI REVIEW / delegated UI-lane authority
```

MR defines only:

1. the UI lane's large-direction sequence;
2. branch-task boundaries;
3. role boundaries.

Within that pre-authorized UI sequence, UR does **not** wait for a new MR command between bounded UI tasks.

UR may autonomously:

- issue the next bounded UI workpack from the MR-approved UI sequence;
- create/name the dedicated `work/ink-web-ui-*` branch;
- write the branch-local Work Order and DEV progress baseline;
- supervise UI DEV;
- review DEV handoff;
- issue `UI_PASS / UI_REVISE / UI_HOLD`;
- clean-promote an accepted UI-only payload to current `main`;
- continue directly to the next pre-authorized UI task;
- record deferred UI Runtime debt.

UR must STOP and escalate to MR as `INTEGRATION_REQUIRED` if a UI task needs to change:

- Document authority or schema/migration;
- History semantics;
- Revision semantics;
- renderer / WebGL / Canvas engine;
- Recipe or Geometry core contracts;
- Core module contracts;
- destructive persistence behavior;
- product base version;
- package/certification;
- another lane's owned implementation.

UR does not need MR approval merely because `main` advanced. For a diverged UI branch, UR uses a clean promotion from current main and promotes only the reviewed UI payload.

### UI lane task authority

The main `ACTIVE/INK_CURRENT_WORK_ORDER.md` remains the global MR / Core / Integration bulletin.

For delegated UI tasks, UR may create a branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` on the dedicated UI branch. That branch-local Work Order is authoritative **only for that UI branch** and must remain inside the pre-authorized UI sequence.

Branch-local UI Work Orders and DEV progress files are excluded from clean promotion unless MR governance explicitly requires otherwise.

This delegation removes per-task MR orchestration while preserving one MAIN authority for cross-lane integration.

### UI Runtime cadence

UR may promote UI-only Work Orders with `RUNTIME_QA = DEFERRED_TO_BATCH` when source/static evidence is adequate and no immediate-runtime trigger exists.

UR does not wait for MR between UI tasks because of deferred Runtime debt.

The accumulated UI debt is handed to the Integration checkpoint. MR owns the cross-lane Runtime batch unless a future explicit delegation says otherwise.


## Core Module lane — MR supervised

MR owns the Core Module lane.

Core modules are prepared as independently testable capability packages before formal UI exposure or cross-module integration.

Required pattern:

```text
module contract
→ isolated implementation
→ deterministic/unit evidence
→ adapter boundary
→ MODULE_READY
→ Integration Queue
```

Core module Work Orders may modify shared core source only inside their named module boundary.

They must not:

- create a second Document / History / Revision / Renderer authority;
- add formal UI or change UI layout;
- directly wire themselves into the production shell unless the Work Order explicitly says Integration;
- mutate schema / FORMAT_VERSION without explicit MR authorization;
- merge into another lane's branch.

A module may be promoted to main while dormant or adapter-only if:

- the source is inert until explicitly called;
- tests prove deterministic behavior;
- existing product behavior is unchanged;
- no immediate-runtime trigger applies.

Formal product wiring of multiple prepared modules happens under an Integration Work Order and may be followed by one Runtime batch.

### Core module sequence

Current MR-owned sequence:

```text
CORE-MOD-000  Vector Geometry Kernel baseline / already established
CORE-MOD-001  AI Document Bridge
CORE-MOD-002  Semantic Region Grounding
CORE-MOD-003  Revision / Provenance
CORE-MOD-004  Visual Compare / Variant
CORE-MOD-005  Parametric Creative Structure
```

MR may revise the sequence only from evidence or a demonstrated dependency.
