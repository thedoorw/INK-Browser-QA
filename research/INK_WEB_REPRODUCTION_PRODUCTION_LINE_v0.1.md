# INK Web Reproduction Production Line v0.1

## Status

```text
ROLE = WR — Web Review
PROGRAM = INK-WEB-REPRODUCTION-PRODUCTION-LINE-001
CASE_001 = THE-MINIMALISTS
REFERENCE = https://www.theminimalists.com/
TARGET = HIGH-AUTOMATION WEBSITE-SYSTEM REPRODUCTION
DEPLOY_TARGET = GitHub Pages
INK_PRODUCT_CHANGE_REQUIRED = NO
```

## 1. Goal

Build a reusable production line that can recover the public browser-visible system of a mature website, reconstruct that system with independent code and neutral/owned content, verify it against the reference, and deploy a static reproduction to GitHub Pages.

The target is the website's presentation and interaction system:

```text
external appearance
+ structure
+ page families
+ navigation
+ responsive behavior
+ layout / typography / spacing rules
+ component relationships
+ visible interaction behavior
```

The target is not:

```text
copyrighted editorial content
proprietary media
private source code
private backend behavior
accounts / commerce / payment
analytics / tracking identity
```

## 2. Core principle

Do not begin with screenshot-to-code guessing.

Use an evidence-first pipeline:

```text
URL
→ Site Census
→ Page-Family Detection
→ Representative Browser Capture
→ Geometry / Computed-Style Measurement
→ Structural Blueprint
→ Tokens / Components / Templates
→ Independent Static Reconstruction
→ Visual Diff
→ Responsive / Interaction QA
→ Correction Loop
→ GitHub Pages
→ Lessons / Pattern Library
```

Each stage produces machine-readable evidence consumed by the next stage.

## 3. Current 2026 tool baseline

Use stable public tooling rather than model memory as the measurement authority.

```text
Crawlee 3.18.x
  → recursive same-origin crawling
  → request queue / depth / rate controls
  → robots.txt support
  → browser-backed crawling when needed

Playwright 1.63.x
  → Chromium browser automation
  → deterministic viewport capture
  → screenshots
  → DOM evaluation
  → interaction-state execution
  → visual regression support

Chrome DevTools Protocol
  → DOM / CSS inspection
  → computed style and font information
  → deeper box/style evidence when Playwright DOM evaluation is insufficient

Astro 7.3.x
  → default static reconstruction target for content-heavy sites
  → component/page templates
  → static prerender
  → GitHub Pages-compatible output

GitHub Actions + GitHub Pages
  → repeatable build
  → artifact identity
  → deploy
  → deployed-site verification
```

Versions are pinned per executable package/workflow. Future upgrades require an explicit dependency update rather than silent drift.

## 4. Production stages

### R0 — Scope / policy

Input:
- public root URL;
- allowed origin(s);
- excluded path families;
- reference-capture policy;
- target deploy mode.

Rules:
- public pages only;
- no login bypass;
- no form submission except explicit harmless interaction testing;
- no purchase/cart/payment execution;
- respect robots.txt;
- rate-limit same-domain requests;
- third-party reference screenshots are transient QA evidence, not deployed portfolio content.

Output:

`case-config.json`

### R1 — Site Census

Purpose: recover the entire public route surface before rebuilding individual pages.

Collect:
- URL / canonical path;
- status;
- title metadata;
- internal link graph;
- semantic-landmark sequence;
- heading-level pattern;
- form count and method;
- image/layout counts and dimensions, not image bytes;
- DOM structural signature;
- selected class/body markers;
- route depth.

Do not retain full article text.

Outputs:

```text
site-census.json
route-graph.json
crawl-failures.json
```

Gate:

`R1_CENSUS_COMPLETE`

### R2 — Page-Family Detection

Cluster routes by browser-visible structure rather than URL name alone.

Examples:

```text
HOME_FEED
ARTICLE
ARCHIVE_INDEX
PODCAST_INDEX
PODCAST_EPISODE
BOOK_INDEX
BOOK_DETAIL
RESOURCE_INDEX
GENERAL_CONTENT
```

The deterministic classifier supplies clusters; WR/CHAT may assign human-readable family names.

Outputs:

```text
page-families.json
representative-routes.json
```

Gate:

`R2_FAMILIES_STABLE`

### R3 — Capture / Measurement

For each representative family, capture at minimum:

```text
1440 × 900
1024 × 768
390 × 844
```

Collect:
- full-page screenshot;
- viewport screenshot when useful;
- element bounding boxes;
- header/nav/main/footer geometry;
- typography computed values;
- content widths;
- spacing;
- grid columns/gaps;
- media dimensions / aspect behavior;
- overflow;
- sticky/fixed behavior;
- relevant hover/focus/open states;
- mobile navigation transformation.

