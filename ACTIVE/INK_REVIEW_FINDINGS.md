# INK REVIEW FINDINGS

STATUS: `MR_REVISE`

TASK: `INK-CLOUD-002`

Reviewed fingerprint:

```text
BRANCH work/ink-cloud-002
HEAD   3ff5c61393fe6603e072fa587d954a159d239444
```

## MR result

`MR_REVISE / BOUNDED_FIX_ONLY`

The Frame + Nested Hierarchy foundation is substantially accepted at source level, but one structural semantic issue must be corrected before MR PASS.

## Passed findings

- Explicit Frame/container model exists.
- Stable child IDs and ordered child ownership are implemented.
- world/local transform conversion exists.
- reparent preserves geometric world transform.
- cyclic parenting is rejected.
- Frame descendants participate in spatial indexing.
- History/undo/redo, serialization and migration have bounded unit evidence.
- nested selection/transform integration is present.
- structural SVG output is preserved.
- existing Group/Stroke/Vector/Repeat compatibility received bounded regression coverage.
- no Cloud backend, collaboration, component, flex/grid, package promotion or Penpot source copy was introduced.
- Runtime/browser evidence remains correctly marked `RUNTIME_QA_DEFERRED`.

## Required revision

### Cross-Layer Frame / reparent semantic leak

Current editor helpers allow:

- `frameSelection()` to combine selected objects from different Layers into one Frame on the first selected Layer;
- `reparentObjectToFrame()` to move an object into a Frame located on another Layer.

The object's geometric world matrix is preserved, but Layer-level semantics may change:

- layer opacity;
- layer visibility;
- layer lock / interaction state;
- future layer-scoped behavior.

Therefore the current implementation cannot guarantee appearance/behavior preservation for cross-Layer reparenting.

### Required v0.1 fix

For this bounded foundation:

1. Frame creation from selection must require all selected objects to belong to the same Layer.
2. Reparent into a Frame must require source and target Frame to belong to the same Layer.
3. A rejected cross-Layer operation must leave hierarchy/transforms unchanged and return a clear failure/toast/result.
4. Add unit/source regression coverage proving the restriction.
5. Update implementation report and DEV progress.

Do not design cross-Layer semantic migration in this task.

Cross-Layer reparenting may be designed later as a separate feature if INK defines how effective layer opacity/visibility/lock semantics are preserved.

## Runtime QA

No change:

`RUNTIME_QA_DEFERRED`

GitHub Actions quota remains exhausted. No hosted Runtime test is required for this bounded revision.

## Gate

```text
INK-CLOUD-002
→ MR_REVISE
→ DEV bounded fix on work/ink-cloud-002
→ DEV_HANDOFF
→ MR_REVIEW
```

No merge, package update, version promotion or Cloud work is authorized.
