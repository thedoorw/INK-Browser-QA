# INK Frame + Nested Hierarchy Implementation Report v0.1

STATUS: `DEV_IMPLEMENTATION_COMPLETE / MR_REVIEW_REQUIRED / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-002`

BRANCH: `work/ink-cloud-002`

IMPLEMENTATION_HEAD_AT_REPORT_PREPARATION: `c3ad0f425cba648c4a5c821724cf1f32c97ad4c7`

> Git commits cannot contain their own resulting SHA. The exact final handoff branch HEAD is therefore recorded in `ACTIVE/INK_DEV_PROGRESS.md` after the report commit is created.

## 1. Scope completed

Implemented the bounded Frame/container + nested hierarchy foundation authorized by `ACTIVE/INK_CURRENT_WORK_ORDER.md`.

No cloud backend, collaboration, authentication, components/variants, flex/grid, package promotion, version promotion, Penpot source copying, or renderer replacement was introduced.

## 2. Files changed

Product source:

- `product/source/src/document/hierarchy.js` — new Frame/container and hierarchy utilities.
- `product/source/src/document/index.js`
- `product/source/src/document/model.js`
- `product/source/src/document/integrity.js`
- `product/source/src/editor/selection.js`
- `product/source/src/editor/transform.js`
- `product/source/src/semantic/semantic-model.js`
- `product/source/src/spatial/page-spatial-index.js`
- `product/source/src/vector/vector-core.js`
- `product/source/src/ink.js`
- `product/source/styles.css`

QA:

- `qa/core/tests/unit/frame-hierarchy-v0.1.test.mjs`
- `qa/core/tests/unit/frame-editor-source-v0.1.test.mjs`
- `qa/core/tests/unit/frame-regression-v0.1.test.mjs`

Control/status:

- `ACTIVE/INK_DEV_PROGRESS.md`
- `working/WORKING_STATUS.md`

## 3. Frame schema/model

New INK-native `frame` object:

```text
id
type = "frame"
name
matrix[6]
width
height
opacity
visible
locked
children[]
parentId (only when nested)
```

Rules:

- Frame IDs and child IDs remain stable.
- `children[]` order is authoritative.
- A structural child receives exactly one `parentId`.
- Top-level objects have stale `parentId` removed during normalization.
- Older documents without Frames continue through the existing migration/sanitize path.
- Repeat remains a separate procedural type and is not converted into Frame.

## 4. Hierarchy and transform rules

`walkPageObjects(page)` supplies explicit hierarchy metadata:

- structural parent;
- parent array;
- local object index;
- ancestry;
- depth;
- parent world matrix;
- object world matrix;
- effective visibility/lock state.

World transform:

```text
world = parentWorld × local
```

Reparenting preserves appearance:

```text
newLocal = inverse(newParentWorld) × oldWorld
```

Cycle protection rejects:

- an object parented to itself;
- a Frame parented beneath its own descendant;
- a non-Frame target used as a Frame parent.

The model naturally supports deeper Frame nesting; one nested level is explicitly covered by the bounded evidence.

## 5. Selection / bounds / hit-test behavior

Frame bounds use Frame width/height transformed by its world matrix.

Child bounds are computed using the complete parent-world chain.

Selection transforms operate in world space and convert the result back to each selected object's local matrix. If both ancestor and descendant are present in a transform selection, the descendant is collapsed out so the same geometry is not transformed twice.

Bounded deep selection:

- normal canvas hit: Frame/container is selected before its nested child;
- `Alt` + canvas hit: deepest selectable nested child is preferred;
- Layers panel nested rows directly select Frame children.

Moving/scaling/rotating a Frame changes the Frame matrix; child local matrices remain unchanged, so children follow the Frame.

## 6. Layers panel

The existing Layers panel is retained.

Added only:

- Frame rows;
- ordered nested child rows;
- direct child selection;
- Frame visibility toggle;
- Frame lock toggle;
- nested indentation.

Existing layer rows, layer drag reorder, visibility, lock and opacity code remain in place.

No whole-UI redesign was performed.

## 7. History / spatial / recompute

History:

- reparent/frame creation uses existing `HistoryManager`;
- hierarchy operations use bounded document paths or page-layer scope where multiple parent containers are mutated;
- undo/redo restores hierarchy and local transforms.

Spatial:

- `PageSpatialIndex` now indexes nested Frame descendants with world-space bounds;
- items retain ancestry/depth/parent-world metadata;
- Frame transform invalidates/rebuilds nested spatial data;
- nested object sync remains compatible with the existing quadtree.

Recompute:

- semantic traversal now sees Frame descendants;
- dependency graph receives parent/child hierarchy through existing nested relation logic;
- Repeat generator identity remains intact.

No history, spatial, or recompute engine was replaced.

## 8. Existing object compatibility

Frame children can retain existing object forms including:

