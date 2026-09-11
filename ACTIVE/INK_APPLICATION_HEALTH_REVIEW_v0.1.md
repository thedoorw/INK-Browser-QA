# INK Application Health Review v0.1

STATUS: `IN_PROGRESS`

Branch: `work/application-health-v0.1`

## Purpose

Perform bounded application-health cleanup before any FLORA decoupling, single-file bundling, certification, or release packaging. This phase does not delete preserved research/QA/history and does not modify `main`.

## Confirmed health findings

### H1 — Version identity split — `HIGH`

Observed product/runtime identities were inconsistent:

- `src/config.js`: `INK_VERSION = 1.6.5-RC`
- `package.json`: `1.6.5-rc.1`
- `manifest.webmanifest`: previously `INK v1.5.1 RC`
- `service-worker.js`: previously `RELEASE_VERSION = 1.5.1`
- historical/master-spec identities also include `v0.8.3` and `v3.3.0-rc.2`

Health action: Candidate-facing PWA identity has now been normalized to the runtime release family `1.6.5-RC`. Historical identities remain preserved as evidence and are not rewritten globally. HTML title normalization is still pending.

### H2 — PWA install path had broken icon dependencies — `HIGH`

The authoritative source had references to:

- `icons/ink-192.png`
- `icons/ink-512.png`

Those files are absent from the authoritative package, and the service worker previously included them in `cache.addAll(APP_SHELL)`, which could fail installation when those resources returned 404.

Health action completed on this work branch:

- removed nonexistent icon declarations from `manifest.webmanifest`;
- removed nonexistent icon entries from service-worker `APP_SHELL`;
- no replacement artwork was invented during health cleanup.

PWA remains outside the first single-file Candidate until browser installation/offline behavior is tested.

### H3 — PWA shell manifest is stale relative to current runtime — `HIGH`

The service-worker release identity was `1.5.1` while browser runtime config is `1.6.5-RC`. Its manually enumerated `APP_SHELL` also remains a manually maintained dependency list.

Health action completed in part:

- `service-worker.js` release identity normalized to `1.6.5-RC`;
- cache namespaces now follow the current runtime release family;
- missing icon dependencies removed.

Still pending:

- verify every `APP_SHELL` entry actually exists;
- compare service-worker shell against the live browser dependency graph;
- perform real browser install/offline smoke before PWA can be considered healthy.

### H4 — `index-standalone.html` is not truly standalone — `MEDIUM`

Current product-boundary evidence shows `index-standalone.html` loads `dist/ink.compat.js`, which then imports modular runtime code. It is a compatibility launcher, not a self-contained deliverable.

Health action: reserve the term `single-file` for the future generated `INK.html` only.

### H5 — FLORA is hard-wired into general runtime entry — `HIGH`

`src/ink.js` directly imports:

- `./flora/index.js`
- `./flora/mask/vector-mask.js`

This means a nominal general INK runtime cannot currently start without FLORA source being available.

Health action: record as architecture debt. Do not remove FLORA during health review. Decouple only after the baseline runtime health checks are recorded.

### H6 — Studio layer couples Core UI to Recipe and AI — `MEDIUM/HIGH`

`src/studio-core.js` directly imports Recipe and AI installation modules alongside Vector/Image/Paint/Program Import. This makes optional-capability removal non-trivial.

Health action: keep Recipe and AI intact for the first compatibility baseline; separate optional capability boundaries only after behavior-preserving smoke coverage exists.

### H7 — Capability maturity is incomplete — `MEDIUM`

Existing project documentation explicitly states that several professional drawing capabilities have not completed acceptance, including complete stylus-device acceptance, full watercolor/oil simulation, complete nondestructive image processing, and mature AI painting workflows.

Health action: do not label the next Candidate as a functionally complete professional drawing product. Certification must describe exactly what was tested.

## Health cleanup order

1. Freeze preserved `main` baseline. — DONE
2. Record startup/runtime dependency health. — IN PROGRESS
3. Normalize Candidate-facing version identity without rewriting historical evidence. — PARTIAL
4. Isolate PWA from first Candidate path. — POLICY SET; runtime verification pending
5. Establish browser smoke baseline for current compatibility runtime. — PENDING
6. Only then perform bounded FLORA decoupling. — PENDING
7. Re-run startup, drawing, history, layer, import/export, persistence and console-error checks. — PENDING
8. Build self-contained `INK.html` only after the modular compatibility baseline passes. — PENDING
9. Run Application Health Gate before packaging. — PENDING

## No-change protections

During this review:

- no deletion of QA, Validation, research, governance, or historical evidence;
- no source-wide version replacement;
- no FLORA deletion;
- no AI/Recipe deletion;
- no `main` modification;
- no release/certified label;
- no three-piece package yet.

## Current gate

`PWA_BROKEN_DEPENDENCY_REPAIRED / RUNTIME_BASELINE_PENDING`

The missing-icon installation blocker and stale PWA release identity have been repaired on the health branch. The next gate is to verify startup/runtime dependency health and establish a browser smoke baseline before any architecture decoupling.
