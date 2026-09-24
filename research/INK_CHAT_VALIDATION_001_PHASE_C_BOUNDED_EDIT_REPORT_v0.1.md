# INK-CHAT-VALIDATION-001 Phase C — Bounded Color / Line Edit Evidence v0.1

STATUS: `DEV_EVIDENCE_READY / MR_REVIEW_REQUIRED`

## Control

```text
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = C_COLOR_LINE_BOUNDED_EDIT
BRANCH = work/ink-chat-validation-001-phase-c
BRANCH_BASE = c2e0b91cd1cbf96240e212a290877e7b82bd690e
IMPLEMENTATION_EVIDENCE_HEAD = 25082fe9a2a0710a218ab2b543e3177ef5ab1199
TARGET_GATE = CHAT_COLOR_LINE_BOUNDED_EDIT_WORKS
FORMAT_VERSION = 4 / PRESERVED
IMAGE_MODEL = 0
USER_IMAGE_PUBLIC_COMMIT = 0
```

## Result

Phase C required no new product mutation authority.

The accepted path already exists:

```text
generated Phase B Path
→ ChatBoundedEditController
→ proposal
→ explicit approval token
→ path.repaint.v1
→ PathRepaintMaterialController
→ existing History
→ Undo / Redo
```

DEV therefore kept the product source unchanged and added focused validation only.

## Added focused QA

### `qa/chat-validation-001-phase-c-bounded-edit.test.mjs`

Covers:

- generated Color Path fill repaint through `path.repaint.v1`;
- generated Line Path stroke repaint through `path.repaint.v1`;
- proposal = zero document mutation;
- approval = zero document mutation;
- execution without approval = rejected;
- target layer identity and object count preserved;
- Path geometry preserved;
- Reference object preserved;
- unrelated Color / Line Paths preserved;
- existing History receives `CHAT repaint Path`;
- Undo restores the exact prior appearance;
- Redo reapplies the accepted appearance;
- stale target after approval = `CHAT_EDIT_TARGET_STALE`;
- stale rejection = no partial mutation;
- Revision identity unchanged;
- `FORMAT_VERSION = 4`.

### `qa/runtime/ink-cloud-018-browser-harness.html`

The existing Phase A → Phase B runtime flow now continues directly into Phase C using the actual generated Color and Line object IDs.

New browser evidence labels include:

```text
CHAT_PHASE_C_BOUNDED_EDIT_ADAPTER_VISIBLE
CHAT_PHASE_C_COLOR_PROPOSAL_ZERO_MUTATION
CHAT_PHASE_C_EXECUTION_REQUIRES_APPROVAL
CHAT_PHASE_C_COLOR_APPROVAL_ZERO_MUTATION
CHAT_PHASE_C_COLOR_BOUNDED_EDIT
CHAT_PHASE_C_COLOR_TARGET_ONLY
CHAT_PHASE_C_COLOR_HISTORY_AUTHORITATIVE
CHAT_PHASE_C_COLOR_UNDO
CHAT_PHASE_C_COLOR_REDO
CHAT_PHASE_C_LINE_PROPOSAL_ZERO_MUTATION
CHAT_PHASE_C_LINE_APPROVAL_ZERO_MUTATION
CHAT_PHASE_C_LINE_BOUNDED_EDIT
CHAT_PHASE_C_LINE_TARGET_ONLY
CHAT_PHASE_C_LINE_HISTORY_AUTHORITATIVE
CHAT_PHASE_C_LINE_UNDO
CHAT_PHASE_C_LINE_REDO
CHAT_PHASE_C_STALE_STATE_REJECTED
```

The runtime evidence payload also records the selected Color / Line target IDs and their before / after appearance values.

## Static verification performed in DEV session

```text
Phase C focused test syntax parse = PASS
browser harness script syntax parse = PASS
required Phase C runtime assertions present = PASS
branch topology at implementation head = ahead / behind 0
product/source/src mutation = 0
```

The DEV environment did not execute the Node test suite or authoritative Windows Chrome Runtime. Those remain at the Work Order gate:

```text
DEV_HANDOFF
→ MR source review
→ exact-SHA self-hosted Windows Chrome Runtime
→ private real-image acceptance
```

No Runtime PASS is claimed by this report.

## Authority preservation

```text
NEW_DOCUMENT_AUTHORITY = 0
NEW_HISTORY_AUTHORITY = 0
NEW_REVISION_AUTHORITY = 0
NEW_GEOMETRY_AUTHORITY = 0
NEW_REPAINT_ENGINE = 0
NEW_CHAT_OPERATION = 0
AUTO_APPROVAL = 0
AUTO_EXECUTION = 0
IMAGETRACER_RETUNE = 0
PHASE_B_SEMANTICS_CHANGE = 0
SERVICE_WORKER_CHANGE = 0
BOOTSTRAP_CHANGE = 0
UI_006_MUTATION = 0
FORMAT_VERSION_CHANGE = 0
PRIVATE_USER_IMAGE_COMMIT = 0
```

## MR acceptance still required

MR should review the exact final branch HEAD, run the focused source QA including:

```text
qa/chat-validation-001-phase-b-line-color.test.mjs
qa/core/tests/unit/chat-bounded-edit-core-v0.1.test.mjs
qa/chat-validation-001-phase-c-bounded-edit.test.mjs
```

and then run the exact-SHA self-hosted browser Runtime and private real-image acceptance defined by the Current Work Order.
