# INK Web Portfolio Reference Library v0.1

## Status

```text
PROGRAM = INK-WEB-PORTFOLIO-001
PHASE = A — Portfolio Landscape Research
OWNER = WR
DATE = 2026-09-29
STATUS = INITIAL_PASS_COMPLETE
```

This is the first bounded reference pass for the Web Portfolio lane. It records mature public portfolio / design-studio sites that are useful as reproducible website systems, not only as visual inspiration.

## Evaluation dimensions

```text
IA clarity
portfolio/case-study fit
grid / typography usefulness
responsive-learning value
interaction / motion complexity
public evidence quality
technical reproducibility
future fit for INK Creative Reproduction cases
```

## Initial reference set

### WEB-REF-001 — Anthony Burrill

Source:
- https://anthonyburrill.com/
- https://anthonyburrill.com/archive/
- https://anthonyburrill.com/profile/

Observed current IA:
- Showcase
- Shop
- Archive
- Profile
- individual showcase pages with Title / Overview / credits
- persistent contact / social / footer information

Why useful:
- clear portfolio-first information architecture;
- strong typographic identity with simple navigation;
- direct mapping from project index → project detail;
- Archive and Profile structures are reusable for a future INK portfolio;
- bounded enough for a first reproduction without requiring a complex application backend.

Boundary:
- Shop / checkout / payment behavior is not required for the first reproduction.

Reproduction risk:
- exact visual measurements and responsive behavior still require browser capture before implementation.

### WEB-REF-002 — Order

Source:
- https://order.design/

Observed current IA:
- Work
- Contact
- Index
- OTF
- extensive project listing with project-type taxonomy such as Identity / Motion / Guidelines / Website / Packaging / Illustration.

Why useful:
- strong example of a dense design archive;
- taxonomy is highly relevant to future INK case browsing;
- useful reference for an index-heavy portfolio and content classification.

Reproduction risk:
- very large content surface;
- more suitable as a second-stage pattern source than the first bounded clone.

### WEB-REF-003 — Studio Dumbar

Source:
- https://studiodumbar.com/
- https://studiodumbar.com/work

Observed current IA:
- Work
- Services
- About
- Jobs
- Contact
- large project grid / work index.

Why useful:
- mature studio presentation;
- strong project-grid model;
- useful motion/digital-brand reference for later Web pattern work.

Reproduction risk:
- motion-led presentation and media behavior increase first-project complexity.

### WEB-REF-004 — PORTO ROCHA

Source:
- https://www.portorocha.com/

Observed current IA:
- project-led homepage;
- About;
- studio updates;
- large project catalog with descriptive project subtitles.

Why useful:
- sophisticated editorial/project feed;
- strong relationship between portfolio grid, agency information and current studio updates.

Reproduction risk:
- large content volume and motion/media treatment make it less bounded for the first clone.

### WEB-REF-005 — Studio Feixen

Source:
- https://www.studiofeixen.ch/
- https://www.commarts.com/webpicks/studio-feixen

Observed current IA:
- Space
- Surface
- Time
- Home
- About
- Shop
- Talk
- Full Overview / Filter / Works
- project pages.

Why useful:
- highly distinctive categorical model;
- valuable later reference for experimental typography, interaction and nonstandard portfolio organization.

Reproduction risk:
- intentionally experimental behavior and motion make it a poor first baseline.

### WEB-REF-006 — Actual Source

Source:
- https://actualsource.work/
- https://www.commarts.com/webpicks/actual-source

Documented model:
- typography-heavy portfolio;
- historically described as one-page desktop navigation with independent information/project scrolling;
- project carousel behavior and image-counter cursor.

Why useful:
- strong minimal portfolio logic;
- useful reference for information density and avoiding unnecessary page transitions.

Reproduction risk:
- current official site exposes limited machine-readable structure;
- some detailed interaction evidence comes from older published documentation and needs fresh browser verification before cloning.

### WEB-REF-007 — Wade and Leta

Source:
- https://wadeandleta.com/

Observed current IA:
- Practice
- Works
- Process
- Index
- Contact / newsletter / social.

Why useful:
- concise studio IA;
- strong split between work, process and practice;
- relevant to a creative identity that should expose both finished work and method.

Reproduction risk:
- exact visual / motion system requires browser capture.

### WEB-REF-008 — The Minimalists

Source:
- https://www.theminimalists.com/
- representative article: https://www.theminimalists.com/contextual/
- paginated stream: https://www.theminimalists.com/page/2/
- resources index: https://www.theminimalists.com/resources/

Observed current model:
- centered, non-full-width editorial reading experience;
- persistent top navigation;
- short site/author introduction;
- sequential stream of titled entries with short descriptions and MORE links;
- numbered/paginated continuation through a long archive;
- article/detail pages centered on title, author, image and text;
- previous/next continuation between entries;
- secondary resource/index pages using the same editorial shell.

Why useful for the user's portfolio direction:
- remains visually complete even while content is still accumulating;
- supports continuous publishing rather than requiring a large finished project grid on day one;
- can present image + text + process + evidence naturally;
- creates a book/journal-like page-by-page reading rhythm;
- gives individual works enough narrative space without turning the site into a full-screen gallery;
- maps well to future INK case studies, research notes and finished works.

WR classification:
```text
EDITORIAL / BOOK-LIKE PORTFOLIO SHELL
MICRO-SITE / JOURNAL
SEQUENTIAL CASE-STUDY READING
NON-FULL-BLEED CONTENT
```

Boundary:
- reproduce layout/system behavior, not copyrighted editorial content;
- newsletter/email infrastructure is optional and outside the first reproduction;
- no WordPress or proprietary backend cloning is required.

Reproduction risk:
- exact geometry, typography and responsive breakpoint behavior still require browser capture and measurement.



The initial set confirms three useful reference families:

```text
A. EDITORIAL / BOOK-LIKE PORTFOLIO
   The Minimalists

B. SIMPLE PORTFOLIO SHELL
   Anthony Burrill / Wade and Leta

C. DENSE INDEX / TAXONOMY
   Order / Actual Source

D. MOTION / EXPERIMENTAL STUDIO
   Studio Dumbar / PORTO ROCHA / Studio Feixen
```

For the first reproduction, the user selected the editorial / book-like model. The Minimalists is now the primary reference because its restrained non-full-width reading shell can grow continuously while still feeling complete, and it supports a sequential, page-by-page portfolio experience.

## Next

Proceed to Phase B reference selection and issue a bounded first-reproduction Work Order.
