# INK CURRENT WORK ORDER

STATUS: `INK-CHAT-VALIDATION-001 / MR_PASS / PROMOTION_AUTHORIZED`

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


## MR review checkpoint — exact DEV HEAD 17a281a4c6568534e1f12649fe6d3f3257caa967

```text
DEV_HEAD = 17a281a4c6568534e1f12649fe6d3f3257caa967
SOURCE_REVIEW = REVISE
ARCHITECTURE_DIRECTION = ACCEPTED
PROGRAMMATIC_HANDOFF = IMPLEMENTED
AUTHORITATIVE_REFERENCE_IMPORT = IMPLEMENTED
HISTORY_PATH = EXISTING AUTHORITY
PROVENANCE_PATH = EXISTING AUTHORITY
AUDIT_PATH = EXISTING AUTHORITY
RUNTIME = NOT_RUN / SOURCE_BLOCKER_FIRST
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = NOT_RUN / AFTER REVISION
```

### Blocking finding

The adapter validates success with:

```text
historyAfter.undoCount === historyBefore.undoCount + 1
```

but the accepted `HistoryManager` has a bounded limit (20 / 30 / 50) and evicts the oldest entry when the limit is exceeded.

Therefore, when History is already full:

```text
Reference import
→ History commit succeeds
→ oldest History entry is evicted
→ undoCount remains at the configured limit
→ adapter reports CHAT_REFERENCE_HANDOFF_HISTORY_CONTRACT
→ receipt status becomes FAILED
→ imported Reference object remains in the document
```

This is not acceptable for the collaboration baseline because a successful document mutation can be recorded as a failed CHAT operation.

### Bounded revision authorized

Do not redesign Phase A.

Required delta only:

1. Make History success validation limit-aware and authority-based.
   - Prefer public `history.timeline()` / `history.limit` semantics over assuming raw stack count always grows.
   - At saturation, a committed import may keep the same undo count while replacing the oldest retained entry.
2. Prove that the newest History entry is the Reference import created by this operation.
3. Add focused QA for a saturated History stack.
4. Ensure a post-commit validation failure cannot produce an ordinary `FAILED` receipt while silently leaving a successful Reference mutation behind.
5. Preserve:
   - one authoritative Reference import mutation;
   - no auto Revision;
   - existing Audit/Provenance;
   - manual Reference flow;
   - FORMAT_VERSION 4;
   - no GitHub-hosted DEV workflow.

DEV completion remains `DEV_HANDOFF → STOP → MR review`.


## MR Runtime checkpoint — exact DEV HEAD 2d324df22dd58ebf3579ba175422839abd92bd04

```text
SOURCE_REVIEW_AFTER_HISTORY_FIX = PASS
RUNTIME_RUN = 35836852283
RUNTIME_ATTEMPT_1_UI = FAIL / contextual eraser sync only
RUNTIME_ATTEMPT_2_UI = PASS
RUNTIME_ATTEMPT_2_CREATIVE = FAIL
RUNTIME_TESTED_SHA = 2d324df22dd58ebf3579ba175422839abd92bd04
RUNTIME_RUNNER = DESKTOP-NSOQH69
RUNTIME_BROWSER = Chrome
RUNTIME_ARTIFACT = 10739822384
RUNTIME_ARTIFACT_DIGEST = sha256:756449c50b82eb6c107f0c835b65d6b3d99a15ab1774635cf1b01ceb7f258967
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = NOT_RUN
MR_DECISION = REVISE
```

### Runtime blocker — cross-realm CHAT attachment

The accepted browser Runtime exposed a direct Phase A defect.

The creative harness calls the INK iframe boundary with a Blob created in the parent harness realm:

```text
parent window Blob
→ iframe INK_CHAT_HANDOFF.importReference(...)
```

Current `normalizeChatAttachment()` recognizes binary input only with realm-local:

```js
value instanceof Blob
value instanceof File
```

A valid Blob from another browser realm therefore fails identity checks and returns:

```text
CHAT_REFERENCE_HANDOFF_BINARY_REQUIRED
```

This is directly relevant to the product boundary because CHAT / host / iframe / bridge delivery may cross JavaScript realms.

### Bounded revision authorized

Do not redesign Phase A and do not start Phase B.

Required delta:

1. Make CHAT binary normalization realm-safe.
2. Accept valid File/Blob-like binary inputs from another browser realm without trusting arbitrary objects.
3. Normalize the accepted external binary into a local browser File before calling the existing decoder.
4. Preserve all current MIME / size / decoder / History / Audit / Provenance authorities.
5. Keep invalid non-binary objects rejected.
6. Add focused source/unit QA plus explicit browser cross-realm evidence.
7. Existing manual Reference input and same-realm File/Blob behavior must remain intact.
8. FORMAT_VERSION remains 4; no new drawing engine, no direct Document mutation, no GitHub-hosted DEV workflow.

DEV completion:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
REVISION_SCOPE = CROSS_REALM_BINARY_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

MR will rerun exact-SHA Windows Runtime only after this bounded revision returns to STOP. The private user attachment test remains after Runtime PASS.


## MR Runtime checkpoint — cross-realm revision d908c6f1973f6fbf2ead80d33dbfe9abf5d47ea1