Reference screenshots are transient CI artifacts unless separately approved for retention.

Outputs:

```text
capture-manifest.json
measurements/*.json
reference-screenshots/*   [artifact only]
```

Gate:

`R3_REFERENCE_MEASURED`

### R4 — Structural Blueprint

Transform evidence into a neutral intermediate representation.

Outputs:

```text
site-map.json
layout-tokens.json
typography-tokens.json
spacing-tokens.json
breakpoints.json
component-map.json
template-map.json
interaction-rules.json
```

Every value must be marked as:

```text
OBSERVED
MEASURED
INFERRED
```

Measured evidence outranks inference.

Gate:

`R4_BLUEPRINT_COMPLETE`

### R5 — Independent Reconstruction

Default target for CASE-001:

`Astro static output`

Build:
- shared shell;
- navigation;
- page templates;
- component library;
- neutral placeholder content matching density and rhythm;
- responsive transformations.

Do not copy reference source code or protected media.

Gate:

`R5_BUILDABLE_STATIC_SITE`

### R6 — Visual-Diff Correction Loop

At identical viewport/environment:

```text
reference screenshot
vs
reproduction screenshot
→ pixel / region diff
→ classify delta
→ bounded CSS/layout/component correction
→ rerun
```

Delta classes:

```text
SHELL_GEOMETRY
TYPOGRAPHY
SPACING
GRID
MEDIA_RATIO
RESPONSIVE_TRANSFORM
INTERACTION_STATE
OVERFLOW
CONTENT_DENSITY_PLACEHOLDER
```

Do not accept "looks close" as evidence.

Gate:

`R6_VISUAL_DIFF_WITHIN_THRESHOLD`

Thresholds are defined per case after the first measured baseline; no fabricated tolerance.

### R7 — Responsive / Interaction QA

Verify:
- required viewports;
- navigation;
- keyboard/focus basics;
- links;
- responsive reflow;
- overflow;
- sticky/fixed elements;
- representative interactions;
- no unexpected external calls from the reconstructed site.

Gate:

`R7_WR_PASS`

### R8 — GitHub Pages deployment

Identity chain:

```text
source commit SHA
→ build artifact
→ Pages deployment
→ deployed URL
→ browser verification
```

GitHub Pages hosts only the independently reconstructed static site.

Gate:

`R8_DEPLOYED_VERIFIED`

### R9 — Production learning

Every completed case must update:
- Web Reference Library;
- Web Pattern / Component Library;
- Web Development Lessons;
- production-line failure/gap register.

The goal is for CASE-002 to require less human interpretation than CASE-001.

## 5. Automation model

Target end state:

```text
USER supplies reference URL
→ RUN production line
→ machine census
→ page-family proposal
→ representative capture
→ blueprint
→ generated static site
→ diff/correction loop
→ WR gate
→ Pages deployment
```

Expected automatic:
- crawl;
- route graph;
- structural signatures;
- representative candidate selection;
- screenshots;
- measurements;
- first token extraction;
- first component/template proposal;
- build;
- visual diff;
- deployment.

Expected Review/AI judgment:
- ambiguous family merge/split;
- whether a visual difference is semantically important;
- interaction equivalence;
- final WR acceptance;
- what reusable design grammar is retained.

USER remains direction and final acceptance, not a transport layer between production stages.

## 6. Evidence policy

The production line must separate:

```text
REFERENCE EVIDENCE
from
RECONSTRUCTED SOURCE
from
DEPLOYED CONTENT
```

Reference evidence may contain transient screenshots for comparison.

Reconstructed source must use original code.

Deployed content must use neutral, owned, generated, or otherwise license-safe content.

## 7. CASE-001 purpose

The Minimalists is CASE-001 because it provides:
- a real content-rich website;
- repeated article templates;
- index/archive structures;
- multiple top-level content families;
- pagination/navigation;
- responsive behavior;
- enough complexity to validate the production line without requiring application-style authenticated behavior.

CASE-001 is not considered complete merely when one homepage is visually similar.

It is complete only when:

```text
public route system is inventoried
→ page families are recovered
→ representative families are reconstructed
→ shared shell and navigation are reproduced
→ responsive behavior is verified
→ neutral-content static site is deployed
→ workflow can be rerun from repository state
```

## 8. First executable slice

Implement in this order:

```text
WRPL-001-A = Site Census engine
WRPL-001-B = deterministic page-family classifier
WRPL-001-C = multi-viewport capture/measurement engine
WRPL-001-D = blueprint schema/extractor
WRPL-001-E = Astro reconstruction generator
WRPL-001-F = visual-diff/correction loop
WRPL-001-G = Pages deployment
```

Do not jump to E before A–D produce usable evidence.
