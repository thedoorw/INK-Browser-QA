# INK DEV PROGRESS

STATUS: `DEV_IN_PROGRESS / IMPLEMENTATION_COMPLETE`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-002` |
| AUTHORIZED_SCOPE | `FRAME + NESTED HIERARCHY FOUNDATION` |
| DEV_STATE | `IMPLEMENTATION_AND_QA_COMPLETE` |
| MR_GATE | `REQUIRED_AFTER_HANDOFF` |
| DEV_WORK_BRANCH | `work/ink-cloud-002` |
| LATEST_DEV_COMMIT | `f64d93bd1bb2ce6371508603e69f1406078054b7` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |

## Progress log

DEV implementation is in progress.

All meaningful work is committed to `work/ink-cloud-002`.

### Checkpoint 1 — frame hierarchy core

- Commit: `339e59cc650abf6c6eda23010e9877cdd3212bd5`
- Added explicit Frame/container model and hierarchy traversal/reparent utilities.
- Added world/local transform helpers and hierarchy-aware PageSpatialIndex support.
- Extended document normalization/integrity and semantic traversal for Frame children.
- Added focused unit evidence for migration, stable IDs/parent ownership, world-space reparent preservation, cycle rejection, nested spatial indexing, history undo/redo, serialization and recompute identity.
- Local source/unit-style check: 8 focused cases passed in the development environment; repository test file contains the 7 non-SVG core cases committed in this checkpoint.
- Browser/Runtime evidence remains `RUNTIME_QA_DEFERRED` per Work Order.

Hosted Runtime QA is temporarily unavailable because GitHub Actions quota is exhausted. DEV must record source/static checks performed and list unexecuted browser/Runtime checks as `RUNTIME_QA_DEFERRED`.

### Checkpoint 2 — editor integration

- Commit: `cb0c4c9a7f6262f060fce183af3f7f7ce99977e9`
- Connected Frame hierarchy to renderer bounds, PageSpatialIndex callbacks, selection transforms, hit-test and existing Layers panel.
- Bounded deep-selection interaction: normal canvas hit resolves the Frame container; `Alt` hit resolves the deepest selectable child; nested Layers rows directly select children.
- Frame export is a structural SVG group; content is not raster-flattened.
- Existing layer rows/reorder/visibility/lock remain in place.

### Checkpoint 3 — compatibility hardening

- Commit: `0733cbd0f3f94ed149b06a6890bf3e9a9b25871d`
- Removed remaining top-level assumptions in nested stroke edit, node/handle geometry and eraser paths.
- Added hierarchy compatibility alias for existing object-index callers.
- Preserved nested parent IDs when splitting/erasing strokes.
- Added Frame support to vector-core SVG serialization.

### Checkpoint 4 — bounded regression coverage

- Commit: `f64d93bd1bb2ce6371508603e69f1406078054b7`
- Added regression coverage for existing Group normalization, InkStore save/load, stylus normalization, editable vector SVG import/export and deterministic Repeat identity.
- Local non-browser checks executed:
  - Frame hierarchy focused suite: `8/8 PASS`.
  - Existing-capability regression suite: `5/5 PASS`.
- Source scan: no remaining `found.layer.objects`, `found.index`, `item.layer.objects`, or `M.invert(found.object.matrix)` assumptions in current `ink.js`.
- Branch diff from pre-DEV control head contains only authorized `product/source/**`, bounded QA, and required progress/status files.
- Browser pointer/render interaction remains `RUNTIME_QA_DEFERRED` under the Work Order's temporary Actions constraint.

Finish with:

```text
TASK_STATUS
TASK_ID
BRANCH
FINAL_HEAD
COMMITS
FILES_READ
FILES_CHANGED
CHECKS
RUNTIME_QA_DEFERRED
KNOWN_GAPS
PRODUCT_SOURCE_MUTATION
PACKAGE_MUTATION
MAIN_MERGE
NEXT_ACTION
STOP
```
