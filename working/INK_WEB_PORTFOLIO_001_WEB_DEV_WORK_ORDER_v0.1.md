# INK Web Portfolio 001 — WEB DEV Work Order v0.1

## Authority

```text
OWNER = WR
PROGRAM = INK-WEB-PORTFOLIO-001
PHASE = C — First Website Reproduction
TASK = INK-WEB-PORTFOLIO-001-C1
REFERENCE = https://anthonyburrill.com/
INK_PRODUCT_CHANGE_REQUIRED = NO
MR_REVIEW_REQUIRED = NO
```

## Goal

Build the first bounded portfolio reproduction from observed public behavior of the Anthony Burrill portfolio shell.

This is a Web-portfolio-only task. Do not modify INK product source, Core, Connector authority, workstation UI, Document / History / Revision implementation or FORMAT_VERSION.

## Branch

Use:

```text
work/ink-web-portfolio-001
```

Until WR splits a dedicated implementation branch.

## Required sequence

### C1 — Capture and measurement

Record current reference behavior at minimum for:

```text
desktop = 1440 × 900
compact desktop / tablet = 1024 × 768
mobile = 390 × 844
```

Capture/measure:
- header / navigation geometry;
- page margins and max-width behavior;
- project-grid columns and gaps;
- typography scale / line-height / weights;
- image aspect-ratio behavior;
- project-detail text/media rhythm;
- footer;
- breakpoint changes;
- mobile navigation behavior;
- overflow / scrolling;
- hover/focus states that materially affect the UI.

Do not invent values when they can be measured.

### C2 — Structure and tokens

Produce:
- page map;
- component map;
- layout tokens;
- typography tokens;
- spacing tokens;
- breakpoint table;
- interaction notes.

### C3 — Independent implementation

Implement an original code reproduction under a dedicated Web portfolio directory.

If no existing Web portfolio root exists, use:

```text
portfolio/
```

Minimum routes/pages:

```text
/
archive/
profile/
case/sample-case/
```

Use license-safe placeholder / owned media. Do not commit third-party reference-site images merely to increase visual similarity.

### C4 — Visual and responsive QA

Compare reference and reproduction at the same target viewports.

Required checks:
- shell alignment;
- grid;
- typography hierarchy;
- spacing;
- image sizing/cropping;
- navigation;
- footer;
- responsive transformation;
- overflow;
- hover/focus;
- basic readable contrast.

Record deltas as measured issues, not subjective comments.

### C5 — WR handoff

Return:
- exact branch HEAD SHA;
- changed files;
- local/run instructions;
- reference measurements;
- screenshots/evidence paths;
- known deltas;
- third-party asset/license statement;
- candidate Pages deployment path.

## Explicit non-goals

- no ecommerce reproduction;
- no WordPress/backend cloning;
- no copied proprietary source code;
- no INK product mutation;
- no deployment until WR review passes the bounded reproduction.

## Gate

```text
WEB_DEV_HANDOFF
→ WR visual/source/responsive review
→ WR_PASS / WR_REVISE / WR_HOLD
```
