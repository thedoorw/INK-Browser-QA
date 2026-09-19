# INK DEV PROGRESS

STATUS: `DEV_IN_PROGRESS / MR_REVISE_BOUNDED_FIX`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-002` |
| AUTHORIZED_SCOPE | `FRAME + NESTED HIERARCHY FOUNDATION` |
| DEV_STATE | `MR_REVISE_BOUNDED_FIX_APPLIED` |
| MR_GATE | `MR_REVISE` |
| DEV_WORK_BRANCH | `work/ink-cloud-002` |
| LATEST_IMPLEMENTATION_COMMIT | `96852539d4e4aa6b9b87283357dfeac405d920e0` |
| IMPLEMENTATION_REPORT_COMMIT | `34eeeff89c9ed47def8ff76bf63221a0163f62ab` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |

## Progress log

### Checkpoint 1 — Frame hierarchy core

- `339e59cc650abf6c6eda23010e9877cdd3212bd5`
- Added explicit Frame/container schema and hierarchy traversal/reparent model.
- Added world/local transform helpers and hierarchy-aware PageSpatialIndex.
- Extended migration normalization, integrity and semantic traversal.

### Checkpoint 2 — editor integration

- `cb0c4c9a7f6262f060fce183af3f7f7ce99977e9`
- Integrated Frame with renderer bounds, selection, transform, hit-test and existing Layers panel.
- Defined bounded deep selection: normal hit selects Frame; `Alt` hit selects deepest child; nested Layers rows select children.
- Added structural SVG Frame group output.

### Checkpoint 3 — compatibility hardening

- `0733cbd0f3f94ed149b06a6890bf3e9a9b25871d`
- Removed remaining top-level ownership assumptions from nested stroke editing and eraser paths.
- Preserved parent IDs through split/erase.
- Added Frame support to vector-core SVG serializer.

### Checkpoint 4 — regression QA

- `f64d93bd1bb2ce6371508603e69f1406078054b7`
- Frame hierarchy suite: `8/8 PASS`.
- Existing-capability regression suite: `5/5 PASS`.
- Covered Group, InkStore, stylus normalization, editable vector SVG import/export, Repeat stable identity, reparent, history, serialization, spatial and recompute identity.

### Checkpoint 5 — implementation report

- `34eeeff89c9ed47def8ff76bf63221a0163f62ab`
- Created `research/INK_FRAME_NESTED_HIERARCHY_IMPLEMENTATION_REPORT_v0.1.md`.
- Runtime/browser-only acceptance evidence remains `RUNTIME_QA_DEFERRED` per Current Work Order.

### Checkpoint 6 — MR revise cross-Layer guard

- `6cfc6f4dfeeae48efc50a6991132526c43e0d724` — `frameSelection()` now rejects selections spanning multiple Layers; `reparentObjectToFrame()` rejects source → Frame moves across Layers.
- Both guards execute before Frame creation, `HistoryManager` mutation, or `reparentPageObject()`, so rejection does not mutate hierarchy or transforms.
- `96852539d4e4aa6b9b87283357dfeac405d920e0` — added dedicated regression tests for both rejection paths.
- Source/static guard-order verification: `PASS`.
- Revision diff from reviewed HEAD `3ff5c61393fe6603e072fa587d954a159d239444`: only `product/source/src/ink.js` and `qa/core/tests/unit/frame-editor-source-v0.1.test.mjs`.
- Runtime QA remains `RUNTIME_QA_DEFERRED`.

## DEV handoff

```text
TASK_STATUS
DEV_HANDOFF

TASK_ID
INK-CLOUD-002

BRANCH
work/ink-cloud-002

FINAL_HEAD
The exact branch HEAD is the GitHub commit produced by this handoff-status update and is reported in the DEV handoff response. A Git commit cannot embed its own resulting SHA in its own contents.

COMMITS
339e59cc650abf6c6eda23010e9877cdd3212bd5  frame hierarchy core foundation
cb0c4c9a7f6262f060fce183af3f7f7ce99977e9  editor integration
0733cbd0f3f94ed149b06a6890bf3e9a9b25871d  nested compatibility hardening
f64d93bd1bb2ce6371508603e69f1406078054b7  bounded regression coverage
c3ad0f425cba648c4a5c821724cf1f32c97ad4c7  implementation/progress checkpoint
34eeeff89c9ed47def8ff76bf63221a0163f62ab  implementation report

FILES_READ
Required SSOT baseline in ACTIVE/INK_CURRENT_WORK_ORDER.md plus only bounded product/source and QA files needed for INK-CLOUD-002.

FILES_CHANGED
product/source/src/document/hierarchy.js
product/source/src/document/index.js
product/source/src/document/model.js
product/source/src/document/integrity.js
product/source/src/editor/selection.js
product/source/src/editor/transform.js
product/source/src/semantic/semantic-model.js
product/source/src/spatial/page-spatial-index.js
product/source/src/vector/vector-core.js
product/source/src/ink.js
product/source/styles.css
qa/core/tests/unit/frame-hierarchy-v0.1.test.mjs
qa/core/tests/unit/frame-editor-source-v0.1.test.mjs
qa/core/tests/unit/frame-regression-v0.1.test.mjs
research/INK_FRAME_NESTED_HIERARCHY_IMPLEMENTATION_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md
working/WORKING_STATUS.md

CHECKS
PASS — Frame model / ordered child ownership / stable IDs
PASS — world/local transform and world-preserving reparent
PASS — cyclic parenting rejection
PASS — hierarchy-aware bounds/spatial indexing
PASS — History undo/redo structural recovery
PASS — JSON serialization/migration and InkStore save/load
PASS — structural SVG Frame output; no raster flatten
PASS — existing Group normalization
PASS — stylus normalization
PASS — editable vector SVG import/export
PASS — Repeat stable identity / recompute compatibility
PASS — source diff contains no excluded implementation
PASS — package branch not updated
PASS — main not merged by DEV

RUNTIME_QA_DEFERRED
Browser pointer selection / Alt deep selection
Browser move / scale / rotate interaction
Layers-panel visual interaction
Canvas/WebGL visual equivalence for nested Frame contents
Browser project open/save interaction

KNOWN_GAPS
No drag-reparent UX.
Group-internal deep-selection UX is unchanged.
Frame-contained natural-media strokes use recursive renderer rather than top-level stroke-run batching; browser performance evidence deferred.
FLORA-specific mask behavior inside manually nested Frames was not expanded.
Cloud/collaboration/components/flex/grid/guides remain excluded future work.

PRODUCT_SOURCE_MUTATION
BOUNDED / REPORTED

PACKAGE_MUTATION
0

MAIN_MERGE
0

NEXT_ACTION
MR_REVIEW_REQUIRED

STOP
```
