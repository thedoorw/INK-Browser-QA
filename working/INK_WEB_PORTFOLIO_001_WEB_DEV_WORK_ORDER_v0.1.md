# INK Web Portfolio 001 — WEB DEV Work Order v0.1

## Authority

```text
OWNER = WR
PROGRAM = INK-WEB-PORTFOLIO-001
PHASE = C — First Website Reproduction
TASK = INK-WEB-PORTFOLIO-001-C1
REFERENCE = https://www.theminimalists.com/
METHOD = FAST_PATH_AI_ASSISTED_REPRODUCTION
INK_PRODUCT_CHANGE_REQUIRED = NO
MR_REVIEW_REQUIRED = NO
```

## Goal

Create the first working portfolio shell by reproducing the information architecture, layout grammar and material interaction patterns of The Minimalists without copying its text, images, logo, identity or proprietary source.

This is a Web-portfolio-only task. Do not modify INK product source, Core, Connector authority, workstation UI, Document / History / Revision implementation or FORMAT_VERSION.

## Branch

Use:

```text
work/ink-web-portfolio-001
```

## Operating rule

Do not block implementation on exhaustive research.

```text
BUILD FIRST
→ COMPARE
→ FIX VISIBLE DELTAS
→ DOCUMENT ONLY WHAT WAS NEEDED
```

Unknown pixel values must not be invented, but exact pre-measurement is no longer a gate before the first scaffold exists.

## Required sequence

### C1 — AI-assisted first scaffold

Preferred route:
1. use a live-URL or screenshot-to-site reconstruction tool for the initial shell;
2. Replit Design / Agent is the primary candidate because it supports URL import/recreation and Git/GitHub development flow;
3. immediately replace all reference-site content and protected assets with neutral/owned placeholders;
4. commit the resulting independent implementation to the Web work branch.

If an external reconstruction service cannot produce usable code, build the same bounded shell directly from observed public behavior. Do not stop for a broad research phase.

### C2 — Minimum structure

Minimum reproduction surfaces:

```text
/                     editorial feed / latest work
/start/                guide / start-here style index
/resources/            repeatable resource/category list
/archives/             archive/index
/case/sample-case/     article/project detail template
```

Required shared structures:
- global header/navigation;
- narrow reading column;
- article/project feed;
- MORE/detail navigation;
- pagination/archive navigation;
- footer;
- responsive shell.

### C3 — Interaction parity

Verify only interactions that materially affect the presentation model:
- navigation;
- feed item → detail page;
- next-page pagination;
- archive/index links;
- hover/focus states;
- mobile navigation behavior;
- overflow/scroll behavior.

Newsletter forms may be visual placeholders only.

### C4 — Visual and responsive QA

Compare the reference and reproduction at:

```text
desktop = 1440 × 900
compact desktop / tablet = 1024 × 768
mobile = 390 × 844
```

Check:
- content width;
- margins;
- header/nav placement;
- typography hierarchy;
- article spacing/rhythm;
- list/card spacing;
- pagination;
- footer;
- responsive transformation;
- overflow;
- material interaction states.

Record visible/measurable deltas only. Avoid theoretical analysis unless it resolves a concrete mismatch.

### C5 — WR handoff

Return:
- exact branch HEAD SHA;
- changed files;
- local/run instructions;
- screenshot/evidence paths;
- known deltas;
- third-party asset/license statement;
- candidate Pages deployment path.

## Explicit non-goals

- no copying The Minimalists content, images, logo or identity;
- no newsletter/backend cloning;
- no WordPress dependency in the production implementation;
- no copied proprietary source code;
- no INK product mutation;
- no long pre-implementation research report;
- no deployment until WR review passes the bounded reproduction.

## Gate

```text
FIRST_SCAFFOLD
→ WR visual/source/responsive review
→ WR_REVISE as needed
→ WR_PASS
→ GitHub Pages
```
