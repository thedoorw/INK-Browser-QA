# INK Cloud Editor — INK/Penpot Architecture Gap Audit v0.1

STATUS: `DEV_AUDIT_COMPLETE / MR_REVIEW_REQUIRED`

TASK: `INK-CLOUD-001`

DEV branch: `work/ink-cloud-001`

Scope: architecture audit only. No Runtime/product/package mutation is authorized or performed by this audit.

## 1. Audit question

Can the current INK architecture remain the product core while gaining the mature interaction and cloud-file capabilities expected from a browser vector editor?

This audit compares current INK source against selected Penpot architecture and interaction concepts. Penpot is used only as an architecture/reference source. This task does not authorize copying Penpot source or making INK a Penpot fork.

## 2. Evidence baseline

### INK

Required baseline:

- `README.md`
- `AGENTS.md`
- `ACTIVE/README.md`
- `governance/INK_MR_DEV_GOVERNANCE_v0.1.md`
- `governance/INK_Product_Boundary_v0.1.md`
- `ACTIVE/INK_MAIN_REVIEW_BOARD.md`
- `ACTIVE/INK_DEV_PROGRESS.md`
- `product/source/index.html`

Relevant product evidence read for this audit:

- `product/source/src/document/model.js`
- `product/source/src/document/storage.js`
- `product/source/src/document/index.js`
- `product/source/src/editor/selection.js`
- `product/source/src/editor/transform.js`
- `product/source/src/vector/vector-core.js`
- `product/source/src/history/history.js`
- `product/source/src/spatial/page-spatial-index.js`
- `product/source/src/render/index.js`
- `product/source/src/render/live-canvas-tile-renderer.js`
- `product/source/src/recompute/dependency-graph.js`
- `product/source/src/export/index.js`
- `product/source/src/recipe/recipe-engine.js`
- `product/source/src/ai/ai-core.js`
- `product/source/src/flora/index.js`
- `product/source/src/repeat/repeat-identity.js`
- relevant integration points in `product/source/src/ink.js`

### Penpot

Reference repository:

- `penpot/penpot`
- branch: `develop`
- audited head: `b402637fe4c35a31eac4007356d3a750ba6187c8`
- head commit date observed: 2026-09-18
- license: Mozilla Public License 2.0

Official source/docs references used:

- repository / architecture overview:
  - https://github.com/penpot/penpot
  - https://help.penpot.app/technical-guide/developer/architecture/
- file/data model:
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/docs/technical-guide/developer/data-model/penpot-file-format.md
  - https://help.penpot.app/technical-guide/developer/data-model/
- snapping:
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/frontend/src/app/main/snap.cljs
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/frontend/src/app/worker/snap.cljs
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/common/src/app/common/geom/snap.cljc
- transforms:
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/frontend/src/app/main/data/workspace/transforms.cljs
- flexible layout:
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/common/src/app/common/geom/shapes/flex_layout.cljc
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/common/src/app/common/geom/shapes/grid_layout.cljc
  - https://help.penpot.app/user-guide/designing/flexible-layouts/
- variants/components:
  - https://github.com/penpot/penpot/blob/b402637fe4c35a31eac4007356d3a750ba6187c8/frontend/src/app/main/data/workspace/variants.cljs
  - https://help.penpot.app/user-guide/design-systems/variants/

## 3. Classification rule

- `RETAIN` — INK already has an architectural capability worth preserving as the basis.
- `EXTEND` — INK has a valid foundation but lacks mature editor semantics, UI behavior, fidelity, or scale.
- `ADD` — a first-class subsystem/model is materially absent.
- `DEFER` — keep compatibility in mind, but do not implement in the next slice.
- `DO_NOT_IMPORT` — Penpot implementation detail should not be brought into INK as an implementation dependency.

The classification is architectural, not a claim that current Runtime behavior has passed new functional QA.

## 4. Source-grounded gap matrix

