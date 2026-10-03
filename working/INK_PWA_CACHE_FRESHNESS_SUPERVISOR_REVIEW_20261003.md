# INK PWA / Cache Freshness — Supervisor Review — 2026-10-03

STATUS: **REVISION_REQUIRED / PROMOTION_BLOCKED**

Reviewed branch: `work/pwa-cache-freshness-001`  
DEV base: `d426147bd1b450bc0924f8bbbde959111f9d3314`  
Exact tested candidate: `1da854e6ce1805101f5ff3a4f7b7e16929a2d88e`  
Candidate build identity: `src-7ede97bf8faf5fa90f453a2d`  
Browser workflow run: `37114277306` / success  
Artifact: `11270587097`  
Artifact digest: `sha256:330553f44acd074c3355e29146dfd8f25c1b69d0a60b5e133472cdc633c7c58a`  
Main at Supervisor review: `357c24d7a2dbd6bf9ad6f28bf04f29cdf4c93287`

## Accepted evidence

The focused candidate behavior is credible and materially addresses the reported stale-page problem:

- previous cache-first worker/cache is present before transition;
- two independent fresh Chromium-profile lifecycle runs PASS;
- ordinary `Page.reload` uses `ignoreCache=false`;
- candidate worker and app build identities agree;
- previous INK-owned build caches are removed after activation;
- close-tab / reopen reaches the candidate;
- offline fallback loads a coherent cached build;
- no migration reload loop is observed;
- no C06 / C04 / New Document / History / drawing-render / FORMAT_VERSION mutation is claimed.

The migration-worker + dedicated runtime-worker split is therefore **not rejected**.

## Blocking finding 1 — build identity is not yet bound to the authoritative publication path

The candidate introduces a deterministic generator:

`product/source/generate-build-identity.mjs`

and checked-in generated output:

`product/source/build-identity.js`.

However, the only new automation that verifies this identity is:

`.github/workflows/ink-pwa-cache-freshness-dev.yml`

and that workflow is scoped only to:

`work/pwa-cache-freshness-001`.

It verifies `generate-build-identity.mjs --check`; it does not make the normal future `main` publication path generate or enforce a fresh build identity for every `product/source` mutation.

Therefore, after promotion, a later ordinary product/source change can again publish with a stale checked-in `build-identity.js` unless a developer remembers an extra manual generation step. That does not satisfy the dispatch requirement that deployment/build identity advance reliably with published source identity.

### Required correction

Bind build-identity generation/verification to the repository's **authoritative QA publication path**, not to the one task branch.

Acceptable solution shape:

```text
published product/source tree
→ deterministic build identity produced/verified as part of that same publication path
→ page + worker consume that identity
→ publication fails or cannot complete if identity is stale
```

Do not rely on a remembered manual command.

If the current GitHub Pages mode has no build step, DEV must explicitly solve that publication-boundary problem rather than leaving the task-only workflow as dead CI.

## Blocking finding 2 — no real deployed GitHub Pages transition evidence yet

The browser evidence is real Chromium, but the harness uses a local switchable HTTP server over materialized baseline/candidate trees.

The DEV return also states:

`No deploy.`

Therefore it does **not** yet prove the exact user-reported path on the actual deployed QA URL:

`https://thedoorw.github.io/INK-Browser-QA/product/source/`

The original acceptance requirement was normal open / F5 against deployed QA/source behavior without `Ctrl+F5`.

### Required correction / promotion gate

After reconciling the candidate onto latest main or an authoritative same-origin QA deployment route, capture:

1. a browser already controlled by the previous deployed worker/cache;
2. ordinary open / F5 only;
3. automatic transition to the new build;
4. close-tab / reopen;
5. offline fallback;
6. exact page / worker / cache identity;
7. no manual DevTools cache clear, unregister, Disable cache, or Ctrl+F5.

If a safe pre-main same-origin deployment route does not exist, this becomes a mandatory **post-integration deployment gate** before closure. It may not be omitted or replaced by the local harness.

## Branch state

At review, the work branch is diverged from main. Do not merge the branch wholesale.

Promotion/revision must reconcile the bounded PWA delta onto latest main and regenerate a fresh identity for the latest product/source tree before retesting.

## Disposition

```text
FOCUSED_PWA_DESIGN = ACCEPTABLE
LOCAL_REAL_BROWSER_EVIDENCE = ACCEPTED
BUILD_IDENTITY_PUBLICATION_BINDING = REVISION_REQUIRED
ACTUAL_DEPLOYED_QA_RELOAD_EVIDENCE = REQUIRED
WHOLESALE_BRANCH_MERGE = NO
PROMOTION = BLOCKED
NEXT = DEV REVISION → latest-main composition → browser evidence → Supervisor review
```
