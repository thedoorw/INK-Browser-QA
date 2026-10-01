# INK Creative Reproduction Benchmark v0.1

## Status

```text
TYPE = RESEARCH / BENCHMARK PROGRAM
AUTHORITY = DIRECTIONAL / DOES NOT AUTHORIZE PRODUCT MUTATION
PHASE_1 = MATURE-WORK_REPRODUCTION
TARGET_CANDIDATE_LIBRARY = 100+
PRIMARY_REFERENCE_ECOSYSTEMS = Figma / Adobe / Canva
PORTFOLIO_TARGET = GitHub-hosted public case-study / result site
```

## 1. Purpose

INK has already incorporated multiple interaction and connector ideas derived from mature CHAT-operable systems such as Figma, Adobe and Canva.

The next validation stage is not to jump directly into mature-work reproduction. It first uses proven GPT / agent workflows from Figma, Adobe and Canva to establish a planned CHAT × INK capability qualification surface.

The first question is:

> Can CHAT reliably discover, target, invoke, verify and revise the practical creative capabilities already present in INK?

Only after this qualification direction is visible and sufficiently tested does the program move into mature-work reproduction.

Detailed Gate-1 plan:
`research/INK_CHAT_CAPABILITY_QUALIFICATION_PLAN_v0.1.md`.

## 2. Program sequence

```text
proven GPT / agent workflows in Figma / Adobe / Canva
→ extract operations and workflow sequence
→ map cases to INK capabilities
→ identify overlap / unique coverage / gaps
→ define CHAT × INK qualification tests
→ execute Gate 1 isolated capability tests
→ execute Gate 2 combined-task tests
→ analyze mature external work
→ CHAT writes INK-specific reproduction procedure
→ autonomous INK reproduction
→ Preview / compare / correct
→ History / Revision / provenance evidence
→ publish selected case + result to portfolio
```

The program must see the route before execution expands. Case collection is therefore subordinate to coverage planning, not an end in itself.

## 3. Source pool

Primary source ecosystems:

- Figma
- Adobe
- Canva

Useful sources include:

- official tutorials;
- official example files;
- community files;
- creator process shares;
- case studies;
- public design walkthroughs;
- documented Actions / steps / techniques / workflows.

The benchmark should prefer sources that expose enough visual or procedural evidence to support a reproducible test.

The long-term mature-work candidate pool should contain **100 or more** qualified cases. Expansion toward that target is deferred while Gate 1 is being planned and qualified. The current evidence set is 40 Figma / Adobe / Canva qualification and supporting cases used to derive capability coverage and test direction. Canva adds existing-design retrieval, text/image extraction, image→editable-design conversion, URL import, design editing, Brand Kit constraints, feedback/revision and data-driven variants.

## 4. Selection criteria

A case is preferred when it satisfies all of the following:

1. **Mature finished result**
   - It must produce a recognizable complete work, not only demonstrate one isolated feature.

2. **Concrete work category**
   - The result can be classified as a real design artifact.

3. **Reproducible visual target**
   - CHAT can inspect enough of the result to attempt a bounded reproduction.

4. **Useful INK coverage**
   - The case exercises one or more meaningful INK creative capabilities.

5. **Portfolio value**
   - The final result is worth showing as a finished case rather than only as QA evidence.

No single case is required to exercise every INK feature. The **benchmark set as a whole** should progressively cover the complete practical capability surface.

## 5. Initial work categories

The catalog should support at least:

```text
Poster
Logo / Brand Mark
Typography / Editorial Layout
Pattern / Print
Vector Illustration
Packaging
Composite / Image Composition
Social / Marketing Graphic
Icon / Symbol System
UI / Information Design
Mixed / Cross-category Work
```

Categories may expand as the collection grows.

## 6. Capability coverage

Across the full benchmark set, track practical use of capabilities such as:

```text
Path / Shape
Fill / Stroke
Text
Layer / Group
Transform
Align / Layout
Mask / Clip
Image / Reference
Pattern / Repeat
Composition
Selection / Targeting
Repaint / Restyle
History
Revision
Preview
Export / Output
CHAT capability discovery
CHAT operation routing
operation record / provenance
```

The capability matrix should reveal three things separately:

```text
CAPABILITY EXISTS AND CHAT CAN USE IT
CAPABILITY EXISTS BUT CHAT CANNOT RELIABLY OPERATE IT
CAPABILITY IS MISSING OR INSUFFICIENT IN INK
```

## 7. Reproduction acceptance model

Each reproduction case should end in one of:

```text
PASS
PARTIAL
BLOCKED
```

Evaluation should distinguish:

- visual/result fidelity;
- successful use of authoritative INK operations;
- ability to make iterative corrections;
- History / Revision / operation-record integrity;
- missing function;
- connector exposure gap;
- targeting/selection gap;
- preview/visual-feedback gap;
- workflow or usability friction.

A case must not be called successful only because commands executed. The finished artifact must be visibly inspectable.

## 8. Case record

Each case should eventually retain:

```text
CASE_ID
SOURCE_URL / SOURCE_ID
SOURCE_TYPE
ORIGINAL_TOOL
WORK_CATEGORY
TARGET_RESULT
SOURCE_STEPS / ACTIONS / TECHNIQUES
INK_CAPABILITIES_EXERCISED
CHAT_OPERATION_TRACE
PREVIEW / INTERMEDIATE STATES
FINAL_RESULT
HISTORY / REVISION / PROVENANCE EVIDENCE
RESULT = PASS / PARTIAL / BLOCKED
GAPS_FOUND
FOLLOW-UP
```

Reproduction cases may preserve tutorial steps as evidence, but reproduction begins only after capability qualification. Success is judged by whether CHAT can complete the work with INK and visibly verify the result.

## 9. 100+ mature-work candidate library

The long-term catalog target remains:

```text
QUALIFIED_CANDIDATES >= 100
```

However this is **not the current gate**. The program first builds and executes the CHAT × INK qualification plan from the selected evidence set. Only after capability direction and gaps are visible should the mature-work library expand aggressively.

The mature-work library should then be distributed across work categories and capability coverage so the full set becomes a practical creative benchmark for INK.

## 10. GitHub portfolio

A GitHub-hosted portfolio/site is part of the program direction.

Its purpose is to show both:

- the source/tutorial context;
- the reproduction result made through CHAT × INK.

Suggested information architecture:

```text
cases/
  CASE-xxx/
    source
    target
    workflow/reference notes
    execution evidence
    intermediate results
    final result
    capability/gap assessment

catalog/
  works
  categories
  techniques
  actions
  workflows
  capabilities

site/
  browse by category
  browse by source ecosystem
  browse by INK capability
  case pages
  final results
```

The public-facing site is a presentation layer. GitHub repository data remains the evidence/source layer.

## 11. Learning / generalization phase

Only after capability qualification and reproduction have demonstrated that CHAT can reliably create with INK should the program move to the higher-level question:

```text
tutorial / creator workflow
→ extract method
→ translate method into INK workflow
→ reuse that method on a new work
```

That is a later learning/generalization stage and must not be confused with the initial reproduction benchmark.

## 12. Relationship to INK development

This benchmark is intended to turn real finished works into capability evidence.

```text
reproduction succeeds
→ capability confidence increases

reproduction fails
→ classify the actual cause
→ establish whether the gap is INK / connector / targeting / preview / workflow
→ authorize bounded development only through normal MR governance
→ rerun the same case
```

The benchmark itself does not authorize product-source changes.

Current Work Order authority remains:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`
