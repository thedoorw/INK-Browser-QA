# INK CORE-MOD-003 — Revision Provenance Module v0.1 Report

STATUS: `DEV_IMPLEMENTATION_COMPLETE / ISOLATED_DETERMINISTIC_PASS / RUNTIME_DEFERRED`

## 1. Scope

Task:

`CORE-MOD-003 — Revision Provenance Module v0.1`

Branch:

`work/ink-core-revision-provenance-003`

Target:

```text
reference / extraction / recipe / CHAT operation / revision evidence
→ normalized provenance events
→ object/change/revision lineage
→ deterministic provenance graph
→ bounded CHAT-readable provenance context
```

This work is module-only. Existing Revision and History systems remain authoritative.

## 2. Contract inventory

Existing evidence normalized without schema mutation:

- file envelope: fileId / revision / revisionId / integrity fingerprint;
- Revision record: revisionId / parentRevisionId / baseRevisionId / documentFingerprint / createdAt;
- Revision comparison: before/after fingerprints + added/changed/removed object IDs;
- History entries: label / objectIds / patch statistics as read-only evidence;
- object metadata source / extraction / sourceObjectId;
- semantic sourceRecipeId / sourceStepId;
- Recipe definition/execution: recipeId / stepId / executionId / before-after document hashes;
- CHAT plan/proposal/execution: planId / proposalId / taskId / operation / target IDs / state or document fingerprints;
- Semantic Region provenance refs.

Normalized event identity excludes timestamps. Timestamp is retained as evidence only.

## 3. Implemented module

File:

`product/source/src/provenance/provenance-graph.js`

Exports:

- `buildRevisionProvenanceGraph(input, options)`
- `provenanceBridgeContext(graph, options)`
- `createRevisionProvenanceAdapter(providers)`
- `RevisionProvenanceError`
- graph / bridge schema constants

Primary graph:

```text
INK-REVISION-PROVENANCE-GRAPH
  entities[]
  events[]
  edges[]
  unresolved[]
  conflicts[]
  bounds
  fingerprint
```

Each event can carry:

- deterministic eventId;
- event kind;
- source / target entity;
- documentId;
- revisionId;
- parent/source event IDs;
- operation;
- recipeId / stepId;
- proposalId / planId / executionId;
- batchId;
- objectIds;
- before / after fingerprints;
- timestamp evidence;
- status / unresolved reasons;
- evidence refs.

## 4. Lineage behavior

Supported explicit lineage includes:

- reference/source → extracted object;
- sourceObjectId → derived object;
- Recipe → Step → object/result;
- Recipe → execution → executed Step;
- CHAT plan → recipe/step;
- CHAT proposal → execution;
- Revision parent/base links;
- Revision comparison → object added / changed / removed;
- source Object → Semantic Region;
- extraction / Recipe provenance → Semantic Region.

No guessed lineage is emitted. Missing internal sources or parents remain under `unresolved[]`.

## 5. Duplicate / conflict policy

Equivalent normalized events deduplicate by deterministic event identity.

Evidence-key collisions that normalize to different events remain explicit under:

`conflicts[] / EVIDENCE_KEY_CONFLICT`

No conflicting evidence is silently selected as authoritative.

## 6. Determinism

Deterministic identity/fingerprint normalizes:

- event ordering;
- entity ordering;
- edge ordering;
- evidence-ref ordering;
- duplicate evidence;
- conflict ordering;
- unresolved ordering.

Timestamps are excluded from event identity and graph fingerprint, while retained in emitted evidence.

## 7. Bounds

Defaults:

```text
maxEvents = 256
maxEdges = 768
maxUnresolved = 256
maxConflicts = 128
maxBytes = 128 KiB
```

Hard limits:

```text
maxEvents <= 2048
maxEdges <= 8192
maxUnresolved <= 2048
maxConflicts <= 1024
maxBytes <= 1024 KiB
```

Byte trimming is deterministic. Returned counts and truncation state are explicit.

## 8. Adapter boundary

Read-only adapter providers:

