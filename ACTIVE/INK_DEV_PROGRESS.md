# INK DEV PROGRESS

STATUS: `INK-WEB-UI-006 / PHASE_G / DEV_HANDOFF / STATIC_PASS / STOP`

## Current UI lane checkpoint — 2026-09-24

```text
CURRENT_UI_LANE_TASK = INK-WEB-UI-006 / PHASE_G
BRANCH = work/ink-web-ui-006-g
BASELINE_PHASE_F_ACCEPTED_BRANCH_HEAD = ed06a4562017c1ea78bcd2c39ced5c0b81d1ad71
PHASE_G_PRODUCT_QA_CHECKPOINT = 718eff8c31a82a8ffd82bbf3d2b83f38b2aa993b
SCOPE = TYPOGRAPHY_SYSTEM_ONLY
STATIC_QA = PASS
RUNTIME_HARNESS = UPDATED
WINDOWS_RUNTIME = UR_EXACT_SHA_REQUIRED
ARTWORK_TEXT_SEMANTICS = UNCHANGED
DOCUMENT = UNCHANGED
HISTORY = UNCHANGED
REVISION = UNCHANGED
GEOMETRY_CORE = UNCHANGED
CHAT_SEMANTICS = UNCHANGED
SERVICE_WORKER_BOOTSTRAP_BUILD_IDENTITY = UNCHANGED
FORMAT_VERSION = 4 / PRESERVED
PHASE_H = NOT_STARTED
CURRENT_PHASE = DEV_HANDOFF / STOP
NEXT_ACTION = UR_REVIEW_REQUIRED
```

Evidence:

- `working/INK_WEB_UI_006_PHASE_G_DEV_HANDOFF.md`
- `working/INK_WEB_UI_006_PHASE_G_EVIDENCE.md`

---

STATUS: `INK-CHAT-VALIDATION-001 / PHASE_B / PROMOTED / CLOSED`

## Task

```text
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
BRANCH = work/ink-chat-validation-001
BRANCH_BASE = 1603a20e1da89708bad80c64fb39a6649fcf0473
IMPLEMENTATION_QA_CHECKPOINT = 7bd33b705345b3c0f691b925ed8614311a0f7797
REPORT_CHECKPOINT = 6b4cbd8da8887f750562242b2641e231df4d0d1c
MR_REVISION_BASELINE = 3c1910694e356e6ceca1cef6b454dca34bd2726c
HISTORY_RECEIPT_REVISION_CHECKPOINT = 6b4cbd8da8887f750562242b2641e231df4d0d1c
MR_RUNTIME_REVIEWED_HEAD = 2d324df22dd58ebf3579ba175422839abd92bd04
CROSS_REALM_SOURCE_CHECKPOINT = 6f31ce236d8efc79e41c0f504382e4c57de89331
CROSS_REALM_FOCUSED_QA_CHECKPOINT = 7a254943f96a54873423d49a4b1243b483d7106a
CROSS_REALM_BROWSER_QA_CHECKPOINT = 48c8b0fbbebe722ede91354f7450ef5d445b498a
CROSS_REALM_RUNTIME_CONTRACT_CHECKPOINT = ebe34f03952ff7f4c2e0dd7c943fa3b67fb37280
CROSS_REALM_REPORT_CHECKPOINT = 287eaea49af3f38df7194263e084123b20a7cbc0
MR_LIVENESS_REVIEWED_HEAD = d908c6f1973f6fbf2ead80d33dbfe9abf5d47ea1
MR_LIVENESS_RUNTIME_RUN = 35840153267
LOCAL_BYTE_MATERIALIZATION_CHECKPOINT = 9a7e02dc3070adc3ec07c0f68f16a8017bf91789
LIVENESS_FOCUSED_QA_CHECKPOINT = f3ce464503a58906ed719a0c1748d80d1e8c8081
LIVENESS_BROWSER_QA_CHECKPOINT = d82c0a20f4e4337f215f6ec34b52ceeb2248fe16
LIVENESS_RUNTIME_CONTRACT_CHECKPOINT = 91badfa19ecbff765e6e8a6be68a2c9e9bc272c1
LIVENESS_REPORT_CHECKPOINT = 57f537b69f82474c48918c2b66a65cdd0668f7f6
TASK_STATUS = DEV_HANDOFF
CURRENT_PHASE = HANDOFF / STOP
PRODUCT_SCOPE = BOUNDED
NEW_DRAWING_ENGINE = 0
CHAT_BYPASS = 0
USER_IMAGE_COMMITTED = 0
GITHUB_ACTIONS_USED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
FORMAT_VERSION = 4 / PRESERVED
NEXT_ACTION = MR_REVIEW_REQUIRED
```

