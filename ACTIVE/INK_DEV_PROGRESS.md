# INK DEV PROGRESS

STATUS: `DEV_IN_PROGRESS`

| Field | Value |
|---|---|
| CURRENT_TASK_ID | `INK-CLOUD-004` |
| AUTHORIZED_SCOPE | `TRANSFORM / BOUNDS / COORDINATE SYSTEM FOUNDATION` |
| DEV_STATE | `DEV_IN_PROGRESS` |
| MR_GATE | `DEV_IMPLEMENTATION` |
| DEV_WORK_BRANCH | `work/ink-cloud-004` |
| BASE_BRANCH_HEAD_AT_START | `2d68ae4aa5dfdd29f1c1a864ccd3ddff5e96eb43` |
| LATEST_IMPLEMENTATION_COMMIT | `NONE` |
| GITHUB_ACTIONS | `QUOTA_EXHAUSTED` |
| RUNTIME_QA | `DEFERRED` |
| FORMAT_VERSION_CHANGE | `0 / CHANGE_REQUIRES_MR_STOP` |

## Baseline

Accepted INK-CLOUD-003 was promoted to main at:

`d340664cf554755abfa146f607c05c03200e8799`

The authorized work branch was initialized with four control/status commits above that promotion baseline and no product-source mutation.

## Progress log

### Checkpoint 1 — SSOT / transform-bounds source audit

Required SSOT and accepted INK-CLOUD-001 / 002 / 003 reports read.

Bounded audit findings:

- `Matrix.invert()` silently falls back to identity for singular matrices; hierarchy/selection transform operations therefore need an explicit safe-inversion contract.
- `reparentPageObject()` currently detaches the source before deriving the new local matrix, so singular target ancestry must be rejected before mutation.
- selection rendering uses raw selection bounds while transform mutation already collapses ancestor/descendant selections; selection bounds must use the same transform roots.
- Frame world bounds already derive from explicit width/height; Group bounds already derive from children, but these meanings are embedded in renderer-local code rather than an explicit shared bounds taxonomy.
- generic transform width/height fields currently scale the affine matrix. A single Frame needs a bounded geometry-resize path that changes width/height without rewriting child local transforms.
- inverse-dependent hit/stroke-edit paths need safe singular handling.
- negative scale/reflection remains supported; zero/near-zero interactive scale creation needs deterministic handling.

No product/package/main mutation has occurred in this checkpoint.
`FORMAT_VERSION` remains unchanged.

## Current next action

Implement the bounded affine inversion, bounds taxonomy, selection-root, Frame geometry-resize, and singular-safe interaction contracts on this branch only.
