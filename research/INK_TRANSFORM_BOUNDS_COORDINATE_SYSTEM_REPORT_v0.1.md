# INK Transform / Bounds / Coordinate System Report v0.1

STATUS: `DEV_IMPLEMENTATION_COMPLETE / DEV_HANDOFF_PREPARATION / RUNTIME_QA_DEFERRED`

TASK: `INK-CLOUD-004`

BRANCH: `work/ink-cloud-004`

ACCEPTED_BASELINE_PROMOTION: `d340664cf554755abfa146f607c05c03200e8799`

BASE_BRANCH_HEAD_AT_START: `2d68ae4aa5dfdd29f1c1a864ccd3ddff5e96eb43`

PRODUCT_IMPLEMENTATION_HEAD: `f49210b45878377bccdc18991e9300f66ab7a5ac`

DEV_VERIFICATION_CHECKPOINT: `15d46e733a8989b4ebd71efcc38a78e06f3dfeee`

> The final handoff commit cannot contain its own resulting SHA. The exact final branch HEAD is recorded in the DEV handoff response after the branch-local handoff checkpoint is created.

## 1. Scope

This report covers only the bounded pre-Cloud shared-core work authorized by:

`ACTIVE/INK_CURRENT_WORK_ORDER.md`

The task stabilizes the geometric meaning of local/world/screen transforms and geometry bounds without redesigning the transform UI.

Explicitly not implemented:

- Cloud backend / remote persistence;
- authentication;
- collaboration / presence;
- components / instances / variants;
- constraints;
- flex/grid/auto-layout;
- persistent rulers/guides;
- full snapping-engine redesign;
- cross-Layer Frame reparent;
- renderer replacement;
- package promotion;
- certification/version promotion.

## 2. Final coordinate-space contract

INK now uses the following explicit meanings.

### Object-local space

The object's editable geometry is defined in its own local coordinates.

Authoritative serialized geometry includes:

- the object's six-number affine `matrix`;
- object-native geometry such as stroke points, path anchors, shape dimensions, text/image geometry;
- Frame `width` / `height`.

Derived world/screen bounds are not authoritative serialized geometry.

### Parent / container space

For a nested object, its local matrix is relative to its structural parent container.

The parent may be:

- Frame;
- Group;
- Layer root / page world identity.

### Page / world space

The accepted hierarchy equation remains:

`world = ancestorWorld × local`

The shared helper is:

`Matrix.toWorld(parentWorld, local)`

World coordinates are derived editor/runtime state.

### Viewport / screen space

Viewport/screen conversion remains an editor concern.

Creation/layout camera and layout viewport transforms do not rewrite serialized object-local geometry.

Layout screen→world conversion now uses safe inversion rather than silently manufacturing an identity inverse.

## 3. Affine matrix contract

The authoritative transform representation remains:

`[a, b, c, d, e, f]`

No matrix-engine replacement occurred.

New shared affine helpers:

- `Matrix.isFinite(matrix)`
- `Matrix.determinant(matrix)`
- `Matrix.isInvertible(matrix, epsilon)`
- `Matrix.tryInvert(matrix, epsilon)`
- `Matrix.toWorld(parentWorld, localMatrix)`
- `Matrix.toLocal(parentWorld, worldMatrix, epsilon)`

### Inversion

Operations that require world→local conversion use safe inversion.

If the parent transform is singular/non-invertible:

- the operation rejects;
- no identity inverse is substituted in the editable operation;
- mutation is not partially committed.

The legacy `Matrix.invert()` compatibility method remains available for untouched legacy callers, but the hierarchy/editor paths covered by this work order no longer depend on its silent identity fallback.

### Finite values

Derived local matrices are checked for finite values before mutation.

### Reflection / negative scale

Negative scale remains supported.

Reflection is not normalized away.

### Near-zero / singular interactive scale

Interactive transform-handle scaling clamps an exact/near-zero component away from singular zero with a small epsilon while preserving sign.

