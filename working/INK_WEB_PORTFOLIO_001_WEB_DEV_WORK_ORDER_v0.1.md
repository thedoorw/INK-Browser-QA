# INK Web Portfolio 001 — WEB DEV Work Order v0.1

## Authority

```text
OWNER = WR
PROGRAM = INK-WEB-PORTFOLIO-001
PHASE = C — First Website Reproduction
TASK = INK-WEB-PORTFOLIO-001-C1
REFERENCE = https://www.theminimalists.com/
REFERENCE_CLASS = EDITORIAL / BOOK-LIKE PORTFOLIO SHELL
INK_PRODUCT_CHANGE_REQUIRED = NO
MR_REVIEW_REQUIRED = NO
```

## Goal

Reproduce the presentation system and reading behavior of The Minimalists as the first bounded Web reproduction.

The objective is not to reproduce its copyrighted content or backend. The objective is to recover its non-full-width editorial shell, visual rhythm, sequential reading pattern and responsive behavior, then implement those principles as a portfolio-ready static site.

This is Web-portfolio-only work. Do not modify INK product source, Core, Connector authority, workstation UI, Document / History / Revision implementation or FORMAT_VERSION.

## Required sequence

### C1 — Capture and measurement

Record current reference behavior at minimum for:

```text
desktop = 1440 × 900
compact desktop / tablet = 1024 × 768
mobile = 390 × 844
```

Capture/measure:
- total content width;
- reading-column width;
- left/right whitespace;
- header / navigation geometry;
- identity/intro block;
- heading, body and metadata typography;
- paragraph measure and line-height;
- vertical spacing rhythm;
- homepage entry spacing;
- title / excerpt / MORE relationship;
- image sizing and placement on detail pages;
- previous / next behavior;
- pagination/archive continuation;
- secondary index layout;
- footer;
- breakpoint changes;
- mobile navigation behavior;
- overflow / scrolling;
- hover/focus states that materially affect the experience.

Do not invent values when they can be measured.

### C2 — Structure and tokens

Produce:
- page map;
- component map;
- content model;
- layout tokens;
- reading-width tokens;
- typography tokens;
- spacing/rhythm tokens;
- breakpoint table;
- interaction notes.

### C3 — Independent implementation

Implement an original static reproduction under:

```text
portfolio/
```

Minimum presentation routes/pages:

```text
/
entry/sample-entry/
archive/
index/
about/
```

Use license-safe placeholder or repository-owned media.

The shell must support future content types without structural redesign:

```text
WORK
PROCESS
NOTE
RESEARCH
CASE STUDY
```

### C4 — Visual and responsive QA

Compare reference and reproduction at identical target viewports.

Required checks:
- outer page proportion;
- reading-column width;
- typography hierarchy;
- paragraph measure;
- vertical rhythm;
- entry spacing;
- image sizing;
- navigation;
- previous / next flow;
- pagination/archive flow;
- footer;
- responsive transformation;
- overflow;
- hover/focus;
- basic readable contrast.

Record deltas as measured issues.

### C5 — WR handoff

Return:
- exact branch HEAD SHA;
- changed files;
- local/run instructions;
- reference measurements;
- screenshots/evidence paths;
- known deltas;
- third-party asset/license statement;
- candidate GitHub Pages path.

## Explicit non-goals

- no copyrighted content copying;
- no WordPress/backend cloning;
- no newsletter backend;
- no ecommerce;
- no INK product mutation;
- no deployment until WR review passes the bounded reproduction.

## Gate

```text
WEB_DEV_HANDOFF
→ WR visual/source/responsive review
→ WR_PASS / WR_REVISE / WR_HOLD
```
