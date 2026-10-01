# INK CHAT Capability Qualification Plan v0.1

## Status

```text
TYPE = RESEARCH / QUALIFICATION PLAN
AUTHORITY = DIRECTIONAL / DOES NOT AUTHORIZE PRODUCT MUTATION
CURRENT_GATE = GATE_1_CHAT_INK_CAPABILITY_QUALIFICATION
REFERENCE_ECOSYSTEMS = Figma / Penpot / Adobe
CASE_EVIDENCE_SET = 33 INITIAL QUALIFICATION CASES
EXECUTION = NOT STARTED
```

## 1. Purpose

Before CHAT attempts mature-work reproduction, INK must first prove that CHAT can discover, target, invoke, verify and revise the practical creative capabilities already present in INK.

The program therefore does not begin by sending CHAT directly into reproduction and discovering direction during execution.

The required order is:

```text
study proven GPT / agent workflows in Figma, Penpot and Adobe
→ extract the operations and sequence used by those workflows
→ map them to INK capability families and CHAT exposure
→ build case × capability coverage
→ identify overlap, unique coverage and untested gaps
→ define qualification tests and PASS criteria
→ execute bounded tests
→ only then begin mature-work reproduction
```

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

The first evidence set contains 33 selected cases from:

- Figma;
- Penpot;
- Adobe.

The cases are not treated as portfolio works by default. Their first purpose is to show proven operation patterns that can inform qualification planning.

Evidence can include:
- official ChatGPT / Codex / agent examples;
- official MCP / plugin workflows;
- documented tool procedures;
- public hands-on reproductions where the operation path is inspectable.

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

Overlap classes:

```text
COMMON_3 = represented by Figma + Penpot + Adobe
COMMON_2 = represented by two ecosystems
SINGLE_ECOSYSTEM = represented by one ecosystem only
INK_ONLY = important INK capability with no useful external analogue yet
OUT_OF_GATE = platform/internal capability not required for creative CHAT qualification
```

The goal is not to make all rows COMMON_3. The goal is to know exactly where evidence is broad, narrow or absent.

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
```

The full product baseline remains larger. Platform, GPU, PWA, diagnostics and other non-creative/internal capabilities are not automatically Gate-1 qualification rows.

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

Working planning artifacts currently live in the connected Google Sheet:

```text
GPT Qualification
INK Qualification Matrix
Case Coverage Matrix
Coverage Summary
```

The Sheet is a working analysis surface.

GitHub remains the SSOT for program direction, gate definitions and accepted conclusions.

## 9. Current progress

```text
33 qualification evidence cases = SELECTED
CASE_COVERAGE_MATRIX = BUILT
COVERAGE_SUMMARY = BUILT
QUALIFICATION_TEST_ROWS = 33
PRACTICAL_COVERAGE_GROUPS = 27

COMMON_3 = 12
COMMON_2 = 9
SINGLE_ECOSYSTEM = 4
INK_ONLY = 2

INK execution = NOT STARTED
100+ mature-work expansion = DEFERRED UNTIL QUALIFICATION DIRECTION IS VISIBLE
portfolio reproduction = HOLD
```

Initial narrow / unique areas established before execution:

- Boolean = Figma-led evidence;
- Extraction / vectorization = Figma-led weak analogue;
- Drawing / Stroke = only weak Adobe brush-region analogue, no strong external creation case yet;
- Mask / Region = Adobe-led evidence;
- Proposal / Explicit Approval = INK-specific;
- Provenance / audit lineage = INK-specific.

This is a planning result, not a runtime qualification result. A broad external overlap does not mean INK has passed that capability.

## 10. Next action

Do not add more mature-work cases merely to increase count.

Next:

```text
review the 27-group coverage map
→ prioritize P0 qualification rows
→ execute isolated tests in dependency order
→ record PASS / PARTIAL / BLOCKED / NOT_EXPOSED
→ update coverage conclusion from planned evidence to observed INK behavior
→ only then proceed to combined-task qualification
```

No product mutation is authorized by this plan.

Current implementation authority remains:
`ACTIVE/INK_CURRENT_WORK_ORDER.md`.