## Governance baseline

- Authoritative current Work Order: `main:ACTIVE/INK_CURRENT_WORK_ORDER.md` → `INK-CHAT-VALIDATION-001 / AUTHORIZED / PHASE_A_REFERENCE_HANDOFF`.
- Branch-local Work Order is stale and still shows closed Integration-006.
- Branch is behind `main` by three governance-only commits affecting `ACTIVE/INK_CURRENT_WORK_ORDER.md`, `ACTIVE/INK_REVIEW_STATUS.md`, and `working/WORKING_STATUS.md` only.
- No product / QA source is missing from the DEV baseline.
- DEV did not mutate Work Order authority; MR must reconcile governance during review/promotion.

## Phase A implemented

Bounded path:

```text
CHAT attachment
→ programmatic File / Blob
→ existing decodeReferenceFile
→ app.extraction.importReference
→ HistoryManager.pushScoped
→ existing provenance graph
→ existing AI AuditLog
→ inspectable handoff receipt
```

Added thin browser boundary:

`INK_CHAT_HANDOFF.importReference(input, options)`

The CHAT boundary does not directly replace or assign the document.

## Authority preservation

- Reference decoder: existing `decodeReferenceFile`.
- Reference mutation: existing extraction workspace + Document layer object path.
- History: existing `HistoryManager.pushScoped`.
- Provenance: existing Revision Provenance Graph through accepted grounded context provider.
- Audit: existing `AICommandLayer.audit / AuditLog`.
- Revision: identity is observed before/after; no automatic Revision created.
- Document JSON replacement from CHAT handoff: `0`.
- Line/Color separation: `0 / NOT_STARTED`.

## Source identity retained

Reference metadata / receipt retains:

- source name;
- MIME;
- SHA-256;
- byte count;
- width / height;
- actor;
- `CHAT_ATTACHMENT_HANDOFF` source channel;
- `reference.import` operation;
- stable Reference object ID.

## Changed files

Product:

- `product/source/src/ai/chat-reference-handoff.js`
- `product/source/src/extraction/install.js`
- `product/source/src/extraction/workspace.js`
- `product/source/src/ink.js`

QA:

- `qa/chat-validation-001-reference-handoff.test.mjs`
- `qa/runtime/ink-cloud-018-browser-harness.html`
- `qa/runtime/run-ink-runtime-batch.mjs`

Research / handoff:

- `research/INK_CHAT_VALIDATION_001_REFERENCE_HANDOFF_REPORT_v0.1.md`
- `ACTIVE/INK_DEV_PROGRESS.md`

Not changed:

- Document model/schema authority;
- History implementation;
- Revision implementation;
- provenance engine;
- AI AuditLog implementation;
- Line/Color engines;
- `.github/workflows/**`;
- `package/ink-current`;
- `main`.

## Checkpoint ledger

1. `1aa8283c819521534f0f036cd49da302dd452fbe` — add authoritative standalone Reference import operation and retain decoder source identity.
2. `cce25ea92f0977f780c9d7fe58787366ffb8370f` — expose Reference import through existing extraction authority.
3. `17a5ba01313f4e6b264bdce80362b6a973562ec6` — add thin CHAT attachment → Reference handoff adapter, audit/provenance/receipt.
4. `6aed5cb41b50f7d922a22224ed212b89fadd7956` — install handoff after accepted extraction authority.
5. `ff76de032e3d981fa4123e0d024a047b41f3cbc3` — add focused source/unit QA.
6. `a0c59430bb88ac95abd46804e83bd455eb1a80dc` — bound focused QA to adapter/source contract.
7. `c149339f34e84d97a40efa88123b9f42d00a5638` — extend existing creative browser harness with programmatic CHAT handoff.
8. `7bd33b705345b3c0f691b925ed8614311a0f7797` — require Phase A browser evidence in existing Runtime batch.
9. `21cffcd59f391e37a57da8fd0f822d3d960b812a` — Phase A report.\n10. `d892afad0b75d6d839ac29ea30ac780603ad9b6f` — finalize report at DEV_HANDOFF / MR_REVIEW_REQUIRED.\n11. `6992c696cb1add7af20bf0a439b1621b723a718d` — document governance-only main/branch baseline divergence.

