# INK External Workflow Translation R&D v0.1

STATUS: `RESEARCH / PHASE_1 ARCHITECTURE PROPOSAL`

DATE: 2026-10-01

PROGRAM_CANDIDATE: `INK-EXTERNAL-WORKFLOW-TRANSLATION-001`

SOURCE_REPO: `thedoorw/INK-Browser-QA`

PRODUCT_SOURCE_MUTATION: `0`

PRIMARY_QUESTION:

> Is a general `External Actions / Recipes / Skills / Workflows / Scripts -> INK Recipe` translation architecture technically valid, and what is the minimum viable Workflow IR?

---

## 1. Executive conclusion

Yes. The architecture is valid.

The important architectural decision is that INK should **not** build one importer per vendor directly into Recipe execution.

The durable shape is:

```text
External source
→ Source Adapter / Extractor
→ Workflow IR
→ INK Capability Resolver
→ Translation Classification
→ INK Recipe Compiler
→ C55 Recipe execution / replay / edit
→ trial / preview / report
```

The Workflow IR is the isolation layer.

It separates:

1. how an external workflow is represented;
2. what the workflow means;
3. whether INK has an equivalent capability;
4. how the equivalent INK Recipe should execute.

This is a natural extension of existing C56 Program Import and should use C55 Recipe as its execution target.

The first implementation should explicitly prefer **readable workflow sources** over binary parsing.

Priority order:

```text
plain-text skill / script / exported action text
→ structured API / connector schema
→ inspectable node/workflow description
→ semantically reconstructed documented workflow
→ opaque binary only later, if justified
```

A Photoshop `.atn` parser is therefore not required for Phase 1.

---

## 2. Existing INK authority boundary

The current capability baseline already separates the two responsibilities correctly.

### C55 — Recipe / automation

Current responsibilities include:

- Recipe execute;
- Recipe replay;
- Recipe edit;
- operation recording;
- expression evaluation;
- role mapping/schema;
- condition control;
- repeat-over control;
- local replay;
- resume;
- breakpoint;
- step-by-step;
- rollback;
- cancel;
- deterministic replay;
- replay diff;
- Recipe report.

Therefore C55 is the **native workflow runtime and editable automation format**.

### C56 — Program Import

Current responsibilities include:

- detect program format;
- translate to canonical operations;
- compile translated program;
- trial run;
- step run;
- breakpoint;
- safety mode;
- issues / coverage preview;
- before / after comparison;
- save translated Recipe;
- save import report;
- attach import result to document;
- reference package;
- manual reference-run kit;
- external reference runner.

Therefore C56 is the correct home for **external workflow ingestion and translation**.

Current baseline also explicitly states:

- text/script formats may proceed through parser/compilation paths;
- opaque binary formats such as Photoshop Action currently have metadata-only handling;
- binary operations are rejected for full translation;
- detection is not mature translation.

This R&D therefore does not replace C55 or C56. It defines the missing generalized semantic bridge between them.

---

## 3. External Workflow Translation architecture

### 3.1 Pipeline

```text
A. SOURCE ACQUISITION
   ↓
B. SOURCE-SPECIFIC ADAPTER
   ↓
C. NORMALIZED WORKFLOW IR
   ↓
D. INK CAPABILITY RESOLUTION
   ↓
E. TRANSLATION CLASSIFICATION
   ↓
F. INK RECIPE COMPILATION
   ↓
G. C55 VALIDATION / TRIAL / REPLAY
   ↓
H. IMPORT REPORT + PROVENANCE
```

### A. Source acquisition

Acquire the most readable available representation.

Examples:

- Figma Agent Skill Markdown;
- Figma Weave published tool input/output contract;
- manually supplied or exported Weave workflow structure;
- Photoshop Action text export;
- Photoshop UXP / actionJSON / JavaScript;
- Canva Brand Template dataset;
- Canva Design dataset;
- Canva Bulk Create field mapping;
- documented multi-step Canva procedure;
- ordinary JSON / XML / JavaScript / Python / text workflows.

### B. Source-specific adapter

Each adapter converts source terminology into source-neutral concepts.

The adapter should not know INK implementation details.

