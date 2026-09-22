# INK CORE-MOD-005 — Parametric Creative Structure Module v0.1

## Task

`CORE-MOD-005 — Parametric Creative Structure Module v0.1`

Branch:

`work/ink-core-parametric-structure-005`

Runtime policy:

`DEFERRED_TO_INTEGRATION_BATCH`

## Result

Implemented a bounded, pure deterministic parametric structure planning module at:

`product/source/src/structure/parametric-structure.js`

The module does not write into the authoritative INK document and does not create a second geometry engine, renderer, History/Revision authority, editor workbench, or UI.

## Contract

Input:

```text
INK-PARAMETRIC-STRUCTURE v1
→ structure identity / optional seed
→ explicit parameter definitions + supplied values
→ node templates / roles / parent refs
→ source object / semantic region / provenance refs
→ affine transform descriptors
→ bounded repetition rules
→ explicit relationships
```

Output:

```text
INK-PARAMETRIC-STRUCTURE-PLAN v1
→ resolved parameter evidence
→ normalized templates
→ deterministic generated-node identities
→ normalized affine matrices
→ parent/relationship evidence
→ unresolved / unsupported evidence
→ deterministic structure fingerprint
```

## Existing authority preserved

The implementation reuses:

- `product/source/src/core/stable-id.js` for stable IDs and fingerprints;
- `product/source/src/core/math.js` / `Matrix` for affine transform composition;
- existing Repeat identity behavior only as precedent, without replacing Repeat;
- existing semantic/provenance concepts as read-only evidence refs.

No mutation was made to:

- Document schema or Document object identity;
- Geometry / Path / Repeat / Transform authority;
- History / Revision semantics;
- renderer;
- production shell or UI;
- `FORMAT_VERSION`.

`FORMAT_VERSION = 4` is preserved.

## Resolver behavior

The resolver provides:

- deterministic normalization independent of equivalent input ordering;
- parameter types: number, integer, string, boolean, enum;
- parameter constraints and explicit unsupported/unresolved evidence;
- optional deterministic seed evidence;
- transform normalization from existing affine Matrix authority;
- bounded repeat expansion;
- stable generated-node IDs derived from structure identity, node-template key, repeat position and source evidence fingerprint;
- parent cardinality evidence;
- deterministic relationship ordering;
- bounded output bytes and node counts;
- canonical structure fingerprint.

## Read-only adapters

`createParametricStructureAdapter()` accepts optional providers:

- `getObject(id)`;
- `getSemanticRegion(id)`;
- `getProvenanceRef(id)`.

Provider results are cloned/summarized into source evidence.

Missing supplied refs are emitted as unresolved evidence:

- `SOURCE_OBJECT_UNRESOLVED`;
- `SEMANTIC_REGION_UNRESOLVED`;
- `PROVENANCE_REF_UNRESOLVED`.

No source provider object is mutated.

No formal product wiring is performed.

## Deterministic QA

Test:

`qa/core-mod-005-parametric-structure.test.mjs`

Validated:

- same descriptor + same values → same output/fingerprint;
- reordered equivalent input → same normalized output/fingerprint;
- deterministic generated-node IDs;
- bounded repeat/count behavior;
- transform descriptor normalization;
- invalid / unsupported parameter evidence;
- unresolved source refs;
- provenance refs preserved;
- source descriptor/provider data not mutated;
- no document/history/revision mutation APIs;
- no renderer/DOM/network dependency;
- `FORMAT_VERSION = 4`.

GitHub Actions source-only Node QA:

```text
RUN = 35712532550
HEAD = 5b24e12f45f6fcc371680eee8f778a7eeb7652f0
RESULT = SUCCESS
NODE = 22
```

The temporary source-only QA workflow is task-local evidence only and is removed before DEV handoff.

## Gates

```text
PARAMETRIC_STRUCTURE_CONTRACT_DEFINED = PASS
PARAMETRIC_STRUCTURE_RESOLVER_WORKS = PASS
PARAMETRIC_STRUCTURE_ADAPTER_READY = PASS
CORE_MOD_005_MODULE_READY = PASS_SOURCE_UNIT
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
```

## Boundary result

```text
UI_MUTATION = 0
DOCUMENT_MUTATION = 0
GEOMETRY_AUTHORITY_CHANGE = 0
RENDERER_MUTATION = 0
FORMAT_VERSION = 4
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
```

## Handoff

The module is ready for MR source review and later Integration adapter selection.

No cross-module Integration wiring is included in this task.
