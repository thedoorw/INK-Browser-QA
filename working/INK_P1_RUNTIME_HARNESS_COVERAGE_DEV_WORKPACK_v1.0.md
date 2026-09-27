# INK P1 Runtime Harness Coverage — DEV Workpack v1.0

STATUS: `AUTHORIZED / DEV_NOT_STARTED`

TASK: `INK-P1-RUNTIME-HARNESS-COVERAGE-001`

OWNER: `MR / MAIN REVIEW`

EXECUTION_OWNER: `DEV`

MANDATORY_DEV_BRANCH: `work/ink-p1-runtime-harness-coverage-001`

PRODUCT_SOURCE_MUTATION: `PROHIBITED`

RUNTIME_TARGET_SHA: `d1269334338531228ddfdd9383761cd419e58738`

UI: `HOLD`

## 1. Purpose

Repair only the central Runtime evidence path required by the blocked P1 integrated Runtime.

Do not change product behavior.

The current central workflow is authoritative:

`.github/workflows/ink-runtime-batch-windows.yml`

Keep its exact-SHA controller, bounded Git-free materialization, existing Closure/P0 focused tests, browser batch, artifact preservation and cleanup behavior.

## 2. Required P1 exact-target coverage

Extend the central workflow so it materializes and executes these files from the pinned Runtime target SHA:

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

Run them from the exact materialized root using Node's test runner before the existing bounded browser batch.

Required successful contract:

```text
P1_A_THROUGH_H_EXACT_TARGET_TESTS = PASS
P1_INTEGRATION_EXACT_TARGET_TEST = PASS
FAIL = 0
SKIP = 0 unless the test itself explicitly defines an accepted bounded unsupported state
```

No test may silently disappear because a file was omitted from materialization.

## 3. Combined Runtime evidence model

The final P1 Runtime evidence is intentionally combined:

- P1 A–H exact-target focused tests: package capability coverage;
- `qa/ink-p1-integration-001.test.mjs`: cross-authority integration, persistence, renderer dispatch;
- existing browser Runtime batch: startup/load, project save/reopen, History, recovery/storage, renderer/output/browser integration;
- existing Closure/P0 tests: regression preservation.

Do not replace the browser batch with Node-only tests.

## 4. Artifact evidence

Add one bounded evidence record under the existing Runtime evidence directory, for example:

`evidence/p1-runtime-coverage.json`

It must record at minimum:
- tested exact SHA;
- the 9 required P1 test file paths;
- command/execution result;
- PASS/FAIL;
- failure/exit information if any.

The evidence file must be written on PASS and FAIL when the P1 test step is reached, and preserved by the existing `if: always()` artifact upload.

The GitHub job must still fail if the P1 test set fails.

## 5. Allowed files

Allowed modification:
- `.github/workflows/ink-runtime-batch-windows.yml`

Allowed new focused harness QA if needed:
- `qa/ink-p1-runtime-harness-coverage-001.test.mjs`

Branch-local progress:
- `working/INK_P1_RUNTIME_HARNESS_COVERAGE_DEV_PROGRESS.md`

No other file is authorized unless MR explicitly revises this workpack.

## 6. Prohibited

```text
product/source/** = NO CHANGES
ACTIVE/INK_RUNTIME_QUEUE.json = DEV MUST NOT CHANGE
product behavior = NO CHANGES
UI = NO
P2 = NO
FORMAT_VERSION = NO
CHAT / Recipe surface = NO
new Runtime authority = NO
new task-specific workflow = NO
manual target substitution = NO
```

Do not create a second workflow. Extend the existing central authority only.

## 7. Focused verification before handoff

DEV must prove:
- workflow still accepts `workflow_dispatch.target_ref`;
- queue path still accepts exact `target_sha`;
- target is still resolved before Windows materialization;
- all 9 P1 tests are in the exact materialization allowlist;
- all 9 P1 tests are in the executed Node test set;
- existing Closure/P0/browser execution remains present;
- artifact upload remains `if: always()`;
- product source diff = 0;
- queue diff = 0.

If a focused harness QA file is added:

`node --test qa/ink-p1-runtime-harness-coverage-001.test.mjs`

must PASS.

## 8. Runtime execution policy

This workpack does NOT authorize DEV to execute the final integrated Runtime and does NOT authorize DEV to mutate the main queue.

After DEV handoff:

```text
DEV_HANDOFF
→ MR source/evidence review
→ MR promotes harness correction
→ MR updates main Runtime queue to READY for exact target
→ central workflow runs one P1 integrated Runtime
```

Final Runtime target remains:

`d1269334338531228ddfdd9383761cd419e58738`

The harness/workflow commit is execution infrastructure only and must never replace that product target.

## 9. DEV handoff

Record:
- exact branch HEAD;
- changed files;
- focused QA command/result;
- proof all 9 P1 tests are materialized + executed;
- confirmation existing browser batch preserved;
- confirmation product source mutation = 0;
- confirmation queue mutation = 0;
- UI/P2/FORMAT_VERSION = 0.

Then STOP for MR.
