# INK Runtime Harness Stability 001 — DEV Checkpoint

STATUS: `DEV_HANDOFF / RUNTIME_EVIDENCE_COMPLETE`

DATE: 2026-09-26

TASK:

`INK-RUNTIME-HARNESS-STABILITY-001`

BRANCH:

`work/ink-runtime-harness-stability-001`

## WHY

The exact-SHA Windows Runtime entering this Work Order had:

```text
RUN = 36230493892
TESTED_SHA = 54301b0916a04d0a1c611df4db540481baa12300
FOCUSED_NODE = 26 / 26 PASS
CLOSURE = PASS
GEOMETRY = PASS
UI = FAIL / CDP Page.loadEventFired timeout
CREATIVE = FAIL / Harness timeout 360s
```

The mission was to stabilize QA/runtime transport and readiness only, with product source frozen.

## ROOT_CAUSE_UI

The UI visual-capture harness treated the one-shot CDP `Page.loadEventFired` event as the capture readiness authority.

On the Windows self-hosted Chrome path this event is timing-sensitive relative to navigation/event subscription and can fail to arrive at the waiter even when the target page is already navigated and renderable.

The prior failure was therefore a harness readiness false negative, not evidence that the page failed to load.

The replacement readiness proof is bounded and state-based:

```text
Page.getNavigationHistory
+ DOM.getDocument / DOM.querySelector('#app')
+ CSS.getMatchedStylesForNode
+ Runtime.evaluate when script-enabled:
    location.href == target
    document.readyState == complete
    INK_APP + INK_WEB_SHELL available
```

The successful exact-SHA Runtime produced readiness in:

```text
ui-first-paint    = 75 ms
ui-1280x1024      = 853 ms
ui-960x800        = 768 ms
```

This confirms the previous load-event timeout was not a truthful page-readiness signal.

## ROOT_CAUSE_CREATIVE

The entering Creative failure had no bounded stage evidence: the runner only knew that no terminal callback arrived within 360 seconds.

The prior artifact already contained smart-loop before/after PNGs, proving the Creative suite had advanced deeply before the timeout, but it did not identify the last completed assertion.

The harness observability defect was corrected by emitting an append-only, bounded progress stream for every passed Creative assertion plus terminal PASS/FAIL markers.

No Creative product behavior, assertion, Document/History/Revision semantics, or timeout value was changed.

On the next exact-SHA Runtime the prior stall did not reproduce:

```text
Creative assertions = 151 PASS
failures = 0
last progress sequence = 152
last marker = HARNESS_FINAL_EVIDENCE_READY
terminal atMs = 294750
suite = PASS
```

Disposition:

`PRIOR_STALL_NOT_REPRODUCED_AFTER_PROGRESS_INSTRUMENTATION / PRODUCT_DEFECT_NOT_ESTABLISHED`

The retained progress evidence makes any future timeout causally localizable instead of reporting only the 360-second boundary.

## WHAT_CHANGED

### UI capture readiness

`qa/runtime/run-ink-runtime-batch.mjs`

Replaced the single `Page.loadEventFired` dependency and arbitrary post-load sleep with bounded CDP state polling.

Preserved:

- real Chrome pixels;
- fresh browser profile for each capture;
- exact viewport enforcement;
- script-disabled delivered-shell first-paint semantics;
- PNG signature / dimensions;
- persisted byte length and SHA256 checks.

### Creative progress evidence

`qa/runtime/ink-cloud-018-browser-harness.html`

Added QA-only progress posts to `/__qa_progress` for:

- each successful assertion;
- final evidence-ready terminal marker;
- failure terminal marker.

`qa/runtime/run-ink-runtime-batch.mjs`

Added loopback-only progress collection into:

`evidence/creative-progress.json`

and `entry.lastProgress` in `batch.json`.

No assertion was removed, downgraded, skipped, or converted to informational status.

### Focused regression lock

`qa/ink-tech-closure-001-runtime-fix.test.mjs`

Locks:

- state-based UI readiness presence;
- absence of `Page.loadEventFired` capture dependency;
- absence of the old 1200 ms sleep;
- Creative progress route and markers;
- existing strict grounded read-only / modifiedAt proof.

## FILES_CHANGED

Implementation / regression files relative to baseline:

```text
qa/runtime/run-ink-runtime-batch.mjs
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-tech-closure-001-runtime-fix.test.mjs
```

Governance / task files on the branch:

```text
ACTIVE/INK_DEV_PROGRESS.md
working/INK_RUNTIME_HARNESS_STABILITY_001_DEV_WORKPACK.md
working/WORKING_STATUS.md
working/INK_RUNTIME_HARNESS_STABILITY_001_CHECKPOINT.md
```

