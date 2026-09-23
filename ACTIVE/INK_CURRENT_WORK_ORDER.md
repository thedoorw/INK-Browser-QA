# INK CURRENT WORK ORDER

STATUS: `INK-TECH-DEBT-001 / MR_REVISE / BOUNDED_SOURCE_REVISION`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-TECH-DEBT-001` |
| TITLE | `Main Runtime / Bootstrap / Offline / UI Foundation Cleanup v0.1` |
| DEV_BRANCH | `work/ink-tech-debt-001` |
| BASELINE | `current main after CHAT Validation Phase B closure` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PRODUCT_BASE_VERSION | `v0.1 / PRESERVE` |
| DOCUMENT_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_AUTHORITY_CHANGE | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_AUTHORITY_CHANGE | `PROHIBITED` |
| NEW_ENGINE_FEATURES | `0` |
| PACKAGE_MUTATION | `0` |
| UI-006_PHASE_C_TO_I | `PAUSED UNTIL THIS WORK ORDER CLOSES` |
| RUNTIME_QA | `REQUIRED / EXACT-SHA / SELF-HOSTED WINDOWS CHROME` |

## Purpose

Clear confirmed accumulated technical debt in the INK application foundation before UI-006 continues into broader UI restructuring.

This is a cleanup / authority-consolidation task, not a feature program.

Current evidence shows:

```text
product/source/src JS/JSON files = 189
service-worker SOURCE_SHELL entries = 176
offline closure drift = 13 missing files

web-shell bootstrap
→ polls for globalThis.INK_APP
→ 50 ms retry
→ up to 40 retries

styles.css
→ ~2293 lines
→ 14 :root blocks
→ 222 !important declarations
→ historical UI layers + current UI-006 override layer

src/ink.js
→ production bootstrap + large embedded window.INK_TEST surface

Web / Portable HTML
→ 621 lines each
→ only 7 intentional delivery differences
```

These observations define the cleanup target; they do not authorize unrelated refactors.

## Required work

### A — Offline / Service Worker closure

Restore exact static-source closure.

Required:

1. `service-worker.js` source inventory must match the authoritative local `product/source/src` JS/JSON runtime closure.
2. The existing portable integration guard must pass again.
3. Do not remove newly integrated Core / CHAT / Creative Intelligence modules merely to make the list smaller.
4. No network dependency may become mandatory for Portable operation.

Known missing baseline includes:

```text
chat-reference-handoff
creative-intelligence-context
document-bridge
visual-compare
creative-memory
provenance-graph
research-creation-bridge
semantic-region-grounding
parametric-structure
geometry-kernel
Bezier.js local modules
```

DEV must derive the final closure from the actual source tree rather than blindly trusting this list.

### B — Cache identity / update correctness

Separate the visible product label from runtime cache/build identity.

Current product label remains:

```text
INK v0.1 · Web
INK v0.1 · Portable
```

But cache invalidation must not depend on the display version staying numerically unchanged.

Required:

- establish one deterministic cache/build identity mechanism suitable for static GitHub Pages deployment;
- preserve controlled Service Worker update behavior;
- eliminate the assumption that every future product change can continue sharing one permanent `0.1-Web` cache identity;
- preserve rollback/debuggability.

Do not bump the user-facing base version.

### C — Bootstrap / startup authority

Replace polling-based shell/runtime coordination with one explicit readiness contract.

Current debt:

```text
ink.js boots independently
→ creates globalThis.INK_APP

