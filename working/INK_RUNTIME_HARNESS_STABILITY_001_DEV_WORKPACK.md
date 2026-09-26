# INK Runtime Harness Stability 001 — DEV Workpack

STATUS: `DEV_AUTHORIZED / START`

## Authority

```text
TASK = INK-RUNTIME-HARNESS-STABILITY-001
BRANCH = work/ink-runtime-harness-stability-001
DISPATCH_HEAD = 54301b0916a04d0a1c611df4db540481baa12300

UPSTREAM_TASK = INK-TECH-CLOSURE-001
UPSTREAM_DEV_HANDOFF_PRODUCT_HEAD = 28576d6a05fa85cd9be96aed6095a4b9c83a99a5

WINDOWS_RUNTIME_BY_DEV = AUTHORIZED / THIS WORKPACK ONLY
RUNTIME_EXECUTION_AND_EVIDENCE = DEV_OWNED
RUNTIME_ACCEPTANCE_AND_CLASSIFICATION = MR_OWNED
PROMOTION = PROHIBITED
CONNECTOR_005 = NOT_AUTHORIZED
PHOTOSHOP_UI_REBUILD = NOT_AUTHORIZED
```

This workpack is an explicit, bounded exception to older Closure wording that prohibited DEV Windows Runtime.
The exception exists only for Runtime harness stability work and does not transfer MR acceptance, promotion, or product/Core authority to DEV.

## Frozen product baseline

Product source is frozen.

```text
PRODUCT_SOURCE_CHANGE = 0
NEW_CAPABILITY = 0
BOUNDED_OPERATION_CHANGE = 0
NAMED_TOOL_CHANGE = 0
FORMAT_VERSION_CHANGE = 0
DOCUMENT_SCHEMA_OR_MIGRATION = 0
HISTORY_SEMANTICS = 0
REVISION_SEMANTICS = 0
RENDERER_CANVAS_WEBGL = 0
UI_PRODUCT_REDESIGN = 0
```

The Runtime-stability branch starts from `54301b0916a04d0a1c611df4db540481baa12300`.
Relative to the original Fix 3 DEV handoff, intervening MR changes are QA-only corrections; product source remains the accepted Fix 3 product.

Preserve:

```text
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
```

## Authoritative evidence entering this workpack

Latest exact-SHA run:

```text
RUN = 36230493892
TESTED_SHA = 54301b0916a04d0a1c611df4db540481baa12300
RUNNER = DESKTOP-NSOQH69

FOCUSED_NODE = 26 / 26 PASS
CLOSURE = PASS
GEOMETRY = PASS

UI = FAIL
  first-paint PNG produced
  failure = CDP event timeout: Page.loadEventFired

CREATIVE = FAIL
  failure = Harness timeout (360 seconds)
```

Earlier run on the same product source established that UI can pass and that Creative can advance into the browser harness.
Do not classify the remaining failures as product defects without new causal evidence.

## Objective

Make the existing Windows Runtime harness deterministic enough to produce one complete exact-SHA batch:

```text
focused Node
→ UI
→ Closure
→ Geometry
→ Creative
→ evidence artifact
```

Required final result:

```text
FOCUSED_NODE = PASS
UI = PASS
CLOSURE = PASS
GEOMETRY = PASS
CREATIVE = PASS
EXACT_TESTED_SHA = branch HEAD
```

No suite may be deleted, bypassed, silently skipped, or converted from a hard assertion to an informational check.

## Defect H1 — UI CDP capture readiness stability

Current symptom:

```text
captureUiVisual()
first-paint capture succeeds
subsequent runtime capture waits for Page.loadEventFired
→ CDP event timeout
```

Authorized intent:

- make browser-native CDP navigation/capture readiness deterministic on the Windows self-hosted runner;
- preserve real Chrome pixels;
- preserve exact viewport enforcement;
- preserve PNG signature/dimension validation;
- preserve persisted byte-length + SHA256 evidence;
- preserve fresh bounded browser profile/context per capture;
- preserve delivered-shell / script-disabled semantics for first-paint evidence.

Not accepted as a fix by itself:

- only increasing timeout values;
- arbitrary sleeps without a bounded readiness condition;
- ignoring Page/CDP errors;
- reusing stale screenshots;
- substituting synthetic or non-browser pixels;
- weakening viewport or PNG assertions.

A bounded alternative readiness signal is allowed if it proves the target page is actually ready for capture and is regression-covered.

## Defect H2 — Creative harness terminal/progress stability

Current symptom:

```text
Creative browser starts
→ no terminal callback within 360 seconds
→ Harness timeout
```

Authorized intent:

