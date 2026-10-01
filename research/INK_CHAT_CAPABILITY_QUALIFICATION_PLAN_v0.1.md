# INK CHAT Capability Qualification Plan v0.1

## Status

```text
TYPE = RESEARCH / QUALIFICATION PLAN
AUTHORITY = DIRECTIONAL / DOES NOT AUTHORIZE PRODUCT MUTATION
CURRENT_GATE = GATE_1_CHAT_INK_CAPABILITY_QUALIFICATION
REFERENCE_ECOSYSTEMS = Figma / Adobe / Canva
CASE_EVIDENCE_SET = 30 VERIFIED FIGMA / ADOBE CASES + CANVA EVIDENCE PENDING
QUALIFICATION_TEST_ROWS = 56
PRACTICAL_COVERAGE_GROUPS = 50
BASELINE_FAMILY_AUDIT = 64 / 64 DISPOSITIONED
EXECUTION = NOT STARTED
```

## 1. Purpose

Before CHAT attempts mature-work reproduction, INK must first prove that CHAT can discover, target, invoke, verify and revise the practical creative capabilities already present in INK.

The program therefore does not begin by sending CHAT directly into reproduction and discovering direction during execution.

The required order is:

```text
study proven GPT / agent workflows in Figma, Adobe and Canva
→ extract the operations and sequence used by those workflows
→ map them to INK capability families and CHAT exposure
→ build case × capability coverage
→ identify overlap, unique coverage and untested gaps
→ define qualification tests and PASS criteria
→ execute bounded tests
→ only then begin mature-work reproduction
```

Canva is now installed and available as the third ChatGPT-operable comparison ecosystem. Canva cases are not counted until their workflows are selected and mapped.

## 2. Gate sequence

### Gate 1 — CHAT × INK capability qualification

Prove that CHAT can use the practical creative/control surface of INK.

A capability is not PASS merely because it exists in source or because an API call returns successfully.

PASS requires:

```text
CHAT discovers the relevant capability
→ grounds the correct document / object / selection
→ proposes the intended operation
→ receives required approval
→ executes through native INK authority
→ observes the resulting state
→ can modify or correct it
→ verifies the final visible / structural result
→ History / Revision evidence remains coherent
```

### Gate 2 — Combined-task qualification

Combine multiple qualified capabilities into small finished exercises.

Goal:
- verify dependency ordering;
- verify that isolated PASS results still work together;
- expose targeting, state-order, History, Preview and correction problems.

### Gate 3 — External-work analysis

Only after Gate 1/2 are sufficiently qualified:

```text
mature work / tutorial
→ CHAT identifies required functions and techniques
→ CHAT writes an INK-specific reproduction procedure
```

### Gate 4 — Autonomous reproduction

```text
CHAT follows its own procedure
→ operates INK
→ Preview / compare
→ bounded correction
→ finished result
→ capability-gap classification
```

### Gate 5 — Portfolio

Publish selected tutorial context, INK workflow, evidence and final result.

## 3. Qualification evidence set

Current verified evidence:

- Figma;
- Adobe.

Third ecosystem now available for evidence selection:

- Canva.

Canva is intentionally chosen because it adds a different comparison surface:

```text
existing design / uploaded asset intake
→ editable design creation or conversion
→ text / media / formatting edits
→ element reposition / resize
→ design feedback
→ comment-driven revision
→ Brand Kit consistency checks
→ multi-format resize
→ spreadsheet-driven bulk variants
```

This is useful to INK because the benchmark needs not only generation capability but also extraction-like understanding, structured editing, reuse, revision and transformation of existing material.

Evidence can include:
- official ChatGPT / Codex examples;
- official plugin workflows;
- documented tool procedures;
- public hands-on reproductions where the operation path is inspectable;
- official native-tool operating references when an INK capability has no sufficiently specific GPT example.

Native-tool references are supporting evidence only. They may define test steps, but they must not be misrepresented as proof that GPT already performs the same operation.

## 4. Case → capability planning

Before executing any INK test, each selected case must be registered against the capabilities it can exercise.

Required mapping fields:

```text
CASE_ID
REFERENCE_ECOSYSTEM
REFERENCE_WORKFLOW
REFERENCE_OPERATIONS
INK_CAPABILITIES_MAPPED
CHAT_EXPOSURE_STATUS
TEST_EXERCISE
EXPECTED_RESULT
PASS_CRITERIA
```

This mapping serves two purposes:

1. avoid redundant blind testing;
2. reveal capability coverage before execution begins.

## 5. Coverage analysis

Coverage must be analyzed at set level.

For each INK capability, record:

```text
SUPPORTING_CASES
SUPPORTING_ECOSYSTEMS
CASE_COUNT
ECOSYSTEM_COUNT
OVERLAP_CLASS
CHAT_EXPOSURE_BASELINE
QUALIFICATION_STATUS
```

Overlap classes after Canva cases are mapped:

