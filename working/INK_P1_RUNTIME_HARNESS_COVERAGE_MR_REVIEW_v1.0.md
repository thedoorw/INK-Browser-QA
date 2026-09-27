# INK P1 Runtime Harness Coverage — MR Review v1.0

STATUS: `MR_PASS / PROMOTED`

DATE: 2026-09-27

TASK: `INK-P1-RUNTIME-HARNESS-COVERAGE-001`

DEV_BRANCH: `work/ink-p1-runtime-harness-coverage-001`

DEV_HEAD_REVIEWED: `38d7df97ae8e3e3f7a72195c36acfe13a492f7fc`

IMPLEMENTATION_HEAD_BEFORE_PROGRESS: `409397ada203efeafd9dd0a92ef13f1c02cae97b`

PROMOTION_PR: `#81`

PROMOTION_MERGE: `f112089764b4dc3600ce76ff916c50ca3798456d`

RUNTIME_PRODUCT_TARGET: `d1269334338531228ddfdd9383761cd419e58738`

## MR decision

```text
HARNESS_COVERAGE = PASS
CENTRAL_WORKFLOW_AUTHORITY = PRESERVED
SECOND_RUNTIME_WORKFLOW = 0
PRODUCT_SOURCE_MUTATION = 0
QUEUE_MUTATION_BY_DEV = 0
UI / P2 / FORMAT_VERSION = 0
```

The DEV STOP is accepted.

## Independent MR verification

The promoted central workflow:

`.github/workflows/ink-runtime-batch-windows.yml`

still preserves:
- `workflow_dispatch.target_ref`;
- main queue trigger through `ACTIVE/INK_RUNTIME_QUEUE.json`;
- exact SHA resolution before Windows materialization;
- exact-target blob verification;
- existing Closure/P0 focused contracts;
- existing bounded browser Runtime;
- always-preserved evidence artifact;
- cleanup.

The exact-SHA materialization allowlist and executed Node test set now both contain all 9 required P1 contracts:

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

P1-H's only additional QA dependency is also materialized:

`qa/fixtures/p1-h/fixtures.mjs`

MR independently checked imports of all 9 target tests at the exact Runtime product SHA. No additional `qa/**` dependency is missing.

## Evidence behavior

The new P1 step writes:

`evidence/p1-runtime-coverage.json`

when reached.

On PASS:
- records tested SHA, test list, command, PASS and exit data.

On process failure/error:
- writes FAIL evidence first;
- rethrows/fails the GitHub job.

The existing `if: always()` artifact upload preserves that evidence.

## Promotion meaning

The promoted SHA `f112089764b4dc3600ce76ff916c50ca3798456d` is Runtime infrastructure only.

It is NOT the P1 product Runtime target.

The sole product target remains exactly:

`d1269334338531228ddfdd9383761cd419e58738`

## Next gate

```text
HARNESS_COVERAGE = MR_PASS / PROMOTED
→ MR queues exact product SHA d1269334...
→ ONE P1 integrated Runtime
→ MR reviews run / artifact / failures / skips
```

UI remains HOLD until that Runtime is accepted.
