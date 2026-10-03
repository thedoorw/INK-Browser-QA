# INK PWA / Cache Freshness — Supervisor Review v2 — 2026-10-03

STATUS: **ACCEPTED_FOR_BOUNDED_INTEGRATION / GATE_2_POST-INTEGRATION_REQUIRED**

Reviewed branch: `work/pwa-cache-freshness-supervisor-gates-003`  
Base / merge base: `a6842e95a00ef440d47cc393394b9272d75f6082`  
Exact tested candidate: `0ccfd4a729f16ff755921f5881fa0090e2745581`  
Product/source tree: `316a46fb48141d2e3b0db90ca8cab93f58283cdf`  
Fallback source identity: `src-9a29bbb8ab5444f8122e5e9d`  
Qualification run: `37119509698` / SUCCESS  
Artifact: `11272193852`  
Artifact digest: `sha256:b8542ea421cab1b60ca2385c9bb9cbeb61064946f4c38163cf5ea8fe0377ce81`

## Reconcile status

This revision is based directly on the then-latest main and is currently:

```text
ahead_by = 17
behind_by = 0
merge_base = a6842e95a00ef440d47cc393394b9272d75f6082
```

The old divergent PWA branch was not merged wholesale.

## Gate 1 — publication-bound identity

**ACCEPTED / CLOSED ON EXACT CANDIDATE.**

The previous blocking condition is resolved.

The candidate adds a Pages/Jekyll publication identity source:

`pwa-pages-build-identity.txt`

which renders `site.github.build_revision` to:

`/product/source/pages-build-identity.txt`

The runtime resolves this deployed revision with `cache: 'no-store'`, derives:

`pages-<published revision SHA>`

and uses that identity for the runtime worker URL, worker diagnostics and build-scoped caches.

The source-fingerprint `src-*` identity remains a local/non-Pages fallback.

Qualification run `37119509698` built with `actions/jekyll-build-pages@v1` and verified the rendered revision equals the exact candidate SHA.

This removes the previous dependency on a developer remembering to update a manual build token.

## Migration / cache behavior

**ACCEPTED FOR INTEGRATION.**

The candidate retains one stable legacy migration URL and moves steady-state behavior to the publication-bound runtime worker.

Focused Chromium evidence confirms:

- old cache-first worker present before transition;
- ordinary reload uses `ignoreCache=false`;
- two independent profiles reach the candidate;
- app/worker identity agrees;
- stale INK-owned caches are removed;
- no mixed-build cache state;
- no reload loop;
- close/reopen PASS;
- offline fallback PASS.

The v4 migration change is also evidence-driven: it repairs the reproduced waiting-worker race instead of adding a speculative UI workaround.

## Gate 2 — actual GitHub Pages transition

**NOT CLOSED YET; ACCEPTED AS A MANDATORY POST-INTEGRATION RELEASE GATE.**

DEV correctly did not claim an impossible pre-merge candidate transition on the main-only Pages URL.

The actual deployed pre-integration state was captured from:

`https://thedoorw.github.io/INK-Browser-QA/product/source/`

with the old worker/cache intact, without Ctrl+F5, cache clearing or unregister. The browser profile was archived and restore-tested.

The candidate also includes:

`.github/workflows/ink-pwa-pages-postintegration.yml`

which is designed to run after the bounded PWA composition reaches main and to:

1. wait for exact Pages revision identity;
2. reuse the preserved old controlled browser profile;
3. execute normal open / normal F5;
4. execute close → reopen;
5. execute offline fallback;
6. verify app / worker / cache identity;
7. reject any Ctrl+F5 / cache-clear / unregister dependency.

This is the correct place to close the original user-visible defect because the actual candidate cannot exist at the main-only Pages URL before integration.

## Boundaries

Accepted evidence shows:

- `FORMAT_VERSION` unchanged;
- no C06 change;
- no C04 change;
- no New Document/A4 change;
- no History redesign;
- no unrelated UI mutation;
- no drawing/render capability mutation;
- no `thedoorw/INK` Live repo mutation.

## Promotion rule

Do not merge the historical `work/pwa-cache-freshness-001` branch.

Integrate only the accepted v3 bounded composition from:

`work/pwa-cache-freshness-supervisor-gates-003`

onto current main, preserving the exact accepted PWA product/workflow semantics.

Immediately after integration:

```text
GitHub Pages publish exact integrated main
→ ink-pwa-pages-postintegration workflow
→ actual URL normal open/F5
→ close/reopen
→ offline
→ identity/cache verification
```

If that post-integration gate fails, the PWA repair is **not closed** and must be rolled forward/repaired before claiming resolution.

## Disposition

```text
GATE_1_PUBLICATION_IDENTITY = ACCEPTED / CLOSED
LOCAL_REAL_BROWSER_MIGRATION = ACCEPTED
ACTUAL_PAGES_BASELINE_CAPTURE = ACCEPTED
CANDIDATE = ACCEPTED_FOR_BOUNDED_INTEGRATION
GATE_2_ACTUAL_PAGES_TRANSITION = PENDING / MANDATORY POST-INTEGRATION
WHOLESALE_OLD_BRANCH_MERGE = NO
MAIN_PRODUCT_MUTATION_BY_SUPERVISOR = NONE
FINAL_PWA_CLOSURE = NOT YET
NEXT = USER/AUTHORIZED INTEGRATION → AUTOMATIC ACTUAL PAGES GATE → SUPERVISOR CLOSURE
```