Example:

```text
Photoshop "Image Size"
→ IR operation: resize_image

Canva autofill field "Headline"
→ IR operation: set_field_value

Figma skill instruction "duplicate selected frame"
→ IR operation: duplicate_object
```

### C. Workflow IR

The IR stores workflow meaning without vendor-specific syntax.

### D. INK capability resolver

Resolve each IR step against:

1. INK family;
2. atomic capability;
3. target semantics;
4. parameter compatibility;
5. CHAT exposure when relevant.

Example:

```text
resize_image
→ C22 Raster / Image objects
→ Resize image
```

### E. Translation classification

Every step receives one of:

- `DIRECT_TRANSLATION`
- `SEMANTIC_TRANSLATION`
- `PARTIAL`
- `UNSUPPORTED`
- `FORMAT_BLOCKED`

### F. Recipe compilation

Only translatable steps compile to the native INK Recipe model.

Unsupported content remains preserved in the import report and IR.

### G. Trial / replay

Use existing C56 trial/step/safety behavior and C55 Recipe runtime.

### H. Report

Persist:

- source identity;
- source representation used;
- IR;
- mappings;
- unsupported steps;
- assumptions;
- generated Recipe;
- translation coverage;
- replay result.

---

## 4. Source readability model

A separate `source_readability` classification is useful because translation failure and source-access failure are different problems.

Recommended values:

```text
STRUCTURED_READABLE
TEXT_READABLE
VISUALLY_INSPECTABLE
CONTRACT_ONLY
SEMANTIC_RECONSTRUCTION
OPAQUE_BINARY
```

Meaning:

- `STRUCTURED_READABLE` — machine-readable structured operations or fields.
- `TEXT_READABLE` — markdown/script/text listing.
- `VISUALLY_INSPECTABLE` — steps visible in UI or screenshots but not exported structurally.
- `CONTRACT_ONLY` — inputs/outputs visible, internal workflow not exposed.
- `SEMANTIC_RECONSTRUCTION` — only documented procedure is available.
- `OPAQUE_BINARY` — source operations cannot be safely read without a dedicated binary parser.

This avoids incorrectly labeling a readable-but-unsupported operation as `FORMAT_BLOCKED`.

---

## 5. Workflow IR v0.1

### 5.1 Minimum object

```json
{
  "workflow_ir_version": "0.1",
  "source": {
    "ecosystem": "photoshop",
    "source_type": "action_text",
    "source_id": "optional-stable-id",
    "source_readability": "TEXT_READABLE"
  },
  "inputs": [],
  "steps": [],
  "outputs": []
}
```

### 5.2 Minimum step

```json
{
  "id": "step-001",
  "operation": "resize_image",
  "target": {
    "selector": "active_image",
    "role": null
  },
  "parameters": {
    "width": 1080,
    "unit": "px"
  },
  "order": 1,
  "condition": null,
  "repeat": null,
  "dependency": [],
  "input": ["source-image"],
  "output": ["resized-image"],
  "translation": {
    "status": "DIRECT_TRANSLATION",
    "ink_family": "C22",
    "ink_capability": "Resize image"
  },
  "unsupported_step": null
}
```

### 5.3 Required semantic fields

The Phase-1 IR should contain exactly the requested semantic core:

| Field | Purpose |
|---|---|
| `operation` | normalized verb / transformation |
| `target` | object, layer, page, selection, role, active document, dataset field, etc. |
| `parameters` | explicit values needed to perform the operation |
| `order` | stable execution sequence |
| `condition` | optional predicate and then/else routing |
| `repeat` | optional loop / repeat-over description |
| `dependency` | explicit prior-step or object dependency |
| `input` | consumed artifact/data refs |
| `output` | produced artifact/data refs |
| `unsupported_step` | preserved source step when no safe translation exists |

### 5.4 Recommended supporting fields

These are small but important additions:

- `id`
- `source_ref`
- `notes`
- `translation.status`
- `translation.ink_family`
- `translation.ink_capability`
- `translation.confidence`
- `translation.assumptions`

They make the IR debuggable without turning it into a large compiler AST.