## DEV verification

Exact branch source verification:

```text
CHAT_HANDOFF_STATIC_CONTRACT = PASS
CHAT_HANDOFF_MODULE_SYNTAX = PASS
ADAPTER_UNIT_BEHAVIOR = PASS
CHANGED_SOURCE_SYNTAX = PASS
FOCUSED_TEST_FILE_SYNTAX = PASS
BROWSER_HARNESS_SCRIPT_SYNTAX = PASS
BATCH_REQUIRED_CHECK_CONTRACT = PASS
PROGRAMMATIC_FILE_INPUT_BYPASS_GUARD = PASS
HISTORY_LIMIT_AWARE_COMMIT_GUARD = PASS
HISTORY_SATURATION_BEHAVIOR = PASS
NEWEST_HISTORY_ENTRY_IDENTITY = PASS
POST_COMMIT_RECEIPT_CORRECTNESS = PASS
NO_AUTO_REVISION_GUARD = PASS
NO_DOCUMENT_REPLACEMENT_GUARD = PASS
AUDIT_PROVENANCE_RECEIPT_GUARD = PASS
MANUAL_REFERENCE_FLOW_REGRESSION_GUARD = PASS
FORMAT_VERSION = 4
```

Adapter unit behavior was executed against the exact fetched handoff module with bounded File/Blob browser-API stubs. It verified one decoder call, one authoritative import call, History receipt, unchanged Revision identity, audit identity, provenance identity and structured invalid-Blob failure.

## Runtime status

The authoritative browser path was extended, not replaced:

`qa/runtime/run-ink-runtime-batch.mjs → creative suite`

```text
CHAT_REFERENCE_HANDOFF_BROWSER_RUNTIME_READY = PASS
MR_REVISE_SOURCE_FIX = COMPLETE
AUTOMATED_FIXTURE_RUNTIME = MR_EXECUTION_PENDING
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = MR_EXECUTION_PENDING
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
GITHUB_HOSTED_ACTIONS_USED = 0
```

The automated fixture uses only the existing repository fixture.

The user's real CHAT attachment was not committed to GitHub. MR must perform the private real-image attachment test after exact-SHA review.

## Phase A gates

```text
CHAT_REFERENCE_HANDOFF_IMPLEMENTED = PASS
CHAT_REFERENCE_HANDOFF_OPERATION_RECORDED = PASS
CHAT_REFERENCE_HANDOFF_BROWSER_RUNTIME_READY = PASS
```

Final Runtime PASS is not claimed by DEV before MR exact-SHA Windows execution.

## DEV completion

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


## MR bounded revision — 17a281a4c6568534e1f12649fe6d3f3257caa967

```text
MR_DECISION = REVISE
RUNTIME = DO_NOT_RUN YET
SCOPE = HISTORY RECEIPT CORRECTNESS ONLY
```

Finding:

The current adapter requires `historyAfter.undoCount = historyBefore.undoCount + 1`.
Accepted History is bounded and evicts its oldest entry when full, so a valid Reference import at History saturation is incorrectly returned as FAILED after the mutation has already committed.

Required:

- make validation History-limit-aware;
- prove newest retained entry is the import from this operation;
- add saturated-History focused QA;
- prevent post-commit receipt status from contradicting committed document state;
- preserve all current Phase A authority boundaries;
- return to `DEV_HANDOFF / STOP`.

Do not start Phase B.


## DEV bounded revision completion — History saturation / receipt correctness

MR revision baseline:

`3c1910694e356e6ceca1cef6b454dca34bd2726c`

Revision checkpoints:

