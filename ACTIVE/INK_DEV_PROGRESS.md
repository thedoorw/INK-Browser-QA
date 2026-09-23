# INK DEV PROGRESS

STATUS: `INK-TECH-DEBT-001 / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-TECH-DEBT-001` |
| TITLE | `Main Runtime / Bootstrap / Offline / UI Foundation Cleanup v0.1` |
| BRANCH | `work/ink-tech-debt-001` |
| BRANCH_BASE | `aea1570d6013d682460b11c63498ce491caf470a` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| RUNTIME_QA | `REQUIRED AFTER DEV_HANDOFF + MR SOURCE REVIEW` |
| NEXT | `MR source review → exact-SHA self-hosted Windows Chrome Runtime` |

## Read first

1. `README.md`
2. `AGENTS.md`
3. `ACTIVE/README.md`
4. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
5. `working/WORKING_STATUS.md`
6. `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
7. `research/INK_UI_DEBT_001_SHELL_PANEL_AUTHORITY_REPORT_v0.1.md`
8. relevant product / QA files named by the Work Order

## Confirmed baseline debt

```text
source JS+JSON = 189
service-worker SOURCE_SHELL = 176
missing offline closure entries = 13

web-shell startup = polling for INK_APP / 50 ms / max 40 retries

styles.css = historical layered authority
UI-006 Phase B currently adds a light-shell override layer

src/ink.js = production bootstrap + embedded INK_TEST control surface

Web / Portable HTML = duplicated full shell with only bounded delivery differences
```

DEV must verify these figures against branch HEAD before changing code.

## Work sequence

```text
A offline closure
→ B cache/update identity
→ C bootstrap readiness authority
→ D production QA-hook boundary
→ E shared shell/CSS authority cleanup
→ F stale active metadata
→ source/static/unit/parity evidence
→ DEV_HANDOFF
→ STOP
```

Do not perform Runtime before MR source review unless a local focused browser check is needed for development. Authoritative exact-SHA Runtime belongs to the MR gate.

## Hard boundaries

```text
Document authority = NO CHANGE
History semantics = NO CHANGE
Revision semantics = NO CHANGE
Renderer authority = NO CHANGE
ImageTracer tuning = NO
CHAT Phase A/B reopen = NO
CHAT Phase C = NO
UI-006 Phase C-I = NO
new framework = NO
base-version bump = NO
package mutation = NO
```

## Checkpoint template

At each meaningful checkpoint append:

```text
COMMIT =
MILESTONE =
FILES_CHANGED =
CHECKS =
KNOWN_GAPS =
```

## Handoff contract

Final branch state must record:

- exact HEAD;
- complete changed-file list;
- source/static/unit results;
- source-tree vs Service Worker closure count;
- Web / Portable parity;
- bootstrap authority evidence;
- cache/update identity evidence;
- QA-hook boundary evidence;
- CSS authority before/after;
- stale metadata corrections;
- FORMAT_VERSION 4 preserved;
- product v0.1 preserved;
- Document / History / Revision / Renderer authority preserved.

Then:

```text
TASK_STATUS = DEV_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```


## Checkpoint 1 — Baseline verification

```text
COMMIT = be8285927d133cef994c5e8eef11034c0a74a4f7
MILESTONE = READ_COMPLETE / BASELINE_VERIFIED / DEV_IN_PROGRESS
FILES_CHANGED = ACTIVE/INK_DEV_PROGRESS.md only
CHECKS =
  required authority/governance files read
  product/source/src JS+JSON = 189
  service-worker SOURCE_SHELL = 176
  missing offline closure entries = 13
  extra offline closure entries = 0
  web-shell retry polling = confirmed / 50 ms / max 40
  production window.INK_TEST = confirmed embedded in src/ink.js
  CSS accepted desktop authority = INK-UI-DEBT-001 single region confirmed
  FORMAT_VERSION = 4 confirmed
  product display version = v0.1 confirmed
KNOWN_GAPS =
  six authorized cleanup items not yet implemented
  authoritative Runtime intentionally not run before DEV_HANDOFF + MR source review
```


## Checkpoint 2 — Authorized cleanup implemented

```text
COMMIT = 7370354c9537067cab7ca9338553c5eb2c52f33d
MILESTONE = SIX_SCOPE_SOURCE_CLEANUP_COMPLETE / STATIC_AUDIT_PASS
FILES_CHANGED = see final handoff manifest
CHECKS =
  source tree JS+JSON = 189
  service-worker SOURCE_SHELL = 189
  offline missing = 0
  offline extra = 0
  service-worker syntax = PASS
  Web / Portable normalized shell parity = PASS
  bootstrap retry polling = 0
  runtime ready contract = ink:runtime-ready
  temporary startup substitute = 0
  production QA bridge = explicit opt-in only (ink-qa=1 or __INK_ENABLE_TEST_BRIDGE__)
  browser QA harnesses = explicit opt-in
  CSS shell authority markers = 1
  CSS braces = balanced
  CSS :root blocks = 14
  CSS !important count = 220
  synthetic brand CSS refs = 0
  product version = v0.1 preserved
  FORMAT_VERSION = 4 preserved
  diagnostics module inventory = explicitly PARTIAL
  cache identity = build-keyed / display-version independent
