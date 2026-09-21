# INK DEV PROGRESS

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-006` |
| DEV_MODE | `LONG_SEQUENCE_WORKPACK` |
| DEV_WORK_BRANCH | `work/ink-cloud-006` |
| BASE_BRANCH_HEAD_AT_START | `d1f908825f8419f053753b93d13a1a4ee901de91` |
| LATEST_DEV_COMMIT | `184c74195e976526713ad549b236e13c9dac9ad7` |
| DEV_STATE | `DEV_HANDOFF` |
| MR_GATE | `REQUIRED_AFTER_HANDOFF` |
| FORMAT_VERSION_CHANGE | `0 / OPTIONAL_FORMAT_4_EXTENSIONS` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| CLOUD_START_GATE | `BLOCKED` |

## Objective

Complete the final pre-Cloud structural workpack defined in:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

Focus:

- Layout / Constraints versioned structural schema;
- transport-neutral file/revision persistence contract;
- migration / integrity / save-load closure;
- compatibility with accepted INK-CLOUD-002 through 005.

## Progress rule

At each meaningful checkpoint record:

- exact SHA;
- files changed;
- schema decisions;
- checks actually executed;
- checks not executed;
- known gaps.

If FORMAT_VERSION change is required:

`STOP / MR_DECISION_REQUIRED`

Do not independently change FORMAT_VERSION.

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-006
BRANCH = work/ink-cloud-006
FINAL_HEAD = <exact SHA>
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0 OR MR_DECISION_REQUIRED
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

## Checkpoint 1 — Layout and persistence schema

Branch checkout started from GitHub `d1f908825f8419f053753b93d13a1a4ee901de91`. Read required control files, readiness assessment, accepted Component report, and required document/storage/assets/source tests.

Implemented initial optional schemas:

- `INK-LAYOUT-1` on Frame and `INK-LAYOUT-ITEM-1` on Frame children;
- pure horizontal/vertical flow and resize-constraint evaluation plans;
- existing-History commands for set/remove Frame and child metadata;
- deterministic known-field normalization with unknown extension preservation;
- `INK-FILE-ENVELOPE` v1.0 with stable file/revision identity, format/extension/migration declarations, document payload, asset reference mirror, timestamps and canonical fingerprint;
- migration/integrity exports and diagnostics.

Actually executed: source syntax checks for new modules and touched document modules PASS; `git diff --check` PASS. New layout/persistence suite initially 17/18 because one expected hug-height arithmetic value was incorrect (51 vs actual 46); expectation corrected from padding + intrinsic sizes + gap. Final rerun pending at this checkpoint. Browser Runtime QA remains DEFERRED.

## Checkpoint 2 — semantic edge hardening

Published schema checkpoint: `dc6c20ca71543773b791c571c51a423372b20d28`.

Hardened deterministic evaluation and envelope behavior:

- unknown future Frame layout schemas are preserved and reported as unsupported, never interpreted as v1;
- unknown child schemas reject evaluation safely;
- `fill` inside a `hug` axis uses intrinsic size with an explicit diagnostic, avoiding cyclic size authority;
- cross-axis stretch is suppressed when that container axis is hug;
- envelope input validates arrays/IDs/timestamps/format version;
- revision creation retains existing future extension declarations while adding newly required native extensions;
- feature detection now scans structural objects only, so workspace `cameras.layout` cannot falsely declare `ink.layout.v1`.

Actually executed: new suite **20/20 PASS**; accepted Component/Frame/Group/Transform plus retained core suites via `run-component-foundation-checks.mjs`: **62/62 + 29/29 PASS**, 6 syntax checks and FORMAT_VERSION=4 PASS. Initial edge test exposed false `ink.layout.v1` detection from workspace camera naming; fixed by using `walkPageObjects()` and rerun. Runtime QA remains DEFERRED.

## Checkpoint 3 — fail-closed persistence validation and combined evidence

Published semantic hardening checkpoint: `04fab9e69a90ef5e90fd34a9030f6f2e389fb49a`.

Closed malformed-input and verification edges:

- envelope construction requires a stable document/file ID and parseable timestamps;
- cyclic or otherwise non-serializable native payloads fail with bounded diagnostics instead of recursing or throwing during inspection;
- extension and asset-reference inspection is exception-safe and remains fail closed;
- added one command that executes accepted 002–005 compatibility, retained shared-core tests, the 006 contract suite, source syntax, format-version and network-boundary checks;
- captured the exact command output in `qa/core/evidence/INK_CLOUD_006_NODE_CHECKS.txt`.

Actually executed: combined runner **112/112 Node tests PASS** (62 accepted structural/Component + 29 retained shared-core + 21 Layout/persistence), **8/8 source syntax checks PASS**, `FORMAT_VERSION = 4` PASS, bounded new modules contain no network transport primitive, and `git diff --check` PASS. Runtime browser/Canvas/WebGL/pointer/IndexedDB and hosted Actions QA remain DEFERRED.

Published implementation and executed-QA checkpoint: `184c74195e976526713ad549b236e13c9dac9ad7`.

## Handoff

The required closure report is `research/INK_LAYOUT_PERSISTENCE_CONTRACT_CLOSURE_REPORT_v0.1.md`. The final documentation-only handoff commit follows the exact implementation/QA checkpoint above. Because a Git commit cannot contain its own resulting SHA, its exact SHA is recorded in the DEV handoff response and is resolvable from the `work/ink-cloud-006` branch ref pinned for MR review.

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-006
BRANCH = work/ink-cloud-006
IMPLEMENTATION_AND_QA_HEAD = 184c74195e976526713ad549b236e13c9dac9ad7
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
