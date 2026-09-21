# INK Development Chat Handoff

STATUS: `AUTHORITATIVE_HANDOFF_RULE`

## Purpose

Allow INK work to continue safely across independent ChatGPT windows without depending on chat history.

GitHub is the SSOT.

## New-window recovery sequence

Every new project window must first identify its role.

### DEV window

Read in order:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `ACTIVE/INK_DEV_PROGRESS.md`
8. only the files explicitly required by the Current Work Order

DEV must use the exact work branch named by the Current Work Order.

### MR / REVIEW window

Read in order:

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`
6. `ACTIVE/INK_REVIEW_STATUS.md`
7. DEV branch diff / commits / handoff deliverables
8. only the evidence needed for review

## Persistent branch rule

DEV work must be preserved on the work branch through meaningful commits.

The branch is not merely a delivery location; it is the development record.

DEV must:
- commit meaningful checkpoints;
- keep progress evidence in GitHub;
- record the latest branch HEAD;
- STOP at the MR gate;
- never self-merge to `main`.

## Review fingerprint

MR must review an exact branch fingerprint.

Minimum fingerprint:

```text
TASK_ID
WORK_BRANCH
BASE_COMMIT
HEAD_COMMIT
EXPECTED_CHANGED_FILES
```

If HEAD changes, prior review conclusions do not automatically apply.

## Handoff states

```text
AUTHORIZED
→ DEV_IN_PROGRESS
→ DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ MR_PASS / MR_REVISE / MR_HOLD
→ NEXT_WORK_ORDER
```

No role may skip a gate merely because the previous chat claims the task is complete.

## STOP rule

At `MR_REVIEW_REQUIRED`, DEV stops.

At `MR_PASS`, DEV still stops until a new Current Work Order exists.

Packaging, certification, version promotion and `package/ink-current` updates require separate explicit authorization.


## Shared collaboration language

For USER ↔ CHAT collaboration, keep language simple.

Examples:

```text
用 Figma 畫圖
用 INK 畫圖
讓 CHAT 用 INK 畫圖
```

These phrases mean: CHAT uses the target application's available structured controls, document model and editing operations to complete the intended visual result.

They do not imply literal mouse imitation or manual cursor simulation.

Do not over-explain this distinction in ordinary conversation. USER and CHAT share this understanding unless a technical implementation detail requires a more precise description.