Verified relative to baseline:

```text
PRODUCT_SOURCE_CHANGE = 0
```

## FOCUSED_QA

Official exact-SHA workflow:

```text
RUN = 36237399168
TESTED_SHA = 89d91e3b77198409d384de95f5d595f14f4620ca
RUNNER = DESKTOP-NSOQH69

focused Node:
  tests = 26
  pass = 26
  fail = 0
  skipped = 0
```

Required focused suites all executed through the central workflow:

- geometry ops;
- C2-A;
- C2-B;
- C2-C;
- final Runtime prep;
- Runtime fix regression.

## RUNTIME_RUNS

### Entering evidence

```text
RUN = 36230493892
TESTED_SHA = 54301b0916a04d0a1c611df4db540481baa12300
FOCUSED_NODE = PASS
UI = FAIL / Page.loadEventFired timeout
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = FAIL / 360s timeout
ARTIFACT_ID = 10901748565
ARTIFACT_DIGEST = sha256:0ddbfb1728052bccc9ff0ab9c459cc065658fe30fa44f4f2e2eff08e910a9e61
```

### Stability candidate

```text
RUN = 36237399168
TESTED_SHA = 89d91e3b77198409d384de95f5d595f14f4620ca
RUNNER = DESKTOP-NSOQH69

FOCUSED_NODE = 26 / 26 PASS
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS

ARTIFACT_ID = 10904374338
ARTIFACT_DIGEST = sha256:d6dc16745eebedd1202183b403933543fef65f400395bd7f02c6258e9ccf6384
ARTIFACT_FILES = 17
```

No blind same-SHA retry was used.

Windows runs consumed by this DEV Work Order: `1 / max 4`.

## FINAL_EXACT_SHA

`89d91e3b77198409d384de95f5d595f14f4620ca`

This is the exact source/QA candidate tested by Runtime run `36237399168`.

Checkpoint / progress commits after this SHA are governance-only and are not Runtime inputs.

## FINAL_SUITE_RESULTS

```text
FOCUSED_NODE = PASS / 26 of 26
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS
```

Closure evidence:

```text
bounded operations = 34
named tools = 21
History retained applied = 30
failures = 0
```

Creative evidence:

```text
checks = 151 PASS
failures = 0
HARNESS_FINAL_EVIDENCE_READY = PASS
WORKSTATION_PROPERTIES_GROUNDED_NO_DIRTY_WRITER = PASS
PROJECT_RELOAD_INTEGRITY = PASS
WORKSTATION_SINGLE_PANEL_AUTHORITY = PASS
```

UI visual evidence:

```text
ui-first-paint.png
  1280x1024
  39345 bytes
  sha256 b0cbbd73fc5b807ec7d3e2bc920b60494604af4009592c37ef9784991fa059a6

ui-1280x1024.png
  1280x1024
  45673 bytes
  sha256 e3ca10151dd2f939183e9018f0d2e2e37904b4e9a4b5f765499eb577c9ea7986

ui-960x800.png
  960x800
  36403 bytes
  sha256 b15007aa3ab5beeef2c687b4db073db6168b435067be07ccdff5162c31a0edd4
```

Creative smart-loop evidence:

```text
smart-loop-before.png
  728x960
  584660 bytes
  sha256 19eb289da30929082ecc9e59b34d89b7e066a5df06aa4a1e3bd535492cfab4e5

smart-loop-after.png
  728x960
  671192 bytes
  sha256 9c45b05df543b86e4e1a57174c3ce538d98db213fa8dabed551e79c53f378b1d

smart-loop.json
  status = PASS
  returnPath = RUNTIME_ARTIFACT_BRIDGE / NOT_LIVE_EXTERNAL_TRANSPORT
```

## PRESERVED BASELINE

```text
PRODUCT_SOURCE_CHANGE = 0
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
PROMOTION = NOT_RUN
```

Also unchanged:

- Document schema / migration;
- History semantics;
- Revision semantics;
- Renderer / Canvas / WebGL;
- product UI;
- Connector-005 product work;
- workflow source.

## NEXT

MR owns final Runtime acceptance/classification and any promotion decision.

Per the superseding continuation authority already recorded in this Workpack, this DEV session does not wait for MR after this handoff. Connector-005 continues on its separate authorized branch and must not be mixed into this Runtime branch.

```text
RESULT = DEV_RUNTIME_HARNESS_STABILITY_READY_FOR_MR_REVIEW
PROMOTION = NOT_RUN
DEV_HANDOFF
```
