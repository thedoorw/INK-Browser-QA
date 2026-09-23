# INK CORE-MOD-007 — Research → Creation Bridge Module v0.1 Report

STATUS: SOURCE_READY / DEV_HANDOFF

## 1. Scope

Task: `CORE-MOD-007 — Research → Creation Bridge Module v0.1`

Branch: `work/ink-core-research-creation-007`

This workpack adds a deterministic, browser-local Research → Creation bridge module. It normalizes explicit research/reference evidence into evidence-backed visual principles, translates those principles into bounded advisory creative constraints, supports explicit-only Creative Memory promotion candidates, and exposes a bounded CHAT-readable advisory context.

Research material remains evidence only. The module does not fetch sources, execute edits, approve plans, mutate INK documents, or create a second research database/backend.

## 2. Implementation

Primary module:

- `product/source/src/research/research-creation-bridge.js`

Deterministic/source QA:

- `qa/core-mod-007-research-creation.test.mjs`

Implemented contracts:

1. Research evidence normalization with stable IDs/fingerprints.
2. Required evidence classes:
   - `VISUAL_REFERENCE`
   - `ARTWORK_DESIGN_EXAMPLE`
   - `TECHNIQUE_PROCESS_NOTE`
   - `COMPOSITION_OBSERVATION`
   - `GEOMETRY_OBSERVATION`
   - `PALETTE_COLOR_OBSERVATION`
   - `LINE_STROKE_OBSERVATION`
   - `MATERIAL_SURFACE_OBSERVATION`
   - `EXPLICIT_USER_RESEARCH_NOTE`
3. Evidence records preserve source identity/type, bounded observation text, structured attributes, confidence/evidence strength, tags, related refs, unresolved state and provenance linkage.
4. Visual-principle normalization with required categories:
   - `GEOMETRY`
   - `COMPOSITION`
   - `SHAPE_VOCABULARY`
   - `LINE_BEHAVIOR`
   - `COLOR_LOGIC`
   - `MATERIAL_TREATMENT`
   - `SPACING_RHYTHM`
   - `HIERARCHY`
   - `REPETITION_VARIATION`
   - `METHOD`
5. Principle support is explicit: supporting evidence IDs must resolve; unsupported evidence refs are rejected rather than inferred.
6. Unresolved and contradictory evidence remains explicit in principle state and traceability.
7. Principle → creative-constraint bridge for geometry, composition, palette/color, line/stroke, material, spacing/rhythm, hierarchy, repetition/variation and method guidance.
8. Constraint output is advisory only and rejects command/approval/execution/mutation-shaped payload fields.
9. Compatibility metadata for later Parametric Creative Structure, Creative Memory and grounded CHAT planning.
10. Explicit-only Creative Memory candidate conversion:
    - promotion input must explicitly request promotion;
    - no candidate is auto-written;
    - source evidence IDs and principle fingerprint are preserved;
    - candidate field shape is validated against the existing Creative Memory record contract by QA;
    - accepted/rejected/unresolved disposition remains explicit.
11. Research-creation bundle with deterministic bundle fingerprint.
12. Bounded CHAT-readable advisory context containing selected evidence, principles, constraints, traceability, unresolved/conflicting evidence and explicitly requested Creative Memory candidates.
13. Read-only adapter for bundle/advisory reads.

## 3. Authority boundary

The advisory context declares:

```
role = ADVISORY_READ_ONLY
researchSourceAuthority = EVIDENCE_ONLY
documentWrite = false
historyWrite = false
revisionWrite = false
geometryWrite = false
renderer = false
execution = false
networkRequired = false
creativeMemoryAutoWrite = false
```

The module does not create approval tokens, direct edit commands, document mutations, execution routing, renderer behavior or CHAT tool/UI wiring.

No user profile, personality or psychology inference schema is added.

## 4. Determinism and bounds

The module reuses `stableHash` / `stableStringify` from `product/source/src/core/stable-id.js`.

Equivalent unordered evidence/tag/reference/attribute inputs are canonicalized so stable identity does not depend on insertion order. Evidence, principle, constraint, bundle, Creative Memory candidate and advisory-context fingerprints are deterministic.

Bounds cover evidence/principle/constraint counts, text lengths, list sizes, attributes/parameters, unresolved/conflicting items and final context bytes.

Research observation text is bounded and the module does not persist full source documents/artworks as memory.

## 5. Traceability

The module preserves an explicit chain:

```
research evidence ID + fingerprint
→ principle ID + fingerprint + supporting evidence refs
→ constraint ID + fingerprint + supporting principle refs
→ optional explicit Creative Memory candidate
→ advisory context traceability
```

Missing/contradictory support remains unresolved or conflicting instead of being silently treated as established evidence.

## 6. Creative Memory interoperability

`createCreativeMemoryCandidate(...)` requires explicit `promotion.requested = true`.

The candidate:

- targets the existing `INK-CREATIVE-MEMORY-RECORD` contract;
- preserves evidence refs and the source principle fingerprint;
- sets `autoWrite = false`;
- produces deterministic candidate parity for equivalent inputs;
- does not call a memory persistence/write API.

QA imports the actual existing `normalizeCreativeMemoryRecord` implementation and validates candidate compatibility against it.

## 7. QA evidence

Local exact-source checks:

```
node --check product/source/src/research/research-creation-bridge.js
PASS

node --experimental-default-type=module qa/core-mod-007-research-creation.test.mjs
CORE-MOD-007 research-creation deterministic tests: PASS
```

GitHub-hosted source QA:

- Workflow run: `35806448801`
- Job: `107008277448`
- Runner class: `ubuntu-latest`
- Node: `22`
- Result: `success`
- Workflow-trigger commit: `e9a8c9ebda4c75860ca4d967d754faa9f14cbf24`
- Source checkpoint commit produced after PASS: `b838474feefb7c6eb6c234e6cb86c40be8b3a2cc`

Exact source parity:

```
product/source/src/research/research-creation-bridge.js
Git blob = 74cfd23bc77be74d97561c83e8d6380c826b59bb
local exact-source git hash-object = 74cfd23bc77be74d97561c83e8d6380c826b59bb

qa/core-mod-007-research-creation.test.mjs
Git blob = 3df25fd647a0126d311095b62b5915d76d955c5f
local exact-source git hash-object = 3df25fd647a0126d311095b62b5915d76d955c5f
```

QA covers:

- deterministic evidence IDs/fingerprints;
- deterministic principle fingerprints;
- deterministic constraint normalization;
- required evidence/principle/constraint categories;
- bounded text/list/attribute/output sizes;
- unsupported and contradictory evidence remains explicit;
- evidence → principle and principle → constraint traceability;
- explicit-only Creative Memory promotion;
- Creative Memory candidate parity and existing-contract compatibility;
- no execution-command or approval-token payload;
- no Document / History / Revision / Geometry / Renderer mutation dependency;
- no network dependency;
- no dynamic code execution;
- no user-profile/personality/psychology inference;
- no full-source research document copying;
- `FORMAT_VERSION = 4`.

The task-local source-QA workflow was removed after the successful source checkpoint and is not a product/runtime dependency.

## 8. Runtime disposition

```
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
MODULE_READY ≠ PRODUCT_INTEGRATED
CENTRAL_RUNTIME_QUEUE_MUTATION = 0
```

No Windows Runtime was executed and this module was not added to the active central Runtime Queue.

## 9. Handoff target

```
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
