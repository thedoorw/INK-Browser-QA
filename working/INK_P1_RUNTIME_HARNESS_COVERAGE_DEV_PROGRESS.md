# INK DEV Progress — INK-P1-RUNTIME-HARNESS-COVERAGE-001

TASK: `INK-P1-RUNTIME-HARNESS-COVERAGE-001`

BRANCH: `work/ink-p1-runtime-harness-coverage-001`

INITIALIZATION:
`264baa82afbb497f7b64cd9e71557edc1a9407f5`

IMPLEMENTATION_HEAD_BEFORE_PROGRESS:
`409397ada203efeafd9dd0a92ef13f1c02cae97b`

STATUS: `DEV_COMPLETE / STOP_FOR_MR`

WORKPACK:
`working/INK_P1_RUNTIME_HARNESS_COVERAGE_DEV_WORKPACK_v1.0.md`

RUNTIME_PRODUCT_TARGET:
`d1269334338531228ddfdd9383761cd419e58738`

PRODUCT_SOURCE_MUTATION:
`0`

MAIN_RUNTIME_QUEUE_MUTATION:
`0`

UI / P2 / FORMAT_VERSION:
`0`

FINAL_INTEGRATED_RUNTIME:
`NOT_EXECUTED / NOT_AUTHORIZED_IN_THIS_WORKPACK`

## Implemented scope

Modified only the existing central Runtime authority:

`.github/workflows/ink-runtime-batch-windows.yml`

No second Runtime workflow was created.

The exact-SHA materialization allowlist now includes all required P1 focused/integration contracts:

```text
qa/ink-p1-a-raster-selection-fill-sampling.test.mjs
qa/ink-p1-b-local-raster-retouch.test.mjs
qa/ink-p1-c-vector-text-precision-layout.test.mjs
qa/ink-p1-d-layer-effects-completion.test.mjs
qa/ink-p1-e-advanced-selection.test.mjs
qa/ink-p1-f-raster-processing-expansion.test.mjs
qa/ink-p1-g-color-bitdepth-channels.test.mjs
qa/ink-p1-h-format-interoperability.test.mjs
qa/ink-p1-integration-001.test.mjs
```

P1-H also requires and now materializes:

`qa/fixtures/p1-h/fixtures.mjs`

## P1 exact-target execution

A new bounded step was added before existing Closure/P0/browser execution:

`Execute P1 exact-target contract tests`

It executes the 9 required tests together using the GitHub Action bundled Node runtime:

```text
process.execPath --test <P1-A> <P1-B> <P1-C> <P1-D> <P1-E> <P1-F> <P1-G> <P1-H> <P1-INTEGRATION>
```

Execution properties remain:

```text
cwd = exact materialized Runtime root
shell = false
windowsHide = true
source bytes = pinned exact Runtime target SHA
```

If the P1 test process exits non-zero, the step writes evidence and then fails the GitHub job.

## Evidence extension

The P1 step writes:

`evidence/p1-runtime-coverage.json`

when the step is reached, on both PASS and FAIL.

Recorded fields include:

- evidence schema/version;
- tested exact SHA;
- all 9 P1 test paths;
- command;
- PASS/FAIL;
- exit code;
- signal;
- error text on failure.

The existing artifact preservation remains unchanged:

```text
if: always() && steps.source.outputs.root != ''
path: ${{ steps.source.outputs.root }}/evidence/
```

Therefore P1 failure evidence is preserved by the same central artifact.

## Existing Runtime authority preserved

Exact-source verification confirms the existing workflow still contains:

```text
workflow_dispatch.target_ref = PRESENT
manual exact-SHA resolution = PRESENT
queue exact target_sha resolution = PRESENT
exact SHA verified before materialization = PRESENT
Closure focused contracts = PRESENT
P0 restore focused contract = PRESENT
semantic-region preload = PRESENT
bounded browser Runtime batch = PRESENT
artifact upload if: always() = PRESENT
temporary-source cleanup = PRESENT
```

Execution order:

```text
exact-SHA materialization
→ P1 A-H + P1 Integration Node contracts
→ existing Closure/P0 focused contracts
→ existing bounded browser Runtime
→ always-preserved evidence artifact
→ cleanup
```

## Focused verification

No additional repository QA file remains in the final diff.

A temporary focused QA file was initially created, but the available execution container could not resolve `raw.githubusercontent.com`; rather than claim an unexecuted Node PASS, that temporary file was removed.

The final verification was performed directly against the current GitHub SSOT workflow content with programmatic exact-source assertions.

Result:

```text
EXACT_SOURCE_CONTRACT_CHECK = PASS

P1 tests required = 9
P1 tests materialized = 9
P1 tests executed = 9
P1-H fixture materialized = PASS
workflow_dispatch.target_ref preserved = PASS
queue target_sha exact-resolution preserved = PASS
target resolved before Windows materialization = PASS
Closure/P0 execution preserved = PASS
browser Runtime execution preserved = PASS
artifact if:always preservation = PASS
P1 PASS/FAIL evidence write = PASS
```

The conditional workpack command:

`node --test qa/ink-p1-runtime-harness-coverage-001.test.mjs`

is not applicable to the final branch because that optional QA file is not present in the final diff.

## Net diff verification

Compared from initialization:

`264baa82afbb497f7b64cd9e71557edc1a9407f5`

to implementation HEAD before this progress update:

`409397ada203efeafd9dd0a92ef13f1c02cae97b`

the net changed-file set is exactly:

```text
.github/workflows/ink-runtime-batch-windows.yml
```

Verification:

```text
product/source/** diff = 0
ACTIVE/INK_RUNTIME_QUEUE.json diff = 0
UI diff = 0
P2 diff = 0
FORMAT_VERSION change = 0
new Runtime workflow = 0
```

## Runtime policy

DEV did not execute the final P1 integrated Runtime and did not modify the main Runtime queue.

Final product Runtime target remains exactly:

`d1269334338531228ddfdd9383761cd419e58738`

The harness branch HEAD is infrastructure only and must not replace the product target SHA.

## DEV handoff

```text
IMPLEMENTATION = COMPLETE
FOCUSED_HARNESS_QA = PASS / GITHUB_SSOT_EXACT_SOURCE_CONTRACT
PRODUCT_SOURCE_MUTATION = 0
QUEUE_MUTATION = 0
DEV_HANDOFF = YES
NEXT_OWNER = MR
DEV_ACTION = STOP
STOP FOR MR
```
