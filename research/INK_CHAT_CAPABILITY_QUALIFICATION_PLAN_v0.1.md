# INK CHAT Capability Qualification Plan v0.1

## Status

```text
TYPE = RESEARCH / QUALIFICATION PLAN
AUTHORITY = DIRECTIONAL / DOES NOT AUTHORIZE PRODUCT MUTATION
CURRENT_GATE = GATE_1_CHAT_INK_CAPABILITY_QUALIFICATION
REFERENCE_ECOSYSTEMS = Figma / Adobe / Canva
CASE_EVIDENCE_SET = 40 FIGMA / ADOBE / CANVA QUALIFICATION + SUPPORT CASES
QUALIFICATION_TEST_ROWS = 56
PRACTICAL_COVERAGE_GROUPS = 50
BASELINE_FAMILY_AUDIT = 64 / 64 DISPOSITIONED
EXECUTION = MATURE_TOOL_METHOD_REVIEW_ACTIVE / INK_EXECUTION_HELD_BY_UI
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

Canva is installed and is the third ChatGPT-operable comparison ecosystem. Ten official Canva workflow cases have been selected and mapped.

## 1.1 External-tool operating policy — 2026-10-01

```text
EXTERNAL_PAID_SPEND = FORBIDDEN
CHATGPT_SUBSCRIPTION = ONLY_PAID_DEPENDENCY_ALLOWED
MATURE_TOOL_PURPOSE = LEARN_OPERATION_PATTERNS / NOT FULL_PRODUCT_QA
DOCUMENTED_CAPABILITY = MAY_BE_ACCEPTED_WITHOUT_REDUNDANT_LIVE_TEST
DOCUMENTED_UNAVAILABLE_CAPABILITY = RECORD_AS CHAT_SURFACE_GAP
FREE_PLAN_OR_QUOTA_BLOCK = RECORD_AS EXTERNAL_PLAN_LIMIT
EXTERNAL_PLAN_LIMIT = MUST_NOT_BLOCK_INK_PROGRAM
LIVE_TEST = RESERVED_FOR_UNKNOWN_BEHAVIOR_OR_END_TO_END_AUTONOMY
```

Figma, Adobe, Canva and any future external ecosystem are references and learning surfaces. The program will not purchase an external subscription merely to complete a benchmark.

The mature-tool question is now deliberately narrow:

> Does CHAT understand the relevant operation model well enough to transfer the method into INK, and is there at least limited evidence that CHAT can execute a closed loop where the free/current surface permits it?

The program is **not** responsible for exhaustively proving every documented feature of Figma, Adobe, Canva or another external product.

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

Current evidence ecosystems:

- Figma;
- Adobe;
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
QUALIFICATION_EVIDENCE_CASES = 40
CANVA_PLUGIN = INSTALLED
CANVA_CASES = 10 MAPPED
CASE_COVERAGE_MATRIX = BUILT
COVERAGE_SUMMARY = BUILT
QUALIFICATION_TEST_ROWS = 56
PRACTICAL_COVERAGE_GROUPS = 50
AUTHORITATIVE_BASELINE_FAMILIES = 64
BASELINE_FAMILY_AUDIT = 64 / 64 DISPOSITIONED

THREE-ECOSYSTEM COVERAGE VIEW:
COMMON_3 = 16
COMMON_2 = 7
SINGLE_ECOSYSTEM = 22
INK_ONLY = 5

INK execution = NOT STARTED
100+ mature-work expansion = DEFERRED
portfolio reproduction = HOLD
```

Canva materially strengthens the middle layer between flat/reference input and editable design. Current strongest added areas:

```text
Reference / existing-design intake
Text / image content extraction
Image → editable-design conversion
PDF / PowerPoint URL import
Text / formatting transformation
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

## 9.1 Mature-tool autonomy pretest disposition

Figma Batch 01 was executed and reviewed. It demonstrated that exhaustive external-tool feature testing is the wrong gate for this program.

```text
TASK = MTB-FIGMA-BATCH-01
ECOSYSTEM = FIGMA
BRANCH = work/mature-tool-benchmark-figma-batch-01
ISSUE = #108
STATUS = REVIEW_COMPLETE / NO_RERUN_REQUIRED_FOR_PROGRAM_GATE
F01 = INITIAL_CREATION_EVIDENCE / CLOSED_LOOP_INTERRUPTED_BY_EXTERNAL_PLAN_LIMIT
F08 = DOCUMENT_CONFIRMED_BOOLEAN_SURFACE
F09 = DOCUMENT_CONFIRMED_AUTO_LAYOUT_SURFACE
F10 = DOCUMENT_CONFIRMED_COMPONENT_SURFACE
F14 = CHAT_SURFACE_GAP / CALLABLE_UNDO_AND_VERSION_HISTORY_SAVE_UNAVAILABLE
BATCH_02 = NOT_REQUIRED
```

The Starter-plan page limit and MCP quota are recorded as `EXTERNAL_PLAN_LIMIT`, not as CHAT capability failure. The program will not purchase a Figma plan to continue this benchmark.

Future Figma/Adobe/Canva work uses:

```text
official capability evidence
→ operation-pattern extraction
→ one bounded end-to-end sample only when it resolves a real unknown
→ stop
```

No per-feature mature-tool regression suite is required.

## 10. Next action

Do not begin INK Runtime qualification while the UI program is still changing.

The mature-tool research phase is now reduced to operation-pattern confirmation. Do not expand external-tool testing merely to increase PASS counts.

Next:

```text
finish concise Figma / Adobe / Canva operation-pattern map
→ classify each external capability as DOCUMENT_CONFIRMED / LIVE_LOOP_CONFIRMED / CHAT_SURFACE_GAP / EXTERNAL_PLAN_LIMIT
→ compress the 56 planned INK rows into approximately 10–12 practical capability groups
→ define a small number of multi-capability INK exercises
→ HOLD execution until current UI authority permits
→ run CHAT × INK discovery → operation → Preview → self-correction → final verification
→ if that closes, proceed to mature-work analysis and reproduction
```

The preferred INK qualification unit is a **multi-capability exercise**, not one atomic feature per test.

A representative grouping is:

```text
1. document / grounding / targeting
2. shape + path creation/edit
3. text + typography
4. transform + layer/group/frame hierarchy
5. boolean + repeat
6. layout + align/snap/constraints
7. SVG/reference intake + reconstruction
8. drawing/brush/stroke
9. library/reuse
10. Preview/compare/self-correction
11. History/Revision/provenance
12. export/output + multi-step closed loop
```

The exact final grouping may be reduced further if one exercise covers several groups with measurable evidence.

No product mutation is authorized by this plan.

Current implementation authority remains:
`ACTIVE/INK_CURRENT_WORK_ORDER.md`.
