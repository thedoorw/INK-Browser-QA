# INK PWA / Cache Freshness — Supervisor Gates DEV Return — 2026-10-03

STATUS: **BLOCKED_ON_REPOSITORY_PAGES_ADMIN_GATE / STOP → SUPERVISOR**

Branch: `work/pwa-cache-freshness-supervisor-gates-001`  
Latest main at return: `9c5915eaf9a67149e94cad7dc6e87552609e4de3`  
Latest-main reconcile base: `b0bd825a8d8ce97763ec45046219ce78f799b4ed`  
Exact product candidate: `60c0bdbd5576667a9888cba7584039432cdb28f8`  
Exact Pages gate attempt head: `4ab56be3b9205fedafaeccf093d39875135f0401`  
Build identity: `src-27c5b9ef87d1227f3afde10b`

The old PWA branch was **not** merged wholesale. The accepted bounded PWA delta was reapplied onto latest-main product bytes. Main advanced once during execution to `9c5915e...`, but that intervening commit changed only `working/INK_LIVE_CHAT_RESULT.json`; `product/source` did not change.

## Gate 1 — publication-bound deterministic build identity

Source implementation is ready:

- `product/source/generate-build-identity.mjs` deterministically fingerprints the complete `product/source` tree except its generated output;
- page runtime and runtime Service Worker share `build-identity.js`;
- `.github/workflows/ink-pages-publication.yml` generates the identity **inside the publication job**, verifies it, stages that exact generated file into the Pages artifact, and writes `PAGES_BUILD_INFO.json` with exact source SHA/build identity.

However, the repository's authoritative Pages publication is still GitHub's dynamic **main-branch** pipeline:

`dynamic/pages/pages-build-deployment`

Observed latest dynamic Pages run:
- run `37117195536`
- branch `main`
- SHA `9c5915eaf9a67149e94cad7dc6e87552609e4de3`
- result PASS.

Therefore the new workflow is not yet the sole authoritative publication boundary.

A workflow attempt to change repository Pages `build_type` using `GITHUB_TOKEN` was rejected with HTTP 403. GitHub documents repository environment / deployment-branch policy mutation as requiring repository **Administration (write)** permission.

**Gate 1 is not claimed closed.** It requires a Supervisor/admin repository setting transition to the workflow publication path (and, for pre-main same-origin evidence, an allowed candidate deployment policy).

## Gate 2 — actual deployed QA URL

Actual URL baseline was captured in real Chromium:

`https://thedoorw.github.io/INK-Browser-QA/product/source/`

Baseline evidence:
- build identity: `20261002-c04-two-state-repair`
- controller: `.../product/source/service-worker.js`
- cache: `ink-build-20261002-c04-two-state-repair-shell`
- Ctrl+F5: NO
- DevTools clear cache: NO
- unregister: NO
- run: `37117127162`
- artifact: `11272585365`
- digest: `sha256:45c4f671f13a941adf924e582ab7bfbbdc740dffabcc61e9ad359719e2905011`

The exact candidate Pages artifact was then built successfully:
- source SHA: `4ab56be3b9205fedafaeccf093d39875135f0401`
- generated build identity: `src-27c5b9ef87d1227f3afde10b`
- Pages artifact: `11271927264`
- digest: `sha256:faa88e6e6b911cef259a272de5befbed5a8a998d09fdf138890b692ab182aab9`

GitHub rejected deployment before live bytes changed:

`Invalid deployment branch and no branch protection rules set in the environment. Deployments are only allowed from main`

Because candidate bytes never reached the requested same-origin URL, the final deployed candidate open/F5 → close/reopen → offline sequence was correctly **not fabricated** and is still required.

## Latest-main local browser qualification

Run `37116899538`: **PASS**

Artifact `11271991742`  
Digest `sha256:584db80fc9486862ec760ff7320bbcdcc17c36b07c6ea76da4bccdda86e3241f`

Passed:
- deterministic identity verification;
- source/syntax/shell guards;
- latest-main baseline;
- real Chromium lifecycle A;
- real Chromium lifecycle B;
- ordinary reload uses normal cache semantics, not hard reload;
- reopen/offline/mixed-build/cache-cleanup checks.

## Required Supervisor action to close the two gates

Repository-level Pages authority must first permit the workflow publication boundary. The current execution tools do not expose the required repository Administration write operation.

After that authority change, rerun the existing Pages gate so the preserved previous-profile browser can prove, on the actual URL:

`ordinary open/F5 → candidate → close/reopen → offline`

with exact page/worker/cache identity and no manual cache intervention.

## Boundaries

- no wholesale merge of `work/pwa-cache-freshness-001`;
- no merge to `main`;
- no separate `thedoorw/INK` mutation;
- no `FORMAT_VERSION` change;
- no C04/C06/New Document/History/UI/drawing-render scope mutation.

Durable evidence:
`qa/evidence/pwa-supervisor-gates-20261003/FINAL_EVIDENCE.json`

**STOP → Supervisor.**