| # | Dimension | Classification | Current INK evidence | Penpot reference / gap finding |
|---:|---|---|---|---|
| 1 | document / page / object model | `EXTEND` | `document/model.js` already defines Document → Pages → Layers → Objects, stable IDs, page workspace/artboard, object matrices, nested group children, repeats, material and dependency metadata. | Penpot file model adds stronger file revision/library/media/feature-flag concepts and shape-oriented persistence. INK should extend its existing model rather than replace it. |
| 2 | vector shape primitives | `EXTEND` | `vector/vector-core.js` has editable paths, groups, text, repeat objects, gradients, clip/mask, booleans, outline/offset and transforms; `ink.js` also carries stroke/shape/image editor objects. | Penpot models a broad uniform shape family (frame/group/rect/circle/path/text/image/bool/svg-raw). INK needs a more coherent common object/shape contract, not a new geometry engine. |
| 3 | path / Bézier / node editing | `RETAIN` | `vector/vector-core.js`: anchors with in/out handles; corner/smooth/symmetric modes; add/delete/move anchors; handle movement; cubic rendering; SVG path parsing including C/S/Q/T/A; booleans remain editable. `ink.js` exposes editable stroke node operations. | Penpot has deeper production UI around path editing, but INK already has the required structured geometry basis. Preserve it and improve interaction separately. |
| 4 | selection / multi-selection / bounding box | `EXTEND` | `editor/selection.js` provides indexed marquee/lasso candidate selection; `ink.js` maintains multi-selection and uses renderer selection bounds. | Mature nested-selection rules, deep-selection behavior, container awareness and selection affordances need a stronger editor layer. |
| 5 | move / scale / rotate transforms | `EXTEND` | Object affine matrices are first-class. `editor/transform.js` applies matrices to selected objects. `ink.js` supports move snapping, rotation and transform property fields; selection overlay supplies transform handles. | Penpot separates high-frequency transform preview/modifiers from committed changes in `workspace/transforms.cljs`. INK should adopt that interaction pattern conceptually while retaining its matrix model/history. |
| 6 | layers / groups / nested hierarchy | `EXTEND` | Pages own layers; layers support visible/locked/opacity and drag reorder. `document/model.js` supports group children; `recompute/dependency-graph.js` models PARENT_OF/CHILD_OF and nested dependencies. | INK lacks one mature, unified editable object tree spanning layer panel, nested groups/containers, parent transforms and deep selection. |
| 7 | fill / stroke / effects / text properties | `EXTEND` | `vector/vector-core.js` supports fill, stroke, width, dash, cap/join, gradients, opacity, blend, clip/mask; text exports/imports basic family/size/fill/text. | Penpot shape data covers richer styling and typography/effects. INK should add missing effect/rich-text properties without replacing its vector representation. |
| 8 | align / distribute / snapping | `EXTEND` | `vector/vector-core.js` has align/distribute/snap primitives. `ink.js` implements alignment/distribution and smart move snapping to object left/center/right/top/middle/bottom plus grid snapping. | Penpot uses dedicated snap indexes/range trees and a worker query path. INK's current object scan should evolve toward indexed, worker-capable snapping and equal-distance snapping. |
| 9 | rulers / guides / smart guides | `ADD` | INK renders artboard center/safe/bleed guides and temporary smart-guide overlays; `ink.js::snapMove` creates transient snap guide lines. No first-class persistent ruler-guide model was found in the audited source. | Penpot stores page guides and indexes ruler guides in `frontend/src/app/worker/snap.cljs`; `main/snap.cljs` distinguishes ruler guides, layout guides and dynamic alignment. Add persistent ruler/guides while reusing INK snap/overlay infrastructure. |
| 10 | frames / reusable components / instances | `ADD` | INK has artboards, groups, procedural repeats, material instances and stable repeat instance IDs, but no general design-editor Frame + Component + Instance + override model was found. | Penpot file format has `frame`, component libraries and `components/v2`; workspace variant code manages components and variant properties. Implement INK-native equivalents; do not map repeat objects directly to components. |
| 11 | constraints / responsive layout / flex-grid style layout | `ADD` | `recompute/dependency-graph.js` has a generic constraint/dependency pipeline, but no editor-facing responsive constraint model or flex/grid layout engine was found. | Penpot has separate flex/grid geometry modules and child modifiers. INK can reuse its dependency/recompute foundation but needs explicit container/layout properties and deterministic layout evaluation. |
| 12 | undo / redo / transaction history | `RETAIN` | `history/history.js` implements target-scoped/full captures, forward/inverse patches, transaction begin/commit/cancel, undo/redo, timeline navigation, storage metrics and bounded history. | Penpot also groups editor operations into undo transactions. INK's history architecture is already appropriate; later cloud revisions must be layered above it rather than replacing local editing history. |
| 13 | SVG import / export and structured serialization | `RETAIN` | `vector/vector-core.js` serializes paths/groups/repeats/text to SVG, retains structured Bézier geometry, imports common SVG shapes, transforms, gradients, CSS, clip/mask, use/text/groups, records unsupported items and normalizes IDs. Native INK document data remains structured JSON. | Penpot also treats SVG/open web standards as core. Preserve INK's structured round-trip path; extend fidelity only where specific unsupported SVG features are proven important. |
| 14 | local storage / recovery | `RETAIN` | `document/storage.js` uses verified `INK_STORAGE_V3` envelopes, fingerprint/byte-length checks, IndexedDB primary storage, localStorage/memory fallback, previous version and bounded checkpoints, plus recovery validation. | This is a useful offline/local foundation. Cloud storage must be an additional adapter, not a replacement for local recovery. |
| 15 | cloud file adapter requirements | `ADD` | Current storage is local and project import/export is browser-file oriented; no authoritative remote file/revision/media/permission adapter was found. | Penpot's file format exposes file revision numbers, pages, media, libraries, feature flags and migrations. INK needs a transport-neutral cloud file interface with file ID, revision, media/assets, save/load, conflict signal and authentication/permission boundary. |
| 16 | render / viewport / overlay architecture | `EXTEND` | `render/index.js` and `ink.js` show Canvas/WebGL natural media, tiled export, tile atlas/live canvas renderer, dual workspace/layout viewport, selection/stroke/guide overlays and dirty-region concepts. | Keep the rendering core. Mature editor growth needs clearer separation between document rendering and editor overlays/affordances, especially nested frames, nodes, guides and layout overlays. |
| 17 | geometry indexing / worker / performance strategy | `EXTEND` | `spatial/page-spatial-index.js` provides an incremental quadtree with upsert/remove/query; rendering has tile/resource-budget and performance modules. Current snap scan in `ink.js` is main-thread and linear across page objects. | Penpot puts snap indexing/query logic in a worker and uses range trees. Add a worker boundary for snap/geometry queries when scale requires it; retain INK quadtree and tiled render rather than importing Penpot's implementation. |
| 18 | collaboration requirements | `DEFER` | Current INK architecture is single-user/local-first. History patches and stable IDs are useful prerequisites, but no real-time multi-user protocol is authorized in this task. | Penpot provides real-time team collaboration and a full server architecture. Preserve future compatibility by using stable IDs, file revisions and explicit transactions, but defer presence, CRDT/OT-style conflict semantics, websockets and team permissions to a later work order. |
| 19 | AI / Recipe / procedural capabilities | `RETAIN` | `recipe/recipe-engine.js` has parameterized operations, deterministic replay, checkpoints/rollback/cancel, role schemas and capability checks. `ai/ai-core.js` has propose/preview/approval/execute/rollback/audit boundaries. `vector/vector-core.js` + `repeat/repeat-identity.js` preserve deterministic procedural repeat identity. `recompute/dependency-graph.js` preserves dependency-aware recompute. `flora/index.js` installs a bounded FLORA action layer. | These are differentiating INK capabilities. Their product-boundary status remains governed separately; editor refactors must preserve data compatibility and callable capability boundaries rather than flattening them into generic Penpot-like shapes. |