1. `310989367b2ccd1b6a0974f50d15132aa5ceec9c` — make receipt validation use `history.timeline()` / `history.limit`, prove newest retained import entry, and distinguish committed post-validation error.
2. `09ec2a72ab2bb8ecb2de3886ee8368f65a18e240` — add saturated-History and `COMMITTED_WITH_ERROR` focused QA.
3. `2b99f20cfe7c7a11d6636cf16ccb026b6cb8fd09` — remove unconditional raw-count `+1` assumption from existing browser harness assertion.
4. `6b4cbd8da8887f750562242b2641e231df4d0d1c` — update Phase A report with MR correction evidence.

Corrected History rule:

```text
expected applied = min(before.applied + 1, history.limit)
+
newest retained applied entry label = Reference import · CHAT attachment
+
newest retained applied entry objectIds contains returned Reference object ID
+
pending = false
+
redo cleared
```

Verified saturation case:

```text
before applied = 20
limit = 20
import commits
oldest retained entry evicted
after applied = 20
newest retained entry = imported Reference
receipt = COMPLETED
history.commit.valid = true
```

Verified post-commit validation mismatch:

```text
authoritative Reference mutation already committed
receipt validation mismatch detected
receipt = COMMITTED_WITH_ERROR
receipt != FAILED
committed History evidence remains inspectable
```

Exact fetched-source DEV checks:

```text
HISTORY_LIMIT_AWARE_STATIC_CONTRACT = PASS
HISTORY_SATURATION_BEHAVIOR = PASS
POST_COMMIT_RECEIPT_CORRECTNESS = PASS
NEWEST_RETAINED_ENTRY_IDENTITY = PASS
NO_REJECTED_RAW_COUNT_ASSUMPTION = PASS
HANDOFF_MODULE_SYNTAX = PASS
FOCUSED_TEST_SYNTAX = PASS
BROWSER_HARNESS_SCRIPT_SYNTAX = PASS
```

MR revision delta before this handoff record:

```text
product/source/src/ai/chat-reference-handoff.js
qa/chat-validation-001-reference-handoff.test.mjs
qa/runtime/ink-cloud-018-browser-harness.html
research/INK_CHAT_VALIDATION_001_REFERENCE_HANDOFF_REPORT_v0.1.md
```

Preserved:

```text
PHASE_B = NOT_STARTED
LINE_COLOR_SEPARATION = 0
HISTORY_AUTHORITY_CHANGE = 0
DOCUMENT_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
NEW_DRAWING_ENGINE = 0
CHAT_BYPASS = 0
USER_IMAGE_COMMITTED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
FORMAT_VERSION = 4
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
```

Final state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
REVISION_SCOPE = HISTORY_SATURATION_RECEIPT_CORRECTNESS
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## MR Runtime revision — cross-realm binary handoff

```text
REVIEWED_HEAD = 2d324df22dd58ebf3579ba175422839abd92bd04
RUNTIME_RUN = 35836852283
RUNTIME_RESULT = FAIL
UI_RERUN = PASS
CREATIVE_BLOCKER = CHAT_REFERENCE_HANDOFF_BINARY_REQUIRED
SCOPE = CROSS_REALM_BINARY_HANDOFF ONLY
```

The actual browser Runtime calls `w.INK_CHAT_HANDOFF.importReference(blob,...)` where `blob` was created in the parent harness realm and the INK API executes in the iframe realm.

Current `instanceof Blob/File` checks reject that valid cross-realm binary.

Required bounded revision:
- accept valid realm-external Blob/File-like input safely;
- normalize it to a local browser File;
- keep MIME/size/existing decoder validation authoritative;
- keep arbitrary non-binary objects rejected;
- add cross-realm browser evidence;
- preserve History/Audit/Provenance/Revision behavior;
- no Phase B;
- return `DEV_HANDOFF / STOP`.


## DEV bounded revision completion — cross-realm binary handoff

MR Runtime reviewed head:

`2d324df22dd58ebf3579ba175422839abd92bd04`

Runtime blocker:

```text
parent realm Blob
→ iframe INK_CHAT_HANDOFF
→ realm-local instanceof Blob/File fails
→ valid binary rejected
```

Bounded correction:

```text
true external Blob/File platform object
→ local Blob.prototype brand check
→ local Blob slice
→ local browser File
→ existing decodeReferenceFile
→ existing Reference import
→ existing History / Audit / Provenance / Revision authority
```

