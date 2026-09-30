# WRPL-001 / CASE-001 — The Minimalists Work Order v0.1

## Authority

```text
OWNER = WR
PROGRAM = INK-WEB-REPRODUCTION-PRODUCTION-LINE-001
CASE = CASE-001 / THE-MINIMALISTS
REFERENCE = https://www.theminimalists.com/
BRANCH = work/web-reproduction-production-line-001
INK_PRODUCT_CHANGE_REQUIRED = NO
MR_REVIEW_REQUIRED = NO
```

## Objective

Use The Minimalists as the first full validation case for the Web Reproduction Production Line.

The target is to recover and independently rebuild the public browser-visible website system, not its editorial content.

## Scope

Include:
- global shell;
- primary navigation;
- homepage/feed behavior;
- article template;
- archives/index structures;
- Podcast family;
- Books family;
- Films/Tour/Resources/general-content families as discovered;
- pagination;
- newsletter/form presentation structure without submission;
- footer;
- desktop/tablet/mobile responsive behavior;
- visible interaction states required for structural equivalence.

Exclude:
- copyrighted editorial copy as deployed content;
- original photos/covers/media as deployed assets;
- proprietary source code;
- WordPress/PHP/backend cloning;
- analytics;
- account/login behavior;
- purchasing/payment;
- third-party tracking reproduction.

## Current observed public surface

Initial public checks on 2026-09-30 confirm:
- primary navigation: Podcast / Books / Films / Tour / Resources;
- homepage has repeated content/feed entries and pagination;
- Archives is a large index/search surface;
- Start Here is a separate long-form content page;
- the site exposes multiple repeated content families suitable for structural clustering.

These observations are discovery hints only. Machine census is the authority for CASE-001 route inventory.

## Execution sequence

### WRPL-001-A — Site Census

Run the crawler against the public root.

Requirements:
- same-origin only;
- robots.txt respected;
- no login bypass;
- no form submission;
- same-domain delay >= 1 second;
- concurrency <= 2 for CASE-001 initial run;
- do not save article bodies or image bytes;
- normalize query/hash variants;
- record crawl failures.

Initial validation cap:
- 150 rendered requests.

This cap validates the engine; it is not the definition of "whole site."
After validation, route discovery must expand using discovered links/sitemaps until the public route inventory stabilizes.

Output:
- `site-census.json`.

Acceptance:
- records are deterministic enough to rerun;
- no off-origin crawl;
- structural signatures exist;
- public route families can be proposed.

### WRPL-001-B — Page-Family Classifier

Input:
- `site-census.json`.

Output:
- deterministic groups by structural signature;
- route-prefix summary;
- representative candidates.

Do not treat exact signature hashes as final design semantics. WR may merge/split families where repeated content differences produce false clusters.

### WRPL-001-C — Capture / Measurement

Required initial representative routes:

```text
/
 /archives/
 /start/
 /podcast/
 /books/
 /resources/
 + one article route discovered by census
```

If any route differs from the current live site, replace it with the census-confirmed canonical route.

Viewports:

```text
1440 × 900
1024 × 768
390 × 844
```

Capture:
- transient screenshots;
- semantic element boxes;
- computed typography/style samples;
- document dimensions;
- overflow;
- fixed/sticky candidates;
- media geometry.

Reference screenshots must remain CI/local artifacts, not deployed content.

## First gate

```text
WRPL-001-A/B/C executable
→ CASE-001 census artifact exists
→ page-family proposal exists
→ representative capture manifest exists
→ WR review
```

Do not begin final website reconstruction before this gate.

## Next task after gate

`WRPL-001-D — Blueprint schema/extractor`
