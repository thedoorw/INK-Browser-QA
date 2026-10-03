# INK PWA / Cache Freshness — DEV Return

STATUS: DEV_RETURN_READY / STOP → SUPERVISOR  
BRANCH: `work/pwa-cache-freshness-001`  
BASE AT BRANCH CREATION: `d426147bd1b450bc0924f8bbbde959111f9d3314`  
EXACT CANDIDATE: `1da854e6ce1805101f5ff3a4f7b7e16929a2d88e`  
BUILD ID: `src-7ede97bf8faf5fa90f453a2d`  
HOSTED QA RUN: `37114277306` / run #38 / **PASS**  
ARTIFACT: `11270587097`  
ARTIFACT DIGEST: `sha256:330553f44acd074c3355e29146dfd8f25c1b69d0a60b5e133472cdc633c7c58a`

## Result

The stale normal-open / reload path is repaired for the candidate source behavior.

Two independent fresh Chromium profiles, each beginning from the previous cache-first worker/cache, passed:

- ordinary reload without hard-reload / Disable cache;
- candidate worker and application build identity agreement;
- old INK cache cleanup;
- no mixed-build cache state;
- no reload loop;
- close tab → reopen;
- coherent offline fallback.

## Old → new Service Worker strategy

Old:

- one `service-worker.js`;
- manually fixed `BUILD_ID`;
- navigation cache-first;
- cache hits could prevent network revalidation;
- update activation could remain user-mediated.

New:

1. `service-worker.js` remains the stable legacy URL as migration bridge v3.
   - immediate takeover request;
   - one bounded identity navigation using `ink-pwa-migrate=ink-pwa-cache-migration-v3`;
   - migration requests are network-first with browser HTTP-cache reload semantics.
2. `service-worker-runtime.js` owns the steady-state PWA.
   - online navigation and same-origin assets are network-first;
   - build-scoped shell/runtime caches remain offline fallback;
   - stale INK-owned build caches are bounded/cleaned.
3. `src/pwa/update-manager.js` registers the dedicated runtime worker with `updateViaCache: 'none'` and automatic activation.
4. Page runtime and worker use the same generated build identity.

## Build identity

`product/source/generate-build-identity.mjs` deterministically fingerprints the complete `product/source` tree except its generated output.

Generated identity:

`src-7ede97bf8faf5fa90f453a2d`

`build-identity.js` is loaded by the page and imported by the runtime worker; `src/config.js` no longer owns an independent stale manual token.

## Browser evidence

Baseline worker:

`20261002-c04-two-state-repair`

Baseline caches:

- `ink-build-20261002-c04-two-state-repair-shell`
- `ink-build-20261002-c04-two-state-repair-runtime`

After normal reload:

- worker/app identity: `src-7ede97bf8faf5fa90f453a2d`
- cache: `ink-build-src-7ede97bf8faf5fa90f453a2d-shell`
- old build caches absent
- migration identity requests: exactly 1

After close/reopen and offline test:

- `ink-build-src-7ede97bf8faf5fa90f453a2d-shell`
- `ink-build-src-7ede97bf8faf5fa90f453a2d-runtime`
- coherent cached HTML / manager / generated identity verified

Durable evidence summary:

`qa/evidence/pwa-cache-freshness-001/FINAL_EVIDENCE.json`

## Regression

PASS:

- generated build identity verification;
- PWA source guards: 5/5;
- `node product/source/generate-shell.mjs --check`;
- syntax checks for generator, both workers, update manager and browser harness;
- two independent real-Chromium lifecycle passes.

## Candidate changed files

- `.github/workflows/ink-pwa-cache-freshness-dev.yml`
- `product/source/build-identity.js`
- `product/source/generate-build-identity.mjs`
- `product/source/index-standalone.html`
- `product/source/index.html`
- `product/source/service-worker-runtime.js`
- `product/source/service-worker.js`
- `product/source/shell.template.html`
- `product/source/src/config.js`
- `product/source/src/ink.js`
- `product/source/src/pwa/update-manager.js`
- `qa/pwa-cache-freshness-browser.mjs`
- `qa/pwa-cache-freshness.test.mjs`

## Technical-debt delta

Removed:

- manually stale worker build token;
- online cache-first page authority;
- indefinite stale module/cache-hit behavior;
- hidden manual activation dependency.

Added / residual:

- migration bridge + runtime-worker split adds explicit PWA lifecycle structure;
- the first stale-client recovery navigation carries a bounded migration identity query; evidence confirms exactly one migration request and no loop.

## Integration state

Current main at return: `32c31391123ff92c0c5a218957f61bfb6de45667`.

The DEV branch is intentionally not rebased/merged after the candidate test. At candidate time it was diverged from current main (47 ahead / 51 behind; merge base `d426147bd1b450bc0924f8bbbde959111f9d3314`).

Supervisor must reconcile latest main before promotion/deployment.

## Boundaries

- `FORMAT_VERSION` unchanged.
- No C06 zoom, C04 workspace, New Document/A4, History, unrelated UI, Core drawing/render changes.
- `thedoorw/INK` Live repo untouched.
- No merge.
- No deploy.

**STOP → Supervisor review.**
