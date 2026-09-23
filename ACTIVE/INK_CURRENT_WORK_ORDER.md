# INK CURRENT WORK ORDER

STATUS: `CORE-MOD-007 / AUTHORIZED / READY_FOR_DEV`

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `CORE-MOD-007` |
| TITLE | `Research → Creation Bridge Module v0.1` |
| ROLE_OWNER | `MR / CORE MODULE` |
| DEV_WORK_BRANCH | `work/ink-core-research-creation-007` |
| DEV_MODE | `BOUNDED_MODULE_PREPARATION` |
| PRODUCT_UI_MUTATION | `PROHIBITED` |
| DOCUMENT_AUTHORITY_CHANGE | `PROHIBITED` |
| HISTORY_AUTHORITY_CHANGE | `PROHIBITED` |
| REVISION_AUTHORITY_CHANGE | `PROHIBITED` |
| GEOMETRY_AUTHORITY_CHANGE | `PROHIBITED` |
| RENDERER_AUTHORITY_CHANGE | `PROHIBITED` |
| CHAT_EXECUTION_AUTHORITY_CHANGE | `PROHIBITED` |
| RESEARCH_SOURCE_AUTHORITY | `EVIDENCE_ONLY` |
| FORMAT_VERSION | `4 / PRESERVE` |
| PACKAGE_INK_CURRENT_MUTATION | `PROHIBITED` |
| NETWORK_REQUIRED | `0` |
| RUNTIME_QA | `DEFERRED_TO_INTEGRATION_BATCH` |
| MAIN_MERGE | `PROHIBITED_BY_DEV` |

## Product position

This is Stage G of the AI Drawing Studio roadmap.

Upstream available foundations:

- grounded document / region / provenance context;
- visual comparison;
- parametric structure;
- grounded decision → editable plan bridge;
- Creative Memory module.

The purpose is to convert explicit research/reference evidence into bounded creative principles and machine-usable constraints without turning research material into direct execution authority.

## Objective

Target flow:

```text
research / references
→ normalized research evidence
→ extracted visual principles
→ creative constraints / methods
→ compatibility with Creative Memory / Parametric / CHAT planning
→ later bounded creative operations
```

This task stops before product integration or execution.

## Required reads

1. `README.md`
2. `AGENTS.md`
3. this Work Order
4. `working/WORKING_STATUS.md`
5. branch-local `ACTIVE/INK_DEV_PROGRESS.md`
6. `product/source/src/memory/creative-memory.js`
7. `product/source/src/ai/creative-intelligence-context.js`
8. `product/source/src/ai/grounded-creative-decision.js`
9. Parametric Creative Structure module + QA
10. Visual Compare module + QA
11. Revision / Provenance module + QA

## Phase A — research evidence contract

Define a bounded deterministic representation for research inputs.

Required evidence classes should support at least:

- visual reference;
- artwork / design example;
- technique / process note;
- composition observation;
- geometry observation;
- palette / color observation;
- line / stroke observation;
- material / surface observation;
- explicit user research note.

Required fields:

- stable evidence ID / fingerprint;
- source identity;
- source type;
- optional title/label;
- bounded observation text;
- optional structured attributes;
- explicit confidence/evidence strength;
- tags;
- related source/reference IDs;
- unresolved state;
- provenance/source linkage where available.

Do not ingest arbitrary remote URLs or fetch network content in this module.

Gate: `RESEARCH_EVIDENCE_CONTRACT_DEFINED`

## Phase B — principle extraction contract

Normalize research evidence into explicit visual/creative principles.

Initial principle categories should cover at least:

```text
GEOMETRY
COMPOSITION
SHAPE_VOCABULARY
LINE_BEHAVIOR
COLOR_LOGIC
MATERIAL_TREATMENT
SPACING_RHYTHM
HIERARCHY
REPETITION_VARIATION
METHOD
```

Each principle must preserve:

- supporting evidence refs;
- statement;
- applicability scope;
- confidence/evidence strength;
- assumptions;
- unresolved/contradictory evidence;
- deterministic fingerprint.

No principle may be inferred from unsupported source material.

Gate: `RESEARCH_PRINCIPLE_EXTRACTION_CONTRACT_DEFINED`

## Phase C — creative constraint bridge

Translate principles into bounded advisory creative constraints.

Required constraint classes should support at least:

- geometry constraints;
- composition constraints;
- palette/color constraints;
- line/stroke constraints;
- material constraints;
- spacing/rhythm constraints;
- hierarchy constraints;
- repetition/variation constraints;
- method guidance.

Constraints must be advisory descriptions/parameters, not execution commands.

Where structurally appropriate, the output should be representable for later use by:

- Parametric Creative Structure;
- Creative Memory;
- grounded CHAT planning.

Do not generate approval tokens, commands or direct document mutations.

Gate: `RESEARCH_TO_CREATIVE_CONSTRAINT_BRIDGE_WORKS`

## Phase D — Creative Memory interoperability

Provide deterministic conversion/adaptation where a validated research principle is explicitly promoted into reusable Creative Memory.

Rules:

- do not auto-save every research principle as memory;
- explicit promotion input is required;
- preserve source evidence IDs and principle fingerprint;
- Creative Memory remains the target record contract;
- accepted/rejected/unresolved disposition must remain explicit;
- equivalent evidence/principle input must produce deterministic memory candidates.

Gate: `RESEARCH_CREATIVE_MEMORY_INTEROP_READY`

## Phase E — CHAT-readable advisory context

Expose a bounded read-only context suitable for later integration with grounded CHAT reasoning.

Must include:

- selected research evidence;
- derived principles;
- derived creative constraints;
- unresolved/conflicting evidence;
- related Creative Memory candidates/references where explicitly requested;
- deterministic context fingerprint;
- explicit authority metadata.

Authority must state:

```text
ADVISORY_READ_ONLY
DOCUMENT_WRITE = 0
HISTORY_WRITE = 0
REVISION_WRITE = 0
GEOMETRY_WRITE = 0
RENDERER = 0
EXECUTION = 0
NETWORK_REQUIRED = 0
```

Do not wire a CHAT tool or UI in this module task.

Gate: `RESEARCH_CREATION_ADVISORY_CONTEXT_READY`

## Phase F — deterministic/source QA

At minimum verify:

- deterministic evidence IDs/fingerprints;
- deterministic principle fingerprints;
- deterministic constraint normalization;
- bounded text/list/attribute/output sizes;
- unsupported/contradictory evidence remains explicit;
- evidence→principle traceability;
- principle→constraint traceability;
- explicit-only promotion to Creative Memory;
- Creative Memory candidate parity for equivalent inputs;
- no execution command creation;
- no approval token creation;
- no Document / History / Revision / Geometry / Renderer mutation;
- no network dependency;
- no dynamic code execution;
- no user-profile/personality inference;
- no silent copyright/full-source content copying into memory;
- `FORMAT_VERSION = 4`.

Gate: `CORE_MOD_007_SOURCE_READY`

## Runtime disposition

This is module preparation only.

```text
MODULE_READY ≠ PRODUCT_INTEGRATED
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
```

Do not add this module to the active central Runtime Queue yet.

## Hard boundaries

Do not:

- fetch or scrape remote research sources;
- store full copyrighted source documents/artworks as memory;
- create a second research database/backend;
- create embeddings/vector DB requirements in v0.1;
- auto-convert all research into Creative Memory;
- infer user personality or psychology;
- create direct INK edit commands;
- auto-approve or auto-execute;
- alter Document / History / Revision / Geometry / Renderer authority;
- redesign UI;
- change FORMAT_VERSION;
- mutate package/ink-current.

## Required report

`research/INK_CORE_MOD_007_RESEARCH_CREATION_BRIDGE_REPORT_v0.1.md`

## Completion

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-007
BRANCH = work/ink-core-research-creation-007
GATE = CORE_MOD_007_SOURCE_READY
MODULE_STATE = MODULE_READY
RESEARCH_SOURCE_AUTHORITY = EVIDENCE_ONLY
CREATIVE_MEMORY_AUTO_WRITE = 0
AUTO_APPROVAL = 0
AUTO_EXECUTION = 0
UI_MUTATION = 0
DOCUMENT_AUTHORITY_CHANGE = 0
HISTORY_AUTHORITY_CHANGE = 0
REVISION_AUTHORITY_CHANGE = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_AUTHORITY_CHANGE = 0
CHAT_EXECUTION_AUTHORITY_CHANGE = 0
NETWORK_REQUIRED = 0
USER_PROFILE_INFERENCE = 0
FORMAT_VERSION = 4
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
