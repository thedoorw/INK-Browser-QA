# INK Application Health Review v0.1

STATUS: `MAJOR_CLEANUP_COMPLETE / RUNTIME_GATE_BLOCKED_BY_ENVIRONMENT`

Branch: `work/application-health-v0.1`

## Purpose

Perform bounded application-health cleanup before FLORA decoupling, single-file bundling, certification, or release packaging. Preserved research/QA/history remain intact and `main` is not modified by this health branch.

## Completed health cleanup

### H1 — Candidate-facing version identity

Authoritative runtime identity is `INK_VERSION = 1.6.5-RC` in `src/config.js`.

Completed on this branch:
- `manifest.webmanifest` moved from stale `1.5.1 RC` identity to the `1.6.5 RC` release family;
- `service-worker.js` moved from `RELEASE_VERSION = 1.5.1` to `1.6.5-RC`;
- stale document unit expectations `1.6.0-RC` were aligned to `1.6.5-RC`.

Still recorded as architecture debt:
- `src/studio-core.js` contains hard-coded `1.6.0` Studio identity instead of deriving it from the runtime version source of truth;
- legacy browser QA scripts also contain `1.6.0` / `v1.5.1` evidence identities;
- historical/master-spec versions remain untouched as preservation evidence.

### H2 — Broken PWA icon dependencies

The source referenced nonexistent:
- `icons/ink-192.png`
- `icons/ink-512.png`

They were present in both manifest declarations and service-worker `cache.addAll(APP_SHELL)`, creating a real install failure path.

Completed:
- removed nonexistent icon declarations from `manifest.webmanifest`;
- removed nonexistent icon entries from service-worker precache;
- no replacement artwork was invented.

PWA is still outside the first single-file Candidate until real install/offline browser verification passes.

### H3 — Stale browser QA dependency chain

The active historical script `browser-smoke-v151.mjs` imports `playwright-core` and `@sparticuz/chromium`, while `package.json` declares no dependencies or devDependencies. A clean source environment therefore fails before browser launch with `ERR_MODULE_NOT_FOUND`.

Completed:
- preserved the legacy script unchanged as historical QA;
- added `engineering/health-overlay/scripts/browser-health-v165.mjs`, a dependency-free Chromium/CDP health smoke using system Chromium;
- added health-overlay `package.json` that routes `test:browser` to the new v1.6.5 health smoke and keeps the old command as `test:browser:legacy`.

### H4 — Stale Ready gate

Historical `test-ready-check-v151.mjs` requires `tests/browser-evidence-v1.5.1/browser-smoke-report-v1.5.1.json`; the current source package does not contain that required evidence file.

Completed:
- added `engineering/health-overlay/scripts/test-ready-check-v165.mjs`;
- new Ready gate requires `tests/browser-evidence-v1.6.5/browser-health-report-v1.6.5.json`;
- `BLOCKED_BY_ENVIRONMENT`, missing evidence, page exceptions, console errors, or failed browser checks cannot be relabeled PASS.

### H5 — Classified repository is preservation-safe but not directly runnable

The full import intentionally separated original paths into `product/`, `qa/`, `research/`, `engineering/`, `governance/`, and `ARCHIVE/`. Historical scripts/tests use original relative paths, so the classified tree itself is not a drop-in runtime workspace.

Completed:
- added `engineering/reconstruct_original_workspace.py`;
- it reconstructs the original 1,471-file relative layout from `INK_FILE_INVENTORY_v0.1.csv`;
- every authoritative file is size/SHA256 verified before copy;
- active health overlays can then be applied into the disposable workspace;
- preserved repository categories remain unchanged.

This separates `preservation layout` from `runnable working layout` without duplicating an uncontrolled second source tree.

### H6 — Standalone naming

`index-standalone.html` remains a compatibility launcher: `dist/ink.compat.js` imports modular runtime source. It is not a self-contained product.

Decision:
- only the future generated `INK.html` may be described as `single-file`.

### H7 — Product boundary debt

Still intentionally not changed during health cleanup:
- FLORA is hard-wired into `src/ink.js`;
- Recipe and AI are hard-wired through `src/studio-core.js`;
- FLORA / AI / Recipe boundary work starts only after a compatibility Runtime baseline exists.

## Static and engineering health evidence

A local reconstruction of the authoritative source was exercised against Node `22.16.0` / npm `10.9.2`.

| Check | Result |
|---|---|
| JavaScript syntax scan | PASS — 304 `.js/.mjs`, 0 syntax failures |
| JSON parse scan | PASS — 442 JSON files, 0 parse failures |
| `npm run build` | PASS |
| `npm run typecheck` | PASS |
| `ink-doctor` | PASS, no reported errors/warnings |
| unit suite before cleanup | 2 confirmed stale-version failures (`1.6.0-RC` expected vs `1.6.5-RC` actual) |
| stale document unit expectations | REPAIRED on this branch |
| extended unit run after local repair | progressed through reported test 222 with no observed assertion failure in that span; full suite did not close within the execution window, therefore NOT certified PASS |
| legacy `npm run test:browser` | FAIL before launch — undeclared `playwright-core` dependency |
| legacy `npm run test:ready` | FAIL — stale v1.5.1 evidence path missing |
| replacement v1.6.5 browser health smoke | CREATED |
| replacement v1.6.5 Ready gate | CREATED |

## Local browser environment result

System Chromium is present, but this execution environment blocks Chromium navigation to local `127.0.0.1` with an organization policy page.

Therefore:

`LOCAL_RUNTIME = BLOCKED_BY_ENVIRONMENT`

This is not recorded as an INK Runtime failure and is not recorded as Runtime PASS. Candidate closure still requires a real allowed-browser run.

## Formal Health Gate

Created:

`governance/INK_Application_Health_Gate_v0.1.md`

Order:

`BASELINE → PACKAGE → SYNTAX → CORE → RUNTIME → INTERACTION → PERSISTENCE → REGRESSION → RELEASE`

## Current health state

- BASELINE: `PASS`
- PACKAGE / preservation accounting: `PASS`
- SYNTAX / JSON / typecheck / build: `PASS`
- PWA missing-resource blocker: `REPAIRED`
- stale browser QA dependency chain: `REPLACED BY HEALTH OVERLAY`
- stale Ready evidence path: `REPLACED BY HEALTH OVERLAY`
- runnable-workspace reconstruction: `IMPLEMENTED`
- CORE behavioral closure: `PARTIAL`
- RUNTIME real-browser gate: `BLOCKED_BY_ENVIRONMENT`
- INTERACTION: `PENDING RUNTIME`
- PERSISTENCE: `PENDING RUNTIME`
- REGRESSION: `PENDING RUNTIME`
- RELEASE: `NOT AUTHORIZED`

## Next bounded work

The health phase has now removed the obvious packaging/identity/PWA/QA-infrastructure blockers. The next source task is no longer general cleanup. It is:

1. finish Runtime baseline in an allowed browser environment;
2. normalize remaining live hard-coded Studio/AI runtime version surfaces;
3. perform bounded FLORA optional-capability decoupling;
4. re-run Core / Interaction / Persistence regression;
5. only then build self-contained `INK.html` and the three-piece Candidate package.

No certified/release label is authorized at the current gate.
