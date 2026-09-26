# INK Document Lifecycle Standard v1.0

STATUS: `ACTIVE / AUTHORITATIVE_GOVERNANCE`

DATE: 2026-09-26

## Purpose

Keep the repository readable as INK grows.

Git history is the complete event history. The current tree is for current authority, reusable knowledge, durable governance, current work, and selected milestone evidence.

## Repository roles

```text
ACTIVE/
  current authority only

working/
  current task only

governance/
  durable rules reusable across tasks

research/
  technical knowledge, surveys, benchmarks, reports

ARCHIVE/
  selected historical milestones that remain useful to humans

Git history
  complete step-by-step historical record
```

## ACTIVE rule

A file belongs in `ACTIVE/` only when it changes what a current role should do now.

Normal target surface:

```text
ACTIVE/README.md
ACTIVE/INK_CURRENT_WORK_ORDER.md
ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md
ACTIVE/INK_RUNTIME_QUEUE.json
ACTIVE/INK_DEV_NEW_WINDOW_START.md
```

Do not keep append-only task history in ACTIVE.

## working rule

`working/` contains only current-task workpacks, handoffs, checkpoints, and the compact `WORKING_STATUS.md`.

At task closure:

```text
durable method / policy
→ governance/

durable technical knowledge
→ research/

important milestone evidence
→ ARCHIVE/milestones/

pure transient status
→ delete from current tree; Git history preserves it
```

## Governance rule

A governance file must remain useful after the task that created it ends.

Do not promote one-off task instructions into governance merely to preserve them.

Imported historical documentation under `governance/source/` is source evidence, not current authority unless an active governance file explicitly adopts it.

## Research rule

Research is not ACTIVE authority by default.

A research report may inform a Work Order, but a Work Order or governance document must explicitly cite it before it becomes controlling input.

Research should preserve useful:
- technology surveys;
- architecture analysis;
- benchmarks;
- implementation reports with reusable findings;
- external asset/license evidence.

## Archive rule

Archive only milestone evidence that is likely to be useful without replaying Git history.

Do not mirror every deleted status file into ARCHIVE.

Each milestone archive should prefer one summary README plus only the source evidence that materially helps future review.

## Workflow rule

`.github/workflows/` contains only current executable automation.

Completed task-specific workflows must be removed from the executable workflow surface when:
- their function has been absorbed by a current workflow; or
- their one-time import/bootstrap purpose is complete.

Reusable methods belong in governance/engineering documentation. Exact old YAML remains recoverable from Git history.

## Current Work Order size rule

`ACTIVE/INK_CURRENT_WORK_ORDER.md` is a current bulletin, not an event log.

Target:
- one current program;
- one current gate;
- current authority;
- current branch/workpack if applicable;
- required baseline;
- next action.

Historical superseded blocks should be removed after closure.

## Review evidence rule

Do not maintain global append-only:
- Review Status;
- Review Findings;
- Review Evidence;
- DEV Progress on main.

Instead:

```text
task branch
→ branch-local progress / checkpoint / handoff
→ exact-head review
→ durable task review or milestone summary if needed
→ closure
```

## Deletion rule

Deletion from the current tree is allowed when the content has:
- no current authority;
- no live product/QA dependency;
- no unique reusable research/governance value;
- no need for a curated milestone archive.

Git history is sufficient for pure transient task-state reconstruction.

Product source and regression QA are not cleaned under this document merely because filenames contain old task IDs.