This keeps reflection deterministic and prevents the live transform path from intentionally manufacturing a zero-determinant matrix.

Already-existing singular document matrices are not silently rewritten by migration in this work order; inverse-dependent editor operations instead fail safely.

## 4. Bounds taxonomy

The task establishes explicit geometry-bound concepts.

### Local geometry bounds

Bounds in object-local coordinates before object/container transforms.

For Frame:

`{ x: 0, y: 0, w: frame.width, h: frame.height }`

### World geometry bounds

Local/container geometry transformed through complete ancestry into page/world space.

### Frame bounds

Frame geometry is explicit.

Frame world geometry bounds come from:

`Frame width/height + complete world matrix`

Child contents do not redefine Frame geometry dimensions.

### Group/container bounds

Group remains content-derived.

A Group:

- has no persistent width/height;
- derives world geometry bounds from the union of descendant child geometry;
- does not bake child geometry into the Group transform.

Empty Group fallback is explicit and stable:

- 1 × 1 world-space bounds;
- anchored at the Group world-space origin.

This fallback exists for selection/index stability only and is not serialized as Group geometry.

### Selection bounds

Selection bounds are the union of selected transform roots.

If both an ancestor and its descendant are selected, the descendant is collapsed from the transform-root set.

Therefore the same root set now governs:

- transform mutation;
- selection bounds;
- selection overlay geometry.

Derived selection bounds are not serialized.

## 5. Transform semantics

### Move / rotate / scale

Editable world-space transforms are converted back to object-local space with:

`local = inverse(parentWorld) × nextWorld`

The parent inverse must exist before mutation.

### Nested transform

Nested objects preserve the complete ancestry contract.

Container transforms affect descendants through ancestry; child local matrices remain local.

### Ancestor + descendant multi-selection

`collapseTransformRoots()` removes selected descendants whose ancestor is also selected.

This prevents double transformation and now also prevents selection bounds from counting geometry outside the actual transform-root set.

### Batch atomicity

Multi-object world transforms preflight every target local matrix before any target is mutated.

This covers the bounded editor paths for:

- selection move/nudge;
- transform field move/scale/rotate;
- align/distribute;
- interactive drag transforms via the existing `applyObjectMatrices()` preflight path.

If one selected target has non-invertible parent ancestry, the batch rejects before partial object mutation.

### History behavior

Existing `HistoryManager.pushScoped()` catches operation exceptions, restores the pending scoped state, clears the pending transaction, and rethrows.

This complements the transform preflight rule and prevents a rejected transform from creating a valid history checkpoint.

## 6. Same-Layer reparent contract

Accepted same-Layer Frame reparent remains world-preserving.

The local transform is derived as:

`newLocal = inverse(newParentWorld) × oldWorld`

INK-CLOUD-004 changes the mutation order:

1. resolve source/target;
2. validate same-Layer rule;
3. compute `nextLocalMatrix`;
4. reject if target ancestry is non-invertible;
5. only then detach source;
6. assign the new local matrix/parent ownership;
7. insert into target array.

Therefore a singular target Frame cannot leave the object detached or half-reparented.

Cross-Layer Frame reparent remains prohibited.

## 7. Frame transform vs Frame geometry resize

These meanings are now explicitly separated.

### Frame transform

Frame transform changes the Frame affine matrix.

Children follow through ancestry.

### Frame geometry resize

Frame geometry resize changes:

- `frame.width`
- `frame.height`

It does not change:

- Frame matrix;
- child local matrices;
- child geometry.

For this v0.1 foundation, a single selected Frame's W/H inspector fields are treated as Frame geometry dimensions.

Aspect lock may update the paired Frame geometry dimension proportionally.

Transform handles remain matrix transforms; this task does not redesign the transform UX or imply future constraints/auto-layout behavior.

## 8. Group bounds contract

Group remains behaviorally distinct from Frame.

Rules:

