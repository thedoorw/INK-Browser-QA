# INK Web Portfolio 001 — C1 Reference Capture Baseline v0.1

## Authority

```text
ROLE = WR
PROGRAM = INK-WEB-PORTFOLIO-001
TASK = INK-WEB-PORTFOLIO-001-C1
PHASE = C — First Website Reproduction / capture & measurement
REFERENCE = https://anthonyburrill.com/
BRANCH = work/ink-web-portfolio-001
INK_PRODUCT_CHANGE_REQUIRED = NO
STATUS = ACTIVE
```

This file records only reference facts that have been verified from the current public site or the current GitHub SSOT. Exact geometry must remain unfilled until it is measured in a rendered browser at the required viewport.

## Required viewport set

```text
DESKTOP = 1440 × 900
COMPACT_DESKTOP_TABLET = 1024 × 768
MOBILE = 390 × 844
```

For each viewport capture:

- full-page screenshot;
- header/navigation bounding boxes;
- content left/right margins;
- project-grid columns and gaps;
- representative card/media width and aspect behavior;
- typography size / line-height / weight;
- section vertical spacing;
- footer geometry;
- overflow behavior;
- visible hover/focus states where material;
- mobile navigation state and transformation.

## Current live-reference facts

Verified 2026-09-29 against the public reference URLs.

### Global shell

Observed primary navigation labels:

```text
Showcase
Shop
Archive
Profile
```

Observed persistent shell/footer content includes:

```text
Instagram
Contact
a@anthonyburrill.com
© Anthony Burrill 2026
Privacy Policy
Refund & Returns Policy
Design by Sam Harrison
Build by Cliff Studio
```

The first reproduction remains portfolio-shell-only. Shop/cart/checkout/payment behavior is excluded by the current Work Order.

### Showcase index

The current homepage exposes a project-led Showcase index. The machine-readable public surface currently exposes 18 Showcase entries.

Representative entries include:

```text
Ampersand Chair
The Granary Studio and Garden
Friends Friends Friends
Question and Answer
Hope
Hold on to Hope
Joy in Life
You Have The Answer
...
```

The current text crawl does not provide trustworthy layout geometry, image dimensions, column count, crop behavior or breakpoint transforms. Those remain browser-measurement fields.

### Archive index

The current Archive page exposes 10 archive entries in the public machine-readable surface.

The index uses the same primary shell/navigation labels as the main site. Exact grid/list geometry remains pending rendered-browser measurement.

### Profile

The current Profile page contains long-form profile copy and a photography credit within the shared shell.

The public text representation exposes repeated Profile headings/content fragments. Do not infer actual visual duplication or responsive visibility from text extraction alone; verify in rendered-browser capture.

### Representative project detail

Reference:

```text
https://anthonyburrill.com/showcase/ampersand_chair/
```

Observed content structure:

```text
Title
→ project title
Overview
→ multi-paragraph descriptive copy
→ credit line
→ following project content / continuation
→ global footer
```

The public text surface also exposes Newsletter fields in the lower project-detail region.

Exact media sequencing, media aspect ratios, text/media column geometry, project-to-project transition behavior and breakpoint transformation remain pending rendered-browser capture.

## C1 measurement table

| Measurement | 1440×900 | 1024×768 | 390×844 | Status |
|---|---:|---:|---:|---|
| Header height | — | — | — | PENDING_BROWSER_CAPTURE |
| Left/right page margin | — | — | — | PENDING_BROWSER_CAPTURE |
| Content max width | — | — | — | PENDING_BROWSER_CAPTURE |
| Nav item gap | — | — | — | PENDING_BROWSER_CAPTURE |
| Showcase columns | — | — | — | PENDING_BROWSER_CAPTURE |
| Showcase column gap | — | — | — | PENDING_BROWSER_CAPTURE |
| Showcase row gap | — | — | — | PENDING_BROWSER_CAPTURE |
| Card media ratio/crop | — | — | — | PENDING_BROWSER_CAPTURE |
| Primary display type size | — | — | — | PENDING_BROWSER_CAPTURE |
| Body type size | — | — | — | PENDING_BROWSER_CAPTURE |
| Body line-height | — | — | — | PENDING_BROWSER_CAPTURE |
| Detail text width | — | — | — | PENDING_BROWSER_CAPTURE |
| Detail media width | — | — | — | PENDING_BROWSER_CAPTURE |
| Footer top spacing | — | — | — | PENDING_BROWSER_CAPTURE |
| Mobile nav transformation | — | — | — | PENDING_BROWSER_CAPTURE |
| Horizontal overflow | — | — | — | PENDING_BROWSER_CAPTURE |

## Measurement rule

```text
NO_RENDERED_MEASUREMENT
→ DO NOT GUESS
→ KEEP FIELD PENDING
```

Values derived only from a crawler, search result, textual extraction or memory are not accepted as pixel geometry.

## C1 handoff expectation

WEB DEV should complete the table from rendered captures at the exact required viewports and return:

- screenshot/evidence paths;
- measured values;
- any viewport-specific structural changes;
- any interaction state that materially changes the UI;
- exact branch HEAD SHA.

After that evidence exists:

```text
C1_CAPTURE_AND_MEASURE
→ WR review
→ C2 structure / tokens
```
