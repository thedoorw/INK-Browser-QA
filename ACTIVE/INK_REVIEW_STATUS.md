# INK REVIEW STATUS

STATUS: `INK-TECH-DEBT-001 / PRODUCT_SOURCE_PASS / QA_HARNESS_REVISE_INCOMPLETE / RUNTIME_HELD`

```text
TASK_ID = INK-TECH-DEBT-001
PRODUCT_SOURCE_REVIEW = PASS
REVIEWED_REMOTE_HEAD = ae9a8d0d9c41b7063d87d03c0b84811ac04e0656
RUNTIME_RUN = 35885929148
RUNTIME_TESTED_SHA = ae9a8d0d9c41b7063d87d03c0b84811ac04e0656
RUNNER = DESKTOP-NSOQH69
RUNTIME = FAIL
UI = 69/71 / FAIL
CREATIVE = NOT_REACHED
GEOMETRY = NOT_REACHED
ARTIFACT = 10763165329
ARTIFACT_DIGEST = sha256:d47a862b58636bbe932201475d9d67bc8e7083c466158e1873ab9dff64b4b934
DECISION = MR_REVISE / QA_HARNESS_ONLY
PRODUCT_SOURCE_CHANGE_REQUIRED = NO
```

## Runtime finding

The UI suite failed on two assertions that encode the superseded dark-shell visual contract rather than the accepted UI-006 B1 light-shell contract.

### 1 — typography assertion is color-mode stale

Observed:

```text
contextualAdvanced = 10px
inspectorTitle = 11px
inspectorTab = 10px
contextLabel = 10px
contextLabel color = rgb(98,98,98)
```

All required font-size floors pass.

The failure is only the legacy assertion:

```text
R + G + B >= 480
```

That rule expected bright secondary text on a dark shell. The accepted shell is light, where darker text is correct.

Required harness revision:

- retain the functional font-size floors;
- replace absolute text brightness with contrast/readability against the actual light shell surface;
- do not recolor the product merely to satisfy the stale dark-shell test.

### 2 — layout assertion hard-codes the superseded wrapper color

Observed rendered pixels:

```text
canvas workbench corner = [43,44,46]
A4 paper center = [254,253,248]
stage-wrap background = rgb(222,222,222)
```

The actual rendered canvas still clearly separates dark workbench from real A4 paper.

The failure is only the extra legacy requirement:

```text
stage-wrap background == rgb(38,38,38)
```

UI-006 B1 already accepted a light workstation shell. The wrapper may therefore be light while the actual layout renderer still provides dark-workbench / light-paper separation.

Required harness revision:

- test the rendered workbench/paper visual separation;
- do not require the CSS wrapper itself to remain dark;
- preserve the accepted light-shell contract.

## Scope of revision

```text
ALLOWED =
  qa/runtime/ink-web-ui-001-harness.html
  task-specific QA assertions only if needed

PRODUCT_SOURCE = HOLD / NO CHANGE
SERVICE_WORKER = HOLD / NO CHANGE
BOOTSTRAP = HOLD / NO CHANGE
CSS = HOLD / NO CHANGE
DOCUMENT/HISTORY/REVISION/RENDERER = NO CHANGE
CHAT PHASE C = NOT_STARTED
UI-006 PHASE C-I = HOLD
```

After the harness-only revision:

```text
DEV_HANDOFF / STOP
→ MR source/harness review
→ exact-SHA Runtime rerun
→ UI
→ Creative
→ Geometry
→ MR final disposition
```

The handoff-local `dee7beee...` identifier remains non-authoritative because it is not a resolvable remote commit. Use the actual remote branch HEAD as the next exact Runtime fingerprint.


## MR harness re-review — 51d9ca0d4326720c5a9970f3872c99eb2808db2c

```text
REMOTE_HEAD = 51d9ca0d4326720c5a9970f3872c99eb2808db2c
DELTA_FROM_PREVIOUS_RUNTIME_SHA = 1 commit
FILES_CHANGED =
  qa/runtime/ink-web-ui-001-harness.html
  qa/core/tests/unit/ink-tech-debt-001-foundation.test.mjs
PRODUCT_SOURCE_CHANGED = NO
HARNESS_REVIEW = MR_REVISE
RUNTIME = HELD / DO NOT RERUN YET
```

Accepted in this commit:
- harness now reads worker-owned identity through `INK_GET_VERSION`;
- harness no longer re-registers `service-worker.js?build=...` or `qa-refresh`;
- `registration.update()` and `updateViaCache === 'none'` are checked;
- product source remains untouched.

Still unresolved from the prior MR runtime finding:
1. Typography assertion still requires `R + G + B >= 480`, which is the obsolete bright-text-on-dark-shell rule.
2. Layout assertion still requires `stage-wrap background == rgb(38,38,38)`, which is the obsolete dark wrapper rule.

These exact predicates caused Runtime 35885929148 to stop at UI 69/71. They must be replaced with the already-authorized light-shell-compatible readability/contrast and rendered workbench-vs-paper separation checks before a rerun.

```text
NEXT =
  harness-only correction on same branch
  → DEV_HANDOFF / STOP
  → MR re-review
  → exact-SHA Runtime rerun
```
