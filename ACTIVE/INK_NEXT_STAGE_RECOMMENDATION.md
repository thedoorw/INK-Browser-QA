# INK v0.1 — Next Stage Recommendation

STATUS: `RECOMMENDATION_ONLY`

This document records the current recommended evolution path for INK after the completed FLORA optionalization round. It is guidance for REVIEW and future work-order design. It is **not implementation authorization**.

## Current validated direction

The current architecture has established a useful pattern:

- keep the general INK Core small and domain-neutral;
- move specialized capabilities behind explicit bounded seams;
- preserve optional capability source rather than delete it;
- require detached-Core and enabled-capability regression evidence;
- validate structural changes with the Windows / Chrome / Node-free Runtime baseline;
- require independent REVIEW before adopting a new validated engineering baseline.

FLORA optionalization is the first successful reference implementation of this pattern.

## Recommended evolution sequence

### 1. Close the current REVIEW and establish a validated engineering baseline

Do not begin another architecture milestone until the current structure-optionalization REVIEW is complete.

If REVIEW passes, record the approved DEV completion / Runtime-bearing relationship as the rollback and comparison point for subsequent structural work.

A REVIEW PASS is still not Certified and does not by itself authorize main promotion or packaging.

### 2. AI capability optionalization

Recommended next bounded milestone:

`INK v0.1 — AI Capability Optionalization & Core Boundary Consolidation`

Primary objective:
- remove AI as an eager mandatory Core dependency where technically appropriate;
- reuse the domain-neutral capability seam created during FLORA optionalization rather than inventing a parallel plugin architecture;
- ensure Core starts and remains functional with AI completely detached;
- preserve explicit AI attach / enabled operation;
- keep Recipe out of scope unless a clean AI cut is impossible without a separately reviewed interface adjustment.

Required behavior preservation should include, at minimum:
- startup;
- Drawing / Stylus;
- Vector;
- Raster / Image;
- Natural Media;
- Document / History;
- Layers;
- Selection / Transform;
- serialization;
- export initialization;
- persistence / reload;
- FLORA detached/enabled behavior already established;
- AI detached and AI enabled representative behavior.

The goal is architectural clarity and failure isolation, not arbitrary byte reduction.

### 3. Recipe / Automation optionalization

Do not combine this automatically with AI optionalization.

Recipe has higher coupling risk because it may intersect:
- Program Import;
- Studio Core;
- automation flow;
- document/data interpretation;
- migration or schema behavior.

Before implementation, build a dedicated Recipe dependency map and identify which parts are true general Core responsibilities versus Recipe-owned automation behavior.

Only after that analysis should a separate bounded work order authorize Recipe optionalization.

### 4. Core consolidation

After FLORA, AI, and Recipe boundaries are stable, perform a dedicated Core consolidation review.

Target architecture direction:

```text
INK CORE
├─ Drawing / Stylus
├─ Vector
├─ Raster / Image
├─ Natural Media
├─ Document / History
├─ Selection / Transform
├─ Render / Export
├─ Material
├─ Persistence / Recompute
└─ basic Program Import

OPTIONAL CAPABILITIES
├─ FLORA
├─ AI
└─ Recipe / Automation
```

At this stage, inspect:
- dead startup dependencies;
- duplicated infrastructure;
- Studio Core responsibilities;
- capability-boundary leakage;
- PWA/runtime-shell completeness;
- unnecessary eager modules;
- maintainability costs introduced by previous seams.

Do not use module count or file size as the sole success metric.

### 5. Self-contained `INK.html` Candidate

Only after architecture and Runtime behavior are stable should INK enter a dedicated single-file Candidate milestone.

This stage should primarily package verified behavior, not redesign architecture.

The Candidate should be validated independently and should not be called Certified merely because the modular source previously passed tests.

Expected formal package direction remains:

```text
INK.html
WORKING_STATUS.md
SHA256SUMS.txt
```

The exact packaged bytes must pass the required Runtime and regression gates.

### 6. UI / product maturity

After the product boundary and delivery format stop moving materially, focus on the user-facing maturity work that will benefit from a stable foundation:
- toolbar hierarchy;
- layers interaction;
- canvas / fullscreen behavior;
- undo/redo and history UX;
- stylus behavior;
- spacing/alignment consistency;
- clear optional-capability presentation;
- overall product polish.

This avoids repeatedly reworking UI while the underlying architecture is still being reorganized.

### 7. Certification

Certification is last.

Certified should mean:
- exact package bytes are known;
- required Runtime and interaction gates pass;
- known limitations are recorded;
- package identity and hashes are fixed;
- REVIEW has closed with no blocking findings;
- the user explicitly authorizes certification/promotion.

## Recommended next-work-order rule

Unless current REVIEW discovers a blocking health issue, the next work order should be **AI optionalization only**.

Do not combine:
- AI optionalization;
- Recipe optionalization;
- final `INK.html` packaging;
- UI redesign;
- certification

into one development round.

The preferred sequence is:

`Review closure -> validated engineering baseline -> AI optionalization -> Recipe optionalization -> Core consolidation -> self-contained INK.html Candidate -> UI/product maturity -> Certified`

## Authority note

This file records architectural recommendation and sequencing only.

It does not override:
- explicit user instruction;
- the current ACTIVE Work Order;
- `governance/INK_EVOLUTION_AND_HEALTH_GOVERNANCE_v0.1.md`;
- STOP RULES.

Future REVIEW may revise this recommendation when new evidence justifies a different sequence, but should document why the recommendation changed rather than silently replacing it.
