# INK REVIEW STATUS

STATUS: `INK-TECH-DEBT-001 / MR_REVISE / SOURCE_REVIEW_FAILED / RUNTIME_HELD`

```text
TASK_ID = INK-TECH-DEBT-001
REVIEWED_SOURCE_HEAD = ed38789bd1aa6dd12235ee57bbceb5195b965ad0
BRANCH_HANDOFF_HEAD = fad5fc806e24d67a5720b7a9af29ba1ae5ca8903
SOURCE_TO_HANDOFF_DELTA = docs/progress only
SOURCE_REVIEW = MR_REVISE
RUNTIME = NOT_RUN / HELD
UI-006_PHASE_C_TO_I = HOLD
CHAT_VALIDATION_PHASE_C = NOT_STARTED
FORMAT_VERSION = 4 / PRESERVED
PRODUCT_VERSION = v0.1 / PRESERVED
```

## Findings

### P0 — Service Worker build identity is not deployment-authoritative

Current path:

```text
cached app config BUILD_ID
→ service-worker.js?build=<BUILD_ID>
→ worker derives BUILD_ID from query
```

A client controlled by an older worker can receive stale app/config and therefore register the new worker with the old identity. This can reuse/mutate the prior cache namespace and create update version-skew.

Required: next worker build identity must be independent of stale-controlled application code, previous/new cache namespaces must stay distinct, and previous-build → next-build upgrade behavior must be proven.

### P1 — Web / Portable shell is still manually duplicated

The normalized parity guard is useful, but both 621-line delivery HTML files remain manually maintained copies. The Work Order required reducing the manual duplication itself.

### P1 — normal product diagnostics omit BUILD_ID

The normal diagnostic download path does not pass `buildId: BUILD_ID`, so downloaded bundles can report null build identity.

### P1 — new foundation test freezes incidental counts

Exact assertions for historical CSS counts and a task-specific build string turn current debt measurements into required permanent values. Replace them with semantic authority/non-regression checks.

## Disposition

```text
DEV = REVISE ON SAME BRANCH
NEW FEATURE SCOPE = 0
RUNTIME = WAIT
NEXT = bounded fix → DEV_HANDOFF / STOP → MR source re-review
```
