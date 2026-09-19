# INK DEV PROGRESS

STATUS: `DEV_HANDOFF / MR_REVIEW_REQUIRED / STOP`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-002` |
| AUTHORIZED_SCOPE | `FRAME + NESTED HIERARCHY FOUNDATION` |
| DEV_STATE | `DEV_HANDOFF` |
| MR_GATE | `MR_REVIEW_REQUIRED` |
| DEV_WORK_BRANCH | `work/ink-cloud-002` |
| LATEST_IMPLEMENTATION_COMMIT | `96852539d4e4aa6b9b87283357dfeac405d920e0` |
| IMPLEMENTATION_REPORT_COMMIT | `0091ec9f69a40f6a24f0f8f907fd5650b9879d34` |
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

## DEV handoff — MR revise

```text
TASK_STATUS
DEV_HANDOFF

TASK_ID
INK-CLOUD-002

BRANCH
work/ink-cloud-002

MR_REVIEWED_HEAD
3ff5c61393fe6603e072fa587d954a159d239444

REVISION_COMMITS
6cfc6f4dfeeae48efc50a6991132526c43e0d724  guard Frame operations across Layers
96852539d4e4aa6b9b87283357dfeac405d920e0  add two cross-Layer regression tests
ec9b2a220cd135f71a8409657772d4307907ddf6  record MR revise progress checkpoint
0091ec9f69a40f6a24f0f8f907fd5650b9879d34  update implementation report

FILES_CHANGED_THIS_REVISION
product/source/src/ink.js
qa/core/tests/unit/frame-editor-source-v0.1.test.mjs
research/INK_FRAME_NESTED_HIERARCHY_IMPLEMENTATION_REPORT_v0.1.md
ACTIVE/INK_DEV_PROGRESS.md

CHECKS
PASS — frameSelection() rejects selections spanning multiple Layers
PASS — frameSelection() guard occurs before createFrame/history mutation
PASS — reparentObjectToFrame() rejects source → Frame moves across Layers
PASS — reparentObjectToFrame() guard occurs before history/reparent mutation
PASS — both rejection paths therefore leave hierarchy/transforms unchanged at source level
PASS — two dedicated regression tests added
PASS — revision diff is limited to the four authorized files above
PASS — package/ink-current unchanged
PASS — no main merge by DEV
PASS — no excluded capability introduced

RUNTIME_QA_DEFERRED
Browser interaction/runtime execution remains deferred under the active GitHub Actions quota constraint.

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

The exact final branch HEAD is the GitHub commit produced by this handoff-status update and is reported in the DEV handoff response. A commit cannot embed its own resulting SHA in its own contents.
