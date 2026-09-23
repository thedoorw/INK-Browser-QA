# INK REVIEW STATUS

STATUS: `INK-CHAT-VALIDATION-001 / MR_REVISE / PHASE_A_REFERENCE_HANDOFF`

```text
TASK_ID = INK-CHAT-VALIDATION-001
PHASE = A_REFERENCE_HANDOFF
DEV_BRANCH = work/ink-chat-validation-001
REVIEWED_DEV_HEAD = 2d324df22dd58ebf3579ba175422839abd92bd04
HISTORY_SATURATION_FIX = ACCEPTED
SOURCE_REVIEW = PASS_FOR_HISTORY_REVISION
RUNTIME_RUN = 35836852283
RUNTIME_TESTED_SHA = 2d324df22dd58ebf3579ba175422839abd92bd04
RUNTIME_ATTEMPT_1_UI = FAIL / TRANSIENT CONTEXT SYNC
RUNTIME_ATTEMPT_2_UI = PASS
RUNTIME_ATTEMPT_2_CREATIVE = FAIL
RUNTIME_BLOCKER = CROSS_REALM_BLOB_REJECTED
RUNTIME_ARTIFACT = 10739822384
RUNTIME_ARTIFACT_DIGEST = sha256:756449c50b82eb6c107f0c835b65d6b3d99a15ab1774635cf1b01ceb7f258967
MR_REAL_IMAGE_TEST = HELD_UNTIL_RUNTIME_PASS
FORMAT_VERSION = 4
DECISION = MR_REVISE
```

Accepted from the prior MR_REVISE:
- History saturation is now limit-aware;
- newest retained History entry identity is checked;
- a committed mutation is not mislabeled as ordinary FAILED;
- Phase A authority boundaries remain preserved.

New browser Runtime finding:

```text
parent/harness realm Blob
→ iframe INK_CHAT_HANDOFF
→ instanceof Blob fails across realm
→ CHAT_REFERENCE_HANDOFF_BINARY_REQUIRED
→ Reference import does not execute
```

This is a Phase A product-boundary defect, not an unrelated UI failure. The first Runtime attempt had one transient UI contextual-sync failure; rerunning the same exact SHA produced UI PASS and then reached the Creative suite, where the cross-realm binary defect reproduced deterministically.

Required bounded correction:
1. realm-safe external File/Blob-like acceptance;
2. normalization into local File before existing decoder;
3. invalid arbitrary object rejection preserved;
4. explicit cross-realm browser QA;
5. no Phase B work.

No private real-user attachment PASS may be claimed before exact-SHA Runtime passes.
