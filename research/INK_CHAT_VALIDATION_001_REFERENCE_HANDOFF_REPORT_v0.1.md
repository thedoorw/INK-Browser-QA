# INK CHAT VALIDATION 001 — Reference Handoff Report v0.1

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED / PHASE_A_ONLY`

## Control

```text
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
BRANCH = work/ink-chat-validation-001
BRANCH_BASE = 1603a20e1da89708bad80c64fb39a6649fcf0473
IMPLEMENTATION_QA_CHECKPOINT = 7bd33b705345b3c0f691b925ed8614311a0f7797
FORMAT_VERSION = 4 / PRESERVED
NEW_DRAWING_ENGINE = 0
CHAT_BYPASS = 0
USER_IMAGE_COMMITTED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
LINE_COLOR_SEPARATION = NOT_STARTED / OUT_OF_SCOPE
```

## Governance baseline note

The DEV branch was initialized from merge base `734deaf86db59e34683ab85314f582bff7d9ed97` before the three current governance-only commits on `main`.

Therefore the branch-local `ACTIVE/INK_CURRENT_WORK_ORDER.md` still shows the prior closed Integration-006 order. The authoritative current Work Order is `main:ACTIVE/INK_CURRENT_WORK_ORDER.md`:

`INK-CHAT-VALIDATION-001 / AUTHORIZED / PHASE_A_REFERENCE_HANDOFF`

The three `main` commits missing from the DEV branch change only:

- `ACTIVE/INK_CURRENT_WORK_ORDER.md`
- `ACTIVE/INK_REVIEW_STATUS.md`
- `working/WORKING_STATUS.md`

No product/QA source is missing from the DEV baseline. DEV did not copy or rewrite Work Order authority into the feature branch; MR should reconcile governance during review/promotion.

## Phase A result

Implemented the bounded collaboration boundary:

```text
CHAT attachment
→ programmatic File / Blob normalization
→ existing decodeReferenceFile
→ authoritative Reference import operation
→ existing HistoryManager.pushScoped
→ existing provenance authority
→ existing AI AuditLog
→ inspectable handoff receipt
```

No Line/Color extraction or separation was started.

## Authoritative Reference import operation

New operation:

`importReferenceIntoDocument(app, decoded, options)`

Location:

`product/source/src/extraction/workspace.js`

It remains inside the existing extraction workspace authority and is exposed as:

`app.extraction.importReference(decoded, options)`

The operation:

- reuses the existing decoded reference payload;
- validates the existing active Document/Page/Layer and History state;
- creates one normal INK image object;
- commits through `app.history.pushScoped(...)`;
- does not replace the document;
- does not create a second History system;
- does not create a Revision automatically.

The reference object retains:

- source name;
- MIME type;
- byte count;
- SHA-256;
- width / height;
- actor;
- source channel;
- operation identity;
- stable INK reference object ID.

Reference metadata includes:

- `metadata.referenceImport` — Phase A operation identity;
- `metadata.extractionReference` — compatibility with the accepted Reference/extraction workspace semantics;
- `metadata.source` — accepted provenance source metadata.

## Decoder reuse

The existing `decodeReferenceFile(file)` remains the only browser reference decoder.

Phase A only extends its returned source identity from:

`name + sha256`

to:

`name + mimeType + sizeBytes + sha256 + width + height`

It still performs:

- MIME validation;
- size validation;
- SHA-256;
- `createImageBitmap`;
- raster decode;
- embedded data URL generation.

No second image decoder was created.

## CHAT handoff adapter

Added:

`product/source/src/ai/chat-reference-handoff.js`

Public browser boundary:

```js
INK_CHAT_HANDOFF.importReference(input, options)
```

Accepted input:

- browser `File`; or
- browser `Blob` with explicit name and MIME type.

The adapter immediately normalizes a Blob to a browser File, then calls only:

```text
app.extraction.decode(file)
→ app.extraction.importReference(decoded, ...)
```

It does not assign `app.doc` and does not call `replaceDocument`.

The handoff is installed after the existing extraction authority:

```text
installStudioCore
→ installExtraction
→ installChatReferenceHandoff
```

`installStudioCore` already installs the accepted AI command/audit runtime, allowing the handoff adapter to reuse the existing `AICommandLayer.audit`.

## History contract

MR revision corrected the original raw-count assumption.

The adapter now reads accepted public History semantics through `history.timeline()` and `history.limit` (with bounded compatibility fallback only when those public values are unavailable).

Successful CHAT Reference handoff requires:

```text
expected applied count = min(before.applied + 1, history.limit)
History pending = false
redo cleared by the committed mutation
newest retained applied entry label = Reference import · CHAT attachment
newest retained applied entry objectIds contains this Reference object ID
```

Therefore, when History is already saturated:

```text
before.applied = limit
Reference import commits
oldest retained entry is evicted
after.applied = limit
newest retained entry = this Reference import
receipt status = COMPLETED
```

The receipt now includes `history.commit` with:

- `valid`;
- `saturatedBefore`;
- `expectedApplied`;
- `actualApplied`;
- `limit`;
- `newestMatches`;
- `redoCleared`.

A post-commit receipt-validation error can no longer be returned as an ordinary `FAILED` operation. If the authoritative import already returned a committed Reference identity but receipt validation subsequently fails, the adapter returns:

`COMMITTED_WITH_ERROR`

and preserves the committed document/History evidence in the receipt.

No History authority or separate operation ledger was introduced.

## Provenance contract

No new provenance engine was added.

The imported Reference uses accepted `metadata.source` semantics:

```text
type = chat-attachment
id = source SHA-256
name = source file name
```

The existing Revision Provenance Graph therefore emits the accepted `object-source` evidence for the imported Reference.

The handoff receipt reads provenance through the existing grounded creative-intelligence provider and returns:

- provenance status;
- provenance fingerprint;
- matched event IDs;
- matched event kinds.

## Audit contract

No task-local hidden audit system was added.

The handoff adapter reuses existing:

`AICommandLayer.audit / AuditLog.add(...)`

A successful operation records:

- actor;
- intent summary;
- permission level;
- command = `reference.import`;
- source name / MIME / SHA-256 / dimensions;
- source channel;
- document / layer / Reference result identity;
- browser-local / authoritative-History security evidence.

The returned receipt exposes the existing audit ID.

Failure attempts are also auditable where the accepted audit facility is available.

## Receipt

Successful receipt schema:

`INK-CHAT-REFERENCE-HANDOFF/1`

It exposes at minimum:

- operation;
- intent;
- actor;
- source channel;
- document ID;
- target layer ID;
- Reference object ID;
- source name;
- MIME type;
- SHA-256;
- dimensions;
- byte count;
- History before / after;
- Revision identity before / after;
- audit identity;
- provenance identity;
- status;
- error.

No automatic Revision is created. The browser harness explicitly requires Revision identity to remain unchanged during Phase A handoff.

## Existing manual Reference flow

The existing human file-input flow remains intact.

Phase A deliberately does **not** rewrite the existing atomic:

`Reference → editable Path`

extraction transaction to route through the standalone Reference-import transaction, because doing so would change its established History semantics from one mutation to multiple mutations.

The browser Runtime harness therefore tests both routes in sequence:

1. programmatic CHAT Blob handoff while the Reference file input remains empty;
2. existing manual file input + Direct Extraction.

This proves coexistence without changing the accepted extraction authority.

## Focused QA

Added:

`qa/chat-validation-001-reference-handoff.test.mjs`

Coverage includes:

- Blob → File normalization;
- adapter calls decoder exactly once;
- adapter calls authoritative Reference import exactly once;
- operation / channel propagation;
- History before / after receipt;
- Revision identity before / after;
- audit identity;
- provenance identity;
- structured failed receipt for invalid Blob handoff;
- saturated History at the accepted minimum limit (20);
- retained-count saturation with oldest-entry eviction;
- newest retained entry identity for the imported Reference;
- post-commit validation mismatch → `COMMITTED_WITH_ERROR`, never ordinary `FAILED`;
- source-contract guard against direct document replacement;
- authoritative History wiring guard.

DEV verification against the exact branch source:

```text
CHAT_HANDOFF_STATIC_CONTRACT = PASS
CHAT_HANDOFF_MODULE_SYNTAX = PASS
ADAPTER_UNIT_BEHAVIOR = PASS
HISTORY_SATURATION_BEHAVIOR = PASS
POST_COMMIT_RECEIPT_CORRECTNESS = PASS
CHANGED_SOURCE_SYNTAX = PASS
BROWSER_HARNESS_SCRIPT_SYNTAX = PASS
BATCH_REQUIRED_CHECK_CONTRACT = PASS
FORMAT_VERSION = 4
```

The adapter behavioral check evaluated the exact fetched handoff module with bounded browser File/Blob stubs and verified decoder/import call counts, History receipt, unchanged Revision identity, audit identity and provenance identity.

## Browser Runtime harness

Extended the existing authoritative path only:

```text
qa/runtime/run-ink-runtime-batch.mjs
→ creative suite
→ qa/runtime/ink-cloud-018-browser-harness.html
```

No second Runtime infrastructure path and no task-local GitHub Actions workflow were created.

New browser assertions require:

- `INK_CHAT_HANDOFF` exists;
- CHAT handoff works from the fixture Blob;
- Reference file input remains untouched during programmatic handoff;
- resulting Reference object is inspectable;
- actor/channel/operation metadata is retained;
- MIME/SHA-256/dimensions are retained;
- History advances according to bounded timeline/limit semantics and the newest retained entry is this Reference import;
- Revision identity does not change automatically;
- `replaceDocument` is not invoked by handoff;
- existing AI audit record is inspectable;
- existing provenance evidence is inspectable;
- receipt identities are inspectable;
- manual Reference file input remains usable;
- existing Direct Extraction continues afterward.

The batch runner lists the Phase A checks in the existing `creativeRequired` contract, so the authoritative Runtime batch cannot PASS while omitting Phase A evidence.

## MR_REVISE bounded correction

Reviewed blocker:

```text
History at configured limit
→ successful Reference import commits
→ oldest entry evicted
→ retained count stays at limit
→ old adapter expected raw undoCount + 1
→ receipt incorrectly reported FAILED
```

Bounded correction only:

1. `historySnapshot` now captures public timeline `applied / entries / limit` semantics.
2. `historyCommitValidation` calculates `min(before.applied + 1, after.limit)`.
3. The newest retained applied History entry must match both:
   - label `Reference import · CHAT attachment`;
   - the returned Reference object ID.
4. Saturation is explicitly represented by `history.commit.saturatedBefore`.
5. A validation error after the authoritative import has already committed returns `COMMITTED_WITH_ERROR`, never ordinary `FAILED`.
6. The browser harness no longer encodes the rejected unconditional raw-count `+1` assumption.

No other Phase A architecture changed and Phase B remains not started.

## Evidence status

### AUTOMATED_FIXTURE_RUNTIME

```text
HARNESS = READY
FIXTURE = existing repository rose-window fixture
DEV_BROWSER_RUNTIME_EXECUTED = NO
FINAL_EXACT_SHA_RUNTIME_OWNER = MR
STATUS = MR_EXECUTION_PENDING
```

DEV does not claim browser Runtime PASS before MR runs the reviewed exact SHA on the authoritative self-hosted Windows path.

### MR_USER_ATTACHMENT_REAL_IMAGE_TEST

```text
USER_ATTACHMENT_PUBLIC_COMMIT = 0
DEV_TEST = NOT_EXECUTED
MR_PRIVATE_REAL_IMAGE_TEST = REQUIRED
STATUS = MR_EXECUTION_PENDING
```

The user's current CHAT attachment was not added to the repository and is not part of automated fixture evidence.

## Scope boundaries preserved

```text
LINE_COLOR_SEPARATION = 0
NEW_DRAWING_ENGINE = 0
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
SECOND_PROVENANCE_SYSTEM = 0
SECOND_AUDIT_SYSTEM = 0
CHAT_DIRECT_DOCUMENT_JSON_MUTATION = 0
USER_IMAGE_COMMITTED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
FORMAT_VERSION = 4
```

## Phase A gates at DEV closure

```text
CHAT_REFERENCE_HANDOFF_IMPLEMENTED = PASS
CHAT_REFERENCE_HANDOFF_OPERATION_RECORDED = PASS
CHAT_REFERENCE_HANDOFF_BROWSER_RUNTIME_READY = PASS
AUTOMATED_FIXTURE_RUNTIME = MR_EXECUTION_PENDING
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = MR_EXECUTION_PENDING
```

## DEV handoff

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
