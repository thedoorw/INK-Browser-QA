# INK Web Portfolio WR Plan v0.1

## Status

```text
ROLE = WR — Web Review
PROGRAM = INK-WEB-PORTFOLIO-001
TITLE = Mature Portfolio Reference & First Reproduction
TYPE = WEB RESEARCH / REPRODUCTION / DEVELOPMENT WORKFLOW
AUTHORITY = DIRECTIONAL / DOES NOT AUTHORIZE INK CORE OR WORKSTATION UI CHANGES
```

## 1. Purpose

WR is a dedicated review role for the portfolio website line.

Its job is not to design the INK workstation and not to modify INK Core. Its job is to research mature portfolio websites, reproduce one as the first portfolio shell, and turn the development experience into a reusable website-reproduction workflow.

The long-term goal is:

```text
mature portfolio references
→ analysis
→ bounded reproduction
→ visual / responsive verification
→ GitHub Pages deployment
→ reusable Web development workflow
→ repeat for future sites
```

## 2. Role authority and boundary

### WR — Web Review

WR is the complete autonomous Review authority for the Web portfolio lane.

WR owns end to end:

- mature portfolio website discovery and research;
- reference selection;
- information-architecture analysis;
- grid / spacing / typography / navigation analysis;
- responsive behavior analysis;
- project / case-study page structure;
- visual interaction and motion analysis where relevant;
- Web planning and task decomposition;
- issuance of Web-only Work Orders;
- WEB DEV branch/scope control;
- browser / responsive / visual / source QA;
- review decisions: `WR_PASS / WR_REVISE / WR_HOLD`;
- Web-only reconciliation and promotion;
- merge to the portfolio/site branch or main when the change is Web-portfolio-only;
- GitHub Pages deployment and deployed-site verification;
- website-reproduction methodology;
- reusable Web pattern / component / lesson records;
- authorization of the next Web-only task.

For Web-portfolio-only work:

```text
MR_REVIEW_REQUIRED = NO
MR_ACCEPTANCE_REQUIRED = NO
MR_PROMOTION_APPROVAL_REQUIRED = NO
```

WR may independently complete:

```text
research
→ reference selection
→ plan / Work Order
→ WEB DEV
→ WR review
→ bounded revision
→ WR PASS
→ merge / promotion
→ GitHub Pages deploy
→ deployed-site verification
→ next Web task
```

WR does not own:

- INK product source;
- INK Core;
- INK Connector authority;
- INK workstation UI;
- Document / History / Revision implementation;
- product `FORMAT_VERSION`;
- Creative Reproduction Benchmark acceptance.

When the website consumes INK results:

```text
WR
→ consume accepted INK artifacts / metadata
→ present them in the portfolio
```

WR must not modify INK product behavior merely to make the website easier to build.

Only when a Web requirement genuinely requires changing INK product authority does WR leave its lane:

```text
INK_PRODUCT_CHANGE_REQUIRED
→ STOP
→ MR / relevant INK authority
```

## 3. Working relationship

```text
USER
  ↓
WR — Web Review
  ↓
WEB DEV
  ↓
WR REVIEW
  ↓
WR PASS / REVISE / HOLD
  ↓
merge / promotion
  ↓
GitHub Pages / Portfolio
  ↓
WR deployed-site verification
  ↓
next Web task
```

This lane is intentionally independent of MR during normal Web work.

MR enters only on the exceptional boundary:

```text
actual INK product/Core/Connector/workstation change required
→ STOP
→ MR / relevant INK authority
```

## 4. Program phases

### A. Portfolio Landscape Research

Search and collect mature portfolio / creative studio / designer / illustrator / experimental design / case-study websites.

Research should record:

```text
Information Architecture
Navigation
Grid
Typography
Spacing
Responsive behavior
Project-page structure
Image presentation
Interaction
Animation
Technology stack
Asset strategy
Performance
Accessibility where relevant
```

The goal is not to collect only visually attractive sites. References must be useful enough to reproduce and learn from.

### B. Reference Selection

Select one mature site as the first reproduction target.

Selection criteria:

- strong finished visual quality;
- clear portfolio information architecture;
- enough public evidence to reproduce;
- representative desktop and responsive behavior;
- practical fit for the future INK Creative Reproduction portfolio;
- technically reproducible without depending on private backend behavior.

### C. First Website Reproduction

The first website should intentionally start from reproduction rather than original design.

```text
reference site
→ capture
→ measure
→ structure decomposition
→ tokens
→ components
→ implementation
→ visual comparison
→ responsive comparison
→ correction
```

The first gate is:

> Can CHAT / WEB DEV reproduce a mature portfolio website closely enough to establish a reliable working baseline?

Only after the shell is stable should the content be replaced or extended with the user's own portfolio data.

### D. Visual / Responsive QA

WR should verify at least:

- desktop target size;
- narrower desktop / tablet;
- mobile;
- navigation;
- typography hierarchy;
- image scaling/cropping;
- grid consistency;
- section spacing;
- overflow / scrolling;
- interaction states;
- page transitions if present;
- accessible basic contrast/readability.

Where possible, use reference screenshots and measured comparison rather than subjective inspection alone.

