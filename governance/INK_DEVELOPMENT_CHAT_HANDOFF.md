# INK Development Chat Handoff

STATUS: `AUTHORITATIVE_HANDOFF_RULE`

## Purpose

Continue INK safely across independent ChatGPT windows without depending on chat history.

GitHub is the SSOT.

## Shared recovery sequence

Every window identifies its role, then reads:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
6. `working/WORKING_STATUS.md`

Then read only files required by the current role/task.

## DEV window

1. Read `ACTIVE/INK_DEV_NEW_WINDOW_START.md`.
2. Use the exact branch named by the Current Work Order.
3. On that branch, read `ACTIVE/INK_DEV_PROGRESS.md` if it exists.
4. Read the named workpack/governance/QA files only.
5. Work within scope, commit meaningful checkpoints, hand off, STOP at the owning Review gate.

Main does not maintain a global append-only DEV progress log.

## MR / UR review window

Review uses:
- current Work Order;
- current capability baseline;
- exact task branch HEAD;
- branch/task-specific checkpoint, handoff and evidence;
- only the product/QA/research needed to verify the task.

There is no global append-only Review Status / Findings / Evidence authority.

## Review fingerprint

Minimum:

```text
TASK_ID
WORK_BRANCH
BASE_COMMIT
HEAD_COMMIT
EXPECTED_CHANGED_FILES
```

If HEAD changes, the previous review fingerprint is stale.

## Gate

MR-owned:

```text
AUTHORIZED
→ DEV_IN_PROGRESS
→ DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ MR_PASS / MR_REVISE / MR_HOLD
```

UR-owned UI:

```text
UI_AUTHORIZED
→ UI_DEV_IN_PROGRESS
→ DEV_HANDOFF
→ UR_REVIEW_REQUIRED
→ UI_PASS / UI_REVISE / UI_HOLD
→ reconcile current main
→ main verification
→ UI_CLOSED
```

## Durable record rule

```text
current authority
→ ACTIVE/

current task state
→ working/ or branch-local task files

durable method
→ governance/

durable technical knowledge
→ research/

selected milestone evidence
→ ARCHIVE/

complete event history
→ Git history
```

Lifecycle:
`governance/INK_DOCUMENT_LIFECYCLE_STANDARD_v1.0.md`

## Shared collaboration language

Simple language such as:

```text
用 INK 畫圖
讓 CHAT 用 INK 畫圖
```

means CHAT uses the target application's available structured controls, document model and accepted editing operations.

It does not imply literal mouse imitation.