### 5.5 What should not enter IR v0.1

Do not add yet:

- vendor-specific binary structures;
- byte offsets;
- exhaustive UI events;
- mouse coordinates unless semantically essential;
- complete expression language;
- renderer internals;
- embedded asset binary payloads;
- vendor authentication details.

IR v0.1 should represent **creative operation semantics**, not every implementation detail.

---

## 6. Translation classes

### DIRECT_TRANSLATION

Definition:

> External operation has a clear native INK capability with equivalent target and parameter semantics.

Example shape:

```text
Photoshop resize image
→ INK Resize image
```

### SEMANTIC_TRANSLATION

Definition:

> INK can reproduce the intended result, but with a different primitive, different structure, or multiple native steps.

Example shape:

```text
Canva template autofill
→ duplicate page + update text/image roles + export
```

### PARTIAL

Definition:

> Only part of the external workflow can be translated.

The untranslated steps must remain explicitly recorded.

### UNSUPPORTED

Definition:

> Source is readable, but INK does not currently own the required capability.

### FORMAT_BLOCKED

Definition:

> The source operation cannot be recovered with sufficient reliability from the available representation.

This is an acquisition/representation failure, not an INK feature gap.

### Workflow-level aggregation

Recommended rule:

```text
all steps DIRECT
→ DIRECT_TRANSLATION

all steps translatable, at least one SEMANTIC
→ SEMANTIC_TRANSLATION

some steps translated + some unsupported
→ PARTIAL

readable workflow + no meaningful steps map
→ UNSUPPORTED

workflow body inaccessible / opaque
→ FORMAT_BLOCKED
```

---

## 7. Three-source comparison matrix

| Source | What is fundamentally reusable | What CHAT can currently obtain or can be given | Control flow | Parameters | Current best translation mode | Main boundary |
|---|---|---|---|---|---|---|
| Figma Agent Skill | reusable agent instructions | Skill Markdown when supplied/exported/copied; Figma documentation confirms skills are Markdown | instructions can encode sequence, branches and conventions in prose | readable as text when explicitly written | DIRECT or SEMANTIC | natural language may omit exact values or rely on agent judgment |
| Figma Weave Workflow | node-based graph with connected inputs, models, edits and outputs | current ChatGPT Figma connection can enumerate published Weave tools and inspect their input/output contract; official product UI allows users to open, duplicate and inspect the underlying workflow | graph supports branching and reusable pipeline structure | model/tool settings exist in nodes | PARTIAL today unless workflow graph is supplied | current CHAT connection does not expose the full internal node graph as a read API |
| Photoshop Action | ordered recorded action steps | Actions panel exposes steps; Photoshop officially supports exporting an action set to a human-readable text file; `.atn` remains binary | ordered sequence; conditional actions; stops; nested actions | many recorded command settings are inspectable | DIRECT / SEMANTIC from text; FORMAT_BLOCKED for binary-only input | `.atn` binary is intentionally outside Phase 1 |
| Photoshop UXP / actionJSON | textual action descriptors | readable JavaScript/JSON when supplied | arbitrary script logic | explicit structured parameters | DIRECT / SEMANTIC | descriptor vocabulary may contain Photoshop-only operations |
| Canva reusable template | reusable layout + tagged replaceable fields | current ChatGPT Canva connection can inspect design metadata/pages/text and Brand Template or Design datasets | template reuse itself is declarative rather than recorded procedural history | field names/types are structured | DIRECT / SEMANTIC | template layout logic is not a general workflow graph |
| Canva Autofill | dataset → tagged fields → generated/updated design | dataset schema and autofill operation are directly available | deterministic data application | explicit text/image/video/chart fields | DIRECT or SEMANTIC | no generic macro history |
| Canva Bulk Create / multi-step procedure | repeat dataset rows over template | official workflow documents row/column field mapping, preview and output generation | explicit repeat-over rows | structured data columns and field connections | SEMANTIC | procedure is reconstructed from workflow semantics rather than imported as a native macro |

---

## 8. Figma findings

### 8.1 Skills

Figma's current official documentation defines custom skills as Markdown files containing reusable instructions for the agent.

