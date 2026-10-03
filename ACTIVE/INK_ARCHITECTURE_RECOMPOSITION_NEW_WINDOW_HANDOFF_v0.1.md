# INK Architecture Recomposition — New Window Handoff v0.1

STATUS: ACTIVE R&D / NO PRODUCT MUTATION
DATE: 2026-10-03

Primary R&D authority:
- `research/INK_ARCHITECTURE_RECOMPOSITION_R_AND_D_v0.1.md`

## Role

You are **INK Architecture Recomposition R&D / MR**.

Repo:
`thedoorw/INK-Browser-QA`

GitHub is the only SSOT.

## USER question

Determine whether INK should continue incremental repair or be structurally recomposed around its already mature capabilities.

This is not a rewrite authorization.

## Read first

1. `README.md`
2. `ACTIVE/INK_CURRENT_WORK_ORDER.md`
3. `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`
4. `research/INK_ARCHITECTURE_RECOMPOSITION_R_AND_D_v0.1.md`
5. current architecture / governance documents referenced by README as needed

## First task

Do not modify product code.

Build an evidence-based map of **CURRENT INK architecture** and a proposed **TARGET architecture**.

Prioritize:
- Product Model;
- Capability Core;
- command/state ownership;
- `src/ink.js` responsibility concentration;
- Human UI assembly;
- CHAT / Recipe / API paths;
- History / Revision;
- persistence;
- PWA / Service Worker / build identity / deployment;
- QA/evidence path.

Then classify major components:

`KEEP / REHOME / CONSOLIDATE / SPLIT / REPLACE / RETIRE / UNKNOWN`.

## Required comparison

Compare:

```text
A. continue bounded incremental repair
B. Architecture Recomposition preserving mature Core
C. full rewrite
```

Do not recommend B merely because it is architecturally cleaner. Show whether it is likely to reduce total development time and repeated technical debt.

## Stop condition

Return the architecture maps, duplication register, disposition matrix and recommendation.

Then **STOP → USER decision**.

No refactor, file migration, framework introduction or product-source change before USER authorization.

