# INK Application Health Review v0.1

STATUS: `MAJOR_CLEANUP_COMPLETE / RUNTIME_GATE_BLOCKED_BY_ENVIRONMENT`

Branch: `work/application-health-v0.1`

Current product identity: `INK v0.1 — Health`

## Product identity decision

The active INK product version is now fixed at `v0.1` throughout pre-completion development.

Development progress is expressed only by a short stage suffix, such as `Health`, `Runtime`, `Boundary`, `Candidate`, `Review`, or `Certified`.

Active mappings:
- runtime/product display: `0.1`
- npm/SemVer package: `0.1.0`
- PWA/service worker: `0.1`
- document `appVersion`: `0.1`
- current stage: `Health`

Historical source identities (`1.5.1`, `1.6.0`, `1.6.5-RC`, `v0.8.3`, `v3.3.0-rc.2`, etc.) remain preserved in imported QA, validation, archive, migration, and historical documentation. They are not current product versions and are not globally rewritten.

Authoritative policy: `governance/INK_Product_Identity_v0.1.md`.

## Completed health cleanup

### H1 — Active identity normalization

Completed on this branch:
- `src/config.js` -> `INK_VERSION = 0.1`, stage `Health`;
- runtime document title is overridden from the active config to `INK v0.1 — Health`;
- `manifest.webmanifest` -> `INK v0.1 — Health`;
- `service-worker.js` -> `RELEASE_VERSION = 0.1`;
- engineering `package.json` -> `0.1.0`;
- active health-overlay `package.json` -> `0.1.0`;
- document unit expectations -> `appVersion = 0.1`;
- new browser/Ready health gates emit and require version `0.1`.

Still recorded as architecture debt:
- `src/studio-core.js` and AI component surfaces retain internal historical component literals such as `1.6.0`; these must not be treated as the product version and will be normalized when the Runtime baseline is available;
- historical test/script filenames keep source-lineage names where useful for preservation.

### H2 — Broken PWA icon dependencies

The source referenced nonexistent `icons/ink-192.png` and `icons/ink-512.png` resources.

Completed:
- removed nonexistent icon declarations from `manifest.webmanifest`;
- removed nonexistent icon entries from service-worker precache;
- no replacement artwork was invented.

PWA remains outside the first single-file Candidate until real install/offline browser verification passes.

### H3 — Browser QA dependency chain

The historical browser smoke depended on undeclared `playwright-core` / `@sparticuz/chromium` packages.

Completed:
- legacy script preserved as historical QA;
- dependency-free system-Chromium/CDP health smoke added;
- current active browser gate: `engineering/health-overlay/scripts/browser-health-v01.mjs`;
- current evidence target: `tests/browser-evidence-v0.1/browser-health-report-v0.1.json`.

### H4 — Ready gate

Completed:
- current Ready gate: `engineering/health-overlay/scripts/test-ready-check-v01.mjs`;
- it requires browser report version `0.1`, status `PASS`, zero failed checks, zero page exceptions, and zero critical console errors;
- `BLOCKED_BY_ENVIRONMENT` cannot be relabeled PASS.

### H5 — Classified repository and runnable workspace

Completed:
- `engineering/reconstruct_original_workspace.py` reconstructs the original 1,471-file relative layout from the exhaustive inventory;
- source size/SHA256 is verified before copy;
- classified preservation layout remains unchanged.

### H6 — Standalone naming

`index-standalone.html` remains a compatibility launcher, not a true self-contained deliverable.

Only the future generated `INK.html` may be called `single-file`.

### H7 — Product boundary debt

Still intentionally unchanged during health cleanup:
- FLORA is hard-wired into `src/ink.js`;
- Recipe and AI are coupled through `src/studio-core.js`;
- boundary work starts only after a compatibility Runtime baseline exists.

## Static and engineering health evidence

Local reconstruction evidence already established:

| Check | Result |
|---|---|
| JavaScript syntax scan | PASS — 304 `.js/.mjs`, 0 syntax failures |
| JSON parse scan | PASS — 442 JSON files, 0 parse failures |
| `npm run build` | PASS |
| `npm run typecheck` | PASS |
| `ink-doctor` | PASS |
| stale document version expectations | REPAIRED |
| broken PWA icon dependencies | REPAIRED |
| active browser health gate | REPLACED WITH v0.1 GATE |
| active Ready gate | REPLACED WITH v0.1 GATE |

## Local browser environment result

System Chromium is present, but the current execution environment blocks Chromium navigation to local `127.0.0.1` with organization policy.

Therefore:

`LOCAL_RUNTIME = BLOCKED_BY_ENVIRONMENT`

This is neither an INK Runtime FAIL nor a Runtime PASS.

## Formal Health Gate

`governance/INK_Application_Health_Gate_v0.1.md`

Order:

`BASELINE → PACKAGE → SYNTAX → CORE → RUNTIME → INTERACTION → PERSISTENCE → REGRESSION → RELEASE`

## Current health state

- PRODUCT IDENTITY: `INK v0.1 — Health`
- BASELINE: `PASS`
- PACKAGE / preservation accounting: `PASS`
- SYNTAX / JSON / typecheck / build: `PASS`
- PWA missing-resource blocker: `REPAIRED`
- active browser/Ready QA identity: `v0.1`
- CORE behavioral closure: `PARTIAL`
- RUNTIME real-browser gate: `BLOCKED_BY_ENVIRONMENT`
- INTERACTION: `PENDING RUNTIME`
- PERSISTENCE: `PENDING RUNTIME`
- REGRESSION: `PENDING RUNTIME`
- RELEASE: `NOT AUTHORIZED`

## Next bounded work

1. run the first real-browser `INK v0.1 — Runtime` baseline in an allowed browser environment;
2. normalize remaining live Studio/AI component version surfaces where they are user-facing or gate-relevant;
3. perform bounded FLORA optional-capability decoupling;
4. re-run Core / Interaction / Persistence regression;
5. only then build self-contained `INK.html` and the three-piece Candidate package.

No certified/release label is authorized at the current gate.