```text
DEV_HEAD = d908c6f1973f6fbf2ead80d33dbfe9abf5d47ea1
SOURCE_REVIEW = PASS
CROSS_REALM_SOURCE_BOUNDARY = ACCEPTED_PENDING_RUNTIME
RUNTIME_RUN = 35840153267
RUNTIME_ATTEMPT_1_UI = PASS
RUNTIME_ATTEMPT_1_CREATIVE = FAIL / HARNESS_TIMEOUT_240S
RUNTIME_ATTEMPT_2_UI = PASS
RUNTIME_ATTEMPT_2_CREATIVE = FAIL / HARNESS_TIMEOUT_240S
RUNTIME_ARTIFACT_1 = 10741705027
RUNTIME_ARTIFACT_1_DIGEST = sha256:cc54fbdcef2e61a7f79ba9236e1ce176c96538a2e97b9e73430abd6ba8fe1a24
RUNTIME_ARTIFACT_2 = 10741761282
RUNTIME_ARTIFACT_2_DIGEST = sha256:d34314b87aadfa3fe0ecbcb160e2b3ddcfc0fcb1bc33acbad73c91697a604b5b
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = HELD
MR_DECISION = REVISE
```

### Accepted in source review

The bounded revision correctly removes realm-local `instanceof Blob/File` as the only external binary acceptance test.

The reviewed implementation now:

- platform-brand checks external Blob/File input;
- constructs a realm-local File before the existing decoder;
- retains source name / MIME / lastModified where available;
- preserves arbitrary-object rejection;
- leaves decoder / History / Audit / Provenance / Revision authority unchanged;
- does not start Phase B.

### Runtime blocker — handoff liveness not yet proven

Both exact-SHA Windows runs reached:

```text
UI = PASS
→ Creative suite starts
→ no Creative evidence callback
→ 240 second harness timeout
```

The same timeout reproduced twice on the same exact product SHA.

The previous rejected SHA failed quickly at the CHAT handoff assertion. After the cross-realm revision, the browser no longer returns a specific handoff assertion failure; instead the Creative harness becomes non-terminating before it can publish evidence.

Therefore the cross-realm path cannot yet be accepted as Runtime PASS.

Do **not** solve this by only increasing the 240-second harness timeout.

### Bounded revision authorized — cross-realm runtime liveness

Scope remains Phase A only.

Required:

1. Bound the new cross-realm handoff operation itself with a short browser QA timeout/checkpoint.
2. Expose enough browser-only diagnostic evidence to distinguish:
   - external binary accepted;
   - normalization completed;
   - decoder entered;
   - decoder completed;
   - authoritative Reference import committed;
   - receipt returned.
3. If the stall is between normalization and decoder completion, normalize by fully materializing external Blob bytes into local bytes / a local File before the existing decoder, rather than retaining any problematic cross-realm backing object.
4. Preserve invalid arbitrary-object rejection.
5. Preserve existing History / Audit / Provenance / Revision authority.
6. Existing manual Reference flow must remain unchanged.
7. No Phase B, no new engine, no FORMAT_VERSION change.
8. No GitHub-hosted DEV workflow.

DEV completion remains:

```text
DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP
```

MR will rerun the exact reviewed SHA after the bounded liveness revision. The private real-user image test remains gated on Creative Runtime PASS.


## MR final Phase A acceptance

```text
DEV_PRODUCT_HEAD = 5c8d45d3c0516e5bf1ad56c2afca246ab98ccb83
MR_QA_ONLY_HEAD = ababe86e049355f6464cdabfceacfe2c32992be1
MR_QA_ONLY_DELTA = liveness evidence label collision only
EXACT_SHA_RUNTIME = PASS
RUNTIME_RUN = 35847254857
TESTED_SHA = ababe86e049355f6464cdabfceacfe2c32992be1
RUNNER = DESKTOP-NSOQH69
BROWSER = Chrome
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
RUNTIME_ARTIFACT = 10744043307
RUNTIME_ARTIFACT_DIGEST = sha256:1f5e42a8823279f9f0fd1d6d20b016a5fb83d806ed091b84b566f6eefeb16544
```

The prior run at `5c8d45d...` reached the new handoff successfully but the QA recorder overwrote the check-name field with the source filename. MR corrected that QA-only evidence-label collision; product source did not change. The rerun at `ababe86...` passed all browser suites.

Private user attachment acceptance:

```text
FILE = 1.jpg
MIME = image/jpeg
SIZE = 28354 bytes
DIMENSIONS = 564 × 703
SHA256 = e5b9623bb58f107331f4e9db8f265031baf56dafba77745c63be8bd2c3b18de5
CROSS_REALM_INPUT = PASS
LOCAL_FILE_NORMALIZATION = PASS
IMAGE_DECODE = PASS
REFERENCE_OBJECT_COMPATIBILITY = PASS
HISTORY_LABEL = Reference import · CHAT attachment
RECEIPT = COMPLETED
USER_IMAGE_PUBLIC_COMMIT = 0
```

The exact product path is browser-proven with the repository fixture; the user's private JPEG separately passed the reviewed handoff/decoder compatibility path without publication. This is sufficient for the bounded Phase A acceptance.

### Phase A disposition

```text
CHAT_ATTACHMENT → INK_REFERENCE = PASS
OPERATION_RECORD = PASS
CROSS_REALM_HANDOFF = PASS
REAL_USER_JPEG_COMPATIBILITY = PASS
PHASE_A = MR_PASS
PROMOTION = AUTHORIZED
PHASE_B = NOT_STARTED / REQUIRES NEXT WORK ORDER
```
