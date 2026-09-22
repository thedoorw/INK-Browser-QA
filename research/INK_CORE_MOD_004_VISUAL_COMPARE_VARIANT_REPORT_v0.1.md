# INK CORE-MOD-004 — Visual Compare + Variant Module v0.1 Report

STATUS: `DEV_IMPLEMENTATION_COMPLETE / SOURCE_STATIC_PASS / ISOLATED_DETERMINISTIC_PASS / RUNTIME_DEFERRED`

## 1. Scope

Task:

`CORE-MOD-004 — Visual Compare + Variant Module v0.1`

Branch:

`work/ink-core-visual-compare-004`

Target:

```text
reference / current / revision / variant
→ normalized comparison subjects
→ visual / structural comparison evidence
→ deterministic comparison fingerprint
→ bounded variant / workflow metadata
```

This work is module-only. It does not implement comparison UI, renderer behavior, Revision restore, automatic selection, or a second document/revision store.

## 2. Existing authority reused

The module preserves and reuses existing INK authority:

- `product/source/src/document/revision.js`
  - `compareRevisionDocuments()`
  - `inspectRevisionRecord()`
- `product/source/src/document/integrity.js`
  - `inspectDocument()`
  - `documentFingerprint()`
  - `stableStringify()`
  - `fnv1a32()`
- `product/source/src/document/hierarchy.js`
  - `walkPageObjects()`
- existing Revision envelopes / document snapshots
- existing provenance bridge context
- existing stable document/object identity
- `FORMAT_VERSION = 4`

No existing authority was replaced.

## 3. Implemented module

File:

`product/source/src/compare/visual-compare.js`

Primary exports:

- `compareVisualSubjects(subjectA, subjectB, options)`
- `createVariantDescriptor(spec, options)`
- `createVisualCompareAdapter(providers)`
- `VisualCompareError`
- schema / version / mode / decision-state constants

Schemas:

```text
INK-VISUAL-COMPARE-SUBJECT
INK-VISUAL-COMPARISON
INK-VISUAL-VARIANT
version = 1
```

## 4. Comparison subject contract

Supported subject kinds:

```text
reference
current
revision
variant
```

Normalized identity can include:

- documentId
- revisionId
- referenceId
- variantId
- bounded objectIds
- document fingerprint
- revision fingerprint
- optional visual descriptors
- provenance refs

Revision subjects are read from validated Revision records and their existing snapshot envelopes. The module does not call Revision restore.

Reference subjects may carry a full INK document when structural comparison is possible, or descriptor/fingerprint-only evidence when a source document is unavailable.

## 5. Structural comparison

When both subjects contain valid INK documents with compatible document identity, structural evidence delegates to the existing authoritative:

`compareRevisionDocuments(beforeDocument, afterDocument)`

The module surfaces:

- added object IDs
- removed object IDs
- changed object IDs
- touched object IDs
- before/after object counts
- structure fingerprint pair
- geometry fingerprint pair
- appearance fingerprint pair
- equivalence
- stable shared-object correspondence

Correspondence policy:

```text
basis = STABLE_OBJECT_ID
guessed correspondence = prohibited
```

When structural comparison cannot be resolved, explicit evidence is retained instead of guessing. Current unresolved examples include:

- `STRUCTURAL_DOCUMENT_UNAVAILABLE`
- `DOCUMENT_IDENTITY_MISMATCH`
- truncation evidence

## 6. Visual mode contract

Supported mode descriptors:

```text
side-by-side
overlay
wipe
difference
structural
```

They are data descriptors for later Integration only.

The module explicitly records:

```text
renderingExecuted = false
pixelCaptureExecuted = false
rendererInvoked = false
```

Optional visual descriptors are JSON-compatible data only and are bounded. No renderer or pixel-capture authority is introduced.

## 7. Deterministic comparison fingerprint

Comparison output uses:

`fnv1a32-canonical-json`

Normalization covers:

- object-ID ordering
- explicit provenance-ref ordering
- supported mode metadata
- subject identity
- structural evidence
- unresolved evidence ordering
- bounds metadata

Equivalent reordered subject evidence produces the same normalized output and comparison fingerprint.

## 8. Variant descriptor

Variant schema:

`INK-VISUAL-VARIANT`

Required/available fields include:

- variantId
- base subject
- derived subject
- label
- reason
- sourceRevisionId where available
- provenanceFingerprint where available
- comparisonFingerprint
- decisionState
- variantFingerprint

Allowed neutral workflow decision metadata:

```text
UNRESOLVED
SELECTED
REJECTED
```

These values are metadata only. The module does not perform selection, rejection, restore, mutation, or automatic choice.

## 9. Provenance evidence

A subject can accept:

