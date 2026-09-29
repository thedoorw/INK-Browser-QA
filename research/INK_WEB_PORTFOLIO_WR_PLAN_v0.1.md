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

## 2. Role boundary

### WR — Web Review

WR owns:

- mature portfolio website discovery and research;
- reference selection;
- information-architecture analysis;
- grid / spacing / typography / navigation analysis;
- responsive behavior analysis;
- project / case-study page structure;
- visual interaction and motion analysis where relevant;
- WEB DEV workpacks;
- browser / responsive / visual QA;
- GitHub Pages portfolio review;
- website-reproduction methodology;
- reusable Web pattern / component / lesson records.

WR does not own:

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
GitHub Pages / Portfolio
```

If a website requirement implies a change to INK itself:

```text
STOP
→ return finding to MR / relevant INK authority
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

### D. Portfolio Content Integration

The site should later present the INK Creative Reproduction Benchmark:

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

### E. Visual / Responsive QA

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

### F. GitHub Pages Deployment

The first portfolio should be deployed from GitHub and remain reproducible from repository state.

Deployment should preserve:

- versioned source;
- repeatable build/deploy path;
- traceable reference assets and licenses;
- stable case URLs where practical.

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