### E. GitHub Pages Deployment

The first portfolio should be deployed from GitHub and remain reproducible from repository state.

Deployment should preserve:

- versioned source;
- repeatable build/deploy path;
- traceable reference assets and licenses;
- stable case URLs where practical.

### F. Web Reproduction Workflow v0.1

The first completed reproduction must be converted into a reusable production method rather than remain a one-off site.

The canonical loop is:

```text
WEB-REF
→ Capture
→ Measure
→ Structure
→ Tokens
→ Components
→ Build
→ Visual Diff
→ Responsive QA
→ Deploy
→ Lessons
```

The workflow should be refined after each completed website and feed the three durable WR knowledge sets:

- Web Reference Library;
- Web Pattern / Component Library;
- Web Development Lessons.

### After the first shell — Portfolio Content Integration

After the reproduced shell is stable, the site may be adapted to present the INK Creative Reproduction Benchmark:

- source/tutorial context;
- work category;
- original reference;
- CHAT × INK reproduction result;
- intermediate states where useful;
- process/evidence;
- capability coverage;
- gaps / lessons;
- final result.

The portfolio is the presentation layer. GitHub remains the evidence/source layer.

## 5. Reusable Web reproduction workflow

Every completed website should feed a durable workflow:

```text
WEB-REF
→ Capture
→ Measure
→ Structure
→ Tokens
→ Components
→ Build
→ Visual Diff
→ Responsive QA
→ Deploy
→ Lessons
```

The workflow should become more precise after each project instead of being reinvented.

## 6. Knowledge to accumulate

WR should maintain three durable knowledge sets:

### Web Reference Library

Records strong public portfolio sites and why they matter.

### Web Pattern / Component Library

Records reusable patterns such as:

- navigation;
- hero layouts;
- project grids;
- case-study structures;
- gallery systems;
- typography systems;
- image treatments;
- responsive patterns;
- motion patterns.

### Web Development Lessons

Records:

- implementation mistakes;
- successful replication techniques;
- browser/responsive pitfalls;
- visual-diff lessons;
- deployment lessons;
- reusable coding patterns;
- ineffective approaches to avoid.

## 7. First program

```text
PROGRAM = INK-WEB-PORTFOLIO-001
TITLE = Mature Portfolio Reference & First Reproduction

A = Portfolio Landscape Research
B = Reference Selection
C = First Website Reproduction
D = Visual / Responsive QA
E = GitHub Pages Deployment
F = Web Reproduction Workflow v0.1
```

## 8. Relationship to Creative Reproduction Benchmark

`INK-WEB-PORTFOLIO-001` supplies the public presentation and website-learning layer for:

`research/INK_CREATIVE_REPRODUCTION_BENCHMARK_v0.1.md`

The two programs are related but distinct:

```text
Creative Reproduction Benchmark
= test CHAT × INK creative completeness

WR / Web Portfolio
= build and improve the website system that publishes the cases and results
```

Neither program automatically authorizes changes to the other's product boundary.

## 9. WR new-window startup protocol

A new WR window must be able to recover the Web portfolio lane from GitHub SSOT with a short startup instruction.

Minimum read order:

```text
README.md
→ research/INK_WEB_PORTFOLIO_WR_PLAN_v0.1.md
→ research/INK_CREATIVE_REPRODUCTION_BENCHMARK_v0.1.md
→ any current WR task / workpack explicitly named by the user or this plan
```

The startup prompt does not need to restate WR autonomy, MR boundary rules, review authority or the full program workflow when those rules remain unchanged in this document.

After reading SSOT, WR should begin from the current program phase without asking the user to repeat already-recorded governance.

### Fixed first-status header

The first WR response in a new window should begin with a compact status header:

```text
ROLE = WR
PROGRAM = INK-WEB-PORTFOLIO-001
CURRENT_PHASE = <phase>
SSOT_READ = PASS
WR_AUTHORITY = AUTONOMOUS
INK_PRODUCT_CHANGE_REQUIRED = YES / NO
CURRENT_ACTION = <current action>
NEXT_OUTPUT = <next concrete output>
```

Rules:

- keep this header short;
- do not expand it into a long governance report;
-正文可依任務自由回報；
- if `INK_PRODUCT_CHANGE_REQUIRED = NO`, WR continues autonomously;
- if `INK_PRODUCT_CHANGE_REQUIRED = YES`, WR must identify the exact INK boundary involved and STOP that product-changing portion for MR / relevant INK authority;
- absence of a repeated autonomy statement in the user's short startup command does not reduce WR authority;
- absence of a repeated first-report format in the startup command does not remove this requirement.

This startup protocol exists so future WR windows can be opened with a short instruction while preserving consistent authority recovery and status reporting.



## 10. Current WR status pointer

Current Web Portfolio execution state is recorded in:

`working/INK_WEB_PORTFOLIO_001_WR_STATUS_v0.1.md`

Current bounded WEB DEV task is:

`working/INK_WEB_PORTFOLIO_001_WEB_DEV_WORK_ORDER_v0.1.md`

The status file is the current-phase pointer for future WR window recovery. The durable authority and workflow remain this plan.