## 5. Can INK remain the architectural core?

**Yes.**

The current source already contains the difficult low-level foundations that would be wasteful and risky to replace:

- structured editable vector/Bézier geometry;
- SVG import/export without mandatory raster flattening;
- affine object transforms;
- scoped patch history;
- verified local recovery;
- incremental spatial indexing;
- tiled / Canvas / WebGL rendering and natural-media behavior;
- deterministic repeat identity;
- semantic/material/dependency/recompute structures;
- Recipe and AI preview/approval/rollback/audit boundaries.

The principal gap is not “a drawing engine”. The principal gap is a mature **editor object model and interaction layer** around the existing engine, followed by a **cloud file adapter**.

Therefore the target should remain:

```text
INK document/vector/render/history core
+ explicit editor container/component/layout semantics
+ mature snapping/transform/overlay interaction
+ cloud file/revision adapter
= INK Cloud Editor
```

## 6. Highest-value editor gaps

Ordered as dependency/gap priority, not implementation authorization:

1. **Frame/container + unified nested hierarchy**
   - Needed before component instances, responsive layout and deep selection can be cleanly defined.
2. **Reusable component / instance / override / variant model**
   - INK repeats/material instances are related procedural concepts but are not a substitute for general reusable components.
3. **Responsive constraints + deterministic flex/grid layout**
   - Can build on dependency/recompute, but needs explicit container/child layout properties.
4. **Persistent rulers/guides + scalable smart snapping**
   - Existing smart guides are transient and page scanning is not the long-term scaling model.
5. **Mature transform interaction layer**
   - Separate preview modifiers from committed history transactions; improve nested coordinate-space behavior.
6. **Richer text and visual effects**
   - Preserve simple current objects while adding richer typography/effects incrementally.
