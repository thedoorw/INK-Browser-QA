# INK PWA / Cache Freshness — Supervisor Gates DEV Return — 2026-10-03

STATUS: **BLOCKED_ON_REPOSITORY_PAGES_ADMIN_GATE / STOP → SUPERVISOR**

Branch: `work/pwa-cache-freshness-supervisor-gates-002`  
Latest main at final check: `bf547dfc4eda2b24e5062a8078176adf3b635524`  
Latest-main product reconcile base: `4188e9cc7673313726abd7986310d758912f63cf`  
Exact product candidate: `a2ef25b41cdc67064558ee6b5a74bcf923ca1a50`  
Build identity: `src-02bd9fe264b246ec6a9a13f0`

## Latest-main reconcile

The previous PWA branch was not merged wholesale.

The bounded PWA delta was reapplied on top of the current main product tree after Cluster D landed. Cluster D product changes were preserved in:

- `src/agent/capability-registry.js`
- `src/agent/public-creative-api.js`
- `src/editor/chat-bounded-edit.js`
- `src/recipe/recipe-engine.js`
- `src/studio-core.js`

Main later advanced to `bf547dfc4eda2b24e5062a8078176adf3b635524`, but those later commits changed only `ACTIVE/INK_LIVE_CHAT_REQUEST.json` and `working/INK_LIVE_CHAT_RESULT.json`; `product/source` did not change.

## Exact candidate qualification

Workflow run `37117779944`: **PASS**

Artifact: `11271464271`  
Digest: `sha256:f7a4d9add336c1640b8cb34922defed781da59b2bba590a573de13ab9bfadf5b`

Passed:
- deterministic build identity verification;
- source/syntax/shell guards;
- latest-main baseline;
- Chromium lifecycle A;
- Chromium lifecycle B;
- ordinary reload with normal cache semantics;
- close/reopen;
- offline fallback;
- cache cleanup / mixed-build checks.

## Gate 1 — formal Pages publication binding

Prepared source implementation:

- `product/source/generate-build-identity.mjs`
- shared page/worker `build-identity.js`
- `.github/workflows/ink-pages-publication.yml`

The workflow generates the identity inside the publication job, verifies it, stages that exact generated file into the Pages artifact, and writes exact `PAGES_BUILD_INFO.json`.

But the repository is still using GitHub's built-in branch publication:

`dynamic/pages/pages-build-deployment` from `main`.

This was directly observed in current Actions runs.

Two platform restrictions prevent closing this gate from the available execution authority:

1. changing repository Pages publication mode with workflow `GITHUB_TOKEN` returned **HTTP 403**;
2. candidate branch deployment was rejected by GitHub with:

`Invalid deployment branch and no branch protection rules set in the environment. Deployments are only allowed from main`

GitHub requires repository **Administration (write)** to alter the relevant environment/deployment branch policy.

Therefore Gate 1 is **not claimed closed**.

## Gate 2 — actual deployed Pages evidence

Actual deployed baseline was captured in real Chromium at:

`https://thedoorw.github.io/INK-Browser-QA/product/source/`

Observed baseline:
- build ID: `20261002-c04-two-state-repair`
- controller: `.../product/source/service-worker.js`
- cache: `ink-build-20261002-c04-two-state-repair-shell`
- Ctrl+F5: NO
- DevTools clear cache: NO
- unregister: NO

Evidence:
- run `37117127162`
- artifact `11272585365`
- digest `sha256:45c4f671f13a941adf924e582ab7bfbbdc740dffabcc61e9ad359719e2905011`

A candidate Pages artifact was also generated successfully, but GitHub rejected its deployment before live bytes changed. Therefore the required **actual candidate** ordinary open/F5 → close/reopen → offline sequence cannot be honestly marked complete.

Gate 2 is **not claimed closed**.

## Supervisor disposition

The remaining blocker is repository-level Pages authority, not PWA product behavior.

To close both gates, Supervisor/admin must first authorize the workflow publication boundary / candidate deployment route. The existing live harness can then run unchanged against the same URL and preserved browser profile.

No workaround was used:
- no Ctrl+F5;
- no cache clearing;
- no Service Worker unregister;
- no temporary main mutation;
- no merge to main;
- no whole old-branch merge.

Durable evidence:
`qa/evidence/pwa-supervisor-gates-20261003/FINAL_EVIDENCE_v2.json`

**STOP → Supervisor.**