web-shell.js boots independently
→ polls INK_APP every 50 ms
→ retries up to 40 times
```

Target:

```text
one authoritative runtime bootstrap
→ explicit Runtime ready signal / contract
→ shell binds once
→ no retry polling as normal startup architecture
```

Requirements:

- first visible application shell must be the authoritative shell;
- no temporary substitute screen;
- no dark → light or placeholder → final-shell flash architecture;
- Web and Portable must share the same startup contract;
- preserve the existing single primary-panel authority from `INK-UI-DEBT-001`.

This closes the technical prerequisite behind UI-006 Phase B3. It must not redesign Phase C–I UI.

### D — Production QA hook boundary

Audit the embedded production `window.INK_TEST` surface.

Goal:

```text
production Runtime
≠ permanent home for large test-only control surface
```

DEV must:

- identify which hooks are required by authoritative browser Runtime QA;
- move test-only orchestration out of the production bootstrap where this can be done without weakening QA;
- keep only a minimal explicit diagnostic/test bridge if browser harnesses genuinely require it;
- preserve all existing Runtime coverage.

Do not delete QA capability merely to reduce file size.

### E — Shared shell source / CSS authority cleanup

This is consolidation, not visual redesign.

Required:

1. Preserve Web / Portable intentional differences only:
   - display label;
   - manifest;
   - delivery bootstrap where still technically necessary.
2. Reduce manual duplicated shell maintenance where safely possible.
3. Consolidate accepted desktop shell / UI-006 light-shell rules so new UI work does not continue as an ever-growing override stack.
4. Remove or neutralize only demonstrably superseded CSS authorities.
5. Preserve current accepted `INK-UI-DEBT-001` panel authority and the UI-006 Phase A/B visual decisions.
6. Do not implement UI-006 Phase C, D, E, F, G, H or I in this branch.

A smaller file is not itself an acceptance criterion. Authority clarity and regression safety are.

### F — Stale version / diagnostics metadata

Remove or correct stale engineering identity that can mislead debugging, including obsolete RC labels in active runtime/bootstrap surfaces.

Required:

- visible product remains v0.1;
- document `FORMAT_VERSION` remains 4;
- historical archived evidence is not rewritten;
- active diagnostics must accurately describe current capability/module state or clearly state that they are partial.

## Explicitly out of scope

Do not:

- redesign Document schema;
- alter History semantics;
- alter Revision semantics;
- replace renderer / Canvas / WebGL authority;
- retune ImageTracerJS;
- reopen CHAT Validation Phase A/B;
- start CHAT Validation Phase C;
- implement new drawing features;
- redesign the UI beyond cleanup needed for single authority;
- introduce a new framework;
- change product base version;
- mutate `package/ink-current`;
- delete historical research / QA evidence.

Large files such as `ink.js`, `chat-runtime.js`, and `creative-workspace.js` are not authorized for broad decomposition merely because they are large. Refactor only the bounded debt named above.

## UI lane coordination

During this Work Order:

```text
INK-WEB-UI-006
Phase A = preserve
Phase B1/B2 = preserve
Phase B3 = superseded by / coordinated through this bootstrap cleanup
Phase C–I = HOLD
```

UR / UI DEV may inspect and report, but must not independently mutate the same startup / shell / CSS authority while `INK-TECH-DEBT-001` is active.

After MR closure, UI-006 must resume from current main using clean promotion / reconciliation, not by blindly merging its diverged branch.

## DEV evidence required

Before handoff, record:

- exact branch HEAD;
- complete changed-file list;
- source/static/unit checks;
- actual source-tree vs Service Worker closure count;
- Web / Portable parity evidence;
- bootstrap authority evidence showing normal startup has no retry polling;
- cache/update identity evidence;
- production QA-hook boundary evidence;
- CSS authority inventory before/after;
- stale metadata corrections;
- confirmation that FORMAT_VERSION = 4;
- confirmation that product base version = v0.1;
- confirmation that Document / History / Revision / Renderer contracts were not changed.

Update branch-local:

`ACTIVE/INK_DEV_PROGRESS.md`

at meaningful checkpoints.

## Runtime gate

Because this Work Order changes Service Worker/cache and startup/bootstrap behavior, Runtime may not be deferred.

After DEV_HANDOFF and MR source review:

```text
exact DEV HEAD
→ self-hosted Windows Chrome Runtime
→ Web shell startup
→ Service Worker/update path
→ UI suite
→ Creative suite
→ Geometry suite
→ Web / Portable startup compatibility
```

Required final evidence:

- exact tested SHA;
- runner identity;
- Runtime run ID;
- UI = PASS;
- Creative = PASS;
- Geometry = PASS;
- no startup authority race;
- no stale-cache publication failure;
- no regression to existing CHAT Phase B capability.

## Gate

```text
DEV_AUTHORIZED
→ DEV_IN_PROGRESS
→ DEV_HANDOFF
→ MR_REVIEW_REQUIRED
→ exact-SHA Runtime
→ MR_PASS / MR_REVISE
```

DEV must STOP after handoff. No clean promotion and no next task without MR disposition.


## MR source review checkpoint — 2026-09-23

```text
REVIEWED_SOURCE_HEAD = ed38789bd1aa6dd12235ee57bbceb5195b965ad0
BRANCH_HANDOFF_HEAD = fad5fc806e24d67a5720b7a9af29ba1ae5ca8903
SOURCE_TO_HANDOFF_DELTA = governance/progress docs only
SOURCE_REVIEW = FAIL / MR_REVISE
RUNTIME = HELD / NOT AUTHORIZED YET
FORMAT_VERSION = 4 / PRESERVED
PRODUCT_BASE_VERSION = v0.1 / PRESERVED
```

### Blocker A — build identity is circular through stale-controlled app code

Current source does:

```text
src/config.js BUILD_ID
→ InkApp constructs service-worker.js?build=<BUILD_ID>
→ Service Worker derives BUILD_ID from its own query string
```

But the app source/config that supplies that query is itself controlled by the previous Service Worker and uses stable asset URLs such as `?v=0.1`.

A previously controlled client can therefore:

```text
old worker/cache A
→ receive new navigation HTML
→ still receive old cached ink.js/config A
→ register service-worker.js?build=A
→ new worker derives A
→ old/new worker can reuse the same build-A cache namespace
```

That does not establish a deployment-authoritative immutable build identity and can produce cache mutation/version-skew during upgrade.

#### Required bounded fix

Choose a minimal architecture where the next Service Worker obtains the new build identity independently of application code that the previous worker may serve stale.

Acceptance:

1. new deployment B cannot derive identity A from stale app/config;
2. build B never opens/writes build A shell/runtime cache names;
3. an already-controlled build-A client remains coherent until B is activated;
4. after B activation/reload, the client is coherently on B;
5. Service Worker update checks bypass stale HTTP/script caching where required;
6. add deterministic previous-build → next-build upgrade evidence.

Do not redesign the PWA beyond this bounded update correctness fix.

### Blocker B — Web / Portable manual duplication remains

`index.html` and `index-standalone.html` remain full duplicated shell documents. A normalized parity test detects drift but does not remove the manual dual-maintenance debt named by this Work Order.

Required:

- establish one authoritative shell source/template/generator with deterministic Web and Portable outputs; or
- provide an equivalently bounded mechanism that removes manual two-file shell editing.

Generated delivery HTML files may remain committed. No new framework is authorized.

### Revision C — downloaded diagnostics still omit build identity

`downloadExternalDiagnosticBundle()` calls `buildExternalDiagnosticBundle(...)` without `buildId: BUILD_ID`.

Current user-downloaded diagnostic bundles can therefore report:

```text
buildId = null
```

Required:

- pass the active build identity through the normal product diagnostic download path;
- add a guard covering the product call path, not only the QA bridge.

### Revision D — foundation guard must not freeze incidental debt counts

The new foundation test currently pins incidental values including exact CSS `:root` count, exact `!important` count, and a task-specific build string.

Required:

- retain semantic authority/closure assertions;
- avoid tests that require historical debt counts to remain exactly unchanged;
- for CSS debt, prefer authority uniqueness / absence of superseded layers and, where useful, a non-regression ceiling rather than exact preservation;
- build identity tests must validate the build mechanism/relationship, not permanently codify one task ID.

## Revised gate

```text
MR_REVISE
→ bounded source revision on work/ink-tech-debt-001
→ DEV_HANDOFF / STOP
→ MR exact source review
→ repository unit/static execution
→ exact-SHA self-hosted Windows Chrome Runtime
→ MR_PASS / further MR_REVISE
```

UI-006 Phase C–I remains HOLD.
CHAT Validation Phase C remains NOT_STARTED.
