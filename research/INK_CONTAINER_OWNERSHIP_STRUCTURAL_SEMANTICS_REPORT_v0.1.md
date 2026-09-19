# INK Container / Ownership / Structural Semantics Report v0.1

STATUS: `DEV_IMPLEMENTATION_COMPLETE / DEV_HANDOFF_PREPARATION / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-003`

BRANCH: `work/ink-cloud-003`

BASE_BRANCH_HEAD_AT_START: `e9634788fb333f2b1c366cffd06a3b91fd7398a9`

PRODUCT_IMPLEMENTATION_HEAD: `753ebb32647304ebe15db35bb3b17b680674baab`

DEV_VERIFICATION_CHECKPOINT: `2cfac99e2984e5c1bb4d973e76bd602429aa7086`

> The final handoff commit cannot contain its own resulting SHA. The exact final branch HEAD is reported in the final branch-local DEV progress context and DEV handoff response.

## 1. Scope

This report covers only the bounded shared-core work authorized by:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

The task stabilizes container / ownership / inherited structural semantics before Cloud implementation.

No Cloud backend, authentication, collaboration, components, constraints, flex/grid, cross-Layer Frame reparent, full Group-selection redesign, package promotion, certification, or version promotion is included.

## 2. Final container-role contract

### Frame

`Frame` remains an explicit rectangular structural container.

Contract:

- owns an ordered `children[]` array;
- may be nested;
- has explicit width / height;
- has its own local transform;
- participates in inherited visibility / lock / opacity;
- remains the future structural target for later constraints / layout / component placement;
- is not merged with Group.

### Group

`Group` remains a structural grouping container.

Contract:

- owns an ordered `children[]` array;
- extent derives from child content;
- participates in local/world transform ancestry;
- participates in inherited visibility / lock / opacity;
- remains interaction-atomic on the canvas for Group descendants under the existing interaction model;
- is not reclassified as Frame.

Group descendants are now structurally traversable without silently redesigning existing Group canvas-selection behavior.

### Repeat

`Repeat` remains a procedural generator, not an ordinary structural container.

Contract:

- Repeat itself remains an ordinary page object at its structural owner location;
- `source` and generated `instances` are not traversed as ordinary Frame / Group ownership children;
- stable Repeat identity remains separate from structural container ownership;
- no Repeat → Frame/Group reclassification occurs.

## 3. Ownership invariants

The implemented structural contract is:

1. Every ordinary structural object is located in exactly one structural owner array.
2. A top-level object belongs to exactly one Layer `objects[]` array.
3. A nested object belongs to exactly one Frame or Group `children[]` array.
4. Nested `parentId` is normalized to the actual structural parent.
5. Top-level stale `parentId` is removed by migration normalization.
6. Duplicate structural IDs are rejected during normalization.
7. Duplicate ownership of the same object reference is detected by integrity logic.
8. Cyclic structural ownership is rejected/detected.
9. Child-array order is authoritative.
10. Same-Layer Frame reparent remains the only supported Frame reparent domain.
11. Cross-Layer Frame reparent remains rejected before structural mutation.

Migration uses one structural-normalization state across the document Layer trees so structural ID collisions are not scoped only to one container.

## 4. Group / Frame nesting rules

Supported structural combinations at source/model level:

- Group inside Frame;
- Frame inside Group;
- nested Frame;
- nested Group.

Traversal uses a common structural-container predicate while retaining distinct object types.

### Structural traversal

`walkPageObjects(page)` recursively traverses Frame and Group children and records:

- Layer;
- structural parent;
- parent array;
- local object index;
- root object index;
- ancestry IDs;
- ancestry types;
- Group ancestry;
- depth;
- parent world matrix;
- object world matrix;
- structural role;
- render order;
- effective inherited state.

### Rendering traversal

Renderer behavior remains recursive:

`Layer → Frame / Group → child`

Each structural level preserves its own transform and opacity through the existing canvas save/transform/restore stack.

### Selection / hit-test boundary

The existing Group interaction boundary is preserved.

- Group itself remains selectable.
- Descendants beneath a Group remain structurally indexed but are marked `interactionExposed = false` for normal canvas interaction.
- This prevents the structural-model improvement from silently turning Group into a deep-selection UX redesign.
- Frame deep selection behavior remains distinct; the accepted Frame normal-vs-deep selection rule is retained.
- Layers-panel direct structural selection behavior from the accepted Frame foundation is not expanded into a full Group tree redesign.