KNOWN_GAPS =
  repository unit/static test commands not yet executed for this checkpoint
  authoritative exact-SHA Chrome Runtime remains MR-gated after DEV_HANDOFF + source review
```


## Checkpoint 3 — DEV handoff

```text
EXACT_SOURCE_HEAD = ed38789bd1aa6dd12235ee57bbceb5195b965ad0
HANDOFF_DOC_COMMIT = 733de8769f220da851b660f9e435e89c0249c28d
MILESTONE = DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP
HANDOFF = working/INK_TECH_DEBT_001_DEV_HANDOFF.md

FINAL SOURCE/STATIC EVIDENCE =
  focused foundation assertions = 20/20 PASS
  product/source/src JS+JSON = 189
  service-worker SOURCE_SHELL = 189
  offline missing = 0
  offline extra = 0
  service-worker syntax = PASS
  Web / Portable normalized parity = PASS
  bootstrap retry polling = 0
  runtime ready contract = ink:runtime-ready
  temporary startup substitute = 0
  production src embedded INK_TEST surface = 0
  QA bridge = product/source/qa/runtime-test-bridge.js / explicit opt-in
  CSS desktop authority markers = 1
  UI-006 late override authorities = 0
  CSS :root blocks = 14
  CSS !important = 220
  synthetic brand CSS refs = 0
  stale active RC/CSS labels = 0
  FORMAT_VERSION = 4
  product version = v0.1

UNIT RUNNER =
  focused repository guards added/updated
  node --test = NOT EXECUTED in chat environment
  reason = no repository checkout path; container cannot resolve github.com;
           branch workflow auto-run unavailable
  false PASS claim = NO

HARD BOUNDARIES =
  Document = unchanged
  History = unchanged
  Revision = unchanged
  Renderer authority = unchanged
  ImageTracer = unchanged
  CHAT Phase A/B = unchanged
  CHAT Phase C = unchanged
  UI-006 Phase C-I = unchanged
  package = unchanged

RUNTIME =
  NOT RUN BY DEV
  REQUIRED NEXT = MR source review → exact-SHA self-hosted Windows Chrome Runtime

TASK_STATUS = DEV_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
DEV = STOP
MERGE = NOT AUTHORIZED
NEXT_STAGE = NOT AUTHORIZED
```

## Checkpoint 4 — Continued handoff verification

```text
COMMIT = f6b12a5278300ef60a21dd3b437852f6a4731803
MILESTONE = FOCUSED_UNIT_RUN_PASS / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP
FILES_CHANGED = qa/core/tests/unit/portable-baseline-integration-v0.1.test.mjs
CHECKS = node --test on four focused foundation, portable, parity, and panel test files: 23/23 PASS
FIX = update two stale script-URL assertions to match current ?v=0.1 entry URLs
KNOWN_GAPS = authoritative exact-SHA Windows Chrome Runtime remains MR-gated
```

## Checkpoint 5 — MR_REVISE bounded corrections / handoff

```text
SOURCE_CHECKPOINT = dee7beee1938d042775538359f4881f429690e20
MILESTONE = FOUR_REVISIONS_IMPLEMENTED / DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP
FILES_CHANGED = service-worker.js; src/config.js; src/ink.js;
  src/pwa/update-manager.js; shell.template.html; generate-shell.mjs;
  foundation, portable-integration and worker-upgrade unit tests;
  ACTIVE/INK_DEV_PROGRESS.md; working/INK_TECH_DEBT_001_DEV_HANDOFF.md
CHECKS = focused 24/24 PASS; worker parse PASS; generated HTML --check PASS;
  source offline closure PASS; Web/Portable generated outputs byte-identical to prior delivery PASS
BUILD_UPGRADE = worker-owned build ID; A and B separate caches; A remains
  coherent while B waits; B coherent after activation/reload (deterministic simulation)
DIAGNOSTICS = product download passes active BUILD_ID
KNOWN_GAPS = broad legacy unit invocation has unrelated missing qa/core/src imports;
  authoritative exact-SHA Windows Chrome Runtime remains MR-gated
NEXT_ACTION = MR source review; DEV STOP; merge/package/next stage NOT AUTHORIZED
```
