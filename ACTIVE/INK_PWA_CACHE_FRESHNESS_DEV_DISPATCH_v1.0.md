# INK PWA / Cache Freshness — DEV Dispatch v1.0

STATUS: ACTIVE
REPO: thedoorw/INK-Browser-QA
BASE: latest main at execution time
PREPARED_FROM_MAIN: `46fd2d6b27515b5537b2c8d6655df4b257ee6b45`

## Problem

On the deployed INK-Browser-QA source page, a normal open / reload can repeatedly show an older UI. The current UI appears only after `Ctrl+F5`.

Current source findings:
- `product/source/service-worker.js` still uses a manually fixed `BUILD_ID`;
- navigation is cache-first: cached `index.html` is returned before network;
- the current `staleWhileRevalidate()` returns immediately when cache exists, so no background revalidation occurs on that path;
- Service Worker update activation is user-mediated rather than guaranteeing a normal-reload freshness path.

This makes visual/product verification unreliable because the browser may be showing stale product bytes.

## Task

Create fresh branch:

`work/pwa-cache-freshness-001`

Repair deployment/cache freshness so the **INK-Browser-QA deployed source page updates through an ordinary open / F5 without requiring Ctrl+F5**.

## Required behavior

For the QA/development deployment:

1. normal navigation must prefer the latest deployed build when online;
2. cached shell remains an offline fallback, not the first authority for an online QA reload;
3. JS/CSS/module freshness must not leave the page on old product bytes indefinitely;
4. Service Worker deployment identity must advance deterministically with published source identity — do not rely on a manually stale build token;
5. a newly installed worker must have a bounded automatic activation/reload path so users do not need a hidden manual update step;
6. preserve atomic build consistency — do not serve new HTML with an incompatible arbitrary mix of old modules;
7. keep offline fallback functional.

## Acceptance

Demonstrate in a real browser against deployed QA/source behavior:

- start from a browser already controlled by the previous worker/cache;
- publish/use the candidate build;
- ordinary page open or F5 reaches the candidate without Ctrl+F5;
- close tab → reopen URL also reaches the candidate;
- no manual DevTools cache clear/unregister;
- online latest-build identity is verifiable;
- offline fallback still loads a coherent cached build;
- no infinite reload/controllerchange loop;
- no mixed-build HTML/module state;
- old INK-owned caches are bounded/cleaned after activation.

Record exact worker/build/cache identities in evidence.

## Boundaries

Do not modify:
- C06 12800% zoom;
- C04 圖紙 / 手繪板;
- New Document / A4;
- History;
- unrelated UI fidelity;
- Core drawing/render behavior;
- FORMAT_VERSION;
- separate `thedoorw/INK` Live repo.

Do not solve this by:
- disabling Service Worker entirely;
- clearing all browser storage on every load;
- requiring Ctrl+F5;
- adding a user-facing manual refresh ritual;
- appending arbitrary cache-busting query strings everywhere without a coherent build identity.

## Return

Return:
- branch;
- exact candidate SHA;
- changed files;
- old/new Service Worker strategy;
- build identity mechanism;
- browser evidence for ordinary reload / reopen / offline fallback;
- cache inventory before/after;
- regression result;
- technical-debt delta.

Then STOP → Supervisor review. Do not merge.