Security boundary preserved:

- no generic duck typing;
- no trust in `Symbol.toStringTag`;
- arbitrary object with Blob-like fields remains rejected;
- MIME / size / image decoding remains in existing decoder;
- no document replacement;
- no History authority change;
- no Revision authority change.

Revision checkpoints:

1. `6f31ce236d8efc79e41c0f504382e4c57de89331` — realm-safe binary platform-brand normalization into local File.
2. `7a254943f96a54873423d49a4b1243b483d7106a` — focused QA for external branded Blob/File and spoof rejection.
3. `48c8b0fbbebe722ede91354f7450ef5d445b498a` — explicit parent→iframe cross-realm browser evidence and decoder-local-File assertion.
4. `ebe34f03952ff7f4c2e0dd7c943fa3b67fb37280` — require cross-realm evidence in authoritative Runtime batch.
5. `287eaea49af3f38df7194263e084123b20a7cbc0` — update Phase A report.

DEV verification:

```text
CROSS_REALM_BINARY_SOURCE_CONTRACT = PASS
HANDOFF_MODULE_SYNTAX = PASS
BROWSER_HARNESS_SCRIPT_SYNTAX = PASS
BATCH_REQUIRED_CHECK_CONTRACT = PASS
BRANDED_BINARY_NORMALIZATION_BEHAVIOR = PASS
ARBITRARY_OBJECT_REJECTION_BEHAVIOR = PASS
HISTORY_AUTHORITY_CHANGE = 0
AUDIT_AUTHORITY_CHANGE = 0
PROVENANCE_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
PHASE_B = NOT_STARTED
NEW_DRAWING_ENGINE = 0
USER_IMAGE_COMMITTED = 0
GITHUB_HOSTED_ACTIONS_USED = 0
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
FORMAT_VERSION = 4
```

Browser Runtime status:

```text
CROSS_REALM_BROWSER_QA_READY = PASS
AUTOMATED_FIXTURE_RUNTIME = MR_EXACT_SHA_RERUN_PENDING
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = HELD_UNTIL_RUNTIME_PASS
DEV_RUNTIME_PASS_CLAIM = 0
```

Final state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
REVISION_SCOPE = CROSS_REALM_BINARY_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## MR Runtime revision — cross-realm liveness timeout

```text
REVIEWED_HEAD = d908c6f1973f6fbf2ead80d33dbfe9abf5d47ea1
SOURCE_REVIEW = PASS
RUNTIME_RUN = 35840153267
ATTEMPT_1 = UI PASS / CREATIVE TIMEOUT 240S
ATTEMPT_2 = UI PASS / CREATIVE TIMEOUT 240S
RUNTIME_PASS = 0
SCOPE = CROSS_REALM_HANDOFF_LIVENESS_ONLY
```

The source correction is bounded and acceptable, but the authoritative browser Runtime never publishes Creative evidence after entering the new cross-realm path.

Required bounded revision:

1. Add a short per-operation timeout/checkpoint around the cross-realm CHAT Reference handoff.
2. Record browser QA markers for:
   - cross-realm input confirmed;
   - normalization returned;
   - decoder entered;
   - decoder returned;
   - Reference import committed;
   - receipt returned.
3. Fix the identified stall.
4. If the stall is caused by a local File retaining a cross-realm Blob backing, fully materialize external Blob bytes first and construct the local File from local byte data.
5. Keep arbitrary spoof rejection.
6. Preserve History / Audit / Provenance / Revision authority.
7. Do not increase the global Runtime timeout as the fix.
8. Do not start Phase B.

Return to `DEV_HANDOFF / STOP`.


## DEV bounded revision completion — cross-realm handoff liveness

MR baseline:

```text
REVIEWED_HEAD = d908c6f1973f6fbf2ead80d33dbfe9abf5d47ea1
RUNTIME_RUN = 35840153267
ATTEMPT_1 = UI PASS / CREATIVE TIMEOUT 240S
ATTEMPT_2 = UI PASS / CREATIVE TIMEOUT 240S
SCOPE = CROSS_REALM_HANDOFF_LIVENESS_ONLY
```

Prior Runtime evidence did not contain an internal handoff checkpoint, so it could only prove that the handoff promise did not return before the outer timeout. It could not retrospectively identify a finer stage.

