# INK CHAT Capability Qualification Plan v0.1

## Status

```text
TYPE = RESEARCH / QUALIFICATION PLAN
AUTHORITY = DIRECTIONAL / DOES NOT AUTHORIZE PRODUCT MUTATION
CURRENT_GATE = GATE_1_CHAT_INK_CAPABILITY_QUALIFICATION
REFERENCE_ECOSYSTEMS = Figma / Penpot / Adobe
CASE_EVIDENCE_SET = 42 QUALIFICATION / SUPPORT CASES
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

The current evidence set contains 42 selected qualification / supporting cases from:

- Figma;
- Penpot;
- Adobe.

The cases are not treated as portfolio works by default. Their first purpose is to show proven operation patterns that can inform qualification planning.

Evidence can include:
- official ChatGPT / Codex / agent examples;
- official MCP / plugin workflows;
- documented tool procedures;
- public hands-on reproductions where the operation path is inspectable;
- official native-tool operating references when an INK capability has no sufficiently specific GPT example.

Native-tool references are marked as supporting evidence only. They may define test steps, but they must not be misrepresented as proof that GPT already performs the same operation.

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

The full product baseline remains larger. Gate 1 was therefore audited against all 64 authoritative capability families in `ACTIVE/INK_CURRENT_CAPABILITY_BASELINE.md`.

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

This prevents a practical CHAT qualification matrix from silently omitting real INK creative capabilities while still keeping renderer/GPU/PWA/platform internals out of a user-facing creative-control test.

The initial 33-test matrix was found to under-cover raster, drawing/media, automation and document lifecycle capabilities. The matrix was expanded before execution rather than discovering those omissions during testing.

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
Baseline Coverage Audit
```

The Sheet is a working analysis surface.

GitHub remains the SSOT for program direction, gate definitions and accepted conclusions.

## 9. Current progress

```text
QUALIFICATION_EVIDENCE_CASES = 42
CASE_COVERAGE_MATRIX = BUILT
COVERAGE_SUMMARY = BUILT
QUALIFICATION_TEST_ROWS = 56
PRACTICAL_COVERAGE_GROUPS = 50
AUTHORITATIVE_BASELINE_FAMILIES = 64
BASELINE_FAMILY_AUDIT = 64 / 64 DISPOSITIONED

COMMON_3 = 17
COMMON_2 = 14
SINGLE_ECOSYSTEM = 15
INK_ONLY = 4

INK execution = NOT STARTED
100+ mature-work expansion = DEFERRED
portfolio reproduction = HOLD
```

Coverage correction made before execution:

- the original vector/layout-heavy set was insufficient against the full INK baseline;
- Document / Pages / Artboard lifecycle was added;
- Raster / full Mask / Adjustment / Filter / Blend / reusable-raster coverage was added;
- Brush Engine / Natural Media / Brush Dynamics / Blender-Smudge / Stroke Editing / Stroke Session / Paper coverage was added;
- High-resolution export / Recompute / Recipe Automation / Program Import / Creative Memory coverage was added;
- Stylus / Calibration is explicitly environment-gated rather than guessed.

External evidence was also strengthened where useful:

- Boolean now has direct Figma + Penpot operation references;
- History / Revision direction now draws from Figma GPT undo/version operations, Penpot undo blocks and Adobe History/snapshots;
- Adobe ChatGPT raster editing provides direct qualification-only evidence for adjustment, targeting, blur, crop and preview workflows;
- Adobe native brush / Mixer Brush / Smart Object / Smart Filter documentation is retained only as supporting operating reference where GPT-specific public examples are insufficient.

Remaining narrow or unique zones are intentional and must not be hidden by adding unrelated cases:

```text
Approval = INK-specific
Provenance = INK-specific
Stroke Session = INK-specific state machine
Paper / Media = INK-specific substrate model
Stylus / Calibration = environment-gated
Layer Effects = partial current product scope
Extraction / Drawing / Revision = external analogues exist but semantics do not fully match INK
Recipe / Program Import / Creative Memory / High-res resume = external analogues only; INK semantics require direct qualification
```

This is a planning-coverage result, not a Runtime qualification result. Broad external overlap does not mean INK has passed the capability.

## 10. Next action

Do not add more mature-work cases merely to increase count.

Next:

```text
review the 50-group coverage map and 64-family disposition
→ prioritize P0 qualification rows
→ execute isolated tests in dependency order
→ record PASS / PARTIAL / BLOCKED / NOT_EXPOSED
→ update coverage conclusion from planned evidence to observed INK behavior
→ only then proceed to combined-task qualification
```

No product mutation is authorized by this plan.

Current implementation authority remains:
`ACTIVE/INK_CURRENT_WORK_ORDER.md`.
