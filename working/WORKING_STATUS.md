# INK WORKING STATUS

STATUS: `IMPLEMENTED / AWAITING USER TEST + WINDOWS RUNTIME VERIFICATION`

Product: `INK v0.1`

Branch: `working/INK-v0.1-file-launch`

Authoritative work order: `ACTIVE/INK_CURRENT_WORK_ORDER.md`

Authoritative starting point: reviewed DEV completion commit `ceedcb44ff01d48c7f8aecb34c49107fceb4665c`

Current DEV head: `8961e90d9cdd64148b4350fe108a3e1906921b6d`

## Current objective

`unzip → double-click index.html → INK starts with usable drawing/testing functions`

This stage keeps a single HTML **launch entry** but does not yet require a final all-in-one `INK.html`.

## What has been done

- Created a bounded direct-file launch branch from the reviewed INK v0.1 source.
- Changed `product/source/index.html` to use a protocol-aware launcher instead of depending directly on `<script type="module" src="src/ink.js">`.
- Added `product/source/ink.entry.js`:
  - HTTP/HTTPS mode continues to start the authoritative modular `src/ink.js`.
  - `file://` mode loads the generated local Runtime compatibility payload.
- Added `product/source/ink.file-runtime.js` to boot the direct-file module graph through local Blob URLs/import mapping.
- Added generated direct-file module packs under `product/source/ink.file-modules-*.js`.
- Kept the original modular source under `product/source/src/`; the generated direct-file payload is a compatibility/delivery layer, not the source-of-truth architecture.
- Added direct-file UI smoke coverage for:
  - Runtime boot;
  - Creation/Layout workspace switch;
  - Inspector open/close;
  - existing Core interaction smoke.
- Extended `.github/workflows/ink-v0.1-runtime-baseline.yml` with a direct `file://` Windows Chrome/Edge gate.
- Service Worker / PWA remains outside the required direct-file startup path and must not block drawing/testing.
- Product identity remains `INK v0.1`; `FORMAT_VERSION = 4` remains unchanged.

## Direct-file Runtime files

Current delivery-related files are in `product/source/`:

- `index.html`
- `ink.entry.js`
- `ink.file-runtime.js`
- `ink.file-modules-01.js`
- `ink.file-modules-02.js`
- `ink.file-modules-03.js`
- `ink.file-modules-04.js`
- `ink.file-modules-05a.js` … `05g.js`
- `ink.file-modules-06.js`
- `ink.file-modules-07.js`
- `ink.file-modules-08.js`
- `ink.file-modules-09.js`
- `ink.file-modules-10.js`
- `ink.file-modules-11.js`
- `ink.file-modules-12.js`
- existing `styles.css`, `src/`, `assets/`, `schemas/`, `vendor/`, etc.

## Manual test package

A separate unverified package candidate was created for Yuan to test without waiting for the Windows runner.

Package branch:

`package/ink-file-launch-test`

Package commit:

`ae9e8ea89bc435609fab9a87567a46c0b687c736`

Download:

`https://github.com/thedoorw/INK-Browser-QA/archive/refs/heads/package/ink-file-launch-test.zip`

This package is a **TEST CANDIDATE**, not a verified/certified release.

## Verification status

Existing reviewed baseline before this change:

- Windows Runtime Run: `34677879593`
- Result: `PASS`
- Core interaction / persistence: `PASS`
- FLORA detached / enabled representative path: `PASS`

Direct-file change:

- Workflow: `INK v0.1 Runtime Baseline`
- Latest direct-file Run ID: `35295642191`
- Latest tested commit requested: `8961e90d9cdd64148b4350fe108a3e1906921b6d`
- Current state: waiting for Windows self-hosted runner.
- Reason: Yuan's Windows self-hosted runner is currently not started.
- No direct-file Runtime PASS is claimed yet.

## User test target

After downloading and extracting the test package, verify by double-clicking `index.html`:

- drawing works;
- Creation/Layout switch works;
- Inspector/property sidebar opens;
- Undo/Redo works;
- layers work;
- selection/transform works;
- save/load/export paths are usable for normal testing.

## Boundaries

Not part of this stage:

- final single-file `INK.html`;
- Service Worker / PWA as a required startup dependency;
- cloud/account/sync;
- certification;
- product version change;
- unrelated feature expansion.

## Next step

1. Yuan manually tests `package/ink-file-launch-test`.
2. When the Windows self-hosted runner is available, complete the direct `file://` Runtime gate.
3. Fix only verified direct-file defects.
4. After user + Runtime acceptance, refresh `package/ink-current` from the verified `product/source/` tree.
5. STOP.