This makes Skills the cleanest source for Phase 1.

Potential extraction:

```text
skill trigger
→ prerequisite context
→ ordered instructions
→ named tools/actions
→ conditions
→ repeated checks
→ expected output
```

Because they are text, no binary parser is required.

Risk:

A Skill may describe outcome-oriented instructions such as "polish the layout" rather than atomic actions. Those steps require semantic expansion and should be labeled `SEMANTIC_TRANSLATION`, not falsely treated as direct commands.

### 8.2 Weave

Figma Weave is a node-based creative workflow system.

Official documentation confirms that workflows can be inspected, duplicated, edited, reused and published as tools.

Current ChatGPT connectivity can access published Weave tools sufficiently to know:

- available published tool;
- input contract;
- output contract;
- run result.

However, the current connection does not expose the complete underlying workflow graph as a general read surface.

Therefore:

```text
published tool contract only
→ PARTIAL source evidence

user-supplied / exported / otherwise readable workflow graph
→ eligible for full IR translation
```

This distinction is important: the Weave architecture strongly validates the idea of a Workflow IR, but the present connector surface does not yet make Weave the easiest first importer.

---

## 9. Photoshop findings

Photoshop Actions are directly relevant because they are ordered, reusable creative programs.

Adobe documentation confirms:

- actions record sequences of tasks;
- actions can be edited step by step;
- actions can contain conditional actions;
- actions can contain stops for non-recordable/manual work;
- action sets are normally saved as `.atn`;
- Photoshop also provides a modifier-key path to save Actions as a text file for review/printing;
- that text file cannot be loaded back into Photoshop.

That text export is ideal for Phase 1.

It provides a vendor-supported readable representation without reverse-engineering `.atn`.

Therefore the preferred Phase-1 source path is:

```text
Photoshop Action
→ official text export
→ Action Text Adapter
→ Workflow IR
→ INK capability mapping
→ INK Recipe
```

Later, UXP `actionJSON` is also attractive because Adobe documents it as textual action descriptors.

Binary `.atn` parsing remains deferred.

---

## 10. Canva findings

Canva is structurally different.

Its strongest reusable-workflow surfaces are:

- reusable templates;
- Brand Templates;
- Autofill;
- Bulk Create;
- repeatable generation from structured data;
- current design/template datasets.

Official Canva APIs expose:

- Brand Template dataset field names and types;
- Design dataset field names and types;
- design autofill jobs;
- creation from template/design;
- update-in-place modes.

The current ChatGPT Canva connection likewise exposes the relevant dataset and autofill surfaces.

This means Canva's best translation unit is usually not a recorded macro.

It is:

```text
template structure
+ input schema
+ field mapping
+ repeat policy
+ output policy
```

For Workflow IR:

```text
row iteration
→ repeat

field binding
→ target + input

field value
→ parameters

generated design/page
→ output
```

This is a strong test for semantic translation because INK may implement the same intent using pages, roles, text/image replacement and Recipe repeat-over instead of a native "Bulk Create" primitive.

---

## 11. INK Recipe mapping model

Recommended mapping chain:

```text
IR operation
→ normalized operation vocabulary
→ INK family
→ INK atomic capability
→ target resolver
→ parameter adapter
→ Recipe step
```

Example:

```text
IR:
operation = resize_image
target = active_image
parameters.width = 1080px

Resolver:
C22 Raster / Image objects
Atomic = Resize image

Compiler:
native INK Recipe step
```

### 11.1 Supporting families

Although C55/C56 are the primary owners, other current families support translation:

- C54 Recompute — dependency-aware recomputation;
- C57 CHAT control — proposal / plan / execution / preview;
- C58 Semantic grounding — target and role resolution;
- C43 History — reversible execution;
- C44 Revision — stable checkpoints;
- C45 Provenance — source → operation → revision lineage;
- C46 Compare / Variant — before/after and translated-result comparison.

These should be consumed, not duplicated.

---

## 12. C55 versus C56 ownership

### Belongs to C56 Program Import

