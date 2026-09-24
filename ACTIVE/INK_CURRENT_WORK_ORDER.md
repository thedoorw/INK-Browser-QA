# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-VALIDATION-001 / PHASE_C / MR_ISSUED / AUTHORIZED / DEV_NOT_STARTED`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-VALIDATION-001` |
| PHASE | `C_COLOR_LINE_BOUNDED_EDIT` |
| TITLE | `CHAT bounded edit on Phase B Color + Line output` |
| DEV_BRANCH | `work/ink-chat-validation-001-phase-c` |
| BASELINE | `current main after Phase B closure + INK-TECH-DEBT-001 closure + dual-track governance sync` |
| PREVIOUS_GATE | `REFERENCE → COLOR + LINE = ACCEPTED` |
| TARGET_GATE | `CHAT_COLOR_LINE_BOUNDED_EDIT_WORKS` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_VERSION | `v0.1 / PRESERVE` |
| IMAGE_MODEL | `0` |
| USER_IMAGE_PUBLIC_COMMIT | `0` |
| UI_LANE | `PARALLEL / SEPARATE AUTHORITY` |

## Purpose

Phase B proved:

```text
CHAT attachment
→ authoritative Reference
→ editable Color regions
+ editable boundary Line Paths
→ separate layers
```

Phase C must prove that CHAT can now operate those generated editable structures through the already accepted bounded-edit authority.

This is a validation/integration task, not a new drawing engine.

Target path:

```text
Phase B generated Color / Line Path
→ grounded stable object reference
→ CHAT edit proposal
→ explicit approval
→ existing path.repaint.v1 execution
→ existing History
→ deterministic result
```

## Required validation

### C1 — Color Path bounded repaint

Using an existing Phase B Color-layer Path:

1. resolve one valid generated Color Path by stable page/layer/object identity;
2. propose a `path.repaint.v1` fill change;
3. verify proposal causes zero document mutation;
4. explicitly approve;
5. execute through the existing CHAT bounded-edit controller;
6. verify only the intended Color Path appearance changes.

Required invariants:

- Color layer identity preserved;
- Color object count preserved;
- Path geometry preserved;
- Reference object preserved;
- unrelated Color/Line objects unchanged;
- no automatic Revision creation;
- existing History receives the authoritative mutation;
- Undo restores the exact prior appearance;
- Redo reapplies the exact accepted appearance.

### C2 — Line Path bounded repaint

Using an existing Phase B Line-layer Path:

1. resolve one valid generated Line Path by stable page/layer/object identity;
2. propose a `path.repaint.v1` stroke change;
3. verify proposal causes zero document mutation;
4. explicitly approve;
5. execute through the existing CHAT bounded-edit controller;
6. verify only the intended Line Path appearance changes.

Required invariants:

- Line layer identity preserved;
- Line object count preserved;
- Path geometry preserved;
- Color layer unchanged;
- Reference object preserved;
- no automatic Revision creation;
- existing History / Undo / Redo remain authoritative.

### C3 — approval and stale-state guard

At minimum verify:

- execution without approval is rejected;
- proposal/approval alone do not mutate;
- if target state changes after proposal, stale execution is rejected;
- rejection does not partially mutate the document.

Do not weaken the accepted approval-token or fingerprint contract merely to make the test pass.

### C4 — private real-image acceptance

Repeat the bounded Phase C path on the same private real-user image class accepted in Phase B.

Rules:

- private image bytes remain outside Git;
- no public fixture derived from the user's image;
- Phase B trace parameters are not retuned in this task;
- choose representative visible Color and Line targets from the generated result and record their stable IDs / before-after appearance evidence;
- demonstrate one visible Color edit and one visible Line edit through the authoritative CHAT bounded-edit route.

## Existing authority to reuse

Phase C should reuse, not replace:

- Phase B `CHAT_REFERENCE_DECOMPOSITION` output and stable generated object IDs;
- `app.chatBoundedEdit` / existing bounded edit adapter;
- `path.repaint.v1`;
- existing `PathRepaintMaterialController`;
- existing History / Undo / Redo;
- existing grounded document/object state.

No second mutation engine, second History, second Revision or second document model is authorized.

## Explicitly out of scope

Do not:

- retune ImageTracerJS;
- alter Phase B decomposition semantics;
- add semantic part labeling or object recognition;
- add a new repaint engine;
- add new arbitrary edit operations;
- auto-approve or auto-execute CHAT proposals;
- change Document schema;
- change History semantics;
- change Revision semantics;
- change Geometry authority;
- change persistence or `FORMAT_VERSION`;
- change Service Worker/cache/bootstrap architecture;
- mutate the UI-006 branch;
- use IMAGE generation/model behavior;
- commit the private user image.

If any of those becomes necessary:

`STOP → MR → separate Core / Integration Work Order`.

## UI parallel-lane boundary

UI-006 and Phase C may proceed in parallel.

```text
UI owns
= presentation / placement / responsive / interaction shell

CHAT Phase C owns
= grounded target / proposal / approval / bounded edit validation
```

If both lanes touch a shared source file, preserve this split. Do not merge the UI development branch into the CHAT development branch or vice versa.

## Required QA

Source/static:

- Phase B regression remains PASS;
- accepted CHAT bounded-edit unit/static guards remain PASS;
- new Phase C focused QA covers Color edit, Line edit, approval boundary, stale-state rejection and Undo/Redo;
- Web / Portable parity remains valid where applicable;
- `FORMAT_VERSION = 4`.

Runtime:

```text
exact Phase C DEV HEAD
→ self-hosted Windows Chrome
→ UI suite
→ Creative suite
→ Geometry suite
→ Phase B regression
→ Phase C Color bounded edit
→ Phase C Line bounded edit
→ private real-image acceptance
```

Required evidence:

- exact tested SHA;
- Runtime run ID;
- runner identity;
- selected Color target ID and before/after appearance;
- selected Line target ID and before/after appearance;
- proposal = zero mutation;
- approval = zero mutation;
- execution = intended target only;
- History / Undo / Redo = PASS;
- Revision = unchanged unless an existing explicit capture is separately invoked;
- private image public commit = 0.

## Gate

```text
DEV_AUTHORIZED
→ DEV_HANDOFF / STOP
→ MR source review
→ exact-SHA Runtime
→ private real-image acceptance
→ MR_PASS / MR_REVISE
```

Acceptance gate:

`CHAT_COLOR_LINE_BOUNDED_EDIT_WORKS`

## Registered next validation sequence — not authorized

If Phase C passes, the provisional validation order is:

```text
Phase D
= CHAT bounded Path geometry correction
  using existing simplify / refine / translate authorities

Phase E
= multi-step Color + Line creative plan
  + explicit approval
  + existing Revision capture / compare

Phase F
= end-to-end private-image collaboration
  attachment → Reference → Color/Line → CHAT edits → History/Revision
```

Phase D–F are planning only. Do not start them from this Work Order.
