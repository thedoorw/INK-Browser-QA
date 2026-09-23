# INK-TECH-DEBT-001 — DEV HANDOFF

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

## Control

| Field | Value |
|---|---|
| TASK_ID | `INK-TECH-DEBT-001` |
| BRANCH | `work/ink-tech-debt-001` |
| BASE | `aea1570d6013d682460b11c63498ce491caf470a` |
| EXACT_SOURCE_HEAD | `dee7beee1938d042775538359f4881f429690e20` (revised source; remote handoff commit may differ) |
| PRODUCT_VERSION | `v0.1 / PRESERVED` |
| FORMAT_VERSION | `4 / PRESERVED` |
| PACKAGE | `NO MUTATION` |
| NEXT | `MR source review → exact-SHA self-hosted Windows Chrome Runtime` |

## Scope result

### 1. Service Worker / offline closure

```text
product/source/src JS+JSON = 189
service-worker SOURCE_SHELL = 189
missing = 0
extra = 0
service-worker syntax = PASS
```

The opt-in QA bridge is outside the production `src` tree at
`product/source/qa/runtime-test-bridge.js` and is cached explicitly so QA
remains available offline without changing the 189-file production closure.

### 2. Cache / build identity

Visible product identity remains `v0.1`.

Deployment identity is now independent:

```text
BUILD_ID = 20260923-ink-tech-debt-001-r1
service-worker registration = service-worker.js?build=<BUILD_ID>
cache prefix = ink-build-
shell/runtime caches = build-keyed
```

The old permanent `ink-v0.1-Web-shell` assumption is removed.

### 3. Bootstrap / startup authority

```text
web-shell.js loads before Runtime bootstrap
→ shell mounts once
→ Runtime constructs INK_APP
→ Runtime emits ink:runtime-ready
→ shell binds once
```

Normal startup retry polling was removed:

```text
retryCount = 0
setTimeout(tryBind, 50) = removed
temporary startup substitute style = removed
```

Web and Portable use the same contract.

### 4. Production QA-hook boundary

The large test surface is no longer embedded in `src/ink.js`.

Production bootstrap retains only:

```text
explicit QA opt-in detection
+ dynamic loader
+ QA-ready promise
```

Opt-in:

```text
?ink-qa=1
or
__INK_ENABLE_TEST_BRIDGE__ = true
```

The browser Runtime harnesses were updated to opt in explicitly.

### 5. Shared shell / CSS authority

Accepted UI-006 B1/B2 shell decisions were preserved without retaining a new
late override authority.

Inventory:

```text
baseline main:
  :root blocks = 14
  !important = 222
  INK-UI-DEBT-001 desktop authority = 1

UI-006 branch B1 overlay:
  :root blocks = 15
  !important = 224
  late UI-006 Phase B override = 1

final tech-debt source:
  :root blocks = 14
  !important = 220
  INK-UI-DEBT-001 desktop authority = 1
  late UI-006 Phase B override = 0
  synthetic brand CSS refs = 0
```

Original Y-mark JPG is used directly by Web and Portable visible brand surfaces
and favicon. No temporary startup visual layer remains.

### 6. Stale version / diagnostics metadata

Corrected active engineering identity includes:

- Portable bootstrap comment: stale RC identity removed.
- Active CSS historical version labels removed from current authority comments.
- Runtime architecture inventory explicitly marked `partial`, not exhaustive.
- External diagnostics now include `buildId`.
- Product `v0.1` and `FORMAT_VERSION = 4` remain unchanged.

## Web / Portable parity

Normalized shared-shell parity:

`PASS`

Intentional delivery differences remain limited to delivery label, manifest,
Runtime bootstrap file, and Web badge.

## Source / static / unit evidence

Focused GitHub-connected source/static assertion audit:

```text
20 focused foundation checks = PASS
offline closure = PASS
Service Worker parse = PASS
Web / Portable parity = PASS
startup authority = PASS
QA boundary = PASS
CSS authority = PASS
version/metadata = PASS
```

Updated / added repository unit guards:

- `qa/core/tests/unit/ink-tech-debt-001-foundation.test.mjs`
- `qa/core/tests/unit/portable-baseline-integration-v0.1.test.mjs`
- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`
- `qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs`

Environment limitation:

```text
node --test repository runner = NOT EXECUTED IN CHAT ENVIRONMENT
reason = execution container cannot resolve github.com and no branch workflow
         auto-run was available
claim = no false unit-run PASS recorded
```

The focused assertions above were executed against the exact GitHub branch
source. MR should include repository unit execution in source review if its
checkout/runner is available.

### Continuation verification

The repository was checked out and the four focused unit files were run locally:

```text
node --test qa/core/tests/unit/ink-tech-debt-001-foundation.test.mjs \
  qa/core/tests/unit/portable-baseline-integration-v0.1.test.mjs \
  qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs \
  qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs
