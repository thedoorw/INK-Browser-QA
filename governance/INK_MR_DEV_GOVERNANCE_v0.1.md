# INK MR / DEV Governance v0.1

STATUS: `ACTIVE / AUTHORITATIVE_WORKFLOW`

## Purpose

This document defines the cross-window development workflow for INK.

The project uses two coordinated development lanes under one product:

```text
                         USER
                           │
             ┌─────────────┴─────────────┐
             │                           │
      MR — MAIN REVIEW             UR — UI REVIEW
      technical / Core             delegated UI lane
             │                           │
             ↓                           ↓
            DEV                         UI DEV
             │                           │
       DEV_HANDOFF                 DEV_HANDOFF
             │                           │
         MR REVIEW                   UR REVIEW
             │                           │
   Core / integration main     UI integrate to current main
             │                           │
             └─────────────┬─────────────┘
                           ↓
                       ONE INK MAIN
```

The reason for the delegated UR lane is operational, not organizational duplication: MR must remain free to continue INK technical/Core development while UR owns the quality and health of the user interface end to end.

## Roles

### MR — MAIN REVIEW

MR is the primary technical / Core governance authority.

MR owns:
- overall product direction and technical roadmap;
- Core / Renderer / Document / History / Revision / Geometry / CHAT / persistence boundaries;
- cross-lane integration decisions where UI work requires a non-UI authority change;
- technical work decomposition and global Current Work Order;
- Core/integration scope control;
- review of Core/technical DEV evidence and code changes;
- acceptance / rejection / revision decisions for MR-owned work;
- product-version / FORMAT_VERSION / package / certification authority;
- arbitration when UR escalates an UI task as `INTEGRATION_REQUIRED`.