- source-format detection;
- source readability classification;
- source adapter selection;
- source extraction;
- normalization into Workflow IR;
- external-operation vocabulary;
- capability resolution;
- translation classification;
- unsupported-step preservation;
- mapping report;
- coverage report;
- source provenance;
- Recipe generation from IR;
- save translated Recipe;
- import report;
- trial/safety orchestration.

### Belongs to C55 Recipe

- final native Recipe schema;
- Recipe editing;
- Recipe execution;
- Recipe replay;
- conditions;
- repeats;
- expression evaluation;
- roles;
- breakpoints;
- resume;
- rollback;
- deterministic replay;
- replay diff;
- Recipe report.

### Boundary rule

```text
C56 answers:
"What does this external workflow mean, and how much of it can INK translate?"

C55 answers:
"How does the resulting native INK workflow execute, replay and remain editable?"
```

---

## 13. Minimal proof-of-concept specification

### POC name

`EWT-POC-001 — Photoshop Action Text → Workflow IR → INK Recipe`

### Why this case

It validates the architecture while obeying the Phase-1 constraint:

- readable workflow;
- no binary parser;
- official source representation;
- ordered steps;
- explicit parameters;
- direct capability mapping;
- deterministic expected result.

### Source

A Photoshop Action exported using Photoshop's official text-export path.

### Minimal action

```text
1. Resize active image to width 1080 px.
2. Apply Hue/Saturation adjustment: Saturation +10.
3. Export as PNG.
```

### Expected IR

```text
step-001
operation = resize_image
target = active_image
parameters = { width: 1080, unit: px }
translation = DIRECT_TRANSLATION
INK = C22 / Resize image

step-002
operation = adjust_hue_saturation
target = active_image
parameters = { saturation: +10 }
dependency = [step-001]
translation = DIRECT_TRANSLATION
INK = C24 / Hue-Saturation

step-003
operation = export
target = active_document
parameters = { format: PNG }
dependency = [step-002]
translation = DIRECT_TRANSLATION
INK = C53 / PNG export
```

### Required POC outputs

1. source fixture;
2. parsed source representation;
3. Workflow IR JSON;
4. capability-mapping report;
5. generated INK Recipe;
6. trial-run report;
7. replay report;
8. before/after preview;
9. translation coverage = 3/3;
10. deterministic replay comparison.

### POC acceptance

```text
SOURCE_READABLE = PASS
IR_ROUNDTRIP = PASS
MAPPING = 3 / 3
UNSUPPORTED = 0
RECIPE_GENERATED = PASS
RECIPE_EDITABLE = PASS
REPLAY = PASS
FINAL_OUTPUT_INSPECTABLE = PASS
```

This proves the architecture without proving every vendor format.

---

## 14. Why not start with Weave or Canva as the first PoC

### Weave

The conceptual fit is excellent, but the current ChatGPT-accessible Weave surface is stronger for running a published tool than for retrieving the entire underlying node graph.

Therefore it is better as a Phase-2 adapter test unless a readable workflow export/representation is supplied.

### Canva

Canva is highly suitable for a second PoC because it stresses:

- schema inputs;
- role/field mapping;
- repeat-over;
- generated variants.

However it is semantically farther from a direct command sequence, so it is better after the basic IR→Recipe compiler is proven.

---

## 15. Recommended Phase-1 adapter order

```text
1. Generic plain-text / Markdown workflow adapter
2. Photoshop Action text adapter
3. Script adapter (JSON / JavaScript / Python subset already readable by C56)
4. Figma Skill Markdown adapter
5. Canva dataset/autofill adapter
6. Weave readable graph adapter when graph access/export is available
7. Opaque binary adapters only if later evidence justifies them
```

The first and fourth can probably share much of the same semantic extraction logic.

---

## 16. Risks

### 16.1 Natural-language underspecification

Skills and documented workflows may say:

`make the layout balanced`

That is not an atomic operation.

Mitigation:

- preserve original source text;
- expand semantically;
- mark `SEMANTIC_TRANSLATION`;
- store assumptions.

### 16.2 Target ambiguity

`apply to the title`

requires semantic role resolution.

Mitigation:

Use current C58 semantic grounding rather than inventing a second selector system.

### 16.3 Equivalent output, different implementation

