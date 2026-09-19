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
3. `ACTIVE/INK_MAIN_REVIEW_BOARD.md`
4. `ACTIVE/INK_DEV_PROGRESS.md`
5. governance files explicitly named by the current work order
6. only the product / research / QA files needed for that work order

The active bulletin is:

`ACTIVE/INK_MAIN_REVIEW_BOARD.md`

If another document conflicts with the current bulletin on task scope, DEV must STOP and report the conflict.

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
