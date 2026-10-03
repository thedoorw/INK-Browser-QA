# INK PWA / Cache Freshness — Integration + Live Gate Dispatch v1.0

STATUS: ACTIVE / BOUNDED INTEGRATION
REPO: thedoorw/INK-Browser-QA
BASE: latest main at execution time
PREPARED_FROM_MAIN: `afd49a214c1d042902672185ac66b69c35c33b9d`

## Accepted source

Supervisor-accepted v3 branch:
`work/pwa-cache-freshness-supervisor-gates-003`

Exact accepted candidate:
`0ccfd4a729f16ff755921f5881fa0090e2745581`

Supervisor review:
`working/INK_PWA_CACHE_FRESHNESS_SUPERVISOR_REVIEW_20261003_v2.md`

## Task

Create a fresh integration branch from **latest main**.

Integrate only the accepted bounded PWA/cache-freshness composition from the v3 candidate. Do not merge the historical divergent PWA branch wholesale and do not reopen architecture design.

Preserve current main changes and current Supervisor/Work Order documents.

## Required integration scope

Only the accepted PWA publication/cache-freshness delta:

- publication-bound GitHub Pages build identity;
- generated/local fallback build identity;
- legacy Service Worker migration bridge;
- publication-bound runtime Service Worker;
- update-manager identity/activation behavior;
- required HTML/config wiring;
- PWA qualification/live-gate workflows and QA harnesses.

No unrelated product changes.

## Required sequence

1. Start from latest main and record exact SHA.
2. Reconcile the accepted v3 bounded delta.
3. Run the focused source/syntax/PWA regression suite.
4. Produce exact integration candidate SHA.
5. Integrate to main only after the bounded candidate is verified.
6. Wait until GitHub Pages publishes the exact integrated main revision.
7. Let `.github/workflows/ink-pwa-pages-postintegration.yml` run the real deployed gate using the preserved old browser profile.
8. Verify on:
   `https://thedoorw.github.io/INK-Browser-QA/product/source/`

Mandatory live checks:
- ordinary open;
- ordinary F5 / `ignoreCache=false`;
- close → reopen;
- offline fallback;
- app / worker / cache identity agreement;
- old INK caches cleaned;
- no mixed-build state;
- no reload loop;
- no Ctrl+F5;
- no DevTools cache clear / Disable cache;
- no Service Worker unregister.

## Boundaries

Do not modify:
- C06 zoom;
- C04 圖紙 / 手繪板;
- New Document / A4;
- History;
- unrelated UI fidelity;
- drawing/render capability;
- FORMAT_VERSION;
- `thedoorw/INK` Live repo.

Do not redesign the PWA architecture unless the actual post-integration Live Gate fails with reproducible evidence.

## Closure rule

PASS only when the actual GitHub Pages post-integration gate passes at the exact integrated main SHA.

If the live gate fails:
- record exact failure evidence;
- STOP;
- return to Supervisor;
- do not claim closure.

If it passes:
- record exact integrated main SHA, deployed Pages identity, workflow run/artifact, and closure evidence;
- mark PWA / Cache Freshness CLOSED.