- explicit provenance refs
- existing `INK-AI-DOCUMENT-BRIDGE-PROVENANCE` context

Preserved refs can include:

- provenance graph fingerprint
- matching provenance event IDs

Matching uses known revision/object identity only. Missing evidence is not fabricated.

## 10. Read-only adapters

`createVisualCompareAdapter()` accepts narrow providers:

- `getCurrentDocument()`
- `getReference(id)`
- `getRevision(id)`
- `getVariant(id)`
- optional `getProvenanceContext()`

Adapter methods:

- `referenceCurrent(referenceId, options)`
- `revisionRevision(a, b, options)`
- `currentRevision(revisionId, options)`
- `variantVariant(a, b, options)`
- `variantDescriptor(spec, options)`

Providers are read only. No second editor/store/controller is created.

## 11. Bounds

Default comparison limits:

```text
maxObjectIds = 512
maxProvenanceRefs = 96
maxBytes = 128 KiB
```

Hard limits:

```text
maxObjectIds <= 4096
maxProvenanceRefs <= 1024
maxBytes <= 1024 KiB
```

Visual descriptor data has an additional 16 KiB bound.

Truncation is represented explicitly. Output exceeding the configured byte bound fails rather than silently expanding without limit.

## 12. Deterministic evidence

Repository QA:

`qa/core-mod-004-visual-compare.test.mjs`

QA commit:

`24c51000a845865345b7070b7987578a8a80208d`

Authored coverage:

1. current vs revision;
2. revision vs revision;
3. reference/current identity handling;
4. descriptor-only unresolved reference evidence;
5. variant descriptors;
6. added / removed / changed structural evidence;
7. stable correspondence by existing identity only;
8. reordered equivalent subject evidence → identical output/fingerprint;
9. unresolved document identity;
10. bounded object/output evidence;
11. no source mutation;
12. no Revision restore invocation;
13. no renderer/DOM/network dependency;
14. provenance refs preserved where available;
15. all four required adapter comparison paths;
16. FORMAT_VERSION = 4 and unsupported-version rejection;
17. unsupported comparison mode rejection;
18. prohibited automatic decision-state rejection.

Executed in this DEV session:

```text
exact compare-module isolated deterministic harness = PASS
source/static boundary scan against GitHub branch exact source = PASS
repository QA source = AUTHORED / COMMITTED
branch-native Node QA = NOT_EXECUTED
browser/runtime QA = DEFERRED_TO_INTEGRATION_BATCH
```

The branch-native Node test was not executed because this session's local execution environment could not resolve `github.com`, and the QA commit had no attached existing CI workflow run/status. This is recorded as an execution limitation, not as a test PASS.

## 13. Exact-source static boundary evidence

Checked directly against the GitHub branch module source:

```text
restoreRevisionDocument invocation = absent
renderer import = absent
.render() invocation = absent
window.* = absent
document.querySelector = absent
fetch() = absent
XMLHttpRequest = absent
WebSocket = absent
all 5 mode descriptors = present
FORMAT_VERSION 4 guard = present
compareRevisionDocuments reuse = present
```

## 14. Explicit non-changes

```text
UI_MUTATION = 0
RENDERER_BEHAVIOR_CHANGE = 0
PIXEL_CAPTURE_IMPLEMENTATION = 0
REVISION_AUTHORITY_CHANGE = 0
REVISION_SCHEMA_CHANGE = 0
REVISION_RESTORE_CHANGE = 0
RESTORE_SEMANTICS_CHANGE = 0
HISTORY_SEMANTICS_CHANGE = 0
DOCUMENT_SCHEMA_CHANGE = 0
SECOND_REVISION_STORE = 0
SECOND_VARIANT_DOCUMENT_STORE = 0
AUTOMATIC_VARIANT_CHOICE = 0
FORMAT_VERSION_CHANGE = 0
CORE_MOD_005_INTEGRATION = 0
PACKAGE_INK_CURRENT_MUTATION = 0
MAIN_MERGE = 0
```

## 15. Runtime

`RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH`

No browser/runtime certification is claimed by CORE-MOD-004.

## 16. Gate result

```text
VISUAL_COMPARE_CONTRACT_DEFINED = PASS
VISUAL_COMPARE_PURE_MODULE_WORKS = PASS
VISUAL_VARIANT_ADAPTER_READY = PASS
DETERMINISTIC_TEST_COVERAGE = PASS_AUTHORED
EXACT_SOURCE_STATIC_BOUNDARY = PASS
ISOLATED_DETERMINISTIC_EXECUTION = PASS
CORE_MOD_004_MODULE_READY = PASS
RUNTIME_QA = DEFERRED_TO_INTEGRATION_BATCH
```

Next:

`DEV_HANDOFF → MR_REVIEW_REQUIRED → STOP`
