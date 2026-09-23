# INK CURRENT WORK ORDER

STATUS: CORE-MOD-006 / AUTHORIZED / READY_FOR_DEV

## Control

| Field | Value |
|---|---|
| CURRENT_TASK_ID | CORE-MOD-006 |
| TITLE | Style / Method / Creative Memory Module v0.1 |
| ROLE_OWNER | MR / CORE MODULE |
| DEV_WORK_BRANCH | work/ink-core-creative-memory-006 |
| DEV_MODE | BOUNDED_MODULE_PREPARATION |
| PRODUCT_UI_MUTATION | PROHIBITED |
| DOCUMENT_AUTHORITY_CHANGE | PROHIBITED |
| HISTORY_AUTHORITY_CHANGE | PROHIBITED |
| REVISION_AUTHORITY_CHANGE | PROHIBITED |
| GEOMETRY_AUTHORITY_CHANGE | PROHIBITED |
| RENDERER_AUTHORITY_CHANGE | PROHIBITED |
| CHAT_EXECUTION_AUTHORITY_CHANGE | PROHIBITED |
| FORMAT_VERSION | 4 / PRESERVE |
| PACKAGE_INK_CURRENT_MUTATION | PROHIBITED |
| RUNTIME_QA | DEFERRED_TO_INTEGRATION_BATCH |
| MAIN_MERGE | PROHIBITED_BY_DEV |

## Product position

This is the first module in the higher-level creative-intelligence layer after the grounded planning bridge.

It must capture reusable creative knowledge from actual INK evidence without becoming a speculative ontology or a second document/history system.

Target domains:

- shape vocabulary;
- composition rules;
- line/stroke behavior;
- material treatment;
- color logic;
- accepted approaches;
- rejected approaches;
- project-level creative decisions;
- method records tied to revisions / provenance / outcomes.

## Objective

Create one deterministic browser-local Creative Memory module that can normalize, store, query and compare reusable creative-method records while preserving existing INK authorities.

Target flow:

~~~
Revision / provenance / grounded decision evidence
→ bounded creative-memory record
→ deterministic identity
→ project-level memory collection
→ query / filter / compare
→ CHAT-readable advisory context
~~~

No memory record may mutate artwork by itself.

## Required reads

1. README.md
2. AGENTS.md
3. this Work Order
4. working/WORKING_STATUS.md
5. branch-local ACTIVE/INK_DEV_PROGRESS.md
6. existing Revision / Provenance module and QA
7. existing Visual Compare / Variant module where comparison patterns are useful
8. product/source/src/ai/creative-intelligence-context.js
9. product/source/src/ai/grounded-creative-decision.js
10. existing stable hash / deterministic serialization utilities

## Phase A — memory record contract

Define a bounded deterministic record schema for one creative-method memory.

Required semantic fields:

- stable record ID / fingerprint;
- project/document scope;
- memory category;
- concise title/label;
- source evidence references;
- related revision/provenance IDs where available;
- optional related object/region IDs;
- method/rule statement;
- structured attributes where applicable;
- outcome / disposition;
- confidence / evidence strength;
- tags / vocabulary terms;
- accepted / rejected / unresolved state;
- created-from source identity, not wall-clock identity;
- bounded notes.

Initial category set should cover at least:

~~~
SHAPE_VOCABULARY
COMPOSITION_RULE
LINE_BEHAVIOR
MATERIAL_TREATMENT
COLOR_LOGIC
METHOD
CREATIVE_DECISION
APPROACH_RESULT
~~~

Do not create user-profile/personality inference fields.

Gate: CREATIVE_MEMORY_RECORD_CONTRACT_DEFINED

## Phase B — deterministic collection / query

Implement browser-local pure-module behavior for:

- normalize;
- validate;
- add / deduplicate;
- replace only when explicitly same stable record identity and valid;
- list/filter by category, tags, scope, disposition, related revision;
- compare records deterministically;
- derive bounded summary/context for CHAT;
- deterministic serialization order;
- bounded collection size / output size;
- explicit unresolved evidence.

The module must not depend on network or remote AI.

Gate: CREATIVE_MEMORY_COLLECTION_WORKS

## Phase C — evidence binding

Bind memory records to existing evidence structures without replacing them.

Required direction:

~~~
Revision / Provenance / Grounded Decision
→ references inside memory
~~~

Rules:

- Revision remains authoritative for document state;
- Provenance remains authoritative for lineage;
- Grounded Decision remains authoritative for decision evidence;
- Creative Memory stores reusable interpretation/method records only;
- missing referenced evidence must remain explicit rather than fabricated;
- memory creation from evidence must be deterministic for equivalent inputs.

Gate: CREATIVE_MEMORY_EVIDENCE_BINDING_WORKS

## Phase D — CHAT-readable advisory bridge

Expose a bounded read-only context/adapter suitable for later CHAT integration.

Must provide:

- selected memory records;
- summarized method/rule vocabulary;
- accepted/rejected approach evidence;
- related revision/provenance references;
- unresolved/missing evidence;
- deterministic context fingerprint.

Authority:

~~~
ADVISORY_READ_ONLY
DOCUMENT_WRITE = 0
HISTORY_WRITE = 0
REVISION_WRITE = 0
EXECUTION = 0
~~~

Do not wire a new CHAT tool or UI in this module-preparation task.

Gate: CREATIVE_MEMORY_ADVISORY_CONTEXT_READY

## Phase E — deterministic/source QA

At minimum verify:

- equivalent inputs produce identical record IDs/fingerprints;
- category validation;
- bounded strings/lists/collection sizes;
- deduplication;
- explicit replacement semantics;
- query/filter determinism;
- stable serialization;
- accepted/rejected/unresolved states preserved;
- revision/provenance/decision references preserved;
- missing references stay unresolved;
- advisory context is deterministic and bounded;
- no Document / History / Revision / Geometry / Renderer mutation;
- no network requirement;
- no dynamic code execution;
- no user-profile/personality inference schema;
- FORMAT_VERSION = 4.

Gate: CORE_MOD_006_SOURCE_READY

## Runtime disposition

This is module preparation only.

~~~
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
MODULE_READY ≠ PRODUCT_INTEGRATED
~~~

Do not add it to the active central Runtime Queue until MR later issues an integration Work Order.

## Hard boundaries

Do not:

- redesign UI;
- create a second Revision / History / Provenance authority;
- infer user personality, psychology or private preferences;
- auto-learn from every action without an explicit bounded memory-creation input;
- add embeddings/vector DB/backend requirements in v0.1;
- require network;
- make memory itself execute edits;
- begin Research→Creation Bridge;
- change FORMAT_VERSION;
- mutate package/ink-current.

## Required report

research/INK_CORE_MOD_006_CREATIVE_MEMORY_REPORT_v0.1.md

## Completion

~~~
TASK_STATUS = DEV_HANDOFF
TASK_ID = CORE-MOD-006
BRANCH = work/ink-core-creative-memory-006
GATE = CORE_MOD_006_SOURCE_READY
MODULE_STATE = MODULE_READY
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
~~~