7. **Editor overlay architecture**
   - Formalize overlays for selection handles, nodes, guides, frames and layout affordances separately from artwork rendering.
8. **Cloud file/revision/media adapter**
   - Add remote persistence without coupling the document model directly to one backend.
9. **Worker boundary for snap/geometry queries**
   - Introduce only where profiling shows main-thread geometry/editor queries becoming a limit.

## 7. Penpot concepts worth reimplementing cleanly in INK

The following are architectural concepts, not source-copy instructions:

### 7.1 Shape/container feature model

Adopt an INK-native common editor-object contract with optional capabilities rather than multiplying unrelated object types. Existing `id`, `matrix`, `opacity`, semantic metadata and dependency edges provide a migration base.

### 7.2 Transform preview → commit boundary

Penpot's transform flow separates high-frequency preview/modifier state from committed changes. INK can reproduce this pattern in JavaScript:

```text
pointer interaction
→ ephemeral transform preview
→ snap/layout resolution
→ one bounded HistoryManager transaction
→ spatial/recompute/render invalidation
```

This fits current `editor/transform.js`, `HistoryManager`, spatial indexing and render invalidation.

### 7.3 Dedicated snapping index

Penpot's worker-side snap index demonstrates a useful separation:

```text
geometry changes
→ update snap index
→ query candidates by axis/range
→ return snap delta + guide descriptors
```

INK can implement the same concept using its existing stable IDs/quadtree plus a dedicated snap index, without copying ClojureScript code.

### 7.4 Frame/container before layout

A general Frame/container should own children and define local coordinate/layout context. Flex/grid and component semantics should depend on that container, not be added as special cases to artboard or group code.

### 7.5 CSS-like flex/grid concepts

Use familiar properties (direction, alignment, gap, padding, tracks, placement, absolute/static participation) but implement them with INK's own deterministic geometry/recompute code.

### 7.6 Components/instances/variants as explicit metadata

Keep:
- master/component identity;
- instance identity;
- override map;
- detach state;
- variant/property metadata;
- migration/version fields.

This resembles concepts already present in INK material/repeat instance metadata and can be designed without replacing those procedural systems.

### 7.7 Versioned cloud-file envelope

Penpot's revision/feature/migration metadata is a useful reference. INK cloud persistence should add an envelope around the existing INK document:

```text
fileId
revision
formatVersion
featureFlags
migrationIds
document payload
media/asset refs
savedAt / modifiedAt
```

Local `InkStore` remains the offline/recovery path.

## 8. Penpot implementation details that should not be imported

### 8.1 Do not replace INK's JavaScript architecture with Penpot's stack

Do not import the full ClojureScript/React frontend, Clojure/JVM backend, or their state/event framework. This would turn an editor evolution into a platform rewrite and discard working INK subsystems.

Classification: `DO_NOT_IMPORT`.

### 8.2 Do not import Penpot render implementation as the INK renderer

INK already has Canvas/WebGL natural-media, tiles, resource budgets and its own vector renderer. Penpot's render/WASM implementation may be studied for concepts, but replacing INK rendering would create unnecessary regression risk.

Classification: `DO_NOT_IMPORT`.

### 8.3 Do not import the full collaboration/server topology before need is proven

Real-time collaboration, server workers, team permission infrastructure and distributed synchronization are outside this work order. First define stable cloud file/revision boundaries.

Classification: `DEFER` for capability; `DO_NOT_IMPORT` for wholesale implementation.

### 8.4 Do not copy Penpot source into INK under this work order

Penpot source is MPL-2.0. The current governance explicitly permits studying architecture and source locations but does not authorize code reuse. Any future direct reuse requires an explicit work order plus license/dependency/maintenance review.

Classification: `DO_NOT_IMPORT` under `INK-CLOUD-001`.

## 9. Smallest safe first implementation slice after this audit

Recommended next MR work order:

**`INK Editor Frame + Nested Hierarchy Foundation v0.1`**

Bounded scope:

1. add an explicit `frame`/container object model to the INK document schema;
2. define parent/children ownership and local/world transform rules;
3. make selection/bounds/hit-test/history/spatial index operate correctly for one level of nested frames;
4. expose the frame in the existing Layers panel as a nested tree;
5. preserve SVG/native serialization and document migration;
6. add regression tests for existing stroke/path/text/image/group behavior.

Explicitly exclude from this first slice:

- cloud backend;
- collaboration;
- components/variants;
- flex/grid;
- new renderer;
- Penpot source reuse;
- AI/Recipe behavior changes.