- no persistent width/height;
- bounds are child-derived;
- complete Group/Frame ancestry participates in child world bounds;
- empty Group has the explicit stable fallback described above;
- Group matrix transform does not bake child geometry.

No schema field was added to persist Group bounds.

## 9. Spatial / hit-test / selection alignment

The shared renderer world-geometry bound path now uses the explicit bounds helpers.

The same renderer world bounds continue to feed:

- `PageSpatialIndex`;
- marquee candidates;
- lasso candidates;
- selection overlay;
- alignment/distribution;
- snapping feature extraction where current code reads indexed bounds.

Hit-test behavior:

- Frame/Group container hit testing uses the same renderer world bounds;
- ordinary-object hit testing converts world→local only with safe inversion;
- singular ordinary objects are not falsely hit through an identity inverse.

Stroke editing / eraser behavior:

- node/handle editing requires an invertible object world transform;
- segment/eraser world→local conversion skips/rejects singular transforms safely.

No future snapping/guide subsystem was introduced.

## 10. Serialization / migration contract

No new authoritative derived bound state is serialized.

Source/static verification found no document-model/migration fields for:

- `worldBounds`;
- `selectionBounds`;
- `containerBounds`.

Authoritative serialized geometry remains:

- local affine matrices;
- Frame width/height;
- object-native geometry.

Existing Frame/Group migration rules from INK-CLOUD-002/003 remain unchanged.

No screen-space geometry is written into document objects by this task.

Structured SVG remains based on object-local matrices and structural nesting; no derived world-bound cache is introduced.

## 11. Files changed

### Product source

- `product/source/src/core/math.js`
- `product/source/src/document/hierarchy.js`
- `product/source/src/editor/bounds.js` — new
- `product/source/src/editor/index.js`
- `product/source/src/editor/transform.js`
- `product/source/src/ink.js`

### QA

- `qa/core/tests/unit/transform-bounds-coordinate-v0.1.test.mjs` — new

### Control / report

- `ACTIVE/INK_DEV_PROGRESS.md`
- `research/INK_TRANSFORM_BOUNDS_COORDINATE_SYSTEM_REPORT_v0.1.md`

## 12. Checks actually executed

### 12.1 Node pure-core/editor subset

Executed during implementation:

- existing core tests: 3;
- existing editor-selection tests: 2;
- transform/bounds tests at that checkpoint: 6.

Result:

`11 / 11 PASS`

Coverage included:

- normal matrix inverse round-trip;
- core bounds helpers;
- affine transformed bounds;
- marquee contain/intersect;
- lasso bound filtering;
- singular inversion rejection;
- reflection preservation;
- singular-parent mutation rejection;
- atomic object-matrix transform;
- Frame/Group bounds;
- selection-root collapse;
- Frame geometry resize.

### 12.2 Current GitHub branch exact-source execution

After final multi-selection batch hardening, current source text was loaded directly from `work/ink-cloud-004` for:

- `core/math.js`;
- `core/geometry.js`;
- `editor/transform.js`;
- `editor/bounds.js`.

Nine current-source contract checks were executed.

Result:

`9 / 9 PASS`

Checks:

1. singular inversion rejection;
2. negative reflection round-trip;
3. single world transform rejects before mutation;
4. batch world transform preflights atomically;
5. Frame explicit world geometry bounds;
6. Group child-derived bounds and empty fallback;
7. selection transform-root collapse;
8. Frame geometry resize preserves matrix/child local geometry;
9. near-zero reflection-preserving scale clamp.

### 12.3 Source/static checks

PASS:

- no unsafe `M.invert()` / `Matrix.invert()` remains in the touched hierarchy/editor/INK inverse-dependent paths;
- reparent computes `nextLocalMatrix` before source detach;
- same-Layer/cross-Layer guard remains active;
- model/migration do not persist derived world/selection/container bounds;
- `FORMAT_VERSION = 4`;
- History scoped operations restore and clear pending state on transform exceptions.