```text
COMMON_3 = represented by Figma + Adobe + Canva
COMMON_2 = represented by two ecosystems
SINGLE_ECOSYSTEM = represented by one ecosystem only
INK_ONLY = important INK capability with no useful external analogue yet
OUT_OF_GATE = platform/internal capability not required for creative CHAT qualification
```

The goal is not to maximize overlap mechanically. The goal is to know exactly where evidence is broad, narrow or absent.

## 6. Qualification scope

Gate 1 focuses on practical CHAT-operable creation and closed-loop control, including:

```text
Capability discovery
Grounding / inspection / targeting
Shape / Path creation
Path / node editing
Fill / Stroke / material / restyle
Text / typography
Transform
Clone / order
Group / hierarchy / Frame
Boolean
Align / distribute / snapping
Repeat / parametric structure
Layout / constraints
Components / instances
SVG import / editable structure
Reference import
Extraction / vectorization
Structure reconstruction
Drawing / brush / stroke editing
Selection / mask / region-targeted edit
Layers
Creative Library
Proposal / approval / execution governance
History
Revision
Preview / compare / correction
Provenance
Export / output
Multi-step creative plan
Document / Pages / Artboard lifecycle
Raster / Mask / Adjustment / Filter / Blend
Brush engine / natural media / dynamics / stroke session
High-resolution export
Recompute
Recipe / automation
Program import
Creative Memory
Stylus / calibration
```

The full product baseline was audited against all 64 authoritative capability families in `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`.

The audit distinguishes:

```text
COVERED / QUALIFY
COVERED_WEAK / SEMANTIC_GAP
QUALIFY_INK_ONLY
ENVIRONMENT_GATED
PARTIAL_SCOPE
BEHAVIOR_ONLY
OUT_OF_GATE
SPECIALIZATION_GATE
```

This prevents the qualification matrix from silently omitting real INK creative capabilities while still keeping renderer/GPU/PWA/platform internals out of a user-facing creative-control test.

## 7. Result classes

Each test ends in one of:

```text
PASS
PARTIAL
BLOCKED
NOT_EXPOSED
NOT_REQUIRED
```

A failure must be classified as one or more of:

```text
INK_CAPABILITY_GAP
CHAT_CONNECTOR_EXPOSURE_GAP
TARGETING_GAP
STATE / ORDERING_GAP
PREVIEW / VISUAL_FEEDBACK_GAP
HISTORY / REVISION_GAP
WORKFLOW / USABILITY_GAP
REFERENCE_WORKFLOW_NOT_APPLICABLE
```

## 8. Current artifacts

Working planning artifacts live in the connected Google Sheet:

```text
GPT Qualification
INK Qualification Matrix
Case Coverage Matrix
Coverage Summary
Baseline Coverage Audit
```

The Sheet is a working analysis surface.

GitHub remains the SSOT for program direction, gate definitions and accepted conclusions.

## 9. Current progress

```text
VERIFIED_FIGMA_ADOBE_CASES = 30
CANVA_PLUGIN = INSTALLED
CANVA_CASE_SELECTION = NEXT
CASE_COVERAGE_MATRIX = BUILT / CANVA COLUMN PENDING POPULATION
COVERAGE_SUMMARY = BUILT / CANVA COLUMN PENDING POPULATION
QUALIFICATION_TEST_ROWS = 56
PRACTICAL_COVERAGE_GROUPS = 50
AUTHORITATIVE_BASELINE_FAMILIES = 64
BASELINE_FAMILY_AUDIT = 64 / 64 DISPOSITIONED

CURRENT TWO-ECOSYSTEM VIEW:
COMMON_2 = 19
SINGLE_ECOSYSTEM = 26
INK_ONLY = 5

INK execution = NOT STARTED
100+ mature-work expansion = DEFERRED
portfolio reproduction = HOLD
```

The two-ecosystem counts above are temporary and must be recalculated after Canva case mapping.

Current narrow or unique zones that Canva should be checked against first:

```text
Reference / existing-design intake
Extraction-like structure understanding
Layers / hierarchy
Text / formatting
Transform / resize
Library / reuse
Design feedback / visual QA
Revision from comments
Brand / consistency constraints
Bulk variants / repeat
Multi-format output
```

INK-specific zones remain independently qualified even if no external equivalent exists:

```text
Approval
Provenance
Stroke Session
Paper / Media
Stylus / Calibration
Layer Effects partial scope
Recipe / Program Import / Creative Memory special semantics
```

This is a planning-coverage result, not a Runtime qualification result.

## 10. Next action

Do not begin INK Runtime qualification while the UI program is still changing.

Next:

```text
select Canva qualification cases
→ map Canva workflows into the 50-group coverage matrix
→ recalculate COMMON_3 / COMMON_2 / SINGLE / INK_ONLY
→ prepare fixed fixtures and measurable PASS criteria
→ HOLD until UI completion
→ execute P0 qualification in dependency order
```

No product mutation is authorized by this plan.

Current implementation authority remains:
`ACTIVE/INK_CURRENT_WORK_ORDER.md`.
