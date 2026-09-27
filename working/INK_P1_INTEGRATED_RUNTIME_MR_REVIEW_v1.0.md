# INK P1 Integrated Runtime — MR Review v1.0

STATUS: `MR_REVIEW_COMPLETE / BLOCKED_BEFORE_RUN / HARNESS_CORRECTION_REQUIRED`

DATE: 2026-09-27

TASK: `INK-P1-INTEGRATED-RUNTIME-001`

RUNTIME_TARGET_SHA: `d1269334338531228ddfdd9383761cd419e58738`

DEV_EVIDENCE_BRANCH: `work/ink-p1-integrated-runtime-001`

DEV_EVIDENCE_HEAD_REVIEWED: `7cb8e8cc750a3b1828d7781a707ae5df471af7c6`

## MR decision

```text
P1_INTEGRATED_RUNTIME = NOT_EXECUTED
RUNTIME_RESULT = BLOCKED_BEFORE_RUN
MR_ACCEPT_RUNTIME_PASS = NO
MR_CLASSIFY_PRODUCT_DEFECT = NO
PRODUCT_SOURCE_MUTATION = 0 VERIFIED
UI / P2 / FORMAT_VERSION CHANGE = 0
```

DEV correctly STOPped before claiming PASS/FAIL.

## Blocker review

### B1 — dispatch path

Accepted.

The active connector surface can inspect/rerun Actions but does not expose creation of a new `workflow_dispatch(target_ref=...)` event. DEV was not authorized to mutate `main` queue state from the evidence branch.

This is not a product defect.

MR resolution: after the central harness correction is promoted, MR will use the already-authoritative `ACTIVE/INK_RUNTIME_QUEUE.json` main-branch path to trigger the exact target. The queue will pin:

`d1269334338531228ddfdd9383761cd419e58738`

The control/evidence branch HEAD remains non-authoritative as a Runtime target.

### B2 — incomplete P1 coverage in central batch

Accepted and gating.

Current `.github/workflows/ink-runtime-batch-windows.yml` materializes/runs the Closure/P0/browser suites but does not materialize or execute the committed P1 integrated contract:

`qa/ink-p1-integration-001.test.mjs`

MR additionally requires the exact-target P1 A–H focused contracts to run in the central batch so the one final P1 Runtime has explicit coverage for raster selection/retouch, transform/text/layout, layer effects, advanced selection, raster processing/Liquify, color/bit-depth/channels, and format interoperability.

The existing browser batch remains required for startup/load, save/reopen, History, recovery/storage, renderer/output and browser integration evidence.

## Scope of correction

New bounded infrastructure task:

`INK-P1-RUNTIME-HARNESS-COVERAGE-001`

Workpack:

`working/INK_P1_RUNTIME_HARNESS_COVERAGE_DEV_WORKPACK_v1.0.md`

Rules:
- product source mutation = 0;
- Runtime target SHA does not change;
- no UI / P2 / FORMAT_VERSION;
- no queue mutation by DEV;
- no product defect correction;
- preserve the current central Runtime authority; extend coverage only.

## Gate

```text
INK-P1-INTEGRATED-RUNTIME-001 = HOLD / BLOCKED_BEFORE_RUN
→ INK-P1-RUNTIME-HARNESS-COVERAGE-001
→ MR review / promote harness only
→ MR queues exact target d1269334...
→ ONE integrated Runtime
→ Runtime evidence review
```

UI remains HOLD.