## 5. Transform / coordinate contract

The accepted hierarchy equation remains unchanged:

`world = ancestorWorld × local`

For Frame / Group combinations:

- each child local matrix is interpreted relative to its structural parent;
- complete world matrices are derived through ancestry;
- Group / Frame nesting therefore uses the same deterministic coordinate contract.

Same-Layer Frame reparent keeps the accepted world-preserving rule:

`newLocal = inverse(newParentWorld) × oldWorld`

No cross-Layer reparent capability was added.

## 6. Effective state semantics

The structural traversal now computes all three inherited states.

### effectiveVisible

`effectiveVisible = ancestorVisible AND objectVisible`

Applied from:

`Layer → Frame / Group ancestry → object`

Therefore a hidden Layer or hidden structural ancestor makes descendants effectively hidden.

### effectiveLocked

`effectiveLocked = ancestorLocked OR objectLocked`

Applied from:

`Layer → Frame / Group ancestry → object`

Therefore a locked Layer or locked structural ancestor makes descendants effectively locked.

### effectiveOpacity

`effectiveOpacity = product(Layer opacity, ancestor container opacity, object opacity)`

Opacity inputs are normalized/clamped to the existing 0–1 document behavior before/while traversing.

Renderer behavior composes opacity through nested canvas state. Structured SVG export composes Layer / Group / Frame opacity using nested SVG groups.

## 7. Z-order / structural order contract

Source-of-truth order:

1. Layer array order.
2. Within a Layer, top-level `objects[]` order.
3. Within a structural container, `children[]` order.
4. Recursive nested traversal defines deterministic render-order metadata.

Hit-test ordering is aligned with that structural/render order:

- later Layer = visually/hit-test higher;
- later top-level object = higher;
- later child render order = higher for deep hits;
- normal Frame selection preserves ancestor-before-descendant behavior where required;
- deep Frame selection may prefer deeper rendered children;
- Group descendants remain excluded from direct canvas hit candidates under the preserved Group-atomic interaction rule.

Marquee, lasso, eraser and stroke-edit paths use the same effective lock / interaction exposure boundary where touched.

## 8. Spatial behavior

`PageSpatialIndex` rebuilds from structural traversal and retains hierarchy metadata on indexed objects.

Incremental update behavior is bounded for correctness:

- ordinary safe object updates may remain incremental;
- Frame / Group structural objects trigger fallback behavior where subtree bounds may change;
- objects under Group ancestry also reject unsafe isolated incremental sync so the caller rebuilds the hierarchy-aware index.

This avoids retaining stale Group-derived bounds while preserving the existing quadtree architecture.

## 9. Serialization / migration / integrity

### Native save/load

Frame / Group remain plain structured document data.

Current migration:

- normalizes structural ownership;
- repairs child `parentId`;
- removes stale top-level `parentId`;
- normalizes Group visibility / lock defaults;
- rejects duplicate structural IDs;
- rejects cyclic / duplicate ownership states rather than silently serializing ambiguity.

### Integrity inspection

Integrity now reports structural categories including:

- duplicate IDs;
- duplicate ownership;
- structural cycles;
- stale top-level parent IDs;
- invalid child parent IDs.

### SVG

The primary INK SVG exporter:

- skips objects with `visible === false`;
- preserves recursive Frame / Group structure;
- preserves nested opacity;
- does not raster-flatten structural children.

The vector-core structural serializer also preserves Group/Frame grouping and hidden Group behavior where that serializer is used.

### Repeat

Repeat source remains outside ordinary Frame/Group structural traversal and is not assigned structural `parentId` ownership.

## 10. Files changed

### Product source

- `product/source/src/document/hierarchy.js`
- `product/source/src/document/integrity.js`
- `product/source/src/document/migration.js`
- `product/source/src/document/model.js`
- `product/source/src/ink.js`
- `product/source/src/spatial/page-spatial-index.js`
- `product/source/src/vector/vector-core.js`

### QA

- `qa/core/tests/unit/container-structural-semantics-v0.1.test.mjs`
- `qa/core/tests/unit/container-structural-source-v0.1.test.mjs`

### Control / report

- `ACTIVE/INK_DEV_PROGRESS.md`
- `research/INK_CONTAINER_OWNERSHIP_STRUCTURAL_SEMANTICS_REPORT_v0.1.md`

## 11. Checks and evidence

Exact product implementation reviewed:

`753ebb32647304ebe15db35bb3b17b680674baab`

