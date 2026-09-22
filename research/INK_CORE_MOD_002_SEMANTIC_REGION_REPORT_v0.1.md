# INK CORE-MOD-002 — Semantic Region Grounding Module v0.1 Report

STATUS: `DEV_IMPLEMENTATION_COMPLETE / ISOLATED_DETERMINISTIC_PASS / RUNTIME_DEFERRED`

## 1. Scope

Task:

`CORE-MOD-002 — Semantic Region Grounding Module v0.1`

Branch:

`work/ink-core-semantic-region-002`

Authorized target:

```text
INK Path / Region / object evidence
→ region boundary / hole / island grounding
→ contains / inside / intersects / overlaps / adjacency relations
→ deterministic semantic-region graph
```

This implementation is module-only. It does not replace selection authority, activate a new UI source, mutate the Document, or change History / Revision semantics.

## 2. Contract inventory

Existing authority preserved:

- authoritative INK Path / subpath geometry;
- existing nested hierarchy / world transforms;
- existing Vector Boolean geometry;
- existing Geometry Kernel segment intersection;
- existing object semantic payload / semantic relationship graph;
- existing selection authority;
- existing Document / History / Revision;
- `FORMAT_VERSION = 4`.

No second Path representation, Boolean engine, selection model, or semantic-document authority was introduced.

## 3. Implemented module

File:

`product/source/src/semantic/semantic-region-grounding.js`

Exports:

- `groundSemanticRegions(document, options)`
- `semanticRegionBridgeContext(graph)`
- `createSemanticRegionGroundingAdapter(providers)`
- `SemanticRegionGroundingError`
- semantic-region schema/version/relation constants

Primary output:

```text
INK-SEMANTIC-REGION-GRAPH
  document / active page identity
  deterministic regions[]
  deterministic relationships.edges[]
  explicit relationships.unresolved[]
  bounds / limits metadata
  graph fingerprint
```

Each region descriptor includes:

- deterministic region ID;
- Page / Layer / Object / subpath source reference;
- source subpath role;
- grounded `outer / hole / island` role;
- boundary fingerprint;
- bounds;
- area;
- centroid;
- object semantic role / confidence;
- source Recipe / Step identity when available;
- extraction/source provenance when available;
- region-level fingerprint.

## 4. Geometry reuse

The module does not implement a second geometry engine.

It reuses:

- `walkPageObjects` for authoritative nested world transforms;
- `pathMetrics` for bounds / area / centroid;
- `pathToMultiPolygon` + `pointInRing` for existing Path-ring grounding;
- `booleanPaths(..., 'intersection')` for area overlap / containment evidence;
- `intersectPathSegments` for boundary-intersection evidence;
- `stableCompositeId / stableHash` for deterministic INK-owned identity.

Temporary Boolean/intersection results are calculator outputs only and are never written into document state.

## 5. Relationship policy

Geometry-backed relationships:

- `contains`
- `inside`
- `intersects`
- `overlaps`

Evidence-only relationships:

- `adjacent`
- `crossing`
- `gap`
- `bridge`

The evidence-only relations are not guessed from distance or visual proximity. They are emitted only when supplied by existing semantic relationship evidence or an explicit adapter evidence input.

Unsupported, ambiguous, missing-target, explicitly unresolved, or failed geometry evidence is preserved under:

`relationships.unresolved[]`

rather than silently converted into a guessed relation.

## 6. Outer / hole / island grounding

Existing Path subpath roles remain source authority.

Rules:

```text
source hole
→ hole

source island
→ island

source outer
+ boundary probe is inside a hole from the same source Path
→ island

otherwise
→ outer
```

Unsupported source roles remain:

`status = UNRESOLVED`

No source Path role is mutated.

## 7. Determinism

Deterministic normalization covers:

- region ordering;
- relationship ordering;
- evidence ordering;
- evidence identity;
- graph fingerprint;
- generated region IDs.

Evidence identity is content-hashed rather than array-index-based, so reversing object/evidence input order does not change equivalent output.

## 8. Adapter boundary

Narrow read-only adapter:

```text
getDocument()
getRelationshipEvidence() optional
→ read(options)
→ semantic-region graph

readBridgeContext(options)
→ AI Document Bridge-compatible semantic-region context
```

This task does not wire the adapter into active selection or CHAT behavior.

Bridge-compatible context contains:

- document/page identity;
- semantic-region fingerprint;
- region IDs + source refs;
- roles;
- bounds / area / centroid;
- semantic role / confidence / status;
- relationship edges;
- unresolved relationship count.

## 9. Fail-closed policy

Rejected structural input includes:

- non-INK / malformed document;
- `formatVersion != 4`;
- missing active Page;
- invalid Path structure;
- open region subpaths;
- fewer than three anchors;
- invalid anchor / handle coordinates;
- zero-area region;
- duplicate Object IDs;
- duplicate deterministic Region IDs;
- missing requested Path target;
- invalid limit/evidence payload;
- region/pair/evidence limits exceeded.

Valid but non-decisive relationship evidence is retained as unresolved rather than rejected or guessed.

## 10. Deterministic / unit evidence

Repository test authored:

`qa/core-mod-002-semantic-region.test.mjs`

Coverage includes:

1. outer + hole + derived island;
2. nested containment;
3. overlapping + intersecting regions;
4. stable object/evidence input-order normalization;
5. deterministic region IDs / graph fingerprint;
6. contains / inside / intersects / overlaps classification;
7. explicit adjacency evidence;
8. unresolved bridge evidence;
9. focused Path subset;
10. AI Document Bridge-compatible context;
11. narrow adapter boundary;
12. malformed `FORMAT_VERSION` rejection;
13. open geometry rejection;
14. duplicate Object-ID rejection;
15. no source mutation;
16. `FORMAT_VERSION = 4`.

In-session execution performed on a local isolated mirror of the exact module logic using contract-compatible hierarchy / intersection stubs and the project polygon-clipping baseline:

```text
node --check semantic-region-grounding.js
→ PASS

isolated semantic-region deterministic harness
→ PASS
→ regions = 6
→ relationships = 14

static dependency scan
→ PASS
```

The isolated harness specifically verified deterministic repeated output, object/evidence reordering, outer/hole/island classification, containment, overlap, explicit adjacency, unresolved evidence, Bridge context, adapter behavior, malformed input rejection and no source mutation.

GitHub branch-native execution of:

`node qa/core-mod-002-semantic-region.test.mjs`

was not triggered by an available workflow in this DEV session. No browser Runtime claim is made.

## 11. Dependency / safety properties

```text
NO UI DEPENDENCY
NO DOM DEPENDENCY
NO NETWORK DEPENDENCY
NO REMOTE AI DEPENDENCY
NO SOURCE MUTATION
NO SELECTION MUTATION
NO DOCUMENT SCHEMA CHANGE
NO HISTORY CHANGE
NO REVISION CHANGE
NO RENDERER CHANGE
FORMAT_VERSION = 4
```

## 12. Explicit non-changes

```text
UI_MUTATION = 0
SELECTION_AUTHORITY_CHANGE = 0
DOCUMENT_SCHEMA_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
REVISION_SEMANTICS_CHANGE = 0
RENDERER_CHANGE = 0
FORMAT_VERSION_CHANGE = 0
REMOTE_SEGMENTATION_ONNX = 0
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
CORE_MOD_003_PLUS_INTEGRATION = 0
```

## 13. Runtime

Per Work Order:

`RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH`

No browser Runtime or integration certification is claimed.

## 14. Gate result

```text
SEMANTIC_REGION_CONTRACT_DEFINED = PASS
SEMANTIC_REGION_GROUNDING_WORKS = PASS
SEMANTIC_REGION_ADAPTER_READY = PASS
DETERMINISTIC_TEST_COVERAGE = PASS
ISOLATED_DETERMINISTIC_EXECUTION = PASS
BRANCH_NATIVE_UNIT_EXECUTION = NOT_TRIGGERED
CORE_MOD_002_MODULE_READY = DEV_HANDOFF_READY
```

Next action:

`DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP`