1. Add bounded progress evidence so a timeout identifies the last completed Creative stage.
2. Diagnose the actual stall rather than treating the 360-second timeout itself as root cause.
3. Fix only QA/runtime ordering, bridge, readiness, callback, or runner-lifecycle defects that are causally proven.
4. Preserve all Creative product assertions, including:
   - 21 named tools;
   - `use_ink` at the existing stable slot;
   - import/export append-only tool exposure;
   - mutation-before-approval block;
   - History / Revision proof;
   - grounded read-only proof;
   - no auto-preview;
   - smart-loop before/after evidence where required.

Not accepted:

- deleting slow checks;
- forcing PASS after partial completion;
- changing product behavior to satisfy the harness;
- changing Document/History/Revision semantics;
- blanket timeout inflation without stage evidence;
- special-casing the test fixture in product source.

## Authorized files

Primary authorized QA/runtime files:

```text
qa/runtime/run-ink-runtime-batch.mjs
qa/runtime/ink-cloud-018-browser-harness.html
qa/ink-tech-closure-001-runtime-fix.test.mjs
```

Conditionally authorized only if direct evidence proves they are required:

```text
qa/runtime/ink-web-ui-001-harness.html
qa/runtime/start-ink-local.ps1
qa/runtime/check-ink-local.ps1
```

If any other QA/runtime file is required, record WHY before changing it.

Workflow mutation is NOT pre-authorized.
If `.github/workflows/ink-runtime-batch-windows.yml` must change, STOP and request MR authorization with causal evidence.

## Runtime execution authority — explicit exception

DEV is authorized to execute Windows exact-SHA Runtime for this workpack.

Because the repository's central queue is the official dispatch path, the following narrow main exception is authorized:

```text
MAIN_MUTATION_EXCEPTION =
  ACTIVE/INK_RUNTIME_QUEUE.json only
PURPOSE =
  dispatch exact branch SHA
  + record latest Runtime result
```

DEV may not mutate any other main file and may not use this exception as promotion.

Queue requirements:

- `target_sha` must be the exact current branch HEAD being tested;
- retain the existing queue schema/version/batch policy;
- no target substitution after controller resolution;
- evidence must record tested SHA;
- do not mark a Runtime PASS unless all required suites in that exact run PASS.

## Rerun discipline

No blind rerun loop.

A same-SHA retry is allowed only once when the failure is classified as runner/infrastructure transient and no product/QA source changed.

After a reproducible harness failure:

```text
diagnose
→ bounded QA/runtime correction
→ focused/static regression
→ durable commit
→ exact-SHA Runtime
```

Maximum Windows runs under this workpack: 4.
If four runs do not produce a clean batch, STOP for MR review with the accumulated evidence.

## Required focused/static QA

At minimum:

```text
node --test qa/ink-tech-closure-001-runtime-fix.test.mjs
node --test   qa/ink-chat-geometry-ops-001.test.mjs   qa/ink-tech-closure-001-c2a.test.mjs   qa/ink-tech-closure-001-c2b.test.mjs   qa/ink-tech-closure-001-c2c.test.mjs   qa/ink-tech-closure-001-final-runtime-prep.test.mjs   qa/ink-tech-closure-001-runtime-fix.test.mjs
```

Also parse/check any changed JS or inline harness script.

## Evidence requirements

For every Runtime attempt record:

```text
run_id
tested exact SHA
runner
focused Node result
UI status
Closure status
Geometry status
Creative status
first failure / last completed progress marker
artifact ID
artifact digest
```

For the final candidate, retain:

- per-suite JSON;
- per-suite browser logs;
- Runtime batch report;
- `revision.json`;
- all three UI PNG captures with dimensions, byte lengths and SHA256;
- Creative smart-loop before/after PNG + JSON when the suite reaches that contract.

## DEV checkpoint / handoff

Create:

`working/INK_RUNTIME_HARNESS_STABILITY_001_CHECKPOINT.md`

Required contents:

```text
WHY
ROOT_CAUSE_UI
ROOT_CAUSE_CREATIVE
WHAT_CHANGED
FILES_CHANGED
FOCUSED_QA
RUNTIME_RUNS
FINAL_EXACT_SHA
FINAL_SUITE_RESULTS
PRODUCT_SOURCE_CHANGE = 0
bounded operations = 34
named tools = 21
FORMAT_VERSION = 4
PROMOTION = NOT_RUN
```

Required terminal state:

```text
RESULT = DEV_RUNTIME_HARNESS_STABILITY_READY_FOR_MR_REVIEW
DEV_HANDOFF → STOP
```

MR will review the exact handoff HEAD, artifacts, and failure classifications.
Only MR may declare Runtime acceptance, Closure completion, promotion, or release Connector-005.
