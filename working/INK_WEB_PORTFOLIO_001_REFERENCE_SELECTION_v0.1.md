# INK Web Portfolio 001 — Reference Selection v0.1

## Decision

```text
PROGRAM = INK-WEB-PORTFOLIO-001
PHASE = B — Reference Selection
OWNER = WR
STATUS = SELECTED
PRIMARY_REFERENCE = The Minimalists
REFERENCE_URL = https://www.theminimalists.com/
REPRODUCTION_SCOPE = INFORMATION ARCHITECTURE + LAYOUT GRAMMAR + INTERACTION PATTERNS
CONTENT_COPY = PROHIBITED
INK_PRODUCT_CHANGE_REQUIRED = NO
```

## Selected target

The first reproduction target is the current public presentation system of The Minimalists.

Primary public evidence:
- https://www.theminimalists.com/
- https://www.theminimalists.com/start/
- https://www.theminimalists.com/resources/
- https://www.theminimalists.com/archives/


## Why this target

It directly matches the intended first portfolio direction:

- non-full-width editorial reading experience;
- continuously extensible article/feed structure that never looks unfinished;
- strong text hierarchy with restrained imagery;
- index/feed → detail-page reading pattern;
- pagination/archive structures suitable for a growing portfolio;
- resource/index pages that can later become portfolio categories;
- bounded interaction surface suitable for a static GitHub Pages implementation.

## First-reproduction scope

Include:
- global shell / header / navigation;
- narrow editorial content column;
- homepage feed/list rhythm;
- MORE-style detail navigation;
- article/project detail template;
- pagination / archive navigation;
- Start/guide-style long-form index pattern;
- Resources-style repeated card/list pattern;
- footer;
- desktop / tablet / mobile responsive behavior;
- material hover/focus/navigation interactions.

Exclude:
- reference text, images, logos and brand identity assets;
- email/newsletter backend;
- commerce, membership, analytics or private services;
- copied proprietary source code.

## Fast-path reproduction method

```text
LIVE URL
→ AI URL/screenshot reconstruction for first scaffold
→ immediately replace reference content/assets with neutral placeholders
→ GitHub-controlled implementation
→ WR visual/interaction correction
→ responsive QA
→ GitHub Pages
```

Primary accelerator candidate:
- Replit Design / Agent: live URL import or screenshot recreation, then Git/GitHub workflow.

Secondary evaluation-only fallback:
- 10Web Clone Agent can rapidly generate a page-level editable clone, but its current output is WordPress-oriented and should not become the production architecture for this program.

Manual research is no longer a prerequisite for implementation. Research is only used to resolve a visible mismatch or unknown interaction encountered during reproduction.

## Acceptance direction

The first pass is judged by whether it recovers and reproduces:
- shell geometry;
- editorial content width;
- typography hierarchy;
- feed/list rhythm;
- detail-page reading flow;
- pagination/archive behavior;
- responsive transformations;
- interaction behavior that materially affects navigation or reading.

Exact reference content is not part of acceptance.

## Next

Execute Phase C using the fast-path Work Order.