## 13. Tests authored but not executed as final full Node suite

Current:

`qa/core/tests/unit/transform-bounds-coordinate-v0.1.test.mjs`

contains seven tests.

The first six were executed in the Node subset run.

The seventh batch-preflight test was added after the final atomic-batch hardening. Its exact current-source behavior was executed and passed in the 9/9 current-source check, but the complete seven-test file was not rerun through a full repository Node checkout.

No unexecuted Node test is reported as Node PASS.

## 14. Format / schema conclusion

`FORMAT_VERSION_CHANGE = 0`

Current:

`FORMAT_VERSION = 4`

Reason:

- no new serialized geometry envelope is required;
- local matrix representation is unchanged;
- Frame width/height already exist as serialized Frame geometry;
- Group remains content-derived without new persistent bounds;
- derived world/selection bounds remain runtime-only.

No product/app version promotion was performed.

## 15. Compatibility conclusion

The bounded source changes preserve the required compatibility surface:

- accepted INK-CLOUD-002 Frame documents;
- accepted INK-CLOUD-003 Group/ownership documents;
- legacy Group documents;
- stroke/stylus local geometry;
- editable vector path local geometry;
- text;
- image/raster;
- Repeat identity;
- History undo/redo architecture;
- ancestor-collapse selection transform;
- same-Layer reparent;
- hierarchy-aware spatial indexing;
- local save/load model;
- structured SVG local-matrix mapping;
- creation/layout camera model.

No document-format migration or renderer replacement was introduced.

## 16. Known limitations

- Existing documents may still contain already-created singular matrices; this task does not rewrite those documents automatically.
- Inverse-dependent editing on a singular object/ancestry is blocked or skipped until a valid transform exists.
- Single Frame W/H inspector fields now represent Frame geometry, while transform handles remain affine scaling. A future UX task may make this distinction more explicit visually.
- Empty Group 1×1 fallback is a derived interaction/index fallback, not persistent Group geometry.
- No oriented-bounds/rotated selection-box redesign was introduced; selection bounds remain world-axis-aligned geometry bounds.
- No persistent rulers/guides, constraints, auto-layout, component system, or snapping-engine redesign was added.
- No Cloud capability was added.

## 17. Runtime QA debt

`RUNTIME_QA_DEFERRED`

Not claimed Runtime-verified:

- pointer move/scale/rotate;
- negative-scale/reflection visual behavior;
- singular transform live interaction;
- Frame W/H inspector live resize;
- nested Frame/Group selection overlay;
- spatial/marquee/lasso/hit-test visual agreement;
- snapping visual agreement;
- browser project save/open;
- browser structured SVG inspection;
- creation/layout workspace camera interaction;
- Canvas/WebGL nested-container visual behavior.

No Runtime-verified or certified claim is made.

## 18. Scope control

Relative to branch start:

`2d68ae4aa5dfdd29f1c1a864ccd3ddff5e96eb43`

product mutation is limited to the authorized transform/bounds/coordinate foundation plus bounded QA and required control/report files.

Explicitly unchanged:

- `package/ink-current`;
- `main` merge state;
- Cloud backend;
- authentication;
- collaboration;
- components / variants;
- constraints / auto-layout;
- persistent ruler/guide system;
- cross-Layer reparent;
- FLORA / AI / Recipe product boundary;
- document/product version.

## 19. DEV conclusion

The bounded INK-CLOUD-004 source implementation is complete and ready for MR source review.

Required handoff state:

```text
TASK_STATUS = DEV_HANDOFF
TASK_ID = INK-CLOUD-004
BRANCH = work/ink-cloud-004
PRODUCT_SOURCE_MUTATION = BOUNDED / REPORTED
FORMAT_VERSION_CHANGE = 0
PACKAGE_MUTATION = 0
MAIN_MERGE = 0
RUNTIME_QA = DEFERRED
NEXT_ACTION = MR_REVIEW_REQUIRED
STOP
```