result = 23/23 PASS
test correction commit = f6b12a5278300ef60a21dd3b437852f6a4731803
```

The earlier `NOT EXECUTED` note records the original handoff environment.
The continuation run found and corrected two outdated script-URL assertions;
no additional product source changed. MR must pin the new branch HEAD for Runtime.

## Runtime gate

Not executed by DEV.

Per Work Order:

```text
DEV_HANDOFF
→ MR source review
→ exact DEV HEAD
→ self-hosted Windows Chrome Runtime
→ Web shell startup
→ Service Worker/update path
→ UI suite
→ Creative suite
→ Geometry suite
→ Web / Portable startup compatibility
```

## Preserved hard boundaries

No changed files under authoritative:

- Document implementation directories
- History implementation directories
- Revision implementation directories
- Renderer implementation directories
- ImageTracer
- CHAT Phase A/B modules
- CHAT Phase C
- UI-006 Phase C–I
- `package/ink-current`

`FORMAT_VERSION = 4` preserved.

Product version `v0.1` preserved.

## Changed-file manifest

- `ACTIVE/INK_DEV_PROGRESS.md`
- `product/source/assets/INK_MARK_SOURCE_W-300.jpg`
- `product/source/dist/ink.compat.js`
- `product/source/index-standalone.html`
- `product/source/index.html`
- `product/source/manifest-portable.webmanifest`
- `product/source/manifest.webmanifest`
- `product/source/qa/runtime-test-bridge.js`
- `product/source/service-worker.js`
- `product/source/src/config.js`
- `product/source/src/ink.js`
- `product/source/src/pwa/update-manager.js`
- `product/source/src/release/external-diagnostics.js`
- `product/source/styles.css`
- `product/source/web-shell.js`
- `qa/core/tests/unit/ink-tech-debt-001-foundation.test.mjs`
- `qa/core/tests/unit/portable-baseline-integration-v0.1.test.mjs`
- `qa/core/tests/unit/shared-portable-web-shell-parity-v0.1.test.mjs`
- `qa/core/tests/unit/ui-debt-001-shell-panel-authority-v0.1.test.mjs`
- `qa/runtime/ink-cloud-018-browser-harness.html`
- `qa/runtime/ink-web-ui-001-harness.html`

## DEV disposition

```text
TASK_STATUS = DEV_HANDOFF
NEXT_ACTION = MR_REVIEW_REQUIRED
DEV = STOP
MERGE = NOT AUTHORIZED
NEXT_STAGE = NOT AUTHORIZED
```

## MR_REVISE response — four bounded corrections

This section supersedes the initial handoff's build-query identity and dual
HTML maintenance claims. Source checkpoint: `dee7beee1938d042775538359f4881f429690e20`.

1. **Worker upgrade:** `service-worker.js` now owns a literal deployment
   `BUILD_ID`. Stale `src/config.js` cannot choose the next worker's identity.
   The registration uses a stable worker URL and `updateViaCache: 'none'`;
   install prefetches with `cache: 'reload'`. A controlling worker returns its
   own cached navigation and source files until the waiting worker activates.
   Activation removes its predecessor's cache. The app/worker identifiers are
   checked for equality, while the worker remains authoritative.
2. **Shell maintenance:** `product/source/shell.template.html` is the only
   editable shell; `node product/source/generate-shell.mjs` produces the
   committed Web and Portable outputs. `--check` fails if either output drifts.
   Existing outputs were regenerated byte-identically.
3. **Diagnostics:** the product download call now passes `buildId: BUILD_ID`;
   a guard checks the actual call site.
4. **Semantic guards:** removed exact CSS debt counts, source file count and
   task-specific build string assertions. Authority uniqueness, closure,
   bounded CSS ceilings, app/worker build relationship and generated output
   equality remain checked.

Focused checks: 24/24 PASS across five task-related test files. Service
Worker syntax, shell `--check`, and `git diff --check`: PASS. The deterministic
upgrade test simulates A installation, B waiting, A's coherent HTML/modules,
cache isolation, then B activation/reload with B's HTML/modules.

The blanket legacy `qa/core/tests/unit/*.test.mjs` invocation is not a passing
gate in this checkout: many older tests resolve imports under the absent
`qa/core/src` tree, and some retain unrelated favicon/UI expectations.
Those baseline failures are not represented as passing tests.

Authoritative Windows Chrome Runtime has not run. MR must pin the new remote
branch HEAD and perform source review before that gate. No merge or package
mutation was performed.
