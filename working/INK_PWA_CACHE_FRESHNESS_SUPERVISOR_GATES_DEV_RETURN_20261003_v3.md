# INK PWA / Cache Freshness — Supervisor Gates DEV Return — v3

STATUS: **DEV_RETURN_READY / GATE 1 CLOSED ON CANDIDATE / GATE 2 POST-INTEGRATION LIVE CHECK ARMED / STOP → SUPERVISOR**

Branch: `work/pwa-cache-freshness-supervisor-gates-003`  
Latest main / merge base: `a6842e95a00ef440d47cc393394b9272d75f6082`  
Exact candidate: `0ccfd4a729f16ff755921f5881fa0090e2745581`  
Product/source tree: `316a46fb48141d2e3b0db90ca8cab93f58283cdf`  
Local fallback build identity: `src-9a29bbb8ab5444f8122e5e9d`

## Bounded reconcile

The old PWA branch was **not** merged wholesale. The accepted PWA delta was reapplied onto latest main, preserving current main product content. At final check, main had not advanced beyond `a6842e95...`.

No merge to main was performed.

## Gate 1 — publication-bound build identity

**PASS on exact candidate.**

The repository's authoritative QA publication remains GitHub's built-in:

`pages build and deployment → main`

No repository Pages-mode switch or admin permission is required.

A Jekyll publication identity source was added:

`pwa-pages-build-identity.txt`

It publishes to:

`/product/source/pages-build-identity.txt`

and renders:

`{{ site.github.build_revision }}`

The online PWA reads that endpoint with `cache: 'no-store'` and derives:

`pages-<published revision SHA>`

That identity is bound into:

- runtime Service Worker URL;
- worker diagnostics;
- shell/runtime cache names;
- application build diagnostics.

Local/non-Pages execution retains the deterministic `src-*` source fingerprint fallback.

Exact candidate proof:

- workflow run: `37119509698`
- result: **SUCCESS**
- Jekyll expected revision: `0ccfd4a729f16ff755921f5881fa0090e2745581`
- Jekyll rendered revision: `0ccfd4a729f16ff755921f5881fa0090e2745581`
- result: **PASS**

Therefore a future main Pages publication no longer depends on a developer remembering to refresh a checked-in identity.

## Waiting-worker recovery repair

A real Chromium retry exposed a genuine race: the new migration worker could be installed but remain waiting while the old cache-first worker continued controlling the page.

Migration bridge was revised to:

`ink-pwa-cache-migration-v4`

The stable legacy `service-worker.js` now:

- clears only INK-owned stale build caches during migration install;
- requests `skipWaiting()` immediately and again during install;
- uses a bounded migration navigation;
- leaves steady-state cache ownership to `service-worker-runtime.js?build=<identity>`.

This prevents the old worker from continuing to satisfy a recovery reload from stale cached HTML/assets even if activation is briefly delayed.

## Exact candidate browser qualification

Run `37119509698`: **SUCCESS**

Artifact:
- ID: `11272193852`
- digest: `sha256:b8542ea421cab1b60ca2385c9bb9cbeb61064946f4c38163cf5ea8fe0377ce81`

Two independent Chromium profiles passed from the old cache-first baseline:

- previous old worker/cache confirmed;
- ordinary reload uses `Page.reload; ignoreCache=false`;
- candidate worker/app identity reached;
- stale INK caches removed;
- no mixed-build cache;
- no reload loop;
- close → reopen PASS;
- offline fallback PASS.

No Ctrl+F5, DevTools cache clear, Disable cache, or unregister was used.

## Gate 2 — actual deployed QA URL

Actual deployed baseline was captured from:

`https://thedoorw.github.io/INK-Browser-QA/product/source/`

Observed:

- app/build ID: `20261002-c04-two-state-repair`
- controller: `.../product/source/service-worker.js`
- cache: `ink-build-20261002-c04-two-state-repair-shell`
- Ctrl+F5: NO
- DevTools cache clear: NO
- unregister: NO

The complete browser profile was archived into the candidate evidence artifact and then extracted into a fresh runner path; the restored profile reproduced the same old worker/build/cache state. This proves it can be reused for the transition test after integration.

### Mandatory post-integration live gate

The actual URL publishes **main only**. Under the explicit `no merge` instruction, candidate bytes cannot appear at that URL before Supervisor integration. Previous attempts also proved that branch deployment requires unavailable repository/environment admin authority.

Therefore the actual **candidate** open/F5 → close/reopen → offline sequence is not falsely claimed pre-merge.

Instead, the candidate includes:

`.github/workflows/ink-pwa-pages-postintegration.yml`

After Supervisor integrates the bounded candidate to main, it automatically:

1. downloads the preserved pre-integration browser profile;
2. waits until actual Pages `pages-build-identity.txt` equals the exact integrated main SHA;
3. opens the real QA URL using that old profile;
4. performs ordinary open and ordinary F5 semantics only;
5. performs close → reopen;
6. performs offline reload/fallback;
7. verifies app / worker / cache publication identity;
8. rejects any need for Ctrl+F5 / cache clear / unregister.

So:

```text
GATE_1_PUBLICATION_IDENTITY = CLOSED_ON_EXACT_CANDIDATE
LOCAL_REAL_BROWSER_MIGRATION = PASS / TWO PROFILES
ACTUAL_PAGES_OLD_PROFILE_CAPTURE = PASS / PRESERVED / RESTORE_VERIFIED
GATE_2_ACTUAL_CANDIDATE_TRANSITION = MANDATORY_POST_INTEGRATION
MERGE = NOT PERFORMED
STOP = SUPERVISOR
```

Durable evidence:

`qa/evidence/pwa-supervisor-gates-20261003/FINAL_EVIDENCE_v3.json`

## Boundaries

- `FORMAT_VERSION` unchanged.
- No unrelated UI change.
- No drawing/render capability change.
- No `thedoorw/INK` Live repo change.
- No wholesale old-branch merge.
- No main merge/deploy by DEV.

**STOP → Supervisor.**