Why this slice first: Frame/container hierarchy is the dependency root for components, constraints, flex/grid, guide scoping and more mature nested selection. It can be added while leaving the existing render/history/storage architecture intact.

## 10. Regression-protected INK capabilities

Future editor work should treat the following as protected unless a later MR work order explicitly changes them:

1. **Editable vector geometry**
   - Bézier anchors/handles/modes;
   - non-rasterized path structure;
   - boolean results remaining editable where currently supported.
2. **Structured SVG interoperability**
   - import/export of supported path/shape/group/text/transform/gradient/clip/mask data;
   - stable/normalized IDs and unsupported-feature reporting.
3. **History**
   - target-scoped patch history;
   - undo/redo;
   - timeline navigation;
   - bounded transaction semantics.
4. **Local persistence/recovery**
   - IndexedDB primary storage;
   - fallback storage;
   - integrity verification;
   - previous/checkpoint recovery.
5. **Stylus / drawing / natural media**
   - pressure/tilt input handling;
   - natural-media rendering;
   - Canvas fallback and WebGL path.
6. **Render/export architecture**
   - dual workspace/artboard behavior;
   - tiled rendering/export and resource budget behavior;
   - PDF/PNG/SVG/export surfaces already present.
7. **Spatial performance foundation**
   - incremental quadtree;
   - object-ID based incremental updates.
8. **Procedural/recompute identity**
   - stable repeat instance IDs;
   - dependency graph;
   - material/recompute relationships.
9. **Recipe execution contract**
   - role schema;
   - deterministic replay;
   - checkpoint/rollback/cancel;
   - editable structure preservation.
10. **AI safety/control contract**
   - propose/preview/explicit approval/execute;
   - document-version check;
   - audit trail;
   - rollback.
11. **FLORA integration boundary**
   - preserve existing callable/action integration while its final product-boundary classification remains governed separately.

“Regression-protected” here does not change `BOUNDARY_PENDING` items into accepted Core. It means the cloud/editor refactor must not silently break or erase those existing data/behavior contracts before MR makes a separate product-boundary decision.

## 11. Architecture direction

Recommended layer boundary:

```text
UI / interaction
  ├─ selection / transform preview / overlays
  ├─ layers tree / frame / component / layout UI
  └─ ruler / guide / snapping UI
          ↓
Editor domain
  ├─ container + hierarchy
  ├─ component/instance/variant
  ├─ constraints + flex/grid
  └─ transaction commands
          ↓
Existing INK core
  ├─ document + migrations
  ├─ vector / stroke / image
  ├─ history
  ├─ spatial / geometry
  ├─ render / natural media
  ├─ material / repeat / recompute
  └─ Recipe / AI bounded interfaces
          ↓
Persistence adapters
  ├─ InkStore local/recovery
  ├─ browser file import/export
  └─ future cloud file/revision/media adapter
```

This keeps cloud transport outside the document model and keeps editor semantics outside low-level rendering.

## 12. Audit limits / known gaps

- This task is static architecture/source audit only; no new browser Runtime QA was authorized or executed.
- Penpot was reviewed as an architecture reference at the pinned `develop` head above; this audit does not claim exhaustive coverage of Penpot.
- Collaboration is intentionally deferred.
- No decision is made here to move FLORA/AI/Recipe from `BOUNDARY_PENDING` into certified Core.
- No Runtime code, package branch or `main` branch is modified by this task.

## 13. Required answers — concise record

1. **Can INK remain the architectural core?** Yes. Existing geometry, history, storage, render, spatial and procedural systems justify evolution rather than replacement.
2. **Highest-value gaps?** Frame/nested hierarchy; components/instances/variants; responsive flex/grid; persistent guides and scalable snapping; mature transform interactions; rich text/effects; editor overlays; cloud file adapter; workerized geometry/snap queries.
3. **Penpot concepts cleanly reimplementable in INK JS?** Shape/container feature model; preview→commit transforms; snap index/worker boundary; frame-scoped hierarchy; CSS-like flex/grid; explicit component/instance overrides; versioned file envelope.
4. **What should not be imported?** Penpot's full language/runtime/backend stack; renderer replacement; full collaboration topology at this stage; any source-code copy without explicit MPL/dependency review.
5. **Smallest safe next slice?** Frame + nested hierarchy foundation only.
6. **Regression-protected capabilities?** Vector/SVG, history, recovery, stylus/natural media, render/export, spatial index, procedural identity/recompute, Recipe/AI control contracts and existing FLORA integration boundary.

---

DEV result for `INK-CLOUD-001`: architecture audit complete; Runtime/product/package mutation count remains zero.
