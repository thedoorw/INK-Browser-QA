# INK REVIEW EVIDENCE

STATUS: `INK-CHAT-VALIDATION-001 / PHASE_B / MR_PASS_EVIDENCE / PROMOTED / CLOSED`

## Exact reviewed source

```text
DEV_BRANCH = work/ink-chat-validation-001-phase-b
EXACT_RUNTIME_TESTED_SHA = 40a7e5e86e7b08c316210240be8527b020c5ecce
TRACE_BUDGET = 64000 px / 320 px
COLOR_QUANTIZATION_CYCLES = 1
POST_COMMIT_SELECTION = ONE REPRESENTATIVE LINE PATH
FORMAT_VERSION = 4
PHASE_C = NOT_STARTED
```

Focused/source contract includes a >96-object selection-bound case:
- 97 generated Color Paths retained;
- 97 generated Line Paths retained;
- an unbounded 97-object Document Bridge selection is rejected at the default 96-object limit;
- authoritative post-commit selection is 1 object;
- CHAT receipt returns `COMPLETED`.

## Authoritative Windows browser Runtime

```text
RUN = 35865777424
CONTROLLER_JOB = 107196859300 / PASS
WINDOWS_JOB = 107196901658 / PASS
TESTED_SHA = 40a7e5e86e7b08c316210240be8527b020c5ecce
RUNNER = DESKTOP-NSOQH69
UI = PASS
CREATIVE = PASS
GEOMETRY = PASS
PHASE_B_ELAPSED_MS = 2214.1
COLOR_REGIONS = 1471
BOUNDARY_LINES = 1471
POST_COMMIT_SELECTION = BOUNDED / PASS
CHAT_RECEIPT = COMPLETED
HISTORY = PASS
AUDIT = PASS
PROVENANCE = PASS
REVISION = UNCHANGED / PASS
ARTIFACT_ID = 10751389785
ARTIFACT_DIGEST = sha256:b7e97974e1acd0fd3447353c83caf80bb40efefef47875daba107f0387a81784
```

## Promotion equivalence

```text
PROMOTION_PR = #48 / MERGED
PROMOTION_HEAD = d49c13d4cce1677310c4f4f49b46b31674368327
PROMOTED_MAIN_SHA = cd911dc240452ed2bc74e9be41549116b088374b
PROMOTED_PRODUCT_QA_EQUIVALENT_TO_TESTED_SHA = YES
MATCHED_BLOBS = 8 / 8
```

Byte-identical promoted/tested paths:

- `product/source/src/ai/chat-reference-handoff.js`
- `product/source/src/extraction/adapters.js`
- `product/source/src/extraction/core.js`
- `product/source/src/extraction/install.js`
- `product/source/src/extraction/workspace.js`
- `qa/chat-validation-001-phase-b-line-color.test.mjs`
- `qa/runtime/ink-cloud-018-browser-harness.html`
- `qa/runtime/run-ink-runtime-batch.mjs`

## Private user reference evidence

```text
FILE = 1.jpg
MIME = image/jpeg
SIZE_BYTES = 28354
DIMENSIONS = 564x703
SHA256 = e5b9623bb58f107331f4e9db8f265031baf56dafba77745c63be8bd2c3b18de5
FINAL_TRACE_WORK_RASTER = 226x282 / 63732 px
TRACE_BUDGET_COMPATIBILITY = PASS
MULTI_COLOR_DECOMPOSITION_COMPATIBILITY = PASS
USER_IMAGE_PUBLIC_COMMIT = 0
```

Evidence scope:
- exact browser execution and regression proof: repository fixture at `40a7e5e8...`;
- private `1.jpg`: input/decode and final trace-budget compatibility, without public commit;
- no duplicate post-merge Runtime required because all eight promoted product/QA blobs are identical to the exact Runtime-tested blobs.
