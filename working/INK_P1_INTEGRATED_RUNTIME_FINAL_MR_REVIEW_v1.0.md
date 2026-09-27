# INK P1 Integrated Runtime — Final MR Review v1.0

STATUS: `MR_PASS / RUNTIME_GATE_CLOSED`

DATE: 2026-09-28

TASK: `INK-P1-INTEGRATED-RUNTIME-001`

EXACT_PRODUCT_TARGET:
`d1269334338531228ddfdd9383761cd419e58738`

QUEUE_COMMIT:
`164119a59ff6733aec418bccb2c0775ea0f6282c`

RUN_ID:
`36330300446`

SUCCESSFUL_ATTEMPT:
`2`

WINDOWS_JOB:
`108656605134`

WINDOWS_RUNNER:
`DESKTOP-NSOQH69`

ARTIFACT_ID:
`10936541218`

ARTIFACT_DIGEST:
`sha256:009cac80f1e11aca065c1ce0ab91014ffccac6427d9e788051ffcb78bb83c1f0`

## MR decision

```text
P1_INTEGRATED_RUNTIME = PASS
EXACT_TARGET_VERIFIED = YES
P1_A_THROUGH_H_PLUS_INTEGRATION = PASS
P1_TESTS = 234
P1_PASS = 234
P1_FAIL = 0
P1_SKIP = 0
CLOSURE_FOCUSED = 38 PASS / 0 FAIL
BROWSER_RUNTIME = PASS
UI_SUITE = PASS
CLOSURE_SUITE = PASS
GEOMETRY_SUITE = PASS
CREATIVE_SUITE = PASS
ARTIFACT_PRESERVED = YES
RUNTIME_GATE = CLOSED
```

## Exact-target evidence

Artifact evidence file:
`p1-runtime-coverage.json`

records:

```text
testedSha = d1269334338531228ddfdd9383761cd419e58738
status = PASS
exitCode = 0
signal = null
```

The test set contains the required 9 exact-target contracts:
- P1-A
- P1-B
- P1-C
- P1-D
- P1-E
- P1-F
- P1-G
- P1-H
- `qa/ink-p1-integration-001.test.mjs`

Node test summary:

```text
tests = 234
pass = 234
fail = 0
cancelled = 0
skipped = 0
todo = 0
```

## Regression evidence

Existing focused Closure/P0 path remained active and passed.

Focused closure summary:

```text
pass = 38
fail = 0
```

Semantic-region preload also passed.

## Browser Runtime evidence

Browser batch summary:

```text
status = PASS
testedSha = d1269334338531228ddfdd9383761cd419e58738
runner = DESKTOP-NSOQH69
ui = PASS
closure = PASS
geometry = PASS
creative = PASS
```

Runtime UI captures were produced at:
- delivered first paint;
- 1280×1024 Runtime;
- 960×800 Runtime.

## Attempt 1 disposition

Attempt 1 failed at the self-hosted execution infrastructure level before meaningful step/artifact evidence was preserved.

It is not classified as a product Runtime failure.

Attempt 2 was run after the active interactive self-hosted listener was confirmed and completed successfully.

## Queue closure

The main Runtime queue is now closed as `PASS`.

The queue update uses state `PASS`, so the controller will not start another Windows Runtime.

## Next program gate

The P1 native capability + integration + exact-SHA Runtime sequence is complete.

Next authorized lane:

`INK-UI-FULL-CAPABILITY-RECONCILIATION-001`

Owner:
`UR / UI REVIEW`

Scope:
UI capability reconciliation and placement planning only.

UI implementation remains separately gated until UR outputs are reviewed by MR.
