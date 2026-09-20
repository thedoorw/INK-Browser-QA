# INK Multi-Contour Composition Report v0.1

Task: `INK-CLOUD-009`  
Branch: `work/ink-cloud-009`  
Gate: `MULTI_CONTOUR_COMPOSITION_WORKS`  
Runtime QA: `DEFERRED`

## Result

Multi-Contour Composition is implemented as a bounded extension over the accepted editable Path architecture.

Multiple independently sourced Paths can coexist as separate authoritative Path objects. Composition does not flatten Path geometry and does not introduce a second transform, hierarchy, History, Path Editing, Expressive Stroke, persistence, or SVG-export engine.

## Identity and provenance contract

- Extraction continues to create a fresh extraction `batchId`, reference image identity and Path object identities.
- Each Path remains an independent editable object.
- Explicit duplication creates fresh object, subpath and anchor IDs.
- Extraction/source provenance is preserved on duplicates.
- Duplicate lineage is recorded in `metadata.composition.sourceObjectId` and `metadata.composition.duplicatedFromObjectId`.
- Bounded `inspectComposition()` diagnostics report Path count, extracted/expressive Path counts, source identity count, missing Path-node IDs and duplicate Path-node IDs.
- No FORMAT_VERSION change is required.

## Composition behavior

Selection and composition reuse the accepted application command surface:

- one or multiple Path selection;
- move / scale / rotate through the existing matrix transform core;
- Group / Frame / reparent through the existing hierarchy core;
- front / back reorder through existing parent-array z-order;
- duplicate through existing History-backed duplicate command;
- Path node editing through existing Path Editing;
- Path appearance through existing Expressive Stroke.

Composition transform entry additionally rejects stale, locked, hidden and singular targets before mutation.

## Duplicate behavior

The existing duplicate routes now use the shared composition identity regenerator.

For duplicated Paths:

- object ID is fresh;
- every subpath ID is fresh;
- every anchor ID is fresh;
- Path geometry remains structured and editable;
- `expressiveStroke` is retained;
- original extraction/source provenance is retained;
- original object is not mutated.

The same identity helper is also used by layer duplication, avoiding Path-node identity collisions when a layer containing Paths is duplicated.

## Structured SVG

The application SVG export now routes Path objects to the already accepted `vectorObjectToSVG()` exporter.

This preserves:

- structured `<path>` output;
- `data-ink-id`;
- editable `d` geometry;
- Path topology metadata;
- ordinary-vector Expressive Stroke fallback;
- gradient/clip/mask defs through the shared defs collection.

No raster fallback was added.

## Persistence

The accepted native file-envelope implementation remains unchanged from main.

Executed file-envelope roundtrip evidence confirms multiple Path identities, subpath/anchor identities and extraction metadata survive wrap/unwrap. `FORMAT_VERSION` remains 4.

## Shared-core preservation

Branch blob SHA is identical to main for:

- `editor/transform.js`;
- `document/hierarchy.js`;
- `editor/path-edit.js`;
- `editor/expressive-stroke.js`;
- `history/history.js`;
- `document/file-envelope.js`;
- `config.js`;
- `vector/vector-core.js`.

The task therefore reuses the accepted cores rather than duplicating them.

## Evidence

Committed regression suites:

- `qa/core/tests/unit/multi-contour-composition-core-v0.1.test.mjs`
- `qa/core/tests/unit/multi-contour-composition-source-v0.1.test.mjs`

Executed evidence:

- `qa/core/evidence/INK_CLOUD_009_STATIC_CHECKS.txt`

PASS evidence includes:

- committed-source syntax/static checks;
- composition identity/provenance/guard unit harness;
- native file-envelope roundtrip harness;
- structured vector SVG harness;
- source contract checks;
- unchanged shared-core SHA verification.

Full Node runner was not executed because the local execution environment could not resolve `github.com` while cloning the GitHub SSOT branch. This is explicitly not claimed PASS. Browser Runtime QA remains DEFERRED by the Current Work Order.

## Acceptance

```text
MULTI_SOURCE_PATHS = IMPLEMENTED
MULTI_OBJECT_COMPOSITION = IMPLEMENTED
TRANSFORM = REUSED
HIERARCHY = REUSED
Z_ORDER = IMPLEMENTED
DUPLICATION_WITH_FRESH_IDENTITIES = IMPLEMENTED
PATH_EDITABILITY = PRESERVED
EXPRESSIVE_STROKE = PRESERVED
PROVENANCE = PRESERVED
HISTORY = REUSED
SERIALIZATION = PRESERVED
FORMAT_VERSION = 4
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
GATE = MULTI_CONTOUR_COMPOSITION_WORKS
```

## Scope boundaries

Not implemented or started:

- Repaint / Material;
- CHAT mutation;
- rose-window benchmark;
- cloud backend / auth / collaboration;
- broad UI redesign;
- package update;
- main merge.