```text
getDocument()
getRevisionRecords() optional
getRevisionComparisons() optional
getFileEnvelopes() optional
getHistoryEntries() optional
getRecipeEvidence() optional
getChatEvidence() optional
getSemanticRegionGraphs() optional
```

Outputs:

```text
read(options)
→ provenance graph

readBridgeContext(options, bridgeOptions)
→ AI Document Bridge-compatible bounded provenance context
```

No Revision store, History store or mutation flow is installed.

## 9. Tests

Repository test:

`qa/core-mod-003-revision-provenance.test.mjs`

Authored coverage includes:

1. reference → extraction → object;
2. Recipe / Step lineage;
3. CHAT plan / proposal / execution lineage;
4. Revision parent/base lineage;
5. added / changed / removed evidence from Revision comparison;
6. equivalent reordered input → identical graph/fingerprint;
7. unresolved/missing source links;
8. duplicate equivalent evidence;
9. conflicting evidence;
10. bounded event/edge/byte output;
11. source non-mutation;
12. existing `inspectRevisionRecord` validation;
13. Semantic Region provenance;
14. adapter + AI Document Bridge-compatible context;
15. timestamp excluded from deterministic identity/fingerprint;
16. FORMAT_VERSION = 4 and rejection of unsupported version.

## 10. Executed isolated deterministic evidence

Exact branch module source was fetched and executed in an isolated V8 harness. Only its two imports were replaced by contract-compatible deterministic stubs for `stableHash` and `walkPageObjects`; provenance module logic itself was executed unchanged.

Primary harness:

```text
no source mutation = PASS
equivalent reordered evidence = PASS
same graph fingerprint = PASS
reference → extraction = PASS
Recipe Step lineage = PASS
CHAT proposal → execution = PASS
Revision parent lineage = PASS
Revision object added = PASS
Revision object changed = PASS
Revision object removed = PASS
FORMAT_VERSION 4 = PASS
unsupported FORMAT_VERSION rejection = PASS

events = 14
edges = 20
fingerprint = fnv1a32:d9d84d8a
```

Secondary harness:

```text
explicit unresolved evidence = PASS
missing source event = PASS
evidence conflict preservation = PASS
bounded output = PASS
timestamp-independent event identity = PASS
timestamp-independent graph fingerprint = PASS
bounded sample outputBytes = 13365
```

Static dependency scan:

```text
fetch( = absent
XMLHttpRequest = absent
WebSocket = absent
window. = absent
document.querySelector = absent
localStorage = absent
sessionStorage = absent
```

Branch-native execution of:

`node qa/core-mod-003-revision-provenance.test.mjs`

was not triggered by an available source-only workflow in this DEV session. Browser Runtime is intentionally deferred by Work Order.

## 11. Existing Revision / History authority

No changes were made to:

- `product/source/src/document/revision.js`;
- `product/source/src/document/file-envelope.js`;
- `product/source/src/history/*`.

The provenance module reads supplied Revision/History evidence only.

Repository tests explicitly retain `inspectRevisionRecord` validity checks against existing records.

## 12. Explicit non-changes

```text
UI_MUTATION = 0
REVISION_AUTHORITY_CHANGE = 0
REVISION_SCHEMA_CHANGE = 0
REVISION_RESTORE_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
DOCUMENT_SCHEMA_CHANGE = 0
CHAT_EXECUTION_CHANGE = 0
RENDERER_CHANGE = 0
FORMAT_VERSION_CHANGE = 0
SECOND_REVISION_STORE = 0
SECOND_HISTORY_STORE = 0
COMPARE_VARIANT_INTEGRATION = 0
PARAMETRIC_INTEGRATION = 0
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
```

## 13. Runtime

`RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH`

No browser/runtime certification is claimed.

## 14. Gate result

```text
REVISION_PROVENANCE_CONTRACT_DEFINED = PASS
REVISION_PROVENANCE_GRAPH_WORKS = PASS
REVISION_PROVENANCE_ADAPTER_READY = PASS
DETERMINISTIC_TEST_COVERAGE = PASS
ISOLATED_EXACT_SOURCE_EXECUTION = PASS
CORE_MOD_003_MODULE_READY = PASS
```

Next:

`DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP`
