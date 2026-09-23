# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-VALIDATION-001 / AUTHORIZED / PHASE_A_REFERENCE_HANDOFF`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-CHAT-VALIDATION-001` |
| TITLE | `CHAT Single-Reference Collaboration Validation v0.1` |
| CURRENT_SCOPE | `PHASE_A — CHAT Attachment → INK Reference Handoff` |
| DEV_BRANCH | `work/ink-chat-validation-001` |
| ROLE_OWNER | `MR / CHAT COLLABORATION VALIDATION` |
| PRODUCT_WIRING | `BOUNDED ADDITION ALLOWED` |
| NEW_DRAWING_ENGINE | `PROHIBITED` |
| DOCUMENT_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_AUTHORITY_CHANGE | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| CHAT_BYPASS | `PROHIBITED` |
| FORMAT_VERSION | `4 / PRESERVE` |
| GITHUB_HOSTED_TASK_WORKFLOW | `PROHIBITED` |
| TINYFISH | `PROHIBITED` |
| USER_REFERENCE_FILE_PUBLIC_COMMIT | `PROHIBITED` |

## Product intent

This is the first formal validation of the user-authoritative rule:

```text
CHAT_COLLABORATION_BASELINE = CHAT_CAN_FULLY_USE_INK
CHAT_OPERATION_PATH = AUTHORITATIVE_INK_COMMANDS_ONLY
CHAT_OPERATION_RECORD = REQUIRED
```

The full case will eventually validate:

```text
Reference
→ Extract
→ Path
→ Edit
→ Compose
→ Repaint
→ Compare / Review
→ Revision
→ bounded correction
→ preview back to CHAT
```

This Work Order currently authorizes only the first blocking step:

```text
CHAT attachment
→ programmatic handoff
→ authoritative INK Reference import
→ History / provenance / audit evidence
→ inspectable Reference object
```

Do not continue to Line/Color separation until MR closes Phase A.

## Baseline finding already confirmed by MR

Current accepted INK source already has:

- browser-local `decodeReferenceFile(file)`;
- `app.extraction.decode(file)`;
- image/png, image/jpeg, image/webp support;
- source SHA-256 generation;
- embedded data URL generation;
- existing extraction path that writes Reference + extracted Path through authoritative History.

Current gap:

- Reference input is still bound to human `<input type="file">`;
- no accepted programmatic CHAT attachment handoff exists;
- there is no clean authoritative command to import a Reference image first without forcing extraction;
- therefore external CHAT cannot yet be claimed to have imported the user's attachment into INK.

## Phase A — required capability

Implement the smallest authoritative **CHAT Reference Handoff** boundary.

Required behavior:

1. Accept a browser binary input suitable for CHAT handoff:
   - `File`, or
   - `Blob` plus explicit name/type, or
   - an equivalent bounded byte payload normalized immediately to a browser File/Blob.
2. Reuse the existing reference decoder; do not create a second image decoder.
3. Create an INK Reference image object through the authoritative Document/History path.
4. The imported reference must retain:
   - source name;
   - MIME type;
   - SHA-256;
   - dimensions;
   - actor/source channel = CHAT attachment handoff;
   - stable reference object ID.
5. Import must create a normal History mutation.
6. Provenance must be discoverable through existing accepted provenance authority.
7. Use the existing AI audit facility where compatible; do not invent a parallel hidden audit system merely for this task.
8. Return an inspectable handoff receipt containing, at minimum:
   - operation / intent;
   - actor;
   - document ID;
   - target layer ID;
   - reference object ID;
   - source SHA-256;
   - History before/after;
   - Revision identity before/after if one exists;
   - audit/provenance identity where available;
   - status / error.
9. Do not auto-create a Revision unless the existing Revision policy already requires it.
10. Do not mutate document JSON directly from the CHAT boundary.

Preferred public boundary:

```text
CHAT attachment
→ INK handoff adapter
→ existing decodeReferenceFile
→ authoritative reference-import operation
→ History
→ provenance / audit
→ receipt
```

A browser-visible API such as `INK_CHAT_HANDOFF` is acceptable if it remains a thin adapter into existing INK authority and is testable.

## UI relationship

The existing manual Reference file input remains valid.

If practical, manual file input and CHAT handoff should converge on the same underlying reference-import operation.

Do not redesign the Reference panel.

## Runtime / QA requirements

Add focused source/unit QA and extend the existing authoritative browser Runtime harness.

Browser assertions must prove:

- programmatic CHAT handoff works without setting the file input DOM control;
- a Reference object appears in the active INK document;
- source SHA-256 is retained;
- actor/channel metadata identifies CHAT attachment handoff;
- History increases exactly as expected;
- operation receipt is inspectable;
- provenance/audit evidence exists where specified;
- no direct document JSON replacement/bypass is used;
- existing manual Reference/extraction flow still works;
- UI / Creative / Geometry regressions remain PASS.

DEV does not run GitHub-hosted Actions.

MR owns the final exact-SHA browser Runtime.

## User reference image

The first real acceptance image is the user-provided image in the current CHAT conversation.

Privacy rule:

- do not commit that image into the public repository;
- automated Runtime may use an existing repository fixture;
- after DEV_HANDOFF, MR will separately test the actual conversation attachment against the exact reviewed implementation.

## Evidence

Required report:

`research/INK_CHAT_VALIDATION_001_REFERENCE_HANDOFF_REPORT_v0.1.md`

Required evidence must distinguish:

```text
AUTOMATED_FIXTURE_RUNTIME
vs
MR_USER_ATTACHMENT_REAL_IMAGE_TEST
```

Do not claim the real-image test before MR performs it.

## Phase A gate

```text
CHAT_REFERENCE_HANDOFF_IMPLEMENTED
CHAT_REFERENCE_HANDOFF_OPERATION_RECORDED
CHAT_REFERENCE_HANDOFF_BROWSER_RUNTIME_READY
```

DEV completion:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
PRODUCT_SCOPE = BOUNDED
NEW_DRAWING_ENGINE = 0
CHAT_BYPASS = 0
USER_IMAGE_COMMITTED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
FORMAT_VERSION = 4
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

After DEV handoff, MR will:
1. pin exact DEV HEAD;
2. inspect source/QA/report;
3. run exact-SHA Runtime;
4. test the actual user attachment without publishing it;
5. decide PASS / REVISE / HOLD;
6. only then authorize Line/Color separation Phase B.