Source-side blocking boundary removed:

```text
OLD
external Blob
→ local slice Blob
→ local File([Blob-backed part])
→ decoder consumption

NEW
external Blob/File platform brand
→ await full arrayBuffer materialization
→ local Uint8Array copy
→ local File([local bytes])
→ existing decoder
```

This removes any cross-realm Blob backing before decoder entry.

Browser QA now records:

```text
cross-realm input confirmed
→ normalization returned
→ decoder entered
→ decoder returned
→ Reference import committed
→ receipt returned
```

The handoff itself is bounded to 15 seconds. On timeout, the creative harness reports the completed checkpoint sequence immediately; the global 240-second timeout was not increased.

Revision checkpoints:

1. `9a7e02dc3070adc3ec07c0f68f16a8017bf91789` — fully materialize cross-realm binary into local bytes before local File construction; add adapter checkpoint emission.
2. `f3ce464503a58906ed719a0c1748d80d1e8c8081` — update focused QA for async byte normalization and checkpoint ordering.
3. `d82c0a20f4e4337f215f6ec34b52ceeb2248fe16` — add 15-second browser handoff timeout and six-stage liveness evidence.
4. `91badfa19ecbff765e6e8a6be68a2c9e9bc272c1` — require liveness checks in authoritative Runtime batch.
5. `57f537b69f82474c48918c2b66a65cdd0668f7f6` — update Phase A report.

Exact-source DEV verification:

```text
HANDOFF_MODULE_SYNTAX = PASS
FOCUSED_TEST_SYNTAX = PASS
BROWSER_HARNESS_SCRIPT_SYNTAX = PASS
RUNTIME_BATCH_SYNTAX = PASS
LOCAL_BYTE_MATERIALIZATION = PASS
DECODER_RECEIVED_LOCAL_FILE = PASS
CHECKPOINT_ORDER = PASS
ARBITRARY_OBJECT_REJECTION = PASS
HISTORY_COMMIT_VALID = PASS
REVISION_IDENTITY_UNCHANGED = PASS
SHORT_OPERATION_TIMEOUT = 15000ms
GLOBAL_RUNTIME_TIMEOUT_INCREASE = 0
```

Preserved:

```text
INVALID_ARBITRARY_OBJECT_REJECTION = PRESERVED
EXISTING_DECODER = PRESERVED
HISTORY_AUTHORITY_CHANGE = 0
AUDIT_AUTHORITY_CHANGE = 0
PROVENANCE_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
DOCUMENT_AUTHORITY_CHANGE = 0
PHASE_B = NOT_STARTED
NEW_DRAWING_ENGINE = 0
GITHUB_HOSTED_ACTIONS_USED = 0
SELF_HOSTED_RUNTIME_EXECUTED_BY_DEV = 0
FORMAT_VERSION = 4
```

Runtime handoff state:

```text
CROSS_REALM_LIVENESS_BROWSER_QA_READY = PASS
MR_EXACT_SHA_RUNTIME_RERUN = PENDING
MR_USER_ATTACHMENT_REAL_IMAGE_TEST = HELD
DEV_RUNTIME_PASS_CLAIM = 0
```

Final state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
REVISION_SCOPE = CROSS_REALM_HANDOFF_LIVENESS
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## MR promotion closure — PR #46

```text
MR_DECISION = PASS
PR = #46 / MERGED
PROMOTED_MAIN = d398d4bd89b5d22919a1e6dda310e7831114be1
TESTED_SHA = ababe86e049355f6464cdabfceacfe2c32992be1
RUNTIME = PASS
PRIVATE_USER_JPEG = PASS
TASK_STATUS = CLOSED
NEXT_ACTION = NONE / AWAIT NEXT WORK ORDER
```


## MR Phase B promotion closure

```text
MR_DECISION = PASS
PR = #48 / MERGED
PROMOTED_MAIN = cd911dc240452ed2bc74e9be41549116b088374b
TESTED_SHA = 40a7e5e86e7b08c316210240be8527b020c5ecce
RUNTIME = 35865777424 / PASS
TASK_STATUS = CLOSED
PHASE_C = NOT_STARTED
NEXT_ACTION = AWAIT NEXT WORK ORDER
```