Branch implementation commits:

1. `fc4c79b3c855681ac176baee07e9680e36643df9`
2. `899700354ec5f369e05bddf2c540be1fe6aecb79`
3. `3a5272c912fe776a55ee0b65e4982e340092d637`
4. `86943d115ae4729596b4d1aad76654ce044a8eb5`
5. `753ebb32647304ebe15db35bb3b17b680674baab`

Source/static review covered:

- Frame vs Group role distinction;
- structural traversal;
- Group-in-Frame / Frame-in-Group / nested structures;
- world/local transform contract;
- inherited visibility / lock / opacity;
- structural / render / hit order;
- Group interaction boundary;
- spatial invalidation;
- migration / integrity;
- main structured SVG export;
- Repeat ownership boundary;
- format version.

New QA suites cover, by source definition:

- Group inside Frame inherited state / transform;
- Frame inside Group and nested Group traversal;
- deterministic structural/hit order;
- same-Layer world-preserving reparent and cross-Layer rejection;
- stale parent repair;
- duplicate ID / cycle rejection;
- duplicate ownership integrity;
- Repeat source ownership boundary;
- Group spatial metadata / invalidation;
- History undo/redo with nested Group transform;
- hidden Group structured SVG;
- static source-contract assertions.

Existing compatibility suite retained:

`qa/core/tests/unit/frame-regression-v0.1.test.mjs`

It covers:

- legacy Group normalization;
- InkStore Frame hierarchy round-trip;
- stylus normalization;
- editable vector SVG/import;
- deterministic Repeat identity.

### Execution limitation

Hosted GitHub Actions remain unavailable because quota is exhausted.

The active DEV tool environment does not contain a checkout of this work branch capable of executing the repository Node test suites. Therefore:

- source/static review evidence is recorded;
- authored unit suites are identified but are **not falsely reported as executed PASS**;
- browser/runtime validation is explicitly deferred.

## 12. Schema / version conclusion

`FORMAT_VERSION_CHANGE = 0`

Current:

`FORMAT_VERSION = 4`

No new serialized top-level document envelope is required for this task.

The change stabilizes semantics of already existing Frame / Group ownership data and migration/integrity behavior. A format-version bump is therefore not required.

No product/app version promotion was performed.

## 13. Compatibility conclusion

Source-level compatibility is retained for the Work Order protection set:

- legacy Group documents;
- accepted Frame documents;
- stroke/stylus paths;
- vector path structure;
- text;
- image/raster;
- Repeat identity boundary;
- History hierarchy/transform behavior;
- spatial hierarchy indexing;
- local structured save/load path;
- structured SVG path where touched;
- semantic traversal that already recognizes Group/Frame children.

No renderer replacement or raster-flattening shortcut was introduced.

## 14. Known limitations

- Full browser pointer interaction is not Runtime-verified in this task.
- Group deep-selection UX is intentionally not redesigned.
- Layers-panel full structural drag/drop UX is intentionally not redesigned.
- Cross-Layer Frame reparent remains unsupported by design.
- Group/container spatial subtree edits may deliberately force a full index rebuild instead of an isolated incremental update.
- No Cloud persistence, components, constraints, layout, collaboration, authentication or remote storage is implemented.
- FLORA / AI / Recipe product-boundary status is unchanged.

## 15. Runtime QA debt

`RUNTIME_QA_DEFERRED`

Deferred browser/runtime evidence includes:

- rendered Group/Frame nesting visual equivalence;
- normal/deep pointer hit behavior;
- Group atomic interaction in live UI;
- inherited lock/visibility interaction;
- nested opacity visual result;
- browser save/open round-trip;
- Layers-panel live interaction;
- Canvas/WebGL behavior with nested containers;
- browser SVG export/open inspection.

No Runtime-verified or certified claim is made.

## 16. Scope control

Relative to branch start `e9634788fb333f2b1c366cffd06a3b91fd7398a9`, changes remain inside the authorized shared structural core, bounded QA, progress, and required report.

Explicitly unchanged:

- `package/ink-current`;
- `main` merge state;
- Cloud backend;
- authentication;
- collaboration;
- components / variants;
- constraints / auto-layout;
- cross-Layer reparent;
- product/document version.

## 17. DEV conclusion

The bounded INK-CLOUD-003 source implementation is complete and ready for MR source review, with Runtime QA debt explicitly retained.

Required handoff state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-003
BRANCH = work/ink-cloud-003
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