A Canva bulk-variant workflow may map to several INK steps.

Mitigation:

Allow one IR step to compile to multiple Recipe steps while preserving source lineage.

### 16.4 Hidden vendor state

A source workflow may rely on presets, fonts, brushes, assets or external models.

Mitigation:

Represent these as explicit `input` / `dependency` entries and mark absent dependencies.

### 16.5 Non-deterministic AI nodes

Weave AI generation cannot be treated as deterministic merely because the graph is reusable.

Mitigation:

Differentiate workflow replay from pixel-identical output replay.

### 16.6 False support claims

A detected format must not be described as translated merely because a filename/type is recognized.

Mitigation:

Keep:

```text
FORMAT_DETECTED
≠ SOURCE_READABLE
≠ IR_PARSED
≠ CAPABILITY_MAPPED
≠ RECIPE_COMPILED
≠ REPLAY_VERIFIED
```

---

## 17. Program recommendation

Recommendation:

`YES — formalize this as an independent INK R&D program/lane.`

Suggested program:

`INK-EXTERNAL-WORKFLOW-TRANSLATION-001`

It should remain an INK program, not a separate product.

Reason:

This topic has its own:

- source-adapter layer;
- Workflow IR;
- cross-vendor vocabulary;
- translation classifier;
- capability resolver;
- mapping tests;
- provenance requirements;
- format-access boundaries;
- fixture library.

It is too large to remain a single benchmark case inside Creative Reproduction Benchmark.

At the same time, it should not fork the automation runtime.

Architectural boundary:

```text
External Workflow Translation program
= C56-centered translation R&D

C55
= native execution target

Creative Reproduction Benchmark
= consumer / evidence source

INK Runtime
= unchanged in Phase 1
```

---

## 18. Phase-1 decision

```text
TRANSLATION_ARCHITECTURE = VALID

WORKFLOW_IR_V0_1 = APPROVED_FOR_POC_SPEC
BINARY_PARSER_REQUIRED = NO
PHOTOSHOP_ATN_BINARY = DEFER
FIRST_POC = PHOTOSHOP_ACTION_TEXT_TO_INK_RECIPE
C55_ROLE = NATIVE_RECIPE_RUNTIME
C56_ROLE = EXTERNAL_WORKFLOW_TRANSLATION
INDEPENDENT_PROGRAM = RECOMMENDED
PRODUCT_SOURCE_MUTATION = 0
```

---

## 19. Official reference notes

Figma:

- Custom skills for Figma Agent and Figma Make — skills are Markdown reusable instructions:
  https://help.figma.com/hc/en-us/articles/40283639496599-Custom-skills-for-the-Figma-agent-and-Figma-Make
- Use Weave tools in Figma — underlying Weave workflows can be opened, inspected, duplicated and modified:
  https://help.figma.com/hc/en-us/articles/40779260614935-Use-Weave-tools-in-Figma
- Figma Weave overview:
  https://weave.figma.com/

Adobe:

- Photoshop Actions panel — record, edit and play action steps:
  https://helpx.adobe.com/photoshop/desktop/automate-tasks/automation-settings-and-presets/use-the-actions-panel.html
- Photoshop action management — official text export path and `.atn` action sets:
  https://helpx.adobe.com/uk/photoshop/using/playing-actions.html
- Conditional Actions:
  https://helpx.adobe.com/photoshop/using/conditional-actions-creative-cloud.html
- Photoshop UXP batchPlay / textual action descriptors:
  https://developer.adobe.com/photoshop/uxp/2022/ps_reference/media/batchplay/

Canva:

- Autofill overview:
  https://www.canva.dev/docs/apps/rest-apis/reference/autofills/
- Brand Template dataset:
  https://www.canva.dev/docs/apps/rest-apis/reference/brand-templates/get-brand-template-dataset/
- Design dataset:
  https://www.canva.dev/docs/apps/rest-apis/reference/designs/get-design-dataset/
- Create design autofill job:
  https://www.canva.dev/docs/apps/rest-apis/reference/autofills/create-design-autofill-job/
- Bulk Create:
  https://www.canva.com/help/bulk-create/
