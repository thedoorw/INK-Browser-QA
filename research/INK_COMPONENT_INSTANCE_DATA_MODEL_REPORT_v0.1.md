# INK Component / Instance Data Model Foundation v0.1

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED`

TASK: `INK-CLOUD-005`

BRANCH: `work/ink-cloud-005`

RUNTIME_QA: `DEFERRED`

## Fingerprint

- Accepted 004 promotion: `37418ab7f6b994425126e73c60810401d5e6e826`.
- Actual GitHub branch HEAD at DEV checkout: `c0a0e441c1b699398167a8559b72af750ba496a8` (the control files also retain earlier initialization commit `2ed1e9cbb4b77ac38b0c6798b8d75691f5325f46`).
- Design checkpoint: `c0ed73c3382ab4d9f9acd0710125c81ee8cdc198`.
- Core/editor implementation checkpoint: `67833ed5e00dcdd839f51a0cb072bd955785d063`.
- Final implementation + executed QA/evidence checkpoint: `a40885903c2e17e910b6a57672a2be1576e5f29a`.
- Final handoff is the following documentation-only commit on this branch. Its exact resulting SHA is recorded in the DEV handoff response and is resolvable with `git rev-parse work/ink-cloud-005`. A commit cannot contain its own resulting SHA; the implementation SHA above is exact, not a claim to be the final documentation commit SHA. MR must pin the final branch SHA before reviewing.

GitHub was used as SSOT. The uploaded modular package and prior conversation history were not used as the implementation baseline. Ordinary git clone/fetch worked; shell push lacked credentials, so checkpoints were published through the authenticated GitHub connector with non-forced branch updates and fetched back into the checkout.

## Definition authority and identity

The optional native document field is:

```json
{
  "components": {
    "schema": "INK-COMPONENTS-1",
    "definitions": [
      { "id": "definition UUID", "name": "Button", "sourceRootId": "ordinary Frame or Group ID" }
    ]
  }
}
```

`document.components.definitions` is the sole definition registry. Visual structure stays in the ordinary document Layer/Frame/Group tree. A registry entry references that geometry; it does not own a second tree. Source lookup is document-wide by exact object ID, so source moves across containers/pages do not retarget by name, array position or a stale path. Deleted source roots become diagnostic broken references; a similarly named replacement does not satisfy the reference.

Definition ID, source-root object ID, descendant source-node IDs and Instance object ID are separate identities. Source-node targeting uses ordinary stable object IDs through Frame/Group nesting. Reordering retains targets. Deleting/replacing a node leaves stale override keys diagnosable. Duplicate source-node IDs fail closed. Duplicate definition IDs never use first-match resolution.

`duplicateComponentDefinition()` duplicates ordinary source geometry and registers a fresh definition ID and fresh geometry IDs, using one History transaction. Ordinary editor duplication of source geometry produces an unregistered ordinary copy; it cannot accidentally duplicate registry authority. Ordinary duplication of an Instance gives it a new object ID while retaining its definition reference and override keys.

## Instance and linked resolution

An Instance is an ordinary atomic owner-array member with:

```text
id, type = component-instance, componentSchema = INK-COMPONENTS-1
definitionId, matrix[6], opacity, visible, locked, overrides
parentId only when nested
```

It has no authoritative `children` array. Supplied Instance-owned children are diagnosed and resolution is rejected. No derived geometry or bounds is written back into the document.

`resolveComponentInstance(document, instance)` returns `linked`, `linked-with-diagnostics`, or `broken`, plus diagnostic codes and disposable ordinary geometry. It clones the current source root, applies validated overrides, namespaces derived IDs, and wraps the result in an ordinary Group at the Instance placement. Source geometry edits are live on the next resolution. Rendering, bounds and SVG use existing recursive methods on this disposable geometry; there is no new renderer, hierarchy, transform, selection or History engine.

The source root's local matrix and all its canvas ancestors are excluded from definition geometry. Root-local design geometry, descendant local matrices, root width/height and source object properties remain. Thus moving/scaling/rotating the source root on its editing canvas does not become Instance placement. Descendant edits and root geometry changes do affect Instances. This explicit root-local convention also works under singular source ancestry without needing inversion.

Runtime derived IDs use the Instance ID plus source ID; they cannot be mistaken for editable source objects. Generated Repeat descriptors are rebuilt by the existing Repeat identity machinery on derived clones, never written into the source by component rendering/export.

## Override schema and precedence

The v0.1 surface is only `opacity`:

```json
{ "overrides": { "source-node-id": { "opacity": 0.4 } } }
```

Values must be finite numbers in `[0,1]`. Unknown property names invalidate that target's property record; they are never assigned onto geometry. Reserved prototype-related target keys are rejected by the command and ignored diagnostically by resolution. Stale/missing target records remain serialized and are not applied. Malformed envelopes remain diagnosable rather than silently replaced on load.

Precedence: current source-node opacity → valid per-node Instance override → multiplication by ordinary structural/Layer ancestry opacity during rendering. Override does not mutate the source. Reset via `setComponentOverride(app, instanceId, sourceNodeId, null)` removes that target's record and immediately exposes the current source value. Reset is allowed for a stale target or broken reference.

## Broken references, nesting and cycle safety

Missing definitions, invalid/missing source roots, duplicate definition IDs, ambiguous source-node IDs, unknown schemas and Instance-owned children fail closed with `geometry: null`. Broken Instances remain ordinary selectable objects with the existing empty-Group 1×1 interaction fallback; render and SVG emit no invented geometry. Native references and override data remain available for diagnosis/repair.

Nested Component Instances are explicitly unsupported in v0.1. Registration/creation/repair commands reject nested configurations where applicable; resolution scans all source payloads, including Repeat sources, and rejects any embedded Instance rather than recursively expanding it. An ordinary structural edit/import that introduces nesting makes that definition broken and diagnosable; it does not silently materialize or unlink it. Inspection reports self/indirect component cycles using reference-graph visitation with active/done guards, without resolving recursive geometry.

Existing structural traversal also now rejects repeated object references instead of traversing cyclic ownership indefinitely. Existing structural normalization rejection remains unchanged. Component diagnostics are integrity **warnings**, so an otherwise structurally valid document with broken links can still be saved/recovered. Ordinary structural errors still fail integrity.

`repairComponentReference()` is an explicit History-backed replacement of one Instance's definition ID. It is never invoked automatically on load or render. Existing overrides remain; targets that do not exist in the replacement definition are reported stale.

## Transform, bounds, selection and inherited state

Instance placement is the accepted `world = parentWorld × local` matrix contract. Instances can be created in a Layer, Frame or Group using existing ownership arrays. Existing same-Layer Frame reparent preserves the Instance world matrix. Frame/Group ancestor-collapse rules, singular-parent guards and visibility/lock/opacity semantics remain in use. Instance transforms change only Instance placement, never definition geometry or other Instances.

Bounds are derived by the existing Group/Frame/leaf renderer bounds functions. A Frame source retains explicit geometry bounds; a Group source retains child-derived bounds. No `worldBounds` or other derived bounds are serialized. Instance contents are not registered as structural page objects or spatial selection candidates; interaction remains atomic.

Because source edits on another page can affect an Instance, documents with registered definitions conservatively rebuild the existing spatial index at `ensureSpatialIndex()` rather than risk isolated stale bounds. This is a correctness-first v0.1 performance limitation, not a second index. The studio layer-effect cache also bypasses reuse for such documents to observe live definition edits. The studio hit wrapper forwards parent ancestry to the existing atomic hit path.

## Detach and History

`detachComponentInstance()` resolves the current appearance, applies supported overrides, gives ordinary geometry fresh IDs, removes linkage by replacing the Instance with an ordinary Group, and preserves the same placement/owner-array index/parent ownership. Root/descendant opacity, visibility, lock and Instance blend mode are preserved in the ordinary structure. A broken Instance cannot detach; rejection happens before mutation/History capture. Stale/invalid overrides that were not rendered do not contaminate detached appearance.

Register, create Instance, override, reset, detach, duplicate definition and explicit reference repair use existing `HistoryManager.pushScoped()` with registry/object/owner-array targets. Operations preflight before mutation. A pending external History transaction is rejected without being committed or cancelled. Existing History rollback remains responsible for operation exceptions. Undo/redo was executed for registry creation, Instance creation, override/reset, detach, duplication, source deletion and repair. Ordinary editor deletion/duplication also retain the link semantics.

Core/editor entry points are in `document/components.js` and thin InkApp methods: `registerComponent`, `createInstance`, `overrideInstance`, `detachInstance`, `duplicateComponent`, `repairInstance`. No full Component UI or deep-edit mode was added.

## Native serialization, migration and version decision

`FORMAT_VERSION_CHANGE = 0`; `FORMAT_VERSION = 4`; application version unchanged.

This is an optional, explicitly identified extension inside the existing extensible format-4 JSON envelope. Existing migration clones the complete document and retains unknown document/object data; object normalization already supplies ordinary matrix/ownership/semantic defaults. It does not strip this registry or Instance payload. No migration of existing Frame/Group/Repeat fields or new mandatory top-level envelope is required. Non-Component documents do not gain an empty registry.

Executed evidence verifies current JSON+migration round-trip and InkStore fallback save/load, including retained broken references. An additional test executes the **pre-task migration module** from `c0a0e441c1b699398167a8559b72af750ba496a8` with unchanged current model/normalization dependencies and verifies retention of all new fields. Existing semantic migration may add its established metadata defaults; those are not Component data loss.

This is data-retention compatibility, **not a claim that older INK builds can render/edit Components**. New capability requires this source implementation. SVG is the resolved appearance exchange path. No format bump, product version change or certification was performed.

## Structured SVG and renderer behavior

The main INK structured SVG path resolves an Instance into ordinary Group/Frame geometry, then uses existing exporters for vector paths, strokes, text, images and Repeat. Native INK data remains authoritative for linkage; SVG is resolved ordinary editable geometry. It is not raster-flattened.

The existing studio Group shortcut previously routed mixed children through the vector-only serializer. The shortcut is now limited to actual path/Repeat objects; Group/Frame children dispatch recursively through the main exporter so mixed shape/stroke/image/text content is retained. Studio draw/SVG dispatch honors hidden objects before type-specific branches. Standalone `vectorObjectToSVG()` has no document context and is not a native Component resolver; callers should use the main INK exporter or supply already resolved geometry to an appropriate ordinary serializer.

Actual main editor/renderer methods and the studio wrapper were loaded in the Node test harness with only DOM boot disabled and relative imports made absolute. Tests verify mixed structured SVG, no source mutation, deterministic repeated output, atomic hit/bounds, and transform/opacity composition through instrumented draw calls. These are source-method integration checks, not rendered browser visual verification.

## Files changed relative to DEV checkout

Product:

- `product/source/src/document/components.js` — new registry/resolution/diagnostics/History commands.
- `product/source/src/document/hierarchy.js` — repeated-reference traversal guard.
- `product/source/src/document/index.js` — Component exports.
- `product/source/src/document/integrity.js` — Component diagnostics retained as warnings.
- `product/source/src/ink.js` — main draw/bounds/hit/SVG/spatial integration and bounded commands.
- `product/source/src/studio-core.js` — mixed SVG dispatch, hidden-state and parent-forwarding integration, live source cache handling.

QA:

- `qa/core/tests/unit/component-instance-v0.1.test.mjs` — 19 new model/integration tests.
- `qa/core/tests/unit/frame-editor-source-v0.1.test.mjs` — preserve required import assertions without stale adjacency/order assumption.
- `qa/core/run-component-foundation-checks.mjs` — reproducible Node-only runner.
- `qa/core/evidence/INK_CLOUD_005_NODE_CHECKS.txt` — executed output.

Control/report:

- `ACTIVE/INK_DEV_PROGRESS.md`.
- `working/WORKING_STATUS.md` — DEV handoff checkpoint; no MR decision asserted.
- this report.

## Checks actually executed

Environment: Node `v24.19.0`.

Command:

```sh
node qa/core/run-component-foundation-checks.mjs
```

| Check | Executed result |
|---|---|
| Component/Instance model + actual editor-method suite | 19/19 PASS |
| Accepted Frame/Group/Transform/singular-History regression suites | 43/43 PASS |
| Retained core/editor/History/spatial/storage/stroke/artboard-workspace suites | 29/29 PASS |
| Product source syntax checks | 6/6 PASS |
| FORMAT_VERSION remains 4 | PASS |
| `git diff --check` | PASS |

Total: **91/91 Node tests PASS**. The retained legacy suite files still import their old `../../src` layout. The runner changes only import specifiers in temporary test copies, preserving their assertions, then removes the copies. No package installation or hosted Actions were used.

Compatibility includes legacy Group, Frame/Group ownership and transforms, safe singular behavior, stylus normalization, editable vector SVG/import, text/image mixed export, Repeat stable identity, History, same-Layer reparent, spatial selection, storage fallback and creation/layout cameras. The old Frame static test failed because the accepted baseline had inserted another import between names that the test expected to be adjacent; the bounded test correction checks each required import instead. Initial new harness failures (DOM boot/toast stubs, InkStore signature, semantic default expectation) were corrected and rerun; they are not hidden PASS claims.

All new tests were executed. No authored-but-unexecuted new suite remains. The entire historical repository suite, headless CLI suite and build/package certification were not run or claimed. Tests are sufficient for this bounded shared-core workpack; they do not discharge browser debt.

## Known limitations and Runtime QA debt

- No nested Instances, variants, remote libraries, constraints/layout or deep Instance editing.
- Only opacity overrides; no broad property panel. Source root canvas placement is excluded by contract.
- Source resolution clones geometry and scans ordinary trees; component documents conservatively rebuild spatial data and bypass layer-effect cache reuse. Large-library optimization is deferred.
- Broken Instances have a diagnostic 1×1 interaction fallback and no exported artwork. Native broken data is retained; no automatic repair/retarget occurs.
- Source semantics/material/paint replay/asset payloads remain ordinary INK data. Existing renderer/export limitations for specialized effects are not expanded or certified by this task.
- Native IDs and matrices are structurally tested; Canvas/WebGL pixel equivalence, natural-media fidelity, GPU/tile behavior, pointer move/scale/rotate, live nested visibility/lock/opacity, browser IndexedDB recovery, browser project open/save and browser SVG inspection remain `RUNTIME_QA_DEFERRED`.
- Instrumented Node draw calls are not browser Runtime QA. InkStore tests exercise fallback storage, not a real browser IndexedDB session.

## Completion gate

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-005
BRANCH = work/ink-cloud-005
IMPLEMENTATION_AND_QA_HEAD = a40885903c2e17e910b6a57672a2be1576e5f29a
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```

No Cloud implementation or INK-CLOUD-006 was started. No package update, main merge, replacement engine, Penpot copying, FLORA/AI/Recipe boundary promotion or version/certification was performed. Cloud Start Gate remains blocked.
