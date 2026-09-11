# INK Application Health Review v0.1

STATUS: `IN_PROGRESS`

Branch: `work/application-health-v0.1`

## Purpose

Perform bounded application-health cleanup before any FLORA decoupling, single-file bundling, certification, or release packaging. This phase does not delete preserved research/QA/history and does not modify `main`.

## Confirmed health findings

### H1 — Version identity split — `HIGH`

Observed product/runtime identities are inconsistent:

- `src/config.js`: `INK_VERSION = 1.6.5-RC`
- `package.json`: `1.6.5-rc.1`
- `manifest.webmanifest`: `INK v1.5.1 RC`
- `service-worker.js`: `RELEASE_VERSION = 1.5.1`
- historical/master-spec identities also include `v0.8.3` and `v3.3.0-rc.2`

Health action: establish one runtime/release identity source of truth before Candidate packaging. Historical identities remain preserved as evidence and must not be rewritten globally.

### H2 — PWA install path is currently unhealthy — `HIGH`

`manifest.webmanifest` and `service-worker.js` reference:

- `icons/ink-192.png`
- `icons/ink-512.png`

Those icon files are absent from the authoritative package. `service-worker.js` includes them in `cache.addAll(APP_SHELL)`, so service-worker installation can fail when those resources return 404.

Health action: PWA remains outside the first single-file Candidate. Do not certify offline/installability until this dependency gap is explicitly repaired and tested.

### H3 — PWA shell manifest is stale relative to current runtime — `HIGH`

The service-worker shell is versioned `1.5.1` while browser runtime config is `1.6.5-RC`. Its manually enumerated `APP_SHELL` is therefore not a trustworthy declaration of the current dependency graph.

Health action: do not use current service worker as Candidate dependency authority. Rebuild PWA shell only after runtime boundary stabilizes.

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

1. Freeze preserved `main` baseline.
2. Record startup/runtime dependency health.
3. Normalize Candidate-facing version identity without rewriting historical evidence.
4. Isolate PWA from first Candidate path.
5. Establish browser smoke baseline for current compatibility runtime.
6. Only then perform bounded FLORA decoupling.
7. Re-run startup, drawing, history, layer, import/export, persistence and console-error checks.
8. Build self-contained `INK.html` only after the modular compatibility baseline passes.
9. Run Application Health Gate before packaging.

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

`HEALTH_REVIEW_STARTED`

The first blocking issues are version identity and stale/broken PWA dependencies. They must be resolved or explicitly excluded from the Candidate before release work proceeds.
