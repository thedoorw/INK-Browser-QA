# INK DEV PROGRESS

STATUS: `INK-CHAT-VALIDATION-001 / PHASE_C / AUTHORIZED / DEV_NOT_STARTED`

## Task

```text
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = C_COLOR_LINE_BOUNDED_EDIT
BRANCH = work/ink-chat-validation-001-phase-c
BRANCH_BASE = c2e0b91cd1cbf96240e212a290877e7b82bd690e
TARGET_GATE = CHAT_COLOR_LINE_BOUNDED_EDIT_WORKS

PHASE_B = CLOSED / REGRESSION MUST REMAIN PASS
PRODUCT_SOURCE_MUTATION = 0 / NOT_STARTED
QA_MUTATION = 0 / NOT_STARTED
IMAGE_MODEL = 0
USER_IMAGE_PUBLIC_COMMIT = 0

DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
FORMAT_VERSION = 4 / PRESERVE
```

## Authorized Phase C scope

Validate existing Phase B editable output through the already accepted CHAT bounded-edit authority:

```text
Color Path
→ CHAT proposal
→ explicit approval
→ existing path.repaint.v1 fill edit
→ existing History / Undo / Redo

Line Path
→ CHAT proposal
→ explicit approval
→ existing path.repaint.v1 stroke edit
→ existing History / Undo / Redo
```

Also validate:
- proposal / approval = zero mutation;
- stale target = rejected without partial mutation;
- Reference object remains intact;
- Color / Line layer identity and object counts remain stable;
- Revision is not auto-created;
- private real-image acceptance remains outside Git.

## Not authorized

- ImageTracerJS retuning;
- new drawing/repaint engine;
- semantic part labeling;
- new arbitrary CHAT operations;
- automatic approval/execution;
- Document/History/Revision/Geometry authority changes;
- persistence/FORMAT_VERSION changes;
- UI-006 branch mutation;
- Phase D–F.

## UI parallel boundary

```text
UI lane = presentation / placement / responsive / interaction shell
CHAT lane = grounded target / proposal / approval / bounded edit validation
```

Shared-file overlap does not grant shared authority.

## DEV gate

```text
DEV_IN_PROGRESS
→ focused source/QA evidence
→ DEV_HANDOFF / STOP
→ MR review
→ exact-SHA Runtime
→ private real-image acceptance
```

DEV must record exact HEAD, changed-file list, tests and all authority-preservation checks before handoff.