MR is intentionally not the routine UI reviewer. UI visual quality, UI technical health, UI branch integration, and UI-on-main acceptance belong to UR while the work remains inside the delegated UI boundary.

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
MR = MAIN REVIEW / technical + Core + cross-lane authority
UR = UI REVIEW / end-to-end UI authority
```

### Why UR exists

UR exists so INK can continue advancing technically under MR while the interface is developed, reviewed, integrated, and kept healthy in parallel.

UR is not a second overall product governor and is not merely a planning assistant.

The delegated responsibility is:

> If the work is UI-only and does not require changing a frozen Core/product authority, UR owns the UI result from planning through the final state on `main`.

### UR end-to-end responsibility

Within the delegated UI boundary, UR owns:

- UI direction preparation from USER intent and accepted references;
- UI workpacks, measurement baselines, function inventories and Primary-Home classification;
- bounded UI Work Orders;
- dedicated UI branches and branch-local DEV progress;
- supervision of UI DEV;
- `UI_PASS / UI_REVISE / UI_HOLD`;
- UI source/static QA;
- UI technical-debt and health guardrails;
- responsive / typography / CSS / menu / panel / shell / branding / first-paint health;
- required screenshots and interaction evidence;
- reconciliation of the reviewed UI payload with the latest `main`;
- resolution of ordinary UI-only merge conflicts;
- clean promotion of accepted UI-only payloads to `main`;
- UI Runtime on the integrated `main`;
- visual verification on the integrated `main`;
- final UI closure only after the integrated main result is proven.

The following is explicitly forbidden as a closure model:

```text
UI branch looks correct
→ UR_PASS
→ hand responsibility to MR
→ merge later
→ discover UI is wrong on main
```

Required model:

```text
plan
→ UI DEV
→ UR review
→ reconcile with current main
→ integrate UI payload to main
→ main UI Runtime
→ main screenshots / interaction review
→ UI health delta
→ UR final closure
```

Therefore:

`UI_BRANCH_PASS != UI_COMPLETE`

and:

`UI_COMPLETE = VERIFIED_ON_CURRENT_MAIN`

UR may not use "not merged to main yet" as a reason that final UI quality is unknown. Integration and post-integration UI verification are part of UR responsibility.

### UR authority

Within a USER/MR-approved UI program boundary, UR may autonomously:

- issue the next bounded UI workpack;
- create/name dedicated UI planning and work branches;
- write branch-local UI Work Orders and DEV progress baselines;
- authorize UI DEV to start;
- require revision without returning to MR for ordinary UI defects;
- update or replace obsolete UI regression contracts when the accepted UI behavior changes;
- maintain UI function inventories and Primary-Home classification;
- enforce and evolve UI health rules that remain UI-only;
- run focused UI QA and UI browser Runtime;
- create required visual evidence;
- reconcile an accepted UI payload against current main;
- clean-promote UI-only changes to current `main`;
- verify the promoted result and issue final UI closure;
- continue to the next bounded task inside the already approved UI program.

This delegation is intentionally broad so MR can remain focused on technical/Core development.

### UI technical-health ownership

UR owns the authoritative UI health baseline and must enforce:

`governance/INK_UI_ENGINEERING_HEALTH_GUARDRAILS_v0.1.md`

At every UI handoff and before every final UI closure, UR must verify the required health delta.

A UI change is not acceptable merely because it looks correct. It must also preserve the accepted health contracts, including single authorities, responsive taxonomy, CSS discipline, typography authority, generated-shell authority, first-paint behavior, and absence of renewed technical debt.

Likewise, an UI change is not acceptable merely because static/Runtime QA passes. Required visual evidence must also pass.

### UI main-integration authority

For UI-only payloads, UR is authorized to integrate to `main` without a separate MR merge ceremony, provided all of the following are true:

- the diff remains inside the delegated UI boundary;
- no frozen Core authority is modified;
- the reviewed payload is reconciled against the current main rather than an obsolete base;
- generated artifacts are produced through their accepted generator path;
- UI health guardrails pass;
- required Runtime / visual evidence is produced after integration;
- the exact integrated main SHA is recorded.

If integration exposes a UI defect, UR remains responsible for correction.

If integration exposes a Core/cross-lane conflict, UR must STOP and escalate to MR.

### UR escalation boundary — STOP → MR

UR must stop and return the issue to MR as `INTEGRATION_REQUIRED` before modifying any of the following:

- Renderer / WebGL / Canvas engine semantics;
- Document authority, schema or migration;
- History semantics;
- Revision semantics;
- Geometry / Recipe Core contracts;
- CHAT proposal / approval / execution authority;
- persistence semantics;
- Core module contracts;
- FORMAT_VERSION;
- product base version;
- package / certification authority;
- another technical lane's owned implementation;
- any merge conflict whose correct resolution requires changing Core behavior rather than choosing the UI-side integration.

UR may identify and document such a need, but may not solve it by silently widening an UI Work Order.

### MR relationship to UI work

MR does not re-review every pixel, repeat UR's screenshot audit, or become the final hidden UI QA stage.

MR's responsibility is to keep the technical/Core boundary safe and to handle escalations that exceed UR authority.

If UR declares final UI closure under this governance, that closure means UR has already verified the actual integrated main UI.

### UI lane task authority

The main `ACTIVE/INK_CURRENT_WORK_ORDER.md` remains the global MR / Core / Integration bulletin.

For delegated UI tasks, UR may create a branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` on the dedicated UI branch. That branch-local Work Order is authoritative only for that UI branch and only inside the approved UI program.

Branch-local UI Work Orders and DEV progress files are not automatically promoted to main unless they are intentionally part of the durable governance/evidence record.

This delegation removes per-task MR orchestration while preserving one technical authority for Core and cross-lane changes.

### UI Runtime and closure

UR owns UI Runtime and visual acceptance for UI work.

Runtime batching may still be used for low-risk intermediate UI tasks, but no final UI stage/program closure may rely on deferred Runtime or branch-only screenshots.

Before final UI closure:

```text
current main exact SHA
→ UI Runtime
→ required main screenshots
→ interaction verification
→ UI health verification
→ UR_PASS / CLOSED
```

Cross-lane technical Runtime remains MR-owned when it validates Core or multiple technical lanes together. That does not replace UR's responsibility for the UI result on main.


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
