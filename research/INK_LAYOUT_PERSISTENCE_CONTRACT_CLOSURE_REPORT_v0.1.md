# INK Layout / Constraints Schema + Persistence Contract Closure v0.1

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

TASK: `INK-CLOUD-006`

BRANCH: `work/ink-cloud-006`

RUNTIME_QA: `DEFERRED`

## Fingerprint

- Accepted INK-CLOUD-005 promotion on main: `58b584051afe6fab8cfcd387e65f62d4e78bd4f0`.
- Actual GitHub branch HEAD at DEV checkout: `d1f908825f8419f053753b93d13a1a4ee901de91`.
- Layout/envelope implementation checkpoint: `dc6c20ca71543773b791c571c51a423372b20d28`.
- Semantic edge-hardening checkpoint: `04fab9e69a90ef5e90fd34a9030f6f2e389fb49a`.
- Final implementation + executed QA/evidence checkpoint: `184c74195e976526713ad549b236e13c9dac9ad7`.
- Final handoff is the following documentation-only commit on this branch. Its exact resulting SHA is recorded in the DEV handoff response and is resolvable from the pinned `work/ink-cloud-006` branch ref. A commit cannot contain its own resulting SHA; the implementation/QA SHA above is exact.

GitHub was the SSOT. No previous conversation state or uploaded package was used as the source baseline. Checkpoints were published through the authenticated GitHub connector with non-forced branch updates and fetched back into the checkout.

## Final Layout schema

Frame layout intent is optional and versioned:

```json
{
  "layout": {
    "schema": "INK-LAYOUT-1",
    "mode": "manual | horizontal | vertical",
    "gap": 8,
    "padding": { "top": 8, "right": 8, "bottom": 8, "left": 8 },
    "align": {
      "main": "start | center | end | space-between",
      "cross": "start | center | end | stretch"
    },
    "sizing": {
      "horizontal": "fixed | hug",
      "vertical": "fixed | hug"
    }
  }
}
```

Direct Frame-child intent is independently optional and versioned:

```json
{
  "layoutItem": {
    "schema": "INK-LAYOUT-ITEM-1",
    "participation": "flow | absolute",
    "sizing": {
      "horizontal": "fixed | fill | hug",
      "vertical": "fixed | fill | hug"
    },
    "fixedSize": { "width": 100, "height": 40 },
    "constraints": {
      "horizontal": "start | end | center | scale | stretch",
      "vertical": "start | end | center | scale | stretch"
    }
  }
}
```

Existing format-4 Frames without `layout` remain no-layout Frames and retain current behavior. `manual` records intent without repositioning children. Horizontal and vertical modes provide the minimum deterministic flow vocabulary required by the Work Order. No grid, wrapping, baseline, min/max or full Auto Layout property model was added.

## Container, ownership and transform authority

Frame is the sole layout-container authority. Group retains ordinary grouping semantics and Repeat remains procedural. A `layout` field on a non-Frame is preserved for diagnosis but never grants container authority. A `layoutItem` outside a direct Frame-child relationship is likewise diagnosable and does not create ownership.

Layout reuses existing Frame `children` arrays and stable object IDs. It does not create a second hierarchy, renderer, transform engine, spatial index or History system. Component source/Instance identities and override/detach semantics are unchanged.

`evaluateFrameLayout()` and `evaluateResizeConstraints()` return disposable local-coordinate plans. The metadata is intent authority; existing object matrices and Frame/object geometry remain committed document authority until a future explicit operation applies a plan. Evaluation does not mutate the document or unrelated ancestors. Parent/local/world matrix meaning, singular-transform protections and accepted ownership behavior remain unchanged. Derived world geometry and bounds are never serialized.

Absolute children are excluded from flow and retain their committed matrices. Resize plans express start/end/center/scale/stretch intent per axis without applying it. Intrinsic bounds may be supplied by a callback; otherwise existing width/height fields provide the bounded fallback.

## Normalization and evaluation

Known current-schema fields normalize deterministically:

- invalid modes, alignment, sizing, participation and constraints use documented defaults;
- numeric gap, padding and fixed sizes become finite non-negative values;
- missing child metadata receives flow/hug/start evaluation defaults without being written into the object;
- unknown fields inside a known v1 record survive normalization and save/load;
- unknown future schema records survive migration but are not interpreted as v1;
- evaluation rejects an unsupported child schema and reports an unsupported Frame schema without mutation.

