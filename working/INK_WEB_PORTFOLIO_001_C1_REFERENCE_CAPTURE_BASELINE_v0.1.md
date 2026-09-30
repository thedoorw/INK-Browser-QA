# INK Web Portfolio 001 — C1 Reference Capture Baseline v0.1

## Authority

```text
ROLE = WR
PROGRAM = INK-WEB-PORTFOLIO-001
TASK = INK-WEB-PORTFOLIO-001-C1
PHASE = C — First Website Reproduction / fast scaffold
REFERENCE = https://www.theminimalists.com/
BRANCH = work/ink-web-portfolio-001
INK_PRODUCT_CHANGE_REQUIRED = NO
STATUS = ACTIVE
```

This file supersedes the earlier Anthony Burrill C1 baseline for the first reproduction. Anthony Burrill remains a secondary reference only.

## Verified current public structure

Verified from the current public site on 2026-09-30.

### Shared shell

Observed primary navigation:
- Podcast
- Books
- Films
- Tour
- Resources

Observed recurring shell elements:
- site title/home link;
- short introductory text;
- newsletter/email form region;
- footer attribution/policy links.

Reference content and identity are not to be copied into the reproduction.

### Homepage / feed

Observed presentation behavior:
- article-led editorial feed;
- title + short excerpt;
- MORE + detail link;
- continuing list rhythm;
- Next Page pagination;
- View More / archive route.

The current public pagination reaches a second page at /page/2/, confirming a conventional paginated feed surface.

### Start / guide page

Reference:
https://www.theminimalists.com/start/

Observed structure:
- page title;
- introductory image/text;
- long-form guide copy;
- repeated topical subheadings;
- dense internal-link lists;
- shared footer.

### Resources page

Reference:
https://www.theminimalists.com/resources/

Observed structure:
- page heading;
- repeated resource entries;
- image + small category label + title + description;
- repeated email form blocks;
- shared footer.

For the reproduction, email forms are presentation placeholders only.

### Archive

Reference:
https://www.theminimalists.com/archives/

Use as the archive/index grammar reference. Reproduce the navigation/index concept, not the reference content.

## Required viewport set

```text
DESKTOP = 1440 × 900
COMPACT_DESKTOP_TABLET = 1024 × 768
MOBILE = 390 × 844
```

## Fast-path measurement rule

Exact measurement is performed after the first scaffold exists.

```text
FIRST SCAFFOLD
→ SAME-VIEWPORT COMPARISON
→ MEASURE ONLY VISIBLE DELTAS
→ CORRECT
```

Do not delay implementation to fill a complete theoretical measurement table.

Still prohibited:
```text
UNMEASURED CLAIM
→ DO NOT PRESENT AS EXACT
```

## C1 handoff expectation

The first meaningful handoff should contain:
- a working shell in the repo;
- homepage feed;
- one detail page;
- Start-style page;
- Resources-style page;
- Archives-style page;
- responsive behavior;
- screenshots at the required viewports;
- a short delta list;
- exact branch HEAD SHA.