- stroke/stylus objects;
- text;
- image/raster objects;
- existing groups;
- vector paths;
- Repeat/procedural objects.

Nested stroke editor paths were hardened so node/handle movement, split and eraser operations use hierarchy world/local matrices and the actual parent array instead of assuming top-level layer ownership.

Existing Group remains a distinct object type and continues its previous behavior.

## 9. Serialization / migration / SVG

Native INK save/load:

- Frame is plain structured document data.
- Current JSON project serialization preserves Frame ID, children order and child IDs.
- existing migration/normalization restores deterministic parent ownership.
- `InkStore` can save/load the Frame hierarchy through the current integrity envelope and fallback storage behavior.

SVG:

- Frame exports as a structural `<g>` with Frame metadata.
- nested vector/path/text/image/stroke content remains structural.
- Frame export does not raster-flatten contents.
- vector-core SVG serializer also recognizes Frame containers.

## 10. Regression checks performed

Repository/local non-browser checks:

### Frame hierarchy suite

`8/8 PASS`

Covered:

1. Frame migration, IDs and ordered parent ownership.
2. Reparent preserves world appearance.
3. Frame transform carries children while retaining child local geometry.
4. Cycle rejection.
5. nested PageSpatialIndex coverage.
6. History undo/redo of hierarchy and transforms.
7. structured serialization/reload.
8. dependency/recompute + structural vector SVG Frame export.

### Existing-capability regression suite

`5/5 PASS`

Covered:

1. existing Group normalization;
2. `InkStore` Frame save/load;
3. stylus pressure/tilt normalization;
4. editable vector path SVG export/import;
5. deterministic Repeat stable identity.

### Static integration checks

Source checks cover:

- Frame hierarchy imports;
- Alt deep-selection hook;
- Frame renderer/container path;
- Layers nested tree;
- world-matrix nested stroke handling;
- Frame structural SVG metadata;
- explicit exclusions in the bounded Frame implementation.

A source scan after compatibility hardening found no remaining uses of these prior top-level-only assumptions in current `ink.js`:

- `found.layer.objects`
- `found.index`
- `item.layer.objects`
- `M.invert(found.object.matrix)`

## 11. Acceptance status

| Acceptance item | Status |
|---|---|
| Existing documents still migrate/open structurally | `SOURCE/UNIT PASS`; browser open `RUNTIME_QA_DEFERRED` |
| Frame contains existing object types | `SOURCE/UNIT PASS` |
| Frame move/scale/rotate preserves child relative geometry | `SOURCE/UNIT PASS`; pointer interaction `RUNTIME_QA_DEFERRED` |
| Child selection inside Frame | `SOURCE/STATIC PASS`; browser interaction `RUNTIME_QA_DEFERRED` |
| Reparent preserves world appearance | `UNIT PASS` |
| Undo/redo restores hierarchy/transforms | `UNIT PASS` |
| Save/reload preserves hierarchy/IDs | `UNIT PASS` |
| Spatial selection includes nested objects | `UNIT PASS` |
| Existing Group remains functional | `UNIT PASS` |
| No excluded capability introduced | `DIFF/STATIC PASS` |

## 12. RUNTIME_QA_DEFERRED

Per Current Work Order, GitHub Actions quota is exhausted.

Not claimed as Runtime-verified in this handoff:

- real browser pointer selection with normal/Alt deep selection;
- drag move/scale/rotate visual interaction;
- Layers panel visual interaction;
- Canvas/WebGL visual equivalence with nested Frame content;
- full browser project open/save interaction.

These are validation debt only. No package certification or Runtime-verified product claim is made.

## 13. Known limitations

- No drag-and-drop reparent UX was added; core reparenting plus Frame creation and nested selection are implemented.
- Group-internal selection semantics were not redesigned; this task adds Frame hierarchy, not a full object-tree redesign.
- Frame-contained natural-media strokes use the existing recursive object renderer rather than the top-level stroke-run batching optimization; correctness path is retained, performance browser evidence is deferred.
- Complex FLORA-specific mask behavior when manually nested inside Frame was not separately expanded or promoted; FLORA/AI/Recipe product boundaries remain unchanged.
- Collaboration, components, constraints/flex/grid, persistent ruler guides and cloud files remain future work.

## 14. Scope control

From the pre-DEV branch control head `59739e8305bad6050522664b03a8e6d5cd441c55`, DEV changes are limited to:

- authorized Frame/hierarchy `product/source/**`;
- bounded Frame QA;
- required DEV progress / working status;
- this implementation report.

`package/ink-current` was not updated.

`main` was not merged by DEV.

No product version/certification change was made.

## 15. DEV conclusion

The bounded Frame + Nested Hierarchy foundation is implemented at source level and is ready for MR source review.

Browser Runtime evidence remains explicitly deferred under the temporary quota constraint.