A fill child on a hug container axis would otherwise create circular size authority. v0.1 uses intrinsic size on that axis and emits `layout-fill-in-hug-axis-uses-intrinsic`. Cross-axis stretch is suppressed when the corresponding container axis is hug. This makes the limited evaluator deterministic without inventing a general constraint solver.

## History behavior

`setFrameLayout()` applies or removes Frame metadata. `setChildLayoutItem()` applies or removes direct-child metadata. Both:

- preflight target and authority before mutation;
- normalize known v1 fields;
- use existing `HistoryManager.pushScoped()`;
- create one atomic undoable operation;
- reject a busy/pending external History transaction without committing or cancelling it;
- mark the existing spatial state dirty and request the existing refresh path.

Executed tests cover apply, remove, undo, redo, invalid targets and busy History. No replacement History engine was introduced.

## Serialization, migration and integrity

`FORMAT_VERSION_CHANGE = 0`; `FORMAT_VERSION = 4`.

Layout is an optional versioned extension within the existing extensible format-4 native document. Model normalization now calls the bounded Layout normalizer. Existing migration retains complete documents and unknown extension fields while normalizing known current Layout records. It does not retarget IDs, rewrite ownership or serialize derived geometry.

Integrity inspection adds Layout diagnostics as warnings. It reports non-Frame containers, child metadata outside a Frame, unknown/invalid schemas and non-normalized known fields. Ordinary structural integrity errors retain their existing severity and behavior.

Executed round trips cover JSON/native normalization, migration, Layout metadata, Components/Instances, unknown future fields and asset manifests. The existing `InkStore` remains a separate native-document recovery path and was exercised with Layout and asset data. Structured SVG continues to export resolved structural geometry; Layout metadata alone neither raster-flattens nor changes the export hierarchy.

## Transport-neutral file and revision envelope

The adapter boundary is `INK-FILE-ENVELOPE` version `1.0`:

```json
{
  "schema": "INK-FILE-ENVELOPE",
  "version": "1.0",
  "fileId": "stable native document/file ID",
  "revision": 1,
  "revisionId": "file-id:r1:fingerprint-suffix",
  "documentFormatVersion": 4,
  "extensions": ["ink.components.v1", "ink.layout.v1"],
  "appliedMigrations": [],
  "document": { "format": "INK", "formatVersion": 4 },
  "assetReferences": [],
  "savedAt": "ISO timestamp",
  "modifiedAt": "ISO timestamp",
  "integrity": {
    "algorithm": "fnv1a32-canonical-json",
    "fingerprint": "canonical native-document fingerprint"
  }
}
```

The native `document` remains authoritative. Wrapping deep-clones it, computes its canonical fingerprint and mirrors asset references without changing the source. Unwrapping first validates the complete envelope and returns a deep clone. Invalid schema/version, identity, revision, timestamps, extension declarations, migration records, document format, asset mirror or fingerprint fail closed. Cyclic or otherwise non-serializable payloads produce bounded diagnostics instead of unbounded recursion.

`nextInkFileRevision()` verifies the prior envelope, preserves `fileId`, increments the safe integer revision, fingerprints the new native payload, and retains prior future extension identifiers alongside extensions required by the new document. It is revision identity scaffolding only; it does not implement remote transport, conflicts or synchronization.

No HTTP/API, authentication, permissions, server storage, sync, collaboration, presence or websocket capability was added.

## Extension and asset policies

Structural feature detection declares:

- `ink.layout.v1` when a structural page object has `layout` or `layoutItem`;
- `ink.components.v1` when the native document has a Component registry.

Detection walks page objects, so unrelated workspace data such as camera `layout` fields cannot falsely declare the Layout extension. Required declarations must be present. Unknown future extension IDs are retained across revisions and remain uninterpreted.

`assetReferences` is a transport-facing mirror of `document.assetManifest.assets`. The native manifest owns asset metadata. The mirror is compared by stable canonical serialization and divergence invalidates the envelope. Asset bytes, upload state and remote URLs are outside this contract.

## Compatibility closure

Executed coverage protects:

- legacy non-Frame and format-4 no-layout documents;
- Frame/nested hierarchy and Group ownership;
- transforms, bounds and singular guards;
- Component/Instance identity, overrides, resolution and detach;
- Repeat identity;
- existing History;
- spatial indexing;
- native save/load and migration;
- InkStore fallback recovery;
- structured SVG;
- creation/layout workspace cameras;
- asset manifests;
- envelope round-trip, revision, fingerprint and malformed-input behavior.

No accepted hierarchy, ownership, transform or Component contract was replaced or weakened.

## Files changed relative to DEV checkout

Product:

- `product/source/src/document/layout.js` — versioned schema, normalization, pure evaluation, diagnostics and History commands.
- `product/source/src/document/file-envelope.js` — transport-neutral envelope, inspection, unwrap and revision helpers.
- `product/source/src/document/index.js` — public exports.
- `product/source/src/document/model.js` — bounded Layout normalization hook.
- `product/source/src/document/integrity.js` — Layout diagnostics and canonical fingerprint reuse.

QA:

- `qa/core/tests/unit/layout-persistence-contract-v0.1.test.mjs` — 21 contract, migration, compatibility and failure-path tests.
- `qa/core/run-layout-persistence-closure-checks.mjs` — reproducible combined local runner.
- `qa/core/evidence/INK_CLOUD_006_NODE_CHECKS.txt` — exact executed output.

Control/report:

- `ACTIVE/INK_DEV_PROGRESS.md`.
- `working/WORKING_STATUS.md`.
- this report.

No `package/ink-current` file was changed.

## Checks actually executed

Environment: Node `v24.19.0`.

Command:

```sh
node qa/core/run-layout-persistence-closure-checks.mjs
```

| Check | Executed result |
|---|---|
| Accepted 002–005 structural/Component suites | 62/62 PASS |
| Retained core/editor/History/spatial/storage/stroke/artboard suites | 29/29 PASS |
| Layout/Constraints + persistence envelope suite | 21/21 PASS |
| Product source syntax checks | 8/8 PASS |
| `FORMAT_VERSION = 4` assertion | PASS |
| No network primitive in new schema modules | PASS |
| `git diff --check` | PASS |

Total: **112/112 Node tests PASS**. Evidence is retained in `qa/core/evidence/INK_CLOUD_006_NODE_CHECKS.txt`.

The first Layout suite run exposed an incorrect test expectation for hug-height arithmetic; the expectation was corrected from 51 to the actual padding + intrinsic sizes + gap value 46. An edge test then exposed false extension detection from workspace camera naming; structural feature scanning was fixed and rerun. Final combined evidence is the passing run above.

All tests authored for INK-CLOUD-006 were executed. No authored-but-unexecuted test remains. The complete historical repository suite, browser Runtime suite, hosted Actions, build/package certification and package generation were not run and are not claimed.

## Runtime QA debt and known limitations

- Browser Canvas/WebGL rendering, pixel equivalence, pointer interaction, browser IndexedDB, browser open/save, visual SVG inspection and hosted GitHub Actions remain `RUNTIME_QA = DEFERRED`.
- The evaluator provides one-dimensional horizontal/vertical flow, basic alignment, sizing and resize-anchor plans. It does not implement grid, wrapping, baseline, min/max, mature flex behavior or a Layout UI.
- Plans are not automatically applied to committed matrices or geometry. A future bounded editor/runtime operation must explicitly apply them through accepted ownership, transform and History paths.
- Accurate intrinsic size for complex Group/Repeat/Component geometry requires the existing bounds system to be supplied through `boundsForObject`; the field fallback is deliberately limited.
- Envelope revision numbers are monotonic helper data, not a conflict-resolution, synchronization or collaboration protocol.
- The canonical FNV fingerprint is an integrity/change-detection boundary for this schema, not a cryptographic signature.
- Asset references mirror metadata only; asset transport and byte integrity are deferred.
- Future unknown schemas are preserved and rejected from current evaluation. Supporting them requires an explicit later migration/implementation decision.

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-006
BRANCH = work/ink-cloud-006
IMPLEMENTATION_AND_QA_HEAD = 184c74195e976526713ad549b236e13c9dac9ad7
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

No Cloud implementation or next Work Order was started. No package update, main merge, renderer replacement, version promotion or certification was performed. Cloud Start Gate remains blocked pending MR review and the required post-promotion PRE_CLOUD_CORE_READY assessment.
