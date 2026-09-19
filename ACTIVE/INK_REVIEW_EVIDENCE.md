# INK REVIEW EVIDENCE — INK-CLOUD-004

STATUS: `MR_REVISE_EVIDENCE`

## Fingerprint

| Field | Value |
|---|---|
| TASK_ID | `INK-CLOUD-004` |
| DEV_BRANCH | `work/ink-cloud-004` |
| REVIEW_HEAD | `479bcca83e0c375592bff6542115b971e88002c7` |
| FORMAT_VERSION_CHANGE | `0` |
| RUNTIME_QA | `DEFERRED` |

## Reviewed source surfaces

MR directly inspected:

- `product/source/src/core/math.js`
- `product/source/src/document/hierarchy.js`
- `product/source/src/editor/bounds.js`
- `product/source/src/editor/transform.js`
- relevant `product/source/src/ink.js` interaction paths
- `product/source/src/history/history.js`
- `qa/core/tests/unit/transform-bounds-coordinate-v0.1.test.mjs`
- `research/INK_TRANSFORM_BOUNDS_COORDINATE_SYSTEM_REPORT_v0.1.md`

## Accepted evidence

The core transform/bounds model is internally coherent for the reviewed paths:

- safe affine inversion helpers;
- deterministic world/local conversion;
- atomic batch transform preflight;
- Frame explicit geometry bounds;
- Group child-derived bounds;
- transform-root selection collapse;
- same-Layer reparent preflight before detach;
- no format-version change.

## Blocking evidence

Current stroke-node interaction starts History before testing whether the object's world matrix is invertible.

When inversion fails, the path returns before creating an interaction and without cancelling History. Since pointer-up sees no interaction, the pending History transaction can remain open.

This is source-visible and does not require browser Runtime reproduction to establish the defect.

## Execution limitation

MR attempted independent repository checkout for local Node execution, but the execution environment could not resolve `github.com`.

Therefore:
- source/static review findings are authoritative for this MR decision;
- DEV-reported executed tests remain DEV evidence;
- MR does not claim independent Node execution;
- browser/runtime remains `RUNTIME_QA_DEFERRED`.
